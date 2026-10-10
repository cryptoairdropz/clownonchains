#!/usr/bin/env python3
"""
rewrite_legacy_tutorials.py — bring the 13 original tutorials (ids 1-13) up to
the same standard as the 12 newer ones.

The originals are 166-236 words with no FAQ and few bullets. Thin content on a
page that is otherwise well-optimised drags down the site's quality signal, and
these are the oldest pages so they carry the most internal-link equity.

Each replacement:
  - 700-900 words
  - 5-7 paragraphs separated by blank lines
  - 5-7 '## ' subheadings
  - at least one '- ' bulleted list
  - ends with '## Frequently asked questions' + three '### Question?' blocks
  - English only, no hype, no emoji, no invented figures

Bodies are stored in data.js as double-quoted JS strings, so each body is
JSON-encoded before insertion (JSON string escaping is a subset of JS string
escaping).

  python3 rewrite_legacy_tutorials.py --dry-run
  python3 rewrite_legacy_tutorials.py
"""
import argparse
import json
import os
import re
import subprocess

ROOT = os.path.dirname(os.path.abspath(__file__))
DATA = os.path.join(ROOT, "data.js")

BODIES = {
1: """Every transaction on a blockchain goes into a shared list, and that list is what makes the network work. Understanding three things about it explains most of the confusion people have with crypto: what a block is, why fees exist, and why price moves.

None of this requires technical background. It requires knowing what problem each mechanism solves.

## Transactions are signed, not sent

A transaction is not an instruction you give a bank. It is a signed message that says: I hold this key, I authorise this transfer, and here is the nonce so it can only be applied once.

The signature is what makes it irreversible. Once a transaction is included in a block, there is no support line to call and no administrator to reverse it. That is the trade-off for not needing one.

## Blocks batch transactions

Every few seconds or so, transactions are gathered into a block. Each block references the one before it, forming a chain.

Every node in the network keeps a copy of that chain and independently checks the work. That is the security model, not a side effect of it. There is no single company that decides what is true.

## Fees are an auction for space

Block space is limited by design. Only so many transactions fit into a block, so blockspace is scarce, and fees are how bidders compete for it.

This produces something unintuitive: fees spike during busy periods because more people want in, not because anything changed about your transaction. A transfer that costs cents at 3am can cost several dollars at peak hours for exactly the same work.

## Why price moves

Price moves because orders meet. When more people want to buy than sell at the current price, the price rises. That mechanism is the same as any other market, and the blockchain does not change it.

What the blockchain changes is the settlement layer. There is no clearing house and no counterparty deciding who owns what, which removes a category of risk that exists in traditional markets and introduces a different category in its place.

## Reading a block explorer

A block explorer shows every transaction publicly. For your own transfers, it confirms the transaction was included, shows the fee you actually paid, and gives you a permanent receipt that does not depend on any company's database.

This transparency is genuinely useful. It is also the reason a mistaken transfer cannot be reversed by anyone, including the recipient.

## What this means in practice

Understand these mechanics and two practical habits follow. First, time transactions when the network is quiet if the fee matters to you. Second, verify the destination address before signing, because the transaction is final the moment it is confirmed.

Neither habit is about being clever with technology. Both are about knowing what the system does before asking it to do something irreversible.

## What this changes about trusting a chain

The absence of an administrator is the point. It also means nobody can reverse a mistake, which is why people describe the trade-off as trust displaced rather than trust removed: you are trusting the protocol's correctness instead of an institution's policy.

For most users the practical implication is narrow. Transfers are final, so verification before signing is the entire safety story. Understanding the fee mechanism is what stops you from overpaying for the same work.

## The mental model that helps

Think of a blockchain as a shared, append-only notebook that anyone can read and nobody can quietly edit. Signatures are the only way to add an entry. Consensus is how the network agrees on which version of the notebook is real.

Every surprising behaviour follows from those three properties, and once they are intuitive the specifics stop being confusing.

## A practical consequence

Because fees are congestion-driven rather than size-driven, the reliable saving is timing:

- Check a gas chart before interacting
- Interact overnight or at weekends when global activity is lowest
- Set a modest priority fee rather than an inflated cap

## Frequently asked questions

### Why do I pay a fee if the network is free to run?

The fee buys block space, which is limited. Nodes are not charging for the service in the sense of covering costs; the fee is a way of deciding whose transaction gets included when more people want in than fit. Once there is spare capacity, fees fall.

### Can a transaction be reversed or cancelled?

Once it is confirmed in a block, no. There is no administrator and no support line for a public blockchain. That is why checking the destination address before signing matters more than any fee optimisation.

### Why did my transaction cost more than I expected?

Fees are set by congestion at the time of inclusion, not by the size of your transaction alone. The same transfer costs more during busy periods. Timing is usually the whole explanation.""" ,

2: """A wallet is the single most common point of failure in crypto, and almost every avoidable loss traces back to a setup mistake rather than a sophisticated attack.

The goal of this guide is a wallet setup you will not have to redo, and that an attacker cannot reach.

## Pick the wallet type that matches the use

There are three broad categories, and choosing the wrong one creates friction that leads to mistakes.

Custodial wallets are held by an exchange. Convenient, and the exchange controls the keys. Fine for small working balances, wrong for anything you intend to hold.

Self-custody wallets hold keys on your device. You control the funds, and you are fully responsible for the backup.

Hardware wallets keep keys isolated on a dedicated device. They exist so that a compromised computer cannot extract the key even if you sign a malicious transaction.

Choose by balance and holding period, not by feature list.

## Install from the official source

The most common way a wallet is compromised is not a flaw in the wallet. It is a fake download, a browser extension impersonating it, or a phishing site that copies the interface exactly.

Get the application or extension from the wallet's own site. Bookmark that site once and use the bookmark thereafter, rather than searching for the wallet each time you need it.

## Write the backup down and verify it

The recovery phrase is the master key. Whoever has it controls the funds, and there is no recovery process if it is lost or exposed.

- Write it on paper or metal, never in a cloud note, a screenshot, or a message to yourself.
- Store two copies in separate physical locations.
- Verify a restore before depositing anything meaningful.

Verifying means restoring into a fresh wallet and confirming the addresses match. A backup that has never been tested is not a backup.

## Check what you are signing

Modern wallets show a human-readable summary of what a transaction does. Read it.

If a transaction requests unlimited token approval, treat that as a significant risk rather than a formality. Approving a malicious contract is the most common way funds are drained, and it requires no seed phrase at any point.

## Security settings that matter

Enable two-factor authentication on any custodial account. Use an authenticator app rather than SMS, which is vulnerable to SIM swapping. Use a unique password stored in a password manager, never reused elsewhere.

Bookmark the official domain and verify it every time you log in. Phishing clones look convincing and persist in search results for weeks.

## A working routine

Check the balance before doing anything. Confirm the destination address. Sign, then verify the transaction on a block explorer. Withdraw long-term holdings off the trading platform into a wallet you control.

That routine takes minutes and removes nearly all of the avoidable risk.

## Test the recovery before it matters

The one habit that separates people who recover a wallet from people who lose funds is a restore test done while there is nothing at stake.

Restore the phrase into a separate wallet, confirm the addresses match, and delete that test wallet. Ten minutes now establishes that your backup works, which removes an entire category of future problem.

## A note on hardware wallets

A hardware wallet does not protect you from phishing, because you still have to approve what the screen shows. It protects the key from being extracted by malware. It is one layer in a routine, not a replacement for one.

## What the categories actually mean

Custodial means someone else holds the keys and you hold a claim. Self-custodial means the keys are on your device and nobody else can move the funds. Hardware-isolated means the key never leaves a dedicated device, so malware on your computer cannot read it even if you sign something malicious.

These are three different trust models, and the confusion between them is why people think a software wallet is as safe as a hardware one.

## Frequently asked questions

### Do I need a hardware wallet?

For small balances, a well-configured software wallet is fine. It becomes worth it once the balance would hurt to lose, or once you hold assets long term. The threshold is not a rule, it is your own tolerance.

### What happens if I lose the recovery phrase?

The funds are gone. There is no support process, no reversal, and no way to prove ownership to anyone. This is why verifying a restore from the backup before depositing is worth the ten minutes it takes.

### Is it safe to use a wallet on my phone?

It is reasonable, with the usual phone security: a device lock, updated software, and no sideloaded applications. The bigger risk is usually phishing rather than the device itself, so treat unexpected links asking you to connect as hostile.""" ,

3: """An airdrop is a distribution of free tokens to wallet addresses, usually to reward people who used a project before it had a token. The mechanics are simple; the judgement involved is not.

Here is what actually happens, and where people waste money.

## What an airdrop is

A project reserves a portion of its token supply for early users. At a snapshot, it reads on-chain history and records which addresses showed activity, then distributes tokens based on that record.

The best-known examples rewarded wallets that had used a protocol for months before any announcement was made. That is the pattern: the reward follows genuine use, not a single transaction made after the project started paying attention.

## Nothing is free at the start

The tokens may be free, but qualifying is not. Every interaction costs gas, and most farms pay nothing.

Treat each farm as a small bet with a budget rather than a free opportunity. The useful question is not whether an airdrop is free, but what the total gas cost is if nothing arrives.

## How projects choose recipients

Allocation methods vary, but the common signals are recognisable:

- Time spent, measured across months rather than days
- Variety of actions, rather than many identical ones
- Self-custody, and a visible history of interacting with the protocol directly
- Absence of links between the wallets you control

Sybil filters are specifically built to catch the second pattern. A single wallet doing varied things over months reads very differently from fifty wallets running the same script.

## What usually goes wrong

Doing everything on a testnet when only mainnet activity counts, or claiming the distribution is guaranteed when the project has not announced a token at all.

A points programme is not an allocation. A testnet is not the mainnet. A project that has never announced a token may never distribute one, and the tokens can sit unreleased indefinitely.

## A sensible approach

Pick the projects you would actually use, spend modest gas on sustained activity, and keep a record of what you did and what it cost.

That last part matters more than people expect. After a few months you will know your true cost per airdrop, which is the only number that lets you decide whether continuing is worth it.

## What the announcement actually tells you

When a project announces its token, it also usually publishes the allocation criteria. That is the moment to compare against what you did, and it is the moment to accept that some farming was wasted.

Allocations are rarely proportional to effort. A wallet with modest, sustained activity often receives more than a wallet with one large transaction, because the latter is indistinguishable from a bot.

## Keeping records

Write down the wallet, the protocol, the actions, the date, and the gas cost. This takes seconds at the time and is only possible later if you have kept it.

After a few months that record answers the only question that matters: what did each airdrop actually cost you, and what did it return. Without it, every farm feels equally worthwhile because none of them have a number attached.

## The one-wallet rule

Multiple wallets are the single clearest automation signal. Projects running sybil detection have seen every script farm ever built, and they weight accordingly.

If you already have several wallets, consolidating activity into one and letting the history build is usually worth more than continuing to spread.

## Frequently asked questions

### Are airdrops really free?

The tokens usually are. Qualifying is not: every interaction costs gas, and most farms distribute nothing. The useful calculation is total gas spent divided by what you received, which is why tracking costs matters.

### Do I need multiple wallets?

No, and running several is often a negative signal. Projects filter for patterns that automation produces, so many wallets doing identical actions reads worse than one wallet doing varied things over time.

### Can a project take away an airdrop after I qualify?

Yes. Finality is typically not guaranteed until the claim period closes, and some projects screen out recipients after the snapshot. Qualifying is a claim, not a guarantee.""" ,

4: """Crypto scams run on urgency rather than technology. The mechanisms change; the emotional hook does not. Knowing the specific patterns is far more effective than knowing to be generally careful.

Most people who lose money to a crypto scam are not being technically deceived. They are being rushed.

## The DM that looks like support

The most common pattern in 2026 is someone contacting you first, claiming to be from a project, an exchange, or a wallet team.

- Real support never initiates contact through Telegram or Discord DMs.
- They link to a "verification portal" that copies the real interface.
- They ask you to connect your wallet and "verify" or "sync" it.

Connecting a wallet to a lookalike site is frequently enough. A malicious contract or a token approval can move funds without a seed phrase ever being involved.

## The seed phrase request

No legitimate support agent, project, or exchange will ever ask for your recovery phrase. Not over chat, not on a form, not to "help you recover" anything.

A conversation that leads to being asked for those words is a scam from the first message. There is no recovery path where they are required.

## The airdrop that arrives as a message

Legitimate airdrops appear in the wallet that qualifies for them. They never arrive as a direct message offering a claim link.

Any message claiming to deliver tokens is an attempt to get you to connect and sign. Eligibility checks are read-only; any site asking you to sign to "claim" is the giveaway.

## The guaranteed-return pitch

A scheme promising a fixed, high, reliable return has no mechanism behind it. Someone is paying that return, and if it is not an identifiable borrower, it is the next person to deposit.

The same logic applies to the plausible middle: high but variable APY paid in a token whose price depends on new deposits continuing.

## Practical rules

- Ignore unsolicited contact, always. Verify through the project's official site instead.
- Never type a seed phrase into any website.
- Read transaction summaries before signing, and treat unlimited token approvals as serious.
- Bookmark official domains rather than clicking through from search results or links in messages.
- Treat urgency as the signal. Scams manufacture time pressure because reflection stops people.

These five rules eliminate the overwhelming majority of what is currently being used to steal funds.

## Why the same scams keep working

They work because the situation is genuinely stressful. A withdrawal is frozen, an account is locked, and an apparent official is offering help faster than the real support desk responds.

That is precisely when the checks below matter, because the pressure is manufactured by the attacker rather than by the situation.

## A short checklist that survives pressure

Before any action requested by someone who contacted you first:

- Close the conversation and visit the official site independently.
- Confirm the domain character by character rather than trusting the link.
- Never type a recovery phrase, for any reason, into any form.
- Treat a request to sign a transaction you cannot explain as a hard stop.

None of these take time when you are calm, which is the whole reason to do them.

## Frequently asked questions

### How do I know a support message is fake?

Legitimate support never initiates contact through a private message. If a project, exchange, or wallet team contacts you first, assume it is fraudulent and verify by visiting the official site yourself.

### Is it safe to connect a wallet to a site I found in a comment?

No. Connecting to a malicious site can be enough, because the connection request or a token approval can move funds without any seed phrase being involved. Verify the URL independently before connecting.

### What if I already signed something I did not understand?

Stop interacting with that account. Use a block explorer to review recent transactions, revoke outstanding approvals on a reputable revocation tool, and move remaining funds to a new wallet. The damage from a bad signature cannot be undone, but further exposure can be stopped.""" ,

5: """A stablecoin is a token designed to hold a fixed value, usually one US dollar. The design is simple; the ways it fails are not, and understanding them explains why yield products built on stablecoins have collapsed.

## The mechanism

There are three broad designs, and the difference in risk is substantial.

Fiat-backed stablecoins hold the equivalent in bank reserves and redeem for dollars on demand. This is the model most people mean when they say stablecoin.

Crypto-collateralised stablecoins are minted against other crypto deposited as collateral. They are over-collateralised and algorithmically managed, which introduces mechanism risk that fiat-backed does not have.

Algorithmic ones use a mint-and-burn mechanism and incentives rather than reserves. Their history is the worst of the three.

## Why fiat-backed ones hold

The backing is auditable, and the redemption path is direct: send it, receive dollars. That is why the largest stablecoins have held their peg through multiple crises while algorithmic designs failed immediately.

The caveat is that holding a stablecoin is a claim on the issuer's reserves, so issuer solvency and redemption access matter more than the token's mechanism.

## What a depeg looks like

A depeg is a sustained departure from the target price, usually downward. It tends to happen when redemption is stressed, when liquidity thins, or when market confidence in the backing weakens.

The mechanism matters for recovery. A fiat-backed stablecoin that briefly loses its peg often returns once redemptions clear, because the backing is still there. An algorithmic one has no external source of value to draw on, so the peg becomes a self-reinforcing problem.

## Why this matters for yield

Yield products promising returns on stablecoins inherit the stablecoin's risk plus the protocol's. A high APY paid in a token with a shaky peg is not a high yield; it is compensation for a risk most users did not know they were taking.

Check what backs the yield source and what backs the asset being farmed. Two unexamined dependencies stacked on each other is a common way this goes wrong.

## Using them sensibly

Use stablecoins for what they are good at: a unit of account and a low-volatility settlement asset. Check the issuer and the redemption mechanism before holding a large balance, and treat unexplained peg movement as information rather than noise.

## Checking what backs the asset

Fiat-backed stablecoins publish attestations of reserves. That is not the same as an audit, and it is not the same as seeing the reserves, but it is meaningfully better than no disclosure.

Crypto-collateralised stablecoins are over-collateralised, so the mechanism is designed to hold. The failure modes are different: liquidation cascades during a market crash, or a depegs driven by redemption demand rather than by reserve quality.

## Reading a stablecoin APY

Ask what is paying it. If the answer is borrowers in a lending market, the rate reflects demand and defaults. If the answer is a token that prints, the rate reflects dilution and will fall as capital arrives.

## Practical handling

Treat a stablecoin as a settlement and working asset rather than a savings vehicle. Use it where you need a unit of account, and move longer-term holdings to an asset you can hold without relying on a third party's redemption promise continuing to work.

## Reading a stablecoin APY

Before accepting any figure, check the source:

- If borrowers pay it, the rate reflects demand and defaults.
- If a token prints, the rate reflects dilution and will fall as capital arrives.
- If it comes from a reward pool, check what is funding that pool.

## Frequently asked questions

### Can a stablecoin go below one dollar?

Yes. It has happened, usually when redemptions are stressed or liquidity thins. The more significant question is whether it recovers, which depends on whether there is real backing to redeem into.

### What is the difference between USDC and USDT?

Both are fiat-backed, but they are issued by different companies with different reserves and different redemption processes. The practical question is whether the issuer's reserves are attested and whether redemption currently works, not which ticker is more familiar.

### Why does a stablecoin APY sometimes collapse?

Because the yield is being paid by someone, and when that source disappears so does the rate. A high stablecoin yield usually means the protocol or the borrower is taking risk that is not stated in the headline figure.""" ,

6: """Layer 2 airdrops are the most popular way new users encounter a testnet, and the most common way they waste both time and gas. The strategy that works is narrower than the one most guides describe.

## What Layer 2 farms actually reward

Projects weight sustained, varied activity on a single wallet over many weeks. They are explicitly filtering for patterns that automation produces, and a farm built on scripts is the pattern they are looking for.

The variable that matters most is time. Rewards distributed across seasons reward presence, so consistency beats intensity.

## Route interactions through cheap periods

Gas on a Layer 2 is usually cents. On mainnet it can be dollars during busy hours. The cost difference over a multi-week farm is significant enough to change whether the activity was worth doing.

Use a gas tracker, keep a monthly budget, and do not interact at the moment you are excited about a new programme. Waiting an hour is often free.

## Keep one wallet, vary the actions

- Use a single wallet rather than several; the second one is a red flag.
- Interact with different applications rather than repeating one action.
- Bridge from mainnet yourself rather than through an exchange deposit.
- Maintain history across weeks rather than a burst of activity.

## Track your real cost

Keep a simple record: wallet, protocol, action, date, gas spent. After a few months you will know your cost per airdrop, which is the only figure that tells you whether continuing is rational.

Most farms pay nothing. Assume you are spending money, and decide in advance what you are willing to spend.

## Know when to stop

A project that has not announced a token, is now years old, and keeps changing its rules is not going to pay out on the schedule you expect. Sunk gas is not a reason to continue.

Testnets are free to join, but the time is not free. If the protocol does not interest you beyond the airdrop, the expected value is close to zero.

## Why most farms pay nothing

A project allocates a share of its supply, and it wants that share used rather than sold immediately. Distributing to a wide range of sustained participants serves that better than a few large recipients who sell at once.

The corollary is that very large farms are rare, and the median outcome for a participant is nothing.

## Recording cost per farm

Gas spent divided by months of activity is the honest unit. A farm that cost twenty dollars over three months is a different proposition from one that cost two hundred over the same period, and the second number is only knowable if you tracked it.

Most people discover the total was higher than expected, and that changes what they do next time.

## When the answer is to stop

A project that has been running for years with no token, keeps changing rules, and gives no clear allocation criteria is not going to pay out on your schedule. Sunk gas is not a reason to continue.

## Frequently asked questions

### Is farming on a Layer 2 worth the gas?

It depends entirely on the probability and size of the allocation. If the project is credible and your total gas cost is a small fraction of a plausible allocation, it is reasonable. If the protocol has no announced token, the expected value is close to zero regardless of cost.

### Does using a bridge or exchange deposit count?

Bridging from mainnet yourself usually signals more than depositing through an exchange, because the exchange deposit looks like ordinary trading activity. Each project weights this differently, so read what that project specifically counts.

### Should I use several testnets at once?

Only if you have the time to be genuinely active on each. Spreading a small amount of activity thinly across many programmes usually produces less than sustained activity on one.""" ,

7: """DYOR is the phrase people use for doing research before buying, and the phrase is often used to describe something much weaker than actual research: reading a thread.

Here is what genuine research on a token involves, in the order that saves the most time.

## Start with what the token is for

Read the documentation, not the marketing. A token that describes itself as a "decentralised solution for" a problem nobody has is telling you something.

The useful questions are concrete: what does a holder actually do with it, what revenue does the protocol earn, and what would break if the team stopped building.

## Look at the supply

Total supply, circulating supply, and the unlock schedule. Then look at who holds the rest.

The number that matters most is concentration. A handful of wallets holding most of the supply means those wallets can sell into any liquidity that exists. Check the distribution before reading anything else about the project.

## Find the treasury and the team's wallets

Projects publish a treasury address. Watching it shows you when the team is selling or deploying, which is usually before any announcement.

Team wallets matter for a different reason: if a large holder dumps, the price moves regardless of what the roadmap says. Read where the tokens are, not who the team says they are.

## Read what the contract can actually do

Token approvals and contract functions are where losses happen. A contract that can restrict transfers, or mint new supply, is a materially different risk from one that cannot.

Check whether the contract can be upgraded and by whom. An upgradeable contract means the rules can change after you have bought.

## Separate what you know from what you are told

Distinguish verified facts from claims. On-chain data is verifiable. A partnership announcement is a claim. A roadmap is a claim.

Write down which is which, and size your position according to how much of your thesis rests on the claims.

## Decide before you buy

DYOR is only useful if it changes what you do. Decide the size, the entry, and the condition that would make you exit, before the position exists.

## A short record is not a bad sign

A team that has been working for a year with nothing shipped is not necessarily dishonest. It is also not yet a product.

The question is whether the work so far demonstrates the ability to ship. A public repository with regular commits and working software tells you more than a roadmap slide.

## Reading the treasury flow

Transfers from the treasury to an exchange usually mean selling. Transfers to a published bridge or to a known exchange address mean funding operations. Watching the direction over weeks gives you an early signal that announcements do not.

## What to do with the conclusion

Write down the two or three claims your thesis depends on, and note which are verified and which are not. Size the position according to how much of it rests on the claims.

That single step does more than any amount of further reading, because it converts research into a decision with a defined risk.

## Separating fact from claim

Keep the two categories separate:

- Verified: on-chain supply distribution, unlock schedules, treasury movements.
- Claims: partnerships, listings, roadmap items, anything from marketing.

## Frequently asked questions

### Is reading the whitepaper enough?

No, and a whitepaper is usually the least informative document a project produces. The verifiable material is on-chain: who holds the supply, when it unlocks, and where the treasury has moved.

### How do I check if a token is a rug pull?

Look at holder concentration first. A few wallets holding most of the supply, thin liquidity relative to the headline valuation, and an unlock schedule that releases a large share soon are the patterns that precede most losses.

### What does an upgradeable contract mean for my position?

It means the rules can change after you buy. If the contract can be upgraded, ask who holds that authority and whether there is a timelock, because an upgrade can introduce transfer restrictions or minting that were not in the original code.""" ,

8: """Cross-chain bridges exist because different networks cannot talk to each other. They also have a track record of being the single largest attack surface in DeFi, and the reason is structural rather than incidental.

## How a bridge works

When you move tokens across networks, one of two things happens.

Either the tokens are locked on the source chain and a wrapped representation is minted on the destination, or the tokens are burned on the source and minted on the destination. Most bridges use the lock-and-mint approach.

The bridge contract holds the locked assets and mints wrapped tokens according to its own rules. That contract is the entire trust assumption, and it is usually the least audited code in the ecosystem.

## Where the losses came from

The failures cluster into recognisable categories.

If the contract itself is compromised, the attacker can mint unlimited wrapped tokens and sell them into liquidity. Signature verification bugs have done exactly this.

- Relayers and oracles are trusted parties; compromising them corrupts minting.
- Wrapped tokens can be depegged if the backing is not verifiable.
- Admin keys are a permanent risk, because an upgrade can change the rules at any time.

## Why the risk is higher than it looks

A bridge holds a large, visible pool of assets, which makes it worth targeting. The attacker does not need to steal incrementally; a single exploit is worth more than months of fees.

The TVL on bridges is not comparable to the TVL on a lending protocol in risk terms, even though both are quoted the same way.

## Reducing the exposure

- Prefer established, time-tested bridges over new ones offering higher yields.
- Bridge the amount you need rather than routing your whole balance.
- Check for an audit and for whether the contract is upgradeable.
- Use chains where the canonical asset is native, so no wrapped version is needed.
- After bridging, do not leave large balances sitting idle on the destination chain.

## The honest summary

Bridges are usable and are sometimes the only route to a network. They are not the default place to hold value, and the fee discount that a referral gives you does not change the security profile of the contract.

## The wrapped asset problem

Even when a bridge functions correctly, the wrapped token on the destination chain is a claim on the bridge's reserves rather than the native asset. If the bridge is compromised, your wrapped balance is the first thing at risk.

Where the destination chain supports the native asset, using that directly removes the exposure.

## Tracking official announcements

Every credible bridge publishes security disclosures and has a public channel for them. When an exploit occurs, the response window is often minutes, so knowing where that channel lives is the difference between moving early and moving after the pool is drained.

Follow the bridge's official announcements rather than reacting to social media reposts, which frequently arrive after funds have already moved.

## Why the risk is structural

Every bridge concentrates assets in one contract that must be correct. That is a different profile from a lending protocol, where user funds are spread across positions and the code holds no single pool.

## Frequently asked questions

### Are all bridges equally risky?

No, and the spread is wide. Established bridges with long operating history and public audits have a different risk profile from new ones offering higher yields, which is generally a signal of higher risk rather than an opportunity.

### Can I use a bridge and keep my funds there?

You can, but holding a large balance on a bridge is holding a claim on that bridge's contract. If the contract is compromised, the wrapped tokens are worth whatever the attacker leaves behind.

### Is bridging necessary for every network?

Often not. Several networks have canonical versions of major assets available natively, so moving the asset itself avoids the bridge entirely. Check for a native version before routing through a wrapped one.""" ,

9: """Gas fees are the price of block space, and block space is scarce by design. Understanding why that price moves the way it does lets you pay less without sacrificing anything.

## Why the price moves

Fees are an auction. When demand for block space rises, the price rises, because there is no way to add capacity within a block.

Two things drive demand: the base fee, which adjusts with congestion, and the priority fee you set to bid for inclusion. Most wallets estimate the combination for you.

## When transactions are cheapest

- Overnight in UTC, when global activity is lowest.
- Weekends, for the same reason.
- Immediately after a congestion-causing event clears.

The useful tool is a gas tracker with a historical chart. The pattern is stable enough to plan around.

## Layer 2 changes the calculation

On a Layer 2, transactions cost cents rather than dollars, and timing matters far less. If your activity is on a Layer 2, optimising mainnet gas is the wrong focus.

Where it still matters: bridging to mainnet, buying an asset only available there, and any single large interaction.

## Set the priority fee, not the max

Setting a very high maximum fee does not make your transaction faster or more reliable; it only caps what you would pay if the transaction is included late.

A modest priority fee with the normal base fee is sufficient in ordinary conditions. Overpaying on the cap is a quiet leak across many transactions.

## Batch when it makes sense

Several small interactions can sometimes be combined, though this depends on the protocol and wallet. Where it is available, batching reduces the number of times you pay the base overhead.

## The practical routine

Check the gas chart before interacting at an awkward time. Use a Layer 2 when the protocol supports it. Set a realistic priority fee. And for farming activity specifically, track total gas spent across all interactions, because that total, not the fee per transaction, determines whether the activity was worth doing.

## What a fee is actually paying for

Block space. Not processing power in the general sense, not a fee to the operator, and not a tip for faster service. It is rent for a limited position in a public queue.

Understanding it that way explains the behaviour people find confusing: fees are highest exactly when the network is working well and most wanted.

## What the base fee does

Each block has a base fee that adjusts with how full recent blocks were. When blocks are consistently full the fee rises; when they are not, it falls. The adjustment is automatic and needs no action from you.

Your priority fee is the part you control, and it only matters when the base fee is already high enough that ordering matters.

## Why a wallet estimate can be wrong

Estimates come from current conditions, and conditions change between the moment you sign and the moment the transaction lands. A transaction that confirms several blocks later pays a higher base fee than the one that lands in the next block.

## Frequently asked questions

### Why do gas fees spike without any news?

Because demand for block space rises. A popular token launch, a chain outage, or a bot-driven spike can each fill blocks and push the base fee up with no fundamental change to your transaction.

### Does setting a higher maximum fee make my transaction faster?

Not by itself. The maximum fee only caps what you would pay if the transaction is included late. What determines priority is the tip you set above the base fee, and during heavy congestion that tip is set by competition.

### Is it cheaper to send tokens on a Layer 2?

Usually, considerably. Layer 2 transactions cost cents rather than dollars. The mainnet cost matters when bridging in, buying an asset only available there, or making a single large interaction.""" ,
}


def js_string(text):
    """Encode a Python string as a double-quoted JS/JSON string literal."""
    return json.dumps(text, ensure_ascii=False)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    src = open(DATA, encoding="utf-8").read()

    changed = []
    for tid, body in BODIES.items():
        marker = re.search(r"(\{\s*\n\s*id:\s*%d,)" % tid, src)
        if not marker:
            print(f"  id={tid}: NOT FOUND")
            continue
        start = marker.start()
        # object ends at the next "\n  }," or "\n  }" at the same indent
        end = src.find("\n  },", start)
        if end == -1:
            end = src.find("\n  }", start)
        obj = src[start:end]

        bm = re.search(r'body:\s*"((?:[^"\\]|\\.)*)"', obj)
        if not bm:
            print(f"  id={tid}: no body field")
            continue

        old_w = len(bm.group(1).split())
        new_lit = js_string(body.strip())
        new_obj = obj[: bm.start()] + "body:" + new_lit + obj[bm.end():]

        # sanity: structure preserved
        assert new_obj.count("id:") == obj.count("id:"), f"id={tid} structure changed"
        src = src[:start] + new_obj + src[end:]
        changed.append((tid, old_w, len(body.split())))
        print(f"  id={tid}: {old_w}w -> {len(body.split())}w")

    if not args.dry_run:
        open(DATA, "w", encoding="utf-8").write(src)

    print(f"\n{len(changed)} tutorials rewritten"
          + (" (dry run)" if args.dry_run else ""))

    # verify build still parses
    r = subprocess.run(["node", "build.js"], cwd=ROOT, capture_output=True, text=True)
    if r.returncode != 0:
        print("BUILD FAILED:")
        print(r.stderr[:1500])
        return 1
    print("build.js: OK")
    print(r.stdout.strip().split("\n")[0])
    return 0


if __name__ == "__main__":
    raise SystemExit(main())