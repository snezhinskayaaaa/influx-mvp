import prisma from '@/lib/prisma'
import { sendCollaborationEmail } from '@/lib/email'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://aiinflux.io'

async function shouldNotify(userId: string): Promise<{ email: string; notify: boolean }> {
  const profile = await prisma.profile.findUnique({
    where: { id: userId },
    select: { email: true, emailNotifications: true, campaignUpdates: true },
  })
  if (!profile) return { email: '', notify: false }
  return { email: profile.email, notify: profile.emailNotifications && profile.campaignUpdates }
}

// --- Brand notifications ---

export async function notifyBrandNewApplication(brandUserId: string, influencerName: string, campaignTitle: string) {
  const { email, notify } = await shouldNotify(brandUserId)
  if (!notify) return
  await sendCollaborationEmail(
    email,
    `New application on "${campaignTitle}"`,
    'New Creator Application',
    `${influencerName} has applied to your campaign "${campaignTitle}". Review their profile and respond.`,
    'View Application',
    `${APP_URL}/dashboard/brand`,
  ).catch(err => console.error('Notification email failed:', err))
}

export async function notifyBrandContentSubmitted(brandUserId: string, influencerName: string, campaignTitle: string) {
  const { email, notify } = await shouldNotify(brandUserId)
  if (!notify) return
  await sendCollaborationEmail(
    email,
    `Content ready for review — "${campaignTitle}"`,
    'Content Submitted for Review',
    `${influencerName} has submitted content for "${campaignTitle}". Please review and approve, request revisions, or dispute.`,
    'Review Content',
    `${APP_URL}/dashboard/brand`,
  ).catch(err => console.error('Notification email failed:', err))
}

export async function notifyBrandContentDelivered(brandUserId: string, influencerName: string, campaignTitle: string) {
  const { email, notify } = await shouldNotify(brandUserId)
  if (!notify) return
  await sendCollaborationEmail(
    email,
    `Content published — "${campaignTitle}"`,
    'Content Published',
    `${influencerName} has published the content for "${campaignTitle}". Approve to release the remaining 50% payment. Auto-release in 7 days if no action.`,
    'Review & Approve',
    `${APP_URL}/dashboard/brand`,
  ).catch(err => console.error('Notification email failed:', err))
}

export async function notifyBrandAutoRelease(brandUserId: string, campaignTitle: string, amount: number) {
  const { email, notify } = await shouldNotify(brandUserId)
  if (!notify) return
  await sendCollaborationEmail(
    email,
    `Auto-release: $${(amount / 100).toFixed(2)} released`,
    'Payment Auto-Released',
    `The remaining payment of $${(amount / 100).toFixed(2)} for "${campaignTitle}" has been automatically released to the creator after 7 days without response.`,
  ).catch(err => console.error('Notification email failed:', err))
}

// --- Influencer notifications ---

export async function notifyInfluencerApplicationAccepted(influencerUserId: string, campaignTitle: string) {
  const { email, notify } = await shouldNotify(influencerUserId)
  if (!notify) return
  await sendCollaborationEmail(
    email,
    `Your application was accepted — "${campaignTitle}"`,
    'Application Accepted',
    `Great news! Your application for "${campaignTitle}" has been accepted. The project wants to negotiate terms with you.`,
    'View Details',
    `${APP_URL}/dashboard/influencer`,
  ).catch(err => console.error('Notification email failed:', err))
}

export async function notifyInfluencerAgreedAndAdvance(influencerUserId: string, campaignTitle: string, advanceAmount: number) {
  const { email, notify } = await shouldNotify(influencerUserId)
  if (!notify) return
  await sendCollaborationEmail(
    email,
    `Campaign started — $${(advanceAmount / 100).toFixed(2)} advance received`,
    'Campaign Started — Advance Received',
    `The campaign "${campaignTitle}" has started. A 50% advance of $${(advanceAmount / 100).toFixed(2)} has been added to your balance. Start working on the content!`,
    'Go to Dashboard',
    `${APP_URL}/dashboard/influencer`,
  ).catch(err => console.error('Notification email failed:', err))
}

export async function notifyInfluencerContentApproved(influencerUserId: string, campaignTitle: string) {
  const { email, notify } = await shouldNotify(influencerUserId)
  if (!notify) return
  await sendCollaborationEmail(
    email,
    `Content approved — "${campaignTitle}"`,
    'Content Approved — Ready to Publish',
    `Your content for "${campaignTitle}" has been approved! Publish it and submit the live link to receive the remaining 50% payment.`,
    'Submit Published Link',
    `${APP_URL}/dashboard/influencer`,
  ).catch(err => console.error('Notification email failed:', err))
}

export async function notifyInfluencerRevisionRequested(influencerUserId: string, campaignTitle: string, note: string) {
  const { email, notify } = await shouldNotify(influencerUserId)
  if (!notify) return
  await sendCollaborationEmail(
    email,
    `Revision requested — "${campaignTitle}"`,
    'Revision Requested',
    `The project has requested revisions for "${campaignTitle}". Feedback: "${note}". Please update your content and resubmit.`,
    'View Feedback',
    `${APP_URL}/dashboard/influencer`,
  ).catch(err => console.error('Notification email failed:', err))
}

export async function notifyInfluencerPaymentReceived(influencerUserId: string, campaignTitle: string, amount: number) {
  const { email, notify } = await shouldNotify(influencerUserId)
  if (!notify) return
  await sendCollaborationEmail(
    email,
    `Payment received — $${(amount / 100).toFixed(2)}`,
    'Payment Received',
    `You received $${(amount / 100).toFixed(2)} for "${campaignTitle}". The funds are now in your balance and ready to withdraw.`,
    'View Balance',
    `${APP_URL}/dashboard/influencer`,
  ).catch(err => console.error('Notification email failed:', err))
}

export async function notifyInfluencerDisputeCreated(influencerUserId: string, campaignTitle: string, reason: string) {
  const { email, notify } = await shouldNotify(influencerUserId)
  if (!notify) return
  await sendCollaborationEmail(
    email,
    `Dispute raised — "${campaignTitle}"`,
    'Dispute Created',
    `The project has raised a dispute for "${campaignTitle}". Reason: "${reason}". Our team will review and resolve this. Your remaining payment is held until resolution.`,
  ).catch(err => console.error('Notification email failed:', err))
}
