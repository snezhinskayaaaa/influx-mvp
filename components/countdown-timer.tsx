"use client";

import { useState, useEffect, useMemo } from "react";
import { Clock } from "lucide-react";

interface CountdownTimerProps {
  targetDate?: Date;
  className?: string;
}

export function CountdownTimer({
  targetDate,
  className = ""
}: CountdownTimerProps) {
  const target = useMemo(() => targetDate || new Date("2026-04-10T23:59:59"), [targetDate]);

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = target.getTime() - new Date().getTime();

      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        };
      } else {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [target]);

  return (
    <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-muted/50 backdrop-blur-sm border-2 border-border ${className}`}>
      <Clock className="h-5 w-5 text-primary" />
      <span className="text-sm font-medium text-muted-foreground">Launch offer ends in:</span>
      <div className="flex items-center gap-1">
        {timeLeft.days > 0 && (
          <>
            <span className="text-xl font-bold text-foreground tabular-nums">{timeLeft.days}</span>
            <span className="text-sm text-muted-foreground">d</span>
          </>
        )}
        <span className="text-xl font-bold text-foreground tabular-nums">{String(timeLeft.hours).padStart(2, '0')}</span>
        <span className="text-sm text-muted-foreground">:</span>
        <span className="text-xl font-bold text-foreground tabular-nums">{String(timeLeft.minutes).padStart(2, '0')}</span>
        <span className="text-sm text-muted-foreground">:</span>
        <span className="text-xl font-bold text-foreground tabular-nums">{String(timeLeft.seconds).padStart(2, '0')}</span>
      </div>
    </div>
  );
}
