"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { AdminNav } from "@/components/admin-nav";
import { AlertCircle, CheckCircle2, ExternalLink, FileText, Clock, Loader2 } from "lucide-react";

interface Dispute {
  id: string;
  status: string;
  disputeReason: string | null;
  disputeResult: string | null;
  disputedAt: string | null;
  resolvedAt: string | null;
  agreedPrice: number | null;
  contentUrl: string | null;
  publishedUrl: string | null;
  publishedUrls: string[];
  brandTerms: string | null;
  influencerTerms: string | null;
  proposedPrice: number;
  campaign: {
    id: string;
    title: string;
    description: string;
    brand: { companyName: string; userId: string; profile: { email: string } | null };
  };
  influencer: {
    id: string;
    handle: string;
    userId: string;
    profile: { email: string } | null;
  };
}

function parseDisputeReason(reason: string | null) {
  if (!reason) return { category: null, comment: null };
  const match = reason.match(/^\[(.+?)\]\s*([\s\S]*)/);
  if (match) {
    return {
      category: match[1].replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      comment: match[2] || null,
    };
  }
  return { category: null, comment: reason };
}

export default function AdminDisputesPage() {
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [resolving, setResolving] = useState(false);
  const [decision, setDecision] = useState<string>("");
  const [splitPercent, setSplitPercent] = useState("50");
  const [tab, setTab] = useState<"active" | "resolved">("active");
  const [toast, setToast] = useState<{ message: string; variant: "success" | "error" } | null>(null);

  const showToast = (message: string, variant: "success" | "error" = "success") => {
    setToast({ message, variant });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchDisputes = async () => {
    try {
      const res = await fetch("/api/admin/disputes");
      if (res.ok) {
        const data = await res.json();
        setDisputes(data.disputes || []);
      }
    } catch {
      console.error("Failed to fetch disputes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDisputes(); }, []);

  const handleResolve = async () => {
    if (!selectedDispute || !decision) return;
    setResolving(true);
    try {
      const body: Record<string, unknown> = { decision };
      if (decision === "split") body.splitPercent = parseInt(splitPercent);

      const res = await fetch(`/api/collaborations/${selectedDispute.id}/resolve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (res.ok) {
        showToast("Dispute resolved successfully", "success");
        setSelectedDispute(null);
        setDecision("");
        fetchDisputes();
      } else {
        showToast(data.error || "Failed to resolve", "error");
      }
    } catch {
      showToast("Failed to resolve dispute", "error");
    } finally {
      setResolving(false);
    }
  };

  const activeDisputes = disputes.filter((d) => d.status === "DISPUTED");
  const resolvedDisputes = disputes.filter((d) => d.status === "RESOLVED");
  const displayDisputes = tab === "active" ? activeDisputes : resolvedDisputes;

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
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Disputes</h1>
            <p className="text-sm text-muted-foreground">
              {activeDisputes.length} active, {resolvedDisputes.length} resolved
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === "active" ? "bg-red-500/10 text-red-600 border border-red-500/30" : "bg-muted/50 text-muted-foreground hover:bg-muted"}`}
            onClick={() => setTab("active")}
          >
            Active ({activeDisputes.length})
          </button>
          <button
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === "resolved" ? "bg-success/10 text-success border border-success/30" : "bg-muted/50 text-muted-foreground hover:bg-muted"}`}
            onClick={() => setTab("resolved")}
          >
            Resolved ({resolvedDisputes.length})
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Dispute list */}
          <div className="lg:col-span-1 space-y-3">
            {displayDisputes.length === 0 && (
              <Card className="p-8 text-center">
                <Clock className="h-8 w-8 mx-auto mb-2 opacity-30" />
                <p className="text-sm text-muted-foreground">No {tab} disputes</p>
              </Card>
            )}
            {displayDisputes.map((dispute) => {
              const { category } = parseDisputeReason(dispute.disputeReason);
              return (
                <Card
                  key={dispute.id}
                  className={`p-4 cursor-pointer transition-all hover:shadow-md ${selectedDispute?.id === dispute.id ? "ring-2 ring-primary" : ""} ${dispute.status === "DISPUTED" ? "border-red-500/20" : ""}`}
                  onClick={() => { setSelectedDispute(dispute); setDecision(""); }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-sm">{dispute.campaign.title}</h3>
                    <Badge className={`text-xs ${dispute.status === "DISPUTED" ? "bg-red-500/10 text-red-600 border-red-500/30" : "bg-success/10 text-success border-success/30"}`}>
                      {dispute.status === "DISPUTED" ? "Active" : "Resolved"}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">
                    {dispute.campaign.brand.companyName} vs @{dispute.influencer.handle}
                  </p>
                  {category && (
                    <span className="inline-block text-xs font-medium px-2 py-0.5 rounded-full bg-red-500/10 text-red-600 border border-red-500/20 mb-2">{category}</span>
                  )}
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>${dispute.agreedPrice ? (dispute.agreedPrice / 100).toFixed(0) : "N/A"}</span>
                    <span>{dispute.disputedAt ? new Date(dispute.disputedAt).toLocaleDateString() : ""}</span>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Detail panel */}
          <div className="lg:col-span-2">
            {!selectedDispute ? (
              <Card className="p-12 text-center">
                <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-20" />
                <p className="text-sm text-muted-foreground">Select a dispute to view details</p>
              </Card>
            ) : (
              <Card className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-bold">{selectedDispute.campaign.title}</h2>
                    <p className="text-sm text-muted-foreground">{selectedDispute.campaign.description}</p>
                  </div>
                  <Badge className={`${selectedDispute.status === "DISPUTED" ? "bg-red-500/10 text-red-600 border-red-500/30" : "bg-success/10 text-success border-success/30"}`}>
                    {selectedDispute.status}
                  </Badge>
                </div>

                {/* Parties */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="p-3 rounded-lg bg-muted/50 border">
                    <p className="text-xs text-muted-foreground mb-1">Project</p>
                    <p className="text-sm font-medium">{selectedDispute.campaign.brand.companyName}</p>
                    <p className="text-xs text-muted-foreground">{selectedDispute.campaign.brand.profile?.email}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50 border">
                    <p className="text-xs text-muted-foreground mb-1">Creator</p>
                    <p className="text-sm font-medium">@{selectedDispute.influencer.handle}</p>
                    <p className="text-xs text-muted-foreground">{selectedDispute.influencer.profile?.email}</p>
                  </div>
                </div>

                {/* Dispute reason */}
                {(() => {
                  const { category, comment } = parseDisputeReason(selectedDispute.disputeReason);
                  return (
                    <div className="rounded-lg border border-red-500/20 overflow-hidden mb-4">
                      <div className="px-4 py-2.5 bg-red-500/10 flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-red-600" />
                        <span className="text-sm font-medium text-red-600">Dispute Reason</span>
                      </div>
                      <div className="px-4 py-3 space-y-2">
                        {category && (
                          <span className="inline-block text-xs font-medium px-2 py-0.5 rounded-full bg-red-500/10 text-red-600 border border-red-500/20">{category}</span>
                        )}
                        {comment && <p className="text-sm">{comment}</p>}
                      </div>
                    </div>
                  );
                })()}

                {/* Price & Terms */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="p-3 rounded-lg bg-muted/50 border">
                    <p className="text-xs text-muted-foreground mb-1">Agreed Price</p>
                    <p className="text-sm font-bold text-primary">${selectedDispute.agreedPrice ? (selectedDispute.agreedPrice / 100).toFixed(0) : "N/A"}</p>
                    <p className="text-xs text-muted-foreground">50% remaining: ${selectedDispute.agreedPrice ? (selectedDispute.agreedPrice / 200).toFixed(0) : "N/A"}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50 border">
                    <p className="text-xs text-muted-foreground mb-1">Filed</p>
                    <p className="text-sm font-medium">{selectedDispute.disputedAt ? new Date(selectedDispute.disputedAt).toLocaleString() : "Unknown"}</p>
                  </div>
                </div>

                {(selectedDispute.brandTerms || selectedDispute.influencerTerms) && (
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {selectedDispute.brandTerms && (
                      <div className="p-3 rounded-lg bg-muted/50 border">
                        <p className="text-xs text-muted-foreground mb-1">Project Terms</p>
                        <p className="text-sm">{selectedDispute.brandTerms}</p>
                      </div>
                    )}
                    {selectedDispute.influencerTerms && (
                      <div className="p-3 rounded-lg bg-muted/50 border">
                        <p className="text-xs text-muted-foreground mb-1">Creator Terms</p>
                        <p className="text-sm">{selectedDispute.influencerTerms}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Links */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedDispute.contentUrl && (
                    <a href={selectedDispute.contentUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20">
                      <ExternalLink className="h-3 w-3" /> Content Draft
                    </a>
                  )}
                  {(selectedDispute.publishedUrls?.length > 0 ? selectedDispute.publishedUrls : selectedDispute.publishedUrl ? [selectedDispute.publishedUrl] : []).map((url, i) => (
                    <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20">
                      <ExternalLink className="h-3 w-3" /> Published {i + 1}
                    </a>
                  ))}
                  <a href={`/api/collaborations/${selectedDispute.id}/agreement`} download className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-muted/50 border hover:bg-muted">
                    <FileText className="h-3 w-3" /> Agreement PDF
                  </a>
                </div>

                {/* Resolved result */}
                {selectedDispute.status === "RESOLVED" && selectedDispute.disputeResult && (
                  <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-success/10 border border-success/20 mb-4">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    <div>
                      <p className="text-sm font-medium text-success">Resolved</p>
                      <p className="text-xs text-muted-foreground">{selectedDispute.disputeResult}</p>
                    </div>
                  </div>
                )}

                {/* Decision — only for active disputes */}
                {selectedDispute.status === "DISPUTED" && (
                  <div className="border-t pt-4">
                    <p className="text-sm font-semibold mb-3">Make Decision</p>
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      {[
                        { key: "influencer", label: "Creator wins", desc: "Full remaining to creator" },
                        { key: "brand", label: "Project wins", desc: "Full refund to project" },
                        { key: "split", label: "Split", desc: "Custom split %" },
                      ].map((opt) => (
                        <button
                          key={opt.key}
                          className={`p-3 rounded-lg border-2 text-center transition-all ${decision === opt.key ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}
                          onClick={() => setDecision(opt.key)}
                        >
                          <p className="text-sm font-medium">{opt.label}</p>
                          <p className="text-xs text-muted-foreground">{opt.desc}</p>
                        </button>
                      ))}
                    </div>

                    {decision === "split" && (
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-sm text-muted-foreground">Creator:</span>
                        <Input type="number" value={splitPercent} onChange={(e) => setSplitPercent(e.target.value)} className="w-20 h-9" min="0" max="100" />
                        <span className="text-sm text-muted-foreground">% | Project: {100 - parseInt(splitPercent || "0")}%</span>
                      </div>
                    )}

                    <Button className="w-full" disabled={!decision || resolving} onClick={handleResolve}>
                      {resolving ? "Resolving..." : "Resolve Dispute"}
                    </Button>
                  </div>
                )}
              </Card>
            )}
          </div>
        </div>
      </main>

      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg border backdrop-blur-sm ${toast.variant === "success" ? "bg-success/10 border-success/30 text-success" : "bg-red-500/10 border-red-500/30 text-red-600"}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}
