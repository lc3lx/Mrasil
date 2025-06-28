import type React from "react"
import { Badge } from "./badge"
import { cn } from "@/lib/utils"

export interface LocalBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline"
  indicatorPosition?: "right" | "left"
}

export function LocalBadge({ className, variant = "default", indicatorPosition = "right", ...props }: LocalBadgeProps) {
  return (
    <div className="relative inline-flex">
      <Badge className={cn("pr-6", className)} variant={variant} {...props} />
      <div
        className={cn("absolute top-0 h-full flex items-center", indicatorPosition === "right" ? "right-2" : "left-2")}
      >
        <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
      </div>
    </div>
  )
}
