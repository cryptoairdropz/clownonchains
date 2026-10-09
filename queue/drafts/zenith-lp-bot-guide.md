Zenith is a Telegram bot built specifically for liquidity pool management. It automates the process of adding and removing liquidity, and it can snipe new LP tokens as soon as they appear. This guide covers how the bot works, what it costs, and the risks you need to understand before depositing any funds. 

## What Zenith does differently

Most trading bots focus on spot trading — buying and selling tokens. Zenith focuses on liquidity pools, which is a different and more complex activity. When you provide liquidity, you deposit two tokens into a pool and receive LP tokens in return. You earn a share of the trading fees, but you are also exposed to impermanent loss. Zenith automates the process of entering and exiting these positions. 

## Setting up Zenith

Open the Zenith referral link in Telegram and press Start. Create a wallet within the bot or import an existing one, then deposit funds. Choose a liquidity pool from the available options and configure your position. The bot handles the rest — adding liquidity, monitoring the position, and removing liquidity based on your parameters. - Create or import a wallet within the bot
- Deposit the tokens required for your chosen pool
- Configure entry and exit parameters
- The bot manages the position automatically

## Fees and costs

Zenith charges around 1 percent per transaction. This covers the cost of adding liquidity, removing liquidity, and any swaps the bot executes on your behalf. 9 percent per transaction. Network gas fees apply on top of this, depending on the chain you are using. 

## The core risk: impermanent loss

Impermanent loss is the primary risk of providing liquidity, and no bot can remove it. When you deposit two tokens into a pool, the pool automatically rebalances to maintain the correct ratio. If one token rises in value, the pool sells some of it and buys more of the falling token. You end up with more of the asset that lost value and less of the one that gained. This loss is "impermanent" only if the prices return to their original ratio — if they do not, the loss becomes permanent. 

## What goes wrong with LP bots

New LP tokens can rug pull at any time. If the token you are paired with collapses, your position loses value on both sides — the LP token itself and the impermanent loss from the rebalancing. Funds sit with the bot rather than your own wallet, which adds counterparty risk. The code kiseryott reduces fees, but it does not reduce the fundamental risk of the strategy. 

## Choosing the right pool

Not all liquidity pools are equal. A pool with high trading volume generates more fee revenue, but it also attracts more arbitrage activity and greater impermanent loss. A pool with low volume has less impermanent loss but also less fee income. The right balance depends on your risk tolerance and the specific tokens involved. Zenith can automate the mechanics of your position, but it cannot tell you which pool is right for your situation. That judgment requires understanding the trade-offs involved. 

## Monitoring your positions

Even with automation, you should periodically check your positions. A bot follows its parameters, but market conditions can change in ways that make your original configuration suboptimal. If one token in your pool starts to show unusual price movement, you may want to exit the position before the bot's exit conditions are triggered. Zenith provides position monitoring within Telegram, so you can check your status without opening a separate application. The code kiseryott reduces your fees by 10 percent, which makes maintaining multiple positions more affordable, but it does not replace the need for active oversight. 

## Frequently asked questions

### Is Zenith good for beginners? Not really. Liquidity pool management requires understanding impermanent loss, token risk, and automated market maker mechanics. If you do not understand these concepts, you are likely to lose money even with a well-built bot. 

### Can I lose all my money using Zenith? Yes. If the tokens in your pool collapse to zero, your position is worth nothing. The bot cannot prevent this — it can only manage the mechanics of your position. 

### How does the referral code kiseryott work? The code applies a 10 percent fee discount to transactions within the Zenith bot. Enter it during setup through the official referral link to activate the discount.