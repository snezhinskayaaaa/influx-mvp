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
  const [aboutProject, setAboutProject] = useState("");

  const handleNext = () => {
    if (brandName && aboutProject) {
      localStorage.setItem("brand_onboarding_website", website);
      localStorage.setItem("brand_onboarding_name", brandName);
      localStorage.setItem("brand_onboarding_description", aboutProject);
      localStorage.setItem("brand_onboarding_special", "");
      router.push("/onboarding/brand/business-type");
    }
  };

  const handleBack = () => {
    router.push("/onboarding/brand");
  };

  const isValid = brandName.trim() && aboutProject.trim();

  return (
    <OnboardingLayout
      currentStep={2}
      totalSteps={4}
      title="Project details"
      subtitle="Tell creators about your project so they can understand what you do and decide if it's a good fit."
      onBack={handleBack}
    >
      <div className="space-y-5 sm:space-y-6 mb-8">
        <div>
          <Label htmlFor="brand-name" className="text-sm font-medium mb-2 block">
            Project Name
          </Label>
          <Input
            id="brand-name"
            placeholder="e.g., Uniswap, Aave, Pudgy Penguins"
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
            className="h-11 sm:h-12"
            required
          />
        </div>

        <div>
          <Label htmlFor="website" className="text-sm font-medium mb-2 block">
            Website <span className="text-muted-foreground font-normal">(optional)</span>
          </Label>
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="website"
              placeholder="https://yourproject.io"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className="pl-10 h-11 sm:h-12"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="about-project" className="text-sm font-medium mb-2 block">
            About Your Project
          </Label>
          <Textarea
            id="about-project"
            placeholder="What does your project do, what's your target audience, and what makes it unique? e.g., DeFi protocol for yield farming on Arbitrum, targeting experienced traders..."
            value={aboutProject}
            onChange={(e) => setAboutProject(e.target.value)}
            rows={4}
            className="resize-none"
            required
          />
          <p className="text-xs text-muted-foreground mt-1.5">
            This will be visible to creators browsing campaigns.
          </p>
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
