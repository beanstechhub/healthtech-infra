#!/bin/bash
# Monta os 4 vídeos de produto (medicina, direito, compliance, proptech) — 1080p25.
# Estrutura: cartela de título → clip hero (Wan) → telas reais com Ken Burns e legenda de URL → cartela final.
# Áudio: narração PT-BR (qwen-audio-3.0-tts) com fade.
set -euo pipefail
cd "$(dirname "$0")"
FF=~/bin/ffmpeg
FP=~/bin/ffprobe
F=/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf
FS=/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf
GOLD="#C9963C"

seg() { # $1 out $2 dur $3 vf-extra
  $FF -y -loglevel error -f lavfi -i "color=c=0x0B1420:s=1920x1080:r=25:d=$2" \
    -vf "$3,fade=t=in:st=0:d=0.5,fade=t=out:st=$(echo "$2-0.5"|bc):d=0.5,format=yuv420p" \
    -c:v libx264 -preset medium -crf 18 -an "$1"
}

title_card() { # $1 out $2 dur $3 title $4 sub
  echo "$3" > /tmp/t.txt; echo "$4" > /tmp/s.txt
  $FF -y -loglevel error -f lavfi -i "color=c=0x0B1420:s=1920x1080:r=25:d=$2" \
    -vf "drawtext=fontfile=$F:textfile=/tmp/t.txt:fontcolor=white:fontsize=120:x=(w-text_w)/2:y=(h-text_h)/2-60,drawtext=fontfile=$FS:textfile=/tmp/s.txt:fontcolor=$GOLD:fontsize=40:x=(w-text_w)/2:y=(h-text_h)/2+70,fade=t=in:st=0:d=0.6,fade=t=out:st=$(echo "$2-0.6"|bc):d=0.6,format=yuv420p" \
    -c:v libx264 -preset medium -crf 18 -an "$1"
}

screen_seg() { # $1 out $2 dur $3 img $4 caption
  echo "$4" > /tmp/c.txt
  $FF -y -loglevel error -loop 1 -framerate 25 -t "$2" -i "$3" \
    -vf "zoompan=z='min(zoom+0.0012,1.25)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=1:s=1920x1080:fps=25,drawtext=fontfile=$FS:textfile=/tmp/c.txt:fontcolor=white:fontsize=34:box=1:boxcolor=0x0B1420@0.85:boxborderw=14:x=(w-text_w)/2:y=h-92,fade=t=in:st=0:d=0.5,fade=t=out:st=$(echo "$2-0.5"|bc):d=0.5,format=yuv420p" \
    -c:v libx264 -preset medium -crf 18 -an "$1"
}

hero_seg() { # $1 out $2 in.mp4
  $FF -y -loglevel error -i "$2" -vf "fade=t=in:st=0:d=0.5,fade=t=out:st=4.5:d=0.5,format=yuv420p" \
    -c:v libx264 -preset medium -crf 18 -an -r 25 "$1"
}

close_card() { # $1 out $2 dur $3 l1 $4 l2 $5 l3
  echo "$3" > /tmp/l1.txt; echo "$4" > /tmp/l2.txt; echo "$5" > /tmp/l3.txt
  $FF -y -loglevel error -f lavfi -i "color=c=0x0B1420:s=1920x1080:r=25:d=$2" \
    -vf "drawtext=fontfile=$F:textfile=/tmp/l1.txt:fontcolor=$GOLD:fontsize=96:x=(w-text_w)/2:y=(h-text_h)/2-110,drawtext=fontfile=$FS:textfile=/tmp/l2.txt:fontcolor=white:fontsize=44:x=(w-text_w)/2:y=(h-text_h)/2+10,drawtext=fontfile=$FS:textfile=/tmp/l3.txt:fontcolor=0x9AA7B4:fontsize=34:x=(w-text_w)/2:y=(h-text_h)/2+120,fade=t=in:st=0:d=0.5,fade=t=out:st=$(echo "$2-0.8"|bc):d=0.8,format=yuv420p" \
    -c:v libx264 -preset medium -crf 18 -an "$1"
}

build() { # $1=vertical $2=audiolen $3..=shots (name|url)
  V=$1; AUD=$2; shift 2
  N=$#
  TDUR=3; HDUR=5; CDUR=5.5
  SDUR=$(echo "scale=2; ($AUD - $TDUR - $HDUR - $CDUR - 0.6) / $N" | bc)
  echo "[$V] áudio ${AUD}s · $N telas × ${SDUR}s"
  title_card "seg-$V-01.mp4" $TDUR "$(echo $V | tr 'a-z' 'A-Z')" "$(cat title-$V.txt)"
  hero_seg "seg-$V-02.mp4" "hero-$V.mp4"
  i=3
  for s in "$@"; do
    img="shots/${s%%|*}.png"; url="${s#*|}"
    screen_seg "seg-$V-0${i}.mp4" $SDUR "$img" "$url"
    i=$((i+1))
  done
  close_card "seg-$V-last.mp4" $CDUR "BeansTech" "$(cat close-$V.txt)" "beanstech.com.br"
  # concat vídeo
  > "concat-$V.txt"
  for f in seg-$V-*.mp4; do echo "file '$PWD/$f'" >> "concat-$V.txt"; done
  $FF -y -loglevel error -f concat -safe 0 -i "concat-$V.txt" -c copy "video-$V-mute.mp4"
  VDUR=$($FP -v error -show_entries format=duration -of csv=p=0 "video-$V-mute.mp4")
  # narração + fade
  $FF -y -loglevel error -i "video-$V-mute.mp4" -i "narr-$V.wav" \
    -filter_complex "[1:a]adelay=700|700,apad,atrim=0:$VDUR,afade=t=out:st=$(echo "$VDUR-1.2"|bc):d=1.2[a]" \
    -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 192k -shortest "beanstech-$V.mp4"
  echo "[$V] OK: beanstech-$V.mp4 ($($FP -v error -show_entries format=duration -of csv=p=0 beanstech-$V.mp4)s)"
  rm -f seg-$V-*.mp4 video-$V-mute.mp4 concat-$V.txt
}

# ---- textos ----
echo "12 modelos soberanos · trilha de auditoria clínica" > title-medicina.txt
echo "277 casos cegos · 100 mil chats · 114 ms · dado que não sai do Brasil" > close-medicina.txt
echo "100 milhões de julgados indexados e auditáveis" > title-direito.txt
echo "fonte · trilha de auditoria · tokens contados em cada resposta" > close-direito.txt
echo "10 modelos soberanos · filtro de entrada e de saída" > title-compliance.txt
echo "compliance que resiste a um processo" > close-compliance.txt
echo "Hunyuan 3D · frota soberana · 1,62 TB de VRAM" > title-proptech.txt
echo "o imóvel vira dado · o dado vira decisão" > close-proptech.txt

build medicina 61.72 \
  "med-01-chatmed-home|chatmed.beanstech.ai — chat clínico com 12 modelos" \
  "med-02-chatmed-benchmark|chatmed.beanstech.ai/benchmark — resultados do benchmark cego" \
  "med-03-teste|teste.beanshealth.com.br — benchmark clínico público" \
  "med-04-decisao|beanshealth.com.br/decisao — apoio à decisão clínica"

build direito 44.72 \
  "dir-01-ragjur|ragjur.ai — 100 milhões de julgados auditáveis" \
  "dir-02-dodr|dodr.ai/decisao — apoio à decisão institucional" \
  "dir-03-legalsuite|legalsuite.com.br — suíte jurídica"

build compliance 43.37 \
  "com-01-chatvc-home|chatvc.beanstech.ai — chat de compliance" \
  "com-02-chatvc-models|chatvc.beanstech.ai/models — modelos soberanos" \
  "com-03-chatvc-security|chatvc.beanstech.ai/security — arquitetura de segurança"

build proptech 44.13 \
  "pro-01-chat-home|chat.beanstech.ai — hub da frota soberana" \
  "pro-02-chat-dashboard|chat.beanstech.ai/dashboard — 1,62 TB · 14 modelos" \
  "pro-03-chat-models|chat.beanstech.ai/models — catálogo de modelos"

ls -la beanstech-*.mp4
