# Backlog

Running list of things to work on in the future. Items live here until they
graduate into a session, get punted indefinitely, or are killed outright.

Format: one item per bullet. Add a `(YYYY-MM-DD)` date when adding so we can
tell what's been waiting longest. Promote to a session when picking up.

---

## Predictions

- **Brier scoring for resolved predictions.** Add a `Brier` column to the predictions table, auto-computed from `confidence` × `status`: `(1−p)²` if Correct, `p²` if Incorrect, blank for Open. Show the running average Brier as a single number near the top — that's the "I keep score" signal. Decided 2026-05-15 to defer; the page reads fine without it for now. (2026-05-15)
- **Group predictions under T1–T4 theses** from SELF TELOS — AI vs Blockchain · Information Overload · Knowledge Worker Displacement · In-Person Trumps Digital. Add 2–4 specific time-bound predictions per thesis (currently 2 total, none thesis-tagged). (2026-05-15)

## Content pipelines

- **Pipe the 34 batch-processed book notes into `/curation/`.** Lowest-effort, highest-fill content backlog. Curation currently shows 4 books vs 34 ready to go. One commit per book. (2026-05-15)
- **`/building/` expansion (or richer `/projects/`).** Surface the actual workstream list from the weekly compute log: Newsletter SOP Verification, Remotion video pipeline, PM Agent + Stakeholder CLI, Risk & Issue Tracker, Switchboard, Paper Boy market research, Cubicube beta, Showrunner governance. "Scale Your Compute" theme should be visible to a visitor, not hidden. (2026-05-15)

## Strategic surfaces

- **Q1 2026 review (sanitized).** Constraint-Build Seesaw, Autonomy Ladder, Relationship Gap, Journaling Canary. Quarterly cadence — most repeatable long-form post. (2026-05-15)
- **`/speaking/` page.** Soulscape Apr 9–13 keynote + panel, AMAs #1 and #2, Kaiber/Guild/Gato pitches. Signals availability for the next ones. (2026-05-15)
- **`/connect/` page with structured intent.** Three buckets: Partnership (OCME), Consulting (Shifting Current Consulting Ops), Press / Speaking. (2026-05-15)
- **Newsletter integration upgrade.** (a) Above-the-fold CTA on every long post, (b) dedicated `/subscribe/` page with what subscribers get + cadence, (c) preview of the most recent issue. (2026-05-15)
- **AEO / structured-content blocks.** Add `## TL;DR` and `## Q&A` blocks at the bottom of each post in JSON-LD-friendly markup. Eat the dogfood before pitching the play. (2026-05-15)

## Operational

- **Draft → publish pipeline.** Skill that turns one `01_Capture/YYYY-MM-DD.md` entry into a draft Astro post + Substack draft + LinkedIn pre-write + tweet thread. Extends the Remotion pipeline to text. (2026-05-15)
- **Stop Doing list against the site.** Apply the $150/hr filter to every section. Anything that doesn't either advance M1 (100M DIDs) or feed the newsletter is a candidate for cut. (2026-05-15)
