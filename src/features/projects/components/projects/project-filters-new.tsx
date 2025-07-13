'use client'

import { Search, Filter, X, Tag, ChevronDown } from 'lucide-react'
import React, { useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { useDebounce } from '@/hooks/use-debounce'

import type { ProjectFilters, ProjectStatus } from '../../types'

interface ProjectFiltersComponentProps {
  filters: ProjectFilters
  onFiltersChange: (filters: ProjectFilters) => void
}

const statusOptions: { value: ProjectStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All Status' },
  { value: 'OPEN', label: 'Open' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'CANCELLED', label: 'Cancelled' },
]

const sortOptions = [
  { value: 'createdAt-desc', label: 'Created Date (Newest)' },
  { value: 'createdAt-asc', label: 'Created Date (Oldest)' },
  { value: 'updatedAt-desc', label: 'Updated Date (Newest)' },
  { value: 'updatedAt-asc', label: 'Updated Date (Oldest)' },
  { value: 'dueDate-desc', label: 'Due Date (Latest)' },
  { value: 'dueDate-asc', label: 'Due Date (Earliest)' },
  { value: 'title-asc', label: 'Title (A-Z)' },
  { value: 'title-desc', label: 'Title (Z-A)' },
]

export function ProjectFiltersComponent({ filters, onFiltersChange }: ProjectFiltersComponentProps) {
  const [tagInput, setTagInput] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [searchInput, setSearchInput] = useState(filters.search || '')
  
  // Debounce search input with 500ms delay
  const debouncedSearch = useDebounce(searchInput, 500)

  // Update filters when debounced search changes
  React.useEffect(() => {
    if (debouncedSearch !== filters.search) {
      onFiltersChange({ ...filters, search: debouncedSearch || undefined })
    }
  }, [debouncedSearch, filters, onFiltersChange])

  const handleSearchInputChange = (value: string) => {
    setSearchInput(value)
  }

  const handleStatusChange = (value: string) => {
    onFiltersChange({ 
      ...filters, 
      status: value === 'all' ? undefined : value as ProjectStatus 
    })
  }

  const handleSortChange = (value: string) => {
    const [sortBy, sortOrder] = value.split('-')
    onFiltersChange({ 
      ...filters, 
      sortBy: sortBy as 'createdAt' | 'updatedAt' | 'dueDate' | 'title',
      sortOrder: sortOrder as 'asc' | 'desc'
    })
  }

  const handleAddTag = () => {
    if (tagInput.trim() && !filters.tags?.includes(tagInput.trim())) {
      const newTags = [...(filters.tags || []), tagInput.trim()]
      onFiltersChange({ ...filters, tags: newTags })
      setTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    const newTags = filters.tags?.filter(tag => tag !== tagToRemove)
    onFiltersChange({ ...filters, tags: newTags?.length ? newTags : undefined })
  }

  const handleClearFilters = () => {
    onFiltersChange({})
    setTagInput('')
  }

  const hasActiveFilters = filters.status || filters.tags?.length || filters.search
  const currentStatus = statusOptions.find(opt => opt.value === (filters.status || 'all'))
  const currentSort = sortOptions.find(opt => 
    opt.value === `${filters.sortBy || 'createdAt'}-${filters.sortOrder || 'desc'}`
  )

  return (
    <div className="space-y-4">
      {/* Search and Filter Toggle */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search projects by title or description..."
            value={searchInput}
            onChange={(e) => handleSearchInputChange(e.target.value)}
            className="pl-10 bg-gray-900/50 border-gray-700 text-white placeholder-gray-400"
          />
        </div>

        {/* Filter Toggle */}
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="bg-gray-900/50 border-gray-700 text-white hover:bg-gray-800"
        >
          <Filter className="w-4 h-4 mr-2" />
          Filters
          {hasActiveFilters && (
            <Badge className="ml-2 bg-purple-600 text-white text-xs">
              {[filters.status, ...(filters.tags || [])].filter(Boolean).length}
            </Badge>
          )}
        </Button>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            onClick={handleClearFilters}
            className="text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4 mr-2" />
            Clear
          </Button>
        )}
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-lg text-white">Filter Projects</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Status Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Status</label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
                    >
                      {currentStatus?.label || 'All Status'}
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full bg-gray-800 border-gray-700">
                    {statusOptions.map((option) => (
                      <DropdownMenuItem
                        key={option.value}
                        onClick={() => handleStatusChange(option.value)}
                        className="text-white hover:bg-gray-700 cursor-pointer"
                      >
                        {option.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Sort Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Sort By</label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
                    >
                      {currentSort?.label || 'Created Date (Newest)'}
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full bg-gray-800 border-gray-700">
                    {sortOptions.map((option) => (
                      <DropdownMenuItem
                        key={option.value}
                        onClick={() => handleSortChange(option.value)}
                        className="text-white hover:bg-gray-700 cursor-pointer"
                      >
                        {option.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Tags Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Tags</label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add tag..."
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                    className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                  />
                  <Button
                    onClick={handleAddTag}
                    disabled={!tagInput.trim()}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Tag className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Selected Tags */}
            {filters.tags && filters.tags.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Selected Tags</label>
                <div className="flex flex-wrap gap-2">
                  {filters.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="bg-purple-600/20 text-purple-300 border-purple-500/30"
                    >
                      {tag}
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-2 hover:text-red-300"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
