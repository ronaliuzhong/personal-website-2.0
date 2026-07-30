# CLAUDE.md — Rona's World Project Documentation
*Last updated: July 19, 2026*

## Project Vision
A personal website that functions as an interactive experience rather than a traditional portfolio. Visitors are welcomed through a series of prompts, then explore "Rona's World" — a map of five clickable locations, each revealing a different facet of who Rona is. The overarching goal is mutual discovery: getting to know the visitor while helping them understand themselves better through thoughtful questions.

---

## Tech Stack

### Frontend
- **React** (via Vite) — component-based UI
- **JavaScript/JSX** — no TypeScript
- **CSS modules per component** — no Tailwind
- **SVG** — for the world map, café interior, and overlook interior

### Backend
- **Python + FastAPI** — REST API server
- **Supabase (PostgreSQL)** — hosted database
- **uvicorn** — ASGI server for FastAPI

### Key Libraries
- `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities` — drag to rank (Ugly Art book)
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
        CafeScreen.jsx        ← full café interior (SVG)
        CafeScreen.css
        CommonsScreen.jsx     ← placeholder
        SchoolScreen.jsx      ← RonalzOS desktop
        SchoolScreen.css
        OverlookScreen.jsx    ← full overlook interior (SVG, dusk scene)
        OverlookScreen.css
        FieldScreen.jsx       ← placeholder
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
          LaytonWindow.jsx    ← placeholder "coming soon"
          LaytonWindow.css
          ComingSoonWindow.jsx ← reusable coming soon
          ComingSoonWindow.css
      OpeningScreen.jsx       ← black screen, Bebas Neue
      OpeningScreen.css
      PromptScreen.jsx        ← reusable prompt + input
      PromptScreen.css
      QuestionCard.jsx        ← location-themed question cards
      QuestionCard.css
      WelcomeScreen.jsx       ← "Welcome, [name]." fade
      WelcomeScreen.css
    data/
      questions.js            ← ALL questions live here
      themes.js               ← question card themes per location
      cafeBooks.js            ← café book data with SVG coordinates
    hooks/
      useAppState.js          ← all screen routing and state logic
      useQuestions.js         ← question sequencing, seen tracking, cooldown
      useSounds.js            ← sound action mapping
    utils/
      sounds.js               ← Web Audio API sound functions
      api.js                  ← fetch calls to FastAPI backend
    constants.js              ← COLORS, FONTS, SCREENS constants
    App.jsx                   ← clean render, uses useAppState
    App.css
    main.jsx
  backend/
    main.py                   ← FastAPI routes
    requirements.txt
    .env                      ← SUPABASE_URL, SUPABASE_KEY (not in git)
    venv/                     ← not in git
  index.html                  ← Google Fonts loaded here
  CLAUDE.md                   ← this file
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

Returning visitors (detected via localStorage) skip straight to the map with a brief "Welcome back, [name]." greeting that fades in and out.

---

## Design System

### Fonts (loaded in index.html via Google Fonts)
- `Bebas Neue` — opening screen (stark, all caps)
- `Caveat Brush` — prompts, warm world text, map title (handwritten, warm)
- `Kalam` — user input in prompt screens (handwritten, neutral)
- `DM Sans` — UI hints, labels, resume body text (clean sans)
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
  inputType: 'text' | 'choice',
  options: [],               // for choice questions
  sequence: 1,               // for triggered questions
}
```

**Triggered** — appear when a specific object is clicked. Sequenced, never repeats once seen.
**Ambient** — random, location-aware. Cooldown: after every 2 intentional questions, shows rest message.
**Rest message**: "let your brain rest for now. we can ponder again soon."
**Maybe later button** — closes without marking seen, question reappears later.

### Current questions:
- `school_t1` — pick work emoji (projects trigger)
- `school_t2` — worst nightmare job (projects trigger)
- `school_qexe_1` — what if money wasn't a question (question_exe trigger)
- `school_qexe_2` — money or passion (question_exe trigger)
- `cafe_t1` — pick a flower, now ambient (options: 🌸🌹🌿🌷💐🌼)
- `cafe_t2` — who is most important (bookshelf trigger)
- `overlook_flower` — favorite person's flower (bouquet trigger)
- `moon_q1` — rate your life out of 10 (moon trigger, 2hr cooldown)
- `moon_q2` — what made you smile recently (moon trigger)
- `moon_q3` — what does a perfect day look like (moon trigger)
- `ambient_1` — does suffering make us stronger
- `ambient_2` — what do you refuse to be frugal about
- `ambient_4` — favorite icebreaker question
- `cafe_witness_question` — why do people look for a lifelong partner (inline in WitnessBook)
- `ugly_art_ranking` — drag to rank art pieces (inline in UglyArtBook)

---

## World Map (Direction B)

Minimal aesthetic: cream `#F5F0E8` background, faint paths `#E0D8C8`, soft color washes, concentric circle markers. No white boxes.

Five locations with SVG coordinates:
| Location | Theme | Accent | x | y | Status |
|----------|-------|--------|---|---|--------|
| The Café | reflection · reading | amber | 180 | 260 | ✅ Built |
| The Commons | community · people | pink | 320 | 360 | ⬜ Placeholder |
| The School | code · projects | blue | 400 | 200 | ✅ Built |
| The Overlook | joy · simple things | green | 560 | 170 | ✅ Built |
| The Field | movement · sport | light green | 160 | 450 | ⬜ Placeholder |

---

## The Café (Built)

SVG interior: bookshelves left/right, clear sky window, table with coffee cup, journal, plant.

**Clickable elements:**
- **Books** — data-driven from `cafeBooks.js`. Add new book = one entry in `cafeBooks.js` + new component in `cafe/` + entry in `BookModal.jsx` bookComponents object.
- **Coffee cup** — drink picker (coffee, tea, water, juice, milk). Liquid color changes. Saved to localStorage.
- **Journal on table** — opens community journal (shared, Supabase-backed).

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
| `[???]` | layton/ | Coming soon |
| `[EXE]` | question.exe | Question card with 2-question cooldown |
| `[DIR]` | projects/ | Coming soon |
| `[WIP]` | freakonomics.exe | Coming soon |

---

## The Overlook (Built)

Dusk/night SVG scene. Dark purple/navy sky with layered gradients, crescent moon, stars, birds, trees, string lights, bench with figure (Rona) + bouquet + book.

**Clickable elements:**
- **String lights (10)** — hover reveals a simple joy from `SIMPLE_JOYS` array in component. Need to write personal ones.
- **Bouquet** — triggers overlook_flower question. Colors reflect visitor's flower (café) + favorite person's flower (overlook). White if unanswered.
- **Book (amber)** — opens "on happiness" essay modal. Essay not yet written — placeholder text.
- **Moon** — glows with pulse when question ready. 2hr cooldown between questions. Triggers moon_q1/2/3 in sequence.
- **Figure (Rona)** — Phase 3 placeholder for "talk to Rona" AI feature.

**Theme:** dark purple `#1a1235` background, amber `#FAC775` accents for question cards.

**TODO:** Write 10 simple joys, write happiness essay.

---

## The Commons (In Progress — brainstorming)

**Concept:** community space with three activity zones featuring real people from Rona's life.
- Card game (family: mom, dad, sister) — scripted vignette not playable game
- Puzzle (frisbee teammates)
- Talking corner (college friends)

**Visual direction:** Considering using RyanRumbolt's "Hover House" Rive animation (CC BY license — must credit RyanRumbolt + Justyna Stasik). File has interactive states: Womanright, womanleft, cat.hover, catroom.hover, duckdown, duckup etc.

**Alternative:** Town square SVG layout with Rive characters placed within it.

**Status:** Brainstorming visual approach. Not started.

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
| POST | `/visitors` | Create visitor |
| GET | `/visitors/{id}` | Get visitor |
| POST | `/answers` | Save answer |
| GET | `/answers/{visitor_id}` | Get visitor answers |
| POST | `/journal` | Create journal entry |
| GET | `/journal` | Get all entries (oldest first) |

**Note:** Frontend answers currently only save to localStorage. Backend sync not yet wired up — planned for Phase 2 with login.

---

## Database (Supabase PostgreSQL)

Three tables: `visitors`, `answers`, `journal_entries`. RLS disabled.

---

## Sound System

All sounds in `src/utils/sounds.js`, mapped in `src/hooks/useSounds.js`:
- `playEnter()` → chime — opening screen, moon click
- `playSubmit()` → bubble — prompt answer submit
- `playTransition()` → whoosh — entering a location
- `playClick()` → click — small UI interactions
- `playPiano()` → piano — available, unused

---

## Phase Roadmap

### Phase 1 — Launch (current)
- ✅ Opening screen → prompts → welcome → map
- ✅ World map Direction B
- ✅ The School (RonalzOS desktop)
- ✅ The Café (books, community journal, drink picker)
- ✅ The Overlook (string lights, moon questions, bouquet, book)
- ✅ Question card system with themes, cooldown, maybe later
- ✅ localStorage for returning visitors
- ✅ Sound system
- ✅ FastAPI + Supabase backend (journal entries working)
- ⬜ Write Overlook simple joys (10 entries)
- ⬜ Write happiness essay for Overlook book
- ⬜ The Commons interior
- ⬜ The Field interior
- ⬜ Wire ambient questions to Café
- ⬜ Professor Layton puzzle
- ⬜ Deploy (Vercel for frontend, Render for backend)

### Phase 2 — Enrichment
- Optional login / account creation
- Backend sync for localStorage answers
- Cross-device experience
- More questions added over time
- Illustrated assets if drawing happens

### Phase 3 — Intelligence
- AI-generated questions based on visitor answers
- "Talk to Rona" — RAG system, click figure on Overlook bench
- Map personalization — elements appear based on visitor answers
- Moon on Overlook — TBD interaction
- Commons NPCs from visitor's own life (Phase 3 Commons upgrade)

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
- **Custom hooks for logic** — `useAppState`, `useQuestions`, `useSounds`
- **App.jsx stays clean** — only renders, never contains logic
- **No SVG for people** — too abstract, use Rive or other assets

---

## Attribution Required
If using RyanRumbolt's Hover House Rive file:
Credit: RyanRumbolt + Justyna Stasik, CC BY 4.0