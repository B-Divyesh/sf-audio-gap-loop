# Independent product verification — FAIL

**Verified:** 2026-08-28 00:56 UTC  
**Candidate:** `f50277f3698abe89f9d3b0f19d843c8c1d325097`  
**Live URL:** <https://audio-gap-loop.sociobot.in/>  
**Scope:** clean-checkout source and production deployment; no product code was changed.

## Verdict

**FAIL — do not release the advertised Studio purchase flow.** The core local-first audio practice product passes its source, browser, PWA, accessibility, privacy, performance-budget, response-policy, and deployment-parity checks. However, the visible **“Buy Studio for $9”** link resolves to `https://api.sociobot.in/api/v1/products/audio-gap-loop/checkout`, which returned **HTTP 404** with:

```json
{"error":"enabled factory product","status":404}
```

The researched brief specifies one-time monetization and the product advertises this unlock, so a purchaser cannot complete the supplied product flow. This is an external Sociobot billing registration/enablement defect, not a repository-code change the product is permitted to make.

## Release-blocking defect

| Severity | Defect | Fresh evidence | Required owner/action |
| --- | --- | --- | --- |
| P1 | Studio checkout is unavailable. | `curl -sS -D - https://api.sociobot.in/api/v1/products/audio-gap-loop/checkout` at 00:53 UTC returned HTTP 404 and the JSON above. The live page links directly to that exact endpoint. | Factory: enable/register the `audio-gap-loop` billing product, then test hosted checkout, `?license=` return capture, restore, daily verification, and revoked-license locking. |

No other product defects were found in this verification. A live 390px Chromium measurement is one CSS pixel wider than the layout viewport (the source regression limit is `<= 1`); it produced no visible clipped control or material horizontal layout issue and is not release-blocking.

## Clean source checks

All commands ran from a clean checkout at the candidate.

| Check | Result |
| --- | --- |
| `npm ci` | PASS — 72 packages audited, 0 vulnerabilities. |
| `npm test` | PASS — 5 Vitest tests and 3 Playwright tests. |
| `npm run build` | PASS — type check plus production build into `dist/`. |
| `git diff --check` | PASS before documentation handoff changes. |
| `npm audit --audit-level=high` | PASS — 0 vulnerabilities. |
| Production bundle | PASS — main JS 28,326 B (9.63 kB gzip), main CSS 16,649 B (4.44 kB gzip), under the 200 kB/50 kB static budgets. |
| Responsive images | PASS — mobile AVIF 23,445 B; largest image 171,704 B, below the 300 kB mobile-hero budget. |

Mobile simulated Lighthouse against the exact production build reported Performance **94**, Accessibility **100**, Best Practices **100**, SEO **100**, LCP **1.51 s**, CLS **0**, and 134,866 B transferred. The Lighthouse CLI wrote its report successfully but its Chromium target crashed during final teardown; the collected report values are retained as advisory rather than treating that runner teardown error as an application error.

`/opt/fleet/lib/verify-url.sh` passed against both `http://127.0.0.1:4173/` and the live URL: HTTP 200, zero console/page errors, title, `lang="en"`, one h1, main landmark, image alt text, and labelled buttons.

## End-to-end and boundary QA

In an independent Chromium run against the production build:

- Imported a generated real WAV, supplied a two-line transcript, confirmed rights, selected the second line, started cadence, completed one repetition, and observed the local completion log.
- Changed repetitions to `0` and `31`; the persisted control correctly normalized them to `1` and `30`. Returned it to `1` for the completed cadence.
- Rejected a non-audio file with recovery guidance. A sparse audio file at exactly 100 MiB opened the import dialog; 100 MiB + 1 byte was rejected with the stated trim-and-retry guidance.
- Exported the CSV practice log, rejected an invalid JSON backup with a recoverable status message, reloaded, and confirmed the saved clip persisted in IndexedDB.
- Exercised desktop and 390×844 mobile. Local mobile overflow was 0 px; the visible mobile layout has reachable, stacked controls.
- Keyboard starts at the skip link and exposes a designed `rgb(30, 109, 117) solid 3px` focus outline. Native dialog and form controls were operable in the exercised flow.
- With `prefers-reduced-motion: reduce`, the hero transform was `none`; the CSS also reduces animation and transition duration.
- Axe found **0 serious or critical** violations on the populated player; the repository suite scans both empty and populated states.
- Captured no console errors, page errors, or non-local normal-flow requests. Audio/transcript/log content remains in IndexedDB/localStorage; normal browser traffic was only same-origin assets.

## PWA and browser-response checks

- Local persisted-data offline reload: PASS. After service-worker control and `context.setOffline(true)`, the player and saved WAV reloaded and displayed the offline status.
- Live empty-state offline reload: PASS. The deployed service worker controlled the page; an offline reload showed the offline status and the import action without errors.
- Update path: PASS. An isolated test first registered a simulated v1 worker, then updated to the candidate worker. The existing client received **“A new offline version is ready. Reload when convenient.”** with no console errors, validating the versioned cache/update-toast path.
- Manifest: PASS — standalone display, versioned `start_url`, 192/512/maskable icons, and palette-matching colours.
- Live normal HTTPS, certificate, and response policies: PASS. Root, worker, manifest, offline shell, legal pages, and assets returned 200. Fingerprinted assets have `Cache-Control: public, max-age=31536000, immutable`; `sw.js` is `no-cache, no-store, must-revalidate`; manifest/offline shell revalidate. The live host sends the configured CSP, Permissions-Policy, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, and strict-origin referrer policy. Manifest MIME type is `application/manifest+json`.
- Deployment parity: PASS. SHA-256 comparison matched all **18 public artifacts** from this candidate (`/`, `/privacy/`, `/terms/`, `sw.js`, manifest, offline page, robots/sitemap, icons, images, JS and CSS). `staticwebapp.config.json` is deployment configuration and correctly is not a public artifact.

## Rerun / release criteria

After the factory enables the billing product, rerun `npm ci`, `npm test`, `npm run build`, the local import/offline test, and a real checkout/return-license/restore/revocation browser flow against the deployed URL. The candidate otherwise matches the live deployment and is ready for that external repair.
