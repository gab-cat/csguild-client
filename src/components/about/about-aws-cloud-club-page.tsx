'use client'

import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { 
  Cloud, 
  Users, 
  Award, 
  Rocket, 
  BookOpen, 
  Globe, 
  Zap,
  Star,
  ArrowRight,
  ExternalLink,
  Building,
  Lightbulb,
  TrendingUp,
  Shield
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

const AboutAwsCloudClubPage = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start']
  })

  const y = useTransform(scrollYProgress, [0, 1], [0, -50])
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1, 0.8])

  const stats = [
    { label: 'Active Members', value: '200+', icon: Users },
    { label: 'Cloud Projects', value: '50+', icon: Cloud },
    { label: 'AWS Certifications', value: '75+', icon: Award },
    { label: 'Workshops Conducted', value: '30+', icon: BookOpen },
  ]

  const benefits = [
    {
      icon: Cloud,
      title: 'Hands-on Cloud Experience',
      description: 'Get practical experience with AWS services through guided labs and real-world projects.',
      gradient: 'from-orange-500 to-red-500'
    },
    {
      icon: Award,
      title: 'Industry Certifications',
      description: 'Prepare for AWS certifications with study groups and certification guidance.',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Users,
      title: 'Professional Network',
      description: 'Connect with cloud professionals, AWS experts, and fellow students passionate about cloud computing.',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: Rocket,
      title: 'Career Opportunities',
      description: 'Access to AWS career resources, job board, and recruitment opportunities with cloud-focused companies.',
      gradient: 'from-green-500 to-blue-500'
    }
  ]

  const programs = [
    {
      title: 'AWS Cloud Practitioner Bootcamp',
      description: 'Comprehensive preparation for the AWS Certified Cloud Practitioner exam',
      icon: BookOpen,
      color: 'text-orange-400'
    },
    {
      title: 'Solutions Architecture Workshop',
      description: 'Design and deploy scalable, secure cloud architectures on AWS',
      icon: Building,
      color: 'text-blue-400'
    },
    {
      title: 'DevOps & Automation Lab',
      description: 'Learn CI/CD pipelines, infrastructure as code, and cloud automation',
      icon: Zap,
      color: 'text-purple-400'
    },
    {
      title: 'AI/ML on AWS',
      description: 'Explore machine learning services and build intelligent applications',
      icon: Lightbulb,
      color: 'text-cyan-400'
    },
    {
      title: 'Cloud Security Fundamentals',
      description: 'Best practices for securing cloud infrastructure and applications',
      icon: Shield,
      color: 'text-green-400'
    },
    {
      title: 'Startup Cloud Solutions',
      description: 'Learn how startups leverage AWS to scale and innovate rapidly',
      icon: TrendingUp,
      color: 'text-pink-400'
    }
  ]

  const awsServices = [
    'Amazon EC2', 'Amazon S3', 'AWS Lambda', 'Amazon RDS', 'Amazon VPC',
    'AWS CloudFormation', 'Amazon EKS', 'AWS CodePipeline', 'Amazon SageMaker'
  ]

  // Individual animation refs
  const heroRef = useRef(null)
  const statsRef = useRef(null)
  const aboutRef = useRef(null)
  const benefitsRef = useRef(null)
  const programsRef = useRef(null)
  const servicesRef = useRef(null)
  const educateRef = useRef(null)

  const heroInView = useInView(heroRef, { once: true, amount: 0.3 })
  const statsInView = useInView(statsRef, { once: true, amount: 0.3 })
  const aboutInView = useInView(aboutRef, { once: true, amount: 0.3 })
  const benefitsInView = useInView(benefitsRef, { once: true, amount: 0.2 })
  const programsInView = useInView(programsRef, { once: true, amount: 0.2 })
  const servicesInView = useInView(servicesRef, { once: true, amount: 0.3 })
  const educateInView = useInView(educateRef, { once: true, amount: 0.3 })

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 text-gray-900 overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-orange-100 via-white to-amber-100">
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-orange-500/5 via-amber-500/5 to-orange-500/5"
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
                  <Cloud className="h-20 w-20 text-orange-600" />
                  <motion.div 
                    className="absolute inset-0 bg-orange-500/20 rounded-lg blur-xl"
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
                className="bg-gradient-to-r from-orange-600 via-orange-500 to-amber-600 bg-clip-text text-transparent"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                AWS Cloud Club
              </motion.span>
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-orange-700 mb-4 font-mono font-semibold"
              variants={fadeInUp}
            >
              {"// Learn • Build • Scale • Deploy"}
            </motion.p>
            
            <motion.p 
              className="text-lg text-gray-700 max-w-3xl mx-auto mb-8 leading-relaxed"
              variants={fadeInUp}
            >
              Your gateway to the world of cloud computing. Join our vibrant community of students, 
              developers, and cloud enthusiasts as we explore Amazon Web Services, build scalable 
              solutions, and prepare for the future of technology.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              variants={fadeInUp}
            >
              <motion.div {...scaleOnHover}>
                <Button 
                  size="lg"
                  className="bg-orange-600 hover:bg-orange-700 text-white shadow-lg shadow-orange-600/25 transition-all duration-300 border-0"
                >
                  Join Cloud Club
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
                  className="border-2 border-orange-600 text-orange-700 hover:bg-orange-50 hover:border-orange-700 bg-white"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  AWS Educate
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Floating Cloud Elements with enhanced animations */}
        <motion.div 
          className="absolute top-20 left-10 opacity-30 font-mono text-orange-600 text-sm"
          animate={{ 
            y: [-10, 10, -10],
            rotate: [-2, 2, -2],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" as const }}
        >
          {'{ scalability: "unlimited" }'}
        </motion.div>
        <motion.div 
          className="absolute top-40 right-20 opacity-30 font-mono text-orange-700 text-sm"
          animate={{ 
            y: [10, -10, 10],
            rotate: [2, -2, 2],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" as const, delay: 2 }}
        >
          {'aws.deploy(innovation)'}
        </motion.div>
        <motion.div 
          className="absolute bottom-20 left-20 opacity-30 font-mono text-amber-600 text-sm"
          animate={{ 
            y: [-5, 15, -5],
            rotate: [-1, 3, -1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" as const, delay: 4 }}
        >
          {'while (learning) { scale(); }'}
        </motion.div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="py-16 bg-white shadow-sm">
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
                  className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-2xl bg-orange-100 group-hover:bg-orange-200 transition-all duration-300 shadow-md"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <stat.icon className="h-8 w-8 text-orange-600 group-hover:text-orange-700 transition-colors" />
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

      {/* About AWS Cloud Club */}
      <section ref={aboutRef} className="py-20 bg-gradient-to-br from-orange-50 to-amber-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial="initial"
            animate={aboutInView ? "animate" : "initial"}
            variants={staggerContainer}
          >
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-4"
              variants={fadeInUp}
            >
              <span className="bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                About AWS Cloud Club
              </span>
            </motion.h2>
            <motion.p 
              className="text-gray-700 max-w-3xl mx-auto text-lg"
              variants={fadeInUp}
            >
              Empowering students to master cloud computing through hands-on learning and real-world experience.
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.8 }}
            animate={aboutInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 60, scale: 0.8 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <Card className="bg-white border-orange-200 shadow-lg mb-12 group hover:border-orange-300 transition-all duration-500">
              <CardContent className="p-8 md:p-12">
                <div className="text-center">
                  <motion.div
                    className="flex justify-center mb-6"
                    whileHover={{ scale: 1.1, rotate: 10 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="relative">
                      <Globe className="h-16 w-16 text-orange-600" />
                      <motion.div
                        className="absolute inset-0 bg-orange-400/20 rounded-lg blur-xl"
                        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    </div>
                  </motion.div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Bridging Education and Industry</h3>
                  <p className="text-gray-700 text-lg leading-relaxed max-w-4xl mx-auto">
                    AWS Cloud Club is your launchpad into the world of cloud computing. We provide students with 
                    hands-on experience using Amazon Web Services, the world&apos;s most widely adopted cloud platform. 
                    Through workshops, projects, and certification programs, we prepare our members for high-demand 
                    careers in cloud computing, DevOps, and modern software development.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section ref={benefitsRef} className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial="initial"
            animate={benefitsInView ? "animate" : "initial"}
            variants={staggerContainer}
          >
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-4"
              variants={fadeInUp}
            >
              <span className="bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                Why Join AWS Cloud Club?
              </span>
            </motion.h2>
            <motion.p 
              className="text-gray-700 max-w-3xl mx-auto text-lg"
              variants={fadeInUp}
            >
              Unlock your potential in cloud computing with exclusive benefits and opportunities.
            </motion.p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-2 gap-8"
            initial="initial"
            animate={benefitsInView ? "animate" : "initial"}
            variants={staggerContainer}
          >
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                variants={fadeInUp}
                custom={index}
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200 hover:border-orange-300 transition-all duration-300 group shadow-md hover:shadow-lg h-full">
                  <CardHeader>
                    <motion.div 
                      className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${benefit.gradient} p-2 mb-4 shadow-md`}
                      whileHover={{ scale: 1.1, rotate: 10 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <benefit.icon className="h-6 w-6 text-white" />
                    </motion.div>
                    <CardTitle className="text-gray-900 group-hover:text-orange-700 transition-colors">
                      {benefit.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-700 text-base leading-relaxed">
                      {benefit.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Programs Section */}
      <section ref={programsRef} className="py-20 bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial="initial"
            animate={programsInView ? "animate" : "initial"}
            variants={staggerContainer}
          >
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-4"
              variants={fadeInUp}
            >
              <span className="bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                Learning Programs
              </span>
            </motion.h2>
            <motion.p 
              className="text-gray-700 max-w-3xl mx-auto text-lg"
              variants={fadeInUp}
            >
              Comprehensive programs designed to take you from cloud novice to cloud expert.
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
                <Card className="bg-white border-orange-200 hover:border-orange-300 transition-all duration-300 group shadow-md hover:shadow-lg h-full">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 10 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <program.icon className={`h-8 w-8 ${program.color} mt-1`} />
                      </motion.div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-orange-700 transition-colors">
                          {program.title}
                        </h3>
                        <p className="text-gray-700 text-sm leading-relaxed">
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

      {/* AWS Services Section */}
      <section ref={servicesRef} className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial="initial"
            animate={servicesInView ? "animate" : "initial"}
            variants={staggerContainer}
          >
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-4"
              variants={fadeInUp}
            >
              <span className="bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                AWS Services We Explore
              </span>
            </motion.h2>
            <motion.p 
              className="text-gray-700 max-w-3xl mx-auto text-lg"
              variants={fadeInUp}
            >
              Get hands-on experience with the most popular and powerful AWS services.
            </motion.p>
          </motion.div>

          <motion.div 
            className="flex flex-wrap justify-center gap-4"
            initial="initial"
            animate={servicesInView ? "animate" : "initial"}
            variants={staggerContainer}
          >
            {awsServices.map((service, index) => (
              <motion.div
                key={service}
                className="bg-orange-50 border-2 border-orange-200 rounded-lg px-4 py-2 hover:border-orange-400 hover:bg-orange-100 transition-all duration-300 shadow-sm hover:shadow-md"
                variants={fadeInUp}
                custom={index}
                whileHover={{ scale: 1.05, y: -2 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <span className="text-orange-700 font-mono text-sm font-semibold">{service}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* AWS Educate Integration */}
      <section ref={educateRef} className="py-20 bg-gradient-to-br from-orange-100 to-amber-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.8 }}
            animate={educateInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 60, scale: 0.8 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <Card className="bg-white border-orange-300 shadow-xl group hover:shadow-2xl transition-all duration-500">
              <CardContent className="p-8 md:p-12 text-center">
                <motion.div 
                  className="flex justify-center mb-6"
                  whileHover={{ scale: 1.1, rotate: 10 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-4 rounded-2xl shadow-lg">
                    <Star className="h-12 w-12 text-white" />
                  </div>
                </motion.div>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  AWS Educate Partner
                </h3>
                <p className="text-gray-700 text-lg leading-relaxed mb-6">
                  As an official AWS Educate partner, our members get exclusive access to AWS credits, 
                  hands-on labs, career resources, and the AWS job board. Start your cloud journey 
                  with free resources and real-world experience.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <motion.div {...scaleOnHover}>
                    <Button 
                      size="lg"
                      className="bg-orange-600 hover:bg-orange-700 text-white shadow-lg"
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Access AWS Educate
                    </Button>
                  </motion.div>
                  <motion.div {...scaleOnHover}>
                    <Button 
                      variant="outline" 
                      size="lg"
                      className="border-2 border-orange-600 text-orange-700 hover:bg-orange-50 bg-white"
                    >
                      Learn More
                    </Button>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-orange-600 to-amber-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              Ready to Scale Your Future?
            </h2>
            <p className="text-xl text-orange-100 mb-8 leading-relaxed">
              Join AWS Cloud Club and transform your career with in-demand cloud skills. 
              The future is in the cloud – and it starts here.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div {...scaleOnHover}>
                <Button 
                  size="lg"
                  className="bg-white text-orange-700 hover:bg-orange-50 shadow-lg font-semibold"
                >
                  <Cloud className="mr-2 h-5 w-5" />
                  Join AWS Cloud Club
                </Button>
              </motion.div>
              <motion.div {...scaleOnHover}>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-2 border-white text-white hover:bg-white/10 hover:border-orange-100"
                >
                  <Globe className="mr-2 h-5 w-5" />
                  Explore Programs
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default AboutAwsCloudClubPage
