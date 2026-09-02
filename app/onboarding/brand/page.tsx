"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { OnboardingLayout } from "@/components/onboarding-layout";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const sources = [
  { id: "recommendation", label: "Recommendation" },
  { id: "x-twitter", label: "X (Twitter)" },
  { id: "telegram", label: "Telegram" },
  { id: "google-search", label: "Google Search" },
  { id: "youtube", label: "YouTube" },
  { id: "instagram-ads", label: "Instagram Ads" },
  { id: "google-ads", label: "Google Ads" },
  { id: "blog-review", label: "Review on a blog, website, etc." },
  { id: "other", label: "Other" },
];

export default function OnboardingStep1() {
  const router = useRouter();
  const [selectedSource, setSelectedSource] = useState<string | null>(null);

  const handleNext = () => {
    if (selectedSource) {
      localStorage.setItem("brand_onboarding_source", selectedSource);
      fetch('/api/profiles/referral', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source: selectedSource }),
      }).catch(() => {});
      router.replace("/onboarding/brand/step-2");
    }
  };

  return (
    <OnboardingLayout
      currentStep={1}
      totalSteps={3}
      title="How did you hear about us?"
      subtitle="We want to know how you found out about Influx so we can improve our marketing efforts."
    >
      <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-6 sm:mb-8">
        {sources.map((source) => (
          <button
            key={source.id}
            onClick={() => setSelectedSource(source.id)}
            className={`relative p-3 sm:p-5 rounded-lg sm:rounded-xl border-2 text-left transition-all ${
              selectedSource === source.id
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50 hover:bg-muted/50"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm sm:text-base font-medium">{source.label}</span>
              {selectedSource === source.id && (
                <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-primary flex items-center justify-center shrink-0">
                  <Check className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-primary-foreground" />
                </div>
              )}
            </div>
          </button>
        ))}
      </div>

      <Button
        onClick={handleNext}
        disabled={!selectedSource}
        className="w-full h-10 sm:h-14 bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-sm sm:text-lg"
      >
        Next
      </Button>
    </OnboardingLayout>
  );
}
