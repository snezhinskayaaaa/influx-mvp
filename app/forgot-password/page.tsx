"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NetworkLogo } from "@/components/logo";
import { motion } from "framer-motion";
import { Mail, ArrowRight, ArrowLeft, CheckCircle } from "lucide-react";

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

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
              Reset your password
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              {submitted
                ? "Check your email for a reset link"
                : "Enter your email and we'll send you a reset link"}
            </p>
          </div>

          <Card className="p-4 sm:p-6 bg-gradient-to-br from-primary/5 via-background/50 to-secondary/5 backdrop-blur-xl border-2 border-primary/20 shadow-2xl">
            {submitted ? (
              <div className="text-center py-4">
                <CheckCircle className="h-10 w-10 sm:h-12 sm:w-12 text-green-500 mx-auto mb-3 sm:mb-4" />
                <p className="text-sm sm:text-base text-foreground mb-1">
                  If an account with that email exists, we sent a reset link.
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Please check your inbox and spam folder.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="email" className="text-xs sm:text-sm font-medium">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-8 sm:pl-10 h-9 sm:h-10 border-2 focus:border-primary text-sm"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-9 sm:h-10 bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity text-sm"
                >
                  {loading ? "Sending..." : "Send reset link"}
                  <ArrowRight className="ml-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </Button>
              </form>
            )}
            {error && (
              <p className="text-sm text-red-500 text-center mt-3">{error}</p>
            )}
          </Card>

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
