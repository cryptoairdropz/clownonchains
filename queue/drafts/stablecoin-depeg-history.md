A stablecoin's promise is simple: one unit equals one unit of its reference asset. History shows that promise can break under stress, sometimes catastrophically, and the mechanisms designed to maintain the peg can accelerate its collapse instead.

Stablecoins maintain their peg through a combination of collateral, algorithms, and market incentives. When confidence erodes, arbitrageurs who normally correct small deviations stop intervening. The peg breaks, and the mechanism that was supposed to restore it can accelerate the collapse instead. Understanding how this happens requires examining the major depeg events of recent years and the structural weaknesses they exposed.

## The UST collapse as a case study

TerraUSD, an algorithmic stablecoin, maintained its peg through a mint-and-burn relationship with its sister token LUNA. When large withdrawals from its primary lending protocol drained reserves, the arbitrage mechanism could not absorb the selling pressure. As LUNA's price fell, minting more LUNA to redeem UST further diluted its value, creating a death spiral. The peg broke, and both tokens lost nearly all their value within days. This event demonstrated that algorithmic designs relying on reflexive token relationships can fail catastrophically when tested by real market stress. The speed of the collapse — from a stable peg to near-zero in less than a week — shocked even experienced market participants.

## Other notable depeg events

- DAI briefly traded below its dollar peg during extreme market volatility, prompting its issuer to add more diverse collateral types and increase the collateral ratio.
- USDT has traded at slight discounts during periods of banking uncertainty, though it has always recovered within days.
- Several smaller algorithmic stablecoins failed entirely after losing their peg during market downturns, wiping out user funds permanently.

## Why algorithmic designs are fragile

Fiat-backed stablecoins hold reserves in cash, treasuries, or other liquid assets. Algorithmic stablecoins rely on incentive mechanisms without full collateral backing. When market sentiment turns, the incentive structure that normally enforces the peg can work in reverse. Confidence is the real collateral, and once it is gone, no amount of code can restore it. The UST collapse showed that even a system with billions in market cap can disintegrate when the reflexive mechanism runs in reverse. The key vulnerability is that algorithmic designs require continuous growth or at least stability to maintain the peg — any sustained selling pressure can trigger a feedback loop that is nearly impossible to stop.

## What has changed since

Regulators in major jurisdictions now require stablecoin issuers to disclose reserve composition and undergo regular audits. Newer designs favor over-collateralization with on-chain assets and circuit-breakers that pause redemptions under extreme conditions. Transparency has increased, but the fundamental risk remains: any design that depends on market confidence can fail if that confidence evaporates. Some issuers now publish real-time reserve attestations, and insurance funds have been established to provide additional buffers. However, these measures address symptoms rather than the underlying structural fragility of under-collateralized designs.

## Lessons for users

- Not all stablecoins carry the same risk. Asset-backed coins with audited reserves are structurally different from algorithmic ones.
- Diversification across multiple stablecoins reduces exposure to any single failure.
- During market stress, even the most trusted stablecoins can trade at temporary discounts.
- Check whether an issuer publishes regular attestations and what assets back the token.

## Frequently asked questions

### Why did UST fail while USDT did not?

UST relied on an uncollateralized algorithmic mechanism. USDT holds reserve assets that can be redeemed for dollars. When confidence collapsed, UST had no external value to fall back on, while USDT could meet redemptions from its reserves.

### Can a fiat-backed stablecoin also depeg?

Yes, though typically for shorter durations. If an issuer cannot meet redemption demands or if its reserves are illiquid, the market can lose confidence. The depeg is usually temporary if the issuer eventually honors redemptions, but it can become permanent if reserves are insufficient.

### What is over-collateralization and why does it help?

Over-collateralization means the value of assets backing a stablecoin exceeds the stablecoin's circulating supply. This buffer absorbs price volatility in the collateral without immediately threatening the peg. MakerDAO's DAI maintains a collateral ratio well above one hundred percent to withstand market swings.