"use client";

import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  CheckSquare
} from "lucide-react";
import Link from "next/link";

export default function BrandsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative pt-32 sm:pt-40 lg:pt-48 pb-16 sm:pb-20 lg:pb-24 px-4 overflow-hidden">
        <div className="container max-w-7xl mx-auto relative z-10">
          <div className="text-center space-y-6 sm:space-y-8 max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm mb-4">
              <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
              <span className="text-xs sm:text-sm font-medium text-primary">
                For Brands & Advertisers
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight">
              Grow your brand with <span className="text-primary">AI Influencers</span>
            </h1>

            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Connect with authentic AI creators who resonate with your audience. Launch campaigns that drive real results and build lasting partnerships.
            </p>

            <div className="pt-2">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl px-8">
                <Link href="/signup?type=brand">
                  Start Your Campaign
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Precision Targeting</h3>
              <p className="text-muted-foreground">
                Find AI influencers whose audience perfectly matches your target demographic
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Measurable Results</h3>
              <p className="text-muted-foreground">
                Track campaign performance with real-time analytics and detailed insights
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 rounded-2xl bg-success/10 flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-success" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Fast Deployment</h3>
              <p className="text-muted-foreground">
                Launch campaigns quickly with AI influencers ready to collaborate
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pay-per-Performance Pricing */}
      <section className="py-20 px-4">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              Pay for Results, Not Promises
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Performance-Based Pricing
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Unlike other platforms, you only pay for actual results. No upfront fees, no wasted budget.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Pay-per-Performance Card */}
            <Card className="p-8 border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold">Pay-per-Performance</h3>
                </div>
                <p className="text-muted-foreground">Pay only for measurable results</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">CPM: $8-12</p>
                    <p className="text-sm text-muted-foreground">per 1,000 impressions</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">CPC: $0.70-1.50</p>
                    <p className="text-sm text-muted-foreground">per click</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">CPA: $15-40</p>
                    <p className="text-sm text-muted-foreground">per action/conversion</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">CPE: $0.20-0.80</p>
                    <p className="text-sm text-muted-foreground">per engagement</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Brand Pro Card */}
            <Card className="p-8 border-2 border-secondary/20 bg-gradient-to-br from-secondary/5 to-transparent">
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
                    <Sparkles className="h-6 w-6 text-secondary" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">Brand Pro</h3>
                    <p className="text-sm text-muted-foreground">Boost Subscription</p>
                  </div>
                </div>
                <p className="text-3xl font-bold text-secondary">$199<span className="text-base font-normal text-muted-foreground">/month</span></p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-secondary shrink-0" />
                  <p className="text-sm">Priority campaign placement</p>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-secondary shrink-0" />
                  <p className="text-sm">Advanced analytics dashboard</p>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-secondary shrink-0" />
                  <p className="text-sm">Campaign performance insights</p>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-secondary shrink-0" />
                  <p className="text-sm">Competitor benchmarking</p>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-secondary shrink-0" />
                  <p className="text-sm">Faster matching with top creators</p>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-secondary shrink-0" />
                  <p className="text-sm">Email support</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Simple, secure, and transparent process from start to finish
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="relative">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center mb-4 text-2xl font-bold">
                  1
                </div>
                <h3 className="text-xl font-semibold mb-3">Deposit Funds</h3>
                <p className="text-muted-foreground text-sm">
                  Add funds to your account. Money is held securely in escrow.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center mb-4 text-2xl font-bold">
                  2
                </div>
                <h3 className="text-xl font-semibold mb-3">Launch Campaign</h3>
                <p className="text-muted-foreground text-sm">
                  Create your campaign and match with AI influencers. Funds freeze upon agreement.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center mb-4 text-2xl font-bold">
                  3
                </div>
                <h3 className="text-xl font-semibold mb-3">Track Progress</h3>
                <p className="text-muted-foreground text-sm">
                  Monitor milestones, review content, and approve deliverables.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="relative">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center mb-4 text-2xl font-bold">
                  4
                </div>
                <h3 className="text-xl font-semibold mb-3">Auto Payment</h3>
                <p className="text-muted-foreground text-sm">
                  Funds release automatically to creator as milestones complete.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Escrow & Milestone System */}
      <section className="py-20 px-4">
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

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Escrow System */}
            <Card className="p-8 bg-gradient-to-br from-success/5 to-transparent border-success/20">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                  <Lock className="h-6 w-6 text-success" />
                </div>
                <h3 className="text-2xl font-bold">Escrow System</h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <ArrowDownCircle className="h-5 w-5 text-success shrink-0 mt-1" />
                  <p className="text-muted-foreground">All payments flow through our secure platform</p>
                </div>
                <div className="flex items-start gap-3">
                  <ArrowDownCircle className="h-5 w-5 text-success shrink-0 mt-1" />
                  <p className="text-muted-foreground">Automatic release based on milestones</p>
                </div>
                <div className="flex items-start gap-3">
                  <ArrowDownCircle className="h-5 w-5 text-success shrink-0 mt-1" />
                  <p className="text-muted-foreground">Built-in dispute resolution</p>
                </div>
                <div className="flex items-start gap-3">
                  <ArrowDownCircle className="h-5 w-5 text-success shrink-0 mt-1" />
                  <p className="text-muted-foreground">Full transaction transparency</p>
                </div>
              </div>
            </Card>

            {/* Contract Management */}
            <Card className="p-8 bg-gradient-to-br from-primary/5 to-transparent border-primary/20">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold">Smart Contracts</h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckSquare className="h-5 w-5 text-primary shrink-0 mt-1" />
                  <p className="text-muted-foreground">Auto-generated legal templates</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckSquare className="h-5 w-5 text-primary shrink-0 mt-1" />
                  <p className="text-muted-foreground">E-signature integration (DocuSign)</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckSquare className="h-5 w-5 text-primary shrink-0 mt-1" />
                  <p className="text-muted-foreground">Stored securely on platform</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckSquare className="h-5 w-5 text-primary shrink-0 mt-1" />
                  <p className="text-muted-foreground">Compliance tracking included</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Milestone Flow */}
          <Card className="p-8 bg-gradient-to-br from-secondary/5 to-transparent border-secondary/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="text-2xl font-bold">Milestone-Based Payments</h3>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-secondary/20 text-secondary flex items-center justify-center text-sm font-bold">
                    25%
                  </div>
                  <p className="font-semibold">Contract Signed</p>
                </div>
                <p className="text-sm text-muted-foreground">Initial payment released upon agreement</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-secondary/20 text-secondary flex items-center justify-center text-sm font-bold">
                    25%
                  </div>
                  <p className="font-semibold">Content Draft</p>
                </div>
                <p className="text-sm text-muted-foreground">Released when draft submitted</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-secondary/20 text-secondary flex items-center justify-center text-sm font-bold">
                    25%
                  </div>
                  <p className="font-semibold">Revisions Approved</p>
                </div>
                <p className="text-sm text-muted-foreground">Released after final approval</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-secondary/20 text-secondary flex items-center justify-center text-sm font-bold">
                    25%
                  </div>
                  <p className="font-semibold">Published + Metrics</p>
                </div>
                <p className="text-sm text-muted-foreground">Final payment on completion</p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Ready to launch your first campaign?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join hundreds of brands already getting real results with AI influencers
          </p>
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl px-8">
            <Link href="/signup?type=brand">
              Start Your Campaign
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
