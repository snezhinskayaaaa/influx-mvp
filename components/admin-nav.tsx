"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { NetworkLogo } from "@/components/logo";
import {
  LayoutDashboard,
  Users,
  Building2,
  Target,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

const navLinks = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/influencers", label: "Influencers", icon: Users },
  { href: "/admin/brands", label: "Brands", icon: Building2 },
  { href: "/admin/campaigns", label: "Campaigns", icon: Target },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminNav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-foreground text-background border-b border-border/20">
      <div className="px-6 sm:px-12 lg:px-16 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/admin" className="flex items-center gap-3 group">
              <NetworkLogo className="w-7 h-7 transition-transform group-hover:scale-110" />
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold text-primary-foreground">
                  INFLUX
                </span>
                <span className="text-xs font-medium text-background/50">
                  ADMIN
                </span>
              </div>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link key={link.href} href={link.href}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`text-sm font-medium transition-colors ${
                        isActive(link.href)
                          ? "bg-background/15 text-background"
                          : "text-background/60 hover:text-background hover:bg-background/10"
                      }`}
                    >
                      <Icon className="h-4 w-4 mr-1.5" />
                      {link.label}
                    </Button>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/">
              <Button
                variant="ghost"
                size="sm"
                className="hidden sm:flex text-sm text-background/60 hover:text-background hover:bg-background/10"
              >
                <LogOut className="h-4 w-4 mr-1.5" />
                Logout
              </Button>
            </Link>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 hover:bg-background/10 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <X className="h-5 w-5 text-background" />
              ) : (
                <Menu className="h-5 w-5 text-background" />
              )}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-foreground border-t border-background/10">
          <div className="px-6 py-4 space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`w-full justify-start text-sm font-medium ${
                      isActive(link.href)
                        ? "bg-background/15 text-background"
                        : "text-background/60 hover:text-background hover:bg-background/10"
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {link.label}
                  </Button>
                </Link>
              );
            })}
            <Link href="/" onClick={() => setMobileOpen(false)}>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-sm text-background/60 hover:text-background hover:bg-background/10 mt-2"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
