# Decision Log

This document records key architectural and design decisions with their rationale.

---

## D001: Unified Authentication System

**Date:** January 2026
**Status:** Implemented

**Context:**
Each app (Goal Setter, Time Views, Journal) could have its own user table, but this creates fragmentation.

**Decision:**
Create a shared `@mow/auth` package with a single `auth_users` table for all MoW products.

**Rationale:**
- Single Sign-On across all products
- One newsletter list
- Easier to track user journey across products
- Simpler GDPR compliance (one place to delete data)
- Enable cross-selling ("You use Goal Setter, try Time Views!")

**Consequences:**
- Need to migrate existing goal_setter_users
- All apps must use the shared auth package
- Cookie domain set to `.manofwisdom.co` for cross-subdomain auth

---

## D002: Magic Link Authentication (Passwordless)

**Date:** January 2026
**Status:** Implemented

**Context:**
Need simple, secure authentication without password management complexity.

**Decision:**
Use magic link (email-based) authentication via Resend API.

**Rationale:**
- No passwords to store/hash
- Email verification built-in
- Users already trust email links
- Lower friction than password creation
- Resend free tier sufficient for our scale

**Consequences:**
- Users must have email access to login
- Magic links expire in 15 minutes
- Sessions last 30 days

---

## D003: Cross-Subdomain Sessions

**Date:** January 2026
**Status:** Implemented

**Context:**
Users should stay logged in across goals.manofwisdom.co, time.manofwisdom.co, etc.

**Decision:**
Set session cookie with domain `.manofwisdom.co` (leading dot = all subdomains).

**Rationale:**
- Login once, access all products
- Consistent with major platforms (Google, Apple)
- Better user experience

**Cookie Settings:**
```typescript
{
  name: 'mow_session',
  domain: '.manofwisdom.co',
  httpOnly: true,
  secure: true,  // production only
  sameSite: 'lax',
  maxAge: 30 * 24 * 60 * 60  // 30 days
}
```

---

## D004: Resend for Email + Newsletter

**Date:** January 2026
**Status:** Implemented

**Context:**
Need email service for auth and newsletters.

**Decision:**
Use Resend for both transactional emails (magic links) and marketing (newsletters via Segments).

**Rationale:**
- Simple API
- Good deliverability
- Free tier sufficient (3,000 transactional/month, unlimited to 1,000 contacts)
- Modern developer experience
- Already have manofwisdom.co domain verified

**Implementation:**
- Transactional: Direct API calls for magic links
- Marketing: Segments feature for newsletter
- Auto-sync: New signups added to newsletter segment automatically

---

## D005: Monorepo with Shared Packages

**Date:** January 2026
**Status:** Implemented

**Context:**
Multiple apps need to share code (auth, database schema).

**Decision:**
Use a monorepo with shared packages in `packages/` folder.

**Structure:**
```
Journal/
├── homepage/
├── goal-setter/
├── time-views/
└── packages/
    ├── auth/      → @mow/auth
    └── database/  → @mow/database
```

**Rationale:**
- Code sharing without publishing to npm
- Single git repo for all related code
- Easier to make cross-cutting changes
- Shared Prisma schema ensures consistency

**Package Linking:**
Using `file:` protocol in package.json (npm compatible):
```json
{
  "dependencies": {
    "@mow/auth": "file:../packages/auth",
    "@mow/database": "file:../packages/database"
  }
}
```

---

## D006: Nginx Proxy Manager for Routing

**Date:** 2025 (pre-existing)
**Status:** Implemented

**Context:**
Need to route multiple subdomains to different app ports.

**Decision:**
Use Nginx Proxy Manager (Docker) for reverse proxy and SSL.

**Rationale:**
- Web UI for easy management
- Automatic Let's Encrypt SSL
- Handles HTTP → HTTPS redirect
- Centralized routing configuration

**Implementation:**
- NPM runs in Docker
- Uses Docker bridge IP (172.17.0.1) to reach host apps
- Each subdomain configured as a proxy host
- SSL certificates auto-renewed

---

## D007: User Products Table for Access Control

**Date:** January 2026
**Status:** Planned

**Context:**
Need to track which products each user has access to (free, purchased, subscription).

**Decision:**
Create `user_products` table linked to `auth_users`.

**Schema:**
```prisma
model UserProduct {
  id          String    @id @default(cuid())
  userId      String
  product     String    // goal_setter, time_views, journal, wallpaper_pack_1
  accessType  String    // free, purchased, trial, subscription
  grantedAt   DateTime  @default(now())
  expiresAt   DateTime? // null for lifetime/free

  user        AuthUser  @relation(...)

  @@unique([userId, product])
}
```

**Rationale:**
- Track access without hardcoding
- Support different access types
- Enable time-limited trials/subscriptions
- Foundation for future payments

---

## D008: OAuth Support (Future-Ready)

**Date:** January 2026
**Status:** Planned

**Context:**
May want to add Google/GitHub login in future.

**Decision:**
Design auth system to support multiple providers.

**Approach:**
Identity (auth_users) is separate from authentication method. Can add provider columns or a separate providers table without changing core auth flow.

**No changes needed now** - current magic link system is compatible with adding OAuth later.
