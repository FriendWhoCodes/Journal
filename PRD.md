# Man of Wisdom Journal 2026 - Product Requirements Document (PRD v1.0)

**Document Version:** 1.0  
**Date:** December 7, 2025  
**Product Owner:** Alok (Man of Wisdom)  
**Target Launch:** January 1, 2026 (Free access month)  
**Paid Launch:** February 1, 2026  

---

## Executive Summary

**Man of Wisdom Journal 2026** is a web-based SaaS journaling and goal-tracking system that combines daily journaling, habit tracking, and project management into a unified interface. It serves as the flagship digital product for the Man of Wisdom brand, targeting the existing 10,000+ follower base with a freemium subscription model.

**Core Value Proposition:**  
Replace 3 separate apps (journal + habit tracker + todo list) at 1/3 the price - $5-6/month vs $12-15/month for competitors.

**Success Metrics:**
- 200-500 sign-ups by January 31, 2026
- 50-100 paying users by February 15, 2026
- ₹5,000-10,000 MRR by February 28, 2026

---

## Product Vision & Positioning

### Primary Market
- Existing Man of Wisdom followers (10K+ on Facebook, 300+ Twitter, 100+ Instagram)
- Age: 25-45
- Location: India-first, English/Hindi speakers
- Goals-oriented individuals seeking structured self-improvement systems
- Early adopters of digital productivity tools

### Competitive Landscape

**Direct Competitors:**
- Notion ($10/mo) - Too complex, steep learning curve
- Day One ($35/year) - Journal-only, no habits/projects
- Habitica ($5/mo) - Gamified habits, no deep journaling
- Todoist Premium ($4/mo) - Tasks only, no reflection

**Our Advantage:**
- Integrated system (journal + habits + projects)
- Designed for Indian users (pricing, payment methods, cultural fit)
- Existing brand trust (Man of Wisdom community)
- Simple, opinionated structure vs overwhelming flexibility

### Product Positioning Statement

"For goal-oriented individuals who want a structured system to plan their year, track daily habits, and reflect on progress, Man of Wisdom Journal 2026 is an integrated web app that combines journaling, habit tracking, and project management in one simple interface - at 1/3 the cost of buying these tools separately."

---

## Core Features (V1 Scope)

### 1. User Authentication & Onboarding

#### 1.1 Authentication
- Email + password registration
- Social login (Google OAuth optional for V1)
- Email verification required
- Password reset flow
- Secure session management (JWT tokens)

**Technical Implementation:**
- Use Clerk.com for auth (faster than building custom)
- Store user metadata: name, email, timezone, created_at
- Auto-detect timezone from browser

#### 1.2 Onboarding Flow (3 Steps)

**Step 1: Welcome**
```
Title: "Welcome to Man of Wisdom Journal 2026"
Body: "This journal helps you plan your year, track habits, and achieve your goals through daily reflection and structured planning."
CTA: [Continue]
```

**Step 2: Habit Selection (Optional)**
```
Title: "Select Habits to Track"
Body: "Choose habits you want to build. You can customize these later."

Pre-built habit suggestions (user checks boxes):
□ Sleep 7+ hours
□ Morning exercise / Workout
□ Meditation / Mindfulness
□ Healthy eating
□ Deep work session
□ Read for 30 minutes
□ Drink 8 glasses of water
□ No social media before noon

[+ Add custom habit]

Footer: "Selected 3/20 habits"
CTA: [Skip for now] [Save & Continue]
```

**Step 3: Choose Starting View**
```
Title: "Where would you like to start?"

Three cards:
1. Daily View (Recommended)
   "Start journaling today"
   Icon: Calendar-day
   
2. Monthly View
   "Plan this month first"
   Icon: Calendar-month
   
3. Projects
   "Set up my 2026 goals"
   Icon: Target

CTA: [Take me there]
```

After selection → Brief tooltip tour (5 seconds per element, dismissible)

### 2. Navigation Structure

#### 2.1 Top Navigation Bar (Always visible)
```
[Logo: Man of Wisdom] [Daily] [Weekly] [Monthly] [Yearly] [Projects] [Settings] [User Avatar ▼]
```

Mobile (hamburger menu):
```
☰ Man of Wisdom Journal
  ├─ Daily
  ├─ Weekly  
  ├─ Monthly
  ├─ Yearly
  ├─ Projects
  ├─ Habits
  ├─ Settings
  └─ Logout
```

#### 2.2 Date Selector (Context bar under nav)
```
[◀ Previous] [Today: December 7, 2025] [Next ▶] [Jump to date 📅]
```

When user clicks "Jump to date" → Calendar picker modal opens

---

### 3. Daily View (Primary Workspace)

**Layout:** Single-page, scrollable, auto-save every 500ms

#### 3.1 Header Section
```
═══════════════════════════════════════
    January 1, 2026 | Wednesday
    "I will stay grounded and grow slowly but consistently." (Quarterly theme auto-displayed)
═══════════════════════════════════════
```

#### 3.2 Section 1: Essentials Checklist
```
┌─ Essentials ──────────────────────┐
│                                    │
│  Actions           Done?  If not, why? │
│  ──────────────────────────────────│
│  Slept 7+ hours?   [ ]   [text input]│
│  Movement/Workout? [ ]   [text input]│
│  Healthy Food?     [ ]   [text input]│
│  Meditation?       [ ]   [text input]│
│                                    │
└────────────────────────────────────┘
```

**Behavior:**
- Checkboxes toggle done/not done
- "If not, why?" field only editable if unchecked
- Data saves to `daily_essentials` table

#### 3.3 Section 2: Top 3 Goals of the Day
```
┌─ Top 3 Goals of the Day ──────────┐
│                                    │
│  "What I must get done today?"     │
│                                    │
│  1. [text input field]             │
│  2. [text input field]             │
│  3. [text input field]             │
│                                    │
│  [+ Add from Projects]             │ ← Button to pull tasks from projects
│                                    │
└────────────────────────────────────┘
```

**Behavior:**
- Freeform text input (not checkboxes - flexibility)
- If user clicks "+ Add from Projects" → Modal shows all incomplete project tasks
- User can select tasks to copy into goals
- Goals can exist independently of projects (no forced linkage)

#### 3.4 Section 3: Top 3 Thoughts
```
┌─ Top 3 Thoughts ──────────────────┐
│                                    │
│  "Ideas, Learnings, Insights"      │
│                                    │
│  [text area - multi-line input]    │
│                                    │
└────────────────────────────────────┘
```

**Behavior:**
- Large text area (400+ characters)
- No structure imposed - freeform thinking space
- Saves to `daily_thoughts` field

#### 3.5 Section 4: Deep Work Tracker
```
┌─ Deep Work Tracker ───────────────┐
│                                    │
│  Sessions    Time      Action      │
│  ────────────────────────────────  │
│  Session 1   [input]  [text input] │
│  Session 2   [input]  [text input] │
│  Session 3   [input]  [text input] │
│  Session 4   [input]  [text input] │
│                                    │
└────────────────────────────────────┘
```

**Behavior:**
- Time input = freeform (e.g., "9-11am" or "2 hours")
- Action = what you worked on
- Saves to `daily_deep_work` JSONB array

#### 3.6 Section 5: Chores / Shallow Work / Notes
```
┌─ Chores / Shallow Work / Notes ───┐
│                                    │
│  "How would I break my top 3 goals│
│   by month?"                       │
│                                    │
│  [Large text area]                 │
│                                    │
└────────────────────────────────────┘
```

**Behavior:**
- Freeform notes section
- No validation, just a scratchpad

#### 3.7 Section 6: Habit Tracker / No Zero Days
```
┌─ Habit Tracker ───────────────────┐
│                                    │
│  [User's selected habits displayed]│
│                                    │
│  □ Sleep 7+ hours                  │
│  □ Morning exercise                │
│  □ Meditation                      │
│  □ [Custom habit user added]       │
│                                    │
│  [+ Add new habit]                 │
│                                    │
└────────────────────────────────────┘
```

**Behavior:**
- Only shows habits user selected during onboarding or added later
- Checkboxes toggle completion
- "No Zero Days" = at least 1 habit checked = day is not zero
- Saves to `daily_habits` table (user_id, date, habit_id, completed boolean)

#### 3.8 Bottom Navigation Links
```
Jump To: [Home] [Q1] [January] [Week 1]
```

---

### 4. Weekly View

**Layout:** Page with 7-day table + reflection sections

#### 4.1 Header
```
═══════════════════════════════════════
    Week 1: January 1 to January 4
    "I will stay grounded and grow slowly but consistently."
═══════════════════════════════════════
```

#### 4.2 Section 1: Weekly Notes Table
```
┌─ This Week ───────────────────────┐
│                                    │
│  Date     Day    Note              │
│  ───────────────────────────────── │
│  Dec 29   Mon    [text input]      │
│  Dec 30   Tue    [text input]      │
│  Dec 31   Wed    [text input]      │
│  Jan 1    Thu    [text input]      │
│  Jan 2    Fri    [text input]      │
│  Jan 3    Sat    [text input]      │
│  Jan 4    Sun    [text input]      │
│                                    │
└────────────────────────────────────┘
```

**Behavior:**
- Each row is a brief daily summary (50-100 chars)
- Clicking a date navigates to that Daily View
- Auto-saves

#### 4.3 Section 2: Weekly Reflection
```
┌─ Weekly Reflection ───────────────┐
│                                    │
│  "What would make this week truly  │
│   meaningful?"                     │
│                                    │
│  [Large text area]                 │
│                                    │
└────────────────────────────────────┘
```

#### 4.4 Section 3: Goals for Future
```
┌─ Goals for Future ────────────────┐
│                                    │
│  "Aiming for which goals would be  │
│   best for my future?"             │
│                                    │
│  [Large text area]                 │
│                                    │
└────────────────────────────────────┘
```

#### 4.5 Section 4: Weekly Habit Tracker
```
┌─ Weekly Habit Tracker ────────────┐
│                                    │
│  Habits        Mon Tue Wed Thu Fri Sat Sun │
│  ───────────────────────────────────────── │
│  Sleep 7+ hrs  [ ] [ ] [ ] [ ] [ ] [ ] [ ] │
│  Exercise      [ ] [ ] [ ] [ ] [ ] [ ] [ ] │
│  Meditation    [ ] [ ] [ ] [ ] [ ] [ ] [ ] │
│                                    │
└────────────────────────────────────┘
```

**Behavior:**
- Grid auto-populated from Daily View habit completions
- Read-only (data flows from Daily View)
- Shows visual progress (e.g., "5/7 days completed")

---

### 5. Monthly View

**Layout:** Calendar grid + goals section

#### 5.1 Header
```
═══════════════════════════════════════
    January 2026
═══════════════════════════════════════
```

#### 5.2 Calendar Grid
```
┌─ January 2026 ────────────────────────────────────────────┐
│                                                            │
│   Mon   Tue   Wed   Thu   Fri   Sat   Sun   Week          │
│   ───   ───   ───   ───   ───   ───   ───   ────          │
│                 1     2     3     4     5     6   Week 27  │
│    7     8     9    10    11    12    13        Week 28  │
│   14    15    16    17    18    19    20        Week 29  │
│   21    22    23    24    25    26    27        Week 30  │
│   28    29    30    31                          Week 31  │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

**Behavior:**
- Clicking any date navigates to Daily View for that date
- Clicking week number navigates to Weekly View
- Current date highlighted
- Days with journal entries have a subtle indicator (e.g., small dot)

#### 5.3 Monthly Goals Section
```
┌─ January Top 3 Goals ─────────────┐
│                                    │
│  1. [text input]                   │
│  2. [text input]                   │
│  3. [text input]                   │
│                                    │
│  [+ Add from Quarterly Goals]      │
│                                    │
└────────────────────────────────────┘
```

**Behavior:**
- Freeform goals (not linked to projects by default)
- Option to pull from quarterly goals if user set them
- Saves to `monthly_goals` table

---

### 6. Yearly View (Simplified)

**Purpose:** Quick navigation calendar, not heavy planning

#### 6.1 Layout: Half-Year at a Glance
```
═══════════════════════════════════════
    2026 - Year at a Glance
═══════════════════════════════════════

┌─ First Half ──────────────────────┐
│                                    │
│  [January calendar mini]           │
│  [February calendar mini]          │
│  [March calendar mini]             │
│  [April calendar mini]             │
│  [May calendar mini]               │
│  [June calendar mini]              │
│                                    │
└────────────────────────────────────┘

┌─ Second Half ─────────────────────┐
│                                    │
│  [July calendar mini]              │
│  [August calendar mini]            │
│  [September calendar mini]         │
│  [October calendar mini]           │
│  [November calendar mini]          │
│  [December calendar mini]          │
│                                    │
└────────────────────────────────────┘
```

**Behavior:**
- Click any month → Navigate to Monthly View
- Click any date → Navigate to Daily View
- Week numbers visible for easy navigation
- NO heavy goal-setting UI here (keep it simple)

---

### 7. Projects (Yearly Goals & Task Management)

**Purpose:** Track 3-10 major projects for 2026, break them into tasks/subtasks

#### 7.1 Projects List View
```
═══════════════════════════════════════
    My 2026 Projects
═══════════════════════════════════════

┌─ Active Projects ─────────────────┐
│                                    │
│  [+ New Project]                   │
│                                    │
│  ┌──────────────────────────────┐ │
│  │ 📦 Launch MoW Journal SaaS   │ │
│  │ Progress: ████████░░ 80%     │ │
│  │ Tasks: 12 total, 8 done      │ │
│  │ Target: Jan 17, 2026         │ │
│  │ [View Details]               │ │
│  └──────────────────────────────┘ │
│                                    │
│  ┌──────────────────────────────┐ │
│  │ 🎵 Release 5 music tracks    │ │
│  │ Progress: ███░░░░░░░ 30%     │ │
│  │ Tasks: 10 total, 3 done      │ │
│  │ Target: Dec 31, 2026         │ │
│  │ [View Details]               │ │
│  └──────────────────────────────┘ │
│                                    │
└────────────────────────────────────┘

┌─ Completed Projects ──────────────┐
│  (collapsed by default)            │
└────────────────────────────────────┘
```

#### 7.2 Project Detail View
```
═══════════════════════════════════════
    📦 Launch MoW Journal SaaS
═══════════════════════════════════════

[Edit Project] [Delete Project] [Back to Projects]

Description:
[Text area with project description]

Target Completion: [Date picker: Jan 17, 2026]

Progress: ████████░░ 80% (8/12 tasks done)

┌─ Tasks ───────────────────────────┐
│                                    │
│  [+ Add Task]                      │
│                                    │
│  ☑ Create landing page             │
│    └─ ☑ Write copy                 │
│    └─ ☑ Design mockup              │
│    └─ ☐ Deploy to production       │
│                                    │
│  ☑ Build authentication            │
│                                    │
│  ☐ Design daily view UI            │
│    └─ ☐ Essentials section         │
│    └─ ☐ Goals section              │
│    └─ ☐ Habit tracker              │
│                                    │
│  ☐ Integrate Razorpay payments     │
│                                    │
└────────────────────────────────────┘
```

**Behavior:**
- Projects have: title, description, target date
- Tasks belong to projects (but can also have "No Project" default)
- Tasks can have unlimited subtasks (nested 1 level only)
- Checking a task marks it complete (auto-calculates % progress)
- Completed tasks collapse but remain visible (strikethrough)

#### 7.3 Task Modal (When adding tasks)
```
┌─ Add Task ────────────────────────┐
│                                    │
│  Task name:                        │
│  [text input]                      │
│                                    │
│  Belongs to project:               │
│  [Dropdown: Select project or "No Project"] │
│                                    │
│  Due date (optional):              │
│  [Date picker]                     │
│                                    │
│  [Cancel] [Add Task]               │
│                                    │
└────────────────────────────────────┘
```

**Linking Projects to Daily Goals:**
- In Daily View, when user clicks "+ Add from Projects"
- Modal shows all incomplete tasks across all projects
- User can select tasks to copy into today's goals
- No automatic sync (manual pull system = flexibility)

---

### 8. Settings & Preferences

#### 8.1 Settings Page Sections

**Profile:**
- Name (editable)
- Email (display only, verified)
- Timezone (auto-detected, editable)
- Profile picture (optional, upload)

**Habits Management:**
- View all habits (active + inactive)
- Add custom habits
- Archive habits (doesn't delete data, just hides from daily tracker)
- Reorder habits (drag-and-drop priority)

**Preferences:**
- Start week on: [Monday / Sunday]
- Date format: [DD/MM/YYYY / MM/DD/YYYY]
- Theme: [Light / Dark] (V2 feature, mention as "coming soon")

**Data & Privacy:**
- Export all data as JSON (V1 basic export)
- Export current month as PDF (V2 feature)
- Delete account (requires confirmation, email verification)

**Subscription (Shows after Feb 1):**
- Current plan: [Free / Pro]
- Billing cycle: [Monthly / Yearly]
- Next billing date
- Payment method
- [Upgrade to Pro] or [Manage Subscription]
- [Cancel Subscription]

---

### 9. Free vs Paid Feature Matrix

#### 9.1 Free Tier (Always Available)
✅ Daily View (full access)
✅ Basic habit tracking (up to 5 habits)
✅ Weekly View (read-only, no editing weekly reflections)
✅ Monthly calendar view (navigation only)
❌ Monthly goals (locked)
❌ Yearly view (locked)
❌ Projects & task management (locked)
❌ PDF export (locked)
❌ Habit analytics (V2 feature, locked)
❌ Goal carry-forward suggestions (V2 feature, locked)

#### 9.2 Pro Tier (₹99-149/month or ₹999-1499/year)
✅ All views unlocked (Daily, Weekly, Monthly, Yearly)
✅ Unlimited habits
✅ Projects & task management (unlimited projects)
✅ Monthly/weekly goal setting and reflections
✅ PDF export (current month)
✅ Priority email support
✅ Early access to new features

#### 9.3 January 2026 Special
- All users get Pro features for free (January 1-31, 2026)
- February 1: Users revert to Free tier unless they upgrade
- Upgrade prompt appears starting Jan 25 ("5 days left of Pro access")

---

### 10. Database Schema

#### 10.1 Core Tables

**users**
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  password_hash VARCHAR(255), -- if using custom auth
  clerk_user_id VARCHAR(255) UNIQUE, -- if using Clerk
  timezone VARCHAR(50) DEFAULT 'Asia/Kolkata',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  subscription_tier VARCHAR(20) DEFAULT 'free', -- 'free' | 'pro'
  subscription_status VARCHAR(20), -- 'active' | 'cancelled' | 'past_due'
  subscription_start_date TIMESTAMP,
  subscription_end_date TIMESTAMP
);
```

**daily_entries**
```sql
CREATE TABLE daily_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  entry_date DATE NOT NULL,
  
  -- Essentials checklist
  slept_7_hours BOOLEAN DEFAULT FALSE,
  slept_7_hours_note TEXT,
  movement_workout BOOLEAN DEFAULT FALSE,
  movement_workout_note TEXT,
  healthy_food BOOLEAN DEFAULT FALSE,
  healthy_food_note TEXT,
  meditation BOOLEAN DEFAULT FALSE,
  meditation_note TEXT,
  
  -- Goals and thoughts
  goal_1 TEXT,
  goal_2 TEXT,
  goal_3 TEXT,
  thoughts TEXT,
  
  -- Deep work tracker (JSONB array)
  deep_work_sessions JSONB DEFAULT '[]',
  -- Example: [{"time": "9-11am", "action": "Built landing page"}, ...]
  
  -- Notes
  chores_notes TEXT,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(user_id, entry_date)
);

CREATE INDEX idx_daily_entries_user_date ON daily_entries(user_id, entry_date);
```

**habits**
```sql
CREATE TABLE habits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  habit_name VARCHAR(255) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_habits_user ON habits(user_id);
```

**daily_habits**
```sql
CREATE TABLE daily_habits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  habit_id UUID REFERENCES habits(id) ON DELETE CASCADE,
  entry_date DATE NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  
  UNIQUE(user_id, habit_id, entry_date)
);

CREATE INDEX idx_daily_habits_user_date ON daily_habits(user_id, entry_date);
```

**weekly_entries**
```sql
CREATE TABLE weekly_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  week_start_date DATE NOT NULL, -- Monday of the week
  
  -- Daily notes for the week (JSONB)
  daily_notes JSONB DEFAULT '{}',
  -- Example: {"2026-01-01": "Great start", "2026-01-02": "Productive"}
  
  -- Weekly reflections
  meaningful_week_reflection TEXT,
  future_goals_reflection TEXT,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(user_id, week_start_date)
);

CREATE INDEX idx_weekly_entries_user ON weekly_entries(user_id);
```

**monthly_goals**
```sql
CREATE TABLE monthly_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  month_year VARCHAR(7) NOT NULL, -- Format: '2026-01'
  goal_1 TEXT,
  goal_2 TEXT,
  goal_3 TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(user_id, month_year)
);
```

**projects**
```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  target_date DATE,
  status VARCHAR(20) DEFAULT 'active', -- 'active' | 'completed' | 'archived'
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_projects_user ON projects(user_id);
```

**tasks**
```sql
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE, -- NULL for "No Project"
  parent_task_id UUID REFERENCES tasks(id) ON DELETE CASCADE, -- NULL for top-level tasks
  title VARCHAR(500) NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  due_date DATE,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_tasks_user ON tasks(user_id);
CREATE INDEX idx_tasks_project ON tasks(project_id);
```

**payments** (for Phase 5)
```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  razorpay_payment_id VARCHAR(255) UNIQUE,
  razorpay_order_id VARCHAR(255),
  razorpay_subscription_id VARCHAR(255),
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'INR',
  status VARCHAR(20), -- 'created' | 'authorized' | 'captured' | 'failed'
  payment_method VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

### 11. Technical Architecture

#### 11.1 Tech Stack

**Frontend:**
- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS + shadcn/ui components
- React Hook Form (for forms)
- date-fns (for date manipulation)

**Backend:**
- Next.js API Routes (App Router API handlers)
- PostgreSQL 15+ (on Hetzner VPS)
- Prisma ORM (type-safe database queries)

**Authentication:**
- Clerk.com (recommended for speed) OR
- NextAuth.js v5 (if prefer self-hosted)

**Payments (Phase 5):**
- Razorpay SDK
- Razorpay webhooks for subscription events

**Hosting:**
- Hetzner VPS (existing infrastructure)
- PM2 cluster mode (4 instances for load balancing)
- Nginx reverse proxy
- SSL via Let's Encrypt

**Deployment:**
- GitHub Actions CI/CD
- Automated tests before deploy
- Zero-downtime rolling deployment

#### 11.2 Architecture Diagram (Text)

```
┌─────────────────────────────────────────────────────┐
│                   User Browser                      │
│        (Desktop / Tablet / Mobile)                  │
└────────────────┬────────────────────────────────────┘
                 │
                 │ HTTPS
                 ▼
┌─────────────────────────────────────────────────────┐
│              Nginx Reverse Proxy                    │
│           (journal.manofwisdom.co)                  │
└────────────────┬────────────────────────────────────┘
                 │
                 │
                 ▼
┌─────────────────────────────────────────────────────┐
│          Next.js App (PM2 Cluster)                  │
│  ┌──────────────────────────────────────────────┐  │
│  │  App Router Pages (React Components)         │  │
│  │  - /daily, /weekly, /monthly, /yearly, etc   │  │
│  └──────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────┐  │
│  │  API Routes                                   │  │
│  │  - /api/daily, /api/habits, /api/projects    │  │
│  └──────────────────────────────────────────────┘  │
└────────────────┬────────────────────────────────────┘
                 │
                 │ Prisma ORM
                 ▼
┌─────────────────────────────────────────────────────┐
│            PostgreSQL Database                      │
│   (users, daily_entries, habits, projects, etc)    │
└─────────────────────────────────────────────────────┘

External Services:
┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│   Clerk Auth │   │  Razorpay    │   │  Email       │
│              │   │  Payments    │   │  (SendGrid)  │
└──────────────┘   └──────────────┘   └──────────────┘
```

---

### 12. API Endpoints (Next.js App Router)

#### 12.1 Daily Entries

**GET /api/daily/[date]**
- Fetch daily entry for specific date
- Returns: daily_entry object + habits for that day

**POST /api/daily/[date]**
- Create or update daily entry
- Body: { essentials, goals, thoughts, deep_work_sessions, chores_notes }
- Auto-saves on 500ms debounce from frontend

**GET /api/daily/[date]/habits**
- Fetch habit completions for specific date
- Returns: array of { habit_id, habit_name, completed }

**PATCH /api/daily/[date]/habits/[habit_id]**
- Toggle habit completion
- Body: { completed: boolean }

#### 12.2 Weekly Entries

**GET /api/weekly/[week_start_date]**
- Fetch weekly entry (reflections + daily notes)

**POST /api/weekly/[week_start_date]**
- Update weekly reflections and daily notes
- Body: { daily_notes, meaningful_week_reflection, future_goals_reflection }

#### 12.3 Monthly Goals

**GET /api/monthly/[month_year]**
- Fetch monthly goals (e.g., /api/monthly/2026-01)

**POST /api/monthly/[month_year]**
- Create/update monthly goals
- Body: { goal_1, goal_2, goal_3 }

#### 12.4 Projects

**GET /api/projects**
- List all user's projects (active + completed)
- Query params: ?status=active (filter)

**POST /api/projects**
- Create new project
- Body: { title, description, target_date }

**GET /api/projects/[project_id]**
- Fetch project details + all tasks

**PATCH /api/projects/[project_id]**
- Update project
- Body: { title?, description?, target_date?, status? }

**DELETE /api/projects/[project_id]**
- Delete project (cascade deletes all tasks)

#### 12.5 Tasks

**GET /api/projects/[project_id]/tasks**
- List all tasks for a project

**POST /api/projects/[project_id]/tasks**
- Create new task
- Body: { title, parent_task_id?, due_date? }

**PATCH /api/tasks/[task_id]**
- Update task (toggle completion, edit title, etc)
- Body: { completed?, title?, due_date? }

**DELETE /api/tasks/[task_id]**
- Delete task

#### 12.6 Habits

**GET /api/habits**
- List all user's habits (active + archived)

**POST /api/habits**
- Create custom habit
- Body: { habit_name }

**PATCH /api/habits/[habit_id]**
- Update habit (rename, archive, reorder)
- Body: { habit_name?, is_active?, display_order? }

**DELETE /api/habits/[habit_id]**
- Delete habit (soft delete - archives it)

#### 12.7 User & Settings

**GET /api/user/profile**
- Fetch user profile

**PATCH /api/user/profile**
- Update profile
- Body: { name?, timezone?, preferences? }

**POST /api/user/export**
- Export all user data as JSON (V1 basic)

---

### 13. Frontend Components Structure

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   ├── signup/
│   │   └── onboarding/
│   ├── (dashboard)/
│   │   ├── daily/
│   │   ├── weekly/
│   │   ├── monthly/
│   │   ├── yearly/
│   │   ├── projects/
│   │   └── settings/
│   ├── api/
│   │   ├── daily/
│   │   ├── weekly/
│   │   ├── monthly/
│   │   ├── projects/
│   │   ├── tasks/
│   │   └── habits/
│   └── layout.tsx
├── components/
│   ├── ui/ (shadcn components)
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── checkbox.tsx
│   │   ├── calendar.tsx
│   │   └── ...
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── DateSelector.tsx
│   │   └── Sidebar.tsx (mobile)
│   ├── daily/
│   │   ├── EssentialsSection.tsx
│   │   ├── GoalsSection.tsx
│   │   ├── ThoughtsSection.tsx
│   │   ├── DeepWorkTracker.tsx
│   │   └── HabitTracker.tsx
│   ├── weekly/
│   │   ├── WeeklyNotesTable.tsx
│   │   ├── WeeklyReflection.tsx
│   │   └── WeeklyHabitGrid.tsx
│   ├── monthly/
│   │   ├── MonthlyCalendar.tsx
│   │   └── MonthlyGoals.tsx
│   ├── projects/
│   │   ├── ProjectCard.tsx
│   │   ├── ProjectDetail.tsx
│   │   ├── TaskList.tsx
│   │   └── AddTaskModal.tsx
│   └── settings/
│       ├── ProfileSettings.tsx
│       ├── HabitsManagement.tsx
│       └── SubscriptionSettings.tsx
├── lib/
│   ├── prisma.ts
│   ├── auth.ts (Clerk or NextAuth)
│   ├── utils.ts
│   └── date-helpers.ts
├── hooks/
│   ├── useAutoSave.ts
│   ├── useDailyEntry.ts
│   ├── useHabits.ts
│   └── useProjects.ts
└── types/
    ├── daily.ts
    ├── projects.ts
    └── habits.ts
```

---

### 14. Phase-by-Phase Implementation Plan

#### Phase 0: Foundation (Dec 7-14, 2025)

**Week 1 Goals:**
- [ ] Initialize Next.js 14 project with TypeScript + Tailwind
- [ ] Set up PostgreSQL on Hetzner VPS
- [ ] Implement Prisma schema for all tables
- [ ] Set up Clerk authentication (or NextAuth if preferred)
- [ ] Create basic layout with Navbar + DateSelector
- [ ] Deploy to Hetzner VPS with PM2
- [ ] Set up GitHub Actions for CI/CD

**Deliverables:**
- Working auth (sign up, login, logout)
- Empty dashboard with navigation
- Database schema deployed
- Basic responsive layout (mobile + desktop)

**Testing:** Can create account, login, see empty dashboard

---

#### Phase 1: Core Journaling (Dec 15-28, 2025)

**Week 2-3 Goals:**
- [ ] Build Daily View (all sections)
  - [ ] Essentials checklist component
  - [ ] Top 3 Goals section
  - [ ] Top 3 Thoughts textarea
  - [ ] Deep Work Tracker (4 sessions)
  - [ ] Chores/Notes section
  - [ ] Daily Habit Tracker
- [ ] Implement auto-save (500ms debounce)
- [ ] Build Weekly View
  - [ ] Weekly notes table
  - [ ] Weekly reflection sections
  - [ ] Weekly habit grid (read-only, pull from daily)
- [ ] Build Monthly View
  - [ ] Calendar grid with navigation
  - [ ] Monthly goals section
- [ ] Date navigation logic (prev/next day, jump to date)

**Deliverables:**
- Fully functional Daily, Weekly, Monthly views
- Data persists to PostgreSQL
- Smooth navigation between views
- Auto-save working

**Testing:** Use the journal daily Dec 26-28 (3 days of dogfooding)

---

#### Phase 2: Yearly + Projects (Dec 29-Jan 4, 2026)

**Week 4 Goals:**
- [ ] Build Yearly View (simplified calendar)
- [ ] Build Projects page
  - [ ] Project list with cards
  - [ ] Add/edit/delete projects
  - [ ] Project detail view with tasks
- [ ] Build Task management
  - [ ] Add tasks to projects
  - [ ] Subtasks (1 level nesting)
  - [ ] Toggle task completion
  - [ ] "No Project" default option
- [ ] Connect Projects to Daily Goals
  - [ ] "+ Add from Projects" button in Daily View
  - [ ] Modal to select tasks
- [ ] UI polish (loading states, empty states, error handling)

**Deliverables:**
- Complete hierarchical system (Yearly → Monthly → Weekly → Daily)
- Project & task management working
- Mobile responsive refinement

**Testing:** 
- Invite 5-10 close friends/family (alpha testers)
- Collect feedback Jan 2-4
- Fix critical bugs

---

#### Phase 3: Pre-Launch Landing Page (Dec 8-31, 2025)

**Parallel to Phase 0-2:**
- [ ] Create landing page at manofwisdom.co/journal
- [ ] Email capture form (store in separate `waitlist` table)
- [ ] Show mockups/screenshots from Canva design
- [ ] "Sign up for early access" CTA
- [ ] Simple analytics (track sign-ups)

**Landing Page Copy (Draft):**

```
═══════════════════════════════════════════════════════════
           MAN OF WISDOM JOURNAL 2026
        Your Complete Life Planning System
═══════════════════════════════════════════════════════════

Plan Your Year. Track Your Habits. Achieve Your Goals.

All in one simple, beautiful interface.

[Screenshot of Daily View]

🎯 Daily Journaling
   Reflect on your day, set goals, track progress

✅ Habit Tracking  
   Build consistency, see your streaks

📊 Project Management
   Break yearly goals into monthly milestones

💰 One Price, Three Apps
   Journal + Habits + Tasks at 1/3 the cost

───────────────────────────────────────────

LAUNCHING JANUARY 1, 2026
FREE FOR THE ENTIRE MONTH

[Sign Up for Early Access]
[Email input field]
[Notify Me Button]

───────────────────────────────────────────

Built by Man of Wisdom
Trusted by 10,000+ followers

[Social proof: Testimonials if available]

───────────────────────────────────────────
```

**Social Media Announcement (Dec 8):**

**Facebook Post:**
```
I've been building something special for 2026.

A journal that actually helps you:
→ Plan your year
→ Track your habits  
→ Achieve your goals

Not another complex app. 
Not another subscription you'll forget.

Simple. Structured. Actually useful.

Launching January 1st. 
FREE for the entire month.

Sign up for early access:
[link to manofwisdom.co/journal]

Who's ready to make 2026 their best year?
```

---

#### Phase 4: Public Beta Launch (Jan 1-17, 2026)

**Launch Day (Jan 1):**
- [ ] Open access to journal.manofwisdom.co
- [ ] Email blast to waitlist
- [ ] Social media blitz (Facebook, Instagram, Twitter, LinkedIn)
- [ ] Facebook Live walkthrough
- [ ] Instagram Stories series

**Week 1 (Jan 1-7):**
- [ ] Daily Instagram Reels (how-to guides)
- [ ] User testimonials (collect via email/DMs)
- [ ] Monitor usage analytics (most used features)
- [ ] Fix bugs in real-time

**Week 2 (Jan 8-14):**
- [ ] Podcast Episode 1: "Why I Built My Own Journal"
- [ ] Share user screenshots (with permission)
- [ ] Build momentum ("200 users in 10 days!")

**Week 3 (Jan 15-17):**
- [ ] Birthday announcement (Jan 17): "Join me in using this for 2026"
- [ ] Prepare for paid transition messaging

**Metrics to Track:**
- Sign-ups per day
- Daily active users (DAU)
- Most used views (Daily > Weekly > Monthly?)
- Feature requests
- Bug reports

**Target:** 200-500 users by Jan 31

---

#### Phase 5: Payment Integration (Feb 1-15, 2026)

**Week 5-6 Goals:**
- [ ] Integrate Razorpay SDK
- [ ] Create subscription plans in Razorpay dashboard
  - Early Bird Pro: ₹99/month or ₹999/year (first 500 users)
  - Standard Pro: ₹149/month or ₹1499/year
- [ ] Build billing page UI
  - [ ] Display current plan
  - [ ] Upgrade/downgrade flow
  - [ ] Payment method management
- [ ] Implement webhooks for subscription events
  - [ ] subscription.charged → Update user status to 'active'
  - [ ] subscription.cancelled → Downgrade to free
  - [ ] payment.failed → Send email, grace period
- [ ] Create Terms of Service + Privacy Policy
- [ ] Set up email automation (payment confirmations, renewal reminders)
- [ ] Customer support system (email or WhatsApp Business)

**Free Tier Enforcement (Feb 1):**
- [ ] Check user subscription status on page load
- [ ] Lock Monthly Goals, Projects, Yearly View if free tier
- [ ] Show upgrade prompts (non-intrusive)

**Launch Messaging (Feb 1):**

**Email to all users:**
```
Subject: Your Free Month is Over - Here's What's Next

Hi [Name],

Thank you for using Man of Wisdom Journal this January!

Your free Pro access has ended. Here's what happens now:

✅ You can still use the Daily View and basic habits (always free)

🔒 To keep using Projects, Monthly Goals, and all features:
   → Upgrade to Pro for just ₹99/month (limited time)
   → Or ₹999/year (save 17%)

[Upgrade to Pro]

Why upgrade?
• Keep your projects and tasks
• Set monthly and yearly goals
• Export your journal as PDF
• Priority support

Questions? Just reply to this email.

- Man of Wisdom Team
```

**Social Media Posts (Feb 1-7):**
- Showcase Pro features (before/after comparisons)
- User testimonials: "Worth every rupee"
- Limited-time Early Bird pricing reminder

**Revenue Target:** 50-100 paying users by Feb 15 = ₹5,000-10,000 MRR

---

### 15. Success Metrics & KPIs

#### 15.1 Phase-Specific Metrics

| Phase | Metric | Target | Date |
|-------|--------|--------|------|
| Phase 0 | App deployed & functional | ✅ Working auth + empty dashboard | Dec 14 |
| Phase 1 | Personal use validation | ✅ Use daily for 3 days, <5 bugs | Dec 28 |
| Phase 2 | Alpha testing | ✅ 10 alpha users, <10 bugs reported | Jan 4 |
| Phase 3 | Waitlist sign-ups | 50-100 emails | Dec 31 |
| Phase 4 | Public beta sign-ups | 200-500 users | Jan 31 |
| Phase 5 | Paying users | 50-100 Pro subscribers | Feb 15 |

#### 15.2 Key Performance Indicators (Ongoing)

**User Acquisition:**
- Daily sign-ups
- Conversion rate (waitlist → active user)
- Traffic sources (Facebook > Instagram > Twitter?)

**Engagement:**
- Daily Active Users (DAU)
- Weekly Active Users (WAU)
- Average journal entries per user per week
- Most used feature (Daily View expected to dominate)

**Retention:**
- Day 1 retention (do they come back next day?)
- Week 1 retention (still using after 7 days?)
- Month 1 retention (still using by end of January?)

**Revenue (Post-Feb 1):**
- Monthly Recurring Revenue (MRR)
- Customer Acquisition Cost (CAC) - mostly $0 in V1 (organic)
- Lifetime Value (LTV) - estimate after 3 months

**Product Health:**
- Average load time (<2 seconds)
- Error rate (<1%)
- Support ticket volume

---

### 16. Risk Mitigation

#### 16.1 Identified Risks & Mitigation Strategies

**Risk 1: Low User Adoption**
- **Likelihood:** Medium
- **Impact:** High (no users = no revenue)
- **Mitigation:**
  - Pre-launch landing page builds anticipation
  - Launch to existing 10K follower base (warm audience)
  - Free January removes friction
  - Daily social media content drives awareness
- **Fallback:** If <50 users by Jan 15, do targeted DM outreach to engaged Facebook followers

**Risk 2: Technical Bugs at Launch**
- **Likelihood:** High (new product)
- **Impact:** Medium (fixable but damages credibility)
- **Mitigation:**
  - 3 weeks of personal testing (Dec 26-Jan 17)
  - Alpha testing with 10 close users (Jan 2-4)
  - Real-time monitoring on Jan 1 launch
  - Clear bug reporting channel (email or Discord)
- **Fallback:** Have 4-6 hours free on Jan 1-2 for emergency fixes

**Risk 3: Payment Integration Complexity**
- **Likelihood:** Medium
- **Impact:** High (blocks revenue)
- **Mitigation:**
  - Dedicate full 2 weeks to Phase 5 (Feb 1-15)
  - Test Razorpay in sandbox mode thoroughly
  - Start with manual invoice option if webhook fails
- **Fallback:** Delay paid launch to Feb 15 if needed, extend free access

**Risk 4: Feature Creep**
- **Likelihood:** High (temptation to add features)
- **Impact:** High (delays launch, overwhelms users)
- **Mitigation:**
  - STRICT scope for V1 (this PRD is the boundary)
  - Post-launch roadmap for V2 features
  - User feedback drives prioritization, not gut feeling
- **Fallback:** Cut Yearly View if Phase 2 runs late (not critical for V1)

**Risk 5: Poor Mobile Experience**
- **Likelihood:** Medium
- **Impact:** High (most users on mobile)
- **Mitigation:**
  - Mobile-first design from day 1
  - Test on real devices (iPhone + Android)
  - Optimize touch targets (min 44x44px)
- **Fallback:** If mobile UX poor at launch, focus Week 1 on mobile fixes

**Risk 6: Server Overload**
- **Likelihood:** Low (Hetzner VPS can handle 1000+ users)
- **Impact:** High (app down = bad impression)
- **Mitigation:**
  - PM2 cluster mode (4 instances)
  - PostgreSQL connection pooling
  - Load testing before launch (simulate 500 concurrent users)
- **Fallback:** Upgrade VPS plan (₹2K-5K/month for more resources)

---

### 17. Post-Launch Roadmap (V2 Features - Feb/Mar 2026)

**High-Priority (Feb-Mar):**
- PDF export (entire month formatted like Canva journal)
- Habit analytics (streaks, completion rates, charts)
- Goal carry-forward suggestions (AI-lite: if incomplete, suggest next month)
- Dark mode
- Weekly email digest ("Your week at a glance")

**Medium-Priority (Apr-Jun):**
- Mobile app (React Native wrapper)
- Google Calendar integration (sync events)
- Customizable daily sections (user chooses which sections to show)
- Collaboration mode (couples journaling together?)
- Public sharing (share a weekly reflection on social media)

**Low-Priority (Jul-Dec):**
- AI suggestions (Claude API: "Based on your entries, consider...")
- Voice journaling (transcribe audio notes)
- Localization (Hindi translation)
- Desktop app (Electron wrapper)
- Integration with other apps (Notion, Obsidian export)

**User Voting:**
- After Feb 15, send survey: "What feature would you pay extra for?"
- Build what users actually want, not assumptions

---

### 18. Marketing & Growth Strategy

#### 18.1 Pre-Launch (Dec 8-31)

**Week 1 (Dec 8-14): Build Awareness**
- Launch landing page
- Facebook announcement post
- Instagram carousel: "3 problems with current journals"
- Twitter thread: "Why I'm building my own system"
- LinkedIn thought leadership post

**Week 2 (Dec 15-21): Show Progress**
- Share screenshots/mockups
- Instagram Stories: "Building in public" series
- Facebook post: "500 lines of code later..."
- Update waitlist with "launching in 2 weeks"

**Week 3 (Dec 22-28): Build Hype**
- Countdown posts ("10 days left")
- Teaser video (30-sec Reel/Short)
- Email waitlist: "Get ready to journal"
- Final feature reveals

**Week 4 (Dec 29-31): Launch Prep**
- "Tomorrow we launch" posts
- Instagram Live: Q&A about the journal
- Email waitlist: "Access opens tomorrow at 12 AM"

#### 18.2 Launch Month (Jan 1-31)

**Week 1 (Jan 1-7): Onboarding Blitz**
- Daily Instagram Reels: "How to use [feature]"
- Facebook Live: Full walkthrough
- Email new users: Welcome + getting started guide
- Respond to every comment/question

**Week 2 (Jan 8-14): Social Proof**
- Share user testimonials
- Repost user screenshots (with permission)
- Facebook post: "100 users in 1 week!"
- Twitter: User success stories

**Week 3 (Jan 15-21): Momentum**
- Podcast Episode 1: "Building the Journal"
- Collaborate with micro-influencers (trade free access for shoutout)
- LinkedIn case study: "From idea to 200 users in 2 weeks"

**Week 4 (Jan 22-31): Prepare for Paid**
- Remind users: "1 week left of free Pro"
- Showcase Pro features (monthly goals, projects)
- Email: "Upgrade for just ₹99/month"

#### 18.3 Paid Launch (Feb 1-28)

**Week 1 (Feb 1-7): Conversion Push**
- Email all free users: Upgrade offer
- Facebook ads (₹5K budget): Target followers of productivity pages
- Instagram Reels: "Why I upgraded to Pro"
- Limited-time offer: "First 500 get Early Bird pricing"

**Week 2 (Feb 8-14): Retention Focus**
- Check in with paying users: "How's it going?"
- Fix any payment issues immediately
- Share success stories: "Already hit my Feb goals thanks to MoW Journal"

**Week 3-4 (Feb 15-28): Iterate**
- Analyze usage data (which features drive upgrades?)
- Build V2 features based on feedback
- Plan March marketing (podcast series, YouTube channel?)

#### 18.4 Growth Tactics (Ongoing)

**Content Marketing:**
- Blog on manofwisdom.co: "How to plan your year," "Habit tracking science"
- YouTube channel: Weekly journaling tips
- Podcast: Interview users about their 2026 journey

**Community Building:**
- Private Facebook Group: "Man of Wisdom Journalers 2026"
- Monthly challenges: "Journal every day this month"
- Leaderboard: Gamify habit streaks (opt-in)

**Referral Program (V2):**
- Give 1 month free Pro for each referral
- Referrer gets ₹50 credit

**Partnerships:**
- Collaborate with other productivity creators
- Guest posts on popular blogs (Medium, Substack)
- Affiliate program: 20% commission for influencers

---

### 19. Customer Support Plan

#### 19.1 Support Channels

**Primary: Email**
- support@manofwisdom.co
- Response time: <24 hours (Jan-Feb), <12 hours for Pro users (Mar+)

**Secondary: WhatsApp Business** (optional)
- For paying users only
- Faster response for urgent issues

**Self-Service:**
- FAQ page on journal.manofwisdom.co/faq
- Video tutorials (embed on help page)
- In-app tooltips and onboarding

#### 19.2 Common Issues & Responses (Template)

**Issue: "I can't log in"**
```
Hi [Name],

Sorry to hear you're having trouble logging in. Let's fix this:

1. Try resetting your password: [link]
2. Clear browser cache and try again
3. Make sure you're using the email you signed up with

If this doesn't work, reply with:
- What browser are you using?
- Any error message you see?

I'll help you get back in ASAP.

- MoW Support Team
```

**Issue: "My data isn't saving"**
```
Hi [Name],

Thanks for reporting this. A few things to check:

1. Make sure you're online (data saves after 500ms)
2. Try refreshing the page
3. Check if the date is correct (top bar)

If the issue persists:
- What view were you using? (Daily/Weekly/etc)
- What data is missing?

I'll investigate immediately and make sure your entries are recovered.

- MoW Support Team
```

**Issue: "I want a refund"**
```
Hi [Name],

I'm sorry Man of Wisdom Journal didn't meet your expectations.

We offer a 7-day money-back guarantee. I've processed your refund of ₹99. You'll see it in your account within 5-7 business days.

Before you go, would you mind sharing:
- What feature were you hoping for?
- What didn't work for you?

Your feedback helps us improve for others.

Thank you for giving us a try.

- MoW Support Team
```

#### 19.3 Support Hours

**January (Free Beta):**
- 9 AM - 9 PM IST (you personally handle all support)
- Expect 10-20 emails/day

**February+ (Paid):**
- 9 AM - 9 PM IST (weekdays)
- 10 AM - 6 PM IST (weekends)
- Consider hiring part-time VA if >50 emails/day

---

### 20. Legal & Compliance

#### 20.1 Required Documents

**Terms of Service (ToS)**
- User responsibilities (don't abuse the system)
- Intellectual property (you own your journal entries)
- Liability limitations
- Termination clause

**Privacy Policy**
- What data we collect (email, journal entries, usage analytics)
- How we use it (provide the service, improve features)
- Who we share with (no one, except payment processor)
- Data retention (keep until account deleted)
- GDPR compliance (right to export, right to delete)

**Refund Policy**
- 7-day money-back guarantee
- No questions asked for first-time users
- Prorated refunds for annual plans (optional)

**Cookie Policy**
- Essential cookies (auth session)
- Analytics cookies (Google Analytics or privacy-friendly alternative like Plausible)
- User consent banner (required by law)

#### 20.2 Payment & Tax Considerations

**GST Registration (India):**
- Required if annual turnover >₹20 lakh
- Not needed for V1 (projected <₹6 lakh in 2026)
- Monitor revenue, register if approaching threshold

**Razorpay Tax Handling:**
- Razorpay auto-calculates 18% GST on invoices (once registered)
- For now, pricing is inclusive (₹99 = ₹83.90 + ₹15.10 GST when registered)

**Invoicing:**
- Razorpay auto-generates invoices
- Send to user's email after payment
- Store in `payments` table for records

---

### 21. Analytics & Tracking

#### 21.1 Tools to Implement

**User Analytics:**
- Plausible (privacy-friendly, GDPR compliant) OR
- Google Analytics 4 (more features, less privacy)

**Product Analytics:**
- Mixpanel (track feature usage) OR
- PostHog (open-source, self-hostable)

**Session Recording (Optional):**
- Hotjar (see how users navigate)
- Only for debugging UX issues, not for spying

#### 21.2 Key Events to Track

**Auth Events:**
- Sign-up completed
- Login
- Logout
- Password reset

**Engagement Events:**
- Daily entry created
- Daily entry updated
- Habit checked
- Project created
- Task completed
- Weekly reflection saved
- Monthly goals set

**Navigation Events:**
- View switched (Daily → Weekly, etc)
- Date changed (previous/next day)
- Jump to date used

**Conversion Events:**
- Free trial started (Jan 1)
- Upgrade to Pro clicked
- Payment successful
- Subscription cancelled

#### 21.3 Dashboards to Build

**User Acquisition Dashboard:**
- Sign-ups per day (line chart)
- Traffic sources (pie chart)
- Conversion funnel (waitlist → sign-up → active user)

**Engagement Dashboard:**
- DAU/WAU/MAU
- Most used feature (bar chart)
- Average entries per user per week
- Retention cohorts (% still active after 7/14/30 days)

**Revenue Dashboard (Feb+):**
- MRR
- New subscribers vs churn
- Upgrade conversion rate (free → pro)
- Revenue per user (ARPU)

---

### 22. Testing Strategy

#### 22.1 Testing Phases

**Phase 1: Developer Testing (Dec 26-28)**
- You use the journal for 3 consecutive days
- Document every bug, UX friction, missing feature
- Fix critical bugs before alpha

**Phase 2: Alpha Testing (Jan 2-4)**
- Invite 5-10 close friends/family
- Give them specific tasks: "Set a yearly project, break it into monthly goals"
- Collect feedback via Google Form or 1:1 calls
- Fix critical bugs, document nice-to-haves for V2

**Phase 3: Public Beta (Jan 1-31)**
- Open to all sign-ups
- Monitor error logs daily (Sentry for error tracking)
- Hot-fix critical bugs within hours
- Plan non-critical bugs for weekly releases

**Phase 4: Ongoing (Feb+)**
- Regression testing before each deploy
- User acceptance testing (UAT) for new features
- Load testing before major marketing pushes

#### 22.2 Test Cases (Sample)

**Daily View:**
- [ ] Can create entry for today
- [ ] Can create entry for past date
- [ ] Can create entry for future date
- [ ] Essentials checkboxes toggle correctly
- [ ] "If not, why?" field only editable when unchecked
- [ ] Goals save on blur
- [ ] Thoughts save on blur (500ms debounce)
- [ ] Deep Work sessions save correctly (JSONB array)
- [ ] Habits show only user's selected habits
- [ ] Checking habit updates database immediately
- [ ] Data persists after page refresh
- [ ] Can navigate to previous/next day

**Projects:**
- [ ] Can create new project
- [ ] Can add tasks to project
- [ ] Can add subtasks to task (1 level only)
- [ ] Checking task marks it complete
- [ ] Deleting project deletes all tasks (cascade)
- [ ] "No Project" option available for tasks
- [ ] Daily View "Add from Projects" shows all incomplete tasks

**Authentication:**
- [ ] Can sign up with email/password
- [ ] Can't sign up with duplicate email
- [ ] Can log in with correct credentials
- [ ] Can't log in with wrong password
- [ ] Can reset password via email
- [ ] Session persists across page refreshes
- [ ] Session expires after 30 days (or logout)

---

### 23. Open Questions & Decisions Needed

#### 23.1 Questions for You (Alok)

1. **Branding Assets:** Do you have MoW logo in SVG format? Brand colors (hex codes)?

2. **Social Media Handles:** Should I include social links in footer? What are your handles?
   - Facebook: /manofwisdom
   - Instagram: @manofwisdom
   - Twitter: @manofwisdom
   - LinkedIn: /in/alok-manofwisdom

3. **Domain SSL:** Is journal.manofwisdom.co subdomain already set up? Do you need help configuring DNS?

4. **Email Sending:** For transactional emails (password reset, payment confirmation), should we use:
   - SendGrid (free for 100 emails/day, then $15/mo)
   - Amazon SES ($0.10 per 1000 emails)
   - Your existing email provider?

5. **Timezone Handling:** Should weekly view start on Monday or Sunday?
   - India convention: Monday
   - US convention: Sunday
   - User preference (let them choose in settings)

6. **Language:** V1 is English only, but should UI text be localization-ready? (i.e., use a translation library even if we only have English now)

7. **Podcast Hosting:** You mentioned starting a podcast. Do you have:
   - Mic setup? (You listed mics in your doc, so yes)
   - Hosting platform? (Anchor/Spotify for Podcasters is free)
   - Show name decided?

#### 23.2 Technical Decisions Needed

1. **Database Backups:** How often? Daily automated backups to separate storage?

2. **Error Monitoring:** Use Sentry (error tracking SaaS) or self-host error logs?

3. **Rate Limiting:** Prevent abuse (e.g., spam sign-ups). Implement rate limits on API routes?

4. **CAPTCHA:** Add on sign-up form to prevent bots? (hCaptcha or reCAPTCHA)

5. **Image Uploads (Future):** If users want to upload images in journal entries (V2), use:
   - Cloudinary (free tier: 25 GB)
   - S3-compatible storage (Wasabi, Backblaze)

---

### 24. Success Definition

**V1 is considered successful if:**

1. ✅ **Launch on Time:** App is live and usable by Jan 1, 2026
2. ✅ **User Adoption:** 200+ sign-ups by Jan 31
3. ✅ **Engagement:** 30%+ of users journal at least 3x/week
4. ✅ **Quality:** <10 critical bugs reported in first month
5. ✅ **Conversion:** 20%+ of free users upgrade to Pro in February (40-100 paying users)
6. ✅ **Revenue:** ₹5,000-10,000 MRR by Feb 28

**Stretch Goals:**
- 500+ sign-ups by Jan 31
- 100+ paying users by Feb 28
- ₹15,000 MRR by Mar 31
- 4.5+ star rating (if we add reviews)

**Personal Success (for you, Alok):**
- You use it daily for 60 consecutive days (Jan 1 - Mar 1)
- It becomes part of your identity (public journaling advocate)
- Proves you can ship SaaS products (confidence for SaaS #2, #3, etc)
- Generates enough revenue to justify time investment (even ₹10K/month = ₹1.2L/year = worth it)

---

## Appendix A: Pricing Strategy Deep Dive

### A.1 Competitor Pricing Analysis

| Product | Price | Features | Target Market |
|---------|-------|----------|---------------|
| Notion | $10/mo | Databases, wikis, tasks | Power users, teams |
| Day One | $35/yr | Journal, photos, sync | Writers, memories |
| Habitica | $5/mo | Gamified habits | Gamers, fun seekers |
| Todoist Premium | $4/mo | Tasks, projects, filters | GTD enthusiasts |
| Streaks (iOS) | $5 one-time | 12 habits max | Apple users |
| **MoW Journal** | **₹99/mo** | Journal + Habits + Tasks | **Goals-oriented Indians** |

### A.2 Pricing Psychology

**Why ₹99/month works:**
- Feels like "under ₹100" (psychological threshold)
- Competitive vs buying 3 apps separately (₹300+/month)
- Affordable for Indian market (₹1188/year = less than a coffee/day)

**Why Early Bird pricing:**
- Rewards first 500 users (they take risk on new product)
- Creates urgency ("Get in before price increases")
- Generates testimonials from early adopters

**Why yearly option:**
- Reduces churn (annual commitment)
- Better cash flow (₹999 upfront vs ₹99x12 = ₹1188 over time)
- 17% discount incentivizes yearly (₹999 vs ₹1188)

### A.3 Price Testing Strategy

**Month 1 (Feb):** Launch at ₹99/mo early bird
**Month 2 (Mar):** Analyze conversion rate
- If >25% convert: Price is great, keep it
- If <15% convert: Maybe too high, test ₹79/mo
- If >40% convert: Maybe too low, test ₹129/mo

**Month 3 (Apr):** Close Early Bird, move to Standard Pro (₹149/mo)
- See if new users still convert at higher price
- Early bird users locked in at ₹99 forever (grandfathered)

---

## Appendix B: Email Templates

### B.1 Welcome Email (After Sign-Up)

```
Subject: Welcome to Man of Wisdom Journal 2026! 🎉

Hi [Name],

Welcome to Man of Wisdom Journal! You're now part of a community of goal-oriented individuals transforming their 2026.

Here's how to get started:

1. Set your first yearly project (or skip for now)
2. Start with today's Daily View
3. Track 3 habits you want to build

📚 New to journaling? Watch this 2-minute guide: [link]

❓ Have questions? Just reply to this email.

Your 2026 transformation starts now. Let's go!

- Man of Wisdom Team

P.S. All features are FREE until January 31. Explore everything!
```

### B.2 Week 1 Check-In Email

```
Subject: How's your first week going?

Hi [Name],

You've been using Man of Wisdom Journal for a week now!

Here's what you've accomplished:
✅ [X] journal entries
✅ [Y] habits tracked
✅ [Z] goals set

Keep up the momentum! 🚀

Need help with anything? Reply and let me know.

- Man of Wisdom Team
```

### B.3 Upgrade Reminder Email (Jan 25)

```
Subject: 5 days left of FREE Pro access

Hi [Name],

Your free Pro access ends January 31.

After that, you'll lose access to:
❌ Monthly & Yearly Goals
❌ Projects & Task Management
❌ Weekly Reflections

But you can keep everything for just ₹99/month:

[Upgrade to Pro]

Or continue with Free (Daily View only)

Questions? Reply and I'll help you decide.

- Man of Wisdom Team

P.S. First 500 Pro users get locked in at ₹99/mo forever (Early Bird pricing). After that, it's ₹149/mo.
```

### B.4 Payment Success Email

```
Subject: Welcome to Man of Wisdom Journal Pro! 🎉

Hi [Name],

Your payment of ₹99 was successful!

You're now a Pro member with:
✅ All views (Daily, Weekly, Monthly, Yearly)
✅ Unlimited projects and tasks
✅ PDF export (coming soon)
✅ Priority support

Your next billing date: [Date]

View your subscription: [link to settings]

Thank you for supporting Man of Wisdom! Let's make 2026 legendary.

- Man of Wisdom Team

---
Need help? support@manofwisdom.co
Manage subscription: [link]
```

---

## Appendix C: Social Media Content Calendar (Jan 1-31)

| Date | Platform | Content Type | Topic |
|------|----------|--------------|-------|
| Jan 1 | All | Announcement | "The journal is LIVE!" |
| Jan 2 | Instagram | Reel | "How to use Daily View" |
| Jan 3 | Facebook | Post | "Why I built this system" |
| Jan 4 | Twitter | Thread | "3 features you'll love" |
| Jan 5 | Instagram | Story | Behind the scenes |
| Jan 6 | LinkedIn | Article | "From idea to launch in 30 days" |
| Jan 7 | Facebook | Live | "Q&A + Walkthrough" |
| Jan 8 | Instagram | Reel | "Weekly View tutorial" |
| Jan 9 | Twitter | Poll | "What feature do you use most?" |
| Jan 10 | Facebook | Post | "100 users milestone!" |
| Jan 11 | Instagram | Story | User testimonial |
| Jan 12 | LinkedIn | Post | "Why journaling works (science)" |
| Jan 13 | Instagram | Reel | "Monthly planning tips" |
| Jan 14 | Facebook | Post | User screenshot share |
| Jan 15 | Twitter | Thread | "Habit tracking psychology" |
| Jan 16 | Instagram | Story | "200 users! Thank you" |
| Jan 17 | All | Special | "My birthday = your reset day" |
| Jan 18 | Instagram | Reel | "Projects tutorial" |
| Jan 19 | Facebook | Post | User success story |
| Jan 20 | LinkedIn | Article | "Building a SaaS in public" |
| Jan 21 | Twitter | Poll | "What V2 feature do you want?" |
| Jan 22 | Instagram | Story | "9 days left of free Pro" |
| Jan 23 | Facebook | Post | Reminder: upgrade soon |
| Jan 24 | Instagram | Reel | "Why upgrade to Pro?" |
| Jan 25 | All | Email | "5 days left" reminder |
| Jan 26 | Facebook | Post | Early Bird pricing ends soon |
| Jan 27 | Instagram | Story | Countdown (4 days) |
| Jan 28 | Twitter | Thread | Pro features showcase |
| Jan 29 | Instagram | Story | Countdown (2 days) |
| Jan 30 | All | Post | "Last day of free Pro" |
| Jan 31 | All | Post | "Thanks for an amazing month" |

---

## Appendix D: Competitive Advantages Summary

**Why someone should choose Man of Wisdom Journal over alternatives:**

1. **Integrated System**
   - Competitors: Separate apps for journal, habits, tasks
   - MoW Journal: All-in-one, data flows between views
   
2. **Structured Simplicity**
   - Notion: Blank canvas (overwhelming)
   - MoW Journal: Opinionated structure (guides you)

3. **India-First Pricing**
   - International apps: $10-15/mo = ₹800-1200
   - MoW Journal: ₹99/mo = 1/8th the cost

4. **Local Payment Methods**
   - Most apps: Credit card only
   - MoW Journal: UPI, wallets, net banking via Razorpay

5. **Personal Brand Trust**
   - Generic apps: No face behind it
   - MoW Journal: Built by Man of Wisdom (10K followers, trusted)

6. **Designed for Goals**
   - Day One: Memoir/diary focus
   - MoW Journal: Achievement/goal-tracking focus

7. **No Mobile App Required**
   - Many apps: Mobile-only (bad for deep work)
   - MoW Journal: Works on all devices (responsive web)

---

## Document Change Log

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | Dec 7, 2025 | Initial PRD created | Claude (with Alok's input) |

---

## Approval Sign-Off

**Product Owner:** Alok  
**Date Reviewed:** _____________  
**Approved for Development:** [ ] Yes [ ] No  

**Notes/Requested Changes:**
_________________________________________________________________
_________________________________________________________________
_________________________________________________________________

---

**END OF PRD**

This document is a living document and will be updated as decisions are made and features evolve.

For questions or clarifications, contact: [Your contact info]

---

*Man of Wisdom Journal 2026 - Building your best year, one day at a time.*
