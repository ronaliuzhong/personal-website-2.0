# CLAUDE.md — Rona's World Project Documentation

## Project Vision
A personal website that functions as an interactive experience rather than a traditional portfolio. Visitors are welcomed through a series of prompts, then explore "Rona's World" — a map of five clickable locations, each revealing a different facet of who Rona is. The overarching goal is mutual discovery: getting to know the visitor while helping them understand themselves better through thoughtful questions.

---

## Tech Stack

### Frontend
- **React** (via Vite) — component-based UI
- **JavaScript/JSX** — no TypeScript
- **CSS modules per component** — no Tailwind
- **SVG** — for the world map and café interior

### Backend
- **Python + FastAPI** — REST API server
- **Supabase (PostgreSQL)** — hosted database
- **uvicorn** — ASGI server for FastAPI

### Key Libraries
- `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities` — drag to rank (Ugly Art book)
- `python-dotenv` — environment variables
- `supabase` (Python client) — database access

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
        WorldMap.jsx          ← main map component
        WorldMap.css
        Ground.jsx
        Beach.jsx
        Bluff.jsx
        Forest.jsx
        Stream.jsx            ← returns null currently
        Paths.jsx
        Trees.jsx
        TownDetails.jsx       ← returns null currently
        FieldDetails.jsx      ← returns null currently
      locations/
        CafeScreen.jsx        ← full café interior
        CafeScreen.css
        CommonsScreen.jsx     ← placeholder
        SchoolScreen.jsx      ← RonalzOS desktop
        SchoolScreen.css
        OverlookScreen.jsx    ← placeholder
        FieldScreen.jsx       ← placeholder
        LocationScreen.jsx    ← wrapper with fade + back button
        LocationScreen.css
        cafe/
          BookModal.jsx       ← modal wrapper for all books
          BookModal.css
          CommunityJournal.jsx ← shared journal with page flipping
          CommunityJournal.css
          UglyArtBook.jsx     ← drag to rank art pieces
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
  .gitignore
```

---

## Screen Flow

```
Opening Screen (black, Bebas Neue, click anywhere)
    ↓ click
Prompt 1 — "To know me, let me get to know you—what makes you happy?"
    ↓ Enter
Prompt 2 — "I love that. What should I call you?"
    ↓ Enter
Welcome Screen — "Welcome, [name]." fades in then out (2.3s)
    ↓ auto transition
World Map — five clickable locations
    ↓ click location
Location Interior Screen (fade in, back button top left)
```

Returning visitors (detected via localStorage) skip straight to the map with a brief "Welcome back, [name]." greeting that fades in and out.

---

## Design System

### Fonts (loaded in index.html via Google Fonts)
- `Bebas Neue` — opening screen, RonalzOS desktop (stark, all caps)
- `Caveat Brush` — prompts, warm world text, map title (handwritten, warm)
- `Kalam` — user input in prompt screens (handwritten, neutral)
- `DM Sans` — UI hints, labels, resume body text (clean sans)
- `VT323` — RonalzOS school desktop (pixel/retro)

### Colors (defined in `src/constants.js` and `index.css` as CSS variables)
```js
black:       '#0A0A0A'   // opening screen background
white:       '#FFFFFF'   // opening screen text
cream:       '#F5F0E8'   // prompt screens, café background
softGreen:   '#EAF3DE'   // map background
lightGreen:  '#C0DD97'   // field accent
midGreen:    '#97C459'   // trees, school terminal text
deepGreen:   '#27500A'   // primary text color in warm world
forestGreen: '#3B6D11'   // secondary green
warmGray:    '#D3D1C7'   // underlines, subtle elements
amber:       '#FAC775'   // café accent, RonalzOS gradient
pink:        '#ED93B1'   // commons accent
blue:        '#B5D4F4'   // school accent, water
```

### Transition: stark → warm
Opening screen is black/white. After first click, everything transitions to warm cream and green palette. The contrast is intentional.

---

## localStorage Schema

```js
{
  name: 'Rona',           // capitalized nickname
  returning: true,        // false on first visit, true after
  drink: 'coffee',        // chosen drink in café
  seenQuestions: [],      // array of question IDs already answered
  intentionalQuestionCount: 0, // for question.exe cooldown
  answers: {
    happiness: '...',     // prompt 1 answer
    school_t1: '💻',      // question answers keyed by question ID
    cafe_witness_question: '...',
    ugly_art_ranking: 'dali,millet,koons,hirst',
  }
}
```

---

## Question System

All questions live in `src/data/questions.js`. Each question has:
```js
{
  id: 'unique_id',
  text: 'Question text',
  type: 'triggered' | 'ambient',
  location: 'cafe' | 'school' | 'commons' | 'overlook' | 'field' | null,
  trigger: 'trigger_name',  // for triggered questions
  inputType: 'text' | 'choice',
  options: [],              // for choice questions
  sequence: 1,              // for triggered questions — order they appear
}
```

**Triggered questions** — appear when a specific object is clicked. Sequenced so each click goes deeper. Once seen, never repeats.

**Ambient questions** — random, location-aware, appear via `question.exe` style icons. Cooldown: after every 2 intentional questions, shows rest message instead.

**Rest message**: "let your brain rest for now. we can ponder again soon."

**Maybe later button** — on every question card. Closes without marking seen so question can reappear.

---

## World Map (Direction B)

Minimal aesthetic: cream background, faint paths, soft color washes, concentric circle markers for each location. No white boxes.

Five locations:
| Location | Theme | Accent Color | Status |
|----------|-------|-------------|--------|
| The Café | reflection · reading | amber `#FAC775` | ✅ Built |
| The Commons | community · people | pink `#ED93B1` | Placeholder |
| The School | code · projects | blue `#B5D4F4` | ✅ Built |
| The Overlook | joy · simple things | green `#97C459` | Placeholder |
| The Field | movement · sport | light green `#C0DD97` | Placeholder |

---

## The Café (Built)

Full SVG interior: bookshelves left and right, window with clear sky, table with coffee cup and journal, plant.

**Clickable elements:**
- **Books** — data-driven from `cafeBooks.js`. Each book has SVG coordinates. Adding a new book = one entry in `cafeBooks.js` + new component in `cafe/` + entry in `BookModal.jsx`'s `bookComponents` object.
- **Coffee cup** — drink picker (coffee, tea, water, juice, milk). Color of liquid changes. Saved to localStorage.
- **Journal on table** — opens community journal (shared, backend-connected).

**Books currently:**
1. Ugly Art — drag to rank 4 art pieces, titles reveal after submit
2. Recently Read — reading list
3. Premium Instagram Reels Pull — journal entry about lifelong partners + inline question

**Community Journal:**
- Page-flipping spread layout
- Oldest entries first, write page always last
- Anonymous or signed toggle
- Saves to Supabase via FastAPI
- Multiple entries allowed per session

---

## The School — RonalzOS (Built)

Retro OS desktop with starry night background and amber/green gradient title bars.

**Desktop icons (text-based, no SVG):**
| Icon | Label | Action |
|------|-------|--------|
| `[PDF]` | resume.pdf | Opens PDF iframe + download button |
| `[???]` | layton/ | Coming soon placeholder |
| `[EXE]` | question.exe | Triggers question card with cooldown |
| `[DIR]` | projects/ | Coming soon placeholder |
| `[WIP]` | freakonomics.exe | Coming soon placeholder |

**RonalzOS name** appears in taskbar. Time shown in bottom right.

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
| GET | `/journal` | Get all journal entries (oldest first) |

---

## Database (Supabase PostgreSQL)

Three tables: `visitors`, `answers`, `journal_entries`. RLS disabled for now.

---

## Sound System

All sounds in `src/utils/sounds.js`, mapped in `src/hooks/useSounds.js`:
- `playEnter()` → chime — opening screen click
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
- ✅ Question card system with themes, cooldown, maybe later
- ✅ localStorage for returning visitors
- ✅ Sound system
- ✅ FastAPI + Supabase backend
- ⬜ The Commons interior
- ⬜ The Overlook interior
- ⬜ The Field interior
- ⬜ Professor Layton puzzle
- ⬜ Wire frontend answers to backend
- ⬜ Deploy (Vercel for frontend, Render for backend)

### Phase 2 — Enrichment
- Optional login / account creation
- Illustrated assets (if drawings happen)
- More questions added over time
- Backend sync for localStorage answers
- Cross-device experience

### Phase 3 — Intelligence
- AI-generated questions based on visitor answers
- Map personalization — elements appear based on what visitor shares
- RAG system — AI answers questions as Rona
- Returning visitor experience deepens over time

---

## Key Conventions

- **No spaces around em dashes** — `like this—not like this`
- **Don't modify Rona's writing** without asking first
- **Colors always from constants** — never hardcode hex in components
- **CSS variables** in `index.css` for use in CSS files, JS constants in `constants.js` for use in JSX
- **Each component has its own CSS file**
- **All questions in `questions.js`** — never hardcoded in components
- **All book data in `cafeBooks.js`** — SVG coordinates live in data, not components
- **Custom hooks for logic** — `useAppState`, `useQuestions`, `useSounds`
- **App.jsx stays clean** — only renders, never contains logic

---

## What Needs Doing Next (Priority Order)

1. Wire frontend answers to backend (currently only saves to localStorage)
2. Build The Commons interior
3. Build The Overlook interior  
4. Build The Field interior
5. Write Professor Layton puzzle
6. Add more questions to question bank (target: 20-25 total)
7. Deploy frontend to Vercel, backend to Render
8. Add optional login (Phase 2)
