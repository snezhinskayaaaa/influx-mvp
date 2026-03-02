"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navigation } from "@/components/navigation";
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
        className="pt-32 pb-16 sm:pt-40 sm:pb-20 bg-gradient-to-b from-background to-muted/30"
      >
        <div className="container px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/30">
              Simple, Transparent Pricing
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl mb-6">
              Choose your plan
            </h1>
            <p className="text-lg text-muted-foreground sm:text-xl max-w-3xl mx-auto mb-10">
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {/* FREE */}
              <motion.div variants={fadeInUp}>
                <Card className="p-8 bg-muted/30 border-2 border-border hover:border-primary/50 transition-all h-full flex flex-col">
                  <div className="mb-6">
                    <Sparkles className="h-10 w-10 text-primary mb-4" />
                    <h3 className="text-2xl font-bold mb-2">FREE</h3>
                    <div className="flex items-baseline gap-1 mb-4">
                      <span className="text-4xl font-bold">$0</span>
                      <span className="text-muted-foreground">/month</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Start monetizing your AI influence
                    </p>
                  </div>

                  <div className="space-y-3 mb-8 flex-1">
                    <div className="flex items-start gap-3">
                      <Badge className="bg-destructive/10 text-destructive border-destructive/30 mt-0.5">
                        20% fee
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        on all campaigns
                      </span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm">Unlimited campaign applications</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm">Basic profile & analytics</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm">Community support</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm">Campaign management tools</span>
                    </div>
                  </div>

                  <Button asChild variant="outline" className="w-full">
                    <Link href="/signup?type=creator&plan=free">
                      Get Started Free
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </Card>
              </motion.div>

              {/* PRO */}
              <motion.div variants={fadeInUp}>
                <Card className="p-8 bg-gradient-to-br from-primary/5 to-primary/10 border-2 border-primary/50 hover:border-primary transition-all relative h-full flex flex-col">
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">
                    Most Popular
                  </Badge>

                  <div className="mb-6">
                    <Award className="h-10 w-10 text-primary mb-4" />
                    <h3 className="text-2xl font-bold mb-2">CREATOR PRO</h3>
                    <div className="flex items-baseline gap-1 mb-2">
                      <span className="text-4xl font-bold">$49</span>
                      <span className="text-muted-foreground">/month</span>
                    </div>
                    <Badge className="bg-secondary/20 text-secondary border-secondary/30 mb-4">
                      First month $1
                    </Badge>
                    <p className="text-sm text-muted-foreground">
                      Level up your earnings
                    </p>
                  </div>

                  <div className="space-y-3 mb-8 flex-1">
                    <div className="flex items-start gap-3">
                      <Badge className="bg-primary/20 text-primary border-primary/30 mt-0.5">
                        15% fee
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        save 5% per campaign
                      </span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm font-medium">Priority placement in search</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm font-medium">Verified badge</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm">Advanced analytics dashboard</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm">Enhanced profile features</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm">Email support</span>
                    </div>
                  </div>

                  <Button asChild className="w-full">
                    <Link href="/signup?type=creator&plan=pro">
                      Start Pro Trial
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </Card>
              </motion.div>

              {/* ELITE */}
              <motion.div variants={fadeInUp}>
                <Card className="p-8 bg-gradient-to-br from-secondary/5 to-success/10 border-2 border-secondary/50 hover:border-secondary transition-all h-full flex flex-col">
                  <div className="mb-6">
                    <Crown className="h-10 w-10 text-secondary mb-4" />
                    <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
                      CREATOR ELITE
                      <Sparkles className="h-5 w-5 text-secondary" />
                    </h3>
                    <div className="flex items-baseline gap-1 mb-2">
                      <span className="text-4xl font-bold">$149</span>
                      <span className="text-muted-foreground">/month</span>
                    </div>
                    <Badge className="bg-success/20 text-success border-success/30 mb-4">
                      First month $9
                    </Badge>
                    <p className="text-sm text-muted-foreground">
                      Maximize your potential
                    </p>
                  </div>

                  <div className="space-y-3 mb-8 flex-1">
                    <div className="flex items-start gap-3">
                      <Badge className="bg-secondary/20 text-secondary border-secondary/30 mt-0.5">
                        10% fee
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        save 10% per campaign
                      </span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                      <span className="text-sm font-medium">Top priority placement</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                      <span className="text-sm font-medium">"Top Creator" badge ⭐</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                      <span className="text-sm font-medium">Featured on homepage</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                      <span className="text-sm">Early access to premium campaigns</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                      <span className="text-sm">Dedicated account manager</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                      <span className="text-sm">Custom analytics reports</span>
                    </div>
                  </div>

                  <Button asChild variant="outline" className="w-full border-secondary/50 text-secondary hover:bg-secondary/10">
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              {/* FREE - Pay per Performance */}
              <motion.div variants={fadeInUp}>
                <Card className="p-8 bg-muted/30 border-2 border-border hover:border-primary/50 transition-all h-full flex flex-col">
                  <div className="mb-6">
                    <Building2 className="h-10 w-10 text-primary mb-4" />
                    <h3 className="text-2xl font-bold mb-2">Pay-per-Performance</h3>
                    <div className="flex items-baseline gap-1 mb-4">
                      <span className="text-4xl font-bold">$0</span>
                      <span className="text-muted-foreground">/month</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Pay only for results you get
                    </p>
                  </div>

                  <div className="space-y-4 mb-8 flex-1">
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <div className="space-y-2 text-sm">
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

                    <div className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm">Access to all AI influencers</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm">Basic analytics dashboard</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm">Campaign management</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm">Email support</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm">Min. campaign: $100</span>
                    </div>
                  </div>

                  <Button asChild variant="outline" className="w-full">
                    <Link href="/signup?type=brand&plan=free">
                      Get Started Free
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </Card>
              </motion.div>

              {/* BRAND PRO */}
              <motion.div variants={fadeInUp}>
                <Card className="p-8 bg-gradient-to-br from-primary/5 to-primary/10 border-2 border-primary/50 hover:border-primary transition-all relative h-full flex flex-col">
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">
                    Recommended
                  </Badge>

                  <div className="mb-6">
                    <TrendingUp className="h-10 w-10 text-primary mb-4" />
                    <h3 className="text-2xl font-bold mb-2">BRAND PRO</h3>
                    <div className="flex items-baseline gap-1 mb-2">
                      <span className="text-4xl font-bold">$199</span>
                      <span className="text-muted-foreground">/month</span>
                    </div>
                    <Badge className="bg-secondary/20 text-secondary border-secondary/30 mb-4">
                      14 days free trial
                    </Badge>
                    <p className="text-sm text-muted-foreground">
                      Maximize your campaign ROI
                    </p>
                  </div>

                  <div className="space-y-3 mb-8 flex-1">
                    <div className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm font-medium">Priority campaign placement</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm font-medium">Advanced analytics dashboard</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm font-medium">Campaign performance insights</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm">Competitor benchmarking</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm">Faster matching with top creators</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm">Priority support</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm">Better CPM rates</span>
                    </div>
                  </div>

                  <Button asChild className="w-full">
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
          className="py-16 sm:py-20 bg-muted/30"
        >
          <div className="container px-6 lg:px-8 max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <Calculator className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Calculate your savings
              </h2>
              <p className="text-lg text-muted-foreground">
                See how much you'll save with Creator Pro or Elite
              </p>
            </div>

            <Card className="p-8 bg-background border-2">
              <div className="space-y-6 mb-8">
                <div>
                  <label className="block text-sm font-medium mb-3">
                    Monthly campaigns: {calculatorDeals}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    value={calculatorDeals}
                    onChange={(e) => setCalculatorDeals(Number(e.target.value))}
                    className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-3">
                    Average deal size: ${calculatorAvgDeal}
                  </label>
                  <input
                    type="range"
                    min="100"
                    max="5000"
                    step="100"
                    value={calculatorAvgDeal}
                    onChange={(e) => setCalculatorAvgDeal(Number(e.target.value))}
                    className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-muted/50 p-6 rounded-lg border border-border">
                  <div className="text-sm text-muted-foreground mb-2">FREE Plan</div>
                  <div className="text-2xl font-bold text-destructive mb-1">
                    ${freeFee.toFixed(0)}
                  </div>
                  <div className="text-xs text-muted-foreground">fees per month</div>
                </div>

                <div className="bg-primary/5 p-6 rounded-lg border-2 border-primary/50">
                  <div className="text-sm text-muted-foreground mb-2">PRO Plan</div>
                  <div className="text-2xl font-bold text-primary mb-1">
                    ${proFee.toFixed(0)}
                  </div>
                  <div className="text-xs text-secondary font-medium">
                    SAVE ${(freeFee - proFee).toFixed(0)}/month 🎉
                  </div>
                </div>

                <div className="bg-secondary/5 p-6 rounded-lg border-2 border-secondary/50">
                  <div className="text-sm text-muted-foreground mb-2">ELITE Plan</div>
                  <div className="text-2xl font-bold text-secondary mb-1">
                    ${eliteFee.toFixed(0)}
                  </div>
                  <div className="text-xs text-success font-medium">
                    SAVE ${(freeFee - eliteFee).toFixed(0)}/month 💰
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-primary/10 border border-primary/30 rounded-lg">
                <p className="text-sm text-center">
                  {proFee < freeFee && (
                    <>
                      <span className="font-medium text-primary">Pro pays for itself</span> after{" "}
                      {Math.ceil((49 / ((freeFee - proFee + 49) / calculatorDeals)))}{" "}
                      campaigns!
                    </>
                  )}
                  {eliteFee < freeFee && (
                    <>
                      {" "}
                      <span className="font-medium text-secondary">Elite pays for itself</span>{" "}
                      after {Math.ceil((149 / ((freeFee - eliteFee + 149) / calculatorDeals)))}{" "}
                      campaigns!
                    </>
                  )}
                </p>
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
        className="py-16 sm:py-20 bg-background"
      >
        <div className="container px-6 lg:px-8 max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <Gift className="h-12 w-12 text-primary mx-auto mb-4" />
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Referral Program
            </h2>
            <p className="text-lg text-muted-foreground">
              Earn rewards by inviting others to Influx
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-8 bg-gradient-to-br from-primary/5 to-primary/10 border-2 border-primary/30">
              <h3 className="text-xl font-bold mb-4">For Creators</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                    <Check className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">Refer a Brand</div>
                    <div className="text-sm text-muted-foreground">
                      Get <span className="text-primary font-medium">10%</span> from their first campaign
                    </div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                    <Check className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">Refer a Creator</div>
                    <div className="text-sm text-muted-foreground">
                      Both get <span className="text-primary font-medium">1 month PRO free</span> or $25 credit
                    </div>
                  </div>
                </li>
              </ul>
            </Card>

            <Card className="p-8 bg-gradient-to-br from-secondary/5 to-secondary/10 border-2 border-secondary/30">
              <h3 className="text-xl font-bold mb-4">For Brands</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center shrink-0">
                    <Check className="h-4 w-4 text-secondary" />
                  </div>
                  <div>
                    <div className="font-medium">Refer a Brand</div>
                    <div className="text-sm text-muted-foreground">
                      Get <span className="text-secondary font-medium">1 month Brand Pro free</span> or $100 credit
                    </div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center shrink-0">
                    <Check className="h-4 w-4 text-secondary" />
                  </div>
                  <div>
                    <div className="font-medium">Refer a Creator</div>
                    <div className="text-sm text-muted-foreground">
                      Get <span className="text-secondary font-medium">$50 campaign credit</span> + 5% discount on first campaign
                    </div>
                  </div>
                </li>
              </ul>
            </Card>
          </div>

          <div className="mt-8 text-center">
            <Button asChild size="lg" className="gap-2">
              <Link href="/referral">
                <Gift className="h-5 w-5" />
                Get Your Referral Link
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

          <div className="space-y-4">
            <Card className="p-6 bg-background border">
              <h3 className="font-semibold mb-2">What is the minimum campaign budget?</h3>
              <p className="text-sm text-muted-foreground">
                The minimum campaign budget is $100 to ensure quality collaborations and fair compensation for creators.
              </p>
            </Card>

            <Card className="p-6 bg-background border">
              <h3 className="font-semibold mb-2">Can I cancel my subscription anytime?</h3>
              <p className="text-sm text-muted-foreground">
                Yes! You can cancel your subscription at any time. Your benefits will continue until the end of your current billing period.
              </p>
            </Card>

            <Card className="p-6 bg-background border">
              <h3 className="font-semibold mb-2">How do trial periods work?</h3>
              <p className="text-sm text-muted-foreground">
                Brands get a 14-day free trial of Brand Pro. Creators can try Pro for $1 or Elite for $9 for the first month. No credit card required for brand trials.
              </p>
            </Card>

            <Card className="p-6 bg-background border">
              <h3 className="font-semibold mb-2">What payment methods do you accept?</h3>
              <p className="text-sm text-muted-foreground">
                We accept all major credit cards, debit cards, and support secure payment processing through our escrow system.
              </p>
            </Card>

            <Card className="p-6 bg-background border">
              <h3 className="font-semibold mb-2">How does the escrow system protect me?</h3>
              <p className="text-sm text-muted-foreground">
                Funds are held securely until campaign milestones are met. Brands are protected until content is delivered, and creators are guaranteed payment upon completion.
              </p>
            </Card>

            <Card className="p-6 bg-background border">
              <h3 className="font-semibold mb-2">Can I upgrade or downgrade my plan?</h3>
              <p className="text-sm text-muted-foreground">
                Yes! You can change your plan at any time. Upgrades take effect immediately, while downgrades take effect at the end of your current billing period.
              </p>
            </Card>
          </div>
        </div>
      </motion.section>

      {/* CTA */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
        className="py-16 sm:py-20 bg-background"
      >
        <div className="container px-6 lg:px-8 max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Ready to get started?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of brands and creators already using Influx
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="gap-2">
              <Link href="/signup?type=creator">
                <Sparkles className="h-5 w-5" />
                Start as Creator
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="gap-2">
              <Link href="/signup?type=brand">
                <Building2 className="h-5 w-5" />
                Start as Brand
              </Link>
            </Button>
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="border-t bg-muted/50">
        <div className="container px-6 lg:px-8 py-12">
          <div className="text-center text-sm text-muted-foreground">
            <p>&copy; 2026 Influx.Connect. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
