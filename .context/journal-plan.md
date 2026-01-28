# Journal SaaS Implementation Plan

**Target Launch:** February 17, 2026
**Domain:** journal.manofwisdom.co
**Port:** 3005

---

## Product Vision

A minimal, calm journaling app that helps users:
1. **Reflect daily** - Mood tracking, gratitude, wins, lessons
2. **Track goals** - Auto-imported from Goal Setter, progress updates
3. **Build habits** - Daily check-ins with streaks
4. **Review progress** - Weekly and monthly summaries

---

## Pricing Model

- **14-day free trial** - Full access, no credit card required
- **After trial** - Locked out (can view, cannot add entries)
- **Pricing:** ~$5-10/month (TBD)
- **Payments:** Stripe (global) + Razorpay (India)

---

## Database Schema

### New Tables (in shared `@mow/database`)

```prisma
// Daily journal entry
model JournalEntry {
  id          String   @id @default(cuid())
  userId      String   @map("user_id")
  date        DateTime @db.Date
  mood        Int?     // 1-5 scale
  gratitude   String?  @db.Text
  wins        String?  @db.Text
  lessons     String?  @db.Text
  freeform    String?  @db.Text
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  user        AuthUser @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId, date])
  @@map("journal_entries")
}

// User's habits (templates)
model JournalHabit {
  id          String   @id @default(cuid())
  userId      String   @map("user_id")
  name        String
  emoji       String?
  isActive    Boolean  @default(true) @map("is_active")
  createdAt   DateTime @default(now()) @map("created_at")

  user        AuthUser @relation(fields: [userId], references: [id], onDelete: Cascade)
  logs        JournalHabitLog[]

  @@map("journal_habits")
}

// Daily habit completions
model JournalHabitLog {
  id          String   @id @default(cuid())
  habitId     String   @map("habit_id")
  date        DateTime @db.Date
  completed   Boolean  @default(false)
  createdAt   DateTime @default(now()) @map("created_at")

  habit       JournalHabit @relation(fields: [habitId], references: [id], onDelete: Cascade)

  @@unique([habitId, date])
  @@map("journal_habit_logs")
}

// User's goals (imported from Goal Setter or manual)
model JournalGoal {
  id          String   @id @default(cuid())
  userId      String   @map("user_id")
  title       String
  category    String?  // health, wealth, relationships, etc.
  source      String   @default("manual") // "goal_setter" or "manual"
  sourceId    String?  @map("source_id") // GoalSetterSubmission.id if imported
  isActive    Boolean  @default(true) @map("is_active")
  createdAt   DateTime @default(now()) @map("created_at")

  user        AuthUser @relation(fields: [userId], references: [id], onDelete: Cascade)
  updates     JournalGoalUpdate[]

  @@map("journal_goals")
}

// Goal progress updates
model JournalGoalUpdate {
  id          String   @id @default(cuid())
  goalId      String   @map("goal_id")
  date        DateTime @db.Date
  note        String   @db.Text
  progress    Int?     // 0-100 percentage (optional)
  createdAt   DateTime @default(now()) @map("created_at")

  goal        JournalGoal @relation(fields: [goalId], references: [id], onDelete: Cascade)

  @@map("journal_goal_updates")
}

// User subscription/trial status
model JournalSubscription {
  id              String    @id @default(cuid())
  userId          String    @unique @map("user_id")
  status          String    // "trial", "active", "expired", "cancelled"
  trialStartedAt  DateTime  @map("trial_started_at")
  trialEndsAt     DateTime  @map("trial_ends_at")
  subscribedAt    DateTime? @map("subscribed_at")
  expiresAt       DateTime? @map("expires_at")
  stripeCustomerId    String? @map("stripe_customer_id")
  stripeSubscriptionId String? @map("stripe_subscription_id")
  razorpayCustomerId  String? @map("razorpay_customer_id")
  razorpaySubscriptionId String? @map("razorpay_subscription_id")
  createdAt       DateTime  @default(now()) @map("created_at")
  updatedAt       DateTime  @updatedAt @map("updated_at")

  user            AuthUser  @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("journal_subscriptions")
}
```

---

## App Structure

```text
journal/
├── app/
│   ├── layout.tsx              # Root layout with AuthProvider
│   ├── page.tsx                # Dashboard / Today view
│   ├── login/page.tsx          # Login (reuse @mow/auth)
│   ├── verify/page.tsx         # Magic link verify
│   ├── today/page.tsx          # Today's entry (main journaling)
│   ├── habits/page.tsx         # Habit management
│   ├── goals/page.tsx          # Goals list + import
│   ├── review/
│   │   ├── week/page.tsx       # Weekly review
│   │   └── month/page.tsx      # Monthly review
│   ├── settings/page.tsx       # Account, subscription
│   └── api/
│       ├── auth/[...path]/route.ts  # Auth routes
│       ├── entries/route.ts         # CRUD entries
│       ├── habits/route.ts          # CRUD habits
│       ├── habits/log/route.ts      # Log habit completion
│       ├── goals/route.ts           # CRUD goals
│       ├── goals/import/route.ts    # Import from Goal Setter
│       ├── goals/update/route.ts    # Goal progress updates
│       ├── subscription/route.ts    # Get subscription status
│       └── webhooks/
│           ├── stripe/route.ts      # Stripe webhooks
│           └── razorpay/route.ts    # Razorpay webhooks
├── components/
│   ├── MoodPicker.tsx
│   ├── HabitCheckbox.tsx
│   ├── GoalCard.tsx
│   ├── EntryForm.tsx
│   ├── WeeklyChart.tsx
│   └── TrialBanner.tsx
├── lib/
│   ├── auth.ts                 # getCurrentUser, ensureProductAccess
│   ├── prisma.ts               # Prisma client
│   ├── subscription.ts         # Trial/subscription helpers
│   └── utils.ts
├── middleware.ts               # Auth middleware
├── package.json
└── next.config.ts
```

---

## Implementation Timeline

### Week 1: Jan 28 - Feb 3 (Foundation + Daily Entry)

#### Day 1-2 (Jan 28-29): Scaffold

- [ ] Create journal app in monorepo
- [ ] Setup Next.js 15 + TypeScript + Tailwind
- [ ] Add @mow/auth, @mow/database dependencies
- [ ] Create middleware.ts (auth)
- [ ] Create login/verify pages (copy from time-views)
- [ ] Setup Nginx proxy for journal.manofwisdom.co

#### Day 3-4 (Jan 30-31): Database + Daily Entry

- [ ] Add new models to Prisma schema
- [ ] Run migration
- [ ] Create /today page with:
  - Mood picker (1-5 emoji scale)
  - Gratitude prompt
  - Wins prompt
  - Lessons prompt
  - Free-form notes
- [ ] Create entries API routes

#### Day 5-7 (Feb 1-3): Habits

- [ ] Create habits management page
- [ ] Create habit check-in component
- [ ] Add habits to /today page
- [ ] Implement streak calculation
- [ ] Create habits API routes

### Week 2: Feb 4 - Feb 10 (Goals + Reviews)

#### Day 8-9 (Feb 4-5): Goals

- [ ] Create goals page
- [ ] Implement Goal Setter import
- [ ] Create goal progress update UI
- [ ] Create goals API routes

#### Day 10-11 (Feb 6-7): Weekly Review

- [ ] Create /review/week page
- [ ] Show mood trends (chart)
- [ ] Show habit completion rates
- [ ] Show goal progress summary
- [ ] Highlight best/worst days

#### Day 12-14 (Feb 8-10): Monthly Review + Polish

- [ ] Create /review/month page
- [ ] Dashboard homepage with summary
- [ ] Navigation/layout polish
- [ ] Mobile responsiveness

### Week 3: Feb 11 - Feb 17 (Payments + Launch)

#### Day 15-16 (Feb 11-12): Trial System

- [ ] Create JournalSubscription table
- [ ] Auto-create trial on first login (14 days)
- [ ] Trial banner component
- [ ] Lock-out logic for expired trials
- [ ] "Upgrade" CTA

#### Day 17-18 (Feb 13-14): Stripe Integration

- [ ] Stripe account setup
- [ ] Create checkout session API
- [ ] Webhook handling
- [ ] Subscription activation on success

#### Day 19 (Feb 15): Razorpay Integration

- [ ] Razorpay account setup
- [ ] Create subscription API
- [ ] Webhook handling
- [ ] Currency detection (INR vs USD)

#### Day 20-21 (Feb 16-17): Testing + Launch
- [ ] End-to-end testing
- [ ] Fix bugs
- [ ] Deploy to production
- [ ] DNS setup
- [ ] Launch email to Goal Setter users

---

## Design Principles

1. **Minimal & calm** - Lots of whitespace, soft colors, no clutter
2. **Fast entry** - Get to journaling in <3 seconds
3. **Mobile-first** - Most journaling happens on phones
4. **Encouraging** - Celebrate streaks, never shame missed days
5. **Private** - No social features, this is personal

---

## Color Palette (Minimal/Calm)

```css
--bg-primary: #FAFAFA;      /* Off-white background */
--bg-secondary: #F5F5F5;    /* Subtle sections */
--text-primary: #1A1A1A;    /* Near-black text */
--text-secondary: #6B7280;  /* Gray text */
--accent: #3B82F6;          /* Calm blue for CTAs */
--accent-soft: #EFF6FF;     /* Light blue backgrounds */
--success: #10B981;         /* Green for completed */
--warning: #F59E0B;         /* Amber for trial banner */
```

---

## Open Questions

1. **Pricing:** $5/mo or $10/mo? Annual discount?
2. **Prompts:** Fixed prompts or customizable?
3. **Reminders:** Email/push notifications for journaling?
4. **Export:** PDF/JSON export of entries?
5. **Insights:** AI-powered insights on journal patterns?

---

## Success Metrics

- **Launch:** Journal live on Feb 17
- **Week 1:** 50+ trial signups from Goal Setter users
- **Month 1:** 10-20% trial → paid conversion
- **MRR target:** $500+ by end of February
