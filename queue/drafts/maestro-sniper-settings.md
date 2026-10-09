Maestro's sniper feature is built to buy new tokens the moment they launch, but the default settings will cost you money if you do not configure them properly. This guide covers slippage, gas, and anti-MEV settings so you can snipe with intention rather than guesswork.

## What a sniper bot does

A sniper bot monitors the blockchain for new token listings and executes a buy automatically when liquidity is added. The goal is to get in as early as possible — ideally within the same block as the liquidity event — before the broader market notices the token.

Maestro's sniper is one of the most widely used in the Telegram bot ecosystem. It supports multiple chains and lets you configure buy amount, slippage tolerance, and gas settings before you activate it.

The setup process is quick:

- Open the Maestro referral link in Telegram
- Press Start
- Referral code r-bay_mach attaches automatically
- Create a wallet or import one
- Deposit funds
- Select the sniper feature and configure your settings
- Paste the token contract address and activate

## Slippage settings

Slippage is the percentage of price movement you are willing to accept between the time you submit your transaction and the time it executes. On new tokens, prices can move 50% or more within seconds. If your slippage is set too low, your transaction will fail. If it is set too high, you will overpay.

For most new tokens, a slippage setting between 10% and 30% is common. Tokens with very low liquidity may require higher slippage to get your transaction through. Tokens with deeper liquidity can be sniped with lower slippage.

The trade-off is straightforward: higher slippage means a higher chance of execution but a worse entry price. Lower slippage means a better entry price but a higher chance of failure.

## Gas settings

Gas determines how quickly your transaction is processed. On Ethereum, higher gas prioritises your transaction and gets it included in the next block. On Solana, the priority fee serves the same function.

For sniping, you generally want to set gas higher than the network average. If you set it too low, your transaction will be pending while other traders get in ahead of you. If you set it appropriately, you have a chance of being in the same block as the liquidity event.

Maestro lets you adjust gas manually. Check the current network gas price before you activate the sniper and set your gas above it. The exact amount depends on how competitive the launch is.

## Anti-MEV considerations

MEV (Maximal Extractable Value) refers to the practice of reordering transactions within a block to extract profit. In the context of sniping, MEV bots can front-run your buy transaction, purchasing the token before you do and selling it back to you at a higher price.

Maestro includes anti-MEV settings that attempt to reduce your exposure. These settings typically route your transaction through private mempools or use other techniques to hide it from front-running bots.

Anti-MEV is not a guarantee. Determined MEV searchers can still find ways to front-run transactions, especially on highly competitive launches. The settings reduce your exposure but do not eliminate it.

## Risks of sniping

Sniper bots are high-risk tools:

- New tokens are the highest-risk category in crypto, and a large share end in a rug pull
- You are competing against other snipers and MEV bots with faster infrastructure
- Failed transactions still cost gas fees
- The token you snipe may have no liquidity to sell back into

Use the referral code r-bay_mach for a 10% fee discount, but remember that fees are the least of your concerns when sniping. The real risk is buying a token that goes to zero.

## Frequently asked questions

### What slippage should I set for sniping?

Between 10% and 30% is common for most new tokens. Low-liquidity tokens may require higher slippage. The higher the slippage, the better your chance of execution but the worse your entry price.

### Can I avoid MEV entirely?

No. Anti-MEV settings reduce your exposure but do not eliminate it. On highly competitive launches, MEV bots can still front-run your transaction.

### Is r-bay_mach active?

Yes, the code is active and applies a 10% fee discount to new accounts.