/* eslint-disable @typescript-eslint/no-explicit-any */
import type { BlogCardType, BlogDetailResponseDto } from '../types'

// General blog utility functions
export const blogUtils = {
  // Calculate reading time based on word count
  calculateReadingTime(content: string, wordsPerMinute = 200): number {
    const words = content.trim().split(/\s+/).length
    return Math.ceil(words / wordsPerMinute)
  },

  // Generate excerpt from content
  generateExcerpt(content: string, maxLength = 160): string {
    const plainText = content
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/[#*`_~]/g, '') // Remove markdown formatting
      .trim()

    if (plainText.length <= maxLength) {
      return plainText
    }

    return plainText.substring(0, maxLength).trim() + '...'
  },

  // Generate SEO-friendly slug
  generateSlug(title: string): string {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
  },

  // Format blog status for display
  formatStatus(status: string): string {
    switch (status.toUpperCase()) {
    case 'DRAFT':
      return 'Draft'
    case 'PUBLISHED':
      return 'Published'
    case 'PENDING':
      return 'Scheduled'
    case 'ARCHIVED':
      return 'Archived'
    default:
      return status
    }
  },

  // Format moderation status for display
  formatModerationStatus(status: string): string {
    switch (status.toUpperCase()) {
    case 'PENDING':
      return 'Pending Review'
    case 'APPROVED':
      return 'Approved'
    case 'REJECTED':
      return 'Rejected'
    case 'FLAGGED':
      return 'Flagged'
    default:
      return status
    }
  },

  // Get status color for UI display
  getStatusColor(status: string): string {
    switch (status.toUpperCase()) {
    case 'DRAFT':
      return 'gray'
    case 'PUBLISHED':
      return 'green'
    case 'PENDING':
      return 'blue'
    case 'ARCHIVED':
      return 'red'
    default:
      return 'gray'
    }
  },

  // Get moderation status color for UI display
  getModerationStatusColor(status: string): string {
    switch (status.toUpperCase()) {
    case 'PENDING':
      return 'yellow'
    case 'APPROVED':
      return 'green'
    case 'REJECTED':
      return 'red'
    case 'FLAGGED':
      return 'orange'
    default:
      return 'gray'
    }
  },

  // Check if blog can be edited
  canEditBlog(blog: BlogDetailResponseDto, currentUserId?: string): boolean {
    if (!currentUserId) return false
    return blog.author.username === currentUserId && 
           ['DRAFT', 'PENDING'].includes(blog.status.toUpperCase())
  },

  // Check if blog can be published
  canPublishBlog(blog: BlogDetailResponseDto, currentUserId?: string): boolean {
    if (!currentUserId) return false
    return blog.author.username === currentUserId && 
           blog.status.toUpperCase() === 'DRAFT'
  },

  // Check if blog can be deleted
  canDeleteBlog(blog: BlogDetailResponseDto, currentUserId?: string, isAdmin = false): boolean {
    if (!currentUserId) return false
    return isAdmin || (blog.author.username === currentUserId && 
                      ['DRAFT', 'PENDING'].includes(blog.status.toUpperCase()))
  },

  // Format view count for display
  formatViewCount(count: number): string {
    if (count < 1000) return count.toString()
    if (count < 1000000) return `${(count / 1000).toFixed(1)}K`
    return `${(count / 1000000).toFixed(1)}M`
  },

  // Format like count for display
  formatLikeCount(count: number): string {
    return this.formatViewCount(count)
  },

  // Format comment count for display
  formatCommentCount(count: number): string {
    if (count === 0) return 'No comments'
    if (count === 1) return '1 comment'
    return `${count} comments`
  },

  // Get relative time string
  getRelativeTime(dateString: string): string {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return 'Just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`
    if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`
    return `${Math.floor(diffInSeconds / 31536000)} years ago`
  },

  // Format published date
  formatPublishedDate(dateString: string | null): string {
    if (!dateString) return 'Not published'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  },

  // Sort blogs by different criteria
  sortBlogs(blogs: BlogCardType[], sortBy: string, sortOrder: 'asc' | 'desc' = 'desc'): BlogCardType[] {
    const sorted = [...blogs].sort((a, b) => {
      let valueA: any
      let valueB: any

      switch (sortBy) {
      case 'title':
        valueA = a.title.toLowerCase()
        valueB = b.title.toLowerCase()
        break
      case 'viewCount':
        valueA = a.viewCount
        valueB = b.viewCount
        break
      case 'likeCount':
        valueA = a.likeCount
        valueB = b.likeCount
        break
      case 'commentCount':
        valueA = a.commentCount
        valueB = b.commentCount
        break
      case 'publishedAt':
        valueA = new Date(a.publishedAt || a.createdAt)
        valueB = new Date(b.publishedAt || b.createdAt)
        break
      case 'updatedAt':
        valueA = new Date(a.updatedAt)
        valueB = new Date(b.updatedAt)
        break
      default: // createdAt
        valueA = new Date(a.createdAt)
        valueB = new Date(b.createdAt)
        break
      }

      if (valueA < valueB) return sortOrder === 'asc' ? -1 : 1
      if (valueA > valueB) return sortOrder === 'asc' ? 1 : -1
      return 0
    })

    return sorted
  },

  // Filter blogs by search criteria
  filterBlogs(blogs: BlogCardType[], searchTerm: string): BlogCardType[] {
    if (!searchTerm.trim()) return blogs

    const term = searchTerm.toLowerCase()
    return blogs.filter(blog =>
      blog.title.toLowerCase().includes(term) ||
      blog.excerpt?.toLowerCase().includes(term) ||
      blog.author.firstName?.toLowerCase().includes(term) ||
      blog.author.lastName?.toLowerCase().includes(term) ||
      blog.tags.some(tag => tag.name?.toLowerCase().includes(term)) ||
      blog.categories.some(category => category.name?.toLowerCase().includes(term))
    )
  },

  // Get unique tags from blogs
  getUniqueTags(blogs: BlogCardType[]): string[] {
    const tagSet = new Set<string>()
    blogs.forEach(blog => {
      blog.tags.forEach(tag => {
        if (tag.name) tagSet.add(tag.name)
      })
    })
    return Array.from(tagSet).sort()
  },

  // Get unique categories from blogs
  getUniqueCategories(blogs: BlogCardType[]): string[] {
    const categorySet = new Set<string>()
    blogs.forEach(blog => {
      blog.categories.forEach(category => {
        if (category.name) categorySet.add(category.name)
      })
    })
    return Array.from(categorySet).sort()
  },

  // Get unique authors from blogs
  getUniqueAuthors(blogs: BlogCardType[]): Array<{ username: string; name: string }> {
    const authorMap = new Map()
    blogs.forEach(blog => {
      const authorKey = blog.author.username
      if (authorKey && !authorMap.has(authorKey)) {
        authorMap.set(authorKey, {
          username: blog.author.username,
          name: `${blog.author.firstName || ''} ${blog.author.lastName || ''}`.trim()
        })
      }
    })
    return Array.from(authorMap.values()).sort((a, b) => a.name.localeCompare(b.name))
  },

  // Validate blog data
  validateBlogData(data: Partial<BlogCardType>): string[] {
    const errors: string[] = []

    if (!data.title?.trim()) {
      errors.push('Title is required')
    } else if (data.title.length > 200) {
      errors.push('Title must be less than 200 characters')
    }

    if (data.excerpt && data.excerpt.length > 500) {
      errors.push('Excerpt must be less than 500 characters')
    }

    return errors
  }
}
