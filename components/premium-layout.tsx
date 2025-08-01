"use client"

import { useState } from "react"
import { PremiumHeader } from "@/components/premium-header"
import { PremiumSidebar } from "@/components/premium-sidebar"
import { PremiumContent } from "@/components/premium-content"
import { PremiumMobileNav } from "@/components/premium-mobile-nav"

export function PremiumLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <PremiumHeader onMenuClick={() => setSidebarOpen(true)} />
      <div className="flex flex-1">
        <PremiumSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 px-4 pb-24 pt-6 md:px-6 lg:px-8">
          <PremiumContent />
        </main>
      </div>
      <PremiumMobileNav />
    </div>
  )
}
