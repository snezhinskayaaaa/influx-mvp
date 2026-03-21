"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/date-picker";
import { motion } from "framer-motion";
import {
  Instagram,
  Twitter,
  DollarSign,
  Video,
  Youtube,
  Rocket,
  Bell,
  Sparkles,
  MessageSquare,
  Package,
  BookOpen,
} from "lucide-react";
import type { Tab, Campaign } from "./types";
import { PRICING_MIN_RATES } from "./types";

interface CreateCampaignTabProps {
  campaigns: Campaign[];
  setCampaigns: React.Dispatch<React.SetStateAction<Campaign[]>>;
  setActiveTab: (tab: Tab) => void;
}

export function CreateCampaignTab({ campaigns, setCampaigns, setActiveTab }: CreateCampaignTabProps) {
  const [campaignTitle, setCampaignTitle] = useState("");
  const [campaignBudgetMin, setCampaignBudgetMin] = useState("");
  const [campaignBudgetMax, setCampaignBudgetMax] = useState("");
  const [campaignDescription, setCampaignDescription] = useState("");
  const [campaignGoal, setCampaignGoal] = useState("");
  const [campaignStartDate, setCampaignStartDate] = useState<Date | undefined>(undefined);
  const [campaignEndDate, setCampaignEndDate] = useState<Date | undefined>(undefined);
  const [campaignInfluencerCount, setCampaignInfluencerCount] = useState("");
  const [campaignPlatforms, setCampaignPlatforms] = useState<string[]>([]);
  const [campaignContentFormats, setCampaignContentFormats] = useState<string[]>([]);
  const [campaignContentType, setCampaignContentType] = useState<string>("");
  const [campaignInfluencerNiches, setCampaignInfluencerNiches] = useState<string[]>([]);
  const [campaignPricingModels, setCampaignPricingModels] = useState<string[]>([]);
  const [campaignTargetViews, setCampaignTargetViews] = useState("");
  const [campaignTargetClicks, setCampaignTargetClicks] = useState("");
  const [campaignTargetEngagements, setCampaignTargetEngagements] = useState("");
  const [campaignBrandTag, setCampaignBrandTag] = useState("");
  const [campaignHashtags, setCampaignHashtags] = useState("");
  const [campaignCreatorScript, setCampaignCreatorScript] = useState("");
  const [campaignDetailedRequirements, setCampaignDetailedRequirements] = useState("");
  const [campaignProductName, setCampaignProductName] = useState("");
  const [campaignProductPrice, setCampaignProductPrice] = useState("");
  const [campaignProductPhoto, setCampaignProductPhoto] = useState("");
  const [campaignProductLink, setCampaignProductLink] = useState("");
  const [campaignProductDescription, setCampaignProductDescription] = useState("");

  const clearForm = () => {
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
        <p className="text-muted-foreground text-sm sm:text-base">Launch your next influencer campaign</p>
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
                budgetMin: parseFloat(campaignBudgetMin) || 0,
                budgetMax: parseFloat(campaignBudgetMax) || 0,
                desiredInfluencerCount: parseInt(campaignInfluencerCount) || 1,
                deliverables: campaignDetailedRequirements,
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
              alert(errData.error || "Failed to create campaign");
              return;
            }
          } catch (error) {
            console.error('Failed to create campaign via API:', error);
            alert("Failed to create campaign. Please try again.");
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
              placeholder="e.g., Summer Collection Launch"
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
              placeholder="Describe your campaign goals, target audience, and requirements..."
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
                { id: "brand-awareness", name: "Brand Awareness" },
                { id: "engagement", name: "Engagement" },
                { id: "conversions", name: "Conversions" },
                { id: "product-launch", name: "Product Launch" },
                { id: "lead-generation", name: "Lead Generation" },
                { id: "traffic", name: "Website Traffic" }
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
                { id: "instagram", name: "Instagram", icon: Instagram },
                { id: "tiktok", name: "TikTok", icon: Video },
                { id: "youtube", name: "YouTube", icon: Youtube },
                { id: "twitter", name: "Twitter", icon: Twitter }
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
                  <button
                    type="button"
                    onClick={() => {
                      const format = "twitter-post";
                      if (campaignContentFormats.includes(format)) {
                        setCampaignContentFormats(campaignContentFormats.filter(f => f !== format));
                      } else {
                        setCampaignContentFormats([...campaignContentFormats, format]);
                      }
                    }}
                    className={`p-3 rounded-xl border-2 text-sm transition-all ${
                      campaignContentFormats.includes("twitter-post")
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    Twitter Post
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Pricing Models */}
          <div>
            <Label className="text-sm font-medium mb-3 block">
              Pricing Models
            </Label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: "cpm", name: "CPM", description: "Cost per 1,000 views" },
                { id: "cpc", name: "CPC", description: "Cost per click" },
                { id: "cpe", name: "CPE", description: "Cost per engagement" }
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
                { id: "testimonial", title: "Testimonial", description: "Honest statement about your product from a customer's perspective", icon: MessageSquare },
                { id: "unboxing", title: "Unboxing", description: "Taking your product out of its original box and doing a short review", icon: Package },
                { id: "how-to", title: "How to", description: "Creators will record themselves explaining how your product works", icon: BookOpen }
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
              Select the niches that best match your product or campaign
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                "Beauty & Care",
                "Tech & Gaming",
                "Fashion & Apparel",
                "Health & Wellness",
                "Food & Beverages",
                "Sports & Fitness",
                "Travel & Hospitality",
                "Home & Garden",
                "Entertainment",
                "Education",
                "Finance",
                "Automotive",
                "Pets",
                "Kids & Family",
                "Lifestyle",
                "Business & Finance",
                "Music",
                "Art & Design",
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
              <Label className="text-sm font-medium block">Product details</Label>
              <p className="text-xs text-muted-foreground mt-1">This information is visible to creators so please make sure it&apos;s up to date.</p>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="product-name" className="text-sm mb-2 block">
                  Product Name
                </Label>
                <Input
                  id="product-name"
                  placeholder="e.g., Wireless Headphones Pro"
                  value={campaignProductName}
                  onChange={(e) => setCampaignProductName(e.target.value)}
                  className="h-11"
                />
              </div>
              <div>
                <Label htmlFor="product-price" className="text-sm mb-2 block">
                  Product Price
                </Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="product-price"
                    type="number"
                    placeholder="99.99"
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
                  Product Photo URL
                </Label>
                <Input
                  id="product-photo"
                  type="url"
                  placeholder="https://example.com/product-image.jpg"
                  value={campaignProductPhoto}
                  onChange={(e) => setCampaignProductPhoto(e.target.value)}
                  className="h-11"
                />
              </div>
              <div>
                <Label htmlFor="product-link" className="text-sm mb-2 block">
                  Product Link
                </Label>
                <Input
                  id="product-link"
                  type="url"
                  placeholder="https://yourstore.com/product"
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
                  placeholder="Example: Gymshark clothes use high-quality material and are engineered to be worn in the gym but when you're not working out, the clothes are designed to well, make you look well. If you're fit and toned and want people to know it, then Gymshark clothes are popular pieces of fitness apparel."
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
                  Should the creator tag your brand? (optional)
                </Label>
                <Textarea
                  id="brand-tag"
                  placeholder="Example: @mybrand"
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
                  placeholder="Example: #mycampaign, #mybrand"
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
                  placeholder="Example: I like the product because it's comfortable and stylish."
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
                  placeholder="Describe any specific requirements, technical specifications, dos and don'ts, brand guidelines, or detailed instructions for creators..."
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
                    min="100"
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
              Set a budget range per influencer. Influencers will see this range when applying.
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
              onClick={() => {
                const newCampaign = buildCampaignFromForm("draft");
                setCampaigns([newCampaign, ...campaigns]);
                clearForm();
                setActiveTab("campaigns");
              }}
            >
              Save Draft
            </Button>
          </div>
        </form>
      </Card>
    </motion.div>
  );
}
