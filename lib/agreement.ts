import { jsPDF } from 'jspdf'

interface AgreementData {
  collaborationId: string
  createdDate: string
  agreedDate: string

  // Brand
  brandCompanyName: string
  brandContactName: string | null
  brandContactEmail: string | null

  // Influencer
  influencerHandle: string
  influencerEmail: string

  // Campaign
  campaignTitle: string
  campaignDescription: string | null

  // Deliverables
  deliverables: string[]

  // Pricing
  agreedPrice: number // in cents
  pricingBasis: string

  // Fees
  depositFeePercent: number
  withdrawalFeePercent: number

  // Payment amounts
  advanceAmount: number // in cents
  finalAmount: number // in cents
}

export function generateAgreementPDF(data: AgreementData): Buffer {
  const doc = new jsPDF()
  const margin = 20
  const pageWidth = doc.internal.pageSize.getWidth()
  const contentWidth = pageWidth - margin * 2
  let y = margin

  const formatUSD = (cents: number) => `$${(cents / 100).toFixed(2)}`

  const addLine = () => {
    doc.setDrawColor(200)
    doc.line(margin, y, pageWidth - margin, y)
    y += 5
  }

  const addText = (text: string, size: number = 10, style: string = 'normal') => {
    doc.setFontSize(size)
    doc.setFont('helvetica', style)
    const lines = doc.splitTextToSize(text, contentWidth)
    // Check if we need a new page
    if (y + lines.length * (size * 0.5) > doc.internal.pageSize.getHeight() - margin) {
      doc.addPage()
      y = margin
    }
    doc.text(lines, margin, y)
    y += lines.length * (size * 0.5) + 2
  }

  const addHeading = (text: string) => {
    y += 3
    addText(text, 12, 'bold')
    y += 1
  }

  const addSubtext = (text: string) => {
    addText(text, 9, 'normal')
  }

  // Title
  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  doc.text('COLLABORATION AGREEMENT', pageWidth / 2, y, { align: 'center' })
  y += 10

  // Meta
  addSubtext(`Agreement #: ${data.collaborationId}`)
  addSubtext(`Date: ${data.createdDate}`)
  addSubtext(`Platform: Influx (aiinflux.io)`)
  y += 3
  addLine()

  // 1. Parties
  addHeading('1. PARTIES')
  addText('Project (Client):', 10, 'bold')
  addSubtext(`Company: ${data.brandCompanyName}`)
  if (data.brandContactName) addSubtext(`Contact: ${data.brandContactName}`)
  if (data.brandContactEmail) addSubtext(`Email: ${data.brandContactEmail}`)
  y += 3
  addText('Creator:', 10, 'bold')
  addSubtext(`Handle: ${data.influencerHandle}`)
  addSubtext(`Email: ${data.influencerEmail}`)
  y += 2
  addLine()

  // 2. Campaign
  addHeading('2. CAMPAIGN')
  addSubtext(`Campaign: ${data.campaignTitle}`)
  if (data.campaignDescription) {
    addSubtext(`Description: ${data.campaignDescription}`)
  }
  y += 2
  addLine()

  // 3. Deliverables
  addHeading('3. DELIVERABLES')
  if (data.deliverables.length > 0) {
    data.deliverables.forEach(d => addSubtext(`- ${d}`))
  } else {
    addSubtext('To be defined by the parties during the collaboration.')
  }
  y += 2
  addLine()

  // 4. Pricing
  addHeading('4. PRICING')
  addText(`Agreed Price: ${formatUSD(data.agreedPrice)}`, 11, 'bold')
  addSubtext(`Pricing basis: ${data.pricingBasis}`)
  y += 1
  addSubtext('This is the individually negotiated price for this specific collaboration, agreed upon by both parties.')
  y += 2
  addLine()

  // 5. Payment Terms
  addHeading('5. PAYMENT TERMS')
  addSubtext(`Currency: Stablecoins (USDC/USDT)`)
  addSubtext(`Total: ${formatUSD(data.agreedPrice)}`)
  y += 2
  addText(`50% Advance: ${formatUSD(data.advanceAmount)}`, 10, 'bold')
  addSubtext('Released to Creator when the Project starts the campaign.')
  y += 2
  addText(`50% Final Payment: ${formatUSD(data.finalAmount)}`, 10, 'bold')
  addSubtext('Released to Creator after:')
  addSubtext('1. Creator submits content draft for review')
  addSubtext('2. Project approves content (up to 3 revision rounds)')
  addSubtext('3. Creator publishes content and submits live link')
  addSubtext('4. Project approves published content')
  y += 2
  addSubtext(
    'Auto-release: if the Project does not respond within 7 days after content is delivered, ' +
    'the final 50% is automatically released to the Creator.'
  )
  y += 2
  addSubtext(
    `Platform fees: Project pays ${data.depositFeePercent}% deposit fee; ` +
    `Creator pays ${data.withdrawalFeePercent}% withdrawal fee.`
  )
  y += 2
  addLine()

  // 6. Content Review Process
  addHeading('6. CONTENT REVIEW PROCESS')
  addSubtext('1. Creator submits content draft for Project review')
  addSubtext('2. Project reviews and either approves or requests revisions')
  addSubtext('3. Maximum 3 revision rounds -- after 3 rounds, Project must approve or raise a dispute')
  addSubtext('4. Once approved, Creator publishes content on agreed platform(s)')
  addSubtext('5. Creator submits the live post link')
  addSubtext('6. Project verifies and approves final delivery')
  y += 2
  addLine()

  // 7. Cancellation Policy
  addHeading('7. CANCELLATION POLICY')
  addText('Before work starts (Agreed status):', 10, 'bold')
  addSubtext('Either party may cancel; full refund to Project.')
  y += 2
  addText('After work starts (In Progress):', 10, 'bold')
  addSubtext('- Creator cancels: advance returned to Project (if balance allows)')
  addSubtext('- Project cancels: advance stays with Creator as compensation for work performed')
  y += 2
  addText('After content delivered:', 10, 'bold')
  addSubtext('Cancellation not available; only approval or dispute.')
  y += 2
  addLine()

  // 8. Dispute Resolution
  addHeading('8. DISPUTE RESOLUTION')
  addSubtext(
    'Either party may raise a dispute after content is delivered. ' +
    'Disputed funds are held by the platform until resolution.'
  )
  y += 1
  addSubtext('The Influx platform team reviews the dispute and decides:')
  addSubtext('- Full payment to Creator')
  addSubtext('- Full refund to Project')
  addSubtext('- Partial split between both parties')
  y += 1
  addSubtext('If no resolution within 14 days, funds are automatically released to the Creator.')
  y += 2
  addLine()

  // 9. General Terms
  addHeading('9. GENERAL TERMS')
  addSubtext('- Both parties agree to act in good faith')
  addSubtext('- Creator retains rights to their content unless otherwise agreed')
  addSubtext('- Project receives a license to use the content for marketing purposes')
  addSubtext('- This agreement is governed by the Influx platform Terms of Service')
  addSubtext('- All amounts are denominated in US dollars, settled in stablecoins')
  y += 5
  addLine()

  // Footer
  y += 3
  addText(`Both parties confirmed these terms on ${data.agreedDate}`, 10, 'italic')
  y += 5
  addSubtext('Generated by Influx platform -- aiinflux.io')

  return Buffer.from(doc.output('arraybuffer'))
}
