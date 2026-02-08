"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Check, X, AlertCircle } from "lucide-react"

interface ResponseModalProps {
  isOpen: boolean
  onClose: () => void
  status: 'success' | 'fail'
  message: string
  /** عنوان مخصص (مثلاً: "خطأ في تسجيل الدخول") */
  title?: string
}

export default function ResponseModal({
  isOpen,
  onClose,
  status,
  message,
  title,
}: ResponseModalProps) {
  const defaultTitle = status === 'success' ? 'نجاح العملية' : 'حدث خطأ'
  const displayTitle = title ?? defaultTitle

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[440px]">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold text-muted-foreground-700 dark:text-muted-foreground-200 flex items-center justify-center gap-2">
            {status === 'fail' && <AlertCircle className="h-6 w-6 text-red-500 shrink-0" />}
            {displayTitle}
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center p-4">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
            status === 'success'
              ? 'bg-green-100 dark:bg-green-900/20'
              : 'bg-red-100 dark:bg-red-900/20'
          }`}>
            {status === 'success' ? (
              <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
            ) : (
              <X className="h-8 w-8 text-red-600 dark:text-red-400" />
            )}
          </div>
          <p className="text-center text-muted-foreground-700 dark:text-muted-foreground-300 text-base leading-relaxed break-words max-h-[200px] overflow-y-auto">
            {message}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
} 