'use client'

import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { 
  Users, 
  Award, 
  BookOpen, 
  Lightbulb,
  Building,
  Globe,
  Zap,
  Heart,
  Star,
  Code,
  Brain,
  Rocket
} from 'lucide-react'
import Image from 'next/image'
import { useRef } from 'react'
import { FaEnvelope, FaMapMarkerAlt, FaFacebook, FaInstagram } from 'react-icons/fa'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

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

export function AboutTacticsPage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start']
  })

  const y = useTransform(scrollYProgress, [0, 1], [0, -50])
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1, 0.8])

  const stats = [
    { label: 'Member Institutions', value: '8+', icon: Building },
    { label: 'Research Projects', value: '50+', icon: Lightbulb },
    { label: 'Faculty Members', value: '100+', icon: Users },
    { label: 'Student Participants', value: '500+', icon: BookOpen },
  ]

  const coreValues = [
    {
      title: 'Academic Excellence',
      description: 'Pursuing the highest standards of scholarly achievement in computing sciences and technology research.',
      icon: Award,
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Innovation & Impact',
      description: 'Developing cutting-edge solutions that address real-world challenges and benefit society.',
      icon: Rocket,
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Collaborative Spirit',
      description: 'Fostering partnerships across disciplines, institutions, and industries for shared knowledge and growth.',
      icon: Heart,
      gradient: 'from-green-500 to-blue-500'
    }
  ]

  const initiatives = [
    {
      title: 'Research Symposiums',
      description: 'Annual conferences showcasing cutting-edge research in computing sciences and technology innovation.',
      icon: Brain
    },
    {
      title: 'Industry Partnerships',
      description: 'Collaborative projects with leading technology companies to bridge academia and industry needs.',
      icon: Building
    },
    {
      title: 'Faculty Development',
      description: 'Professional development programs to enhance teaching methodologies and research capabilities.',
      icon: Users
    },
    {
      title: 'Student Innovation Labs',
      description: 'State-of-the-art facilities for hands-on learning, prototyping, and collaborative research projects.',
      icon: Code
    },
    {
      title: 'Technology Transfer',
      description: 'Programs to commercialize research outcomes and bring academic innovations to market.',
      icon: Zap
    },
    {
      title: 'Community Outreach',
      description: 'Digital literacy programs and technology education initiatives for local communities.',
      icon: Globe
    }
  ]

  const leadership = [
    {
      name: 'Dr. Maria Santos',
      role: 'Consortium Director',
      description: 'Ph.D. in Computer Science, leading strategic initiatives and inter-institutional partnerships.',
      initials: 'DC'
    },
    {
      name: 'Dr. John Rodriguez',
      role: 'Research Coordinator',
      description: 'Expert in AI and machine learning, overseeing research programs and innovation initiatives.',
      initials: 'RC'
    },
    {
      name: 'Prof. Ana Cruz',
      role: 'Academic Coordinator',
      description: 'Specializing in curriculum development and faculty advancement in computing education.',
      initials: 'AC'
    }
  ]

  // Individual animation refs
  const heroRef = useRef(null)
  const statsRef = useRef(null)
  const missionRef = useRef(null)
  const visionRef = useRef(null)
  const valuesRef = useRef(null)
  const initiativesRef = useRef(null)
  const leadershipRef = useRef(null)
  const partnersRef = useRef(null)
  const contactRef = useRef(null)

  const heroInView = useInView(heroRef, { once: true, amount: 0.3 })
  const statsInView = useInView(statsRef, { once: true, amount: 0.3 })
  const missionInView = useInView(missionRef, { once: true, amount: 0.3 })
  const visionInView = useInView(visionRef, { once: true, amount: 0.3 })
  const valuesInView = useInView(valuesRef, { once: true, amount: 0.2 })
  const initiativesInView = useInView(initiativesRef, { once: true, amount: 0.2 })
  const leadershipInView = useInView(leadershipRef, { once: true, amount: 0.2 })
  const partnersInView = useInView(partnersRef, { once: true, amount: 0.3 })
  const contactInView = useInView(contactRef, { once: true, amount: 0.3 })

  return (
    <div ref={containerRef} className='min-h-screen bg-gradient-to-br from-white via-[#eaf6fd] to-[#dbeafe] text-[#1746A2] overflow-hidden'>
      {/* Hero Section */}
      <section className='relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-white via-[#eaf6fd] to-[#dbeafe]'>
        <motion.div 
          className='absolute inset-0 bg-gradient-to-r from-[#1746A2]/10 via-[#21A1E1]/10 to-[#eaf6fd]/10'
          style={{ y, opacity }}
        />
        
        <div ref={heroRef} className='relative max-w-4xl mx-auto px-4 py-20 sm:px-6 lg:px-8 flex flex-col items-center z-10'>
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
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Image
                    src='/tactics-logo.png'
                    alt='TACTICS Logo'
                    width={120}
                    height={120}
                    className='drop-shadow-xl rounded-2xl bg-white p-2 border border-[#eaf6fd]'
                    priority
                  />
                </motion.div>
                <motion.div 
                  className='absolute inset-0 bg-[#21A1E1]/20 rounded-2xl blur-xl'
                  animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>
            </motion.div>
            
            <motion.h1 
              className='text-4xl md:text-6xl font-extrabold mb-4 text-center bg-gradient-to-r from-[#1746A2] to-[#21A1E1] bg-clip-text text-transparent tracking-tight'
              variants={fadeInUp}
            >
              TACTICS
            </motion.h1>
            
            <motion.p 
              className='text-lg md:text-2xl font-medium text-center mb-6 max-w-2xl text-[#1746A2]'
              variants={fadeInUp}
            >
              The Ateneo Consortium of Technological, Information, and Computing Sciences
            </motion.p>
            
            <motion.p 
              className='text-base md:text-lg text-[#1746A2]/80 text-center mb-8 max-w-2xl leading-relaxed'
              variants={fadeInUp}
            >
              Bridging academic excellence with technological innovation. We foster collaboration, research, and development in computing sciences while preparing students for the digital future at Ateneo de Naga University.
            </motion.p>
            
            <motion.div 
              className='flex flex-col sm:flex-row gap-4 justify-center'
              variants={fadeInUp}
            >
              <motion.div {...scaleOnHover}>
                <Button
                  className='inline-flex items-center px-6 py-3 rounded-lg bg-gradient-to-r from-[#1746A2] to-[#21A1E1] text-white font-semibold shadow-lg'
                >
                  Contact Us
                  <FaEnvelope className='ml-2 text-lg' />
                </Button>
              </motion.div>
              <motion.div {...scaleOnHover}>
                <Button
                  variant="outline"
                  className='inline-flex items-center px-6 py-3 rounded-lg border border-[#21A1E1] text-[#1746A2] font-semibold hover:bg-[#eaf6fd]'
                >
                  Facebook
                  <FaFacebook className='ml-2 text-lg' />
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Floating Code Elements with enhanced animations */}
        <motion.div 
          className='absolute top-24 left-10 opacity-20 font-mono text-[#1746A2] text-sm'
          animate={{ 
            y: [-10, 10, -10],
            rotate: [-2, 2, -2],
            opacity: [0.1, 0.3, 0.1]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" as const }}
        >
          {'{ research: "innovation" }'}
        </motion.div>
        <motion.div 
          className='absolute top-40 right-20 opacity-20 font-mono text-[#21A1E1] text-sm'
          animate={{ 
            y: [10, -10, 10],
            rotate: [2, -2, 2],
            opacity: [0.1, 0.3, 0.1]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" as const, delay: 2 }}
        >
          {'consortium.collaborate()'}
        </motion.div>
        <motion.div 
          className='absolute bottom-20 left-20 opacity-20 font-mono text-[#1746A2] text-sm'
          animate={{ 
            y: [-5, 15, -5],
            rotate: [-1, 3, -1],
            opacity: [0.1, 0.3, 0.1]
          }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" as const, delay: 4 }}
        >
          {'while (learning) { advance(); }'}
        </motion.div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="py-16 bg-white/80 shadow-sm">
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
                  className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-2xl bg-gradient-to-br from-[#1746A2] to-[#21A1E1] group-hover:shadow-lg transition-all duration-300"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <stat.icon className="h-8 w-8 text-white" />
                </motion.div>
                <motion.div 
                  className="text-3xl font-bold text-[#1746A2] mb-2"
                  initial={{ scale: 0 }}
                  animate={statsInView ? { scale: 1 } : { scale: 0 }}
                  transition={{ delay: index * 0.1 + 0.5, type: "spring", stiffness: 300 }}
                >
                  {stat.value}
                </motion.div>
                <div className="text-[#1746A2]/70 font-mono text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section ref={missionRef} className='py-16'>
        <div className='max-w-3xl mx-auto px-4 sm:px-6 lg:px-8'>
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.8 }}
            animate={missionInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 60, scale: 0.8 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <Card className='bg-white/80 border-l-4 border-[#21A1E1] rounded-xl shadow-lg p-8 text-center group hover:shadow-xl transition-all duration-500'>
              <CardContent className="p-0">
                <motion.div
                  className="flex justify-center mb-6"
                  whileHover={{ scale: 1.1, rotate: 10 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="bg-gradient-to-r from-[#1746A2] to-[#21A1E1] p-4 rounded-2xl shadow-lg">
                    <Rocket className="h-12 w-12 text-white" />
                  </div>
                </motion.div>
                <h2 className='text-2xl md:text-3xl font-bold mb-4 bg-gradient-to-r from-[#1746A2] to-[#21A1E1] bg-clip-text text-transparent'>
                  Our Mission
                </h2>
                <p className='text-[#1746A2] text-lg md:text-xl mb-2'>
                  To cultivate a dynamic ecosystem of technological innovation and academic excellence, connecting students, faculty, and industry partners in advancing computing sciences research and education.
                </p>
                <p className='text-[#1746A2]/80 text-base'>
                  We serve as the catalyst for interdisciplinary collaboration, fostering the next generation of technology leaders while addressing real-world challenges through computing solutions.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Vision Section */}
      <section ref={visionRef} className='py-16'>
        <div className='max-w-3xl mx-auto px-4 sm:px-6 lg:px-8'>
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.8 }}
            animate={visionInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 60, scale: 0.8 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <Card className='bg-white/70 border-l-4 border-[#1746A2] rounded-xl shadow p-8 text-center group hover:shadow-xl transition-all duration-500'>
              <CardContent className="p-0">
                <motion.div
                  className="flex justify-center mb-6"
                  whileHover={{ scale: 1.1, rotate: -10 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="bg-gradient-to-r from-[#21A1E1] to-[#1746A2] p-4 rounded-2xl shadow-lg">
                    <Star className="h-12 w-12 text-white" />
                  </div>
                </motion.div>
                <h2 className='text-2xl md:text-3xl font-bold mb-4 bg-gradient-to-r from-[#1746A2] to-[#21A1E1] bg-clip-text text-transparent'>
                  Our Vision
                </h2>
                <p className='text-[#1746A2] text-lg md:text-xl mb-2'>
                  To be the premier academic consortium in the Philippines that drives transformative technological solutions and produces globally competitive computing professionals.
                </p>
                <p className='text-[#1746A2]/80 text-base'>
                  We envision a future where technology serves humanity, guided by Ignatian values and powered by collaborative innovation.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Core Values Section */}
      <section ref={valuesRef} className='py-16 bg-gradient-to-r from-[#eaf6fd] to-[#dbeafe]'>
        <div className='max-w-5xl mx-auto px-4 sm:px-6 lg:px-8'>
          <motion.div 
            className='text-center mb-12'
            initial="initial"
            animate={valuesInView ? "animate" : "initial"}
            variants={staggerContainer}
          >
            <motion.h2 
              className='text-2xl md:text-3xl font-bold mb-4 bg-gradient-to-r from-[#1746A2] to-[#21A1E1] bg-clip-text text-transparent'
              variants={fadeInUp}
            >
              Core Values
            </motion.h2>
            <motion.p 
              className='text-[#1746A2]/80 text-base md:text-lg'
              variants={fadeInUp}
            >
              Our foundational principles guide every initiative and collaboration within our consortium.
            </motion.p>
          </motion.div>
          <motion.div 
            className='grid md:grid-cols-3 gap-8'
            initial="initial"
            animate={valuesInView ? "animate" : "initial"}
            variants={staggerContainer}
          >
            {coreValues.map((value, index) => (
              <motion.div
                key={value.title}
                variants={fadeInUp}
                custom={index}
                whileHover={{ y: -10, scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card className='bg-white/80 rounded-lg shadow p-6 group hover:shadow-xl transition-all duration-300 h-full'>
                  <CardContent className="p-0">
                    <motion.div 
                      className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${value.gradient} p-2 mb-4 shadow-md`}
                      whileHover={{ scale: 1.1, rotate: 10 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <value.icon className="h-6 w-6 text-white" />
                    </motion.div>
                    <h3 className='font-bold text-[#1746A2] mb-2 group-hover:text-[#21A1E1] transition-colors'>{value.title}</h3>
                    <p className='text-[#1746A2]/80 text-sm leading-relaxed'>{value.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Activities/Key Initiatives Section */}
      <section ref={initiativesRef} className='py-16'>
        <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.8 }}
            animate={initiativesInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 60, scale: 0.8 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <Card className='bg-white/80 rounded-xl shadow p-8 group hover:shadow-xl transition-all duration-500'>
              <CardContent className="p-0">
                <motion.div
                  className="flex justify-center mb-6"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="bg-gradient-to-r from-[#1746A2] to-[#21A1E1] p-4 rounded-2xl shadow-lg">
                    <Lightbulb className="h-12 w-12 text-white" />
                  </div>
                </motion.div>
                <h2 className='text-2xl md:text-3xl font-bold mb-6 bg-gradient-to-r from-[#1746A2] to-[#21A1E1] bg-clip-text text-transparent text-center'>
                  Key Initiatives & Programs
                </h2>
                <motion.div 
                  className='grid md:grid-cols-2 gap-6'
                  initial="initial"
                  animate={initiativesInView ? "animate" : "initial"}
                  variants={staggerContainer}
                >
                  {initiatives.map((initiative, index) => (
                    <motion.div 
                      key={initiative.title}
                      className='space-y-4'
                      variants={fadeInUp}
                      custom={index}
                    >
                      <motion.div 
                        className='border-l-4 border-[#21A1E1] pl-4 group/item hover:border-[#1746A2] transition-all duration-300'
                        whileHover={{ x: 10, scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <motion.div
                            className="bg-gradient-to-r from-[#21A1E1] to-[#1746A2] p-2 rounded-lg"
                            whileHover={{ scale: 1.1, rotate: 10 }}
                            transition={{ type: "spring", stiffness: 300 }}
                          >
                            <initiative.icon className="h-4 w-4 text-white" />
                          </motion.div>
                          <h3 className='font-semibold text-[#1746A2] group-hover/item:text-[#21A1E1] transition-colors'>
                            {initiative.title}
                          </h3>
                        </div>
                        <p className='text-[#1746A2]/80 text-sm leading-relaxed'>{initiative.description}</p>
                      </motion.div>
                    </motion.div>
                  ))}
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Leadership Section */}
      <section ref={leadershipRef} className='py-16 bg-gradient-to-r from-[#eaf6fd] to-[#dbeafe]'>
        <div className='max-w-5xl mx-auto px-4 sm:px-6 lg:px-8'>
          <motion.div 
            className='text-center mb-12'
            initial="initial"
            animate={leadershipInView ? "animate" : "initial"}
            variants={staggerContainer}
          >
            <motion.h2 
              className='text-2xl md:text-3xl font-bold mb-4 bg-gradient-to-r from-[#1746A2] to-[#21A1E1] bg-clip-text text-transparent'
              variants={fadeInUp}
            >
              Consortium Leadership
            </motion.h2>
            <motion.p 
              className='text-[#1746A2]/80 text-base md:text-lg'
              variants={fadeInUp}
            >
              Distinguished faculty and administrators leading TACTICS&apos; mission of technological advancement and academic excellence.
            </motion.p>
          </motion.div>
          <motion.div 
            className='grid md:grid-cols-3 gap-8'
            initial="initial"
            animate={leadershipInView ? "animate" : "initial"}
            variants={staggerContainer}
          >
            {leadership.map((leader, index) => (
              <motion.div
                key={leader.name}
                variants={fadeInUp}
                custom={index}
                whileHover={{ y: -10, scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card className='bg-white/80 rounded-lg shadow p-6 text-center group hover:shadow-xl transition-all duration-300 h-full'>
                  <CardContent className="p-0">
                    <motion.div 
                      className='w-20 h-20 rounded-full bg-gradient-to-br from-[#1746A2] to-[#21A1E1] mx-auto mb-4 flex items-center justify-center shadow-lg'
                      whileHover={{ scale: 1.1, rotate: 10 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <span className='text-white font-bold text-lg'>{leader.initials}</span>
                    </motion.div>
                    <h3 className='font-bold text-[#1746A2] mb-1 group-hover:text-[#21A1E1] transition-colors'>{leader.name}</h3>
                    <p className='text-[#1746A2]/80 mb-2 font-medium'>{leader.role}</p>
                    <p className='text-[#1746A2]/60 text-sm leading-relaxed'>{leader.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Partners Section */}
      <section ref={partnersRef} className='py-16'>
        <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.8 }}
            animate={partnersInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 60, scale: 0.8 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <Card className='bg-white/80 rounded-xl shadow p-8 text-center group hover:shadow-xl transition-all duration-500'>
              <CardContent className="p-0">
                <motion.div
                  className="flex justify-center mb-6"
                  whileHover={{ scale: 1.1, rotate: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="bg-gradient-to-r from-[#21A1E1] to-[#1746A2] p-4 rounded-2xl shadow-lg">
                    <Users className="h-12 w-12 text-white" />
                  </div>
                </motion.div>
                <h2 className='text-2xl md:text-3xl font-bold mb-6 bg-gradient-to-r from-[#1746A2] to-[#21A1E1] bg-clip-text text-transparent'>
                  Strategic Partners & Collaborators
                </h2>
                <motion.div 
                  className='grid md:grid-cols-2 gap-6 text-left'
                  initial="initial"
                  animate={partnersInView ? "animate" : "initial"}
                  variants={staggerContainer}
                >
                  <motion.div variants={fadeInUp}>
                    <div className="flex items-center gap-3 mb-3">
                      <motion.div
                        className="bg-gradient-to-r from-[#1746A2] to-[#21A1E1] p-2 rounded-lg"
                        whileHover={{ scale: 1.1, rotate: 10 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <BookOpen className="h-5 w-5 text-white" />
                      </motion.div>
                      <h3 className='font-semibold text-[#1746A2]'>Academic Partners</h3>
                    </div>
                    <ul className='space-y-2 text-[#1746A2]/80'>
                      <motion.li 
                        className="flex items-center gap-2"
                        whileHover={{ x: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <div className="w-2 h-2 bg-[#21A1E1] rounded-full"></div>
                        Leading universities in the Philippines and Asia
                      </motion.li>
                      <motion.li 
                        className="flex items-center gap-2"
                        whileHover={{ x: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <div className="w-2 h-2 bg-[#21A1E1] rounded-full"></div>
                        International research institutions
                      </motion.li>
                      <motion.li 
                        className="flex items-center gap-2"
                        whileHover={{ x: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <div className="w-2 h-2 bg-[#21A1E1] rounded-full"></div>
                        Regional computing consortiums
                      </motion.li>
                    </ul>
                  </motion.div>
                  <motion.div variants={fadeInUp}>
                    <div className="flex items-center gap-3 mb-3">
                      <motion.div
                        className="bg-gradient-to-r from-[#21A1E1] to-[#1746A2] p-2 rounded-lg"
                        whileHover={{ scale: 1.1, rotate: -10 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <Building className="h-5 w-5 text-white" />
                      </motion.div>
                      <h3 className='font-semibold text-[#1746A2]'>Industry Partners</h3>
                    </div>
                    <ul className='space-y-2 text-[#1746A2]/80'>
                      <motion.li 
                        className="flex items-center gap-2"
                        whileHover={{ x: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <div className="w-2 h-2 bg-[#1746A2] rounded-full"></div>
                        Technology multinational corporations
                      </motion.li>
                      <motion.li 
                        className="flex items-center gap-2"
                        whileHover={{ x: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <div className="w-2 h-2 bg-[#1746A2] rounded-full"></div>
                        Local software development companies
                      </motion.li>
                      <motion.li 
                        className="flex items-center gap-2"
                        whileHover={{ x: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <div className="w-2 h-2 bg-[#1746A2] rounded-full"></div>
                        Government technology agencies
                      </motion.li>
                    </ul>
                  </motion.div>
                </motion.div>
                <motion.div 
                  className='mt-6 p-4 bg-[#eaf6fd] rounded-lg'
                  initial={{ opacity: 0, y: 20 }}
                  animate={partnersInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                >
                  <p className='text-[#1746A2]/80 text-sm leading-relaxed'>
                    Our partnerships enable knowledge exchange, joint research initiatives, and opportunities for students and faculty to engage with cutting-edge technologies and real-world applications.
                  </p>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Contact & Socials Section */}
      <section ref={contactRef} className='py-16 bg-gradient-to-r from-[#eaf6fd] to-[#dbeafe]'>
        <div className='max-w-2xl mx-auto px-4 sm:px-6 lg:px-8'>
          <motion.div 
            className='text-center mb-8'
            initial="initial"
            animate={contactInView ? "animate" : "initial"}
            variants={staggerContainer}
          >
            <motion.h2 
              className='text-2xl md:text-3xl font-bold mb-4 bg-gradient-to-r from-[#1746A2] to-[#21A1E1] bg-clip-text text-transparent'
              variants={fadeInUp}
            >
              Get In Touch
            </motion.h2>
            <motion.p 
              className='text-[#1746A2]/80 text-base md:text-lg'
              variants={fadeInUp}
            >
              Connect with TACTICS and join our community of innovation
            </motion.p>
          </motion.div>
          <motion.div 
            className='flex flex-col gap-6 md:gap-8'
            initial="initial"
            animate={contactInView ? "animate" : "initial"}
            variants={staggerContainer}
          >
            <motion.div 
              className='flex items-center gap-4 p-4 bg-white/80 rounded-lg shadow group hover:shadow-md transition-all duration-300'
              variants={fadeInUp}
              whileHover={{ x: 10, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.div
                className="bg-gradient-to-r from-[#1746A2] to-[#21A1E1] p-3 rounded-full"
                whileHover={{ scale: 1.1, rotate: 10 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <FaEnvelope className='text-white text-lg' aria-label='Email' />
              </motion.div>
              <a
                href='mailto:tactics_org@gbox.adnu.edu.ph'
                className='text-[#1746A2] hover:text-[#21A1E1] hover:underline break-all font-medium transition-colors duration-300'
              >
                tactics_org@gbox.adnu.edu.ph
              </a>
            </motion.div>
            <motion.div 
              className='flex items-center gap-4 p-4 bg-white/80 rounded-lg shadow group hover:shadow-md transition-all duration-300'
              variants={fadeInUp}
              whileHover={{ x: 10, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.div
                className="bg-gradient-to-r from-[#21A1E1] to-[#1746A2] p-3 rounded-full"
                whileHover={{ scale: 1.1, rotate: -10 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <FaMapMarkerAlt className='text-white text-lg' aria-label='Location' />
              </motion.div>
              <span className='text-[#1746A2] font-medium'>
                Room A8, 2nd Floor Xavier Hall, Ateneo de Naga University
              </span>
            </motion.div>
            <motion.div 
              className='flex items-center gap-4 p-4 bg-white/80 rounded-lg shadow group hover:shadow-md transition-all duration-300'
              variants={fadeInUp}
              whileHover={{ x: 10, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex gap-3">
                <motion.a
                  href='https://facebook.com/tactics_adnu'
                  target='_blank'
                  rel='noopener noreferrer'
                  aria-label='TACTICS Facebook'
                  className='bg-gradient-to-r from-[#1746A2] to-[#21A1E1] p-3 rounded-full text-white hover:shadow-lg transition-all duration-300'
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaFacebook className="text-lg" />
                </motion.a>
                <motion.a
                  href='https://instagram.com/tactics_adnu'
                  target='_blank'
                  rel='noopener noreferrer'
                  aria-label='TACTICS Instagram'
                  className='bg-gradient-to-r from-[#21A1E1] to-[#1746A2] p-3 rounded-full text-white hover:shadow-lg transition-all duration-300'
                  whileHover={{ scale: 1.1, rotate: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaInstagram className="text-lg" />
                </motion.a>
              </div>
              <span className='text-[#1746A2] font-medium'>/tactics_adnu</span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-[#1746A2] to-[#21A1E1]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              Ready to Shape the Future of Technology?
            </h2>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Join TACTICS and be part of a consortium that&apos;s driving innovation, fostering collaboration, 
              and building the next generation of technology leaders.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div {...scaleOnHover}>
                <Button 
                  size="lg"
                  className="bg-white text-[#1746A2] hover:bg-gray-100 shadow-lg font-semibold"
                >
                  <Building className="mr-2 h-5 w-5" />
                  Join Our Consortium
                </Button>
              </motion.div>
              <motion.div {...scaleOnHover}>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-2 border-white text-white hover:bg-white/10 hover:border-gray-200"
                >
                  <Globe className="mr-2 h-5 w-5" />
                  Learn More
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
