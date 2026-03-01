"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { NetworkLogo } from "@/components/logo";
import { ArrowRight } from "lucide-react";

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
              <span className="text-xs font-medium text-foreground/60">market</span>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="#how-it-works"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              How It Works
            </Link>
            <Link
              href="#pricing"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="#browse"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Browse Influencers
            </Link>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Button asChild size="sm" className="bg-primary hover:bg-primary/90 text-white rounded-full">
              <Link href="/signup">
                Get Started
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
