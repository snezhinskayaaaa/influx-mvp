"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { OnboardingLayout } from "@/components/onboarding-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DollarSign, Info } from "lucide-react";

export default function InfluencerOnboardingStep4() {
  const router = useRouter();
  const [cpm, setCpm] = useState("");
  const [cpc, setCpc] = useState("");
  const [cpe, setCpe] = useState("");

  const handleNext = () => {
    // At least one price should be filled
    if (cpm || cpc || cpe) {
      // TODO: Save to state/context
      router.push("/onboarding/influencer/step-5");
    }
  };

  const handleBack = () => {
    router.push("/onboarding/influencer/step-3");
  };

  const isValid = cpm || cpc || cpe;

  return (
    <OnboardingLayout
      currentStep={4}
      totalSteps={6}
      title="Set your rates"
      subtitle="Tell brands what you charge for collaborations. You can always adjust these later."
      onBack={handleBack}
    >
      <div className="space-y-6 mb-8">
        {/* Info Card */}
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-foreground mb-1 font-medium">Pricing Model</p>
              <p className="text-xs text-muted-foreground">
                Set your rates based on performance metrics. You can leave some fields empty if you don't offer that pricing model.
              </p>
            </div>
          </div>
        </div>

        {/* CPM Rate */}
        <div>
          <Label htmlFor="cpm" className="text-sm font-medium mb-2 block">
            CPM (Cost Per Mille)
          </Label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="cpm"
              type="number"
              placeholder="e.g., 15"
              value={cpm}
              onChange={(e) => setCpm(e.target.value)}
              className="pl-10 h-11 sm:h-12"
              min="0"
              step="0.01"
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1.5">
            Price per 1000 impressions
          </p>
        </div>

        {/* CPC Rate */}
        <div>
          <Label htmlFor="cpc" className="text-sm font-medium mb-2 block">
            CPC (Cost Per Click)
          </Label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="cpc"
              type="number"
              placeholder="e.g., 0.50"
              value={cpc}
              onChange={(e) => setCpc(e.target.value)}
              className="pl-10 h-11 sm:h-12"
              min="0"
              step="0.01"
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1.5">
            Price per click on your content
          </p>
        </div>

        {/* CPE Rate */}
        <div>
          <Label htmlFor="cpe" className="text-sm font-medium mb-2 block">
            CPE (Cost Per Engagement)
          </Label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="cpe"
              type="number"
              placeholder="e.g., 0.75"
              value={cpe}
              onChange={(e) => setCpe(e.target.value)}
              className="pl-10 h-11 sm:h-12"
              min="0"
              step="0.01"
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1.5">
            Price per engagement (like, comment, share, save)
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
