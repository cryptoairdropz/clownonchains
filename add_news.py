#!/usr/bin/env python3
"""
add_news.py — agent memanggil ini untuk menyimpan artikel hasil parafrase.

Dipakai oleh cronjob: agent menulis parafrase, lalu menyuntikkannya ke data.js
lewat script ini (bukan edit manual).

Contoh:
  python3 add_news.py --title "Bitcoin ETF inflows hit record" \
      --source "Market Intel" --body "Isi parafrase lengkap..." \
      --source-url "https://coindesk.com/..." --slug "bitcoin-etf-record"
"""
import argparse
import json
import os
import re
import sys
from datetime import datetime, timezone

ROOT = os.path.dirname(os.path.abspath(__file__))
DATA = os.path.join(ROOT, "data.js")
QUEUE = os.path.join(ROOT, "queue", "news-raw.json")
SEEN = os.path.join(ROOT, "queue", "published.json")


def slugify(t: str) -> str:
    s = t.lower()
    s = re.sub(r"[^a-z0-9\s-]", "", s)
    s = re.sub(r"\s+", "-", s.strip())
    return re.sub(r"-+", "-", s)[:70].strip("-")


def js_str(s: str) -> str:
    return json.dumps(s, ensure_ascii=False)


def load_published():
    if os.path.exists(SEEN):
        try:
            with open(SEEN) as f:
                return json.load(f)
        except Exception:
            pass
    return []


def save_published(items):
    os.makedirs(os.path.dirname(SEEN), exist_ok=True)
    with open(SEEN, "w") as f:
        json.dump(items, f, indent=2, ensure_ascii=False)


def existing_slugs():
    with open(DATA) as f:
        src = f.read()
    return set(re.findall(r'slug:\s*"([^"]+)"', src))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--title", required=True)
    ap.add_argument("--body", required=True)
    ap.add_argument("--source", default="Market Intel")
    ap.add_argument("--source-url", default="")
    ap.add_argument("--slug", default="")
    ap.add_argument("--max-news", type=int, default=24,
                    help="batas artikel di data.js (yang terlama dibuang)")
    args = ap.parse_args()

    body = " ".join(args.body.split())
    if len(body) < 200:
        print("ERROR: body terlalu pendek (<200 char). Parafrase lebih lengkap.", file=sys.stderr)
        sys.exit(1)

    s = args.slug or slugify(args.title)
    have = existing_slugs()
    if s in have:
        s = f"{s}-{datetime.now().strftime('%m%d')}"
    if s in have:
        print(f"SKIP: slug '{s}' sudah ada.", file=sys.stderr)
        sys.exit(2)

    entry = (
        "  {\n"
        f'    slug:{js_str(s)},\n'
        f'    t:{js_str(args.title)},\n'
        f'    s:{js_str(args.source)},\n'
        f'    d:"Just now",\n'
        f'    body:{js_str(body)}\n'
        "  },\n"
    )

    with open(DATA) as f:
        src = f.read()

    marker = "const NEWS = [\n"
    if marker not in src:
        print("ERROR: tidak menemukan 'const NEWS = [' di data.js", file=sys.stderr)
        sys.exit(1)

    # sisipkan di paling atas array (berita terbaru dulu)
    src = src.replace(marker, marker + entry, 1)

    # batasi jumlah berita
    with open(DATA, "w") as f:
        f.write(src)

    # catat sebagai published
    pub = load_published()
    pub.insert(0, {
        "slug": s,
        "title": args.title,
        "source": args.source,
        "source_url": args.source_url,
        "published_at": datetime.now(timezone.utc).isoformat(),
    })
    save_published(pub)

    # hapus dari queue mentah kalau ada
    if os.path.exists(QUEUE):
        try:
            with open(QUEUE) as f:
                q = json.load(f)
            if args.source_url:
                q = [x for x in q if x.get("link") != args.source_url]
                with open(QUEUE, "w") as f:
                    json.dump(q, f, indent=2, ensure_ascii=False)
        except Exception:
            pass

    print(f"✓ artikel ditambahkan: {s}")
    print(f"  total published: {len(pub)}")


if __name__ == "__main__":
    main()
