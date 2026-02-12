# Goal Setter - Progress Tracker

## Modes Overview

### Quick Mode (Free) - COMPLETE
- [x] Top 3 goals for 2026
- [x] Habit selection (checkbox + custom add)
- [x] Theme for the year
- [x] Fun section (travel, books, movies, experiences)
- [x] Email summary
- [x] Database storage (JSONB)

### Deep Mode (Free) - COMPLETE
- [x] Overall goals & habits (same checkbox UI as Quick)
- [x] 6 life categories (Health, Career, Wealth, Relationships, Growth, Impact)
- [x] Goal + Why reflection per category
- [x] Email summary
- [x] Database storage (JSONB)

### Priority Mode (Premium) - NEEDS WORK
- [x] Onboarding / philosophy page
- [x] Define priorities (name + why, 3-10, drag to reorder)
- [x] Set goals per priority (what, by when, success looks like)
- [ ] **Milestones — hardcoded Q1-Q4 regardless of goal deadline** (needs fix)
- [x] Identity transformation section
- [ ] **Identity habits — single textbox instead of multi-entry list** (needs fix)
- [ ] **Identity beliefs — single textbox instead of multi-entry list** (needs fix)
- [x] Review page
- [x] Finalization + DB save
- [x] PDF generation & download
- [ ] **Infographic generation** (shows "coming soon")
- [ ] **Phone wallpaper generation** (shows "coming soon")
- [ ] **Desktop wallpaper generation** (shows "coming soon")
- [ ] Email summary on finalization

### Priority + AI Wisdom ($29.99) - PARTIALLY COMPLETE
- [x] Landing page card
- [x] Wisdom mode flag threaded through flow
- [x] AI feedback generation (placeholder when no API key)
- [x] Feedback display page (/priority/feedback)
- [x] Instant feedback on finalization
- [ ] **Plug in real AI API key** (placeholder only)
- [ ] **Payment gate** (bypassed for now)

### Priority + Personal Wisdom ($99) - PARTIALLY COMPLETE
- [x] Landing page card with slot counter
- [x] 10 monthly slot cap (real-time, server-enforced)
- [x] Admin panel (/admin) — list submissions
- [x] Admin review page — side-by-side blueprint + feedback form
- [x] 5 structured feedback sections
- [x] Email notification on review completion (via Resend)
- [x] User feedback page (/priority/feedback)
- [ ] **Payment gate** (bypassed for now)

---

## Known Issues (Priority Mode)

### 1. Milestones hardcoded to Q1-Q4
**Problem:** `const QUARTERS = ['Q1', 'Q2', 'Q3', 'Q4']` is hardcoded. If a goal deadline is Q1, showing Q2-Q4 milestones makes no sense.
**Fix:** Make milestones dynamic based on goal deadline. Use months instead of quarters, or adapt quarter range to the goal's `byWhen` field. Also educate users on what quarters mean.

### 2. Identity habits/beliefs use single textbox
**Problem:** `habitsToBuild`, `habitsToEliminate`, `beliefsToHold` are plain `string` fields with a single textarea. No way to add multiple discrete items.
**Fix:** Change to `string[]` arrays. Reuse the checkbox + custom add pattern from Quick/Deep modes. Update Identity type, PriorityModeContext, identity page, and DB schema.

### 3. Habits not trackable at DB level
**Problem:** Priority mode identity habits are stored as freeform text in JSONB blob. Quick/Deep modes store as `string[]` in JSONB, which is better but still not individually trackable.
**Fix:** Store habits as structured arrays in the PriorityModeSubmission. Consider a dedicated habits table for cross-mode tracking in the future.

### 4. Goals not populated at DB level individually
**Problem:** Goals are nested inside the `priorities` JSONB blob. Not individually queryable.
**Fix:** For now, keep JSONB (it works for the current use case). Consider normalization later if we need per-goal tracking/analytics.

---

## Missing Features

### Export Features
| Feature | Status | Notes |
|---------|--------|-------|
| PDF | Done | @react-pdf/renderer, downloads from complete page |
| Infographic | Not started | One-page visual summary of priorities |
| Phone wallpaper | Not started | Priorities as phone lock screen |
| Desktop wallpaper | Not started | Priorities as desktop background |
| Email summary | Not started | Send blueprint to user's email on finalization |

### Payment Integration
| Feature | Status | Notes |
|---------|--------|-------|
| Stripe/payment for $29.99 AI tier | Not started | Currently bypassed |
| Stripe/payment for $99 Manual tier | Not started | Currently bypassed |
| UserProduct access check | Not started | Schema exists but not enforced |

### AI Integration
| Feature | Status | Notes |
|---------|--------|-------|
| AI feedback generation | Placeholder | Uses fallback text when AI_API_KEY not set |
| Real API key configuration | Not started | Need to set AI_API_KEY in .env |
| AI prompt tuning | Not started | Current prompt is reasonable but untested with real API |

---

## Architecture Notes

- **Habit UI pattern** (Quick/Deep): Preset checkboxes from `lib/constants.ts` + custom add input. Stored as `string[]`.
- **Priority Mode Identity**: Currently uses single textarea per question (carousel UI). Needs refactoring to multi-entry for habits/beliefs.
- **DB storage**: Quick/Deep habits = `Json @db.JsonB` (arrays). Priority identity = nested in `identity` JSONB blob (plain strings).
- **Preset habits** defined in `lib/constants.ts`: `HABITS_TO_BUILD` (6 items) and `HABITS_TO_BREAK` (6 items).
- **Validation**: `lib/validation.ts` has `validateStringArray()` for array inputs (max 50 items, XSS sanitization).
