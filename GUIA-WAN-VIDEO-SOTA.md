# Guia Wan — Estado da Arte da Geração de Vídeo (com e sem fala)
### Fontes: manual oficial de prompt da Bailian + catálogo de modelos + validação prática na nossa conta
**Data: 25/09/2026 · Valido para: `bl video` (wan3.0-video) e modelos da família Wan**

---

## 1. O cenário dos modelos (o que existe e quando usar)

| Modelo | Papel | Entradas | Máx | Preço intl (¥/s) |
|---|---|---|---|---|
| **wan3.0-video** | Flagship all-in-one — T2V, I2V, first/last-frame, **referência (pessoas/objetos/estilo)**, **áudio nativo com fala** | Text, Image, Video, Audio, File, Link | 30s · 480/720/1080P | 0,37 / 0,75 / 1,50 |
| **wan3.0-video-prime** | Mesmo modelo, versão rápida (30fps) | idem | 30s · 30fps | idem c/ sobre |
| wan2.6 / wan2.7 | Geração anterior — multishot + referência multi-personagem (`character1`) | Text, Image, Video | 10s | mais barato |
| **wan2.2-s2v** | **Fala dedicada**: foto de pessoa + arquivo de áudio → vídeo da pessoa falando/cantando (lip sync) | Image + Audio | — | 0,5 (480P) / 0,9 (720P) |
| happyhorse-1.1 (i2v/r2v/t2v) | Alternativa leve | — | — | — |
| emo-v1 | Retrato falante expressivo (emoção) | — | — | — |

**Regra prática:** vídeo novo do zero → wan3.0. Vídeo com fala de personagem → wan3.0 com fórmula de som. Fazer uma *pessoa específica* (foto real) falar um áudio já gravado (ex.: narração CosyVoice) → **wan2.2-s2v**. Ajuste fino no estilo → `bl video edit` / VACE.

## 2. As fórmulas oficiais de prompt (o coração do estado da arte)

### Sem fala — básica
**prompt = sujeito + cena + movimento**

### Sem fala — avançada
**prompt = sujeito(descrito) + cena(descrita) + movimento(velocidade/amplitude) + estética(luz/planos/câmera) + estilo(linguagem visual)**

- Estética = fonte de luz, luz ambiente, **plano** (close-up/close/close médio/médio/geral/plano geral), **ângulo** (olho-nível, contra-plongée, plongée), **câmera** (avanço, retrocesso, movimento lateral, pan, grua, follow-shot, static-shot), **composição** (central, dos terços, quadro aberto), lente (telefoto, grande-angular, olho de peixe)
- Estilo = "cinema noir", "documentário", "cores dessaturadas", "fotorealista"

### Imagem → vídeo
**prompt = movimento + operação de câmera** (a imagem já define sujeito/cena/estilo; "static-shot" para travar a câmera)

### COM FALA — fórmula do som (wan3.0/2.7/2.6/2.5)
**prompt = sujeito + cena + movimento + som (voz humana / efeitos sonoros / música)**

**voz humana = fala + emoção + tom + velocidade + timbre + sotaque**
> Exemplo oficial: um homem contando uma piada, ele diz: **"Estude com dedicação"**, tom calmo, ritmo moderado, voz clara, inglês americano.

- **A fala escrita no prompt é preservada pelo modelo** — o personagem fala exatamente aquele texto, com lip sync
- Sem música: escrever **"sem música de fundo"** / "No background music."
- Sem diálogo: **"sem diálogo"** / "No dialogue."
- Se a fala não for descrita, o modelo improvisa

### Multishot (wan3.0/2.7/2.6)
**prompt = descrição geral + nº do shot + carimbo de tempo + conteúdo do shot**
> O 1º shot [0-3s] um menino no canto do playground suspira... O 2º shot [4-6s] corte seco, foco nos olhos... O 3º shot [7-10s] sala de aula...
- Controle total de ritmo, posição e duração por shot — narrativa coerente em um único vídeo
- "shot único" (PT) / "Generate single shot." (EN) para travar em plano único

### Vídeo por referência (wan3.0/2.7)
**prompt = referência + ação + cena + fala (opcional) + música (opcional)**
- Referências como "Imagem 1", "Vídeo 1" (EN) ou "Imagem 1", "Vídeo 1" (PT), numeradas na ordem de upload
- O modelo preserva a identidade do sujeito, o estilo e **até o timbre de voz** (se houver na referência em vídeo)
- Receita no `bl`: `bl video ref --image a.png --image b.png --prompt "Imagem 1 ... Vídeo 1 ..."`

## 3. Otimização automática de prompt

- **`--prompt-extend true`** no `bl video generate` — o sistema expande/reescreve o prompt (melhor p/ prompts curtos e amplos)
- **Otimização via LLM** (receita oficial): dar a fórmula como *system message* para um Qwen e deixar ele expandir o prompt cru — dá pra encadear `bl text chat` → `bl video generate` num pipeline
- **Prompt negativo**: `--negative-prompt` — os problemas clássicos: distorção facial, texturas nebulosas, mãos estranhas, imagens duplas, frames com ruído

## 4. Validado na prática (nossa conta, 25/09/2026)

- wan3.0 com fórmula de som gerou um clip 720P/5s com **trilha de áudio AAC nativa** — médico brasileiro falando em PT-BR "A IA apoia a decisão. A decisão final é sempre sua." (arquivo: `videos/test-wan30-fala.mp4`)
- A geração sem fala dos 4 vídeos institucionais (Wan 1080P + narração externa) segue válida quando se quer **controle total da narração** (CosyVoice/qwen-tts + ffmpeg) — o áudio nativo é melhor quando a fala pertence à cena (personagem), a narração externa é melhor para voz institucional sobre imagens

## 5. Fluxos recomendados (receitas prontas)

**A. Vídeo institucional com narração** (o que já fazemos): Wan T2V para os planos → narração qwen-audio-tts → montagem ffmpeg. Controle total do texto e da voz.

**B. Vídeo com personagem falando** (demo Einstein, avatar): wan3.0 com fórmula de som — a fala sai com lip sync e a cena. Uma frase só, como "A IA apoia a decisão. A decisão é sua."

**C. Uma pessoa específica falando** (ex.: o próprio médico, foto + narração pronta): foto + WAV → **wan2.2-s2v** → vídeo com lip sync. A foto precisa ser frontal, neutra, bem iluminada.

**D. Consistência entre planos**: gerar o personagem/estilo na imagem 1 de referência e reutilizar via `bl video ref` em cada plano — identidade preservada entre clips.

---
*Fontes: `raw/model-user-guide/use-cases/text-to-video-prompt.md` (guia oficial de prompt — fórmulas, dicionário de planos, exemplos com voz humana), `model-list-video-generation/wan3-0-video.md`, `wan3-0-video-prime.md`, `wan2-2-s2v.md` (base de conhecimento bailian-docs-llm-wiki local). Preços: região Singapura (intl), validados 25/09/2026.*
