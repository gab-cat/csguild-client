"use client"

import { motion, useInView } from "framer-motion"
import { Star, Quote, Code2 } from "lucide-react"
import { useRef, useState, useEffect } from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

// 3D Carousel Card Component with mouse tracking
interface CarouselCard3DProps {
  children: React.ReactNode
  className?: string
  position: number
  total: number
  isActive: boolean
}

function CarouselCard3D({ children, className = "", position, total, isActive }: CarouselCard3DProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  
  // Calculate 3D position based on carousel position with closer spacing
  const angle = (position / total) * 360
  const radius = 280 // Reduced from 400 to bring cards closer
  const x = Math.sin((angle * Math.PI) / 180) * radius
  const z = Math.cos((angle * Math.PI) / 180) * radius
  const rotateY = 0 // Keep all cards facing front

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || !isActive) return
    
    const card = cardRef.current
    const rect = card.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    
    const mouseX = e.clientX - centerX
    const mouseY = e.clientY - centerY
    
    const rotateXExtra = (mouseY / rect.height) * 10 // Reduced tilt intensity
    const rotateYExtra = (mouseX / rect.width) * 10
    
    card.style.transform = `
      translateX(${x}px) 
      translateZ(${z}px) 
      rotateY(${rotateYExtra}deg) 
      rotateX(${rotateXExtra}deg)
      scale(${isActive ? 1.05 : z > 0 ? 0.95 : 0.9})
    `
  }

  const handleMouseLeave = () => {
    if (!cardRef.current) return
    const card = cardRef.current
    card.style.transform = `
      translateX(${x}px) 
      translateZ(${z}px) 
      rotateY(${rotateY}deg) 
      rotateX(0deg)
      scale(${isActive ? 1.05 : z > 0 ? 0.95 : 0.9})
    `
  }

  return (
    <div
      ref={cardRef}
      className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform-gpu transition-all duration-700 ease-out ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ 
        transformStyle: 'preserve-3d',
        transform: `
          translateX(${x}px) 
          translateZ(${z}px) 
          rotateY(${rotateY}deg)
          scale(${isActive ? 1.05 : z > 0 ? 0.95 : 0.9})
        `,
        zIndex: Math.round(z + 500),
        opacity: z < -150 ? 0.7 : 1, // Reduced distance threshold and increased opacity
      }}
    >
      {children}
    </div>
  )
}

export function CommunitySection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [currentIndex, setCurrentIndex] = useState(0)

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Software Engineer @ Meta",
      avatar: "/placeholder.svg?height=40&width=40",
      content:
        "CS Guild was the game-changer in my career. The mentorship program connected me with a senior engineer who guided me through system design interviews. I landed my dream job at Meta within 6 months!",
      rating: 5,
      tech: ["React", "Python", "System Design"],
      outcome: "Landed dream job at Meta",
      color: "from-blue-500 to-cyan-500",
    },
    {
      name: "Marcus Johnson",
      role: "Senior SWE @ Google",
      avatar: "/placeholder.svg?height=40&width=40",
      content:
        "Started as a CS Guild member struggling with algorithms. The peer learning groups and weekly coding sessions transformed my problem-solving skills. Now I'm a Google engineer mentoring the next generation.",
      rating: 5,
      tech: ["Go", "Algorithms", "Distributed Systems"],
      outcome: "Promoted to Senior Engineer",
      color: "from-green-500 to-emerald-500",
    },
    {
      name: "Priya Patel",
      role: "Full-Stack Developer @ Stripe",
      avatar: "/placeholder.svg?height=40&width=40",
      content:
        "The hackathons and collaborative projects at CS Guild helped me build a portfolio that stood out to recruiters. I went from zero industry experience to landing internships at 3 top companies.",
      rating: 5,
      tech: ["TypeScript", "Node.js", "React"],
      outcome: "3 top company offers",
      color: "from-purple-500 to-violet-500",
    },
    {
      name: "Alex Rivera",
      role: "Tech Lead @ Y Combinator Startup",
      avatar: "/placeholder.svg?height=40&width=40",
      content:
        "CS Guild's industry workshops exposed me to the startup ecosystem. I met my co-founder there, and we built our MVP through the accelerator program. We're now backed by top VCs.",
      rating: 5,
      tech: ["Python", "Machine Learning", "Startup"],
      outcome: "Founded funded startup",
      color: "from-orange-500 to-red-500",
    },
  ]

  // Auto-rotate carousel
  useEffect(() => {
    if (!isInView) return
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 4000) // Rotate every 4 seconds

    return () => clearInterval(interval)
  }, [isInView, testimonials.length])

  const statsVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        staggerChildren: 0.1,
      }
    },
  }

  const statItemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
  }

  return (
    <section id="community" className="py-24 relative bg-black overflow-hidden" ref={ref}>
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-900/10 via-transparent to-pink-900/10 pointer-events-none" />
      
      {/* Floating Orbs - Dynamic Background */}
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{
            width: `${80 + i * 20}px`,
            height: `${80 + i * 20}px`,
            background: `linear-gradient(45deg, ${testimonials[i % testimonials.length]?.color?.replace('from-', '').replace('to-', '').split(' ')[0] || '#ec4899'}, ${testimonials[i % testimonials.length]?.color?.replace('from-', '').replace('to-', '').split(' ')[1] || '#8b5cf6'})`,
            left: `${5 + i * 12}%`,
            top: `${10 + (i % 4) * 20}%`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, 15, 0],
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.4, 0.1],
          }}
          transition={{
            duration: 6 + i * 0.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.8,
          }}
        />
      ))}

      {/* Animated Grid Pattern */}
      <motion.div 
        className="absolute inset-0 bg-[linear-gradient(to_right,#8b5cf6_0.5px,transparent_0.5px),linear-gradient(to_bottom,#8b5cf6_0.5px,transparent_0.5px)] bg-[size:6rem_6rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,transparent_70%,#000_100%)] opacity-10"
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%'],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-pink-500/20 to-violet-500/20 border border-pink-500/30 backdrop-blur-sm mb-6">
              <Quote className="h-4 w-4 text-pink-400" />
              <span className="font-space-mono text-sm text-pink-300">{"// Real stories, real success"}</span>
            </div>
          </motion.div>
          <motion.h2 
            className="text-4xl md:text-5xl font-bold mb-6 text-white tracking-tighter"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Success Stories from{" "}
            <span className="bg-gradient-to-r from-pink-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
              Our Community
            </span>
          </motion.h2>
          <motion.p 
            className="text-lg tracking-tight text-gray-200 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            These aren&apos;t just testimonials – they&apos;re proof that CS Guild works. Every story represents a student who transformed their career trajectory through our community.
          </motion.p>
        </motion.div>

        {/* 3D Carousel Testimonials */}
        <div className="relative h-[600px] max-w-6xl mx-auto mb-16">
          <div 
            className="relative w-full h-full"
            style={{ 
              perspective: '1050px',
              transformStyle: 'preserve-3d'
            }}
          >
            {testimonials.map((testimonial, index) => {
              const position = (index - currentIndex + testimonials.length) % testimonials.length
              const isActive = position === 0
              
              return (
                <CarouselCard3D
                  key={index}
                  position={position}
                  total={testimonials.length}
                  isActive={isActive}
                >
                  <motion.div
                    className="w-[60vw] md:w-80 h-fit backdrop-blur-md shadow-2xl shadow-pink-900/30 rounded-xl"
                    initial={{ opacity: 0 }}
                    animate={{ 
                      opacity: isInView ? 1 : 0,
                    }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Card className="bg-gradient-to-br backdrop-blur-lg from-pink-900/20 to-violet-900/20 border border-pink-500/20 hover:border-pink-400/30 group relative overflow-hidden h-full shadow-2xl hover:shadow-pink-500/20 transition-all duration-500">
                      <CardContent className="md:p-6 relative z-10 h-full flex flex-col">
                        {/* Glossy overlay for 3D effect */}
                        <div className="absolute inset-0 bg-gradient-to-tr backdrop-blur-lg from-transparent via-white/5 to-transparent opacity-0  transition-opacity duration-500 pointer-events-none" />
                        
                        <motion.div 
                          className="absolute top-4 right-4 opacity-20 group-hover:opacity-30 transition-opacity"
                          whileHover={{ rotate: 180, scale: 1.2 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Quote className="h-6 w-6 text-pink-400" />
                        </motion.div>

                        <motion.div 
                          className="flex items-center gap-3 mb-4"
                          initial={{ opacity: 0, x: -20 }}
                          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                          transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                        >
                          <Avatar className="h-10 w-10 border-2 border-pink-500/30 shadow-lg">
                            <AvatarImage src={testimonial.avatar || "/placeholder.svg"} alt={testimonial.name} />
                            <AvatarFallback className="bg-gradient-to-br from-pink-500 to-violet-500 text-white font-semibold text-sm">
                              {testimonial.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-semibold text-white text-sm tracking-tight">{testimonial.name}</h4>
                            <p className="text-xs text-pink-300 font-space-mono tracking-tight">{testimonial.role}</p>
                          </div>
                        </motion.div>

                        <motion.div 
                          className="flex items-center gap-1 mb-3"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                          transition={{ duration: 0.4, delay: 1 + index * 0.1 }}
                        >
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, scale: 0 }}
                              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
                              transition={{ duration: 0.3, delay: 1.2 + index * 0.1 + i * 0.05 }}
                            >
                              <Star className="h-3 w-3 fill-pink-400 text-pink-400 drop-shadow-sm" />
                            </motion.div>
                          ))}
                        </motion.div>

                        <motion.p 
                          className="text-gray-200 leading-relaxed mb-4 text-sm tracking-tight flex-grow"
                          initial={{ opacity: 0 }}
                          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                          transition={{ duration: 0.6, delay: 1.4 + index * 0.1 }}
                        >
                          &quot;{testimonial.content.length > 150 ? testimonial.content.substring(0, 150) + "..." : testimonial.content}&quot;
                        </motion.p>
                        
                        <motion.div 
                          className="p-2 rounded-lg bg-gradient-to-r from-pink-500/10 to-violet-500/10 border border-pink-500/20 mb-3 backdrop-blur-sm shadow-inner"
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.4, delay: 1.6 + index * 0.1 }}
                        >
                          <div className="flex items-center gap-2 text-pink-400 font-space-mono text-xs">
                            <Code2 className="h-3 w-3" />
                            <span className="tracking-tight">{testimonial.outcome}</span>
                          </div>
                        </motion.div>

                        <motion.div 
                          className="flex flex-wrap gap-1"
                          initial={{ opacity: 0, y: 10 }}
                          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                          transition={{ duration: 0.4, delay: 1.8 + index * 0.1 }}
                        >
                          {testimonial.tech.slice(0, 3).map((tech, techIndex) => (
                            <motion.div
                              key={techIndex}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                              transition={{ duration: 0.3, delay: 2 + index * 0.1 + techIndex * 0.05 }}
                              whileHover={{ scale: 1.1 }}
                            >
                              <Badge
                                variant="secondary"
                                className="bg-pink-500/20 text-pink-300 border border-pink-500/30 font-space-mono text-xs py-0 px-2"
                              >
                                {tech}
                              </Badge>
                            </motion.div>
                          ))}
                        </motion.div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </CarouselCard3D>
              )
            })}
          </div>
          
          {/* Carousel Indicators */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'bg-pink-400 scale-125' 
                    : 'bg-pink-400/30 hover:bg-pink-400/50'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Success Metrics */}
        <motion.div 
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
          variants={statsVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {[
            { number: "100+", label: "Students Transformed", desc: "And counting" },
            { number: "97%", label: "Job Placement Rate", desc: "Within 6 months" },
            { number: "$125K", label: "Average Starting Salary", desc: "Above industry average" },
            { number: "500+", label: "Success Stories", desc: "At top companies" },
          ].map((stat, index) => (
            <motion.div 
              key={index} 
              className="text-center group"
              variants={statItemVariants}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <motion.div 
                className="font-space-mono text-3xl font-bold bg-gradient-to-r from-pink-400 to-violet-400 bg-clip-text text-transparent mb-2 group-hover:from-pink-300 group-hover:to-violet-300 transition-all duration-300"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.6, delay: 2.5 + index * 0.1 }}
              >
                {stat.number}
              </motion.div>
              <motion.div 
                className="font-semibold text-white mb-1"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.4, delay: 2.7 + index * 0.1 }}
              >
                {stat.label}
              </motion.div>
              <motion.div 
                className="text-sm text-gray-400"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.4, delay: 2.9 + index * 0.1 }}
              >
                {stat.desc}
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div 
          className="text-center mt-16"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, delay: 3.5 }}
        >
          <motion.div 
            className="inline-block p-8 rounded-2xl bg-gradient-to-r from-pink-500/10 to-violet-500/10 border border-pink-500/30 backdrop-blur-sm"
            whileHover={{ scale: 1.02, y: -5 }}
            transition={{ duration: 0.3 }}
          >
            <motion.h3 
              className="text-2xl font-bold mb-4 text-white tracking-tight"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.6, delay: 3.7 }}
            >
              Be the Next Success Story
            </motion.h3>
            <motion.p 
              className="text-gray-200 mb-6 max-w-md mx-auto tracking-tight"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.6, delay: 3.9 }}
            >
              Join hundreds of students who&apos;ve already transformed their careers. Your success story starts here.
            </motion.p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
