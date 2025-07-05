'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ReactNode, useState } from 'react'

import { AuthSyncProvider } from '@/features/auth'

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
    <QueryClientProvider client={queryClient}>
      <AuthSyncProvider>
        {children}
      </AuthSyncProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
} 