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
            ? `max-w-5xl mx-auto bg-background/95 backdrop-blur-xl border border-border/50 shadow-lg px-6 py-3 ${isMobileMenuOpen ? "rounded-t-2xl border-b-0" : "rounded-full"}`
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
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
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
        <div className={`md:hidden ${isScrolled ? "max-w-5xl mx-auto bg-background/95 backdrop-blur-xl border border-border/50 border-t-0 rounded-b-2xl shadow-lg" : "bg-background border-b border-border shadow-lg"}`}>
          <div className="px-6 py-3 flex flex-col gap-1">
            <Link
              href="/brands"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors"
            >
              Browse Talent
            </Link>
            <Link
              href="/influencers"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors"
            >
              Monetize Content
            </Link>
            <Link
              href="/pricing"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors"
            >
              Pricing
            </Link>
            <div className="border-t mt-1 pt-2">
              <Link
                href="/signup"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-medium bg-gradient-to-r from-primary to-secondary text-white rounded-lg"
              >
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
