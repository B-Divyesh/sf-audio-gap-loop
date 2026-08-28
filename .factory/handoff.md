# Audio Gap Loop repair handoff

## Work order

Repair `audio-gap-loop-repair-2`, based on verifier report
`.factory/verification-3.md` for candidate
`f50277f3698abe89f9d3b0f19d843c8c1d325097`.

## Release-blocker repair

The verifier reproduced that the advertised Studio checkout,
`https://api.sociobot.in/api/v1/products/audio-gap-loop/checkout`, returned
HTTP 404 (`{"error":"enabled factory product","status":404}`). The same
404 was reproduced on both the production and pilot billing hosts during this
repair. Billing-product registration is an external factory responsibility and
this repository is not permitted to change it.

The product now fails closed until that external prerequisite is complete:

- A normal production build has no **Buy Studio for $9** link, so it cannot
  send a customer to the known-broken checkout. It instead clearly says that
  Studio purchases are being set up.
- Existing buyers can still paste and verify a license; the free player,
  exports, and safety features are unchanged.
- The factory can enable the exact same Sociobot checkout CTA only after its
  product registration is working by building with
  `VITE_STUDIO_SALES_ENABLED=true`.
- The service worker cache advanced from `audio-gap-loop-shell-v2` to `v3`,
  ensuring installed clients receive the changed shell and existing clients
  get the update toast.

This is the closest honest product behavior while preserving the researched
one-time-unlock design: paid sales are temporarily unavailable rather than
advertised with a broken purchase journey.

## Regression coverage

- `src/license.test.ts` asserts that sales remain disabled unless the factory
  explicitly supplies exactly `VITE_STUDIO_SALES_ENABLED=true`, and retains
  the correct product-specific checkout route for the enabled build.
- `tests/e2e/app.spec.ts` asserts the default production experience exposes no
  Buy Studio link, presents the availability message, and keeps restore and
  invalid-license feedback operational.
- `src/service-worker.test.ts` locks the current versioned shell and its
  `skipWaiting` / update-notification behavior.

## Verification performed

All commands ran in this checkout on 2026-08-28.

| Check | Evidence |
| --- | --- |
| Clean install | `npm ci` — PASS, 72 packages audited, 0 vulnerabilities. |
| Unit, integration, browser | `npm test` — PASS: 12 tests (8 Vitest, 4 Playwright). Includes a real WAV import, IndexedDB persistence, offline reload, axe serious/critical scans, 390px layout, touch targets, and the Studio regression. |
| Type/lint/build | `npm run build` — PASS: TypeScript no-emit check and Vite build to `dist/`. Main JS 28.63 kB (9.74 kB gzip); main CSS 16.76 kB (4.47 kB gzip), within static budgets. |
| Explicit sales modes | `VITE_STUDIO_SALES_ENABLED=true npm run build` included the CTA; the final default `npm run build` contained the unavailable-sales state and no checkout anchor. |
| Accessibility/browser | `verify-url.sh http://127.0.0.1:4173/` — PASS: HTTP 200, 540 ms, zero errors, title, `lang`, one h1, main landmark, image alt text, and labelled buttons. Axe serious/critical scans pass in the Playwright suite. |
| Desktop/mobile/keyboard | Chromium desktop and 390×844 check: first Tab reaches “Skip to practice”; 390px overflow is 1px (the established non-clipping limit); reduced-motion hero transform is `none`; no console/page errors. |
| Privacy/network | Chromium normal free-flow capture made zero external requests. Audio, transcripts, practice data, and exports remain local. The optional restore verification was mocked only in its test. |
| Offline/update | The Playwright suite passes a persisted-data `context.setOffline(true)` reload. Worker v3 retains versioned precache, update toast, `skipWaiting`, and `clientsClaim`; unit coverage verifies the update wiring. |
| Response policy | `dist/staticwebapp.config.json` contains the app CSP, Permissions-Policy, anti-framing, nosniff, referrer policy, webmanifest MIME type, immutable `/assets/*`, and revalidated worker/manifest/offline shell policy. |
| Hygiene | `git diff --check` and `npm audit --audit-level=high` — PASS. |

## Deploy and verify

The deployable artifact remains `dist/`, with `index.html` at its root. Deploy
it using the static work-order configuration so
`dist/staticwebapp.config.json` is applied:

```sh
npm ci
npm test
npm run build
/opt/fleet/lib/deploy-static.sh audio-gap-loop dist
```

After factory billing registration succeeds, test hosted checkout, the
`?license=` return capture, restore, daily verification, and revocation on a
staging build with `VITE_STUDIO_SALES_ENABLED=true`; only then deploy that
enabled-sales build. No infrastructure, DNS, payment provider, or billing
configuration was changed from this repository.

## Deployment evidence

- Deployed 2026-08-28 with
  `/opt/fleet/lib/deploy-static.sh audio-gap-loop dist`.
- Azure Static Web Apps deployment ID:
  `d05bedd9-efab-43c6-91af-c646a8f0ef18`; custom domain was `Ready` and normal
  HTTPS returned 200.
- Live `verify-url.sh` passed in 747 ms with zero browser errors and the same
  title/lang/h1/main/alt/button checks as local preview.
- The live `main-iWILbOYy.js` SHA-256 exactly matched `dist`:
  `9fb3391d057e1fe303c62ba436ee76cc30e4e21337d2778fb32a70a8b9203973`.
- Live browser at 390px: the first Tab reached “Skip to practice”, there were
  zero Buy Studio links, the availability message was visible, the worker was
  controlling the page, overflow was 1px, and there were zero console/page
  errors.
- Live hashed JS was immutable; `sw.js` was `no-cache, no-store,
  must-revalidate`; the manifest was `application/manifest+json` and
  revalidated; CSP, Permissions-Policy, X-Frame-Options, nosniff, referrer
  policy, and HTTPS headers were present.
