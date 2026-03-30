# Payment Gateway Setup Guide

Research for Man of Wisdom — global audience, Indian developer.

Last Updated: March 2026

---

## TL;DR

**Primary paying audience is non-Indian.** Use a **Merchant of Record (MoR)** platform instead of a raw payment processor. MoR platforms handle global tax compliance (VAT, GST, sales tax), payment processing, refunds, and invoicing — worth the extra ~2% fee for a solo developer.

**Recommended path:** Try Lemon Squeezy first (best DX, Stripe-backed). If Indian individual signup is rejected, try Paddle or Gumroad. Keep Razorpay as an option for Indian domestic users only.

---

## Merchant of Record vs Payment Processor

| | Merchant of Record | Payment Processor |
|--|---------------------|-------------------|
| **Examples** | Lemon Squeezy, Paddle, Gumroad | Stripe, Razorpay |
| **Tax compliance** | They handle it globally | You handle it yourself |
| **Invoicing** | Auto-generated, compliant | You build it |
| **Refunds** | They manage disputes | You manage disputes |
| **Fees** | 5-10% | 2-3% |
| **Legal entity** | They are the seller of record | You are the seller |
| **Best for** | Solo devs selling globally | Companies with tax infrastructure |

**Key insight:** As the seller of record, MoR platforms are legally responsible for collecting and remitting VAT/GST/sales tax in 100+ jurisdictions. Without a MoR, you'd need to register for VAT in the EU, handle US state sales tax nexus, comply with UK digital services tax, etc. For a solo dev, the extra 2-3% fee is well worth avoiding this complexity.

---

## 1. Lemon Squeezy (Recommended — MoR)

### Overview
- Acquired by Stripe in 2025 — backed by the most trusted payment infrastructure
- Purpose-built for SaaS and digital products
- Merchant of Record: handles all global tax compliance

### Account Requirements
- Sign up at lemonsqueezy.com
- **India status:** Has accepted Indian sellers, but some individual developers report rejections. Business entities (sole proprietorship with GST) have better success rates.
- KYC: Identity verification + business details

### Fees
| Type | Fee |
|------|-----|
| Standard | 5% + $0.50 per transaction |
| Subscriptions | Same |
| Tax handling | Included |
| Chargebacks | $15 per dispute |

### Payouts to India
- Wire transfer (SWIFT) to Indian bank account
- Payout threshold: $50 minimum
- Schedule: Monthly or on-demand (after 7-day hold)
- Currency: USD → INR conversion at market rate

### Tax Handling
- Automatically collects VAT (EU), GST (India/AU/NZ), sales tax (US states), and more
- Files and remits taxes on your behalf — you receive net amount
- Generates compliant invoices for all customers
- You don't need to register for VAT in any country

### Developer Experience
- Excellent API and webhooks
- React/Next.js components available
- Overlay checkout (no redirect)
- Hosted checkout pages
- License key management built-in
- Stripe-quality documentation

### Verdict
Best option if they accept your signup. Stripe backing adds trust and reliability. Best DX among MoR platforms.

---

## 2. Paddle (MoR — Established)

### Overview
- One of the original MoR platforms, operating since 2012
- Used by major SaaS companies (thousands of customers)
- Paddle Billing (new) vs Paddle Classic

### Account Requirements
- Sign up at paddle.com
- **India status:** Accepts Indian sellers. Requires business verification.
- More established approval process — higher acceptance rate for legitimate businesses
- May require sole proprietorship registration + GST

### Fees
| Type | Fee |
|------|-----|
| Standard | 5% + $0.50 per transaction |
| Checkout fees | Included |
| Tax handling | Included |
| Chargebacks | $15 per dispute |

### Payouts to India
- Wire transfer (SWIFT) to Indian bank account
- Payout schedule: Monthly (net 30)
- Minimum payout: Varies by currency
- Currency: USD or local currency conversion

### Tax Handling
- Full global tax compliance (same as Lemon Squeezy)
- Collects and remits VAT, GST, sales tax globally
- Real-time tax calculation at checkout
- Compliant invoices and receipts

### Developer Experience
- Paddle.js for checkout overlay
- Webhooks for payment events
- REST API for management
- Good TypeScript support
- Documentation is solid but not as polished as Lemon Squeezy

### Verdict
Most established MoR option. Slightly more corporate/enterprise feel. Good fallback if Lemon Squeezy rejects Indian individual signup.

---

## 3. Gumroad (MoR — Simple)

### Overview
- Popular with indie creators and solo developers
- Simple, opinionated — less flexibility but faster setup
- Merchant of Record for tax compliance

### Account Requirements
- Sign up at gumroad.com
- **India status:** Accepts Indian sellers
- Simpler verification process than Paddle/LS

### Fees
| Type | Fee |
|------|-----|
| Standard | 10% flat per transaction |
| No monthly fee | Included |
| Tax handling | Included |
| Chargebacks | Handled by Gumroad |

### Payouts to India
- **PayPal only** for Indian sellers (no direct bank transfer)
- This is a significant limitation — PayPal charges conversion fees (~3-4%)
- Effective total fee: ~13-14% after PayPal conversion
- Weekly payouts

### Tax Handling
- Handles VAT/sales tax collection and remittance
- Simpler implementation than Paddle/LS

### Developer Experience
- Minimal API — more of a hosted storefront
- Embeddable widgets and overlay checkout
- Less customizable than Paddle or Lemon Squeezy
- Good for simple product sales, limited for SaaS features

### Verdict
Easiest signup for Indian sellers, but 10% fee + PayPal-only payouts make it expensive. Best as a last resort or for validating demand before switching to a better platform.

---

## 4. Polar.sh (MoR — Developer-Focused)

### Overview
- Newer platform, focused on open-source and developer monetization
- Merchant of Record with modern developer experience
- Growing but less established than Paddle/Gumroad

### Account Requirements
- Sign up at polar.sh
- GitHub-integrated onboarding
- **India status:** Accepting international sellers, but newer platform = less certainty

### Fees
| Type | Fee |
|------|-----|
| Standard | 5% per transaction |
| No per-transaction fixed fee | - |
| Tax handling | Included |

### Payouts to India
- Stripe Connect under the hood
- Bank transfer availability for India uncertain — verify before committing

### Developer Experience
- Modern API, webhook-first design
- React components available
- License key and benefit management
- Good for developer tools specifically

### Verdict
Interesting option with competitive fees (no fixed per-transaction fee). But newer and less proven. Worth watching but risky as a primary payment provider for a revenue-generating product.

---

## 5. Dodo Payments (MoR — India-Founded)

### Overview
- India-founded MoR platform specifically targeting Indian developers selling globally
- Newer entrant, less track record
- Claims to solve the India-specific MoR gap

### Account Requirements
- Sign up at dodopayments.com
- **India status:** Built for Indian sellers — easiest onboarding
- Accepts individuals and sole proprietors

### Fees
| Type | Fee |
|------|-----|
| Standard | ~5% per transaction |
| Tax handling | Included |

### Payouts to India
- Direct bank transfer to Indian accounts
- Designed for Indian banking infrastructure
- Potentially fastest/easiest payout experience for Indian sellers

### Developer Experience
- API available
- Less documentation and community resources compared to established platforms

### Verdict
Solves the India seller problem directly, but very new with limited track record. Since this involves real money, using a more established platform is preferred unless others reject your signup.

---

## 6. Razorpay (India Domestic Only)

### Overview
Best payment processor for Indian domestic payments. **Not a MoR** — you handle tax compliance yourself. Only recommended for Indian customers paying in INR.

### Account Requirements
- **Sole proprietors / individuals CAN sign up.**
- Documents: PAN, Aadhaar, cancelled cheque, GST certificate (or declaration), ITR
- KYC: 1-2 working days

### Fees
| Method | Fee |
|--------|-----|
| UPI | 0% MDR (govt mandated) + small platform fee |
| Domestic cards | ~2% |
| International cards | ~3% |
| Net banking | ~2% |
| Refunds | Up to 2% of refunded amount |

- No setup fee, no annual maintenance
- GST (18%) charged on top of all fees

### Supported Payment Methods
- UPI (all apps: GPay, PhonePe, Paytm, BHIM — automatic)
- Credit/debit cards (Visa, MC, Amex, RuPay)
- Net banking (50+ banks)
- Wallets, EMI, Pay Later

### Next.js Integration
```typescript
// app/api/order/route.ts
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: Request) {
  const { amount, currency, product } = await req.json();
  const order = await razorpay.orders.create({
    amount,      // in paise (e.g., 2999 * 100 for Rs 2999)
    currency,    // 'INR'
    receipt: `receipt_${Date.now()}`,
  });
  return Response.json(order);
}
```

### Webhooks
- Key events: `payment.captured`, `payment.failed`, `order.paid`, `refund.created`
- Verify: HMAC-SHA256 with webhook secret on raw body

### Verdict
Best for India domestic. Don't use for global audience — no tax compliance, no international payment method coverage.

---

## 7. Stripe (Global — Not Accessible)

### Status
- **INVITE-ONLY in India since May 2024.** Cannot sign up directly.
- Individual Indian developers are unlikely to get an invite.
- **Workaround:** Register a US LLC via Stripe Atlas (~$500)
- If you use Lemon Squeezy, you're already on Stripe infrastructure (they were acquired by Stripe)

### Verdict
Not directly usable. Access it indirectly through Lemon Squeezy instead.

---

## MoR Comparison Table

| | Lemon Squeezy | Paddle | Gumroad | Polar.sh | Dodo Payments |
|--|---------------|--------|---------|----------|---------------|
| **Fee** | 5% + $0.50 | 5% + $0.50 | 10% flat | 5% | ~5% |
| **India signup** | Mixed results | Generally accepts | Accepts | Uncertain | Built for India |
| **Payout to India** | Wire/SWIFT | Wire/SWIFT | PayPal only | Uncertain | Direct bank |
| **Tax handling** | Full global | Full global | Full global | Full global | Full global |
| **Established** | 2021 (Stripe-backed) | 2012 | 2011 | 2023 | 2024 |
| **DX quality** | Excellent | Good | Basic | Good | Basic |
| **SaaS features** | License keys, subs | Subs, catalog | Simple products | Benefits, subs | Basic |
| **Best for** | SaaS/digital products | Established SaaS | Simple sales | Dev tools | Indian sellers |

---

## India-Specific Blockers

| Platform | Issue |
|----------|-------|
| **Stripe** | Invite-only in India since May 2024. Individual devs unlikely to get access. |
| **Lemon Squeezy** | Some individual Indian developers report signup rejections. Business entity (sole prop + GST) improves chances. |
| **Gumroad** | Accepts Indian sellers but PayPal-only payouts add ~3-4% conversion fees. |
| **Paddle** | Generally accepts Indian businesses. May require GST registration. |

---

## Recommended Strategy

### Step 1: Try Lemon Squeezy
- Best DX, Stripe-backed reliability, competitive fees
- Sign up with sole proprietorship details + GST if available
- If accepted → integrate and ship

### Step 2: If Rejected → Try Paddle
- More established, higher acceptance rate for legitimate businesses
- Same fee structure as Lemon Squeezy
- Slightly more corporate onboarding process

### Step 3: If Both Reject → Gumroad
- Easiest signup, accepts Indian individuals
- Higher fees (10% + PayPal conversion) but gets you to market
- Use as a stepping stone — switch later when business grows

### Step 4: Consider Razorpay for Indian Subset
- If significant Indian user base develops, add Razorpay for INR payments
- Route by geography: India → Razorpay, International → MoR platform

### Implementation Flow (Once Provider Chosen)
```
User clicks "Upgrade to Priority Mode"
  → Redirect to MoR checkout (hosted or overlay)
  → MoR handles payment + tax collection
  → Webhook: payment.completed
  → Verify webhook signature (server)
  → Create Payment row (completed)
  → Create UserProduct row (grant access)
  → User has access to paid features
```

Existing DB models (`Payment`, `UserProduct`) and utilities (`checkProductAccess`, `grantProductAccess`) are already in place. The checkout UI and webhook handler are the main pieces to build.

---

## Products to Configure

| Product | Price | Type |
|---------|-------|------|
| Priority Mode (base) | TBD | One-time or subscription |
| Priority + AI Wisdom | $29.99/mo | Subscription |
| Priority + Personal Wisdom | $99/mo (10 slots) | Subscription |

---

## Next Steps

1. Sign up for Lemon Squeezy (or chosen provider)
2. Create products in provider dashboard
3. Build checkout API route + webhook handler in goal-setter
4. Build pricing/checkout UI
5. Wire up `checkProductAccess` gate on paid features
6. Test with provider's sandbox/test mode
7. Go live
