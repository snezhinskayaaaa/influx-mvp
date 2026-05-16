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
