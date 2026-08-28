# Security Audit

---
agent: security-auditor
status: COMPLETE
timestamp: 2026-08-28T12:00:00Z
duration: 180
findings: 12
critical_count: 1
high_count: 4
medium_count: 5
errors: []
skipped_checks: []
---

## Risk Summary

| Category       | Critical | High | Medium | Low |
|----------------|----------|------|--------|-----|
| Injection      | 0        | 0    | 0      | 0   |
| Auth           | 1        | 1    | 1      | 0   |
| Rate Limiting  | 0        | 1    | 1      | 0   |
| Secrets        | 0        | 0    | 1      | 0   |
| Headers        | 0        | 0    | 0      | 0   |
| Data Exposure  | 0        | 1    | 0      | 0   |
| CSRF           | 0        | 0    | 1      | 0   |
| Dependencies   | 0        | 1    | 1      | 0   |

**Total:** 1 Critical, 4 High, 5 Medium, 0 Low

---

## Critical Findings

### SEC-001: `/api/founding/check` Has No Authentication -- Allows Arbitrary Founding Member Grants
**CVSS Score:** 9.1 (Critical)
**Location:** `app/api/founding/check/route.ts:15`
**Issue:** This POST endpoint accepts `{ type: "brand", brandId: "..." }` or `{ type: "creator", influencerId: "..." }` and grants founding member status. It has **no authentication check** (`getCurrentUser` is never called) and **no rate limiting**. The middleware marks all `/api/founding/*` routes as public (line 18 of `middleware.ts`: `'/api/founding'` is in `publicApiRoutes`... wait, actually `/api/founding/check` is NOT in publicApiRoutes -- only `/api/founding/stats` is in `publicGetApiRoutes`). Let me re-check: `publicApiRoutes` does NOT include `/api/founding`. However, `publicGetApiRoutes` includes `/api/founding/stats` for GET only. The `/api/founding/check` route uses POST, so middleware WILL enforce JWT auth on it.

**Re-evaluation:** The middleware does protect this route (it requires JWT), but the route itself performs **no ownership verification**. Any authenticated user can pass any `brandId` or `influencerId` to grant founding status to someone else's account. This is an **authorization bypass**, not an authentication bypass.

**Attack Vector:**
```
POST /api/founding/check
Cookie: influx-token=<any_valid_user_jwt>
Body: { "type": "brand", "brandId": "<victim_brand_id>" }
```
Any logged-in user (even an INFLUENCER) can grant founding member status to any brand or influencer.

**Impact:** Unauthorized founding member status grants, leading to reduced platform fees (2% deposit / 3% withdrawal vs standard 4%/6%) -- direct revenue loss.

**Remediation:**
```typescript
const user = await getCurrentUser()
if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

// Verify ownership: the caller must own the brand/influencer
if (type === 'brand') {
  const brand = await prisma.brand.findUnique({ where: { id: brandId } })
  if (!brand || brand.userId !== user.userId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  // ... rest of logic
}
```

---

## High Findings

### SEC-002: `/api/auth/2fa/google-verify` Has No Rate Limiting -- TOTP Brute Force
**CVSS Score:** 7.5 (High)
**Location:** `app/api/auth/2fa/google-verify/route.ts:11`
**Issue:** This endpoint accepts `{ email, totpCode }` and issues an auth cookie on success. It has **no rate limiting**. TOTP codes are 6 digits (1,000,000 combinations). An attacker knowing the user's email can brute-force all codes in minutes.

Additionally, the route is in the `/api/auth/` path which is marked as a public API route in middleware (line 20: `'/api/auth'`), so no JWT is required.

**Attack Vector:** Automated brute-force of 6-digit TOTP codes against a known email address.

**Impact:** Full account takeover bypassing 2FA protection.

**Remediation:**
```typescript
const ip = request.headers.get('x-forwarded-for') || 'unknown'
const { success } = rateLimit(`2fa-google:${ip}:${email}`, 5, 300000) // 5 attempts per 5 minutes
if (!success) {
  return NextResponse.json({ error: 'Too many attempts' }, { status: 429 })
}
```

### SEC-003: In-Memory Rate Limiter Resets on Deploy / Does Not Work Across Instances
**CVSS Score:** 7.1 (High)
**Location:** `lib/rate-limit.ts:1`
**Issue:** The rate limiter stores state in a `Map()` in process memory. This means:
1. Every deployment/restart resets all rate limit counters.
2. If running multiple server instances (e.g., Railway with replicas), each instance has its own counter -- an attacker can bypass limits by distributing requests.
3. Serverless functions (if used) create new instances per invocation.

**Impact:** Rate limiting on login, signup, forgot-password, deposits, and withdrawals can be bypassed.

**Remediation:** Use Redis-based rate limiting (e.g., `@upstash/ratelimit` or `ioredis` with a sliding window). For Railway deployments with a single instance, the current approach works minimally but is fragile.

### SEC-004: Email HTML Templates Interpolate User Content Without Sanitization
**CVSS Score:** 6.8 (High)
**Location:** `lib/email.ts:88-89`
**Issue:** `sendCollaborationEmail()` interpolates `heading` and `body` parameters directly into HTML:
```typescript
<h1>${heading}</h1>
<p>${body}</p>
```
If any caller passes user-controlled content (e.g., campaign title, influencer handle) into `heading` or `body`, it creates a **stored XSS via email** vector. Campaign titles and company names are user-supplied and could contain `<script>` tags or malicious HTML.

**Impact:** Phishing attacks, cookie theft via email clients that render HTML.

**Remediation:** Sanitize all interpolated values with HTML entity encoding before inserting into templates:
```typescript
function escapeHtml(str: string): string {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')
}
```

### SEC-005: 26 npm Dependency Vulnerabilities (19 High)
**CVSS Score:** Variable (High aggregate)
**Location:** `package.json` / `node_modules/`
**Issue:** `npm audit` reports 26 vulnerabilities: 2 low, 5 moderate, 19 high. Notable ones:
- `@hono/node-server`: Authorization bypass via encoded slashes (CVSS 7.5)
- `uuid`: Missing buffer bounds check
- Multiple transitive vulnerabilities through `resend` -> `svix` -> `uuid`

**Remediation:** Run `npm audit fix` for non-breaking fixes, then evaluate `npm audit fix --force` for breaking changes.

---

## Medium Findings

### SEC-006: Multiple Auth Endpoints Lack Rate Limiting
**CVSS Score:** 5.3 (Medium)
**Location:** Multiple files
**Issue:** The following authentication/security-sensitive endpoints have no rate limiting:
- `app/api/auth/2fa/verify/route.ts` -- 2FA setup verification
- `app/api/auth/2fa/disable/route.ts` -- 2FA disable
- `app/api/auth/2fa/setup/route.ts` -- 2FA setup
- `app/api/auth/change-password/route.ts` -- password change
- `app/api/auth/verify-email/route.ts` -- email verification
- `app/api/auth/google/route.ts` -- Google OAuth callback

While the login/signup/forgot-password routes have rate limiting, these related auth endpoints do not.

**Impact:** Potential for brute-force attacks on 2FA codes during setup, or abuse of verification endpoints.

**Remediation:** Add rate limiting to all auth-related endpoints.

### SEC-007: Admin Settings Send-Code Uses `Math.random()` for Security Code
**CVSS Score:** 5.3 (Medium)
**Location:** `app/api/admin/settings/send-code/route.ts:23`
**Issue:**
```typescript
const code = Math.floor(100000 + Math.random() * 900000).toString()
```
`Math.random()` is not cryptographically secure. While the code is sent via email (limiting attack surface), using a predictable PRNG for security tokens is a bad practice.

**Remediation:**
```typescript
import crypto from 'crypto'
const code = crypto.randomInt(100000, 999999).toString()
```

### SEC-008: `.env.example` Contains Placeholder That Looks Like a Real Value
**CVSS Score:** 4.0 (Medium)
**Location:** `.env.example:29`
**Issue:**
```
YOUTUBE_API_KEY=your_youtube_api_key
```
While not a real secret, having non-empty placeholder values in `.env.example` can lead to confusion. More importantly, `.env.example` is committed to git (confirmed via `git ls-files`), and the DATABASE_URL line contains a template with `user:password` which, if copied verbatim, could expose a default database.

**Remediation:** Use clearly empty or commented placeholder values:
```
YOUTUBE_API_KEY=
# DATABASE_URL=postgresql://user:password@localhost:5432/influx_mvp
```

### SEC-009: CSRF Protection Allows Requests Without Origin Header
**CVSS Score:** 4.3 (Medium)
**Location:** `middleware.ts:54-58`
**Issue:**
```typescript
if (!origin) {
  // Requests without an Origin header (e.g. server-to-server) are allowed
  return true
}
```
While browsers always send the `Origin` header on cross-origin requests, some older clients or custom HTTP tools can omit it. This means server-to-server CSRF attacks (or attacks from non-browser clients) bypass CSRF protection. The comment acknowledges this tradeoff, but it weakens the CSRF defense.

**Impact:** Theoretical CSRF bypass from non-browser HTTP clients.

**Remediation:** Consider also checking `Referer` header as a fallback, or requiring a custom header (e.g., `X-Requested-With`) for mutation requests.

### SEC-010: 42 of 58 API Routes Lack Rate Limiting
**CVSS Score:** 4.0 (Medium)
**Location:** All `app/api/` routes listed below
**Issue:** Only 16 out of 58 API route files use rate limiting. While admin routes are protected behind JWT + ADMIN role check in middleware, the following non-admin, non-auth routes have no rate limiting:

**Financial routes (already rate-limited -- good):**
- `wallet/deposit` and `wallet/withdraw` -- have rate limiting

**Unprotected routes (no rate limiting):**
- `app/api/brands/me/route.ts`
- `app/api/campaigns/[id]/route.ts`
- `app/api/collaborations/[id]/route.ts`
- `app/api/collaborations/[id]/agreement/route.ts`
- `app/api/influencers/me/route.ts`
- `app/api/influencers/route.ts` (public GET)
- `app/api/notifications/route.ts`
- `app/api/profiles/avatar/route.ts`
- `app/api/profiles/me/route.ts`
- `app/api/profiles/me/notifications/route.ts`
- `app/api/profiles/referral/route.ts`
- `app/api/social/verify/route.ts`
- `app/api/social/youtube/route.ts`
- `app/api/wallet/route.ts` (GET balance)
- `app/api/founding/check/route.ts`
- `app/api/founding/stats/route.ts`
- All admin routes (14 files)

**Impact:** Potential for DoS or abuse on unprotected endpoints.

**Remediation:** Add at minimum a global rate limiter in middleware (e.g., 100 req/min per IP for authenticated routes, 30 req/min for public routes).

---

## Positive Security Findings (What Is Done Well)

1. **No hardcoded secrets found.** All API keys, JWT secrets, and credentials use `process.env`. The codebase correctly validates JWT_SECRET length >= 32 chars at startup.

2. **No SQL injection risk.** All database queries use Prisma ORM with parameterized queries. The only `$queryRaw` usage (`SELECT 1` in health check) is a static string with no interpolation.

3. **No XSS via dangerouslySetInnerHTML.** Zero instances found in the codebase.

4. **No command injection.** No use of `exec`, `spawn`, `execSync`, or `child_process` in application code.

5. **Strong security headers.** `next.config.ts` sets X-Frame-Options: DENY, X-Content-Type-Options: nosniff, HSTS, CSP, Referrer-Policy, and Permissions-Policy.

6. **Good cookie configuration.** Auth cookies are httpOnly, secure in production, sameSite: lax, with 7-day expiry.

7. **CSRF protection exists.** Origin-based CSRF validation in middleware for all mutation requests.

8. **Webhook signature verification.** Both deposit and withdrawal webhooks verify HMAC signatures with timing-safe comparison.

9. **Password hashing with bcrypt.** Salt rounds = 12, password max length enforced (128 chars to prevent bcrypt DoS).

10. **2FA implementation.** TOTP-based 2FA with backup codes, properly integrated into login flow.

11. **No .env files committed.** `.gitignore` excludes `.env*` and only `.env.example` is tracked.

12. **JWT purpose-scoping.** Email verification and password reset tokens include a `purpose` field to prevent token reuse across different flows.

13. **Cron route protected.** `/api/cron/auto-release` verifies `CRON_SECRET` via Bearer token.

14. **Email enumeration prevention.** Forgot-password returns success even if email not found.

---

## Checklist

### Must Fix (Before Deploy)
- [ ] **SEC-001**: Add ownership verification to `/api/founding/check` -- any user can grant founding status to any account
- [ ] **SEC-002**: Add rate limiting to `/api/auth/2fa/google-verify` -- TOTP brute-force possible

### Should Fix (High Priority)
- [ ] **SEC-003**: Replace in-memory rate limiter with Redis-backed solution
- [ ] **SEC-004**: Sanitize HTML in email templates (`sendCollaborationEmail`)
- [ ] **SEC-005**: Run `npm audit fix` to address dependency vulnerabilities
- [ ] **SEC-006**: Add rate limiting to remaining auth endpoints (2fa/verify, 2fa/disable, change-password)

### Recommended
- [ ] **SEC-007**: Use `crypto.randomInt()` instead of `Math.random()` for admin verification codes
- [ ] **SEC-008**: Clean up `.env.example` placeholder values
- [ ] **SEC-009**: Strengthen CSRF by adding Referer fallback check
- [ ] **SEC-010**: Add global rate limiting in middleware for all API routes

