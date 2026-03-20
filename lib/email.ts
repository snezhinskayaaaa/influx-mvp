import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@influx.ai'
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

export async function sendVerificationEmail(email: string, token: string) {
  const verifyUrl = `${APP_URL}/verify-email?token=${token}`

  await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: 'Verify your Influx account',
    html: `
      <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <h1 style="font-size: 24px; font-weight: bold; margin-bottom: 16px;">Welcome to Influx!</h1>
        <p style="color: #666; font-size: 16px; margin-bottom: 24px;">
          Please verify your email address to get started.
        </p>
        <a href="${verifyUrl}"
           style="display: inline-block; background: linear-gradient(to right, #4F46E5, #7C3AED); color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 600;">
          Verify Email
        </a>
        <p style="color: #999; font-size: 14px; margin-top: 24px;">
          If you didn't create an account, you can safely ignore this email.
        </p>
        <p style="color: #999; font-size: 12px; margin-top: 32px;">
          Or copy this link: ${verifyUrl}
        </p>
      </div>
    `,
  })
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${APP_URL}/reset-password?token=${token}`

  await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: 'Reset your Influx password',
    html: `
      <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <h1 style="font-size: 24px; font-weight: bold; margin-bottom: 16px;">Reset your password</h1>
        <p style="color: #666; font-size: 16px; margin-bottom: 24px;">
          We received a request to reset your password. Click the button below to choose a new one.
        </p>
        <a href="${resetUrl}"
           style="display: inline-block; background: linear-gradient(to right, #4F46E5, #7C3AED); color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 600;">
          Reset Password
        </a>
        <p style="color: #999; font-size: 14px; margin-top: 24px;">
          This link expires in 1 hour. If you didn't request this, you can safely ignore this email.
        </p>
        <p style="color: #999; font-size: 12px; margin-top: 32px;">
          Or copy this link: ${resetUrl}
        </p>
      </div>
    `,
  })
}
