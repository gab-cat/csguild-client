'use client'

import { Search, Filter, Calendar, User, Tag, ChevronDown, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'

import { AuthGuard } from '@/components/shared/auth-guard'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { useAuthStore } from '@/features/auth/stores/auth-store'

import type { EventFiltersType } from '../../types'
import { CreateEventClient } from '../create/create-event-client'


interface EventFiltersProps {
  filters: EventFiltersType
  onFiltersChange: (filters: EventFiltersType) => void
  availableTags?: string[]
  availableOrganizers?: Array<{ id: string; name: string }>
  className?: string
}

export function EventFilters({
  filters,
  onFiltersChange,
  availableTags = [],
  availableOrganizers = [],
  className,
}: EventFiltersProps) {
  const { isAuthenticated } = useAuthStore()
  const router = useRouter()
  const [isCreateEventModalOpen, setIsCreateEventModalOpen] = React.useState(false)

  const handleCreateButtonClick = React.useCallback(() => {
    if (isAuthenticated){
      router.push('/events/create')
      return
    }
    setIsCreateEventModalOpen(true)
  }, [isAuthenticated, router])

  const handleSearchChange = (value: string) => {
    onFiltersChange({ ...filters, search: value })
  }

  const handleStatusChange = (value: string) => {
    onFiltersChange({
      ...filters,
      status: value === 'all' ? undefined : (value as EventFiltersType['status']),
    })
  }

  const handleOrganizerChange = (value: string) => {
    onFiltersChange({
      ...filters,
      organizerId: value === 'all' ? undefined : value,
    })
  }

  const handleTagToggle = (tag: string) => {
    const currentTags = filters.tags || []
    const updatedTags = currentTags.includes(tag)
      ? currentTags.filter(t => t !== tag)
      : [...currentTags, tag]
    
    onFiltersChange({
      ...filters,
      tags: updatedTags.length > 0 ? updatedTags : undefined,
    })
  }

  const clearFilters = () => {
    onFiltersChange({
      search: '',
      status: undefined,
      organizerId: undefined,
      tags: undefined,
    })
  }

  const hasActiveFilters = Boolean(
    filters.search ||
    filters.status ||
    filters.organizerId ||
    (filters.tags && filters.tags.length > 0)
  )

  const activeFilterCount = [
    filters.search,
    filters.status,
    filters.organizerId,
    filters.tags && filters.tags.length > 0 ? 'tags' : null,
  ].filter(Boolean).length

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search events by title, description, or organizer..."
          value={filters.search || ''}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-9 h-12 bg-gray-900/50 backdrop-blur-sm border-gray-800 focus:border-gray-700/50 focus:ring-purple-500/20 focus:ring-1"
        />
      </div>

      {/* Quick Filters and Create Event Button */}
      <div className="flex items-center gap-3 flex-wrap justify-between">
        <div className="flex items-center gap-3 flex-wrap">
          {/* Status Quick Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-10 bg-gray-900 backdrop-blur-sm border-gray-800 hover:bg-gray-800/50"
              >
                <Calendar className="h-4 w-4 mr-2" />
                {filters.status ? 
                  filters.status.charAt(0).toUpperCase() + filters.status.slice(1) : 
                  'All Events'
                }
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-gray-800/95 backdrop-blur-md border-gray-700/50">
              <DropdownMenuItem className='text-white group hover:text-pink-500 hover:bg-pink-500/10 transition-all cursor-pointer' onClick={() => handleStatusChange('all')}>
                All Events
              </DropdownMenuItem>
              <DropdownMenuItem className='text-white group hover:text-pink-500 hover:bg-pink-500/10 transition-all cursor-pointer' onClick={() => handleStatusChange('upcoming')}>
                <Calendar className="h-4 w-4 mr-2 text-blue-500 group-hover:text-pink-500 transition-all" />
                Upcoming
              </DropdownMenuItem>
              <DropdownMenuItem className='text-white group hover:text-pink-500 hover:bg-pink-500/10 transition-all cursor-pointer' onClick={() => handleStatusChange('ongoing')}>
                <div className="h-4 w-4 mr-2 flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full group-hover:bg-pink-500 transition-all" />
                </div>
                Live Events
              </DropdownMenuItem>
              <DropdownMenuItem className='text-white group hover:text-pink-500 hover:bg-pink-500/10 transition-all cursor-pointer' onClick={() => handleStatusChange('completed')}>
                <Calendar className="h-4 w-4 mr-2 text-gray-400 group-hover:text-pink-500 transition-all" />
                Completed
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Advanced Filters Sheet */}
          <Sheet>
            <SheetTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="relative h-10 bg-gray-900/50 backdrop-blur-sm border-gray-800/50 hover:bg-gray-800/50"
              >
                <Filter className="h-4 w-4 mr-2" />
                More Filters
                {activeFilterCount > 1 && (
                  <Badge
                    variant="destructive"
                    className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                  >
                    {activeFilterCount - 1}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent className="bg-gray-950/95 backdrop-blur-md">
              <SheetHeader>
                <SheetTitle className="text-lg font-semibold">Filter Events</SheetTitle>
                <SheetDescription>
                  Refine your search with advanced filters
                </SheetDescription>
              </SheetHeader>
              
              <div className="space-y-6 mt-6">
                {/* Organizer Filter */}
                {availableOrganizers.length > 0 && (
                  <div className="space-y-3">
                    <Label htmlFor="organizer" className="text-sm font-medium">
                      Organizer
                    </Label>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="outline" 
                          className="w-full justify-start bg-gray-900/50 border-gray-800/50"
                        >
                          <User className="h-4 w-4 mr-2" />
                          {filters.organizerId ? 
                            availableOrganizers.find(o => o.id === filters.organizerId)?.name || 'Unknown' :
                            'All Organizers'
                          }
                          <ChevronDown className="h-4 w-4 ml-auto" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-full bg-gray-900/95 backdrop-blur-md">
                        <DropdownMenuItem onClick={() => handleOrganizerChange('all')}>
                          All Organizers
                        </DropdownMenuItem>
                        {availableOrganizers.map((organizer) => (
                          <DropdownMenuItem 
                            key={organizer.id} 
                            onClick={() => handleOrganizerChange(organizer.id)}
                          >
                            {organizer.name}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}

                {/* Tags Filter */}
                {availableTags.length > 0 && (
                  <div className="space-y-3">
                    <Label className="text-sm font-medium flex items-center">
                      <Tag className="h-4 w-4 mr-2" />
                      Tags
                    </Label>
                    <div className="flex flex-wrap gap-2 max-h-60 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-700">
                      {availableTags.map((tag) => {
                        const isSelected = filters.tags?.includes(tag) || false
                        return (
                          <Badge
                            key={tag}
                            variant={isSelected ? "default" : "outline"}
                            className="cursor-pointer transition-all duration-200 hover:scale-105 bg-gray-900/50 border-gray-800/50"
                            onClick={() => handleTagToggle(tag)}
                          >
                            {tag}
                          </Badge>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Clear Filters */}
                {hasActiveFilters && (
                  <Button
                    variant="outline"
                    onClick={clearFilters}
                    className="w-full bg-gray-900/50 border-gray-800/50 hover:bg-red-900/10 hover:border-red-500/50"
                  >
                    Clear All Filters
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>

          {/* Clear Filters Quick Action */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-gray-400 hover:text-red-400 h-10"
            >
              Clear All
            </Button>
          )}
        </div>

        {/* Create Event Button */}
        <Button 
          onClick={handleCreateButtonClick}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold border-none shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Event
        </Button>

        {/* Create Event Modal with Auth Guard */}
        <Dialog open={isCreateEventModalOpen} onOpenChange={setIsCreateEventModalOpen}>
          <DialogTitle className='sr-only'>Auth Guard</DialogTitle>
          <DialogContent className={`${!isAuthenticated ? 'max-w-2xl bg-transparent border-none shadow-none' : 'max-w-7xl min-w-7xl max-h-[90vh] overflow-y-auto bg-gray-950 border border-gray-800'}`}>
            <AuthGuard 
              title="Authentication Required" 
              description="Please sign in or create an account to create a new event."
            >
              <CreateEventClient />
            </AuthGuard>
          </DialogContent>
        </Dialog>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 flex-wrap p-4 bg-gray-900/20 rounded-lg border border-gray-800/50">
          <span className="text-sm text-gray-400 font-medium">Active filters:</span>
          
          {filters.status && (
            <Badge variant="secondary" className="gap-1 bg-blue-500/20 text-blue-300 border-blue-500/30">
              Status: {filters.status}
              <button
                onClick={() => handleStatusChange('all')}
                className="ml-1 hover:bg-red-500/20 rounded-full p-0.5 transition-colors"
              >
                ×
              </button>
            </Badge>
          )}

          {filters.organizerId && (
            <Badge variant="secondary" className="gap-1 bg-green-500/20 text-green-300 border-green-500/30">
              Organizer: {availableOrganizers.find(o => o.id === filters.organizerId)?.name}
              <button
                onClick={() => handleOrganizerChange('all')}
                className="ml-1 hover:bg-red-500/20 rounded-full p-0.5 transition-colors"
              >
                ×
              </button>
            </Badge>
          )}

          {filters.tags?.map((tag) => (
            <Badge key={tag} variant="secondary" className="gap-1 bg-purple-500/20 text-purple-300 border-purple-500/30">
              {tag}
              <button
                onClick={() => handleTagToggle(tag)}
                className="ml-1 hover:bg-red-500/20 rounded-full p-0.5 transition-colors"
              >
                ×
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}

// Hook for managing event filters
export function useEventFilters(initialFilters: Partial<EventFiltersType> = {}) {
  const [filters, setFilters] = React.useState<EventFiltersType>({
    search: '',
    status: undefined,
    organizerId: undefined,
    tags: undefined,
    ...initialFilters,
  })

  const updateFilters = React.useCallback((newFilters: EventFiltersType) => {
    setFilters(newFilters)
  }, [])

  const resetFilters = React.useCallback(() => {
    setFilters({
      search: '',
      status: undefined,
      organizerId: undefined,
      tags: undefined,
    })
  }, [])

  return {
    filters,
    updateFilters,
    resetFilters,
    hasActiveFilters: Boolean(
      filters.search ||
      filters.status ||
      filters.organizerId ||
      (filters.tags && filters.tags.length > 0)
    ),
  }
}
