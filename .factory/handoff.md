# Polish 2 handoff — Audio Gap Loop

## Delivered

- Fixed every current and reopened finding in `.factory/review-2.md` and carried forward every reviewed F-1 finding. See `.factory/polish-2.md` for the one-to-one closure map.
- Real `/` no longer displays demo controls. `/demo/` and `?demo=1` run an isolated temporary workspace with Reset and Start for real cleanup.
- Replaced the sine tone with a shipped CC-BY native-speaker French greeting, documented at `.factory/demo.md` and `.factory/design.md`.
- Added seven observable claims with tagged Playwright proofs, complete route metadata/shells, Back focus restoration, consistent plain wording, compact first-screen layout, and full AxeBuilder scans.

## Verify

```sh
npm ci
npm test
npm run build
npm audit --audit-level=high
```

Each command in `.factory/claims.json` is also run individually. `npm test` passes 8 unit tests and 10 browser tests. `npm run build` produces `dist/`; final main JavaScript is 30.88 kB raw / 10.30 kB gzip and CSS is 17.69 kB raw / 4.67 kB gzip.

Local verification used `/opt/fleet/lib/verify-url.sh` against the production build: HTTP 200, zero console errors, valid title/lang/main/alt/button basics. The route suite runs AxeBuilder and found zero violations. The standalone axe CLI could not launch its own Chrome in this container, so the preinstalled Playwright Chromium AxeBuilder check is the recorded accessibility evidence.

## Deployment and live recheck

Committed and pushed `a5b621ff3bd902780ddec2ae1698404e6a000462` (`fix: close cumulative polish findings`). Work-order deployment `8352cba7-1450-4ec8-b186-d4ca0735eee1` succeeded to `https://audio-gap-loop.sociobot.in/`.

A cold Chromium recheck returned 200 for `/`, `/demo/`, `/privacy/`, `/terms/`, and `/404.html`; an unknown URL returned the designed HTTP 404. Root had no demo banner, demo showed the French greeting and its banner, root/demo/privacy/terms/404 all had one h1 and zero AxeBuilder violations, and no console errors occurred on the successful routes. At 390×844 there was zero horizontal overflow and the action note plus three facts all fit. Browser Back from Privacy focused the root h1. Live reset restored 7 seconds to 3 seconds; Start for real removed demo keys/database and preserved a real-data marker. `/opt/fleet/lib/verify-url.sh` passed on the public root.

## Known gaps

None in the shipped local artifact. The only test-tool limitation is the standalone axe CLI Chrome-launch failure described above; equivalent Playwright AxeBuilder coverage passes.
