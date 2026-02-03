# Products - Man of Wisdom

*Complete product catalog for the Man of Wisdom ecosystem*

---

## The Hero Product

**Journal** is the central product. Everything else feeds into it.

| Product | Description | Price | Location | Target |
|---------|-------------|-------|----------|--------|
| **Journal** | Daily journaling app with habit tracking, goal integration, and reflection prompts. The core of the MoW ecosystem. Must be so good that $10/month feels like a steal. | $10/month or $100/year | `journal/` (Port 3005) | Feb 17, 2026 |

---

## Product Funnel

```
Traffic Engine (Social Media)
        ↓
   Free Products (Goal Setter Quick/Deep, Time Views)
        ↓
   Paid One-Time (Priority Mode $10, Priority + Wisdom $30)
        ↓
   Hero Subscription (Journal $10/month)
        ↓
   Premium Add-ons (Consultation, Wallpapers)
```

**Goal Setter → Journal Integration:**
- Goal Setter is a funnel for Journal, not just a standalone product
- Goals saved in Goal Setter auto-populate in Journal
- Same auth system, same database
- Users get value from Goal Setter for free, then upgrade to Journal for ongoing tracking

---

## Traffic Engine (Social Media)

The content distribution network that drives users to products.

| Platform | Handle/URL | Followers | Notes |
|----------|------------|-----------|-------|
| **Website** | [manofwisdom.co](https://manofwisdom.co) | - | Main hub |
| **Facebook** | [facebook.com/ManofWisdoms](https://facebook.com/ManofWisdoms) | 10,000+ | Primary traffic engine. 10 years of content. |
| **Twitter/X** | [twitter.com/ManofWisdoms](https://twitter.com/ManofWisdoms) | 300+ | Planning subscription for monetization + automated posting |
| **Instagram** | [instagram.com/ManofWisdoms](https://instagram.com/ManofWisdoms) | 150+ | Visual content, quotes, infographics |
| **LinkedIn** | [linkedin.com/company/manofwisdom](https://linkedin.com/company/manofwisdom) | - | Professional audience |
| **YouTube** | [youtube.com/@ManofWisdoms](https://youtube.com/@ManofWisdoms) | 63 subs | 4 videos, 4,678 views. Since Aug 2011. |
| **Old Blog** | [theuntrailedpath.blogspot.com](https://theuntrailedpath.blogspot.com) | - | Original blog before MoW rebrand |

**Content Strategy:**
- Automate cross-posting across platforms
- Products featured in Twitter threads (monetization via subscription)
- Funnel from social → email list → products

---

## Active Products (Code-Based)

Products that are live and actively used.

| Product | Description | Location | Port |
|---------|-------------|----------|------|
| **Goal Setter** | Guided goal-setting wizard with Quick (~5 min) and Deep (~30 min) modes. Free funnel for Journal. | `goal-setter/` | 3002 |
| **Homepage** | Marketing landing page for Man of Wisdom ecosystem | `homepage/` | 3003 |

---

## Active Products (Content-Based)

Content products that exist outside the codebase.

| Product | Description | Platform | Revenue |
|---------|-------------|----------|---------|
| **Man of Wisdom Blog** | Original MoW website, wisdom and productivity articles | WordPress (separate subdomain) | Organic traffic |
| **Man of Wisdom Tracks** | Original music tracks for focus and relaxation | Spotify, YouTube, streaming platforms | ~$5-10 (first revenue!) |
| **YouTube Videos** | Video content (potential for ads and other monetization) | YouTube | Potential |

---

## Set Up But Not Immediately Usable

Products that exist but are not yet promoted or fully operational.

| Product | Description | Location | Status |
|---------|-------------|----------|--------|
| **Time Views** | Time tracking and visualization app | `time-views/` (Port 3004) | Live but not actively promoted |
| **Newsletter** | Email newsletter via Resend API. Will showcase blogs, quotes, podcast episodes, and products. | `packages/auth/` (auto-subscribes users) | Infrastructure ready, no campaigns sent |
| **Man of Wisdom Podcast** | Podcast for wisdom and productivity content | TBD | Could start anytime |

---

## Future Products

Products planned for development.

### Goal Setter Add-ons

| Product | Description | Price | Status |
|---------|-------------|-------|--------|
| **Priority Mode** | Premium goal-setting mode. Define priorities first, then set goals for each with quarterly breakdowns. Includes PDF, wall poster, and personalized wallpaper. | $9.99 (one-time) | Planned |
| **Priority + Wisdom Feedback** | Everything in Priority Mode plus personalized feedback from Man of Wisdom persona on your priorities and goals. | $29.99 (one-time) | Planned |

### Consultation Services

| Product | Description | Price | Status |
|---------|-------------|-------|--------|
| **Email Consultation** | Personalized guidance via email from Man of Wisdom. Advice on priorities, goals, and life direction. | TBD | Future |
| **Voice Call Consultation** | One-on-one voice call with Man of Wisdom for deeper guidance. Anonymous (no video). | TBD | Future |

### Digital Products

| Product | Description | Price | Status |
|---------|-------------|-------|--------|
| **Wallpaper Packs** | Curated wallpaper collections for phone/desktop with motivational themes. | TBD | Future |
| **Tablet Edition** | Printable journal templates for iPad/tablets. | TBD | Pre-order announced (Jan 21, 2026) |
| **Man of Wisdom Mobile App** | Native Android/iOS app for the MoW ecosystem | TBD | Future |

---

## On the Horizon (Ideas for Later)

Not immediate priorities, but concepts ready when there's bandwidth.

### Books

| Title | Description |
|-------|-------------|
| **Maxims of Man of Wisdom** | Collection of guiding principles and timeless truths |
| **Musings of Man of Wisdom** | Reflections and thoughts on life, productivity, and growth |
| **Meditations of Man of Wisdom** | Contemplative pieces for inner peace and clarity |
| **The 7 Pillars of Man of Wisdom** | Core philosophy framework of the MoW worldview |

*Goal: Complete at least one book in 2026*

---

## Man of Wisdom Productivity Suite

Products that are not MoW-branded but connect to the ecosystem (linked via about/more section).

| Product | Description | Status |
|---------|-------------|--------|
| **Focus Empire** | Gamified RPG productivity app. Build a 2D grid empire by completing Pomodoro-style focus sessions. Earn coins/resources to purchase buildings and advance through ages. Like Age of Empires meets Forest app - progress feels more rewarding as an empire than planting trees. | Future |

---

## Revenue Goals (2026)

Progressive milestones:

| Milestone | Status |
|-----------|--------|
| First $1 | Done (streaming tracks) |
| First $100 | 10 Priority Mode sales |
| First $1,000 | 100 Priority Mode sales OR Journal subscribers |
| First $10,000 | Journal + Priority Mode + seasonal push |
| **$100,000** | Journal as recurring base + all products + content monetization |

---

## Pricing Philosophy

- **Free tier**: Quick Mode, Deep Mode, Time Views (get people in the door, funnel to Journal)
- **One-time purchases**: Priority Mode, wallpapers, consultations (focused value, no ongoing commitment)
- **Subscriptions**: Journal app ($10/month or $100/year) - the hero product
- **Content monetization**: YouTube ads, streaming royalties, Twitter subscription, potential sponsorships

---

## Shared Infrastructure

| Component | Description | Location |
|-----------|-------------|----------|
| **@mow/auth** | Shared authentication (magic link, sessions) | `packages/auth/` |
| **@mow/database** | Shared Prisma schema and database access | `packages/database/` |
| **UserProduct table** | Access gating for paid products (free/purchased/trial/subscription) | `packages/database/prisma/schema.prisma` |
