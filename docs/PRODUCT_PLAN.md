# Universal — Product Plan

**Product:** Paste a social media link → download media → save to device Gallery / Photos.  
**Platforms:** iOS and Android in parallel every phase.  
**Auth:** Sign up / Sign in are shells until Phase 5; guest path is real.

## Dev standards (every phase)
- Form screens with `TextInput` use `<Screen scroll>` → `KeyboardAwareScrollView` (`enableOnAndroid`, `extraScrollHeight` iOS 30 / Android 130).
- Android Manifest keeps `windowSoftInputMode="adjustResize"`.
- Test keyboard open/scroll on both platforms before calling a phase done.

## Account rules

| | Guest | Registered |
|---|---|---|
| Download | Yes → save to Gallery / Photos | Yes → Gallery / Photos |
| In-app archive | No lasting library | Instagram-style media grid |
| Collections | Locked / upgrade prompt | Full CRUD |

## Phases

### Phase 0 / 0b — UI + onboarding — DONE
- Obsidian Aurora theme, tabs, splash, icons
- Onboarding, Welcome, Sign up, Sign in, guest continue

### Phase 1 — Product pivot — DONE
- Copy and navigation match downloader (not link inbox)
- Downloads tab; guest vs registered empty states / gating
- Download data model + mock library for registered users
- iOS + Android UI only (no real download pipeline yet)
- Plan mirror: `docs/PRODUCT_PLAN.md` + `src/constants/productPhases.ts` (Settings shows current phase)

### Phase 2 — Download core — DONE
- Paste / clipboard → platform detect (`AddDownload` modal)
- Resolve media (direct URL, or Cobalt tunnel with `alwaysProxy`) → download → Photos / Gallery
- Social CDN direct fetches are blocked (403) — requires your own Cobalt API URL in Settings
- Permissions, progress, success / failure
- Guest: write to gallery only; do not keep rich in-app history
- Registered: persist metadata in Redux Toolkit + AsyncStorage for grid
- Native: CameraRoll, BlobUtil, Clipboard; Info.plist + Android storage/media permissions

### Phase 3 — Library — DONE
- Registered Instagram-style grid with thumbnails / fallback tiles
- Download detail: tap to play video in-app, open link, assign collections, remove from library
- Long-press remove on grid
- Collections CRUD (create, open, delete) + assign from detail
- Gallery copies are never deleted by the app

### Phase 4 — Polish — DONE
- Android share sheet → Add Download (`ACTION_SEND` + `universal://add`)
- Clipboard watch on resume (Settings toggle)
- Auto-retry (up to 2) + manual Retry on failure
- Quality options (360 / 720 / 1080 / max) for Cobalt
- Clear library + collections + local playback files (gallery untouched)

### Phase 5 — Accounts — NEXT
- Real auth so registered library can sync across devices

## Out of scope until later
- Cloud sync details beyond Phase 5
- Web / tablet companion
