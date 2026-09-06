# Verification 5 — Practise audio clips in timed repeats

**Verdict: PASS**

**Verified:** 2026-09-06 UTC  
**Live URL:** <https://audio-gap-loop.sociobot.in/>  
**Implementation candidate:** `6ef6790f9b52178cdec1d8b433bd4586e2ea4f61`  
**Documentation baseline:** `19c15553c43a34320f5cb46de63bf006502bd850`  
**Finding count:** 0  
**Untested claim count:** 0

The product passes independent verification. No product code was changed.

## First screen

Fresh Chromium contexts at 390 × 844 and 1440 × 900 showed this before scrolling:

- Job: practise an audio clip in timed repeats.
- Audience: language learners, parents, and tutors using short audio.
- First action: **Try sample practice**.
- Result of the action: a spoken French greeting with a three-second speaking gap.

The action, result, and three privacy/offline facts fit both viewports. The page had no horizontal overflow.

## Sample practice and recovery

The one-click action opened `/demo/` with **French greeting**, selected **Bonjour.**, a three-second speaking gap, three repeats, and an existing three-repeat practice entry. The persistent sample label showed **Demo — sample data is temporary and separate**, **Reset demo**, and **Start for real**.

Changing the gap to seven seconds and resetting restored three seconds. Starting for real removed the `demo:` keys and `demo:audio-gap-loop` database while preserving a marker in the real namespace. The claim test also proved preservation with an imported real audio clip.

Malformed JSON and a valid JSON object with the wrong schema both showed only: **“This backup could not be read. Choose an Audio Gap Loop backup and try again.”** No parser wording appeared, and import remained available. A non-audio file also produced plain retry guidance.

## Clean checkout and claims

Detached clean checkout: `/tmp/audio-gap-loop-verify5.aPSXvO` at the implementation candidate.

| Check | Result |
| --- | --- |
| `npm ci` | PASS — 71 packages installed; 0 vulnerabilities. |
| `npm test` | PASS — 13 unit/contract tests and 17 browser tests. |
| `npm run build` | PASS — `dist/` produced. |
| `npm audit --audit-level=high` | PASS — 0 vulnerabilities. |
| Build budget | PASS — JS 31.11 kB raw / 10.33 kB gzip; CSS 18.23 kB raw / 4.75 kB gzip. |

Every exact command in `.factory/claims.json` was run independently from that checkout.

| Claim | Exact command result | Outcome evidence |
| --- | --- | --- |
| `sample-spoken-loop` | PASS | Shipped spoken audio loaded; selected line, settings, log, and speaking-gap transition passed. |
| `real-timed-repeats` | PASS | Imported WAV, selected second transcript line, Listen → Your turn → Listen → complete, and saved log passed. |
| `demo-isolation` | PASS | Mutation, reset, exit cleanup, and preservation of real data passed. |
| `offline-reload` | PASS | Demo and imported real audio both reloaded offline in a fresh context. |
| `csv-export` | PASS | Downloaded CSV header and one row per sample session passed. |
| `backup-export-import` | PASS | Full sample backup was inspected and restored into a fresh real workspace. |
| `local-only-storage` | PASS | Imported audio and completed history persisted; all practice requests stayed same-origin or local blob URLs. |
| `delete-local-clip` | PASS | A clip with existing practice history was deleted; both stores became empty. |
| `product-boundaries` | PASS | No scoring, lessons, hearing test, pronunciation assessment, analytics, or advertising action was exposed. |
| `artwork-provenance` | PASS | Source sidecar, generation record, shipped art, and footer disclosure matched. |
| `static-build` | PASS | Player, demo, legal, 404, and deployment artifacts existed in `dist/`. |

No public landing, legal, footer, demo, runtime, or README claim was found outside this inventory. No AI feature is needed for this local cadence tool; scoring and assessment remain explicit non-goals.

## Live checks

- `PLAYWRIGHT_BASE_URL=https://audio-gap-loop.sociobot.in npx playwright test`: PASS — 17/17.
- `/opt/fleet/lib/verify-url.sh`: PASS — HTTP 200, correct title and language, one h1, main landmark, complete image alternatives and button names, and zero unexpected console/page errors.
- AxeBuilder: zero violations on root, demo, privacy, terms, and 404.
- Keyboard: skip link, timed-repeat Space/R controls, route focus, Back focus, and native dialog focus passed. Escape closed the dialog.
- Reduced motion: the hero transform became `none`; transitions reduced to 0.01 ms.
- Text at 200% stayed within the 390 px viewport. Checked controls met the 44 px touch-target rule.
- Offline: the sample and imported audio reloaded after network loss. The update message read **“A new offline version is ready. Reload when convenient.”**
- Privacy: no analytics, advertising, external font/script, audio upload, transcript upload, or other third-party practice request occurred.
- Routes: root, demo, privacy, and terms returned 200 with route titles and one h1. The deliberate missing route returned the designed HTTP 404, title **Page not found — Audio Gap Loop**, and a working recovery link. The browser's expected failed-resource line for that deliberate 404 is not a defect.
- Links: all internal links passed; explicit `mailto:` links were left to the user's mail client.
- Headers: restrictive CSP, anti-framing, permissions policy, `nosniff`, strict-origin referrer policy, HSTS, immutable hashed assets, and a no-cache service worker were present.
- Deployment parity: all 26 public files matched the candidate build byte for byte. `main-x_O7-drX.js` matched SHA-256 `012c4fe63609874ad7cca300201fdf4f9fc0a3441a47f8c2d3dcc6d62793537c`.
- Lighthouse mobile: Performance 100, Accessibility 100, Best Practices 100, SEO 100; LCP 1,395 ms, CLS 0, TBT 0 ms, 136,930 bytes transferred.

Evidence files are in `/work/.evidence/`: phone, desktop, and populated demo screenshots; `lighthouse-verification-5.json`; this report copy; and the machine-readable result.

## Earlier findings

All earlier review, verification, and polish reports were read and checked against the candidate and live site.

| Earlier items | Current disposition |
| --- | --- |
| F-1-1 through F-1-12 | Closed — first-screen clarity, one-click demo, isolation, claims, routes, metadata, paid-copy removal, plain words, README, and phone width all pass. |
| F-2-1 through F-2-10 | Closed — banner scope, spoken sample, outcome proofs, route focus, metadata, terms, demo cleanup, first-screen facts, landmarks, and targets all pass. |
| F-3-1 through F-3-4 | Closed — mobile header, claim depth, consistent **audio clip** wording, and the privacy/limits section all pass. |
| Initial TLS and Azure 404 | Closed — normal HTTPS and all 26 public artifacts pass. |
| Playwright mismatch | Closed — Playwright 1.58.2 is pinned and used the supplied Chromium. |
| Cache, touch, CSP, permissions, anti-framing, and manifest MIME | Closed — repository tests and live responses pass. |
| Checkout 404 | Safely absent — no price, paid offer, buy link, restore field, merchant promise, or refund flow is shown. Billing registration remains external. |
| One-pixel phone overflow | Closed — live root measured 390/390. |
| F-5-1 invalid backup parser text | Closed — malformed and wrong-schema files now receive the same plain retry message; the regression passed locally and live. |

## Scope and remaining dependency

This is a static local-first PWA with no backend. Tenant isolation, server restart persistence, health, and 429/Retry-After checks do not apply. User state is in browser IndexedDB/localStorage, not shared PostgreSQL.

Sociobot billing registration remains an external dependency. No paid offer is currently shown, so it is not an exposed or broken user path. Any future paid offer needs a separate checkout, return, restore, verification, and revocation review before release.

**Final verdict: PASS — 0 findings and 0 untested claims.**
