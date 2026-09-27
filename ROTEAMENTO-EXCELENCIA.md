# Roteamento de Excelência e Segurança
**O mapa completo: qual modelo responde o quê, quanto custa, e onde a segurança entra**
**Atualizado: 27/09/2026 — vigente no ollama-shim (br-apps :8080)**

---

## 1. Tabela de rotas do shim (Ollama-API → vLLM)

| Nome (API) | Host : porta | Modelo servido | Custo (tokens) | Papel |
|---|---|---|---|---|
| `excellence`, `m3`, `baichuan-m3`, `m3-235b` | **m3-va** 47.85.201.160:8000 | Baichuan-M3-235B-INT4 (TP4) | **5** | camada de excelência — raciocínio profundo, verificação clínica |
| `medgemma-27b`, `medgemma:27b` | elite-va 47.85.187.149:8001 | MedGemma-27B (TP4) | 1 | chat clínico principal (motor /decisao) |
| `lingshu-32b` | elite-va :8002 | Lingshu-32B | 1 | segunda opinião clínica multimodal |
| `antangelmed` | elite-va :8000 (TP2) | AntAngelMed | 1 | domínio específico |
| `medgemma-4b`, `medgemma:4b` | flash-va 47.85.207.155:8004 | MedGemma-4B | 1 | chat leve/alta concorrência |
| `granite4.1` | flash-va :8002 | Granite-4.1 | 1 | síntese |
| `granite-guardian`, `granite3-guardian` | flash-va :8003 | Granite-Guardian | 1 | guarda de segurança (PII/proibições) |
| `qwen3-vl`, `lingshu-i` | flash-va :8005 | Lingshu-i-8B | 1 | visão leve |
| `baichuan-m2` | flash-va :8006 | Baichuan-M2 | 1 | domínio médico |
| demais (default) | elite-va :8001 | medgemma-27b | 1 | fallback seguro |

Segredos: `/usr/local/etc/tokens/<NOME>` no br-apps (M3_API_TOKEN, GPU_GATEWAY_TOKEN, GPU2_GATEWAY_TOKEN, ANTMED_API_TOKEN) — carregados no boot dinamicamente a partir das ROUTES.

## 2. A cadeia /decisao (6 camadas anti-alucinação)

```
 pergunta clínica
   │
   ▼
 1. remoção de PII          (antes de qualquer modelo)
   ▼
 2. granite-guardian         flash-va:8003 — bloqueia proibições e conteúdo não-médico
   ▼
 3. síntese                  granite-4.1 / medgemma — estrutura a resposta
   ▼
 4. verificação de citação   fontes ligam a claims; sem fonte = claim não sustentada
   ▼
 5. EXCELÊNCIA               m3-va:8000 — Baichuan-M3-235B revisa e fundamenta
   ▼
 6. trilha de auditoria      registro completo (quem, o quê, com qual modelo, quando)
```

**Regra de ouro do CFM/Parecer**: nenhuma resposta sai sem (a) passar pelo guardião, (b) citação verificável ou abstenção explícita, (c) trilha auditável. A IA pode se recusar; a abstenção é uma resposta válida.

## 3. Políticas de cobrança por camada

- Cliente `bth_*` (tokens): débito no ato do POST, **antes** de proxy — saldo insuficiente = HTTP 402 com custo do modelo e URL de recarga (beansmed.com.br)
- Portal interno (Bearer do shim): sem débito — o custo é da operação
- GET (`/api/tags`, `/api/version`) nunca debita — só POST de inferência

## 4. Segurança de infra (estado atual)

| Camada | Controle |
|---|---|
| Acesso SSH GPUs | SG `btech-blackwell-va`: porta 22 só do br-apps (IP fixo, jump) e do IP dev (dinâmico) |
| vLLM por porta | 8000-8011 só do br-apps (43.118.160.51/32) e dev |
| Venda de tokens | HTTPS (Caddy/HSTS), keys 38 chars aleatórias, admin por token HMAC-comparado |
| Segredos | KMS Singapura (RAM role por host) → `/usr/local/etc/tokens/`, 600, root-only |
| Bypass conhecido | vendas confirmadas manualmente — conciliação automática é o próximo passo |

## 5. Runbook — operações comuns

**Trocar o preço da excelência**: `CUST_COST = {"baichuan-m3": 5}` no `deploy/br-apps/ollama-shim.py` → scp para `/usr/local/bin/` → `systemctl restart ollama-shim`.

**Novo modelo no roteamento**: acrescentar entrada em `ROUTES` (host, porta, nome servido, keyname do token em `/usr/local/etc/tokens/`) → reiniciar shim → probe no `deploy/healthdash/app.py` → rebuild do container.

**Confirmar pagamento manual**: `curl -X POST https://beansmed.com.br/admin/confirm/PDxxxx -H "Authorization: Bearer $(cat /usr/local/etc/tokens/VENDING_ADMIN_TOKEN)"`.

**Dashboard de vendas**: `curl https://beansmed.com.br/admin/stats -H "Authorization: Bearer ..."` — também sondado pelo health.beanstech.com.br.

**Adicionar saldo a uma key** (cortesia/parceria): `sqlite3 /var/lib/tokens-vending/vending.db "UPDATE api_keys SET balance=balance+N WHERE key='bth_...'"`.
