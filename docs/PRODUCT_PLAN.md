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

### Phase 2 — Download core — NEXT
- Paste / clipboard → platform detect
- Resolve media → download file → save to Photos (iOS) / Gallery (Android)
- Permissions, progress, success / failure
- Guest: write to gallery only; do not keep rich in-app history
- Registered: persist metadata + thumbnails for grid

### Phase 3 — Library
- Registered Instagram-style grid (polish)
- Collections / folders
- Delete from app (gallery copy may remain)

### Phase 4 — Polish
- Share sheet → app, retries, quality options
- Clear data, privacy toggles, clipboard watch on/off

### Phase 5 — Accounts
- Real auth so registered library can sync across devices

## Out of scope until later
- Cloud sync details beyond Phase 5
- Web / tablet companion
