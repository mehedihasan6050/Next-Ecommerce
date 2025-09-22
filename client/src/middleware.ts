import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const publicRoutes = ['/auth/register', '/auth/login'];
const sellerRoutes = ['/seller', '/seller/:path*'];
const adminRoutes = ['/admin', '/admin/:path*'];

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
          new URL(
            role === 'ADMIN' ? '/admin' : role === 'SELLER' ? '/seller' : '/',
            request.url
          )
        );
      }

      // ✅ Role based access
      if (role === 'USER') {
        // user can't access admin or seller
        if (
          adminRoutes.some(route => pathname.startsWith('/admin')) ||
          sellerRoutes.some(route => pathname.startsWith('/seller'))
        ) {
          return NextResponse.redirect(new URL('/', request.url));
        }
      }

      if (role === 'SELLER') {
        // seller can't access admin
        if (adminRoutes.some(route => pathname.startsWith('/admin'))) {
          return NextResponse.redirect(new URL('/seller', request.url));
        }
        // ✅ seller can access user routes (no block here)
      }

      if (role === 'ADMIN') {
        // admin can't access seller or user routes
        if (
          sellerRoutes.some(route => pathname.startsWith('/seller')) ||
          (!adminRoutes.some(route => pathname.startsWith('/admin')) &&
            pathname !== '/admin')
        ) {
          return NextResponse.redirect(new URL('/admin', request.url));
        }
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

  // Not logged in → only public routes allowed
  if (!publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
