# 04 — Áudio e Transcrição

Papers que fundamentam a captura de consulta da stack: `openai/whisper-large-v3-turbo` (transcrição) + `pyannote/speaker-diarization-3.1` (separação de falantes médico/paciente), incluindo o paper de gestão de risco de alucinação (auditoria).

Verificados por fetch em 07/09/2026. Comentários em PT-BR; títulos em inglês.

---

### Robust Speech Recognition via Large-Scale Weak Supervision (Whisper)
- **Autores:** Radford et al. (OpenAI)
- **Veículo/Ano:** arXiv 2022
- **Link:** https://arxiv.org/abs/2212.04356
- **Modelo que apoia:** `openai/whisper-large-v3-turbo` (o card oficial do modelo no HuggingFace cita exatamente este paper)
- **Por que importa:** ASR treinado com supervisão fraca em **680.000 horas** de áudio multilíngue e multitarefa; em regime **zero-shot** (sem fine-tuning) compete com sistemas totalmente supervisionados e se aproxima da robustez e acurácia humanas — a fundação científica da transcrição de consultas em PT-BR (o large-v3-turbo é a variante otimizada para inferência barata, com o mesmo treinamento-família).

### WhisperX: Time-Accurate Speech Transcription of Long-Form Audio
- **Autores:** Bain et al. (University of Oxford)
- **Veículo/Ano:** Interspeech 2023 / arXiv 2023
- **Link:** https://arxiv.org/abs/2303.00747 (DOI 10.21437/interspeech.2023-78)
- **Modelo que apoia:** arquitetura da stack de transcrição (Whisper + VAD + alinhamento fonético forçado — é o padrão de facto para rodar Whisper em produção)
- **Por que importa:** resolve os problemas clássicos do Whisper em áudio longo (deriva, **alucinação e repetição** em janelas deslizantes) com a estratégia VAD *Cut & Merge* + alinhamento fonético forçado: **timestamps no nível de palavra**, desempenho state-of-the-art em transcrição longa e **12× de aceleração** com inferência em batch — exatamente o que uma consulta de 30–60 min exige.

### pyannote.audio 2.1 speaker diarization pipeline: principle, benchmark, and recipe
- **Autores:** Bredin (pyannote.ai)
- **Veículo/Ano:** Interspeech 2023
- **Link:** https://doi.org/10.21437/interspeech.2023-105 (https://hal.science/hal-04247212)
- **Modelo que apoia:** `pyannote/speaker-diarization-3.1` (citação oficial nº 1 do projeto pyannote.audio para o pipeline de diarização)
- **Por que importa:** descreve o princípio, o benchmark e a "receita" do pipeline de diarização (segmentação neural + clustering) que a família 2.1/3.x usa em produção — é o paper que o projeto pede que se cite ao usar o speaker-diarization-3.1. Define "quem falou quando", separando médico e paciente no transcripto da consulta.

### Powerset multi-class cross entropy loss for neural speaker diarization
- **Autores:** Plaquet & Bredin (pyannote)
- **Veículo/Ano:** Interspeech 2023
- **Link:** https://arxiv.org/abs/2310.13025 (DOI 10.21437/interspeech.2023-205)
- **Modelo que apoia:** `pyannote/speaker-diarization-3.1` (citação oficial nº 2 do projeto; perda usada no treinamento do segmentador da geração 3.x)
- **Por que importa:** reformula a diarização como classificação **powerset multi-classe** (classes dedicadas a pares de falantes sobrepostos) em vez de multi-rótulo por frame; em 9 benchmarks leva a desempenho significativamente melhor, sobretudo em **fala sobreposta** — menos trocas de rótulo médico/paciente em consultas com interrupções.

### Careless Whisper: Speech-to-Text Hallucination Harms
- **Autores:** Koenecke et al. (Cornell University)
- **Veículo/Ano:** ACM Conference on Fairness, Accountability, and Transparency (FAccT), 2024
- **Link:** https://doi.org/10.1145/3630106.3658996
- **Modelo que apoia:** gestão de risco do `whisper-large-v3-turbo` em transcrição clínica
- **Por que importa:** documenta sistematicamente **alucinações graves do Whisper** (de invenções a conteúdo ofensivo/violento), com taxa maior em grupos com acentos pouco representados e em fala não fluente — p.ex. ~40% das pausas de falantes com afasia viraram alucinação no estudo. É o paper que justifica o controle de qualidade do fluxo drhealth (revisão humana, VAD, threshold de confiança) e a avaliação dedicada a PT-BR — argumento de maturidade para auditoria hospitalar.

---

## Referências complementares (verificadas, sem entrada própria)

- **Lyu et al.**, "Real-time multilingual speech recognition and speaker diarization system based on Whisper segmentation" — *PeerJ Computer Science*, 2024 — DOI 10.7717/peerj-cs.1973. Sistema tempo real combinando Whisper + diarização (referência de integração da stack).
- **Estudo de disparidades de ASR**, "Decoding disparities: evaluating automatic speech recognition system performance in transcribing Black and White patient verbal communication with nurses in home healthcare" — *JAMIA Open*, 2024 — DOI 10.1093/jamiaopen/ooae130. Risco de disparidade por acento/variedade linguística — reforça a validação PT-BR antes de uso clínico.
- **PT-BR médico:** a validação de sotaque/vocabulário clínico brasileiro é trabalho interno da BeansTech (projeto `whisper-medical-ptbr`), a ser documentado com WER próprio em conjunto com os papers acima.
- **Nota:** o modelo `pyannote/speaker-diarization-3.1` exige aceitar as condições de uso no HuggingFace e rodar localmente — sem tráfego de áudio para terceiros (alinhado à premissa self-hosted/LGPD do drhealth.tech).
