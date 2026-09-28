#!/usr/bin/env python3
"""Serviço do guardião de injeção/jailbreak PT-BR — CPU, sem GPU.

Um classificador de 86M roda em CPU a ~30ms por requisição. Contrato mínimo OpenAI-ish:
POST /v1/classify {text} -> {attack_prob, blocked, threshold}
e POST /v1/chat/completions (compatível) para plugar na mesma rota da frota.

uso: GUARDIAN_MODEL=/data/models/guardian-ptbr-86M uvicorn guard_service:app --host 0.0.0.0 --port 8010
"""
import os
from fastapi import FastAPI
from pydantic import BaseModel
import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification

MODEL = os.environ.get("GUARDIAN_MODEL", "protectai/deberta-v3-base-prompt-injection-v2")
THRESHOLD = float(os.environ.get("GUARDIAN_THRESHOLD", "0.5"))

app = FastAPI(title="guardian-ptbr", version="1.0")
tok = AutoTokenizer.from_pretrained(MODEL)
model = AutoModelForSequenceClassification.from_pretrained(MODEL).eval()
torch.set_num_threads(max(1, (os.cpu_count() or 2) // 2))

class Req(BaseModel):
    text: str

def classify(text: str):
    with torch.no_grad():
        enc = tok(text, truncation=True, max_length=256, return_tensors="pt")
        p = torch.softmax(model(**enc).logits, dim=-1)[0]
        # índice 1 = ataque (Apêndice A do Prompt-Guard: LABEL_1 = injection)
        return float(p[1])

@app.post("/v1/classify")
def do_classify(r: Req):
    prob = classify(r.text)
    return {"attack_prob": round(prob, 4), "blocked": prob >= THRESHOLD, "threshold": THRESHOLD}

@app.post("/v1/chat/completions")
def compat(r: dict):
    msgs = r.get("messages", [])
    text = " ".join(m.get("content", "") for m in msgs if isinstance(m.get("content"), str))
    prob = classify(text)
    verdict = "BLOCK" if prob >= THRESHOLD else "ALLOW"
    return {"id": "guardian", "object": "chat.completion",
            "choices": [{"index": 0, "message": {"role": "assistant", "content": verdict},
                         "finish_reason": "stop"}],
            "guardian": {"attack_prob": round(prob, 4), "threshold": THRESHOLD}}

@app.get("/health")
def health():
    return {"ok": True, "model": MODEL, "threshold": THRESHOLD}
