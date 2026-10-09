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
    slug:"bitcoin-etf-inflows-record",
    t:"Bitcoin ETF inflows surge to record highs this week",
    s:"Market Intel", d:"2 hours ago",
    body:"Spot Bitcoin exchange-traded funds saw unprecedented inflows this week, with institutional demand pushing total assets under management to new heights. Analysts point to growing confidence among traditional investors as a key driver. The surge comes amid broader market optimism and increasing adoption of Bitcoin as a legitimate asset class. Experts suggest this trend could continue as more financial institutions gain exposure to cryptocurrency markets."
  },
  {
    slug:"solana-network-upgrade",
    t:"Solana network upgrade promises reduced latency for bots",
    s:"Market Intel", d:"5 hours ago",
    body:"The Solana network has rolled out a significant upgrade aimed at reducing transaction latency, a move that directly benefits automated trading bots and high-frequency traders. The upgrade optimizes block propagation and validator communication, resulting in faster confirmation times. Developers report noticeable improvements in bot execution speed and reduced slippage. This enhancement strengthens Solana's position as a leading chain for decentralized trading applications."
  },
  {
    slug:"hype-usd-bullish-divergence",
    t:"HYPE-USD pair shows bullish divergence on the weekly chart",
    s:"Editorial", d:"12 hours ago",
    body:"The HYPE-USD trading pair is displaying a bullish divergence on the weekly timeframe, suggesting a potential trend reversal. Technical analysts note that while price has made lower lows, key momentum indicators are forming higher lows — a classic signal of weakening selling pressure. Traders are watching key resistance levels closely, with a breakout likely to trigger significant upward movement. As always, manage risk carefully and never invest more than you can afford to lose."
  },
];

// ------------------------------------------------------------
//  ACADEMY — tutorial, satu URL per topik
// ------------------------------------------------------------
const TUTORIALS = [
  { id:1, title:"Setting Up a Web3 Wallet Safely", level:"Beginner", min:6,
    body:"A Web3 wallet is your key to everything on this site, so set it up right.\n\n1. Pick a wallet. MetaMask (browser + mobile) or Phantom (Solana) are the standard starting points. Download only from the official site — fake wallet extensions are the #1 way people get drained.\n2. Create the wallet and write the seed phrase down. 12 or 24 words, on paper, offline. Never screenshot it, never paste it in a chat, never type it into a website. Anyone who has those words owns your funds.\n3. Understand hot vs cold. A browser wallet is a hot wallet: fine for small amounts and airdrop farming, not for savings. Move meaningful holdings to a hardware wallet (Ledger, Trezor).\n4. Practice the flow. Send a small amount of ETH/SOL to yourself first, try a tiny swap, then scale up.\n\nRule of thumb: a seed phrase is asked for exactly once, by the wallet app itself. Everywhere else, it is a scam." },
  { id:2, title:"What Is an Airdrop (and How Farming Works)", level:"Beginner", min:8,
    body:"An airdrop is a token giveaway to early users of a protocol. Projects do it to reward real activity and decentralize the token. Early Arbitrum and Jupiter users got four-figure payouts for work they were already doing.\n\n**How farming works:**\n- Use new protocols early: bridge, swap, provide liquidity, mint an NFT. You are building a track record on your address.\n- Be a real user. Projects filter sybil accounts (many wallets doing identical small actions). One wallet with meaningful activity beats ten wallets with dust.\n- Costs are real: gas fees add up, and most farms pay nothing. Treat every interaction as spending money on a lottery ticket.\n\n**Safety:** never sign a transaction you don't understand, approve tokens in limited amounts only, and revoke old approvals regularly (revoke.cash). Airdrop DMs are always scams — real drops appear in your wallet, not your inbox." },
  { id:3, title:"Farming L2 Airdrops Without Wasting Gas", level:"Intermediate", min:10,
    body:"Layer-2 airdrops (Arbitrum-style) reward wallets that used the chain before the snapshot. Here's a practical framework.\n\n**What actually counts:**\n- Bridging funds to the L2 yourself (not via an exchange)\n- Regular activity over weeks — swaps, providing liquidity, testnet participation\n- Volume and unique weeks of activity usually matter more than raw transaction count\n\n**Budget approach:** set a monthly cap (e.g. $50-100 in gas). Route interactions through cheap periods — L2 gas is cents, mainnet gas is the killer.\n\n**What to avoid:**\n- Bot-style patterns (exact same action daily at the same minute) — sybil filters flag them\n- Interacting once the airdrop is confirmed and announced; you're buying the top at that point\n- Giving a third-party site your seed phrase because it \"checks eligibility\". Real checks are read-only.\n\nKeep a simple sheet: wallet, protocol, actions done, gas spent. After a few months you'll know your true cost basis per airdrop." },
  { id:4, title:"Understanding Supertrend (95, 5) and Multi-Indicator Setups", level:"Advanced", min:12,
    body:"The Supertrend indicator flips below price in an uptrend and above it in a downtrend, using ATR (volatility) to set the band distance.\n\n**The (95, 5) style setup** used on HYPE-USD here: a long lookback window (95) smooths the trend so you only flip on structural changes, while the multiplier (5) is relatively tight, so stops trail close. Result: fewer, later signals — better for trend-following, worse for chop.\n\n**Why combine indicators:**\n- Supertrend gives direction (BULL/BEAR)\n- RSI (14) filters exhaustion — at 62 the market is neutral, so longs have room but it's late-cycle\n- Bollinger squeeze warns that a volatility expansion is coming; a Supertrend flip during a squeeze is the strongest signal in this stack\n\n**Honest limits:** any indicator reads history, not the future. Backtest on out-of-sample data, expect whipsaws in ranging markets, and size positions so a losing streak doesn't end the account. An indicator is a filter, not an oracle." },
  { id:5, title:"Introduction to Impermanent Loss", level:"Beginner", min:7,
    body:"If you provide liquidity to an AMM pool (e.g. ETH/USDC on Uniswap), impermanent loss (IL) is the gap between what your deposit is worth in the pool versus just holding the two tokens.\n\n**The mechanic:** the AMM keeps a constant product. When ETH doubles, the pool automatically sells some of your ETH for USDC to keep the ratio — you end up with less ETH than if you'd held. At a 2x price move your IL is about 5.7%; at 4x it's about 20%.\n\n**When it bites:** volatile pairs, meme coins, anything that trends hard in one direction. IL becomes permanent the moment you withdraw.\n\n**When it doesn't matter:** if swap fees + incentives exceed the IL you would have suffered, the position is still net positive. Stablecoin pairs (USDC/USDT) have near-zero IL and mostly earn fees.\n\nQuick check before depositing: estimated fees APR minus expected IL over your horizon > 0? If the coin can 5x, providing liquidity means selling the pump automatically." },
  { id:6, title:"Crypto Basics: Blocks, Fees, and Why Prices Move", level:"Beginner", min:5,
    body:"Three ideas that explain 80% of crypto behavior:\n\n**1. Blockchains are slow on purpose.** Every node replays every transaction; that's the security model. Throughput is scarce, so fees are the auction for block space. Congested chain = expensive fees = users migrate to L2s (that's the whole L2 thesis).\n\n**2. Liquidity moves price.** Crypto markets run 24/7 across hundreds of venues with thin order books. A $10M sell on a small pair can move it 20%; the same on BTC barely dents it. This is why altcoin candles look violent and why slippage exists.\n\n**3. Cycles are sentiment + flows.** Bitcoin halvings cut new supply; ETFs and leverage add demand; liquidations cascade in both directions. Most 'news' moves are flows hitting illiquid books, not information.\n\nPractical takeaway: check gas before transacting, check liquidity before entering an alt position, and never size a trade assuming you'll get the price you see on the screen." },
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
