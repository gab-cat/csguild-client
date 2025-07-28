import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'
import React from 'react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface PaginationProps {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  onPageChange: (page: number) => void
  onItemsPerPageChange?: (itemsPerPage: number) => void
  className?: string
  showItemsPerPageSelector?: boolean
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  className = '',
  showItemsPerPageSelector = true,
}: PaginationProps) {
  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const maxVisiblePages = 7

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Show smart pagination with ellipsis
      if (currentPage <= 4) {
        // Show first pages
        for (let i = 1; i <= 5; i++) {
          pages.push(i)
        }
        pages.push('...')
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 3) {
        // Show last pages
        pages.push(1)
        pages.push('...')
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        // Show middle pages
        pages.push(1)
        pages.push('...')
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i)
        }
        pages.push('...')
        pages.push(totalPages)
      }
    }

    return pages
  }

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1)
    }
  }

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1)
    }
  }

  const pageNumbers = getPageNumbers()

  if (totalPages <= 1) {
    return null
  }

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 ${className}`}>
      {/* Items info and per-page selector */}
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <span>
          Showing {startItem} to {endItem} of {totalItems} events
        </span>
        
        {showItemsPerPageSelector && onItemsPerPageChange && (
          <div className="flex items-center gap-2">
            <span>Show:</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="w-20 h-8 bg-background/50 border-border/50"
                >
                  {itemsPerPage}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-card/95 backdrop-blur-md">
                {[12, 24, 48, 96].map((value) => (
                  <DropdownMenuItem 
                    key={value}
                    onClick={() => onItemsPerPageChange(value)}
                  >
                    {value}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>

      {/* Pagination controls */}
      <div className="flex items-center gap-1">
        {/* Previous button */}
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className="h-9 w-9 p-0 bg-background/50 border-border/50 hover:bg-accent/50"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Previous page</span>
        </Button>

        {/* Page numbers */}
        <div className="flex items-center gap-1">
          {pageNumbers.map((page, index) => (
            <React.Fragment key={index}>
              {page === '...' ? (
                <div className="flex items-center justify-center w-9 h-9">
                  <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                </div>
              ) : (
                <Button
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => onPageChange(page as number)}
                  className={`h-9 w-9 p-0 ${
                    currentPage === page
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-background/50 border-border/50 hover:bg-accent/50'
                  }`}
                >
                  {page}
                </Button>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Next button */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="h-9 w-9 p-0 bg-background/50 border-border/50 hover:bg-accent/50"
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Next page</span>
        </Button>
      </div>
    </div>
  )
}

// Hook for managing pagination state
export function usePagination(
  totalItems: number,
  initialItemsPerPage: number = 12,
  initialPage: number = 1
) {
  const [currentPage, setCurrentPage] = React.useState(initialPage)
  const [itemsPerPage, setItemsPerPage] = React.useState(initialItemsPerPage)

  const totalPages = Math.ceil(totalItems / itemsPerPage)

  // Reset to first page when items per page changes
  React.useEffect(() => {
    setCurrentPage(1)
  }, [itemsPerPage])

  // Ensure current page is valid when total items change
  React.useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(Math.max(1, totalPages))
    }
  }, [totalPages, currentPage])

  const goToPage = React.useCallback((page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }, [totalPages])

  const changeItemsPerPage = React.useCallback((newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage)
  }, [])

  return {
    currentPage,
    itemsPerPage,
    totalPages,
    goToPage,
    changeItemsPerPage,
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1,
    startIndex: (currentPage - 1) * itemsPerPage,
    endIndex: Math.min(currentPage * itemsPerPage, totalItems),
  }
}
