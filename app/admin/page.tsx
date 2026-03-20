"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AdminNav } from "@/components/admin-nav";
import { motion } from "framer-motion";
import {
  Users,
  Building2,
  Target,
  DollarSign,
  ArrowRight,
  Loader2,
} from "lucide-react";

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

interface Influencer {
  id: number;
  handle: string;
  email: string;
  followers: number;
  status: string;
  isVerified: boolean;
  createdAt: string;
}

interface Brand {
  id: number;
  companyName: string;
  email: string;
  industry: string;
  campaignsCount: number;
}

interface Campaign {
  id: number;
  title: string;
  brandName: string;
  budgetMin: number;
  budgetMax: number;
  collaborationsCount: number;
  status: string;
}

export default function AdminDashboard() {
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [brandStats, setBrandStats] = useState<Record<string, number>>({});
  const [campaignStats, setCampaignStats] = useState<Record<string, number>>(
    {}
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [infRes, brandRes, campRes] = await Promise.all([
          fetch("/api/admin/influencers"),
          fetch("/api/admin/brands"),
          fetch("/api/admin/campaigns"),
        ]);

        const infData = await infRes.json();
        const brandData = await brandRes.json();
        const campData = await campRes.json();

        setInfluencers(infData.influencers || []);
        setBrands(brandData.brands || []);
        setCampaigns(campData.campaigns || []);
        setBrandStats(brandData.stats || {});
        setCampaignStats(campData.stats || {});
      } catch (error) {
        console.error("Failed to fetch admin data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const stats = [
    {
      label: "Total Influencers",
      value: influencers.length,
      icon: Users,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "Total Brands",
      value: brands.length,
      icon: Building2,
      color: "text-secondary",
      bg: "bg-secondary/10",
    },
    {
      label: "Total Campaigns",
      value: campaigns.length,
      icon: Target,
      color: "text-accent",
      bg: "bg-accent/10",
    },
    {
      label: "Platform Revenue",
      value: `$${(campaignStats.totalRevenue || 0).toLocaleString()}`,
      icon: DollarSign,
      color: "text-green-500",
      bg: "bg-green-500/10",
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
          {/* Page Title */}
          <motion.div variants={fadeInUp}>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Platform overview and recent activity
            </p>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            variants={fadeInUp}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {stats.map((stat) => {
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

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Influencers */}
            <motion.div variants={fadeInUp}>
              <Card className="border border-border/50">
                <div className="p-6 border-b border-border/50">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-foreground">
                      Recent Influencers
                    </h2>
                    <Link href="/admin/influencers">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-primary hover:text-primary"
                      >
                        View All
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </div>
                <div className="divide-y divide-border/50">
                  {influencers.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground text-sm">
                      No influencers registered yet
                    </div>
                  ) : (
                    influencers.slice(0, 5).map((inf) => (
                      <div
                        key={inf.id}
                        className="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-sm font-semibold text-primary">
                              {inf.handle?.charAt(0)?.toUpperCase() || "?"}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">
                              @{inf.handle}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {inf.email}
                            </p>
                          </div>
                        </div>
                        <Badge
                          variant={
                            inf.status === "approved"
                              ? "default"
                              : inf.status === "pending"
                                ? "secondary"
                                : "destructive"
                          }
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
                    ))
                  )}
                </div>
              </Card>
            </motion.div>

            {/* Recent Campaigns */}
            <motion.div variants={fadeInUp}>
              <Card className="border border-border/50">
                <div className="p-6 border-b border-border/50">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-foreground">
                      Recent Campaigns
                    </h2>
                    <Link href="/admin/campaigns">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-primary hover:text-primary"
                      >
                        View All
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </div>
                <div className="divide-y divide-border/50">
                  {campaigns.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground text-sm">
                      No campaigns created yet
                    </div>
                  ) : (
                    campaigns.slice(0, 5).map((camp) => (
                      <div
                        key={camp.id}
                        className="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors"
                      >
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {camp.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            by {camp.brandName} &middot; $
                            {camp.budgetMin?.toLocaleString()} - $
                            {camp.budgetMax?.toLocaleString()}
                          </p>
                        </div>
                        <Badge
                          variant="default"
                          className={
                            camp.status === "active"
                              ? "bg-green-500/10 text-green-600 border-green-500/20"
                              : "bg-muted text-muted-foreground"
                          }
                        >
                          {camp.status}
                        </Badge>
                      </div>
                    ))
                  )}
                </div>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
