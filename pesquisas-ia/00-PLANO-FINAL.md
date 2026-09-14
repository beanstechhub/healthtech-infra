# 🎯 BeansHealth IA — Plano Final de Deploy Hostinger GPU

## ✅ Respostas às Suas Perguntas

### 1. 📝 Prontuario.tech + Áudio
**Sim, áudio é essencial!** O prontuario.tech já tem `ai-scribe.js` que usa:
- **Whisper PT-BR médico** (fine-tune próprio em `/whisper-medical-ptbr/`)
- Transcrição → formato SOAP (Subjetivo/Objetivo/Avaliação/Plano)
- Pipeline: Áudio → Whisper → MedGemma-1.5-4B (estrutura SOAP) → GLM-4.7 (PT-BR)

### 2. 🌐 GLM-5.3-Flash via API — É melhor que local?
**Sim, para a API (OpenRouter/Nexos.ai) é muito melhor:**
- Local (CPU): 0,2 tokens/s = 10 min/resposta
- API: 1-2 segundos por resposta
- **Mas GLM-4.7-Flash na GPU é ainda melhor** (85-100 t/s + dados no Brasil = LGPD)

### 3. 🖥️ GLM-4.7 cabe bem nas GPUs?
**SIM!** GLM-4.7-Flash (9B ativo MoE):
- RTX 4090 (24GB): ✅ Cabe com folga (5GB VRAM Q4)
- L40S (48GB): ✅ Cabe + outros modelos juntos
- B200 (192GB): ✅ Cabe tudo + GLM-4.6 (357B)

### 4. 📝 Por que não usar MedGemma-1.5-4B?
**Usar SIM!** É a versão mais nova (abril 2025):
- Mais rápido que 27B (3x)
- Boa qualidade (MedQA: 68%)
- Cabe em GPU barata (RTX 4090)
- **Ideal para prontuario.tech, petiq.tech, dodr.ai mobile**

### 5. 🎯 Todas numa GPU só?
**SIM na L40S (48GB):**
- MedGemma-27B (AWQ 16GB) + GLM-4.7 (5GB) + MedGemma-4B (3GB) + BioMistral (4GB) = 28GB
- Sobram 20GB para KV cache → funciona!

### 6. ⚙️ vLLM ou Ollama?
**vLLM para GPU Hostinger!** 10-50x mais rápido. Você já tem scripts em `datasets/scripts/azureml-medgemma-vllm/`.

### 7. 🧬 Integrar médicos + GLM
**Ensemble médico** (já documentado em `05-Integracao-medicos-GLM.md`):
1. MedGemma-27B → diagnóstico técnico
2. BioMistral-7B → validação
3. BioLORD → RAG (evidências PubMed)
4. GLM-4.7 → síntese em PT-BR perfeita

### 8. 🔐 Secrets na Hostinger
- hPanel → "Minhas Senhas" (FTP, banco)
- Coolify → variáveis de ambiente (deploy.env)
- Cloudflare Workers → `wrangler secret put`
- **Não existe Secrets Manager dedicado** (use .env no VPS)

---

## 🚀 Plano de Deploy — 3 GPUs, $5.998

### FASE 1: Dev/Prototipagem (RTX 4090 — 38 créditos/h)
**Duração: 3 dias = $2.736**
- GLM-4.7-Flash (raciocínio)
- MedGemma-1.5-4B (resumo)
- BioMistral-7B (validação)
- Whisper PT-BR (áudio)

### FASE 2: Produção (L40S — 92 créditos/h)
**Duração: 10 dias = $2.208**
- MedGemma-27B-it (diagnóstico + imagem)
- GLM-4.7-Flash (PT-BR)
- BioLORD (embeddings/RAG)
- CheXficient (radiologia)

### FASE 3: Demo Einstein (B200 — 450 créditos/h)
**Duração: 3 horas = $1.350**
- GLM-4.6 (357B) — impressionar com qualidade máxima
- MedGemma-27B — diagnóstico multimodal
- Todos os 14 portais demonstrados

**Total: $5.998 + $5.998 = exato ao saldo!** ✅

---

## 📁 Documentos de Pesquisa Criados

```
/mnt/ARQUIVOS/Projetos/Projetos Ativos/healthtech/pesquisas-ia/
├── 01-GLM-comparacao.md          ← GLM-4.6 vs 4.7 vs 5.3
├── 02-vLLM-vs-Ollama.md           ← vLLM é 10-50x mais rápido
├── 03-Uma-GPU-todos-modelos.md    ← L40S cabe tudo
├── 04-MedGemma-1.5-4B-analise.md ← Por que usar (e quando não)
├── 05-Integracao-medicos-GLM.md   ← Ensemble médico + código
├── 06-Time-IA-inventario.md       ← Todo material das pastas
└── 07-Benchmarks-qualidade-IA.md ← Números de qualidade
```

## 🧠 Time de IA Final Recomendado

| Modelo | Função | GPU | Portal |
|--------|--------|-----|--------|
| **MedGemma-27B-it** | Diagnóstico + imagem | L40S | dodr.ai, drhealth, exame.tech |
| **MedGemma-1.5-4B-it** | Resumo rápido + SOAP | RTX 4090 | prontuario.tech, petiq |
| **GLM-4.7-Flash** | Raciocínio PT-BR + síntese | Ambas | Todos |
| **BioMistral-7B** | Validação biomédica | L40S | exame.tech, prontuario |
| **Whisper PT-BR médico** | Áudio → texto | RTX 4090 | prontuario.tech |
| **BioLORD-2023** | Embeddings/RAG médico | Ambas | Todos |
| **CheXficient** | Raio-X classificação | B200 | exame.tech |
| **OpenMed-PII-434M** | LGPD anonimização | Ambas | prontuario.tech |
| **GLM-4.6 (357B)** | Demo máximo | B200 | beansmed demo |
