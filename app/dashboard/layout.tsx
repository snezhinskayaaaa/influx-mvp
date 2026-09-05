"use client"

import { useEffect } from "react"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Replace history so browser back button goes to landing, not Google OAuth
    window.history.replaceState(null, "", window.location.href)
    window.history.pushState(null, "", window.location.href)

    const handlePopState = () => {
      window.location.href = "/"
    }

    window.addEventListener("popstate", handlePopState)
    return () => window.removeEventListener("popstate", handlePopState)
  }, [])

  return <>{children}</>
}
