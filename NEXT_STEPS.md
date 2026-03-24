# NALA Next Steps

Ordered by revenue blockers first, then system correctness, then polish.

## Phase 1: Critical

### 1. Stripe Webhook: Fully Complete and Harden

- Finalize `/api/stripe_webhook.php`
- Handle `checkout.session.completed`
- Verify Stripe signature
- Prevent duplicates by storing `stripe_session_id`
- Map metadata to entitlements
- Upgrade user flags:
  - `has_premium`
  - `has_business_in_a_box`
- Trigger lockout kit only when allowed
- Log everything in test mode

This is the backbone of the purchase flow. Without it, payment does not reliably grant access.

### 2. Entitlement System: DB and Backend Logic

Add fields:

```sql
has_premium TINYINT(1)
has_business_in_a_box TINYINT(1)
```

Replace entitlement checks that depend on `role` with entitlement flags.

Mapping:

- Premium purchase: `has_premium = 1`
- Business purchase by new user: `has_premium = 1`, `has_business_in_a_box = 1`
- Business purchase by existing premium user: `has_business_in_a_box = 1`

This controls access, UI, and purchase restrictions.

### 3. Fix Checkout Session Logic

File:

`/api/create_checkout_session.php`

Must:

- Detect user entitlements
- Decide purchase mode:
  - `premium`
  - `business_full`
  - `business_addon`
- Add metadata such as:

```json
{
  "mode": "business_addon",
  "send_lockout_kit": "no"
}
```

This metadata is required so the webhook knows how to grant entitlements and whether fulfillment should run.

### 4. Lockout Kit Trigger: Zendrop or Shopify

Must trigger only for:

- Premium
- Business full purchase

Must not trigger for:

- Business add-on

In test mode:

- Do not create real orders
- Log payload instead

### 5. Force Logout After Purchase

Current issue:

- User stays logged in after purchase

Required:

- After successful return:
  - destroy session
  - redirect to login

Why:

- Forces a fresh session with updated entitlements
- Prevents stale session state bugs

## Phase 2: UX and System Completion

### 6. Email System

After purchase, send:

- Login email
- Welcome or onboarding email
- Gift tracking email

Currently not implemented.

### 7. Shipping Address Collection

Missing today.

Build:

- Form before or after purchase

Requirements:

- Country locked to US
- State dropdown
- Backend validation

### 8. Purchase Restrictions

Rules:

- New user: Premium and Business allowed
- Premium user: Business only
- Business user: nothing else purchasable

Enforce in:

- UI
- Backend

### 9. Dashboard UI: Reflect Entitlements

Show:

- Purchased plans
- Locked and unlocked content
- Upgrade options

## Phase 3: Platform Completion

### 10. Zapier Integration

Needed for:

- Certificate sending
- Lockout kit automation

Ensure:

- Webhook fires correctly
- Payload is correct

### 11. Email Verification System

Future flow:

`register -> email token -> verify -> activate account`

### 12. Link Audit

Check:

- Header links
- Dashboard buttons
- Lesson navigation
- Quiz navigation

Known history already includes broken clicks and unresponsive buttons.

### 13. Password Reset Polish

Current state:

- Basic flow only

Improve:

- Better UX
- Clear success and failure states

## Phase 4: Polish and Scale

### 14. Admin Dashboard

- View users
- See purchases
- Track progress

### 15. Purchase History Page

- User-facing purchase history

### 16. Logging System

- Debug webhook
- Debug purchases
- Debug user flows

### 17. Course System Upgrade

- Move hierarchy to JSON-driven structure
- Make courses easier to scale

## Real Priority Stack

Do next:

1. Stripe webhook finalize
2. Entitlement DB fields
3. Checkout session metadata
4. Lockout kit logic
5. Force logout after purchase

Then:

6. Email system
7. Shipping form
8. Purchase restrictions

Then:

9. Dashboard UI
10. Link audit
11. Zapier final wiring

## Big Picture

Current state:

- Learning platform works
- Checkout UI works
- Monetization backend is not fully complete

You are close to sell-ready once Phase 1 is finished cleanly.
