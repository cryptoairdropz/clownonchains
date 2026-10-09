Ethereum mainnet fees rise and fall with network congestion. Layer 2 networks promise cheaper transactions by processing them off the main chain, but not all Layer 2s deliver the same cost savings, and the differences can be substantial.

Layer 2 solutions batch many transactions together and post compressed data or proofs back to Ethereum. This shared security model means users pay a fraction of the mainnet fee. The exact amount depends on the network's design, its current adoption, and the type of transaction. Understanding these factors helps you choose the right network for a given operation.

## Why fees vary so much between Layer 2s

- ZK rollups generate cryptographic proofs of validity and post them on-chain. Proof generation is computationally expensive, so costs can be higher than optimistic systems, though falling as proving technology improves.
- Optimistic rollups assume transactions are valid and only compute in case of disputes. They are cheaper for routine operations but have higher withdrawal delays.
- Networks with smaller user bases often have lower fees simply because they compete for activity. As adoption grows, so do fees.
- Data availability solutions matter. Networks that post full transaction data on-chain pay more than those that use cheaper off-chain data availability.

## What transaction type costs most

Simple token transfers are the cheapest operation on any Layer 2. Smart contract interactions, especially those requiring multiple storage writes, cost more. Bridge deposits and withdrawals between Layer 1 and Layer 2 often carry a fixed component that dominates for small amounts. Swaps on decentralized exchanges fall in between. Complex DeFi operations that involve multiple contract calls can cost several times more than a simple transfer. The variation between networks for the same operation can be significant — a swap that costs a fraction of a cent on one network may cost several cents on another, depending on the underlying architecture and current demand.

## The withdrawal trade-off

Optimistic rollups require a challenge period before withdrawals to Layer 1, typically lasting several days. During this window, your funds are locked. ZK rollups finalize faster but may still have withdrawal delays for other reasons. Some networks offer third-party bridges that provide instant withdrawals for a fee. This means the cheapest execution network may not be the cheapest end-to-end if you need to move assets back to mainnet quickly. Users who frequently move assets between Layer 1 and Layer 2 should factor in both the execution cost and the withdrawal cost when choosing a network.

## How to compare fees in practice

- Check current estimates on each network's block explorer or bridge interface before transacting.
- Consider the total cost including the bridge fee from mainnet, not just the execution fee on Layer 2.
- For very small transactions, the fixed withdrawal cost can exceed the value transferred, making Layer 2 uneconomical.
- Monitor network activity. During NFT mints or popular airdrop claims, even Layer 2 fees spike temporarily.

## The future of Layer 2 fees

As Layer 2 technology matures, fees are expected to continue declining. Advances in ZK proving systems, data compression techniques, and shared sequencing protocols all contribute to lower costs. However, increased adoption can offset these gains — as more users flock to Layer 2, demand for block space rises, and fees increase accordingly. The networks that manage to scale efficiently while keeping fees low will likely attract the most users, creating a competitive dynamic that benefits the ecosystem as a whole.

## Frequently asked questions

### Are ZK rollups always more expensive than optimistic rollups?

Not necessarily. While proof generation adds cost, ZK rollups post less data on-chain and finalize faster. As proving technology matures, the gap has narrowed significantly, and some ZK networks now undercut optimistic ones for simple transfers.

### Why do fees spike on Layer 2 during popular events?

Layer 2 networks have finite throughput. When demand exceeds capacity, the fee market on the Layer 2 itself activates. Validators or sequencers prioritize higher-paying transactions, pushing costs up until demand subsides.

### Is it worth using Layer 2 for a single small transaction?

Often not. If you need to bridge from mainnet and back, the combined bridge and withdrawal costs can exceed mainnet fees for that single transaction. Layer 2s make most sense when you plan multiple transactions or recurring activity.