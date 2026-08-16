"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { AdminNav } from "@/components/admin-nav";
import { DatePicker } from "@/components/ui/date-picker";
import { motion } from "framer-motion";
import {
  Wallet,
  Loader2,
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
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined);
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined);

  useEffect(() => {
    fetch("/api/admin/transactions?limit=200")
      .then(r => r.json())
      .then(data => setTransactions(data.transactions || []))
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

  const typeLabels: Record<string, string> = {
    DEPOSIT: 'Deposit', WITHDRAWAL: 'Withdrawal',
    CAMPAIGN_ADVANCE: 'Advance', CAMPAIGN_PAYOUT: 'Payout',
    CAMPAIGN_PAYOUT_AUTO: 'Auto Payout', CAMPAIGN_FREEZE: 'Freeze',
    CAMPAIGN_UNFREEZE: 'Unfreeze', ADVANCE_REFUND: 'Refund',
    DISPUTE_PAYOUT: 'Dispute Payout', DISPUTE_REFUND: 'Dispute Refund',
  };

  // Direction: who is this transaction FOR?
  // Brand pays → amount leaves brand (outgoing for brand)
  // Creator receives → amount enters creator (incoming for creator)
  const getDirection = (type: string, role: string): 'in' | 'out' | 'neutral' => {
    if (type === 'DEPOSIT') return 'in'; // money into platform
    if (type === 'WITHDRAWAL') return 'out'; // money out of platform
    if (type === 'CAMPAIGN_FREEZE') return 'neutral'; // internal move
    if (type === 'CAMPAIGN_UNFREEZE') return 'neutral'; // internal move
    if (type === 'CAMPAIGN_ADVANCE' || type === 'CAMPAIGN_PAYOUT' || type === 'CAMPAIGN_PAYOUT_AUTO' || type === 'DISPUTE_PAYOUT') {
      return role === 'INFLUENCER' ? 'in' : 'out';
    }
    if (type === 'ADVANCE_REFUND' || type === 'DISPUTE_REFUND') {
      return role === 'BRAND' ? 'in' : 'out';
    }
    return 'neutral';
  };

  // Filter by tab + date range
  const filtered = transactions.filter(tx => {
    const matchesTab = activeTab === "all" || tx.type.toLowerCase() === activeTab || tx.type.toLowerCase().startsWith(activeTab);

    let matchesDate = true;
    if (dateFrom) {
      const from = new Date(dateFrom);
      from.setHours(0, 0, 0, 0);
      matchesDate = new Date(tx.createdAt) >= from;
    }
    if (dateTo && matchesDate) {
      const to = new Date(dateTo);
      to.setHours(23, 59, 59, 999);
      matchesDate = new Date(tx.createdAt) <= to;
    }

    return matchesTab && matchesDate;
  });

  // Calculate stats from filtered transactions (respects date range)
  const confirmedFiltered = filtered.filter(t => t.status === 'confirmed');
  const totalDeposits = confirmedFiltered.filter(t => t.type === 'DEPOSIT').reduce((s, t) => s + t.amount, 0);
  const totalWithdrawals = confirmedFiltered.filter(t => t.type === 'WITHDRAWAL').reduce((s, t) => s + t.amount, 0);
  const totalFees = confirmedFiltered.reduce((s, t) => s + t.fee, 0);
  // Net platform balance = deposits - withdrawals (how much is held on platform)
  const netBalance = totalDeposits - totalWithdrawals;

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
              <h1 className="text-3xl font-bold">Transactions</h1>
              <p className="text-muted-foreground mt-1">Platform financial overview</p>
            </div>
            <div className="flex items-center gap-2">
              <div>
                <Label className="text-[10px] text-muted-foreground mb-1 block">From</Label>
                <DatePicker date={dateFrom} onDateChange={setDateFrom} placeholder="Start date" className="h-8 text-xs w-40" />
              </div>
              <div>
                <Label className="text-[10px] text-muted-foreground mb-1 block">To</Label>
                <DatePicker date={dateTo} onDateChange={setDateTo} placeholder="End date" className="h-8 text-xs w-40" />
              </div>
              {(dateFrom || dateTo) && (
                <Button variant="ghost" size="sm" className="mt-4 text-xs h-8" onClick={() => { setDateFrom(undefined); setDateTo(undefined); }}>
                  Clear
                </Button>
              )}
            </div>
          </motion.div>

          {/* Stats — recalculated based on date filter */}
          <motion.div variants={fadeInUp} className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <Card className="p-4 border border-border/50">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <ArrowDownRight className="h-4 w-4 text-green-500" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground">Deposits</p>
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
                  <p className="text-[10px] text-muted-foreground">Withdrawals</p>
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
                  <p className="text-[10px] text-muted-foreground">Fees Earned</p>
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
                  <p className="text-[10px] text-muted-foreground">Net on Platform</p>
                  <p className="text-lg font-bold">${(netBalance / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
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
                  ({tab.key === "all" ? filtered.length : filtered.filter(t => t.type.toLowerCase() === tab.key || t.type.toLowerCase().startsWith(tab.key)).length})
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
                <div className="col-span-2">Direction</div>
                <div className="col-span-1">Amount</div>
                <div className="col-span-1">Fee</div>
                <div className="col-span-1 text-right">Status</div>
              </div>

              <div className="divide-y divide-border/50">
                {filtered.length === 0 ? (
                  <div className="p-12 text-center text-muted-foreground text-sm">No transactions found</div>
                ) : (
                  filtered.map((tx) => {
                    const isFailed = tx.status === 'failed';
                    const isPending = tx.status === 'pending';
                    const dir = getDirection(tx.type, tx.profile.role);
                    return (
                      <div key={tx.id} className={`grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 p-3 sm:p-4 items-center ${isFailed ? 'opacity-40' : ''}`}>
                        <div className="sm:col-span-2">
                          <p className="text-xs text-muted-foreground">
                            {new Date(tx.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </p>
                          <p className="text-[10px] text-muted-foreground">
                            {new Date(tx.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>

                        <div className="sm:col-span-2">
                          <span className="text-sm font-medium">{typeLabels[tx.type] || tx.type}</span>
                        </div>

                        <div className="sm:col-span-3">
                          <p className="text-sm text-muted-foreground truncate">{tx.profile.email}</p>
                        </div>

                        <div className="sm:col-span-2">
                          {dir === 'in' && <span className="text-[11px] text-green-600 font-medium">→ {tx.profile.role === 'INFLUENCER' ? 'Creator receives' : 'Project receives'}</span>}
                          {dir === 'out' && <span className="text-[11px] text-red-600 font-medium">← {tx.profile.role === 'BRAND' ? 'Project pays' : 'Creator pays'}</span>}
                          {dir === 'neutral' && <span className="text-[11px] text-primary font-medium">{tx.profile.role === 'BRAND' ? 'Project internal' : 'Internal'}</span>}
                        </div>

                        <div className="sm:col-span-1">
                          {isFailed ? (
                            <p className="text-sm text-muted-foreground line-through">${(tx.amount / 100).toFixed(2)}</p>
                          ) : (
                            <p className={`text-sm font-semibold ${dir === 'in' ? 'text-green-600' : dir === 'out' ? 'text-red-600' : 'text-primary'}`}>
                              ${(tx.amount / 100).toFixed(2)}
                            </p>
                          )}
                        </div>

                        <div className="sm:col-span-1">
                          {tx.fee > 0 && !isFailed && (
                            <p className="text-xs text-primary font-medium">${(tx.fee / 100).toFixed(2)}</p>
                          )}
                        </div>

                        <div className="sm:col-span-1 text-right">
                          {isFailed && <Badge className="bg-red-500/10 text-red-600 border-red-500/20 text-[9px]">Failed</Badge>}
                          {isPending && <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 text-[9px]">Pending</Badge>}
                          {tx.status === 'confirmed' && <Badge className="bg-green-500/10 text-green-600 border-green-500/20 text-[9px]">OK</Badge>}
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
