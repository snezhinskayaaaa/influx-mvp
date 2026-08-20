"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { OnboardingLayout } from "@/components/onboarding-layout";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const categories = [
  "DeFi",
  "NFT & Digital Art",
  "Exchange (CEX/DEX)",
  "Layer 1 / Layer 2",
  "GameFi",
  "AI x Crypto",
  "Memecoins",
  "SocialFi",
  "RWA",
  "Infrastructure & Tooling",
  "Other",
];

export default function BusinessTypePage() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const handleNext = () => {
    if (selectedType) {
      localStorage.setItem("brand_onboarding_business_type", selectedType);
      router.push("/onboarding/brand/step-3");
    }
  };

  const handleBack = () => {
    router.push("/onboarding/brand/step-2");
  };

  return (
    <OnboardingLayout
      currentStep={3}
      totalSteps={7}
      title="Project category"
      subtitle="Select the category that best describes your project."
      onBack={handleBack}
    >
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedType(category)}
            className={`relative p-4 rounded-xl border-2 text-left transition-all ${
              selectedType === category
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50 hover:bg-muted/50"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{category}</span>
              {selectedType === category && (
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
        disabled={!selectedType}
        className="w-full h-12 sm:h-14 bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-base sm:text-lg"
      >
        Next
      </Button>
    </OnboardingLayout>
  );
}
