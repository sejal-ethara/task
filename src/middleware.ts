import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const secretKey = new TextEncoder().encode(process.env.JWT_SECRET);

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;

  const isAuthRoute = pathname.startsWith("/login") || pathname.startsWith("/register");
  const isApiRoute = pathname.startsWith("/api");
  const isPublicApiRoute = pathname === "/api/auth/login" || pathname === "/api/auth/register";

  let decodedToken = null;

  if (token) {
    try {
      const { payload } = await jwtVerify(token, secretKey, {
        algorithms: ["HS256"],
      });
      decodedToken = payload;
    } catch (err) {
      // Token is invalid/expired
    }
  }

  // Redirect to dashboard if logged in and trying to access login/register
  if (isAuthRoute && decodedToken) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Protect private API routes
  if (isApiRoute && !isPublicApiRoute && !decodedToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Protect dashboard routes
  if (pathname.startsWith("/dashboard") || pathname === "/projects" || pathname === "/tasks" || pathname === "/team" || pathname === "/settings" || pathname === "/profile") {
    if (!decodedToken) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // Allow request to continue
  const response = NextResponse.next();
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
