# Roadmap

## Current Sprint

### Unified Auth Migration
- [x] Create `user_products` table schema (PR #41)
- [x] Run database migration
- [x] Migrate `goal_setter_users` to `auth_users` (4 users)
- [x] Link existing Goal Setter users to their auth_users records
- [x] Populate `user_products` for existing users (5 records)
- [x] Update Goal Setter app to use shared auth
- [x] Update Time Views to check `user_products` for access

### Time Views Redesign
- [x] Landing page showing available "views" (products) (PR #43 - Dashboard)
- [x] Purchased/free access gating
- [ ] Simpler week view design
- [x] User can click and open views they have access to (PR #43)

### Journal SaaS (Target: Feb 17)
- [ ] Scaffold journal app (Next.js + auth)
- [ ] Database schema (entries, habits, goals, subscriptions)
- [ ] Daily entry page (mood, prompts, notes)
- [ ] Habit check-ins with streaks
- [ ] Goal import from Goal Setter
- [ ] Weekly/monthly review pages
- [ ] 14-day trial system
- [ ] Stripe + Razorpay payments
- [ ] Deploy to journal.manofwisdom.co

---

## Completed

### January 2026

#### Time Views MVP + Shared Auth
- [x] Create `@mow/auth` package
- [x] Create `@mow/database` package (shared Prisma schema)
- [x] Implement magic link authentication
- [x] Cross-subdomain session cookies
- [x] Time Views app with week view
- [x] Deploy to time.manofwisdom.co
- [x] UFW firewall rule for port 3004

#### Newsletter Integration
- [x] Resend account setup
- [x] Domain verification (manofwisdom.co)
- [x] Create newsletter segment
- [x] Migrate 4 existing users to Resend
- [x] Auto-sync new signups to newsletter segment

#### UI/UX Improvements
- [x] Time Views login page - match Goal Setter style
- [x] Add favicon to Time Views
- [x] Add name field to Time Views login

---

## Backlog

### Authentication
- [ ] Add Google OAuth
- [ ] Add GitHub OAuth
- [ ] Account linking (magic link + OAuth same user)
- [ ] Email change flow
- [ ] Account deletion (GDPR)

### Goal Setter
- [x] Migrate to shared auth
- [ ] Improve PDF generation
- [ ] Email goals PDF to user

### Time Views
- [ ] Multiple "view" types (week, month, year, life)
- [ ] Data visualization improvements
- [ ] Export functionality
- [ ] Goals integration

### Journal
- [ ] Create journal app
- [ ] Daily entry interface
- [ ] Mood tracking
- [ ] Integration with Goal Setter goals

### Payments (Future)
- [ ] Stripe integration
- [ ] Subscription management
- [ ] Product purchase flow
- [ ] User billing portal

### Infrastructure
- [ ] GitHub Actions for auto-deploy
- [ ] Staging environment
- [ ] Database backups
- [ ] Error monitoring (Sentry?)

---

## Product Ideas

### Wallpaper Packs
- Downloadable wallpaper collections
- One-time purchase
- Delivered via email or download page

### Life Calendar View
- Visual life-in-weeks calendar
- Part of Time Views product

### Habit Tracker
- Daily habit check-ins
- Streaks and statistics
- Could be standalone or part of Journal
