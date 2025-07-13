'use client'

import { Separator } from '@radix-ui/react-separator'
import { Code2, LogOut, LogIn, UserPlus, LayoutDashboard, User, ChevronDown, Home, Calendar, Users as UsersIcon, FolderOpen, FileText } from 'lucide-react'
import Link from 'next/link'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useLogoutMutation } from '@/features/auth/hooks'
import { useAuthStore } from '@/features/auth/stores/auth-store'

const NavBar = () => {
  const { user, isAuthenticated, isLoading } = useAuthStore()
  const logoutMutation = useLogoutMutation()

  const handleLogout = () => {
    logoutMutation.mutate()
  }

  const getUserInitials = (firstName?: string, lastName?: string) => {
    if (!firstName && !lastName) return 'U'
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase()
  }

  // Navigation items that appear when authenticated
  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/events', label: 'Events', icon: Calendar },
    { href: '/projects', label: 'Projects', icon: FolderOpen },
    { href: '/community', label: 'Community', icon: UsersIcon },
  ]

  return (
    <header className="sticky w-screen top-0 z-50 flex h-16 shrink-0 items-center gap-4 border-b border-pink-500/20 bg-black/80 backdrop-blur-md">
      <div className='max-w-[95%] mx-auto flex w-full items-center justify-between px-4 sm:px-6 lg:px-8'>
        {/* Left Section */}
        <div className="flex items-center gap-4 flex-1">
          {/* Enhanced Brand */}
          <Link href="/" className="flex items-center gap-3 group md:ml-8">
            <div className="relative">
              <Code2 className="h-6 w-6 text-pink-400 group-hover:text-pink-300 transition-colors duration-300" />
              <div className="absolute inset-0 bg-pink-400/20 rounded-lg blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <div className="flex flex-col">
              <span className="font-space-mono text-lg font-bold bg-gradient-to-r from-pink-400 to-violet-400 bg-clip-text text-transparent group-hover:from-pink-300 group-hover:to-violet-300 transition-all duration-300">
              CS Guild
              </span>
              <span className="font-space-mono text-xs text-gray-400 group-hover:text-gray-300 transition-colors duration-300 hidden sm:block">
                {"// Code • Learn • Build"}
              </span>
            </div>
          </Link>

          {/* Navigation Links  */}
          <>
            <Separator orientation="vertical" className="h-4 bg-pink-500/20 hidden lg:block" />
            
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-300 hover:text-pink-400 hover:bg-pink-500/10 transition-colors duration-200 gap-2"
                  >
                    <item.icon className="h-4 w-4" />
                    <span className="hidden xl:inline">{item.label}</span>
                  </Button>
                </Link>
              ))}
            </nav>
          </>
        </div>

        {/* Auth Section */}
        <div className="flex items-center gap-3">
          {isLoading ? (
          /* Loading Skeleton */
            <div className="flex items-center gap-2 px-2 py-1">
              {/* User Info Skeleton - Desktop */}
              <div className="hidden md:flex flex-col items-end mr-2 gap-1">
                <div className="h-4 w-24 bg-pink-500/20 rounded animate-pulse" />
                <div className="h-3 w-16 bg-violet-500/20 rounded animate-pulse" />
              </div>

              {/* Avatar Skeleton */}
              <div className="h-8 w-8 rounded-full bg-pink-500/20 animate-pulse border-2 border-pink-500/30" />

              {/* Chevron Skeleton */}
              <div className="h-4 w-4 bg-gray-500/20 rounded animate-pulse" />
            </div>
          ) : isAuthenticated && user ? (
          /* Authenticated State - Dropdown Menu */
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 px-2 py-1 h-auto hover:bg-pink-500/10 transition-colors">
                  {/* User Info - Desktop */}
                  <div className="hidden md:flex flex-col items-end mr-2">
                    <span className="text-sm font-medium text-white">
                      {user.firstName} {user.lastName}
                    </span>
                    <span className="text-xs text-pink-400 font-space-mono">
                      {"// " + (user.course || 'CS Student')}
                    </span>
                  </div>

                  {/* User Avatar */}
                  <Avatar className="h-8 w-8 border-2 border-pink-500/30 hover:border-pink-400/50 transition-colors">
                    <AvatarImage 
                      src={user.imageUrl} 
                      alt={`${user.firstName} ${user.lastName}`}
                    />
                    <AvatarFallback className="bg-gradient-to-br from-pink-500 to-violet-500 text-white text-sm font-bold">
                      {getUserInitials(user.firstName, user.lastName)}
                    </AvatarFallback>
                  </Avatar>

                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-56 bg-gray-900/95 border-pink-500/20 backdrop-blur-md">
                {/* User Info Header */}
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none text-white">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs leading-none text-pink-400 font-space-mono">
                      {user.email}
                    </p>
                    <p className="text-xs leading-none text-gray-400">
                      {user.course || 'CS Student'}
                    </p>
                  </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator className="bg-pink-500/20" />

                {/* Dashboard */}
                <DropdownMenuItem asChild>
                  <Link 
                    href="/dashboard" 
                    className="flex items-center gap-2 cursor-pointer text-gray-300 hover:text-violet-400 hover:bg-violet-500/10"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </DropdownMenuItem>

                {/* My Projects */}
                <DropdownMenuItem asChild>
                  <Link 
                    href="/my-projects" 
                    className="flex items-center gap-2 cursor-pointer text-gray-300 hover:text-purple-400 hover:bg-purple-500/10"
                  >
                    <FolderOpen className="h-4 w-4" />
                    <span>My Projects</span>
                  </Link>
                </DropdownMenuItem>

                {/* My Applications */}
                <DropdownMenuItem asChild>
                  <Link 
                    href="/my-applications" 
                    className="flex items-center gap-2 cursor-pointer text-gray-300 hover:text-orange-400 hover:bg-orange-500/10"
                  >
                    <FileText className="h-4 w-4" />
                    <span>My Applications</span>
                  </Link>
                </DropdownMenuItem>

                {/* Profile */}
                <DropdownMenuItem asChild>
                  <Link 
                    href="/profile" 
                    className="flex items-center gap-2 cursor-pointer text-gray-300 hover:text-blue-400 hover:bg-blue-500/10"
                  >
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator className="bg-pink-500/20" />

                {/* Logout */}
                <DropdownMenuItem 
                  onClick={handleLogout}
                  disabled={logoutMutation.isPending}
                  className="flex items-center gap-2 cursor-pointer text-gray-300 hover:text-red-400 hover:bg-red-500/10 focus:text-red-400 focus:bg-red-500/10"
                >
                  <LogOut className="h-4 w-4" />
                  <span>
                    {logoutMutation.isPending ? 'Logging out...' : 'Logout'}
                  </span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
          /* Unauthenticated State */
            <div className="flex items-center gap-2">
              {/* Login Button */}
              <Link href="/login">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-300 hover:text-pink-400 hover:bg-pink-500/10 transition-colors"
                >
                  <LogIn className="h-4 w-4" />
                  <span className="hidden sm:inline ml-2">Login</span>
                </Button>
              </Link>

              <Separator orientation="vertical" className="h-6 bg-pink-500/20" />

              {/* Register Button */}
              <Link href="/register">
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 text-white shadow-lg shadow-pink-500/25 transition-all duration-300 hover:scale-105"
                >
                  <UserPlus className="h-4 w-4" />
                  <span className="hidden sm:inline ml-2">Join Guild</span>
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

    </header>
  )
}

export default NavBar