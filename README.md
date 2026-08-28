# Audio Gap Loop

Audio Gap Loop is a calm, browser-only listen–say–check player for short audio you own. It is for language learners, parents, and tutors who want precise repetition timing without scores, streaks, speech grading, or an account.

Live product: <https://audio-gap-loop.sociobot.in>

## What it does

- Imports MP3, M4A, WAV, OGG, Opus, and WebM clips up to 100 MB.
- Keeps audio, transcripts, cadence settings, and completion logs in IndexedDB on the current device.
- Plays a clip, waits for a configurable silent speaking gap, and repeats it 1–30 times at 0.6×–1.25× speed.
- Lets the learner mark one transcript phrase to keep in view.
- Logs completed sessions locally and exports a CSV log or complete JSON backup, including audio.
- Installs as a PWA and reloads saved clips offline.
- Includes hearing-safe volume guidance and keyboard controls.

Studio is an optional $9 one-time license unlock for reusable cadence presets and an ordered practice queue. The core player, unlimited clips, safety features, and data export are free. Checkout and license verification use the Sociobot billing API; no payment provider is embedded here.

## Run locally

Requires Node.js 20 or newer.

```sh
npm install
npx playwright install chromium
npm run dev
```

Open the URL printed by Vite. No account, API key, or backend is needed for the core product.

## Test and build

```sh
npm test
npm run build
npm run preview
```

`npm test` runs Vitest unit tests and Playwright end-to-end checks, including an axe accessibility scan, 390 px layout check, real WAV import, IndexedDB persistence, and `context.setOffline(true)` reload. The exact production build command is `npm run build`; output is written to `dist/` with `dist/index.html` at its root.

## Keyboard controls

When focus is not inside a form control:

- `Space`: start or pause the cadence
- `R`: replay from the beginning
- `Left Arrow` / `Right Arrow`: seek five seconds
- `Escape`: close the clip dialog (native dialog behavior)

Every action is also available through labelled buttons and standard form controls.

## Storage and privacy

Audio never leaves the browser. IndexedDB stores clips and logs; localStorage stores the selected clip, Studio presets/queue, and any license token. The only optional network request containing user data is a Studio license verification request. See the in-product [privacy policy](https://audio-gap-loop.sociobot.in/privacy/) and [terms](https://audio-gap-loop.sociobot.in/terms/).

Clearing site storage deletes local material. Use **Export backup** first if it matters. Backup imports use last-write-wins based on each clip’s `updatedAt` value; practice log entries merge by ID.

## Configuration

Production defaults to `https://api.sociobot.in/api/v1`. A factory staging build can override the billing host without changing code:

```sh
VITE_BILLING_BASE=https://pilot-api.sociobot.in/api/v1 npm run build
```

The product slug is `audio-gap-loop`; no billing product ID or secret is stored in this repository.

## Project map

- `src/main.ts` — interface, player state machine, import/export, Studio extras
- `src/db.ts` — IndexedDB clips and practice logs
- `src/license.ts` — checkout return, cached verification, restore flow
- `public/sw.js` — versioned app-shell cache and connectivity probe
- `.factory/design.md` — product-specific visual system and image provenance
- `assets/src/` — original generated art and authored icon source

## Deployment

Deploy the contents of `dist/` as a static site. Configure clean directory paths so `/privacy/` and `/terms/` resolve to their generated `index.html` files. The generated `staticwebapp.config.json` is part of the artifact: it caches fingerprinted `/assets/*` for one year with `immutable`, keeps the worker and shell revalidated, declares the manifest MIME type, and applies the CSP, permissions, and frame protections. Do not deploy source `.env` files or modify DNS/billing from this repository.

## License

MIT. See [LICENSE](LICENSE).
