#!/bin/bash
# Série "Frota BeansTech" — 8 vídeos informativos narrados.
# Estrutura: cartela de título (2.5s) → hero Wan (5s) → cartela de fatos (duração da narração) → fecho (3.5s).
# Narração PT-BR sobreposta com fade. Máxima paralelização: as 8 montagens rodam em background.
set -euo pipefail
cd "$(dirname "$0")"
FF=~/bin/ffmpeg
FP=~/bin/ffprobe
F=/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf
FS=/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf
GOLD="#C9963C"
BG="0x0B1420"

title_card() { # $1 out $2 title $3 sub
  echo "$2" > /tmp/st.txt; echo "$3" > /tmp/ss.txt
  $FF -y -loglevel error -f lavfi -i "color=c=$BG:s=1920x1080:r=25:d=2.5" \
    -vf "drawtext=fontfile=$F:textfile=/tmp/st.txt:fontcolor=white:fontsize=84:x=(w-text_w)/2:y=(h-text_h)/2-50,drawtext=fontfile=$FS:textfile=/tmp/ss.txt:fontcolor=$GOLD:fontsize=34:x=(w-text_w)/2:y=(h-text_h)/2+60,fade=t=in:st=0:d=0.5,fade=t=out:st=2:d=0.5,format=yuv420p" \
    -c:v libx264 -preset medium -crf 18 -an "$1"
}

hero_seg() { # $1 out $2 hero.mp4
  $FF -y -loglevel error -i "$2" -vf "fade=t=in:st=0:d=0.5,fade=t=out:st=4.5:d=0.5,format=yuv420p" \
    -c:v libx264 -preset medium -crf 18 -an -r 25 "$1"
}

facts_card() { # $1 out $2 dur $3 título $4.. bullets
  local out=$1 dur=$2 t=$3; shift 3
  local -a dt=()
  local y=300
  dt+=(drawtext=fontfile=$F:text="'$t'":fontcolor=$GOLD:fontsize=40:x=260:y=200)
  local i=0
  for b in "$@"; do
    echo "$b" > /tmp/b$i.txt
    dt+=("drawtext=fontfile=$FS:textfile=/tmp/b$i.txt:fontcolor=white:fontsize=30:x=300:y=$y:line_spacing=14")
    y=$((y+72)); i=$((i+1))
  done
  dt+=(fade=t=in:st=0:d=0.5,fade=t=out:st=$(echo "$dur-0.6"|bc):d=0.6,format=yuv420p)
  $FF -y -loglevel error -f lavfi -i "color=c=$BG:s=1920x1080:r=25:d=$dur" \
    -vf "$(IFS=,; echo "${dt[*]}")" -c:v libx264 -preset medium -crf 18 -an "$out"
  rm -f /tmp/b*.txt
}

close_card() { # $1 out $2 l1 $3 l2
  echo "$2" > /tmp/cl1.txt; echo "$3" > /tmp/cl2.txt
  $FF -y -loglevel error -f lavfi -i "color=c=$BG:s=1920x1080:r=25:d=3.5" \
    -vf "drawtext=fontfile=$F:textfile=/tmp/cl1.txt:fontcolor=$GOLD:fontsize=72:x=(w-text_w)/2:y=(h-text_h)/2-40,drawtext=fontfile=$FS:textfile=/tmp/cl2.txt:fontcolor=0x9AA7B4:fontsize=30:x=(w-text_w)/2:y=(h-text_h)/2+70,fade=t=in:st=0:d=0.5,fade=t=out:st=2.7:d=0.8,format=yuv420p" \
    -c:v libx264 -preset medium -crf 18 -an "$1"
}

build() { # $1=slug $2=title $3=sub $4=hero $5.. bullets
  local v=$1 t=$2 s=$3 h=$4; shift 4
  local AUD; AUD=$($FP -v error -show_entries format=duration -of csv=p=0 narr-$v.wav)
  local FDUR; FDUR=$(echo "scale=2; $AUD - 11 + 0.8" | bc)
  [ "$(echo "$FDUR < 2"|bc)" = 1 ] && FDUR=2
  echo "[$v] áudio ${AUD}s · fatos ${FDUR}s"
  title_card seg-$v-1.mp4 "$t" "$s"
  hero_seg seg-$v-2.mp4 "$h"
  facts_card seg-$v-3.mp4 "$FDUR" "$t" "$@"
  close_card seg-$v-4.mp4 "BeansTech" "provar o que se responde · beanstech.com.br"
  > concat-$v.txt
  for f in seg-$v-*.mp4; do echo "file '$PWD/$f'" >> concat-$v.txt; done
  $FF -y -loglevel error -f concat -safe 0 -i concat-$v.txt -c copy mute-$v.mp4
  local VDUR; VDUR=$($FP -v error -show_entries format=duration -of csv=p=0 mute-$v.mp4)
  $FF -y -loglevel error -i mute-$v.mp4 -i narr-$v.wav \
    -filter_complex "[1:a]adelay=600|600,apad,atrim=0:$VDUR,afade=t=out:st=$(echo "$VDUR-1.2"|bc):d=1.2[a]" \
    -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 192k -shortest beans-$v.mp4
  rm -f seg-$v-*.mp4 mute-$v.mp4 concat-$v.txt
  echo "[$v] OK: beans-$v.mp4 ($($FP -v error -show_entries format=duration -of csv=p=0 beans-$v.mp4)s)"
}

build medicina "MODELOS MÉDICOS" "12 modelos soberanos em produção · GPUs próprios" ../hero-medicina.mp4 \
  "Baichuan-M3 235B — supera GPT-5.2 no HealthBench" \
  "AntAngelMed 100B — o 1º modelo médico aprovado" \
  "MedGemma-27B — visão: RX, dermatologia, oftalmologia" \
  "MedGemma-1.5-4B — triagem onde a internet não chega" \
  "Lingshu-32B e Lingshu-I-8B — exames e imagens" \
  "Baichuan-M2 32B — apoio clínico especialista" \
  "Granite 4.1 + Guardian — verificação e guardião" \
  "6 camadas · fontes citadas · dado nunca sai do Brasil" &

build tokens "TOKENS E API" "duas formas de contratar a frota" hero-tokens.mp4 \
  "Plano de tokens: pacotes mensais, volume incluso" \
  "Preço reduzido — previsibilidade para operar" \
  "Pagamento por API: pague por uso, por token" \
  "Para começar, integrar e escalar por demanda" \
  "Sem lock-in · a mesma frota soberana · LGPD nos dois" &

build granite "FAMÍLIA GRANITE" "IBM · rigô e verificação na cadeia" hero-granite.mp4 \
  "Granite-4.1-30B MoE — síntese e verificação" \
  "Camada 3 das 6 camadas da cadeia" \
  "Granite-Guardian-3B — o guardião da entrada" \
  "Classifica antes de processar · filtra o que não passa" \
  "IBM dentro da frota soberana BeansTech" &

build glm "GLM 5.3 + RAGJUR" "Z.ai · a excelência com a jurisprudência real" hero-glm.mp4 \
  "GLM-5.3-750B — vencedor do benchmark clínico cego" \
  "Detectou a dose excessiva com clearance 28 · citou a fonte" \
  "GLM-5.3 Flash — raciocínio, agentes, código e visão" \
  "Latência e custo de modelo pequeno" \
  "+ RAGJur: 100 milhões de julgados citados na resposta" \
  "Fonte · trilha · tokens contados" &

build qwen "FAMÍLIA QWEN" "Alibaba · uma família inteira no pipeline" hero-qwen.mp4 \
  "Texto — do qwen-plus rápido ao Qwen 3 de ponta" \
  "Visão — Qwen-VL para imagens e OCR" \
  "Voz — a síntese que narra estes vídeos" \
  "Embeddings — os índices dos julgados" \
  "Qwen-Image — geração de imagens" \
  "Wan — geração de vídeo (estes clips)" &

build kimids "KIMI K3 E DEEPSEEK 4" "fronteiras pela mesma API" hero-kimids.mp4 \
  "Kimi K3 (Moonshot) — raciocínio profundo, contexto longo" \
  "DeepSeek 4 Flash — excelência com custo competitivo" \
  "Integrado à cadeia BeansTech" \
  "Faturamento unificado · governança única" &
wait
build compliance "IAs DE COMPLIANCE" "chatvc.beanstech.ai" ../hero-compliance.mp4 \
  "10 modelos soberanos" \
  "Guardião — filtra entrada e saída" \
  "Granite — responde com base legal" \
  "Theia — análise do mundo on-chain" \
  "PLD/FT: 740 instituições obrigadas" \
  "Trilha de auditoria de cada resposta" &

build hy4 "HY4-PREVIEW" "Tencent · 780B MoE" hero-hy4.mp4 \
  "Flagship 780 bilhões de parâmetros MoE" \
  "Entrando na frota em implantação própria" &
wait
ls -la beans-*.mp4
