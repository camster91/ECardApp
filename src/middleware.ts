import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Public routes that don't require authentication
  const publicRoutes = [
    '/',
    '/login',
    '/signup',
    '/forgot-password',
    '/callback',
    '/api/auth',
    '/events/[eventId]/guest',
    '/events/[eventId]/public'
  ];
  
  // Check if current route is public
  const isPublicRoute = publicRoutes.some(route => {
    if (route.includes('[eventId]')) {
      const pattern = /^\/events\/[^\/]+\/(guest|public)$/;
      return pattern.test(pathname);
    }
    return pathname.startsWith(route);
  });

  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Check for session
  const supabase = await createClient();
  const sessionToken = request.cookies.get('ecardapp_session')?.value;

  if (!sessionToken) {
    // Redirect to login if no session
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Verify session
  const { data: session, error } = await supabase
    .from('user_sessions')
    .select('*')
    .eq('session_token', sessionToken)
    .gt('expires_at', new Date().toISOString())
    .single();

  if (error || !session) {
    // Invalid or expired session
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('ecardapp_session');
    response.cookies.delete('ecardapp_user');
    return response;
  }

  // Check role-based access
  const userRole = session.user_role;
  
  // Admin-only routes
  const adminRoutes = ['/dashboard', '/settings', '/admin'];
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));
  
  if (isAdminRoute && userRole !== 'admin') {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  // Guest event access check
  if (pathname.startsWith('/events/') && userRole === 'guest') {
    const eventIdMatch = pathname.match(/^\/events\/([^\/]+)/);
    if (eventIdMatch) {
      const eventId = eventIdMatch[1];
      
      // Check if guest has access to this event
      const { data: guestAccess } = await supabase
        .from('auth_codes')
        .select('event_id')
        .eq('id', session.user_id)
        .eq('event_id', eventId)
        .single();

      if (!guestAccess) {
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};