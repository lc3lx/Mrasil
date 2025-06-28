"use client"

import { useState, useEffect } from "react"
import { UltraHeader } from "@/components/ultra-header"
import { UltraSidebar } from "@/components/ultra-sidebar"
import { UltraContent } from "@/components/ultra-content"
import { UltraMobileNav } from "@/components/ultra-mobile-nav"
import { UltraFloatingButton } from "@/components/ultra-floating-button"

export function UltraLayout() {
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
      className={`flex min-h-screen flex-col bg-background transition-opacity duration-500 ${isLoaded ? "opacity-100" : "opacity-0"}`}
    >
      <UltraHeader onMenuClick={() => setSidebarOpen(true)} />
      <div className="flex flex-1">
        <UltraSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 px-4 pb-24 pt-6 md:px-6 lg:px-8">
          <UltraContent />
        </main>
      </div>
      <UltraMobileNav />
      <UltraFloatingButton />
    </div>
  )
}
