"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import {
  Building2,
  Globe,
  Instagram,
  Twitter,
  Linkedin,
  Camera,
  Save,
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
  youtubeUrl: string;
  setYoutubeUrl: (value: string) => void;
  linkedinUrl: string;
  setLinkedinUrl: (value: string) => void;
  companyCountry: string;
  companyIndustry: string;
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
  youtubeUrl,
  setYoutubeUrl,
  linkedinUrl,
  setLinkedinUrl,
  companyCountry,
  companyIndustry,
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
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
              <Building2 className="h-10 w-10 text-primary" />
            </div>
            <div>
              <Button type="button" size="sm" variant="outline">
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

            <div className="relative">
              <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Instagram URL"
                value={instagramUrl}
                onChange={(e) => setInstagramUrl(e.target.value)}
                className="pl-10 h-11"
              />
            </div>

            <div className="relative">
              <Twitter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="X URL"
                value={twitterUrl}
                onChange={(e) => setTwitterUrl(e.target.value)}
                className="pl-10 h-11"
              />
            </div>

            <div className="relative">
              <Youtube className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="YouTube URL"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                className="pl-10 h-11"
              />
            </div>

            <div className="relative">
              <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="LinkedIn URL"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                className="pl-10 h-11"
              />
            </div>
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
