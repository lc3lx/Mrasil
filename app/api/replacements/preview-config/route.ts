import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/constants";

/**
 * جلب تخصيص صفحة الاستبدال للمستخدم المسجّل (للمعاينة).
 * يُستخدم عندما يفتح التاجر "معاينة الصفحة" بدون token في الرابط.
 */
export async function GET(request: NextRequest) {
  try {
    const auth = request.headers.get("authorization") || "";
    const cleanToken = auth.replace(/^Bearer\s+/i, "").trim();
    if (!cleanToken) {
      return NextResponse.json(
        { success: false, message: "يجب تسجيل الدخول للمعاينة" },
        { status: 401 }
      );
    }
    const res = await fetch(`${API_BASE_URL}/customer/getMe`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cleanToken}`,
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
    const settings = data?.data?.replacementPageSettings ?? null;
    return NextResponse.json({ success: true, data: settings });
  } catch (e) {
    console.error("[replacements/preview-config]", e);
    return NextResponse.json(
      { success: false, message: "خطأ في الخادم" },
      { status: 500 }
    );
  }
}
