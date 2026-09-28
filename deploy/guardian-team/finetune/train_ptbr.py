#!/usr/bin/env python3
"""Fine-tune do guardião de injeção/jailbreak em PT-BR.

Base recomendada: meta-llama/Llama-Prompt-Guard-2-86M (mDeBERTa-v3 multilíngue, classificador
binário). Alternativa aberta sem gate: protectai/deberta-v3-base-prompt-injection-v2.

Regime escolhido: LoRA (peft) — 86M + adapter de ~1M params. Roda em UMA GPU (até L4/T4).
full fine-tune também é possível (86M cabe em qualquer coisa). Métrica alvo: F1 e, no fim,
taxa de bypass no eval/bypass_rate.py.

uso: python3 train_ptbr.py --base <model> --corpus ../corpus/guardian_ptbr.jsonl --out ./out
"""
import argparse, json, pathlib
import torch
from torch.utils.data import Dataset
from transformers import (AutoTokenizer, AutoModelForSequenceClassification,
                          TrainingArguments, Trainer)
from peft import LoraConfig, get_peft_model, TaskType

# token para modelos gated da Meta (lido do ambiente/KMS — nunca literal no código)
BASE_PADRAO = "meta-llama/Llama-Prompt-Guard-2-86M"
BASE_ABERTO = "protectai/deberta-v3-base-prompt-injection-v2"

class Corpus(Dataset):
    def __init__(self, path, tok, maxlen=256):
        self.rows = [json.loads(l) for l in pathlib.Path(path).read_text().splitlines() if l.strip()]
        self.tok, self.maxlen = tok, maxlen
    def __len__(self): return len(self.rows)
    def __getitem__(self, i):
        r = self.rows[i]
        enc = self.tok(r["text"], truncation=True, padding="max_length",
                       max_length=self.maxlen, return_tensors="pt")
        return {"input_ids": enc["input_ids"][0],
                "attention_mask": enc["attention_mask"][0],
                "labels": torch.tensor(r["label"])}

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--base", default=BASE_PADRAO)
    ap.add_argument("--corpus", default="../corpus/guardian_ptbr.jsonl")
    ap.add_argument("--out", default="./out")
    ap.add_argument("--epochs", type=int, default=4)
    ap.add_argument("--lora", action="store_true", default=True)
    ap.add_argument("--full", action="store_true", help="full fine-tune (sem LoRA)")
    a = ap.parse_args()

    tok = AutoTokenizer.from_pretrained(a.base)
    model = AutoModelForSequenceClassification.from_pretrained(a.base, num_labels=2)

    if a.lora and not a.full:
        cfg = LoraConfig(task_type=TaskType.SEQ_CLS, r=16, lora_alpha=32,
                         lora_dropout=0.05, target_modules=["query_proj", "value_proj"])
        model = get_peft_model(model, cfg)
        model.print_trainable_parameters()

    ds = Corpus(a.corpus, tok)
    n = len(ds); cut = int(n * 0.9)
    train, val = torch.utils.data.random_split(ds, [cut, n - cut],
                                               generator=torch.Generator().manual_seed(42))

    args = TrainingArguments(
        output_dir=a.out, num_train_epochs=a.epochs, per_device_train_batch_size=32,
        per_device_eval_batch_size=64, learning_rate=2e-4 if a.lora else 1e-5,
        warmup_ratio=0.1, eval_strategy="epoch", save_strategy="epoch",
        load_best_model_at_end=True, metric_for_best_model="eval_loss",
        logging_steps=20, report_to=[], seed=42, fp16=torch.cuda.is_available(),
    )
    Trainer(model=model, args=args, train_dataset=train, eval_dataset=val).train()
    model.save_pretrained(a.out); tok.save_pretrained(a.out)
    print(f"guardião PT-BR salvo em {a.out}")

if __name__ == "__main__":
    main()
