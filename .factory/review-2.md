# Adversarial first-read review 2 — Audio Gap Loop

**Verdict: FAIL**

**Reviewed:** 2026-08-29 UTC

**Target:** <https://audio-gap-loop.sociobot.in/>

**Candidate:** `4172787b16974d5370392658b5fba1a0fa0dcdf6`

**Method:** fresh Chromium contexts at 390×844 and 1440×900, live demo/storage/network/offline tests, route crawl, axe scan, source/history review, and all claim commands from a separate clean clone. No product code was changed.

## First 30 seconds

Before scrolling, I understood the job as: play a language clip, pause so I can speak, then repeat it. The named audience is language learners, parents, and tutors.

I could not give one unambiguous answer to “what should I click first?” The intended action is **“Try a sample practice loop,”** but a fresh `/` visit first shows **“Demo — sample data, nothing is saved,” “Reset demo,”** and **“Start for real.”** The page therefore says I am already in a demo while also asking me to enter the demo. This is blocking. The screenshot and runtime state confirm it at both viewports.

At 390 px the action explanation ends at 820 px; the first of the required three facts starts at 842 px and is clipped. At 1440 px the primary button runs from 853–901 px in a 900 px viewport, and the facts are below the fold.

## Findings

### Blocking

#### F-2-1 — The cold landing page falsely says the real-data flow is a demo

**Quote/location:** `/`, above the hero: **“Demo — sample data, nothing is saved.”**, **“Reset demo”**, and **“Start for real.”** The same page later says **“No practice clips yet.”**

**Evidence:** a fresh `/` context opened the real `audio-gap-loop` IndexedDB database and wrote the unprefixed `agl_queue` key. `Start for real` navigated back to `/`, where the same banner remained visible. In source, `index.html` correctly gives the banner `hidden`, but `.demo-banner { display: flex; }` overrides that state.

**Why this fails:** the first action is ambiguous, “nothing is saved” is false for the page currently shown, and a visitor may import real audio while relying on the demo notice.

**Concrete fix:** add `.demo-banner[hidden] { display: none; }` or the global equivalent, render demo controls only in demo mode, and add a test that `/` has no demo banner while an imported real clip persists. Keep `/demo/` as the only bannered sample route.

#### F-2-2 / F-1-2 reopened — The “bakery dialogue” is a tone, not realistic language sample data

**Quote/location:** demo intro, **“Try the prepared bakery dialogue.”**; `.factory/claims.json`, **“The demo opens a prepared dialogue…”**

**Evidence:** `makeSampleAudio()` in `src/main.ts` creates two seconds of `Math.sin(index / 13) * 1500`, a constant approximately 98 Hz tone. There is no spoken dialogue in the audio. The passing `@claim:sample-loop` test checks labels, a selected transcript button, the gap value, and existing log text; it never plays or validates the claimed dialogue.

**Why this fails:** the one-click demo cannot demonstrate the product’s listen–speak–repeat job with realistic data. The listed claim is not proved by its test.

**Concrete fix:** ship a short, original or properly licensed spoken bakery exchange that matches the transcript, record its provenance, and test playback through listen → speaking gap → repeat. The fixture test should identify the known audio asset and assert the observable phase transitions, not only nearby labels.

#### F-2-3 / F-1-5 reopened — Product claims remain unlisted or do not have outcome-level proofs

**Unlisted live claims:**

- `/`: **“Add a short MP3, M4A, WAV, OGG, Opus, or WebM clip…”**, **“It never leaves this device,”** **“Your saved clips and practice tools still work,”** **“Play the selected clip,”** **“Use the chosen silent gap,”** **“Play the clip again,”** **“The practice player and data exports are ready to use,”** **“Download a backup with your clips or a CSV practice log,”** and **“User audio is not sent with it.”**
- `/privacy/`: **“The practice player stores clips and practice history in this browser,”** **“The product does not include analytics or advertising,”** and **“You can delete individual clips and their history in the player.”**
- README: the normal-flow import, transcript, selection, timing, browser storage, CSV/JSON export, static deployment, and service-worker statements.

**Incomplete listed proofs:**

- `@claim:sample-loop` does not validate spoken sample audio or a listen/gap/repeat cycle.
- `@claim:demo-isolation` does not seed and compare real IndexedDB, mutate demo state before Reset, or assert that leaving demo clears it.
- `@claim:local-only-demo` selects a transcript line and exports CSV, but does not import audio, play cadence, reset, or leave demo despite calling itself the “complete demo flow.” It therefore cannot prove the user-audio privacy sentence.

**Why this fails:** a visitor can rely on these statements, but `.factory/claims.json` does not provide one observable sandbox test for each. A passing command is not proof when the asserted behavior is weaker than the claim.

**Concrete fix:** add normal-mode fixture tests for supported formats, local-only import, cadence, offline reload, deletion, and export/import; add a request-log test that actually imports user audio; strengthen the three demo tests above. Otherwise remove or narrow each sentence to the behavior currently proved.

#### F-2-4 / F-1-7 reopened — Route shell and back-button focus are still inconsistent

**Exact locations:** the root header has **Demo / How it works / Privacy**; demo and legal headers have **Demo / Privacy / Terms**; the 404 header has **Demo / Privacy**. Root, demo, legal, and 404 footers also expose different one-liners, links, provenance, Help, and build text.

**Evidence:** Privacy received focus on direct navigation, but browser Back returned to `/` at the restored scroll position with `document.activeElement === BODY`. The root does not run the route-focus behavior used by legal pages.

**Why this fails:** navigation changes by route, and keyboard/screen-reader users lose a meaningful focus point on Back. Polish 1 marked F-1-7 fixed, so this is a half-fixed historical finding and is blocking again.

**Concrete fix:** use one shared header/footer contract across every route. On page navigation and back/forward, restore the prior meaningful focus target or focus and announce the destination `h1`; add a Back/Forward assertion rather than only checking direct legal-page load.

#### F-2-5 / F-1-8 reopened — Route metadata is only partially complete

**Exact locations:** `/demo/` has only `twitter:card`, with no Twitter title, description, or image. `/privacy/` and `/terms/` lack `og:url` and all Twitter fields except the card. The 404 lacks `theme-color`, `og:image`, Twitter title/description/image, and an Apple touch icon.

**Why this fails:** route previews and install identity are inconsistent even though Polish 1 marked F-1-8 fixed.

**Concrete fix:** give every route the full canonical, Open Graph, Twitter, favicon, Apple touch icon, and theme-color set required by the site structure. Add a built-route metadata test for every route.

#### F-2-6 / F-1-10 reopened — Product copy still uses metaphor, jargon, inconsistent terms, and vague actions

| Exact copy | Problem | Concrete rewrite |
| --- | --- | --- |
| “Choose an audio clip” | Opens an import dialog; this exact label was previously marked fixed but remains. | “Import audio file” |
| “Clip shelf” | Cassette metaphor and inconsistent with “audio clips.” | “Audio clips” |
| “Check” | Implies assessment although speech scoring is excluded. | “Hear again” |
| “Start cadence” | Unexplained jargon and inconsistent with “timed repeats.” | “Start timed repeats” |
| “Done for now” | Does not name its result: it commits a practice session. | “Save practice session” |
| “silent gap” / “speaking gap” | Two names for the same control. | Use “speaking gap” everywhere. |
| “repetitions” / “repeats” | Two names for the same count. | Use “repeats” everywhere. |
| Terms h1, “Use audio you may use.” | Tautological and does not name the page. | “Terms for using Audio Gap Loop” |

**Why this fails:** a first-time visitor has to translate the interface vocabulary, and one label again suggests product assessment. This reopens the earlier F-1-10.

**Concrete fix:** apply the rewrites above and update the terminology audit from the actual rendered empty and populated states.

#### F-2-7 / F-1-11 reopened — README still uses unexplained implementation jargon

**Quote/location:** README, **“The PWA service worker caches the shell for offline reloads.”**

**Why this fails:** “PWA,” “service worker,” and “shell” do not help a reader run or use the product. F-1-11 explicitly required removal of this jargon and was marked fixed.

**Concrete fix:** delete this redundant sentence; the preceding tested sentence already says **“The demo can reload offline after its first visit.”** Keep implementation details in maintainer notes only.

### Major

#### F-2-8 — “Nothing is saved” conflicts with persistent demo state

**Quote/location:** `/demo/` banner, **“Demo — sample data, nothing is saved.”**

**Evidence:** changing the speaking gap from 3 to 7 seconds, selecting **Start for real**, and returning to `/demo/` restored 7 seconds. `demo:audio-gap-loop`, `demo:agl_selected_clip`, and `demo:agl_queue` remained after leaving. Reset itself works: it restored the changed gap to 3 seconds and showed the reset confirmation. Real data remained in the separate namespace.

**Why this fails:** isolation is good, but the banner and demo contract say demo changes are not saved and should be discarded on exit.

**Concrete fix:** have **Start for real** delete `demo:audio-gap-loop` and all `demo:` keys before navigating. Alternatively use an in-memory demo, then test that re-entering starts from the fixture.

#### F-2-9 — Required first-screen facts are below the fold

**Quote/location:** hero facts below the primary action: **“Sample data stays separate from your clips,” “Bring audio you have permission to use,”** and **“Export a backup before clearing browser data.”**

**Evidence:** at 390×844 the first fact begins at y=842 and is clipped; the other two are below it. At 1440×900 the primary action itself ends at y=901 and the facts are lower.

**Why this fails:** the plain-words first-screen shape requires the primary action, its outcome, and three short facts in one screen.

**Concrete fix:** first remove the erroneous root banner, then reduce hero minimum height/type scale or tighten spacing. Add bounding-box tests at both specified viewports for the action note and all three facts.

#### F-2-10 — Landmark and touch-target checks still fail

**Quote/location:** the yellow demo banner on `/` and `/demo/`; the demo **“Clip shelf”** region; **“Reset demo,” “Start for real,”** the repetitions input, legal-page email links, and 404 **“Go to Audio Gap Loop.”**

**Evidence:** live axe reports `region` on the demo-banner text at `/` and `/demo/`, and `landmark-complementary-is-top-level` on the demo’s nested `<aside>`. Visible demo banner buttons are 40 px high; the repetitions input is 34 px; legal inline links are 19 px high; and the 404 recovery link is 19 px high.

**Why this fails:** content sits outside a landmark, the clip list uses an invalid complementary-landmark relationship, and several controls do not meet the required 44 px target. The repository axe test filters out moderate violations, so it reports green despite these failures.

**Concrete fix:** place the banner in a labelled landmark, change the nested `aside` to an appropriate labelled section/navigation region, and provide 44×44 px hit areas. Test the semantic structure and target boxes explicitly.

## Demo and sandbox result

- One-click route: present. **Try a sample practice loop** opens `/demo/`.
- Immediate populated UI: present. The first demo viewport shows the named sample clip, selected state, and three logged repeats.
- Realistic sample: fail; the audio is a sine tone rather than the stated dialogue.
- Banner: present on demo, but incorrectly visible on real mode and inaccurate about persisted demo settings.
- Reset: works after mutation; a 7-second gap returned to 3 seconds.
- Isolation: demo uses `demo:audio-gap-loop` and `demo:` localStorage keys; real data was not overwritten.
- Exit cleanup: fail; **Start for real** leaves demo storage intact.
- Request log: demo navigation, reset, export, real-mode return, and offline reload used only the product origin and `blob:` audio URLs. No analytics, CDN, or third-party request appeared.
- Offline: after service-worker control, a live `/demo/` reload succeeded offline and restored the sample player.

## Claims verification

Clean clone: `/tmp/audio-gap-loop-review2.ROY8bs/clean`.

| Claim | Exact command | Command result | Contract result |
| --- | --- | --- | --- |
| `sample-loop` | `npm test -- --grep @claim:sample-loop` | PASS | FAIL: no spoken audio or cadence outcome asserted. |
| `demo-isolation` | `npm test -- --grep @claim:demo-isolation` | PASS | FAIL: Reset is not tested after mutation; real IndexedDB and exit cleanup are not asserted. |
| `offline-reload` | `npm test -- --grep @claim:offline-reload` | PASS | PASS; independently repeated live. |
| `csv-export` | `npm test -- --grep @claim:csv-export` | PASS | PASS; downloaded header and row count are asserted. |
| `backup-export` | `npm test -- --grep @claim:backup-export` | PASS | PASS; downloaded JSON contains the sample clip. |
| `local-only-demo` | `npm test -- --grep @claim:local-only-demo` | PASS | FAIL: the test does not exercise the complete flow or any user-audio import. |

`npm test` also passed all 8 unit and 8 Playwright tests. `npm run build` passed and produced `dist/`; main JS is 30.29 kB raw / 10.32 kB gzip. Passing commands do not cure the claim-scope defects above.

## Copy audit

Counts are whitespace-delimited. I included metadata, navigation, headings, buttons, empty-state copy, offline copy, footer copy, and import-dialog copy so result-affecting fragments are not hidden from the audit. No item exceeds 22 words and no banned marketing adjective appears. Flags refer to findings above.

### Landing page

| Exact rendered copy | Words | Result |
| --- | ---: | --- |
| Audio Gap Loop — Timed language practice | 7 | pass |
| Practise language clips with a timed listen, speaking gap, and repeat routine. | 12 | pass |
| Skip to practice | 3 | pass |
| Audio Gap Loop | 3 | pass |
| Demo | 1 | pass |
| How it works | 3 | pass |
| Privacy | 1 | pass |
| Demo — sample data, nothing is saved. | 7 | F-2-1, F-2-8 |
| Reset demo | 2 | pass label; 40 px target (F-2-10) |
| Start for real | 3 | pass label; exit behavior fails (F-2-8) |
| Timed speaking practice | 3 | pass |
| Practise a language clip in timed repeats | 7 | pass |
| For language learners, parents, and tutors who want a quiet listen–speak–repeat routine. | 12 | pass |
| Try a sample practice loop | 5 | pass label; sample fails F-2-2 |
| Opens a prepared dialogue with a selected line and a 3-second speaking gap. | 13 | F-2-2 |
| Sample data stays separate from your clips. | 7 | listed, proof incomplete (F-2-3) |
| Bring audio you have permission to use. | 7 | pass |
| Export a backup before clearing browser data. | 7 | pass instruction |
| Listen · speak · repeat | 5 | pass |
| Practice player | 2 | pass |
| Your audio clips | 3 | pass |
| Import audio file | 3 | pass |
| Offline. | 1 | pass status |
| Your saved clips and practice tools still work. | 8 | unlisted normal-mode claim (F-2-3) |
| No practice clips yet | 4 | pass |
| Add a short MP3, M4A, WAV, OGG, Opus, or WebM clip that you have permission to use. | 17 | unlisted format claim (F-2-3) |
| It never leaves this device. | 5 | unlisted normal-mode privacy claim (F-2-3) |
| Choose an audio clip | 4 | vague action (F-2-6) |
| How it works | 3 | pass |
| How timed repeats work | 4 | pass |
| Choose a transcript line. | 4 | unlisted function claim (F-2-3) |
| Hear the clip. | 3 | unlisted cadence claim (F-2-3) |
| Speak in the gap. | 4 | unlisted cadence claim (F-2-3) |
| Hear it again. | 3 | unlisted cadence claim (F-2-3) |
| Listen | 1 | pass |
| Play the selected clip. | 4 | unlisted cadence claim (F-2-3) |
| Speak | 1 | pass |
| Use the chosen silent gap. | 5 | inconsistent term; unlisted claim (F-2-3, F-2-6) |
| Repeat | 1 | pass |
| Play the clip again. | 4 | unlisted cadence claim (F-2-3) |
| Optional tools | 2 | pass |
| Studio extras | 2 | pass |
| Studio extras are not available yet. | 6 | honest current state |
| The practice player and data exports are ready to use. | 10 | broad unlisted claim (F-2-3) |
| Export and import | 3 | pass |
| Export your practice data | 4 | pass |
| Download a backup with your clips or a CSV practice log. | 11 | unlisted normal-mode claim (F-2-3) |
| Export backup | 2 | pass button |
| Export log CSV | 3 | pass button |
| Import backup | 2 | pass button |
| Audio Gap Loop helps you practise a clip without speech scoring. | 11 | pass scope sentence |
| Privacy · Terms · Help | 5 | pass |
| Cassette artwork was generated for this product. | 7 | provenance needs static proof (F-2-3) |
| User audio is not sent with it. | 7 | unlisted normal-mode privacy claim (F-2-3) |
| Build f0e7e9a-polish-1 · Built by Param Factory | 7 | pass |
| Clip details | 2 | pass |
| Add a practice clip | 4 | pass |
| Close dialog | 2 | pass accessible name |
| Clip title | 2 | pass |
| Transcript (one phrase per line) | 5 | pass |
| During practice, choose the line you want to keep in view. | 11 | unlisted function claim (F-2-3) |
| I have permission to use this audio. | 7 | pass confirmation |
| Cancel | 1 | pass in dialog context |
| Save clip locally | 3 | pass |

Populated-state labels checked separately: **“Clip shelf”** (2), **“Check”** (1), **“Start cadence”** (2), and **“Done for now”** (3) are flagged in F-2-6.

### README

Code commands are excluded because they are commands, not sentences. Route and file-list fragments are included.

| Exact rendered copy | Words | Result |
| --- | ---: | --- |
| Audio Gap Loop | 3 | pass heading |
| Practise a language clip in timed repeats. | 7 | unlisted normal-mode claim (F-2-3) |
| It is for learners, parents, and tutors who want a quiet listen–speak–repeat routine. | 13 | pass |
| Try the prepared sample at audio-gap-loop.sociobot.in/demo/. | 6 | sample is not a dialogue (F-2-2) |
| The demo is separate from your own browser data and includes a reset control. | 14 | listed, proof incomplete (F-2-3) |
| Use it | 2 | pass heading |
| Import audio you have permission to use. | 7 | unlisted function claim (F-2-3) |
| Add transcript lines. | 3 | unlisted function claim (F-2-3) |
| Select one line. | 3 | unlisted function claim (F-2-3) |
| Set the silent gap and repetitions. | 6 | unlisted claim; inconsistent terms (F-2-3, F-2-6) |
| Export a CSV log or JSON backup when needed. | 9 | unlisted normal-mode claim (F-2-3) |
| The player keeps imported material in browser storage. | 8 | unlisted privacy/storage claim (F-2-3) |
| Export a backup before clearing site data. | 7 | pass instruction |
| The demo can reload offline after its first visit. | 9 | listed and proved |
| The claims and their browser proofs are listed in .factory/claims.json. | 10 | inaccurate completeness claim (F-2-3) |
| Run and verify | 3 | pass heading |
| Requires Node.js 20 or newer. | 5 | pass maintainer requirement |
| npm run build creates dist/. | 5 | verified |
| The static deploy serves that directory. | 6 | verified live |
| The PWA service worker caches the shell for offline reloads. | 10 | jargon (F-2-7) |
| Routes | 1 | pass heading |
| player and import flow | 4 | pass route description |
| isolated sample loop | 3 | exit persistence qualifies this (F-2-8) |
| legal information | 2 | pass route description |
| recovery page | 2 | pass route description |
| Project files | 2 | pass heading |
| player and demo behaviour | 4 | pass file description |
| browser database access | 3 | pass file description |
| offline cache | 2 | pass file description |
| demo namespace and reset details | 5 | pass file description |
| visual system and asset provenance | 5 | pass file description |
| License | 1 | pass heading |
| MIT. | 1 | pass |
| See LICENSE. | 2 | pass |

### Terminology check

| Concept | Terms currently used | Required single term |
| --- | --- | --- |
| Imported sound | audio, audio clip, practice clip, sample audio clip | audio clip |
| Pause for the learner | speaking gap, silent gap | speaking gap |
| Practice sequence | routine, timed repeats, cadence, practice loop | timed repeats |
| Count | repeats, repetitions | repeats |
| Clip collection | audio clips, clip shelf | audio clips |

## History recheck

Every earlier review, polish report, handoff, and verification report was read. The live site and source were checked rather than accepting closure notes.

| Earlier item | Current result |
| --- | --- |
| F-1-1 job/audience | Fixed in the hero. |
| F-1-2 one-click demo | Reopened as F-2-2: route exists, but sample audio is not realistic dialogue. |
| F-1-3 isolated demo namespace | Fixed for cross-namespace isolation; exit cleanup now fails separately as F-2-8. |
| F-1-4 claims inventory | File and tagged tests now exist. Their scope defects are covered by F-2-3. |
| F-1-5 unlisted claims | Reopened as F-2-3. |
| F-1-6 demo/404 routes | Fixed: `/demo/` is 200; an unknown URL is a designed HTTP 404 with a recovery link. |
| F-1-7 route shell/focus | Reopened as F-2-4. |
| F-1-8 route metadata | Reopened as F-2-5. |
| F-1-9 unavailable purchase | Fixed: no price or purchase action is exposed. |
| F-1-10 plain UI copy | Reopened as F-2-6; the exact “Choose an audio clip” label remains. |
| F-1-11 README copy | Reopened as F-2-7 for remaining jargon; all sentence lengths now pass. |
| F-1-12 mobile overflow | Fixed: live width is exactly 390/390. |
| Earlier TLS/deployment, cache, CSP, manifest MIME, and checkout-link findings | Fixed or safely hidden. Live HTTPS is 200; fingerprinted assets are immutable; worker/manifest revalidate; CSP and permissions headers are present. |
| Polish 1 “Known gaps: none” | Not confirmed; findings above remain or regressed. |

## Structure, links, accessibility, and visual identity

- Titles, `lang`, one `h1`, `main`, descriptions, canonicals, favicons, robots, sitemap, and the designed 404 are present on the checked routes. Metadata exceptions are F-2-5.
- All crawled internal links and required assets returned 200. The intentionally missing route returned the designed page with HTTP 404. `mailto:` links were treated as explicit external actions.
- Direct legal-route load focuses its `h1`; Back to `/` restores scroll but leaves focus on `BODY` (F-2-4).
- Live loads had no application console/page errors. The browser emits the expected failed-resource message for the deliberately requested 404 URL.
- Axe had no serious or critical issues, but the two moderate landmark failures in F-2-10 are real semantic defects.
- The cassette-era study-zine art, palette, type, and physical-control language are distinctive and match `.factory/design.md`; this is not a generic SaaS template.
- The live verifier passed title, language, one h1, main, alt text, labelled buttons, and root console checks.

## Missed leverage / AI

No additional AI feature is justified. Speech scoring is a stated non-goal, and automatic transcription would add network/privacy/cost complexity to a focused local practice player. Import and export already exist. The obvious missing leverage is not AI; it is an actual spoken sample in the existing demo, covered by F-2-2.

## What would make this perfect

Hide the demo banner in real mode, replace the tone with a real spoken sample, discard demo state on exit, and make every user-facing claim match one outcome-level test. Then finish the route metadata/shared shell/back-focus work, use one vocabulary throughout, fit the three facts above the fold, and clear all landmark/touch-target failures. Re-run this entire review from fresh contexts; PASS requires zero findings and no untested claim.

**Final result: FAIL.**
