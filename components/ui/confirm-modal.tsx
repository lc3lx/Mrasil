"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
  confirmText?: string
  cancelText?: string
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "حذف",
  cancelText = "إلغاء"
}: ConfirmModalProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="rounded-xl p-6 max-w-md mx-auto bg-white shadow-lg border border-gray-200">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center text-lg font-bold text-[#1a365d] mb-2">{title}</AlertDialogTitle>
          <AlertDialogDescription className="text-center text-base text-gray-700 mb-4">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex flex-row-reverse justify-center gap-4 mt-4">
          <AlertDialogCancel className="bg-gray-200 text-gray-800 rounded px-6 py-2 hover:bg-gray-300 transition-all font-semibold">
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 text-white rounded px-6 py-2 font-semibold transition-all"
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
} 