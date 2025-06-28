"use client"

import { useEffect, useState } from "react"

export function V6LoadingScreen() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 5
      })
    }, 50)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white">
      <div className="relative flex h-12 w-12 items-center justify-center overflow-hidden v6-blob v6-blob-animated v6-gradient-primary shadow-lg mb-6">
        <span className="text-xl font-bold text-white">SE</span>
      </div>

      <h1 className="text-2xl font-bold v6-gradient-text mb-8">شيب إكسبرس</h1>

      <div className="w-64 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full v6-gradient-primary v6-shimmer" style={{ width: `${progress}%` }}></div>
      </div>

      <div className="mt-4 text-sm text-gray-500">جاري تحميل لوحة التحكم...</div>
    </div>
  )
}
