"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { OnboardingLayout } from "@/components/onboarding-layout";
import { Button } from "@/components/ui/button";
import { Check, Sparkles, Megaphone, Package, GraduationCap } from "lucide-react";

const videoTypes = [
  {
    id: "up-to-creator",
    title: "Up to the creator",
    description: "Our creators will send you their most creative takes",
    icon: Sparkles,
  },
  {
    id: "testimonial",
    title: "Testimonial",
    description: "Honest statement about your product from a customer's perspective",
    icon: Megaphone,
  },
  {
    id: "unboxing",
    title: "Unboxing",
    description: "Taking your product out of its original box and doing a short review",
    icon: Package,
  },
  {
    id: "how-to",
    title: "How to",
    description: "Creators will record themselves explaining how your product works",
    icon: GraduationCap,
  },
];

export default function VideoTypePage() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const handleNext = () => {
    if (selectedType) {
      localStorage.setItem("brand_onboarding_video_type", selectedType);
      router.push("/onboarding/brand/step-6");
    }
  };

  const handleBack = () => {
    router.push("/onboarding/brand/step-5");
  };

  return (
    <OnboardingLayout
      currentStep={7}
      totalSteps={8}
      title="Video Type"
      subtitle="Which types of video you want?"
      onBack={handleBack}
    >
      <div className="space-y-3 mb-8">
        {videoTypes.map((type) => {
          const Icon = type.icon;
          return (
            <button
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              className={`w-full relative p-5 sm:p-6 rounded-xl border-2 text-left transition-all ${
                selectedType === type.id
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                  selectedType === type.id ? "bg-primary/10" : "bg-muted"
                }`}>
                  <Icon className={`h-5 w-5 ${selectedType === type.id ? "text-primary" : "text-muted-foreground"}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-base">{type.title}</h4>
                    {selectedType === type.id && (
                      <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center shrink-0 ml-2">
                        <Check className="h-3 w-3 text-primary-foreground" />
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {type.description}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
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
