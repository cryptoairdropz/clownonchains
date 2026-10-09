When you submit a transaction to Ethereum, you expect it to execute when you send it. In reality, the ordering of transactions in a block can be rearranged by those who produce blocks, and that rearrangement can extract value at your expense. This extracted value is called maximal extractable value, formerly known as miner extractable value.

MEV arises because block producers — validators in Ethereum's proof-of-stake system — can choose which transactions to include and in what order. They are not obligated to process transactions in the order they arrive. This flexibility creates opportunities for sophisticated participants to profit by reordering, inserting, or censoring transactions.

## Common MEV strategies

- Front-running: A searcher sees your pending trade, submits their own transaction with a higher gas fee to execute before yours, and profits from the price movement your trade causes.
- Back-running: A searcher places their transaction immediately after yours to capture the price impact your trade creates.
- Sandwich attacks: The combination of front-running and back-running, where the attacker places one transaction before and one after yours, extracting the price difference from both sides.
- Liquidations: Searchers monitor lending protocols and race to liquidate undercollateralized loans, earning a bonus for doing so.

## Who captures MEV

Block producers capture MEV indirectly by accepting bundles of transactions from searchers who bid for inclusion. Searchers are sophisticated actors — often trading firms or dedicated MEV teams — who run complex algorithms to detect profitable ordering opportunities. They pay block producers a share of their profits for guaranteed inclusion. This creates a two-tier system where those with the best algorithms and the fastest infrastructure capture the most value, while ordinary users bear the cost through worse execution prices.

## What this means for everyday users

The most visible impact is higher effective execution costs. Sandwich attacks worsen the price you receive on a swap. Front-running makes it harder to buy a token at the expected price during high-demand moments. These costs are often hidden — you see a worse execution price but may not realize an MEV strategy caused it. Over time, these hidden costs can significantly erode returns, especially for frequent traders or those executing larger orders.

## Mitigation approaches

- Private transaction pools and relays let users submit transactions directly to block producers without exposing them to the public mempool, reducing sandwich opportunities.
- Batch auctions, used by some decentralized exchanges, clear all trades at the same price within a block, eliminating the ordering advantage.
- Encrypted mempools aim to hide transaction contents until they are included, preventing searchers from targeting specific orders.
- Protocol-level changes like proposer-builder separation aim to make MEV extraction more transparent and equitable.

## The scale of the problem

MEV is not a minor annoyance. Studies have shown that a significant portion of block value on Ethereum comes from MEV rather than simple transaction fees. It is an inherent feature of any system where a central party controls transaction ordering, and fully eliminating it remains an open research problem. The ongoing development of mitigation strategies suggests that the ecosystem recognizes the seriousness of the issue, but a complete solution has yet to emerge.

## Frequently asked questions

### Is MEV unique to Ethereum?

No. Any blockchain where a single party or small group can reorder transactions is susceptible. Solana, Binance Smart Chain, and other networks all exhibit MEV, though the specific strategies differ based on each chain's design.

### Can I protect my transactions from MEV?

Using private transaction relays or decentralized exchanges that employ batch auctions reduces exposure. Setting slippage limits prevents sandwich attacks from executing at extreme prices. However, complete protection is difficult without protocol-level changes.

### Does MEV harm the blockchain itself?

MEV creates centralization pressure. Validators who can extract more MEV earn higher rewards, which can lead to consolidation among block producers. It also degrades user experience by making execution costs less predictable, which can drive activity to alternative networks.