# Polish 3 closure — Audio Gap Loop

**Round:** 3

**Reviewed candidate:** `9966d5cb374f8f2b3403f525c5242abbc68cf87b`

**Review report commit:** `bbc0ef87f1bda819aff7307b764b68dca9d610bc`

**Final implementation:** `f690790`

**Live deployment:** `ddcb5798-c71c-4e18-9c48-661de58f16f9`

**Live URL:** <https://audio-gap-loop.sociobot.in/>

## Finding closure map

Every finding from all three review reports is listed separately below. Test names are from `tests/e2e/app.spec.ts` unless a source test is named.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Replaced the inferred slogan with “Practise an audio clip in timed repeats” and named language learners, parents, and tutors. | `src/copy.test.ts` terminology test; `.factory/evidence/polish-3-live-mobile.png`; cold live `/` check. |
| F-1-2 | Added the first-screen Try sample practice action, which opens a populated spoken French sample in one click. | `@claim:sample-spoken-loop`; `.factory/evidence/polish-3-live-demo-mobile.png`; cold live `/demo/` check. |
| F-1-3 | Added separate `demo:audio-gap-loop` storage, banner, reset, exit cleanup, and direct `?demo=1` entry. | `@claim:demo-isolation` plus “the direct ?demo=1 route…”; `.factory/evidence/polish-3-live-demo-mobile.png`; cold live `/?demo=1` check. |
| F-1-4 | Added `.factory/claims.json`, 11 claim entries, and an exactly-one-tag contract. | `src/claims.test.ts` inventory tests; all 11 independent clean-checkout claim commands; live 16/16 suite. |
| F-1-5 | Listed or removed every factual promise and added outcome-level playback, privacy, deletion, export, limits, provenance, and build proofs. | `@claim:real-timed-repeats`, `@claim:local-only-storage`, `@claim:delete-local-clip`, and the other eight claim tests; `.factory/evidence/polish-3-live-desktop.png`; live full suite. |
| F-1-6 | Added real `/demo/` output and a cassette-style `404.html` with an HTTP 404 response and recovery link. | “all routes expose complete metadata…”; `.factory/evidence/polish-3-live-demo-mobile.png`; live `/demo/` = 200 and `/missing-polish-3` = 404. |
| F-1-7 | Standardised header/footer links and added direct-route plus Back/Forward destination focus. | “all routes expose complete metadata…” and “root has no demo banner…Back focuses…”; `.factory/evidence/polish-3-live-mobile.png`; live route crawl. |
| F-1-8 | Added route-specific title, description, canonical, Open Graph, Twitter, theme colour, favicon, Apple icon, and 1200×630 preview image. | “all routes expose complete metadata…”; `.factory/evidence/polish-3-live-desktop.png`; cold checks of all five live routes. |
| F-1-9 | Removed unavailable Studio price, purchase, restore, merchant, and refund UI while retaining the safely disabled billing contract. | `src/license.test.ts`; `.factory/evidence/polish-3-live-desktop.png`; live root has no purchase action or price. |
| F-1-10 | Removed cassette metaphors from task labels and standardised result-naming controls, speaking gap, repeats, and audio clip. | `src/copy.test.ts` terminology test; `.factory/copy-audit.md`; live root/dialog inspection. |
| F-1-11 | Rewrote README around user tasks and short run/test/deploy instructions; removed unexplained user-facing implementation jargon. | `src/copy.test.ts`; `.factory/copy-audit.md`; clean-checkout README and command verification. |
| F-1-12 | Removed horizontal overflow and added exact viewport and enlarged-text regression assertions. | “root has no demo banner…” and “text resized to 200%…”; `.factory/evidence/polish-3-live-mobile.png`; cold live width 390/390. |
| F-2-1 | Ensured the demo banner is hidden on `/` and only rendered in demo mode. | “root has no demo banner…”; `.factory/evidence/polish-3-live-mobile.png`; cold live `/` banner absent and `/?demo=1` banner present. |
| F-2-2 | Replaced the sine tone with the shipped original spoken French recording and matching transcript. | `@claim:sample-spoken-loop`; `.factory/evidence/polish-3-live-demo-mobile.png`; live demo enters the speaking gap after playback. |
| F-2-3 | Expanded claims to cover normal-mode imports, second playback, full-flow request privacy, existing-history deletion, restore, formats, offline, and provenance. | All 11 claim tests, especially `@claim:real-timed-repeats`, `@claim:local-only-storage`, and `@claim:delete-local-clip`; live 16/16 suite. |
| F-2-4 | Made root, demo, legal, and 404 shells consistent and restored meaningful h1 focus after browser Back. | Route-shell and Back-focus tests; `.factory/evidence/polish-3-live-mobile.png`; live root/demo/privacy/terms/404 crawl. |
| F-2-5 | Completed every metadata field and identity asset on demo, legal, and 404 routes. | “all routes expose complete metadata…”; `.factory/evidence/polish-3-live-desktop.png`; live route metadata checks. |
| F-2-6 | Replaced Choose, shelf, Check, cadence, Done, silent gap, repetitions, and the old terms heading with the agreed plain terms. | `src/copy.test.ts` terminology test; `.factory/copy-audit.md`; live root, demo, dialog, and terms inspection. |
| F-2-7 | Removed the README sentence about a PWA service-worker shell and kept user-facing offline wording. | `src/copy.test.ts`; `.factory/copy-audit.md`; clean-checkout README inspection. |
| F-2-8 | Start for real now deletes the demo database and all `demo:` localStorage keys before returning to real mode. | `@claim:demo-isolation`; `.factory/evidence/polish-3-live-demo-mobile.png`; live isolated demo flow. |
| F-2-9 | Tightened hero spacing and type so the action, outcome sentence, and all three facts fit 390×844 and 1440×900. | “root has no demo banner, first-screen facts fit…”; `.factory/evidence/polish-3-live-mobile.png` and `polish-3-live-desktop.png`; cold live bounding-box check. |
| F-2-10 | Put the banner in a landmark, removed the nested complementary landmark, and raised controls/links to 44 px targets. | Full-route AxeBuilder scan and explicit target-box test; `.factory/evidence/polish-3-live-demo-mobile.png`; Lighthouse accessibility 100. |
| F-3-1 | Kept Demo, How it works, and Privacy visible in the shared mobile header on root, demo, legal, and 404 routes. | “all routes expose complete metadata, the shared mobile shell…”; `.factory/evidence/polish-3-live-mobile.png`; cold live 390 px checks. |
| F-3-2 | Added a real imported-WAV two-repeat proof, extended local-only through timed practice, proved one existing history row is deleted, and tested artwork provenance. | `@claim:real-timed-repeats`, `@claim:local-only-storage`, `@claim:delete-local-clip`, `@claim:artwork-provenance`; live 16/16 suite. |
| F-3-3 | Standardised the imported object as audio clip, removed “calm,” changed the dialog and demo headings, and renamed README “Use it.” | `src/copy.test.ts` terminology lint; `.factory/copy-audit.md`; live root/demo/dialog inspection. |
| F-3-4 | Added “What this player does not do” after How it works with tested no-scoring/no-lessons and local-storage statements. | `src/copy.test.ts` privacy-section test, `@claim:product-boundaries`, and `@claim:local-only-storage`; `.factory/evidence/polish-3-live-desktop.png`; live root check. |

## Additional production repair

The first live pass exposed a CSP-only backup restore failure because the browser treated `fetch(data:)` as a network request. Backup decoding now uses `atob` and a local `Uint8Array`, so it neither violates CSP nor makes a request. `@claim:backup-export-import` now passes locally and against the production URL.

## Final verification

- Clean checkout `/tmp/audio-gap-loop-polish-3-final-f690790` at `f690790`
- `npm test`: 13 unit/contract and 16 browser tests passed
- `npm run build`: passed; `dist/` produced
- `npm audit --audit-level=moderate`: 0 vulnerabilities
- Every `.factory/claims.json` command: passed independently
- Live full Playwright suite: 16/16 passed
- Live verifier: HTTP 200, 739 ms, zero console errors, title/lang/h1/main/alt/button checks passed
- AxeBuilder: zero violations on root, demo, privacy, terms, and 404
- Lighthouse: Performance 100, Accessibility 100, Best Practices 100, SEO 100; LCP 1.81 s, CLS 0, TBT 0 ms
- Live root, route, worker, manifest, fallback, JS, and CSS hashes match the deployed `dist/`

Evidence files:

- `.factory/evidence/polish-3-live-mobile.png`
- `.factory/evidence/polish-3-live-demo-mobile.png`
- `.factory/evidence/polish-3-live-desktop.png`
- `.factory/evidence/polish-3-live-verify/verify.json`
- `.factory/evidence/polish-3-live-verify/screenshot-mobile.png`
- `.factory/evidence/polish-3-live-verify/screenshot-desktop.png`

**Unresolved findings: none.**
