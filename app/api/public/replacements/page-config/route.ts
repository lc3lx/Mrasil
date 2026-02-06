import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/constants";

/** يشبه slug: لا يحتوي على نقطة (JWT) وطوله معقول للرابط الفريد */
function isSlugLike(value: string): boolean {
  const t = value.replace(/^Bearer\s+/i, "").trim();
  return t.length >= 8 && t.length <= 64 && !t.includes(".");
}

/**
 * API عامة لجلب تخصيص صفحة الاستبدال للتاجر.
 * - إذا token يشبه الرابط الفريد (slug): استدعاء الباكند GET /customer/replacement-page/:slug (بدون تسجيل دخول).
 * - وإلا: اعتباره JWT واستدعاء getMe (للتوافق مع المعاينة).
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");
    if (!token?.trim()) {
      return NextResponse.json(
        { success: false, message: "رابط التاجر مطلوب (token)" },
        { status: 400 }
      );
    }
    const cleanToken = token.replace(/^Bearer\s+/i, "").trim();

    if (isSlugLike(cleanToken)) {
      const res = await fetch(`${API_BASE_URL}/customer/replacement-page/${encodeURIComponent(cleanToken)}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        return NextResponse.json(
          { success: false, message: data?.message || "صفحة الاستبدال غير موجودة" },
          { status: res.status }
        );
      }
      const settings = data?.data ?? null;
      return NextResponse.json({ success: true, data: settings });
    }

    const res = await fetch(`${API_BASE_URL}/customer/getMe`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${cleanToken}`,
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
    const settings = data?.data?.replacementPageSettings ?? null;
    return NextResponse.json({ success: true, data: settings });
  } catch (e) {
    console.error("[public/replacements/page-config]", e);
    return NextResponse.json(
      { success: false, message: "خطأ في الخادم" },
      { status: 500 }
    );
  }
}
