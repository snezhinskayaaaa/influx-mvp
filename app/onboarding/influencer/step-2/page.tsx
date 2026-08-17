"use client";

import { useState } from "react";
import { XIcon } from "@/components/x-icon";
import { useRouter } from "next/navigation";
import { OnboardingLayout } from "@/components/onboarding-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Instagram, Youtube, Send } from "lucide-react";

export default function InfluencerOnboardingStep2() {
  const router = useRouter();
  const [creatorName, setCreatorName] = useState("");
  const [bio, setBio] = useState("");
  const [instagram, setInstagram] = useState("");
  const [tiktok, setTiktok] = useState("");
  const [youtube, setYoutube] = useState("");
  const [twitter, setTwitter] = useState("");
  const [telegram, setTelegram] = useState("");

  const handleNext = () => {
    if (creatorName && bio) {
      localStorage.setItem("influencer_onboarding_handle", creatorName);
      localStorage.setItem("influencer_onboarding_bio", bio);
      localStorage.setItem("influencer_onboarding_instagram", instagram);
      localStorage.setItem("influencer_onboarding_tiktok", tiktok);
      localStorage.setItem("influencer_onboarding_youtube", youtube);
      localStorage.setItem("influencer_onboarding_twitter", twitter);
      localStorage.setItem("influencer_onboarding_telegram", telegram);
      router.push("/onboarding/influencer/step-3");
    }
  };

  const handleBack = () => {
    router.push("/onboarding/influencer");
  };

  const hasAnySocial = twitter.trim() || telegram.trim() || instagram.trim() || tiktok.trim() || youtube.trim();
  const isValid = creatorName.trim() && bio.trim() && hasAnySocial;

  return (
    <OnboardingLayout
      currentStep={2}
      totalSteps={3}
      title="Creator profile"
      subtitle="Tell projects about yourself and share your social media handles so they can find you."
      onBack={handleBack}
    >
      <div className="space-y-3 sm:space-y-6 mb-4 sm:mb-8">
        <div>
          <Label htmlFor="creator-name" className="text-xs sm:text-sm font-medium mb-1 sm:mb-2 block">
            Creator Name / Alias
          </Label>
          <Input
            id="creator-name"
            placeholder="e.g., AI Luna, VirtualVogue, etc."
            value={creatorName}
            onChange={(e) => setCreatorName(e.target.value)}
            className="h-9 sm:h-12 text-sm"
            required
          />
        </div>

        <div>
          <Label htmlFor="bio" className="text-xs sm:text-sm font-medium mb-1 sm:mb-2 block">
            Bio / Description
          </Label>
          <Textarea
            id="bio"
            placeholder="Tell projects about your content style, personality, and what makes you unique..."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={2}
            className="resize-none text-sm sm:rows-4"
            required
          />
          <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">
            This will be shown on your profile. Make it engaging!
          </p>
        </div>

        {/* Social Media Links */}
        <div>
          <Label className="text-xs sm:text-sm font-medium mb-2 sm:mb-3 block">
            Social Media Handles <span className="text-muted-foreground font-normal">(at least 1 required)</span>
          </Label>
          <div className="space-y-2 sm:space-y-3">
            <div className="relative">
              <XIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
              <Input
                placeholder="X (Twitter) username"
                value={twitter}
                onChange={(e) => setTwitter(e.target.value)}
                className="pl-9 sm:pl-10 h-9 sm:h-11 text-sm"
              />
            </div>
            <div className="relative">
              <Send className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
              <Input
                placeholder="Telegram username"
                value={telegram}
                onChange={(e) => setTelegram(e.target.value)}
                className="pl-9 sm:pl-10 h-9 sm:h-11 text-sm"
              />
            </div>
            <div className="relative">
              <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
              <Input
                placeholder="Instagram username"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                className="pl-9 sm:pl-10 h-9 sm:h-11 text-sm"
              />
            </div>
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.16 15a6.34 6.34 0 0 0 6.33 6.33 6.34 6.34 0 0 0 6.34-6.33V8.98a8.21 8.21 0 0 0 4.78 1.53V7.05a4.84 4.84 0 0 1-1.02-.36z"/>
              </svg>
              <Input
                placeholder="TikTok username"
                value={tiktok}
                onChange={(e) => setTiktok(e.target.value)}
                className="pl-9 sm:pl-10 h-9 sm:h-11 text-sm"
              />
            </div>
            <div className="relative">
              <Youtube className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
              <Input
                placeholder="YouTube channel"
                value={youtube}
                onChange={(e) => setYoutube(e.target.value)}
                className="pl-9 sm:pl-10 h-9 sm:h-11 text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      <Button
        onClick={handleNext}
        disabled={!isValid}
        className="w-full h-10 sm:h-14 bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-sm sm:text-lg"
      >
        Next
      </Button>
    </OnboardingLayout>
  );
}
