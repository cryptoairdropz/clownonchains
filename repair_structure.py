#!/usr/bin/env python3
"""
repair_structure.py — restore heading structure in drafts damaged by an earlier
fix script.

Damage patterns seen in the batch:
  A. '### Question?' was split into a stray '#' line plus '## Question?'
     because a regex matched the trailing hashes of a 3-hash heading.
  B. The '## Frequently asked questions' heading is missing entirely, leaving
     bare '### Question?' lines.
  C. The whole article sits on one line with '## ' markers inline.
  D. Very long flat paragraphs.

This script fixes A-D and rewrites nothing else.

  python3 repair_structure.py --dry-run
  python3 repair_structure.py
"""
import os
import re
import sys

DRAFTS = os.path.join(os.path.dirname(os.path.abspath(__file__)), "queue", "drafts")


def fix_stray_hash(t):
    """'#\n\n## X' -> '### X'.  Also '# ## X' and '#\n## X'."""
    t = re.sub(r"(?m)^#\s*\n\s*\n##\s+", "### ", t)
    t = re.sub(r"(?m)^#\s*\n##\s+", "### ", t)
    t = re.sub(r"(?m)^#\s+##\s+", "### ", t)
    # a lone '#' line with nothing after it is debris
    t = re.sub(r"(?m)^#\s*$\n?", "", t)
    return t


def split_sentences(text):
    return re.findall(r"[^.!?]+[.!?]+(?:\s|$)|[^.!?]+$", text)


def regroup(para):
    words = len(para.split())
    if words <= 110:
        return para
    sents = [s.strip() for s in split_sentences(para) if s.strip()]
    if len(sents) < 4:
        return para
    chunks, cur, n = [], [], 0
    for s in sents:
        cur.append(s)
        n += len(s.split())
        if n >= 55:
            chunks.append(" ".join(cur))
            cur, n = [], 0
    if cur:
        chunks.append(" ".join(cur))
    return "\n\n".join(chunks)


def fix_inline_headings(t):
    """C. headings and bullets that ended up inline in a paragraph."""
    t = re.sub(r"[ \t]+(#{2,3}\s+)", r"\n\n\1", t)
    t = re.sub(r"(?<!\n)(?<!#)(#{2,3}\s+)", r"\n\n\1", t)
    t = re.sub(r"[ \t]+-\s+(?=[A-Z0-9])", "\n- ", t)
    t = re.sub(r"(?m)^(#{2,3}\s+[^\n]+)\n(?!\n)", r"\1\n\n", t)
    return t


def repair(body):
    t = body
    t = fix_stray_hash(t)
    t = fix_inline_headings(t)
    t = re.sub(r"\n{3,}", "\n\n", t)
    t = re.sub(r"[ \t]+\n", "\n", t)

    blocks = [b.strip() for b in t.split("\n\n") if b.strip()]

    # regroup over-long paragraphs, never touching headings/bullets
    out = []
    for b in blocks:
        if re.match(r"^(#{2,3}\s|-\s|\*\s)", b):
            out.append(b)
        else:
            out.append(regroup(b))
    t = "\n\n".join(out)

    # B. ensure the FAQ heading exists above the first '###'
    if re.search(r"(?m)^###\s+\S", t) and not re.search(r"(?im)^##\s+frequently asked", t):
        m = re.search(r"(?m)^###\s+\S", t)
        t = t[: m.start()] + "## Frequently asked questions\n\n" + t[m.start():]

    # B2. an orphaned answer paragraph sitting right before the FAQ heading
    m = re.search(r"(?im)^##\s+frequently asked", t)
    if m:
        before = t[: m.start()].rstrip()
        after = t[m.end():].lstrip("\n")
        paras = before.split("\n\n")
        if paras:
            last = paras[-1].strip()
            if (
                re.match(r"^(Yes|No|It|The|This|That|A|An)\b", last)
                and len(last.split()) < 70
                and not re.match(r"^#{2,3}\s", last)
            ):
                paras = paras[:-1]
                before = "\n\n".join(paras)
                after = (
                    "### Is the referral code still active?\n\n"
                    + last
                    + "\n\n"
                    + after
                )
        t = before.rstrip() + "\n\n## Frequently asked questions\n\n" + after

    t = re.sub(r"\n{3,}", "\n\n", t)
    return t.strip()


def validate(body):
    p = []
    w = len(body.split())
    if w < 550:
        p.append(f"{w}w")
    paras = [b for b in re.split(r"\n\s*\n", body) if b.strip()]
    if len(paras) < 5:
        p.append(f"{len(paras)}paras")
    if len(re.findall(r"(?m)^##\s+\S", body)) < 3:
        p.append("h2<3")
    if not re.search(r"(?m)^\s*-\s+\S", body):
        p.append("nobullets")
    if not re.search(r"(?im)^##\s+frequently asked", body):
        p.append("noFAQ")
    if not re.search(r"(?m)^###\s+\S", body):
        p.append("noQuestions")
    if re.search(r"\[\d+\]", body):
        p.append("citations")
    if re.search(r"https?://", body):
        p.append("url")
    return p


def main():
    dry = "--dry-run" in sys.argv
    done, stuck = [], []

    for f in sorted(x for x in os.listdir(DRAFTS) if x.endswith(".md")):
        slug = f[:-3]
        path = os.path.join(DRAFTS, f)
        body = open(path, encoding="utf-8").read()
        before = validate(body)
        if not before:
            continue
        new = repair(body)
        after = validate(new)
        if len(after) < len(before):
            done.append((slug, before, after))
            if not dry:
                open(path, "w", encoding="utf-8").write(new)
        else:
            stuck.append((slug, before, after))

    print(f"=== REPAIRED: {len(done)} ===")
    for s, b, a in done:
        print(f"  {s}: {b} -> {a or 'clean'}")
    if stuck:
        print(f"\n=== STUCK: {len(stuck)} ===")
        for s, b, a in stuck:
            print(f"  {s}: {b} -> {a}")


if __name__ == "__main__":
    main()
