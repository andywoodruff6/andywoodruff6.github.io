# AEO Per-Post Specification

> Answer Engine Optimization structure for andywoodruff.net.
> This is the system of record. Every new post produced by the draft→publish
> skill must satisfy this spec. Existing posts are retrofitted opportunistically.

**Last updated:** 2026-05-15
**Status:** v1 — design baseline, not yet applied to any post

---

## Why AEO (in one paragraph)

Answer engines (Perplexity, ChatGPT Search, Claude with web, Google AI Overviews, You.com)
do not rank pages — they chunk pages, extract claims, and cite chunks. A post optimized
for AEO is one whose paragraphs stand alone, whose summary is explicit, whose Q&A is
real, and whose metadata is machine-readable. The same moves that make a post AEO-ready
make it more scannable for humans. The optimization for humans and engines collapses
into one thing — that's the unlock.

---

## The Five Required Blocks

Every post — regardless of section — has these five blocks. Order is fixed.

### 1. Frontmatter (existing, extend)

YAML at the top of every `.md`/`.mdx` file. Existing fields stay. Add:

```yaml
---
title: 'The First Warning Shot'
date: '2026-01-09T20:05:26Z'
description: 'Tailwind CSS lost 80% of revenue in months. This is the first warning shot of AI disruption we cannot explain away.'
tags: ['ideas', 'AI', 'business']
cover: '/images/...'

# AEO additions
aeo:
  tldr: 'One-paragraph answer to "what is this post saying?" — 40-80 words, written so a citation tool could quote it standalone.'
  claims:
    - 'Tailwind CSS lost 80% of revenue in months, not years.'
    - 'AI is consuming the layer of work Tailwind monetized (consulting + templates).'
    - 'This is a leading indicator, not a one-off — more SaaS revenue collapses are coming.'
  qa:
    - q: 'Why did Tailwind lose 80% of its revenue?'
      a: 'AI now writes the code that humans used to pay Tailwind to help with — consulting and starter templates collapsed simultaneously.'
    - q: 'Is this the first AI-driven business collapse?'
      a: 'No — but it is the first one that cannot be reframed as "restructuring" or "market conditions." The cause is unambiguous.'
    - q: 'What should operators do about this?'
      a: 'Audit your own revenue model for the same exposure: is AI eating the layer you sell into? If yes, you have months not years.'
  entity_type: 'Article' # one of: Article | OpinionNewsArticle | Prediction | Project | Review | Theme
  author: 'Andy Woodruff'
---
```

**Rules:**
- `tldr`: 40-80 words. MUST be self-contained — readable without the post.
- `claims`: 3-7 atomic factual claims. Each is one sentence, no compound "and"s.
- `qa`: 3-5 question/answer pairs. Questions are what a human would *actually* ask, not keyword bait. Answers are 1-3 sentences, self-contained.
- `entity_type`: drives JSON-LD schema selection (see Block 5).

### 2. Visible TL;DR (top of post body, after H1)

Rendered as a styled callout block at the top of every post. Driven by `aeo.tldr`.

```mdx
<TLDR>
  Tailwind CSS lost 80% of revenue in months after AI replaced the work
  they monetized. This is the first AI-disruption casualty that can't be
  explained away as "restructuring." Operators should audit their own
  revenue model now — the warning shot pattern is repeatable and accelerating.
</TLDR>
```

**Component:** `src/components/TLDR.astro` — renders as a left-bordered callout
with `TL;DR` label in mono uppercase, Flexoki accent color.

**Why visible:** Pre-chunks the post for engines AND gives human skimmers the
single most-extractable paragraph. Doubles as the og:description fallback.

### 3. The Post Body (existing, unchanged)

The actual post. No structural change. Two soft guidelines:

- **Self-contained paragraphs.** Each paragraph should read as a quotable unit.
  A paragraph that requires "as mentioned above" is one engines will skip.
- **Semantic H2s.** Each major section gets an H2 that answers a question.
  "Why this matters" not "Section 2." H3s should rarely be needed; H4+ never.

### 4. Visible Q&A Block (bottom of post body, before newsletter CTA)

Rendered as an FAQ-styled section at the end of the post. Driven by `aeo.qa`.

```mdx
<QA questions={frontmatter.aeo.qa} />
```

**Component:** `src/components/QA.astro` — renders `## Questions` heading,
then each Q as an H3, each A as a paragraph. Semantic `<details>`/`<summary>`
optional for collapsibility on long posts.

**Why visible:** Q&A is the highest-cited chunk shape across all major
answer engines. Putting real Q&A on the page (not buried in JSON-LD only)
gives both humans and engines a clean handle.

### 5. Invisible JSON-LD Block (in `<head>`)

Injected by `PostLayout.astro` based on `aeo.entity_type`. Never edited by hand.

**Two schemas always emitted:**

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",                          // or per entity_type
  "headline": "{title}",
  "description": "{description}",
  "datePublished": "{date}",
  "author": {
    "@type": "Person",
    "name": "Andy Woodruff",
    "url": "https://andywoodruff.net/about/"
  },
  "image": "{cover absolute URL}",
  "mainEntityOfPage": "{canonical URL}",
  "articleBody": "{tldr}"                      // engines pull this if main body fails
}
</script>

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "{qa[0].q}",
      "acceptedAnswer": { "@type": "Answer", "text": "{qa[0].a}" }
    }
    // ... each qa pair
  ]
}
</script>
```

**Entity-type variations:**

| `entity_type` | Schema swap |
|---------------|-------------|
| `Article` | `@type: "Article"` (default for ideas, curation) |
| `OpinionNewsArticle` | `@type: "OpinionNewsArticle"` (for hot-take posts) |
| `Prediction` | `@type: "Article"` + custom `additionalType: "Prediction"` + `aeo.confidence`, `aeo.target_date` mapped to schema props |
| `Project` | `@type: "CreativeWork"` + `creator: Person` |
| `Review` | `@type: "Review"` + `itemReviewed: Book/Article/Video` (curation entries) |
| `Theme` | `@type: "Article"` + `articleSection: "Annual Theme {year}"` |

**Validator:** the draft→publish skill MUST run `Skill("Webdesign", "validate JSON-LD")`
or a local schema-validator before committing. Invalid JSON-LD silently fails on engines.

---

## Per-Section Application

The five blocks are universal but the *content shape* varies by section.

### `/ideas/` (5 posts today)

- TL;DR: the post's thesis in 50-80 words
- Claims: 3-5 testable factual statements
- Q&A: real questions a reader is left with — "Why X?" "What should I do?" "Is this generalizable?"
- entity_type: `Article` or `OpinionNewsArticle` for hot takes

### `/predictions/` (2 posts today)

- TL;DR: 40-60 words including confidence + target date
- Claims: ALWAYS includes the prediction itself as claim 1, the reasoning as claims 2-N
- Q&A: minimum one — "What would falsify this?" "Why this timeframe?" "Why this confidence?"
- entity_type: `Prediction`
- Extra: keep existing `confidence`, `status`, `target` frontmatter — JSON-LD pulls them

### `/projects/` (~5 entries)

- TL;DR: what the project is, your role, current state
- Claims: factual project facts (founded, scope, status, link)
- Q&A: "What is X?" "What's your role?" "How can someone get involved?"
- entity_type: `Project`

### `/curation/` (4+ entries, 34 in pipeline)

- TL;DR: one paragraph on why this artifact made the cut — Andy's framing, not the book jacket
- Claims: 2-3 — what the source argues + Andy's distillation
- Q&A: "Why is this on Andy's list?" "Who should read this?" "What does Andy disagree with?"
- entity_type: `Review`

### `/themes/` (3 with detail pages)

- TL;DR: the theme in one paragraph — objective, range, why
- Claims: the theme statement + 2-3 sub-objectives
- Q&A: "Why this theme?" "What did the previous theme produce?" "How is progress measured?"
- entity_type: `Theme`

---

## Integration with the Draft → Publish Skill (#16)

This spec is consumed by the future `skills/DraftToPublish/` skill (item #16 on
the daily-note priority list). Skill responsibilities re: AEO:

1. **Extract phase**: take raw daily-capture text → identify candidate claims + questions
2. **Frame phase**: ask the principal which `entity_type` applies, draft TL;DR + claims + Q&A
3. **Format phase**: write the post `.md`/`.mdx` with full AEO frontmatter populated
4. **Validate phase**:
   - JSON-LD validates against Schema.org via local validator
   - TL;DR is 40-80 words (count check)
   - Claims are 3-7, each ≤30 words, no compound conjunctions
   - Q&A pairs are 3-5, answers self-contained (no "as mentioned above" / "see above")
5. **Stage phase**: write to `src/content/<section>/<slug>.{md,mdx}` as draft (frontmatter `draft: true`)

The skill never auto-publishes. Output is always a draft for review.

---

## Retrofit Strategy for Existing Posts

7 existing posts (5 ideas + 2 predictions) need retrofit. Approach:

1. Build the components (`TLDR.astro`, `QA.astro`) and JSON-LD injection in `PostLayout.astro` first
2. Update `content.config.ts` schema to add optional `aeo` block (optional during retrofit window, required after)
3. Retrofit one prediction (smallest, highest-AEO-value) + one idea as proof-of-pattern
4. Retrofit the rest in batches as the draft→publish skill comes online
5. Curation pipeline (34 book notes) gets AEO baked in from the start — no retrofit needed

---

## Anti-Patterns (what NOT to do)

- **TL;DR that restates the headline.** Wastes the highest-signal chunk slot.
- **Q&A questions that nobody would actually ask.** "What is AEO?" on an AEO post is fine; "What is content?" is not. Real questions only.
- **Compound claims.** "Tailwind lost 80% AND laid off 75% of staff AND this proves AI disruption" splits into three claims, not one.
- **JSON-LD without visible counterpart.** Engines penalize hidden-only structured data. Always pair invisible JSON-LD with visible TL;DR + Q&A.
- **Keyword stuffing in claims.** Claims are factual, not optimized. If a claim doesn't pass the "would you say this out loud" test, rewrite it.

---

## ISCs (verification surface for this spec)

When the spec is *applied* to a post, that post must pass:

- [ ] ISC-1: Frontmatter contains valid `aeo` block (yaml-parseable, schema-conformant)
- [ ] ISC-2: `aeo.tldr` is 40-80 words
- [ ] ISC-3: `aeo.claims` has 3-7 entries, each ≤30 words, no " and " conjunctions
- [ ] ISC-4: `aeo.qa` has 3-5 entries, each answer ≥1 sentence and ≤3 sentences
- [ ] ISC-5: `aeo.entity_type` is one of the seven allowed values
- [ ] ISC-6: `<TLDR>` renders at top of post body
- [ ] ISC-7: `<QA>` renders before newsletter CTA
- [ ] ISC-8: Article/Prediction/etc JSON-LD `<script>` present in `<head>`, parses as valid JSON
- [ ] ISC-9: FAQPage JSON-LD `<script>` present in `<head>`, parses as valid JSON
- [ ] ISC-10: Schema.org Validator (or local equivalent) returns no errors for either script
- [ ] ISC-11: Anti: TL;DR does not duplicate the title verbatim
- [ ] ISC-12: Anti: no claim contains a top-level " and " conjunction

---

## Open Questions (deferred)

- Brier scoring integration for `/predictions/` JSON-LD — does Schema.org have a native shape, or do we use `additionalProperty`?
- Whether to emit `BreadcrumbList` schema for nav context (low-priority; engines infer it).
- Whether to add `speakable` schema for voice-assistant pickup (probably yes for predictions; low priority).
- AEO-block versioning: when the spec changes, do existing posts auto-revalidate or are they grandfathered? Default: grandfathered until next edit.
