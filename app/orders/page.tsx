"use client"

import dynamic from 'next/dynamic'
import { Suspense, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import V7Layout from "@/components/v7/v7-layout"
import { V7Content } from "@/components/v7/v7-content"
import { useGetAllOrdersQuery } from '../api/ordersApi'

// Create a loading component
function OrdersLoading() {
  return (
    <V7Layout>
      <V7Content title="الطلبات" description="إدارة ومتابعة جميع طلباتك">
        <div className="w-full h-96 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            <p className="mt-4 text-gray-600">جاري تحميل الطلبات...</p>
          </div>
        </div>
      </V7Content>
    </V7Layout>
  )
}

// Main page component
export default function OrdersPage() {
  const router = useRouter()
  const { error, isError } = useGetAllOrdersQuery()

  useEffect(() => {
    if (isError && error && 'data' in error) {
      const errorData = error.data as any
      if (
        errorData?.message?.includes('Invalid token') ||
        errorData?.status === 'fail' ||
        errorData?.message?.includes('recently changed')
      ) {
        // Dispatch the token error event
        window.dispatchEvent(
          new CustomEvent('token-error', {
            detail: { message: errorData.message || 'Invalid token, please login again..' }
          })
        )
      }
    }
  }, [isError, error])

  // Dynamically import the OrdersContent component with no SSR
  const OrdersContent = dynamic(() => import('./OrdersContent'), {
    ssr: false,
    loading: () => <OrdersLoading />
  })

  return (
    <Suspense fallback={<OrdersLoading />}>
      <OrdersContent />
    </Suspense>
  )
}
