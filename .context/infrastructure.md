# Infrastructure

## Server

| Property | Value |
|----------|-------|
| Provider | Hetzner |
| SSH Access | `ssh hetzner` (configured in ~/.ssh/config) |
| Web Root | `/var/www/Journal` |
| OS | Linux (Debian/Ubuntu) |

## Database

| Property | Value |
|----------|-------|
| Type | PostgreSQL |
| Database | `mow_journal` |
| User | `mow_journal_user` |
| Host | localhost:5432 |

### Access Commands

```bash
# Run SQL query
ssh hetzner 'sudo -u postgres psql -d mow_journal -c "YOUR QUERY HERE;"'

# Interactive psql
ssh hetzner 'sudo -u postgres psql -d mow_journal'

# List tables
ssh hetzner 'sudo -u postgres psql -d mow_journal -c "\dt"'
```

## Nginx Proxy Manager

- Runs in Docker
- Dashboard accessible on server (port 81)
- Uses Docker bridge IP: `172.17.0.1` to reach host apps

### Proxy Hosts

| Domain | Target |
|--------|--------|
| manofwisdom.co | http://172.17.0.1:3003 |
| goals.manofwisdom.co | http://172.17.0.1:3002 |
| time.manofwisdom.co | http://172.17.0.1:3004 |

### SSL

- Let's Encrypt certificates via Nginx Proxy Manager
- Auto-renewal configured

## Cloudflare

- DNS management for manofwisdom.co
- All subdomains point to Hetzner server IP
- Proxy enabled (orange cloud)

## Firewall (UFW)

Allowed ports:
- 22 (SSH)
- 80 (HTTP)
- 443 (HTTPS) - handled by Nginx Proxy Manager
- 3002, 3003, 3004 (App ports - needed for Docker bridge access)

```bash
# Check UFW status
ssh hetzner 'sudo ufw status'

# Allow new port
ssh hetzner 'sudo ufw allow 3005/tcp'
```

## PM2 Process Manager

### Current Processes

| ID | Name | Port |
|----|------|------|
| 5 | goal-setter | 3002 |
| 6 | mow-homepage | 3003 |
| 7 | time-views | 3004 |

### Commands

```bash
# List processes
ssh hetzner 'pm2 list'

# Restart app
ssh hetzner 'pm2 restart <app-name>'

# View logs
ssh hetzner 'pm2 logs <app-name> --lines 50'

# Save process list (persist after reboot)
ssh hetzner 'pm2 save'
```

## Email Service (Resend)

| Property | Value |
|----------|-------|
| Provider | Resend (resend.com) |
| Domain | manofwisdom.co (verified) |
| From Address | noreply@manofwisdom.co |

### Environment Variables

```env
RESEND_API_KEY=re_xxxxx          # API key for sending
RESEND_SEGMENT_ID=ad585979-...   # Newsletter segment ID
```

### Quotas (Free Tier)

- Transactional: 3,000 emails/month, 100/day
- Marketing (Segments): Unlimited sends to 1,000 contacts

### Newsletter Segment

- Name: "Man of Wisdom Newsletter"
- ID: `ad585979-cd98-4484-a5ee-ba7b86f6fdf0`
- Auto-sync: New signups via shared auth are added automatically

## Environment Variables

Each app has its own `.env` file in `/var/www/Journal/<app>/.env`

### Common Variables

```env
DATABASE_URL="postgresql://mow_journal_user:PASSWORD@localhost:5432/mow_journal"
NEXT_PUBLIC_APP_URL="https://<subdomain>.manofwisdom.co"
RESEND_API_KEY="re_xxxxx"
RESEND_SEGMENT_ID="ad585979-cd98-4484-a5ee-ba7b86f6fdf0"
```

## Deployment Flow

1. Push to GitHub (main branch)
2. SSH to server
3. Git pull
4. npm install (if deps changed)
5. npm run build
6. pm2 restart

```bash
# Standard deploy command
ssh hetzner 'cd /var/www/Journal/<app> && git pull && npm run build && pm2 restart <app-name>'
```

## Adding a New App

1. Create Next.js app in repo
2. Add ecosystem.config.js with unique port
3. Push to GitHub
4. On server:
   - `cd /var/www/Journal/<app>`
   - `npm install`
   - Create `.env` file
   - `npm run build`
   - `pm2 start ecosystem.config.js`
   - `pm2 save`
5. Add UFW rule: `sudo ufw allow <port>/tcp`
6. Add Nginx Proxy Manager host for subdomain
7. Configure SSL in Nginx Proxy Manager
8. Add DNS record in Cloudflare
