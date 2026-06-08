"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";

export function SettingsTab() {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  return (
    <motion.div
      key="settings"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground text-sm sm:text-base">Manage your account settings and preferences</p>
      </div>

      <Card className="p-6 max-w-3xl">
        <div className="space-y-6">
          <div className="pb-6 border-b">
            <h3 className="text-lg font-semibold mb-4">Account Settings</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-sm font-medium mb-2 block">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  className="h-11"
                />
              </div>
              <div>
                <Label htmlFor="password" className="text-sm font-medium mb-2 block">
                  Change Password
                </Label>
                <Button type="button" variant="outline" size="sm">
                  Update Password
                </Button>
              </div>
            </div>
          </div>

          <div className="pb-6 border-b">
            <h3 className="text-lg font-semibold mb-4">Notifications</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Email Notifications</p>
                  <p className="text-xs text-muted-foreground">Receive email updates about your campaigns</p>
                </div>
                <input type="checkbox" defaultChecked className="h-4 w-4" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Campaign Updates</p>
                  <p className="text-xs text-muted-foreground">Get notified when influencers apply or accept invitations</p>
                </div>
                <input type="checkbox" defaultChecked className="h-4 w-4" />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-destructive">Danger Zone</h3>
            <Button variant="destructive" size="sm" onClick={() => setShowDeleteModal(true)}>
              Delete Account
            </Button>
            <p className="text-xs text-muted-foreground mt-2">This action cannot be undone</p>
          </div>
        </div>
      </Card>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
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
