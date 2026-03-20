"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AdminNav } from "@/components/admin-nav";
import { motion } from "framer-motion";
import {
  Target,
  DollarSign,
  Users,
  Loader2,
  BarChart3,
} from "lucide-react";

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

interface Campaign {
  id: number;
  title: string;
  brandName: string;
  budgetMin: number;
  budgetMax: number;
  collaborationsCount: number;
  status: string;
  createdAt: string;
}

interface CampaignStats {
  totalCampaigns: number;
  activeCampaigns: number;
  totalBudget: number;
  totalCollaborations: number;
  totalRevenue: number;
}

export default function AdminCampaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [stats, setStats] = useState<CampaignStats>({
    totalCampaigns: 0,
    activeCampaigns: 0,
    totalBudget: 0,
    totalCollaborations: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await fetch("/api/admin/campaigns");
        const data = await res.json();
        setCampaigns(data.campaigns || []);
        setStats(
          data.stats || {
            totalCampaigns: 0,
            activeCampaigns: 0,
            totalBudget: 0,
            totalCollaborations: 0,
            totalRevenue: 0,
          }
        );
      } catch (error) {
        console.error("Failed to fetch campaigns:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  const statCards = [
    {
      label: "Total Campaigns",
      value: stats.totalCampaigns,
      icon: Target,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "Active",
      value: stats.activeCampaigns,
      icon: BarChart3,
      color: "text-green-500",
      bg: "bg-green-500/10",
    },
    {
      label: "Total Budget",
      value: `$${(stats.totalBudget || 0).toLocaleString()}`,
      icon: DollarSign,
      color: "text-secondary",
      bg: "bg-secondary/10",
    },
    {
      label: "Collaborations",
      value: stats.totalCollaborations,
      icon: Users,
      color: "text-accent",
      bg: "bg-accent/10",
    },
  ];

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
          className="space-y-8"
        >
          {/* Header */}
          <motion.div variants={fadeInUp}>
            <h1 className="text-3xl font-bold text-foreground">Campaigns</h1>
            <p className="text-muted-foreground mt-1">
              Monitor all campaigns across the platform
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={fadeInUp}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {statCards.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card
                  key={stat.label}
                  className="p-6 border border-border/50 hover:border-border transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center`}
                    >
                      <Icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {stat.label}
                      </p>
                      <p className="text-2xl font-bold text-foreground">
                        {stat.value}
                      </p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </motion.div>

          {/* Campaign List */}
          <motion.div variants={fadeInUp}>
            <Card className="border border-border/50 overflow-hidden">
              {/* Table Header */}
              <div className="hidden sm:grid grid-cols-12 gap-4 p-4 bg-muted/30 border-b border-border/50 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <div className="col-span-3">Title</div>
                <div className="col-span-2">Brand</div>
                <div className="col-span-3">Budget</div>
                <div className="col-span-2">Collaborations</div>
                <div className="col-span-2 text-right">Status</div>
              </div>

              <div className="divide-y divide-border/50">
                {campaigns.length === 0 ? (
                  <div className="p-12 text-center text-muted-foreground text-sm">
                    No campaigns created yet
                  </div>
                ) : (
                  campaigns.map((camp) => (
                    <div
                      key={camp.id}
                      className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 p-4 items-center hover:bg-muted/20 transition-colors"
                    >
                      <div className="sm:col-span-3">
                        <p className="text-sm font-medium text-foreground">
                          {camp.title}
                        </p>
                      </div>

                      <div className="sm:col-span-2">
                        <p className="text-sm text-muted-foreground">
                          {camp.brandName}
                        </p>
                      </div>

                      <div className="sm:col-span-3">
                        <p className="text-sm text-foreground">
                          ${(camp.budgetMin || 0).toLocaleString()} - $
                          {(camp.budgetMax || 0).toLocaleString()}
                        </p>
                      </div>

                      <div className="sm:col-span-2">
                        <div className="flex items-center gap-1.5">
                          <Users className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="text-sm text-foreground">
                            {camp.collaborationsCount || 0}
                          </span>
                        </div>
                      </div>

                      <div className="sm:col-span-2 text-right">
                        <Badge
                          className={
                            camp.status === "active"
                              ? "bg-green-500/10 text-green-600 border-green-500/20"
                              : camp.status === "draft"
                                ? "bg-muted text-muted-foreground border-border"
                                : camp.status === "completed"
                                  ? "bg-blue-500/10 text-blue-600 border-blue-500/20"
                                  : "bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
                          }
                        >
                          {camp.status}
                        </Badge>
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
