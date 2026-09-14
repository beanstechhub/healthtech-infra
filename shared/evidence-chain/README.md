# @beanstech/evidence-chain

Uma única lib, server-side, que todos os portais healthtech chamam. Sem dependências (usa `fetch`).

```ts
import { answer, configFromEnv } from "@beanstech/evidence-chain";
export async function POST(req: Request) {
  const { question } = await req.json();
  return Response.json(await answer(configFromEnv(), question, { tenant: "dodr" }));
}
```

As variáveis vêm do `/etc/healthtech/<app>.env` renderizado pelo `kms-env` (RAM role → KMS 3.0). Nenhuma chave em código.

| Camada | Serviço | Onde | Variáveis |
|---|---|---|---|
| 1 Recuperação | Elasticsearch 9.5 (RagJur/RagMed) | ECS `br-es` sa-east-1 | `RAGMED_ES_URL/USER/PASSWORD/INDEX` |
| 2 Síntese | Model Studio (DashScope intl, OpenAI-compatible) | Singapura | `QWEN_BASE_URL/API_KEY/MODEL` |
| 3 Fatos/identidade | PolarDB MySQL 8.0 | sa-east-1 | `AUTH_MYSQL_URL` |
| 4 Segredos | KMS 3.0 alias/btech | ap-southeast-1 | (via `kms-env`) |
| 5 Verificação/robusto | medpubr (BGE-M3, rerank, PII) · GPU medgemma/guardian | `medpubr` BR · `elite-health` SG | `MEDPUBR_URL`, `OLLAMA_BASE_URL/API_KEY/CHAT_MODEL` |

Regra: sem trecho recuperado → `insufficient` e nenhum modelo é chamado. Toda claim passa por `/v1/support`; claims sem suporte são removidas e o caso é escalonado ao especialista GPU apenas como revisão.
