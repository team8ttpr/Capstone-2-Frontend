# Mobile-First Responsive Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make Spotter usable and polished on phones (≤768px) without changing the desktop experience, matching the existing visual style.

**Architecture:** A single `max-width: 768px` breakpoint. Below it, the desktop top `NavBar` and the `MiniDrawer` sidebars are hidden via CSS and replaced by a new `MobileNav` (app bar + slide-out drawer) and a `SubTabs` pill strip; every fixed-width / multi-column layout is made fluid and single-column with media queries in the existing per-screen CSS files. The profile must stay theme-aware (no hardcoded colors). Above 768px nothing changes.

**Tech Stack:** React 19, React Router 7, plain CSS (per-component files), MUI icons, webpack dev server. Verification via `puppeteer-core` driving the already-installed Chrome.

Design spec: `docs/superpowers/specs/2026-06-12-mobile-first-redesign-design.md`. Locked prototypes live in the design session (dashboard, feed, profile, messages, AI, sub-tabs) and are the visual source of truth.

---

## File structure

- **Create** `scripts/mobile-check.js` — puppeteer verification harness (dev only).
- **Create** `src/components/MobileNav.jsx` + `src/style/MobileNav.css` — mobile app bar + drawer.
- **Create** `src/components/SubTabs.jsx` + `src/style/SubTabs.css` — sub-nav pill strip.
- **Modify** `src/App.jsx` — render `MobileNav` and route-aware `SubTabs`.
- **Modify** CSS (add `@media (max-width: 768px)` blocks): `NavBarStyles.css`, `MiniDrawer.css`, `GenreCharts.css`, `Profile.css`, `PostCard.css`, `messages.css`, `GenerateUI.css`, `TopArtist.css`, `TopTracks.css`, `MyPlaylist.css`, `Login.css`, `SinglePostView.css`, plus `Analytics`/feed styles as needed.

---

## Task 1: Verification harness

**Files:**
- Create: `scripts/mobile-check.js`
- Modify: `package.json` (devDependencies + script)

- [ ] **Step 1: Install puppeteer-core**

Run: `npm install -D puppeteer-core`
Expected: adds `puppeteer-core` to `devDependencies`.

- [ ] **Step 2: Create the harness**

Create `scripts/mobile-check.js`:

```js
// Usage: node scripts/mobile-check.js <path> [selectorThatMustExist]
// Loads http://localhost:3000<path> at iPhone width and fails if the page
// scrolls horizontally or the required selector is missing. Sets guestMode so
// auth-gated pages render with demo data.
const puppeteer = require("puppeteer-core");

const CHROME =
  process.env.CHROME_PATH ||
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const path = process.argv[2] || "/";
const mustExist = process.argv[3] || null;
const BASE = process.env.BASE_URL || "http://localhost:3000";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: "new",
    args: ["--no-sandbox"],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await page.goto(BASE + "/", { waitUntil: "networkidle2", timeout: 45000 });
  await page.evaluate(() => localStorage.setItem("guestMode", "1"));
  await page.goto(BASE + path, { waitUntil: "networkidle2", timeout: 45000 });
  await sleep(2500);
  const r = await page.evaluate((sel) => ({
    overflowsX: document.documentElement.scrollWidth > window.innerWidth + 2,
    docWidth: document.documentElement.scrollWidth,
    inner: window.innerWidth,
    sel: sel ? !!document.querySelector(sel) : true,
  }), mustExist);
  await browser.close();
  const ok = !r.overflowsX && r.sel;
  console.log(JSON.stringify({ path, ...r, PASS: ok }));
  process.exit(ok ? 0 : 1);
})().catch((e) => { console.error("ERR:", e.message); process.exit(2); });
```

- [ ] **Step 3: Add npm script**

In `package.json` `scripts`, add: `"mobile-check": "node scripts/mobile-check.js"`.

- [ ] **Step 4: Verify the harness runs**

Start the dev server (`npm run start-dev`) in another terminal, then run:
`node scripts/mobile-check.js /auth`
Expected: prints JSON. (The auth page may already overflow — that's fine; we just need the harness to run and print, exit code non-zero is OK here.)

- [ ] **Step 5: Commit**

```bash
git add scripts/mobile-check.js package.json package-lock.json
git commit -m "chore: add mobile-width verification harness"
```

---

## Task 2: Breakpoint — hide desktop chrome on mobile

**Files:**
- Modify: `src/style/NavBarStyles.css` (append)
- Modify: `src/style/MiniDrawer.css` (append)

- [ ] **Step 1: Hide the desktop NavBar ≤768px**

Append to `src/style/NavBarStyles.css`:

```css
@media (max-width: 768px) {
  .navbar { display: none; }
}
```

- [ ] **Step 2: Hide the MiniDrawer and reset the content offsets ≤768px**

Append to `src/style/MiniDrawer.css`:

```css
@media (max-width: 768px) {
  .dashboard-drawer { display: none; }
  .dashboard-layout { display: block; --sidebar-width: 0px; }
  .dashboard-main-content {
    margin-left: 0;
    margin-top: 0;
    padding: 16px;
    min-height: auto;
  }
}
```

- [ ] **Step 3: Verify build compiles**

Run: `npm run build`
Expected: "compiled" (warnings about bundle size are pre-existing and OK).

- [ ] **Step 4: Commit**

```bash
git add src/style/NavBarStyles.css src/style/MiniDrawer.css
git commit -m "feat(mobile): hide desktop navbar and sidebar below 768px"
```

---

## Task 3: MobileNav (app bar + drawer)

**Files:**
- Create: `src/components/MobileNav.jsx`
- Create: `src/style/MobileNav.css`
- Modify: `src/App.jsx`

- [ ] **Step 1: Create `src/components/MobileNav.jsx`**

```jsx
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Menu as MenuIcon,
  Close,
  Analytics,
  ChatBubble,
  AutoAwesome,
  Person,
  Logout,
} from "@mui/icons-material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import "../style/MobileNav.css";

const LOGO =
  "https://res.cloudinary.com/di9wb90kg/image/upload/v1755882970/logoWhite_tjqsw6.png";

// Top-level destinations. AI is hidden for guests (needs real Spotify).
const buildItems = (guest) => {
  const items = [
    { label: "Dashboard", path: "/dashboard", icon: <Analytics /> },
    { label: "Social", path: "/social", icon: <ChatBubble /> },
  ];
  if (!guest) items.push({ label: "AI Playlist", path: "/ai", icon: <AutoAwesome /> });
  items.push({ label: "My Profile", path: "/profile", icon: <Person /> });
  return items;
};

export default function MobileNav({ user, guest = false, onLogout }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const items = buildItems(guest);
  const close = () => setOpen(false);

  return (
    <>
      <div className="mobile-nav">
        <button className="mn-burger" aria-label="Menu" onClick={() => setOpen(true)}>
          <MenuIcon />
        </button>
        <Link to="/" className="mn-brand" onClick={close}>
          <img src={LOGO} alt="Spotter" />
        </Link>
        {user && (
          <Link to="/social/notifications" className="mn-bell" aria-label="Notifications">
            <NotificationsIcon />
          </Link>
        )}
      </div>

      {open && <div className="mn-scrim" onClick={close} />}
      <aside className={`mn-drawer ${open ? "open" : ""}`}>
        <div className="mn-drawer-head">
          <div className="mn-avatar" />
          <div>
            <div className="mn-user">{user ? user.username : "Guest"}</div>
            <div className="mn-status">{guest ? "Browsing Spotter" : "Connected"}</div>
          </div>
          <button className="mn-close" aria-label="Close" onClick={close}>
            <Close />
          </button>
        </div>
        <hr className="mn-divider" />
        {items.map((it) => (
          <Link
            key={it.path}
            to={it.path}
            onClick={close}
            className={`mn-item ${location.pathname.startsWith(it.path) ? "active" : ""}`}
          >
            <span className="mn-ic">{it.icon}</span>
            <span className="mn-label">{it.label}</span>
          </Link>
        ))}
        <button
          className="mn-item mn-logout"
          onClick={() => { close(); onLogout && onLogout(); }}
        >
          <span className="mn-ic"><Logout /></span>
          <span className="mn-label">{guest ? "Exit guest mode" : "Log out"}</span>
        </button>
      </aside>
    </>
  );
}
```

- [ ] **Step 2: Create `src/style/MobileNav.css`**

```css
.mobile-nav { display: none; }

@media (max-width: 768px) {
  .mobile-nav {
    display: flex;
    align-items: center;
    gap: 14px;
    height: 56px;
    padding: 0 14px;
    background: linear-gradient(90deg, #1db954 0%, #181c1f 100%);
    border-bottom: 2px solid #1db954;
    position: sticky;
    top: 0;
    z-index: 200;
  }
}

.mn-burger, .mn-close { background: none; border: none; color: #fff; display: flex; cursor: pointer; padding: 4px; }
.mn-brand img { height: 34px; display: block; }
.mn-bell { margin-left: auto; color: #fff; display: flex; }

.mn-scrim { position: fixed; inset: 0; background: rgba(0,0,0,.55); z-index: 250; }
.mn-drawer {
  position: fixed; top: 0; left: 0; bottom: 0; width: 78%; max-width: 300px;
  background: linear-gradient(135deg, #181c1f 60%, #23272a 100%);
  border-right: 1px solid #1db954; box-shadow: 0 2px 8px rgba(29,185,84,.12);
  z-index: 260; transform: translateX(-100%); transition: transform .25s ease;
  display: flex; flex-direction: column; padding-top: 8px;
}
.mn-drawer.open { transform: translateX(0); }
.mn-drawer-head { display: flex; align-items: center; gap: 12px; padding: 14px 16px; }
.mn-avatar { width: 42px; height: 42px; border-radius: 50%; background: linear-gradient(135deg,#1db954,#14532d); border: 2px solid #1db954; }
.mn-user { font-weight: 700; color: #fff; }
.mn-status { font-size: .76rem; color: #b6ffb6; }
.mn-close { margin-left: auto; color: #9fb8a6; }
.mn-divider { border: none; border-top: 1px solid #2a2f33; margin: 4px 0 8px; }
.mn-item {
  display: flex; align-items: center; min-height: 48px; padding: 0 20px; margin: 2px 8px;
  border-radius: 8px; color: #e6e6e6; text-decoration: none; background: none; border: none;
  font: inherit; cursor: pointer; width: calc(100% - 16px);
}
.mn-ic { margin-right: 22px; display: flex; color: #1db954; }
.mn-label { font-size: 14px; }
.mn-item.active { background: #1db95444; color: #fff; }
.mn-item.active .mn-ic { color: #fff; }
.mn-item.active .mn-label { font-weight: 600; }
.mn-logout .mn-ic { color: #ff8a65; }
```

- [ ] **Step 3: Render MobileNav in `src/App.jsx`**

Add import near the other component imports:
```jsx
import MobileNav from "./components/MobileNav";
```
Replace the existing NavBar render block:
```jsx
      {!hideNavBar && (
        <NavBar user={user} onLogout={handleLogout} guest={isGuest} />
      )}
```
with:
```jsx
      {!hideNavBar && (
        <>
          <NavBar user={user} onLogout={handleLogout} guest={isGuest} />
          <MobileNav user={user} onLogout={handleLogout} guest={isGuest} />
        </>
      )}
```

- [ ] **Step 4: Verify build + drawer renders**

Run: `npm run build` → expect "compiled".
Then with the dev server running: `node scripts/mobile-check.js /social/feed .mobile-nav`
Expected: JSON with `"sel": true` and `"PASS": true` (mobile-nav present, no horizontal overflow on feed yet — feed gets its own task; if it overflows now, note it and continue, it's fixed in Task 7).

- [ ] **Step 5: Commit**

```bash
git add src/components/MobileNav.jsx src/style/MobileNav.css src/App.jsx
git commit -m "feat(mobile): add MobileNav app bar + slide-out drawer"
```

---

## Task 4: SubTabs pill strip

**Files:**
- Create: `src/components/SubTabs.jsx`
- Create: `src/style/SubTabs.css`
- Modify: `src/App.jsx`

- [ ] **Step 1: Create `src/components/SubTabs.jsx`**

```jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../style/SubTabs.css";

const GROUPS = {
  dashboard: [
    { label: "Analytics", path: "/dashboard/analytics" },
    { label: "Top Tracks", path: "/dashboard/toptracks" },
    { label: "Top Artist", path: "/dashboard/topartist" },
    { label: "My Playlist", path: "/dashboard/myplaylist" },
  ],
  social: [
    { label: "Feed", path: "/social/feed" },
    { label: "Friends", path: "/social/friends" },
    { label: "Messages", path: "/social/messages" },
    { label: "My Posts", path: "/social/mypost" },
    { label: "Notifications", path: "/social/notifications" },
  ],
};

// Renders the mobile sub-nav for a section, or nothing if the route isn't in a group.
export default function SubTabs() {
  const location = useLocation();
  const group = location.pathname.startsWith("/dashboard")
    ? "dashboard"
    : location.pathname.startsWith("/social")
    ? "social"
    : null;
  if (!group) return null;
  return (
    <nav className="subtabs">
      {GROUPS[group].map((t) => (
        <Link
          key={t.path}
          to={t.path}
          className={`subtab ${location.pathname === t.path ? "active" : ""}`}
        >
          {t.label}
        </Link>
      ))}
    </nav>
  );
}
```

- [ ] **Step 2: Create `src/style/SubTabs.css`**

```css
.subtabs { display: none; }

@media (max-width: 768px) {
  .subtabs {
    display: flex;
    gap: 8px;
    overflow-x: auto;
    padding: 10px 14px;
    background: #11160f;
    border-bottom: 1px solid #1c2f27;
    position: sticky;
    top: 56px;
    z-index: 190;
  }
  .subtabs::-webkit-scrollbar { display: none; }
}
.subtab {
  flex: 0 0 auto; color: #e0ffe0; background: rgba(29,185,84,.10);
  padding: 8px 15px; border-radius: 25px; font-weight: 600; font-size: .85rem;
  white-space: nowrap; text-decoration: none;
}
.subtab.active { background: #1db954; color: #06210f; }
```

- [ ] **Step 3: Render SubTabs in `src/App.jsx`**

Add import:
```jsx
import SubTabs from "./components/SubTabs";
```
Render it right after the nav block (after the `MobileNav` fragment, before `<div className="app">`):
```jsx
      {!hideNavBar && <SubTabs />}
```

- [ ] **Step 4: Verify**

Run: `npm run build` → "compiled".
With dev server: `node scripts/mobile-check.js /dashboard/analytics .subtabs`
Expected: `"sel": true` (sub-tabs present on dashboard). And `node scripts/mobile-check.js /profile .subtabs` → `"sel": false` (no sub-tabs off-section), `"PASS"` depends on overflow (profile fixed in Task 8).

- [ ] **Step 5: Commit**

```bash
git add src/components/SubTabs.jsx src/style/SubTabs.css src/App.jsx
git commit -m "feat(mobile): add sub-nav pill strip for dashboard/social"
```

---

## Task 5: Dashboard / Analytics responsive

**Files:**
- Modify: `src/pages/Analytics.jsx` (the inline flex row)
- Modify: `src/style/GenreCharts.css` (append)

- [ ] **Step 1: Make the genres+recommendations row stack ≤768px**

In `src/pages/Analytics.jsx`, the row uses an inline style `display:'flex'`. Add a class so CSS can override it. Change the wrapping `<div style={{ display: 'flex', gap: '1rem', ... }}>` to also carry a className:
```jsx
<div className="dash-split" style={{ display: 'flex', gap: '1rem', alignItems: 'stretch', flexWrap: 'wrap', minHeight: '0' }}>
```

- [ ] **Step 2: Append responsive rules to `src/style/GenreCharts.css`**

```css
@media (max-width: 768px) {
  .dash-split { flex-direction: column; }
  .genre-charts-container { width: 100%; padding: 1rem; }
  .genre-chart-canvas-wrap { width: 100%; max-width: 320px; height: 300px; }
  .recommendations-day-ipod { width: 100% !important; }
  .recommendations-day-ipod-screen { width: 100% !important; }
}
```

- [ ] **Step 3: Verify**

Run: `npm run build` → "compiled".
`node scripts/mobile-check.js /dashboard/analytics canvas`
Expected: `"PASS": true`, `"sel": true` (chart renders, no horizontal overflow).

- [ ] **Step 4: Commit**

```bash
git add src/pages/Analytics.jsx src/style/GenreCharts.css
git commit -m "feat(mobile): stack dashboard analytics on small screens"
```

---

## Task 6: Top Tracks / Artists / Playlists responsive

**Files:**
- Modify: `src/style/TopArtist.css`, `src/style/TopTracks.css`, `src/style/MyPlaylist.css` (append to each)

- [ ] **Step 1: Append responsive grid rules**

Append to `src/style/TopArtist.css`:
```css
@media (max-width: 768px) {
  .artists-embed-list { grid-template-columns: 1fr 1fr; gap: 12px; }
  .header-section h1 { font-size: 1.6rem; }
}
```
Append to `src/style/TopTracks.css`:
```css
@media (max-width: 768px) {
  .tracks-embed-list { grid-template-columns: 1fr; gap: 12px; }
  .header-section h1 { font-size: 1.6rem; }
}
```
Append to `src/style/MyPlaylist.css`:
```css
@media (max-width: 768px) {
  .playlists-embed-list { grid-template-columns: 1fr; gap: 14px; }
  .header-section h1 { font-size: 1.6rem; }
}
```
(If the real list class names differ, open each file and match the existing grid container's class — the rule is: single/two-column grid, reduced gap, smaller heading ≤768px.)

- [ ] **Step 2: Verify each**

Run `npm run build` → "compiled". Then:
`node scripts/mobile-check.js /dashboard/topartist` → `"PASS": true`
`node scripts/mobile-check.js /dashboard/toptracks` → `"PASS": true`
`node scripts/mobile-check.js /dashboard/myplaylist` → `"PASS": true`

- [ ] **Step 3: Commit**

```bash
git add src/style/TopArtist.css src/style/TopTracks.css src/style/MyPlaylist.css
git commit -m "feat(mobile): responsive grids for top tracks/artists/playlists"
```

---

## Task 7: Feed / PostCard responsive

**Files:**
- Modify: `src/style/PostCard.css` (append)

- [ ] **Step 1: Append responsive rules to `src/style/PostCard.css`**

```css
@media (max-width: 768px) {
  .concept-post-card { padding: 16px; border-radius: 20px; }
  .concept-main-content { flex-direction: column; gap: 14px; }
  .post-text-section, .spotify-section { width: 100%; height: auto; }
  .post-text-container { height: auto; max-height: 220px; }
  .spotify-section { height: auto; }
  .spotify-embed-container iframe { height: 152px !important; }
  .post-title { font-size: 1.2rem; }
  .concept-post-footer { flex-wrap: wrap; gap: 10px; }
  .concept-actions { gap: 10px; }
}
```

- [ ] **Step 2: Verify**

Run `npm run build` → "compiled".
`node scripts/mobile-check.js /social/feed` → `"PASS": true`

- [ ] **Step 3: Commit**

```bash
git add src/style/PostCard.css
git commit -m "feat(mobile): stack post cards (text over embed) on small screens"
```

---

## Task 8: Profile responsive (theme-aware)

**Files:**
- Modify: `src/style/Profile.css` (append)

> Do NOT hardcode colors here — the profile is themed at runtime via inline
> `currentTheme` styles. These rules only change layout/sizing/position.

- [ ] **Step 1: Append responsive rules to `src/style/Profile.css`**

```css
@media (max-width: 768px) {
  .profile-container { max-width: 100%; padding: 0; border-radius: 0; }
  .profile-cover { height: 130px; padding: 1rem; }
  .profile-avatar { width: 88px; height: 88px; margin-bottom: -44px; }
  .profile-info { padding: 3rem 1.1rem 1.5rem; }
  .display-name { font-size: 1.6rem; }

  /* Floating FAB column -> horizontal scrollable row pinned under the app bar */
  .profile-action-buttons {
    position: sticky;
    top: 56px;
    left: 0;
    flex-direction: row;
    overflow-x: auto;
    gap: 0.5rem;
    padding: 10px 14px;
    background: rgba(0,0,0,0.25);
    z-index: 180;
  }
  .profile-action-buttons::-webkit-scrollbar { display: none; }
  .circular-action-btn { width: 44px; height: 44px; flex: 0 0 44px; }
  .circular-action-btn:hover { width: 44px; border-radius: 50%; padding-left: 15px; }
  .circular-action-btn .btn-tooltip { display: none; }

  .profile-stats { gap: 0; }
  .spotify-items-list iframe { width: 100% !important; }
}
```

- [ ] **Step 2: Verify (guest sees the locked card; check a real profile via public route)**

Run `npm run build` → "compiled".
`node scripts/mobile-check.js /profile` → expect no horizontal overflow (`"PASS": true`; guest shows the locked card, which must also not overflow).
Manual: with the dev server, set a real `authToken` in localStorage and load `/profile` at 390px in devtools — confirm the themed card, action-button row, stats, and embeds all fit and the theme colors are intact.

- [ ] **Step 3: Commit**

```bash
git add src/style/Profile.css
git commit -m "feat(mobile): responsive, theme-preserving profile layout"
```

---

## Task 9: Messages responsive

**Files:**
- Modify: `src/style/messages.css` (append)

- [ ] **Step 1: Append responsive rules to `src/style/messages.css`**

```css
@media (max-width: 768px) {
  .messages-theme .message-bubble { max-width: 80%; }
  /* Full-height thread with pinned composer below the app bar + sub-tabs */
  .messages-theme .message-thread { height: calc(100vh - 56px - 56px); }
  .messages-theme .message-input { position: sticky; bottom: 0; }
}
```

> If the existing Messages layout shows a friend-list + thread split, the mobile
> rule is: show one pane at a time. If the current markup already swaps panes on
> selection, no JS change is needed; if not, that is handled in execution by
> conditionally rendering the list OR the thread based on a `selectedFriend`
> state at ≤768px. Confirm against `src/pages/messages.jsx` during execution.

- [ ] **Step 2: Verify**

Run `npm run build` → "compiled".
`node scripts/mobile-check.js /social/messages` → `"PASS": true`

- [ ] **Step 3: Commit**

```bash
git add src/style/messages.css
git commit -m "feat(mobile): full-height message thread with pinned composer"
```

---

## Task 10: AI chat re-theme to dark + responsive

**Files:**
- Modify: `src/style/GenerateUI.css`

> The current AI chat is a light/blue theme that clashes with the app. Re-theme
> it to the dark Spotter palette (matches Messages) for ALL widths, then add
> mobile sizing.

- [ ] **Step 1: Re-theme the chat colors**

In `src/style/GenerateUI.css`, update the active (non-commented) rules:
- `.chat-header` → `background-color: #191414;`
- `.messages-container` → `background-color: #191414;`
- `.message-bubble` → base `background: #282828; color: #fff;`
- `.ai-message` → `background-color: #282828; border: 1px solid #2a2a2a; color: #fff;`
- `.user-message` → `background: #1db954; color: #191414;`
- `.input-container` → `background-color: #282828; border-top: 1px solid #2a2a2a;`
- `.input-container textarea` → `background-color: #232323; color: #fff; border: 1px solid #2a2a2a;`

- [ ] **Step 2: Append mobile sizing**

```css
@media (max-width: 768px) {
  .chat-container { width: 100vw; height: calc(100vh - 56px); max-width: 100%; border-radius: 0; top: auto; left: auto; transform: none; position: static; }
  .message-bubble { max-width: 88%; }
}
```

- [ ] **Step 3: Verify**

Run `npm run build` → "compiled".
`node scripts/mobile-check.js /ai` → `"PASS": true` (note: `/ai` is Spotify-guarded; if it redirects for guest, verify manually with a real token at 390px instead, confirming dark bubbles).

- [ ] **Step 4: Commit**

```bash
git add src/style/GenerateUI.css
git commit -m "feat(mobile): re-theme AI chat to dark Spotter style + responsive"
```

---

## Task 11: Login, Single Post, Friends, Notifications

**Files:**
- Modify: `src/style/Login.css`, `src/style/SinglePostView.css` (append). Friends/Notifications use shared styles already covered (post cards, lists) — verify and patch only if they overflow.

- [ ] **Step 1: Login two-panel → stacked**

Append to `src/style/Login.css`:
```css
@media (max-width: 768px) {
  .login-container { flex-direction: column; }
  .auth-panel { width: 100%; }
  .carousel-panel { display: none; }
}
```
(Match the real container/panel class names in `Login.jsx`; the rule is: stack to one column and hide the decorative carousel on phones.)

- [ ] **Step 2: Single post fluid**

Append to `src/style/SinglePostView.css`:
```css
@media (max-width: 768px) {
  .single-post-view, .single-post-container { padding: 12px; }
}
```
(Match the real top-level container class in `SinglePostView.jsx`.)

- [ ] **Step 3: Verify**

Run `npm run build` → "compiled". Then:
`node scripts/mobile-check.js /auth` → `"PASS": true`
`node scripts/mobile-check.js /social/friends` → `"PASS": true`
`node scripts/mobile-check.js /social/notifications` → `"PASS": true`
For single post, use a real post id: `node scripts/mobile-check.js /post/<id>` → `"PASS": true`

- [ ] **Step 4: Commit**

```bash
git add src/style/Login.css src/style/SinglePostView.css
git commit -m "feat(mobile): responsive login, single post, friends, notifications"
```

---

## Task 12: Full verification sweep + desktop regression

**Files:** none (verification only)

- [ ] **Step 1: Run mobile checks for every route**

With the dev server running, run `node scripts/mobile-check.js <path>` for each and confirm `"PASS": true`:
`/`, `/auth`, `/dashboard/analytics`, `/dashboard/toptracks`, `/dashboard/topartist`, `/dashboard/myplaylist`, `/social/feed`, `/social/friends`, `/social/messages`, `/social/mypost`, `/social/notifications`, `/profile`.

- [ ] **Step 2: Desktop regression check**

In a browser at ≥1000px width, click through the same routes. Confirm the desktop `NavBar` + `MiniDrawer` are unchanged and `MobileNav`/`SubTabs` are NOT visible.

- [ ] **Step 3: Production build**

Run: `npm run build` → "compiled" with no errors.

- [ ] **Step 4: Final commit (if any cleanup)**

```bash
git add -A
git commit -m "test(mobile): verify all routes responsive, desktop unchanged"
```

---

## Notes for the implementer

- The locked prototypes (dashboard, feed, profile, messages, AI, sub-tabs) are the visual target. When a media-query rule's exact selector is uncertain, open the page's JSX, find the real class name, and apply the same intent (fluid width, single column, ≥44px touch targets).
- Never hardcode colors on the profile — it's themed at runtime.
- Keep every change behind `@media (max-width: 768px)` except the AI-chat re-theme (Task 10 Step 1), which applies at all widths by design.
- Commit after each task so regressions are easy to bisect.
