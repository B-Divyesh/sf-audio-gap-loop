# Copy audit — 2026-08-29, polish 3

The first screen was read aloud at 390×844 and 1440×900. It names the job, audience, sample action, result, and three facts before the fold. Counts are whitespace-delimited. No sentence exceeds 22 words or uses a banned marketing word.

## Landing first screen

| Text | Words | Claim evidence |
| --- | ---: | --- |
| Audio Gap Loop — Timed language practice | 7 | `@claim:real-timed-repeats` |
| Practise audio clips with timed speaking gaps and repeats. | 9 | `@claim:real-timed-repeats` |
| Practise an audio clip in timed repeats | 7 | `@claim:real-timed-repeats` |
| For language learners, parents, and tutors who practise short audio with timed speaking gaps. | 14 | audience statement |
| Try sample practice | 3 | `@claim:sample-spoken-loop` |
| Opens a spoken French greeting with a 3-second speaking gap. | 10 | `@claim:sample-spoken-loop` |
| Sample data stays separate from your audio clips. | 8 | `@claim:demo-isolation` |
| Audio and practice history stay in this browser. | 8 | `@claim:local-only-storage` |
| Saved audio clips work offline after the first visit. | 9 | `@claim:offline-reload` |
| Cassette recorder and headphones beside a blank transcript strip. | 9 | image alt text |

## Landing player and sections

| Text | Words | Claim evidence |
| --- | ---: | --- |
| No audio clips yet | 4 | empty state |
| Add an audio clip you have permission to use. | 9 | import instruction |
| It stays in this browser. | 5 | `@claim:local-only-storage` |
| Offline. | 1 | `@claim:offline-reload` |
| The player and saved audio clips are available. | 8 | `@claim:offline-reload` |
| Choose a transcript line. | 4 | `@claim:real-timed-repeats` |
| Start timed repeats. | 3 | `@claim:real-timed-repeats` |
| Speak in the speaking gap. | 5 | `@claim:real-timed-repeats` |
| Play the selected audio clip. | 5 | `@claim:real-timed-repeats` |
| Use the speaking gap. | 4 | `@claim:real-timed-repeats` |
| Play the audio clip again. | 5 | `@claim:real-timed-repeats` |
| It does not score speech or provide lessons. | 8 | `@claim:product-boundaries` |
| Audio clips and practice history stay in this browser. | 9 | `@claim:local-only-storage` |
| Download a backup with audio clips or a CSV practice log. | 11 | `@claim:backup-export-import`, `@claim:csv-export` |
| Audio Gap Loop repeats audio clips with timed speaking gaps. | 10 | `@claim:real-timed-repeats` |
| Cassette artwork was generated for this product. | 7 | `@claim:artwork-provenance` |

## Populated player and dialog

| Text | Words | Result |
| --- | ---: | --- |
| Audio clips / Current audio clip / Transcript line | 2 / 3 / 2 | consistent terms |
| No transcript yet. | 3 | empty state |
| Use Edit to add one phrase per line. | 8 | recovery action |
| Ready to listen / Start timed repeats / Save practice session | 3 / 3 / 3 | result-naming controls |
| Speaking gap / Repeats / Playback speed / Player volume | 2 / 1 / 2 / 2 | consistent controls |
| Hearing-safe habit: begin below 60% volume, lower it if speech feels sharp, and take regular breaks. | 16 | safety guidance |
| Completed practice will appear here—no score attached. | 7 | empty history state |
| Add an audio clip / Edit audio clip | 4 / 3 | consistent dialog headings |
| Choose the transcript line you want to see during timed repeats. | 11 | `@claim:real-timed-repeats` |
| I have permission to use this audio. | 7 | rights confirmation |
| Save audio clip | 3 | result-naming action |

## Demo, legal, and offline pages

| Text | Words | Claim evidence |
| --- | ---: | --- |
| Demo — sample data is temporary and separate. | 8 | `@claim:demo-isolation` |
| Hear a spoken French greeting. | 5 | `@claim:sample-spoken-loop` |
| The selected line has a 3-second speaking gap. | 9 | `@claim:sample-spoken-loop` |
| Audio, transcript text, settings, and practice history stay in this browser. | 10 | `@claim:local-only-storage` |
| The player makes no third-party requests during normal practice. | 9 | `@claim:local-only-storage` |
| It has no analytics or advertising. | 6 | `@claim:local-only-storage` |
| Delete an audio clip to remove its local practice history. | 10 | `@claim:delete-local-clip` |
| Audio Gap Loop is a practice player. | 7 | product description |
| It is not a language course, hearing test, or pronunciation assessment. | 11 | `@claim:product-boundaries` |
| This page is not available offline. | 7 | offline error state |
| Visit it once while connected. | 5 | recovery instruction |
| Saved audio clips remain in this browser. | 7 | `@claim:local-only-storage` |

## README

| Text | Words | Claim evidence |
| --- | ---: | --- |
| Practise an audio clip in timed repeats. | 7 | `@claim:real-timed-repeats` |
| Audio Gap Loop is for language learners, parents, and tutors using short audio. | 13 | audience statement |
| Demo data stays separate and is cleared when you start for real. | 12 | `@claim:demo-isolation` |
| Import an audio clip you have permission to use. | 9 | instruction |
| Add transcript lines. / Choose one transcript line. | 3 / 4 | `@claim:real-timed-repeats` |
| Set the speaking gap and repeats. / Start timed repeats. | 6 / 3 | `@claim:real-timed-repeats` |
| Audio clips and practice history stay in this browser. | 9 | `@claim:local-only-storage` |
| Saved audio clips and the demo reload offline after their first visit. | 12 | `@claim:offline-reload` |
| Export a backup before clearing browser data. | 7 | instruction |
| You can also export a CSV practice log. | 8 | `@claim:csv-export` |
| The player does not score speech or provide lessons. | 9 | `@claim:product-boundaries` |
| Deploy the contents of `dist/` as a static site. | 9 | `@claim:static-build` |

## Terminology

| Concept | One term |
| --- | --- |
| User-provided sound file | audio clip |
| Prepared try-out | demo |
| Quiet interval | speaking gap |
| Number of cycles | repeats |
| Text alongside an audio clip | transcript line |
| Saved completion record | practice log |
| Timed listen–speak–repeat action | timed repeats |

Automated terminology lint: `src/copy.test.ts`.
