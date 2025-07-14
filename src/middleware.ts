import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { User } from './features/auth'


// Define public routes that don't require authentication
// All other routes are protected by default and will redirect to login
const publicRoutes = [
  '/',
  '/about',
  '/contact',
  '/privacy',
  '/terms',
  '/code-of-conduct',
  '/login',
  '/register',
  '/callback', // OAuth callback route
  '/verify-email',
  '/forgot-password',
  '/reset-password',
  '/projects', // Public projects page
  '/events', // Public events page
  '/community', // Public community page
]

// Helper function to check if a route is public
function isPublicRoute(pathname: string): boolean {
  // Exact match for root path
  if (pathname === '/') {
    return true
  }
  
  // For other routes, check if the pathname starts with the route
  // but ensure it's either an exact match or followed by a '/' or query parameter
  return publicRoutes.some(route => {
    if (route === '/') {
      return pathname === '/' // Only exact match for root
    }
    // Check if pathname starts with route and is followed by '/', '?', or end of string
    return pathname === route || pathname.startsWith(route + '/') || pathname.startsWith(route + '?')
  })
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const url = request.nextUrl.clone()
  


  // Get user data from cookies (assuming the server sets these after authentication)
  const userCookie = request.cookies.get('user')
  const isAuthenticated = request.cookies.get('isAuthenticated')?.value === 'true'
  
  let user: User | null = null
  if (userCookie?.value) {
    try {
      user = JSON.parse(userCookie.value)
    } catch (error) {
      console.error('Failed to parse user cookie:', error)
    }
  }
  const needsProfileCompletion = !user?.rfidId



  // Check if the current path is public (doesn't require authentication)
  const isCurrentRoutePublic = isPublicRoute(pathname)
  const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/register')

  // Handle authentication redirects - protect all routes by default
  if (!isCurrentRoutePublic && !isAuthenticated) {
    // Redirect unauthenticated users to login for any non-public route
    // Save the current URL as 'next' parameter to redirect back after login
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('next', pathname + url.search)
    return NextResponse.redirect(loginUrl)
  }

  // Handle Google OAuth profile completion
  if (isAuthenticated && user) {
    const isGoogleUser = user.signupMethod === 'GOOGLE'

    
    const isOnRegisterPage = pathname.startsWith('/register')
    const isOnCallbackPage = pathname.startsWith('/callback')

    if (isGoogleUser && needsProfileCompletion) {
      // If Google user needs profile completion and not already on register page
      if (!isOnRegisterPage && !isOnCallbackPage) {
        // Prevent infinite redirect by checking if we're already trying to go to register
        const targetPath = '/register'
        const targetSearch = '?google=true'
        
        if (pathname !== targetPath || url.search !== targetSearch) {

          url.pathname = targetPath
          url.search = targetSearch
          return NextResponse.redirect(url)
        }
      }
    } else if (isGoogleUser && !needsProfileCompletion && isOnRegisterPage) {
      // If Google user has complete profile but is on register page, redirect appropriately
      const nextParam = url.searchParams.get('next')
      
      if (nextParam) {
        // Validate and redirect to the next parameter
        try {
          const nextUrl = new URL(nextParam, request.url)
          if (nextUrl.origin === url.origin && !isPublicRoute(nextUrl.pathname)) {
            return NextResponse.redirect(nextUrl)
          }
        } catch {
          console.error('Invalid next parameter for Google user:', nextParam)
        }
      }

      // Default redirect to dashboard
      url.pathname = '/dashboard'
      url.search = ''
      return NextResponse.redirect(url)
    }
  }

  if (isAuthRoute && isAuthenticated && !needsProfileCompletion) {
    // Redirect authenticated users away from auth pages
    // Check if there's a 'next' parameter to redirect to the originally requested page
    const nextParam = url.searchParams.get('next')
    
    if (nextParam) {
      // Validate that the next parameter is a safe internal URL
      try {
        const nextUrl = new URL(nextParam, request.url)
        // Ensure it's the same origin and not an auth route
        if (nextUrl.origin === url.origin && !isPublicRoute(nextUrl.pathname)) {
          console.log('Redirecting to next param:', nextParam)
          return NextResponse.redirect(nextUrl)
        }
      } catch {
        console.error('Invalid next parameter:', nextParam)
      }
    }
    
    // Default redirect to dashboard if no valid next parameter
    url.pathname = '/dashboard'
    url.search = ''
    return NextResponse.redirect(url)
  }

  // Allow the request to continue
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