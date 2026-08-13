"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AdminNav } from "@/components/admin-nav";
import { motion } from "framer-motion";
import {
  Wallet,
  Loader2,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
} from "lucide-react";

const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.4, 0.25, 1] as const } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};

type FilterTab = "all" | "deposit" | "withdrawal" | "campaign_payout" | "campaign_advance" | "campaign_freeze";

interface Transaction {
  id: string;
  type: string;
  amount: number;
  fee: number;
  status: string;
  description: string | null;
  createdAt: string;
  profile: { email: string; role: string };
}

export default function AdminTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [stats, setStats] = useState({ totalFees: 0, totalVolume: 0 });

  useEffect(() => {
    fetch("/api/admin/transactions?limit=100")
      .then(r => r.json())
      .then(data => {
        setTransactions(data.transactions || []);
        setStats(data.stats || { totalFees: 0, totalVolume: 0 });
      })
      .catch(e => console.error("Failed to fetch transactions:", e))
      .finally(() => setLoading(false));
  }, []);

  const tabs: { key: FilterTab; label: string }[] = [
    { key: "all", label: "All" },
    { key: "deposit", label: "Deposits" },
    { key: "withdrawal", label: "Withdrawals" },
    { key: "campaign_payout", label: "Payouts" },
    { key: "campaign_advance", label: "Advances" },
    { key: "campaign_freeze", label: "Freezes" },
  ];

  const filtered = transactions.filter(tx => {
    if (activeTab === "all") return true;
    return tx.type.toLowerCase() === activeTab || tx.type.toLowerCase().startsWith(activeTab);
  });

  const typeLabels: Record<string, string> = {
    DEPOSIT: 'Deposit', WITHDRAWAL: 'Withdrawal',
    CAMPAIGN_ADVANCE: 'Advance', CAMPAIGN_PAYOUT: 'Payout',
    CAMPAIGN_PAYOUT_AUTO: 'Auto Payout', CAMPAIGN_FREEZE: 'Freeze',
    CAMPAIGN_UNFREEZE: 'Unfreeze', ADVANCE_REFUND: 'Refund',
    DISPUTE_PAYOUT: 'Dispute Payout', DISPUTE_REFUND: 'Dispute Refund',
  };

  const isIncoming = (type: string) => ['DEPOSIT', 'CAMPAIGN_UNFREEZE', 'ADVANCE_REFUND', 'DISPUTE_REFUND'].includes(type);

  // Calculate totals
  const totalDeposits = transactions.filter(t => t.type === 'DEPOSIT' && t.status === 'confirmed').reduce((s, t) => s + t.amount, 0);
  const totalWithdrawals = transactions.filter(t => t.type === 'WITHDRAWAL' && t.status === 'confirmed').reduce((s, t) => s + t.amount, 0);
  const totalFees = transactions.filter(t => t.status === 'confirmed').reduce((s, t) => s + t.fee, 0);

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
          <motion.div variants={fadeInUp}>
            <h1 className="text-3xl font-bold">Transactions</h1>
            <p className="text-muted-foreground mt-1">Platform financial overview and transaction history</p>
          </motion.div>

          {/* Stats */}
          <motion.div variants={fadeInUp} className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <Card className="p-4 border border-border/50">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <ArrowDownRight className="h-4 w-4 text-green-500" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground">Total Deposits</p>
                  <p className="text-lg font-bold text-green-600">${(totalDeposits / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 border border-border/50">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-red-500/10 flex items-center justify-center">
                  <ArrowUpRight className="h-4 w-4 text-red-500" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground">Total Withdrawals</p>
                  <p className="text-lg font-bold text-red-600">${(totalWithdrawals / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 border border-border/50">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground">Platform Fees Earned</p>
                  <p className="text-lg font-bold text-primary">${(totalFees / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 border border-border/50">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-secondary/10 flex items-center justify-center">
                  <Wallet className="h-4 w-4 text-secondary" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground">Total Volume</p>
                  <p className="text-lg font-bold">${((stats.totalVolume || 0) / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Filter Tabs */}
          <motion.div variants={fadeInUp} className="flex gap-2 flex-wrap">
            {tabs.map((tab) => (
              <Button
                key={tab.key}
                variant={activeTab === tab.key ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveTab(tab.key)}
                className={activeTab === tab.key ? "" : "text-muted-foreground"}
              >
                {tab.label}
                <span className="ml-1.5 text-xs opacity-60">
                  ({tab.key === "all" ? transactions.length : transactions.filter(t => t.type.toLowerCase() === tab.key || t.type.toLowerCase().startsWith(tab.key)).length})
                </span>
              </Button>
            ))}
          </motion.div>

          {/* Table */}
          <motion.div variants={fadeInUp}>
            <Card className="border border-border/50 overflow-hidden">
              <div className="hidden sm:grid grid-cols-12 gap-4 p-4 bg-muted/30 border-b border-border/50 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <div className="col-span-2">Date</div>
                <div className="col-span-2">Type</div>
                <div className="col-span-3">User</div>
                <div className="col-span-2">Amount</div>
                <div className="col-span-1">Fee</div>
                <div className="col-span-1">Status</div>
                <div className="col-span-1 text-right">Role</div>
              </div>

              <div className="divide-y divide-border/50">
                {filtered.length === 0 ? (
                  <div className="p-12 text-center text-muted-foreground text-sm">No transactions found</div>
                ) : (
                  filtered.map((tx) => {
                    const isFailed = tx.status === 'failed';
                    const isPending = tx.status === 'pending';
                    const incoming = isIncoming(tx.type);
                    return (
                      <div key={tx.id} className={`grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 p-3 sm:p-4 items-center ${isFailed ? 'opacity-50' : ''}`}>
                        <div className="sm:col-span-2">
                          <p className="text-xs text-muted-foreground">
                            {new Date(tx.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </p>
                          <p className="text-[10px] text-muted-foreground">
                            {new Date(tx.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>

                        <div className="sm:col-span-2">
                          <span className={`text-sm font-medium ${incoming ? 'text-green-600' : 'text-foreground'}`}>
                            {typeLabels[tx.type] || tx.type}
                          </span>
                        </div>

                        <div className="sm:col-span-3">
                          <p className="text-sm text-muted-foreground truncate">{tx.profile.email}</p>
                        </div>

                        <div className="sm:col-span-2">
                          {isFailed ? (
                            <p className="text-sm text-muted-foreground line-through">${(tx.amount / 100).toFixed(2)}</p>
                          ) : (
                            <p className={`text-sm font-semibold ${incoming ? 'text-green-600' : 'text-foreground'}`}>
                              {incoming ? '+' : ''}${(tx.amount / 100).toFixed(2)}
                            </p>
                          )}
                        </div>

                        <div className="sm:col-span-1">
                          {tx.fee > 0 && !isFailed && (
                            <p className="text-xs text-primary font-medium">${(tx.fee / 100).toFixed(2)}</p>
                          )}
                        </div>

                        <div className="sm:col-span-1">
                          {isFailed && <Badge className="bg-red-500/10 text-red-600 border-red-500/20 text-[9px]">Failed</Badge>}
                          {isPending && <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 text-[9px]">Pending</Badge>}
                          {tx.status === 'confirmed' && <Badge className="bg-green-500/10 text-green-600 border-green-500/20 text-[9px]">OK</Badge>}
                        </div>

                        <div className="sm:col-span-1 text-right">
                          <span className="text-[10px] text-muted-foreground">{tx.profile.role === 'BRAND' ? 'Project' : tx.profile.role === 'INFLUENCER' ? 'Creator' : tx.profile.role}</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
