"use client"

import { useState, useEffect } from "react"
import { ModernHeader } from "@/components/modern-header"
import { ModernSidebar } from "@/components/modern-sidebar"
import { ModernContent } from "@/components/modern-content"
import { ModernMobileNav } from "@/components/modern-mobile-nav"
import { ModernFloatingMenu } from "@/components/modern-floating-menu"

export function ModernLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Simulate loading for smooth animations
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 300)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div
      className={`flex min-h-screen flex-col bg-background transition-opacity duration-700 ${isLoaded ? "opacity-100" : "opacity-0"}`}
    >
      <ModernHeader onMenuClick={() => setSidebarOpen(true)} />
      <div className="flex flex-1">
        <ModernSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 px-4 pb-24 pt-6 md:px-6 lg:px-8">
          <ModernContent />
        </main>
      </div>
      <ModernMobileNav />
      <ModernFloatingMenu />
    </div>
  )
}
