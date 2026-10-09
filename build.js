/**
 * build.js — Static site generator untuk ClownOnChains (v4)
 *
 * Struktur: home ringan (hero + navigasi) + topic pages terpisah.
 * Sumber data: data.js  (edit di sana, lalu jalankan `node build.js`)
 * Output:      dist/    (upload ke Cloudflare Pages)
 */
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const DIST = path.join(ROOT, 'dist');
const SITE = 'https://cryptoairdropz.com';

/* Versi aset: hash pendek dari style.css. Setiap kali CSS berubah, hash
   berubah, jadi URL /style.css?v=xxxx berubah dan browser WAJIB ambil ulang
   — memperbaiki bug cache 7-hari yang membuat pengunjung lama melihat CSS usang. */
const CSS_VER = (() => {
  try {
    const css = fs.readFileSync(path.join(ROOT, 'style.css'));
    return require('crypto').createHash('sha1').update(css).digest('hex').slice(0, 8);
  } catch (e) { return '1'; }
})();

/* ------------------------------------------------------------------ */
/* 1. Muat data dari data.js                                           */
/* ------------------------------------------------------------------ */
function loadData() {
  const src = fs.readFileSync(path.join(ROOT, 'data.js'), 'utf8');
  const fn = new Function(`${src}\nreturn { PRICES, EXCHANGE_REFS, BOT_REFS, AFFILIATE, ANGLES, AIRDROPS, NEWS, TUTORIALS, GLOSSARY, TRACKS, FAQ, GUIDE };`);
  const d = fn();
  // blog posts ditulis oleh add_affiliate.py, bukan oleh data.js
  const blogPath = path.join(ROOT, 'queue', 'blog-posts.json');
  try {
    d.BLOG = JSON.parse(fs.readFileSync(blogPath, 'utf8'));
  } catch (e) {
    d.BLOG = [];
  }
  return d;
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

const inlineMd = (t) =>
  esc(t)
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|\s)\*([^*]+)\*/g, '$1<em>$2</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>');

/**
 * Markdown ringan -> HTML.
 * Mendukung: ## / ### heading, - / * / 1. list, > kutipan, **tebal**, *miring*,
 * `kode`, dan paragraf yang dipisah baris kosong.
 */
function mdToHtml(text) {
  const blocks = String(text).split(/\n\s*\n/);
  const out = [];

  for (const raw of blocks) {
    const block = raw.trim();
    if (!block) continue;

    // heading
    const h = block.match(/^(#{2,3})\s+(.+)$/);
    if (h && !block.includes('\n')) {
      const lvl = h[1].length;
      out.push(`<h${lvl}>${inlineMd(h[2].trim())}</h${lvl}>`);
      continue;
    }

    // kutipan
    if (/^>\s?/.test(block)) {
      const q = block.split('\n').map((l) => l.replace(/^>\s?/, '')).join(' ');
      out.push(`<blockquote>${inlineMd(q)}</blockquote>`);
      continue;
    }

    const lines = block.split('\n').map((l) => l.trim()).filter(Boolean);

    // daftar berpoin / bernomor
    const isUl = lines.length > 1 && lines.every((l) => /^[-*]\s+/.test(l));
    const isOl = lines.length > 1 && lines.every((l) => /^\d+[.)]\s+/.test(l));
    if (isUl || isOl) {
      const tag = isUl ? 'ul' : 'ol';
      const items = lines
        .map((l) => l.replace(/^[-*]\s+/, '').replace(/^\d+[.)]\s+/, ''))
        .map((li) => `<li>${inlineMd(li)}</li>`)
        .join('');
      out.push(`<${tag}>${items}</${tag}>`);
      continue;
    }

    out.push(`<p>${lines.map(inlineMd).join('<br/>')}</p>`);
  }

  return out.join('\n');
}

const todayISO = new Date().toISOString().slice(0, 10);

const { buildAffiliatePage, buildAffiliateHub, buildAffiliatePartner } = require('./affiliate.js');

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
      <a href="/web3-tools/">Web3 Tools</a>
      <a href="/affiliate/">Referral Codes</a>
      <a href="/blog/">Guides</a>
      <a href="/news/">News</a>
      <a href="/academy/">Academy</a>
      <a href="/glossary/">Glossary</a>
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
  <link rel="stylesheet" href="/style.css?v=${CSS_VER}" />
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

  const topicGroups = [
    {
      label: 'Start Here',
      items: [
        { href: '/airdrops/', icon: '⏰', title: 'Airdrops', desc: 'Live tracker — active, upcoming, and ended airdrops with task checklists.', accent: 'var(--amber)' },
        { href: '/academy/', icon: '📖', title: 'Academy', desc: `${d.TUTORIALS.length} lessons across ${d.TRACKS.length} tracks — beginner to advanced.`, accent: 'var(--green)' },
        { href: '/glossary/', icon: '📚', title: 'Glossary', desc: `${d.GLOSSARY.length} crypto terms explained in plain English.`, accent: 'var(--peach)' },
      ],
    },
    {
      label: 'Trade & Earn',
      items: [
        { href: '/affiliate/', icon: '🎁', title: 'Referral Codes', desc: `${d.AFFILIATE.length} verified codes — fee discounts and signup bonuses.`, accent: 'var(--amber)' },
        { href: '/exchanges/', icon: '🏦', title: 'Exchanges', desc: 'Compare fees, features, and availability across major platforms.', accent: 'var(--peach)' },
        { href: '/web3-tools/', icon: '⌨️', title: 'Web3 Tools', desc: 'Trading bots, copy trading, and liquidity tools with codes.', accent: 'var(--green)' },
      ],
    },
    {
      label: 'Stay Updated',
      items: [
        { href: '/news/', icon: '📡', title: 'News', desc: 'Paraphrased crypto news — full articles on-site, no redirects.', accent: 'var(--amber)' },
        { href: '/blog/', icon: '📝', title: 'Guides', desc: 'In-depth exchange guides and referral tips.', accent: 'var(--peach)' },
        { href: '/community/', icon: '💬', title: 'Community', desc: 'Email updates and Twitter — follow the airdrop alpha.', accent: 'var(--green)' },
      ],
    },
  ];

  const navHtml = topicGroups.map((g) => `
      <div class="topic-group">
        <h3 class="topic-group-label">${esc(g.label)}</h3>
        <div class="topic-group-grid">${g.items.map((c) => `
          <a class="topic-card" href="${c.href}">
            <span class="topic-icon" style="color:${c.accent}" aria-hidden="true">${c.icon}</span>
            <span class="topic-title">${c.title}</span>
            <span class="topic-desc">${c.desc}</span>
            <span class="topic-arrow" aria-hidden="true">→</span>
          </a>`).join('')}
        </div>
      </div>`).join('');

  const websiteLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'ClownOnChains',
    description: 'Web3 portal: airdrops, exchanges, web3 tools, news, and crypto academy.',
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

  const allTopics = topicGroups.flatMap((g) => g.items);
  const itemListLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Topic Pages',
    itemListElement: allTopics.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.title,
      url: `${SITE}${c.href}`,
    })),
  };

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: d.FAQ.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  const faqHtml = d.FAQ.map((f) => `
        <details class="faq-item">
          <summary class="faq-q">${esc(f.q)}</summary>
          <p class="faq-a">${esc(f.a)}</p>
        </details>`).join('');

  const guideHtml = d.GUIDE.sections.map((s) => `
        <section class="guide-section">
          <h3>${esc(s.h)}</h3>
          <p>${esc(s.p)}</p>
        </section>`).join('');

  return `${head({
    title: 'Crypto Airdrops 2026 — Free Airdrop Tracker | ClownOnChains',
    desc: 'Track the best free crypto airdrops of 2026 — status, allocation and step-by-step tasks. Plus a free crypto academy on wallet safety, airdrop farming and DeFi mechanics.',
    keywords: 'crypto airdrops 2026, free airdrop tracker, airdrop farming, grass airdrop, layerzero airdrop, zksync airdrop, scroll airdrop',
    canonical: `${SITE}/`,
    jsonld: [websiteLd, orgLd, itemListLd, faqLd],
  })}
<body>
${TICKER.replace('${null}', tickerHtml)}
${NAV}

  <header class="hero">
    <div class="hero-glow" aria-hidden="true"></div>
    <div class="wrap" style="position:relative">
      <p class="hero-eyebrow">Crypto Airdrops 2026</p>
      <h1>The best free <span class="grad">airdrops</span>, tracked daily</h1>
      <p class="hero-sub">Find credible projects and track what matters — status, allocation
        and step-by-step tasks. Plus a free academy on wallet safety, airdrop farming and
        DeFi mechanics.</p>
      <div class="hero-actions">
        <a class="btn primary" href="/airdrops/">Browse Airdrops</a>
        <a class="btn ghost" href="/academy/">Start Learning</a>
      </div>
    </div>
    <div class="wrap stats" aria-label="Portal statistics">
      <div class="stat-tile"><div class="n">${d.AIRDROPS.length}</div><div class="l">Airdrops tracked</div></div>
      <div class="stat-tile"><div class="n">${d.TUTORIALS.length}</div><div class="l">Academy lessons</div></div>
      <div class="stat-tile"><div class="n">${d.NEWS.length}</div><div class="l">Latest stories</div></div>
      <div class="stat-tile"><div class="n">100%</div><div class="l">Free, no signup</div></div>
    </div>
  </header>

  <main class="wrap" style="padding-bottom:40px">
    <section class="block" aria-labelledby="h-topics">
      <div class="section-head">
        <h2 class="section-title" id="h-topics" style="margin:0">More than a list</h2>
        <p class="section-sub" style="margin:0">Every section has its own page — pick where to start.</p>
      </div>
      <div class="topic-grid">${navHtml}
      </div>
    </section>

    <section class="block" aria-labelledby="h-faq">
      <div class="section-head">
        <h2 class="section-title" id="h-faq" style="margin:0"><span class="ic" aria-hidden="true">❓</span> Common questions</h2>
      </div>
      <div class="faq-list">${faqHtml}
      </div>
    </section>

    <section class="block guide" aria-labelledby="h-guide">
      <h2 class="section-title" id="h-guide" style="margin:0 0 8px"><span class="ic" aria-hidden="true">📘</span> ${esc(d.GUIDE.title)}</h2>
      <p class="guide-intro">${esc(d.GUIDE.intro)}</p>
      ${guideHtml}
    </section>
  </main>
${FOOTER}
  <script src="/app.js?v=${CSS_VER}" defer></script>
</body>
</html>
`;
}

/* ------------------------------------------------------------------ */
/* 5. Topic: Airdrops                                                  */
/* ------------------------------------------------------------------ */
function buildAirdrops(d) {
  const airdropsHtml = d.AIRDROPS.map((a) => `
        <a class="card hover air-card" href="/airdrops/${a.slug}/" data-status="${esc(a.tag)}">
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
          <p class="air-summary">${esc(a.summary)}</p>
          <div class="air-foot">
            <span class="air-time badge-live">${esc(a.allocation)}</span>
            <span class="air-view">View tasks →</span>
          </div>
        </a>`).join('');

  const itemListLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Crypto Airdrops 2026',
    itemListElement: d.AIRDROPS.map((a, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: `${a.name} airdrop`,
      url: `${SITE}/airdrops/${a.slug}/`,
    })),
  };

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
      { '@type': 'ListItem', position: 2, name: 'Airdrops', item: `${SITE}/airdrops/` },
    ],
  };

  return `${head({
    title: 'Crypto Airdrops 2026 — Free Airdrop Tracker | ClownOnChains',
    desc: 'Track the best free crypto airdrops of 2026: Grass, LayerZero, zkSync Era, Scroll. Status, allocation and step-by-step tasks for each project, updated daily.',
    keywords: 'crypto airdrops 2026, free airdrop tracker, grass airdrop, layerzero airdrop, zksync airdrop, scroll airdrop',
    canonical: `${SITE}/airdrops/`,
    jsonld: [breadcrumbLd, itemListLd],
  })}
<body>
${NAV}
  <main class="wrap" style="padding:44px 18px 20px">
    <header style="max-width:1120px;margin:0 auto 26px">
      <nav aria-label="Breadcrumb" style="font-size:12.5px;color:var(--text-faint);margin-bottom:14px">
        <a href="/">Home</a> › <span>Airdrops</span>
      </nav>
      <h1 style="font-family:ui-serif,Georgia,serif;font-size:clamp(30px,5vw,46px);letter-spacing:-.02em;margin:0 0 10px;color:#fbf3e6">
        Crypto Airdrops 2026</h1>
      <p style="color:var(--text-dim);font-size:16.5px;margin:0;max-width:640px">
        The best free airdrops of 2026, tracked, checked and updated. Click any project for the
        full task list. Always confirm on the official site — no legitimate airdrop ever asks
        for your seed phrase.
      </p>
    </header>

    <div class="air-grid" style="max-width:1120px;margin:0 auto">${airdropsHtml}
    </div>
  </main>
${FOOTER}
  <script src="/app.js?v=${CSS_VER}" defer></script>
</body>
</html>
`;
}

/* ------------------------------------------------------------------ */
/* 5b. Halaman detail per-airdrop (tugas lengkap + FAQ)                 */
/* ------------------------------------------------------------------ */
function buildAirdropPage(a, d) {
  const url = `${SITE}/airdrops/${a.slug}/`;
  const others = d.AIRDROPS.filter((x) => x.slug !== a.slug);

  const tasksHtml = a.tasks.map((t, i) => `
          <li class="task-item">
            <span class="task-num" aria-hidden="true">${i + 1}</span>
            <span>${esc(t)}</span>
          </li>`).join('');

  const registerHtml = a.url ? `
        <a class="btn primary" href="${esc(a.url)}" target="_blank" rel="noopener nofollow sponsored">
          Register on ${esc(a.name)} →
        </a>` : '';

  const codeHtml = a.code ? `
        <div class="air-code-box">
          <span class="ref-label">Referral code</span>
          <code>${esc(a.code)}</code>
        </div>` : '';

  const faq = [
    {
      q: `Is the ${a.name} airdrop still active?`,
      a: `${a.name} is currently at "${a.status}" with an allocation of ${a.allocation}. Deadlines and snapshots change quickly, so always check the project's official channels before spending gas.`,
    },
    {
      q: `How do I qualify for the ${a.name} airdrop?`,
      a: `Complete the tasks listed above using a single wallet, and keep activity consistent over time. ${a.name} runs on ${a.chain}. Projects weight genuine, sustained usage far above one-off transactions.`,
    },
    {
      q: `Does the ${a.name} airdrop cost anything?`,
      a: `The tokens are free, but on-chain tasks cost gas. Budget a monthly cap, prefer cheap periods, and remember that most farms pay nothing — treat each interaction as a small bet, not an investment.`,
    },
  ];

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  const howToLd = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: `How to farm the ${a.name} airdrop`,
    description: a.summary,
    totalTime: 'PT30M',
    step: a.tasks.map((t, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: `Step ${i + 1}`,
      text: t,
    })),
  };

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
      { '@type': 'ListItem', position: 2, name: 'Airdrops', item: `${SITE}/airdrops/` },
      { '@type': 'ListItem', position: 3, name: a.name, item: url },
    ],
  };

  const faqHtml = faq.map((f) => `
          <details class="faq-item">
            <summary class="faq-q">${esc(f.q)}</summary>
            <p class="faq-a">${esc(f.a)}</p>
          </details>`).join('');

  const othersHtml = others.map((o) => `
          <a class="card hover air-card" href="/airdrops/${o.slug}/">
            <div class="air-top">
              <div style="display:flex;align-items:center;gap:11px">
                <div class="air-logo" aria-hidden="true">${esc(o.name.slice(0, 1))}</div>
                <div>
                  <div class="air-name">${esc(o.name)}</div>
                  <div class="air-status">${esc(o.status)}</div>
                </div>
              </div>
              <span class="air-tag">${esc(o.tag)}</span>
            </div>
            <div class="air-foot"><span class="air-time">${esc(o.allocation)}</span><span class="air-view">View tasks →</span></div>
          </a>`).join('');

  return `${head({
    title: `${a.name} Airdrop 2026 — Tasks, Status & Guide | ClownOnChains`,
    desc: `${a.name} airdrop: ${a.status}, ${a.allocation}. ${a.summary.slice(0, 110)}… Full step-by-step task list and safety notes.`,
    keywords: `${a.name.toLowerCase()} airdrop, ${a.name.toLowerCase()} airdrop 2026, how to farm ${a.name.toLowerCase()}, ${a.tag.toLowerCase()} airdrop`,
    canonical: url,
    jsonld: [breadcrumbLd, howToLd, faqLd],
  })}
<body>
${NAV}
  <main class="wrap" style="padding:34px 18px 10px">
    <nav aria-label="Breadcrumb" style="font-size:12.5px;color:var(--text-faint);margin-bottom:18px">
      <a href="/">Home</a> › <a href="/airdrops/">Airdrops</a> › <span>${esc(a.name)}</span>
    </nav>

    <article style="max-width:760px;margin:0 auto">
      <header class="air-hero">
        <div class="air-logo air-logo-lg" aria-hidden="true">${esc(a.name.slice(0, 1))}</div>
        <div>
          <div class="air-tag" style="margin-bottom:6px">${esc(a.tag)}</div>
          <h1 style="font-family:ui-serif,Georgia,serif;font-size:clamp(28px,4.4vw,42px);letter-spacing:-.02em;margin:0 0 6px;color:#fbf3e6">
            ${esc(a.name)}</h1>
          <div class="air-hero-meta">
            <span class="air-status">${esc(a.status)}</span>
            <span class="air-time badge-live">${esc(a.allocation)}</span>
            <span class="air-time">${esc(a.chain)}</span>
          </div>
        </div>
      </header>

      <p class="reader-body" style="font-size:16px">${esc(a.summary)}</p>

      ${codeHtml}
      ${registerHtml}

      <section class="block" aria-labelledby="h-tasks" style="padding-top:26px">
        <h2 id="h-tasks" style="font-family:ui-serif,Georgia,serif;font-size:21px;margin:0 0 14px;color:#fbf3e6">
          Tasks to qualify</h2>
        <ol class="task-list">${tasksHtml}
        </ol>
      </section>

      <aside class="card" style="margin:26px 0;background:rgba(240,179,94,.07);border-color:rgba(240,179,94,.3)">
        <strong style="color:#fff7ea">Safety first.</strong>
        <p style="margin:6px 0 0;color:var(--text-dim);font-size:14px">Never share your seed phrase, never
          sign a transaction you cannot explain, and verify the project's official domain before
          connecting your wallet. Eligibility checks are read-only.</p>
      </aside>

      <section class="block" aria-labelledby="h-faq" style="padding-top:8px">
        <h2 id="h-faq" style="font-family:ui-serif,Georgia,serif;font-size:21px;margin:0 0 12px;color:#fbf3e6">
          Common questions</h2>
        <div class="faq-list">${faqHtml}
        </div>
      </section>
    </article>

    <section class="block" style="max-width:760px;margin:0 auto" aria-labelledby="h-others">
      <div class="section-head">
        <h2 class="section-title" id="h-others" style="margin:0;font-size:19px"><span class="ic" aria-hidden="true">⏰</span> Other airdrops</h2>
      </div>
      <div class="air-grid">${othersHtml}
      </div>
    </section>
  </main>
${FOOTER}
  <script src="/app.js?v=${CSS_VER}" defer></script>
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
          <div class="ref-meta">
            <a class="ref-link" href="${esc(r.url)}" target="_blank" rel="noopener nofollow sponsored">
              Sign up <span class="ref-here">HERE</span> <span class="ref-code-inline">(${esc(r.code)})</span>
            </a>
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
/* 7. Topic: Web3 Tools (formerly Bots)                                 */
/* ------------------------------------------------------------------ */
function buildWeb3Tools(d) {
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
      { '@type': 'ListItem', position: 2, name: 'Web3 Tools', item: `${SITE}/web3-tools/` },
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
              <a class="ref-link" href="${esc(b.url)}" target="_blank" rel="noopener nofollow sponsored">
                Use ${esc(b.name)} <span class="ref-here">HERE</span> <span class="ref-code-inline">(${esc(b.code)})</span>
              </a>
            </article>`).join('')}
        </div>
      </section>`;
  }).join('');

  return `${head({
    title: 'Web3 Trading Tools — Telegram Bots & Referral Codes | ClownOnChains',
    desc: 'Web3 trading tools with referral codes: Dawn, Cove, CopyFomo, Maestro, GMGN, OKX Web3, Axiom and Zenith. Multichain, bridge and liquidity pool tools.',
    keywords: 'web3 trading bot, telegram trading bot, solana sniper bot, crypto copy trading, referral code',
    canonical: `${SITE}/web3-tools/`,
    jsonld: breadcrumbLd,
  })}
<body>
${NAV}
  <main class="wrap" style="padding:44px 18px 20px">
    <header style="max-width:1120px;margin:0 auto 26px">
      <nav aria-label="Breadcrumb" style="font-size:12.5px;color:var(--text-faint);margin-bottom:14px">
        <a href="/">Home</a> › <span>Web3 Tools</span>
      </nav>
      <h1 style="font-family:ui-serif,Georgia,serif;font-size:clamp(30px,5vw,46px);letter-spacing:-.02em;margin:0 0 10px;color:#fbf3e6">
        Web3 Trading Tools</h1>
      <p style="color:var(--text-dim);font-size:16.5px;margin:0;max-width:640px">
        ${d.BOT_REFS.length} vetted tools with referral codes. Multichain, bridge and liquidity
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
/* 8. Topic: News (index + artikel parafrase)                           */
/* ------------------------------------------------------------------ */
function buildNews(d) {
  const newsHtml = d.NEWS.map((n) => `
        <article class="news-item">
          <h3 class="news-title" style="margin:0;font-size:15px">
            <a href="/news/${n.slug}/">${esc(n.t)}</a>
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
        All articles are paraphrased and hosted on our site.
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
/* 9. News article (parafrase, no redirect)                            */
/* ------------------------------------------------------------------ */
function buildNewsArticle(n, d) {
  const url = `${SITE}/news/${n.slug}/`;
  const idx = d.NEWS.indexOf(n);
  const prev = d.NEWS[idx - 1];
  const next = d.NEWS[idx + 1];

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: n.t,
    description: n.body.slice(0, 160),
    inLanguage: 'en',
    datePublished: todayISO,
    dateModified: todayISO,
    articleSection: 'Crypto News',
    author: { '@type': 'Organization', name: 'ClownOnChains', url: `${SITE}/` },
    publisher: { '@type': 'Organization', name: 'ClownOnChains', logo: { '@type': 'ImageObject', url: `${SITE}/assets/favicon.svg` } },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
  };

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
      { '@type': 'ListItem', position: 2, name: 'News', item: `${SITE}/news/` },
      { '@type': 'ListItem', position: 3, name: n.t, item: url },
    ],
  };

  return `${head({
    title: `${n.t} | ClownOnChains`,
    desc: n.body.slice(0, 160),
    keywords: `${n.t.toLowerCase()}, crypto news, market intel`,
    canonical: url,
    ogType: 'article',
    jsonld: [articleLd, breadcrumbLd],
  })}
<body>
${NAV}
  <main class="wrap" style="padding:34px 18px 10px">
    <nav aria-label="Breadcrumb" style="font-size:12.5px;color:var(--text-faint);margin-bottom:18px">
      <a href="/">Home</a> › <a href="/news/">News</a> › <span>${esc(n.t)}</span>
    </nav>

    <article class="reader" style="max-width:760px;margin:0 auto">
      <header>
        <h1 style="font-family:ui-serif,Georgia,serif;font-size:clamp(28px,4.4vw,42px);letter-spacing:-.02em;margin:10px 0 8px;color:#fbf3e6">
          ${esc(n.t)}
        </h1>
        <div class="tut-meta">${esc(n.s)} · ${esc(n.d)} · Not financial advice</div>
      </header>

      <div class="reader-body">${mdToHtml(n.body)}</div>

      ${refBlock(d, ['binance','bybit'])}

      <nav class="pager" aria-label="Article navigation">
        ${prev ? `<a class="card hover" href="/news/${prev.slug}/"><span class="tut-meta" style="margin:0">← Previous</span><span class="tut-title">${esc(prev.t)}</span></a>` : '<span></span>'}
        ${next ? `<a class="card hover" href="/news/${next.slug}/" style="text-align:right"><span class="tut-meta" style="margin:0">Next →</span><span class="tut-title">${esc(next.t)}</span></a>` : '<span></span>'}
      </nav>
    </article>
  </main>
${FOOTER}
</body>
</html>
`;
}

/* ------------------------------------------------------------------ */
/* 10. Topic: Academy index                                             */
/* ------------------------------------------------------------------ */
function buildAcademyIndex(d) {
  const levels = ['Beginner', 'Intermediate', 'Advanced'];
  const groups = levels.map((lv) => {
    const items = d.TUTORIALS.filter((t) => t.level === lv);
    if (!items.length) return '';
    return `
      <section class="acad-group" aria-labelledby="h-lv-${lv}">
        <div class="acad-group-head">
          <h2 class="section-title" id="h-lv-${lv}" style="font-size:20px;margin:0">
            <span class="ic lvl-${lv}" aria-hidden="true">●</span> ${lv}</h2>
          <span class="acad-count">${items.length} lessons</span>
        </div>
        <div class="grid cols-2">
          ${items.map((t) => `<a class="card hover tut-card" href="/academy/${slug(t.title)}/">
            <span class="tut-title">${esc(t.title)}</span>
            <span class="tut-meta">🕐 ${t.min} min read <span style="margin-left:auto">→</span></span>
          </a>`).join('')}
        </div>
      </section>`;
  }).join('');

  // ---- learning tracks ----
  const trackByTitle = {};
  for (const t of d.TUTORIALS) trackByTitle[t.title] = t;
  const tracksHtml = d.TRACKS.map((tr) => {
    const steps = tr.lessons
      .map((title, i) => {
        const t = trackByTitle[title];
        if (!t) return '';
        return `<a class="track-step" href="/academy/${slug(title)}/">
            <span class="track-num">${i + 1}</span>
            <span class="track-step-title">${esc(title)}</span>
            <span class="track-step-min">${t.min} min</span>
          </a>`;
      }).join('');
    const totalMin = tr.lessons.reduce((n, title) => n + (trackByTitle[title]?.min || 0), 0);
    return `
      <article class="card track-card">
        <div class="track-head">
          <span class="track-icon" aria-hidden="true">${tr.icon}</span>
          <div>
            <h3 class="track-name">${esc(tr.name)}</h3>
            <div class="track-meta">${tr.lessons.length} lessons · ${totalMin} min total · ${esc(tr.level)}</div>
          </div>
        </div>
        <p class="track-desc">${esc(tr.desc)}</p>
        <div class="track-steps">${steps}
        </div>
      </article>`;
  }).join('');

  // ---- glossary preview (12 pertama) ----
  const glossaryPreview = d.GLOSSARY.slice(0, 12).map((g) => `
        <a class="gloss-chip" href="/glossary/${g.slug}/">
          <span class="gloss-term">${esc(g.term)}</span>
          <span class="gloss-short">${esc(g.short)}</span>
        </a>`).join('');

  const itemListLd = {
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

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
      { '@type': 'ListItem', position: 2, name: 'Academy', item: `${SITE}/academy/` },
    ],
  };

  return `${head({
    title: 'Crypto Academy — Free Blockchain & Web3 Education | ClownOnChains',
    desc: `Learn crypto and blockchain for free: ${d.TUTORIALS.length} lessons and ${d.GLOSSARY.length} glossary terms covering wallets, airdrops, DeFi, stablecoins and trading. Beginner to advanced tracks.`,
    keywords: 'crypto academy, free crypto education, blockchain course, defi tutorial, airdrop farming guide, crypto glossary, learn crypto',
    canonical: `${SITE}/academy/`,
    jsonld: [breadcrumbLd, itemListLd],
  })}
<body>
${NAV}
  <main class="wrap" style="padding:0 18px 20px">
    <header class="acad-hero">
      <div class="acad-hero-glow" aria-hidden="true"></div>
      <nav aria-label="Breadcrumb" style="font-size:12.5px;color:var(--text-faint);margin-bottom:14px;position:relative">
        <a href="/">Home</a> › <span>Academy</span>
      </nav>
      <p class="hero-eyebrow" style="position:relative">Blockchain &amp; Crypto Education</p>
      <h1 class="acad-h1">Crypto Academy</h1>
      <p class="acad-sub">Learn crypto and blockchain for free — ${d.TUTORIALS.length} lessons and
        ${d.GLOSSARY.length} glossary terms. No hype, no signals. Just the mechanics, the costs, and
        the mistakes that actually cost people money.</p>
      <div class="acad-stats">
        <div class="acad-stat"><span class="n">${d.TUTORIALS.length}</span><span class="l">Lessons</span></div>
        <div class="acad-stat"><span class="n">${d.TRACKS.length}</span><span class="l">Learning tracks</span></div>
        <div class="acad-stat"><span class="n">${d.GLOSSARY.length}</span><span class="l">Glossary terms</span></div>
        <div class="acad-stat"><span class="n">Free</span><span class="l">No signup</span></div>
      </div>
    </header>

    <section class="block" style="max-width:1120px;margin:0 auto" aria-labelledby="h-tracks">
      <div class="section-head">
        <h2 class="section-title" id="h-tracks" style="margin:0"><span class="ic" aria-hidden="true">🧭</span> Learning tracks</h2>
        <p class="section-sub" style="margin:0">Follow a path in order, or jump to what you need.</p>
      </div>
      <div class="track-grid">${tracksHtml}
      </div>
    </section>

    <section class="block" style="max-width:1120px;margin:0 auto" aria-labelledby="h-lessons">
      <div class="section-head">
        <h2 class="section-title" id="h-lessons" style="margin:0"><span class="ic" aria-hidden="true">📖</span> All lessons</h2>
      </div>
      <div class="acad-groups">${groups}
      </div>
    </section>

    <section class="block" style="max-width:1120px;margin:0 auto" aria-labelledby="h-gloss">
      <div class="section-head">
        <h2 class="section-title" id="h-gloss" style="margin:0"><span class="ic" aria-hidden="true">📚</span> Crypto glossary</h2>
        <a class="btn ghost" href="/glossary/">All ${d.GLOSSARY.length} terms →</a>
      </div>
      <p class="section-sub" style="margin:-8px 0 18px">Plain-English definitions for the words that get thrown around without explanation.</p>
      <div class="gloss-grid">${glossaryPreview}
      </div>
    </section>
  </main>
${FOOTER}
</body>
</html>
`;
}

/* ------------------------------------------------------------------ */
/* 10b. Glossary index + halaman per istilah                            */
/* ------------------------------------------------------------------ */
function buildGlossaryIndex(d) {
  const byLetter = {};
  for (const g of d.GLOSSARY) {
    const L = g.term[0].toUpperCase();
    (byLetter[L] = byLetter[L] || []).push(g);
  }
  const letters = Object.keys(byLetter).sort();

  const nav = letters
    .map((L) => `<a class="gloss-letter" href="#L-${L}">${L}</a>`)
    .join('');

  const sections = letters.map((L) => `
      <section class="gloss-section" aria-labelledby="L-${L}">
        <h2 id="L-${L}" class="gloss-letter-head">${L}</h2>
        <div class="gloss-list">
          ${byLetter[L].map((g) => `
            <a class="gloss-row" href="/glossary/${g.slug}/">
              <span class="gloss-term">${esc(g.term)}</span>
              <span class="gloss-short">${esc(g.short)}</span>
              <span class="gloss-arrow" aria-hidden="true">→</span>
            </a>`).join('')}
        </div>
      </section>`).join('');

  const definedTermSetLd = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTermSet',
    name: 'ClownOnChains Crypto Glossary',
    description: 'Plain-English definitions of crypto, Web3 and DeFi terms.',
    url: `${SITE}/glossary/`,
    hasDefinedTerm: d.GLOSSARY.map((g) => ({
      '@type': 'DefinedTerm',
      name: g.term,
      description: g.short,
      url: `${SITE}/glossary/${g.slug}/`,
      inDefinedTermSet: `${SITE}/glossary/`,
    })),
  };

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
      { '@type': 'ListItem', position: 2, name: 'Academy', item: `${SITE}/academy/` },
      { '@type': 'ListItem', position: 3, name: 'Glossary', item: `${SITE}/glossary/` },
    ],
  };

  return `${head({
    title: 'Crypto Glossary — Plain-English Web3 & DeFi Terms | ClownOnChains',
    desc: `Crypto glossary: ${d.GLOSSARY.length} terms explained in plain English. Airdrop, AMM, impermanent loss, MEV, zk-rollup, stablecoin and more. No jargon.`,
    keywords: 'crypto glossary, web3 terms, defi dictionary, what is an airdrop, what is impermanent loss, blockchain terminology',
    canonical: `${SITE}/glossary/`,
    jsonld: [breadcrumbLd, definedTermSetLd],
  })}
<body>
${NAV}
  <main class="wrap" style="padding:44px 18px 20px">
    <header style="max-width:820px;margin:0 auto 26px">
      <nav aria-label="Breadcrumb" style="font-size:12.5px;color:var(--text-faint);margin-bottom:14px">
        <a href="/">Home</a> › <a href="/academy/">Academy</a> › <span>Glossary</span>
      </nav>
      <h1 style="font-family:ui-serif,Georgia,serif;font-size:clamp(30px,5vw,46px);letter-spacing:-.02em;margin:0 0 12px;color:#fbf3e6">
        Crypto Glossary</h1>
      <p style="color:var(--text-dim);font-size:16.5px;margin:0">${d.GLOSSARY.length} terms explained
        without the jargon. If a word gets thrown around without explanation, it belongs here.</p>
      <nav class="gloss-letters" aria-label="Jump to letter">${nav}
      </nav>
    </header>
    <div style="max-width:820px;margin:0 auto">${sections}
    </div>
  </main>
${FOOTER}
</body>
</html>
`;
}

function buildGlossaryTerm(g, d) {
  const url = `${SITE}/glossary/${g.slug}/`;
  const related = d.GLOSSARY.filter((x) => x.slug !== g.slug).slice(0, 6);

  const termLd = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    name: g.term,
    description: g.short,
    url,
    inDefinedTermSet: { '@type': 'DefinedTermSet', name: 'ClownOnChains Crypto Glossary', url: `${SITE}/glossary/` },
  };

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
      { '@type': 'ListItem', position: 2, name: 'Academy', item: `${SITE}/academy/` },
      { '@type': 'ListItem', position: 3, name: 'Glossary', item: `${SITE}/glossary/` },
      { '@type': 'ListItem', position: 4, name: g.term, item: url },
    ],
  };

  const relatedHtml = related.map((r) => `
        <a class="gloss-chip" href="/glossary/${r.slug}/">
          <span class="gloss-term">${esc(r.term)}</span>
          <span class="gloss-short">${esc(r.short)}</span>
        </a>`).join('');

  return `${head({
    title: `What Is ${g.term}? — Crypto Glossary | ClownOnChains`,
    desc: `${g.term}: ${g.short}`,
    keywords: `what is ${g.term.toLowerCase()}, ${g.term.toLowerCase()} meaning, ${g.term.toLowerCase()} explained, crypto glossary`,
    canonical: url,
    jsonld: [breadcrumbLd, termLd],
  })}
<body>
${NAV}
  <main class="wrap" style="padding:34px 18px 10px">
    <nav aria-label="Breadcrumb" style="font-size:12.5px;color:var(--text-faint);margin-bottom:18px">
      <a href="/">Home</a> › <a href="/academy/">Academy</a> › <a href="/glossary/">Glossary</a> › <span>${esc(g.term)}</span>
    </nav>

    <article style="max-width:760px;margin:0 auto">
      <header>
        <p class="hero-eyebrow" style="margin-bottom:12px">Glossary</p>
        <h1 style="font-family:ui-serif,Georgia,serif;font-size:clamp(30px,5vw,46px);letter-spacing:-.02em;margin:0 0 12px;color:#fbf3e6">
          ${esc(g.term)}</h1>
        <p class="gloss-lead">${esc(g.short)}</p>
      </header>

      <div class="reader-body">${mdToHtml(g.body)}</div>

      ${refBlock(d, [])}

      <section class="block" aria-labelledby="h-rel" style="margin-top:34px">
        <h2 id="h-rel" style="font-family:ui-serif,Georgia,serif;font-size:20px;margin:0 0 14px;color:#fbf3e6">
          Related terms</h2>
        <div class="gloss-grid">${relatedHtml}
        </div>
      </section>

      <p style="margin:26px 0 0">
        <a class="btn ghost" href="/glossary/">← All glossary terms</a>
      </p>
    </article>
  </main>
${FOOTER}
</body>
</html>
`;
}

/* ------------------------------------------------------------------ */
/* Referral block — dipakai di setiap artikel (news, tutorial, glossary, blog) */
/* ------------------------------------------------------------------ */
function refBlock(d, pick) {
  const pool = d.AFFILIATE.filter((a) => a.kind === 'exchange');
  const bots = d.AFFILIATE.filter((a) => a.kind === 'bot');
  const chosen = (pick || []).map((s) => d.AFFILIATE.find((a) => a.slug === s)).filter(Boolean);
  const extras = pool.filter((a) => !chosen.includes(a)).slice(0, 3 - chosen.length);
  const list = [...chosen, ...extras];

  const rows = list.map((a) => `
          <a class="ref-row" href="${esc(a.url)}" target="_blank" rel="noopener nofollow sponsored">
            <span class="aff-logo ref-logo" aria-hidden="true">${esc(a.name.slice(0, 1))}</span>
            <span class="ref-row-main">
              <span class="ref-row-name">${esc(a.name)}</span>
              <span class="ref-row-sub">${esc(a.disc)} fee discount · ${esc(a.feeTaker)} taker</span>
            </span>
            <code class="ref-row-code">${esc(a.code)}</code>
            <span class="ref-here">HERE →</span>
          </a>`).join('');

  const botRow = bots.slice(0, 2).map((a) => `
          <a class="ref-row" href="${esc(a.url)}" target="_blank" rel="noopener nofollow sponsored">
            <span class="aff-logo ref-logo" aria-hidden="true">${esc(a.name.slice(0, 1))}</span>
            <span class="ref-row-main">
              <span class="ref-row-name">${esc(a.name)}</span>
              <span class="ref-row-sub">Web3 tool · multichain</span>
            </span>
            <code class="ref-row-code">${esc(a.code)}</code>
            <span class="ref-here">HERE →</span>
          </a>`).join('');

  return `
      <aside class="ref-block" aria-labelledby="h-ref">
        <div class="ref-block-head">
          <h2 id="h-ref" class="ref-block-title">Start here — referral codes</h2>
          <p class="ref-block-sub">Registering through these links applies the fee discount. No extra cost to you.</p>
        </div>
        <div class="ref-rows">${rows}${botRow}
        </div>
        <p class="ref-block-foot">
          Full guides: <a href="/affiliate/">all referral codes</a> · <a href="/blog/">exchange guides</a>
        </p>
      </aside>`;
}

/* ------------------------------------------------------------------ */
/* 11b. Blog — daftar + halaman artikel (dari queue/blog-posts.json)     */
/* ------------------------------------------------------------------ */
function buildBlogIndex(d) {
  const posts = d.BLOG || [];
  const affBySlug = {};
  for (const a of d.AFFILIATE) affBySlug[a.slug] = a;

  const cards = posts.map((p) => {
    const aff = affBySlug[p.affiliate];
    return `
        <a class="card hover blog-card" href="/blog/${p.slug}/">
          <div class="blog-card-top">
            ${aff ? `<span class="aff-logo blog-logo" aria-hidden="true">${esc(aff.name.slice(0, 1))}</span>` : ''}
            <div>
              <span class="aff-kind">${aff ? esc(aff.name) : 'Guide'}</span>
              <h3 class="blog-card-title">${esc(p.title)}</h3>
            </div>
          </div>
          <p class="blog-card-desc">${esc(p.desc)}</p>
          <div class="blog-card-foot">
            <span class="tut-meta" style="margin:0">🕐 ${Math.max(1, Math.round((p.words || 600) / 200))} min read</span>
            ${aff ? `<code class="blog-card-code">${esc(aff.code)}</code>` : ''}
          </div>
        </a>`;
  }).join('');

  const itemListLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Crypto Referral and Exchange Guides',
    itemListElement: posts.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: p.title,
      url: `${SITE}/blog/${p.slug}/`,
    })),
  };

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE}/blog/` },
    ],
  };

  return `${head({
    title: 'Crypto Exchange Guides & Referral Tips | ClownOnChains',
    desc: `${posts.length} in-depth guides on crypto exchanges, fees, referral codes and trading tools — written for people who want the details, not the hype.`,
    keywords: 'crypto exchange guide, referral code guide, exchange fees, crypto tutorial, trading bot guide',
    canonical: `${SITE}/blog/`,
    jsonld: [breadcrumbLd, itemListLd],
  })}
<body>
${NAV}
  <main class="wrap" style="padding:44px 18px 20px">
    <header style="max-width:820px;margin:0 auto 30px">
      <nav aria-label="Breadcrumb" style="font-size:12.5px;color:var(--text-faint);margin-bottom:14px">
        <a href="/">Home</a> › <span>Blog</span>
      </nav>
      <h1 class="aff-hub-h1">Guides</h1>
      <p class="aff-lead">${posts.length} in-depth articles on exchanges, fees, referral codes and
        trading tools. Each one answers a specific question — no recycled filler.</p>
    </header>
    <div class="blog-grid">${cards}
    </div>
  </main>
${FOOTER}
</body>
</html>
`;
}

function buildBlogPost(p, d) {
  const url = `${SITE}/blog/${p.slug}/`;
  const aff = d.AFFILIATE.find((a) => a.slug === p.affiliate);
  const idx = d.BLOG.indexOf(p);
  const prev = d.BLOG[idx + 1];
  const next = d.BLOG[idx - 1];

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: p.title,
    description: p.desc,
    inLanguage: 'en',
    datePublished: (p.published_at || todayISO).slice(0, 10),
    dateModified: (p.published_at || todayISO).slice(0, 10),
    articleSection: 'Crypto Guides',
    author: { '@type': 'Organization', name: 'ClownOnChains', url: `${SITE}/` },
    publisher: {
      '@type': 'Organization',
      name: 'ClownOnChains',
      logo: { '@type': 'ImageObject', url: `${SITE}/assets/favicon.svg` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
  };

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE}/blog/` },
      { '@type': 'ListItem', position: 3, name: p.title, item: url },
    ],
  };

  const codeBox = aff ? `
      <aside class="aff-code-box" aria-label="Referral code">
        <div>
          <span class="aff-code-label">${esc(aff.name)} referral code</span>
          <code class="aff-code-value">${esc(aff.code)}</code>
        </div>
        <a class="btn primary" href="${esc(aff.url)}" target="_blank" rel="noopener nofollow sponsored">
          Open ${esc(aff.name)} →
        </a>
      </aside>` : '';

  const relatedLinks = aff ? `
      <aside class="aff-cross-box" aria-labelledby="h-rel">
        <h2 id="h-rel" class="aff-cross-head">More on ${esc(aff.name)}</h2>
        <div class="aff-cross-grid">
          ${d.ANGLES.map((g) => `<a class="aff-cross" href="/affiliate/${aff.slug}/${g.slug}/">
            <span class="aff-cross-label">${esc(g.label)}</span>
            <span class="aff-cross-arrow" aria-hidden="true">→</span>
          </a>`).join('')}
        </div>
      </aside>` : '';

  return `${head({
    title: `${p.title} | ClownOnChains`,
    desc: p.desc,
    keywords: `${p.keyword}, crypto exchange guide, referral code`,
    canonical: url,
    ogType: 'article',
    jsonld: [articleLd, breadcrumbLd],
  })}
<body>
${NAV}
  <main class="wrap" style="padding:34px 18px 10px">
    <nav aria-label="Breadcrumb" style="font-size:12.5px;color:var(--text-faint);margin-bottom:18px">
      <a href="/">Home</a> › <a href="/blog/">Blog</a> › <span>${esc(p.title)}</span>
    </nav>

    <article style="max-width:760px;margin:0 auto">
      <header>
        <h1 class="aff-h1" style="font-size:clamp(27px,4.4vw,40px)">${esc(p.title)}</h1>
        <div class="tut-meta">🕐 ${Math.max(1, Math.round((p.words || 600) / 200))} min read · Updated ${(p.published_at || todayISO).slice(0, 10)} · Not financial advice</div>
      </header>

      ${codeBox}

      <div class="reader-body">${mdToHtml(p.body)}</div>

      ${refBlock(d, aff ? [aff.slug] : [])}

      <aside class="card" style="margin:30px 0;background:rgba(240,179,94,.06);border-color:rgba(240,179,94,.28)">
        <strong style="color:#fff7ea">Referral disclosure.</strong>
        <p style="margin:6px 0 0;color:var(--text-dim);font-size:14px">Links on this page are referral
          links. Registering through them may earn this site a commission at no extra cost to you.
          It does not change what the article says.</p>
      </aside>

      ${relatedLinks}

      <nav class="pager" aria-label="Article navigation" style="margin-top:26px">
        ${prev ? `<a class="card hover" href="/blog/${prev.slug}/"><span class="tut-meta" style="margin:0">← Older</span><span class="tut-title">${esc(prev.title)}</span></a>` : '<span></span>'}
        ${next ? `<a class="card hover" href="/blog/${next.slug}/" style="text-align:right"><span class="tut-meta" style="margin:0">Newer →</span><span class="tut-title">${esc(next.title)}</span></a>` : '<span></span>'}
      </nav>
    </article>
  </main>
${FOOTER}
</body>
</html>
`;
}

/* ------------------------------------------------------------------ */
/* 11. Topic: Community (email + Twitter)                               */
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
    title: 'Community — Join ClownOnChains | Email Updates & Twitter',
    desc: 'Join the ClownOnChains community. Subscribe for email updates and follow us on Twitter @ClownonChains for the latest airdrop alpha and web3 news.',
    keywords: 'crypto community, web3 discussion, airdrop forum, crypto alpha, twitter',
    canonical: `${SITE}/community/`,
    jsonld: breadcrumbLd,
  })}
<body>
${NAV}
  <main class="wrap" style="padding:44px 18px 20px">
    <header style="max-width:760px;margin:0 auto 30px">
      <nav aria-label="Breadcrumb" style="font-size:12.5px;color:var(--text-faint);margin-bottom:14px">
        <a href="/">Home</a> › <span>Community</span>
      </nav>
      <h1 style="font-family:ui-serif,Georgia,serif;font-size:clamp(30px,5vw,46px);letter-spacing:-.02em;margin:0 0 10px;color:#fbf3e6">
        Join the Community</h1>
      <p style="color:var(--text-dim);font-size:16.5px;margin:0;max-width:640px">
        Stay updated with the latest airdrop alpha, exchange referrals, and web3 tools.
        Subscribe with your email or follow us on Twitter.
      </p>
    </header>

    <div style="max-width:760px;margin:0 auto;display:grid;gap:20px">
      <section class="card" aria-labelledby="h-email">
        <h2 id="h-email" style="font-family:ui-serif,Georgia,serif;font-size:20px;margin:0 0 8px;color:#fbf3e6">
          📧 Email Updates</h2>
        <p style="color:var(--text-dim);font-size:14.5px;margin:0 0 16px">
          Get notified when we add new airdrops, exchange codes, or web3 tools. No spam — just alpha.
        </p>
        <form class="form-grid" id="email-form">
          <label class="sr-only" for="email-input">Email address</label>
          <input class="field" id="email-input" type="email" placeholder="your@email.com" required />
          <button class="btn primary" style="justify-content:center" type="submit">Subscribe</button>
        </form>
        <p id="email-msg" style="font-size:13px;color:var(--green);margin:10px 0 0;display:none">
          ✓ Thanks! You're on the list.
        </p>
      </section>

      <section class="card" aria-labelledby="h-twitter">
        <h2 id="h-twitter" style="font-family:ui-serif,Georgia,serif;font-size:20px;margin:0 0 8px;color:#fbf3e6">
          🐦 Twitter / X</h2>
        <p style="color:var(--text-dim);font-size:14.5px;margin:0 0 16px">
          Follow us for real-time updates, airdrop alerts, and community discussions.
        </p>
        <a class="btn primary" style="justify-content:center" href="https://x.com/ClownonChains" target="_blank" rel="noopener nofollow">
          Follow @ClownonChains on X →
        </a>
      </section>
    </div>
  </main>
${FOOTER}
  <script src="/app.js?v=${CSS_VER}" defer></script>
</body>
</html>
`;
}

/* ------------------------------------------------------------------ */
/* 12. Halaman tutorial (1 URL per topik)                              */
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

      <div class="reader-body">${mdToHtml(t.body)}</div>

      ${refBlock(d, [])}

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
          Referral codes and tools mentioned throughout this article, in one place.
        </p>
        <div class="playbook-grid">
          <section>
            <h3 style="font-size:12px;text-transform:uppercase;letter-spacing:.08em;color:var(--amber);margin:0 0 10px">Exchange codes</h3>
            ${d.EXCHANGE_REFS.map((r) => `<div class="playbook-row">
              <span class="playbook-name">${esc(r.name)}</span>
              <a href="${esc(r.url)}" target="_blank" rel="noopener nofollow sponsored">
                <span class="ref-here">HERE</span> <span class="ref-code-inline">(${esc(r.code)})</span>
              </a>
            </div>`).join('')}
          </section>
          <section>
            <h3 style="font-size:12px;text-transform:uppercase;letter-spacing:.08em;color:var(--amber);margin:0 0 10px">Web3 tool codes</h3>
            ${d.BOT_REFS.map((r) => `<div class="playbook-row">
              <span class="playbook-name">${esc(r.name)}</span>
              <a href="${esc(r.url)}" target="_blank" rel="noopener nofollow sponsored">
                <span class="ref-here">HERE</span> <span class="ref-code-inline">(${esc(r.code)})</span>
              </a>
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
/* 13. Sitemap + robots + feed + 404                                   */
/* ------------------------------------------------------------------ */
function buildSitemap(d) {
  const urls = [
    `<url><loc>${SITE}/</loc><lastmod>${todayISO}</lastmod><changefreq>daily</changefreq><priority>1.0</priority></url>`,
    `<url><loc>${SITE}/airdrops/</loc><lastmod>${todayISO}</lastmod><changefreq>daily</changefreq><priority>0.9</priority></url>`,
    `<url><loc>${SITE}/exchanges/</loc><lastmod>${todayISO}</lastmod><changefreq>weekly</changefreq><priority>0.9</priority></url>`,
    `<url><loc>${SITE}/web3-tools/</loc><lastmod>${todayISO}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>`,
    `<url><loc>${SITE}/affiliate/</loc><lastmod>${todayISO}</lastmod><changefreq>weekly</changefreq><priority>0.95</priority></url>`,
    ...d.AFFILIATE.map((a) => `<url><loc>${SITE}/affiliate/${a.slug}/</loc><lastmod>${todayISO}</lastmod><changefreq>weekly</changefreq><priority>0.9</priority></url>`),
    ...d.AFFILIATE.flatMap((a) => d.ANGLES.map((g) => `<url><loc>${SITE}/affiliate/${a.slug}/${g.slug}/</loc><lastmod>${todayISO}</lastmod><changefreq>monthly</changefreq><priority>0.85</priority></url>`)),
    `<url><loc>${SITE}/news/</loc><lastmod>${todayISO}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>`,
    `<url><loc>${SITE}/blog/</loc><lastmod>${todayISO}</lastmod><changefreq>daily</changefreq><priority>0.9</priority></url>`,
    ...(d.BLOG || []).map((p) => `<url><loc>${SITE}/blog/${p.slug}/</loc><lastmod>${(p.published_at||todayISO).slice(0,10)}</lastmod><changefreq>monthly</changefreq><priority>0.85</priority></url>`),
    `<url><loc>${SITE}/academy/</loc><lastmod>${todayISO}</lastmod><changefreq>weekly</changefreq><priority>0.9</priority></url>`,
    `<url><loc>${SITE}/glossary/</loc><lastmod>${todayISO}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>`,
    ...d.GLOSSARY.map((g) => `<url><loc>${SITE}/glossary/${g.slug}/</loc><lastmod>${todayISO}</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>`),
    `<url><loc>${SITE}/community/</loc><lastmod>${todayISO}</lastmod><changefreq>weekly</changefreq><priority>0.7</priority></url>`,
    ...d.AIRDROPS.map((a) => `<url><loc>${SITE}/airdrops/${a.slug}/</loc><lastmod>${todayISO}</lastmod><changefreq>weekly</changefreq><priority>0.85</priority></url>`),
    ...d.NEWS.map((n) => `<url><loc>${SITE}/news/${n.slug}/</loc><lastmod>${todayISO}</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>`),
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
/* 14. Tulis ke disk                                                    */
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
  for (const a of d.AIRDROPS) {
    built.push(write(`airdrops/${a.slug}/index.html`, buildAirdropPage(a, d)));
  }
  built.push(write('exchanges/index.html', buildExchanges(d)));
  built.push(write('web3-tools/index.html', buildWeb3Tools(d)));

  /* ---- affiliate: hub + per-partner + 15 x 8 halaman sudut ---- */
  const AH = { head, NAV, FOOTER, todayISO };
  built.push(write('affiliate/index.html', buildAffiliateHub(d, AH)));
  for (const a of d.AFFILIATE) {
    built.push(write(`affiliate/${a.slug}/index.html`, buildAffiliatePartner(a, d, AH)));
    for (const angle of d.ANGLES) {
      built.push(write(`affiliate/${a.slug}/${angle.slug}/index.html`, buildAffiliatePage(a, angle, d, AH)));
    }
  }
  built.push(write('news/index.html', buildNews(d)));
  built.push(write('blog/index.html', buildBlogIndex(d)));
  for (const p of (d.BLOG || [])) {
    built.push(write(`blog/${p.slug}/index.html`, buildBlogPost(p, d)));
  }
  for (const n of d.NEWS) {
    built.push(write(`news/${n.slug}/index.html`, buildNewsArticle(n, d)));
  }
  built.push(write('academy/index.html', buildAcademyIndex(d)));
  built.push(write('glossary/index.html', buildGlossaryIndex(d)));
  for (const g of d.GLOSSARY) {
    built.push(write(`glossary/${g.slug}/index.html`, buildGlossaryTerm(g, d)));
  }
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
  console.log(`  pages: home + 6 topics + ${d.NEWS.length} articles + ${d.TUTORIALS.length} tutorials + 404`);
  built.forEach((b) => console.log(`   ${b}`));
}

build();