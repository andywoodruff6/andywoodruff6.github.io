# AEO Per-Post Specification

> Answer Engine Optimization structure for andywoodruff.net.
> This is the system of record. Every new post produced by the draft→publish
> skill must satisfy this spec. Existing posts are retrofitted opportunistically.

**Last updated:** 2026-05-15
**Status:** v2 — slimmed to TL;DR + JSON-LD only. The earlier v1 spec required visible Q&A and claims blocks on every post; both were removed when they proved out-of-place on a blog. Future AEO experiments may reintroduce them as opt-in blocks. See `Plans/` if/when that work starts.

---

## Why AEO (in one paragraph)

Answer engines (Perplexity, ChatGPT Search, Claude with web, Google AI Overviews, You.com)
do not rank pages — they chunk pages, extract claims, and cite chunks. A post optimized
for AEO is one whose paragraphs stand alone, whose summary is explicit, and whose metadata
is machine-readable. The same moves that make a post AEO-ready make it more scannable for
humans. The optimization for humans and engines collapses into one thing — that's the unlock.

---

## The Three Required Blocks

Every post — regardless of section — has these three blocks. Order is fixed.

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
  entity_type: 'Article' # one of: Article | OpinionNewsArticle | Prediction | Project | Review | Theme
  author: 'Andy Woodruff'
---
```

**Rules:**
- `tldr`: 40-80 words. MUST be self-contained — readable without the post.
- `entity_type`: drives JSON-LD schema selection (see Block 3).

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

### 3. Invisible JSON-LD Block (in `<head>`)

Injected by `PostLayout.astro` based on `aeo.entity_type`. Never edited by hand.

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

The three blocks are universal but the *content shape* varies by section.

### `/ideas/` (5 posts today)

- TL;DR: the post's thesis in 50-80 words
- entity_type: `Article` or `OpinionNewsArticle` for hot takes

### `/predictions/` (2 posts today)

- TL;DR: 40-60 words including confidence + target date
- entity_type: `Prediction`
- Extra: keep existing `confidence`, `status`, `target` frontmatter — JSON-LD pulls them

### `/projects/` (~5 entries)

- TL;DR: what the project is, your role, current state
- entity_type: `Project`

### `/curation/` (4+ entries, 34 in pipeline)

- TL;DR: one paragraph on why this artifact made the cut — Andy's framing, not the book jacket
- entity_type: `Review`

### `/themes/` (3 with detail pages)

- TL;DR: the theme in one paragraph — objective, range, why
- entity_type: `Theme`

---

## Integration with the Draft → Publish Skill (#16)

This spec is consumed by the future `skills/DraftToPublish/` skill (item #16 on
the daily-note priority list). Skill responsibilities re: AEO:

1. **Extract phase**: take raw daily-capture text → identify the thesis paragraph
2. **Frame phase**: ask the principal which `entity_type` applies, draft TL;DR
3. **Format phase**: write the post `.md`/`.mdx` with full AEO frontmatter populated
4. **Validate phase**:
   - JSON-LD validates against Schema.org via local validator
   - TL;DR is 40-80 words (count check)
5. **Stage phase**: write to `src/content/<section>/<slug>.{md,mdx}` as draft (frontmatter `draft: true`)

The skill never auto-publishes. Output is always a draft for review.

---

## Retrofit Strategy for Existing Posts

7 existing posts (5 ideas + 2 predictions) need retrofit. Approach:

1. Build the `TLDR.astro` component and JSON-LD injection in `PostLayout.astro` first ✅
2. Update `content.config.ts` schema to add optional `aeo` block ✅
3. Retrofit one prediction (smallest, highest-AEO-value) + one idea as proof-of-pattern
4. Retrofit the rest in batches as the draft→publish skill comes online
5. Curation pipeline (34 book notes) gets AEO baked in from the start — no retrofit needed

---

## Anti-Patterns (what NOT to do)

- **TL;DR that restates the headline.** Wastes the highest-signal chunk slot.
- **JSON-LD without visible counterpart.** Engines penalize hidden-only structured data. Always pair invisible JSON-LD with the visible TL;DR.

---

## ISCs (verification surface for this spec)

When the spec is *applied* to a post, that post must pass:

- [ ] ISC-1: Frontmatter contains valid `aeo` block (yaml-parseable, schema-conformant)
- [ ] ISC-2: `aeo.tldr` is 40-80 words
- [ ] ISC-3: `aeo.entity_type` is one of the six allowed values
- [ ] ISC-4: `<TLDR>` renders at top of post body
- [ ] ISC-5: Article/Prediction/etc JSON-LD `<script>` present in `<head>`, parses as valid JSON
- [ ] ISC-6: Schema.org Validator (or local equivalent) returns no errors
- [ ] ISC-7: Anti: TL;DR does not duplicate the title verbatim

---

## Open Questions (deferred)

- Brier scoring integration for `/predictions/` JSON-LD — does Schema.org have a native shape, or do we use `additionalProperty`?
- Whether to emit `BreadcrumbList` schema for nav context (low-priority; engines infer it).
- Whether to add `speakable` schema for voice-assistant pickup (probably yes for predictions; low priority).
- AEO-block versioning: when the spec changes, do existing posts auto-revalidate or are they grandfathered? Default: grandfathered until next edit.
- Future Q&A/claims experiments: if reintroduced, design them as opt-in per-post blocks (post-level `aeo.experimental: { qa: [...], claims: [...] }`) so the default remains TL;DR + JSON-LD only.
