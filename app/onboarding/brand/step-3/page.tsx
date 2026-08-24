"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { OnboardingLayout } from "@/components/onboarding-layout";
import { Button } from "@/components/ui/button";
import { Check, Sparkles } from "lucide-react";

const industries = [
  "DeFi",
  "NFT & Digital Art",
  "GameFi",
  "Chains & Infrastructure",
  "Exchanges",
  "Memecoins",
  "DAOs & Governance",
  "AI x Crypto",
  "Wallets & Security",
  "Other",
];

export default function OnboardingStep3() {
  const router = useRouter();
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleComplete = async () => {
    if (selectedIndustry) {
      setIsSubmitting(true);
      try {
        const res = await fetch("/api/brands/me", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            companyName: localStorage.getItem("brand_onboarding_name") || "",
            website: localStorage.getItem("brand_onboarding_website") || "",
            description: localStorage.getItem("brand_onboarding_description") || "",
            industry: selectedIndustry,
          }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to save profile");
        }

        // Clean up localStorage
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

        router.push("/dashboard/brand");
      } catch (err) {
        setIsSubmitting(false);
        const message = err instanceof Error ? err.message : 'Something went wrong';
        alert(message);
        console.error("Brand onboarding error:", err);
      }
    }
  };

  const handleBack = () => {
    router.push("/onboarding/brand/business-type");
  };

  return (
    <OnboardingLayout
      currentStep={4}
      totalSteps={4}
      title="Business industry"
      subtitle="Which industry does your project primarily operate in?"
      onBack={handleBack}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
        {industries.map((industry) => (
          <button
            key={industry}
            onClick={() => setSelectedIndustry(industry)}
            className={`relative p-4 rounded-xl border-2 text-left transition-all ${
              selectedIndustry === industry
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50 hover:bg-muted/50"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm sm:text-base font-medium">{industry}</span>
              {selectedIndustry === industry && (
                <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center shrink-0 ml-2">
                  <Check className="h-3 w-3 text-primary-foreground" />
                </div>
              )}
            </div>
          </button>
        ))}
      </div>

      <Button
        onClick={handleComplete}
        disabled={!selectedIndustry || isSubmitting}
        className="w-full h-12 sm:h-14 bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-base sm:text-lg"
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
