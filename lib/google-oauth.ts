export function getGoogleOAuthUrl(userType?: string): string {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
  if (!clientId) return '#'

  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google`
  const scope = 'openid email profile'
  const state = userType || 'creator'

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
