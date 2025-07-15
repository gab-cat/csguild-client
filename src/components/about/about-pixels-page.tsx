'use client'

import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { 
  Camera, 
  Heart, 
  Sparkles, 
  Users, 
  Award, 
  Image as ImageIcon,
  Film,
  Brush,
  Eye,
  Star,
  Mail,
  Instagram,
  Monitor,
  Layers,
  Aperture,
  Edit3
} from 'lucide-react'
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

const EnhancedAboutPixelsPage = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start']
  })

  const y = useTransform(scrollYProgress, [0, 1], [0, -50])
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1, 0.8])

  const stats = [
    { label: 'Creative Souls', value: '150+', icon: Users },
    { label: 'Masterpieces Created', value: '1000+', icon: ImageIcon },
    { label: 'Exhibitions Held', value: '25+', icon: Award },
    { label: 'Awards Won', value: '12+', icon: Star },
  ]

  const focuses = [
    {
      icon: Camera,
      title: 'Photography Mastery',
      description: 'From street photography to studio portraits - capturing life\'s most beautiful moments with Ignatian contemplation.',
      bgColor: 'bg-red-500'
    },
    {
      icon: Brush,
      title: 'Digital Art Creation',
      description: 'Pushing boundaries with digital illustration, concept art, and multimedia expressions that speak to the soul.',
      bgColor: 'bg-green-500'
    },
    {
      icon: Film,
      title: 'Visual Storytelling',
      description: 'Creating compelling narratives through video, animation, and interactive media that inspire and educate.',
      bgColor: 'bg-blue-500'
    },
    {
      icon: Monitor,
      title: 'Electronic Arts',
      description: 'Exploring cutting-edge digital technologies, AR/VR experiences, and interactive installations.',
      bgColor: 'bg-red-500'
    }
  ]

  const programs = [
    {
      title: 'Pixel Perfect Workshop',
      description: 'Master the fundamentals of digital photography and post-processing',
      icon: Aperture,
      color: 'text-red-500'
    },
    {
      title: 'Canvas & Code',
      description: 'Blend traditional artistry with modern digital tools and techniques',
      icon: Layers,
      color: 'text-green-500'
    },
    {
      title: 'Visual Theology',
      description: 'Explore the intersection of faith, spirituality, and visual expression',
      icon: Heart,
      color: 'text-blue-500'
    },
    {
      title: 'Portfolio Development',
      description: 'Build a professional portfolio that showcases your unique artistic voice',
      icon: Edit3,
      color: 'text-red-500'
    },
    {
      title: 'Community Exhibitions',
      description: 'Showcase your work in gallery spaces and digital platforms',
      icon: Eye,
      color: 'text-green-500'
    },
    {
      title: 'Collaborative Projects',
      description: 'Work with fellow artists on meaningful community-focused initiatives',
      icon: Users,
      color: 'text-blue-500'
    }
  ]

  const mediums = [
    'Digital Photography', 'Portrait Photography', 'Street Photography', 'Digital Illustration',
    'Concept Art', 'Photo Manipulation', 'Video Production', 'Animation', 'Interactive Media',
    'Augmented Reality', 'Virtual Reality', 'Installation Art'
  ]

  // Individual animation refs
  const heroRef = useRef(null)
  const statsRef = useRef(null)
  const aboutRef = useRef(null)
  const focusesRef = useRef(null)
  const programsRef = useRef(null)
  const mediumsRef = useRef(null)
  const ignatianRef = useRef(null)
  const exhibitionsRef = useRef(null)

  const heroInView = useInView(heroRef, { once: true, amount: 0.3 })
  const statsInView = useInView(statsRef, { once: true, amount: 0.3 })
  const aboutInView = useInView(aboutRef, { once: true, amount: 0.3 })
  const focusesInView = useInView(focusesRef, { once: true, amount: 0.2 })
  const programsInView = useInView(programsRef, { once: true, amount: 0.2 })
  const mediumsInView = useInView(mediumsRef, { once: true, amount: 0.3 })
  const ignatianInView = useInView(ignatianRef, { once: true, amount: 0.3 })
  const exhibitionsInView = useInView(exhibitionsRef, { once: true, amount: 0.2 })

  return (
    <div ref={containerRef} className='min-h-screen bg-[#fffef5] text-[#1e3a8a] overflow-hidden'>
      {/* Quirky floating shapes - RGB colors with enhanced animations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div 
          className="absolute top-20 left-10 w-8 h-8 bg-red-500/20 rounded-full"
          animate={{ 
            y: [0, -20, 0],
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute top-40 right-20 w-6 h-6 bg-green-500/30 rounded-full"
          animate={{ 
            y: [0, 15, 0],
            x: [0, 10, 0],
            scale: [1, 0.8, 1]
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        <motion.div 
          className="absolute bottom-32 left-20 w-4 h-4 bg-blue-500/25 rounded-full"
          animate={{ 
            y: [0, -10, 0],
            rotate: [0, 180, 360]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
        <motion.div 
          className="absolute bottom-20 right-32 w-10 h-10 bg-red-500/15 rounded-full"
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.15, 0.3, 0.15]
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Quirky geometric shapes */}
        <motion.div 
          className="absolute top-60 left-1/4 w-12 h-12 bg-green-500/20 transform rotate-45"
          animate={{ 
            rotate: [45, 225, 45],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-60 right-1/4 w-8 h-8 bg-red-500/25 transform rotate-12"
          animate={{ 
            rotate: [12, 75, 12],
            y: [0, -5, 0]
          }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        />
      </div>

      {/* Hero Section */}
      <section className='relative min-h-screen flex items-center justify-center overflow-hidden bg-[#fffef5] z-10'>
        <motion.div 
          className='absolute inset-0 bg-red-500/5'
          style={{ y, opacity }}
        />
        
        {/* Animated background pattern - matching OG image decorative elements */}
        <motion.div 
          className="absolute inset-0 opacity-10"
          animate={{ 
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23dc2626' fill-opacity='0.3'%3E%3Cpath d='M20 20c0 2.8-2.2 5-5 5s-5-2.2-5-5 2.2-5 5-5 5 2.2 5 5zm-5-15c2.8 0 5 2.2 5 5s-2.2 5-5 5-5-2.2-5-5 2.2-5 5-5zm10 0c2.8 0 5 2.2 5 5s-2.2 5-5 5-5-2.2-5-5 2.2-5 5-5z'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        
        <div ref={heroRef} className='relative max-w-4xl mx-auto px-4 py-20 sm:px-6 lg:px-8 flex flex-col items-center z-20'>
          <motion.div 
            className='text-center'
            initial="initial"
            animate={heroInView ? "animate" : "initial"}
            variants={staggerContainer}
          >
            <motion.div 
              className='flex justify-center mb-6'
              variants={fadeInUp}
            >
              <motion.div 
                className='relative'
                {...floatingAnimation}
              >
                {/* Main logo matching OG image exactly */}
                <motion.div
                  className='w-32 h-32 rounded-[2rem] bg-red-500 p-1 shadow-2xl transform border-4 border-[#1e3a8a]'
                  whileHover={{ scale: 1.1, rotate: 12 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className='w-full h-full rounded-[1.8rem] bg-[#fffef5] flex items-center justify-center relative overflow-hidden'>
                    <motion.div 
                      className='text-6xl font-bold text-red-500 z-10'
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      P
                    </motion.div>
                    {/* Subtle inner glow effect */}
                    <motion.div 
                      className="absolute inset-2 bg-red-500/10 rounded-[1.4rem]"
                      animate={{ opacity: [0.1, 0.3, 0.1] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    />
                  </div>
                </motion.div>
                
                {/* Floating decorative elements around logo - exactly matching OG image */}
                <motion.div 
                  className='absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full shadow-lg border-2 border-[#1e3a8a]'
                  animate={{ 
                    y: [0, -5, 0],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                />
                <motion.div 
                  className='absolute -bottom-2 -left-2 w-4 h-4 bg-green-500 rounded-full shadow-lg border-2 border-[#1e3a8a]'
                  animate={{ 
                    y: [0, 5, 0],
                    rotate: [0, 180, 360]
                  }}
                  transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                />
                <motion.div 
                  className='absolute top-8 -left-4 w-3 h-3 bg-blue-500 rounded-full border border-[#1e3a8a]'
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <motion.div 
                  className='absolute bottom-8 -right-4 w-3 h-3 bg-red-500 rounded-full border border-[#1e3a8a]'
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                />
                
                <motion.div 
                  className='absolute inset-0 bg-red-500/20 rounded-[2rem] blur-xl'
                  animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }}
                  transition={{ duration: 4, repeat: Infinity }}
                />
              </motion.div>
            </motion.div>
            
            <motion.h1 
              className='text-4xl md:text-6xl font-extrabold mb-4 text-center text-[#1e3a8a] tracking-tight'
              variants={fadeInUp}
            >
              <motion.span
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                PIXELS
              </motion.span>
              <span className="text-2xl ml-2">✨</span>
            </motion.h1>
            
            <motion.div 
              className="relative mb-6"
              variants={fadeInUp}
            >
              <motion.p 
                className='text-lg md:text-xl font-medium text-center max-w-3xl text-[#1e3a8a]'
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                Pioneers of Ignatian Expressive Electronic Arts and Learning Society
              </motion.p>
              <div className="absolute -top-1 -right-1 text-yellow-400 text-xl animate-bounce">🎨</div>
            </motion.div>
            
            <motion.p 
              className='text-base md:text-lg text-[#1e3a8a]/80 text-center mb-8 max-w-2xl leading-relaxed'
              variants={fadeInUp}
            >
              Where creativity meets technology in the Ignatian tradition! 🌟 We capture beauty, express truth, 
              and celebrate the divine through visual arts, photography, and digital creativity. 
              Come join our colorful journey of artistic discovery! 🎭
            </motion.p>
            
            {/* Creative elements matching OG image */}
            <motion.div 
              className='flex flex-col sm:flex-row gap-4 justify-center mb-8'
              variants={fadeInUp}
            >
              <motion.div {...scaleOnHover}>
                <Button className='group inline-flex items-center px-6 py-3 rounded-lg bg-red-500 text-white font-semibold shadow-lg border-2 border-[#1e3a8a]'>
                  Let&apos;s Create Together!
                  <Mail className='ml-2 h-5 w-5 group-hover:animate-bounce' />
                  <span className="ml-1">📧</span>
                </Button>
              </motion.div>
              <motion.div {...scaleOnHover}>
                <Button className='group inline-flex items-center px-6 py-3 rounded-lg border-2 border-[#1e3a8a] text-[#1e3a8a] font-semibold hover:bg-[#1e3a8a]/10 transform hover:rotate-2 transition-all duration-300'>
                  Instagram Magic
                  <Instagram className='ml-2 h-5 w-5 group-hover:animate-spin' />
                  <span className="ml-1">📸</span>
                </Button>
              </motion.div>
            </motion.div>

            {/* Feature highlights matching OG image */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-6 justify-center text-sm font-medium text-[#1e3a8a]/80"
              variants={fadeInUp}
            >
              <span className="flex items-center gap-2">📸 Photography</span>
              <span className="hidden sm:block">•</span>
              <span className="flex items-center gap-2">🎨 Digital Art</span>
              <span className="hidden sm:block">•</span>
              <span className="flex items-center gap-2">🎬 Visual Stories</span>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Floating Creative Elements with enhanced animations - scattered around like OG image */}
        <motion.div 
          className='absolute top-24 left-10 opacity-40 font-mono text-red-600 text-sm'
          animate={{ 
            y: [-10, 10, -10],
            rotate: [10, 14, 10],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" as const }}
        >
          <div className="bg-red-50 px-3 py-1 rounded-lg shadow-md transform rotate-12 border-2 border-[#1e3a8a]">
            {'{ creativity: "∞" } 🎨'}
          </div>
        </motion.div>
        <motion.div 
          className='absolute top-40 right-20 opacity-40 font-mono text-green-600 text-sm'
          animate={{ 
            y: [10, -10, 10],
            rotate: [-4, -8, -4],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" as const, delay: 2 }}
        >
          <div className="bg-green-50 px-3 py-1 rounded-lg shadow-md transform -rotate-6 border-2 border-[#1e3a8a]">
            {'capture.magic() ✨'}
          </div>
        </motion.div>
        <motion.div 
          className='absolute bottom-20 left-20 opacity-40 font-mono text-blue-600 text-sm'
          animate={{ 
            y: [-5, 15, -5],
            rotate: [4, 8, 4],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" as const, delay: 4 }}
        >
          <div className="bg-blue-50 px-3 py-1 rounded-lg shadow-md transform rotate-6 border-2 border-[#1e3a8a]">
            {'while (creating) { inspire(); } 💫'}
          </div>
        </motion.div>
      </section>

      {/* About Section */}
      <section ref={aboutRef} className="py-20 bg-[#fffef5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial="initial"
            animate={aboutInView ? "animate" : "initial"}
            variants={staggerContainer}
          >
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-4 text-[#1e3a8a]"
              variants={fadeInUp}
            >
              Our Colorful Journey
              <span className="ml-2 text-2xl">🌈</span>
            </motion.h2>
            <motion.p 
              className="text-[#1e3a8a]/80 max-w-3xl mx-auto text-lg"
              variants={fadeInUp}
            >
              Where faith meets creativity and pixels become prayers of beauty.
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.8 }}
            animate={aboutInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 60, scale: 0.8 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <Card className="bg-white border-4 border-[#1e3a8a] shadow-[8px_8px_0px_0px_#dc2626] mb-12 transform hover:-translate-y-1 transition-all duration-300 group overflow-hidden">
              <CardContent className="p-8 md:p-12">
                <div className="text-center">
                  <motion.div 
                    className="flex justify-center mb-6"
                    whileHover={{ scale: 1.1, rotate: 10 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="bg-red-500 p-4 rounded-xl transform rotate-3 shadow-lg group-hover:rotate-0 transition-transform border-2 border-[#1e3a8a]">
                      <Sparkles className="h-16 w-16 text-white" />
                    </div>
                  </motion.div>
                  <h3 className="text-2xl font-bold text-[#1e3a8a] mb-4">
                    Creating with Purpose & Passion
                    <span className="ml-2">✨</span>
                  </h3>
                  <p className="text-[#1e3a8a]/80 text-lg leading-relaxed max-w-4xl mx-auto">
                    PIXELS isn&apos;t just about pretty pictures – we&apos;re digital missionaries! 🎨✝️ Through the lens of 
                    Ignatian spirituality, we capture God&apos;s beauty in everyday moments, create art that speaks to souls, 
                    and use technology to spread joy and wonder. From street photography that tells stories of grace 
                    to digital art that explores faith, we believe every pixel can be a prayer and every creation 
                    can be an act of love! 💕📸
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Focus Areas Section */}
      <section ref={focusesRef} className="py-20 bg-white border-y-4 border-[#1e3a8a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial="initial"
            animate={focusesInView ? "animate" : "initial"}
            variants={staggerContainer}
          >
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-4 text-[#1e3a8a]"
              variants={fadeInUp}
            >
              Our Creative Superpowers
              <span className="ml-2 text-2xl">🦸‍♀️</span>
            </motion.h2>
            <motion.p 
              className="text-[#1e3a8a]/80 max-w-3xl mx-auto text-lg"
              variants={fadeInUp}
            >
              Four amazing ways we express creativity and capture divine beauty!
            </motion.p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-2 gap-8"
            initial="initial"
            animate={focusesInView ? "animate" : "initial"}
            variants={staggerContainer}
          >
            {focuses.map((focus, index) => (
              <motion.div
                key={focus.title}
                variants={fadeInUp}
                custom={index}
                whileHover={{ y: -10, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card className={`bg-[#fffef5] border-4 border-[#1e3a8a] shadow-[4px_4px_0px_0px_${
                  index % 3 === 0 ? '#dc2626' : index % 3 === 1 ? '#16a34a' : '#2563eb'
                }] hover:shadow-[8px_8px_0px_0px_${
                  index % 3 === 0 ? '#dc2626' : index % 3 === 1 ? '#16a34a' : '#2563eb'
                }] transition-all duration-300 group transform ${
                  index % 2 === 0 ? 'hover:-rotate-1' : 'hover:rotate-1'
                } h-full`}>
                  <CardHeader>
                    <motion.div 
                      className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${focus.bgColor} p-2 mb-4 shadow-md transform rotate-3 group-hover:rotate-0 transition-transform border-2 border-[#1e3a8a]`}
                      whileHover={{ scale: 1.1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <focus.icon className="h-6 w-6 text-white" />
                    </motion.div>
                    <CardTitle className="text-[#1e3a8a] group-hover:text-[#1e3a8a]/80 transition-colors">
                      {focus.title}
                      <span className="ml-2 text-sm">
                        {index === 0 && '📸'}
                        {index === 1 && '🎨'}
                        {index === 2 && '🎬'}
                        {index === 3 && '💻'}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-[#1e3a8a]/70 text-base leading-relaxed">
                      {focus.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Programs Section */}
      <section ref={programsRef} className="py-20 bg-[#fffef5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial="initial"
            animate={programsInView ? "animate" : "initial"}
            variants={staggerContainer}
          >
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-4 text-[#1e3a8a]"
              variants={fadeInUp}
            >
              Join Our Creative Adventures
              <span className="ml-2 text-2xl">🎪</span>
            </motion.h2>
            <motion.p 
              className="text-[#1e3a8a]/80 max-w-3xl mx-auto text-lg"
              variants={fadeInUp}
            >
              From beginner-friendly workshops to professional portfolio development – we&apos;ve got your creative journey covered!
            </motion.p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="initial"
            animate={programsInView ? "animate" : "initial"}
            variants={staggerContainer}
          >
            {programs.map((program, index) => (
              <motion.div
                key={program.title}
                variants={fadeInUp}
                custom={index}
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card className={`bg-white border-4 border-[#1e3a8a] hover:border-[#1e3a8a]/80 transition-all duration-300 group transform hover:scale-105 ${
                  index % 3 === 0 ? 'hover:rotate-1' : index % 3 === 1 ? 'hover:-rotate-1' : 'hover:rotate-0'
                } h-full shadow-[2px_2px_0px_0px_#dc2626] hover:shadow-[4px_4px_0px_0px_#dc2626]`}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <motion.div 
                        className="bg-[#1e3a8a] p-2 rounded-lg transform rotate-12 group-hover:rotate-0 transition-transform border-2 border-white"
                        whileHover={{ scale: 1.1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <program.icon className="h-6 w-6 text-white" />
                      </motion.div>
                      <div>
                        <h3 className="text-lg font-bold text-[#1e3a8a] mb-2 group-hover:text-[#1e3a8a]/80 transition-colors">
                          {program.title}
                          <span className="ml-1 text-sm">
                            {index === 0 && '📷'}
                            {index === 1 && '🖌️'}
                            {index === 2 && '✝️'}
                            {index === 3 && '📂'}
                            {index === 4 && '🖼️'}
                            {index === 5 && '🤝'}
                          </span>
                        </h3>
                        <p className="text-[#1e3a8a]/70 text-sm leading-relaxed">
                          {program.description}
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

      {/* Mediums Section */}
      <section ref={mediumsRef} className="py-20 bg-white border-y-4 border-[#1e3a8a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial="initial"
            animate={mediumsInView ? "animate" : "initial"}
            variants={staggerContainer}
          >
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-4 text-[#1e3a8a]"
              variants={fadeInUp}
            >
              Our Creative Toolkit
              <span className="ml-2 text-2xl">🧰</span>
            </motion.h2>
            <motion.p 
              className="text-[#1e3a8a]/80 max-w-3xl mx-auto text-lg"
              variants={fadeInUp}
            >
              All the amazing mediums and techniques we explore in our creative journey!
            </motion.p>
          </motion.div>

          <motion.div 
            className="flex flex-wrap justify-center gap-4"
            initial="initial"
            animate={mediumsInView ? "animate" : "initial"}
            variants={staggerContainer}
          >
            {mediums.map((medium, index) => (
              <motion.div
                key={medium}
                variants={fadeInUp}
                custom={index}
                whileHover={{ scale: 1.05, rotate: 0 }}
                transition={{ type: "spring", stiffness: 300 }}
                className={`bg-[#fffef5] border-2 border-[#1e3a8a] rounded-lg px-4 py-2 hover:border-[#1e3a8a]/80 hover:bg-white transition-all duration-300 shadow-[2px_2px_0px_0px_${
                  index % 3 === 0 ? '#dc2626' : index % 3 === 1 ? '#16a34a' : '#2563eb'
                }] hover:shadow-[4px_4px_0px_0px_${
                  index % 3 === 0 ? '#dc2626' : index % 3 === 1 ? '#16a34a' : '#2563eb'
                }] transform ${
                  index % 3 === 0 ? 'rotate-1' : index % 3 === 1 ? '-rotate-1' : 'rotate-0'
                } hover:rotate-0 cursor-pointer`}
              >
                <span className="text-[#1e3a8a] font-mono text-sm font-medium">
                  {medium}
                  {index % 12 === 0 && ' 📸'}
                  {index % 12 === 1 && ' 👥'}
                  {index % 12 === 2 && ' 🏙️'}
                  {index % 12 === 3 && ' 🎨'}
                  {index % 12 === 4 && ' 💭'}
                  {index % 12 === 5 && ' ✨'}
                  {index % 12 === 6 && ' 🎬'}
                  {index % 12 === 7 && ' 🎭'}
                  {index % 12 === 8 && ' 💻'}
                  {index % 12 === 9 && ' 📱'}
                  {index % 12 === 10 && ' 🥽'}
                  {index % 12 === 11 && ' 🎪'}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Ignatian Values Section */}
      <section ref={ignatianRef} className="py-20 bg-[#fffef5]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.8 }}
            animate={ignatianInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 60, scale: 0.8 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <Card className="bg-[#1e3a8a] border-4 border-white shadow-[12px_12px_0px_0px_#dc2626] transform hover:-translate-x-2 hover:-translate-y-2 transition-all duration-300 group">
              <CardContent className="p-8 md:p-12 text-center">
                <motion.div 
                  className="flex justify-center mb-6"
                  whileHover={{ scale: 1.1, rotate: 15 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="bg-white p-4 rounded-2xl shadow-lg transform -rotate-6 group-hover:rotate-0 transition-transform border-2 border-[#1e3a8a]">
                    <Heart className="h-12 w-12 text-red-500" />
                  </div>
                </motion.div>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  Faith Through the Lens
                  <span className="ml-2 text-2xl">✝️📸</span>
                </h3>
                <p className="text-white/90 text-lg leading-relaxed mb-6">
                  Our creativity is rooted in Ignatian spirituality! 🙏✨ We see God in all things – from the 
                  golden hour light that kisses a portrait to the raw emotion captured in street photography. 
                  Every click of the shutter is a moment of contemplation, every brushstroke digital or traditional 
                  is a prayer, and every collaborative project is an act of service. We create not just for beauty, 
                  but for the greater glory of God! 🌟
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <motion.div {...scaleOnHover}>
                    <Button 
                      size="lg"
                      className="bg-white text-[#1e3a8a] hover:bg-gray-100 shadow-lg transform hover:scale-105 transition-all duration-300 border-2 border-white"
                    >
                      <Heart className="mr-2 h-4 w-4" />
                      Find God in All Things 🔍
                    </Button>
                  </motion.div>
                  <motion.div {...scaleOnHover}>
                    <Button 
                      variant="outline" 
                      size="lg"
                      className="border-2 border-white text-white hover:bg-white/10 transition-all duration-300"
                    >
                      Ad Majorem Dei Gloriam ✨
                    </Button>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Exhibitions & Achievements Section */}
      <section ref={exhibitionsRef} className="py-20 bg-white border-y-4 border-[#1e3a8a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial="initial"
            animate={exhibitionsInView ? "animate" : "initial"}
            variants={staggerContainer}
          >
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-4 text-[#1e3a8a]"
              variants={fadeInUp}
            >
              Our Gallery of Glory
              <span className="ml-2 text-2xl">🏆</span>
            </motion.h2>
            <motion.p 
              className="text-[#1e3a8a]/80 max-w-3xl mx-auto text-lg"
              variants={fadeInUp}
            >
              Celebrating our creative milestones and community impact!
            </motion.p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-2 gap-8"
            initial="initial"
            animate={exhibitionsInView ? "animate" : "initial"}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp}>
              <Card className="bg-[#fffef5] border-4 border-[#1e3a8a] shadow-[4px_4px_0px_0px_#dc2626] group hover:shadow-[8px_8px_0px_0px_#dc2626] transition-all duration-300 h-full">
                <CardContent className="p-8">
                  <motion.div
                    className="flex justify-center mb-6"
                    whileHover={{ scale: 1.1, rotate: 10 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="bg-red-500 p-3 rounded-xl border-2 border-[#1e3a8a] transform rotate-3 group-hover:rotate-0 transition-transform">
                      <Award className="h-8 w-8 text-white" />
                    </div>
                  </motion.div>
                  <h3 className="text-xl font-bold text-[#1e3a8a] mb-4 text-center">Recent Exhibitions 🖼️</h3>
                  <ul className="space-y-3 text-[#1e3a8a]/80">
                    <motion.li 
                      className="flex items-center gap-2"
                      whileHover={{ x: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      Annual PIXELS Photography Showcase 📸
                    </motion.li>
                    <motion.li 
                      className="flex items-center gap-2"
                      whileHover={{ x: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Digital Arts Festival Participation 🎨
                    </motion.li>
                    <motion.li 
                      className="flex items-center gap-2"
                      whileHover={{ x: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      Community Visual Storytelling Project 📖
                    </motion.li>
                    <motion.li 
                      className="flex items-center gap-2"
                      whileHover={{ x: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      Interfaith Photography Exhibition ✝️
                    </motion.li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card className="bg-[#fffef5] border-4 border-[#1e3a8a] shadow-[4px_4px_0px_0px_#16a34a] group hover:shadow-[8px_8px_0px_0px_#16a34a] transition-all duration-300 h-full">
                <CardContent className="p-8">
                  <motion.div
                    className="flex justify-center mb-6"
                    whileHover={{ scale: 1.1, rotate: -10 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="bg-green-500 p-3 rounded-xl border-2 border-[#1e3a8a] transform -rotate-3 group-hover:rotate-0 transition-transform">
                      <Star className="h-8 w-8 text-white" />
                    </div>
                  </motion.div>
                  <h3 className="text-xl font-bold text-[#1e3a8a] mb-4 text-center">Awards & Recognition 🌟</h3>
                  <ul className="space-y-3 text-[#1e3a8a]/80">
                    <motion.li 
                      className="flex items-center gap-2"
                      whileHover={{ x: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Best Student Organization Portfolio 🏆
                    </motion.li>
                    <motion.li 
                      className="flex items-center gap-2"
                      whileHover={{ x: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      Community Impact Award 💝
                    </motion.li>
                    <motion.li 
                      className="flex items-center gap-2"
                      whileHover={{ x: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      Excellence in Visual Arts Education 📚
                    </motion.li>
                    <motion.li 
                      className="flex items-center gap-2"
                      whileHover={{ x: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Most Creative Campus Organization 🎭
                    </motion.li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="py-16 bg-white border-y-4 border-[#1e3a8a]">
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
                  className={`inline-flex items-center justify-center w-16 h-16 mb-4 rounded-2xl ${
                    index % 3 === 0 ? 'bg-red-500' : index % 3 === 1 ? 'bg-green-500' : 'bg-blue-500'
                  } transition-all duration-300 shadow-lg transform ${
                    index % 2 === 0 ? 'rotate-3' : '-rotate-3'
                  } group-hover:rotate-0 group-hover:scale-110 border-2 border-[#1e3a8a]`}
                  whileHover={{ scale: 1.1, rotate: 0 }}
                >
                  <stat.icon className="h-8 w-8 text-white transition-colors" />
                </motion.div>
                <motion.div 
                  className="text-3xl font-bold text-[#1e3a8a] mb-2"
                  initial={{ scale: 0 }}
                  animate={statsInView ? { scale: 1 } : { scale: 0 }}
                  transition={{ delay: index * 0.1 + 0.5, type: "spring", stiffness: 300 }}
                >
                  {stat.value}
                </motion.div>
                <div className="text-[#1e3a8a]/70 font-mono text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-[#1e3a8a] relative overflow-hidden border-y-4 border-white">
        {/* Enhanced background elements */}
        <div className="absolute inset-0 opacity-10">
          <motion.div 
            className="absolute top-10 left-10 w-20 h-20 bg-red-500 rounded-full"
            animate={{ 
              y: [0, -20, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <motion.div 
            className="absolute top-32 right-20 w-16 h-16 bg-green-500 rounded-full"
            animate={{ 
              y: [0, 15, 0],
              x: [0, -10, 0]
            }}
            transition={{ duration: 5, repeat: Infinity, delay: 1 }}
          />
          <motion.div 
            className="absolute bottom-20 left-20 w-12 h-12 bg-blue-500 rounded-full"
            animate={{ 
              rotate: [0, 360],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 6, repeat: Infinity, delay: 2 }}
          />
          <motion.div 
            className="absolute bottom-32 right-32 w-24 h-24 bg-white rounded-full"
            animate={{ 
              opacity: [0.1, 0.3, 0.1],
              scale: [1, 1.15, 1]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        </div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              Ready to Create Magic with PIXELS?
              <span className="text-2xl ml-2">🎨✨</span>
            </h2>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Join our community of passionate visual artists and pioneers! 🌟 Together, we&apos;ll explore 
              new frontiers in expressive electronic arts and celebrate the beauty of creative expression! 
              Let&apos;s paint the world with colors of joy and inspiration! 🌈💫
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div {...scaleOnHover}>
                <Button 
                  size="lg"
                  className="bg-white text-[#1e3a8a] hover:bg-gray-100 shadow-lg transition-all duration-300 transform hover:-rotate-2 font-semibold border-2 border-white"
                >
                  <Camera className="mr-2 h-5 w-5" />
                  Join PIXELS Family! 🎉
                </Button>
              </motion.div>
              <motion.div {...scaleOnHover}>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-2 border-white text-white hover:bg-white/10 hover:border-gray-200 transform hover:rotate-2 transition-all duration-300"
                >
                  <Eye className="mr-2 h-5 w-5" />
                  View Our Portfolio 📸
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default EnhancedAboutPixelsPage
