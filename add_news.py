#!/usr/bin/env python3
"""
add_news.py — publikasikan artikel hasil parafrase ke data.js.

DUA MODE:

  1) JSON file (DISARANKAN — tidak ada masalah shell escaping sama sekali):
       python3 add_news.py --json-file /tmp/artikel.json
     Isi file:
       {
         "title": "Judul baru",
         "body": "Parafrase lengkap...",
         "source": "Market Intel",
         "source_url": "https://sumber-asli/...",
         "slug": "opsional-slug-manual"
       }

  2) Flag CLI (hati-hati karakter $ dan kutip di shell):
       python3 add_news.py --title "..." --body "..." --source-url "..."

Dedup berlapis:
  - source_url sudah ada di data.js -> tolak (paling akurat)
  - slug sudah ada di data.js       -> tolak

Setelah sukses: entri ditulis ke data.js, tercatat di queue/published.json,
dan item dihapus dari queue/news-raw.json. Tulisan diverifikasi ulang
sebelum melaporkan sukses.
"""
import argparse
import json
import os
import re
import sys
from datetime import datetime, timezone

ROOT = os.path.dirname(os.path.abspath(__file__))
DATA = os.path.join(ROOT, "data.js")
QUEUE_FILE = os.path.join(ROOT, "queue", "news-raw.json")
PUBLISHED = os.path.join(ROOT, "queue", "published.json")

MIN_WORDS = 180
MAX_BODY_CHARS = 6000


def slugify(t: str) -> str:
    s = t.lower()
    s = re.sub(r"[^a-z0-9\s-]", "", s)
    s = re.sub(r"\s+", "-", s.strip())
    return re.sub(r"-+", "-", s)[:70].strip("-")


def js_str(s: str) -> str:
    return json.dumps(s, ensure_ascii=False)


def read_data() -> str:
    with open(DATA, encoding="utf-8") as f:
        return f.read()


def existing_slugs(src: str):
    return set(re.findall(r'slug:\s*"([^"]+)"', src))


def existing_srcs(src: str):
    return set(re.findall(r'src:\s*"([^"]+)"', src))


def load_json(path, default):
    if os.path.exists(path):
        try:
            with open(path, encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            pass
    return default


def save_json(path, obj):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(obj, f, indent=2, ensure_ascii=False)


def fail(msg, code=1):
    print(f"ERROR: {msg}", file=sys.stderr)
    sys.exit(code)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--json-file", help="path JSON berisi artikel (disarankan)")
    ap.add_argument("--title")
    ap.add_argument("--body")
    ap.add_argument("--source", default="Market Intel")
    ap.add_argument("--source-url", default="")
    ap.add_argument("--slug", default="")
    args = ap.parse_args()

    # ---- kumpulkan payload ----
    if args.json_file:
        if not os.path.exists(args.json_file):
            fail(f"file tidak ditemukan: {args.json_file}")
        try:
            with open(args.json_file, encoding="utf-8") as f:
                payload = json.load(f)
        except Exception as e:
            fail(f"JSON tidak valid: {e}")
        title = (payload.get("title") or "").strip()
        body = (payload.get("body") or "").strip()
        source = (payload.get("source") or "Market Intel").strip()
        source_url = (payload.get("source_url") or "").strip()
        slug_arg = (payload.get("slug") or "").strip()
    else:
        title = (args.title or "").strip()
        body = (args.body or "").strip()
        source = args.source.strip()
        source_url = args.source_url.strip()
        slug_arg = args.slug.strip()

    if not title:
        fail("judul kosong")
    if not body:
        fail("body kosong")

    body = " ".join(body.split())
    words = len(body.split())
    if words < MIN_WORDS:
        fail(f"body terlalu pendek ({words} kata, minimal {MIN_WORDS})")
    if len(body) > MAX_BODY_CHARS:
        body = body[:MAX_BODY_CHARS].rsplit(" ", 1)[0] + "."
        print(f"  ! body dipotong ke {MAX_BODY_CHARS} char", file=sys.stderr)

    src = read_data()
    have_slugs = existing_slugs(src)
    have_srcs = existing_srcs(src)

    # ---- dedup ----
    if source_url and source_url in have_srcs:
        fail(f"sumber sudah dipublikasikan: {source_url}", code=3)

    s = slug_arg or slugify(title)
    if s in have_slugs:
        fail(f"slug sudah ada: {s}", code=3)

    # ---- sisipkan entri ----
    entry = (
        "  {\n"
        f"    slug:{js_str(s)},\n"
        f"    t:{js_str(title)},\n"
        f"    s:{js_str(source)},\n"
        '    d:"Just now",\n'
        + (f"    src:{js_str(source_url)},\n" if source_url else "")
        + f"    body:{js_str(body)}\n"
        "  },\n"
    )

    marker = "const NEWS = [\n"
    if marker not in src:
        fail("tidak menemukan 'const NEWS = [' di data.js")
    src = src.replace(marker, marker + entry, 1)

    with open(DATA, "w", encoding="utf-8") as f:
        f.write(src)

    # ---- verifikasi tulisan benar-benar masuk ----
    check = read_data()
    if s not in existing_slugs(check):
        fail("penulisan gagal diverifikasi — slug tidak ada di data.js setelah tulis")

    # ---- log published (slug diambil dari data.js, bukan dari argumen) ----
    pub = load_json(PUBLISHED, [])
    pub.insert(0, {
        "slug": s,
        "title": title,
        "source": source,
        "source_url": source_url,
        "words": words,
        "published_at": datetime.now(timezone.utc).isoformat(),
    })
    save_json(PUBLISHED, pub)

    # ---- hapus dari queue mentah ----
    removed = 0
    if os.path.exists(QUEUE_FILE):
        q = load_json(QUEUE_FILE, [])
        before = len(q)
        if source_url:
            q = [x for x in q if x.get("link") != source_url]
        else:
            q = [x for x in q if x.get("title", "").lower() != title.lower()]
        removed = before - len(q)
        save_json(QUEUE_FILE, q)

    total_news = len(existing_slugs(read_data()))
    print(f"OK slug={s}")
    print(f"   kata={words} | queue dibersihkan={removed} | total NEWS={total_news}")


if __name__ == "__main__":
    main()
