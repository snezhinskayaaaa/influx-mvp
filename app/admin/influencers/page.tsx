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
      ease: [0.25, 0.4, 0.25, 1],
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

  const fetchInfluencers = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/influencers");
      const data = await res.json();
      setInfluencers(data.influencers || []);
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
                      className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 p-4 items-center hover:bg-muted/20 transition-colors"
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
    </div>
  );
}
