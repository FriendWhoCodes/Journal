# Goal Setter - Project Status

Last Updated: January 20, 2026

## Overview

Goal Setter is a web application that helps users plan their annual goals for 2026. It serves as a lead generation funnel for the Man of Wisdom Digital Journal SaaS launching February 1st, 2026.

**Live URL:** https://goals.manofwisdom.co

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              INTERNET                                        │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         CLOUDFLARE (CDN/DDoS)                               │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  - DNS Management                                                    │    │
│  │  - DDoS Protection                                                   │    │
│  │  - SSL/TLS Termination (Universal SSL)                              │    │
│  │  - Bot Protection                                                    │    │
│  │  - Caching                                                           │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  DNS Records:                                                                │
│  ├── manofwisdom.co      → 94.130.97.253 (Proxied)                         │
│  └── goals.manofwisdom.co → 94.130.97.253 (Proxied)                         │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    HETZNER VPS (94.130.97.253)                              │
│                         Ubuntu 22.04 LTS                                     │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │              NGINX PROXY MANAGER (Docker)                            │    │
│  │                    Port 80, 443                                      │    │
│  │                                                                      │    │
│  │  Proxy Hosts:                                                        │    │
│  │  ├── manofwisdom.co      → WordPress container                      │    │
│  │  ├── goals.manofwisdom.co → 172.17.0.1:3002 (host)                  │    │
│  │  ├── uptime.manofwisdom.co → Uptime Kuma                            │    │
│  │  └── [other sites...]                                                │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                    │                                         │
│          ┌─────────────────────────┼─────────────────────────┐              │
│          ▼                         ▼                         ▼              │
│  ┌───────────────┐    ┌─────────────────────┐    ┌───────────────────┐     │
│  │   WORDPRESS   │    │    GOAL SETTER      │    │   UPTIME KUMA     │     │
│  │   (Docker)    │    │    (PM2 on Host)    │    │    (Docker)       │     │
│  │               │    │                     │    │                   │     │
│  │ manofwisdom   │    │ Next.js 16.1.1      │    │ Monitoring        │     │
│  │ -wordpress    │    │ Port 3002           │    │ Port 3001         │     │
│  │               │    │                     │    │                   │     │
│  │ MySQL 8.0     │    │ PostgreSQL          │    │                   │     │
│  │ (container)   │    │ (on host)           │    │                   │     │
│  └───────────────┘    └─────────────────────┘    └───────────────────┘     │
│                                    │                                         │
│                                    ▼                                         │
│                       ┌─────────────────────┐                               │
│                       │     POSTGRESQL      │                               │
│                       │   (on host/Docker)  │                               │
│                       │                     │                               │
│                       │ Database: goals_db  │                               │
│                       │ Tables:             │                               │
│                       │ ├── User            │                               │
│                       │ └── Submission      │                               │
│                       └─────────────────────┘                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Technology Stack

### Frontend
- **Framework:** Next.js 16.1.1 (React 19)
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Forms:** React Hook Form + Zod validation
- **PDF Generation:** @react-pdf/renderer

### Backend
- **Runtime:** Node.js (via PM2)
- **Database ORM:** Prisma 6.19.1
- **Database:** PostgreSQL
- **API:** Next.js API Routes

### Infrastructure
- **Server:** Hetzner VPS (Ubuntu 22.04, 4GB RAM)
- **Process Manager:** PM2
- **Reverse Proxy:** Nginx Proxy Manager (Docker)
- **CDN/Security:** Cloudflare (Free plan)
- **SSL:** Let's Encrypt (via NPM) + Cloudflare Universal SSL
- **CI/CD:** GitHub Actions

---

## Current Status

### Completed Features
- [x] Quick Mode (5-min goal setting flow)
- [x] Deep Mode (30-min comprehensive flow with 6 life categories)
- [x] Email collection and data persistence (PostgreSQL)
- [x] PDF export of goals
- [x] Input validation and sanitization
- [x] Rate limiting on API routes
- [x] Security headers (CSP, HSTS, etc.)
- [x] Cloudflare DDoS protection
- [x] Production deployment

### Upcoming Launches
| Product | Launch Date | Status |
|---------|-------------|--------|
| Tablet Edition (PDF journal) | January 21, 2026 | Pre-orders open |
| Digital Journal SaaS | February 1, 2026 | In development |

---

## Deployment

### Server Details
- **IP:** 94.130.97.253
- **Provider:** Hetzner
- **Location:** Germany
- **OS:** Ubuntu 22.04 LTS

### Domains
| Domain | Points To | Purpose |
|--------|-----------|---------|
| manofwisdom.co | WordPress (Docker) | Main website (will become Next.js homepage) |
| blog.manofwisdom.co | WordPress (Docker) | Blog (migrated Jan 20, 2026) |
| goals.manofwisdom.co | Next.js (PM2, port 3002) | Goal Setter app |

### Process Management
```bash
# Check status
pm2 status

# View logs
pm2 logs goal-setter

# Restart app
pm2 restart goal-setter

# Rebuild and deploy
cd /var/www/Journal/goal-setter
git pull origin main
npm run build
pm2 restart goal-setter
```

---

## Configuration Files

| File | Purpose |
|------|---------|
| `.coderabbit.yaml` | CodeRabbit PR review configuration |
| `ecosystem.config.js` | PM2 process configuration |
| `nginx.conf.example` | Nginx config template (if not using NPM) |
| `prisma/schema.prisma` | Database schema |
| `.env` | Environment variables (not in repo) |

---

## Security Measures

- **Cloudflare:** DDoS protection, bot filtering, WAF
- **Rate Limiting:** 60 requests/minute per IP on API routes
- **Headers:** CSP, X-Frame-Options, HSTS, etc.
- **Input Validation:** Server-side Zod validation
- **SQL Injection:** Prisma ORM (parameterized queries)
- **XSS:** Content Security Policy + input sanitization

---

## Monitoring

- **Uptime Kuma:** https://uptime.manofwisdom.co (internal monitoring)
- **PM2:** Process monitoring and auto-restart
- **Cloudflare Analytics:** Traffic and threat monitoring

---

## Known Issues / Technical Debt

1. **Middleware deprecation warning:** Next.js 16 shows warning about middleware → proxy migration
2. **ReferenceError: location is not defined:** SSR warning during build (non-blocking)
3. **Prisma version:** Using 6.19.1, update to 7.x available (breaking changes)

---

## Contact

- **Repository:** https://github.com/FriendWhoCodes/Journal
- **Main Site:** https://manofwisdom.co
