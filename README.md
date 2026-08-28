# Audio Gap Loop

Practise a language clip in timed repeats. It is for learners, parents, and tutors who want a quiet listen–speak–repeat routine.

Try the prepared sample at [audio-gap-loop.sociobot.in/demo/](https://audio-gap-loop.sociobot.in/demo/). The demo is separate from your own browser data and includes a reset control.

## Use it

Import audio you have permission to use. Add transcript lines. Select one line. Set the silent gap and repetitions. Export a CSV log or JSON backup when needed.

The player keeps imported material in browser storage. Export a backup before clearing site data. The demo can reload offline after its first visit. The claims and their browser proofs are listed in [.factory/claims.json](.factory/claims.json).

## Run and verify

Requires Node.js 20 or newer.

```sh
npm ci
npm test
npm run build
npm run preview
```

`npm run build` creates `dist/`. The static deploy serves that directory. The PWA service worker caches the shell for offline reloads.

## Routes

- `/` — player and import flow
- `/demo/` or `?demo=1` — isolated sample loop
- `/privacy/` and `/terms/` — legal information
- `/404.html` — recovery page

## Project files

- `src/main.ts` — player and demo behaviour
- `src/db.ts` — browser database access
- `public/sw.js` — offline cache
- `.factory/demo.md` — demo namespace and reset details
- `.factory/design.md` — visual system and asset provenance

## License

MIT. See [LICENSE](LICENSE).
