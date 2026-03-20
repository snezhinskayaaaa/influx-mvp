"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { OnboardingLayout } from "@/components/onboarding-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Globe } from "lucide-react";

export default function OnboardingStep2() {
  const router = useRouter();
  const [website, setWebsite] = useState("");
  const [brandName, setBrandName] = useState("");
  const [brandDescription, setBrandDescription] = useState("");
  const [brandSpecial, setBrandSpecial] = useState("");

  const handleNext = () => {
    if (brandName && brandDescription) {
      localStorage.setItem("brand_onboarding_website", website);
      localStorage.setItem("brand_onboarding_name", brandName);
      localStorage.setItem("brand_onboarding_description", brandDescription);
      localStorage.setItem("brand_onboarding_special", brandSpecial);
      router.push("/onboarding/brand/business-type");
    }
  };

  const handleBack = () => {
    router.push("/onboarding/brand");
  };

  const isValid = brandName.trim() && brandDescription.trim();

  return (
    <OnboardingLayout
      currentStep={2}
      totalSteps={8}
      title="Brand details"
      subtitle="To effectively engage AI creators, make sure your description is brief and engaging."
      onBack={handleBack}
    >
      <div className="space-y-5 sm:space-y-6 mb-8">
        <div>
          <Label htmlFor="website" className="text-sm font-medium mb-2 block">
            Website
          </Label>
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="website"
              placeholder="https://yourcompany.com"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className="pl-10 h-11 sm:h-12"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="brand-name" className="text-sm font-medium mb-2 block">
            Brand name
          </Label>
          <Input
            id="brand-name"
            placeholder="Your Company"
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
            className="h-11 sm:h-12"
            required
          />
        </div>

        <div>
          <Label htmlFor="brand-description" className="text-sm font-medium mb-2 block">
            What does your brand do? Keep this short.
          </Label>
          <Input
            id="brand-description"
            placeholder="E.g., Sustainable fashion brand | Eco-friendly clothing"
            value={brandDescription}
            onChange={(e) => setBrandDescription(e.target.value)}
            className="h-11 sm:h-12"
            required
          />
        </div>

        <div>
          <Label htmlFor="brand-special" className="text-sm font-medium mb-2 block">
            What makes your brand special? Make this detailed.
          </Label>
          <Textarea
            id="brand-special"
            placeholder="Describe your unique value proposition, target audience, and what sets you apart from competitors..."
            value={brandSpecial}
            onChange={(e) => setBrandSpecial(e.target.value)}
            rows={5}
            className="resize-none"
          />
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
