import { Filter, X } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'

export interface BlogFilter {
  categories: string[]
  tags: string[]
  sortBy: 'newest' | 'oldest' | 'popular' | 'trending'
  status: 'all' | 'published' | 'draft'
  author?: string
}

interface BlogFiltersProps {
  filters: BlogFilter
  onChange: (filters: BlogFilter) => void
  availableCategories?: Array<{ id: string; name: string }>
  availableTags?: Array<{ id: string; name: string }>
  availableAuthors?: Array<{ id: string; name: string }>
  onClear?: () => void
}

export function BlogFilters({ 
  filters, 
  onChange, 
  availableCategories = [],
  availableTags = [],
  availableAuthors = [],
  onClear 
}: BlogFiltersProps) {
  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    const updatedCategories = checked
      ? [...filters.categories, categoryId]
      : filters.categories.filter(id => id !== categoryId)
    
    onChange({ ...filters, categories: updatedCategories })
  }

  const handleTagChange = (tagId: string, checked: boolean) => {
    const updatedTags = checked
      ? [...filters.tags, tagId]
      : filters.tags.filter(id => id !== tagId)
    
    onChange({ ...filters, tags: updatedTags })
  }

  const handleSortChange = (sortBy: BlogFilter['sortBy']) => {
    onChange({ ...filters, sortBy })
  }

  const handleStatusChange = (status: BlogFilter['status']) => {
    onChange({ ...filters, status })
  }

  const handleAuthorChange = (author: string) => {
    onChange({ ...filters, author: author === 'all' ? undefined : author })
  }

  const activeFiltersCount = 
    filters.categories.length + 
    filters.tags.length + 
    (filters.status !== 'all' ? 1 : 0) + 
    (filters.author ? 1 : 0)

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Sort Dropdown */}
      <Select value={filters.sortBy} onValueChange={handleSortChange}>
        <SelectTrigger className="w-[140px] bg-gray-800/50 border-gray-700 text-white">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent className="bg-gray-800 border-gray-700">
          <SelectItem value="newest" className="text-white hover:bg-gray-700">Newest</SelectItem>
          <SelectItem value="oldest" className="text-white hover:bg-gray-700">Oldest</SelectItem>
          <SelectItem value="popular" className="text-white hover:bg-gray-700">Popular</SelectItem>
          <SelectItem value="trending" className="text-white hover:bg-gray-700">Trending</SelectItem>
        </SelectContent>
      </Select>

      {/* Status Filter */}
      <Select value={filters.status} onValueChange={handleStatusChange}>
        <SelectTrigger className="w-[120px] bg-gray-800/50 border-gray-700 text-white">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent className="bg-gray-800 border-gray-700">
          <SelectItem value="all" className="text-white hover:bg-gray-700">All</SelectItem>
          <SelectItem value="published" className="text-white hover:bg-gray-700">Published</SelectItem>
          <SelectItem value="draft" className="text-white hover:bg-gray-700">Draft</SelectItem>
        </SelectContent>
      </Select>

      {/* Author Filter (if available authors) */}
      {availableAuthors.length > 0 && (
        <Select value={filters.author || 'all'} onValueChange={handleAuthorChange}>
          <SelectTrigger className="w-[140px] bg-gray-800/50 border-gray-700 text-white">
            <SelectValue placeholder="Author" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-700">
            <SelectItem value="all" className="text-white hover:bg-gray-700">All Authors</SelectItem>
            {availableAuthors.map(author => (
              <SelectItem key={author.id} value={author.id} className="text-white hover:bg-gray-700">
                {author.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {/* Advanced Filters Popover */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="gap-2 bg-gray-800/50 border-gray-700 text-white hover:bg-gray-700/50">
            <Filter className="w-4 h-4" />
            Filters
            {activeFiltersCount > 0 && (
              <Badge className="ml-1 px-1 min-w-[1.25rem] h-5 bg-purple-600 text-white">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 bg-gray-900 border-gray-800" align="start">
          <Card className="border-0 shadow-none bg-transparent">
            <CardHeader className="px-0 pb-4">
              <CardTitle className="text-sm font-medium flex items-center justify-between text-white">
                Filter Options
                {activeFiltersCount > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={onClear}
                    className="h-auto p-1 text-xs text-gray-400 hover:text-white hover:bg-gray-700/50"
                  >
                    Clear all
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            
            <CardContent className="px-0 space-y-4">
              {/* Categories */}
              {availableCategories.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2 text-white">Categories</h4>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {availableCategories.map(category => (
                      <div key={category.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`category-${category.id}`}
                          checked={filters.categories.includes(category.id)}
                          onCheckedChange={(checked) => 
                            handleCategoryChange(category.id, checked as boolean)
                          }
                          className="border-gray-600 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                        />
                        <label 
                          htmlFor={`category-${category.id}`}
                          className="text-sm font-normal cursor-pointer text-gray-300"
                        >
                          {category.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {availableCategories.length > 0 && availableTags.length > 0 && (
                <Separator className="bg-gray-700" />
              )}

              {/* Tags */}
              {availableTags.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2 text-white">Tags</h4>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {availableTags.map(tag => (
                      <div key={tag.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`tag-${tag.id}`}
                          checked={filters.tags.includes(tag.id)}
                          onCheckedChange={(checked) => 
                            handleTagChange(tag.id, checked as boolean)
                          }
                          className="border-gray-600 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                        />
                        <label 
                          htmlFor={`tag-${tag.id}`}
                          className="text-sm font-normal cursor-pointer text-gray-300"
                        >
                          {tag.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </PopoverContent>
      </Popover>

      {/* Active Filter Tags */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-1">
          {filters.categories.map(categoryId => {
            const category = availableCategories.find(c => c.id === categoryId)
            return category ? (
              <Badge
                key={categoryId}
                className="gap-1 pr-1 bg-purple-500/20 text-purple-200 hover:bg-purple-500/30 border-purple-500/30"
              >
                {category.name}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCategoryChange(categoryId, false)}
                  className="p-0 w-4 h-4 hover:bg-transparent text-purple-200 hover:text-white"
                >
                  <X className="w-3 h-3" />
                </Button>
              </Badge>
            ) : null
          })}
          
          {filters.tags.map(tagId => {
            const tag = availableTags.find(t => t.id === tagId)
            return tag ? (
              <Badge
                key={tagId}
                variant="outline"
                className="gap-1 pr-1 border-gray-600 text-gray-300 hover:border-purple-500/50"
              >
                {tag.name}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleTagChange(tagId, false)}
                  className="p-0 w-4 h-4 hover:bg-transparent text-gray-300 hover:text-white"
                >
                  <X className="w-3 h-3" />
                </Button>
              </Badge>
            ) : null
          })}
          
          {filters.status !== 'all' && (
            <Badge className="gap-1 pr-1 bg-purple-500/20 text-purple-200 hover:bg-purple-500/30 border-purple-500/30">
              Status: {filters.status}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleStatusChange('all')}
                className="p-0 w-4 h-4 hover:bg-transparent text-purple-200 hover:text-white"
              >
                <X className="w-3 h-3" />
              </Button>
            </Badge>
          )}
          
          {filters.author && (
            <Badge className="gap-1 pr-1 bg-purple-500/20 text-purple-200 hover:bg-purple-500/30 border-purple-500/30">
              Author: {availableAuthors.find(a => a.id === filters.author)?.name}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleAuthorChange('all')}
                className="p-0 w-4 h-4 hover:bg-transparent text-purple-200 hover:text-white"
              >
                <X className="w-3 h-3" />
              </Button>
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}
