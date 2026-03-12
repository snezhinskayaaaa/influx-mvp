"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { OnboardingLayout } from "@/components/onboarding-layout";
import { Button } from "@/components/ui/button";
import { Check, Image, TrendingUp, DollarSign, Sparkles } from "lucide-react";

const campaignGoals = [
  {
    id: "awareness",
    title: "Brand Awareness",
    description: "Collaborating with AI creators on a large scale is an effective way to promote your brand and make it popular. Imagine hundreds of AI influencers talking about your product - wouldn't that generate massive buzz?",
    icon: TrendingUp,
  },
  {
    id: "ugc",
    title: "UGC (User-Generated Content)",
    description: "AI creators can create high-quality content for your brand at scale and low cost. Use this content in your ads, email marketing, social media, website, and other channels.",
    icon: Image,
  },
  {
    id: "sales",
    title: "Drive Sales",
    description: "To drive strong sales through AI influencer marketing, focus on scale and persistence. While some creators may not generate many sales individually, the occasional standout will make up for others. Success usually takes time.",
    icon: DollarSign,
  },
];

export default function OnboardingStep6() {
  const router = useRouter();
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleComplete = async () => {
    if (selectedGoal) {
      setIsSubmitting(true);
      // TODO: Save all onboarding data to backend

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Redirect to dashboard
      router.push("/dashboard/brand");
    }
  };

  const handleBack = () => {
    router.push("/onboarding/brand/video-type");
  };

  return (
    <OnboardingLayout
      currentStep={8}
      totalSteps={8}
      title="Campaign goals"
      subtitle="What is your primary objective in collaborating with AI influencers?"
      onBack={handleBack}
    >
      <div className="space-y-4 mb-8">
        {campaignGoals.map((goal) => {
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
            Setting up your account...
          </>
        ) : (
          <>
            <Sparkles className="h-5 w-5 mr-2" />
            Complete & Start Discovering
          </>
        )}
      </Button>
    </OnboardingLayout>
  );
}
