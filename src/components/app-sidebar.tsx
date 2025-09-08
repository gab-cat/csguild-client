"use client"

import {
  BookOpen,
  Calendar,
  Code2,
  FolderOpen,
  FileText,
  LayoutDashboard,
  User,
  Home,
  Users,
  Building,
  Briefcase,
} from "lucide-react"
import Link from "next/link"
import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useCurrentUser } from "@/features/auth/hooks/use-current-user"

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: "My Profile",
      url: "/profile",
      icon: User,
    },
    {
      title: "My Blogs",
      url: "/my-blogs",
      icon: BookOpen,
    },
    {
      title: "My Events",
      url: "/my-events",
      icon: Calendar,
      items: [
        {
          title: "Created Events",
          url: "/my-events?tab=created",
        },
        {
          title: "Attended Events",
          url: "/my-events?tab=attended",
        },
      ],
    },
    {
      title: "My Projects",
      url: "/my-projects",
      icon: FolderOpen,
    },
    {
      title: "My Applications",
      url: "/my-applications",
      icon: FileText,
    },
  ],
  navManagement: [
    {
      title: "Calendar",
      url: "/management/calendar",
      icon: Calendar,
    },
    {
      title: "Facilities",
      url: "/management/facilities",
      icon: Building,
    },
    {
      title: "Users",
      url: "/management/users",
      icon: Users,
    },
    {
      title: "Projects",
      url: "/management/projects",
      icon: Briefcase,
    },
    {
      title: "Events",
      url: "/management/events",
      icon: Calendar,
    },
    {
      title: "Blogs",
      url: "/management/blogs",
      icon: BookOpen,
    },
  ],
  navSecondary: [
    {
      title: "Back to Main",
      url: "/",
      icon: Home,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useCurrentUser()
  const isAdmin = user?.roles?.includes("ADMIN") ?? false
  return (
    <Sidebar variant="inset" className="border-r border-gray-800/20 bg-gray-950" {...props}>
      <SidebarHeader className="border-b border-gray-800/10 bg-gray-950">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild className="hover:bg-gray-800/50">
              <Link href="/">
                <div className="bg-gradient-to-br from-pink-500 to-violet-500 flex aspect-square size-8 items-center justify-center rounded-lg shadow-lg">
                  <Code2 className="size-4 text-white" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium font-space-mono text-white">CS Guild</span>
                  <span className="truncate text-xs text-gray-400 font-space-mono">{"// Code • Learn • Build"}</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="bg-gray-950">
        <NavMain items={data.navMain} label="Platform" />
        {isAdmin && (
          <NavMain items={data.navManagement} label="Management" />
        )}
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter className="border-t border-gray-800/10 bg-gray-950">
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
