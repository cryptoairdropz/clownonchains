# Article Writing Rules — ClownOnChains

You are writing for cryptoairdropz.com. Read every rule before writing.

## Language
English only. The audience is global. Never write in Indonesian or any other language.

## Length and structure
- **700–900 words** per article. This is a hard floor and ceiling.
- **5–7 paragraphs**, each separated by a BLANK LINE. An article that arrives as one
  continuous block is rejected.
- **3–5 subheadings**, each written on its own line as `## Subheading Text`.
- **At least one bulleted list**, using `- item` on its own line.
- Open with a short paragraph (2–3 sentences) that states the specific question the
  article answers. No throat-clearing, no "in today's fast-paced world".

## Subheadings
Use `##` (two hashes, one space, then the text). Do not use `#`. Do not bold subheadings.
Make each subheading a specific claim or question, not a generic label.

Good: `## Why the code field resets when you edit it`
Bad: `## Introduction`

## Tone
- Neutral and informative. Explain trade-offs honestly, including ones that are
  unflattering to the platform you are writing about.
- Short sentences mixed with longer ones. Vary the rhythm.
- No hype, no emoji, no exclamation marks.
- Do not use these phrases: "in today's fast-paced world", "it's important to note",
  "when it comes to", "dive into", "unlock the power", "game-changer", "in conclusion",
  "navigate the landscape", "at the end of the day".

## Facts — this is the most important rule
A file at `queue/affiliate-context.json` holds the verified facts for every partner:
fees, discount percentage, referral code, pairs, country, bonus terms, why/watch lists,
step-by-step registration, and FAQ entries.

**Read that file. Use only those numbers.** Rules:
- NEVER invent a fee, a bonus amount, a discount percentage, or a requirement.
- If a fact you want is not in the file, describe it qualitatively instead
  ("a lower maker rate", not "0.02%").
- Never state a current price, market cap, or APY figure.
- You may state general industry facts that are stable and widely known
  (for example: exchanges generally charge less for maker orders than taker orders).

## Referral codes
- Mention the referral code **2–3 times** in the article, naturally. Never more.
- The code and its link come from `queue/affiliate-context.json`. Use them exactly.
- Never write the raw URL in the body text. Refer to the code and let the page's
  referral block carry the link.

## Citations — do not include any
- Never write `[1]`, `[2]`, or any bracketed number.
- Never add a `## Sources` section or a list of URLs at the end.
- Never write "according to X" with a link. Write the fact plainly.

## Closing section — required
End every article with exactly this structure:

```
## Frequently asked questions

### <Question one?>

<Answer paragraph.>

### <Question two?>

<Answer paragraph.>

### <Question three?>

<Answer paragraph.>
```

The three questions must be specific to this article's topic, not generic. Each answer
is 2–4 sentences and must be answerable from what the article already covered.

## Article types
- **Affiliate articles**: the topic names a platform. Mention the code, cover the
  platform's real fee structure from the context file, and be honest about drawbacks.
  Every affiliate article must include a short section on risks or things that go wrong.
- **Educational articles** (no platform in the topic): teach the concept. Do not force
  a referral code in — if the topic does not call for one, leave it out entirely.

## Output format — write TWO files per article

For each assigned topic, write:

**1. The body** → `queue/drafts/<slug>.md`
Raw text. Paragraphs separated by blank lines. `##` subheadings. `-` for bullets.
No title inside the file — the body starts with the first paragraph.

**2. The metadata** → `queue/drafts/<slug>.meta.json`
```json
{
  "slug": "<the slug from your topic list>",
  "title": "<SEO title, 50-65 characters, contains the target keyword>",
  "desc": "<meta description, 140-158 characters, contains the target keyword>",
  "keyword": "<the target keyword from your topic list>",
  "affiliate": "<the partner slug from your topic list, or empty string>"
}
```

Use the exact slug given in your topic list. Do not invent your own.

## Self-check before you finish each article
1. Is it 700–900 words?
2. Are there 5–7 paragraphs with blank lines between them?
3. Are there 3–5 `##` subheadings?
4. Is there at least one `-` bulleted list?
5. Does it end with the three-question FAQ block?
6. Is every number traceable to `queue/affiliate-context.json`?
7. Is the referral code mentioned 2–3 times (affiliate articles only)?
8. No `[1]` markers, no `## Sources`, no URLs in the body?
9. Is it entirely in English?

If any answer is no, fix it before writing the file.
