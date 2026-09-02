"use client";

import { useState, useEffect } from "react";
import { LoadingScreen } from "@/components/loading-screen";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AnimatePresence, motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import {
  DollarSign,
  CheckCircle2,
  Wallet,
  AlertCircle,
  Mail,
  Building2,
} from "lucide-react";

import { BrandNav, BrandSidebar, MobileNav } from "./components/brand-nav";
import { DiscoverTab } from "./components/discover-tab";
import { CampaignsTab } from "./components/campaigns-tab";
import { CreateCampaignTab } from "./components/create-campaign-tab";
import { ProfileTab } from "./components/profile-tab";
import { SettingsTab } from "./components/settings-tab";
import type { Tab, Campaign, Influencer, CampaignInfluencer } from "./components/types";
import { COLLABORATION_STATUS_CONFIG } from "./components/types";

export default function BrandDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("discover");
  const [campaignResetKey, setCampaignResetKey] = useState(false);
  const [toast, setToast] = useState<{ message: string; variant: 'success' | 'error' } | null>(null);

  const showToast = (message: string, variant: 'success' | 'error' = 'success') => {
    setToast({ message, variant });
    setTimeout(() => setToast(null), 4000);
  };

  const [companyName, setCompanyName] = useState("Your Company");
  const [companyBio, setCompanyBio] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("");
  const [twitterUrl, setTwitterUrl] = useState("");
  const [telegramUrl, setTelegramUrl] = useState("");
  const [brandLogoUrl, setBrandLogoUrl] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [companyCountry] = useState("United States");
  const [companyIndustry, setCompanyIndustry] = useState("Fashion & Style");

  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [balance, setBalance] = useState(0);
  const [frozenBalance, setFrozenBalance] = useState(0);
  const [isFoundingMember, setIsFoundingMember] = useState(false);
  const [isVerifiedProject, setIsVerifiedProject] = useState(false);
  const [walletTransactions, setWalletTransactions] = useState<Array<{
    id: string; type: string; amount: number; fee: number;
    description: string | null; status: string; createdAt: string;
    currency?: string; network?: string; projectName?: string | null;
  }>>([]);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawCoin, setWithdrawCoin] = useState('');
  const [withdrawNetwork, setWithdrawNetwork] = useState('');
  const [withdrawCurrency, setWithdrawCurrency] = useState('');
  const [walletAddress, setWalletAddress] = useState('');

  const [showCollaborateModal, setShowCollaborateModal] = useState(false);
  const [selectedInfluencer, setSelectedInfluencer] = useState<Influencer | null>(null);
  const [selectedCampaignId, setSelectedCampaignId] = useState<number | null>(null);

  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [, setCollaborations] = useState<Record<string, unknown>[]>([]);

  const [showInfluencerDetails, setShowInfluencerDetails] = useState(false);
  const [selectedInfluencerDetails] = useState<CampaignInfluencer | null>(null);
  const [showCounterOfferModal, setShowCounterOfferModal] = useState(false);
  const [counterOfferInfluencer] = useState<CampaignInfluencer | null>(null);
  const [counterOfferPrice, setCounterOfferPrice] = useState("");
  const [showInsufficientFundsDialog, setShowInsufficientFundsDialog] = useState(false);
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [showVerifyPopup, setShowVerifyPopup] = useState(false);
  const [emailVerified, setEmailVerified] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

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
              status: ((c.status as string) || 'draft').toLowerCase() as 'active' | 'draft' | 'paused' | 'completed',
              budgetMin: String(Math.round(((c.budgetMin as number) || 0) / 100)),
              budgetMax: String(Math.round(((c.budgetMax as number) || 0) / 100)),
              applications: (c._count as Record<string, number>)?.collaborations || 0,
              applicationsList: undefined,
              startDate: c.startDate ? new Date(c.startDate as string).toISOString().split('T')[0] : c.createdAt ? new Date(c.createdAt as string).toISOString().split('T')[0] : '',
              endDate: c.endDate ? new Date(c.endDate as string).toLocaleDateString() : '',
              influencerCount: String((c.desiredInfluencerCount as number) || 1),
              description: (c.description as string) || '',
              goal: (c.goal as string) || '',
              platforms: Array.isArray(c.platforms) ? c.platforms as string[] : [],
              contentFormats: Array.isArray(c.contentFormats) ? c.contentFormats as string[] : [],
              pricingModels: Array.isArray(c.pricingModels) ? c.pricingModels as string[] : [],
              contentType: (c.contentType as string) || '',
              influencerNiches: Array.isArray(c.influencerNiches) ? c.influencerNiches as string[] : [],
              productName: (c.productName as string) || '',
              productPrice: (c.productPrice as string) || '',
              productPhoto: (c.productPhoto as string) || '',
              productLink: (c.productLink as string) || '',
              productDescription: (c.productDescription as string) || '',
              brandTag: (c.brandTag as string) || '',
              hashtags: (c.hashtags as string) || '',
              creatorScript: (c.creatorScript as string) || '',
              targetViews: (c.targetViews as string) || '',
              targetClicks: (c.targetClicks as string) || '',
              targetEngagements: (c.targetEngagements as string) || '',
              detailedRequirements: Array.isArray(c.deliverables) ? (c.deliverables as string[]).join('\n') : '',
              createdAt: (c.createdAt as string) || new Date().toISOString(),
              currentStage: 1,
            }));
            // Fetch collaborations to populate pipeline counts in table
            try {
              const collabRes = await fetch('/api/collaborations');
              if (collabRes.ok) {
                const collabData = await collabRes.json();
                if (collabData.collaborations) {
                  for (const camp of transformedCampaigns) {
                    const campCollabs = collabData.collaborations
                      .filter((c: Record<string, unknown>) => {
                        const colCampaign = c.campaign as Record<string, unknown>;
                        return colCampaign?.id === camp.id;
                      })
                      .map((c: Record<string, unknown>) => ({
                        id: (c.influencer as Record<string, unknown>)?.id || '',
                        status: c.status === 'APPLIED' ? 'pending' as const : 'approved' as const,
                        collaborationStatus: c.status as string,
                        influencerAgreed: c.influencerAgreed as boolean | undefined,
                        agreedPrice: c.agreedPrice ? (c.agreedPrice as number) / 100 : undefined,
                      }));
                    camp.applicationsList = campCollabs;
                  }
                }
              }
            } catch {
              // Pipeline counts will show 0 if collaborations fail to load
            }

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
              const tkFollowers = (inf.tiktokFollowers as number) || 0;
              const ytSubscribers = (inf.youtubeSubscribers as number) || 0;
              const twFollowers = (inf.twitterFollowers as number) || 0;
              const tgFollowers = (inf.telegramFollowers as number) || 0;

              const igAvgViews = (inf.instagramAvgViews as number) || 0;
              const tkAvgViews = (inf.tiktokAvgViews as number) || 0;
              const ytAvgViews = (inf.youtubeAvgViews as number) || 0;
              const twAvgViews = (inf.twitterAvgViews as number) || 0;
              const tgAvgViews = (inf.telegramAvgViews as number) || 0;

              // Per-platform followers for display
              const platformFollowers: { platform: string; count: number }[] = [];
              if (twFollowers > 0) platformFollowers.push({ platform: 'X', count: twFollowers });
              if (tgFollowers > 0) platformFollowers.push({ platform: 'Telegram', count: tgFollowers });
              if (igFollowers > 0) platformFollowers.push({ platform: 'Instagram', count: igFollowers });
              if (tkFollowers > 0) platformFollowers.push({ platform: 'TikTok', count: tkFollowers });
              if (ytSubscribers > 0) platformFollowers.push({ platform: 'YouTube', count: ytSubscribers });

              const totalFollowers = igFollowers + tkFollowers + ytSubscribers + twFollowers + tgFollowers;
              let followersStr: string;
              if (totalFollowers >= 1_000_000) {
                followersStr = `${(totalFollowers / 1_000_000).toFixed(1)}M`;
              } else if (totalFollowers >= 1_000) {
                followersStr = `${(totalFollowers / 1_000).toFixed(0)}K`;
              } else {
                followersStr = String(totalFollowers);
              }

              // Auto-calculate engagement: avgViews / followers per platform, then average
              const engRates: number[] = [];
              if (igFollowers > 0 && igAvgViews > 0) engRates.push((igAvgViews / igFollowers) * 100);
              if (tkFollowers > 0 && tkAvgViews > 0) engRates.push((tkAvgViews / tkFollowers) * 100);
              if (ytSubscribers > 0 && ytAvgViews > 0) engRates.push((ytAvgViews / ytSubscribers) * 100);
              if (twFollowers > 0 && twAvgViews > 0) engRates.push((twAvgViews / twFollowers) * 100);
              if (tgFollowers > 0 && tgAvgViews > 0) engRates.push((tgAvgViews / tgFollowers) * 100);
              const engagement = engRates.length > 0 ? engRates.reduce((a, b) => a + b, 0) / engRates.length : 0;

              // Build CPM/CPC/CPE rate strings from cents
              // New single-value rates
              const cpmRate = (inf.cpmRate as number) || 0;
              const cpcRate = (inf.cpcRate as number) || 0;
              const cpeRate = (inf.cpeRate as number) || 0;
              const avgPostPrice = (inf.averagePostPrice as number) || 0;

              // Legacy fallback
              const cpmMin = (inf.cpmMin as number) || 0;
              const cpmMax = (inf.cpmMax as number) || 0;

              const formatCents = (c: number) => c ? `$${(c / 100).toFixed(0)}` : '';

              const pricingCPM = cpmRate ? formatCents(cpmRate) : (cpmMin ? `$${(cpmMin / 100).toFixed(0)}-${(cpmMax / 100).toFixed(0)}` : undefined);
              const pricingCPC = cpcRate ? formatCents(cpcRate) : undefined;
              const pricingCPE = cpeRate ? formatCents(cpeRate) : undefined;

              // Primary rate display
              let rateStr: string;
              let rateLabel = 'Rate';
              if (avgPostPrice) { rateStr = formatCents(avgPostPrice); rateLabel = 'Per post'; }
              else if (cpmRate) { rateStr = formatCents(cpmRate); rateLabel = 'CPM'; }
              else if (pricingCPM) { rateStr = pricingCPM; rateLabel = 'CPM'; }
              else rateStr = 'N/A';

              // Extract avatarUrl from profile relation
              const profile = inf.profile as Record<string, unknown> | null;
              const avatarUrl = profile?.avatarUrl as string | undefined;

              const handle = (inf.handle as string) || '';
              const nicheArr = Array.isArray(inf.niche) ? (inf.niche as string[]) : [];

              return {
                id: inf.id,
                name: handle,
                username: `@${handle}`,
                avatar: handle ? handle.charAt(0).toUpperCase() : '?',
                avatarUrl: avatarUrl || undefined,
                followers: followersStr,
                rawFollowers: totalFollowers,
                platformFollowers,
                engagement: `${engagement.toFixed(1)}%`,
                rawEngagement: engagement,
                category: nicheArr.length > 0 ? nicheArr[0] : 'Other',
                rate: rateStr,
                rateLabel,
                verified: (inf.isVerified as boolean) || false,
                foundingMember: (inf.foundingMember as boolean) || false,
                referralCount: ((inf as Record<string, unknown>)._count as { referralsMade?: number })?.referralsMade || 0,
                gender: 'Unknown',
                ethnicity: 'Unknown',
                age: 'Unknown',
                bio: (inf.bio as string) || undefined,
                niche: nicheArr,
                pricingCPM,
                pricingCPC,
                pricingCPE,
                instagramHandle: (inf.instagramHandle as string) || undefined,
                tiktokHandle: (inf.tiktokHandle as string) || undefined,
                youtubeHandle: (inf.youtubeHandle as string) || undefined,
                twitterHandle: (inf.twitterHandle as string) || undefined,
                telegramHandle: (inf.telegramHandle as string) || undefined,
                location: (inf.location as string) || undefined,
                languages: Array.isArray(inf.languages) ? (inf.languages as string[]) : undefined,
                instagramFollowers: igFollowers,
                tiktokFollowers: tkFollowers,
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
            setFrozenBalance((data.wallet.frozenBalance || 0) / 100);
          }
          if (data.transactions) setWalletTransactions(data.transactions);
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

            // Redirect to onboarding if profile incomplete
            if (!b.companyName?.trim() || !b.industry?.trim()) {
              window.location.href = '/onboarding/brand';
              return;
            }

            if (b.companyName) setCompanyName(b.companyName);
            if (b.description) setCompanyBio(b.description);
            if (b.website) setWebsiteUrl(b.website);
            if (b.industry) setCompanyIndustry(b.industry);
            if (b.instagramHandle) setInstagramUrl(b.instagramHandle);
            if (b.twitterHandle) setTwitterUrl(b.twitterHandle);
            if (b.telegramHandle) setTelegramUrl(b.telegramHandle);
            if (b.youtubeHandle) setYoutubeUrl(b.youtubeHandle);
            if (b.linkedinHandle) setLinkedinUrl(b.linkedinHandle);
            if (b.isVerified) setIsVerifiedProject(true);
            if (b.foundingMember) setIsFoundingMember(true);
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
            // Update campaign application counts
            setCampaigns(prev => prev.map(camp => {
              const campCollabs = collabData.collaborations.filter(
                (c: Record<string, unknown>) => (c.campaign as Record<string, unknown>)?.id === camp.id
              );
              return { ...camp, applications: campCollabs.length };
            }));
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
          if (profileData.profile) {
            if (!profileData.profile.emailVerified) {
              setEmailVerified(false);
              setShowVerifyPopup(true);
            }
            if (profileData.profile.avatarUrl) setBrandLogoUrl(profileData.profile.avatarUrl);
          }
        }
      } catch (e) {
        console.error('Failed to check profile:', e);
      }
    };

    fetchData().finally(() => setIsLoading(false));

    // Poll for updates every 30 seconds
    const interval = setInterval(() => {
      fetchData();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Loading overlay */}
      {isLoading && <LoadingScreen />}
      <BrandNav onSettings={() => setActiveTab("settings")} />

      <div className="flex">
        <BrandSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          balance={balance}
          setBalance={setBalance}
          frozenBalance={frozenBalance}
          externalShowTopUp={showTopUpModal}
          setExternalShowTopUp={setShowTopUpModal}
          isFoundingMember={isFoundingMember}
          onResetCampaigns={() => setCampaignResetKey(prev => !prev)}
        />

        {/* Main Content */}
        <main className="flex-1 px-4 py-3 sm:p-6 lg:p-8 pb-20 lg:pb-8">
          {/* Verification Banner */}
          {!isVerifiedProject && (
            <div
              className="mb-4 rounded-xl border border-primary/30 bg-primary/5 p-4 flex items-start gap-3 cursor-pointer hover:bg-primary/10 transition-colors"
              onClick={() => setActiveTab("profile")}
            >
              <Building2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-semibold text-sm">Complete your profile to get verified</h4>
                <p className="text-muted-foreground text-xs mt-1">Fill in your company info, social media, and website. Verified projects get more trust from creators.</p>
              </div>
              <span className="text-xs text-primary font-medium shrink-0 mt-0.5">Go to Profile →</span>
            </div>
          )}
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
                resetView={campaignResetKey}
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
                telegramUrl={telegramUrl}
                setTelegramUrl={setTelegramUrl}
                youtubeUrl={youtubeUrl}
                setYoutubeUrl={setYoutubeUrl}
                linkedinUrl={linkedinUrl}
                setLinkedinUrl={setLinkedinUrl}
                companyCountry={companyCountry}
                companyIndustry={companyIndustry}
                logoUrl={brandLogoUrl}
                setLogoUrl={setBrandLogoUrl}
                showToast={showToast}
              />
            )}

            {activeTab === "wallet" && (
              <motion.div key="wallet" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
                <div className="mb-8">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <h1 className="text-lg sm:text-3xl font-bold mb-1">Wallet</h1>
                      <p className="text-muted-foreground text-xs sm:text-sm">Manage your funds and view transaction history</p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Button size="sm" className="h-8 sm:h-9 px-3 sm:px-5 text-xs sm:text-sm bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20" onClick={() => setShowTopUpModal(true)}>
                        Top Up
                      </Button>
                      <Button size="sm" variant="outline" className="h-8 sm:h-9 px-3 sm:px-5 text-xs sm:text-sm" onClick={() => setShowWithdrawModal(true)}>
                        Withdraw
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <div className="rounded-xl border border-border p-4 sm:p-6">
                      <p className="text-[10px] sm:text-xs text-muted-foreground mb-1 sm:mb-2">Available Balance</p>
                      <p className="text-lg sm:text-3xl font-bold text-primary">${balance.toFixed(2)}</p>
                    </div>
                    <div className="rounded-xl border border-border p-4 sm:p-6">
                      <p className="text-[10px] sm:text-xs text-muted-foreground mb-1 sm:mb-2">Frozen</p>
                      <p className="text-lg sm:text-3xl font-bold text-foreground">${frozenBalance.toFixed(2)}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold mb-3">Transaction History</h3>
                    <div className="rounded-xl border border-border">
                    {walletTransactions.length === 0 ? (
                      <div className="text-center py-12 px-6">
                        <p className="text-sm text-muted-foreground">No transactions yet</p>
                        <p className="text-xs text-muted-foreground mt-1">Top up your balance to start campaigns</p>
                      </div>
                    ) : (
                      <div>
                        {walletTransactions.map(tx => {
                          const t = tx.type.toLowerCase();
                          const isFailed = tx.status === 'failed';
                          const isPending = tx.status === 'pending' || tx.status === 'PENDING';
                          const typeLabels: Record<string, string> = {
                            deposit: 'Deposit', withdrawal: 'Withdrawal',
                            campaign_advance: 'Advance to Creator', campaign_payout: 'Final Payment to Creator',
                            campaign_payout_auto: 'Auto-release to Creator', campaign_freeze: 'Funds Frozen',
                            campaign_unfreeze: 'Funds Released', advance_refund: 'Advance Refund',
                            dispute_payout: 'Dispute Payout', dispute_refund: 'Dispute Refund',
                          };
                          const incomingTypes = ['deposit', 'campaign_unfreeze', 'advance_refund', 'dispute_refund'];
                          const frozenTypes = ['campaign_freeze', 'campaign_unfreeze'];
                          const isIncoming = incomingTypes.includes(t);
                          const isFrozen = frozenTypes.includes(t);
                          const txCampaignName = (tx as Record<string, unknown>).campaignName as string | null;
                          const description = txCampaignName
                            ? `Campaign: ${txCampaignName}`
                            : isFailed
                            ? 'Transaction failed — balance refunded'
                            : tx.description || (tx.currency ? `${tx.currency}` : '');
                          return (
                            <div key={tx.id} className={`flex items-center justify-between px-3 sm:px-5 py-3 sm:py-4 border-b border-border last:border-0 ${isFailed ? 'opacity-50' : ''}`}>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className={`text-sm font-medium ${isFailed ? 'text-muted-foreground' : isFrozen ? 'text-primary' : isIncoming ? 'text-success' : 'text-foreground'}`}>
                                    {typeLabels[t] || tx.type}
                                  </span>
                                  {isFailed && <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/10 text-red-600 font-medium">Failed</span>}
                                  {isPending && <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 font-medium">Pending</span>}
                                </div>
                                <p className="text-xs text-muted-foreground truncate mt-0.5">{description}</p>
                                <p className="text-[10px] text-muted-foreground">
                                  {new Date(tx.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                </p>
                              </div>
                              <div className="text-right shrink-0 ml-4">
                                {isFailed ? (
                                  <p className="text-sm font-semibold text-muted-foreground line-through">${(tx.amount / 100).toFixed(2)}</p>
                                ) : (
                                  <>
                                    <p className={`text-sm font-semibold ${isFrozen ? 'text-primary' : isIncoming ? 'text-success' : 'text-red-600'}`}>
                                      {isFrozen ? '' : isIncoming ? '+' : '-'}${(tx.amount / 100).toFixed(2)}
                                    </p>
                                    {tx.fee > 0 && <p className="text-[10px] text-muted-foreground">Fee: ${(tx.fee / 100).toFixed(2)}</p>}
                                  </>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground text-center">
                    Withdrawal fee: 3% (Founding Members: 2%). Minimum withdrawal: $10.
                  </p>
                </div>

                {/* Withdraw Modal */}
                <Dialog open={showWithdrawModal} onOpenChange={setShowWithdrawModal}>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Withdraw Funds</DialogTitle>
                      <DialogDescription>Send funds to your crypto wallet</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div>
                        <Label className="text-sm font-medium mb-2 block">Amount (USD)</Label>
                        <Input type="number" placeholder="0.00" min="10" step="0.01" value={withdrawAmount} onChange={(e) => setWithdrawAmount(e.target.value)} className="h-11" />
                      </div>
                      <div>
                        <Label className="text-sm font-medium mb-2 block">Select Cryptocurrency</Label>
                        <Select value={withdrawCoin} onValueChange={(v) => { setWithdrawCoin(v); setWithdrawNetwork(""); setWithdrawCurrency(""); }}>
                          <SelectTrigger className="h-11"><SelectValue placeholder="Choose cryptocurrency" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="usdt">USDT (Tether)</SelectItem>
                            <SelectItem value="usdc">USDC (USD Coin)</SelectItem>
                            <SelectItem value="btc">Bitcoin (BTC)</SelectItem>
                            <SelectItem value="eth">Ethereum (ETH)</SelectItem>
                            <SelectItem value="trx">Tron (TRX)</SelectItem>
                            <SelectItem value="bnb">BNB</SelectItem>
                            <SelectItem value="sol">Solana (SOL)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      {withdrawCoin && (
                        <div>
                          <Label className="text-sm font-medium mb-2 block">Select Network</Label>
                          <Select value={withdrawNetwork} onValueChange={(v) => {
                            setWithdrawNetwork(v);
                            const networkMap: Record<string, string> = {
                              "usdt-trc20": "USDT (TRC20)", "usdt-erc20": "USDT (ERC20)", "usdt-bep20": "USDT (BEP20)",
                              "usdc-trc20": "USDC (TRC20)", "usdc-erc20": "USDC (ERC20)",
                              "btc-btc": "BTC", "eth-erc20": "ETH", "trx-trc20": "TRX", "bnb-bep20": "BNB", "sol-sol": "SOL",
                            };
                            setWithdrawCurrency(networkMap[`${withdrawCoin}-${v}`] || "");
                          }}>
                            <SelectTrigger className="h-11"><SelectValue placeholder="Choose network" /></SelectTrigger>
                            <SelectContent>
                              {withdrawCoin === "usdt" && (<><SelectItem value="trc20">Tron (TRC20)</SelectItem><SelectItem value="erc20">Ethereum (ERC20)</SelectItem><SelectItem value="bep20">BNB Smart Chain (BEP20)</SelectItem></>)}
                              {withdrawCoin === "usdc" && (<><SelectItem value="erc20">Ethereum (ERC20)</SelectItem><SelectItem value="trc20">Tron (TRC20)</SelectItem></>)}
                              {withdrawCoin === "btc" && <SelectItem value="btc">Bitcoin</SelectItem>}
                              {withdrawCoin === "eth" && <SelectItem value="erc20">Ethereum (ERC20)</SelectItem>}
                              {withdrawCoin === "trx" && <SelectItem value="trc20">Tron (TRC20)</SelectItem>}
                              {withdrawCoin === "bnb" && <SelectItem value="bep20">BNB Smart Chain (BEP20)</SelectItem>}
                              {withdrawCoin === "sol" && <SelectItem value="sol">Solana</SelectItem>}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                      {withdrawNetwork && (
                        <div>
                          <Label className="text-sm font-medium mb-2 block">Wallet Address</Label>
                          <Input type="text" placeholder="Enter your wallet address" value={walletAddress} onChange={(e) => setWalletAddress(e.target.value)} className="h-11" />
                          <div className="mt-2 p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
                            <p className="text-xs text-amber-700">⚠️ Only send to a {withdrawCoin.toUpperCase()} address on the selected network. Using the wrong network may result in permanent loss.</p>
                          </div>
                        </div>
                      )}
                      {withdrawAmount && parseFloat(withdrawAmount) >= 10 && withdrawCurrency && (
                        <div className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground space-y-1">
                          <p>Minimum withdrawal: <span className="font-medium text-foreground">$10.00</span></p>
                          <p>Withdrawal fee: <span className="font-medium text-foreground">{isFoundingMember ? '3%' : '6%'}</span></p>
                          <p>You will receive: <span className="font-medium text-foreground">${(parseFloat(withdrawAmount) * (isFoundingMember ? 0.97 : 0.94)).toFixed(2)}</span> in {withdrawCoin.toUpperCase()}</p>
                        </div>
                      )}
                      <Button
                        className="w-full h-11 bg-gradient-to-r from-primary to-secondary"
                        disabled={!withdrawAmount || parseFloat(withdrawAmount || '0') < 10 || !walletAddress.trim() || !withdrawCurrency}
                        onClick={async () => {
                          const amount = parseFloat(withdrawAmount);
                          if (amount > balance) { showToast('Insufficient balance', 'error'); return; }
                          try {
                            const res = await fetch('/api/wallet/withdraw', {
                              method: 'POST', headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ amount, address: walletAddress.trim(), currency: withdrawCurrency }),
                            });
                            const data = await res.json();
                            if (res.ok) { showToast('Withdrawal submitted', 'success'); setShowWithdrawModal(false); setWithdrawAmount(''); setWalletAddress(''); setWithdrawCoin(''); setWithdrawNetwork(''); setWithdrawCurrency(''); }
                            else showToast(data.error || 'Failed to withdraw', 'error');
                          } catch { showToast('Failed to withdraw', 'error'); }
                        }}
                      >
                        Submit Withdrawal
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </motion.div>
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
                {campaigns.filter(c => c.status === "active" || c.status === "draft" || c.status === "paused").length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-6">No active campaigns. Create one first.</p>
                ) : campaigns.filter(c => c.status === "active" || c.status === "draft" || c.status === "paused").map((campaign) => (
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
                            : campaign.status === "paused"
                            ? "bg-amber-500/10 text-amber-600 border-amber-500/30"
                            : "bg-secondary/10 text-secondary border-secondary/30"
                        }`}
                      >
                        {campaign.status === "active" ? "Active" : campaign.status === "paused" ? "Paused" : "Draft"}
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
              disabled={!selectedCampaignId || !selectedInfluencer}
              className="w-full h-11 bg-gradient-to-r from-primary to-secondary hover:opacity-90"
              onClick={async () => {
                if (!selectedCampaignId || !selectedInfluencer) return;
                try {
                  const res = await fetch("/api/collaborations", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      campaignId: selectedCampaignId,
                      influencerId: selectedInfluencer.id,
                      isInvitation: true,
                    }),
                  });
                  const data = await res.json();
                  if (!res.ok) {
                    showToast(data.error || "Failed to send invitation", 'error');
                    return;
                  }
                  setShowCollaborateModal(false);
                  setSelectedCampaignId(null);
                  showToast("Invitation sent!", 'success');
                  // Refresh collaborations
                  const collabRes = await fetch("/api/collaborations");
                  if (collabRes.ok) {
                    const collabData = await collabRes.json();
                    if (collabData.collaborations) setCollaborations(collabData.collaborations);
                  }
                } catch {
                  showToast("Failed to send invitation", 'error');
                }
              }}
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
              {/* Collaboration Status Badge */}
              {selectedInfluencerDetails.collaborationStatus && (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Status:</span>
                  <Badge variant="outline" className={`text-xs ${COLLABORATION_STATUS_CONFIG[selectedInfluencerDetails.collaborationStatus]?.badgeClass || ''}`}>
                    {COLLABORATION_STATUS_CONFIG[selectedInfluencerDetails.collaborationStatus]?.label || selectedInfluencerDetails.collaborationStatus}
                  </Badge>
                </div>
              )}

              {/* Progress bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Overall Progress</span>
                  <span className="text-muted-foreground">
                    Stage {selectedInfluencerDetails.timelineStage || 1}/6
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
                    style={{ width: `${((selectedInfluencerDetails.timelineStage || 1) / 6) * 100}%` }}
                  />
                </div>
              </div>

              {/* Stage 1: Agreement */}
              <div className={`rounded-xl border-2 p-5 ${(selectedInfluencerDetails.timelineStage || 1) >= 1 ? 'border-primary/50 bg-primary/5' : 'border-border bg-muted/20'}`}>
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${(selectedInfluencerDetails.timelineStage || 1) >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                    1
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-base mb-1">Agreement</h3>
                    <p className="text-xs text-muted-foreground">Negotiation, price agreement, and terms</p>
                  </div>
                  {(selectedInfluencerDetails.timelineStage || 1) > 1 && (
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  )}
                </div>

                <div className="space-y-2 text-sm pl-14">
                  {selectedInfluencerDetails.proposedPrice != null && (
                    <div className="flex justify-between items-center p-2 rounded bg-background/50">
                      <span className="text-muted-foreground">Proposed Price:</span>
                      <span className="font-medium">${selectedInfluencerDetails.proposedPrice} ({selectedInfluencerDetails.proposedPricingModel})</span>
                    </div>
                  )}
                  {selectedInfluencerDetails.agreedPrice != null && (
                    <div className="flex justify-between items-center p-2 rounded bg-background/50">
                      <span className="text-muted-foreground">Agreed Price:</span>
                      <span className="font-medium text-primary">${selectedInfluencerDetails.agreedPrice.toFixed(2)}</span>
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
              </div>

              {/* Stage 2: Advance Paid */}
              <div className={`rounded-xl border-2 p-5 ${(selectedInfluencerDetails.timelineStage || 1) >= 2 ? 'border-secondary/50 bg-secondary/5' : 'border-border bg-muted/20 opacity-60'}`}>
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${(selectedInfluencerDetails.timelineStage || 1) >= 2 ? 'bg-secondary text-secondary-foreground' : 'bg-muted text-muted-foreground'}`}>
                    2
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-base mb-1">Advance Paid</h3>
                    <p className="text-xs text-muted-foreground">50% advance paid to creator, work begins</p>
                  </div>
                  {(selectedInfluencerDetails.timelineStage || 1) > 2 && (
                    <CheckCircle2 className="h-5 w-5 text-secondary" />
                  )}
                </div>

                {(selectedInfluencerDetails.timelineStage || 1) >= 2 && selectedInfluencerDetails.agreedPrice != null && (
                  <div className="space-y-2 text-sm pl-14">
                    <div className="flex justify-between items-center p-2 rounded bg-background/50">
                      <span className="text-muted-foreground">Advance (50%):</span>
                      <span className="font-medium text-secondary">${(selectedInfluencerDetails.agreedPrice / 2).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded bg-background/50">
                      <span className="text-muted-foreground">Status:</span>
                      <Badge className={selectedInfluencerDetails.advancePaid ? "bg-success/10 text-success" : "bg-amber-500/10 text-amber-600"}>
                        {selectedInfluencerDetails.advancePaid ? "Paid" : "Pending"}
                      </Badge>
                    </div>
                  </div>
                )}
              </div>

              {/* Stage 3: Content Review */}
              <div className={`rounded-xl border-2 p-5 ${(selectedInfluencerDetails.timelineStage || 1) >= 3 ? 'border-blue-500/50 bg-blue-500/5' : 'border-border bg-muted/20 opacity-60'}`}>
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${(selectedInfluencerDetails.timelineStage || 1) >= 3 ? 'bg-blue-500 text-white' : 'bg-muted text-muted-foreground'}`}>
                    3
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-base mb-1">Content Review</h3>
                    <p className="text-xs text-muted-foreground">Creator submits content for review</p>
                  </div>
                  {(selectedInfluencerDetails.timelineStage || 1) > 3 && (
                    <CheckCircle2 className="h-5 w-5 text-blue-500" />
                  )}
                </div>

                {(selectedInfluencerDetails.timelineStage || 1) >= 3 && (
                  <div className="space-y-2 text-sm pl-14">
                    {selectedInfluencerDetails.contentUrl && (
                      <div className="p-2 rounded bg-background/50">
                        <a href={selectedInfluencerDetails.contentUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline text-sm">
                          View Submitted Content
                        </a>
                      </div>
                    )}
                    <div className="flex justify-between items-center p-2 rounded bg-background/50">
                      <span className="text-muted-foreground">Revision Count:</span>
                      <span className="font-medium">{selectedInfluencerDetails.revisionCount || 0}/3</span>
                    </div>
                    {selectedInfluencerDetails.revisionNote && (
                      <div className="p-2 rounded bg-amber-500/5 border border-amber-500/20">
                        <span className="text-xs text-muted-foreground">Last revision note:</span>
                        <p className="text-sm mt-1">{selectedInfluencerDetails.revisionNote}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Stage 4: Publishing */}
              <div className={`rounded-xl border-2 p-5 ${(selectedInfluencerDetails.timelineStage || 1) >= 4 ? 'border-purple-500/50 bg-purple-500/5' : 'border-border bg-muted/20 opacity-60'}`}>
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${(selectedInfluencerDetails.timelineStage || 1) >= 4 ? 'bg-purple-500 text-white' : 'bg-muted text-muted-foreground'}`}>
                    4
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-base mb-1">Publishing</h3>
                    <p className="text-xs text-muted-foreground">Content approved, creator publishes to platform</p>
                  </div>
                  {(selectedInfluencerDetails.timelineStage || 1) > 4 && (
                    <CheckCircle2 className="h-5 w-5 text-purple-500" />
                  )}
                </div>
              </div>

              {/* Stage 5: Delivered */}
              <div className={`rounded-xl border-2 p-5 ${(selectedInfluencerDetails.timelineStage || 1) >= 5 ? 'border-green-500/50 bg-green-500/5' : 'border-border bg-muted/20 opacity-60'}`}>
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${(selectedInfluencerDetails.timelineStage || 1) >= 5 ? 'bg-green-500 text-white' : 'bg-muted text-muted-foreground'}`}>
                    5
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-base mb-1">Delivered</h3>
                    <p className="text-xs text-muted-foreground">Content published and awaiting project approval</p>
                  </div>
                  {(selectedInfluencerDetails.timelineStage || 1) > 5 && (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  )}
                </div>

                {(selectedInfluencerDetails.timelineStage || 1) >= 5 && (
                  <div className="space-y-2 text-sm pl-14">
                    {selectedInfluencerDetails.publishedUrl && (
                      <div className="p-2 rounded bg-background/50">
                        <a href={selectedInfluencerDetails.publishedUrl} target="_blank" rel="noopener noreferrer" className="text-green-500 hover:underline text-sm">
                          View Published Content
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Stage 6: Completed */}
              <div className={`rounded-xl border-2 p-5 ${(selectedInfluencerDetails.timelineStage || 1) >= 6 ? 'border-success/50 bg-success/5' : 'border-border bg-muted/20 opacity-60'}`}>
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${(selectedInfluencerDetails.timelineStage || 1) >= 6 ? 'bg-success text-success-foreground' : 'bg-muted text-muted-foreground'}`}>
                    6
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-base mb-1">Completed</h3>
                    <p className="text-xs text-muted-foreground">Final payment released, collaboration complete</p>
                  </div>
                  {(selectedInfluencerDetails.timelineStage || 1) >= 6 && (
                    <CheckCircle2 className="h-5 w-5 text-success" />
                  )}
                </div>

                {(selectedInfluencerDetails.timelineStage || 1) >= 6 && selectedInfluencerDetails.agreedPrice != null && (
                  <div className="space-y-2 text-sm pl-14">
                    {/* Payment Progress (50/50 model) */}
                    <div className="p-3 rounded-lg bg-background/80 border">
                      <div className="font-medium text-sm mb-2">Payment Summary</div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className={`text-center p-2 rounded ${selectedInfluencerDetails.advancePaid ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                          <div className="text-xs font-medium">50% Advance</div>
                          <div className="text-sm font-bold">${(selectedInfluencerDetails.agreedPrice / 2).toFixed(2)}</div>
                          <div className="text-[10px]">{selectedInfluencerDetails.advancePaid ? 'Paid' : 'Pending'}</div>
                        </div>
                        <div className={`text-center p-2 rounded ${selectedInfluencerDetails.finalPaymentPaid ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                          <div className="text-xs font-medium">50% Final</div>
                          <div className="text-sm font-bold">${(selectedInfluencerDetails.agreedPrice / 2).toFixed(2)}</div>
                          <div className="text-[10px]">{selectedInfluencerDetails.finalPaymentPaid ? 'Paid' : 'Pending'}</div>
                        </div>
                      </div>
                      <div className="mt-2 p-2 rounded bg-success/5 border border-success/20 text-center">
                        <div className="text-xs text-muted-foreground">Total</div>
                        <div className="text-lg font-bold text-success">${selectedInfluencerDetails.agreedPrice.toFixed(2)}</div>
                      </div>
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
                  {counterOfferInfluencer.proposedPricingModel === "CPM" && "Price is based on views"}
                  {counterOfferInfluencer.proposedPricingModel === "CPC" && "Price is based on clicks"}
                  {counterOfferInfluencer.proposedPricingModel === "CPE" && "Price is based on engagement"}
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
                    We verify the availability of funds to ensure security and trust for both projects and creators.
                    This protects creators from unpaid work and ensures projects can fulfill their commitments.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Button
                onClick={() => {
                  setShowInsufficientFundsDialog(false);
                  setShowTopUpModal(true);
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
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-background border border-border rounded-2xl p-6 sm:p-8 w-full max-w-md mx-4 shadow-2xl">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Mail className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-center mb-2">Verify Your Email</h3>
            <p className="text-muted-foreground text-center text-sm mb-4">
              Verify your email to create campaigns, manage payments, and collaborate with creators.
            </p>
            <div className="space-y-3">
              <Button
                className="w-full"
                onClick={async () => {
                  try {
                    await fetch('/api/auth/resend-verification', { method: 'POST' });
                    showToast('Verification email sent! Check your inbox.', 'success');
                  } catch {
                    showToast('Failed to send verification email.', 'error');
                  }
                }}
              >
                <Mail className="h-4 w-4 mr-2" />
                Send Verification Email
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
              You can browse the platform, but campaigns and payments require a verified email.
            </p>
          </div>
        </div>
      )}

      {toast && (
        <div className={`fixed bottom-24 sm:bottom-6 left-4 right-4 sm:left-auto sm:right-6 z-[150] px-5 py-3 rounded-xl shadow-lg border backdrop-blur-sm ${
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

    </div>
  );
}
