# 🧬 Integração: Modelos Médicos + GLM — Respostas Positivas

## 🎯 Estratégia: Ensemble Médico (MoE Manual)

O GLM-4.7-Flash/5.3-Flash **não é médico**, mas quando combinado com MedGemma gera **respostas médicas corretas + bem explicadas em PT-BR**.

### Arquitetura de Integração:

```
PERGUNTA MÉDICA (PT-BR)
    │
    ├──→ 1. MedGemma-27B (diagnóstico clínico)
    │      → "Anemia ferropriva. Hb 10g/dL, VCM 80fL..."
    │
    ├──→ 2. BioMistral-7B (validação biomédica)
    │      → Confirma: "Microcítica hipocrômica = ferro"
    │
    ├──→ 3. BioLORD (RAG retrieval)
    │      → Busca guidelines, artigos PubMed relevantes
    │
    └──→ 4. GLM-4.7-Flash (síntese final PT-BR)
           → "Baseado na análise: você tem anemia por
              falta de ferro. Recomenda-se ferro sulfato
              300mg + investigar causa (sangramento oculto)..."
```

## 📋 Prompt Template de Integração

```python
SYSTEM_PROMPT = """Você é um assistente médico especializado.
Você recebeu análises de múltiplos modelos de IA médica.
Sintetize tudo em uma resposta clara em PORTUGUÊS do Brasil.

REGRAS:
1. Sempre cite qual modelo gerou cada parte
2. Se houver conflito, priorize o MedGemma-27B
3. Inclua disclaimer médico
4. Use linguagem acessível ao paciente
5. Sugira próximos passos (exames, médico especialista)
"""

def integrar_respostas(pergunta, diag_medgemma, validacao_biomed, rag_contexto):
    prompt_final = f"""
PERGUNTA DO PACIENTE: {pergunta}

ANÁLISE CLÍNICA (MedGemma-27B):
{diag_medgemma}

VALIDAÇÃO BIOMÉDICA (BioMistral-7B):
{validacao_biomed}

EVIDÊNCIAS (RAG/PubMed via BioLORD):
{rag_contexto}

Sintetize uma resposta completa em PT-BR.
"""
    return chamar_glm_47_flash(prompt_final)
```

## 🔧 Código de Implementação (vLLM + API)

```python
import httpx

# Endpoints da GPU Hostinger (vLLM)
VLLM_MEDGEMMA = "http://gpu-hostinger:8000/v1"  # MedGemma-27B
VLLM_BIOMISTRAL = "http://gpu-hostinger:8003/v1"  # BioMistral-7B
VLLM_GLM = "http://gpu-hostinger:8001/v1"  # GLM-4.7-Flash

async def consulta_medica(pergunta: str) -> dict:
    async with httpx.AsyncClient(timeout=120) as client:
        # 1. MedGemma faz diagnóstico
        diag = await client.post(f"{VLLM_MEDGEMMA}/chat/completions", json={
            "model": "medgemma-27b-it",
            "messages": [{"role": "system", "content": "Você é um médico diagnosticador. Responda em inglês técnico."},
                          {"role": "user", "content": pergunta}],
            "temperature": 0.3,
            "max_tokens": 1024
        })

        # 2. BioMistral valida
        validacao = await client.post(f"{VLLM_BIOMISTRAL}/chat/completions", json={
            "model": "biomistral-7b",
            "messages": [{"role": "system", "content": "Valide o diagnóstico abaixo. Confirme ou corrija.",
                          "role": "user", "content": f"Diagnóstico: {diag.json()['choices'][0]['message']['content']}\n\nPergunta: {pergunta}"}],
            "temperature": 0.2,
            "max_tokens": 512
        })

        # 3. GLM-4.7 sintetiza em PT-BR
        resposta_final = await client.post(f"{VLLM_GLM}/chat/completions", json={
            "model": "glm-4.7-flash",
            "messages": [
                {"role": "system", "content": "Sintetize as análises médicas em PT-BR claro e preciso. Inclua disclaimer."},
                {"role": "user", "content": f"""
Pergunta: {pergunta}
Diagnóstico técnico: {diag.json()['choices'][0]['message']['content']}
Validação: {validacao.json()['choices'][0]['message']['content']}
"""}
            ],
            "temperature": 0.4,
            "max_tokens": 2048
        })

        return {
            "diagnostico": diag.json()['choices'][0]['message']['content'],
            "validacao": validacao.json()['choices'][0]['message']['content'],
            "resposta_ptbr": resposta_final.json()['choices'][0]['message']['content']
        }
```

## 📊 Por que essa integração funciona:

| Problema | Solução |
|----------|---------|
| MedGemma responde em inglês | GLM traduz para PT-BR |
| MedGemma é técnico demais | GLM simplifica para o paciente |
| GLM não é médico | MedGemma garante acurácia clínica |
| GLM alucina em medicina | BioMistral valida factualidade |
| Falta contexto (guidelines) | BioLORD RAG traz evidências |

## 🎯 Resultado: "Respostas Positivas"

O GLM sozinho dá respostas genéricas. **Com MedGemma + BioMistral**, o GLM tem:
- ✅ **Acurácia clínica** (do MedGemma)
- ✅ **Validação biomédica** (do BioMistral)
- ✅ **Evidências** (do RAG/BioLORD)
- ✅ **Linguagem perfeita PT-BR** (do GLM-4.7)

Isso gera respostas que são **corretas + compreensíveis + contextualizadas**.
