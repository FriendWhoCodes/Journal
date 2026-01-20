# Man of Wisdom - Implementation Guide (Week of Jan 19-25, 2026)

**Purpose:** Step-by-step implementation tasks for Claude Code  
**Owner:** Alok Sharma  
**Created:** January 19, 2026  

---

## Current Infrastructure (Confirmed)

| Component | Details |
|-----------|---------|
| **Server** | Hetzner VPS - 94.130.97.253 |
| **Repo** | Monorepo `Journal/` with `goal-setter/` inside |
| **Framework** | Next.js 16.1.1 + App Router + React 19 + Tailwind |
| **Deploy Method** | PM2 on host |
| **Server Path** | `/var/www/Journal/goal-setter` |
| **Proxy** | Nginx Proxy Manager (Docker container) |
| **Database** | PostgreSQL `mow_journal` with Prisma ORM |
| **WordPress** | Docker container `manofwisdom-wordpress` |
| **DNS** | Cloudflare (proxied) |
| **SSL** | Let's Encrypt via Nginx Proxy Manager |

---

## This Week's Goals

| # | Task | Priority | Est. Time |
|---|------|----------|-----------|
| 1 | Move WordPress blog to `blog.manofwisdom.co` | HIGH | 1-2 hours |
| 2 | Create new homepage at `manofwisdom.co` | HIGH | 4-6 hours |
| 3 | Set up CI/CD for homepage | MEDIUM | 1 hour |
| 4 | Test and verify all URLs | HIGH | 30 mins |

---

## TASK 1: Move WordPress to Subdomain

### Goal
```
BEFORE:
manofwisdom.co → WordPress (blog + everything)

AFTER:
manofwisdom.co → New Next.js homepage (products)
blog.manofwisdom.co → WordPress (blog only)
```

### Step 1.1: Add DNS Record in Cloudflare

**Action:** Add A record for blog subdomain

```
Type: A
Name: blog
Content: 94.130.97.253
Proxy status: Proxied (orange cloud)
TTL: Auto
```

**Confirmation Questions for Claude Code:**
- [ ] Can you verify the current DNS records for manofwisdom.co?
- [ ] Is Cloudflare configured correctly for the main domain?

---

### Step 1.2: Configure Nginx Proxy Manager

**Action:** Add new proxy host for blog subdomain

**Login:** Access Nginx Proxy Manager (usually at server-ip:81 or via existing proxy)

**New Proxy Host Settings:**
```
Domain Names: blog.manofwisdom.co
Scheme: http
Forward Hostname/IP: manofwisdom-wordpress (Docker container name)
                     OR 172.17.0.x (Docker internal IP)
Forward Port: 80
Block Common Exploits: ON
Websockets Support: OFF

SSL Tab:
- Request new SSL certificate
- Force SSL: ON
- HTTP/2 Support: ON
- Email: your-email@domain.com
```

**Confirmation Questions for Claude Code:**
- [ ] What is the Docker container name for WordPress? (`docker ps`)
- [ ] What is the internal IP of WordPress container? (`docker inspect <container>`)
- [ ] Can you show the current Nginx Proxy Manager hosts?

---

### Step 1.3: Update WordPress Configuration

**Option A: Via WordPress Admin**
1. Login to WordPress admin (manofwisdom.co/wp-admin)
2. Go to Settings → General
3. Update both URLs:
   - WordPress Address (URL): `https://blog.manofwisdom.co`
   - Site Address (URL): `https://blog.manofwisdom.co`
4. Save Changes

**Option B: Via Database (if locked out)**
```sql
-- Connect to WordPress MySQL database
docker exec -it <mysql-container> mysql -u root -p

-- Update URLs
USE wordpress_db;  -- or actual db name
UPDATE wp_options SET option_value = 'https://blog.manofwisdom.co' WHERE option_name = 'siteurl';
UPDATE wp_options SET option_value = 'https://blog.manofwisdom.co' WHERE option_name = 'home';
```

**Option C: Via wp-config.php**
```php
// Add to wp-config.php (in WordPress container)
define('WP_HOME', 'https://blog.manofwisdom.co');
define('WP_SITEURL', 'https://blog.manofwisdom.co');
```

**Confirmation Questions for Claude Code:**
- [ ] What is the WordPress MySQL container name?
- [ ] What is the WordPress database name?
- [ ] Where is wp-config.php located in the Docker setup?

---

### Step 1.4: Set Up Redirects (SEO Important)

**Option A: In Nginx Proxy Manager (Custom Locations)**

For the OLD manofwisdom.co host, add redirect rules:
```nginx
# Redirect old blog URLs to new subdomain
location ~ ^/blog/(.*)$ {
    return 301 https://blog.manofwisdom.co/$1;
}

location ~ ^/\d{4}/\d{2}/(.*)$ {
    return 301 https://blog.manofwisdom.co/$request_uri;
}
```

**Option B: WordPress Plugin**
Install "Redirection" plugin after migration to handle any broken links.

---

### Task 1 Verification Checklist

- [ ] `blog.manofwisdom.co` loads WordPress site
- [ ] SSL certificate works (green padlock)
- [ ] WordPress admin accessible at `blog.manofwisdom.co/wp-admin`
- [ ] All blog posts accessible
- [ ] Images and media loading correctly
- [ ] Old URLs redirect to new subdomain (if configured)

---

## TASK 2: Create New Homepage

### Goal
Create a Next.js landing page showcasing Man of Wisdom products.

### Step 2.1: Create Homepage App in Monorepo

**Location:**
```
Journal/
├── goal-setter/     # Existing - Port 3002
├── homepage/        # NEW - Port 3003
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── globals.css
│   │   └── components/
│   │       ├── Hero.tsx
│   │       ├── Products.tsx
│   │       ├── TodaysWisdom.tsx
│   │       ├── BlogPreview.tsx
│   │       ├── Newsletter.tsx
│   │       └── Footer.tsx
│   ├── public/
│   │   └── images/
│   ├── package.json
│   ├── next.config.js
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── ecosystem.config.js
└── ...
```

**Command for Claude Code:**
```bash
# From Journal/ root
mkdir -p homepage
cd homepage

# Initialize Next.js (same setup as goal-setter)
npx create-next-app@latest . --typescript --tailwind --app --src-dir=false --import-alias="@/*"
```

---

### Step 2.2: Homepage package.json

```json
{
  "name": "mow-homepage",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev -p 3003",
    "build": "next build",
    "start": "next start -p 3003",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "^15.1.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.49",
    "tailwindcss": "^3.4.17",
    "typescript": "^5"
  }
}
```

---

### Step 2.3: Homepage Content & Structure

**app/page.tsx - Main Landing Page**

```tsx
import Hero from './components/Hero'
import Products from './components/Products'
import TodaysWisdom from './components/TodaysWisdom'
import BlogPreview from './components/BlogPreview'
import Newsletter from './components/Newsletter'
import Footer from './components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Hero />
      <Products />
      <TodaysWisdom />
      <BlogPreview />
      <Newsletter />
      <Footer />
    </main>
  )
}
```

---

### Step 2.4: Component Specifications

**Hero.tsx**
```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  Navigation: Logo | Products | Blog | About                 │
│                                                             │
│  ─────────────────────────────────────────────────────────  │
│                                                             │
│  Ancient Wisdom. Modern Tools.                              │
│                                                             │
│  Philosophy-powered productivity for intentional living.    │
│  Join 10,000+ wisdom seekers building meaningful lives.    │
│                                                             │
│  [Explore Products]  [Free Goal Setter]  [Read the Blog]   │
│                                                             │
└─────────────────────────────────────────────────────────────┘

Colors:
- Background: Navy (#1A1A2E) or subtle gradient
- Text: White
- Accent buttons: Gold (#D4AF37) or White outline
```

**Products.tsx**
```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  Tools for Intentional Living                               │
│                                                             │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐          │
│  │ 🎯          │ │ 📓          │ │ ⏰          │          │
│  │ Goal Setter │ │ Journal     │ │ Time Views  │          │
│  │             │ │             │ │             │          │
│  │ Set your    │ │ Daily       │ │ Track your  │          │
│  │ 2026 goals  │ │ reflection  │ │ life in     │          │
│  │ with clarity│ │ & habits    │ │ weeks/years │          │
│  │             │ │             │ │             │          │
│  │ FREE        │ │ From $5/mo  │ │ From $9     │          │
│  │ [Start →]   │ │ [Coming     │ │ [Coming     │          │
│  │             │ │  Feb 1]     │ │  Soon]      │          │
│  └─────────────┘ └─────────────┘ └─────────────┘          │
│                                                             │
│  ┌─────────────┐ ┌─────────────┐                          │
│  │ 🖼️          │ │ 📚          │                          │
│  │ Wallpapers  │ │ Books       │                          │
│  │             │ │             │                          │
│  │ Beautiful   │ │ Ebooks &    │                          │
│  │ wisdom for  │ │ wisdom      │                          │
│  │ your screen │ │ stories     │                          │
│  │             │ │             │                          │
│  │ From $9     │ │ From $5     │                          │
│  │ [Coming     │ │ [Coming     │                          │
│  │  Soon]      │ │  Soon]      │                          │
│  └─────────────┘ └─────────────┘                          │
│                                                             │
└─────────────────────────────────────────────────────────────┘

Products array:
[
  {
    icon: "🎯",
    title: "Goal Setter",
    description: "Set your 2026 goals with clarity",
    price: "FREE",
    cta: "Start Now",
    link: "https://goals.manofwisdom.co",
    available: true
  },
  {
    icon: "📓",
    title: "Journal",
    description: "Daily reflection, habits & wisdom",
    price: "From $5/mo",
    cta: "Coming Feb 1",
    link: "/journal",
    available: false
  },
  {
    icon: "⏰",
    title: "Time Views",
    description: "Track your life in weeks, months & years",
    price: "From $9",
    cta: "Coming Soon",
    link: "/time-views",
    available: false
  },
  {
    icon: "🖼️",
    title: "Wallpapers",
    description: "Beautiful wisdom for your screens",
    price: "From $9",
    cta: "Coming Soon",
    link: "/wallpapers",
    available: false
  },
  {
    icon: "📚",
    title: "Books",
    description: "Ebooks & wisdom stories",
    price: "From $5",
    cta: "Coming Soon",
    link: "/books",
    available: false
  }
]
```

**TodaysWisdom.tsx**
```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  Today's Wisdom                                             │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │  "The obstacle is the way."                         │   │
│  │                              — Marcus Aurelius      │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  2,500+ wisdom quotes available exclusively through        │
│  our wallpaper packs and Journal subscription.             │
│                                                             │
│  [Get Wallpaper Packs]  [Subscribe to Journal]             │
│                                                             │
└─────────────────────────────────────────────────────────────┘

IMPORTANT: Only show ONE quote. 
Rotate daily/weekly. 
DO NOT expose bulk quotes - they are protected IP.

Implementation:
- Hardcode 7-10 quotes initially
- Show based on day of week (quote[dayOfWeek])
- Later: API endpoint that returns single quote
```

**BlogPreview.tsx**
```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  Latest from the Blog                                       │
│                                                             │
│  ┌───────────────┐ ┌───────────────┐ ┌───────────────┐    │
│  │ [Image]       │ │ [Image]       │ │ [Image]       │    │
│  │               │ │               │ │               │    │
│  │ Post Title 1  │ │ Post Title 2  │ │ Post Title 3  │    │
│  │               │ │               │ │               │    │
│  │ Short excerpt │ │ Short excerpt │ │ Short excerpt │    │
│  │ text here...  │ │ text here...  │ │ text here...  │    │
│  │               │ │               │ │               │    │
│  │ [Read →]      │ │ [Read →]      │ │ [Read →]      │    │
│  └───────────────┘ └───────────────┘ └───────────────┘    │
│                                                             │
│  [Visit the Blog →]                                         │
│                                                             │
└─────────────────────────────────────────────────────────────┘

Implementation Options:

Option A: Static (MVP - Recommended for now)
- Hardcode 3 recent blog posts
- Update manually when you publish new posts
- Link to blog.manofwisdom.co

Option B: WordPress REST API (Later)
- Fetch from: https://blog.manofwisdom.co/wp-json/wp/v2/posts?per_page=3
- Parse and display dynamically
- Add revalidation (ISR) for performance
```

**Newsletter.tsx**
```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  Weekly Wisdom                                              │
│                                                             │
│  Philosophy, product updates, and exclusive offers.         │
│  Join 2,000+ subscribers.                                   │
│                                                             │
│  [email____________________________] [Subscribe]            │
│                                                             │
│  We respect your privacy. Unsubscribe anytime.             │
│                                                             │
└─────────────────────────────────────────────────────────────┘

Integration:
- ConvertKit API (if using ConvertKit)
- Or simple form that posts to your email service
- For MVP: mailto link or Google Form
```

**Footer.tsx**
```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  Products         Content          Connect        Legal     │
│  • Goal Setter    • Blog           • Facebook     • Privacy │
│  • Journal        • Newsletter     • Instagram    • Terms   │
│  • Time Views     • Podcast        • Twitter                │
│  • Wallpapers                      • LinkedIn               │
│  • Books                                                    │
│                                                             │
│  ─────────────────────────────────────────────────────────  │
│                                                             │
│  © 2026 Man of Wisdom. Ancient wisdom for modern life.     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

### Step 2.5: PM2 Configuration

**homepage/ecosystem.config.js**
```javascript
module.exports = {
  apps: [{
    name: 'mow-homepage',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/Journal/homepage',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: 3003,
    },
    error_file: '/var/log/pm2/mow-homepage-error.log',
    out_file: '/var/log/pm2/mow-homepage-out.log',
    merge_logs: true,
    autorestart: true,
    max_restarts: 10,
  }]
}
```

---

### Step 2.6: Deploy Homepage to Server

**Commands to run on server:**
```bash
# SSH to server
ssh root@94.130.97.253

# Pull latest code
cd /var/www/Journal
git pull origin main

# Install and build homepage
cd homepage
npm install
npm run build

# Start with PM2
pm2 start ecosystem.config.js

# Save PM2 process list
pm2 save

# Check status
pm2 status
```

---

### Step 2.7: Update Nginx Proxy Manager

**Update existing proxy host for manofwisdom.co:**
```
Domain Names: manofwisdom.co
Scheme: http
Forward Hostname/IP: 172.17.0.1 (or localhost)
Forward Port: 3003  ← CHANGED from WordPress
```

**Keep WordPress proxy for blog subdomain:**
```
Domain Names: blog.manofwisdom.co
Forward to: WordPress container (as configured in Task 1)
```

---

### Task 2 Verification Checklist

- [ ] `homepage/` folder created in Journal repo
- [ ] Next.js app initializes and runs locally (`npm run dev`)
- [ ] All components render correctly
- [ ] Mobile responsive design works
- [ ] Links to external sites work (Goal Setter, Blog)
- [ ] Homepage deployed to server via PM2
- [ ] PM2 shows `mow-homepage` running on port 3003
- [ ] Nginx Proxy Manager updated
- [ ] `manofwisdom.co` loads new homepage
- [ ] SSL works (green padlock)

---

## TASK 3: Set Up CI/CD for Homepage

### Step 3.1: Create Deploy Script

**homepage/scripts/deploy.sh**
```bash
#!/bin/bash

echo "🚀 Starting deployment..."

# Navigate to app directory
cd /var/www/Journal/homepage

# Pull latest changes
echo "📥 Pulling latest changes..."
git pull origin main

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Build the application
echo "🔨 Building application..."
npm run build

# Restart PM2 process
echo "🔄 Restarting application..."
pm2 restart mow-homepage

echo "✅ Deployment complete!"
```

Make executable:
```bash
chmod +x homepage/scripts/deploy.sh
```

---

### Step 3.2: Create GitHub Actions Workflow

**.github/workflows/deploy-homepage.yml**
```yaml
name: Deploy Homepage to Hetzner

on:
  push:
    branches:
      - main
    paths:
      - 'homepage/**'
      - '.github/workflows/deploy-homepage.yml'

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Deploy to Hetzner via SSH
        uses: appleboy/ssh-action@v1.0.0
        with:
          host: ${{ secrets.HETZNER_HOST }}
          username: ${{ secrets.HETZNER_USER }}
          key: ${{ secrets.HETZNER_SSH_KEY }}
          port: ${{ secrets.HETZNER_PORT || 22 }}
          script: |
            cd /var/www/Journal/homepage
            bash scripts/deploy.sh

      - name: Notify deployment status
        if: always()
        run: |
          if [ "${{ job.status }}" == "success" ]; then
            echo "✅ Homepage deployment successful!"
          else
            echo "❌ Homepage deployment failed!"
          fi
```

---

### Step 3.3: Verify GitHub Secrets

**Required secrets (should already exist from Goal Setter):**
- `HETZNER_HOST` - 94.130.97.253
- `HETZNER_USER` - root (or deploy user)
- `HETZNER_SSH_KEY` - Private SSH key
- `HETZNER_PORT` - 22 (optional)

**Confirmation for Claude Code:**
- [ ] Are all required GitHub secrets configured?
- [ ] Does the existing Goal Setter workflow use the same secrets?

---

### Task 3 Verification Checklist

- [ ] `deploy.sh` script created and executable
- [ ] GitHub Actions workflow file created
- [ ] Push to `homepage/` folder triggers deployment
- [ ] Deployment completes successfully
- [ ] Site updates automatically after push

---

## TASK 4: Final Verification

### All URLs Should Work

| URL | Expected Result |
|-----|-----------------|
| `manofwisdom.co` | New Next.js homepage |
| `blog.manofwisdom.co` | WordPress blog |
| `goals.manofwisdom.co` | Goal Setter app |
| `blog.manofwisdom.co/wp-admin` | WordPress admin |

### Quick Test Commands

```bash
# Test all URLs respond
curl -I https://manofwisdom.co
curl -I https://blog.manofwisdom.co
curl -I https://goals.manofwisdom.co

# Check PM2 status
pm2 status

# Check PM2 logs if issues
pm2 logs mow-homepage --lines 50
pm2 logs goal-setter --lines 50

# Check Docker containers
docker ps
```

### SEO Verification

- [ ] Old blog URLs redirect to new subdomain (if configured)
- [ ] Google Search Console updated (add blog subdomain property)
- [ ] Sitemap accessible at `blog.manofwisdom.co/sitemap.xml`

---

## Questions for Claude Code Before Starting

### Before Task 1 (WordPress Migration)
1. What is the exact Docker container name for WordPress?
   ```bash
   docker ps --format "table {{.Names}}\t{{.Image}}\t{{.Ports}}"
   ```

2. What is the WordPress database container and database name?
   ```bash
   docker exec <wordpress-container> cat /var/www/html/wp-config.php | grep DB_NAME
   ```

3. Can you show current Nginx Proxy Manager proxy hosts?
   (Need to access NPM web interface)

### Before Task 2 (Homepage Creation)
4. Can you verify the goal-setter structure to match the homepage setup?
   ```bash
   ls -la /var/www/Journal/goal-setter/
   cat /var/www/Journal/goal-setter/package.json
   ```

5. What port is currently free? (Confirming 3003 is available)
   ```bash
   netstat -tlnp | grep LISTEN
   ```

### Before Task 3 (CI/CD)
6. Can you show the existing deploy script for goal-setter?
   ```bash
   cat /var/www/Journal/goal-setter/scripts/deploy.sh
   ```

7. Are GitHub secrets properly configured?
   (Check in GitHub repo → Settings → Secrets)

---

## Summary: Order of Operations

```
Day 1-2: Task 1 - WordPress Migration
├── 1.1 Add Cloudflare DNS record
├── 1.2 Configure Nginx Proxy Manager
├── 1.3 Update WordPress URLs
├── 1.4 Test blog.manofwisdom.co
└── 1.5 Verify everything works

Day 3-4: Task 2 - Homepage Creation  
├── 2.1 Create homepage/ folder structure
├── 2.2 Build Next.js app with components
├── 2.3 Test locally
├── 2.4 Deploy to server (PM2)
├── 2.5 Update Nginx Proxy Manager
└── 2.6 Verify manofwisdom.co shows new homepage

Day 5-6: Task 3 - CI/CD Setup
├── 3.1 Create deploy script
├── 3.2 Create GitHub Actions workflow
├── 3.3 Test push → auto-deploy
└── 3.4 Verify automation works

Day 7: Task 4 - Final Verification
├── 4.1 Test all URLs
├── 4.2 Fix any issues
├── 4.3 Update documentation
└── 4.4 Plan next week (Journal features)
```

---

## Files to Create

| File | Location | Purpose |
|------|----------|---------|
| `page.tsx` | `homepage/app/` | Main landing page |
| `layout.tsx` | `homepage/app/` | Root layout |
| `globals.css` | `homepage/app/` | Global styles |
| `Hero.tsx` | `homepage/app/components/` | Hero section |
| `Products.tsx` | `homepage/app/components/` | Products grid |
| `TodaysWisdom.tsx` | `homepage/app/components/` | Single quote display |
| `BlogPreview.tsx` | `homepage/app/components/` | Blog posts preview |
| `Newsletter.tsx` | `homepage/app/components/` | Email signup |
| `Footer.tsx` | `homepage/app/components/` | Footer |
| `package.json` | `homepage/` | Dependencies |
| `ecosystem.config.js` | `homepage/` | PM2 config |
| `deploy.sh` | `homepage/scripts/` | Deploy script |
| `deploy-homepage.yml` | `.github/workflows/` | CI/CD workflow |

---

## End of Week Success Criteria

By January 25, 2026:

- [ ] ✅ `blog.manofwisdom.co` serves WordPress
- [ ] ✅ `manofwisdom.co` serves new Next.js homepage
- [ ] ✅ `goals.manofwisdom.co` unchanged and working
- [ ] ✅ All sites have SSL certificates
- [ ] ✅ CI/CD deploys homepage on push
- [ ] ✅ Ready to continue Journal development for Feb 1

---

**Document Version:** 1.0  
**Created:** January 19, 2026  
**For Use With:** Claude Code implementation sessions