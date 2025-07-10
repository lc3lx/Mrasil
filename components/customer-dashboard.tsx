"use client"

import { useState } from "react"
import { CustomerHeader } from "@/components/customer-header"
import { CustomerSidebar } from "@/components/customer-sidebar"
import { CustomerContent } from "@/components/customer-content"
import { CustomerMobileNav } from "@/components/customer-mobile-nav"

export function CustomerDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen flex-col">
      <CustomerHeader onMenuClick={() => setSidebarOpen(true)} />
      <div className="flex flex-1">
        <CustomerSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 bg-background px-4 pb-20 pt-6 md:px-6 lg:px-8">
          <CustomerContent />
        </main>
      </div>
      <CustomerMobileNav />
    </div>
  )
}
