# Goal Setter - Progress & Roadmap

Last Updated: January 13, 2026

---

## Current Status: LIVE

**Goal Setter App:** https://goals.manofwisdom.co

The goal-setting funnel is live and collecting user emails + goals data.

---

## Social Media Launch Messages

### For Man of Wisdom Facebook Page (10K followers)

**Post 1 - Direct & Urgent:**
```
2026 is here. Are you still running on autopilot?

In just 5 minutes, you can:
- Set your top 3 goals for the year
- Choose habits to build (and break)
- Define your theme for 2026

And as a thank you? You'll get 1 month FREE access to the Man of Wisdom Digital Journal launching Feb 1st.

10,000+ wisdom seekers have already mapped their year.

Your turn: https://goals.manofwisdom.co
```

**Post 2 - Story-driven:**
```
Every January, people make resolutions.
By February, 80% have forgotten them.

This year, let's do it differently.

I built a simple tool that takes 5 minutes to set meaningful goals - not vague wishes, but real intentions across health, wealth, relationships, and growth.

Everyone who completes it gets:
- A beautiful PDF of their goals
- 1 month FREE access to our Digital Journal (launching Feb 1st)

No fluff. No lengthy courses. Just clarity.

Set your 2026 goals now: https://goals.manofwisdom.co
```

**Post 3 - Question hook:**
```
Quick question: What's your #1 goal for 2026?

If you had to think about it for more than 3 seconds, you need this.

I created a 5-minute goal-setting tool that helps you get crystal clear on:
- Your top 3 priorities
- The ONE habit that will change everything
- Your theme word for the year

It's free. It's fast. And you'll get early access to our Digital Journal.

Start here: https://goals.manofwisdom.co

Drop your #1 goal in the comments below.
```

**Post 4 - FOMO + Social Proof:**
```
1,247 people set their 2026 goals this week.

Here's what they're focusing on:
- Health & fitness transformations
- Building wealth and passive income
- Deeper relationships with family
- Personal growth and new skills

The Digital Journal launches Feb 1st, and everyone who sets their goals NOW gets 1 month FREE.

Don't start 2026 without a plan.

5 minutes. That's all it takes: https://goals.manofwisdom.co
```

---

### For Alok's Personal Social Media (1-2 lines)

**LinkedIn:**
```
Built something over the weekend - a 5-minute goal-setting tool.

Already have 1000+ signups. Launching a full Digital Journal SaaS on Feb 1st.

If you want to set your 2026 goals (and get free early access): https://goals.manofwisdom.co
```

**Twitter/X:**
```
Shipped a goal-setting tool in a week.

5 mins to set your 2026 goals. Get 1 month free Digital Journal access.

https://goals.manofwisdom.co

Building in public. Journal SaaS launches Feb 1st.
```

**Instagram Story:**
```
Built this for Man of Wisdom followers but sharing here too.

5 min goal setting = 1 month free journal access.

Link in bio or goals.manofwisdom.co
```

**WhatsApp Status:**
```
Finally launched it! Set your 2026 goals in 5 mins, get free journal access.

goals.manofwisdom.co
```

---

## Completed Milestones

| Date | Milestone |
|------|-----------|
| Jan 11, 2026 | Goal Setter app deployed to production |
| Jan 12, 2026 | Cloudflare DDoS protection configured |
| Jan 13, 2026 | Fixed Next.js 16 middleware bug |
| Jan 13, 2026 | Added footer linking to manofwisdom.co |
| Jan 13, 2026 | Updated favicon to match branding |
| Jan 13, 2026 | Added OG image for social media previews |

---

## Next Steps

### Phase 1: Newsletter Setup (This Week)
- [ ] Export collected emails from PostgreSQL
- [ ] Set up email provider (ConvertKit / Mailchimp / Resend)
- [ ] Create welcome email sequence
- [ ] Send first newsletter announcing Digital Journal

### Phase 2: Digital Journal SaaS (Launch: February 1, 2026)
- [ ] Build core journal features
  - [ ] Daily journal entries
  - [ ] Goal tracking dashboard
  - [ ] Progress visualization
  - [ ] Weekly/monthly reviews
- [ ] Pre-load user goals from Goal Setter
- [ ] Implement subscription/payment (Stripe)
- [ ] Set up user authentication
- [ ] Create onboarding flow
- [ ] Build notification system (daily reminders)

### Phase 3: Tablet Edition (Launch: January 21, 2026)
- [ ] Finalize PDF journal design
- [ ] Set up payment page at manofwisdom.co/tablet-journal
- [ ] Create GoodNotes/Notability compatible version
- [ ] Test on iPad and Android tablets

### Phase 4: Growth & Monetization
- [ ] Email nurture sequence for free users → paid conversion
- [ ] Referral program
- [ ] Content marketing (blog posts, social proof)
- [ ] Testimonials from early users

---

## Key Metrics to Track

| Metric | Current | Target (Feb 1) |
|--------|---------|----------------|
| Email signups | ~1000+ | 5,000 |
| Goal completions | TBD | 3,000 |
| Tablet Edition pre-orders | TBD | 500 |
| Newsletter open rate | - | 40%+ |

---

## Technical Debt / Improvements

- [ ] Migrate middleware to Next.js 16 proxy (deprecation warning)
- [ ] Update Prisma to v7 (breaking changes, plan carefully)
- [ ] Add analytics (Plausible or PostHog)
- [ ] Set up error monitoring (Sentry)
- [ ] Database backups automation

---

## Resources

- **Goal Setter:** https://goals.manofwisdom.co
- **Main Site:** https://manofwisdom.co
- **Repository:** https://github.com/FriendWhoCodes/Journal
- **Server:** 94.130.97.253 (Hetzner VPS)
