import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

const PUBLIC_FILE = /\.(.*)$/;

export function middleware(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl;

    // Never run app middleware on Next.js internals or static files
    if (
      pathname.startsWith('/_next') ||
      pathname.startsWith('/api') ||
      pathname === '/favicon.ico' ||
      pathname === '/sitemap.xml' ||
      pathname === '/robots.txt' ||
      PUBLIC_FILE.test(pathname)
    ) {
      return NextResponse.next();
    }

    if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
      const raw = request.cookies.get('admin-token')?.value;
      let token = raw?.trim() ?? '';
      if (token) {
        try {
          token = decodeURIComponent(token);
        } catch {
          /* use raw value */
        }
      }
      if (!token || token.length < 20) {
        return NextResponse.redirect(new URL('/admin/login', request.url));
      }
      return NextResponse.next();
    }

    if (pathname.startsWith('/admin')) {
      return NextResponse.next();
    }

    return intlMiddleware(request);
  } catch {
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    '/',
    '/(en|ru|uz)/:path*',
    '/admin',
    '/admin/:path*',
  ],
};
