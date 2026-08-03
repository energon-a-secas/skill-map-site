# Skill Roadmap Builder — Project Guide

## Overview
A gamified personal skill tracker with Convex backend. Build visual skill roadmaps, track progress with XP/levels, manage streaks, and earn achievement badges.

Dual-mode storage: Roadmaps sync to Convex cloud (dev: `tremendous-spoonbill-534`), while the original zero-build static fallback still works via `localStorage`.

**Live:** skillmap.neorgon.com
**Dev:** `make dev` (terminal 1) + `make serve` (terminal 2)

---

## Commands

```bash
make setup     # First-time: npm install + deploy Convex functions
make dev       # Run Convex dev watcher (terminal 1)
make serve     # Start dev server → http://localhost:8777 (terminal 2)
make deploy    # Deploy Convex functions to production
make kill      # Kill HTTP server
```

Run `make dev` and `make serve` in separate terminals for local development.

---

## Architecture

### Convex Backend

**API modules:**
- `convex/auth.ts` - register, login, getRole, setRole (simple hash auth)
- `convex/roadmaps.ts` - list, get, save, delete (user roadmaps)
- `convex/shareLinks.ts` - create, getByToken, disable (shareable links)
- `convex/gamification.ts` - skills, sessions, streaks, badges, XP tracking
- `convex/schema.ts` - Database schema with 11 tables

**Deployment:** Dev deployment at `tremendous-spoonbill-534.convex.cloud` (see `.env.local`)

**Frontend client:** ESM CDN import (`https://esm.sh/convex@1.21.0/browser`) - no build step required.

### Frontend

**Current structure (pre-refactor):**
```
site/
├── index.html        # HTML shell (~160 lines) — structure only
├── css/
│   └── style.css       # All styles (~1070 lines)
├── js/
│   └── app.js        # All application logic (~1940 lines)
├── convex/           # Backend functions (10+ files)
└── package.json      # Convex dependency only
```

**Post-refactor structure (Modules completed):**
```
js/
├── app.js          # Entry point (not refactored yet)
├── state.js        # Convex client, auth, state management ✓
├── render.js       # DOM rendering, XP bars, animations ✓
├── gamification.js # XP system, leveling, badges, streaks ✓
├── sessions.js     # Session logger, calendar, history ✓
├── icons.js        # Icon picker, category management (todo)
├── auth.js         # Login/register UI (todo)
├── sharing.js      # Share link generation (todo)
├── ui.js           # Modals, toasts, helpers ✓
├── drag.js         # Node reordering (in app.js)
├── connections.js  # Connection handling (in app.js)
└── main.js         # Init, button wiring (in app.js)
```

---

## Data Models

Roadmap JSON (`roadmaps.data`: columns/lanes/nodes/edges/legends) + gamification tables (Skill, Streak, Badge). Schema mirrored in `convex/schema.ts` (11 tables).

**📖 Read `docs/references/data-models.md` before changing** the roadmap/gamification data layer or Convex schema — it holds the full field-by-field JSON shapes for Roadmap, Skill, Streak, and Badge.

---

## Key Features

### Current (Static)
- Visual skill roadmaps with nodes, columns, lanes
- Typed connections (blocks, informs, enhances, enables, prepares)
- Dependency locking & propagation
- Color & marker legends
- Save/load to localStorage
- Export to JSON/Markdown

### Coming (Convex + Gamification)
- User accounts & authentication ✓ (backend done, UI in progress)
- Cloud sync across devices ✓ (backend done)
- XP & leveling system (1-100 per skill) ✓ (complete with animations)
- Streak tracking (🔥 flame icons) ✓ (session logger, calendar, history)
- Achievement badges (20-30 milestones) (backend done, showcase UI needed)
- Icon picker with curated categories (todo)
- Shareable roadmap links (read-only) (backend done, frontend todo)
- Skill session logging with notes ✓ (complete)

---

## Auth

Simple username/password with non-cryptographic hash (sufficient for personal tracker).
- First registered user becomes `admin`
- Admin role stored in localStorage, re-verified on login
- Future: Admin can upload icons via icon management UI

---

## Development Notes

**Port:** 8777 (see `Makefile`)

**CORS:** dev deployment allows localhost:8777 by default

**.env.local** contains `CONVEX_DEPLOYMENT`, `CONVEX_URL`, `CONVEX_SITE_URL` — DO NOT commit to git

**Frontend Convex client:** Loaded via https://esm.sh/convex@1.21.0/browser (no npm build)

**API calls:** String-based function names defined in `js/api.js`:
```js
export const api = {
  auth: { register: "auth:register", login: "auth:login", getRole: "auth:getRole" },
  roadmaps: { list: "roadmaps:list", get: "roadmaps:get", save: "roadmaps:save", delete: "roadmaps:deleteRoadmap" },
  shareLinks: { create: "shareLinks:create", getByToken: "shareLinks:getByToken", disable: "shareLinks:disable" },
  gamification: {
    addSkill: "gamification:addSkill",
    getSkill: "gamification:getSkill",
    listSkills: "gamification:listSkills",
    updateSkill: "gamification:updateSkill",
    logSession: "gamification:logSession",
    getUserBadges: "gamification:getUserBadges",
    checkAndAwardBadges: "gamification:checkAndAwardBadges",
  },
};
```

---

## Progress

All planned tasks complete (Convex backend, XP/leveling, streaks, 30 badges, icon management + picker, shareable links, gamified UI, ES-modules refactor). Full checklist archived in `docs/references/data-models.md`.
