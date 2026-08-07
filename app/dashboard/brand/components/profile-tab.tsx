"use client";

import { Button } from "@/components/ui/button";
import { XIcon } from "@/components/x-icon";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import {
  Building2,
  Globe,
  Instagram,
  Linkedin,
  Camera,
  Save,
  Send,
  Youtube,
} from "lucide-react";

interface ProfileTabProps {
  companyName: string;
  setCompanyName: (value: string) => void;
  companyBio: string;
  setCompanyBio: (value: string) => void;
  websiteUrl: string;
  setWebsiteUrl: (value: string) => void;
  instagramUrl: string;
  setInstagramUrl: (value: string) => void;
  twitterUrl: string;
  setTwitterUrl: (value: string) => void;
  telegramUrl: string;
  setTelegramUrl: (value: string) => void;
  youtubeUrl: string;
  setYoutubeUrl: (value: string) => void;
  linkedinUrl: string;
  setLinkedinUrl: (value: string) => void;
  companyCountry: string;
  companyIndustry: string;
  logoUrl?: string;
  setLogoUrl?: (url: string) => void;
  showToast?: (message: string, variant: 'success' | 'error') => void;
}

export function ProfileTab({
  companyName,
  setCompanyName,
  companyBio,
  setCompanyBio,
  websiteUrl,
  setWebsiteUrl,
  instagramUrl,
  setInstagramUrl,
  twitterUrl,
  setTwitterUrl,
  telegramUrl,
  setTelegramUrl,
  youtubeUrl,
  setYoutubeUrl,
  linkedinUrl,
  setLinkedinUrl,
  companyCountry,
  companyIndustry,
  logoUrl,
  setLogoUrl,
  showToast,
}: ProfileTabProps) {
  return (
    <motion.div
      key="profile"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Company Profile</h1>
        <p className="text-muted-foreground text-sm sm:text-base">Manage your company information</p>
      </div>

      <Card className="p-6 sm:p-8">
        <form className="space-y-5">
          <div className="flex items-center gap-4 pb-5 border-b">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center overflow-hidden">
              {logoUrl ? (
                <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                <Building2 className="h-10 w-10 text-primary" />
              )}
            </div>
            <div>
              <input
                type="file"
                id="logo-upload"
                accept="image/jpeg,image/png,image/svg+xml,image/webp"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  if (file.size > 2 * 1024 * 1024) {
                    showToast?.('Image too large. Maximum 2MB.', 'error');
                    return;
                  }
                  const reader = new FileReader();
                  reader.onload = async () => {
                    const base64 = reader.result as string;
                    try {
                      const res = await fetch('/api/profiles/avatar', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ avatar: base64 }),
                      });
                      if (res.ok) {
                        setLogoUrl?.(base64);
                        showToast?.('Logo updated!', 'success');
                      } else {
                        const data = await res.json();
                        showToast?.(data.error || 'Failed to upload', 'error');
                      }
                    } catch {
                      showToast?.('Failed to upload logo', 'error');
                    }
                  };
                  reader.readAsDataURL(file);
                }}
              />
              <Button type="button" size="sm" variant="outline" onClick={() => document.getElementById('logo-upload')?.click()}>
                <Camera className="h-4 w-4 mr-2" />
                Upload Logo
              </Button>
              <p className="text-xs text-muted-foreground mt-2">JPG, PNG or SVG. Max 2MB.</p>
            </div>
          </div>

          <div>
            <Label htmlFor="company-name" className="text-sm font-medium mb-2 block">
              Company Name
            </Label>
            <Input
              id="company-name"
              placeholder="Your Company Name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="h-11"
            />
          </div>

          <div>
            <Label htmlFor="company-bio" className="text-sm font-medium mb-2 block">
              About Your Company
            </Label>
            <Textarea
              id="company-bio"
              placeholder="Tell influencers about your brand, values, and what you're looking for..."
              value={companyBio}
              onChange={(e) => setCompanyBio(e.target.value)}
              rows={5}
              className="resize-none"
            />
          </div>

          {/* Company Info from Onboarding */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-xl border border-border">
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">Country</Label>
              <div className="text-sm font-medium">{companyCountry}</div>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">Industry</Label>
              <div className="text-sm font-medium">{companyIndustry}</div>
            </div>
            <p className="col-span-2 text-xs text-muted-foreground">
              These details were set during onboarding and cannot be edited here.
            </p>
          </div>

          <div>
            <Label htmlFor="website" className="text-sm font-medium mb-2 block">
              Website
            </Label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="website"
                placeholder="https://yourcompany.com"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                className="pl-10 h-11"
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium">Social Media</Label>
            <p className="text-xs text-muted-foreground">Changes save automatically when you move to the next field.</p>

            {[
              { icon: <Instagram className="h-4 w-4 text-muted-foreground" />, label: 'Instagram', value: instagramUrl, set: setInstagramUrl, placeholder: '@handle or URL', field: 'instagramHandle' },
              { icon: <XIcon className="h-4 w-4 text-muted-foreground" />, label: 'X (Twitter)', value: twitterUrl, set: setTwitterUrl, placeholder: '@handle or URL', field: 'twitterHandle' },
              { icon: <Send className="h-4 w-4 text-muted-foreground" />, label: 'Telegram', value: telegramUrl, set: setTelegramUrl, placeholder: '@channel or URL', field: 'telegramHandle' },
              { icon: <Youtube className="h-4 w-4 text-muted-foreground" />, label: 'YouTube', value: youtubeUrl, set: setYoutubeUrl, placeholder: '@channel or URL', field: 'youtubeHandle' },
              { icon: <Linkedin className="h-4 w-4 text-muted-foreground" />, label: 'LinkedIn', value: linkedinUrl, set: setLinkedinUrl, placeholder: 'URL or handle', field: 'linkedinHandle' },
            ].map(({ icon, label, value, set, placeholder, field }) => (
              <div key={field} className="rounded-lg border border-border p-3 space-y-2" onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                  fetch('/api/brands/me', {
                    method: 'PATCH', headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ [field]: value || null }),
                  }).catch(() => {});
                }
              }}>
                <div className="flex items-center gap-2">
                  {icon}
                  <span className="text-xs font-medium">{label}</span>
                </div>
                <Input
                  placeholder={placeholder}
                  value={value}
                  onChange={(e) => set(e.target.value)}
                  className="h-10"
                />
                {value && (
                  <Button type="button" variant="outline" size="sm" className="h-8 text-xs w-full" onClick={async () => {
                    try {
                      // Save first
                      await fetch('/api/brands/me', {
                        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ [field]: value }),
                      });
                      // Request verification via admin notification
                      const res = await fetch('/api/social/verify', {
                        method: 'POST', headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ platform: label.toLowerCase().replace(/\s*\(.*\)/, '') }),
                      });
                      if (res.ok) showToast?.(`Verification requested for ${label}`, 'success');
                      else { const d = await res.json(); showToast?.(d.error || 'Failed', 'error'); }
                    } catch { showToast?.('Failed to request verification', 'error'); }
                  }}>Request Verification</Button>
                )}
              </div>
            ))}
          </div>

          <div className="flex gap-3 pt-4">
            <Button className="flex-1 h-11 bg-gradient-to-r from-primary to-secondary hover:opacity-90">
              <Save className="h-4 w-4 mr-2" />
              Save Profile
            </Button>
            <Button type="button" variant="outline" className="h-11">
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </motion.div>
  );
}
