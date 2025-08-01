"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// هذا المكون يُستخدم لإنشاء تسميات الحقول في جميع أنحاء التطبيق
// لتغيير نص تسمية حقل معين، يجب تعديل الملف الذي يستخدم هذا المكون
// مثال: <Label htmlFor="jobTitle">المسمى الوظيفي</Label>
const labelVariants = cva("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70")

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement>, VariantProps<typeof labelVariants> {
  required?: boolean
}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(({ className, required, ...props }, ref) => {
  // تحقق مما إذا كان النص هو "اسم الشركة" وتغييره إلى "اسم الشركة باللغة العربية"
  let children = props.children
  if (typeof children === "string" && children === "اسم الشركة") {
    children = "اسم الشركة باللغة العربية"
  } else if (React.isValidElement(children) && React.Children.count(children) === 1) {
    const child = React.Children.only(children)
    if (typeof child.props.children === "string" && child.props.children === "اسم الشركة") {
      children = React.cloneElement(child, {
        children: "اسم الشركة باللغة العربية",
      })
    }
  }

  return (
    <label ref={ref} className={cn(labelVariants(), className)} {...props}>
      {children}
      {required && <span className="text-red-500 mr-1">*</span>}
    </label>
  )
})

Label.displayName = "Label"

export { Label }
