import { updateSession } from '@/lib/supabase/middleware';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, icons, manifest
     * - public assets
     * - API routes (handled by their own auth)
     * - Public event pages (/e/slug)
     */
    '/((?!_next/static|_next/image|favicon\\.ico|icons|manifest\\.json|opengraph-image|api/|e/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};
