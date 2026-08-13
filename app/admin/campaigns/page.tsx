"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AdminNav } from "@/components/admin-nav";
import { motion } from "framer-motion";
import {
  Target,
  Loader2,
  Search,
  Users,
  CheckCircle2,
  Clock,
  Pause,
  XCircle,
} from "lucide-react";

const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.4, 0.25, 1] as const } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};

type FilterTab = "all" | "active" | "paused" | "draft" | "completed";

interface Campaign {
  id: string;
  title: string;
  status: string;
  budgetMin: number;
  budgetMax: number;
  desiredInfluencerCount: number;
  createdAt: string;
  brand: { companyName: string };
  _count: { collaborations: number };
}

export default function AdminCampaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<FilterTab>("all");

  useEffect(() => {
    fetch("/api/admin/campaigns")
      .then(r => r.json())
      .then(data => setCampaigns(data.campaigns || []))
      .catch(e => console.error("Failed to fetch campaigns:", e))
      .finally(() => setLoading(false));
  }, []);

  const tabs: { key: FilterTab; label: string; icon: typeof Target }[] = [
    { key: "all", label: "All", icon: Target },
    { key: "active", label: "Active", icon: CheckCircle2 },
    { key: "paused", label: "Paused", icon: Pause },
    { key: "draft", label: "Draft", icon: Clock },
    { key: "completed", label: "Completed", icon: XCircle },
  ];

  const tabCounts = {
    all: campaigns.length,
    active: campaigns.filter(c => c.status === "ACTIVE").length,
    paused: campaigns.filter(c => c.status === "PAUSED").length,
    draft: campaigns.filter(c => c.status === "DRAFT").length,
    completed: campaigns.filter(c => c.status === "COMPLETED" || c.status === "CANCELLED").length,
  };

  const filtered = campaigns.filter(c => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q || c.title.toLowerCase().includes(q) || c.brand.companyName.toLowerCase().includes(q);
    const matchesTab = activeTab === "all" || c.status === activeTab.toUpperCase()
      || (activeTab === "completed" && (c.status === "COMPLETED" || c.status === "CANCELLED"));
    return matchesSearch && matchesTab;
  });

  const statusBadge = (status: string) => {
    const map: Record<string, { className: string; label: string }> = {
      ACTIVE: { className: "bg-green-500/10 text-green-600 border-green-500/20", label: "Active" },
      PAUSED: { className: "bg-amber-500/10 text-amber-600 border-amber-500/20", label: "Paused" },
      DRAFT: { className: "bg-muted text-muted-foreground border-border", label: "Draft" },
      COMPLETED: { className: "bg-primary/10 text-primary border-primary/20", label: "Completed" },
      CANCELLED: { className: "bg-red-500/10 text-red-600 border-red-500/20", label: "Cancelled" },
    };
    const s = map[status] || { className: "bg-muted text-muted-foreground border-border", label: status };
    return <Badge className={`${s.className} text-[10px]`}>{s.label}</Badge>;
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
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
          {/* Header */}
          <motion.div variants={fadeInUp} className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Campaigns</h1>
              <p className="text-muted-foreground mt-1">Monitor all campaigns across the platform</p>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search by title or project..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9" />
            </div>
          </motion.div>

          {/* Filter Tabs */}
          <motion.div variants={fadeInUp} className="flex gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <Button
                  key={tab.key}
                  variant={activeTab === tab.key ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveTab(tab.key)}
                  className={activeTab === tab.key ? "" : "text-muted-foreground"}
                >
                  <Icon className="h-3.5 w-3.5 mr-1.5" />
                  {tab.label}
                  <span className="ml-1.5 text-xs opacity-60">({tabCounts[tab.key]})</span>
                </Button>
              );
            })}
          </motion.div>

          {/* Table */}
          <motion.div variants={fadeInUp}>
            <Card className="border border-border/50 overflow-hidden">
              <div className="hidden sm:grid grid-cols-12 gap-4 p-4 bg-muted/30 border-b border-border/50 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <div className="col-span-3">Campaign</div>
                <div className="col-span-2">Project</div>
                <div className="col-span-2">Budget</div>
                <div className="col-span-2">Collaborations</div>
                <div className="col-span-1">Status</div>
                <div className="col-span-2 text-right">Created</div>
              </div>

              <div className="divide-y divide-border/50">
                {filtered.length === 0 ? (
                  <div className="p-12 text-center text-muted-foreground text-sm">No campaigns found</div>
                ) : (
                  filtered.map((campaign) => (
                    <div
                      key={campaign.id}
                      className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 p-4 items-center hover:bg-muted/20 transition-colors"
                    >
                      <div className="sm:col-span-3">
                        <p className="text-sm font-medium truncate">{campaign.title}</p>
                      </div>

                      <div className="sm:col-span-2">
                        <p className="text-sm text-muted-foreground">{campaign.brand.companyName}</p>
                      </div>

                      <div className="sm:col-span-2">
                        <p className="text-sm">${(campaign.budgetMin / 100).toFixed(0)} – ${(campaign.budgetMax / 100).toFixed(0)}</p>
                      </div>

                      <div className="sm:col-span-2 flex items-center gap-1">
                        <Users className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-sm">{campaign._count.collaborations} / {campaign.desiredInfluencerCount}</span>
                      </div>

                      <div className="sm:col-span-1">
                        {statusBadge(campaign.status)}
                      </div>

                      <div className="sm:col-span-2 text-right">
                        <p className="text-xs text-muted-foreground">{new Date(campaign.createdAt).toLocaleDateString()}</p>
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
