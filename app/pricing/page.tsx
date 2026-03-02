"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navigation } from "@/components/navigation";
import { NetworkLogo } from "@/components/logo";
import { motion } from "framer-motion";
import {
  Check,
  ArrowRight,
  Sparkles,
  Building2,
  Crown,
  TrendingUp,
  Shield,
  Zap,
  Award,
  Gift,
  Calculator,
  ChevronDown,
  Mail,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
} from "lucide-react";

const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.4, 0.25, 1],
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
  const [userType, setUserType] = useState<"brands" | "creators">("creators");
  const [calculatorDeals, setCalculatorDeals] = useState(5);
  const [calculatorAvgDeal, setCalculatorAvgDeal] = useState(500);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const freeFee = calculatorDeals * calculatorAvgDeal * 0.2;
  const proFee = calculatorDeals * calculatorAvgDeal * 0.15 + 49;
  const eliteFee = calculatorDeals * calculatorAvgDeal * 0.1 + 149;

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
            <div className="max-w-4xl mx-auto bg-gradient-to-br from-primary/5 via-background/50 to-secondary/5 backdrop-blur-xl border-2 border-primary/20 rounded-2xl sm:rounded-3xl p-6 sm:p-12 shadow-2xl">
              <Badge className="mb-4 sm:mb-6 bg-primary/10 text-primary border-primary/30 text-xs sm:text-sm">
                Simple, Transparent Pricing
              </Badge>
              <h1 className="text-3xl font-bold tracking-tight sm:text-5xl lg:text-6xl mb-4 sm:mb-6">
                Choose your plan
              </h1>
              <p className="text-base text-muted-foreground sm:text-xl max-w-3xl mx-auto mb-6 sm:mb-10">
                Whether you're a brand looking for AI talent or a creator ready to monetize, we have the perfect plan for you.
              </p>

              {/* Toggle */}
              <div className="inline-flex items-center p-1 bg-muted rounded-full border border-border">
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
              </div>
            </div>
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
          <div className="container px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="flex overflow-x-auto gap-4 pb-4 md:grid md:grid-cols-3 md:gap-6 lg:gap-8 md:overflow-visible snap-x snap-mandatory md:snap-none">
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
                      <Badge className="bg-muted-foreground/20 text-muted-foreground border-muted-foreground/30 mt-0.5 text-xs">
                        20% fee
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        on all campaigns
                      </span>
                    </div>
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
                      <Badge className="bg-primary/20 text-primary border-primary/30 mt-0.5 text-xs">
                        15% fee
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        save 5% per campaign
                      </span>
                    </div>
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
                      <span className="text-sm">Email support</span>
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

              {/* ELITE */}
              <motion.div variants={fadeInUp} className="min-w-[300px] md:min-w-0 snap-center">
                <Card className="p-5 md:p-8 bg-gradient-to-br from-secondary/20 to-success/10 backdrop-blur-sm border-2 border-secondary/50 hover:border-secondary transition-all h-full flex flex-col shadow-2xl">
                  <div className="mb-5 md:mb-6">
                    <Crown className="h-8 w-8 md:h-10 md:w-10 text-secondary mb-3 md:mb-4" />
                    <h3 className="text-xl md:text-2xl font-bold mb-2 flex items-center gap-2">
                      CREATOR ELITE
                      <Sparkles className="h-4 w-4 md:h-5 md:w-5 text-secondary" />
                    </h3>
                    <div className="flex items-baseline gap-1 mb-2">
                      <span className="text-3xl md:text-4xl font-bold">$149</span>
                      <span className="text-sm md:text-base text-muted-foreground">/month</span>
                    </div>
                    <Badge className="bg-success/20 text-success border-success/30 mb-3 md:mb-4 text-xs">
                      First month $9
                    </Badge>
                    <p className="text-sm text-muted-foreground">
                      Maximize your potential
                    </p>
                  </div>

                  <div className="space-y-2.5 md:space-y-3 mb-5 md:mb-8 flex-1">
                    <div className="flex items-start gap-2.5 md:gap-3">
                      <Badge className="bg-secondary/20 text-secondary border-secondary/30 mt-0.5 text-xs">
                        10% fee
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        save 10% per campaign
                      </span>
                    </div>
                    <div className="flex items-start gap-2.5 md:gap-3">
                      <Check className="h-4 w-4 md:h-5 md:w-5 text-secondary shrink-0 mt-0.5" />
                      <span className="text-sm font-medium">Top priority placement</span>
                    </div>
                    <div className="flex items-start gap-2.5 md:gap-3">
                      <Check className="h-4 w-4 md:h-5 md:w-5 text-secondary shrink-0 mt-0.5" />
                      <span className="text-sm font-medium">"Top Creator" badge ⭐</span>
                    </div>
                    <div className="flex items-start gap-2.5 md:gap-3">
                      <Check className="h-4 w-4 md:h-5 md:w-5 text-secondary shrink-0 mt-0.5" />
                      <span className="text-sm font-medium">Featured on homepage</span>
                    </div>
                    <div className="flex items-start gap-2.5 md:gap-3">
                      <Check className="h-4 w-4 md:h-5 md:w-5 text-secondary shrink-0 mt-0.5" />
                      <span className="text-sm">Early access to premium campaigns</span>
                    </div>
                    <div className="flex items-start gap-2.5 md:gap-3">
                      <Check className="h-4 w-4 md:h-5 md:w-5 text-secondary shrink-0 mt-0.5" />
                      <span className="text-sm">Dedicated account manager</span>
                    </div>
                    <div className="flex items-start gap-2.5 md:gap-3">
                      <Check className="h-4 w-4 md:h-5 md:w-5 text-secondary shrink-0 mt-0.5" />
                      <span className="text-sm">Custom analytics reports</span>
                    </div>
                  </div>

                  <Button asChild variant="outline" className="w-full border-secondary/50 text-secondary hover:bg-secondary/10 text-sm h-10">
                    <Link href="/signup?type=creator&plan=elite">
                      Start Elite Trial
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
                          <span className="text-muted-foreground">CPA</span>
                          <span className="font-medium">$15-40</span>
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

      {/* Savings Calculator - Creators Only */}
      {userType === "creators" && (
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="py-8 sm:py-12 md:py-16 bg-muted/30"
        >
          <div className="container px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
            <div className="text-center mb-6 sm:mb-8">
              <Calculator className="h-8 w-8 sm:h-12 sm:w-12 text-primary mx-auto mb-2 sm:mb-4" />
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-4">
                Calculate your savings
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-muted-foreground">
                See how much you'll save with Creator Pro or Elite
              </p>
            </div>

            <Card className="p-4 sm:p-6 md:p-8 bg-gradient-to-br from-background via-muted/5 to-background backdrop-blur-sm border-2 border-primary/10 shadow-xl">
              <div className="space-y-4 sm:space-y-6 mb-6 sm:mb-8">
                <div className="bg-muted/30 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-border/50">
                  <div className="flex items-center justify-between mb-2 sm:mb-3">
                    <label className="text-xs sm:text-sm font-semibold">Monthly campaigns</label>
                    <span className="text-lg sm:text-xl font-bold text-primary">{calculatorDeals}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    value={calculatorDeals}
                    onChange={(e) => setCalculatorDeals(Number(e.target.value))}
                    className="w-full h-2 sm:h-2.5 bg-gradient-to-r from-muted via-primary/20 to-muted rounded-full appearance-none cursor-pointer accent-primary [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 sm:[&::-webkit-slider-thumb]:w-5 sm:[&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:cursor-pointer"
                  />
                </div>

                <div className="bg-muted/30 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-border/50">
                  <div className="flex items-center justify-between mb-2 sm:mb-3">
                    <label className="text-xs sm:text-sm font-semibold">Average deal size</label>
                    <span className="text-lg sm:text-xl font-bold text-primary">${calculatorAvgDeal}</span>
                  </div>
                  <input
                    type="range"
                    min="100"
                    max="5000"
                    step="100"
                    value={calculatorAvgDeal}
                    onChange={(e) => setCalculatorAvgDeal(Number(e.target.value))}
                    className="w-full h-2 sm:h-2.5 bg-gradient-to-r from-muted via-primary/20 to-muted rounded-full appearance-none cursor-pointer accent-primary [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 sm:[&::-webkit-slider-thumb]:w-5 sm:[&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:cursor-pointer"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
                <div className="relative bg-gradient-to-br from-muted/80 to-muted/40 backdrop-blur-sm p-3 sm:p-5 rounded-lg sm:rounded-xl border-2 border-border shadow-lg transition-all hover:shadow-xl hover:scale-105">
                  <div className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40"></div>
                  </div>
                  <div className="text-[10px] sm:text-xs font-medium text-muted-foreground mb-1 sm:mb-2 uppercase tracking-wider">FREE Plan</div>
                  <div className="text-xl sm:text-2xl font-bold text-foreground mb-0.5 sm:mb-1">
                    ${freeFee.toFixed(0)}
                  </div>
                  <div className="text-[10px] sm:text-xs text-muted-foreground">fees per month</div>
                </div>

                <div className="relative bg-gradient-to-br from-primary/20 to-primary/5 backdrop-blur-sm p-3 sm:p-5 rounded-lg sm:rounded-xl border-2 border-primary/50 shadow-2xl transition-all hover:shadow-2xl hover:scale-105">
                  <div className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
                  </div>
                  <div className="text-[10px] sm:text-xs font-medium text-muted-foreground mb-1 sm:mb-2 uppercase tracking-wider">PRO Plan</div>
                  <div className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-1 sm:mb-2">
                    ${proFee.toFixed(0)}
                  </div>
                  <div className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-0.5 sm:py-1 bg-secondary/20 border border-secondary/30 rounded-full">
                    <TrendingUp className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-secondary" />
                    <span className="text-[10px] sm:text-xs text-secondary font-bold uppercase tracking-wide">
                      SAVE ${(freeFee - proFee).toFixed(0)}/mo
                    </span>
                  </div>
                </div>

                <div className="relative bg-gradient-to-br from-secondary/20 to-success/10 backdrop-blur-sm p-3 sm:p-5 rounded-lg sm:rounded-xl border-2 border-secondary/50 shadow-2xl transition-all hover:shadow-2xl hover:scale-105">
                  <div className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></div>
                  </div>
                  <div className="text-[10px] sm:text-xs font-medium text-muted-foreground mb-1 sm:mb-2 uppercase tracking-wider">ELITE Plan</div>
                  <div className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-secondary to-success bg-clip-text text-transparent mb-1 sm:mb-2">
                    ${eliteFee.toFixed(0)}
                  </div>
                  <div className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-0.5 sm:py-1 bg-success/20 border border-success/30 rounded-full">
                    <Zap className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-success" />
                    <span className="text-[10px] sm:text-xs text-success font-bold uppercase tracking-wide">
                      SAVE ${(freeFee - eliteFee).toFixed(0)}/mo
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 backdrop-blur-sm border-2 border-primary/20 rounded-lg sm:rounded-xl">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 text-[11px] sm:text-xs md:text-sm">
                  {proFee < freeFee && (
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <Shield className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary shrink-0" />
                      <span>
                        <span className="font-bold text-primary">Pro</span> pays for itself after{" "}
                        <span className="font-bold text-primary">
                          {Math.ceil((49 / ((freeFee - proFee + 49) / calculatorDeals)))}
                        </span>{" "}
                        campaigns
                      </span>
                    </div>
                  )}
                  {eliteFee < freeFee && proFee < freeFee && (
                    <div className="hidden sm:block w-px h-4 sm:h-5 bg-border"></div>
                  )}
                  {eliteFee < freeFee && (
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <Award className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-secondary shrink-0" />
                      <span>
                        <span className="font-bold text-secondary">Elite</span> pays for itself after{" "}
                        <span className="font-bold text-secondary">
                          {Math.ceil((149 / ((freeFee - eliteFee + 149) / calculatorDeals)))}
                        </span>{" "}
                        campaigns
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </motion.section>
      )}

      {/* Referral Program */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeInUp}
        className="py-12 sm:py-16 md:py-20 bg-background"
      >
        <div className="container px-6 lg:px-8 max-w-5xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <Gift className="h-10 w-10 md:h-12 md:w-12 text-primary mx-auto mb-3 md:mb-4" />
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 md:mb-4">
              Referral Program
            </h2>
            <p className="text-base md:text-lg text-muted-foreground">
              Earn rewards by inviting others to Influx
            </p>
          </div>

          <div className="flex overflow-x-auto gap-4 pb-4 md:grid md:grid-cols-2 md:gap-6 md:overflow-visible snap-x snap-mandatory md:snap-none">
            <Card className="min-w-[280px] md:min-w-0 snap-center p-6 md:p-8 bg-gradient-to-br from-primary/5 to-primary/10 border-2 border-primary/30">
              <h3 className="text-lg md:text-xl font-bold mb-4">For Creators</h3>
              <ul className="space-y-3 md:space-y-4">
                <li className="flex items-start gap-2 md:gap-3">
                  <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                    <Check className="h-3.5 w-3.5 md:h-4 md:w-4 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm md:text-base font-medium">Refer a Brand</div>
                    <div className="text-xs md:text-sm text-muted-foreground">
                      Get <span className="text-primary font-medium">10%</span> from their first campaign
                    </div>
                  </div>
                </li>
                <li className="flex items-start gap-2 md:gap-3">
                  <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                    <Check className="h-3.5 w-3.5 md:h-4 md:w-4 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm md:text-base font-medium">Refer a Creator</div>
                    <div className="text-xs md:text-sm text-muted-foreground">
                      Both get <span className="text-primary font-medium">1 month PRO free</span> or $25 credit
                    </div>
                  </div>
                </li>
              </ul>
            </Card>

            <Card className="min-w-[280px] md:min-w-0 snap-center p-6 md:p-8 bg-gradient-to-br from-secondary/5 to-secondary/10 border-2 border-secondary/30">
              <h3 className="text-lg md:text-xl font-bold mb-4">For Brands</h3>
              <ul className="space-y-3 md:space-y-4">
                <li className="flex items-start gap-2 md:gap-3">
                  <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-secondary/20 flex items-center justify-center shrink-0">
                    <Check className="h-3.5 w-3.5 md:h-4 md:w-4 text-secondary" />
                  </div>
                  <div>
                    <div className="text-sm md:text-base font-medium">Refer a Brand</div>
                    <div className="text-xs md:text-sm text-muted-foreground">
                      Get <span className="text-secondary font-medium">1 month Brand Pro free</span> or $100 credit
                    </div>
                  </div>
                </li>
                <li className="flex items-start gap-2 md:gap-3">
                  <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-secondary/20 flex items-center justify-center shrink-0">
                    <Check className="h-3.5 w-3.5 md:h-4 md:w-4 text-secondary" />
                  </div>
                  <div>
                    <div className="text-sm md:text-base font-medium">Refer a Creator</div>
                    <div className="text-xs md:text-sm text-muted-foreground">
                      Get <span className="text-secondary font-medium">$50 campaign credit</span> + 5% discount on first campaign
                    </div>
                  </div>
                </li>
              </ul>
            </Card>
          </div>

          <div className="mt-8 text-center">
            <Button asChild size="lg" className="bg-primary/10 hover:bg-primary/15 backdrop-blur-sm border-2 border-primary/30 h-14 text-base transition-all rounded-xl px-8">
              <Link href="/referral" className="flex items-center justify-center">
                <Gift className="h-5 w-5 text-primary mr-2" />
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent font-medium">Get Your Referral Link</span>
              </Link>
            </Button>
          </div>
        </div>
      </motion.section>

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
            {/* FAQ 1 */}
            <div>
              <button
                onClick={() => setOpenFaq(openFaq === 0 ? null : 0)}
                className="w-full py-4 text-left flex items-center justify-between hover:bg-muted/30 transition-colors"
              >
                <h3 className="font-semibold text-base">What is the minimum campaign budget?</h3>
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
                  The minimum campaign budget is $100 to ensure quality collaborations and fair compensation for creators.
                </p>
              </motion.div>
            </div>

            {/* FAQ 2 */}
            <div>
              <button
                onClick={() => setOpenFaq(openFaq === 1 ? null : 1)}
                className="w-full py-4 text-left flex items-center justify-between hover:bg-muted/30 transition-colors"
              >
                <h3 className="font-semibold text-base">Can I cancel my subscription anytime?</h3>
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
                  Yes! You can cancel your subscription at any time. Your benefits will continue until the end of your current billing period.
                </p>
              </motion.div>
            </div>

            {/* FAQ 3 */}
            <div>
              <button
                onClick={() => setOpenFaq(openFaq === 2 ? null : 2)}
                className="w-full py-4 text-left flex items-center justify-between hover:bg-muted/30 transition-colors"
              >
                <h3 className="font-semibold text-base">How do trial periods work?</h3>
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
                  Brands get a 14-day free trial of Brand Pro. Creators can try Pro for $1 or Elite for $9 for the first month. No credit card required for brand trials.
                </p>
              </motion.div>
            </div>

            {/* FAQ 4 */}
            <div>
              <button
                onClick={() => setOpenFaq(openFaq === 3 ? null : 3)}
                className="w-full py-4 text-left flex items-center justify-between hover:bg-muted/30 transition-colors"
              >
                <h3 className="font-semibold text-base">What payment methods do you accept?</h3>
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
                  We accept all major credit cards, debit cards, and support secure payment processing through our escrow system.
                </p>
              </motion.div>
            </div>

            {/* FAQ 5 */}
            <div>
              <button
                onClick={() => setOpenFaq(openFaq === 4 ? null : 4)}
                className="w-full py-4 text-left flex items-center justify-between hover:bg-muted/30 transition-colors"
              >
                <h3 className="font-semibold text-base">How does the escrow system protect me?</h3>
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
                  Funds are held securely until campaign milestones are met. Brands are protected until content is delivered, and creators are guaranteed payment upon completion.
                </p>
              </motion.div>
            </div>

            {/* FAQ 6 */}
            <div>
              <button
                onClick={() => setOpenFaq(openFaq === 5 ? null : 5)}
                className="w-full py-4 text-left flex items-center justify-between hover:bg-muted/30 transition-colors"
              >
                <h3 className="font-semibold text-base">Can I upgrade or downgrade my plan?</h3>
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
