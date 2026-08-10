"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { LoadingScreen } from "@/components/loading-screen";
import { XIcon } from "@/components/x-icon";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Wallet,
  Search,
  TrendingUp,
  Calendar,
  DollarSign,
  Settings,
  User,
  LogOut,
  ChevronDown,
  Filter,
  Eye,
  Heart,
  CheckCircle2,
  Clock,
  Briefcase,
  BarChart3,
  Camera,
  Save,
  Instagram,
  Youtube,
  ArrowRight,
  Link as LinkIcon,
  MessageSquare,
  Upload,
  ExternalLink,
  Rocket,
  Mail,
  AlertCircle,
  FileText,
  Send,
  Video,
  XCircle,
  Crown,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { NetworkLogo } from "@/components/logo";
import { NotificationBell } from "@/components/notification-bell";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

/** Label maps for content format values */
const FORMAT_LABELS: Record<string, string> = {
  "twitter-post": "X Post",
  "twitter-thread": "X Thread",
  "telegram-post": "Telegram Post",
  "telegram-ama": "Telegram AMA",
  "instagram-post": "Instagram Post",
  "instagram-story": "Instagram Story",
  "instagram-reel": "Instagram Reel",
  "tiktok-video": "TikTok Video",
  "youtube-video": "YouTube Video",
  "youtube-short": "YouTube Short",
};

type CampaignStatus =
  | "open"
  | "applied"
  | "approved"
  | "active"
  | "completed"
  | "content_review"
  | "revision"
  | "publishing"
  | "delivered"
  | "disputed"
  | "resolved"
  | "cancelled";

interface Campaign {
  id: number | string;
  campaignId?: string; // actual campaign ID (for myCampaigns, id is collaboration ID)
  title: string;
  brand: string;
  brandAvatar: string;
  category: string;
  budget: number;
  budgetMin: number;
  budgetMax: number;
  pricingModel: string;
  pricingModels: string[];
  contentFormats: string[];
  description: string;
  requirements: string[];
  platforms: string[];
  deadline: string;
  status: CampaignStatus;
  startDate?: string;
  endDate?: string;
  goal?: string;
  targetViews?: string;
  targetClicks?: string;
  targetEngagements?: string;
  productName?: string;
  productPrice?: string;
  productLink?: string;
  brandTag?: string;
  hashtags?: string;
  detailedRequirements?: string;
  influencerTerms?: string;
  brandTerms?: string;
  influencerApprovedTerms?: boolean;
  brandApprovedTerms?: boolean;
  currentContentUrl?: string;
  contentApproved?: boolean;
  publishedUrl?: string;
  publishedUrls?: string[];
  publicMetrics?: {
    views?: number;
    likes?: number;
    comments?: number;
    shares?: number;
  };
  // Collaboration lifecycle fields
  collaborationId?: string;
  influencerAgreed?: boolean;
  revisionNote?: string;
  revisionCount?: number;
  contentUrl?: string;
  disputeReason?: string;
  /** Collaboration message (may contain invitation text) */
  collaborationMessage?: string;
}



export default function InfluencerDashboard() {
  const [activeTab, setActiveTab] = useState<"discover" | "my-campaigns" | "wallet" | "profile" | "settings">("discover");
  const activeTabRef = useRef(activeTab);
  useEffect(() => { activeTabRef.current = activeTab; }, [activeTab]);
  const [toast, setToast] = useState<{ message: string; variant: 'success' | 'error' } | null>(null);

  const showToast = (message: string, variant: 'success' | 'error' = 'success') => {
    setToast({ message, variant });
    setTimeout(() => setToast(null), 4000);
  };
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPlatform, setSelectedPlatform] = useState("all");
  const [selectedBudget, setSelectedBudget] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCampaignDetails, setSelectedCampaignDetails] = useState<Campaign | null>(null);
  const [isCampaignDetailsExpanded, setIsCampaignDetailsExpanded] = useState(false);
  const [contentLinkInput, setContentLinkInput] = useState("");
  const [publishedLinks, setPublishedLinks] = useState<Record<string, string>>({});
  const [applyingCampaign, setApplyingCampaign] = useState<Campaign | null>(null);
  const [proposedPrice, setProposedPrice] = useState("");
  const [applicationMessage, setApplicationMessage] = useState("");
  const [applyLoading, setApplyLoading] = useState(false);
  const [applyError, setApplyError] = useState("");
  const [applySuccess] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [termsHighlight, setTermsHighlight] = useState(false);

  const [discoverCampaigns, setDiscoverCampaigns] = useState<Campaign[]>([]);
  const [myCampaigns, setMyCampaigns] = useState<Campaign[]>([]);
  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  const [walletPending] = useState<number | null>(null);
  const [walletTotalEarned, setWalletTotalEarned] = useState<number | null>(null);
  const [walletTransactions, setWalletTransactions] = useState<Array<{
    id: string; type: string; amount: number; fee: number;
    description: string | null; status: string; createdAt: string;
    currency?: string; network?: string; projectName?: string | null;
  }>>([]);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [withdrawCurrency, setWithdrawCurrency] = useState("USDT (TRC20)");
  const [withdrawingApplication, setWithdrawingApplication] = useState<Campaign | null>(null);
  const [withdrawAppConfirmText, setWithdrawAppConfirmText] = useState("");
  const [withdrawAppLoading, setWithdrawAppLoading] = useState(false);
  const [pendingDeposits, setPendingDeposits] = useState(0);
  const [pendingWithdrawals, setPendingWithdrawals] = useState(0);
  const [showVerifyPopup, setShowVerifyPopup] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [totpEnabled, setTotpEnabled] = useState(false);
  const [totpSetup, setTotpSetup] = useState<{ qrCode: string; secret: string } | null>(null);
  const [totpVerifyCode, setTotpVerifyCode] = useState('');
  const [totpBackupCodes, setTotpBackupCodes] = useState<string[] | null>(null);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [campaignUpdates, setCampaignUpdates] = useState(true);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [emailVerified, setEmailVerified] = useState(true);
  const [influencerStatus, setInfluencerStatus] = useState<string>('');
  const [isFoundingMember, setIsFoundingMember] = useState(false);
  const [profileData, setProfileData] = useState<{
    displayName: string
    bio: string
    category: string
    instagram: string
    instagramFollowers: string
    instagramAvgViews: string
    tiktok: string
    tiktokFollowers: string
    tiktokAvgViews: string
    twitter: string
    twitterFollowers: string
    twitterAvgViews: string
    telegram: string
    youtube: string
    youtubeSubscribers: string
    youtubeAvgViews: string
    telegramFollowers: string
    telegramAvgViews: string
    twitterVerified: boolean
    instagramVerified: boolean
    tiktokVerified: boolean
    youtubeVerified: boolean
    telegramVerified: boolean
    cpmRate: string
    cpcRate: string
    cpeRate: string
    averagePostPrice: string
  }>({
    displayName: '',
    bio: '',
    category: '',
    instagram: '',
    instagramFollowers: '',
    instagramAvgViews: '',
    tiktok: '',
    tiktokFollowers: '',
    tiktokAvgViews: '',
    twitter: '',
    twitterFollowers: '',
    twitterAvgViews: '',
    telegram: '',
    youtube: '',
    youtubeSubscribers: '',
    youtubeAvgViews: '',
    telegramFollowers: '',
    telegramAvgViews: '',
    twitterVerified: false,
    instagramVerified: false,
    tiktokVerified: false,
    youtubeVerified: false,
    telegramVerified: false,
    cpmRate: '',
    cpcRate: '',
    cpeRate: '',
    averagePostPrice: '',
  })

  const [isLoading, setIsLoading] = useState(true);

  // Auto-save profile on blur (when user leaves a field)
  const profileDataRef = useRef(profileData);
  useEffect(() => { profileDataRef.current = profileData; }, [profileData]);

  const autoSaveProfile = useCallback(async () => {
    const p = profileDataRef.current;
    try {
      await fetch('/api/influencers/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          handle: p.displayName,
          bio: p.bio,
          niche: p.category ? [p.category] : [],
          instagramHandle: p.instagram,
          instagramFollowers: p.instagramFollowers ? parseInt(p.instagramFollowers) : 0,
          instagramAvgViews: p.instagramAvgViews ? parseInt(p.instagramAvgViews) : 0,
          tiktokHandle: p.tiktok,
          tiktokFollowers: p.tiktokFollowers ? parseInt(p.tiktokFollowers) : 0,
          tiktokAvgViews: p.tiktokAvgViews ? parseInt(p.tiktokAvgViews) : 0,
          youtubeHandle: p.youtube,
          youtubeSubscribers: p.youtubeSubscribers ? parseInt(p.youtubeSubscribers) : 0,
          youtubeAvgViews: p.youtubeAvgViews ? parseInt(p.youtubeAvgViews) : 0,
          twitterHandle: p.twitter,
          twitterFollowers: p.twitterFollowers ? parseInt(p.twitterFollowers) : 0,
          twitterAvgViews: p.twitterAvgViews ? parseInt(p.twitterAvgViews) : 0,
          telegramHandle: p.telegram,
          telegramFollowers: p.telegramFollowers ? parseInt(p.telegramFollowers) : 0,
          telegramAvgViews: p.telegramAvgViews ? parseInt(p.telegramAvgViews) : 0,
          cpmRate: p.cpmRate ? parseFloat(p.cpmRate) : undefined,
          cpcRate: p.cpcRate ? parseFloat(p.cpcRate) : undefined,
          cpeRate: p.cpeRate ? parseFloat(p.cpeRate) : undefined,
          averagePostPrice: p.averagePostPrice ? parseFloat(p.averagePostPrice) : undefined,
        }),
      });
    } catch {
      // Silent fail for auto-save
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch available campaigns
        const campaignsRes = await fetch('/api/campaigns');
        if (campaignsRes.ok) {
          const data = await campaignsRes.json();
          if (data.campaigns && data.campaigns.length > 0) {
            const mapped: Campaign[] = data.campaigns.map((c: Record<string, unknown>) => ({
              id: c.id,
              title: (c.title as string) || '',
              brand: ((c as Record<string, unknown>).brand as Record<string, unknown>)?.companyName || 'Unknown Brand',
              brandAvatar: (((c as Record<string, unknown>).brand as Record<string, unknown>)?.profile as Record<string, unknown>)?.avatarUrl as string || '🏢',
              category: (c.influencerNiches as string[])?.[0] || ((c as Record<string, unknown>).brand as Record<string, string>)?.industry || '',
              budget: Math.round(((c.budgetMax as number) || 0) / 100),
              budgetMin: Math.round(((c.budgetMin as number) || 0) / 100),
              budgetMax: Math.round(((c.budgetMax as number) || 0) / 100),
              pricingModel: (Array.isArray(c.pricingModels) && (c.pricingModels as string[]).length > 0) ? (c.pricingModels as string[])[0].toUpperCase() : 'CPM',
              pricingModels: Array.isArray(c.pricingModels) ? c.pricingModels as string[] : [],
              contentFormats: Array.isArray(c.contentFormats) ? c.contentFormats as string[] : [],
              description: (c.description as string) || '',
              requirements: (c.deliverables as string[]) || [],
              platforms: Array.isArray(c.platforms) ? c.platforms as string[] : [],
              deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              status: 'open' as const,
              goal: (c.goal as string) || '',
              targetViews: (c.targetViews as string) || undefined,
              targetClicks: (c.targetClicks as string) || undefined,
              targetEngagements: (c.targetEngagements as string) || undefined,
            }));
            setDiscoverCampaigns(mapped);
          }
        }

        // Fetch user's collaborations
        const collabRes = await fetch('/api/collaborations');
        if (collabRes.ok) {
          const data = await collabRes.json();
          if (data.collaborations && data.collaborations.length > 0) {
            const statusMap: Record<string, CampaignStatus> = {
              APPLIED: 'applied',
              NEGOTIATING: 'approved',
              AGREED: 'approved',
              IN_PROGRESS: 'active',
              CONTENT_REVIEW: 'content_review',
              REVISION: 'revision',
              PUBLISHING: 'publishing',
              DELIVERED: 'delivered',
              COMPLETED: 'completed',
              CANCELLED: 'cancelled',
              DISPUTED: 'disputed',
              RESOLVED: 'resolved',
            };
            const mapped: Campaign[] = data.collaborations.map((collab: Record<string, unknown>) => {
              const campaign = collab.campaign as Record<string, unknown>;
              const brand = campaign?.brand as Record<string, unknown>;
              const agreedPrice = collab.agreedPrice as number | null;
              const proposedPrice = collab.proposedPrice as number;
              const budgetCents = agreedPrice || proposedPrice || 0;
              return {
                id: collab.id,
                campaignId: (campaign?.id as string) || '',
                title: (campaign?.title as string) || '',
                brand: (brand?.companyName as string) || 'Unknown Brand',
                brandAvatar: ((brand?.profile as Record<string, unknown>)?.avatarUrl as string) || '🏢',
                category: (campaign?.influencerNiches as string[])?.[0] || (brand?.industry as string) || '',
                budget: Math.round(budgetCents / 100),
                budgetMin: Math.round(((campaign?.budgetMin as number) || 0) / 100),
                budgetMax: Math.round(((campaign?.budgetMax as number) || 0) / 100),
                pricingModel: (Array.isArray(campaign?.pricingModels) && (campaign.pricingModels as string[]).length > 0) ? (campaign.pricingModels as string[])[0].toUpperCase() : 'CPM',
                pricingModels: Array.isArray(campaign?.pricingModels) ? campaign.pricingModels as string[] : [],
                contentFormats: Array.isArray(campaign?.contentFormats) ? campaign.contentFormats as string[] : [],
                description: (campaign?.description as string) || '',
                requirements: (collab.deliverables as string[]) || [],
                platforms: Array.isArray(campaign?.platforms) ? campaign.platforms as string[] : [],
                deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                status: statusMap[(collab.status as string)] || 'applied',
                goal: (campaign?.goal as string) || '',
                targetViews: (campaign?.targetViews as string) || undefined,
                targetClicks: (campaign?.targetClicks as string) || undefined,
                targetEngagements: (campaign?.targetEngagements as string) || undefined,
                collaborationId: collab.id as string,
                influencerAgreed: collab.influencerAgreed as boolean | undefined,
                revisionNote: (collab.revisionNote as string) || undefined,
                revisionCount: (collab.revisionCount as number) || 0,
                contentUrl: (collab.contentUrl as string) || undefined,
                publishedUrl: (collab.publishedUrl as string) || undefined,
                publishedUrls: Array.isArray(collab.publishedUrls) ? collab.publishedUrls as string[] : [],
                disputeReason: (collab.disputeReason as string) || undefined,
                collaborationMessage: (collab.message as string) || undefined,
                brandTerms: (collab.brandTerms as string) || undefined,
                influencerTerms: (collab.influencerTerms as string) || undefined,
              };
            });
            setMyCampaigns(mapped);
          }
        }

        // Fetch wallet balance
        const walletRes = await fetch('/api/wallet');
        if (walletRes.ok) {
          const data = await walletRes.json();
          if (data.wallet) {
            setWalletBalance(Math.round((data.wallet.balance || 0) / 100));
          }
          if (data.transactions) {
            setWalletTransactions(data.transactions);
            const txs = data.transactions as Array<{ type: string; status: string; amount: number }>;
            const payouts = txs
              .filter((t) => t.type === 'CAMPAIGN_PAYOUT')
              .reduce((sum: number, t) => sum + (t.amount || 0), 0);
            setWalletTotalEarned(Math.round(payouts / 100));
            const deposits = txs
              .filter((t) => t.type === 'DEPOSIT' && t.status === 'PENDING')
              .reduce((sum: number, t) => sum + (t.amount || 0), 0);
            const withdrawals = txs
              .filter((t) => t.type === 'WITHDRAWAL' && t.status === 'PENDING')
              .reduce((sum: number, t) => sum + (t.amount || 0), 0);
            setPendingDeposits(Math.round(deposits / 100));
            setPendingWithdrawals(Math.round(withdrawals / 100));
          }
        }
        // Fetch influencer profile
        try {
          const influencerRes = await fetch('/api/influencers/me')
          if (influencerRes.ok) {
            const data = await influencerRes.json()
            const inf = data.influencer
            if (inf) {
              setInfluencerStatus(inf.status || 'PENDING')
              if (inf.foundingMember) setIsFoundingMember(true)
              // Skip overwriting profile data when user is editing on profile tab
              if (activeTabRef.current !== 'profile') setProfileData({
                displayName: inf.handle || '',
                bio: inf.bio || '',
                category: inf.niche?.[0] || '',
                instagram: inf.instagramHandle || '',
                instagramFollowers: inf.instagramFollowers ? String(inf.instagramFollowers) : '',
                instagramAvgViews: inf.instagramAvgViews ? String(inf.instagramAvgViews) : '',
                tiktok: inf.tiktokHandle || '',
                tiktokFollowers: inf.tiktokFollowers ? String(inf.tiktokFollowers) : '',
                tiktokAvgViews: inf.tiktokAvgViews ? String(inf.tiktokAvgViews) : '',
                twitter: inf.twitterHandle || '',
                twitterFollowers: inf.twitterFollowers ? String(inf.twitterFollowers) : '',
                twitterAvgViews: inf.twitterAvgViews ? String(inf.twitterAvgViews) : '',
                telegram: inf.telegramHandle || '',
                youtube: inf.youtubeHandle || '',
                youtubeSubscribers: inf.youtubeSubscribers ? String(inf.youtubeSubscribers) : '',
                youtubeAvgViews: inf.youtubeAvgViews ? String(inf.youtubeAvgViews) : '',
                telegramFollowers: inf.telegramFollowers ? String(inf.telegramFollowers) : '',
                telegramAvgViews: inf.telegramAvgViews ? String(inf.telegramAvgViews) : '',
                twitterVerified: inf.twitterVerified || false,
                instagramVerified: inf.instagramVerified || false,
                tiktokVerified: inf.tiktokVerified || false,
                youtubeVerified: inf.youtubeVerified || false,
                telegramVerified: inf.telegramVerified || false,
                cpmRate: inf.cpmRate ? String(inf.cpmRate / 100) : '',
                cpcRate: inf.cpcRate ? String(inf.cpcRate / 100) : '',
                cpeRate: inf.cpeRate ? String(inf.cpeRate / 100) : '',
                averagePostPrice: inf.averagePostPrice ? String(inf.averagePostPrice / 100) : '',
              })
            }
          }
        } catch (e) {
          console.error('Failed to fetch influencer profile:', e)
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        // Keep mock data on error
      }

      // Check email verification
      try {
        const profileRes = await fetch('/api/profiles/me');
        if (profileRes.ok) {
          const profileData = await profileRes.json();
          if (profileData.profile) {
            if (profileData.profile.email) setUserEmail(profileData.profile.email);
            if (profileData.profile.totpEnabled) setTotpEnabled(true);
            if (!profileData.profile.emailVerified) {
              setEmailVerified(false);
              setShowVerifyPopup(true);
            }
            if (profileData.profile.avatarUrl) {
              setAvatarUrl(profileData.profile.avatarUrl);
            }
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
      refreshCollaborations();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const categories = [
    "all",
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
  ];

  const platforms = ["all", "Instagram", "TikTok", "YouTube", "Twitter"];

  const budgetRanges = [
    { value: "all", label: "All Budgets" },
    { value: "0-1000", label: "$0 - $1,000" },
    { value: "1000-3000", label: "$1,000 - $3,000" },
    { value: "3000-5000", label: "$3,000 - $5,000" },
    { value: "5000-10000", label: "$5,000 - $10,000" },
    { value: "10000+", label: "$10,000+" },
  ];

  const filteredDiscoverCampaigns = discoverCampaigns.filter((campaign) => {
    const matchesSearch =
      campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.brand.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || campaign.category === selectedCategory;
    const matchesPlatform =
      selectedPlatform === "all" || campaign.platforms.includes(selectedPlatform);

    let matchesBudget = true;
    if (selectedBudget !== "all") {
      const budget = campaign.budget;
      if (selectedBudget === "0-1000") matchesBudget = budget <= 1000;
      else if (selectedBudget === "1000-3000") matchesBudget = budget > 1000 && budget <= 3000;
      else if (selectedBudget === "3000-5000") matchesBudget = budget > 3000 && budget <= 5000;
      else if (selectedBudget === "5000-10000") matchesBudget = budget > 5000 && budget <= 10000;
      else if (selectedBudget === "10000+") matchesBudget = budget > 10000;
    }

    return matchesSearch && matchesCategory && matchesPlatform && matchesBudget;
  });



  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-blue-500/10 text-blue-600 border-blue-500/30";
      case "applied":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-500/30";
      case "approved":
        return "bg-amber-500/10 text-amber-600 border-amber-500/30";
      case "active":
        return "bg-primary/10 text-primary border-primary/30";
      case "content_review":
        return "bg-blue-500/10 text-blue-600 border-blue-500/30";
      case "revision":
        return "bg-orange-500/10 text-orange-600 border-orange-500/30";
      case "publishing":
        return "bg-purple-500/10 text-purple-600 border-purple-500/30";
      case "delivered":
        return "bg-green-500/10 text-green-600 border-green-500/30";
      case "completed":
        return "bg-gray-500/10 text-gray-600 border-gray-500/30";
      case "disputed":
        return "bg-red-500/10 text-red-600 border-red-500/30";
      case "resolved":
        return "bg-gray-500/10 text-gray-600 border-gray-500/30";
      case "cancelled":
        return "bg-gray-500/10 text-gray-600 border-gray-500/30";
      default:
        return "";
    }
  };

  const getStatusLabel = (status: CampaignStatus): string => {
    switch (status) {
      case "open": return "Open";
      case "applied": return "Applied";
      case "approved": return "Negotiating";
      case "active": return "In Progress";
      case "content_review": return "Under Review";
      case "revision": return "Revision Requested";
      case "publishing": return "Ready to Publish";
      case "delivered": return "Delivered";
      case "completed": return "Completed";
      case "disputed": return "Disputed";
      case "resolved": return "Resolved";
      case "cancelled": return "Cancelled";
      default: return status;
    }
  };

  const getStatusDotColor = (status: CampaignStatus): string => {
    switch (status) {
      case "active": return "bg-success";
      case "applied": return "bg-yellow-600";
      case "approved": return "bg-amber-500";
      case "content_review": return "bg-blue-600";
      case "revision": return "bg-orange-600";
      case "publishing": return "bg-purple-600";
      case "delivered": return "bg-green-600";
      case "disputed": return "bg-red-600";
      case "resolved": return "bg-gray-500";
      case "cancelled": return "bg-gray-500";
      case "completed": return "bg-gray-500";
      default: return "bg-muted-foreground";
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'twitter': return <XIcon className="h-3.5 w-3.5" />;
      case 'telegram': return <Send className="h-3.5 w-3.5" />;
      case 'instagram': return <Instagram className="h-3.5 w-3.5" />;
      case 'tiktok': return <Video className="h-3.5 w-3.5" />;
      case 'youtube': return <Youtube className="h-3.5 w-3.5" />;
      default: return null;
    }
  };

  const getPricingBadgeStyle = (model: string) => {
    const upper = model.toUpperCase();
    if (upper === 'CPM') return 'bg-primary/10 text-primary border border-primary/20';
    if (upper === 'CPC') return 'bg-secondary/10 text-secondary border border-secondary/20';
    return 'bg-muted text-foreground border border-border';
  };

  /** Helper to refresh collaborations list after a submit action */
  const refreshCollaborations = async () => {
    try {
      const collabRes = await fetch("/api/collaborations");
      if (collabRes.ok) {
        const collabData = await collabRes.json();
        if (collabData.collaborations && collabData.collaborations.length > 0) {
          const statusMap: Record<string, CampaignStatus> = {
            APPLIED: "applied",
            NEGOTIATING: "approved",
            AGREED: "active",
            IN_PROGRESS: "active",
            CONTENT_REVIEW: "content_review",
            REVISION: "revision",
            PUBLISHING: "publishing",
            DELIVERED: "delivered",
            COMPLETED: "completed",
            CANCELLED: "cancelled",
            DISPUTED: "disputed",
            RESOLVED: "resolved",
          };
          const mapped: Campaign[] = collabData.collaborations.map((collab: Record<string, unknown>) => {
            const campaign = collab.campaign as Record<string, unknown>;
            const brand = campaign?.brand as Record<string, unknown>;
            const agreedPrice = collab.agreedPrice as number | null;
            const colProposedPrice = collab.proposedPrice as number;
            const budgetCents = agreedPrice || colProposedPrice || 0;
            return {
              id: collab.id,
              campaignId: (campaign?.id as string) || '',
              title: (campaign?.title as string) || "",
              brand: (brand?.companyName as string) || "Unknown Brand",
              brandAvatar: ((brand?.profile as Record<string, unknown>)?.avatarUrl as string) || "🏢",
              category: (campaign?.influencerNiches as string[])?.[0] || (brand?.industry as string) || '',
              budget: Math.round(budgetCents / 100),
              budgetMin: Math.round(((campaign?.budgetMin as number) || 0) / 100),
              budgetMax: Math.round(((campaign?.budgetMax as number) || 0) / 100),
              pricingModel: (Array.isArray(campaign?.pricingModels) && (campaign.pricingModels as string[]).length > 0) ? (campaign.pricingModels as string[])[0].toUpperCase() : 'CPM',
              pricingModels: Array.isArray(campaign?.pricingModels) ? campaign.pricingModels as string[] : [],
              contentFormats: Array.isArray(campaign?.contentFormats) ? campaign.contentFormats as string[] : [],
              description: (campaign?.description as string) || "",
              requirements: (collab.deliverables as string[]) || [],
              platforms: Array.isArray(campaign?.platforms) ? campaign.platforms as string[] : [],
              deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
              status: statusMap[(collab.status as string)] || "applied",
              goal: (campaign?.goal as string) || '',
              collaborationId: collab.id as string,
              revisionNote: (collab.revisionNote as string) || undefined,
              revisionCount: (collab.revisionCount as number) || 0,
              contentUrl: (collab.contentUrl as string) || undefined,
              publishedUrl: (collab.publishedUrl as string) || undefined,
              disputeReason: (collab.disputeReason as string) || undefined,
              collaborationMessage: (collab.message as string) || undefined,
              brandTerms: (collab.brandTerms as string) || undefined,
              influencerTerms: (collab.influencerTerms as string) || undefined,
            };
          });
          setMyCampaigns(mapped);
          // Update the selected campaign details if one is selected
          if (selectedCampaignDetails) {
            const updated = mapped.find(c => c.id === selectedCampaignDetails.id);
            if (updated) {
              setSelectedCampaignDetails(updated);
            }
          }
        }
      }
    } catch (error) {
      console.error("Failed to refresh collaborations:", error);
    }
  };

  const handleNotificationToggle = async (field: 'emailNotifications' | 'campaignUpdates', value: boolean) => {
    if (field === 'emailNotifications') setEmailNotifications(value);
    else setCampaignUpdates(value);

    try {
      await fetch('/api/profiles/me/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: value }),
      });
    } catch {
      // Revert on error
      if (field === 'emailNotifications') setEmailNotifications(!value);
      else setCampaignUpdates(!value);
    }
  };

  /** Handle content/published URL submission */
  const handleSubmitContent = async (collaborationId: string | number, payload: { contentUrl?: string; publishedUrl?: string; publishedUrls?: string[] }) => {
    setSubmitLoading(true);
    try {
      const res = await fetch(`/api/collaborations/${collaborationId}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || "Failed to submit", "error");
        return;
      }
      showToast(
        (payload.publishedUrl || payload.publishedUrls) ? "Published links submitted!" : "Content submitted for review!",
        "success"
      );
      setContentLinkInput("");
      setPublishedLinks({});
      await refreshCollaborations();
    } catch {
      showToast("Something went wrong. Please try again.", "error");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleApply = async () => {
    if (!emailVerified) {
      setShowVerifyPopup(true);
      return;
    }
    if (!applyingCampaign || !proposedPrice) return;
    setApplyLoading(true);
    setApplyError("");
    try {
      const res = await fetch("/api/collaborations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          campaignId: applyingCampaign.id,
          proposedPrice: parseFloat(proposedPrice),
          message: applicationMessage,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setApplyError(data.error || "Failed to apply");
        return;
      }
      setApplyingCampaign(null);
      setProposedPrice("");
      setApplicationMessage("");
      showToast("Application submitted successfully!", "success");
      // Refresh collaborations
      const collabRes = await fetch("/api/collaborations");
      if (collabRes.ok) {
        const collabData = await collabRes.json();
        if (collabData.collaborations && collabData.collaborations.length > 0) {
          const statusMap: Record<string, CampaignStatus> = {
            APPLIED: "applied",
            NEGOTIATING: "approved",
            AGREED: "active",
            IN_PROGRESS: "active",
            CONTENT_REVIEW: "content_review",
            REVISION: "revision",
            PUBLISHING: "publishing",
            DELIVERED: "delivered",
            COMPLETED: "completed",
            CANCELLED: "cancelled",
            DISPUTED: "disputed",
            RESOLVED: "resolved",
          };
          const mapped: Campaign[] = collabData.collaborations.map((collab: Record<string, unknown>) => {
            const campaign = collab.campaign as Record<string, unknown>;
            const brand = campaign?.brand as Record<string, unknown>;
            const agreedPrice = collab.agreedPrice as number | null;
            const colProposedPrice = collab.proposedPrice as number;
            const budgetCents = agreedPrice || colProposedPrice || 0;
            return {
              id: collab.id,
              campaignId: (campaign?.id as string) || '',
              title: (campaign?.title as string) || "",
              brand: (brand?.companyName as string) || "Unknown Brand",
              brandAvatar: ((brand?.profile as Record<string, unknown>)?.avatarUrl as string) || "🏢",
              category: (campaign?.influencerNiches as string[])?.[0] || (brand?.industry as string) || '',
              budget: Math.round(budgetCents / 100),
              budgetMin: Math.round(((campaign?.budgetMin as number) || 0) / 100),
              budgetMax: Math.round(((campaign?.budgetMax as number) || 0) / 100),
              pricingModel: (Array.isArray(campaign?.pricingModels) && (campaign.pricingModels as string[]).length > 0) ? (campaign.pricingModels as string[])[0].toUpperCase() : 'CPM',
              pricingModels: Array.isArray(campaign?.pricingModels) ? campaign.pricingModels as string[] : [],
              contentFormats: Array.isArray(campaign?.contentFormats) ? campaign.contentFormats as string[] : [],
              description: (campaign?.description as string) || "",
              requirements: (collab.deliverables as string[]) || [],
              platforms: Array.isArray(campaign?.platforms) ? campaign.platforms as string[] : [],
              deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
              status: statusMap[(collab.status as string)] || "applied",
              goal: (campaign?.goal as string) || '',
              collaborationId: collab.id as string,
              revisionNote: (collab.revisionNote as string) || undefined,
              revisionCount: (collab.revisionCount as number) || 0,
              contentUrl: (collab.contentUrl as string) || undefined,
              publishedUrl: (collab.publishedUrl as string) || undefined,
              disputeReason: (collab.disputeReason as string) || undefined,
              collaborationMessage: (collab.message as string) || undefined,
              brandTerms: (collab.brandTerms as string) || undefined,
              influencerTerms: (collab.influencerTerms as string) || undefined,
            };
          });
          setMyCampaigns(mapped);
        }
      }
    } catch {
      setApplyError("Something went wrong. Please try again.");
    } finally {
      setApplyLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Loading overlay */}
      {isLoading && <LoadingScreen />}
      {/* Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-primary/5 backdrop-blur-md border-b border-border/50 py-4">
        <div className="px-6 sm:px-12 lg:px-16">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <NetworkLogo className="w-8 h-8 transition-transform group-hover:scale-110" />
              <div className="flex items-baseline gap-1">
                <span className="text-xl sm:text-2xl font-bold text-primary">INFLUX</span>
                <span className="text-xs font-medium text-foreground/60">connect</span>
              </div>
            </Link>

            <div className="flex items-center gap-2 sm:gap-3">
              <NotificationBell />

              <Button variant="ghost" size="sm" className="text-sm font-medium text-muted-foreground hover:bg-muted/50 hover:text-foreground" onClick={async () => { await fetch('/api/auth/logout', { method: 'POST' }); window.location.href = '/login'; }}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer for fixed header */}
      <div className="h-20"></div>

      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden lg:block w-64 border-r bg-muted/30 min-h-[calc(100vh-80px)] sticky top-20">
          <nav className="p-4 space-y-2">
            {/* Balance Card */}
            <div className="w-full p-4 rounded-xl bg-primary/10 border-2 border-primary/30 mb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Wallet className="h-4 w-4 text-primary" />
                  <span className="text-xs font-medium text-muted-foreground">Balance</span>
                </div>
              </div>
              <div className="text-2xl font-bold text-primary text-left mb-2">
                ${walletBalance !== null ? walletBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}
              </div>
              <div className="text-xs text-muted-foreground space-y-1">
                <div>Pending: ${walletPending !== null ? walletPending.toLocaleString() : '0'}</div>
                {pendingDeposits > 0 && (
                  <div className="text-amber-600">Pending deposit: ${pendingDeposits.toLocaleString()}</div>
                )}
                {pendingWithdrawals > 0 && (
                  <div className="text-amber-600">Pending withdrawal: ${pendingWithdrawals.toLocaleString()}</div>
                )}
              </div>
              <Button size="sm" className="w-full mt-3 h-8 text-xs" onClick={() => setShowWithdrawModal(true)}>
                Withdraw
              </Button>
            </div>

            {isFoundingMember && (
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 mb-2">
                <Crown className="h-4 w-4 text-amber-600 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-amber-600">Founding Creator</p>
                  <p className="text-[10px] text-muted-foreground">3% withdrawal rate locked</p>
                </div>
              </div>
            )}

            <button
              onClick={() => setActiveTab("discover")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === "discover"
                  ? "bg-primary/10 text-primary border-2 border-primary/30"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Search className="h-4 w-4" />
              Discover Campaigns
            </button>

            <button
              onClick={() => setActiveTab("my-campaigns")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === "my-campaigns"
                  ? "bg-primary/10 text-primary border-2 border-primary/30"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <BarChart3 className="h-4 w-4" />
              My Campaigns
            </button>

            <button
              onClick={() => setActiveTab("wallet")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === "wallet"
                  ? "bg-primary/10 text-primary border-2 border-primary/30"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Wallet className="h-4 w-4" />
              Wallet
            </button>

            <button
              onClick={() => setActiveTab("profile")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === "profile"
                  ? "bg-primary/10 text-primary border-2 border-primary/30"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <User className="h-4 w-4" />
              Profile
            </button>

            <button
              onClick={() => setActiveTab("settings")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === "settings"
                  ? "bg-primary/10 text-primary border-2 border-primary/30"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Settings className="h-4 w-4" />
              Settings
            </button>
          </nav>
        </aside>

        {/* Mobile Navigation */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-xl border-t z-40">
          <div className="flex items-center justify-around px-2 py-3">
            <button
              onClick={() => setActiveTab("discover")}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
                activeTab === "discover" ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <Search className="h-5 w-5" />
              <span className="text-xs font-medium">Discover</span>
            </button>
            <button
              onClick={() => setActiveTab("my-campaigns")}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
                activeTab === "my-campaigns" ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <BarChart3 className="h-5 w-5" />
              <span className="text-xs font-medium">Campaigns</span>
            </button>
            <button
              onClick={() => setActiveTab("wallet")}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
                activeTab === "wallet" ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <Wallet className="h-5 w-5" />
              <span className="text-xs font-medium">Wallet</span>
            </button>
            <button
              onClick={() => setActiveTab("profile")}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
                activeTab === "profile" ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <User className="h-5 w-5" />
              <span className="text-xs font-medium">Profile</span>
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
                activeTab === "settings" ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <Settings className="h-5 w-5" />
              <span className="text-xs font-medium">Settings</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8 overflow-auto">
          {/* Moderation Status Banner — only shown for non-approved statuses */}
          {influencerStatus === 'PENDING' && (
            <div className="mb-4 rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 flex items-start gap-3">
              <Clock className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-sm">Profile Under Review</h4>
                <p className="text-muted-foreground text-xs mt-1">Your profile is being reviewed by our team. Once approved, you&apos;ll appear in the marketplace and can start receiving campaign offers. This usually takes 24-48 hours.</p>
              </div>
            </div>
          )}
          {influencerStatus === 'REJECTED' && (
            <div className="mb-4 rounded-xl border border-destructive/30 bg-destructive/5 p-4 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-sm">Profile Not Approved</h4>
                <p className="text-muted-foreground text-xs mt-1">Your profile was not approved. Please update your profile information and contact support@aiinflux.io for more details.</p>
              </div>
            </div>
          )}
          <AnimatePresence mode="wait">
          {/* Discover Campaigns Tab */}
          {activeTab === "discover" && (
            <motion.div
              key="discover"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-6">
                <h1 className="text-xl sm:text-3xl font-bold mb-2">Discover Campaigns</h1>
                <p className="text-muted-foreground text-sm sm:text-base">
                  Find and apply to campaigns that match your audience
                </p>
              </div>

              {/* Search & Filters */}
              <div className="mb-6 space-y-4">
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search campaigns or brands..."
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
                    {(selectedCategory !== "all" || selectedPlatform !== "all" || selectedBudget !== "all") && (
                      <Badge className="ml-1 bg-primary text-primary-foreground px-1.5 py-0 text-xs">
                        {[selectedCategory !== "all", selectedPlatform !== "all", selectedBudget !== "all"].filter(Boolean).length}
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
                            {categories.map((cat) => (
                              <SelectItem key={cat} value={cat}>
                                {cat === "all" ? "All Categories" : cat}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-xs font-medium mb-2 block">Platform</Label>
                        <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                          <SelectTrigger className="h-10 hover:bg-primary/10 hover:text-primary hover:border-primary/30">
                            <SelectValue placeholder="Select platform" />
                          </SelectTrigger>
                          <SelectContent>
                            {platforms.map((platform) => (
                              <SelectItem key={platform} value={platform}>
                                {platform === "all" ? "All Platforms" : platform}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <Label className="text-xs font-medium">Budget (per influencer)</Label>
                          {(selectedCategory !== "all" || selectedPlatform !== "all" || selectedBudget !== "all") && (
                            <button
                              onClick={() => {
                                setSelectedCategory("all");
                                setSelectedPlatform("all");
                                setSelectedBudget("all");
                              }}
                              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                            >
                              Clear all
                            </button>
                          )}
                        </div>
                        <Select value={selectedBudget} onValueChange={setSelectedBudget}>
                          <SelectTrigger className="h-10 hover:bg-primary/10 hover:text-primary hover:border-primary/30">
                            <SelectValue placeholder="Select budget" />
                          </SelectTrigger>
                          <SelectContent>
                            {budgetRanges.map((range) => (
                              <SelectItem key={range.value} value={range.value}>
                                {range.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Campaigns List */}
              <div className="space-y-4">
                {filteredDiscoverCampaigns.map((campaign) => (
                  <motion.div
                    key={campaign.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="p-4 sm:p-6 hover:shadow-lg transition-shadow">
                      <div className="flex gap-3 sm:gap-4">
                        {/* Brand Avatar */}
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center text-xl sm:text-2xl overflow-hidden">
                            {campaign.brandAvatar.startsWith('data:') || campaign.brandAvatar.startsWith('http') ? (
                              <img src={campaign.brandAvatar} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <span>{campaign.brandAvatar}</span>
                            )}
                          </div>
                        </div>

                        {/* Campaign Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 sm:gap-4 mb-2">
                            <div className="flex-1 min-w-0">
                              <h3 className="text-base sm:text-xl font-bold mb-1 truncate">{campaign.title}</h3>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <span className="font-medium">{campaign.brand}</span>
                                <span>•</span>
                                <span>{campaign.category}</span>
                              </div>
                            </div>
                            <Badge className={`${getStatusColor(campaign.status)} shrink-0 px-3 py-1 border`}>
                              {getStatusLabel(campaign.status)}
                            </Badge>
                          </div>

                          <p className="text-xs sm:text-sm text-muted-foreground mb-3 line-clamp-2">{campaign.description}</p>

                          {/* Price, Pricing Basis, and Platforms */}
                          <div className="flex flex-wrap items-center gap-3 sm:gap-6 mb-3 text-xs sm:text-sm">
                            <div className="flex items-center gap-2">
                              <DollarSign className="h-4 w-4 text-primary" />
                              <span className="font-bold">
                                ${campaign.budgetMin.toLocaleString()} &ndash; ${campaign.budgetMax.toLocaleString()}
                              </span>
                              <span className="text-muted-foreground">/ creator</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              {campaign.pricingModels.length > 0 ? (
                                campaign.pricingModels.map((m) => (
                                  <Badge key={m} variant="outline" className={`text-[10px] px-2 py-0.5 ${getPricingBadgeStyle(m)}`}>
                                    {m.toUpperCase()}
                                  </Badge>
                                ))
                              ) : (
                                <Badge variant="outline" className={`text-[10px] px-2 py-0.5 ${getPricingBadgeStyle(campaign.pricingModel)}`}>
                                  {campaign.pricingModel}
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Calendar className="h-4 w-4" />
                              <span>Deadline: {new Date(campaign.deadline).toLocaleDateString()}</span>
                            </div>
                          </div>

                          {/* Platforms and Content Formats */}
                          <div className="flex flex-wrap items-center gap-3 mb-3">
                            {campaign.platforms.length > 0 && (
                              <div className="flex items-center gap-1.5">
                                {campaign.platforms.map((platform) => (
                                  <span key={platform} className="text-muted-foreground" title={platform}>
                                    {getPlatformIcon(platform)}
                                  </span>
                                ))}
                              </div>
                            )}
                            {campaign.contentFormats.length > 0 && (
                              <div className="flex flex-wrap gap-1.5">
                                {campaign.contentFormats.map((format) => (
                                  <span key={format} className="text-[10px] text-muted-foreground bg-muted/50 px-2 py-0.5 rounded">
                                    {format.replace(/-/g, ' ')}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Requirements */}
                          <div className="mb-3">
                            <div className="text-xs font-medium text-muted-foreground mb-2">Must mention:</div>
                            <div className="flex flex-wrap gap-2">
                              {campaign.requirements.map((req, idx) => (
                                <span key={idx} className="text-xs bg-muted/50 px-3 py-1.5 rounded-md">
                                  {req}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex gap-2">
                            {(() => {
                              const myCollab = myCampaigns.find(mc => mc.campaignId === String(campaign.id));
                              if (!myCollab) {
                                return (
                                  <Button
                                    size="default"
                                    className="bg-primary/10 text-primary hover:bg-primary/20 border border-primary/30"
                                    onClick={() => setApplyingCampaign(campaign)}
                                  >
                                    Apply Now
                                  </Button>
                                );
                              }
                              if (myCollab.status === 'applied') {
                                return (
                                  <Button size="default" className="bg-amber-500/15 text-amber-600 border border-amber-500/30 hover:bg-amber-500/25">
                                    <Clock className="h-4 w-4 mr-2" />
                                    Applied
                                  </Button>
                                );
                              }
                              if (myCollab.status === 'completed' || myCollab.status === 'resolved') {
                                return (
                                  <Button size="default" className="bg-success/15 text-success border border-success/30 hover:bg-success/25">
                                    <CheckCircle2 className="h-4 w-4 mr-2" />
                                    Completed
                                  </Button>
                                );
                              }
                              // Active collaboration — negotiating, in progress, etc.
                              return (
                                <Button
                                  size="default"
                                  className="bg-primary/15 text-primary border border-primary/30 hover:bg-primary/25"
                                  onClick={() => setActiveTab("my-campaigns")}
                                >
                                  View Campaign
                                </Button>
                              );
                            })()}
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}

                {filteredDiscoverCampaigns.length === 0 && (
                  <Card className="p-12 text-center">
                    <div className="text-muted-foreground">
                      <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium mb-2">No campaigns found</p>
                      <p className="text-sm">Try adjusting your search or filters</p>
                    </div>
                  </Card>
                )}
              </div>
            </motion.div>
          )}

          {/* My Campaigns Tab */}
          {activeTab === "my-campaigns" && (
            <motion.div
              key="my-campaigns"
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
                        }}
                      >
                        <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
                        Back to Campaigns
                      </Button>
                      <h1 className="text-2xl sm:text-3xl font-bold mb-2">{selectedCampaignDetails.title}</h1>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={selectedCampaignDetails.status === "active" ? "default" : "secondary"}
                          className={`${getStatusColor(selectedCampaignDetails.status)} border`}
                        >
                          <div
                            className={`w-1.5 h-1.5 rounded-full mr-1.5 ${getStatusDotColor(selectedCampaignDetails.status)}`}
                          />
                          {getStatusLabel(selectedCampaignDetails.status)}
                        </Badge>
                        <Badge variant="outline" className="bg-muted text-foreground border-border">
                          ${selectedCampaignDetails.budget.toLocaleString()} ({selectedCampaignDetails.pricingModel})
                        </Badge>
                        {selectedCampaignDetails.collaborationMessage?.includes('invited') && (
                          <Badge variant="outline" className="bg-purple-500/10 text-purple-600 border-purple-500/20">
                            <Mail className="h-3 w-3 mr-1" />
                            Invited
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Brief Info Card */}
                  <Card className="p-6 mb-6">
                    <div className="space-y-4">
                      {/* Brief Info */}
                      <div className="grid grid-cols-4 gap-4">
                        <div>
                          <Label className="text-xs text-muted-foreground mb-1 block">Start Date</Label>
                          <div className="text-sm font-medium">
                            {selectedCampaignDetails.startDate
                              ? new Date(selectedCampaignDetails.startDate).toLocaleDateString()
                              : "Not set"}
                          </div>
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground mb-1 block">End Date</Label>
                          <div className="text-sm font-medium">
                            {selectedCampaignDetails.endDate
                              ? new Date(selectedCampaignDetails.endDate).toLocaleDateString()
                              : "Not set"}
                          </div>
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground mb-1 block">Brand</Label>
                          <div className="text-sm font-medium">{selectedCampaignDetails.brand}</div>
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground mb-1 block">Goal</Label>
                          <div className="text-sm font-medium capitalize">
                            {selectedCampaignDetails.goal?.replace("-", " ") || "Not set"}
                          </div>
                        </div>
                      </div>

                      {/* Target Metrics */}
                      {(selectedCampaignDetails.targetViews ||
                        selectedCampaignDetails.targetClicks ||
                        selectedCampaignDetails.targetEngagements) && (
                        <div className="border-t pt-4">
                          <Label className="text-xs text-muted-foreground mb-3 block uppercase tracking-wide">
                            Target Metrics
                          </Label>
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
                        <ChevronDown
                          className={`ml-2 h-4 w-4 transition-transform ${
                            isCampaignDetailsExpanded ? "rotate-180" : ""
                          }`}
                        />
                      </Button>

                      {/* Expanded Details */}
                      {isCampaignDetailsExpanded && (
                        <div className="space-y-4 border-t pt-4">
                          <div>
                            <Label className="text-sm font-semibold mb-2 block">Description</Label>
                            <p className="text-sm text-muted-foreground">
                              {selectedCampaignDetails.description || "Not set"}
                            </p>
                          </div>

                          <div>
                            <Label className="text-sm font-semibold mb-2 block">Budget</Label>
                            <p className="text-sm text-muted-foreground">
                              ${selectedCampaignDetails.budget.toLocaleString()} ({selectedCampaignDetails.pricingModel})
                            </p>
                          </div>

                          <div>
                            <Label className="text-sm font-semibold mb-2 block">Platforms</Label>
                            {selectedCampaignDetails.platforms && selectedCampaignDetails.platforms.length > 0 ? (
                              <div className="flex gap-2">
                                {selectedCampaignDetails.platforms.map((platform) => (
                                  <Badge key={platform} variant="outline" className="capitalize">
                                    {platform === "Instagram" && <Instagram className="h-3 w-3 mr-1" />}
                                    {platform === "TikTok" && <svg className="h-3 w-3 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" /></svg>}
                                    {platform === "YouTube" && <Youtube className="h-3 w-3 mr-1" />}
                                    {platform === "Twitter" && <XIcon className="h-3 w-3 mr-1" />}
                                    {platform}
                                  </Badge>
                                ))}
                              </div>
                            ) : (
                              <p className="text-sm text-muted-foreground">Not set</p>
                            )}
                          </div>

                          {/* Product Details */}
                          {(selectedCampaignDetails.productName || selectedCampaignDetails.productLink) && (
                            <div className="border-t pt-4">
                              <Label className="text-sm font-semibold mb-3 block">Product Details</Label>
                              <div className="space-y-3">
                                {selectedCampaignDetails.productName && (
                                  <div>
                                    <Label className="text-xs text-muted-foreground mb-1 block">Product Name</Label>
                                    <p className="text-sm">{selectedCampaignDetails.productName}</p>
                                  </div>
                                )}
                                {selectedCampaignDetails.productPrice && (
                                  <div>
                                    <Label className="text-xs text-muted-foreground mb-1 block">Product Price</Label>
                                    <p className="text-sm font-medium">${selectedCampaignDetails.productPrice}</p>
                                  </div>
                                )}
                                {selectedCampaignDetails.productLink && (
                                  <div>
                                    <Label className="text-xs text-muted-foreground mb-1 block">Product Link</Label>
                                    <a
                                      href={selectedCampaignDetails.productLink}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-sm text-primary hover:underline break-all"
                                    >
                                      {selectedCampaignDetails.productLink}
                                    </a>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Instructions */}
                          {(selectedCampaignDetails.brandTag ||
                            selectedCampaignDetails.hashtags ||
                            selectedCampaignDetails.detailedRequirements) && (
                            <div className="border-t pt-4">
                              <Label className="text-sm font-semibold mb-3 block">Brand Instructions</Label>
                              <div className="space-y-3">
                                {selectedCampaignDetails.brandTag && (
                                  <div>
                                    <Label className="text-xs text-muted-foreground mb-1 block">Brand Tag</Label>
                                    <p className="text-sm">{selectedCampaignDetails.brandTag}</p>
                                  </div>
                                )}
                                {selectedCampaignDetails.hashtags && (
                                  <div>
                                    <Label className="text-xs text-muted-foreground mb-1 block">Hashtags</Label>
                                    <p className="text-sm">{selectedCampaignDetails.hashtags}</p>
                                  </div>
                                )}
                                {selectedCampaignDetails.detailedRequirements && (
                                  <div>
                                    <Label className="text-xs text-muted-foreground mb-1 block">
                                      Detailed Requirements
                                    </Label>
                                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                      {selectedCampaignDetails.detailedRequirements}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </Card>

                  {/* Pipeline */}
                  <Card className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-bold">Campaign Progress</h2>
                    </div>

                    {/* Download Agreement — available after negotiation is complete */}
                    {["active", "content_review", "revision", "publishing", "delivered", "completed", "disputed", "resolved"].includes(selectedCampaignDetails?.status || "") && selectedCampaignDetails?.collaborationId && (
                      <a
                        href={`/api/collaborations/${selectedCampaignDetails.collaborationId}/agreement`}
                        download
                        className="inline-flex items-center gap-2 text-sm text-primary hover:underline mb-4"
                      >
                        <FileText className="h-4 w-4" />
                        Download Agreement
                      </a>
                    )}

                    <div className="space-y-6">
                      {/* Stage 1: Negotiation */}
                      <div className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                              selectedCampaignDetails.status !== "applied"
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            1
                          </div>
                          <div className="w-0.5 h-full bg-border mt-2" />
                        </div>
                        <div className="flex-1 pb-6">
                          <h3 className="font-semibold mb-2">Negotiation & Terms</h3>
                          <p className="text-sm text-muted-foreground mb-3">
                            Review campaign details and approve collaboration terms
                          </p>

                          {(selectedCampaignDetails.status === "applied" || selectedCampaignDetails.status === "approved") ? (
                            <div className="space-y-4">
                              {/* Creator Terms Input */}
                              <div className="space-y-2">
                                <Label className="text-sm font-medium">Creator Terms (Optional)</Label>
                                <Textarea
                                  className="resize-none"
                                  placeholder="Add any specific terms or requirements for this collaboration..."
                                  value={selectedCampaignDetails.influencerTerms || ""}
                                  onChange={(e) => setSelectedCampaignDetails({
                                    ...selectedCampaignDetails,
                                    influencerTerms: e.target.value
                                  })}
                                  onBlur={() => {
                                    if (selectedCampaignDetails.collaborationId) {
                                      fetch(`/api/collaborations/${selectedCampaignDetails.collaborationId}`, {
                                        method: 'PATCH',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ influencerTerms: selectedCampaignDetails.influencerTerms || '' }),
                                      });
                                    }
                                  }}
                                  rows={3}
                                />
                              </div>

                              {/* Project Terms (Read-only) */}
                              <div className="space-y-2">
                                <Label className="text-sm font-medium">Project Terms</Label>
                                <div className="px-3 py-2 rounded-lg border border-border bg-muted/50 text-sm min-h-[60px]">
                                  {selectedCampaignDetails.brandTerms || <span className="text-muted-foreground italic">No additional terms from project</span>}
                                </div>
                              </div>

                              {/* Approval Status */}
                              {selectedCampaignDetails.status === "applied" && (
                                <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                                  <Clock className="h-5 w-5 text-yellow-600" />
                                  <div>
                                    <p className="text-sm font-medium text-yellow-600">Waiting for Project Approval</p>
                                    <p className="text-xs text-muted-foreground">Your application is under review</p>
                                  </div>
                                </div>
                              )}

                              {selectedCampaignDetails.status === "approved" && selectedCampaignDetails.influencerAgreed === false && (
                                <div className="px-4 py-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                                  <Clock className="h-5 w-5 text-amber-500 inline mr-2" />
                                  <p className="text-sm font-medium text-amber-600 inline">Price declined — waiting for new offer</p>
                                  <p className="text-xs text-muted-foreground mt-1">You declined the offer of ${selectedCampaignDetails.budget}. The project can propose a new price.</p>
                                </div>
                              )}

                              {selectedCampaignDetails.status === "approved" && selectedCampaignDetails.influencerAgreed === true && (
                                <div className="px-4 py-3 rounded-lg bg-success/10 border border-success/20">
                                  <CheckCircle2 className="h-5 w-5 text-success inline mr-2" />
                                  <p className="text-sm font-medium text-success inline">Price accepted — ${selectedCampaignDetails.budget}</p>
                                  <p className="text-xs text-muted-foreground mt-1">Waiting for the project to start the campaign and freeze funds.</p>
                                </div>
                              )}

                              {selectedCampaignDetails.status === "approved" && selectedCampaignDetails.influencerAgreed == null && (
                                <div className="space-y-3">
                                  <div className="px-4 py-3 rounded-lg bg-primary/10 border border-primary/20">
                                    <p className="text-sm font-medium text-primary mb-1">Project has approved your application!</p>
                                    <p className="text-sm">
                                      Offered price: <span className="font-bold text-lg">${selectedCampaignDetails.budget}</span>
                                    </p>
                                  </div>
                                  {/* Terms agreement checkbox */}
                                  <label className={`flex items-start gap-2 cursor-pointer p-3 rounded-lg border transition-all ${termsHighlight ? 'border-destructive bg-destructive/5 animate-pulse' : 'border-border'}`}>
                                    <input
                                      type="checkbox"
                                      checked={termsAccepted}
                                      onChange={(e) => { setTermsAccepted(e.target.checked); setTermsHighlight(false); }}
                                      className="mt-0.5 rounded"
                                    />
                                    <span className="text-xs text-muted-foreground">
                                      I agree to the campaign terms, offered price, and any additional terms from the project
                                    </span>
                                  </label>

                                  <div className="flex gap-2">
                                    <Button
                                      size="sm"
                                      className="flex-1 bg-gradient-to-r from-primary to-secondary"
                                      disabled={actionLoading}
                                      onClick={async () => {
                                        if (!termsAccepted) {
                                          setTermsHighlight(true);
                                          setTimeout(() => setTermsHighlight(false), 2000);
                                          showToast('Please accept the terms first', 'error');
                                          return;
                                        }
                                        setActionLoading(true);
                                        try {
                                          const res = await fetch(`/api/collaborations/${selectedCampaignDetails.collaborationId}`, {
                                            method: 'PATCH',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({ influencerAgreed: true, ...(selectedCampaignDetails.influencerTerms ? { influencerTerms: selectedCampaignDetails.influencerTerms } : {}) }),
                                          });
                                          if (res.ok) {
                                            showToast('Price accepted! Waiting for project to start the campaign.', 'success');
                                            setTermsAccepted(false);
                                            setSelectedCampaignDetails({ ...selectedCampaignDetails, influencerAgreed: true });
                                            await refreshCollaborations();
                                          } else {
                                            const data = await res.json();
                                            showToast(data.error || 'Failed to accept', 'error');
                                          }
                                        } catch { showToast('Failed to accept', 'error'); }
                                        finally { setActionLoading(false); }
                                      }}
                                    >
                                      Accept Price
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="flex-1 text-amber-600 border-amber-500/30 hover:bg-amber-500/10"
                                      disabled={actionLoading}
                                      onClick={async () => {
                                        setActionLoading(true);
                                        try {
                                          const res = await fetch(`/api/collaborations/${selectedCampaignDetails.collaborationId}`, {
                                            method: 'PATCH',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({ influencerAgreed: false }),
                                          });
                                          if (res.ok) {
                                            showToast('Price declined. Project can propose a new price.', 'success');
                                            setSelectedCampaignDetails({ ...selectedCampaignDetails, influencerAgreed: false });
                                            await refreshCollaborations();
                                          } else {
                                            const data = await res.json();
                                            showToast(data.error || 'Failed to decline', 'error');
                                          }
                                        } catch { showToast('Failed to decline', 'error'); }
                                        finally { setActionLoading(false); }
                                      }}
                                    >
                                      Decline Price
                                    </Button>
                                  </div>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="w-full mt-2 text-destructive border-destructive/30 hover:bg-destructive/10"
                                    disabled={actionLoading}
                                    onClick={async () => {
                                      setActionLoading(true);
                                      try {
                                        const res = await fetch(`/api/collaborations/${selectedCampaignDetails.collaborationId}`, {
                                          method: 'PATCH',
                                          headers: { 'Content-Type': 'application/json' },
                                          body: JSON.stringify({ status: 'CANCELLED' }),
                                        });
                                        if (res.ok) {
                                          showToast('Collaboration cancelled.', 'success');
                                          await refreshCollaborations();
                                          setSelectedCampaignDetails(null);
                                        } else {
                                          const data = await res.json();
                                          showToast(data.error || 'Failed to cancel', 'error');
                                        }
                                      } catch { showToast('Failed to cancel collaboration', 'error'); }
                                      finally { setActionLoading(false); }
                                    }}
                                  >
                                    <XCircle className="h-4 w-4 mr-1" />
                                    Cancel Collaboration
                                  </Button>
                                </div>
                              )}
                            </div>
                          ) : selectedCampaignDetails.status === "cancelled" ? (
                            <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-destructive/10 border border-destructive/20">
                              <AlertCircle className="h-5 w-5 text-destructive" />
                              <div>
                                <p className="text-sm font-medium text-destructive">Collaboration Cancelled</p>
                                <p className="text-xs text-muted-foreground">This collaboration has been cancelled</p>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-success/10 border border-success/20">
                                <CheckCircle2 className="h-5 w-5 text-success" />
                                <div>
                                  <p className="text-sm font-medium text-success">Terms Approved</p>
                                  <p className="text-xs text-muted-foreground">
                                    Both parties have approved the collaboration terms
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-primary/10 border border-primary/20">
                                <Wallet className="h-5 w-5 text-primary" />
                                <div>
                                  <p className="text-sm font-medium text-primary">
                                    Advance Payment Secured (50%)
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    ${(selectedCampaignDetails.budget * 0.5).toLocaleString()} held in escrow
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Stage 2: Content Creation & Approval */}
                      <div className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                              ["active", "content_review", "revision", "publishing", "delivered", "completed", "resolved"].includes(selectedCampaignDetails.status)
                                ? "bg-secondary text-secondary-foreground"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            2
                          </div>
                          <div className="w-0.5 h-full bg-border mt-2" />
                        </div>
                        <div className="flex-1 pb-6">
                          <h3 className="font-semibold mb-2">Content Creation & Approval</h3>
                          <p className="text-sm text-muted-foreground mb-3">
                            Create content and submit links for brand review
                          </p>

                          {selectedCampaignDetails.status === "applied" || selectedCampaignDetails.status === "approved" ? (
                            <div className="text-center py-8 bg-muted/30 rounded-lg border border-dashed border-border">
                              <Clock className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                              <p className="text-sm text-muted-foreground">
                                Complete negotiation stage first
                              </p>
                            </div>
                          ) : selectedCampaignDetails.status === "active" ? (
                            <div className="space-y-4">
                              <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-primary/10 border border-primary/20">
                                <Wallet className="h-5 w-5 text-primary" />
                                <div>
                                  <p className="text-sm font-medium text-primary">50% advance received</p>
                                  <p className="text-xs text-muted-foreground">
                                    Submit your content draft for review.
                                  </p>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <Label className="text-sm font-medium">Submit Content</Label>
                                <p className="text-xs text-muted-foreground mb-2">
                                  Share a link to your content draft (Google Drive, Dropbox, etc.)
                                </p>
                                <div className="flex gap-2">
                                  <div className="relative flex-1">
                                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                      placeholder="https://drive.google.com/..."
                                      value={contentLinkInput}
                                      onChange={(e) => setContentLinkInput(e.target.value)}
                                      className="pl-10 h-11"
                                    />
                                  </div>
                                  <Button
                                    className="bg-gradient-to-r from-primary to-secondary"
                                    disabled={submitLoading || !contentLinkInput.trim()}
                                    onClick={() => handleSubmitContent(selectedCampaignDetails.id, { contentUrl: contentLinkInput.trim() })}
                                  >
                                    <Upload className="h-4 w-4 mr-2" />
                                    {submitLoading ? "Submitting..." : "Submit Content"}
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ) : selectedCampaignDetails.status === "content_review" ? (
                            <div className="space-y-3">
                              <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                                <Clock className="h-5 w-5 text-blue-600" />
                                <div>
                                  <p className="text-sm font-medium text-blue-600">Content submitted. Waiting for brand review.</p>
                                </div>
                              </div>
                              {selectedCampaignDetails.contentUrl && (
                                <div className="bg-background rounded-lg p-4 border border-border">
                                  <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                      <LinkIcon className="h-4 w-4 text-primary" />
                                      <span className="text-sm font-medium">Submitted Content</span>
                                    </div>
                                  </div>
                                  <a
                                    href={selectedCampaignDetails.contentUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-primary hover:underline break-all flex items-center gap-1 mb-3"
                                  >
                                    {selectedCampaignDetails.contentUrl}
                                    <ExternalLink className="h-3 w-3" />
                                  </a>
                                  <div className="flex gap-2">
                                    <input
                                      type="text"
                                      value={contentLinkInput}
                                      onChange={(e) => setContentLinkInput(e.target.value)}
                                      placeholder="Update content link..."
                                      className="flex-1 px-3 py-1.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                    <Button
                                      size="sm"
                                      disabled={submitLoading || !contentLinkInput.trim()}
                                      onClick={() => handleSubmitContent(selectedCampaignDetails.collaborationId || selectedCampaignDetails.id, { contentUrl: contentLinkInput.trim() })}
                                    >
                                      {submitLoading ? "..." : "Update"}
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </div>
                          ) : selectedCampaignDetails.status === "revision" ? (
                            <div className="space-y-4">
                              {selectedCampaignDetails.revisionNote && (
                                <div className="rounded-lg p-4 border border-orange-500/20 bg-orange-500/5">
                                  <p className="text-xs font-semibold text-orange-700 uppercase tracking-wide mb-1">Brand&apos;s feedback:</p>
                                  <p className="text-sm text-foreground whitespace-pre-wrap">{selectedCampaignDetails.revisionNote}</p>
                                </div>
                              )}
                              <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
                                <AlertCircle className="h-5 w-5 text-orange-600" />
                                <p className="text-sm font-medium text-orange-600">
                                  Revision {selectedCampaignDetails.revisionCount ?? 0}/3
                                </p>
                              </div>
                              <div className="space-y-2">
                                <Label className="text-sm font-medium">Submit Revised Content</Label>
                                <div className="flex gap-2">
                                  <div className="relative flex-1">
                                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                      placeholder="https://drive.google.com/..."
                                      value={contentLinkInput}
                                      onChange={(e) => setContentLinkInput(e.target.value)}
                                      className="pl-10 h-11"
                                    />
                                  </div>
                                  <Button
                                    className="bg-gradient-to-r from-primary to-secondary"
                                    disabled={submitLoading || !contentLinkInput.trim()}
                                    onClick={() => handleSubmitContent(selectedCampaignDetails.id, { contentUrl: contentLinkInput.trim() })}
                                  >
                                    <Upload className="h-4 w-4 mr-2" />
                                    {submitLoading ? "Submitting..." : "Submit Revised Content"}
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ) : selectedCampaignDetails.status === "disputed" ? (
                            <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20">
                              <AlertCircle className="h-5 w-5 text-red-600" />
                              <div>
                                <p className="text-sm font-medium text-red-600">Under review by platform team. Remaining payment is held.</p>
                              </div>
                            </div>
                          ) : selectedCampaignDetails.status === "cancelled" ? (
                            <div className="text-center py-8 bg-muted/30 rounded-lg border border-dashed border-border">
                              <Clock className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                              <p className="text-sm text-muted-foreground">
                                Collaboration was cancelled
                              </p>
                            </div>
                          ) : ["publishing", "delivered", "completed", "resolved"].includes(selectedCampaignDetails.status) ? (
                            <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-success/10 border border-success/20">
                              <CheckCircle2 className="h-5 w-5 text-success" />
                              <div className="flex-1">
                                <p className="text-sm font-medium text-success">Content Approved</p>
                                <p className="text-xs text-muted-foreground">
                                  Brand has approved your content
                                </p>
                              </div>
                            </div>
                          ) : null}
                        </div>
                      </div>

                      {/* Stage 3: Publication & Completion */}
                      <div className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                              ["publishing", "delivered", "completed", "resolved"].includes(selectedCampaignDetails.status)
                                ? "bg-success text-success-foreground"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            3
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold mb-2">Publication & Completion</h3>
                          <p className="text-sm text-muted-foreground mb-3">
                            Publish content and receive final payment
                          </p>

                          {["applied", "approved", "active", "content_review", "revision"].includes(selectedCampaignDetails.status) ? (
                            <div className="text-center py-8 bg-muted/30 rounded-lg border border-dashed border-border">
                              <Clock className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                              <p className="text-sm text-muted-foreground mb-1">
                                Waiting for content approval
                              </p>
                              <p className="text-xs text-muted-foreground">
                                You can publish after brand approves your content
                              </p>
                            </div>
                          ) : selectedCampaignDetails.status === "publishing" ? (
                            <div className="space-y-4">
                              <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
                                <CheckCircle2 className="h-5 w-5 text-purple-600" />
                                <div>
                                  <p className="text-sm font-medium text-purple-600">Content approved! Publish it and share the links.</p>
                                </div>
                              </div>
                              <div className="space-y-3">
                                <Label className="text-sm font-medium">Published Links</Label>
                                <p className="text-xs text-muted-foreground">
                                  Submit a link for each content format
                                </p>
                                {(selectedCampaignDetails.contentFormats.length > 0
                                  ? selectedCampaignDetails.contentFormats
                                  : ["post"]
                                ).map((format) => (
                                  <div key={format} className="space-y-1">
                                    <Label className="text-xs text-muted-foreground">
                                      {FORMAT_LABELS[format] || format.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase())}
                                    </Label>
                                    <div className="relative">
                                      <ExternalLink className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                      <Input
                                        placeholder={`https://...`}
                                        value={publishedLinks[format] || ""}
                                        onChange={(e) => setPublishedLinks(prev => ({ ...prev, [format]: e.target.value }))}
                                        className="pl-10 h-11"
                                      />
                                    </div>
                                  </div>
                                ))}
                                <Button
                                  className="w-full bg-gradient-to-r from-secondary to-primary"
                                  disabled={
                                    submitLoading ||
                                    (selectedCampaignDetails.contentFormats.length > 0
                                      ? selectedCampaignDetails.contentFormats.some(f => !publishedLinks[f]?.trim())
                                      : !publishedLinks["post"]?.trim())
                                  }
                                  onClick={() => {
                                    const urls = Object.values(publishedLinks).map(u => u.trim()).filter(u => u.length > 0);
                                    handleSubmitContent(selectedCampaignDetails.id, { publishedUrls: urls });
                                  }}
                                >
                                  <Rocket className="h-4 w-4 mr-2" />
                                  {submitLoading ? "Submitting..." : "Submit All Links"}
                                </Button>
                              </div>
                              <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-primary/10 border border-primary/20">
                                <Wallet className="h-5 w-5 text-primary" />
                                <div>
                                  <p className="text-sm font-medium text-primary">
                                    Final Payment (50%)
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    ${(selectedCampaignDetails.budget * 0.5).toLocaleString()} will be released
                                    upon completion
                                  </p>
                                </div>
                              </div>
                            </div>
                          ) : selectedCampaignDetails.status === "delivered" ? (
                            <div className="space-y-3">
                              <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-green-500/10 border border-green-500/20">
                                <Clock className="h-5 w-5 text-green-600" />
                                <div>
                                  <p className="text-sm font-medium text-green-600">Waiting for brand approval. Auto-release in 7 days.</p>
                                </div>
                              </div>
                              {(selectedCampaignDetails.publishedUrls && selectedCampaignDetails.publishedUrls.length > 0) ? (
                                <div className="bg-background rounded-lg p-4 border border-border">
                                  <div className="flex items-center gap-2 mb-2">
                                    <Rocket className="h-4 w-4 text-success" />
                                    <span className="text-sm font-medium">Published Content</span>
                                  </div>
                                  <div className="space-y-2">
                                    {selectedCampaignDetails.publishedUrls.map((url, idx) => {
                                      const format = selectedCampaignDetails.contentFormats[idx];
                                      const label = format ? (FORMAT_LABELS[format] || format.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase())) : `Link ${idx + 1}`;
                                      return (
                                        <div key={idx}>
                                          <span className="text-xs text-muted-foreground">{label}</span>
                                          <a
                                            href={url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm text-primary hover:underline break-all flex items-center gap-1"
                                          >
                                            {url}
                                            <ExternalLink className="h-3 w-3" />
                                          </a>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              ) : selectedCampaignDetails.publishedUrl ? (
                                <div className="bg-background rounded-lg p-4 border border-border">
                                  <div className="flex items-center gap-2 mb-2">
                                    <Rocket className="h-4 w-4 text-success" />
                                    <span className="text-sm font-medium">Published Content</span>
                                  </div>
                                  <a
                                    href={selectedCampaignDetails.publishedUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-primary hover:underline break-all flex items-center gap-1"
                                  >
                                    {selectedCampaignDetails.publishedUrl}
                                    <ExternalLink className="h-3 w-3" />
                                  </a>
                                </div>
                              ) : null}
                            </div>
                          ) : selectedCampaignDetails.status === "disputed" ? (
                            <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20">
                              <AlertCircle className="h-5 w-5 text-red-600" />
                              <div>
                                <p className="text-sm font-medium text-red-600">Under review by platform team. Remaining payment is held.</p>
                              </div>
                            </div>
                          ) : (selectedCampaignDetails.status === "completed" || selectedCampaignDetails.status === "resolved") ? (
                            <div className="space-y-3">
                              {(selectedCampaignDetails.publishedUrls && selectedCampaignDetails.publishedUrls.length > 0) ? (
                                <div className="bg-background rounded-lg p-4 border border-border">
                                  <div className="flex items-center gap-2 mb-2">
                                    <Rocket className="h-4 w-4 text-success" />
                                    <span className="text-sm font-medium">Published Content</span>
                                  </div>
                                  <div className="space-y-2">
                                    {selectedCampaignDetails.publishedUrls.map((url, idx) => {
                                      const format = selectedCampaignDetails.contentFormats[idx];
                                      const label = format ? (FORMAT_LABELS[format] || format.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase())) : `Link ${idx + 1}`;
                                      return (
                                        <div key={idx}>
                                          <span className="text-xs text-muted-foreground">{label}</span>
                                          <a
                                            href={url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm text-primary hover:underline break-all flex items-center gap-1"
                                          >
                                            {url}
                                            <ExternalLink className="h-3 w-3" />
                                          </a>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              ) : selectedCampaignDetails.publishedUrl ? (
                                <div className="bg-background rounded-lg p-4 border border-border">
                                  <div className="flex items-center gap-2 mb-2">
                                    <Rocket className="h-4 w-4 text-success" />
                                    <span className="text-sm font-medium">Published Content</span>
                                  </div>
                                  <a
                                    href={selectedCampaignDetails.publishedUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-primary hover:underline break-all flex items-center gap-1"
                                  >
                                    {selectedCampaignDetails.publishedUrl}
                                    <ExternalLink className="h-3 w-3" />
                                  </a>
                                </div>
                              ) : null}

                              {/* Public Metrics */}
                              {selectedCampaignDetails.publicMetrics && (
                                <div className="bg-background rounded-lg p-4 border border-border">
                                  <div className="flex items-center justify-between mb-3">
                                    <h4 className="text-sm font-semibold">Performance Metrics</h4>
                                    <Badge variant="outline" className="text-xs">
                                      Final
                                    </Badge>
                                  </div>
                                  <div className="grid grid-cols-2 gap-3">
                                    {selectedCampaignDetails.publicMetrics.views !== undefined && (
                                      <div className="flex items-center gap-2 p-2 rounded-md bg-muted/50">
                                        <Eye className="h-4 w-4 text-muted-foreground" />
                                        <div>
                                          <p className="text-xs text-muted-foreground">Views</p>
                                          <p className="text-sm font-semibold">
                                            {selectedCampaignDetails.publicMetrics.views.toLocaleString()}
                                          </p>
                                        </div>
                                      </div>
                                    )}
                                    {selectedCampaignDetails.publicMetrics.likes !== undefined && (
                                      <div className="flex items-center gap-2 p-2 rounded-md bg-muted/50">
                                        <Heart className="h-4 w-4 text-muted-foreground" />
                                        <div>
                                          <p className="text-xs text-muted-foreground">Likes</p>
                                          <p className="text-sm font-semibold">
                                            {selectedCampaignDetails.publicMetrics.likes.toLocaleString()}
                                          </p>
                                        </div>
                                      </div>
                                    )}
                                    {selectedCampaignDetails.publicMetrics.comments !== undefined && (
                                      <div className="flex items-center gap-2 p-2 rounded-md bg-muted/50">
                                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                                        <div>
                                          <p className="text-xs text-muted-foreground">Comments</p>
                                          <p className="text-sm font-semibold">
                                            {selectedCampaignDetails.publicMetrics.comments.toLocaleString()}
                                          </p>
                                        </div>
                                      </div>
                                    )}
                                    {selectedCampaignDetails.publicMetrics.shares !== undefined && (
                                      <div className="flex items-center gap-2 p-2 rounded-md bg-muted/50">
                                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                                        <div>
                                          <p className="text-xs text-muted-foreground">Shares</p>
                                          <p className="text-sm font-semibold">
                                            {selectedCampaignDetails.publicMetrics.shares.toLocaleString()}
                                          </p>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}

                              <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-success/10 border border-success/20">
                                <CheckCircle2 className="h-5 w-5 text-success" />
                                <div>
                                  <p className="text-sm font-medium text-success">
                                    {selectedCampaignDetails.status === "completed" ? "Completed" : "Resolved"}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    Total earned: ${selectedCampaignDetails.budget.toLocaleString()}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="text-center py-8 bg-muted/30 rounded-lg border border-dashed border-border">
                              <Clock className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                              <p className="text-sm text-muted-foreground">
                                This stage is not yet available
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                </>
              ) : (
                <>
                  <div className="mb-6">
                    <h1 className="text-xl sm:text-3xl font-bold mb-2">My Campaigns</h1>
                    <p className="text-muted-foreground text-sm sm:text-base">
                      Track and manage your active collaborations
                    </p>
                  </div>

                  {myCampaigns.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <Briefcase className="h-16 w-16 text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground text-lg font-medium mb-2">No campaigns yet</p>
                  <p className="text-muted-foreground text-sm mb-6">Start applying to campaigns to get started</p>
                  <Button onClick={() => setActiveTab("discover")} className="bg-gradient-to-r from-primary to-secondary">
                    <Search className="h-4 w-4 mr-2" />
                    Discover Campaigns
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
                        className="pl-9 h-11 bg-card"
                      />
                    </div>
                    <Select defaultValue="all">
                      <SelectTrigger className="w-[180px] h-11 bg-card">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="applied">Pending</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="active">In Progress</SelectItem>
                        <SelectItem value="content_review">Under Review</SelectItem>
                        <SelectItem value="revision">Revision</SelectItem>
                        <SelectItem value="publishing">Ready to Publish</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="disputed">Disputed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Desktop Table View */}
                  <div className="hidden lg:block border rounded-lg overflow-hidden">
                    {/* Table Header */}
                    <div className="flex items-center px-6 py-4 bg-muted/30 border-b">
                      <div className="w-[320px] text-xs font-semibold text-muted-foreground uppercase tracking-wide">Name</div>
                      <div className="w-[100px] text-xs font-semibold text-muted-foreground uppercase tracking-wide">Pricing</div>
                      <div className="w-[100px] text-xs font-semibold text-muted-foreground uppercase tracking-wide">My Price</div>
                      <div className="w-[120px] text-xs font-semibold text-muted-foreground uppercase tracking-wide">Earned</div>
                      <div className="flex-1 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Status</div>
                      <div className="w-[140px] text-xs font-semibold text-muted-foreground uppercase tracking-wide text-right">Actions</div>
                    </div>

                    {/* Table Rows */}
                    {myCampaigns.map((campaign, index) => (
                      <div
                        key={campaign.id}
                        onClick={() => setSelectedCampaignDetails(campaign)}
                        className={`flex items-center px-6 py-5 hover:bg-muted/20 transition-colors cursor-pointer ${
                          index !== myCampaigns.length - 1 ? "border-b" : ""
                        }`}
                      >
                        {/* Name Column */}
                        <div className="w-[320px] flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center shrink-0 text-2xl overflow-hidden">
                            {campaign.brandAvatar.startsWith('data:') || campaign.brandAvatar.startsWith('http') ? (
                              <img src={campaign.brandAvatar} alt="" className="w-full h-full object-cover" />
                            ) : campaign.brandAvatar}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5 mb-1.5">
                              <h3 className="text-sm font-semibold truncate">{campaign.title}</h3>
                              {["approved", "active", "revision", "publishing"].includes(campaign.status) && (
                                <span className="inline-flex w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge
                                variant={campaign.status === "active" ? "default" : "secondary"}
                                className={`min-w-[80px] justify-center ${getStatusColor(campaign.status)} border`}
                              >
                                <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${getStatusDotColor(campaign.status)}`} />
                                {getStatusLabel(campaign.status)}
                              </Badge>
                              <span className="text-xs text-muted-foreground">{campaign.brand}</span>
                            </div>
                          </div>
                        </div>

                        {/* Pricing Column */}
                        <div className="w-[100px] flex items-center">
                          <div className="flex flex-wrap gap-1">
                            {campaign.pricingModels.length > 0 ? (
                              campaign.pricingModels.map((m) => (
                                <div key={m} className={`text-xs px-2 py-0.5 rounded-md font-medium ${getPricingBadgeStyle(m)}`}>
                                  {m.toUpperCase()}
                                </div>
                              ))
                            ) : (
                              <div className={`text-xs px-2 py-0.5 rounded-md font-medium ${getPricingBadgeStyle(campaign.pricingModel)}`}>
                                {campaign.pricingModel}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Budget Column */}
                        <div className="w-[100px] flex items-center">
                          <div className="text-base font-semibold">
                            ${campaign.budget.toLocaleString()}
                          </div>
                        </div>

                        {/* Received Column */}
                        <div className="w-[120px] flex items-center">
                          <div className="text-sm font-medium text-success">
                            ${(() => {
                              if (campaign.status === "applied" || campaign.status === "approved") return "0";
                              // 50% advance paid at IN_PROGRESS
                              if (["active", "content_review", "revision", "publishing", "delivered", "disputed"].includes(campaign.status)) return (campaign.budget * 0.5).toLocaleString();
                              // 100% at completed/resolved
                              if (campaign.status === "completed" || campaign.status === "resolved") return campaign.budget.toLocaleString();
                              return "0";
                            })()}
                          </div>
                        </div>

                        {/* Status Column */}
                        <div className="flex-1">
                          <div className="text-sm text-muted-foreground">
                            {campaign.status === "completed" || campaign.status === "resolved"
                              ? "Completed"
                              : campaign.status === "applied"
                              ? "Awaiting review"
                              : campaign.deadline
                              ? `Due: ${new Date(campaign.deadline).toLocaleDateString()}`
                              : getStatusLabel(campaign.status)}
                          </div>
                        </div>

                        {/* Actions Column */}
                        <div className="w-[140px] flex items-center justify-end gap-2">
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => setSelectedCampaignDetails(campaign)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          {(campaign.status === "applied" || campaign.status === "approved") && campaign.collaborationId && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0 hover:text-red-600"
                              title="Withdraw application"
                              onClick={(e) => {
                                e.stopPropagation();
                                setWithdrawingApplication(campaign);
                                setWithdrawAppConfirmText("");
                              }}
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Mobile Card View */}
                  <div className="lg:hidden space-y-3">
                    {myCampaigns.map((campaign) => (
                      <Card
                        key={campaign.id}
                        onClick={() => setSelectedCampaignDetails(campaign)}
                        className="p-4 cursor-pointer hover:bg-muted/20 transition-colors"
                      >
                        <div className="flex items-start gap-3 mb-3">
                          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0 text-xl overflow-hidden">
                            {campaign.brandAvatar.startsWith('data:') || campaign.brandAvatar.startsWith('http') ? (
                              <img src={campaign.brandAvatar} alt="" className="w-full h-full object-cover" />
                            ) : campaign.brandAvatar}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 mb-1">
                              <h3 className="text-sm font-semibold leading-tight truncate">{campaign.title}</h3>
                              {["approved", "active", "revision", "publishing"].includes(campaign.status) && (
                                <span className="inline-flex w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                              )}
                            </div>
                            <Badge
                              variant={campaign.status === "active" ? "default" : "secondary"}
                              className={`text-[10px] px-2 py-0 h-5 ${getStatusColor(campaign.status)} border`}
                            >
                              <div className={`w-1.5 h-1.5 rounded-full mr-1 ${getStatusDotColor(campaign.status)}`} />
                              {getStatusLabel(campaign.status)}
                            </Badge>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <div className="text-muted-foreground mb-0.5">Pricing</div>
                            <div className="flex flex-wrap gap-1">
                              {campaign.pricingModels.length > 0 ? (
                                campaign.pricingModels.map((m) => (
                                  <div key={m} className={`inline-block text-[10px] px-2 py-0.5 rounded-md font-medium ${getPricingBadgeStyle(m)}`}>
                                    {m.toUpperCase()}
                                  </div>
                                ))
                              ) : (
                                <div className={`inline-block text-[10px] px-2 py-0.5 rounded-md font-medium ${getPricingBadgeStyle(campaign.pricingModel)}`}>
                                  {campaign.pricingModel}
                                </div>
                              )}
                            </div>
                          </div>
                          <div>
                            <div className="text-muted-foreground mb-0.5">Budget</div>
                            <div className="font-semibold">${campaign.budget.toLocaleString()}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground mb-0.5">Received</div>
                            <div className="font-semibold text-success">
                              ${(() => {
                                if (campaign.status === "applied" || campaign.status === "approved") return "0";
                                if (["active", "content_review", "revision", "publishing", "delivered", "disputed"].includes(campaign.status)) return (campaign.budget * 0.5).toLocaleString();
                                if (campaign.status === "completed" || campaign.status === "resolved") return campaign.budget.toLocaleString();
                                return "0";
                              })()}
                            </div>
                          </div>
                          <div>
                            <div className="text-muted-foreground mb-0.5">Due</div>
                            <div className="font-medium">{new Date(campaign.deadline).toLocaleDateString()}</div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </>
              )}
                </>
              )}
            </motion.div>
          )}

          {/* Wallet Tab */}
          {activeTab === "wallet" && (
            <motion.div
              key="wallet"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-6 sm:mb-8">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <h1 className="text-xl sm:text-3xl font-bold mb-1">Wallet</h1>
                    <p className="text-muted-foreground text-xs sm:text-sm">Your earnings and transaction history</p>
                  </div>
                  <Button size="sm" variant="outline" className="h-8 sm:h-9 px-4 sm:px-5 text-xs sm:text-sm shrink-0" onClick={() => setShowWithdrawModal(true)}>
                    Withdraw
                  </Button>
                </div>
              </div>

              <div className="space-y-6">
                {/* Balance Overview */}
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div className="rounded-xl border border-border p-4 sm:p-6">
                    <p className="text-[10px] sm:text-xs text-muted-foreground mb-1 sm:mb-2">Available Balance</p>
                    <p className="text-xl sm:text-3xl font-bold text-primary">
                      ${walletBalance !== null ? walletBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}
                    </p>
                  </div>
                  <div className="rounded-xl border border-border p-4 sm:p-6">
                    <p className="text-[10px] sm:text-xs text-muted-foreground mb-1 sm:mb-2">Pending</p>
                    <p className="text-xl sm:text-3xl font-bold text-foreground">
                      ${walletPending !== null ? walletPending.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}
                    </p>
                  </div>
                </div>

                {/* Transaction History */}
                <div>
                  <h3 className="text-sm font-semibold mb-3">Transaction History</h3>
                  <div className="rounded-xl border border-border">
                  {walletTransactions.length === 0 ? (
                    <div className="text-center py-12 px-6">
                      <Wallet className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">No transactions yet</p>
                      <p className="text-xs text-muted-foreground mt-1">Your earnings and withdrawals will appear here</p>
                    </div>
                  ) : (
                    <div>
                      {walletTransactions.map(tx => {
                        const t = tx.type.toLowerCase();
                        const isFailed = tx.status === 'failed';
                        const isPending = tx.status === 'pending' || tx.status === 'PENDING';
                        const typeLabels: Record<string, string> = {
                          deposit: 'Deposit', withdrawal: 'Withdrawal',
                          campaign_advance: 'Advance Payment', campaign_payout: 'Final Payment',
                          campaign_payout_auto: 'Auto-release Payment', campaign_freeze: 'Funds Frozen',
                          campaign_unfreeze: 'Funds Released', advance_refund: 'Advance Refund',
                          dispute_payout: 'Dispute Payout', dispute_refund: 'Dispute Refund',
                        };
                        const incomingTypes = ['deposit', 'campaign_advance', 'campaign_payout', 'campaign_payout_auto', 'advance_refund', 'dispute_payout'];
                        const isIncoming = incomingTypes.includes(t);
                        const description = tx.projectName
                          ? `From: ${tx.projectName}`
                          : isFailed
                          ? 'Transaction failed — balance refunded'
                          : tx.currency
                          ? `${tx.currency} ${tx.network ? `via ${tx.network}` : ''}`
                          : '';
                        return (
                          <div key={tx.id} className={`flex items-center justify-between px-3 sm:px-5 py-3 sm:py-4 border-b border-border last:border-0 ${isFailed ? 'opacity-50' : ''}`}>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className={`text-sm font-medium ${isFailed ? 'text-muted-foreground' : isIncoming ? 'text-success' : 'text-foreground'}`}>
                                  {typeLabels[t] || tx.type}
                                </span>
                                {isFailed && (
                                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/10 text-red-600 font-medium">Failed</span>
                                )}
                                {isPending && (
                                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 font-medium">Pending</span>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground truncate mt-0.5">
                                {description}
                              </p>
                              <p className="text-[10px] text-muted-foreground">
                                {new Date(tx.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                            <div className="text-right shrink-0 ml-4">
                              {isFailed ? (
                                <p className="text-sm font-semibold text-muted-foreground line-through">${(tx.amount / 100).toFixed(2)}</p>
                              ) : (
                                <>
                                  <p className={`text-sm font-semibold ${isIncoming ? 'text-success' : 'text-red-600'}`}>
                                    {isIncoming ? '+' : '-'}${(tx.amount / 100).toFixed(2)}
                                  </p>
                                  {tx.fee > 0 && (
                                    <p className="text-[10px] text-muted-foreground">Fee: ${(tx.fee / 100).toFixed(2)}</p>
                                  )}
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
              </div>
            </motion.div>
          )}

          {/* Profile Tab */}
          {activeTab === "profile" && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-6">
                <h1 className="text-xl sm:text-3xl font-bold mb-2">Influencer Profile</h1>
                <p className="text-muted-foreground text-sm sm:text-base">Manage your public profile and portfolio</p>
              </div>

              <Card className="p-4 sm:p-8">
                <form className="space-y-5">
                  <div className="flex items-center gap-4 pb-5 border-b">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center overflow-hidden">
                      {avatarUrl ? (
                        <Image src={avatarUrl} alt="Avatar" width={80} height={80} className="w-full h-full object-cover" />
                      ) : (
                        <User className="h-10 w-10 text-primary" />
                      )}
                    </div>
                    <div>
                      <input
                        type="file"
                        id="avatar-upload"
                        accept="image/jpeg,image/png,image/svg+xml,image/webp"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0]
                          if (!file) return
                          if (file.size > 2 * 1024 * 1024) {
                            showToast('Image too large. Maximum 2MB.', 'error')
                            return
                          }
                          const reader = new FileReader()
                          reader.onload = async () => {
                            const base64 = reader.result as string
                            try {
                              const res = await fetch('/api/profiles/avatar', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ avatar: base64 }),
                              })
                              if (res.ok) {
                                setAvatarUrl(base64)
                                showToast('Avatar updated!', 'success')
                              } else {
                                const data = await res.json()
                                showToast(data.error || 'Failed to upload avatar', 'error')
                              }
                            } catch {
                              showToast('Failed to upload avatar', 'error')
                            }
                          }
                          reader.readAsDataURL(file)
                        }}
                      />
                      <Button type="button" size="sm" variant="outline" onClick={() => document.getElementById('avatar-upload')?.click()}>
                        <Camera className="h-4 w-4 mr-2" />
                        Upload Avatar
                      </Button>
                      <p className="text-xs text-muted-foreground mt-2">JPG, PNG or SVG. Max 2MB.</p>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="display-name" className="text-sm font-medium mb-2 block">
                      Display Name
                    </Label>
                    <Input
                      id="display-name"
                      placeholder="Your Name"
                      value={profileData.displayName}
                      onChange={(e) => setProfileData(p => ({...p, displayName: e.target.value}))}
                      className="h-11"
                    />
                  </div>

                  <div>
                    <Label htmlFor="bio" className="text-sm font-medium mb-2 block">
                      About You
                    </Label>
                    <Textarea
                      id="bio"
                      placeholder="Tell brands about yourself, your niche, and what makes your content unique..."
                      value={profileData.bio}
                      onChange={(e) => setProfileData(p => ({...p, bio: e.target.value}))}
                      rows={5}
                      className="resize-none"
                    />
                  </div>

                  <div>
                    <Label htmlFor="category" className="text-sm font-medium mb-2 block">
                      Primary Category
                    </Label>
                    <Select value={profileData.category} onValueChange={(val) => setProfileData(p => ({...p, category: val}))}>
                      <SelectTrigger className="h-11">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
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

                  <div className="space-y-4">
                    <Label className="text-sm font-medium">Social Media</Label>
                    <p className="text-xs text-muted-foreground">Fill in your handles and stats. Request verification so projects can trust your numbers. Changes save automatically.</p>

                    {/* X (Twitter) */}
                    <div className={`rounded-lg border p-3 space-y-2 ${profileData.twitterVerified ? 'border-success/30 bg-success/5' : 'border-border'}`} onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) autoSaveProfile(); }}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <XIcon className="h-4 w-4 text-muted-foreground" />
                          <span className="text-xs font-medium">X (Twitter)</span>
                        </div>
                        {profileData.twitterVerified && <CheckCircle2 className="h-4 w-4 text-success" />}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <Input placeholder="@handle" value={profileData.twitter} onChange={(e) => setProfileData(p => ({...p, twitter: e.target.value}))} className="h-10 col-span-3 sm:col-span-1" />
                        <Input type="number" placeholder="Followers" value={profileData.twitterFollowers || ''} onChange={(e) => setProfileData(p => ({...p, twitterFollowers: e.target.value}))} className="h-10" min="0" />
                        <Input type="number" placeholder="Avg. views" value={profileData.twitterAvgViews || ''} onChange={(e) => setProfileData(p => ({...p, twitterAvgViews: e.target.value}))} className="h-10" min="0" />
                      </div>
                      {!profileData.twitterVerified && profileData.twitter && (
                        <Button type="button" variant="outline" size="sm" className="h-8 text-xs w-full" onClick={async () => {
                          try {
                            const res = await fetch('/api/social/verify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ platform: 'twitter' }) })
                            const data = await res.json()
                            if (res.ok) showToast('Verification requested. Admin will review shortly.', 'success')
                            else showToast(data.error || 'Failed', 'error')
                          } catch { showToast('Failed to request verification', 'error') }
                        }}>Request Verification</Button>
                      )}
                    </div>

                    {/* Telegram */}
                    <div className={`rounded-lg border p-3 space-y-2 ${profileData.telegramVerified ? 'border-success/30 bg-success/5' : 'border-border'}`} onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) autoSaveProfile(); }}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Send className="h-4 w-4 text-muted-foreground" />
                          <span className="text-xs font-medium">Telegram</span>
                        </div>
                        {profileData.telegramVerified && <CheckCircle2 className="h-4 w-4 text-success" />}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <Input placeholder="@channel" value={profileData.telegram || ''} onChange={(e) => setProfileData(p => ({...p, telegram: e.target.value}))} className="h-10 col-span-3 sm:col-span-1" />
                        <Input type="number" placeholder="Subscribers" value={profileData.telegramFollowers || ''} onChange={(e) => setProfileData(p => ({...p, telegramFollowers: e.target.value}))} className="h-10" min="0" />
                        <Input type="number" placeholder="Avg. views" value={profileData.telegramAvgViews || ''} onChange={(e) => setProfileData(p => ({...p, telegramAvgViews: e.target.value}))} className="h-10" min="0" />
                      </div>
                      {!profileData.telegramVerified && profileData.telegram && (
                        <Button type="button" variant="outline" size="sm" className="h-8 text-xs w-full" onClick={async () => {
                          try {
                            const res = await fetch('/api/social/verify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ platform: 'telegram' }) })
                            const data = await res.json()
                            if (res.ok) showToast('Verification requested. Admin will review shortly.', 'success')
                            else showToast(data.error || 'Failed', 'error')
                          } catch { showToast('Failed to request verification', 'error') }
                        }}>Request Verification</Button>
                      )}
                    </div>

                    {/* Instagram */}
                    <div className={`rounded-lg border p-3 space-y-2 ${profileData.instagramVerified ? 'border-success/30 bg-success/5' : 'border-border'}`} onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) autoSaveProfile(); }}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Instagram className="h-4 w-4 text-muted-foreground" />
                          <span className="text-xs font-medium">Instagram</span>
                        </div>
                        {profileData.instagramVerified && <CheckCircle2 className="h-4 w-4 text-success" />}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <Input placeholder="@handle" value={profileData.instagram} onChange={(e) => setProfileData(p => ({...p, instagram: e.target.value}))} className="h-10 col-span-3 sm:col-span-1" />
                        <Input type="number" placeholder="Followers" value={profileData.instagramFollowers} onChange={(e) => setProfileData(p => ({...p, instagramFollowers: e.target.value}))} className="h-10" min="0" />
                        <Input type="number" placeholder="Avg. views" value={profileData.instagramAvgViews || ''} onChange={(e) => setProfileData(p => ({...p, instagramAvgViews: e.target.value}))} className="h-10" min="0" />
                      </div>
                      {!profileData.instagramVerified && profileData.instagram && (
                        <Button type="button" variant="outline" size="sm" className="h-8 text-xs w-full" onClick={async () => {
                          try {
                            const res = await fetch('/api/social/verify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ platform: 'instagram' }) })
                            const data = await res.json()
                            if (res.ok) showToast('Verification requested. Admin will review shortly.', 'success')
                            else showToast(data.error || 'Failed', 'error')
                          } catch { showToast('Failed to request verification', 'error') }
                        }}>Request Verification</Button>
                      )}
                    </div>

                    {/* TikTok */}
                    <div className={`rounded-lg border p-3 space-y-2 ${profileData.tiktokVerified ? 'border-success/30 bg-success/5' : 'border-border'}`} onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) autoSaveProfile(); }}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <svg className="h-4 w-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                          </svg>
                          <span className="text-xs font-medium">TikTok</span>
                        </div>
                        {profileData.tiktokVerified && <CheckCircle2 className="h-4 w-4 text-success" />}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <Input placeholder="@handle" value={profileData.tiktok} onChange={(e) => setProfileData(p => ({...p, tiktok: e.target.value}))} className="h-10 col-span-3 sm:col-span-1" />
                        <Input type="number" placeholder="Followers" value={profileData.tiktokFollowers} onChange={(e) => setProfileData(p => ({...p, tiktokFollowers: e.target.value}))} className="h-10" min="0" />
                        <Input type="number" placeholder="Avg. views" value={profileData.tiktokAvgViews || ''} onChange={(e) => setProfileData(p => ({...p, tiktokAvgViews: e.target.value}))} className="h-10" min="0" />
                      </div>
                      {!profileData.tiktokVerified && profileData.tiktok && (
                        <Button type="button" variant="outline" size="sm" className="h-8 text-xs w-full" onClick={async () => {
                          try {
                            const res = await fetch('/api/social/verify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ platform: 'tiktok' }) })
                            const data = await res.json()
                            if (res.ok) showToast('Verification requested. Admin will review shortly.', 'success')
                            else showToast(data.error || 'Failed', 'error')
                          } catch { showToast('Failed to request verification', 'error') }
                        }}>Request Verification</Button>
                      )}
                    </div>

                    {/* YouTube */}
                    <div className={`rounded-lg border p-3 space-y-2 ${profileData.youtubeVerified ? 'border-success/30 bg-success/5' : 'border-border'}`} onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) autoSaveProfile(); }}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Youtube className="h-4 w-4 text-muted-foreground" />
                          <span className="text-xs font-medium">YouTube</span>
                        </div>
                        {profileData.youtubeVerified && <CheckCircle2 className="h-4 w-4 text-success" />}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <Input placeholder="@channel" value={profileData.youtube} onChange={(e) => setProfileData(p => ({...p, youtube: e.target.value}))} className="h-10 col-span-3 sm:col-span-1" />
                        <Input type="number" placeholder="Subscribers" value={profileData.youtubeSubscribers} onChange={(e) => setProfileData(p => ({...p, youtubeSubscribers: e.target.value}))} className="h-10" min="0" />
                        <Input type="number" placeholder="Avg. views" value={profileData.youtubeAvgViews || ''} onChange={(e) => setProfileData(p => ({...p, youtubeAvgViews: e.target.value}))} className="h-10" min="0" />
                      </div>
                      {!profileData.youtubeVerified && profileData.youtube && (
                        <Button type="button" variant="outline" size="sm" className="h-8 text-xs w-full" onClick={async () => {
                          try {
                            showToast('Verifying subscribers and sending to admin...', 'success')
                            const res = await fetch('/api/social/verify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ platform: 'youtube' }) })
                            const data = await res.json()
                            if (res.ok) {
                              if (data.youtubeAutoResult) {
                                setProfileData(p => ({ ...p, youtubeSubscribers: String(data.youtubeAutoResult.subscribers) }))
                                showToast(`Subscribers verified: ${data.youtubeAutoResult.subscribers.toLocaleString()}. Sent to admin for full review.`, 'success')
                              } else {
                                showToast('Verification requested. Admin will review shortly.', 'success')
                              }
                            } else showToast(data.error || 'Failed', 'error')
                          } catch { showToast('Failed to request verification', 'error') }
                        }}>Verify &amp; Request Review</Button>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4 pt-2" onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) autoSaveProfile(); }}>
                    <Label className="text-sm font-medium">Your Rates (USD)</Label>
                    <p className="text-xs text-muted-foreground">Optional. Projects see these when browsing your profile. Fill in what makes sense for you. Final price is negotiated per campaign.</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="rounded-lg border border-border p-3">
                        <Label className="text-xs font-medium mb-2 block">CPM (per 1K views)</Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input type="number" placeholder="e.g. 10" value={profileData.cpmRate} onChange={(e) => setProfileData(p => ({...p, cpmRate: e.target.value}))} className="pl-10 h-10" min="0" step="0.01" />
                        </div>
                      </div>

                      <div className="rounded-lg border border-border p-3">
                        <Label className="text-xs font-medium mb-2 block">CPC (per click)</Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input type="number" placeholder="e.g. 0.50" value={profileData.cpcRate} onChange={(e) => setProfileData(p => ({...p, cpcRate: e.target.value}))} className="pl-10 h-10" min="0" step="0.01" />
                        </div>
                      </div>

                      <div className="rounded-lg border border-border p-3">
                        <Label className="text-xs font-medium mb-2 block">CPE (per engagement)</Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input type="number" placeholder="e.g. 0.20" value={profileData.cpeRate} onChange={(e) => setProfileData(p => ({...p, cpeRate: e.target.value}))} className="pl-10 h-10" min="0" step="0.01" />
                        </div>
                      </div>

                      <div className="rounded-lg border border-border p-3">
                        <Label className="text-xs font-medium mb-2 block">Average post price</Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input type="number" placeholder="e.g. 200" value={profileData.averagePostPrice} onChange={(e) => setProfileData(p => ({...p, averagePostPrice: e.target.value}))} className="pl-10 h-10" min="0" step="1" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      type="button"
                      className="flex-1 h-11 bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                      onClick={async () => {
                        try {
                          const res = await fetch('/api/influencers/me', {
                            method: 'PATCH',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              handle: profileData.displayName,
                              bio: profileData.bio,
                              niche: profileData.category ? [profileData.category] : [],
                              instagramHandle: profileData.instagram,
                              instagramFollowers: profileData.instagramFollowers ? parseInt(profileData.instagramFollowers) : 0,
                              instagramAvgViews: profileData.instagramAvgViews ? parseInt(profileData.instagramAvgViews) : 0,
                              tiktokHandle: profileData.tiktok,
                              tiktokFollowers: profileData.tiktokFollowers ? parseInt(profileData.tiktokFollowers) : 0,
                              tiktokAvgViews: profileData.tiktokAvgViews ? parseInt(profileData.tiktokAvgViews) : 0,
                              youtubeHandle: profileData.youtube,
                              youtubeSubscribers: profileData.youtubeSubscribers ? parseInt(profileData.youtubeSubscribers) : 0,
                              youtubeAvgViews: profileData.youtubeAvgViews ? parseInt(profileData.youtubeAvgViews) : 0,
                              twitterHandle: profileData.twitter,
                              twitterFollowers: profileData.twitterFollowers ? parseInt(profileData.twitterFollowers) : 0,
                              twitterAvgViews: profileData.twitterAvgViews ? parseInt(profileData.twitterAvgViews) : 0,
                              telegramHandle: profileData.telegram,
                              telegramFollowers: profileData.telegramFollowers ? parseInt(profileData.telegramFollowers) : 0,
                              telegramAvgViews: profileData.telegramAvgViews ? parseInt(profileData.telegramAvgViews) : 0,
                              cpmRate: profileData.cpmRate ? parseFloat(profileData.cpmRate) : undefined,
                              cpcRate: profileData.cpcRate ? parseFloat(profileData.cpcRate) : undefined,
                              cpeRate: profileData.cpeRate ? parseFloat(profileData.cpeRate) : undefined,
                              averagePostPrice: profileData.averagePostPrice ? parseFloat(profileData.averagePostPrice) : undefined,
                            }),
                          })
                          if (res.ok) {
                            showToast('Profile saved!', 'success')
                          } else {
                            const data = await res.json()
                            showToast(data.error || 'Failed to save profile', 'error')
                          }
                        } catch {
                          showToast('Failed to save profile', 'error')
                        }
                      }}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save Profile
                    </Button>
                    <Button type="button" variant="outline" className="h-11">
                      Cancel
                    </Button>
                  </div>
                </form>
              </Card>
            </motion.div>
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-6">
                <h1 className="text-xl sm:text-3xl font-bold mb-2">Settings</h1>
                <p className="text-muted-foreground text-sm sm:text-base">
                  Manage your account preferences
                </p>
              </div>

              <div className="space-y-4 max-w-2xl">
                <Card className="p-5">
                  <h3 className="text-sm font-semibold mb-3">Account</h3>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-xs text-muted-foreground">Email</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Input value={userEmail} readOnly className="h-10 bg-muted/50" />
                        {emailVerified && <CheckCircle2 className="h-4 w-4 text-success shrink-0" />}
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <Label className="text-xs font-medium mb-2 block">Change Password</Label>
                      <form onSubmit={async (e) => {
                        e.preventDefault();
                        const form = e.currentTarget;
                        const currentPw = (form.elements.namedItem('currentPassword') as HTMLInputElement).value;
                        const newPw = (form.elements.namedItem('newPassword') as HTMLInputElement).value;
                        const confirmPw = (form.elements.namedItem('confirmPassword') as HTMLInputElement).value;
                        if (newPw !== confirmPw) { showToast('Passwords do not match', 'error'); return; }
                        if (newPw.length < 8) { showToast('Password must be at least 8 characters', 'error'); return; }
                        try {
                          const res = await fetch('/api/auth/change-password', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ currentPassword: currentPw, newPassword: newPw }),
                          });
                          const data = await res.json();
                          if (res.ok) { showToast('Password changed successfully', 'success'); form.reset(); }
                          else showToast(data.error || 'Failed to change password', 'error');
                        } catch { showToast('Failed to change password', 'error'); }
                      }} className="space-y-2">
                        <Input name="currentPassword" type="password" placeholder="Current password" className="h-10" required />
                        <Input name="newPassword" type="password" placeholder="New password" className="h-10" required minLength={8} />
                        <Input name="confirmPassword" type="password" placeholder="Confirm new password" className="h-10" required minLength={8} />
                        <Button type="submit" size="sm">Change Password</Button>
                      </form>
                    </div>
                  </div>
                </Card>

                <Card className="p-5">
                  <h3 className="text-sm font-semibold mb-3">Notifications</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium">Email Notifications</div>
                        <div className="text-xs text-muted-foreground">
                          Receive email updates about your campaigns
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={emailNotifications}
                        onChange={(e) => handleNotificationToggle('emailNotifications', e.target.checked)}
                        className="rounded"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium">Campaign Updates</div>
                        <div className="text-xs text-muted-foreground">
                          Get notified about campaign invitations and application updates
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={campaignUpdates}
                        onChange={(e) => handleNotificationToggle('campaignUpdates', e.target.checked)}
                        className="rounded"
                      />
                    </div>
                  </div>
                </Card>

                <Card className="p-5">
                  <h3 className="text-sm font-semibold mb-3">Two-Factor Authentication</h3>
                  {totpBackupCodes ? (
                    /* Step 3: Show backup codes after successful verification */
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-success" />
                        <span className="text-sm font-medium text-success">2FA enabled successfully</span>
                      </div>
                      <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
                        <p className="text-xs font-medium text-amber-800 mb-2">Save these backup codes in a safe place. Each can be used once if you lose access to your authenticator app.</p>
                        <div className="grid grid-cols-2 gap-1">
                          {totpBackupCodes.map((code) => (
                            <code key={code} className="text-xs bg-white px-2 py-1 rounded border text-center font-mono">{code}</code>
                          ))}
                        </div>
                      </div>
                      <Button size="sm" onClick={() => { setTotpBackupCodes(null); setTotpSetup(null); setTotpEnabled(true); }}>
                        I saved my backup codes
                      </Button>
                    </div>
                  ) : totpEnabled ? (
                    /* 2FA is enabled — option to disable */
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-success" />
                        <span className="text-sm font-medium text-success">2FA is enabled</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Your account is protected with an authenticator app.</p>
                      <form onSubmit={async (e) => {
                        e.preventDefault();
                        const code = (e.currentTarget.elements.namedItem('disableCode') as HTMLInputElement).value;
                        try {
                          const res = await fetch('/api/auth/2fa/disable', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code }) });
                          const data = await res.json();
                          if (res.ok) { setTotpEnabled(false); showToast('2FA disabled', 'success'); e.currentTarget.reset(); }
                          else showToast(data.error || 'Failed', 'error');
                        } catch { showToast('Failed to disable 2FA', 'error'); }
                      }} className="flex gap-2">
                        <Input name="disableCode" type="text" placeholder="Enter password, app code, or backup code to disable 2FA" className="h-9 flex-1" required />
                        <Button type="submit" variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50 text-xs h-9 shrink-0">Disable</Button>
                      </form>
                    </div>
                  ) : totpSetup ? (
                    /* Step 2: QR code shown, verify with code */
                    <div className="space-y-3">
                      <p className="text-xs text-muted-foreground">Scan this QR code with your authenticator app:</p>
                      <div className="flex justify-center">
                        <img src={totpSetup.qrCode} alt="QR Code" className="w-48 h-48 rounded-lg border" />
                      </div>
                      <p className="text-[10px] text-muted-foreground text-center">
                        Or enter manually: <code className="bg-muted px-1 py-0.5 rounded text-[10px]">{totpSetup.secret}</code>
                      </p>
                      <form onSubmit={async (e) => {
                        e.preventDefault();
                        try {
                          const res = await fetch('/api/auth/2fa/verify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code: totpVerifyCode }) });
                          const data = await res.json();
                          if (res.ok && data.enabled) {
                            setTotpBackupCodes(data.backupCodes);
                          } else showToast(data.error || 'Invalid code', 'error');
                        } catch { showToast('Failed to verify', 'error'); }
                      }} className="flex gap-2">
                        <Input type="text" inputMode="numeric" placeholder="Enter 6-digit code" value={totpVerifyCode} onChange={(e) => setTotpVerifyCode(e.target.value)} className="h-9 flex-1 text-center tracking-widest" maxLength={6} required />
                        <Button type="submit" size="sm" className="shrink-0">Verify</Button>
                      </form>
                    </div>
                  ) : (
                    /* Step 1: Not enabled, show enable button */
                    <div className="space-y-3">
                      <p className="text-xs text-muted-foreground">Add an extra layer of security with an authenticator app (Google Authenticator, Authy, etc.)</p>
                      <Button size="sm" variant="outline" onClick={async () => {
                        try {
                          const res = await fetch('/api/auth/2fa/setup', { method: 'POST' });
                          const data = await res.json();
                          if (res.ok) setTotpSetup({ qrCode: data.qrCode, secret: data.secret });
                          else showToast(data.error || 'Failed to setup 2FA', 'error');
                        } catch { showToast('Failed to setup 2FA', 'error'); }
                      }}>Enable 2FA</Button>
                    </div>
                  )}
                </Card>

                <div className="flex items-center justify-between px-4 py-3 rounded-lg border border-muted">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Delete Account</p>
                    <p className="text-xs text-muted-foreground">Permanently delete your account and all data</p>
                  </div>
                  <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 text-xs" onClick={() => setShowDeleteModal(true)}>
                    Delete
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
          </AnimatePresence>
        </main>
      </div>

      {/* Apply Modal */}
      {applyingCampaign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-background border border-border rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl">
            <h3 className="text-lg font-bold mb-1">Apply to Campaign</h3>
            <p className="text-sm text-muted-foreground mb-2">{applyingCampaign.title}</p>

            {/* Campaign details summary */}
            <div className="bg-muted/50 rounded-xl p-3 mb-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Budget</span>
                <span className="font-medium">${applyingCampaign.budgetMin || 0} – ${applyingCampaign.budgetMax || 0} / creator</span>
              </div>
              {applyingCampaign.platforms && applyingCampaign.platforms.length > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Platforms</span>
                  <span className="font-medium">{applyingCampaign.platforms.map(p => p === 'twitter' ? 'X' : p.charAt(0).toUpperCase() + p.slice(1)).join(', ')}</span>
                </div>
              )}
              {applyingCampaign.contentFormats && applyingCampaign.contentFormats.length > 0 && (
                <div className="flex justify-between items-start">
                  <span className="text-muted-foreground">Deliverables</span>
                  <span className="font-medium text-right">{applyingCampaign.contentFormats.map(f => f.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())).join(', ')}</span>
                </div>
              )}
              {applyingCampaign.goal && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Goal</span>
                  <span className="font-medium capitalize">{applyingCampaign.goal.replace(/-/g, ' ')}</span>
                </div>
              )}
            </div>

            {/* Target metrics — what the project expects */}
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 mb-4 space-y-2 text-sm">
              <p className="text-xs font-semibold text-primary mb-1">Target Metrics (project expectations)</p>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Target views</span>
                <span className="font-medium">{applyingCampaign.targetViews ? Number(applyingCampaign.targetViews).toLocaleString() : 'Not specified'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Target clicks</span>
                <span className="font-medium">{applyingCampaign.targetClicks ? Number(applyingCampaign.targetClicks).toLocaleString() : 'Not specified'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Target engagements</span>
                <span className="font-medium">{applyingCampaign.targetEngagements ? Number(applyingCampaign.targetEngagements).toLocaleString() : 'Not specified'}</span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Your Price ($) for this collaboration</label>
                <input
                  type="number"
                  value={proposedPrice}
                  onChange={(e) => setProposedPrice(e.target.value)}
                  placeholder="Total price for all deliverables"
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Fixed price for the full collaboration. Project budget: ${applyingCampaign.budgetMin || 0} – ${applyingCampaign.budgetMax || 0}. Payment: 50% advance on start, 50% on delivery.
                </p>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Message (optional)</label>
                <textarea
                  value={applicationMessage}
                  onChange={(e) => setApplicationMessage(e.target.value)}
                  placeholder="Why you're a great fit for this campaign..."
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>

              {applyError && <p className="text-sm text-red-500">{applyError}</p>}
              {applySuccess && <p className="text-sm text-green-500">{applySuccess}</p>}

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => { setApplyingCampaign(null); setApplyError(""); }}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleApply}
                  disabled={applyLoading || !proposedPrice}
                >
                  {applyLoading ? "Submitting..." : "Submit Application"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Withdraw Application Modal */}
      {withdrawingApplication && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-background border border-border rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl">
            <h3 className="text-lg font-bold mb-1">Withdraw Application</h3>
            <p className="text-sm text-muted-foreground mb-4">
              This will cancel your application for <span className="font-semibold text-foreground">{withdrawingApplication.title}</span>. You can re-apply later.
            </p>
            <p className="text-sm mb-2">
              Type <span className="font-semibold">{withdrawingApplication.title}</span> to confirm:
            </p>
            <input
              type="text"
              value={withdrawAppConfirmText}
              onChange={(e) => setWithdrawAppConfirmText(e.target.value)}
              placeholder={withdrawingApplication.title}
              className="w-full px-3 py-2 border border-border rounded-lg text-sm mb-4 bg-background focus:outline-none focus:ring-2 focus:ring-destructive/50"
              autoFocus
            />
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => { setWithdrawingApplication(null); setWithdrawAppConfirmText(""); }}
                className="px-4 py-2 text-sm rounded-lg border border-border hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  setWithdrawAppLoading(true);
                  try {
                    const res = await fetch(`/api/collaborations/${withdrawingApplication.collaborationId}`, {
                      method: "PATCH",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ status: "CANCELLED" }),
                    });
                    if (res.ok) {
                      showToast("Application withdrawn", "success");
                      await refreshCollaborations();
                    } else {
                      const data = await res.json();
                      showToast(data.error || "Failed to withdraw", "error");
                    }
                  } catch {
                    showToast("Failed to withdraw", "error");
                  } finally {
                    setWithdrawAppLoading(false);
                    setWithdrawingApplication(null);
                    setWithdrawAppConfirmText("");
                  }
                }}
                disabled={withdrawAppConfirmText !== withdrawingApplication.title || withdrawAppLoading}
                className="px-4 py-2 text-sm rounded-lg bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {withdrawAppLoading ? 'Withdrawing...' : 'Withdraw Application'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Withdraw Modal */}
      <Dialog open={showWithdrawModal} onOpenChange={setShowWithdrawModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Withdraw Funds</DialogTitle>
            <DialogDescription>
              Send funds to your crypto wallet
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="withdraw-amount" className="text-sm font-medium mb-2 block">
                Amount (USD)
              </Label>
              <Input
                id="withdraw-amount"
                type="number"
                placeholder="0.00"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                className="h-11"
                min="0"
              />
            </div>

            <div>
              <Label htmlFor="withdraw-currency" className="text-sm font-medium mb-2 block">
                Currency
              </Label>
              <Select value={withdrawCurrency} onValueChange={setWithdrawCurrency}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USDT (TRC20)">USDT — Tron (TRC20)</SelectItem>
                  <SelectItem value="USDT (ERC20)">USDT — Ethereum (ERC20)</SelectItem>
                  <SelectItem value="USDT (BEP20)">USDT — BSC (BEP20)</SelectItem>
                  <SelectItem value="USDC (ERC20)">USDC — Ethereum (ERC20)</SelectItem>
                  <SelectItem value="USDC (TRC20)">USDC — Tron (TRC20)</SelectItem>
                  <SelectItem value="BTC">Bitcoin (BTC)</SelectItem>
                  <SelectItem value="ETH">Ethereum (ETH)</SelectItem>
                  <SelectItem value="SOL">Solana (SOL)</SelectItem>
                  <SelectItem value="TRX">Tron (TRX)</SelectItem>
                  <SelectItem value="BNB">BNB (BSC)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="wallet-address" className="text-sm font-medium mb-2 block">
                Wallet Address
              </Label>
              <Input
                id="wallet-address"
                type="text"
                placeholder="Enter your wallet address"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                className="h-11"
              />
              <p className="text-xs text-muted-foreground mt-1.5">
                Make sure the address matches the selected network. Sending to the wrong network may result in permanent loss.
              </p>
            </div>

            <div className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground space-y-1">
              <p>Minimum withdrawal: <span className="font-medium text-foreground">$10.00</span></p>
              <p>Withdrawal fee: <span className="font-medium text-foreground">3%</span></p>
              {withdrawAmount && parseFloat(withdrawAmount) >= 10 && (
                <p>You will receive: <span className="font-medium text-foreground">${(parseFloat(withdrawAmount) * 0.97).toFixed(2)}</span></p>
              )}
            </div>

            <Button
              onClick={async () => {
                if (!emailVerified) {
                  setShowWithdrawModal(false);
                  setShowVerifyPopup(true);
                  return;
                }
                if (!withdrawAmount || !walletAddress.trim() || !withdrawCurrency) return;
                try {
                  const res = await fetch('/api/wallet/withdraw', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      amount: parseFloat(withdrawAmount),
                      address: walletAddress.trim(),
                      currency: withdrawCurrency,
                    }),
                  });
                  const data = await res.json();
                  if (!res.ok) {
                    showToast(data.error || 'Failed to create withdrawal', 'error');
                    return;
                  }
                  showToast('Withdrawal submitted! Your funds will be sent to your wallet shortly.', 'success');
                  // Refresh wallet data
                  const walletRes = await fetch('/api/wallet');
                  if (walletRes.ok) {
                    const walletData = await walletRes.json();
                    if (walletData.wallet) {
                      setWalletBalance(Math.round((walletData.wallet.balance || 0) / 100));
                    }
                    if (walletData.transactions) {
                      const txs = walletData.transactions as Array<{ type: string; status: string; amount: number }>;
                      const withdrawals = txs
                        .filter((t) => t.type === 'WITHDRAWAL' && t.status === 'PENDING')
                        .reduce((sum: number, t) => sum + (t.amount || 0), 0);
                      setPendingWithdrawals(Math.round(withdrawals / 100));
                    }
                  }
                  setShowWithdrawModal(false);
                  setWithdrawAmount("");
                  setWalletAddress("");
                  setWithdrawCurrency("USDT (TRC20)");
                } catch (error) {
                  console.error('Failed to withdraw:', error);
                  showToast('Failed to withdraw. Please try again.', 'error');
                }
              }}
              disabled={!withdrawAmount || !walletAddress.trim() || !withdrawCurrency}
              className="w-full h-11 bg-gradient-to-r from-primary to-secondary hover:opacity-90"
            >
              Submit Withdrawal
            </Button>
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
                    showToast('Verification email sent! Check your inbox.', 'success');
                  } catch {
                    showToast('Failed to send verification email.', 'error');
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

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-background border border-border rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl">
            <h3 className="text-lg font-bold mb-2 text-destructive">Delete Account</h3>
            <p className="text-sm text-muted-foreground mb-4">
              This action is permanent and cannot be undone. All your data will be deleted.
            </p>
            <div className="mb-4">
              <label className="text-sm font-medium mb-1 block">Type &quot;DELETE&quot; to confirm</label>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder='Type "DELETE" to confirm'
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-destructive"
              />
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => { setShowDeleteModal(false); setDeleteConfirmText(''); }}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                className="flex-1"
                disabled={deleteConfirmText !== 'DELETE' || deleteLoading}
                onClick={async () => {
                  setDeleteLoading(true);
                  try {
                    const res = await fetch('/api/auth/delete-account', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ confirmation: deleteConfirmText }),
                    });
                    if (res.ok) {
                      window.location.href = '/';
                    } else {
                      const data = await res.json();
                      showToast(data.error || 'Failed to delete account', 'error');
                      setDeleteLoading(false);
                    }
                  } catch {
                    showToast('Failed to delete account', 'error');
                    setDeleteLoading(false);
                  }
                }}
              >
                {deleteLoading ? 'Deleting...' : 'Delete Account'}
              </Button>
            </div>
          </div>
        </div>
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
    </div>
  );
}
