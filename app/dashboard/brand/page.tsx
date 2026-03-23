"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AnimatePresence } from "framer-motion";
import {
  DollarSign,
  CheckCircle2,
  Wallet,
  AlertCircle,
  Mail,
} from "lucide-react";

import { BrandNav, BrandSidebar, MobileNav } from "./components/brand-nav";
import { DiscoverTab } from "./components/discover-tab";
import { CampaignsTab } from "./components/campaigns-tab";
import { CreateCampaignTab } from "./components/create-campaign-tab";
import { ProfileTab } from "./components/profile-tab";
import { SettingsTab } from "./components/settings-tab";
import type { Tab, Campaign, Influencer, Notification, CampaignInfluencer } from "./components/types";

export default function BrandDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("discover");

  const [companyName, setCompanyName] = useState("Your Company");
  const [companyBio, setCompanyBio] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("");
  const [twitterUrl, setTwitterUrl] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [companyCountry, setCompanyCountry] = useState("United States");
  const [companyIndustry, setCompanyIndustry] = useState("Fashion & Style");

  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [balance, setBalance] = useState(0);

  const [showCollaborateModal, setShowCollaborateModal] = useState(false);
  const [selectedInfluencer, setSelectedInfluencer] = useState<Influencer | null>(null);
  const [selectedCampaignId, setSelectedCampaignId] = useState<number | null>(null);

  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [collaborations, setCollaborations] = useState<any[]>([]);

  const [notifications, setNotifications] = useState<Notification[]>([]);

  const [showInfluencerDetails, setShowInfluencerDetails] = useState(false);
  const [selectedInfluencerDetails, setSelectedInfluencerDetails] = useState<CampaignInfluencer | null>(null);
  const [showCounterOfferModal, setShowCounterOfferModal] = useState(false);
  const [counterOfferInfluencer, setCounterOfferInfluencer] = useState<CampaignInfluencer | null>(null);
  const [counterOfferPrice, setCounterOfferPrice] = useState("");
  const [showInsufficientFundsDialog, setShowInsufficientFundsDialog] = useState(false);
  const [showVerifyPopup, setShowVerifyPopup] = useState(false);
  const [emailVerified, setEmailVerified] = useState(true);

  // Fetch real data from API — mock data serves as fallback
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch brand's campaigns
        const campaignsRes = await fetch('/api/campaigns');
        if (campaignsRes.ok) {
          const data = await campaignsRes.json();
          if (data.campaigns && data.campaigns.length > 0) {
            const transformedCampaigns: Campaign[] = data.campaigns.map((c: Record<string, unknown>) => ({
              id: c.id,
              title: (c.title as string) || '',
              status: ((c.status as string) || 'draft').toLowerCase() as 'active' | 'draft',
              budgetMin: String(((c.budgetMin as number) || 0) / 100),
              budgetMax: String(((c.budgetMax as number) || 0) / 100),
              applications: (c._count as Record<string, number>)?.collaborations || 0,
              applicationsList: undefined,
              startDate: c.createdAt ? new Date(c.createdAt as string).toISOString().split('T')[0] : '',
              endDate: '',
              influencerCount: String((c.desiredInfluencerCount as number) || 1),
              description: (c.description as string) || '',
              goal: '',
              platforms: [],
              contentFormats: [],
              pricingModels: [],
              contentType: '',
              influencerNiches: [],
              productName: '',
              productPrice: '',
              productPhoto: '',
              productLink: '',
              productDescription: '',
              brandTag: '',
              hashtags: '',
              creatorScript: '',
              detailedRequirements: Array.isArray(c.deliverables) ? (c.deliverables as string[]).join('\n') : '',
              createdAt: (c.createdAt as string) || new Date().toISOString(),
              currentStage: 1,
            }));
            setCampaigns(transformedCampaigns);
          }
        }
      } catch (error) {
        console.error('Failed to fetch campaigns:', error);
      }

      try {
        // Fetch approved influencers for browse/discover
        const influencersRes = await fetch('/api/influencers');
        if (influencersRes.ok) {
          const data = await influencersRes.json();
          if (data.influencers && data.influencers.length > 0) {
            const transformedInfluencers: Influencer[] = data.influencers.map((inf: Record<string, unknown>) => {
              const igFollowers = (inf.instagramFollowers as number) || 0;
              let followersStr: string;
              if (igFollowers >= 1_000_000) {
                followersStr = `${(igFollowers / 1_000_000).toFixed(1)}M`;
              } else if (igFollowers >= 1_000) {
                followersStr = `${(igFollowers / 1_000).toFixed(0)}K`;
              } else {
                followersStr = String(igFollowers);
              }

              const engagement = inf.instagramEngagement != null ? Number(inf.instagramEngagement) : 0;
              const pricePerPost = (inf.pricePerPost as number) || 0;

              return {
                id: inf.id,
                name: (inf.handle as string) || '',
                username: `@${(inf.handle as string) || ''}`,
                avatar: '🌟',
                followers: followersStr,
                engagement: `${engagement.toFixed(1)}%`,
                category: Array.isArray(inf.niche) && (inf.niche as string[]).length > 0 ? (inf.niche as string[])[0] : 'Other',
                rate: `$${(pricePerPost / 100).toFixed(0)}`,
                verified: (inf.isVerified as boolean) || false,
                gender: 'Unknown',
                ethnicity: 'Unknown',
                age: 'Unknown',
              } as Influencer;
            });
            setInfluencers(transformedInfluencers);
          }
        }
      } catch (error) {
        console.error('Failed to fetch influencers:', error);
      }

      try {
        // Fetch wallet balance
        const walletRes = await fetch('/api/wallet');
        if (walletRes.ok) {
          const data = await walletRes.json();
          if (data.wallet && typeof data.wallet.balance === 'number') {
            setBalance(data.wallet.balance / 100);
          }
        }
      } catch (error) {
        console.error('Failed to fetch wallet:', error);
      }

      try {
        // Fetch brand profile
        const brandRes = await fetch('/api/brands/me');
        if (brandRes.ok) {
          const data = await brandRes.json();
          if (data.brand) {
            const b = data.brand;
            if (b.companyName) setCompanyName(b.companyName);
            if (b.description) setCompanyBio(b.description);
            if (b.website) setWebsiteUrl(b.website);
            if (b.industry) setCompanyIndustry(b.industry);
          }
        }
      } catch (error) {
        console.error('Failed to fetch brand profile:', error);
      }

      // Fetch collaborations for brand's campaigns
      try {
        const collabRes = await fetch("/api/collaborations");
        if (collabRes.ok) {
          const collabData = await collabRes.json();
          // Store collaborations in state for use in campaign views
          if (collabData.collaborations) {
            setCollaborations(collabData.collaborations);
          }
        }
      } catch (error) {
        console.error("Failed to fetch collaborations:", error);
      }

      // Check email verification
      try {
        const profileRes = await fetch('/api/profiles/me');
        if (profileRes.ok) {
          const profileData = await profileRes.json();
          if (profileData.profile && !profileData.profile.emailVerified) {
            setEmailVerified(false);
            setShowVerifyPopup(true);
          }
        }
      } catch (e) {
        console.error('Failed to check profile:', e);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <BrandNav
        notifications={notifications}
        setNotifications={setNotifications}
      />

      <div className="flex">
        <BrandSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          balance={balance}
          setBalance={setBalance}
        />

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8">
          <AnimatePresence mode="wait">
            {activeTab === "discover" && (
              <DiscoverTab
                influencers={influencers}
                onCollaborate={(influencer) => {
                  setSelectedInfluencer(influencer);
                  setShowCollaborateModal(true);
                }}
              />
            )}

            {activeTab === "campaigns" && (
              <CampaignsTab
                campaigns={campaigns}
                setCampaigns={setCampaigns}
                setActiveTab={setActiveTab}
                balance={balance}
                setShowInsufficientFundsDialog={setShowInsufficientFundsDialog}
              />
            )}

            {activeTab === "create-campaign" && (
              <CreateCampaignTab
                campaigns={campaigns}
                setCampaigns={setCampaigns}
                setActiveTab={setActiveTab}
              />
            )}

            {activeTab === "profile" && (
              <ProfileTab
                companyName={companyName}
                setCompanyName={setCompanyName}
                companyBio={companyBio}
                setCompanyBio={setCompanyBio}
                websiteUrl={websiteUrl}
                setWebsiteUrl={setWebsiteUrl}
                instagramUrl={instagramUrl}
                setInstagramUrl={setInstagramUrl}
                twitterUrl={twitterUrl}
                setTwitterUrl={setTwitterUrl}
                youtubeUrl={youtubeUrl}
                setYoutubeUrl={setYoutubeUrl}
                linkedinUrl={linkedinUrl}
                setLinkedinUrl={setLinkedinUrl}
                companyCountry={companyCountry}
                companyIndustry={companyIndustry}
              />
            )}

            {activeTab === "settings" && (
              <SettingsTab />
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Mobile Navigation */}
      <MobileNav activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Collaborate Modal */}
      <Dialog open={showCollaborateModal} onOpenChange={setShowCollaborateModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Invite to Campaign</DialogTitle>
            <DialogDescription>
              Select a campaign to invite {selectedInfluencer?.name}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label className="text-sm font-medium mb-3 block">Select Campaign</Label>
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {campaigns.map((campaign) => (
                  <button
                    key={campaign.id}
                    onClick={() => setSelectedCampaignId(campaign.id)}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                      selectedCampaignId === campaign.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="font-semibold">{campaign.title}</div>
                      <Badge
                        className={`ml-2 ${
                          campaign.status === "active"
                            ? "bg-primary/10 text-primary border-primary/30"
                            : campaign.status === "draft"
                            ? "bg-secondary/10 text-secondary border-secondary/30"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {campaign.status === "active" ? "Active" : "Draft"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>Budget: {campaign.budgetMin} - {campaign.budgetMax}</span>
                      <span>•</span>
                      <span>{campaign.applications} applicants</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Don&apos;t see your campaign?</span>
              <button
                onClick={() => {
                  setShowCollaborateModal(false);
                  setActiveTab("create-campaign");
                }}
                className="text-primary hover:underline"
              >
                Create New Campaign
              </button>
            </div>

            <Button
              disabled
              className="w-full h-11 bg-gradient-to-r from-primary to-secondary hover:opacity-90"
            >
              Send Invitation
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Influencer Details Modal with Stages */}
      <Dialog open={showInfluencerDetails} onOpenChange={setShowInfluencerDetails}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-2xl">
                {selectedInfluencerDetails?.avatar}
              </div>
              <div>
                <div className="text-lg font-bold">{selectedInfluencerDetails?.name}</div>
                <div className="text-sm text-muted-foreground font-normal">{selectedInfluencerDetails?.username}</div>
              </div>
            </DialogTitle>
            <DialogDescription>
              Collaboration progress and timeline
            </DialogDescription>
          </DialogHeader>

          {selectedInfluencerDetails && (
            <div className="space-y-6 mt-4">
              {/* Progress bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Overall Progress</span>
                  <span className="text-muted-foreground">
                    Stage {selectedInfluencerDetails.timelineStage}/4
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
                    style={{ width: `${((selectedInfluencerDetails.timelineStage || 1) / 4) * 100}%` }}
                  />
                </div>
              </div>

              {/* Stage 1: Discussion & Negotiation */}
              <div className={`rounded-xl border-2 p-5 ${(selectedInfluencerDetails.timelineStage || 1) >= 1 ? 'border-primary/50 bg-primary/5' : 'border-border bg-muted/20'}`}>
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${(selectedInfluencerDetails.timelineStage || 1) >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                    1
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-base mb-1">Discussion & Negotiation</h3>
                    <p className="text-xs text-muted-foreground">Price agreement and metrics planning</p>
                  </div>
                  {(selectedInfluencerDetails.timelineStage || 1) > 1 && (
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  )}
                </div>

                {selectedInfluencerDetails.proposedPrice && (
                  <div className="space-y-2 text-sm pl-14">
                    <div className="flex justify-between items-center p-2 rounded bg-background/50">
                      <span className="text-muted-foreground">Proposed Price:</span>
                      <span className="font-medium">${selectedInfluencerDetails.proposedPrice} ({selectedInfluencerDetails.proposedPricingModel})</span>
                    </div>
                    {selectedInfluencerDetails.brandApprovedPrice !== undefined && (
                      <div className="flex justify-between items-center p-2 rounded bg-background/50">
                        <span className="text-muted-foreground">Price Status:</span>
                        <Badge className={selectedInfluencerDetails.brandApprovedPrice ? "bg-primary/10 text-primary" : "bg-amber-500/10 text-amber-600"}>
                          {selectedInfluencerDetails.brandApprovedPrice ? "Approved" : "Pending"}
                        </Badge>
                      </div>
                    )}
                    {selectedInfluencerDetails.targetMetrics && (
                      <div className="flex justify-between items-center p-2 rounded bg-background/50">
                        <span className="text-muted-foreground">Target Metrics:</span>
                        <span className="font-medium">
                          {Object.entries(selectedInfluencerDetails.targetMetrics).map(([key, value]) =>
                            `${value.toLocaleString()} ${key}`
                          ).join(', ')}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Stage 2: Content Draft */}
              <div className={`rounded-xl border-2 p-5 ${(selectedInfluencerDetails.timelineStage || 1) >= 2 ? 'border-primary/50 bg-primary/5' : 'border-border bg-muted/20 opacity-60'}`}>
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${(selectedInfluencerDetails.timelineStage || 1) >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                    2
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-base mb-1">Content Draft</h3>
                    <p className="text-xs text-muted-foreground">Influencer submits first draft</p>
                  </div>
                  {(selectedInfluencerDetails.timelineStage || 1) > 2 && (
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  )}
                </div>

                {selectedInfluencerDetails.draftSubmitted && (
                  <div className="space-y-2 text-sm pl-14">
                    <div className="flex justify-between items-center p-2 rounded bg-background/50">
                      <span className="text-muted-foreground">Draft Status:</span>
                      <Badge className="bg-primary/10 text-primary">Submitted</Badge>
                    </div>
                    {selectedInfluencerDetails.draftUrl && (
                      <div className="p-2 rounded bg-background/50">
                        <a href={selectedInfluencerDetails.draftUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-sm">
                          View Draft →
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Stage 3: Revisions */}
              <div className={`rounded-xl border-2 p-5 ${(selectedInfluencerDetails.timelineStage || 1) >= 3 ? 'border-primary/50 bg-primary/5' : 'border-border bg-muted/20 opacity-60'}`}>
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${(selectedInfluencerDetails.timelineStage || 1) >= 3 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                    3
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-base mb-1">Revisions</h3>
                    <p className="text-xs text-muted-foreground">Review and approve final content</p>
                  </div>
                  {(selectedInfluencerDetails.timelineStage || 1) > 3 && (
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  )}
                </div>

                {(selectedInfluencerDetails.timelineStage || 1) >= 3 && (
                  <div className="space-y-2 text-sm pl-14">
                    <div className="flex justify-between items-center p-2 rounded bg-background/50">
                      <span className="text-muted-foreground">Revision Count:</span>
                      <span className="font-medium">{selectedInfluencerDetails.revisionCount || 0}</span>
                    </div>
                    {selectedInfluencerDetails.brandApprovedDraft !== undefined && (
                      <div className="flex justify-between items-center p-2 rounded bg-background/50">
                        <span className="text-muted-foreground">Approval Status:</span>
                        <Badge className={selectedInfluencerDetails.brandApprovedDraft ? "bg-primary/10 text-primary" : "bg-amber-500/10 text-amber-600"}>
                          {selectedInfluencerDetails.brandApprovedDraft ? "Approved" : "Pending Review"}
                        </Badge>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Stage 4: Published */}
              <div className={`rounded-xl border-2 p-5 ${(selectedInfluencerDetails.timelineStage || 1) >= 4 ? 'border-primary/50 bg-primary/5' : 'border-border bg-muted/20 opacity-60'}`}>
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${(selectedInfluencerDetails.timelineStage || 1) >= 4 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                    4
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-base mb-1">Published</h3>
                    <p className="text-xs text-muted-foreground">Content live and tracking metrics</p>
                  </div>
                  {(selectedInfluencerDetails.timelineStage || 1) >= 4 && selectedInfluencerDetails.targetMetricsReached && (
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  )}
                </div>

                {(selectedInfluencerDetails.timelineStage || 1) >= 4 && (
                  <div className="space-y-2 text-sm pl-14">
                    {selectedInfluencerDetails.publishedUrl && (
                      <div className="p-2 rounded bg-background/50">
                        <a href={selectedInfluencerDetails.publishedUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-sm">
                          View Published Content →
                        </a>
                      </div>
                    )}
                    {selectedInfluencerDetails.metricsDelivered !== undefined && (
                      <div className="flex justify-between items-center p-2 rounded bg-background/50">
                        <span className="text-muted-foreground">Metrics Delivered:</span>
                        <Badge className={selectedInfluencerDetails.metricsDelivered ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}>
                          {selectedInfluencerDetails.metricsDelivered ? "Yes" : "Pending"}
                        </Badge>
                      </div>
                    )}

                    {/* Payment Progress */}
                    <div className="mt-4 p-3 rounded-lg bg-background/80 border">
                      <div className="font-medium text-sm mb-1">Payment Progress</div>
                      {(() => {
                        const price = selectedInfluencerDetails.proposedPrice || 0;
                        const model = selectedInfluencerDetails.proposedPricingModel;
                        const metrics = selectedInfluencerDetails.targetMetrics || {};
                        let estimatedCost = 0;

                        if (model === "CPM" && metrics.views) {
                          estimatedCost = (price / 1000) * metrics.views;
                        } else if (model === "CPC" && metrics.clicks) {
                          estimatedCost = price * metrics.clicks;
                        } else if (model === "CPE" && metrics.engagements) {
                          estimatedCost = price * metrics.engagements;
                        }

                        return (
                          <>
                            <div className="text-xs text-muted-foreground mb-3">
                              Total: ${estimatedCost.toFixed(2)}
                            </div>
                            <div className="grid grid-cols-4 gap-2">
                              <div className={`text-center p-2 rounded ${selectedInfluencerDetails.payment25Sent ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                                <div className="text-xs font-medium">25%</div>
                                <div className="text-[10px] font-medium">${(estimatedCost * 0.25).toFixed(2)}</div>
                                <div className="text-[10px]">{selectedInfluencerDetails.payment25Sent ? '✓ Sent' : 'Pending'}</div>
                              </div>
                              <div className={`text-center p-2 rounded ${selectedInfluencerDetails.payment50Sent ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                                <div className="text-xs font-medium">50%</div>
                                <div className="text-[10px] font-medium">${(estimatedCost * 0.50).toFixed(2)}</div>
                                <div className="text-[10px]">{selectedInfluencerDetails.payment50Sent ? '✓ Sent' : 'Pending'}</div>
                              </div>
                              <div className={`text-center p-2 rounded ${selectedInfluencerDetails.payment75Sent ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                                <div className="text-xs font-medium">75%</div>
                                <div className="text-[10px] font-medium">${(estimatedCost * 0.75).toFixed(2)}</div>
                                <div className="text-[10px]">{selectedInfluencerDetails.payment75Sent ? '✓ Sent' : 'Pending'}</div>
                              </div>
                              <div className={`text-center p-2 rounded ${selectedInfluencerDetails.payment100Sent ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                                <div className="text-xs font-medium">100%</div>
                                <div className="text-[10px] font-medium">${(estimatedCost * 1.00).toFixed(2)}</div>
                                <div className="text-[10px]">{selectedInfluencerDetails.payment100Sent ? '✓ Sent' : 'Pending'}</div>
                              </div>
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Counter Offer Modal */}
      <Dialog open={showCounterOfferModal} onOpenChange={setShowCounterOfferModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Counter Offer</DialogTitle>
            <DialogDescription>
              Propose a different price for {counterOfferInfluencer?.name}
            </DialogDescription>
          </DialogHeader>

          {counterOfferInfluencer && (
            <div className="space-y-4 mt-4">
              {/* Current Price */}
              <div className="p-4 rounded-xl bg-muted/30 border">
                <div className="text-xs text-muted-foreground mb-2">Current Proposal</div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold">${counterOfferInfluencer.proposedPrice}</span>
                  <Badge variant="outline" className="text-sm">
                    {counterOfferInfluencer.proposedPricingModel}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {counterOfferInfluencer.proposedPricingModel === "CPM" && "Cost per 1000 impressions"}
                  {counterOfferInfluencer.proposedPricingModel === "CPC" && "Cost per click"}
                  {counterOfferInfluencer.proposedPricingModel === "CPE" && "Cost per engagement"}
                </p>
              </div>

              {/* Counter Offer Input */}
              <div>
                <Label htmlFor="counter-price" className="text-sm font-medium mb-2 block">
                  Your Counter Offer ({counterOfferInfluencer.proposedPricingModel})
                </Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="counter-price"
                    type="number"
                    placeholder={`e.g., ${((counterOfferInfluencer.proposedPrice || 0) * 0.8).toFixed(2)}`}
                    value={counterOfferPrice}
                    onChange={(e) => setCounterOfferPrice(e.target.value)}
                    className="pl-10 h-12 text-lg font-medium"
                    min="0"
                    step="0.01"
                    autoFocus
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1.5">
                  Suggest a price that works for your budget
                </p>
              </div>

              {/* Price Comparison */}
              {counterOfferPrice && parseFloat(counterOfferPrice) > 0 && (
                <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Difference:</span>
                    <span className={`font-medium ${
                      parseFloat(counterOfferPrice) < (counterOfferInfluencer.proposedPrice || 0)
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}>
                      {parseFloat(counterOfferPrice) < (counterOfferInfluencer.proposedPrice || 0) ? '-' : '+'}
                      ${Math.abs((counterOfferInfluencer.proposedPrice || 0) - parseFloat(counterOfferPrice)).toFixed(2)}
                      {' '}
                      ({Math.abs((((counterOfferInfluencer.proposedPrice || 0) - parseFloat(counterOfferPrice)) / (counterOfferInfluencer.proposedPrice || 1)) * 100).toFixed(1)}%)
                    </span>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6">
                <Button
                  variant="outline"
                  className="flex-1 h-11 border-2"
                  onClick={() => {
                    setShowCounterOfferModal(false);
                    setCounterOfferPrice("");
                  }}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 h-11 bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white"
                  disabled
                >
                  Send Counter Offer
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Insufficient Funds Dialog */}
      <Dialog open={showInsufficientFundsDialog} onOpenChange={setShowInsufficientFundsDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-warning">
              <AlertCircle className="h-5 w-5" />
              Insufficient Funds
            </DialogTitle>
            <DialogDescription>
              Unable to approve collaboration terms
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="p-4 rounded-lg bg-warning/10 border border-warning/20">
              <p className="text-sm text-foreground">
                You do not have sufficient funds in your account to guarantee payment for this collaboration.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Available Balance:</span>
                <span className="font-semibold text-warning">${balance.toFixed(2)}</span>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-muted/50 border border-border">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">Why we verify funds</p>
                  <p className="text-xs text-muted-foreground">
                    We verify the availability of funds to ensure security and trust for both brands and influencers.
                    This protects influencers from unpaid work and ensures brands can fulfill their commitments.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Button
                onClick={() => {
                  setShowInsufficientFundsDialog(false);
                  setActiveTab("settings")
                }}
                className="w-full bg-gradient-to-r from-primary to-secondary"
              >
                <Wallet className="h-4 w-4 mr-2" />
                Add Funds to Account
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Email Verification Popup */}
      {showVerifyPopup && !emailVerified && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-background border border-border rounded-2xl p-6 sm:p-8 w-full max-w-md mx-4 shadow-2xl">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Mail className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-center mb-2">Verify Your Email</h3>
            <p className="text-muted-foreground text-center text-sm mb-4">
              Please check your inbox and verify your email address. This is required for financial operations like deposits, withdrawals, and campaign management.
            </p>
            <div className="space-y-3">
              <Button
                className="w-full"
                onClick={async () => {
                  try {
                    await fetch('/api/auth/resend-verification', { method: 'POST' });
                    alert('Verification email sent! Check your inbox.');
                  } catch {
                    alert('Failed to send verification email.');
                  }
                }}
              >
                <Mail className="h-4 w-4 mr-2" />
                Resend Verification Email
              </Button>
              <Button
                variant="ghost"
                className="w-full text-muted-foreground"
                onClick={() => setShowVerifyPopup(false)}
              >
                Skip for now
              </Button>
            </div>
            <p className="text-xs text-muted-foreground text-center mt-4">
              You can still browse the platform, but deposits and withdrawals require a verified email.
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
