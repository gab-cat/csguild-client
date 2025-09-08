"use client"

import { useQueryClient } from '@tanstack/react-query'
import {
  ChevronsUpDown,
  LogOut,
  User,
} from "lucide-react"
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { Skeleton } from "@/components/ui/skeleton"
import { useCurrentUser } from '@/features/auth/hooks/use-current-user'
import { useAuthStore as usePersistentAuthStore } from '@/features/auth/stores/auth-store'
import { useAction, api } from '@/lib/convex'
import { showInfoToast } from '@/lib/toast'
import { useAuthStore } from '@/stores/auth-store'

export function NavUser() {
  const { user, isLoading } = useCurrentUser()
  const router = useRouter()
  const { clearAuth, isAuthenticated } = useAuthStore()
  const { clearAuth: clearPersistentAuth } = usePersistentAuthStore()
  const queryClient = useQueryClient()
  const { isMobile } = useSidebar()

  const signOut = useAction(api.auth.signOut)

  const handleLogout = async () => {
    try {
      await signOut()
      clearAuth()
      clearPersistentAuth()
      queryClient.clear()
      router.push('/')
      showInfoToast(
        'Logged out successfully',
        'See you later! Your coding journey continues when you return.'
      )
    } catch (error) {
      console.error('Logout error:', error)
      clearAuth()
      clearPersistentAuth()
      queryClient.clear()
      router.push('/')
      showInfoToast(
        'Logged out',
        'You have been logged out locally. Please check your connection if you encounter issues.'
      )
      window.location.reload()
    }
  }

  const getUserInitials = (firstName?: string, lastName?: string) => {
    if (!firstName && !lastName) return 'U'
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase()
  }

  if (isLoading) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
            <Skeleton className="h-8 w-8 rounded-lg" />
            <div className="grid flex-1 text-left text-sm leading-tight">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-32" />
            </div>
            <ChevronsUpDown className="ml-auto size-4" />
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    )
  }

  if (!isAuthenticated || !user) {
    return null
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-gray-900 hover:bg-gray-800 transition-colors text-white data-[state=open]:text-gray-200 hover:text-gray-200"
            >
              <Avatar className="h-8 w-8 rounded-full border-2 border-pink-500/30">
                <AvatarImage src={user.imageUrl} alt={`${user.firstName} ${user.lastName}`} />
                <AvatarFallback className="rounded-lg bg-gradient-to-br from-pink-500 to-violet-500 text-white text-sm font-bold">
                  {getUserInitials(user.firstName, user.lastName)}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.firstName} {user.lastName}</span>
                <span className="truncate text-xs text-pink-400/80">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg border-gray-800 border bg-gray-950"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-full border-2 border-pink-500/30">
                  <AvatarImage src={user.imageUrl} alt={`${user.firstName} ${user.lastName}`} />
                  <AvatarFallback className="rounded-lg bg-gradient-to-br from-pink-500 to-violet-500 text-white text-sm font-bold">
                    {getUserInitials(user.firstName, user.lastName)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.firstName} {user.lastName}</span>
                  <span className="truncate text-xs text-pink-500">{user.email}</span>
                  <span className="truncate text-xs text-gray-300 mt-1">{user.course || 'CS Student'}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-gray-800" />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href="/profile" className="flex items-center gap-2 cursor-pointer hover:bg-gray-800/100 transition-colors">
                  <User className="h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              disabled={isLoading}
              className="flex items-center gap-2 cursor-pointer text-red-600 hover:text-red-700 focus:text-red-700 hover:bg-red-900/20 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>{isLoading ? 'Logging out...' : 'Log out'}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
