import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    // استخراج البيانات من الطلب
    const data = await request.json()

    // محاكاة معالجة البيانات
    await new Promise((resolve) => setTimeout(resolve, 500))

    // إنشاء استجابة نموذجية
    const response = {
      status: "success",
      message: "Test webhook processed successfully",
      received_data: data,
      processed_at: new Date().toISOString(),
      webhook_id: "test-webhook",
    }

    // إرجاع الاستجابة
    return NextResponse.json(response)
  } catch (error) {
    console.error("Error processing test webhook:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
