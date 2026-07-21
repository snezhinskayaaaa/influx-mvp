"use client";

import Link from "next/link";
import { Navigation } from "@/components/navigation";
import { NetworkLogo } from "@/components/logo";
import { motion } from "framer-motion";
import {
  Instagram,
  Send,
  Twitter,
  Linkedin,
  Mail,
} from "lucide-react";

const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.4, 0.25, 1] as [number, number, number, number],
    },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />

      {/* Hero Section */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="pt-28 pb-12 sm:pt-40 sm:pb-20 bg-gradient-to-b from-background to-muted/30"
      >
        <div className="container px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center">
            <div className="max-w-2xl mx-auto">
              <h1 className="text-3xl font-bold tracking-tight sm:text-5xl lg:text-6xl mb-4 sm:mb-6">
                Terms of Service
              </h1>
              <p className="text-base text-muted-foreground sm:text-xl">
                Last updated: July 2026
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Content */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
        className="py-12 sm:py-20 bg-background"
      >
        <div className="container px-6 lg:px-8 max-w-4xl mx-auto">
          <div className="space-y-12">
            {/* 1. Acceptance of Terms */}
            <motion.div variants={fadeInUp}>
              <h2 className="text-2xl font-bold mb-4 text-foreground">1. Acceptance of Terms</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  By accessing or using the INFLUXconnect platform (&quot;Platform&quot;), you agree to be bound by these Terms of Service (&quot;Terms&quot;). If you do not agree to these Terms, you may not access or use the Platform.
                </p>
                <p>
                  These Terms constitute a legally binding agreement between you and INFLUXconnect (&quot;Company,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;). By creating an account, you represent that you are at least 18 years of age and have the legal capacity to enter into this agreement.
                </p>
                <p>
                  We reserve the right to modify these Terms at any time. Material changes will be communicated via email or an in-platform notification at least 30 days before taking effect. Your continued use of the Platform after such changes constitutes acceptance of the updated Terms.
                </p>
              </div>
            </motion.div>

            {/* 2. Description of Service */}
            <motion.div variants={fadeInUp}>
              <h2 className="text-2xl font-bold mb-4 text-foreground">2. Description of Service</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  INFLUXconnect is a crypto-native influencer marketing platform that connects Web3 projects with crypto-native creators for marketing campaigns. The Platform provides tools for campaign creation, creator discovery, collaboration management, stablecoin payment processing, and performance analytics.
                </p>
                <p>
                  Our services include, but are not limited to:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>A marketplace for Web3 projects to discover and engage AI influencers, crypto KOLs, Web3 video creators, and anon accounts</li>
                  <li>Campaign management tools for creating, tracking, and optimizing marketing campaigns</li>
                  <li>A secure wallet system for depositing stablecoins, processing campaign payments, and withdrawing earnings</li>
                  <li>Analytics dashboards for monitoring campaign performance and ROI</li>
                  <li>Communication tools to facilitate collaboration between projects and creators</li>
                </ul>
                <p>
                  We reserve the right to modify, suspend, or discontinue any aspect of the Platform at any time, with reasonable notice where practicable.
                </p>
              </div>
            </motion.div>

            {/* 3. User Accounts */}
            <motion.div variants={fadeInUp}>
              <h2 className="text-2xl font-bold mb-4 text-foreground">3. User Accounts</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <h3 className="text-lg font-semibold text-foreground">3.1 Account Types</h3>
                <p>
                  The Platform supports two primary account types:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong className="text-foreground">Project Accounts:</strong> For Web3 projects, DeFi protocols, DAOs, NFT collections, exchanges, and blockchain companies seeking to launch influencer marketing campaigns.</li>
                  <li><strong className="text-foreground">Creator Accounts:</strong> For AI influencers, crypto KOLs, Web3 video creators, and anon accounts who wish to monetize their content through project collaborations.</li>
                </ul>

                <h3 className="text-lg font-semibold text-foreground mt-6">3.2 Account Responsibilities</h3>
                <p>
                  You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to immediately notify us of any unauthorized use of your account or any other security breach.
                </p>
                <p>
                  You must provide accurate, current, and complete information during registration and keep your account information up to date. We reserve the right to suspend or terminate accounts that contain false or misleading information.
                </p>
              </div>
            </motion.div>

            {/* 4. Platform Rules and Prohibited Conduct */}
            <motion.div variants={fadeInUp}>
              <h2 className="text-2xl font-bold mb-4 text-foreground">4. Platform Rules and Prohibited Conduct</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  You agree not to engage in any of the following prohibited activities:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Creating fake engagement metrics, inflating follower counts, or misrepresenting campaign performance</li>
                  <li>Circumventing the Platform&apos;s payment system by arranging off-platform transactions for services discovered through INFLUXconnect</li>
                  <li>Uploading, distributing, or promoting content that is illegal, defamatory, harassing, or infringes on the intellectual property rights of others</li>
                  <li>Using the Platform to distribute spam, malware, or any other harmful content</li>
                  <li>Impersonating another person, entity, or project without authorization</li>
                  <li>Attempting to access, tamper with, or use non-public areas of the Platform, its systems, or its technical delivery mechanisms</li>
                  <li>Using automated means (bots, scrapers, crawlers) to access or collect data from the Platform without prior written consent</li>
                  <li>Engaging in any activity that disrupts, damages, or interferes with the Platform&apos;s operation</li>
                  <li>Engaging in market manipulation, pump and dump schemes, or promoting misleading financial advice through the Platform</li>
                  <li>Using the Platform for money laundering, terrorist financing, or any activity that violates applicable sanctions or anti-money laundering laws</li>
                </ul>
                <p>
                  Violation of these rules may result in immediate account suspension or termination, forfeiture of pending earnings, and potential legal action.
                </p>
              </div>
            </motion.div>

            {/* 5. Campaign Agreements */}
            <motion.div variants={fadeInUp}>
              <h2 className="text-2xl font-bold mb-4 text-foreground">5. Campaign Agreements</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  When a project initiates a campaign and a creator accepts, a binding campaign agreement is formed between both parties, facilitated by the Platform. All campaigns operate under a 50/50 split payment structure as follows:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong className="text-foreground">Campaign Budget:</strong> The project deposits the agreed campaign budget into their Platform wallet. Funds are allocated to the campaign and held securely by the Platform.</li>
                  <li><strong className="text-foreground">Advance Payment (50%):</strong> When the project starts the campaign, 50% of the agreed campaign budget is immediately released to the creator as an advance payment.</li>
                  <li><strong className="text-foreground">Final Payment (50%):</strong> The remaining 50% is released to the creator after content is delivered and approved by the project.</li>
                  <li><strong className="text-foreground">Content Review:</strong> The project may request up to 3 rounds of revisions on delivered content. The creator agrees to address reasonable revision requests within the scope of the original campaign brief.</li>
                  <li><strong className="text-foreground">Auto-Release:</strong> If the project does not respond within 7 days after the creator delivers the content, the final 50% payment is automatically released to the creator.</li>
                  <li><strong className="text-foreground">Platform Commission:</strong> INFLUXconnect collects a commission on transactions as outlined in Section 6.</li>
                </ul>

                <h3 className="text-lg font-semibold text-foreground mt-6">5.1 Cancellation Rules</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong className="text-foreground">Before Work Starts:</strong> If the campaign is cancelled before the creator begins work, the project receives a full refund of the deposited campaign budget.</li>
                  <li><strong className="text-foreground">Project Cancels After Work Starts:</strong> If the project cancels the campaign after the creator has begun work, the 50% advance payment stays with the creator as compensation for work performed.</li>
                  <li><strong className="text-foreground">Creator Cancels After Work Starts:</strong> If the creator cancels the campaign after work has begun, the 50% advance payment is returned to the project.</li>
                </ul>

                <h3 className="text-lg font-semibold text-foreground mt-6">5.2 Dispute Resolution</h3>
                <p>
                  Either party may raise a dispute after content delivery. INFLUXconnect&apos;s dispute resolution team will review submitted evidence and work to resolve the dispute within 14 business days. If the dispute remains unresolved after 14 business days, the final 50% payment is automatically released to the creator.
                </p>
              </div>
            </motion.div>

            {/* 6. Commission Structure */}
            <motion.div variants={fadeInUp}>
              <h2 className="text-2xl font-bold mb-4 text-foreground">6. Commission Structure</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  INFLUXconnect charges the following fees for facilitating transactions on the Platform:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong className="text-foreground">Project Deposit Fee:</strong> A 2% fee is applied when projects deposit funds into their Platform wallet (Founding Member rate). The standard rate is 4%.</li>
                  <li><strong className="text-foreground">Creator Withdrawal Fee:</strong> A 3% fee is applied when creators withdraw earnings from their Platform wallet (Founding Member rate). The standard rate is 6%. This fee includes applicable network and processing costs.</li>
                </ul>
                <p>
                  Founding Members who join during the launch month, complete their first transaction, and provide feedback will have the reduced rates (2% / 3%) locked permanently. All other users will be subject to standard rates, which may be adjusted with 30 days&apos; prior notice.
                </p>
                <p>
                  Subscription plans (Creator Pro, Project Pro) are billed separately and do not affect transaction-based commission fees.
                </p>
              </div>
            </motion.div>

            {/* 7. Intellectual Property */}
            <motion.div variants={fadeInUp}>
              <h2 className="text-2xl font-bold mb-4 text-foreground">7. Intellectual Property</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <h3 className="text-lg font-semibold text-foreground">7.1 Platform IP</h3>
                <p>
                  The Platform, including its design, features, code, branding, and documentation, is the exclusive property of INFLUXconnect and is protected by copyright, trademark, and other intellectual property laws. You may not copy, modify, distribute, or create derivative works of any Platform content without our prior written consent.
                </p>

                <h3 className="text-lg font-semibold text-foreground mt-6">7.2 User Content</h3>
                <p>
                  You retain ownership of the content you create and upload to the Platform. By posting content, you grant INFLUXconnect a non-exclusive, worldwide, royalty-free license to use, display, and distribute your content solely for the purposes of operating and promoting the Platform.
                </p>

                <h3 className="text-lg font-semibold text-foreground mt-6">7.3 Campaign Content</h3>
                <p>
                  Unless otherwise specified in the campaign agreement, content produced for a campaign is licensed to the project for the duration and scope outlined in the campaign brief. Creators retain the underlying intellectual property rights to their personas, AI-generated assets, and creative works.
                </p>
              </div>
            </motion.div>

            {/* 8. Payment Terms */}
            <motion.div variants={fadeInUp}>
              <h2 className="text-2xl font-bold mb-4 text-foreground">8. Payment Terms</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  INFLUXconnect exclusively processes payments in stablecoins (USDC, USDT) on supported blockchain networks. No fiat payment methods are available. All campaign budgets are denominated in USD and settled in USDC or USDT.
                </p>

                <h3 className="text-lg font-semibold text-foreground mt-6">8.1 Stablecoin Payments</h3>
                <p>
                  Projects must deposit sufficient stablecoins into their Platform wallet before launching a campaign. Payments are held securely and released to creators according to the 50/50 payment structure outlined in Section 5.
                </p>

                <h3 className="text-lg font-semibold text-foreground mt-6">8.2 Wallet Responsibility</h3>
                <p>
                  Users are solely responsible for providing correct wallet addresses for deposits and withdrawals. Transactions on the blockchain are irreversible. INFLUXconnect cannot recover funds sent to an incorrect wallet address.
                </p>

                <h3 className="text-lg font-semibold text-foreground mt-6">8.3 Network Fees</h3>
                <p>
                  The Platform covers standard network fees for transactions processed through the Platform. During periods of excessive blockchain network congestion, transactions may experience delays. INFLUXconnect is not responsible for delays caused by network conditions beyond our control.
                </p>

                <h3 className="text-lg font-semibold text-foreground mt-6">8.4 Withdrawals</h3>
                <p>
                  Withdrawals are processed within 3-5 business days, subject to identity verification and compliance checks. Minimum withdrawal amounts and any applicable limits are displayed within your account dashboard.
                </p>
                <p>
                  INFLUXconnect is not responsible for delays caused by third-party payment processors, blockchain network congestion, or compliance-related holds. In the event of a dispute, funds may be held in escrow pending resolution. No refunds will be issued for funds sent to incorrect wallet addresses.
                </p>
              </div>
            </motion.div>

            {/* 9. Content Guidelines */}
            <motion.div variants={fadeInUp}>
              <h2 className="text-2xl font-bold mb-4 text-foreground">9. Content Guidelines</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  All creator profiles on INFLUXconnect must adhere to the following content guidelines:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong className="text-foreground">AI Transparency:</strong> AI influencers must be clearly identified as virtual or AI-generated personas. Deceptive practices intended to mislead audiences into believing an AI influencer is a real person are strictly prohibited.</li>
                  <li><strong className="text-foreground">Paid Partnership Disclosure:</strong> All creators, including crypto KOLs and Web3 video creators, must disclose paid partnerships per FTC guidelines and applicable platform-specific rules. Sponsored content must be clearly labeled as such.</li>
                  <li><strong className="text-foreground">Platform-Specific Disclosure Rules:</strong> Content must comply with AI and crypto disclosure rules specific to each distribution platform, including but not limited to TikTok, Instagram, and X (formerly Twitter).</li>
                  <li><strong className="text-foreground">No Market Manipulation:</strong> Content that constitutes market manipulation, pump and dump schemes, or misleading financial advice is strictly prohibited. Creators must not make guarantees about token prices, investment returns, or financial outcomes.</li>
                  <li><strong className="text-foreground">Authenticity:</strong> Content must be original or properly licensed. Using another creator&apos;s likeness, style, or content without permission is prohibited.</li>
                  <li><strong className="text-foreground">Compliance:</strong> All content must comply with applicable advertising regulations, including FTC guidelines for sponsored content and endorsement disclosures.</li>
                  <li><strong className="text-foreground">Quality Standards:</strong> Content delivered for campaigns must meet the specifications outlined in the campaign brief and maintain professional quality standards.</li>
                  <li><strong className="text-foreground">Prohibited Content:</strong> Content that is explicit, violent, discriminatory, promotes illegal activities, or targets vulnerable populations is strictly prohibited.</li>
                </ul>
                <p>
                  INFLUXconnect reserves the right to remove content and suspend accounts that violate these guidelines without prior notice.
                </p>
              </div>
            </motion.div>

            {/* 10. Stablecoin & Blockchain Risk Disclosure */}
            <motion.div variants={fadeInUp}>
              <h2 className="text-2xl font-bold mb-4 text-foreground">10. Stablecoin & Blockchain Risk Disclosure</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  By using the Platform, you acknowledge and accept the following risks associated with stablecoin payments and blockchain technology:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong className="text-foreground">Not Bank Deposits:</strong> USDC and USDT are stablecoins issued by third parties. They are not bank deposits and are not insured by the Federal Deposit Insurance Corporation (FDIC) or any other governmental agency.</li>
                  <li><strong className="text-foreground">Depeg Risk:</strong> Stablecoins may lose their peg to the US Dollar due to market conditions, issuer insolvency, regulatory action, or other factors. INFLUXconnect is not responsible for losses resulting from stablecoin depeg events.</li>
                  <li><strong className="text-foreground">Irreversible Transactions:</strong> All blockchain transactions are final and irreversible once confirmed on the network. INFLUXconnect cannot reverse, cancel, or modify any on-chain transaction after it has been broadcast.</li>
                  <li><strong className="text-foreground">No Liability for Losses:</strong> The Platform is not responsible for losses arising from incorrect wallet addresses, blockchain network failures, smart contract bugs, or any other technical issues related to blockchain infrastructure.</li>
                  <li><strong className="text-foreground">Regulatory Uncertainty:</strong> Users acknowledge that cryptocurrency regulations are evolving and vary by jurisdiction. Changes in regulatory frameworks may affect the availability, functionality, or legality of certain Platform features in your jurisdiction.</li>
                </ul>
              </div>
            </motion.div>

            {/* 11. KYC/AML Compliance */}
            <motion.div variants={fadeInUp}>
              <h2 className="text-2xl font-bold mb-4 text-foreground">11. KYC/AML Compliance</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  INFLUXconnect is committed to preventing the use of the Platform for money laundering, terrorist financing, or other illicit activities. By using the Platform, you agree to the following:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong className="text-foreground">Identity Verification:</strong> The Platform may require identity verification (Know Your Customer, or KYC) for large transactions, high-volume accounts, or when required by applicable law. You agree to provide accurate identification documents upon request.</li>
                  <li><strong className="text-foreground">Sanctioned Jurisdictions:</strong> The Platform is not available to users located in, or citizens of, jurisdictions subject to comprehensive sanctions by the U.S. Office of Foreign Assets Control (OFAC), including but not limited to those on the OFAC Specially Designated Nationals list.</li>
                  <li><strong className="text-foreground">Account Freezes:</strong> INFLUXconnect reserves the right to freeze accounts, withhold funds, and suspend services pending compliance review if suspicious activity is detected or if required by law enforcement or regulatory authorities.</li>
                  <li><strong className="text-foreground">Prohibited Use:</strong> Users must not use the Platform for money laundering, terrorist financing, sanctions evasion, or any other activity that violates applicable anti-money laundering (AML) or counter-terrorism financing (CTF) laws.</li>
                </ul>
              </div>
            </motion.div>

            {/* 12. Limitation of Liability */}
            <motion.div variants={fadeInUp}>
              <h2 className="text-2xl font-bold mb-4 text-foreground">12. Limitation of Liability</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  To the maximum extent permitted by applicable law, INFLUXconnect and its officers, directors, employees, and agents shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, goodwill, or other intangible losses, arising from:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Your use of or inability to use the Platform</li>
                  <li>Any unauthorized access to or alteration of your data or transmissions</li>
                  <li>The conduct or content of any third party on the Platform</li>
                  <li>Any content obtained from the Platform</li>
                  <li>Campaign outcomes, including performance metrics and ROI</li>
                  <li>Losses arising from stablecoin depeg events, blockchain network failures, or smart contract vulnerabilities</li>
                  <li>Funds sent to incorrect wallet addresses</li>
                </ul>
                <p>
                  Our total aggregate liability for any claims arising from or related to these Terms or your use of the Platform shall not exceed the total fees paid by you to INFLUXconnect in the 12 months preceding the claim.
                </p>
              </div>
            </motion.div>

            {/* 13. Termination */}
            <motion.div variants={fadeInUp}>
              <h2 className="text-2xl font-bold mb-4 text-foreground">13. Termination</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  You may terminate your account at any time by contacting our support team or through your account settings. Upon termination, any pending campaign obligations must be fulfilled or mutually cancelled, and remaining wallet balances will be returned subject to applicable withdrawal fees and processing times.
                </p>
                <p>
                  We may suspend or terminate your account immediately, without prior notice, if we determine that you have violated these Terms, engaged in fraudulent activity, or pose a risk to the Platform or its users. In such cases, we reserve the right to withhold pending earnings pending investigation.
                </p>
                <p>
                  Sections relating to Intellectual Property, Limitation of Liability, Stablecoin & Blockchain Risk Disclosure, KYC/AML Compliance, and Governing Law shall survive termination of these Terms.
                </p>
              </div>
            </motion.div>

            {/* 14. Governing Law */}
            <motion.div variants={fadeInUp}>
              <h2 className="text-2xl font-bold mb-4 text-foreground">14. Governing Law</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  These Terms shall be governed by and construed in accordance with the laws of the State of Delaware, United States, without regard to its conflict of law provisions. Any disputes arising from these Terms or your use of the Platform shall be resolved exclusively in the state or federal courts located in Delaware.
                </p>
                <p>
                  Users acknowledge that cryptocurrency regulations vary by jurisdiction and are subject to change. Users are solely responsible for compliance with all applicable laws, regulations, and tax obligations in their respective jurisdictions, including but not limited to those related to cryptocurrency, digital assets, and financial services.
                </p>
                <p>
                  For users located in the European Union, nothing in these Terms affects your rights under mandatory consumer protection laws of your country of residence.
                </p>
              </div>
            </motion.div>

            {/* 15. Contact Information */}
            <motion.div variants={fadeInUp}>
              <h2 className="text-2xl font-bold mb-4 text-foreground">15. Contact Information</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  If you have any questions, concerns, or requests regarding these Terms of Service, please contact us at:
                </p>
                <p>
                  <strong className="text-foreground">Email:</strong>{" "}
                  <Link href="mailto:support@aiinflux.io" className="text-primary hover:underline">
                    support@aiinflux.io
                  </Link>
                </p>
                <p>
                  We aim to respond to all inquiries within 2 business days.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="border-t bg-muted/50">
        <div className="container px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Logo & Slogan */}
            <div className="flex flex-col items-center md:items-start">
              <Link href="/" className="flex items-center gap-3 group mb-2">
                <NetworkLogo className="w-8 h-8 transition-transform group-hover:scale-110" />
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-bold text-primary">INFLUX</span>
                  <span className="text-xs font-medium text-foreground/60">connect</span>
                </div>
              </Link>
              <p className="text-sm text-muted-foreground">Where influence flows</p>
            </div>


            {/* Legal */}
            <div className="flex flex-col items-center gap-2">
              <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link>
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link>
            </div>
            {/* Social Media & Contact */}
            <div className="flex flex-col items-center md:items-end gap-3">
              <div className="flex items-center gap-3">
                <Link href="https://www.instagram.com/influx.connect/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-2xl border-2 border-muted-foreground/30 flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-all">
                  <Instagram className="h-5 w-5" />
                </Link>
                <Link href="https://www.tiktok.com/@aiinflux" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-2xl border-2 border-muted-foreground/30 flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-all">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                  </svg>
                </Link>
                <Link href="https://t.me/aiinflux" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-2xl border-2 border-muted-foreground/30 flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-all">
                  <Send className="h-5 w-5" />
                </Link>
                <Link href="https://x.com/aiinflux" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-2xl border-2 border-muted-foreground/30 flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-all">
                  <Twitter className="h-5 w-5" />
                </Link>
                <Link href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-2xl border-2 border-muted-foreground/30 flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-all">
                  <Linkedin className="h-5 w-5" />
                </Link>
              </div>
              <Link href="mailto:support@aiinflux.io" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <Mail className="h-4 w-4" />
                support@aiinflux.io
              </Link>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-center pt-6 mt-6 border-t">
            <p className="text-sm text-muted-foreground">&copy; 2026 INFLUXconnect. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
