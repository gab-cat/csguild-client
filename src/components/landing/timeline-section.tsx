"use client"

import { motion, useInView } from "framer-motion"
import { Calendar, Users, Trophy, Rocket, Building, Globe, Code } from "lucide-react"
import { useRef } from "react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

export function TimelineSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

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

  return (
    <section id="timeline" className="relative h-screen overflow-hidden bg-transparent" ref={ref}>
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

      {/* Scrollable Content Area */}
      <div 
        className="absolute inset-0 overflow-y-auto z-30 scrollbar-hide"
        style={{ 
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
        {/* Ensure content has enough height to scroll */}
        <div className="min-h-[250vh] relative">
          <div className="container mx-auto px-4 relative z-10 pt-20 pb-20">
            {/* Header Section */}
            <motion.div 
              className="text-center mb-16"
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

            {/* Timeline with Curved Path */}
            <div className="relative max-w-7xl mx-auto">
              {/* Curved Timeline Path */}
              <motion.div
                className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full"
                initial={{ opacity: 0, scaleY: 0 }}
                animate={isInView ? { opacity: 1, scaleY: 1 } : { opacity: 0, scaleY: 0 }}
                transition={{ duration: 1.5, delay: 1 }}
              >
                <div className="w-full h-full bg-gradient-to-b from-pink-500/40 via-violet-500/50 to-purple-500/40 rounded-full relative">
                  {/* Pulsing dots along the line */}
                  {timelineEvents.map((_, index) => (
                    <motion.div
                      key={index}
                      className="absolute w-4 h-4 bg-gradient-to-r from-pink-500 to-violet-500 rounded-full left-1/2 transform -translate-x-1/2 shadow-lg"
                      style={{ top: `${(index * 100) / (timelineEvents.length - 1)}%` }}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
                      transition={{ duration: 0.4, delay: 1.8 + index * 0.2 }}
                    />
                  ))}
                </div>
              </motion.div>

              {/* Timeline Cards */}
              <div className="space-y-24">
                {timelineEvents.map((event, index) => (
                  <motion.div
                    key={index}
                    className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'} gap-8 md:gap-16`}
                    initial={{ 
                      opacity: 0, 
                      x: index % 2 === 0 ? -100 : 100,
                      scale: 0.8
                    }}
                    animate={isInView ? { 
                      opacity: 1, 
                      x: 0,
                      scale: 1
                    } : { 
                      opacity: 0, 
                      x: index % 2 === 0 ? -100 : 100,
                      scale: 0.8
                    }}
                    transition={{ 
                      duration: 0.8, 
                      delay: 1.5 + index * 0.2,
                      ease: "easeOut"
                    }}
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
                      <Card className="bg-gradient-to-br from-pink-900/20 to-violet-900/20 border border-pink-500/20 backdrop-blur-sm hover:from-pink-900/30 hover:to-violet-900/30 hover:border-pink-400/30 group relative overflow-hidden h-full transition-all duration-300">
                        <CardContent className="p-4 py-0">
                          {/* Animated Background Effects */}
                          <motion.div 
                            className={`absolute inset-0 bg-gradient-to-br ${event.color} opacity-5 rounded-xl`}
                            animate={{ 
                              scale: [1, 1.05, 1],
                              opacity: [0.05, 0.1, 0.05]
                            }}
                            transition={{ 
                              duration: 4, 
                              repeat: Infinity, 
                              ease: "easeInOut" 
                            }}
                          />

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
                ))}
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
