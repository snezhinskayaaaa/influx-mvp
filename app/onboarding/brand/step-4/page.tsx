"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { OnboardingLayout } from "@/components/onboarding-layout";
import { Button } from "@/components/ui/button";
import { Check, User, Building2 } from "lucide-react";

const companySizes = ["1", "2-5", "6-19", "20+"];

export default function OnboardingStep4() {
  const router = useRouter();
  const [companyType, setCompanyType] = useState<"company" | "agency" | null>(null);
  const [companySize, setCompanySize] = useState<string | null>(null);

  const handleNext = () => {
    if (companyType && companySize) {
      localStorage.setItem("brand_onboarding_company_type", companyType);
      localStorage.setItem("brand_onboarding_company_size", companySize);
      router.push("/onboarding/brand/step-5");
    }
  };

  const handleBack = () => {
    router.push("/onboarding/brand/step-3");
  };

  const isValid = companyType && companySize;

  return (
    <OnboardingLayout
      currentStep={5}
      totalSteps={8}
      title="Company details"
      subtitle="We want to tailor the experience according to your company size and plans to use Influx."
      onBack={handleBack}
    >
      <div className="space-y-6 sm:space-y-8 mb-8">
        {/* Company Type */}
        <div>
          <h3 className="text-sm sm:text-base font-medium mb-4">I am working as</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => setCompanyType("company")}
              className={`relative p-5 sm:p-6 rounded-xl border-2 text-left transition-all ${
                companyType === "company"
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                  companyType === "company" ? "bg-primary/10" : "bg-muted"
                }`}>
                  <User className={`h-6 w-6 ${companyType === "company" ? "text-primary" : "text-muted-foreground"}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold">Company</h4>
                    {companyType === "company" && (
                      <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                        <Check className="h-3 w-3 text-primary-foreground" />
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Only for yourself
                  </p>
                </div>
              </div>
            </button>

            <button
              onClick={() => setCompanyType("agency")}
              className={`relative p-5 sm:p-6 rounded-xl border-2 text-left transition-all ${
                companyType === "agency"
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                  companyType === "agency" ? "bg-primary/10" : "bg-muted"
                }`}>
                  <Building2 className={`h-6 w-6 ${companyType === "agency" ? "text-primary" : "text-muted-foreground"}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold">Agency</h4>
                    {companyType === "agency" && (
                      <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                        <Check className="h-3 w-3 text-primary-foreground" />
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    You work with multiple brands
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Company Size */}
        <div>
          <h3 className="text-sm sm:text-base font-medium mb-4">
            {companyType === "agency"
              ? "How many brands do you work with?"
              : "What is your company size? (people)"}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {companySizes.map((size) => (
              <button
                key={size}
                onClick={() => setCompanySize(size)}
                className={`relative p-4 rounded-xl border-2 transition-all ${
                  companySize === size
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50 hover:bg-muted/50"
                }`}
              >
                <div className="flex flex-col items-center justify-center gap-1.5">
                  <span className={`text-base sm:text-lg font-semibold ${
                    companySize === size ? "text-primary" : "text-foreground"
                  }`}>
                    {size}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {companyType === "agency" ? "brands" : "people"}
                  </span>
                  {companySize === size && (
                    <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                      <Check className="h-2.5 w-2.5 text-primary-foreground" />
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <Button
        onClick={handleNext}
        disabled={!isValid}
        className="w-full h-12 sm:h-14 bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-base sm:text-lg"
      >
        Next
      </Button>
    </OnboardingLayout>
  );
}
