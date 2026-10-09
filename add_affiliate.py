#!/usr/bin/env python3
"""
add_affiliate.py — publish one affiliate-targeted blog article.

Reads the payload from a JSON file (never CLI flags — $ and quotes break in shell):

  python3 add_affiliate.py --json-file /tmp/aff-article.json

Payload:
  {
    "slug": "binance-referral-code-not-working",
    "title": "Binance Referral Code Not Working? Here Is Why",
    "desc": "Meta description, 140-158 chars...",
    "body": "Full article with \\n\\n between paragraphs and ## subheadings",
    "affiliate": "binance",
    "keyword": "binance referral code not working"
  }

Guards (all reject before writing):
  - body < 400 words
  - fewer than 4 paragraphs
  - slug already exists
  - keyword already used

On success: writes queue/blog-posts.json, marks the topic done in
queue/aff-rotation.json, and prints the slug for the caller to verify.
"""
import argparse
import json
import os
import re
import sys
from datetime import datetime, timezone

ROOT = os.path.dirname(os.path.abspath(__file__))
BLOG = os.path.join(ROOT, "queue", "blog-posts.json")
TOPICS = os.path.join(ROOT, "queue", "aff-topics.json")
ROTATION = os.path.join(ROOT, "queue", "aff-rotation.json")

MIN_WORDS = 400
MIN_PARAS = 4


def load(path, default):
    if os.path.exists(path):
        try:
            with open(path, encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            pass
    return default


def save(path, obj):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(obj, f, indent=1, ensure_ascii=False)


def fail(msg, code=1):
    print(f"ERROR: {msg}", file=sys.stderr)
    sys.exit(code)


def slugify(t):
    s = re.sub(r"[^a-z0-9\s-]", "", t.lower())
    s = re.sub(r"\s+", "-", s.strip())
    return re.sub(r"-+", "-", s)[:80].strip("-")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--json-file", required=True)
    args = ap.parse_args()

    if not os.path.exists(args.json_file):
        fail(f"file not found: {args.json_file}")
    try:
        with open(args.json_file, encoding="utf-8") as f:
            p = json.load(f)
    except Exception as e:
        fail(f"invalid JSON: {e}")

    title = (p.get("title") or "").strip()
    desc = (p.get("desc") or "").strip()
    body = (p.get("body") or "").strip()
    affiliate = (p.get("affiliate") or "").strip()
    keyword = (p.get("keyword") or "").strip()
    slug = (p.get("slug") or "").strip() or slugify(keyword or title)

    if not title:
        fail("title is empty")
    if not body:
        fail("body is empty")
    if not affiliate:
        fail("affiliate is empty")
    if not keyword:
        fail("keyword is empty")

    # --- normalise whitespace but KEEP paragraph structure ---
    lines = [re.sub(r"[ \t]+", " ", ln).strip() for ln in body.replace("\r\n", "\n").split("\n")]
    cleaned, blank = [], False
    for ln in lines:
        if ln:
            cleaned.append(ln)
            blank = False
        elif not blank:
            cleaned.append("")
            blank = True
    body = "\n".join(cleaned).strip()

    # --- strip citation artefacts that must not reach the site ---
    body = re.sub(r"\[\d+\]", "", body)
    body = re.sub(r"(?im)^\s*#{2,3}\s*Sources\s*$.*$", "", body)
    body = re.sub(r"(?m)^\s*\[\d+\]\s*https?://\S+\s*$", "", body)
    body = re.sub(r"\n{3,}", "\n\n", body).strip()

    words = len(body.split())
    if words < MIN_WORDS:
        fail(f"body too short ({words} words, minimum {MIN_WORDS})")

    n_paras = len([b for b in re.split(r"\n\s*\n", body) if b.strip()])
    if n_paras < MIN_PARAS:
        fail(
            f"only {n_paras} paragraphs — minimum {MIN_PARAS}. "
            "Separate with blank lines (\\n\\n) and use '## Subheading'."
        )

    posts = load(BLOG, [])

    if any(x.get("slug") == slug for x in posts):
        fail(f"slug already published: {slug}", code=3)
    if any((x.get("keyword") or "").lower() == keyword.lower() for x in posts):
        fail(f"keyword already published: {keyword}", code=3)

    post = {
        "slug": slug,
        "title": title,
        "desc": desc or title,
        "body": body,
        "affiliate": affiliate,
        "keyword": keyword,
        "words": words,
        "paras": n_paras,
        "published_at": datetime.now(timezone.utc).isoformat(),
    }
    posts.insert(0, post)
    save(BLOG, posts)

    # --- mark topic done ---
    rot = load(ROTATION, {"done": []})
    if slug not in rot["done"]:
        rot["done"].append(slug)
    rot["last"] = slug
    rot["last_at"] = post["published_at"]
    save(ROTATION, rot)

    # verify the write landed
    check = load(BLOG, [])
    if not any(x.get("slug") == slug for x in check):
        fail("write verification failed — slug not found after save")

    print(f"OK slug={slug}")
    print(f"   words={words} | paragraphs={n_paras} | affiliate={affiliate}")
    print(f"   total blog posts={len(check)} | rotation done={len(rot['done'])}")


if __name__ == "__main__":
    main()
