"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

export function SettingsTab() {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [campaignUpdates, setCampaignUpdates] = useState(true);
  const [userEmail, setUserEmail] = useState('');
  const [emailVerified, setEmailVerified] = useState(false);
  const [totpEnabled, setTotpEnabled] = useState(false);
  const [totpSetup, setTotpSetup] = useState<{ qrCode: string; secret: string } | null>(null);
  const [totpVerifyCode, setTotpVerifyCode] = useState('');
  const [totpBackupCodes, setTotpBackupCodes] = useState<string[] | null>(null);
  const [toast, setToast] = useState<{ message: string; variant: 'success' | 'error' } | null>(null);

  const showToast = (message: string, variant: 'success' | 'error' = 'success') => {
    setToast({ message, variant });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    fetch('/api/profiles/me')
      .then(res => res.json())
      .then(data => {
        if (data.profile) {
          setUserEmail(data.profile.email || '');
          setEmailVerified(data.profile.emailVerified || false);
          setTotpEnabled(data.profile.totpEnabled || false);
          setEmailNotifications(data.profile.emailNotifications ?? true);
          setCampaignUpdates(data.profile.campaignUpdates ?? true);
        }
      })
      .catch(() => {});
  }, []);

  const handleNotificationToggle = async (field: 'emailNotifications' | 'campaignUpdates', value: boolean) => {
    if (field === 'emailNotifications') setEmailNotifications(value);
    else setCampaignUpdates(value);

    try {
      await fetch('/api/profiles/me/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: value }),
      });
    } catch {
      if (field === 'emailNotifications') setEmailNotifications(!value);
      else setCampaignUpdates(!value);
    }
  };

  return (
    <motion.div
      key="settings"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-2 rounded-lg text-sm font-medium shadow-lg ${toast.variant === 'success' ? 'bg-success text-white' : 'bg-destructive text-white'}`}>
          {toast.message}
        </div>
      )}

      <div className="mb-6">
        <h1 className="text-xl sm:text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground text-sm sm:text-base">Manage your account preferences</p>
      </div>

      <div className="space-y-4 max-w-2xl">
        {/* Account */}
        <Card className="p-4 sm:p-5">
          <h3 className="text-sm font-semibold mb-3">Account</h3>
          <div className="space-y-4">
            <div>
              <Label className="text-xs text-muted-foreground">Email</Label>
              <div className="flex items-center gap-2 mt-1">
                <Input value={userEmail} readOnly className="h-10 bg-muted/50" />
                {emailVerified && <CheckCircle2 className="h-4 w-4 text-success shrink-0" />}
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
                if (newPw !== confirmPw) { showToast('Passwords do not match', 'error'); return; }
                if (newPw.length < 8) { showToast('Password must be at least 8 characters', 'error'); return; }
                try {
                  const res = await fetch('/api/auth/change-password', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ currentPassword: currentPw, newPassword: newPw }),
                  });
                  const data = await res.json();
                  if (res.ok) { showToast('Password changed successfully', 'success'); form.reset(); }
                  else showToast(data.error || 'Failed to change password', 'error');
                } catch { showToast('Failed to change password', 'error'); }
              }} className="space-y-2">
                <Input name="currentPassword" type="password" placeholder="Current password" className="h-10" required />
                <Input name="newPassword" type="password" placeholder="New password" className="h-10" required minLength={8} />
                <Input name="confirmPassword" type="password" placeholder="Confirm new password" className="h-10" required minLength={8} />
                <Button type="submit" size="sm">Change Password</Button>
              </form>
            </div>
          </div>
        </Card>

        {/* Notifications */}
        <Card className="p-4 sm:p-5">
          <h3 className="text-sm font-semibold mb-3">Notifications</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">Email Notifications</div>
                <div className="text-xs text-muted-foreground">Receive email updates about your campaigns</div>
              </div>
              <input
                type="checkbox"
                checked={emailNotifications}
                onChange={(e) => handleNotificationToggle('emailNotifications', e.target.checked)}
                className="rounded"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">Campaign Updates</div>
                <div className="text-xs text-muted-foreground">Get notified when creators apply or accept invitations</div>
              </div>
              <input
                type="checkbox"
                checked={campaignUpdates}
                onChange={(e) => handleNotificationToggle('campaignUpdates', e.target.checked)}
                className="rounded"
              />
            </div>
          </div>
        </Card>

        {/* Two-Factor Authentication */}
        <Card className="p-4 sm:p-5">
          <h3 className="text-sm font-semibold mb-3">Two-Factor Authentication</h3>
          {totpBackupCodes ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-success" />
                <span className="text-sm font-medium text-success">2FA enabled successfully</span>
              </div>
              <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
                <p className="text-xs font-medium text-amber-800 mb-2">Save these backup codes in a safe place. Each can be used once if you lose access to your authenticator app.</p>
                <div className="grid grid-cols-2 gap-1">
                  {totpBackupCodes.map((code) => (
                    <code key={code} className="text-xs bg-white px-2 py-1 rounded border text-center font-mono">{code}</code>
                  ))}
                </div>
              </div>
              <Button size="sm" onClick={() => { setTotpBackupCodes(null); setTotpSetup(null); setTotpEnabled(true); }}>
                I saved my backup codes
              </Button>
            </div>
          ) : totpEnabled ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-success" />
                <span className="text-sm font-medium text-success">2FA is enabled</span>
              </div>
              <p className="text-xs text-muted-foreground">Your account is protected with an authenticator app.</p>
              <form onSubmit={async (e) => {
                e.preventDefault();
                const code = (e.currentTarget.elements.namedItem('disableCode') as HTMLInputElement).value;
                try {
                  const res = await fetch('/api/auth/2fa/disable', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code }) });
                  const data = await res.json();
                  if (res.ok) { setTotpEnabled(false); showToast('2FA disabled', 'success'); e.currentTarget.reset(); }
                  else showToast(data.error || 'Failed', 'error');
                } catch { showToast('Failed to disable 2FA', 'error'); }
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
                  else showToast(data.error || 'Invalid code', 'error');
                } catch { showToast('Failed to verify', 'error'); }
              }} className="flex gap-2">
                <Input type="text" inputMode="numeric" placeholder="Enter 6-digit code" value={totpVerifyCode} onChange={(e) => setTotpVerifyCode(e.target.value)} className="h-9 flex-1 text-center tracking-widest" maxLength={6} required />
                <Button type="submit" size="sm" className="shrink-0">Verify</Button>
              </form>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-muted-foreground">Add an extra layer of security with an authenticator app (Google Authenticator, Authy, etc.)</p>
              <Button size="sm" variant="outline" onClick={async () => {
                try {
                  const res = await fetch('/api/auth/2fa/setup', { method: 'POST' });
                  const data = await res.json();
                  if (res.ok) setTotpSetup({ qrCode: data.qrCode, secret: data.secret });
                  else showToast(data.error || 'Failed to setup 2FA', 'error');
                } catch { showToast('Failed to setup 2FA', 'error'); }
              }}>Enable 2FA</Button>
            </div>
          )}
        </Card>

        {/* Delete Account */}
        <div className="flex items-center justify-between px-4 py-3 rounded-lg border border-muted">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Delete Account</p>
            <p className="text-xs text-muted-foreground">Permanently delete your account and all data</p>
          </div>
          <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 text-xs" onClick={() => setShowDeleteModal(true)}>
            Delete
          </Button>
        </div>
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-background border border-border rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl">
            <h3 className="text-lg font-bold mb-2 text-destructive">Delete Account</h3>
            <p className="text-sm text-muted-foreground mb-4">
              This action is permanent and cannot be undone. All your data will be deleted.
            </p>
            <div className="mb-4">
              <label className="text-sm font-medium mb-1 block">Type &quot;DELETE&quot; to confirm</label>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder='Type "DELETE" to confirm'
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-destructive"
              />
            </div>
            {deleteError && <p className="text-sm text-red-500 mb-3">{deleteError}</p>}
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => { setShowDeleteModal(false); setDeleteConfirmText(''); setDeleteError(''); }}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                className="flex-1"
                disabled={deleteConfirmText !== 'DELETE' || deleteLoading}
                onClick={async () => {
                  setDeleteLoading(true);
                  setDeleteError('');
                  try {
                    const res = await fetch('/api/auth/delete-account', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ confirmation: deleteConfirmText }),
                    });
                    if (res.ok) {
                      window.location.href = '/';
                    } else {
                      const data = await res.json();
                      setDeleteError(data.error || 'Failed to delete account');
                      setDeleteLoading(false);
                    }
                  } catch {
                    setDeleteError('Failed to delete account');
                    setDeleteLoading(false);
                  }
                }}
              >
                {deleteLoading ? 'Deleting...' : 'Delete Account'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
