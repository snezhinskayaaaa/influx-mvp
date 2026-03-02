"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { NetworkLogo } from "@/components/logo";
import { ArrowRight, Menu, X } from "lucide-react";

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "py-3" : "py-6"
      }`}
    >
      <div
        className={`transition-all duration-300 ${
          isScrolled
            ? "max-w-5xl mx-auto bg-background/70 backdrop-blur-xl border border-border/50 rounded-full shadow-lg px-6 py-3"
            : "container px-4 bg-transparent"
        }`}
      >
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <NetworkLogo className="w-8 h-8 transition-transform group-hover:scale-110" />
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-primary">INFLUX</span>
              <span className="text-xs font-medium text-foreground/60">connect</span>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-4">
            <Button asChild variant="ghost" size="sm" className="text-sm font-medium text-muted-foreground hover:bg-muted/50 hover:text-foreground">
              <Link href="/brands">
                Browse Talent
              </Link>
            </Button>
            <Button asChild variant="ghost" size="sm" className="text-sm font-medium text-muted-foreground hover:bg-muted/50 hover:text-foreground">
              <Link href="/influencers">
                Monetize Content
              </Link>
            </Button>
            <Button asChild variant="ghost" size="sm" className="text-sm font-medium text-muted-foreground hover:bg-muted/50 hover:text-foreground">
              <Link href="/pricing">
                Pricing
              </Link>
            </Button>
            <Button asChild variant="ghost" size="sm" className="text-sm font-medium text-muted-foreground hover:bg-muted/50 hover:text-foreground">
              <Link href="/referral">
                Referral program
              </Link>
            </Button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" size="sm" className="hidden sm:flex text-sm font-medium text-muted-foreground hover:bg-muted/50 hover:text-foreground">
              <Link href="/login">
                Log in
              </Link>
            </Button>
            <Button asChild size="sm" className="hidden sm:flex bg-primary/10 hover:bg-primary/15 backdrop-blur-sm border-2 border-primary/30 text-primary rounded-xl transition-all">
              <Link href="/signup">
                Get Started
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Link>
            </Button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 hover:bg-muted/50 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6 text-foreground" />
              ) : (
                <Menu className="h-6 w-6 text-foreground" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[72px] bg-background/95 backdrop-blur-lg z-40">
          <div className="container px-6 py-6 flex flex-col gap-4">
            <Button
              asChild
              variant="ghost"
              size="lg"
              className="w-full justify-start text-base font-medium text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Link href="/brands">
                Browse Talent
              </Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              size="lg"
              className="w-full justify-start text-base font-medium text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Link href="/influencers">
                Monetize Content
              </Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              size="lg"
              className="w-full justify-start text-base font-medium text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Link href="/pricing">
                Pricing
              </Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              size="lg"
              className="w-full justify-start text-base font-medium text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Link href="/referral">
                Referral program
              </Link>
            </Button>

            <div className="border-t pt-4 mt-2 space-y-3">
              <Button
                asChild
                variant="ghost"
                size="lg"
                className="w-full justify-start text-base font-medium text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Link href="/login">
                  Log in
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                className="w-full bg-primary/10 hover:bg-primary/15 backdrop-blur-sm border-2 border-primary/30 text-primary rounded-xl transition-all"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Link href="/signup">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
