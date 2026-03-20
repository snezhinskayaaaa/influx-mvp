"use client";

import Link from "next/link";
import { Navigation } from "@/components/navigation";
import { NetworkLogo } from "@/components/logo";
import { motion } from "framer-motion";
import {
  Instagram,
  Facebook,
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
      ease: [0.25, 0.4, 0.25, 1] as any,
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
                Last updated: March 2026
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
                  By accessing or using the INFLUXconnect platform ("Platform"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, you may not access or use the Platform.
                </p>
                <p>
                  These Terms constitute a legally binding agreement between you and INFLUXconnect ("Company," "we," "us," or "our"). By creating an account, you represent that you are at least 18 years of age and have the legal capacity to enter into this agreement.
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
                  INFLUXconnect is an AI influencer marketplace that connects brands with virtual influencers for marketing campaigns. The Platform provides tools for campaign creation, influencer discovery, collaboration management, payment processing, and performance analytics.
                </p>
                <p>
                  Our services include, but are not limited to:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>A marketplace for brands to discover and engage AI-powered virtual influencers</li>
                  <li>Campaign management tools for creating, tracking, and optimizing marketing campaigns</li>
                  <li>A secure wallet system for depositing funds, processing campaign payments, and withdrawing earnings</li>
                  <li>Analytics dashboards for monitoring campaign performance and ROI</li>
                  <li>Communication tools to facilitate collaboration between brands and influencer operators</li>
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
                  <li><strong className="text-foreground">Brand Accounts:</strong> For businesses and organizations seeking to launch influencer marketing campaigns with AI virtual influencers.</li>
                  <li><strong className="text-foreground">Influencer Accounts:</strong> For creators and operators of AI-powered virtual influencer profiles who wish to monetize their content through brand collaborations.</li>
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
                  <li>Circumventing the Platform's payment system by arranging off-platform transactions for services discovered through INFLUXconnect</li>
                  <li>Uploading, distributing, or promoting content that is illegal, defamatory, harassing, or infringes on the intellectual property rights of others</li>
                  <li>Using the Platform to distribute spam, malware, or any other harmful content</li>
                  <li>Impersonating another person, entity, or brand without authorization</li>
                  <li>Attempting to access, tamper with, or use non-public areas of the Platform, its systems, or its technical delivery mechanisms</li>
                  <li>Using automated means (bots, scrapers, crawlers) to access or collect data from the Platform without prior written consent</li>
                  <li>Engaging in any activity that disrupts, damages, or interferes with the Platform's operation</li>
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
                  When a brand initiates a campaign and an influencer accepts, a binding campaign agreement is formed between both parties, facilitated by the Platform. The key terms of each campaign agreement include:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong className="text-foreground">Campaign Budget:</strong> The brand deposits the agreed campaign budget into their Platform wallet. Funds are allocated to the campaign and held securely until milestones are completed.</li>
                  <li><strong className="text-foreground">Deliverables:</strong> The influencer agrees to produce and deliver content as specified in the campaign brief, including format, timeline, and platform requirements.</li>
                  <li><strong className="text-foreground">Payment Release:</strong> Upon successful completion and approval of deliverables, the campaign payment is released to the influencer's Platform wallet.</li>
                  <li><strong className="text-foreground">Platform Commission:</strong> INFLUXconnect collects a commission on transactions as outlined in Section 6.</li>
                </ul>
                <p>
                  Disputes between brands and influencers will be mediated by INFLUXconnect. Our dispute resolution team will review submitted evidence and make a binding determination within 14 business days.
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
                  <li><strong className="text-foreground">Brand Deposit Fee:</strong> A 2% fee is applied when brands deposit funds into their Platform wallet (Founding Member rate). The standard rate is 4%.</li>
                  <li><strong className="text-foreground">Influencer Withdrawal Fee:</strong> A 3% fee is applied when influencers withdraw earnings from their Platform wallet (Founding Member rate). The standard rate is 6%. This fee includes applicable network and processing costs.</li>
                </ul>
                <p>
                  Founding Members who join during the launch month, complete their first transaction, and provide feedback will have the reduced rates (2% / 3%) locked permanently. All other users will be subject to standard rates, which may be adjusted with 30 days' prior notice.
                </p>
                <p>
                  Subscription plans (Creator Pro, Brand Pro) are billed separately and do not affect transaction-based commission fees.
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
                  Unless otherwise specified in the campaign agreement, content produced for a campaign is licensed to the brand for the duration and scope outlined in the campaign brief. Influencers retain the underlying intellectual property rights to their AI personas and creative assets.
                </p>
              </div>
            </motion.div>

            {/* 8. Payment Terms */}
            <motion.div variants={fadeInUp}>
              <h2 className="text-2xl font-bold mb-4 text-foreground">8. Payment Terms</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  All campaign payments are processed through the Platform's wallet system. Brands must deposit sufficient funds into their wallet before launching a campaign. Payments are held securely and released to influencers upon successful delivery and approval of campaign deliverables.
                </p>
                <p>
                  Withdrawals are processed within 3-5 business days, subject to identity verification and compliance checks. We accept cryptocurrency payments (USDC, USDT) via secure processing. Minimum withdrawal amounts and any applicable limits are displayed within your account dashboard.
                </p>
                <p>
                  INFLUXconnect is not responsible for delays caused by third-party payment processors, blockchain network congestion, or compliance-related holds. In the event of a dispute, funds may be held in escrow pending resolution.
                </p>
              </div>
            </motion.div>

            {/* 9. Content Guidelines for AI Influencers */}
            <motion.div variants={fadeInUp}>
              <h2 className="text-2xl font-bold mb-4 text-foreground">9. Content Guidelines for AI Influencers</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  AI influencer profiles on INFLUXconnect must adhere to the following content guidelines:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong className="text-foreground">Transparency:</strong> AI influencers must be clearly identified as virtual or AI-generated personas. Deceptive practices intended to mislead audiences into believing an AI influencer is a real person are strictly prohibited.</li>
                  <li><strong className="text-foreground">Authenticity:</strong> Content must be original or properly licensed. Using another creator's likeness, style, or content without permission is prohibited.</li>
                  <li><strong className="text-foreground">Compliance:</strong> All content must comply with applicable advertising regulations, including FTC guidelines for sponsored content and endorsement disclosures.</li>
                  <li><strong className="text-foreground">Quality Standards:</strong> Content delivered for campaigns must meet the specifications outlined in the campaign brief and maintain professional quality standards.</li>
                  <li><strong className="text-foreground">Prohibited Content:</strong> Content that is explicit, violent, discriminatory, promotes illegal activities, or targets vulnerable populations is strictly prohibited.</li>
                </ul>
                <p>
                  INFLUXconnect reserves the right to remove content and suspend accounts that violate these guidelines without prior notice.
                </p>
              </div>
            </motion.div>

            {/* 10. Limitation of Liability */}
            <motion.div variants={fadeInUp}>
              <h2 className="text-2xl font-bold mb-4 text-foreground">10. Limitation of Liability</h2>
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
                </ul>
                <p>
                  Our total aggregate liability for any claims arising from or related to these Terms or your use of the Platform shall not exceed the total fees paid by you to INFLUXconnect in the 12 months preceding the claim.
                </p>
              </div>
            </motion.div>

            {/* 11. Termination */}
            <motion.div variants={fadeInUp}>
              <h2 className="text-2xl font-bold mb-4 text-foreground">11. Termination</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  You may terminate your account at any time by contacting our support team or through your account settings. Upon termination, any pending campaign obligations must be fulfilled or mutually cancelled, and remaining wallet balances will be returned subject to applicable withdrawal fees and processing times.
                </p>
                <p>
                  We may suspend or terminate your account immediately, without prior notice, if we determine that you have violated these Terms, engaged in fraudulent activity, or pose a risk to the Platform or its users. In such cases, we reserve the right to withhold pending earnings pending investigation.
                </p>
                <p>
                  Sections relating to Intellectual Property, Limitation of Liability, and Governing Law shall survive termination of these Terms.
                </p>
              </div>
            </motion.div>

            {/* 12. Governing Law */}
            <motion.div variants={fadeInUp}>
              <h2 className="text-2xl font-bold mb-4 text-foreground">12. Governing Law</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  These Terms shall be governed by and construed in accordance with the laws of the State of Delaware, United States, without regard to its conflict of law provisions. Any disputes arising from these Terms or your use of the Platform shall be resolved exclusively in the state or federal courts located in Delaware.
                </p>
                <p>
                  For users located in the European Union, nothing in these Terms affects your rights under mandatory consumer protection laws of your country of residence.
                </p>
              </div>
            </motion.div>

            {/* 13. Contact Information */}
            <motion.div variants={fadeInUp}>
              <h2 className="text-2xl font-bold mb-4 text-foreground">13. Contact Information</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  If you have any questions, concerns, or requests regarding these Terms of Service, please contact us at:
                </p>
                <p>
                  <strong className="text-foreground">Email:</strong>{" "}
                  <Link href="mailto:support@influx.ai" className="text-primary hover:underline">
                    support@influx.ai
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

            {/* Social Media & Contact */}
            <div className="flex flex-col items-center md:items-end gap-3">
              <div className="flex items-center gap-3">
                <Link href="https://www.instagram.com/influx.connect/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-2xl border-2 border-muted-foreground/30 flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-all">
                  <Instagram className="h-5 w-5" />
                </Link>
                <Link href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-2xl border-2 border-muted-foreground/30 flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-all">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                  </svg>
                </Link>
                <Link href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-2xl border-2 border-muted-foreground/30 flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-all">
                  <Facebook className="h-5 w-5" />
                </Link>
                <Link href="https://x.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-2xl border-2 border-muted-foreground/30 flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-all">
                  <Twitter className="h-5 w-5" />
                </Link>
                <Link href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-2xl border-2 border-muted-foreground/30 flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-all">
                  <Linkedin className="h-5 w-5" />
                </Link>
              </div>
              <Link href="mailto:aiinflux@proton.me" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <Mail className="h-4 w-4" />
                aiinflux@proton.me
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
