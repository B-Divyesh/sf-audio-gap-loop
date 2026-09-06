# Review 6 — Practise an audio clip in timed repeats

**Verdict: PASS**

**Reviewed:** 2026-09-06 UTC  
**Live URL:** <https://audio-gap-loop.sociobot.in/>  
**Implementation candidate:** `6ef6790f9b52178cdec1d8b433bd4586e2ea4f61`  
**Documentation baseline:** `4e84220fe3cbaab8fdbf5674236437925b936370`  
**Finding count:** 0  
**Untested claim count:** 0

The implementation and documentation SHAs differ because the commits after `6ef6790` only changed reports. Product code was not changed during this review.

## First screen before scrolling

Fresh Chromium contexts at 390 × 844 and 1440 × 900 gave the same clear answers:

- Job: practise an audio clip in timed repeats.
- Audience: language learners, parents, and tutors using short audio with timed speaking gaps.
- First action: **Try sample practice**.
- Result: it opens a spoken French greeting with a three-second speaking gap.

The action, result, and three privacy/offline facts fit before scrolling. The last fact ended at y=778 on the phone and y=660 on desktop. Both layouts had exact viewport width and no console or page errors.

## Sample practice and real-data isolation

The first action opened `/demo/` in one click. The page immediately showed **French greeting**, selected **Bonjour.**, a three-second speaking gap, three repeats, and an existing three-repeat practice entry.

The persistent label read **“Demo — sample data is temporary and separate.”** It kept **Reset demo** and **Start for real** visible. After changing the gap to seven seconds, reset restored three seconds and the original history. Starting for real removed the `demo:` storage keys and `demo:audio-gap-loop` database while retaining an imported real audio clip. No sample action changed real data.

The sample, normal practice, export, restore, and reset flows made no third-party practice request.

## Clean checkout and declared claims

Detached checkout: `/tmp/audio-gap-loop-review6.lNbr7e/clean` at the implementation candidate. Node.js 22.23.2 satisfies the documented Node.js 20 minimum.

| Check | Result |
| --- | --- |
| `npm ci` | PASS — 71 packages installed; 0 vulnerabilities. |
| `npm test` | PASS — 13 unit/contract tests and 17 browser tests. |
| `npm run build` | PASS — `dist/` produced. |
| `npm audit --audit-level=high` | PASS — 0 vulnerabilities. |
| Build budget | PASS — main JS 31.11 kB raw / 10.33 kB gzip; main CSS 18.23 kB raw / 4.75 kB gzip. |

Every exact command in `.factory/claims.json` was run independently from the clean checkout.

| Claim | Result | Observable proof |
| --- | --- | --- |
| `sample-spoken-loop` | PASS | Shipped spoken audio, selected line, three-second gap, three repeats, existing log, and speaking-gap transition passed. |
| `real-timed-repeats` | PASS | Imported WAV, second transcript line, Listen → Your turn → Listen → complete, and saved history passed. |
| `demo-isolation` | PASS | Mutation, reset, exit cleanup, and preservation of real data passed. |
| `offline-reload` | PASS | Demo and imported real audio both reloaded offline after first visit. |
| `csv-export` | PASS | Downloaded header and one row per demo practice entry passed. |
| `backup-export-import` | PASS | Audio-inclusive backup inspection and restore into a fresh real workspace passed. |
| `local-only-storage` | PASS | Imported audio, transcript selection, timing, and history persisted with no third-party practice request. |
| `delete-local-clip` | PASS | Deleting a clip with history emptied both clip and log stores. |
| `product-boundaries` | PASS | No speech scoring, lessons, hearing test, pronunciation assessment, analytics, or advertising action was exposed. |
| `artwork-provenance` | PASS | Source sidecar, generator record, shipped asset, and footer disclosure matched. |
| `static-build` | PASS | Player, demo, legal, 404, and deployment artifacts existed in `dist/`. |

Landing, demo, player, legal, offline, metadata, footer, and README copy were compared with the inventory. No public claim was missing, false, incomplete, or untested.

## Normal, invalid, boundary, and recovery paths

| Path | Result |
| --- | --- |
| Import WAV, choose a transcript line, run timed repeats, save and reload history | PASS |
| Blank audio title and unchecked rights confirmation | PASS — save stayed blocked. |
| Non-audio file | PASS — rejected with a plain retry instruction. |
| Audio file at exactly 100 MiB | PASS — accepted into the import dialog. |
| Audio file at 100 MiB + 1 byte | PASS — rejected with trim-and-retry guidance. |
| Repeats below and above range | PASS — normalized to 1 and 30. |
| Malformed JSON and wrong-schema backup | PASS — both showed the same plain retry instruction, without parser wording. |
| Recovery after invalid backup | PASS — import remained available. |
| Delete cancellation | PASS — the clip remained. |
| Delete confirmation with existing history | PASS — the clip and its history were removed. |

The browser-storage failure state names the problem and tells the user to check storage settings and reload. It was inspected in source; an actual browser storage subsystem failure was not forced because that would not provide a reliable user-level condition.

## Mobile, keyboard, accessibility, and motion

- Fresh phone and desktop screenshots were visually inspected. The cassette-era study-zine design matches `.factory/design.md`, is readable, and is not a generic product template.
- The shared mobile header exposes Demo, How it works, and Privacy. The 390 px page has no horizontal overflow. Text at 200% remains usable.
- Global Space and R controls start, pause, and restart practice. Tab reaches every visible control without a trap. The skip link moves the next tab stop into main content.
- Route navigation and browser Back focus the destination h1. The import dialog focuses **Audio clip title**; Escape closes it and returns focus to **Import audio file**.
- Checked controls meet the 44 px target rule. Focus uses a visible designed outline.
- Reduced motion sets the hero transform and animation to none, transitions to 0.01 ms, and scroll behavior to auto.
- AxeBuilder and standalone Axe CLI found zero violations on root, demo, privacy, terms, and the designed 404.
- `/opt/fleet/lib/verify-url.sh` passed: HTTP 200, correct title and language, one h1, main landmark, complete image alternatives and button names, and zero unexpected errors.

## Offline, updates, privacy, routes, and deployment

- The demo and an imported real audio clip reloaded offline after their first visits.
- A seeded old cache was removed by the current worker and the existing page showed **“A new offline version is ready. Reload when convenient.”**
- The manifest has standalone display, a versioned start URL, 192/512/maskable icons, and palette-matching colors.
- No analytics, advertising, external font/script, audio upload, transcript upload, or other third-party practice request occurred.
- Root, demo, privacy, and terms returned 200 with route-specific titles, one h1, a main landmark, complete metadata, and working internal links.
- `/review-6-deliberate-missing` returned the expected HTTP 404, title **Page not found — Audio Gap Loop**, the designed recovery page, and a working home link. Its browser failed-resource line is expected and is not a defect.
- Live responses include restrictive CSP, anti-framing, permissions policy, `nosniff`, strict-origin referrer policy, HSTS, immutable hashed assets, a no-cache service worker, and the correct manifest MIME type.
- All 26 public build files match production byte for byte. The live bundle `main-x_O7-drX.js` has SHA-256 `012c4fe63609874ad7cca300201fdf4f9fc0a3441a47f8c2d3dcc6d62793537c`.
- The complete live browser suite passed 17/17 after the documented build step.
- Lighthouse mobile: Performance 100, Accessibility 100, Best Practices 100, SEO 100; LCP 1,361 ms, CLS 0, TBT 8 ms, 124,092 bytes transferred.

This is a static local-first PWA with no backend. Tenant isolation, server restart persistence, health, and 429/`Retry-After` checks do not apply. It is not a CLI, library, desktop, or mobile binary, so installed-consumer checks do not apply.

## Earlier finding disposition

Every earlier review, verification, and polish report was read. Each recorded item was checked against the implementation and live site.

| Earlier item | Current proof and disposition |
| --- | --- |
| F-1-1 | Closed — job and audience are explicit before scrolling. |
| F-1-2 | Closed — one-click spoken sample opens populated. |
| F-1-3 | Closed — demo namespace, reset, exit cleanup, and real-data preservation pass. |
| F-1-4 | Closed — 11 claims each have exactly one tagged test. |
| F-1-5 | Closed — public capability claims have outcome-level proofs. |
| F-1-6 | Closed — demo route and designed HTTP 404 work. |
| F-1-7 | Closed — shared shell and route/Back focus pass. |
| F-1-8 | Closed — route metadata and identity assets are complete. |
| F-1-9 | Closed — no unavailable price or purchase action is rendered. |
| F-1-10 | Closed — task terms and actions are plain and consistent. |
| F-1-11 | Closed — README setup and use copy is short and direct. |
| F-1-12 | Closed — phone width is exactly 390/390. |
| F-2-1 | Closed — the sample label appears only in demo mode. |
| F-2-2 | Closed — the licensed spoken sample replaced the tone. |
| F-2-3 | Closed — real playback, privacy, deletion, exports, and provenance have outcome proofs. |
| F-2-4 | Closed — shell and Back focus are consistent. |
| F-2-5 | Closed — every route has complete metadata. |
| F-2-6 | Closed — former alternate terms and vague controls are absent. |
| F-2-7 | Closed — former README jargon is absent. |
| F-2-8 | Closed — leaving demo removes demo storage. |
| F-2-9 | Closed — required first-screen content fits phone and desktop. |
| F-2-10 | Closed — landmarks, Axe, and target sizes pass. |
| F-3-1 | Closed — mobile header links are visible on every route. |
| F-3-2 | Closed — imported-audio repeats, full-flow privacy, and history deletion are proved. |
| F-3-3 | Closed — **audio clip** and other task terms are consistent. |
| F-3-4 | Closed — the landing privacy and limits section is present and tested. |
| Initial TLS and Azure 404 | Closed — HTTPS and all public artifacts pass. |
| Playwright browser mismatch | Closed — Playwright 1.58.2 is pinned and uses the supplied browser. |
| Cache, touch, CSP, permissions, anti-framing, and manifest MIME | Closed — repository checks and live responses pass. |
| Checkout 404 | Safely absent — no price, paid offer, buy link, restore field, merchant promise, or refund flow is shown. |
| One-pixel live phone overflow | Closed — current live width is exactly 390/390. |
| F-5-1 invalid-backup parser text | Closed — malformed and wrong-schema backups now show the same plain recovery message locally and live. |

No obvious AI-assisted step is missing. Speech scoring is a stated non-goal, and network transcription would conflict with the focused local-first job. Import, backup restore, CSV export, and offline use cover the useful adjacent steps implied by the brief.

## Remaining external dependency

Sociobot billing registration remains external. No paid offer is currently exposed, so there is no broken purchase path. A future paid release still needs checkout, return, restore, verification, and revocation testing before its action is shown.

**Final verdict: PASS — 0 findings and 0 untested claims.**
