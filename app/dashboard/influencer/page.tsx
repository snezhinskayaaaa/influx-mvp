"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
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
  Users,
  Calendar,
  DollarSign,
  Settings,
  User,
  Bell,
  LogOut,
  ChevronDown,
  Filter,
  X,
  Eye,
  Heart,
  CheckCircle2,
  Clock,
  Briefcase,
  BarChart3,
  Camera,
  Save,
  Instagram,
  Twitter,
  Youtube,
  ArrowRight,
  Link as LinkIcon,
  MessageSquare,
  Upload,
  ExternalLink,
  Rocket,
  Mail,
  AlertCircle,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { NetworkLogo } from "@/components/logo";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Campaign {
  id: number | string;
  title: string;
  brand: string;
  brandAvatar: string;
  category: string;
  budget: number;
  pricingModel: "CPM" | "CPC" | "CPE";
  description: string;
  requirements: string[];
  platforms: string[];
  deadline: string;
  status: "open" | "applied" | "approved" | "active" | "completed";
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
  publicMetrics?: {
    views?: number;
    likes?: number;
    comments?: number;
    shares?: number;
  };
}

const mockDiscoverCampaigns: Campaign[] = [
  {
    id: 1,
    title: "Summer Fashion Collection Launch",
    brand: "StyleCo",
    brandAvatar: "👗",
    category: "Fashion & Style",
    budget: 5000,
    pricingModel: "CPM",
    description: "Promote our new summer collection with authentic styling content",
    requirements: ["Fashion niche", "10k+ followers", "High engagement rate"],
    platforms: ["Instagram", "TikTok"],
    deadline: "2026-04-15",
    status: "open",
  },
  {
    id: 2,
    title: "Tech Product Review Campaign",
    brand: "TechNova",
    brandAvatar: "💻",
    category: "Technology",
    budget: 8000,
    pricingModel: "CPE",
    description: "Create detailed review content for our latest gadget",
    requirements: ["Tech reviews", "Authentic voice", "Video content"],
    platforms: ["YouTube", "Instagram"],
    deadline: "2026-04-20",
    status: "open",
  },
  {
    id: 3,
    title: "Fitness App Launch",
    brand: "FitLife",
    brandAvatar: "💪",
    category: "Health & Fitness",
    budget: 3000,
    pricingModel: "CPE",
    description: "Drive app downloads with workout transformation content",
    requirements: ["Fitness content", "Genuine results", "Story-driven"],
    platforms: ["Instagram", "TikTok"],
    deadline: "2026-04-10",
    status: "applied",
  },
  {
    id: 4,
    title: "Beauty Product Line Promotion",
    brand: "GlowBeauty",
    brandAvatar: "✨",
    category: "Beauty & Care",
    budget: 4500,
    pricingModel: "CPM",
    description: "Showcase our new skincare line with before/after content",
    requirements: ["Beauty niche", "Skincare focus", "Authentic reviews"],
    platforms: ["Instagram", "YouTube"],
    deadline: "2026-04-25",
    status: "open",
  },
];

const mockMyCampaigns: Campaign[] = [
  {
    id: 3,
    title: "Fitness App Launch",
    brand: "FitLife",
    brandAvatar: "💪",
    category: "Health & Fitness",
    budget: 3000,
    pricingModel: "CPE",
    description: "Drive app downloads with workout transformation content",
    requirements: ["Fitness content", "Genuine results", "Story-driven"],
    platforms: ["Instagram", "TikTok"],
    deadline: "2026-04-10",
    status: "applied",
    startDate: "2026-03-15",
    endDate: "2026-04-10",
    goal: "engagement",
    targetEngagements: "15000",
    productName: "FitLife Pro App",
    productLink: "https://fitlife.com/app",
    brandTag: "@fitlife",
    hashtags: "#FitLife #FitnessGoals #WorkoutMotivation",
    detailedRequirements: "Create authentic workout transformation content showing the app features. Include before/after progress and highlight key app functionalities.",
    influencerApprovedTerms: false,
    brandApprovedTerms: false,
  },
  {
    id: 5,
    title: "Eco-Friendly Products Campaign",
    brand: "GreenEarth",
    brandAvatar: "🌱",
    category: "Lifestyle",
    budget: 6000,
    pricingModel: "CPM",
    description: "Promote sustainable living products",
    requirements: ["Eco-conscious content", "Lifestyle niche"],
    platforms: ["Instagram"],
    deadline: "2026-05-01",
    status: "approved",
    startDate: "2026-03-20",
    endDate: "2026-05-01",
    goal: "brand-awareness",
    targetViews: "100000",
    productName: "GreenEarth Eco Pack",
    productLink: "https://greenearth.com/products",
    brandTag: "@greenearth",
    hashtags: "#EcoFriendly #SustainableLiving #GreenEarth",
    detailedRequirements: "Showcase our eco-friendly products in your daily routine. Focus on sustainability benefits and lifestyle integration.",
    influencerApprovedTerms: true,
    brandApprovedTerms: true,
    brandTerms: "Content must align with eco-conscious values. Product packaging must be visible.",
  },
  {
    id: 6,
    title: "Travel Gear Review",
    brand: "Wanderlust",
    brandAvatar: "✈️",
    category: "Travel",
    budget: 7000,
    pricingModel: "CPE",
    description: "Create content featuring our travel accessories",
    requirements: ["Travel content", "Adventure focus"],
    platforms: ["YouTube", "Instagram"],
    deadline: "2026-03-20",
    status: "active",
    startDate: "2026-02-15",
    endDate: "2026-03-20",
    goal: "conversions",
    targetEngagements: "20000",
    productName: "Wanderlust Travel Backpack",
    productPrice: "149",
    productLink: "https://wanderlust.com/backpack",
    brandTag: "@wanderlust",
    hashtags: "#Wanderlust #TravelGear #Adventure",
    detailedRequirements: "Create engaging review content showing the backpack in real travel scenarios. Highlight durability and features.",
    influencerApprovedTerms: true,
    brandApprovedTerms: true,
    contentApproved: true,
    currentContentUrl: "https://drive.google.com/file/d/sample123",
    publishedUrl: "https://youtube.com/watch?v=sample123",
    publicMetrics: {
      views: 85000,
      likes: 4200,
      comments: 340,
      shares: 180,
    },
  },
];

export default function InfluencerDashboard() {
  const [activeTab, setActiveTab] = useState<"discover" | "my-campaigns" | "profile" | "settings">("discover");
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
  const [currentPipelineStage, setCurrentPipelineStage] = useState(1);
  const [isCampaignDetailsExpanded, setIsCampaignDetailsExpanded] = useState(false);
  const [contentLinkInput, setContentLinkInput] = useState("");
  const [publishedLinkInput, setPublishedLinkInput] = useState("");
  const [applyingCampaign, setApplyingCampaign] = useState<Campaign | null>(null);
  const [proposedPrice, setProposedPrice] = useState("");
  const [applicationMessage, setApplicationMessage] = useState("");
  const [applyLoading, setApplyLoading] = useState(false);
  const [applyError, setApplyError] = useState("");
  const [applySuccess, setApplySuccess] = useState("");

  const [discoverCampaigns, setDiscoverCampaigns] = useState<Campaign[]>([]);
  const [myCampaigns, setMyCampaigns] = useState<Campaign[]>([]);
  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  const [walletPending, setWalletPending] = useState<number | null>(null);
  const [walletTotalEarned, setWalletTotalEarned] = useState<number | null>(null);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [withdrawCurrency, setWithdrawCurrency] = useState("USDT (TRC20)");
  const [pendingDeposits, setPendingDeposits] = useState(0);
  const [pendingWithdrawals, setPendingWithdrawals] = useState(0);
  const [showVerifyPopup, setShowVerifyPopup] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [emailVerified, setEmailVerified] = useState(true);
  const [influencerStatus, setInfluencerStatus] = useState<string>('PENDING');
  const [profileData, setProfileData] = useState<{
    displayName: string
    bio: string
    category: string
    instagram: string
    instagramFollowers: string
    tiktok: string
    tiktokFollowers: string
    twitter: string
    youtube: string
    youtubeSubscribers: string
    cpmMin: string
    cpmMax: string
    cpcMin: string
    cpcMax: string
    cpeMin: string
    cpeMax: string
  }>({
    displayName: '',
    bio: '',
    category: '',
    instagram: '',
    instagramFollowers: '',
    tiktok: '',
    tiktokFollowers: '',
    twitter: '',
    youtube: '',
    youtubeSubscribers: '',
    cpmMin: '',
    cpmMax: '',
    cpcMin: '',
    cpcMax: '',
    cpeMin: '',
    cpeMax: '',
  })

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
              brandAvatar: '🏢',
              category: ((c as Record<string, unknown>).brand as Record<string, unknown>)?.industry || 'General',
              budget: Math.round(((c.budgetMax as number) || 0) / 100),
              pricingModel: 'CPM' as const,
              description: (c.description as string) || '',
              requirements: (c.deliverables as string[]) || [],
              platforms: [],
              deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              status: 'open' as const,
            }));
            setDiscoverCampaigns(mapped);
          }
        }

        // Fetch user's collaborations
        const collabRes = await fetch('/api/collaborations');
        if (collabRes.ok) {
          const data = await collabRes.json();
          if (data.collaborations && data.collaborations.length > 0) {
            const statusMap: Record<string, Campaign['status']> = {
              APPLIED: 'applied',
              NEGOTIATING: 'applied',
              AGREED: 'approved',
              IN_PROGRESS: 'active',
              COMPLETED: 'completed',
              CANCELLED: 'completed',
            };
            const mapped: Campaign[] = data.collaborations.map((collab: Record<string, unknown>) => {
              const campaign = collab.campaign as Record<string, unknown>;
              const brand = campaign?.brand as Record<string, unknown>;
              const agreedPrice = collab.agreedPrice as number | null;
              const proposedPrice = collab.proposedPrice as number;
              const budgetCents = agreedPrice || proposedPrice || 0;
              return {
                id: collab.id,
                title: (campaign?.title as string) || '',
                brand: (brand?.companyName as string) || 'Unknown Brand',
                brandAvatar: '🏢',
                category: (brand?.industry as string) || 'General',
                budget: Math.round(budgetCents / 100),
                pricingModel: 'CPM' as const,
                description: (campaign?.description as string) || '',
                requirements: (collab.deliverables as string[]) || [],
                platforms: [],
                deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                status: statusMap[(collab.status as string)] || 'applied',
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
              setProfileData({
                displayName: inf.handle || '',
                bio: inf.bio || '',
                category: inf.niche?.[0] || '',
                instagram: inf.instagramHandle || '',
                instagramFollowers: inf.instagramFollowers ? String(inf.instagramFollowers) : '',
                tiktok: inf.tiktokHandle || '',
                tiktokFollowers: inf.tiktokFollowers ? String(inf.tiktokFollowers) : '',
                twitter: '',
                youtube: inf.youtubeHandle || '',
                youtubeSubscribers: inf.youtubeSubscribers ? String(inf.youtubeSubscribers) : '',
                cpmMin: inf.pricePerPost ? String(inf.pricePerPost / 100) : '',
                cpmMax: '',
                cpcMin: inf.pricePerStory ? String(inf.pricePerStory / 100) : '',
                cpcMax: '',
                cpeMin: inf.pricePerVideo ? String(inf.pricePerVideo / 100) : '',
                cpeMax: '',
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
    fetchData();
  }, []);

  const categories = [
    "all",
    "Fashion & Style",
    "Technology",
    "Health & Fitness",
    "Beauty & Care",
    "Food & Beverage",
    "Travel",
    "Lifestyle",
    "Gaming",
    "Education",
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

  const getPricingLabel = (model: string) => {
    switch (model) {
      case "CPM":
        return "Cost Per 1000 Views";
      case "CPC":
        return "Cost Per Click";
      case "CPE":
        return "Cost Per Engagement";
      default:
        return model;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-blue-500/10 text-blue-600 border-blue-500/30";
      case "applied":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-500/30";
      case "approved":
        return "bg-green-500/10 text-green-600 border-green-500/30";
      case "active":
        return "bg-primary/10 text-primary border-primary/30";
      case "completed":
        return "bg-gray-500/10 text-gray-600 border-gray-500/30";
      default:
        return "";
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
      setApplySuccess("Application submitted successfully!");
      setApplyingCampaign(null);
      setProposedPrice("");
      setApplicationMessage("");
      // Refresh collaborations
      const collabRes = await fetch("/api/collaborations");
      if (collabRes.ok) {
        const collabData = await collabRes.json();
        if (collabData.collaborations && collabData.collaborations.length > 0) {
          const statusMap: Record<string, Campaign["status"]> = {
            APPLIED: "applied",
            NEGOTIATING: "applied",
            AGREED: "approved",
            IN_PROGRESS: "active",
            COMPLETED: "completed",
            CANCELLED: "completed",
          };
          const mapped: Campaign[] = collabData.collaborations.map((collab: Record<string, unknown>) => {
            const campaign = collab.campaign as Record<string, unknown>;
            const brand = campaign?.brand as Record<string, unknown>;
            const agreedPrice = collab.agreedPrice as number | null;
            const colProposedPrice = collab.proposedPrice as number;
            const budgetCents = agreedPrice || colProposedPrice || 0;
            return {
              id: collab.id,
              title: (campaign?.title as string) || "",
              brand: (brand?.companyName as string) || "Unknown Brand",
              brandAvatar: "🏢",
              category: (brand?.industry as string) || "General",
              budget: Math.round(budgetCents / 100),
              pricingModel: "CPM" as const,
              description: (campaign?.description as string) || "",
              requirements: (collab.deliverables as string[]) || [],
              platforms: [],
              deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
              status: statusMap[(collab.status as string)] || "applied",
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
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="sm" className="relative text-sm font-medium text-muted-foreground hover:bg-muted/50 hover:text-foreground">
                    <Bell className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-96 p-0" align="end" sideOffset={8}>
                  <div className="p-4 border-b">
                    <h3 className="font-semibold text-base">Notifications</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Stay updated with your campaigns
                    </p>
                  </div>
                  <div className="p-3">
                    <p className="text-sm text-muted-foreground text-center py-8">
                      No new notifications
                    </p>
                  </div>
                </PopoverContent>
              </Popover>

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
                <div>Total Earned: ${walletTotalEarned !== null ? walletTotalEarned.toLocaleString() : '0'}</div>
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
          {/* Moderation Status Banner */}
          {influencerStatus === 'PENDING' && (
            <div className="mb-4 rounded-xl border border-yellow-200 bg-yellow-50 p-4 flex items-start gap-3">
              <Clock className="h-5 w-5 text-yellow-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-yellow-800 text-sm">Profile Under Review</h4>
                <p className="text-yellow-700 text-xs mt-1">Your profile is being reviewed by our team. Once approved, you&apos;ll appear in the marketplace and can start receiving campaign offers. This usually takes 24-48 hours.</p>
              </div>
            </div>
          )}
          {influencerStatus === 'REJECTED' && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-red-800 text-sm">Profile Not Approved</h4>
                <p className="text-red-700 text-xs mt-1">Your profile was not approved. Please update your profile information and contact support@aiinflux.io for more details.</p>
              </div>
            </div>
          )}
          {influencerStatus === 'APPROVED' && activeTab === 'discover' && (
            <div className="mb-4 rounded-xl border border-green-200 bg-green-50 p-3 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
              <p className="text-green-700 text-xs">Your profile is live in the marketplace. Brands can find and contact you.</p>
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
                <h1 className="text-2xl sm:text-3xl font-bold mb-2">Discover Campaigns</h1>
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
                    <Card className="p-6 hover:shadow-lg transition-shadow">
                      <div className="flex gap-4">
                        {/* Brand Avatar */}
                        <div className="flex-shrink-0">
                          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center text-3xl">
                            {campaign.brandAvatar}
                          </div>
                        </div>

                        {/* Campaign Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <div className="flex-1 min-w-0">
                              <h3 className="text-xl font-bold mb-1">{campaign.title}</h3>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <span className="font-medium">{campaign.brand}</span>
                                <span>•</span>
                                <span>{campaign.category}</span>
                              </div>
                            </div>
                            <Badge className={`${getStatusColor(campaign.status)} shrink-0 px-3 py-1 border`}>
                              {campaign.status === "open" && "Open"}
                              {campaign.status === "applied" && "Applied"}
                              {campaign.status === "approved" && "Approved"}
                              {campaign.status === "active" && "Active"}
                            </Badge>
                          </div>

                          <p className="text-sm text-muted-foreground mb-3">{campaign.description}</p>

                          {/* Price and Deadline */}
                          <div className="flex items-center gap-6 mb-3 text-sm">
                            <div className="flex items-center gap-2">
                              <DollarSign className="h-4 w-4 text-primary" />
                              <span className="font-bold">${campaign.budget.toLocaleString()}</span>
                              <span className="text-muted-foreground">({campaign.pricingModel})</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Calendar className="h-4 w-4" />
                              <span>Deadline: {new Date(campaign.deadline).toLocaleDateString()}</span>
                            </div>
                          </div>

                          {/* Platforms */}
                          <div className="flex flex-wrap gap-2 mb-3">
                            {campaign.platforms.map((platform) => (
                              <Badge key={platform} className="bg-primary text-primary-foreground hover:bg-primary/90">
                                {platform}
                              </Badge>
                            ))}
                          </div>

                          {/* Requirements */}
                          <div className="mb-3">
                            <div className="text-xs font-medium text-muted-foreground mb-2">Requirements:</div>
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
                            {campaign.status === "open" && (
                              <>
                                <Button
                                  size="default"
                                  className="bg-primary/10 text-primary hover:bg-primary/20 border border-primary/30"
                                  onClick={() => setApplyingCampaign(campaign)}
                                >
                                  Apply Now
                                </Button>
                                <Button size="default" variant="outline" className="gap-2">
                                  <Heart className="h-4 w-4" />
                                  Save
                                </Button>
                              </>
                            )}
                            {campaign.status === "applied" && (
                              <Button size="default" variant="outline" disabled>
                                <Clock className="h-4 w-4 mr-2" />
                                Application Pending
                              </Button>
                            )}
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
                          className={
                            selectedCampaignDetails.status === "active"
                              ? "bg-success/10 text-success border-success/20"
                              : selectedCampaignDetails.status === "applied"
                              ? "bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
                              : selectedCampaignDetails.status === "approved"
                              ? "bg-primary/10 text-primary border-primary/20"
                              : "bg-muted text-muted-foreground border-border"
                          }
                        >
                          <div
                            className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                              selectedCampaignDetails.status === "active"
                                ? "bg-success"
                                : selectedCampaignDetails.status === "applied"
                                ? "bg-yellow-600"
                                : selectedCampaignDetails.status === "approved"
                                ? "bg-primary"
                                : "bg-muted-foreground"
                            }`}
                          />
                          {selectedCampaignDetails.status === "applied" && "Pending"}
                          {selectedCampaignDetails.status === "approved" && "Approved"}
                          {selectedCampaignDetails.status === "active" && "Active"}
                          {selectedCampaignDetails.status === "completed" && "Completed"}
                        </Badge>
                        <Badge variant="outline" className="bg-muted text-foreground border-border">
                          ${selectedCampaignDetails.budget.toLocaleString()} ({selectedCampaignDetails.pricingModel})
                        </Badge>
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
                                    {platform === "TikTok" && <TrendingUp className="h-3 w-3 mr-1" />}
                                    {platform === "YouTube" && <Youtube className="h-3 w-3 mr-1" />}
                                    {platform === "Twitter" && <Twitter className="h-3 w-3 mr-1" />}
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

                          {selectedCampaignDetails.status === "applied" ? (
                            <div className="space-y-4">
                              {/* Influencer Terms Input */}
                              <div className="space-y-2">
                                <Label className="text-sm font-medium">Your Terms (Optional)</Label>
                                <Textarea
                                  className="resize-none"
                                  placeholder="Add any specific terms or requirements for this collaboration..."
                                  value={selectedCampaignDetails.influencerTerms || ""}
                                  onChange={(e) => setSelectedCampaignDetails({
                                    ...selectedCampaignDetails,
                                    influencerTerms: e.target.value
                                  })}
                                  rows={3}
                                />
                              </div>

                              {/* Brand Terms (Read-only) */}
                              {selectedCampaignDetails.brandTerms && (
                                <div className="space-y-2">
                                  <Label className="text-sm font-medium">Brand Terms</Label>
                                  <div className="px-3 py-2 rounded-lg border border-border bg-muted/50 text-sm">
                                    {selectedCampaignDetails.brandTerms}
                                  </div>
                                </div>
                              )}

                              {/* Approval Status */}
                              <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                                <Clock className="h-5 w-5 text-yellow-600" />
                                <div>
                                  <p className="text-sm font-medium text-yellow-600">
                                    Waiting for Brand Approval
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    Your application is under review
                                  </p>
                                </div>
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
                                    Initial Payment Secured (25%)
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    ${(selectedCampaignDetails.budget * 0.25).toLocaleString()} held in escrow
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
                              selectedCampaignDetails.status === "active" ||
                              selectedCampaignDetails.status === "completed" ||
                              selectedCampaignDetails.contentApproved
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

                          {selectedCampaignDetails.status === "applied" ? (
                            <div className="text-center py-8 bg-muted/30 rounded-lg border border-dashed border-border">
                              <Clock className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                              <p className="text-sm text-muted-foreground">
                                Complete negotiation stage first
                              </p>
                            </div>
                          ) : !selectedCampaignDetails.contentApproved ? (
                            <div className="space-y-4">
                              {/* Content Link Input */}
                              <div className="space-y-2">
                                <Label className="text-sm font-medium">Submit Content Link</Label>
                                <p className="text-xs text-muted-foreground mb-2">
                                  Share a link to your content (Google Drive, Dropbox, etc.)
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
                                  <Button className="bg-gradient-to-r from-primary to-secondary">
                                    <Upload className="h-4 w-4 mr-2" />
                                    Submit
                                  </Button>
                                </div>
                              </div>

                              {selectedCampaignDetails.currentContentUrl && (
                                <div className="space-y-3">
                                  <div className="bg-background rounded-lg p-4 border border-border">
                                    <div className="flex items-center gap-2 mb-2">
                                      <LinkIcon className="h-4 w-4 text-primary" />
                                      <span className="text-sm font-medium">Submitted Content</span>
                                    </div>
                                    <a
                                      href={selectedCampaignDetails.currentContentUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-sm text-primary hover:underline break-all flex items-center gap-1"
                                    >
                                      {selectedCampaignDetails.currentContentUrl}
                                      <ExternalLink className="h-3 w-3" />
                                    </a>
                                  </div>

                                  <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                                    <Clock className="h-5 w-5 text-yellow-600" />
                                    <div>
                                      <p className="text-sm font-medium text-yellow-600">
                                        Waiting for Brand Review
                                      </p>
                                      <p className="text-xs text-muted-foreground">
                                        Brand will review and provide feedback
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="space-y-3">
                              <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-success/10 border border-success/20">
                                <CheckCircle2 className="h-5 w-5 text-success" />
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-success">Content Approved</p>
                                  <p className="text-xs text-muted-foreground">
                                    Brand has approved your content
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-primary/10 border border-primary/20">
                                <Wallet className="h-5 w-5 text-primary" />
                                <div>
                                  <p className="text-sm font-medium text-primary">
                                    Content Approval Payment (25%)
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    ${(selectedCampaignDetails.budget * 0.25).toLocaleString()} released
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Stage 3: Publication & Metrics */}
                      <div className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                              selectedCampaignDetails.publishedUrl
                                ? "bg-success text-success-foreground"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            3
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold mb-2">Publication & Metrics</h3>
                          <p className="text-sm text-muted-foreground mb-3">
                            Publish content and track performance metrics
                          </p>

                          {!selectedCampaignDetails.contentApproved ? (
                            <div className="text-center py-8 bg-muted/30 rounded-lg border border-dashed border-border">
                              <Clock className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                              <p className="text-sm text-muted-foreground mb-1">
                                Waiting for content approval
                              </p>
                              <p className="text-xs text-muted-foreground">
                                You can publish after brand approves your content
                              </p>
                            </div>
                          ) : !selectedCampaignDetails.publishedUrl ? (
                            <div className="space-y-4">
                              {/* Published Link Input */}
                              <div className="space-y-2">
                                <Label className="text-sm font-medium">Submit Published Content URL</Label>
                                <p className="text-xs text-muted-foreground mb-2">
                                  Share the link to your published content
                                </p>
                                <div className="flex gap-2">
                                  <div className="relative flex-1">
                                    <ExternalLink className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                      placeholder="https://instagram.com/p/..."
                                      value={publishedLinkInput}
                                      onChange={(e) => setPublishedLinkInput(e.target.value)}
                                      className="pl-10 h-11"
                                    />
                                  </div>
                                  <Button className="bg-gradient-to-r from-secondary to-primary">
                                    <Rocket className="h-4 w-4 mr-2" />
                                    Publish
                                  </Button>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-primary/10 border border-primary/20">
                                <Wallet className="h-5 w-5 text-primary" />
                                <div>
                                  <p className="text-sm font-medium text-primary">
                                    Publication Payment (50%)
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    ${(selectedCampaignDetails.budget * 0.5).toLocaleString()} will be released
                                    upon publication
                                  </p>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-3">
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

                              {/* Public Metrics */}
                              {selectedCampaignDetails.publicMetrics && (
                                <div className="bg-background rounded-lg p-4 border border-border">
                                  <div className="flex items-center justify-between mb-3">
                                    <h4 className="text-sm font-semibold">Performance Metrics</h4>
                                    <Badge variant="outline" className="text-xs">
                                      Live
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
                                  <p className="text-sm font-medium text-success">Campaign Active</p>
                                  <p className="text-xs text-muted-foreground">
                                    Tracking metrics until campaign end
                                  </p>
                                </div>
                              </div>
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
                    <h1 className="text-2xl sm:text-3xl font-bold mb-2">My Campaigns</h1>
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
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Desktop Table View */}
                  <div className="hidden lg:block border rounded-lg overflow-hidden">
                    {/* Table Header */}
                    <div className="flex items-center px-6 py-4 bg-muted/30 border-b">
                      <div className="w-[320px] text-xs font-semibold text-muted-foreground uppercase tracking-wide">Name</div>
                      <div className="w-[100px] text-xs font-semibold text-muted-foreground uppercase tracking-wide">Pricing</div>
                      <div className="w-[100px] text-xs font-semibold text-muted-foreground uppercase tracking-wide">Budget</div>
                      <div className="w-[120px] text-xs font-semibold text-muted-foreground uppercase tracking-wide">Received</div>
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
                          <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center shrink-0 text-2xl">
                            {campaign.brandAvatar}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="text-sm font-semibold mb-1.5 truncate">{campaign.title}</h3>
                            <div className="flex items-center gap-2">
                              <Badge
                                variant={campaign.status === "active" ? "default" : "secondary"}
                                className={`w-[80px] justify-center ${
                                  campaign.status === "active"
                                    ? "bg-success/10 text-success border-success/20 hover:bg-success/20"
                                    : campaign.status === "applied"
                                    ? "bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
                                    : campaign.status === "approved"
                                    ? "bg-primary/10 text-primary border-primary/20 hover:bg-primary/20"
                                    : "bg-muted text-muted-foreground border-border"
                                }`}
                              >
                                <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                                  campaign.status === "active" ? "bg-success" :
                                  campaign.status === "applied" ? "bg-yellow-600" :
                                  campaign.status === "approved" ? "bg-primary" : "bg-muted-foreground"
                                }`} />
                                {campaign.status === "applied" && "Pending"}
                                {campaign.status === "approved" && "Approved"}
                                {campaign.status === "active" && "Active"}
                                {campaign.status === "completed" && "Done"}
                              </Badge>
                              <span className="text-xs text-muted-foreground">{campaign.brand}</span>
                            </div>
                          </div>
                        </div>

                        {/* Pricing Column */}
                        <div className="w-[100px] flex items-center">
                          <div className="flex flex-wrap gap-1">
                            <div
                              className={`text-xs px-2 py-0.5 rounded-md font-medium ${
                                campaign.pricingModel === "CPM"
                                  ? "bg-primary/10 text-primary border border-primary/20"
                                  : campaign.pricingModel === "CPC"
                                  ? "bg-secondary/10 text-secondary border border-secondary/20"
                                  : "bg-muted text-foreground border border-border"
                              }`}
                            >
                              {campaign.pricingModel}
                            </div>
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
                              if (campaign.status === "applied") return "0";
                              if (campaign.status === "approved") return (campaign.budget * 0.25).toLocaleString();
                              if (campaign.status === "active") return (campaign.budget * 0.5).toLocaleString();
                              if (campaign.status === "completed") return campaign.budget.toLocaleString();
                              return "0";
                            })()}
                          </div>
                        </div>

                        {/* Status Column */}
                        <div className="flex-1">
                          <div className="text-sm text-muted-foreground">
                            Due: {new Date(campaign.deadline).toLocaleDateString()}
                          </div>
                        </div>

                        {/* Actions Column */}
                        <div className="w-[140px] flex items-center justify-end gap-2">
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                            <Eye className="h-4 w-4" />
                          </Button>
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
                          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0 text-xl">
                            {campaign.brandAvatar}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-semibold mb-1 leading-tight">{campaign.title}</h3>
                            <Badge
                              variant={campaign.status === "active" ? "default" : "secondary"}
                              className={`text-[10px] px-2 py-0 h-5 ${
                                campaign.status === "active"
                                  ? "bg-success/10 text-success border-success/20"
                                  : campaign.status === "applied"
                                  ? "bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
                                  : campaign.status === "approved"
                                  ? "bg-primary/10 text-primary border-primary/20"
                                  : "bg-muted text-muted-foreground border-border"
                              }`}
                            >
                              <div className={`w-1.5 h-1.5 rounded-full mr-1 ${
                                campaign.status === "active" ? "bg-success" :
                                campaign.status === "applied" ? "bg-yellow-600" :
                                campaign.status === "approved" ? "bg-primary" : "bg-muted-foreground"
                              }`} />
                              {campaign.status === "applied" && "Pending"}
                              {campaign.status === "approved" && "Approved"}
                              {campaign.status === "active" && "Active"}
                              {campaign.status === "completed" && "Done"}
                            </Badge>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <div className="text-muted-foreground mb-0.5">Pricing</div>
                            <div
                              className={`inline-block text-[10px] px-2 py-0.5 rounded-md font-medium ${
                                campaign.pricingModel === "CPM"
                                  ? "bg-primary/10 text-primary border border-primary/20"
                                  : campaign.pricingModel === "CPC"
                                  ? "bg-secondary/10 text-secondary border border-secondary/20"
                                  : "bg-muted text-foreground border border-border"
                              }`}
                            >
                              {campaign.pricingModel}
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
                                if (campaign.status === "applied") return "0";
                                if (campaign.status === "approved") return (campaign.budget * 0.25).toLocaleString();
                                if (campaign.status === "active") return (campaign.budget * 0.5).toLocaleString();
                                if (campaign.status === "completed") return campaign.budget.toLocaleString();
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
                <h1 className="text-2xl sm:text-3xl font-bold mb-2">Influencer Profile</h1>
                <p className="text-muted-foreground text-sm sm:text-base">Manage your public profile and portfolio</p>
              </div>

              <Card className="p-6 sm:p-8">
                <form className="space-y-5">
                  <div className="flex items-center gap-4 pb-5 border-b">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center overflow-hidden">
                      {avatarUrl ? (
                        <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
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
                        <SelectItem value="fashion">Fashion & Style</SelectItem>
                        <SelectItem value="beauty">Beauty & Care</SelectItem>
                        <SelectItem value="tech">Technology</SelectItem>
                        <SelectItem value="fitness">Health & Fitness</SelectItem>
                        <SelectItem value="lifestyle">Lifestyle</SelectItem>
                        <SelectItem value="food">Food & Beverage</SelectItem>
                        <SelectItem value="travel">Travel</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Social Media</Label>

                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Instagram URL or @handle"
                          value={profileData.instagram}
                          onChange={(e) => setProfileData(p => ({...p, instagram: e.target.value}))}
                          className="pl-10 h-11"
                        />
                      </div>
                      <Input
                        type="number"
                        placeholder="Followers"
                        value={profileData.instagramFollowers}
                        onChange={(e) => setProfileData(p => ({...p, instagramFollowers: e.target.value}))}
                        className="h-11 w-28"
                        min="0"
                      />
                    </div>

                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <TrendingUp className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="TikTok URL or @handle"
                          value={profileData.tiktok}
                          onChange={(e) => setProfileData(p => ({...p, tiktok: e.target.value}))}
                          className="pl-10 h-11"
                        />
                      </div>
                      <Input
                        type="number"
                        placeholder="Followers"
                        value={profileData.tiktokFollowers}
                        onChange={(e) => setProfileData(p => ({...p, tiktokFollowers: e.target.value}))}
                        className="h-11 w-28"
                        min="0"
                      />
                    </div>

                    <div className="relative">
                      <Twitter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="X URL or @handle"
                        value={profileData.twitter}
                        onChange={(e) => setProfileData(p => ({...p, twitter: e.target.value}))}
                        className="pl-10 h-11"
                      />
                    </div>

                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Youtube className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="YouTube URL or @channel"
                          value={profileData.youtube}
                          onChange={(e) => setProfileData(p => ({...p, youtube: e.target.value}))}
                          className="pl-10 h-11"
                        />
                      </div>
                      <Input
                        type="number"
                        placeholder="Subscribers"
                        value={profileData.youtubeSubscribers}
                        onChange={(e) => setProfileData(p => ({...p, youtubeSubscribers: e.target.value}))}
                        className="h-11 w-28"
                        min="0"
                      />
                    </div>
                  </div>

                  <div className="space-y-3 pt-2">
                    <Label className="text-sm font-medium">Pricing Range (USD)</Label>
                    <p className="text-xs text-muted-foreground">Set your minimum and maximum rates for different pricing models</p>

                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <Label className="text-xs font-medium mb-2 block">
                          CPM (Cost Per 1000 Views)
                        </Label>
                        <div className="flex items-center gap-3">
                          <div className="relative flex-1">
                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              type="number"
                              placeholder="Min"
                              value={profileData.cpmMin}
                              onChange={(e) => setProfileData(p => ({...p, cpmMin: e.target.value}))}
                              className="pl-10 h-11"
                              min="0"
                              step="0.01"
                            />
                          </div>
                          <span className="text-muted-foreground">-</span>
                          <div className="relative flex-1">
                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              type="number"
                              placeholder="Max"
                              value={profileData.cpmMax}
                              onChange={(e) => setProfileData(p => ({...p, cpmMax: e.target.value}))}
                              className="pl-10 h-11"
                              min="0"
                              step="0.01"
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <Label className="text-xs font-medium mb-2 block">
                          CPC (Cost Per Click)
                        </Label>
                        <div className="flex items-center gap-3">
                          <div className="relative flex-1">
                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              type="number"
                              placeholder="Min"
                              value={profileData.cpcMin}
                              onChange={(e) => setProfileData(p => ({...p, cpcMin: e.target.value}))}
                              className="pl-10 h-11"
                              min="0"
                              step="0.01"
                            />
                          </div>
                          <span className="text-muted-foreground">-</span>
                          <div className="relative flex-1">
                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              type="number"
                              placeholder="Max"
                              value={profileData.cpcMax}
                              onChange={(e) => setProfileData(p => ({...p, cpcMax: e.target.value}))}
                              className="pl-10 h-11"
                              min="0"
                              step="0.01"
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <Label className="text-xs font-medium mb-2 block">
                          CPE (Cost Per Engagement)
                        </Label>
                        <div className="flex items-center gap-3">
                          <div className="relative flex-1">
                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              type="number"
                              placeholder="Min"
                              value={profileData.cpeMin}
                              onChange={(e) => setProfileData(p => ({...p, cpeMin: e.target.value}))}
                              className="pl-10 h-11"
                              min="0"
                              step="0.01"
                            />
                          </div>
                          <span className="text-muted-foreground">-</span>
                          <div className="relative flex-1">
                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              type="number"
                              placeholder="Max"
                              value={profileData.cpeMax}
                              onChange={(e) => setProfileData(p => ({...p, cpeMax: e.target.value}))}
                              className="pl-10 h-11"
                              min="0"
                              step="0.01"
                            />
                          </div>
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
                              tiktokHandle: profileData.tiktok,
                              tiktokFollowers: profileData.tiktokFollowers ? parseInt(profileData.tiktokFollowers) : 0,
                              youtubeHandle: profileData.youtube,
                              youtubeSubscribers: profileData.youtubeSubscribers ? parseInt(profileData.youtubeSubscribers) : 0,
                              pricePerPost: profileData.cpmMin ? parseFloat(profileData.cpmMin) : undefined,
                              pricePerStory: profileData.cpcMin ? parseFloat(profileData.cpcMin) : undefined,
                              pricePerVideo: profileData.cpeMin ? parseFloat(profileData.cpeMin) : undefined,
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
                <h1 className="text-2xl sm:text-3xl font-bold mb-2">Settings</h1>
                <p className="text-muted-foreground text-sm sm:text-base">
                  Manage your account preferences
                </p>
              </div>

              <div className="space-y-6">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Account Settings</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" defaultValue="" placeholder="your@email.com" />
                    </div>
                    <div>
                      <Label htmlFor="password">Password</Label>
                      <Input id="password" type="password" placeholder="••••••••" />
                    </div>
                    <Button>Update Account</Button>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Notifications</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Campaign Invitations</div>
                        <div className="text-sm text-muted-foreground">
                          Get notified when brands invite you
                        </div>
                      </div>
                      <input type="checkbox" defaultChecked className="rounded" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Application Updates</div>
                        <div className="text-sm text-muted-foreground">
                          Updates on your campaign applications
                        </div>
                      </div>
                      <input type="checkbox" defaultChecked className="rounded" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Payment Notifications</div>
                        <div className="text-sm text-muted-foreground">
                          Get notified about payments
                        </div>
                      </div>
                      <input type="checkbox" defaultChecked className="rounded" />
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Payment Settings</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="payment-method">Payment Method</Label>
                      <Select defaultValue="bank">
                        <SelectTrigger id="payment-method">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bank">Bank Transfer</SelectItem>
                          <SelectItem value="paypal">PayPal</SelectItem>
                          <SelectItem value="crypto">Cryptocurrency</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button variant="outline">Manage Payment Methods</Button>
                  </div>
                </Card>
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
            <p className="text-sm text-muted-foreground mb-4">{applyingCampaign.title}</p>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Your Price ($)</label>
                <input
                  type="number"
                  value={proposedPrice}
                  onChange={(e) => setProposedPrice(e.target.value)}
                  placeholder="Enter your price"
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Message (optional)</label>
                <textarea
                  value={applicationMessage}
                  onChange={(e) => setApplicationMessage(e.target.value)}
                  placeholder="Why you're a great fit..."
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
