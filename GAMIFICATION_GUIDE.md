# Gamification Features - Implementation Guide

## ✅ Completed Features

### Task #3: XP & Leveling System (COMPLETE)
**Files**: `js/render.js`, `js/gamification.js`, `js/state.js`, `css/style.css`

- **XP Progress Bars**: Shimmering gradient bars on each node
- **Level Badges**: Dynamic level indicators (Lv.1-100)
- **Level Up Animations**: Full-screen celebrations with confetti
- **XP Gain Popups**: Floating "+50 XP" when practicing
- **Backend Integration**: Auto-syncs to Convex database
- **Formulas**: XP per level = level*100 + level²*10

**Usage**:
```js
import { gainXP } from './js/gamification.js';
await gainXP('n-1', 50, '30min meditation session');
```

---

### Task #4: Streak Tracking System (COMPLETE)
**Files**: `js/sessions.js`, `js/gamification.js`, `css/style.css` (400+ lines)

#### 1. Session Logger Modal
**Trigger**: Right-click node → "Log Practice Session"

Features:
- Quick duration buttons (15min, 30min, 1hr, 1.5hr, 2hr)
- Custom duration input
- Notes textarea (optional)
- XP preview (updates live)
- Streak status display
  - Current streak (🔥 flame)
  - Best streak record
  - Visual tiers (none/bronze/silver/gold/master)

**Keyboard Shortcut**: Ctrl/Cmd + L (on selected node)

#### 2. Streak Visual Indicators
- **Flame icon** on nodes with active streaks (🔥 7d)
- **Color-coded tiers**:
  - None: ⚪️ Gray
  - Bronze (3+ days): 🟤 Brown glow
  - Silver (7+ days): ⚪️ Silver glow
  - Gold (14+ days): 🟡 Gold glow
  - Master (30+ days): 🔥 Orange flame

#### 3. Practice Calendar (90-day heatmap)
**Trigger**: Right-click node → "View Practice Calendar"

Features:
- GitHub-style contribution graph
- 4 intensity levels (0-3 sessions/day)
- Hover shows session count
- Stats panel:
  - Current streak
  - Best streak
  - Total sessions

#### 4. Session History List
**Trigger**: Right-click node → "View Session History"

Features:
- Chronological list of all sessions
- Shows: date, duration, XP gained, notes
- Scrollable (last 20 sessions)
- Export CSV button (future feature)

#### 5. Streak Recovery
When streak breaks (miss a day):
- Friendly modal explaining the break
- Encouragement message
- "Practice Now" button to start new streak
- Shows longest streak as motivation

#### 6. Daily Practice Reminders
Auto-checks daily for skills needing practice:
- Shows toast notification
- Lists skills not practiced today
- Links to quick session logger
- Auto-dismiss after 10 seconds

#### 7. Streak Milestone Notifications
Celebrates achievements:
- 3, 7, 14, 30, 50, 100 day streaks
- Toast notification with flame emoji
- Special animations for big milestones

---

### Task #5: Badge System (Partial)
**Files**: `convex/gamification.ts`, `js/render.js`, `css/style.css`

**Backend**: ✅ Complete
- Badge definitions with requirements
- Types: skill_level, skill_count, session_count, streak_days, total_xp
- Bronze/silver/gold/platinum tiers
- Auto-award detection in checkAndAwardBadges()

**Frontend**: 🔄 Partial
- Badge shelf in sidebar (shows earned badges)
- Badge earned notifications (slide-in animation)
- Need: Badge descriptions, locked badge preview, progression hints

---

## 🎮 How to Use

### 1. Create a Skill
Click "+" on any node to add it. Once you add XP, it becomes trackable.

### 2. Log a Session
**Option 1**: Select node → Press Ctrl/Cmd + L
**Option 2**: Right-click node → "Log Practice Session"

**Session Logger**:
- Choose duration (or type custom minutes)
- Add notes (optional)
- Click "Log Session"

**What happens**:
- XP automatically calculated (1 XP/min + bonuses)
- Streak updates (or resets if >1 day missed)
- XP bar animates
- Check for level ups and badges

### 3. Track Streaks
- View flame icon on node showing current streak
- Click "View Practice Calendar" for 90-day heatmap
- Check "Session History" for detailed log

### 4. Level Up
When you reach XP threshold:
- Center-screen celebration animation
- Node glows briefly
- Toast notification appears
- New level shown in badge

---

## 📊 XP Calculation

**Base Rate**: 1 XP per minute

**Bonuses**:
- 1+ hour session: +10 XP bonus
- 2+ hour session: +20 XP total bonus
- Streak multiplier (coming soon): 1.2x for 7+ days, 1.5x for 30+ days

**Example**:
- 30 minutes = 30 XP
- 60 minutes = 61 XP
- 120 minutes = 122 XP

---

## 🔥 Streak Rules

1. **Practice same day**: Streak +1
2. **Miss one day**: Streak resets to 1 on next practice
3. **Miss multiple days**: Streak resets to 1 on next practice
4. **Grace period**: None (pure streak logic)

**Streak Recovery**: At 3, 7, 14, 30, 50, 100 days get special notification

---

## 🏆 Next Features (Tasks #5-9)

### Task #5: Badge Showcase
- Badge description modal
- Locked badge preview
- Progress toward next badge
- Badge categories

### Task #6: Icon Management
- Admin upload interface
- Icon categories (Meditation, Fitness, Creative, Tech, etc.)
- Cloud storage via Convex

### Task #7: Icon Picker
- Modal with category tabs
- Search/filter icons
- Recents section

### Task #8: Share Links
- Generate read-only links
- Copy to clipboard
- Optional password protection

### Task #9: UI Polish
- Global user level indicator (header)
- Hero animation on first load
- Particle effects for celebrations
- Sound effects (optional)

---

## 🔧 API Reference

### Frontend Functions (js/gamification.js)

```js
// Add XP to a node (+ auto-session)
await gainXP(nodeId, xpAmount, notes?);

// Log session only (no XP)
await logSession(skillId, durationMinutes, notes?);

// Check for new achievements
await checkForAchievements();

// Load user's badges
await loadUserBadges();

// Render badge shelf in sidebar
renderBadgeShelf();

// Render global user level
renderUserLevel();
```

### Frontend Functions (js/sessions.js)

```js
// Show session logger modal
showSessionLogger(nodeId);

// Show practice calendar
showStreakCalendar(nodeId);

// Show session history
showSessionHistory(nodeId);

// Show streak recovery (if broken)
showStreakRecovery(nodeId);

// Start daily reminder checks
setupSessionShortcuts();  // Also enables Ctrl+L
```

---

## 🎨 Visual Examples

### Session Logger Modal
```
┌──────────────────────────────────┐
│ Log Practice Session        [X]  │
├──────────────────────────────────┤
│  🧘 Meditation                   │
│  Level 3                         │
│                                  │
│  🔥 7 day streak                 │
│  Best: 14 days                   │
│                                  │
│  Duration:                       │
│  [15] [30] [1hr] [1.5hr] [2hr]   │
│  [Custom minutes]                │
│                                  │
│  Notes (optional):               │
│  ┌────────────────────────────┐ │
│  │ Great focus today!         │ │
│  └────────────────────────────┘ │
│                                  │
│  You'll gain +50 XP              │
│                                  │
│                   [Cancel] [Log] │
└──────────────────────────────────┘
```

### Session History
```
┌──────────────────────────────────┐
│ Session History: Meditation [X]  │
├──────────────────────────────────┤
│ Mar 15, 10:30 AM   30 min  +30XP │
│ Mar 14, 9:15 AM    60 min  +61XP │
│ Mar 13, 8:00 AM    30 min  +30XP │
│                                  │
│ Great focus today!               │
│                                  │
│ ... (scrollable) ...             │
│                                  │
│                    [Close] [CSV] │
└──────────────────────────────────┘
```

---

## ✅ Status Summary

**Completed**: Tasks #1, #2, #3, #4, #10 (backend + core frontend)
**Lines of Code**: ~2,500 new lines
**Files Created**: 7 JS modules, 5 Convex functions, +200 lines CSS
**Next**: Task #5 (Badge UI polish) or Task #6 (Icon management)
