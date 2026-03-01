import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navigation } from "@/components/navigation";
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
  ArrowRight
} from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Navigation */}
      <Navigation />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-background to-background pt-32 pb-24 sm:pt-40 sm:pb-32">
        <div className="container px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
              AI Influencers and brands{" "}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                connected
              </span>
            </h1>
            <p className="mt-6 text-xl text-muted-foreground sm:text-2xl max-w-3xl mx-auto leading-relaxed">
              Influx helps brands and virtual talents to find each other and launch campaigns on the same platform. Explore the first marketplace of AI influencers.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" asChild className="bg-warning hover:bg-warning/90 h-14 px-8 text-lg">
                <Link href="/signup?type=brand">
                  <Building2 className="mr-2 h-5 w-5" />
                  For brands
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="h-14 px-8 text-lg border-muted-foreground/30 text-muted-foreground hover:bg-muted hover:text-foreground">
                <Link href="/signup?type=influencer">
                  <Sparkles className="mr-2 h-5 w-5" />
                  Join as Influencer
                </Link>
              </Button>
            </div>

            {/* Hero Visual - Placeholder for AI influencer grid */}
            <div className="mt-16 grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="aspect-square rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 border-2 border-primary/20 backdrop-blur-sm"
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition Section */}
      <section className="py-24 sm:py-32 bg-background">
        <div className="container px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Why Choose Influx.AI
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* For AI Influencers */}
            <Card className="p-8 bg-muted/50 border-2 hover:border-primary/50 transition-all hover:shadow-lg">
              <div className="mb-6">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-accent" />
                </div>
              </div>
              <h3 className="text-2xl font-semibold mb-4">For AI Influencers</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">Keep 80% of earnings</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">Free to join & list</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">Campaign management tools</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">Professional portfolio page</span>
                </li>
              </ul>
            </Card>

            {/* For Brands */}
            <Card className="p-8 bg-muted/50 border-2 border-primary hover:border-primary transition-all shadow-lg scale-105">
              <div className="mb-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
              </div>
              <h3 className="text-2xl font-semibold mb-4">For Brands</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">Verified influencer profiles</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">Transparent pricing</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">Book campaigns in minutes</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">Track performance & results</span>
                </li>
              </ul>
            </Card>

            {/* The Platform */}
            <Card className="p-8 bg-muted/50 border-2 hover:border-secondary/50 transition-all hover:shadow-lg">
              <div className="mb-6">
                <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-secondary" />
                </div>
              </div>
              <h3 className="text-2xl font-semibold mb-4">The Platform</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">First AI-focused marketplace</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">Secure payment processing</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">Quality-checked talent</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">Growing network effects</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 sm:py-32 bg-background">
        <div className="container px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
              How Influx.AI Works
            </h2>
          </div>

          {/* For Influencers */}
          <div className="mb-20">
            <h3 className="text-2xl font-semibold text-center mb-12 text-secondary">For Influencers</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {[
                { step: "1", title: "Create Profile", icon: Users, desc: "Set up your portfolio" },
                { step: "2", title: "Get Discovered", icon: TrendingUp, desc: "Brands find you" },
                { step: "3", title: "Accept Campaigns", icon: MessageSquare, desc: "Choose your projects" },
                { step: "4", title: "Get Paid", icon: CheckCircle2, desc: "Secure payouts" },
              ].map((item, idx) => (
                <div key={idx} className="relative">
                  <Card className="p-6 text-center bg-background border-2 hover:border-accent transition-all">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-4 text-white font-bold text-2xl">
                      {item.step}
                    </div>
                    <item.icon className="h-8 w-8 mx-auto mb-3 text-accent" />
                    <h4 className="font-semibold text-lg mb-2">{item.title}</h4>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </Card>
                  {idx < 3 && (
                    <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                      <ArrowRight className="h-6 w-6 text-accent" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* For Brands */}
          <div>
            <h3 className="text-2xl font-semibold text-center mb-12 text-primary">For Brands</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {[
                { step: "1", title: "Browse Talent", icon: Users, desc: "Discover AI influencers" },
                { step: "2", title: "Review Metrics", icon: BarChart3, desc: "Verify performance" },
                { step: "3", title: "Book Campaign", icon: Zap, desc: "Launch in minutes" },
                { step: "4", title: "Track Results", icon: TrendingUp, desc: "Monitor success" },
              ].map((item, idx) => (
                <div key={idx} className="relative">
                  <Card className="p-6 text-center bg-background border-2 hover:border-primary transition-all">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center mx-auto mb-4 text-white font-bold text-2xl">
                      {item.step}
                    </div>
                    <item.icon className="h-8 w-8 mx-auto mb-3 text-primary" />
                    <h4 className="font-semibold text-lg mb-2">{item.title}</h4>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </Card>
                  {idx < 3 && (
                    <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                      <ArrowRight className="h-6 w-6 text-primary" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 sm:py-32 bg-background">
        <div className="container px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Simple, Transparent Pricing
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* FREE - Influencers */}
            <Card className="p-8 border-2">
              <Badge className="mb-4">For AI Influencers</Badge>
              <h3 className="text-2xl font-bold mb-2">FREE</h3>
              <p className="text-5xl font-bold mb-6">$0<span className="text-lg text-muted-foreground">/mo</span></p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-success shrink-0 mt-0.5" />
                  <span className="text-sm">Free to list profile</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-success shrink-0 mt-0.5" />
                  <span className="text-sm">80% revenue share</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-success shrink-0 mt-0.5" />
                  <span className="text-sm">Portfolio page</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-success shrink-0 mt-0.5" />
                  <span className="text-sm">Campaign tools</span>
                </li>
              </ul>
              <Button className="w-full" variant="outline" asChild>
                <Link href="/signup?type=influencer">Join Free</Link>
              </Button>
            </Card>

            {/* STARTER - Brands */}
            <Card className="p-8 border-2 border-primary relative">
              <Badge className="mb-4 bg-primary">For Brands</Badge>
              <div className="absolute -top-4 right-6">
                <Badge className="bg-warning text-warning-foreground">Popular</Badge>
              </div>
              <h3 className="text-2xl font-bold mb-2">STARTER</h3>
              <p className="text-5xl font-bold mb-6">$299<span className="text-lg text-muted-foreground">/mo</span></p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">5 active campaigns</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">Analytics dashboard</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">Email support</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">Pay as you go</span>
                </li>
              </ul>
              <Button className="w-full bg-primary hover:bg-primary/90" asChild>
                <Link href="/signup?type=brand&plan=starter">Start Trial</Link>
              </Button>
            </Card>

            {/* PRO - Brands */}
            <Card className="p-8 border-2 border-secondary">
              <Badge className="mb-4 bg-secondary">For Brands</Badge>
              <h3 className="text-2xl font-bold mb-2">PRO</h3>
              <p className="text-5xl font-bold mb-6">$999<span className="text-lg text-muted-foreground">/mo</span></p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                  <span className="text-sm">Unlimited campaigns</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                  <span className="text-sm">Priority support</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                  <span className="text-sm">Dedicated account manager</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                  <span className="text-sm">Advanced analytics & API</span>
                </li>
              </ul>
              <Button className="w-full bg-secondary hover:bg-secondary/90" asChild>
                <Link href="/signup?type=brand&plan=pro">Contact Us</Link>
              </Button>
            </Card>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-8">
            All plans include 20% platform commission on successful deals
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 sm:py-32">
        <div className="container px-6 lg:px-8">
          <Card className="relative overflow-hidden bg-gradient-to-r from-primary to-secondary text-white p-12 sm:p-16 border-0">
            <div className="relative z-10 text-center max-w-3xl mx-auto">
              <h2 className="text-4xl sm:text-5xl font-bold mb-6">Ready to Start?</h2>
              <p className="text-xl mb-8 text-white/90">
                Join the first AI influencer marketplace and transform your campaigns
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" asChild className="h-14 px-8">
                  <Link href="/signup?type=influencer">
                    <Sparkles className="mr-2 h-5 w-5" />
                    Join as Influencer
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="h-14 px-8 bg-white text-primary hover:bg-white/90 border-0">
                  <Link href="/browse">
                    Browse Talent
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/50">
        <div className="container px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4 text-primary">INFLUX.AI</h3>
              <p className="text-sm text-muted-foreground">Where influence flows</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#how-it-works" className="hover:text-foreground">How it Works</Link></li>
                <li><Link href="#pricing" className="hover:text-foreground">Pricing</Link></li>
                <li><Link href="/browse" className="hover:text-foreground">Browse</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/about" className="hover:text-foreground">About</Link></li>
                <li><Link href="/contact" className="hover:text-foreground">Contact</Link></li>
                <li><Link href="/blog" className="hover:text-foreground">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/terms" className="hover:text-foreground">Terms</Link></li>
                <li><Link href="/privacy" className="hover:text-foreground">Privacy</Link></li>
                <li><Link href="/cookies" className="hover:text-foreground">Cookies</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-12 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2026 Influx.AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
