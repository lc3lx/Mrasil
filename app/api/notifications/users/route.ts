import { NextRequest, NextResponse } from 'next/server';
import { API_BASE_URL } from '@/lib/constants';

// GET - جلب قائمة المستخدمين من الباك إند
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const activeOnly = searchParams.get('activeOnly') === 'true';
    const response = await fetch(`${API_BASE_URL}/customers`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': request.headers.get('authorization') || '',
        'Cookie': request.headers.get('cookie') || '',
      },
    });

    if (!response.ok) {
      const text = await response.text();
      return NextResponse.json({ success: false, message: `Backend error ${response.status}`, details: text }, { status: 500 });
    }

    const backendData = await response.json();
    let users = backendData.data || backendData || [];

    // تحويل البيانات لتتماشى مع الفرونت إند
    users = users.map((user: any) => ({
      id: user._id,
      firstName: user.firstName || user.name?.split(' ')[0] || 'مستخدم',
      lastName: user.lastName || user.name?.split(' ')[1] || '',
      email: user.email,
      phone: user.phone,
      active: user.active !== false, // افتراض أن المستخدم نشط إذا لم يكن محدد
      role: user.role || 'customer'
    }));

    // فلترة المستخدمين النشطين فقط
    if (activeOnly) {
      users = users.filter((user: any) => user.active);
    }

    // فلترة حسب البحث
    if (search) {
      users = users.filter((user: any) =>
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
        user.email?.toLowerCase().includes(search.toLowerCase()) ||
        user.phone?.includes(search)
      );
    }

    // تنسيق البيانات للعرض
    const formattedUsers = users.map((user: any) => ({
      id: user.id,
      name: `${user.firstName} ${user.lastName}`.trim(),
      email: user.email || 'لا يوجد إيميل',
      phone: user.phone || 'لا يوجد رقم',
      active: user.active,
      avatar: `${user.firstName.charAt(0)}${user.lastName.charAt(0) || user.firstName.charAt(1) || 'م'}`
    }));

    return NextResponse.json({ success: true, data: formattedUsers, total: formattedUsers.length });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ success: false, message: 'خطأ في جلب قائمة المستخدمين' }, { status: 500 });
  }
}
