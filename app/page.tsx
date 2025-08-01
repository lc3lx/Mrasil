"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import V7Layout from "@/components/v7/v7-layout"
import { V7Content } from "@/components/v7/v7-content"
import { HomeContent } from "@/components/v7/pages/home-content"
import { useAuth } from "./providers/AuthProvider"

export default function Home() {
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Wait a bit for the auth state to be properly initialized
    const timer = setTimeout(() => {
      setIsLoading(false)
      
      // If user is not authenticated, redirect to invoices page
      if (!isAuthenticated) {
        router.push('/invoices')
      }
    }, 500) // Give auth provider time to initialize

    return () => clearTimeout(timer)
  }, [isAuthenticated, router])

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Show dashboard only if authenticated
  if (isAuthenticated) {
    return (
      <V7Layout>
        <V7Content>
          <HomeContent />
        </V7Content>
      </V7Layout>
    )
  }

  // This should not render if redirecting, but just in case
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
    </div>
  )
}
