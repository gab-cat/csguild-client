'use client'

import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { 
  FileText, 
  Users, 
  Zap, 
  Database, 
  Calendar, 
  Search, 
  Workflow, 
  Star,
  ArrowRight,
  ExternalLink,
  Brain,
  Lightbulb,
  Target,
  Puzzle
} from 'lucide-react'
import Image from 'next/image'
import { useRef } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: 'easeOut' }
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

const scaleOnHover = {
  whileHover: { scale: 1.05 },
  whileTap: { scale: 0.95 }
}

const floatingAnimation = {
  animate: {
    y: [-10, 10, -10],
    rotate: [-1, 1, -1],
  },
  transition: {
    duration: 6,
    repeat: Infinity,
    ease: "easeInOut" as const
  }
}

const AboutNotionPage = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start']
  })

  const y = useTransform(scrollYProgress, [0, 1], [0, -50])
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1, 0.8])

  const stats = [
    { label: 'Active Workspaces', value: '15+', icon: Database },
    { label: 'Documents Created', value: '500+', icon: FileText },
    { label: 'Templates Available', value: '50+', icon: Workflow },
    { label: 'Collaborative Projects', value: '100+', icon: Users },
  ]

  const features = [
    {
      icon: FileText,
      title: 'All-in-One Workspace',
      description: 'Combine notes, docs, wikis, and project management in a single, powerful platform.',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: Brain,
      title: 'AI-Powered Productivity',
      description: 'Leverage Notion AI to write, edit, summarize, and brainstorm more efficiently.',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Users,
      title: 'Seamless Collaboration',
      description: 'Work together in real-time with comments, mentions, and shared workspaces.',
      gradient: 'from-green-500 to-blue-500'
    },
    {
      icon: Puzzle,
      title: 'Customizable Building Blocks',
      description: 'Create custom workflows with databases, templates, and flexible page structures.',
      gradient: 'from-orange-500 to-red-500'
    }
  ]

  const useCases = [
    {
      title: 'Project Documentation',
      description: 'Centralize project requirements, specifications, and progress tracking',
      icon: FileText,
      color: 'text-purple-400'
    },
    {
      title: 'Knowledge Base',
      description: 'Build comprehensive wikis and documentation for teams and organizations',
      icon: Database,
      color: 'text-blue-400'
    },
    {
      title: 'Meeting Notes & Agendas',
      description: 'Create structured meeting notes with action items and follow-ups',
      icon: Calendar,
      color: 'text-green-400'
    },
    {
      title: 'Task & Project Management',
      description: 'Track tasks, deadlines, and project milestones with custom databases',
      icon: Target,
      color: 'text-orange-400'
    },
    {
      title: 'Research & Study Notes',
      description: 'Organize research, create study guides, and manage academic projects',
      icon: Lightbulb,
      color: 'text-cyan-400'
    },
    {
      title: 'Team Wikis',
      description: 'Maintain team processes, guidelines, and institutional knowledge',
      icon: Search,
      color: 'text-pink-400'
    }
  ]

  const workflows = [
    'Student Project Coordination',
    'Organization Documentation',
    'Event Planning & Management',
    'Resource Libraries',
    'Team Onboarding',
    'Knowledge Sharing'
  ]

  // Individual animation refs
  const heroRef = useRef(null)
  const statsRef = useRef(null)
  const aboutRef = useRef(null)
  const featuresRef = useRef(null)
  const useCasesRef = useRef(null)
  const workflowsRef = useRef(null)
  const aiRef = useRef(null)
  const accessRef = useRef(null)

  const heroInView = useInView(heroRef, { once: true, amount: 0.3 })
  const statsInView = useInView(statsRef, { once: true, amount: 0.3 })
  const aboutInView = useInView(aboutRef, { once: true, amount: 0.3 })
  const featuresInView = useInView(featuresRef, { once: true, amount: 0.2 })
  const useCasesInView = useInView(useCasesRef, { once: true, amount: 0.2 })
  const workflowsInView = useInView(workflowsRef, { once: true, amount: 0.3 })
  const aiInView = useInView(aiRef, { once: true, amount: 0.3 })
  const accessInView = useInView(accessRef, { once: true, amount: 0.3 })

  return (
    <div ref={containerRef} className="min-h-screen bg-white text-gray-900 overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-black/5 via-gray-900/5 to-black/5"
          style={{ y, opacity }}
        />
        {/* Quirky pattern overlay */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='7' cy='7' r='2'/%3E%3Ccircle cx='53' cy='53' r='2'/%3E%3Ccircle cx='7' cy='53' r='2'/%3E%3Ccircle cx='53' cy='7' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
        
        <div ref={heroRef} className="relative max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8 z-10">
          <motion.div 
            className="text-center"
            initial="initial"
            animate={heroInView ? "animate" : "initial"}
            variants={staggerContainer}
          >
            <motion.div 
              className="flex justify-center mb-6"
              variants={fadeInUp}
            >
              <motion.div 
                className="relative"
                {...floatingAnimation}
              >
                <motion.div
                  className="w-20 h-20 bg-transparent rounded-lg flex items-center justify-center transform rotate-3 shadow-xl"
                  whileHover={{ scale: 1.1, rotate: 8 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Image src="/notion-logo.png" alt="Notion Icon" width={80} height={80} />
                </motion.div>
                <motion.div 
                  className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full"
                  animate={{ scale: [1, 1.2, 1], y: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <motion.div 
                  className="absolute -bottom-2 -left-2 w-4 h-4 bg-blue-400 rounded-full"
                  animate={{ scale: [1, 1.1, 1], opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                />
              </motion.div>
            </motion.div>
            
            <motion.h1 
              className="text-4xl md:text-6xl font-bold mb-6"
              variants={fadeInUp}
            >
              <motion.span 
                className="bg-black text-white px-4 py-2 rounded-lg transform -rotate-1 inline-block shadow-lg"
                whileHover={{ scale: 1.05, rotate: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                Notion
              </motion.span>
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-gray-600 mb-4 font-mono font-medium"
              variants={fadeInUp}
            >
              {"{ organize: true, collaborate: true, create: 'magic' }"}
            </motion.p>
            
            <motion.p 
              className="text-lg text-gray-700 max-w-3xl mx-auto mb-8 leading-relaxed"
              variants={fadeInUp}
            >
              Our digital playground where chaos meets order. A workspace that&apos;s as flexible as your imagination, 
              where every idea finds its home and every project gets its perfect structure. Think of it as 
              digital LEGO blocks for the modern mind.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              variants={fadeInUp}
            >
              <motion.div {...scaleOnHover}>
                <Button 
                  size="lg"
                  className="bg-black hover:bg-gray-800 text-white shadow-lg transition-all duration-300 transform hover:-rotate-1"
                >
                  <span className="mr-2">🚀</span>
                  Access Our Notion
                  <motion.div
                    className="ml-2"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="h-4 w-4" />
                  </motion.div>
                </Button>
              </motion.div>
              <motion.div {...scaleOnHover}>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-2 border-black text-black hover:bg-gray-50 transform hover:rotate-1 transition-all duration-300"
                >
                  <span className="mr-2">🤔</span>
                  What&apos;s Notion?
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Floating quirky elements with enhanced animations */}
        <motion.div 
          className="absolute top-20 left-10 opacity-40 font-mono text-black text-sm transform rotate-12"
          animate={{ 
            y: [-10, 10, -10],
            rotate: [10, 14, 10],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" as const }}
        >
          <div className="bg-yellow-200 px-2 py-1 rounded shadow-sm">
            {'{ status: "organizing" }'}
          </div>
        </motion.div>
        <motion.div 
          className="absolute top-40 right-20 opacity-40 font-mono text-black text-sm transform -rotate-6"
          animate={{ 
            y: [10, -10, 10],
            rotate: [-4, -8, -4],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" as const, delay: 2 }}
        >
          <div className="bg-blue-200 px-2 py-1 rounded shadow-sm">
            {'notion.magic()'}
          </div>
        </motion.div>
        <motion.div 
          className="absolute bottom-20 left-20 opacity-40 font-mono text-black text-sm transform rotate-6"
          animate={{ 
            y: [-5, 15, -5],
            rotate: [4, 8, 4],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" as const, delay: 4 }}
        >
          <div className="bg-green-200 px-2 py-1 rounded shadow-sm">
            {'while (creating) { innovate(); }'}
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
            initial="initial"
            animate={statsInView ? "animate" : "initial"}
            variants={staggerContainer}
          >
            {stats.map((stat, index) => (
              <motion.div 
                key={stat.label} 
                className="text-center group"
                variants={fadeInUp}
                custom={index}
                whileHover={{ y: -10 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.div 
                  className={`inline-flex items-center justify-center w-16 h-16 mb-4 rounded-2xl bg-black group-hover:bg-gray-800 transition-all duration-300 shadow-lg transform ${
                    index % 2 === 0 ? 'rotate-3' : '-rotate-3'
                  } group-hover:rotate-0`}
                  whileHover={{ scale: 1.1, rotate: 0 }}
                >
                  <stat.icon className="h-8 w-8 text-white transition-colors" />
                </motion.div>
                <motion.div 
                  className="text-3xl font-bold text-gray-900 mb-2"
                  initial={{ scale: 0 }}
                  animate={statsInView ? { scale: 1 } : { scale: 0 }}
                  transition={{ delay: index * 0.1 + 0.5, type: "spring", stiffness: 300 }}
                >
                  {stat.value}
                </motion.div>
                <div className="text-gray-600 font-mono text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* About Notion */}
      <section ref={aboutRef} className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial="initial"
            animate={aboutInView ? "animate" : "initial"}
            variants={staggerContainer}
          >
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-4 text-black"
              variants={fadeInUp}
            >
              Our Digital Playground
              <span className="ml-2 text-2xl">🎨</span>
            </motion.h2>
            <motion.p 
              className="text-gray-700 max-w-3xl mx-auto text-lg"
              variants={fadeInUp}
            >
              Where structure meets creativity and chaos transforms into beautiful organization.
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.8 }}
            animate={aboutInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 60, scale: 0.8 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <Card className="bg-gradient-to-br from-gray-50 to-white border-2 border-black shadow-[8px_8px_0px_0px_#000] mb-12 transform hover:-translate-y-1 transition-all duration-300 group">
              <CardContent className="p-8 md:p-12">
                <div className="text-center">
                  <motion.div 
                    className="flex justify-center mb-6"
                    whileHover={{ scale: 1.1, rotate: 10 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="bg-black p-4 rounded-xl transform rotate-3 shadow-lg group-hover:rotate-0 transition-transform">
                      <Workflow className="h-16 w-16 text-white" />
                    </div>
                  </motion.div>
                  <h3 className="text-2xl font-bold text-black mb-4">
                    Everything in One Place
                    <span className="ml-2">✨</span>
                  </h3>
                  <p className="text-gray-700 text-lg leading-relaxed max-w-4xl mx-auto">
                    Notion isn&apos;t just a tool – it&apos;s our digital brain! 🧠 From scattered sticky notes to structured 
                    masterpieces, it houses everything: meeting notes that actually make sense, project docs that 
                    don&apos;t disappear into the void, and team wikis that are actually fun to read. With building 
                    blocks more flexible than LEGO and AI that&apos;s smarter than your average bear 🐻, we create 
                    workflows that adapt faster than a chameleon at a rainbow convention.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial="initial"
            animate={featuresInView ? "animate" : "initial"}
            variants={staggerContainer}
          >
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-4 text-black"
              variants={fadeInUp}
            >
              Why We&apos;re Obsessed with Notion
              <span className="ml-2 text-2xl">🤩</span>
            </motion.h2>
            <motion.p 
              className="text-gray-700 max-w-3xl mx-auto text-lg"
              variants={fadeInUp}
            >
              It&apos;s like having a Swiss Army knife for your brain – but way cooler and less likely to poke you.
            </motion.p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-2 gap-8"
            initial="initial"
            animate={featuresInView ? "animate" : "initial"}
            variants={staggerContainer}
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                variants={fadeInUp}
                custom={index}
                whileHover={{ y: -10, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card className={`bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:shadow-[8px_8px_0px_0px_#000] transition-all duration-300 group transform ${
                  index % 2 === 0 ? 'hover:-rotate-1' : 'hover:rotate-1'
                } h-full`}>
                  <CardHeader>
                    <motion.div 
                      className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} p-2 mb-4 shadow-md transform rotate-3 group-hover:rotate-0 transition-transform`}
                      whileHover={{ scale: 1.1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <feature.icon className="h-6 w-6 text-white" />
                    </motion.div>
                    <CardTitle className="text-black group-hover:text-gray-800 transition-colors">
                      {feature.title}
                      <span className="ml-2 text-sm">
                        {index === 0 && '🏠'}
                        {index === 1 && '🤖'}
                        {index === 2 && '👥'}
                        {index === 3 && '🧩'}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-700 text-base leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section ref={useCasesRef} className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial="initial"
            animate={useCasesInView ? "animate" : "initial"}
            variants={staggerContainer}
          >
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-4 text-black"
              variants={fadeInUp}
            >
              How We Use Our Digital Magic
              <span className="ml-2 text-2xl">🎪</span>
            </motion.h2>
            <motion.p 
              className="text-gray-700 max-w-3xl mx-auto text-lg"
              variants={fadeInUp}
            >
              From chaos to cosmos – watch us transform everyday madness into organized brilliance.
            </motion.p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="initial"
            animate={useCasesInView ? "animate" : "initial"}
            variants={staggerContainer}
          >
            {useCases.map((useCase, index) => (
              <motion.div
                key={useCase.title}
                variants={fadeInUp}
                custom={index}
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card className={`bg-gray-50 border-2 border-black hover:border-gray-800 transition-all duration-300 group transform hover:scale-105 ${
                  index % 3 === 0 ? 'hover:rotate-1' : index % 3 === 1 ? 'hover:-rotate-1' : 'hover:rotate-0'
                } h-full`}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <motion.div 
                        className="bg-black p-2 rounded-lg transform rotate-12 group-hover:rotate-0 transition-transform"
                        whileHover={{ scale: 1.1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <useCase.icon className="h-6 w-6 text-white" />
                      </motion.div>
                      <div>
                        <h3 className="text-lg font-bold text-black mb-2 group-hover:text-gray-800 transition-colors">
                          {useCase.title}
                          <span className="ml-1 text-sm">
                            {index === 0 && '📄'}
                            {index === 1 && '📚'}
                            {index === 2 && '📅'}
                            {index === 3 && '🎯'}
                            {index === 4 && '💡'}
                            {index === 5 && '🔍'}
                          </span>
                        </h3>
                        <p className="text-gray-700 text-sm leading-relaxed">
                          {useCase.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Workflows Section */}
      <section ref={workflowsRef} className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial="initial"
            animate={workflowsInView ? "animate" : "initial"}
            variants={staggerContainer}
          >
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-4 text-black"
              variants={fadeInUp}
            >
              Our Notion Superpowers
              <span className="ml-2 text-2xl">🦸‍♀️</span>
            </motion.h2>
            <motion.p 
              className="text-gray-700 max-w-3xl mx-auto text-lg"
              variants={fadeInUp}
            >
              The secret workflows that keep our organized chaos beautifully chaotic.
            </motion.p>
          </motion.div>

          <motion.div 
            className="flex flex-wrap justify-center gap-4"
            initial="initial"
            animate={workflowsInView ? "animate" : "initial"}
            variants={staggerContainer}
          >
            {workflows.map((workflow, index) => (
              <motion.div
                key={workflow}
                variants={fadeInUp}
                custom={index}
                whileHover={{ scale: 1.05, rotate: 0 }}
                transition={{ type: "spring", stiffness: 300 }}
                className={`bg-white border-2 border-black rounded-lg px-4 py-2 hover:border-gray-800 hover:bg-gray-50 transition-all duration-300 shadow-[2px_2px_0px_0px_#000] hover:shadow-[4px_4px_0px_0px_#000] transform ${
                  index % 3 === 0 ? 'rotate-1' : index % 3 === 1 ? '-rotate-1' : 'rotate-0'
                } hover:rotate-0 cursor-pointer`}
              >
                <span className="text-black font-mono text-sm font-medium">
                  {workflow}
                  {index % 6 === 0 && ' 📝'}
                  {index % 6 === 1 && ' 📖'}
                  {index % 6 === 2 && ' 🎉'}
                  {index % 6 === 3 && ' 📚'}
                  {index % 6 === 4 && ' 👋'}
                  {index % 6 === 5 && ' 🤝'}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* AI Features Highlight */}
      <section ref={aiRef} className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.8 }}
            animate={aiInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 60, scale: 0.8 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <Card className="bg-black border-4 border-black shadow-[12px_12px_0px_0px_#000] transform hover:-translate-x-2 hover:-translate-y-2 transition-all duration-300 group">
              <CardContent className="p-8 md:p-12 text-center">
                <motion.div 
                  className="flex justify-center mb-6"
                  whileHover={{ scale: 1.1, rotate: 15 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="bg-yellow-400 p-4 rounded-2xl shadow-lg transform -rotate-6 group-hover:rotate-0 transition-transform">
                    <Zap className="h-12 w-12 text-black" />
                  </div>
                </motion.div>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  AI That Actually Gets It
                  <span className="ml-2 text-2xl">🤖✨</span>
                </h3>
                <p className="text-gray-200 text-lg leading-relaxed mb-6">
                  Our AI assistant doesn&apos;t just help – it practically reads our minds! 🔮 From generating 
                  meeting summaries that don&apos;t make you cringe to brainstorming ideas crazier than a 
                  caffeinated squirrel, it&apos;s like having a genius teammate who never steals your lunch 
                  from the fridge. 🥪
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <motion.div {...scaleOnHover}>
                    <Button 
                      size="lg"
                      className="bg-white text-black hover:bg-gray-100 shadow-lg transform hover:scale-105 transition-all duration-300"
                    >
                      <Brain className="mr-2 h-4 w-4" />
                      Mind = Blown 🤯
                    </Button>
                  </motion.div>
                  <motion.div {...scaleOnHover}>
                    <Button 
                      variant="outline" 
                      size="lg"
                      className="border-2 border-white text-white hover:bg-white/10 transition-all duration-300"
                    >
                      Show Me Magic ✨
                    </Button>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Access Information */}
      <section ref={accessRef} className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-12"
            initial="initial"
            animate={accessInView ? "animate" : "initial"}
            variants={staggerContainer}
          >
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-4 text-black"
              variants={fadeInUp}
            >
              Want In on the Fun?
              <span className="ml-2 text-2xl">🎪</span>
            </motion.h2>
            <motion.p 
              className="text-gray-700 text-lg leading-relaxed mb-8"
              variants={fadeInUp}
            >
              Join our digital playground where ideas come to play and projects find their perfect home! 
              It&apos;s like a VIP pass to organized chaos (the good kind). 🎢
            </motion.p>
            
            <motion.div 
              className="bg-white border-2 border-black rounded-xl p-6 mb-8 shadow-[4px_4px_0px_0px_#000] transform hover:shadow-[8px_8px_0px_0px_#000] transition-all duration-300"
              variants={fadeInUp}
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex items-center justify-center gap-2 mb-4">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 10 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Star className="h-5 w-5 text-black" />
                </motion.div>
                <span className="text-black font-mono text-sm font-bold">Access Requirements (The Cool Kids Club) 😎</span>
              </div>
              <ul className="text-gray-700 text-sm space-y-2">
                <motion.li 
                  className="flex items-center gap-2"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="w-2 h-2 bg-black rounded-full"></div>
                  Active CS Guild membership or partner organization participation 🏆
                </motion.li>
                <motion.li 
                  className="flex items-center gap-2"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="w-2 h-2 bg-black rounded-full"></div>
                  Completed onboarding process (it&apos;s actually fun, we promise!) 🚀
                </motion.li>
                <motion.li 
                  className="flex items-center gap-2"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="w-2 h-2 bg-black rounded-full"></div>
                  Agreement to collaboration guidelines (aka &apos;play nice&apos; rules) 🤝
                </motion.li>
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              Ready to Join Our Workspace?
              <span className="ml-2 text-2xl">🚀</span>
            </h2>
            <p className="text-xl text-gray-200 mb-8 leading-relaxed">
              Become part of our collaborative ecosystem where ideas flourish like plants in a greenhouse 🌱 
              and projects bloom like flowers in spring 🌸. Your creative chaos is exactly what we need!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div {...scaleOnHover}>
                <Button 
                  size="lg"
                  className="bg-white text-black hover:bg-gray-100 shadow-lg transition-all duration-300 hover:scale-105 transform hover:-rotate-1 font-semibold"
                >
                  <Users className="mr-2 h-5 w-5" />
                  Join the Party! 🎉
                </Button>
              </motion.div>
              <motion.div {...scaleOnHover}>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-2 border-white text-white hover:bg-white/10 hover:border-gray-200 transform hover:rotate-1 transition-all duration-300"
                >
                  <ExternalLink className="mr-2 h-5 w-5" />
                  Pretty Please? 🥺
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(1deg); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(-1deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 6s ease-in-out infinite 2s;
        }
      `}</style>
    </div>
  )
}

export default AboutNotionPage
