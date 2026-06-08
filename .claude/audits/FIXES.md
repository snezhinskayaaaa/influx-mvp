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
