import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname

  // Since tokens are stored in localStorage (client-side), 
  // we can't reliably check authentication on the server side.
  // We'll let the client-side handle authentication checks.
  
  // Only redirect from root if we're certain there's no authentication
  // For now, we'll let the client-side page component handle the redirect
  
  // If user visits login or signup page, we can check if they have a token in cookies
  // (some auth systems store tokens in cookies as well)
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
     */
    '/((?!api|_next/static|_next/image|favicon.ico|invoices).*)',
  ],
} 