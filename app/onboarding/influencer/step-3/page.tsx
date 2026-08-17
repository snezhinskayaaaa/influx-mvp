"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { OnboardingLayout } from "@/components/onboarding-layout";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const niches = [
  "DeFi",
  "Trading & Alpha",
  "Memecoins",
  "Airdrops & Testnets",
  "NFTs & Digital Art",
  "GameFi",
  "AI x Crypto",
  "Layer 1 / Layer 2",
  "RWA",
  "SocialFi",
  "Education",
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
      localStorage.setItem("influencer_onboarding_niches", JSON.stringify(selectedNiches));
      router.push("/onboarding/influencer/step-5");
    }
  };

  const handleBack = () => {
    router.push("/onboarding/influencer/step-2");
  };

  return (
    <OnboardingLayout
      currentStep={3}
      totalSteps={4}
      title="Content focus"
      subtitle="Select the topics you cover or want to collaborate on."
      onBack={handleBack}
    >
      <div className="mb-4">
        <p className="text-sm text-muted-foreground">
          Selected: <span className="font-medium text-foreground">{selectedNiches.length}</span> {selectedNiches.length === 1 ? 'topic' : 'topics'}
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
