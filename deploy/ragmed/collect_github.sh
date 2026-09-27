#!/bin/bash
# ragmed.ai — coletor GitHub: fontes médicas BR (PCDT/CONITEC, Bulário ANVISA, SciELO) + utilitários
# Clona repos com dados/ferramentas para /data/ragmed/raw/github/<repo>/
set -uo pipefail
OUT=/data/ragmed/raw/github
mkdir -p "$OUT"

REPOS=(
  # BR — diretrizes e dados oficiais
  "vagnersantosmp/conitec-pcdt-downloader"   # baixa todos os PDFs de PCDT da CONITEC
  "aleckyann/bulario"                        # minerador do Bulário da ANVISA
  "bacanapps/pcdtadulto_beta"                # PCDT adulto
  "LabXiabr/sabeis_pcdt"                     # protocolos clínicos
  "amaurymartin/anvisa-medicament"           # API base ANVISA
  "andfranca/ciencia-de-dados-anvisa"        # ciência de dados ANVISA
  "yagoluiz/meuremedio-extracao"             # preços de medicamentos BR
  # SciELO
  "alyssonmazoni/scielo"                     # dump relacional SciELO
  "insyspo/scielo"
)

for r in "${REPOS[@]}"; do
  d="$OUT/${r//\//__}"
  if [ -d "$d/.git" ]; then
    (cd "$d" && git pull -q --ff-only 2>/dev/null) && echo "atualizado $r"
  else
    git clone -q --depth 1 "https://github.com/$r" "$d" 2>/dev/null && echo "clonado $r ($(du -sh "$d" | cut -f1))" || echo "FALHOU clone $r"
  fi
  # manifest do snapshot
  [ -d "$d" ] && printf '{"source":"github:%s","collected_at":"%s"}\n' "$r" "$(date -Is)" > "$d/manifest-ragmed.json"
done
echo "github: $(du -sh $OUT | cut -f1)"
