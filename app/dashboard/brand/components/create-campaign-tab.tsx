"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/date-picker";
import { motion } from "framer-motion";
import {
  Instagram,
  DollarSign,
  Video,
  Youtube,
  Rocket,
  Bell,
  Sparkles,
  MessageSquare,
  MessageCircle,
  Package,
  BookOpen,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { XIcon } from "@/components/x-icon";
import type { Tab, Campaign } from "./types";
import { PRICING_MIN_RATES } from "./types";

interface CreateCampaignTabProps {
  campaigns: Campaign[];
  setCampaigns: React.Dispatch<React.SetStateAction<Campaign[]>>;
  setActiveTab: (tab: Tab) => void;
}

export function CreateCampaignTab({ campaigns, setCampaigns, setActiveTab }: CreateCampaignTabProps) {
  const [toast, setToast] = useState<{ message: string; variant: 'success' | 'error' } | null>(null);

  const showToast = (message: string, variant: 'success' | 'error' = 'success') => {
    setToast({ message, variant });
    setTimeout(() => setToast(null), 4000);
  };

  const getDraft = (key: string, fallback: string = "") => {
    if (typeof window === 'undefined') return fallback;
    try {
      const saved = localStorage.getItem('influx_campaign_draft');
      if (!saved) return fallback;
      const data = JSON.parse(saved);
      return data[key] ?? fallback;
    } catch { return fallback; }
  };

  const getDraftArray = (key: string): string[] => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem('influx_campaign_draft');
      if (!saved) return [];
      const data = JSON.parse(saved);
      return Array.isArray(data[key]) ? data[key] : [];
    } catch { return []; }
  };

  const getDraftDate = (key: string): Date | undefined => {
    if (typeof window === 'undefined') return undefined;
    try {
      const saved = localStorage.getItem('influx_campaign_draft');
      if (!saved) return undefined;
      const data = JSON.parse(saved);
      return data[key] ? new Date(data[key]) : undefined;
    } catch { return undefined; }
  };

  const [campaignTitle, setCampaignTitle] = useState(() => getDraft('campaignTitle'));
  const [campaignBudgetMin, setCampaignBudgetMin] = useState(() => getDraft('campaignBudgetMin'));
  const [campaignBudgetMax, setCampaignBudgetMax] = useState(() => getDraft('campaignBudgetMax'));
  const [campaignDescription, setCampaignDescription] = useState(() => getDraft('campaignDescription'));
  const [campaignGoal, setCampaignGoal] = useState(() => getDraft('campaignGoal'));
  const [campaignStartDate, setCampaignStartDate] = useState<Date | undefined>(() => getDraftDate('campaignStartDate'));
  const [campaignEndDate, setCampaignEndDate] = useState<Date | undefined>(() => getDraftDate('campaignEndDate'));
  const [campaignInfluencerCount, setCampaignInfluencerCount] = useState(() => getDraft('campaignInfluencerCount'));
  const [campaignPlatforms, setCampaignPlatforms] = useState<string[]>(() => getDraftArray('campaignPlatforms'));
  const [campaignContentFormats, setCampaignContentFormats] = useState<string[]>(() => getDraftArray('campaignContentFormats'));
  const [campaignContentType, setCampaignContentType] = useState<string>(() => getDraft('campaignContentType'));
  const [campaignInfluencerNiches, setCampaignInfluencerNiches] = useState<string[]>(() => getDraftArray('campaignInfluencerNiches'));
  const [campaignPricingModels, setCampaignPricingModels] = useState<string[]>(() => getDraftArray('campaignPricingModels'));
  const [campaignTargetViews, setCampaignTargetViews] = useState(() => getDraft('campaignTargetViews'));
  const [campaignTargetClicks, setCampaignTargetClicks] = useState(() => getDraft('campaignTargetClicks'));
  const [campaignTargetEngagements, setCampaignTargetEngagements] = useState(() => getDraft('campaignTargetEngagements'));
  const [campaignBrandTag, setCampaignBrandTag] = useState(() => getDraft('campaignBrandTag'));
  const [campaignHashtags, setCampaignHashtags] = useState(() => getDraft('campaignHashtags'));
  const [campaignCreatorScript, setCampaignCreatorScript] = useState(() => getDraft('campaignCreatorScript'));
  const [campaignDetailedRequirements, setCampaignDetailedRequirements] = useState(() => getDraft('campaignDetailedRequirements'));
  const [campaignProductName, setCampaignProductName] = useState(() => getDraft('campaignProductName'));
  const [campaignProductPrice, setCampaignProductPrice] = useState(() => getDraft('campaignProductPrice'));
  const [campaignProductPhoto, setCampaignProductPhoto] = useState(() => getDraft('campaignProductPhoto'));
  const [campaignProductLink, setCampaignProductLink] = useState(() => getDraft('campaignProductLink'));
  const [campaignProductDescription, setCampaignProductDescription] = useState(() => getDraft('campaignProductDescription'));

  // Auto-save draft to localStorage on any change
  useEffect(() => {
    try {
      localStorage.setItem('influx_campaign_draft', JSON.stringify({
        campaignTitle, campaignDescription, campaignGoal, campaignBudgetMin, campaignBudgetMax,
        campaignInfluencerCount, campaignPlatforms, campaignContentFormats, campaignContentType,
        campaignInfluencerNiches, campaignPricingModels, campaignTargetViews, campaignTargetClicks,
        campaignTargetEngagements, campaignBrandTag, campaignHashtags, campaignCreatorScript,
        campaignDetailedRequirements, campaignProductName, campaignProductPrice, campaignProductPhoto,
        campaignProductLink, campaignProductDescription,
        campaignStartDate: campaignStartDate?.toISOString(),
        campaignEndDate: campaignEndDate?.toISOString(),
      }));
    } catch {}
  }, [
    campaignTitle, campaignDescription, campaignGoal, campaignBudgetMin, campaignBudgetMax,
    campaignInfluencerCount, campaignPlatforms, campaignContentFormats, campaignContentType,
    campaignInfluencerNiches, campaignPricingModels, campaignTargetViews, campaignTargetClicks,
    campaignTargetEngagements, campaignBrandTag, campaignHashtags, campaignCreatorScript,
    campaignDetailedRequirements, campaignProductName, campaignProductPrice, campaignProductPhoto,
    campaignProductLink, campaignProductDescription, campaignStartDate, campaignEndDate,
  ]);

  const clearForm = () => {
    localStorage.removeItem('influx_campaign_draft');
    setCampaignTitle("");
    setCampaignDescription("");
    setCampaignGoal("");
    setCampaignStartDate(undefined);
    setCampaignEndDate(undefined);
    setCampaignInfluencerCount("");
    setCampaignPlatforms([]);
    setCampaignContentFormats([]);
    setCampaignPricingModels([]);
    setCampaignContentType("");
    setCampaignInfluencerNiches([]);
    setCampaignProductName("");
    setCampaignProductPrice("");
    setCampaignProductPhoto("");
    setCampaignProductLink("");
    setCampaignProductDescription("");
    setCampaignBrandTag("");
    setCampaignHashtags("");
    setCampaignCreatorScript("");
    setCampaignDetailedRequirements("");
    setCampaignBudgetMin("");
    setCampaignBudgetMax("");
  };

  const buildCampaignFromForm = (status: "active" | "draft"): Campaign => ({
    id: Date.now(),
    title: campaignTitle || (status === "draft" ? "Untitled Campaign" : campaignTitle),
    status,
    budgetMin: campaignBudgetMin,
    budgetMax: campaignBudgetMax,
    applications: 0,
    startDate: campaignStartDate ? campaignStartDate.toISOString().split('T')[0] : "",
    endDate: campaignEndDate ? campaignEndDate.toISOString().split('T')[0] : "",
    influencerCount: campaignInfluencerCount,
    description: campaignDescription,
    goal: campaignGoal,
    platforms: campaignPlatforms,
    contentFormats: campaignContentFormats,
    pricingModels: campaignPricingModels,
    targetViews: campaignTargetViews,
    targetClicks: campaignTargetClicks,
    targetEngagements: campaignTargetEngagements,
    contentType: campaignContentType,
    influencerNiches: campaignInfluencerNiches,
    productName: campaignProductName,
    productPrice: campaignProductPrice,
    productPhoto: campaignProductPhoto,
    productLink: campaignProductLink,
    productDescription: campaignProductDescription,
    brandTag: campaignBrandTag,
    hashtags: campaignHashtags,
    creatorScript: campaignCreatorScript,
    detailedRequirements: campaignDetailedRequirements,
    createdAt: new Date().toISOString(),
  });

  return (
    <motion.div
      key="create-campaign"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Create New Campaign</h1>
        <p className="text-muted-foreground text-sm sm:text-base">Launch your next Web3 influencer campaign</p>
      </div>

<Card className="p-6 sm:p-8">
        <form className="space-y-6" onSubmit={async (e) => {
          e.preventDefault();

          const newCampaign = buildCampaignFromForm("active");

          // Try to create campaign via API
          try {
            const res = await fetch('/api/campaigns', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                title: campaignTitle,
                description: campaignDescription,
                budgetMin: parseFloat(campaignBudgetMin) || 20,
                budgetMax: parseFloat(campaignBudgetMax) || 20,
                desiredInfluencerCount: parseInt(campaignInfluencerCount) || 1,
                deliverables: campaignDetailedRequirements,
                status: 'ACTIVE',
                goal: campaignGoal,
                platforms: campaignPlatforms,
                contentFormats: campaignContentFormats,
                contentType: campaignContentType,
                influencerNiches: campaignInfluencerNiches,
                pricingModels: campaignPricingModels,
                targetViews: campaignTargetViews,
                targetClicks: campaignTargetClicks,
                targetEngagements: campaignTargetEngagements,
                productName: campaignProductName,
                productPrice: campaignProductPrice,
                productPhoto: campaignProductPhoto,
                productLink: campaignProductLink,
                productDescription: campaignProductDescription,
                brandTag: campaignBrandTag,
                hashtags: campaignHashtags,
                creatorScript: campaignCreatorScript,
              }),
            });
            if (res.ok) {
              const data = await res.json();
              const apiCampaign = data.campaign;
              // Use API-returned id if available
              const createdCampaign: Campaign = {
                ...newCampaign,
                id: apiCampaign.id || newCampaign.id,
                createdAt: apiCampaign.createdAt || newCampaign.createdAt,
              };
              setCampaigns([createdCampaign, ...campaigns]);
            } else {
              const errData = await res.json().catch(() => ({}));
              showToast(errData.error || "Failed to create campaign", 'error');
              return;
            }
          } catch (error) {
            console.error('Failed to create campaign via API:', error);
            showToast("Failed to create campaign. Please try again.", 'error');
            return;
          }

          clearForm();
          setActiveTab("campaigns");
        }}>
          {/* Campaign Title */}
          <div>
            <Label htmlFor="campaign-title" className="text-sm font-medium mb-2 block">
              Campaign Name
            </Label>
            <Input
              id="campaign-title"
              placeholder="e.g., Arbitrum DeFi Campaign Q3"
              value={campaignTitle}
              onChange={(e) => setCampaignTitle(e.target.value)}
              className="h-11"
              required
            />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="campaign-description" className="text-sm font-medium mb-2 block">
              Description
            </Label>
            <Textarea
              id="campaign-description"
              placeholder="e.g., Promote our new L2 bridge launch to crypto-native audiences..."
              value={campaignDescription}
              onChange={(e) => setCampaignDescription(e.target.value)}
              rows={4}
              className="resize-none"
              required
            />
          </div>

          {/* Goal */}
          <div>
            <Label className="text-sm font-medium mb-3 block">
              Campaign Goal
            </Label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: "brand-awareness", name: "Project Awareness" },
                { id: "engagement", name: "Community Engagement" },
                { id: "conversions", name: "Conversions" },
                { id: "product-launch", name: "Token / Protocol Launch" },
                { id: "lead-generation", name: "User Acquisition" },
                { id: "traffic", name: "dApp Traffic" }
              ].map((goal) => (
                <button
                  key={goal.id}
                  type="button"
                  onClick={() => setCampaignGoal(goal.id)}
                  className={`p-3 rounded-xl border-2 text-left transition-all ${
                    campaignGoal === goal.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <span className={`text-sm font-medium ${campaignGoal === goal.id ? "text-primary" : "text-foreground"}`}>
                    {goal.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium mb-2 block">
                Start Date
              </Label>
              <DatePicker
                date={campaignStartDate}
                onDateChange={setCampaignStartDate}
                placeholder="Select start date"
              />
            </div>
            <div>
              <Label className="text-sm font-medium mb-2 block">
                End Date
              </Label>
              <DatePicker
                date={campaignEndDate}
                onDateChange={setCampaignEndDate}
                placeholder="Select end date"
              />
            </div>
          </div>

          {/* Number of AI Influencers */}
          <div>
            <Label htmlFor="influencer-count" className="text-sm font-medium mb-2 block">
              Number of AI Influencers
            </Label>
            <Input
              id="influencer-count"
              type="number"
              min="1"
              placeholder="e.g., 5"
              value={campaignInfluencerCount}
              onChange={(e) => setCampaignInfluencerCount(e.target.value)}
              className="h-11"
              required
            />
          </div>

          {/* Platforms */}
          <div>
            <Label className="text-sm font-medium mb-3 block">
              Platforms
            </Label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: "twitter", name: "X (Twitter)", icon: XIcon },
                { id: "telegram", name: "Telegram", icon: MessageCircle },
                { id: "instagram", name: "Instagram", icon: Instagram },
                { id: "tiktok", name: "TikTok", icon: Video },
                { id: "youtube", name: "YouTube", icon: Youtube },
              ].map((platform) => (
                <button
                  key={platform.id}
                  type="button"
                  onClick={() => {
                    if (campaignPlatforms.includes(platform.id)) {
                      setCampaignPlatforms(campaignPlatforms.filter(p => p !== platform.id));
                    } else {
                      setCampaignPlatforms([...campaignPlatforms, platform.id]);
                    }
                  }}
                  className={`p-3 rounded-xl border-2 text-left transition-all flex items-center gap-3 ${
                    campaignPlatforms.includes(platform.id)
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <platform.icon className={`h-5 w-5 ${campaignPlatforms.includes(platform.id) ? "text-primary" : "text-muted-foreground"}`} />
                  <span className="text-sm font-medium">{platform.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content Formats */}
          {campaignPlatforms.length > 0 && (
            <div>
              <Label className="text-sm font-medium mb-3 block">
                Content Formats
              </Label>
              <div className="grid grid-cols-2 gap-3">
                {campaignPlatforms.includes("instagram") && (
                  <>
                    {["instagram-story", "instagram-reel", "instagram-post"].map((format) => (
                      <button
                        key={format}
                        type="button"
                        onClick={() => {
                          if (campaignContentFormats.includes(format)) {
                            setCampaignContentFormats(campaignContentFormats.filter(f => f !== format));
                          } else {
                            setCampaignContentFormats([...campaignContentFormats, format]);
                          }
                        }}
                        className={`p-3 rounded-xl border-2 text-sm transition-all ${
                          campaignContentFormats.includes(format)
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        {format === "instagram-story" ? "Instagram Story" : format === "instagram-reel" ? "Instagram Reel" : "Instagram Post"}
                      </button>
                    ))}
                  </>
                )}
                {campaignPlatforms.includes("tiktok") && (
                  <button
                    type="button"
                    onClick={() => {
                      const format = "tiktok-video";
                      if (campaignContentFormats.includes(format)) {
                        setCampaignContentFormats(campaignContentFormats.filter(f => f !== format));
                      } else {
                        setCampaignContentFormats([...campaignContentFormats, format]);
                      }
                    }}
                    className={`p-3 rounded-xl border-2 text-sm transition-all ${
                      campaignContentFormats.includes("tiktok-video")
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    TikTok Video
                  </button>
                )}
                {campaignPlatforms.includes("youtube") && (
                  <>
                    {["youtube-video", "youtube-short"].map((format) => (
                      <button
                        key={format}
                        type="button"
                        onClick={() => {
                          if (campaignContentFormats.includes(format)) {
                            setCampaignContentFormats(campaignContentFormats.filter(f => f !== format));
                          } else {
                            setCampaignContentFormats([...campaignContentFormats, format]);
                          }
                        }}
                        className={`p-3 rounded-xl border-2 text-sm transition-all ${
                          campaignContentFormats.includes(format)
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        {format === "youtube-video" ? "YouTube Video" : "YouTube Short"}
                      </button>
                    ))}
                  </>
                )}
                {campaignPlatforms.includes("twitter") && (
                  <>
                    {["twitter-post", "twitter-thread"].map((format) => (
                      <button
                        key={format}
                        type="button"
                        onClick={() => {
                          if (campaignContentFormats.includes(format)) {
                            setCampaignContentFormats(campaignContentFormats.filter(f => f !== format));
                          } else {
                            setCampaignContentFormats([...campaignContentFormats, format]);
                          }
                        }}
                        className={`p-3 rounded-xl border-2 text-sm transition-all ${
                          campaignContentFormats.includes(format)
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        {format === "twitter-post" ? "X Post" : "X Thread"}
                      </button>
                    ))}
                  </>
                )}
                {campaignPlatforms.includes("telegram") && (
                  <>
                    {["telegram-post", "telegram-ama"].map((format) => (
                      <button
                        key={format}
                        type="button"
                        onClick={() => {
                          if (campaignContentFormats.includes(format)) {
                            setCampaignContentFormats(campaignContentFormats.filter(f => f !== format));
                          } else {
                            setCampaignContentFormats([...campaignContentFormats, format]);
                          }
                        }}
                        className={`p-3 rounded-xl border-2 text-sm transition-all ${
                          campaignContentFormats.includes(format)
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        {format === "telegram-post" ? "Telegram Post" : "Telegram AMA"}
                      </button>
                    ))}
                  </>
                )}
              </div>
            </div>
          )}

          {/* Pricing Basis */}
          <div>
            <Label className="text-sm font-medium mb-1 block">
              Pricing Basis
            </Label>
            <p className="text-xs text-muted-foreground mb-3">
              Sets the basis for price negotiation. Final price is agreed as a fixed amount.
            </p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: "cpm", name: "CPM", description: "Price is based on views" },
                { id: "cpc", name: "CPC", description: "Price is based on clicks" },
                { id: "cpe", name: "CPE", description: "Price is based on engagement" }
              ].map((model) => (
                <button
                  key={model.id}
                  type="button"
                  onClick={() => {
                    if (campaignPricingModels.includes(model.id)) {
                      setCampaignPricingModels(campaignPricingModels.filter(m => m !== model.id));
                    } else {
                      setCampaignPricingModels([...campaignPricingModels, model.id]);
                    }
                  }}
                  className={`p-3 rounded-xl border-2 text-left transition-all ${
                    campaignPricingModels.includes(model.id)
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="font-medium text-sm mb-1">{model.name}</div>
                  <div className="text-xs text-muted-foreground">{model.description}</div>
                </button>
              ))}
            </div>

            {/* Target Goals for Selected Pricing Models */}
            {campaignPricingModels.length > 0 && (
              <div className="mt-4 space-y-3">
                <Label className="text-sm font-medium block">
                  Campaign Goals
                </Label>

                {campaignPricingModels.includes("cpm") && (
                  <div>
                    <Label className="text-xs text-muted-foreground mb-2 block">
                      Target Views
                    </Label>
                    <Input
                      type="number"
                      placeholder="e.g., 100000"
                      value={campaignTargetViews}
                      onChange={(e) => setCampaignTargetViews(e.target.value)}
                      className="w-full"
                    />
                  </div>
                )}

                {campaignPricingModels.includes("cpc") && (
                  <div>
                    <Label className="text-xs text-muted-foreground mb-2 block">
                      Target Clicks
                    </Label>
                    <Input
                      type="number"
                      placeholder="e.g., 5000"
                      value={campaignTargetClicks}
                      onChange={(e) => setCampaignTargetClicks(e.target.value)}
                      className="w-full"
                    />
                  </div>
                )}

                {campaignPricingModels.includes("cpe") && (
                  <div>
                    <Label className="text-xs text-muted-foreground mb-2 block">
                      Target Engagements
                    </Label>
                    <Input
                      type="number"
                      placeholder="e.g., 10000"
                      value={campaignTargetEngagements}
                      onChange={(e) => setCampaignTargetEngagements(e.target.value)}
                      className="w-full"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Content Type */}
          <div>
            <Label className="text-sm font-medium mb-3 block">
              Content Type
            </Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { id: "up-to-creator", title: "Up to the creator", description: "Our creators will send you their most creative takes", icon: Sparkles },
                { id: "testimonial", title: "Testimonial", description: "Honest statement about your project from a user's perspective", icon: MessageSquare },
                { id: "tutorial", title: "Tutorial / Walkthrough", description: "Step-by-step guide showing how to use your protocol or dApp", icon: Package },
                { id: "how-to", title: "Deep Dive / Review", description: "Creators will explain your project's tech, tokenomics, or roadmap", icon: BookOpen }
              ].map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setCampaignContentType(type.id)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      campaignContentType === type.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Icon className={`h-5 w-5 shrink-0 mt-0.5 ${campaignContentType === type.id ? "text-primary" : "text-muted-foreground"}`} />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm mb-1">{type.title}</div>
                        <div className="text-xs text-muted-foreground leading-relaxed">{type.description}</div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Influencer Niches */}
          <div>
            <Label className="text-sm font-medium mb-3 block">
              Influencer Niches
            </Label>
            <p className="text-xs text-muted-foreground mb-3">
              Select the verticals that best match your project or campaign
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                "DeFi",
                "NFT & Digital Art",
                "GameFi",
                "Chains & Infrastructure",
                "Exchanges",
                "Memecoins",
                "DAOs & Governance",
                "AI x Crypto",
                "Wallets & Security",
                "Other",
              ].map((niche) => (
                <button
                  key={niche}
                  type="button"
                  onClick={() => {
                    if (campaignInfluencerNiches.includes(niche)) {
                      setCampaignInfluencerNiches(campaignInfluencerNiches.filter(n => n !== niche));
                    } else {
                      setCampaignInfluencerNiches([...campaignInfluencerNiches, niche]);
                    }
                  }}
                  className={`p-3 rounded-xl border-2 text-sm transition-all ${
                    campaignInfluencerNiches.includes(niche)
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <span className={`font-medium ${campaignInfluencerNiches.includes(niche) ? "text-primary" : "text-foreground"}`}>
                    {niche}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div>
            <div className="mb-3">
              <Label className="text-sm font-medium block">Project details</Label>
              <p className="text-xs text-muted-foreground mt-1">This information is visible to creators so please make sure it&apos;s up to date.</p>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="product-name" className="text-sm mb-2 block">
                  Project / Token Name
                </Label>
                <Input
                  id="product-name"
                  placeholder="e.g., Arbitrum, Uniswap, BoredApes"
                  value={campaignProductName}
                  onChange={(e) => setCampaignProductName(e.target.value)}
                  className="h-11"
                />
              </div>
              <div>
                <Label htmlFor="product-price" className="text-sm mb-2 block">
                  Token Price (optional)
                </Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="product-price"
                    type="number"
                    placeholder="e.g., 1.25"
                    value={campaignProductPrice}
                    onChange={(e) => setCampaignProductPrice(e.target.value)}
                    className="pl-10 h-11"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="product-photo" className="text-sm mb-2 block">
                  Project Logo URL
                </Label>
                <Input
                  id="product-photo"
                  type="url"
                  placeholder="https://yourproject.com/logo.png"
                  value={campaignProductPhoto}
                  onChange={(e) => setCampaignProductPhoto(e.target.value)}
                  className="h-11"
                />
              </div>
              <div>
                <Label htmlFor="product-link" className="text-sm mb-2 block">
                  Project Link
                </Label>
                <Input
                  id="product-link"
                  type="url"
                  placeholder="https://yourproject.xyz"
                  value={campaignProductLink}
                  onChange={(e) => setCampaignProductLink(e.target.value)}
                  className="h-11"
                />
              </div>
              <div>
                <Label htmlFor="product-description" className="text-sm mb-2 block">
                  What are you offering?
                </Label>
                <Textarea
                  id="product-description"
                  placeholder="Example: Our protocol is a decentralized exchange built on Arbitrum, offering low-fee swaps with deep liquidity. Users can trade, provide liquidity, and earn yield through our native token staking program."
                  value={campaignProductDescription}
                  onChange={(e) => setCampaignProductDescription(e.target.value)}
                  rows={5}
                  className="resize-none text-sm"
                />
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div>
            <div className="mb-3">
              <Label className="text-sm font-medium block">Instructions</Label>
              <p className="text-xs text-muted-foreground mt-1">Additional information for creators</p>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="brand-tag" className="text-sm mb-2 block">
                  Should the creator tag your project? (optional)
                </Label>
                <Textarea
                  id="brand-tag"
                  placeholder="Example: @myproject"
                  value={campaignBrandTag}
                  onChange={(e) => setCampaignBrandTag(e.target.value)}
                  rows={2}
                  className="resize-none text-sm"
                />
              </div>
              <div>
                <Label htmlFor="hashtags" className="text-sm mb-2 block">
                  Should the creator add any hashtags? (optional)
                </Label>
                <Textarea
                  id="hashtags"
                  placeholder="Example: #mycampaign, #myproject, #DeFi"
                  value={campaignHashtags}
                  onChange={(e) => setCampaignHashtags(e.target.value)}
                  rows={2}
                  className="resize-none text-sm"
                />
              </div>
              <div>
                <Label htmlFor="creator-script" className="text-sm mb-2 block">
                  What should the creator say? (optional)
                </Label>
                <Textarea
                  id="creator-script"
                  placeholder="Example: I've been using this protocol for a month and the gas fees are incredibly low..."
                  value={campaignCreatorScript}
                  onChange={(e) => setCampaignCreatorScript(e.target.value)}
                  rows={4}
                  className="resize-none text-sm"
                />
              </div>
              <div>
                <Label htmlFor="detailed-requirements" className="text-sm mb-2 block">
                  Detailed requirements and specifications (optional)
                </Label>
                <Textarea
                  id="detailed-requirements"
                  placeholder="e.g., 2 Twitter threads, 1 Telegram AMA, 1 YouTube review. Include any specific requirements, talking points, dos and don'ts, or detailed instructions for creators..."
                  value={campaignDetailedRequirements}
                  onChange={(e) => setCampaignDetailedRequirements(e.target.value)}
                  rows={6}
                  className="resize-none text-sm"
                />
              </div>
            </div>
          </div>

          {/* Budget Range */}
          <div>
            <Label className="text-sm font-medium mb-2 block">
              Budget per Influencer
            </Label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="budget-min" className="text-xs text-muted-foreground mb-1.5 block">
                  Minimum
                </Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="budget-min"
                    type="number"
                    min="20"
                    placeholder="1000"
                    value={campaignBudgetMin}
                    onChange={(e) => setCampaignBudgetMin(e.target.value)}
                    className="pl-10 h-11"
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="budget-max" className="text-xs text-muted-foreground mb-1.5 block">
                  Maximum
                </Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="budget-max"
                    type="number"
                    min={campaignBudgetMin || "100"}
                    placeholder="5000"
                    value={campaignBudgetMax}
                    onChange={(e) => setCampaignBudgetMax(e.target.value)}
                    className="pl-10 h-11"
                    required
                  />
                </div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Set a budget range per influencer (in USDC/USDT). Creators will see this range when applying.
            </p>

            {/* Total Campaign Budget */}
            {campaignInfluencerCount && (parseInt(campaignBudgetMin) > 0 || parseInt(campaignBudgetMax) > 0) && (
              <div className="mt-4 p-4 bg-muted/30 rounded-lg border border-border">
                <Label className="text-xs text-muted-foreground mb-2 block uppercase tracking-wide">
                  Total Campaign Budget
                </Label>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-primary">
                    ${campaignBudgetMin && parseInt(campaignBudgetMin) > 0
                      ? (parseInt(campaignBudgetMin) * parseInt(campaignInfluencerCount)).toLocaleString()
                      : "0"}
                  </span>
                  <span className="text-muted-foreground">-</span>
                  <span className="text-2xl font-bold text-primary">
                    ${campaignBudgetMax && parseInt(campaignBudgetMax) > 0
                      ? (parseInt(campaignBudgetMax) * parseInt(campaignInfluencerCount)).toLocaleString()
                      : "0"}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Based on {campaignInfluencerCount} influencer{parseInt(campaignInfluencerCount) !== 1 ? 's' : ''}
                </p>
              </div>
            )}

            {/* Market Rate Warnings */}
            {campaignBudgetMax && campaignPricingModels.length > 0 && (
              <div className="mt-3 space-y-2">
                {campaignPricingModels.includes("cpm") && campaignTargetViews && parseInt(campaignTargetViews) > 0 && (
                  (() => {
                    const effectiveCPM = (parseInt(campaignBudgetMax) / parseInt(campaignTargetViews)) * 1000;
                    const isBelowMarket = effectiveCPM < PRICING_MIN_RATES.CPM;
                    return isBelowMarket ? (
                      <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg">
                        <div className="flex items-start gap-2">
                          <Bell className="h-4 w-4 text-warning shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-warning">CPM below market rate</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Your effective CPM is ${effectiveCPM.toFixed(2)}, which is below the market minimum of ${PRICING_MIN_RATES.CPM}.
                              This may reduce the likelihood of finding influencers who will accept this campaign.
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : null;
                  })()
                )}

                {campaignPricingModels.includes("cpc") && campaignTargetClicks && parseInt(campaignTargetClicks) > 0 && (
                  (() => {
                    const effectiveCPC = parseInt(campaignBudgetMax) / parseInt(campaignTargetClicks);
                    const isBelowMarket = effectiveCPC < PRICING_MIN_RATES.CPC;
                    return isBelowMarket ? (
                      <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg">
                        <div className="flex items-start gap-2">
                          <Bell className="h-4 w-4 text-warning shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-warning">CPC below market rate</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Your effective CPC is ${effectiveCPC.toFixed(2)}, which is below the market minimum of ${PRICING_MIN_RATES.CPC}.
                              This may reduce the likelihood of finding influencers who will accept this campaign.
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : null;
                  })()
                )}

                {campaignPricingModels.includes("cpe") && campaignTargetEngagements && parseInt(campaignTargetEngagements) > 0 && (
                  (() => {
                    const effectiveCPE = parseInt(campaignBudgetMax) / parseInt(campaignTargetEngagements);
                    const isBelowMarket = effectiveCPE < PRICING_MIN_RATES.CPE;
                    return isBelowMarket ? (
                      <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg">
                        <div className="flex items-start gap-2">
                          <Bell className="h-4 w-4 text-warning shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-warning">CPE below market rate</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Your effective CPE is ${effectiveCPE.toFixed(2)}, which is below the market minimum of ${PRICING_MIN_RATES.CPE}.
                              This may reduce the likelihood of finding influencers who will accept this campaign.
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : null;
                  })()
                )}
              </div>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1 h-11 bg-gradient-to-r from-primary to-secondary hover:opacity-90">
              <Rocket className="h-4 w-4 mr-2" />
              Launch Campaign
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-11"
              onClick={async () => {
                try {
                  const res = await fetch('/api/campaigns', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      title: campaignTitle || 'Untitled Campaign',
                      description: campaignDescription,
                      budgetMin: parseFloat(campaignBudgetMin) || 20,
                      budgetMax: parseFloat(campaignBudgetMax) || 20,
                      desiredInfluencerCount: parseInt(campaignInfluencerCount) || 1,
                      deliverables: campaignDetailedRequirements,
                      status: 'DRAFT',
                      goal: campaignGoal,
                      platforms: campaignPlatforms,
                      contentFormats: campaignContentFormats,
                      contentType: campaignContentType,
                      influencerNiches: campaignInfluencerNiches,
                      pricingModels: campaignPricingModels,
                      targetViews: campaignTargetViews,
                      targetClicks: campaignTargetClicks,
                      targetEngagements: campaignTargetEngagements,
                      productName: campaignProductName,
                      productPrice: campaignProductPrice,
                      productPhoto: campaignProductPhoto,
                      productLink: campaignProductLink,
                      productDescription: campaignProductDescription,
                      brandTag: campaignBrandTag,
                      hashtags: campaignHashtags,
                      creatorScript: campaignCreatorScript,
                    }),
                  });
                  if (res.ok) {
                    const data = await res.json();
                    const newCampaign = { ...buildCampaignFromForm("draft"), id: data.campaign?.id };
                    setCampaigns([newCampaign, ...campaigns]);
                    clearForm();
                    showToast("Draft saved successfully");
                    setActiveTab("campaigns");
                  } else {
                    const errData = await res.json().catch(() => ({}));
                    showToast(errData.error || "Failed to save draft", 'error');
                  }
                } catch {
                  showToast("Failed to save draft", 'error');
                }
              }}
            >
              Save Draft
            </Button>
          </div>
        </form>
      </Card>
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg border backdrop-blur-sm ${
          toast.variant === 'success'
            ? 'bg-green-50 border-green-200 text-green-800'
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          <div className="flex items-center gap-2">
            {toast.variant === 'success' ? (
              <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />
            )}
            <p className="text-sm font-medium">{toast.message}</p>
          </div>
        </div>
      )}
    </motion.div>
  );
}
