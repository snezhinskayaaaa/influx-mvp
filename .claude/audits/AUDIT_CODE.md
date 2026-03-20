# Code Quality Audit

---
agent: code-auditor
status: COMPLETE
timestamp: 2026-03-20T12:00:00Z
duration: 45 seconds
findings: 18
files_scanned: 34
any_count: 0
console_log_count: 4
errors: []
skipped_checks: []
---

## Summary
| Category | Count |
|----------|-------|
| Type Safety | 3 |
| Complexity | 3 |
| Maintainability | 3 |
| Consistency | 5 |
| Code Hygiene | 4 |

## Metrics
| Metric | Value | Target | Status |
|--------|-------|--------|--------|
| `any` usage | 0 | < 5 | PASS |
| console.log count | 4 | 0 | FAIL |
| TODO/FIXME count | 11 | < 20 | PASS |
| Files > 500 lines | 4 | 0 | FAIL |
| Functions > 50 lines | 3+ | 0 | FAIL |

---

## Critical

### CODE-001: `$transaction` Incompatible with PrismaPg Driver Adapter (Interactive Transactions)
**File:** `/Users/snezhinskayaaaa/Projects/influx-mvp/lib/prisma.ts` (lines 23-25)
**Affects:** `/Users/snezhinskayaaaa/Projects/influx-mvp/app/api/auth/signup/route.ts:79`, `/Users/snezhinskayaaaa/Projects/influx-mvp/app/api/collaborations/[id]/agree/route.ts:57`, `/Users/snezhinskayaaaa/Projects/influx-mvp/app/api/collaborations/[id]/complete/route.ts:45`, `/Users/snezhinskayaaaa/Projects/influx-mvp/app/api/wallet/deposit/route.ts:34`, `/Users/snezhinskayaaaa/Projects/influx-mvp/app/api/wallet/withdraw/route.ts:40`
**Severity:** CRITICAL
**Issue:** The PrismaPg driver adapter (used here with `new PrismaPg(pool)`) does NOT support interactive transactions (`prisma.$transaction(async (tx) => { ... })`). Interactive transactions require a direct database connection managed by the Prisma engine, which driver adapters bypass. The signup route uses `$transaction` at line 79, which will throw at runtime. This is the root cause of the "An unexpected error occurred" on signup.
**Fix:** Replace interactive transactions with sequential transactions (array form) where possible, or remove the driver adapter and use Prisma's built-in connection with `DATABASE_URL` in the schema `datasource` block:

Option A -- Remove the driver adapter entirely (recommended for simplicity):
```prisma
// schema.prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
}
```
```typescript
// lib/prisma.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient(): PrismaClient {
  if (!process.env.DATABASE_URL) {
    return new Proxy({} as PrismaClient, {
      get(_target, prop) {
        if (prop === 'then' || prop === 'catch' || typeof prop === 'symbol') return undefined
        return () => Promise.resolve(null)
      },
    })
  }
  return new PrismaClient()
}

const prisma = globalForPrisma.prisma ?? createPrismaClient()
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
export default prisma
```

Option B -- Keep the adapter but convert to sequential (non-interactive) transactions where you can, and restructure signup to not need a transaction (create profile first, then role record; if the role record fails, delete the profile in a catch block).

### CODE-002: Signup Profile ID Generation Conflicts with Schema Default
**File:** `/Users/snezhinskayaaaa/Projects/influx-mvp/app/api/auth/signup/route.ts`, line 76
**Severity:** CRITICAL
**Issue:** Line 76 generates a UUID with `crypto.randomUUID()` and passes it as `id: profileId` in the `profile.create` call (line 82). The schema defines `id` with `@default(dbgenerated("gen_random_uuid()"))`. When using the PrismaPg adapter, `gen_random_uuid()` is a PostgreSQL function. Manually providing a JS-generated UUID might work, but it creates a mismatch: the Brand/Influencer `id` field also relies on `gen_random_uuid()` which the adapter sends as a raw SQL default. With driver adapters, `dbgenerated()` defaults may or may not be sent depending on Prisma version behavior. This is fragile at best. If the adapter is removed (per CODE-001), the JS-generated UUID is unnecessary and should be omitted to let the database generate it.
**Fix:** Remove the manual UUID generation and let the database handle it:
```typescript
// Remove: const profileId = crypto.randomUUID()
const newProfile = await tx.profile.create({
  data: {
    // Remove: id: profileId,
    email,
    passwordHash,
    fullName: fullName || null,
    role,
  },
})
```

### CODE-003: Schema `datasource` Missing `url` Property
**File:** `/Users/snezhinskayaaaa/Projects/influx-mvp/prisma/schema.prisma`, lines 5-7
**Severity:** CRITICAL
**Issue:** The datasource block has no `url` property:
```prisma
datasource db {
  provider = "postgresql"
}
```
While this works when using a driver adapter (the adapter provides the connection), it breaks `prisma db push` and `prisma migrate` because those CLI commands need the URL directly. The Railway deploy command `npx prisma db push --url $DATABASE_URL` works around this, but local development (`npm run db:push`) will fail without the `--url` flag. More critically, if the adapter is removed (per CODE-001 fix), this will break completely at runtime.
**Fix:**
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

---

## High

### CODE-004: Middleware Auth Routes Mismatch Actual Routes
**File:** `/Users/snezhinskayaaaa/Projects/influx-mvp/middleware.ts`, lines 14, 62-69
**Severity:** HIGH
**Issue:** The `authRoutes` array (routes that redirect logged-in users away from auth pages) contains `'/auth/login'`, `'/brands/signup'`, `'/influencers/signup'`. But the actual login page is at `/login` (not `/auth/login`) and the signup page is at `/signup` (not `/brands/signup` or `/influencers/signup`). The matcher config also only matches `/auth/:path*`, `/brands/signup`, `/influencers/signup` but NOT `/login` or `/signup`. This means:
1. Logged-in users visiting `/login` or `/signup` are NOT redirected to their dashboard.
2. The middleware never runs for the actual login/signup routes.
**Fix:**
```typescript
const authRoutes = ['/login', '/signup']

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/login',
    '/signup',
  ],
}
```

### CODE-005: Deposit Fee Charged but Not Deducted from Credited Amount
**File:** `/Users/snezhinskayaaaa/Projects/influx-mvp/app/api/wallet/deposit/route.ts`, lines 31-46
**Severity:** HIGH
**Issue:** A 2% deposit fee is calculated (`fee = Math.round(amountCents * 0.02)`) but the full `amountCents` is credited to the brand's balance (line 37: `balance: { increment: amountCents }`). The fee is recorded in the transaction description but never actually collected -- the brand gets the full amount. The response says `totalCharged: amountCents + fee` implying the user pays more, but the brand's balance increases by the full deposit amount, not `amountCents - fee`.
**Fix:** Either credit `amountCents - fee` (fee deducted from deposit) or actually charge `amountCents + fee` from the payment processor. For now, at minimum:
```typescript
const credited = amountCents - fee
const updated = await tx.brand.update({
  where: { id: brand.id },
  data: { balance: { increment: credited } },
})
```

### CODE-006: Fee Percentages Hardcoded Instead of Using PlatformSettings
**Files:** `/Users/snezhinskayaaaa/Projects/influx-mvp/app/api/wallet/deposit/route.ts:32`, `/Users/snezhinskayaaaa/Projects/influx-mvp/app/api/wallet/withdraw/route.ts:37`
**Severity:** HIGH
**Issue:** Deposit fee is hardcoded as 2% and withdrawal fee as 3%, while a `PlatformSettings` model exists with `depositFeePercent` and `withdrawalFeePercent` that admins can update. The admin settings endpoint lets admins change these values, but the actual deposit/withdraw routes ignore them entirely.
**Fix:** Fetch `PlatformSettings` before calculating fees:
```typescript
const settings = await prisma.platformSettings.findUnique({ where: { id: 'default' } })
const feePercent = (settings?.depositFeePercent ?? 2) / 100
const fee = Math.round(amountCents * Number(feePercent))
```

### CODE-007: Influencer Price Fields Stored in Cents but Displayed Without Conversion Context
**File:** `/Users/snezhinskayaaaa/Projects/influx-mvp/app/api/influencers/me/route.ts`, lines 108-115
**Severity:** HIGH
**Issue:** The PATCH endpoint for influencer price fields (`pricePerPost`, `pricePerStory`, `pricePerVideo`) converts dollars to cents: `Math.round(dollars * 100)`. However, the GET endpoint returns the raw cents value. The brand dashboard at line 894 correctly divides by 100: `(pricePerPost / 100).toFixed(0)`. But the influencer dashboard and other consumers have no documentation about this convention, leading to inconsistency risk. Setting a price of `0` when the input is invalid (line 113) silently corrupts data instead of returning a validation error.
**Fix:** Return a validation error for invalid price inputs instead of silently setting 0:
```typescript
for (const field of PRICE_FIELDS) {
  if (field in body) {
    const dollars = parseFloat(body[field])
    if (!Number.isFinite(dollars) || dollars < 0) {
      return NextResponse.json(
        { error: `${field} must be a valid non-negative number` },
        { status: 400 }
      )
    }
    updateData[field] = Math.round(dollars * 100)
  }
}
```

---

## Medium

### CODE-008: Google OAuth Handlers Redirect Without Authentication
**File:** `/Users/snezhinskayaaaa/Projects/influx-mvp/app/signup/page.tsx`, lines 95-105
**File:** `/Users/snezhinskayaaaa/Projects/influx-mvp/app/login/page.tsx`, lines 65-71
**Severity:** MEDIUM
**Issue:** The `handleGoogleSignup` and `handleGoogleLogin` functions log to console and redirect to onboarding/dashboard without any actual authentication. A user clicking "Continue with Google" will be redirected to protected routes without a valid auth cookie, then bounced by middleware (if middleware were configured correctly per CODE-004, which it currently is not). This creates a confusing UX.
**Fix:** Either disable the Google buttons entirely until OAuth is implemented, or show a "Coming soon" toast instead of silently redirecting:
```typescript
const handleGoogleSignup = () => {
  setError("Google sign-in coming soon. Please use email signup.");
};
```

### CODE-009: Campaign Creation Does Not Freeze Budget from Brand Balance
**File:** `/Users/snezhinskayaaaa/Projects/influx-mvp/app/api/campaigns/route.ts`, lines 103-131
**Severity:** MEDIUM
**Issue:** Line 106 checks that `brand.balance < budgetMinCents` but never actually deducts or freezes any funds. The campaign is created at `ACTIVE` status with a budget range, but the brand's balance is untouched. A brand with $100 balance could create 10 campaigns each with $100 budget, over-committing their funds.
**Fix:** Either freeze `budgetMinCents` from the brand's balance when creating a campaign, or remove the balance check entirely and only enforce balance checks when a collaboration agreement is finalized (which is what the agree endpoint does).

### CODE-010: Campaign GET for Influencers Shows Only ACTIVE Campaigns
**File:** `/Users/snezhinskayaaaa/Projects/influx-mvp/app/api/campaigns/route.ts`, line 36
**Severity:** MEDIUM
**Issue:** The campaigns GET endpoint for influencers filters by `status: 'ACTIVE'`. But the Prisma schema uses `@map("active")` on the enum value, and Prisma expects the TypeScript-side enum name `ACTIVE`, not the database value. However, since Prisma handles the mapping internally, passing the string `'ACTIVE'` should work. The real issue is that influencers cannot see campaigns they previously applied to if those campaigns are now `COMPLETED` or `DRAFT`. Their collaboration history is only visible via the collaborations endpoint.
**Fix:** This is a design consideration. If intended, add a comment. If not, include additional statuses or separate the "browse" and "my campaigns" views.

### CODE-011: Admin Influencer Status Filter Uses Enum Values Directly
**File:** `/Users/snezhinskayaaaa/Projects/influx-mvp/app/api/admin/influencers/route.ts`, lines 22-31
**Severity:** MEDIUM
**Issue:** The status query parameter is validated against `Object.values(InfluencerStatus)`, which returns the TypeScript enum values (`PENDING`, `APPROVED`, `REJECTED`). The admin UI would need to send uppercase values. If the admin UI sends lowercase values (matching the database `@map` values like `pending`), the validation will reject them. This is correct behavior for Prisma, but could confuse API consumers who inspect the database directly.
**Fix:** Document the expected API format or add case-insensitive matching.

### CODE-012: Inconsistent API Response Shapes
**Files:** Multiple API routes
**Severity:** MEDIUM
**Issue:** API routes use inconsistent response envelope patterns:
- Signup/login: `{ success: true, user: {...} }` or `{ success: false, error: '...' }`
- Brands/me: `{ brand: {...} }` or `{ error: '...' }` (no `success` field)
- Campaigns: `{ campaigns: [...] }` or `{ error: '...' }` (no `success` field)
- Wallet: `{ wallet: {...}, transactions: [...] }` (no `success` field)

The auth routes include `success: boolean` but all other routes omit it. This forces frontend code to check both `res.ok` and sometimes `data.success`.
**Fix:** Standardize all responses to either always include `success` or never include it (rely on HTTP status codes only). Pick one pattern and apply consistently.

---

## Low

### CODE-013: God Files -- Dashboard Pages Exceed 500 Lines Significantly
**Files:**
- `/Users/snezhinskayaaaa/Projects/influx-mvp/app/dashboard/brand/page.tsx` -- 5504 lines
- `/Users/snezhinskayaaaa/Projects/influx-mvp/app/dashboard/influencer/page.tsx` -- 1998 lines
- `/Users/snezhinskayaaaa/Projects/influx-mvp/app/influencers/page.tsx` -- 1126 lines
- `/Users/snezhinskayaaaa/Projects/influx-mvp/app/brands/page.tsx` -- 1082 lines
**Severity:** LOW
**Issue:** The brand dashboard at 5504 lines is extremely large. It contains multiple tabs (discover, campaigns, profile, create-campaign, settings), each with substantial UI. This makes the file nearly impossible to navigate, test, or maintain. The influencer dashboard is similarly oversized at 1998 lines.
**Fix:** Split each tab into its own component file:
```
app/dashboard/brand/
  page.tsx                    (layout + tab routing, ~100 lines)
  components/
    DiscoverTab.tsx
    CampaignsTab.tsx
    ProfileTab.tsx
    CreateCampaignTab.tsx
    SettingsTab.tsx
    WalletDialog.tsx
```

### CODE-014: Console.log Statements in Production Code
**Count:** 4 occurrences
**Files:**
- `/Users/snezhinskayaaaa/Projects/influx-mvp/app/signup/page.tsx:97` -- `console.log("Google signup as:", userType)`
- `/Users/snezhinskayaaaa/Projects/influx-mvp/app/login/page.tsx:67` -- `console.log("Google login")`
- `/Users/snezhinskayaaaa/Projects/influx-mvp/app/dashboard/brand/page.tsx:5071` -- `console.log(inviting influencer...)`
- `/Users/snezhinskayaaaa/Projects/influx-mvp/app/dashboard/brand/page.tsx:5407` -- `console.log("Sending counter offer:", ...)`
**Severity:** LOW
**Fix:** Remove all console.log statements from production code.

### CODE-015: TODO/FIXME Accumulation
**Count:** 11 items across the codebase
**Notable:**
- `/Users/snezhinskayaaaa/Projects/influx-mvp/app/signup/page.tsx:96` -- `TODO: Implement Google OAuth`
- `/Users/snezhinskayaaaa/Projects/influx-mvp/app/login/page.tsx:66` -- `TODO: Implement Google OAuth`
- `/Users/snezhinskayaaaa/Projects/influx-mvp/app/api/wallet/deposit/route.ts:5` -- `TODO: Integrate with 0xprocessing.com`
- `/Users/snezhinskayaaaa/Projects/influx-mvp/app/api/wallet/withdraw/route.ts:5` -- `TODO: Integrate with 0xprocessing.com`
- `/Users/snezhinskayaaaa/Projects/influx-mvp/app/dashboard/brand/page.tsx` -- 7 TODOs for unimplemented features
**Severity:** LOW
**Fix:** Convert to GitHub issues for tracking or implement the features.

### CODE-016: Build-Time Proxy in Prisma Client Is Fragile
**File:** `/Users/snezhinskayaaaa/Projects/influx-mvp/lib/prisma.ts`, lines 13-21
**Severity:** LOW
**Issue:** When `DATABASE_URL` is not set (build time), a Proxy is returned that silently returns `null` for any method call. This masks potential issues where code accidentally runs Prisma operations during build/SSG. If a page accidentally uses a server component that queries the database, it will silently return null data instead of failing loudly.
**Fix:** Consider throwing an error for non-build contexts, or using a more explicit build-detection mechanism:
```typescript
if (!url) {
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    // Return proxy only during build
    return new Proxy({} as PrismaClient, { ... })
  }
  throw new Error('DATABASE_URL is required')
}
```

### CODE-017: Unsafe Type Assertion in Token Verification
**File:** `/Users/snezhinskayaaaa/Projects/influx-mvp/lib/auth.ts`, line 27
**File:** `/Users/snezhinskayaaaa/Projects/influx-mvp/lib/auth-edge.ts`, line 13
**Severity:** LOW
**Issue:** Both files use `payload as unknown as TokenPayload` which is a double type assertion that bypasses TypeScript's type checking entirely. If the JWT payload structure changes or is tampered with, there is no runtime validation that it actually contains `userId` and `role` fields.
**Fix:** Add runtime validation:
```typescript
export async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    if (typeof payload.userId !== 'string' || typeof payload.role !== 'string') {
      return null
    }
    if (!['INFLUENCER', 'BRAND', 'ADMIN'].includes(payload.role as string)) {
      return null
    }
    return { userId: payload.userId as string, role: payload.role as TokenPayload['role'] }
  } catch {
    return null
  }
}
```

### CODE-018: Fallback JWT Secret in Production
**File:** `/Users/snezhinskayaaaa/Projects/influx-mvp/lib/auth.ts`, line 5
**File:** `/Users/snezhinskayaaaa/Projects/influx-mvp/lib/auth-edge.ts`, line 3
**Severity:** LOW (from code-quality perspective; security impact is out of scope for this audit)
**Issue:** `process.env.JWT_SECRET || 'fallback-secret-change-in-production'` provides a default secret. From a code quality standpoint, this fallback should throw an error at startup if `JWT_SECRET` is not configured, rather than silently using a weak default.
**Fix:**
```typescript
const secret = process.env.JWT_SECRET
if (!secret) throw new Error('JWT_SECRET environment variable is required')
const JWT_SECRET = new TextEncoder().encode(secret)
```

---

## Checklist

### Must Fix (CRITICAL -- blocks signup)
- [ ] Remove PrismaPg adapter or convert all `$transaction` calls to non-interactive form (CODE-001)
- [ ] Add `url = env("DATABASE_URL")` to schema datasource (CODE-003)
- [ ] Remove manual UUID generation in signup (CODE-002)

### Should Fix (HIGH -- incorrect behavior)
- [ ] Fix middleware authRoutes and matcher to match actual `/login` and `/signup` paths (CODE-004)
- [ ] Fix deposit fee not being deducted from credited amount (CODE-005)
- [ ] Use PlatformSettings for fee percentages (CODE-006)
- [ ] Validate price inputs instead of silently setting 0 (CODE-007)

### Recommended (MEDIUM/LOW -- quality improvements)
- [ ] Disable Google OAuth buttons until implemented (CODE-008)
- [ ] Standardize API response envelope format (CODE-012)
- [ ] Split god files into smaller components (CODE-013)
- [ ] Remove console.log statements (CODE-014)
- [ ] Add runtime validation for JWT payloads (CODE-017)
- [ ] Throw on missing JWT_SECRET instead of using fallback (CODE-018)
