import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Convert simplified route patterns to regex patterns
 * Supports wildcards (*) and optional path segments
 * Examples:
 * - '/' -> exact root match
 * - '/about' -> exact about page match
 * - '/about-*' -> matches /about-anything
 * - '/projects/*' -> matches /projects/anything
 */
function createRoutePattern(pattern: string): RegExp {
  // Escape special regex characters except * which we'll handle separately
  let regexPattern = pattern.replace(/[.+?^${}()|[\]\\]/g, '\\$&')
  
  // Handle wildcards:
  // * at the end means match anything after
  // * in the middle means match any segment
  regexPattern = regexPattern.replace(/\*/g, '.*')
  
  // Ensure pattern starts with ^ and ends with $
  regexPattern = `^${regexPattern}$`
  
  return new RegExp(regexPattern)
}

// Define public routes using simplified patterns
const publicRoutePatterns: string[] = [
  '/',
  '/about',
  '/contact',
  '/privacy',
  '/terms',
  '/code-of-conduct',
  '/login',
  '/register',
  '/callback*',
  '/verify-email',
  '/forgot-password',
  '/reset-password*',
  '/projects',
  '/projects/*',
  '/events',
  '/events/*',
  '/community',
  '/community/*',
  '/cs-guild*',
  '/tactics*',
  '/notion*',
  '/aws-cloud-club*',
  '/pixels*',
  '/events/*/feedback*',
  '/blogs',
  '/blogs/*',
  '/facilities',
  '/api/*',
  '/_next/*',
  '/favicon.ico',
  '/manifest.json',
  '/robots.txt',
  '/sitemap.xml',
]

// Convert simplified patterns to regex patterns
const compiledPublicRoutePatterns: RegExp[] = publicRoutePatterns.map(createRoutePattern)

// Helper function to check if a route is public using compiled regex patterns
function isPublicRoute(pathname: string): boolean {
  return compiledPublicRoutePatterns.some(pattern => pattern.test(pathname))
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the current path is public (doesn't require authentication)
  const isCurrentRoutePublic = isPublicRoute(pathname)

  // For Convex Auth, we let the client-side components handle authentication state
  // The middleware only handles basic route protection and redirects
  
  // Allow all public routes to pass through
  if (isCurrentRoutePublic) {
    return NextResponse.next()
  }

  // For protected routes, we can't check authentication status in middleware with Convex Auth
  // Instead, we rely on the AuthGuard component on the client side to handle redirects
  // But we can still redirect unauthenticated users away from auth routes if they try to access them directly

  // Allow all other routes to pass through - AuthGuard will handle authentication checks
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     * - manifest files
     * - robots.txt
     * - sitemap.xml
     */
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|manifest|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|eot)$).*)',
  ],
} 