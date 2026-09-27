# Parecer — Bases jurídicas para processamento em GPU Singapura

BeansTech Health · 2026-09-16 · Para revisão do dept. jurídico
**Escopo:** processamento de texto clínico desidentificado em GPUs da Alibaba Cloud Singapura (ap-southeast-1), enquanto a infraestrutura brasileira de GPU é montada.

---

## 1. Enquadramento dos dados que atravessam a fronteira

**O que sai do Brasil:** texto clínico (sintomas, diagnósticos, condutas) **sem identificadores pessoais** — CPF, nome, telefone, e-mail, datas de nascimento, endereço e registro são removidos em São Paulo (medpubr) antes do envio.

**O que isso muda juridicamente:** o dado que atravessa o oceano é uma descrição clínica sem identificação direta. Aplica-se:

- **LGPD art. 12, §2º:** dados pseudonimizados continuam sendo dado pessoal se houver possibilidade de reidentificação com esforço razoável. O envio de texto clínico desidentificado **sem chave de reidentificação** aproxima-se da anonimização parcial, mas **não assume como anônimo** — trata como dado pessoal pseudonimizado com risco reduzido.
- **LGPD art. 11:** dados sensíveis de saúde exigem justificativa de necessidade + garantias reforçadas. O texto desidentificado continua sendo dado sensível.

**Conclusão:** o processamento em Singapura é **transferência internacional de dado pessoal sensível pseudonimizado**, sujeita ao art. 33 LGPD — mas com risco substancialmente reduzido pela desidentificação prévia.

---

## 2. Base legal da transferência (art. 33, V + art. 34 LGPD)

**Hipótese aplicável: contrato entre controlador e operador** (art. 34, I) com cláusulas contratuais padrão, enquanto a ANPD não publica os modelos definitivos.

| Camada | Documento | Status |
|---|---|---|
| 1 | Contrato de serviços Alibaba Cloud (assinado) | ✅ existe |
| 2 | Data Processing Addendum (DPA) da Alibaba | ✅ disponível no console; revisar escopo |
| 3 | SCC ANPD (Resolução CD/ANPD 19/2024) | ⚔ pendente publicação do modelo; usar referência GDPR |
| 4 | DPA BeansTech ↔ hospital (controlador ↔ operador) | **a redigir** |
| 5 | Registro de operações (art. 37) | **a criar** |
| 6 | RIPD (art. 5º, XVII) | **a criar** |

**Cadeia de responsabilidade:**
```
Paciente → Hospital (controlador)
              → BeansTech (operador)
                    → medpubr [SP]: remove PII
                    → elite-health/2 [SG]: processa texto desidentificado (suboperador)
```
BeansTech é **operador** face ao hospital; a Alibaba Cloud é **suboperador** face à BeansTech (ou processadora — depende do DPA).

---

## 3. Por que Singapura tem grau de proteção adequado

Argumentos para o RIPD:

1. **Alibaba Cloud SG tem certificações independentes:**
   - ISO/IEC 27001 (segurança da informação)
   - ISO/IEC 27017 (segurança em nuvem)
   - ISO/IEC 27018 (proteção de PII em nuvem pública)
   - ISO/IEC 27701 (gestão de privacidade)
   - SOC 2 Type II
   - Singapore MTCS Level 3 (nível máximo)
   - CSA STAR

2. **Jurisdição de Singapura, não da China:** dados processados em ap-southeast-1 estão sob a Personal Data Protection Act (PDPA) de Singapura. A PIPL (China) **não se aplica automaticamente** a dados processados em Singapura. Singapura tem regime de rule of law independente.

3. **A Alibaba tem DPA padrão com cláusulas:**
   - Confidencialidade
   - Proibição de uso para fins próprios
   - Subprocessamento somente com autorização
   - Notificação de violação de dados
   - Localização de dados especificada
   - Retorno/exclusão ao término

4. **Medidas técnicas já implementadas (verificáveis):**
   - PII removida antes do envio (medpubr, em São Paulo)
   - TLS entre Brasil e Singapura
   - Bearer token obrigatório
   - Sem acesso remoto às GPUs sem o security group
   - Logs versionados no OSS (Brasil), sem permissão de delete
   - Sem armazenamento persistente do texto em Singapura (processamento em memória)

---

## 4. Mitigações para o período de transição (até GPUs no Brasil)

| # | Medida | Prazo | Status |
|---|---|---|---|
| 1 | **PII removida em SP antes do envio** | já | ✅ medpubr ativo |
| 2 | **TLS + token em todas as conexões** | já | ✅ router Ollama + vLLM |
| 3 | **Logs de auditoria em SP (não SG)** | já | ✅ OSS versionado |
| 4 | **Zero armazenamento em SG** | já | ✅ processamento em memória (vLLM/Ollama) |
| 5 | **DPA BeansTech ↔ Alibaba** | 30 dias | revisar |
| 6 | **DPA BeansTech ↔ hospital (template)** | 30 dias | redigir |
| 7 | **RIPD com análise de risco da transferência** | 30 dias | redigir |
| 8 | **Registro de operações (art. 37)** | 30 dias | criar |
| 9 | **Contrato de revelação de sigilo (CFM art. 88 CE)** | junto com 6 | incluir cláusula |
| 10 | **Migração para GPU em SP quando disponível** | quando gn8is sair em sa-east-1 | monitorar |
| 11 | **Avaliação de alternativa: só Virgínia/SG para modelo > 48 GB** | contínuo | AntAngelMed/M3 não cabem em 2×L20 |

**Cronograma de saída:** quando a Alibaba oferecer `gn7i` ou `gn8is` em sa-east-1 (não existe hoje — verificado por API), os modelos clínicos migram para o Brasil e a transferência internacional cessa. Até lá, o processamento em SG é temporário, justificado pela indisponibilidade de GPU médica no Brasil.

---

## 5. Cláusulas essenciais para o DPA BeansTech ↔ Hospital

```
CLÁUSULA N — SUBPROCESSAMENTO INTERNACIONAL
a) O Operador (BeansTech) utiliza subprocessador em Singapura (Alibaba Cloud
   Singapore) exclusivamente para inferência de modelos de linguagem;
b) O texto enviado ao subprocessador é previamente desidentificado em
   território nacional, mediante remoção de identificadores pessoais
   (nome, CPF, telefone, e-mail, datas, endereço, registro);
c) O subprocessador não armazena o dado — o processamento é em memória
   e o resultado retorna em tempo real;
d) O Operador mantém registro de todas as requisições e respostas
   (art. 37 LGPD) em território nacional;
e) O subprocessador está certificado ISO 27001/27017/27018/27701 e
   SOC 2, sob jurisdição da Personal Data Protection Act de Singapura;
f) O Operador notificará o Controlador em até 48 horas sobre qualquer
   incidente de segurança envolvendo o subprocessador;
g) Esta condição é transitória: o Operador compromete-se a migrar o
   processamento para infraestrutura em território nacional quando
   tecnicamente disponível, no prazo máximo de [12] meses.
```

**Cláusula adicional (sigilo profissional):**
```
CLÁUSULA N+1 — SIGILO PROFISSIONAL (CFM)
a) As partes reconhecem que o dado clínico é protegido por sigilo
   profissional (art. 154 CP; CFM Resolução 1.821/2007);
b) O Operador aplica as mesmas garantias de sigilo aplicáveis ao
   Controlador, incluindo seus subprocessadores;
c) O texto desidentificado enviado ao subprocessador não contém
   informações que permitam identificação do paciente.
```

---

## 6. Respostas às perguntas que a instituição vai fazer

**"O dado do meu paciente vai para a China?"**
Não. Vai para Singapura, jurisdição independente com PDPA. A Alibaba Cloud Singapore é operada por entidade de Singapura, não pela matriz chinesa. Os dados estão sob lei de Singapura, não da China.

**"Quem vê o texto?"**
Nenhum humano. O texto desidentificado é processado por um modelo de IA em memória. O resultado retorna automaticamente. Não há armazenamento persistente em Singapura.

**"O que acontece se a Alibaba for hackeada?"**
O texto desidentificado não permite reidentificação sem a chave (que fica no Brasil). O impacto é limitado ao conteúdo clínico sem identificadores. A certificação ISO 27001 e o SOC 2 atestam o nível de segurança.

**"O modelo aprende com o dado do meu paciente?"**
Não. Os modelos de inferência (vLLM, Ollama) rodam em modo "generação", não "treinamento". Nenhum dado de paciente é usado para treinar modelo. Os modelos são pré-treinados em datasets públicos.

**"Quando o dado volta para o Brasil?"**
O dado nunca "está" em Singapura permanentemente. O texto entra em memória, o modelo gera a resposta, a resposta sai. Logs de auditoria ficam em São Paulo (OSS). Nada persiste em Singapura.

---

## 7. Opção conservadora: processar tudo no Brasil (se a instituição exigir)

Se uma instituição recusar qualquer processamento fora do país, a arquitetura suporta:

- **medgemma:27B na elite-health** → mover para uma ECS em sa-east-1 quando disponível (hoje não há gn8is em SP — verificado)
- **M3 e AntAngelMed** → não cabem em GPUs disponíveis em SP; substituir por Model Studio (qwen-max/GLM via API, dados em Singapura também, mas com DPA da Alibaba e sem GPU dedicada)
- **Ou processar via Model Studio apenas** (API de Singapura, sem infraestrutura própria) — mesma questão jurídica, sem a vantagem do controle

**A transferência internacional não é evitável** enquanto a Alibaba não oferecer GPU em São Paulo. A diferença entre API e GPU própria é o nível de controle — a GPU própria tem controle total (logs, tokens, security groups), a API tem contrato.

---

## 8. Checklist para o advogado (você)

- [ ] Revisar o DPA da Alibaba Cloud no console (Account → Compliance → DPA)
- [ ] Redigir o template de DPA BeansTech ↔ Hospital (com as cláusulas 5 acima)
- [ ] Criar o RIPD (Relatório de Impacto à Proteção de Dados) — template da ANPD
- [ ] Criar o registro de operações (art. 37) — a base já existe no OSS/logs
- [ ] Verificar se o contrato de serviços da Alibaba já tem as cláusulas de subprocessamento
- [ ] Monitorar a oferta de GPU em sa-east-1 (a migração resolve tudo)
- [ ] Incluir a transferência internacional no contrato de parceria com Einstein/Rede D'Or/Notre Dame

---

*Elaborado com base na LGPD (Lei 13.709/2018), Resolução CD/ANPD nº 19/2024, PDPA de Singapura, certificações da Alibaba Cloud, e CFM Resolução 1.821/2007. Revisão por advogado responsável é obrigatória antes de uso institucional.*
