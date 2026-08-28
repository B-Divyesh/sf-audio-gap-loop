# Polish 1 handoff — Audio Gap Loop

Repair commit: `4ff1f0b67d417ac0c3d886d5c687f291e89099a1` (base `f0e7e9abfd3fbc5f9d09cdd4039e52872982a29c`).

## Delivered

- A one-click `/demo/` and `?demo=1` sample path with a realistic dialogue, selected transcript line, 3-second gap, existing log, visible demo banner, reset, and start-real action.
- Strictly separate demo IndexedDB (`demo:audio-gap-loop`) and `demo:` local-storage namespace.
- Claim inventory with six observable clean-demo browser proofs.
- Plain first-screen wording, compact README, catalog description, and copy audit.
- Built demo/404 routes, static-host 404 rewrite, legal route header/footer/focus handling, per-route metadata, social image, and icon assets.
- Mobile overflow repair and current service-worker cache version.

The cassette-era study-zine identity, original generated cassette illustration, local-first PWA class, and static `dist/` deployment model are retained.

## Verification

Clean clone: `/tmp/audio-gap-loop-clean.KyZoZC`.

```sh
npm ci                         # PASS, 0 audit vulnerabilities
npm test                       # PASS, 8 Vitest + 8 Playwright tests
npm run build                  # PASS, dist/ produced
npm audit --audit-level=high   # PASS, 0 vulnerabilities
```

All six listed claim commands passed independently from that clean clone: `sample-loop`, `demo-isolation`, `offline-reload`, `csv-export`, `backup-export`, and `local-only-demo`.

Local browser evidence:

- `verify-url.sh http://127.0.0.1:4173/` passed: HTTP 200, title, `lang=en`, one h1, main, labelled controls, image alt text, and no console errors.
- Axe in the browser route suite found no serious or critical violations across `/`, `/demo/`, `/privacy/`, `/terms/`, and `/404.html`.
- 390×844 demo measured exactly `390 / 390` for scroll width / client width.
- `/privacy/` moved focus to its h1. Screenshots: `.factory/evidence/demo-mobile.png`, `.factory/evidence/privacy-mobile.png`.
- Claim test `@claim:offline-reload` controls the worker then uses `context.setOffline(true)` and reloads `/demo/` successfully.

Build output: main JavaScript 30.29 kB raw / 10.32 kB gzip; main CSS 17.67 kB raw / 4.66 kB gzip. The 1200×630 social image is 186 kB.

## Deploy

Push this repair commit to `main`; the static deployment work order is configured from that branch. After the push, open `https://audio-gap-loop.sociobot.in/demo/` cold and repeat the route, banner, mobile-overflow, console, and claim smoke checks before declaring the deployed release complete.

## Known gaps

None in the repaired product scope. Studio sales remain intentionally unavailable because checkout is not factory-enabled; the product shows neither a price nor a purchase CTA.
