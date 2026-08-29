# Audio Gap Loop

Practise a language clip in timed repeats. It is for learners, parents, and tutors who want a calm listen–speak–repeat routine.

Try the spoken French sample at [audio-gap-loop.sociobot.in/demo/](https://audio-gap-loop.sociobot.in/demo/). Demo data is separate from your clips and is cleared when you start for real.

## Use it

Import audio you have permission to use. Add transcript lines. Choose one line. Set a speaking gap and repeats. Start timed repeats.

Your clips and practice data stay in this browser. Export a backup before clearing browser data. Export a CSV practice log when needed. The demo reloads offline after its first visit.

## Run and verify

Requires Node.js 20 or newer.

```sh
npm ci
npm test
npm run build
npm run preview
```

`npm run build` creates `dist/`. The claim list and browser proofs are in [.factory/claims.json](.factory/claims.json).

## Routes

- `/` — player and import flow
- `/demo/` or `?demo=1` — isolated sample practice
- `/privacy/` and `/terms/` — legal information
- `/404.html` — recovery page

## License

MIT. See [LICENSE](LICENSE).
