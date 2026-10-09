#!/usr/bin/env python3
"""
fetch_news.py — ambil berita crypto terbaru dari RSS, simpan mentah ke queue.

Tidak menulis ke data.js. Tugas itu milik agent (yang memparafrase).
Output: queue/news-raw.json  (append, dedup berdasarkan guid/link)
"""
import json
import os
import re
import sys
import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime, timezone

ROOT = os.path.dirname(os.path.abspath(__file__))
QUEUE_DIR = os.path.join(ROOT, "queue")
QUEUE_FILE = os.path.join(QUEUE_DIR, "news-raw.json")

FEEDS = [
    ("CoinDesk", "https://www.coindesk.com/arc/outboundfeeds/rss/"),
    ("Cointelegraph", "https://cointelegraph.com/rss"),
    ("Decrypt", "https://decrypt.co/feed"),
    ("The Block", "https://www.theblock.co/rss.xml"),
    ("Bitcoin Magazine", "https://bitcoinmagazine.com/feed"),
]

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 "
        "(KHTML, like Gecko) Chrome/120.0 Safari/537.36"
    ),
    "Accept": "application/rss+xml, application/xml, text/xml, */*",
}

MAX_PER_FEED = 8


def strip_html(s: str) -> str:
    s = re.sub(r"<[^>]+>", " ", s or "")
    s = re.sub(r"&[a-z]+;", " ", s)
    s = re.sub(r"\s+", " ", s)
    return s.strip()


def fetch(url: str) -> bytes:
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=25) as r:
        return r.read()


def parse(xml_bytes: bytes, source: str):
    items = []
    try:
        root = ET.fromstring(xml_bytes)
    except ET.ParseError:
        return items

    # RSS 2.0
    nodes = root.findall(".//item")
    if not nodes:  # Atom
        ns = {"a": "http://www.w3.org/2005/Atom"}
        nodes = root.findall(".//a:entry", ns)

    for n in nodes[:MAX_PER_FEED]:
        def t(tag, ns_tag=None):
            el = n.find(tag)
            if el is None and ns_tag:
                el = n.find(ns_tag, {"a": "http://www.w3.org/2005/Atom"})
            return el

        title_el = t("title")
        link_el = t("link")
        guid_el = t("guid")
        desc_el = t("description") or t("summary", "a:summary")

        title = strip_html(title_el.text if title_el is not None else "")
        link = ""
        if link_el is not None:
            link = (link_el.text or link_el.get("href") or "").strip()
        guid = (guid_el.text if guid_el is not None else "") or link
        desc = strip_html(desc_el.text if desc_el is not None else "")

        if not title or not link:
            continue

        items.append({
            "source": source,
            "title": title,
            "link": link,
            "guid": guid,
            "summary": desc[:600],
            "fetched_at": datetime.now(timezone.utc).isoformat(),
        })
    return items


def main():
    os.makedirs(QUEUE_DIR, exist_ok=True)

    existing = []
    if os.path.exists(QUEUE_FILE):
        try:
            with open(QUEUE_FILE) as f:
                existing = json.load(f)
        except Exception:
            existing = []

    seen = {e.get("guid") or e.get("link") for e in existing}
    added = []

    for source, url in FEEDS:
        try:
            raw = fetch(url)
            for it in parse(raw, source):
                key = it["guid"] or it["link"]
                if key in seen:
                    continue
                seen.add(key)
                added.append(it)
            print(f"  ✓ {source}: ok", file=sys.stderr)
        except Exception as e:
            print(f"  ✗ {source}: {type(e).__name__}: {e}", file=sys.stderr)

    all_items = existing + added
    with open(QUEUE_FILE, "w") as f:
        json.dump(all_items, f, indent=2, ensure_ascii=False)

    # ringkas untuk stdout (dipakai cron agent sebagai konteks)
    print(f"QUEUE: {len(all_items)} total, {len(added)} baru")
    for it in added:
        print(f"- [{it['source']}] {it['title']}")
        print(f"  {it['link']}")
        if it["summary"]:
            print(f"  {it['summary'][:220]}")


if __name__ == "__main__":
    main()
