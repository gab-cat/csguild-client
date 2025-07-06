"use client"

import { motion, useInView } from "framer-motion"
import { MessageSquare, Github, Twitter, Linkedin, ArrowRight, Code2 } from "lucide-react"
import type React from "react"
import { useState, useRef } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export function ContactSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log("Form submitted:", formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

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

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1
    },
  }

  const benefitVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  }

  return (
    <section id="contact" className="py-24 relative bg-black" ref={ref}>
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8b5cf6_1px,transparent_1px),linear-gradient(to_bottom,#8b5cf6_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-10" />
      
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
              <MessageSquare className="h-4 w-4 text-pink-400" />
              <span className="font-space-mono text-sm text-pink-300">{"// Ready to start your journey?"}</span>
            </div>
          </motion.div>
          <motion.h2 
            className="text-4xl md:text-5xl font-bold mb-6 text-white tracking-tighter"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Your{" "}
            <span className="bg-gradient-to-r from-pink-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
              Success Story
            </span>{" "}
            Starts Here
          </motion.h2>
          <motion.p 
            className="text-lg tracking-tight text-gray-200 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Ready to transform your CS journey? Join 10,000+ students who&apos;ve already accelerated their careers. Let&apos;s build something amazing together.
          </motion.p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {/* Contact Form */}
          <motion.div variants={itemVariants}>
            <Card className="bg-gradient-to-br from-pink-900/20 to-violet-900/20 border border-pink-500/20 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-white flex items-center gap-2">
                    <motion.div
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <MessageSquare className="h-6 w-6 text-pink-400" />
                    </motion.div>
                    <span className="tracking-tighter">
                      Get Started Today
                    </span>
                  </CardTitle>
                  <p className="text-gray-200 tracking-tight">
                    Fill out the form below and we&apos;ll get you connected with our community within 24 hours.
                  </p>
                </CardHeader>
              </motion.div>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <motion.div 
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.6, delay: 1 }}
                  >
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-200 mb-2">
                        Full Name
                      </label>
                      <motion.div
                        whileFocus={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Your full name"
                          className="bg-black/50 border-pink-500/30 text-white placeholder-gray-400 focus:border-pink-400 focus:ring-pink-400"
                          required
                        />
                      </motion.div>
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-2">
                        Email Address
                      </label>
                      <motion.div
                        whileFocus={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="your.email@university.edu"
                          className="bg-black/50 border-pink-500/30 text-white placeholder-gray-400 focus:border-pink-400 focus:ring-pink-400"
                          required
                        />
                      </motion.div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.6, delay: 1.2 }}
                  >
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-200 mb-2">
                      I&apos;m interested in
                    </label>
                    <motion.div
                      whileFocus={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="e.g., Mentorship, Study Groups, Career Guidance"
                        className="bg-black/50 border-pink-500/30 text-white placeholder-gray-400 focus:border-pink-400 focus:ring-pink-400"
                        required
                      />
                    </motion.div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.6, delay: 1.4 }}
                  >
                    <label htmlFor="message" className="block text-sm font-medium text-gray-200 mb-2">
                      Tell us about your goals
                    </label>
                    <motion.div
                      whileFocus={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="What are you hoping to achieve? What's your dream job? We'd love to hear about your CS journey..."
                        rows={6}
                        className="bg-black/50 border-pink-500/30 text-white placeholder-gray-400 resize-none focus:border-pink-400 focus:ring-pink-400"
                        required
                      />
                    </motion.div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.6, delay: 1.6 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 text-white font-semibold py-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl shadow-pink-500/25"
                    >
                      Join CS Guild Community
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </motion.div>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Why Join Section */}
          <motion.div 
            className="space-y-8"
            variants={itemVariants}
          >
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
              transition={{ duration: 0.6, delay: 1.2 }}
            >
              <Card className="bg-gradient-to-br from-pink-900/20 to-violet-900/20 border border-pink-500/20 backdrop-blur-sm">
                <CardContent className="p-2 px-8">
                  <motion.h3 
                    className="text-xl font-semibold text-white mb-6 flex items-center gap-2"
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ duration: 0.6, delay: 1.4 }}
                  >
                    <motion.div
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Code2 className="h-5 w-5 text-pink-400" />
                    </motion.div>
                    <span className="tracking-tight">
                      Why Join CS Guild?
                    </span>
                  </motion.h3>

                  <div className="space-y-6">
                    {[
                      {
                        title: "Accelerated Learning",
                        description: "Learn 3x faster through peer collaboration and structured mentorship programs."
                      },
                      {
                        title: "Industry Connections",
                        description: "Direct access to engineers at top companies and startup founders."
                      },
                      {
                        title: "Proven Results", 
                        description: "97% job placement rate with $125K average starting salary."
                      }
                    ].map((benefit, index) => (
                      <motion.div 
                        key={index}
                        className="flex items-start gap-4"
                        variants={benefitVariants}
                        initial="hidden"
                        animate={isInView ? "visible" : "hidden"}
                        transition={{ duration: 0.6, delay: 1.6 + index * 0.2 }}
                        whileHover={{ x: 5, scale: 1.02 }}
                      >
                        <motion.div 
                          className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-500/20 to-violet-500/20 flex items-center justify-center flex-shrink-0"
                          whileHover={{ rotate: 360, scale: 1.1 }}
                          transition={{ duration: 0.5 }}
                        >
                          <ArrowRight className="h-5 w-5 text-pink-400" />
                        </motion.div>
                        <div>
                          <h4 className="font-semibold text-white mb-1 tracking-tight">{benefit.title}</h4>
                          <p className="text-gray-400 tracking-tight">{benefit.description}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
              transition={{ duration: 0.6, delay: 1.8 }}
            >
              <Card className="bg-gradient-to-br from-pink-900/20 to-violet-900/20 border border-pink-500/20 backdrop-blur-sm">
                <CardContent className="p-0 px-8">
                  <motion.h3 
                    className="text-xl font-semibold text-white mb-6 tracking-tighter"
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ duration: 0.6, delay: 2 }}
                  >
                    Connect With Us
                  </motion.h3>

                  <motion.div 
                    className="grid grid-cols-2 gap-4 mb-6"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.6, delay: 2.2 }}
                  >
                    {[
                      { time: "24hrs", label: "Response Time" },
                      { time: "24/7", label: "Community Support" }
                    ].map((stat, index) => (
                      <motion.div 
                        key={index}
                        className="text-center p-4 rounded-lg bg-gradient-to-r from-pink-500/10 to-violet-500/10 border border-pink-500/20"
                        whileHover={{ scale: 1.05, y: -2 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="font-space-mono text-2xl font-bold text-pink-400 mb-1">{stat.time}</div>
                        <div className="text-sm text-gray-200">{stat.label}</div>
                      </motion.div>
                    ))}
                  </motion.div>

                  <motion.div 
                    className="flex gap-4 justify-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.6, delay: 2.4 }}
                  >
                    {[
                      { icon: Github, label: "GitHub", href: "#" },
                      { icon: Twitter, label: "Twitter", href: "#" },
                      { icon: Linkedin, label: "LinkedIn", href: "#" },
                    ].map((social, index) => (
                      <motion.a
                        key={index}
                        href={social.href}
                        className="w-12 h-12 rounded-lg bg-gradient-to-br from-pink-500/20 to-violet-500/20 hover:from-pink-500/30 hover:to-violet-500/30 flex items-center justify-center transition-all duration-300 border border-pink-500/30"
                        aria-label={social.label}
                        whileHover={{ scale: 1.1, rotate: 360 }}
                        whileTap={{ scale: 0.9 }}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
                        transition={{ duration: 0.4, delay: 2.6 + index * 0.1 }}
                      >
                        <social.icon className="h-5 w-5 text-pink-400 hover:text-pink-300" />
                      </motion.a>
                    ))}
                  </motion.div>

                  <motion.div 
                    className="mt-6 p-4 rounded-lg bg-black/50 border border-pink-500/30"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.6, delay: 2.8 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="text-center">
                      <div className="font-space-mono text-sm text-pink-400 mb-1">
                        const nextSuccessStory = &apos;YOU&apos;;
                      </div>
                      <div className="text-xs text-gray-300">
                        Join the community that&apos;s launching careers
                      </div>
                    </div>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
