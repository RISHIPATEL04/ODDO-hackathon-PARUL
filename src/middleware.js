import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function authGuard(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/login",
    },
    secret: process.env.NEXTAUTH_SECRET || "default_secret_for_development_only",
  }
);

// Protect all routes EXCEPT the ones listed here
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (auth API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - login
     * - signup
     * - explore
     * - exactly the root path /
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico|login|signup|explore|$).*)',
  ],
};

