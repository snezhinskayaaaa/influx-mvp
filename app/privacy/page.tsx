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

export default function PrivacyPage() {
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
                Privacy Policy
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
            {/* Introduction */}
            <motion.div variants={fadeInUp}>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  INFLUXconnect ("Company," "we," "us," or "our") is committed to protecting the privacy of our users. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our AI influencer marketplace platform ("Platform"). Please read this policy carefully. By using the Platform, you consent to the practices described herein.
                </p>
              </div>
            </motion.div>

            {/* 1. Information We Collect */}
            <motion.div variants={fadeInUp}>
              <h2 className="text-2xl font-bold mb-4 text-foreground">1. Information We Collect</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <h3 className="text-lg font-semibold text-foreground">1.1 Account Information</h3>
                <p>
                  When you create an account, we collect information you provide directly, including:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Full name, email address, and password</li>
                  <li>Account type (brand or influencer)</li>
                  <li>Company name and business details (for brand accounts)</li>
                  <li>AI influencer profile details, including persona name, niche, platform presence, and portfolio content (for influencer accounts)</li>
                  <li>Profile photos and avatar images</li>
                </ul>

                <h3 className="text-lg font-semibold text-foreground mt-6">1.2 Usage Data</h3>
                <p>
                  We automatically collect certain information when you interact with the Platform, including:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Device information (browser type, operating system, device identifiers)</li>
                  <li>IP address and approximate geographic location</li>
                  <li>Pages visited, features used, and actions taken within the Platform</li>
                  <li>Session duration, access times, and referring URLs</li>
                  <li>Search queries and filter selections</li>
                </ul>

                <h3 className="text-lg font-semibold text-foreground mt-6">1.3 Campaign Data</h3>
                <p>
                  When you participate in campaigns, we collect:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Campaign briefs, deliverables, and performance metrics</li>
                  <li>Communications between brands and influencers conducted through the Platform</li>
                  <li>Content submitted for campaign review and approval</li>
                  <li>Campaign ratings and feedback</li>
                </ul>

                <h3 className="text-lg font-semibold text-foreground mt-6">1.4 Wallet and Transaction Data</h3>
                <p>
                  For payment processing, we collect:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Wallet addresses for cryptocurrency transactions</li>
                  <li>Deposit and withdrawal history, amounts, and timestamps</li>
                  <li>Transaction IDs and payment confirmation details</li>
                  <li>Identity verification documents as required by applicable regulations</li>
                </ul>
              </div>
            </motion.div>

            {/* 2. How We Use Information */}
            <motion.div variants={fadeInUp}>
              <h2 className="text-2xl font-bold mb-4 text-foreground">2. How We Use Information</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  We use the information we collect for the following purposes:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong className="text-foreground">Platform Operation:</strong> To provide, maintain, and improve the Platform's functionality, including account management, campaign facilitation, and payment processing.</li>
                  <li><strong className="text-foreground">Personalization:</strong> To tailor your experience, including recommending relevant campaigns, influencers, or content based on your profile and activity.</li>
                  <li><strong className="text-foreground">Communication:</strong> To send you important updates about your account, campaigns, transactions, and Platform changes. You may opt out of promotional communications at any time.</li>
                  <li><strong className="text-foreground">Security and Fraud Prevention:</strong> To detect, investigate, and prevent fraudulent transactions, unauthorized access, and other malicious activities.</li>
                  <li><strong className="text-foreground">Analytics:</strong> To understand how users interact with the Platform, identify trends, and improve our services.</li>
                  <li><strong className="text-foreground">Legal Compliance:</strong> To comply with applicable laws, regulations, and legal processes, including anti-money laundering (AML) and know-your-customer (KYC) requirements.</li>
                </ul>
              </div>
            </motion.div>

            {/* 3. Information Sharing */}
            <motion.div variants={fadeInUp}>
              <h2 className="text-2xl font-bold mb-4 text-foreground">3. Information Sharing</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  <strong className="text-foreground">We do not sell your personal data.</strong> We may share your information only in the following circumstances:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong className="text-foreground">Campaign Partners:</strong> When you participate in a campaign, relevant profile information and campaign-related data are shared with the other party (brand or influencer) to facilitate the collaboration.</li>
                  <li><strong className="text-foreground">Service Providers:</strong> We share data with trusted third-party service providers who assist us in operating the Platform, processing payments, and analyzing usage. These providers are contractually obligated to protect your data and use it only for the purposes we specify.</li>
                  <li><strong className="text-foreground">Legal Requirements:</strong> We may disclose your information if required to do so by law, in response to valid legal process, or to protect the rights, property, or safety of INFLUXconnect, our users, or the public.</li>
                  <li><strong className="text-foreground">Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets, your data may be transferred as part of that transaction. We will notify you of any such change in ownership or control.</li>
                </ul>
              </div>
            </motion.div>

            {/* 4. Data Security */}
            <motion.div variants={fadeInUp}>
              <h2 className="text-2xl font-bold mb-4 text-foreground">4. Data Security</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  We implement industry-standard technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction. These measures include:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Encryption of data in transit (TLS/SSL) and at rest</li>
                  <li>Regular security assessments and penetration testing</li>
                  <li>Access controls and role-based permissions for internal systems</li>
                  <li>Secure authentication mechanisms, including support for two-factor authentication</li>
                  <li>Monitoring and logging of system access and anomalous activity</li>
                </ul>
                <p>
                  While we strive to protect your data, no method of electronic transmission or storage is 100% secure. We cannot guarantee absolute security but will promptly notify affected users in the event of a data breach as required by applicable law.
                </p>
              </div>
            </motion.div>

            {/* 5. Cookies and Tracking */}
            <motion.div variants={fadeInUp}>
              <h2 className="text-2xl font-bold mb-4 text-foreground">5. Cookies and Tracking</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  We use cookies and similar tracking technologies to enhance your experience on the Platform. These include:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong className="text-foreground">Essential Cookies:</strong> Required for core Platform functionality, such as authentication, session management, and security.</li>
                  <li><strong className="text-foreground">Analytics Cookies:</strong> Help us understand how users interact with the Platform, which pages are most visited, and where users encounter issues.</li>
                  <li><strong className="text-foreground">Preference Cookies:</strong> Remember your settings, preferences, and customizations to provide a personalized experience.</li>
                </ul>
                <p>
                  You can manage your cookie preferences through your browser settings. Disabling certain cookies may affect the functionality of the Platform. We do not use third-party advertising cookies.
                </p>
              </div>
            </motion.div>

            {/* 6. User Rights */}
            <motion.div variants={fadeInUp}>
              <h2 className="text-2xl font-bold mb-4 text-foreground">6. User Rights</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Depending on your jurisdiction, you may have the following rights regarding your personal data:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong className="text-foreground">Access:</strong> Request a copy of the personal data we hold about you.</li>
                  <li><strong className="text-foreground">Rectification:</strong> Request correction of inaccurate or incomplete data.</li>
                  <li><strong className="text-foreground">Erasure:</strong> Request deletion of your personal data, subject to legal obligations and legitimate business interests.</li>
                  <li><strong className="text-foreground">Restriction:</strong> Request that we limit the processing of your data in certain circumstances.</li>
                  <li><strong className="text-foreground">Portability:</strong> Request a machine-readable copy of the data you provided to us.</li>
                  <li><strong className="text-foreground">Objection:</strong> Object to processing of your data based on legitimate interests or for direct marketing purposes.</li>
                </ul>
                <p>
                  <strong className="text-foreground">For EU Users (GDPR):</strong> If you are located in the European Economic Area, you have additional rights under the General Data Protection Regulation. Our legal bases for processing your data include consent, contractual necessity, legitimate interests, and legal compliance. You may also lodge a complaint with your local data protection authority.
                </p>
                <p>
                  To exercise any of these rights, please contact us at{" "}
                  <Link href="mailto:support@aiinflux.io" className="text-primary hover:underline">
                    support@aiinflux.io
                  </Link>
                  . We will respond to your request within 30 days.
                </p>
              </div>
            </motion.div>

            {/* 7. Data Retention */}
            <motion.div variants={fadeInUp}>
              <h2 className="text-2xl font-bold mb-4 text-foreground">7. Data Retention</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  We retain your personal data for as long as your account is active or as needed to provide you with our services. Specific retention periods include:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong className="text-foreground">Account Data:</strong> Retained for the duration of your account and for 30 days after deletion to allow for account recovery.</li>
                  <li><strong className="text-foreground">Transaction Records:</strong> Retained for a minimum of 5 years to comply with financial reporting and anti-money laundering regulations.</li>
                  <li><strong className="text-foreground">Campaign Data:</strong> Retained for 2 years after campaign completion for analytics and dispute resolution purposes.</li>
                  <li><strong className="text-foreground">Usage Logs:</strong> Retained for 12 months for security monitoring and analytics.</li>
                </ul>
                <p>
                  After the applicable retention period, data is securely deleted or anonymized so that it can no longer be associated with you.
                </p>
              </div>
            </motion.div>

            {/* 8. Third-Party Services */}
            <motion.div variants={fadeInUp}>
              <h2 className="text-2xl font-bold mb-4 text-foreground">8. Third-Party Services</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  The Platform integrates with and relies on the following third-party services:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong className="text-foreground">Railway:</strong> Our infrastructure and hosting provider. Data is processed and stored on Railway's secure servers.</li>
                  <li><strong className="text-foreground">PostgreSQL:</strong> Our database management system, used to store structured application data securely.</li>
                  <li><strong className="text-foreground">Payment Processors:</strong> Third-party cryptocurrency payment processors handle wallet deposits and withdrawals.</li>
                  <li><strong className="text-foreground">Analytics Providers:</strong> We use analytics services to understand Platform usage and improve our offerings.</li>
                </ul>
                <p>
                  Each third-party service operates under its own privacy policy. We encourage you to review their policies. We select partners who demonstrate strong commitments to data protection and security.
                </p>
              </div>
            </motion.div>

            {/* 9. Children's Privacy */}
            <motion.div variants={fadeInUp}>
              <h2 className="text-2xl font-bold mb-4 text-foreground">9. Children's Privacy</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  The Platform is intended for users who are at least 18 years of age. We do not knowingly collect personal information from individuals under 18. If we become aware that a user is under 18, we will promptly delete their account and all associated data.
                </p>
                <p>
                  If you believe that we have inadvertently collected information from a minor, please contact us immediately at{" "}
                  <Link href="mailto:support@aiinflux.io" className="text-primary hover:underline">
                    support@aiinflux.io
                  </Link>
                  .
                </p>
              </div>
            </motion.div>

            {/* 10. Changes to Privacy Policy */}
            <motion.div variants={fadeInUp}>
              <h2 className="text-2xl font-bold mb-4 text-foreground">10. Changes to Privacy Policy</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  We may update this Privacy Policy from time to time to reflect changes in our practices, technologies, legal requirements, or other factors. When we make material changes, we will:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Update the "Last updated" date at the top of this page</li>
                  <li>Notify you via email or an in-platform notification at least 30 days before the changes take effect</li>
                  <li>Where required by law, obtain your consent to the updated policy</li>
                </ul>
                <p>
                  We encourage you to review this Privacy Policy periodically. Your continued use of the Platform after changes are posted constitutes your acceptance of the updated policy.
                </p>
              </div>
            </motion.div>

            {/* 11. Contact */}
            <motion.div variants={fadeInUp}>
              <h2 className="text-2xl font-bold mb-4 text-foreground">11. Contact</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us at:
                </p>
                <p>
                  <strong className="text-foreground">Email:</strong>{" "}
                  <Link href="mailto:support@aiinflux.io" className="text-primary hover:underline">
                    support@aiinflux.io
                  </Link>
                </p>
                <p>
                  For general platform inquiries, you can also reach us at{" "}
                  <Link href="mailto:support@aiinflux.io" className="text-primary hover:underline">
                    support@aiinflux.io
                  </Link>
                  .
                </p>
                <p>
                  We aim to respond to all privacy-related inquiries within 30 days.
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
                <Link href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-2xl border-2 border-muted-foreground/30 flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-all">
                  <Facebook className="h-5 w-5" />
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
