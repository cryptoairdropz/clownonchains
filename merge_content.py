#!/usr/bin/env python3
"""
merge_content.py — splice generated tutorials and glossary terms into data.js.

Both writers work in separate JSON files under queue/, so this is the only
place that touches data.js. Everything is validated BEFORE any write, and the
file is backed up first, because a partial splice into data.js is a broken
site rather than a small mistake.

  python3 merge_content.py --dry-run
  python3 merge_content.py
"""
import argparse
import json
import os
import re
import shutil
import subprocess
import sys

ROOT = os.path.dirname(os.path.abspath(__file__))
DATA = os.path.join(ROOT, "data.js")

MIN_WORDS, MIN_H2, MIN_H3 = 650, 4, 3


def load_json(path):
    if not os.path.exists(path):
        return []
    with open(path, encoding="utf-8") as fh:
        return json.load(fh)


def validate_tutorials(items, existing_titles, existing_ids):
    """Return (ok_items, rejections)."""
    ok, bad = [], []
    for t in items:
        body = t.get("body", "")
        w = len(body.split())
        h2 = len(re.findall(r"^##\s+", body, re.M))
        h3 = len(re.findall(r"^###\s+", body, re.M))
        bul = len(re.findall(r"^\s*-\s+", body, re.M))
        problems = []
        if w < MIN_WORDS:
            problems.append(f"{w}w < {MIN_WORDS}")
        if h2 < MIN_H2:
            problems.append(f"h2={h2}")
        if h3 < MIN_H3:
            problems.append(f"h3={h3}")
        if bul < 1:
            problems.append("no bullets")
        if not re.search(r"##\s*Frequently asked", body, re.I):
            problems.append("no FAQ")
        if not t.get("title"):
            problems.append("no title")
        elif t["title"] in existing_titles:
            problems.append("duplicate title")
        if t.get("level") not in ("Beginner", "Intermediate", "Advanced"):
            problems.append(f"bad level {t.get('level')!r}")
        if problems:
            bad.append((t.get("title", "?"), problems))
            continue
        ok.append(t)
    return ok, bad


def validate_glossary(items, existing_slugs):
    ok, bad = [], []
    seen = set()
    for g in items:
        problems = []
        for field in ("slug", "term", "short", "body"):
            if not g.get(field):
                problems.append(f"missing {field}")
        slug = g.get("slug", "")
        if slug in existing_slugs:
            problems.append("duplicate slug")
        if slug in seen:
            problems.append("slug repeated in file")
        seen.add(slug)
        if not re.fullmatch(r"[a-z0-9-]+", slug):
            problems.append("slug not kebab-case")
        body = g.get("body", "")
        # Existing glossary bodies run 53-76 words: a definition page, not an
        # article. The floor is set just under that band so a stub is rejected
        # while a real definition passes. Enforcing article-length here would
        # reject every correct entry.
        bw = len(body.split())
        if bw < 45:
            problems.append(f"body only {bw}w < 45")
        if bw > 400:
            problems.append(f"body {bw}w — glossary entries stay short")
        # NO heading requirement. A glossary body is 2-4 plain paragraphs with
        # blank-line separation; the generator wraps it, it is not authored
        # markdown. Requiring '##' here rejects content that matches the live
        # format exactly.
        if "\n\n" not in body:
            problems.append("body has no paragraph break — reads as one wall of text")
        if problems:
            bad.append((g.get("term", "?"), problems))
            continue
        ok.append(g)
    return ok, bad


def js_str(s):
    """Encode as a double-quoted JS string literal (JSON escaping is a subset)."""
    return json.dumps(s, ensure_ascii=False)


def insert_before(src, array_name, entries, start_id=None):
    """Insert entry objects just before the closing "];" of `const ARRAY = [`."""
    marker = f"const {array_name} = ["
    i = src.find(marker)
    if i < 0:
        raise SystemExit(f"could not find {marker}")
    end = src.find("\n];", i)
    if end < 0:
        raise SystemExit(f"could not find the end of {array_name}")

    if not entries:
        return src, 0

    # The last existing entry ends with "\n  }," — match it so we append after.
    body = src[i:end]
    tail = body.rstrip()
    if tail.endswith(","):
        add = "".join("\n" + e + "," for e in entries)
        new_body = tail + add
    else:
        add = "".join("\n  " + e + "," for e in entries)
        new_body = tail + "," + add
    return src[:i] + new_body + src[end:], len(entries)


def tut_entry(t, next_id):
    return (
        "  {\n"
        f"    id:{next_id}, title:{js_str(t['title'])}, level:{js_str(t.get('level', 'Beginner'))}, "
        f"min:{int(t.get('min', 8))},\n"
        f"    body:{js_str(t['body'])}\n"
        "  }"
    )


def gloss_entry(g):
    return (
        "  {\n"
        f"    slug:{js_str(g['slug'])}, term:{js_str(g['term'])},\n"
        f"    short:{js_str(g['short'])},\n"
        f"    body:{js_str(g['body'])}\n"
        "  }"
    )


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    src = open(DATA, encoding="utf-8").read()

    existing_titles = set(re.findall(r'title:"((?:[^"\\]|\\.)*)"', src))
    ids = [int(x) for x in re.findall(r"\{\s*\n\s*id:\s*(\d+)", src)]
    next_id = (max(ids) if ids else 0) + 1

    gl = re.search(r"const GLOSSARY = \[", src)
    gl_end = src.find("\n];", gl.start())
    gl_block = src[gl.start():gl_end]
    existing_slugs = set()
    for m in re.finditer(r"slug:(\"(?:[^\"\\]|\\.)*\")", gl_block):
        existing_slugs.add(json.loads(m.group(1)))

    tutorials = load_json(os.path.join(ROOT, "queue", "new-tutorials.json"))
    glossary = load_json(os.path.join(ROOT, "queue", "new-glossary.json"))

    ok_t, bad_t = validate_tutorials(tutorials, existing_titles, ids)
    ok_g, bad_g = validate_glossary(glossary, existing_slugs)

    print(f"tutorials: {len(ok_t)}/{len(tutorials)} valid")
    for title, problems in bad_t:
        print(f"  REJECT {title[:50]}: {', '.join(problems)}")
    print(f"glossary : {len(ok_g)}/{len(glossary)} valid")
    for term, problems in bad_g:
        print(f"  REJECT {term}: {', '.join(problems)}")

    if not ok_t and not ok_g:
        print("\nnothing valid to insert")
        return 1

    print(f"\nnext tutorial id: {next_id}")

    # Splice tutorials
    t_entries = [tut_entry(t, next_id + n) for n, t in enumerate(ok_t)]
    src, n_t = insert_before(src, "TUTORIALS", t_entries)

    # Splice glossary
    g_entries = [gloss_entry(g) for g in ok_g]
    src, n_g = insert_before(src, "GLOSSARY", g_entries)

    print(f"inserted: {n_t} tutorials, {n_g} glossary terms")

    if args.dry_run:
        print("(dry run — nothing written)")
        return 0

    backup = DATA + ".bak"
    shutil.copy2(DATA, backup)

    # Validate the result parses and builds BEFORE overwriting the real file.
    # The probe must keep a .js extension — Node refuses to syntax-check an
    # unknown extension, which would make this guard fail open and let a
    # broken splice through.
    probe = os.path.join(ROOT, ".merge-probe.js")
    with open(probe, "w", encoding="utf-8") as fh:
        fh.write(src)
    r = subprocess.run(["node", "--check", probe], capture_output=True, text=True)
    if r.returncode != 0:
        os.remove(probe)
        print("\nSPLICE PRODUCED INVALID JS — data.js untouched")
        print(r.stderr[:800])
        return 1
    os.remove(probe)

    with open(DATA, "w", encoding="utf-8") as fh:
        fh.write(src)
    print(f"\nwrote {DATA} (backup at {os.path.basename(backup)})")

    r = subprocess.run(["node", "build.js"], cwd=ROOT, capture_output=True, text=True)
    if r.returncode != 0:
        shutil.copy2(backup, DATA)
        print("build FAILED — data.js restored from backup")
        print(r.stderr[:800])
        return 1
    print(r.stdout.strip().split("\n")[0])
    return 0


if __name__ == "__main__":
    sys.exit(main())