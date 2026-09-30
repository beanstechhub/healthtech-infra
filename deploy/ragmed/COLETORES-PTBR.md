# Coletores PT-BR nativos + Evidence-BR (RagMed)

Complemento do `collect_github.sh` / `collect_hf.py`: coletores de **documentos oficiais
brasileiros** para o corpus clínico nativo (não tradução), no mesmo molde dos coletores
do RagJur — manifest auditável, incremental por sha256, sync para o OSS (`sync_oss.sh`).

## Coletores

| Script | Fonte oficial | O que baixa | Status verificado 28/09/2026 |
|---|---|---|---|
| `coletor_sus_protocolos.py` | gov.br/saude → `/assuntos/pcdt` (árvore a–z) | **~300+ PCDT completos em PDF** | ✅ **funcional** — 8 PDFs no teste local, 0 erros |
| `coletor_anvisa_bulas.py` | dados.anvisa.gov.br `/dados/CONSULTAS/` | **catálogos bulk de bulas** (TA_CONSULTA_BULA_DOCUMENTO 14,3 MB · BULA_PRODUTO 1,7 MB · MEDICAMENTOS 17,9 MB · PARECERES) | ✅ **funcional** — 4 CSVs (~34 MB) no teste |
| `coletor_pcdt_conitec.py` | gov.br/conitec (Plone REST `++api++`) | **PDFs de PCDT + relatórios de recomendação** | ✅ **funcional server-side** — 3.757 arquivos no índice, API JSON pública |
| `coletor_cfm_resolucoes.py` | portal.cfm.org.br / sistemas.cfm.org.br | PDFs das resoluções CFM | ⚠ **só via `--seeds`** — ver "Descobertas" abaixo |
| `build_pares_evidence_br.py` | — | transforma chunks ingeridos em **pares de treino com citação obrigatória** | ✅ funcional — gate verbatim testado (1 candidato, 1 reprovado) |

## Descobertas de 28/09 (evitar re-probing)

- `dados.anvisa.gov.br/dados/` é um listing h5ai com hrefs server-side; bulas estão em
  `/dados/CONSULTAS/DOCUMENTOS/` (CSVs `TA_*`). Os **PDFs individuais das bulas** ficam
  atrás do WAF do Bulário Eletrônico (403 p/ cliente não-navegador) — coleta em massa de
  PDF de bula não é viável por lá; os mirrors do `collect_github.sh` (aleckyann/bulario)
  cobrem essa parte.
- **CONITEC é Plone/Volto, não Liferay.** A REST API server-side `++api++` é pública e
  dispensa JS: `@querystring-search` lista 3.757 arquivos PCDT; cada item convertido p/
  `++api++` traz `file.download`. O coletor usa isso direto (sem seeds).
- A árvore PCDT do Ministério da Saúde (`gov.br/saude/pt-br/assuntos/pcdt/{a..z}`) é
  100% server-side: cada protocolo é `/{letra}/{slug}.pdf/view`; o PDF real vem em
  `<url>/@@download/file` (o `fetch_pdf_doc` do `ragmed_common` já resolve esse fallback).
- **CFM não tem fonte server-side automática**: portal.cfm.org.br é WordPress (listagem
  em JS, REST de conteúdo restrita com 401) e os PDFs de `sistemas.cfm.org.br/normas/`
  só são servidos pelo viewer PDF.js — GET direto dá timeout. Por isso `--seeds`.
- `apidadosabertos.saude.gov.br` responde, mas é Swagger-UI em JS sem spec em rota
  padrão — não útil para varredura server-side.

## Contrato comum (`ragmed_common.py`)

- **SSRF guard**: https-only, allowlist de domínios por hop (redirecionamentos revalidados),
  bloqueio de IP não-público/DNS rebinding. Proxies do ambiente são ignorados
  (`RAGMED_PROXY` para sobrescrever).
- **Path guard**: nome de fonte e de arquivo sanitizados; escrita contida em
  `RAGMED_RAW` (padrão `/data/ragmed/raw`).
- **Manifest auditável**: `manifest-ragmed.jsonl` por fonte — url, título, tipo, licença,
  idioma, sha256, bytes, timestamp. Incremental: arquivo com sha idêntico não é regravado.
- **Politeness**: UA identificável (`ragmed.ai/1.0`), pausa configurável (`RAGMED_PAUSE`,
  padrão 2 s), retry com backoff.

## Fluxo de ingestão (igual ao RagJur)

```
coletor → /data/ragmed/raw/<fonte>/ (PDF/CSV + manifest)
        → sync_oss.sh → oss://beanstech-ragmed-corpus/raw (sa-east-1)
        → ingestor: PDF→texto por página (PyMuPDF), chunk por seção
          {"chunk_id","doc_id","fonte","titulo","versao","pagina","url","texto"}
        → Elasticsearch (br-es, índice ragmed)          ← corpus de RECUPERAÇÃO (RAG)
        → build_pares_evidence_br.py → pares candidatos ← corpus de TREINO (fine-tune)
```

## Evidence-BR: o formato do par (citação obrigatória)

Cada par carrega a citação estruturada e o **trecho verbatim** da fonte:

```json
{"par_id": "evbr-e1f4ea38f53009ef",
 "pergunta": "Qual é o esquema terapêutico recomendado para brucelose aguda em adultos?",
 "trecho_original": "O tratamento recomendado para brucelose aguda em adultos combina
   doxiciclina 100 mg duas vezes ao dia por seis semanas com...",
 "resposta": "Doxiciclina 100 mg 2x/dia por 6 semanas + rifampicina 600 mg 1x/dia.",
 "citacao": {"doc_id": "pcdt-brucelose-humana", "fonte": "sus-protocolos",
             "titulo": "PCDT Brucelose Humana", "versao": "2024", "pagina": 12,
             "url": "https://www.gov.br/saude/.../pcdt-brucelose-humana.pdf"},
 "status": "candidato", "revisado_por": null, "reprovado_motivo": null}
```

Dois controles honestos, deliberados:

1. **Gate anti-fabricação**: o `trecho_original` tem de conferir verbatim (normalizado)
   com o chunk de origem; pares que não conferem nascem `reprovados` e nunca entram em
   treino. Sem isso, o fine-tune ensina o modelo a inventar citações — o defeito exato
   que o RAGJur/RagMed combate.
2. **Human-in-the-loop**: todo par nasce `candidato`; só vira treino com
   `revisado_por` preenchido (médico ou revisor treinado). Volume alvo: 2.000–10.000
   pares revisados (o piloto do RAGMED-PORTAIS: 2.000 casos).

Uso com geração assistida de perguntas (Model Studio, token do KMS `DASHSCOPE_API_KEY`):

```bash
DASHSCOPE_API_KEY=$(...) python3 build_pares_evidence_br.py \
  --chunks chunks_ragmed.jsonl --gerar-perguntas --max 500 > pares_candidatos.jsonl
```
