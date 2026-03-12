"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NetworkLogo } from "@/components/logo";
import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
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

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement login logic
    console.log("Login:", { email, password });

    // For demo, redirect to brand dashboard
    // In production, check user type from API
    router.push("/dashboard/brand");
  };

  const handleGoogleLogin = () => {
    // TODO: Implement Google OAuth
    console.log("Google login");

    // For demo, redirect to brand dashboard
    router.push("/dashboard/brand");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-6 sm:py-8">
      {/* Login Section */}
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
              Welcome back
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Log in to your account to continue
            </p>
          </div>

          <Card className="p-4 sm:p-6 bg-gradient-to-br from-primary/5 via-background/50 to-secondary/5 backdrop-blur-xl border-2 border-primary/20 shadow-2xl">
            {/* Google Sign In */}
            <Button
              type="button"
              variant="outline"
              className="w-full h-10 sm:h-11 mb-4 sm:mb-5 border-2 hover:border-primary/50 hover:bg-primary/5 transition-all text-sm"
              onClick={handleGoogleLogin}
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </Button>

            {/* Divider */}
            <div className="relative mb-4 sm:mb-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with email
                </span>
              </div>
            </div>

            {/* Email/Password Form */}
            <form onSubmit={handleLogin} className="space-y-3 sm:space-y-4">
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

              <div className="space-y-1.5 sm:space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-xs sm:text-sm font-medium">
                    Password
                  </Label>
                  <Link
                    href="/forgot-password"
                    className="text-xs text-primary hover:underline"
                  >
                    Forgot?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-8 sm:pl-10 pr-9 sm:pr-10 h-9 sm:h-10 border-2 focus:border-primary text-sm"
                    required
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

              <Button
                type="submit"
                className="w-full h-9 sm:h-10 bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity text-sm"
              >
                Log in
                <ArrowRight className="ml-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </Button>
            </form>
          </Card>

          {/* Sign up link */}
          <p className="text-center mt-4 sm:mt-5 text-xs sm:text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/signup" className="text-primary font-medium hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </motion.section>
    </div>
  );
}
