"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navigation } from "@/components/navigation";
import { NetworkLogo } from "@/components/logo";
import { CountdownTimer } from "@/components/countdown-timer";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { motion } from "framer-motion";
import {
  Sparkles,
  Building2,
  CheckCircle2,
  TrendingUp,
  Shield,
  Zap,
  Users,
  BarChart3,
  MessageSquare,
  ArrowRight,
  Filter,
  MapPin,
  Calendar,
  Heart,
  Target,
  Instagram,
  Youtube,
  Video,
  Twitch,
  Twitter,
  Facebook,
  Linkedin,
  Mail,
  Crown,
  Flame,
  Award,
  Check
} from "lucide-react";

const fadeInUp = {
  hidden: { opacity: 0, y: 100, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.4, 0.25, 1] as const,
      opacity: { duration: 0.6 }
    }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
};

const cardVariant = {
  hidden: { opacity: 0, y: 50, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.4, 0.25, 1] as const
    }
  }
};

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Navigation */}
      <Navigation />

      {/* Hero Section */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="relative overflow-hidden bg-gradient-to-b from-background to-background pt-32 pb-24 sm:pt-40 sm:pb-32"
      >
        <div className="container px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
            {/* Left Column - Text Content */}
            <div className="text-left">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                AI Influencers and brands{" "}
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  connected
                </span>
              </h1>
              <p className="mt-6 text-lg text-muted-foreground sm:text-xl leading-relaxed">
                Influx helps brands and virtual talents to find each other and launch campaigns on the same platform. Explore the first marketplace of AI influencers.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row items-start gap-4">
                <Button size="lg" asChild className="w-full sm:w-64 bg-primary/10 hover:bg-primary/15 backdrop-blur-sm border-2 border-primary/30 h-14 text-base transition-all">
                  <Link href="/brands" className="flex items-center justify-center">
                    <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent font-medium">For brands</span>
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="w-full sm:w-64 h-14 text-base border-muted-foreground/30 text-muted-foreground hover:bg-muted hover:text-foreground transition-all">
                  <Link href="/influencers" className="flex items-center justify-center">
                    Join as Influencer
                  </Link>
                </Button>
              </div>
            </div>

            {/* Right Column - AI Influencer Image */}
            <div className="relative h-[500px] lg:h-[600px] rounded-3xl overflow-hidden">
              <Image
                src="/ai-influencer-hero.jpeg"
                alt="AI Influencer with phone showing Instagram profile"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </motion.section>

      {/* Find the Perfect Match Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeInUp}
        className="py-12 sm:py-20 lg:py-32 bg-background"
      >
        <div className="container px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight lg:text-5xl mb-3 sm:mb-4">
              Find the perfect match
            </h2>
            <p className="text-sm sm:text-lg text-muted-foreground max-w-3xl mx-auto px-4">
              Discover the perfect influencers with advanced filtering and search capabilities designed to match your exact campaign requirements.
            </p>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6"
          >
            {/* Demographics */}
            <motion.div variants={cardVariant}>
              <Card className="p-3 sm:p-4 lg:p-6 bg-muted/30 border border-primary/30 hover:border-primary/50 transition-all hover:shadow-lg h-full">
              <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-lg sm:rounded-xl bg-primary/10 flex items-center justify-center mb-2 sm:mb-3 lg:mb-4">
                <Users className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-primary" />
              </div>
              <h3 className="text-sm sm:text-base lg:text-lg font-semibold mb-1 sm:mb-2">Demographics</h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-snug">
                Filter by gender, age range, and audience demographics to match your target market
              </p>
              </Card>
            </motion.div>

            {/* Location */}
            <motion.div variants={cardVariant}>
              <Card className="p-3 sm:p-4 lg:p-6 bg-muted/30 border border-secondary/30 hover:border-secondary/50 transition-all hover:shadow-lg h-full">
              <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-lg sm:rounded-xl bg-secondary/10 flex items-center justify-center mb-2 sm:mb-3 lg:mb-4">
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-secondary" />
              </div>
              <h3 className="text-sm sm:text-base lg:text-lg font-semibold mb-1 sm:mb-2">Location</h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-snug">
                Search influencers by geographic location and regional audience reach
              </p>
              </Card>
            </motion.div>

            {/* Engagement Rate */}
            <motion.div variants={cardVariant}>
              <Card className="p-3 sm:p-4 lg:p-6 bg-muted/30 border border-success/30 hover:border-success/50 transition-all hover:shadow-lg h-full">
              <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-lg sm:rounded-xl bg-success/10 flex items-center justify-center mb-2 sm:mb-3 lg:mb-4">
                <Heart className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-success" />
              </div>
              <h3 className="text-sm sm:text-base lg:text-lg font-semibold mb-1 sm:mb-2">Engagement Rate</h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-snug">
                Find influencers with proven engagement metrics and authentic audience connections
              </p>
              </Card>
            </motion.div>

            {/* Niche & Category */}
            <motion.div variants={cardVariant}>
              <Card className="p-3 sm:p-4 lg:p-6 bg-muted/30 border border-primary/30 hover:border-primary/50 transition-all hover:shadow-lg h-full">
              <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-lg sm:rounded-xl bg-primary/10 flex items-center justify-center mb-2 sm:mb-3 lg:mb-4">
                <Target className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-primary" />
              </div>
              <h3 className="text-sm sm:text-base lg:text-lg font-semibold mb-1 sm:mb-2">Niche & Category</h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-snug">
                Browse by content category, industry niche, and brand alignment scores
              </p>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Complete Flexibility Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeInUp}
        className="py-12 sm:py-20 lg:py-32 bg-muted/30"
      >
        <div className="container px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight lg:text-5xl mb-3 sm:mb-4">
              Complete flexibility
            </h2>
            <p className="text-sm sm:text-lg text-muted-foreground max-w-3xl mx-auto px-4">
              Set your own terms. Both brands and influencers have full control over pricing, deliverables, and collaboration conditions.
            </p>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="flex overflow-x-auto gap-4 pb-4 md:grid md:grid-cols-2 md:gap-8 md:overflow-visible snap-x snap-mandatory md:snap-none max-w-4xl mx-auto"
          >
            {/* For Brands */}
            <motion.div variants={cardVariant} className="min-w-[300px] md:min-w-0 snap-center">
              <Card className="p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/30 hover:border-primary/40 transition-all hover:shadow-lg h-full flex flex-col">
              <div className="mb-4 sm:mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-xl sm:rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Building2 className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-primary" />
                </div>
              </div>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-3 sm:mb-4">For Brands</h3>
              <p className="text-xs sm:text-sm lg:text-base text-muted-foreground mb-4 sm:mb-6 leading-relaxed">
                Define your budget, campaign deliverables, timelines, and quality standards. Choose influencers who meet your criteria and negotiate terms that work for your business.
              </p>
              <ul className="space-y-2 sm:space-y-3 mb-6 flex-1">
                <li className="flex items-start gap-2 sm:gap-3">
                  <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm text-muted-foreground">Set custom budgets and payment terms</span>
                </li>
                <li className="flex items-start gap-2 sm:gap-3">
                  <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm text-muted-foreground">Define specific deliverables</span>
                </li>
                <li className="flex items-start gap-2 sm:gap-3">
                  <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm text-muted-foreground">Flexible collaboration formats</span>
                </li>
              </ul>
              <Button asChild variant="outline" className="w-full border-primary/40 text-primary hover:bg-primary/10">
                <Link href="/brands">
                  Start as brand
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              </Card>
            </motion.div>

            {/* For Influencers */}
            <motion.div variants={cardVariant} className="min-w-[300px] md:min-w-0 snap-center">
              <Card className="p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-secondary/5 to-secondary/10 border border-secondary/30 hover:border-secondary/40 transition-all hover:shadow-lg h-full flex flex-col">
              <div className="mb-4 sm:mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-xl sm:rounded-2xl bg-secondary/10 flex items-center justify-center">
                  <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-secondary" />
                </div>
              </div>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-3 sm:mb-4">For AI Influencers</h3>
              <p className="text-xs sm:text-sm lg:text-base text-muted-foreground mb-4 sm:mb-6 leading-relaxed">
                You're in control. Set your rates, specify your services, and choose campaigns that align with your brand. Accept only partnerships that feel right to you.
              </p>
              <ul className="space-y-2 sm:space-y-3 mb-6 flex-1">
                <li className="flex items-start gap-2 sm:gap-3">
                  <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-secondary shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm text-muted-foreground">Set your own pricing</span>
                </li>
                <li className="flex items-start gap-2 sm:gap-3">
                  <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-secondary shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm text-muted-foreground">Choose your ideal partnerships</span>
                </li>
                <li className="flex items-start gap-2 sm:gap-3">
                  <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-secondary shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm text-muted-foreground">Define collaboration terms</span>
                </li>
              </ul>
              <Button asChild variant="outline" className="w-full border-secondary/40 text-secondary hover:bg-secondary/10">
                <Link href="/influencers">
                  Join as influencer
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Multi-channel Marketing Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeInUp}
        className="py-16 sm:py-24 lg:py-32 bg-muted/30"
      >
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight lg:text-5xl mb-4 sm:mb-6">
              Multi-channel marketing
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground lg:text-xl leading-relaxed px-4">
              Reach your target audience wherever they are. AI influencers deliver consistently high engagement rates across all major platforms, often outperforming traditional influencers with authentic, always-on content creation.
            </p>
          </div>

          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full max-w-6xl mx-auto px-2 sm:px-0"
          >
            <CarouselContent className="-ml-2 sm:-ml-4">
              {/* Instagram */}
              <CarouselItem className="pl-2 sm:pl-4 basis-1/2 md:basis-1/2 lg:basis-1/3">
                <Card className="p-4 sm:p-6 md:p-8 bg-muted/50 border-2 hover:border-[#E4405F]/50 transition-all hover:shadow-lg group h-full flex flex-col">
                  <div className="mb-3 sm:mb-4 md:mb-6">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#833AB4] via-[#E4405F] to-[#FCAF45] flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Instagram className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-white" />
                    </div>
                  </div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-semibold mb-2 sm:mb-3 md:mb-4">Instagram</h3>
                  <p className="text-xs sm:text-sm md:text-base text-muted-foreground mb-3 sm:mb-4 flex-1">
                    Perfect for visual storytelling and brand aesthetics. AI influencers maintain consistent posting schedules with 24/7 engagement, achieving up to 3x higher interaction rates than human creators.
                  </p>
                  <ul className="space-y-1 sm:space-y-2 mt-auto">
                    <li className="flex items-start gap-1.5 sm:gap-2">
                      <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-[#E4405F] shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm text-muted-foreground">Stories, Reels & Posts</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-[#E4405F] shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">Always-on engagement</span>
                    </li>
                  </ul>
                </Card>
              </CarouselItem>

              {/* TikTok */}
              <CarouselItem className="pl-2 sm:pl-4 basis-1/2 md:basis-1/2 lg:basis-1/3">
                <Card className="p-4 sm:p-6 md:p-8 bg-muted/50 border-2 hover:border-success/50 transition-all hover:shadow-lg group h-full flex flex-col">
                  <div className="mb-3 sm:mb-4 md:mb-6">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#00f2ea] to-[#ff0050] flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Video className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-white" />
                    </div>
                  </div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-semibold mb-2 sm:mb-3 md:mb-4">TikTok</h3>
                  <p className="text-xs sm:text-sm md:text-base text-muted-foreground mb-3 sm:mb-4 flex-1">
                    Viral content at scale. AI influencers create trending videos with perfect timing and consistency, driving massive reach among Gen Z and millennial audiences with authentic, relatable content.
                  </p>
                  <ul className="space-y-2 mt-auto">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-success shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm text-muted-foreground">Viral short-form videos</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-success shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm text-muted-foreground">Trend-driven content</span>
                    </li>
                  </ul>
                </Card>
              </CarouselItem>

              {/* YouTube */}
              <CarouselItem className="pl-2 sm:pl-4 basis-1/2 md:basis-1/2 lg:basis-1/3">
                <Card className="p-4 sm:p-6 md:p-8 bg-muted/50 border-2 hover:border-[#FF0000]/50 transition-all hover:shadow-lg group h-full flex flex-col">
                  <div className="mb-3 sm:mb-4 md:mb-6">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl bg-[#FF0000] flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Youtube className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-white" />
                    </div>
                  </div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-semibold mb-2 sm:mb-3 md:mb-4">YouTube</h3>
                  <p className="text-xs sm:text-sm md:text-base text-muted-foreground mb-3 sm:mb-4 flex-1">
                    Long-form content mastery. AI creators produce high-quality video content with professional consistency, building dedicated subscriber bases and delivering superior ROI through evergreen content.
                  </p>
                  <ul className="space-y-2 mt-auto">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-[#FF0000] shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm text-muted-foreground">Long-form & Shorts</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-[#FF0000] shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm text-muted-foreground">Evergreen content value</span>
                    </li>
                  </ul>
                </Card>
              </CarouselItem>

              {/* Twitch */}
              <CarouselItem className="pl-2 sm:pl-4 basis-1/2 md:basis-1/2 lg:basis-1/3">
                <Card className="p-4 sm:p-6 md:p-8 bg-muted/50 border-2 hover:border-[#9146FF]/50 transition-all hover:shadow-lg group h-full flex flex-col">
                  <div className="mb-3 sm:mb-4 md:mb-6">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl bg-[#9146FF] flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Twitch className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-white" />
                    </div>
                  </div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-semibold mb-2 sm:mb-3 md:mb-4">Twitch</h3>
                  <p className="text-xs sm:text-sm md:text-base text-muted-foreground mb-3 sm:mb-4 flex-1">
                    Live streaming excellence. AI influencers deliver engaging real-time content with unmatched reliability, building loyal gaming and lifestyle communities that tune in consistently.
                  </p>
                  <ul className="space-y-2 mt-auto">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-[#9146FF] shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm text-muted-foreground">Live streaming & VODs</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-[#9146FF] shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm text-muted-foreground">Gaming & lifestyle content</span>
                    </li>
                  </ul>
                </Card>
              </CarouselItem>

              {/* X (Twitter) */}
              <CarouselItem className="pl-2 sm:pl-4 basis-1/2 md:basis-1/2 lg:basis-1/3">
                <Card className="p-4 sm:p-6 md:p-8 bg-muted/50 border-2 hover:border-[#000000]/50 transition-all hover:shadow-lg group h-full flex flex-col">
                  <div className="mb-3 sm:mb-4 md:mb-6">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl bg-[#000000] flex items-center justify-center group-hover:scale-110 transition-transform">
                      <span className="text-white text-2xl sm:text-3xl md:text-4xl font-bold">𝕏</span>
                    </div>
                  </div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-semibold mb-2 sm:mb-3 md:mb-4">X</h3>
                  <p className="text-xs sm:text-sm md:text-base text-muted-foreground mb-3 sm:mb-4 flex-1">
                    Real-time conversations at scale. AI influencers engage audiences with timely commentary, trending topics, and authentic interactions that drive brand awareness and community growth.
                  </p>
                  <ul className="space-y-2 mt-auto">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-foreground shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm text-muted-foreground">Posts & Threads</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-foreground shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm text-muted-foreground">Real-time engagement</span>
                    </li>
                  </ul>
                </Card>
              </CarouselItem>
            </CarouselContent>
            <CarouselPrevious className="hover:bg-muted hover:text-foreground -left-2 sm:-left-12" />
            <CarouselNext className="hover:bg-muted hover:text-foreground -right-2 sm:-right-12" />
          </Carousel>
        </div>
      </motion.section>

      {/* Choose a Niche Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeInUp}
        className="py-16 sm:py-24 lg:py-32 bg-background"
      >
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight lg:text-5xl mb-4 sm:mb-6">
              Choose a niche to meet in
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground lg:text-xl leading-relaxed px-4">
              Connect with AI influencers across diverse industries and find the perfect match for your brand.
            </p>
          </div>

          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            plugins={[
              Autoplay({
                delay: 5000,
              }),
            ]}
            className="w-full max-w-7xl mx-auto px-4 sm:px-0"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {/* Gaming */}
              <CarouselItem className="pl-2 md:pl-4 basis-[85%] sm:basis-1/2 md:basis-1/3 lg:basis-1/5">
                <div className="relative overflow-hidden h-64 sm:h-72 rounded-xl border border-border hover:border-primary/50 transition-all cursor-pointer group">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/25 to-secondary/25" />
                  <div className="relative h-full flex flex-col justify-end p-4 sm:p-5 bg-gradient-to-t from-black/75 via-black/40 to-transparent">
                    <Badge className="self-start mb-2 sm:mb-3 bg-primary/30 backdrop-blur-sm border-primary/50 text-white text-xs sm:text-sm">
                      Gaming
                    </Badge>
                    <p className="text-white/90 text-xs sm:text-sm leading-relaxed">
                      Engage millions of passionate players
                    </p>
                  </div>
                </div>
              </CarouselItem>

              {/* Beauty */}
              <CarouselItem className="pl-2 md:pl-4 basis-[85%] sm:basis-1/2 md:basis-1/3 lg:basis-1/5">
                <div className="relative overflow-hidden h-64 sm:h-72 rounded-xl border border-border hover:border-[#FF6B9D]/50 transition-all cursor-pointer group">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#FF6B9D]/25 to-[#C44569]/25" />
                  <div className="relative h-full flex flex-col justify-end p-4 sm:p-5 bg-gradient-to-t from-black/75 via-black/40 to-transparent">
                    <Badge className="self-start mb-2 sm:mb-3 text-xs sm:text-sm bg-[#FF6B9D]/30 backdrop-blur-sm border-[#FF6B9D]/50 text-white">
                      Beauty
                    </Badge>
                    <p className="text-white/90 text-xs sm:text-sm leading-relaxed">
                      Inspire with authentic beauty content
                    </p>
                  </div>
                </div>
              </CarouselItem>

              {/* Fashion */}
              <CarouselItem className="pl-2 md:pl-4 basis-[85%] sm:basis-1/2 md:basis-1/3 lg:basis-1/5">
                <div className="relative overflow-hidden h-64 sm:h-72 rounded-xl border border-border hover:border-success/50 transition-all cursor-pointer group">
                  <div className="absolute inset-0 bg-gradient-to-br from-success/25 to-primary/25" />
                  <div className="relative h-full flex flex-col justify-end p-4 sm:p-5 bg-gradient-to-t from-black/75 via-black/40 to-transparent">
                    <Badge className="self-start mb-2 sm:mb-3 text-xs sm:text-sm bg-success/30 backdrop-blur-sm border-success/50 text-white">
                      Fashion
                    </Badge>
                    <p className="text-white/90 text-xs sm:text-sm leading-relaxed">
                      Set trends with style leaders
                    </p>
                  </div>
                </div>
              </CarouselItem>

              {/* Tech */}
              <CarouselItem className="pl-2 md:pl-4 basis-[85%] sm:basis-1/2 md:basis-1/3 lg:basis-1/5">
                <div className="relative overflow-hidden h-64 sm:h-72 rounded-xl border border-border hover:border-secondary/50 transition-all cursor-pointer group">
                  <div className="absolute inset-0 bg-gradient-to-br from-secondary/25 to-success/25" />
                  <div className="relative h-full flex flex-col justify-end p-4 sm:p-5 bg-gradient-to-t from-black/75 via-black/40 to-transparent">
                    <Badge className="self-start mb-2 sm:mb-3 text-xs sm:text-sm bg-secondary/30 backdrop-blur-sm border-secondary/50 text-white">
                      Tech
                    </Badge>
                    <p className="text-white/90 text-xs sm:text-sm leading-relaxed">
                      Shape the future of innovation
                    </p>
                  </div>
                </div>
              </CarouselItem>

              {/* Fitness */}
              <CarouselItem className="pl-2 md:pl-4 basis-[85%] sm:basis-1/2 md:basis-1/3 lg:basis-1/5">
                <div className="relative overflow-hidden h-64 sm:h-72 rounded-xl border border-border hover:border-[#00D084]/50 transition-all cursor-pointer group">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#00D084]/25 to-[#0066FF]/25" />
                  <div className="relative h-full flex flex-col justify-end p-4 sm:p-5 bg-gradient-to-t from-black/75 via-black/40 to-transparent">
                    <Badge className="self-start mb-2 sm:mb-3 text-xs sm:text-sm bg-[#00D084]/30 backdrop-blur-sm border-[#00D084]/50 text-white">
                      Fitness
                    </Badge>
                    <p className="text-white/90 text-xs sm:text-sm leading-relaxed">
                      Inspire healthy lifestyle journeys
                    </p>
                  </div>
                </div>
              </CarouselItem>

              {/* Travel */}
              <CarouselItem className="pl-2 md:pl-4 basis-[85%] sm:basis-1/2 md:basis-1/3 lg:basis-1/5">
                <div className="relative overflow-hidden h-64 sm:h-72 rounded-xl border border-border hover:border-success/50 transition-all cursor-pointer group">
                  <div className="absolute inset-0 bg-gradient-to-br from-success/25 to-secondary/25" />
                  <div className="relative h-full flex flex-col justify-end p-4 sm:p-5 bg-gradient-to-t from-black/75 via-black/40 to-transparent">
                    <Badge className="self-start mb-2 sm:mb-3 text-xs sm:text-sm bg-success/30 backdrop-blur-sm border-success/50 text-white">
                      Travel
                    </Badge>
                    <p className="text-white/90 text-xs sm:text-sm leading-relaxed">
                      Bring destinations to life
                    </p>
                  </div>
                </div>
              </CarouselItem>

              {/* Food */}
              <CarouselItem className="pl-2 md:pl-4 basis-[85%] sm:basis-1/2 md:basis-1/3 lg:basis-1/5">
                <div className="relative overflow-hidden h-64 sm:h-72 rounded-xl border border-border hover:border-[#FF6B35]/50 transition-all cursor-pointer group">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#FF6B35]/25 to-[#FCD34D]/25" />
                  <div className="relative h-full flex flex-col justify-end p-4 sm:p-5 bg-gradient-to-t from-black/75 via-black/40 to-transparent">
                    <Badge className="self-start mb-2 sm:mb-3 text-xs sm:text-sm bg-[#FF6B35]/30 backdrop-blur-sm border-[#FF6B35]/50 text-white">
                      Food
                    </Badge>
                    <p className="text-white/90 text-xs sm:text-sm leading-relaxed">
                      Create mouthwatering experiences
                    </p>
                  </div>
                </div>
              </CarouselItem>

              {/* Lifestyle */}
              <CarouselItem className="pl-2 md:pl-4 basis-[85%] sm:basis-1/2 md:basis-1/3 lg:basis-1/5">
                <div className="relative overflow-hidden h-64 sm:h-72 rounded-xl border border-border hover:border-primary/50 transition-all cursor-pointer group">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/25 to-success/25" />
                  <div className="relative h-full flex flex-col justify-end p-4 sm:p-5 bg-gradient-to-t from-black/75 via-black/40 to-transparent">
                    <Badge className="self-start mb-2 sm:mb-3 text-xs sm:text-sm bg-primary/30 backdrop-blur-sm border-primary/50 text-white">
                      Lifestyle
                    </Badge>
                    <p className="text-white/90 text-xs sm:text-sm leading-relaxed">
                      Connect through relatable stories
                    </p>
                  </div>
                </div>
              </CarouselItem>
            </CarouselContent>
            <CarouselPrevious className="hover:bg-muted hover:text-foreground -left-4 sm:-left-12" />
            <CarouselNext className="hover:bg-muted hover:text-foreground -right-4 sm:-right-12" />
          </Carousel>
        </div>
      </motion.section>

      {/* Founding Members Program - Limited Time Offer */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
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

          {/* Copyright */}
          <div className="text-center pt-6 mt-6 border-t">
            <p className="text-sm text-muted-foreground">&copy; 2026 INFLUXconnect. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
