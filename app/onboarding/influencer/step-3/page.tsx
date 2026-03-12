"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { OnboardingLayout } from "@/components/onboarding-layout";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const niches = [
  "Beauty & Care",
  "Fashion & Style",
  "Tech & Gaming",
  "Health & Wellness",
  "Sports & Fitness",
  "Food & Drinks",
  "Travel & Adventure",
  "Lifestyle",
  "Business & Finance",
  "Music",
  "Art & Design",
  "Photography",
  "Home & Garden",
  "Pets & Animals",
  "Kids & Parenting",
  "Skincare",
  "Makeup",
  "Education",
  "Entertainment",
  "Comedy",
  "Dance",
  "Other",
];

export default function InfluencerOnboardingStep3() {
  const router = useRouter();
  const [selectedNiches, setSelectedNiches] = useState<string[]>([]);

  const toggleNiche = (niche: string) => {
    setSelectedNiches((prev) =>
      prev.includes(niche)
        ? prev.filter((n) => n !== niche)
        : [...prev, niche]
    );
  };

  const handleNext = () => {
    if (selectedNiches.length > 0) {
      // TODO: Save to state/context
      router.push("/onboarding/influencer/step-4");
    }
  };

  const handleBack = () => {
    router.push("/onboarding/influencer/step-2");
  };

  return (
    <OnboardingLayout
      currentStep={3}
      totalSteps={6}
      title="Content niche"
      subtitle="Select the categories that best describe your content. You can choose multiple niches."
      onBack={handleBack}
    >
      <div className="mb-4">
        <p className="text-sm text-muted-foreground">
          Selected: <span className="font-medium text-foreground">{selectedNiches.length}</span> {selectedNiches.length === 1 ? 'niche' : 'niches'}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
        {niches.map((niche) => (
          <button
            key={niche}
            onClick={() => toggleNiche(niche)}
            className={`relative p-4 rounded-xl border-2 text-left transition-all ${
              selectedNiches.includes(niche)
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50 hover:bg-muted/50"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm sm:text-base font-medium">{niche}</span>
              {selectedNiches.includes(niche) && (
                <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center shrink-0 ml-2">
                  <Check className="h-3 w-3 text-primary-foreground" />
                </div>
              )}
            </div>
          </button>
        ))}
      </div>

      <Button
        onClick={handleNext}
        disabled={selectedNiches.length === 0}
        className="w-full h-12 sm:h-14 bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-base sm:text-lg"
      >
        Next
      </Button>
    </OnboardingLayout>
  );
}
