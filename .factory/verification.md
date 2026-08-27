# Verification — Audio Gap Loop

**Verdict: FAIL (release blocked)**
**Candidate:** `67ba716f65d8c2cb2d8439cff033c09599be3755` (`main`)
**Target:** `https://audio-gap-loop.sociobot.in`
**Verified:** 2026-08-27 23:24 UTC
**Scope:** independent clean-checkout verification; no product source was changed.

## Executive result

The candidate builds and works locally as the researched local-first audio-loop PWA. The live deployment does not work: normal HTTPS navigation is rejected because the certificate does not cover `audio-gap-loop.sociobot.in`; when certificate verification is bypassed, the host returns Azure's 404 page for `/` and for the candidate's hashed assets. This is a deployment failure, not a local application failure, but it prevents release.

## Clean checkout, test, and build evidence

- Started at the requested SHA with a clean worktree.
- `npm ci` — PASS; 72 packages audited, 0 vulnerabilities.
- The first `npm test` could not start Chromium because the Playwright browser executable was absent from the worker image. After `npx playwright install chromium` (environment-only), the unchanged suite passed.
- `npm test` — PASS: 3 Vitest tests and 2 Playwright tests.
- `npm run build` — PASS: TypeScript check and Vite production build; output in `dist/`.
- Production bundle sizes: main JS 28.33 kB raw / **9.63 kB gzip**; main CSS 16.50 kB raw / **4.43 kB gzip**. Both are within the 200 kB JS and 50 kB CSS budgets. The mobile hero AVIF is 23.4 kB.

## Independent production-build browser QA

Tested against `npm run preview` on the exact generated `dist/` at desktop and 390 × 844 Chromium.

- Normal flow — PASS: loaded the empty state, imported a real WAV, confirmed rights, stored it in IndexedDB, selected a transcript line, ran a one-repeat cadence, and observed a saved practice-history entry. The selected clip and line persisted after reload.
- Boundary and recovery — PASS: repetitions entered as `31` normalized to `30`; `-2` normalized to `1`. A text file produced the supported-audio error and left the app usable. A save without rights confirmation was blocked by native required validation. A malformed backup produced “This is not an Audio Gap Loop backup.” and recovery remained usable. JSON backup download completed without failure.
- Accessibility — PASS: title, `lang`, one `h1`, `main`, skip link, labels, landmarks, and focus were present. Axe found **0 serious/critical** findings on both the empty and populated desktop app and the 390 px app. A focused control had a visible solid 3 px `rgb(30, 109, 117)` outline. Escape closed the import/edit dialog.
- Responsive and motion — PASS: 390 px horizontal overflow was 1 px (test tolerance is ≤1); controls remained exposed and touch targets are specified at 44 px or greater. With `prefers-reduced-motion: reduce`, animation duration was `0s`, iteration count `1`, and smooth scroll became `auto`.
- Privacy/network — PASS for the free flow: captured requests were same-origin only; no analytics, third-party script/font, audio upload, transcript upload, or console/page error occurred. Storage is IndexedDB/localStorage as declared. Optional billing verification was not exercised because it needs a registered valid/fake billing product and is outside the free local flow.
- PWA — PASS locally: service worker registered, populated app/offline reload is covered by the passing repository test, and a seeded old cache (`audio-gap-loop-shell-v1`) was removed by `audio-gap-loop-shell-v2`; the application showed “A new offline version is ready. Reload when convenient.”
- Visual review — PASS: desktop and mobile follow the documented cassette-era study-zine system, remain calm and legible, and contain no game-layer treatment.

## Live deployment evidence

### P0 / blocker — HTTPS certificate is invalid for the public hostname

At the target URL, standard Chromium navigation failed with:

```
net::ERR_CERT_COMMON_NAME_INVALID
```

The delivered certificate subject was `*.msha-slice-7-eus2-0-ase.p.azurewebsites.net`; its SANs contain Azure internal hostnames only, not `audio-gap-loop.sociobot.in`. A normal user cannot safely open the product.

### P0 / blocker — the public host serves Azure 404, not the PWA

With TLS errors explicitly ignored for diagnostic purposes, Chromium received HTTP **404**, title `Microsoft Azure Web App - Error 404`, no `main` landmark, and a failed-resource console error. Repeated `curl -k` probes on 2026-08-27 23:23–23:24 UTC returned `404 Site Not Found` (2,667-byte Azure error page) for both `/` and `/assets/main-CbtdHtuc.js`.

Earlier in this same verification window, `/` briefly returned an HTML byte-for-byte match of candidate `dist/index.html` (SHA-256 `e50c724bdc5a0b0cdf8f5337ba05469ef02a5d15182d6da8c1ecd977e197a7b3`), but the referenced JS, CSS, `sw.js`, and manifest already returned the same Azure 404 page. Thus that transient/stale shell was also unusable.

### P2 / hardening follow-up — response policy incomplete when the candidate shell was briefly served

The captured successful-shell headers included HSTS, `Referrer-Policy: strict-origin-when-cross-origin`, and `X-Content-Type-Options: nosniff`, with HTML `Cache-Control: public, must-revalidate, max-age=30`. They did not include a Content-Security-Policy or Permissions-Policy. These should be configured at the static host during the deployment repair. Asset caching cannot be accepted while assets return 404.

## Required disposition

**FAIL. Do not release or mark this candidate deployed.** Repair the public hostname binding/TLS certificate and static-site routing/upload so the root, hashed JS/CSS, manifest, service worker, legal pages, and image assets all return the exact `dist/` files. Then rerun live HTTPS, console, offline/service-worker, headers, and candidate-byte comparison checks.

No product code was modified. This report and the handoff update are the only repository changes.
