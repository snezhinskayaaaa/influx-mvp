"use client";

import { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AdminNav } from "@/components/admin-nav";
import { motion } from "framer-motion";
import {
  Building2,
  Target,
  DollarSign,
  Loader2,
  Search,
  CheckCircle2,
  XCircle,
  Globe,
  Crown,
} from "lucide-react";
import Image from "next/image";

const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.4, 0.25, 1] as const } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};

interface Brand {
  id: string;
  companyName: string;
  industry: string | null;
  website: string | null;
  description: string | null;
  instagramHandle: string | null;
  twitterHandle: string | null;
  telegramHandle: string | null;
  youtubeHandle: string | null;
  linkedinHandle: string | null;
  foundingMember: boolean;
  balance: number;
  frozenBalance: number;
  createdAt: string;
  profile?: { email?: string; fullName?: string; avatarUrl?: string };
  _count?: { campaigns: number };
}

export default function AdminBrands() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);

  const fetchBrands = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/brands");
      const data = await res.json();
      setBrands(data.brands || []);
    } catch (error) {
      console.error("Failed to fetch brands:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchBrands(); }, [fetchBrands]);

  const filtered = brands.filter((b) => {
    const q = searchQuery.toLowerCase();
    return !q || b.companyName.toLowerCase().includes(q) || (b.profile?.email || '').toLowerCase().includes(q);
  });

  const extractHandle = (url: string | null) => {
    if (!url) return null;
    return url.replace(/^https?:\/\/(www\.)?(instagram\.com|tiktok\.com|youtube\.com|x\.com|t\.me|twitter\.com|linkedin\.com)\/?@?/i, '').replace(/^@/, '').split('/')[0].split('?')[0] || url;
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
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-8">
          {/* Header */}
          <motion.div variants={fadeInUp} className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Projects</h1>
              <p className="text-muted-foreground mt-1">Manage registered projects and their activity</p>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search by name or email..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9" />
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div variants={fadeInUp} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="p-5 border border-border/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Projects</p>
                  <p className="text-xl font-bold">{brands.length}</p>
                </div>
              </div>
            </Card>
            <Card className="p-5 border border-border/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                  <Target className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Campaigns</p>
                  <p className="text-xl font-bold">{brands.reduce((sum, b) => sum + (b._count?.campaigns || 0), 0)}</p>
                </div>
              </div>
            </Card>
            <Card className="p-5 border border-border/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Founding Members</p>
                  <p className="text-xl font-bold">{brands.filter(b => b.foundingMember).length}</p>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Table */}
          <motion.div variants={fadeInUp}>
            <Card className="border border-border/50 overflow-hidden">
              <div className="hidden sm:grid grid-cols-12 gap-4 p-4 bg-muted/30 border-b border-border/50 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <div className="col-span-3">Project</div>
                <div className="col-span-3">Email</div>
                <div className="col-span-2">Industry</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-2 text-right">Campaigns</div>
              </div>

              <div className="divide-y divide-border/50">
                {filtered.length === 0 ? (
                  <div className="p-12 text-center text-muted-foreground text-sm">No projects found</div>
                ) : (
                  filtered.map((brand) => (
                    <div
                      key={brand.id}
                      className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 p-4 items-center hover:bg-muted/20 transition-colors cursor-pointer"
                      onClick={() => setSelectedBrand(brand)}
                    >
                      <div className="sm:col-span-3 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0 overflow-hidden">
                          {brand.profile?.avatarUrl ? (
                            <Image src={brand.profile.avatarUrl} alt="" width={36} height={36} className="w-full h-full object-cover" />
                          ) : (
                            <Building2 className="h-4 w-4 text-primary" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{brand.companyName}</p>
                          {brand.foundingMember && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 border border-amber-500/20 font-medium">Founding</span>
                          )}
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <p className="text-sm text-muted-foreground truncate">{brand.profile?.email || '—'}</p>
                      </div>

                      <div className="sm:col-span-2">
                        {brand.industry && (
                          <Badge variant="outline" className="text-xs font-normal">{brand.industry}</Badge>
                        )}
                      </div>

                      <div className="sm:col-span-2">
                        <div className="flex gap-1">
                          {[brand.twitterHandle, brand.telegramHandle, brand.instagramHandle, brand.youtubeHandle, brand.linkedinHandle].filter(Boolean).length > 0 ? (
                            <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px]">
                              {[brand.twitterHandle, brand.telegramHandle, brand.instagramHandle, brand.youtubeHandle, brand.linkedinHandle].filter(Boolean).length} socials
                            </Badge>
                          ) : (
                            <Badge className="bg-muted text-muted-foreground border-border text-[10px]">No socials</Badge>
                          )}
                        </div>
                      </div>

                      <div className="sm:col-span-2 text-right">
                        <span className="text-sm font-medium">{brand._count?.campaigns || 0}</span>
                        <span className="text-xs text-muted-foreground ml-1">campaigns</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </main>

      {/* Detail Modal */}
      {selectedBrand && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setSelectedBrand(null)}>
          <div className="bg-background border border-border rounded-2xl p-6 w-full max-w-lg mx-4 shadow-2xl max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold">Project Profile</h3>
              <Button variant="ghost" size="sm" onClick={() => setSelectedBrand(null)}>
                <XCircle className="h-5 w-5" />
              </Button>
            </div>

            {/* Header */}
            <div className="flex items-center gap-4 mb-5 pb-5 border-b border-border/50">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center shrink-0 overflow-hidden">
                {selectedBrand.profile?.avatarUrl ? (
                  <Image src={selectedBrand.profile.avatarUrl} alt="" width={64} height={64} className="w-full h-full object-cover" />
                ) : (
                  <Building2 className="h-8 w-8 text-primary" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-lg">{selectedBrand.companyName}</p>
                {selectedBrand.profile?.fullName && <p className="text-sm text-muted-foreground">{selectedBrand.profile.fullName}</p>}
                <p className="text-sm text-muted-foreground truncate">{selectedBrand.profile?.email}</p>
              </div>
              <div className="flex flex-col gap-1 items-end">
                {selectedBrand.foundingMember && (
                  <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 text-[10px]">
                    <Crown className="h-3 w-3 mr-1" />Founding
                  </Badge>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="space-y-4">
              {selectedBrand.industry && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Industry</p>
                  <p className="text-sm font-medium">{selectedBrand.industry}</p>
                </div>
              )}

              {selectedBrand.description && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Description</p>
                  <p className="text-sm">{selectedBrand.description}</p>
                </div>
              )}

              {selectedBrand.website && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Website</p>
                  <a href={selectedBrand.website.startsWith('http') ? selectedBrand.website : `https://${selectedBrand.website}`} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline flex items-center gap-1">
                    <Globe className="h-3 w-3" />{selectedBrand.website}
                  </a>
                </div>
              )}

              {/* Wallet */}
              <div>
                <p className="text-xs text-muted-foreground mb-1">Wallet</p>
                <div className="flex gap-4 text-sm">
                  <span>Balance: <strong>${(selectedBrand.balance / 100).toFixed(2)}</strong></span>
                  <span>Frozen: <strong>${(selectedBrand.frozenBalance / 100).toFixed(2)}</strong></span>
                </div>
              </div>

              {/* Social Media */}
              {[selectedBrand.twitterHandle, selectedBrand.telegramHandle, selectedBrand.instagramHandle, selectedBrand.youtubeHandle, selectedBrand.linkedinHandle].some(Boolean) && (
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Social Media</p>
                  <div className="space-y-2">
                    {([
                      { handle: selectedBrand.twitterHandle, label: 'X (Twitter)', url: (h: string) => `https://x.com/${extractHandle(h)}` },
                      { handle: selectedBrand.telegramHandle, label: 'Telegram', url: (h: string) => `https://t.me/${extractHandle(h)}` },
                      { handle: selectedBrand.instagramHandle, label: 'Instagram', url: (h: string) => `https://instagram.com/${extractHandle(h)}` },
                      { handle: selectedBrand.youtubeHandle, label: 'YouTube', url: (h: string) => `https://youtube.com/@${extractHandle(h)}` },
                      { handle: selectedBrand.linkedinHandle, label: 'LinkedIn', url: (h: string) => h.startsWith('http') ? h : `https://linkedin.com/in/${extractHandle(h)}` },
                    ]).filter(s => s.handle).map(social => (
                      <div key={social.label} className="flex items-center justify-between rounded-lg border border-border p-2.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium">{social.label}</span>
                          <a href={social.url(social.handle!)} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">
                            @{extractHandle(social.handle!)}
                          </a>
                        </div>
                        <a href={social.url(social.handle!)} target="_blank" rel="noopener noreferrer" className="text-[10px] text-primary hover:underline">Open</a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-border p-3 text-center">
                  <p className="text-[10px] text-muted-foreground mb-0.5">Campaigns</p>
                  <p className="text-lg font-bold">{selectedBrand._count?.campaigns || 0}</p>
                </div>
                <div className="rounded-lg border border-border p-3 text-center">
                  <p className="text-[10px] text-muted-foreground mb-0.5">Registered</p>
                  <p className="text-sm font-medium">{new Date(selectedBrand.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
