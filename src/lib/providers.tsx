'use client'

import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ConvexQueryCacheProvider } from "convex-helpers/react/cache/provider";
import { ReactNode, useState, Suspense } from 'react'

import { AuthSyncProvider, EmailVerificationGuard } from '@/features/auth'

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes
            refetchOnWindowFocus: false,
            retry: (failureCount, error: unknown) => {
              // Don't retry on 4xx errors (auth errors, validation errors, etc.)
              const errorStatus = (error as { status?: number })?.status
              if (errorStatus && errorStatus >= 400 && errorStatus < 500) {
                return false
              }
              // Retry up to 3 times for other errors
              return failureCount < 3
            },
          },
          mutations: {
            retry: (failureCount, error: unknown) => {
              // Don't retry mutations on 4xx errors
              const errorStatus = (error as { status?: number })?.status
              if (errorStatus && errorStatus >= 400 && errorStatus < 500) {
                return false
              }
              // Retry up to 1 time for network errors
              return failureCount < 1
            },
          },
        },
      })
  )

  return (
    <ConvexProvider client={convex}>
      <ConvexAuthProvider client={convex}>
        <ConvexQueryCacheProvider>
          <QueryClientProvider client={queryClient}>
            <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center"><div className="text-white">Loading...</div></div>}>
              <AuthSyncProvider>
                <EmailVerificationGuard>
                  {children}
                </EmailVerificationGuard>
              </AuthSyncProvider>
            </Suspense>
            <ReactQueryDevtools initialIsOpen={false} />
          </QueryClientProvider>
        </ConvexQueryCacheProvider>
      </ConvexAuthProvider>
    </ConvexProvider>
  )
} 