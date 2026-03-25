"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  CheckCircle2,
  MapPin,
  Globe,
  Instagram,
  X,
} from "lucide-react";
import type { Influencer } from "./types";

interface DiscoverTabProps {
  influencers: Influencer[];
  onCollaborate: (influencer: Influencer) => void;
}

export function DiscoverTab({ influencers, onCollaborate }: DiscoverTabProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedFollowers, setSelectedFollowers] = useState("all");
  const [selectedEngagement, setSelectedEngagement] = useState("all");
  const [selectedGender, setSelectedGender] = useState("all");
  const [selectedEthnicity, setSelectedEthnicity] = useState("all");
  const [selectedAge, setSelectedAge] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedInfluencer, setSelectedInfluencer] = useState<Influencer | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const filteredInfluencers = influencers.filter((influencer) => {
    const matchesSearch = influencer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         influencer.username.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || influencer.category === selectedCategory;

    // Followers filter
    let matchesFollowers = true;
    if (selectedFollowers !== "all") {
      const followers = parseFloat(influencer.followers.replace(/[KM]/g, ""));
      const unit = influencer.followers.includes("M") ? "M" : "K";

      if (selectedFollowers === "0-100k" && (unit === "M" || followers > 100)) matchesFollowers = false;
      if (selectedFollowers === "100k-500k" && (unit === "M" || followers < 100 || followers > 500)) matchesFollowers = false;
      if (selectedFollowers === "500k-1m" && (unit !== "M" && followers < 500 || (unit === "M" && followers >= 1))) matchesFollowers = false;
      if (selectedFollowers === "1m+" && (unit !== "M" || followers < 1)) matchesFollowers = false;
    }

    // Engagement filter
    let matchesEngagement = true;
    if (selectedEngagement !== "all") {
      const engagement = parseFloat(influencer.engagement.replace("%", ""));

      if (selectedEngagement === "0-3" && engagement > 3) matchesEngagement = false;
      if (selectedEngagement === "3-6" && (engagement < 3 || engagement > 6)) matchesEngagement = false;
      if (selectedEngagement === "6-10" && (engagement < 6 || engagement > 10)) matchesEngagement = false;
      if (selectedEngagement === "10+" && engagement < 10) matchesEngagement = false;
    }

    // Gender filter
    const matchesGender = selectedGender === "all" || influencer.gender === selectedGender;

    // Ethnicity filter
    const matchesEthnicity = selectedEthnicity === "all" || influencer.ethnicity === selectedEthnicity;

    // Age filter
    const matchesAge = selectedAge === "all" || influencer.age === selectedAge;

    return matchesSearch && matchesCategory && matchesFollowers && matchesEngagement && matchesGender && matchesEthnicity && matchesAge;
  });

  const handleCardClick = (influencer: Influencer) => {
    setSelectedInfluencer(influencer);
    setShowDetailModal(true);
  };

  const renderAvatar = (influencer: Influencer, sizeClass: string, textClass: string) => {
    if (influencer.avatarUrl) {
      return (
        <div className={`${sizeClass} rounded-full overflow-hidden shrink-0`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={influencer.avatarUrl}
            alt={influencer.name}
            className="w-full h-full object-cover"
          />
        </div>
      );
    }
    return (
      <div className={`${sizeClass} rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center ${textClass} font-semibold shrink-0`}>
        {influencer.avatar}
      </div>
    );
  };

  return (
    <motion.div
      key="discover"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Discover AI Influencers</h1>
        <p className="text-muted-foreground text-sm sm:text-base">Find the perfect creators for your brand</p>
      </div>

      {/* Search & Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search influencers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="h-11 gap-2 shrink-0 hover:bg-primary/10 hover:text-primary hover:border-primary/30"
          >
            <Filter className="h-4 w-4" />
            Filters
            {(selectedCategory !== "all" || selectedFollowers !== "all" || selectedEngagement !== "all" || selectedGender !== "all" || selectedEthnicity !== "all" || selectedAge !== "all") && (
              <Badge className="ml-1 bg-primary text-primary-foreground px-1.5 py-0 text-xs">
                {[selectedCategory !== "all", selectedFollowers !== "all", selectedEngagement !== "all", selectedGender !== "all", selectedEthnicity !== "all", selectedAge !== "all"].filter(Boolean).length}
              </Badge>
            )}
          </Button>
        </div>

        {/* Expandable Filters */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4 bg-muted/30 rounded-xl border-2 border-border"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label className="text-xs font-medium mb-2 block">Category</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="h-10 hover:bg-primary/10 hover:text-primary hover:border-primary/30">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Beauty & Care">Beauty & Care</SelectItem>
                  <SelectItem value="Fashion & Style">Fashion & Style</SelectItem>
                  <SelectItem value="Tech & Gaming">Tech & Gaming</SelectItem>
                  <SelectItem value="Health & Wellness">Health & Wellness</SelectItem>
                  <SelectItem value="Sports & Fitness">Sports & Fitness</SelectItem>
                  <SelectItem value="Food & Drinks">Food & Drinks</SelectItem>
                  <SelectItem value="Travel">Travel</SelectItem>
                  <SelectItem value="Lifestyle">Lifestyle</SelectItem>
                  <SelectItem value="Business & Finance">Business & Finance</SelectItem>
                  <SelectItem value="Music">Music</SelectItem>
                  <SelectItem value="Art & Design">Art & Design</SelectItem>
                  <SelectItem value="Photography">Photography</SelectItem>
                  <SelectItem value="Home & Garden">Home & Garden</SelectItem>
                  <SelectItem value="Pets">Pets</SelectItem>
                  <SelectItem value="Kids & Parenting">Kids & Parenting</SelectItem>
                  <SelectItem value="Skincare">Skincare</SelectItem>
                  <SelectItem value="Makeup">Makeup</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-xs font-medium mb-2 block">Followers</Label>
              <Select value={selectedFollowers} onValueChange={setSelectedFollowers}>
                <SelectTrigger className="h-10 hover:bg-primary/10 hover:text-primary hover:border-primary/30">
                  <SelectValue placeholder="Select range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ranges</SelectItem>
                  <SelectItem value="0-100k">0 - 100K</SelectItem>
                  <SelectItem value="100k-500k">100K - 500K</SelectItem>
                  <SelectItem value="500k-1m">500K - 1M</SelectItem>
                  <SelectItem value="1m+">1M+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-xs font-medium">Engagement Rate</Label>
                {(selectedCategory !== "all" || selectedFollowers !== "all" || selectedEngagement !== "all" || selectedGender !== "all" || selectedEthnicity !== "all" || selectedAge !== "all") && (
                  <button
                    onClick={() => {
                      setSelectedCategory("all");
                      setSelectedFollowers("all");
                      setSelectedEngagement("all");
                      setSelectedGender("all");
                      setSelectedEthnicity("all");
                      setSelectedAge("all");
                    }}
                    className="text-xs text-muted-foreground hover:text-primary transition-colors"
                  >
                    Clear all
                  </button>
                )}
              </div>
              <Select value={selectedEngagement} onValueChange={setSelectedEngagement}>
                <SelectTrigger className="h-10 hover:bg-primary/10 hover:text-primary hover:border-primary/30">
                  <SelectValue placeholder="Select range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Rates</SelectItem>
                  <SelectItem value="0-3">0% - 3%</SelectItem>
                  <SelectItem value="3-6">3% - 6%</SelectItem>
                  <SelectItem value="6-10">6% - 10%</SelectItem>
                  <SelectItem value="10+">10%+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-xs font-medium mb-2 block">Gender</Label>
              <Select value={selectedGender} onValueChange={setSelectedGender}>
                <SelectTrigger className="h-10 hover:bg-primary/10 hover:text-primary hover:border-primary/30">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Genders</SelectItem>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Non-binary">Non-binary</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-xs font-medium mb-2 block">Ethnicity</Label>
              <Select value={selectedEthnicity} onValueChange={setSelectedEthnicity}>
                <SelectTrigger className="h-10 hover:bg-primary/10 hover:text-primary hover:border-primary/30">
                  <SelectValue placeholder="Select ethnicity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ethnicities</SelectItem>
                  <SelectItem value="Asian">Asian</SelectItem>
                  <SelectItem value="Black">Black</SelectItem>
                  <SelectItem value="White">White</SelectItem>
                  <SelectItem value="Hispanic">Hispanic</SelectItem>
                  <SelectItem value="Mixed">Mixed</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-xs font-medium mb-2 block">Appearance Age</Label>
              <Select value={selectedAge} onValueChange={setSelectedAge}>
                <SelectTrigger className="h-10 hover:bg-primary/10 hover:text-primary hover:border-primary/30">
                  <SelectValue placeholder="Select appearance" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Appearances</SelectItem>
                  <SelectItem value="Teen">Teen</SelectItem>
                  <SelectItem value="Young Adult">Young Adult</SelectItem>
                  <SelectItem value="Adult">Adult</SelectItem>
                  <SelectItem value="Mature">Mature</SelectItem>
                  <SelectItem value="Senior">Senior</SelectItem>
                </SelectContent>
              </Select>
            </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Influencers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredInfluencers.map((influencer) => (
          <Card key={influencer.id} className="p-2 sm:p-4 hover:shadow-lg transition-shadow">
            <button
              onClick={() => handleCardClick(influencer)}
              className="flex items-center gap-1.5 sm:gap-3 mb-1 sm:mb-2 w-full text-left hover:opacity-80 transition-opacity"
            >
              {renderAvatar(influencer, "w-9 h-9 sm:w-12 sm:h-12", "text-base sm:text-xl")}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1 leading-none">
                  <h3 className="font-semibold text-xs sm:text-sm truncate cursor-pointer">{influencer.name}</h3>
                  {influencer.verified && (
                    <CheckCircle2 className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-primary shrink-0" />
                  )}
                </div>
                <p className="text-[10px] sm:text-xs text-muted-foreground cursor-pointer leading-none mt-0.5">{influencer.username}</p>
              </div>
            </button>

            {influencer.bio && (
              <p className="text-[10px] sm:text-xs text-muted-foreground mb-1 sm:mb-2 line-clamp-2">
                {influencer.bio}
              </p>
            )}

            <div className="flex flex-wrap gap-1 mb-1 sm:mb-2">
              {(influencer.niche && influencer.niche.length > 0 ? influencer.niche : [influencer.category]).map((tag) => (
                <Badge key={tag} className="bg-secondary/10 text-secondary border-secondary/30 text-[9px] sm:text-[10px] py-0 px-1.5 h-4 sm:h-5">
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-1.5 sm:gap-2 mb-1 sm:mb-2">
              <div className="leading-none">
                <div className="text-muted-foreground text-[9px] sm:text-[10px] mb-0.5">Followers</div>
                <div className="font-semibold text-[10px] sm:text-xs">{influencer.followers}</div>
              </div>
              <div className="leading-none">
                <div className="text-muted-foreground text-[9px] sm:text-[10px] mb-0.5">Engagement</div>
                <div className="font-semibold text-primary text-[10px] sm:text-xs">{influencer.engagement}</div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 sm:pt-2 border-t">
              <div className="leading-none">
                <div className="text-[9px] sm:text-[10px] text-muted-foreground mb-0.5">CPM Rate</div>
                <div className="font-bold text-sm sm:text-base">{influencer.rate}</div>
              </div>
              <Button
                size="sm"
                className="bg-primary/10 hover:bg-primary/20 text-primary border-2 border-primary/30 h-6 sm:h-8 text-[10px] sm:text-xs px-1.5 sm:px-2"
                onClick={() => onCollaborate(influencer)}
              >
                Collaborate
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Influencer Detail Modal */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              {selectedInfluencer && renderAvatar(selectedInfluencer, "w-14 h-14", "text-2xl")}
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-lg font-bold">{selectedInfluencer?.name}</span>
                  {selectedInfluencer?.verified && (
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                  )}
                </div>
                <div className="text-sm text-muted-foreground font-normal">{selectedInfluencer?.username}</div>
              </div>
            </DialogTitle>
            <DialogDescription>
              Influencer profile and rates
            </DialogDescription>
          </DialogHeader>

          {selectedInfluencer && (
            <div className="space-y-4 mt-2">
              {/* Bio */}
              {selectedInfluencer.bio && (
                <div>
                  <div className="text-xs font-medium text-muted-foreground mb-1">Bio</div>
                  <p className="text-sm">{selectedInfluencer.bio}</p>
                </div>
              )}

              {/* Niche Tags */}
              {selectedInfluencer.niche && selectedInfluencer.niche.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {selectedInfluencer.niche.map((tag) => (
                    <Badge key={tag} className="bg-secondary/10 text-secondary border-secondary/30 text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Location & Languages */}
              {(selectedInfluencer.location || (selectedInfluencer.languages && selectedInfluencer.languages.length > 0)) && (
                <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                  {selectedInfluencer.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {selectedInfluencer.location}
                    </span>
                  )}
                  {selectedInfluencer.languages && selectedInfluencer.languages.length > 0 && (
                    <span className="flex items-center gap-1">
                      <Globe className="h-3.5 w-3.5" />
                      {selectedInfluencer.languages.join(", ")}
                    </span>
                  )}
                </div>
              )}

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-muted/30 border">
                  <div className="text-xs text-muted-foreground mb-0.5">Total Followers</div>
                  <div className="font-bold text-lg">{selectedInfluencer.followers}</div>
                  <div className="text-[10px] text-muted-foreground mt-1 space-y-0.5">
                    {(selectedInfluencer.instagramFollowers ?? 0) > 0 && (
                      <div>Instagram: {(selectedInfluencer.instagramFollowers ?? 0).toLocaleString()}</div>
                    )}
                    {(selectedInfluencer.tiktokFollowers ?? 0) > 0 && (
                      <div>TikTok: {(selectedInfluencer.tiktokFollowers ?? 0).toLocaleString()}</div>
                    )}
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-muted/30 border">
                  <div className="text-xs text-muted-foreground mb-0.5">Engagement Rate</div>
                  <div className="font-bold text-lg text-primary">{selectedInfluencer.engagement}</div>
                </div>
              </div>

              {/* Social Handles */}
              {(selectedInfluencer.instagramHandle || selectedInfluencer.tiktokHandle || selectedInfluencer.youtubeHandle || selectedInfluencer.twitterHandle) && (
                <div>
                  <div className="text-xs font-medium text-muted-foreground mb-2">Social Profiles</div>
                  <div className="flex flex-wrap gap-2">
                    {selectedInfluencer.instagramHandle && (
                      <a
                        href={`https://instagram.com/${selectedInfluencer.instagramHandle}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg bg-muted/50 border hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-colors"
                      >
                        <Instagram className="h-3.5 w-3.5" />
                        @{selectedInfluencer.instagramHandle}
                      </a>
                    )}
                    {selectedInfluencer.tiktokHandle && (
                      <a
                        href={`https://tiktok.com/@${selectedInfluencer.tiktokHandle}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg bg-muted/50 border hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-colors"
                      >
                        TikTok @{selectedInfluencer.tiktokHandle}
                      </a>
                    )}
                    {selectedInfluencer.youtubeHandle && (
                      <a
                        href={`https://youtube.com/@${selectedInfluencer.youtubeHandle}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg bg-muted/50 border hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-colors"
                      >
                        YouTube @{selectedInfluencer.youtubeHandle}
                      </a>
                    )}
                    {selectedInfluencer.twitterHandle && (
                      <a
                        href={`https://twitter.com/${selectedInfluencer.twitterHandle}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg bg-muted/50 border hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-colors"
                      >
                        <X className="h-3.5 w-3.5" />
                        @{selectedInfluencer.twitterHandle}
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Pricing */}
              <div>
                <div className="text-xs font-medium text-muted-foreground mb-2">Pricing</div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {selectedInfluencer.pricingCPM && (
                    <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                      <div className="text-[10px] text-muted-foreground mb-0.5">CPM</div>
                      <div className="font-bold text-sm">{selectedInfluencer.pricingCPM}</div>
                      <div className="text-[10px] text-muted-foreground">per 1K views</div>
                    </div>
                  )}
                  {selectedInfluencer.pricingCPC && (
                    <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                      <div className="text-[10px] text-muted-foreground mb-0.5">CPC</div>
                      <div className="font-bold text-sm">{selectedInfluencer.pricingCPC}</div>
                      <div className="text-[10px] text-muted-foreground">per click</div>
                    </div>
                  )}
                  {selectedInfluencer.pricingCPE && (
                    <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                      <div className="text-[10px] text-muted-foreground mb-0.5">CPE</div>
                      <div className="font-bold text-sm">{selectedInfluencer.pricingCPE}</div>
                      <div className="text-[10px] text-muted-foreground">per engagement</div>
                    </div>
                  )}
                  {!selectedInfluencer.pricingCPM && !selectedInfluencer.pricingCPC && !selectedInfluencer.pricingCPE && (
                    <div className="p-3 rounded-lg bg-muted/30 border col-span-full">
                      <div className="text-sm text-muted-foreground">Rate: {selectedInfluencer.rate}</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Collaborate Button */}
              <Button
                className="w-full h-11 bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white"
                onClick={() => {
                  setShowDetailModal(false);
                  onCollaborate(selectedInfluencer);
                }}
              >
                Invite to Campaign
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
