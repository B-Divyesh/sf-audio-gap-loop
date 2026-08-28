# Verification 2 — FAIL

Verified: 2026-08-28 UTC  
Candidate: `67ba716f65d8c2cb2d8439cff033c09599be3755`  
Live URL: <https://audio-gap-loop.sociobot.in/>  
Scope: fresh clean-checkout verification; product source was not changed.

## Result

**FAIL.** The free local-first player and current live deployment work, and the live files exactly match the candidate. Release remains blocked because the advertised Studio checkout returns 404; the deployment also misses required immutable asset caching and 44 px touch targets.

This supersedes the prior report's live TLS/Azure-404 observation: on this fresh check the normal HTTPS site, root, candidate assets, legal pages, manifest, service worker, and offline page all returned 200, and candidate hashes matched. The previous deployment-only P0 failure is not reproducible now.

## Clean build and quality gates

- Clean detached checkout at the candidate; `npm ci` passed with 0 audit vulnerabilities.
- First exact `npm test` failed before test execution because the lockfile resolves Playwright 1.62.1 but the supplied browser cache did not contain Chromium 1234. After `npx playwright install chromium`, unchanged `npm test` passed: **3 Vitest + 2 Playwright** tests.
- `npm run build` passed (`tsc --noEmit && vite build`) and produced `dist/`; `git diff --check` and `npm audit --audit-level=high` passed. No lint script exists in `package.json`.
- Production output: initial JS 28,326 B (9,630 B gzip), main CSS 16,497 B (4,430 B gzip), mobile hero AVIF 23,445 B / WebP 51,738 B: all within the static-PWA budgets.
- `verify-url.sh` passed on the built preview: 200, 669 ms, title/lang, one `h1`, `main`, no missing alts/unlabelled buttons, and no errors.
- Lighthouse could not be collected because its standalone Chrome process crashed in this container; bundle sizing and browser checks above were collected instead.

## Product/browser evidence

- Desktop and 390×844 paths: imported a real WAV, confirmed audio rights, stored it in IndexedDB, selected transcript text, set 1/20-second gap and 1/30 repetition bounds, completed a one-repeat cadence and saw a local history record, reloaded persistence, exported JSON and CSV, and rejected a text file and malformed JSON backup with recovery copy.
- Axe had **0 serious/critical** findings on empty and populated states; title/lang/landmarks/labels/skip link are present. Keyboard Tab begins on the visible skip link (3 px outline); reduced-motion reports 0.01 ms transitions. Local mobile overflow was 0 px; live mobile overflow was a 1 px rounding difference. No console or page errors were observed locally or on the live 390 px page.
- PWA: registration, controller, `audio-gap-loop-shell-v2`, and IndexedDB were observed. The repository's passing e2e suite covers offline reload. A disposable static-server update test served a v3 worker after initial install; it activated, replaced the cache, and displayed “A new offline version is ready. Reload when convenient.”
- Privacy: first-load browser requests were same-origin only. Source/browser inspection found no analytics, beacon, CDN font/script, or audio/transcript upload. Clips/logs are IndexedDB; selection/Studio state is localStorage. Optional billing verification is the only external runtime path.

## Current live comparison

SHA-256 matched between current live responses and fresh `dist/` for `/`, `/assets/main-CbtdHtuc.js`, `/assets/main-Cg2F6e4p.css`, `/sw.js`, `/manifest.webmanifest`, `/privacy/`, `/terms/`, and `/offline.html`. Live normal HTTPS navigation was 200 with zero serious/critical axe issues and no console/page errors.

## Defects

### Medium — paid Studio checkout is broken

The live “Buy Studio for $9” URL, `https://api.sociobot.in/api/v1/products/audio-gap-loop/checkout`, returned **404** on 2026-08-28 with `{"error":"enabled factory product","status":404}`. Invalid-token verification returns 200/`valid:false`, but no user can buy the advertised unlock. Enable/register the product, then test purchase, return-token capture, restoration, and revocation.

### Medium — hashed assets do not receive immutable cache policy

Live HTML, hashed JS/CSS, service worker, and manifest all return `Cache-Control: public, must-revalidate, max-age=30`. Configure a long-lived `immutable` policy for hashed `/assets/*`, retaining a short/revalidated policy for HTML and the service worker.

### Medium — 44×44 touch-target policy is not met

At 390 px, the brand target is 186×36 px and footer links are 47×16 (`Privacy`), 39×16 (`Terms`), and 30×16 (`Help`). Desktop navigation links are 24 px high. Add padding/min-height to satisfy the contract without enlarging the labels.

### Low — response hardening and test reproducibility follow-ups

Live responses have HSTS, strict referrer policy, and `nosniff`, but no CSP, Permissions-Policy, or anti-framing policy; the manifest MIME type is `application/octet-stream`. Also pin Playwright or document/install its browser so `npm test` works from the supplied clean environment.

## Re-run

```sh
npm ci
npx playwright install chromium
npm test
npm run build
npm audit --audit-level=high
```

Serve `dist/`, run `verify-url.sh`, then repeat browser, PWA, header/cache, and live-byte checks.
