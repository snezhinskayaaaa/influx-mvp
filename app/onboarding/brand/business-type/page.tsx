"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { OnboardingLayout } from "@/components/onboarding-layout";
import { Button } from "@/components/ui/button";
import { Check, Sparkles } from "lucide-react";

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleComplete = async () => {
    if (selectedType) {
      setIsSubmitting(true);
      try {
        const res = await fetch("/api/brands/me", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            companyName: localStorage.getItem("brand_onboarding_name") || "",
            website: localStorage.getItem("brand_onboarding_website") || "",
            description: localStorage.getItem("brand_onboarding_description") || "",
            industry: selectedType,
          }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to save profile");
        }

        const keys = [
          "brand_onboarding_source",
          "brand_onboarding_website",
          "brand_onboarding_name",
          "brand_onboarding_description",
          "brand_onboarding_special",
          "brand_onboarding_business_type",
          "brand_onboarding_industry",
        ];
        keys.forEach((key) => localStorage.removeItem(key));

        router.push("/dashboard/project");
      } catch (err) {
        setIsSubmitting(false);
        const message = err instanceof Error ? err.message : "Something went wrong";
        setError(message);
        console.error("Brand onboarding error:", err);
      }
    }
  };

  const handleBack = () => {
    router.push("/onboarding/brand/step-2");
  };

  return (
    <OnboardingLayout
      currentStep={3}
      totalSteps={3}
      title="Project category"
      subtitle="Select the category that best describes your project."
      onBack={handleBack}
    >
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 mb-4 sm:mb-8">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedType(category)}
            className={`relative p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 text-left transition-all ${
              selectedType === category
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50 hover:bg-muted/50"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{category}</span>
              {selectedType === category && (
                <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-primary flex items-center justify-center shrink-0 ml-1">
                  <Check className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-primary-foreground" />
                </div>
              )}
            </div>
          </button>
        ))}
      </div>

      {error && (
        <p className="text-sm text-destructive text-center mb-2">{error}</p>
      )}

      <Button
        onClick={handleComplete}
        disabled={!selectedType || isSubmitting}
        className="w-full h-10 sm:h-14 bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-sm sm:text-lg"
      >
        {isSubmitting ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
            Setting up your account...
          </>
        ) : (
          <>
            <Sparkles className="h-5 w-5 mr-2" />
            Complete & Start Discovering
          </>
        )}
      </Button>
    </OnboardingLayout>
  );
}
