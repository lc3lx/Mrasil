import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  isVipCustomer?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, isVipCustomer, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-lg border-[0.5px] border-transparent bg-background/5 px-3 py-2 text-sm shadow-[inset_0_2px_4px_rgba(0,0,0,0.08)] hover:shadow-[inset_0_2px_5px_rgba(0,0,0,0.12)] transition-all duration-300 ease-in-out file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:border-input/20 focus-visible:bg-gradient-to-b focus-visible:from-background/10 focus-visible:to-background/5 focus-visible:shadow-[inset_0_2px_6px_rgba(0,0,0,0.15)] hover:border-input/20 disabled:cursor-not-allowed disabled:opacity-60 disabled:bg-muted/20 disabled:shadow-none",
        isVipCustomer && "border-amber-300/50 bg-amber-50/10",
        className,
      )}
      placeholder={isVipCustomer ? "يفضل التوصيل للبيت" : props.placeholder}
      ref={ref}
      {...props}
    />
  )
})
Input.displayName = "Input"

export { Input }
