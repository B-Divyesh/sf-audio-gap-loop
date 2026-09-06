# Review 5 handoff — Practise audio clips in timed repeats

## Result

Independent seven-day review completed with **FAIL**.

- Findings: 1 minor
- Untested claims: 0
- Product code changes: none
- Implementation candidate: `f690790702da06d746fc7354f01d1d7886b4c809`
- Documentation SHA before review: `cea5c72caeb27bcc4e7aca25cdf8c2c804e56f12`
- Report: `.factory/review-5.md`

## Finding left for repair

Malformed backup JSON displays the browser's raw parser error, and wrong-schema JSON gives no next action. Replace both with plain recovery guidance and add a browser test. See F-5-1 in the report.

## Verified

- Every command in `.factory/claims.json`: pass independently from `/tmp/audio-gap-loop-review5.pn02cI`.
- `npm test`: 13 unit/contract and 16 browser tests pass.
- `npm run build`: pass; `dist/` produced.
- Full 16-test Playwright suite against `https://audio-gap-loop.sociobot.in`: pass.
- Fresh 390×844 and 1440×900 first screens, populated sample, reset, storage isolation, exit cleanup, file boundaries, keyboard, focus, reduced motion, offline reload, update notice, legal routes, expected 404, and privacy requests were checked.
- Live AxeBuilder route scans: zero violations.
- Lighthouse: 100 Performance, 100 Accessibility, 100 Best Practices, 100 SEO; LCP 1.4 s, CLS 0, TBT 0 ms.
- Production parity: all 26 public build files match the implementation candidate.

## Evidence

- `/work/.evidence/qa-report.md`
- `/work/.evidence/qa-result.json`
- `/work/.evidence/review-5-phone.png`
- `/work/.evidence/review-5-desktop.png`
- `/work/.evidence/review-5-demo-mobile.png`
- `/work/.evidence/live-verify/verify.json`
- `/work/.evidence/lighthouse-review-5.json`

## Re-run

```sh
npm ci
npm test
npm run build
PLAYWRIGHT_BASE_URL=https://audio-gap-loop.sociobot.in npx playwright test
/opt/fleet/lib/verify-url.sh https://audio-gap-loop.sociobot.in /tmp/audio-gap-loop-review-5-verify
```

After repairing F-5-1, repeat the malformed and wrong-schema backup checks as well as the commands above.
