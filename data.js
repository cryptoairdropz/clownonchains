// ============================================================
//  DATA — edit here to refresh the page
// ============================================================

const PRICES = [
  { sym:"BTC", px:85819.60, chg:-0.79 },
  { sym:"ETH", px:2714.49,  chg:-0.42 },
  { sym:"HYPE", px:94.88,   chg:0.00 },
  { sym:"SOL", px:120.73,   chg:-0.69 },
];

// Exchange referral codes
const EXCHANGE_REFS = [
  { name:"Binance",  url:"https://www.binance.com/join?ref=RMCTNB5R",     code:"RMCTNB5R",   bonus:"Up to $100", desc:"Leading global crypto exchange." },
  { name:"Bybit",    url:"https://partner.bybit.com/b/BYBIT313",         code:"BYBIT313",   bonus:"Up to $30,000", desc:"Best for derivatives and leverage." },
  { name:"BingX",    url:"https://bingx.pro/invite/6XOZMMGL/",          code:"6XOZMMGL",    bonus:"Up to $1,000", desc:"Copy trading focused exchange." },
  { name:"Bitget",   url:"https://partner.bitgetapp.com/bg/7jl483901696997809300", code:"7jl483901696997809300", bonus:"Up to $5,500", desc:"Copy trading + spot leader." },
  { name:"Gate.io",  url:"https://www.gate.io/signup/MONADSSS",          code:"MONADSSS",    bonus:"Up to $100", desc:"Wide altcoin selection." },
  { name:"OKX",      url:"https://www.okx.com/join/ENJOYDISCOUNT",        code:"ENJOYDISCOUNT", bonus:"Mystery Box", desc:"Web3-integrated exchange." },
  { name:"MEXC",     url:"https://promote.mexc.com/r/pPBkDZ6m",          code:"pPBkDZ6m",    bonus:"Up to $1,000", desc:"Fast listing new tokens." },
];

// Bot trading — multichain (no bridge)
const BOT_REFS = [
  { name:"Dawn",     url:"https://t.me/DawnTradeBot?start=ref-kiseryott",     code:"ref-kiseryott", category:"Multichain (no bridge)", desc:"Telegram trading bot, multichain." },
  { name:"Cove",     url:"https://t.me/cove_trading_bot?start=ref_kiseryott", code:"ref_kiseryott", category:"Multichain (no bridge)", desc:"Copy trading on Solana + EVM." },
  { name:"CopyFomo", url:"https://t.me/copyfomo_bot?start=ref_kiseryott",    code:"ref_kiseryott", category:"Multichain (no bridge)", desc:"FOMO copy trading bot." },
  { name:"Maestro",  url:"https://t.me/maestro?start=r-bay_mach",            code:"r-bay_mach",   category:"Multichain bridge", desc:"Bridge + sniper + copy trading." },
  { name:"GMGN",     url:"https://gmgn.ai/r/degengem",                        code:"degengem",     category:"Multichain bridge", desc:"AI-powered trading terminal." },
  { name:"OKX Web3", url:"https://web3.okx.com/join/CLOWNZ",                  code:"CLOWNZ",      category:"Multichain bridge", desc:"OKX Web3 wallet + bot." },
  { name:"Axiom",    url:"https://axiom.trade/@rawrr",                       code:"rawrr",       category:"Multichain bridge", desc:"Solana-focused trading bot." },
  { name:"Zenith",   url:"https://t.me/zenith_lp_bot?start=kiseryott",        code:"kiseryott",    category:"Liquidity pools", desc:"LP management + sniper bot." },
];

const AIRDROPS = [
  { name:"LayerZero", status:"Checking snapshot", tf:"TBA", tag:"Infrastructure", url:"https://layerzero.network" },
  { name:"zkSync Era", status:"Claiming soon", tf:"2 days left", tag:"L2 Rollup", url:"https://zksync.io" },
  { name:"Scroll", status:"Farming active", tf:"Q4 2026", tag:"zkEVM", url:"https://scroll.io" },
];

const NEWS = [
  { t:"Bitcoin ETF inflows surge to record highs this week", s:"CoinDesk", d:"2 hours ago", u:"https://www.coindesk.com" },
  { t:"Solana network upgrade promises reduced latency for bots", s:"Solana", d:"5 hours ago", u:"https://solana.com/news" },
  { t:"HYPE-USD pair shows bullish divergence on the weekly chart", s:"Editorial", d:"12 hours ago", u:"" },
];

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