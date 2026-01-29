import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const CORRECT_HOST = 'www.marasil.site'
const WRONG_HOSTS = ['www.marasill.site', 'marasill.site']

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const host = request.nextUrl.hostname

  // توجيه النطاق الخاطئ (marasill) إلى النطاق الصحيح (marasil)
  if (WRONG_HOSTS.includes(host)) {
    const url = new URL(request.url)
    url.host = CORRECT_HOST
    url.protocol = 'https:'
    return NextResponse.redirect(url, 301)
  }

  // مسار /order (مفرد) قد يُفهرس من جوجل -> توجيه للصفحة الرئيسية
  if (path === '/order' || path === '/order/') {
    return NextResponse.redirect(new URL('/', request.url), 301)
  }

  // If user visits login or signup page, we can check if they have a token in cookies
  if ((path === '/login' || path === '/signup')) {
    const token = request.cookies.get('token')?.value || 
                  request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (token) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - invoices (the landing page)
     * - dashboard (admin dashboard - handled client-side)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|invoices|dashboard).*)',
  ],
} 