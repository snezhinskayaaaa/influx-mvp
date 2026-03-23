"use client";

import { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AdminNav } from "@/components/admin-nav";
import { motion } from "framer-motion";
import {
  Loader2,
  Search,
  Users,
  Building2,
  Target,
  ArrowLeftRight,
  Handshake,
  Trash2,
  ShieldCheck,
  ShieldX,
  UserCircle,
  AlertCircle,
  CheckCircle2,
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

type TabKey = "users" | "brands" | "influencers" | "transactions" | "campaigns" | "collaborations";

interface UserProfile {
  id: string;
  email: string;
  fullName: string | null;
  role: string;
  emailVerified: boolean;
  createdAt: string;
  brand: { companyName: string; balance: number; frozenBalance: number } | null;
  influencer: { handle: string; status: string; balance: number } | null;
}

interface BrandRow {
  id: string;
  userId: string;
  companyName: string;
  industry: string | null;
  balance: number;
  frozenBalance: number;
  createdAt: string;
  profile: { email: string };
}

interface InfluencerRow {
  id: string;
  userId: string;
  handle: string;
  status: string;
  balance: number;
  isVerified: boolean;
  instagramFollowers: number;
  tiktokFollowers: number;
  createdAt: string;
  profile: { email: string; fullName: string | null };
}

interface TransactionRow {
  id: string;
  type: string;
  amount: number;
  fee: number;
  status: string;
  currency: string | null;
  externalId: string | null;
  createdAt: string;
  profile: { email: string };
}

interface CampaignRow {
  id: string;
  title: string;
  budgetMin: number;
  budgetMax: number;
  status: string;
  createdAt: string;
  brand: { companyName: string };
  _count: { collaborations: number };
}

interface CollaborationRow {
  id: string;
  proposedPrice: number;
  agreedPrice: number | null;
  status: string;
  createdAt: string;
  campaign: { title: string };
  influencer: { handle: string };
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatMoney(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

function StatusBadge({ status }: { status: string }) {
  const lower = status.toLowerCase();
  const colorClass =
    lower === "confirmed" || lower === "approved" || lower === "completed" || lower === "agreed" || lower === "active"
      ? "bg-green-500/10 text-green-600 border-green-500/20"
      : lower === "pending" || lower === "applied" || lower === "negotiating" || lower === "in_progress" || lower === "draft"
        ? "bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
        : lower === "failed" || lower === "rejected" || lower === "cancelled"
          ? "bg-red-500/10 text-red-600 border-red-500/20"
          : "bg-muted text-muted-foreground border-border";
  return <Badge className={colorClass}>{status.replace(/_/g, " ")}</Badge>;
}

function VerifiedBadge({ verified }: { verified: boolean }) {
  return verified ? (
    <Badge className="bg-green-500/10 text-green-600 border-green-500/20">Verified</Badge>
  ) : (
    <Badge className="bg-red-500/10 text-red-600 border-red-500/20">Unverified</Badge>
  );
}

export default function AdminDatabase() {
  const [activeTab, setActiveTab] = useState<TabKey>("users");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Users state
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [userSearch, setUserSearch] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState("all");
  const [userVerifiedFilter, setUserVerifiedFilter] = useState("all");

  // Brands state
  const [brands, setBrands] = useState<BrandRow[]>([]);

  // Influencers state
  const [influencers, setInfluencers] = useState<InfluencerRow[]>([]);

  // Transactions state
  const [transactions, setTransactions] = useState<TransactionRow[]>([]);
  const [txTypeFilter, setTxTypeFilter] = useState("all");
  const [txStatusFilter, setTxStatusFilter] = useState("all");

  // Campaigns state
  const [campaigns, setCampaigns] = useState<CampaignRow[]>([]);

  // Collaborations state
  const [collaborations, setCollaborations] = useState<CollaborationRow[]>([]);

  // Confirmation modal state
  const [confirmModal, setConfirmModal] = useState<{
    show: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    variant?: "danger" | "warning" | "info";
  } | null>(null);

  // Toast notification state
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    variant: "success" | "error";
  } | null>(null);

  const showToast = (message: string, variant: "success" | "error") => {
    setToast({ show: true, message, variant });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchUsers = useCallback(async () => {
    try {
      const params = new URLSearchParams({ limit: "200" });
      if (userSearch) params.set("search", userSearch);
      if (userRoleFilter !== "all") params.set("role", userRoleFilter);
      if (userVerifiedFilter !== "all") params.set("verified", userVerifiedFilter === "verified" ? "true" : "false");
      const res = await fetch(`/api/admin/users?${params}`);
      const data = await res.json();
      setUsers(data.users || []);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  }, [userSearch, userRoleFilter, userVerifiedFilter]);

  const fetchBrands = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/brands?limit=200");
      const data = await res.json();
      setBrands(data.brands || []);
    } catch (error) {
      console.error("Failed to fetch brands:", error);
    }
  }, []);

  const fetchInfluencers = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/influencers?limit=200");
      const data = await res.json();
      setInfluencers(data.influencers || []);
    } catch (error) {
      console.error("Failed to fetch influencers:", error);
    }
  }, []);

  const fetchTransactions = useCallback(async () => {
    try {
      const params = new URLSearchParams({ limit: "200" });
      if (txTypeFilter !== "all") params.set("type", txTypeFilter);
      if (txStatusFilter !== "all") params.set("status", txStatusFilter);
      const res = await fetch(`/api/admin/transactions?${params}`);
      const data = await res.json();
      setTransactions(data.transactions || []);
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
    }
  }, [txTypeFilter, txStatusFilter]);

  const fetchCampaigns = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/campaigns?limit=200");
      const data = await res.json();
      setCampaigns(data.campaigns || []);
    } catch (error) {
      console.error("Failed to fetch campaigns:", error);
    }
  }, []);

  const fetchCollaborations = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/collaborations?limit=200");
      const data = await res.json();
      setCollaborations(data.collaborations || []);
    } catch (error) {
      console.error("Failed to fetch collaborations:", error);
    }
  }, []);

  const fetchTabData = useCallback(async () => {
    setLoading(true);
    switch (activeTab) {
      case "users":
        await fetchUsers();
        break;
      case "brands":
        await fetchBrands();
        break;
      case "influencers":
        await fetchInfluencers();
        break;
      case "transactions":
        await fetchTransactions();
        break;
      case "campaigns":
        await fetchCampaigns();
        break;
      case "collaborations":
        await fetchCollaborations();
        break;
    }
    setLoading(false);
  }, [activeTab, fetchUsers, fetchBrands, fetchInfluencers, fetchTransactions, fetchCampaigns, fetchCollaborations]);

  useEffect(() => {
    fetchTabData();
  }, [fetchTabData]);

  const toggleVerification = async (userId: string, currentVerified: boolean) => {
    setActionLoading(userId);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailVerified: !currentVerified }),
      });
      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, emailVerified: !currentVerified } : u))
        );
      } else {
        const data = await res.json();
        showToast(data.error || "Failed to update user", "error");
      }
    } catch (error) {
      console.error("Failed to toggle verification:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const deleteUser = (userId: string, email: string) => {
    setConfirmModal({
      show: true,
      title: "Delete User",
      message: `Are you sure you want to delete "${email}"? This action cannot be undone and will cascade to all related data.`,
      variant: "danger",
      onConfirm: async () => {
        setConfirmModal(null);
        setActionLoading(userId);
        try {
          const res = await fetch(`/api/admin/users/${userId}`, { method: "DELETE" });
          if (res.ok) {
            setUsers((prev) => prev.filter((u) => u.id !== userId));
            showToast("User deleted successfully", "success");
          } else {
            const data = await res.json();
            showToast(data.error || "Failed to delete user", "error");
          }
        } catch (error) {
          console.error("Failed to delete user:", error);
          showToast("Failed to delete user", "error");
        } finally {
          setActionLoading(null);
        }
      },
    });
  };

  const deleteBrand = (brandId: string, userId: string, companyName: string) => {
    setConfirmModal({
      show: true,
      title: "Delete Brand",
      message: `Are you sure you want to delete brand "${companyName}"? This will also delete the associated user profile and all related data.`,
      variant: "danger",
      onConfirm: async () => {
        setConfirmModal(null);
        setActionLoading(brandId);
        try {
          const res = await fetch(`/api/admin/users/${userId}`, { method: "DELETE" });
          if (res.ok) {
            setBrands((prev) => prev.filter((b) => b.id !== brandId));
            showToast("Brand deleted successfully", "success");
          } else {
            const data = await res.json();
            showToast(data.error || "Failed to delete brand", "error");
          }
        } catch (error) {
          console.error("Failed to delete brand:", error);
          showToast("Failed to delete brand", "error");
        } finally {
          setActionLoading(null);
        }
      },
    });
  };

  const deleteInfluencer = (influencerId: string, userId: string, handle: string) => {
    setConfirmModal({
      show: true,
      title: "Delete Influencer",
      message: `Are you sure you want to delete influencer "@${handle}"? This will also delete the associated user profile and all related data.`,
      variant: "danger",
      onConfirm: async () => {
        setConfirmModal(null);
        setActionLoading(influencerId);
        try {
          const res = await fetch(`/api/admin/users/${userId}`, { method: "DELETE" });
          if (res.ok) {
            setInfluencers((prev) => prev.filter((i) => i.id !== influencerId));
            showToast("Influencer deleted successfully", "success");
          } else {
            const data = await res.json();
            showToast(data.error || "Failed to delete influencer", "error");
          }
        } catch (error) {
          console.error("Failed to delete influencer:", error);
          showToast("Failed to delete influencer", "error");
        } finally {
          setActionLoading(null);
        }
      },
    });
  };

  const deleteCampaign = (campaignId: string, title: string) => {
    setConfirmModal({
      show: true,
      title: "Delete Campaign",
      message: `Are you sure you want to delete campaign "${title}"? This action cannot be undone.`,
      variant: "danger",
      onConfirm: async () => {
        setConfirmModal(null);
        setActionLoading(campaignId);
        try {
          const res = await fetch(`/api/admin/campaigns/${campaignId}`, { method: "DELETE" });
          if (res.ok) {
            setCampaigns((prev) => prev.filter((c) => c.id !== campaignId));
            showToast("Campaign deleted successfully", "success");
          } else {
            const data = await res.json();
            showToast(data.error || "Failed to delete campaign", "error");
          }
        } catch (error) {
          console.error("Failed to delete campaign:", error);
          showToast("Failed to delete campaign", "error");
        } finally {
          setActionLoading(null);
        }
      },
    });
  };

  const tabs: { key: TabKey; label: string; icon: typeof Users }[] = [
    { key: "users", label: "Users", icon: UserCircle },
    { key: "brands", label: "Brands", icon: Building2 },
    { key: "influencers", label: "Influencers", icon: Users },
    { key: "transactions", label: "Transactions", icon: ArrowLeftRight },
    { key: "campaigns", label: "Campaigns", icon: Target },
    { key: "collaborations", label: "Collaborations", icon: Handshake },
  ];

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
          <motion.div variants={fadeInUp}>
            <h1 className="text-3xl font-bold text-foreground">Database</h1>
            <p className="text-muted-foreground mt-1">
              Browse and manage all database tables
            </p>
          </motion.div>

          {/* Tab Navigation */}
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
                </Button>
              );
            })}
          </motion.div>

          {/* Filters */}
          <motion.div variants={fadeInUp}>
            {activeTab === "users" && (
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative w-full sm:w-72">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by email..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <div className="flex gap-2 flex-wrap">
                  {(["all", "BRAND", "INFLUENCER", "ADMIN"] as const).map((r) => (
                    <Button
                      key={r}
                      variant={userRoleFilter === r ? "default" : "outline"}
                      size="sm"
                      onClick={() => setUserRoleFilter(r)}
                      className={
                        userRoleFilter === r
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground"
                      }
                    >
                      {r === "all" ? "All Roles" : r.charAt(0) + r.slice(1).toLowerCase()}
                    </Button>
                  ))}
                </div>
                <div className="flex gap-2 flex-wrap">
                  {(["all", "verified", "unverified"] as const).map((v) => (
                    <Button
                      key={v}
                      variant={userVerifiedFilter === v ? "default" : "outline"}
                      size="sm"
                      onClick={() => setUserVerifiedFilter(v)}
                      className={
                        userVerifiedFilter === v
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground"
                      }
                    >
                      {v === "all" ? "All" : v.charAt(0).toUpperCase() + v.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "transactions" && (
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex gap-2 flex-wrap">
                  {(["all", "DEPOSIT", "WITHDRAWAL", "CAMPAIGN_FREEZE", "CAMPAIGN_PAYOUT", "CAMPAIGN_UNFREEZE"] as const).map((t) => (
                    <Button
                      key={t}
                      variant={txTypeFilter === t ? "default" : "outline"}
                      size="sm"
                      onClick={() => setTxTypeFilter(t)}
                      className={
                        txTypeFilter === t
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground"
                      }
                    >
                      {t === "all" ? "All Types" : t.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())}
                    </Button>
                  ))}
                </div>
                <div className="flex gap-2 flex-wrap">
                  {(["all", "pending", "confirmed", "failed"] as const).map((s) => (
                    <Button
                      key={s}
                      variant={txStatusFilter === s ? "default" : "outline"}
                      size="sm"
                      onClick={() => setTxStatusFilter(s)}
                      className={
                        txStatusFilter === s
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground"
                      }
                    >
                      {s === "all" ? "All Statuses" : s.charAt(0).toUpperCase() + s.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* Table Content */}
          <motion.div variants={fadeInUp}>
            {loading ? (
              <div className="flex items-center justify-center min-h-[40vh]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <Card className="border border-border/50 overflow-hidden overflow-x-auto">
                {/* Users Table */}
                {activeTab === "users" && (
                  <>
                    <div className="hidden sm:grid grid-cols-12 gap-4 p-4 bg-muted/30 border-b border-border/50 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      <div className="col-span-3">Email</div>
                      <div className="col-span-2">Full Name</div>
                      <div className="col-span-1">Role</div>
                      <div className="col-span-2">Email Verified</div>
                      <div className="col-span-2">Created At</div>
                      <div className="col-span-2 text-right">Actions</div>
                    </div>
                    <div className="divide-y divide-border/50">
                      {users.length === 0 ? (
                        <div className="p-12 text-center text-muted-foreground text-sm">
                          No users found
                        </div>
                      ) : (
                        users.map((user) => (
                          <div
                            key={user.id}
                            className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 p-4 items-center hover:bg-muted/20 transition-colors"
                          >
                            <div className="sm:col-span-3">
                              <p className="text-sm font-medium text-foreground truncate">{user.email}</p>
                            </div>
                            <div className="sm:col-span-2">
                              <p className="text-sm text-muted-foreground">{user.fullName || "—"}</p>
                            </div>
                            <div className="sm:col-span-1">
                              <Badge className={
                                user.role === "ADMIN"
                                  ? "bg-purple-500/10 text-purple-600 border-purple-500/20"
                                  : user.role === "BRAND"
                                    ? "bg-blue-500/10 text-blue-600 border-blue-500/20"
                                    : "bg-orange-500/10 text-orange-600 border-orange-500/20"
                              }>
                                {user.role}
                              </Badge>
                            </div>
                            <div className="sm:col-span-2">
                              <VerifiedBadge verified={user.emailVerified} />
                            </div>
                            <div className="sm:col-span-2">
                              <p className="text-xs text-muted-foreground">{formatDate(user.createdAt)}</p>
                            </div>
                            <div className="sm:col-span-2 flex items-center justify-end gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className={
                                  user.emailVerified
                                    ? "text-red-600 border-red-500/30 hover:bg-red-500/10 text-xs"
                                    : "text-green-600 border-green-500/30 hover:bg-green-500/10 text-xs"
                                }
                                disabled={actionLoading === user.id}
                                onClick={() => toggleVerification(user.id, user.emailVerified)}
                              >
                                {actionLoading === user.id ? (
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                ) : user.emailVerified ? (
                                  <ShieldX className="h-3 w-3 mr-1" />
                                ) : (
                                  <ShieldCheck className="h-3 w-3 mr-1" />
                                )}
                                {user.emailVerified ? "Unverify" : "Verify"}
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-red-600 border-red-500/30 hover:bg-red-500/10 text-xs"
                                disabled={actionLoading === user.id}
                                onClick={() => deleteUser(user.id, user.email)}
                              >
                                {actionLoading === user.id ? (
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                ) : (
                                  <Trash2 className="h-3 w-3 mr-1" />
                                )}
                                Delete
                              </Button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </>
                )}

                {/* Brands Table */}
                {activeTab === "brands" && (
                  <>
                    <div className="hidden sm:grid grid-cols-12 gap-4 p-4 bg-muted/30 border-b border-border/50 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      <div className="col-span-2">Company Name</div>
                      <div className="col-span-3">Email</div>
                      <div className="col-span-2">Industry</div>
                      <div className="col-span-1">Balance</div>
                      <div className="col-span-1">Frozen</div>
                      <div className="col-span-2">Created At</div>
                      <div className="col-span-1 text-right">Actions</div>
                    </div>
                    <div className="divide-y divide-border/50">
                      {brands.length === 0 ? (
                        <div className="p-12 text-center text-muted-foreground text-sm">
                          No brands found
                        </div>
                      ) : (
                        brands.map((brand) => (
                          <div
                            key={brand.id}
                            className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 p-4 items-center hover:bg-muted/20 transition-colors"
                          >
                            <div className="sm:col-span-2">
                              <p className="text-sm font-medium text-foreground">{brand.companyName}</p>
                            </div>
                            <div className="sm:col-span-3">
                              <p className="text-sm text-muted-foreground truncate">{brand.profile.email}</p>
                            </div>
                            <div className="sm:col-span-2">
                              <p className="text-sm text-muted-foreground">{brand.industry || "—"}</p>
                            </div>
                            <div className="sm:col-span-1">
                              <p className="text-sm font-medium text-foreground">{formatMoney(brand.balance)}</p>
                            </div>
                            <div className="sm:col-span-1">
                              <p className="text-sm text-muted-foreground">{formatMoney(brand.frozenBalance)}</p>
                            </div>
                            <div className="sm:col-span-2">
                              <p className="text-xs text-muted-foreground">{formatDate(brand.createdAt)}</p>
                            </div>
                            <div className="sm:col-span-1 flex items-center justify-end">
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-red-600 border-red-500/30 hover:bg-red-500/10 text-xs"
                                disabled={actionLoading === brand.id}
                                onClick={() => deleteBrand(brand.id, brand.userId, brand.companyName)}
                              >
                                {actionLoading === brand.id ? (
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                ) : (
                                  <Trash2 className="h-3 w-3 mr-1" />
                                )}
                                Delete
                              </Button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </>
                )}

                {/* Influencers Table */}
                {activeTab === "influencers" && (
                  <>
                    <div className="hidden sm:grid grid-cols-12 gap-4 p-4 bg-muted/30 border-b border-border/50 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      <div className="col-span-2">Handle</div>
                      <div className="col-span-2">Email</div>
                      <div className="col-span-1">Status</div>
                      <div className="col-span-1">Balance</div>
                      <div className="col-span-1">IG</div>
                      <div className="col-span-1">TT</div>
                      <div className="col-span-1">Verified</div>
                      <div className="col-span-2">Created At</div>
                      <div className="col-span-1 text-right">Actions</div>
                    </div>
                    <div className="divide-y divide-border/50">
                      {influencers.length === 0 ? (
                        <div className="p-12 text-center text-muted-foreground text-sm">
                          No influencers found
                        </div>
                      ) : (
                        influencers.map((inf) => (
                          <div
                            key={inf.id}
                            className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 p-4 items-center hover:bg-muted/20 transition-colors"
                          >
                            <div className="sm:col-span-2">
                              <p className="text-sm font-medium text-foreground">@{inf.handle}</p>
                            </div>
                            <div className="sm:col-span-2">
                              <p className="text-sm text-muted-foreground truncate">{inf.profile.email}</p>
                            </div>
                            <div className="sm:col-span-1">
                              <StatusBadge status={inf.status} />
                            </div>
                            <div className="sm:col-span-1">
                              <p className="text-sm font-medium text-foreground">{formatMoney(inf.balance)}</p>
                            </div>
                            <div className="sm:col-span-1">
                              <p className="text-sm text-muted-foreground">{(inf.instagramFollowers || 0).toLocaleString()}</p>
                            </div>
                            <div className="sm:col-span-1">
                              <p className="text-sm text-muted-foreground">{(inf.tiktokFollowers || 0).toLocaleString()}</p>
                            </div>
                            <div className="sm:col-span-1">
                              <VerifiedBadge verified={inf.isVerified} />
                            </div>
                            <div className="sm:col-span-2">
                              <p className="text-xs text-muted-foreground">{formatDate(inf.createdAt)}</p>
                            </div>
                            <div className="sm:col-span-1 flex items-center justify-end">
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-red-600 border-red-500/30 hover:bg-red-500/10 text-xs"
                                disabled={actionLoading === inf.id}
                                onClick={() => deleteInfluencer(inf.id, inf.userId, inf.handle)}
                              >
                                {actionLoading === inf.id ? (
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                ) : (
                                  <Trash2 className="h-3 w-3 mr-1" />
                                )}
                                Delete
                              </Button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </>
                )}

                {/* Transactions Table */}
                {activeTab === "transactions" && (
                  <>
                    <div className="hidden sm:grid grid-cols-12 gap-4 p-4 bg-muted/30 border-b border-border/50 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      <div className="col-span-3">User Email</div>
                      <div className="col-span-2">Type</div>
                      <div className="col-span-1">Amount</div>
                      <div className="col-span-1">Fee</div>
                      <div className="col-span-1">Status</div>
                      <div className="col-span-1">Currency</div>
                      <div className="col-span-1">External ID</div>
                      <div className="col-span-2">Created At</div>
                    </div>
                    <div className="divide-y divide-border/50">
                      {transactions.length === 0 ? (
                        <div className="p-12 text-center text-muted-foreground text-sm">
                          No transactions found
                        </div>
                      ) : (
                        transactions.map((tx) => (
                          <div
                            key={tx.id}
                            className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 p-4 items-center hover:bg-muted/20 transition-colors"
                          >
                            <div className="sm:col-span-3">
                              <p className="text-sm text-muted-foreground truncate">{tx.profile.email}</p>
                            </div>
                            <div className="sm:col-span-2">
                              <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20">
                                {tx.type.replace(/_/g, " ")}
                              </Badge>
                            </div>
                            <div className="sm:col-span-1">
                              <p className="text-sm font-medium text-foreground">{formatMoney(tx.amount)}</p>
                            </div>
                            <div className="sm:col-span-1">
                              <p className="text-sm text-muted-foreground">{formatMoney(tx.fee)}</p>
                            </div>
                            <div className="sm:col-span-1">
                              <StatusBadge status={tx.status} />
                            </div>
                            <div className="sm:col-span-1">
                              <p className="text-sm text-muted-foreground">{tx.currency || "—"}</p>
                            </div>
                            <div className="sm:col-span-1">
                              <p className="text-xs text-muted-foreground truncate" title={tx.externalId || ""}>
                                {tx.externalId ? tx.externalId.slice(0, 8) + "..." : "—"}
                              </p>
                            </div>
                            <div className="sm:col-span-2">
                              <p className="text-xs text-muted-foreground">{formatDate(tx.createdAt)}</p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </>
                )}

                {/* Campaigns Table */}
                {activeTab === "campaigns" && (
                  <>
                    <div className="hidden sm:grid grid-cols-12 gap-4 p-4 bg-muted/30 border-b border-border/50 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      <div className="col-span-3">Title</div>
                      <div className="col-span-2">Brand</div>
                      <div className="col-span-2">Budget Range</div>
                      <div className="col-span-1">Collabs</div>
                      <div className="col-span-1">Status</div>
                      <div className="col-span-2">Created At</div>
                      <div className="col-span-1 text-right">Actions</div>
                    </div>
                    <div className="divide-y divide-border/50">
                      {campaigns.length === 0 ? (
                        <div className="p-12 text-center text-muted-foreground text-sm">
                          No campaigns found
                        </div>
                      ) : (
                        campaigns.map((campaign) => (
                          <div
                            key={campaign.id}
                            className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 p-4 items-center hover:bg-muted/20 transition-colors"
                          >
                            <div className="sm:col-span-3">
                              <p className="text-sm font-medium text-foreground">{campaign.title}</p>
                            </div>
                            <div className="sm:col-span-2">
                              <p className="text-sm text-muted-foreground">{campaign.brand.companyName}</p>
                            </div>
                            <div className="sm:col-span-2">
                              <p className="text-sm text-foreground">
                                {formatMoney(campaign.budgetMin)} - {formatMoney(campaign.budgetMax)}
                              </p>
                            </div>
                            <div className="sm:col-span-1">
                              <p className="text-sm text-muted-foreground">{campaign._count.collaborations}</p>
                            </div>
                            <div className="sm:col-span-1">
                              <StatusBadge status={campaign.status} />
                            </div>
                            <div className="sm:col-span-2">
                              <p className="text-xs text-muted-foreground">{formatDate(campaign.createdAt)}</p>
                            </div>
                            <div className="sm:col-span-1 flex items-center justify-end">
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-red-600 border-red-500/30 hover:bg-red-500/10 text-xs"
                                disabled={actionLoading === campaign.id}
                                onClick={() => deleteCampaign(campaign.id, campaign.title)}
                              >
                                {actionLoading === campaign.id ? (
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                ) : (
                                  <Trash2 className="h-3 w-3 mr-1" />
                                )}
                                Delete
                              </Button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </>
                )}

                {/* Collaborations Table */}
                {activeTab === "collaborations" && (
                  <>
                    <div className="hidden sm:grid grid-cols-12 gap-4 p-4 bg-muted/30 border-b border-border/50 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      <div className="col-span-3">Campaign</div>
                      <div className="col-span-2">Influencer</div>
                      <div className="col-span-2">Proposed Price</div>
                      <div className="col-span-2">Agreed Price</div>
                      <div className="col-span-1">Status</div>
                      <div className="col-span-2">Created At</div>
                    </div>
                    <div className="divide-y divide-border/50">
                      {collaborations.length === 0 ? (
                        <div className="p-12 text-center text-muted-foreground text-sm">
                          No collaborations found
                        </div>
                      ) : (
                        collaborations.map((collab) => (
                          <div
                            key={collab.id}
                            className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 p-4 items-center hover:bg-muted/20 transition-colors"
                          >
                            <div className="sm:col-span-3">
                              <p className="text-sm font-medium text-foreground">{collab.campaign.title}</p>
                            </div>
                            <div className="sm:col-span-2">
                              <p className="text-sm text-muted-foreground">@{collab.influencer.handle}</p>
                            </div>
                            <div className="sm:col-span-2">
                              <p className="text-sm text-foreground">{formatMoney(collab.proposedPrice)}</p>
                            </div>
                            <div className="sm:col-span-2">
                              <p className="text-sm text-foreground">
                                {collab.agreedPrice !== null ? formatMoney(collab.agreedPrice) : "—"}
                              </p>
                            </div>
                            <div className="sm:col-span-1">
                              <StatusBadge status={collab.status} />
                            </div>
                            <div className="sm:col-span-2">
                              <p className="text-xs text-muted-foreground">{formatDate(collab.createdAt)}</p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </>
                )}
              </Card>
            )}
          </motion.div>
        </motion.div>
      </main>

      {/* Confirmation Modal */}
      {confirmModal?.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-background border border-border rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl">
            <div className="flex justify-center mb-4">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center ${
                confirmModal.variant === "danger" ? "bg-red-100 text-red-600" :
                confirmModal.variant === "warning" ? "bg-yellow-100 text-yellow-600" :
                "bg-blue-100 text-blue-600"
              }`}>
                {confirmModal.variant === "danger" ? (
                  <Trash2 className="h-7 w-7" />
                ) : (
                  <AlertCircle className="h-7 w-7" />
                )}
              </div>
            </div>
            <h3 className="text-lg font-bold text-center mb-2">{confirmModal.title}</h3>
            <p className="text-muted-foreground text-center text-sm mb-6">{confirmModal.message}</p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setConfirmModal(null)}
              >
                Cancel
              </Button>
              <Button
                className={`flex-1 ${confirmModal.variant === "danger" ? "bg-red-600 hover:bg-red-700 text-white" : ""}`}
                onClick={confirmModal.onConfirm}
              >
                Confirm
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast?.show && (
        <div className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-lg border ${
          toast.variant === "success" ? "bg-green-50 border-green-200 text-green-800" : "bg-red-50 border-red-200 text-red-800"
        }`}>
          <div className="flex items-center gap-2">
            {toast.variant === "success" ? (
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-600" />
            )}
            <p className="text-sm font-medium">{toast.message}</p>
          </div>
        </div>
      )}
    </div>
  );
}
