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
  AlertCircle,
  MapPin,
  Globe,
  Instagram,
  X,
  Send,
  Youtube,
} from "lucide-react";
import { XIcon } from "@/components/x-icon";
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
  const [showFilters, setShowFilters] = useState(false);
  const [selectedInfluencer, setSelectedInfluencer] = useState<Influencer | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const filteredInfluencers = influencers.filter((influencer) => {
    const matchesSearch = influencer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         influencer.username.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || influencer.category === selectedCategory;

    // Followers filter (using raw number)
    let matchesFollowers = true;
    if (selectedFollowers !== "all") {
      const f = influencer.rawFollowers || 0;
      const ranges: Record<string, [number, number]> = {
        "0-1k": [0, 1000], "1k-5k": [1000, 5000], "5k-10k": [5000, 10000],
        "10k-50k": [10000, 50000], "50k-100k": [50000, 100000],
        "100k-500k": [100000, 500000], "500k-1m": [500000, 1000000], "1m+": [1000000, Infinity],
      };
      const range = ranges[selectedFollowers];
      if (range) matchesFollowers = f >= range[0] && f < range[1];
    }

    // Engagement filter (using raw number)
    let matchesEngagement = true;
    if (selectedEngagement !== "all") {
      const e = influencer.rawEngagement || 0;
      const ranges: Record<string, [number, number]> = {
        "0-1": [0, 1], "1-3": [1, 3], "3-5": [3, 5],
        "5-8": [5, 8], "8-15": [8, 15], "15+": [15, Infinity],
      };
      const range = ranges[selectedEngagement];
      if (range) matchesEngagement = e >= range[0] && e < range[1];
    }

    return matchesSearch && matchesCategory && matchesFollowers && matchesEngagement;
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
        <h1 className="text-xl sm:text-3xl font-bold mb-2">Discover Talent</h1>
        <p className="text-muted-foreground text-sm sm:text-base">Find the perfect creators for your project</p>
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
            {(selectedCategory !== "all" || selectedFollowers !== "all" || selectedEngagement !== "all") && (
              <Badge className="ml-1 bg-primary text-primary-foreground px-1.5 py-0 text-xs">
                {[selectedCategory !== "all", selectedFollowers !== "all", selectedEngagement !== "all"].filter(Boolean).length}
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
                  <SelectItem value="DeFi">DeFi</SelectItem>
                  <SelectItem value="NFT & Digital Art">NFT & Digital Art</SelectItem>
                  <SelectItem value="GameFi">GameFi</SelectItem>
                  <SelectItem value="Chains & Infrastructure">Chains & Infrastructure</SelectItem>
                  <SelectItem value="Exchanges">Exchanges</SelectItem>
                  <SelectItem value="Memecoins">Memecoins</SelectItem>
                  <SelectItem value="DAOs & Governance">DAOs & Governance</SelectItem>
                  <SelectItem value="AI x Crypto">AI x Crypto</SelectItem>
                  <SelectItem value="Wallets & Security">Wallets & Security</SelectItem>
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
                  <SelectItem value="0-1k">0 - 1K</SelectItem>
                  <SelectItem value="1k-5k">1K - 5K</SelectItem>
                  <SelectItem value="5k-10k">5K - 10K</SelectItem>
                  <SelectItem value="10k-50k">10K - 50K</SelectItem>
                  <SelectItem value="50k-100k">50K - 100K</SelectItem>
                  <SelectItem value="100k-500k">100K - 500K</SelectItem>
                  <SelectItem value="500k-1m">500K - 1M</SelectItem>
                  <SelectItem value="1m+">1M+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-xs font-medium">Engagement Rate</Label>
                {(selectedCategory !== "all" || selectedFollowers !== "all" || selectedEngagement !== "all") && (
                  <button
                    onClick={() => {
                      setSelectedCategory("all");
                      setSelectedFollowers("all");
                      setSelectedEngagement("all");
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
                  <SelectItem value="0-1">0% - 1%</SelectItem>
                  <SelectItem value="1-3">1% - 3%</SelectItem>
                  <SelectItem value="3-5">3% - 5%</SelectItem>
                  <SelectItem value="5-8">5% - 8%</SelectItem>
                  <SelectItem value="8-15">8% - 15%</SelectItem>
                  <SelectItem value="15+">15%+</SelectItem>
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
          <Card key={influencer.id} className="p-3 hover:shadow-lg transition-shadow overflow-hidden cursor-pointer" onClick={() => handleCardClick(influencer)}>
            {/* Row 1: Avatar + Name + Niche */}
            <div className="flex items-start gap-2.5 mb-2">
              <div className="shrink-0">
                {renderAvatar(influencer, "w-10 h-10", "text-base")}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <div>
                    <h3 className="font-semibold text-sm truncate">{influencer.name}</h3>
                  </div>
                  {influencer.verified ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                  ) : (
                    <AlertCircle className="h-3.5 w-3.5 text-muted-foreground/40 shrink-0" />
                  )}
                  {influencer.foundingMember && (
                    <span className="text-[8px] px-1 py-0.5 rounded bg-amber-500/10 text-amber-600 border border-amber-500/20 font-medium shrink-0">FM</span>
                  )}
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[11px] text-muted-foreground">{influencer.username}</span>
                  <span className="text-muted-foreground/30">·</span>
                  {(influencer.niche && influencer.niche.length > 0 ? influencer.niche : [influencer.category]).slice(0, 1).map((tag) => (
                    <span key={tag} className="text-[10px] text-secondary font-medium">{tag}</span>
                  ))}
                </div>
                {influencer.bio && (
                  <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-1">{influencer.bio}</p>
                )}
              </div>
            </div>

            {/* Row 2: Stats inline + Social icons */}
            <div className="flex items-center justify-between mb-2 px-0.5">
              <div className="flex items-center gap-3 text-xs">
                <span><span className="text-muted-foreground">Followers</span> <strong>{influencer.followers}</strong></span>
                <span><span className="text-muted-foreground">Eng</span> <strong className="text-primary">{influencer.engagement}</strong></span>
                {influencer.rate !== 'N/A' && (
                  <span><span className="text-muted-foreground">{influencer.rateLabel}</span> <strong>{influencer.rate}</strong></span>
                )}
              </div>
              <div className="flex items-center gap-1.5 text-muted-foreground/50">
                {influencer.twitterHandle && <XIcon className="h-3 w-3" />}
                {influencer.telegramHandle && <Send className="h-3 w-3" />}
                {influencer.instagramHandle && <Instagram className="h-3 w-3" />}
                {influencer.tiktokHandle && <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" /></svg>}
                {influencer.youtubeHandle && <Youtube className="h-3 w-3" />}
              </div>
            </div>

            {/* Row 3: Action */}
            <Button
              size="sm"
              className="w-full bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 h-7 text-xs"
              onClick={(e) => { e.stopPropagation(); onCollaborate(influencer); }}
            >
              Collaborate
            </Button>
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
              <div className="space-y-3">
                {/* Per-platform followers */}
                {selectedInfluencer.platformFollowers && selectedInfluencer.platformFollowers.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {selectedInfluencer.platformFollowers.map((pf) => (
                      <div key={pf.platform} className="p-2.5 rounded-lg bg-muted/30 border text-center">
                        <div className="font-bold text-sm">{pf.count.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">{pf.platform}</div>
                      </div>
                    ))}
                  </div>
                )}
                {/* Engagement Rate */}
                {selectedInfluencer.rawEngagement > 0 && (
                  <div className="p-2.5 rounded-lg bg-primary/5 border border-primary/20">
                    <div className="text-xs text-muted-foreground mb-0.5">Engagement Rate</div>
                    <div className="font-bold text-lg text-primary">{selectedInfluencer.engagement}</div>
                  </div>
                )}
              </div>

              {/* Social Handles */}
              {(selectedInfluencer.instagramHandle || selectedInfluencer.tiktokHandle || selectedInfluencer.youtubeHandle || selectedInfluencer.twitterHandle || selectedInfluencer.telegramHandle) && (
                <div>
                  <div className="text-xs font-medium text-muted-foreground mb-2">Social Profiles</div>
                  <div className="flex flex-wrap gap-2">
                    {([
                      { handle: selectedInfluencer.twitterHandle, icon: <XIcon className="h-3.5 w-3.5" />, base: 'https://x.com/' },
                      { handle: selectedInfluencer.telegramHandle, icon: <Send className="h-3.5 w-3.5" />, base: 'https://t.me/' },
                      { handle: selectedInfluencer.instagramHandle, icon: <Instagram className="h-3.5 w-3.5" />, base: 'https://instagram.com/' },
                      { handle: selectedInfluencer.tiktokHandle, icon: <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" /></svg>, base: 'https://tiktok.com/@' },
                      { handle: selectedInfluencer.youtubeHandle, icon: <Youtube className="h-3.5 w-3.5" />, base: 'https://youtube.com/@' },
                    ]).filter(s => s.handle).map((s, i) => {
                      const clean = s.handle!.replace(/^https?:\/\/(www\.)?(instagram\.com|tiktok\.com|youtube\.com|x\.com|t\.me|twitter\.com)\/?@?/i, '').replace(/^@/, '').split('?')[0].split('/')[0];
                      const url = s.handle!.startsWith('http') ? s.handle! : `${s.base}${clean}`;
                      return (
                        <a key={i} href={url} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg bg-muted/50 border hover:bg-primary/10 hover:text-primary transition-colors">
                          {s.icon}
                          {clean}
                        </a>
                      );
                    })}
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
