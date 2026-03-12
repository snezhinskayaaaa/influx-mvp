"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { OnboardingLayout } from "@/components/onboarding-layout";
import { Button } from "@/components/ui/button";
import { Check, ShoppingCart, Store, MapPin, Globe, Code, HelpCircle } from "lucide-react";

const businessTypes = [
  {
    id: "ecommerce",
    title: "E-Commerce",
    description: "Your business sells products online and delivers across the country.",
    icon: ShoppingCart,
  },
  {
    id: "in-person",
    title: "In Person Services",
    description: "Your business sells services or products that require in person presence e.g. hotel / airbnb, gym, beauty salon, big items furniture.",
    icon: MapPin,
  },
  {
    id: "marketplace",
    title: "Marketplace",
    description: "Your business is a marketplace.",
    icon: Store,
  },
  {
    id: "digital",
    title: "Digital Services",
    description: "Your business sells services that don't require in person presence e.g. online yoga classes, online training courses.",
    icon: Globe,
  },
  {
    id: "other",
    title: "Other",
    description: "If not covered in the above please select this option.",
    icon: HelpCircle,
  },
  {
    id: "software",
    title: "Software",
    description: "Your business sells software e.g. photo editing tools, digital photo book.",
    icon: Code,
  },
];

export default function BusinessTypePage() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const handleNext = () => {
    if (selectedType) {
      // TODO: Save to state/context
      router.push("/onboarding/brand/step-3");
    }
  };

  const handleBack = () => {
    router.push("/onboarding/brand/step-2");
  };

  return (
    <OnboardingLayout
      currentStep={3}
      totalSteps={8}
      title="Business type"
      subtitle="Which type of business do you operate? Do you offer products, services, or software for sale? Online or in person?"
      onBack={handleBack}
    >
      <div className="space-y-3 mb-8">
        {businessTypes.map((type) => {
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
