#!/usr/bin/env python3
"""
publish_drafts.py — publish every draft in queue/drafts/ that passes the guards.

Reads each <slug>.md + <slug>.meta.json pair, validates it, and appends the
survivors to queue/blog-posts.json (which build.js reads).

  python3 publish_drafts.py              # publish all valid drafts
  python3 publish_drafts.py --dry-run    # validate and report, write nothing
  python3 publish_drafts.py --slug X     # publish one slug only

Guards (per article):
  - meta.json exists and parses, with slug/title/desc/keyword
  - body >= 550 words
  - body >= 5 paragraphs
  - body has >= 3 '##' subheadings
  - body has at least one '- ' bullet
  - body has the FAQ block
  - slug not already in blog-posts.json
  - keyword not already used
  - affiliate slug (if set) exists in data.js
  - referral code appears 2-3 times when affiliate is set
  - no citation artefacts ([1], '## Sources', raw http links)
"""
import argparse
import json
import os
import re
import subprocess
import sys

ROOT = os.path.dirname(os.path.abspath(__file__))
DRAFTS = os.path.join(ROOT, "queue", "drafts")
BLOG = os.path.join(ROOT, "queue", "blog-posts.json")

MIN_WORDS = 550
MIN_PARAS = 5
MIN_SUBS = 3


def load_partners():
    """Read the partner list (slug -> code) straight out of data.js via node."""
    js = (
        "const fs=require('fs');const src=fs.readFileSync('data.js','utf8');"
        "const d=new Function(src+'\\nreturn {AFFILIATE}')();"
        "const o={};d.AFFILIATE.forEach(a=>o[a.slug]={code:a.code,name:a.name});"
        "process.stdout.write(JSON.stringify(o));"
    )
    tmp = os.path.join(ROOT, "queue", "_partners.js")
    with open(tmp, "w", encoding="utf-8") as f:
        f.write(js)
    try:
        r = subprocess.run(["node", tmp], cwd=ROOT, capture_output=True, text=True)
        return json.loads(r.stdout) if r.stdout.strip() else {}
    finally:
        if os.path.exists(tmp):
            os.remove(tmp)


def check(slug, meta, body, partners, existing_slugs, existing_keywords):
    """Return (ok, reason)."""
    for field in ("slug", "title", "desc", "keyword"):
        if not meta.get(field):
            return False, f"meta missing '{field}'"
    if meta["slug"] != slug:
        return False, f"meta slug '{meta['slug']}' != filename '{slug}'"
    if len(meta["title"]) < 20:
        return False, f"title too short ({len(meta['title'])} chars)"
    if len(meta["desc"]) < 80:
        return False, f"desc too short ({len(meta['desc'])} chars)"

    if slug in existing_slugs:
        return False, "slug already published"
    if meta["keyword"].lower() in existing_keywords:
        return False, f"keyword already published: {meta['keyword']}"

    aff = (meta.get("affiliate") or "").strip()
    if aff and aff not in partners:
        return False, f"unknown affiliate slug '{aff}'"

    words = len(body.split())
    if words < MIN_WORDS:
        return False, f"only {words} words (min {MIN_WORDS})"

    blocks = [b for b in re.split(r"\n\s*\n", body) if b.strip()]
    if len(blocks) < MIN_PARAS:
        return False, f"only {len(blocks)} paragraphs (min {MIN_PARAS})"

    subs = len(re.findall(r"(?m)^#{2}\s+\S", body))
    if subs < MIN_SUBS:
        return False, f"only {subs} '##' subheadings (min {MIN_SUBS})"

    if not re.search(r"(?m)^\s*[-*]\s+\S", body):
        return False, "no bulleted list"

    if not re.search(r"(?im)^#{2,3}\s*frequently asked", body):
        return False, "no 'Frequently asked questions' section"

    # citation artefacts
    if re.search(r"\[\d+\]", body):
        return False, "contains [n] citation markers"
    if re.search(r"(?im)^#{2,3}\s*Sources\s*$", body):
        return False, "contains a '## Sources' section"
    if re.search(r"https?://\S+", body):
        return False, "contains a raw URL in the body"

    # affiliate code frequency
    if aff:
        code = partners[aff]["code"]
        n = len(re.findall(re.escape(code), body))
        if n < 2:
            return False, f"code '{code}' appears {n}x (needs 2-3)"
        if n > 3:
            return False, f"code '{code}' appears {n}x (max 3)"

    return True, f"{words} words, {len(blocks)} paras, {subs} subheads"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--slug", default=None)
    args = ap.parse_args()

    if not os.path.isdir(DRAFTS):
        print(f"no drafts dir: {DRAFTS}", file=sys.stderr)
        sys.exit(1)

    partners = load_partners()
    posts = json.load(open(BLOG, encoding="utf-8")) if os.path.exists(BLOG) else []
    existing_slugs = {p["slug"] for p in posts}
    existing_keywords = {(p.get("keyword") or "").lower() for p in posts}

    md_files = sorted(f for f in os.listdir(DRAFTS) if f.endswith(".md"))
    if args.slug:
        md_files = [f for f in md_files if f == f"{args.slug}.md"]

    published, rejected = [], []

    for mf in md_files:
        slug = mf[:-3]
        mpath = os.path.join(DRAFTS, mf)
        jpath = os.path.join(DRAFTS, f"{slug}.meta.json")

        if not os.path.exists(jpath):
            rejected.append((slug, "no .meta.json"))
            continue
        try:
            meta = json.load(open(jpath, encoding="utf-8"))
        except Exception as e:
            rejected.append((slug, f"bad meta json: {e}"))
            continue

        body = open(mpath, encoding="utf-8").read().strip()
        # normalise: collapse 3+ newlines, trim trailing spaces
        body = re.sub(r"[ \t]+\n", "\n", body)
        body = re.sub(r"\n{3,}", "\n\n", body).strip()

        ok, reason = check(slug, meta, body, partners, existing_slugs, existing_keywords)
        if not ok:
            rejected.append((slug, reason))
            continue

        aff = (meta.get("affiliate") or "").strip()
        post = {
            "slug": slug,
            "title": meta["title"].strip(),
            "desc": meta["desc"].strip(),
            "body": body,
            "affiliate": aff,
            "keyword": meta["keyword"].strip(),
            "words": len(body.split()),
            "paras": len([b for b in re.split(r"\n\s*\n", body) if b.strip()]),
            "published_at": None,
        }
        published.append(post)
        existing_slugs.add(slug)
        existing_keywords.add(meta["keyword"].lower())

    if not args.dry_run and published:
        from datetime import datetime, timezone
        for p in published:
            p["published_at"] = datetime.now(timezone.utc).isoformat()
        posts = published + posts
        with open(BLOG, "w", encoding="utf-8") as f:
            json.dump(posts, f, indent=1, ensure_ascii=False)
        # verify
        check_back = json.load(open(BLOG, encoding="utf-8"))
        got = {p["slug"] for p in check_back}
        missing = [p["slug"] for p in published if p["slug"] not in got]
        if missing:
            print(f"WRITE VERIFICATION FAILED for: {missing}", file=sys.stderr)
            sys.exit(2)

    print(f"=== {'DRY RUN' if args.dry_run else 'PUBLISHED'}: {len(published)} ===")
    for p in published:
        print(f"  OK   {p['slug']}  [{p['words']}w, {p['affiliate'] or 'editorial'}]")
    if rejected:
        print(f"\n=== REJECTED: {len(rejected)} ===")
        for s, r in rejected:
            print(f"  FAIL {s}: {r}")

    print(f"\ntotal blog posts now: {len(posts) if not args.dry_run else len(posts) + len(published)}")


if __name__ == "__main__":
    main()
