// ============================================================
//  DATA — edit here to refresh the page
// ============================================================

const PRICES = [
  { sym:"BTC", px:85819.60, chg:-0.79 },
  { sym:"ETH", px:2714.49,  chg:-0.42 },
  { sym:"HYPE", px:94.88,   chg:0.00 },
  { sym:"SOL", px:120.73,   chg:-0.69 },
];

// ------------------------------------------------------------
//  AIRDROPS — setiap entri jadi halaman sendiri /airdrops/<slug>/
//  Tambah airdrop baru di sini, lalu jalankan `node build.js`.
// ------------------------------------------------------------
const AIRDROPS = [
  {
    slug: "grass",
    name: "Grass",
    chain: "Solana",
    tag: "DePIN",
    status: "Stage 2 — Live",
    allocation: "17% Allocation",
    tf: "Ongoing",
    url: "https://app.getgrass.io/register/?referralCode=6qvU6wx412SV6Vl",
    code: "6qvU6wx412SV6Vl",
    summary: "Grass is a DePIN network that turns unused internet bandwidth into a resource for AI data collection. Participants earn Grass points, which convert to tokens in each stage distribution.",
    tasks: [
      "Register at app.getgrass.io with referral code 6qvU6wx412SV6Vl",
      "Download the browser extension",
      "Install the desktop node application",
      "Run the node 24/7 to accumulate points",
      "Stay connected for more than 100 hours to maximise rewards",
    ],
  },
  {
    slug: "layerzero",
    name: "LayerZero",
    chain: "Multichain",
    tag: "Infrastructure",
    status: "Snapshot checking",
    allocation: "TBA",
    tf: "TBA",
    url: "https://layerzero.network",
    code: null,
    summary: "LayerZero is an omnichain messaging protocol connecting dozens of chains. Activity on protocols built on LayerZero (Stargate, bridges, and others) is the main qualification signal.",
    tasks: [
      "Bridge assets across chains using LayerZero-powered apps",
      "Use Stargate and other LayerZero protocols regularly",
      "Keep activity spread across multiple weeks",
      "Avoid bot-like patterns — sybil filters are aggressive",
    ],
  },
  {
    slug: "zksync-era",
    name: "zkSync Era",
    chain: "zkSync",
    tag: "L2 Rollup",
    status: "Claiming soon",
    allocation: "TBA",
    tf: "2 days left",
    url: "https://zksync.io",
    code: null,
    summary: "zkSync Era is a zero-knowledge rollup on Ethereum. Bridging from mainnet and using dApps on the chain are the standard qualification actions.",
    tasks: [
      "Bridge ETH from Ethereum mainnet to zkSync Era",
      "Swap and provide liquidity on zkSync dApps",
      "Mint an NFT or use a lending protocol on the chain",
      "Return regularly — activity over several months counts more",
    ],
  },
  {
    slug: "scroll",
    name: "Scroll",
    chain: "Scroll",
    tag: "zkEVM",
    status: "Farming active",
    allocation: "TBA",
    tf: "Q4 2026",
    url: "https://scroll.io",
    code: null,
    summary: "Scroll is a zkEVM rollup designed for full Ethereum compatibility. Farming centres on genuine on-chain usage before any announced snapshot.",
    tasks: [
      "Bridge funds to Scroll from Ethereum mainnet",
      "Swap on Scroll DEXes and provide liquidity",
      "Use lending and NFT protocols on the chain",
      "Sustain activity over time — one-off transactions rarely qualify",
    ],
  },
];

// ------------------------------------------------------------
//  EXCHANGE CODES — dipakai di playbook setiap artikel
// ------------------------------------------------------------
const EXCHANGE_REFS = [
  { name:"Binance",  url:"https://www.binance.com/join?ref=RMCTNB5R",     code:"RMCTNB5R",   desc:"Leading global crypto exchange." },
  { name:"Bybit",    url:"https://partner.bybit.com/b/BYBIT313",         code:"BYBIT313",   desc:"Best for derivatives and leverage." },
  { name:"BingX",    url:"https://bingx.pro/invite/6XOZMMGL/",          code:"6XOZMMGL",    desc:"Copy trading focused exchange." },
  { name:"Bitget",   url:"https://partner.bitgetapp.com/bg/7jl483901696997809300", code:"7jl483901696997809300", desc:"Copy trading + spot leader." },
  { name:"Gate.io",  url:"https://www.gate.io/signup/MONADSSS",          code:"MONADSSS",    desc:"Wide altcoin selection." },
  { name:"OKX",      url:"https://www.okx.com/join/ENJOYDISCOUNT",        code:"ENJOYDISCOUNT", desc:"Web3-integrated exchange." },
  { name:"MEXC",     url:"https://promote.mexc.com/r/pPBkDZ6m",          code:"pPBkDZ6m",    desc:"Fast listing new tokens." },
];

// ------------------------------------------------------------
//  WEB3 TOOLS — dipakai di playbook setiap artikel
// ------------------------------------------------------------
const BOT_REFS = [
  { name:"Dawn",     url:"https://t.me/DawnTradeBot?start=ref-kiseryott",     code:"ref-kiseryott", category:"Multichain (no bridge)", desc:"Telegram trading bot, multichain." },
  { name:"Cove",     url:"https://t.me/cove_trading_bot?start=ref_kiseryott", code:"ref_kiseryott", category:"Multichain (no bridge)", desc:"Copy trading on Solana + EVM." },
  { name:"CopyFomo", url:"https://t.me/copyfomo_bot?start=ref_kiseryott",    code:"ref-kiseryott", category:"Multichain (no bridge)", desc:"FOMO copy trading bot." },
  { name:"Maestro",  url:"https://t.me/maestro?start=r-bay_mach",            code:"r-bay_mach",   category:"Multichain bridge", desc:"Bridge + sniper + copy trading." },
  { name:"GMGN",     url:"https://gmgn.ai/r/degengem",                        code:"degengem",     category:"Multichain bridge", desc:"AI-powered trading terminal." },
  { name:"OKX Web3", url:"https://web3.okx.com/join/CLOWNZ",                  code:"CLOWNZ",      category:"Multichain bridge", desc:"OKX Web3 wallet + bot." },
  { name:"Axiom",    url:"https://axiom.trade/@rawrr",                       code:"rawrr",       category:"Multichain bridge", desc:"Solana-focused trading bot." },
  { name:"Zenith",   url:"https://t.me/zenith_lp_bot?start=kiseryott",        code:"kiseryott",    category:"Liquidity pools", desc:"LP management + sniper bot." },
];

// ------------------------------------------------------------
//  NEWS — artikel parafrase, di-host sendiri (tanpa redirect)
// ------------------------------------------------------------
const NEWS = [
  {
    slug:"us-treasury-moves-to-seize-1-billion-in-iranian-cryptocurrency",
    t:"U.S. Treasury Moves to Seize $1 Billion in Iranian Cryptocurrency",
    s:"Market Intel",
    d:"2 hours ago",
    src:"https://bitcoinmagazine.com/news/treasury-to-seize-one-billion-of-iran-crypto",
    body:"The United States Treasury has announced plans to seize roughly $1 billion in cryptocurrency allegedly held by Iranian entities. Treasury Secretary Scott Bessent said authorities have already identified the funds and are working to isolate them.\n\nSpeaking to reporters, Bessent framed the shift as a change in posture \u2014 from what he called a \"maximum pressure campaign\" to an \"absolute isolation campaign.\" He did not say which digital assets were targeted, nor how the seizure would actually be carried out.\n\n## Why Bitcoin is hard to freeze\n\nFreezing Bitcoin is technically difficult. Its censorship-resistant design means no central party can block a transfer \u2014 unless the coins sit on a centralized exchange, where a custodian can step in.\n\nStablecoins are a different story. Tether's USDT can be frozen directly by the issuing company. Bessent has previously indicated that earlier seizures of Iranian funds involved popular stablecoins rather than Bitcoin.\n\n## Iran's pivot to Bitcoin\n\nIran has increasingly turned to Bitcoin for international trade. According to reporting from the Financial Times, the country's central bank advised businesses to do whatever was necessary to support the economy, which led to Bitcoin being used to settle cross-border transactions through domestic exchanges.\n\nEarlier this year, Iran also launched a Bitcoin-backed insurance service for its shipping companies.\n\n## The wider campaign\n\nThe current push builds on a February 2025 national security memorandum that directed the Treasury to sustain pressure on Iran's shadow banking operations, money laundering networks, and sanctions evasion channels. The Trump administration revived the \"maximum pressure\" campaign within weeks of returning to office.\n\nThe practical question is where the identified funds are held. Coins on centralized venues can be frozen; coins in self-custody largely cannot \u2014 which decides whether this is an enforceable action or a symbolic one."
  },
  {
    slug:"zcash-moves-toward-quantum-resistant-signatures-amid-ai-security-concerns",
    t:"Zcash Moves Toward Quantum-Resistant Signatures Amid AI Security Concerns",
    s:"Market Intel",
    d:"4 hours ago",
    src:"https://www.coindesk.com/tech/2026/10/09/zcash-developers-set-january-target-for-quantum-resistant-payments-after-bunker-mode-scare",
    body:"Developers behind the privacy-focused cryptocurrency Zcash are working to add quantum-resistant signature capabilities, with a tentative target of January for deployment.\n\nRoman Akhtariev, in an engineering update for Zakura \u2014 one of the client implementations powering the Zcash network \u2014 outlined plans to introduce post-quantum signature opcodes. These would let the network validate hash-based signatures, a cryptographic approach built specifically to withstand attacks from quantum computers.\n\n## Why now\n\nThe urgency comes from growing concern that artificial intelligence is accelerating the discovery of weaknesses in current cryptographic systems. Ethereum researcher Justin Drake recently warned that AI-driven breakthroughs could compromise the mathematical foundations securing Bitcoin and Ether wallets within months rather than years, prompting calls for holders to prepare contingency measures.\n\n## Two kinds of transactions\n\nZcash operates with two distinct transaction types: shielded transactions, which obscure sender, recipient, and amount, and transparent transactions, which work much like Bitcoin with publicly visible addresses and values.\n\nAccording to data compiled from ZecStats, roughly 11.96 million of the 16.98 million ZEC in circulation \u2014 about 70% \u2014 sit in the transparent pool. The January roadmap targets that transparent segment first; the shielded portion needs additional development.\n\n## Beyond signatures\n\nThe Zakura team has also built a privacy-enhancing balance verification tool. It lets wallet software query account balances without revealing address linkage to remote servers, improving confidentiality for routine interactions. An experimental version is already integrated into the Vizor wallet application.\n\nJanuary is a development goal, not a fixed activation date \u2014 no definitive network timeline has been set. The work reflects a broader industry shift toward preparing for quantum threats before they materialise, rather than after."
  },
  {
    slug:"thailand-opens-its-market-to-locally-listed-bitcoin-and-ether-etfs",
    t:"Thailand Opens Its Market to Locally Listed Bitcoin and Ether ETFs",
    s:"Market Intel",
    d:"6 hours ago",
    body:"Thai regulators have cleared the way for Bitcoin and Ether exchange-traded funds to list on domestic exchanges, a change that widens access for retail investors who until now had to use offshore platforms.\n\nThe approval covers funds backed directly by the two largest cryptocurrencies. Local asset managers are expected to file products in the coming months.\n\n## Part of a regional pattern\n\nThe decision follows similar openings across Asia, where Hong Kong and Singapore have already established regulated crypto fund markets. Authorities in the region increasingly favour regulated wrappers over outright bans, aiming to capture fees and oversight rather than push activity offshore.\n\nDomestic listing lowers friction and tax uncertainty for Thai investors, though participation will still be limited to brokerage accounts that meet the regulator's suitability rules."
  },
  {
    slug:"bitcoin-etf-inflows-record",
    t:"Bitcoin ETF Inflows Surge to Record Highs This Week",
    s:"Market Intel",
    d:"1 day ago",
    body:"Spot Bitcoin exchange-traded funds recorded their strongest week of inflows to date, with institutional demand pushing total assets under management to new highs.\n\n## What's driving it\n\nAnalysts point to growing confidence among traditional investors as the main driver. The inflows arrived alongside broader market optimism and widening acceptance of Bitcoin as an asset class in its own right.\n\nThe pattern matters because ETF flows are one of the few sources of genuinely new demand in crypto markets. Unlike leverage, which amplifies moves in both directions, fund inflows represent capital that has to be bought in the open market.\n\nWhether the trend continues depends largely on how many more financial institutions gain exposure \u2014 and on whether the macro backdrop stays supportive."
  },
  {
    slug:"solana-network-upgrade",
    t:"Solana Network Upgrade Promises Reduced Latency for Bots",
    s:"Market Intel",
    d:"1 day ago",
    body:"The Solana network has rolled out an upgrade aimed at cutting transaction latency, a change that directly benefits automated trading bots and high-frequency traders.\n\n## What changed\n\nThe upgrade optimises block propagation and validator communication, producing faster confirmation times. Developers report measurable improvements in bot execution speed and reduced slippage on time-sensitive trades.\n\nLatency is the quiet constraint in on-chain trading. A few hundred milliseconds decides whether a snipe lands at the intended price or gets filled after the move has already happened \u2014 which is why infrastructure improvements tend to show up first in bot performance rather than in user-facing apps.\n\nThe change strengthens Solana's position among chains competing for decentralised trading volume, where speed is the primary selling point."
  },
  {
    slug:"hype-usd-bullish-divergence",
    t:"HYPE-USD Shows Bullish Divergence on the Weekly Chart",
    s:"Editorial",
    d:"1 day ago",
    body:"The HYPE-USD pair is showing a bullish divergence on the weekly timeframe, a pattern that suggests a potential trend reversal.\n\n## What divergence means\n\nWhile price has printed lower lows, key momentum indicators are forming higher lows. That combination signals weakening selling pressure \u2014 sellers are pushing price down, but with less force each time.\n\nTraders are watching the key resistance levels closely. A breakout above them would likely trigger a more significant upward move, while a failure to reclaim them keeps the downtrend intact.\n\nDivergence is a warning, not a signal. It can persist for weeks before resolving, and it says nothing about timing. As always, manage risk and never invest more than you can afford to lose."
  },
];

// ------------------------------------------------------------
//  ACADEMY — tutorial, satu URL per topik
// ------------------------------------------------------------
const TUTORIALS = [
  {
    id:1, title:"Setting Up a Web3 Wallet Safely", level:"Beginner", min:6,
    body:"Your Web3 wallet is the key to everything else on this site. Set it up wrong and you can lose everything in one click. Here's the version that doesn't end badly.\n\n## Pick the right one\n\nMetaMask (browser and mobile) or Phantom (Solana) are the standard starting points. Download them from the official site only \u2014 fake wallet extensions are the number one way people get drained.\n\n## Write the seed phrase down. On paper.\n\nTwelve or twenty-four words, offline, on paper. Never screenshot it. Never paste it into a chat. Never type it into a website. Anyone holding those words owns your funds, and no support team will ever need them.\n\n## Hot wallet vs cold wallet\n\nA browser wallet is a hot wallet. That's fine for small amounts and airdrop farming, but it's not where savings live. Move meaningful holdings to a hardware wallet \u2014 Ledger or Trezor.\n\n## Practice before you commit\n\nSend a small amount of ETH or SOL to yourself first. Try a tiny swap. Then scale up. You want your first mistake to cost cents, not your whole bag.\n\n## The rule that never changes\n\nA seed phrase is asked for exactly once, by the wallet app itself, during setup. Anywhere else \u2014 a website, a DM, a \"support agent\" \u2014 it's a scam." },
  {
    id:2, title:"What Is an Airdrop (and How Farming Works)", level:"Beginner", min:8,
    body:"An airdrop is a token giveaway to early users of a protocol. Projects do it to reward real activity and hand ownership to the people who showed up before there was anything to own.\n\n## It has paid real money\n\nEarly Arbitrum and Jupiter users collected four-figure payouts for work they were already doing \u2014 bridging, swapping, providing liquidity. No special access, no insider list.\n\n## How farming actually works\n\n- **Use new protocols early.** Bridge, swap, provide liquidity, mint an NFT. You're building a track record on your address.\n- **Be a real user.** Projects filter out sybil accounts \u2014 many wallets doing identical tiny actions. One wallet with meaningful activity beats ten with dust.\n- **Budget for it.** Gas fees add up and most farms pay nothing. Every interaction is a lottery ticket you paid for.\n\n## The safety part\n\nNever sign a transaction you can't explain. Approve tokens in limited amounts only. Revoke old approvals regularly with revoke.cash.\n\nAnd remember: airdrop DMs are always scams. Real drops appear in your wallet, never in your inbox." },
  {
    id:3, title:"Farming L2 Airdrops Without Wasting Gas", level:"Intermediate", min:10,
    body:"Layer-2 airdrops reward wallets that used the chain before the snapshot. Arbitrum, Optimism, and the rest all followed the same pattern. Here's the framework that actually holds up.\n\n## What counts\n\n- Bridging funds to the L2 yourself, not through an exchange\n- Regular activity over weeks \u2014 swaps, liquidity, testnet work\n- Volume and unique active weeks, which usually matter more than raw transaction count\n\n## Set a budget and stick to it\n\nPick a monthly gas cap \u2014 $50 to $100 is plenty. Route interactions through cheap periods. L2 gas costs cents; mainnet gas is what eats your budget alive.\n\n## What kills your farm\n\n- **Bot-like patterns.** The same action daily at the same minute gets flagged by sybil filters.\n- **Farming after the announcement.** Once the airdrop is confirmed, you're buying the top.\n- **Handing over your seed phrase to an \"eligibility checker.\"** Real checks are read-only.\n\n## Track your real cost\n\nKeep a simple sheet: wallet, protocol, actions taken, gas spent. After a few months you'll know exactly what each airdrop cost you \u2014 instead of guessing at the end." },
  {
    id:4, title:"Understanding Supertrend (95, 5) and Multi-Indicator Setups", level:"Advanced", min:12,
    body:"Supertrend flips below price in an uptrend and above it in a downtrend, using ATR to set the band distance. Simple idea, and most people use it wrong.\n\n## The (95, 5) setup\n\nA long lookback (95) smooths the trend so you only flip on structural changes. A tighter multiplier (5) keeps stops trailing close. The result: fewer, later signals. Great for trend-following, painful in chop.\n\n## Why stack indicators at all\n\n- **Supertrend** gives direction \u2014 bull or bear.\n- **RSI (14)** filters exhaustion. At 62 the market is neutral, so longs have room but you're late in the move.\n- **Bollinger squeeze** warns that volatility is about to expand. A Supertrend flip during a squeeze is the strongest signal in this stack.\n\n## The honest limits\n\nEvery indicator reads history, not the future. Backtest on out-of-sample data, expect whipsaws when price ranges, and size positions so a losing streak doesn't end your account.\n\nAn indicator is a filter, not an oracle. Anyone selling you the second one is selling you something." },
  {
    id:5, title:"Introduction to Impermanent Loss", level:"Beginner", min:7,
    body:"Provide liquidity to an AMM pool \u2014 ETH/USDC on Uniswap, say \u2014 and you've signed up for impermanent loss. It's the gap between what your deposit is worth in the pool versus just holding both tokens.\n\n## The mechanic\n\nThe AMM holds a constant product. When ETH doubles, the pool automatically sells some of your ETH for USDC to keep the ratio balanced. You end up with less ETH than if you'd just held it.\n\nThe numbers: about **5.7% loss at a 2x move**, about **20% at 4x**.\n\n## When it bites hardest\n\nVolatile pairs, meme coins, anything that trends hard in one direction. And it stops being \"impermanent\" the moment you withdraw.\n\n## When it doesn't matter\n\nIf swap fees plus incentives beat the loss you'd have taken, you're still net positive. Stablecoin pairs have near-zero impermanent loss and mostly just earn fees.\n\n## The check before you deposit\n\nEstimated fee APR minus expected loss over your horizon \u2014 is it above zero? If the coin can 5x, providing liquidity means selling the pump automatically. Decide if that's what you want." },
  {
    id:6, title:"Crypto Basics: Blocks, Fees, and Why Prices Move", level:"Beginner", min:5,
    body:"Three ideas explain most of what confuses people about crypto. Get these and the rest starts making sense.\n\n## Blockchains are slow on purpose\n\nEvery node replays every transaction. That's the security model, not a bug. Throughput is scarce, so fees become an auction for block space.\n\nCongested chain means expensive fees, which pushes users to L2s. That's the entire L2 thesis in one sentence.\n\n## Liquidity moves price, not news\n\nCrypto runs 24/7 across hundreds of venues with thin order books. A $10M sell can move a small pair 20%. The same trade barely dents Bitcoin.\n\nThis is why altcoin candles look violent and why slippage exists. It's also why \"news moves\" are usually just flows hitting an illiquid book.\n\n## Cycles are sentiment plus flows\n\nHalvings cut new supply. ETFs and leverage add demand. Liquidations cascade in both directions and make moves bigger than the fundamentals justify.\n\n## What to do with this\n\nCheck gas before transacting. Check liquidity before entering an alt position. And never size a trade assuming you'll get the price you see on screen." },
];

// ------------------------------------------------------------
//  FAQ — untuk SEO (rich result) + halaman home
// ------------------------------------------------------------
const FAQ = [
  {
    q: "What is a crypto airdrop?",
    a: "An airdrop is a distribution of free cryptocurrency tokens to wallet addresses. Projects use airdrops to reward early users, increase adoption, and decentralise their token supply across a community rather than selling it all to investors."
  },
  {
    q: "How do I qualify for an airdrop?",
    a: "Use the protocol before it announces a token: bridge funds, swap, provide liquidity, or mint an NFT. Projects weight genuine, sustained activity over time more heavily than a single large transaction, and they filter out bot-like or duplicate wallets."
  },
  {
    q: "Are crypto airdrops free?",
    a: "The tokens are free, but qualifying is not. Every on-chain interaction costs gas, and most farms pay nothing. Treat each interaction as a small bet, and budget a monthly cap on gas spending."
  },
  {
    q: "How do I avoid airdrop scams?",
    a: "Never share your seed phrase, never sign a transaction you cannot explain, and remember that real airdrops appear in your wallet — never in a direct message. Eligibility checks are read-only; any site asking you to connect and sign to 'claim' is a red flag."
  },
];

// ------------------------------------------------------------
//  Panduan panjang di home (SEO)
// ------------------------------------------------------------
const GUIDE = {
  title: "The Complete Guide to Crypto Airdrops in 2026",
  intro: "Airdrops have matured. In 2026, projects reward proof of contribution — real usage over time — rather than a single wallet interaction. Here is how the landscape works and how to approach it without wasting money.",
  sections: [
    {
      h: "How airdrops actually work",
      p: "A project reserves a portion of its token supply for early users. At a snapshot, it reads on-chain history and distributes tokens based on how much genuine activity an address showed. The best-known examples — Arbitrum, Optimism, Jupiter, LayerZero — rewarded wallets that had used the protocol for months before any announcement."
    },
    {
      h: "What separates a good farm from a waste of gas",
      p: "Sustained, varied activity on one wallet beats dozens of identical transactions across many wallets. Sybil filters are specifically designed to catch the second pattern. Volume matters, but consistency and diversity of actions matter more, and bridging funds yourself rather than through an exchange is a strong signal."
    },
    {
      h: "Managing cost and risk",
      p: "Set a monthly gas budget and route interactions through cheap periods — Layer-2 fees are cents where mainnet fees are dollars. Keep a simple record of wallets, protocols, actions and gas spent, so after a few months you know your true cost basis per airdrop instead of guessing."
    },
  ],
};
