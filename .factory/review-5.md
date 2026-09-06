# Review 5 — Practise audio clips in timed repeats

**Verdict: FAIL**

**Reviewed:** 2026-09-06 UTC

**Live URL:** <https://audio-gap-loop.sociobot.in/>

**Implementation candidate:** `f690790702da06d746fc7354f01d1d7886b4c809`

**Documentation SHA before this report:** `cea5c72caeb27bcc4e7aca25cdf8c2c804e56f12`

**Finding count:** 1 minor

**Untested claim count:** 0

The live site matches all 26 public files built from the implementation candidate. Later commits through `cea5c72` change reports only and do not require another product image.

## Result

The main job works on phone and desktop. A learner can import permitted audio, select a transcript line, set a speaking gap and repeats, complete practice, retain the local log, export data, and reload saved clips offline.

The review is still **FAIL** because one invalid-backup path does not use plain words or tell the user what to do next. PASS requires no findings.

## First screen before scrolling

Fresh 390×844 and 1440×900 browser contexts gave the same clear answers:

- **Job:** practise an audio clip in timed repeats.
- **Audience:** language learners, parents, and tutors using short audio.
- **First action:** **Try sample practice**. The adjacent text says it opens a spoken French greeting with a three-second speaking gap.

The action, its explanation, and all three facts fit without scrolling. The last fact ended at y=778 on the 844 px phone and y=660 on the 900 px desktop. Both pages had zero horizontal overflow and no console or page errors.

## Finding

### F-5-1 — Invalid backup errors do not give plain recovery guidance

**Severity:** Minor

**Location:** live `/`, **Import backup**, invalid JSON input.

**Evidence:** in a fresh phone context, importing a file containing `{broken` displayed:

> Expected property name or '}' in JSON at position 1 (line 1 column 2)

A valid JSON file with the wrong schema displayed:

> This is not an Audio Gap Loop backup.

The first message exposes parser wording. Neither message tells the user what to do next. The app remains usable, and valid backup export and restore pass, so this is not a broken main path.

**Required change:** replace parser text with one plain message that names the problem and next action, such as: “This backup could not be read. Choose an Audio Gap Loop backup and try again.” Add an invalid-backup browser test that asserts that recovery copy.

## Sample and data isolation

- The root action opened `/demo/` in one click.
- The first demo view contained **French greeting**, selected **Bonjour.**, a 3-second speaking gap, three repeats, and an existing three-repeat practice entry.
- The persistent banner read **“Demo — sample data is temporary and separate.”** It remained present through demo actions.
- After changing the gap to seven seconds, **Reset demo** restored three seconds.
- Repeat boundaries normalized `0 → 1` and `31 → 30`.
- **Start for real** removed every `demo:` key and the `demo:audio-gap-loop` database while preserving a real-namespace marker.
- The complete sample flow made only same-origin and browser-local `blob:` requests.

No existing or external user data was used. All browser contexts were fresh.

## Claims

Clean detached checkout: `/tmp/audio-gap-loop-review5.pn02cI` at the implementation candidate. Node.js 22.23.2 satisfies the documented Node.js 20 minimum. `npm ci` completed with zero vulnerabilities.

Every exact command in `.factory/claims.json` passed independently:

| Claim | Result |
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

Landing, demo, legal, offline, metadata, and README copy were cross-checked against the inventory. No unlisted or untested capability claim was found. The invalid-backup defect is recovery copy, not a missing proof for the valid backup claim.

## Normal, invalid, boundary, and recovery checks

| Check | Result |
| --- | --- |
| Import WAV, select second transcript line, run two repeats, save and reload history | PASS |
| Spoken sample playback enters the speaking gap | PASS |
| Non-audio file | PASS — rejected with a plain retry instruction |
| File at 100 MiB | PASS — accepted into the import dialog |
| File at 100 MiB + 1 byte | PASS — rejected with trim-and-retry guidance |
| Repeats below and above range | PASS — normalized to 1 and 30 |
| Valid backup export and fresh-workspace restore | PASS |
| Syntactically malformed or wrong-schema backup | FAIL — F-5-1 |
| Delete a clip with existing history | PASS — both clip and its history were removed |
| Browser storage failure | Source provides a named alert and reload instruction; no browser failure was induced |

## Mobile, keyboard, accessibility, and motion

- Fresh phone and desktop layouts were visually inspected. The cassette study-zine design matches `.factory/design.md` and does not look like a generic template.
- The live 16-test Playwright suite passed, including keyboard start, pause, and restart; 200% text; 44 px targets; route focus; Back focus; and all-route AxeBuilder scans.
- AxeBuilder reported zero violations on root, demo, privacy, terms, and 404.
- The root focuses its h1 on arrival. The next focused action had a visible 3 px teal outline.
- The import dialog moved focus to **Audio clip title**. Escape closed it and returned focus to **Import audio file**.
- Reduced motion produced `transform: none` and 0.01 ms transition and animation durations.
- `/opt/fleet/lib/verify-url.sh` reported HTTP 200, title, `lang=en`, one h1, main, complete image alternatives and button names, and zero errors.

## Offline, updates, privacy, and performance

- The live demo and a newly imported real clip both reloaded offline after first visit.
- An isolated worker update replaced cache `audio-gap-loop-shell-v6` with `audio-gap-loop-shell-v7` and displayed **“A new offline version is ready. Reload when convenient.”**
- The manifest has standalone display, versioned start URL, 192/512/maskable icons, and matching theme colours.
- Timed practice, persistence, demo reset, export, and restore generated no analytics, advertising, CDN, or third-party practice request.
- Production headers include CSP, anti-framing, permissions policy, `nosniff`, and strict-origin referrer policy. Fingerprinted assets are immutable; the worker is not cached.
- Lighthouse: Performance 100, Accessibility 100, Best Practices 100, SEO 100; LCP 1.4 s, CLS 0, TBT 0 ms, 134 KiB transferred.
- Built main JS is 31.11 kB raw / 10.33 kB gzip. Main CSS is 18.23 kB raw / 4.75 kB gzip.

## Routes, links, legal pages, and deployment

- Route titles are specific: root, Demo, Privacy, Terms, and Page not found.
- Each checked page has `lang=en`, one h1, main, full metadata, shared header/footer, and working internal links.
- Privacy and Terms returned 200 and contain the required local-data, safety, availability, and contact information.
- `/review-5-deliberate-missing` returned the expected HTTP 404 with the designed cassette-style page and a working home link. This deliberate status is not a defect.
- All 26 public built files matched production byte for byte. Root, manifest, worker, assets, legal routes, images, audio, and metadata are the reviewed implementation.
- This is a static PWA. Backend tenant isolation, restart persistence, health, and 429/`Retry-After` checks do not apply.
- This is not a CLI, library, or desktop artifact, so installed-consumer checks do not apply.

## Earlier findings

Every earlier review, verification, polish report, and handoff was read. Dispositions were checked against the current live site and implementation.

| Earlier item | Current disposition |
| --- | --- |
| F-1-1 | Fixed — job and audience are clear before scrolling. |
| F-1-2 | Fixed — one-click spoken sample opens populated. |
| F-1-3 | Fixed — demo namespace, reset, and exit cleanup pass. |
| F-1-4 | Fixed — 11 claims have exactly one tagged test each. |
| F-1-5 | Fixed — public capability claims have outcome proofs. |
| F-1-6 | Fixed — demo route and designed HTTP 404 work. |
| F-1-7 | Fixed — shared shell and route/Back focus pass. |
| F-1-8 | Fixed — route metadata and identity assets are complete. |
| F-1-9 | Fixed — no unavailable price or purchase action is rendered. |
| F-1-10 | Fixed — task terms and actions are plain and consistent. |
| F-1-11 | Fixed — README setup and use copy is short and direct. |
| F-1-12 | Fixed — phone overflow is 0 px. |
| F-2-1 | Fixed — demo banner appears only in demo mode. |
| F-2-2 | Fixed — the licensed spoken sample replaced the tone. |
| F-2-3 | Fixed — real playback, privacy, deletion, exports, and provenance have outcome tests. |
| F-2-4 | Fixed — shell and Back focus are consistent. |
| F-2-5 | Fixed — metadata is complete on every route. |
| F-2-6 | Fixed — former alternate terms and vague controls are absent. |
| F-2-7 | Fixed — former README jargon is absent. |
| F-2-8 | Fixed — leaving demo removes demo storage. |
| F-2-9 | Fixed — all required first-screen content fits. |
| F-2-10 | Fixed — landmarks, AxeBuilder, and target-size checks pass. |
| F-3-1 | Fixed — the mobile header shows Demo, How it works, and Privacy on every route. |
| F-3-2 | Fixed — imported-audio repeats, full-flow request privacy, and history deletion are proved. |
| F-3-3 | Fixed — **audio clip** and other task terms are consistent. |
| F-3-4 | Fixed — the landing privacy and limits section is present and tested. |
| Initial verification: TLS and Azure 404 | Fixed — HTTPS works and production matches all 26 public artifacts. |
| Verification 2: Playwright mismatch | Fixed — Playwright 1.58.2 is pinned and the supplied browser ran without installation. |
| Verification 2: cache, touch, headers, MIME | Fixed — live headers, 44 px checks, CSP, permissions, and manifest MIME pass. |
| Verification 2/3/4: checkout 404 | Safely absent — no price, buy link, restore, merchant, or refund flow is presented. Sales still require separate factory enablement before any future CTA. |
| Verification 4: 1 px live overflow | Fixed — current live phone width is exactly 390/390. |

F-5-1 is new. Earlier checks used a valid JSON object with the wrong backup schema; this review also supplied syntactically malformed JSON and observed the raw parser message.

## Quality gates

- `npm test`: PASS — 13 unit/contract tests and 16 browser tests.
- `npm run build`: PASS — `dist/` produced.
- `npm audit --audit-level=high`: PASS — zero vulnerabilities.
- Live Playwright suite: PASS — 16/16.
- All 11 declared claim commands: PASS independently.
- Public artifact comparison: PASS — 26/26 exact matches.

## Missed leverage

No missing AI feature was found. Speech scoring is a stated non-goal, and network transcription would conflict with the focused local-first job. Import, backup restore, CSV export, and offline replay cover the useful adjacent steps implied by the brief.

## Final verdict

**FAIL — 1 finding, 0 untested claims.** Fix and test the invalid-backup recovery message before declaring PASS.
