# Adversarial first-read review 4 — Audio Gap Loop

**Verdict: PASS**

**Reviewed:** 2026-08-29 UTC  
**Target:** <https://audio-gap-loop.sociobot.in/>  
**Candidate:** `94a637f72feac7e690f7dc67554682a7bee4a1d6`  
**Method:** fresh Chromium contexts at 390×844 and 1440×900; live demo, storage, request, offline, route, metadata, link, keyboard, and AxeBuilder checks; source and history inspection; and every declared claim command from a clean clone. No product code was changed.

There are no findings. This report uses `F-4-k` identifiers only if a finding exists.

## First 30 seconds

Before scrolling, the root page communicates all three required answers at both widths:

- **What it does:** it lets someone practise an audio clip in timed repeats, with a speaking gap.
- **Who it is for:** language learners, parents, and tutors practising short audio.
- **What to do first:** choose **“Try sample practice.”** Its adjacent outcome says it opens a spoken French greeting with a three-second speaking gap.

At 390×844, the primary action, its outcome, and all three facts are inside the viewport (the final fact ends at y=778). At 1440×900, the same content ends at y=660. The real root has no demo banner, no horizontal overflow (390/390), and no console or page errors.

## Copy audit

Counts are whitespace-delimited. The landing audit covers title/description, root navigation, default and populated-state instructions, the hidden import dialog, and footer. Commands are not counted as prose sentences. No item is over 22 words; no banned marketing term, unexplained product jargon, information-free heading, inconsistent product term, or non-result-naming action was found. `CSV` is retained only as the standard export format name.

### Landing page

| Exact text | Words | Result |
| --- | ---: | --- |
| Audio Gap Loop — Timed language practice | 7 | Pass |
| Practise audio clips with timed speaking gaps and repeats. | 9 | Pass |
| Skip to practice | 3 | Pass |
| Audio Gap Loop | 3 | Pass |
| Demo / How it works / Privacy | 1 / 3 / 1 | Pass |
| Timed speaking practice | 3 | Pass |
| Practise an audio clip in timed repeats | 7 | Pass |
| For language learners, parents, and tutors who practise short audio with timed speaking gaps. | 14 | Pass |
| Try sample practice | 3 | Pass — sanctioned one-click sample action |
| Opens a spoken French greeting with a 3-second speaking gap. | 10 | Pass — `sample-spoken-loop` |
| Sample data stays separate from your audio clips. | 8 | Pass — `demo-isolation` |
| Audio and practice history stay in this browser. | 8 | Pass — `local-only-storage` |
| Saved audio clips work offline after the first visit. | 9 | Pass — `offline-reload` |
| Cassette recorder and headphones beside a blank transcript strip. | 9 | Pass — useful image alternative |
| Listen · speak · repeat | 5 | Pass — names the sequence |
| Practice player / Your audio clips | 2 / 3 | Pass |
| Import audio file | 3 | Pass — result-naming action |
| Opening practice player… | 3 | Pass — loading status |
| Offline. The player and saved audio clips are available. | 1 / 8 | Pass — `offline-reload` |
| No audio clips yet | 4 | Pass |
| Add an audio clip you have permission to use. | 9 | Pass — instruction |
| It stays in this browser. | 5 | Pass — `local-only-storage` |
| How timed repeats work | 4 | Pass — contextual heading |
| Choose a transcript line. Start timed repeats. Speak in the speaking gap. | 4 / 3 / 5 | Pass — `real-timed-repeats` |
| Listen / Speak / Hear again | 1 / 1 / 2 | Pass |
| Play the selected audio clip. Use the speaking gap. Play the audio clip again. | 5 / 4 / 5 | Pass — `real-timed-repeats` |
| Privacy and limits / What this player does not do | 3 / 7 | Pass — contextual headings |
| It does not score speech or provide lessons. | 8 | Pass — `product-boundaries` |
| Audio clips and practice history stay in this browser. | 9 | Pass — `local-only-storage` |
| Export and import / Export your practice data | 3 / 4 | Pass — contextual headings |
| Download a backup with audio clips or a CSV practice log. | 11 | Pass — `backup-export-import`, `csv-export` |
| Export backup / Export log CSV / Import backup | 2 / 3 / 2 | Pass — result-naming actions |
| Audio Gap Loop repeats audio clips with timed speaking gaps. | 10 | Pass — `real-timed-repeats` |
| Cassette artwork was generated for this product. | 7 | Pass — `artwork-provenance` |
| Audio stays in this browser. | 6 | Pass — `local-only-storage` |
| Demo — sample data is temporary and separate. | 8 | Pass — demo-only banner; `demo-isolation` |
| Reset demo / Start for real | 2 / 3 | Pass — result-naming demo actions |
| Current audio clip / Transcript line | 3 / 2 | Pass |
| No transcript yet. Use Edit to add one phrase per line. | 3 / 8 | Pass — empty state and recovery |
| Ready to listen / Start timed repeats / Replay now / Save practice session | 3 / 3 / 2 / 3 | Pass — result-naming controls |
| Speaking gap / Repeats / Playback speed / Player volume | 2 / 1 / 2 / 2 | Pass — consistent terms |
| Hearing-safe habit: begin below 60% volume, lower it if speech feels sharp, and take regular breaks. | 16 | Pass — safety guidance |
| Completed practice will appear here—no score attached. | 7 | Pass — empty-state explanation |
| Add an audio clip / Audio clip title / Transcript (one phrase per line) | 4 / 3 / 5 | Pass — consistent terms |
| Choose the transcript line you want to see during timed repeats. | 11 | Pass — `real-timed-repeats` |
| I have permission to use this audio. | 7 | Pass — confirmation |
| Close dialog / Cancel / Save audio clip | 2 / 1 / 3 | Pass — contextual or result-naming actions |

### README

| Exact text | Words | Result |
| --- | ---: | --- |
| Audio Gap Loop | 3 | Pass |
| Practise an audio clip in timed repeats. | 7 | Pass — `real-timed-repeats` |
| Audio Gap Loop is for language learners, parents, and tutors using short audio. | 13 | Pass — audience statement |
| Try the spoken French sample at audio-gap-loop.sociobot.in/demo/. | 7 | Pass — `sample-spoken-loop` |
| Demo data stays separate and is cleared when you start for real. | 12 | Pass — `demo-isolation` |
| Practise with your own audio | 5 | Pass — contextual heading |
| Import an audio clip you have permission to use. | 9 | Pass — instruction |
| Add transcript lines. Choose one transcript line. | 3 / 4 | Pass — `real-timed-repeats` |
| Set the speaking gap and repeats. Start timed repeats. | 6 / 3 | Pass — `real-timed-repeats` |
| Audio clips and practice history stay in this browser. | 9 | Pass — `local-only-storage` |
| Saved audio clips and the demo reload offline after their first visit. | 12 | Pass — `offline-reload` |
| Export a backup before clearing browser data. | 7 | Pass — instruction |
| You can also export a CSV practice log. | 8 | Pass — `csv-export` |
| The player does not score speech or provide lessons. | 9 | Pass — `product-boundaries` |
| Run and verify | 3 | Pass |
| Requires Node.js 20 or newer. | 5 | Pass — setup prerequisite |
| npm run build creates dist/. | 5 | Pass — `static-build` |
| The claim list and browser proofs are in .factory/claims.json. | 8 | Pass — verified location |
| Deploy | 1 | Pass |
| Deploy the contents of dist/ as a static site. | 9 | Pass — `static-build` |
| Routes / player and import flow / isolated sample practice / legal information / recovery page | 1 / 4 / 3 / 2 / 2 | Pass |
| License / MIT. See LICENSE. | 1 / 3 | Pass |

The direct demo-page sentence **“Downloads are created in this browser.”** is covered by the existing CSV and backup download tests: both assert a browser download observable, and `backup-export-import` then restores that downloaded file locally. No unlisted product claim remained after this cross-check. Legal disclaimers and instructions were not treated as product capability claims.

## Demo and sandbox

- The first-screen root action opens `/demo/` in one click.
- In a fresh 390px demo session, the first viewport already shows the populated **French greeting** row, one audio clip, three logged repeats, and the selected sample; desktop shows the populated player even more fully.
- The banner is present only in demo mode and reads **“Demo — sample data is temporary and separate.”** It provides **Reset demo** and **Start for real**.
- I changed the demo speaking gap from three to seven seconds, reset it, and confirmed it returned to three seconds.
- I then chose **Start for real** and confirmed the browser returned to `/`, all `demo:` keys and `demo:audio-gap-loop` were absent, and the real `audio-gap-loop` database remained.
- The demo request log contained only the product origin plus browser-local `blob:` audio URLs. The full live claim run also passed the offline reload assertion after first visit.

## Claims verification

Clean clone: `/tmp/audio-gap-loop-review-4.cxUbIT` at `94a637f72feac7e690f7dc67554682a7bee4a1d6`. `npm ci` completed with zero vulnerabilities. Each exact command listed in `.factory/claims.json` passed independently:

| Claim id | Result |
| --- | --- |
| `sample-spoken-loop` | PASS |
| `real-timed-repeats` | PASS |
| `demo-isolation` | PASS |
| `offline-reload` | PASS |
| `csv-export` | PASS |
| `backup-export-import` | PASS |
| `local-only-storage` | PASS |
| `delete-local-clip` | PASS |
| `product-boundaries` | PASS |
| `artwork-provenance` | PASS |
| `static-build` | PASS |

The full local suite passed (13 unit/contract and 16 browser tests). `npm run build` passed and produced `dist/`. The full 16-test Playwright suite also passed against the live origin. The locally rebuilt main JavaScript and CSS SHA-256 hashes exactly match the deployed assets.

## Earlier findings rechecked

Every prior review, polish report, and handoff was read. The following are confirmed on the live site and in code, rather than accepted from closure notes alone.

| Earlier finding | Current confirmation |
| --- | --- |
| F-1-1 | Fixed: job, audience, action, outcome, and three facts are visible before scrolling at both widths. |
| F-1-2 | Fixed: one-click spoken French sample opens populated. |
| F-1-3 | Fixed: separate IndexedDB/key namespace, reset, and exit cleanup are observed live. |
| F-1-4 | Fixed: `claims.json` has 11 entries and exactly one tagged test per entry. |
| F-1-5 | Fixed: product claims are mapped to observable claim tests, including real repeat, privacy, deletion, exports, limits, and provenance. |
| F-1-6 | Fixed: `/demo/` is live and an unknown URL returns the designed HTTP 404. |
| F-1-7 | Fixed: header/footer links are consistent; direct navigation and Back focus the destination h1. |
| F-1-8 | Fixed: every checked route has route-specific title, description, canonical, OG/Twitter data, favicon, and Apple icon. |
| F-1-9 | Fixed: no unavailable price, checkout, restore, merchant, or refund promise is rendered. |
| F-1-10 | Fixed: the imported object is consistently an **audio clip**; actions use plain result names. |
| F-1-11 | Fixed: README is short and avoids previous reader-facing implementation jargon. |
| F-1-12 | Fixed: 390px root width is 390px with no overflow; 200% text regression passes. |
| F-2-1 | Fixed: root hides the demo banner; demo routes show it. |
| F-2-2 | Fixed: the shipped, documented CC-BY spoken sample replaces the prior tone. |
| F-2-3 | Fixed: normal imported-audio playback, request privacy during timed practice, existing-log deletion, and artwork provenance now have outcome tests. |
| F-2-4 | Fixed: shared shell and Back focus pass live at mobile size. |
| F-2-5 | Fixed: full metadata is present on root, demo, legal routes, and 404. |
| F-2-6 | Fixed: previous alternate terms and vague controls are absent. |
| F-2-7 | Fixed: the prior PWA/service-worker jargon is absent from README. |
| F-2-8 | Fixed: Start for real deletes demo database and prefixed keys. |
| F-2-9 | Fixed: hero action, outcome, and facts fit both required first viewports. |
| F-2-10 | Fixed: AxeBuilder has no violations and tested targets meet the 44px requirement. |
| F-3-1 | Fixed: Demo, How it works, and Privacy are visible in the mobile header on every checked route. |
| F-3-2 | Fixed: real timed-repeat, full-flow local-only, and existing-history deletion tests exercise the claimed outcomes. |
| F-3-3 | Fixed: terms use **audio clip**, the audience sentence is factual, and README heading is contextual. |
| F-3-4 | Fixed: the landing page contains **“What this player does not do”** with plain privacy/limits text. |

## Structure, accessibility, privacy, and identity

- Root, demo, privacy, terms, and 404 each have one h1, `lang="en"`, a main landmark, route title/description, canonical, OG/Twitter metadata, favicon, Apple touch icon, and theme colour.
- The route crawl returned successful responses for every internal link. The deliberate missing route returned HTTP 404 with **“This page is not here.”** and a home recovery link.
- The shared header has the expected three links at 390px. Footer Privacy, Terms, Help, Param Factory build identity, keyboard controls, direct-route focus, and Back focus all passed the live suite.
- AxeBuilder reported zero violations on all checked routes. Fresh live pages logged no application console errors. The privacy request check permitted only same-origin and `blob:` requests during import and timed practice.
- The cassette-era study-zine palette, system type, tactile controls, original collage, and restrained motion match `.factory/design.md`. It is distinct from a generic SaaS template.

## Missed leverage / AI

No missing AI feature was found. Speech scoring is a stated non-goal; automatic transcription would undermine the focused local-first privacy model. The brief-implied import, local persistence, backup import/export, CSV export, sample practice, and offline replay are present. No decorative AI, provider key, or Azure runtime endpoint is embedded.

## What would make this perfect

Keep the claim tests and live route checks running as the product evolves. The current release is clear, tryable, and honest for its stated job; no concrete product change is required by this review.
