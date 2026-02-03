# Priority Mode - Implementation Plan

*Premium goal-setting mode for Goal Setter ($9.99)*

---

## Philosophy

**"If you set your priorities, the goals set themselves."**

Most people fail at goals because:
- They don't know *why* the goals matter
- They do busy work instead of deep work
- Goals feel mechanical, not personal

Priority Mode solves this by:
1. Starting with **Why** (priorities)
2. Goals become natural extensions
3. Breaking down into actionable milestones
4. Defining **Who** you need to become

---

## The Framework

```
WHY → WHAT → WHEN → HOW → WHO
```

| Step | Question | Output |
|------|----------|--------|
| **Why** | What matters most to you? | Priorities (ordered by importance) |
| **What** | What will you do for each priority? | Goals (1-5 per priority) |
| **When** | By when will you achieve this? | Deadlines |
| **How** | What are the steps to get there? | Quarterly/monthly milestones + tasks |
| **Who** | Who must you become? | Identity statements |

---

## User Flow

### Step 0: Onboarding (1 screen)
**Purpose:** Set expectations, explain the philosophy

Content:
- "Goals fail because people don't know *why* they matter"
- "We start with your priorities - goals become a natural extension"
- "This exercise takes ~1 hour. You can pause and return anytime."
- "At the end you'll get: PDF, printable infographic, phone/desktop wallpaper"
- "Your priorities and goals will auto-populate in Man of Wisdom Journal"

CTA: "Begin Your 2026 Blueprint"

---

### Step 1: Define Your Priorities (The Why)
**Purpose:** Identify what truly matters

**Questions:**
1. "What matters most to you in 2026?"
2. For each priority: "Why does this matter to you?"

**UI:**
- Add priority button (up to 10 max)
- Each priority card has:
  - Name (text input)
  - Why it matters (textarea)
  - Drag handle to reorder
  - Delete button
- Visual: Numbered 1-10 showing importance order

**Example:**
```
Priority #1: Family Health
Why: "My wife just had our first child. Nothing matters more than
      ensuring she recovers fully and our baby thrives."
```

**Constraints:**
- Minimum: 1 priority
- Maximum: 10 priorities
- Must have at least name filled (why is encouraged but optional)

---

### Step 2: Set Goals for Each Priority (The What + When)
**Purpose:** Turn priorities into concrete goals

**For each priority, user sets 1-5 goals:**

Each goal has:
- **What:** The goal statement
- **By When:** Deadline (dropdown: Q1/Q2/Q3/Q4 2026, or specific month)
- **Success looks like:** How will you know you achieved it?

**UI:**
- Show priority name at top as context
- Add goal button (up to 5 per priority)
- Progress through each priority sequentially
- "Next Priority →" when done with current one

**Example:**
```
Priority: Family Health

Goal 1:
  What: "Ensure wife fully recovers postpartum"
  By When: "Q1 2026 (March)"
  Success looks like: "She's back to full energy, cleared by doctor,
                       feeling confident and happy"

Goal 2:
  What: "Establish healthy sleep routine for baby"
  By When: "Q2 2026"
  Success looks like: "Baby sleeping 6+ hours through the night"
```

**Constraints:**
- Minimum: 1 goal per priority
- Maximum: 5 goals per priority

---

### Step 3: Break Down into Milestones (The How)
**Purpose:** Make goals actionable with quarterly/monthly breakdown

**Optional but strongly encouraged**

**For each goal, user can add:**
- Quarterly milestones (Q1, Q2, Q3, Q4)
- Monthly breakdown within quarters (optional)
- Specific tasks/action items

**UI:**
- Timeline visualization
- Expandable quarters
- Optional task list under each quarter/month
- Skip button: "I'll plan this later in Journal"

**Example:**
```
Goal: "Lose 10kg by December"

Q1 (Jan-Mar):
  - Milestone: "Lose 3kg"
  - Tasks:
    - Join gym by Jan 15
    - Meal prep every Sunday
    - Track calories daily

Q2 (Apr-Jun):
  - Milestone: "Lose another 3kg, build exercise habit"
  - Tasks:
    - Gym 4x/week consistently
    - Try intermittent fasting

Q3 (Jul-Sep):
  - Milestone: "Maintain momentum, lose 2kg"

Q4 (Oct-Dec):
  - Milestone: "Final 2kg, maintain new lifestyle"
```

**Constraints:**
- Milestones are optional
- No limit on tasks per milestone
- Can skip entirely and plan in Journal later

---

### Step 4: Define Who You Need to Become (The Who)
**Purpose:** Identity transformation - be pulled by your why

**5 Core Questions:**

1. **"To achieve your priorities, what habits must you build?"**
   - Textarea for reflection
   - Example: "Wake up early, exercise daily, read before bed"

2. **"What habits or behaviors must you eliminate?"**
   - Textarea for reflection
   - Example: "Mindless social media scrolling, late night snacking, procrastination"

3. **"What beliefs must you hold to succeed?"**
   - Textarea for reflection
   - Example: "My time equals my life. Small daily actions compound. I am capable of change."

4. **"What kind of person achieves these priorities?"**
   - Textarea for reflection
   - Example: "A disciplined, focused, loving person who puts family first and doesn't waste time."

5. **"Write a statement: 'I am someone who...'"**
   - Final identity statement
   - Example: "I am someone who prioritizes my family's health above all else, who does deep work instead of busy work, who values time as the most precious resource."

**UI:**
- One question per screen (focused)
- Subtle prompts/examples
- Word count or character hint (encourage depth)
- Can skip but encouraged to complete

---

### Step 5: Review & Finalize
**Purpose:** See everything, make final edits, commit

**UI:**
- Beautiful summary view of everything:
  - Priorities (ordered)
  - Goals per priority with deadlines
  - Milestones (if added)
  - Identity statements
- Edit button on each section (returns to that step)
- "Finalize My 2026 Blueprint" button

**Finalization:**
- Saves to database with `finalizedAt` timestamp
- Triggers output generation (PDF, wallpaper, etc.)
- Can edit 1 time after finalizing OR unlimited for 1 year (TBD based on subscription model)

---

### Step 6: Your Outputs
**Purpose:** Deliver the value

**Available immediately after finalization:**

1. **Comprehensive PDF**
   - All priorities, goals, milestones, identity
   - Beautifully formatted, printable
   - Man of Wisdom branding

2. **One-Page Infographic**
   - Visual summary of priorities and top goals
   - Designed to be printed and hung up
   - Clean, minimal design

3. **Phone Wallpaper**
   - Priorities listed (top 3-5)
   - Daily reminder
   - Multiple style options?

4. **Desktop Wallpaper**
   - Priorities + goals overview
   - Aesthetic, not cluttered

5. **Email Summary**
   - Everything sent to their email
   - Can forward to accountability partner

6. **Saved to Journal**
   - Message: "Your priorities and goals are now saved to Man of Wisdom Journal"
   - "Subscribe to Journal to track progress, reflect daily, and stay on course"
   - Link to Journal app

---

## Data Structure

```typescript
interface Priority {
  id: string;
  name: string;
  why: string;
  order: number; // 1-10, determines importance
  goals: Goal[];
}

interface Goal {
  id: string;
  what: string;
  byWhen: string; // "Q1 2026", "March 2026", etc.
  successLooksLike: string;
  milestones: Milestone[];
}

interface Milestone {
  id: string;
  period: string; // "Q1", "Q2", "January", etc.
  description: string;
  tasks: string[]; // Array of task descriptions
}

interface Identity {
  habitsToBuild: string;
  habitsToEliminate: string;
  beliefsToHold: string;
  personWhoAchieves: string;
  iAmSomeoneWho: string; // Final identity statement
}

interface PriorityModeData {
  userId: string;
  priorities: Priority[];
  identity: Identity;

  // Metadata
  createdAt: Date;
  updatedAt: Date;
  finalizedAt: Date | null;
  editCount: number; // Track edits after finalization

  // Payment
  purchasedAt: Date;
  purchaseId: string; // Stripe/Razorpay reference
}
```

---

## Technical Implementation

### Auto-Save Strategy

1. **localStorage** (immediate)
   - Save on every input change (debounced 500ms)
   - Survives browser close
   - Key: `priority_mode_draft_{userId}`

2. **Database** (persistent)
   - Save when completing each step
   - Save every 60 seconds while active
   - Enables cross-device resume

3. **Resume Flow**
   - On page load, check for draft
   - Show: "Welcome back! Continue where you left off?"
   - Jump to last incomplete step

### Pages/Routes

```
/priority                 → Payment gate / Onboarding
/priority/priorities      → Step 1: Define priorities
/priority/goals           → Step 2: Set goals (loops through priorities)
/priority/milestones      → Step 3: Break down (optional)
/priority/identity        → Step 4: Who you become
/priority/review          → Step 5: Review & finalize
/priority/complete        → Step 6: Outputs & downloads
```

### State Management

- Use existing `GoalSetterContext` pattern
- Add `PriorityModeContext` for this flow
- Persist to localStorage + database

### Output Generation

1. **PDF** - Use `@react-pdf/renderer` (already in project)
2. **Infographic** - HTML → Canvas → PNG (html2canvas)
3. **Wallpaper** - Pre-designed templates, inject user data
4. **Email** - Resend API (already set up)

---

## Constraints Summary

| Aspect | Limit |
|--------|-------|
| Priorities | 1-10 |
| Goals per priority | 1-5 |
| Milestones per goal | Optional, unlimited |
| Tasks per milestone | Unlimited |
| Identity questions | 5 (all encouraged) |
| Edit after finalize | 1 edit OR unlimited for 1 year sub |

---

## UI/UX Principles

1. **One thing at a time** - No overwhelming forms
2. **Progress visible** - "Step 2 of 5" + progress bar
3. **Encouraging micro-copy** - "Great choice. Now let's make it actionable."
4. **Premium feel** - Subtle animations, elegant typography
5. **Mobile-first** - Works beautifully on phone
6. **Auto-save indicator** - "Saved" badge so user feels safe

---

## Integration with Journal

When user finalizes:
1. Create records in `journal_priorities` table (new)
2. Create records in `journal_goals` table (new)
3. Link to user via `auth_users`
4. Journal app reads these on login
5. User sees their priorities/goals pre-populated
6. Full features (tracking, reflection) require Journal subscription

---

## Payment Flow (Later)

1. User clicks Priority Mode card
2. If not purchased → Stripe/Razorpay checkout ($9.99)
3. On success → Mark `user_products` with `priority_mode` access
4. Redirect to `/priority` onboarding
5. If already purchased → Go directly to flow

---

## Open Questions

1. **Edit policy:** One free edit, or unlimited for 1 year?
2. **Priority + Wisdom tier:** How does personal feedback work? Email? In-app comments?
3. **Wallpaper styles:** Offer multiple designs, or one elegant default?
4. **Sharing:** Allow users to share their blueprint (public link)?

---

## Files to Create

```
goal-setter/
├── app/
│   └── priority/
│       ├── page.tsx              (Payment gate + onboarding)
│       ├── priorities/
│       │   └── page.tsx          (Step 1)
│       ├── goals/
│       │   └── page.tsx          (Step 2)
│       ├── milestones/
│       │   └── page.tsx          (Step 3)
│       ├── identity/
│       │   └── page.tsx          (Step 4)
│       ├── review/
│       │   └── page.tsx          (Step 5)
│       └── complete/
│           └── page.tsx          (Step 6)
├── components/
│   └── priority/
│       ├── PriorityCard.tsx
│       ├── GoalCard.tsx
│       ├── MilestoneTimeline.tsx
│       ├── IdentityQuestion.tsx
│       ├── ProgressBar.tsx
│       └── OutputPreview.tsx
├── lib/
│   ├── context/
│   │   └── PriorityModeContext.tsx
│   └── types/
│       └── priority.ts
└── api/
    └── priority/
        ├── save/route.ts         (Save draft)
        ├── finalize/route.ts     (Finalize submission)
        └── outputs/route.ts      (Generate PDF, wallpaper)
```

---

## Next Steps

1. [ ] Create `PriorityModeContext` and types
2. [ ] Build Step 0: Onboarding page
3. [ ] Build Step 1: Priorities page
4. [ ] Build Step 2: Goals page
5. [ ] Build Step 3: Milestones page
6. [ ] Build Step 4: Identity page
7. [ ] Build Step 5: Review page
8. [ ] Build Step 6: Complete page with outputs
9. [ ] Implement auto-save (localStorage + database)
10. [ ] Build PDF generation
11. [ ] Build wallpaper generation
12. [ ] Add payment gate (Stripe/Razorpay)
13. [ ] Test end-to-end flow
