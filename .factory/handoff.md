# Review 2 handoff — Audio Gap Loop

## Delivered

- Added `.factory/review-2.md` with a fresh adversarial mobile/desktop review.
- Did not modify product code.
- Verdict: **FAIL**. Blocking issues include a demo banner displayed over the real-storage route, non-dialogue sample audio, incomplete claim coverage, and reopened route/copy/metadata findings.

## Verification

All checks used candidate `4172787b16974d5370392658b5fba1a0fa0dcdf6`. Claim commands ran in clean clone `/tmp/audio-gap-loop-review2.ROY8bs/clean`.

```sh
npm ci
npm test -- --grep @claim:sample-loop
npm test -- --grep @claim:demo-isolation
npm test -- --grep @claim:offline-reload
npm test -- --grep @claim:csv-export
npm test -- --grep @claim:backup-export
npm test -- --grep @claim:local-only-demo
npm test
npm run build
/opt/fleet/lib/verify-url.sh https://audio-gap-loop.sociobot.in <temporary-output-directory>
```

All commands passed; `dist/` was produced. Live Chromium checks covered 390×844 and 1440×900 cold reads, demo/reset/exit storage, offline reload, request logging, route metadata, Back focus, link status, mobile width, and axe. Command success does not resolve the outcome-level claim gaps detailed in the review.

## Left for the repair worker

See `.factory/review-2.md`. No review finding was repaired in this reviewer work order.
