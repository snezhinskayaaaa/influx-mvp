import prisma from '@/lib/prisma'

/**
 * Check if all collaborations for a campaign are done (COMPLETED or RESOLVED).
 * If so, auto-complete the campaign by setting status to COMPLETED.
 */
export async function checkCampaignAutoComplete(campaignId: string) {
  try {
    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId },
      select: { id: true, status: true },
    })

    if (!campaign || campaign.status === 'COMPLETED') return

    const collabs = await prisma.collaboration.findMany({
      where: { campaignId },
      select: { status: true },
    })

    // No collabs = nothing to complete
    if (collabs.length === 0) return

    // Check if ALL approved collabs (not APPLIED) are done
    const activeCollabs = collabs.filter(c => c.status !== 'APPLIED')
    if (activeCollabs.length === 0) return

    const allDone = activeCollabs.every(c =>
      c.status === 'COMPLETED' || c.status === 'RESOLVED'
    )

    if (allDone) {
      await prisma.campaign.update({
        where: { id: campaignId },
        data: { status: 'COMPLETED' },
      })
    }
  } catch (error) {
    console.error('Campaign auto-complete check failed:', error)
  }
}

/**
 * Check ALL active campaigns and auto-complete any where all collabs are done.
 * Called from cron to catch campaigns that were missed.
 */
export async function checkAllCampaignsAutoComplete() {
  try {
    const activeCampaigns = await prisma.campaign.findMany({
      where: { status: 'ACTIVE' },
      select: { id: true },
    })

    for (const campaign of activeCampaigns) {
      await checkCampaignAutoComplete(campaign.id)
    }

    return activeCampaigns.length
  } catch (error) {
    console.error('Bulk campaign auto-complete check failed:', error)
    return 0
  }
}
