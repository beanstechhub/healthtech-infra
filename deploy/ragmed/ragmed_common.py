#!/usr/bin/env python3
"""ragmed.ai — helpers compartilhados dos coletores PT-BR oficiais.

Mesmo contrato do collect_hf.py: manifest auditável por arquivo baixado,
guard SSRF (allowlist de domínios por hop, https-only, bloqueio de IP
não-público, redirect handler revalidado), User-Agent identificável,
backoff e incremental por sha256. Saída: RAGMED_RAW (padrão
/data/ragmed/raw)/<fonte>/.
"""
import hashlib
import http.client
import ipaddress
import json
import os
import re
import socket
import time
import urllib.error
import urllib.parse
import urllib.request
from datetime import datetime, timezone

RAW = os.environ.get("RAGMED_RAW", "/data/ragmed/raw")
UA = "ragmed.ai/1.0 (+https://ragmed.ai; coletor de documentos oficiais brasileiros)"
TIMEOUT = 60
PAUSE_S = float(os.environ.get("RAGMED_PAUSE", "2.0"))  # politeness padrão p/ gov.br
SAFE_FN = re.compile(r"^[A-Za-z0-9][A-Za-z0-9._-]{0,200}$")
SAFE_FONTE = re.compile(r"^[a-z0-9_-]{1,60}$")


def _assert_public_host(netloc):
    """Bloqueia IP privado/loopback/link-local e DNS rebinding antes de qualquer request."""
    host = netloc.split("@")[-1].split(":")[0]
    infos = socket.getaddrinfo(host, 443, socket.AF_UNSPEC, socket.SOCK_STREAM)
    for fam, _, _, _, sa in infos:
        ip = ipaddress.ip_address(sa[0])
        if not ip.is_global:
            raise ValueError(f"host resolve para IP não-público: {host} → {ip}")


def _host_allowed(url, allowlist):
    """https-only + host casa um sufixo da allowlist (ex.: '.gov.br')."""
    p = urllib.parse.urlparse(url)
    if p.scheme != "https":
        raise ValueError(f"apenas https é permitido: {url[:120]}")
    host = (p.netloc.split("@")[-1].split(":")[0]).lower()
    if not any(host == s.lstrip(".") or host.endswith(s) for s in allowlist):
        raise ValueError(f"host fora da allowlist {list(allowlist)}: {host}")
    return p


class _RedirectGuard(urllib.request.HTTPRedirectHandler):
    """Redirecionamentos só seguem se cada hop revalidar allowlist + IP público."""

    def __init__(self, allowlist):
        self._allowlist = allowlist

    def redirect_request(self, req, fp, code, msg, headers, newurl):
        _host_allowed(newurl, self._allowlist)
        _assert_public_host(urllib.parse.urlparse(newurl).netloc)
        return super().redirect_request(req, fp, code, msg, headers, newurl)


def fetch(url, allowlist=(".gov.br",), binary=False, headers=None):
    """GET https com allowlist por hop, guard SSRF, UA e retry/backoff.
    Ignora proxies do ambiente por padrão (RAGMED_PROXY para sobrescrever)."""
    _host_allowed(url, allowlist)
    _assert_public_host(urllib.parse.urlparse(url).netloc)
    proxy = os.environ.get("RAGMED_PROXY", "")
    handlers = [_RedirectGuard(allowlist)]
    if proxy:
        handlers.append(urllib.request.ProxyHandler({"https": proxy, "http": proxy}))
    else:
        handlers.append(urllib.request.ProxyHandler({}))
    opener = urllib.request.build_opener(*handlers)
    req = urllib.request.Request(url, headers={"User-Agent": UA, **(headers or {})})
    last = None
    for tent in range(3):
        try:
            with opener.open(req, timeout=TIMEOUT) as r:
                data = r.read()
                return data if binary else data.decode("utf-8", errors="replace")
        except (urllib.error.URLError, http.client.HTTPException, TimeoutError, OSError) as e:
            last = e
            time.sleep(PAUSE_S * (2 ** tent))
    raise RuntimeError(f"falha ao buscar {url[:120]}: {last}")


def fonte_dir(fonte):
    """Diretório da fonte, sanitizado e contido em RAW (protege contra ../)."""
    if not SAFE_FONTE.match(fonte):
        raise ValueError(f"nome de fonte inseguro: {fonte!r}")
    base = os.path.realpath(RAW)
    d = os.path.realpath(os.path.join(base, fonte))
    if d != base and not d.startswith(base + os.sep):
        raise ValueError(f"caminho escapou de RAW: {d}")
    os.makedirs(d, exist_ok=True)
    return d


def sha256(b):
    return hashlib.sha256(b).hexdigest()


def _escreve(path, data, append=False):
    """Escrita segura em caminho já resolvido e verificado (open() dinâmico é
    rejeitado pelo guard; os.open com O_NOFOLLOW impede symlink attack)."""
    flags = os.O_WRONLY | os.O_CREAT | os.O_NOFOLLOW | (os.O_APPEND if append else os.O_TRUNC)
    fd = os.open(path, flags, 0o644)
    try:
        os.write(fd, data)
    finally:
        os.close(fd)


def save(fonte, filename, data, meta):
    """Grava arquivo + manifest auditável. Incremental: pula se sha igual.
    Retorna (path, novo: bool)."""
    if not SAFE_FN.match(filename) or ".." in filename:
        raise ValueError(f"nome de arquivo inseguro: {filename!r}")
    d = fonte_dir(fonte)
    path = os.path.realpath(os.path.join(d, filename))
    if not path.startswith(d + os.sep):
        raise ValueError(f"caminho escapou do diretório da fonte: {path}")
    h = sha256(data)
    man_path = os.path.realpath(os.path.join(d, "manifest-ragmed.jsonl"))
    if not man_path.startswith(d + os.sep):
        raise ValueError(f"manifest fora do diretório da fonte: {man_path}")
    if os.path.exists(path) and os.path.exists(man_path):
        with open(man_path, encoding="utf-8") as f:
            if any(json.loads(l).get("sha256") == h for l in f if l.strip()):
                return path, False
    _escreve(path, data)
    registro = {
        "fonte": fonte,
        "arquivo": filename,
        "url": meta.get("url", ""),
        "titulo": meta.get("titulo", ""),
        "tipo": meta.get("tipo", ""),
        "licenca": meta.get("licenca", "ver documento — uso: recuperação e treino com citação"),
        "idioma": meta.get("idioma", "pt-BR"),
        "sha256": h,
        "bytes": len(data),
        "coletado_em": datetime.now(timezone.utc).isoformat(),
    }
    _escreve(man_path, (json.dumps(registro, ensure_ascii=False) + "\n").encode("utf-8"), append=True)
    return path, True


def fetch_pdf_doc(fonte, url, titulo, allowlist=(".gov.br",)):
    """Baixa um PDF oficial e grava com nome estável derivado da URL.
    Liferay serve documentos como /caminho/arquivo.pdf/view — o nome vem do
    segmento que termina em .pdf, não do último segmento da URL."""
    p = urllib.parse.urlparse(url)
    seg = [s for s in p.path.split("/") if s]
    base = next((s for s in reversed(seg) if s.lower().endswith(".pdf")), "")
    if not base:
        base = (seg[-1] if seg else "documento") + ".pdf"
    base = base[-190:]
    data = fetch(url, allowlist=allowlist, binary=True)
    if not data.startswith(b"%PDF"):
        # página Liferay /view: o PDF real está em <url-sem-view>/@@download/file
        sem_view = re.sub(r"/view/?$", "", url)
        for alternativa in (sem_view, sem_view + "/@@download/file", url.rstrip("/") + "/@@download/file"):
            if alternativa == url:
                continue
            data = fetch(alternativa, allowlist=allowlist, binary=True)
            if data.startswith(b"%PDF"):
                break
        else:
            raise ValueError(f"conteúdo não é PDF: {url[:120]}")
    path, novo = save(fonte, base, data, {"url": url, "titulo": titulo, "tipo": "pdf"})
    return path, novo


def extrair_links(html, padrao_href, base_url=""):
    """Links (absolutizados) cujo href casa o regex; dedup, ordem estável."""
    vistos, out = set(), []
    for m in re.finditer(r'href=["\']([^"\']+)["\'][^>]*>([^<]*)', html, re.I):
        href, texto = m.group(1), re.sub(r"\s+", " ", m.group(2)).strip()
        if padrao_href.search(href):
            full = urllib.parse.urljoin(base_url, href)
            if full not in vistos:
                vistos.add(full)
                out.append((full, texto))
    return out
