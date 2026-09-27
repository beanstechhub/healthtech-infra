#!/bin/bash
# Watcher do Hy4: espera as 8 partes completarem, faz merge incremental (anexa e apaga
# parte a parte para caber no disco), confere tamanho + sha256 oficial e sobe llama-hy4.
# Substitui o watcher antigo, que usava du -BM (MiB) contra um limite em MB — nunca disparava.
exec >> /var/log/hy4-watcher.log 2>&1
D=/data/models/Hy4-preview-Q4
TOTAL=467292398016
S=55729125000
SHA=58d0703ef860841dd9b605bfe567af89b62fc7bc367cd57303fc742c6386fffb
F=$D/Hy4-preview-Q4_K_M.gguf

want() { if [ $1 -lt 7 ]; then echo $S; else echo $(( TOTAL - 7 * S )); fi; }

parts_ok() {
  local i cur
  for i in 0 1 2 3 4 5 6 7; do
    cur=$(stat -c %s $D/part_$i 2>/dev/null || echo 0)
    [ "$cur" -eq "$(want $i)" ] || return 1
  done
  return 0
}

while true; do
  # merge incremental: só entra se todas as partes estão completas e o merge não começou
  if [ ! -f $F ] && [ ! -f $F.merging ] && parts_ok; then
    touch $F.merging
    echo "$(date -Is) partes completas — merge incremental iniciado"
    ok=1
    for i in 0 1 2 3 4 5 6 7; do
      if cat $D/part_$i >> $F && rm -f $D/part_$i; then :; else
        echo "$(date -Is) FALHA no merge da part_$i — intervenção manual"
        ok=0; break
      fi
    done
    rm -f $F.merging
    [ $ok -eq 1 ] && echo "$(date -Is) merge completo: $(stat -c %s $F) bytes"
  fi

  # integridade: tamanho exato + sha256 oficial (uma vez só; marca com .ok)
  if [ -f $F ] && [ ! -f $F.merging ] && [ ! -f $F.ok ]; then
    sz=$(stat -c %s $F)
    if [ "$sz" -ne "$TOTAL" ]; then
      echo "$(date -Is) merged $sz != $TOTAL — parado"
    else
      echo "$(date -Is) sha256sum do arquivo final iniciado (~10 min)"
      h=$(sha256sum $F | awk '{print $1}')
      if [ "$h" = "$SHA" ]; then
        touch $F.ok; rm -rf $D/.cache
        echo "$(date -Is) INTEGRIDADE OK (sha256 confere)"
      else
        echo "$(date -Is) SHA DIVERGENTE ($h) — merge corrompido, recomeçar manualmente"
      fi
    fi
  fi

  if [ -f $F.ok ] && ! systemctl is-active --quiet llama-hy4; then
    systemctl start llama-hy4 && echo "$(date -Is) llama-hy4 started"
  fi
  sleep 300
done
