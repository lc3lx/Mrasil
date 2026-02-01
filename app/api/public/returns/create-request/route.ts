import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/constants";

/**
 * API عامة (بدون تسجيل دخول) لإنشاء طلب استرجاع أو استبدال.
 * يستخدمها الزبون من صفحة الاسترجاع/الاستبدال الخارجية.
 * token = رمز التاجر (يُمرّر في الرابط من لوحة التحكم).
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, shipmentId, type, requestNote } = body as {
      token?: string;
      shipmentId?: string;
      type?: string;
      requestNote?: string;
    };

    if (!token) {
      return NextResponse.json(
        { success: false, message: "رمز التاجر مطلوب (token)" },
        { status: 400 }
      );
    }

    if (!shipmentId) {
      return NextResponse.json(
        { success: false, message: "معرف الشحنة مطلوب" },
        { status: 400 }
      );
    }

    const typerequesst = type === "exchange" ? "exchange" : "return";
    const res = await fetch(`${API_BASE_URL}/shipment/return/create-request`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token.replace(/^Bearer\s+/i, "")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        shipmentId,
        typerequesst,
        requestNote: requestNote || "",
      }),
      cache: "no-store",
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return NextResponse.json(
        { success: false, message: data?.message || "فشل في إنشاء الطلب" },
        { status: res.status }
      );
    }

    return NextResponse.json(data);
  } catch (e) {
    console.error("[public/returns/create-request]", e);
    return NextResponse.json(
      { success: false, message: "خطأ في الخادم" },
      { status: 500 }
    );
  }
}
