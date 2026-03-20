"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navigation } from "@/components/navigation";
import { NetworkLogo } from "@/components/logo";
import { CountdownTimer } from "@/components/countdown-timer";
import { motion } from "framer-motion";
import {
  Check,
  ArrowRight,
  Sparkles,
  Building2,
  TrendingUp,
  Award,
  ChevronDown,
  Mail,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  DollarSign,
  Crown,
  Flame,
  Clock,
  MessageSquare,
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

export default function PricingPage() {
  const [userType, setUserType] = useState<"brands" | "creators">("brands");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

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
            {/* Glassmorphic Card */}
            <div className="max-w-2xl mx-auto bg-gradient-to-br from-primary/5 via-background/50 to-secondary/5 backdrop-blur-xl border-2 border-primary/20 rounded-2xl sm:rounded-3xl p-6 sm:p-12 shadow-2xl">
              <Badge className="mb-4 sm:mb-6 bg-primary/10 text-primary border-primary/30 text-xs sm:text-sm">
                Simple, Transparent Pricing
              </Badge>
              <h1 className="text-3xl font-bold tracking-tight sm:text-5xl lg:text-6xl mb-4 sm:mb-6">
                Choose your plan
              </h1>
              <p className="text-base text-muted-foreground sm:text-xl max-w-xl mx-auto mb-6 sm:mb-10">
                Whether you're a brand looking for AI talent or a creator ready to monetize, we have the perfect plan for you.
              </p>

              {/* Toggle */}
              <div className="inline-flex items-center p-1 bg-muted rounded-full border border-border">
                <button
                  onClick={() => setUserType("brands")}
                  className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
                    userType === "brands"
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  For Brands
                </button>
                <button
                  onClick={() => setUserType("creators")}
                  className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
                    userType === "creators"
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  For Creators
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Founding Members Program - Limited Time Offer */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="py-12 sm:py-16 bg-gradient-to-b from-primary/5 via-background to-background relative overflow-hidden"
      >
        {/* Background decorative elements */}
        <div className="absolute inset-0 bg-grid-white/5 [mask-image:radial-gradient(white,transparent_85%)]" />

        <div className="container px-6 lg:px-8 max-w-6xl mx-auto relative z-10">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-2 border-amber-500/30 mb-4">
              <Flame className="h-4 w-4 text-amber-500" />
              <span className="text-sm font-semibold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                LIMITED TIME OFFER
              </span>
              <Flame className="h-4 w-4 text-amber-500" />
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-primary via-amber-500 to-secondary bg-clip-text text-transparent">
                Founding Members Program
              </span>
            </h2>

            <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto mb-6">
              Join in the first month and lock in the lowest rates forever
            </p>

            {/* Countdown Timer */}
            <CountdownTimer />
          </div>

          {/* Main Offer Card */}
          <Card className="p-6 sm:p-8 lg:p-10 bg-gradient-to-br from-primary/10 via-background to-secondary/10 backdrop-blur-xl border-2 border-primary/30 shadow-2xl mb-8">
            <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
              {/* For Brands */}
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center shrink-0">
                    <Building2 className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">For Brands</h3>
                    <p className="text-sm text-muted-foreground">Launch pricing for early adopters</p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-primary/5 to-transparent p-6 rounded-2xl border border-primary/20">
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-4xl font-bold text-primary">2%</span>
                    <span className="text-lg text-muted-foreground">on deposit</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Add $1,000 → Get $980 campaign budget
                  </p>
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary" />
                    <span className="text-muted-foreground">vs. 4% standard rate (coming soon)</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Crown className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Founding Member Status</p>
                      <p className="text-xs text-muted-foreground">Leave feedback → Lock 2% rate forever</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Award className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Early Adopter Badge</p>
                      <p className="text-xs text-muted-foreground">Without feedback → Badge only (rates increase to 4%)</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* For Creators */}
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-secondary/20 to-secondary/10 flex items-center justify-center shrink-0">
                    <Sparkles className="h-6 w-6 text-secondary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">For Creators</h3>
                    <p className="text-sm text-muted-foreground">Best rates in the industry</p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-secondary/5 to-transparent p-6 rounded-2xl border border-secondary/20">
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-4xl font-bold text-secondary">3%</span>
                    <span className="text-lg text-muted-foreground">on withdrawal</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Earn $1,000 → Receive $970 (includes gas fees)
                  </p>
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-secondary" />
                    <span className="text-muted-foreground">vs. 6% standard rate (coming soon)</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Crown className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Founding Member Status</p>
                      <p className="text-xs text-muted-foreground">Leave feedback → Lock 3% rate forever</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Award className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Early Adopter Badge</p>
                      <p className="text-xs text-muted-foreground">Without feedback → Badge only (rates increase to 6%)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* How to Qualify */}
            <div className="mt-8 pt-8 border-t border-border/50">
              <div className="flex items-start gap-4 mb-6">
                <MessageSquare className="h-6 w-6 text-primary shrink-0" />
                <div>
                  <h4 className="font-semibold mb-2">How to Become a Founding Member</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Complete your first transaction (campaign for brands, withdrawal for creators) within the first month and leave honest feedback. Your rates will be locked forever at 2%/3%.
                  </p>
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <div className="bg-muted/30 p-4 rounded-xl border border-border/50">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary mb-3">1</div>
                  <p className="text-sm font-medium mb-1">Sign up in month 1</p>
                  <p className="text-xs text-muted-foreground">Join during launch period</p>
                </div>
                <div className="bg-muted/30 p-4 rounded-xl border border-border/50">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary mb-3">2</div>
                  <p className="text-sm font-medium mb-1">Complete first transaction</p>
                  <p className="text-xs text-muted-foreground">Campaign or withdrawal</p>
                </div>
                <div className="bg-muted/30 p-4 rounded-xl border border-border/50">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-sm font-bold text-amber-500 mb-3">3</div>
                  <p className="text-sm font-medium mb-1">Leave feedback</p>
                  <p className="text-xs text-muted-foreground">Lock your rates forever</p>
                </div>
              </div>
            </div>

            {/* Total Comparison */}
            <div className="mt-8 p-6 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5 rounded-2xl border border-primary/20">
              <div className="text-center mb-4">
                <Badge className="bg-primary/10 text-primary border-primary/20 mb-2">
                  Total Platform Fee
                </Badge>
                <p className="text-sm text-muted-foreground">End-to-end transaction cost</p>
              </div>
              <div className="flex items-center justify-center gap-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-1">5%</div>
                  <div className="text-xs text-muted-foreground">Founding Members</div>
                  <div className="text-xs font-medium text-primary">(2% + 3%)</div>
                </div>
                <div className="text-2xl text-muted-foreground">→</div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-muted-foreground mb-1">10%</div>
                  <div className="text-xs text-muted-foreground">Standard Rate</div>
                  <div className="text-xs font-medium text-muted-foreground">(4% + 6%)</div>
                </div>
              </div>
              <p className="text-center text-xs text-muted-foreground mt-4">
                Save <span className="font-bold text-primary">5% on every transaction</span> as a Founding Member
              </p>
            </div>
          </Card>

          {/* CTA */}
          <div className="text-center">
            <Button asChild size="lg" className="bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90 transition-all h-14 text-base px-10 rounded-2xl shadow-xl">
              <Link href="/signup">
                <Crown className="mr-2 h-5 w-5" />
                Join as Founding Member
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <p className="text-xs text-muted-foreground mt-4">
              Only available for the first month • No credit card required
            </p>
          </div>
        </div>
      </motion.section>

      {/* Pricing Cards - Creators */}
      {userType === "creators" && (
        <motion.section
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="py-12 sm:py-16 bg-background"
        >
          <div className="container px-6 lg:px-8 max-w-5xl mx-auto">
            <div className="flex overflow-x-auto gap-4 pb-4 md:grid md:grid-cols-2 md:gap-6 lg:gap-8 md:overflow-visible snap-x snap-mandatory md:snap-none">
              {/* FREE */}
              <motion.div variants={fadeInUp} className="min-w-[300px] md:min-w-0 snap-center">
                <Card className="p-5 md:p-8 bg-gradient-to-br from-muted/80 to-muted/40 backdrop-blur-sm border-2 border-border hover:border-primary/50 transition-all h-full flex flex-col shadow-xl">
                  <div className="mb-5 md:mb-6">
                    <Sparkles className="h-8 w-8 md:h-10 md:w-10 text-primary mb-3 md:mb-4" />
                    <h3 className="text-xl md:text-2xl font-bold mb-2">FREE</h3>
                    <div className="flex items-baseline gap-1 mb-3 md:mb-4">
                      <span className="text-3xl md:text-4xl font-bold">$0</span>
                      <span className="text-sm md:text-base text-muted-foreground">/month</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Start monetizing your AI influence
                    </p>
                  </div>

                  <div className="space-y-2.5 md:space-y-3 mb-5 md:mb-8 flex-1">
                    <div className="flex items-start gap-2.5 md:gap-3">
                      <Check className="h-4 w-4 md:h-5 md:w-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm">Unlimited campaign applications</span>
                    </div>
                    <div className="flex items-start gap-2.5 md:gap-3">
                      <Check className="h-4 w-4 md:h-5 md:w-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm">Basic profile & analytics</span>
                    </div>
                    <div className="flex items-start gap-2.5 md:gap-3">
                      <Check className="h-4 w-4 md:h-5 md:w-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm">Community support</span>
                    </div>
                    <div className="flex items-start gap-2.5 md:gap-3">
                      <Check className="h-4 w-4 md:h-5 md:w-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm">Campaign management tools</span>
                    </div>
                  </div>

                  <Button asChild variant="outline" className="w-full text-sm h-10">
                    <Link href="/signup?type=creator&plan=free">
                      Get Started Free
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </Card>
              </motion.div>

              {/* PRO */}
              <motion.div variants={fadeInUp} className="min-w-[300px] md:min-w-0 snap-center">
                <Card className="p-5 md:p-8 bg-gradient-to-br from-primary/20 to-primary/5 backdrop-blur-sm border-2 border-primary/50 hover:border-primary transition-all relative h-full flex flex-col shadow-2xl pt-6 md:pt-8">
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs">
                    Most Popular
                  </Badge>

                  <div className="mb-5 md:mb-6">
                    <Award className="h-8 w-8 md:h-10 md:w-10 text-primary mb-3 md:mb-4" />
                    <h3 className="text-xl md:text-2xl font-bold mb-2">CREATOR PRO</h3>
                    <div className="flex items-baseline gap-1 mb-2">
                      <span className="text-3xl md:text-4xl font-bold">$49</span>
                      <span className="text-sm md:text-base text-muted-foreground">/month</span>
                    </div>
                    <Badge className="bg-secondary/20 text-secondary border-secondary/30 mb-3 md:mb-4 text-xs">
                      First month $1
                    </Badge>
                    <p className="text-sm text-muted-foreground">
                      Level up your earnings
                    </p>
                  </div>

                  <div className="space-y-2.5 md:space-y-3 mb-5 md:mb-8 flex-1">
                    <div className="flex items-start gap-2.5 md:gap-3">
                      <Check className="h-4 w-4 md:h-5 md:w-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm font-medium">Priority placement in search</span>
                    </div>
                    <div className="flex items-start gap-2.5 md:gap-3">
                      <Check className="h-4 w-4 md:h-5 md:w-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm font-medium">Verified badge</span>
                    </div>
                    <div className="flex items-start gap-2.5 md:gap-3">
                      <Check className="h-4 w-4 md:h-5 md:w-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm">Advanced analytics dashboard</span>
                    </div>
                    <div className="flex items-start gap-2.5 md:gap-3">
                      <Check className="h-4 w-4 md:h-5 md:w-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm">Enhanced profile features</span>
                    </div>
                    <div className="flex items-start gap-2.5 md:gap-3">
                      <Check className="h-4 w-4 md:h-5 md:w-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm">Priority support</span>
                    </div>
                  </div>

                  <Button asChild className="w-full text-sm h-10">
                    <Link href="/signup?type=creator&plan=pro">
                      Start Pro Trial
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </Card>
              </motion.div>
            </div>
          </div>
        </motion.section>
      )}

      {/* Pricing Cards - Brands */}
      {userType === "brands" && (
        <motion.section
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="py-12 sm:py-16 bg-background"
        >
          <div className="container px-6 lg:px-8 max-w-5xl mx-auto">
            <div className="flex overflow-x-auto gap-4 pb-4 md:grid md:grid-cols-2 md:gap-6 lg:gap-8 md:overflow-visible snap-x snap-mandatory md:snap-none">
              {/* FREE - Pay per Performance */}
              <motion.div variants={fadeInUp} className="min-w-[300px] md:min-w-0 snap-center">
                <Card className="p-5 md:p-8 bg-gradient-to-br from-muted/80 to-muted/40 backdrop-blur-sm border-2 border-border hover:border-primary/50 transition-all h-full flex flex-col shadow-xl">
                  <div className="mb-5 md:mb-6">
                    <Building2 className="h-8 w-8 md:h-10 md:w-10 text-primary mb-3 md:mb-4" />
                    <h3 className="text-xl md:text-2xl font-bold mb-2">Pay-per-Performance</h3>
                    <div className="flex items-baseline gap-1 mb-3 md:mb-4">
                      <span className="text-3xl md:text-4xl font-bold">$0</span>
                      <span className="text-sm md:text-base text-muted-foreground">/month</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Pay only for results you get
                    </p>
                  </div>

                  <div className="space-y-3 md:space-y-4 mb-5 md:mb-8 flex-1">
                    <div className="bg-muted/50 p-3 md:p-4 rounded-lg">
                      <div className="space-y-1.5 md:space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">CPM</span>
                          <span className="font-medium">$8-12</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">CPC</span>
                          <span className="font-medium">$0.70-1.50</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">CPE</span>
                          <span className="font-medium">$0.20-0.80</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5 md:gap-3">
                      <Check className="h-4 w-4 md:h-5 md:w-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm">Access to all AI influencers</span>
                    </div>
                    <div className="flex items-start gap-2.5 md:gap-3">
                      <Check className="h-4 w-4 md:h-5 md:w-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm">Basic analytics dashboard</span>
                    </div>
                    <div className="flex items-start gap-2.5 md:gap-3">
                      <Check className="h-4 w-4 md:h-5 md:w-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm">Campaign management</span>
                    </div>
                    <div className="flex items-start gap-2.5 md:gap-3">
                      <Check className="h-4 w-4 md:h-5 md:w-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm">Email support</span>
                    </div>
                    <div className="flex items-start gap-2.5 md:gap-3">
                      <Check className="h-4 w-4 md:h-5 md:w-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm">Min. campaign: $100</span>
                    </div>
                  </div>

                  <Button asChild variant="outline" className="w-full text-sm h-10">
                    <Link href="/signup?type=brand&plan=free">
                      Get Started Free
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </Card>
              </motion.div>

              {/* BRAND PRO */}
              <motion.div variants={fadeInUp} className="min-w-[300px] md:min-w-0 snap-center">
                <Card className="p-5 md:p-8 bg-gradient-to-br from-primary/20 to-primary/5 backdrop-blur-sm border-2 border-primary/50 hover:border-primary transition-all relative h-full flex flex-col shadow-2xl pt-6 md:pt-8">
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs">
                    Recommended
                  </Badge>

                  <div className="mb-5 md:mb-6">
                    <TrendingUp className="h-8 w-8 md:h-10 md:w-10 text-primary mb-3 md:mb-4" />
                    <h3 className="text-xl md:text-2xl font-bold mb-2">BRAND PRO</h3>
                    <div className="flex items-baseline gap-1 mb-2">
                      <span className="text-3xl md:text-4xl font-bold">$199</span>
                      <span className="text-sm md:text-base text-muted-foreground">/month</span>
                    </div>
                    <Badge className="bg-secondary/20 text-secondary border-secondary/30 mb-3 md:mb-4 text-xs">
                      14 days free trial
                    </Badge>
                    <p className="text-sm text-muted-foreground">
                      Maximize your campaign ROI
                    </p>
                  </div>

                  <div className="space-y-2.5 md:space-y-3 mb-5 md:mb-8 flex-1">
                    <div className="flex items-start gap-2.5 md:gap-3">
                      <Check className="h-4 w-4 md:h-5 md:w-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm font-medium">Priority campaign placement</span>
                    </div>
                    <div className="flex items-start gap-2.5 md:gap-3">
                      <Check className="h-4 w-4 md:h-5 md:w-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm font-medium">Advanced analytics dashboard</span>
                    </div>
                    <div className="flex items-start gap-2.5 md:gap-3">
                      <Check className="h-4 w-4 md:h-5 md:w-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm font-medium">Campaign performance insights</span>
                    </div>
                    <div className="flex items-start gap-2.5 md:gap-3">
                      <Check className="h-4 w-4 md:h-5 md:w-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm">Competitor benchmarking</span>
                    </div>
                    <div className="flex items-start gap-2.5 md:gap-3">
                      <Check className="h-4 w-4 md:h-5 md:w-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm">Faster matching with top creators</span>
                    </div>
                    <div className="flex items-start gap-2.5 md:gap-3">
                      <Check className="h-4 w-4 md:h-5 md:w-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm">Priority support</span>
                    </div>
                    <div className="flex items-start gap-2.5 md:gap-3">
                      <Check className="h-4 w-4 md:h-5 md:w-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm">Better CPM rates</span>
                    </div>
                  </div>

                  <Button asChild className="w-full text-sm h-10">
                    <Link href="/signup?type=brand&plan=pro">
                      Start Pro Trial
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </Card>
              </motion.div>
            </div>
          </div>
        </motion.section>
      )}

      {/* FAQ */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeInUp}
        className="py-16 sm:py-20 bg-muted/30"
      >
        <div className="container px-6 lg:px-8 max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="divide-y divide-border">
            {/* FAQ 1 - Founding Members */}
            <div>
              <button
                onClick={() => setOpenFaq(openFaq === 0 ? null : 0)}
                className="w-full py-4 text-left flex items-center justify-between hover:bg-muted/30 transition-colors"
              >
                <h3 className="font-semibold text-base">What is the Founding Members Program?</h3>
                <ChevronDown
                  className={`h-5 w-5 text-muted-foreground transition-transform shrink-0 ml-4 ${
                    openFaq === 0 ? "rotate-180" : ""
                  }`}
                />
              </button>
              <motion.div
                initial={false}
                animate={{
                  height: openFaq === 0 ? "auto" : 0,
                  opacity: openFaq === 0 ? 1 : 0,
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <p className="pb-4 text-sm text-muted-foreground">
                  Founding Members are our first users who join during the launch month. By completing your first transaction and leaving feedback, you lock in the lowest rates forever (2% for brands, 3% for creators). After the first month, rates increase to 4% and 5% respectively.
                </p>
              </motion.div>
            </div>

            {/* FAQ 2 - How to qualify */}
            <div>
              <button
                onClick={() => setOpenFaq(openFaq === 1 ? null : 1)}
                className="w-full py-4 text-left flex items-center justify-between hover:bg-muted/30 transition-colors"
              >
                <h3 className="font-semibold text-base">How do I qualify for Founding Member status?</h3>
                <ChevronDown
                  className={`h-5 w-5 text-muted-foreground transition-transform shrink-0 ml-4 ${
                    openFaq === 1 ? "rotate-180" : ""
                  }`}
                />
              </button>
              <motion.div
                initial={false}
                animate={{
                  height: openFaq === 1 ? "auto" : 0,
                  opacity: openFaq === 1 ? 1 : 0,
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <p className="pb-4 text-sm text-muted-foreground">
                  Join during the first month, complete your first transaction (campaign deposit for brands, withdrawal for creators), and leave honest feedback about your experience. Your locked rates will apply to all future transactions forever.
                </p>
              </motion.div>
            </div>

            {/* FAQ 3 - Minimum budget */}
            <div>
              <button
                onClick={() => setOpenFaq(openFaq === 2 ? null : 2)}
                className="w-full py-4 text-left flex items-center justify-between hover:bg-muted/30 transition-colors"
              >
                <h3 className="font-semibold text-base">What is the minimum campaign budget?</h3>
                <ChevronDown
                  className={`h-5 w-5 text-muted-foreground transition-transform shrink-0 ml-4 ${
                    openFaq === 2 ? "rotate-180" : ""
                  }`}
                />
              </button>
              <motion.div
                initial={false}
                animate={{
                  height: openFaq === 2 ? "auto" : 0,
                  opacity: openFaq === 2 ? 1 : 0,
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <p className="pb-4 text-sm text-muted-foreground">
                  The minimum campaign budget is $100 to ensure quality collaborations and fair compensation for creators.
                </p>
              </motion.div>
            </div>

            {/* FAQ 4 */}
            <div>
              <button
                onClick={() => setOpenFaq(openFaq === 3 ? null : 3)}
                className="w-full py-4 text-left flex items-center justify-between hover:bg-muted/30 transition-colors"
              >
                <h3 className="font-semibold text-base">Can I cancel my subscription anytime?</h3>
                <ChevronDown
                  className={`h-5 w-5 text-muted-foreground transition-transform shrink-0 ml-4 ${
                    openFaq === 3 ? "rotate-180" : ""
                  }`}
                />
              </button>
              <motion.div
                initial={false}
                animate={{
                  height: openFaq === 3 ? "auto" : 0,
                  opacity: openFaq === 3 ? 1 : 0,
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <p className="pb-4 text-sm text-muted-foreground">
                  Yes! You can cancel your subscription at any time. Your benefits will continue until the end of your current billing period.
                </p>
              </motion.div>
            </div>

            {/* FAQ 5 */}
            <div>
              <button
                onClick={() => setOpenFaq(openFaq === 4 ? null : 4)}
                className="w-full py-4 text-left flex items-center justify-between hover:bg-muted/30 transition-colors"
              >
                <h3 className="font-semibold text-base">How do trial periods work?</h3>
                <ChevronDown
                  className={`h-5 w-5 text-muted-foreground transition-transform shrink-0 ml-4 ${
                    openFaq === 4 ? "rotate-180" : ""
                  }`}
                />
              </button>
              <motion.div
                initial={false}
                animate={{
                  height: openFaq === 4 ? "auto" : 0,
                  opacity: openFaq === 4 ? 1 : 0,
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <p className="pb-4 text-sm text-muted-foreground">
                  Brands get a 14-day free trial of Brand Pro. Creators can try Pro for $1 for the first month. No credit card required for brand trials.
                </p>
              </motion.div>
            </div>

            {/* FAQ 6 */}
            <div>
              <button
                onClick={() => setOpenFaq(openFaq === 5 ? null : 5)}
                className="w-full py-4 text-left flex items-center justify-between hover:bg-muted/30 transition-colors"
              >
                <h3 className="font-semibold text-base">What payment methods do you accept?</h3>
                <ChevronDown
                  className={`h-5 w-5 text-muted-foreground transition-transform shrink-0 ml-4 ${
                    openFaq === 5 ? "rotate-180" : ""
                  }`}
                />
              </button>
              <motion.div
                initial={false}
                animate={{
                  height: openFaq === 5 ? "auto" : 0,
                  opacity: openFaq === 5 ? 1 : 0,
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <p className="pb-4 text-sm text-muted-foreground">
                  We accept cryptocurrency (USDC, USDT) via secure crypto payment processing. All transactions are protected through our escrow system.
                </p>
              </motion.div>
            </div>

            {/* FAQ 7 */}
            <div>
              <button
                onClick={() => setOpenFaq(openFaq === 6 ? null : 6)}
                className="w-full py-4 text-left flex items-center justify-between hover:bg-muted/30 transition-colors"
              >
                <h3 className="font-semibold text-base">How does the escrow system protect me?</h3>
                <ChevronDown
                  className={`h-5 w-5 text-muted-foreground transition-transform shrink-0 ml-4 ${
                    openFaq === 6 ? "rotate-180" : ""
                  }`}
                />
              </button>
              <motion.div
                initial={false}
                animate={{
                  height: openFaq === 6 ? "auto" : 0,
                  opacity: openFaq === 6 ? 1 : 0,
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <p className="pb-4 text-sm text-muted-foreground">
                  Funds are held securely until campaign milestones are met. Brands are protected until content is delivered, and creators are guaranteed payment upon completion. Milestone-based releases ensure fair compensation.
                </p>
              </motion.div>
            </div>

            {/* FAQ 8 */}
            <div>
              <button
                onClick={() => setOpenFaq(openFaq === 7 ? null : 7)}
                className="w-full py-4 text-left flex items-center justify-between hover:bg-muted/30 transition-colors"
              >
                <h3 className="font-semibold text-base">Can I upgrade or downgrade my plan?</h3>
                <ChevronDown
                  className={`h-5 w-5 text-muted-foreground transition-transform shrink-0 ml-4 ${
                    openFaq === 7 ? "rotate-180" : ""
                  }`}
                />
              </button>
              <motion.div
                initial={false}
                animate={{
                  height: openFaq === 7 ? "auto" : 0,
                  opacity: openFaq === 7 ? 1 : 0,
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <p className="pb-4 text-sm text-muted-foreground">
                  Yes! You can change your plan at any time. Upgrades take effect immediately, while downgrades take effect at the end of your current billing period.
                </p>
              </motion.div>
            </div>
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
