"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { OnboardingLayout } from "@/components/onboarding-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, Instagram, Youtube, Video, Twitter, Users } from "lucide-react";

const platforms = [
  { id: "instagram", name: "Instagram", icon: Instagram },
  { id: "tiktok", name: "TikTok", icon: Video },
  { id: "youtube", name: "YouTube", icon: Youtube },
  { id: "twitter", name: "X/Twitter", icon: Twitter },
];

export default function InfluencerOnboardingStep4() {
  const router = useRouter();
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [totalFollowers, setTotalFollowers] = useState("");
  const [engagementRate, setEngagementRate] = useState("");

  const togglePlatform = (platform: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform]
    );
  };

  const handleNext = () => {
    if (selectedPlatforms.length > 0 && totalFollowers && parseInt(totalFollowers) > 0) {
      localStorage.setItem("influencer_onboarding_platforms", JSON.stringify(selectedPlatforms));
      localStorage.setItem("influencer_onboarding_followers", totalFollowers);
      localStorage.setItem("influencer_onboarding_engagement", engagementRate);
      router.push("/onboarding/influencer/step-5");
    }
  };

  const handleBack = () => {
    router.push("/onboarding/influencer/step-3");
  };

  const isValid = selectedPlatforms.length > 0 && totalFollowers && parseInt(totalFollowers) > 0;

  return (
    <OnboardingLayout
      currentStep={4}
      totalSteps={5}
      title="Platforms & audience"
      subtitle="Tell us about your reach and where your audience can find you."
      onBack={handleBack}
    >
      <div className="space-y-8 mb-8">
        {/* Platforms */}
        <div>
          <Label className="text-sm font-medium mb-4 block">
            Active platforms
            <span className="text-muted-foreground ml-2 font-normal">(Select all that apply)</span>
          </Label>
          <div className="grid grid-cols-2 gap-3">
            {platforms.map((platform) => {
              const Icon = platform.icon;
              return (
                <button
                  key={platform.id}
                  onClick={() => togglePlatform(platform.id)}
                  className={`relative p-4 sm:p-5 rounded-xl border-2 transition-all ${
                    selectedPlatforms.includes(platform.id)
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`h-5 w-5 ${selectedPlatforms.includes(platform.id) ? "text-primary" : "text-muted-foreground"}`} />
                    <span className="text-sm sm:text-base font-medium">{platform.name}</span>
                    {selectedPlatforms.includes(platform.id) && (
                      <div className="ml-auto w-5 h-5 rounded-full bg-primary flex items-center justify-center shrink-0">
                        <Check className="h-3 w-3 text-primary-foreground" />
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Total Followers */}
        <div>
          <Label htmlFor="followers" className="text-sm font-medium mb-2 block">
            Total followers across all platforms
          </Label>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              id="followers"
              type="number"
              placeholder="e.g., 50000"
              value={totalFollowers}
              onChange={(e) => setTotalFollowers(e.target.value)}
              className="h-11 sm:h-12 pl-11"
              min="0"
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1.5">
            Enter your combined follower count from all platforms
          </p>
        </div>

        {/* Engagement Rate */}
        <div>
          <Label htmlFor="engagement" className="text-sm font-medium mb-2 block">
            Average engagement rate
            <span className="text-muted-foreground ml-2 font-normal">(Optional)</span>
          </Label>
          <div className="relative">
            <Input
              id="engagement"
              type="number"
              placeholder="e.g., 5.2"
              value={engagementRate}
              onChange={(e) => setEngagementRate(e.target.value)}
              className="h-11 sm:h-12 pr-10"
              min="0"
              max="100"
              step="0.1"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
              %
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1.5">
            Likes + Comments ÷ Followers × 100
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
