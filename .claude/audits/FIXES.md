# Financial Validation Fixes

## FIX-001: agreedPrice validation

### Changes Made
- `app/api/collaborations/[id]/route.ts:83-86` - Added validation that agreedPrice must be a positive number <= 1,000,000 before converting to cents

### Verification
- [x] Linter passes
- [x] No new lint errors introduced

---

## FIX-002: Campaign status whitelist

### Changes Made
- `app/api/campaigns/[id]/route.ts:84-89` - Added whitelist check: status must be one of ACTIVE, COMPLETED, or CANCELLED; returns 400 for invalid values

### Verification
- [x] Linter passes
- [x] No new lint errors introduced

---

## FIX-003: Remove non-atomic balance check race condition

### Changes Made
- `app/api/campaigns/route.ts:152-153` - Removed misleading non-atomic balance check at campaign creation; balance is properly checked atomically at the collaboration agree step when funds are frozen

### Verification
- [x] Linter passes
- [x] No new lint errors introduced

---

## FIX-004: Max password length (bcrypt DoS prevention)

### Changes Made
- `app/api/auth/signup/route.ts:41-46` - Added max 128 character password length check
- `app/api/auth/login/route.ts:31-36` - Added max 128 character password length check
- `app/api/auth/password/route.ts:40-45` - Added max 128 character password length check for newPassword
- `app/api/auth/reset-password/route.ts:16-18` - Added max 128 character password length check for newPassword

### Verification
- [x] Linter passes
- [x] No new lint errors introduced

---

## FIX-005: proposedPrice validation

### Changes Made
- `app/api/collaborations/route.ts:140-141` - Added upper bound validation: proposedPrice must be <= 1,000,000

### Verification
- [x] Linter passes
- [x] No new lint errors introduced

---

## FIX-006: Rate limiting on financial and sensitive endpoints

### Changes Made
- `app/api/collaborations/[id]/agree/route.ts` - Added rate limit: 5 per minute per user
- `app/api/collaborations/[id]/complete/route.ts` - Added rate limit: 5 per minute per user
- `app/api/campaigns/route.ts` (POST) - Added rate limit: 10 per minute per user
- `app/api/collaborations/route.ts` (POST) - Added rate limit: 10 per minute per user
- `app/api/auth/resend-verification/route.ts` - Added rate limit: 3 per minute per IP

### Verification
- [x] Linter passes (no new errors)
- [x] Type check passes (no new errors)

---

## FIX-007: Google OAuth CSRF protection

### Changes Made
- `lib/google-oauth.ts` - Added `OAUTH_NONCE_COOKIE` constant and `buildOAuthState()` helper that generates a cryptographic nonce with the role
- `app/signup/page.tsx` - Generates nonce via `crypto.randomUUID()`, stores in cookie, includes in OAuth state JSON
- `app/login/page.tsx` - Generates nonce via `crypto.randomUUID()`, stores in cookie, includes in OAuth state JSON
- `app/api/auth/google/route.ts` - Parses state as JSON, verifies nonce from state matches nonce cookie, clears nonce cookie after verification

### Verification
- [x] Linter passes (no new errors)
- [x] Type check passes (no new errors)

---

## FIX-008: Webhook amount validation (CRITICAL)

### Changes Made
- `app/api/webhooks/0xprocessing/route.ts:54-61` - Added validation comparing webhook-reported amount against stored transaction amount before crediting balance; mismatches are logged and return 200 without crediting

### Verification
- [x] Linter passes
- [x] No new lint errors introduced

---

## FIX-009: Webhook error handling (return 500 on DB errors)

### Changes Made
- `app/api/webhooks/0xprocessing/route.ts:119` - Changed catch-all from returning 200 to returning 500 so 0xProcessing retries on unexpected errors
- `app/api/webhooks/0xprocessing/withdraw/route.ts:105` - Same change for withdrawal webhook handler

### Verification
- [x] Linter passes
- [x] No new lint errors introduced

---

## FIX-010: FrozenBalance underflow guard

### Changes Made
- `app/api/collaborations/[id]/complete/route.ts:65-71` - Added guard that reads brand's frozenBalance within the transaction and throws if insufficient
- `app/api/collaborations/[id]/complete/route.ts:106-108` - Added error handler for INSUFFICIENT_FROZEN_BALANCE returning 400

### Verification
- [x] Linter passes
- [x] No new lint errors introduced

---

## FIX-011: Password hash leak from JWT

### Changes Made
- `app/api/auth/forgot-password/route.ts:35` - Removed `phash` (password hash substring) from JWT payload; added explicit `setIssuedAt()` for token invalidation
- `app/api/auth/reset-password/route.ts:41-43` - Replaced `phash` check with `iat` vs `profile.updatedAt` comparison to detect if password was changed after token was issued

### Verification
- [x] Linter passes
- [x] No new lint errors introduced

---

## FIX-012: Remove wildcard hostname in next.config.ts (SSRF risk)

### Changes Made
- `next.config.ts:12-13` - Replaced `hostname: "**"` wildcard with explicit `hostname: "lh3.googleusercontent.com"` for Google avatars. Only two external image domains are used: `images.unsplash.com` (already listed) and Google user avatars. Uploaded avatars are stored as base64 data URLs.

### Verification
- [x] Linter passes
- [x] No new lint errors introduced

---

## FIX-013: Health check should verify DB connectivity

### Changes Made
- `app/api/health/route.ts` - Added Prisma `$queryRaw` with `SELECT 1` to verify database connectivity. Returns 503 with error details if DB is unreachable.

### Verification
- [x] Linter passes
- [x] No new lint errors introduced

---

## FIX-014: Replace prisma db push --accept-data-loss

### Changes Made
- `railway.toml:6` - Changed `preDeployCommand` from `npx prisma db push --accept-data-loss` to `npx prisma migrate deploy`. Migrations directory already exists with 5 migrations.

### Verification
- [x] No lint impact (toml file)

---

## FIX-015: Add rate limit on reset-password endpoint

### Changes Made
- `app/api/auth/reset-password/route.ts` - Added rate limiting: 3 requests per 15 minutes per IP, using existing `rateLimit` helper from `@/lib/rate-limit`. Pattern matches `forgot-password/route.ts`.

### Verification
- [x] Linter passes
- [x] No new lint errors introduced

---

## FIX-016: Remove unsafe-eval from CSP in production

### Changes Made
- `next.config.ts:27` - Made `'unsafe-eval'` in script-src conditional on `NODE_ENV === 'development'`. Production CSP no longer includes `'unsafe-eval'`.

### Verification
- [x] Linter passes
- [x] No new lint errors introduced

---

## FIX-017: Add missing env vars to .env.example

### Changes Made
- `.env.example` - Added `OX_TEST_MODE=false` and `YOUTUBE_API_KEY=your_youtube_api_key` entries for completeness.

### Verification
- [x] No lint impact (env file)

---

## FIX-018: Value mismatches between create-campaign-tab and campaigns-tab

### Changes Made
- `app/dashboard/brand/components/campaigns-tab.tsx` - Added `FORMAT_LABELS`, `GOAL_LABELS`, and `PRICING_LABELS` lookup maps at module level for consistent display
- `campaigns-tab.tsx:508-513` - Replaced goal select options (`project-awareness`, `community-engagement`, `token-launch`, `user-acquisition`, `dapp-traffic`) with IDs matching create form (`brand-awareness`, `engagement`, `conversions`, `product-launch`, `lead-generation`, `traffic`)
- `campaigns-tab.tsx:517` - Goal display now uses `GOAL_LABELS` lookup instead of `.replace("-", " ")` with capitalize
- `campaigns-tab.tsx:692-712` - Content format checkboxes now use `FORMAT_LABELS` entries (`twitter-post`, `instagram-post`, etc.) instead of old generic IDs (`video`, `photo`, `story`, `reel`, `carousel`, `live`)
- `campaigns-tab.tsx:718` - Content format display badges now use `FORMAT_LABELS` lookup instead of `.replace("-", " ")` with capitalize
- `campaigns-tab.tsx:730-746` - Pricing model checkboxes now use lowercase IDs (`cpm`, `cpc`, `cpe`) matching create form, instead of uppercase (`CPM`, `CPC`, `CPE`)
- `campaigns-tab.tsx:758` - Pricing model display badges now use `PRICING_LABELS` lookup
- `campaigns-tab.tsx:774,789,804` - Campaign Goals target metrics visibility checks now use lowercase pricing model IDs

### Verification
- [x] Linter passes
- [x] No new lint errors introduced

---

## FIX-019: Decline button should not cancel collaboration

### Changes Made
- `app/dashboard/influencer/page.tsx:1529` - Changed Decline button from sending `{ status: 'CANCELLED' }` to `{ influencerAgreed: false }`, keeping status as NEGOTIATING so the brand can propose a new price
- `app/dashboard/influencer/page.tsx:1532` - Updated toast message to "Price declined. Project can propose a new price."
- `app/dashboard/influencer/page.tsx:1533` - Removed `setSelectedCampaignDetails(null)` so the negotiation view stays open

### Verification
- [x] Linter passes
- [x] No new lint errors introduced

---

## FIX-020: Stage display shows "Terms Approved" and "Content Approved" for wrong statuses

### Changes Made
- `app/dashboard/influencer/page.tsx:1556-1564` - Added explicit "cancelled" status check in Stage 1 that shows "Collaboration Cancelled" message instead of falling through to "Terms Approved"
- `app/dashboard/influencer/page.tsx:1718-1736` - Added explicit "cancelled" check in Stage 2 and restricted "Content Approved" to only show for statuses that actually mean content was approved: publishing, delivered, completed, resolved

### Verification
- [x] Linter passes
- [x] No new lint errors introduced

---

## FIX-021: Specific error message for insufficient balance on agree

### Changes Made
- `app/api/collaborations/[id]/agree/route.ts:107` - Changed generic "Insufficient balance" message to "Insufficient balance. The project needs to deposit funds before the collaboration can start."

### Verification
- [x] Linter passes
- [x] No new lint errors introduced

---

## FIX-022: Brand can see KOL declined and propose new price

### Changes Made
- `app/api/collaborations/route.ts:61-66` - Changed brand collaboration query from `include` to `select` and added `influencerAgreed` and `brandAgreed` fields
- `app/dashboard/brand/components/types.ts:116-119` - Added `influencerAgreed` and `brandAgreed` to `CampaignApplication` interface
- `app/dashboard/brand/components/campaigns-tab.tsx:341-342` - Added `influencerAgreed` and `brandAgreed` to the handleOpenCampaign mapper
- `app/dashboard/brand/components/campaigns-tab.tsx:1560-1610` - Added "Creator declined your offer" message with "Propose New Price" button when `collaborationStatus === "NEGOTIATING"` and `influencerAgreed === false`

### Verification
- [x] Linter passes
- [x] No new lint errors introduced

---

## FIX-023: Brand can cancel negotiation

### Changes Made
- `app/dashboard/brand/components/campaigns-tab.tsx:1613-1641` - Added "Cancel Negotiation" button in pipeline view for NEGOTIATING status; sends PATCH `{ status: 'CANCELLED' }`, removes from pipeline, shows toast

### Verification
- [x] Linter passes
- [x] No new lint errors introduced

---

## FIX-024: KOL has separate Decline Price and Cancel Collaboration buttons

### Changes Made
- `app/dashboard/influencer/page.tsx:1518-1521` - Changed Decline button to amber styling ("Decline Price")
- `app/dashboard/influencer/page.tsx:1545-1567` - Added separate "Cancel Collaboration" button (red) that sends `{ status: 'CANCELLED' }` and fully exits the collaboration

### Verification
- [x] Linter passes
- [x] No new lint errors introduced

---

## FIX-025: Invitation message visible for KOL

### Changes Made
- `app/dashboard/influencer/page.tsx:129` - Added `collaborationMessage` field to Campaign interface
- `app/dashboard/influencer/page.tsx:307,586,728` - Added `collaborationMessage` mapping in all three collaboration mappers (initial fetch, refreshCollaborations, post-apply)
- `app/dashboard/influencer/page.tsx:1205-1209` - Added "Invited" badge (purple) next to campaign title when collaboration message contains "invited"

### Verification
- [x] Linter passes
- [x] No new lint errors introduced

---

## FIX-026: Collaboration terms fields rename, persistence, and agreement checkbox

### Changes Made
- `prisma/schema.prisma:258-259` - Added `brandTerms` and `influencerTerms` optional String fields to Collaboration model
- `prisma/migrations/0012_collaboration_terms/migration.sql` - Created migration to add `brand_terms` and `influencer_terms` columns
- `app/api/collaborations/[id]/route.ts:97-99` - Brand can now save `brandTerms` via PATCH (max 2000 chars)
- `app/api/collaborations/[id]/route.ts:106-108` - Influencer can now save `influencerTerms` via PATCH (max 2000 chars)
- `app/api/collaborations/route.ts:66` - Added `brandTerms` and `influencerTerms` to brand's collaboration SELECT query
- `app/dashboard/brand/components/campaigns-tab.tsx:119-120` - Added `termsAccepted` and `termsHighlight` state for agreement checkbox
- `app/dashboard/brand/components/campaigns-tab.tsx:1397-1430` - Renamed "Brand Terms" to "Project Terms", "Influencer Terms" to "Creator Terms"
- `app/dashboard/brand/components/campaigns-tab.tsx:1418-1424` - Added onBlur save for brandTerms via PATCH API
- `app/dashboard/brand/components/campaigns-tab.tsx:1559-1580` - Added Creator Terms display and agreement checkbox before Start Campaign button
- `app/dashboard/brand/components/campaigns-tab.tsx:1585-1589` - Added terms acceptance check with highlight animation before starting campaign
- `app/dashboard/brand/components/campaigns-tab.tsx:348-349` - Added brandTerms and influencerTerms to brand mapper
- `app/dashboard/brand/components/campaigns-tab.tsx:2858` - Included brandTerms in price proposal PATCH body
- `app/dashboard/influencer/page.tsx:315-316,598-599,739-740` - Added brandTerms and influencerTerms to all three influencer mappers
- `app/dashboard/influencer/page.tsx:1455-1468` - Renamed "Your Terms" to "Creator Terms", added onBlur save via PATCH API
- `app/dashboard/influencer/page.tsx:1481-1486` - Renamed "Brand Terms" to "Project Terms" in read-only display
- `app/dashboard/influencer/page.tsx:1539` - Included influencerTerms in Accept Price PATCH body

### Verification
- [x] Linter passes (0 errors, 8 pre-existing warnings)
- [x] No new lint errors introduced

---

## FIX-027: Brand pipeline shows negotiation UI for post-negotiation statuses

### Changes Made
- `app/dashboard/brand/components/campaigns-tab.tsx:1393-1550` - Wrapped the negotiation section (price, terms, checkboxes, cancel button) in status-aware conditional rendering:
  - **IN_PROGRESS, CONTENT_REVIEW, REVISION, PUBLISHING, DELIVERED, COMPLETED, RESOLVED**: Shows completed Stage 1 with green "Terms Approved" badge, blue "Advance Payment Secured (50%)" badge with amount, and read-only agreed price/terms
  - **AGREED**: Shows read-only agreed price/terms with "Terms Agreed" badge indicating funds are frozen
  - **NEGOTIATING**: Keeps existing editable negotiation UI (price, terms, checkboxes, decline/cancel buttons)
- `app/dashboard/brand/components/campaigns-tab.tsx:1385` - Updated header from always showing "Negotiation with X" to "Collaboration with X" for post-negotiation statuses

### Verification
- [x] Linter passes (0 errors, 7 pre-existing warnings)
- [x] No new lint errors introduced

---

## Summary

| ID | File | Status |
|----|------|--------|
| FIX-001 | app/api/collaborations/[id]/route.ts | done |
| FIX-002 | app/api/campaigns/[id]/route.ts | done |
| FIX-003 | app/api/campaigns/route.ts | done |
| FIX-004 | app/api/auth/signup/route.ts, login/route.ts, password/route.ts, reset-password/route.ts | done |
| FIX-005 | app/api/collaborations/route.ts | done |
| FIX-006 | agree/route.ts, complete/route.ts, campaigns/route.ts, collaborations/route.ts, resend-verification/route.ts | done |
| FIX-007 | google-oauth.ts, google/route.ts, signup/page.tsx, login/page.tsx | done |
| FIX-008 | app/api/webhooks/0xprocessing/route.ts | done |
| FIX-009 | app/api/webhooks/0xprocessing/route.ts, withdraw/route.ts | done |
| FIX-010 | app/api/collaborations/[id]/complete/route.ts | done |
| FIX-011 | app/api/auth/forgot-password/route.ts, reset-password/route.ts | done |
| FIX-012 | next.config.ts | done |
| FIX-013 | app/api/health/route.ts | done |
| FIX-014 | railway.toml | done |
| FIX-015 | app/api/auth/reset-password/route.ts | done |
| FIX-016 | next.config.ts | done |
| FIX-017 | .env.example | done |
| FIX-018 | campaigns-tab.tsx | done |
| FIX-019 | app/dashboard/influencer/page.tsx | done |
| FIX-020 | app/dashboard/influencer/page.tsx | done |
| FIX-021 | app/api/collaborations/[id]/agree/route.ts | done |
| FIX-022 | collaborations/route.ts, types.ts, campaigns-tab.tsx | done |
| FIX-023 | campaigns-tab.tsx | done |
| FIX-024 | app/dashboard/influencer/page.tsx | done |
| FIX-025 | app/dashboard/influencer/page.tsx | done |
| FIX-026 | schema, API, campaigns-tab.tsx, influencer/page.tsx | done |
| FIX-027 | campaigns-tab.tsx | done |
