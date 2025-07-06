"use client"

import { motion, useMotionValue, useSpring } from "framer-motion"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"

export function TargetCursor() {
  const [isVisible, setIsVisible] = useState(false)
  const [isClicking, setIsClicking] = useState(false)
  const [isRightClicking, setIsRightClicking] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [isDoubleClick, setIsDoubleClick] = useState(false)
  const [isFiring, setIsFiring] = useState(false)
  
  // Refs for tracking state without causing re-renders
  const isDraggingRef = useRef(false)
  const isClickingRef = useRef(false)
  const firingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const rightClickTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const doubleClickTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  
  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)
  
  // Optimized spring config - reduced calculations
  const springConfig = { damping: 20, stiffness: 800, mass: 0.1 }
  const cursorXSpring = useSpring(cursorX, springConfig)
  const cursorYSpring = useSpring(cursorY, springConfig)

  // Memoized handlers to prevent recreating functions on each render
  const moveCursor = useCallback((e: MouseEvent) => {
    // Use requestAnimationFrame to throttle updates
    requestAnimationFrame(() => {
      cursorX.set(e.clientX - 16)
      cursorY.set(e.clientY - 16)
      if (!isVisible) setIsVisible(true)
    })
  }, [cursorX, cursorY, isVisible])

  const hideCursor = useCallback(() => setIsVisible(false), [])

  const handleMouseDown = useCallback((e: MouseEvent) => {
    if (e.button === 0) { // Left click
      isClickingRef.current = true
      setIsClicking(true)
      
      // Clear any existing timeout
      if (firingTimeoutRef.current) {
        clearTimeout(firingTimeoutRef.current)
      }
      
      setIsFiring(true)
      firingTimeoutRef.current = setTimeout(() => {
        setIsFiring(false)
        firingTimeoutRef.current = null
      }, 400)
    } else if (e.button === 2) { // Right click
      setIsRightClicking(true)
    }
  }, [])

  const handleMouseUp = useCallback((e: MouseEvent) => {
    if (e.button === 0) { // Left click release
      isClickingRef.current = false
      isDraggingRef.current = false
      setIsClicking(false)
      setIsDragging(false)
    } else if (e.button === 2) { // Right click release
      setIsRightClicking(false)
    }
  }, [])

  const handleContextMenu = useCallback((e: MouseEvent) => {
    e.preventDefault()
    setIsRightClicking(true)
    
    if (rightClickTimeoutRef.current) {
      clearTimeout(rightClickTimeoutRef.current)
    }
    
    rightClickTimeoutRef.current = setTimeout(() => {
      setIsRightClicking(false)
      rightClickTimeoutRef.current = null
    }, 200)
  }, [])

  const handleDoubleClick = useCallback(() => {
    setIsDoubleClick(true)
    
    if (doubleClickTimeoutRef.current) {
      clearTimeout(doubleClickTimeoutRef.current)
    }
    
    doubleClickTimeoutRef.current = setTimeout(() => {
      setIsDoubleClick(false)
      doubleClickTimeoutRef.current = null
    }, 300)
  }, [])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    moveCursor(e)
    
    // Use refs to avoid state dependency
    if (isClickingRef.current && !isDraggingRef.current) {
      isDraggingRef.current = true
      setIsDragging(true)
    }
  }, [moveCursor])

  useEffect(() => {
    // Hide the default cursor when component mounts
    document.body.style.cursor = 'none'
    
    // Use passive listeners for better performance
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    window.addEventListener('mouseleave', hideCursor, { passive: true })
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)
    window.addEventListener('contextmenu', handleContextMenu)
    window.addEventListener('dblclick', handleDoubleClick, { passive: true })

    return () => {
      // Cleanup timeouts
      if (firingTimeoutRef.current) clearTimeout(firingTimeoutRef.current)
      if (rightClickTimeoutRef.current) clearTimeout(rightClickTimeoutRef.current)
      if (doubleClickTimeoutRef.current) clearTimeout(doubleClickTimeoutRef.current)
      
      // Restore the default cursor when component unmounts
      document.body.style.cursor = 'auto'
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', hideCursor)
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
      window.removeEventListener('contextmenu', handleContextMenu)
      window.removeEventListener('dblclick', handleDoubleClick)
    }
  }, [handleMouseMove, hideCursor, handleMouseDown, handleMouseUp, handleContextMenu, handleDoubleClick])

  // Memoized animation values to prevent recalculation
  const scale = useMemo(() => {
    if (isDoubleClick) return 1.8
    if (isRightClicking) return 1.4
    if (isDragging) return 1.2
    if (isClicking) return 0.8
    return 1
  }, [isDoubleClick, isRightClicking, isDragging, isClicking])

  const rotationDuration = useMemo(() => {
    if (isDragging) return 1
    if (isClicking) return 2
    if (isRightClicking) return 6
    return 4
  }, [isDragging, isClicking, isRightClicking])

  const borderColor = useMemo(() => {
    if (isRightClicking) return 'border-red-400'
    if (isDragging) return 'border-green-400'
    if (isDoubleClick) return 'border-yellow-400'
    return 'border-pink-400'
  }, [isRightClicking, isDragging, isDoubleClick])

  const bgColor = useMemo(() => {
    if (isRightClicking) return 'bg-red-400'
    if (isDragging) return 'bg-green-400'
    if (isDoubleClick) return 'bg-yellow-400'
    return 'bg-pink-400'
  }, [isRightClicking, isDragging, isDoubleClick])

  // Memoized blast particles to prevent recreation
  const blastParticles = useMemo(() => 
    Array.from({ length: 8 }, (_, i) => {
      const angle = (i * 45) * (Math.PI / 180)
      const distance = 40
      const x = Math.cos(angle) * distance
      const y = Math.sin(angle) * distance
      
      return { x, y, delay: i * 0.02 }
    }), [])

  const smallParticles = useMemo(() =>
    Array.from({ length: 12 }, (_, i) => {
      const angle = (i * 30) * (Math.PI / 180)
      const distance = 20 + Math.random() * 20
      const x = Math.cos(angle) * distance
      const y = Math.sin(angle) * distance
      
      return { x, y, delay: Math.random() * 0.1 }
    }), [])

  return (
    <motion.div
      className="fixed top-0 left-0 w-8 h-8 pointer-events-none z-50 mix-blend-difference"
      style={{
        x: cursorXSpring,
        y: cursorYSpring,
      }}
      animate={{
        opacity: isVisible ? 1 : 0,
        scale: isVisible ? scale : 0,
      }}
      transition={{ 
        duration: 0.05,
        scale: { duration: 0.1, ease: "easeOut" }
      }}
    >
      <div className="relative w-full h-full">
        {/* Blast/Firing Effect */}
        {isFiring && (
          <>
            {/* Central flash */}
            <motion.div
              className="absolute inset-0 bg-pink-400 rounded-full"
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 3, opacity: 0 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
            />
            
            {/* Blast particles */}
            {blastParticles.map((particle: { x: number; y: number; delay: number }, i: number) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-pink-400"
                style={{
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)'
                }}
                initial={{ 
                  x: 0, 
                  y: 0, 
                  scale: 1, 
                  opacity: 1 
                }}
                animate={{ 
                  x: particle.x, 
                  y: particle.y, 
                  scale: 0, 
                  opacity: 0 
                }}
                transition={{ 
                  duration: 0.3, 
                  delay: particle.delay,
                  ease: "easeOut" 
                }}
              />
            ))}
            
            {/* Secondary explosion ring */}
            <motion.div
              className="absolute inset-0 border-2 border-pink-400"
              initial={{ scale: 0.5, opacity: 1, rotate: 0 }}
              animate={{ scale: 4, opacity: 0, rotate: 180 }}
              transition={{ duration: 0.25, ease: "easeOut", delay: 0.05 }}
            />
            
            {/* Shockwave */}
            <motion.div
              className="absolute inset-0 border border-pink-400/50 rounded-full"
              initial={{ scale: 0, opacity: 0.8 }}
              animate={{ scale: 6, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
            
            {/* Additional smaller particles */}
            {smallParticles.map((particle: { x: number; y: number; delay: number }, i: number) => (
              <motion.div
                key={`small-${i}`}
                className="absolute w-0.5 h-0.5 bg-pink-400"
                style={{
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)'
                }}
                initial={{ 
                  x: 0, 
                  y: 0, 
                  scale: 1, 
                  opacity: 0.8 
                }}
                animate={{ 
                  x: particle.x, 
                  y: particle.y, 
                  scale: 0, 
                  opacity: 0 
                }}
                transition={{ 
                  duration: 0.4, 
                  delay: particle.delay,
                  ease: "easeOut" 
                }}
              />
            ))}
          </>
        )}

        {/* Square target with edge strokes only */}
        <motion.div
          className={`absolute inset-0 border-2 ${borderColor}`}
          animate={{ rotate: 360 }}
          transition={{ 
            duration: rotationDuration, 
            repeat: Infinity, 
            ease: "linear" 
          }}
        />
        
        {/* Pulse effect for double click */}
        {isDoubleClick && (
          <motion.div
            className="absolute inset-0 border-2 border-yellow-400"
            initial={{ scale: 1, opacity: 1 }}
            animate={{ scale: 2.5, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
        )}
        
        {/* Click ripple effect */}
        {isClicking && (
          <motion.div
            className="absolute inset-0 border border-pink-400 rounded-full"
            initial={{ scale: 0.5, opacity: 1 }}
            animate={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          />
        )}
        
        {/* Corner indicators for better targeting */}
        <div className="absolute inset-0">
          {/* Top-left corner */}
          <motion.div 
            className="absolute top-0 left-0 w-2 h-2"
            animate={{ 
              scale: isClicking ? 0.5 : 1,
              rotate: isDragging ? 45 : 0 
            }}
            transition={{ duration: 0.1 }}
          >
            <div className={`w-full h-0.5 ${bgColor}`} />
            <div className={`w-0.5 h-full ${bgColor}`} />
          </motion.div>
          
          {/* Top-right corner */}
          <motion.div 
            className="absolute top-0 right-0 w-2 h-2"
            animate={{ 
              scale: isClicking ? 0.5 : 1,
              rotate: isDragging ? -45 : 0 
            }}
            transition={{ duration: 0.1 }}
          >
            <div className={`w-full h-0.5 ${bgColor}`} />
            <div className={`absolute right-0 w-0.5 h-full ${bgColor}`} />
          </motion.div>
          
          {/* Bottom-left corner */}
          <motion.div 
            className="absolute bottom-0 left-0 w-2 h-2"
            animate={{ 
              scale: isClicking ? 0.5 : 1,
              rotate: isDragging ? -45 : 0 
            }}
            transition={{ duration: 0.1 }}
          >
            <div className={`absolute bottom-0 w-full h-0.5 ${bgColor}`} />
            <div className={`w-0.5 h-full ${bgColor}`} />
          </motion.div>
          
          {/* Bottom-right corner */}
          <motion.div 
            className="absolute bottom-0 right-0 w-2 h-2"
            animate={{ 
              scale: isClicking ? 0.5 : 1,
              rotate: isDragging ? 45 : 0 
            }}
            transition={{ duration: 0.1 }}
          >
            <div className={`absolute bottom-0 w-full h-0.5 ${bgColor}`} />
            <div className={`absolute right-0 w-0.5 h-full ${bgColor}`} />
          </motion.div>
        </div>
        
        {/* Center crosshairs */}
        <motion.div 
          className="absolute inset-0 flex items-center justify-center"
          animate={{ 
            scale: isClicking ? 0.6 : 1,
            rotate: isDragging ? 45 : 0 
          }}
          transition={{ duration: 0.1 }}
        >
          <div className={`w-3 h-0.5 absolute ${bgColor}`} />
          <div className={`h-3 w-0.5 absolute ${bgColor}`} />
        </motion.div>
        
        {/* Center dot */}
        <motion.div 
          className={`absolute top-1/2 left-1/2 w-1 h-1 transform -translate-x-1/2 -translate-y-1/2 ${bgColor}`}
          animate={{ 
            scale: isClicking ? 2 : isDoubleClick ? 3 : 1 
          }}
          transition={{ duration: 0.1 }}
        />
      </div>
    </motion.div>
  )
}
