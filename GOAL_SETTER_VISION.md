# Man of Wisdom Goal Setter 2026 - Vision Document

**Version:** 1.0
**Date:** December 25, 2025
**Target Launch:** December 28, 2025
**Purpose:** Pre-launch lead magnet to collect committed users before journal launch (Jan 2026)

---

## Product Vision

A beautiful, guided goal-setting experience that helps users plan their 2026 in either **5 minutes (Quick Mode)** or **30 minutes (Deep Mode)**. Upon completion, users receive a unique code to unlock the full Man of Wisdom Journal for **1 month free** (Jan-Feb 2026).

---

## Core Value Proposition

"Set your 2026 goals in 5 minutes and get free access to the journal that will help you achieve them."

---

## User Flow Overview

```
Landing Page
    ↓
Enter Name
    ↓
Choose Mode: [Quick Mode] or [Deep Mode]
    ↓
Goal-Setting Questions (different per mode)
    ↓
Life Balance Questions (fun stuff: travel, movies, etc)
    ↓
Summary Page
    ↓
Sign Up (email) → Receive Code → Access Journal Jan 1st
    ↓
[Optional] Download PDF of Goals
```

---

## Modes Comparison

| Feature | Quick Mode | Deep Mode |
|---------|------------|-----------|
| Time | 5 minutes | 20-30 minutes |
| Questions | 4 core + 5 life balance | 20+ across life categories |
| Detail Level | Brief (few words/sentences) | Comprehensive (paragraphs) |
| Target User | Busy people, first-timers | Serious goal-setters, planners |

---

## Quick Mode (V1)

### Page 1: Core Goals (4 Questions)

**Question 1: Top 3 Things to Achieve in 2026**
```
"What are the top 3 things you want to achieve in 2026?"

[Text input 1]
[Text input 2]
[Text input 3]

Examples: "Launch my SaaS product" "Run a marathon" "Learn Spanish"
```

**Question 2: Top Habit to Build**
```
"What's the #1 habit you want to BUILD in 2026?"

[Text input]

Examples: "Exercise 5x/week" "Read 30 min daily" "Meditate every morning"
```

**Question 3: Top Habit to Break**
```
"What's the #1 habit you want to BREAK in 2026?"

[Text input]

Examples: "Stop doomscrolling" "Quit sugar" "No phone in bed"
```

**Question 4: Main Idea to Embody**
```
"What's the main idea or theme you want to embody in 2026?"

[Text input]

Examples: "Consistency over intensity" "Less talk, more action" "Be present"
```

### Page 2: Life Balance (Fun Stuff - Max 5 Items)

**Choose 5 categories from:**
1. **Places to Visit** - "Where do you want to travel in 2026?"
2. **Movies/Shows to Watch** - "What do you want to watch this year?"
3. **Books to Read** - "What books are on your 2026 list?"
4. **Skills to Learn** - "What new skill do you want to pick up?"
5. **People to Connect With** - "Who do you want to spend more time with?"
6. **Experiences to Have** - "What experiences do you want to create?"

**For V1, we'll pick the top 3:**
- Places to Visit
- Books to Read
- Experiences to Have

Format:
```
Places I Want to Visit in 2026:
[Text area - list format]

Books I Want to Read:
[Text area - list format]

Experiences I Want to Have:
[Text area - list format]
```

---

## Deep Mode (V1)

### Structure: Life Categories

Deep mode asks similar questions but **broken down by life areas:**

**Categories:**
1. Health & Fitness
2. Career & Work
3. Wealth & Finance
4. Relationships & Family
5. Personal Growth & Learning
6. Contribution & Impact

### Questions Per Category (Example: Health & Fitness)

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
HEALTH & FITNESS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

What's your #1 health/fitness goal for 2026?
[Text input]

What habits will you build to achieve this?
[Text area]

What habits will you break?
[Text area]

Why is this important to you?
[Text area]

[Next: Career & Work →]
```

Repeat for all 6 categories.

### Deep Mode - Life Balance Page (Same as Quick Mode)

After all categories, show the same fun page (places, books, experiences).

---

## Summary Page (Both Modes)

Beautiful visual summary of all their goals:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   YOUR 2026 BLUEPRINT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Hi [Name], here's what you want to achieve in 2026:

🎯 TOP 3 GOALS
→ [Goal 1]
→ [Goal 2]
→ [Goal 3]

✅ HABIT TO BUILD
→ [Habit]

❌ HABIT TO BREAK
→ [Habit]

💡 THEME FOR 2026
→ [Main idea]

🌍 PLACES TO VISIT
→ [Places list]

📚 BOOKS TO READ
→ [Books list]

✨ EXPERIENCES TO CREATE
→ [Experiences list]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Download PDF] [Edit Goals] [Get Journal Access →]
```

---

## Sign-Up & Code System

### Option A: Simple Email-Based (Recommended for V1)

**After Summary Page:**
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   UNLOCK YOUR JOURNAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

You've set your 2026 goals. Now track them daily!

Get 1 MONTH FREE access to Man of Wisdom Journal
(Launches January 1, 2026)

Enter your email to claim your free month:
[Email input]

[Claim Free Access]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**What Happens:**
1. User enters email
2. System creates account (or marks email for early access)
3. Sends confirmation email with:
   - "Your goals are saved!"
   - "Journal unlocks Jan 1st - we'll email you"
   - Link to edit goals anytime before Jan 1
4. On Jan 1, auto-grant 1 month Pro access

**No codes needed** - just email-based access.

### Option B: Unique Code System (If you prefer)

```
Your Code: WISDOM-2026-X7K9M

This code gives you 1 month FREE access to the journal.

Enter your email to save it:
[Email input]

[Save My Code]
```

**Recommendation:** Go with Option A (simpler, fewer edge cases)

---

## PDF Export (V1 or V2?)

**V1 (If time permits):**
- Generate simple PDF with their goals
- Use library like `jsPDF` or `react-pdf`
- Basic formatting, clean design
- Download button on summary page

**V2 (If V1 is tight):**
- Skip PDF for now
- Just show summary on screen
- Add PDF export after journal launch

**My Vote:** Try for V1 (PDFs are shareable → viral potential)

---

## Technical Architecture

### Tech Stack

**Frontend:**
- Next.js 14 (App Router)
- React Hook Form (for multi-step forms)
- Tailwind CSS + shadcn/ui
- Framer Motion (smooth transitions between steps)

**Backend:**
- Next.js API Routes
- PostgreSQL (same DB as journal)
- Prisma ORM

**Deployment:**
- Vercel (fastest deployment from laptop)
- Or Hetzner VPS (if you prefer)

**PDF Generation (V1):**
- `@react-pdf/renderer` or `jsPDF`

---

## Database Schema

### Tables Needed

**goal_setter_responses**
```sql
CREATE TABLE goal_setter_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  mode VARCHAR(10) NOT NULL, -- 'quick' | 'deep'

  -- Quick Mode Fields
  top_goals JSONB, -- ["goal1", "goal2", "goal3"]
  habit_to_build TEXT,
  habit_to_break TEXT,
  main_theme TEXT,

  -- Deep Mode Fields (JSONB for flexibility)
  deep_mode_data JSONB,
  -- {
  --   "health": { "goal": "...", "habits_build": "...", ... },
  --   "career": { ... },
  --   ...
  -- }

  -- Life Balance (same for both modes)
  places_to_visit TEXT[],
  books_to_read TEXT[],
  experiences_to_have TEXT[],

  -- Metadata
  completed_at TIMESTAMP DEFAULT NOW(),
  journal_code VARCHAR(50), -- If using code system
  journal_access_granted BOOLEAN DEFAULT FALSE,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_goal_setter_email ON goal_setter_responses(email);
```

### Integration with Journal

When user signs into journal (Jan 1+):
1. Check if email exists in `goal_setter_responses`
2. If yes, pre-populate their goals:
   - Top 3 goals → Projects or Monthly Goals
   - Habits → Habit tracker
   - Theme → Display as yearly theme
3. Grant 1 month Pro access automatically

---

## User Experience Principles

### 1. Progress Indicator
```
Step 1 of 3: Core Goals
━━━━━━━━━━━░░░░░░░░░░░░ 33%
```

### 2. Save & Resume
- Auto-save to local storage
- "Save & Continue Later" button
- Email them a link to resume

### 3. Encouraging Copy
- "Great start, [Name]!" after each section
- "You're doing amazing!" progress messages
- "Almost there!" on final page

### 4. Mobile-First
- Works perfectly on phone (most users)
- Large touch targets
- Easy typing on mobile keyboards

### 5. Fast & Fun
- Smooth animations
- No loading spinners (instant feedback)
- Feels playful, not like work

---

## V1 Scope (Must-Have for Dec 28)

### ✅ Must Have
- [ ] Landing page with mode selection
- [ ] Quick Mode (4 questions + 3 life balance)
- [ ] Deep Mode (6 categories + life balance)
- [ ] Summary page
- [ ] Email capture
- [ ] Database storage
- [ ] Email confirmation ("Goals saved, journal unlocks Jan 1")
- [ ] Responsive design (mobile + desktop)

### 🎯 Should Have (If time)
- [ ] PDF generation
- [ ] Progress indicator
- [ ] Save & resume functionality
- [ ] Edit goals after submission

### 🚀 Nice to Have (V2)
- [ ] Pre-filled chip suggestions (quick select)
- [ ] Social sharing ("I just set my 2026 goals!")
- [ ] Analytics (how many Quick vs Deep users)
- [ ] A/B testing different questions

---

## Launch Plan

### Pre-Launch (Dec 26-27)
- Build and test locally
- Get 2-3 friends to test it
- Fix critical bugs

### Launch (Dec 28)
- Deploy to production
- Soft launch: Post on Facebook/Instagram
- "Set your 2026 goals in 5 minutes - link in bio"

### Post-Launch (Dec 28-31)
- Monitor responses
- Collect emails
- Send reminder: "Journal launches in 3 days!"

### Jan 1
- Email all goal-setters: "Your journal is ready!"
- Auto-grant Pro access for 1 month
- Their goals already pre-populated

---

## Success Metrics

**By Dec 31:**
- 100-300 completed goal-setting responses
- 80%+ completion rate (people who start actually finish)
- <5 critical bugs reported

**By Jan 31:**
- 50%+ of goal-setters sign into journal at least once
- 20%+ use journal 3+ times in first week

---

## Open Questions

1. **Deployment target?**
   - Vercel (easiest from laptop, 1-click deploy)
   - Hetzner VPS (requires SSH, more complex)

2. **Domain?**
   - goals.manofwisdom.co
   - manofwisdom.co/goals
   - 2026.manofwisdom.co

3. **PDF Design?**
   - Simple text-based (easier to build)
   - Fancy with graphics (takes longer)

4. **Deep Mode - All 6 categories or fewer?**
   - 6 categories = comprehensive but long
   - 4 categories = faster but less thorough

5. **Do you have branding assets?**
   - Logo (SVG)
   - Brand colors (hex codes)
   - Fonts

---

## Recommendations from Claude

### 1. **Start with Quick Mode Only (V1.0)**
If time is tight by Dec 28:
- Ship Quick Mode first (simpler, faster to build)
- Add Deep Mode in V1.1 (Dec 29-30)
- Most users will choose Quick anyway

### 2. **Use Vercel for Deployment**
- Deploy from your Windows laptop via VSCode
- One command: `vercel --prod`
- Free tier, instant SSL
- Can deploy even with spotty internet

### 3. **Make PDF Generation V1**
- PDFs are shareable → free marketing
- Users post on social media → more sign-ups
- Worth the extra 3-4 hours to implement

### 4. **Email is the Key**
- Don't overcomplicate with codes
- Just email-based access
- Simpler = fewer bugs

### 5. **Mobile-First Testing**
- Test on your phone constantly
- Most users will do this on mobile
- Use Chrome DevTools mobile emulator

---

## Timeline Breakdown (3 Days)

### Day 1 (Dec 25 - Today)
- ✅ Vision document (done)
- [ ] Set up Next.js project
- [ ] Database schema + Prisma setup
- [ ] Landing page UI
- [ ] Mode selection page

### Day 2 (Dec 26)
- [ ] Quick Mode form (all pages)
- [ ] Deep Mode form (all categories)
- [ ] Summary page
- [ ] Email capture + confirmation

### Day 3 (Dec 27)
- [ ] PDF generation
- [ ] Email integration (Resend or SendGrid)
- [ ] Testing + bug fixes
- [ ] Deploy to Vercel

### Launch Day (Dec 28)
- [ ] Final testing
- [ ] Go live
- [ ] Social media announcement

---

## Next Steps

1. **Review this vision doc** - any changes?
2. **Answer open questions** (deployment, domain, PDF design)
3. **Confirm scope** - Quick + Deep mode or Quick only for V1?
4. **Start building** - I'll scaffold the Next.js project now

---

**Ready to build?** Let me know if this vision aligns with what you had in mind! 🚀
