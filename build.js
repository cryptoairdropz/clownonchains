/**
 * build.js — Static site generator untuk ClownOnChains (v2)
 *
 * Struktur baru: home ringan (hero + navigasi) + topic pages terpisah.
 * Sumber data: data.js  (edit di sana, lalu jalankan `node build.js`)
 * Output:      dist/    (upload ke Cloudflare Pages)
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
  const fn = new Function(`${src}\nreturn { PRICES, EXCHANGE_REFS, BOT_REFS, AIRDROPS, NEWS, TUTORIALS };`);
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
      <a href="/airdrops/">Airdrops</a>
      <a href="/exchanges/">Exchanges</a>
      <a href="/bots/">Bots</a>
      <a href="/news/">News</a>
      <a href="/academy/">Academy</a>
      <a href="/community/">Community</a>
    </div>
    <a class="btn" href="/community/">Community</a>
  </div>
</nav>`;

const FOOTER = `  <footer>
  <div class="wrap foot-inner">
    <div class="foot-brand"><span style="color:var(--amber)">◆</span> Clown<span style="color:var(--amber)">OnChains</span></div>
    <div>© ${new Date().getFullYear()} ClownOnChains · cryptoairdropz.com · Not financial advice.</div>
    <div><a href="/sitemap.xml">Sitemap</a></div>
  </div>
</footer>`;

const TICKER = `  <div class="ticker" aria-label="Cryptocurrency prices">
  <div class="ticker-inner" id="ticker"></div>
</div>`;

/**
 * @param {object} o
 * @returns {string} penuh <head>
 */
function head(o) {
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
/* 4. HOME — hero + stats + kartu navigasi topik                       */
/* ------------------------------------------------------------------ */
function buildHome(d) {
  const tickerHtml = d.PRICES.map((p) =>
    `<span class="sym">${esc(p.sym)}</span> <span class="px">${usd(p.px)}</span>` +
    `<span class="chg ${p.chg >= 0 ? 'up' : 'down'}">${p.chg >= 0 ? '+' : ''}${p.chg.toFixed(1)}%</span>`
  ).join('') + '<span class="ago">snapshot</span>';

  const topicCards = [
    {
      href: '/airdrops/',
      icon: '⏰',
      title: 'Airdrops',
      desc: `${d.AIRDROPS.length} tracked — status, deadlines, and farming guides.`,
      accent: 'var(--amber)',
    },
    {
      href: '/exchanges/',
      icon: '🎁',
      title: 'Exchanges',
      desc: `${d.EXCHANGE_REFS.length} referral partners — compare bonuses and claim.`,
      accent: 'var(--peach)',
    },
    {
      href: '/bots/',
      icon: '⌨️',
      title: 'Trading Bots',
      desc: 'Indicator stacks and bot spec sheets — Supertrend, RSI, Bollinger.',
      accent: 'var(--green)',
    },
    {
      href: '/news/',
      icon: '📡',
      title: 'News',
      desc: `${d.NEWS.length} latest stories — market intel and safety tips.`,
      accent: 'var(--red)',
    },
    {
      href: '/academy/',
      icon: '📖',
      title: 'Academy',
      desc: `${d.TUTORIALS.length} lessons — wallet safety to DeFi mechanics.`,
      accent: 'var(--amber)',
    },
    {
      href: '/community/',
      icon: '💬',
      title: 'Community',
      desc: 'Open discussion — share alpha, ask questions, post threads.',
      accent: 'var(--peach)',
    },
  ];

  const navHtml = topicCards.map((c) => `
      <a class="topic-card" href="${c.href}">
        <span class="topic-icon" style="color:${c.accent}" aria-hidden="true">${c.icon}</span>
        <span class="topic-title">${c.title}</span>
        <span class="topic-desc">${c.desc}</span>
        <span class="topic-arrow" aria-hidden="true">→</span>
      </a>`).join('');

  const websiteLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'ClownOnChains',
    description: 'Web3 portal: airdrops, exchanges, trading bots, news, and crypto academy.',
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

  const itemListLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Topic Pages',
    itemListElement: topicCards.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.title,
      url: `${SITE}${c.href}`,
    })),
  };

  return `${head({
    title: 'ClownOnChains — Airdrop Tracker, Crypto Academy & Web3 Trading Guides',
    desc: 'Track crypto and Web3 airdrops with status and deadlines, compare exchange referrals, learn airdrop farming, impermanent loss, Supertrend and DeFi basics. Practical crypto guides, not hype.',
    keywords: 'crypto airdrop tracker, airdrop farming, web3 academy, defi tutorial, crypto exchange referral, trading bot',
    canonical: `${SITE}/`,
    jsonld: [websiteLd, orgLd, itemListLd],
  })}
<body>
${TICKER.replace('${null}', tickerHtml)}
${NAV}

  <header class="hero">
    <div class="hero-glow" aria-hidden="true"></div>
    <div class="wrap" style="position:relative">
      <p class="hero-eyebrow">Web3 Portal</p>
      <h1>Master the <span class="grad">On-Chain</span> Chaos</h1>
      <p class="hero-sub">Airdrop radar, exchange referrals, trading bot dashboards, and a crypto
        academy that actually teaches — wallet safety, airdrop farming, DeFi mechanics and
        indicator setups in plain English.</p>
      <div class="hero-actions">
        <a class="btn primary" href="/airdrops/">Browse Airdrops</a>
        <a class="btn ghost" href="/academy/">Start Learning</a>
      </div>
    </div>
    <div class="wrap stats" aria-label="Portal statistics">
      <div class="stat-tile"><div class="n">${d.AIRDROPS.length}</div><div class="l">Airdrops tracked</div></div>
      <div class="stat-tile"><div class="n">${d.EXCHANGE_REFS.length}</div><div class="l">Referral partners</div></div>
      <div class="stat-tile"><div class="n">${d.TUTORIALS.length}</div><div class="l">Academy lessons</div></div>
      <div class="stat-tile"><div class="n">${d.NEWS.length}</div><div class="l">Latest stories</div></div>
    </div>
  </header>

  <main class="wrap" style="padding-bottom:40px">
    <section class="block" aria-labelledby="h-topics">
      <div class="section-head">
        <h2 class="section-title" id="h-topics" style="margin:0">Explore the portal</h2>
        <p class="section-sub" style="margin:0">Every section has its own page — pick where to start.</p>
      </div>
      <div class="topic-grid">${navHtml}
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
/* 5. Topic: Airdrops                                                  */
/* ------------------------------------------------------------------ */
function buildAirdrops(d) {
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

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
      { '@type': 'ListItem', position: 2, name: 'Airdrops', item: `${SITE}/airdrops/` },
    ],
  };

  return `${head({
    title: 'Crypto Airdrops 2026 — Tracker & Farming Guide | ClownOnChains',
    desc: 'Track the latest crypto airdrops with status and deadlines. LayerZero, zkSync, Scroll and more. Learn how to farm airdrops safely and avoid scams.',
    keywords: 'crypto airdrops 2026, airdrop tracker, airdrop farming, layerzero airdrop, zksync airdrop, scroll airdrop',
    canonical: `${SITE}/airdrops/`,
    jsonld: breadcrumbLd,
  })}
<body>
${NAV}
  <main class="wrap" style="padding:44px 18px 20px">
    <header style="max-width:1120px;margin:0 auto 26px">
      <nav aria-label="Breadcrumb" style="font-size:12.5px;color:var(--text-faint);margin-bottom:14px">
        <a href="/">Home</a> › <span>Airdrops</span>
      </nav>
      <h1 style="font-family:ui-serif,Georgia,serif;font-size:clamp(30px,5vw,46px);letter-spacing:-.02em;margin:0 0 10px;color:#fbf3e6">
        Airdrop Radar</h1>
      <p style="color:var(--text-dim);font-size:16.5px;margin:0;max-width:640px">
        ${d.AIRDROPS.length} airdrops tracked with status and deadlines. Always confirm on the
        project's official site — no legitimate airdrop ever asks for your seed phrase.
      </p>
    </header>

    <div class="section-head" style="max-width:1120px;margin:0 auto 16px">
      <div class="chips" id="air-chips" role="tablist" aria-label="Filter airdrops by status">
        <button class="chip on" data-f="All" type="button">All</button>
        <button class="chip" data-f="Farming" type="button">Farming</button>
        <button class="chip" data-f="Claiming" type="button">Claiming</button>
        <button class="chip" data-f="Snapshot" type="button">Snapshot</button>
      </div>
    </div>

    <div class="air-grid" id="air-grid" style="max-width:1120px;margin:0 auto">${airdropsHtml}
    </div>
  </main>
${FOOTER}
  <script src="/app.js" defer></script>
</body>
</html>
`;
}

/* ------------------------------------------------------------------ */
/* 6. Topic: Exchanges                                                 */
/* ------------------------------------------------------------------ */
function buildExchanges(d) {
  const referralsHtml = d.EXCHANGE_REFS.map((r) => `
        <article class="card hover ref-card">
          <div class="ref-name">${esc(r.name)}</div>
          <p class="ref-desc">${esc(r.desc)}</p>
          <div class="ref-code"><span class="ref-label">Referral code</span><code>${esc(r.code)}</code></div>
          <div class="ref-meta">
            <div class="ref-bonus">${esc(r.bonus)}</div>
            <a class="btn primary" href="${esc(r.url)}" target="_blank" rel="noopener nofollow sponsored">Sign up</a>
          </div>
        </article>`).join('');

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
      { '@type': 'ListItem', position: 2, name: 'Exchanges', item: `${SITE}/exchanges/` },
    ],
  };

  return `${head({
    title: 'Crypto Exchange Referrals — Compare Bonuses | ClownOnChains',
    desc: 'Compare crypto exchange referral bonuses: Binance up to $100, Bybit up to $30,000, OKX mystery box, KuCoin up to $500. Claim safely and verify licensing.',
    keywords: 'crypto exchange referral, binance referral, bybit referral, okx referral, kucoin referral, exchange bonus',
    canonical: `${SITE}/exchanges/`,
    jsonld: breadcrumbLd,
  })}
<body>
${NAV}
  <main class="wrap" style="padding:44px 18px 20px">
    <header style="max-width:1120px;margin:0 auto 26px">
      <nav aria-label="Breadcrumb" style="font-size:12.5px;color:var(--text-faint);margin-bottom:14px">
        <a href="/">Home</a> › <span>Exchanges</span>
      </nav>
      <h1 style="font-family:ui-serif,Georgia,serif;font-size:clamp(30px,5vw,46px);letter-spacing:-.02em;margin:0 0 10px;color:#fbf3e6">
        Referral Exchange Hub</h1>
      <p style="color:var(--text-dim);font-size:16.5px;margin:0;max-width:640px">
        ${d.EXCHANGE_REFS.length} partner exchanges with referral codes. Listed for convenience,
        not endorsement — always verify a platform's licensing in your country before depositing.
      </p>
    </header>
    <div class="grid cols-3" style="max-width:1120px;margin:0 auto">${referralsHtml}
    </div>
  </main>
${FOOTER}
</body>
</html>
`;
}

/* ------------------------------------------------------------------ */
/* 7. Topic: Bots                                                      */
/* ------------------------------------------------------------------ */
function buildBots(d) {
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
      { '@type': 'ListItem', position: 2, name: 'Bots', item: `${SITE}/bots/` },
    ],
  };

  const botCards = ['Multichain (no bridge)', 'Multichain bridge', 'Liquidity pools'].map((category) => {
    const bots = d.BOT_REFS.filter((b) => b.category === category);
    return `
      <section aria-labelledby="h-${slug(category)}">
        <h2 id="h-${slug(category)}" style="font-family:ui-serif,Georgia,serif;font-size:20px;margin:32px 0 14px;color:#fbf3e6">
          ${esc(category)}</h2>
        <div class="grid cols-3">
          ${bots.map((b) => `
            <article class="card hover bot-ref-card">
              <div class="bot-ref-name">${esc(b.name)}</div>
              <p class="bot-ref-desc">${esc(b.desc)}</p>
              <div class="ref-code"><span class="ref-label">Code</span><code>${esc(b.code)}</code></div>
              <a class="btn primary" style="width:100%;justify-content:center" href="${esc(b.url)}"
                 target="_blank" rel="noopener nofollow sponsored">Open Bot</a>
            </article>`).join('')}
        </div>
      </section>`;
  }).join('');

  return `${head({
    title: 'Web3 Trading Bots — Telegram Bots & Referral Codes | ClownOnChains',
    desc: 'Web3 trading bots with referral codes: Dawn, Cove, CopyFomo, Maestro, GMGN, OKX Web3, Axiom and Zenith. Multichain, bridge and liquidity pool bots.',
    keywords: 'web3 trading bot, telegram trading bot, solana sniper bot, crypto copy trading, referral code',
    canonical: `${SITE}/bots/`,
    jsonld: breadcrumbLd,
  })}
<body>
${NAV}
  <main class="wrap" style="padding:44px 18px 20px">
    <header style="max-width:1120px;margin:0 auto 26px">
      <nav aria-label="Breadcrumb" style="font-size:12.5px;color:var(--text-faint);margin-bottom:14px">
        <a href="/">Home</a> › <span>Bots</span>
      </nav>
      <h1 style="font-family:ui-serif,Georgia,serif;font-size:clamp(30px,5vw,46px);letter-spacing:-.02em;margin:0 0 10px;color:#fbf3e6">
        Web3 Trading Bots</h1>
      <p style="color:var(--text-dim);font-size:16.5px;margin:0;max-width:640px">
        ${d.BOT_REFS.length} vetted bots with referral codes. Multichain, bridge and liquidity
        pool categories. Always do your own research — trading bots carry high risk.
      </p>
    </header>
    <div style="max-width:1120px;margin:0 auto">${botCards}
    </div>
  </main>
${FOOTER}
</body>
</html>
`;
}

/* ------------------------------------------------------------------ */
/* 8. Topic: News                                                      */
/* ------------------------------------------------------------------ */
function buildNews(d) {
  const newsHtml = d.NEWS.map((n) => `
        <article class="news-item">
          <h3 class="news-title" style="margin:0;font-size:14.5px">
            ${n.u ? `<a href="${esc(n.u)}" target="_blank" rel="noopener nofollow">${esc(n.t)}</a>` : esc(n.t)}
          </h3>
          <div class="news-meta">${esc(n.s)} · ${esc(n.d)}</div>
        </article>`).join('');

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
      { '@type': 'ListItem', position: 2, name: 'News', item: `${SITE}/news/` },
    ],
  };

  return `${head({
    title: 'Latest Crypto News & Market Intel | ClownOnChains',
    desc: 'Latest crypto news: Bitcoin ETF inflows, Solana network upgrades, HYPE-USD analysis. Market intel with safety tips for airdrop hunters.',
    keywords: 'crypto news, bitcoin etf, solana upgrade, hype usd, crypto market intel',
    canonical: `${SITE}/news/`,
    jsonld: breadcrumbLd,
  })}
<body>
${NAV}
  <main class="wrap" style="padding:44px 18px 20px">
    <header style="max-width:1120px;margin:0 auto 26px">
      <nav aria-label="Breadcrumb" style="font-size:12.5px;color:var(--text-faint);margin-bottom:14px">
        <a href="/">Home</a> › <span>News</span>
      </nav>
      <h1 style="font-family:ui-serif,Georgia,serif;font-size:clamp(30px,5vw,46px);letter-spacing:-.02em;margin:0 0 10px;color:#fbf3e6">
        Latest Intel</h1>
      <p style="color:var(--text-dim);font-size:16.5px;margin:0;max-width:640px">
        ${d.NEWS.length} latest stories — market intel, network upgrades, and safety reminders.
      </p>
    </header>
    <div class="split even" style="max-width:1120px;margin:0 auto">
      <div class="card">${newsHtml}
      </div>
      <aside class="card" style="background:rgba(240,179,94,.07);border-color:rgba(240,179,94,.3)">
        <h3 style="font-family:ui-serif,Georgia,serif;font-size:17px;margin:0 0 6px">🔥 Safety rule</h3>
        <p style="margin:0;color:var(--text-dim);font-size:14px">Never sign a transaction you don't
          understand, and approve tokens in limited amounts only. Real airdrops appear in your
          wallet — never in your DMs. Revoke old approvals periodically at revoke.cash.</p>
      </aside>
    </div>
  </main>
${FOOTER}
</body>
</html>
`;
}

/* ------------------------------------------------------------------ */
/* 9. Topic: Academy index                                             */
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

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
      { '@type': 'ListItem', position: 2, name: 'Academy', item: `${SITE}/academy/` },
    ],
  };

  return `${head({
    title: 'Crypto Academy — Airdrop, DeFi & Trading Guides | ClownOnChains',
    desc: 'Free crypto guides: wallet security, airdrop farming, impermanent loss, Supertrend and indicator setups. Written in plain English, beginner to advanced.',
    keywords: 'crypto academy, defi tutorial, airdrop farming guide, impermanent loss, supertrend',
    canonical: `${SITE}/academy/`,
    jsonld: breadcrumbLd,
  })}
<body>
${NAV}
  <main class="wrap" style="padding:44px 18px 20px">
    <header style="max-width:760px;margin:0 auto 30px">
      <nav aria-label="Breadcrumb" style="font-size:12.5px;color:var(--text-faint);margin-bottom:14px">
        <a href="/">Home</a> › <span>Academy</span>
      </nav>
      <h1 style="font-family:ui-serif,Georgia,serif;font-size:clamp(30px,5vw,46px);letter-spacing:-.02em;margin:0 0 12px;color:#fbf3e6">
        Crypto Academy</h1>
      <p style="color:var(--text-dim);font-size:16.5px;margin:0">${d.TUTORIALS.length} practical lessons
        on wallets, airdrops, DeFi mechanics and trading indicators. No hype, no signals — just the
        mechanics and the costs.</p>
    </header>
    <div style="max-width:760px;margin:0 auto">${groups}
    </div>
  </main>
${FOOTER}
</body>
</html>
`;
}

/* ------------------------------------------------------------------ */
/* 10. Topic: Community                                                 */
/* ------------------------------------------------------------------ */
function buildCommunity(d) {
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
      { '@type': 'ListItem', position: 2, name: 'Community', item: `${SITE}/community/` },
    ],
  };

  return `${head({
    title: 'Community Discussion — Open Crypto Forum | ClownOnChains',
    desc: 'Open community discussion for crypto and Web3. Share alpha, ask questions, post threads about airdrops, exchanges, bots and DeFi.',
    keywords: 'crypto community, web3 discussion, airdrop forum, crypto alpha',
    canonical: `${SITE}/community/`,
    jsonld: breadcrumbLd,
  })}
<body>
${NAV}
  <main class="wrap" style="padding:44px 18px 20px">
    <header style="max-width:760px;margin:0 auto 26px">
      <nav aria-label="Breadcrumb" style="font-size:12.5px;color:var(--text-faint);margin-bottom:14px">
        <a href="/">Home</a> › <span>Community</span>
      </nav>
      <h1 style="font-family:ui-serif,Georgia,serif;font-size:clamp(30px,5vw,46px);letter-spacing:-.02em;margin:0 0 10px;color:#fbf3e6">
        Discussion</h1>
      <p style="color:var(--text-dim);font-size:16.5px;margin:0;max-width:640px">
        Open discussion — share alpha, ask questions, post threads. Be free, it's the open
        discussion. Threads are stored locally in your browser.
      </p>
    </header>
    <div class="card" style="max-width:760px;margin:0 auto;display:flex;flex-direction:column;height:100%">
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
  </main>
${FOOTER}
  <script src="/app.js" defer></script>
</body>
</html>
`;
}

/* ------------------------------------------------------------------ */
/* 11. Halaman tutorial (1 URL per topik)                               */
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

      <aside class="playbook" aria-labelledby="h-playbook">
        <div class="playbook-head">
          <span class="playbook-badge">Playbook</span>
          <h2 id="h-playbook" style="font-family:ui-serif,Georgia,serif;font-size:21px;margin:0;color:#fbf3e6">
            Use this lesson</h2>
        </div>
        <p style="margin:0 0 18px;color:var(--text-dim);font-size:14.5px">
          Referral codes and bots mentioned throughout this article, in one place.
        </p>
        <div class="playbook-grid">
          <section>
            <h3 style="font-size:12px;text-transform:uppercase;letter-spacing:.08em;color:var(--amber);margin:0 0 10px">Exchange codes</h3>
            ${d.EXCHANGE_REFS.map((r) => `<div class="playbook-row">
              <span class="playbook-name">${esc(r.name)}</span>
              <code>${esc(r.code)}</code>
              <a href="${esc(r.url)}" target="_blank" rel="noopener nofollow sponsored">Sign up</a>
            </div>`).join('')}
          </section>
          <section>
            <h3 style="font-size:12px;text-transform:uppercase;letter-spacing:.08em;color:var(--amber);margin:0 0 10px">Bot codes</h3>
            ${d.BOT_REFS.map((r) => `<div class="playbook-row">
              <span class="playbook-name">${esc(r.name)}</span>
              <code>${esc(r.code)}</code>
              <a href="${esc(r.url)}" target="_blank" rel="noopener nofollow sponsored">Open</a>
            </div>`).join('')}
          </section>
        </div>
      </aside>
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
/* 12. Sitemap + robots + feed + 404                                   */
/* ------------------------------------------------------------------ */
function buildSitemap(d) {
  const urls = [
    `<url><loc>${SITE}/</loc><lastmod>${todayISO}</lastmod><changefreq>daily</changefreq><priority>1.0</priority></url>`,
    `<url><loc>${SITE}/airdrops/</loc><lastmod>${todayISO}</lastmod><changefreq>daily</changefreq><priority>0.9</priority></url>`,
    `<url><loc>${SITE}/exchanges/</loc><lastmod>${todayISO}</lastmod><changefreq>weekly</changefreq><priority>0.9</priority></url>`,
    `<url><loc>${SITE}/bots/</loc><lastmod>${todayISO}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>`,
    `<url><loc>${SITE}/news/</loc><lastmod>${todayISO}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>`,
    `<url><loc>${SITE}/academy/</loc><lastmod>${todayISO}</lastmod><changefreq>weekly</changefreq><priority>0.9</priority></url>`,
    `<url><loc>${SITE}/community/</loc><lastmod>${todayISO}</lastmod><changefreq>weekly</changefreq><priority>0.7</priority></url>`,
    ...d.EXCHANGE_REFS.map((r) => `<url><loc>${SITE}/exchanges/#${slug(r.name)}</loc><lastmod>${todayISO}</lastmod><changefreq>monthly</changefreq><priority>0.6</priority></url>`),
    ...d.BOT_REFS.map((r) => `<url><loc>${SITE}/bots/#${slug(r.name)}</loc><lastmod>${todayISO}</lastmod><changefreq>monthly</changefreq><priority>0.6</priority></url>`),
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
/* 13. Tulis ke disk                                                    */
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
  built.push(write('airdrops/index.html', buildAirdrops(d)));
  built.push(write('exchanges/index.html', buildExchanges(d)));
  built.push(write('bots/index.html', buildBots(d)));
  built.push(write('news/index.html', buildNews(d)));
  built.push(write('academy/index.html', buildAcademyIndex(d)));
  built.push(write('community/index.html', buildCommunity(d)));
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
  console.log(`  pages: home + 6 topics + ${d.TUTORIALS.length} tutorials + 404`);
  built.forEach((b) => console.log(`   ${b}`));
}

build();