#!/usr/bin/env python3
"""
indexnow.py — submit URLs to IndexNow (Bing, Yandex, Seznam, Naver).

IndexNow pushes a URL to participating search engines immediately, instead of
waiting for them to discover it by crawling. Google does not participate, but
Bing powers a meaningful share of search and Copilot/Bing Chat answers.

The key file must be reachable at:
  https://cryptoairdropz.com/<KEY>.txt
and contain exactly the key.

  python3 indexnow.py --all           # submit every URL in the sitemap
  python3 indexnow.py --slug X        # submit one blog article
  python3 indexnow.py --recent 20     # submit the 20 newest blog articles
  python3 indexnow.py --status        # check the key file is reachable
"""
import argparse
import json
import os
import re
import sys
import urllib.request

ROOT = os.path.dirname(os.path.abspath(__file__))
KEY = "a7f3c9e21b8d4f6a5c0e9b3d7f1a2c48"
HOST = "cryptoairdropz.com"
SITE = f"https://{HOST}"
ENDPOINT = "https://api.indexnow.org/indexnow"


def sitemap_urls():
    p = os.path.join(ROOT, "dist", "sitemap.xml")
    if not os.path.exists(p):
        return []
    return re.findall(r"<loc>([^<]+)</loc>", open(p, encoding="utf-8").read())


def recent_blog(n):
    p = os.path.join(ROOT, "queue", "blog-posts.json")
    if not os.path.exists(p):
        return []
    posts = json.load(open(p, encoding="utf-8"))
    posts.sort(key=lambda x: x.get("published_at") or "", reverse=True)
    return [f"{SITE}/blog/{x['slug']}/" for x in posts[:n]]


def submit(urls):
    if not urls:
        print("no URLs to submit", file=sys.stderr)
        return 1
    payload = {
        "host": HOST,
        "key": KEY,
        "keyLocation": f"{SITE}/{KEY}.txt",
        "urlList": urls,
    }
    data = json.dumps(payload).encode()
    req = urllib.request.Request(
        ENDPOINT,
        data=data,
        headers={
            "Content-Type": "application/json; charset=utf-8",
            "Accept": "*/*",
            "User-Agent": (
                "Mozilla/5.0 (compatible; ClownOnChains/1.0; "
                "+https://cryptoairdropz.com/)"
            ),
        },
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            code = r.status
            body = r.read().decode(errors="replace")
        print(f"IndexNow HTTP {code} — submitted {len(urls)} URL(s)")
        if code in (200, 202):
            print("  accepted")
        elif code == 400:
            print("  bad request — check key format")
        elif code == 403:
            print("  key not valid — verify the key file is live")
        elif code == 422:
            print("  URLs do not belong to host, or key mismatch")
        elif code == 429:
            print("  rate limited — retry later")
        if body.strip():
            print(" ", body[:300])
        return 0 if code in (200, 202) else 1
    except Exception as e:
        print(f"IndexNow request failed: {e}", file=sys.stderr)
        return 1


def status():
    url = f"{SITE}/{KEY}.txt"
    try:
        req = urllib.request.Request(
            url, headers={"User-Agent": "Mozilla/5.0 (compatible; ClownOnChains/1.0)"}
        )
        with urllib.request.urlopen(req, timeout=15) as r:
            body = r.read().decode().strip()
        ok = body == KEY
        print(f"key file: HTTP {r.status} at {url}")
        print(f"  contents match key: {ok}")
        if not ok:
            print(f"  expected '{KEY}', got '{body[:80]}'")
        return 0 if ok else 1
    except Exception as e:
        print(f"key file NOT reachable: {e}", file=sys.stderr)
        print(f"  expected at {url}")
        return 1


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--all", action="store_true")
    ap.add_argument("--slug")
    ap.add_argument("--recent", type=int)
    ap.add_argument("--status", action="store_true")
    a = ap.parse_args()

    if a.status:
        sys.exit(status())

    if a.all:
        urls = sitemap_urls()
    elif a.recent:
        urls = recent_blog(a.recent)
    elif a.slug:
        urls = [f"{SITE}/blog/{a.slug}/"]
    else:
        ap.print_help()
        sys.exit(2)

    print(f"submitting {len(urls)} URL(s) to IndexNow")
    for u in urls[:5]:
        print(f"  {u}")
    if len(urls) > 5:
        print(f"  ... and {len(urls)-5} more")
    sys.exit(submit(urls))


if __name__ == "__main__":
    main()
