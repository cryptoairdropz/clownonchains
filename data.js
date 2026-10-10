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

const AFFILIATE = [
  {
    slug:"binance", name:"Binance", code:"RMCTNB5R",
    url:"https://www.binance.com/join?ref=RMCTNB5R", kind:"exchange",
    tagline:"The largest exchange in the world, with the deepest liquidity",
    bonus:"20% lifetime fee discount + up to $100 in bonuses",
    feeTaker:"0.10%", feeMaker:"0.10%",
    disc:"20%", pairs:"350+",
    why:["Deepest liquidity anywhere — the smallest slippage on large orders", "350+ pairs, and almost every new token lists here first", "Binance Academy is free if you want structured learning", "Mobile app and support in most major languages"],
    watch:["KYC verification is mandatory before trading", "Enable 2FA — large exchanges are prime phishing targets", "Check your local regulatory status before depositing serious money"],
    steps:["Open the Binance referral link", "Sign up with email or phone number", "Code RMCTNB5R fills in automatically — confirm it is not changed", "Complete KYC (ID plus a selfie)", "Enable 2FA with Google Authenticator", "Deposit and start trading"],
    faq:[["Is the Binance referral code still active?", "Yes. RMCTNB5R is active and gives new accounts a 20% fee discount for life."], ["How much is the Binance signup bonus?", "Up to $100 in vouchers, released after you complete verification and hit certain trading volume thresholds."], ["Does the 20% fee discount expire?", "No. Referral fee discounts do not have an expiry date as long as the account stays active."], ["Do I need KYC to use a referral code?", "For trading, yes. Without KYC you cannot deposit fiat or trade spot."]] },
  {
    slug:"bybit", name:"Bybit", code:"BYBIT313",
    url:"https://partner.bybit.com/b/BYBIT313", kind:"exchange",
    tagline:"The strongest choice for futures and leveraged trading",
    bonus:"Up to $30,000 in rewards + fee discount",
    feeTaker:"0.055%", feeMaker:"0.02%",
    disc:"20%", pairs:"500+",
    why:["The most competitive futures fees among major exchanges", "Deep perpetual order books keep slippage low", "Built-in copy trading lets you mirror profitable traders automatically", "No major user-fund breach since it launched"],
    watch:["High leverage can liquidate an account in minutes", "Understand funding rates before opening a perpetual position", "Copy trading is not a guarantee of profit"],
    steps:["Open the Bybit referral link", "Sign up with email", "Code BYBIT313 fills in automatically", "Complete KYC level 1", "Enable 2FA", "Deposit USDT and start trading"],
    faq:[["How much is the Bybit referral bonus?", "Up to $30,000 in staged rewards, depending on your deposit and trading volume."], ["Why choose Bybit over Binance?", "Bybit's futures fees are lower and its derivatives interface is cleaner, which matters if you trade perps rather than spot."], ["Is Bybit safe for larger balances?", "Bybit publishes proof of reserves and has not suffered a major user-fund loss since 2018."], ["Does Bybit have copy trading?", "Yes, for both spot and futures."]] },
  {
    slug:"bingx", name:"BingX", code:"6XOZMMGL",
    url:"https://bingx.pro/invite/6XOZMMGL/", kind:"exchange",
    tagline:"Copy-trading focused, and one of the friendliest for beginners",
    bonus:"Up to $1,000 in bonuses + fee discount",
    feeTaker:"0.10%", feeMaker:"0.10%",
    disc:"20%", pairs:"800+",
    why:["The most approachable copy trading on the market", "800+ pairs, including small caps you will not find on the majors", "Low minimum deposit", "Simple interface for people just starting out"],
    watch:["Small-cap pairs have thin liquidity and wide slippage", "Check a trader's full track record before copying, not just the last month", "Micro-cap tokens carry extreme risk"],
    steps:["Open the BingX referral link", "Sign up with email or phone", "Code 6XOZMMGL fills in automatically", "Complete KYC", "Deposit as little as $10", "Trade or follow a copy trader"],
    faq:[["What is BingX known for?", "BingX is built around copy trading, letting users automatically mirror another trader's strategy."], ["What is the minimum deposit on BingX?", "Around $10, which is far lower than most major exchanges."], ["Is BingX copy trading good for beginners?", "It can be a starting point, but understand the risk — a trader who was profitable last year is not guaranteed to be profitable next year."], ["Does code 6XOZMMGL give a fee discount?", "Yes, it applies a fee discount to new accounts that register through the referral link."]] },
  {
    slug:"bitget", name:"Bitget", code:"7jl483901696997809300",
    url:"https://partner.bitgetapp.com/bg/7jl483901696997809300", kind:"exchange",
    tagline:"Strong on copy trading and early listings of new tokens",
    bonus:"Up to $5,500 in bonuses + fee discount",
    feeTaker:"0.10%", feeMaker:"0.10%",
    disc:"20%", pairs:"900+",
    why:["Copy trading with built-in fund protection", "900+ pairs, and new tokens often list here earlier than on Binance", "Regular reward and airdrop programs", "Low fiat deposit fees"],
    watch:["New tokens are extremely volatile", "Check daily volume before touching a small-cap pair", "Verify the exchange's regulatory status in your jurisdiction"],
    steps:["Open the Bitget referral link", "Sign up with email", "The code fills in automatically from the link", "Complete KYC", "Enable 2FA", "Deposit and start trading"],
    faq:[["How much is the Bitget referral bonus?", "Up to $5,500 in staged rewards for new users who meet the volume requirements."], ["What does Bitget offer over BingX?", "Bitget lists more trading pairs and includes fund protection on copy trading positions."], ["Does Bitget list new tokens early?", "Yes, Bitget is among the fastest exchanges to list new tokens, often ahead of Binance."], ["Is this Bitget referral code official?", "The code comes from Bitget's official partner program and is registered in their system."]] },
  {
    slug:"gate-io", name:"Gate.io", code:"MONADSSS",
    url:"https://www.gate.io/signup/MONADSSS", kind:"exchange",
    tagline:"The widest altcoin selection of any major exchange",
    bonus:"Up to $100 in bonuses + fee discount",
    feeTaker:"0.20%", feeMaker:"0.20%",
    disc:"20%", pairs:"1,700+",
    why:["1,700+ pairs — the broadest altcoin coverage available", "Lists micro-cap tokens you cannot buy anywhere else", "Operating since 2013, one of the oldest exchanges still running", "Built-in earn and staking products"],
    watch:["Fees are higher than Binance and Bybit", "Micro-cap tokens can be almost entirely illiquid", "Delisting risk on small tokens is real"],
    steps:["Open the Gate.io referral link", "Sign up with email", "Code MONADSSS fills in automatically", "Verify your identity", "Enable 2FA", "Deposit and start trading"],
    faq:[["Why are Gate.io fees higher?", "Gate.io supports 1,700+ pairs including micro-caps that no major exchange carries, which raises operating costs."], ["Is Gate.io safe?", "Gate.io has operated since 2013 without a significant loss of user funds. Still enable 2FA."], ["How much is the MONADSSS bonus?", "Up to $100 in vouchers and deposit bonuses for new users."], ["Is Gate.io good for altcoins?", "It has one of the most complete altcoin selections on the market."]] },
  {
    slug:"okx", name:"OKX", code:"ENJOYDISCOUNT",
    url:"https://www.okx.com/join/ENJOYDISCOUNT", kind:"exchange",
    tagline:"The best Web3 wallet integration of any major exchange",
    bonus:"Mystery Box + fee discount",
    feeTaker:"0.10%", feeMaker:"0.08%",
    disc:"20%", pairs:"400+",
    why:["Built-in Web3 wallet gives you DEX and DeFi access from the same app", "Maker fees are lower than Binance", "Full derivatives product suite", "Mystery Box for new users"],
    watch:["The Web3 features require understanding self-custody", "Watch the network when transferring between chains", "Enable 2FA and whitelist withdrawal addresses"],
    steps:["Open the OKX referral link", "Sign up with email or phone", "Code ENJOYDISCOUNT fills in automatically", "Complete KYC", "Open your Mystery Box in the rewards menu", "Enable 2FA and start trading"],
    faq:[["What is the OKX Mystery Box?", "A reward containing vouchers, tokens or bonuses for new users who register through a referral link."], ["What does OKX offer over Binance?", "OKX has a fully integrated Web3 wallet, which makes accessing DEXes and DeFi far easier from inside the app."], ["Are OKX fees cheaper?", "OKX maker fees are 0.08%, slightly below Binance at 0.10%."], ["Is ENJOYDISCOUNT active?", "Yes, the code is active and applies a fee discount to new accounts."]] },
  {
    slug:"mexc", name:"MEXC", code:"pPBkDZ6m",
    url:"https://promote.mexc.com/r/pPBkDZ6m", kind:"exchange",
    tagline:"The fastest new-token listings, often ahead of every other exchange",
    bonus:"Up to $1,000 in bonuses + fee discount",
    feeTaker:"0.05%", feeMaker:"0.00%",
    disc:"20%", pairs:"2,800+",
    why:["2,800+ pairs — the largest count in the market", "0% maker fees on spot", "Fastest new-token listings anywhere", "KYC not required for basic trading in many jurisdictions"],
    watch:["The 0% maker fee has volume conditions — read the current fee page", "Heavy micro-cap exposure means rug-pull risk", "Without KYC, account recovery is harder"],
    steps:["Open the MEXC referral link", "Sign up with email", "Code pPBkDZ6m fills in automatically", "Enable 2FA", "Deposit USDT", "Start trading"],
    faq:[["Why does MEXC list tokens first?", "MEXC runs a faster listing process with lighter requirements, so new tokens frequently appear here before Binance."], ["Is MEXC really 0% maker fee?", "For spot trading, yes, subject to volume conditions. Check MEXC's current fee page for details."], ["How much is the pPBkDZ6m bonus?", "Up to $1,000 in staged bonuses for new users."], ["Is MEXC safe?", "MEXC has operated since 2018. Because it carries so many micro-caps, your real risk is usually the token you pick rather than the exchange."]] },
  {
    slug:"dawn", name:"Dawn", code:"ref-kiseryott",
    url:"https://t.me/DawnTradeBot?start=ref-kiseryott", kind:"bot",
    tagline:"Multichain Telegram trading bot with no bridging required",
    bonus:"Trading fee discount via referral code",
    feeTaker:"1%", feeMaker:"\u2014",
    disc:"10%", pairs:"Multichain",
    why:["Trade straight from Telegram without opening a browser", "Multichain without manual bridging", "Fast enough to snipe new tokens", "No extra app to install"],
    watch:["A Telegram bot is not your wallet — funds sit with the bot", "Fees are higher than a centralised exchange", "Only use money you are prepared to lose"],
    steps:["Open the Dawn referral link in Telegram", "Press Start", "Code ref-kiseryott attaches automatically", "Create the bot's built-in wallet or import one", "Deposit SOL or ETH", "Start trading"],
    faq:[["Is Dawn safe to use?", "Telegram bots hold your funds in the bot's wallet, not your own. That is a real risk. Keep the balance limited."], ["Why use Dawn instead of an exchange?", "Speed. A Telegram bot can execute in seconds on tokens that are not listed on any exchange yet."], ["What does multichain without bridging mean?", "You can trade across several chains without manually moving assets between networks."], ["What are Dawn's fees?", "Around 1% per trade, higher than a centralised exchange but in line with comparable bots."]] },
  {
    slug:"cove", name:"Cove", code:"ref_kiseryott",
    url:"https://t.me/cove_trading_bot?start=ref_kiseryott", kind:"bot",
    tagline:"Solana and EVM copy trading, run from Telegram",
    bonus:"Fee discount via referral code",
    feeTaker:"1%", feeMaker:"\u2014",
    disc:"10%", pairs:"Solana + EVM",
    why:["Automatically mirror wallets that are performing well", "Works across Solana and EVM chains", "Compact Telegram interface", "Track PnL without leaving the chat"],
    watch:["A wallet that was profitable yesterday may not be tomorrow", "Slippage is heavy on thin tokens", "Funds are held by the bot"],
    steps:["Open the Cove referral link", "Press Start in Telegram", "Code ref_kiseryott attaches automatically", "Create or import a wallet", "Deposit SOL", "Pick a wallet to copy"],
    faq:[["What is Cove copy trading?", "Cove lets you automatically mirror another wallet's transactions without doing your own analysis."], ["Is copy trading guaranteed to profit?", "No. A wallet that performed well historically can turn unprofitable. The risk stays yours."], ["Which chains does Cove support?", "Solana and EVM networks including Ethereum, Base and BSC."], ["What are Cove's fees?", "Around 1% per trade."]] },
  {
    slug:"copyfomo", name:"CopyFomo", code:"ref-kiseryott",
    url:"https://t.me/copyfomo_bot?start=ref-kiseryott", kind:"bot",
    tagline:"FOMO copy-trading bot built for new tokens",
    bonus:"Fee discount via referral code",
    feeTaker:"1%", feeMaker:"\u2014",
    disc:"10%", pairs:"Multichain",
    why:["Designed to catch new tokens faster", "Built-in copy trading", "Trending-token notifications", "Lightweight, runs entirely in Telegram"],
    watch:["New tokens are the highest-risk category in crypto", "A large share of new tokens end in a rug pull", "Never use funds you cannot afford to lose entirely"],
    steps:["Open the CopyFomo referral link", "Press Start", "Code ref-kiseryott attaches automatically", "Set up your wallet", "Deposit", "Start copy trading"],
    faq:[["What makes CopyFomo different?", "CopyFomo focuses on speed for new-token entries and on trending-token signals."], ["Are new tokens safe?", "No new token is safe. Most fail or rug pull. This is the highest-risk corner of crypto."], ["What is the minimum deposit?", "It varies, but generally the equivalent of a few tens of dollars."], ["Is there a CopyFomo referral code?", "Yes, ref-kiseryott is active and applies a fee discount."]] },
  {
    slug:"maestro", name:"Maestro", code:"r-bay_mach",
    url:"https://t.me/maestro?start=r-bay_mach", kind:"bot",
    tagline:"Bridge, sniper and copy trading in a single bot",
    bonus:"Fee discount via referral code",
    feeTaker:"1%", feeMaker:"\u2014",
    disc:"10%", pairs:"Multichain",
    why:["The most complete feature set: bridge, sniper and copy trading", "Long-running with a large user base", "Support for many chains", "Sniper built for new listings"],
    watch:["More features means a wider risk surface", "The built-in bridge still carries contract risk", "Funds sit with the bot"],
    steps:["Open the Maestro referral link", "Press Start", "Code r-bay_mach attaches automatically", "Create a wallet", "Deposit", "Choose a feature: sniper, bridge or copy trading"],
    faq:[["What can Maestro do?", "Bridge between chains, snipe new tokens, and copy trade — all from one Telegram bot."], ["Is Maestro safe?", "Maestro is one of the oldest and most widely used bots. Remember your funds are in the bot's wallet, not your own."], ["What are Maestro's fees?", "Around 1% per trade, plus separate bridge costs."], ["Is r-bay_mach active?", "Yes, the code is active and applies a fee discount."]] },
  {
    slug:"gmgn", name:"GMGN", code:"degengem",
    url:"https://gmgn.ai/r/degengem", kind:"bot",
    tagline:"AI-powered trading terminal built for Solana",
    bonus:"Fee discount via referral code",
    feeTaker:"1%", feeMaker:"\u2014",
    disc:"10%", pairs:"Solana",
    why:["Deep on-chain analytics per wallet and per token", "Automatic smart-money wallet detection", "A web terminal, not just a Telegram bot", "Transparent holder and token distribution data"],
    watch:["Good data does not guarantee profit", "Solana tokens are extremely volatile", "Watch slippage and MEV exposure"],
    steps:["Open the GMGN referral link", "Create an account", "Code degengem attaches automatically", "Connect a Solana wallet", "Explore token data", "Start trading"],
    faq:[["What is GMGN's main advantage?", "GMGN provides deep on-chain data — who bought, when, and how much — that ordinary exchanges do not show."], ["Is GMGN Solana only?", "Yes, GMGN focuses entirely on the Solana ecosystem."], ["What is smart money on GMGN?", "A label for wallets that have been consistently profitable historically, so you can follow or monitor them."], ["What are GMGN's fees?", "Around 1% per trade."]] },
  {
    slug:"okx-web3", name:"OKX Web3", code:"CLOWNZ",
    url:"https://web3.okx.com/join/CLOWNZ", kind:"bot",
    tagline:"A self-custody Web3 wallet with built-in trading tools",
    bonus:"Bonuses and fee discount via referral code",
    feeTaker:"0.3%", feeMaker:"0.3%",
    disc:"10%", pairs:"Multichain",
    why:["Built by a major exchange, so more accountable than an anonymous bot", "Self-custody wallet — the funds stay yours", "DEX and bridge access in one app", "Support for many chains"],
    watch:["Self-custody means you are responsible for your seed phrase", "DEX smart contract risk still applies", "Web3 features are more complex than a standard exchange"],
    steps:["Open the OKX Web3 referral link", "Sign up or log in to your OKX account", "Code CLOWNZ attaches automatically", "Create or import a Web3 wallet", "Back up the seed phrase offline", "Start trading"],
    faq:[["How is OKX Web3 different from regular OKX?", "OKX Web3 is a self-custody wallet, so you hold the funds rather than the exchange."], ["Is OKX Web3 safer than a Telegram bot?", "For holding funds, yes, because it is self-custody. In exchange, you are fully responsible for your seed phrase."], ["Which chains are supported?", "Dozens, including Ethereum, Solana, Base, Arbitrum and BSC."], ["Is CLOWNZ active?", "Yes, the code is active for the OKX Web3 referral program."]] },
  {
    slug:"axiom", name:"Axiom", code:"rawrr",
    url:"https://axiom.trade/@rawrr", kind:"bot",
    tagline:"A fast-execution Solana trading bot",
    bonus:"Fee discount via referral code",
    feeTaker:"1%", feeMaker:"\u2014",
    disc:"10%", pairs:"Solana",
    why:["Fast execution on Solana", "Clean interface focused on getting the trade done", "Copy trading and sniping built in", "Popular among Solana degen communities"],
    watch:["Solana only, no other chains", "Solana tokens carry high risk", "Funds sit with the bot rather than your own wallet"],
    steps:["Open the Axiom referral link", "Connect a Solana wallet", "Code rawrr attaches automatically", "Deposit SOL", "Pick a token or start copy trading", "Trade"],
    faq:[["What is Axiom's advantage?", "Execution speed on Solana, which matters for new tokens that move within seconds."], ["Is Axiom Solana only?", "Yes, Axiom is focused entirely on Solana."], ["What are Axiom's fees?", "Around 1% per trade."], ["Is rawrr active?", "Yes, the code is active."]] },
  {
    slug:"zenith", name:"Zenith", code:"kiseryott",
    url:"https://t.me/zenith_lp_bot?start=kiseryott", kind:"bot",
    tagline:"Automated liquidity pool management and sniping",
    bonus:"Fee discount via referral code",
    feeTaker:"1%", feeMaker:"\u2014",
    disc:"10%", pairs:"Liquidity pools",
    why:["Purpose-built for liquidity pool management", "Automates adding and removing liquidity", "Snipes new LP tokens", "The only tool here focused on LP rather than plain trading"],
    watch:["Impermanent loss remains the primary LP risk", "New LP tokens can rug pull at any time", "Funds sit with the bot"],
    steps:["Open the Zenith referral link", "Press Start in Telegram", "Code kiseryott attaches automatically", "Set up a wallet", "Deposit", "Choose a pool and start"],
    faq:[["What is Zenith?", "A Telegram bot for managing liquidity pool positions automatically, including adding and withdrawing liquidity."], ["What is the main risk of Zenith?", "Impermanent loss. Providing liquidity means automatically selling the asset that rises and buying the one that falls."], ["Is Zenith suitable for beginners?", "Not really. LP management requires understanding impermanent loss and new-token risk."], ["What are Zenith's fees?", "Around 1% per transaction."]] }
];

const ANGLES = [
  {
    slug:"referral-code", label:"Referral Code Guide",
    h1:"{name} Referral Code {code} \u2014 Full Guide 2026",
    title:"{name} Referral Code {code} \u2014 Fee Discount & Bonus Guide 2026",
    desc:"Complete guide to the {name} referral code {code}: how to apply it, the fee discount you get, signup bonuses, and what to check before depositing.",
    lead:"Everything you need to know about using {code} on {name} \u2014 what it saves you, how to apply it, and where the catches are." },
  {
    slug:"signup-bonus", label:"Signup Bonus",
    h1:"{name} Signup Bonus 2026 \u2014 Claim with Code {code}",
    title:"{name} Signup Bonus 2026 \u2014 Claim Up to With Code {code}",
    desc:"Current {name} signup bonus: {bonus}. How to claim it, the requirements, and whether it is worth it \u2014 using referral code {code}.",
    lead:"{name} currently offers {bonus}. Here is exactly how to claim it, and what you have to do first." },
  {
    slug:"how-to-register", label:"How to Register",
    h1:"How to Register on {name} with Code {code} (Step by Step)",
    title:"How to Register on {name} with Referral Code {code} \u2014 Step by Step",
    desc:"Step-by-step guide to registering on {name} with referral code {code}, from opening the link to your first trade.",
    lead:"A complete walkthrough for signing up on {name} with {code} applied correctly from the start." },
  {
    slug:"fees-comparison", label:"Fee Comparison",
    h1:"{name} Fees 2026 \u2014 Rates and How Code {code} Cuts Them",
    title:"{name} Fees 2026 vs Other Exchanges \u2014 Cut Costs with Code {code}",
    desc:"{name} trading fees explained: {fee_taker} taker, {fee_maker} maker, and how referral code {code} reduces them further.",
    lead:"{name} charges {fee_taker} taker and {fee_maker} maker. Here is what that means in practice, and how to pay less." },
  {
    slug:"for-beginners", label:"For Beginners",
    h1:"{name} for Beginners \u2014 Start with Code {code}",
    title:"{name} for Beginners 2026 \u2014 Complete Starter Guide with Code {code}",
    desc:"New to {name}? A beginner's guide covering minimum deposit, first trade, common mistakes, and referral code {code}.",
    lead:"If you have never used {name} before, this is the order to do things in \u2014 and the mistakes to skip." },
  {
    slug:"is-it-safe", label:"Safety Review",
    h1:"Is {name} Safe? Review and Code {code}",
    title:"Is {name} Safe in 2026? Honest Review + Referral Code {code}",
    desc:"Is {name} safe to use? Track record, security features, and the risks worth knowing before you deposit. Plus referral code {code}.",
    lead:"An honest look at {name}'s security record \u2014 what protects you, and what does not." },
  {
    slug:"reduce-fees", label:"Reduce Fees",
    h1:"How to Reduce Fees on {name} \u2014 Code {code} and Beyond",
    title:"How to Reduce Trading Fees on {name} \u2014 Referral Code {code} Guide",
    desc:"Practical ways to cut trading costs on {name}: referral code {code}, maker orders, volume tiers and withdrawal timing.",
    lead:"Fees look small per trade and add up to a lot per year. Here is how to cut them on {name}." },
  {
    slug:"common-mistakes", label:"Common Mistakes",
    h1:"Common {name} Mistakes and How to Avoid Them \u2014 Code {code}",
    title:"Common {name} Mistakes Beginners Make (and How to Avoid Them) \u2014 Code {code}",
    desc:"The mistakes that cost beginners money on {name}, and how to avoid each one. Register with code {code} to start on the right foot.",
    lead:"Most losses on {name} come from a handful of avoidable mistakes. Here they are, and how to sidestep them." }
];

// ------------------------------------------------------------
//  NEWS — artikel parafrase, di-host sendiri (tanpa redirect)
// ------------------------------------------------------------
const NEWS = [
  {
    slug:"hsbc-dan-ant-digital-uji-ai-agent-bayar-pakai-deposit-tokenisasi",
    t:"HSBC dan Ant Digital Uji AI Agent Bayar Pakai Deposit Tokenisasi",
    s:"Market Intel",
    d:"Just now",
    src:"https://cointelegraph.com/news/hsbc-ant-digital-test-ai-agent-payments-using-tokenized-deposits",
    body:"HSBC dan Ant Digital Technologies baru saja uji coba sistem yang bikin AI agent bisa bayar pakai deposit bank yang udah di-tokenisasi. Ini bukan sekadar eksperimen — ini bukti konkret bank besar mulai serius ngintegrasiin AI sama blockchain.\n\n## Apa yang sebenarnya diuji\n\nHSBC nyediain settlement dan real-time risk checks, sementara Ant Digital koordinasi akses layanan dan pembayaran lewat network Anvita Flow. Mereka pakai Jovay Testnet, sebuah layer-2 blockchain testing environment. Hasilnya: AI agent bisa pilih layanan digital dan langsung selesaian pembayaran. Transaksi yang terjadi masuk kategori micropayment — biasanya kurang dari $2. Perusahaan bilang ini cuma verifikasi teknis, bukan commercial launch atau live customer offering.\n\n## Bank lain juga ngujian\n\nHSBC bukan satu-satunya. Sygnum, bank digital asset Swiss, bulan Mei udah test AI agent di blockchain mainnet — tiap transaksi harus di-approve dan di-sign customer. CaixaBank juga udah selesaian transaksi kartu yang di-initiate AI agent pakai Visa Intelligent Commerce. Augustus Bank CEO Ferdinand Dalwitz argue traditional clearing banks masih pakai sistem lama yang desainnya bukan bukan buat transaksi otomatis 24/7.\n\n## Apa artinya buat kamu\n\nKalau bank-bank gede mulai bangun infrastruktur buat AI agent, blockchain bakal jadi layer pembayaran yang makin bukan cuma teori. Buat kamu yang main DeFi atau airdrop, ini sinyal bahwa adopsi blockchain dari institusi makin nyata. Bukan lagi soal \"kapan bank masuk crypto\" — tapi \"bank udah masuk, cuma belum buka ke publik.\" Kalau AI agent jadi norma, on-chain volume bisa naik signifikan karena transaksi mesin yang nggak butuh manusia. Ini juga berarti stablecoin dan tokenized deposit bakal makin relevan sebagai jembatan antara AI economy sama sistem keuangan tradisional."
  },
  {
    slug:"starknet-pertimbangkan-pisah-dari-ethereum-demi-target-anti-kuantum-20",
    t:"Starknet Pertimbangkan Pisah dari Ethereum Demi Target Anti-Kuantum 2027",
    s:"Market Intel",
    d:"Just now",
    src:"https://decrypt.co/380585/ethereum-l2-starknet-jumps-20-after-saying-it-wants-to-become-an-l1",
    body:"Starknet sedang mempertimbangkan untuk keluar dari bayangan Ethereum dan berdiri sendiri sebagai blockchain layer-1. Alasannya satu: mereka pengen jadi jaringan pertama yang kebal serangan kuantum, dengan target 2027.\n\n## Starknet dan Ancaman Kuantum\n\nStarknet adalah network layer-2 yang dibuat oleh StarkWare, berada di atas Ethereum. Jadi setiap transaksi dikumpulkan dulu jadi beberapa batch, baru kemudian diamankan oleh Ethereum. Model ini bikin transaksi murah dan cepat, tapi keamanan Starknet nggak bisa melebihi Ethereum.\n\nKomputer kuantum suatu hari nanti bisa memecahkan kriptografi kurva eliptik, jenis matematika yang jadi fondasi tanda tangan digital di Bitcoin dan Ethereum. Kalau kriptografi ini jebol, seseorang bisa memalsukan tanda tangan dan mencuri coin milik orang lain.\n\nBeda sama Starknet. Bukti transaksinya pakai hash function, yang dianggap tahan kuantum. Tapi masih ada beberapa bagian kurva eliptis yang perlu diganti, sesuai roadmap yang dirilis 30 Juni.\n\nEli Ben-Sasson, CEO StarkWare, bilang ancaman ini \"jauh lebih dekat dari yang kita kira\". Kecepatan AI dalam matematika menambah risiko kedua. Ia menyebutnya mode \"bunker\", istilah yang beberapa hari sebelumnya juga dipakai peneliti Ethereum Justin Drake.\n\n## Kenapa Pisah dari Ethereum\n\nKalau tetap jadi L2, Starknet harus menunggu Ethereum bergerak dulu. Roadmap Ethereum sendiri baru menargetkan infrastruktur post-quantum inti sekitar 2029 — dua tahun lebih lambat dari target Starknet. Bitcoin, menurut Ben-Sasson, bahkan belum komitmen soal ini.\n\nDengan menjadi L1, Starknet mengendalikan sendiri pembaruan keamanan. Nggak bergantung ke Ethereum atau Bitcoin lagi. Tapi pernyataannya nggak njelasin cara migrasi buat aplikasi dan pengguna yang sudah ada.\n\n## Kenapa Ini Penting\n\nPasar langsung merespons positif. STRK di kisaran $0.073 hari Jumat, naik kurang lebih 20% dalam 24 jam — lebih dari dua kali lipat harganya di April, bulan StarkWare memangkas karyawan demi mengejar pendapatan.\n\nKamu yang pegang STRK langsung dapat skin in the game. Tapi buat pengguna DeFi pada umumnya, ini pertanda soal masa depan keamanan blockchain — kalau Ethereum terlalu lambat move, jaringan-jaringan di atasnya akan keluar dan bikin sistem sendiri. Peta DeFi bisa berubah dalam beberapa tahun ke depan."
  },
  {
    slug:"robinhood-chain-pertimbangkan-sistem-transaksi-berbayar-untuk-priorita",
    t:"Robinhood Chain Pertimbangkan Sistem Transaksi Berbayar untuk Prioritas",
    s:"Market Intel",
    d:"Just now",
    src:"https://www.coindesk.com/business/2026/10/09/robinhood-chain-considers-technology-that-gives-paying-traders-priority",
    body:"Robinhood Chain sedang mempertimbangkan sebuah ide yang bisa mengubah aturan main: membayar lebih mahal supaya transaksinya diproses lebih duluan.\n\n## Antrean Berbayar Masuk Radar\n\nRobinhood Chain adalah blockchain Layer-2 yang dibangun di atas infrastruktur Arbitrum, khusus dirancang untuk aset dunia riil dalam bentuk token. Chain ini mulai beroperasi pada bulan Juli dan dalam waktu singkat sudah menembus sepuluh besar blockchain berdasarkan total nilai yang terkunci.\n\nSelama ini, urutan transaksi di jaringan ini menganut sistem **first-come, first-served**. Siapa yang transaksinya tiba lebih dulu di sequencer, dialah yang lebih dulu diproses. Tidak ada jalan pintas dengan membayar lebih.\n\nKeadaan itu mungkin segera berubah. Arbitrum baru saja mengganti sistem lamanya, Time Boost, dengan model baru bernama **Priority Gas Auctions** — yang intinya memungkinkan pengguna membayar biaya tambahan untuk memprioritaskan transaksi tertentu. Teknologi ini dikembangkan oleh Arbitrum, pihak yang juga menyediakan infrastruktur di balik Robinhood Chain.\n\n## Masih Tahap Evaluasi\n\nMenurut sumber yang dekat dengan masalah ini, Robinhood Chain sedang mengevaluasi teknologi tersebut, tapi belum ada keputusan final. Satu hal yang perlu dicatat: chain ini sebelumnya tidak pernah memakai sistem Time Boost sama sekali.\n\nApakah Robinhood Chain akan mengambil pendapatan dari bieta prioritas, atau menjaga antrean tetap adil untuk semua orang? Jawabannya akan menentukan arah jaringan ini ke depan.\n\n## Kenapa Ini Pengaruh ke Kamu\n\nKalau Priority Gas Auctions benar-benar diadopsi, dinamika trading di Robinhood Chain bisa berubah. Pelaku dengan modal besar bisa membeli posisi terdepan di antrean saat pasar sedang ramai, sementara pengguna biasa harus menunggu lebih lama. Pertanyaan yang muncul: apakah antrean berbayar ini menjadi pintu masuk bagi praktik front-running dan ekstraksi nilai oleh validator?[unverified] Untuk blockchain yang memosisikan diri sebagai jaringan terbuka dan merata untuk semua orang, keputusan ini akan jadi tolok ukur besar.\n\n https://www.coindesk.com/business/2026/10/09/robinhood-chain-considers-technology-that-gives-paying-traders-priority\n https://www.binance.com/en/square/post/10-09-2026-robinhood-chain-considers-paid-transaction-priority-tech-375515465811566"
  },
  {
    slug:"ledger-selidiki-kehilangan-crypto-terkait-reseller-di-asia-tenggara",
    t:"Ledger Selidiki Kehilangan Crypto Terkait Reseller di Asia Tenggara",
    s:"Market Intel",
    d:"Just now",
    src:"https://cointelegraph.com/news/ledger-investigates-fund-losses-linked-to-southeast-asian-reseller-warns-users",
    body:"Ledger sedang menyelidiki laporan kehilangan crypto yang dikaitkan dengan pembelian device dari reseller di Asia Tenggara. Perusahaan meminta reseller CryptoBilis untuk sementara menghentikan penjualan dan pengiriman produk Ledger sebagai langkah pencegahan.\n\n## Apa yang terjadi\n\nCryptoBilis adalah reseller resmi Ledger di Indonesia, Malaysia, dan Filipina. Dalam pernyataannya, Ledger mengatakan insiden ini tampaknya terisolasi pada reseller dan wilayah yang terdampak, dan belum ada laporan yang melibatkan device yang dibeli langsung dari Ledger.\n\nBagi yang sudah membeli device dari CryptoBilis dalam 90 hari terakhir, Ledger menyarankan jangan menyalakannya dulu. Kalau kamu sudah setup dan memakai wallet-nya, pertimbangkan untuk memindahkan semua aset ke device Ledger baru dengan recovery phrase yang baru juga.\n\n## Angka yang beredar\n\nPeneliti onchain secara terpisah melaporkan dugaan pencurian crypto lintas beberapa blockchain. Satu peneliti mengidentifikasi delapan alamat wallet yang diduga terkait kerugian lebih dari 72 juta dolar, sementara peneliti lain memperkirakan angkanya tembus 86 juta dolar di Bitcoin, Ethereum, dan Tron.\n\nLedger sendiri belum mengonfirmasi dua estimasi itu, dan sejauh mana hubungannya dengan investigasi CryptoBilis masih belum jelas. Perusahaan juga belum membocorkan berapa banyak pengguna yang terdampak, berapa nilai kerugiannya, dan apa penyebabnya.\n\n## Yang penting diketahui\n\nInfrastructure, sistem, dan layanan Ledger tidak dikompromikan, kata perusahaan, dan investigasinya masih berjalan. Bagi pengguna: beli hardware wallet hanya dari sumber resmi. Simpan recovery phrase dengan baik, dan kalau ada satu pun kecurigaan — jangan tunggu, pindahkan dana kamu ke wallet segera. Hardware wallet adalah salah satu cara paling aman untuk menyimpan crypto, tapi tetap ada risiko kalau kamu tidak berhati-hati saat membelinya."
  },
  {
    slug:"blockchaincom-ajukan-lisensi-cftc-untuk-buka-pasar-prediksi-di-as",
    t:"Blockchain.com Ajukan Lisensi CFTC untuk Buka Pasar Prediksi di AS",
    s:"Market Intel",
    d:"Just now",
    src:"https://cointelegraph.com/news/blockchain-cftc-approval-derivatives-prediction-markets",
    body:"Blockchain.com mengambil langkah serius untuk masuk pasar prediksi di Amerika Serikat. Perusahaan crypto itu dilaporkan mengajukan dua lisensi ke CFTC — Komisi Perdagangan Berjangka Komoditas AS.\n\nLisensi yang diminta adalah Designated Contract Market (DCM) dan Futures Commission Merchant (FCM). Kalau disetujui, Blockchain.com bisa beroperasi sebagai bursa berjangka untuk event contracts sekaligus broker untuk kontrak derivatif. Ini bukan sekadar rencana — mereka sudah mengajukan permohonan resmi.\n\n## Apa yang diajukan Blockchain.com\n\nMelansir laporan CNBC, pengajuan itu ditujukan untuk pasar prediksi dan derivatif crypto. Targetnya jelas: investor ritel dan institusional di AS.\n\n## Ini artinya untuk pasar prediksi\n\nPasar prediksi seperti Kalshi dan Polymarket sedang dalam zona abu-abu. Pemerintah negara bagian banyak yang menuntut mereka karena diduga melanggar taruhan olahraga dan pemilu. Sementara itu, New Jersey sudah mengajukan petisi ke Mahkamah Agung AS untuk menantang Kalshi — kasus yang bisa menentukan siapa yang punya wewenang: pemerintah federal atau negara bagian.\n\nKalau Blockchain.com dapat lisensi CFTC, mereka bisa menawarkan marketplace event contracts mereka sendiri — bukan cuma mengintegrasikan Polymarket seperti yang diumumkan Juli lalu. Ini berbeda dari sekadar jadi penyedia dompet atau bursa spot.\n\n## CFTC dan pasar prediksi\n\nCFTC di bawah pimpinan Chair Michael Selig sedang aktif mendorong regulasi crypto. Selig berargumen aturan yang merekausulkan akan membawa \"safeguards to crypto spot markets\" dan mencegah pengdanaan dana pelanggan seperti yang terjadi di FTX.\n\nSelig juga klaim CFTC punya yurisdiksi eksklusif atas pasar prediksi. Dia satu-satunya komisioner di lembaga itu — empat kursi kosong belum diisi seperti Jumat lalu.\n\n## Kenapa ini penting buat kamu\n\nKalau Blockchain.com dapat lisensi, kamu bisa trading event contracts langsung di platform yang sudah kamu pakai — bukan di platform baru yang belum teruji. Lebih dari itu, ini bisa jadi preseden besar: apakah pasar prediksi akan diatur secara federal lewat CFTC, atau tetap dibatasi negara bagian?\n\nMenurut laporan Bloomberg, Blockchain.com juga sedang mempertimbangkan IPO dengan valuasi hingga 6 miliar dolar dan target pengumpulan dana 500 juta dolar. Perusahaan ini jelas sedang bermain jangka panjang."
  },
  {
    slug: "alex-mashinsky-sentenced-celsius-crypto-lenders-lesson",
    t: "Alex Mashinsky Sentenced for Life — What Celsius Teaches DeFi Users",
    src: "ClownOnChains",
    d: "Celsius founder Alex Mashinsky received a life sentence. What the collapse reveals about yield promises, custody and the risks DeFi users still repeat.",
    body: `Alex Mashinsky, the founder of the crypto lender Celsius, has been sentenced to life in prison for fraud. It is one of the harshest penalties handed to a crypto executive, and it closes a case that began when Celsius froze withdrawals in 2022 and left hundreds of thousands of users unable to reach their funds.

The sentence matters beyond the individual. Celsius was the archetype of the "high yield on your crypto" product, and the way it collapsed explains a failure pattern that is still being repeated across the industry today.

## What Celsius actually did

Celsius promised users yields that were far above anything available from ordinary lending markets. Those returns were presented as the product of sophisticated trading and lending strategies.

In practice, the company was taking customer deposits and deploying them into high-risk, often illiquid positions, including its own token. When those positions lost value, the shortfall landed on depositors rather than on the company or its founders. Withdrawals were frozen, the company filed for bankruptcy, and users became creditors in a queue that took years to resolve.

## The lesson that keeps being forgotten

The uncomfortable part is that Celsius was never complicated to evaluate. A yield that is dramatically higher than the market rate is not a strategy — it is a risk statement. Someone has to be paying that yield, and if it is not an identifiable borrower, it is the next depositor.

Three things were visible from outside before the collapse:

- The advertised yields had no credible source of funding.
- The company held customer assets rather than users holding their own.
- A large portion of the balance sheet was tied up in the company's own token.

## How this applies to DeFi today

The same pattern appears in DeFi with different branding. A yield farm offering triple-digit APY is usually paying you in an inflationary token whose price depends on new deposits continuing to arrive. It works until it does not, and the exit is a stampede.

The structural difference with genuinely safer DeFi is that the yield source is visible on-chain: real trading fees, real borrowing demand, real staking rewards. If you cannot point to where the money comes from, the yield is a transfer from later participants.

## Practical rules

- If the yield is far above market rates, ask who is paying it. If there is no answer, that is the answer.
- Prefer protocols where you keep custody of your own assets.
- Treat any protocol issuing its own token as a business whose viability depends on that token's price.
- Never treat a yield-bearing platform as a place to keep savings.

## The bigger picture

Celsius did not fail because crypto is inherently fraudulent. It failed because customers handed custody to a company promising returns that could not be sustained, and because that company used the assets in ways depositors were not told about.

The technology did not remove the need to ask where the yield comes from. If anything, the ease of moving money into a yield product makes that question more important, not less.`
  },
  {
    slug: "dwf-labs-sues-bitget-over-141-million-token-lock-dispute",
    t: "DWF Labs Sues Bitget for $141 Million Over Token Lock Dispute",
    src: "ClownOnChains",
    d: "DWF Labs is suing Bitget for $141 million over an alleged breach of a token lock agreement. What the dispute reveals about market-maker deals.",
    body: `DWF Labs has filed a lawsuit against the exchange Bitget seeking roughly 141 million dollars, alleging breach of an agreement covering locked tokens. The case has pulled back the curtain on the market-maker arrangements that sit behind many token launches.

These deals are rarely discussed publicly, and the dispute is a useful look at how they are structured and what can go wrong.

## What a market-maker agreement involves

When a token launches, the project needs liquidity on exchanges. Without it, spreads are wide, orders are thin, and the token is hard to trade. Market makers fill that role: they quote both sides of the book, and in return they receive tokens, often at a discount or on a vesting schedule.

The critical terms are the lock-up and the vesting schedule — how many tokens the market maker gets, when they unlock, and what happens if the relationship ends early. Those terms are usually confidential, which is exactly why disputes like this one end up in court.

## The substance of the claim

DWF Labs alleges that Bitget failed to honour the terms governing tokens that were supposed to remain locked. The amount claimed, around 141 million dollars, reflects the value of those tokens at issue rather than a simple cash debt.

Bitget has contested the claim. As with most commercial litigation, the public filings capture each side's position rather than an established fact, and a resolution may take years.

## Why this matters if you trade tokens

The practical takeaway is not who is right. It is that the float you see on an exchange is not the whole supply, and that large blocks of tokens sit with counterparties whose unlock schedules you cannot see.

That has two consequences for anyone trading a new token:

- A token with a small circulating supply can be heavily overhang-constrained. When locked tokens unlock, the sell pressure arrives regardless of how the chart looks.
- Market-maker inventory is a source of supply that does not appear in public holder data.

## What to check before buying a new listing

1. The vesting schedule, published in the project's documentation. Look at how much unlocks in the next six months.
2. The share of supply held by the team, investors and market makers.
3. Whether the token has real usage or exists mainly to be traded.

## The wider picture

Disputes between market makers and exchanges are a normal feature of a market where token liquidity is a commercial service. They are also a reminder that the token economy includes large private agreements between well-funded parties, and that retail participants are the last to see the terms.

Treating a new token as an investment requires knowing who else holds it and when they can sell. That information is public more often than people assume — it is just rarely read.`
  },
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
    id:1, title:"Crypto Basics: Blocks, Fees, and Why Prices Move", level:"Beginner", min:5,
    body:"Three ideas explain most of what confuses people about crypto. Get these and the rest starts making sense.\n\n## Blockchains are slow on purpose\n\nEvery node replays every transaction. That's the security model, not a bug. Throughput is scarce, so fees become an auction for block space.\n\nCongested chain means expensive fees, which pushes users to L2s. That's the entire L2 thesis in one sentence.\n\n## Liquidity moves price, not news\n\nCrypto runs 24/7 across hundreds of venues with thin order books. A $10M sell can move a small pair 20%. The same trade barely dents Bitcoin.\n\nThis is why altcoin candles look violent and why slippage exists.\n\n## Cycles are sentiment plus flows\n\nHalvings cut new supply. ETFs and leverage add demand. Liquidations cascade in both directions and make moves bigger than the fundamentals justify.\n\n## What to do with this\n\nCheck gas before transacting. Check liquidity before entering an alt position. Never size a trade assuming you'll get the price you see on screen." },
  {
    id:2, title:"Setting Up a Web3 Wallet Safely", level:"Beginner", min:6,
    body:"Your Web3 wallet is the key to everything else on this site. Set it up wrong and you can lose everything in one click. Here's the version that doesn't end badly.\n\n## Pick the right one\n\nMetaMask (browser and mobile) or Phantom (Solana) are the standard starting points. Download them from the official site only \u2014 fake wallet extensions are the number one way people get drained.\n\n## Write the seed phrase down. On paper.\n\nTwelve or twenty-four words, offline, on paper. Never screenshot it. Never paste it into a chat. Never type it into a website. Anyone holding those words owns your funds.\n\n## Hot wallet vs cold wallet\n\nA browser wallet is a hot wallet. Fine for small amounts and airdrop farming, not where savings live. Move meaningful holdings to a hardware wallet \u2014 Ledger or Trezor.\n\n## Practice before you commit\n\nSend a small amount of ETH or SOL to yourself first. Try a tiny swap. Then scale up. Your first mistake should cost cents, not your whole bag.\n\n## The rule that never changes\n\nA seed phrase is asked for exactly once, by the wallet app itself, during setup. Anywhere else \u2014 a website, a DM, a \"support agent\" \u2014 it's a scam." },
  {
    id:3, title:"What Is an Airdrop (and How Farming Works)", level:"Beginner", min:8,
    body:"An airdrop is a token giveaway to early users of a protocol. Projects do it to reward real activity and hand ownership to the people who showed up before there was anything to own.\n\n## It has paid real money\n\nEarly Arbitrum and Jupiter users collected four-figure payouts for work they were already doing \u2014 bridging, swapping, providing liquidity. No insider list required.\n\n## How farming actually works\n\n- **Use new protocols early.** Bridge, swap, provide liquidity, mint an NFT. You're building a track record on your address.\n- **Be a real user.** Projects filter out sybil accounts \u2014 many wallets doing identical tiny actions. One wallet with meaningful activity beats ten with dust.\n- **Budget for it.** Gas fees add up and most farms pay nothing. Every interaction is a lottery ticket you paid for.\n\n## The safety part\n\nNever sign a transaction you can't explain. Approve tokens in limited amounts only. Revoke old approvals regularly with revoke.cash.\n\nAnd remember: airdrop DMs are always scams. Real drops appear in your wallet, never in your inbox." },
  {
    id:4, title:"How to Avoid Crypto Scams", level:"Beginner", min:7,
    body:"Most people who lose money in crypto do not get hacked. They get talked into something. Here are the patterns that keep working on smart people.\n\n## The three that get everyone\n\n- **Fake wallet extensions.** Ads at the top of search results pointing at lookalike domains. Bookmark the real site instead.\n- **\"Verify your wallet\" sites.** They ask you to connect and sign, then drain your approvals. Real eligibility checks are read-only.\n- **DM support.** Nobody legitimate messages you first. Not the project, not the exchange, not \"MetaMask support.\"\n\n## Approvals are the real attack surface\n\nWhen you swap a token, you grant a contract permission to spend it. That permission usually stays open, forever, on every token you've ever traded.\n\nIf a contract you approved is later compromised, it can drain those tokens without you signing anything new. This is why revoking old approvals matters more than most people think.\n\n## The smell test\n\nIf it promises a return, it is a risk you are not being told about. If it needs urgency, it is a decision you would not make calmly. If it needs your seed phrase, it is theft \u2014 there is no fourth category.\n\n## What to do today\n\nBookmark your wallet's real site. Revoke approvals at revoke.cash. Turn on a hardware wallet for anything you'd be upset to lose." },
  {
    id:5, title:"Stablecoins: What They Are and How They Break", level:"Beginner", min:7,
    body:"A stablecoin is a token designed to hold a constant value, usually one US dollar. They are the plumbing of crypto \u2014 the pair you exit into when you don't want to leave the ecosystem.\n\n## Three kinds, three risks\n\n- **Fiat-backed.** USDT and USDC. Reserves held by the issuer. Risk: whether those reserves are real and redeemable.\n- **Crypto-backed.** DAI. Overcollateralised with crypto. Risk: liquidation cascades when collateral crashes.\n- **Algorithmic.** Terra's UST was the famous one. Risk: the whole design.\n\n## Why they break\n\nUST did not break because of a hack. It broke because the mechanism holding the peg depended on confidence, and confidence is not collateral. When the peg slipped, the arbitrage that was supposed to restore it became the thing that accelerated the collapse.\n\nFiat-backed coins are sturdier but not immune. USDC depegged briefly in 2023 when a chunk of its reserves sat in a failed bank. It recovered \u2014 but the lesson landed: \"backed by reserves\" is only as good as the reserves.\n\n## What to watch\n\nCheck who issues it, where the reserves sit, and whether the issuer can actually redeem at par. And never treat a stablecoin as risk-free just because the price is boring." },
  {
    id:6, title:"Farming L2 Airdrops Without Wasting Gas", level:"Intermediate", min:10,
    body:"Layer-2 airdrops reward wallets that used the chain before the snapshot. Arbitrum, Optimism, and the rest all followed the same pattern. Here's the framework that holds up.\n\n## What counts\n\n- Bridging funds to the L2 yourself, not through an exchange\n- Regular activity over weeks \u2014 swaps, liquidity, testnet work\n- Volume and unique active weeks, which matter more than raw transaction count\n\n## Set a budget and stick to it\n\nPick a monthly gas cap \u2014 $50 to $100 is plenty. Route interactions through cheap periods. L2 gas costs cents; mainnet gas is what eats your budget alive.\n\n## What kills your farm\n\n- **Bot-like patterns.** The same action daily at the same minute gets flagged by sybil filters.\n- **Farming after the announcement.** Once the airdrop is confirmed, you're buying the top.\n- **Handing over your seed phrase to an \"eligibility checker.\"** Real checks are read-only.\n\n## Track your real cost\n\nKeep a simple sheet: wallet, protocol, actions taken, gas spent. After a few months you'll know exactly what each airdrop cost you \u2014 instead of guessing at the end." },
  {
    id:7, title:"How to Do Your Own Research (DYOR) on a Token", level:"Intermediate", min:8,
    body:"\"Do your own research\" is the most repeated and least followed advice in crypto. Here is what it actually means in practice.\n\n## Start with the boring questions\n\n- Who built it, and are they identifiable?\n- Does it do something that already exists, only worse?\n- Where does the money come from? Fees, emissions, or new buyers?\n\nIf you cannot answer the third one, you do not understand the token \u2014 you are the revenue.\n\n## Read the tokenomics, not the roadmap\n\nRoadmaps are marketing. Tokenomics are math. Find the supply schedule: how much unlocks, when, and who holds it.\n\nA token with 80% of supply unlocking in six months has a permanent seller overhead. No amount of good news fixes that.\n\n## Check the contracts\n\nIs liquidity locked, and for how long? Can the team mint more? Is ownership renounced or held by a multisig you can inspect?\n\n## Look at who's actually using it\n\nDaily active addresses, real volume, fee revenue. Not followers, not Discord size, not partnership announcements.\n\n## The one-line version\n\nIf you cannot explain how the token accrues value in a sentence, without using the word \"ecosystem,\" keep your money." },
  {
    id:8, title:"Cross-Chain Bridges and Their Risks", level:"Intermediate", min:9,
    body:"A bridge moves assets between blockchains. They are essential infrastructure and the single largest category of DeFi hacks. Both things are true at once.\n\n## How most bridges work\n\nLock your tokens on the source chain, mint a representation on the destination. The bridge now holds the locked assets, which makes it an enormous, concentrated target.\n\nIf someone compromises the bridge's contracts or validators, they mint unlimited representations and drain the real collateral. That is not a hypothetical \u2014 it is how the largest crypto thefts in history happened.\n\n## Why they keep getting hit\n\nBridges combine three things attackers love: high value locked in one place, complex cross-chain logic that is hard to audit, and often a small set of validators who can be socially engineered.\n\n## Using them more safely\n\n- Prefer native bridges run by the chain's own team for large amounts\n- Check the bridge's track record and total value locked\n- Split large transfers rather than moving everything at once\n- Never bridge a token you cannot afford to lose entirely\n\n## The honest summary\n\nBridging is a trust decision, not a technical formality. You are trusting specific contracts and specific people with the full value of the transfer." },
  {
    id:9, title:"Gas Fees: Why They Spike and How to Pay Less", level:"Intermediate", min:7,
    body:"Gas is what you pay to have a transaction included in a block. It is not a fee set by the network \u2014 it is a bid in an auction for scarce space.\n\n## Why it spikes\n\nDemand is bursty. A hyped mint, a liquidation cascade, or an airdrop claim can push thousands of transactions into the same minute. Block space does not expand, so price does.\n\nEthereum mainnet has hit hundreds of dollars per transaction during those moments. That is the mechanism working as designed, not a malfunction.\n\n## The four ways to pay less\n\n- **Move to a layer 2.** Arbitrum, Base and Optimism settle to Ethereum for a fraction of the cost.\n- **Time it.** Fees follow a weekly rhythm \u2014 weekends and off-hours are cheaper.\n- **Batch your actions.** One transaction that does five things costs less than five transactions.\n- **Set a limit.** Wallets let you cap what you'll pay. If the cap isn't met, the transaction waits or fails instead of overcharging you.\n\n## The mistake to avoid\n\nDo not crank up the fee \"just to make it go through\" on a transaction you can do tomorrow. The urgent ones are almost never actually urgent." },
  {
    id:10, title:"Introduction to Impermanent Loss", level:"Beginner", min:7,
    body:"Provide liquidity to an AMM pool \u2014 ETH/USDC on Uniswap, say \u2014 and you've signed up for impermanent loss. It's the gap between what your deposit is worth in the pool versus just holding both tokens.\n\n## The mechanic\n\nThe AMM holds a constant product. When ETH doubles, the pool automatically sells some of your ETH for USDC to keep the ratio balanced. You end up with less ETH than if you'd just held it.\n\nThe numbers: about **5.7% loss at a 2x move**, about **20% at 4x**.\n\n## When it bites hardest\n\nVolatile pairs, meme coins, anything that trends hard in one direction. And it stops being \"impermanent\" the moment you withdraw.\n\n## When it doesn't matter\n\nIf swap fees plus incentives beat the loss you'd have taken, you're still net positive. Stablecoin pairs have near-zero impermanent loss and mostly just earn fees.\n\n## The check before you deposit\n\nEstimated fee APR minus expected loss over your horizon \u2014 is it above zero? If the coin can 5x, providing liquidity means selling the pump automatically. Decide if that's what you want." },
  {
    id:11, title:"Staking vs Yield Farming: The Difference", level:"Intermediate", min:8,
    body:"Both pay you for holding crypto. They are not the same activity, and they do not carry the same risk.\n\n## Staking\n\nYou lock tokens to help secure a proof-of-stake network. The rewards come from protocol issuance \u2014 new tokens minted as inflation.\n\nIt is comparatively simple. The risks are a falling token price, and an unbonding period that keeps your funds locked for days or weeks after you decide to leave.\n\n## Yield farming\n\nYou move capital between protocols chasing the best return \u2014 lending here, providing liquidity there, claiming and compounding rewards.\n\nIt is an active job. Rewards usually come from token emissions, which means the yield is often paid in something that is falling while you earn it.\n\n## The comparison that matters\n\n- **Staking:** one asset, one risk, low effort, modest return.\n- **Farming:** many assets, contract risk, impermanent loss, gas costs, high effort, high headline return.\n\n## The rule of thumb\n\nA 300% APY is a warning, not an opportunity. Ask what is paying it and where that money comes from. Usually the answer is new buyers \u2014 which makes you the exit liquidity if you arrive late." },
  {
    id:12, title:"Reading a Crypto Chart: Candlesticks Explained", level:"Intermediate", min:9,
    body:"A candlestick packs four prices into one shape: open, high, low, close. Learn to read one and you can read any chart on any timeframe.\n\n## The anatomy\n\n- **Body** \u2014 the range between open and close. Green or hollow means it closed higher; red or filled means lower.\n- **Wicks** \u2014 the extremes reached during the period. A long wick shows price was rejected there.\n\n## What wicks tell you\n\nA long upper wick means buyers pushed price up and sellers pushed it back down. That is rejection, and it usually marks where supply sits.\n\nA long lower wick is the opposite: sellers drove it down and buyers absorbed it. It marks where demand showed up.\n\n## Timeframes change the story\n\nThe same asset can look bullish on the daily and bearish on the weekly. Neither is wrong \u2014 they are answering different questions.\n\nHigher timeframes carry more weight. A weekly level breaking matters more than a 15-minute one, and it is where most retail traders get the hierarchy backwards.\n\n## Volume is not optional\n\nPrice shows what happened; volume shows how much conviction was behind it. A breakout on falling volume is usually a trap. A breakdown on rising volume usually is not.\n\n## The honest part\n\nChart reading describes what already happened. It does not predict what comes next. Use it to manage risk and set levels \u2014 not as a crystal ball." },
  {
    id:13, title:"Understanding Supertrend (95, 5) and Multi-Indicator Setups", level:"Advanced", min:12,
    body:"Supertrend flips below price in an uptrend and above it in a downtrend, using ATR to set the band distance. Simple idea, and most people use it wrong.\n\n## The (95, 5) setup\n\nA long lookback (95) smooths the trend so you only flip on structural changes. A tighter multiplier (5) keeps stops trailing close. The result: fewer, later signals. Great for trend-following, painful in chop.\n\n## Why stack indicators at all\n\n- **Supertrend** gives direction \u2014 bull or bear.\n- **RSI (14)** filters exhaustion. At 62 the market is neutral, so longs have room but you're late in the move.\n- **Bollinger squeeze** warns that volatility is about to expand. A Supertrend flip during a squeeze is the strongest signal in this stack.\n\n## The honest limits\n\nEvery indicator reads history, not the future. Backtest on out-of-sample data, expect whipsaws when price ranges, and size positions so a losing streak doesn't end your account.\n\nAn indicator is a filter, not an oracle. Anyone selling you the second one is selling you something." }
];

const GLOSSARY = [
  {
    slug:"airdrop", term:"Airdrop",
    short:"Free tokens distributed to wallet addresses, usually to reward early users of a protocol.",
    body:"An airdrop is a distribution of free tokens to wallet addresses. Projects use it to reward early users, hand ownership to a community, and decentralise supply instead of selling everything to investors.\n\nMost airdrops are retroactive: you qualify by using a protocol before it announces a token. Arbitrum, Optimism, Jupiter and LayerZero all rewarded wallets that had already been active for months. Nothing about it is a guarantee \u2014 most farms pay nothing." },
  {
    slug:"amm", term:"AMM",
    short:"Automated Market Maker \u2014 a protocol that prices assets with a formula instead of an order book.",
    body:"An automated market maker is a smart contract that prices assets with a formula instead of an order book. Uniswap popularised the constant product model, where the product of the two reserves stays fixed.\n\nThat formula is why AMMs always quote a price, even for tokens nobody is trading. It is also the source of impermanent loss: the pool rebalances automatically as prices move, so you end up holding more of the asset that fell." },
  {
    slug:"apr-vs-apy", term:"APR vs APY",
    short:"APR is the yearly rate without compounding; APY includes compounding and is always higher.",
    body:"APR is the simple annual rate, with no compounding. APY folds compounding back in, so it is always the higher number for the same underlying yield.\n\nThe gap grows with frequency. A 20% APR compounded daily lands near 22% APY. When a platform advertises a headline number, check which one it is \u2014 and whether the yield is paid in a token that might fall faster than you earn it." },
  {
    slug:"ath", term:"ATH",
    short:"All-Time High \u2014 the highest price an asset has ever traded at.",
    body:"An all-time high is the highest price an asset has ever traded at. Traders watch it because old highs tend to act as resistance: holders who bought at the top often sell when price returns to break even.\n\n'Near ATH' is not a bullish or bearish signal by itself. It simply means there is little historical overhead supply. Whether it breaks depends on new demand, not on the chart alone." },
  {
    slug:"bear-market", term:"Bear Market",
    short:"A prolonged decline, conventionally 20% or more from recent highs.",
    body:"A bear market is a sustained decline, conventionally a 20% drop or more from recent highs. Crypto bear markets are brutal because they arrive with forced liquidations, exchange failures and a collapse in new-user interest.\n\nThey are also where the next cycle is built. Projects that keep shipping through a bear market tend to be the ones that matter when demand returns." },
  {
    slug:"bull-market", term:"Bull Market",
    short:"A prolonged rise driven by new demand, easy credit and rising confidence.",
    body:"A bull market is a sustained rise driven by new demand, easy credit, and rising confidence. In crypto it usually arrives with leverage, memecoins, and a flood of first-time buyers.\n\nBull markets hide bad decisions. Positions that would look reckless in a flat market get validated by price going up. That is why most losses are actually made during the good times and only realised later." },
  {
    slug:"block-explorer", term:"Block Explorer",
    short:"A site for viewing every transaction, wallet and contract on a blockchain.",
    body:"A block explorer is a search engine for a blockchain. You paste an address, a transaction hash or a block number and see exactly what happened, when, and what it cost.\n\nIt is the single most useful tool for verifying claims. If someone says they sent funds, the explorer shows whether they did. Etherscan for Ethereum, Solscan for Solana, and most chains have an equivalent." },
  {
    slug:"bridge", term:"Bridge",
    short:"A protocol that moves assets from one blockchain to another.",
    body:"A bridge moves assets between chains. Most work by locking your tokens on the source chain and minting a representation on the destination \u2014 which is why bridges hold enormous value and attract enormous attacks.\n\nBridges are the single largest category of DeFi hacks. When you bridge, you are trusting the bridge's contracts and validators, not just the two chains involved." },
  {
    slug:"cex", term:"CEX",
    short:"Centralized Exchange \u2014 a company like Binance or Bybit that holds user funds and matches trades.",
    body:"A centralised exchange is a company that holds your funds and matches trades on its own order book. Binance, Bybit, OKX and Coinbase are the best known.\n\nCEXs are fast and liquid, but you do not control the keys. When one fails \u2014 FTX being the obvious example \u2014 customer funds can vanish. The old rule holds: not your keys, not your coins." },
  {
    slug:"cold-wallet", term:"Cold Wallet",
    short:"A hardware wallet that keeps private keys offline, never touching the internet.",
    body:"A cold wallet keeps your private keys on a device that never touches the internet. Ledger and Trezor are the common ones. You sign transactions by physically confirming them on the device.\n\nCold storage is for savings, not daily use. The point is that malware on your computer cannot reach a key that is not there. The trade-off is convenience, and one real risk: losing the device without a backup means losing the funds." },
  {
    slug:"dex", term:"DEX",
    short:"Decentralized Exchange \u2014 trading directly from your wallet against smart contracts, no custodian.",
    body:"A decentralised exchange lets you trade directly from your wallet against smart contracts, with no account and no custodian. Uniswap, Curve and Jupiter are the main examples.\n\nYou keep control of your funds the entire time, which removes counterparty risk but adds contract risk. A malicious or buggy pool can drain what you approve, so check what you are signing and approve limited amounts." },
  {
    slug:"defi", term:"DeFi",
    short:"Decentralized Finance \u2014 lending, trading and earning rebuilt on smart contracts without banks.",
    body:"Decentralised finance rebuilds lending, trading, and earning on smart contracts. Instead of a bank deciding your rate, a pool of code sets it based on supply and demand.\n\nThe appeal is access and transparency \u2014 anyone can audit the contract, and no one can freeze your position. The cost is that bugs are permanent, exploits are common, and there is no support line when something breaks." },
  {
    slug:"gas-fee", term:"Gas Fee",
    short:"The cost paid to have a transaction included in a blockchain block.",
    body:"A gas fee is what you pay to have a transaction included in a block. It compensates validators and, more importantly, rations scarce block space.\n\nFees rise when demand spikes: a popular mint or a liquidation cascade can push Ethereum mainnet costs into the hundreds of dollars. Layer-2 networks exist largely to make this cheaper by settling batches back to mainnet." },
  {
    slug:"hodl", term:"HODL",
    short:"Holding an asset long-term through volatility instead of selling on every dip.",
    body:"HODL started as a typo for 'hold' and became crypto's word for refusing to sell through volatility. The idea is that short-term price is noise and long-term adoption is the actual bet.\n\nIt works when the asset survives. It destroys people when the asset is a token that never recovers. Holding through a drawdown in Bitcoin is a different decision from holding through one in a project with no users." },
  {
    slug:"hot-wallet", term:"Hot Wallet",
    short:"An internet-connected wallet \u2014 convenient for daily use, more exposed to attacks.",
    body:"A hot wallet is any wallet connected to the internet \u2014 a browser extension like MetaMask, a mobile app, or an exchange account. It is fast and convenient.\n\nThe trade-off is exposure. Malware, malicious approvals, and phishing sites all target hot wallets specifically. Use one for small balances and airdrop farming, and keep savings in cold storage." },
  {
    slug:"impermanent-loss", term:"Impermanent Loss",
    short:"The relative loss from providing liquidity, compared with simply holding both tokens.",
    body:"Impermanent loss is the gap between what your deposit is worth in an AMM pool versus simply holding both tokens. The pool automatically sells the asset that rises and buys the one that falls.\n\nAt a 2x price move the loss is roughly 5.7%; at 4x it is around 20%. It becomes permanent the moment you withdraw. Fees and incentives have to beat it for the position to make sense." },
  {
    slug:"kyc", term:"KYC",
    short:"Know Your Customer \u2014 the identity verification that regulated exchanges require.",
    body:"KYC is the identity verification process regulated exchanges require: a government ID, sometimes a selfie, sometimes proof of address. It exists to satisfy anti-money-laundering rules.\n\nDecentralised exchanges have no KYC because there is no company to regulate. That is a feature for privacy and a problem for anyone who needs a regulated on-ramp." },
  {
    slug:"layer-1", term:"Layer 1",
    short:"A base blockchain that processes and secures its own transactions, like Bitcoin or Ethereum.",
    body:"A layer 1 is a base blockchain that processes and secures its own transactions \u2014 Bitcoin, Ethereum, Solana. Every node replays every transaction, which is what makes the chain trustworthy and also what makes it slow.\n\nL1s compete on the trade-off between decentralisation, security and throughput. You can optimise two of the three, which is why there is no single winning chain." },
  {
    slug:"layer-2", term:"Layer 2",
    short:"A network on top of an L1 that processes transactions cheaply and settles them back to it.",
    body:"A layer 2 processes transactions off the main chain and settles the results back to it. Arbitrum, Optimism, Base and zkSync are the major Ethereum L2s.\n\nThey inherit Ethereum's security while costing cents instead of dollars. That cost difference is why most airdrop farming now happens on L2s \u2014 and why L2 tokens have been among the largest distributions in recent cycles." },
  {
    slug:"liquidity-pool", term:"Liquidity Pool",
    short:"A pool of funds locked in a smart contract that anyone can trade against.",
    body:"A liquidity pool is a pot of two tokens locked in a contract that anyone can trade against. Instead of matching buyers with sellers, traders swap against the pool itself.\n\nProviders earn a cut of every swap. In return they accept impermanent loss and the risk that the contract has a flaw. Pool size determines slippage: thin pools punish large trades." },
  {
    slug:"liquidity-mining", term:"Liquidity Mining",
    short:"Extra token rewards paid to people who deposit into a liquidity pool.",
    body:"Liquidity mining pays extra tokens to people who deposit into a pool, on top of normal trading fees. Protocols use it to bootstrap liquidity fast, since traders go where depth already exists.\n\nThe catch is that rewards are usually paid in the protocol's own token. If that token falls faster than you earn it, a headline 200% APY can still lose you money." },
  {
    slug:"mainnet", term:"Mainnet",
    short:"The live production blockchain, where transactions cost real money.",
    body:"Mainnet is the live network where transactions cost real money and carry real consequences. Everything you do with actual funds happens here.\n\nIt is the opposite of testnet, where tokens are worthless and mistakes are free. The distinction matters because behaviour that is fine on testnet \u2014 sloppy key handling, blind approvals \u2014 is dangerous on mainnet." },
  {
    slug:"mev", term:"MEV",
    short:"Maximal Extractable Value \u2014 profit taken by controlling the order of transactions in a block.",
    body:"MEV is the profit available to whoever decides the order of transactions in a block. Validators and searchers can front-run, back-run or sandwich other people's trades.\n\nThe visible cost to normal users is worse execution: your swap gets filled at a slightly worse price because a bot inserted itself around it. Sandwich attacks on retail swaps are the most common form." },
  {
    slug:"nft", term:"NFT",
    short:"Non-Fungible Token \u2014 a unique token proving ownership of a specific digital asset.",
    body:"An NFT is a token that is unique rather than interchangeable. It proves ownership of a specific item on-chain \u2014 an image, a membership, a game asset, a domain name.\n\nMost speculative NFT value collapsed after 2021, but the underlying mechanism is being used for things that work: token-gated access, event tickets, and on-chain identity." },
  {
    slug:"private-key", term:"Private Key",
    short:"The secret number that controls a wallet. Whoever holds it, holds the funds.",
    body:"A private key is the secret number that authorises transactions from a wallet. Your address is derived from it; anyone who obtains it can move everything, irreversibly.\n\nIt is mathematically the same as your seed phrase in a different format. No legitimate service ever needs it. Anyone asking for it is stealing from you." },
  {
    slug:"proof-of-stake", term:"Proof of Stake",
    short:"A consensus mechanism where validators lock capital as collateral for securing the chain.",
    body:"Proof of stake secures a chain by requiring validators to lock up tokens as collateral. Misbehave, and the stake gets destroyed. Ethereum, Solana and most modern chains use it.\n\nThe trade-off versus proof of work is energy and cost, at the price of a different distribution of power: whoever holds the most tokens has the most influence." },
  {
    slug:"proof-of-work", term:"Proof of Work",
    short:"A consensus mechanism where miners spend computation to secure the network.",
    body:"Proof of work secures a chain by making block production expensive. Miners burn electricity to solve a puzzle, and the cost of attacking the network is the cost of out-computing everyone else.\n\nBitcoin is the dominant example. It is extraordinarily resilient and extraordinarily energy-hungry, and it is the reason Bitcoin has never been successfully double-spent." },
  {
    slug:"rug-pull", term:"Rug Pull",
    short:"A scam where developers drain liquidity or dump their own tokens, leaving buyers with nothing.",
    body:"A rug pull is when a project's creators drain the liquidity pool or dump their own holdings, leaving buyers with worthless tokens. It is the most common scam in low-cap crypto.\n\nWarning signs are consistent: anonymous teams, locked liquidity that is not actually locked, minting rights retained, and marketing that promises returns. If you cannot explain how the project makes money, assume it makes money from you." },
  {
    slug:"seed-phrase", term:"Seed Phrase",
    short:"The 12 or 24 words that can restore an entire wallet. It is the wallet.",
    body:"A seed phrase is a human-readable backup that generates every private key in a wallet. Twelve or twenty-four words, in a fixed order. It is the wallet.\n\nWrite it on paper and store it offline. Never photograph it, never paste it into a chat, never type it into a website. Every 'wallet verification' request is a theft attempt." },
  {
    slug:"slippage", term:"Slippage",
    short:"The gap between the price you expected and the price your trade actually filled at.",
    body:"Slippage is the difference between the price you expected and the price your trade actually filled at. It comes from thin liquidity, fast-moving markets, or other trades landing before yours.\n\nSetting a tight slippage tolerance protects you from bad fills but causes failed transactions. Setting it loose is how sandwich bots take your money. On thin pairs, check depth before sizing." },
  {
    slug:"smart-contract", term:"Smart Contract",
    short:"Self-executing code deployed to a blockchain, with no off switch and no support line.",
    body:"A smart contract is code deployed to a blockchain that executes automatically when conditions are met. It has no off switch and no support team.\n\nThat immutability is the point and the risk. It means nobody can censor your transaction, and it also means a bug is permanent. Every major DeFi exploit was a smart contract behaving exactly as written." },
  {
    slug:"stablecoin", term:"Stablecoin",
    short:"A token pegged to a currency, usually the US dollar.",
    body:"A stablecoin is a token designed to hold a constant value, usually one US dollar. USDT and USDC are backed by reserves held by their issuers; DAI is backed by crypto collateral.\n\nThey are the plumbing of crypto trading \u2014 the pair you exit into when you do not want to leave the ecosystem. They also carry issuer risk: a stablecoin is only worth a dollar if the company behind it can actually redeem one." },
  {
    slug:"staking", term:"Staking",
    short:"Locking tokens to help secure a network, earning rewards in return.",
    body:"Staking means locking tokens to help secure a proof-of-stake network. In return you earn rewards, usually paid in the same token you staked.\n\nIt is not free money. The yield is dilution, the token can fall, and some networks impose an unbonding period that locks your funds for days or weeks after you decide to leave." },
  {
    slug:"sybil-attack", term:"Sybil Attack",
    short:"Creating many fake wallets to farm a single airdrop multiple times.",
    body:"A sybil attack is creating many wallets to farm one airdrop multiple times. Projects actively filter for it, because a distribution captured by bots fails its purpose.\n\nDetectors look for identical behaviour: the same actions, the same amounts, the same timing across addresses. One wallet with genuine, varied activity consistently outperforms a dozen with dust." },
  {
    slug:"testnet", term:"Testnet",
    short:"A practice network with worthless tokens for testing features safely.",
    body:"A testnet is a parallel network where tokens are free and worthless. Developers use it to test upgrades; users use it to try features without risking funds.\n\nTestnet activity sometimes counts toward airdrops, which makes it cheap to farm. It is also where you should make your first mistake \u2014 on testnet a wrong click costs nothing." },
  {
    slug:"tvl", term:"TVL",
    short:"Total Value Locked \u2014 the total value of assets deposited in a protocol's contracts.",
    body:"Total value locked is the sum of all assets deposited in a protocol's contracts. It is the standard measure of size in DeFi, and it is easy to misread.\n\nTVL counts the dollar value of deposits, so it rises when prices rise even if no new money arrives. It can also be inflated by recursive lending loops where the same capital is counted several times. Treat it as a rough size indicator, not proof of health." },
  {
    slug:"whale", term:"Whale",
    short:"An entity holding enough of an asset to move its price.",
    body:"A whale is an entity holding enough of an asset to move its price. On thin altcoin pairs, a single whale exit can cut the price in half.\n\nWhale watching is popular because large wallets are visible on-chain. The caveat: visible accumulation may be an exchange's cold wallet, and visible selling may be a routine rebalance. On-chain data shows movement, not intent." },
  {
    slug:"yield-farming", term:"Yield Farming",
    short:"Chasing the best returns by moving capital between DeFi protocols.",
    body:"Yield farming means chasing the best returns by moving capital between DeFi protocols \u2014 lending here, providing liquidity there, claiming and compounding rewards.\n\nIt is a real skill with real risks: contract exploits, impermanent loss, token emissions that collapse, and the cost of every transaction along the way. The headline APY almost never survives contact with all four." },
  {
    slug:"zero-knowledge-proof", term:"Zero-Knowledge Proof",
    short:"A cryptographic proof that something is true, without revealing the underlying data.",
    body:"A zero-knowledge proof lets you prove a statement is true without revealing the information behind it. You can prove you know a password without showing the password.\n\nIn crypto it powers privacy coins and zk-rollups, where proofs are used to convince the main chain that thousands of transactions were valid \u2014 without the main chain re-executing any of them." },
  {
    slug:"zk-rollup", term:"ZK Rollup",
    short:"A Layer 2 that validates transactions with cryptographic proofs rather than assuming honesty.",
    body:"A zk-rollup compresses thousands of transactions into a single cryptographic proof and posts it to the main chain. zkSync, StarkNet and Scroll work this way.\n\nThe advantage over optimistic rollups is faster finality and no multi-day challenge window, since validity is proven rather than assumed. The cost has historically been heavier computation, which is why proving times were the bottleneck early on." }
];

const TRACKS = [
  {
    slug:"crypto-starter", name:"Crypto Starter", level:"Beginner", icon:"\ud83c\udf31",
    desc:"Everything you need before you touch a wallet. Start here if crypto still feels like a foreign language.",
    lessons:["Crypto Basics: Blocks, Fees, and Why Prices Move", "Setting Up a Web3 Wallet Safely", "What Is an Airdrop (and How Farming Works)", "How to Avoid Crypto Scams", "Stablecoins: What They Are and How They Break"] },
  {
    slug:"airdrop-hunter", name:"Airdrop Hunter", level:"Intermediate", icon:"\ud83c\udfaf",
    desc:"Turn a wallet into a farming operation that does not waste gas \u2014 and does not get filtered as a bot.",
    lessons:["Farming L2 Airdrops Without Wasting Gas", "How to Do Your Own Research (DYOR) on a Token", "Cross-Chain Bridges and Their Risks", "Gas Fees: Why They Spike and How to Pay Less"] },
  {
    slug:"defi-degen", name:"DeFi Degen", level:"Advanced", icon:"\u2699\ufe0f",
    desc:"For people who already provide liquidity and want to stop paying tuition to the market.",
    lessons:["Introduction to Impermanent Loss", "Staking vs Yield Farming: The Difference", "Reading a Crypto Chart: Candlesticks Explained", "Understanding Supertrend (95, 5) and Multi-Indicator Setups"] }
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
