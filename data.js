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
    slug:"mashinsky-celsius-dihukum-selamanya-pelajaran-untuk-pengguna-defi",
    t:"Mashinsky Celsius Dihukum Selamanya: Pelajaran untuk Pengguna DeFi",
    s:"Market Intel",
    d:"Just now",
    src:"https://cointelegraph.com/news/celsius-founder-alex-mashinsky-permanently-banned-from-crypto-industry-in-ny-settlement",
    body:"Mashinsky, founder Celsius yang sekarang di penjara, dilarang selamanya dari industri kripto, sekuritas, dan komoditas. Ini bagian dari kesepakatan dengan Jaksa Agung New York Letitia James yang mencakup pembayaran bersyarat hingga 35 juta dolar. \n\n## Isi Kesepakatannya\n\nPerjanjian yang diumumkan Jumat menyelesaikan gugatan sipil 2023 yang menuduh Mashinsky menyesatkan ratusan ribu investor tentang keamanan Celsius sebelum perusahaan itu runtuh pada 2022. Mashinsky wajib membayar New York 25 juta dolar jika ia gagal menyerahkan 10 juta dolar keuntungan ilegal tambahan ke pemerintah federal. Ada tambahan 10 juta lagi jika ia tidak menjalani hukuman penjara penuhnya. \n\n## Celsius Dulu Menjanjikan Hasil Tinggi\n\nMashinsky mempromosikan Celsius sebagai alternatif yang lebih aman dari bank, menawarkan imbal hasil hingga 17% sambil menyembunyikan investasi berisiko dan kerugian yang menumpuk. Pada awal 2022, Celsius menarik sekitar 20 miliar dolar dalam aset digital, tapi kesulitan menghasilkan pendapatan untuk mempertahankan imbal hasil yang dijanjikan. \n\nMashinsky kini menjalani hukuman penjara federal 12 tahun atas penipuan, setelah mengaku bersalah pada Desember 2024. Ia juga diperintahkan menyita lebih dari 48 juta dolar secara federal. \n\n## Artinya Buat Kamu\n\nKasus ini menunjukkan bahwa korban Celsius akhirnya mendapat sedikit keadilan setelah bertahun-tahun. Tapi lebih penting lagi, ini pengingat bahwa imbal hasil 17% yang dijanjikan platform DeFi tidak pernah gratis — selalu ada risiko tersembunyi di baliknya. Kalau platform menawarkan hasil terlalu bagus untuk jadi kemungkinan besar, itu biasanya memang tidak mungkin.\n\n https://cointelegraph.com/news/celsius-founder-alex-mashinsky-permanently-banned-from-crypto-industry-in-ny-settlement"
  },
  {
    slug:"dwf-labs-gugat-bitgo-141-juta-dolar-atas-dugaan-pelanggaran-token-lock",
    t:"DWF Labs Gugat BitGo 141 Juta Dolar atas Dugaan Pelanggaran Token Lock-Up",
    s:"Market Intel",
    d:"Just now",
    src:"https://www.coindesk.com/policy/2026/10/09/dwf-labs-subsidiaries-sue-bitgo-for-usd141-million-over-alleged-token-lock-up-breach",
    body:"DWF Labs, salah satu market maker terbesar di dunia kripo, menuntut BitGo sebesar 141 juta dolar gugatan pengadilan London atas dugaan pelanggaran perjanjian token lock-up. Dua anak perusahaan DWF, DWF Maas dan Falcon Digital, menuduh BitGo menjual token sebelum masa kunci tiga bulan berakhir, sehingga harga anjlok dan mereka mengalami kerugian besar.\n\n## Gugatan Dua Anak Usaha DWF\n\nDWF Maas yang berbasis di Kepulauan Virgin Britania dan Falcon Digital dari Panama mengajukan gugatan di Penginggi London. Mereka mengaku sudah menjual token Falcon Finance (FF) dan token ESPORTS kepada BitGo dengan harga diskon. Perjanjian tertulis menyatakan BitGo wajib menahan token itu selama tiga bulan sebelum bisa dijual ke pasar.\n\nMenurut gugatan tersebut, BitGo melanggar kontrak dengan menjual token lebih cepat. Akibatnya, pasokan token melimpah dan harganya anjlok, yang menyebabkan DWF menderita kerugiusenilai 114 juta dolar dari total tuntutan 141 juta dolar. BitGo sendiri belum memberikan pernyataan publik atas gugatan ini.\n\n## Ini Bukan Kali Pertama\n\nDWF Labs punya riwayat panjang sebagai market maker yang kerap terlibat proyek-proyek kontroversial. Beberapa proyek yang mereka tangani mengalami kinerja buruk setelah token mulai diperdagangkan. Industri kripo sendiri sering kali punya isu serupa, di mana investor membeli token dengan harga diskon dan langsung menjual begitu pasar dibuka. Tapi kasus ini berbeda — kali ini perceraian terjadi di antara dua perusahaan besar di industri.\n\n## Artinya Buat Kamu\n\nBagi trader dan investor ritel, gugatan ini jadi pengingat bahwa risiko tidak selalu datang dari luar. Kadang masalahnya ada di tengah rantai antara penerbit token dan pihak yang menyimpannya. Kalau kamu ikut presale atau token sale, pastikan ada mekanisme kunci yang bisa dipercaya — atau kamu bisa menjadi orang yang pertama kali terjatuh saat pasar dibuka.\n\n https://www.coindesk.com/policy/2026/10/09/dwf-labs-subsidiaries-sue-bitgo-for-usd141-million-over-alleged-token-lock-up-breach"
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
