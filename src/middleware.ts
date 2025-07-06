import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { User } from './features/auth'


// Define protected routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/profile',
  '/settings',
  '/events',
  '/courses',
  '/community'
]

// Define auth routes that authenticated users shouldn't access
const authRoutes = [
  '/login',
  '/register'
]

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

  // Check if the current path is protected
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route))

  // Handle authentication redirects
  if (isProtectedRoute && !isAuthenticated) {
    // Redirect unauthenticated users to login
    url.pathname = '/login'
    return NextResponse.redirect(url)
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
      // If Google user has complete profile but is on register page, redirect to dashboard

      url.pathname = '/dashboard'
      url.search = ''
      return NextResponse.redirect(url)
    }
  }

  if (isAuthRoute && isAuthenticated && !needsProfileCompletion) {
    // Redirect authenticated users away from auth pages to dashboard
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  
  console.log('here')

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
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
} 