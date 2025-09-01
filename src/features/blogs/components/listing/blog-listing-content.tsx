'use client'

import { Loader2, Search, Plus, BookOpen } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'

import type { BlogCardType } from '../../types'

import { BlogItem } from './blog-item'

interface BlogListingContentProps {
  blogs: BlogCardType[]
  activeTab: 'all' | 'featured' | 'trending' | 'popular'
  isLoading: boolean
  isError: boolean
  error?: Error | null
  currentPage: number
  totalItems: number
  itemsPerPage: number
  onPageChange: (page: number) => void
  onCreateBlog?: () => void
  onBookmark?: (blogId: string) => void
  onShare?: (blogId: string) => void
}

export function BlogListingContent({
  blogs,
  activeTab,
  isLoading,
  isError,
  error,
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  onCreateBlog,
  onBookmark,
  onShare,
}: BlogListingContentProps) {
  const router = useRouter()

  const handleCreateBlog = () => {
    if (onCreateBlog) {
      onCreateBlog()
    } else {
      router.push('/blogs/create')
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
        <span className="ml-2 text-gray-400">Loading blogs...</span>
      </div>
    )
  }

  // Error state
  if (isError) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 mx-auto bg-red-500/10 rounded-full flex items-center justify-center">
            <Search className="h-8 w-8 text-red-400" />
          </div>
          <h3 className="text-lg font-semibold text-red-400">Failed to load blogs</h3>
          <p className="text-gray-400">
            {error?.message || 'An unexpected error occurred while loading blogs.'}
          </p>
          <Button 
            variant="outline" 
            onClick={() => window.location.reload()}
            className="border-red-500/20 text-red-400 hover:bg-red-500/10"
          >
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  // Empty state
  if (blogs.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="max-w-lg mx-auto space-y-6">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center">
            <BookOpen className="h-12 w-12 text-gray-400" />
          </div>
          
          <h3 className="text-2xl font-semibold text-white">
            No {activeTab === 'all' ? '' : activeTab} blogs yet
          </h3>
          <p className="text-gray-400 text-lg">
            Be the first to create a blog in our community!
          </p>
          <Button 
            onClick={handleCreateBlog}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            <Plus className="h-5 w-5 mr-2" />
            Write Your First Blog
          </Button>
        </div>
      </div>
    )
  }

  const totalPages = Math.ceil(totalItems / itemsPerPage)

  return (
    <div className="space-y-6">
      {/* Blog listing */}
      <div className="space-y-0">
        {blogs.map((blog, index) => (
          <BlogItem 
            key={blog.id} 
            blog={blog} 
            index={index}
            isFeatured={index === 0 && activeTab === 'all'}
            onBookmark={onBookmark}
            onShare={onShare}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalItems > itemsPerPage && (
        <div className="mt-12 flex justify-center">
          <div className="flex items-center gap-2">
            {currentPage > 1 && (
              <Button 
                variant="outline" 
                onClick={() => onPageChange(currentPage - 1)}
                className="border-gray-700 text-gray-400 hover:border-purple-500 hover:text-purple-400"
              >
                Previous
              </Button>
            )}
            
            <span className="text-gray-400 px-4">
              Page {currentPage} of {totalPages}
            </span>
            
            {currentPage < totalPages && (
              <Button 
                variant="outline" 
                onClick={() => onPageChange(currentPage + 1)}
                className="border-gray-700 text-gray-400 hover:border-purple-500 hover:text-purple-400"
              >
                Next
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
