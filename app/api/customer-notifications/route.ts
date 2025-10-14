import { NextRequest, NextResponse } from 'next/server';
import { API_BASE_URL } from '@/lib/constants';

// GET - جلب إشعارات العميل (Proxy)
export async function GET(request: NextRequest) {
  try {
    const response = await fetch(`${API_BASE_URL}/notifications/getMynotification`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': request.headers.get('authorization') || '',
        'Cookie': request.headers.get('cookie') || '',
      },
      // تمرير الكعكات تلقائياً غير مدعوم هنا، نرسلها عبر الرأس
    });

    if (!response.ok) {
      const text = await response.text();
      return NextResponse.json({ status: 'error', message: `Backend error ${response.status}`, details: text, data: [] }, { status: 500 });
    }

    const backendData = await response.json();
    const dataArray = Array.isArray(backendData) ? backendData : backendData.data || [];

    return NextResponse.json({ status: 'success', data: dataArray });
  } catch (error) {
    console.error('Error in customer notifications API:', error);
    return NextResponse.json({ status: 'error', message: 'خطأ في جلب الإشعارات', data: [] }, { status: 500 });
  }
}
