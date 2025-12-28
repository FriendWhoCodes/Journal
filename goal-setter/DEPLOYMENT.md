# Goal Setter - Deployment Guide (Hetzner VPS)

This guide will help you deploy the Goal Setter app to your Hetzner server with CI/CD automation.

## Prerequisites

- Hetzner VPS with Ubuntu/Debian
- Node.js 18+ installed
- PM2 installed globally (`npm install -g pm2`)
- Nginx installed
- Domain/subdomain configured (e.g., goals.manofwisdom.co)

---

## Initial Server Setup

### 1. Connect to Your Hetzner Server

```bash
ssh your_user@your_server_ip
```

### 2. Install Required Software

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install Nginx (if not already installed)
sudo apt install -y nginx

# Install Git (if not already installed)
sudo apt install -y git
```

### 3. Create Application Directory

```bash
sudo mkdir -p /var/www/goal-setter
sudo chown -R $USER:$USER /var/www/goal-setter
```

### 4. Clone Repository

```bash
cd /var/www
git clone https://github.com/FriendWhoCodes/Journal.git goal-setter
cd goal-setter/goal-setter
```

### 5. Install Dependencies & Build

```bash
npm install
npm run build
```

### 6. Set Up Environment Variables

```bash
# Create .env.production file
nano .env.production
```

Add:
```env
NODE_ENV=production
DATABASE_URL="postgresql://user:password@localhost:5432/goal_setter"
```

### 7. Start with PM2

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup  # Follow the instructions it provides
```

---

## Nginx Configuration

### 1. Create Nginx Config

```bash
sudo nano /etc/nginx/sites-available/goals.manofwisdom.co
```

Copy the content from `nginx.conf.example` file in this directory.

### 2. Enable the Site

```bash
sudo ln -s /etc/nginx/sites-available/goals.manofwisdom.co /etc/nginx/sites-enabled/
```

### 3. Test Nginx Configuration

```bash
sudo nginx -t
```

### 4. Restart Nginx

```bash
sudo systemctl restart nginx
```

---

## SSL Certificate (Let's Encrypt)

### 1. Install Certbot

```bash
sudo apt install -y certbot python3-certbot-nginx
```

### 2. Get SSL Certificate

```bash
sudo certbot --nginx -d goals.manofwisdom.co
```

Follow the prompts. Certbot will automatically configure Nginx for HTTPS.

### 3. Auto-Renewal

```bash
# Test renewal
sudo certbot renew --dry-run

# Certbot automatically creates a cron job for renewal
```

---

## GitHub Actions CI/CD Setup

### 1. Generate SSH Key on Hetzner Server

```bash
ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/github_actions
```

### 2. Add Public Key to Authorized Keys

```bash
cat ~/.ssh/github_actions.pub >> ~/.ssh/authorized_keys
```

### 3. Get Private Key

```bash
cat ~/.ssh/github_actions
```

Copy the entire private key (including `-----BEGIN` and `-----END` lines).

### 4. Add Secrets to GitHub Repository

Go to your GitHub repository:
1. Settings → Secrets and variables → Actions
2. Add the following secrets:

| Secret Name | Value |
|-------------|-------|
| `HETZNER_HOST` | Your server IP address |
| `HETZNER_USER` | Your SSH username (e.g., `root` or your user) |
| `HETZNER_SSH_KEY` | The private key from step 3 |
| `HETZNER_PORT` | SSH port (default: `22`) |

### 5. Make Deploy Script Executable

```bash
chmod +x /var/www/goal-setter/goal-setter/scripts/deploy.sh
```

### 6. Test Deployment

Push a change to the `main` branch and watch the GitHub Actions workflow run!

---

## DNS Configuration

### 1. Add A Record for Subdomain

In your domain registrar (e.g., Namecheap, GoDaddy):

| Type | Host | Value | TTL |
|------|------|-------|-----|
| A | goals | YOUR_SERVER_IP | 300 |

Or if using Cloudflare:
1. Go to DNS → Records
2. Add A record:
   - Name: `goals`
   - IPv4 address: YOUR_SERVER_IP
   - Proxy status: Proxied (orange cloud) or DNS only

Wait 5-15 minutes for DNS propagation.

### 2. Verify DNS

```bash
dig goals.manofwisdom.co
# or
nslookup goals.manofwisdom.co
```

---

## Monitoring & Maintenance

### Check PM2 Status

```bash
pm2 status
pm2 logs goal-setter
pm2 monit
```

### Restart Application

```bash
pm2 restart goal-setter
```

### View Nginx Logs

```bash
sudo tail -f /var/log/nginx/goals.manofwisdom.co-access.log
sudo tail -f /var/log/nginx/goals.manofwisdom.co-error.log
```

### Manual Deployment

If you need to deploy manually:

```bash
cd /var/www/goal-setter
bash goal-setter/scripts/deploy.sh
```

---

## Troubleshooting

### App Not Starting

```bash
# Check PM2 logs
pm2 logs goal-setter --lines 100

# Check if port 3001 is in use
sudo lsof -i :3001

# Restart PM2
pm2 restart goal-setter
```

### Nginx 502 Bad Gateway

```bash
# Check if PM2 app is running
pm2 status

# Check Nginx error logs
sudo tail -f /var/log/nginx/error.log

# Restart both
pm2 restart goal-setter
sudo systemctl restart nginx
```

### SSL Issues

```bash
# Renew certificate manually
sudo certbot renew --force-renewal

# Check certificate expiry
sudo certbot certificates
```

### GitHub Actions Failing

1. Check if SSH key is correct in GitHub secrets
2. Verify server allows SSH key authentication
3. Check deploy script permissions: `chmod +x scripts/deploy.sh`
4. View GitHub Actions logs for detailed error

---

## Performance Optimization

### Enable PM2 Cluster Mode

Edit `ecosystem.config.js`:
```javascript
instances: 'max', // Use all CPU cores
```

Then:
```bash
pm2 reload goal-setter
```

### Enable Nginx Caching

Already configured in `nginx.conf.example` for static assets.

### Database Optimization

If using PostgreSQL locally:
```bash
sudo apt install -y postgresql
sudo systemctl enable postgresql
sudo systemctl start postgresql
```

Create database:
```bash
sudo -u postgres createdb goal_setter
sudo -u postgres psql -c "CREATE USER goal_user WITH PASSWORD 'your_password';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE goal_setter TO goal_user;"
```

Update `.env.production` with the correct DATABASE_URL.

---

## Security Checklist

- [ ] Firewall configured (UFW):
  ```bash
  sudo ufw allow 22/tcp
  sudo ufw allow 80/tcp
  sudo ufw allow 443/tcp
  sudo ufw enable
  ```
- [ ] SSH key-based authentication enabled
- [ ] Password authentication disabled
- [ ] Fail2ban installed (optional but recommended)
- [ ] Regular security updates:
  ```bash
  sudo apt update && sudo apt upgrade
  ```

---

## Backup Strategy

### Database Backup

```bash
# Create backup script
nano ~/backup-db.sh
```

Add:
```bash
#!/bin/bash
pg_dump goal_setter > /backups/goal_setter_$(date +%Y%m%d).sql
# Keep only last 7 days
find /backups -name "goal_setter_*.sql" -mtime +7 -delete
```

```bash
chmod +x ~/backup-db.sh
# Add to cron
crontab -e
# Add: 0 2 * * * /home/your_user/backup-db.sh
```

### Code Backup

Your code is already backed up in Git. Just ensure you commit and push regularly.

---

## Next Steps

1. ✅ Set up monitoring (optional): Install tools like Netdata or PM2 Plus
2. ✅ Configure email notifications for deployment status
3. ✅ Set up database (if needed for future features)
4. ✅ Add analytics (Google Analytics, Plausible, etc.)

---

## Support

If you encounter issues:
1. Check PM2 logs: `pm2 logs goal-setter`
2. Check Nginx logs: `sudo tail -f /var/log/nginx/error.log`
3. Review GitHub Actions logs in your repository

---

**Your Goal Setter app should now be live at https://goals.manofwisdom.co! 🎉**
