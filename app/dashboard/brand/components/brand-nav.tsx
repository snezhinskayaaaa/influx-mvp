"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { NetworkLogo } from "@/components/logo";
import { motion } from "framer-motion";
import {
  Search,
  Building2,
  Plus,
  BarChart3,
  Settings,
  LogOut,
  Wallet,
  CreditCard,
  Bitcoin,
  Bell,
  Check as CheckIcon,
  Copy,
} from "lucide-react";
import type { Tab, Notification } from "./types";

interface BrandNavProps {
  notifications: Notification[];
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
}

export function BrandNav({
  notifications,
  setNotifications,
}: BrandNavProps) {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <>
      {/* Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-primary/5 backdrop-blur-md border-b border-border/50 py-4" role="banner">
        <div className="px-6 sm:px-12 lg:px-16">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <NetworkLogo className="w-8 h-8 transition-transform group-hover:scale-110" />
              <div className="flex items-baseline gap-1">
                <span className="text-xl sm:text-2xl font-bold text-primary">INFLUX</span>
                <span className="text-xs font-medium text-foreground/60">connect</span>
              </div>
            </Link>

            <div className="flex items-center gap-2 sm:gap-3">
              <Popover open={showNotifications} onOpenChange={setShowNotifications}>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="sm" className="relative text-sm font-medium text-muted-foreground hover:bg-muted/50 hover:text-foreground">
                    <Bell className="h-4 w-4" />
                    {notifications.filter(n => !n.read).length > 0 && (
                      <span className="absolute -top-1 -right-1 h-4 w-4 bg-primary text-primary-foreground text-[10px] font-semibold rounded-full flex items-center justify-center">
                        {notifications.filter(n => !n.read).length}
                      </span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-96 p-0" align="end" sideOffset={8}>
                  <div className="p-4 border-b">
                    <h3 className="font-semibold text-base">Notifications</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Stay updated with your campaigns
                    </p>
                  </div>

                  <div className="space-y-2 max-h-[400px] overflow-y-auto p-3">
                    {notifications.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-8">
                        No notifications yet
                      </p>
                    ) : (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-3 rounded-lg border ${
                            notification.read
                              ? "border-border bg-muted/20"
                              : "border-primary/30 bg-primary/5"
                          }`}
                        >
                          <div className="flex items-start justify-between mb-1.5">
                            <div className="flex-1 pr-2">
                              {notification.type === "invitation_accepted" ? (
                                <p className="text-xs leading-relaxed">
                                  <span className="font-semibold text-primary">{notification.influencerName}</span>
                                  {" "}accepted your invite for{" "}
                                  <span className="font-medium">{notification.campaignTitle}</span>
                                </p>
                              ) : (
                                <p className="text-xs leading-relaxed">
                                  <span className="font-semibold text-primary">{notification.influencerName}</span>
                                  {" "}applied to{" "}
                                  <span className="font-medium">{notification.campaignTitle}</span>
                                </p>
                              )}
                            </div>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-primary rounded-full shrink-0 mt-1"></div>
                            )}
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] text-muted-foreground">{notification.timestamp}</span>
                            {!notification.read && (
                              <button
                                onClick={() => {
                                  setNotifications(notifications.map(n =>
                                    n.id === notification.id ? { ...n, read: true } : n
                                  ));
                                }}
                                className="text-[10px] text-primary hover:underline"
                              >
                                Mark as read
                              </button>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {notifications.length > 0 && (
                    <div className="p-3 border-t flex items-center justify-between gap-2">
                      {notifications.filter(n => !n.read).length > 0 && (
                        <button
                          onClick={() => {
                            setNotifications(notifications.map(n => ({ ...n, read: true })));
                          }}
                          className="flex-1 text-xs text-center text-primary hover:underline"
                        >
                          Mark all as read
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setNotifications([]);
                        }}
                        className="flex-1 text-xs text-center text-muted-foreground hover:text-destructive hover:underline"
                      >
                        Clear all
                      </button>
                    </div>
                  )}
                </PopoverContent>
              </Popover>

              <Button variant="ghost" size="sm" className="text-sm font-medium text-muted-foreground hover:bg-muted/50 hover:text-foreground" onClick={async () => { await fetch('/api/auth/logout', { method: 'POST' }); window.location.href = '/login'; }}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer for fixed header */}
      <div className="h-20"></div>
    </>
  );
}

interface BrandSidebarProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  balance: number;
  setBalance: (balance: number) => void;
}

export function BrandSidebar({
  activeTab,
  setActiveTab,
  balance,
  setBalance,
}: BrandSidebarProps) {
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [topUpMethod, setTopUpMethod] = useState<"card" | "crypto" | null>(null);
  const [topUpAmount, setTopUpAmount] = useState("");
  const [selectedCrypto, setSelectedCrypto] = useState("");
  const [selectedNetwork, setSelectedNetwork] = useState("");
  const [copiedAddress, setCopiedAddress] = useState(false);

  return (
      <aside className="hidden lg:block w-64 border-r bg-muted/30 min-h-[calc(100vh-80px)] sticky top-20">
        <nav className="p-4 space-y-2">
          {/* Balance Card */}
          <Dialog open={showTopUpModal} onOpenChange={setShowTopUpModal}>
            <DialogTrigger asChild>
              <button className="w-full p-4 rounded-xl bg-primary/10 border-2 border-primary/30 hover:bg-primary/15 hover:border-primary/40 transition-all mb-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Wallet className="h-4 w-4 text-primary" />
                    <span className="text-xs font-medium text-muted-foreground">Balance</span>
                  </div>
                  <Plus className="h-3.5 w-3.5 text-primary" />
                </div>
                <div className="text-2xl font-bold text-primary text-left">
                  ${balance.toFixed(2)}
                </div>
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Top Up Balance</DialogTitle>
                <DialogDescription>
                  Add funds to your account to start campaigns
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                {/* Amount Input */}
                <div>
                  <Label htmlFor="amount-sidebar" className="text-sm font-medium mb-2 block">
                    Amount (USD)
                  </Label>
                  <Input
                    id="amount-sidebar"
                    type="number"
                    placeholder="0.00"
                    value={topUpAmount}
                    onChange={(e) => setTopUpAmount(e.target.value)}
                    className="h-11"
                  />
                </div>

                {/* Payment Method Selection */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">
                    Payment Method
                  </Label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setTopUpMethod("crypto")}
                      className={`relative p-4 rounded-xl border-2 text-left transition-all ${
                        topUpMethod === "crypto"
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <Bitcoin className={`h-5 w-5 mb-2 ${topUpMethod === "crypto" ? "text-primary" : "text-muted-foreground"}`} />
                      <div className="text-sm font-medium">Crypto</div>
                      <div className="text-xs text-muted-foreground">Any crypto accepted</div>
                    </button>

                    <button
                      disabled
                      className="relative p-4 rounded-xl border-2 text-left opacity-60 cursor-not-allowed border-border bg-muted/30"
                    >
                      <CreditCard className="h-5 w-5 mb-2 text-muted-foreground" />
                      <div className="text-sm font-medium mb-1">Card</div>
                      <Badge className="absolute top-2 right-2 text-[10px] px-2 py-0.5 bg-amber-500/20 text-amber-600 border-amber-500/30">
                        Coming Soon
                      </Badge>
                    </button>
                  </div>
                </div>

                {/* Card Payment Form */}
                {topUpMethod === "card" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="space-y-3 pt-2"
                  >
                    <div>
                      <Label htmlFor="card-number-sidebar" className="text-sm mb-2 block">
                        Card Number
                      </Label>
                      <Input
                        id="card-number-sidebar"
                        placeholder="1234 5678 9012 3456"
                        className="h-10"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="expiry-sidebar" className="text-sm mb-2 block">
                          Expiry
                        </Label>
                        <Input
                          id="expiry-sidebar"
                          placeholder="MM/YY"
                          className="h-10"
                        />
                      </div>
                      <div>
                        <Label htmlFor="cvv-sidebar" className="text-sm mb-2 block">
                          CVV
                        </Label>
                        <Input
                          id="cvv-sidebar"
                          placeholder="123"
                          className="h-10"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Crypto Payment Info */}
                {topUpMethod === "crypto" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="space-y-4"
                  >
                    {/* Select Cryptocurrency */}
                    <div>
                      <Label htmlFor="crypto-currency" className="text-sm font-medium mb-2 block">
                        Select Cryptocurrency
                      </Label>
                      <Select
                        value={selectedCrypto}
                        onValueChange={(value) => {
                          setSelectedCrypto(value);
                          setSelectedNetwork(""); // Reset network when crypto changes
                        }}
                      >
                        <SelectTrigger className="h-11 rounded-xl border-2 border-primary/30 hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/20">
                          <SelectValue placeholder="Choose cryptocurrency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="btc">Bitcoin (BTC)</SelectItem>
                          <SelectItem value="eth">Ethereum (ETH)</SelectItem>
                          <SelectItem value="usdt">Tether (USDT)</SelectItem>
                          <SelectItem value="usdc">USD Coin (USDC)</SelectItem>
                          <SelectItem value="bnb">Binance Coin (BNB)</SelectItem>
                          <SelectItem value="sol">Solana (SOL)</SelectItem>
                          <SelectItem value="matic">Polygon (MATIC)</SelectItem>
                          <SelectItem value="trx">Tron (TRX)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Select Network */}
                    {selectedCrypto && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                      >
                        <Label htmlFor="crypto-network" className="text-sm font-medium mb-2 block">
                          Select Network
                        </Label>
                        <Select value={selectedNetwork} onValueChange={setSelectedNetwork}>
                          <SelectTrigger className="h-11 rounded-xl border-2 border-secondary/30 hover:border-secondary/50 focus:border-secondary focus:ring-2 focus:ring-secondary/20">
                            <SelectValue placeholder="Choose network" />
                          </SelectTrigger>
                          <SelectContent>
                            {selectedCrypto === "btc" && (
                              <>
                                <SelectItem value="btc">Bitcoin (BTC)</SelectItem>
                                <SelectItem value="lightning">Lightning Network</SelectItem>
                              </>
                            )}
                            {selectedCrypto === "eth" && (
                              <>
                                <SelectItem value="erc20">Ethereum (ERC20)</SelectItem>
                                <SelectItem value="arbitrum">Arbitrum One</SelectItem>
                                <SelectItem value="optimism">Optimism</SelectItem>
                              </>
                            )}
                            {selectedCrypto === "usdt" && (
                              <>
                                <SelectItem value="erc20">Ethereum (ERC20)</SelectItem>
                                <SelectItem value="trc20">Tron (TRC20)</SelectItem>
                                <SelectItem value="bep20">BNB Smart Chain (BEP20)</SelectItem>
                                <SelectItem value="polygon">Polygon</SelectItem>
                                <SelectItem value="arbitrum">Arbitrum One</SelectItem>
                                <SelectItem value="optimism">Optimism</SelectItem>
                                <SelectItem value="solana">Solana</SelectItem>
                              </>
                            )}
                            {selectedCrypto === "usdc" && (
                              <>
                                <SelectItem value="erc20">Ethereum (ERC20)</SelectItem>
                                <SelectItem value="bep20">BNB Smart Chain (BEP20)</SelectItem>
                                <SelectItem value="polygon">Polygon</SelectItem>
                                <SelectItem value="arbitrum">Arbitrum One</SelectItem>
                                <SelectItem value="optimism">Optimism</SelectItem>
                                <SelectItem value="solana">Solana</SelectItem>
                                <SelectItem value="avalanche">Avalanche C-Chain</SelectItem>
                              </>
                            )}
                            {selectedCrypto === "bnb" && (
                              <>
                                <SelectItem value="bep20">BNB Smart Chain (BEP20)</SelectItem>
                                <SelectItem value="bep2">BNB Beacon Chain (BEP2)</SelectItem>
                              </>
                            )}
                            {selectedCrypto === "sol" && (
                              <SelectItem value="solana">Solana</SelectItem>
                            )}
                            {selectedCrypto === "matic" && (
                              <>
                                <SelectItem value="polygon">Polygon</SelectItem>
                                <SelectItem value="erc20">Ethereum (ERC20)</SelectItem>
                              </>
                            )}
                            {selectedCrypto === "trx" && (
                              <SelectItem value="trc20">Tron (TRC20)</SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                      </motion.div>
                    )}

                    {/* Deposit Address Preview */}
                    {selectedCrypto && selectedNetwork && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="p-4 bg-muted/30 rounded-xl space-y-3"
                      >
                        <div className="flex items-start gap-2">
                          <Bitcoin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <div className="text-sm font-medium mb-1">Deposit Address</div>
                            <p className="text-xs text-muted-foreground mb-3">
                              Send {selectedCrypto.toUpperCase()} via {selectedNetwork.toUpperCase()} network.
                              All crypto will be automatically converted to USDC.
                            </p>
                            <div className="relative">
                              <div className="p-3 pr-12 bg-background rounded-lg border text-xs font-mono break-all">
                                {selectedNetwork === "trc20" ? "TXYZabcd1234567890ABCDEFGHIJKLMN" :
                                 selectedNetwork === "solana" ? "7xKXtg2CW87d9wDnEJuBEXz1P9YrKXvBbjC9" :
                                 "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"}
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  const address = selectedNetwork === "trc20" ? "TXYZabcd1234567890ABCDEFGHIJKLMN" :
                                                 selectedNetwork === "solana" ? "7xKXtg2CW87d9wDnEJuBEXz1P9YrKXvBbjC9" :
                                                 "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb";
                                  navigator.clipboard.writeText(address);
                                  setCopiedAddress(true);
                                  setTimeout(() => setCopiedAddress(false), 2000);
                                }}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-muted rounded-md transition-colors"
                              >
                                {copiedAddress ? (
                                  <CheckIcon className="h-4 w-4 text-primary" />
                                ) : (
                                  <Copy className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                                )}
                              </button>
                            </div>
                            <div className="mt-3 p-2 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                              <p className="text-xs text-amber-700 dark:text-amber-400">
                                ⚠️ Only send {selectedCrypto.toUpperCase()} to this address via {selectedNetwork.toUpperCase()} network.
                                Sending other assets or using wrong network may result in permanent loss.
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {!selectedCrypto && (
                      <div className="p-4 bg-muted/30 rounded-xl">
                        <p className="text-xs text-muted-foreground text-center">
                          Select a cryptocurrency and network to see the deposit address
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Action Button */}
                <Button
                  onClick={async () => {
                    if (topUpAmount && topUpMethod) {
                      const amount = parseFloat(topUpAmount);
                      // Try to deposit via API
                      try {
                        const res = await fetch('/api/wallet/deposit', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ amount }),
                        });
                        if (res.ok) {
                          const data = await res.json();
                          // API returns balance in cents
                          if (typeof data.balance === 'number') {
                            setBalance(data.balance / 100);
                          }
                        } else {
                          const data = await res.json().catch(() => ({}));
                          alert(data.error || "Failed to deposit");
                          return;
                        }
                      } catch (error) {
                        console.error('Failed to deposit via API:', error);
                        alert("Failed to deposit. Please try again.");
                        return;
                      }
                      setShowTopUpModal(false);
                      setTopUpAmount("");
                      setTopUpMethod(null);
                      setSelectedCrypto("");
                      setSelectedNetwork("");
                    }
                  }}
                  disabled={!topUpAmount || !topUpMethod || (topUpMethod === "crypto" && (!selectedCrypto || !selectedNetwork))}
                  className="w-full h-11 bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                >
                  {topUpMethod === "card" ? "Pay Now" : "I've Sent the Payment"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <button
            onClick={() => setActiveTab("discover")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              activeTab === "discover"
                ? "bg-primary/10 text-primary border-2 border-primary/30"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <Search className="h-4 w-4" />
            Discover Talent
          </button>

          <button
            onClick={() => setActiveTab("campaigns")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              activeTab === "campaigns"
                ? "bg-primary/10 text-primary border-2 border-primary/30"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <BarChart3 className="h-4 w-4" />
            My Campaigns
          </button>

          <button
            onClick={() => setActiveTab("create-campaign")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              activeTab === "create-campaign"
                ? "bg-primary/10 text-primary border-2 border-primary/30"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <Plus className="h-4 w-4" />
            Create Campaign
          </button>

          <button
            onClick={() => setActiveTab("profile")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              activeTab === "profile"
                ? "bg-primary/10 text-primary border-2 border-primary/30"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <Building2 className="h-4 w-4" />
            Company Profile
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
  );
}

interface MobileNavProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}

export function MobileNav({ activeTab, setActiveTab }: MobileNavProps) {
  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 bg-white dark:bg-black border-t border-border z-[100] safe-area-inset-bottom">
      <div className="flex items-center justify-around w-full px-2 py-2">
        <button
          onClick={() => setActiveTab("discover")}
          className={`flex flex-col items-center justify-center gap-0.5 min-w-0 flex-1 transition-colors ${
            activeTab === "discover" ? "text-primary" : "text-muted-foreground"
          }`}
        >
          <div className="w-6 h-6 rounded-full bg-foreground flex items-center justify-center text-background text-xs font-bold shrink-0">
            N
          </div>
          <span className="text-[8px] font-medium truncate max-w-full text-center">Discover</span>
        </button>
        <button
          onClick={() => setActiveTab("campaigns")}
          className={`flex flex-col items-center justify-center gap-0.5 min-w-0 flex-1 transition-colors ${
            activeTab === "campaigns" ? "text-primary" : "text-muted-foreground"
          }`}
        >
          <BarChart3 className="h-5 w-5 shrink-0" />
          <span className="text-[8px] font-medium truncate max-w-full text-center">Campaigns</span>
        </button>
        <button
          onClick={() => setActiveTab("create-campaign")}
          className={`flex flex-col items-center justify-center gap-0.5 min-w-0 flex-1 transition-colors ${
            activeTab === "create-campaign" ? "text-primary" : "text-muted-foreground"
          }`}
        >
          <Plus className="h-5 w-5 shrink-0" />
          <span className="text-[8px] font-medium truncate max-w-full text-center">Create</span>
        </button>
        <button
          onClick={() => setActiveTab("profile")}
          className={`flex flex-col items-center justify-center gap-0.5 min-w-0 flex-1 transition-colors ${
            activeTab === "profile" ? "text-primary" : "text-muted-foreground"
          }`}
        >
          <Building2 className="h-5 w-5 shrink-0" />
          <span className="text-[8px] font-medium truncate max-w-full text-center">Profile</span>
        </button>
        <button
          onClick={() => setActiveTab("settings")}
          className={`flex flex-col items-center justify-center gap-0.5 min-w-0 flex-1 transition-colors ${
            activeTab === "settings" ? "text-primary" : "text-muted-foreground"
          }`}
        >
          <Settings className="h-5 w-5 shrink-0" />
          <span className="text-[8px] font-medium truncate max-w-full text-center">Settings</span>
        </button>
      </div>
    </nav>
  );
}
