# Security Audit -- IDOR (Insecure Direct Object Reference)

---
agent: security-auditor
status: COMPLETE
timestamp: 2026-07-28T12:00:00Z
duration: 120 seconds
findings: 2
critical_count: 0
high_count: 1
medium_count: 1
errors: []
skipped_checks: []
---

## Methodology

Every API route under `app/api/` that accepts an ID parameter (URL param or body param) was read in full. For each route handler (GET, POST, PATCH, DELETE), the authorization logic was traced to determine whether the authenticated user is verified as the owner of, or a participant in, the resource before any read or write operation occurs.

---

## Route-by-Route IDOR Audit Results

### 1. `app/api/campaigns/[id]/route.ts`

**GET** -- SAFE
- Fetches campaign, then checks `campaign.brand.userId === user.userId` (brand owner), `campaign.collaborations.some(c => c.influencer.userId === user.userId)` (collaborator), or `user.role === 'ADMIN'`.
- Returns 403 if none match.

**PATCH** -- SAFE
- Fetches campaign, then checks `campaign.brand.userId !== user.userId && user.role !== 'ADMIN'`.
- Only the brand owner or admin can update. Returns 403 otherwise.

**DELETE** -- SAFE
- Same ownership check as PATCH: `campaign.brand.userId !== user.userId && user.role !== 'ADMIN'`.
- Additionally blocks deletion if active collaborations exist.

---

### 2. `app/api/collaborations/[id]/route.ts`

**GET** -- SAFE
- Checks `isBrandOwner || isInfluencer || isAdmin`. Both parties to the collaboration and admins can view.

**PATCH** -- SAFE (with one note)
- Checks `isBrandOwner || isInfluencer || isAdmin` before allowing any updates.
- Role-specific field gating: only brand can set `agreedPrice`/`brandAgreed`; only influencer can set `influencerAgreed`.
- Cancellation is allowed by either party (correct business logic).
- The `IN_PROGRESS` transition (advance payment) is gated to `isBrandOwner || isAdmin`.

---

### 3. `app/api/collaborations/[id]/agree/route.ts`

**POST** -- SAFE
- Checks `collaboration.campaign.brand.userId !== user.userId && user.role !== 'ADMIN'`.
- Only the brand owner (or admin) can trigger the freeze. Requires email verification.
- Validates both `brandAgreed` and `influencerAgreed` flags before proceeding.

---

### 4. `app/api/collaborations/[id]/agreement/route.ts`

**GET** -- SAFE
- Checks `isBrand || isInfluencer || isAdmin` before generating the PDF.
- Both parties and admins can download their agreement. No IDOR possible.

---

### 5. `app/api/collaborations/[id]/complete/route.ts`

**POST** -- SAFE
- Checks `collaboration.campaign.brand.userId !== user.userId && user.role !== 'ADMIN'`.
- Only brand owner or admin can mark complete. Atomic transaction protects funds.

---

### 6. `app/api/collaborations/[id]/submit/route.ts`

**POST** -- SAFE
- Checks `collaboration.influencer.userId !== user.userId`.
- Only the influencer assigned to the collaboration can submit content. No admin bypass (which is correct -- only the actual influencer should submit their own content).

---

### 7. `app/api/collaborations/[id]/review/route.ts`

**POST** -- SAFE
- Checks `collaboration.campaign.brand.userId !== user.userId`.
- Only the brand owner can review. No admin bypass for review (correct -- admins resolve disputes via the `/resolve` endpoint instead).

---

### 8. `app/api/collaborations/[id]/resolve/route.ts`

**POST** -- SAFE
- Checks `user.role !== 'ADMIN'` at line 16. Only admins can resolve disputes.
- No IDOR risk since this is an admin-only endpoint by design.

---

### 9. `app/api/wallet/deposit/route.ts`

**POST** -- SAFE
- Checks `user.role !== 'BRAND'`.
- Looks up brand via `userId: user.userId` (session-derived, not user-supplied).
- No external ID parameter accepted for the brand -- uses the authenticated user's own brand record.

---

### 10. `app/api/wallet/withdraw/route.ts`

**POST** -- SAFE
- Checks `user.role !== 'INFLUENCER'`.
- Looks up influencer via `userId: user.userId` (session-derived).
- Balance deduction uses atomic `updateMany` with balance check. No IDOR vector.

---

### 11. `app/api/wallet/route.ts`

**GET** -- SAFE
- Queries transactions via `userId: user.userId` (session-derived).
- Queries brand/influencer balance via `userId: user.userId`. No user-supplied ID.

---

### 12. `app/api/auth/delete-account/route.ts`

**POST** -- SAFE
- Deletes `user.userId` from session. Requires `confirmation === 'DELETE'`.
- No external ID parameter -- always operates on the authenticated user.

---

### 13. `app/api/profiles/me/route.ts`

**GET** -- SAFE
- Queries `where: { id: user.userId }`. Session-derived, no external input.

**PATCH** -- SAFE
- Updates `where: { id: user.userId }`. Session-derived, no external input.

---

### 14. `app/api/profiles/me/notifications/route.ts`

**PATCH** -- SAFE
- Updates `where: { id: user.userId }`. Session-derived.

---

### 15. `app/api/influencers/me/route.ts`

**GET** -- SAFE
- Checks `user.role !== 'INFLUENCER'`, then queries `where: { userId: user.userId }`.

**PATCH** -- SAFE
- Same role + session-derived ownership check. Handle uniqueness also verified.

---

### 16. `app/api/brands/me/route.ts`

**GET** -- SAFE
- Checks `user.role !== 'BRAND'`, then queries `where: { userId: user.userId }`.

**PATCH** -- SAFE
- Same pattern. Session-derived ownership.

---

### 17. `app/api/notifications/route.ts`

**GET** -- SAFE
- Queries `where: { userId: user.userId }`. Session-derived.

**PATCH** -- SAFE
- For `markAllRead`: updates `where: { userId: user.userId, isRead: false }`. Scoped to own notifications.
- For single notification: uses `findFirst({ where: { id: body.id, userId: user.userId } })` -- verifies ownership before update.

---

### 18. `app/api/profiles/avatar/route.ts`

**POST** -- SAFE
- Updates `where: { id: user.userId }`. Session-derived.

---

### 19. `app/api/influencers/route.ts`

**GET** -- SAFE (public endpoint)
- Lists approved influencers. No authentication required. This is a catalog/discovery endpoint.
- Does not expose sensitive data (no balance, no userId, no email).

---

### 20. `app/api/campaigns/route.ts`

**GET** -- SAFE
- Brand: scoped to `brandId: brand.id` (derived from `user.userId`).
- Influencer: only sees ACTIVE campaigns (public discovery).
- Admin: sees all (correct).

**POST** -- SAFE
- Checks `user.role !== 'BRAND'`. Creates campaign under the authenticated brand. No external brand ID accepted.

---

### 21. `app/api/collaborations/route.ts`

**GET** -- SAFE
- Influencer: scoped to own `influencerId`.
- Brand: scoped to own `brand.id`.
- Admin: sees all.

**POST** -- SAFE
- Influencer applying: uses `userId: user.userId` to find influencer. Campaign ownership is verified for brand invitations (`campaign.brand.userId !== user.userId`).

---

### 22. `app/api/cron/auto-release/route.ts`

**POST** -- SAFE
- Protected by `CRON_SECRET` bearer token, not user session.
- No user-supplied IDs. Processes stale collaborations by status + date.

---

## Admin Routes

### 23. `app/api/admin/brands/route.ts` -- GET -- SAFE
- Checks `user.role !== 'ADMIN'` at line 11.

### 24. `app/api/admin/campaigns/route.ts` -- GET -- SAFE
- Checks `user.role !== 'ADMIN'` at line 11.

### 25. `app/api/admin/campaigns/[id]/route.ts` -- DELETE -- SAFE
- Checks `user.role !== 'ADMIN'` at line 14.

### 26. `app/api/admin/collaborations/route.ts` -- GET -- SAFE
- Checks `user.role !== 'ADMIN'` at line 11.

### 27. `app/api/admin/influencers/route.ts` -- GET -- SAFE
- Checks `user.role !== 'ADMIN'` at line 11.

### 28. `app/api/admin/influencers/[id]/route.ts` -- PATCH -- SAFE
- Checks `user.role !== 'ADMIN'` at line 14.

### 29. `app/api/admin/users/route.ts` -- GET -- SAFE
- Checks `user.role !== 'ADMIN'` at line 11.

### 30. `app/api/admin/users/[id]/route.ts` -- PATCH, DELETE -- SAFE
- Both handlers check `user.role !== 'ADMIN'` at lines 14/53.
- DELETE prevents removing the last admin.

### 31. `app/api/admin/settings/route.ts` -- GET, PATCH -- SAFE
- Both check `user.role !== 'ADMIN'`.
- PATCH additionally requires a verified email code (JWT-based 2FA).

### 32. `app/api/admin/settings/send-code/route.ts` -- POST -- SAFE
- Checks `user.role !== 'ADMIN'` (combined check at line 10).

### 33. `app/api/admin/transactions/route.ts` -- GET -- SAFE
- Checks `user.role !== 'ADMIN'` at line 11.

---

## Findings

### SEC-001: Admin Role Escalation Risk via JWT Role Claim (MEDIUM)

**Location:** `/Users/snezhinskayaaaa/influx-mvp/lib/auth.ts` (lines 12-15, 18-24)

**Issue:** The `role` field is baked into the JWT at login time and never re-validated against the database. If an admin demotes a user (or a user's role changes), the old JWT remains valid for up to 7 days with the stale role.

**Impact:** A demoted admin continues to have full admin access until their JWT expires. A user whose role was changed continues operating under the old role.

**Attack scenario:**
1. Admin account is compromised.
2. Another admin removes the compromised account or changes its role.
3. The attacker's JWT still contains `role: 'ADMIN'` and remains valid for up to 7 days.

**Severity:** Medium -- requires a prior compromise or role change event.

**Remediation:** On every request, `getCurrentUser()` should verify the user still exists in the database and that their current role matches. This can be done with a lightweight DB query or a server-side session store:

```typescript
export async function getCurrentUser(): Promise<TokenPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return null
  const payload = await verifyToken(token)
  if (!payload) return null

  // Verify user still exists and role is current
  const profile = await prisma.profile.findUnique({
    where: { id: payload.userId },
    select: { role: true },
  })
  if (!profile || profile.role !== payload.role) return null

  return { ...payload, role: profile.role as TokenPayload['role'] }
}
```

---

### SEC-002: Admin Campaign Delete Has No Active Collaboration Guard (HIGH)

**Location:** `/Users/snezhinskayaaaa/influx-mvp/app/api/admin/campaigns/[id]/route.ts` (lines 20-25)

**Issue:** The admin DELETE endpoint for campaigns does not check whether the campaign has active collaborations with frozen funds before deleting. Compare with the regular `campaigns/[id]/route.ts` DELETE (line 190) which explicitly blocks deletion when active collaborations exist.

**Attack scenario:**
1. Admin deletes a campaign that has AGREED or IN_PROGRESS collaborations.
2. The associated collaborations reference a deleted campaign.
3. Frozen funds may become orphaned -- the brand's `frozenBalance` is never decremented, and the money is effectively stuck.
4. If Prisma cascades the delete to collaborations, the influencer loses their in-progress work and pending payments with no record.

**Severity:** High -- can cause financial loss (orphaned frozen funds or destroyed collaboration records with pending payments).

**Remediation:** Add the same guard used in the non-admin route:

```typescript
export async function DELETE(request, { params }) {
  // ... existing auth checks ...

  const campaign = await prisma.campaign.findUnique({
    where: { id },
    include: {
      collaborations: {
        where: {
          status: {
            in: ['AGREED', 'IN_PROGRESS', 'CONTENT_REVIEW', 'REVISION', 'PUBLISHING', 'DELIVERED'],
          },
        },
      },
    },
  })

  if (!campaign) {
    return NextResponse.json({ error: 'Campaign not found' }, { status: 404 })
  }

  if (campaign.collaborations.length > 0) {
    return NextResponse.json(
      { error: 'Cannot delete campaign with active collaborations. Cancel or complete them first.' },
      { status: 400 }
    )
  }

  await prisma.campaign.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
```

---

## Risk Summary

| Category | Critical | High | Medium | Low |
|----------|----------|------|--------|-----|
| IDOR (user-to-user) | 0 | 0 | 0 | 0 |
| IDOR (role escalation) | 0 | 0 | 1 | 0 |
| Missing business guard (admin) | 0 | 1 | 0 | 0 |

**Total: 0 Critical, 1 High, 1 Medium, 0 Low**

---

## IDOR Verdict by Question

### 1. Does every route check that the authenticated user OWNS or has ACCESS to the resource?
**YES.** Every route that accepts an `[id]` parameter fetches the resource first, then verifies ownership or participation before proceeding.

### 2. Can a brand access/modify another brand's campaigns?
**NO.** All campaign mutation routes (PATCH, DELETE) check `campaign.brand.userId === user.userId`. GET on `campaigns/[id]` additionally allows collaborators and admins but not unrelated brands.

### 3. Can an influencer access/modify another influencer's data?
**NO.** All "me" endpoints (`/influencers/me`, `/profiles/me`, `/brands/me`) use the session-derived `user.userId`. Collaboration submit is gated to `collaboration.influencer.userId === user.userId`.

### 4. Can a regular user access admin endpoints?
**NO.** Every admin route checks `user.role !== 'ADMIN'` at the top of the handler. However, SEC-001 notes that role is cached in the JWT and not re-validated per request.

### 5. Can someone modify a collaboration they're not part of?
**NO.** All collaboration endpoints (GET, PATCH, agree, complete, submit, review) verify the user is either the brand owner of the campaign, the assigned influencer, or an admin.

---

## Checklist

### Must Fix (Before Deploy)
- [ ] SEC-002: Add active collaboration guard to admin campaign DELETE

### Should Fix (High Priority)
- [ ] SEC-001: Re-validate user role from DB on each request (or use shorter JWT expiry + refresh tokens)

### No Issues Found
- [x] All user-facing IDOR vectors are properly guarded
- [x] All admin endpoints check ADMIN role
- [x] Financial operations use atomic transactions
- [x] Notification ownership is verified before updates
- [x] Wallet endpoints use session-derived identity only
