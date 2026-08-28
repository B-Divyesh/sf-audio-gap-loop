# Adversarial first-read review 1 — Audio Gap Loop

**Verdict: FAIL**  
**Reviewed:** 2026-08-28 UTC  
**Target:** <https://audio-gap-loop.sociobot.in/>  
**Method:** fresh Chromium contexts (390×844 and 1440×900), live route/network tests, source review, `npm ci`, `npm test`, and `npm run build`. No product code was changed.

## First 30 seconds

I infer: this repeatedly plays a language clip, leaves a gap to speak, then plays it again; it is for a person with their own audio; click **“Add your first clip.”** That requires inference. The headline **“Listen. Say it. Check.”** does not say what is checked (this product does not score speech), and **“A patient practice loop for language clips you own.”** neither names language learners, parents, or tutors nor explains “practice loop.” The first action requires a file; a visitor cannot try the product.

## Findings

### Blocking

#### F-1-1 — First-screen job and audience are not plain enough

**Quote/location:** hero `h1`, “Listen. Say it. Check.”; lede, “A patient practice loop for language clips you own.”

**Why:** the cold reader has to infer the actual job and intended people; “Check” misleadingly implies assessment.

**Fix:** use **“Practise a language clip in timed repeats”** and **“For language learners, parents, and tutors who want a quiet listen–speak–repeat routine.”**

#### F-1-2 — No one-click try-with-sample-data path

**Evidence:** the hero has “Add your first clip,” which opens a file chooser. `/demo` is HTTP 404, title “Azure Static Web Apps - 404: Not found.” No first screen shows realistic sample audio, transcript, cadence, or completion data.

**Why:** the product is not tryable in 30 seconds. Missing/weak demo is expressly blocking.

**Fix:** add a hero action **“Try a sample practice loop”**. It must open `/demo` straight into a realistic dialogue with transcript, selected line, 3-second gap, and existing practice data.

#### F-1-3 — `?demo=1` is ordinary real storage, not an isolated demo

**Evidence:** a fresh live `?demo=1` context opens IndexedDB database `audio-gap-loop` and creates `agl_queue`; source contains no demo URL handling or `demo:` storage prefix. No **“Demo — sample data, nothing is saved”**, **“Reset demo”**, or **“Start for real”** UI exists.

**Why:** demo activity can mix with a real visitor’s namespace, and the claimed sandbox cannot be verified.

**Fix:** make `/demo` (and `?demo=1`) use a separate `demo:` namespace/database, never read real keys, add the banner/reset/start-real controls, document it in `.factory/demo.md`, and test that demo never reads/writes real data.

#### F-1-4 — Required claims inventory and claim tests do not exist

**Evidence:** `.factory/claims.json` is absent. `rg '@claim:' tests src` found no tags. Thus no listed clean-clone claim command could be run.

**Why:** the passing general suite is not proof that each visitor-facing promise is observable and tested.

**Fix:** add one `claims.json` entry and exactly one `@claim:<id>` clean-demo test for each promise: local-only data, offline reload, import formats/limit, timed repeat, transcript selection, CSV/JSON export, demo isolation/reset, keyboard controls, and any paid flow retained.

#### F-1-5 — All factual landing and README promises are unlisted claims

**Why:** F-1-4 gives every statement below no corresponding claim/test. Each must be removed or added with the named observable sandbox proof; button-presence tests do not count.

| Exact claim location/text | Required observable proof |
| --- | --- |
| hero meta: “Bring your own audio. Listen, pause to speak, and repeat at your pace—privately and offline.” | demo cadence plus worker-controlled offline reload and full request log |
| lede: “It plays the line, leaves you room to speak, then comes back—without scores, streaks, or a cloud account.” | fixture audio asserts play → gap → replay; request/account flow inspection |
| hero: “Audio is stored only in this browser.” | demo import with complete request/storage log |
| empty state: supported formats and “It never leaves this device.” | each format/size boundary import and request log |
| Method: “Your clip plays once.” / “A silent gap gives you room.” / “The clip returns on cue.” | fake-clock cadence fixture |
| Studio: presets, ordered queue, “One purchase; no subscription or account required.” | licensed fixture and billing-contract test, or remove |
| Studio status: purchases being set up / restore claim | controlled restore fixture, or describe only available behavior |
| merchant/refund text | checkout/refund/revocation fixture, or remove |
| locked-tool text: free controls/direct clips | fresh unlicensed demo exercises controls |
| export: complete JSON/audio, CSV, merge semantics | inspect downloads and collision-import fixture |
| asset footer: generated/no stock/no user audio sent | provenance plus demo request log |
| README: formats/100 MB; IndexedDB; 1–30 repeats; 0.6×–1.25×; transcript selection | format/boundary/storage/control/selection tests |
| README: CSV/JSON, PWA offline, safety/keyboard | downloads, offline reload, notice and keyboard tests |
| README: $9/billing/checkout; no account/backend | paid-flow and request tests, or remove/defer |
| README: “Audio never leaves the browser”; only verification request carries data | complete demo-flow outgoing-request allowlist |
| README: last-write-wins/log merge; deployment cache policy | collision fixture; built/deployed header test |

#### F-1-6 — Required demo and designed 404 routes are absent

**Evidence:** live `/demo` and `/404` are Azure generic 404s. Vite has only `/`, `/privacy/`, `/terms/` inputs; there is no `404.html` or 404 override.

**Why:** `/demo` is a required place, and a lost visitor gets a generic host page with no way back. Broken routing is blocking.

**Fix:** build `/demo` and a cassette-style `404.html`, configure the response override, and give 404 a **“Go to Audio Gap Loop”** link.

### Major

#### F-1-7 — Route skeleton and route focus are incomplete

**Evidence:** landing header is home/Workbench/Method/Studio; Privacy and Terms each have only “← Audio Gap Loop.” Their footers link only to the other legal page. After clicking Privacy, `document.activeElement` is `BODY`, not the `h1`; Back does restore the prior URL.

**Fix:** standardize header/footer (wordmark, Demo, Privacy; footer one-liner, Privacy, Terms, Built by Param Factory, build ID). Move focus to a `tabindex=-1` destination `h1` and announce it; add route/back/focus tests.

#### F-1-8 — Canonical, route metadata, and required social/icon assets are incomplete

**Evidence:** all routes lack canonical. Legal routes have no OG/Twitter tags. Landing lacks `og:url`, `og:type`, Twitter card, SVG favicon, and Apple touch icon. Its OG image is 1200×800, not 1200×630.

**Fix:** set per-route title/description/canonical/OG/Twitter; export original cassette art at 1200×630; add SVG favicon and 180px Apple icon.

#### F-1-9 — Unavailable Studio still advertises a price and purchase terms

**Quote:** landing “$9 once” and Terms “Studio costs $9 as a one-time purchase” beside “Studio purchases are being set up.”

**Why:** a visitor sees a price for something they cannot buy. Hiding the formerly broken checkout link does not make the sales promise actionable.

**Fix:** until checkout is enabled and claim-tested, remove price, merchant/refund, and purchase language; say **“Studio extras are not available yet.”**

#### F-1-10 — Landing has metaphor/mood headings and vague button copy

| Exact quote | Why / rewrite |
| --- | --- |
| “Your audio · your pace · stays here” | slogan/vague privacy claim → “Private practice with your own audio” |
| “Bring the sound. Keep the silence.” | mood slogan → delete |
| “The workbench” / “Your practice tapes” / “Your tape box is empty” | cassette metaphors → “Your audio clips” / “Your practice clips” / “No practice clips yet” |
| “No game layer” / “One useful rhythm” | defensive/vague headings → delete / “How timed repeats work” |
| “Your shelf, your data” / “Take everything with you” | metaphor/vague promise → “Export and import your data” / “Export your practice data” |
| “Keep the core free. Keep the extras forever.” | marketing and untested “forever” → “Studio adds saved presets and a practice queue” only when available |
| “+ Add audio” / “Choose an audio clip” / “See the three-step rhythm” | not result-naming → “Import audio file” / “Choose an audio file to import” / “See how timed repeats work” |

#### F-1-11 — README has claim-heavy, jargon-heavy and overlong copy

**Evidence:** “`npm test` runs … reload.” is 26 words; the deployment `staticwebapp.config.json` sentence is 34 words. Unexplained user-facing jargon includes IndexedDB, PWA, Sociobot billing API, last-write-wins, localStorage, and staticwebapp.config.json. The Studio paragraph promises a $9 paid feature while sales are unavailable.

**Fix:** replace with short reader-facing statements, e.g. **“Your clips and practice history stay in this browser. Export a backup before clearing browser data.”** Say **“Run `npm test` to check the app. Run `npm run build` to create `dist/`.”** Move deployment detail to maintainer documentation/test evidence.

### Minor

#### F-1-12 — Mobile is one CSS pixel wider than the viewport

**Evidence:** fresh live 390px Chromium reports `scrollWidth: 391`, `clientWidth: 390`. The previous verification handoff called out the same P4 item; it remains reproducible.

**Fix:** remove the contributing width and make the regression assertion exact (`scrollWidth <= clientWidth`).

## Copy audit

Counts are whitespace-delimited; code blocks are excluded. `C` is F-1-5 (unlisted claim), `PW` is F-1-1/F-1-10/F-1-11. Every visible text unit was checked.

### Landing page

| Text | Words | Result |
| --- | ---: | --- |
| Audio Gap Loop — Listen. Say it. Check. | 7 | PW |
| Bring your own audio. / Listen, pause to speak, and repeat at your pace—privately and offline. | 4 / 10 | C |
| Skip to practice / Audio Gap Loop / Workbench / Method / Studio | 3 / 3 / 1 / 1 / 1 | Workbench PW; others pass |
| Your audio · your pace · stays here / Listen. Say it. Check. | 6 / 4 | PW, C / PW |
| A patient practice loop for language clips you own. / It plays the line, leaves you room to speak, then comes back—without scores, streaks, or a cloud account. | 9 / 19 | PW / C |
| Add your first clip / See the three-step rhythm / Audio is stored only in this browser. | 4 / 5 / 7 | F-1-2 / PW / C |
| Bring the sound. Keep the silence. | 6 | PW |
| The workbench / Your practice tapes / Add audio / Your tape box is empty | 2 / 3 / 2 / 5 | PW |
| Add a short MP3, M4A, WAV, OGG, Opus, or WebM clip that you have permission to use. / It never leaves this device. | 17 / 5 | C |
| Choose an audio clip / No game layer / One useful rhythm | 4 / 3 / 3 | PW |
| Choose a short line. / Hear it at a comfortable speed. / Use the quiet gap to say it yourself. / Hear it again while the sound is still fresh. | 4 / 6 / 8 / 9 | C |
| Listen: Your clip plays once. / Your turn: A silent gap gives you room. / Repeat: The clip returns on cue. | 5 / 8 / 6 | C |
| Optional one-time unlock / Studio extras / $9 once | 3 / 2 / 2 | C / pass / F-1-9 |
| Keep the core free. Keep the extras forever. | 9 | PW, C |
| Save reusable cadence presets / Arrange a calm, ordered clip queue / One purchase; no subscription or account required | 4 / 6 / 7 | C |
| Studio purchases are being set up. / Presets and queues will be available here when checkout is ready. / If you already purchased Studio, you can restore your license alongside. | 6 / 11 / 11 | F-1-9 / C / C |
| Restore a purchase / Already bought Studio? / Paste the license token from your receipt. / Verify license | 3 / 3 / 7 / 2 | C / C / C / pass |
| Sociobot/Dodo is the merchant of record. / Refunds are handled there and revoke the license. | 6 / 8 | C |
| Cadence presets / Available after the one-time unlock. / Core cadence controls remain free. | 2 / 5 / 6 | pass / C / C |
| Practice queue / You can always open any clip directly. | 2 / 8 | pass / C |
| Your shelf, your data / Take everything with you | 5 / 4 | PW |
| Export a complete JSON backup including your audio, or a compact CSV practice log. / Imports merge with what is already here. | 14 / 7 | C |
| Export backup / Export log CSV / Import backup | 2 / 3 / 2 | pass |
| Audio Gap Loop is a quiet tool, not a course or pronunciation judge. | 12 | C |
| Privacy / Terms / Help | 1 / 1 / 1 | pass |
| The cassette collage was generated for this product with the factory image model. / No stock assets or user audio are sent with it. | 13 / 10 | C |

### README

| Text | Words | Result |
| --- | ---: | --- |
| Audio Gap Loop is a calm, browser-only listen–say–check player for short audio you own. | 14 | C |
| It is for language learners, parents, and tutors who want precise repetition timing without scores, streaks, speech grading, or an account. | 21 | C |
| Imports MP3, M4A, WAV, OGG, Opus, and WebM clips up to 100 MB. | 12 | C |
| Keeps audio, transcripts, cadence settings, and completion logs in IndexedDB on the current device. | 12 | C, jargon |
| Plays a clip, waits for a configurable silent speaking gap, and repeats it 1–30 times at 0.6×–1.25× speed. | 18 | C |
| Lets the learner mark one transcript phrase to keep in view. | 10 | C |
| Logs completed sessions locally and exports a CSV log or complete JSON backup, including audio. | 14 | C |
| Installs as a PWA and reloads saved clips offline. / Includes hearing-safe volume guidance and keyboard controls. | 10 / 7 | C, jargon / C |
| Studio is an optional $9 one-time license unlock for reusable cadence presets and an ordered practice queue. | 17 | C, F-1-9 |
| The core player, unlimited clips, safety features, and data export are free. | 11 | C |
| Checkout and license verification use the Sociobot billing API; no payment provider is embedded here. | 14 | C, jargon |
| Public purchase links stay unavailable until the factory enables the product in that billing service, so a release never sends someone to an unavailable checkout. | 22 | C |
| Requires Node.js 20 or newer. / No account, API key, or backend is needed for the core product. | 5 / 11 | C |
| `npm test` runs Vitest unit tests and Playwright end-to-end checks, including an axe accessibility scan, 390 px layout check, real WAV import, IndexedDB persistence, and `context.setOffline(true)` reload. | 26 | PW (>22), C |
| The exact production build command is `npm run build`; output is written to `dist/` with `dist/index.html` at its root. | 17 | C |
| Space: start or pause the cadence. / R: replay from the beginning. / Left Arrow / Right Arrow: seek five seconds. / Escape: close the clip dialog. | 6 / 5 / 8 / 5 | C |
| Every action is also available through labelled buttons and standard form controls. | 12 | C |
| Audio never leaves the browser. | 5 | C |
| IndexedDB stores clips and logs; localStorage stores the selected clip, Studio presets/queue, and any license token. | 15 | C, jargon |
| The only optional network request containing user data is a Studio license verification request. | 14 | C |
| Clearing site storage deletes local material. / Use Export backup first if it matters. | 6 / 7 | C / pass |
| Backup imports use last-write-wins based on each clip’s `updatedAt` value; practice log entries merge by ID. | 16 | C, jargon |
| Production defaults to `https://api.sociobot.in/api/v1`. / A factory staging build can override the billing host without changing code. | 4 / 12 | C |
| After the factory registers and tests checkout for this slug, it must explicitly enable the public purchase CTA in the release build. | 21 | C |
| The product slug is `audio-gap-loop`; no billing product ID or secret is stored in this repository. | 16 | C |
| Deploy the contents of `dist/` as a static site. | 9 | pass |
| Configure clean directory paths so `/privacy/` and `/terms/` resolve to their generated `index.html` files. | 14 | C |
| The generated `staticwebapp.config.json` is part of the artifact: it caches fingerprinted `/assets/*` for one year with `immutable`, keeps the worker and shell revalidated, declares the manifest MIME type, and applies the CSP, permissions, and frame protections. | 34 | PW (>22), C, jargon |
| Do not deploy source `.env` files or modify DNS/billing from this repository. / MIT. See LICENSE. | 12 / 5 | pass |

## Verification notes

- No `.factory/demo.md`, sample fixture, demo storage namespace, reset UI, or demo claim tests exist.
- Fresh normal and `?demo=1` page request logs were same-origin HTML/JS/CSS/art only. That is positive for the empty free flow only, not proof of every privacy claim.
- `npm ci` passed with 0 audit vulnerabilities; `npm test` passed (8 Vitest, 4 Playwright); `npm run build` passed and created `dist/`. No claim commands existed to run.
- Live axe at 390px had no serious/critical violations; fresh desktop/mobile loads had no console/page errors.
- Title/lang/one main h1/description/robots/sitemap/CSP and normal links are present. The cassette study-zine system is distinct and matches the design thesis; it is not a generic SaaS template.
- Read all available `verification*.md` and handoff. No earlier `review-*` or `polish-*` exists. Prior broken checkout link is now hidden; prior cache/security/touch target issues appear fixed. The earlier 1px mobile overflow remains as F-1-12.

## Missed leverage / AI

No AI feature is implied: manual transcript practice is the brief’s appropriate local-first design and speech scoring is a non-goal. No decorative AI or embedded provider key was found.

## What would make this perfect

Provide an isolated, immediately useful demo; state the job/audience/action in plain language; give every factual promise an observable demo test; then complete 404/demo routing, metadata, legal-route skeleton, and the one-pixel overflow. Preserve the distinct calm cassette visual identity and local-first core.

**Final result: FAIL.** A PASS requires zero findings and no untested claims; this release has blocking demo, sandbox, claim, and route failures.
