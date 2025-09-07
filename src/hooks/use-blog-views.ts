import { useEffect, useState, useCallback } from 'react'

interface ViewedBlog {
  slug: string
  viewedAt: number
  sessionId: string
}

interface UseBlogViewsReturn {
  hasViewed: (slug: string) => boolean
  markAsViewed: (slug: string) => void
  clearOldViews: () => void
  getViewedBlogs: () => ViewedBlog[]
}

const STORAGE_KEY = 'viewed_blogs'
const SESSION_KEY = 'blog_view_session'
const VIEW_EXPIRY_HOURS = 24

export function useBlogViews(): UseBlogViewsReturn {
  const [viewedBlogs, setViewedBlogs] = useState<ViewedBlog[]>([])
  const [sessionId] = useState(() => {
    // Get or create session ID
    let session = sessionStorage.getItem(SESSION_KEY)
    if (!session) {
      session = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      sessionStorage.setItem(SESSION_KEY, session)
    }
    return session
  })

  // Load viewed blogs from localStorage on mount
  useEffect(() => {
    const loadViewedBlogs = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
          const parsed: ViewedBlog[] = JSON.parse(stored)
          // Filter out expired views and different sessions
          const validViews = parsed.filter(view => {
            const isExpired = Date.now() - view.viewedAt > (VIEW_EXPIRY_HOURS * 60 * 60 * 1000)
            const isCurrentSession = view.sessionId === sessionId
            return !isExpired && isCurrentSession
          })

          // Update storage if we filtered out any views
          if (validViews.length !== parsed.length) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(validViews))
          }

          setViewedBlogs(validViews)
        }
      } catch (error) {
        console.error('Error loading viewed blogs from localStorage:', error)
        // Clear corrupted data
        localStorage.removeItem(STORAGE_KEY)
      }
    }

    loadViewedBlogs()
  }, [sessionId])

  const hasViewed = useCallback((slug: string): boolean => {
    return viewedBlogs.some(blog => blog.slug === slug)
  }, [viewedBlogs])

  const markAsViewed = useCallback((slug: string) => {
    const newView: ViewedBlog = {
      slug,
      viewedAt: Date.now(),
      sessionId,
    }

    setViewedBlogs(prev => {
      // Remove any existing view for this slug
      const filtered = prev.filter(blog => blog.slug !== slug)
      const updated = [...filtered, newView]

      // Save to localStorage
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      } catch (error) {
        console.error('Error saving viewed blogs to localStorage:', error)
      }

      return updated
    })
  }, [sessionId])

  const clearOldViews = useCallback(() => {
    const now = Date.now()
    const cutoff = now - (VIEW_EXPIRY_HOURS * 60 * 60 * 1000)

    setViewedBlogs(prev => {
      const filtered = prev.filter(view => view.viewedAt > cutoff)

      // Save filtered views to localStorage
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
      } catch (error) {
        console.error('Error saving filtered viewed blogs to localStorage:', error)
      }

      return filtered
    })
  }, [])

  const getViewedBlogs = useCallback((): ViewedBlog[] => {
    return [...viewedBlogs]
  }, [viewedBlogs])

  return {
    hasViewed,
    markAsViewed,
    clearOldViews,
    getViewedBlogs,
  }
}
