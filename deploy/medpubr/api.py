"""medpubr — modelos médicos em CPU, dentro do Brasil (sa-east-1, VPC).

Serviço da camada 4 da cadeia anti-alucinação: embeddings + rerank + detecção de dados pessoais,
rodando onde o dado clínico está (nenhum texto sai do país para esta etapa).

Endpoints (JSON):
  GET  /health                       → modelos carregados, versões
  POST /v1/embed     {"texts":[...]}  → BGE-M3 dense (1024d, normalizado)  — indexação/consulta no Elasticsearch
  POST /v1/rerank    {"query":..., "documents":[...], "top_n":10} → bge-reranker-v2-m3 (scores 0..1)
  POST /v1/pii       {"text":...}     → entidades pessoais (nome, CPF, telefone, e-mail, datas, endereço) por regex+NER
  POST /v1/ner       {"text":...}     → entidades clínicas PT-BR (OpenMed / bioBERT-pt, se disponível)
  POST /v1/support   {"claim":..., "evidence":[...]} → "supported|partial|unsupported" por NLI/rerank (verificação de citação)

Modelos ficam em /opt/medpubr/models (HF_HOME). Primeiro start baixa ~2,5 GB.
"""
from __future__ import annotations

import logging
import os
import re
import time
from contextlib import asynccontextmanager
from typing import Any

import numpy as np
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

os.environ.setdefault("HF_HOME", "/opt/medpubr/models")
os.environ.setdefault("TOKENIZERS_PARALLELISM", "false")
os.environ.setdefault("OMP_NUM_THREADS", str(max(1, (os.cpu_count() or 8) - 1)))

log = logging.getLogger("medpubr")
logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")

EMBED_MODEL = os.environ.get("MEDPUBR_EMBED_MODEL", "BAAI/bge-m3")
RERANK_MODEL = os.environ.get("MEDPUBR_RERANK_MODEL", "BAAI/bge-reranker-v2-m3")
NER_MODEL = os.environ.get("MEDPUBR_NER_MODEL", "pucpr/clinicalnerpt-medical")  # opcional; falha silenciosa
MAX_TEXTS = int(os.environ.get("MEDPUBR_MAX_TEXTS", "64"))
MAX_CHARS = int(os.environ.get("MEDPUBR_MAX_CHARS", "8000"))

state: dict[str, Any] = {"embed": None, "rerank": None, "ner": None, "loaded_at": None}


def _load() -> None:
    import torch
    from sentence_transformers import CrossEncoder, SentenceTransformer

    torch.set_num_threads(int(os.environ["OMP_NUM_THREADS"]))
    t0 = time.time()
    state["embed"] = SentenceTransformer(EMBED_MODEL, device="cpu")
    log.info("embed %s carregado em %.1fs", EMBED_MODEL, time.time() - t0)
    t0 = time.time()
    state["rerank"] = CrossEncoder(RERANK_MODEL, device="cpu", max_length=1024)
    log.info("rerank %s carregado em %.1fs", RERANK_MODEL, time.time() - t0)
    try:
        from transformers import pipeline

        state["ner"] = pipeline("token-classification", model=NER_MODEL, aggregation_strategy="simple", device=-1)
        log.info("ner %s carregado", NER_MODEL)
    except Exception as e:  # modelo NER é opcional; o serviço sobe sem ele
        log.warning("ner indisponível (%s): %s", NER_MODEL, e)
        state["ner"] = None
    state["loaded_at"] = time.time()


@asynccontextmanager
async def lifespan(_: FastAPI):
    _load()
    yield


app = FastAPI(title="medpubr", version="1.0.0", lifespan=lifespan, docs_url="/docs")


class EmbedIn(BaseModel):
    texts: list[str] = Field(..., min_length=1, max_length=MAX_TEXTS)


class RerankIn(BaseModel):
    query: str
    documents: list[str] = Field(..., min_length=1, max_length=200)
    top_n: int = 10


class TextIn(BaseModel):
    text: str = Field(..., min_length=1, max_length=MAX_CHARS)


class SupportIn(BaseModel):
    claim: str
    evidence: list[str] = Field(..., min_length=1, max_length=50)


def _clip(xs: list[str]) -> list[str]:
    return [x[:MAX_CHARS] for x in xs]


@app.get("/health")
def health():
    return {
        "status": "ok" if state["embed"] is not None else "loading",
        "models": {"embed": EMBED_MODEL, "rerank": RERANK_MODEL, "ner": NER_MODEL if state["ner"] else None},
        "region": "sa-east-1",
        "loaded_at": state["loaded_at"],
    }


@app.post("/v1/embed")
def embed(body: EmbedIn):
    if state["embed"] is None:
        raise HTTPException(503, "carregando")
    vecs = state["embed"].encode(_clip(body.texts), normalize_embeddings=True, batch_size=16)
    return {"model": EMBED_MODEL, "dim": int(vecs.shape[1]), "embeddings": vecs.tolist()}


@app.post("/v1/rerank")
def rerank(body: RerankIn):
    if state["rerank"] is None:
        raise HTTPException(503, "carregando")
    docs = _clip(body.documents)
    scores = state["rerank"].predict([(body.query, d) for d in docs], batch_size=8)
    scores = 1 / (1 + np.exp(-np.asarray(scores)))  # sigmoid → 0..1
    order = np.argsort(-scores)[: max(1, body.top_n)]
    return {"model": RERANK_MODEL, "results": [{"index": int(i), "score": float(scores[i])} for i in order]}


_PII = {
    "cpf": re.compile(r"\b\d{3}\.?\d{3}\.?\d{3}-?\d{2}\b"),
    "cns": re.compile(r"\b[12789]\d{14}\b"),
    "phone": re.compile(r"(?:\+55\s?)?\(?\d{2}\)?\s?9?\d{4}-?\d{4}\b"),
    "email": re.compile(r"\b[\w.+-]+@[\w-]+\.[\w.-]+\b"),
    "date": re.compile(r"\b\d{1,2}/\d{1,2}/\d{2,4}\b"),
    "cep": re.compile(r"\b\d{5}-?\d{3}\b"),
    "crm": re.compile(r"\bCR[MO]/?[A-Z]{2}\s?\d{4,6}\b", re.I),
}


@app.post("/v1/pii")
def pii(body: TextIn):
    ents = []
    for kind, rx in _PII.items():
        for m in rx.finditer(body.text):
            ents.append({"type": kind, "start": m.start(), "end": m.end(), "text": m.group(0), "source": "regex"})
    if state["ner"] is not None:
        try:
            for e in state["ner"](body.text):
                if e.get("entity_group", "").upper() in {"PER", "PESSOA", "PATIENT", "NAME"}:
                    ents.append({"type": "person", "start": int(e["start"]), "end": int(e["end"]), "text": e["word"], "source": "ner", "score": float(e["score"])})
        except Exception as ex:
            log.warning("ner falhou: %s", ex)
    ents.sort(key=lambda x: x["start"])
    red = body.text
    for e in reversed(ents):
        red = red[: e["start"]] + f"[{e['type'].upper()}]" + red[e["end"] :]
    return {"entities": ents, "redacted": red, "has_pii": bool(ents)}


@app.post("/v1/ner")
def ner(body: TextIn):
    if state["ner"] is None:
        raise HTTPException(501, f"modelo NER não carregado ({NER_MODEL})")
    return {"model": NER_MODEL, "entities": [
        {"type": e.get("entity_group"), "text": e["word"], "start": int(e["start"]), "end": int(e["end"]), "score": float(e["score"])}
        for e in state["ner"](body.text)]}


@app.post("/v1/support")
def support(body: SupportIn):
    """Verificação de citação: a afirmação é sustentada por algum trecho? Usa o reranker como
    aproximação de entailment (limiares calibrados grosseiramente; a avaliação clínica define os finais)."""
    if state["rerank"] is None:
        raise HTTPException(503, "carregando")
    ev = _clip(body.evidence)
    s = state["rerank"].predict([(body.claim, e) for e in ev], batch_size=8)
    s = 1 / (1 + np.exp(-np.asarray(s)))
    best = int(np.argmax(s)); bs = float(s[best])
    status = "supported" if bs >= 0.75 else "partial" if bs >= 0.45 else "unsupported"
    return {"status": status, "best_evidence_index": best, "score": bs, "scores": [float(x) for x in s]}
