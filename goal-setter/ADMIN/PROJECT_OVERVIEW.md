# Goal Setter - Project Overview

Complete technical reference for the Goal Setter application.

---

## Repo Structure

### Is it a monorepo or single app?
**Monorepo** - The `Journal` repository contains multiple projects:

```
Journal/                        ← Root repo
├── goal-setter/                ← Goal Setter Next.js app
│   ├── ADMIN/                  ← Admin/ops documentation
│   ├── app/                    ← Next.js App Router pages
│   │   ├── api/                ← API routes
│   │   ├── deep/               ← Deep mode flow
│   │   ├── quick/              ← Quick mode flow
│   │   └── summary/            ← Summary page
│   ├── lib/                    ← Shared utilities
│   │   ├── context/            ← React context providers
│   │   └── pdf/                ← PDF generation
│   ├── prisma/                 ← Database schema
│   ├── public/                 ← Static assets
│   ├── scripts/                ← Deployment scripts
│   ├── types/                  ← TypeScript types
│   └── docs/                   ← Technical documentation
├── docs/                       ← Root-level docs
├── .github/workflows/          ← CI/CD workflows
├── PRD.md                      ← Product Requirements Document
└── node_modules/               ← Dependencies
```

### Framework Setup
- **Framework:** Next.js 16.1.1
- **React:** 19
- **Router:** App Router (not Pages Router)
- **Styling:** Tailwind CSS
- **Language:** TypeScript
- **PDF Generation:** @react-pdf/renderer
- **Forms:** React Hook Form + Zod validation
- **Animations:** Framer Motion

---

## Deployment

### Deploy Method
**PM2** (Process Manager) - not Docker, not systemd

**PM2 Config:** `goal-setter/ecosystem.config.js`
```javascript
module.exports = {
  apps: [{
    name: 'goal-setter',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/Journal/goal-setter',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: 3002,
    },
    error_file: '/var/log/pm2/goal-setter-error.log',
    out_file: '/var/log/pm2/goal-setter-out.log',
  }]
}
```

### Server Path
```
/var/www/Journal/goal-setter
```

### Deploy Commands
```bash
cd /var/www/Journal/goal-setter
git pull origin main
npm run build
pm2 restart goal-setter
```

### Nginx Config
**Note:** Actually using Nginx Proxy Manager (Docker), but here's the example config:

```nginx
server {
    listen 80;
    server_name goals.manofwisdom.co;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name goals.manofwisdom.co;

    # SSL certificates (Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/goals.manofwisdom.co/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/goals.manofwisdom.co/privkey.pem;

    # Proxy to Next.js app
    location / {
        proxy_pass http://localhost:3002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**Actual Setup:** Nginx Proxy Manager (Docker container: `nginx-proxy-manager`) proxies `goals.manofwisdom.co` → `172.17.0.1:3002`

---

## Database

### Database Details
| Item | Value |
|------|-------|
| **Type** | PostgreSQL |
| **Database Name** | `mow_journal` |
| **Database Owner** | `mow_journal_user` |
| **ORM** | Prisma 6.x |

### Tables in Postgres

**1. goal_setter_users**
```sql
id          SERIAL PRIMARY KEY
email       VARCHAR(255) UNIQUE NOT NULL
name        VARCHAR(255) NOT NULL
created_at  TIMESTAMP DEFAULT NOW()
updated_at  TIMESTAMP DEFAULT NOW()
```

**2. goal_setter_submissions**
```sql
id                  SERIAL PRIMARY KEY
user_id             INT REFERENCES goal_setter_users(id) ON DELETE CASCADE
mode                VARCHAR(10)  -- 'quick' | 'deep'
goal_1              TEXT
goal_2              TEXT
goal_3              TEXT
habits_to_build     JSONB
habits_to_break     JSONB
main_theme          TEXT
deep_mode_data      JSONB
places_to_visit     TEXT
books_to_read       TEXT
movies_to_watch     TEXT
experiences_to_have TEXT
created_at          TIMESTAMP DEFAULT NOW()
updated_at          TIMESTAMP DEFAULT NOW()
```

### How Goal Setter Handles Users
1. User enters name + email on the form
2. On submission, API creates/finds user in `goal_setter_users`
3. Goals data saved to `goal_setter_submissions` linked by `user_id`
4. No authentication - email-based identification only
5. Prisma ORM handles all database operations

### Query Examples
```bash
# Connect
sudo -u postgres psql mow_journal

# List tables
\dt

# View users
SELECT * FROM goal_setter_users;

# View submissions with user info
SELECT u.name, u.email, s.mode, s.goal_1
FROM goal_setter_users u
JOIN goal_setter_submissions s ON u.id = s.user_id;
```

---

## WordPress

### Same VPS or Different Server?
**Same VPS** - Everything runs on one Hetzner server

| Service | Setup |
|---------|-------|
| WordPress | Docker container (`manofwisdom-wordpress`) |
| MySQL | Docker container (for WordPress) |
| Goal Setter | PM2 on host (not Docker) |
| PostgreSQL | Running on host (for Goal Setter) |
| Nginx Proxy Manager | Docker container |

### Current Blog URL Structure
- **Main site:** https://manofwisdom.co (WordPress)
- **Goal Setter:** https://goals.manofwisdom.co (Next.js)

WordPress handles: Blog posts, main website, landing pages
Goal Setter handles: Goal setting app functionality

---

## DNS

### Provider
**Cloudflare** (Free plan)

### DNS Records
| Type | Name | Value | Proxy |
|------|------|-------|-------|
| A | manofwisdom.co | 94.130.97.253 | Proxied ☁️ |
| A | goals | 94.130.97.253 | Proxied ☁️ |

### Cloudflare Features in Use
- DNS Management
- DDoS Protection
- SSL/TLS (Universal SSL)
- Caching
- Bot Protection
- Analytics

---

## Server Details

| Item | Value |
|------|-------|
| **IP Address** | 94.130.97.253 |
| **Provider** | Hetzner |
| **Location** | Germany |
| **OS** | Ubuntu 22.04 LTS |
| **RAM** | 4GB |

### Services Running
```
┌─────────────────────────────────────────────────────────┐
│                    Hetzner VPS                          │
│                                                         │
│  ┌─────────────────┐  ┌─────────────────────────────┐  │
│  │ Nginx Proxy Mgr │  │      Goal Setter (PM2)      │  │
│  │    (Docker)     │  │    Port 3002 (Next.js)      │  │
│  │   Port 80/443   │  │                             │  │
│  └────────┬────────┘  └─────────────────────────────┘  │
│           │                        │                    │
│           │           ┌────────────┴────────────┐      │
│           │           │      PostgreSQL         │      │
│           │           │    DB: mow_journal      │      │
│           │           └─────────────────────────┘      │
│           │                                             │
│  ┌────────┴────────┐  ┌─────────────────────────────┐  │
│  │    WordPress    │  │       Uptime Kuma           │  │
│  │    (Docker)     │  │        (Docker)             │  │
│  │                 │  │       Port 3001             │  │
│  └─────────────────┘  └─────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

---

## Quick Reference

### SSH Access
```bash
ssh root@94.130.97.253
```

### Check App Status
```bash
pm2 status
pm2 logs goal-setter
```

### Deploy Updates
```bash
cd /var/www/Journal/goal-setter
git pull origin main
npm run build
pm2 restart goal-setter
```

### Database Queries
```bash
sudo -u postgres psql mow_journal -c "SELECT * FROM goal_setter_users;"
```

### Live URLs
- **Goal Setter:** https://goals.manofwisdom.co
- **Main Site:** https://manofwisdom.co
- **Uptime Monitor:** https://uptime.manofwisdom.co

---

*Last updated: January 2026*
