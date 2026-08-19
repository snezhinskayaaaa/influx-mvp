"use client";

import { useState, useEffect, useRef } from "react";
import { XIcon } from "@/components/x-icon";
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
import { motion } from "framer-motion";
import {
  Search,
  Users,
  Instagram,
  Plus,
  Save,
  CheckCircle2,
  Clock,
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
  Play,
  Trash2,
  AlertCircle,
  ExternalLink,
  FileText,
  Send,
} from "lucide-react";
import type { Tab, Campaign, CampaignApplication, CollaborationStatus } from "./types";
import { COLLABORATION_STATUS_CONFIG } from "./types";

interface CampaignsTabProps {
  campaigns: Campaign[];
  setCampaigns: React.Dispatch<React.SetStateAction<Campaign[]>>;
  setActiveTab: (tab: Tab) => void;
  balance: number;
  setShowInsufficientFundsDialog: (show: boolean) => void;
}

/** Label maps for values saved by the create form */
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

const GOAL_LABELS: Record<string, string> = {
  "brand-awareness": "Project Awareness",
  "engagement": "Community Engagement",
  "conversions": "Conversions",
  "product-launch": "Token / Protocol Launch",
  "lead-generation": "User Acquisition",
  "traffic": "dApp Traffic",
};

const PRICING_LABELS: Record<string, string> = {
  "cpm": "CPM",
  "cpc": "CPC",
  "cpe": "CPE",
};

/** Stages for the text-based progress indicator */
const COLLAB_STAGES = ["Negotiating", "In Progress", "Content", "Published", "Completed"] as const;

/** Map collaborationStatus → which stage index (0-4) the collab is at */
function getStageIndex(status: string | undefined): number {
  switch (status) {
    case "INVITED":
    case "APPLIED":
    case "NEGOTIATING":
      return 0;
    case "AGREED":
    case "IN_PROGRESS":
      return 1;
    case "CONTENT_REVIEW":
    case "REVISION":
      return 2;
    case "PUBLISHING":
    case "DELIVERED":
      return 3;
    case "COMPLETED":
    case "RESOLVED":
      return 4;
    case "DISPUTED":
      return 3; // still in publish/delivery phase
    default:
      return 0;
  }
}

/** Get action status for a collaboration */
function getActionInfo(app: CampaignApplication): { type: "action" | "waiting" | "done"; text: string } {
  const status = app.collaborationStatus;
  switch (status) {
    case "INVITED":
      return { type: "waiting", text: "Invitation sent — waiting for creator to respond" };
    case "APPLIED":
      return { type: "action", text: "New application — review and approve or reject" };
    case "NEGOTIATING":
      if (app.influencerAgreed === true)
        return { type: "action", text: `Creator accepted $${app.agreedPrice ?? 0} — start campaign` };
      if (app.influencerAgreed === false)
        return { type: "action", text: "Creator declined — propose new price or cancel" };
      return { type: "waiting", text: `Price offer $${app.agreedPrice ?? 0} sent — waiting for response` };
    case "AGREED":
      return { type: "action", text: "Agreement signed — start campaign to freeze funds" };
    case "IN_PROGRESS":
      return { type: "waiting", text: "Campaign started — waiting for content submission" };
    case "CONTENT_REVIEW":
      return { type: "action", text: "Content submitted — review and approve or request revision" };
    case "REVISION":
      return { type: "waiting", text: `Revision requested (${app.revisionCount ?? 0}/3) — waiting for update` };
    case "PUBLISHING":
      return { type: "waiting", text: "Content approved — waiting for publication links" };
    case "DELIVERED":
      return { type: "action", text: "Content published — approve & pay or dispute" };
    case "COMPLETED":
    case "RESOLVED":
      return { type: "done", text: "Completed — all payments processed" };
    case "DISPUTED":
      return { type: "waiting", text: "Dispute filed — under admin review" };
    default:
      return { type: "waiting", text: "Pending" };
  }
}

/** Count collaborations at each pipeline stage */
function getPipelineCounts(apps: CampaignApplication[] | undefined): number[] {
  const counts = [0, 0, 0, 0, 0]; // negotiating, in_progress, content, published, completed
  if (!apps) return counts;
  for (const app of apps) {
    if (app.status !== "approved") continue;
    const idx = getStageIndex(app.collaborationStatus);
    counts[idx]++;
  }
  return counts;
}

export function CampaignsTab({
  campaigns,
  setCampaigns,
  setActiveTab,
  setShowInsufficientFundsDialog,
}: CampaignsTabProps) {
  const [toast, setToast] = useState<{ message: string; variant: 'success' | 'error' } | null>(null);

  const showToast = (message: string, variant: 'success' | 'error' = 'success') => {
    setToast({ message, variant });
    setTimeout(() => setToast(null), 4000);
  };

  const [selectedCampaignDetails, setSelectedCampaignDetails] = useState<Campaign | null>(null);
  const [campaignSearchQuery, setCampaignSearchQuery] = useState("");
  const [campaignStatusFilter, setCampaignStatusFilter] = useState<"all" | "active" | "draft" | "paused" | "completed">("all");
  const [isCampaignDetailsExpanded, setIsCampaignDetailsExpanded] = useState(false);
  const [isApplicationsExpanded, setIsApplicationsExpanded] = useState(false);
  const applicationsRef = useRef<HTMLDivElement>(null);
  const [isEditingCampaign, setIsEditingCampaign] = useState(false);
  const [editedCampaignData, setEditedCampaignData] = useState<Campaign | null>(null);
  const [selectedInfluencerForPipeline, setSelectedInfluencerForPipeline] = useState<CampaignApplication | null>(null);
  const [showInfluencerSelector, setShowInfluencerSelector] = useState(false);
  const [priceModalData, setPriceModalData] = useState<{ application: CampaignApplication; defaultPrice: string; isNewOffer?: boolean } | null>(null);
  const [priceModalValue, setPriceModalValue] = useState("");
  const [revisionNoteText, setRevisionNoteText] = useState("");
  const [disputeReasonText, setDisputeReasonText] = useState("");
  const [disputeCategory, setDisputeCategory] = useState("");
  const [showRevisionInput, setShowRevisionInput] = useState(false);
  const [showDisputeInput, setShowDisputeInput] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [termsHighlight, setTermsHighlight] = useState(false);
  const [viewingProfile, setViewingProfile] = useState<Record<string, unknown> | null>(null);
  const [deletingCampaign, setDeletingCampaign] = useState<Campaign | null>(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  // Auto-refresh applications when campaign is open (every 15s)
  useEffect(() => {
    if (!selectedCampaignDetails) return;
    const interval = setInterval(() => {
      handleOpenCampaign(selectedCampaignDetails, true);
    }, 15000);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCampaignDetails?.id]);

  /** Helper to get collaboration status badge */
  const getCollaborationStatusBadge = (collabStatus: CollaborationStatus | undefined) => {
    if (!collabStatus) return null;
    const config = COLLABORATION_STATUS_CONFIG[collabStatus];
    if (!config) return null;
    return (
      <Badge variant="outline" className={`text-xs ${config.badgeClass}`}>
        {config.label}
      </Badge>
    );
  };

  /** Start campaign: AGREED -> IN_PROGRESS (pays 50% advance) */
  const handleStartCampaign = async (collaborationId: string) => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/collaborations/${collaborationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'IN_PROGRESS' }),
      });
      if (!res.ok) {
        const data = await res.json();
        const errorMsg = data.error || 'Failed to start campaign';
        showToast(errorMsg, 'error');
        if (errorMsg.toLowerCase().includes('insufficient balance')) {
          setShowInsufficientFundsDialog(true);
        }
        return;
      }
      showToast('Campaign started. 50% advance paid to creator.', 'success');
      // Refresh page to reflect changes
      if (selectedCampaignDetails) await handleOpenCampaign(selectedCampaignDetails, true);
    } catch {
      showToast('Failed to start campaign', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  /** Approve content: CONTENT_REVIEW -> PUBLISHING */
  const handleApproveContent = async (collaborationId: string) => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/collaborations/${collaborationId}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'approve' }),
      });
      if (!res.ok) {
        const data = await res.json();
        showToast(data.error || 'Failed to approve content', 'error');
        return;
      }
      showToast('Content approved. Waiting for creator to publish.', 'success');
      // Refresh pipeline data inline instead of full page reload
      if (selectedCampaignDetails) {
        await handleOpenCampaign(selectedCampaignDetails, true);
      }
    } catch {
      showToast('Failed to approve content', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  /** Request revision: CONTENT_REVIEW -> REVISION */
  const handleRequestRevision = async (collaborationId: string, note: string) => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/collaborations/${collaborationId}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'request_revision', note }),
      });
      if (!res.ok) {
        const data = await res.json();
        showToast(data.error || 'Failed to request revision', 'error');
        return;
      }
      showToast('Revision requested.', 'success');
      setShowRevisionInput(false);
      // Immediately update local state so UI reflects REVISION status
      if (selectedInfluencerForPipeline) {
        setSelectedInfluencerForPipeline({
          ...selectedInfluencerForPipeline,
          collaborationStatus: 'REVISION' as CollaborationStatus,
          revisionNote: revisionNoteText,
          revisionCount: (selectedInfluencerForPipeline.revisionCount ?? 0) + 1,
        });
      }
      setRevisionNoteText("");
      if (selectedCampaignDetails) await handleOpenCampaign(selectedCampaignDetails, true);
    } catch {
      showToast('Failed to request revision', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  /** Approve delivery: DELIVERED -> COMPLETED (pays final 50%) */
  const handleApproveDelivery = async (collaborationId: string) => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/collaborations/${collaborationId}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'approve' }),
      });
      if (!res.ok) {
        const data = await res.json();
        showToast(data.error || 'Failed to approve delivery', 'error');
        return;
      }
      showToast('Delivery approved. Final payment released.', 'success');
      if (selectedCampaignDetails) await handleOpenCampaign(selectedCampaignDetails, true);
    } catch {
      showToast('Failed to approve delivery', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  /** Dispute delivery: DELIVERED -> DISPUTED */
  const handleDispute = async (collaborationId: string, reason: string) => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/collaborations/${collaborationId}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'dispute', note: reason }),
      });
      if (!res.ok) {
        const data = await res.json();
        showToast(data.error || 'Failed to file dispute', 'error');
        return;
      }
      showToast('Dispute filed. Platform team will review.', 'success');
      setDisputeReasonText("");
      setShowDisputeInput(false);
      if (selectedCampaignDetails) await handleOpenCampaign(selectedCampaignDetails, true);
    } catch {
      showToast('Failed to file dispute', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  /** Toggle pause/resume on a campaign */
  const handleTogglePause = async (campaign: Campaign, forceStatus?: string) => {
    const newStatus = forceStatus || (campaign.status === 'paused' || campaign.status === 'draft' ? 'ACTIVE' : 'PAUSED');
    setActionLoading(true);
    try {
      const res = await fetch(`/api/campaigns/${campaign.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) {
        const data = await res.json();
        showToast(data.error || 'Failed to update campaign status', 'error');
        return;
      }
      const updatedStatus = newStatus.toLowerCase() as 'active' | 'paused';
      setCampaigns(campaigns.map(c =>
        c.id === campaign.id ? { ...c, status: updatedStatus } : c
      ));
      showToast(
        newStatus === 'PAUSED' ? 'Campaign paused.' : 'Campaign is now live!',
        'success'
      );
    } catch {
      showToast('Failed to update campaign status', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  /** Delete a campaign */
  const handleDeleteCampaign = async () => {
    if (!deletingCampaign) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/campaigns/${deletingCampaign.id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const data = await res.json();
        showToast(data.error || 'Failed to delete campaign', 'error');
        return;
      }
      setCampaigns(campaigns.filter(c => c.id !== deletingCampaign.id));
      if (selectedCampaignDetails?.id === deletingCampaign.id) {
        setSelectedCampaignDetails(null);
      }
      showToast('Campaign deleted.', 'success');
    } catch {
      showToast('Failed to delete campaign', 'error');
    } finally {
      setActionLoading(false);
      setDeletingCampaign(null);
      setDeleteConfirmText("");
    }
  };

  /** Open campaign detail view and fetch applications */
  const handleOpenCampaign = async (campaign: Campaign, keepInfluencer = false) => {
    // Only set campaign immediately on first open (no applicationsList yet)
    // On refresh, skip this to avoid flickering
    if (!selectedCampaignDetails || selectedCampaignDetails.id !== campaign.id) {
      setSelectedCampaignDetails(campaign);
      setSelectedInfluencerForPipeline(null);
    } else if (!keepInfluencer) {
      setSelectedInfluencerForPipeline(null);
    }
    try {
      const res = await fetch('/api/collaborations');
      if (res.ok) {
        const data = await res.json();
        if (data.collaborations) {
          const campaignCollabs = data.collaborations
            .filter((c: Record<string, unknown>) => {
              const colCampaign = c.campaign as Record<string, unknown>;
              return colCampaign?.id === campaign.id;
            })
            .map((c: Record<string, unknown>) => {
              const inf = c.influencer as Record<string, unknown>;
              const followers = (inf?.instagramFollowers as number) || 0;
              const proposedPrice = (c.proposedPrice as number) || 0;
              return {
                id: inf?.id || '',
                collaborationId: c.id as string,
                influencerId: inf?.id || '',
                influencerName: (inf?.handle as string) || 'Unknown',
                influencerUsername: `@${(inf?.handle as string) || 'unknown'}`,
                influencerAvatar: (inf?.profile as Record<string, unknown>)?.avatarUrl as string || '👤',
                influencerFollowers: followers > 0 ? followers.toLocaleString() : '0',
                source: 'applied' as const,
                status: c.status === 'INVITED' ? 'invited' as const : c.status === 'APPLIED' ? 'pending' as const : 'approved' as const,
                collaborationStatus: c.status as string,
                proposedPriceCPM: `${(proposedPrice / 100).toFixed(0)}`,
                agreedPrice: c.agreedPrice ? (c.agreedPrice as number) / 100 : undefined,
                influencerAgreed: (c.influencerAgreed as boolean) ?? undefined,
                brandAgreed: (c.brandAgreed as boolean) ?? undefined,
                message: (c.message as string) || '',
                appliedAt: c.createdAt ? new Date(c.createdAt as string).toLocaleDateString() : 'Unknown',
                contentUrl: (c.contentUrl as string) || undefined,
                publishedUrl: (c.publishedUrl as string) || undefined,
                publishedUrls: Array.isArray(c.publishedUrls) ? c.publishedUrls as string[] : [],
                revisionCount: (c.revisionCount as number) || 0,
                revisionNote: (c.revisionNote as string) || undefined,
                brandTerms: (c.brandTerms as string) || undefined,
                influencerTerms: (c.influencerTerms as string) || undefined,
                disputeReason: (c.disputeReason as string) || undefined,
                deliveredAt: (c.deliveredAt as string) || undefined,
                // Profile details for popup
                influencerBio: (inf?.bio as string) || '',
                influencerNiche: Array.isArray(inf?.niche) ? (inf.niche as string[]).join(', ') : '',
                influencerVerified: (inf?.isVerified as boolean) || false,
                influencerInstagram: (inf?.instagramHandle as string) || '',
                influencerTiktok: (inf?.tiktokHandle as string) || '',
                influencerYoutube: (inf?.youtubeHandle as string) || '',
                influencerTwitter: (inf?.twitterHandle as string) || '',
                influencerTelegram: (inf?.telegramHandle as string) || '',
                influencerTiktokFollowers: (inf?.tiktokFollowers as number) || 0,
                influencerYoutubeSubscribers: (inf?.youtubeSubscribers as number) || 0,
                influencerTwitterFollowers: (inf?.twitterFollowers as number) || 0,
                influencerTelegramFollowers: (inf?.telegramFollowers as number) || 0,
              };
            });
          setSelectedCampaignDetails({ ...campaign, applicationsList: campaignCollabs, applications: campaignCollabs.length });
          // Update selected influencer for pipeline if one is selected
          if (selectedInfluencerForPipeline) {
            const updated = campaignCollabs.find((c: CampaignApplication) => c.id === selectedInfluencerForPipeline.id);
            if (updated) setSelectedInfluencerForPipeline(updated);
          }
          // Also update the campaigns list count
          setCampaigns(campaigns.map(camp =>
            camp.id === campaign.id ? { ...camp, applications: campaignCollabs.length } : camp
          ));
        }
      }
    } catch {
      // Keep showing campaign without applications
    }
  };

  /** Open campaign detail view for editing */
  const handleEditCampaign = (campaign: Campaign) => {
    setSelectedCampaignDetails(campaign);
    setIsEditingCampaign(true);
    setEditedCampaignData(campaign);
  };

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
              <h1 className="text-xl sm:text-3xl font-bold mb-2">{selectedCampaignDetails.title}</h1>
              <div className="flex items-center gap-2">
                <Badge
                  variant={selectedCampaignDetails.status === "active" ? "default" : "secondary"}
                  className={
                    selectedCampaignDetails.status === "active"
                      ? "bg-success/10 text-success border-success/20"
                      : selectedCampaignDetails.status === "paused"
                      ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                      : "bg-primary/10 text-primary border-primary/20"
                  }
                >
                  <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                    selectedCampaignDetails.status === "active" ? "bg-success"
                    : selectedCampaignDetails.status === "paused" ? "bg-amber-500"
                    : "bg-primary"
                  }`} />
                  {selectedCampaignDetails.status === "active" ? "Active" : selectedCampaignDetails.status === "paused" ? "Paused" : selectedCampaignDetails.status === "completed" ? "Completed" : "Draft"}
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
                  disabled={actionLoading}
                  onClick={async () => {
                    if (editedCampaignData) {
                      setActionLoading(true);
                      try {
                        const patchBody: Record<string, unknown> = {};
                        if (editedCampaignData.title !== selectedCampaignDetails.title) {
                          patchBody.title = editedCampaignData.title;
                        }
                        if (editedCampaignData.description !== selectedCampaignDetails.description) {
                          patchBody.description = editedCampaignData.description;
                        }
                        if (editedCampaignData.budgetMin !== selectedCampaignDetails.budgetMin) {
                          patchBody.budgetMin = parseFloat(editedCampaignData.budgetMin);
                        }
                        if (editedCampaignData.budgetMax !== selectedCampaignDetails.budgetMax) {
                          patchBody.budgetMax = parseFloat(editedCampaignData.budgetMax);
                        }
                        if (editedCampaignData.influencerCount !== selectedCampaignDetails.influencerCount) {
                          patchBody.desiredInfluencerCount = parseInt(editedCampaignData.influencerCount) || 1;
                        }
                        if (editedCampaignData.detailedRequirements !== selectedCampaignDetails.detailedRequirements) {
                          patchBody.deliverables = editedCampaignData.detailedRequirements;
                        }
                        if (editedCampaignData.endDate !== selectedCampaignDetails.endDate) {
                          patchBody.endDate = editedCampaignData.endDate || null;
                        }

                        if (Object.keys(patchBody).length > 0) {
                          const res = await fetch(`/api/campaigns/${selectedCampaignDetails.id}`, {
                            method: 'PATCH',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(patchBody),
                          });
                          if (!res.ok) {
                            const data = await res.json();
                            showToast(data.error || 'Failed to save changes', 'error');
                            return;
                          }
                        }

                        // Update local state
                        setCampaigns(campaigns.map(c =>
                          c.id === editedCampaignData.id ? editedCampaignData : c
                        ));
                        setSelectedCampaignDetails(editedCampaignData);
                        setIsEditingCampaign(false);
                        showToast('Campaign updated.', 'success');
                      } catch {
                        showToast('Failed to save changes', 'error');
                      } finally {
                        setActionLoading(false);
                      }
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
          <Card className="p-4 sm:p-6 mb-4 sm:mb-6">
            <div className="space-y-4">
              {/* Brief Info */}
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <Label className="text-xs text-muted-foreground mb-1 block">Start Date</Label>
                  {isEditingCampaign && editedCampaignData ? (
                    <DatePicker
                      date={editedCampaignData.startDate ? new Date(editedCampaignData.startDate) : undefined}
                      onDateChange={(d) => setEditedCampaignData({...editedCampaignData, startDate: d ? `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}` : ''})}
                      placeholder="Select date"
                      className="h-9 text-sm"
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
                    <DatePicker
                      date={editedCampaignData.endDate ? new Date(editedCampaignData.endDate) : undefined}
                      onDateChange={(d) => setEditedCampaignData({...editedCampaignData, endDate: d ? `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}` : ''})}
                      placeholder="Select date"
                      className="h-9 text-sm"
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
                        <SelectItem value="brand-awareness">Project Awareness</SelectItem>
                        <SelectItem value="engagement">Community Engagement</SelectItem>
                        <SelectItem value="conversions">Conversions</SelectItem>
                        <SelectItem value="product-launch">Token / Protocol Launch</SelectItem>
                        <SelectItem value="lead-generation">User Acquisition</SelectItem>
                        <SelectItem value="traffic">dApp Traffic</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="text-sm font-medium">
                      {(selectedCampaignDetails.goal && GOAL_LABELS[selectedCampaignDetails.goal]) || selectedCampaignDetails.goal || "Not set"}
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
                        {["twitter", "telegram", "instagram", "tiktok", "youtube"].map((platform) => (
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
                              className="text-sm font-medium cursor-pointer flex items-center"
                            >
                              {platform === "twitter" && <XIcon className="h-4 w-4 mr-2" />}
                              {platform === "telegram" && <MessageCircle className="h-4 w-4 mr-2" />}
                              {platform === "instagram" && <Instagram className="h-4 w-4 mr-2" />}
                              {platform === "tiktok" && <Video className="h-4 w-4 mr-2" />}
                              {platform === "youtube" && <Youtube className="h-4 w-4 mr-2" />}
                              {platform === "twitter" ? "X (Twitter)" : platform.charAt(0).toUpperCase() + platform.slice(1)}
                            </label>
                          </div>
                        ))}
                      </div>
                    ) : selectedCampaignDetails.platforms && selectedCampaignDetails.platforms.length > 0 ? (
                      <div className="flex gap-2">
                        {selectedCampaignDetails.platforms.map((platform) => (
                          <Badge key={platform} variant="outline">
                            {platform === "twitter" && <XIcon className="h-3 w-3 mr-1" />}
                            {platform === "telegram" && <MessageCircle className="h-3 w-3 mr-1" />}
                            {platform === "instagram" && <Instagram className="h-3 w-3 mr-1" />}
                            {platform === "tiktok" && <Video className="h-3 w-3 mr-1" />}
                            {platform === "youtube" && <Youtube className="h-3 w-3 mr-1" />}
                            {platform === "twitter" ? "X (Twitter)" : platform.charAt(0).toUpperCase() + platform.slice(1)}
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
                        {Object.entries(FORMAT_LABELS).map(([format, label]) => (
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
                              className="text-sm font-medium cursor-pointer"
                            >
                              {label}
                            </label>
                          </div>
                        ))}
                      </div>
                    ) : selectedCampaignDetails.contentFormats && selectedCampaignDetails.contentFormats.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {selectedCampaignDetails.contentFormats.map((format) => (
                          <Badge key={format} variant="secondary" className="text-xs">
                            {FORMAT_LABELS[format] || format}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">Not set</p>
                    )}
                  </div>

                  {/* Pricing Basis */}
                  <div>
                    <Label className="text-sm font-semibold mb-2 block">Pricing Basis</Label>
                    {isEditingCampaign && editedCampaignData ? (
                      <div className="space-y-2">
                        {Object.entries(PRICING_LABELS).map(([model, label]) => (
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
                              {label}
                            </label>
                          </div>
                        ))}
                      </div>
                    ) : selectedCampaignDetails.pricingModels && selectedCampaignDetails.pricingModels.length > 0 ? (
                      <div className="flex gap-2">
                        {selectedCampaignDetails.pricingModels.map((model) => (
                          <Badge key={model} variant="outline" className="uppercase">
                            {PRICING_LABELS[model] || model}
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
                        {(selectedCampaignDetails.targetViews || (isEditingCampaign && editedCampaignData?.pricingModels?.includes("cpm"))) && (
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
                        {(selectedCampaignDetails.targetClicks || (isEditingCampaign && editedCampaignData?.pricingModels?.includes("cpc"))) && (
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
                        {(selectedCampaignDetails.targetEngagements || (isEditingCampaign && editedCampaignData?.pricingModels?.includes("cpe"))) && (
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
                          <SelectItem value="protocol-review">Protocol Review</SelectItem>
                          <SelectItem value="tutorial">Tutorial / Walkthrough</SelectItem>
                          <SelectItem value="deep-dive">Deep Dive</SelectItem>
                          <SelectItem value="alpha-thread">Alpha Thread</SelectItem>
                          <SelectItem value="testimonial">Testimonial</SelectItem>
                          <SelectItem value="project-overview">Project Overview</SelectItem>
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
                        {["DeFi", "NFT & Digital Art", "GameFi", "Chains & Infrastructure", "Exchanges", "Memecoins", "DAOs & Governance", "AI x Crypto", "Wallets & Security", "Other"].map((niche) => (
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
                    <Label className="text-sm font-semibold mb-3 block">Project Details</Label>
                    <div className="space-y-3">
                      <div>
                        <Label className="text-xs text-muted-foreground mb-1 block">Project / Token Name</Label>
                        {isEditingCampaign && editedCampaignData ? (
                          <Input
                            value={editedCampaignData.productName || ""}
                            onChange={(e) => setEditedCampaignData({...editedCampaignData, productName: e.target.value})}
                            placeholder="e.g., Arbitrum, Uniswap"
                          />
                        ) : (
                          <p className="text-sm">{selectedCampaignDetails.productName || "Not set"}</p>
                        )}
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground mb-1 block">Token Price</Label>
                        {isEditingCampaign && editedCampaignData ? (
                          <Input
                            type="number"
                            value={editedCampaignData.productPrice || ""}
                            onChange={(e) => setEditedCampaignData({...editedCampaignData, productPrice: e.target.value})}
                            placeholder="e.g., 1.25"
                          />
                        ) : (
                          <p className="text-sm font-medium">
                            {selectedCampaignDetails.productPrice ? `$${selectedCampaignDetails.productPrice}` : "Not set"}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground mb-1 block">Project Link</Label>
                        {isEditingCampaign && editedCampaignData ? (
                          <Input
                            value={editedCampaignData.productLink || ""}
                            onChange={(e) => setEditedCampaignData({...editedCampaignData, productLink: e.target.value})}
                            placeholder="https://yourproject.xyz"
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
                        <Label className="text-xs text-muted-foreground mb-1 block">Project Description</Label>
                        {isEditingCampaign && editedCampaignData ? (
                          <Textarea
                            value={editedCampaignData.productDescription || ""}
                            onChange={(e) => setEditedCampaignData({...editedCampaignData, productDescription: e.target.value})}
                            placeholder="Enter project description"
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
                        <Label className="text-xs text-muted-foreground mb-1 block">Project Tag</Label>
                        {isEditingCampaign && editedCampaignData ? (
                          <Input
                            value={editedCampaignData.brandTag || ""}
                            onChange={(e) => setEditedCampaignData({...editedCampaignData, brandTag: e.target.value})}
                            placeholder="@yourproject"
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
                        <Label className="text-xs text-muted-foreground mb-1 block">Must Mention / Key Talking Points</Label>
                        {isEditingCampaign && editedCampaignData ? (
                          <Textarea
                            value={editedCampaignData.detailedRequirements || ""}
                            onChange={(e) => setEditedCampaignData({...editedCampaignData, detailedRequirements: e.target.value})}
                            placeholder="Key talking points, dos and don'ts, specific mentions..."
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
            <Card ref={applicationsRef} className="p-4 sm:p-6 mb-4 sm:mb-6">
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
                          : application.status === "invited"
                          ? "bg-violet-500/5 border-violet-500/20"
                          : application.status === "rejected"
                          ? "bg-muted border-border opacity-60"
                          : "bg-background border-border hover:border-primary/30"
                      } transition-colors`}
                    >
                      <div className="flex items-start gap-4">
                        {/* Avatar — clickable to view profile */}
                        <button
                          onClick={() => setViewingProfile(application as unknown as Record<string, unknown>)}
                          className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-2xl shrink-0 overflow-hidden hover:ring-2 hover:ring-primary/50 transition-all cursor-pointer"
                        >
                          {application.influencerAvatar && application.influencerAvatar.startsWith('data:') ? (
                            <img src={application.influencerAvatar} alt={application.influencerName} className="w-full h-full object-cover" />
                          ) : (
                            application.influencerAvatar || '👤'
                          )}
                        </button>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <button onClick={() => setViewingProfile(application as unknown as Record<string, unknown>)} className="font-semibold hover:text-primary transition-colors cursor-pointer">{application.influencerName}</button>
                                {application.collaborationStatus && getCollaborationStatusBadge(application.collaborationStatus)}
                              </div>
                              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                <span>{application.influencerUsername}</span>
                                <span>•</span>
                                <span>{application.influencerFollowers} followers</span>
                              </div>
                            </div>

                            {/* Action Buttons */}
                            {application.status === "invited" && (
                              <div className="flex items-center gap-2 shrink-0">
                                <span className="text-xs text-violet-600 bg-violet-500/10 px-2.5 py-1 rounded-full border border-violet-500/20">Waiting for response</span>
                              </div>
                            )}
                            {application.status === "pending" && (
                              <div className="flex gap-2 shrink-0">
                                <Button
                                  size="sm"
                                  className="bg-success/15 text-success border border-success/30 hover:bg-success/25"
                                  disabled={actionLoading}
                                  onClick={() => {
                                    setPriceModalData({ application, defaultPrice: application.proposedPriceCPM || '0' });
                                    setPriceModalValue(application.proposedPriceCPM || '0');
                                  }}
                                >
                                  <CheckCircle2 className="h-4 w-4 mr-1" />
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-red-600 border-red-200 hover:bg-red-50"
                                  disabled={actionLoading}
                                  onClick={async () => {
                                    setActionLoading(true);
                                    try {
                                      const res = await fetch(`/api/collaborations/${application.collaborationId}`, {
                                        method: 'PATCH',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ status: 'CANCELLED' }),
                                      });
                                      if (res.ok) {
                                        const updatedApplications = selectedCampaignDetails.applicationsList?.filter(app =>
                                          app.id !== application.id
                                        );
                                        setSelectedCampaignDetails({ ...selectedCampaignDetails, applicationsList: updatedApplications, applications: (updatedApplications?.length || 0) });
                                        showToast('Application rejected', 'success');
                                      } else {
                                        const data = await res.json();
                                        showToast(data.error || 'Failed to reject', 'error');
                                      }
                                    } catch { showToast('Failed to reject', 'error'); }
                                    finally { setActionLoading(false); }
                                  }}
                                >
                                  Reject
                                </Button>
                              </div>
                            )}
                          </div>

                          {/* Proposed Price */}
                          {application.proposedPriceCPM && (
                            <div className="flex flex-wrap gap-2 mb-2">
                              <div className="text-xs px-2.5 py-1 rounded-md bg-primary/10 text-primary font-medium border border-primary/20">
                                Proposed: ${application.proposedPriceCPM}
                              </div>
                            </div>
                          )}

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
                                  setTermsAccepted(false);
                                  setTermsHighlight(false);
                                  setShowInfluencerSelector(false);
                                }}
                                className={`w-full text-left px-3 py-2 rounded-md hover:bg-muted transition-colors ${
                                  selectedInfluencerForPipeline?.id === influencer.id
                                    ? "bg-primary/10 text-primary"
                                    : ""
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-xs shrink-0 overflow-hidden">
                                    {influencer.influencerAvatar?.startsWith('data:') ? (
                                      <img src={influencer.influencerAvatar} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                      <span className="text-white text-[10px]">{influencer.influencerName?.charAt(0) || '?'}</span>
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">{influencer.influencerName}</p>
                                    <p className="text-xs text-muted-foreground truncate">{influencer.influencerUsername}</p>
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
              {/* General Pipeline View — Creator Progress List */}
              {!selectedInfluencerForPipeline && (
                <div className="space-y-4">
                  {/* Campaign Progress Header */}
                  {(() => {
                    const approvedApps = selectedCampaignDetails.applicationsList?.filter(a => a.status === "approved") || [];
                    const needed = parseInt(selectedCampaignDetails.influencerCount || "0") || 0;
                    const completed = approvedApps.filter(a => a.collaborationStatus === "COMPLETED" || a.collaborationStatus === "RESOLVED").length;
                    const actionCount = approvedApps.filter(a => getActionInfo(a).type === "action").length;
                    // Also count pending (unapproved) applications as actions
                    const pendingApps = selectedCampaignDetails.applicationsList?.filter(a => a.status === "pending") || [];
                    const totalActions = actionCount + pendingApps.length;

                    return (
                      <>
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-lg">Campaign Progress</h3>
                            <p className="text-sm text-muted-foreground">
                              {completed} of {needed || approvedApps.length} completed
                            </p>
                          </div>
                          {totalActions > 0 && (
                            <button
                              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 transition-colors"
                              onClick={() => {
                                setIsApplicationsExpanded(true);
                                setTimeout(() => applicationsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
                              }}
                            >
                              <AlertCircle className="h-4 w-4 text-amber-600" />
                              <span className="text-sm font-medium text-amber-600">
                                {totalActions} action{totalActions > 1 ? 's' : ''} needed
                              </span>
                            </button>
                          )}
                        </div>

                        {/* Progress bar */}
                        {needed > 0 && (
                          <div className="w-full bg-muted rounded-full h-2">
                            <div
                              className="bg-primary rounded-full h-2 transition-all duration-500"
                              style={{ width: `${Math.min((completed / needed) * 100, 100)}%` }}
                            />
                          </div>
                        )}

                        {/* Invited — waiting for response */}
                        {(() => {
                          const invitedApps = selectedCampaignDetails.applicationsList?.filter(a => a.status === "invited") || [];
                          if (invitedApps.length === 0) return null;
                          return (
                            <div className="space-y-2">
                              {invitedApps.map((app) => (
                                <div key={app.id} className="rounded-lg border border-violet-500/20 bg-violet-500/5 p-4">
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-xs shrink-0 overflow-hidden">
                                      {app.influencerAvatar?.startsWith('data:') ? (
                                        <img src={app.influencerAvatar} alt="" className="w-full h-full object-cover" />
                                      ) : (
                                        <span className="text-white text-xs">{app.influencerName?.charAt(0) || '?'}</span>
                                      )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium truncate">{app.influencerName}</p>
                                      <p className="text-xs text-violet-600">Invited — waiting for response</p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          );
                        })()}

                        {/* Pending applications */}
                        {pendingApps.length > 0 && (
                          <div className="space-y-2">
                            {pendingApps.map((app) => (
                              <div
                                key={app.id}
                                className="rounded-lg border border-border p-4 hover:bg-muted/30 transition-colors cursor-pointer"
                                onClick={() => {
                                  setIsApplicationsExpanded(true);
                                  setTimeout(() => applicationsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
                                }}
                              >
                                <div className="flex items-center gap-3 mb-2">
                                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-xs shrink-0 overflow-hidden">
                                    {app.influencerAvatar?.startsWith('data:') ? (
                                      <img src={app.influencerAvatar} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                      <span className="text-white text-[10px]">{app.influencerName?.charAt(0) || '?'}</span>
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">{app.influencerName}</p>
                                    <p className="text-xs text-muted-foreground">New application</p>
                                  </div>
                                </div>
                                <div className="px-3 py-2 rounded-md bg-amber-500/10 border border-amber-500/20">
                                  <p className="text-xs font-medium text-amber-600">
                                    ACTION NEEDED
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    Review application — approve or reject
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Approved collaborations */}
                        {approvedApps.length > 0 && (
                          <div className="space-y-2">
                            {approvedApps.map((app) => {
                              const stageIdx = getStageIndex(app.collaborationStatus);
                              const action = getActionInfo(app);
                              return (
                                <div
                                  key={app.id}
                                  className={`rounded-lg border p-4 hover:bg-muted/30 transition-colors cursor-pointer ${app.collaborationStatus === "DISPUTED" ? "border-red-500/30 bg-red-500/5" : "border-border"}`}
                                  onClick={() => {
                                    setSelectedInfluencerForPipeline(app);
                                    setTermsAccepted(false);
                                    setTermsHighlight(false);
                                    setShowInfluencerSelector(false);
                                  }}
                                >
                                  <div className="flex items-center gap-3 mb-3">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-xs shrink-0 overflow-hidden">
                                      {app.influencerAvatar?.startsWith('data:') ? (
                                        <img src={app.influencerAvatar} alt="" className="w-full h-full object-cover" />
                                      ) : (
                                        <span className="text-white text-[10px]">{app.influencerName?.charAt(0) || '?'}</span>
                                      )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium truncate">{app.influencerName}</p>
                                      <p className="text-xs text-muted-foreground">{app.influencerUsername}</p>
                                    </div>
                                    {app.agreedPrice && (
                                      <span className="text-sm font-medium">${app.agreedPrice}</span>
                                    )}
                                  </div>

                                  {/* Stage labels */}
                                  <div className="flex items-center gap-1 mb-3">
                                    {COLLAB_STAGES.map((stage, idx) => (
                                      <div key={stage} className="contents">
                                        {idx > 0 && (
                                          <span className="text-muted-foreground/30 text-[10px]">/</span>
                                        )}
                                        <span className={`text-[11px] ${
                                          idx < stageIdx
                                            ? "text-foreground font-medium"
                                            : idx === stageIdx
                                            ? "text-foreground font-semibold"
                                            : "text-muted-foreground/40"
                                        }`}>
                                          {stage}
                                        </span>
                                      </div>
                                    ))}
                                  </div>

                                  {/* Action status */}
                                  {action.type === "action" ? (
                                    <div className="px-3 py-2 rounded-md bg-amber-500/10 border border-amber-500/20">
                                      <p className="text-xs font-medium text-amber-600">
                                        ACTION NEEDED
                                      </p>
                                      <p className="text-xs text-muted-foreground">
                                        {action.text}
                                      </p>
                                    </div>
                                  ) : action.type === "waiting" ? (
                                    <div className="px-3 py-2 rounded-md bg-muted/50 border border-border">
                                      <p className="text-xs font-medium text-muted-foreground">
                                        WAITING FOR CREATOR
                                      </p>
                                      <p className="text-xs text-muted-foreground">
                                        {action.text}
                                      </p>
                                    </div>
                                  ) : (
                                    <div className="px-3 py-2 rounded-md bg-success/10 border border-success/20">
                                      <p className="text-xs font-medium text-success">
                                        COMPLETED
                                      </p>
                                      <p className="text-xs text-muted-foreground">
                                        {action.text}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {/* Empty spots */}
                        {needed > 0 && approvedApps.length < needed && (
                          <div className="rounded-lg border border-dashed border-border p-4 text-center">
                            <p className="text-sm text-muted-foreground">
                              {needed - approvedApps.length} more creator{needed - approvedApps.length > 1 ? 's' : ''} needed
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Share your campaign or wait for applications
                            </p>
                          </div>
                        )}

                        {/* No applications at all */}
                        {(!selectedCampaignDetails.applicationsList || selectedCampaignDetails.applicationsList.length === 0) && (
                          <div className="text-center py-8 bg-muted/30 rounded-lg border border-dashed border-border">
                            <Users className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                            <p className="text-sm text-muted-foreground mb-1">No applications yet</p>
                            <p className="text-xs text-muted-foreground">
                              Creators will apply when they discover your campaign
                            </p>
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
              )}

              {/* Stage 1: Negotiation */}
              {selectedInfluencerForPipeline && (
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
                    <>
                      {/* Personalized Pipeline View */}
                      <div className="space-y-4">
                        {/* Influencer Info */}
                        <div className="flex items-center gap-3 pb-3 border-b">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-sm shrink-0">
                            {selectedInfluencerForPipeline.influencerAvatar?.startsWith('data:') ? (
                              <img src={selectedInfluencerForPipeline.influencerAvatar} alt="" className="w-full h-full object-cover rounded-full" />
                            ) : (
                              <span className="text-white text-xs">{selectedInfluencerForPipeline.influencerName?.charAt(0) || '?'}</span>
                            )}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold">
                              {selectedInfluencerForPipeline.collaborationStatus === "NEGOTIATING"
                                ? `Negotiation with ${selectedInfluencerForPipeline.influencerName}`
                                : `Collaboration with ${selectedInfluencerForPipeline.influencerName}`}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {selectedInfluencerForPipeline.influencerUsername} • {selectedInfluencerForPipeline.influencerFollowers} followers
                            </p>
                          </div>
                        </div>

                        {/* Stage 1 content: status-aware rendering */}
                        {["IN_PROGRESS", "CONTENT_REVIEW", "REVISION", "PUBLISHING", "DELIVERED", "COMPLETED", "RESOLVED", "DISPUTED"].includes(selectedInfluencerForPipeline.collaborationStatus ?? "") ? (
                          /* Completed Stage 1: read-only summary with badges */
                          <div className="space-y-3">
                            <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-success/10 border border-success/20">
                              <CheckCircle2 className="h-5 w-5 text-success" />
                              <div>
                                <p className="text-sm font-medium text-success">Terms Approved</p>
                                <p className="text-xs text-muted-foreground">Both parties have approved the collaboration terms</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-primary/10 border border-primary/20">
                              <Wallet className="h-5 w-5 text-primary" />
                              <div>
                                <p className="text-sm font-medium text-primary">Advance Payment Secured (50%)</p>
                                <p className="text-xs text-muted-foreground">
                                  ${selectedInfluencerForPipeline.agreedPrice ? (selectedInfluencerForPipeline.agreedPrice / 2).toFixed(0) : '0'} advance paid to creator
                                </p>
                              </div>
                            </div>

                          </div>
                        ) : selectedInfluencerForPipeline.collaborationStatus === "AGREED" ? (
                          /* AGREED: funds frozen, ready to start */
                          <div className="space-y-3">
                            <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-success/10 border border-success/20">
                              <CheckCircle2 className="h-5 w-5 text-success" />
                              <div>
                                <p className="text-sm font-medium text-success">Terms Approved</p>
                                <p className="text-xs text-muted-foreground">Both parties have approved the collaboration terms</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-primary/10 border border-primary/20">
                              <Wallet className="h-5 w-5 text-primary" />
                              <div>
                                <p className="text-sm font-medium text-primary">Funds Frozen (${selectedInfluencerForPipeline.agreedPrice ?? 0})</p>
                                <p className="text-xs text-muted-foreground">Ready to start campaign</p>
                              </div>
                            </div>
                          </div>
                        ) : (
                          /* NEGOTIATING: full editable negotiation UI */
                          <>
                            {/* Current Price */}
                            <div className="bg-muted/50 rounded-lg p-4">
                              <h4 className="text-sm font-semibold mb-2">
                                {selectedInfluencerForPipeline.agreedPrice ? 'Agreed Price' : 'Proposed Price'}
                              </h4>
                              <div className="text-lg font-bold text-primary">
                                ${selectedInfluencerForPipeline.agreedPrice ?? selectedInfluencerForPipeline.proposedPriceCPM ?? '0'}
                              </div>
                            </div>

                            {/* Project Terms */}
                            <div className="space-y-2">
                              <Label className="text-sm font-medium">Project Terms (Optional)</Label>
                              <textarea
                                className="w-full min-h-[80px] px-3 py-2 rounded-lg border border-border bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                                placeholder="Additional collaboration terms from project..."
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
                                onBlur={() => {
                                  if (selectedInfluencerForPipeline.collaborationId) {
                                    fetch(`/api/collaborations/${selectedInfluencerForPipeline.collaborationId}`, {
                                      method: 'PATCH',
                                      headers: { 'Content-Type': 'application/json' },
                                      body: JSON.stringify({ brandTerms: selectedInfluencerForPipeline.brandTerms || '' }),
                                    });
                                  }
                                }}
                              />
                            </div>

                            {/* Creator Terms */}
                            <div className="space-y-2">
                              <Label className="text-sm font-medium">Creator Terms</Label>
                              <textarea
                                className="w-full min-h-[80px] px-3 py-2 rounded-lg border border-border bg-muted/50 text-sm resize-none"
                                placeholder="Additional terms from creator..."
                                value={selectedInfluencerForPipeline.influencerTerms || ""}
                                disabled
                              />
                              <p className="text-xs text-muted-foreground">Creator can add their terms when reviewing</p>
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
                                I agree to the campaign terms, agreed price, and any additional terms from both parties
                              </span>
                            </label>

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

                            {/* Creator declined the price — brand can propose a new one */}
                            {selectedInfluencerForPipeline.influencerAgreed === false && (
                              <div className="space-y-2 pt-3 border-t">
                                <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                                  <AlertCircle className="h-5 w-5 text-amber-600 shrink-0" />
                                  <div>
                                    <p className="text-sm font-medium text-amber-600">
                                      Creator declined your offer of ${selectedInfluencerForPipeline.agreedPrice ?? 0}
                                    </p>
                                    <p className="text-xs text-muted-foreground">You can propose a new price or cancel the negotiation</p>
                                  </div>
                                </div>
                                <Button
                                  size="sm"
                                  className="w-full bg-gradient-to-r from-primary to-secondary"
                                  disabled={actionLoading}
                                  onClick={() => {
                                    setPriceModalData({ application: selectedInfluencerForPipeline, defaultPrice: String(selectedInfluencerForPipeline.agreedPrice ?? '0'), isNewOffer: true });
                                    setPriceModalValue(String(selectedInfluencerForPipeline.agreedPrice ?? '0'));
                                  }}
                                >
                                  Propose New Price
                                </Button>
                              </div>
                            )}

                            {/* Cancel Negotiation */}
                            {selectedInfluencerForPipeline.collaborationId && (
                              <div className="pt-1">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="w-full text-red-600 border-red-200 hover:bg-red-50"
                                  disabled={actionLoading}
                                  onClick={async () => {
                                    setActionLoading(true);
                                    try {
                                      const res = await fetch(`/api/collaborations/${selectedInfluencerForPipeline.collaborationId}`, {
                                        method: 'PATCH',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ status: 'CANCELLED' }),
                                      });
                                      if (res.ok) {
                                        const updatedApplications = selectedCampaignDetails.applicationsList?.filter(app =>
                                          app.id !== selectedInfluencerForPipeline.id
                                        );
                                        setSelectedCampaignDetails({ ...selectedCampaignDetails, applicationsList: updatedApplications, applications: (updatedApplications?.length || 0) });
                                        setSelectedInfluencerForPipeline(null);
                                        showToast('Negotiation ended', 'success');
                                      } else {
                                        const data = await res.json();
                                        showToast(data.error || 'Failed to cancel', 'error');
                                      }
                                    } catch { showToast('Failed to cancel negotiation', 'error'); }
                                    finally { setActionLoading(false); }
                                  }}
                                >
                                  Cancel Negotiation
                                </Button>
                              </div>
                            )}
                          </>
                        )}

                        {/* === Collaboration Lifecycle Actions === */}

                        {/* Download Agreement — available from AGREED onwards */}
                        {["AGREED", "IN_PROGRESS", "CONTENT_REVIEW", "REVISION", "PUBLISHING", "DELIVERED", "COMPLETED", "DISPUTED", "RESOLVED"].includes(selectedInfluencerForPipeline.collaborationStatus ?? "") && selectedInfluencerForPipeline.collaborationId && (
                          <a
                            href={`/api/collaborations/${selectedInfluencerForPipeline.collaborationId}/agreement`}
                            download
                            className="inline-flex items-center gap-2 text-sm text-primary hover:underline mb-3"
                          >
                            <FileText className="h-4 w-4" />
                            Download Agreement
                          </a>
                        )}

                        {/* Creator accepted price — Start Campaign (freeze + advance) */}
                        {selectedInfluencerForPipeline.collaborationStatus === "NEGOTIATING" && selectedInfluencerForPipeline.influencerAgreed === true && selectedInfluencerForPipeline.collaborationId && (
                          <div className="space-y-3 pt-3 border-t">
                            <div className="p-3 rounded-lg bg-success/10 border border-success/20">
                              <p className="text-sm font-medium text-success mb-1">Creator accepted the price!</p>
                              <p className="text-xs text-muted-foreground">
                                ${selectedInfluencerForPipeline.agreedPrice ?? 0} will be frozen from your balance. 50% advance (${selectedInfluencerForPipeline.agreedPrice ? (selectedInfluencerForPipeline.agreedPrice / 2).toFixed(0) : '...'}) will be paid to the creator.
                              </p>
                            </div>

                            <Button
                              onClick={async () => {
                                if (!termsAccepted) {
                                  setTermsHighlight(true);
                                  setTimeout(() => setTermsHighlight(false), 2000);
                                  showToast('Please accept the terms first', 'error');
                                  return;
                                }
                                setActionLoading(true);
                                try {
                                  // Step 1: Agree (freeze funds)
                                  const agreeRes = await fetch(`/api/collaborations/${selectedInfluencerForPipeline.collaborationId}/agree`, {
                                    method: 'POST',
                                  });
                                  if (!agreeRes.ok) {
                                    const data = await agreeRes.json();
                                    const errorMsg = data.error || 'Failed to start campaign';
                                    showToast(errorMsg, 'error');
                                    if (errorMsg.toLowerCase().includes('insufficient balance')) {
                                      setShowInsufficientFundsDialog(true);
                                    }
                                    return;
                                  }
                                  // Step 2: Start (IN_PROGRESS + 50% advance)
                                  await handleStartCampaign(selectedInfluencerForPipeline.collaborationId!);
                                } catch { showToast('Failed to start campaign', 'error'); }
                                finally { setActionLoading(false); }
                              }}
                              disabled={actionLoading}
                              className="w-full bg-gradient-to-r from-primary to-secondary"
                            >
                              <Rocket className="h-4 w-4 mr-2" />
                              {actionLoading ? "Starting..." : "Start Campaign"}
                            </Button>
                          </div>
                        )}

                        {/* AGREED: Start Campaign button (legacy — if somehow in AGREED status) */}
                        {selectedInfluencerForPipeline.collaborationStatus === "AGREED" && selectedInfluencerForPipeline.collaborationId && (
                          <div className="space-y-3 pt-3 border-t">
                            <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                              <p className="text-xs text-muted-foreground">
                                50% advance (${selectedInfluencerForPipeline.agreedPrice ? (selectedInfluencerForPipeline.agreedPrice / 2).toFixed(0) : '...'}) will be paid to the creator when you start.
                              </p>
                            </div>
                            <Button
                              onClick={() => handleStartCampaign(selectedInfluencerForPipeline.collaborationId!)}
                              disabled={actionLoading}
                              className="w-full bg-gradient-to-r from-primary to-secondary"
                            >
                              <Rocket className="h-4 w-4 mr-2" />
                              {actionLoading ? "Starting..." : "Start Campaign"}
                            </Button>
                          </div>
                        )}

                        {/* COMPLETED or RESOLVED: Payment summary */}
                        {(selectedInfluencerForPipeline.collaborationStatus === "COMPLETED" || selectedInfluencerForPipeline.collaborationStatus === "RESOLVED") && (
                          <div className="space-y-3 pt-3 border-t">
                            <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-success/10 border border-success/20">
                              <CheckCircle2 className="h-5 w-5 text-success" />
                              <div>
                                <p className="text-sm font-medium text-success">
                                  {selectedInfluencerForPipeline.collaborationStatus === "COMPLETED" ? "Completed" : "Resolved"}
                                </p>
                                <p className="text-xs text-muted-foreground">All payments processed.</p>
                              </div>
                            </div>
                            {selectedInfluencerForPipeline.agreedPrice && (
                              <div className="p-3 rounded-lg bg-muted/50 border border-border">
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                  <div className="flex items-center justify-between p-2 rounded bg-background/50">
                                    <span className="text-muted-foreground">50% Advance</span>
                                    <span className="font-medium">${(selectedInfluencerForPipeline.agreedPrice / 2).toFixed(2)}</span>
                                  </div>
                                  <div className="flex items-center justify-between p-2 rounded bg-background/50">
                                    <span className="text-muted-foreground">50% Final</span>
                                    <span className="font-medium">${(selectedInfluencerForPipeline.agreedPrice / 2).toFixed(2)}</span>
                                  </div>
                                  <div className="col-span-2 flex items-center justify-between p-2 rounded bg-primary/5 border border-primary/20">
                                    <span className="text-muted-foreground font-medium">Total Paid</span>
                                    <span className="font-bold text-primary">${selectedInfluencerForPipeline.agreedPrice.toFixed(2)}</span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </>
                </div>
              </div>
              )}

              {/* Stage 2: Content Review & Approval */}
              {selectedInfluencerForPipeline && (
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                    ["IN_PROGRESS", "CONTENT_REVIEW", "REVISION", "PUBLISHING", "DELIVERED", "COMPLETED", "RESOLVED"].includes(selectedInfluencerForPipeline.collaborationStatus ?? "")
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}>
                    2
                  </div>
                  <div className="w-0.5 h-full bg-border mt-2" />
                </div>
                <div className="flex-1 pb-6">
                    <>
                      {/* Personalized View */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 pb-3 border-b">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-sm shrink-0">
                            {selectedInfluencerForPipeline.influencerAvatar?.startsWith('data:') ? (
                              <img src={selectedInfluencerForPipeline.influencerAvatar} alt="" className="w-full h-full object-cover rounded-full" />
                            ) : (
                              <span className="text-white text-xs">{selectedInfluencerForPipeline.influencerName?.charAt(0) || '?'}</span>
                            )}
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

                        {/* Content review - show different UI based on collaboration status */}
                        {["PUBLISHING", "DELIVERED", "COMPLETED", "RESOLVED"].includes(selectedInfluencerForPipeline.collaborationStatus ?? "") ? (
                          /* Content already approved - show completed state */
                          <div className="space-y-3">
                            <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-success/10 border border-success/20">
                              <CheckCircle2 className="h-5 w-5 text-success" />
                              <div className="flex-1">
                                <p className="text-sm font-medium text-success">Content Approved</p>
                                <p className="text-xs text-muted-foreground">
                                  Creator is now publishing the content
                                </p>
                              </div>
                            </div>
                            {selectedInfluencerForPipeline.contentUrl && (
                              <div className="p-3 rounded-lg bg-muted/30 border border-border">
                                <div className="flex items-center gap-2 mb-1">
                                  <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                                  <span className="text-xs font-medium text-muted-foreground">Submitted Content</span>
                                </div>
                                <a href={selectedInfluencerForPipeline.contentUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline break-all">
                                  {selectedInfluencerForPipeline.contentUrl}
                                </a>
                              </div>
                            )}
                          </div>
                        ) : (selectedInfluencerForPipeline.contentUrl || (selectedInfluencerForPipeline.contentRevisions && selectedInfluencerForPipeline.contentRevisions.length > 0)) ? (
                          <div className="space-y-3">
                            {/* Show contentUrl directly if no revisions history */}
                            {(!selectedInfluencerForPipeline.contentRevisions || selectedInfluencerForPipeline.contentRevisions.length === 0) && selectedInfluencerForPipeline.contentUrl && (
                              <div className="space-y-3">
                                <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                                  <div className="flex items-center gap-2 mb-1">
                                    <ExternalLink className="h-3.5 w-3.5 text-blue-600" />
                                    <span className="text-xs font-medium text-blue-600">Submitted Content</span>
                                  </div>
                                  <a href={selectedInfluencerForPipeline.contentUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline break-all">
                                    {selectedInfluencerForPipeline.contentUrl}
                                  </a>
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  Revision {selectedInfluencerForPipeline.revisionCount ?? 0}/3
                                </div>
                                {selectedInfluencerForPipeline.collaborationStatus === "REVISION" ? (
                                  <div className="px-4 py-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                                    <p className="text-sm font-medium text-amber-600">Revision requested</p>
                                    <p className="text-xs text-muted-foreground mt-1">Waiting for creator to resubmit updated content.</p>
                                    {selectedInfluencerForPipeline.revisionNote && (
                                      <p className="text-xs text-muted-foreground mt-2">Your note: &quot;{selectedInfluencerForPipeline.revisionNote}&quot;</p>
                                    )}
                                  </div>
                                ) : ["DISPUTED", "RESOLVED", "COMPLETED", "DELIVERED", "PUBLISHING"].includes(selectedInfluencerForPipeline.collaborationStatus ?? "") ? null : (<>
                                <div className="flex gap-2">
                                  <Button
                                    onClick={() => handleApproveContent(selectedInfluencerForPipeline.collaborationId!)}
                                    disabled={actionLoading}
                                    className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white"
                                  >
                                    <CheckCircle2 className="h-4 w-4 mr-2" />
                                    {actionLoading ? "Approving..." : "Approve Content"}
                                  </Button>
                                  <Button
                                    variant="outline"
                                    onClick={() => setShowRevisionInput(true)}
                                    disabled={actionLoading || (selectedInfluencerForPipeline.revisionCount ?? 0) >= 3}
                                    className="flex-1 border-amber-500 text-amber-600 hover:bg-amber-50"
                                  >
                                    <MessageSquare className="h-4 w-4 mr-2" />
                                    Request Revision
                                  </Button>
                                </div>
                                {showRevisionInput && (
                                  <div className="space-y-2">
                                    <textarea
                                      className="w-full min-h-[80px] px-3 py-2 rounded-lg border border-border bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                                      placeholder="Describe what needs to be changed..."
                                      value={revisionNoteText}
                                      onChange={(e) => setRevisionNoteText(e.target.value)}
                                    />
                                    <div className="flex gap-2">
                                      <Button variant="outline" size="sm" onClick={() => { setShowRevisionInput(false); setRevisionNoteText(""); }} className="flex-1">Cancel</Button>
                                      <Button size="sm" disabled={actionLoading || !revisionNoteText.trim()} onClick={() => handleRequestRevision(selectedInfluencerForPipeline.collaborationId!, revisionNoteText)} className="flex-1 bg-amber-500 hover:bg-amber-600 text-white">
                                        {actionLoading ? "Sending..." : "Send Revision"}
                                      </Button>
                                    </div>
                                  </div>
                                )}
                                </>)}
                              </div>
                            )}

                            {/* Legacy revision history */}
                            {selectedInfluencerForPipeline.contentRevisions && selectedInfluencerForPipeline.contentRevisions.length > 0 && (
                            <><h4 className="text-sm font-semibold">Revision History</h4>

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
                            </>)}
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
                      </div>
                    </>
                </div>
              </div>
              )}

              {/* Stage 3: Publication & Delivery */}
              {selectedInfluencerForPipeline && (
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                    ["PUBLISHING", "DELIVERED", "COMPLETED", "RESOLVED", "DISPUTED"].includes(selectedInfluencerForPipeline.collaborationStatus ?? "")
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}>
                    3
                  </div>
                </div>
                <div className="flex-1">
                    <>
                      {/* Personalized View */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 pb-3 border-b">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-sm shrink-0">
                            {selectedInfluencerForPipeline.influencerAvatar?.startsWith('data:') ? (
                              <img src={selectedInfluencerForPipeline.influencerAvatar} alt="" className="w-full h-full object-cover rounded-full" />
                            ) : (
                              <span className="text-white text-xs">{selectedInfluencerForPipeline.influencerName?.charAt(0) || '?'}</span>
                            )}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold">
                              Publication by {selectedInfluencerForPipeline.influencerName}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              Track published content
                            </p>
                          </div>
                          {selectedInfluencerForPipeline.metricsTargetReached && (
                            <Badge className="bg-success/10 text-success border-success/20">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Target Reached
                            </Badge>
                          )}
                        </div>

                        {!selectedInfluencerForPipeline.contentApproved && !["PUBLISHING", "DELIVERED", "COMPLETED", "RESOLVED", "DISPUTED"].includes(selectedInfluencerForPipeline.collaborationStatus ?? "") ? (
                          <div className="text-center py-8 bg-muted/30 rounded-lg border border-dashed border-border">
                            <Clock className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                            <p className="text-sm text-muted-foreground">
                              Waiting for content approval
                            </p>
                          </div>
                        ) : (
                          <>
                            {/* Published URLs */}
                            {(selectedInfluencerForPipeline.publishedUrls && selectedInfluencerForPipeline.publishedUrls.length > 0) || selectedInfluencerForPipeline.publishedUrl ? (
                              <div className="space-y-3">
                                <div className="bg-background rounded-lg p-4 border border-border">
                                  <div className="flex items-center gap-2 mb-2">
                                    <Rocket className="h-4 w-4 text-success" />
                                    <span className="text-sm font-medium">Published Content</span>
                                  </div>
                                  {selectedInfluencerForPipeline.publishedUrls && selectedInfluencerForPipeline.publishedUrls.length > 0 ? (
                                    <div className="space-y-2">
                                      {selectedInfluencerForPipeline.publishedUrls.map((url, idx) => {
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
                                  ) : selectedInfluencerForPipeline.publishedUrl ? (
                                    <a
                                      href={selectedInfluencerForPipeline.publishedUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-sm text-primary hover:underline break-all flex items-center gap-1"
                                    >
                                      {selectedInfluencerForPipeline.publishedUrl}
                                      <ExternalLink className="h-3 w-3" />
                                    </a>
                                  ) : null}
                                  <p className="text-xs text-muted-foreground mt-2">
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

                                {/* Approve & Pay / Dispute buttons for DELIVERED status */}
                                {selectedInfluencerForPipeline.collaborationStatus === "DELIVERED" && selectedInfluencerForPipeline.collaborationId && (
                                  <div className="space-y-3">
                                    <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                                      <Clock className="h-5 w-5 text-amber-600" />
                                      <p className="text-xs text-muted-foreground">
                                        {(() => {
                                          if (!selectedInfluencerForPipeline.deliveredAt) return 'Auto-release in 7 days if no action is taken';
                                          const delivered = new Date(selectedInfluencerForPipeline.deliveredAt);
                                          const releaseDate = new Date(delivered.getTime() + 7 * 24 * 60 * 60 * 1000);
                                          const daysLeft = Math.max(0, Math.ceil((releaseDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000)));
                                          return daysLeft <= 0 ? 'Auto-release imminent — payment will be processed soon' : `Auto-release in ${daysLeft} day${daysLeft !== 1 ? 's' : ''} if no action is taken`;
                                        })()}
                                      </p>
                                    </div>
                                    {!showDisputeInput ? (
                                      <div className="flex gap-2">
                                        <Button
                                          className="flex-1 bg-gradient-to-r from-secondary to-primary"
                                          disabled={actionLoading}
                                          onClick={() => handleApproveDelivery(selectedInfluencerForPipeline.collaborationId!)}
                                        >
                                          <CheckCircle2 className="h-4 w-4 mr-2" />
                                          {actionLoading ? "Processing..." : "Approve & Pay (50%)"}
                                        </Button>
                                        <Button
                                          variant="outline"
                                          className="border-red-500/30 text-red-600 hover:bg-red-500/10"
                                          disabled={actionLoading}
                                          onClick={() => setShowDisputeInput(true)}
                                        >
                                          <AlertCircle className="h-4 w-4 mr-2" />
                                          Dispute
                                        </Button>
                                      </div>
                                    ) : (
                                      <div className="space-y-3">
                                        <Select value={disputeCategory} onValueChange={setDisputeCategory}>
                                          <SelectTrigger className="h-10">
                                            <SelectValue placeholder="Select dispute reason..." />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="not-matching-brief">Content doesn&apos;t match brief</SelectItem>
                                            <SelectItem value="low-quality">Low quality content</SelectItem>
                                            <SelectItem value="not-published">Not published as agreed</SelectItem>
                                            <SelectItem value="wrong-platform">Published on wrong platform</SelectItem>
                                            <SelectItem value="other">Other</SelectItem>
                                          </SelectContent>
                                        </Select>
                                        <Textarea
                                          placeholder="Describe the issue in detail..."
                                          value={disputeReasonText}
                                          onChange={(e) => setDisputeReasonText(e.target.value)}
                                          className="min-h-[80px]"
                                        />
                                        <div className="flex gap-2">
                                          <Button
                                            variant="outline"
                                            className="border-red-500/30 text-red-600 hover:bg-red-500/10"
                                            disabled={actionLoading || !disputeReasonText.trim() || !disputeCategory}
                                            onClick={() => handleDispute(selectedInfluencerForPipeline.collaborationId!, `[${disputeCategory}] ${disputeReasonText.trim()}`)}
                                          >
                                            {actionLoading ? "Filing..." : "File Dispute"}
                                          </Button>
                                          <Button
                                            variant="ghost"
                                            onClick={() => { setShowDisputeInput(false); setDisputeReasonText(""); setDisputeCategory(""); }}
                                          >
                                            Cancel
                                          </Button>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                )}


                                {/* Disputed status */}
                                {selectedInfluencerForPipeline.collaborationStatus === "DISPUTED" && (
                                  <div className="rounded-lg border border-red-500/20 overflow-hidden">
                                    <div className="flex items-center gap-2 px-4 py-3 bg-red-500/10">
                                      <AlertCircle className="h-4 w-4 text-red-600" />
                                      <p className="text-sm font-medium text-red-600">Dispute filed — under review</p>
                                    </div>
                                    {selectedInfluencerForPipeline.disputeReason && (() => {
                                      const match = (selectedInfluencerForPipeline.disputeReason ?? '').match(/^\[(.+?)\]\s*([\s\S]*)/);
                                      const category = match ? match[1].replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()) : null;
                                      const comment = match ? match[2] : selectedInfluencerForPipeline.disputeReason;
                                      return (
                                        <div className="px-4 py-3 space-y-2">
                                          {category && (
                                            <span className="inline-block text-xs font-medium px-2 py-0.5 rounded-full bg-red-500/10 text-red-600 border border-red-500/20">{category}</span>
                                          )}
                                          {comment && <p className="text-sm text-muted-foreground">{comment}</p>}
                                          <p className="text-xs text-muted-foreground">Platform team will investigate and resolve.</p>
                                        </div>
                                      );
                                    })()}
                                  </div>
                                )}

                                {/* Completed status */}
                                {selectedInfluencerForPipeline.collaborationStatus === "COMPLETED" && (
                                  <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-success/10 border border-success/20">
                                    <CheckCircle2 className="h-5 w-5 text-success" />
                                    <div className="flex-1">
                                      <p className="text-sm font-medium text-success">Collaboration Completed</p>
                                      <p className="text-xs text-muted-foreground">
                                        Final payment released to creator
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
                </div>
              </div>
              )}
            </div>
          </Card>
        </>
      ) : (
        <>
          <div className="mb-6">
            <h1 className="text-xl sm:text-3xl font-bold mb-2">My Campaigns</h1>
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
            <Select value={campaignStatusFilter} onValueChange={(value: "all" | "active" | "draft" | "paused" | "completed") => setCampaignStatusFilter(value)}>
              <SelectTrigger className="w-[180px] h-11 bg-card">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
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
                  onClick={() => handleOpenCampaign(campaign)}
                >
              {/* Name Column */}
              <div className="w-[320px] flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <Briefcase className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <h3 className="text-sm font-semibold truncate">{campaign.title}</h3>
                    {(() => {
                      const pending = campaign.applicationsList?.filter(a => a.status === "pending").length || 0;
                      const actionNeeded = (campaign.applicationsList?.filter(a => a.status === "approved" && getActionInfo(a).type === "action").length || 0);
                      const total = pending + actionNeeded;
                      if (total === 0) return null;
                      if (total === 1) return <span className="inline-flex w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />;
                      return <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-amber-500 text-white text-[10px] font-bold shrink-0">{total}</span>;
                    })()}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={campaign.status === "active" ? "default" : "secondary"}
                      className={`w-[80px] justify-center ${
                        campaign.status === "active"
                          ? "bg-success/10 text-success border-success/20 hover:bg-success/20"
                          : campaign.status === "paused"
                          ? "bg-amber-500/10 text-amber-600 border-amber-500/20 hover:bg-amber-500/20"
                          : "bg-primary/10 text-primary border-primary/20 hover:bg-primary/20"
                      }`}
                    >
                      <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                        campaign.status === "active" ? "bg-success"
                        : campaign.status === "completed" ? "bg-primary"
                        : campaign.status === "paused" ? "bg-amber-500"
                        : "bg-primary"
                      }`} />
                      {campaign.status === "active" ? "Active" : campaign.status === "paused" ? "Paused" : campaign.status === "completed" ? "Completed" : "Draft"}
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
                {(() => {
                  const counts = getPipelineCounts(campaign.applicationsList);
                  const stageLabels = ["Negotiating", "In Progress", "Content", "Published", "Done"];
                  const stageColors = [
                    { active: "bg-primary/10 text-primary", label: "text-foreground" },
                    { active: "bg-secondary/10 text-secondary", label: "text-foreground" },
                    { active: "bg-blue-500/10 text-blue-600", label: "text-foreground" },
                    { active: "bg-purple-500/10 text-purple-600", label: "text-foreground" },
                    { active: "bg-success/10 text-success", label: "text-foreground" },
                  ];
                  return (
                    <div className="flex items-center gap-1 mb-2">
                      {stageLabels.map((label, idx) => (
                        <div key={label} className="contents">
                          {idx > 0 && <ArrowRight className="h-3 w-3 text-muted-foreground/40 mt-4" />}
                          <div className="flex flex-col items-center gap-1 flex-1">
                            <span className={`text-[9px] font-semibold uppercase tracking-wider ${
                              counts[idx] > 0 ? stageColors[idx].label : "text-muted-foreground"
                            }`}>
                              {label}
                            </span>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${
                              counts[idx] > 0
                                ? stageColors[idx].active
                                : "bg-muted/50 text-muted-foreground"
                            }`}>
                              {counts[idx]}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>

              {/* Actions Column */}
              <div className="w-[140px] flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                <button
                  title="Edit campaign"
                  disabled={actionLoading}
                  className="p-2 rounded-lg hover:bg-muted transition-colors"
                  onClick={() => handleEditCampaign(campaign)}
                >
                  <Pencil className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                </button>
                {campaign.status === "draft" && (
                  <button
                    title="Launch campaign"
                    disabled={actionLoading}
                    className="p-2 rounded-lg hover:bg-muted transition-colors"
                    onClick={() => handleTogglePause(campaign, 'ACTIVE')}
                  >
                    <Rocket className="h-4 w-4 text-primary hover:text-primary/80" />
                  </button>
                )}
                {(campaign.status === "active" || campaign.status === "paused") && (
                  <button
                    title={campaign.status === "paused" ? "Resume campaign" : "Pause campaign"}
                    disabled={actionLoading}
                    className="p-2 rounded-lg hover:bg-muted transition-colors"
                    onClick={() => handleTogglePause(campaign)}
                  >
                    {campaign.status === "paused" ? (
                      <Play className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                    ) : (
                      <Pause className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                    )}
                  </button>
                )}
                <button
                  title="Delete campaign"
                  disabled={actionLoading}
                  className="p-2 rounded-lg hover:bg-muted transition-colors hover:text-red-600"
                  onClick={() => { setDeletingCampaign(campaign); setDeleteConfirmText(""); }}
                >
                  <Trash2 className="h-4 w-4 text-muted-foreground hover:text-red-600" />
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
                  onClick={() => handleOpenCampaign(campaign)}
                  className="p-4 cursor-pointer hover:bg-muted/20 transition-colors"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                      <Briefcase className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-1">
                        <h3 className="text-sm font-semibold leading-tight truncate">{campaign.title}</h3>
                        {(() => {
                          const pending = campaign.applicationsList?.filter(a => a.status === "pending").length || 0;
                          const actionNeeded = (campaign.applicationsList?.filter(a => a.status === "approved" && getActionInfo(a).type === "action").length || 0);
                          const total = pending + actionNeeded;
                          if (total === 0) return null;
                          if (total === 1) return <span className="inline-flex w-2 h-2 rounded-full bg-amber-500 shrink-0" />;
                          return <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-amber-500 text-white text-[8px] font-bold shrink-0">{total}</span>;
                        })()}
                      </div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <Badge
                          variant={campaign.status === "active" ? "default" : "secondary"}
                          className={`text-[10px] px-2 py-0 h-5 ${
                            campaign.status === "active"
                              ? "bg-success/10 text-success border-success/20"
                              : campaign.status === "paused"
                              ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                              : "bg-primary/10 text-primary border-primary/20"
                          }`}
                        >
                          <div className={`w-1.5 h-1.5 rounded-full mr-1 ${
                            campaign.status === "active" ? "bg-success"
                            : campaign.status === "paused" ? "bg-amber-500"
                            : "bg-primary"
                          }`} />
                          {campaign.status === "active" ? "Active" : campaign.status === "paused" ? "Paused" : campaign.status === "completed" ? "Completed" : "Draft"}
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
                      {(() => {
                        const counts = getPipelineCounts(campaign.applicationsList);
                        const labels = ["Negotiating", "In Progress", "Content", "Published", "Done"];
                        const colors = [
                          { active: "bg-primary/10 text-primary", label: "text-foreground" },
                          { active: "bg-secondary/10 text-secondary", label: "text-foreground" },
                          { active: "bg-blue-500/10 text-blue-600", label: "text-foreground" },
                          { active: "bg-purple-500/10 text-purple-600", label: "text-foreground" },
                          { active: "bg-success/10 text-success", label: "text-foreground" },
                        ];
                        return (
                          <div className="flex items-center gap-1">
                            {labels.map((label, idx) => (
                              <div key={label} className="contents">
                                {idx > 0 && <ArrowRight className="h-2.5 w-2.5 text-muted-foreground/40 mb-3" />}
                                <div className="flex flex-col items-center gap-1 flex-1">
                                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-semibold ${
                                    counts[idx] > 0 ? colors[idx].active : "bg-muted/50 text-muted-foreground"
                                  }`}>
                                    {counts[idx]}
                                  </div>
                                  <span className={`text-[8px] font-medium ${
                                    counts[idx] > 0 ? colors[idx].label : "text-muted-foreground"
                                  }`}>{label}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        );
                      })()}
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
      {/* Price Offer Modal */}
      {priceModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-background border border-border rounded-2xl p-6 w-full max-w-sm mx-4 shadow-2xl">
            <h3 className="text-lg font-bold mb-1">
              {priceModalData.isNewOffer ? 'Propose New Price' : 'Approve & Set Price'}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {priceModalData.isNewOffer
                ? `Creator declined your previous offer. Enter a new price.`
                : `Creator proposed $${priceModalData.defaultPrice}. You can accept or adjust.`}
            </p>
            <div className="mb-4">
              <label className="text-sm font-medium mb-1 block">Your offer price ($)</label>
              <input
                type="number"
                value={priceModalValue}
                onChange={(e) => setPriceModalValue(e.target.value)}
                placeholder="Enter price"
                className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                autoFocus
                min="1"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setPriceModalData(null)}
                className="flex-1 px-4 py-2 text-sm rounded-lg border border-border hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  const priceNum = parseFloat(priceModalValue);
                  if (isNaN(priceNum) || priceNum <= 0) {
                    showToast('Please enter a valid price', 'error');
                    return;
                  }
                  setActionLoading(true);
                  try {
                    const brandTermsValue = priceModalData.application.brandTerms || undefined;
                    const body = priceModalData.isNewOffer
                      ? { agreedPrice: priceNum, ...(brandTermsValue ? { brandTerms: brandTermsValue } : {}) }
                      : { status: 'NEGOTIATING', agreedPrice: priceNum, brandAgreed: true, ...(brandTermsValue ? { brandTerms: brandTermsValue } : {}) };
                    const res = await fetch(`/api/collaborations/${priceModalData.application.collaborationId}`, {
                      method: 'PATCH',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(body),
                    });
                    if (res.ok) {
                      const updatedApplications = selectedCampaignDetails?.applicationsList?.map(app =>
                        app.id === priceModalData.application.id
                          ? { ...app, status: 'approved' as const, collaborationStatus: 'NEGOTIATING' as CollaborationStatus, agreedPrice: priceNum, influencerAgreed: undefined }
                          : app
                      );
                      if (selectedCampaignDetails) {
                        setSelectedCampaignDetails({ ...selectedCampaignDetails, applicationsList: updatedApplications });
                      }
                      if (selectedInfluencerForPipeline?.id === priceModalData.application.id) {
                        setSelectedInfluencerForPipeline({ ...selectedInfluencerForPipeline, agreedPrice: priceNum, influencerAgreed: undefined });
                      }
                      showToast(priceModalData.isNewOffer ? `New offer of $${priceNum} sent` : `Approved with offer of $${priceNum}`, 'success');
                    } else {
                      const data = await res.json();
                      showToast(data.error || 'Failed', 'error');
                    }
                  } catch { showToast('Failed', 'error'); }
                  finally {
                    setActionLoading(false);
                    setPriceModalData(null);
                  }
                }}
                disabled={actionLoading || !priceModalValue || parseFloat(priceModalValue) <= 0}
                className="flex-1 px-4 py-2 text-sm rounded-lg bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {actionLoading ? 'Sending...' : priceModalData.isNewOffer ? 'Send Offer' : 'Approve'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Creator Profile Modal */}
      {viewingProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-background border border-border rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-3xl shrink-0 overflow-hidden">
                {(viewingProfile.influencerAvatar as string)?.startsWith('data:') ? (
                  <img src={viewingProfile.influencerAvatar as string} alt="" className="w-full h-full object-cover" />
                ) : '👤'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold">{viewingProfile.influencerName as string}</h3>
                  {(viewingProfile.influencerVerified as boolean) && (
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{viewingProfile.influencerUsername as string}</p>
                {(viewingProfile.influencerNiche as string) && (
                  <p className="text-xs text-primary mt-1">{viewingProfile.influencerNiche as string}</p>
                )}
              </div>
            </div>

            {(viewingProfile.influencerBio as string) && (
              <p className="text-sm text-muted-foreground mb-4">{viewingProfile.influencerBio as string}</p>
            )}

            <div className="grid grid-cols-2 gap-3 mb-4">
              {Number(viewingProfile.influencerFollowers) > 0 && (
                <div className="bg-muted/50 rounded-lg p-2 text-center">
                  <p className="text-sm font-semibold">{viewingProfile.influencerFollowers as string}</p>
                  <p className="text-xs text-muted-foreground">Instagram</p>
                </div>
              )}
              {Number(viewingProfile.influencerTwitterFollowers) > 0 && (
                <div className="bg-muted/50 rounded-lg p-2 text-center">
                  <p className="text-sm font-semibold">{(viewingProfile.influencerTwitterFollowers as number).toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">X (Twitter)</p>
                </div>
              )}
              {Number(viewingProfile.influencerTiktokFollowers) > 0 && (
                <div className="bg-muted/50 rounded-lg p-2 text-center">
                  <p className="text-sm font-semibold">{(viewingProfile.influencerTiktokFollowers as number).toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">TikTok</p>
                </div>
              )}
              {Number(viewingProfile.influencerYoutubeSubscribers) > 0 && (
                <div className="bg-muted/50 rounded-lg p-2 text-center">
                  <p className="text-sm font-semibold">{(viewingProfile.influencerYoutubeSubscribers as number).toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">YouTube</p>
                </div>
              )}
              {Number(viewingProfile.influencerTelegramFollowers) > 0 && (
                <div className="bg-muted/50 rounded-lg p-2 text-center">
                  <p className="text-sm font-semibold">{(viewingProfile.influencerTelegramFollowers as number).toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Telegram</p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 mb-4">
              {(viewingProfile.influencerTwitter as string) && (
                <a href={(viewingProfile.influencerTwitter as string).startsWith('http') ? viewingProfile.influencerTwitter as string : `https://x.com/${(viewingProfile.influencerTwitter as string).replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-all text-sm">
                  <XIcon className="h-4 w-4 shrink-0" />
                  <span className="truncate">{(viewingProfile.influencerTwitter as string).replace(/https?:\/\/(www\.)?x\.com\/|https?:\/\/(www\.)?twitter\.com\//g, '@')}</span>
                </a>
              )}
              {(viewingProfile.influencerInstagram as string) && (
                <a href={(viewingProfile.influencerInstagram as string).startsWith('http') ? viewingProfile.influencerInstagram as string : `https://instagram.com/${viewingProfile.influencerInstagram as string}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-all text-sm">
                  <Instagram className="h-4 w-4 shrink-0" />
                  <span className="truncate">{(viewingProfile.influencerInstagram as string).replace(/https?:\/\/(www\.)?instagram\.com\//g, '@').split('?')[0]}</span>
                </a>
              )}
              {(viewingProfile.influencerTiktok as string) && (
                <a href={(viewingProfile.influencerTiktok as string).startsWith('http') ? viewingProfile.influencerTiktok as string : `https://tiktok.com/@${viewingProfile.influencerTiktok as string}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-all text-sm">
                  <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" /></svg>
                  <span className="truncate">{(viewingProfile.influencerTiktok as string).replace(/https?:\/\/(www\.)?tiktok\.com\//g, '').split('?')[0]}</span>
                </a>
              )}
              {(viewingProfile.influencerYoutube as string) && (
                <a href={(viewingProfile.influencerYoutube as string).startsWith('http') ? viewingProfile.influencerYoutube as string : `https://youtube.com/${viewingProfile.influencerYoutube as string}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-all text-sm">
                  <Youtube className="h-4 w-4 shrink-0" />
                  <span className="truncate">{(viewingProfile.influencerYoutube as string).replace(/https?:\/\/(www\.)?youtube\.com\//g, '').split('?')[0]}</span>
                </a>
              )}
              {(viewingProfile.influencerTelegram as string) && (
                <a href={`https://t.me/${(viewingProfile.influencerTelegram as string).replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-all text-sm">
                  <Send className="h-4 w-4 shrink-0" />
                  <span className="truncate">@{(viewingProfile.influencerTelegram as string).replace('@', '')}</span>
                </a>
              )}
            </div>

            <button
              onClick={() => setViewingProfile(null)}
              className="w-full px-4 py-2 text-sm rounded-lg border border-border hover:bg-muted transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Delete Campaign Modal */}
      {deletingCampaign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-background border border-border rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl">
            <h3 className="text-lg font-bold mb-1 text-destructive">Delete Campaign</h3>
            <p className="text-sm text-muted-foreground mb-4">
              This action is permanent and cannot be undone. All campaign data will be deleted.
            </p>
            <p className="text-sm mb-2">
              Type <span className="font-semibold">{deletingCampaign.title}</span> to confirm:
            </p>
            <input
              type="text"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder={deletingCampaign.title}
              className="w-full px-3 py-2 border border-border rounded-lg text-sm mb-4 bg-background focus:outline-none focus:ring-2 focus:ring-destructive/50"
              autoFocus
            />
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => { setDeletingCampaign(null); setDeleteConfirmText(""); }}
                className="px-4 py-2 text-sm rounded-lg border border-border hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteCampaign}
                disabled={deleteConfirmText !== deletingCampaign.title || actionLoading}
                className="px-4 py-2 text-sm rounded-lg bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {actionLoading ? 'Deleting...' : 'Delete Campaign'}
              </button>
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
    </motion.div>
  );
}
