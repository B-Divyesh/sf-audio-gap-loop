# Polish 3 handoff — Audio Gap Loop

## Result

All findings in `.factory/review-1.md`, `.factory/review-2.md`, and `.factory/review-3.md` are resolved. The repair keeps the cassette study-zine visual system and the static offline PWA deployment class.

Live: <https://audio-gap-loop.sociobot.in/>

Implementation commits:

- `150820d79ebd4d77a5baefdf0e3a7d006c5db31f` — cumulative copy, demo, claims, routes, mobile, accessibility, and privacy repairs
- `e88df63244f1f6d20559acee67d3ebd2d214dede` — 200% text/mobile overflow protection
- `f690790` — CSP-safe backup restore and live-suite support

Static deployment `ddcb5798-c71c-4e18-9c48-661de58f16f9` completed successfully and serves `f690790`.

## Delivered

- Rewrote the first screen around the exact job, audience, next action, and three tested facts.
- Added direct, isolated `?demo=1` and `/demo/` entry with the spoken sample, persistent demo banner, Reset demo, and Start for real cleanup.
- Kept demo and real IndexedDB/localStorage namespaces separate.
- Added 11 claims and exactly one outcome test for every claim.
- Proved imported-audio playback through listen, speaking gap, second playback, and completion.
- Proved full-flow local-only requests and clip-plus-history deletion.
- Standardised **audio clip**, **speaking gap**, and **repeats** across the product and README.
- Added the required privacy and product-limits section.
- Made the shared header navigation visible at 390 px on every route.
- Completed per-route titles, descriptions, canonical/OG/Twitter metadata, icons, focus handling, internal link checks, and the designed HTTP 404.
- Added an exact 390 px overflow check and a 200% text-resize check.
- Kept the generated cassette artwork and added a provenance claim test.
- Reworked the offline fallback to use CSP-compliant external CSS.
- Fixed backup restoration under the production CSP without a `data:` network request.
- Updated `.factory/catalog-description.txt`, `.factory/copy-audit.md`, `.factory/demo.md`, and `README.md`.

The catalog line is: **“Practise audio clips with timed speaking gaps and repeats.”** It starts with a verb and is 58 characters before the newline.

## Clean-checkout verification

Checkout: `/tmp/audio-gap-loop-polish-3-final-f690790` at `f690790`.

- `npm ci` — pass; 0 vulnerabilities
- `npm test` — pass; 13 unit/contract tests and 16 Playwright tests
- `npm run build` — pass; `dist/index.html` and every required static route produced
- `npm audit --audit-level=moderate` — pass; 0 vulnerabilities
- Every command in `.factory/claims.json` — pass when invoked independently

Claim commands passed for:

`sample-spoken-loop`, `real-timed-repeats`, `demo-isolation`, `offline-reload`, `csv-export`, `backup-export-import`, `local-only-storage`, `delete-local-clip`, `product-boundaries`, `artwork-provenance`, and `static-build`.

Production bundle sizes:

- JavaScript: 31.11 kB raw / 10.33 kB gzip
- Main CSS: 18.23 kB raw / 4.75 kB gzip
- Total Lighthouse transfer: 137,225 bytes

Lighthouse 12.8.2 against the final production build:

- Performance: 100
- Accessibility: 100
- Best practices: 100
- SEO: 100
- LCP: 1.81 s
- CLS: 0
- Total blocking time: 0 ms

## Accessibility, privacy, and offline evidence

- AxeBuilder found zero violations on root, demo, privacy, terms, and 404.
- Every visible target checked at 390 px is at least 44×44 CSS px.
- Keyboard start, pause, restart, route focus, browser Back focus, and dialog controls pass.
- The 200% text-resize test has no horizontal overflow at 390 px.
- The final live URL verifier returned HTTP 200 in 739 ms with no console errors, one h1, `lang="en"`, a main landmark, complete image alternatives, and labelled buttons.
- The privacy claim records the entire import/practice/reload flow and permits only same-origin or browser-local requests.
- The offline claim reloads both an imported real audio clip and the demo after the first visit with the browser offline.
- Service-worker cache version is `v7`; open clients receive the update notice.

Verifier output and screenshots:

- `.factory/evidence/polish-3-live-verify/verify.json`
- `.factory/evidence/polish-3-live-verify/screenshot-desktop.png`
- `.factory/evidence/polish-3-live-verify/screenshot-mobile.png`
- `.factory/evidence/polish-3-live-demo-mobile.png`

## Live cold checks

- `/` — HTTP 200; root title; no demo banner; three mobile header links visible; width 390/390; no console errors.
- `/?demo=1` — HTTP 200; Demo title; isolated sample and banner visible; Reset demo and Start for real available; width 390/390; no console errors.
- `/demo/`, `/privacy/`, `/terms/` — HTTP 200 with route-specific metadata.
- `/missing-polish-3` — HTTP 404 with the designed cassette-style recovery page and home link.
- Manifest, service worker, offline fallback, JS, and CSS all return correct content types.
- Live root, demo, privacy, terms, worker, manifest, offline fallback, JS, and CSS byte hashes match the deployed `dist/` files.
- Production CSP, HSTS, frame denial, referrer policy, permissions policy, `nosniff`, and immutable hashed-asset caching are present.
- The complete Playwright suite also passed against the live origin: 16/16.

Deployment screenshots:

- `.factory/evidence/polish-3-live-mobile.png`
- `.factory/evidence/polish-3-live-demo-mobile.png`
- `.factory/evidence/polish-3-live-desktop.png`

## Known gaps

None.

## Run locally

```bash
npm ci
npm test
npm run build
npm run preview
```

Deploy only the contents of `dist/` through the configured static work order.
