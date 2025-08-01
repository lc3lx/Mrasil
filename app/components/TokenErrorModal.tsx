'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface TokenErrorModalProps {
  message: string
  isOpen: boolean
}

export default function TokenErrorModal({ message, isOpen }: TokenErrorModalProps) {
  const router = useRouter()
  const [show, setShow] = useState(isOpen)

  useEffect(() => {
    setShow(isOpen)
  }, [isOpen])

  useEffect(() => {
    if (isOpen) {
      // Close modal after 5 seconds
      const closeTimer = setTimeout(() => {
        setShow(false)
      }, 5000)

      // Redirect after 6 seconds (1 second after closing)
      const redirectTimer = setTimeout(() => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        router.push('/login')
      }, 6000)

      return () => {
        clearTimeout(closeTimer)
        clearTimeout(redirectTimer)
      }
    }
  }, [isOpen, router])

  if (!show) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 text-center">
        <h2 className="text-xl font-semibold mb-4">تأكيد الخطأ</h2>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex justify-center">
          <div className="text-sm text-gray-500">
            سيتم توجيهك إلى صفحة تسجيل الدخول تلقائياً...
          </div>
        </div>
      </div>
    </div>
  )
} 