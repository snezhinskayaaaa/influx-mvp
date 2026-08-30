"use client";

import { useState, useEffect } from "react";
import { NetworkLogo } from "@/components/logo";

export function LoadingScreen() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          clearInterval(timer);
          return 95;
        }
        // Fast at start, slower near end
        const increment = prev < 30 ? 8 : prev < 60 ? 5 : prev < 80 ? 3 : 1;
        return Math.min(prev + increment, 95);
      });
    }, 100);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-[200] bg-background flex flex-col items-center justify-center">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-8">
        <NetworkLogo className="w-10 h-10" />
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            INFLUX
          </span>
          <span className="text-sm text-muted-foreground font-light">connect</span>
        </div>
      </div>

      {/* Progress */}
      <div className="w-64 flex flex-col items-center gap-3">
        <span className="text-sm text-muted-foreground tabular-nums">{progress}%</span>
        <div className="w-full h-[1px] bg-border relative overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-200 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
