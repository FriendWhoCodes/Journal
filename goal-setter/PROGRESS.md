# Goal Setter - Progress Tracker

Last Updated: February 9, 2026

---

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

### Priority Mode (Premium) - IN PROGRESS
- [x] Onboarding / philosophy page
- [x] Define priorities (name + why, 3-10, drag to reorder)
- [x] Set goals per priority (what, by when, success looks like)
- [x] Monthly milestones (dynamic based on goal deadline)
- [x] Identity transformation (multi-entry habits/beliefs with presets)
- [x] Review page
- [x] Finalization + DB save
- [x] Normalized DB tables (PriorityGoal, PriorityMilestoneRecord, PriorityHabit)
- [x] PDF generation & download
- [x] Infographic generation (1080x1350 PNG, client-side via html-to-image)
- [x] Phone wallpaper generation (1080x1920 PNG, dark gradient theme)
- [x] Desktop wallpaper generation (1920x1080 PNG, dark radial gradient)
- [x] Email summary on finalization

### Priority + AI Wisdom ($29.99) - PARTIALLY COMPLETE
- [x] Landing page card
- [x] Wisdom mode flag threaded through flow
- [x] AI feedback generation (placeholder when no API key)
- [x] Feedback display page (/priority/feedback)
- [x] Instant feedback on finalization
- [ ] **Plug in real AI API key** (placeholder only)
- [x] **Payment gate** (enforced via Gumroad webhook)

### Priority + Personal Wisdom ($99) - PARTIALLY COMPLETE
- [x] Landing page card with slot counter
- [x] 5 monthly slot cap (real-time, server-enforced)
- [x] Admin panel (/admin) — list submissions
- [x] Admin review page — side-by-side blueprint + feedback form
- [x] 5 structured feedback sections
- [x] Email notification on review completion (via Resend)
- [x] User feedback page (/priority/feedback)
- [x] **Payment gate** (enforced via Gumroad webhook)

---

## Launch Roadmap

### Phase 1: Complete All Functionality (No Payment Yet)

All features should work end-to-end before adding the payment wall.

| # | Task | Status | Notes |
|---|------|--------|-------|
| 1.1 | Infographic generation | Not started | One-page visual summary of priorities + goals |
| 1.2 | Phone wallpaper generation | Not started | Priorities as phone lock screen (1080x1920) |
| 1.3 | Desktop wallpaper generation | Not started | Priorities as desktop background (1920x1080) |
| 1.4 | Email summary on finalization | Done | Send blueprint summary to user's email via Resend |
| 1.5 | Wisdom notification email | Done (pre-existing) | Admin "Mark Reviewed & Notify" triggers email via sendWisdomFeedbackEmail() |
| 1.6 | Real AI API key | Not started | Configure Anthropic API key, test AI feedback quality |

### Phase 2: Payment Gateway (Gumroad)

| # | Task | Status | Notes |
|---|------|--------|-------|
| 2.1 | Payment table in DB | Done | Payment model with Gumroad provider support |
| 2.2 | Gumroad webhook integration | Done | Webhook receives sale → creates Payment + grants UserProduct access |
| 2.3 | Payment gate on Priority Mode | Done | Backend returns 402, frontend shows purchase UI with Gumroad checkout |
| 2.4 | Wisdom tier upsell flow | Not started | In-app purchase during Priority Mode for AI ($29.99) or Personal ($99) |

### Phase 3: Launch & Polish

| # | Task | Status | Notes |
|---|------|--------|-------|
| 3.1 | End-to-end testing | Not started | Free user → paywall → pay → access → complete → get deliverables |
| 3.2 | AI prompt tuning | Not started | Test with real API, iterate on feedback quality |
| 3.3 | Landing page copy | Not started | Clear pricing, value prop, social proof |
| 3.4 | Analytics / conversion tracking | Not started | Track funnel: visit → signup → start → pay → complete |

---

## Pricing Model

| Product | Price | Access Type |
|---------|-------|-------------|
| Quick Mode | Free | free |
| Deep Mode | Free | free |
| Priority Mode | $9.99 | purchased (lifetime for the year) |
| Priority + AI Wisdom | $29.99 | purchased |
| Priority + Personal Wisdom | $99 | purchased (5 slots/month) |

---

## Payment Strategy

**Provider:** Gumroad (handles global payments, cards, PayPal)

Gumroad webhook writes to the `Payment` table and creates `UserProduct` records.
The app checks `UserProduct` for access — decoupled from the payment provider.

---

## Technical Debt

| Issue | Severity | Notes |
|-------|----------|-------|
| GoalSetterUser legacy split | Medium | Quick/Deep use GoalSetterUser (Int id), Priority uses AuthUser directly. Requires DB migration to consolidate — GoalSetterSubmission FK is Int, AuthUser PK is CUID. Needs dedicated migration PR. |
| Middleware deprecation warning | Low | Next.js 16 warns about middleware → proxy migration |
| ~~Hardcoded year "2026"~~ | ~~Low~~ | Fixed — all references now use dynamic `new Date().getFullYear()` |
| ~~XSS regex blocklist~~ | ~~Medium~~ | Fixed — switched to tag-stripping allowlist approach |

---

## Architecture Notes

- **Habit UI pattern**: Preset checkboxes from `lib/constants.ts` + custom add input. Stored as `string[]`.
- **Identity fields**: `habitsToBuild`, `habitsToEliminate`, `beliefsToHold` are `string[]` arrays. `personWhoAchieves` and `iAmSomeoneWho` are prose strings.
- **DB dual storage**: JSONB blob for blueprint snapshot view + normalized tables (PriorityGoal, PriorityHabit) for tracking.
- **Backward compat**: `toArray()` helpers handle old string format data in localStorage and DB.
- **Preset constants**: `HABITS_TO_BUILD` (6), `HABITS_TO_BREAK` (6), `BELIEFS_TO_HOLD` (6) in `lib/constants.ts`.
- **Validation**: `lib/validation.ts` has `validateStringArray()` for array inputs (max 50 items, XSS sanitization).
- **Email**: Resend API (direct HTTP, no npm package). Used for magic links, newsletter sync, and wisdom notifications.
