"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { OnboardingLayout } from "@/components/onboarding-layout";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const sources = [
  { id: "recommendation", label: "Recommendation" },
  { id: "instagram-ads", label: "Instagram Ads" },
  { id: "facebook-ads", label: "Facebook Ads" },
  { id: "google-ads", label: "Google Ads" },
  { id: "google-search", label: "Google Search" },
  { id: "social-media", label: "Social Media Post" },
  { id: "blog-review", label: "Review on a blog, website, etc." },
  { id: "other", label: "Other" },
];

export default function InfluencerOnboardingStep1() {
  const router = useRouter();
  const [selectedSource, setSelectedSource] = useState<string | null>(null);

  const handleNext = () => {
    if (selectedSource) {
      // TODO: Save to state/context
      router.push("/onboarding/influencer/step-2");
    }
  };

  return (
    <OnboardingLayout
      currentStep={1}
      totalSteps={5}
      title="How did you hear about us?"
      subtitle="We want to know how you found out about Influx so we can improve our marketing efforts."
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-8">
        {sources.map((source) => (
          <button
            key={source.id}
            onClick={() => setSelectedSource(source.id)}
            className={`relative p-4 sm:p-5 rounded-xl border-2 text-left transition-all ${
              selectedSource === source.id
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50 hover:bg-muted/50"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm sm:text-base font-medium">{source.label}</span>
              {selectedSource === source.id && (
                <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center shrink-0">
                  <Check className="h-3 w-3 text-primary-foreground" />
                </div>
              )}
            </div>
          </button>
        ))}
      </div>

      <Button
        onClick={handleNext}
        disabled={!selectedSource}
        className="w-full h-12 sm:h-14 bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-base sm:text-lg"
      >
        Next
      </Button>
    </OnboardingLayout>
  );
}
