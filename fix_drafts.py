#!/usr/bin/env python3
"""
fix_drafts.py — repair mechanical defects in generated drafts, safely.

Two defects were found in the generated batch:
  1. The referral code appears 4-7 times. That reads as keyword stuffing.
     Target is 2-3 mentions.
  2. Some articles have no bulleted list.

SAFETY: every edit happens strictly inside a single paragraph. Headings ('##'),
bullet lines ('- ') and blank-line structure are never touched. The document is
split on blank lines, each block is repaired in isolation, then rejoined.

  python3 fix_drafts.py --dry-run
  python3 fix_drafts.py
"""
import argparse
import json
import os
import re
import subprocess

ROOT = os.path.dirname(os.path.abspath(__file__))
DRAFTS = os.path.join(ROOT, "queue", "drafts")

TARGET_MAX = 3


def load_partners():
    js = (
        "const fs=require('fs');const src=fs.readFileSync('data.js','utf8');"
        "const d=new Function(src+'\\nreturn {AFFILIATE}')();"
        "const o={};d.AFFILIATE.forEach(a=>o[a.slug]=a.code);"
        "process.stdout.write(JSON.stringify(o));"
    )
    tmp = os.path.join(ROOT, "queue", "_p.js")
    open(tmp, "w").write(js)
    try:
        r = subprocess.run(["node", tmp], cwd=ROOT, capture_output=True, text=True)
        return json.loads(r.stdout) if r.stdout.strip() else {}
    finally:
        if os.path.exists(tmp):
            os.remove(tmp)


def sentences(text):
    """Split a paragraph into sentences, keeping trailing whitespace."""
    return re.findall(r"[^.!?]+[.!?]*\s*", text)


def trim_paragraph(para, code):
    """
    Remove code mentions from ONE paragraph. Returns (new_para, removed_count).
    Prefers deleting a whole sentence that exists only to name the code;
    falls back to trimming a trailing clause.
    """
    if code not in para:
        return para, 0

    sents = sentences(para)
    removed = 0

    # Pass 1: drop sentences whose only purpose is naming the code.
    keep = []
    for s in sents:
        if code in s:
            # A sentence is "disposable" when the code is the subject of the
            # mention and the sentence carries no other concrete fact.
            stripped = s.strip()
            words = len(stripped.split())
            looks_disposable = (
                words <= 30
                and re.search(
                    r"(?i)^(?:(?:the\s+)?(?:referral\s+)?code\s|"
                    r"(?:using|use|enter|apply|applying)\s+(?:the\s+)?(?:referral\s+)?code\s|"
                    r",\s*(?:and\s+)?(?:using\s+)?(?:the\s+)?(?:referral\s+)?code\s)",
                    stripped,
                )
            )
            if looks_disposable:
                removed += 1
                continue
        keep.append(s)

    out = "".join(keep)

    # Pass 2: if the code still appears, cut a trailing ", using the code X ..." clause.
    if code in out:
        out2 = re.sub(
            r"(?i),\s*(?:and\s+)?(?:using\s+|use\s+)?(?:the\s+)?(?:referral\s+)?code\s+"
            + re.escape(code)
            + r"[^.!?]*",
            "",
            out,
        )
        if out2 != out:
            removed += 1
            out = out2

    # Pass 3: still there — rewrite the mention to a neutral phrase instead of deleting.
    if code in out:
        out = re.sub(
            r"(?i)(?:the\s+)?(?:referral\s+)?code\s+" + re.escape(code),
            "the referral link",
            out,
        )
        removed += 1

    out = re.sub(r"[ \t]{2,}", " ", out).strip()
    return out, removed


def repair(body, code):
    """Repair the whole document, block by block."""
    blocks = body.split("\n\n")
    total = len(re.findall(re.escape(code), body))
    if total <= TARGET_MAX:
        return body, 0

    # Score each paragraph: keep the first mention and the most fee-relevant one.
    para_code = [len(re.findall(re.escape(code), b)) for b in blocks]
    protected = set()
    for i, n in enumerate(para_code):
        if n and i not in protected:
            protected.add(i)
            break
    best, best_d = None, 10**9
    for i, b in enumerate(blocks):
        if not para_code[i] or i in protected:
            continue
        # lower score = closer to fee vocabulary
        for m in re.finditer(r"(?i)\b(fee|fees|cost|charge|discount|rate|percent)\b", b):
            d = abs(m.start() - b.find(code))
            if d < best_d:
                best_d, best = d, i
    if best is not None:
        protected.add(best)
    # keep one in the FAQ if there is room
    for i, b in enumerate(blocks):
        if i in protected or not para_code[i]:
            continue
        if re.search(r"(?i)frequently asked|^#{2,3}", b):
            protected.add(i)
            break

    out_blocks = []
    removed = 0
    for i, b in enumerate(blocks):
        if i in protected or not para_code[i]:
            out_blocks.append(b)
            continue
        # headings and bullets are structural — never edit them
        if re.match(r"\s*(#{2,3}\s|[-*]\s)", b):
            out_blocks.append(b)
            continue
        nb, r = trim_paragraph(b, code)
        removed += r
        out_blocks.append(nb)

    out = "\n\n".join(x for x in out_blocks if x.strip() != "")
    out = re.sub(r"\n{3,}", "\n\n", out)
    return out.strip(), removed


BULLETS = {
    "fee": [
        "- Compare the taker and maker rate separately, because the gap between them is where most of the saving sits",
        "- Check the withdrawal fee for the specific network you plan to use, not just the trading fee",
        "- Review your recent volume against the published tier thresholds before assuming your rate",
    ],
    "security": [
        "- Enable two-factor authentication with an authenticator app rather than SMS",
        "- Store a unique password in a password manager and never reuse it",
        "- Bookmark the official domain and verify it every time you log in",
    ],
    "bot": [
        "- Keep the working balance inside the bot small and withdraw gains regularly",
        "- Confirm you are using the official bot handle before depositing anything",
        "- Remember that funds in a bot wallet are held by the operator, not by you",
    ],
    "default": [
        "- Confirm the referral is applied before you submit the form, because it cannot be added afterwards",
        "- Check the current fee schedule on the platform itself rather than trusting a summary",
        "- Keep only working capital on the platform and withdraw the rest to a wallet you control",
    ],
}


def pick_bullets(slug, keyword):
    k = f"{slug} {keyword}".lower()
    if any(w in k for w in ("fee", "cost", "tier", "withdrawal", "maker")):
        return BULLETS["fee"]
    if any(w in k for w in ("security", "2fa", "safe", "scam", "drainer", "seed", "phish")):
        return BULLETS["security"]
    if any(w in k for w in ("bot", "sniper", "copy", "lp", "zenith", "dawn", "maestro", "gmgn", "axiom", "cove", "telegram")):
        return BULLETS["bot"]
    return BULLETS["default"]


def add_bullets(body, slug, keyword):
    if re.search(r"(?m)^\s*[-*]\s+\S", body):
        return body, False
    block = "\n".join(pick_bullets(slug, keyword))
    m = re.search(r"(?im)^#{2,3}\s*frequently asked", body)
    if m:
        return f"{body[:m.start()].rstrip()}\n\n{block}\n\n{body[m.start():]}", True
    return f"{body.rstrip()}\n\n{block}", True


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    partners = load_partners()
    changed = []

    for mf in sorted(f for f in os.listdir(DRAFTS) if f.endswith(".md")):
        slug = mf[:-3]
        jpath = os.path.join(DRAFTS, f"{slug}.meta.json")
        if not os.path.exists(jpath):
            continue
        meta = json.load(open(jpath, encoding="utf-8"))
        aff = (meta.get("affiliate") or "").strip()
        path = os.path.join(DRAFTS, mf)
        body = open(path, encoding="utf-8").read()
        orig = body
        notes = []

        if aff and aff in partners:
            code = partners[aff]
            n_before = len(re.findall(re.escape(code), body))
            if n_before > TARGET_MAX:
                body, _ = repair(body, code)
                n_after = len(re.findall(re.escape(code), body))
                notes.append(f"code {n_before}x -> {n_after}x")

        body, added = add_bullets(body, slug, meta.get("keyword", ""))
        if added:
            notes.append("added bullets")

        if body != orig:
            # structural sanity check: never lose headings or the FAQ
            h_before = len(re.findall(r"(?m)^#{2,3}\s", orig))
            h_after = len(re.findall(r"(?m)^#{2,3}\s", body))
            if h_after < h_before:
                notes.append(f"!! HEADINGS LOST {h_before}->{h_after} — SKIPPED")
                body = orig
            else:
                changed.append((slug, notes))
                if not args.dry_run:
                    open(path, "w", encoding="utf-8").write(body)

    print(f"=== {'WOULD FIX' if args.dry_run else 'FIXED'}: {len(changed)} ===")
    for slug, notes in changed:
        print(f"  {slug}: {', '.join(notes)}")


if __name__ == "__main__":
    main()
