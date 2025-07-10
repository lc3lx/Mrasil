"use client"

import { useState, useEffect } from "react"
import { V6Header } from "@/components/v6/v6-header"
import { V6Sidebar } from "@/components/v6/v6-sidebar"
import { V6Content } from "@/components/v6/v6-content"
import { V6MobileNav } from "@/components/v6/v6-mobile-nav"
import { V6FloatingMenu } from "@/components/v6/v6-floating-menu"
import { V6LoadingScreen } from "@/components/v6/v6-loading-screen"

export function V6Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [showLoading, setShowLoading] = useState(true)

  useEffect(() => {
    // Simulate loading for smooth animations
    const timer = setTimeout(() => {
      setShowLoading(false)
      setTimeout(() => {
        setIsLoaded(true)
      }, 300)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      {showLoading && <V6LoadingScreen />}

      <div
        className={`flex min-h-screen flex-col bg-background transition-opacity duration-700 ${isLoaded ? "opacity-100" : "opacity-0"}`}
      >
        <V6Header onMenuClick={() => setSidebarOpen(true)} />
        <div className="flex flex-1">
          <V6Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          <main className="flex-1 px-4 pb-24 pt-6 md:px-6 lg:px-8">
            <V6Content />
          </main>
        </div>
        <V6MobileNav />
        <V6FloatingMenu />
      </div>
    </>
  )
}
