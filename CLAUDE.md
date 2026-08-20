# CLAUDE.md — Rona's World Project Documentation
*Last updated: August 19, 2026*

## Project Vision
A personal website that functions as an interactive experience rather than a traditional portfolio. Visitors are welcomed through a series of prompts, then explore "Rona's World" — a map of five clickable locations, each revealing a different facet of who Rona is. The overarching goal is mutual discovery: getting to know the visitor while helping them understand themselves better through thoughtful questions.

---

## Tech Stack

### Frontend
- **React** (via Vite) — component-based UI
- **JavaScript/JSX** — no TypeScript
- **CSS modules per component** — no Tailwind
- **SVG** — for the world map, café interior, and overlook interior
- **Rive** (`@rive-app/react-canvas`) — for the Commons location's animated scenes
- **@dnd-kit/core** — drag-and-drop, used for Café's Ugly Art ranking and Commons' Kiss/Marry/Kill question

### Backend
- **Python + FastAPI** — REST API server
- **Supabase (PostgreSQL)** — hosted database
- **uvicorn** — ASGI server for FastAPI

### Key Libraries
- `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities` — drag to rank (Ugly Art book), Kiss/Marry/Kill (Commons)
- `@rive-app/react-canvas` — Commons scene animations
- `python-dotenv` — environment variables
- `supabase` (Python client v2.31.0) — database access

---

## Running the Project

### Frontend
```bash
npm run dev
# runs at http://localhost:5173
```

### Backend
```bash
cd backend
source venv/bin/activate
uvicorn main:app --reload
# runs at http://localhost:8000
```

---

## File Structure

```
personal-website-2.0/
  public/
    RonaLiu-Zhong_resume.pdf
    art/
      dali.jpg
      hirst.jpg
      koons.png
      millet.jpg
    commons/
      card-scene.riv        ← the card table (mom/dad/sister)
      walking-scene.riv      ← the walk (girlfriend)
      room-scene.riv         ← the room (roommate)
  src/
    components/
      map/
        WorldMap.jsx          ← main map component (Direction B — minimal markers)
        WorldMap.css
        Ground.jsx
        Beach.jsx
        Bluff.jsx
        Forest.jsx
        Stream.jsx            ← returns null
        Paths.jsx
        Trees.jsx
        TownDetails.jsx       ← returns null
        FieldDetails.jsx      ← returns null
      locations/
        CafeScreen.jsx        ← full café interior (SVG) — now has ambient questions wired
        CafeScreen.css
        CommonsScreen.jsx     ← BUILT — 3 Rive scenes (card/walking/room), hotspots, cursor regions
        CommonsScreen.css
        SchoolScreen.jsx      ← RonalzOS desktop
        SchoolScreen.css
        OverlookScreen.jsx    ← full overlook interior (SVG, dusk scene)
        OverlookScreen.css
        FieldScreen.jsx       ← placeholder, not started
        LocationScreen.jsx    ← wrapper with fade + back button
        LocationScreen.css
        cafe/
          BookModal.jsx       ← modal wrapper for all books
          BookModal.css
          CommunityJournal.jsx ← shared journal with page flipping + Supabase
          CommunityJournal.css
          UglyArtBook.jsx     ← drag to rank 4 art pieces
          ReadingListBook.jsx ← reading list
          WitnessBook.jsx     ← journal entry + inline question
          cafe-books.css
        school/
          ResumeWindow.jsx    ← PDF iframe + download
          ResumeWindow.css
          LaytonWindow.jsx    ← placeholder "coming soon" — Professor Layton puzzle not built
          LaytonWindow.css
          ComingSoonWindow.jsx ← reusable coming soon
          ComingSoonWindow.css
        commons/
          CommonsSceneModal.jsx  ← modal wrapper for Family/Walk/Room blurbs; passes
                                    onClose AND onRevealQuestion down to content
          CommonsSceneModal.css
          FamilyContent.jsx      ← Sheng Ji blurb; guaranteed question on blurb-close
          WalkContent.jsx        ← "The Chores I Don't Mind" blurb; blurb-only now
                                    (question is ambient, not attached to this click)
          RoomContent.jsx        ← "Whatever, Together" blurb; blurb-only now
                                    (questions live in light/grapes/frames hotspots instead)
          QuestionOnlyContent.jsx ← generic "question only, no blurb" content — currently
                                    UNUSED (light/grapes/frames bypass the modal entirely
                                    via directQuestion), but kept for future background
                                    characters (e.g. promoting a card-scene cursorRegion
                                    to a real hotspot later)
          StaticPromptContent.jsx ← generic "one-time real-world action prompt" content
                                    (not a question), parameterized by text + promptId,
                                    reusable for any future one-off prompt like the cat's
                                    photo-text prompt (currently on flower_painting)
      OpeningScreen.jsx       ← black screen, Bebas Neue
      OpeningScreen.css
      PromptScreen.jsx        ← reusable prompt + input, optional `subtext` prop
      PromptScreen.css
      QuestionCard.jsx        ← location-themed question cards — supports inputType:
                                 'text' | 'choice' | 'kmk' | 'twoTruths', plus the
                                 ambient_2 icebreaker follow-up special case
      QuestionCard.css
      questionInputs/
        KissMarryKill.jsx     ← drag-and-drop Kiss/Marry/Kill, used by inputType 'kmk'
      WelcomeScreen.jsx       ← "Welcome, [name]." fade (first-time visitors only)
      WelcomeScreen.css
    data/
      questions.js            ← ALL questions live here
      themes.js                ← question card themes per location (includes 'commons': pink)
      cafeBooks.js             ← café book data with SVG coordinates
      fieldWorkouts.js         ← all 9 Field workouts, data-only, drives WorkoutPlayer
      laytonPuzzles.js         ← Layton's 4 text riddles, data-only
      actionPrompts.js         ← one-time real-world action prompts (not questions) —
                                 parallel to questions.js but simpler shape, no
                                 inputType/answer schema, drives StaticPromptContent
    hooks/
      useAppState.js           ← screen routing/state + backend visitor sync
      useQuestions.js          ← question sequencing, seen tracking, cooldown,
                                  triggered/ambient/global-ambient lookups
      useAmbientQuestion.js    ← NEW shared hook: two-tier ambient question timer
                                  (frequent location-specific + rare global), with a
                                  `suppress` option to avoid stacking over other open
                                  overlays. Used by CafeScreen and CommonsScreen.
      useSounds.js             ← sound action mapping
    utils/
      sounds.js                ← Web Audio API sound functions
      api.js                   ← fetch calls to FastAPI backend (visitors, answers, journal)
    constants.js               ← COLORS, FONTS, SCREENS constants
    App.jsx                    ← clean render, uses useAppState
    App.css
    main.jsx
  backend/
    main.py                    ← FastAPI routes, now includes /ping for keep-warm
    requirements.txt
    .env                       ← SUPABASE_URL, SUPABASE_KEY (not in git)
    venv/                      ← not in git
  index.html                   ← Google Fonts loaded here
  CLAUDE.md                    ← this file
  .gitignore
```

---

## Screen Flow

```
Opening Screen (black, Bebas Neue, click anywhere)
    ↓ click + chime sound
Prompt 1 — "To know me, let me get to know you—what makes you happy?"
    ↓ Enter + bubble sound
Prompt 2 — "I love that. What should I call you?"
    ↓ Enter + bubble sound
Welcome Screen — "Welcome, [name]." fades in then out (2.3s)
    ↓ auto transition
World Map — five clickable locations + whoosh sound
    ↓ click location
Location Interior Screen (fade in, back button top left)
```

Returning visitors (detected via localStorage) skip straight to the map with a brief "Welcome back, [name]." greeting that fades in and out. First-time visitors do NOT get a duplicate greeting on the map (they already saw the full "Welcome, [name]." screen moments earlier) — the map's greeting div only ever renders when `returning` is true.

**`PromptScreen.jsx` now supports an optional `subtext` prop**, rendered in smaller italic text below the main prompt. Used specifically on Prompt 1 ("big or small—whatever's true for you") to lower perceived pressure around the happiness question — genuinely open questions can read as heavier than intended before any of the site's playful tone has been established yet. Prompt 2 doesn't use this prop (no subtext needed there).

---

## Design System

### Fonts (loaded in index.html via Google Fonts)
- `Bebas Neue` — opening screen (stark, all caps)
- `Caveat Brush` — prompts, warm world text, map title, Commons modal titles (handwritten, warm)
- `Kalam` — user input in prompt screens (handwritten, neutral)
- `DM Sans` — UI hints, labels, resume body text, Commons modal body text (clean sans)
- `VT323` — RonalzOS school desktop (pixel/retro)

### Colors (in `src/constants.js` and `index.css` as CSS variables)
```js
black:       '#0A0A0A'
white:       '#FFFFFF'
cream:       '#F5F0E8'
softGreen:   '#EAF3DE'
lightGreen:  '#C0DD97'
midGreen:    '#97C459'
deepGreen:   '#27500A'
forestGreen: '#3B6D11'
warmGray:    '#D3D1C7'
amber:       '#FAC775'
pink:        '#ED93B1'
blue:        '#B5D4F4'
```

---

## localStorage Schema

```js
{
  id: 'uuid-from-supabase',       // added — backend visitor id, set async after createVisitor resolves
  name: 'Rona',
  returning: true,
  drink: 'coffee',
  lastMoonQuestion: 1234567890,    // timestamp
  seenQuestions: ['moon_q1', ...], // array of question IDs answered
  intentionalQuestionCount: 2,     // for question.exe cooldown
  answers: {
    happiness: '...',
    school_t1: '💻',
    cafe_witness_question: '...',
    ugly_art_ranking: 'dali,millet,koons,hirst',
    overlook_flower: '🌸',
  }
}
```

**Note:** `id` is populated asynchronously — `createVisitor()` is called in the background on first visit (in `handlePrompt2Submit`) and also as a backfill for pre-existing visitors on mount (in `useAppState`'s initial `useEffect`, guarded by a `useRef` against React Strict Mode's double-invoke in dev). The `happiness` answer is captured before an `id` exists, so it's synced separately once `createVisitor` resolves, rather than through the normal `saveAnswer` path.

---

## Question System

All questions live in `src/data/questions.js`. Structure:
```js
{
  id: 'unique_id',
  text: 'Question text',
  type: 'triggered' | 'ambient',
  location: 'cafe' | 'school' | 'overlook' | 'commons' | 'field' | null,
  trigger: 'trigger_name',   // for triggered questions
  inputType: 'text' | 'choice' | 'kmk' | 'twoTruths',
  options: [],               // for choice/kmk/twoTruths questions
  correctAnswer: '...',      // for twoTruths only — which option is the lie
  sequence: 1,               // for triggered questions
}
```

**Triggered** — appear when a specific object is clicked (or, for Commons' "direct question" hotspots, on click without any modal in between). Sequenced, never repeats once seen.

**Ambient** — random, appears unprompted via a background timer (see `useAmbientQuestion` below), not tied to any click. Two-tier system:
- **Location-specific ambient** (`location: 'commons'`, etc.) — frequent, 20–45 second random interval
- **Global ambient** (`location: null`) — rare, 3–6 minute random interval, can theoretically fire in any location running the hook

**Rest message**: "let your brain rest for now. we can ponder again soon." — shown by `getIntentionalQuestion` after every 2 intentional (site-wide) questions. **Important:** guaranteed/dedicated questions (Commons' Family, and the direct-question hotspots Light/Grapes/Frames) deliberately bypass this by calling `getTriggeredQuestion` directly instead of `getIntentionalQuestion` — they should never show the rest message, since they're not part of the casual "intentional browsing" counter.

**Maybe later button** — closes without marking seen, question reappears later.

### Input types
- **`text`** — free text input
- **`choice`** — button per option, click to select and save
- **`kmk`** ("Kiss, Marry, Kill") — drag-and-drop via `@dnd-kit`; `options` is an array of exactly 3 strings; answer saved as `"Kiss: X, Marry: Y, Kill: Z"`. Component: `src/components/questionInputs/KissMarryKill.jsx`.
- **`twoTruths`** ("Two Truths and a Lie") — click a statement to guess the lie; reveals correct answer with visual feedback (correct lie highlighted, wrong guess struck through) before a "continue" button saves and closes. `correctAnswer` must exactly match one of `options`.

### Special case: the icebreaker gets asked back (`QuestionCard.jsx`)
`ambient_2` ("What's your favorite icebreaker question?") has a unique follow-up behavior, hardcoded as a special case inside `QuestionCard.jsx` itself (not a generic mechanism — this is the one question on the whole site that works this way):

1. Visitor answers the icebreaker normally — saves as `ambient_2`, marked seen
2. Instead of closing, the card swaps to show **their own typed answer** as a brand-new prompt, with a fresh empty text input (`followUp` state holds `{ text: answer, inputType: 'text' }`, and `activeQuestion = followUp || question` drives what actually renders)
3. They answer their own icebreaker — saves separately as `ambient_2_followup`, then closes for real

Every other question type/flow is completely unaffected, since this only triggers on the exact id `ambient_2`.

### Current questions (as of this update):

**School:**
- `school_t1` — pick work emoji (projects trigger)
- `school_t2` — worst nightmare job (projects trigger)
- `school_qexe_1` — what if money wasn't a question (question_exe trigger)
- `school_qexe_2` — money or passion (question_exe trigger)

**Café:**
- `cafe_t1` — pick a flower (ambient, location: 'cafe') — **now surfaces via `useAmbientQuestion`**
- `cafe_t2` — who is most important (bookshelf trigger)
- `cafe_witness_question` — why do people look for a lifelong partner (inline in WitnessBook)
- `ugly_art_ranking` — drag to rank art pieces (inline in UglyArtBook)

**Overlook:**
- `overlook_flower` — favorite person's flower (bouquet trigger)
- `moon_q1` — rate your life out of 10 (moon trigger)
- `moon_q2` — what made you smile recently (moon trigger)
- `moon_q3` — one de-stress method you use (moon trigger)

**Commons** (all `location: 'commons'`):
- `commons_family` — "What is your family's go-to activity?" (trigger: `family_scene`, guaranteed — always shown when the blurb closes)
- `commons_room_frame1` — "What's a memory you're afraid you'll forget one day?" (trigger: `frames_scene`, one-and-done, direct-question hotspot)
- `commons_room_grapes1` — "Favorite movie snack:" (trigger: `grapes_scene`, one-and-done, direct-question hotspot)
- `commons_room_light1` — "Your house is burning, what do you grab?" (trigger: `light_scene`, sequence 1)
- `commons_light_kmk` — Kiss/Marry/Kill: pineapple on pizza / ketchup on eggs / mayo on fries (trigger: `light_scene`, sequence 2, inputType `kmk`)
- `commons_light_2truths` — Two Truths and a Lie: banana a day / hot drinking water / hate milk, lie = "I average a banana a day" (trigger: `light_scene`, sequence 3, inputType `twoTruths`)
- `commons_room_light4` — Would you rather: never wear socks / always wear shoes (trigger: `light_scene`, sequence 4, inputType `choice`)
- `commons_walk_ambient` — "What is one thing you refuse to be frugal about?" (ambient, location: 'commons' — surfaces unprompted while viewing the walking scene)

**Ambient — anywhere** (`location: null`, rare/global tier):
- `ambient_1` — does suffering make us stronger
- `ambient_2` — favorite icebreaker question (has the special follow-up behavior above)
- `ambient_2_followup` — not a real entry in `questions.js` — this id only ever exists as a saved *answer*, generated dynamically at runtime from whatever the visitor typed for `ambient_2`

---

## World Map (Direction B)

Minimal aesthetic: cream `#F5F0E8` background, faint paths `#E0D8C8`, soft color washes, concentric circle markers. No white boxes.

Five locations with SVG coordinates:
| Location | Theme | Accent | x | y | Status |
|----------|-------|--------|---|---|--------|
| The Café | reflection · reading | amber | 200 | 300 | ✅ Built, ambient wired |
| The Commons | community · people | pink | 360 | 400 | ✅ Built |
| The School | code · projects | blue | 400 | 200 | ✅ Built |
| The Overlook | joy · simple things | green | 560 | 220 | ✅ Built |
| The Field | movement · sport | light green | 180 | 460 | ⬜ Not started |

**Greeting fix:** `.worldmap-greeting`'s `top` was bumped from `24px` to `90px` to stop it visually overlapping the "Rona's World" SVG title text. The greeting only renders `{returning && <div>...}` — first-time visitors get nothing on the map itself (they already saw the full welcome screen).

---

## The Café (Built)

SVG interior: bookshelves left/right, clear sky window, table with coffee cup, journal, plant.

**Clickable elements:**
- **Books** — data-driven from `cafeBooks.js`. Add new book = one entry in `cafeBooks.js` + new component in `cafe/` + entry in `BookModal.jsx` bookComponents object.
- **Coffee cup** — drink picker (coffee, tea, water, juice, milk). Liquid color changes. Saved to localStorage.
- **Journal on table** — opens community journal (shared, Supabase-backed).

**Ambient questions** — wired via `useAmbientQuestion('cafe', { suppress: !!activeBook || !!activeQuestion || showJournal || showDrinkPicker, localDelay: [60000, 240000] })` — tuned to 1–4 minutes (slower than the hook's 20–45 second default), so the flower pick (and any future café ambient questions) feels unhurried rather than rapid-fire, and never stacks on top of a book/journal/drink-picker/other question already open.

**Books:**
1. **Ugly Art** — drag to rank 4 art pieces (`@dnd-kit`), titles reveal after submit. Intro text was drifted/compressed by an earlier session and was restored closer to Rona's original argument (the "basically anything" conclusion, the precedent-based reasoning for why "what is art" resists exclusion, and "much more debatable" rather than the drifted "far more interesting" for the good-art question).
2. **Recently Read** — reading list (Tuesdays with Morrie, Eleanor Oliphant, Freakonomics, Funny Story, Tomorrow×3)
3. **Premium Instagram Reels Pull** (WitnessBook) — journal entry about why people look for a lifelong partner, ending in a quote from *Shall We Dance?* ("we need a witness to our lives...") + inline question. Reviewed and holds up well — the many-to-many vs. one-to-one framing for romantic vs. other connections is a genuinely original turn of phrase.
4. **The Ethics Game** — a Good-Place-style real-time trolley-problem gauntlet. 6 dilemmas in escalating pressure (trolley → fat man → transplant → Baby Hitler → bomb → self-driving car), each with a shrinking SVG countdown ring (color shifts amber → warning → danger, card shakes near zero). Letting the timer run out shows "you didn't decide in time." before saving `'(froze)'` as the answer — a legitimate, thematically fitting outcome, not an error state. After all 6: a brief "that's all six." transition, then a percentages screen (`GET /answers/aggregate/{question_id}` — new backend endpoint, groups answers and returns counts/percentages, fetched in parallel via `Promise.all` for speed) showing what other visitors chose, plus a closing reflection blurb about *what* differed between dilemmas (mechanism vs. numbers) rather than telling the visitor what to conclude. **Key bug fixed:** the countdown ring must be `key`-ed to the dilemma's id — without it, consecutive dilemmas sharing the same `timerSeconds` value (e.g. trolley and fat man both at 12s) wouldn't reset properly, since React only re-runs a `useEffect` when its dependency *value* changes, not just because new props arrived. A `firedRef` guard also prevents the timeout callback from ever double-firing (was previously the root cause of skipped dilemmas and an eventual out-of-bounds crash).

**Community Journal:**
- Page-flipping spread layout, oldest entries first
- Anonymous or signed toggle
- Saves to Supabase via FastAPI
- Multiple entries per session allowed

---

## The School — RonalzOS (Built)

Retro OS desktop, starry night background `#0a0a1a`, amber/green gradient title bars.

**Icons:**
| Tag | Label | Action |
|-----|-------|--------|
| `[PDF]` | resume.pdf | PDF iframe + download |
| `[???]` | layton/ | **Built** — see below |
| `[EXE]` | question.exe | Question card with 2-question cooldown |
| `[DIR]` | projects/ | Coming soon |
| `[WIP]` | freakonomics.exe | Coming soon |

### Professor Layton — "Level 1" (Built)
Framed as "Level 1" (a brief fading title card shown once on entry, not per-puzzle) to leave room for a future Level 2 without over-promising it to visitors — the closing message reads "Level 1 complete." with no "Level 2 coming soon" teaser, deliberately, since that was cut in favor of not setting an expectation.

**Copyright note:** puzzle *concepts* here are classic, public-domain logic puzzle traditions (river crossing, weighing problems, upside-down word riddles) that predate and are reused across countless puzzle games including the real Professor Layton series — not copied verbatim from Level-5's actual games. All wording is original.

**4 text riddles, in order** (`src/data/laytonPuzzles.js`), each with 2 progressive free hints (no cost/currency — a simpler build than a full "hint coin" economy, which was considered and deliberately scoped down):
1. Keyboard riddle
2. Photo/family riddle ("brothers and sisters I have none...")
3. Balls/weighing riddle (minimum weighings to find the heavier ball — answer: 2)
4. Upside-down word riddle (answer: SWIMS) — hints avoid literally spelling out the answer's letters, a mistake from an earlier draft

Each accepts **multiple valid answer strings** (e.g. "his son"/"son"/"the son", "2"/"two") via an `answers` array rather than a single string.

**5th puzzle — Wolf/Chicken/Grain river crossing** (`RiverCrossingPuzzle.jsx`): real interactive state (which bank each item/the farmer is on, what's currently boarded), full safety validation (checks the bank just departed *from* for an unattended unsafe pair), win/lose states, and a manual "start over" link available during normal play (not just after a loss).

**Progress persists across sessions** — checks `seenQuestions` on mount to resume at the correct puzzle (or skip straight to "Level 1 complete" if already finished), rather than always restarting from puzzle 1. Includes a guard: if a *new* puzzle is ever appended to the array later, a visitor who already beat the river crossing won't be forced to redo it — the code explicitly checks whether the river is already marked seen before ever routing back into it.

**Key bug pattern (same root cause as Ethics Game's timer bug):** `TextRiddle`'s hint/answer state was leaking between puzzles, because React was reusing the same component instance across puzzle transitions. Fixed with `key={currentPuzzle.id}`, forcing a clean remount per puzzle — the same fix used in Ethics Game's `CountdownRing`.

---

## The Overlook (Built)

Dusk/night SVG scene. Dark purple/navy sky with layered gradients, crescent moon, stars, birds, trees, string lights, bench with figure (Rona) + bouquet + book.

**Clickable elements:**
- **String lights (10)** — hover reveals a simple joy. ✅ **Written** (see below).
- **Bouquet** — triggers overlook_flower question. Colors reflect visitor's flower (café) + favorite person's flower (overlook). White if unanswered.
- **Book (amber)** — opens "on happiness" essay modal. ✅ **Written** (see below).
- **Moon** — glows with pulse when question ready. Triggers moon_q1/2/3 in sequence.
- **Figure (Rona)** — Phase 3 placeholder for "talk to Rona" AI feature.

**Theme:** dark purple `#1a1235` background, amber `#FAC775` accents for question cards.

**Simple joys (written, in `SIMPLE_JOYS` array in the component):**
```js
const SIMPLE_JOYS = [
  'super salty food',
  'first week of fall/last week of spring',
  'binging a show',
  'laughing til my back hurts',
  'catching a firefly',
  'the start and end of a journal',
  'the clinking of ice in a glass',
  'the smell of a campfire',
  'a cute fit',
  'buzzfeed-esq quizzes',
]
```

**Happiness essay — written, in full:**
> We have many important, commonly used words that are actually rather vague—freedom, success, art, love. I like to delve into what these words actually mean, and one that I have found particularly interesting to think about is happiness—what creates it, what feelings encompass it, and how it appears in my life.
>
> My first distinction is that happiness does not equal pleasure. Purely pleasurable items or actions, I label as "simple happinesses". They do not have any lasting positive feelings but are pleasurable and enjoyable in the present. These could include but are not limited to—food, sex, doom-scrolling, drugs, vacation—and the overlook reflects said simple happinesses. It is my belief that these should be enjoyed to the extent that they do not severely harm your ability to create your "complex happinesses". My favorite instances of simple happinesses are when they can be used to develop complex happinesses; for example, it is undeniable that eating ice cream with your best friend on the couch strengthens your bond.
>
> "Complex happinesses" are demonstrated by the remaining four locations—fulfillment you get from achieving effortful goals: your relationships, your career, your health, your sport, your community, your character. These probably deserve their own separate categories eventually but since I haven't figured out what role each of my complex happinesses plays, I have them all grouped together with the common denominator that each one requires continuous effort and the feeling it brings isn't one that can just be described as an instantaneous dopamine release. For now, my chosen life efforts are my health and athletics (the Field), my character and reflections (the Café), my career and contributions (the School), and my community and relationships (the Commons).
>
> My interests and activities have naturally been supporting these goals, but only recently did I concretely categorize them. I'm curious to see in what ways my theory will change—whether certain complex happiness groups take precedence over others, whether new complex happiness groups emerge, whether there are further intersections of simple and complex happinesses. This world that you're exploring reflects not only what I have figured out, but also my attempt at furthering my understanding of what I want.

*(This essay is genuinely the architecture-defining piece of the whole site — the "simple happiness" vs. "complex happiness" split explains why Overlook exists in contrast to the other four locations. It deliberately includes an explicit, honest example of the categories overlapping rather than staying cleanly separate (ice cream → bonding), and deliberately leaves the four complex-happiness categories un-ranked/un-sorted as an admitted open question rather than forcing false tidiness — consistent with the site's overall voice of not overclaiming certainty.)*

---

## The Commons (Built)

**Concept:** community space with three Rive-animated scenes, cycled through via a carousel (prev/next arrows): the card table (family), the walk (girlfriend), and the room (roommate).

### Architecture

**Scene switching:** `useRive` only loads its *initial* `src` once — swapping scenes afterward requires explicitly calling the returned `rive` instance's `.load({ src, stateMachines, autoplay })` in a `useEffect` keyed on `sceneIndex` (guarded with an `isFirstRender` ref so it doesn't double-load on mount).

**Two kinds of interactive regions per scene, defined in the `SCENES` array:**
- **`hotspots`** — real `<button>` elements, positioned via `top`/`left`/`width`/`height` (% of the canvas wrapper). Get `cursor: pointer` automatically via `.commons-hotspot` CSS. Clicking opens either a modal (`CommonsSceneModal`) or, if `directQuestion: true` + a `trigger` string is set, fetches and reveals a question immediately with no modal at all (used for Light/Grapes/Frames in the room scene).
- **`cursorRegions`** — purely visual, no click handler, no button. Used to show an accurate pointer cursor over parts of the Rive artwork that already have their *own* native Rive state-machine interactivity (e.g. the clock in the room scene, or the two girls/cat/flowers in the card scene) — without stealing the click away from Rive's own reaction. Implemented via `onMouseMove` + fractional bounding-box math in `CommonsScreen.jsx`.

**Current hotspot/cursorRegion coordinates** (tuned in dev tools against the actual artwork):
```js
// card scene
hotspots: [{ id: 'family', top: '50%', left: '45%', width: '12%', height: '7%' }]
cursorRegions: [
  { top: '44%', left: '29%', width: '17%', height: '13%' }, // left girl
  { top: '44%', left: '53%', width: '16%', height: '12%' }, // right girl
  { top: '33%', left: '46%', width: '8%', height: '4%' },   // flower at top of house
  { top: '60%', left: '30%', width: '12%', height: '18%' }, // red block/art frame
  { top: '68%', left: '50%', width: '14%', height: '7%' },  // cat
  { top: '87%', left: '57%', width: '5%', height: '3%' },   // flower in lake
]

// walking scene
hotspots: [{ id: 'walk', top: '33%', left: '20%', width: '55%', height: '11%' }] // clouds
cursorRegions: [{ top: '37%', left: '39%', width: '22%', height: '27%' }] // girl's body

// room scene
hotspots: [
  { id: 'room', top: '63%', left: '59%', width: '27%', height: '32%' },   // door
  { id: 'light', top: '15%', left: '40%', width: '12%', height: '7%', directQuestion: true, trigger: 'light_scene' },
  { id: 'grapes', top: '40%', left: '13%', width: '10%', height: '8%', directQuestion: true, trigger: 'grapes_scene' },
  { id: 'frames', top: '75%', left: '35%', width: '15%', height: '10%', directQuestion: true, trigger: 'frames_scene' },
]
cursorRegions: [{ top: '8%', left: '60%', width: '20%', height: '13%' }] // clock
```

### ⚠️ Critical architecture lesson: never nest QuestionCard inside another modal

`QuestionCard` already renders its own full-screen overlay (`.question-card-overlay`). Early on, `FamilyContent`/`QuestionOnlyContent` rendered `<QuestionCard>` directly as their return value while still being wrapped inside `CommonsSceneModal`'s own `.commons-modal` box — this caused a **nested modal bug**: an empty cream rectangle would appear and linger, because the outer modal shell had no real content of its own (the actual content was a second, independent overlay nested improperly inside it). This is the same category of bug as an earlier one where `CommonsScreen` accidentally rendered itself wrapped in a second `LocationScreen`.

**The fix (the pattern now in use):** content components never render `QuestionCard` themselves. Instead, `CommonsSceneModal` passes down both `onClose` and `onRevealQuestion` props. When a blurb-content component (like `FamilyContent`) wants to show a question, it calls `onRevealQuestion(question)`, which is implemented in `CommonsScreen` as:
```js
function handleRevealQuestion(question) {
  setActiveModalId(null);      // closes the modal entirely
  setTriggeredQuestion(question); // shows QuestionCard as its OWN sibling-level overlay
}
```
`QuestionCard` must always be rendered as a sibling of `CommonsSceneModal`, never as its child.

### Content flow per scene

- **Family (card table)** — clicking the table hotspot opens `CommonsSceneModal` → `FamilyContent` (Sheng Ji blurb). Closing the blurb (×) calls `getTriggeredQuestion('commons', 'family_scene')` directly (bypassing rest/cooldown) and hands off via `onRevealQuestion` — so the question always appears right after the blurb closes, never alongside it, and never shows the "rest" message.
- **Walk (clouds)** — clicking opens `WalkContent` (blurb only, no question attached). The walk's question is instead **ambient** — see below.
- **Room (door)** — clicking opens `RoomContent` (blurb only, no question attached). The room's actual questions live in three separate direct-question hotspots instead (see below).
- **Light / Grapes / Frames** — these are `directQuestion: true` hotspots. Clicking calls `getTriggeredQuestion('commons', trigger)` directly in `CommonsScreen`'s `openHotspot`, and if a question exists, reveals it immediately as a sibling overlay — no modal, no reveal button, no blurb. Light has 4 sequenced questions (burning house → KMK → two truths → would-you-rather); Grapes and Frames each have exactly one (one-and-done).
- **Walk's ambient question** — surfaces unprompted via `useAmbientQuestion('commons', { active: scene.id === 'walking', suppress: !!activeModalId || !!triggeredQuestion })`. Meant to feel like spontaneous conversation during a walk, not something you have to click for.

### Written blurbs

**Family — "Sheng Ji":**
> When other Chinese families came over, the schedule was almost always a joint dinner followed by a split of the kids and adults, where the adults would eat sunflower seeds and play card games and the kids would go do whatever it was we used to do. Eventually my sister and I got older, and we were taught to play the grown-up card game (Sheng Ji, also known as Level Up or Tractor) as well. Now, we always bring two decks of cards with us on family outings, in case the perfect scene for a good game of Sheng Ji appears.

**Walk — "The Chores I Don't Mind":**
> Although the "slow living" trend tried to convince me to enjoy chores, they failed. I've never been good at slowing down for something that didn't feel like it had a goal—if a task had no clear purpose, it just felt like something standing between me and whatever came next.
>
> But as my girlfriend and I started spending prolonged periods of time together, we started doing our everyday mundane tasks together, and you know what? I didn't mind doing these chores. I hate the time transportation takes but I like walking with her. Cooking is a date night activity, grocery shopping is a fun sidequest, and laundry is time to watch a show together.
>
> Granted, we don't get much time together so of course any time together will feel like a novelty. But it's had me thinking: maybe slow living was onto something after all. Either way, big steps for me.

*(Went through significant rewriting — earlier drafts risked reading as either corny, too similar to Room's "activity doesn't matter, person does" theme, too similar to WitnessBook's sincerity, or accidentally implying doubt about the relationship's future rather than just honest uncertainty about whether novelty survives daily repetition. The "granted..." paragraph is the fix — it explicitly names the confound (limited time together = of course it still feels fresh) without ever touching "us" or the relationship's future, keeping the uncertainty scoped to chores/novelty specifically.)*

**Room — "Whatever, Together":**
> While I love a good shared activity to pass quality time with loved ones, I've also discovered the art of the "super casual hang". Having friends over to "study" in the living room, stretch on my yoga mat, sit on the couch and contemplate life—it's nice to just be in the company of others. My roommate is the master of the "super casual hang", and every second we lived together, I discovered new joys to this art, as well as just how important it was to me to have friends I could just exist with.

### Commons Action Prompts (Built) — one-time real-world instructions, not questions

A new, separate system from the question cards — instead of asking the visitor to answer something, these prompt an actual small real-world action (currently: "text a random recently taken photo to your family groupchat").

**Data:** `src/data/actionPrompts.js` — parallel to `questions.js` but with a simpler shape (just `{ text }`, no `inputType`/`answer`/schema), since these aren't Q&A.

**Component:** `src/components/locations/commons/StaticPromptContent.jsx` — generic, reusable, parameterized by `text` + `promptId` (not a dedicated file per prompt — this was deliberately corrected mid-build, since a first pass created a one-off `CatPromptContent.jsx` for a single line of text, which was rightly flagged as unnecessary given `QuestionOnlyContent.jsx` already established the "generic component + data param" pattern for exactly this kind of reuse).

**Three distinct exits, each with different persistence behavior:**
- **"done"** button → `markSeen(promptId)`, closes — completed, gone forever
- **"not for me"** button → `markSeen(promptId)`, closes — declined, gone forever, never asked again (this was a deliberate design correction: an earlier version had "maybe next time" as the decline wording, implying it would resurface later, which is NOT what was wanted — the fix was renaming the button and having it mark-seen just like "done", so any *explicit* choice is permanent)
- **× close button** → just closes, no `markSeen` — NOT treated as a decision, so an accidental/undecided dismissal leaves the prompt available to trigger again on a future click

**Currently wired to:** `flower_painting` hotspot in the card scene at `top: 58%, left: 53%, width: 16%, height: 10%` (still a rough estimate pending a reference image, but tuned once already from an initial guess). **Important lesson learned:** this was originally wired to the **cat**, promoted from a `cursorRegion` to a real `hotspot` — but this broke the cat's own native Rive hover reaction, since a real `<button>` hotspot sits on top of the canvas and intercepts every mouse event in that area, blocking whatever built-in animation Rive's own state machine was providing underneath. The cat was reverted back to a `cursorRegion` (cursor-only, no click) and the prompt moved to a different element instead — a good concrete example of why the hotspot/cursorRegion distinction exists at all.

**Prompt text (as of this writing):** "I like to send random photo updates to stay in contact with far away loved ones. My prompt for you today: Text a random recently taken photo to your family groupchat." — softened from an earlier, more abrupt version that jumped straight to the instruction with no framing.

**"Done" now shows a brief completion message plus a confetti burst** before closing — visible for 2 seconds via a `completed` state + `setTimeout`, then auto-closes. The exact wording is being finalized directly by Rona (moved away from "Hope it made someone's day a little brighter" toward something shorter like "good work!" — check the live file for whatever's actually there, this doc doesn't lock in exact copy for this line). Declining ("not for me") does NOT get this treatment — it marks seen and closes immediately, no celebration, since only actually doing the thing earns the warm send-off.

**Confetti implementation:** 12 small `<div className="commons-confetti-piece">` elements, each with a different `--drift` CSS custom property (horizontal scatter distance) and `animation-delay`, sharing one `@keyframes confettiPopFall` that moves each piece through three stages — rise to a peak at 25% (`translateY: -50px`), then fall past the starting point to `translateY: 140px` at 100%, with continuous rotation (540° total) and a fade to transparent. The rise-then-fall arc (not a simple outward burst) is what makes it read as actual thrown confetti rather than a generic particle effect. Colors cycle through the existing site palette (pink/amber/blue/mid-green) rather than introducing new hex values.

**⚠️ Process lesson worth remembering:** midway through building this feature, an entire round of intended edits (the cat→flower_painting revert, plus the corresponding renames in `CommonsSceneModal.jsx` and `actionPrompts.js`) reported success via the editing tool but **never actually landed in the real files** — confirmed only when directly re-reading the raw file content afterward, which still showed the old `cat` wiring throughout. The CLAUDE.md documentation had already been updated to describe the fix as complete, compounding the problem by looking authoritative while being wrong. **The fix going forward: always verify file state by directly reading it back after an edit, rather than trusting a tool's success message alone** — this applies to any future session working on this codebase, not just this one feature.

### Attribution note
**Correction from earlier documentation:** Commons' three scenes (`card-scene.riv`, `walking-scene.riv`, `room-scene.riv`) are actually modified versions of RyanRumbolt's "Hover House," "Cloudy Walk," and "Bored Room" — three Rive assets from his "Little Wonders" series (illustrated in collaboration with Justyna Stasik), licensed **CC BY 4.0**. This is NOT custom original work as previously documented — that earlier note was inaccurate.

CC BY 4.0 legally requires attribution AND disclosure that changes were made. This is implemented as a small, low-opacity "i" info icon (`.commons-credit-icon`) in the bottom-right corner of `CommonsScreen.jsx` — nearly invisible at rest, full-opacity on hover, click reveals a credit card (`.commons-credit-overlay`/`.commons-credit-card`) with the full attribution text:

> "Hover House," "Cloudy Walk," and "Bored Room" by [RyanRumbolt](https://rive.app/@RyanRumbolt/), in collaboration with Justyna Stasik, licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Modified from the originals.

This satisfies the license's requirement that credit be reasonably accessible without forcing attribution into the main visual design of an intentionally minimalist scene.

---

## The Field (Built)

**Concept:** a "sticker sheet" resting on a wood table — 8 real people (some drawn as combined two-person stickers) plus a rainbow and one wildcard character, each opening a real workout. Illustrated entirely by hand in Illustrator (learned from scratch during this project), not code-generated shapes.

### Visual build
- Background: wood-table texture image (`public/textures/wood2.jpg`), rotated 90° via a `::before` pseudo-element trick (background layer rotated independently of foreground content, since a direct `transform` on the whole screen would've rotated the characters and back button too)
- The sticker sheet itself: one combined hand-drawn SVG (exported from Illustrator, all characters positioned by the artist directly in Illustrator — no code-side repositioning math, unlike an earlier abandoned attempt at programmatic grid layout)
- A `drop-shadow` filter on the whole sheet makes it look physically lifted off the table
- "MEET THE TEAM" is its own hand-drawn sticker/sign, triggering the (written, see below) short **intro** blurb — separate from the deeper **essay**, which lives on the rainbow instead (see mapping below)

### SVG → JSX pipeline (established workflow for any future Field art updates)
Exported `.svg` files need format conversion before they're valid JSX:
1. `class="..."` → `className="..."`
2. `xml:space="preserve"` → `xmlSpace="preserve"`
3. `xmlns:xlink="..."` → `xmlnsXlink="..."` (same camelCase issue as the other two — this one slipped through the original conversion script and sat as a silent console warning for a while before being caught and fixed)
4. The embedded `<style>` CSS block must be wrapped via `dangerouslySetInnerHTML` (JSX would otherwise try to parse the CSS's `{ }` as JavaScript)
5. Strip the XML declaration and Illustrator's generator comment
6. Add `onClick`/`onMouseEnter`/`onMouseLeave` to whichever named `<g id="...">` groups need interactivity

This entire conversion is done programmatically (a Python script processes the whole file in one pass) rather than manually — manual copy/paste of a multi-thousand-line file is real, demonstrated risk (a botched manual edit once caused hours of debugging). **Workflow going forward:** draw/reposition in Illustrator → export SVG → upload the whole file → full regeneration of `FieldScreen.jsx` in one pass. Never partial/manual edits to the big inline SVG block.

**A real bug this caught:** one character (Lily) had a stray, invisible point left over in Illustrator, sitting far from her actual drawing — this silently inflated her computed bounding box, breaking her hover tooltip's position (jumped to the top of the screen). Confirmed via a bounding-box script comparing all characters' path coordinates, fixed by finding and deleting the stray point directly in Illustrator (selecting the layer's target circle reveals the true full selection extent).

### Characters → workouts mapping
```js
'character-camille': 'camille',              // Arms & Back
'character-brooke': 'brooke',                // Legs
'character-mia': 'mia',                      // Abs
'character-diani': 'field_footwork',         // Footwork — reassigned from Throws
'character-dillon': 'dillon_diani_throws',   // Throws (solo now, no longer paired with Diani in the click-mapping — the workout content itself still describes practicing with a mark)
'character-taytay': 'lily_taytay',           // Plyometrics (paired with Lily)
'character-lily': 'lily_taytay',             // Plyometrics
'character-licey': 'licey_renebean',         // PT (paired with Rene Bean)
'character-renebean': 'licey_renebean',      // PT
'character-rainbow': null,                    // no longer a workout — opens the deeper Field essay (setShowEssay) instead
'character-victoria': 'field_speed_cod',     // Speed, Change of Direction & Acceleration
'tinyandbigrona': null,                       // undecided "fun little game" — Phase 2
```

**Why the reassignment:** the rainbow standing in for a workout ("Footwork") felt visually off since it's not a person — moving Footwork onto Diani (an actual person) and repurposing the rainbow as the essay trigger solved both the "rainbow shouldn't be a workout" feeling and gave the site's two Field-specific written pieces (intro vs. essay) two distinct, sensible homes: the sign for the short welcome, the rainbow for the deeper reflection.

### Hover tooltips
Every character (including `tinyandbigrona`) has `onMouseEnter`/`onMouseLeave` showing a small floating label with name + exercise, positioned via `getBoundingClientRect()` on the actual hovered element at the moment of hover (not precomputed coordinates — necessary since these are hand-positioned artwork with no reliable static bbox data). Matches Café's existing "label floats above the hovered item" pattern rather than a fixed-position tooltip. `tinyandbigrona` currently just shows "hello" as a placeholder (no name, no game description — the game itself is undecided).

Neither "MEET THE TEAM" nor the rainbow has a hover tooltip (intentionally excluded — they're narrative/written-content triggers, not workout characters).

### `WorkoutPlayer.jsx` — the actual workout engine
Lives in `src/components/locations/field/`. Fully generic — driven entirely by data in `fieldWorkouts.js`, no hardcoded workout logic. Three step types:
- **`freeform`** — no timer, just a "done — next" tap (e.g. open-ended stretching)
- **`time`** — shows the duration and a **"start" button first** (so the person has time to get into position before the countdown begins), then auto-counts-down and advances
- **`reps`** — sets × reps, tap to complete each set; rest between sets is either a real countdown timer (**solo** mode) or a manual "I'm ready" button (**buddy** mode, no forced timer since a training partner's own turn naturally provides rest)

**Buddy/solo toggle** (`hasBuddyToggle: true` in workout data) only applies to workouts using **shared gym equipment** (Camille's cable machine, Brooke's squat rack) — band/bodyweight/PT work doesn't need it, since there's no equipment-sharing rest dependency.

### `fieldWorkouts.js` — all 9 workouts, fully written
Camille (arms & back), Brooke (legs), Mia (abs), Dillon (throws — includes a corrected 7-cut drill: lateral movement open-side to break-side, not a literal 7-cut pattern; workout content still describes practicing with a mark, even though only Dillon's sticker triggers it now), Licey & Rene Bean (PT), Lily & Tay Tay (plyometrics), plus two standalone workouts now mapped to real characters: Diani → Footwork (backpedal/hip-flip, release moves, marking footwork, juke-and-cut combos), Victoria → Speed/Change-of-Direction/Acceleration (deceleration mechanics, multi-angle cutting, reactive agility, bounding, linear acceleration).

### Café-first nudge (built alongside Field work, lives in WorldMap)
A pulsing ring (`.location-pulse-ring`, expanding-and-fading circle) highlights Café's map marker specifically for first-time visitors, gently suggesting where to start (Café was judged the most immediately interactive/fun entry point). Two conditions control it:
- `!returning` — the runtime `returning` state only flips true on a *future* session (same mechanism used to suppress the duplicate welcome message), so this naturally covers "this is someone's first-ever session"
- `!cafeVisited` — a separate, more responsive localStorage flag (`visitor.cafeVisited`) set the instant Café is actually clicked into, stopping the pulse immediately even *within* that same first session, rather than waiting for a future visit

### Written content — intro (finished) and essay (still TODO)

**Intro (the "MEET THE TEAM" sign, `showIntro` state) — written:**
> Meet some of my Ultimate Frisbee teammates! Each one invites you to try a specific workout based on either something we actually do together or what I'd consider their strongest skill. You don't have to do any of them, but I encourage you to choose one to do today! Bonus points if you get a buddy to join you.

**Essay (the rainbow, `showEssay` state) — still a `{/* TODO */}` placeholder.** Direction is settled even though the text isn't written yet: not autonomy alone, and not achievement alone — both are genuinely true and don't resolve into one clean thesis. Autonomy/mobility functions as a *floor* ("I didn't choose to need my body, but I noticed I couldn't afford to lose it" — not something being built toward, more a precondition protecting everything else). Real athletic ambition (nationals, a competitive club team, becoming a genuinely strong player) is a separate, active *ceiling* — closer in shape to career/relationship goals than to the autonomy piece. Community runs through both rather than standing as its own third thesis. Multiple explicit ending directions were drafted and rejected (each felt too tidy/resolved); the honest note by the end of drafting was that Field may be the one location where naming the *unresolved tension itself* — "I'm not sure if I care more about being able to move, or being good at moving" — is the actual, truest ending, rather than picking one.

**Double-check outstanding:** no other Field characters have stray Illustrator points like Lily did (checked once at the time of that fix, clean as of this writing — worth a final sweep once all art is fully settled).

---

## Backend API (FastAPI)

Base URL: `http://localhost:8000`

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/` | Health check |
| GET | `/ping` | **NEW** — lightweight route that touches Supabase (selects 1 row from `visitors`). Meant for an external uptime monitor (e.g. UptimeRobot) to hit every few minutes, keeping both Render and Supabase from going to sleep/pausing on the free tier. |
| POST | `/visitors` | Create visitor |
| GET | `/visitors/{id}` | Get visitor |
| POST | `/answers` | Save answer |
| GET | `/answers/{visitor_id}` | Get visitor answers |
| POST | `/journal` | Create journal entry |
| GET | `/journal` | Get all entries (oldest first) |

**Sync status:** Previously only journal entries synced to the backend. **Now visitor creation and answers sync too:**
- `handlePrompt2Submit` (in `useAppState.js`) calls `createVisitor()` in the background after the initial localStorage write, then patches the returned `id` back into localStorage once resolved. It also syncs the `happiness` answer at this point, since that answer is captured before an `id` exists and wouldn't otherwise be caught by the normal `saveAnswer` flow.
- The initial mount `useEffect` in `useAppState.js` backfills an `id` (and syncs any existing `happiness` answer) for visitors who already exist in localStorage from before this update — guarded with a `useRef` (`hasBackfilled`) so React Strict Mode's intentional double-invoke in dev doesn't create duplicate visitor rows.
- `useQuestions.js`'s `saveAnswer` now also calls `saveAnswerToBackend(visitor.id, questionId, answer)` in the background (skipped harmlessly if `visitor.id` doesn't exist yet).
- All backend syncing follows a **local-first** pattern: localStorage is written immediately and remains the source of truth for instant reads; backend calls happen after, wrapped in `.catch()` so a failed/slow network call never breaks the UI.

---

## Database (Supabase PostgreSQL)

Three tables: `visitors`, `answers`, `journal_entries`. RLS disabled.

**Known gotcha:** Supabase free-tier projects auto-pause after ~7 days of inactivity. Unlike Render's sleep (which self-wakes on the next request, just slowly), a paused Supabase project needs to be manually unpaused from the dashboard. The `/ping` route + a periodic external monitor is the fix (see Deployment Plan below).

---

## Sound System

All sounds in `src/utils/sounds.js`, mapped in `src/hooks/useSounds.js`:
- `playEnter()` → chime — opening screen, moon click
- `playSubmit()` → bubble — prompt answer submit
- `playTransition()` → whoosh — entering a location, changing Commons scenes
- `playClick()` → click — small UI interactions, Commons hotspot clicks
- `playPiano()` → piano — available, unused

---

## Deployment (LIVE)

**Frontend:** `https://ronaliuzhong.vercel.app` (Vercel)
**Backend:** `https://ronaliuzhong.onrender.com` (Render, region: Ohio/Virginia — closest US-East options to Boston)
**Uptime monitoring:** UptimeRobot, hitting `/ping` every 5 minutes — keeps both Render and Supabase from ever going idle

**Why two services:** the frontend is static files (HTML/JS/CSS) best served from Vercel's CDN; the backend is a persistent running Python process, which needs an always-on host like Render (Vercel's serverless/multi-service model doesn't fit a long-running FastAPI server — this was actually hit directly: Vercel auto-detected the `backend/` folder and defaulted into its own "Services" multi-app mode requiring a `vercel.json`, which needed to be explicitly switched off in favor of a plain single-app Vite preset, so Vercel only ever builds the frontend and never tries to run the Python backend itself).

**Render setup:** Root Directory `backend`, Build Command `pip install -r requirements.txt`, Start Command `uvicorn main:app --host 0.0.0.0 --port $PORT`, env vars `SUPABASE_URL`/`SUPABASE_KEY` set directly in Render's dashboard.

**Vercel setup:** Root Directory `.` (repo root), framework auto-detected as Vite, env var `VITE_API_URL` set to the Render URL above, scope "Production and Preview."

**`src/utils/api.js`** now reads `const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'` — falls back to localhost automatically for local dev, uses the real Render URL in production. **Important Vite gotcha hit during setup:** environment variables are baked in at *build time*, not read live afterward — the very first deploy shipped with `localhost:8000` hardcoded into the built JS because the code change hadn't been pushed to GitHub yet when Vercel built it. Fixed by actually pushing the `api.js` change, which triggered a fresh build that correctly picked up the variable.

**`main.py`'s CORS** `allow_origins` now includes the real Vercel URL (`https://ronaliuzhong.vercel.app`) alongside `localhost:5173`.

**Cold-start mitigation:** the `/ping` route + UptimeRobot (5-minute interval) keeps both Render (15-min sleep threshold) and Supabase (~7-day pause threshold) perpetually warm — this is what actually solves the "recruiter clicks the link and it looks frozen" problem, not something to revisit.

---

## Phase Roadmap

### Phase 1 — Launch (current)
- ✅ Opening screen → prompts → welcome → map
- ✅ World map Direction B (greeting spacing/logic fixed, Café-first pulse nudge)
- ✅ The School (RonalzOS desktop) + Professor Layton, "Level 1" complete (Level 2 groundwork: brute-force longest-path solver built and tested, original map design deferred)
- ✅ The Café (books, community journal, drink picker, ambient questions tuned to 1–4 min) + the Ethics Game
- ✅ The Overlook (string lights with joys written, moon questions, bouquet, book) **+ happiness essay, fully written**
- ✅ Question card system — themes, cooldown, maybe later, text/choice/kmk/twoTruths input types, **+ the icebreaker follow-up special case**
- ✅ localStorage for returning visitors
- ✅ Sound system
- ✅ FastAPI + Supabase backend — journal entries + visitor creation + answers, all syncing, plus `/answers/aggregate/{question_id}` for Ethics Game percentages
- ✅ The Commons interior (3 Rive scenes — RyanRumbolt's licensed, modified assets, proper CC BY 4.0 attribution) **+ the new Action Prompts system** (photo-text prompt on `flower_painting`, placeholder position pending reference image)
- ✅ **The Field** — fully built (9 workouts reassigned per final character mapping, `WorkoutPlayer` engine, hand-illustrated sticker-sheet art, hover tooltips, wood-table background) **+ finished intro blurb**
- ✅ Opening prompt softened with reassuring subtext
- ✅ **Deployed and live** — Vercel (frontend) + Render (backend), CORS configured, UptimeRobot pinging every 5 minutes
- ⬜ **Add more questions across all locations** — questions are central to the whole concept; still an open, ongoing task, not something to consider "done" at any specific number
- ⬜ **Field's deeper essay** (rainbow, `showEssay`) — direction settled (autonomy as floor + genuine athletic ambition as ceiling + community running through both, likely ending by naming the tension rather than resolving it), text not yet written
- ⬜ Café — "Good at Life," "New Words," and a new idea: **"Flaws"** — list some of Rona's own flaws, visitor drags to rank worst-to-not-worst (reusing the `@dnd-kit` pattern from Ugly Art), then two follow-up text inputs: visitor's own worst flaw, and a flaw they're not too worried about
- ⬜ Commons — **general, open-ended goal: more interactive elements.** Not a locked spec — one seed idea that came up was a shared/cumulative visual element (pixel art board, word cloud) everyone contributes to, visible collectively; nothing committed yet
- ⬜ Tune `flower_painting`'s hotspot position once a reference image is shared (currently a rough placeholder estimate)

### Phase 2 — Enrichment
- Optional login / account creation
- Cross-device experience
- Tiny and Big Rona's "fun little game" (Field) — still undecided

### Phase 3 — Intelligence
- AI-generated questions based on visitor answers
- "Talk to Rona" — RAG system, Overlook bench
- Map personalization based on visitor answers
- Workout completion history + weight/rep progression tracking (combined ticket, Field)

### Phase 4
- Playable Sheng Ji with family NPCs that learn to play like the real people (genuinely an ML project — real match-data logging, game-state representation, per-person behavioral modeling; treated as a distant, aspirational goal)

---

## Key Conventions

- **No spaces around em dashes** — `like this—not like this`
- **Don't modify Rona's writing** without asking first
- **Colors always from constants** — never hardcode hex in components
- **CSS variables** in `index.css` for CSS files, JS constants in `constants.js` for JSX
- **Each component has its own CSS file**
- **All questions in `questions.js`** — never hardcoded in components
- **All book data in `cafeBooks.js`** — SVG coordinates live in data
- **Custom hooks for logic** — `useAppState`, `useQuestions`, `useAmbientQuestion`, `useSounds`
- **App.jsx stays clean** — only renders, never contains logic
- **No SVG for people** — too abstract, use Rive or other assets
- **Specialized question input renderers** (drag-and-drop, sliders, etc.) live in `src/components/questionInputs/`, imported into `QuestionCard.jsx` per `inputType` — keeps `src/components/` itself from getting cluttered with single-purpose widgets
- **Never nest `QuestionCard` inside another modal's box** — always render it as a sibling-level overlay (see the Commons architecture section above for the bug this caused and the `onRevealQuestion` handoff pattern that fixes it)
- **Guaranteed/dedicated triggered questions bypass the rest/cooldown system** — call `getTriggeredQuestion` directly instead of `getIntentionalQuestion` when a question is meant to always appear (Commons' Family, Light, Grapes, Frames)
- **Ambient questions never stack** — any screen using `useAmbientQuestion` should pass a `suppress` flag reflecting whether some other overlay/modal is currently open

---

## Full current `questions.js` (as of this update)

```javascript
export const questions = [
  // TRIGGERED — School
  {
    id: 'school_t1',
    text: 'Pick the emoji that best describes your work:',
    type: 'triggered',
    location: 'school',
    trigger: 'projects',
    inputType: 'choice',
    options: ['💻', '🔬', '📊', '🎨'],
    sequence: 1,
  },
  {
    id: 'school_t2',
    text: 'What job would be your worst nightmare?',
    type: 'triggered',
    location: 'school',
    trigger: 'projects',
    inputType: 'text',
    sequence: 2,
  },

  // TRIGGERED -- Qexe (question mark icon) in School
  {
    id: 'school_qexe_1',
    text: 'What would you do if money wasn\'t a question?',
    type: 'triggered',
    location: 'school',
    trigger: 'question_exe',
    inputType: 'text',
    sequence: 1,
  },
  {
    id: 'school_qexe_2',
    text: 'Should people work for money or for passion?',
    type: 'triggered',
    location: 'school',
    trigger: 'question_exe',
    inputType: 'text',
    sequence: 2,
  },

  // TRIGGERED — Café
  {
    id: 'cafe_t1',
    text: 'Pick a flower:',
    type: 'ambient',
    location: 'cafe',
    trigger: null,
    inputType: 'choice',
    options: ['🌸', '🌹', '🌿', '🌷', '💐', '🌼'],
  },
  {
    id: 'cafe_t2',
    text: 'Who is most important in your life?',
    type: 'triggered',
    location: 'cafe',
    trigger: 'bookshelf',
    inputType: 'text',
    sequence: 1,
  },

  // TRIGGERED--overlook
  {
    id: 'overlook_flower',
    text: 'What flower would your favorite person pick?',
    type: 'triggered',
    location: 'overlook',
    trigger: 'bouquet',
    inputType: 'choice',
    options: ['🌸', '🌹', '🌿', '🌷', '💐', '🌼'],
    sequence: 1,
  },

  // TRIGGERED — Moon
  {
    id: 'moon_q1',
    text: 'Rate your life out of 10.',
    type: 'triggered',
    location: 'overlook',
    trigger: 'moon',
    inputType: 'choice',
    options: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
    sequence: 1,
  },
  {
    id: 'moon_q2',
    text: 'What made you smile recently?',
    type: 'triggered',
    location: 'overlook',
    trigger: 'moon',
    inputType: 'text',
    sequence: 2,
  },
  {
    id: 'moon_q3',
    text: 'What is one de-stress method you use?',
    type: 'triggered',
    location: 'overlook',
    trigger: 'moon',
    inputType: 'text',
    sequence: 3,
  },

  // triggered -- commons
  {
    id: 'commons_family',
    text: "What is your family's go-to activity?",
    type: 'triggered',
    location: 'commons',
    trigger: 'family_scene',
    inputType: 'text',
    sequence: 1
  },

  {
    id: 'commons_room_frame1',
    text: 'What\'s a memory you\'re afraid you\'ll forget one day?',
    type: 'triggered',
    location: 'commons',
    trigger: 'frames_scene',
    inputType: 'text',
    sequence: 1,
  },

  {
    id: 'commons_room_grapes1',
    text: 'Favorite movie snack: ',
    type: 'triggered',
    location: 'commons',
    trigger: 'grapes_scene',
    inputType: 'text',
    sequence: 1
  },

  {
    id: 'commons_room_light1',
    text: 'Your house is burning, what do you grab?',
    type: 'triggered',
    location: 'commons',
    trigger: 'light_scene',
    inputType: 'text',
    sequence: 1
  },

  {
    id: 'commons_light_kmk',
    text: 'Kiss, Marry, Kill:',
    type: 'triggered',
    location: 'commons',
    trigger: 'light_scene',
    inputType: 'kmk',
    options: ['Pineapple on pizza', 'Ketchup on eggs', 'Mayo on fries'],
    sequence: 2,
  },
  {
    id: 'commons_light_2truths',
    text: 'Two Truths and a Lie: Select the Lie',
    type: 'triggered',
    location: 'commons',
    trigger: 'light_scene',
    inputType: 'twoTruths',
    options: ['I average a banana a day', 'I like my drinking water hot', 'I hate milk'],
    correctAnswer: 'I average a banana a day',
    sequence: 3,
  },

  {
    id: 'commons_room_light4',
    text: 'Would you rather:',
    type: 'triggered',
    location: 'commons',
    trigger: 'light_scene',
    inputType: 'choice',
    options: ['never wear socks', 'always wear shoes'],
    sequence: 4,
  },

  // ambient -- commons (walk)
  {
    id: 'commons_walk_ambient',
    text: 'What is one thing you refuse to be frugal about?',
    type: 'ambient',
    location: 'commons',
    inputType: 'text'
  },

  // AMBIENT — anywhere
  {
    id: 'ambient_1',
    text: 'Do you think suffering truly makes us stronger?',
    type: 'ambient',
    location: null,
    inputType: 'text',
  },

  {
    id: 'ambient_2',
    text: 'What\'s your favorite icebreaker question?',
    type: 'ambient',
    location: null,
    inputType: 'text',
  },
]
```

---

## Full current `useQuestions.js`

```javascript
import { questions } from '../data/questions'
import { saveAnswerToBackend } from '../utils/api'

const REST_AFTER = 2 // show rest message after every N intentional questions

export function useQuestions() {

  function getVisitor() {
    return JSON.parse(localStorage.getItem('visitor')) || {}
  }

  function saveVisitor(visitor) {
    localStorage.setItem('visitor', JSON.stringify(visitor))
  }

  function getSeenQuestions() {
    return getVisitor().seenQuestions || []
  }

  function markSeen(questionId) {
    const visitor = getVisitor()
    const seenQuestions = visitor.seenQuestions || []
    if (!seenQuestions.includes(questionId)) {
      seenQuestions.push(questionId)
    }
    saveVisitor({ ...visitor, seenQuestions })
  }

  function saveAnswer(questionId, answer) {
    const visitor = getVisitor()
    const answers = visitor.answers || {}
    answers[questionId] = answer
    saveVisitor({ ...visitor, answers })

    // Sync to backend in the background. If the visitor doesn't have
    // a backend id yet, just skip — the answer's still saved locally.
    if (visitor.id) {
      saveAnswerToBackend(visitor.id, questionId, answer).catch((err) =>
        console.error('Failed to sync answer to backend:', err)
      )
    }
  }

  function incrementIntentionalCount() {
    const visitor = getVisitor()
    const count = (visitor.intentionalQuestionCount || 0) + 1
    saveVisitor({ ...visitor, intentionalQuestionCount: count })
    return count
  }

  function getIntentionalCount() {
    return getVisitor().intentionalQuestionCount || 0
  }

  function shouldRest() {
    const count = getIntentionalCount()
    return count > 0 && count % REST_AFTER === 0
  }

  function getTriggeredQuestion(location, trigger) {
    const seen = getSeenQuestions()
    const triggered = questions
      .filter(q =>
        q.type === 'triggered' &&
        q.location === location &&
        q.trigger === trigger &&
        !seen.includes(q.id)
      )
      .sort((a, b) => a.sequence - b.sequence)

    return triggered[0] || null
  }

  function getAmbientQuestion(location, { includeGlobal = true } = {}) {
    const seen = getSeenQuestions()
    const ambient = questions.filter(q =>
      q.type === 'ambient' &&
      (includeGlobal ? (q.location === null || q.location === location) : q.location === location) &&
      !seen.includes(q.id)
    )

    if (ambient.length === 0) return null
    return ambient[Math.floor(Math.random() * ambient.length)]
  }

  function getGlobalAmbientQuestion() {
    const seen = getSeenQuestions()
    const ambient = questions.filter(q =>
      q.type === 'ambient' &&
      q.location === null &&
      !seen.includes(q.id)
    )

    if (ambient.length === 0) return null
    return ambient[Math.floor(Math.random() * ambient.length)]
  }

  function getIntentionalQuestion(location, trigger) {
    // check rest first
    if (shouldRest()) return { isRest: true }

    const question = getTriggeredQuestion(location, trigger)
    if (question) {
      incrementIntentionalCount()
      return question
    }
    return null
  }

  return {
    getTriggeredQuestion,
    getIntentionalQuestion,
    getAmbientQuestion,
    getGlobalAmbientQuestion,
    markSeen,
    saveAnswer,
    shouldRest,
    getSeenQuestions,
  }
}
```

---

## Full current `useAmbientQuestion.js`

```javascript
import { useState, useRef, useEffect } from 'react'
import { useQuestions } from './useQuestions'

// Reusable ambient-question timer. Two tiers:
// - "local": frequent questions scoped to this specific location
// - "global": rare questions that could show up anywhere (location: null)
//
// active: pass false to pause scheduling (e.g. only run while a
// specific scene within a location is being viewed).
// suppress: pass true while some other overlay/modal is already open,
// so ambient questions never stack on top of it — the timer just
// quietly reschedules instead of showing anything.
export function useAmbientQuestion(location, {
  active = true,
  suppress = false,
  localDelay = [20000, 45000],   // 20–45 seconds
  globalDelay = [180000, 360000], // 3–6 minutes
} = {}) {
  const { getAmbientQuestion, getGlobalAmbientQuestion } = useQuestions()
  const [question, setQuestion] = useState(null)
  const localTimerRef = useRef(null)
  const globalTimerRef = useRef(null)
  const suppressRef = useRef(suppress)

  useEffect(() => {
    suppressRef.current = suppress
  }, [suppress])

  function randomDelay([min, max]) {
    return min + Math.random() * (max - min)
  }

  function scheduleLocal() {
    localTimerRef.current = setTimeout(() => {
      if (suppressRef.current) {
        scheduleLocal()
        return
      }
      const q = getAmbientQuestion(location, { includeGlobal: false })
      if (q) {
        setQuestion(q)
      } else {
        scheduleLocal()
      }
    }, randomDelay(localDelay))
  }

  function scheduleGlobal() {
    globalTimerRef.current = setTimeout(() => {
      if (suppressRef.current) {
        scheduleGlobal()
        return
      }
      const q = getGlobalAmbientQuestion()
      if (q) setQuestion(q)
      scheduleGlobal()
    }, randomDelay(globalDelay))
  }

  useEffect(() => {
    if (!active) return

    scheduleLocal()
    scheduleGlobal()

    return () => {
      clearTimeout(localTimerRef.current)
      clearTimeout(globalTimerRef.current)
    }
  }, [active])

  function close() {
    setQuestion(null)
    if (active) scheduleLocal()
  }

  return { question, close }
}
```

---

## Full current `QuestionCard.css`

```css
.question-card-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  transition: background 0.4s ease, backdrop-filter 0.4s ease;
  -webkit-transition: background 0.4s ease, -webkit-backdrop-filter 0.4s ease;
  pointer-events: none;
}

.question-card-overlay.visible {
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  pointer-events: all;
}

.question-card {
  width: 680px;
  min-height: 200px;
  position: relative;
  transform: scale(0.8);
  opacity: 0;
  transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.4s ease;
  border-radius: 8px;
}

.question-card.flipped {
  transform: scale(1);
  opacity: 1;
}

/* school theme */
.question-card--school {
  background: #0d1a0d;
  border: 1.5px solid #27500A;
  border-bottom: none;
}

.question-card__header {
  background: linear-gradient(to right, #27500A, #FAC775);
  padding: 6px 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 8px 8px 0 0;
}

.question-card__header-title {
  font-family: 'VT323', monospace;
  font-size: 16px;
  color: #EAF3DE;
  letter-spacing: 0.05em;
}

.question-card__close--school {
  width: 16px;
  height: 16px;
  background: #0d1a0d;
  border: 1px solid #EAF3DE;
  color: #EAF3DE;
  font-family: 'VT323', monospace;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}

/* warm theme */
.question-card--warm {
  background: #F5F0E8;
  border: 1.5px solid;
  border-bottom: none;
}

.question-card__close {
  position: absolute;
  top: 12px;
  right: 16px;
  background: none;
  border: none;
  font-family: var(--font-ui);
  font-size: 16px;
  color: #D3D1C7;
  cursor: pointer;
}

.question-card__body {
  padding: 24px 28px;
}

/* school text */
.question-card--school .question-card__text {
  font-family: 'VT323', monospace;
  font-size: 28px;
  color: #97C459;
  letter-spacing: 0.05em;
  margin-bottom: 24px;
}

/* warm text */
.question-card--warm .question-card__text {
  font-family: var(--font-warm);
  font-size: 30px;
  color: var(--color-deep-green);
  margin-bottom: 20px;
}

.question-card__input-wrap {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
}

.question-card__input {
  background: transparent;
  border: none;
  outline: none;
  width: 100%;
}

.question-card--school .question-card__input {
  font-family: 'VT323', monospace;
  font-size: 22px;
  color: #97C459;
}

.question-card--warm .question-card__input {
  font-family: var(--font-user);
  font-size: 20px;
  color: var(--color-deep-green);
}

.question-card__line {
  width: 100%;
  height: 1.5px;
  margin-top: 4px;
}

.question-card--school .question-card__line {
  background: #27500A;
}

.question-card__choices {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 8px;
}

.question-card__choice-btn {
  padding: 8px 16px;
  border: 1.5px solid;
  background: transparent;
  cursor: pointer;
  font-size: 20px;
  border-radius: 4px;
  transition: background 0.2s ease;
}

.question-card--school .question-card__choice-btn {
  border-color: #27500A;
  color: #97C459;
  font-family: 'VT323', monospace;
}

.question-card__choice-btn:hover {
  background: rgba(0, 0, 0, 0.08);
}

.question-card__maybe-later {
  margin-top: 16px;
  background: none;
  border: none;
  cursor: pointer;
  opacity: 0.5;
  transition: opacity 0.2s ease;
  font-size: 12px;
}

.question-card--school .question-card__maybe-later {
  font-family: 'VT323', monospace;
  color: #97C459;
  font-size: 14px;
}

.question-card--warm .question-card__maybe-later {
  font-family: var(--font-ui);
  color: var(--color-deep-green);
}

.question-card__maybe-later:hover {
  opacity: 1;
}

.question-card__rest {
  font-style: italic;
  opacity: 0.8;
}

.question-card--overlook {
  background: #1a1235;
  border: 1.5px solid #FAC775;
  border-bottom: none;
}

.question-card--overlook .question-card__text {
  font-family: var(--font-warm);
  font-size: 30px;
  color: #FAC775;
  margin-bottom: 20px;
}

.question-card--overlook .question-card__input {
  font-family: var(--font-user);
  font-size: 20px;
  color: #EAF3DE;
  caret-color: #FAC775;
}

.question-card--overlook .question-card__line {
  background: #FAC775;
  opacity: 0.3;
}

.question-card--overlook .question-card__choice-btn {
  border-color: #FAC775;
  color: #FAC775;
}

.question-card--overlook .question-card__maybe-later {
  font-family: var(--font-ui);
  color: #FAC775;
  opacity: 0.5;
}

.question-card--overlook .question-card__close {
  color: #FAC775;
  opacity: 0.5;
}

.kmk-pool {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  justify-content: center;
  margin: 1rem 0;
  min-height: 3rem;
}

.kmk-zones {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 1rem;
}

.kmk-zone {
  flex: 1;
  min-height: 80px;
  border: 2px dashed var(--color-warm-gray, #d3d1c7);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem;
  transition: border-color 0.2s ease, background 0.2s ease;
}

.kmk-zone--over {
  border-color: var(--pink, #ed93b1);
  background: rgba(237, 147, 177, 0.1);
}

.kmk-zone-label {
  font-family: 'Caveat Brush', cursive;
  font-size: 1rem;
  color: var(--color-deep-green);
}

.kmk-chip {
  background: var(--cream, #f5f0e8);
  border: 1px solid var(--color-warm-gray, #d3d1c7);
  border-radius: 20px;
  padding: 0.4rem 0.9rem;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.85rem;
  cursor: grab;
  touch-action: none;
}

.kmk-chip--placed {
  cursor: default;
  background: var(--pink, #ed93b1);
  color: white;
  border-color: var(--pink, #ed93b1);
}

.question-card__reveal-message {
  font-family: 'DM Sans', sans-serif;
  font-size: 0.95rem;
  margin-bottom: 1rem;
  text-align: center;
}

.question-card__choice-btn--lie {
  border-color: var(--pink, #ed93b1) !important;
  background: rgba(237, 147, 177, 0.15);
  font-weight: 600;
}

.question-card__choice-btn--wrong {
  opacity: 0.5;
  text-decoration: line-through;
}
```

**This file is confirmed current and complete** — no further CSS additions are outstanding for `QuestionCard.css` as of this update.

---

## ⚠️ Verification limits — read this before trusting anything blindly

**A real bug was found and fixed during a final audit pass (this session):** `useQuestions.js`'s `saveAnswer` function called `saveAnswerToBackend(...)`, but the import for it had gone missing from the top of the file — meaning every answer-save for any visitor with a backend id would have thrown a runtime error. This was caught only by directly re-reading the actual saved file and comparing it line-by-line against what this document claimed, rather than trusting either memory or a prior "success" message. **It's fixed now in the version documented below** — but this is a concrete example of how documentation and reality can silently drift apart in a long session, and why the next person working on this project (human or AI) should verify claims against real files rather than take any doc — including this one — fully on faith.

**A structural limitation to know about:** many CSS additions across this project were given only as inline snippets in chat, for manual merging into the real project files — they were never saved as tracked files in this session's own workspace, and never re-verified afterward the way the JS/JSX logic files above were (each of which was directly re-read and cross-checked against this document before it was finalized). That means the CSS list below should be treated as **"this was given at some point — please confirm it's actually present in your real files,"** not as verified fact the way everything above it is.

**CSS given via chat, needing a real-file check:**
- `CommonsSceneModal.css` — `.commons-credit-icon`, `.commons-credit-overlay`, `.commons-credit-card`, `.commons-credit-close`, `.commons-credit-text` (Rive attribution icon + card)
- `CommonsSceneModal.css` — `.commons-action-prompt-title`, `.commons-action-prompt-buttons`, `.commons-action-prompt-btn` (+ `--done`/`--later` variants), `.commons-action-prompt-complete` (Action Prompt system)
- `CommonsSceneModal.css` — `.commons-confetti-wrap`, `.commons-confetti-piece` (12 `nth-child` color/drift/delay rules), `@keyframes confettiPopFall` (confetti burst)
- `CommonsSceneModal.css` — `.commons-modal-intro` needs `margin-bottom: 1rem` (paragraph spacing fix — confirmed this was a real, needed fix earlier in the session; worth double-checking it's still there)
- `WorldMap.css` — `.location-pulse-ring`, `@keyframes locationPulse` (Café-first pulse nudge)
- `CommonsSceneModal.css` — `.commons-reveal-question` — likely now genuinely unused (light/grapes/frames bypass the modal entirely via `directQuestion`, and Walk's old reveal-button pattern was removed too) — safe to delete if it's still sitting there unused, not required to keep

---

## Attribution Required
RyanRumbolt's "Hover House," "Cloudy Walk," and "Bored Room" (Rive assets, part of his "Little Wonders" series, illustrated in collaboration with Justyna Stasik) ARE used in Commons — modified from the originals, not custom exports as earlier documentation incorrectly stated.

**License:** CC BY 4.0 — legally requires both attribution and disclosure that changes were made.

**Implemented as:** a small, low-opacity "i" info icon (`.commons-credit-icon`) in the bottom-right corner of `CommonsScreen.jsx`, revealing a credit card on click:

> "Hover House," "Cloudy Walk," and "Bored Room" by [RyanRumbolt](https://rive.app/@RyanRumbolt/), in collaboration with Justyna Stasik, licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Modified from the originals.