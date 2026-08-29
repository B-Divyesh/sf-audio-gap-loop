# Adversarial first-read review 3 — Audio Gap Loop

**Verdict: FAIL**

**Reviewed:** 2026-08-29 UTC

**Target:** <https://audio-gap-loop.sociobot.in/>

**Candidate:** `9966d5cb374f8f2b3403f525c5242abbc68cf87b`
**Method:** fresh Chromium contexts at 390×844 and 1440×900, live demo/storage/network/offline tests, route and link crawl, metadata and AxeBuilder scans, source/history review, and every claim command from a separate clean clone. No product code was changed.

## First 30 seconds

Before scrolling, I understood this as a browser player that repeats a language audio clip, pauses so the learner can speak, and plays it again. The audience is learners, parents, and tutors. The first action is **“Try sample practice.”** Its adjacent text says that it opens a spoken French greeting with a three-second speaking gap.

This passes at both requested sizes. At 390×844, the action ends at y=568, its explanation at y=633, and all three facts end at y=736. At 1440×900, the same content ends at y=660. The root does not show the demo banner. Evidence: `.factory/evidence/review-3-mobile.png` and `.factory/evidence/review-3-desktop.png`.

## Findings

### Blocking

#### F-3-1 / F-1-7 / F-2-4 reopened — the shared header disappears only on the main mobile routes

**Exact location:** live `/` and `/demo/` at 390 px show only **“Audio Gap Loop”** in the header. **“Demo,” “How it works,”** and **“Privacy”** are absent. Live `/privacy/`, `/terms/`, and the 404 show those same links at 390 px.

**Code evidence:** `src/styles.css` applies `nav { display: none; }` below 800 px. The legal routes use `src/legal.css`, which keeps their navigation visible.

**Why this fails:** the phone visitor cannot use the required header navigation on the two primary routes, and the shell changes between routes. Polish 2 marked the earlier shared-shell finding fixed, but it is only fixed in markup and desktop rendering. The review contract makes a half-fixed earlier finding blocking again.

**Concrete fix:** use one mobile header implementation on every route. Keep the three links visible or add an accessible, keyboard-operable menu with the same links. Add a 390 px assertion that each route exposes **Demo**, **How it works**, and **Privacy** in the header.

#### F-3-2 / F-1-5 / F-2-3 reopened — green claim commands still leave claims unproved

**Exact unlisted live/README claims:**

- `/`: **“Choose a transcript line. Start timed repeats. Speak in the speaking gap.”**
- `/`: **“Play the selected clip.”** and **“Play the clip again.”**
- `/`: **“Audio Gap Loop is a browser-based player for timed language practice.”**
- `/`: **“Cassette artwork was generated for this product.”**
- README: **“Practise a language clip in timed repeats.”** and the five-step import/transcript/gap/repeat instructions under **“Use it.”**

`sample-spoken-loop` is limited to the demo. Its test reaches **Listen → Your turn**, but no listed claim or test proves the general imported-audio sequence or the promised second playback.

Two listed proofs are also weaker than their claim text:

- `local-only-storage` promises that **“normal practice makes no third-party requests.”** Its test imports a WAV and reloads it, but never starts timed repeats.
- `delete-local-clip` promises removal of **“local practice history.”** Its test creates no practice session and confirms a zero-row log is still zero after deletion.

**Why this fails:** the claims contract requires outcome-level proof, not a green test that skips the promised action. Polish 2 marked F-1-5/F-2-3 fixed, but these gaps remain. An untested claim blocks PASS.

**Concrete fix:** add a `real-timed-repeats` claim test that imports a real fixture, selects a line, and proves listen → speaking gap → second playback. Extend `local-only-storage` through that flow while recording requests. Seed or complete a practice session, assert its log exists, then delete the clip and assert both clip and log are gone. Add a static provenance test for the artwork statement or remove that sentence.

#### F-3-3 / F-1-10 / F-2-6 reopened — copy still uses multiple names for an audio clip

**Exact locations and rewrites:**

| Location | Current copy | Problem | Proposed rewrite |
| --- | --- | --- | --- |
| `/` h1 and README opening | “language clip” | Conflicts with the recorded term **audio clip**. | “Practise an audio clip in timed repeats” |
| Import dialog h2 | “Add a practice clip” | A third name for the same imported file. | “Add an audio clip” |
| Demo h2 | “Sample audio clip” | Adds a state adjective to the object name. | “Audio clip” |
| Hero audience sentence | “want a calm listen–speak–repeat routine” | “calm” is subjective mood copy rather than usable information. | “For language learners, parents, and tutors who practise short audio with timed speaking gaps.” |
| README h2 | “Use it” | The heading is vague out of context. | “Practise with your own audio” |

**Why this fails:** the repository’s own terminology table says the single term is **audio clip**, and review 2 required that consolidation. A cold reader still has to decide whether a language clip, practice clip, and audio clip are different things. This is another half-fixed historical finding, so it is blocking under the review order.

**Concrete fix:** use **audio clip** for the imported object everywhere, apply the rewrites above, regenerate the copy audit from the actual root, dialog, demo, and README, and add a terminology lint assertion.

### Major

#### F-3-4 — the landing page omits the required privacy/limits section

**Exact location:** after **“How timed repeats work,”** the page jumps to **“Export your practice data.”** There is no landing section that names what the product does not do or explains privacy. The only local-storage statement is a one-line hero fact and footer repetition.

**Why this fails:** the required landing skeleton places **“What it does not do / privacy in plain words”** after How it works. A first-time visitor should not have to open Terms to discover that this is not speech scoring or a language course.

**Concrete fix:** add a section headed **“What this player does not do”** after How it works. Suggested copy: **“It does not score speech or provide lessons. Audio and practice history stay in this browser.”** List and test both sentences in `claims.json`.

## Copy audit

Counts are whitespace-delimited. Code blocks are excluded. The landing audit includes metadata, all default-state copy, image alt text, the offline message, and the import-dialog copy. No sentence exceeds 22 words. No banned word appears. `F-3-2` marks unlisted or under-proved claims; `F-3-3` marks the remaining plain-word failures.

### Landing page

| Exact copy | Words | Result |
| --- | ---: | --- |
| Audio Gap Loop — Timed language practice | 7 | pass |
| Practise language clips with a timed listen, speaking gap, and repeat routine. | 12 | F-3-2, F-3-3 |
| Skip to practice | 3 | pass |
| Audio Gap Loop | 3 | pass |
| Demo | 1 | pass; hidden in the main mobile header (F-3-1) |
| How it works | 3 | pass; hidden in the main mobile header (F-3-1) |
| Privacy | 1 | pass; hidden in the main mobile header (F-3-1) |
| Timed speaking practice | 3 | pass |
| Practise a language clip in timed repeats | 7 | F-3-2, F-3-3 |
| For learners, parents, and tutors who want a calm listen–speak–repeat routine. | 11 | F-3-3 |
| Try sample practice | 3 | pass; result-naming action |
| Opens a spoken French greeting with a 3-second speaking gap. | 10 | listed and proved |
| Sample data stays separate from your clips. | 7 | listed and proved |
| Audio stays in this browser. | 5 | listed; proof scope noted in F-3-2 |
| Export a backup before clearing browser data. | 7 | pass instruction |
| Cassette recorder and headphones beside a blank transcript strip. | 9 | pass alt text |
| Listen · speak · repeat | 5 | pass; names the sequence |
| Practice player | 2 | pass |
| Your audio clips | 3 | pass |
| Import audio file | 3 | pass button |
| Opening practice player… | 3 | pass status |
| Offline. | 1 | listed offline status |
| Your saved clips and practice tools still work. | 8 | broader than the demo-only offline claim (F-3-2) |
| No practice clips yet | 4 | pass empty state |
| Add an audio clip you have permission to use. | 9 | pass instruction |
| It stays in this browser. | 5 | listed; proof scope noted in F-3-2 |
| How timed repeats work | 4 | pass heading |
| Choose a transcript line. | 4 | F-3-2 |
| Start timed repeats. | 3 | F-3-2 |
| Speak in the speaking gap. | 5 | F-3-2 |
| Listen | 1 | pass step heading |
| Play the selected clip. | 4 | F-3-2 |
| Speak | 1 | pass step heading |
| Use the speaking gap. | 4 | F-3-2 |
| Hear again | 2 | pass step heading |
| Play the clip again. | 4 | F-3-2 |
| Export and import | 3 | pass |
| Export your practice data | 4 | pass |
| Download a backup with clips or a CSV practice log. | 10 | listed export claims |
| Export backup | 2 | pass button |
| Export log CSV | 3 | pass button; the format name is necessary |
| Import backup | 2 | pass button |
| Audio Gap Loop is a browser-based player for timed language practice. | 11 | F-3-2 |
| Privacy · Terms · Help | 5 | pass |
| Cassette artwork was generated for this product. | 7 | F-3-2 |
| Build polish-2 · Built by Param Factory | 7 | pass required build identity |
| Clip details | 2 | pass |
| Add a practice clip | 4 | F-3-3 |
| Close dialog | 2 | pass button name |
| Clip title | 2 | pass label |
| Transcript (one phrase per line) | 5 | pass label |
| During practice, choose the line you want to keep in view. | 11 | F-3-2 |
| I have permission to use this audio. | 7 | pass confirmation |
| Cancel | 1 | pass dialog action |
| Save clip locally | 3 | pass result-naming button |

### README

| Exact copy | Words | Result |
| --- | ---: | --- |
| Audio Gap Loop | 3 | pass heading |
| Practise a language clip in timed repeats. | 7 | F-3-2, F-3-3 |
| It is for learners, parents, and tutors who want a calm listen–speak–repeat routine. | 13 | F-3-3 |
| Try the spoken French sample at audio-gap-loop.sociobot.in/demo/. | 7 | listed and proved |
| Demo data is separate from your clips and is cleared when you start for real. | 15 | listed and proved |
| Use it | 2 | vague heading (F-3-3) |
| Import audio you have permission to use. | 7 | F-3-2 |
| Add transcript lines. | 3 | F-3-2 |
| Choose one line. | 3 | F-3-2 |
| Set a speaking gap and repeats. | 6 | F-3-2 |
| Start timed repeats. | 3 | F-3-2 |
| Your clips and practice data stay in this browser. | 9 | listed; proof scope noted in F-3-2 |
| Export a backup before clearing browser data. | 7 | pass instruction |
| Export a CSV practice log when needed. | 7 | listed and proved for demo data |
| The demo reloads offline after its first visit. | 8 | listed and proved |
| Run and verify | 3 | pass heading |
| Requires Node.js 20 or newer. | 5 | pass maintainer requirement |
| `npm run build` creates `dist/`. | 5 | independently verified |
| The claim list and browser proofs are in `.factory/claims.json`. | 9 | location is correct; completeness fails F-3-2 |
| Routes | 1 | pass heading |
| player and import flow | 4 | pass route description |
| isolated sample practice | 3 | pass route description |
| legal information | 2 | pass route description |
| recovery page | 2 | pass route description |
| License | 1 | pass heading |
| MIT. | 1 | verified by `LICENSE` |
| See LICENSE. | 2 | pass |

## Demo and sandbox result

- One-click path: PASS. **Try sample practice** opens `/demo/` in one click.
- Immediate sample: PASS. The first demo screen shows **French greeting**, selected **“Bonjour.”**, a 3-second speaking gap, three repeats, and one completed three-repeat log.
- Banner: PASS. It says **“Demo — sample data is temporary and separate.”** and exposes **Reset demo** and **Start for real**.
- Reset: PASS. A changed seven-second gap returned to three seconds.
- Isolation/exit: PASS. The demo used `demo:audio-gap-loop`; Start for real removed that database and all `demo:` keys while preserving the normal `audio-gap-loop` database and a real-namespace marker.
- Offline/privacy: PASS for the exercised demo. The populated demo reloaded offline after service-worker control. The full live probe recorded no third-party request.

Evidence: `.factory/evidence/review-3-demo-mobile.png`.

## Claims verification

Clean clone: `/tmp/audio-gap-loop-review3.w0tYNG/clean` at the candidate commit.

| Claim | Exact command | Command result | Contract result |
| --- | --- | --- | --- |
| `sample-spoken-loop` | `npm test -- --grep @claim:sample-spoken-loop` | PASS | PASS |
| `demo-isolation` | `npm test -- --grep @claim:demo-isolation` | PASS | PASS; independently repeated live |
| `offline-reload` | `npm test -- --grep @claim:offline-reload` | PASS | PASS; independently repeated live |
| `csv-export` | `npm test -- --grep @claim:csv-export` | PASS | PASS |
| `backup-export-import` | `npm test -- --grep @claim:backup-export-import` | PASS | PASS |
| `local-only-storage` | `npm test -- --grep @claim:local-only-storage` | PASS | FAIL scope: no timed practice occurs |
| `delete-local-clip` | `npm test -- --grep @claim:delete-local-clip` | PASS | FAIL scope: no history exists before deletion |

The full `npm test` passed 8 unit tests and 10 browser tests. `npm run build` passed and produced `dist/`; the main JavaScript is 30.88 kB raw / 10.30 kB gzip. Passing commands do not close F-3-2 because the observable assertions do not cover the claim text.

## History recheck

Every earlier `review-*.md`, `polish-*.md`, verification report, and the previous handoff was read. Each earlier review finding was checked live and in code.

| Earlier finding | Review 3 result |
| --- | --- |
| F-1-1 job and audience | Fixed. Both are visible before scrolling at both sizes. |
| F-1-2 / F-2-2 realistic one-click demo | Fixed. The shipped spoken sample loads immediately and enters the speaking gap. |
| F-1-3 / F-2-8 demo isolation and cleanup | Fixed. Separate namespace, reset, exit cleanup, and real marker preservation pass live. |
| F-1-4 claims inventory | File and exactly tagged tests now exist. Outcome scope remains covered by F-3-2. |
| F-1-5 / F-2-3 complete claims | Reopened as F-3-2. |
| F-1-6 demo and designed 404 | Fixed. `/demo/` is 200; an unknown route returns the designed page with HTTP 404. |
| F-1-7 / F-2-4 shared shell and focus | Reopened as F-3-1 for the inconsistent mobile header. Direct-route and Back focus now pass. |
| F-1-8 / F-2-5 route metadata | Fixed. Titles, descriptions, canonicals, OG/Twitter, favicon, Apple icon, and theme colour are complete. |
| F-1-9 unavailable purchase | Fixed. No price or purchase action is present. |
| F-1-10 / F-2-6 plain, consistent terms | Reopened as F-3-3. |
| F-1-11 / F-2-7 README jargon | Fixed for the earlier PWA/service-worker wording; the remaining heading/copy issue is F-3-3. |
| F-1-12 mobile overflow | Fixed. Live 390 px width is exactly 390 px. |
| F-2-1 false root demo banner | Fixed. The banner is hidden on `/` and visible on `/demo/`. |
| F-2-9 first-screen facts | Fixed. All action/fact boxes fit both specified viewports. |
| F-2-10 landmarks and touch targets | Fixed in the checked states. AxeBuilder found zero violations and target tests pass. |
| Earlier TLS, deployment, cache, CSP, manifest, and checkout-link findings | Fixed or safely absent. HTTPS/routes/assets work and production headers are present. |

Polish 1 and Polish 2 correctly closed the spoken-sample, demo-cleanup, metadata, first-screen, overflow, and accessibility items. Their “shared shell,” “claims,” and “consistent wording” closures are not confirmed for the reasons above.

## Structure, links, accessibility, and identity

- Root, demo, privacy, terms, and 404 have the expected titles, descriptions, canonical/OG/Twitter metadata, icons, `lang`, one h1, and a main landmark.
- An unknown route returns the designed cassette-style 404 with HTTP 404 and a recovery link.
- All internal links crawled across the route set returned 200; `mailto:` links were treated as explicit external actions.
- Privacy navigation focuses its h1. Browser Back focuses the root h1.
- Live successful routes produced no console or page errors. AxeBuilder found zero violations on all five routes. `/opt/fleet/lib/verify-url.sh` passed the live root in 581 ms.
- The standalone axe CLI was run but could not find its own Chrome binary. The repository’s pinned Playwright 1.58.2 Chromium ran the equivalent AxeBuilder scan successfully.
- The cassette-era study-zine palette, typography, collage, borders, and controls are distinct and match `.factory/design.md`. It is not a generic SaaS template.
- The missing landing privacy/limits section is F-3-4; the inconsistent mobile header is F-3-1.

## Missed leverage / AI

No additional AI feature is justified. Speech scoring is a stated non-goal, and automatic transcription would add network, cost, and privacy complexity to a deliberately local player. Import, backup restore, CSV export, and offline use already exist. No decorative AI, provider key, Azure endpoint, or runtime model call was found.

## What would make this perfect

Expose one consistent mobile header on every route. Prove the real imported-audio repeat sequence, request privacy during that sequence, and deletion of an existing log. Use **audio clip** everywhere, replace the subjective audience sentence and vague README heading, and add the required landing privacy/limits section with matching claims. Then rerun the entire cold, demo, claims, routing, accessibility, and history review. PASS requires zero findings and no untested claim.

**Final result: FAIL.**
