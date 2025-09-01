'use client'

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRouter } from 'next/navigation'
import { useState, useCallback, useMemo } from 'react'

import { useDebounce } from '@/hooks/use-debounce'

import type { 
  BlogFiltersType, 
  BlogCardType
} from '../types'

// Hook for managing blog filters with URL state
export function useBlogFilters(initialFilters: BlogFiltersType = {}) {
  const router = useRouter()
  const [filters, setFilters] = useState<BlogFiltersType>(initialFilters)
  
  const updateFilters = useCallback((newFilters: Partial<BlogFiltersType>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
    
    // Update URL params
    const params = new URLSearchParams()
    Object.entries({ ...filters, ...newFilters }).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          params.set(key, value.join(','))
        } else {
          params.set(key, String(value))
        }
      }
    })
    
    const queryString = params.toString()
    router.push(`?${queryString}`, { scroll: false })
  }, [filters, router])
  
  const resetFilters = useCallback(() => {
    setFilters(initialFilters)
    router.push('?', { scroll: false })
  }, [initialFilters, router])
  
  const clearFilter = useCallback((filterKey: keyof BlogFiltersType) => {
    const newFilters = { ...filters }
    delete newFilters[filterKey]
    setFilters(newFilters)
    
    const params = new URLSearchParams()
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          params.set(key, value.join(','))
        } else {
          params.set(key, String(value))
        }
      }
    })
    
    const queryString = params.toString()
    router.push(`?${queryString}`, { scroll: false })
  }, [filters, router])
  
  return {
    filters,
    updateFilters,
    resetFilters,
    clearFilter,
    hasActiveFilters: Object.keys(filters).length > 0
  }
}

// Hook for blog search with debounced query
export function useBlogSearch(initialQuery = '') {
  const [query, setQuery] = useState(initialQuery)
  const [isSearching, setIsSearching] = useState(false)
  const debouncedQuery = useDebounce(query, 500)
  
  const handleSearch = useCallback((searchQuery: string) => {
    setQuery(searchQuery)
    setIsSearching(searchQuery.length > 0)
  }, [])
  
  const clearSearch = useCallback(() => {
    setQuery('')
    setIsSearching(false)
  }, [])
  
  return {
    query,
    debouncedQuery,
    isSearching,
    handleSearch,
    clearSearch,
  }
}

// Hook for managing blog draft state
export function useBlogDraft(initialData?: Partial<BlogCardType>) {
  const [draftData, setDraftData] = useState(initialData || {})
  const [isDirty, setIsDirty] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  
  const updateDraft = useCallback((updates: Partial<BlogCardType>) => {
    setDraftData(prev => ({ ...prev, ...updates }))
    setIsDirty(true)
  }, [])
  
  const saveDraft = useCallback(() => {
    // Here you would typically save to localStorage or API
    localStorage.setItem('blog-draft', JSON.stringify(draftData))
    setIsDirty(false)
    setLastSaved(new Date())
  }, [draftData])
  
  const loadDraft = useCallback(() => {
    const saved = localStorage.getItem('blog-draft')
    if (saved) {
      try {
        const parsedData = JSON.parse(saved)
        setDraftData(parsedData)
        setIsDirty(false)
      } catch (error) {
        console.error('Failed to load draft:', error)
      }
    }
  }, [])
  
  const clearDraft = useCallback(() => {
    localStorage.removeItem('blog-draft')
    setDraftData({})
    setIsDirty(false)
    setLastSaved(null)
  }, [])
  
  return {
    draftData,
    isDirty,
    lastSaved,
    updateDraft,
    saveDraft,
    loadDraft,
    clearDraft
  }
}

// Hook for calculating blog analytics and statistics from blog arrays
export function useBlogAnalyticsCalculation(blogs?: BlogCardType[]) {
  const stats = useMemo(() => {
    if (!blogs || blogs.length === 0) {
      return {
        totalBlogs: 0,
        totalViews: 0,
        totalLikes: 0,
        totalComments: 0,
        totalBookmarks: 0,
        draftCount: 0,
        publishedCount: 0,
        avgReadingTime: 0
      }
    }
    
    return {
      totalBlogs: blogs.length,
      totalViews: blogs.reduce((sum: number, blog: BlogCardType) => sum + blog.viewCount, 0),
      totalLikes: blogs.reduce((sum: number, blog: BlogCardType) => sum + blog.likeCount, 0),
      totalComments: blogs.reduce((sum: number, blog: BlogCardType) => sum + blog.commentCount, 0),
      totalBookmarks: blogs.reduce((sum: number, blog: BlogCardType) => sum + blog.bookmarkCount, 0),
      draftCount: blogs.filter((blog: BlogCardType) => blog.status === 'DRAFT').length,
      publishedCount: blogs.filter((blog: BlogCardType) => blog.status === 'PUBLISHED').length,
      avgReadingTime: blogs.reduce((sum: number, blog: BlogCardType) => sum + (blog.readingTime || 0), 0) / blogs.length || 0
    }
  }, [blogs])
  
  return { stats }
}

// Hook for managing blog reading progress
export function useReadingProgress() {
  const [progress, setProgress] = useState(0)
  const [isReading, setIsReading] = useState(false)
  const [readingTime, setReadingTime] = useState(0)
  
  const startReading = useCallback(() => {
    setIsReading(true)
    setReadingTime(0)
  }, [])
  
  const stopReading = useCallback(() => {
    setIsReading(false)
  }, [])
  
  const updateProgress = useCallback((scrollPercentage: number) => {
    setProgress(scrollPercentage)
    if (isReading) {
      setReadingTime(prev => prev + 1) // Increment reading time
    }
  }, [isReading])
  
  return {
    progress,
    isReading,
    readingTime,
    startReading,
    stopReading,
    updateProgress
  }
}

// Hook for managing blog interaction state (likes, bookmarks, etc.)
export function useBlogInteractions(initialState?: {
  isLiked?: boolean
  isBookmarked?: boolean
  likeCount?: number
  bookmarkCount?: number
}) {
  const [interactions, setInteractions] = useState({
    isLiked: initialState?.isLiked || false,
    isBookmarked: initialState?.isBookmarked || false,
    likeCount: initialState?.likeCount || 0,
    bookmarkCount: initialState?.bookmarkCount || 0
  })
  
  const updateInteractions = useCallback((updates: Partial<typeof interactions>) => {
    setInteractions(prev => ({ ...prev, ...updates }))
  }, [])
  
  return {
    interactions,
    updateInteractions
  }
}

// Hook for blog form validation
export function useBlogValidation() {
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  const validateField = useCallback((field: string, value: any) => {
    const fieldErrors: string[] = []
    
    switch (field) {
    case 'title':
      if (!value || value.trim().length === 0) {
        fieldErrors.push('Title is required')
      } else if (value.length > 200) {
        fieldErrors.push('Title must be less than 200 characters')
      }
      break
      
    case 'content':
      if (!value || value.trim().length === 0) {
        fieldErrors.push('Content is required')
      } else if (value.length > 50000) {
        fieldErrors.push('Content must be less than 50,000 characters')
      }
      break
      
    case 'excerpt':
      if (value && value.length > 500) {
        fieldErrors.push('Excerpt must be less than 500 characters')
      }
      break
      
    case 'metaDescription':
      if (value && value.length > 160) {
        fieldErrors.push('Meta description must be less than 160 characters')
      }
      break
      
    default:
      break
    }
    
    setErrors(prev => ({
      ...prev,
      [field]: fieldErrors.length > 0 ? fieldErrors[0] : ''
    }))
    
    return fieldErrors.length === 0
  }, [])
  
  const validateForm = useCallback((formData: any) => {
    const fields = ['title', 'content', 'excerpt', 'metaDescription']
    let isValid = true
    
    fields.forEach(field => {
      const fieldValid = validateField(field, formData[field])
      if (!fieldValid) isValid = false
    })
    
    return isValid
  }, [validateField])
  
  const clearErrors = useCallback(() => {
    setErrors({})
  }, [])
  
  const clearFieldError = useCallback((field: string) => {
    setErrors(prev => ({ ...prev, [field]: '' }))
  }, [])
  
  return {
    errors,
    validateField,
    validateForm,
    clearErrors,
    clearFieldError,
    hasErrors: Object.values(errors).some(error => error.length > 0)
  }
}

// Hook for managing blog categories and tags
export function useBlogTaxonomy() {
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  
  const addTag = useCallback((tag: string) => {
    setSelectedTags(prev => [...new Set([...prev, tag])])
  }, [])
  
  const removeTag = useCallback((tag: string) => {
    setSelectedTags(prev => prev.filter(t => t !== tag))
  }, [])
  
  const addCategory = useCallback((category: string) => {
    setSelectedCategories(prev => [...new Set([...prev, category])])
  }, [])
  
  const removeCategory = useCallback((category: string) => {
    setSelectedCategories(prev => prev.filter(c => c !== category))
  }, [])
  
  const clearAll = useCallback(() => {
    setSelectedTags([])
    setSelectedCategories([])
  }, [])
  
  return {
    selectedTags,
    selectedCategories,
    addTag,
    removeTag,
    addCategory,
    removeCategory,
    clearAll,
    hasSelections: selectedTags.length > 0 || selectedCategories.length > 0
  }
}