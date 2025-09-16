import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const publicRoutes = ['/auth/register', '/auth/login'];
const superAdminRoutes = ['/admin', '/admin/:path*'];

export async function middleware(request: NextRequest) {
  const accessToken = request.cookies.get('accessToken')?.value;
  const { pathname } = request.nextUrl;

  if (accessToken) {
    try {
      const { payload } = await jwtVerify(
        accessToken,
        new TextEncoder().encode(process.env.JWT_SECRET!)
      );
      const { role } = payload as { role: string };

      // ✅ already logged in → prevent visiting login/register
      if (publicRoutes.includes(pathname)) {
        return NextResponse.redirect(
          new URL(role === 'ADMIN' ? '/admin' : '/', request.url)
        );
      }

      // ✅ ADMIN entering home → redirect to /admin
      if (role === 'ADMIN' && pathname === '/') {
        return NextResponse.redirect(new URL('/admin', request.url));
      }

      // ✅ Normal user trying to access /admin → send home
      if (
        role !== 'ADMIN' &&
        superAdminRoutes.some(route => pathname.startsWith('/admin'))
      ) {
        return NextResponse.redirect(new URL('/', request.url));
      }

      return NextResponse.next();
    } catch (e) {
      console.error('Token verification failed', e);

      const refreshResponse = await fetch(
        'http://localhost:3000/api/auth/refresh-token',
        {
          method: 'POST',
          credentials: 'include',
        }
      );

      if (refreshResponse.ok) {
        const response = NextResponse.next();
        response.cookies.set(
          'accessToken',
          refreshResponse.headers.get('Set-Cookie') || ''
        );
        return response;
      } else {
        const response = NextResponse.redirect(
          new URL('/auth/login', request.url)
        );
        response.cookies.delete('accessToken');
        response.cookies.delete('refreshToken');
        return response;
      }
    }
  }

  if (!publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
