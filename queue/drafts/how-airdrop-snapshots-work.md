When a project announces an airdrop, the question every participant asks is: what exactly gets recorded, and when? The answer lies in the snapshot mechanism, a single moment in time that determines who receives tokens and how many. Understanding how snapshots work helps you plan your participation and avoid common mistakes that cost people their allocation.

## What a snapshot actually records

A snapshot is a record of blockchain state at a specific block height. When a project takes a snapshot, it captures the balance of every eligible address at that exact moment. The record includes the address, the token balance, and any other criteria the project has defined, such as liquidity provision, protocol interaction, or NFT holdings. Once the snapshot is taken, the blockchain continues producing blocks, but the airdrop eligibility is frozen at that earlier state. The data is immutable and cannot be altered by anyone, including the project team.

## How the snapshot block is chosen

Projects typically announce a snapshot date and time in advance, but the exact block height is often not revealed until after the fact. This prevents participants from making last-minute transfers to manipulate their eligibility. The block is determined by the timestamp of the announcement, and the project's infrastructure reads the chain state at that height. Some projects use a randomized block within a window to further discourage gaming. Others take multiple snapshots over a period and average the balances, which rewards consistent holders rather than those who buy in at the last moment.

## What happens after the snapshot

After the snapshot is taken, the project analyzes the recorded addresses against its eligibility criteria. This analysis can take days or weeks, depending on the complexity of the rules. The project then publishes a claim page or distributes tokens directly to qualifying addresses. The snapshot itself is immutable — no transaction after the snapshot block can change the recorded balances. If you bought tokens after the snapshot, you are not eligible. If you sold before the snapshot, you are not eligible. The only balances that matter are those at the snapshot block.

## How to verify your eligibility

Most projects provide a checker tool where you can enter your address to see if you qualify. Some publish the full list of eligible addresses as a downloadable file. The verification relies on the same snapshot data, so the result is deterministic. If you believe you qualify but do not appear, the issue is usually that your address did not meet the criteria at the snapshot block, not that the data was lost. Double-check the criteria: some snapshots require a minimum balance, others exclude certain address types, and some only count specific token pairs or staking positions.

- Snapshot records balances at a specific block height
- The exact block is often hidden until after the snapshot
- Eligibility is frozen at the moment of the snapshot
- Verification tools use the same immutable data
- Multiple snapshots may be averaged to reward consistent holders

## Frequently asked questions

### Can I move tokens after the snapshot and still qualify?

Yes. The snapshot records your balance at a specific block. Any transactions after that block do not affect your eligibility. However, if the project takes multiple snapshots or uses a weighted average, moving tokens between snapshots could affect your allocation. The safest approach is to maintain your position until the project confirms the snapshot is complete.

### What if I held tokens on an exchange during the snapshot?

It depends on the project's criteria. Some snapshots only count self-custodied wallets, while others include exchange addresses. If the snapshot includes exchange wallets, the exchange decides whether to pass the airdrop to users. Many exchanges do not support airdrops, so holding in a self-custodied wallet is generally safer. Check the project's announcement for details on which address types are eligible.

### How do I know which block was the snapshot block?

Projects usually announce the snapshot block height after the fact. You can verify it by checking the block explorer for that chain at the announced time. Some projects also publish a transaction or contract call that marks the snapshot, making it easy to identify. If the project does not publish the block height, you can estimate it by looking at the block timestamp closest to the announced snapshot time.
