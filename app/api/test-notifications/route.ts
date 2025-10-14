import { NextRequest, NextResponse } from 'next/server';

// Test endpoint للتحقق من عمل النظام
export async function GET(request: NextRequest) {
  try {
    // بيانات تجريبية للاختبار
    const testNotifications = [
      {
        id: '1',
        title: 'إشعار تجريبي 1',
        message: 'هذا إشعار تجريبي لاختبار النظام',
        type: 'all',
        recipient: 'جميع المستخدمين',
        recipientId: null,
        sentAt: new Date().toISOString(),
        status: 'delivered',
        readCount: 15,
        createdBy: 'admin'
      },
      {
        id: '2',
        title: 'إشعار تجريبي 2',
        message: 'إشعار خاص لمستخدم محدد',
        type: 'specific',
        recipient: 'أحمد محمد',
        recipientId: 'user1',
        sentAt: new Date(Date.now() - 3600000).toISOString(),
        status: 'delivered',
        readCount: 1,
        createdBy: 'admin'
      },
      {
        id: '3',
        title: 'تحديث مهم',
        message: 'تم تحديث النظام بنجاح مع إضافة ميزات جديدة',
        type: 'all',
        recipient: 'جميع المستخدمين',
        recipientId: null,
        sentAt: new Date(Date.now() - 7200000).toISOString(),
        status: 'delivered',
        readCount: 42,
        createdBy: 'admin'
      }
    ];

    const stats = {
      total: testNotifications.length,
      delivered: testNotifications.filter(n => n.status === 'delivered').length,
      pending: 0,
      failed: 0
    };

    return NextResponse.json({
      success: true,
      data: testNotifications,
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalItems: testNotifications.length,
        itemsPerPage: 10
      },
      stats,
      message: 'بيانات تجريبية - النظام يعمل بشكل صحيح'
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'خطأ في الاختبار' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, message, type, recipientId, recipientName } = body;

    // محاكاة إرسال ناجح
    const mockNotification = {
      id: Date.now().toString(),
      title: title || 'إشعار',
      message: message,
      type: type,
      recipient: type === 'all' ? 'جميع المستخدمين' : recipientName || 'مستخدم محدد',
      recipientId: type === 'specific' ? recipientId : null,
      sentAt: new Date().toISOString(),
      status: 'delivered',
      readCount: 0,
      createdBy: 'admin'
    };

    return NextResponse.json({
      success: true,
      message: 'تم إرسال الإشعار بنجاح (وضع تجريبي)',
      data: mockNotification
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'خطأ في إرسال الإشعار التجريبي' },
      { status: 500 }
    );
  }
}
