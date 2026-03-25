export type Tab = "discover" | "campaigns" | "profile" | "create-campaign" | "settings";

export interface Notification {
  id: number;
  type: "invitation_accepted" | "campaign_application";
  influencerName: string;
  campaignTitle: string;
  timestamp: string;
  read: boolean;
}

export interface Influencer {
  id: number;
  name: string;
  username: string;
  avatar: string;
  avatarUrl?: string;
  followers: string;
  engagement: string;
  category: string;
  rate: string;
  verified: boolean;
  gender: string;
  ethnicity: string;
  age: string;
  bio?: string;
  niche?: string[];
  pricingCPM?: string;
  pricingCPC?: string;
  pricingCPE?: string;
  instagramHandle?: string;
  tiktokHandle?: string;
  youtubeHandle?: string;
  twitterHandle?: string;
  location?: string;
  languages?: string[];
  instagramFollowers?: number;
  tiktokFollowers?: number;
}

export interface ContentRevision {
  id: number;
  version: number;
  contentUrl: string;
  submittedAt: string;
  brandFeedback?: string;
  feedbackAt?: string;
}

export interface PublicMetrics {
  views?: number;
  likes?: number;
  comments?: number;
  shares?: number;
  lastUpdated?: string;
}

export interface InsightsScreenshot {
  id: number;
  metricType: "impressions" | "reach" | "saves" | "profile_visits";
  screenshotUrl: string;
  value: number;
  submittedAt: string;
  verified?: boolean;
}

export interface CampaignApplication {
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

export interface Campaign {
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

export interface CampaignInfluencer {
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
export const PRICING_MIN_RATES = {
  CPM: 2.5,   // Minimum CPM rate (e.g., Russia Instagram)
  CPC: 0.5,   // Minimum CPC rate
  CPE: 0.1,   // Minimum CPE rate
} as const;
