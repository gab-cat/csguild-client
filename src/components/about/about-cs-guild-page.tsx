'use client'

import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { 
  Code2, 
  Users, 
  Lightbulb, 
  Rocket, 
  Heart, 
  BookOpen, 
  Trophy, 
  Star,
  ArrowRight,
  Github,
  Linkedin,
  Mail,
  Globe
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

const AboutCSGuildPage = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start']
  })

  const y = useTransform(scrollYProgress, [0, 1], [0, -50])
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1, 0.8])

  const stats = [
    { label: 'Active Members', value: '500+', icon: Users },
    { label: 'Projects Completed', value: '150+', icon: Trophy },
    { label: 'Skills Workshops', value: '75+', icon: BookOpen },
    { label: 'Years Active', value: '5+', icon: Star },
  ]

  const values = [
    {
      icon: Code2,
      title: 'Innovation First',
      description: 'We push boundaries and embrace cutting-edge technologies to create solutions that matter.',
      gradient: 'from-pink-500 to-rose-500'
    },
    {
      icon: Users,
      title: 'Community Driven',
      description: 'Building a supportive network where every member grows through collaboration and mentorship.',
      gradient: 'from-violet-500 to-purple-500'
    },
    {
      icon: Lightbulb,
      title: 'Continuous Learning',
      description: 'Fostering a culture of curiosity and lifelong learning in the ever-evolving tech landscape.',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Heart,
      title: 'Passion for Code',
      description: 'United by our love for programming and commitment to crafting beautiful, functional software.',
      gradient: 'from-orange-500 to-red-500'
    }
  ]

  const team = [
    {
      name: 'Alex Chen',
      role: 'Guild Master',
      bio: 'Full-stack developer with 8+ years experience. Passionate about mentoring the next generation of developers.',
      avatar: '',
      links: { github: '#', linkedin: '#', email: '#' }
    },
    {
      name: 'Sarah Rodriguez',
      role: 'Vice President',
      bio: 'AI/ML enthusiast and competitive programmer. Leading our technical workshops and hackathons.',
      avatar: '',
      links: { github: '#', linkedin: '#', email: '#' }
    },
    {
      name: 'Jordan Kim',
      role: 'Community Manager',
      bio: 'DevOps engineer and open-source contributor. Building bridges between industry and academia.',
      avatar: '',
      links: { github: '#', linkedin: '#', email: '#' }
    }
  ]

  // Individual animation refs
  const heroRef = useRef(null)
  const statsRef = useRef(null)
  const missionRef = useRef(null)
  const valuesRef = useRef(null)
  const teamRef = useRef(null)

  const heroInView = useInView(heroRef, { once: true, amount: 0.3 })
  const statsInView = useInView(statsRef, { once: true, amount: 0.3 })
  const missionInView = useInView(missionRef, { once: true, amount: 0.3 })
  const valuesInView = useInView(valuesRef, { once: true, amount: 0.2 })
  const teamInView = useInView(teamRef, { once: true, amount: 0.2 })

  return (
    <div ref={containerRef} className="min-h-screen bg-black text-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black">
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-pink-500/10 via-violet-500/10 to-cyan-500/10"
          style={{ y, opacity }}
        />
        
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
                  className="relative"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Code2 className="h-20 w-20 text-pink-400" />
                  <motion.div 
                    className="absolute inset-0 bg-pink-400/20 rounded-lg blur-xl"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </motion.div>
              </motion.div>
            </motion.div>
            
            <motion.h1 
              className="text-4xl md:text-6xl font-bold mb-6"
              variants={fadeInUp}
            >
              <motion.span 
                className="bg-gradient-to-r from-pink-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                CS Guild
              </motion.span>
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-gray-300 mb-4 font-space-mono"
              variants={fadeInUp}
            >
              {"// Code • Learn • Build • Innovate"}
            </motion.p>
            
            <motion.p 
              className="text-lg text-gray-400 max-w-3xl mx-auto mb-8 leading-relaxed"
              variants={fadeInUp}
            >
              We are a vibrant community of computer science students, developers, and tech enthusiasts 
              united by our passion for technology and commitment to continuous learning. Join us as we 
              shape the future, one line of code at a time.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              variants={fadeInUp}
            >
              <motion.div {...scaleOnHover}>
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 text-white shadow-lg shadow-pink-500/25 transition-all duration-300 group"
                >
                  Join Our Guild
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
                  className="border-pink-500/50 text-pink-400 hover:bg-pink-500/10 hover:border-pink-400"
                >
                  View Projects
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Floating Code Elements with enhanced animations */}
        <motion.div 
          className="absolute top-20 left-10 opacity-20 font-mono text-pink-400 text-sm"
          animate={{ 
            y: [-10, 10, -10],
            rotate: [-2, 2, -2],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" as const }}
        >
          {'{ creativity: true }'}
        </motion.div>
        <motion.div 
          className="absolute top-40 right-20 opacity-20 font-mono text-violet-400 text-sm"
          animate={{ 
            y: [10, -10, 10],
            rotate: [2, -2, 2],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" as const, delay: 2 }}
        >
          {'console.log("Hello, World!")'}
        </motion.div>
        <motion.div 
          className="absolute bottom-20 left-20 opacity-20 font-mono text-cyan-400 text-sm"
          animate={{ 
            y: [-5, 15, -5],
            rotate: [-1, 3, -1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" as const, delay: 4 }}
        >
          {'while (learning) { grow(); }'}
        </motion.div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="py-16 bg-gray-900/50">
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
                  className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-2xl bg-gradient-to-br from-pink-500/20 to-violet-500/20 group-hover:from-pink-500/30 group-hover:to-violet-500/30 transition-all duration-300"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <stat.icon className="h-8 w-8 text-pink-400 group-hover:text-pink-300 transition-colors" />
                </motion.div>
                <motion.div 
                  className="text-3xl font-bold text-white mb-2"
                  initial={{ scale: 0 }}
                  animate={statsInView ? { scale: 1 } : { scale: 0 }}
                  transition={{ delay: index * 0.1 + 0.5, type: "spring", stiffness: 300 }}
                >
                  {stat.value}
                </motion.div>
                <div className="text-gray-400 font-space-mono text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section ref={missionRef} className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial="initial"
            animate={missionInView ? "animate" : "initial"}
            variants={staggerContainer}
          >
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-4"
              variants={fadeInUp}
            >
              <span className="bg-gradient-to-r from-pink-400 to-violet-400 bg-clip-text text-transparent">
                Our Mission
              </span>
            </motion.h2>
            <motion.p 
              className="text-gray-400 max-w-3xl mx-auto text-lg"
              variants={fadeInUp}
            >
              Empowering the next generation of developers through collaboration, innovation, and continuous learning.
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.8 }}
            animate={missionInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 60, scale: 0.8 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <Card className="bg-gradient-to-br from-gray-900 to-black border-pink-500/20 mb-12 group hover:border-pink-500/40 transition-all duration-500">
              <CardContent className="p-8 md:p-12">
                <div className="text-center">
                  <motion.div
                    className="flex justify-center mb-6"
                    whileHover={{ scale: 1.1, rotate: 10 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="relative">
                      <Rocket className="h-16 w-16 text-pink-400" />
                      <motion.div
                        className="absolute inset-0 bg-pink-400/20 rounded-lg blur-xl"
                        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    </div>
                  </motion.div>
                  <h3 className="text-2xl font-bold text-white mb-4">Building Tomorrow&apos;s Tech Leaders</h3>
                  <p className="text-gray-300 text-lg leading-relaxed max-w-4xl mx-auto">
                    At CS Guild, we believe that great software is built by great people working together. 
                    Our mission is to create an inclusive environment where students can explore cutting-edge 
                    technologies, work on real-world projects, and develop both technical skills and leadership 
                    abilities. We&apos;re not just learning to code – we&apos;re learning to innovate, collaborate, and 
                    make a meaningful impact in the world through technology.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section ref={valuesRef} className="py-20 bg-gray-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial="initial"
            animate={valuesInView ? "animate" : "initial"}
            variants={staggerContainer}
          >
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-4"
              variants={fadeInUp}
            >
              <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
                Our Values
              </span>
            </motion.h2>
            <motion.p 
              className="text-gray-400 max-w-3xl mx-auto text-lg"
              variants={fadeInUp}
            >
              The principles that guide everything we do.
            </motion.p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-2 gap-8"
            initial="initial"
            animate={valuesInView ? "animate" : "initial"}
            variants={staggerContainer}
          >
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                variants={fadeInUp}
                custom={index}
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card className="bg-black/50 border-gray-800 hover:border-pink-500/30 transition-all duration-300 group h-full">
                  <CardHeader>
                    <motion.div 
                      className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${value.gradient} p-2 mb-4`}
                      whileHover={{ scale: 1.1, rotate: 10 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <value.icon className="h-6 w-6 text-white" />
                    </motion.div>
                    <CardTitle className="text-white group-hover:text-pink-400 transition-colors">
                      {value.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-400 text-base leading-relaxed">
                      {value.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section ref={teamRef} className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial="initial"
            animate={teamInView ? "animate" : "initial"}
            variants={staggerContainer}
          >
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-4"
              variants={fadeInUp}
            >
              <span className="bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent">
                Leadership Team
              </span>
            </motion.h2>
            <motion.p 
              className="text-gray-400 max-w-3xl mx-auto text-lg"
              variants={fadeInUp}
            >
              Meet the passionate individuals leading our community forward.
            </motion.p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-3 gap-8"
            initial="initial"
            animate={teamInView ? "animate" : "initial"}
            variants={staggerContainer}
          >
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                variants={fadeInUp}
                custom={index}
                whileHover={{ y: -10, scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card className="bg-gradient-to-br from-gray-900 to-black border-pink-500/20 group hover:border-pink-500/40 transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <motion.div 
                      className="w-24 h-24 rounded-full bg-gradient-to-br from-pink-500 to-violet-500 mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                      whileHover={{ rotate: 10 }}
                    >
                      <span className="text-2xl font-bold text-white">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </motion.div>
                    <h3 className="text-xl font-bold text-white mb-2">{member.name}</h3>
                    <p className="text-pink-400 font-space-mono text-sm mb-4">{"// " + member.role}</p>
                    <p className="text-gray-400 text-sm leading-relaxed mb-6">{member.bio}</p>
                    
                    <div className="flex justify-center gap-3">
                      <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:bg-pink-500/10">
                          <Github className="h-4 w-4 text-gray-400 hover:text-pink-400" />
                        </Button>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:bg-violet-500/10">
                          <Linkedin className="h-4 w-4 text-gray-400 hover:text-violet-400" />
                        </Button>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:bg-cyan-500/10">
                          <Mail className="h-4 w-4 text-gray-400 hover:text-cyan-400" />
                        </Button>
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-pink-500/10 via-violet-500/10 to-cyan-500/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              <span className="bg-gradient-to-r from-pink-400 to-violet-400 bg-clip-text text-transparent">
                Ready to Join the Guild?
              </span>
            </h2>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Be part of a community that&apos;s building the future of technology. 
              Learn, grow, and create amazing things with fellow developers.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div {...scaleOnHover}>
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 text-white shadow-lg shadow-pink-500/25 transition-all duration-300 group"
                >
                  <Users className="mr-2 h-5 w-5" />
                  Join CS Guild
                </Button>
              </motion.div>
              <motion.div {...scaleOnHover}>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-violet-500/50 text-violet-400 hover:bg-violet-500/10 hover:border-violet-400"
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

export default AboutCSGuildPage
