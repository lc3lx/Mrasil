import { NextRequest, NextResponse } from 'next/server';
import { API_BASE_URL } from '@/lib/constants';

// PUT - تحديث حالة قراءة إشعار محدد (Proxy)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const notificationId = params.id;

    if (!notificationId) {
      return NextResponse.json(
        { status: 'error', message: 'معرف الإشعار مطلوب' },
        { status: 400 }
      );
    }

    const response = await fetch(`${API_BASE_URL}/notifications/${notificationId}/read`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': request.headers.get('authorization') || '',
        'Cookie': request.headers.get('cookie') || '',
      },
    });

    if (!response.ok) {
      const text = await response.text();
      return NextResponse.json({ status: 'error', message: `Backend error ${response.status}`, details: text }, { status: 500 });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating notification read status:', error);
    return NextResponse.json(
      { status: 'error', message: 'خطأ في تحديث حالة الإشعار' },
      { status: 500 }
    );
  }
}
