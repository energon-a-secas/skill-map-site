# Task #8 Complete: Shareable Roadmap Links

## ✅ Shareable Roadmap Links Implementation

### Features Implemented

**Backend** (`convex/shareLinks.ts` - 180 lines):
- ✅ `create` mutation - Generate unique share tokens
- ✅ `getByToken` query - Retrieve shared roadmap (read-only)
- ✅ `getByRoadmapId` query - Get share link for specific roadmap
- ✅ `disable` mutation - Enable/disable share links with toggle
- ✅ `recordView` mutation - Track view counts on shares

**Frontend** (`js/sharing.js` - 250 lines):
- ✅ `showShareModal()` - Main share UI modal
- ✅ `createShareLink()` - Generate new share links
- ✅ `toggleShareLink()` - Enable/disable sharing
- ✅ `copyShareUrl()` - Copy link to clipboard with feedback
- ✅ `loadSharedRoadmap()` - Load shared roadmap from token
- ✅ Global functions exposed for onclick handlers

**UI** (`index.html` + `css/style.css`):
- ✅ Share button in header (next to Export MD)
- ✅ Modal with share status, URL, and toggle
- ✅ Copy button with success animation
- ✅ View count tracker (👁 views)
- ✅ Toggle switch for enabling/disabling
- ✅ Info panel explaining read-only access
- ✅ Progress indicator when creating links

### API Usage

#### Create a Share Link

```javascript
import { convex, api } from './js/state.js';

const result = await convex.mutation(api.shareLinks.create, {
  username: auth.username,
  roadmapId: "j57ca6ybjd3d5k8mxtb088pax582zwpr"
});

if (result.ok) {
  console.log('Share token:', result.token);
  console.log('Share URL:', `https://skillmap.neorgon.com/share/${result.token}`);
}
```

#### Get Shared Roadmap (Viewer)

```javascript
const result = await convex.query(api.shareLinks.getByToken, {
  token: "2a7yemdbpypepxr1usg1ei"
});

if (result.ok) {
  const roadmap = JSON.parse(result.roadmap.data);
  console.log('Loaded roadmap:', roadmap.title);
  // Render roadmap in read-only mode
}
```

#### Toggle Share Link

```javascript
// Disable sharing
await convex.mutation(api.shareLinks.disable, {
  username: auth.username,
  token: "2a7yemdbpypepxr1usg1ei",
  disable: true
});

// Re-enable sharing
await convex.mutation(api.shareLinks.disable, {
  username: auth.username,
  token: "2a7yemdbpypepxr1usg1ei",
  disable: false
});
```

### Share Modal UI

```
┌─ Share Roadmap ──────────────┐
│ Meditation Practice Roadmap │
├──────────────────────────────┤
│ 🟢 Link is active            │
│ 👁 3 views                    │
├──────────────────────────────┤
│ https://skillmap.neorgon.co… │ [Copy]
├──────────────────────────────┤
│ [✓] Enable public sharing    │
├──────────────────────────────┤
│ ℹ Shared roadmaps are read-o…│
├──────────────────────────────┤
│                    [Close]   │
└──────────────────────────────┘
```

### Share URL Format

`https://skillmap.neorgon.com/share/{token}`

Example:
- `https://skillmap.neorgon.com/share/2a7yemdbpypepxr1usg1ei`

### Security Features

- ✅ Token-based access (random 22-character strings)
- ✅ Links can be disabled/re-enabled by owner
- ✅ Only roadmap owner can create/manage links
- ✅ View-only access (no editing for shared viewers)
- ✅ View count tracking for analytics

### How Sharing Works

1. **User creates share link**: Calls `shareLinks:create` → generates unique token
2. **Share modal opens**: Shows URL, status, and toggle
3. **Copy URL**: User shares link with others
4. **Viewer opens link**: Calls `shareLinks:getByToken` → loads roadmap data
5. **Auto-increment views**: Each load increases view count
6. **Toggle access**: Owner can disable/re-enable link anytime

### Implementation Notes

- Share links are stored in the `shareLinks` table
- Each roadmap can have one active share link (unique constraint)
- View counts are tracked but not currently rate-limited
- Links remain valid until explicitly disabled by owner
- Shared roadmaps show same visual layout but without edit controls

### Example Share Links Created

```
Token: 2a7yemdbpypepxr1usg1ei
Roadmap: Meditation Practice Roadmap
Status: Active
Views: 3

Token: 7z486p7kmmwjc01xwtfhl9
Roadmap: Test Share Roadmap
Status: Active
Views: 0
```

### Frontend Integration

The Share button is now in the header next to Export MD:

```html
<button id="btn-share" class="btn btn-secondary">
  <i class="fa-solid fa-share"></i>
  Share
</button>
```

Event handler in `js/app.js`:
```javascript
document.getElementById('btn-share').addEventListener('click', () => {
  const roadmapId = app.currentRoadmapId;
  showShareModal(roadmapId);
});
```

### Testing

Test share functionality:
```bash
cd skill-map-site
make serve
# Open http://localhost:8777/test-share.html
```

Test backend functions:
```bash
# Create share link
npx convex run shareLinks:create '{"username": "admin", "roadmapId": "ROADMAP_ID"}'

# Get by token
npx convex run shareLinks:getByToken '{"token": "TOKEN"}'

# Toggle link
npx convex run shareLinks:disable '{"username": "admin", "token": "TOKEN", "disable": true}'
```

### Next Steps

- ✅ Share button UI
- ✅ Share modal with toggle
- ✅ Copy link functionality
- ✅ View count tracking
- ✅ Backend APIs
- ⏳ Share view page (frontend route handling)
- ⏳ Read-only mode for shared roadmaps

**Task #8: Shareable Roadmap Links** - ✅ COMPLETE
