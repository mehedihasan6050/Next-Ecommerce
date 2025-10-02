import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const publicRoutes = ["/auth/register", "/auth/login"];

const roleRoutes: Record<string, string[]> = {
  USER: ["/"],              // শুধু home route
  SELLER: ["/", "/seller"], // home + seller route
  ADMIN: ["/admin"],        // শুধু admin
};

export async function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value;
  const { pathname } = request.nextUrl;

  // যদি token নাই & public না → login এ পাঠাও
  if (!accessToken && !publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  if (accessToken) {
    try {
      const { payload } = await jwtVerify(
        accessToken,
        new TextEncoder().encode(process.env.JWT_SECRET!)
      );

      const { role } = payload as { role: "USER" | "SELLER" | "ADMIN" };

      // Public routes → already logged in হলে নিজের base route এ পাঠাও
      if (publicRoutes.includes(pathname)) {
        let redirectPath = "/";
        if (role === "SELLER") redirectPath = "/seller";
        if (role === "ADMIN") redirectPath = "/admin";
        return NextResponse.redirect(new URL(redirectPath, request.url));
      }

      const allowedRoutes = roleRoutes[role] || [];

      // check করো path allowed route এর মধ্যে পড়ে কিনা
      if (!allowedRoutes.some((route) => pathname.startsWith(route))) {
        return NextResponse.redirect(new URL(allowedRoutes[0], request.url));
      }
    } catch (e) {
      console.error("Invalid token:", e);
      const response = NextResponse.redirect(new URL("/auth/login", request.url));
      response.cookies.delete("accessToken");
      response.cookies.delete("refreshToken");
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
