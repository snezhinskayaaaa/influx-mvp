"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { OnboardingLayout } from "@/components/onboarding-layout";
import { Button } from "@/components/ui/button";
import { Check, Wallet, Image, Store, Globe, Gamepad2, HelpCircle } from "lucide-react";

const businessTypes = [
  {
    id: "defi",
    title: "DeFi Protocol",
    description: "Your project offers decentralized finance services such as lending, DEX, yield farming, or staking.",
    icon: Wallet,
  },
  {
    id: "nft-metaverse",
    title: "NFT / Metaverse",
    description: "Your project is focused on NFTs, digital collectibles, virtual worlds, or metaverse experiences.",
    icon: Image,
  },
  {
    id: "exchange",
    title: "Exchange (CEX/DEX)",
    description: "Your project operates a centralized or decentralized exchange for trading digital assets.",
    icon: Store,
  },
  {
    id: "infrastructure",
    title: "Infrastructure / L1/L2",
    description: "Your project builds blockchain infrastructure, layer 1 or layer 2 solutions, or developer tooling.",
    icon: Globe,
  },
  {
    id: "gamefi",
    title: "GameFi / Play-to-Earn",
    description: "Your project combines gaming with decentralized finance, play-to-earn mechanics, or in-game assets.",
    icon: Gamepad2,
  },
  {
    id: "other-web3",
    title: "Other Web3",
    description: "If your Web3 project is not covered in the above categories, please select this option.",
    icon: HelpCircle,
  },
];

export default function BusinessTypePage() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const handleNext = () => {
    if (selectedType) {
      localStorage.setItem("brand_onboarding_business_type", selectedType);
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
      subtitle="Which type of Web3 project do you operate? Select the category that best describes your business."
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
