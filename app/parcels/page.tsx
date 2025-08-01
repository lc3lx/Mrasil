"use client"

import { Suspense } from "react"
import V7Layout from "@/components/v7/v7-layout"
import dynamic from "next/dynamic"
import ClientOnly from "@/components/client-only"

// Simple loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-[200px]">
    <div className="w-8 h-8 border-4 border-[#3498db] border-t-transparent rounded-full animate-spin"></div>
  </div>
)

// Dynamically import the ParcelsContent component with no SSR
const ParcelsContent = dynamic(() => import("./components/ParcelsContent"), {
  ssr: false,
  loading: () => <LoadingSpinner />,
})

export default function ParcelSizesPage() {
  return (
    <ClientOnly>
      <V7Layout>
        <ParcelsContent />
      </V7Layout>
    </ClientOnly>
  )
}

