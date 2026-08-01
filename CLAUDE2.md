# CLAUDE.md — Rona's World Project Documentation
*Last updated: July 30, 2026*

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
      OpeningScreen.jsx       ← black screen, Bebas Neue
      OpeningScreen.css
      PromptScreen.jsx        ← reusable prompt + input
      PromptScreen.css
      QuestionCard.jsx        ← location-themed question cards — supports inputType:
                                 'text' | 'choice' | 'kmk' | 'twoTruths'
      QuestionCard.css
      questionInputs/
        KissMarryKill.jsx     ← drag-and-drop Kiss/Marry/Kill, used by inputType 'kmk'
      WelcomeScreen.jsx       ← "Welcome, [name]." fade (first-time visitors only)
      WelcomeScreen.css
    data/
      questions.js            ← ALL questions live here
      themes.js                ← question card themes per location (includes 'commons': pink)
      cafeBooks.js             ← café book data with SVG coordinates
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
- `ambient_2` — favorite icebreaker question

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

**Ambient questions** — now wired via `useAmbientQuestion('cafe', { suppress: !!activeBook || !!activeQuestion || showJournal || showDrinkPicker })`, so the flower pick (and any future café ambient questions) surfaces on its own after 20–45 seconds, but never stacks on top of a book/journal/drink-picker/other question already open.

**Books:**
1. Ugly Art — drag to rank 4 art pieces, titles reveal after submit
2. Recently Read — reading list (Tuesdays with Morrie, Eleanor Oliphant, Freakonomics, Funny Story, Tomorrow×3)
3. Premium Instagram Reels Pull — journal entry about lifelong partners + inline question

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
| `[???]` | layton/ | Coming soon — puzzle not yet built |
| `[EXE]` | question.exe | Question card with 2-question cooldown |
| `[DIR]` | projects/ | Coming soon |
| `[WIP]` | freakonomics.exe | Coming soon |

---

## The Overlook (Built)

Dusk/night SVG scene. Dark purple/navy sky with layered gradients, crescent moon, stars, birds, trees, string lights, bench with figure (Rona) + bouquet + book.

**Clickable elements:**
- **String lights (10)** — hover reveals a simple joy. ✅ **Written** (see below).
- **Bouquet** — triggers overlook_flower question. Colors reflect visitor's flower (café) + favorite person's flower (overlook). White if unanswered.
- **Book (amber)** — opens "on happiness" essay modal. ⬜ **Essay still not written** — placeholder text.
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

**TODO:** Write happiness essay.

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
> Although the "slow living" trend tried to convince me to enjoy chores, they failed. Anything that required I take my focus away from the task that brought me closer to my goals was an unwelcome inconvenience.
>
> But as my girlfriend and I started spending prolonged periods of time together, we started doing our everyday mundane tasks together, and you know what? I didn't mind doing these chores at all. I hate the time transportation takes but driving for her or walking with her? Doesn't feel like any time was lost at all. Cooking is a date night activity, grocery shopping is a fun sidequest, and laundry is time to watch a show together.
>
> I guess some people just make life a bit more vibrant, so it's easier to slow down and enjoy the colors.

**Room — "Whatever, Together":**
> While I love a good shared activity to pass quality time with loved ones, I've also discovered the art of the "super casual hang". Having friends over to "study" in the living room, stretch on my yoga mat, sit on the couch and contemplate life—it's nice to just be in the company of others. My roommate is the master of the "super casual hang", and every second we lived together, I discovered new joys to this art, as well as just how important it was to me to have friends I could just exist with.

### Attribution note
Original brainstorm considered RyanRumbolt's "Hover House" Rive file (CC BY, requiring credit) — the actual built scenes use custom Rive exports instead (`card-scene.riv`, `walking-scene.riv`, `room-scene.riv`, all with `State Machine 1` as the driving state machine), so **no attribution is owed**. Keeping this note in case the original file is ever referenced again.

---

## The Field (Not started)

**Concept:** movement, frisbee, sport.
- "Do this workout with me" — follow-along routine
- Frisbee-related activity (TBD)

**Status:** Concept only, not designed or built.

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

## Deployment Plan (not yet executed)

**Chosen approach:** Vercel (frontend) + Render (backend) — two separate services, matching the original Phase 1 roadmap.

**Why two services:** the frontend is static files (HTML/JS/CSS) best served from Vercel's CDN; the backend is a persistent running Python process, which needs an always-on host like Render (Vercel's serverless model doesn't fit a long-running FastAPI server well).

**Steps outlined:**
1. Push repo to GitHub
2. Render: new Web Service, build command `pip install -r requirements.txt`, start command `uvicorn main:app --host 0.0.0.0 --port $PORT`, env vars `SUPABASE_URL`/`SUPABASE_KEY` set in Render's dashboard (not committed)
3. Update `main.py`'s CORS `allow_origins` with the real deployed Vercel URL
4. Update `src/utils/api.js`'s `API_URL` to use an environment variable (`import.meta.env.VITE_API_URL`) so local dev still points at `localhost:8000` while production points at Render
5. Vercel: import repo, auto-detects Vite, set `VITE_API_URL` env var to the Render URL
6. Test the full flow (visitor creation, answering a question, journal post) on the deployed URLs before sharing the link

**Cold-start mitigation (needed for a good recruiter/first-impression experience, not just friend-testing):**
- Render free tier sleeps after ~15 min inactivity, ~30–60s wake time on next request
- Supabase free tier pauses after ~7 days inactivity, doesn't self-wake
- **Fix:** the `/ping` route (added) + an external monitor hitting it every 5–10 minutes, keeping both services perpetually warm. **UptimeRobot** (free) recommended — not yet set up, user said they'd think about it.

---

## Phase Roadmap

### Phase 1 — Launch (current)
- ✅ Opening screen → prompts → welcome → map
- ✅ World map Direction B (greeting spacing/logic fixed)
- ✅ The School (RonalzOS desktop)
- ✅ The Café (books, community journal, drink picker, ambient questions wired)
- ✅ The Overlook (string lights with joys written, moon questions, bouquet, book)
- ✅ Question card system with themes, cooldown, maybe later, kmk/twoTruths input types
- ✅ localStorage for returning visitors
- ✅ Sound system
- ✅ FastAPI + Supabase backend (journal entries + visitor creation + answers, all working)
- ✅ The Commons interior (3 Rive scenes, hotspots, cursor regions, blurbs, questions)
- ⬜ Café — 3 new book entries: "Good at Life," "New Words," Ethics Game (likely only 1 gets done in the near term)
- ⬜ Write happiness essay for Overlook book
- ⬜ Professor Layton puzzle — want multiple eventually, at least 1 to start
- ⬜ The Field — at least 1 workout + some clickable characters saying "workout coming soon" (waiting on Illustrator artwork)
- ⬜ Add more questions across all locations
- ⬜ Deploy (Vercel for frontend, Render for backend)
- ⬜ Set up UptimeRobot (or similar) for keep-warm pinging

### Phase 2 — Enrichment
Originally broader — most of what was here has since been pulled forward into Phase 1 or partially completed:

- Optional login / account creation
- Cross-device experience (this is really the natural follow-on once login exists — right now synced answers exist in Supabase but there's no way for a visitor to retrieve them on a different device without an account system)

### Phase 3 — Intelligence
- AI-generated questions based on visitor answers
- "Talk to Rona" — RAG system, click figure on Overlook bench
- Map personalization — elements appear based on visitor answers
- Moon on Overlook — TBD interaction
- Commons NPCs from visitor's own life — **a lightweight bridge toward this already exists**: the card scene's left/right girl, cat, house-top flower, and lake flower all have `cursorRegions` defined (cursor feedback only, no question yet). Promoting any of these to a real `hotspot` with `directQuestion: true` + a `questions.js` entry is mechanically identical to how Light/Grapes/Frames were built — a small, well-understood step, though still a step short of the full "NPCs personalized to the visitor's own life" vision, which would need actual dynamic/AI-driven content.

### Phase 4
- Playable card game with family NPCs
- Playable puzzle with frisbee team NPCs

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

## Outstanding CSS still needed (not yet confirmed added)

- `CommonsSceneModal.css` — `.commons-reveal-question` (styled reveal button, was given earlier in the project but should be double-checked it's actually in the file — may now be unused if light/grapes/frames all bypass the modal via `directQuestion`, but Walk's old reveal-button pattern was removed too, so this class may no longer be needed anywhere; safe to leave in or remove)
- `CommonsSceneModal.css` — double-check `.commons-content` has `position: relative` if the absolutely-positioned `.commons-modal-close` button (now rendered per-content-component rather than by the shared modal wrapper) doesn't anchor visually where expected

---

## Attribution Required
If using RyanRumbolt's Hover House Rive file:
Credit: RyanRumbolt + Justyna Stasik, CC BY 4.0

(Not currently applicable — Commons uses custom Rive exports instead. Keeping this note for reference.)