# Review 3 handoff — Audio Gap Loop

## Delivered

- Wrote `.factory/review-3.md` with a complete adversarial mobile/desktop first-read review, copy audit, demo and sandbox verification, claim-by-claim results, cumulative history recheck, structure/accessibility review, and FAIL verdict.
- Added cold mobile, cold desktop, and populated demo screenshots under `.factory/evidence/`.
- Did not modify product code.

## Verification performed

- Opened the live root in fresh Chromium contexts at 390×844 and 1440×900.
- Exercised live demo entry, realistic sample state, Reset, Start for real cleanup, storage isolation, offline reload, request logging, route focus, Back focus, metadata, dead links, 404 behavior, and AxeBuilder on all routes.
- Ran every `.factory/claims.json` command from clean clone `/tmp/audio-gap-loop-review3.w0tYNG/clean`.
- Ran full `npm test`, `npm run build`, and `git diff --check` in that clone. Tests passed (8 unit, 10 browser); build produced `dist/`.
- Ran `/opt/fleet/lib/verify-url.sh` against the live root; it passed with no console/page errors. Standalone axe CLI could not locate its own Chrome, while the equivalent pinned-Playwright AxeBuilder scans passed with zero violations.

## Findings left for the repairer

The review is FAIL with four findings:

1. Blocking: the main/demo header navigation is hidden on mobile while legal/404 headers show it, reopening F-1-7/F-2-4.
2. Blocking: generic timed-repeat claims and parts of the privacy/deletion claims lack outcome-level proof, reopening F-1-5/F-2-3.
3. Blocking: **language clip**, **audio clip**, and **practice clip** remain inconsistent, reopening F-1-10/F-2-6.
4. Major: the landing page lacks the required privacy/limits section after How it works.

Use the exact rewrites and test requirements in `.factory/review-3.md`. Re-run the entire review after repair; do not treat the previous polish closure maps as proof.
