# UI/UX Audit — influx-mvp

---
agent: code-auditor
status: COMPLETE
timestamp: 2025-07-10T12:00:00Z
duration: 180
findings: 38
files_scanned: 70
any_count: 0
console_log_count: 86
errors: []
skipped_checks: []
---

## Summary

| Category | Count |
|----------|-------|
| Broken Links / Routes | 0 |
| Stub / Non-functional Buttons | 8 |
| Form / API Route Mismatches | 0 |
| Navigation Issues | 0 |
| Auth Flow Issues | 1 |
| Dashboard Data Issues | 0 |
| Admin Data Issues | 0 |
| Carousel / Animation Issues | 0 |
| Missing Error Handling | 3 |
| Validation Inconsistency | 3 |
| Console.log in Production | 86 |
| God Files (>500 lines) | 14 |

---

## 1. Links / href — Route Existence Check

**Result: ALL internal links point to existing routes.** No broken links found.

Every `<Link href="...">` and `router.push("...")` target was cross-referenced against the 32 `page.tsx` files and 38 API `route.ts` files.

### Internal page routes verified (all exist):
- `/` — `app/page.tsx`
- `/brands` — `app/brands/page.tsx`
- `/influencers` — `app/influencers/page.tsx`
- `/pricing` — `app/pricing/page.tsx`
- `/signup` (with query params `?type=brand`, `?type=creator`, `?type=influencer`, `?plan=free`, `?plan=pro`) — `app/signup/page.tsx`
- `/login` — `app/login/page.tsx`
- `/forgot-password` — `app/forgot-password/page.tsx`
- `/reset-password` (with `?token=`) — `app/reset-password/page.tsx`
- `/verify-email` (with `?token=`) — `app/verify-email/page.tsx`
- `/terms` — `app/terms/page.tsx`
- `/privacy` — `app/privacy/page.tsx`
- `/admin` — `app/admin/page.tsx`
- `/admin/influencers` — `app/admin/influencers/page.tsx`
- `/admin/brands` — `app/admin/brands/page.tsx`
- `/admin/campaigns` — `app/admin/campaigns/page.tsx`
- `/admin/database` — `app/admin/database/page.tsx`
- `/admin/settings` — `app/admin/settings/page.tsx`
- `/dashboard/brand` — `app/dashboard/brand/page.tsx`
- `/dashboard/influencer` — `app/dashboard/influencer/page.tsx`
- `/onboarding/brand` (and step-2 through step-6, business-type, video-type) — all exist
- `/onboarding/influencer` (and step-2 through step-5) — all exist

### External links (all valid patterns):
- `https://www.instagram.com/influx.connect/`
- `https://www.tiktok.com/@aiinflux`
- `https://t.me/aiinflux`
- `https://x.com/aiinflux`
- `https://linkedin.com` (generic, not company-specific -- consider updating to a real company page)
- `mailto:support@aiinflux.io`

### Minor note:
- `https://linkedin.com` is a generic URL, not pointing to any specific company page. Low priority.

---

## 2. Buttons with onClick — Stub Detection

### STUB-001: "Send Invitation" button (CRITICAL)
- **File:** `app/dashboard/brand/page.tsx:412-417`
- **Issue:** Button is permanently `disabled` with no onClick handler. Users cannot send invitations to influencers.
- **Impact:** Core brand workflow is non-functional.

### STUB-002: "Send Counter Offer" button (CRITICAL)
- **File:** `app/dashboard/brand/page.tsx:738-743`
- **Issue:** Button is permanently `disabled` with no onClick handler. Brands cannot negotiate prices.
- **Impact:** Price negotiation workflow is completely broken.

### STUB-003: Campaign Edit/Pause/Delete buttons (MEDIUM)
- **File:** `app/dashboard/brand/components/campaigns-tab.tsx:1936-1956`
- **Issue:** Three buttons (Pencil, Pause, Trash2) are all `disabled` with `title="Coming soon"`. No functionality.
- **Impact:** Brands cannot manage existing campaigns.

### STUB-004: "Update Account" button — Influencer Settings (HIGH)
- **File:** `app/dashboard/influencer/page.tsx:2282`
- **Issue:** `<Button>Update Account</Button>` has NO onClick handler. The email and password fields above it (lines 2276-2281) use `defaultValue=""` and are not wired to any state or API call. This entire settings section is a non-functional shell.
- **Impact:** Influencers cannot change email or password from the settings tab.

### STUB-005: "Manage Payment Methods" button — Influencer Settings (MEDIUM)
- **File:** `app/dashboard/influencer/page.tsx:2335`
- **Issue:** `<Button variant="outline">Manage Payment Methods</Button>` has no onClick handler. Does nothing.

### STUB-006: "Save" button on campaign cards (LOW)
- **File:** `app/dashboard/influencer/page.tsx:1019-1022`
- **Issue:** Heart/Save button has no onClick handler. Does nothing on click.

### STUB-007: Notification checkboxes — Influencer Settings (LOW)
- **File:** `app/dashboard/influencer/page.tsx:2296-2315`
- **Issue:** Three `<input type="checkbox" defaultChecked />` elements are not connected to any state or API. Toggling them has no effect.

### STUB-008: Card payment option (LOW — properly labeled)
- **File:** `app/dashboard/brand/components/brand-nav.tsx:313-322`
- **Issue:** Card payment button is disabled with "Coming Soon" badge. Properly communicated to users.

### All other buttons verified as functional:
- All logout buttons call `/api/auth/logout` POST then redirect to `/login`
- All form submit buttons are wired to API calls
- All onboarding navigation buttons use `router.push()`
- FAQ accordion buttons on pricing page work correctly
- Carousel prev/next buttons use embla-carousel API

---

## 3. Forms — API Route Verification

**Result: ALL forms POST to existing API routes.** No mismatches found.

| Form | Method | API Route | Exists |
|------|--------|-----------|--------|
| Login | POST | `/api/auth/login` | YES |
| Signup | POST | `/api/auth/signup` | YES |
| Forgot Password | POST | `/api/auth/forgot-password` | YES |
| Reset Password | POST | `/api/auth/reset-password` | YES |
| Create Campaign | POST | `/api/campaigns` | YES |
| Apply to Campaign | POST | `/api/collaborations` | YES |
| Save Influencer Profile | PATCH | `/api/influencers/me` | YES |
| Upload Avatar | POST | `/api/profiles/avatar` | YES |
| YouTube Verify | POST | `/api/social/youtube` | YES |
| Wallet Deposit | POST | `/api/wallet/deposit` | YES |
| Wallet Withdraw | POST | `/api/wallet/withdraw` | YES |
| Admin Settings Save | PATCH | `/api/admin/settings` | YES |
| Admin Send Code | POST | `/api/admin/settings/send-code` | YES |
| Resend Verification | POST | `/api/auth/resend-verification` | YES |

---

## 4. Navigation — Menu Items Verification

**Result: ALL navigation menu items point to valid routes.**

### Public Navigation (`components/navigation.tsx`):
- `/` (logo) -- EXISTS
- `/brands` ("Browse Talent") -- EXISTS
- `/influencers` ("Monetize Content") -- EXISTS
- `/pricing` -- EXISTS
- `/signup` ("Get Started") -- EXISTS

### Admin Navigation (`components/admin-nav.tsx`):
- `/admin` ("Dashboard") -- EXISTS
- `/admin/influencers` -- EXISTS
- `/admin/brands` -- EXISTS
- `/admin/campaigns` -- EXISTS
- `/admin/database` -- EXISTS
- `/admin/settings` -- EXISTS

### Brand Dashboard Navigation (`app/dashboard/brand/components/brand-nav.tsx`):
- Tab-based navigation (discover, campaigns, create-campaign, profile, settings) -- all tabs exist in the component

### Influencer Dashboard Navigation (`app/dashboard/influencer/page.tsx`):
- Tab-based navigation (discover, my-campaigns, profile, settings) -- all tabs exist in the component

---

## 5. Auth Flow

**Result: Auth flow is correctly implemented with one notable gap.**

### Working correctly:
- **Login:** POST `/api/auth/login` -> JWT cookie set -> role-based redirect (ADMIN -> `/admin`, BRAND -> `/dashboard/brand`, INFLUENCER -> `/dashboard/influencer`)
- **Signup:** POST `/api/auth/signup` -> JWT cookie set -> redirect to onboarding (brand or influencer)
- **Logout:** POST `/api/auth/logout` -> cookie removed -> redirect to `/login`
- **Google OAuth:** Redirect to Google -> callback at `/api/auth/google` -> cookie set -> redirect
- **Forgot Password:** POST `/api/auth/forgot-password` -> email with token -> POST `/api/auth/reset-password`
- **Email Verification:** Token in URL -> POST `/api/auth/verify-email`
- **Middleware:** Protects `/dashboard`, `/admin`, `/onboarding` routes; redirects logged-in users away from `/login`, `/signup`; role-based access control on admin/brand/influencer routes

### AUTH-001: Login page does not use `redirect` query param (LOW)
- **File:** `app/login/page.tsx:55-57`
- **Issue:** The middleware sets a `redirect` query parameter when unauthenticated users hit protected routes (middleware.ts:30), but the login page ignores it. After login, users always go to their role-based dashboard, not to the page they originally tried to access.
- **Impact:** Users lose their navigation context after being forced to log in.

---

## 6. Dashboard Pages — Real API vs Mock Data

**Result: ALL dashboard pages fetch from real API routes. No mock/hardcoded data for dynamic content.**

### Brand Dashboard (`app/dashboard/brand/page.tsx`):
- Campaigns: `GET /api/campaigns` (real)
- Influencers: `GET /api/influencers` (real)
- Wallet: `GET /api/wallet` (real)
- Brand profile: `GET /api/brands/me` (real)
- Collaborations: `GET /api/collaborations` (real)
- User profile: `GET /api/profiles/me` (real)

### Influencer Dashboard (`app/dashboard/influencer/page.tsx`):
- Campaigns: `GET /api/campaigns` (real)
- Collaborations: `GET /api/collaborations` (real)
- Wallet: `GET /api/wallet` (real)
- Influencer profile: `GET /api/influencers/me` (real)
- User profile: `GET /api/profiles/me` (real)

---

## 7. Admin Pages — Real API vs Mock Data

**Result: ALL admin pages fetch from real API routes.**

- Admin dashboard (`app/admin/page.tsx`): Fetches from `/api/admin/influencers`, `/api/admin/brands`, `/api/admin/campaigns`
- Admin influencers (`app/admin/influencers/page.tsx`): Fetches from `/api/admin/influencers`, updates via `/api/admin/influencers/[id]`
- Admin brands (`app/admin/brands/page.tsx`): Fetches from `/api/admin/brands`
- Admin campaigns (`app/admin/campaigns/page.tsx`): Fetches from `/api/admin/campaigns`
- Admin database (`app/admin/database/page.tsx`): Fetches from `/api/admin/users`, `/api/admin/brands`, `/api/admin/influencers`, `/api/admin/transactions`, `/api/admin/campaigns`, `/api/admin/collaborations`
- Admin settings (`app/admin/settings/page.tsx`): Fetches from `/api/admin/settings`

---

## 8. Carousel / Animations

**Result: No broken carousels or animations detected.**

- Homepage (`app/page.tsx`): Uses `embla-carousel-react` with `embla-carousel-autoplay` plugin. Two carousels with proper `CarouselPrevious`/`CarouselNext` controls. Autoplay configured with `delay: 3000, stopOnInteraction: false`.
- Brands page (`app/brands/page.tsx:278`): Custom dot-based carousel with `setActiveIndex` -- manual implementation, not embla-based.
- All `framer-motion` animations use standard `fadeInUp` variants. No broken animation patterns detected.

---

## 9. Missing Error Handling on Fetch Calls

### ERR-001: Logout buttons have no error handling (MEDIUM)
- **Files:**
  - `components/admin-nav.tsx:81`
  - `components/admin-nav.tsx:132`
  - `app/dashboard/influencer/page.tsx:658`
  - `app/dashboard/brand/components/brand-nav.tsx:174`
- **Issue:** All logout buttons use:
  ```typescript
  await fetch('/api/auth/logout', { method: 'POST' }); window.location.href = '/login';
  ```
  No try/catch. If the fetch fails (network error), the redirect still happens, which is arguably acceptable behavior. But if the cookie isn't cleared, the user may still appear logged in on next visit.

### ERR-002: Resend verification email lacks error handling in brand dashboard (LOW)
- **File:** `app/dashboard/brand/page.tsx:823-828`
- **Issue:** Has try/catch but doesn't check `res.ok`. If the server returns a non-200 status, it still silently succeeds.

### ERR-003: Admin influencer followers save has minimal error handling (LOW)
- **File:** `app/admin/influencers/page.tsx:576-593`
- **Issue:** Catch block only does `console.error(e)` with no user feedback.

---

## 10. Client-Server Validation Consistency

### VAL-001: Password complexity rules missing on client (HIGH)
- **Client (signup):** `app/signup/page.tsx:279` only enforces `minLength={8}` via HTML attribute. No check for uppercase letter or digit.
- **Server (signup):** `app/api/auth/signup/route.ts:41` requires `[A-Z]` and `[0-9]`.
- **Impact:** Users can submit a password like "abcdefgh" from the client, only to get a server error. Poor UX.

### VAL-002: Password complexity rules missing on reset-password client (HIGH)
- **Client (reset-password):** `app/reset-password/page.tsx:50` checks `newPassword.length < 8` but does NOT check for uppercase or digit.
- **Server (reset-password):** `app/api/auth/reset-password/route.ts:16-17` requires `[A-Z]` and `[0-9]`.
- **Impact:** Same issue -- user submits, gets an opaque server error.

### VAL-003: Influencer withdrawal fee hardcoded at 3% (MEDIUM)
- **Client:** `app/dashboard/influencer/page.tsx:2466-2468` hardcodes "Withdrawal fee: 3%" and calculates `amount * 0.97`.
- **Server:** `app/api/admin/settings/route.ts` allows admins to change `withdrawalFeePercent` dynamically.
- **Impact:** If admin changes the fee, the client will show wrong amounts.

---

## 11. Console.log Statements

**Total: 86 occurrences across the codebase.**

### Client-side console statements (should be removed for production): 28

| File | Count | Examples |
|------|-------|---------|
| `app/dashboard/brand/page.tsx` | 6 | `console.error('Failed to fetch campaigns:', error)` etc. |
| `app/dashboard/influencer/page.tsx` | 5 | `console.error('Failed to fetch dashboard data:', error)` etc. |
| `app/admin/database/page.tsx` | 10 | `console.error('Failed to fetch users:', error)` etc. |
| `app/admin/influencers/page.tsx` | 3 | `console.error('Failed to fetch/update influencers')` etc. |
| `app/admin/brands/page.tsx` | 1 | `console.error('Failed to fetch brands:', error)` |
| `app/admin/campaigns/page.tsx` | 1 | `console.error('Failed to fetch campaigns:', error)` |
| `app/admin/page.tsx` | 1 | `console.error('Failed to fetch admin data:', error)` |
| `app/admin/settings/page.tsx` | 1 | `console.error('Failed to fetch settings:', error)` |
| `app/dashboard/brand/components/create-campaign-tab.tsx` | 1 | `console.error('Failed to create campaign')` |
| `app/dashboard/brand/components/brand-nav.tsx` | 2 | `console.error('Failed to fetch/deposit')` |
| `app/onboarding/brand/step-6/page.tsx` | 1 | `console.error('Brand onboarding error:', err)` |
| `app/onboarding/influencer/step-5/page.tsx` | 1 | `console.error('Influencer onboarding error:', err)` |

### Server-side console statements (acceptable for logging, but should use structured logger): 58

All API routes use `console.error()` for error logging. These are functional but should be replaced with a proper logging library (e.g., pino, winston) for production to enable log levels, structured output, and log aggregation.

---

## God Files (>500 lines)

These files exceed recommended size limits and should be split:

| File | Lines | Severity |
|------|-------|----------|
| `app/dashboard/influencer/page.tsx` | **2,590** | CRITICAL |
| `app/dashboard/brand/components/campaigns-tab.tsx` | **2,094** | CRITICAL |
| `app/influencers/page.tsx` | **1,132** | HIGH |
| `app/brands/page.tsx` | **1,088** | HIGH |
| `app/admin/database/page.tsx` | **1,041** | HIGH |
| `app/dashboard/brand/components/create-campaign-tab.tsx` | **921** | HIGH |
| `app/page.tsx` | **894** | HIGH |
| `app/dashboard/brand/page.tsx` | **868** | HIGH |
| `app/pricing/page.tsx` | **865** | HIGH |
| `app/dashboard/brand/components/brand-nav.tsx` | **730** | MEDIUM |
| `app/admin/influencers/page.tsx` | **706** | MEDIUM |
| `app/dashboard/brand/components/discover-tab.tsx` | **541** | MEDIUM |

The influencer dashboard at 2,590 lines is a single monolithic component handling discover, my-campaigns, profile, settings, modals, wallet, and withdrawal -- all in one file.

---

## Action Items by Priority

### CRITICAL (must fix before production)
1. **STUB-001/002:** Implement "Send Invitation" and "Send Counter Offer" -- these are core brand workflows that currently do nothing
2. **STUB-004:** Wire up influencer settings "Update Account" form to `/api/auth/password` PATCH endpoint
3. **VAL-001/002:** Add client-side password validation matching server rules (uppercase + digit required)

### HIGH (should fix)
4. **AUTH-001:** Use the `redirect` query param from middleware after login
5. **VAL-003:** Fetch withdrawal fee from API instead of hardcoding 3%
6. Split `app/dashboard/influencer/page.tsx` (2,590 lines) into sub-components

### MEDIUM (recommended)
7. **ERR-001:** Add try/catch to logout buttons
8. **STUB-003/005:** Implement or clearly label campaign edit/pause/delete and payment methods as "Coming Soon"
9. Replace `console.error` in client code with a toast/UI feedback mechanism
10. Replace `console.error` in API routes with a structured logging library

### LOW (nice to have)
11. Update `https://linkedin.com` to actual company LinkedIn page
12. Remove stub notification checkboxes or wire them up
13. Wire up the "Save" heart button on campaign cards
