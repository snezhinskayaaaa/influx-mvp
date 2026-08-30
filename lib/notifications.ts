import prisma from '@/lib/prisma'
import { sendCollaborationEmail } from '@/lib/email'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://aiinflux.io'

async function createInAppNotification(userId: string, title: string, body: string, link?: string) {
  try {
    await prisma.notification.create({
      data: { userId, title, body, link },
    })
  } catch (err) {
    console.error('Failed to create in-app notification:', err)
  }
}

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
  await createInAppNotification(brandUserId, 'New Application', `${influencerName} applied to "${campaignTitle}"`, '/dashboard/project')
  const { email, notify } = await shouldNotify(brandUserId)
  if (!notify) return
  await sendCollaborationEmail(
    email,
    `New application on "${campaignTitle}"`,
    'New Creator Application',
    `${influencerName} has applied to your campaign "${campaignTitle}". Review their profile and respond.`,
    'View Application',
    `${APP_URL}/dashboard/project`,
  ).catch(err => console.error('Notification email failed:', err))
}

export async function notifyBrandContentSubmitted(brandUserId: string, influencerName: string, campaignTitle: string) {
  await createInAppNotification(brandUserId, 'Content Submitted', `${influencerName} submitted content for "${campaignTitle}"`, '/dashboard/project')
  const { email, notify } = await shouldNotify(brandUserId)
  if (!notify) return
  await sendCollaborationEmail(
    email,
    `Content ready for review — "${campaignTitle}"`,
    'Content Submitted for Review',
    `${influencerName} has submitted content for "${campaignTitle}". Please review and approve, request revisions, or dispute.`,
    'Review Content',
    `${APP_URL}/dashboard/project`,
  ).catch(err => console.error('Notification email failed:', err))
}

export async function notifyBrandContentDelivered(brandUserId: string, influencerName: string, campaignTitle: string) {
  await createInAppNotification(brandUserId, 'Content Published', `${influencerName} published content for "${campaignTitle}"`, '/dashboard/project')
  const { email, notify } = await shouldNotify(brandUserId)
  if (!notify) return
  await sendCollaborationEmail(
    email,
    `Content published — "${campaignTitle}"`,
    'Content Published',
    `${influencerName} has published the content for "${campaignTitle}". Approve to release the remaining 50% payment. Auto-release in 7 days if no action.`,
    'Review & Approve',
    `${APP_URL}/dashboard/project`,
  ).catch(err => console.error('Notification email failed:', err))
}

export async function notifyBrandAutoRelease(brandUserId: string, campaignTitle: string, amount: number) {
  await createInAppNotification(brandUserId, 'Payment Auto-Released', `$${(amount / 100).toFixed(2)} released for "${campaignTitle}"`, '/dashboard/project')
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

export async function notifyInfluencerInvited(influencerUserId: string, campaignTitle: string) {
  await createInAppNotification(influencerUserId, 'Campaign Invitation', `You've been invited to collaborate on "${campaignTitle}"`, '/dashboard/influencer')
  const { email, notify } = await shouldNotify(influencerUserId)
  if (!notify) return
  await sendCollaborationEmail(
    email,
    `You've been invited — "${campaignTitle}"`,
    'Campaign Invitation',
    `A Web3 project has invited you to collaborate on "${campaignTitle}". Review the details and apply with your rate.`,
    'View Invitation',
    `${APP_URL}/dashboard/influencer`,
  ).catch(err => console.error('Notification email failed:', err))
}

export async function notifyInfluencerApplicationAccepted(influencerUserId: string, campaignTitle: string) {
  await createInAppNotification(influencerUserId, 'Application Accepted', `Your application for "${campaignTitle}" was accepted`, '/dashboard/influencer')
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
  await createInAppNotification(influencerUserId, 'Campaign Started', `$${(advanceAmount / 100).toFixed(2)} advance received for "${campaignTitle}"`, '/dashboard/influencer')
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
  await createInAppNotification(influencerUserId, 'Content Approved', `Your content for "${campaignTitle}" was approved — publish it!`, '/dashboard/influencer')
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
  await createInAppNotification(influencerUserId, 'Revision Requested', `Changes requested for "${campaignTitle}"`, '/dashboard/influencer')
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
  await createInAppNotification(influencerUserId, 'Payment Received', `$${(amount / 100).toFixed(2)} received for "${campaignTitle}"`, '/dashboard/influencer')
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

export async function notifyBrandPriceAccepted(brandUserId: string, influencerName: string, campaignTitle: string, price: number) {
  await createInAppNotification(brandUserId, 'Price Accepted', `${influencerName} accepted your offer of $${price} for "${campaignTitle}"`, '/dashboard/project')
  const { email, notify } = await shouldNotify(brandUserId)
  if (!notify) return
  await sendCollaborationEmail(
    email,
    `Price accepted — "${campaignTitle}"`,
    'Price Accepted',
    `${influencerName} has accepted your price offer of $${price} for "${campaignTitle}". You can now start the campaign and freeze funds.`,
  ).catch(err => console.error('Notification email failed:', err))
}

export async function notifyBrandPriceDeclined(brandUserId: string, influencerName: string, campaignTitle: string, price: number) {
  await createInAppNotification(brandUserId, 'Price Declined', `${influencerName} declined your offer of $${price} for "${campaignTitle}"`, '/dashboard/project')
  const { email, notify } = await shouldNotify(brandUserId)
  if (!notify) return
  await sendCollaborationEmail(
    email,
    `Price declined — "${campaignTitle}"`,
    'Price Declined',
    `${influencerName} has declined your price offer of $${price} for "${campaignTitle}". You can propose a new price or cancel the collaboration.`,
  ).catch(err => console.error('Notification email failed:', err))
}

export async function notifyInfluencerDisputeCreated(influencerUserId: string, campaignTitle: string, reason: string) {
  await createInAppNotification(influencerUserId, 'Dispute Raised', `A dispute was raised for "${campaignTitle}"`, '/dashboard/influencer')
  const { email, notify } = await shouldNotify(influencerUserId)
  if (!notify) return
  await sendCollaborationEmail(
    email,
    `Dispute raised — "${campaignTitle}"`,
    'Dispute Created',
    `The project has raised a dispute for "${campaignTitle}". Reason: "${reason}". Our team will review and resolve this. Your remaining payment is held until resolution.`,
  ).catch(err => console.error('Notification email failed:', err))
}

export async function notifyDisputeResolved(influencerUserId: string, brandUserId: string, campaignTitle: string, result: string) {
  await createInAppNotification(influencerUserId, 'Dispute Resolved', `Dispute for "${campaignTitle}" resolved: ${result}`, '/dashboard/influencer')
  const infNotify = await shouldNotify(influencerUserId)
  if (infNotify.notify) {
    sendCollaborationEmail(infNotify.email, `Dispute resolved — "${campaignTitle}"`, 'Dispute Resolved',
      `The dispute for "${campaignTitle}" has been resolved.\n\nDecision: ${result}\n\nContact support@aiinflux.io with questions.`
    ).catch(err => console.error('Notification email failed:', err))
  }

  await createInAppNotification(brandUserId, 'Dispute Resolved', `Dispute for "${campaignTitle}" resolved: ${result}`, '/dashboard/project')
  const brandNotify = await shouldNotify(brandUserId)
  if (brandNotify.notify) {
    sendCollaborationEmail(brandNotify.email, `Dispute resolved — "${campaignTitle}"`, 'Dispute Resolved',
      `The dispute for "${campaignTitle}" has been resolved.\n\nDecision: ${result}\n\nContact support@aiinflux.io with questions.`
    ).catch(err => console.error('Notification email failed:', err))
  }
}
