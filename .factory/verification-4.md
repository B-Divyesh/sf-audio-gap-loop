# Independent product verification — PASS

**Verified:** 2026-08-28 01:58 UTC  
**Candidate:** `5b1186437e999af989f6eacc4b90dde76bfe75bd`  
**Live URL:** <https://audio-gap-loop.sociobot.in/>  
**Scope:** detached clean checkout, exact production build, independent Chromium QA, and production deployment. No product source code was modified.

## Verdict

**PASS for the local-first Audio Gap Loop release.** The candidate delivers the researched core job end to end: a learner can import permitted personally owned audio, mark a transcript line, configure a listen/silent-gap/repeat cadence, complete practice, retain the local log, export their data, and use saved clips offline. The live site matches all 18 public build artifacts byte for byte.

The previously reported checkout 404 still exists at the external Sociobot billing service, but this candidate deliberately renders no purchase link while that service is unavailable. The live product instead says that Studio purchases are being set up, retains a working restore field, and exposes no broken checkout journey. This is not a defect in the released core product; it remains an external prerequisite before enabling paid sales.

## Clean-checkout gates

Clean detached checkout: `/tmp/audio-gap-loop-verify-4.PHs9yL`, initialized at the exact candidate SHA and cleaned before install.

| Check | Result / evidence |
| --- | --- |
| Install | `npm ci` PASS — 72 packages audited, 0 vulnerabilities. |
| Repository suite | `npm test` PASS — 8 Vitest tests and 4 Playwright tests. |
| Type and production build | `npm run build` PASS — `tsc --noEmit` then Vite build to `dist/`. |
| Available security/hygiene checks | `npm audit --audit-level=high` PASS (0 vulnerabilities); `git diff --check` PASS. No separate lint script exists. |
| Build budget | JS: 28,626 B / 9,741 B gzip. CSS: 16,764 B / 4,480 B gzip. Both are below the 200 KB JS / 50 KB CSS static budgets. Mobile AVIF: 23,445 B; largest image: 171,704 B, below 300 KB. |
| Basic page verification | `/opt/fleet/lib/verify-url.sh` passed local preview (594 ms) and live (621 ms): HTTP 200, title, `lang=en`, one `h1`, main landmark, no missing image alt or unlabelled button, zero page/console errors. |
| Lighthouse | Lighthouse 12.8.2 could not connect to the supplied Chromium in this container (`Unable to connect to Chrome`), so no fresh Lighthouse score is claimed. Static budgets, response performance, browser error checks, and axe scans passed. |

## Independent end-to-end QA

Performed in separate Chromium runs against built `dist/` preview:

- Empty state was clear; first Tab focused **Skip to practice**, with designed `rgb(30, 109, 117) solid 3px` outline.
- Non-audio `.txt` was rejected with recovery copy. Exactly 100 MiB audio opened the import dialog; 100 MiB + 1 B was rejected with trim-and-retry guidance.
- Imported a real WAV, added a two-line transcript, confirmed rights, saved locally, and selected the second line. Save remained blocked until rights were confirmed.
- Repetition boundaries normalized `0 → 1` and `31 → 30`. A one-repeat cadence completed and logged locally with no console/page errors.
- CSV and JSON backup downloads worked (`audio-gap-loop-log-*.csv`, `audio-gap-loop-backup-*.json`); malformed backup JSON produced recoverable feedback.
- Imported clip and transcript selection persisted after refresh in IndexedDB. Normal core flow generated no third-party HTTP request (only same-origin requests and local `blob:` audio URLs).
- `context.setOffline(true)` after worker control reloaded a persisted clip and showed offline status. An isolated v1 worker was updated to candidate v3: cache `audio-gap-loop-shell-v1` became `audio-gap-loop-shell-v3` and the update toast appeared.
- Axe found 0 serious/critical violations on both empty and populated states. With reduced motion, hero transform was `none`. At 390 x 844 local overflow was 0 px and the primary import action was visible.

## Live deployment, privacy, and policy

- Live Chromium: 0 serious/critical axe violations, 0 console/page errors, first focus was the visible skip link, worker controlled the page, zero Buy Studio links, and no third-party HTTP request in normal flow. At 390 x 844 overflow was 1 px (the repository's accepted non-clipping limit); no control was clipped.
- Byte-for-byte deployment parity passed for all 18 public artifacts: root, privacy/terms, worker, manifest, offline page, icons, images, robots/sitemap, and hashed JS/CSS. `staticwebapp.config.json` is deployment configuration, not a public artifact.
- HTTPS is HTTP/2 with valid TLS (`ssl_verify_result=0`). Hashed assets are immutable for one year; worker is `no-cache, no-store, must-revalidate`; manifest/offline shell revalidate.
- Production sends restrictive CSP, disabled sensitive-device Permissions-Policy, `X-Frame-Options: DENY`, nosniff, strict-origin referrer policy, HSTS, and `application/manifest+json`. The built artifact contains no CDN font, analytics, tracking pixel, or third-party script.
- Clips/logs are IndexedDB; selected clip/queue and optional license data are localStorage. Audio, transcript, and practice content stay on-device. Privacy and terms pages are live.

## Defects and release notes

| Severity | Item | Evidence / disposition |
| --- | --- | --- |
| P2 external prerequisite | Sociobot checkout is not registered/enabled. | Fresh production and pilot `/api/v1/products/audio-gap-loop/checkout` requests both returned `404 {"error":"enabled factory product","status":404}`. Candidate fails closed: zero Buy Studio links and an unavailable-sales message. Factory must register/enable checkout and test hosted purchase, `?license=` return, restore, daily verify, and revocation before `VITE_STUDIO_SALES_ENABLED=true`. |
| P4 cosmetic | Live 390px width exceeds viewport by 1 CSS px. | Matches repository regression limit; no clipping/reachability issue. Local build measured 0 px. |

No P0/P1 defects were found.

## Rerun commands

```sh
npm ci
npm test
npm run build
npm run preview
/opt/fleet/lib/verify-url.sh http://127.0.0.1:4173/ "$(mktemp -d)"
```

When factory enables Studio sales, rerun normal gates and a real hosted checkout/return/restore/revocation flow before enabling the CTA.
