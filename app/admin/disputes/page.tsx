"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { AlertCircle, CheckCircle2, ExternalLink, FileText, Clock } from "lucide-react";

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

export default function AdminDisputesPage() {
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [resolving, setResolving] = useState(false);
  const [decision, setDecision] = useState<string>("");
  const [splitPercent, setSplitPercent] = useState("50");
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

  useEffect(() => {
    fetchDisputes();
  }, []);

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

  if (loading) return <div className="p-8 text-center text-muted-foreground">Loading disputes...</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Disputes</h1>
        <p className="text-sm text-muted-foreground">
          {activeDisputes.length} active, {resolvedDisputes.length} resolved
        </p>
      </div>

      {/* Active disputes */}
      {activeDisputes.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-600" />
            Active Disputes ({activeDisputes.length})
          </h2>
          <div className="space-y-4">
            {activeDisputes.map((dispute) => (
              <Card
                key={dispute.id}
                className={`p-4 cursor-pointer transition-all hover:shadow-md ${selectedDispute?.id === dispute.id ? "ring-2 ring-primary" : ""}`}
                onClick={() => { setSelectedDispute(dispute); setDecision(""); }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold">{dispute.campaign.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {dispute.campaign.brand.companyName} vs @{dispute.influencer.handle}
                    </p>
                  </div>
                  <Badge className="bg-red-500/10 text-red-600 border border-red-500/30">Disputed</Badge>
                </div>
                <div className="text-sm text-muted-foreground mb-2">
                  <strong>Reason:</strong> {dispute.disputeReason || "No reason provided"}
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>Price: ${dispute.agreedPrice ? (dispute.agreedPrice / 100).toFixed(0) : "N/A"}</span>
                  <span>Filed: {dispute.disputedAt ? new Date(dispute.disputedAt).toLocaleDateString() : "Unknown"}</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Selected dispute detail */}
      {selectedDispute && selectedDispute.status === "DISPUTED" && (
        <Card className="p-6 mb-8 border-2 border-primary/30">
          <h2 className="text-lg font-bold mb-4">Resolve Dispute</h2>

          {/* Context */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
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

          <div className="space-y-3 mb-4">
            <div className="p-3 rounded-lg bg-muted/50 border">
              <p className="text-xs text-muted-foreground mb-1">Campaign</p>
              <p className="text-sm font-medium">{selectedDispute.campaign.title}</p>
              <p className="text-xs text-muted-foreground mt-1">{selectedDispute.campaign.description}</p>
            </div>

            <div className="p-3 rounded-lg bg-red-500/5 border border-red-500/20">
              <p className="text-xs text-red-600 font-medium mb-1">Dispute Reason</p>
              <p className="text-sm">{selectedDispute.disputeReason}</p>
            </div>

            <div className="p-3 rounded-lg bg-muted/50 border">
              <p className="text-xs text-muted-foreground mb-1">Agreed Price</p>
              <p className="text-sm font-bold text-primary">${selectedDispute.agreedPrice ? (selectedDispute.agreedPrice / 100).toFixed(0) : "N/A"}</p>
              <p className="text-xs text-muted-foreground">Remaining (50%): ${selectedDispute.agreedPrice ? (selectedDispute.agreedPrice / 200).toFixed(0) : "N/A"}</p>
            </div>

            {/* Terms */}
            {(selectedDispute.brandTerms || selectedDispute.influencerTerms) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
            <div className="flex flex-wrap gap-2">
              {selectedDispute.contentUrl && (
                <a href={selectedDispute.contentUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20">
                  <ExternalLink className="h-3 w-3" />
                  Content Draft
                </a>
              )}
              {(selectedDispute.publishedUrls?.length > 0 ? selectedDispute.publishedUrls : selectedDispute.publishedUrl ? [selectedDispute.publishedUrl] : []).map((url, i) => (
                <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20">
                  <ExternalLink className="h-3 w-3" />
                  Published Link {i + 1}
                </a>
              ))}
              <a href={`/api/collaborations/${selectedDispute.id}/agreement`} download className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-muted/50 border hover:bg-muted">
                <FileText className="h-3 w-3" />
                Agreement PDF
              </a>
            </div>
          </div>

          {/* Decision */}
          <div className="border-t pt-4">
            <p className="text-sm font-medium mb-3">Decision</p>
            <div className="grid grid-cols-3 gap-2 mb-3">
              <button
                className={`p-3 rounded-lg border-2 text-center transition-all ${decision === "influencer" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}
                onClick={() => setDecision("influencer")}
              >
                <p className="text-sm font-medium">Creator wins</p>
                <p className="text-xs text-muted-foreground">Full remaining to creator</p>
              </button>
              <button
                className={`p-3 rounded-lg border-2 text-center transition-all ${decision === "brand" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}
                onClick={() => setDecision("brand")}
              >
                <p className="text-sm font-medium">Project wins</p>
                <p className="text-xs text-muted-foreground">Full refund to project</p>
              </button>
              <button
                className={`p-3 rounded-lg border-2 text-center transition-all ${decision === "split" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}
                onClick={() => setDecision("split")}
              >
                <p className="text-sm font-medium">Split</p>
                <p className="text-xs text-muted-foreground">Custom split %</p>
              </button>
            </div>

            {decision === "split" && (
              <div className="flex items-center gap-3 mb-3">
                <span className="text-sm text-muted-foreground">Creator gets:</span>
                <Input
                  type="number"
                  value={splitPercent}
                  onChange={(e) => setSplitPercent(e.target.value)}
                  className="w-20 h-9"
                  min="0"
                  max="100"
                />
                <span className="text-sm text-muted-foreground">%</span>
                <span className="text-sm text-muted-foreground">| Project gets: {100 - parseInt(splitPercent || "0")}%</span>
              </div>
            )}

            <Button
              className="w-full"
              disabled={!decision || resolving}
              onClick={handleResolve}
            >
              {resolving ? "Resolving..." : "Resolve Dispute"}
            </Button>
          </div>
        </Card>
      )}

      {/* Resolved disputes */}
      {resolvedDisputes.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-success" />
            Resolved ({resolvedDisputes.length})
          </h2>
          <div className="space-y-3">
            {resolvedDisputes.map((dispute) => (
              <Card key={dispute.id} className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-sm">{dispute.campaign.title}</h3>
                    <p className="text-xs text-muted-foreground">
                      {dispute.campaign.brand.companyName} vs @{dispute.influencer.handle}
                    </p>
                  </div>
                  <Badge className="bg-success/10 text-success border border-success/30">Resolved</Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-1"><strong>Reason:</strong> {dispute.disputeReason}</p>
                <p className="text-xs text-success"><strong>Result:</strong> {dispute.disputeResult}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Resolved: {dispute.resolvedAt ? new Date(dispute.resolvedAt).toLocaleDateString() : "Unknown"}
                </p>
              </Card>
            ))}
          </div>
        </div>
      )}

      {disputes.length === 0 && (
        <Card className="p-12 text-center">
          <Clock className="h-12 w-12 mx-auto mb-4 opacity-30" />
          <p className="text-lg font-medium text-muted-foreground">No disputes yet</p>
        </Card>
      )}

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg border backdrop-blur-sm ${toast.variant === "success" ? "bg-success/10 border-success/30 text-success" : "bg-red-500/10 border-red-500/30 text-red-600"}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}
