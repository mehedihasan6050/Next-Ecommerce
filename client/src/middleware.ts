import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const publicRoutes = ['/auth/register', '/auth/login'];
const sellerRoutes = ['/seller', '/seller/:path*'];
const adminRoutes = ['/admin', '/admin/:path*'];

export async function middleware(request: NextRequest) {
  const accessToken = request.cookies.get('accessToken')?.value;
  const { pathname } = request.nextUrl;

  // Not logged in → only allow public routes
  if (!accessToken) {
    if (!publicRoutes.includes(pathname)) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
    return NextResponse.next();
  }

  try {
    const { payload } = await jwtVerify(
      accessToken,
      new TextEncoder().encode(process.env.JWT_SECRET!)
    );

    const { role } = payload as { role: string };

    // ✅ USER restrictions
    if (role === 'USER') {
      if (
        adminRoutes.some(route => pathname.startsWith('/admin')) ||
        sellerRoutes.some(route => pathname.startsWith('/seller'))
      ) {
        return NextResponse.redirect(new URL('/', request.url));
      }
    }

    // ✅ SELLER restrictions
    if (role === 'SELLER') {
      if (adminRoutes.some(route => pathname.startsWith('/admin'))) {
        return NextResponse.redirect(new URL('/seller', request.url));
      }
    }

    // ✅ ADMIN restrictions
    if (role === 'ADMIN') {
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

    const response = NextResponse.redirect(new URL('/auth/login', request.url));
    response.cookies.delete('accessToken');
    response.cookies.delete('refreshToken');
    return response;
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
