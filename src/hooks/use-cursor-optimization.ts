import { useCallback, useRef, useEffect, useState } from 'react'

/**
 * Custom hook for optimized mouse tracking
 * Uses requestAnimationFrame for throttling and refs for performance
 */
export function useOptimizedMouseTracking() {
  const rafRef = useRef<number | null>(null)
  const lastPositionRef = useRef({ x: 0, y: 0 })

  const throttledMouseMove = useCallback((callback: (x: number, y: number) => void) => {
    return (e: MouseEvent) => {
      // Cancel previous frame if it's still pending
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }

      rafRef.current = requestAnimationFrame(() => {
        const newX = e.clientX
        const newY = e.clientY
        
        // Only update if position actually changed (avoid unnecessary updates)
        if (
          lastPositionRef.current.x !== newX || 
          lastPositionRef.current.y !== newY
        ) {
          lastPositionRef.current = { x: newX, y: newY }
          callback(newX, newY)
        }
      })
    }
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [])

  return { throttledMouseMove }
}

/**
 * Custom hook for managing timeouts efficiently
 */
export function useTimeoutManager() {
  const timeoutsRef = useRef<Map<string, NodeJS.Timeout>>(new Map())

  const setManagedTimeout = useCallback((
    key: string, 
    callback: () => void, 
    delay: number
  ) => {
    // Clear existing timeout with the same key
    const existingTimeout = timeoutsRef.current.get(key)
    if (existingTimeout) {
      clearTimeout(existingTimeout)
    }

    // Set new timeout
    const timeout = setTimeout(() => {
      callback()
      timeoutsRef.current.delete(key)
    }, delay)

    timeoutsRef.current.set(key, timeout)
  }, [])

  const clearManagedTimeout = useCallback((key: string) => {
    const timeout = timeoutsRef.current.get(key)
    if (timeout) {
      clearTimeout(timeout)
      timeoutsRef.current.delete(key)
    }
  }, [])

  const clearAllTimeouts = useCallback(() => {
    timeoutsRef.current.forEach((timeout) => clearTimeout(timeout))
    timeoutsRef.current.clear()
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearAllTimeouts()
    }
  }, [clearAllTimeouts])

  return { setManagedTimeout, clearManagedTimeout, clearAllTimeouts }
}

/**
 * Debounced state hook to prevent excessive re-renders
 */
export function useDebouncedState<T>(initialValue: T, delay: number = 100) {
  const [value, setValue] = useState(initialValue)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const debouncedSetValue = useCallback((newValue: T) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      setValue(newValue)
      timeoutRef.current = null
    }, delay)
  }, [delay])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return [value, debouncedSetValue] as const
}
