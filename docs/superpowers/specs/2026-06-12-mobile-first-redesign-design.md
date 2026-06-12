# Spotter — Mobile-First Responsive Redesign

## Goal

Make Spotter genuinely usable and polished on phones, while keeping the existing
desktop visual style (Raleway, dark-green theme, current component looks). The
desktop layout stays unchanged above the breakpoint — this is additive, not a
desktop redesign.

## Approach (validated with browser prototypes)

A mobile-first redesign, not a shrink-to-fit. Direction was validated with
interactive HTML prototypes (dashboard, feed, profile, messages, AI playlist).
Decisions confirmed:

- **Navigation:** a single slide-out **hamburger drawer** replaces the desktop
  top `NavBar` links and the `MiniDrawer` sidebars on mobile. Styled to match the
  existing `MiniDrawer` (dark `#181c1f→#23272a` gradient, green right border,
  `#1db954` MUI icons, `#1db95444` active highlight).
- **No new visual language.** Reuse the existing colors, fonts (Raleway),
  borders, gradients, pill section headings, panels, post cards, and bubbles.
- **No emojis** anywhere in the UI; MUI-style line icons only.
- Every fixed-width, multi-column desktop layout becomes single-column, fluid,
  full-width, with ≥44px touch targets.

## Breakpoint

Single breakpoint: **`max-width: 768px`** = mobile. At/above 768px the current
desktop layout is untouched. All mobile rules live behind this media query.

## Navigation architecture

- **New `MobileNav` component** (app bar + drawer), rendered only ≤768px via CSS;
  the desktop `NavBar` is hidden ≤768px.
  - App bar: hamburger (left), white Spotter logo (`logoWhite`), bell (right) —
    same green→dark gradient bar as `.navbar`.
  - Drawer: profile row, then top-level destinations — Dashboard, Social,
    AI Playlist, My Profile, Log out. Guests see the guest subset (Dashboard,
    Social, My Profile) plus "Create an account", matching current guest rules.
- **Sub-navigation** (Dashboard's Analytics / Top Tracks / Top Artist /
  My Playlist; Social's Feed / Friends / Messages / My Posts / Notifications):
  the desktop `MiniDrawer` sidebar is hidden ≤768px and replaced by a
  **horizontal, scrollable pill-tab strip** directly under the app bar.
  `.dashboard-main-content`'s `margin-left` is removed ≤768px.
  - The pill strip is prototyped for both the Dashboard and Social groups
    (sticky under the app bar, scrolls horizontally when tabs overflow).
    Alternative considered: expandable sub-sections inside the drawer (rejected —
    buries sub-pages behind two taps).
- **Chat views** (Messages, AI Playlist): contextual header (back + title),
  scrolling thread, bottom-pinned composer.

## Per-screen changes

| Screen | Desktop today | Mobile change |
|---|---|---|
| Dashboard / Analytics | 2-col genres+recs flex row, fixed 340/420px panels | stack to 1 col; chart panel full-width with legend; history is a horizontal scroll row (done); compact `DemoBanner` |
| Top Tracks / Artists / Playlists | grids behind sidebar | drop sidebar margin; `repeat(auto-fill, minmax(…))` grid; skeletons already in place |
| Feed | post cards max-width 1000px, text + embed side-by-side | full-width cards; stack text over embed; action buttons wrap; search full-width |
| Profile | **user-themed** card (e.g. sakura/pink), wallpaper cover, overlapping avatar, floating circular action buttons (Edit/View/Copy/Theme/Stickers/Add-Music), meta (Joined, Connected to Spotify), stats in posts/following/followers order, featured Spotify embeds; posts open in a **modal** (no inline grid) | fluid card; floating FAB column → horizontal action-button row; cover shorter; stack; featured embeds full-width. **Must preserve theming** — read `currentTheme`, do NOT hardcode dark colors |
| Messages | friend list + thread split view | list and thread become separate mobile views; thread = bubbles + pinned composer |
| AI Playlist | light/blue `GenerateUI.css` chat | **re-theme to dark Spotter style**; bubbles like Messages; playlist result as inline card |
| Login / Auth | two-panel (form + carousel) | stack; carousel below form or hidden on small screens (verify existing CSS) |
| Single Post, Friends, Notifications | desktop layouts | apply the same fluid + stack + drop-sidebar rules |

## Components affected

- **New:** `MobileNav.jsx` + `MobileNav.css`, `SubTabs.jsx` + `SubTabs.css`
  (the pill strip).
- **CSS edited (≤768px media queries):** `NavBarStyles`, `MiniDrawer`,
  `Analytics`/dashboard styles, `GenreCharts`, `PostCard`, `Profile`, `messages`,
  `GenerateUI` (re-theme), `TopArtist`/`TopTracks`/`MyPlaylist`, `Login`,
  `SinglePostView`.
- **`App.jsx`:** render `MobileNav` alongside `NavBar`; wire sub-tab routing.

## Out of scope (YAGNI)

No new features, no visual rebrand, no desktop redesign, no PWA/offline, no
component-library swap.

## Testing

Puppeteer screenshots at 390×844 for every screen: assert no horizontal overflow
(`scrollWidth ≤ innerWidth`), drawer opens/closes, touch targets ≥44px, and the
existing functionality still works at desktop width (≥768px).

## Risks

- AI chat re-theme visibly changes that screen (intended; flagged to user).
- Pill-tab sub-nav is a new pattern — low risk, not yet prototyped.
- Two-level desktop nav collapses into one drawer + sub-tabs; must preserve every
  destination (Dashboard ×4, Social ×5, AI, Profile, Log out, guest variants).
