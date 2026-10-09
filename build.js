/**
 * build.js — Static site generator untuk ClownOnChains
 *
 * Sumber data: data.js  (edit di sana, lalu jalankan `node build.js`)
 * Output:      dist/    (upload ke Cloudflare Pages)
 *
 * Kenapa tidak cukup HTML statis biasa:
 * - Konten di-render JS = Google harus eksekusi JS dulu (bad for index)
 * - Satu halaman panjang = tidak ada URL per topik untuk di-index
 * Di sini: tiap tutorial jadi halaman sendiri + JSON-LD Article + sitemap.
 */
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const DIST = path.join(ROOT, 'dist');
const SITE = 'https://cryptoairdropz.com';

/* ------------------------------------------------------------------ */
/* 1. Muat data dari data.js                                           */
/* ------------------------------------------------------------------ */
function loadData() {
  const src = fs.readFileSync(path.join(ROOT, 'data.js'), 'utf8');
  // eslint-disable-next-line no-new-func
  const fn = new Function(`${src}\nreturn { PRICES, REFERRALS, AIRDROPS, NEWS, TUTORIALS };`);
  return fn();
}

/* ------------------------------------------------------------------ */
/* 2. Helpers                                                           */
/* ------------------------------------------------------------------ */
const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));

const usd = (n) => '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const slug = (t) =>
  String(t).toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');

const inlineMd = (t) => esc(t).replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

/** markdown-lite → HTML (paragraf, list, bold) */
function mdToHtml(text) {
  return text.split('\n\n').map((p) => {
    const lines = p.split('\n').filter(Boolean);
    const isList = lines.length > 1 && lines.every((l) => /^\s*[-*\d]/.test(l));
    if (isList) {
      const items = lines
        .map((l) => inlineMd(l.replace(/^\s*[-*]\s*/, '').replace(/^\s*\d+\.\s*/, '')))
        .map((li) => `<li>${li}</li>`)
        .join('');
      return `<ul>${items}</ul>`;
    }
    return `<p>${lines.map(inlineMd).join('<br/>')}</p>`;
  }).join('\n');
}

const todayISO = new Date().toISOString().slice(0, 10);

/* ------------------------------------------------------------------ */
/* 3. Partial templates                                                 */
/* ------------------------------------------------------------------ */
const BRAND = `<a class="brand" href="/">
        <span class="brand-badge" aria-hidden="true">◆</span>
        <span>Clown<span class="accent">OnChains</span></span>
      </a>`;

const NAV = `  <nav class="nav">
    <div class="nav-inner">
      ${BRAND}
      <div class="nav-links">
        <a href="/#referrals">Exchange</a>
        <a href="/#bots">Web3 Bots</a>
        <a href="/#airdrop">Airdrops</a>
        <a href="/#news">News</a>
        <a href="/#edu">Learn</a>
        <a href="/#community">Community</a>
      </div>
      <a class="btn" href="/#community">Community</a>
    </div>
  </nav>`;

const FOOTER = `  <footer>
    <div class="wrap foot-inner">
      <div class="foot-brand"><span style="color:var(--amber)">◆</span> Clown<span style="color:var(--amber)">OnChains</span></div>
      <div>© ${new Date().getFullYear()} ClownOnChains · cryptoairdropz.com · Not financial advice.</div>
      <div><a href="/sitemap.xml">Sitemap</a> · <a href="/academy/">Academy</a></div>
    </div>
  </footer>`;

const TICKER = `  <div class="ticker" aria-label="Cryptocurrency prices">
    <div class="ticker-inner" id="ticker">${null}</div>
  </div>`;

/**
 * @param {object} o
 * @returns {string} penuh <head>
 */
function head(o) {
  /* Google requires EXACTLY ONE valid JSON object per ld+json tag.
     Concatenating several objects inside one tag makes the whole block
     invalid and it gets silently ignored. Emit one tag per object.
     Accepts either a single object or an array of objects. */
  const blocks = (() => {
    if (!o.jsonld) return '';
    const arr = Array.isArray(o.jsonld) ? o.jsonld : [o.jsonld];
    return arr
      .map((obj) => `\n  <script type="application/ld+json">\n  ${JSON.stringify(obj, null, 2)}\n  </script>`)
      .join('');
  })();

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  <title>${esc(o.title)}</title>
  <meta name="description" content="${esc(o.desc)}" />
  ${o.keywords ? `<meta name="keywords" content="${esc(o.keywords)}" />` : ''}
  <meta name="author" content="ClownOnChains" />
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />
  <link rel="canonical" href="${o.canonical}" />
  <meta property="og:type" content="${o.ogType || 'website'}" />
  <meta property="og:url" content="${o.canonical}" />
  <meta property="og:title" content="${esc(o.title)}" />
  <meta property="og:description" content="${esc(o.desc)}" />
  <meta property="og:image" content="${SITE}/assets/og-cover.png" />
  <meta property="og:site_name" content="ClownOnChains" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${esc(o.title)}" />
  <meta name="twitter:description" content="${esc(o.desc)}" />
  <meta name="twitter:image" content="${SITE}/assets/og-cover.png" />
  <meta name="theme-color" content="#171009" />
  <link rel="icon" href="/assets/favicon.svg" type="image/svg+xml" />
  <link rel="apple-touch-icon" href="/assets/apple-touch-icon.png" />
  <link rel="alternate" type="application/rss+xml" title="ClownOnChains Academy" href="/feed.xml" />${blocks}
  <link rel="stylesheet" href="/style.css" />
</head>`;
}

/* ------------------------------------------------------------------ */
/* 4. Halaman utama — 100% konten statis                               */
/* ------------------------------------------------------------------ */
function buildHome(d) {
  // ticker (statis, terbaca crawler)
  const tickerHtml = d.PRICES.map((p) =>
    `<span class="sym">${esc(p.sym)}</span> <span class="px">${usd(p.px)}</span>` +
    `<span class="chg ${p.chg >= 0 ? 'up' : 'down'}">${p.chg >= 0 ? '+' : ''}${p.chg.toFixed(1)}%</span>`
  ).join('') + '<span class="ago">snapshot</span>';

  // referrals
  const referralsHtml = d.REFERRALS.map((r) => `
        <article class="card hover">
          <div class="ref-name">${esc(r.name)}</div>
          <p class="ref-desc">${esc(r.desc)}</p>
          <div class="ref-meta">
            <div>
              <div class="ref-bonus">${esc(r.bonus)}</div>
              <div class="ref-clicks">Referral partner</div>
            </div>
            <a class="btn primary" href="${esc(r.url)}" target="_blank" rel="noopener nofollow sponsored">Claim</a>
          </div>
        </article>`).join('');

  // airdrops
  const airStatus = (s) =>
    /farm/i.test(s) ? 'Farming' : /claim/i.test(s) ? 'Claiming' : /snapshot/i.test(s) ? 'Snapshot' : 'Other';

  const airdropsHtml = d.AIRDROPS.map((a) => {
    const live = /farm/i.test(a.status);
    const soon = /claim/i.test(a.status);
    return `
        <article class="card hover air-card" data-status="${airStatus(a.status)}">
          <div class="air-top">
            <div style="display:flex;align-items:center;gap:11px">
              <div class="air-logo" aria-hidden="true">${esc(a.name.slice(0, 1))}</div>
              <div>
                <div class="air-name">${esc(a.name)}</div>
                <div class="air-status">${esc(a.status)}</div>
              </div>
            </div>
            <span class="air-tag">${esc(a.tag)}</span>
          </div>
          <div class="air-foot">
            <span class="air-time ${live ? 'badge-live' : soon ? 'badge-soon' : ''}">${esc(a.tf)}</span>
            ${a.url ? `<a class="tut-meta" style="margin:0" href="${esc(a.url)}" target="_blank" rel="noopener nofollow">Open →</a>` : ''}
          </div>
        </article>`;
  }).join('');

  // news
  const newsHtml = d.NEWS.map((n) => `
        <article class="news-item">
          <h3 class="news-title" style="margin:0;font-size:14.5px">
            ${n.u ? `<a href="${esc(n.u)}" target="_blank" rel="noopener nofollow">${esc(n.t)}</a>` : esc(n.t)}
          </h3>
          <div class="news-meta">${esc(n.s)} · ${esc(n.d)}</div>
        </article>`).join('');

  // academy cards → link ke halaman statis per tutorial (SEO!)
  const tutsHtml = d.TUTORIALS.map((t) => `
          <a class="card hover tut-card" href="/academy/${slug(t.title)}/" data-level="${t.level}">
            <span class="tut-level lvl-${t.level}">${t.level}</span>
            <span class="tut-title">${esc(t.title)}</span>
            <span class="tut-meta">🕐 ${t.min} min read <span style="margin-left:auto">→</span></span>
          </a>`).join('');

  const websiteLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'ClownOnChains',
    description: 'Web3 portal for airdrop alpha, trading bots, and a practical crypto academy.',
    url: `${SITE}/`,
    inLanguage: 'en',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE}/?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  const orgLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'ClownOnChains',
    url: `${SITE}/`,
    logo: `${SITE}/assets/favicon.svg`,
  };

  const itemLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Crypto Academy Lessons',
    itemListElement: d.TUTORIALS.map((t, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: t.title,
      url: `${SITE}/academy/${slug(t.title)}/`,
    })),
  };

  return `${head({
    title: 'ClownOnChains — Airdrop Tracker, Crypto Academy & Web3 Trading Guides',
    desc: 'Track crypto and Web3 airdrops with status and deadlines, learn airdrop farming, impermanent loss, Supertrend and DeFi basics in plain English. Practical crypto guides, not hype.',
    keywords: 'crypto airdrop tracker, airdrop farming, web3 academy, defi tutorial, crypto trading guide, solana airdrop',
    canonical: `${SITE}/`,
    jsonld: [websiteLd, orgLd, itemLd],
  })}
<body>
${TICKER.replace('${null}', tickerHtml)}
${NAV}

  <header class="hero">
    <div class="hero-glow" aria-hidden="true"></div>
    <div class="wrap" style="position:relative">
      <h1>Master the <span class="grad">On-Chain</span> Chaos</h1>
      <p>Airdrop radar, trading bot dashboards, and a crypto academy that actually teaches —
         wallet safety, airdrop farming, DeFi mechanics and indicator setups in plain English.</p>
      <div class="hero-actions">
        <a class="btn primary" href="#airdrop">Browse Airdrops</a>
        <a class="btn ghost" href="/academy/">Start Learning</a>
      </div>
    </div>
    <div class="wrap stats" aria-label="Portal statistics">
      <div class="stat-tile"><div class="n">${d.AIRDROPS.length}</div><div class="l">Airdrops tracked</div></div>
      <div class="stat-tile"><div class="n">${d.REFERRALS.length}</div><div class="l">Referral partners</div></div>
      <div class="stat-tile"><div class="n">${d.TUTORIALS.length}</div><div class="l">Academy lessons</div></div>
      <div class="stat-tile"><div class="n">${d.NEWS.length}</div><div class="l">Latest stories</div></div>
    </div>
  </header>

  <main class="wrap" style="padding-bottom:40px">

    <section class="block" id="referrals" aria-labelledby="h-referrals">
      <div class="section-head">
        <h2 class="section-title" id="h-referrals" style="margin:0"><span class="ic" aria-hidden="true">🎁</span> Referral Exchange Hub</h2>
      </div>
      <p class="section-sub">Partner exchanges — listed for convenience, not endorsement. Always verify a platform's
        licensing in your country before depositing.</p>
      <div class="grid cols-4">${referralsHtml}
      </div>
    </section>

    <div class="divider"></div>

    <section class="block" id="bots" aria-labelledby="h-bots">
      <div class="section-head">
        <h2 class="section-title" id="h-bots" style="margin:0"><span class="ic" aria-hidden="true">⌨️</span> Web3 Trading Bots</h2>
        <span class="pill"><span class="dot"></span> Dashboard demo</span>
      </div>
      <p class="section-sub">Visualisation of the indicator stack used in our guides. Values shown are static examples,
        not live positions — nothing here is financial advice.</p>
      <div class="split uneven">
        <div class="card bot-card">
          <div class="bot-title">HYPE-USD Sniper <span class="tag-active">Example</span></div>
          <p style="color:var(--text-dim);font-size:13px;margin:3px 0 0">Multi-indicator trend following</p>
          <div class="stat-grid">
            <div class="stat"><div class="k">Supertrend</div><div class="v up">BULL (95, 5)</div></div>
            <div class="stat"><div class="k">RSI (14)</div><div class="v">62.4 — Neutral</div></div>
            <div class="stat"><div class="k">Bollinger Bands</div><div class="v warn">Squeeze</div></div>
            <div class="stat"><div class="k">PNL (24h)</div><div class="v up">+$452.10</div></div>
          </div>
          <div class="chart" aria-hidden="true">
            <span class="lbl">Example 15m bars</span>
            <span id="chart-bars" style="display:flex;flex:1;gap:3px;align-items:flex-end;height:100%"></span>
          </div>
        </div>
        <div class="card bot-card">
          <div class="bot-title">⚡ Raydium Sniper</div>
          <p style="color:var(--text-dim);font-size:13px;margin:4px 0 14px">Solana liquidity pool automation — spec sheet</p>
          <div class="kv"><span class="k">Target Pools</span><span class="v">New pairs</span></div>
          <div class="kv"><span class="k">Slippage</span><span class="v">15%</span></div>
          <div class="kv"><span class="k">Gas Priority</span><span class="v" style="color:var(--amber)">High</span></div>
          <div class="kv"><span class="k">Risk</span><span class="v" style="color:var(--red)">Very high</span></div>
        </div>
      </div>
    </section>

    <div class="divider"></div>

    <section class="block" id="airdrop" aria-labelledby="h-airdrop">
      <div class="section-head">
        <h2 class="section-title" id="h-airdrop" style="margin:0"><span class="ic" aria-hidden="true">⏰</span> Airdrop Radar</h2>
        <div class="chips" id="air-chips" role="tablist" aria-label="Filter airdrops by status">
          <button class="chip on" data-f="All" type="button">All</button>
          <button class="chip" data-f="Farming" type="button">Farming</button>
          <button class="chip" data-f="Claiming" type="button">Claiming</button>
          <button class="chip" data-f="Snapshot" type="button">Snapshot</button>
        </div>
      </div>
      <p class="section-sub">Status and deadlines change constantly — always confirm on the project's official site.
        No legitimate airdrop ever asks for your seed phrase.</p>
      <div class="air-grid" id="air-grid">${airdropsHtml}
      </div>
    </section>

    <div class="divider"></div>

    <section class="block" id="news" aria-labelledby="h-news">
      <div class="section-head">
        <h2 class="section-title" id="h-news" style="margin:0"><span class="ic" aria-hidden="true">📡</span> Latest Intel</h2>
      </div>
      <div class="split even">
        <div class="card">${newsHtml}
        </div>
        <aside class="card" style="background:rgba(240,179,94,.07);border-color:rgba(240,179,94,.3)">
          <h3 style="font-family:ui-serif,Georgia,serif;font-size:17px;margin:0 0 6px">🔥 Safety rule</h3>
          <p style="margin:0;color:var(--text-dim);font-size:14px">Never sign a transaction you don't understand, and
            approve tokens in limited amounts only. Real airdrops appear in your wallet — never in your DMs. Revoke old
            approvals periodically at revoke.cash.</p>
        </aside>
      </div>
    </section>

    <div class="divider"></div>

    <section class="block split uneven">
      <div id="edu" aria-labelledby="h-edu">
        <div class="section-head">
          <h2 class="section-title" id="h-edu" style="margin:0"><span class="ic" aria-hidden="true">📖</span> Academy</h2>
          <div class="chips" id="tut-chips" role="tablist" aria-label="Filter lessons by level">
            <button class="chip on" data-f="All" type="button">All</button>
            <button class="chip" data-f="Beginner" type="button">Beginner</button>
            <button class="chip" data-f="Intermediate" type="button">Intermediate</button>
            <button class="chip" data-f="Advanced" type="button">Advanced</button>
          </div>
        </div>
        <p class="section-sub">Every lesson has its own page, so you can link straight to the part you need.</p>
        <div class="grid cols-2" id="tut-grid">${tutsHtml}
        </div>
      </div>

      <div id="community" aria-labelledby="h-community">
        <div class="section-head">
          <h2 class="section-title" id="h-community" style="margin:0"><span class="ic" aria-hidden="true">💬</span> Discussion</h2>
        </div>
        <div class="card" style="display:flex;flex-direction:column;height:100%">
          <div id="threads"></div>
          <div class="form-grid" style="margin-top:auto;padding-top:12px">
            <label class="sr-only" for="t-author">Your name</label>
            <input class="field" id="t-author" placeholder="Your name (optional)" maxlength="40" />
            <label class="sr-only" for="t-title">Thread title</label>
            <input class="field" id="t-title" placeholder="Thread title" maxlength="140" />
            <label class="sr-only" for="t-body">Your message</label>
            <textarea class="field" id="t-body" placeholder="Say something… (be free, it's the open discussion)"></textarea>
            <button class="btn primary" style="justify-content:center" id="t-post" type="button">New Thread</button>
          </div>
        </div>
      </div>
    </section>
  </main>
${FOOTER}
  <script src="/app.js" defer></script>
</body>
</html>
`;
}

/* ------------------------------------------------------------------ */
/* 5. Halaman tutorial (1 URL per topik — kunci SEO)                   */
/* ------------------------------------------------------------------ */
function buildTutorial(t, d) {
  const url = `${SITE}/academy/${slug(t.title)}/`;
  const idx = d.TUTORIALS.indexOf(t);
  const prev = d.TUTORIALS[idx - 1];
  const next = d.TUTORIALS[idx + 1];

  const related = d.TUTORIALS
    .filter((x) => x.id !== t.id)
    .slice(0, 3)
    .map((x) => `<a class="card hover tut-card" href="/academy/${slug(x.title)}/">
          <span class="tut-level lvl-${x.level}">${x.level}</span>
          <span class="tut-title">${esc(x.title)}</span>
          <span class="tut-meta">🕐 ${x.min} min read <span style="margin-left:auto">→</span></span>
        </a>`).join('');

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: t.title,
    description: `${t.title} — a ${t.level.toLowerCase()} crypto guide from the ClownOnChains academy.`,
    inLanguage: 'en',
    datePublished: todayISO,
    dateModified: todayISO,
    articleSection: 'Crypto Education',
    proficiencyLevel: t.level,
    wordCount: t.body.split(/\s+/).filter(Boolean).length,
    timeRequired: `PT${t.min}M`,
    isAccessibleForFree: true,
    author: { '@type': 'Organization', name: 'ClownOnChains', url: `${SITE}/` },
    publisher: { '@type': 'Organization', name: 'ClownOnChains', logo: { '@type': 'ImageObject', url: `${SITE}/assets/favicon.svg` } },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
  };

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
      { '@type': 'ListItem', position: 2, name: 'Academy', item: `${SITE}/academy/` },
      { '@type': 'ListItem', position: 3, name: t.title, item: url },
    ],
  };

  return `${head({
    title: `${t.title} — ${t.level} Crypto Guide | ClownOnChains`,
    desc: `${t.title}. A ${t.level.toLowerCase()} crypto guide covering the mechanics, the real costs, and the mistakes.`,
    keywords: `${t.title.toLowerCase()}, crypto tutorial, defi guide, ${t.level.toLowerCase()} crypto`,
    canonical: url,
    ogType: 'article',
    jsonld: [articleLd, breadcrumbLd],
  })}
<body>
${NAV}

  <main class="wrap" style="padding:34px 18px 10px">
    <nav aria-label="Breadcrumb" style="font-size:12.5px;color:var(--text-faint);margin-bottom:18px">
      <a href="/">Home</a> › <a href="/academy/">Academy</a> › <span>${esc(t.title)}</span>
    </nav>

    <article class="reader" style="max-width:760px;margin:0 auto">
      <header>
        <span class="tut-level lvl-${t.level}">${t.level}</span>
        <h1 style="font-family:ui-serif,Georgia,serif;font-size:clamp(28px,4.4vw,42px);letter-spacing:-.02em;margin:10px 0 8px;color:#fbf3e6">
          ${esc(t.title)}
        </h1>
        <div class="tut-meta">🕐 ${t.min} min read · Updated ${todayISO} · Not financial advice</div>
      </header>

      <div class="reader-body" style="font-size:16px">${mdToHtml(t.body)}</div>

      <aside class="card" style="margin:30px 0;background:rgba(240,179,94,.07);border-color:rgba(240,179,94,.3)">
        <strong style="color:#fff7ea">Safety first.</strong>
        <p style="margin:6px 0 0;color:var(--text-dim);font-size:14px">Never share your seed phrase, never sign a
          transaction you cannot explain, and check that a project is registered in your jurisdiction.</p>
      </aside>

      <nav class="pager" aria-label="Lesson navigation">
        ${prev ? `<a class="card hover" href="/academy/${slug(prev.title)}/"><span class="tut-meta" style="margin:0">← Previous</span><span class="tut-title">${esc(prev.title)}</span></a>` : '<span></span>'}
        ${next ? `<a class="card hover" href="/academy/${slug(next.title)}/" style="text-align:right"><span class="tut-meta" style="margin:0">Next →</span><span class="tut-title">${esc(next.title)}</span></a>` : '<span></span>'}
      </nav>
    </article>

    <section class="block" style="max-width:760px;margin:0 auto" aria-labelledby="h-more">
      <div class="section-head">
        <h2 class="section-title" id="h-more" style="margin:0;font-size:19px"><span class="ic" aria-hidden="true">📚</span> Keep reading</h2>
      </div>
      <div class="grid cols-2">${related}
      </div>
    </section>
  </main>
${FOOTER}
</body>
</html>
`;
}

/* ------------------------------------------------------------------ */
/* 6. Halaman index academy + sitemap + robots + feed + 404            */
/* ------------------------------------------------------------------ */
function buildAcademyIndex(d) {
  const levels = ['Beginner', 'Intermediate', 'Advanced'];
  const groups = levels.map((lv) => {
    const items = d.TUTORIALS.filter((t) => t.level === lv);
    if (!items.length) return '';
    return `
      <h2 class="section-title" style="font-size:19px;margin:34px 0 14px"><span class="ic lvl-${lv}">${lv}</span></h2>
      <div class="grid cols-2">
        ${items.map((t) => `<a class="card hover tut-card" href="/academy/${slug(t.title)}/">
          <span class="tut-title">${esc(t.title)}</span>
          <span class="tut-meta">🕐 ${t.min} min read <span style="margin-left:auto">→</span></span>
        </a>`).join('')}
      </div>`;
  }).join('');

  return `${head({
    title: 'Crypto Academy — Airdrop, DeFi & Trading Guides | ClownOnChains',
    desc: 'Free crypto guides: wallet security, airdrop farming, impermanent loss, Supertrend and indicator setups. Written in plain English, beginner to advanced.',
    keywords: 'crypto academy, defi tutorial, airdrop farming guide, impermanent loss, supertrend',
    canonical: `${SITE}/academy/`,
  })}
<body>
${NAV}
  <main class="wrap" style="padding:44px 18px 20px">
    <header style="max-width:760px;margin:0 auto 30px">
      <h1 style="font-family:ui-serif,Georgia,serif;font-size:clamp(30px,5vw,46px);letter-spacing:-.02em;margin:0 0 12px;color:#fbf3e6">
        Crypto Academy</h1>
      <p style="color:var(--text-dim);font-size:16.5px;margin:0">${d.TUTORIALS.length} practical lessons on wallets,
        airdrops, DeFi mechanics and trading indicators. No hype, no signals — just the mechanics and the costs.</p>
    </header>
    <div style="max-width:760px;margin:0 auto">${groups}
    </div>
  </main>
${FOOTER}
</body>
</html>
`;
}

function buildSitemap(d) {
  const urls = [
    `<url><loc>${SITE}/</loc><lastmod>${todayISO}</lastmod><changefreq>daily</changefreq><priority>1.0</priority></url>`,
    `<url><loc>${SITE}/academy/</loc><lastmod>${todayISO}</lastmod><changefreq>weekly</changefreq><priority>0.9</priority></url>`,
    ...d.TUTORIALS.map((t) =>
      `<url><loc>${SITE}/academy/${slug(t.title)}/</loc><lastmod>${todayISO}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>`),
  ];
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>
`;
}

function buildFeed(d) {
  const items = d.TUTORIALS.map((t) => `
    <item>
      <title>${esc(t.title)}</title>
      <link>${SITE}/academy/${slug(t.title)}/</link>
      <guid isPermaLink="true">${SITE}/academy/${slug(t.title)}/</guid>
      <category>${t.level}</category>
      <pubDate>${new Date().toUTCString()}</pubDate>
      <description>${esc(t.body.slice(0, 200))}…</description>
    </item>`).join('');
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
  <title>ClownOnChains Academy</title>
  <link>${SITE}/academy/</link>
  <description>Practical crypto and DeFi guides.</description>${items}
</channel>
</rss>
`;
}

const ROBOTS = `User-agent: *
Allow: /

# hash assets — crawl normally anyway
Sitemap: ${SITE}/sitemap.xml
`;

const HEADERS = `/*
  Cloudflare Pages headers
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  X-Frame-Options: SAMEORIGIN
  Permissions-Policy: geolocation=(), microphone=(), camera=()

/assets/*
  Cache-Control: public, max-age=31536000, immutable

/style.css
  Cache-Control: public, max-age=604800

/*.html
  Cache-Control: public, max-age=0, must-revalidate
`;

const NOT_FOUND = `${head({
  title: 'Page not found | ClownOnChains',
  desc: 'That page does not exist. Browse airdrops or the crypto academy instead.',
  canonical: `${SITE}/404.html`,
  jsonld: {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Page not found',
    isPartOf: { '@type': 'WebSite', name: 'ClownOnChains', url: `${SITE}/` },
  },
})}
<body>
${NAV}
  <main class="wrap state-box" style="padding:90px 18px">
    <div class="big">404 — page not found</div>
    <p style="margin:0 0 18px">That link does not go anywhere useful.</p>
    <div class="hero-actions">
      <a class="btn primary" href="/">Back to home</a>
      <a class="btn ghost" href="/academy/">Open the academy</a>
    </div>
  </main>
${FOOTER}
</body>
</html>
`;

/* ------------------------------------------------------------------ */
/* 7. Tulis ke disk                                                    */
/* ------------------------------------------------------------------ */
function write(rel, content) {
  const p = path.join(DIST, rel);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, content);
  return rel;
}

function build() {
  fs.rmSync(DIST, { recursive: true, force: true });
  const d = loadData();
  const built = [];

  built.push(write('index.html', buildHome(d)));
  built.push(write('academy/index.html', buildAcademyIndex(d)));
  for (const t of d.TUTORIALS) {
    built.push(write(`academy/${slug(t.title)}/index.html`, buildTutorial(t, d)));
  }
  built.push(write('sitemap.xml', buildSitemap(d)));
  built.push(write('feed.xml', buildFeed(d)));
  built.push(write('robots.txt', ROBOTS));
  built.push(write('_headers', HEADERS));
  built.push(write('.nojekyll', ''));
  built.push(write('404.html', NOT_FOUND));

  // static assets
  for (const f of ['style.css', 'app.interaction.js']) {
    if (fs.existsSync(path.join(ROOT, f))) {
      const out = f === 'app.interaction.js' ? 'app.js' : f;
      built.push(write(out, fs.readFileSync(path.join(ROOT, f), 'utf8')));
    }
  }
  for (const f of fs.readdirSync(path.join(ROOT, 'assets'))) {
    if (f.endsWith('.png') || f.endsWith('.svg')) {
      fs.mkdirSync(path.join(DIST, 'assets'), { recursive: true });
      fs.copyFileSync(path.join(ROOT, 'assets', f), path.join(DIST, 'assets', f));
      built.push(`assets/${f}`);
    }
  }

  console.log(`✓ built ${built.length} files → dist/`);
  console.log(`  pages: ${d.TUTORIALS.length} tutorials + home + academy index + 404`);
  built.forEach((b) => console.log(`   ${b}`));
}

build();