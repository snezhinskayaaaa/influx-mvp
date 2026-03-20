"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AdminNav } from "@/components/admin-nav";
import { motion } from "framer-motion";
import {
  Building2,
  Target,
  DollarSign,
  Loader2,
  Briefcase,
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

interface Brand {
  id: number;
  companyName: string;
  email: string;
  industry: string;
  campaignsCount: number;
  createdAt: string;
}

interface BrandStats {
  totalBrands: number;
  totalCampaigns: number;
  totalSpent: number;
}

export default function AdminBrands() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [stats, setStats] = useState<BrandStats>({
    totalBrands: 0,
    totalCampaigns: 0,
    totalSpent: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await fetch("/api/admin/brands");
        const data = await res.json();
        setBrands(data.brands || []);
        setStats(
          data.stats || { totalBrands: 0, totalCampaigns: 0, totalSpent: 0 }
        );
      } catch (error) {
        console.error("Failed to fetch brands:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  const statCards = [
    {
      label: "Total Brands",
      value: stats.totalBrands,
      icon: Building2,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "Total Campaigns",
      value: stats.totalCampaigns,
      icon: Target,
      color: "text-secondary",
      bg: "bg-secondary/10",
    },
    {
      label: "Total Spent",
      value: `$${(stats.totalSpent || 0).toLocaleString()}`,
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
          {/* Header */}
          <motion.div variants={fadeInUp}>
            <h1 className="text-3xl font-bold text-foreground">Brands</h1>
            <p className="text-muted-foreground mt-1">
              Manage registered brands and their activity
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={fadeInUp}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4"
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

          {/* Brand List */}
          <motion.div variants={fadeInUp}>
            <Card className="border border-border/50 overflow-hidden">
              {/* Table Header */}
              <div className="hidden sm:grid grid-cols-12 gap-4 p-4 bg-muted/30 border-b border-border/50 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <div className="col-span-3">Company</div>
                <div className="col-span-3">Email</div>
                <div className="col-span-3">Industry</div>
                <div className="col-span-3 text-right">Campaigns</div>
              </div>

              <div className="divide-y divide-border/50">
                {brands.length === 0 ? (
                  <div className="p-12 text-center text-muted-foreground text-sm">
                    No brands registered yet
                  </div>
                ) : (
                  brands.map((brand) => (
                    <div
                      key={brand.id}
                      className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 p-4 items-center hover:bg-muted/20 transition-colors"
                    >
                      <div className="sm:col-span-3 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
                          <Building2 className="h-4 w-4 text-secondary" />
                        </div>
                        <p className="text-sm font-medium text-foreground">
                          {brand.companyName}
                        </p>
                      </div>

                      <div className="sm:col-span-3">
                        <p className="text-sm text-muted-foreground">
                          {brand.email}
                        </p>
                      </div>

                      <div className="sm:col-span-3">
                        <Badge
                          variant="outline"
                          className="text-xs font-normal"
                        >
                          <Briefcase className="h-3 w-3 mr-1" />
                          {brand.industry || "N/A"}
                        </Badge>
                      </div>

                      <div className="sm:col-span-3 text-right">
                        <span className="text-sm font-medium text-foreground">
                          {brand.campaignsCount || 0}
                        </span>
                        <span className="text-xs text-muted-foreground ml-1">
                          campaigns
                        </span>
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
