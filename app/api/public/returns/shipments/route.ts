import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/constants";

/**
 * API عامة (بدون تسجيل دخول) لجلب شحنات العميل برقم الهاتف.
 * يستخدمها الزبون من صفحة الاسترجاع/الاستبدال الخارجية.
 * token = رمز التاجر (يُمرّر في الرابط من لوحة التحكم).
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");
    const phone = searchParams.get("phone");
    const email = searchParams.get("email");
    const awb = searchParams.get("awb") || searchParams.get("tracking");

    if (!token) {
      return NextResponse.json(
        { success: false, message: "رمز التاجر مطلوب (token)" },
        { status: 400 }
      );
    }

    const identifier = awb || phone || email;
    if (!identifier?.trim()) {
      return NextResponse.json(
        { success: false, message: "رقم البوليصة أو رقم التتبع أو رقم الهاتف أو البريد الإلكتروني مطلوب" },
        { status: 400 }
      );
    }

    const params = new URLSearchParams();
    if (awb?.trim()) params.set("awb", awb.trim());
    if (phone?.trim()) params.set("phone", phone.trim());
    if (email?.trim()) params.set("email", email.trim());
    const url = `${API_BASE_URL}/shipment/return/shipments?${params.toString()}`;
    const res = await fetch(url, {
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
        { success: false, message: data?.message || "فشل في جلب الشحنات" },
        { status: res.status }
      );
    }

    return NextResponse.json(data);
  } catch (e) {
    console.error("[public/returns/shipments]", e);
    return NextResponse.json(
      { success: false, message: "خطأ في الخادم" },
      { status: 500 }
    );
  }
}
