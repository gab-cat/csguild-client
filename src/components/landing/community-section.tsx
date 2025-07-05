"use client"

import { motion, useInView } from "framer-motion"
import { Star, Quote, Code2 } from "lucide-react"
import { useRef } from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

export function CommunitySection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

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
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const testimonialVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1
    },
  }

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
              <span className="font-jetbrains text-sm text-pink-300">{"// Real stories, real success"}</span>
            </div>
          </motion.div>
          <motion.h2 
            className="text-4xl md:text-5xl font-bold mb-6 text-white"
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
            className="text-xl text-gray-200 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            These aren&apos;t just testimonials – they&apos;re proof that CS Guild works. Every story represents a student who transformed their career trajectory through our community.
          </motion.p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="max-w-4xl mx-auto">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                variants={testimonialVariants}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <Card className="bg-gradient-to-br from-pink-900/20 to-violet-900/20 border border-pink-500/20 backdrop-blur-sm hover:from-pink-900/30 hover:to-violet-900/30 hover:border-pink-400/30 group relative overflow-hidden h-full">
                  <CardContent className="p-8">
                    <motion.div 
                      className="absolute top-4 right-4 opacity-20 group-hover:opacity-30 transition-opacity"
                      whileHover={{ rotate: 180, scale: 1.2 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Quote className="h-8 w-8 text-pink-400" />
                    </motion.div>

                    <motion.div 
                      className="flex items-center gap-4 mb-6"
                      initial={{ opacity: 0, x: -20 }}
                      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                      transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                    >
                      <Avatar className="h-12 w-12 border-2 border-pink-500/30">
                        <AvatarImage src={testimonial.avatar || "/placeholder.svg"} alt={testimonial.name} />
                        <AvatarFallback className="bg-gradient-to-br from-pink-500 to-violet-500 text-white font-semibold">
                          {testimonial.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-semibold text-white">{testimonial.name}</h4>
                        <p className="text-sm text-pink-300 font-jetbrains">{testimonial.role}</p>
                      </div>
                    </motion.div>

                    <motion.div 
                      className="flex items-center gap-1 mb-4"
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
                          <Star className="h-4 w-4 fill-pink-400 text-pink-400" />
                        </motion.div>
                      ))}
                    </motion.div>

                    <motion.p 
                      className="text-gray-200 leading-relaxed mb-4"
                      initial={{ opacity: 0 }}
                      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                      transition={{ duration: 0.6, delay: 1.4 + index * 0.1 }}
                    >
                      &quot;{testimonial.content}&quot;
                    </motion.p>
                    
                    <motion.div 
                      className="p-3 rounded-lg bg-gradient-to-r from-pink-500/10 to-violet-500/10 border border-pink-500/20 mb-4"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.4, delay: 1.6 + index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex items-center gap-2 text-pink-400 font-jetbrains text-sm">
                        <Code2 className="h-4 w-4" />
                        <span>{testimonial.outcome}</span>
                      </div>
                    </motion.div>

                    <motion.div 
                      className="flex flex-wrap gap-2"
                      initial={{ opacity: 0, y: 10 }}
                      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                      transition={{ duration: 0.4, delay: 1.8 + index * 0.1 }}
                    >
                      {testimonial.tech.map((tech, techIndex) => (
                        <motion.div
                          key={techIndex}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                          transition={{ duration: 0.3, delay: 2 + index * 0.1 + techIndex * 0.05 }}
                          whileHover={{ scale: 1.1 }}
                        >
                          <Badge
                            variant="secondary"
                            className="bg-pink-500/20 text-pink-300 border border-pink-500/30 font-jetbrains text-xs"
                          >
                            {tech}
                          </Badge>
                        </motion.div>
                      ))}
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Success Metrics */}
        <motion.div 
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
          variants={statsVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {[
            { number: "10,000+", label: "Students Transformed", desc: "And counting" },
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
                className="font-jetbrains text-3xl font-bold bg-gradient-to-r from-pink-400 to-violet-400 bg-clip-text text-transparent mb-2 group-hover:from-pink-300 group-hover:to-violet-300 transition-all duration-300"
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
              className="text-2xl font-bold mb-4 text-white"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.6, delay: 3.7 }}
            >
              Be the Next Success Story
            </motion.h3>
            <motion.p 
              className="text-gray-200 mb-6 max-w-md mx-auto"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.6, delay: 3.9 }}
            >
              Join thousands of students who&apos;ve already transformed their careers. Your success story starts here.
            </motion.p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
