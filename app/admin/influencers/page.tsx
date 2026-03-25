"use client";

import { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AdminNav } from "@/components/admin-nav";
import { motion } from "framer-motion";
import {
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
  Search,
} from "lucide-react";
import { Input } from "@/components/ui/input";

const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.4, 0.25, 1] as const,
    },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

type FilterTab = "all" | "pending" | "approved" | "rejected";

interface Influencer {
  id: number;
  handle: string;
  email: string;
  fullName: string;
  bio?: string;
  niche?: string[];
  instagramHandle?: string;
  instagramFollowers: number;
  tiktokHandle?: string;
  tiktokFollowers: number;
  youtubeHandle?: string;
  youtubeSubscribers: number;
  twitterHandle?: string;
  twitterFollowers: number;
  followers: number;
  status: string;
  isVerified: boolean;
  isFeatured: boolean;
  createdAt: string;
  profile?: {
    email?: string;
    fullName?: string;
    avatarUrl?: string;
  };
  cpmMin?: number;
  cpmMax?: number;
  cpcMin?: number;
  cpcMax?: number;
  cpeMin?: number;
  cpeMax?: number;
}

export default function AdminInfluencers() {
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const [selectedInfluencer, setSelectedInfluencer] = useState<Influencer | null>(null);
  const [editingFollowers, setEditingFollowers] = useState(false);
  const [editIG, setEditIG] = useState('');
  const [editTT, setEditTT] = useState('');
  const [editYT, setEditYT] = useState('');
  const [editTW, setEditTW] = useState('');
  const [savingFollowers, setSavingFollowers] = useState(false);

  const fetchInfluencers = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/influencers");
      const data = await res.json();
      // Map nested profile.email to flat email
      const mapped = (data.influencers || []).map((inf: Record<string, unknown>) => {
        const profile = inf.profile as Record<string, unknown> | undefined;
        return {
          ...inf,
          status: typeof inf.status === 'string' ? inf.status.charAt(0).toUpperCase() + inf.status.slice(1).toLowerCase() : inf.status,
          email: profile?.email || '',
          fullName: profile?.fullName || '',
          profile: profile ? {
            email: profile.email as string | undefined,
            fullName: profile.fullName as string | undefined,
            avatarUrl: profile.avatarUrl as string | undefined,
          } : undefined,
        };
      });
      setInfluencers(mapped);
    } catch (error) {
      console.error("Failed to fetch influencers:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInfluencers();
  }, [fetchInfluencers]);

  const updateInfluencer = async (
    id: number,
    updates: { status?: string; isVerified?: boolean; isFeatured?: boolean }
  ) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/admin/influencers/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      if (res.ok) {
        setInfluencers((prev) =>
          prev.map((inf) => (inf.id === id ? { ...inf, ...updates } : inf))
        );
      }
    } catch (error) {
      console.error("Failed to update influencer:", error);
    } finally {
      setUpdatingId(null);
    }
  };

  const tabs: { key: FilterTab; label: string; icon: typeof Users }[] = [
    { key: "all", label: "All", icon: Users },
    { key: "pending", label: "Pending", icon: Clock },
    { key: "approved", label: "Approved", icon: CheckCircle2 },
    { key: "rejected", label: "Rejected", icon: XCircle },
  ];

  const filtered = influencers.filter((inf) => {
    const matchesTab = activeTab === "all" || inf.status?.toLowerCase() === activeTab;
    const matchesSearch =
      !search ||
      inf.handle?.toLowerCase().includes(search.toLowerCase()) ||
      inf.email?.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const extractUsername = (url: string, platform: string): string => {
    if (!url) return "";
    const prefixes: Record<string, string[]> = {
      instagram: ["https://www.instagram.com/", "https://instagram.com/", "http://www.instagram.com/", "http://instagram.com/"],
      tiktok: ["https://www.tiktok.com/", "https://tiktok.com/", "http://www.tiktok.com/", "http://tiktok.com/"],
      youtube: ["https://www.youtube.com/", "https://youtube.com/", "http://www.youtube.com/", "http://youtube.com/"],
      twitter: ["https://x.com/", "https://twitter.com/", "http://x.com/", "http://twitter.com/"],
    };
    let cleaned = url.trim();
    const platformPrefixes = prefixes[platform] || [];
    for (const prefix of platformPrefixes) {
      if (cleaned.toLowerCase().startsWith(prefix)) {
        cleaned = cleaned.slice(prefix.length);
        break;
      }
    }
    cleaned = cleaned.split("?")[0].replace(/\/$/, "");
    if (cleaned.startsWith("@")) {
      cleaned = cleaned.slice(1);
    }
    return cleaned;
  };

  const formatCents = (min?: number, max?: number): string | null => {
    if (!min && !max) return null;
    const fmtMin = min ? `$${(min / 100).toFixed(2)}` : null;
    const fmtMax = max ? `$${(max / 100).toFixed(2)}` : null;
    if (fmtMin && fmtMax) return `${fmtMin} — ${fmtMax}`;
    if (fmtMin) return `from ${fmtMin}`;
    if (fmtMax) return `up to ${fmtMax}`;
    return null;
  };

  const tabCounts = {
    all: influencers.length,
    pending: influencers.filter((i) => i.status?.toLowerCase() === "pending").length,
    approved: influencers.filter((i) => i.status?.toLowerCase() === "approved").length,
    rejected: influencers.filter((i) => i.status?.toLowerCase() === "rejected").length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <AdminNav />
        <div className="pt-20 flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminNav />

      <main className="pt-20 pb-12 px-6 sm:px-12 lg:px-16">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {/* Header */}
          <motion.div
            variants={fadeInUp}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          >
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Influencers
              </h1>
              <p className="text-muted-foreground mt-1">
                Manage influencer registrations and approvals
              </p>
            </div>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by handle or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </motion.div>

          {/* Filter Tabs */}
          <motion.div variants={fadeInUp} className="flex gap-2 flex-wrap">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <Button
                  key={tab.key}
                  variant={activeTab === tab.key ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveTab(tab.key)}
                  className={
                    activeTab === tab.key
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground"
                  }
                >
                  <Icon className="h-4 w-4 mr-1.5" />
                  {tab.label}
                  <span className="ml-1.5 text-xs opacity-70">
                    ({tabCounts[tab.key]})
                  </span>
                </Button>
              );
            })}
          </motion.div>

          {/* Influencer List */}
          <motion.div variants={fadeInUp}>
            <Card className="border border-border/50 overflow-hidden">
              {/* Table Header */}
              <div className="hidden sm:grid grid-cols-12 gap-4 p-4 bg-muted/30 border-b border-border/50 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <div className="col-span-3">Handle</div>
                <div className="col-span-3">Email</div>
                <div className="col-span-2">Followers</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-2 text-right">Actions</div>
              </div>

              <div className="divide-y divide-border/50">
                {filtered.length === 0 ? (
                  <div className="p-12 text-center text-muted-foreground text-sm">
                    {search
                      ? "No influencers match your search"
                      : "No influencers in this category"}
                  </div>
                ) : (
                  filtered.map((inf) => (
                    <div
                      key={inf.id}
                      className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 p-4 items-center hover:bg-muted/20 transition-colors cursor-pointer"
                      onClick={() => setSelectedInfluencer(inf)}
                    >
                      <div className="sm:col-span-3 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0 overflow-hidden">
                          {inf.profile?.avatarUrl ? (
                            <img src={inf.profile.avatarUrl} alt={inf.handle} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-sm font-semibold text-primary">
                              {inf.handle?.charAt(0)?.toUpperCase() || "?"}
                            </span>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            @{inf.handle}
                          </p>
                          {inf.isVerified && (
                            <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20 text-[10px]">
                              Verified
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <p className="text-sm text-muted-foreground">
                          {inf.email}
                        </p>
                      </div>

                      <div className="sm:col-span-2">
                        <p className="text-sm text-foreground">
                          {(inf.followers || 0).toLocaleString()}
                        </p>
                      </div>

                      <div className="sm:col-span-2">
                        <Badge
                          className={
                            inf.status === "Approved"
                              ? "bg-green-500/10 text-green-600 border-green-500/20"
                              : inf.status === "Pending"
                                ? "bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
                                : "bg-red-500/10 text-red-600 border-red-500/20"
                          }
                        >
                          {inf.status}
                        </Badge>
                      </div>

                      <div className="sm:col-span-2 flex items-center justify-end gap-2">
                        {inf.status !== "Approved" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-green-600 border-green-500/30 hover:bg-green-500/10 text-xs"
                            disabled={updatingId === inf.id}
                            onClick={() =>
                              updateInfluencer(inf.id, { status: "Approved" })
                            }
                          >
                            {updatingId === inf.id ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                            )}
                            Approve
                          </Button>
                        )}
                        {inf.status !== "Rejected" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 border-red-500/30 hover:bg-red-500/10 text-xs"
                            disabled={updatingId === inf.id}
                            onClick={() =>
                              updateInfluencer(inf.id, { status: "Rejected" })
                            }
                          >
                            {updatingId === inf.id ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <XCircle className="h-3 w-3 mr-1" />
                            )}
                            Reject
                          </Button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </main>

      {/* Profile Detail Modal */}
      {selectedInfluencer && (() => {
        const displayHandle = selectedInfluencer.handle?.startsWith("@")
          ? selectedInfluencer.handle
          : `@${selectedInfluencer.handle}`;
        const avatarUrl = selectedInfluencer.profile?.avatarUrl;
        const cpmRate = formatCents(selectedInfluencer.cpmMin, selectedInfluencer.cpmMax);
        const cpcRate = formatCents(selectedInfluencer.cpcMin, selectedInfluencer.cpcMax);
        const cpeRate = formatCents(selectedInfluencer.cpeMin, selectedInfluencer.cpeMax);
        const hasRates = cpmRate || cpcRate || cpeRate;

        return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setSelectedInfluencer(null)}>
          <div className="bg-background border border-border rounded-2xl p-6 w-full max-w-lg mx-4 shadow-2xl max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            {/* Close button */}
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold">Influencer Profile</h3>
              <Button variant="ghost" size="sm" onClick={() => setSelectedInfluencer(null)}>
                <XCircle className="h-5 w-5" />
              </Button>
            </div>

            {/* Header: Avatar + Info */}
            <div className="flex items-center gap-4 mb-5 pb-5 border-b border-border/50">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center shrink-0 overflow-hidden">
                {avatarUrl ? (
                  <img src={avatarUrl} alt={selectedInfluencer.handle} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl font-bold text-primary">{selectedInfluencer.handle?.charAt(0)?.toUpperCase()}</span>
                )}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-lg truncate">{displayHandle}</p>
                {selectedInfluencer.fullName && (
                  <p className="text-sm text-muted-foreground">{selectedInfluencer.fullName}</p>
                )}
                <p className="text-sm text-muted-foreground truncate">{selectedInfluencer.email}</p>
              </div>
              <div className="ml-auto">
                <Badge className={
                  selectedInfluencer.status === "Approved" ? "bg-green-500/10 text-green-600 border-green-500/20" :
                  selectedInfluencer.status === "Pending" ? "bg-yellow-500/10 text-yellow-600 border-yellow-500/20" :
                  "bg-red-500/10 text-red-600 border-red-500/20"
                }>{selectedInfluencer.status}</Badge>
              </div>
            </div>

            <div className="space-y-4 text-sm">
              {/* Bio */}
              {selectedInfluencer.bio && (
                <div>
                  <p className="font-medium text-muted-foreground mb-1">Bio</p>
                  <p className="text-foreground">{selectedInfluencer.bio}</p>
                </div>
              )}

              {/* Niche */}
              {selectedInfluencer.niche && selectedInfluencer.niche.length > 0 && (
                <div>
                  <p className="font-medium text-muted-foreground mb-1.5">Niche</p>
                  <div className="flex gap-1.5 flex-wrap">
                    {selectedInfluencer.niche.map((n: string) => (
                      <Badge key={n} className="bg-primary/10 text-primary border-primary/20">{n}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Social Media */}
              <div>
                <p className="font-medium text-muted-foreground mb-2">Social Media</p>
                <div className="space-y-2">
                  {selectedInfluencer.instagramHandle && (
                    <a
                      href={selectedInfluencer.instagramHandle.startsWith("http") ? selectedInfluencer.instagramHandle : `https://instagram.com/${selectedInfluencer.instagramHandle.replace(/^@/, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between rounded-lg border border-border p-3 hover:bg-muted/30 transition-colors group"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center">
                          <svg className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                            <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                          </svg>
                        </div>
                        <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                          @{extractUsername(selectedInfluencer.instagramHandle, "instagram")}
                        </span>
                      </div>
                      {selectedInfluencer.instagramFollowers > 0 && (
                        <Badge className="bg-muted text-foreground border-border text-xs">{selectedInfluencer.instagramFollowers.toLocaleString()}</Badge>
                      )}
                    </a>
                  )}
                  {selectedInfluencer.tiktokHandle && (
                    <a
                      href={selectedInfluencer.tiktokHandle.startsWith("http") ? selectedInfluencer.tiktokHandle : `https://tiktok.com/@${selectedInfluencer.tiktokHandle.replace(/^@/, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between rounded-lg border border-border p-3 hover:bg-muted/30 transition-colors group"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center">
                          <svg className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                          </svg>
                        </div>
                        <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                          @{extractUsername(selectedInfluencer.tiktokHandle, "tiktok")}
                        </span>
                      </div>
                      {selectedInfluencer.tiktokFollowers > 0 && (
                        <Badge className="bg-muted text-foreground border-border text-xs">{selectedInfluencer.tiktokFollowers.toLocaleString()}</Badge>
                      )}
                    </a>
                  )}
                  {selectedInfluencer.youtubeHandle && (
                    <a
                      href={selectedInfluencer.youtubeHandle.startsWith("http") ? selectedInfluencer.youtubeHandle : `https://youtube.com/@${selectedInfluencer.youtubeHandle.replace(/^@/, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between rounded-lg border border-border p-3 hover:bg-muted/30 transition-colors group"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center">
                          <svg className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
                            <path d="m10 15 5-3-5-3z" />
                          </svg>
                        </div>
                        <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                          @{extractUsername(selectedInfluencer.youtubeHandle, "youtube")}
                        </span>
                      </div>
                    </a>
                  )}
                  {selectedInfluencer.twitterHandle && (
                    <a
                      href={selectedInfluencer.twitterHandle.startsWith("http") ? selectedInfluencer.twitterHandle : `https://x.com/${selectedInfluencer.twitterHandle.replace(/^@/, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between rounded-lg border border-border p-3 hover:bg-muted/30 transition-colors group"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-foreground flex items-center justify-center">
                          <svg className="h-4 w-4 text-background" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                        </div>
                        <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                          @{extractUsername(selectedInfluencer.twitterHandle, "twitter")}
                        </span>
                      </div>
                      {selectedInfluencer.twitterFollowers > 0 && (
                        <Badge className="bg-muted text-foreground border-border text-xs">{selectedInfluencer.twitterFollowers.toLocaleString()}</Badge>
                      )}
                    </a>
                  )}
                </div>
              </div>

              {/* Edit Followers */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-muted-foreground">Follower Counts</p>
                  {!editingFollowers ? (
                    <Button variant="ghost" size="sm" className="text-xs h-7" onClick={() => {
                      setEditingFollowers(true);
                      setEditIG(String(selectedInfluencer.instagramFollowers || 0));
                      setEditTT(String(selectedInfluencer.tiktokFollowers || 0));
                      setEditYT(String(selectedInfluencer.youtubeSubscribers || 0));
                      setEditTW(String(selectedInfluencer.twitterFollowers || 0));
                    }}>
                      Edit
                    </Button>
                  ) : (
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" className="text-xs h-7" onClick={() => setEditingFollowers(false)}>Cancel</Button>
                      <Button size="sm" className="text-xs h-7" disabled={savingFollowers} onClick={async () => {
                        setSavingFollowers(true);
                        try {
                          const res = await fetch(`/api/admin/influencers/${selectedInfluencer.id}`, {
                            method: 'PATCH',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              instagramFollowers: parseInt(editIG) || 0,
                              tiktokFollowers: parseInt(editTT) || 0,
                              youtubeSubscribers: parseInt(editYT) || 0,
                              twitterFollowers: parseInt(editTW) || 0,
                            }),
                          });
                          if (res.ok) {
                            const updated = { ...selectedInfluencer, instagramFollowers: parseInt(editIG) || 0, tiktokFollowers: parseInt(editTT) || 0, youtubeSubscribers: parseInt(editYT) || 0, twitterFollowers: parseInt(editTW) || 0 };
                            setSelectedInfluencer(updated);
                            setInfluencers(prev => prev.map(i => i.id === updated.id ? { ...i, ...updated } : i));
                            setEditingFollowers(false);
                          }
                        } catch (e) { console.error(e); }
                        finally { setSavingFollowers(false); }
                      }}>
                        {savingFollowers ? 'Saving...' : 'Save'}
                      </Button>
                    </div>
                  )}
                </div>
                {editingFollowers ? (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <div className="rounded-lg border border-border p-2">
                      <p className="text-[10px] text-muted-foreground mb-1">Instagram</p>
                      <Input type="number" value={editIG} onChange={(e) => setEditIG(e.target.value)} className="h-8 text-sm" min="0" />
                    </div>
                    <div className="rounded-lg border border-border p-2">
                      <p className="text-[10px] text-muted-foreground mb-1">TikTok</p>
                      <Input type="number" value={editTT} onChange={(e) => setEditTT(e.target.value)} className="h-8 text-sm" min="0" />
                    </div>
                    <div className="rounded-lg border border-border p-2">
                      <p className="text-[10px] text-muted-foreground mb-1">YouTube</p>
                      <Input type="number" value={editYT} onChange={(e) => setEditYT(e.target.value)} className="h-8 text-sm" min="0" />
                    </div>
                    <div className="rounded-lg border border-border p-2">
                      <p className="text-[10px] text-muted-foreground mb-1">X/Twitter</p>
                      <Input type="number" value={editTW} onChange={(e) => setEditTW(e.target.value)} className="h-8 text-sm" min="0" />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <div className="rounded-lg border border-border p-2 text-center">
                      <p className="text-[10px] text-muted-foreground mb-0.5">Instagram</p>
                      <p className="text-sm font-semibold">{(selectedInfluencer.instagramFollowers || 0).toLocaleString()}</p>
                    </div>
                    <div className="rounded-lg border border-border p-2 text-center">
                      <p className="text-[10px] text-muted-foreground mb-0.5">TikTok</p>
                      <p className="text-sm font-semibold">{(selectedInfluencer.tiktokFollowers || 0).toLocaleString()}</p>
                    </div>
                    <div className="rounded-lg border border-border p-2 text-center">
                      <p className="text-[10px] text-muted-foreground mb-0.5">YouTube</p>
                      <p className="text-sm font-semibold">{(selectedInfluencer.youtubeSubscribers || 0).toLocaleString()}</p>
                    </div>
                    <div className="rounded-lg border border-border p-2 text-center">
                      <p className="text-[10px] text-muted-foreground mb-0.5">X/Twitter</p>
                      <p className="text-sm font-semibold">{(selectedInfluencer.twitterFollowers || 0).toLocaleString()}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* CPM/CPC/CPE Rates */}
              {hasRates && (
                <div>
                  <p className="font-medium text-muted-foreground mb-2">Pricing Rates</p>
                  <div className="grid grid-cols-3 gap-2">
                    {cpmRate && (
                      <div className="rounded-lg border border-border p-3 text-center">
                        <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1">CPM</p>
                        <p className="text-sm font-semibold text-foreground">{cpmRate}</p>
                      </div>
                    )}
                    {cpcRate && (
                      <div className="rounded-lg border border-border p-3 text-center">
                        <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1">CPC</p>
                        <p className="text-sm font-semibold text-foreground">{cpcRate}</p>
                      </div>
                    )}
                    {cpeRate && (
                      <div className="rounded-lg border border-border p-3 text-center">
                        <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1">CPE</p>
                        <p className="text-sm font-semibold text-foreground">{cpeRate}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <p className="text-xs text-muted-foreground">Registered {new Date(selectedInfluencer.createdAt).toLocaleDateString()}</p>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2 mt-6 pt-4 border-t border-border/50">
              {selectedInfluencer.status !== "Approved" && (
                <Button
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => {
                    updateInfluencer(selectedInfluencer.id, { status: "Approved" });
                    setSelectedInfluencer({ ...selectedInfluencer, status: "Approved" });
                  }}
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Approve
                </Button>
              )}
              {selectedInfluencer.status !== "Rejected" && (
                <Button
                  variant="outline"
                  className="flex-1 text-red-600 border-red-500/30 hover:bg-red-500/10"
                  onClick={() => {
                    updateInfluencer(selectedInfluencer.id, { status: "Rejected" });
                    setSelectedInfluencer({ ...selectedInfluencer, status: "Rejected" });
                  }}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
              )}
            </div>
          </div>
        </div>
        );
      })()}
    </div>
  );
}
