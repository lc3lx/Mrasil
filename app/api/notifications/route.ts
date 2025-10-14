import { NextRequest, NextResponse } from 'next/server';
import { API_BASE_URL } from '@/lib/constants';

// GET - جلب جميع الإشعارات من الباك إند
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const type = searchParams.get('type') || '';
    const cookieHeader = request.headers.get('cookie') || '';
    const tokenMatch = cookieHeader.match(/(?:^|;)\s*token=([^;]+)/);
    const authHeader = request.headers.get('authorization') || (tokenMatch ? `Bearer ${decodeURIComponent(tokenMatch[1])}` : '');
    const response = await fetch(`${API_BASE_URL}/notifications/admin/all`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
        'Cookie': cookieHeader,
      },
    });

    if (!response.ok) {
      const text = await response.text();
      return NextResponse.json({ success: false, message: `Backend error ${response.status}`, details: text }, { status: 500 });
    }

    const backendData = await response.json();
    let notifications = backendData.data || backendData || [];

    // تحويل البيانات لتتماشى مع الفرونت إند
    notifications = notifications.map((notification: any) => ({
      id: notification._id,
      title: notification.title || 'إشعار',
      message: notification.message,
      type: notification.customerId ? 'specific' : 'all',
      recipient: notification.customerId ? 
        (notification.customerId.firstName ? `${notification.customerId.firstName} ${notification.customerId.lastName || ''}`.trim() : 'مستخدم محدد') 
        : 'جميع المستخدمين',
      recipientId: notification.customerId?._id || notification.customerId,
      sentAt: notification.timestamp,
      status: 'delivered',
      readCount: notification.readStatus ? 1 : 0,
      createdBy: 'admin'
    }));

    // فلترة حسب البحث
    if (search) {
      notifications = notifications.filter((notification: any) =>
        notification.title.toLowerCase().includes(search.toLowerCase()) ||
        notification.message.toLowerCase().includes(search.toLowerCase())
      );
    }

    // فلترة حسب النوع
    if (type) {
      notifications = notifications.filter((notification: any) => notification.type === type);
    }

    // ترتيب حسب التاريخ (الأحدث أولاً)
    notifications.sort((a: any, b: any) => 
      new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime()
    );

    // تطبيق الصفحات
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedNotifications = notifications.slice(startIndex, endIndex);

    // حساب الإحصائيات
    const stats = {
      total: notifications.length,
      delivered: notifications.filter((n: any) => n.status === 'delivered').length,
      pending: notifications.filter((n: any) => n.status === 'pending').length,
      failed: notifications.filter((n: any) => n.status === 'failed').length
    };

    return NextResponse.json({
      success: true,
      data: paginatedNotifications,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(notifications.length / limit),
        totalItems: notifications.length,
        itemsPerPage: limit
      },
      stats
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      { success: false, message: 'خطأ في جلب الإشعارات' },
      { status: 500 }
    );
  }
}

// POST - إرسال إشعار جديد إلى الباك إند
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, message, type, recipientId, recipientName } = body;

    // التحقق من البيانات المطلوبة
    if (!message || !type) {
      return NextResponse.json(
        { success: false, message: 'البيانات المطلوبة غير مكتملة' },
        { status: 400 }
      );
    }

    // التحقق من المستخدم المحدد إذا كان النوع specific
    if (type === 'specific' && !recipientId) {
      return NextResponse.json(
        { success: false, message: 'يجب تحديد المستخدم المراد إرسال الإشعار إليه' },
        { status: 400 }
      );
    }

    // تحضير البيانات للباك إند
    const notificationData = {
      title: title || 'إشعار',
      message: message,
      type: type === 'all' ? 'broadcast' : 'targeted',
      customerId: type === 'specific' ? recipientId : null
    };
    // إعداد التوثيق من الهيدر أو الكوكي
    const cookieHeader = request.headers.get('cookie') || '';
    const tokenMatch = cookieHeader.match(/(?:^|;)\s*token=([^;]+)/);
    const authHeader = request.headers.get('authorization') || (tokenMatch ? `Bearer ${decodeURIComponent(tokenMatch[1])}` : '');

    const response = await fetch(`${API_BASE_URL}/notifications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
        'Cookie': cookieHeader,
      },
      body: JSON.stringify(notificationData),
    });

    if (!response.ok) {
      const text = await response.text();
      return NextResponse.json({ success: false, message: `Backend error ${response.status}`, details: text }, { status: 500 });
    }

    const backendNotification = await response.json();

    // تحويل البيانات للفرونت إند
    const formattedNotification = {
      id: backendNotification._id,
      title: backendNotification.title || title || 'إشعار',
      message: backendNotification.message,
      type: backendNotification.customerId ? 'specific' : 'all',
      recipient: backendNotification.customerId ? recipientName || 'مستخدم محدد' : 'جميع المستخدمين',
      recipientId: backendNotification.customerId,
      sentAt: backendNotification.timestamp,
      status: 'delivered',
      readCount: 0,
      createdBy: 'admin'
    };

    return NextResponse.json({
      success: true,
      message: 'تم إرسال الإشعار بنجاح',
      data: formattedNotification
    });
  } catch (error) {
    console.error('Error sending notification:', error);
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : 'خطأ في إرسال الإشعار' },
      { status: 500 }
    );
  }
}

// DELETE - حذف إشعار من الباك إند
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'معرف الإشعار مطلوب' },
        { status: 400 }
      );
    }
    // إعداد التوثيق من الهيدر أو الكوكي
    const cookieHeader = request.headers.get('cookie') || '';
    const tokenMatch = cookieHeader.match(/(?:^|;)\s*token=([^;]+)/);
    const authHeader = request.headers.get('authorization') || (tokenMatch ? `Bearer ${decodeURIComponent(tokenMatch[1])}` : '');

    const response = await fetch(`${API_BASE_URL}/notifications/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
        'Cookie': cookieHeader,
      },
    });

    if (!response.ok) {
      const text = await response.text();
      return NextResponse.json({ success: false, message: `Backend error ${response.status}`, details: text }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'تم حذف الإشعار بنجاح' });
  } catch (error) {
    console.error('Error deleting notification:', error);
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : 'خطأ في حذف الإشعار' },
      { status: 500 }
    );
  }
}
