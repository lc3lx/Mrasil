"use client"

import V7Layout from "@/components/v7/v7-layout"
import { V7Content } from "@/components/v7/v7-content"
import { CreateOrderForm } from "./CreateOrderForm"

export default function CreateOrderPage() {
  return (
    <V7Layout>
      <V7Content title="إنشاء طلب جديد" description="قم بإنشاء طلب جديد وإدارة تفاصيله">
        <CreateOrderForm />
      </V7Content>
    </V7Layout>
  )
} 