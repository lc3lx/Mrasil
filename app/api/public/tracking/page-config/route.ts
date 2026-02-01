import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/constants";

/**
 * API عامة لجلب تخصيص صفحة التتبع للتاجر (حسب token).
 * تُستخدم من صفحة التتبع العامة لطباعة تصميم التاجر.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");
    if (!token) {
      return NextResponse.json(
        { success: false, message: "رمز التاجر مطلوب (token)" },
        { status: 400 }
      );
    }
    const res = await fetch(`${API_BASE_URL}/customer/getMe`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token.replace(/^Bearer\s+/i, "")}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return NextResponse.json(
        { success: false, message: data?.message || "فشل في جلب الإعدادات" },
        { status: res.status }
      );
    }
    const settings = data?.data?.trackingSettings ?? null;
    return NextResponse.json({ success: true, data: settings });
  } catch (e) {
    console.error("[public/tracking/page-config]", e);
    return NextResponse.json(
      { success: false, message: "خطأ في الخادم" },
      { status: 500 }
    );
  }
}
