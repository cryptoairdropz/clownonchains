Rollups scale Ethereum by executing transactions off-chain and settling the results on the main chain. The two dominant approaches — optimistic and zero-knowledge — differ in how they prove correctness, and those differences shape user experience, cost, and security.

Optimistic rollups operate on a principle of trust with a safety net. They assume all posted transactions are valid by default. Anyone can challenge a fraudulent transaction during a challenge period, typically lasting several days. If a challenge succeeds, the fraudulent state is reverted and the submitter is penalized. ZK rollups, by contrast, use cryptographic validity proofs. Every batch of transactions comes with a mathematical proof that the state transition is correct. The proof is verified on-chain before the batch is accepted. There is no need to assume honesty; the math guarantees it.

## What this means for users

The most visible difference is withdrawal time. On optimistic rollups, withdrawing to Layer 1 requires waiting out the challenge period so that anyone can dispute an invalid state. This delay can last several days. ZK rollups finalize almost immediately because the validity proof replaces the challenge period. For users who want to move assets between chains quickly, this difference is decisive. This also affects capital efficiency — funds locked in the challenge period cannot be used elsewhere, which represents an opportunity cost that is often overlooked when comparing the two models.

## Cost and complexity trade-offs

Optimistic rollups are computationally simpler and cheaper to operate because they do not generate validity proofs for every batch. ZK rollups invest heavily in proving infrastructure, which historically made them more expensive, though advances in proving systems have narrowed the gap significantly. The cost of generating a validity proof depends on the complexity of the computation being proven, which means simple transfers are cheaper to prove than complex smart contract interactions. As proving hardware and algorithms improve, the cost advantage of optimistic rollups continues to erode.

## Smart contract compatibility

Early optimistic rollups offered near-complete equivalence with Ethereum's existing smart contract environment, making migration straightforward for developers. ZK rollups initially struggled with compatibility because generating proofs for arbitrary computation is more constrained. Newer ZK systems have largely closed this gap, supporting general-purpose smart contracts with similar functionality. The remaining differences are in gas costs and the complexity of porting highly optimized contracts. For developers, the choice between the two models often comes down to whether they prioritize migration speed or long-term cost efficiency.

## Security models

- Optimistic rollups rely on at least one honest validator watching the chain and submitting fraud proofs during the challenge window.
- ZK rollups rely on cryptographic assumptions: if the proof verifies, the state is correct. No honest watcher is required for security.
- Both inherit Ethereum's security for data availability and final settlement.

## Which is better

There is no universal winner. ZK rollups offer faster finality and stronger cryptographic guarantees. Optimistic rollups offer lower operational complexity and easier developer migration. For applications where fast withdrawal matters, ZK systems have the edge. For complex DeFi protocols requiring maximum compatibility, optimistic systems may still be preferable. The choice depends on the specific use case and the trade-offs each application is willing to make.

## Frequently asked questions

### Can optimistic rollups reduce their challenge period?

Some designs use additional proof systems or decentralized validator sets to shorten the challenge window. However, the security model fundamentally requires a window long enough for an honest party to detect and challenge fraud. Reducing it too much weakens the security guarantee.

### Do ZK rollups completely eliminate trust assumptions?

They eliminate the need for an honest watcher, but users must trust the correctness of the proof system implementation and the cryptographic assumptions it relies on. Bugs in the proving software or circuit could allow invalid states to be accepted.

### Why do both types of rollup still need to post data to Ethereum?

Both must make transaction data available on the main chain so that users can reconstruct the state and withdraw their funds if the sequencer goes offline. Data availability is the shared foundation that lets either model inherit Ethereum's security.