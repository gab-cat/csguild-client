'use client'

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ChevronDown } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useTransition } from 'react'

import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

export interface SimplePaginationControlProps {
  currentPage: number
  currentLimit: number
  total: number
  showLimitSelector?: boolean
  limitOptions?: number[]
  className?: string
  size?: 'sm' | 'default' | 'lg'
  showFirstLast?: boolean
  showInfo?: boolean
  maxPageButtons?: number
}

const DEFAULT_LIMIT_OPTIONS = [6, 12, 24, 48, 96]

export function SimplePaginationControl({
  currentPage,
  currentLimit,
  total,
  showLimitSelector = true,
  limitOptions = DEFAULT_LIMIT_OPTIONS,
  className = '',
  size = 'default',
  showFirstLast = true,
  showInfo = true,
  maxPageButtons = 5,
}: SimplePaginationControlProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [, startTransition] = useTransition()

  const totalPages = Math.ceil(total / currentLimit)
  const hasNextPage = currentPage < totalPages
  const hasPreviousPage = currentPage > 1

  const updateParams = useCallback((updates: Partial<{ page: number; limit: number }>) => {
    console.log('SimplePaginationControl - updateParams called with:', updates)
    console.log('SimplePaginationControl - current searchParams:', Object.fromEntries(searchParams))
    
    const currentParams = new URLSearchParams(searchParams)
    
    if (updates.page !== undefined) {
      if (updates.page === 1) {
        currentParams.delete('page')
      } else {
        currentParams.set('page', String(updates.page))
      }
    }
    
    if (updates.limit !== undefined) {
      if (updates.limit === 12) { // Default limit
        currentParams.delete('limit')
      } else {
        currentParams.set('limit', String(updates.limit))
      }
      // Reset to first page when changing limit
      currentParams.delete('page')
    }

    const queryString = currentParams.toString()
    const newUrl = queryString ? `${window.location.pathname}?${queryString}` : window.location.pathname
    
    // Use startTransition to prevent UI blocking during navigation
    startTransition(() => {
      router.push(newUrl, { scroll: false })
    })
  }, [router, searchParams, startTransition])

  const goToPage = useCallback((page: number) => {
    if (page >= 1 && page <= totalPages) {
      updateParams({ page })
    }
  }, [updateParams, totalPages])

  const goToNextPage = useCallback(() => {
    if (hasNextPage) {
      updateParams({ page: currentPage + 1 })
    }
  }, [updateParams, currentPage, hasNextPage])

  const goToPreviousPage = useCallback(() => {
    if (hasPreviousPage) {
      updateParams({ page: currentPage - 1 })
    }
  }, [updateParams, currentPage, hasPreviousPage])

  const setLimit = useCallback((limit: number) => {
    updateParams({ limit })
  }, [updateParams])

  const getPageNumbers = useCallback(() => {
    if (totalPages <= maxPageButtons) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    const half = Math.floor(maxPageButtons / 2)
    let start = Math.max(1, currentPage - half)
    const end = Math.min(totalPages, start + maxPageButtons - 1)

    // Adjust start if we're near the end
    if (end - start + 1 < maxPageButtons) {
      start = Math.max(1, end - maxPageButtons + 1)
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i)
  }, [currentPage, totalPages, maxPageButtons])

  if (totalPages <= 1 && !showLimitSelector) {
    return null
  }

  const pageNumbers = getPageNumbers()
  const startItem = total === 0 ? 0 : (currentPage - 1) * currentLimit + 1
  const endItem = Math.min(currentPage * currentLimit, total)

  const buttonSizeClasses = {
    sm: 'h-8 w-8 text-xs',
    default: 'h-9 w-9 text-sm',
    lg: 'h-10 w-10 text-base',
  }

  const buttonSize = buttonSizeClasses[size]

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 ${className}`}>
      {/* Results info and limit selector */}
      <div className="flex flex-col sm:flex-row items-center gap-4 text-sm text-gray-400">
        {showInfo && total > 0 && (
          <div className="whitespace-nowrap">
            Showing {startItem.toLocaleString()}-{endItem.toLocaleString()} of {total.toLocaleString()} results
          </div>
        )}
        
        {showLimitSelector && (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Per page:</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-20 h-8 border-gray-700 bg-gray-800 text-gray-300 hover:bg-gray-700"
                >
                  {currentLimit}
                  <ChevronDown className="ml-1 h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-gray-800 border-gray-700 min-w-[80px]">
                {limitOptions.map((option) => (
                  <DropdownMenuItem
                    key={option}
                    className="text-gray-300 focus:bg-gray-700 focus:text-white cursor-pointer"
                    onClick={() => setLimit(option)}
                  >
                    {option}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex items-center gap-1">
          {/* First page button */}
          {showFirstLast && (
            <Button
              variant="outline"
              size="sm"
              className={`${buttonSize} border-gray-700 text-gray-400 hover:bg-gray-800 hover:text-white disabled:opacity-50`}
              onClick={() => goToPage(1)}
              disabled={!hasPreviousPage}
              aria-label="Go to first page"
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
          )}

          {/* Previous page button */}
          <Button
            variant="outline"
            size="sm"
            className={`${buttonSize} border-gray-700 text-gray-400 hover:bg-gray-800 hover:text-white disabled:opacity-50`}
            onClick={goToPreviousPage}
            disabled={!hasPreviousPage}
            aria-label="Go to previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {/* Page number buttons */}
          <div className="flex items-center gap-1 mx-2">
            {pageNumbers.map((pageNum) => (
              <Button
                key={pageNum}
                variant={pageNum === currentPage ? 'default' : 'outline'}
                size="sm"
                className={`
                  ${buttonSize}
                  ${pageNum === currentPage 
                ? 'bg-purple-600 text-white hover:bg-purple-700 border-purple-600' 
                : 'border-gray-700 text-gray-400 hover:bg-gray-800 hover:text-white'
              }
                `}
                onClick={() => goToPage(pageNum)}
                aria-label={`Go to page ${pageNum}`}
                aria-current={pageNum === currentPage ? 'page' : undefined}
              >
                {pageNum}
              </Button>
            ))}
          </div>

          {/* Next page button */}
          <Button
            variant="outline"
            size="sm"
            className={`${buttonSize} border-gray-700 text-gray-400 hover:bg-gray-800 hover:text-white disabled:opacity-50`}
            onClick={goToNextPage}
            disabled={!hasNextPage}
            aria-label="Go to next page"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          {/* Last page button */}
          {showFirstLast && (
            <Button
              variant="outline"
              size="sm"
              className={`${buttonSize} border-gray-700 text-gray-400 hover:bg-gray-800 hover:text-white disabled:opacity-50`}
              onClick={() => goToPage(totalPages)}
              disabled={!hasNextPage}
              aria-label="Go to last page"
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
