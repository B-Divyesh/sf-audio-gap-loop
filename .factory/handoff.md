# Audio Gap Loop — verification handoff

## Independent verifier result — **FAIL**

Verified candidate: `67ba716f65d8c2cb2d8439cff033c09599be3755`
Target: `https://audio-gap-loop.sociobot.in`
Verified: 2026-08-27 23:24 UTC

The source candidate passes a clean install, its full unit/E2E suite, exact production build, and independent local browser/PWA/accessibility/privacy QA. It **must not be released** because the live target fails normal HTTPS with `ERR_CERT_COMMON_NAME_INVALID`; bypassing certificate validation returns Azure `404 Site Not Found` for both `/` and the PWA assets. An earlier transient candidate HTML response referenced JS/CSS/SW/manifest resources that also returned Azure 404 pages, so it was not usable either.

Release-blocking defects:

1. **P0 — Invalid TLS certificate.** The certificate SAN does not contain `audio-gap-loop.sociobot.in`.
2. **P0 — Static deployment/routing absent or misbound.** Repeated diagnostics returned HTTP 404 Azure pages for root and candidate assets.
3. **P2 — Deployment hardening.** The briefly observed candidate shell lacked CSP and Permissions-Policy headers; add them when repairing host configuration.

Exact commands/results: `npm ci` PASS (0 audit vulnerabilities); `npm test` PASS after installing the missing worker Chromium runtime (3 Vitest + 2 Playwright); `npm run build` PASS (`dist/`, 9.63 kB gzip JS, 4.43 kB gzip CSS). Local QA covered real WAV import, rights validation, invalid file/backup recovery, 1–30 repetition bounds, transcript selection, persistence, completion log, backup download, 390 px layout, keyboard/dialog/focus, reduced motion, 0 axe serious/critical findings, local-only free-flow requests, service-worker offline shell, and update toast.

See `.factory/verification.md` for full evidence and rerun criteria. No product code was modified by verification.

---

# Original builder handoff

Work order: `audio-gap-loop-build-1`
Completed: 2026-08-27

## What was built

- A complete Vite + vanilla TypeScript local-first PWA for short owned audio.
- Audio import with type/100 MB validation, rights confirmation, local titles, and one-phrase-per-line transcripts.
- IndexedDB storage for source audio, clip settings, active transcript line, and practice history. No audio or transcript upload path exists.
- A listen → silent speaking gap → repeat player with 1–20 second gaps, 1–30 repetitions, 0.6×–1.25× playback, seek, replay, pause, and player-volume controls.
- Automatic local session logging plus a “Done for now” path for partial sessions.
- JSON backup/export including audio, last-write-wins JSON restore, and CSV log export. These remain free.
- Keyboard controls: Space play/pause, R replay, arrows seek; native dialog Escape handling.
- Hearing-safe guidance, named errors/empty/loading/offline states, confirmed destructive deletion, and mobile layouts designed at 390 px.
- Versioned service-worker app-shell caching, offline navigation fallback, install manifest, 192/512/maskable icons, update toast, and an actual-connectivity message probe.
- Optional $9 one-time Studio unlock through the Sociobot billing contract: hosted checkout link, `?license=` capture and URL cleanup, local token storage, daily cached verify, background/offline-safe behavior, restore field, reusable cadence presets, and an ordered practice queue.
- Standalone `/privacy/` and `/terms/` pages, `robots.txt`, sitemap, MIT license, and complete README.
- A product-specific cassette-era zine system documented in `.factory/design.md`. The original hero was generated through `/opt/fleet/lib/gen-image.sh`, reviewed, and shipped as responsive AVIF/WebP; its source and prompt sidecars are in `assets/src/`.

## Verification

All checks were run against the production build on 2026-08-27.

- `npm test` — PASS: 3 Vitest unit tests and 2 Playwright end-to-end tests.
  - Imports a generated real WAV, stores it in IndexedDB, chooses a transcript line, survives reload, and reloads with `context.setOffline(true)`.
  - axe-core serious/critical scan passes both the empty app and populated player.
  - 390×844 view has no horizontal overflow and exposes the primary import action.
  - Browser console errors are asserted empty throughout the end-to-end flow.
- `npm run build` — PASS. Exact deploy output is `dist/`, with `dist/index.html` at its root plus `dist/privacy/index.html` and `dist/terms/index.html`.
- `/opt/fleet/lib/verify-url.sh http://127.0.0.1:4173/ /tmp/audio-gap-verify` — PASS: HTTP 200, 529 ms local load, 0 console/page errors, `lang="en"`, exactly 1 h1, main landmark present, 0 missing image alts, 0 unlabeled buttons.
- Lighthouse mobile, headless Chromium:
  - Performance: **100**
  - Accessibility: **100**
  - Best Practices: **100**
  - SEO: **100**
  - LCP: **1.66 s**
  - Total Blocking Time (INP lab proxy): **0 ms**
  - CLS: **0**
  - Total transferred: **134,849 bytes**
- Production bundle: 28.3 KB JavaScript / 16.4 KB main CSS before gzip. Mobile hero: 23.4 KB AVIF / 51.7 KB WebP. Large WebP: 171.7 KB. All are below the specified budgets.
- `npm audit --audit-level=high` — PASS, 0 vulnerabilities.
- `git diff --check` — PASS.

## Known gaps / factory next steps

- The live hosted checkout and verification response cannot be end-to-end purchased until the factory registers `audio-gap-loop` in the Sociobot billing engine. The code contains no product ID or secret. Use `VITE_BILLING_BASE=https://pilot-api.sociobot.in/api/v1` for staging, then test purchase/restore/revocation with the registered test product.
- Playback codec support follows the browser. The UI accepts the common formats in the brief and gives a conversion-oriented error when a codec cannot decode.
- Storage capacity is browser/device dependent. Each new file is capped at 100 MB, but there is intentionally no cloud copy; users should export backups before clearing browser data.

No infra, DNS, billing registration, or secrets were changed from this repository.
