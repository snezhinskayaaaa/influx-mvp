"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { OnboardingLayout } from "@/components/onboarding-layout";
import { Button } from "@/components/ui/button";
import { Check, Sparkles, TrendingUp, Users, Heart } from "lucide-react";

const collaborationGoals = [
  {
    id: "grow-audience",
    title: "Grow my audience",
    description: "I want to collaborate with brands that can help me reach new followers and expand my community across platforms.",
    icon: TrendingUp,
  },
  {
    id: "monetize",
    title: "Monetize my content",
    description: "I'm focused on earning income through brand partnerships, sponsored content, and leveraging my existing audience.",
    icon: Sparkles,
  },
  {
    id: "build-portfolio",
    title: "Build my portfolio",
    description: "I want to work with diverse brands to showcase my content creation skills and build a strong collaboration portfolio.",
    icon: Users,
  },
  {
    id: "authentic-partnerships",
    title: "Authentic partnerships",
    description: "I'm looking for brands that align with my values and content style for genuine, long-term collaborations.",
    icon: Heart,
  },
];

export default function InfluencerOnboardingStep5() {
  const router = useRouter();
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleComplete = async () => {
    if (selectedGoal) {
      setIsSubmitting(true);
      try {
        const platforms = JSON.parse(localStorage.getItem("influencer_onboarding_platforms") || "[]") as string[];
        const totalFollowers = parseInt(localStorage.getItem("influencer_onboarding_followers") || "0", 10);
        const engagement = parseFloat(localStorage.getItem("influencer_onboarding_engagement") || "0");
        const niches = JSON.parse(localStorage.getItem("influencer_onboarding_niches") || "[]") as string[];

        const followersPerPlatform: Record<string, number> = {};
        const engagementPerPlatform: Record<string, number> = {};
        const platformCount = platforms.length || 1;
        const splitFollowers = Math.round(totalFollowers / platformCount);

        for (const p of platforms) {
          if (p === "instagram") {
            followersPerPlatform.instagramFollowers = splitFollowers;
            engagementPerPlatform.instagramEngagement = engagement;
          } else if (p === "tiktok") {
            followersPerPlatform.tiktokFollowers = splitFollowers;
            engagementPerPlatform.tiktokEngagement = engagement;
          } else if (p === "youtube") {
            followersPerPlatform.youtubeSubscribers = splitFollowers;
            engagementPerPlatform.youtubeEngagement = engagement;
          }
        }

        const res = await fetch("/api/influencers/me", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            handle: localStorage.getItem("influencer_onboarding_handle") || "",
            bio: localStorage.getItem("influencer_onboarding_bio") || "",
            instagramHandle: localStorage.getItem("influencer_onboarding_instagram") || "",
            tiktokHandle: localStorage.getItem("influencer_onboarding_tiktok") || "",
            youtubeHandle: localStorage.getItem("influencer_onboarding_youtube") || "",
            niche: niches,
            ...followersPerPlatform,
            ...engagementPerPlatform,
          }),
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
          "influencer_onboarding_niches",
          "influencer_onboarding_platforms",
          "influencer_onboarding_followers",
          "influencer_onboarding_engagement",
        ];
        keys.forEach((key) => localStorage.removeItem(key));

        router.push("/dashboard/influencer");
      } catch (err) {
        setIsSubmitting(false);
        console.error("Influencer onboarding error:", err);
      }
    }
  };

  const handleBack = () => {
    router.push("/onboarding/influencer/step-4");
  };

  return (
    <OnboardingLayout
      currentStep={5}
      totalSteps={5}
      title="Collaboration goals"
      subtitle="What's your main goal for joining Influx? This helps us match you with the right brands."
      onBack={handleBack}
    >
      <div className="space-y-4 mb-8">
        {collaborationGoals.map((goal) => {
          const Icon = goal.icon;
          return (
            <button
              key={goal.id}
              onClick={() => setSelectedGoal(goal.id)}
              className={`w-full relative p-5 sm:p-6 rounded-xl border-2 text-left transition-all ${
                selectedGoal === goal.id
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                  selectedGoal === goal.id ? "bg-primary/10" : "bg-muted"
                }`}>
                  <Icon className={`h-6 w-6 ${selectedGoal === goal.id ? "text-primary" : "text-muted-foreground"}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-base sm:text-lg">{goal.title}</h4>
                    {selectedGoal === goal.id && (
                      <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shrink-0 ml-2">
                        <Check className="h-4 w-4 text-primary-foreground" />
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {goal.description}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <Button
        onClick={handleComplete}
        disabled={!selectedGoal || isSubmitting}
        className="w-full h-12 sm:h-14 bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-base sm:text-lg"
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
