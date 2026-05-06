# Badge System - Seed Instructions

## Seed Badge Database (One-time Setup)

After deploying the Convex backend, you need to seed the badges table with achievement definitions.

### Method 1: Run Seeding Function (Recommended)

Run this command in the skill-roadmap-site directory:

```bash
npx convex run seedBadges:seedBadges
```

This will populate the database with 30 badges across all tiers (bronze, silver, gold, platinum).

### Method 2: Run Individual Badge Creation

If you want to add a custom badge:

```bash
npx convex run seedBadges:addBadge --args='{
  "name": "My Custom Badge",
  "description": "Custom achievement description",
  "icon": "🏆",
  "tier": "gold",
  "requirementType": "skill_level",
  "requirementValue": 50
}'
```

**Tier options**: bronze, silver, gold, platinum

**Requirement types**:
- skill_level: Reach level X in any skill
- skill_count: Create X total skills
- session_count: Complete X total sessions
- streak_days: Maintain X-day streak
- total_xp: Accumulate X total XP

### Method 3: Check Badge List

View all seeded badges:

```bash
npx convex run seedBadges:listBadges
```

## Badge Categories (30 Total)

### Streak Badges (6)
- First Steps (3 days) - Bronze
- Week Warrior (7 days) - Silver
- Fortnight Fighter (14 days) - Gold
- Monthly Master (30 days) - Gold
- Streak Legend (50 days) - Platinum
- Century Champion (100 days) - Platinum

### Level Badges (6)
- Level 5 Learner - Bronze
- Level 10 Expert - Bronze
- Level 25 Master - Silver
- Level 50 Grandmaster - Gold
- Level 75 Demigod - Platinum
- Level 100 Deity - Platinum

### Session Count Badges (5)
- First Practice (1) - Bronze
- Deca Devotee (10) - Bronze
- Hectic Hundred (100) - Silver
- Session Savant (500) - Gold
- Practice Prophet (1000) - Platinum

### Skill Count Badges (5)
- Skill Sprout (3) - Bronze
- Skill Sapling (5) - Bronze
- Skill Tree (10) - Silver
- Skill Forest (20) - Gold
- Skill Universe (50) - Platinum

### XP Badges (4)
- XP Explorer (1000) - Bronze
- XP Expert (5000) - Silver
- XP Elite (10000) - Gold
- XP Emperor (25000) - Platinum

### Special Badges (4) - Custom logic required
- Early Bird (practice before 7 AM)
- Night Owl (practice after 10 PM)
- Weekend Warrior (weekend practice)
- Consistent Cat (same time daily for 7 days)

## Frontend Badge Features

### Badge Shelf (Sidebar)
- Shows earned badges as icons
- "In Progress" section with progress bars
- Stats: X earned / Y total
- "View All Achievements" button

### Badge Gallery Modal
- Full grid of all badges
- Filter by tier (All/Bronze/Silver/Gold/Platinum)
- Click badge to see details
- Locked badges shown grayed out with progress

### Badge Detail Modal
- Large icon display
- Name, description, tier badge
- Requirement details
- Earned status with date OR
- Progress bar showing current/target
- Lock icon for unearned badges

## Auto-Award System

Badges are automatically checked and awarded:

1. After every XP gain (level up check)
2. After every session log (streak & count check)
3. When checking achievements manually

The system checks all badge requirements and awards any newly qualified badges with a notification.

## Testing Badge Awards

To test badge awarding:

1. Create a skill and add XP to reach level 5
2. You should earn "Level 5 Learner" badge

Or:

1. Log 11 sessions (15min each = 15 XP per session)
2. You should earn "Deca Devotee" badge

Award notifications appear as slide-in toasts and update the badge shelf.
