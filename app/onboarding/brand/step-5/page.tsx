"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { OnboardingLayout } from "@/components/onboarding-layout";
import { Button } from "@/components/ui/button";
import { Check, Instagram } from "lucide-react";

const monthlyTargets = ["1-5", "6-10", "11-19", "20+"];

const platforms = [
  { id: "instagram", name: "Instagram", icon: Instagram },
  { id: "tiktok", name: "TikTok", icon: null },
  { id: "youtube", name: "YouTube", icon: null },
  { id: "twitter", name: "Twitter/X", icon: null },
];

const categories = [
  "Beauty & Care",
  "Fashion & Style",
  "Tech & Gaming",
  "Health & Wellness",
  "Sports & Fitness",
  "Food & Drinks",
  "Travel",
  "Lifestyle",
  "Business & Finance",
  "Music",
  "Art & Design",
  "Photography",
  "Home & Garden",
  "Pets",
  "Kids & Parenting",
  "Skincare",
  "Makeup",
  "Other",
];

export default function OnboardingStep5() {
  const router = useRouter();
  const [monthlyTarget, setMonthlyTarget] = useState<string | null>(null);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const togglePlatform = (platform: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform]
    );
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleNext = () => {
    if (monthlyTarget && selectedPlatforms.length > 0 && selectedCategories.length > 0) {
      localStorage.setItem("brand_onboarding_monthly_target", monthlyTarget);
      localStorage.setItem("brand_onboarding_platforms", JSON.stringify(selectedPlatforms));
      localStorage.setItem("brand_onboarding_categories", JSON.stringify(selectedCategories));
      router.push("/onboarding/brand/video-type");
    }
  };

  const handleBack = () => {
    router.push("/onboarding/brand/step-4");
  };

  const isValid = monthlyTarget && selectedPlatforms.length > 0 && selectedCategories.length > 0;

  return (
    <OnboardingLayout
      currentStep={6}
      totalSteps={8}
      title="Your preferences"
      subtitle="Help us match you with the perfect AI influencers for your campaigns."
      onBack={handleBack}
    >
      <div className="space-y-8 mb-8">
        {/* Monthly Target */}
        <div>
          <h3 className="text-sm sm:text-base font-medium mb-4">
            How many AI influencers do you want to work with per month?
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {monthlyTargets.map((target) => (
              <button
                key={target}
                onClick={() => setMonthlyTarget(target)}
                className={`relative p-4 rounded-xl border-2 transition-all ${
                  monthlyTarget === target
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50 hover:bg-muted/50"
                }`}
              >
                <div className="flex flex-col items-center justify-center gap-1.5">
                  <span className={`text-base sm:text-lg font-semibold ${
                    monthlyTarget === target ? "text-primary" : "text-foreground"
                  }`}>
                    {target}
                  </span>
                  <span className="text-xs text-muted-foreground">per month</span>
                  {monthlyTarget === target && (
                    <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                      <Check className="h-2.5 w-2.5 text-primary-foreground" />
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Platforms */}
        <div>
          <h3 className="text-sm sm:text-base font-medium mb-4">
            Which platforms are you interested in?
            <span className="text-muted-foreground ml-2">(Select all that apply)</span>
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {platforms.map((platform) => (
              <button
                key={platform.id}
                onClick={() => togglePlatform(platform.id)}
                className={`relative p-4 sm:p-5 rounded-xl border-2 transition-all ${
                  selectedPlatforms.includes(platform.id)
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm sm:text-base font-medium">{platform.name}</span>
                  {selectedPlatforms.includes(platform.id) && (
                    <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center shrink-0 ml-2">
                      <Check className="h-3 w-3 text-primary-foreground" />
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div>
          <h3 className="text-sm sm:text-base font-medium mb-4">
            Which creator categories are you interested in?
            <span className="text-muted-foreground ml-2">(Select all that apply)</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => toggleCategory(category)}
                className={`relative p-4 rounded-xl border-2 text-left transition-all ${
                  selectedCategories.includes(category)
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm sm:text-base font-medium">{category}</span>
                  {selectedCategories.includes(category) && (
                    <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center shrink-0 ml-2">
                      <Check className="h-3 w-3 text-primary-foreground" />
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <Button
        onClick={handleNext}
        disabled={!isValid}
        className="w-full h-12 sm:h-14 bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-base sm:text-lg"
      >
        Next
      </Button>
    </OnboardingLayout>
  );
}
