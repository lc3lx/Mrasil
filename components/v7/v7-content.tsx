import type React from "react"

interface V7ContentProps {
  children: React.ReactNode
  title?: string
  description?: string
  theme?: "light" | "dark"
}

export function V7Content({ children, title, description, theme = "light" }: V7ContentProps) {
  const isDark = theme === "dark"

  return <div className={`space-y-4 md:space-y-6 v7-fade-in ${isDark ? "text-[#e2e8f0]" : ""}`}>{children}</div>
}
