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

Commit, work-order deployment identifier, and cold live results are recorded after deployment in this handoff and `.factory/polish-2.md`.

## Known gaps

None in the shipped local artifact. The only test-tool limitation is the standalone axe CLI Chrome-launch failure described above; equivalent Playwright AxeBuilder coverage passes.
