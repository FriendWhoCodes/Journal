# Architecture

## Overview

Man of Wisdom is a suite of productivity apps sharing a common authentication system and database.

```
┌─────────────────────────────────────────────────────────────┐
│                    manofwisdom.co                           │
├─────────────┬─────────────┬─────────────┬─────────────────┬─┤
│  Homepage   │ Goal Setter │ Time Views  │    Journal      │ │
│   :3003     │   :3002     │   :3004     │    :TBD         │ │
└─────────────┴──────┬──────┴──────┬──────┴────────┬────────┘ │
                     │             │               │           │
              ┌──────┴─────────────┴───────────────┴──────┐    │
              │           @mow/auth (shared)              │    │
              │         @mow/database (shared)            │    │
              └──────────────────┬────────────────────────┘    │
                                 │                             │
                    ┌────────────┴────────────┐                │
                    │   PostgreSQL (mow_journal)              │
                    └─────────────────────────────────────────┘
```

## Shared Packages

### @mow/auth (`packages/auth/`)

Shared authentication for all MoW apps.

**Features:**
- Magic link authentication (email-based, passwordless)
- Session management with cross-subdomain cookies
- React hooks: `useAuth()`, `useUser()`
- Auto-sync new users to Resend newsletter

**Key Files:**
- `src/magic-link.ts` - Magic link generation, verification, email sending
- `src/session.ts` - Session create/validate, cookie management
- `src/hooks.ts` - React hooks for auth state
- `src/components/AuthProvider.tsx` - Context provider

**Cookie Configuration:**
- Name: `mow_session`
- Domain: `.manofwisdom.co` (works across all subdomains)
- Expiry: 30 days

### @mow/database (`packages/database/`)

Shared Prisma schema and client.

**Usage in apps:**
```typescript
import { prisma } from '@/lib/prisma';
// or
import { PrismaClient } from '@prisma/client';
```

## Database Schema

### Current Tables

```
auth_users              # Unified identity (NEW - shared auth)
├── id (cuid)
├── email (unique)
├── name
├── emailVerified
├── createdAt
└── updatedAt

auth_sessions           # Login sessions
├── id (cuid)
├── userId → auth_users
├── token (unique)
├── expiresAt
└── createdAt

auth_magic_links        # Passwordless login tokens
├── id (cuid)
├── userId → auth_users
├── token (unique)
├── expiresAt
├── usedAt
└── createdAt

goal_setter_users       # Goal Setter specific (OLD - to be migrated)
├── id (cuid)
├── email (unique)
├── name
├── createdAt
└── auth_user_id → auth_users (optional link)

goal_setter_submissions # Goal Setter data
├── id (cuid)
├── userId → goal_setter_users
├── mode (quick/deep)
├── data (JSON)
├── createdAt
└── updatedAt

time_views_entries      # Time tracking data
├── id (cuid)
├── userId → auth_users
├── year, week
├── category
├── hours
├── notes
└── timestamps

time_views_accomplishments
├── id (cuid)
├── entryId → time_views_entries
├── content
├── completed
└── createdAt
```

### Planned: Unified Product Access

```
user_products (PLANNED)
├── id
├── user_id → auth_users
├── product (goal_setter, time_views, journal, wallpaper_pack_1)
├── access_type (free, purchased, trial, subscription)
├── granted_at
└── expires_at
```

## Authentication Flow

### Magic Link Login

```
1. User enters email + name
2. POST /api/auth/login
   → createMagicLink() - creates/finds user, generates token
   → sendMagicLinkEmail() - sends via Resend
   → syncContactToResend() - adds to newsletter (new users only)
3. User clicks email link
4. GET /verify?token=xxx
   → verifyMagicLink() - validates token, creates session
   → setSessionCookie() - sets cross-subdomain cookie
5. Redirect to app
```

### Session Validation

```
1. Request comes in
2. Middleware reads mow_session cookie
3. getSessionByToken() - validates in database
4. If valid: attach user to request
5. If invalid/expired: redirect to /login
```

## App-Specific Details

### Homepage (port 3003)

- Static marketing site
- No auth required
- Links to other products

### Goal Setter (port 3002)

- Goal planning wizard (quick: 5min, deep: 30min)
- Currently uses own user table (goal_setter_users)
- PDF generation for goals
- **TODO**: Migrate to shared auth

### Time Views (port 3004)

- Time tracking across life categories
- Uses shared auth (auth_users)
- Week-based view with categories:
  - Code, Writing, Design, Business, Personal
- **TODO**: Redesign to show available "views" user can access

### Journal (planned)

- Daily journaling app
- Will use shared auth
- Subdomain: journal.manofwisdom.co

## Adding OAuth Providers (Future)

The current design supports adding Google/GitHub OAuth:

**Option A: Add columns to auth_users**
```prisma
model AuthUser {
  // ...existing
  googleId  String? @unique
  githubId  String? @unique
}
```

**Option B: Separate providers table**
```prisma
model AuthProvider {
  id         String @id
  userId     String
  provider   String // google, github, magic_link
  providerId String
  user       AuthUser @relation(...)

  @@unique([provider, providerId])
}
```

The login flow would:
1. OAuth callback returns email + provider_id
2. Find user by email OR provider_id
3. Link accounts if needed
4. Create same session as magic link
