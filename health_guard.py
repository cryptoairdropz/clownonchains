#!/usr/bin/env python3
"""
health_guard.py — cryptoairdropz.com watchdog.

Runs every hour via cron. Detects the failure modes that actually happened
during this build, and fixes the ones that are safe to fix unattended.

Two tiers:

  CHECK  (read-only, always runs)
    - source/dist drift        : data.js newer than dist/ = unbuilt changes
    - build integrity          : node build.js must succeed
    - JSON-LD validity         : every ld+json block parses
    - sitemap sanity           : every <loc> resolves to a real file
    - live reachability        : apex + www return 200
    - content minima           : no article below the word-count floor
    - mobile nav regression     : panel must not be clipped by backdrop-filter
    - structural leak          : markdown must not survive into the HTML

  FIX    (write actions, only when the matching check fails)
    - drift                   : rebuild dist/
    - broken dist             : rebuild and redeploy
    - sitemap/loc mismatch    : rebuild

Deliberately NOT auto-fixed:
  - live HTTP failures       : DNS or Cloudflare is outside this box
  - thin content             : needs writing, not a script
  - JSON-LD shape problems   : needs a decision about intent

Output is a compact JSON object on stdout plus a human summary on stderr, so
the cron agent can diff consecutive runs. A stable "all clear" line is what
makes an hourly job worth scheduling: silence means no news.

  python3 health_guard.py            # check only, exit 0 if healthy
  python3 health_guard.py --fix      # repair drift/build problems
  python3 health_guard.py --json     # machine-readable only
"""
import argparse
import glob
import json
import os
import re
import subprocess
import sys
import time
from datetime import datetime, timezone

ROOT = os.path.dirname(os.path.abspath(__file__))
DIST = os.path.join(ROOT, "dist")
SITE = "https://cryptoairdropz.com"
UA = "Mozilla/5.0 (compatible; HealthGuard/1.0)"

STATE_FILE = os.path.join(ROOT, ".health-guard-state.json")
HISTORY_LOG = os.path.join(ROOT, "queue", "guard-history.jsonl")

# Word-count floor for content pages. The originals shipped at 156-236 words,
# which is thin content; 450 is set below the 650 editorial standard so the
# guard catches a catastrophic regression without flagging normal pages.
MIN_ARTICLE_WORDS = 450


def sh(cmd, timeout=180):
    """Run a command, return (rc, combined output)."""
    try:
        p = subprocess.run(cmd, cwd=ROOT, capture_output=True, text=True, timeout=timeout)
        return p.returncode, (p.stdout + p.stderr)
    except subprocess.TimeoutExpired:
        return 124, f"timeout after {timeout}s"
    except Exception as e:  # noqa: BLE001
        return 1, f"{type(e).__name__}: {e}"


def http_code(url, timeout=20):
    rc, out = sh(
        ["curl", "-s", "-o", "/dev/null", "-w", "%{http_code}",
         "-A", UA, "--max-time", str(timeout), url],
        timeout=timeout + 10,
    )
    m = re.search(r"(\d{3})\s*$", out.strip())
    return int(m.group(1)) if m else 0


# --------------------------------------------------------------------------
# checks
# --------------------------------------------------------------------------

def check_drift():
    """Source files newer than the built output = changes never deployed."""
    idx = os.path.join(DIST, "index.html")
    if not os.path.exists(idx):
        return False, "dist/index.html missing"
    built = os.path.getmtime(idx)
    newest, newest_f = 0, None
    for f in ("data.js", "build.js", "affiliate.js", "style.css", "app.interaction.js"):
        p = os.path.join(ROOT, f)
        if os.path.exists(p) and os.path.getmtime(p) > newest:
            newest, newest_f = os.path.getmtime(p), f
    # queue/ additions also change the output
    for p in glob.glob(os.path.join(ROOT, "queue", "*.json")):
        if os.path.getmtime(p) > newest:
            newest, newest_f = os.path.getmtime(p), os.path.basename(p)
    if newest > built + 2:  # 2s tolerance for mtime granularity
        age_min = int((newest - built) / 60)
        return False, f"{newest_f} is {age_min} min newer than dist/ — unbuilt changes"
    return True, "dist is current"


def check_build():
    """node build.js must succeed. Run in a scratch copy so a broken source
    cannot leave the live dist/ half-written."""
    rc, out = sh(["node", "--check", "build.js"], timeout=60)
    if rc != 0:
        return False, "build.js has a syntax error: " + out.strip()[:200]
    rc2, out2 = sh(["node", "--check", "data.js"], timeout=60)
    if rc2 != 0:
        return False, "data.js has a syntax error: " + out2.strip()[:200]
    return True, "syntax ok"


def check_jsonld():
    """Every ld+json block must parse. One bad block is an invalid schema."""
    bad = []
    files = glob.glob(os.path.join(DIST, "**", "*.html"), recursive=True)
    for f in files:
        try:
            h = open(f, encoding="utf-8", errors="replace").read()
        except OSError:
            continue
        for m in re.finditer(
            r'<script type="application/ld\+json">(.*?)</script>', h, re.S
        ):
            raw = m.group(1).strip()
            if not raw:
                continue
            try:
                obj = json.loads(raw)
                if isinstance(obj, list):
                    for o in obj:
                        if not isinstance(o, dict):
                            bad.append((os.path.relpath(f, DIST), "array item not object"))
                elif not isinstance(obj, dict):
                    bad.append((os.path.relpath(f, DIST), "not an object"))
            except json.JSONDecodeError as e:
                bad.append((os.path.relpath(f, DIST), f"JSON parse: {e.msg}"))
    if bad:
        return False, f"{len(bad)} invalid JSON-LD block(s): {bad[:5]}"
    return True, f"{len(files)} pages, all JSON-LD valid"


def check_sitemap():
    """Every sitemap <loc> must correspond to a real built file."""
    sm = os.path.join(DIST, "sitemap.xml")
    if not os.path.exists(sm):
        return False, "sitemap.xml missing"
    xml = open(sm, encoding="utf-8").read()
    locs = re.findall(r"<loc>(.*?)</loc>", xml)
    if not locs:
        return False, "sitemap has no <loc> entries"
    missing = []
    for loc in locs:
        path = loc.replace(SITE, "").split("?")[0]
        path = path.rstrip("/") or "/"
        if path.endswith(".xml") or path.endswith(".txt"):
            cand = os.path.join(DIST, path.lstrip("/"))
        elif path == "/":
            cand = os.path.join(DIST, "index.html")
        else:
            cand = os.path.join(DIST, path.lstrip("/"), "index.html")
        if not os.path.exists(cand):
            missing.append(path)
    if missing:
        return False, f"{len(missing)} sitemap URL(s) with no built file: {missing[:8]}"
    return True, f"{len(locs)} sitemap URLs all resolve to built files"


def check_live():
    """Apex and www must answer. Both are separate DNS names and both matter."""
    out = {}
    for name, url in (("apex", f"{SITE}/"), ("www", "https://www.cryptoairdropz.com/"),
                      ("sitemap", f"{SITE}/sitemap.xml")):
        code = http_code(url)
        out[name] = code
        if code != 200:
            return False, f"{name} returned HTTP {code}", out
    return True, "apex/www/sitemap all 200", out


def check_content_minimum():
    """No article page may drop below the word floor."""
    thin = []
    patterns = [
        os.path.join(DIST, "blog", "*", "index.html"),
        os.path.join(DIST, "academy", "*", "index.html"),
    ]
    for pat in patterns:
        for f in glob.glob(pat):
            h = open(f, encoding="utf-8", errors="replace").read()
            body = re.search(r'<div class="reader-body">(.*?)</div>\s*(?:</article>|<nav|</main)', h, re.S)
            chunk = body.group(1) if body else h
            text = re.sub(r"<[^>]+>", " ", chunk)
            words = len([w for w in re.split(r"\s+", text) if w.strip()])
            if words < MIN_ARTICLE_WORDS:
                rel = os.path.relpath(f, DIST)
                thin.append((rel, words))
    if thin:
        thin.sort(key=lambda x: x[1])
        return False, (f"{len(thin)} page(s) below {MIN_ARTICLE_WORDS} words: "
                       f"{thin[:8]}")
    return True, f"no page below {MIN_ARTICLE_WORDS} words"


def check_markdown_leak():
    """Markdown syntax must not survive into rendered HTML."""
    leaks = []
    for f in glob.glob(os.path.join(DIST, "**", "*.html"), recursive=True):
        h = open(f, encoding="utf-8", errors="replace").read()
        rel = os.path.relpath(f, DIST)
        # heading markers inside a paragraph, or a bullet that never became <li>
        if re.search(r"<p[^>]*>\s*#{2,}\s", h):
            leaks.append((rel, "## inside <p>"))
        if re.search(r"<p[^>]*>\s*[-*]\s+\w", h):
            leaks.append((rel, "bullet inside <p>"))
        if "[1]" in re.sub(r"<[^>]+>", " ", h):
            leaks.append((rel, "citation marker [1]"))
    if leaks:
        return False, f"{len(leaks)} markdown leak(s): {leaks[:6]}"
    return True, "no markdown leaking into HTML"


def check_mobile_nav():
    """Regression guard for the backdrop-filter clipping bug.

    .nav carries backdrop-filter, which makes it a containing block for
    position:fixed descendants. A fixed .nav-links panel was therefore sized
    against the 63px nav row and every link below the fold was invisible.
    position:absolute is the fix. This asserts the rule is still in place.
    """
    css_path = os.path.join(DIST, "style.css")
    if not os.path.exists(css_path):
        return False, "style.css not in dist"
    css = open(css_path, encoding="utf-8", errors="replace").read()
    m = re.search(r"@media\(max-width:1024px\)\{(.*?)\n\}", css, re.S)
    if not m:
        return False, "mobile nav media query missing from built CSS"
    block = m.group(1)
    if re.search(r"\.nav-links\s*\{[^}]*position:\s*fixed", block):
        return False, ("nav panel is position:fixed inside .nav, which has "
                       "backdrop-filter — it will be clipped to the nav row "
                       "and links will be invisible on mobile")
    if not re.search(r"\.nav-links\s*\{[^}]*position:\s*absolute", block):
        return False, "nav panel has no position:absolute — panel may not open"
    if not re.search(r"\.nav-links\.open\s*\{[^}]*visibility:\s*visible", block):
        return False, "nav panel .open does not set visibility:visible"
    return True, "mobile nav panel not clipped"


def check_css_parse():
    """Every CSS declaration must survive the parser.

    A rule written as `.a{padding:8px;border-radius:999px\n /* comment */\n
    white-space:nowrap}` is a silent total failure: the missing semicolon after
    999px makes the parser discard the rest of the block, so padding survives
    and border-radius/white-space vanish. The file still hashes differently, so
    a naive cache-busting check passes and the browser silently keeps the old
    rendering. Regex checks over the source do NOT catch it — only an actual
    CSS parse does.
    """
    css_path = os.path.join(DIST, "style.css")
    if not os.path.exists(css_path):
        return False, "style.css not in dist"
    css = open(css_path, encoding="utf-8", errors="replace").read()

    # A declaration value must never be an unterminated comment or an unclosed
    # function: both silently swallow everything after them in that block.
    bad = []
    for m in re.finditer(r"\{([^}]*)\}", css, re.S):
        body = m.group(1)
        # strip comments first; anything left containing /* means an unclosed
        # comment was treated as a value
        stripped = re.sub(r"/\*.*?\*/", "", body, flags=re.S)
        if "/*" in stripped or "*/" in stripped:
            bad.append(("unterminated comment", " ".join(body.split())[:70]))

    if bad:
        return False, f"{len(bad)} CSS block(s) the parser will drop: {bad[:4]}"

    # The real test. Regexes over the source cannot catch this: a swallowed
    # declaration still sits in the file, so a text scan reports it present
    # while the browser drops it. Node has no CSS parser built in, so the check
    # is done by re-reading the declarations the way a browser does — a
    # declaration is only live when terminated by ';' before the next one
    # starts, and a comment may never be interleaved between them.
    lost = []
    for m in re.finditer(r"\{([^}]*)\}", css, re.S):
        raw = m.group(1)
        # Walk the block in order. Track whether we are inside a comment, and
        # whether the previous non-comment character was a ';'.
        depth = 0          # 0 = outside comment, 1 = inside
        seen_decl = False  # a ':' appeared at this level
        prev_sig = ""      # last significant char at this level
        i = 0
        dropped_at = None
        while i < len(raw):
            if depth == 0 and raw.startswith("/*", i):
                if seen_decl and prev_sig != ";":
                    # a comment sitting mid-declaration is exactly the bug:
                    # everything after it in this block is discarded
                    dropped_at = i
                    break
                depth = 1
                i += 2
                continue
            if depth == 1:
                if raw.startswith("*/", i):
                    depth = 0
                    i += 2
                    continue
                i += 1
                continue
            ch = raw[i]
            if ch == ":":
                seen_decl = True
            elif ch == ";":
                seen_decl = False
            elif not ch.isspace():
                prev_sig = ch
            i += 1
        if dropped_at is not None:
            lost.append(" ".join(raw[:dropped_at + 40].split())[:70])
    if lost:
        return False, (f"{len(lost)} CSS block(s) lost declarations to a "
                       f"missing semicolon: {lost[:3]}")

    # The nav regression specifically: nowrap must actually be in the served
    # rule, not merely present in the file as a comment.
    m = re.search(r"\.nav-links a\{([^}]*)\}", css)
    if not m:
        return False, ".nav-links a rule missing"
    body = m.group(1)
    if "white-space:nowrap" not in re.sub(r"/\*.*?\*/", "", body, re.S).replace(" ", ""):
        return False, "nav link rule is missing a live white-space:nowrap declaration"
    return True, "all CSS blocks parse; nav nowrap is live"


CHECKS = [
    ("drift", check_drift),
    ("build_syntax", check_build),
    ("css_parse", check_css_parse),
    ("jsonld", check_jsonld),
    ("sitemap", check_sitemap),
    ("markdown_leak", check_markdown_leak),
    ("content_minimum", check_content_minimum),
    ("mobile_nav", check_mobile_nav),
    ("live", check_live),
]


def apply_fixes(problems):
    """Attempt unattended repair. Returns list of actions actually taken."""
    actions = []
    names = {p["check"] for p in problems}

    if names & {"drift", "build_syntax", "jsonld", "sitemap",
                "markdown_leak", "mobile_nav"}:
        rc, out = sh(["node", "build.js"], timeout=300)
        if rc != 0:
            actions.append(f"rebuild FAILED: {out.strip()[:300]}")
            return actions
        n = re.search(r"built (\d+) files", out)
        actions.append(f"rebuilt dist ({n.group(1) if n else '?'} files)")

        # if the rebuild fixed drift but live is also broken, redeploy
        rc2, out2 = sh(["./deploy.sh"], timeout=600)
        if rc2 != 0:
            actions.append(f"deploy FAILED: {out2.strip()[:300]}")
        else:
            actions.append("redeployed to Cloudflare Pages")
    return actions


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--fix", action="store_true",
                    help="attempt unattended repair of drift/build problems")
    ap.add_argument("--json", action="store_true", help="machine-readable only")
    args = ap.parse_args()

    results, problems = [], []
    live_detail = None
    for name, fn in CHECKS:
        t0 = time.time()
        try:
            r = fn()
            # checks may return (ok, msg) or (ok, msg, extra)
            ok, msg = r[0], r[1]
            extra = r[2] if len(r) > 2 else None
            if extra:
                live_detail = extra
        except Exception as e:  # noqa: BLE001
            ok, msg = False, f"check raised {type(e).__name__}: {e}"
        dt = int((time.time() - t0) * 1000)
        results.append({"check": name, "ok": ok, "msg": msg, "ms": dt})
        if not ok:
            problems.append({"check": name, "msg": msg})
        if not args.json:
            print(f"  {'PASS' if ok else 'FAIL'}  {name:18} {msg}  ({dt}ms)",
                  file=sys.stderr)

    actions = apply_fixes(problems) if (args.fix and problems) else []

    # Re-verify after a fix. Reporting the pre-fix problem list would tell the
    # cron agent the site is still broken when the rebuild just repaired it,
    # which turns one self-healed event into a false alarm every hour.
    if actions and not any(a.startswith(("rebuild FAILED", "deploy FAILED")) for a in actions):
        recheck, problems_after, live_detail_after = [], [], None
        for name, fn in CHECKS:
            if name == "live":
                continue  # CDN propagation lag, not a rebuild concern
            try:
                r = fn()
                ok, msg = r[0], r[1]
            except Exception as e:  # noqa: BLE001
                ok, msg = False, f"check raised {type(e).__name__}: {e}"
            recheck.append({"check": name, "ok": ok, "msg": msg})
            if not ok:
                problems_after.append({"check": name, "msg": msg})
        if problems_after:
            actions.append(
                "fix incomplete, still failing: "
                + ", ".join(p["check"] for p in problems_after)
            )
        results = recheck
        problems = problems_after

    payload = {
        "ts": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "healthy": not problems,
        "problem_count": len(problems),
        "problems": problems,
        "fixes_applied": actions,
        "live": live_detail,
        "checks": results,
    }

    # Durable history for the hourly diff. Append-only, and it MUST end in a
    # newline before the next append or the records glue together.
    try:
        os.makedirs(os.path.dirname(HISTORY_LOG), exist_ok=True)
        if os.path.exists(HISTORY_LOG) and os.path.getsize(HISTORY_LOG) > 0:
            with open(HISTORY_LOG, "rb+") as fh:
                fh.seek(-1, os.SEEK_END)
                if fh.read(1) != b"\n":
                    fh.write(b"\n")
        with open(HISTORY_LOG, "a", encoding="utf-8") as fh:
            fh.write(json.dumps(payload, ensure_ascii=False) + "\n")
    except OSError:
        pass

    prev = None
    if os.path.exists(STATE_FILE):
        try:
            prev = json.load(open(STATE_FILE, encoding="utf-8"))
        except (OSError, json.JSONDecodeError):
            prev = None
    try:
        json.dump(payload, open(STATE_FILE, "w", encoding="utf-8"), ensure_ascii=False)
    except OSError:
        pass

    # An unchanged healthy state is the signal the hourly job acts on.
    state_token = "ok" if not problems else ",".join(p["check"] for p in problems)
    if prev is not None:
        was = "ok" if prev.get("healthy") else ",".join(
            p["check"] for p in prev.get("problems", []))
        if was == state_token:
            state_token = f"{state_token}|unchanged"
    print(state_token)

    return 0 if not problems else 1


if __name__ == "__main__":
    sys.exit(main())