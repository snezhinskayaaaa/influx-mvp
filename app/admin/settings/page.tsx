"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AdminNav } from "@/components/admin-nav";
import { motion } from "framer-motion";
import {
  Settings,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
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

export default function AdminSettings() {
  const [depositFee, setDepositFee] = useState("");
  const [withdrawalFee, setWithdrawalFee] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/admin/settings");
        const data = await res.json();
        const settings = data.settings || {};
        setDepositFee(String(settings.depositFeePercent ?? ""));
        setWithdrawalFee(String(settings.withdrawalFeePercent ?? ""));
      } catch (error) {
        console.error("Failed to fetch settings:", error);
        setMessage({ type: "error", text: "Failed to load settings" });
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSave = async () => {
    setMessage(null);
    setSaving(true);

    const depositFeePercent = parseFloat(depositFee);
    const withdrawalFeePercent = parseFloat(withdrawalFee);

    if (isNaN(depositFeePercent) || isNaN(withdrawalFeePercent)) {
      setMessage({ type: "error", text: "Please enter valid numeric values" });
      setSaving(false);
      return;
    }

    if (
      depositFeePercent < 0 ||
      depositFeePercent > 100 ||
      withdrawalFeePercent < 0 ||
      withdrawalFeePercent > 100
    ) {
      setMessage({
        type: "error",
        text: "Fee percentages must be between 0 and 100",
      });
      setSaving(false);
      return;
    }

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ depositFeePercent, withdrawalFeePercent }),
      });

      if (res.ok) {
        setMessage({ type: "success", text: "Settings saved successfully" });
      } else {
        const data = await res.json();
        setMessage({
          type: "error",
          text: data.error || "Failed to save settings",
        });
      }
    } catch (error) {
      console.error("Failed to save settings:", error);
      setMessage({ type: "error", text: "Failed to save settings" });
    } finally {
      setSaving(false);
    }
  };

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
          className="space-y-8 max-w-2xl"
        >
          {/* Header */}
          <motion.div variants={fadeInUp}>
            <h1 className="text-3xl font-bold text-foreground">Settings</h1>
            <p className="text-muted-foreground mt-1">
              Configure platform fees and global settings
            </p>
          </motion.div>

          {/* Settings Form */}
          <motion.div variants={fadeInUp}>
            <Card className="border border-border/50 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Settings className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground">
                    Platform Fees
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Set the fee percentages for deposits and withdrawals
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="deposit-fee"
                    className="text-sm font-medium text-foreground"
                  >
                    Deposit Fee (%)
                  </Label>
                  <Input
                    id="deposit-fee"
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    placeholder="e.g. 2.5"
                    value={depositFee}
                    onChange={(e) => setDepositFee(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Fee charged on brand deposits into the platform
                  </p>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="withdrawal-fee"
                    className="text-sm font-medium text-foreground"
                  >
                    Withdrawal Fee (%)
                  </Label>
                  <Input
                    id="withdrawal-fee"
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    placeholder="e.g. 1.5"
                    value={withdrawalFee}
                    onChange={(e) => setWithdrawalFee(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Fee charged on influencer withdrawals from the platform
                  </p>
                </div>

                {/* Message */}
                {message && (
                  <div
                    className={`flex items-center gap-2 p-3 rounded-lg text-sm ${
                      message.type === "success"
                        ? "bg-green-500/10 text-green-600 border border-green-500/20"
                        : "bg-red-500/10 text-red-600 border border-red-500/20"
                    }`}
                  >
                    {message.type === "success" ? (
                      <CheckCircle2 className="h-4 w-4 shrink-0" />
                    ) : (
                      <AlertCircle className="h-4 w-4 shrink-0" />
                    )}
                    {message.text}
                  </div>
                )}

                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {saving ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Save Settings
                </Button>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
