import { jsPDF } from 'jspdf'

interface AgreementData {
  collaborationId: string
  createdDate: string
  agreedDate: string
  brandCompanyName: string
  brandContactName: string | null
  brandContactEmail: string | null
  influencerHandle: string
  influencerEmail: string
  campaignTitle: string
  campaignDescription: string | null
  deliverables: string[]
  platforms: string[]
  contentFormats: string[]
  brandTerms: string | null
  influencerTerms: string | null
  endDate: string | null
  agreedPrice: number
  pricingBasis: string
  depositFeePercent: number
  withdrawalFeePercent: number
  advanceAmount: number
  finalAmount: number
}

export function generateAgreementPDF(data: AgreementData): Buffer {
  const doc = new jsPDF()
  const margin = 25
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const contentWidth = pageWidth - margin * 2
  let y = margin

  const formatUSD = (cents: number) => `$${(cents / 100).toFixed(2)}`

  // Colors
  const primary = [59, 91, 219] as const // brand blue
  const dark = [30, 30, 40] as const
  const muted = [120, 120, 140] as const
  const light = [240, 242, 248] as const

  const checkPage = (needed: number) => {
    if (y + needed > pageHeight - 30) {
      addFooter()
      doc.addPage()
      y = margin
    }
  }

  const addFooter = () => {
    doc.setFontSize(7)
    doc.setTextColor(...muted)
    doc.setFont('helvetica', 'normal')
    doc.text('INFLUX connect  |  aiinflux.io', pageWidth / 2, pageHeight - 12, { align: 'center' })
    doc.text(`Agreement #${data.collaborationId.slice(0, 8)}`, pageWidth / 2, pageHeight - 8, { align: 'center' })
    doc.setTextColor(...dark)
  }

  const addSection = (num: string, title: string) => {
    checkPage(20)
    y += 4
    // Section number + title
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...primary)
    doc.text(`${num}.`, margin, y)
    doc.text(title.toUpperCase(), margin + 8, y)
    doc.setTextColor(...dark)
    y += 3
    // Underline
    doc.setDrawColor(...primary)
    doc.setLineWidth(0.5)
    doc.line(margin, y, pageWidth - margin, y)
    doc.setDrawColor(200, 200, 210)
    doc.setLineWidth(0.2)
    y += 6
  }

  const addLabel = (text: string) => {
    checkPage(8)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...dark)
    doc.text(text, margin, y)
    y += 5
  }

  const addBody = (text: string) => {
    checkPage(8)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...dark)
    const lines = doc.splitTextToSize(text, contentWidth)
    doc.text(lines, margin, y)
    y += lines.length * 4.2 + 1
  }

  const addMuted = (text: string) => {
    checkPage(8)
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...muted)
    const lines = doc.splitTextToSize(text, contentWidth)
    doc.text(lines, margin, y)
    y += lines.length * 3.8 + 1
    doc.setTextColor(...dark)
  }

  const addBullet = (text: string) => {
    checkPage(8)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...dark)
    const lines = doc.splitTextToSize(text, contentWidth - 8)
    doc.text('-', margin + 2, y)
    doc.text(lines, margin + 8, y)
    y += lines.length * 4.2 + 1
  }

  const addNumberedItem = (num: number, text: string) => {
    checkPage(8)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...muted)
    doc.text(`${num}.`, margin + 2, y)
    doc.setTextColor(...dark)
    const lines = doc.splitTextToSize(text, contentWidth - 12)
    doc.text(lines, margin + 10, y)
    y += lines.length * 4.2 + 1
  }

  // ============= HEADER =============
  // Top accent bar
  doc.setFillColor(...primary)
  doc.rect(0, 0, pageWidth, 4, 'F')

  y = 20

  // Logo text
  doc.setFontSize(22)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...primary)
  doc.text('INFLUX', margin, y)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...muted)
  doc.text('connect', margin + 38, y)

  // Title right-aligned
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...muted)
  doc.text('COLLABORATION AGREEMENT', pageWidth - margin, y - 4, { align: 'right' })
  doc.setFontSize(8)
  doc.text(`#${data.collaborationId.slice(0, 8)}`, pageWidth - margin, y + 1, { align: 'right' })

  y += 10

  // Thin line under header
  doc.setDrawColor(200, 200, 210)
  doc.setLineWidth(0.3)
  doc.line(margin, y, pageWidth - margin, y)
  y += 8

  // Meta info row
  doc.setFontSize(8)
  doc.setTextColor(...muted)
  doc.text(`Date: ${data.createdDate}`, margin, y)
  doc.text('Platform: aiinflux.io', pageWidth / 2, y, { align: 'center' })
  doc.text(`Status: Agreed`, pageWidth - margin, y, { align: 'right' })
  y += 10
  doc.setTextColor(...dark)

  // ============= 1. PARTIES =============
  addSection('1', 'Parties')

  // Two-column parties box
  const boxY = y
  doc.setFillColor(...light)
  doc.roundedRect(margin, boxY, contentWidth / 2 - 3, 32, 2, 2, 'F')
  doc.roundedRect(margin + contentWidth / 2 + 3, boxY, contentWidth / 2 - 3, 32, 2, 2, 'F')

  // Left: Project
  doc.setFontSize(7)
  doc.setTextColor(...muted)
  doc.text('PROJECT (CLIENT)', margin + 5, boxY + 6)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...dark)
  doc.text(data.brandCompanyName, margin + 5, boxY + 13)
  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...muted)
  if (data.brandContactEmail) doc.text(data.brandContactEmail, margin + 5, boxY + 19)
  if (data.brandContactName) doc.text(data.brandContactName, margin + 5, boxY + 25)

  // Right: Creator
  const rightX = margin + contentWidth / 2 + 8
  doc.setFontSize(7)
  doc.setTextColor(...muted)
  doc.text('CREATOR', rightX, boxY + 6)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...dark)
  doc.text(`@${data.influencerHandle}`, rightX, boxY + 13)
  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...muted)
  doc.text(data.influencerEmail, rightX, boxY + 19)

  doc.setTextColor(...dark)
  y = boxY + 38

  // ============= 2. CAMPAIGN =============
  addSection('2', 'Campaign')
  addLabel(data.campaignTitle)
  if (data.campaignDescription) addBody(data.campaignDescription)
  if (data.platforms.length > 0) {
    addBody(`Platforms: ${data.platforms.join(', ')}`)
  }
  if (data.contentFormats.length > 0) {
    addBody(`Content formats: ${data.contentFormats.map(f => f.replace(/-/g, ' ')).join(', ')}`)
  }
  if (data.endDate) {
    addBody(`Campaign deadline: ${data.endDate}`)
  }
  y += 2

  // ============= 3. DELIVERABLES =============
  addSection('3', 'Deliverables')
  if (data.deliverables.length > 0) {
    data.deliverables.forEach(d => addBullet(d))
  } else {
    addMuted('To be defined by the parties during the collaboration.')
  }
  y += 2

  // ============= 4. PRICING =============
  addSection('4', 'Pricing')

  // Price highlight box
  checkPage(20)
  const priceBoxY = y
  doc.setFillColor(...light)
  doc.roundedRect(margin, priceBoxY, contentWidth, 16, 2, 2, 'F')
  doc.setFontSize(8)
  doc.setTextColor(...muted)
  doc.text('AGREED PRICE', margin + 5, priceBoxY + 6)
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...primary)
  doc.text(formatUSD(data.agreedPrice), margin + 5, priceBoxY + 13)
  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...muted)
  doc.text(data.pricingBasis, margin + 55, priceBoxY + 13)
  doc.setTextColor(...dark)
  y = priceBoxY + 22

  addMuted('This is the individually negotiated price for this specific collaboration, agreed upon by both parties.')
  y += 2

  // ============= 5. PAYMENT TERMS =============
  addSection('5', 'Payment Terms')
  addBody('Currency: Stablecoins (USDC/USDT)')
  y += 2

  // Two payment boxes
  checkPage(25)
  const payBoxY = y
  const halfW = contentWidth / 2 - 3

  doc.setFillColor(236, 253, 243) // green tint
  doc.roundedRect(margin, payBoxY, halfW, 22, 2, 2, 'F')
  doc.setFontSize(7)
  doc.setTextColor(...muted)
  doc.text('50% ADVANCE', margin + 5, payBoxY + 6)
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(22, 163, 74) // green
  doc.text(formatUSD(data.advanceAmount), margin + 5, payBoxY + 13)
  doc.setFontSize(7)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...muted)
  doc.text('Released when campaign starts', margin + 5, payBoxY + 19)

  doc.setFillColor(236, 253, 243)
  doc.roundedRect(margin + halfW + 6, payBoxY, halfW, 22, 2, 2, 'F')
  doc.setFontSize(7)
  doc.setTextColor(...muted)
  doc.text('50% FINAL PAYMENT', margin + halfW + 11, payBoxY + 6)
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(22, 163, 74)
  doc.text(formatUSD(data.finalAmount), margin + halfW + 11, payBoxY + 13)
  doc.setFontSize(7)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...muted)
  doc.text('Released after delivery approval', margin + halfW + 11, payBoxY + 19)

  doc.setTextColor(...dark)
  y = payBoxY + 28

  addMuted('Auto-release: if the Project does not respond within 7 days after content is delivered, the final 50% is automatically released to the Creator.')
  y += 1
  addMuted(`Platform fees: Project pays ${data.depositFeePercent}% deposit fee; Creator pays ${data.withdrawalFeePercent}% withdrawal fee.`)
  y += 2

  // ============= 6. CONTENT REVIEW =============
  addSection('6', 'Content Review Process')
  addNumberedItem(1, 'Creator submits content draft for Project review')
  addNumberedItem(2, 'Project reviews and either approves or requests revisions')
  addNumberedItem(3, 'Maximum 3 revision rounds; after 3 rounds, Project must approve or raise a dispute')
  addNumberedItem(4, 'Once approved, Creator publishes content on agreed platform(s)')
  addNumberedItem(5, 'Creator submits the live post link')
  addNumberedItem(6, 'Project verifies and approves final delivery')
  y += 2

  // ============= 7. CANCELLATION =============
  addSection('7', 'Cancellation Policy')
  addLabel('Before work starts (Agreed status):')
  addBody('Either party may cancel; full refund to Project.')
  y += 1
  addLabel('After work starts (In Progress):')
  addBullet('Creator cancels: advance returned to Project (if balance allows)')
  addBullet('Project cancels: advance stays with Creator as compensation for work performed')
  y += 1
  addLabel('After content delivered:')
  addBody('Cancellation not available; only approval or dispute.')
  y += 2

  // ============= 8. DISPUTE RESOLUTION =============
  addSection('8', 'Dispute Resolution')
  addBody('Either party may raise a dispute after content is delivered. Disputed funds are held by the platform until resolution.')
  y += 1
  addBody('The Influx platform team reviews the dispute and decides:')
  addBullet('Full payment to Creator')
  addBullet('Full refund to Project')
  addBullet('Partial split between both parties')
  y += 1
  addMuted('If no resolution within 14 days, funds are automatically released to the Creator.')
  y += 2

  // ============= 9. ADDITIONAL TERMS =============
  if (data.brandTerms || data.influencerTerms) {
    addSection('9', 'Additional Terms')
    if (data.brandTerms) {
      addLabel('Project Terms:')
      addBody(data.brandTerms)
      y += 1
    }
    if (data.influencerTerms) {
      addLabel('Creator Terms:')
      addBody(data.influencerTerms)
      y += 1
    }
    y += 2
  }

  // ============= 10. GENERAL TERMS =============
  const generalNum = (data.brandTerms || data.influencerTerms) ? '10' : '9'
  addSection(generalNum, 'General Terms')
  addBullet('Both parties agree to act in good faith')
  addBullet('Creator retains rights to their content unless otherwise agreed')
  addBullet('Project receives a license to use the content for marketing purposes')
  addBullet('This agreement is governed by the Influx platform Terms of Service')
  addBullet('All amounts are denominated in US dollars, settled in stablecoins')
  y += 5

  // ============= SIGNATURE BLOCK =============
  checkPage(30)
  doc.setDrawColor(200, 200, 210)
  doc.setLineWidth(0.3)
  doc.line(margin, y, pageWidth - margin, y)
  y += 8

  doc.setFontSize(9)
  doc.setFont('helvetica', 'italic')
  doc.setTextColor(...dark)
  doc.text(`Both parties confirmed these terms on ${data.agreedDate}`, margin, y)
  y += 6
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(...muted)
  doc.text('This agreement was generated and accepted digitally on the Influx platform (aiinflux.io).', margin, y)
  y += 4
  doc.text('No physical signatures are required.', margin, y)

  // Add footer to all pages
  const totalPages = doc.getNumberOfPages()
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i)
    addFooter()
    // Page number
    doc.setFontSize(7)
    doc.setTextColor(...muted)
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin, pageHeight - 8, { align: 'right' })
  }

  return Buffer.from(doc.output('arraybuffer'))
}
