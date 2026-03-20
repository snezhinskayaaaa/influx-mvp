"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { NetworkLogo } from "@/components/logo";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Loader2, ArrowRight } from "lucide-react";

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

type VerifyStatus = "loading" | "success" | "error";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<VerifyStatus>("loading");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setErrorMessage("No verification token provided.");
      return;
    }

    const verifyEmail = async () => {
      try {
        const res = await fetch("/api/auth/verify-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });
        const data = await res.json();

        if (!res.ok) {
          setStatus("error");
          setErrorMessage(data.error || "Verification failed.");
          return;
        }

        setStatus("success");
      } catch {
        setStatus("error");
        setErrorMessage("Something went wrong. Please try again.");
      }
    };

    verifyEmail();
  }, [token]);

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
            <Link
              href="/"
              className="inline-flex items-center gap-2 sm:gap-3 group mb-4 sm:mb-6"
            >
              <NetworkLogo className="w-8 h-8 sm:w-10 sm:h-10 transition-transform group-hover:scale-110" />
              <div className="flex items-baseline gap-1">
                <span className="text-2xl sm:text-3xl font-bold text-primary">
                  INFLUX
                </span>
                <span className="text-xs sm:text-sm font-medium text-foreground/60">
                  connect
                </span>
              </div>
            </Link>
          </div>

          <Card className="p-4 sm:p-6 bg-gradient-to-br from-primary/5 via-background/50 to-secondary/5 backdrop-blur-xl border-2 border-primary/20 shadow-2xl">
            <div className="flex flex-col items-center text-center py-4 sm:py-6">
              {status === "loading" && (
                <>
                  <Loader2 className="h-12 w-12 sm:h-16 sm:w-16 text-primary animate-spin mb-4" />
                  <h1 className="text-xl sm:text-2xl font-bold mb-2">
                    Verifying your email...
                  </h1>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    Please wait while we verify your email address.
                  </p>
                </>
              )}

              {status === "success" && (
                <>
                  <CheckCircle2 className="h-12 w-12 sm:h-16 sm:w-16 text-green-500 mb-4" />
                  <h1 className="text-xl sm:text-2xl font-bold mb-2">
                    Email verified!
                  </h1>
                  <p className="text-sm sm:text-base text-muted-foreground mb-6">
                    Your email has been successfully verified. You can now log in
                    to your account.
                  </p>
                  <Link href="/login" className="w-full">
                    <Button className="w-full h-9 sm:h-10 bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity text-sm">
                      Go to Login
                      <ArrowRight className="ml-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </Button>
                  </Link>
                </>
              )}

              {status === "error" && (
                <>
                  <XCircle className="h-12 w-12 sm:h-16 sm:w-16 text-red-500 mb-4" />
                  <h1 className="text-xl sm:text-2xl font-bold mb-2">
                    Verification failed
                  </h1>
                  <p className="text-sm sm:text-base text-muted-foreground mb-6">
                    {errorMessage || "Invalid or expired verification link."}
                  </p>
                  <Link href="/login" className="w-full">
                    <Button className="w-full h-9 sm:h-10 bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity text-sm">
                      Go to Login
                      <ArrowRight className="ml-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </Card>
        </div>
      </motion.section>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
