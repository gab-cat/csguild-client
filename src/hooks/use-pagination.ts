'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useMemo } from 'react'

export interface PaginationState {
  page: number
  limit: number
  total?: number
  totalPages?: number
}

export interface PaginationControls {
  goToPage: (page: number) => void
  goToNextPage: () => void
  goToPreviousPage: () => void
  setLimit: (limit: number) => void
  hasNextPage: boolean
  hasPreviousPage: boolean
  canGoToPage: (page: number) => boolean
  getPageNumbers: () => number[]
}

export interface UsePaginationProps {
  defaultPage?: number
  defaultLimit?: number
  total?: number
  maxPageButtons?: number
}

export interface UsePaginationReturn extends PaginationState, PaginationControls {}

/**
 * Custom hook for managing pagination state and navigation
 * Syncs with URL search parameters for persistent state
 */
export function usePagination({
  defaultPage = 1,
  defaultLimit = 12,
  total = 0,
  maxPageButtons = 5,
}: UsePaginationProps = {}): UsePaginationReturn {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Get current state from URL or use defaults
  const page = useMemo(() => {
    const pageParam = searchParams.get('page')
    return pageParam ? Math.max(1, parseInt(pageParam)) : defaultPage
  }, [searchParams, defaultPage])

  const limit = useMemo(() => {
    const limitParam = searchParams.get('limit')
    return limitParam ? Math.max(1, parseInt(limitParam)) : defaultLimit
  }, [searchParams, defaultLimit])

  const totalPages = Math.ceil(total / limit)

  // Update URL with new parameters
  const updateParams = useCallback((updates: Partial<{ page: number; limit: number }>) => {
    const currentParams = new URLSearchParams(searchParams)
    
    if (updates.page !== undefined) {
      if (updates.page === defaultPage) {
        currentParams.delete('page')
      } else {
        currentParams.set('page', String(updates.page))
      }
    }
    
    if (updates.limit !== undefined) {
      if (updates.limit === defaultLimit) {
        currentParams.delete('limit')
      } else {
        currentParams.set('limit', String(updates.limit))
      }
      // Reset to first page when changing limit
      currentParams.delete('page')
    }

    const newUrl = currentParams.toString() ? `?${currentParams.toString()}` : window.location.pathname
    router.push(newUrl, { scroll: false })
  }, [router, searchParams, defaultPage, defaultLimit])

  // Navigation functions
  const goToPage = useCallback((newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      updateParams({ page: newPage })
    }
  }, [updateParams, totalPages])

  const goToNextPage = useCallback(() => {
    if (page < totalPages) {
      updateParams({ page: page + 1 })
    }
  }, [updateParams, page, totalPages])

  const goToPreviousPage = useCallback(() => {
    if (page > 1) {
      updateParams({ page: page - 1 })
    }
  }, [updateParams, page])

  const setLimit = useCallback((newLimit: number) => {
    updateParams({ limit: newLimit })
  }, [updateParams])

  // Helper functions
  const hasNextPage = page < totalPages
  const hasPreviousPage = page > 1

  const canGoToPage = useCallback((targetPage: number) => {
    return targetPage >= 1 && targetPage <= totalPages
  }, [totalPages])

  const getPageNumbers = useCallback(() => {
    if (totalPages <= maxPageButtons) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    const half = Math.floor(maxPageButtons / 2)
    let start = Math.max(1, page - half)
    const end = Math.min(totalPages, start + maxPageButtons - 1)

    // Adjust start if we're near the end
    if (end - start + 1 < maxPageButtons) {
      start = Math.max(1, end - maxPageButtons + 1)
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i)
  }, [page, totalPages, maxPageButtons])

  return {
    // State
    page,
    limit,
    total,
    totalPages,
    
    // Controls
    goToPage,
    goToNextPage,
    goToPreviousPage,
    setLimit,
    hasNextPage,
    hasPreviousPage,
    canGoToPage,
    getPageNumbers,
  }
}
