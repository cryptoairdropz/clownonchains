# ClownOnChains — cryptoairdropz.com

Static site for `https://cryptoairdropz.com`, built for Cloudflare Pages.

## Why this rebuild matters for Google

The original file rendered all content with JavaScript into empty `<div>`s.
Google has to execute JS before it sees any text, which slows indexing and
often skips the content entirely. This build fixes that:

- **Every page is server-rendered HTML.** Referral names, airdrops, news and
  tutorial text are in the initial HTML payload, not injected at runtime.
- **One URL per tutorial.** Each lesson is its own page under `/academy/<slug>/`
  instead of a modal, so each topic can rank on its own.
- **JSON-LD is valid.** One JSON object per `<script type="application/ld+json">`
  tag (`WebSite`, `Organization`, `ItemList`, `TechArticle`, `BreadcrumbList`).
  Concatenating objects into one tag makes Google ignore the whole block.
- **`app.js` is progressive enhancement only** — filters, chart, local demo
  threads. The site is fully readable with JavaScript disabled.

## Build

```bash
node build.js          # → dist/
```

Edit content in **`data.js`** (prices, referrals, airdrops, news, tutorials),
then rebuild. Never hand-edit files in `dist/` — it is wiped on every build.

## Deploy to Cloudflare Pages (no GitHub needed)

1. Cloudflare dashboard → **Workers & Pages** → **Create** → **Pages** → **Upload assets**
2. Project name: `clownonchains` (or similar)
3. Upload the **contents of `dist/`** (the folder itself, not the parent)
4. Click **Deploy site**. You get `clownonchains.pages.dev`

Then attach the real domain:

5. **Pages** → your project → **Custom domains** → **Set up a domain**
6. Enter `cryptoairdropz.com`. Cloudflare adds the DNS record automatically
   (the zone is already on Cloudflare, per your dashboard).
7. Repeat for `www.cryptoairdropz.com` if you want it.
8. SSL/TLS is automatic — the screenshot shows your zone is set to **Full (strict)**, so
   the Pages certificate will be served correctly. Make sure **Always Use HTTPS** is on
   under **SSL/TLS → Edge Certificates**.

### Optional: automatic deploys

Pages → **Settings** → **Builds** → connect a Git repo (Cloudflare has its own
free GitHub mirror if you prefer). Build command `node build.js`, output `dist`.
Only needed if you want CI; manual upload is fine to start.

## After the site is live

1. **Google Search Console** → add `cryptoairdropz.com` (DNS TXT verification,
   Cloudflare can add the record for you)
2. **Sitemaps** → submit `https://cryptoairdropz.com/sitemap.xml`
3. **URL Inspection** → paste `https://cryptoairdropz.com/` → **Request indexing**
4. Expect first crawl in 1–4 days; meaningful rankings take weeks.

## Files

| Path | Purpose |
|---|---|
| `data.js` | all editable content (single source of truth) |
| `build.js` | static site generator → `dist/` |
| `style.css` | styles |
| `app.interaction.js` | shipped as `dist/app.js` — enhancement only |
| `assets/` | favicon, OG image, apple touch icon |
| `dist/` | **generated** — this is what you upload |

## Content notes

Prices, airdrop statuses and bot stats are **static snapshots**, not live feeds.
The bot panel is a demo visualisation — it was relabelled from "Active/Connected"
to "Dashboard demo" so the page does not imply a running service or imply
investment returns. Keep that framing; misleading performance claims are the
fastest route to a manual SEO penalty.