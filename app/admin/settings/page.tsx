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
  Shield,
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
  const [userEmail, setUserEmail] = useState('');
  const [totpEnabled, setTotpEnabled] = useState(false);
  const [totpSetup, setTotpSetup] = useState<{ qrCode: string; secret: string } | null>(null);
  const [totpVerifyCode, setTotpVerifyCode] = useState('');
  const [totpBackupCodes, setTotpBackupCodes] = useState<string[] | null>(null);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [codeToken, setCodeToken] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [codeSending, setCodeSending] = useState(false);
  const [codeError, setCodeError] = useState("");

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
    fetch('/api/profiles/me').then(r => r.json()).then(d => {
      if (d.profile) {
        setUserEmail(d.profile.email || '');
        setTotpEnabled(d.profile.totpEnabled || false);
      }
    }).catch(() => {});
  }, []);

  const handleSave = async () => {
    setMessage(null);

    const depositFeePercent = parseFloat(depositFee);
    const withdrawalFeePercent = parseFloat(withdrawalFee);

    if (isNaN(depositFeePercent) || isNaN(withdrawalFeePercent)) {
      setMessage({ type: "error", text: "Please enter valid numeric values" });
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
      return;
    }

    // Send verification code instead of saving directly
    setCodeSending(true);
    try {
      const res = await fetch("/api/admin/settings/send-code", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage({
          type: "error",
          text: data.error || "Failed to send verification code",
        });
        return;
      }
      setCodeToken(data.codeToken);
      setShowCodeModal(true);
    } catch {
      setMessage({
        type: "error",
        text: "Failed to send verification code",
      });
    } finally {
      setCodeSending(false);
    }
  };

  const handleConfirmSave = async () => {
    setSaving(true);
    const depositFeePercent = parseFloat(depositFee);
    const withdrawalFeePercent = parseFloat(withdrawalFee);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          depositFeePercent,
          withdrawalFeePercent,
          codeToken,
          code: verificationCode,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setCodeError(data.error || "Verification failed");
        return;
      }
      setShowCodeModal(false);
      setVerificationCode("");
      setCodeError("");
      setMessage({ type: "success", text: "Settings saved successfully" });
    } catch {
      setCodeError("Something went wrong");
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
                  disabled={saving || codeSending}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {codeSending ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  {codeSending ? "Sending Code..." : "Save Settings"}
                </Button>
              </div>
            </Card>
          </motion.div>
          {/* Account */}
          <motion.div variants={fadeInUp}>
            <Card className="border border-border/50 p-6">
              <h2 className="text-lg font-semibold mb-4">Account</h2>
              <div className="space-y-4">
                <div>
                  <Label className="text-xs text-muted-foreground">Email</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Input value={userEmail} readOnly className="h-10 bg-muted/50" />
                    <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                  </div>
                </div>
                <div className="border-t pt-4">
                  <Label className="text-xs font-medium mb-2 block">Change Password</Label>
                  <form onSubmit={async (e) => {
                    e.preventDefault();
                    const form = e.currentTarget;
                    const currentPw = (form.elements.namedItem('currentPassword') as HTMLInputElement).value;
                    const newPw = (form.elements.namedItem('newPassword') as HTMLInputElement).value;
                    const confirmPw = (form.elements.namedItem('confirmPassword') as HTMLInputElement).value;
                    if (newPw !== confirmPw) { setMessage({ type: 'error', text: 'Passwords do not match' }); return; }
                    if (newPw.length < 8) { setMessage({ type: 'error', text: 'Password must be at least 8 characters' }); return; }
                    try {
                      const res = await fetch('/api/auth/change-password', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ currentPassword: currentPw, newPassword: newPw }) });
                      const data = await res.json();
                      if (res.ok) { setMessage({ type: 'success', text: 'Password changed' }); form.reset(); }
                      else setMessage({ type: 'error', text: data.error || 'Failed' });
                    } catch { setMessage({ type: 'error', text: 'Failed to change password' }); }
                  }} className="space-y-2">
                    <Input name="currentPassword" type="password" placeholder="Current password" className="h-10" required />
                    <Input name="newPassword" type="password" placeholder="New password" className="h-10" required minLength={8} />
                    <Input name="confirmPassword" type="password" placeholder="Confirm new password" className="h-10" required minLength={8} />
                    <Button type="submit" size="sm">Change Password</Button>
                  </form>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Two-Factor Authentication */}
          <motion.div variants={fadeInUp}>
            <Card className="border border-border/50 p-6">
              <h2 className="text-lg font-semibold mb-4">Two-Factor Authentication</h2>
              {totpBackupCodes ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium text-green-600">2FA enabled successfully</span>
                  </div>
                  <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
                    <p className="text-xs font-medium text-amber-800 mb-2">Save these backup codes in a safe place.</p>
                    <div className="grid grid-cols-2 gap-1">
                      {totpBackupCodes.map((code) => (
                        <code key={code} className="text-xs bg-white px-2 py-1 rounded border text-center font-mono">{code}</code>
                      ))}
                    </div>
                  </div>
                  <Button size="sm" onClick={() => { setTotpBackupCodes(null); setTotpSetup(null); setTotpEnabled(true); }}>I saved my backup codes</Button>
                </div>
              ) : totpEnabled ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium text-green-600">2FA is enabled</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Your admin account is protected with an authenticator app.</p>
                  <form onSubmit={async (e) => {
                    e.preventDefault();
                    const code = (e.currentTarget.elements.namedItem('disableCode') as HTMLInputElement).value;
                    try {
                      const res = await fetch('/api/auth/2fa/disable', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code }) });
                      const data = await res.json();
                      if (res.ok) { setTotpEnabled(false); setMessage({ type: 'success', text: '2FA disabled' }); e.currentTarget.reset(); }
                      else setMessage({ type: 'error', text: data.error || 'Failed' });
                    } catch { setMessage({ type: 'error', text: 'Failed to disable 2FA' }); }
                  }} className="flex gap-2">
                    <Input name="disableCode" type="text" placeholder="Enter password, app code, or backup code to disable 2FA" className="h-9 flex-1" required />
                    <Button type="submit" variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50 text-xs h-9 shrink-0">Disable</Button>
                  </form>
                </div>
              ) : totpSetup ? (
                <div className="space-y-3">
                  <p className="text-xs text-muted-foreground">Scan this QR code with your authenticator app:</p>
                  <div className="flex justify-center">
                    <img src={totpSetup.qrCode} alt="QR Code" className="w-48 h-48 rounded-lg border" />
                  </div>
                  <p className="text-[10px] text-muted-foreground text-center">
                    Or enter manually: <code className="bg-muted px-1 py-0.5 rounded text-[10px]">{totpSetup.secret}</code>
                  </p>
                  <form onSubmit={async (e) => {
                    e.preventDefault();
                    try {
                      const res = await fetch('/api/auth/2fa/verify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code: totpVerifyCode }) });
                      const data = await res.json();
                      if (res.ok && data.enabled) setTotpBackupCodes(data.backupCodes);
                      else setMessage({ type: 'error', text: data.error || 'Invalid code' });
                    } catch { setMessage({ type: 'error', text: 'Failed to verify' }); }
                  }} className="flex gap-2">
                    <Input type="text" inputMode="numeric" placeholder="Enter 6-digit code" value={totpVerifyCode} onChange={(e) => setTotpVerifyCode(e.target.value)} className="h-9 flex-1 text-center tracking-widest" maxLength={6} required />
                    <Button type="submit" size="sm" className="shrink-0">Verify</Button>
                  </form>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-xs text-muted-foreground">Protect your admin account with an authenticator app (Google Authenticator, Authy, etc.)</p>
                  <Button size="sm" variant="outline" onClick={async () => {
                    try {
                      const res = await fetch('/api/auth/2fa/setup', { method: 'POST' });
                      const data = await res.json();
                      if (res.ok) setTotpSetup({ qrCode: data.qrCode, secret: data.secret });
                      else setMessage({ type: 'error', text: data.error || 'Failed to setup 2FA' });
                    } catch { setMessage({ type: 'error', text: 'Failed to setup 2FA' }); }
                  }}>Enable 2FA</Button>
                </div>
              )}
            </Card>
          </motion.div>
        </motion.div>
      </main>

      {/* Verification Code Modal */}
      {showCodeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-background border border-border rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl">
            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                <Shield className="h-7 w-7 text-primary" />
              </div>
            </div>
            <h3 className="text-lg font-bold text-center mb-2">
              Verify Settings Change
            </h3>
            <p className="text-muted-foreground text-center text-sm mb-4">
              A 6-digit verification code has been sent to your email. Enter it
              below to confirm the fee changes.
            </p>
            <div className="mb-4">
              <Input
                type="text"
                placeholder="000000"
                value={verificationCode}
                onChange={(e) => {
                  setVerificationCode(
                    e.target.value.replace(/\D/g, "").slice(0, 6)
                  );
                  setCodeError("");
                }}
                className="text-center text-2xl tracking-[0.5em] font-mono h-14"
                maxLength={6}
              />
            </div>
            {codeError && (
              <p className="text-sm text-red-500 text-center mb-4">
                {codeError}
              </p>
            )}
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setShowCodeModal(false);
                  setVerificationCode("");
                  setCodeError("");
                }}
              >
                Cancel
              </Button>
              <Button
                className="flex-1"
                disabled={verificationCode.length !== 6 || saving}
                onClick={handleConfirmSave}
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  "Confirm & Save"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
