# Skill Map — Data Models & Progress (Level 2 reference)

> Moved verbatim from `CLAUDE.md` during a progressive-disclosure pass. Read the **Data Models**
> section before changing the roadmap/gamification data layer or the Convex schema. The
> **Progress** section is the historical task record (all complete).

## Data Models

### Roadmap (JSON in `roadmaps.data`)
```js
{
  title: string,
  columns: [
    {
      id: string,       // "col-X"
      name: string,
      lanes: [{ id: string, name: string }]
    }
  ],
  nodes: [
    {
      id: string,       // "n-X"
      columnId: string,
      laneId: string,
      row: number,
      rowSpan: number,
      text: string,
      color: string,
      markers: string[],
      locked: boolean,
      icon: string?,    // NEW: emoji or icon URL
    }
  ],
  edges: [
    { id: string, from: nodeId, to: nodeId, type: EdgeType }
  ],
  colorLegend: { [hex]: label },
  markerLegend: { [key]: label }
}
```

### Skill (Gamification)
```js
{
  id: id("skills"),
  userId: id("users"),
  name: string,
  icon: string,
  category: string?,   // "Meditation", "Fitness", etc.
  xp: number,          // Current XP
  level: number,       // Level 1-100
  createdAt: number,
  updatedAt: number,
}
```

### Streak
```js
{
  id: id("streaks"),
  userId: id("users"),
  skillId: id("skills"),
  currentStreak: number,
  longestStreak: number,
  lastSessionDate: number?, // timestamp
  createdAt: number,
}
```

### Badge
```js
{
  id: id("badges"),
  name: string,
  description: string,
  icon: string,        // emoji
  tier: string,        // "bronze" | "silver" | "gold" | "platinum"
  requirementType: string,
  requirementValue: number,
  createdAt: number,
}
```

---

## Progress

### ✅ All Tasks Complete!
- [x] **Task #1-2:** Convex backend (auth, roadmaps) + gamification models
- [x] **Task #3:** XP & leveling system (bars, animations, level ups, +XP popups)
- [x] **Task #4:** Streak tracking (session logger, calendar view, history, recovery)
- [x] **Task #5:** Badge achievement system (30 badges, auto-awarding, showcase)
- [x] **Task #6:** Icon upload management (admin UI, category management)
- [x] **Task #7:** Icon picker with category search (user-facing modal)
- [x] **Task #8:** Shareable roadmap links (create, toggle, analytics, copy)
- [x] **Task #9:** Gamified UI refresh (header level, celebrations, animations)
- [x] Makefile with dev/prod commands
- [x] ES modules refactor (8 modules: state, render, gamification, sessions, icons, utils, sharing, animations)
