# Polish 2 — cumulative finding closure map

Repaired from review target `4172787b16974d5370392658b5fba1a0fa0dcdf6`. Local evidence is from the final repaired build; live evidence is added after the work-order deployment.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Kept the plain job-first headline and named audience; reduced hero scale and spacing so its action note and facts fit. | `root has no demo banner…`; `.factory/evidence/polish-2-mobile.png`, `.factory/evidence/polish-2-desktop.png`; live root check pending deployment. |
| F-1-2 / F-2-2 | Replaced the synthesized tone and bakery-dialogue claim with a shipped, CC-BY native-speaker **Bonjour** sample, selected transcript line, and real playback phase test. | `@claim:sample-spoken-loop`; `.factory/demo.md`; `.factory/evidence/polish-2-demo-mobile.png`; live demo check pending deployment. |
| F-1-3 / F-2-8 | Demo uses its own database and keys; Reset reseeds it; Start for real deletes all demo keys and database. | `@claim:demo-isolation`; `.factory/demo.md`; live demo exit check pending deployment. |
| F-1-4 / F-1-5 / F-2-3 | Replaced the claims inventory with seven outcome-level browser proofs for sample cadence, isolation, offline reload, CSV, backup restore, local storage/network, and deletion. Removed or narrowed unsupported copy. | Every command in `.factory/claims.json`; `npm test`; live normal/demo request check pending deployment. |
| F-1-6 | Preserved built `/demo/`, `?demo=1`, and designed 404 with Static Web Apps response override. | `the direct ?demo=1 route…`; `all routes expose…`; live route crawl pending deployment. |
| F-1-7 / F-2-4 | Made header and footer links identical on root, demo, legal, and 404 pages. Root now runs the page-show route focus script, including Back navigation. | `root has no demo banner…`; live Back-focus check pending deployment. |
| F-1-8 / F-2-5 | Added the full canonical, theme color, Open Graph, Twitter, favicon, and Apple-touch metadata set on every built route; `?demo=1` updates metadata at runtime. | `all routes expose complete metadata…`; `the direct ?demo=1 route…`; live metadata check pending deployment. |
| F-1-9 | Rechecked that no price, checkout, merchant, or purchase call-to-action is rendered. | Full route browser suite; live root check pending deployment. |
| F-1-10 / F-2-6 | Rewrote populated labels to Audio clips, Hear again, Start timed repeats, Save practice session, speaking gap, and repeats; terms h1 now names the page. | `npm test`; `.factory/copy-audit.md`; live copy check pending deployment. |
| F-1-11 / F-2-7 | Removed reader-facing implementation jargon from README and kept setup text short. | README review; `.factory/copy-audit.md`; live not applicable. |
| F-1-12 | Kept the 390 px layout within its viewport. | `root has no demo banner…`; `.factory/evidence/polish-2-mobile.png`; live mobile check pending deployment. |
| F-2-1 | Added the `[hidden]` demo-banner rule and tests that normal `/` has no banner while demo routes do. | `root has no demo banner…`; `the direct ?demo=1 route…`; live root/demo check pending deployment. |
| F-2-9 | Tightened desktop and mobile hero typography/spacing and assert all action/fact boxes are inside 390×844 and 1440×900 viewports. | `root has no demo banner…`; screenshots above; live viewport check pending deployment. |
| F-2-10 | Put demo controls in a labelled top-level section, changed the clip library to a labelled section, and enforced 44 px banner, input, footer, and recovery targets. The route suite now fails on any axe violation. | `all routes expose complete metadata…`; `root has no demo banner…`; Playwright AxeBuilder reports zero violations; live axe check pending deployment. |

## Local verification

```sh
npm ci
npm test
npm run build
npm audit --audit-level=high
/opt/fleet/lib/verify-url.sh http://127.0.0.1:4173 /tmp/audio-gap-loop-verify
```

`npm test` passed 8 unit tests and 10 browser tests. The local verifier reported HTTP 200, zero console errors, one h1, `lang=en`, main, and no missing image alt or unlabelled buttons. The Playwright AxeBuilder route suite reported zero violations. The standalone axe CLI could not start its own Chrome in this container; the repository's preinstalled Playwright Chromium ran the equivalent AxeBuilder scan.
