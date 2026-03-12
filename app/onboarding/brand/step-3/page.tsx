"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { OnboardingLayout } from "@/components/onboarding-layout";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const industries = [
  "Beauty & Care",
  "Tech & Gaming",
  "Fashion & Apparel",
  "Health & Wellness",
  "Food & Beverages",
  "Sports & Fitness",
  "Travel & Hospitality",
  "Home & Garden",
  "Entertainment",
  "Education",
  "Finance",
  "Automotive",
  "Pets",
  "Kids & Family",
  "Jewelry & Accessories",
  "Art & Design",
  "Music",
  "Photography",
  "Skincare",
  "Makeup",
  "Software & SaaS",
  "E-Commerce",
  "Other",
];

export default function OnboardingStep3() {
  const router = useRouter();
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);

  const handleNext = () => {
    if (selectedIndustry) {
      // TODO: Save to state/context
      router.push("/onboarding/brand/step-4");
    }
  };

  const handleBack = () => {
    router.push("/onboarding/brand/business-type");
  };

  return (
    <OnboardingLayout
      currentStep={4}
      totalSteps={8}
      title="Business industry"
      subtitle="Which industry does your business primarily operate in? Please choose the industry that best matches your business."
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
        onClick={handleNext}
        disabled={!selectedIndustry}
        className="w-full h-12 sm:h-14 bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-base sm:text-lg"
      >
        Next
      </Button>
    </OnboardingLayout>
  );
}
