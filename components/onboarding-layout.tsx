"use client";

import Link from "next/link";
import { NetworkLogo } from "@/components/logo";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OnboardingLayoutProps {
  children: React.ReactNode;
  currentStep: number;
  totalSteps: number;
  onBack?: () => void;
  title: string;
  subtitle?: string;
}

export function OnboardingLayout({
  children,
  currentStep,
  totalSteps,
  onBack,
  title,
  subtitle,
}: OnboardingLayoutProps) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b bg-background px-4 py-4 sm:px-6 sm:py-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 sm:gap-3">
            <NetworkLogo className="w-8 h-8 sm:w-10 sm:h-10" />
            <div className="flex items-baseline gap-1">
              <span className="text-xl sm:text-2xl font-bold text-primary">INFLUX</span>
              <span className="text-xs font-medium text-foreground/60">connect</span>
            </div>
          </Link>
          <div className="text-xs sm:text-sm text-muted-foreground">
            Step {currentStep} of {totalSteps}
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="w-full bg-muted h-1.5 sm:h-2">
        <div
          className="bg-gradient-to-r from-primary to-secondary h-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Content */}
      <main className="flex-1 px-4 py-8 sm:px-6 sm:py-12">
        <div className="max-w-4xl mx-auto">
          {onBack && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="mb-6 sm:mb-8 -ml-2 hover:bg-muted hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go back
            </Button>
          )}

          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3">
              {title}
            </h1>
            {subtitle && (
              <p className="text-sm sm:text-base lg:text-lg text-muted-foreground">
                {subtitle}
              </p>
            )}
          </div>

          {children}
        </div>
      </main>
    </div>
  );
}
