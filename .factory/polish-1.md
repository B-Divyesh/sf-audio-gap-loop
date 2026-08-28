# Polish 1 — finding closure map

Candidate repaired from `f0e7e9abfd3fbc5f9d09cdd4039e52872982a29c` in commit `4ff1f0b67d417ac0c3d886d5c687f291e89099a1`.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Rewrote the first screen with “Practise a language clip in timed repeats” and the named learner/parent/tutor audience. | `@claim:sample-loop`; `.factory/evidence/demo-mobile.png` |
| F-1-2 | Added the first-screen **Try a sample practice loop** action and `/demo/` prepared Bakery greeting sample. | `@claim:sample-loop`; `/demo/` local check |
| F-1-3 | Demo now uses `demo:audio-gap-loop` plus `demo:` local keys, has persistent banner/reset/start-real controls, and never reads the real namespace. | `@claim:demo-isolation`; `.factory/demo.md` |
| F-1-4 | Added `.factory/claims.json`; every entry has exactly one tagged Playwright proof. | Clean-clone run of all six claim commands |
| F-1-5 | Removed unsupported format, payment, merchant, “forever”, and broad marketing promises. Kept demo, export, privacy, and offline statements only where observable claim tests exist. | `.factory/claims.json`; `@claim:*` suite |
| F-1-6 | Added built `/demo/` and cassette-style `404.html`; Static Web Apps has a 404 response override. | `npm run build`; local `/demo/`, `/404.html` checks |
| F-1-7 | Standardized legal header/footer links and added focus/route announcement script for legal and 404 pages. | Browser check: `/privacy/` active element is `Privacy information`; route test |
| F-1-8 | Added canonical and route metadata, OG/Twitter metadata, SVG favicon, 180px touch icon, and original 1200×630 art derivative. | Built route inspection; `public/assets/social-tape-deck-1200x630.webp` |
| F-1-9 | Removed unavailable price, checkout, merchant, refund, and purchase copy. Studio now says it is not available. | Browser route test; no enabled checkout CTA in source UI |
| F-1-10 | Replaced slogans/cassette-lore and vague labels with plain product terms and result-naming buttons. | `.factory/copy-audit.md` |
| F-1-11 | Rewrote README into short reader-facing run/use/route documentation; removed unavailable Studio and deployment jargon. | README review; `.factory/copy-audit.md` |
| F-1-12 | Removed mobile hero overhang and made the regression exact. | 390×844 browser: `scrollWidth === clientWidth === 390`; `.factory/evidence/demo-mobile.png` |

Earlier verification findings on checkout, caching, security headers, service-worker updates, touch targets, PWA assets, privacy, and basic accessibility were rechecked against the repaired source. The checkout remains deliberately absent until the factory enables it; no un-actionable sales claim remains. Static cache/security policies and the PWA worker remain present, now at shell version v4.

## Evidence commands

```sh
npm ci
npm test
npm run build
npm audit --audit-level=high
for claim in sample-loop demo-isolation offline-reload csv-export backup-export local-only-demo; do
  npm test -- --grep "@claim:$claim"
done
```

All commands passed in a clean clone at `/tmp/audio-gap-loop-clean.KyZoZC`. Local `/demo/`, `/privacy/`, and `/404.html` passed browser checks; screenshot evidence is in `.factory/evidence/`.

## Deployed recheck

Deployed through the static work-order configuration on 2026-08-28: Azure Static Web Apps deployment `a6153a38-15c6-4dab-b303-697bffdff62c` succeeded, custom-domain status was `Ready`, and HTTPS returned 200.

Cold live Playwright checks at `https://audio-gap-loop.sociobot.in` found one h1, exact 390/390 mobile width, and zero serious/critical axe findings on `/`, `/demo/`, `/?demo=1`, `/privacy/`, `/terms/`, and a missing URL. `/demo/` and `?demo=1` showed the demo banner; privacy/terms/404 focused their h1. `/opt/fleet/lib/verify-url.sh` passed on the live root with zero root-page console errors.
