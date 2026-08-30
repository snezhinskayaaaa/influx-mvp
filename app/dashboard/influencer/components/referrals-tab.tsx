"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import {
  Copy,
  Check,
  Trophy,
  Users,
  DollarSign,
  Award,
  ExternalLink,
  ChevronUp,
} from "lucide-react"

interface ReferralEntry {
  handle: string
  status: string
  hasCompletedCampaigns: boolean
  joinedAt: string
  earnings: number
}

interface LeaderboardEntry {
  rank: number
  handle: string
  referralCount: number
  isMe: boolean
}

interface ReferralData {
  referralCode: string
  stats: {
    totalReferrals: number
    pendingReferrals: number
    totalEarnings: number
    badgeTier: "none" | "member" | "builder" | "leader"
    nextTierAt: number
    remainingToNextTier: number
  }
  referrals: ReferralEntry[]
  leaderboard: LeaderboardEntry[]
  myRank: number | null
}

const BADGE_CONFIG = {
  none: { label: "No Badge", color: "text-muted-foreground", next: "Invite 1 creator to earn Community Member" },
  member: { label: "Community Member", color: "text-blue-600", next: "Invite 4 more to reach Community Builder" },
  builder: { label: "Community Builder", color: "text-purple-600", next: "Invite 10 more to reach Community Leader" },
  leader: { label: "Community Leader", color: "text-amber-600", next: "You reached the highest tier!" },
}

export function ReferralsTab() {
  const [data, setData] = useState<ReferralData | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/referrals")
      if (res.ok) {
        setData(await res.json())
      }
    } catch (err) {
      console.error("Failed to fetch referral data:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const appUrl = typeof window !== "undefined" ? window.location.origin : ""
  const referralLink = data ? `${appUrl}/ref/${data.referralCode}` : ""

  const handleCopy = async () => {
    await navigator.clipboard.writeText(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShareTwitter = () => {
    const text = encodeURIComponent(
      `Join me on Influx — where Web3 projects pay creators directly in crypto.\n\n${referralLink}`
    )
    window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank")
  }

  const handleShareTelegram = () => {
    const text = encodeURIComponent("Join me on Influx — where Web3 projects pay creators directly in crypto.")
    const url = encodeURIComponent(referralLink)
    window.open(`https://t.me/share/url?url=${url}&text=${text}`, "_blank")
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        Failed to load referral data. Please try again.
      </div>
    )
  }

  const badge = BADGE_CONFIG[data.stats.badgeTier]

  return (
    <div>
      {/* Page Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-lg sm:text-3xl font-bold mb-1">Referrals</h1>
        <p className="text-muted-foreground text-xs sm:text-sm">Invite creators and earn 10% of platform fees from their campaigns — forever.</p>
      </div>

      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          <div className="rounded-xl border border-border p-4 sm:p-6 text-center">
            <Users className="h-5 w-5 mx-auto mb-1.5 text-primary" />
            <p className="text-xl sm:text-3xl font-bold">{data.stats.totalReferrals}</p>
            <p className="text-xs text-muted-foreground">Referrals</p>
            {data.stats.pendingReferrals > 0 && (
              <p className="text-xs text-amber-600 mt-1">+{data.stats.pendingReferrals} pending</p>
            )}
          </div>
          <div className="rounded-xl border border-border p-4 sm:p-6 text-center">
            <DollarSign className="h-5 w-5 mx-auto mb-1.5 text-green-500" />
            <p className="text-xl sm:text-3xl font-bold">${(data.stats.totalEarnings / 100).toFixed(2)}</p>
            <p className="text-xs text-muted-foreground">Earned</p>
          </div>
          <div className="rounded-xl border border-border p-4 sm:p-6 text-center">
            <Award className={`h-5 w-5 mx-auto mb-1.5 ${badge.color}`} />
            <p className={`text-sm font-semibold ${badge.color}`}>{badge.label}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {data.stats.badgeTier !== "leader" && data.stats.remainingToNextTier > 0
                ? `${data.stats.remainingToNextTier} more to next`
                : badge.next}
            </p>
          </div>
        </div>

        {/* Referral Link */}
        <div className="rounded-xl border border-border p-4 sm:p-6">
          <h3 className="text-sm font-semibold mb-3">Your Referral Link</h3>
          <div className="flex gap-2">
            <div className="flex-1 flex items-center bg-muted rounded-lg px-3 py-2.5 text-xs sm:text-sm font-mono truncate">
              {referralLink}
            </div>
            <Button variant="outline" size="icon" onClick={handleCopy} className="shrink-0 h-10 w-10">
              {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
          <div className="flex gap-2 mt-3">
            <Button variant="outline" size="sm" onClick={handleShareTwitter} className="gap-1.5 h-8 text-xs">
              <ExternalLink className="h-3.5 w-3.5" />
              Share on X
            </Button>
            <Button variant="outline" size="sm" onClick={handleShareTelegram} className="gap-1.5 h-8 text-xs">
              <ExternalLink className="h-3.5 w-3.5" />
              Telegram
            </Button>
          </div>
        </div>

        {/* Leaderboard */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Trophy className="h-4 w-4 text-amber-500" />
            <h3 className="text-sm font-semibold">Referral Leaderboard</h3>
          </div>
          <div className="rounded-xl border border-border">
            {data.leaderboard.length === 0 ? (
              <div className="text-center py-12 px-6">
                <Users className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No referrals yet</p>
                <p className="text-xs text-muted-foreground mt-1">Be the first to invite someone!</p>
              </div>
            ) : (
              <div>
                {data.leaderboard.map((entry) => (
                  <div
                    key={entry.rank}
                    className={`flex items-center gap-3 px-3 sm:px-5 py-3 sm:py-4 border-b border-border last:border-0 text-sm ${
                      entry.isMe ? "bg-primary/5" : ""
                    }`}
                  >
                    <span className={`w-6 text-center font-bold ${
                      entry.rank === 1 ? "text-amber-500" :
                      entry.rank === 2 ? "text-gray-400" :
                      entry.rank === 3 ? "text-amber-700" :
                      "text-muted-foreground"
                    }`}>
                      {entry.rank}
                    </span>
                    <span className={`flex-1 font-medium ${entry.isMe ? "text-primary" : ""}`}>
                      @{entry.handle} {entry.isMe && "(you)"}
                    </span>
                    <span className="text-muted-foreground text-xs sm:text-sm">
                      {entry.referralCount} referral{entry.referralCount !== 1 ? "s" : ""}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {data.myRank && data.myRank > 10 && (
              <div className="border-t border-border flex items-center gap-3 px-3 sm:px-5 py-3 sm:py-4 text-sm bg-primary/5">
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Your rank:</span>
                <span className="font-bold text-primary">#{data.myRank}</span>
              </div>
            )}
          </div>

          {data.stats.totalReferrals > 0 && (
            <Button
              variant="outline"
              size="sm"
              className="mt-3 w-full gap-1.5 h-8 text-xs"
              onClick={() => {
                const rank = data.myRank || "—"
                const text = encodeURIComponent(
                  `Ranked #${rank} on Influx referral leaderboard — join through my link and let's grow the community together.\n\n${referralLink}`
                )
                window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank")
              }}
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Share Your Rank on X
            </Button>
          )}
        </div>

        {/* Referral List */}
        {data.referrals.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold mb-3">Your Referrals</h3>
            <div className="rounded-xl border border-border">
              {data.referrals.map((ref) => (
                <div key={ref.handle} className="flex items-center justify-between px-3 sm:px-5 py-3 sm:py-4 border-b border-border last:border-0 text-sm">
                  <div>
                    <span className="font-medium">@{ref.handle}</span>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Joined {new Date(ref.joinedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {ref.earnings > 0 && (
                      <span className="text-green-600 text-xs font-medium">${(ref.earnings / 100).toFixed(2)}</span>
                    )}
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      ref.status === "active"
                        ? ref.hasCompletedCampaigns
                          ? "bg-green-500/10 text-green-600"
                          : "bg-blue-500/10 text-blue-600"
                        : "bg-amber-500/10 text-amber-600"
                    }`}>
                      {ref.status === "active"
                        ? ref.hasCompletedCampaigns ? "Earning" : "Active"
                        : "Onboarding"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* How it works */}
        <div className="rounded-xl border border-border bg-muted/30 p-4 sm:p-6">
          <h3 className="text-sm font-semibold mb-3">How it works</h3>
          <div className="space-y-2 text-xs sm:text-sm text-muted-foreground">
            <p>1. Share your unique referral link with fellow creators</p>
            <p>2. When they sign up and complete onboarding, they become your referral</p>
            <p>3. You earn 10% of platform fees from every campaign they complete — forever</p>
          </div>
          <div className="mt-4 pt-3 border-t border-border space-y-1 text-xs text-muted-foreground">
            <p><strong className="text-foreground">Community Member</strong> — 1+ referrals</p>
            <p><strong className="text-foreground">Community Builder</strong> — 5+ referrals</p>
            <p><strong className="text-foreground">Community Leader</strong> — 15+ referrals</p>
          </div>
        </div>
      </div>
    </div>
  )
}
