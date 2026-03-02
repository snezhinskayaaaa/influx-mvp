"use client";

import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { NetworkLogo } from "@/components/logo";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Target,
  TrendingUp,
  Zap,
  Sparkles,
  CheckCircle2,
  DollarSign,
  Shield,
  FileText,
  Eye,
  Lock,
  CreditCard,
  ArrowDownCircle,
  CheckSquare,
  Wallet,
  Rocket,
  BarChart3,
  CircleDollarSign,
  MoveRight,
  Building2,
  Mail,
  Instagram,
  Facebook,
  Twitter,
  Linkedin
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
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const influencerProfiles = [
  {
    id: 1,
    name: "Luna AI",
    niche: "Fashion & Lifestyle",
    followers: "250K",
    image: "/influencer-1.png"
  },
  {
    id: 2,
    name: "Ava Digital",
    niche: "Beauty & Wellness",
    followers: "180K",
    image: "/influencer-2.png"
  },
  {
    id: 3,
    name: "Nova Tech",
    niche: "Tech & Gaming",
    followers: "320K",
    image: "/influencer-3.png"
  },
  {
    id: 4,
    name: "Stella Fit",
    niche: "Fitness & Health",
    followers: "195K",
    image: "/influencer-4.png"
  },
  {
    id: 5,
    name: "Maya Vibe",
    niche: "Music & Arts",
    followers: "275K",
    image: "/influencer-5.png"
  },
  {
    id: 6,
    name: "Iris Creative",
    niche: "Design & Creative",
    followers: "210K",
    image: "/influencer-6.png"
  }
];

export default function BrandsPage() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % influencerProfiles.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const getCardPosition = (index: number) => {
    const total = influencerProfiles.length;
    let position = (index - activeIndex + total) % total;

    // Normalize position to be between -total/2 and total/2
    if (position > total / 2) {
      position = position - total;
    }

    const isCenter = position === 0;
    const isAdjacent = Math.abs(position) === 1;
    const distance = Math.abs(position);

    if (isCenter) {
      return {
        zIndex: 50,
        transform: 'translateX(0%) scale(1)',
        opacity: 1,
        pointerEvents: 'auto' as const
      };
    } else if (position === 1) {
      // Right side
      return {
        zIndex: 40,
        transform: 'translateX(70%) scale(0.85)',
        opacity: 0.6,
        pointerEvents: 'none' as const
      };
    } else if (position === -1) {
      // Left side
      return {
        zIndex: 40,
        transform: 'translateX(-70%) scale(0.85)',
        opacity: 0.6,
        pointerEvents: 'none' as const
      };
    } else {
      // Hidden
      return {
        zIndex: 10,
        transform: `translateX(${position > 0 ? '150%' : '-150%'}) scale(0.7)`,
        opacity: 0,
        pointerEvents: 'none' as const
      };
    }
  };

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
              <div className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm mb-6">
                <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
                <span className="text-xs sm:text-sm font-medium text-primary">
                  For Brands & Advertisers
                </span>
              </div>

              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                AI Influencer Hub for Brands
              </h1>

              <p className="mt-6 text-lg text-muted-foreground sm:text-xl leading-relaxed">
                Discover. Connect. Collaborate.
              </p>

              <p className="text-lg text-muted-foreground sm:text-xl leading-relaxed">
                Grow your brand with AI Influencers
              </p>

              <div className="mt-10">
                <Button size="lg" asChild className="w-full sm:w-64 bg-primary/10 hover:bg-primary/15 backdrop-blur-sm border-2 border-primary/30 h-14 text-base transition-all">
                  <Link href="/signup?type=brand" className="flex items-center justify-center">
                    <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent font-medium">Explore Marketplace</span>
                  </Link>
                </Button>
              </div>
            </div>

            {/* Right - Centered Carousel */}
            <div className="relative h-[400px] lg:h-[650px] flex items-center justify-center overflow-hidden py-8">
              <div className="relative w-full h-full flex items-center justify-center">
                {influencerProfiles.map((profile, index) => (
                  <Card
                    key={profile.id}
                    className="absolute w-48 lg:w-72 p-3 lg:p-6 border-2 transition-all duration-700 ease-in-out shadow-xl"
                    style={getCardPosition(index)}
                  >
                    <div className="w-full h-56 lg:h-96 rounded-xl overflow-hidden mb-3 lg:mb-4 bg-muted">
                      <img
                        src={profile.image}
                        alt={profile.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="space-y-1 lg:space-y-2">
                      <h3 className="text-base lg:text-xl font-bold">{profile.name}</h3>
                      <p className="text-xs lg:text-sm text-muted-foreground">{profile.niche}</p>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
                          {profile.followers} followers
                        </Badge>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Navigation Dots */}
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-[60]">
                {influencerProfiles.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === activeIndex
                        ? 'bg-primary w-8'
                        : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Engagement Stats Bar */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeInUp}
        className="py-6 px-4 bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5 border-y border-border/50"
      >
        <div className="container max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-center">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <span className="text-lg sm:text-xl font-bold text-foreground">3x Higher Engagement</span>
            </div>
            <span className="hidden sm:block text-muted-foreground">•</span>
            <p className="text-sm sm:text-base text-muted-foreground">
              Virtual influencers average <span className="font-semibold text-primary">5.9% engagement</span> vs 1.9% for traditional influencers
            </p>
          </div>
        </div>
      </motion.section>

      {/* Value Proposition */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeInUp}
        className="py-20 px-4"
      >
        <div className="container max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              Why Choose Influx
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Built for Results
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The only platform where you pay for actual performance, not promises
            </p>
          </div>

          <div className="flex overflow-x-auto gap-4 pb-4 lg:grid lg:grid-cols-4 lg:gap-6 lg:overflow-visible snap-x snap-mandatory lg:snap-none">
            <Card className="text-center p-4 lg:p-6 border-2 hover:border-primary/40 transition-all hover:shadow-lg min-w-[240px] lg:min-w-0 snap-center">
              <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-3 lg:mb-4">
                <Target className="h-6 w-6 lg:h-8 lg:w-8 text-primary" />
              </div>
              <h3 className="text-base lg:text-xl font-semibold mb-2 lg:mb-3">Precision Targeting</h3>
              <p className="text-muted-foreground text-xs lg:text-sm">
                Find AI influencers whose audience perfectly matches your target demographic
              </p>
            </Card>

            <Card className="text-center p-4 lg:p-6 border-2 hover:border-secondary/40 transition-all hover:shadow-lg min-w-[240px] lg:min-w-0 snap-center">
              <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-2xl bg-secondary/10 flex items-center justify-center mx-auto mb-3 lg:mb-4">
                <TrendingUp className="h-6 w-6 lg:h-8 lg:w-8 text-secondary" />
              </div>
              <h3 className="text-base lg:text-xl font-semibold mb-2 lg:mb-3">Measurable Results</h3>
              <p className="text-muted-foreground text-xs lg:text-sm">
                Track campaign performance with real-time analytics and detailed insights
              </p>
            </Card>

            <Card className="text-center p-4 lg:p-6 border-2 hover:border-success/40 transition-all hover:shadow-lg min-w-[240px] lg:min-w-0 snap-center">
              <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-2xl bg-muted/80 flex items-center justify-center mx-auto mb-3 lg:mb-4">
                <Zap className="h-6 w-6 lg:h-8 lg:w-8 text-foreground" />
              </div>
              <h3 className="text-base lg:text-xl font-semibold mb-2 lg:mb-3">Fast Deployment</h3>
              <p className="text-muted-foreground text-xs lg:text-sm">
                Launch campaigns quickly with AI influencers ready to collaborate
              </p>
            </Card>

            <Card className="text-center p-4 lg:p-6 border-2 border-primary/30 hover:border-primary/50 transition-all hover:shadow-lg bg-gradient-to-br from-primary/5 to-transparent min-w-[240px] lg:min-w-0 snap-center">
              <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-3 lg:mb-4">
                <DollarSign className="h-6 w-6 lg:h-8 lg:w-8 text-primary-foreground" />
              </div>
              <h3 className="text-base lg:text-xl font-semibold mb-2 lg:mb-3">Pay for Results</h3>
              <p className="text-muted-foreground text-xs lg:text-sm">
                Only pay for actual performance - impressions, clicks, conversions. No wasted budget.
              </p>
            </Card>
          </div>
        </div>
      </motion.section>

      {/* Your Journey to Success */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeInUp}
        className="py-12 lg:py-20 px-4 bg-muted/30"
      >
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-8 lg:mb-16">
            <Badge className="mb-3 lg:mb-4 bg-primary/10 text-primary border-primary/20 text-xs lg:text-sm">
              Simple 4-Step Process
            </Badge>
            <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold mb-2 lg:mb-4">
              Your Journey to Success
            </h2>
            <p className="text-sm lg:text-lg text-muted-foreground max-w-2xl mx-auto">
              Launch your campaign in four simple steps
            </p>
          </div>

          <div className="relative grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-8">
            {/* Step 1 */}
            <div className="relative text-center">
              <div className="inline-flex items-center justify-center w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-primary/10 text-primary font-bold text-base lg:text-lg mb-2 lg:mb-4">
                1
              </div>
              <h3 className="text-sm lg:text-lg font-semibold mb-1 lg:mb-2">Deposit Funds</h3>
              <p className="text-xs lg:text-sm text-muted-foreground">
                Add funds to your account. Money is held securely in escrow.
              </p>

              {/* Arrow */}
              <div className="hidden md:block absolute top-5 left-[calc(50%+30px)] w-[calc(100%-30px)]">
                <svg className="w-full h-6" viewBox="0 0 100 24" preserveAspectRatio="none">
                  <path d="M0 12 L90 12" stroke="currentColor" strokeWidth="2" fill="none" className="text-primary/30" strokeDasharray="4 4" />
                  <polygon points="90,12 85,9 85,15" fill="currentColor" className="text-primary/30" />
                </svg>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative text-center">
              <div className="inline-flex items-center justify-center w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-primary/10 text-primary font-bold text-base lg:text-lg mb-2 lg:mb-4">
                2
              </div>
              <h3 className="text-sm lg:text-lg font-semibold mb-1 lg:mb-2">Launch Campaign</h3>
              <p className="text-xs lg:text-sm text-muted-foreground">
                Match with AI influencers and begin your campaign.
              </p>

              {/* Arrow */}
              <div className="hidden md:block absolute top-5 left-[calc(50%+30px)] w-[calc(100%-30px)]">
                <svg className="w-full h-6" viewBox="0 0 100 24" preserveAspectRatio="none">
                  <path d="M0 12 L90 12" stroke="currentColor" strokeWidth="2" fill="none" className="text-primary/30" strokeDasharray="4 4" />
                  <polygon points="90,12 85,9 85,15" fill="currentColor" className="text-primary/30" />
                </svg>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative text-center">
              <div className="inline-flex items-center justify-center w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-primary/10 text-primary font-bold text-base lg:text-lg mb-2 lg:mb-4">
                3
              </div>
              <h3 className="text-sm lg:text-lg font-semibold mb-1 lg:mb-2">Track Progress</h3>
              <p className="text-xs lg:text-sm text-muted-foreground">
                Monitor milestones and approve deliverables in real-time.
              </p>

              {/* Arrow */}
              <div className="hidden md:block absolute top-5 left-[calc(50%+30px)] w-[calc(100%-30px)]">
                <svg className="w-full h-6" viewBox="0 0 100 24" preserveAspectRatio="none">
                  <path d="M0 12 L90 12" stroke="currentColor" strokeWidth="2" fill="none" className="text-primary/30" strokeDasharray="4 4" />
                  <polygon points="90,12 85,9 85,15" fill="currentColor" className="text-primary/30" />
                </svg>
              </div>
            </div>

            {/* Step 4 */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-primary/10 text-primary font-bold text-base lg:text-lg mb-2 lg:mb-4">
                4
              </div>
              <h3 className="text-sm lg:text-lg font-semibold mb-1 lg:mb-2">Auto Payment</h3>
              <p className="text-xs lg:text-sm text-muted-foreground">
                Funds release automatically as milestones complete.
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-8 lg:mt-12">
            <Button size="lg" asChild className="bg-primary/10 hover:bg-primary/15 backdrop-blur-sm border-2 border-primary/30 h-12 lg:h-14 text-sm lg:text-base transition-all rounded-xl px-6 lg:px-8">
              <Link href="/signup?type=brand" className="flex items-center justify-center">
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent font-medium">Start Your Journey Now</span>
                <ArrowRight className="ml-2 h-4 w-4 lg:h-5 lg:w-5 text-primary" />
              </Link>
            </Button>
          </div>
        </div>
      </motion.section>

      {/* Pay-per-Performance Pricing */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeInUp}
        className="py-12 lg:py-20 px-4"
      >
        <div className="container max-w-5xl mx-auto">
          <div className="text-center mb-8 lg:mb-12">
            <Badge className="mb-3 lg:mb-4 bg-primary/10 text-primary border-primary/20 text-xs lg:text-sm">
              Flexible Pricing Options
            </Badge>
            <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold mb-2 lg:mb-4">
              Choose Your Plan
            </h2>
            <p className="text-sm lg:text-lg text-muted-foreground max-w-2xl mx-auto">
              Start free or unlock premium features with Brand Pro
            </p>
          </div>

          <div className="flex overflow-x-auto gap-4 pb-4 pt-4 md:grid md:grid-cols-2 md:gap-6 md:overflow-visible snap-x snap-mandatory md:snap-none max-w-4xl mx-auto">
            {/* Pay-per-Performance FREE */}
            <Card className="p-4 lg:p-6 bg-muted/30 border-2 border-border hover:border-primary/50 transition-all flex flex-col min-w-[280px] md:min-w-0 snap-center">
              <div className="mb-4 lg:mb-6 h-[140px] lg:h-[160px]">
                <Building2 className="h-6 w-6 lg:h-8 lg:w-8 text-primary mb-2 lg:mb-3" />
                <h3 className="text-base lg:text-xl font-bold mb-1 lg:mb-2">Pay-per-Performance</h3>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-2xl lg:text-3xl font-bold">$0</span>
                  <span className="text-sm lg:text-base text-muted-foreground">/month</span>
                </div>
                <p className="text-xs lg:text-sm text-muted-foreground">
                  Pay only for results you get
                </p>
              </div>

              <div className="mb-4 lg:mb-6 flex-1">
                <p className="text-xs text-muted-foreground mb-2">Performance rates:</p>
                <div className="text-xs lg:text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">CPM $8-12</span>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-muted-foreground">CPC $0.70-1.50</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">CPA $15-40</span>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-muted-foreground">CPE $0.20-0.80</span>
                  </div>
                </div>
              </div>

              <Button asChild variant="outline" className="w-full h-9 lg:h-10 text-sm">
                <Link href="/signup?type=brand&plan=free">
                  Get Started Free
                  <ArrowRight className="ml-2 h-3 w-3 lg:h-4 lg:w-4" />
                </Link>
              </Button>
            </Card>

            {/* BRAND PRO */}
            <Card className="pt-6 px-4 pb-4 lg:p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-2 border-primary/50 hover:border-primary transition-all relative flex flex-col min-w-[280px] md:min-w-0 snap-center">
              <Badge className="absolute -top-2 lg:-top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs">
                Recommended
              </Badge>

              <div className="mb-4 lg:mb-6 h-[140px] lg:h-[160px] mt-2 lg:mt-0">
                <TrendingUp className="h-6 w-6 lg:h-8 lg:w-8 text-primary mb-2 lg:mb-3" />
                <h3 className="text-base lg:text-xl font-bold mb-1 lg:mb-2">BRAND PRO</h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-2xl lg:text-3xl font-bold">$199</span>
                  <span className="text-sm lg:text-base text-muted-foreground">/month</span>
                </div>
                <Badge className="bg-secondary/20 text-secondary border-secondary/30 text-xs">
                  14 days free trial
                </Badge>
              </div>

              <div className="mb-4 lg:mb-6 flex-1">
                <p className="text-xs text-muted-foreground mb-2">Premium features:</p>
                <div className="text-xs lg:text-sm space-y-1 text-muted-foreground">
                  <p>Advanced analytics & priority placement</p>
                  <p>Better rates, faster matching, priority support</p>
                </div>
              </div>

              <Button asChild className="w-full bg-primary hover:bg-primary/90 h-9 lg:h-10 text-sm">
                <Link href="/signup?type=brand&plan=pro">
                  Start Pro Trial
                  <ArrowRight className="ml-2 h-3 w-3 lg:h-4 lg:w-4" />
                </Link>
              </Button>
            </Card>
          </div>

          <div className="text-center mt-6 lg:mt-8">
            <Link href="/pricing" className="text-xs lg:text-sm text-primary hover:underline">
              View detailed pricing comparison →
            </Link>
          </div>
        </div>
      </motion.section>

      {/* Escrow & Milestone System */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeInUp}
        className="py-20 px-4"
      >
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-success/10 text-success border-success/20">
              Secure & Transparent
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Protected Payment System
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Every payment is protected through our escrow system with milestone-based releases
            </p>
          </div>

          <div className="flex overflow-x-auto gap-4 pb-4 md:grid md:grid-cols-2 md:gap-8 md:overflow-visible snap-x snap-mandatory md:snap-none mb-8 lg:mb-12">
            {/* Escrow System */}
            <Card className="p-5 lg:p-8 bg-gradient-to-br from-success/5 to-transparent border-success/20 min-w-[300px] md:min-w-0 snap-center">
              <div className="flex items-center gap-2 lg:gap-3 mb-4 lg:mb-6">
                <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-success/10 flex items-center justify-center">
                  <Lock className="h-5 w-5 lg:h-6 lg:w-6 text-success" />
                </div>
                <h3 className="text-lg lg:text-2xl font-bold">Escrow System</h3>
              </div>

              <div className="space-y-2 lg:space-y-4">
                <div className="flex items-start gap-2 lg:gap-3">
                  <ArrowDownCircle className="h-4 w-4 lg:h-5 lg:w-5 text-success shrink-0 mt-0.5 lg:mt-1" />
                  <p className="text-xs lg:text-base text-muted-foreground">All payments flow through our secure platform</p>
                </div>
                <div className="flex items-start gap-2 lg:gap-3">
                  <ArrowDownCircle className="h-4 w-4 lg:h-5 lg:w-5 text-success shrink-0 mt-0.5 lg:mt-1" />
                  <p className="text-xs lg:text-base text-muted-foreground">Automatic release based on milestones</p>
                </div>
                <div className="flex items-start gap-2 lg:gap-3">
                  <ArrowDownCircle className="h-4 w-4 lg:h-5 lg:w-5 text-success shrink-0 mt-0.5 lg:mt-1" />
                  <p className="text-xs lg:text-base text-muted-foreground">Built-in dispute resolution</p>
                </div>
                <div className="flex items-start gap-2 lg:gap-3">
                  <ArrowDownCircle className="h-4 w-4 lg:h-5 lg:w-5 text-success shrink-0 mt-0.5 lg:mt-1" />
                  <p className="text-xs lg:text-base text-muted-foreground">Full transaction transparency</p>
                </div>
              </div>
            </Card>

            {/* Contract Management */}
            <Card className="p-5 lg:p-8 bg-gradient-to-br from-primary/5 to-transparent border-primary/20 min-w-[300px] md:min-w-0 snap-center">
              <div className="flex items-center gap-2 lg:gap-3 mb-4 lg:mb-6">
                <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <FileText className="h-5 w-5 lg:h-6 lg:w-6 text-primary" />
                </div>
                <h3 className="text-lg lg:text-2xl font-bold">Smart Contracts</h3>
              </div>

              <div className="space-y-2 lg:space-y-4">
                <div className="flex items-start gap-2 lg:gap-3">
                  <CheckSquare className="h-4 w-4 lg:h-5 lg:w-5 text-primary shrink-0 mt-0.5 lg:mt-1" />
                  <p className="text-xs lg:text-base text-muted-foreground">Auto-generated legal templates</p>
                </div>
                <div className="flex items-start gap-2 lg:gap-3">
                  <CheckSquare className="h-4 w-4 lg:h-5 lg:w-5 text-primary shrink-0 mt-0.5 lg:mt-1" />
                  <p className="text-xs lg:text-base text-muted-foreground">E-signature integration (DocuSign)</p>
                </div>
                <div className="flex items-start gap-2 lg:gap-3">
                  <CheckSquare className="h-4 w-4 lg:h-5 lg:w-5 text-primary shrink-0 mt-0.5 lg:mt-1" />
                  <p className="text-xs lg:text-base text-muted-foreground">Stored securely on platform</p>
                </div>
                <div className="flex items-start gap-2 lg:gap-3">
                  <CheckSquare className="h-4 w-4 lg:h-5 lg:w-5 text-primary shrink-0 mt-0.5 lg:mt-1" />
                  <p className="text-xs lg:text-base text-muted-foreground">Compliance tracking included</p>
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
              <div className="hidden lg:block absolute top-12 left-[12%] right-[12%] h-1 bg-gradient-to-r from-secondary/30 via-secondary/60 to-secondary/30 rounded-full" />
              <div className="hidden lg:block absolute top-[46px] left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-secondary/10 via-secondary/30 to-secondary/10" />

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
                {/* Milestone 1 */}
                <div className="relative bg-background rounded-xl border-2 border-secondary/30 p-3 lg:p-5 hover:border-secondary/50 transition-all">
                  <div className="flex items-center gap-1.5 lg:gap-2 mb-2 lg:mb-3">
                    <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                      <FileText className="h-4 w-4 lg:h-5 lg:w-5 text-secondary" />
                    </div>
                    <div>
                      <span className="text-base lg:text-xl font-bold text-secondary">25%</span>
                    </div>
                  </div>
                  <h4 className="font-bold text-xs lg:text-base mb-1 lg:mb-2">Contract Signed</h4>
                  <p className="text-[10px] lg:text-sm text-muted-foreground leading-relaxed">
                    Funds are secured in escrow when both parties sign the agreement. First payment released to begin work.
                  </p>
                </div>

                {/* Milestone 2 */}
                <div className="relative bg-background rounded-xl border-2 border-secondary/30 p-3 lg:p-5 hover:border-secondary/50 transition-all">
                  <div className="flex items-center gap-1.5 lg:gap-2 mb-2 lg:mb-3">
                    <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                      <Eye className="h-4 w-4 lg:h-5 lg:w-5 text-secondary" />
                    </div>
                    <div>
                      <span className="text-base lg:text-xl font-bold text-secondary">25%</span>
                    </div>
                  </div>
                  <h4 className="font-bold text-xs lg:text-base mb-1 lg:mb-2">Content Draft</h4>
                  <p className="text-[10px] lg:text-sm text-muted-foreground leading-relaxed">
                    Creator submits initial content draft for review. Payment automatically releases upon submission.
                  </p>
                </div>

                {/* Milestone 3 */}
                <div className="relative bg-background rounded-xl border-2 border-secondary/30 p-3 lg:p-5 hover:border-secondary/50 transition-all">
                  <div className="flex items-center gap-1.5 lg:gap-2 mb-2 lg:mb-3">
                    <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                      <CheckCircle2 className="h-4 w-4 lg:h-5 lg:w-5 text-secondary" />
                    </div>
                    <div>
                      <span className="text-base lg:text-xl font-bold text-secondary">25%</span>
                    </div>
                  </div>
                  <h4 className="font-bold text-xs lg:text-base mb-1 lg:mb-2">Revisions Approved</h4>
                  <p className="text-[10px] lg:text-sm text-muted-foreground leading-relaxed">
                    Final revisions completed and approved by brand. Payment releases when you approve the final version.
                  </p>
                </div>

                {/* Milestone 4 */}
                <div className="relative bg-background rounded-xl border-2 border-secondary/30 p-3 lg:p-5 hover:border-secondary/50 transition-all">
                  <div className="flex items-center gap-1.5 lg:gap-2 mb-2 lg:mb-3">
                    <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                      <BarChart3 className="h-4 w-4 lg:h-5 lg:w-5 text-secondary" />
                    </div>
                    <div>
                      <span className="text-base lg:text-xl font-bold text-secondary">25%</span>
                    </div>
                  </div>
                  <h4 className="font-bold text-xs lg:text-base mb-1 lg:mb-2">Published + Metrics</h4>
                  <p className="text-[10px] lg:text-sm text-muted-foreground leading-relaxed">
                    Content goes live and performance metrics are delivered. Final payment automatically releases.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* CTA */}
          <div className="text-center mt-12">
            <Button asChild size="lg" className="bg-primary/10 hover:bg-primary/15 backdrop-blur-sm border-2 border-primary/30 h-14 text-base transition-all rounded-xl px-8">
              <Link href="/signup?type=brand" className="flex items-center justify-center">
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent font-medium">Start Your Campaign</span>
                <ArrowRight className="ml-2 h-5 w-5 text-primary" />
              </Link>
            </Button>
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
