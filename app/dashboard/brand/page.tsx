"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { NetworkLogo } from "@/components/logo";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  Users,
  Sparkles,
  Building2,
  Globe,
  Instagram,
  Twitter,
  Linkedin,
  Plus,
  BarChart3,
  Target,
  Calendar,
  DollarSign,
  TrendingUp,
  Settings,
  LogOut,
  Camera,
  Save,
  X,
  CheckCircle2,
  Clock,
  Eye,
  Heart,
  MessageCircle,
  Wallet,
  CreditCard,
  Bitcoin,
  Bell,
  ChevronDown,
  Video,
  Youtube,
  Rocket,
  Copy,
  Check as CheckIcon,
  ArrowRight,
  MessageSquare,
  Package,
  BookOpen,
  Briefcase,
  Pencil,
  Pause,
  Trash2,
  AlertCircle,
  ExternalLink,
} from "lucide-react";

type Tab = "discover" | "campaigns" | "profile" | "create-campaign" | "settings";

interface Notification {
  id: number;
  type: "invitation_accepted" | "campaign_application";
  influencerName: string;
  campaignTitle: string;
  timestamp: string;
  read: boolean;
}

interface Influencer {
  id: number;
  name: string;
  username: string;
  avatar: string;
  followers: string;
  engagement: string;
  category: string;
  rate: string;
  verified: boolean;
  gender: string;
  ethnicity: string;
  age: string;
  pricingCPM?: string;
  pricingCPC?: string;
  pricingCPE?: string;
}

interface ContentRevision {
  id: number;
  version: number;
  contentUrl: string;
  submittedAt: string;
  brandFeedback?: string;
  feedbackAt?: string;
}

interface PublicMetrics {
  views?: number;
  likes?: number;
  comments?: number;
  shares?: number;
  lastUpdated?: string;
}

interface InsightsScreenshot {
  id: number;
  metricType: "impressions" | "reach" | "saves" | "profile_visits";
  screenshotUrl: string;
  value: number;
  submittedAt: string;
  verified?: boolean;
}

interface CampaignApplication {
  id: number;
  influencerId: number;
  influencerName: string;
  influencerUsername: string;
  influencerAvatar: string;
  influencerFollowers: string;
  source: "applied" | "invited";
  status: "pending" | "approved" | "rejected";
  proposedPriceCPM?: string;
  proposedPriceCPC?: string;
  proposedPriceCPE?: string;
  message?: string;
  appliedAt: string;

  // Negotiation terms (for approved applications)
  brandTerms?: string;
  influencerTerms?: string;
  influencerApprovedTerms?: boolean;
  brandApprovedTerms?: boolean;
  fundsVerified?: boolean;

  // Content creation and approval
  contentRevisions?: ContentRevision[];
  currentContentUrl?: string;
  contentApproved?: boolean;
  contentApprovedAt?: string;

  // Payment tracking
  initialPaymentSent?: boolean; // 25% after negotiation
  contentApprovalPaymentSent?: boolean; // 25% after content approval
  finalPaymentSent?: boolean; // 50% after metrics reached

  // Publication and metrics
  publishedUrl?: string;
  publishedAt?: string;
  publicMetrics?: PublicMetrics;
  insightsScreenshots?: InsightsScreenshot[];
  metricsTargetReached?: boolean;
  metricsVerifiedAt?: string;
}

interface Campaign {
  id: number;
  title: string;
  status: "active" | "draft";
  budgetMin: string;
  budgetMax: string;
  applications: number;
  applicationsList?: CampaignApplication[];
  startDate: string;
  endDate: string;
  influencerCount: string;
  description: string;
  goal: string;
  platforms: string[];
  contentFormats: string[];
  pricingModels: string[];
  targetViews?: string;
  targetClicks?: string;
  targetEngagements?: string;
  contentType: string;
  influencerNiches: string[];
  productName: string;
  productPrice: string;
  productPhoto: string;
  productLink: string;
  productDescription: string;
  brandTag: string;
  hashtags: string;
  creatorScript: string;
  detailedRequirements: string;
  createdAt: string;
  currentStage?: number; // 1: Negotiation, 2: Content Approval, 3: Publication & Metrics
}

interface CampaignInfluencer {
  id: number;
  name: string;
  username: string;
  avatar: string;
  status: "invited" | "applied" | "approved";

  // Timeline stage for approved influencers
  timelineStage?: 1 | 2 | 3 | 4;

  // Checkpoint 1: Discussion/Negotiation
  proposedPrice?: number;
  proposedPricingModel?: "CPM" | "CPC" | "CPE";
  brandApprovedPrice?: boolean;
  brandCounterPrice?: number;
  influencerApprovedCounter?: boolean;
  targetMetrics?: { views?: number; clicks?: number; conversions?: number; engagements?: number };
  metricsApproved?: boolean;

  // Content planning
  contentFormats?: string[]; // e.g., ["Instagram Reel", "TikTok Video"]
  contentBrief?: string;
  videoLength?: number; // in seconds
  contentPlanApproved?: boolean;

  brandReadyToStart?: boolean;
  influencerReadyToStart?: boolean;

  // Checkpoint 2: Content Draft
  draftSubmitted?: boolean;
  draftUrl?: string;

  // Checkpoint 3: Revisions
  revisionCount?: number;
  currentDraftUrl?: string;
  brandApprovedDraft?: boolean;
  influencerApprovedDraft?: boolean;

  // Checkpoint 4: Published
  publishedUrl?: string;
  metricsDelivered?: boolean;
  targetMetricsReached?: boolean;

  // Payment tracking
  payment25Sent?: boolean;
  payment50Sent?: boolean;
  payment75Sent?: boolean;
  payment100Sent?: boolean;
}

// Minimum market rates for pricing models
const PRICING_MIN_RATES = {
  CPM: 2.5,   // Minimum CPM rate (e.g., Russia Instagram)
  CPC: 0.5,   // Minimum CPC rate
  CPE: 0.1,   // Minimum CPE rate
} as const;

const mockInfluencers: Influencer[] = [
  {
    id: 1,
    name: "Luna Virtual",
    username: "@lunavirtual",
    avatar: "🌙",
    followers: "2.5M",
    engagement: "8.5%",
    category: "Fashion & Style",
    rate: "$35",
    verified: true,
    gender: "Female",
    ethnicity: "Asian",
    age: "Young Adult",
    pricingCPM: "45",
    pricingCPC: "12",
    pricingCPE: "8",
  },
  {
    id: 2,
    name: "Alex AI",
    username: "@alexai",
    avatar: "⚡",
    followers: "1.8M",
    engagement: "6.2%",
    category: "Tech & Gaming",
    rate: "$28",
    verified: true,
    gender: "Male",
    ethnicity: "White",
    age: "Adult",
    pricingCPM: "38",
    pricingCPC: "10",
    pricingCPE: "6",
  },
  {
    id: 3,
    name: "Sophia Digital",
    username: "@sophiadigital",
    avatar: "✨",
    followers: "3.2M",
    engagement: "9.1%",
    category: "Lifestyle",
    rate: "$42",
    verified: true,
    gender: "Female",
    ethnicity: "Black",
    age: "Young Adult",
    pricingCPM: "52",
    pricingCPC: "15",
    pricingCPE: "10",
  },
  {
    id: 4,
    name: "Nova Star",
    username: "@novastar",
    avatar: "⭐",
    followers: "950K",
    engagement: "7.8%",
    category: "Sports & Fitness",
    rate: "$22",
    verified: false,
    gender: "Non-binary",
    ethnicity: "Hispanic",
    age: "Adult",
    pricingCPM: "30",
    pricingCPC: "8",
    pricingCPE: "5",
  },
];

const mockCampaigns: Campaign[] = [
  {
    id: 1,
    title: "Summer Collection Launch",
    status: "active",
    budgetMin: "2000",
    budgetMax: "3000",
    applications: 24,
    applicationsList: [
      {
        id: 1,
        influencerId: 1,
        influencerName: "Luna Virtual",
        influencerUsername: "@lunavirtual",
        influencerAvatar: "🌙",
        influencerFollowers: "2.5M",
        source: "applied",
        status: "pending",
        proposedPriceCPM: "48",
        proposedPriceCPE: "9",
        message: "I love your summer collection! My audience would be perfect for this campaign.",
        appliedAt: "2026-03-01T10:30:00Z",
      },
      {
        id: 2,
        influencerId: 3,
        influencerName: "Sophia Digital",
        influencerUsername: "@sophiadigital",
        influencerAvatar: "✨",
        influencerFollowers: "3.2M",
        source: "invited",
        status: "approved",
        proposedPriceCPM: "55",
        proposedPriceCPE: "11",
        message: "Thanks for the invitation! I'd be happy to collaborate.",
        appliedAt: "2026-03-02T14:20:00Z",
        brandTerms: "",
        influencerTerms: "",
        influencerApprovedTerms: false,
        brandApprovedTerms: false,
        fundsVerified: false,
        contentRevisions: [
          {
            id: 1,
            version: 2,
            contentUrl: "https://instagram.com/p/sophia-summer-v2",
            submittedAt: "2026-03-09T14:15:00Z",
          },
          {
            id: 2,
            version: 1,
            contentUrl: "https://instagram.com/p/sophia-summer-v1",
            submittedAt: "2026-03-07T10:00:00Z",
            brandFeedback: "Love the energy and styling! Could you add a close-up shot of the product label? Otherwise perfect!",
            feedbackAt: "2026-03-07T16:20:00Z",
          },
        ],
        currentContentUrl: "https://instagram.com/p/sophia-summer-v2",
        contentApproved: true,
        contentApprovedAt: "2026-03-09T18:30:00Z",
        contentApprovalPaymentSent: true,
        publishedUrl: "https://www.instagram.com/p/DBcXyZ123/",
        publishedAt: "2026-03-10T14:00:00Z",
        publicMetrics: {
          views: 485000,
          likes: 23400,
          comments: 1250,
          shares: 890,
          lastUpdated: "2026-03-12T08:00:00Z",
        },
        insightsScreenshots: [
          {
            id: 1,
            metricType: "impressions",
            screenshotUrl: "https://drive.google.com/file/d/insights-impressions",
            value: 520000,
            submittedAt: "2026-03-11T16:30:00Z",
            verified: true,
          },
          {
            id: 2,
            metricType: "reach",
            screenshotUrl: "https://drive.google.com/file/d/insights-reach",
            value: 410000,
            submittedAt: "2026-03-11T16:30:00Z",
            verified: true,
          },
        ],
        metricsTargetReached: false,
      },
      {
        id: 3,
        influencerId: 2,
        influencerName: "Alex AI",
        influencerUsername: "@alexai",
        influencerAvatar: "⚡",
        influencerFollowers: "1.8M",
        source: "applied",
        status: "approved",
        proposedPriceCPM: "40",
        proposedPriceCPE: "7",
        message: "Excited to work with your brand!",
        appliedAt: "2026-02-28T09:15:00Z",
        brandTerms: "Please ensure content is posted during peak hours (6-8 PM EST)",
        influencerTerms: "I'll need 2 days for content creation and approval",
        influencerApprovedTerms: true,
        brandApprovedTerms: false,
        fundsVerified: false,
        contentRevisions: [
          {
            id: 1,
            version: 3,
            contentUrl: "https://instagram.com/p/example-v3",
            submittedAt: "2026-03-10T16:30:00Z",
          },
          {
            id: 2,
            version: 2,
            contentUrl: "https://instagram.com/p/example-v2",
            submittedAt: "2026-03-08T11:20:00Z",
            brandFeedback: "Great improvements! Could you adjust the lighting a bit more and add our brand hashtag in the caption?",
            feedbackAt: "2026-03-08T14:45:00Z",
          },
          {
            id: 3,
            version: 1,
            contentUrl: "https://instagram.com/p/example-v1",
            submittedAt: "2026-03-05T09:15:00Z",
            brandFeedback: "Good start! The content looks good but please showcase the product more prominently and mention the key features we discussed.",
            feedbackAt: "2026-03-06T10:30:00Z",
          },
        ],
        currentContentUrl: "https://instagram.com/p/example-v3",
        contentApproved: false,
      },
      {
        id: 4,
        influencerId: 4,
        influencerName: "Nova Star",
        influencerUsername: "@novastar",
        influencerAvatar: "⭐",
        influencerFollowers: "950K",
        source: "applied",
        status: "pending",
        proposedPriceCPM: "32",
        proposedPriceCPE: "6",
        appliedAt: "2026-03-03T16:45:00Z",
      },
    ],
    startDate: "2026-03-15",
    endDate: "2026-04-30",
    influencerCount: "5",
    description: "Promote our new summer collection with vibrant colors and beach vibes",
    goal: "brand-awareness",
    platforms: ["instagram", "tiktok"],
    contentFormats: ["instagram-reel", "instagram-post", "instagram-story"],
    pricingModels: ["cpm", "cpe"],
    targetViews: "500000",
    targetEngagements: "25000",
    contentType: "up-to-creator",
    influencerNiches: ["Fashion & Apparel", "Lifestyle"],
    productName: "Summer Collection 2026",
    productPrice: "199",
    productPhoto: "https://example.com/product.jpg",
    productLink: "https://example.com/summer-collection",
    productDescription: "Our vibrant summer collection featuring breathable fabrics and bold colors.",
    brandTag: "@mybrand",
    hashtags: "#SummerCollection #Fashion2026",
    creatorScript: "Share your favorite piece from our new summer collection!",
    detailedRequirements: "Focus on vibrant colors and beach vibes. Show the clothes in action.",
    createdAt: "2026-02-15T10:00:00Z",
    currentStage: 2,
  },
  {
    id: 2,
    title: "Tech Product Review",
    status: "active",
    budgetMin: "1700",
    budgetMax: "2700",
    applications: 12,
    applicationsList: [
      {
        id: 5,
        influencerId: 2,
        influencerName: "Alex AI",
        influencerUsername: "@alexai",
        influencerAvatar: "⚡",
        influencerFollowers: "1.8M",
        source: "applied",
        status: "pending",
        proposedPriceCPC: "11",
        message: "Perfect fit for my tech-focused audience!",
        appliedAt: "2026-03-10T11:20:00Z",
      },
      {
        id: 6,
        influencerId: 4,
        influencerName: "Nova Star",
        influencerUsername: "@novastar",
        influencerAvatar: "⭐",
        influencerFollowers: "950K",
        source: "invited",
        status: "pending",
        proposedPriceCPC: "9",
        appliedAt: "2026-03-11T15:30:00Z",
      },
    ],
    startDate: "2026-04-01",
    endDate: "2026-05-15",
    influencerCount: "3",
    description: "Looking for tech influencers to review our latest gadget",
    goal: "engagement",
    platforms: ["youtube", "instagram"],
    contentFormats: ["youtube-video", "instagram-post"],
    pricingModels: ["cpc"],
    targetClicks: "3000",
    contentType: "testimonial",
    influencerNiches: ["Tech & Gaming"],
    productName: "SmartWatch Pro",
    productPrice: "299",
    productPhoto: "",
    productLink: "",
    productDescription: "Latest smartwatch with health tracking features",
    brandTag: "@techbrand",
    hashtags: "#TechReview #SmartWatch",
    creatorScript: "",
    detailedRequirements: "",
    createdAt: "2026-02-20T14:30:00Z",
    currentStage: 1,
  },
  {
    id: 3,
    title: "Fitness Challenge",
    status: "draft",
    budgetMin: "2000",
    budgetMax: "3000",
    applications: 8,
    startDate: "2026-05-01",
    endDate: "2026-06-30",
    influencerCount: "4",
    description: "30-day fitness challenge with our new workout app",
    goal: "conversions",
    platforms: ["instagram", "tiktok", "youtube"],
    contentFormats: ["instagram-reel", "tiktok-video", "youtube-short"],
    pricingModels: ["cpe"],
    contentType: "up-to-creator",
    influencerNiches: ["Sports & Fitness", "Health & Wellness"],
    productName: "FitPro App",
    productPrice: "9.99/month",
    productPhoto: "",
    productLink: "https://fitpro.app",
    productDescription: "All-in-one fitness tracking and workout planning app",
    brandTag: "@fitpro",
    hashtags: "#FitnessChallenge #FitPro",
    creatorScript: "Join our 30-day fitness challenge!",
    detailedRequirements: "Show workout progress and app features",
    createdAt: "2026-03-01T09:00:00Z",
    currentStage: 1,
  },
];

const mockCampaignInfluencers: Record<number, CampaignInfluencer[]> = {
  1: [
    // Invited
    { id: 1, name: "Luna Virtual", username: "@lunavirtual", avatar: "🌙", status: "invited" },
    { id: 2, name: "Alex AI", username: "@alexai", avatar: "⚡", status: "invited" },
    // Applied
    { id: 3, name: "Nova Star", username: "@novastar", avatar: "⭐", status: "applied" },
    { id: 4, name: "Sophia Digital", username: "@sophiadigital", avatar: "✨", status: "applied" },
    // Approved - Different stages
    {
      id: 5,
      name: "Luna Virtual",
      username: "@lunavirtual",
      avatar: "🌙",
      status: "approved",
      timelineStage: 4,
      proposedPrice: 25,
      proposedPricingModel: "CPM",
      brandApprovedPrice: true,
      targetMetrics: { views: 50000 },
      metricsApproved: true,
      contentFormats: ["Instagram Reel"],
      contentBrief: "Create an engaging reel showcasing our summer collection. Focus on vibrant colors and beach vibes. Show the clothes in action - dancing, walking on the beach, having fun.",
      videoLength: 30,
      contentPlanApproved: true,
      brandReadyToStart: true,
      influencerReadyToStart: true,
      payment25Sent: true,
      draftSubmitted: true,
      draftUrl: "https://example.com/drafts/luna-summer-reel-v1.mp4",
      payment50Sent: true,
      revisionCount: 2,
      currentDraftUrl: "https://example.com/drafts/luna-summer-reel-v3.mp4",
      brandApprovedDraft: true,
      influencerApprovedDraft: true,
      payment75Sent: true,
      publishedUrl: "https://instagram.com/lunavirtual/reel/summer-collection-2026",
      targetMetricsReached: true,
      payment100Sent: true,
    },
    {
      id: 6,
      name: "Sophia Digital",
      username: "@sophiadigital",
      avatar: "✨",
      status: "approved",
      timelineStage: 1,
      proposedPrice: 0.85,
      proposedPricingModel: "CPE",
      brandApprovedPrice: undefined,
      targetMetrics: { engagements: 10000 },
      metricsApproved: false,
      contentFormats: ["Reels", "Posts", "Stories"],
      contentBrief: "Create an engaging reel showcasing our summer collection. Focus on vibrant colors and beach vibes. Show the clothes in action - dancing, walking on the beach, having fun.",
      videoLength: 30,
      contentPlanApproved: undefined,
      brandReadyToStart: false,
      influencerReadyToStart: false,
      payment25Sent: false,
      draftSubmitted: undefined,
      draftUrl: "",
      payment50Sent: false,
      revisionCount: 0,
      currentDraftUrl: "",
      brandApprovedDraft: undefined,
      influencerApprovedDraft: false,
      payment75Sent: false,
      publishedUrl: "",
      targetMetricsReached: false,
      payment100Sent: false,
    },
  ],
  2: [
    { id: 7, name: "Alex AI", username: "@alexai", avatar: "⚡", status: "invited" },
    { id: 8, name: "Nova Star", username: "@novastar", avatar: "⭐", status: "applied" },
  ],
};

const mockNotifications: Notification[] = [
  {
    id: 1,
    type: "invitation_accepted",
    influencerName: "Luna Virtual",
    campaignTitle: "Summer Collection Launch",
    timestamp: "2 hours ago",
    read: false,
  },
  {
    id: 2,
    type: "campaign_application",
    influencerName: "Alex AI",
    campaignTitle: "Brand Awareness Campaign",
    timestamp: "5 hours ago",
    read: false,
  },
  {
    id: 3,
    type: "invitation_accepted",
    influencerName: "Sophia Digital",
    campaignTitle: "Summer Collection Launch",
    timestamp: "1 day ago",
    read: true,
  },
];

export default function BrandDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("discover");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedFollowers, setSelectedFollowers] = useState("all");
  const [selectedEngagement, setSelectedEngagement] = useState("all");
  const [selectedGender, setSelectedGender] = useState("all");
  const [selectedEthnicity, setSelectedEthnicity] = useState("all");
  const [selectedAge, setSelectedAge] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  const [companyName, setCompanyName] = useState("Your Company");
  const [companyBio, setCompanyBio] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("");
  const [twitterUrl, setTwitterUrl] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [companyCountry, setCompanyCountry] = useState("United States");
  const [companyIndustry, setCompanyIndustry] = useState("Fashion & Style");

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
  const [pricingWarnings, setPricingWarnings] = useState<{
    cpm?: boolean;
    cpc?: boolean;
    cpe?: boolean;
  }>({});
  const [campaignBrandTag, setCampaignBrandTag] = useState("");
  const [campaignHashtags, setCampaignHashtags] = useState("");
  const [campaignCreatorScript, setCampaignCreatorScript] = useState("");
  const [campaignDetailedRequirements, setCampaignDetailedRequirements] = useState("");
  const [campaignProductName, setCampaignProductName] = useState("");
  const [campaignProductPrice, setCampaignProductPrice] = useState("");
  const [campaignProductPhoto, setCampaignProductPhoto] = useState("");
  const [campaignProductLink, setCampaignProductLink] = useState("");
  const [campaignProductDescription, setCampaignProductDescription] = useState("");

  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedCampaignDetails, setSelectedCampaignDetails] = useState<Campaign | null>(null);
  const [campaignSearchQuery, setCampaignSearchQuery] = useState("");
  const [campaignStatusFilter, setCampaignStatusFilter] = useState<"all" | "active" | "draft">("all");
  const [isCampaignDetailsExpanded, setIsCampaignDetailsExpanded] = useState(false);
  const [isApplicationsExpanded, setIsApplicationsExpanded] = useState(false);
  const [isEditingCampaign, setIsEditingCampaign] = useState(false);
  const [editedCampaignData, setEditedCampaignData] = useState<Campaign | null>(null);
  const [selectedInfluencerForPipeline, setSelectedInfluencerForPipeline] = useState<CampaignApplication | null>(null);
  const [showInfluencerSelector, setShowInfluencerSelector] = useState(false);
  const [showInsufficientFundsDialog, setShowInsufficientFundsDialog] = useState(false);
  const [brandFeedbackText, setBrandFeedbackText] = useState("");

  const [balance, setBalance] = useState(0);
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [topUpMethod, setTopUpMethod] = useState<"card" | "crypto" | null>(null);
  const [topUpAmount, setTopUpAmount] = useState("");
  const [selectedCrypto, setSelectedCrypto] = useState("");
  const [selectedNetwork, setSelectedNetwork] = useState("");
  const [copiedAddress, setCopiedAddress] = useState(false);

  const [showCollaborateModal, setShowCollaborateModal] = useState(false);
  const [selectedInfluencer, setSelectedInfluencer] = useState<Influencer | null>(null);
  const [selectedCampaignId, setSelectedCampaignId] = useState<number | null>(null);

  const [influencers, setInfluencers] = useState<Influencer[]>([]);

  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const [expandedCampaignId, setExpandedCampaignId] = useState<number | null>(null);
  const [showApplicationsList, setShowApplicationsList] = useState<Record<number, boolean>>({});
  const [showApprovedList, setShowApprovedList] = useState<Record<number, boolean>>({});
  const [expandedInfluencerId, setExpandedInfluencerId] = useState<number | null>(null);
  const [expandedCheckpoints, setExpandedCheckpoints] = useState<Record<string, boolean>>({});
  const [brandProposedMetrics, setBrandProposedMetrics] = useState<Record<number, { views?: number; clicks?: number; engagements?: number; conversions?: number }>>({});
  const [editingCampaignId, setEditingCampaignId] = useState<number | null>(null);
  const [editedCampaign, setEditedCampaign] = useState<Campaign | null>(null);
  const [showInfluencerDetails, setShowInfluencerDetails] = useState(false);
  const [selectedInfluencerDetails, setSelectedInfluencerDetails] = useState<CampaignInfluencer | null>(null);
  const [showCounterOfferModal, setShowCounterOfferModal] = useState(false);
  const [counterOfferInfluencer, setCounterOfferInfluencer] = useState<CampaignInfluencer | null>(null);
  const [counterOfferPrice, setCounterOfferPrice] = useState("");
  const [contentBriefs, setContentBriefs] = useState<Record<number, string>>({});
  const [videoLengths, setVideoLengths] = useState<Record<number, number>>({});
  const [brandConfirmsStart, setBrandConfirmsStart] = useState<Record<number, boolean>>({});
  const [brandApprovesDraft, setBrandApprovesDraft] = useState<Record<number, boolean>>({});
  const [revisionNotes, setRevisionNotes] = useState<Record<number, string>>({});
  const [openCheckpoint, setOpenCheckpoint] = useState<Record<number, number>>({});

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
    };

    fetchData();
  }, []);

  const categories = [
    "all",
    "Beauty & Care",
    "Fashion & Style",
    "Tech & Gaming",
    "Health & Wellness",
    "Sports & Fitness",
    "Food & Drinks",
    "Travel",
    "Lifestyle",
    "Business & Finance",
    "Music",
    "Art & Design",
    "Photography",
    "Home & Garden",
    "Pets",
    "Kids & Parenting",
    "Skincare",
    "Makeup",
    "Other"
  ];

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
              <Popover open={showNotifications} onOpenChange={setShowNotifications}>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="sm" className="relative text-sm font-medium text-muted-foreground hover:bg-muted/50 hover:text-foreground">
                    <Bell className="h-4 w-4" />
                    {notifications.filter(n => !n.read).length > 0 && (
                      <span className="absolute -top-1 -right-1 h-4 w-4 bg-primary text-primary-foreground text-[10px] font-semibold rounded-full flex items-center justify-center">
                        {notifications.filter(n => !n.read).length}
                      </span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-96 p-0" align="end" sideOffset={8}>
                  <div className="p-4 border-b">
                    <h3 className="font-semibold text-base">Notifications</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Stay updated with your campaigns
                    </p>
                  </div>

                  <div className="space-y-2 max-h-[400px] overflow-y-auto p-3">
                    {notifications.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-8">
                        No notifications yet
                      </p>
                    ) : (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-3 rounded-lg border ${
                            notification.read
                              ? "border-border bg-muted/20"
                              : "border-primary/30 bg-primary/5"
                          }`}
                        >
                          <div className="flex items-start justify-between mb-1.5">
                            <div className="flex-1 pr-2">
                              {notification.type === "invitation_accepted" ? (
                                <p className="text-xs leading-relaxed">
                                  <span className="font-semibold text-primary">{notification.influencerName}</span>
                                  {" "}accepted your invite for{" "}
                                  <span className="font-medium">{notification.campaignTitle}</span>
                                </p>
                              ) : (
                                <p className="text-xs leading-relaxed">
                                  <span className="font-semibold text-primary">{notification.influencerName}</span>
                                  {" "}applied to{" "}
                                  <span className="font-medium">{notification.campaignTitle}</span>
                                </p>
                              )}
                            </div>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-primary rounded-full shrink-0 mt-1"></div>
                            )}
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] text-muted-foreground">{notification.timestamp}</span>
                            {!notification.read && (
                              <button
                                onClick={() => {
                                  setNotifications(notifications.map(n =>
                                    n.id === notification.id ? { ...n, read: true } : n
                                  ));
                                }}
                                className="text-[10px] text-primary hover:underline"
                              >
                                Mark as read
                              </button>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {notifications.length > 0 && (
                    <div className="p-3 border-t flex items-center justify-between gap-2">
                      {notifications.filter(n => !n.read).length > 0 && (
                        <button
                          onClick={() => {
                            setNotifications(notifications.map(n => ({ ...n, read: true })));
                          }}
                          className="flex-1 text-xs text-center text-primary hover:underline"
                        >
                          Mark all as read
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setNotifications([]);
                        }}
                        className="flex-1 text-xs text-center text-muted-foreground hover:text-destructive hover:underline"
                      >
                        Clear all
                      </button>
                    </div>
                  )}
                </PopoverContent>
              </Popover>

              <Button variant="ghost" size="sm" asChild className="text-sm font-medium text-muted-foreground hover:bg-muted/50 hover:text-foreground">
                <Link href="/login">
                  <LogOut className="h-4 w-4" />
                </Link>
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
            <Dialog open={showTopUpModal} onOpenChange={setShowTopUpModal}>
              <DialogTrigger asChild>
                <button className="w-full p-4 rounded-xl bg-primary/10 border-2 border-primary/30 hover:bg-primary/15 hover:border-primary/40 transition-all mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Wallet className="h-4 w-4 text-primary" />
                      <span className="text-xs font-medium text-muted-foreground">Balance</span>
                    </div>
                    <Plus className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <div className="text-2xl font-bold text-primary text-left">
                    ${balance.toFixed(2)}
                  </div>
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Top Up Balance</DialogTitle>
                  <DialogDescription>
                    Add funds to your account to start campaigns
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                  {/* Amount Input */}
                  <div>
                    <Label htmlFor="amount-sidebar" className="text-sm font-medium mb-2 block">
                      Amount (USD)
                    </Label>
                    <Input
                      id="amount-sidebar"
                      type="number"
                      placeholder="0.00"
                      value={topUpAmount}
                      onChange={(e) => setTopUpAmount(e.target.value)}
                      className="h-11"
                    />
                  </div>

                  {/* Payment Method Selection */}
                  <div>
                    <Label className="text-sm font-medium mb-3 block">
                      Payment Method
                    </Label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setTopUpMethod("crypto")}
                        className={`relative p-4 rounded-xl border-2 text-left transition-all ${
                          topUpMethod === "crypto"
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <Bitcoin className={`h-5 w-5 mb-2 ${topUpMethod === "crypto" ? "text-primary" : "text-muted-foreground"}`} />
                        <div className="text-sm font-medium">Crypto</div>
                        <div className="text-xs text-muted-foreground">Any crypto accepted</div>
                      </button>

                      <button
                        disabled
                        className="relative p-4 rounded-xl border-2 text-left opacity-60 cursor-not-allowed border-border bg-muted/30"
                      >
                        <CreditCard className="h-5 w-5 mb-2 text-muted-foreground" />
                        <div className="text-sm font-medium mb-1">Card</div>
                        <Badge className="absolute top-2 right-2 text-[10px] px-2 py-0.5 bg-amber-500/20 text-amber-600 border-amber-500/30">
                          Coming Soon
                        </Badge>
                      </button>
                    </div>
                  </div>

                  {/* Card Payment Form */}
                  {topUpMethod === "card" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="space-y-3 pt-2"
                    >
                      <div>
                        <Label htmlFor="card-number-sidebar" className="text-sm mb-2 block">
                          Card Number
                        </Label>
                        <Input
                          id="card-number-sidebar"
                          placeholder="1234 5678 9012 3456"
                          className="h-10"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor="expiry-sidebar" className="text-sm mb-2 block">
                            Expiry
                          </Label>
                          <Input
                            id="expiry-sidebar"
                            placeholder="MM/YY"
                            className="h-10"
                          />
                        </div>
                        <div>
                          <Label htmlFor="cvv-sidebar" className="text-sm mb-2 block">
                            CVV
                          </Label>
                          <Input
                            id="cvv-sidebar"
                            placeholder="123"
                            className="h-10"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Crypto Payment Info */}
                  {topUpMethod === "crypto" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="space-y-4"
                    >
                      {/* Select Cryptocurrency */}
                      <div>
                        <Label htmlFor="crypto-currency" className="text-sm font-medium mb-2 block">
                          Select Cryptocurrency
                        </Label>
                        <Select
                          value={selectedCrypto}
                          onValueChange={(value) => {
                            setSelectedCrypto(value);
                            setSelectedNetwork(""); // Reset network when crypto changes
                          }}
                        >
                          <SelectTrigger className="h-11 rounded-xl border-2 border-primary/30 hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/20">
                            <SelectValue placeholder="Choose cryptocurrency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="btc">Bitcoin (BTC)</SelectItem>
                            <SelectItem value="eth">Ethereum (ETH)</SelectItem>
                            <SelectItem value="usdt">Tether (USDT)</SelectItem>
                            <SelectItem value="usdc">USD Coin (USDC)</SelectItem>
                            <SelectItem value="bnb">Binance Coin (BNB)</SelectItem>
                            <SelectItem value="sol">Solana (SOL)</SelectItem>
                            <SelectItem value="matic">Polygon (MATIC)</SelectItem>
                            <SelectItem value="trx">Tron (TRX)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Select Network */}
                      {selectedCrypto && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                        >
                          <Label htmlFor="crypto-network" className="text-sm font-medium mb-2 block">
                            Select Network
                          </Label>
                          <Select value={selectedNetwork} onValueChange={setSelectedNetwork}>
                            <SelectTrigger className="h-11 rounded-xl border-2 border-secondary/30 hover:border-secondary/50 focus:border-secondary focus:ring-2 focus:ring-secondary/20">
                              <SelectValue placeholder="Choose network" />
                            </SelectTrigger>
                            <SelectContent>
                              {selectedCrypto === "btc" && (
                                <>
                                  <SelectItem value="btc">Bitcoin (BTC)</SelectItem>
                                  <SelectItem value="lightning">Lightning Network</SelectItem>
                                </>
                              )}
                              {selectedCrypto === "eth" && (
                                <>
                                  <SelectItem value="erc20">Ethereum (ERC20)</SelectItem>
                                  <SelectItem value="arbitrum">Arbitrum One</SelectItem>
                                  <SelectItem value="optimism">Optimism</SelectItem>
                                </>
                              )}
                              {selectedCrypto === "usdt" && (
                                <>
                                  <SelectItem value="erc20">Ethereum (ERC20)</SelectItem>
                                  <SelectItem value="trc20">Tron (TRC20)</SelectItem>
                                  <SelectItem value="bep20">BNB Smart Chain (BEP20)</SelectItem>
                                  <SelectItem value="polygon">Polygon</SelectItem>
                                  <SelectItem value="arbitrum">Arbitrum One</SelectItem>
                                  <SelectItem value="optimism">Optimism</SelectItem>
                                  <SelectItem value="solana">Solana</SelectItem>
                                </>
                              )}
                              {selectedCrypto === "usdc" && (
                                <>
                                  <SelectItem value="erc20">Ethereum (ERC20)</SelectItem>
                                  <SelectItem value="bep20">BNB Smart Chain (BEP20)</SelectItem>
                                  <SelectItem value="polygon">Polygon</SelectItem>
                                  <SelectItem value="arbitrum">Arbitrum One</SelectItem>
                                  <SelectItem value="optimism">Optimism</SelectItem>
                                  <SelectItem value="solana">Solana</SelectItem>
                                  <SelectItem value="avalanche">Avalanche C-Chain</SelectItem>
                                </>
                              )}
                              {selectedCrypto === "bnb" && (
                                <>
                                  <SelectItem value="bep20">BNB Smart Chain (BEP20)</SelectItem>
                                  <SelectItem value="bep2">BNB Beacon Chain (BEP2)</SelectItem>
                                </>
                              )}
                              {selectedCrypto === "sol" && (
                                <SelectItem value="solana">Solana</SelectItem>
                              )}
                              {selectedCrypto === "matic" && (
                                <>
                                  <SelectItem value="polygon">Polygon</SelectItem>
                                  <SelectItem value="erc20">Ethereum (ERC20)</SelectItem>
                                </>
                              )}
                              {selectedCrypto === "trx" && (
                                <SelectItem value="trc20">Tron (TRC20)</SelectItem>
                              )}
                            </SelectContent>
                          </Select>
                        </motion.div>
                      )}

                      {/* Deposit Address Preview */}
                      {selectedCrypto && selectedNetwork && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="p-4 bg-muted/30 rounded-xl space-y-3"
                        >
                          <div className="flex items-start gap-2">
                            <Bitcoin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                            <div className="flex-1">
                              <div className="text-sm font-medium mb-1">Deposit Address</div>
                              <p className="text-xs text-muted-foreground mb-3">
                                Send {selectedCrypto.toUpperCase()} via {selectedNetwork.toUpperCase()} network.
                                All crypto will be automatically converted to USDC.
                              </p>
                              <div className="relative">
                                <div className="p-3 pr-12 bg-background rounded-lg border text-xs font-mono break-all">
                                  {selectedNetwork === "trc20" ? "TXYZabcd1234567890ABCDEFGHIJKLMN" :
                                   selectedNetwork === "solana" ? "7xKXtg2CW87d9wDnEJuBEXz1P9YrKXvBbjC9" :
                                   "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"}
                                </div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const address = selectedNetwork === "trc20" ? "TXYZabcd1234567890ABCDEFGHIJKLMN" :
                                                   selectedNetwork === "solana" ? "7xKXtg2CW87d9wDnEJuBEXz1P9YrKXvBbjC9" :
                                                   "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb";
                                    navigator.clipboard.writeText(address);
                                    setCopiedAddress(true);
                                    setTimeout(() => setCopiedAddress(false), 2000);
                                  }}
                                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-muted rounded-md transition-colors"
                                >
                                  {copiedAddress ? (
                                    <CheckIcon className="h-4 w-4 text-primary" />
                                  ) : (
                                    <Copy className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                                  )}
                                </button>
                              </div>
                              <div className="mt-3 p-2 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                                <p className="text-xs text-amber-700 dark:text-amber-400">
                                  ⚠️ Only send {selectedCrypto.toUpperCase()} to this address via {selectedNetwork.toUpperCase()} network.
                                  Sending other assets or using wrong network may result in permanent loss.
                                </p>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {!selectedCrypto && (
                        <div className="p-4 bg-muted/30 rounded-xl">
                          <p className="text-xs text-muted-foreground text-center">
                            Select a cryptocurrency and network to see the deposit address
                          </p>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* Action Button */}
                  <Button
                    onClick={async () => {
                      if (topUpAmount && topUpMethod) {
                        const amount = parseFloat(topUpAmount);
                        // Try to deposit via API
                        try {
                          const res = await fetch('/api/wallet/deposit', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ amount }),
                          });
                          if (res.ok) {
                            const data = await res.json();
                            // API returns balance in cents
                            if (typeof data.balance === 'number') {
                              setBalance(data.balance / 100);
                            } else {
                              setBalance(balance + amount);
                            }
                          } else {
                            console.error('Wallet deposit API failed:', await res.text());
                            // Fallback: update locally
                            setBalance(balance + amount);
                          }
                        } catch (error) {
                          console.error('Failed to deposit via API:', error);
                          // Fallback: update locally
                          setBalance(balance + amount);
                        }
                        setShowTopUpModal(false);
                        setTopUpAmount("");
                        setTopUpMethod(null);
                        setSelectedCrypto("");
                        setSelectedNetwork("");
                      }
                    }}
                    disabled={!topUpAmount || !topUpMethod || (topUpMethod === "crypto" && (!selectedCrypto || !selectedNetwork))}
                    className="w-full h-11 bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                  >
                    {topUpMethod === "card" ? "Pay Now" : "I've Sent the Payment"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <button
              onClick={() => setActiveTab("discover")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === "discover"
                  ? "bg-primary/10 text-primary border-2 border-primary/30"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Search className="h-4 w-4" />
              Discover Talent
            </button>

            <button
              onClick={() => setActiveTab("campaigns")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === "campaigns"
                  ? "bg-primary/10 text-primary border-2 border-primary/30"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <BarChart3 className="h-4 w-4" />
              My Campaigns
            </button>

            <button
              onClick={() => setActiveTab("create-campaign")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === "create-campaign"
                  ? "bg-primary/10 text-primary border-2 border-primary/30"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Plus className="h-4 w-4" />
              Create Campaign
            </button>

            <button
              onClick={() => setActiveTab("profile")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === "profile"
                  ? "bg-primary/10 text-primary border-2 border-primary/30"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Building2 className="h-4 w-4" />
              Company Profile
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

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8">
          <AnimatePresence mode="wait">
            {/* Discover Tab */}
            {activeTab === "discover" && (
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
                        onClick={() => {/* TODO: Open profile */}}
                        className="flex items-center gap-1.5 sm:gap-3 mb-1 sm:mb-2 w-full text-left hover:opacity-80 transition-opacity"
                      >
                        <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-base sm:text-xl cursor-pointer shrink-0">
                          {influencer.avatar}
                        </div>
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

                      <Badge className="mb-1 sm:mb-2 bg-secondary/10 text-secondary border-secondary/30 text-[9px] sm:text-[10px] py-0 px-1.5 h-4 sm:h-5">
                        {influencer.category}
                      </Badge>

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
                          onClick={() => {
                            setSelectedInfluencer(influencer);
                            setShowCollaborateModal(true);
                          }}
                        >
                          Collaborate
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Campaigns Tab */}
            {activeTab === "campaigns" && (
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
                                        "{application.message}"
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
                                              alert("Please provide feedback before requesting revisions");
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
                            title="Edit"
                            className="p-2 rounded-lg hover:bg-muted transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              // TODO: Implement edit functionality
                            }}
                          >
                            <Pencil className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                          </button>
                          <button
                            title="Pause"
                            className="p-2 rounded-lg hover:bg-muted transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              // TODO: Implement pause functionality
                            }}
                          >
                            <Pause className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                          </button>
                          <button
                            title="Delete"
                            className="p-2 rounded-lg hover:bg-muted transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              // TODO: Implement delete functionality
                            }}
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
              </motion.div>
            )}

            {/* Create Campaign Tab */}
            {activeTab === "create-campaign" && (
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

                    const newCampaign: Campaign = {
                      id: Date.now(),
                      title: campaignTitle,
                      status: "active",
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
                    };

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
                        console.error('API campaign creation failed:', errData.error || res.statusText);
                        // Fallback: add locally
                        setCampaigns([newCampaign, ...campaigns]);
                      }
                    } catch (error) {
                      console.error('Failed to create campaign via API:', error);
                      // Fallback: add locally
                      setCampaigns([newCampaign, ...campaigns]);
                    }

                    // Clear form
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
                              <button
                                type="button"
                                onClick={() => {
                                  const format = "instagram-story";
                                  if (campaignContentFormats.includes(format)) {
                                    setCampaignContentFormats(campaignContentFormats.filter(f => f !== format));
                                  } else {
                                    setCampaignContentFormats([...campaignContentFormats, format]);
                                  }
                                }}
                                className={`p-3 rounded-xl border-2 text-sm transition-all ${
                                  campaignContentFormats.includes("instagram-story")
                                    ? "border-primary bg-primary/5"
                                    : "border-border hover:border-primary/50"
                                }`}
                              >
                                Instagram Story
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  const format = "instagram-reel";
                                  if (campaignContentFormats.includes(format)) {
                                    setCampaignContentFormats(campaignContentFormats.filter(f => f !== format));
                                  } else {
                                    setCampaignContentFormats([...campaignContentFormats, format]);
                                  }
                                }}
                                className={`p-3 rounded-xl border-2 text-sm transition-all ${
                                  campaignContentFormats.includes("instagram-reel")
                                    ? "border-primary bg-primary/5"
                                    : "border-border hover:border-primary/50"
                                }`}
                              >
                                Instagram Reel
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  const format = "instagram-post";
                                  if (campaignContentFormats.includes(format)) {
                                    setCampaignContentFormats(campaignContentFormats.filter(f => f !== format));
                                  } else {
                                    setCampaignContentFormats([...campaignContentFormats, format]);
                                  }
                                }}
                                className={`p-3 rounded-xl border-2 text-sm transition-all ${
                                  campaignContentFormats.includes("instagram-post")
                                    ? "border-primary bg-primary/5"
                                    : "border-border hover:border-primary/50"
                                }`}
                              >
                                Instagram Post
                              </button>
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
                              <button
                                type="button"
                                onClick={() => {
                                  const format = "youtube-video";
                                  if (campaignContentFormats.includes(format)) {
                                    setCampaignContentFormats(campaignContentFormats.filter(f => f !== format));
                                  } else {
                                    setCampaignContentFormats([...campaignContentFormats, format]);
                                  }
                                }}
                                className={`p-3 rounded-xl border-2 text-sm transition-all ${
                                  campaignContentFormats.includes("youtube-video")
                                    ? "border-primary bg-primary/5"
                                    : "border-border hover:border-primary/50"
                                }`}
                              >
                                YouTube Video
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  const format = "youtube-short";
                                  if (campaignContentFormats.includes(format)) {
                                    setCampaignContentFormats(campaignContentFormats.filter(f => f !== format));
                                  } else {
                                    setCampaignContentFormats([...campaignContentFormats, format]);
                                  }
                                }}
                                className={`p-3 rounded-xl border-2 text-sm transition-all ${
                                  campaignContentFormats.includes("youtube-short")
                                    ? "border-primary bg-primary/5"
                                    : "border-border hover:border-primary/50"
                                }`}
                              >
                                YouTube Short
                              </button>
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
                        <p className="text-xs text-muted-foreground mt-1">This information is visible to creators so please make sure it's up to date.</p>
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
                          const newCampaign: Campaign = {
                            id: Date.now(),
                            title: campaignTitle || "Untitled Campaign",
                            status: "draft",
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
                          };

                          setCampaigns([newCampaign, ...campaigns]);

                          // Clear form
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

                          setActiveTab("campaigns");
                        }}
                      >
                        Save Draft
                      </Button>
                    </div>
                  </form>
                </Card>
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
                  <h1 className="text-2xl sm:text-3xl font-bold mb-2">Company Profile</h1>
                  <p className="text-muted-foreground text-sm sm:text-base">Manage your company information</p>
                </div>

                <Card className="p-6 sm:p-8">
                  <form className="space-y-5">
                    <div className="flex items-center gap-4 pb-5 border-b">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                        <Building2 className="h-10 w-10 text-primary" />
                      </div>
                      <div>
                        <Button type="button" size="sm" variant="outline">
                          <Camera className="h-4 w-4 mr-2" />
                          Upload Logo
                        </Button>
                        <p className="text-xs text-muted-foreground mt-2">JPG, PNG or SVG. Max 2MB.</p>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="company-name" className="text-sm font-medium mb-2 block">
                        Company Name
                      </Label>
                      <Input
                        id="company-name"
                        placeholder="Your Company Name"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="h-11"
                      />
                    </div>

                    <div>
                      <Label htmlFor="company-bio" className="text-sm font-medium mb-2 block">
                        About Your Company
                      </Label>
                      <Textarea
                        id="company-bio"
                        placeholder="Tell influencers about your brand, values, and what you're looking for..."
                        value={companyBio}
                        onChange={(e) => setCompanyBio(e.target.value)}
                        rows={5}
                        className="resize-none"
                      />
                    </div>

                    {/* Company Info from Onboarding */}
                    <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-xl border border-border">
                      <div>
                        <Label className="text-xs text-muted-foreground mb-1 block">Country</Label>
                        <div className="text-sm font-medium">{companyCountry}</div>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground mb-1 block">Industry</Label>
                        <div className="text-sm font-medium">{companyIndustry}</div>
                      </div>
                      <p className="col-span-2 text-xs text-muted-foreground">
                        These details were set during onboarding and cannot be edited here.
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="website" className="text-sm font-medium mb-2 block">
                        Website
                      </Label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="website"
                          placeholder="https://yourcompany.com"
                          value={websiteUrl}
                          onChange={(e) => setWebsiteUrl(e.target.value)}
                          className="pl-10 h-11"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label className="text-sm font-medium">Social Media</Label>

                      <div className="relative">
                        <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Instagram URL"
                          value={instagramUrl}
                          onChange={(e) => setInstagramUrl(e.target.value)}
                          className="pl-10 h-11"
                        />
                      </div>

                      <div className="relative">
                        <Twitter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="X URL"
                          value={twitterUrl}
                          onChange={(e) => setTwitterUrl(e.target.value)}
                          className="pl-10 h-11"
                        />
                      </div>

                      <div className="relative">
                        <Youtube className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="YouTube URL"
                          value={youtubeUrl}
                          onChange={(e) => setYoutubeUrl(e.target.value)}
                          className="pl-10 h-11"
                        />
                      </div>

                      <div className="relative">
                        <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="LinkedIn URL"
                          value={linkedinUrl}
                          onChange={(e) => setLinkedinUrl(e.target.value)}
                          className="pl-10 h-11"
                        />
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button className="flex-1 h-11 bg-gradient-to-r from-primary to-secondary hover:opacity-90">
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
                  <p className="text-muted-foreground text-sm sm:text-base">Manage your account settings and preferences</p>
                </div>

                <Card className="p-6 max-w-3xl">
                  <div className="space-y-6">
                    <div className="pb-6 border-b">
                      <h3 className="text-lg font-semibold mb-4">Account Settings</h3>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="email" className="text-sm font-medium mb-2 block">
                            Email Address
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="your@email.com"
                            className="h-11"
                          />
                        </div>
                        <div>
                          <Label htmlFor="password" className="text-sm font-medium mb-2 block">
                            Change Password
                          </Label>
                          <Button type="button" variant="outline" size="sm">
                            Update Password
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="pb-6 border-b">
                      <h3 className="text-lg font-semibold mb-4">Notifications</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium">Email Notifications</p>
                            <p className="text-xs text-muted-foreground">Receive email updates about your campaigns</p>
                          </div>
                          <input type="checkbox" defaultChecked className="h-4 w-4" />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium">Campaign Updates</p>
                            <p className="text-xs text-muted-foreground">Get notified when influencers apply or accept invitations</p>
                          </div>
                          <input type="checkbox" defaultChecked className="h-4 w-4" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-4 text-destructive">Danger Zone</h3>
                      <Button variant="destructive" size="sm">
                        Delete Account
                      </Button>
                      <p className="text-xs text-muted-foreground mt-2">This action cannot be undone</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Mobile Navigation */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 bg-white dark:bg-black border-t border-border z-[100] safe-area-inset-bottom">
        <div className="flex items-center justify-around w-full px-2 py-2">
          <button
            onClick={() => {
              setActiveTab("discover");
              setSelectedCampaignDetails(null);
            }}
            className={`flex flex-col items-center justify-center gap-0.5 min-w-0 flex-1 transition-colors ${
              activeTab === "discover" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <div className="w-6 h-6 rounded-full bg-foreground flex items-center justify-center text-background text-xs font-bold shrink-0">
              N
            </div>
            <span className="text-[8px] font-medium truncate max-w-full text-center">Discover</span>
          </button>
          <button
            onClick={() => {
              setActiveTab("campaigns");
              setSelectedCampaignDetails(null);
            }}
            className={`flex flex-col items-center justify-center gap-0.5 min-w-0 flex-1 transition-colors ${
              activeTab === "campaigns" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <BarChart3 className="h-5 w-5 shrink-0" />
            <span className="text-[8px] font-medium truncate max-w-full text-center">Campaigns</span>
          </button>
          <button
            onClick={() => {
              setActiveTab("create-campaign");
              setSelectedCampaignDetails(null);
            }}
            className={`flex flex-col items-center justify-center gap-0.5 min-w-0 flex-1 transition-colors ${
              activeTab === "create-campaign" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <Plus className="h-5 w-5 shrink-0" />
            <span className="text-[8px] font-medium truncate max-w-full text-center">Create</span>
          </button>
          <button
            onClick={() => {
              setActiveTab("profile");
              setSelectedCampaignDetails(null);
            }}
            className={`flex flex-col items-center justify-center gap-0.5 min-w-0 flex-1 transition-colors ${
              activeTab === "profile" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <Building2 className="h-5 w-5 shrink-0" />
            <span className="text-[8px] font-medium truncate max-w-full text-center">Profile</span>
          </button>
          <button
            onClick={() => {
              setActiveTab("settings");
              setSelectedCampaignDetails(null);
            }}
            className={`flex flex-col items-center justify-center gap-0.5 min-w-0 flex-1 transition-colors ${
              activeTab === "settings" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <Settings className="h-5 w-5 shrink-0" />
            <span className="text-[8px] font-medium truncate max-w-full text-center">Settings</span>
          </button>
        </div>
      </nav>

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
                {mockCampaigns.map((campaign) => (
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
              <span>Don't see your campaign?</span>
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
              onClick={() => {
                if (selectedCampaignId) {
                  // TODO: Send invitation
                  console.log(`Inviting ${selectedInfluencer?.name} to campaign ${selectedCampaignId}`);
                  setShowCollaborateModal(false);
                  setSelectedCampaignId(null);
                  setSelectedInfluencer(null);
                }
              }}
              disabled={!selectedCampaignId}
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
                  disabled={!counterOfferPrice || parseFloat(counterOfferPrice) <= 0}
                  onClick={() => {
                    // TODO: Send counter offer to influencer
                    console.log("Sending counter offer:", {
                      influencerId: counterOfferInfluencer.id,
                      originalPrice: counterOfferInfluencer.proposedPrice,
                      counterPrice: parseFloat(counterOfferPrice),
                      pricingModel: counterOfferInfluencer.proposedPricingModel
                    });
                    setShowCounterOfferModal(false);
                    setCounterOfferPrice("");
                  }}
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
                <span className="text-muted-foreground">Required Amount:</span>
                <span className="font-semibold">
                  ${selectedInfluencerForPipeline ? (
                    (() => {
                      let total = 0;
                      if (selectedCampaignDetails?.pricingModels.includes("cpm") && selectedInfluencerForPipeline.proposedPriceCPM) {
                        total += parseFloat(selectedInfluencerForPipeline.proposedPriceCPM);
                      }
                      if (selectedCampaignDetails?.pricingModels.includes("cpc") && selectedInfluencerForPipeline.proposedPriceCPC) {
                        total += parseFloat(selectedInfluencerForPipeline.proposedPriceCPC);
                      }
                      if (selectedCampaignDetails?.pricingModels.includes("cpe") && selectedInfluencerForPipeline.proposedPriceCPE) {
                        total += parseFloat(selectedInfluencerForPipeline.proposedPriceCPE);
                      }
                      return total.toFixed(2);
                    })()
                  ) : "0.00"}
                </span>
              </div>
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
                  // Navigate to billing/add funds
                  // TODO: Implement navigation to billing page
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

    </div>
  );
}
