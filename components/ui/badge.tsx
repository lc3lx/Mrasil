import type React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        local: "border-transparent bg-green-100 text-green-800", // إضافة نوع جديد للبادج المحلي
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {
  isLocal?: boolean
}

function Badge({ className, variant, isLocal, ...props }: BadgeProps) {
  // إذا كان isLocal صحيحًا، استخدم variant="local" تلقائيًا
  const finalVariant = isLocal ? "local" : variant

  // استخدام React.createElement بدلاً من JSX
  return (
    <span className={cn(badgeVariants({ variant: finalVariant }), className, "relative")} {...props}>
      {props.children}
      {isLocal && (
        <span
          className="absolute -right-1 -top-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse"
          aria-label="مؤشر محلي"
        />
      )}
    </span>
  )
}

export { Badge, badgeVariants }
