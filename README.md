# Audio Gap Loop

Practise an audio clip in timed repeats. Audio Gap Loop is for language learners, parents, and tutors using short audio.

Try the spoken French sample at [audio-gap-loop.sociobot.in/demo/](https://audio-gap-loop.sociobot.in/demo/). Demo data stays separate and is cleared when you start for real.

## Practise with your own audio

1. Import an audio clip you have permission to use.
2. Add transcript lines.
3. Choose one transcript line.
4. Set the speaking gap and repeats.
5. Start timed repeats.

Audio clips and practice history stay in this browser. Saved audio clips and the demo reload offline after their first visit.

Export a backup before clearing browser data. You can also export a CSV practice log.

The player does not score speech or provide lessons.

## Run and verify

Requires Node.js 20 or newer.

```sh
npm ci
npm test
npm run build
npm run preview
```

`npm run build` creates `dist/`. The claim list and browser proofs are in [.factory/claims.json](.factory/claims.json).

## Deploy

Deploy the contents of `dist/` as a static site. The deployment configuration ships in that directory.

## Routes

- `/` — player and import flow
- `/demo/` or `?demo=1` — isolated sample practice
- `/privacy/` and `/terms/` — legal information
- `/404.html` — recovery page

## License

MIT. See [LICENSE](LICENSE).
