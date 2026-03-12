"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Wallet,
  Search,
  TrendingUp,
  Users,
  Calendar,
  DollarSign,
  Settings,
  User,
  Bell,
  LogOut,
  ChevronDown,
  Filter,
  X,
  Eye,
  Heart,
  CheckCircle2,
  Clock,
  Briefcase,
  BarChart3,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { NetworkLogo } from "@/components/logo";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface Campaign {
  id: number;
  title: string;
  brand: string;
  brandAvatar: string;
  category: string;
  budget: number;
  pricingModel: "CPM" | "CPC" | "CPE";
  description: string;
  requirements: string[];
  platforms: string[];
  deadline: string;
  status: "open" | "applied" | "approved" | "active" | "completed";
}

const mockDiscoverCampaigns: Campaign[] = [
  {
    id: 1,
    title: "Summer Fashion Collection Launch",
    brand: "StyleCo",
    brandAvatar: "👗",
    category: "Fashion & Style",
    budget: 5000,
    pricingModel: "CPM",
    description: "Promote our new summer collection with authentic styling content",
    requirements: ["Fashion niche", "10k+ followers", "High engagement rate"],
    platforms: ["Instagram", "TikTok"],
    deadline: "2026-04-15",
    status: "open",
  },
  {
    id: 2,
    title: "Tech Product Review Campaign",
    brand: "TechNova",
    brandAvatar: "💻",
    category: "Technology",
    budget: 8000,
    pricingModel: "CPE",
    description: "Create detailed review content for our latest gadget",
    requirements: ["Tech reviews", "Authentic voice", "Video content"],
    platforms: ["YouTube", "Instagram"],
    deadline: "2026-04-20",
    status: "open",
  },
  {
    id: 3,
    title: "Fitness App Launch",
    brand: "FitLife",
    brandAvatar: "💪",
    category: "Health & Fitness",
    budget: 3000,
    pricingModel: "CPE",
    description: "Drive app downloads with workout transformation content",
    requirements: ["Fitness content", "Genuine results", "Story-driven"],
    platforms: ["Instagram", "TikTok"],
    deadline: "2026-04-10",
    status: "applied",
  },
  {
    id: 4,
    title: "Beauty Product Line Promotion",
    brand: "GlowBeauty",
    brandAvatar: "✨",
    category: "Beauty & Care",
    budget: 4500,
    pricingModel: "CPM",
    description: "Showcase our new skincare line with before/after content",
    requirements: ["Beauty niche", "Skincare focus", "Authentic reviews"],
    platforms: ["Instagram", "YouTube"],
    deadline: "2026-04-25",
    status: "open",
  },
];

const mockMyCampaigns: Campaign[] = [
  {
    id: 3,
    title: "Fitness App Launch",
    brand: "FitLife",
    brandAvatar: "💪",
    category: "Health & Fitness",
    budget: 3000,
    pricingModel: "CPE",
    description: "Drive app downloads with workout transformation content",
    requirements: ["Fitness content", "Genuine results", "Story-driven"],
    platforms: ["Instagram", "TikTok"],
    deadline: "2026-04-10",
    status: "applied",
  },
  {
    id: 5,
    title: "Eco-Friendly Products Campaign",
    brand: "GreenEarth",
    brandAvatar: "🌱",
    category: "Lifestyle",
    budget: 6000,
    pricingModel: "CPM",
    description: "Promote sustainable living products",
    requirements: ["Eco-conscious content", "Lifestyle niche"],
    platforms: ["Instagram"],
    deadline: "2026-05-01",
    status: "approved",
  },
  {
    id: 6,
    title: "Travel Gear Review",
    brand: "Wanderlust",
    brandAvatar: "✈️",
    category: "Travel",
    budget: 7000,
    pricingModel: "CPE",
    description: "Create content featuring our travel accessories",
    requirements: ["Travel content", "Adventure focus"],
    platforms: ["YouTube", "Instagram"],
    deadline: "2026-03-20",
    status: "active",
  },
];

export default function InfluencerDashboard() {
  const [activeTab, setActiveTab] = useState<"discover" | "my-campaigns" | "profile" | "settings">("discover");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPlatform, setSelectedPlatform] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  const categories = [
    "all",
    "Fashion & Style",
    "Technology",
    "Health & Fitness",
    "Beauty & Care",
    "Food & Beverage",
    "Travel",
    "Lifestyle",
    "Gaming",
    "Education",
  ];

  const platforms = ["all", "Instagram", "TikTok", "YouTube", "Twitter"];

  const filteredDiscoverCampaigns = mockDiscoverCampaigns.filter((campaign) => {
    const matchesSearch =
      campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.brand.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || campaign.category === selectedCategory;
    const matchesPlatform =
      selectedPlatform === "all" || campaign.platforms.includes(selectedPlatform);
    return matchesSearch && matchesCategory && matchesPlatform;
  });

  const getPricingLabel = (model: string) => {
    switch (model) {
      case "CPM":
        return "Cost Per 1000 Views";
      case "CPC":
        return "Cost Per Click";
      case "CPE":
        return "Cost Per Engagement";
      default:
        return model;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-blue-500/10 text-blue-600 border-blue-500/30";
      case "applied":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-500/30";
      case "approved":
        return "bg-green-500/10 text-green-600 border-green-500/30";
      case "active":
        return "bg-primary/10 text-primary border-primary/30";
      case "completed":
        return "bg-gray-500/10 text-gray-600 border-gray-500/30";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container max-w-full px-6 h-20">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <NetworkLogo className="w-8 h-8 transition-transform group-hover:scale-110" />
              <div className="flex items-baseline gap-1">
                <span className="text-xl sm:text-2xl font-bold text-primary">INFLUX</span>
                <span className="text-xs font-medium text-foreground/60">connect</span>
              </div>
            </Link>

            <div className="flex items-center gap-2 sm:gap-3">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="sm" className="relative text-sm font-medium text-muted-foreground hover:bg-muted/50 hover:text-foreground">
                    <Bell className="h-4 w-4" />
                    <span className="absolute -top-1 -right-1 h-4 w-4 bg-primary text-primary-foreground text-[10px] font-semibold rounded-full flex items-center justify-center">
                      2
                    </span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-96 p-0" align="end" sideOffset={8}>
                  <div className="p-4 border-b">
                    <h3 className="font-semibold text-base">Notifications</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Stay updated with your campaigns
                    </p>
                  </div>
                  <div className="p-3">
                    <p className="text-sm text-muted-foreground text-center py-8">
                      No new notifications
                    </p>
                  </div>
                </PopoverContent>
              </Popover>

              <Button variant="ghost" size="sm" asChild className="text-sm font-medium text-muted-foreground hover:bg-muted/50 hover:text-foreground">
                <Link href="/login">
                  <LogOut className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer for fixed header */}
      <div className="h-20"></div>

      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden lg:block w-64 border-r bg-muted/30 min-h-[calc(100vh-80px)] sticky top-20">
          <nav className="p-4 space-y-2">
            {/* Balance Card */}
            <div className="w-full p-4 rounded-xl bg-primary/10 border-2 border-primary/30 mb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Wallet className="h-4 w-4 text-primary" />
                  <span className="text-xs font-medium text-muted-foreground">Balance</span>
                </div>
              </div>
              <div className="text-2xl font-bold text-primary text-left mb-2">
                $3,450.00
              </div>
              <div className="text-xs text-muted-foreground space-y-1">
                <div>Pending: $1,200</div>
                <div>Total Earned: $12,450</div>
              </div>
              <Button size="sm" className="w-full mt-3 h-8 text-xs">
                Withdraw
              </Button>
            </div>

            <button
              onClick={() => setActiveTab("discover")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === "discover"
                  ? "bg-primary/10 text-primary border-2 border-primary/30"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Search className="h-4 w-4" />
              Discover Campaigns
            </button>

            <button
              onClick={() => setActiveTab("my-campaigns")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === "my-campaigns"
                  ? "bg-primary/10 text-primary border-2 border-primary/30"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <BarChart3 className="h-4 w-4" />
              My Campaigns
            </button>

            <button
              onClick={() => setActiveTab("profile")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === "profile"
                  ? "bg-primary/10 text-primary border-2 border-primary/30"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <User className="h-4 w-4" />
              Profile
            </button>

            <button
              onClick={() => setActiveTab("settings")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === "settings"
                  ? "bg-primary/10 text-primary border-2 border-primary/30"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Settings className="h-4 w-4" />
              Settings
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          <AnimatePresence mode="wait">
          {/* Discover Campaigns Tab */}
          {activeTab === "discover" && (
            <motion.div
              key="discover"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold mb-2">Discover Campaigns</h1>
                <p className="text-muted-foreground text-sm sm:text-base">
                  Find and apply to campaigns that match your audience
                </p>
              </div>

              {/* Search and Filters */}
              <Card className="p-4 mb-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search campaigns or brands..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setShowFilters(!showFilters)}
                    className="sm:w-auto"
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                    {(selectedCategory !== "all" || selectedPlatform !== "all") && (
                      <Badge className="ml-2 bg-primary/10 text-primary border-primary/30">
                        {(selectedCategory !== "all" ? 1 : 0) + (selectedPlatform !== "all" ? 1 : 0)}
                      </Badge>
                    )}
                  </Button>
                </div>

                {/* Filter Panel */}
                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 pt-4 border-t space-y-4"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs mb-2 block">Category</Label>
                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((cat) => (
                              <SelectItem key={cat} value={cat}>
                                {cat === "all" ? "All Categories" : cat}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-xs mb-2 block">Platform</Label>
                        <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {platforms.map((platform) => (
                              <SelectItem key={platform} value={platform}>
                                {platform === "all" ? "All Platforms" : platform}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedCategory("all");
                          setSelectedPlatform("all");
                        }}
                      >
                        <X className="h-3 w-3 mr-1" />
                        Clear Filters
                      </Button>
                    </div>
                  </motion.div>
                )}
              </Card>

              {/* Campaigns List */}
              <div className="space-y-4">
                {filteredDiscoverCampaigns.map((campaign) => (
                  <motion.div
                    key={campaign.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="p-6 hover:shadow-lg transition-shadow">
                      <div className="flex flex-col lg:flex-row gap-6">
                        {/* Brand Avatar */}
                        <div className="flex-shrink-0">
                          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-3xl">
                            {campaign.brandAvatar}
                          </div>
                        </div>

                        {/* Campaign Info */}
                        <div className="flex-1 space-y-3">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h3 className="text-lg font-semibold mb-1">{campaign.title}</h3>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <span>{campaign.brand}</span>
                                <span>•</span>
                                <Badge variant="outline" className="text-xs">
                                  {campaign.category}
                                </Badge>
                              </div>
                            </div>
                            <Badge className={getStatusColor(campaign.status)}>
                              {campaign.status === "open" && "Open"}
                              {campaign.status === "applied" && "Applied"}
                              {campaign.status === "approved" && "Approved"}
                            </Badge>
                          </div>

                          <p className="text-sm text-muted-foreground">{campaign.description}</p>

                          <div className="flex flex-wrap gap-4 text-sm">
                            <div className="flex items-center gap-2">
                              <DollarSign className="h-4 w-4 text-primary" />
                              <span className="font-semibold">${campaign.budget}</span>
                              <span className="text-muted-foreground">
                                ({getPricingLabel(campaign.pricingModel)})
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span className="text-muted-foreground">
                                Deadline: {new Date(campaign.deadline).toLocaleDateString()}
                              </span>
                            </div>
                          </div>

                          {/* Platforms */}
                          <div className="flex flex-wrap gap-2">
                            {campaign.platforms.map((platform) => (
                              <Badge key={platform} variant="secondary" className="text-xs">
                                {platform}
                              </Badge>
                            ))}
                          </div>

                          {/* Requirements */}
                          <div className="space-y-1">
                            <div className="text-xs font-medium text-muted-foreground">Requirements:</div>
                            <div className="flex flex-wrap gap-2">
                              {campaign.requirements.map((req, idx) => (
                                <span key={idx} className="text-xs bg-muted px-2 py-1 rounded">
                                  {req}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex gap-2 pt-2">
                            {campaign.status === "open" && (
                              <>
                                <Button size="sm">Apply Now</Button>
                                <Button size="sm" variant="outline">
                                  <Heart className="h-4 w-4 mr-1" />
                                  Save
                                </Button>
                              </>
                            )}
                            {campaign.status === "applied" && (
                              <Button size="sm" variant="outline" disabled>
                                <Clock className="h-4 w-4 mr-1" />
                                Application Pending
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}

                {filteredDiscoverCampaigns.length === 0 && (
                  <Card className="p-12 text-center">
                    <div className="text-muted-foreground">
                      <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium mb-2">No campaigns found</p>
                      <p className="text-sm">Try adjusting your search or filters</p>
                    </div>
                  </Card>
                )}
              </div>
            </motion.div>
          )}

          {/* My Campaigns Tab */}
          {activeTab === "my-campaigns" && (
            <motion.div
              key="my-campaigns"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold mb-2">My Campaigns</h1>
                <p className="text-muted-foreground text-sm sm:text-base">
                  Track and manage your active collaborations
                </p>
              </div>

              <div className="space-y-4">
                {mockMyCampaigns.map((campaign) => (
                  <Card key={campaign.id} className="p-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-3xl">
                          {campaign.brandAvatar}
                        </div>
                      </div>

                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="text-lg font-semibold mb-1">{campaign.title}</h3>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span>{campaign.brand}</span>
                            </div>
                          </div>
                          <Badge className={getStatusColor(campaign.status)}>
                            {campaign.status === "applied" && "Pending Approval"}
                            {campaign.status === "approved" && "Approved"}
                            {campaign.status === "active" && "In Progress"}
                            {campaign.status === "completed" && "Completed"}
                          </Badge>
                        </div>

                        <p className="text-sm text-muted-foreground">{campaign.description}</p>

                        <div className="flex flex-wrap gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-primary" />
                            <span className="font-semibold">${campaign.budget}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">
                              Due: {new Date(campaign.deadline).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        <div className="flex gap-2 pt-2">
                          <Button size="sm">View Details</Button>
                          {campaign.status === "active" && (
                            <Button size="sm" variant="outline">
                              Submit Draft
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}

          {/* Profile Tab */}
          {activeTab === "profile" && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold mb-2">Profile</h1>
                <p className="text-muted-foreground text-sm sm:text-base">
                  Manage your public profile and portfolio
                </p>
              </div>

              <Card className="p-6 sm:p-8">
                <div className="space-y-6">
                  <div className="flex items-center gap-6">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-4xl">
                      🎭
                    </div>
                    <div>
                      <Button size="sm" variant="outline">Change Avatar</Button>
                    </div>
                  </div>

                  <div className="grid gap-4">
                    <div>
                      <Label htmlFor="display-name">Display Name</Label>
                      <Input id="display-name" defaultValue="Luna Virtual" />
                    </div>
                    <div>
                      <Label htmlFor="username">Username</Label>
                      <Input id="username" defaultValue="@lunavirtual" />
                    </div>
                    <div>
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        defaultValue="AI influencer creating authentic content for fashion and lifestyle brands"
                        className="min-h-[100px]"
                      />
                    </div>
                    <div>
                      <Label htmlFor="categories">Categories</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge>Fashion</Badge>
                        <Badge>Lifestyle</Badge>
                        <Badge>Beauty</Badge>
                        <Button size="sm" variant="outline" className="h-6 text-xs">
                          + Add
                        </Button>
                      </div>
                    </div>
                  </div>

                  <Button>Save Changes</Button>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold mb-2">Settings</h1>
                <p className="text-muted-foreground text-sm sm:text-base">
                  Manage your account preferences
                </p>
              </div>

              <div className="space-y-6">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Account Settings</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" defaultValue="luna@influx.ai" />
                    </div>
                    <div>
                      <Label htmlFor="password">Password</Label>
                      <Input id="password" type="password" placeholder="••••••••" />
                    </div>
                    <Button>Update Account</Button>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Notifications</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Campaign Invitations</div>
                        <div className="text-sm text-muted-foreground">
                          Get notified when brands invite you
                        </div>
                      </div>
                      <input type="checkbox" defaultChecked className="rounded" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Application Updates</div>
                        <div className="text-sm text-muted-foreground">
                          Updates on your campaign applications
                        </div>
                      </div>
                      <input type="checkbox" defaultChecked className="rounded" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Payment Notifications</div>
                        <div className="text-sm text-muted-foreground">
                          Get notified about payments
                        </div>
                      </div>
                      <input type="checkbox" defaultChecked className="rounded" />
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Payment Settings</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="payment-method">Payment Method</Label>
                      <Select defaultValue="bank">
                        <SelectTrigger id="payment-method">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bank">Bank Transfer</SelectItem>
                          <SelectItem value="paypal">PayPal</SelectItem>
                          <SelectItem value="crypto">Cryptocurrency</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button variant="outline">Manage Payment Methods</Button>
                  </div>
                </Card>
              </div>
            </motion.div>
          )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
