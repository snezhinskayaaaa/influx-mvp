"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NetworkLogo } from "@/components/logo";
import { motion } from "framer-motion";
import {
  Lock,
  ArrowRight,
  ArrowLeft,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.4, 0.25, 1] as const,
    },
  },
};

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }
      setSuccess(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <Card className="p-4 sm:p-6 bg-gradient-to-br from-primary/5 via-background/50 to-secondary/5 backdrop-blur-xl border-2 border-primary/20 shadow-2xl">
        <div className="text-center py-4">
          <AlertCircle className="h-10 w-10 sm:h-12 sm:w-12 text-red-500 mx-auto mb-3 sm:mb-4" />
          <p className="text-sm sm:text-base text-foreground mb-1">
            Invalid or expired reset link
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Please request a new password reset.
          </p>
        </div>
      </Card>
    );
  }

  if (success) {
    return (
      <Card className="p-4 sm:p-6 bg-gradient-to-br from-primary/5 via-background/50 to-secondary/5 backdrop-blur-xl border-2 border-primary/20 shadow-2xl">
        <div className="text-center py-4">
          <CheckCircle className="h-10 w-10 sm:h-12 sm:w-12 text-green-500 mx-auto mb-3 sm:mb-4" />
          <p className="text-sm sm:text-base text-foreground mb-1">
            Password reset successfully!
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground">
            You can now log in with your new password.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 sm:p-6 bg-gradient-to-br from-primary/5 via-background/50 to-secondary/5 backdrop-blur-xl border-2 border-primary/20 shadow-2xl">
      <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
        <div className="space-y-1.5 sm:space-y-2">
          <Label htmlFor="newPassword" className="text-xs sm:text-sm font-medium">
            New Password
          </Label>
          <div className="relative">
            <Lock className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
            <Input
              id="newPassword"
              type={showPassword ? "text" : "password"}
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="pl-8 sm:pl-10 pr-9 sm:pr-10 h-9 sm:h-10 border-2 focus:border-primary text-sm"
              required
              minLength={8}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? (
                <EyeOff className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              ) : (
                <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              )}
            </button>
          </div>
        </div>

        <div className="space-y-1.5 sm:space-y-2">
          <Label htmlFor="confirmPassword" className="text-xs sm:text-sm font-medium">
            Confirm Password
          </Label>
          <div className="relative">
            <Lock className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="pl-8 sm:pl-10 pr-9 sm:pr-10 h-9 sm:h-10 border-2 focus:border-primary text-sm"
              required
              minLength={8}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showConfirmPassword ? (
                <EyeOff className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              ) : (
                <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              )}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full h-9 sm:h-10 bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity text-sm"
        >
          {loading ? "Resetting..." : "Reset password"}
          <ArrowRight className="ml-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </Button>
      </form>
      {error && (
        <p className="text-sm text-red-500 text-center mt-3">{error}</p>
      )}
    </Card>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-6 sm:py-8">
      <motion.section
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="w-full"
      >
        <div className="container max-w-md mx-auto">
          <div className="text-center mb-4 sm:mb-6">
            <Link href="/" className="inline-flex items-center gap-2 sm:gap-3 group mb-4 sm:mb-6">
              <NetworkLogo className="w-8 h-8 sm:w-10 sm:h-10 transition-transform group-hover:scale-110" />
              <div className="flex items-baseline gap-1">
                <span className="text-2xl sm:text-3xl font-bold text-primary">INFLUX</span>
                <span className="text-xs sm:text-sm font-medium text-foreground/60">connect</span>
              </div>
            </Link>
            <h1 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">
              Set new password
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Enter your new password below
            </p>
          </div>

          <Suspense fallback={
            <Card className="p-4 sm:p-6 bg-gradient-to-br from-primary/5 via-background/50 to-secondary/5 backdrop-blur-xl border-2 border-primary/20 shadow-2xl">
              <div className="text-center py-4 text-muted-foreground text-sm">Loading...</div>
            </Card>
          }>
            <ResetPasswordForm />
          </Suspense>

          <p className="text-center mt-4 sm:mt-5 text-xs sm:text-sm text-muted-foreground">
            <Link href="/login" className="text-primary font-medium hover:underline inline-flex items-center gap-1">
              <ArrowLeft className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              Back to login
            </Link>
          </p>
        </div>
      </motion.section>
    </div>
  );
}
