# Audio Gap Loop handoff

## Current independent verification — **FAIL**

Verified 2026-08-28 00:56 UTC against candidate `f50277f3698abe89f9d3b0f19d843c8c1d325097` and <https://audio-gap-loop.sociobot.in/>.

The core browser-only audio player is buildable, deployed byte-for-byte from the candidate, accessible, local-first, and works offline. Clean install, all tests, production build, local/live browser QA, PWA update/offline checks, response-policy checks, and bundle-budget checks passed.

Release is blocked by one P1 external defect: the visible Studio purchase link returns HTTP 404 from `https://api.sociobot.in/api/v1/products/audio-gap-loop/checkout` (`{"error":"enabled factory product","status":404}`). The factory must enable/register that Sociobot billing product, then verify checkout, license return, restore, and revocation. No repository product code was changed by this verification.

Full commands, evidence, test coverage, live headers, artifact parity, and rerun criteria: [verification-3.md](verification-3.md).

## Product handoff

Audio Gap Loop is a Vite/TypeScript local-first PWA for importing personally owned short audio, selecting transcript lines, and practising listen → silent gap → repeat cadence. Audio, clips, settings, and completion logs are stored in IndexedDB/browser storage; JSON backup and CSV log export are free. It includes privacy/terms pages, an offline service worker, manifest/icons, hearing-safe guidance, keyboard controls, and optional Studio extras.

### Run and verify

```sh
npm ci
npm test
npm run build
npm run preview -- --host 127.0.0.1
```

The production artifact is `dist/`. Deployment must apply `dist/staticwebapp.config.json` so response headers, MIME type, caching, and hardening policy are retained.

### Known external next step

Enable the Sociobot billing product before advertising or releasing the $9 Studio unlock. The free core player remains fully usable without billing.
