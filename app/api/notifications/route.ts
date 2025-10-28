import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = 'https://mararsil.com ';

// GET - جلب جميع الإشعارات من الباك إند
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const type = searchParams.get('type') || '';

    // محاولة استدعاء الباك إند لجلب الإشعارات
    let response;
    try {
      response = await fetch(`${BACKEND_URL}/api/notifications/admin/all`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // إزالة Authorization مؤقتاً للاختبار
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (fetchError) {
      console.log('Backend not available, using fallback data:', fetchError);
      // استخدام بيانات تجريبية عند فشل الاتصال
      const fallbackNotifications = [
        {
          _id: '1',
          title: 'تحديث النظام',
          message: 'تم تحديث النظام بنجاح مع إضافة ميزات جديدة',
          customerId: null,
          timestamp: new Date().toISOString(),
          readStatus: false,
          type: 'broadcast'
        },
        {
          _id: '2',
          title: 'تأكيد الطلب',
          message: 'تم تأكيد طلبك رقم #12345 وسيتم الشحن قريباً',
          customerId: { _id: 'user1', firstName: 'أحمد', lastName: 'محمد' },
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          readStatus: true,
          type: 'targeted'
        }
      ];

      const fallbackStats = {
        total: 2,
        delivered: 2,
        pending: 0,
        failed: 0
      };

      return NextResponse.json({
        success: true,
        data: fallbackNotifications.map((notification: any) => ({
          id: notification._id,
          title: notification.title || 'إشعار',
          message: notification.message,
          type: notification.customerId ? 'specific' : 'all',
          recipient: notification.customerId ? 
            `${notification.customerId.firstName} ${notification.customerId.lastName || ''}`.trim() 
            : 'جميع المستخدمين',
          recipientId: notification.customerId?._id,
          sentAt: notification.timestamp,
          status: 'delivered',
          readCount: notification.readStatus ? 1 : 0,
          createdBy: 'admin'
        })),
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalItems: 2,
          itemsPerPage: 10
        },
        stats: fallbackStats,
        message: 'تم استخدام بيانات تجريبية - تحقق من اتصال الباك إند'
      });
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

    // محاولة إرسال الإشعار إلى الباك إند
    let response;
    try {
      response = await fetch(`${BACKEND_URL}/api/notifications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // إزالة Authorization مؤقتاً للاختبار
        },
        body: JSON.stringify(notificationData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (fetchError) {
      console.log('Backend not available for sending notification:', fetchError);
      // محاكاة إرسال ناجح
      const mockNotification = {
        _id: Date.now().toString(),
        title: title || 'إشعار',
        message: message,
        customerId: type === 'specific' ? recipientId : null,
        timestamp: new Date().toISOString(),
        readStatus: false,
        type: type === 'all' ? 'broadcast' : 'targeted'
      };

      const formattedNotification = {
        id: mockNotification._id,
        title: mockNotification.title,
        message: mockNotification.message,
        type: mockNotification.customerId ? 'specific' : 'all',
        recipient: mockNotification.customerId ? recipientName || 'مستخدم محدد' : 'جميع المستخدمين',
        recipientId: mockNotification.customerId,
        sentAt: mockNotification.timestamp,
        status: 'delivered',
        readCount: 0,
        createdBy: 'admin'
      };

      return NextResponse.json({
        success: true,
        message: 'تم إرسال الإشعار بنجاح (وضع تجريبي)',
        data: formattedNotification
      });
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

    // محاولة حذف الإشعار من الباك إند
    try {
      const response = await fetch(`${BACKEND_URL}/api/notifications/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          // إزالة Authorization مؤقتاً للاختبار
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (fetchError) {
      console.log('Backend not available for deleting notification:', fetchError);
      // محاكاة حذف ناجح
      return NextResponse.json({
        success: true,
        message: 'تم حذف الإشعار بنجاح (وضع تجريبي)'
      });
    }

    return NextResponse.json({
      success: true,
      message: 'تم حذف الإشعار بنجاح'
    });
  } catch (error) {
    console.error('Error deleting notification:', error);
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : 'خطأ في حذف الإشعار' },
      { status: 500 }
    );
  }
}
