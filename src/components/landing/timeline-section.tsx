"use client"

import { motion, useInView } from "framer-motion"
import { Calendar, Users, Trophy, Rocket, Building, Globe, Code, Zap } from "lucide-react"
import { useRef, useState, useEffect } from "react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

export function TimelineSection() {
  const ref = useRef<HTMLElement>(null)
  const scrollableRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const isInView = useInView(ref, { once: true, margin: "75px" })
  
  // Scroll tracking for the timeline section
  const [scrollProgress, setScrollProgress] = useState(0)
  const [activeCardIndex, setActiveCardIndex] = useState(-1)

  const timelineEvents = [
    {
      year: "2019",
      title: "The Spark",
      description: "Founded by passionate CS students who dreamed of building the ultimate programming community",
      icon: Rocket,
      stats: "12 Founders",
      highlight: "Birth of Vision",
      color: "from-pink-500 to-violet-500"
    },
    {
      year: "2020",
      title: "Digital Era",
      description: "Successfully pivoted to virtual events during the pandemic, reaching students globally",
      icon: Globe,
      stats: "50+ Events",
      highlight: "Global Reach",
      color: "from-pink-500 to-violet-500"
    },
    {
      year: "2021",
      title: "1K Members",
      description: "Community explosion as we hit our first major milestone with members worldwide",
      icon: Users,
      stats: "1,000+ Members",
      highlight: "Community Boom",
      color: "from-pink-500 to-violet-500"
    },
    {
      year: "2022",
      title: "Industry Links",
      description: "Partnered with top tech companies, achieving an incredible internship success rate",
      icon: Building,
      stats: "89% Success Rate",
      highlight: "Career Launch",
      color: "from-pink-500 to-violet-500"
    },
    {
      year: "2023",
      title: "Global Award",
      description: "Recognized as the best computer science community by international tech organizations",
      icon: Trophy,
      stats: "5+ Awards",
      highlight: "Excellence",
      color: "from-pink-500 to-violet-500"
    },
    {
      year: "2024",
      title: "10K+ Guild",
      description: "Launched our innovation hub and crossed 10,000 active members building the future",
      icon: Code,
      stats: "10,000+ Members",
      highlight: "Innovation Hub",
      color: "from-pink-500 to-violet-500"
    }
  ]

  // Handle scroll events within the timeline section
  useEffect(() => {
    const scrollableElement = scrollableRef.current
    if (!scrollableElement) return

    const handleScroll = () => {
      const scrollTop = scrollableElement.scrollTop
      const scrollHeight = scrollableElement.scrollHeight - scrollableElement.clientHeight
      const progress = Math.min(scrollTop / scrollHeight, 1)
      setScrollProgress(progress)
      
      // Calculate which card should be active based on scroll progress
      const cardIndex = Math.floor(progress * timelineEvents.length)
      setActiveCardIndex(Math.min(cardIndex, timelineEvents.length - 1))
    }

    scrollableElement.addEventListener('scroll', handleScroll)
    return () => scrollableElement.removeEventListener('scroll', handleScroll)
  }, [timelineEvents.length])

  // Intercept page scroll when timeline section is in view
  useEffect(() => {
    const handleWheelEvent = (e: WheelEvent) => {
      const scrollableElement = scrollableRef.current
      const titleElement = titleRef.current
      if (!scrollableElement || !titleElement) return

      // Check if we're at the timeline section
      const rect = ref.current?.getBoundingClientRect()
      const titleRect = titleElement.getBoundingClientRect()
      if (!rect || !titleRect) return

      // Timeline section bounds
      const sectionTop = rect.top
      const sectionBottom = rect.bottom
      const viewportHeight = window.innerHeight
      
      // Check if title is at the top of the screen (within top 10% of viewport)
      const titleTop = titleRect.top
      const titleBottom = titleRect.bottom
      const titleInTopPart = titleTop <= viewportHeight * 0.1 && titleBottom >= 0
      
      // Check if timeline section is visible
      const isTimelineVisible = sectionTop <= viewportHeight && sectionBottom >= 0
      const isScrollingTowardsTimeline = (sectionTop > 0 && e.deltaY > 0) || (sectionBottom < viewportHeight && e.deltaY < 0)
      
      if (isTimelineVisible || isScrollingTowardsTimeline) {
        const scrollTop = scrollableElement.scrollTop
        const scrollHeight = scrollableElement.scrollHeight - scrollableElement.clientHeight
        
        // Handle scrolling down
        if (e.deltaY > 0) {
          // If title is not yet in the top part, allow normal page scroll
          if (!titleInTopPart) {
            return // Let page scroll continue until title is in top part
          }
          // If title is in top part and internal scroll is not at bottom
          else if (titleInTopPart && scrollTop < scrollHeight - 10) {
            e.preventDefault()
            scrollableElement.scrollTop += e.deltaY * 0.8
          }
          // If at bottom of internal scroll, allow page scroll to continue
        }
        // Handle scrolling up  
        else if (e.deltaY < 0) {
          // If title is not yet in the top part, allow normal page scroll
          if (!titleInTopPart) {
            return // Let page scroll continue until title is in top part
          }
          // If title is in top part and internal scroll is not at top
          else if (titleInTopPart && scrollTop > 10) {
            e.preventDefault()
            scrollableElement.scrollTop += e.deltaY * 0.8
          }
          // If we're past the timeline (section is above viewport) and user scrolls up
          else if (sectionBottom <= 0 && e.deltaY < 0) {
            // Scroll back to position title in top part
            const targetTitleTop = viewportHeight * 0.2 // Position title at 20% from top
            const currentTitleTop = titleRect.top
            const scrollAdjustment = currentTitleTop - targetTitleTop
            const targetScrollPosition = window.pageYOffset + scrollAdjustment
            
            if (targetScrollPosition >= 0) {
              e.preventDefault()
              window.scrollTo(0, targetScrollPosition)
              // Reset timeline internal scroll to bottom so user can scroll up through it
              setTimeout(() => {
                scrollableElement.scrollTop = scrollHeight
              }, 100)
            }
          }
          // If at top of internal scroll, allow page scroll to continue
        }
      }
    }

    window.addEventListener('wheel', handleWheelEvent, { passive: false })
    return () => window.removeEventListener('wheel', handleWheelEvent)
  }, [])

  return (
    <section id="timeline" className="relative h-full overflow-hidden bg-black" ref={ref}>
      {/* Fixed Background Elements - stays in place */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-900/10 via-transparent to-pink-900/10 pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black to-transparent z-40 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent z-40 pointer-events-none" />

      {/* Fixed Floating orbs - stays in place */}
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-32 h-32 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{
            background: `linear-gradient(45deg, ${timelineEvents[i]?.color?.replace('from-', '').replace('to-', '').split(' ')[0] || '#ec4899'}, ${timelineEvents[i]?.color?.replace('from-', '').replace('to-', '').split(' ')[1] || '#8b5cf6'})`,
            left: `${10 + i * 15}%`,
            top: `${20 + (i % 3) * 25}%`,
          }}
          animate={{
            y: [0, -20, 0],
            scale: [1, 1.1, 1],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 4 + i,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.8,
          }}
        />
      ))}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8b5cf6_1px,transparent_1px),linear-gradient(to_bottom,#8b5cf6_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-20" />

      {/* Header Section */}
      <motion.div 
        className="text-center my-16"
        initial={{ opacity: 0, y: -30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -30 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >            <motion.div
          className="mb-6"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-pink-500/20 to-violet-500/20 border border-pink-500/30 backdrop-blur-sm">
            <Calendar className="h-5 w-5 text-pink-400" />
            <span className="font-space-mono text-base text-pink-300">{'// Our Evolution Timeline'}</span>
          </div>
        </motion.div>

        <motion.h2 
          ref={titleRef}
          className="text-5xl md:text-7xl font-bold text-white mb-4 tracking-tighter"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
              The{" "}
          <span className="bg-gradient-to-r from-pink-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
                Journey
          </span>
        </motion.h2>

        <motion.p 
          className="text-gray-300 text-xl max-w-2xl mx-auto leading-relaxed tracking-tight"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
        >
              From a small group of passionate students to a global community of 10,000+ developers
        </motion.p>
      </motion.div>

      {/* Fixed gradient at top of scrollable area */}
      <div className="absolute top-80 left-0 w-full h-32 bg-gradient-to-t from-transparent to-black z-40 pointer-events-none" />
      
      {/* Scrollable Content Area */}
      <div 
        ref={scrollableRef}
        className="absolute top-80 bottom-0 left-0 right-0 overflow-y-auto z-30 scrollbar-hide"
        style={{ 
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
        {/* Ensure content has enough height to scroll */}
        <div className="min-h-[250vh] relative">
          <div className="container mx-auto px-4 relative z-10 pt-20 pb-20">


            {/* Timeline with Curved Path */}
            <div className="relative max-w-7xl mx-auto">
              {/* Enhanced Timeline Path */}
              <motion.div
                className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full"
                initial={{ opacity: 0, scaleY: 0 }}
                animate={isInView ? { opacity: 1, scaleY: 1 } : { opacity: 0, scaleY: 0 }}
                transition={{ duration: 1.5, delay: 1 }}
              >
                {/* Main timeline line with glow effect */}
                <div className="w-full h-full bg-gradient-to-b from-pink-500/40 via-violet-500/50 to-purple-500/40 rounded-full relative">
                  {/* Animated glow effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-b from-pink-400/60 via-violet-400/70 to-purple-400/60 rounded-full blur-sm"
                    animate={{
                      opacity: [0.3, 0.8, 0.3],
                      scale: [1, 1.05, 1],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />

                  {/* Moving Object that travels down the timeline */}
                  <motion.div
                    className="absolute w-6 h-6 left-1/2 transform -translate-x-1/2 z-20"
                    style={{
                      top: `${scrollProgress * 100}%`,
                    }}
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: scrollProgress > 0 ? 1 : 0,
                    }}
                    transition={{
                      scale: { duration: 1, repeat: Infinity, ease: "easeInOut" },
                      opacity: { duration: 0.3 }
                    }}
                  >
                    {/* Outer glow ring */}
                    <motion.div
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-400 to-violet-400 blur-md"
                      animate={{
                        scale: [1, 2, 1],
                        opacity: [0.3, 0.8, 0.3],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                    
                    {/* Core moving object */}
                    <motion.div
                      className="relative w-full h-full rounded-full bg-gradient-to-r from-pink-500 to-violet-500 shadow-lg border-2 border-white/30"
                      animate={{
                        rotate: [0, 360],
                        boxShadow: [
                          "0 0 10px rgba(236, 72, 153, 0.8)",
                          "0 0 25px rgba(139, 92, 246, 0.8)",
                          "0 0 10px rgba(236, 72, 153, 0.8)"
                        ],
                      }}
                      transition={{
                        rotate: { duration: 3, repeat: Infinity, ease: "linear" },
                        boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                      }}
                    >
                      {/* Inner core with icon */}
                      <div className="absolute inset-1 rounded-full bg-gradient-to-r from-pink-600 to-violet-600 flex items-center justify-center">
                        <Zap className="h-3 w-3 text-white" />
                      </div>
                    </motion.div>

                    {/* Trail effect */}
                    <motion.div
                      className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1 bg-gradient-to-b from-pink-400/80 to-transparent rounded-full"
                      style={{
                        height: `${Math.max(0, scrollProgress * 100)}%`,
                        marginTop: '-100%'
                      }}
                      animate={{
                        opacity: scrollProgress > 0 ? [0.5, 1, 0.5] : 0,
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  </motion.div>
                  
                  {/* Pulsing dots along the line with enhanced effects */}
                  {timelineEvents.map((_, index) => (
                    <motion.div
                      key={index}
                      className="absolute w-4 h-4 bg-gradient-to-r from-pink-500 to-violet-500 rounded-full left-1/2 transform -translate-x-1/2 shadow-lg"
                      style={{ top: `${(index * 100) / (timelineEvents.length - 1)}%` }}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
                      transition={{ duration: 0.4, delay: 1.8 + index * 0.2 }}
                      whileHover={{
                        scale: 1.5,
                        boxShadow: "0 0 20px rgba(236, 72, 153, 0.8)",
                        transition: { duration: 0.3 }
                      }}
                    >
                      {/* Pulsing ring effect around dots */}
                      <motion.div
                        className="absolute inset-0 rounded-full border-2 border-pink-400/50"
                        animate={{
                          scale: [1, 1.8, 1],
                          opacity: [0.5, 0, 0.5],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeOut",
                          delay: index * 0.3
                        }}
                      />
                      
                      {/* Inner glow */}
                      <motion.div
                        className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-400 to-violet-400 blur-sm"
                        animate={{
                          opacity: [0.3, 0.8, 0.3],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: index * 0.2
                        }}
                      />
                    </motion.div>
                  ))}
                  
                  {/* Animated particles floating along the timeline */}
                  {Array.from({ length: 8 }).map((_, particleIndex) => (
                    <motion.div
                      key={`particle-${particleIndex}`}
                      className="absolute w-1 h-1 bg-pink-400 rounded-full"
                      style={{
                        left: "50%",
                        top: `${20 + (particleIndex * 10)}%`,
                      }}
                      animate={{
                        y: [0, -100, 0],
                        opacity: [0, 1, 0],
                        scale: [0, 1, 0],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: particleIndex * 0.5
                      }}
                    />
                  ))}
                </div>
              </motion.div>

              {/* Timeline Cards */}
              <div className="space-y-24">
                {timelineEvents.map((event, index) => {
                  const isActive = activeCardIndex === index
                  const isNearActive = Math.abs(activeCardIndex - index) <= 1
                  
                  return (
                    <motion.div
                      key={index}
                      className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'} gap-8 md:gap-16`}
                      initial={{ 
                        opacity: 0, 
                        x: index % 2 === 0 ? -100 : 100,
                        scale: 0.8
                      }}
                      animate={{
                        opacity: isInView ? 1 : 0,
                        x: isInView ? 0 : (index % 2 === 0 ? -100 : 100),
                        scale: isActive ? 1.02 : (isNearActive ? 1.01 : 1),
                      }}
                      transition={{ 
                        duration: 0.8, 
                        delay: 1.5 + index * 0.2,
                        ease: "easeOut"
                      }}
                      whileInView={{
                        opacity: 1,
                        scale: isActive ? 1.02 : 1,
                        transition: { duration: 0.6 }
                      }}
                      viewport={{ once: true, margin: "-100px" }}
                    >
                      {/* Card */}
                      <motion.div
                        className="flex-1 max-w-lg"
                        whileHover={{ 
                          scale: 1.03,
                          y: -5,
                          transition: { duration: 0.3 }
                        }}
                      >
                        <Card className={`bg-gradient-to-br opacity-90 from-pink-900/10 to-violet-900/10 border backdrop-blur-sm group relative overflow-hidden h-full transition-all duration-500 ${
                          isActive 
                            ? 'border-pink-400/40 from-pink-900/20 to-violet-900/20 shadow-lg shadow-pink-500/20' 
                            : isNearActive
                              ? 'border-pink-500/20 from-pink-900/15 to-violet-900/15'
                              : 'border-pink-500/15 hover:from-pink-900/15 hover:to-violet-900/15 hover:border-pink-400/15'
                        }`}>
                          <CardContent className="p-4 py-0">
                            {/* Minimal Dynamic Background Effects */}
                            <motion.div 
                              className={`absolute inset-0 bg-gradient-to-br ${event.color} rounded-xl`}
                              animate={{ 
                                opacity: isActive ? [0.08, 0.15, 0.08] : isNearActive ? [0.05, 0.1, 0.05] : [0.03, 0.06, 0.03]
                              }}
                              transition={{ 
                                duration: isActive ? 2.5 : 4, 
                                repeat: Infinity, 
                                ease: "easeInOut" 
                              }}
                            />

                            {/* Minimal Active Card Border Effect */}
                            {isActive && (
                              <motion.div
                                className="absolute inset-0 rounded-xl border-2 border-pink-400/40"
                                animate={{
                                  borderColor: [
                                    "rgba(244, 114, 182, 0.4)",
                                    "rgba(139, 92, 246, 0.4)",
                                    "rgba(244, 114, 182, 0.4)"
                                  ],
                                }}
                                transition={{
                                  duration: 3,
                                  repeat: Infinity,
                                  ease: "easeInOut"
                                }}
                              />
                            )}

                            {/* Year Badge */}
                            <motion.div 
                              className="mb-6"
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                              transition={{ duration: 0.6, delay: 1.5 + index * 0.2 }}
                            >
                              <div className="flex items-center justify-between mb-4">
                                <Badge 
                                  className={`bg-gradient-to-r ${event.color} text-white font-space-mono text-sm font-bold border-0 px-4 py-2 shadow-lg hover:scale-105 transition-transform`}
                                >
                                  {event.year}
                                </Badge>
                                <span className="text-pink-300 font-space-mono text-sm opacity-80">
                                  {event.highlight}
                                </span>
                              </div>
                            </motion.div>

                            {/* Icon and Title Section */}
                            <motion.div 
                              className="flex items-center gap-4 mb-6"
                              initial={{ opacity: 0, x: -20 }}
                              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                              transition={{ duration: 0.6, delay: 1.7 + index * 0.2 }}
                            >
                              <motion.div 
                                className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${event.color} bg-opacity-20 flex items-center justify-center border border-white/20 shadow-lg group-hover:shadow-xl transition-shadow`}
                                whileHover={{ 
                                  rotate: 360,
                                  scale: 1.1,
                                  transition: { duration: 0.6 }
                                }}
                                animate={isActive ? {
                                  scale: [1, 1.05, 1],
                                  borderColor: [
                                    "rgba(255, 255, 255, 0.2)",
                                    "rgba(244, 114, 182, 0.4)",
                                    "rgba(255, 255, 255, 0.2)"
                                  ]
                                } : {}}
                                transition={isActive ? {
                                  duration: 2,
                                  repeat: Infinity,
                                  ease: "easeInOut"
                                } : {}}
                              >
                                <event.icon className="h-8 w-8 text-white" />
                              </motion.div>
                              <div>
                                <h3 className="tracking-tight text-white font-bold text-2xl leading-tight mb-1 group-hover:text-pink-200 transition-colors">
                                  {event.title}
                                </h3>
                                <div className={`text-transparent tracking-tight bg-clip-text bg-gradient-to-r ${event.color} font-semibold text-lg`}>
                                  {event.stats}
                                </div>
                              </div>
                            </motion.div>

                            {/* Description */}
                            <motion.p 
                              className="text-gray-300 text-base tracking-tight leading-relaxed mb-4 group-hover:text-gray-200 transition-colors"
                              initial={{ opacity: 0 }}
                              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                              transition={{ duration: 0.6, delay: 1.9 + index * 0.2 }}
                            >
                              {event.description}
                            </motion.p>

                            {/* Progress Indicator */}
                            <motion.div 
                              className="p-3 rounded-lg bg-gradient-to-r from-pink-500/10 to-violet-500/10 border border-pink-500/20"
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
                              transition={{ duration: 0.4, delay: 2.1 + index * 0.2 }}
                              whileHover={{ scale: 1.02 }}
                            >
                              <div className="flex items-center gap-2 text-pink-400 font-space-mono text-sm">
                                <event.icon className="h-4 w-4" />
                                <span>Milestone Achievement</span>
                              </div>
                            </motion.div>

                            {/* Decorative elements */}
                            <div className="absolute -top-2 -right-2 w-24 h-24 bg-gradient-to-br from-pink-500/10 to-violet-500/10 rounded-full blur-xl opacity-60 group-hover:opacity-80 transition-opacity" />
                            <div className="absolute -bottom-2 -left-2 w-32 h-32 bg-gradient-to-br from-violet-500/10 to-purple-500/10 rounded-full blur-xl opacity-40 group-hover:opacity-60 transition-opacity" />

                            {/* Connection line to timeline */}
                            <motion.div
                              className={`absolute top-1/2 ${index % 2 === 0 ? '-right-8' : '-left-8'} w-8 h-0.5 bg-gradient-to-r ${event.color} transform -translate-y-1/2 shadow-lg`}
                              initial={{ opacity: 0, scaleX: 0 }}
                              animate={isInView ? { opacity: 1, scaleX: 1 } : { opacity: 0, scaleX: 0 }}
                              transition={{ duration: 0.5, delay: 2.3 + index * 0.2 }}
                            />
                          </CardContent>
                        </Card>
                      </motion.div>

                      {/* Spacer for timeline */}
                      <div className="w-8" />
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </div>
        
          {/* Enhanced ambient effects - moved inside scrollable content */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-violet-900/5 to-transparent pointer-events-none z-0" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8b5cf6_0.5px,transparent_0.5px),linear-gradient(to_bottom,#8b5cf6_0.5px,transparent_0.5px)] bg-[size:8rem_8rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,transparent_60%,#000_100%)] opacity-10 z-0" />
        </div>
      </div>
    </section>
  )
}
