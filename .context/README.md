# Man of Wisdom (MoW) - Project Context

> This folder contains essential project knowledge to maintain context across sessions.

## Quick Reference

| Resource | Value |
|----------|-------|
| **SSH Access** | `ssh hetzner` |
| **Database** | PostgreSQL `mow_journal` on localhost:5432 |
| **DB User** | `mow_journal_user` |
| **Domain** | manofwisdom.co (Cloudflare DNS) |
| **Proxy** | Nginx Proxy Manager (Docker) |
| **Email** | Resend API |

## Products / Apps

| App | Port | Subdomain | Status |
|-----|------|-----------|--------|
| Homepage | 3003 | manofwisdom.co | Live |
| Goal Setter | 3002 | goals.manofwisdom.co | Live |
| Time Views | 3004 | time.manofwisdom.co | Live |
| Journal | TBD | journal.manofwisdom.co | Planned |

## Tech Stack

- **Framework**: Next.js 16.1.1
- **React**: 19.2.3
- **Database**: PostgreSQL + Prisma 6.x
- **Styling**: Tailwind CSS 4
- **Process Manager**: PM2
- **Hosting**: Hetzner VPS
- **DNS/CDN**: Cloudflare
- **Reverse Proxy**: Nginx Proxy Manager (Docker at 172.17.0.1)
- **Email**: Resend API

## Repository Structure

```
Journal/
├── homepage/           # Main landing page (port 3003)
├── goal-setter/        # Goal setting app (port 3002)
├── time-views/         # Time tracking app (port 3004)
├── packages/
│   ├── auth/           # Shared authentication (@mow/auth)
│   └── database/       # Shared Prisma schema (@mow/database)
└── .context/           # Project documentation (this folder)
```

## Key Files

- **Shared Auth**: `packages/auth/src/`
- **Database Schema**: `packages/database/prisma/schema.prisma`
- **PM2 Configs**: `*/ecosystem.config.js`

## Context Documents

- [Infrastructure](./infrastructure.md) - Server, hosting, services
- [Architecture](./architecture.md) - Database, auth, app structure
- [Decisions](./decisions.md) - Decision log with rationale
- [Roadmap](./roadmap.md) - Current and planned work

## Common Commands

```bash
# SSH to server
ssh hetzner

# Deploy an app
ssh hetzner 'cd /var/www/Journal/<app> && git pull && npm run build && pm2 restart <app-name>'

# Check PM2 status
ssh hetzner 'pm2 list'

# Database queries
ssh hetzner 'sudo -u postgres psql -d mow_journal -c "SELECT * FROM auth_users;"'

# Check logs
ssh hetzner 'pm2 logs <app-name> --lines 50'

# Restart all apps
ssh hetzner 'pm2 restart all'
```
