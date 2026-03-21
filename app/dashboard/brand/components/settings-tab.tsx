"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";

export function SettingsTab() {
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
            <Button variant="destructive" size="sm">
              Delete Account
            </Button>
            <p className="text-xs text-muted-foreground mt-2">This action cannot be undone</p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
