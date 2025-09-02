import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { isMaintenanceMode, isPathAllowed } from '@/config/maintenance'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if maintenance mode is enabled
  if (isMaintenanceMode()) {
    // Allow access to maintenance page itself
    if (pathname === '/maintenance') {
      return NextResponse.next()
    }

    // Check if path is allowed during maintenance
    if (!isPathAllowed(pathname)) {
      return NextResponse.redirect(new URL('/maintenance', request.url))
    }
  }

  // If maintenance is disabled and user is on maintenance page, redirect home
  if (!isMaintenanceMode() && pathname === '/maintenance') {
    return NextResponse.redirect(new URL('/', request.url))
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
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
