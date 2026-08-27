# Audio Gap Loop visual thesis

## Direction: cassette-era study zine

Audio Gap Loop should feel like a beloved language-lab tape annotated by hand: focused, tactile, private, and deliberately outside the reward-loop vocabulary of mainstream learning apps. The visual system borrows the useful parts of cassette culture—physical controls, track markings, paper labels, and a little print misregistration—without turning the player into a novelty prop. Decoration explains the product’s listen / speak / check rhythm.

The treatment is intentionally single-mode. A warm paper field and ink-black type keep long practice sessions calm; the dark cassette well supplies depth without introducing a second theme that would compete with the task.

## Palette

| Token | Hex | Use |
| --- | --- | --- |
| Paper | `#F4E9CE` | Page background, light control faces |
| Tape black | `#161712` | Primary text, player well |
| Carbon | `#2E3028` | Raised dark surfaces |
| Faded ink | `#5F604F` | Secondary copy on paper |
| Signal orange | `#E64A2E` | Primary actions, current phase, focus accents |
| Oxide red | `#9E2E24` | Errors and destructive actions |
| Spool blue | `#1E6D75` | Links, success, secondary control accents |
| Chalk | `#FFF9E9` | Text on dark surfaces |
| Safety yellow | `#F1C84B` | Hearing guidance and offline/update notices |

Body combinations meet WCAG AA: Tape black on Paper is approximately 15:1; Faded ink on Paper approximately 5.3:1; Chalk on Tape black approximately 16:1; Chalk on Signal orange is reserved for large/bold controls and buttons use Tape black text where needed.

## Type

- Display: `Arial Black`, `Franklin Gothic Heavy`, system sans-serif. Compressed, all-caps labels recall duplicated zine mastheads and cassette stickers without a font download.
- Working text: `Arial`, `Helvetica Neue`, system sans-serif. Neutral, highly legible, and available offline on every target platform.
- Track counters and timings use tabular numerals. Type scale: 14, 16, 20, 25, 40–64 responsive. Body never drops below 16px.

No external font files are loaded. The combination is a deliberate system-font pairing, keeping the first visit light and the offline install self-contained.

## Spacing and composition

The base rhythm is 4px, with primary intervals of 8, 12, 16, 24, 32, 48, and 64px. A narrow `min(1120px, 100% - 32px)` workbench sits on the paper field. The hero uses a two-column editorial spread; the product workspace becomes a split library/player layout and collapses to one deliberate column at 760px. Touch targets are at least 44px. Corners are modest (2–14px) and never uniformly card-like: grouping comes from proximity, paper rules, and contrasting material surfaces.

## Interaction grammar

- Import is the unmistakable primary action in the empty state.
- A selected clip behaves like a physical tape placed in the player well.
- Cadence is expressed as a three-part tape cue: LISTEN → YOUR TURN → REPEAT. The active phase is named in a live region and marked by a moving playhead.
- Orange indicates the current/actionable thing, blue indicates saved/complete state, and every status includes words or icons so color never carries meaning alone.
- Buttons depress by 1px; editing panels open adjacent to their trigger; deletion names the clip in a native confirmation.
- Keyboard: Space plays/pauses outside text fields; R restarts the loop; arrow left/right seek five seconds; Escape closes dialogs.

## Motion

Transitions last 160–240ms and only communicate state: cassette placement, playhead progression, dialog entrance, and toast arrival. Nothing flashes or decoratively loops. The reel marks rotate only while audio is playing, acting as playback state rather than ambient animation. With `prefers-reduced-motion: reduce`, transforms and smooth scrolling are removed, reel marks stop, and state changes are immediate.

## Original asset plan and provenance

### Hero: “the patient tape deck”

Use case: `stylized-concept`. A landscape editorial collage used above the fold and echoed as the empty-state artwork. It depicts one unbranded compact cassette, a simple portable recorder, headphones resting beside a torn transcript strip, and three bold colored timing blocks. The scene explains bring-your-own audio and the quiet gap between repeats.

Art direction prompt:

> Use case: stylized-concept. Asset type: responsive landing-page hero illustration for an offline language audio utility. Scene/backdrop: overhead cassette-era study desk assembled as a screen-printed zine collage on warm fibrous cream paper. Subject: one generic unbranded compact cassette partly inserted into a simple portable tape recorder, modest over-ear headphones, a torn blank transcript strip, and three abstract timing blocks that visually suggest listen, pause, repeat. Style/medium: tactile 1980s risograph and cut-paper editorial collage, coarse halftone, imperfect two-pass ink registration, crisp intentional silhouettes. Composition/framing: wide landscape with the main tape deck centered, generous calm negative space at the edges, readable at small mobile crop. Lighting/mood: flat printed light, patient, studious, non-addictive. Color palette: soot black, faded cream paper, signal orange, muted teal, small safety-yellow accents. Materials/textures: ink grain, scuffed plastic, paper fibers, magnetic tape. Constraints: original generic objects only; no people; no written words; no letters or numbers; no logos, trademarks, brand shapes, watermarks, UI screenshots, gradients, glossy 3D, neon, trophies, coins, mascots, confetti, or gamification symbols.

Generated with the factory Azure image deployment (`factory-image`) through `/opt/fleet/lib/gen-image.sh` on 2026-08-27. The selected PNG source and JSON prompt sidecar live in `assets/src/`; optimized WebP/AVIF derivatives live in `public/assets/`. Generated imagery is original to this product and is disclosed in the footer.

App icons are hand-authored SVG-derived raster assets: a black cassette window with two cream reels and an orange gap marker. They use only primitive geometry and belong to this repository under MIT.

## Safety and content tone

Copy is instructional, calm, and concrete. There are no scores, streaks, celebrations, badges, or urgency. The interface reminds listeners to begin below 60% volume and take breaks; it never increases device volume. “Done for now” records a practice session without judging performance.
