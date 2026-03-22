"use client";

import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { NetworkLogo } from "@/components/logo";
import { CountdownTimer } from "@/components/countdown-timer";
import { motion, useAnimationControls } from "framer-motion";
import { useState, useEffect } from "react";
import {
  ArrowRight,
  Sparkles,
  TrendingUp,
  Zap,
  CheckCircle2,
  DollarSign,
  Shield,
  FileText,
  Eye,
  Lock,
  CreditCard,
  BarChart3,
  Wallet,
  Target,
  Mail,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  Bell,
  Clock,
  Award,
  Crown,
  Check,
  Flame,
  ArrowDownCircle,
  CheckSquare
} from "lucide-react";
import Link from "next/link";

const fadeInUp = {
  hidden: { opacity: 0, y: 100, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1] as any,
    },
  },
};

function AnimatedEarnings() {
  const [earnings, setEarnings] = useState(0);
  const targetEarnings = 15247;

  useEffect(() => {
    const duration = 2000; // 2 seconds
    const steps = 60;
    const increment = targetEarnings / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= targetEarnings) {
        setEarnings(targetEarnings);
        clearInterval(timer);
      } else {
        setEarnings(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, []);

  return earnings.toLocaleString();
}

export default function InfluencersPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="relative pt-32 sm:pt-40 pb-24 sm:pb-32 px-4 overflow-hidden"
      >
        <div className="container max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left - Text Content */}
            <div className="text-left">
              <div className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 rounded-full bg-secondary/10 border border-secondary/20 backdrop-blur-sm mb-6">
                <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-secondary" />
                <span className="text-xs sm:text-sm font-medium text-secondary">
                  For AI Influencers & Creators
                </span>
              </div>

              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                Monetize Your AI Influence
              </h1>

              <p className="mt-6 text-lg text-muted-foreground sm:text-xl leading-relaxed">
                Connect with premium brands. Set your own rates.
              </p>

              <p className="text-lg text-muted-foreground sm:text-xl leading-relaxed">
                Keep full creative control.
              </p>

              <div className="mt-10">
                <Button size="lg" asChild className="w-full sm:w-64 bg-secondary/10 hover:bg-secondary/15 backdrop-blur-sm border-2 border-secondary/30 h-14 text-base transition-all rounded-xl px-8">
                  <Link href="/signup?type=influencer" className="flex items-center justify-center">
                    <span className="bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent font-medium">Join as Influencer</span>
                    <ArrowRight className="ml-2 h-5 w-5 text-secondary" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Right - Animated Dashboard */}
            <div className="relative">
              <Card className="p-4 lg:p-8 bg-gradient-to-br from-secondary/5 to-primary/5 border-2 border-secondary/20">
                {/* Header */}
                <div className="flex items-center justify-between mb-4 lg:mb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-base lg:text-xl font-bold">Your Earnings</h3>
                      <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
                        Verified
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">This month</p>
                  </div>
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    <DollarSign className="h-6 w-6 lg:h-8 lg:w-8 text-secondary" />
                  </motion.div>
                </div>

                {/* Animated Earnings */}
                <div className="mb-4 lg:mb-6">
                  <div className="text-2xl lg:text-4xl font-bold text-secondary">
                    $<AnimatedEarnings />
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <TrendingUp className="h-3 w-3 lg:h-4 lg:w-4 text-primary" />
                    <span className="text-xs lg:text-sm text-primary font-medium">+342% from last month</span>
                  </div>
                </div>

                {/* Progress Bars */}
                <div className="space-y-3 lg:space-y-4 mb-4 lg:mb-6">
                  <div>
                    <div className="flex items-center justify-between mb-1 lg:mb-2">
                      <span className="text-xs lg:text-sm text-muted-foreground">Campaigns completed</span>
                      <span className="text-xs lg:text-sm font-medium">8/10</span>
                    </div>
                    <motion.div
                      className="h-1.5 lg:h-2 bg-muted rounded-full overflow-hidden"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      <motion.div
                        className="h-full bg-gradient-to-r from-secondary to-primary"
                        initial={{ width: 0 }}
                        animate={{ width: "80%" }}
                        transition={{ duration: 1, delay: 0.7, ease: "easeOut" }}
                      />
                    </motion.div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1 lg:mb-2">
                      <span className="text-xs lg:text-sm text-muted-foreground">Engagement rate</span>
                      <span className="text-xs lg:text-sm font-medium">5.9%</span>
                    </div>
                    <motion.div
                      className="h-1.5 lg:h-2 bg-muted rounded-full overflow-hidden"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                    >
                      <motion.div
                        className="h-full bg-gradient-to-r from-primary to-secondary"
                        initial={{ width: 0 }}
                        animate={{ width: "95%" }}
                        transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
                      />
                    </motion.div>
                  </div>
                </div>

                {/* New Offers Notifications */}
                <div className="space-y-2 lg:space-y-3">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.2 }}
                    className="flex items-start gap-2 lg:gap-3 p-2 lg:p-3 rounded-lg bg-secondary/10 border border-secondary/20"
                  >
                    <Bell className="h-4 w-4 lg:h-5 lg:w-5 text-secondary shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs lg:text-sm font-medium">New campaign offer</p>
                      <p className="text-[10px] lg:text-xs text-muted-foreground truncate">Nike wants to collaborate - $2,500</p>
                    </div>
                    <Clock className="h-3 w-3 lg:h-4 lg:w-4 text-muted-foreground shrink-0" />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.4 }}
                    className="flex items-start gap-2 lg:gap-3 p-2 lg:p-3 rounded-lg bg-primary/10 border border-primary/20"
                  >
                    <CheckCircle2 className="h-4 w-4 lg:h-5 lg:w-5 text-primary shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs lg:text-sm font-medium">Payment received</p>
                      <p className="text-[10px] lg:text-xs text-muted-foreground truncate">Apple campaign - $3,200</p>
                    </div>
                  </motion.div>
                </div>
              </Card>

              {/* Floating Elements */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                className="absolute -top-4 -right-4 w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-gradient-to-br from-secondary/20 to-primary/20 blur-2xl"
              />
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 0.5 }}
                className="absolute -bottom-4 -left-4 w-20 h-20 lg:w-24 lg:h-24 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 blur-2xl"
              />
            </div>
          </div>
        </div>
      </motion.section>

      {/* Early Adopters Program */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeInUp}
        className="py-16 sm:py-20 bg-gradient-to-b from-background via-secondary/5 to-background relative overflow-hidden"
      >
        {/* Background decorative elements */}
        <div className="absolute inset-0 bg-grid-white/5 [mask-image:radial-gradient(white,transparent_85%)]" />

        <div className="container px-6 lg:px-8 max-w-6xl mx-auto relative z-10">
          {/* Header */}
          <div className="text-center mb-10 sm:mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-2 border-amber-500/30 mb-5">
              <Flame className="h-4 w-4 text-amber-500" />
              <span className="text-sm font-semibold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                LIMITED TIME - FIRST MONTH ONLY
              </span>
              <Flame className="h-4 w-4 text-amber-500" />
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-secondary via-amber-500 to-primary bg-clip-text text-transparent">
                Be a Founding Creator
              </span>
            </h2>

            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
              Complete your first payout during our launch month and lock in the lowest withdrawal fees forever
            </p>

            {/* Countdown */}
            <CountdownTimer />
          </div>

          {/* Main Benefits Card */}
          <Card className="p-6 sm:p-10 lg:p-12 bg-gradient-to-br from-secondary/10 via-background to-amber-500/10 backdrop-blur-xl border-2 border-secondary/30 shadow-2xl mb-10">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mb-8">
              {/* Left: Pricing */}
              <div>
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-secondary/30 to-secondary/10 flex items-center justify-center shrink-0">
                    <Sparkles className="h-7 w-7 text-secondary" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2">Launch Pricing</h3>
                    <p className="text-muted-foreground">Lowest fees in the industry</p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-secondary/10 to-transparent p-6 rounded-2xl border-2 border-secondary/30 mb-6">
                  <div className="flex items-baseline gap-3 mb-4">
                    <span className="text-5xl font-bold text-secondary">3%</span>
                    <span className="text-xl text-muted-foreground">withdrawal fee</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Only when you cash out your earnings (includes gas fees)
                  </p>
                  <div className="bg-muted/50 p-4 rounded-xl mb-4">
                    <p className="text-sm font-medium mb-1">Example:</p>
                    <p className="text-sm text-muted-foreground">
                      Withdraw $1,000 → 3% fee ($30) → Receive $970 USDC
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-secondary" />
                    <span className="text-muted-foreground">vs. 6% standard rate (after launch)</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Crown className="h-5 w-5 text-amber-500 shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold text-sm mb-1">Founding Creator Status</p>
                      <p className="text-xs text-muted-foreground">Complete first withdrawal + leave feedback = Lock 3% rate forever</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Award className="h-5 w-5 text-secondary shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold text-sm mb-1">Early Adopter Badge</p>
                      <p className="text-xs text-muted-foreground">Without feedback = Badge only (rates increase to 6%)</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Benefits */}
              <div>
                <h3 className="text-xl font-bold mb-6">What You Get as a Founding Creator</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/30 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="h-4 w-4 text-secondary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Lifetime 3% Fee</p>
                      <p className="text-xs text-muted-foreground">Keep $20 more on every $1K earned</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/30 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0">
                      <Crown className="h-4 w-4 text-amber-500" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Exclusive Founder Badge</p>
                      <p className="text-xs text-muted-foreground">Stand out to premium brands</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/30 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0">
                      <Zap className="h-4 w-4 text-secondary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Priority Support</p>
                      <p className="text-xs text-muted-foreground">Direct line to our founding team</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/30 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0">
                      <TrendingUp className="h-4 w-4 text-secondary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Featured Placement</p>
                      <p className="text-xs text-muted-foreground">Boosted visibility in brand searches</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/30 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0">
                      <Shield className="h-4 w-4 text-secondary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Shape the Platform</p>
                      <p className="text-xs text-muted-foreground">Your voice matters in our development</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* How to Qualify */}
            <div className="pt-8 border-t border-border/50">
              <h4 className="font-bold text-center mb-6">How to Become a Founding Creator</h4>
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="bg-muted/30 p-5 rounded-xl border border-border/50 text-center">
                  <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center text-base font-bold text-secondary mb-4 mx-auto">1</div>
                  <p className="font-semibold text-sm mb-2">Join This Month</p>
                  <p className="text-xs text-muted-foreground">Sign up during launch period</p>
                </div>
                <div className="bg-muted/30 p-5 rounded-xl border border-border/50 text-center">
                  <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center text-base font-bold text-secondary mb-4 mx-auto">2</div>
                  <p className="font-semibold text-sm mb-2">Complete Campaign</p>
                  <p className="text-xs text-muted-foreground">Earn and withdraw your first payment</p>
                </div>
                <div className="bg-muted/30 p-5 rounded-xl border border-border/50 text-center">
                  <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center text-base font-bold text-amber-500 mb-4 mx-auto">3</div>
                  <p className="font-semibold text-sm mb-2">Share Feedback</p>
                  <p className="text-xs text-muted-foreground">Lock 3% rate forever</p>
                </div>
              </div>
            </div>
          </Card>

          {/* CTA */}
          <div className="text-center">
            <Button asChild size="lg" className="bg-gradient-to-r from-secondary to-primary text-white hover:opacity-90 transition-all h-16 text-lg px-12 rounded-2xl shadow-2xl">
              <Link href="/signup?type=influencer" className="flex items-center justify-center">
                <Crown className="mr-2 h-6 w-6" />
                Become a Founding Creator
                <ArrowRight className="ml-2 h-6 w-6" />
              </Link>
            </Button>
            <p className="text-sm text-muted-foreground mt-4">
              No fees to join • Instant payouts • Start earning today
            </p>
          </div>
        </div>
      </motion.section>

      {/* Stats Bar */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeInUp}
        className="py-6 px-4 bg-gradient-to-r from-secondary/5 via-primary/5 to-secondary/5 border-y border-border/50"
      >
        <div className="container max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-center">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-secondary" />
              <span className="text-lg sm:text-xl font-bold text-foreground">Average $5K+ per campaign</span>
            </div>
            <span className="hidden sm:block text-muted-foreground">•</span>
            <p className="text-sm sm:text-base text-muted-foreground">
              AI influencers earn <span className="font-semibold text-secondary">2-3x more</span> than traditional creators
            </p>
          </div>
        </div>
      </motion.section>

      {/* Why Join */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeInUp}
        className="py-20 px-4"
      >
        <div className="container max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-secondary/10 text-secondary border-secondary/20">
              Why Choose Influx
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Built for Your Success
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The only platform where you control your rates, terms, and partnerships
            </p>
          </div>

          <div className="flex overflow-x-auto gap-4 pb-4 lg:grid lg:grid-cols-4 lg:gap-6 lg:overflow-visible snap-x snap-mandatory lg:snap-none">
            <Card className="text-center p-4 lg:p-6 border-2 hover:border-secondary/40 transition-all hover:shadow-lg min-w-[240px] lg:min-w-0 snap-center">
              <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-2xl bg-secondary/10 flex items-center justify-center mx-auto mb-3 lg:mb-4">
                <DollarSign className="h-6 w-6 lg:h-8 lg:w-8 text-secondary" />
              </div>
              <h3 className="text-base lg:text-xl font-semibold mb-2 lg:mb-3">Set Your Rates</h3>
              <p className="text-muted-foreground text-xs lg:text-sm">
                You decide your pricing. No platform fees. Keep 100% of what you earn.
              </p>
            </Card>

            <Card className="text-center p-4 lg:p-6 border-2 hover:border-primary/40 transition-all hover:shadow-lg min-w-[240px] lg:min-w-0 snap-center">
              <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-3 lg:mb-4">
                <Shield className="h-6 w-6 lg:h-8 lg:w-8 text-primary" />
              </div>
              <h3 className="text-base lg:text-xl font-semibold mb-2 lg:mb-3">Secure Payments</h3>
              <p className="text-muted-foreground text-xs lg:text-sm">
                All payments protected through escrow. Get paid automatically as you deliver.
              </p>
            </Card>

            <Card className="text-center p-4 lg:p-6 border-2 hover:border-primary/40 transition-all hover:shadow-lg min-w-[240px] lg:min-w-0 snap-center">
              <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-2xl bg-muted/80 flex items-center justify-center mx-auto mb-3 lg:mb-4">
                <Target className="h-6 w-6 lg:h-8 lg:w-8 text-foreground" />
              </div>
              <h3 className="text-base lg:text-xl font-semibold mb-2 lg:mb-3">Perfect Matches</h3>
              <p className="text-muted-foreground text-xs lg:text-sm">
                Connect with brands that align with your niche and values
              </p>
            </Card>

            <Card className="text-center p-4 lg:p-6 border-2 border-secondary/30 hover:border-secondary/50 transition-all hover:shadow-lg bg-gradient-to-br from-secondary/5 to-transparent min-w-[240px] lg:min-w-0 snap-center">
              <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-2xl bg-gradient-to-br from-secondary to-primary flex items-center justify-center mx-auto mb-3 lg:mb-4">
                <Sparkles className="h-6 w-6 lg:h-8 lg:w-8 text-primary-foreground" />
              </div>
              <h3 className="text-base lg:text-xl font-semibold mb-2 lg:mb-3">Full Control</h3>
              <p className="text-muted-foreground text-xs lg:text-sm">
                Approve every collaboration. Maintain creative freedom always.
              </p>
            </Card>
          </div>
        </div>
      </motion.section>

      {/* How It Works */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeInUp}
        className="py-12 lg:py-20 px-4 bg-muted/30"
      >
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-8 lg:mb-16">
            <Badge className="mb-3 lg:mb-4 bg-secondary/10 text-secondary border-secondary/20 text-xs lg:text-sm">
              Simple 4-Step Process
            </Badge>
            <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold mb-2 lg:mb-4">
              Start Earning Today
            </h2>
            <p className="text-sm lg:text-lg text-muted-foreground max-w-2xl mx-auto">
              From profile to payment in four simple steps
            </p>
          </div>

          <div className="relative grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-8">
            {/* Step 1 */}
            <div className="relative text-center">
              <div className="inline-flex items-center justify-center w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-secondary/10 text-secondary font-bold text-base lg:text-lg mb-2 lg:mb-4">
                1
              </div>
              <h3 className="text-sm lg:text-lg font-semibold mb-1 lg:mb-2">Create Profile</h3>
              <p className="text-xs lg:text-sm text-muted-foreground">
                Set up your profile, showcase your work, and set your rates.
              </p>

              {/* Arrow */}
              <div className="hidden md:block absolute top-5 left-[calc(50%+30px)] w-[calc(100%-30px)]">
                <svg className="w-full h-6" viewBox="0 0 100 24" preserveAspectRatio="none">
                  <path d="M0 12 L90 12" stroke="currentColor" strokeWidth="2" fill="none" className="text-secondary/30" strokeDasharray="4 4" />
                  <polygon points="90,12 85,9 85,15" fill="currentColor" className="text-secondary/30" />
                </svg>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative text-center">
              <div className="inline-flex items-center justify-center w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-secondary/10 text-secondary font-bold text-base lg:text-lg mb-2 lg:mb-4">
                2
              </div>
              <h3 className="text-sm lg:text-lg font-semibold mb-1 lg:mb-2">Get Offers</h3>
              <p className="text-xs lg:text-sm text-muted-foreground">
                Receive collaboration requests from brands matching your niche.
              </p>

              {/* Arrow */}
              <div className="hidden md:block absolute top-5 left-[calc(50%+30px)] w-[calc(100%-30px)]">
                <svg className="w-full h-6" viewBox="0 0 100 24" preserveAspectRatio="none">
                  <path d="M0 12 L90 12" stroke="currentColor" strokeWidth="2" fill="none" className="text-secondary/30" strokeDasharray="4 4" />
                  <polygon points="90,12 85,9 85,15" fill="currentColor" className="text-secondary/30" />
                </svg>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative text-center">
              <div className="inline-flex items-center justify-center w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-secondary/10 text-secondary font-bold text-base lg:text-lg mb-2 lg:mb-4">
                3
              </div>
              <h3 className="text-sm lg:text-lg font-semibold mb-1 lg:mb-2">Create Content</h3>
              <p className="text-xs lg:text-sm text-muted-foreground">
                Produce content on your terms with full creative control.
              </p>

              {/* Arrow */}
              <div className="hidden md:block absolute top-5 left-[calc(50%+30px)] w-[calc(100%-30px)]">
                <svg className="w-full h-6" viewBox="0 0 100 24" preserveAspectRatio="none">
                  <path d="M0 12 L90 12" stroke="currentColor" strokeWidth="2" fill="none" className="text-secondary/30" strokeDasharray="4 4" />
                  <polygon points="90,12 85,9 85,15" fill="currentColor" className="text-secondary/30" />
                </svg>
              </div>
            </div>

            {/* Step 4 */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-secondary/10 text-secondary font-bold text-base lg:text-lg mb-2 lg:mb-4">
                4
              </div>
              <h3 className="text-sm lg:text-lg font-semibold mb-1 lg:mb-2">Get Paid</h3>
              <p className="text-xs lg:text-sm text-muted-foreground">
                Receive payments automatically as milestones complete.
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-8 lg:mt-12">
            <Button size="lg" asChild className="bg-secondary/10 hover:bg-secondary/15 backdrop-blur-sm border-2 border-secondary/30 h-14 text-base transition-all rounded-xl px-8">
              <Link href="/signup?type=influencer" className="flex items-center justify-center">
                <span className="bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent font-medium">Start Earning Now</span>
                <ArrowRight className="ml-2 h-5 w-5 text-secondary" />
              </Link>
            </Button>
          </div>
        </div>
      </motion.section>

      {/* Protected Payment System */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeInUp}
        className="py-12 lg:py-20 px-4 bg-gradient-to-b from-background to-muted/30"
      >
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-success/10 text-success border-success/20">
              Secure & Transparent
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Your Earnings Are Protected
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Every payment is secured through our escrow system with milestone-based releases
            </p>
          </div>

          <div className="flex overflow-x-auto gap-4 pb-4 md:grid md:grid-cols-2 md:gap-8 md:overflow-visible snap-x snap-mandatory md:snap-none mb-8 lg:mb-12">
            {/* Escrow System */}
            <Card className="p-5 lg:p-8 bg-gradient-to-br from-success/5 to-transparent border-success/20 min-w-[300px] md:min-w-0 snap-center">
              <div className="flex items-center gap-2 lg:gap-3 mb-4 lg:mb-6">
                <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-success/10 flex items-center justify-center">
                  <Lock className="h-5 w-5 lg:h-6 lg:w-6 text-success" />
                </div>
                <h3 className="text-lg lg:text-2xl font-bold">Escrow Protection</h3>
              </div>

              <div className="space-y-2 lg:space-y-4">
                <div className="flex items-start gap-2 lg:gap-3">
                  <ArrowDownCircle className="h-4 w-4 lg:h-5 lg:w-5 text-success shrink-0 mt-0.5 lg:mt-1" />
                  <p className="text-xs lg:text-base text-muted-foreground">Funds secured before work starts</p>
                </div>
                <div className="flex items-start gap-2 lg:gap-3">
                  <ArrowDownCircle className="h-4 w-4 lg:h-5 lg:w-5 text-success shrink-0 mt-0.5 lg:mt-1" />
                  <p className="text-xs lg:text-base text-muted-foreground">Automatic milestone-based releases</p>
                </div>
                <div className="flex items-start gap-2 lg:gap-3">
                  <ArrowDownCircle className="h-4 w-4 lg:h-5 lg:w-5 text-success shrink-0 mt-0.5 lg:mt-1" />
                  <p className="text-xs lg:text-base text-muted-foreground">Protected from non-payment</p>
                </div>
                <div className="flex items-start gap-2 lg:gap-3">
                  <ArrowDownCircle className="h-4 w-4 lg:h-5 lg:w-5 text-success shrink-0 mt-0.5 lg:mt-1" />
                  <p className="text-xs lg:text-base text-muted-foreground">Transparent transaction history</p>
                </div>
              </div>
            </Card>

            {/* Fast Payouts */}
            <Card className="p-5 lg:p-8 bg-gradient-to-br from-primary/5 to-transparent border-primary/20 min-w-[300px] md:min-w-0 snap-center">
              <div className="flex items-center gap-2 lg:gap-3 mb-4 lg:mb-6">
                <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <DollarSign className="h-5 w-5 lg:h-6 lg:w-6 text-primary" />
                </div>
                <h3 className="text-lg lg:text-2xl font-bold">Fast Withdrawals</h3>
              </div>

              <div className="space-y-2 lg:space-y-4">
                <div className="flex items-start gap-2 lg:gap-3">
                  <CheckSquare className="h-4 w-4 lg:h-5 lg:w-5 text-primary shrink-0 mt-0.5 lg:mt-1" />
                  <p className="text-xs lg:text-base text-muted-foreground">Multiple withdrawal methods</p>
                </div>
                <div className="flex items-start gap-2 lg:gap-3">
                  <CheckSquare className="h-4 w-4 lg:h-5 lg:w-5 text-primary shrink-0 mt-0.5 lg:mt-1" />
                  <p className="text-xs lg:text-base text-muted-foreground">Same-day processing available</p>
                </div>
                <div className="flex items-start gap-2 lg:gap-3">
                  <CheckSquare className="h-4 w-4 lg:h-5 lg:w-5 text-primary shrink-0 mt-0.5 lg:mt-1" />
                  <p className="text-xs lg:text-base text-muted-foreground">Low transaction fees</p>
                </div>
                <div className="flex items-start gap-2 lg:gap-3">
                  <CheckSquare className="h-4 w-4 lg:h-5 lg:w-5 text-primary shrink-0 mt-0.5 lg:mt-1" />
                  <p className="text-xs lg:text-base text-muted-foreground">Detailed earnings reports</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Milestone Flow */}
          <Card className="p-5 lg:p-8 bg-gradient-to-br from-secondary/5 to-transparent border-secondary/20">
            <div className="flex items-center gap-2 lg:gap-3 mb-5 lg:mb-8">
              <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
                <CreditCard className="h-5 w-5 lg:h-6 lg:w-6 text-secondary" />
              </div>
              <h3 className="text-lg lg:text-2xl font-bold">Milestone-Based Payments</h3>
            </div>

            <div className="relative">
              {/* Decorative Progress Line with Gradient */}
              <div className="hidden lg:block absolute top-12 left-[16%] right-[16%] h-1 bg-gradient-to-r from-secondary/30 via-secondary/60 to-secondary/30 rounded-full" />
              <div className="hidden lg:block absolute top-[46px] left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-secondary/10 via-secondary/30 to-secondary/10" />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 lg:gap-6">
                {/* Milestone 1: Negotiation - 25% */}
                <div className="relative bg-background rounded-xl border-2 border-secondary/30 p-3 lg:p-5 hover:border-secondary/50 transition-all">
                  <div className="flex items-center gap-1.5 lg:gap-2 mb-2 lg:mb-3">
                    <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                      <FileText className="h-4 w-4 lg:h-5 lg:w-5 text-secondary" />
                    </div>
                    <div>
                      <span className="text-base lg:text-xl font-bold text-secondary">25%</span>
                    </div>
                  </div>
                  <h4 className="font-bold text-xs lg:text-base mb-1 lg:mb-2">Negotiation</h4>
                  <p className="text-[10px] lg:text-sm text-muted-foreground leading-relaxed">
                    First payment releases when both parties agree on collaboration terms and conditions.
                  </p>
                </div>

                {/* Milestone 2: Content Approval - 25% */}
                <div className="relative bg-background rounded-xl border-2 border-secondary/30 p-3 lg:p-5 hover:border-secondary/50 transition-all">
                  <div className="flex items-center gap-1.5 lg:gap-2 mb-2 lg:mb-3">
                    <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                      <CheckCircle2 className="h-4 w-4 lg:h-5 lg:w-5 text-secondary" />
                    </div>
                    <div>
                      <span className="text-base lg:text-xl font-bold text-secondary">25%</span>
                    </div>
                  </div>
                  <h4 className="font-bold text-xs lg:text-base mb-1 lg:mb-2">Content Approval</h4>
                  <p className="text-[10px] lg:text-sm text-muted-foreground leading-relaxed">
                    Payment releases automatically when brand approves your final content version.
                  </p>
                </div>

                {/* Milestone 3: Publication & Metrics - 50% */}
                <div className="relative bg-background rounded-xl border-2 border-secondary/30 p-3 lg:p-5 hover:border-secondary/50 transition-all">
                  <div className="flex items-center gap-1.5 lg:gap-2 mb-2 lg:mb-3">
                    <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                      <BarChart3 className="h-4 w-4 lg:h-5 lg:w-5 text-secondary" />
                    </div>
                    <div>
                      <span className="text-base lg:text-xl font-bold text-secondary">50%</span>
                    </div>
                  </div>
                  <h4 className="font-bold text-xs lg:text-base mb-1 lg:mb-2">Publication & Metrics</h4>
                  <p className="text-[10px] lg:text-sm text-muted-foreground leading-relaxed">
                    Final 50% releases when you publish content and deliver performance metrics.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* CTA */}
          <div className="text-center mt-12">
            <Button asChild size="lg" className="bg-primary/10 hover:bg-primary/15 backdrop-blur-sm border-2 border-primary/30 h-14 text-base transition-all rounded-xl px-8">
              <Link href="/signup?type=influencer" className="flex items-center justify-center">
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent font-medium">Start Earning Today</span>
                <ArrowRight className="ml-2 h-5 w-5 text-secondary" />
              </Link>
            </Button>
          </div>
        </div>
      </motion.section>

      {/* Pricing Plans */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeInUp}
        className="py-12 lg:py-20 px-4"
      >
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-8 lg:mb-12">
            <Badge className="mb-3 lg:mb-4 bg-secondary/10 text-secondary border-secondary/20 text-xs lg:text-sm">
              Flexible Options
            </Badge>
            <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold mb-2 lg:mb-4">
              Choose Your Plan
            </h2>
            <p className="text-sm lg:text-lg text-muted-foreground max-w-2xl mx-auto">
              Start free or unlock premium features
            </p>
          </div>

          <div className="flex overflow-x-auto gap-4 pb-4 pt-4 lg:grid lg:grid-cols-2 lg:gap-6 lg:overflow-visible snap-x snap-mandatory lg:snap-none">
            {/* Free Plan */}
            <Card className="p-4 lg:p-6 bg-muted/30 border-2 border-border hover:border-secondary/50 transition-all flex flex-col min-w-[280px] lg:min-w-0 snap-center">
              <div className="mb-4 lg:mb-6 h-[140px] lg:h-[160px]">
                <Sparkles className="h-6 w-6 lg:h-8 lg:w-8 text-secondary mb-2 lg:mb-3" />
                <h3 className="text-base lg:text-xl font-bold mb-1 lg:mb-2">Free</h3>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-2xl lg:text-3xl font-bold">$0</span>
                  <span className="text-sm lg:text-base text-muted-foreground">/month</span>
                </div>
                <p className="text-xs lg:text-sm text-muted-foreground">
                  Start earning immediately
                </p>
              </div>

              <div className="mb-4 lg:mb-6 flex-1">
                <p className="text-xs text-muted-foreground mb-2">Features:</p>
                <div className="text-xs lg:text-sm space-y-1 text-muted-foreground">
                  <p>Unlimited campaign applications</p>
                  <p>Basic analytics & community support</p>
                </div>
              </div>

              <Button asChild variant="outline" className="w-full h-9 lg:h-10 text-sm">
                <Link href="/signup?type=influencer&plan=free">
                  Get Started Free
                  <ArrowRight className="ml-2 h-3 w-3 lg:h-4 lg:w-4" />
                </Link>
              </Button>
            </Card>

            {/* Creator Pro */}
            <Card className="pt-6 px-4 pb-4 lg:p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-2 border-primary/50 hover:border-primary transition-all relative flex flex-col min-w-[280px] lg:min-w-0 snap-center">
              <Badge className="absolute -top-2 lg:-top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs">
                Most Popular
              </Badge>

              <div className="mb-4 lg:mb-6 h-[140px] lg:h-[160px] mt-2 lg:mt-0">
                <Award className="h-6 w-6 lg:h-8 lg:w-8 text-primary mb-2 lg:mb-3" />
                <h3 className="text-base lg:text-xl font-bold mb-1 lg:mb-2">CREATOR PRO</h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-2xl lg:text-3xl font-bold">$49</span>
                  <span className="text-sm lg:text-base text-muted-foreground">/month</span>
                </div>
                <Badge className="bg-secondary/20 text-secondary border-secondary/30 text-xs">
                  First month $1
                </Badge>
              </div>

              <div className="mb-4 lg:mb-6 flex-1">
                <p className="text-xs text-muted-foreground mb-2">Premium features:</p>
                <div className="text-xs lg:text-sm space-y-1 text-muted-foreground">
                  <p>Verified badge & priority placement</p>
                  <p>Advanced analytics & priority support</p>
                </div>
              </div>

              <Button asChild className="w-full bg-primary hover:bg-primary/90 h-9 lg:h-10 text-sm">
                <Link href="/signup?type=influencer&plan=pro">
                  Start Pro Trial
                  <ArrowRight className="ml-2 h-3 w-3 lg:h-4 lg:w-4" />
                </Link>
              </Button>
            </Card>
          </div>

          <div className="text-center mt-6 lg:mt-8">
            <Link href="/pricing" className="text-xs lg:text-sm text-secondary hover:underline">
              View detailed pricing comparison →
            </Link>
          </div>
        </div>
      </motion.section>

      {/* Protected Payments */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeInUp}
        className="py-20 px-4"
      >
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              Secure & Reliable
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Your Money is Protected
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Every payment is secured through escrow with automatic milestone-based releases
            </p>
          </div>

          <div className="flex overflow-x-auto gap-4 pb-4 md:grid md:grid-cols-2 md:gap-8 md:overflow-visible snap-x snap-mandatory md:snap-none mb-8 lg:mb-12">
            {/* Escrow Protection */}
            <Card className="p-5 lg:p-8 bg-gradient-to-br from-primary/5 to-transparent border-primary/20 min-w-[300px] md:min-w-0 snap-center">
              <div className="flex items-center gap-2 lg:gap-3 mb-4 lg:mb-6">
                <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Shield className="h-5 w-5 lg:h-6 lg:w-6 text-primary" />
                </div>
                <h3 className="text-lg lg:text-2xl font-bold">Escrow Protection</h3>
              </div>

              <div className="space-y-2 lg:space-y-4">
                <div className="flex items-start gap-2 lg:gap-3">
                  <CheckCircle2 className="h-4 w-4 lg:h-5 lg:w-5 text-primary shrink-0 mt-0.5 lg:mt-1" />
                  <p className="text-xs lg:text-base text-muted-foreground">Funds secured before you start work</p>
                </div>
                <div className="flex items-start gap-2 lg:gap-3">
                  <CheckCircle2 className="h-4 w-4 lg:h-5 lg:w-5 text-primary shrink-0 mt-0.5 lg:mt-1" />
                  <p className="text-xs lg:text-base text-muted-foreground">Automatic payment release on completion</p>
                </div>
                <div className="flex items-start gap-2 lg:gap-3">
                  <CheckCircle2 className="h-4 w-4 lg:h-5 lg:w-5 text-primary shrink-0 mt-0.5 lg:mt-1" />
                  <p className="text-xs lg:text-base text-muted-foreground">Fair dispute resolution included</p>
                </div>
                <div className="flex items-start gap-2 lg:gap-3">
                  <CheckCircle2 className="h-4 w-4 lg:h-5 lg:w-5 text-primary shrink-0 mt-0.5 lg:mt-1" />
                  <p className="text-xs lg:text-base text-muted-foreground">Full payment transparency</p>
                </div>
              </div>
            </Card>

            {/* Milestone Payments */}
            <Card className="p-5 lg:p-8 bg-gradient-to-br from-secondary/5 to-transparent border-secondary/20 min-w-[300px] md:min-w-0 snap-center">
              <div className="flex items-center gap-2 lg:gap-3 mb-4 lg:mb-6">
                <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
                  <Wallet className="h-5 w-5 lg:h-6 lg:w-6 text-secondary" />
                </div>
                <h3 className="text-lg lg:text-2xl font-bold">Milestone Payments</h3>
              </div>

              <div className="space-y-2 lg:space-y-4">
                <div className="flex items-start gap-2 lg:gap-3">
                  <CheckCircle2 className="h-4 w-4 lg:h-5 lg:w-5 text-secondary shrink-0 mt-0.5 lg:mt-1" />
                  <p className="text-xs lg:text-base text-muted-foreground">Get paid as you complete work</p>
                </div>
                <div className="flex items-start gap-2 lg:gap-3">
                  <CheckCircle2 className="h-4 w-4 lg:h-5 lg:w-5 text-secondary shrink-0 mt-0.5 lg:mt-1" />
                  <p className="text-xs lg:text-base text-muted-foreground">Clear deliverables at each stage</p>
                </div>
                <div className="flex items-start gap-2 lg:gap-3">
                  <CheckCircle2 className="h-4 w-4 lg:h-5 lg:w-5 text-secondary shrink-0 mt-0.5 lg:mt-1" />
                  <p className="text-xs lg:text-base text-muted-foreground">Automated payment processing</p>
                </div>
                <div className="flex items-start gap-2 lg:gap-3">
                  <CheckCircle2 className="h-4 w-4 lg:h-5 lg:w-5 text-secondary shrink-0 mt-0.5 lg:mt-1" />
                  <p className="text-xs lg:text-base text-muted-foreground">Faster payout for Pro members</p>
                </div>
              </div>
            </Card>
          </div>

          {/* CTA */}
          <div className="text-center">
            <Button asChild size="lg" className="w-full sm:w-64 bg-secondary/10 hover:bg-secondary/15 backdrop-blur-sm border-2 border-secondary/30 h-14 text-base transition-all rounded-xl px-8">
              <Link href="/signup?type=influencer" className="flex items-center justify-center">
                <span className="bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent font-medium">Join Now</span>
                <ArrowRight className="ml-2 h-5 w-5 text-secondary" />
              </Link>
            </Button>
          </div>
        </div>
      </motion.section>

      {/* How Withdrawals Work */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeInUp}
        className="py-12 sm:py-16 bg-muted/30"
      >
        <div className="container px-6 lg:px-8 max-w-4xl mx-auto">
          <div className="text-center mb-8 md:mb-10">
            <Badge className="mb-4 bg-secondary/10 text-secondary border-secondary/20">
              <Flame className="h-3 w-3 mr-1 inline" />
              Launch Pricing - 3% Only
            </Badge>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
              How Withdrawals Work
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              Industry-low 3% fee on withdrawals. Lock this rate forever by leaving feedback after your first payout.
            </p>
          </div>

          <Card className="p-6 md:p-8 bg-gradient-to-br from-secondary/5 via-background to-primary/5 border-2 border-secondary/20">
            <div className="space-y-6">
              {/* Service Fee Info */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0">
                  <DollarSign className="h-6 w-6 text-secondary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-baseline gap-3 mb-2">
                    <h3 className="text-lg font-semibold">3% Withdrawal Fee</h3>
                    <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 text-xs">
                      Launch Offer
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Applied only when you withdraw earnings. Covers secure crypto payouts, blockchain gas fees,
                    KYC/AML compliance, and instant processing.
                  </p>
                  <div className="bg-muted/50 p-3 rounded-lg mb-3">
                    <p className="text-sm">
                      <span className="font-medium">Example:</span> Withdraw $1,000 → 3% fee ($30) → Receive $970 USDC
                    </p>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-muted-foreground bg-secondary/5 p-3 rounded-lg">
                    <Crown className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                    <p>
                      <span className="font-semibold text-foreground">Founding Members:</span> Complete your first withdrawal
                      and leave feedback to lock 3% forever. Standard rate increases to 6% after launch month.
                    </p>
                  </div>
                </div>
              </div>

              {/* What's Included */}
              <div className="pt-4 border-t">
                <h4 className="text-base font-semibold mb-4">What's Included in Withdrawal Fee:</h4>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                    <span className="text-sm">Instant crypto payouts</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                    <span className="text-sm">All gas fees covered</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                    <span className="text-sm">KYC/AML verification</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                    <span className="text-sm">Multi-chain support</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                    <span className="text-sm">Transaction security</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                    <span className="text-sm">24/7 support</span>
                  </div>
                </div>
              </div>

              {/* Benefits */}
              <div className="pt-4 border-t bg-gradient-to-r from-secondary/5 to-transparent -mx-6 md:-mx-8 px-6 md:px-8 py-4 rounded-b-lg">
                <div className="flex items-start gap-3">
                  <Sparkles className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium mb-1">Fastest payouts in the industry</p>
                    <p className="text-xs text-muted-foreground">
                      Request withdrawal → Processed in 24-48 hours → Crypto arrives in minutes after approval.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
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
