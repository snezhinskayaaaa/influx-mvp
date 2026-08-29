import { Resend } from 'resend'

let _resend: Resend | null = null

function getResend(): Resend {
  if (!_resend) {
    if (!process.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY is not configured')
    }
    _resend = new Resend(process.env.RESEND_API_KEY)
  }
  return _resend
}

const FROM_EMAIL = process.env.FROM_EMAIL || 'Influx <noreply@aiinflux.io>'
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
const LOGO_URL = `${APP_URL}/logo-email.png`

const emailHeader = `
  <div style="text-align: left; margin-bottom: 32px; padding-bottom: 24px; border-bottom: 1px solid #E5E7EB;">
    <a href="${APP_URL}" style="text-decoration: none; display: inline-flex; align-items: center;">
      <img src="${LOGO_URL}" alt="Influx" width="36" height="36" style="display: block; float: left;" />
      <span style="font-size: 20px; font-weight: 700; color: #2563EB; line-height: 36px; margin-left: 10px; display: block; overflow: hidden;">INFLUX</span>
    </a>
  </div>
`

const emailFooter = `
  <div style="margin-top: 40px; padding-top: 24px; border-top: 1px solid #E5E7EB; text-align: center;">
    <p style="color: #9CA3AF; font-size: 12px; margin: 0;">
      &copy; 2026 Influx &middot; <a href="${APP_URL}" style="color: #9CA3AF; text-decoration: underline;">aiinflux.io</a>
    </p>
  </div>
`

/** Escape HTML special characters to prevent injection in email templates */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export async function sendVerificationEmail(email: string, token: string) {
  const verifyUrl = `${APP_URL}/verify-email?token=${token}`

  await getResend().emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: 'Verify your Influx account',
    html: `
      <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        ${emailHeader}
        <h1 style="font-size: 24px; font-weight: bold; margin-bottom: 16px;">Welcome to Influx!</h1>
        <p style="color: #666; font-size: 16px; margin-bottom: 24px;">
          Please verify your email address to get started.
        </p>
        <a href="${verifyUrl}"
           style="display: inline-block; background-color: #4F46E5; color: #ffffff; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 600;">
          Verify Email
        </a>
        <p style="color: #999; font-size: 14px; margin-top: 24px;">
          If you didn't create an account, you can safely ignore this email.
        </p>
        ${emailFooter}
      </div>
    `,
  })
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${APP_URL}/reset-password?token=${token}`

  await getResend().emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: 'Reset your Influx password',
    html: `
      <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        ${emailHeader}
        <h1 style="font-size: 24px; font-weight: bold; margin-bottom: 16px;">Reset your password</h1>
        <p style="color: #666; font-size: 16px; margin-bottom: 24px;">
          We received a request to reset your password. Click the button below to choose a new one.
        </p>
        <a href="${resetUrl}"
           style="display: inline-block; background-color: #4F46E5; color: #ffffff; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 600;">
          Reset Password
        </a>
        <p style="color: #999; font-size: 14px; margin-top: 24px;">
          This link expires in 1 hour. If you didn't request this, you can safely ignore this email.
        </p>
        ${emailFooter}
      </div>
    `,
  })
}

export async function sendCollaborationEmail(
  to: string,
  subject: string,
  heading: string,
  body: string,
  ctaText?: string,
  ctaUrl?: string,
) {
  await getResend().emails.send({
    from: FROM_EMAIL,
    to,
    subject: `Influx: ${subject}`,
    html: `
      <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        ${emailHeader}
        <h1 style="font-size: 24px; font-weight: bold; margin-bottom: 16px;">${escapeHtml(heading)}</h1>
        <p style="color: #666; font-size: 16px; margin-bottom: 24px;">${escapeHtml(body)}</p>
        ${ctaText && ctaUrl ? `
          <a href="${escapeHtml(ctaUrl)}" style="display: inline-block; background-color: #4F46E5; color: #ffffff; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 600;">
            ${escapeHtml(ctaText)}
          </a>
        ` : ''}
        <p style="color: #999; font-size: 12px; margin-top: 32px;">
          You can manage your notification preferences in your dashboard settings.
        </p>
        ${emailFooter}
      </div>
    `,
  })
}
