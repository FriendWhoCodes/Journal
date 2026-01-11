# Cloudflare Setup for DDoS Protection

Cloudflare provides free DDoS protection, CDN, and WAF (Web Application Firewall) for your domain.

## Benefits

- ✅ **DDoS Protection** - Automatic mitigation of attacks
- ✅ **CDN** - Faster page loads globally
- ✅ **SSL/TLS** - Free SSL certificates
- ✅ **WAF** - Web Application Firewall
- ✅ **Bot Protection** - Block malicious bots
- ✅ **Analytics** - Traffic insights
- ✅ **Caching** - Reduced server load

---

## Step 1: Sign Up for Cloudflare

1. Go to https://dash.cloudflare.com/sign-up
2. Create a free account
3. Verify your email

---

## Step 2: Add Your Domain

1. Click **"Add a Site"**
2. Enter your domain: `manofwisdom.co`
3. Click **"Add site"**
4. Select **"Free"** plan
5. Click **"Continue"**

---

## Step 3: Review DNS Records

Cloudflare will scan your current DNS records. You should see:

```
Type    Name                Value              Proxy Status
A       manofwisdom.co      94.130.97.253     Proxied (orange cloud)
A       goals               94.130.97.253     Proxied (orange cloud)
```

**Important:** Make sure the orange cloud icon is ON (Proxied) for DDoS protection.

---

## Step 4: Update Nameservers

Cloudflare will provide two nameservers like:

```
alex.ns.cloudflare.com
betty.ns.cloudflare.com
```

### Update at Your Domain Registrar:

1. Log in to your domain registrar (where you bought `manofwisdom.co`)
2. Find DNS/Nameserver settings
3. Replace current nameservers with Cloudflare's nameservers
4. Save changes

**Note:** DNS propagation takes 24-48 hours (usually faster)

---

## Step 5: Configure Cloudflare Settings

### SSL/TLS Settings

1. Go to **SSL/TLS** tab
2. Set encryption mode to **"Full (strict)"**
3. Enable **"Always Use HTTPS"**
4. Enable **"Automatic HTTPS Rewrites"**

### Security Settings

1. Go to **Security** → **Settings**
2. Set Security Level to **"Medium"** or **"High"**
3. Enable **"Browser Integrity Check"**
4. Enable **"Challenge Passage"**: 30 minutes

### Firewall Rules (Recommended)

Create rules to block common attacks:

#### Rule 1: Block Bad Bots
```
Field: User Agent
Operator: contains
Value: curl
Action: Block
```

#### Rule 2: Rate Limiting (Supplement your app-level rate limiting)
1. Go to **Security** → **WAF** → **Rate limiting rules**
2. Create rule:
   - **If incoming requests match:** All traffic
   - **When rate exceeds:** 100 requests per minute
   - **Then:** Block for 1 hour
   - **Characteristics:** IP Address

---

## Step 6: Create Subdomain for Goal Setter

Since `manofwisdom.co` is WordPress, we need `goals.manofwisdom.co` for the Goal Setter app:

1. Go to **DNS** tab
2. Click **"Add record"**
3. Configure:
   ```
   Type: A
   Name: goals
   IPv4 address: 94.130.97.253
   Proxy status: Proxied (orange cloud ON)
   TTL: Auto
   ```
4. Click **"Save"**

---

## Step 7: Update Server Configuration

### On Your Hetzner Server:

#### 1. Create Nginx Configuration for Subdomain

```bash
sudo nano /etc/nginx/sites-available/goals.manofwisdom.co
```

Add:

```nginx
server {
    listen 80;
    server_name goals.manofwisdom.co;

    # Cloudflare real IP (important for rate limiting)
    set_real_ip_from 173.245.48.0/20;
    set_real_ip_from 103.21.244.0/22;
    set_real_ip_from 103.22.200.0/22;
    set_real_ip_from 103.31.4.0/22;
    set_real_ip_from 141.101.64.0/18;
    set_real_ip_from 108.162.192.0/18;
    set_real_ip_from 190.93.240.0/20;
    set_real_ip_from 188.114.96.0/20;
    set_real_ip_from 197.234.240.0/22;
    set_real_ip_from 198.41.128.0/17;
    set_real_ip_from 162.158.0.0/15;
    set_real_ip_from 104.16.0.0/13;
    set_real_ip_from 104.24.0.0/14;
    set_real_ip_from 172.64.0.0/13;
    set_real_ip_from 131.0.72.0/22;
    set_real_ip_from 2400:cb00::/32;
    set_real_ip_from 2606:4700::/32;
    set_real_ip_from 2803:f800::/32;
    set_real_ip_from 2405:b500::/32;
    set_real_ip_from 2405:8100::/32;
    set_real_ip_from 2a06:98c0::/29;
    set_real_ip_from 2c0f:f248::/32;
    real_ip_header CF-Connecting-IP;

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

#### 2. Enable the Site

```bash
sudo ln -s /etc/nginx/sites-available/goals.manofwisdom.co /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

#### 3. Install SSL Certificate (Let's Encrypt)

```bash
sudo certbot --nginx -d goals.manofwisdom.co
```

Follow prompts:
- Enter email
- Agree to terms
- Choose "Redirect HTTP to HTTPS" (option 2)

---

## Step 8: Test Configuration

1. **Test DNS Resolution:**
   ```bash
   nslookup goals.manofwisdom.co
   ```
   Should return Cloudflare IP (not your server IP directly)

2. **Test HTTPS:**
   ```bash
   curl -I https://goals.manofwisdom.co
   ```
   Should return 200 OK with Cloudflare headers

3. **Test Rate Limiting:**
   Send 100+ requests rapidly and verify rate limiting works

---

## Step 9: Enable Additional Cloudflare Features

### Under Attack Mode (Emergency Use Only)
If under heavy DDoS:
1. Go to **Overview**
2. Click **"Under Attack Mode"** toggle
3. Cloudflare will show challenge page to all visitors

### Bot Fight Mode
1. Go to **Security** → **Bots**
2. Enable **"Bot Fight Mode"** (Free plan)
3. Blocks known bad bots automatically

### Cache Everything
1. Go to **Caching** → **Configuration**
2. Create Page Rule:
   - URL: `goals.manofwisdom.co/*`
   - Setting: **Cache Level** → **Cache Everything**
   - Edge Cache TTL: 2 hours

---

## Monitoring & Maintenance

### Check Analytics
- Go to **Analytics & Logs** → **Traffic**
- Monitor blocked threats, bandwidth saved

### Review Security Events
- Go to **Security** → **Events**
- See blocked IPs, countries, user agents

### Email Alerts
- Go to **Notifications**
- Enable alerts for:
  - DDoS attacks
  - High error rates
  - SSL/TLS issues

---

## Important Notes

1. **WordPress vs Goal Setter:**
   - `manofwisdom.co` → WordPress (existing setup)
   - `goals.manofwisdom.co` → Goal Setter app (port 3002)
   - Both protected by Cloudflare

2. **Real IP Detection:**
   - Nginx config includes Cloudflare IP ranges
   - Ensures rate limiting uses real visitor IPs

3. **SSL Certificates:**
   - Cloudflare provides SSL (browser → Cloudflare)
   - Let's Encrypt provides SSL (Cloudflare → server)
   - Both needed for end-to-end encryption

4. **DNS Propagation:**
   - Changes take 24-48 hours to propagate globally
   - Can test with `dig goals.manofwisdom.co`

---

## Troubleshooting

### Site Not Loading After Setup
- Check nginx status: `sudo systemctl status nginx`
- Check Cloudflare DNS: Ensure proxy is enabled (orange cloud)
- Check SSL mode: Should be "Full (strict)"

### Too Many Redirects
- Ensure SSL mode is **not** "Flexible"
- Use "Full (strict)" mode

### Rate Limiting Not Working
- Check nginx real_ip_from directives
- Verify CF-Connecting-IP header is set

---

## Cost

**Free Plan Includes:**
- Unlimited DDoS protection
- Global CDN
- Free SSL certificates
- Firewall rules (5 rules)
- Page Rules (3 rules)
- Web Analytics

**No credit card required!**

---

## Next Steps After Setup

1. ✅ Install CodeRabbit GitHub App
2. ✅ Update `manofwisdom.co/tablet-journal` page (for Tablet Edition)
3. ✅ Test subdomain: https://goals.manofwisdom.co
4. ✅ Monitor Cloudflare dashboard for threats
5. ✅ Set up automated backups (PostgreSQL)
