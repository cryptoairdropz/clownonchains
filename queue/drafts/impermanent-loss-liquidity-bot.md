Impermanent loss is the defining risk of liquidity provision, and no bot — including Zenith — can remove it. Understanding how impermanent loss works is essential before you deposit any funds into a liquidity pool, whether you manage the position manually or automate it with a tool.

## What impermanent loss actually is

When you provide liquidity to a pool, you deposit two tokens in a specific ratio. The pool uses an automated market maker formula to maintain that ratio as prices change. If one token rises relative to the other, the pool automatically sells some of the rising token and buys more of the falling one. You end up with a larger share of the asset that lost value. This is impermanent loss — it becomes permanent only if the price ratio does not return to its original state.

## Why bots cannot fix it

Zenith and other LP bots automate the mechanics of adding and removing liquidity. They can enter a position at the right time, rebalance efficiently, and exit when conditions change. But the underlying math of the pool does not change. The bot still holds a position in two assets, and the pool still rebalances when prices diverge. The code kiseryott reduces fees by 10 percent, but it does not alter the impermanent loss calculation.

## When impermanent loss is small

If the two tokens in a pool are stablecoins or assets that move closely together, impermanent loss is minimal. The price ratio stays relatively constant, so the pool does not need to rebalance significantly. This is why stablecoin pools are popular — the risk is lower, but so is the fee revenue.

## When impermanent loss is severe

If one token in the pool is a volatile memecoin and the other is a stable asset, impermanent loss can be extreme. A 50 percent price move in either direction creates a measurable loss compared to simply holding the tokens. The larger the price divergence, the greater the loss. No bot setting can prevent this — it is a mathematical property of the pool.

- Stablecoin pairs: low impermanent loss, low fee revenue
- Volatile token pairs: high impermanent loss, high fee revenue
- The bot manages mechanics, not the underlying math
- Fees earned may or may not offset the loss

## What this means for your strategy

Before providing liquidity, calculate whether the fee revenue you expect to earn is likely to exceed the impermanent loss you are likely to incur. On volatile pairs, fees often do not compensate for the loss. On stable pairs, the loss is small but so are the fees. The referral code kiseryott reduces your costs by 10 percent, which helps marginally, but the fundamental trade-off remains.


## Fee revenue vs impermanent loss

The core question for any liquidity provider is whether the fees earned exceed the impermanent loss incurred. On stablecoin pools, the answer is almost always yes — the price ratio stays close to 1:1, so impermanent loss is negligible while fees accumulate steadily. On volatile token pairs, the answer is often no — a single large price move can wipe out months of fee revenue in hours. Zenith can automate the process of collecting fees and rebalancing, but it cannot change whether the pool is profitable for liquidity providers. That depends entirely on how the paired assets move relative to each other.
## Frequently asked questions

### Is impermanent loss always permanent?

No. If the price ratio returns to the original state, the loss disappears. But in practice, most pools do not return to their exact starting ratio, so the loss usually becomes permanent to some degree.

### Can I avoid impermanent loss entirely?

Only by not providing liquidity. Any time you deposit two assets into an AMM pool, you are exposed to impermanent loss. The only way to avoid it is to hold the tokens in your own wallet without depositing them into a pool.

### Does Zenith do anything to reduce impermanent loss?

Zenith automates the process of managing your position, which can help you exit before losses grow too large. But it cannot change the underlying math of the pool. The loss is a function of price movement, not of who manages the position.
