# Skill Roadmap Builder

A gamified personal skill tracker with visual roadmaps, XP/leveling, streaks, achievements, and sharing.

## Live Demo

**https://skillmap.neorgon.com**

## Features

### 🎮 Gamification
- **XP & Leveling**: Gain XP by practicing skills, level up from 1-100
- **Streak Tracking**: Track daily practice streaks with flame icons
- **Achievement Badges**: 30+ badges across 5 categories
- **Visual Progress**: XP bars, level badges, and celebration animations

### 🗺️ Visual Roadmaps
- **Drag & Drop**: Arrange skills in columns and lanes
- **Typed Connections**: Connect skills with relationship types (blocks, informs, enhances, enables, prepares)
- **Color Coding**: Visualize skill categories with custom colors
- **Dependency Locking**: Manually lock/unlock skills based on prerequisites

### 🎨 Customization
- **Icon Picker**: Choose from curated icons organized by category
- **Admin Upload**: Upload custom icons (admin only)
- **Share Links**: Generate read-only share links for your roadmaps
- **Export**: Download as JSON or Markdown

### 👤 User Accounts
- **Simple Auth**: Username/password (first user becomes admin)
- **Cloud Sync**: All data saved to Convex backend
- **Cross-device**: Access from anywhere

## Tech Stack

- **Frontend**: Vanilla JavaScript (ES modules), no build step
- **Backend**: Convex serverless (real-time sync)
- **Storage**: Convex file storage for icons
- **Hosting**: Static HTML + Cloudflare Pages

## Quick Start

```bash
# Install dependencies
npm install

# Run Convex dev server (terminal 1)
make dev

# Run HTTP server (terminal 2)
make serve

# Open http://localhost:8777
```

## Console Commands

```bash
# Deploy to production
make deploy

# Create share link
npx convex run shareLinks:create '{"username": "admin", "roadmapId": "ROADMAP_ID"}'

# Seed badges (run once)
npx convex run seedBadges:seedBadges

# Seed icon categories
npx convex run icons:seedPresetCategories
```

## Project Structure

```
skill-map-site/
├── index.html              # Main app
├── css/
│   └── style.css           # All styles
├── js/                     # ES modules
│   ├── app.js              # Main app logic
│   ├── state.js            # State management
│   ├── render.js           # DOM rendering
│   ├── gamification.js     # XP, levels, badges
│   ├── sessions.js         # Streak tracking
│   ├── icons.js            # Icon management
│   ├── sharing.js          # Share links
│   ├── animations.js       # Celebrations
│   └── utils.js            # Helpers
├── convex/                 # Backend functions
│   ├── auth.ts             # Authentication
│   ├── roadmaps.ts         # Roadmap CRUD
│   ├── gamification.ts     # XP & badges
│   ├── icons.ts            # Icon upload
│   ├── shareLinks.ts       # Sharing
│   └── schema.ts           # Database schema
├── package.json
└── Makefile
```

## API Reference

### Gamification
```javascript
// Gain XP
await gainXP('n-1', 50, 'Practiced for 30min');

// Get user badges
const result = await convex.query(api.gamification.getUserBadges, {
  username: auth.username
});

// Check badge progress
const result = await convex.query(api.gamification.getBadgeProgress, {
  username: auth.username
});
```

### Sharing
```javascript
// Create share link
const result = await convex.mutation(api.shareLinks.create, {
  username: auth.username,
  roadmapId: 'j57ca6ybjd3d5k8mxtb088pax582zwpr'
});

// Load shared roadmap
const result = await convex.query(api.shareLinks.getByToken, {
  token: '2a7yemdbpypepxr1usg1ei'
});
```

## Development

### Adding New Badges
```bash
npx convex run seedBadges:addBadge --args='{
  "name": "My Badge",
  "description": "Custom achievement description",
  "icon": "🏆",
  "tier": "gold",
  "requirementType": "skill_level",
  "requirementValue": 50
}'
```

### Adding New Icon Categories
```javascript
// In convex/icons.ts, add to categories array
const categories = [
  // ... existing categories
  { name: "My Category", description: "Custom category" },
];
```

## License

MIT
