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
  followers: number;
  status: string;
  isVerified: boolean;
  isFeatured: boolean;
  createdAt: string;
}

export default function AdminInfluencers() {
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const [selectedInfluencer, setSelectedInfluencer] = useState<Influencer | null>(null);

  const fetchInfluencers = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/influencers");
      const data = await res.json();
      // Map nested profile.email to flat email
      const mapped = (data.influencers || []).map((inf: Record<string, unknown>) => ({
        ...inf,
        email: (inf.profile as Record<string, unknown>)?.email || '',
        fullName: (inf.profile as Record<string, unknown>)?.fullName || '',
      }));
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
    const matchesTab = activeTab === "all" || inf.status === activeTab;
    const matchesSearch =
      !search ||
      inf.handle?.toLowerCase().includes(search.toLowerCase()) ||
      inf.email?.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const tabCounts = {
    all: influencers.length,
    pending: influencers.filter((i) => i.status === "pending").length,
    approved: influencers.filter((i) => i.status === "approved").length,
    rejected: influencers.filter((i) => i.status === "rejected").length,
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
                        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <span className="text-sm font-semibold text-primary">
                            {inf.handle?.charAt(0)?.toUpperCase() || "?"}
                          </span>
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
                            inf.status === "approved"
                              ? "bg-green-500/10 text-green-600 border-green-500/20"
                              : inf.status === "pending"
                                ? "bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
                                : "bg-red-500/10 text-red-600 border-red-500/20"
                          }
                        >
                          {inf.status}
                        </Badge>
                      </div>

                      <div className="sm:col-span-2 flex items-center justify-end gap-2">
                        {inf.status !== "approved" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-green-600 border-green-500/30 hover:bg-green-500/10 text-xs"
                            disabled={updatingId === inf.id}
                            onClick={() =>
                              updateInfluencer(inf.id, { status: "approved" })
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
                        {inf.status !== "rejected" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 border-red-500/30 hover:bg-red-500/10 text-xs"
                            disabled={updatingId === inf.id}
                            onClick={() =>
                              updateInfluencer(inf.id, { status: "rejected" })
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
      {selectedInfluencer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setSelectedInfluencer(null)}>
          <div className="bg-background border border-border rounded-2xl p-6 w-full max-w-lg mx-4 shadow-2xl max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Influencer Profile</h3>
              <Button variant="ghost" size="sm" onClick={() => setSelectedInfluencer(null)}>
                <XCircle className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex items-center gap-4 mb-4 pb-4 border-b">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-xl font-bold text-primary">{selectedInfluencer.handle?.charAt(0)?.toUpperCase()}</span>
              </div>
              <div>
                <p className="font-semibold text-lg">@{selectedInfluencer.handle}</p>
                <p className="text-sm text-muted-foreground">{selectedInfluencer.email}</p>
                {selectedInfluencer.fullName && <p className="text-sm text-muted-foreground">{selectedInfluencer.fullName}</p>}
              </div>
            </div>

            <div className="space-y-3 text-sm">
              {selectedInfluencer.bio && (
                <div>
                  <p className="font-medium text-muted-foreground mb-1">Bio</p>
                  <p>{selectedInfluencer.bio}</p>
                </div>
              )}

              {selectedInfluencer.niche && selectedInfluencer.niche.length > 0 && (
                <div>
                  <p className="font-medium text-muted-foreground mb-1">Niche</p>
                  <div className="flex gap-1 flex-wrap">
                    {selectedInfluencer.niche.map((n: string) => (
                      <Badge key={n} className="bg-primary/10 text-primary border-primary/20">{n}</Badge>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <p className="font-medium text-muted-foreground mb-2">Social Media</p>
                <div className="space-y-2">
                  {selectedInfluencer.instagramHandle && (
                    <div className="flex items-center justify-between rounded-lg border border-border p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                          <span className="text-white text-xs font-bold">IG</span>
                        </div>
                        <a href={selectedInfluencer.instagramHandle.startsWith('http') ? selectedInfluencer.instagramHandle : `https://instagram.com/${selectedInfluencer.instagramHandle}`} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-primary hover:underline">
                          {selectedInfluencer.instagramHandle.includes('instagram.com/') ? selectedInfluencer.instagramHandle.split('instagram.com/')[1]?.split('?')[0] || selectedInfluencer.instagramHandle : selectedInfluencer.instagramHandle}
                        </a>
                      </div>
                      {selectedInfluencer.instagramFollowers > 0 && (
                        <Badge className="bg-muted text-foreground border-border">{selectedInfluencer.instagramFollowers.toLocaleString()} followers</Badge>
                      )}
                    </div>
                  )}
                  {selectedInfluencer.tiktokHandle && (
                    <div className="flex items-center justify-between rounded-lg border border-border p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center">
                          <span className="text-white text-xs font-bold">TT</span>
                        </div>
                        <a href={selectedInfluencer.tiktokHandle.startsWith('http') ? selectedInfluencer.tiktokHandle : `https://tiktok.com/@${selectedInfluencer.tiktokHandle}`} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-primary hover:underline">
                          {selectedInfluencer.tiktokHandle.includes('tiktok.com/') ? selectedInfluencer.tiktokHandle.split('tiktok.com/')[1]?.split('?')[0] || selectedInfluencer.tiktokHandle : selectedInfluencer.tiktokHandle}
                        </a>
                      </div>
                      {selectedInfluencer.tiktokFollowers > 0 && (
                        <Badge className="bg-muted text-foreground border-border">{selectedInfluencer.tiktokFollowers.toLocaleString()} followers</Badge>
                      )}
                    </div>
                  )}
                  {selectedInfluencer.youtubeHandle && (
                    <div className="flex items-center justify-between rounded-lg border border-border p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center">
                          <span className="text-white text-xs font-bold">YT</span>
                        </div>
                        <a href={selectedInfluencer.youtubeHandle.startsWith('http') ? selectedInfluencer.youtubeHandle : `https://youtube.com/@${selectedInfluencer.youtubeHandle}`} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-primary hover:underline">
                          {selectedInfluencer.youtubeHandle.includes('youtube.com/') ? selectedInfluencer.youtubeHandle.split('youtube.com/')[1]?.split('?')[0] || selectedInfluencer.youtubeHandle : selectedInfluencer.youtubeHandle}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <p className="font-medium text-muted-foreground">Status:</p>
                <Badge className={
                  selectedInfluencer.status === "approved" ? "bg-green-500/10 text-green-600 border-green-500/20" :
                  selectedInfluencer.status === "pending" ? "bg-yellow-500/10 text-yellow-600 border-yellow-500/20" :
                  "bg-red-500/10 text-red-600 border-red-500/20"
                }>{selectedInfluencer.status}</Badge>
              </div>

              <p className="text-muted-foreground">Registered: {new Date(selectedInfluencer.createdAt).toLocaleDateString()}</p>
            </div>

            <div className="flex gap-2 mt-6 pt-4 border-t">
              {selectedInfluencer.status !== "approved" && (
                <Button
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => {
                    updateInfluencer(selectedInfluencer.id, { status: "approved" });
                    setSelectedInfluencer({ ...selectedInfluencer, status: "approved" });
                  }}
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Approve
                </Button>
              )}
              {selectedInfluencer.status !== "rejected" && (
                <Button
                  variant="outline"
                  className="flex-1 text-red-600 border-red-500/30 hover:bg-red-500/10"
                  onClick={() => {
                    updateInfluencer(selectedInfluencer.id, { status: "rejected" });
                    setSelectedInfluencer({ ...selectedInfluencer, status: "rejected" });
                  }}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
