"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { OnboardingLayout } from "@/components/onboarding-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Instagram, Youtube, Video, Twitter } from "lucide-react";

export default function InfluencerOnboardingStep2() {
  const router = useRouter();
  const [creatorName, setCreatorName] = useState("");
  const [bio, setBio] = useState("");
  const [instagram, setInstagram] = useState("");
  const [tiktok, setTiktok] = useState("");
  const [youtube, setYoutube] = useState("");
  const [twitter, setTwitter] = useState("");

  const handleNext = () => {
    if (creatorName && bio) {
      localStorage.setItem("influencer_onboarding_handle", creatorName);
      localStorage.setItem("influencer_onboarding_bio", bio);
      localStorage.setItem("influencer_onboarding_instagram", instagram);
      localStorage.setItem("influencer_onboarding_tiktok", tiktok);
      localStorage.setItem("influencer_onboarding_youtube", youtube);
      localStorage.setItem("influencer_onboarding_twitter", twitter);
      router.push("/onboarding/influencer/step-3");
    }
  };

  const handleBack = () => {
    router.push("/onboarding/influencer");
  };

  const isValid = creatorName.trim() && bio.trim();

  return (
    <OnboardingLayout
      currentStep={2}
      totalSteps={5}
      title="Creator profile"
      subtitle="Tell brands about yourself and share your social media handles so they can find you."
      onBack={handleBack}
    >
      <div className="space-y-5 sm:space-y-6 mb-8">
        <div>
          <Label htmlFor="creator-name" className="text-sm font-medium mb-2 block">
            Creator Name / Alias
          </Label>
          <Input
            id="creator-name"
            placeholder="e.g., AI Luna, VirtualVogue, etc."
            value={creatorName}
            onChange={(e) => setCreatorName(e.target.value)}
            className="h-11 sm:h-12"
            required
          />
        </div>

        <div>
          <Label htmlFor="bio" className="text-sm font-medium mb-2 block">
            Bio / Description
          </Label>
          <Textarea
            id="bio"
            placeholder="Tell brands about your content style, personality, and what makes you unique..."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            className="resize-none"
            required
          />
          <p className="text-xs text-muted-foreground mt-1.5">
            This will be shown on your profile. Make it engaging!
          </p>
        </div>

        {/* Social Media Links */}
        <div className="pt-2">
          <Label className="text-sm font-medium mb-3 block">
            Social Media Handles <span className="text-muted-foreground font-normal">(Optional)</span>
          </Label>
          <div className="space-y-3">
            <div className="relative">
              <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Instagram username"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                className="pl-10 h-11"
              />
            </div>
            <div className="relative">
              <Video className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="TikTok username"
                value={tiktok}
                onChange={(e) => setTiktok(e.target.value)}
                className="pl-10 h-11"
              />
            </div>
            <div className="relative">
              <Youtube className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="YouTube channel"
                value={youtube}
                onChange={(e) => setYoutube(e.target.value)}
                className="pl-10 h-11"
              />
            </div>
            <div className="relative">
              <Twitter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="X/Twitter username"
                value={twitter}
                onChange={(e) => setTwitter(e.target.value)}
                className="pl-10 h-11"
              />
            </div>
          </div>
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
