/** Cookie name for OAuth CSRF nonce */
export const OAUTH_NONCE_COOKIE = 'oauth-nonce'

/**
 * Build the Google OAuth state parameter with CSRF nonce.
 * Returns { state, nonce } so the caller can store the nonce in a cookie.
 */
export function buildOAuthState(userType?: string): { state: string; nonce: string } {
  const nonce = crypto.randomUUID()
  const role = userType === 'brand' ? 'brand' : 'creator'
  const state = JSON.stringify({ role, nonce })
  return { state, nonce }
}

export function getGoogleOAuthUrl(userType?: string): string {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
  if (!clientId) return '#'

  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google`
  const scope = 'openid email profile'
  const { state } = buildOAuthState(userType)

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope,
    state,
    access_type: 'offline',
    prompt: 'consent',
  })

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
}
