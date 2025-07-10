"use client"

import { motion, useInView } from "framer-motion"
import { Brain, Rocket, Target, Heart } from "lucide-react"
import { useRef } from "react"

import { Card, CardContent } from "@/components/ui/card"

export function AboutSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const values = [
    {
      icon: Brain,
      title: "Learn & Grow",
      description:
        "Transform from curious beginner to confident developer. Our structured learning paths and peer mentorship accelerate your journey in ways traditional education can't match.",
      code: "while (learning) { skills.level++; }",
    },
    {
      icon: Rocket,
      title: "Build & Ship",
      description:
        "Turn your ideas into reality. From weekend hackathons to semester-long projects, we provide the tools, teammates, and guidance to build applications that matter.",
      code: "const dream = new Reality();",
    },
    {
      icon: Target,
      title: "Land Your Dream Job",
      description:
        "Bridge the gap between classroom theory and industry practice. Our alumni network and career guidance help you secure positions at top tech companies.",
      code: "if (prepared) { career.launch(); }",
    },
    {
      icon: Heart,
      title: "Find Your Tribe",
      description: "Connect with like-minded developers who will become your lifelong friends, collaborators, and professional network. Great careers are built together.",
      code: "const community = bonds.strengthen();",
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

  const cardVariants = {
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

  return (
    <section id="about" className="py-24 relative bg-black" ref={ref}>
      <div className="container mx-auto px-6 relative z-10">
        <motion.div 
          className="text-center mb-16 pt-20"
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
              <Brain className="h-4 w-4 text-pink-400" />
              <span className="font-space-mono text-sm text-pink-300">{'// Your journey starts here'}</span>
            </div>
          </motion.div>
          <motion.h2 
            className="text-4xl md:text-5xl font-bold mb-6 text-white tracking-tighter"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Why{" "}
            <span className="bg-gradient-to-r from-pink-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
              10,000+
            </span>{" "}
            Students Choose CS Guild
          </motion.h2>
          <motion.p 
            className="text-md md:text-lg tracking-tight text-gray-200 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            We&apos;re not just another study group. We&apos;re the launchpad that transforms passionate CS students into industry-ready developers with real-world experience and lasting connections.
          </motion.p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {values.map((value, index) => (
            <motion.div key={index} variants={cardVariants}>
              <Card className="bg-gradient-to-br from-pink-900/20 to-violet-900/20 border border-pink-500/20 backdrop-blur-sm hover:from-pink-900/30 hover:to-violet-900/30 hover:border-pink-400/30 group h-full">
                <CardContent className="p-8">
                  <motion.div 
                    className="flex flex-col md:flex-row items-start gap-4"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex-shrink-0">
                      <motion.div 
                        className="w-12 h-12 rounded-lg bg-gradient-to-br from-pink-500/20 to-violet-500/20 flex items-center justify-center group-hover:from-pink-500/30 group-hover:to-violet-500/30 transition-all duration-300"
                        whileHover={{ rotate: 360, scale: 1.1 }}
                        transition={{ duration: 0.6 }}
                      >
                        <value.icon className="h-6 w-6 text-pink-400 group-hover:text-pink-300" />
                      </motion.div>
                    </div>
                    <div className="flex-1">
                      <motion.h3 
                        className="text-xl font-bold mb-3 text-white tracking-tight"
                        initial={{ opacity: 0 }}
                        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                        transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                      >
                        {value.title}
                      </motion.h3>
                      <motion.p 
                        className="text-gray-200 mb-4 leading-relaxed tracking-tight"
                        initial={{ opacity: 0 }}
                        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                        transition={{ duration: 0.6, delay: 1 + index * 0.1 }}
                      >
                        {value.description}
                      </motion.p>
                      <motion.div 
                        className="bg-black/50 rounded-lg p-3 border border-pink-500/30"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.4, delay: 1.2 + index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                      >
                        <code className="font-space-mono text-sm text-pink-400">{value.code}</code>
                      </motion.div>
                    </div>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          className="mt-20 max-w-7xl text-center flex justify-center mx-auto"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, delay: 1.5 }}
        >
          <motion.div 
            className="p-8 rounded-2xl bg-gradient-to-r from-pink-500/10 to-violet-500/10 border border-pink-500/30 backdrop-blur-sm"
            whileHover={{ scale: 1.02, y: -5 }}
            transition={{ duration: 0.3 }}
          >
            <motion.h3 
              className="text-2xl font-bold mb-4 font-space-mono text-white"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.6, delay: 1.8 }}
            >
              {'const yourSuccess = community.power + mentorship.wisdom + projects.experience;'}
            </motion.h3>
            <motion.p 
              className="text-gray-200 max-w-3xl mx-auto tracking-tight"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.6, delay: 2 }}
            >
              Every connection you make, every project you build, and every challenge you overcome brings you closer to your dream career. Your success story starts here.
            </motion.p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
