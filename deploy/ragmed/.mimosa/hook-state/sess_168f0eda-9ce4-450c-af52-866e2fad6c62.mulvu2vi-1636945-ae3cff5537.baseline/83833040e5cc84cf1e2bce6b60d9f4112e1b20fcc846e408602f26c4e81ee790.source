#!/usr/bin/env python3
"""ragmed.ai — coletor de corpora médicos trilíngue (PT/EN/ES).
Baixa datasets curados do HuggingFace para /data/ragmed/raw/hf/<repo>/,
com manifest auditável (fonte, licença, idioma, sha, tamanho).
Registros > MAX_FILE_MB são ignorados (fase 1: textos, não dumps gigantes)."""
import json, hashlib, ipaddress, os, re, socket, sys, time, urllib.request, urllib.error
from urllib.parse import urlparse

HF = "https://huggingface.co"
OUT = "/data/ragmed/raw/hf"
MAX_FILE_MB = 400
TOKEN = os.environ.get("HF_TOKEN", "")
# nomes de arquivo vindos da API do HF: só [A-Za-z0-9._-] após achatamento de "/"
SAFE_FN = re.compile(r"^[A-Za-z0-9][A-Za-z0-9._-]{0,200}$")

def _assert_public_host(netloc):
    """Bloqueia IP privado/loopback/link-local e DNS rebinding antes de qualquer request."""
    host = netloc.split("@")[-1].split(":")[0]
    infos = socket.getaddrinfo(host, 443, socket.AF_UNSPEC, socket.SOCK_STREAM)
    for fam, _, _, _, sa in infos:
        ip = ipaddress.ip_address(sa[0])
        if not ip.is_global:
            raise ValueError(f"host resolve para IP não-público: {host} → {ip}")

# (repo, lang, licença declarada, prioridade) — curado 2026-09-24
CURATED = [
    # inglês — base científica
    ("qiaojin/PubMedQA",                                   "en", "mit",    1),
    ("MedRAG/pubmed",                                      "en", "apache-2.0? ver manifest", 2),
    ("bigbio/pubmed_qa",                                   "en", "ver manifest", 3),
    ("medalpaca/medical_meadow_medqa",                     "en", "ver manifest", 2),
    ("keivalya/MedQuad-MedicalQnADataset",                 "en", "ver manifest", 3),
    ("FreedomIntelligence/medical-o1-reasoning-SFT",       "en", "apache-2.0", 2),
    ("ccdv/pubmed-summarization",                          "en", "ver manifest", 3),
    # espanhol — núcleo LATAM
    ("HiTZ/MedExpQA",                                      "es", "ver manifest", 1),
    ("NLP-FBK/medexpqa-es",                                "es", "ver manifest", 2),
    ("jorge-henao/ask2democracy-cqa-salud",                "es", "ver manifest", 1),  # perguntas de salud colombianas
    ("juanmoisesdelas/especialistas-salud-mental-neurologia-latam", "es", "ver manifest", 1),
    # português — núcleo BR
    ("peluz/lener_br",                                     "pt", "ver manifest", 1),  # NER clínico BR
    ("pierreguillou/lener_br_finetuning_language_model",   "pt", "ver manifest", 2),
    ("feliperafael/saude-coletiva",                        "pt", "ver manifest", 2),
    ("saudefem/FINET_rag_qwen7_3epp",                      "pt", "ver manifest", 3),
]

def api(path):
    req = urllib.request.Request(f"{HF}/api/{path}")
    if TOKEN: req.add_header("Authorization", f"Bearer {TOKEN}")
    with urllib.request.urlopen(req, timeout=60) as r:
        return json.load(r)

def download(url, dest):
    req = urllib.request.Request(url)
    if TOKEN: req.add_header("Authorization", f"Bearer {TOKEN}")
    with urllib.request.urlopen(req, timeout=300) as r, open(dest, "wb") as f:
        while True:
            chunk = r.read(1 << 20)
            if not chunk: break
            f.write(chunk)

def sha256(path):
    real = os.path.realpath(path)
    if not real.startswith(os.path.realpath(OUT) + os.sep):
        raise ValueError(f"arquivo fora de OUT: {path}")
    h = hashlib.sha256()
    with open(real, "rb") as f:
        for chunk in iter(lambda: f.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()

def collect(repo, lang, license_note, prio):
    # repo vem da lista curada, mas é validado igualmente: org/nome sem .. nem separadores extras
    if not re.match(r"^[A-Za-z0-9][A-Za-z0-9_.-]*/[A-Za-z0-9][A-Za-z0-9_.-]*$", repo):
        return f"ERRO repo inválido: {repo}"
    dest = os.path.join(OUT, repo.replace("/", "__"))
    if not os.path.realpath(dest).startswith(os.path.realpath(OUT) + os.sep):
        return f"ERRO dest fora de OUT: {repo}"
    os.makedirs(dest, exist_ok=True)
    manifest_path = os.path.join(dest, "manifest.json")
    if os.path.exists(manifest_path):
        m = json.load(open(manifest_path))
        if m.get("status") == "ok":  # já coletado — pular
            return f"skip {repo}"
    files = []
    try:
        info = api(f"datasets/{repo}?blobs=true")
    except Exception as e:
        return f"ERRO api {repo}: {e}"
    for s in info.get("siblings", []):
        fn = s.get("rfilename", "")
        if fn.startswith(".git") or fn.endswith((".md", ".png", ".jpg", ".gif", ".zip")):
            continue
        flat = fn.replace("/", "_")
        if not SAFE_FN.match(flat):  # rejeita ../, espaços, nul bytes e afins
            continue
        size_mb = (s.get("size") or 0) / 1e6
        if size_mb > MAX_FILE_MB:
            continue
        url = f"{HF}/datasets/{repo}/resolve/main/{fn}"
        local = os.path.join(dest, flat)
        if not os.path.realpath(local).startswith(os.path.realpath(OUT) + os.sep):
            continue
        if not (os.path.exists(local) and os.path.getsize(local) == s.get("size")):
            try:
                download(url, local)
            except Exception as e:
                return f"ERRO dl {repo}/{fn}: {e}"
        files.append({"file": os.path.basename(local), "bytes": os.path.getsize(local),
                      "sha256": sha256(local) if os.path.getsize(local) < 500e6 else "skipped"})
    lic = (info.get("cardData") or {}).get("license", license_note)
    manifest = {"source": f"hf:{repo}", "lang": lang, "license": lic, "priority": prio,
                "collected_at": time.strftime("%Y-%m-%dT%H:%M:%S%z"), "status": "ok",
                "files": files, "total_mb": round(sum(f["bytes"] for f in files)/1e6, 1)}
    json.dump(manifest, open(manifest_path, "w"), indent=1)
    return f"ok {repo} [{lang}] {manifest['total_mb']} MB · {len(files)} arquivos"

if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    for repo, lang, lic, prio in CURATED:
        print(collect(repo, lang, lic, prio), flush=True)
