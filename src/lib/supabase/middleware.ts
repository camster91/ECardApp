import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  const response = NextResponse.next({ request });

  const mockUser = request.cookies.get("mock-user-email")?.value;

  // Protected routes - redirect to login if not authenticated
  const protectedPaths = ["/dashboard", "/events"];
  const isProtectedRoute = protectedPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  if (isProtectedRoute && !mockUser) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  // Redirect authenticated users away from auth pages
  const authPaths = ["/login", "/signup", "/forgot-password"];
  const isAuthRoute = authPaths.some(
    (path) => request.nextUrl.pathname === path
  );

  if (isAuthRoute && mockUser) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return response;
}
