"use client";

import { useQuery } from "convex/react";
import { redirect, usePathname } from "next/navigation";
import React from "react";

import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { api } from "@/lib/convex";

// Helper function to format path segments into readable labels
function formatPathSegment(segment: string): string {
  // Handle special cases
  const specialCases: Record<string, string> = {
    'my-blogs': 'My Blogs',
    'my-events': 'My Events',
    'create': 'Create',
    'edit': 'Edit',
    'settings': 'Settings',
    'profile': 'Profile',
    'dashboard': 'Dashboard',
    'blogs': 'Blogs',
    'events': 'Events',
    'projects': 'Projects',
    'facilities': 'Facilities',
    'users': 'Users',
  };

  // Check if it's a special case
  if (specialCases[segment]) {
    return specialCases[segment];
  }

  // Handle dynamic segments (like [slug])
  if (segment.startsWith('[') && segment.endsWith(']')) {
    return 'Details';
  }

  // Convert kebab-case to Title Case
  return segment
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Generate breadcrumb items from pathname
function generateBreadcrumbs(pathname: string) {
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs: Array<{ label: string; href?: string; isLast: boolean }> = [];

  // Always start with CS Guild
  breadcrumbs.push({
    label: 'CS Guild',
    href: '/',
    isLast: false
  });

  let currentPath = '';

  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const isLast = index === segments.length - 1;

    // Skip certain segments that shouldn't be in breadcrumbs
    const skipSegments = ['platform', 'main', 'auth'];
    if (skipSegments.includes(segment)) {
      return;
    }

    breadcrumbs.push({
      label: formatPathSegment(segment),
      href: isLast ? undefined : currentPath,
      isLast
    });
  });

  // If no specific path segments, show Platform as current
  if (breadcrumbs.length === 1) {
    breadcrumbs.push({
      label: 'Platform',
      isLast: true
    });
  }

  return breadcrumbs;
}

export default function PlatformLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();
  const breadcrumbs = generateBreadcrumbs(pathname);
  const verificationStatus = useQuery(api.users.getUserVerificationStatus)
  if (verificationStatus?.needsVerification) {
    return redirect(`/verify-email?email=${encodeURIComponent(verificationStatus?.email || '')}`)
  }
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="">
        <header className="flex h-12 shrink-0 items-center gap-2 border-b bg-gray-900 rounded-t-xl border-none px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbs.map((crumb, index) => (
                <React.Fragment key={crumb.label}>
                  <BreadcrumbItem className={index === 0 ? "hidden md:block" : ""}>
                    {crumb.isLast ? (
                      <BreadcrumbPage className="text-foreground font-medium">
                        {crumb.label}
                      </BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink
                        href={crumb.href}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        {crumb.label}
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                  {index < breadcrumbs.length - 1 && (
                    <BreadcrumbSeparator className="hidden md:block" />
                  )}
                </React.Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="flex flex-1 flex-col p-3 bg-gray-900 rounded-b-xl">
          <main className="flex-1 border-none rounded-xl bg-gray-950 shadow-sm">
            {children}
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
} 