# Goal Setter - Server Reference

Quick reference for server administration and database queries.

---

## Server Details

| Item | Value |
|------|-------|
| **Server IP** | 94.130.97.253 |
| **Provider** | Hetzner |
| **OS** | Ubuntu 22.04 LTS |
| **App Directory** | `/var/www/Journal/goal-setter` |
| **PM2 App Name** | `goal-setter` |
| **App Port** | 3002 |
| **Live URL** | https://goals.manofwisdom.co |

---

## Database Details

| Item | Value |
|------|-------|
| **Database Type** | PostgreSQL |
| **Database Name** | `mow_journal` |
| **Database Owner** | `mow_journal_user` |
| **Tables** | `goal_setter_users`, `goal_setter_submissions` |

---

## Common Commands

### SSH into Server
```bash
ssh root@94.130.97.253
```

### PM2 Commands
```bash
pm2 status                    # Check app status
pm2 logs goal-setter          # View logs
pm2 restart goal-setter       # Restart app
pm2 monit                     # Monitor in real-time
```

### Deploy Updates
```bash
cd /var/www/Journal/goal-setter
git pull origin main
npm run build
pm2 restart goal-setter
```

---

## Database Queries

### List all databases (to find exact name)
```bash
sudo -u postgres psql -c "\l"
```

### Connect to database
```bash
sudo -u postgres psql mow_journal
```

### View all signups
```sql
SELECT id, name, email, created_at
FROM goal_setter_users
ORDER BY created_at DESC;
```

### Count total signups
```sql
SELECT COUNT(*) as total_signups FROM goal_setter_users;
```

### Today's signups
```sql
SELECT id, name, email, created_at
FROM goal_setter_users
WHERE created_at >= CURRENT_DATE
ORDER BY created_at DESC;
```

### View submissions with user details
```sql
SELECT
  u.name,
  u.email,
  s.mode,
  s.goal_1,
  s.goal_2,
  s.goal_3,
  s.created_at
FROM goal_setter_users u
JOIN goal_setter_submissions s ON u.id = s.user_id
ORDER BY s.created_at DESC;
```

### Signups in last 7 days
```sql
SELECT id, name, email, created_at
FROM goal_setter_users
WHERE created_at >= NOW() - INTERVAL '7 days'
ORDER BY created_at DESC;
```

### One-liner from bash (no need to enter psql)
```bash
sudo -u postgres psql mow_journal -c "SELECT id, name, email, created_at FROM goal_setter_users ORDER BY created_at DESC;"
```

---

## Site Analytics

### Cloudflare Analytics
1. Go to: https://dash.cloudflare.com
2. Select zone: manofwisdom.co
3. Analytics & Logs → Traffic
4. Filter by hostname: `goals.manofwisdom.co`

### Nginx Access Logs
```bash
# Count total requests today
grep "$(date +%d/%b/%Y)" /var/log/nginx/access.log | grep "goals" | wc -l

# Unique visitors today
grep "$(date +%d/%b/%Y)" /var/log/nginx/access.log | grep "goals" | awk '{print $1}' | sort -u | wc -l

# Recent requests
tail -50 /var/log/nginx/access.log | grep "goals"
```

---

## Troubleshooting

### Check if app is running
```bash
pm2 status
curl localhost:3002
```

### Check database connection
```bash
sudo -u postgres psql -c "\l" | grep goal
```

### View PM2 error logs
```bash
tail -100 /var/log/pm2/goal-setter-error.log
```

---

*Last updated: January 2026*
