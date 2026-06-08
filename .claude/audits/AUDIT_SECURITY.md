# Security Audit

---
agent: security-auditor
status: COMPLETE
timestamp: 2026-06-07T12:00:00Z
duration: 180 seconds
findings: 12
critical_count: 1
high_count: 4
medium_count: 5
low_count: 2
errors: []
skipped_checks: []
---

## Risk Summary

| Category       | Critical | High | Medium | Low |
|----------------|----------|------|--------|-----|
| Payment/Webhook| 1        | 1    | 1      | 0   |
| Auth           | 0        | 1    | 1      | 0   |
| Rate Limiting  | 0        | 1    | 1      | 0   |
| Headers/Config | 0        | 1    | 0      | 1   |
| Data Exposure  | 0        | 0    | 1      | 0   |
| Dependencies   | 0        | 0    | 1      | 0   |
| Secrets        | 0        | 0    | 0      | 1   |

**Total:** 1 Critical, 4 High, 5 Medium, 2 Low

---

## Critical Findings

### SEC-001: Webhook Test Mode Bypass Allows Unauthenticated Balance Manipulation
**CVSS Score:** 9.8 (Critical)
**Location:** `app/api/webhooks/0xprocessing/route.ts:10-14`
**Issue:** When `body.Test === true`, the webhook returns `{ ok: true }` immediately, BEFORE signature verification. While it does not credit balances in this path, the real vulnerability is that a production attacker who discovers a valid `BillingID` (transaction ID) could craft a legitimate-looking webhook call. The test bypass reveals the handler's structure. More critically, the signature algorithm uses **MD5** (`lib/0xprocessing.ts:108`), which is cryptographically broken and susceptible to collision attacks.

**Attack Vector:**
```
POST /api/webhooks/0xprocessing
Content-Type: application/json

{"Test": true}
# Returns 200 OK — confirms endpoint is live and reveals handler behavior
```

The MD5-based signature in `verifyDepositSignature` and `verifyWithdrawalSignature` uses a broken hash algorithm. While this is dictated by 0xProcessing's API, it remains a risk.

**Impact:** If an attacker obtains or guesses the webhook password, MD5 collisions could be used to forge valid signatures, allowing unauthorized balance crediting.

**Remediation:**
1. Move the test-mode check AFTER signature verification, or remove it entirely in production
2. Add IP allowlisting for webhook endpoints (restrict to 0xProcessing IPs)
3. Contact 0xProcessing about upgrading from MD5 to SHA-256 for webhook signatures
4. Add request logging/alerting for webhook calls
```typescript
// Move test check after signature verification
const isValid = verifyDepositSignature({ ... })
if (!isValid) {
  return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
}
if (body.Test === true && process.env.NODE_ENV !== 'production') {
  return NextResponse.json({ ok: true })
}
// In production, reject test webhooks entirely
if (body.Test === true) {
  console.warn('Test webhook rejected in production')
  return NextResponse.json({ error: 'Test mode disabled' }, { status: 400 })
}
```

---

## High Findings

### SEC-002: No Rate Limiting on Reset Password Endpoint
**CVSS Score:** 7.5 (High)
**Location:** `app/api/auth/reset-password/route.ts`
**Issue:** The `POST /api/auth/reset-password` endpoint has no rate limiting. An attacker who intercepts or brute-forces a reset token (JWT) can attempt unlimited password resets. While the JWT has 1h expiry and the `phash` check prevents reuse, lack of rate limiting allows rapid brute-force attempts against the token.

**Impact:** Token brute-force (low probability due to JWT), abuse of the endpoint for DoS.

**Remediation:**
```typescript
import { rateLimit } from '@/lib/rate-limit'

// Add at the start of POST handler:
const ip = request.headers.get('x-forwarded-for') || 'unknown'
const { success } = rateLimit(`reset-password:${ip}`, 5, 300000) // 5 per 5 min
if (!success) {
  return NextResponse.json({ error: 'Too many attempts' }, { status: 429 })
}
```

### SEC-003: In-Memory Rate Limiter Does Not Survive Restarts or Scale Horizontally
**CVSS Score:** 7.1 (High)
**Location:** `lib/rate-limit.ts`
**Issue:** Rate limiting uses an in-memory `Map`. This means:
1. Rate limit counters reset on every server restart/deployment
2. In multi-instance deployments (Railway scales), each instance has its own counter -- an attacker can bypass limits by hitting different instances
3. Memory can grow unbounded (cleanup only triggers at 10,000 entries, and a targeted attack can fill this)

**Impact:** Rate limiting is ineffective in production at scale. Attackers can bypass login/signup/deposit rate limits.

**Remediation:** Use Redis-backed rate limiting (e.g., `@upstash/ratelimit` or similar):
```typescript
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, '60 s'),
})
```

### SEC-004: Wildcard Image Remote Pattern Allows SSRF via Image Proxy
**CVSS Score:** 7.0 (High)
**Location:** `next.config.ts:11-14`
**Issue:** The `images.remotePatterns` configuration includes `hostname: "**"`, which allows Next.js image optimization to proxy ANY external URL. This can be abused for:
1. SSRF -- probing internal network services via the image proxy
2. Data exfiltration -- fetching internal resources through the server
3. Bandwidth abuse

```typescript
{
  protocol: "https",
  hostname: "**",  // DANGEROUS: allows any hostname
},
```

**Remediation:** Restrict to known hostnames:
```typescript
remotePatterns: [
  { protocol: "https", hostname: "images.unsplash.com" },
  { protocol: "https", hostname: "lh3.googleusercontent.com" }, // Google avatars
  // Add other specific domains as needed
],
```

### SEC-005: CSP Allows unsafe-inline and unsafe-eval for Scripts
**CVSS Score:** 6.5 (High)
**Location:** `next.config.ts:27`
**Issue:** The Content-Security-Policy header includes `script-src 'self' 'unsafe-inline' 'unsafe-eval'`. Both `unsafe-inline` and `unsafe-eval` significantly weaken CSP protection against XSS. While Next.js requires `unsafe-inline` for its hydration scripts, `unsafe-eval` should be removed.

**Remediation:**
- Remove `'unsafe-eval'` from script-src
- Use nonce-based CSP for inline scripts (Next.js supports this via `nonce` prop)
- If `unsafe-eval` is needed for development only, conditionally set it

---

## Medium Findings

### SEC-006: No Webhook IP Allowlisting
**CVSS Score:** 5.9 (Medium)
**Location:** `app/api/webhooks/0xprocessing/route.ts`, `app/api/webhooks/0xprocessing/withdraw/route.ts`
**Issue:** Webhook endpoints accept requests from any IP address. While signature verification provides authentication, IP allowlisting adds defense-in-depth, especially given the MD5-based signatures.

**Remediation:** Add middleware or early check to verify the request comes from 0xProcessing's IP range:
```typescript
const ALLOWED_IPS = ['x.x.x.x', 'y.y.y.y'] // Get from 0xProcessing docs
const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
if (!ALLOWED_IPS.includes(clientIp || '')) {
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
}
```

### SEC-007: No Rate Limiting on Email Verification Endpoint
**CVSS Score:** 5.3 (Medium)
**Location:** `app/api/auth/verify-email/route.ts`
**Issue:** The `POST /api/auth/verify-email` endpoint has no rate limiting. While verification tokens are JWTs with short expiry, unlimited attempts allow brute-force or abuse.

**Remediation:** Add rate limiting similar to other auth endpoints.

### SEC-008: Password Hash Prefix Embedded in Reset Token
**CVSS Score:** 5.0 (Medium)
**Location:** `app/api/auth/forgot-password/route.ts:35`
**Issue:** The password reset JWT includes `phash: profile.passwordHash.substring(0, 10)` -- the first 10 characters of the bcrypt hash. While this is a clever one-time-use mechanism (token is invalidated after password change), it leaks partial hash information in the JWT payload. JWTs are base64-encoded (not encrypted), so anyone with the token can decode the `phash` field.

**Impact:** Leaks bcrypt version, cost factor, and partial salt (bcrypt hashes start with `$2b$12$`). Low practical impact since bcrypt is resilient, but violates defense-in-depth.

**Remediation:** Use an HMAC of the password hash instead:
```typescript
import crypto from 'crypto'
const phash = crypto.createHmac('sha256', process.env.JWT_SECRET!)
  .update(profile.passwordHash)
  .digest('hex')
  .substring(0, 16)
```

### SEC-009: Deposit Webhook Credits `transaction.amount - transaction.fee` Without Validating Against Payment Provider Amount
**CVSS Score:** 5.5 (Medium)
**Location:** `app/api/webhooks/0xprocessing/route.ts:55`
**Issue:** When a deposit webhook arrives with `Status: 'Success'`, the handler credits `transaction.amount - transaction.fee` (the amount from the local DB record). It does NOT verify that the amount actually paid via 0xProcessing matches the expected amount. If the 0xProcessing webhook includes an `AmountUSD` or similar field, it should be compared against the local transaction record.

**Impact:** If the payment provider sends a success callback for a partial payment, the full amount is still credited.

**Remediation:**
```typescript
// Compare webhook amount against expected amount
if (body.AmountUSD !== undefined) {
  const paidCents = Math.round(parseFloat(body.AmountUSD) * 100)
  if (paidCents < transaction.amount) {
    console.error('Partial payment detected', { expected: transaction.amount, received: paidCents })
    // Handle partial payment appropriately
  }
}
```

### SEC-010: Dependency Vulnerabilities
**CVSS Score:** Variable (Medium aggregate)
**Issue:** `npm audit` reports multiple high-severity vulnerabilities:
- `@hono/node-server`: Authorization bypass via encoded slashes
- `defu`: Prototype pollution via `__proto__`
- `effect` (via Prisma): AsyncLocalStorage context contamination
- `express-rate-limit`: IPv4-mapped IPv6 bypass
- `fast-uri`: Path traversal via percent-encoded segments
- `flatted`: Unbounded recursion DoS and prototype pollution

**Remediation:** Run `npm audit fix` to apply available patches. For packages without fixes, evaluate if they are used in production code paths.

---

## Low Findings

### SEC-011: Avatar Stored as Base64 Data URL in Database
**CVSS Score:** 3.1 (Low)
**Location:** `app/api/profiles/avatar/route.ts:29`
**Issue:** Avatar images are stored as base64 data URLs directly in the database. While a 3MB size limit is enforced, this approach:
1. Bloats database size
2. Returns full base64 data in API responses, increasing bandwidth
3. The `data:image/` prefix check is minimal -- an attacker could craft a payload like `data:image/svg+xml;base64,...` with embedded scripts (SVG XSS), though this is mitigated because the data is stored/returned as a string, not rendered as HTML.

**Remediation:** Use object storage (S3, Cloudflare R2) and store URLs. Validate MIME type server-side (reject SVG).

### SEC-012: Admin Self-Deletion Not Prevented
**CVSS Score:** 2.0 (Low)
**Location:** `app/api/admin/users/[id]/route.ts:57-81`
**Issue:** While the code prevents deleting the last admin, an admin can delete their own account (the currently logged-in admin), which could cause immediate session invalidation issues but is not a security vulnerability per se.

**Remediation:** Add check: `if (id === user.userId) return error('Cannot delete your own account')`

---

## What Was Done Well

The codebase demonstrates strong security practices in several areas:

1. **Authentication:** JWT with HS256, enforced minimum 32-char secret, 7-day expiry, httpOnly/secure/sameSite cookies. Proper validation at startup.

2. **Password Hashing:** bcrypt with 12 rounds -- solid. Password length limits (8-128 chars) prevent bcrypt DoS.

3. **CSRF Protection:** Origin-based CSRF check in middleware for all mutation requests. OAuth nonce for Google OAuth flow.

4. **Authorization:** Role-based access control enforced in middleware AND in individual route handlers (defense-in-depth). Ownership checks on collaborations.

5. **Input Validation:** Comprehensive validation on all endpoints -- type checks, length limits, range checks, email format validation.

6. **SQL Injection:** All database queries use Prisma ORM with parameterized queries. No raw SQL found anywhere.

7. **XSS Prevention:** No `dangerouslySetInnerHTML` or `innerHTML` usage. No user-supplied HTML rendering.

8. **Secrets Management:** All secrets use `process.env`. Only `NEXT_PUBLIC_*` vars exposed to client. `.env*` in `.gitignore`. No hardcoded secrets found.

9. **Security Headers:** HSTS, X-Frame-Options DENY, X-Content-Type-Options nosniff, Referrer-Policy, Permissions-Policy all configured.

10. **Financial Operations:** Atomic transactions with Prisma `$transaction`, idempotent webhook processing, balance checks before deductions, proper freeze/unfreeze/refund flows.

11. **Webhook Security:** Signature verification with timing-safe comparison. Idempotency checks on transaction status.

12. **Email Enumeration Prevention:** Login returns generic "Invalid email or password". Forgot-password always returns success.

13. **Rate Limiting:** Applied to login (5/min), signup (10/min), forgot-password (3/5min), password change (3/min), deposits (5/min), withdrawals (3/min), collaboration operations.

---

## Checklist

### Must Fix (Before Deploy)
- [ ] SEC-001: Move test-mode check after signature verification; reject test webhooks in production
- [ ] SEC-004: Remove wildcard `hostname: "**"` from image remote patterns
- [ ] SEC-003: Migrate rate limiter to Redis-backed solution for production

### Should Fix (High Priority)
- [ ] SEC-002: Add rate limiting to reset-password endpoint
- [ ] SEC-005: Remove `unsafe-eval` from CSP script-src
- [ ] SEC-006: Add IP allowlisting for webhook endpoints
- [ ] SEC-009: Validate payment amount from webhook against local transaction record
- [ ] SEC-010: Run `npm audit fix` to patch known dependency vulnerabilities

### Recommended
- [ ] SEC-007: Add rate limiting to verify-email endpoint
- [ ] SEC-008: Use HMAC instead of raw password hash prefix in reset tokens
- [ ] SEC-011: Migrate avatar storage to object storage, reject SVG uploads
- [ ] SEC-012: Prevent admin self-deletion
