# Admin & Operations

This folder contains operational documentation for managing the Goal Setter application.

## Quick Links

| Document | Description |
|----------|-------------|
| [SERVER_REFERENCE.md](./SERVER_REFERENCE.md) | Server details, DB queries, common commands |

## Quick Commands

**SSH into server:**
```bash
ssh root@94.130.97.253
```

**Check signups:**
```bash
sudo -u postgres psql mow_journal -c "SELECT id, name, email, created_at FROM goal_setter_users ORDER BY created_at DESC;"
```

**Restart app:**
```bash
cd /var/www/Journal/goal-setter && git pull origin main && npm run build && pm2 restart goal-setter
```

**Check Cloudflare Analytics:**
https://dash.cloudflare.com → manofwisdom.co → Analytics & Logs → Traffic
