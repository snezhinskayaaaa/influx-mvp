export type Tab = "discover" | "campaigns" | "profile" | "create-campaign" | "settings";

export type CollaborationStatus =
  | "APPLIED"
  | "NEGOTIATING"
  | "AGREED"
  | "IN_PROGRESS"
  | "CONTENT_REVIEW"
  | "REVISION"
  | "PUBLISHING"
  | "DELIVERED"
  | "COMPLETED"
  | "CANCELLED"
  | "DISPUTED"
  | "RESOLVED";

/** Map collaboration status to display label and color classes */
export const COLLABORATION_STATUS_CONFIG: Record<
  CollaborationStatus,
  { label: string; badgeClass: string }
> = {
  APPLIED: { label: "Applied", badgeClass: "bg-muted text-foreground border-border" },
  NEGOTIATING: { label: "Negotiating", badgeClass: "bg-primary/10 text-primary border-primary/20" },
  AGREED: { label: "Agreed", badgeClass: "bg-success/10 text-success border-success/20" },
  IN_PROGRESS: { label: "In Progress", badgeClass: "bg-secondary/10 text-secondary border-secondary/20" },
  CONTENT_REVIEW: { label: "Content Review", badgeClass: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
  REVISION: { label: "Revision Requested", badgeClass: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
  PUBLISHING: { label: "Publishing", badgeClass: "bg-purple-500/10 text-purple-600 border-purple-500/20" },
  DELIVERED: { label: "Delivered", badgeClass: "bg-green-500/10 text-green-600 border-green-500/20" },
  COMPLETED: { label: "Completed", badgeClass: "bg-success/10 text-success border-success/20" },
  CANCELLED: { label: "Cancelled", badgeClass: "bg-muted text-muted-foreground border-border" },
  DISPUTED: { label: "Disputed", badgeClass: "bg-red-500/10 text-red-600 border-red-500/20" },
  RESOLVED: { label: "Resolved", badgeClass: "bg-gray-500/10 text-gray-600 border-gray-500/20" },
} as const;

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
  collaborationId?: string;
  influencerId: number;
  influencerName: string;
  influencerUsername: string;
  influencerAvatar: string;
  influencerFollowers: string;
  source: "applied" | "invited";
  status: "pending" | "approved" | "rejected";
  /** Collaboration lifecycle status from the backend */
  collaborationStatus?: CollaborationStatus;
  proposedPriceCPM?: string;
  proposedPriceCPC?: string;
  proposedPriceCPE?: string;
  /** Agreed price in dollars (converted from cents) */
  agreedPrice?: number;
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
  contentUrl?: string;
  contentApproved?: boolean;
  contentApprovedAt?: string;

  // Revision tracking
  revisionCount?: number;
  revisionNote?: string;

  // Payment tracking (new 50/50 model)
  advancePaid?: boolean;    // 50% at IN_PROGRESS
  finalPaymentPaid?: boolean; // 50% at COMPLETED

  // Legacy payment tracking
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

  // Dispute
  disputeReason?: string;
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
  currentStage?: number; // 1: Agreement, 2: Advance Paid, 3: Content Review, 4: Publishing, 5: Delivered, 6: Completed
}

export interface CampaignInfluencer {
  id: number;
  collaborationId?: string;
  name: string;
  username: string;
  avatar: string;
  status: "invited" | "applied" | "approved";

  /** Collaboration lifecycle status */
  collaborationStatus?: CollaborationStatus;

  // Timeline stage for approved influencers (mapped from collaborationStatus)
  // 1: Agreement, 2: Advance Paid, 3: Content Review, 4: Publishing, 5: Delivered, 6: Completed
  timelineStage?: 1 | 2 | 3 | 4 | 5 | 6;

  // Checkpoint 1: Discussion/Negotiation
  proposedPrice?: number;
  proposedPricingModel?: "CPM" | "CPC" | "CPE";
  agreedPrice?: number;
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

  // Content review
  contentUrl?: string;
  draftSubmitted?: boolean;
  draftUrl?: string;

  // Revisions
  revisionCount?: number;
  revisionNote?: string;
  currentDraftUrl?: string;
  brandApprovedDraft?: boolean;
  influencerApprovedDraft?: boolean;

  // Published
  publishedUrl?: string;
  metricsDelivered?: boolean;
  targetMetricsReached?: boolean;

  // Payment tracking (new 50/50 model)
  advancePaid?: boolean;    // 50% at IN_PROGRESS
  finalPaymentPaid?: boolean; // 50% at COMPLETED

  // Legacy payment tracking (kept for backward compatibility)
  payment25Sent?: boolean;
  payment50Sent?: boolean;
  payment75Sent?: boolean;
  payment100Sent?: boolean;

  // Dispute
  disputeReason?: string;
}

// Minimum market rates for pricing models
export const PRICING_MIN_RATES = {
  CPM: 2.5,   // Minimum CPM rate (e.g., Russia Instagram)
  CPC: 0.5,   // Minimum CPC rate
  CPE: 0.1,   // Minimum CPE rate
} as const;
