"use client"

import { motion, useInView } from "framer-motion"
import { Code2, Users, Calendar, Trophy, BookOpen, MessageSquare, ArrowRight, Zap } from "lucide-react"
import { useRef } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export function FeaturesSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const features = [
    {
      icon: Code2,
      title: "Interactive Code Labs",
      description: "Master algorithms, data structures, and system design through hands-on challenges that mirror real interview questions",
      highlight: "Weekly coding sessions • Real interview prep",
      color: "from-pink-500 to-violet-500",
    },
    {
      icon: Users,
      title: "Peer Learning Groups",
      description: "Join study circles with students from top universities working on the same technologies and facing similar challenges",
      highlight: "50+ active groups • University-verified members",
      color: "from-violet-500 to-purple-500",
    },
    {
      icon: Calendar,
      title: "Industry Workshops",
      description: "Learn from engineers at Google, Meta, and startups through exclusive workshops and technical deep-dives",
      highlight: "2-3 expert sessions monthly • Career insights",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: Trophy,
      title: "Hackathons & Competitions",
      description: "Build your portfolio with weekend hackathons and coding competitions that catch recruiters' attention",
      highlight: "Monthly competitions • Prize money & internships",
      color: "from-pink-400 to-violet-400",
    },
    {
      icon: BookOpen,
      title: "Curated Learning Paths",
      description: "Follow structured roadmaps from beginner to advanced, designed by industry professionals and CS professors",
      highlight: "1000+ verified resources • Progress tracking",
      color: "from-violet-400 to-purple-400",
    },
    {
      icon: MessageSquare,
      title: "1-on-1 Mentorship",
      description: "Get personalized guidance from senior students and industry professionals who've walked your path",
      highlight: "100+ mentors • Career & technical guidance",
      color: "from-purple-400 to-pink-400",
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      x: 50,
      scale: 0.9
    },
    visible: { 
      opacity: 1, 
      x: 0,
      scale: 1
    },
  }

  return (
    <section id="features" className="py-24 relative overflow-hidden bg-black" ref={ref}>
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8b5cf6_1px,transparent_1px),linear-gradient(to_bottom,#8b5cf6_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-10" />
      
      <div className="container mx-auto px-6">
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
              <Zap className="h-4 w-4 text-pink-400" />
              <span className="font-jetbrains text-sm text-pink-300">{"// Everything you need to succeed"}</span>
            </div>
          </motion.div>
          <motion.h2 
            className="text-4xl md:text-5xl font-bold mb-6 text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            From Student to{" "}
            <span className="bg-gradient-to-r from-pink-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
              Industry Leader
            </span>
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-200 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            We&apos;ve designed the complete toolkit to bridge the gap between your CS education and your dream career. Every feature is built to accelerate your growth.
          </motion.p>
        </motion.div>

        {/* Horizontal Scrolling Features */}
        <div className="relative">
          <motion.div
            className="flex gap-6 overflow-x-auto scroll-snap-x pb-6 scrollbar-hide"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="flex-shrink-0 w-80 scroll-snap-center"
              >
                <Card className="bg-gradient-to-br from-pink-900/20 to-violet-900/20 border border-pink-500/20 backdrop-blur-sm hover:from-pink-900/30 hover:to-violet-900/30 hover:border-pink-400/30 transition-all duration-300 group h-full">
                  <CardContent className="p-8">
                    <motion.div
                      className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} bg-opacity-20 flex items-center justify-center mb-6 shadow-lg`}
                      whileHover={{ scale: 1.2, rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <feature.icon className="h-6 w-6 text-white" />
                    </motion.div>
                    <motion.h3 
                      className="text-xl font-semibold mb-3 text-white"
                      initial={{ opacity: 0 }}
                      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                      transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                    >
                      {feature.title}
                    </motion.h3>
                    <motion.p 
                      className="text-gray-200 mb-4 leading-relaxed"
                      initial={{ opacity: 0 }}
                      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                      transition={{ duration: 0.6, delay: 1 + index * 0.1 }}
                    >
                      {feature.description}
                    </motion.p>
                    <motion.div 
                      className="flex items-center justify-between"
                      initial={{ opacity: 0, y: 10 }}
                      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                      transition={{ duration: 0.4, delay: 1.2 + index * 0.1 }}
                    >
                      <span className="font-jetbrains text-sm text-pink-400">{feature.highlight}</span>
                      <motion.div
                        whileHover={{ scale: 1.1, x: 5 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Button variant="ghost" size="sm" className="text-pink-400 hover:text-pink-300 hover:bg-pink-500/10 p-2">
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </motion.div>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Scroll indicator */}
          <motion.div 
            className="flex justify-center mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 1.5 }}
          >
            <div className="flex gap-2">
              {features.map((_, index) => (
                <motion.div 
                  key={index} 
                  className="w-2 h-2 rounded-full bg-pink-500/50 transition-all duration-300 hover:bg-pink-400"
                  initial={{ scale: 0 }}
                  animate={isInView ? { scale: 1 } : { scale: 0 }}
                  transition={{ duration: 0.3, delay: 1.7 + index * 0.05 }}
                  whileHover={{ scale: 1.3 }}
                />
              ))}
            </div>
          </motion.div>
        </div>

        {/* Call to Action */}
        <motion.div 
          className="text-center mt-16"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, delay: 2 }}
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
              transition={{ duration: 0.6, delay: 2.2 }}
            >
              Ready to Transform Your CS Journey?
            </motion.h3>
            <motion.p 
              className="text-gray-200 mb-6 max-w-md mx-auto"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.6, delay: 2.4 }}
            >
              Join 10,000+ students who&apos;ve already accelerated their careers with CS Guild. Your future starts with the next click.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.6, delay: 2.6 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button className="bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl shadow-pink-500/25">
                Start Your Journey
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
