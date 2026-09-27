#!/bin/bash
# Retoma o download por partes do Hy4-preview-Q4_K_M.gguf (AngelSlim/Hy4-preview-GGUF, 467292398016 bytes).
# Cada parte i cobre o intervalo [i*S, (i+1)*S); a parte 7 vai até o fim do arquivo.
# Só anexa resposta HTTP 206 (range) — nunca 200 — para não corromper a parte.
# uso: hy4-resume.sh <idx> [<idx>...]   (uma curl por parte; passar vários = paralelo)
exec >> /var/log/hy4-resume.log 2>&1
D=/data/models/Hy4-preview-Q4
URL="https://hf-mirror.com/AngelSlim/Hy4-preview-GGUF/resolve/main/Hy4-preview-Q4_K_M.gguf"
TOTAL=467292398016
S=55729125000

dl_part() {
  local i=$1 start=$(( $1 * S )) end
  if [ $i -lt 7 ]; then end=$(( start + S - 1 )); else end=$(( TOTAL - 1 )); fi
  local want=$(( end - start + 1 )) cur code tmp=/tmp/hy4chunk_$i
  # baixa em blocos de 512 MB e anexa a cada bloco — limita /tmp e limita perda num restart
  local CHUNK=536870912 from to
  echo "$(date -Is) part_$i start ($(( start / 1048576 ))MiB, falta $(( (want - $(stat -c %s $D/part_$i 2>/dev/null || echo 0)) / 1073741824 ))GiB)"
  while true; do
    cur=$(stat -c %s $D/part_$i 2>/dev/null || echo 0)
    if [ $cur -eq $want ]; then echo "$(date -Is) part_$i DONE ($cur bytes)"; return 0; fi
    if [ $cur -gt $want ]; then echo "$(date -Is) part_$i OVERSIZE ($cur > $want) — ABORT"; return 1; fi
    from=$(( start + cur )); to=$(( from + CHUNK - 1 )); [ $to -gt $end ] && to=$end
    code=$(curl -sL -w '%{http_code}' -r ${from}-${to} \
      --speed-limit 10240 --speed-time 90 -m 3600 -o $tmp "$URL" || true)
    if [ "$code" = "206" ] && [ -s $tmp ]; then cat $tmp >> $D/part_$i; fi
    rm -f $tmp
    sleep 5
  done
}

for i in "$@"; do dl_part "$i" & done
wait
echo "$(date -Is) ciclo de retomada concluído (partes: $*)"
