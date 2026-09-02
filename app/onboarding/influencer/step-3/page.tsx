"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { OnboardingLayout } from "@/components/onboarding-layout";
import { Button } from "@/components/ui/button";
import { Check, Sparkles } from "lucide-react";

const niches = [
  "DeFi",
  "Trading & Alpha",
  "Memecoins",
  "Airdrops & Testnets",
  "NFTs & Digital Art",
  "GameFi",
  "AI x Crypto",
  "Layer 1 / Layer 2",
  "RWA",
  "SocialFi",
  "Education",
  "Other",
];

export default function InfluencerOnboardingStep3() {
  const router = useRouter();
  const [selectedNiches, setSelectedNiches] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const toggleNiche = (niche: string) => {
    setSelectedNiches((prev) =>
      prev.includes(niche)
        ? prev.filter((n) => n !== niche)
        : [...prev, niche]
    );
  };

  const handleComplete = async () => {
    if (selectedNiches.length > 0) {
      setIsSubmitting(true);
      try {
        const patchBody: Record<string, unknown> = {};
        patchBody.niche = selectedNiches;
        const handle = localStorage.getItem("influencer_onboarding_handle");
        if (handle) patchBody.handle = handle;
        const bio = localStorage.getItem("influencer_onboarding_bio");
        if (bio) patchBody.bio = bio;
        const ig = localStorage.getItem("influencer_onboarding_instagram");
        if (ig) patchBody.instagramHandle = ig;
        const tk = localStorage.getItem("influencer_onboarding_tiktok");
        if (tk) patchBody.tiktokHandle = tk;
        const yt = localStorage.getItem("influencer_onboarding_youtube");
        if (yt) patchBody.youtubeHandle = yt;
        const tw = localStorage.getItem("influencer_onboarding_twitter");
        if (tw) patchBody.twitterHandle = tw;
        const tg = localStorage.getItem("influencer_onboarding_telegram");
        if (tg) patchBody.telegramHandle = tg;

        const res = await fetch("/api/influencers/me", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(patchBody),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to save profile");
        }

        // Clean up localStorage
        const keys = [
          "influencer_onboarding_source",
          "influencer_onboarding_handle",
          "influencer_onboarding_bio",
          "influencer_onboarding_instagram",
          "influencer_onboarding_tiktok",
          "influencer_onboarding_youtube",
          "influencer_onboarding_twitter",
          "influencer_onboarding_telegram",
          "influencer_onboarding_niches",
        ];
        keys.forEach((key) => localStorage.removeItem(key));

        router.replace("/dashboard/influencer");
      } catch (err) {
        setIsSubmitting(false);
        const message = err instanceof Error ? err.message : 'Something went wrong';
        setError(message);
        console.error("Influencer onboarding error:", err);
      }
    }
  };

  const handleBack = () => {
    router.push("/onboarding/influencer/step-2");
  };

  return (
    <OnboardingLayout
      currentStep={3}
      totalSteps={3}
      title="Content focus"
      subtitle="Select the topics you cover or want to collaborate on."
      onBack={handleBack}
    >
      <div className="mb-2 sm:mb-4">
        <p className="text-xs sm:text-sm text-muted-foreground">
          Selected: <span className="font-medium text-foreground">{selectedNiches.length}</span> {selectedNiches.length === 1 ? 'topic' : 'topics'}
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 mb-4 sm:mb-8">
        {niches.map((niche) => (
          <button
            key={niche}
            onClick={() => toggleNiche(niche)}
            className={`relative p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 text-left transition-all ${
              selectedNiches.includes(niche)
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50 hover:bg-muted/50"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm sm:text-base font-medium">{niche}</span>
              {selectedNiches.includes(niche) && (
                <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-primary flex items-center justify-center shrink-0 ml-1">
                  <Check className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-primary-foreground" />
                </div>
              )}
            </div>
          </button>
        ))}
      </div>

      {error && (
        <p className="text-sm text-destructive text-center mb-2">{error}</p>
      )}

      <Button
        onClick={handleComplete}
        disabled={selectedNiches.length === 0 || isSubmitting}
        className="w-full h-10 sm:h-14 bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-sm sm:text-lg"
      >
        {isSubmitting ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
            Setting up your profile...
          </>
        ) : (
          <>
            <Sparkles className="h-5 w-5 mr-2" />
            Complete & Start Collaborating
          </>
        )}
      </Button>
    </OnboardingLayout>
  );
}
