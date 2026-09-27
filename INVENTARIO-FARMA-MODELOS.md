# Inventário — Modelos de IA que Engrandecem uma Farmacêutica
### Hugging Face + ModelScope · verificado em 27/09/2026 · para o nó farmacêutico gn9
*Downloads verificados via API pública do Hugging Face. ModelScope: a API de busca pública não filtra por termo neste endpoint — os itens citados do ModelScope são os espelhados/verificáveis no HF.*

---

## A tese

Uma farmacêutica (Cimed à frente) valoriza IA em quatro ativos: **descobrir mais rápido, desenvolver com menos erro, produzir com menos perda e provar tudo que afirma**. O ecossistema aberto cobre as três primeiras; a quarta é o nosso diferencial. A jogada é oferecer a **cadeia inteira soberana** — da molécula à farmacovigilância — no nó gn9.

## 0. O coração do nó: **Baichuan-M3-235B**

O modelo que **já roda na nossa frota hoje** (m3-va · 4× L20 · Virgínia · verificado ao vivo em 27/09) e é a peça central do nó farmacêutico — não uma nota de rodapé do ecossistema:

- **MoE 235B/A22B · GPTQ-INT4 (124,5 GB) · Apache-2.0** — repo oficial `baichuan-inc/Baichuan-M3-235B-GPTQ-INT4` (jan/2026)
- **Supera o GPT-5.2 no HealthBench** · Fact-Aware RL: treinado para ancorar afirmação em fonte
- Papel na farmacêutica: **farmacovigilância e informação médica com citação** — a resposta do M3 sobre o próprio valor dele (ao vivo, agora): *"Um modelo médico que cita fontes é essencial para a farmacovigilância porque garante transparência, rastreabilidade e confiabilidade nas decisões baseadas em evidências..."*
- É o modelo que **ganhou o benchmark clínico cego** na nossa avaliação, e o mesmo que atende os 8 portais em produção
- No nó gn9: 124,5 GB dos 192 GB — a excelência; os modelos científicos da tabela abaixo entram ao lado dele

## 1. Descoberta e desenho molecular

| Modelo | O que faz | Evidência (HF) |
|---|---|---|
| **facebook/esm2** (8M→3B, destaque t33_650M) | Modelo de linguagem de proteínas: estrutura, função, mutações, alvo (target) | **2,3 milhões de downloads** — o padrão da indústria |
| **DeepChem/ChemBERTa-77M-MTR** | Representação molecular (SMILES) para propriedades e triagem | 125 mil dl |
| **seyonec/ChemBERTa-zinc** | Pré-treino em ZINC (bilhões de moléculas) | 142 mil dl |
| **ibm-research/MoLFormer-XL** | Propriedades físico-químicas em escala; MoLFormer-c3-1.1B | 199 mil dl |
| **dptech/Uni-Mol-Models / Uni-Mol2** | Representação 3D universal de moléculas (DP Technology, a referência chinesa) | verificado no HF |
| **OneScience-Group/DiffDock** | Docking alvo-fármaco por difusão — triagem virtual | referência SOTA |
| **ncfrey/ChemGPT-1.2B** | Geração de moléculas candidatas (SMILES) | 1,7 mil dl |
| **laituan245/MolT5** | Molecule↔texto: descrever molécula em linguagem natural e vice-versa | 2,9 mil dl |

## 2. Desenvolvimento pré-clínico (ADMET · tox · solubilidade)

| Modelo | O que faz |
|---|---|
| **sagawa/ReactionT5v2-retrosynthesis** (3 mil dl) | **Retrossíntese: planejar a rota de produção de uma molécula** — ponte direta descoberta→produção |
| jiosephlee (série context-conditioned transfer) | BBB (barreira hematoencefálica) e biodisponibilidade humana |
| ML4chemistry/Toxicity_Prediction_Ames | Mutagenicidade (teste de Ames) in silico |
| QizhiPei/biot5 / ibm-research protein_solubility | Solubilidade de proteína/fármaco |
| **HuatuoGPT-3 (9B/27B)** | LLM médico chinês de ponta — raciocínio clínico para a fase translacional |
| knowledgator/SMILES2IUPAC | Nomenclatura IUPAC ↔ estrutura — documentação regulatória |

## 3. Produção e manufatura

- **Retrossíntese (ReactionT5v2)** é o gancho de produção: rota sintética, rendimento, otimização
- **QC visual de comprimidos/blister**: sem modelo dominante aberto — **oportunidade própria**: fine-tune do nosso MedGemma-27B (visão) para inspeção de defeito em linha — a Cimed ganha algo que não existe pronto
- HunyuanOCR (já na frota): leitura de lotes, validade, bula impressa

## 4. Regulatório, farmacovigilância e informação médica — o nosso território

| Modelo | O que faz | Evidência |
|---|---|---|
| **emilyalsentzer/Bio_ClinicalBERT** | NLP clínico de notas médicas — triagem de eventos adversos | **2,2 milhões de downloads** |
| **dmis-lab/biobert-v1.1** | Mineração de literatura biomédica | 142 mil dl |
| Nossa stack: **Baichuan-M3 (ver seção 0) + Granite-Guardian + MedGemma-4B** + RAGMed (bulas/PCDT) | Informação médica com **citação de bula**, farmacovigilância com trilha de auditoria de 6 camadas | benchmark clínico cego, 8 portais em produção |

## Como cabe no nó (ecs.gn9i-2x · 2× RTX PRO 6000 · 192GB)

- **M3-235B GPTQ-INT4** (124,5GB, TP=2) + **Guardian** (9GB) + **MedGemma-4B** (7GB) — a camada regulada, ~141GB
- O **stack científico é leve e complementar**: ESM2-650M (~2,5GB), ChemBERTa-77M, MoLFormer-XL, ReactionT5, Bio_ClinicalBERT — todos juntos < 15GB: cabem no mesmo nó ao lado da camada regulada
- DiffDock/Uni-Mol2 (GPU-heavy) e geração molecular em lote: segundo gn9i quando houver demanda de descoberta — o desenho escala horizontal

## A frase para o Adibe

*"Da molécula à farmacovigilância, um único nó soberano: os modelos científicos que o mundo usa (ESM2, ChemBERTa, retrossíntese), a informação médica que cita bula, e tudo rodando no seu datacenter, com trilha de auditoria em cada resposta."*

---
*Fontes: API pública do Hugging Face (downloads em 27/09/2026, busca por domínio); ModelScope consultado — API de busca sem filtro funcional neste endpoint, itens chineses verificados via espelho HF. Preços do nó gn9 medidos via `aliyun ecs DescribePrice` (us-east-1, on-demand).*
