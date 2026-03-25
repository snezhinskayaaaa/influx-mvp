"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { motion } from "framer-motion";
import {
  Search,
  Users,
  Instagram,
  Twitter,
  Plus,
  BarChart3,
  Save,
  CheckCircle2,
  Clock,
  Eye,
  Heart,
  MessageCircle,
  Wallet,
  ChevronDown,
  Video,
  Youtube,
  Rocket,
  ArrowRight,
  MessageSquare,
  Briefcase,
  Pencil,
  Pause,
  Trash2,
  AlertCircle,
  ExternalLink,
  Camera,
} from "lucide-react";
import type { Tab, Campaign, CampaignApplication } from "./types";

interface CampaignsTabProps {
  campaigns: Campaign[];
  setCampaigns: React.Dispatch<React.SetStateAction<Campaign[]>>;
  setActiveTab: (tab: Tab) => void;
  balance: number;
  setShowInsufficientFundsDialog: (show: boolean) => void;
}

export function CampaignsTab({
  campaigns,
  setCampaigns,
  setActiveTab,
  balance,
  setShowInsufficientFundsDialog,
}: CampaignsTabProps) {
  const [toast, setToast] = useState<{ message: string; variant: 'success' | 'error' } | null>(null);

  const showToast = (message: string, variant: 'success' | 'error' = 'success') => {
    setToast({ message, variant });
    setTimeout(() => setToast(null), 4000);
  };

  const [selectedCampaignDetails, setSelectedCampaignDetails] = useState<Campaign | null>(null);
  const [campaignSearchQuery, setCampaignSearchQuery] = useState("");
  const [campaignStatusFilter, setCampaignStatusFilter] = useState<"all" | "active" | "draft">("all");
  const [isCampaignDetailsExpanded, setIsCampaignDetailsExpanded] = useState(false);
  const [isApplicationsExpanded, setIsApplicationsExpanded] = useState(false);
  const [isEditingCampaign, setIsEditingCampaign] = useState(false);
  const [editedCampaignData, setEditedCampaignData] = useState<Campaign | null>(null);
  const [selectedInfluencerForPipeline, setSelectedInfluencerForPipeline] = useState<CampaignApplication | null>(null);
  const [showInfluencerSelector, setShowInfluencerSelector] = useState(false);
  const [brandFeedbackText, setBrandFeedbackText] = useState("");

  return (
    <motion.div
      key="campaigns"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      {selectedCampaignDetails ? (
        <>
          <div className="mb-6 flex items-start justify-between">
            <div>
              <Button
                variant="outline"
                className="mb-4 hover:bg-muted"
                onClick={() => {
                  setSelectedCampaignDetails(null);
                  setIsCampaignDetailsExpanded(false);
                  setIsEditingCampaign(false);
                }}
              >
                <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
                Back to Campaigns
              </Button>
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">{selectedCampaignDetails.title}</h1>
              <div className="flex items-center gap-2">
                <Badge
                  variant={selectedCampaignDetails.status === "active" ? "default" : "secondary"}
                  className={selectedCampaignDetails.status === "active" ? "bg-success/10 text-success border-success/20" : "bg-primary/10 text-primary border-primary/20"}
                >
                  <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${selectedCampaignDetails.status === "active" ? "bg-success" : "bg-primary"}`} />
                  {selectedCampaignDetails.status === "active" ? "Active" : "Draft"}
                </Badge>
                <Badge variant="outline" className="bg-muted text-foreground border-border">
                  ${selectedCampaignDetails.budgetMin} - ${selectedCampaignDetails.budgetMax} / influencer
                </Badge>
              </div>
            </div>
            <div className="flex gap-2">
              {isEditingCampaign && (
                <Button
                  className="bg-gradient-to-r from-primary to-secondary"
                  onClick={() => {
                    if (editedCampaignData) {
                      // Update campaign in campaigns list
                      setCampaigns(campaigns.map(c =>
                        c.id === editedCampaignData.id ? editedCampaignData : c
                      ));
                      setSelectedCampaignDetails(editedCampaignData);
                      setIsEditingCampaign(false);
                    }
                  }}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              )}
              <Button
                variant="outline"
                className="hover:bg-muted"
                onClick={() => {
                  if (isEditingCampaign) {
                    setIsEditingCampaign(false);
                    setEditedCampaignData(null);
                  } else {
                    setIsEditingCampaign(true);
                    setEditedCampaignData(selectedCampaignDetails);
                  }
                }}
              >
                <Pencil className="h-4 w-4 mr-2" />
                {isEditingCampaign ? "Cancel" : "Edit"}
              </Button>
            </div>
          </div>

          {/* Brief Info Card */}
          <Card className="p-6 mb-6">
            <div className="space-y-4">
              {/* Brief Info */}
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <Label className="text-xs text-muted-foreground mb-1 block">Start Date</Label>
                  {isEditingCampaign && editedCampaignData ? (
                    <Input
                      type="date"
                      value={editedCampaignData.startDate || ""}
                      onChange={(e) => setEditedCampaignData({...editedCampaignData, startDate: e.target.value})}
                      className="h-9"
                    />
                  ) : (
                    <div className="text-sm font-medium">
                      {selectedCampaignDetails.startDate
                        ? new Date(selectedCampaignDetails.startDate).toLocaleDateString()
                        : "Not set"}
                    </div>
                  )}
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground mb-1 block">End Date</Label>
                  {isEditingCampaign && editedCampaignData ? (
                    <Input
                      type="date"
                      value={editedCampaignData.endDate || ""}
                      onChange={(e) => setEditedCampaignData({...editedCampaignData, endDate: e.target.value})}
                      className="h-9"
                    />
                  ) : (
                    <div className="text-sm font-medium">
                      {selectedCampaignDetails.endDate
                        ? new Date(selectedCampaignDetails.endDate).toLocaleDateString()
                        : "Not set"}
                    </div>
                  )}
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground mb-1 block">Target Influencers</Label>
                  {isEditingCampaign && editedCampaignData ? (
                    <Input
                      type="number"
                      value={editedCampaignData.influencerCount || ""}
                      onChange={(e) => setEditedCampaignData({...editedCampaignData, influencerCount: e.target.value})}
                      className="h-9"
                    />
                  ) : (
                    <div className="text-sm font-medium">{selectedCampaignDetails.influencerCount || "0"}</div>
                  )}
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground mb-1 block">Goal</Label>
                  {isEditingCampaign && editedCampaignData ? (
                    <Select
                      value={editedCampaignData.goal || ""}
                      onValueChange={(value) => setEditedCampaignData({...editedCampaignData, goal: value})}
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="brand-awareness">Brand Awareness</SelectItem>
                        <SelectItem value="engagement">Engagement</SelectItem>
                        <SelectItem value="conversions">Conversions</SelectItem>
                        <SelectItem value="traffic">Traffic</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="text-sm font-medium capitalize">
                      {selectedCampaignDetails.goal?.replace("-", " ") || "Not set"}
                    </div>
                  )}
                </div>
              </div>

              {/* Target Metrics */}
              {(selectedCampaignDetails.targetViews || selectedCampaignDetails.targetClicks ||
                selectedCampaignDetails.targetEngagements) && (
                <div className="border-t pt-4">
                  <Label className="text-xs text-muted-foreground mb-3 block uppercase tracking-wide">Target Metrics</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {selectedCampaignDetails.targetViews && (
                      <div className="bg-muted/30 rounded-lg p-3">
                        <div className="text-xs text-muted-foreground mb-1">Target Views</div>
                        <div className="text-lg font-bold text-primary">
                          {parseInt(selectedCampaignDetails.targetViews).toLocaleString()}
                        </div>
                      </div>
                    )}
                    {selectedCampaignDetails.targetClicks && (
                      <div className="bg-muted/30 rounded-lg p-3">
                        <div className="text-xs text-muted-foreground mb-1">Target Clicks</div>
                        <div className="text-lg font-bold text-primary">
                          {parseInt(selectedCampaignDetails.targetClicks).toLocaleString()}
                        </div>
                      </div>
                    )}
                    {selectedCampaignDetails.targetEngagements && (
                      <div className="bg-muted/30 rounded-lg p-3">
                        <div className="text-xs text-muted-foreground mb-1">Target Engagements</div>
                        <div className="text-lg font-bold text-primary">
                          {parseInt(selectedCampaignDetails.targetEngagements).toLocaleString()}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Expand Button */}
              <Button
                variant="outline"
                className="w-full hover:bg-muted"
                onClick={() => setIsCampaignDetailsExpanded(!isCampaignDetailsExpanded)}
              >
                {isCampaignDetailsExpanded ? "Hide" : "Show"} Full Details
                <ChevronDown className={`ml-2 h-4 w-4 transition-transform ${isCampaignDetailsExpanded ? "rotate-180" : ""}`} />
              </Button>

              {/* Expanded Details */}
              {isCampaignDetailsExpanded && (
                <div className="space-y-4 border-t pt-4">
                  <div>
                    <Label className="text-sm font-semibold mb-2 block">Description</Label>
                    {isEditingCampaign && editedCampaignData ? (
                      <Textarea
                        value={editedCampaignData.description || ""}
                        onChange={(e) => setEditedCampaignData({...editedCampaignData, description: e.target.value})}
                        rows={3}
                        className="resize-none"
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground">{selectedCampaignDetails.description || "Not set"}</p>
                    )}
                  </div>

                  {/* Budget per Influencer */}
                  <div>
                    <Label className="text-sm font-semibold mb-2 block">Budget per Influencer</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs text-muted-foreground mb-1 block">Minimum</Label>
                        {isEditingCampaign && editedCampaignData ? (
                          <Input
                            type="number"
                            value={editedCampaignData.budgetMin || ""}
                            onChange={(e) => setEditedCampaignData({...editedCampaignData, budgetMin: e.target.value})}
                          />
                        ) : (
                          <p className="text-sm text-muted-foreground">${selectedCampaignDetails.budgetMin}</p>
                        )}
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground mb-1 block">Maximum</Label>
                        {isEditingCampaign && editedCampaignData ? (
                          <Input
                            type="number"
                            value={editedCampaignData.budgetMax || ""}
                            onChange={(e) => setEditedCampaignData({...editedCampaignData, budgetMax: e.target.value})}
                          />
                        ) : (
                          <p className="text-sm text-muted-foreground">${selectedCampaignDetails.budgetMax}</p>
                        )}
                      </div>
                    </div>

                    {/* Total Campaign Budget Calculation */}
                    {selectedCampaignDetails.influencerCount && (parseInt(selectedCampaignDetails.budgetMin) > 0 || parseInt(selectedCampaignDetails.budgetMax) > 0) && (
                      <div className="mt-3 p-3 bg-primary/5 rounded-lg border border-primary/20">
                        <Label className="text-xs text-muted-foreground mb-1.5 block">Total Campaign Budget</Label>
                        <div className="flex items-baseline gap-2">
                          <span className="text-lg font-bold text-primary">
                            ${isEditingCampaign && editedCampaignData?.budgetMin
                              ? (parseInt(editedCampaignData.budgetMin) * parseInt(isEditingCampaign && editedCampaignData?.influencerCount || selectedCampaignDetails.influencerCount)).toLocaleString()
                              : (parseInt(selectedCampaignDetails.budgetMin) * parseInt(selectedCampaignDetails.influencerCount)).toLocaleString()}
                          </span>
                          <span className="text-muted-foreground text-sm">-</span>
                          <span className="text-lg font-bold text-primary">
                            ${isEditingCampaign && editedCampaignData?.budgetMax
                              ? (parseInt(editedCampaignData.budgetMax) * parseInt(isEditingCampaign && editedCampaignData?.influencerCount || selectedCampaignDetails.influencerCount)).toLocaleString()
                              : (parseInt(selectedCampaignDetails.budgetMax) * parseInt(selectedCampaignDetails.influencerCount)).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          For {isEditingCampaign && editedCampaignData?.influencerCount || selectedCampaignDetails.influencerCount} influencer{parseInt(isEditingCampaign && editedCampaignData?.influencerCount || selectedCampaignDetails.influencerCount) !== 1 ? 's' : ''}
                        </p>
                      </div>
                    )}
                  </div>

                  <div>
                    <Label className="text-sm font-semibold mb-2 block">Platforms</Label>
                    {isEditingCampaign && editedCampaignData ? (
                      <div className="space-y-2">
                        {["instagram", "tiktok", "youtube", "twitter"].map((platform) => (
                          <div key={platform} className="flex items-center space-x-2">
                            <Checkbox
                              id={`platform-${platform}`}
                              checked={editedCampaignData.platforms?.includes(platform) || false}
                              onCheckedChange={(checked) => {
                                const currentPlatforms = editedCampaignData.platforms || [];
                                const newPlatforms = checked
                                  ? [...currentPlatforms, platform]
                                  : currentPlatforms.filter((p) => p !== platform);
                                setEditedCampaignData({...editedCampaignData, platforms: newPlatforms});
                              }}
                            />
                            <label
                              htmlFor={`platform-${platform}`}
                              className="text-sm font-medium capitalize cursor-pointer flex items-center"
                            >
                              {platform === "instagram" && <Instagram className="h-4 w-4 mr-2" />}
                              {platform === "tiktok" && <Video className="h-4 w-4 mr-2" />}
                              {platform === "youtube" && <Youtube className="h-4 w-4 mr-2" />}
                              {platform === "twitter" && <Twitter className="h-4 w-4 mr-2" />}
                              {platform}
                            </label>
                          </div>
                        ))}
                      </div>
                    ) : selectedCampaignDetails.platforms && selectedCampaignDetails.platforms.length > 0 ? (
                      <div className="flex gap-2">
                        {selectedCampaignDetails.platforms.map((platform) => (
                          <Badge key={platform} variant="outline" className="capitalize">
                            {platform === "instagram" && <Instagram className="h-3 w-3 mr-1" />}
                            {platform === "tiktok" && <Video className="h-3 w-3 mr-1" />}
                            {platform === "youtube" && <Youtube className="h-3 w-3 mr-1" />}
                            {platform === "twitter" && <Twitter className="h-3 w-3 mr-1" />}
                            {platform}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">Not set</p>
                    )}
                  </div>

                  {/* Content Formats */}
                  <div>
                    <Label className="text-sm font-semibold mb-2 block">Content Formats</Label>
                    {isEditingCampaign && editedCampaignData ? (
                      <div className="space-y-2">
                        {["video", "photo", "story", "reel", "carousel", "live"].map((format) => (
                          <div key={format} className="flex items-center space-x-2">
                            <Checkbox
                              id={`format-${format}`}
                              checked={editedCampaignData.contentFormats?.includes(format) || false}
                              onCheckedChange={(checked) => {
                                const currentFormats = editedCampaignData.contentFormats || [];
                                const newFormats = checked
                                  ? [...currentFormats, format]
                                  : currentFormats.filter((f) => f !== format);
                                setEditedCampaignData({...editedCampaignData, contentFormats: newFormats});
                              }}
                            />
                            <label
                              htmlFor={`format-${format}`}
                              className="text-sm font-medium capitalize cursor-pointer"
                            >
                              {format}
                            </label>
                          </div>
                        ))}
                      </div>
                    ) : selectedCampaignDetails.contentFormats && selectedCampaignDetails.contentFormats.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {selectedCampaignDetails.contentFormats.map((format) => (
                          <Badge key={format} variant="secondary" className="text-xs capitalize">
                            {format.replace("-", " ")}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">Not set</p>
                    )}
                  </div>

                  {/* Pricing Models */}
                  <div>
                    <Label className="text-sm font-semibold mb-2 block">Pricing Models</Label>
                    {isEditingCampaign && editedCampaignData ? (
                      <div className="space-y-2">
                        {["CPM", "CPC", "CPE"].map((model) => (
                          <div key={model} className="flex items-center space-x-2">
                            <Checkbox
                              id={`pricing-${model}`}
                              checked={editedCampaignData.pricingModels?.includes(model) || false}
                              onCheckedChange={(checked) => {
                                const currentModels = editedCampaignData.pricingModels || [];
                                const newModels = checked
                                  ? [...currentModels, model]
                                  : currentModels.filter((m) => m !== model);
                                setEditedCampaignData({...editedCampaignData, pricingModels: newModels});
                              }}
                            />
                            <label
                              htmlFor={`pricing-${model}`}
                              className="text-sm font-medium uppercase cursor-pointer"
                            >
                              {model}
                            </label>
                          </div>
                        ))}
                      </div>
                    ) : selectedCampaignDetails.pricingModels && selectedCampaignDetails.pricingModels.length > 0 ? (
                      <div className="flex gap-2">
                        {selectedCampaignDetails.pricingModels.map((model) => (
                          <Badge key={model} variant="outline" className="uppercase">
                            {model}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">Not set</p>
                    )}
                  </div>

                  {/* Campaign Goals */}
                  {(selectedCampaignDetails.targetViews || selectedCampaignDetails.targetClicks ||
                    selectedCampaignDetails.targetEngagements ||
                    (isEditingCampaign && editedCampaignData?.pricingModels && editedCampaignData.pricingModels.length > 0)) && (
                    <div>
                      <Label className="text-sm font-semibold mb-2 block">Campaign Goals</Label>
                      <div className="space-y-2">
                        {(selectedCampaignDetails.targetViews || (isEditingCampaign && editedCampaignData?.pricingModels?.includes("CPM"))) && (
                          <div>
                            <Label className="text-xs text-muted-foreground mb-1 block">Target Views</Label>
                            {isEditingCampaign && editedCampaignData ? (
                              <Input
                                type="number"
                                value={editedCampaignData.targetViews || ""}
                                onChange={(e) => setEditedCampaignData({...editedCampaignData, targetViews: e.target.value})}
                                placeholder="e.g., 100000"
                              />
                            ) : (
                              <p className="text-sm font-medium">{selectedCampaignDetails.targetViews?.toLocaleString() || "Not set"}</p>
                            )}
                          </div>
                        )}
                        {(selectedCampaignDetails.targetClicks || (isEditingCampaign && editedCampaignData?.pricingModels?.includes("CPC"))) && (
                          <div>
                            <Label className="text-xs text-muted-foreground mb-1 block">Target Clicks</Label>
                            {isEditingCampaign && editedCampaignData ? (
                              <Input
                                type="number"
                                value={editedCampaignData.targetClicks || ""}
                                onChange={(e) => setEditedCampaignData({...editedCampaignData, targetClicks: e.target.value})}
                                placeholder="e.g., 5000"
                              />
                            ) : (
                              <p className="text-sm font-medium">{selectedCampaignDetails.targetClicks?.toLocaleString() || "Not set"}</p>
                            )}
                          </div>
                        )}
                        {(selectedCampaignDetails.targetEngagements || (isEditingCampaign && editedCampaignData?.pricingModels?.includes("CPE"))) && (
                          <div>
                            <Label className="text-xs text-muted-foreground mb-1 block">Target Engagements</Label>
                            {isEditingCampaign && editedCampaignData ? (
                              <Input
                                type="number"
                                value={editedCampaignData.targetEngagements || ""}
                                onChange={(e) => setEditedCampaignData({...editedCampaignData, targetEngagements: e.target.value})}
                                placeholder="e.g., 10000"
                              />
                            ) : (
                              <p className="text-sm font-medium">{selectedCampaignDetails.targetEngagements?.toLocaleString() || "Not set"}</p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Content Type */}
                  <div>
                    <Label className="text-sm font-semibold mb-2 block">Content Type</Label>
                    {isEditingCampaign && editedCampaignData ? (
                      <Select
                        value={editedCampaignData.contentType || ""}
                        onValueChange={(value) => setEditedCampaignData({...editedCampaignData, contentType: value})}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select content type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="product-review">Product Review</SelectItem>
                          <SelectItem value="tutorial">Tutorial</SelectItem>
                          <SelectItem value="unboxing">Unboxing</SelectItem>
                          <SelectItem value="lifestyle">Lifestyle</SelectItem>
                          <SelectItem value="testimonial">Testimonial</SelectItem>
                          <SelectItem value="brand-awareness">Brand Awareness</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : selectedCampaignDetails.contentType ? (
                      <Badge variant="outline" className="capitalize">
                        {selectedCampaignDetails.contentType.replace("-", " ")}
                      </Badge>
                    ) : (
                      <p className="text-sm text-muted-foreground">Not set</p>
                    )}
                  </div>

                  <div>
                    <Label className="text-sm font-semibold mb-2 block">Influencer Niches</Label>
                    {isEditingCampaign && editedCampaignData ? (
                      <div className="grid grid-cols-2 gap-2">
                        {["Fashion", "Beauty", "Tech", "Gaming", "Fitness", "Food", "Travel", "Lifestyle"].map((niche) => (
                          <div key={niche} className="flex items-center space-x-2">
                            <Checkbox
                              id={`niche-${niche}`}
                              checked={editedCampaignData.influencerNiches?.includes(niche) || false}
                              onCheckedChange={(checked) => {
                                const currentNiches = editedCampaignData.influencerNiches || [];
                                const newNiches = checked
                                  ? [...currentNiches, niche]
                                  : currentNiches.filter((n) => n !== niche);
                                setEditedCampaignData({...editedCampaignData, influencerNiches: newNiches});
                              }}
                            />
                            <label
                              htmlFor={`niche-${niche}`}
                              className="text-sm font-medium cursor-pointer"
                            >
                              {niche}
                            </label>
                          </div>
                        ))}
                      </div>
                    ) : selectedCampaignDetails.influencerNiches && selectedCampaignDetails.influencerNiches.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {selectedCampaignDetails.influencerNiches.map((niche) => (
                          <Badge key={niche} variant="outline" className="text-xs">
                            {niche}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">Not set</p>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="border-t pt-4">
                    <Label className="text-sm font-semibold mb-3 block">Product Details</Label>
                    <div className="space-y-3">
                      <div>
                        <Label className="text-xs text-muted-foreground mb-1 block">Product Name</Label>
                        {isEditingCampaign && editedCampaignData ? (
                          <Input
                            value={editedCampaignData.productName || ""}
                            onChange={(e) => setEditedCampaignData({...editedCampaignData, productName: e.target.value})}
                            placeholder="Enter product name"
                          />
                        ) : (
                          <p className="text-sm">{selectedCampaignDetails.productName || "Not set"}</p>
                        )}
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground mb-1 block">Product Price</Label>
                        {isEditingCampaign && editedCampaignData ? (
                          <Input
                            type="number"
                            value={editedCampaignData.productPrice || ""}
                            onChange={(e) => setEditedCampaignData({...editedCampaignData, productPrice: e.target.value})}
                            placeholder="Enter product price"
                          />
                        ) : (
                          <p className="text-sm font-medium">
                            {selectedCampaignDetails.productPrice ? `$${selectedCampaignDetails.productPrice}` : "Not set"}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground mb-1 block">Product Link</Label>
                        {isEditingCampaign && editedCampaignData ? (
                          <Input
                            value={editedCampaignData.productLink || ""}
                            onChange={(e) => setEditedCampaignData({...editedCampaignData, productLink: e.target.value})}
                            placeholder="https://example.com/product"
                          />
                        ) : selectedCampaignDetails.productLink ? (
                          <a
                            href={selectedCampaignDetails.productLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:underline break-all"
                          >
                            {selectedCampaignDetails.productLink}
                          </a>
                        ) : (
                          <p className="text-sm text-muted-foreground">Not set</p>
                        )}
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground mb-1 block">Product Description</Label>
                        {isEditingCampaign && editedCampaignData ? (
                          <Textarea
                            value={editedCampaignData.productDescription || ""}
                            onChange={(e) => setEditedCampaignData({...editedCampaignData, productDescription: e.target.value})}
                            placeholder="Enter product description"
                            rows={3}
                            className="resize-none"
                          />
                        ) : (
                          <p className="text-sm text-muted-foreground">{selectedCampaignDetails.productDescription || "Not set"}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Instructions */}
                  <div className="border-t pt-4">
                    <Label className="text-sm font-semibold mb-3 block">Instructions for Creators</Label>
                    <div className="space-y-3">
                      <div>
                        <Label className="text-xs text-muted-foreground mb-1 block">Brand Tag</Label>
                        {isEditingCampaign && editedCampaignData ? (
                          <Input
                            value={editedCampaignData.brandTag || ""}
                            onChange={(e) => setEditedCampaignData({...editedCampaignData, brandTag: e.target.value})}
                            placeholder="@yourbrand"
                          />
                        ) : (
                          <p className="text-sm">{selectedCampaignDetails.brandTag || "Not set"}</p>
                        )}
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground mb-1 block">Hashtags</Label>
                        {isEditingCampaign && editedCampaignData ? (
                          <Input
                            value={editedCampaignData.hashtags || ""}
                            onChange={(e) => setEditedCampaignData({...editedCampaignData, hashtags: e.target.value})}
                            placeholder="#campaign #brand"
                          />
                        ) : (
                          <p className="text-sm">{selectedCampaignDetails.hashtags || "Not set"}</p>
                        )}
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground mb-1 block">Creator Script</Label>
                        {isEditingCampaign && editedCampaignData ? (
                          <Textarea
                            value={editedCampaignData.creatorScript || ""}
                            onChange={(e) => setEditedCampaignData({...editedCampaignData, creatorScript: e.target.value})}
                            placeholder="Suggested script for creators..."
                            rows={3}
                            className="resize-none"
                          />
                        ) : (
                          <p className="text-sm text-muted-foreground">{selectedCampaignDetails.creatorScript || "Not set"}</p>
                        )}
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground mb-1 block">Detailed Requirements</Label>
                        {isEditingCampaign && editedCampaignData ? (
                          <Textarea
                            value={editedCampaignData.detailedRequirements || ""}
                            onChange={(e) => setEditedCampaignData({...editedCampaignData, detailedRequirements: e.target.value})}
                            placeholder="Detailed requirements for the campaign..."
                            rows={4}
                            className="resize-none"
                          />
                        ) : (
                          <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                            {selectedCampaignDetails.detailedRequirements || "Not set"}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Applications */}
          {selectedCampaignDetails.applicationsList && selectedCampaignDetails.applicationsList.length > 0 && (
            <Card className="p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold">Applications</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    {selectedCampaignDetails.applicationsList.filter(a => a.status === "pending").length} pending,{" "}
                    {selectedCampaignDetails.applicationsList.filter(a => a.status === "approved").length} approved
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsApplicationsExpanded(!isApplicationsExpanded)}
                >
                  {isApplicationsExpanded ? "Collapse" : "Expand"}
                  <ChevronDown className={`ml-2 h-4 w-4 transition-transform ${isApplicationsExpanded ? "rotate-180" : ""}`} />
                </Button>
              </div>

              {isApplicationsExpanded && (
                <div className="space-y-3">
                  {selectedCampaignDetails.applicationsList.map((application) => (
                    <div
                      key={application.id}
                      className={`p-4 rounded-lg border ${
                        application.status === "approved"
                          ? "bg-success/5 border-success/20"
                          : application.status === "rejected"
                          ? "bg-muted border-border opacity-60"
                          : "bg-background border-border hover:border-primary/30"
                      } transition-colors`}
                    >
                      <div className="flex items-start gap-4">
                        {/* Avatar */}
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-2xl shrink-0">
                          {application.influencerAvatar}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold">{application.influencerName}</h3>
                                <Badge
                                  variant="outline"
                                  className={`text-xs ${
                                    application.source === "invited"
                                      ? "bg-primary/10 text-primary border-primary/20"
                                      : "bg-muted text-foreground border-border"
                                  }`}
                                >
                                  {application.source === "invited" ? "Invited" : "Applied"}
                                </Badge>
                                {application.status === "approved" && (
                                  <Badge variant="outline" className="text-xs bg-success/10 text-success border-success/20">
                                    <CheckCircle2 className="h-3 w-3 mr-1" />
                                    Approved
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                <span>{application.influencerUsername}</span>
                                <span>•</span>
                                <span>{application.influencerFollowers} followers</span>
                              </div>
                            </div>

                            {/* Action Button */}
                            {application.status === "pending" && (
                              <Button
                                size="sm"
                                className="bg-gradient-to-r from-primary to-secondary shrink-0"
                                onClick={() => {
                                  // Update application status
                                  const updatedApplications = selectedCampaignDetails.applicationsList?.map(app =>
                                    app.id === application.id ? { ...app, status: "approved" as const } : app
                                  );
                                  setSelectedCampaignDetails({
                                    ...selectedCampaignDetails,
                                    applicationsList: updatedApplications,
                                  });
                                }}
                              >
                                <CheckCircle2 className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                            )}
                          </div>

                          {/* Pricing */}
                          <div className="flex flex-wrap gap-2 mb-2">
                            {selectedCampaignDetails.pricingModels.includes("cpm") && application.proposedPriceCPM && (
                              <div className="text-xs px-2.5 py-1 rounded-md bg-primary/10 text-primary font-medium border border-primary/20">
                                CPM: ${application.proposedPriceCPM}
                              </div>
                            )}
                            {selectedCampaignDetails.pricingModels.includes("cpc") && application.proposedPriceCPC && (
                              <div className="text-xs px-2.5 py-1 rounded-md bg-secondary/10 text-secondary font-medium border border-secondary/20">
                                CPC: ${application.proposedPriceCPC}
                              </div>
                            )}
                            {selectedCampaignDetails.pricingModels.includes("cpe") && application.proposedPriceCPE && (
                              <div className="text-xs px-2.5 py-1 rounded-md bg-muted text-foreground font-medium border border-border">
                                CPE: ${application.proposedPriceCPE}
                              </div>
                            )}
                          </div>

                          {/* Message */}
                          {application.message && (
                            <p className="text-sm text-muted-foreground italic">
                              &quot;{application.message}&quot;
                            </p>
                          )}

                          {/* Applied Date */}
                          <p className="text-xs text-muted-foreground mt-2">
                            Applied {new Date(application.appliedAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          )}

          {/* Pipeline */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Campaign Pipeline</h2>

              {/* Approved Influencers Selector */}
              {selectedCampaignDetails.applicationsList &&
                selectedCampaignDetails.applicationsList.filter(app => app.status === "approved").length > 0 && (
                <div className="relative">
                  <button
                    onClick={() => setShowInfluencerSelector(!showInfluencerSelector)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-background hover:bg-muted transition-colors"
                  >
                    <Users className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      {selectedInfluencerForPipeline
                        ? selectedInfluencerForPipeline.influencerName
                        : "Select Influencer"}
                    </span>
                    <ChevronDown className={`h-4 w-4 transition-transform ${showInfluencerSelector ? "rotate-180" : ""}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {showInfluencerSelector && (
                    <>
                      {/* Click-outside overlay */}
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setShowInfluencerSelector(false)}
                      />
                      <div className="absolute right-0 top-full mt-2 w-64 bg-background border border-border rounded-lg shadow-lg z-50">
                        <div className="p-2 space-y-1">
                          <button
                            onClick={() => {
                              setSelectedInfluencerForPipeline(null);
                              setShowInfluencerSelector(false);
                            }}
                            className={`w-full text-left px-3 py-2 rounded-md hover:bg-muted transition-colors text-sm ${
                              !selectedInfluencerForPipeline ? "bg-primary/10 text-primary" : ""
                            }`}
                          >
                            General Pipeline
                          </button>
                          {selectedCampaignDetails.applicationsList
                            ?.filter(app => app.status === "approved")
                            .map((influencer) => (
                              <button
                                key={influencer.id}
                                onClick={() => {
                                  setSelectedInfluencerForPipeline(influencer);
                                  setShowInfluencerSelector(false);
                                }}
                                className={`w-full text-left px-3 py-2 rounded-md hover:bg-muted transition-colors ${
                                  selectedInfluencerForPipeline?.id === influencer.id
                                    ? "bg-primary/10 text-primary"
                                    : ""
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-xs shrink-0">
                                    {influencer.influencerAvatar}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">{influencer.influencerName}</p>
                                    <p className="text-xs text-muted-foreground truncate">@{influencer.influencerUsername}</p>
                                  </div>
                                </div>
                              </button>
                            ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-6">
              {/* Stage 1: Negotiation */}
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                    (selectedCampaignDetails.currentStage || 1) >= 1
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}>
                    1
                  </div>
                  <div className="w-0.5 h-full bg-border mt-2" />
                </div>
                <div className="flex-1 pb-6">
                  {!selectedInfluencerForPipeline ? (
                    <>
                      {/* General Pipeline View */}
                      <h3 className="font-semibold mb-2">Negotiation</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Find and negotiate with influencers for your campaign
                      </p>
                      <div className="text-sm text-muted-foreground">
                        <div className="flex items-center justify-between py-2">
                          <span>Applications received</span>
                          <span className="font-semibold">
                            {selectedCampaignDetails.applicationsList?.length || 0}
                          </span>
                        </div>
                        <div className="flex items-center justify-between py-2">
                          <span>Approved</span>
                          <span className="font-semibold">
                            {selectedCampaignDetails.applicationsList?.filter(a => a.status === "approved").length || 0}
                          </span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Personalized Pipeline View */}
                      <div className="space-y-4">
                        {/* Influencer Info */}
                        <div className="flex items-center gap-3 pb-3 border-b">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-sm shrink-0">
                            {selectedInfluencerForPipeline.influencerAvatar}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold">
                              Negotiation with {selectedInfluencerForPipeline.influencerName}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              @{selectedInfluencerForPipeline.influencerUsername} • {selectedInfluencerForPipeline.influencerFollowers} followers
                            </p>
                          </div>
                        </div>

                        {/* Proposed Pricing */}
                        <div className="bg-muted/50 rounded-lg p-4">
                          <h4 className="text-sm font-semibold mb-2">Proposed Pricing</h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedCampaignDetails.pricingModels.includes("cpm") && selectedInfluencerForPipeline.proposedPriceCPM && (
                              <div className="text-xs px-2.5 py-1 rounded-md bg-primary/10 text-primary font-medium border border-primary/20">
                                CPM: ${selectedInfluencerForPipeline.proposedPriceCPM}
                              </div>
                            )}
                            {selectedCampaignDetails.pricingModels.includes("cpc") && selectedInfluencerForPipeline.proposedPriceCPC && (
                              <div className="text-xs px-2.5 py-1 rounded-md bg-secondary/10 text-secondary font-medium border border-secondary/20">
                                CPC: ${selectedInfluencerForPipeline.proposedPriceCPC}
                              </div>
                            )}
                            {selectedCampaignDetails.pricingModels.includes("cpe") && selectedInfluencerForPipeline.proposedPriceCPE && (
                              <div className="text-xs px-2.5 py-1 rounded-md bg-muted text-foreground font-medium border border-border">
                                CPE: ${selectedInfluencerForPipeline.proposedPriceCPE}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Brand Terms */}
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Brand Terms (Optional)</Label>
                          <textarea
                            className="w-full min-h-[80px] px-3 py-2 rounded-lg border border-border bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                            placeholder="Additional collaboration terms from brand..."
                            value={selectedInfluencerForPipeline.brandTerms || ""}
                            onChange={(e) => {
                              const updatedApplications = selectedCampaignDetails.applicationsList?.map(app =>
                                app.id === selectedInfluencerForPipeline.id
                                  ? { ...app, brandTerms: e.target.value }
                                  : app
                              );
                              setSelectedCampaignDetails({
                                ...selectedCampaignDetails,
                                applicationsList: updatedApplications,
                              });
                              setSelectedInfluencerForPipeline({
                                ...selectedInfluencerForPipeline,
                                brandTerms: e.target.value,
                              });
                            }}
                          />
                        </div>

                        {/* Influencer Terms */}
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Influencer Terms (Optional)</Label>
                          <textarea
                            className="w-full min-h-[80px] px-3 py-2 rounded-lg border border-border bg-muted/50 text-sm resize-none"
                            placeholder="Additional collaboration terms from influencer..."
                            value={selectedInfluencerForPipeline.influencerTerms || ""}
                            disabled
                          />
                          <p className="text-xs text-muted-foreground">Influencer can add their terms when reviewing</p>
                        </div>

                        {/* Approval Buttons */}
                        <div className="grid grid-cols-2 gap-3 pt-2">
                          {/* Influencer Approval Status */}
                          <div className="space-y-2">
                            <Label className="text-sm font-medium">Influencer Approval</Label>
                            {selectedInfluencerForPipeline.influencerApprovedTerms ? (
                              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-success/10 border border-success/20">
                                <CheckCircle2 className="h-4 w-4 text-success" />
                                <span className="text-sm font-medium text-success">Approved</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50 border border-border">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">Pending</span>
                              </div>
                            )}
                          </div>

                          {/* Brand Approval */}
                          <div className="space-y-2">
                            <Label className="text-sm font-medium">Brand Approval</Label>
                            {selectedInfluencerForPipeline.brandApprovedTerms ? (
                              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-success/10 border border-success/20">
                                <CheckCircle2 className="h-4 w-4 text-success" />
                                <span className="text-sm font-medium text-success">Approved</span>
                              </div>
                            ) : (
                              <Button
                                onClick={() => {
                                  // Check if both parties approved to verify funds
                                  const bothApproved = selectedInfluencerForPipeline.influencerApprovedTerms;

                                  if (bothApproved) {
                                    // Calculate total price
                                    let totalPrice = 0;
                                    if (selectedCampaignDetails.pricingModels.includes("cpm") && selectedInfluencerForPipeline.proposedPriceCPM) {
                                      totalPrice += parseFloat(selectedInfluencerForPipeline.proposedPriceCPM);
                                    }
                                    if (selectedCampaignDetails.pricingModels.includes("cpc") && selectedInfluencerForPipeline.proposedPriceCPC) {
                                      totalPrice += parseFloat(selectedInfluencerForPipeline.proposedPriceCPC);
                                    }
                                    if (selectedCampaignDetails.pricingModels.includes("cpe") && selectedInfluencerForPipeline.proposedPriceCPE) {
                                      totalPrice += parseFloat(selectedInfluencerForPipeline.proposedPriceCPE);
                                    }

                                    // Check if brand has sufficient funds
                                    if (balance < totalPrice) {
                                      setShowInsufficientFundsDialog(true);
                                      return;
                                    }
                                  }

                                  // Approve terms
                                  const updatedApplications = selectedCampaignDetails.applicationsList?.map(app =>
                                    app.id === selectedInfluencerForPipeline.id
                                      ? { ...app, brandApprovedTerms: true, fundsVerified: bothApproved }
                                      : app
                                  );
                                  setSelectedCampaignDetails({
                                    ...selectedCampaignDetails,
                                    applicationsList: updatedApplications,
                                  });
                                  setSelectedInfluencerForPipeline({
                                    ...selectedInfluencerForPipeline,
                                    brandApprovedTerms: true,
                                    fundsVerified: bothApproved,
                                  });
                                }}
                                className="w-full bg-gradient-to-r from-primary to-secondary"
                              >
                                Approve Terms
                              </Button>
                            )}
                          </div>
                        </div>

                        {/* Funds Verification Status */}
                        {selectedInfluencerForPipeline.brandApprovedTerms && selectedInfluencerForPipeline.influencerApprovedTerms && (
                          <div className={`flex items-center gap-2 px-4 py-3 rounded-lg border ${
                            selectedInfluencerForPipeline.fundsVerified
                              ? "bg-success/10 border-success/20"
                              : "bg-warning/10 border-warning/20"
                          }`}>
                            {selectedInfluencerForPipeline.fundsVerified ? (
                              <>
                                <CheckCircle2 className="h-5 w-5 text-success" />
                                <div>
                                  <p className="text-sm font-medium text-success">Funds Verified</p>
                                  <p className="text-xs text-muted-foreground">Ready to proceed to next stage</p>
                                </div>
                              </>
                            ) : (
                              <>
                                <AlertCircle className="h-5 w-5 text-warning" />
                                <div>
                                  <p className="text-sm font-medium text-warning">Verifying Funds</p>
                                  <p className="text-xs text-muted-foreground">Please wait...</p>
                                </div>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Stage 2: Content Approval */}
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                    (selectedCampaignDetails.currentStage || 1) >= 2
                      ? "bg-secondary text-secondary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}>
                    2
                  </div>
                  <div className="w-0.5 h-full bg-border mt-2" />
                </div>
                <div className="flex-1 pb-6">
                  {!selectedInfluencerForPipeline ? (
                    <>
                      {/* General View */}
                      <h3 className="font-semibold mb-2">Content Approval</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Review content links from influencers and provide feedback
                      </p>
                      <div className="text-sm text-muted-foreground">
                        <div className="flex items-center justify-between py-2">
                          <span>Drafts pending review</span>
                          <span className="font-semibold">
                            {selectedCampaignDetails.applicationsList?.filter(
                              app => app.status === "approved" && app.currentContentUrl && !app.contentApproved
                            ).length || 0}
                          </span>
                        </div>
                        <div className="flex items-center justify-between py-2">
                          <span>Approved</span>
                          <span className="font-semibold">
                            {selectedCampaignDetails.applicationsList?.filter(
                              app => app.contentApproved
                            ).length || 0}
                          </span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Personalized View */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 pb-3 border-b">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-sm shrink-0">
                            {selectedInfluencerForPipeline.influencerAvatar}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold">
                              Content from {selectedInfluencerForPipeline.influencerName}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              Review content links and provide feedback
                            </p>
                          </div>
                          {selectedInfluencerForPipeline.contentApproved && (
                            <Badge className="bg-success/10 text-success border-success/20">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Approved
                            </Badge>
                          )}
                        </div>

                        {/* Content Revisions History */}
                        {selectedInfluencerForPipeline.contentRevisions && selectedInfluencerForPipeline.contentRevisions.length > 0 ? (
                          <div className="space-y-3">
                            <h4 className="text-sm font-semibold">Revision History</h4>

                            {selectedInfluencerForPipeline.contentRevisions.map((revision, index) => (
                              <div
                                key={revision.id}
                                className={`rounded-lg border p-4 ${
                                  index === 0 ? "border-primary/50 bg-primary/5" : "border-border bg-muted/20"
                                }`}
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center gap-2">
                                    <Badge variant={index === 0 ? "default" : "outline"} className="text-xs">
                                      Version {revision.version}
                                    </Badge>
                                    <span className="text-xs text-muted-foreground">
                                      {new Date(revision.submittedAt).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                      })}
                                    </span>
                                  </div>
                                  {index === 0 && !selectedInfluencerForPipeline.contentApproved && (
                                    <Badge variant="outline" className="text-xs bg-warning/10 text-warning border-warning/20">
                                      Current
                                    </Badge>
                                  )}
                                </div>

                                {/* Content Link */}
                                <div className="mb-3">
                                  <div className="bg-background rounded-md p-3 border border-border">
                                    <div className="flex items-center gap-2 mb-1">
                                      <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                                      <span className="text-xs font-medium text-muted-foreground">Content Link</span>
                                    </div>
                                    <a
                                      href={revision.contentUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-sm text-primary hover:underline break-all"
                                    >
                                      {revision.contentUrl}
                                    </a>
                                    <p className="text-xs text-muted-foreground mt-1">
                                      External link (Google Drive, Dropbox, etc.)
                                    </p>
                                  </div>
                                </div>

                                {/* Brand Feedback */}
                                {revision.brandFeedback && (
                                  <div className="bg-background rounded-md p-3 border border-border">
                                    <div className="flex items-center gap-2 mb-2">
                                      <MessageSquare className="h-3.5 w-3.5 text-muted-foreground" />
                                      <span className="text-xs font-medium text-muted-foreground">
                                        Brand Feedback
                                        {revision.feedbackAt && (
                                          <span className="ml-2">
                                            • {new Date(revision.feedbackAt).toLocaleDateString('en-US', {
                                              month: 'short',
                                              day: 'numeric',
                                              hour: '2-digit',
                                              minute: '2-digit'
                                            })}
                                          </span>
                                        )}
                                      </span>
                                    </div>
                                    <p className="text-sm text-foreground">{revision.brandFeedback}</p>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8 bg-muted/30 rounded-lg border border-dashed border-border">
                            <Clock className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                            <p className="text-sm text-muted-foreground mb-1">
                              Waiting for influencer to submit content link
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Influencer will provide a link to their content (Google Drive, Dropbox, etc.)
                            </p>
                          </div>
                        )}

                        {/* Feedback Input - Only show if there's current content and not approved */}
                        {selectedInfluencerForPipeline.currentContentUrl && !selectedInfluencerForPipeline.contentApproved && (
                          <div className="space-y-3 pt-3 border-t">
                            <Label className="text-sm font-medium">Provide Feedback</Label>
                            <textarea
                              className="w-full min-h-[100px] px-3 py-2 rounded-lg border border-border bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                              placeholder="Share your thoughts on the content, suggest improvements..."
                              value={brandFeedbackText}
                              onChange={(e) => setBrandFeedbackText(e.target.value)}
                            />

                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                onClick={() => {
                                  if (!brandFeedbackText.trim()) {
                                    showToast("Please provide feedback before requesting revisions", 'error');
                                    return;
                                  }

                                  // Add feedback to current revision
                                  const updatedRevisions = selectedInfluencerForPipeline.contentRevisions?.map((rev, idx) =>
                                    idx === 0
                                      ? {
                                          ...rev,
                                          brandFeedback: brandFeedbackText,
                                          feedbackAt: new Date().toISOString(),
                                        }
                                      : rev
                                  );

                                  const updatedApplications = selectedCampaignDetails.applicationsList?.map(app =>
                                    app.id === selectedInfluencerForPipeline.id
                                      ? { ...app, contentRevisions: updatedRevisions }
                                      : app
                                  );

                                  setSelectedCampaignDetails({
                                    ...selectedCampaignDetails,
                                    applicationsList: updatedApplications,
                                  });

                                  setSelectedInfluencerForPipeline({
                                    ...selectedInfluencerForPipeline,
                                    contentRevisions: updatedRevisions,
                                  });

                                  setBrandFeedbackText("");
                                }}
                                className="flex-1"
                              >
                                <MessageSquare className="h-4 w-4 mr-2" />
                                Request Revisions
                              </Button>

                              <Button
                                onClick={() => {
                                  // Approve content and send 25% payment
                                  const updatedApplications = selectedCampaignDetails.applicationsList?.map(app =>
                                    app.id === selectedInfluencerForPipeline.id
                                      ? {
                                          ...app,
                                          contentApproved: true,
                                          contentApprovedAt: new Date().toISOString(),
                                          contentApprovalPaymentSent: true, // Send 25% payment
                                        }
                                      : app
                                  );

                                  setSelectedCampaignDetails({
                                    ...selectedCampaignDetails,
                                    applicationsList: updatedApplications,
                                  });

                                  setSelectedInfluencerForPipeline({
                                    ...selectedInfluencerForPipeline,
                                    contentApproved: true,
                                    contentApprovedAt: new Date().toISOString(),
                                    contentApprovalPaymentSent: true,
                                  });

                                  setBrandFeedbackText("");
                                }}
                                className="flex-1 bg-gradient-to-r from-secondary to-primary"
                              >
                                <CheckCircle2 className="h-4 w-4 mr-2" />
                                Approve Content
                              </Button>
                            </div>
                          </div>
                        )}

                        {/* Approved State */}
                        {selectedInfluencerForPipeline.contentApproved && (
                          <div className="space-y-3">
                            <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-success/10 border border-success/20">
                              <CheckCircle2 className="h-5 w-5 text-success" />
                              <div className="flex-1">
                                <p className="text-sm font-medium text-success">Content Approved</p>
                                <p className="text-xs text-muted-foreground">
                                  Approved on {selectedInfluencerForPipeline.contentApprovedAt &&
                                    new Date(selectedInfluencerForPipeline.contentApprovedAt).toLocaleDateString('en-US', {
                                      month: 'short',
                                      day: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })
                                  }
                                </p>
                              </div>
                            </div>

                            {selectedInfluencerForPipeline.contentApprovalPaymentSent && (
                              <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-primary/10 border border-primary/20">
                                <Wallet className="h-5 w-5 text-primary" />
                                <div>
                                  <p className="text-sm font-medium text-primary">Payment Sent (25%)</p>
                                  <p className="text-xs text-muted-foreground">
                                    Content approval payment released
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Stage 3: Publication & Metrics */}
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                    (selectedCampaignDetails.currentStage || 1) >= 3
                      ? "bg-success text-success-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}>
                    3
                  </div>
                </div>
                <div className="flex-1">
                  {!selectedInfluencerForPipeline ? (
                    <>
                      {/* General View */}
                      <h3 className="font-semibold mb-2">Publication & Metrics</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Content is published and metrics are tracked
                      </p>

                      {/* Campaign Goals */}
                      {(selectedCampaignDetails.targetViews || selectedCampaignDetails.targetClicks ||
                        selectedCampaignDetails.targetEngagements) && (
                        <div className="mb-4 border-b pb-4">
                          <h4 className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Campaign Goals</h4>
                          <div className="text-sm">
                            {selectedCampaignDetails.targetViews && (
                              <div className="flex items-center justify-between py-2">
                                <span className="text-muted-foreground">Target Views</span>
                                <span className="font-semibold text-primary">{parseInt(selectedCampaignDetails.targetViews).toLocaleString()}</span>
                              </div>
                            )}
                            {selectedCampaignDetails.targetClicks && (
                              <div className="flex items-center justify-between py-2">
                                <span className="text-muted-foreground">Target Clicks</span>
                                <span className="font-semibold text-primary">{parseInt(selectedCampaignDetails.targetClicks).toLocaleString()}</span>
                              </div>
                            )}
                            {selectedCampaignDetails.targetEngagements && (
                              <div className="flex items-center justify-between py-2">
                                <span className="text-muted-foreground">Target Engagements</span>
                                <span className="font-semibold text-primary">{parseInt(selectedCampaignDetails.targetEngagements).toLocaleString()}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Current Progress */}
                      <div className="text-sm text-muted-foreground">
                        <h4 className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Current Progress</h4>
                        <div className="flex items-center justify-between py-2">
                          <span>Published</span>
                          <span className="font-semibold">
                            {selectedCampaignDetails.applicationsList?.filter(app => app.publishedUrl).length || 0}
                          </span>
                        </div>
                        <div className="flex items-center justify-between py-2">
                          <span>Metrics verified</span>
                          <span className="font-semibold">
                            {selectedCampaignDetails.applicationsList?.filter(app => app.metricsTargetReached).length || 0}
                          </span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Personalized View */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 pb-3 border-b">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-sm shrink-0">
                            {selectedInfluencerForPipeline.influencerAvatar}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold">
                              Publication by {selectedInfluencerForPipeline.influencerName}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              Track published content and metrics
                            </p>
                          </div>
                          {selectedInfluencerForPipeline.metricsTargetReached && (
                            <Badge className="bg-success/10 text-success border-success/20">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Target Reached
                            </Badge>
                          )}
                        </div>

                        {!selectedInfluencerForPipeline.contentApproved ? (
                          <div className="text-center py-8 bg-muted/30 rounded-lg border border-dashed border-border">
                            <Clock className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                            <p className="text-sm text-muted-foreground">
                              Waiting for content approval
                            </p>
                          </div>
                        ) : (
                          <>
                            {/* Published URL */}
                            {selectedInfluencerForPipeline.publishedUrl ? (
                              <div className="space-y-3">
                                <div className="bg-background rounded-lg p-4 border border-border">
                                  <div className="flex items-center gap-2 mb-2">
                                    <Rocket className="h-4 w-4 text-success" />
                                    <span className="text-sm font-medium">Published Content</span>
                                  </div>
                                  <a
                                    href={selectedInfluencerForPipeline.publishedUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-primary hover:underline break-all flex items-center gap-1"
                                  >
                                    {selectedInfluencerForPipeline.publishedUrl}
                                    <ExternalLink className="h-3 w-3" />
                                  </a>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    Published {selectedInfluencerForPipeline.publishedAt &&
                                      new Date(selectedInfluencerForPipeline.publishedAt).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                      })
                                    }
                                  </p>
                                </div>

                                {/* Public Metrics */}
                                {selectedInfluencerForPipeline.publicMetrics && (
                                  <div className="bg-background rounded-lg p-4 border border-border">
                                    <div className="flex items-center justify-between mb-3">
                                      <h4 className="text-sm font-semibold">Public Metrics</h4>
                                      <Badge variant="outline" className="text-xs">
                                        Auto-parsed
                                      </Badge>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                      {selectedInfluencerForPipeline.publicMetrics.views !== undefined && (
                                        <div className="flex items-center gap-2 p-2 rounded-md bg-muted/50">
                                          <Eye className="h-4 w-4 text-muted-foreground" />
                                          <div>
                                            <p className="text-xs text-muted-foreground">Views</p>
                                            <p className="text-sm font-semibold">
                                              {selectedInfluencerForPipeline.publicMetrics.views.toLocaleString()}
                                            </p>
                                          </div>
                                        </div>
                                      )}
                                      {selectedInfluencerForPipeline.publicMetrics.likes !== undefined && (
                                        <div className="flex items-center gap-2 p-2 rounded-md bg-muted/50">
                                          <Heart className="h-4 w-4 text-muted-foreground" />
                                          <div>
                                            <p className="text-xs text-muted-foreground">Likes</p>
                                            <p className="text-sm font-semibold">
                                              {selectedInfluencerForPipeline.publicMetrics.likes.toLocaleString()}
                                            </p>
                                          </div>
                                        </div>
                                      )}
                                      {selectedInfluencerForPipeline.publicMetrics.comments !== undefined && (
                                        <div className="flex items-center gap-2 p-2 rounded-md bg-muted/50">
                                          <MessageCircle className="h-4 w-4 text-muted-foreground" />
                                          <div>
                                            <p className="text-xs text-muted-foreground">Comments</p>
                                            <p className="text-sm font-semibold">
                                              {selectedInfluencerForPipeline.publicMetrics.comments.toLocaleString()}
                                            </p>
                                          </div>
                                        </div>
                                      )}
                                      {selectedInfluencerForPipeline.publicMetrics.shares !== undefined && (
                                        <div className="flex items-center gap-2 p-2 rounded-md bg-muted/50">
                                          <ArrowRight className="h-4 w-4 text-muted-foreground" />
                                          <div>
                                            <p className="text-xs text-muted-foreground">Shares</p>
                                            <p className="text-sm font-semibold">
                                              {selectedInfluencerForPipeline.publicMetrics.shares.toLocaleString()}
                                            </p>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                    {selectedInfluencerForPipeline.publicMetrics.lastUpdated && (
                                      <p className="text-xs text-muted-foreground mt-3">
                                        Last updated: {new Date(selectedInfluencerForPipeline.publicMetrics.lastUpdated).toLocaleDateString('en-US', {
                                          month: 'short',
                                          day: 'numeric',
                                          hour: '2-digit',
                                          minute: '2-digit'
                                        })}
                                      </p>
                                    )}
                                  </div>
                                )}

                                {/* Insights Screenshots */}
                                <div className="bg-background rounded-lg p-4 border border-border">
                                  <div className="flex items-center justify-between mb-3">
                                    <h4 className="text-sm font-semibold">Private Metrics (Insights)</h4>
                                    <Badge variant="outline" className="text-xs">
                                      Screenshots required
                                    </Badge>
                                  </div>

                                  {selectedInfluencerForPipeline.insightsScreenshots && selectedInfluencerForPipeline.insightsScreenshots.length > 0 ? (
                                    <div className="space-y-2">
                                      {selectedInfluencerForPipeline.insightsScreenshots.map((screenshot) => (
                                        <div key={screenshot.id} className="p-3 rounded-md border border-border bg-muted/20">
                                          <div className="flex items-start justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                              <span className="text-sm font-medium capitalize">{screenshot.metricType.replace('_', ' ')}</span>
                                              {screenshot.verified && (
                                                <Badge className="text-xs bg-success/10 text-success border-success/20">
                                                  Verified
                                                </Badge>
                                              )}
                                            </div>
                                            <span className="text-sm font-semibold">{screenshot.value.toLocaleString()}</span>
                                          </div>
                                          <a
                                            href={screenshot.screenshotUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-xs text-primary hover:underline flex items-center gap-1"
                                          >
                                            <Eye className="h-3 w-3" />
                                            View Screenshot
                                          </a>
                                          <p className="text-xs text-muted-foreground mt-1">
                                            Submitted {new Date(screenshot.submittedAt).toLocaleDateString('en-US', {
                                              month: 'short',
                                              day: 'numeric',
                                              hour: '2-digit',
                                              minute: '2-digit'
                                            })}
                                          </p>
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <div className="text-center py-6 bg-muted/30 rounded-md border border-dashed">
                                      <Camera className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
                                      <p className="text-xs text-muted-foreground">
                                        Waiting for influencer to submit insights screenshots
                                      </p>
                                      <p className="text-xs text-muted-foreground mt-1">
                                        (Impressions, Reach, Saves, Profile Visits)
                                      </p>
                                    </div>
                                  )}
                                </div>

                                {/* Target Achievement Status */}
                                {selectedInfluencerForPipeline.metricsTargetReached ? (
                                  <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-success/10 border border-success/20">
                                    <CheckCircle2 className="h-5 w-5 text-success" />
                                    <div className="flex-1">
                                      <p className="text-sm font-medium text-success">Target Metrics Reached</p>
                                      <p className="text-xs text-muted-foreground">
                                        Verified on {selectedInfluencerForPipeline.metricsVerifiedAt &&
                                          new Date(selectedInfluencerForPipeline.metricsVerifiedAt).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                          })
                                        }
                                      </p>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-warning/10 border border-warning/20">
                                    <Clock className="h-5 w-5 text-warning" />
                                    <div>
                                      <p className="text-sm font-medium text-warning">Tracking Metrics</p>
                                      <p className="text-xs text-muted-foreground">
                                        Waiting to reach target metrics
                                      </p>
                                    </div>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="text-center py-8 bg-muted/30 rounded-lg border border-dashed border-border">
                                <Rocket className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                                <p className="text-sm text-muted-foreground mb-1">
                                  Waiting for influencer to publish content
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  They will provide the publication URL
                                </p>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </>
      ) : (
        <>
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">My Campaigns</h1>
            <p className="text-muted-foreground text-sm sm:text-base">Track and manage your campaigns</p>
          </div>

          {campaigns.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Rocket className="h-16 w-16 text-muted-foreground/50 mb-4" />
          <p className="text-muted-foreground text-lg font-medium mb-2">No campaigns yet</p>
          <p className="text-muted-foreground text-sm mb-6">Create your first campaign to get started</p>
          <Button onClick={() => setActiveTab("create-campaign")} className="bg-gradient-to-r from-primary to-secondary">
            <Plus className="h-4 w-4 mr-2" />
            Create Campaign
          </Button>
        </div>
      ) : (
        <>
          {/* Search and Filter Bar */}
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search"
                value={campaignSearchQuery}
                onChange={(e) => setCampaignSearchQuery(e.target.value)}
                className="pl-9 h-11 bg-card"
              />
            </div>
            <Select value={campaignStatusFilter} onValueChange={(value: "all" | "active" | "draft") => setCampaignStatusFilter(value)}>
              <SelectTrigger className="w-[180px] h-11 bg-card">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Desktop Table View */}
          <div className="hidden lg:block border rounded-lg overflow-hidden">
            {/* Table Header */}
            <div className="flex items-center px-6 py-4 bg-muted/30 border-b">
              <div className="w-[320px] text-xs font-semibold text-muted-foreground uppercase tracking-wide">Name</div>
              <div className="w-[80px] text-xs font-semibold text-muted-foreground uppercase tracking-wide">Needed</div>
              <div className="w-[120px] text-xs font-semibold text-muted-foreground uppercase tracking-wide">Pricing</div>
              <div className="flex-1 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Pipeline</div>
              <div className="w-[140px] text-xs font-semibold text-muted-foreground uppercase tracking-wide text-right">Actions</div>
            </div>

            {/* Table Rows */}
            {(() => {
              const filteredCampaigns = campaigns.filter((campaign) => {
                const matchesSearch = campaign.title.toLowerCase().includes(campaignSearchQuery.toLowerCase());
                const matchesStatus = campaignStatusFilter === "all" || campaign.status === campaignStatusFilter;
                return matchesSearch && matchesStatus;
              });

              return filteredCampaigns.map((campaign, index) => (
                <div
                  key={campaign.id}
                  className={`flex items-center px-6 py-5 hover:bg-muted/20 transition-colors cursor-pointer ${
                    index !== filteredCampaigns.length - 1 ? "border-b" : ""
                  }`}
                  onClick={() => setSelectedCampaignDetails(campaign)}
                >
              {/* Name Column */}
              <div className="w-[320px] flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <Briefcase className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold mb-1.5 truncate">{campaign.title}</h3>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={campaign.status === "active" ? "default" : "secondary"}
                      className={`w-[80px] justify-center ${
                        campaign.status === "active"
                          ? "bg-success/10 text-success border-success/20 hover:bg-success/20"
                          : "bg-primary/10 text-primary border-primary/20 hover:bg-primary/20"
                      }`}
                    >
                      <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${campaign.status === "active" ? "bg-success" : "bg-primary"}`} />
                      {campaign.status === "active" ? "Active" : "Draft"}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="bg-muted text-foreground border-border text-xs"
                    >
                      ${campaign.budgetMin} - ${campaign.budgetMax} / inf
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Needed Column */}
              <div className="w-[80px] flex items-center">
                <div className="text-base font-semibold">
                  {campaign.influencerCount || "0"}
                </div>
              </div>

              {/* Pricing Column */}
              <div className="w-[120px] flex items-center">
                <div className="flex flex-wrap gap-1">
                  {campaign.pricingModels.map((model) => (
                    <div
                      key={model}
                      className={`text-xs px-2 py-0.5 rounded-md font-medium ${
                        model === "cpm"
                          ? "bg-primary/10 text-primary border border-primary/20"
                          : model === "cpc"
                          ? "bg-secondary/10 text-secondary border border-secondary/20"
                          : "bg-muted text-foreground border border-border"
                      }`}
                    >
                      {model.toUpperCase()}
                    </div>
                  ))}
                </div>
              </div>

              {/* Pipeline Column */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  {/* Stage 1: Negotiation */}
                  <div className="flex flex-col items-center gap-1.5 flex-1">
                    <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                      Negotiation
                    </span>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                      (campaign.currentStage || 1) >= 1
                        ? "bg-primary/10 text-primary"
                        : "bg-muted/50 text-muted-foreground"
                    }`}>
                      0
                    </div>
                  </div>

                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/40 mt-5" />

                  {/* Stage 2: Content */}
                  <div className="flex flex-col items-center gap-1.5 flex-1">
                    <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                      Content
                    </span>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                      (campaign.currentStage || 1) >= 2
                        ? "bg-secondary/10 text-secondary"
                        : "bg-muted/50 text-muted-foreground"
                    }`}>
                      0
                    </div>
                  </div>

                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/40 mt-5" />

                  {/* Stage 3: Published */}
                  <div className="flex flex-col items-center gap-1.5 flex-1">
                    <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                      Published
                    </span>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                      (campaign.currentStage || 1) >= 3
                        ? "bg-success/10 text-success"
                        : "bg-muted/50 text-muted-foreground"
                    }`}>
                      0
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions Column */}
              <div className="w-[140px] flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                <button
                  title="Coming soon"
                  disabled
                  className="p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <Pencil className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                </button>
                <button
                  title="Coming soon"
                  disabled
                  className="p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <Pause className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                </button>
                <button
                  title="Coming soon"
                  disabled
                  className="p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <Trash2 className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                </button>
              </div>
            </div>
              ));
            })()}
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden space-y-3">
            {(() => {
              const filteredCampaigns = campaigns.filter((campaign) => {
                const matchesSearch = campaign.title.toLowerCase().includes(campaignSearchQuery.toLowerCase());
                const matchesStatus = campaignStatusFilter === "all" || campaign.status === campaignStatusFilter;
                return matchesSearch && matchesStatus;
              });

              return filteredCampaigns.map((campaign) => (
                <Card
                  key={campaign.id}
                  onClick={() => setSelectedCampaignDetails(campaign)}
                  className="p-4 cursor-pointer hover:bg-muted/20 transition-colors"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                      <Briefcase className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold mb-1 leading-tight">{campaign.title}</h3>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <Badge
                          variant={campaign.status === "active" ? "default" : "secondary"}
                          className={`text-[10px] px-2 py-0 h-5 ${
                            campaign.status === "active"
                              ? "bg-success/10 text-success border-success/20"
                              : "bg-primary/10 text-primary border-primary/20"
                          }`}
                        >
                          <div className={`w-1.5 h-1.5 rounded-full mr-1 ${campaign.status === "active" ? "bg-success" : "bg-primary"}`} />
                          {campaign.status === "active" ? "Active" : "Draft"}
                        </Badge>
                        <Badge variant="outline" className="bg-muted text-foreground border-border text-[10px] px-2 py-0 h-5">
                          ${campaign.budgetMin}-${campaign.budgetMax}/inf
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <div className="text-muted-foreground mb-0.5">Needed</div>
                        <div className="font-semibold">{campaign.influencerCount || "0"} influencers</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground mb-0.5">Pricing</div>
                        <div className="flex gap-1 flex-wrap">
                          {campaign.pricingModels.map((model) => (
                            <div
                              key={model}
                              className={`text-[10px] px-1.5 py-0.5 rounded-md font-medium ${
                                model === "cpm"
                                  ? "bg-primary/10 text-primary border border-primary/20"
                                  : model === "cpc"
                                  ? "bg-secondary/10 text-secondary border border-secondary/20"
                                  : "bg-muted text-foreground border border-border"
                              }`}
                            >
                              {model.toUpperCase()}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="text-muted-foreground text-xs mb-2">Pipeline</div>
                      <div className="flex items-center gap-1.5">
                        <div className="flex flex-col items-center gap-1 flex-1">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${
                            (campaign.currentStage || 1) >= 1
                              ? "bg-primary/10 text-primary"
                              : "bg-muted/50 text-muted-foreground"
                          }`}>
                            0
                          </div>
                          <span className="text-[9px] font-medium text-muted-foreground">Negot.</span>
                        </div>
                        <ArrowRight className="h-3 w-3 text-muted-foreground/40 mb-3" />
                        <div className="flex flex-col items-center gap-1 flex-1">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${
                            (campaign.currentStage || 1) >= 2
                              ? "bg-secondary/10 text-secondary"
                              : "bg-muted/50 text-muted-foreground"
                          }`}>
                            0
                          </div>
                          <span className="text-[9px] font-medium text-muted-foreground">Content</span>
                        </div>
                        <ArrowRight className="h-3 w-3 text-muted-foreground/40 mb-3" />
                        <div className="flex flex-col items-center gap-1 flex-1">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${
                            (campaign.currentStage || 1) >= 3
                              ? "bg-success/10 text-success"
                              : "bg-muted/50 text-muted-foreground"
                          }`}>
                            0
                          </div>
                          <span className="text-[9px] font-medium text-muted-foreground">Published</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ));
            })()}
          </div>
        </>
      )}
        </>
      )}
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
