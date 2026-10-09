/**
 * affiliate.js — generator halaman affiliate.
 *
 * Untuk setiap partner (15) × setiap sudut (8) = 120 halaman, masing-masing
 * dengan isi yang benar-benar berbeda — bukan template yang diisi ulang.
 *
 * Alasan: Google menghukum "scaled content abuse" (konten massal yang isinya
 * sama). Sudut yang berbeda + prosa yang berbeda = 120 halaman yang masing-masing
 * menjawab pertanyaan berbeda, bukan 120 salinan.
 */
const { SITE } = require('./build.config.js');

const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));

const inlineMd = (t) =>
  esc(t)
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|\s)\*([^*]+)\*/g, '$1<em>$2</em>');

function mdToHtml(text) {
  const out = [];
  for (const raw of String(text).split(/\n\s*\n/)) {
    const block = raw.trim();
    if (!block) continue;
    const h = block.match(/^(#{2,3})\s+(.+)$/);
    if (h && !block.includes('\n')) {
      out.push(`<h${h[1].length}>${inlineMd(h[2].trim())}</h${h[1].length}>`);
      continue;
    }
    if (/^>\s?/.test(block)) {
      out.push(`<blockquote>${inlineMd(block.split('\n').map((l) => l.replace(/^>\s?/, '')).join(' '))}</blockquote>`);
      continue;
    }
    const lines = block.split('\n').map((l) => l.trim()).filter(Boolean);
    const isUl = lines.length > 1 && lines.every((l) => /^[-*]\s+/.test(l));
    const isOl = lines.length > 1 && lines.every((l) => /^\d+[.)]\s+/.test(l));
    if (isUl || isOl) {
      const items = lines
        .map((l) => l.replace(/^[-*]\s+/, '').replace(/^\d+[.)]\s+/, ''))
        .map((li) => `<li>${inlineMd(li)}</li>`)
        .join('');
      out.push(`<${isUl ? 'ul' : 'ol'}>${items}</${isUl ? 'ul' : 'ol'}>`);
      continue;
    }
    out.push(`<p>${lines.map(inlineMd).join('<br/>')}</p>`);
  }
  return out.join('\n');
}

const fill = (tpl, a) =>
  String(tpl)
    .replace(/\{name\}/g, a.name)
    .replace(/\{code\}/g, a.code)
    .replace(/\{bonus\}/g, a.bonus)
    .replace(/\{fee_taker\}/g, a.feeTaker)
    .replace(/\{fee_maker\}/g, a.feeMaker)
    .replace(/\{disc\}/g, a.disc)
    .replace(/\{pairs\}/g, a.pairs);

/* ------------------------------------------------------------------ */
/*  Badan artikel — satu fungsi per sudut, prosa berbeda               */
/* ------------------------------------------------------------------ */
const BODIES = {
  'referral-code': (a) => `
The ${a.name} referral code **${a.code}** does one specific thing: it links your new account to a referrer, which is what unlocks the fee discount. Everything else people claim about referral codes — extra airdrops, hidden tiers, secret rewards — is usually marketing.

Here is what the code actually gives you on ${a.name}, how to make sure it applies, and where the real catches are.

## What the code actually does

When you open ${a.name} through a referral link and the code **${a.code}** is attached, ${a.name} registers you as a referred user. That registration is permanent and cannot be changed later.

The concrete benefit is a **${a.disc} discount on trading fees**. ${a.name} charges ${a.feeTaker} taker and ${a.feeMaker} maker at the standard tier; the referral discount applies on top of that.

${a.bonus !== '—' ? `There is also a signup reward attached: ${a.bonus}. That part is conditional — it releases in stages as you meet verification and volume requirements, not as a lump sum on day one.` : `There is no separate cash bonus on ${a.name}. The value is entirely in the ongoing fee discount.`}

## How to apply it correctly

The mistake that costs people the discount is signing up first and looking for a code field afterwards. On ${a.name} there is no way to add a referral code to an account that already exists.

${a.steps.map((s, i) => `${i + 1}. ${s}`).join('\n')}

If the code field is empty when you reach it, stop and reopen the link. Fixing it later means creating a new account.

## What to verify before you deposit

${a.watch.map((w) => `- ${w}`).join('\n')}

## Is it worth using a code at all?

If you are going to trade on ${a.name} anyway, yes — a ${a.disc} fee discount costs you nothing and applies for as long as the account is active. Over a year of regular trading, that is a meaningful amount.

What it is not is a reason to choose ${a.name} if the platform does not suit you. Pick the exchange for its liquidity, pairs and reliability first. The code is a discount on a decision you were already making, not the decision itself.
`,

  'signup-bonus': (a) => `
${a.name} advertises ${a.bonus} for new users who register through a referral link. Headline numbers like that deserve scrutiny, so here is what the offer actually consists of and what you have to do to collect it.

## What the bonus actually is

On ${a.name}, the signup reward is structured as ${a.bonus.toLowerCase().includes('voucher') || a.bonus.toLowerCase().includes('reward') ? 'staged rewards' : 'a mix of rewards and a fee discount'} rather than a single cash payment. That matters because it changes what you have to do to see any of it.

${a.bonus !== '—' ? `The advertised ceiling — ${a.bonus} — is reached only at the top of the ladder. Most new accounts collect a fraction of it, which is normal for this kind of promotion across the industry.` : `Note that ${a.name} does not run a headline cash bonus. The referral benefit here is the fee discount.`}

## The requirements, in order

${a.steps.map((s, i) => `${i + 1}. ${s}`).join('\n')}

The bonus releases in stages as you complete verification and hit volume thresholds. You cannot collect the top tier on day one, and no legitimate exchange will pay a large bonus before you have traded.

## What realistically pays out

For most people, the reliable part of the offer is the **${a.disc} fee discount**, which applies immediately and does not expire. The bonus ladder is upside — treat it as a bonus, not a plan.

${a.bonus !== '—' ? `If the ceiling number is the reason you are signing up, temper the expectation: hitting it usually requires deposit and volume levels well above what a casual user does in the first months.` : ''}

## Before you deposit

${a.watch.map((w) => `- ${w}`).join('\n')}

## The honest summary

A signup bonus is a customer acquisition cost that ${a.name} is willing to pay. That is fine — take it. Just do not let the headline number drive the decision. If ${a.name} is the right venue for what you want to trade, the bonus is a nice extra. If it is not, a bonus will not make it the right venue.
`,

  'how-to-register': (a) => `
This is the full sequence for creating a ${a.name} account with referral code **${a.code}** applied from the start — which is the only way to get it applied at all.

## Before you begin

Have your ID ready. ${a.name} requires identity verification before you can trade, and starting the signup without it just means doing two steps instead of one.

Also confirm you are opening the real domain. Phishing clones of major exchanges are common, and they look convincing. Type or bookmark the official address rather than clicking through from a search result.

## The steps

${a.steps.map((s, i) => `${i + 1}. ${s}`).join('\n')}

## The step people get wrong

Step three is where accounts lose the discount. The code **${a.code}** populates automatically from the referral link, but it sits in an editable field. If you clear it, retype it, or paste something else there, the referral is lost and cannot be restored.

Confirm the field reads exactly **${a.code}** before you submit the form.

## Your first deposit

${a.name} supports ${a.pairs} trading pairs, so there is no shortage of things to trade — which is exactly why the first deposit should be small. Send an amount you would be comfortable losing entirely, place one trade, and confirm the whole flow works before scaling up.

${a.kind === 'bot' ? `Note that ${a.name} is a trading bot rather than a traditional exchange. Your funds sit in the bot's wallet, not your own, which is a different risk profile from holding on an exchange.` : `Keep the first deposit modest. Verification, withdrawal limits and interface details are all easier to learn with a small balance.`}

## Security setup, immediately after

${a.watch.map((w) => `- ${w}`).join('\n')}

## Then what

Once the account works, the ongoing benefit of having used **${a.code}** is the **${a.disc} fee discount** applied to every trade. It does not expire and it does not need to be reapplied.
`,

  'fees-comparison': (a) => `
${a.name} charges **${a.feeTaker} taker** and **${a.feeMaker} maker**. Those two numbers decide what trading actually costs you, and the gap between them is where most of the savings are.

## Taker versus maker, plainly

A **taker** order removes liquidity from the order book — a market order, or a limit order that fills immediately. A **maker** order adds liquidity and waits. Exchanges charge less for makers because they improve the book.

On ${a.name} the spread is ${a.feeTaker} versus ${a.feeMaker}. Every order you place as a limit order that sits in the book costs you the maker rate instead.

## The referral discount on top

Using code **${a.code}** applies a **${a.disc} discount** to those rates. So a taker order that would cost ${a.feeTaker} costs roughly ${(parseFloat(a.feeTaker) * (1 - parseInt(a.disc) / 100)).toFixed(4)}% with the discount applied.

It is a small per-trade difference that compounds. A trader doing $50,000 of monthly volume pays a few hundred dollars a year less.

## How ${a.name} compares

Across the major venues, fee structures fall into rough bands:

- **${a.name}:** ${a.feeTaker} taker / ${a.feeMaker} maker
- **Low-fee futures venues** typically land around 0.05% taker
- **Full-service exchanges** commonly charge 0.10% taker on both sides
- **Telegram trading bots** typically charge around 1% per trade — an order of magnitude higher

${a.kind === 'bot' ? `That last row is the relevant one for ${a.name}. At ${a.feeTaker} per trade, a bot is a tool for speed and access, not for cost efficiency. Use it when the opportunity justifies the fee.` : `If cost is your priority, ${a.name}'s ${a.feeMaker} maker rate is the number to build around.`}

## Beyond the base rate

Two things move your effective fee more than the headline rate:

1. **Volume tiers.** Most exchanges cut fees as 30-day volume rises. The tiers are published — check where you land.
2. **Withdrawal fees.** These are charged per transaction and vary wildly by asset and network. A cheap trading fee means nothing if you withdraw on an expensive network.

## The practical takeaway

Use limit orders where you can, apply **${a.code}** for the ${a.disc} discount, and check withdrawal costs before moving funds. The trading fee is only part of what ${a.name} costs you.
`,

  'for-beginners': (a) => `
If you have never used ${a.name} before, the order you do things in matters more than anything else. This is the sequence that avoids the common early losses.

## Start smaller than feels reasonable

The instinct is to deposit enough to "make it worthwhile." Do the opposite. Deposit an amount you would shrug off if it vanished, and treat the first month as paying tuition.

On ${a.name} the minimum is low enough that this is easy. ${a.pairs} pairs are available, and having that much choice is exactly why a small first position is the right call — you do not yet know what you are doing.

## The first thing to set up

${a.watch.map((w) => `- ${w}`).join('\n')}

## Your first trade

Pick one liquid asset — a major pair, not a small-cap. Place a limit order rather than a market order so you see how the order book behaves and pay the maker fee.

The point of the first trade is not profit. It is confirming that deposit, order, and withdrawal all work the way you expect.

## Registering with a code

If you have not created the account yet, use **${a.code}** — it applies a **${a.disc} fee discount** for the life of the account and costs nothing.

${a.steps.map((s, i) => `${i + 1}. ${s}`).join('\n')}

## Mistakes to skip entirely

- **Trading on leverage in month one.** ${a.kind === 'bot' ? 'Especially relevant here — bot trading on new tokens is not a beginner activity.' : 'Leverage magnifies errors as efficiently as it magnifies gains.'}
- **Following a signal group.** If someone had reliable edge, they would not sell it for a subscription.
- **Chasing a token because it is up.** By the time it is visibly up, the move is largely done.
- **Depositing more after a loss to "make it back."** This is how small losses become account-ending ones.

## The realistic path

Learn one venue well — ${a.name} is a reasonable one to learn on — before adding a second. Learn spot before derivatives. Learn to withdraw before you learn to trade. Most people who lose money in crypto skip those steps in that order.
`,

  'is-it-safe': (a) => `
The honest answer to "is ${a.name} safe" is that it depends on what you are protecting against. Here is ${a.name}'s actual security profile, without the reassurance or the scaremongering.

## Track record

${a.kind === 'exchange'
  ? `${a.name} is an established exchange. It has not suffered a catastrophic loss of user funds of the kind that destroyed Mt. Gox, QuadrigaCX or FTX. That is the baseline you are comparing against, and it is a meaningful one — but it is history, not a guarantee.`
  : `${a.name} is a trading bot rather than an exchange. That changes the question: with a bot, your funds are held in the bot's wallet rather than your own, so the operator's security and honesty are the entire safety model. There is no proof of reserves to check and no regulator to appeal to.`}

## What actually protects you

${a.watch.map((w) => `- ${w}`).join('\n')}

## The risks that are not ${a.name}'s fault

Most losses attributed to exchanges are not breaches. They are phishing, malware, or a user approving a malicious contract. Two-factor authentication stops the first category; keeping most funds offline stops the second.

${a.kind === 'bot' ? `With a bot, the additional structural risk is custody. Funds in the bot's wallet are not in your control. Keep the working balance small and withdraw profits regularly — that single habit removes most of the exposure.` : `On an exchange, the structural risk is custody. Funds on ${a.name} are ${a.name}'s liability to you, not your property in the legal sense. If that distinction matters for your balance size, withdraw to a wallet you control.`}

## A reasonable security setup

1. Enable two-factor authentication using an app, not SMS.
2. Use a unique password stored in a password manager.
3. Whitelist withdrawal addresses if ${a.name} supports it.
4. Keep only working capital on the platform.
5. Verify the domain every time you log in — bookmark it.

## The verdict

${a.kind === 'exchange'
  ? `${a.name} is a legitimate, long-running venue with no history of catastrophic failure. For working balances it is a reasonable choice. For savings, self-custody is safer, and that is true of every exchange, not just this one.`
  : `${a.name} is a tool with a specific risk profile: you are trusting the operator with your balance. Use it for what it is good at, keep the balance limited, and do not treat it as a place to store funds.`}
`,

  'reduce-fees': (a) => `
Trading fees look trivial per trade and add up to a serious annual cost. On ${a.name} the base rate is ${a.feeTaker} taker and ${a.feeMaker} maker. Here is how to pay less than that.

## 1. Use the referral discount

The simplest reduction available is code **${a.code}**, which applies a **${a.disc} discount** to your fee rate. It takes effect on registration and does not expire.

${a.steps.slice(0, 3).map((s, i) => `${i + 1}. ${s}`).join('\n')}

## 2. Trade as a maker, not a taker

The single biggest lever is order type. A market order takes liquidity and pays ${a.feeTaker}. A limit order that rests in the book adds liquidity and pays ${a.feeMaker}.

On ${a.name} that difference is roughly ${(((parseFloat(a.feeTaker) - parseFloat(a.feeMaker)) / parseFloat(a.feeTaker)) * 100).toFixed(0)}% of your fee cost on every trade where it applies. Over a year of active trading it is the largest saving available to a retail user.

The trade-off is real: a limit order may not fill, and you may miss a fast move. For anything you are not in a hurry to execute, it is worth it.

## 3. Understand the volume tiers

Exchanges lower fees as 30-day volume rises. The tiers are published and the jumps between them can be significant. If you are close to a threshold, consolidating your trading on ${a.name} rather than spreading it across three venues can drop you into a cheaper band.

## 4. Watch withdrawal costs

Trading fees are visible; withdrawal fees are where exchanges quietly recover margin. The cost varies enormously by asset and network — withdrawing the same value on a different chain can cost ten times less.

Check the withdrawal fee before you move funds, and prefer cheap networks when the destination supports them.

## 5. Do not overtrade

The most effective fee reduction is fewer trades. Every round trip costs you twice — once entering, once exiting. Strategies that trade constantly have to overcome that drag before they make a cent of profit.

## The realistic total

Apply **${a.code}**, default to limit orders, consolidate volume, and check withdrawal networks. Together those typically cut effective costs by well over a third compared to a market-order habit at the base rate.
`,

  'common-mistakes': (a) => `
Most money lost on ${a.name} is lost to a short list of avoidable errors. None of them are exotic. Here they are, roughly in order of how much they cost.

## 1. Registering before applying the code

Creating the account first and hunting for a referral code field afterwards. ${a.name} does not let you add a code to an existing account, so the **${a.disc} fee discount** is gone permanently. Open the link with **${a.code}** first and confirm the field is populated.

## 2. Skipping two-factor authentication

${a.watch[1] || 'Enable 2FA on day one. Accounts without it are the ones that get drained.'}

## 3. Depositing more than the learning phase needs

The first month on any venue is practice. Sizing the deposit as if it were a funded strategy means the practice phase costs real money. Start with an amount you would not miss.

## 4. Trading a small-cap pair before understanding liquidity

${a.pairs} pairs are available on ${a.name}, and the illiquid ones look attractive because small money moves them. The same thinness that makes them move up fast makes them fall faster, and the spread eats the difference. Start with a major pair.

## 5. Using leverage before understanding liquidation

Leverage does not increase your edge — it increases your exposure to being right slowly. A position that would have recovered at 1x is closed at 10x. This is the most common way an account goes to zero in a single day.

## 6. Chasing a move that already happened

By the time a token is visibly pumping, the move is mostly over and you are the exit liquidity. If the reason you are buying is that it is up, that is not a reason.

## 7. Keeping everything on the platform

${a.kind === 'bot'
  ? `With a bot, your balance is held by the operator. Keep only working capital there and withdraw gains regularly.`
  : `Exchange balances are a counterparty claim, not custody. Keep working capital on ${a.name} and move savings to a wallet you control.`}

## 8. Adding to a loser to "average down"

Sometimes valid, usually rationalisation. The question is whether you would open the position today at this price with fresh money. If not, the position is a hope, not a trade.

## The pattern

Every item on this list is about sequence and sizing, not prediction. You do not need to forecast the market to avoid all eight — you need to do the boring things in the right order. That is most of the difference between people who stay in crypto and people who leave after one bad month.
`,
};

/* ------------------------------------------------------------------ */
/*  Generator halaman                                                    */
/* ------------------------------------------------------------------ */
function buildAffiliatePage(a, angle, d, helpers) {
  const { head, NAV, FOOTER } = helpers;
  const url = `${SITE}/affiliate/${a.slug}/${angle.slug}/`;
  const body = BODIES[angle.slug](a);

  // sudut lain untuk partner yang sama — internal linking
  const otherAngles = d.ANGLES.filter((x) => x.slug !== angle.slug).map((x) => `
        <a class="aff-cross" href="/affiliate/${a.slug}/${x.slug}/">
          <span class="aff-cross-label">${esc(x.label)}</span>
          <span class="aff-cross-arrow" aria-hidden="true">→</span>
        </a>`).join('');

  // partner lain dengan sudut yang sama
  const sameAngle = d.AFFILIATE.filter((x) => x.slug !== a.slug).slice(0, 6).map((x) => `
        <a class="aff-chip" href="/affiliate/${x.slug}/${angle.slug}/">
          <span class="aff-chip-name">${esc(x.name)}</span>
          <code>${esc(x.code)}</code>
        </a>`).join('');

  const faqHtml = a.faq.map(([q, ans]) => `
          <details class="faq-item">
            <summary class="faq-q">${esc(q)}</summary>
            <p class="faq-a">${esc(ans)}</p>
          </details>`).join('');

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: fill(angle.h1, a),
    description: fill(angle.desc, a),
    inLanguage: 'en',
    datePublished: helpers.todayISO,
    dateModified: helpers.todayISO,
    articleSection: 'Referral Guides',
    author: { '@type': 'Organization', name: 'ClownOnChains', url: `${SITE}/` },
    publisher: {
      '@type': 'Organization',
      name: 'ClownOnChains',
      logo: { '@type': 'ImageObject', url: `${SITE}/assets/favicon.svg` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
  };

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: a.faq.map(([q, ans]) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: ans },
    })),
  };

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
      { '@type': 'ListItem', position: 2, name: 'Affiliate', item: `${SITE}/affiliate/` },
      { '@type': 'ListItem', position: 3, name: a.name, item: `${SITE}/affiliate/${a.slug}/` },
      { '@type': 'ListItem', position: 4, name: fill(angle.label, a), item: url },
    ],
  };

  return `${head({
    title: fill(angle.title, a),
    desc: fill(angle.desc, a),
    keywords: `${a.name.toLowerCase()} referral code, ${a.name.toLowerCase()} ${a.code.toLowerCase()}, ${a.name.toLowerCase()} bonus, ${a.name.toLowerCase()} fee, ${a.name.toLowerCase()} signup, ${angle.label.toLowerCase()} ${a.name.toLowerCase()}`,
    canonical: url,
    ogType: 'article',
    jsonld: [articleLd, faqLd, breadcrumbLd],
  })}
<body>
${NAV}
  <main class="wrap" style="padding:34px 18px 10px">
    <nav aria-label="Breadcrumb" style="font-size:12.5px;color:var(--text-faint);margin-bottom:18px">
      <a href="/">Home</a> › <a href="/affiliate/">Affiliate</a> › <a href="/affiliate/${a.slug}/">${esc(a.name)}</a> › <span>${esc(angle.label)}</span>
    </nav>

    <article style="max-width:760px;margin:0 auto">
      <header>
        <div class="aff-head">
          <div class="aff-logo" aria-hidden="true">${esc(a.name.slice(0, 1))}</div>
          <div>
            <span class="aff-kind">${a.kind === 'exchange' ? 'Exchange' : 'Web3 Tool'}</span>
            <h1 class="aff-h1">${esc(fill(angle.h1, a))}</h1>
          </div>
        </div>
        <p class="aff-lead">${esc(fill(angle.lead, a))}</p>
      </header>

      <aside class="aff-code-box" aria-label="Referral code">
        <div>
          <span class="aff-code-label">${esc(a.name)} referral code</span>
          <code class="aff-code-value">${esc(a.code)}</code>
        </div>
        <a class="btn primary" href="${esc(a.url)}" target="_blank" rel="noopener nofollow sponsored">
          Open ${esc(a.name)} →
        </a>
      </aside>

      <div class="reader-body">${mdToHtml(body)}</div>

      <section class="aff-quick" aria-labelledby="h-quick">
        <h2 id="h-quick" class="aff-quick-head">${esc(a.name)} at a glance</h2>
        <div class="aff-quick-grid">
          <div class="aff-quick-row"><span>Taker fee</span><strong>${esc(a.feeTaker)}</strong></div>
          <div class="aff-quick-row"><span>Maker fee</span><strong>${esc(a.feeMaker)}</strong></div>
          <div class="aff-quick-row"><span>Referral discount</span><strong>${esc(a.disc)}</strong></div>
          <div class="aff-quick-row"><span>Trading pairs</span><strong>${esc(a.pairs)}</strong></div>
          <div class="aff-quick-row"><span>Availability</span><strong>${esc(a.country)}</strong></div>
          <div class="aff-quick-row"><span>Referral code</span><strong><code>${esc(a.code)}</code></strong></div>
        </div>
      </section>

      <section class="block" aria-labelledby="h-faq" style="padding-top:30px">
        <h2 id="h-faq" class="aff-sec-head">Frequently asked</h2>
        <div class="faq-list">${faqHtml}
        </div>
      </section>

      <aside class="aff-cross-box" aria-labelledby="h-more">
        <h2 id="h-more" class="aff-cross-head">More on ${esc(a.name)}</h2>
        <div class="aff-cross-grid">${otherAngles}
        </div>
      </aside>
    </article>

    <section class="block" style="max-width:760px;margin:0 auto" aria-labelledby="h-others">
      <h2 id="h-others" class="aff-sec-head">Other referral codes</h2>
      <div class="aff-chips">${sameAngle}
      </div>
    </section>
  </main>
${FOOTER}
</body>
</html>
`;
}

/* ------------------------------------------------------------------ */
/*  Hub /affiliate/ dan /affiliate/<partner>/                          */
/* ------------------------------------------------------------------ */
function buildAffiliateHub(d, helpers) {
  const { head, NAV, FOOTER } = helpers;

  const card = (a) => `
        <article class="card hover aff-card">
          <div class="aff-card-head">
            <div class="aff-logo" aria-hidden="true">${esc(a.name.slice(0, 1))}</div>
            <div>
              <h3 class="aff-card-name">${esc(a.name)}</h3>
              <span class="aff-kind">${a.kind === 'exchange' ? 'Exchange' : 'Web3 Tool'}</span>
            </div>
          </div>
          <p class="aff-card-tag">${esc(a.tagline)}</p>
          <div class="aff-card-code">
            <span class="aff-code-label">Code</span>
            <code>${esc(a.code)}</code>
          </div>
          <div class="aff-card-actions">
            <a class="ref-link" href="${esc(a.url)}" target="_blank" rel="noopener nofollow sponsored">
              Sign up <span class="ref-here">HERE</span>
            </a>
            <a class="aff-more" href="/affiliate/${a.slug}/">Guide →</a>
          </div>
        </article>`;

  const exchanges = d.AFFILIATE.filter((a) => a.kind === 'exchange');
  const bots = d.AFFILIATE.filter((a) => a.kind === 'bot');

  const itemListLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Crypto Exchange and Web3 Tool Referral Codes',
    itemListElement: d.AFFILIATE.map((a, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: `${a.name} referral code ${a.code}`,
      url: `${SITE}/affiliate/${a.slug}/`,
    })),
  };

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
      { '@type': 'ListItem', position: 2, name: 'Affiliate', item: `${SITE}/affiliate/` },
    ],
  };

  return `${head({
    title: 'Crypto Referral Codes 2026 — Exchange & Web3 Tool Discounts | ClownOnChains',
    desc: `Verified crypto referral codes for ${d.AFFILIATE.length} platforms: ${exchanges.map((a) => a.name).join(', ')}. Fee discounts, signup bonuses and honest guides for each.`,
    keywords: 'crypto referral code, binance referral code, bybit referral code, okx referral code, mexc referral code, exchange fee discount, crypto signup bonus',
    canonical: `${SITE}/affiliate/`,
    jsonld: [breadcrumbLd, itemListLd],
  })}
<body>
${NAV}
  <main class="wrap" style="padding:44px 18px 20px">
    <header style="max-width:820px;margin:0 auto 30px">
      <nav aria-label="Breadcrumb" style="font-size:12.5px;color:var(--text-faint);margin-bottom:14px">
        <a href="/">Home</a> › <span>Affiliate</span>
      </nav>
      <h1 class="aff-hub-h1">Crypto Referral Codes</h1>
      <p class="aff-lead">Verified referral codes for ${d.AFFILIATE.length} platforms, with the fee
        discount each one actually gives you. Every listing links to a full guide — what the code
        does, how to apply it, and the catches worth knowing before you deposit.</p>
    </header>

    <section class="block" style="max-width:1120px;margin:0 auto" aria-labelledby="h-ex">
      <h2 id="h-ex" class="aff-sec-head">Exchanges</h2>
      <div class="aff-grid">${exchanges.map(card).join('')}
      </div>
    </section>

    <section class="block" style="max-width:1120px;margin:0 auto" aria-labelledby="h-bots">
      <h2 id="h-bots" class="aff-sec-head">Web3 Tools</h2>
      <div class="aff-grid">${bots.map(card).join('')}
      </div>
    </section>

    <aside class="card" style="max-width:1120px;margin:34px auto 0;background:rgba(240,179,94,.06);border-color:rgba(240,179,94,.28)">
      <strong style="color:#fff7ea">How we treat referral links.</strong>
      <p style="margin:8px 0 0;color:var(--text-dim);font-size:14px">
        Every code on this page is a referral link, which means we may earn a commission if you
        register through it — at no extra cost to you. That is how the site is funded. It does not
        change what the guides say: each one covers the fee structure, the risks, and what to check
        before depositing, including the parts that are unflattering to the platform.</p>
    </aside>
  </main>
${FOOTER}
</body>
</html>
`;
}

function buildAffiliatePartner(a, d, helpers) {
  const { head, NAV, FOOTER } = helpers;
  const url = `${SITE}/affiliate/${a.slug}/`;

  const guides = d.ANGLES.map((angle) => `
        <a class="aff-guide" href="/affiliate/${a.slug}/${angle.slug}/">
          <span class="aff-guide-label">${esc(angle.label)}</span>
          <span class="aff-guide-title">${esc(fill(angle.h1, a))}</span>
          <span class="aff-guide-arrow" aria-hidden="true">→</span>
        </a>`).join('');

  const faqHtml = a.faq.map(([q, ans]) => `
          <details class="faq-item">
            <summary class="faq-q">${esc(q)}</summary>
            <p class="faq-a">${esc(ans)}</p>
          </details>`).join('');

  const orgLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${a.name} Referral Code ${a.code} — All Guides`,
    description: `Every guide for the ${a.name} referral code ${a.code}: fees, bonuses, registration, safety and common mistakes.`,
    inLanguage: 'en',
    datePublished: helpers.todayISO,
    dateModified: helpers.todayISO,
    author: { '@type': 'Organization', name: 'ClownOnChains', url: `${SITE}/` },
    publisher: { '@type': 'Organization', name: 'ClownOnChains', logo: { '@type': 'ImageObject', url: `${SITE}/assets/favicon.svg` } },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
  };

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
      { '@type': 'ListItem', position: 2, name: 'Affiliate', item: `${SITE}/affiliate/` },
      { '@type': 'ListItem', position: 3, name: a.name, item: url },
    ],
  };

  return `${head({
    title: `${a.name} Referral Code ${a.code} — Fees, Bonus & Guides | ClownOnChains`,
    desc: `${a.name} referral code ${a.code}: ${a.bonus}. Fee structure, how to register, safety review and common mistakes — ${d.ANGLES.length} in-depth guides.`,
    keywords: `${a.name.toLowerCase()} referral code, ${a.code.toLowerCase()}, ${a.name.toLowerCase()} bonus, ${a.name.toLowerCase()} fees, ${a.name.toLowerCase()} review`,
    canonical: url,
    jsonld: [breadcrumbLd, orgLd],
  })}
<body>
${NAV}
  <main class="wrap" style="padding:34px 18px 10px">
    <nav aria-label="Breadcrumb" style="font-size:12.5px;color:var(--text-faint);margin-bottom:18px">
      <a href="/">Home</a> › <a href="/affiliate/">Affiliate</a> › <span>${esc(a.name)}</span>
    </nav>

    <article style="max-width:760px;margin:0 auto">
      <header class="aff-head">
        <div class="aff-logo aff-logo-lg" aria-hidden="true">${esc(a.name.slice(0, 1))}</div>
        <div>
          <span class="aff-kind">${a.kind === 'exchange' ? 'Exchange' : 'Web3 Tool'}</span>
          <h1 class="aff-h1">${esc(a.name)} Referral Code ${esc(a.code)}</h1>
        </div>
      </header>

      <p class="aff-lead">${esc(a.tagline)}. ${esc(a.bonus)}.</p>

      <aside class="aff-code-box">
        <div>
          <span class="aff-code-label">Referral code</span>
          <code class="aff-code-value">${esc(a.code)}</code>
        </div>
        <a class="btn primary" href="${esc(a.url)}" target="_blank" rel="noopener nofollow sponsored">
          Open ${esc(a.name)} →
        </a>
      </aside>

      <section class="aff-quick" aria-labelledby="h-quick">
        <h2 id="h-quick" class="aff-quick-head">At a glance</h2>
        <div class="aff-quick-grid">
          <div class="aff-quick-row"><span>Taker fee</span><strong>${esc(a.feeTaker)}</strong></div>
          <div class="aff-quick-row"><span>Maker fee</span><strong>${esc(a.feeMaker)}</strong></div>
          <div class="aff-quick-row"><span>Referral discount</span><strong>${esc(a.disc)}</strong></div>
          <div class="aff-quick-row"><span>Trading pairs</span><strong>${esc(a.pairs)}</strong></div>
        </div>
      </section>

      <section class="block" aria-labelledby="h-why" style="padding-top:28px">
        <h2 id="h-why" class="aff-sec-head">Why people use ${esc(a.name)}</h2>
        <ul class="aff-list">${a.why.map((w) => `<li>${esc(w)}</li>`).join('')}</ul>
      </section>

      <section class="block" aria-labelledby="h-watch" style="padding-top:6px">
        <h2 id="h-watch" class="aff-sec-head">Worth knowing first</h2>
        <ul class="aff-list aff-list-warn">${a.watch.map((w) => `<li>${esc(w)}</li>`).join('')}</ul>
      </section>

      <section class="block" aria-labelledby="h-guides" style="padding-top:6px">
        <h2 id="h-guides" class="aff-sec-head">In-depth guides</h2>
        <div class="aff-guides">${guides}
        </div>
      </section>

      <section class="block" aria-labelledby="h-faq" style="padding-top:6px">
        <h2 id="h-faq" class="aff-sec-head">Frequently asked</h2>
        <div class="faq-list">${faqHtml}
        </div>
      </section>
    </article>
  </main>
${FOOTER}
</body>
</html>
`;
}

module.exports = { buildAffiliatePage, buildAffiliateHub, buildAffiliatePartner };
