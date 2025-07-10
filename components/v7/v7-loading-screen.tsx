"use client"

import { useEffect, useState } from "react"

export function V7LoadingScreen({ title = "جاري تحميل لوحة التحكم..." }: { title?: string }) {
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
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#f0f4f8]">
      <div className="relative mb-6">
        <div className="v7-loading-logo">SE</div>
      </div>

      <h1 className="text-2xl font-bold text-[#3498db] mb-8">شيب إكسبرس</h1>

      <div className="w-64 h-3 v7-neu-inset rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#3498db] to-[#2980b9] v7-loading-bar"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <div className="mt-4 text-sm text-[#6d6a67]">{title}</div>
    </div>
  )
}
