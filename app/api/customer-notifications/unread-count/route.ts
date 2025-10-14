import { NextRequest, NextResponse } from 'next/server';
import { API_BASE_URL } from '@/lib/constants';

// GET - جلب عدد الإشعارات غير المقروءة للعميل
export async function GET(request: NextRequest) {
  try {
    const response = await fetch(`${API_BASE_URL}/notifications/unread-count`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': request.headers.get('authorization') || '',
        'Cookie': request.headers.get('cookie') || '',
      },
    });

    if (!response.ok) {
      const text = await response.text();
      return NextResponse.json({ unreadCount: 0, message: `Backend error ${response.status}`, details: text }, { status: 500 });
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Error getting unread count:', error);
    return NextResponse.json({ unreadCount: 0, message: 'خطأ في جلب عدد الإشعارات' }, { status: 500 });
  }
}
