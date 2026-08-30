"use client";

import { useState, useEffect } from "react";
import { AdminNav } from "@/components/admin-nav";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, DollarSign, Trophy, Clock, Loader2, ArrowRight } from "lucide-react";

interface ReferralStats {
  totalReferrals: number;
  activeReferrals: number;
  pendingReferrals: number;
  totalEarnings: number;
  thisWeek: number;
  activeReferrers: number;
}

interface TopReferrer {
  rank: number;
  handle: string;
  referralCount: number;
  totalEarnings: number;
}

interface RecentReferral {
  referrerHandle: string;
  referredHandle: string;
  status: string;
  earnings: number;
  createdAt: string;
}

export default function AdminReferrals() {
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [topReferrers, setTopReferrers] = useState<TopReferrer[]>([]);
  const [recentReferrals, setRecentReferrals] = useState<RecentReferral[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/referrals")
      .then(res => res.json())
      .then(data => {
        setStats(data.stats);
        setTopReferrers(data.topReferrers || []);
        setRecentReferrals(data.recentReferrals || []);
      })
      .catch(err => console.error("Failed to fetch referral data:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <AdminNav />
      <div className="pt-16 min-h-screen bg-background">
        <div className="px-6 sm:px-12 lg:px-16 py-8">
          <h1 className="text-2xl font-bold mb-1">Referral Program</h1>
          <p className="text-sm text-muted-foreground mb-8">KOL referral tracking and statistics</p>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="space-y-8">
              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Users className="h-4 w-4 text-primary" />
                    </div>
                    <p className="text-xs text-muted-foreground">Total Referrals</p>
                  </div>
                  <p className="text-2xl font-bold">{stats?.activeReferrals || 0}</p>
                  {(stats?.pendingReferrals || 0) > 0 && (
                    <p className="text-xs text-amber-600 mt-1">+{stats?.pendingReferrals} pending</p>
                  )}
                </Card>
                <Card className="p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-9 h-9 rounded-lg bg-green-500/10 flex items-center justify-center">
                      <DollarSign className="h-4 w-4 text-green-500" />
                    </div>
                    <p className="text-xs text-muted-foreground">Revenue Shared</p>
                  </div>
                  <p className="text-2xl font-bold">${((stats?.totalEarnings || 0) / 100).toFixed(2)}</p>
                </Card>
                <Card className="p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-9 h-9 rounded-lg bg-purple-500/10 flex items-center justify-center">
                      <Trophy className="h-4 w-4 text-purple-500" />
                    </div>
                    <p className="text-xs text-muted-foreground">Active Referrers</p>
                  </div>
                  <p className="text-2xl font-bold">{stats?.activeReferrers || 0}</p>
                </Card>
                <Card className="p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center">
                      <Clock className="h-4 w-4 text-blue-500" />
                    </div>
                    <p className="text-xs text-muted-foreground">This Week</p>
                  </div>
                  <p className="text-2xl font-bold">{stats?.thisWeek || 0}</p>
                </Card>
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                {/* Top Referrers */}
                <div>
                  <h2 className="text-sm font-semibold mb-3">Top Referrers</h2>
                  <Card>
                    {topReferrers.length === 0 ? (
                      <div className="text-center py-10 text-sm text-muted-foreground">
                        No referrals yet
                      </div>
                    ) : (
                      <div>
                        {topReferrers.map((r) => (
                          <div key={r.handle} className="flex items-center gap-3 px-4 py-3 border-b last:border-0 text-sm">
                            <span className={`w-6 text-center font-bold ${
                              r.rank === 1 ? "text-amber-500" :
                              r.rank === 2 ? "text-gray-400" :
                              r.rank === 3 ? "text-amber-700" :
                              "text-muted-foreground"
                            }`}>
                              {r.rank}
                            </span>
                            <span className="flex-1 font-medium">@{r.handle}</span>
                            <Badge variant="secondary" className="text-xs">
                              {r.referralCount} ref{r.referralCount !== 1 ? "s" : ""}
                            </Badge>
                            {r.totalEarnings > 0 && (
                              <span className="text-xs text-green-600 font-medium">${(r.totalEarnings / 100).toFixed(2)}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </Card>
                </div>

                {/* Recent Referrals */}
                <div>
                  <h2 className="text-sm font-semibold mb-3">Recent Referrals</h2>
                  <Card>
                    {recentReferrals.length === 0 ? (
                      <div className="text-center py-10 text-sm text-muted-foreground">
                        No referrals yet
                      </div>
                    ) : (
                      <div>
                        {recentReferrals.map((r, i) => (
                          <div key={i} className="flex items-center gap-2 px-4 py-3 border-b last:border-0 text-sm">
                            <span className="font-medium">@{r.referrerHandle}</span>
                            <ArrowRight className="h-3 w-3 text-muted-foreground shrink-0" />
                            <span className="font-medium">@{r.referredHandle}</span>
                            <span className="flex-1" />
                            <Badge variant={r.status === "active" ? "default" : "secondary"} className="text-[10px]">
                              {r.status}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {new Date(r.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </Card>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
