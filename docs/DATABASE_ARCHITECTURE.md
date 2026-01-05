# Database Architecture - Man of Wisdom

*Unified database design for Goal Setter + Future Journal SaaS*

---

## 🎯 Architecture Philosophy

**Database Naming Strategy:**
```
Man of Wisdom Ecosystem
├── mow_journal (database) ← Current focus
│   ├── goal_setter_users (Phase 1 - Now)
│   ├── goal_setter_submissions (Phase 1 - Now)
│   ├── journal_users (Phase 2 - Future, or reuse goal_setter_users)
│   ├── journal_entries (Phase 2 - Future)
│   └── journal_habit_logs (Phase 2 - Future)
│
├── mow_courses (database) ← Future
├── mow_community (database) ← Future
└── mow_analytics (database) ← Future
```

**Why this approach?**
- ✅ Clear naming: `mow_` prefix identifies ecosystem
- ✅ Scoped databases: Each product has its own DB
- ✅ Scalable: Easy to add new products
- ✅ Goal Setter is subset of Journal ecosystem
- ✅ Table prefixes (`goal_setter_*`) show module ownership
- ✅ Can share users table between modules if needed

---

## 📊 Current Schema (Goal Setter)

### 1. `goal_setter_users` Table

**Purpose:** Store user information for Goal Setter (can be shared with Journal later)

```sql
CREATE TABLE goal_setter_users (
    id SERIAL PRIMARY KEY,           -- Auto-incrementing ID
    email VARCHAR(255) UNIQUE NOT NULL,  -- Email (unique, required)
    name VARCHAR(255) NOT NULL,      -- User's name
    created_at TIMESTAMP DEFAULT NOW(),  -- When user signed up
    updated_at TIMESTAMP DEFAULT NOW()   -- Last profile update
);
```

**Fields Explained:**
- `SERIAL`: Auto-incrementing integer (1, 2, 3...)
- `PRIMARY KEY`: Unique identifier for each user
- `VARCHAR(255)`: String with max 255 characters
- `UNIQUE`: No two users can have same email
- `NOT NULL`: Field is required
- `TIMESTAMP`: Date + Time
- `DEFAULT NOW()`: Auto-fill with current time

---

### 2. `goal_setter_submissions` Table

**Purpose:** Store completed goal-setter submissions

```sql
CREATE TABLE goal_setter_submissions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES goal_setter_users(id) ON DELETE CASCADE,
    mode VARCHAR(10) NOT NULL CHECK (mode IN ('quick', 'deep')),

    -- Top 3 Goals (both modes)
    goal_1 TEXT,
    goal_2 TEXT,
    goal_3 TEXT,

    -- Habits (arrays as JSON)
    habits_to_build JSONB,           -- ["Exercise 3x/week", "Read daily"]
    habits_to_break JSONB,           -- ["Late night snacking", "Doomscrolling"]

    -- Theme
    main_theme TEXT,

    -- Deep Mode Category Data (stored as JSON)
    deep_mode_data JSONB,            -- { "health": { "goal": "...", "why": "..." }, ... }

    -- Fun Section
    places_to_visit TEXT,
    books_to_read TEXT,
    movies_to_watch TEXT,
    experiences_to_have TEXT,

    -- Metadata
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

**Advanced Concepts:**

**Foreign Key (`REFERENCES`):**
```sql
user_id INTEGER REFERENCES users(id)
```
- Links to `users` table
- Ensures user exists before creating submission
- **ON DELETE CASCADE**: If user deleted, delete their submissions too

**JSONB Data Type:**
```sql
habits_to_build JSONB
```
- Stores JSON data efficiently in PostgreSQL
- Can query inside JSON: `WHERE habits_to_build @> '["Exercise 3x/week"]'`
- **JSONB vs JSON**: JSONB is binary, faster to query

**CHECK Constraint:**
```sql
CHECK (mode IN ('quick', 'deep'))
```
- Validates data before insert
- Only allows 'quick' or 'deep', nothing else

---

## 🔄 Alternative: Normalized Schema

**If we want to query habits/goals separately:**

```sql
-- Separate habits table
CREATE TABLE goal_habits (
    id SERIAL PRIMARY KEY,
    submission_id INTEGER REFERENCES goal_submissions(id) ON DELETE CASCADE,
    habit_type VARCHAR(10) CHECK (habit_type IN ('build', 'break')),
    habit_text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Separate goals table
CREATE TABLE goals (
    id SERIAL PRIMARY KEY,
    submission_id INTEGER REFERENCES goal_submissions(id) ON DELETE CASCADE,
    goal_number INTEGER CHECK (goal_number BETWEEN 1 AND 3),
    goal_text TEXT NOT NULL,
    category VARCHAR(50),  -- For deep mode: 'health', 'wealth', etc.
    created_at TIMESTAMP DEFAULT NOW()
);
```

**Trade-off:**
- **Normalized** (separate tables):
  - ✅ Better for complex queries
  - ✅ Better data integrity
  - ❌ More complex joins

- **Denormalized** (JSONB in one table):
  - ✅ Simpler queries
  - ✅ Matches our UI structure
  - ❌ Harder to query specific habits

**Recommendation for now:** Start with JSONB (simpler), can normalize later if needed.

---

## 🔮 Future: Journal Integration

**When we build the Journal SaaS:**

```sql
-- Journal entries
CREATE TABLE journal_entries (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    entry_date DATE NOT NULL,
    mood INTEGER CHECK (mood BETWEEN 1 AND 10),
    gratitude TEXT,
    highlights TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Daily habit tracking
CREATE TABLE habit_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    habit_id INTEGER,  -- Could link to goal_habits
    completed_date DATE NOT NULL,
    completed BOOLEAN DEFAULT false,
    notes TEXT
);
```

**Linking Goals to Journal:**
```sql
-- User sets goals in goal-setter
-- Goals auto-load into journal
-- User tracks progress daily
-- Can see: "You wanted to 'Exercise 3x/week' - you did it 2x this week"
```

---

## 🔐 Security & Best Practices

### Indexes (for faster queries)
```sql
CREATE INDEX idx_user_email ON goal_setter_users(email);
CREATE INDEX idx_submission_user ON goal_setter_submissions(user_id);
CREATE INDEX idx_submission_created ON goal_setter_submissions(created_at);
```

**Why indexes?**
- Speed up `WHERE email = 'user@example.com'`
- Like index in a book - jump to page instead of reading everything

### Password Storage (for future auth)
```sql
ALTER TABLE users ADD COLUMN password_hash VARCHAR(255);
```
- **NEVER** store plain passwords
- Use bcrypt/argon2 to hash
- Store: `$2a$10$N9qo8uLOickgx2ZMRZoMye...`

---

## 📈 Scalability Considerations

**For Staff Interview Prep:**

**Partitioning (if we get millions of users):**
```sql
-- Partition by year
CREATE TABLE goal_submissions_2026 PARTITION OF goal_submissions
FOR VALUES FROM ('2026-01-01') TO ('2027-01-01');
```

**Caching Strategy:**
- User profile: Cache in Redis (rarely changes)
- Recent submissions: Cache for 5 minutes
- Analytics: Pre-compute daily

**Read Replicas:**
- Master DB: Writes
- Replica DB: Reads (reports, analytics)
- Reduces load on master

---

## 🎓 SQL Learning Path

**As we build, you'll learn:**

1. **Basic CRUD** ✅ (Today)
   - CREATE, INSERT, SELECT, UPDATE, DELETE

2. **Joins** (Next session)
   - Link users → submissions
   - Get user with all their goals

3. **Aggregations** (Future)
   - Count users per day
   - Most popular habits

4. **Transactions** (Future)
   - Ensure data consistency
   - All-or-nothing operations

5. **Performance** (Future)
   - Query optimization
   - Explain plans

---

## 🚀 Next Steps

1. Create the database
2. Create tables
3. Insert test data
4. Connect Next.js app
5. Test end-to-end

Ready to create the tables? Let me know!
