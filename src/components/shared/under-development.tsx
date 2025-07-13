'use client';

import { motion } from 'framer-motion';
import { Code2, Sparkles, ArrowLeft, Home, Star } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function UnderDevelopment() {
  // Floating shapes animation variants
  const floatingShapes = [
    { delay: 0, x: [0, 100, 0], y: [0, -50, 0], duration: 8 },
    { delay: 2, x: [0, -80, 0], y: [0, 60, 0], duration: 10 },
    { delay: 4, x: [0, 120, 0], y: [0, -80, 0], duration: 12 },
    { delay: 6, x: [0, -60, 0], y: [0, 40, 0], duration: 9 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900/10 to-pink-900/10 flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Large Floating Blobs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-to-r from-pink-500/20 to-violet-500/20 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-1/2 right-1/4 w-96 h-96 bg-gradient-to-r from-violet-500/15 to-purple-500/15 rounded-full blur-3xl"
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
            scale: [1, 0.8, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3
          }}
        />
        <motion.div
          className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-gradient-to-r from-purple-500/25 to-pink-500/25 rounded-full blur-3xl"
          animate={{
            x: [0, 120, 0],
            y: [0, -80, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 6
          }}
        />

        {/* Floating Geometric Shapes */}
        {floatingShapes.map((shape, index) => (
          <motion.div
            key={index}
            className="absolute"
            style={{
              top: `${20 + index * 15}%`,
              left: `${10 + index * 20}%`,
            }}
            animate={{
              x: shape.x,
              y: shape.y,
              rotate: [0, 360],
            }}
            transition={{
              duration: shape.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: shape.delay,
            }}
          >
            <div className={`w-8 h-8 ${index % 2 === 0 ? 'bg-gradient-to-br from-pink-400/30 to-violet-400/30' : 'bg-gradient-to-br from-violet-400/30 to-purple-400/30'} ${index % 3 === 0 ? 'rounded-full' : 'rounded-lg rotate-45'} blur-sm`} />
          </motion.div>
        ))}

        {/* Sparkle Effects */}
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          >
            <Star className="w-2 h-2 text-pink-400/60 fill-current" />
          </motion.div>
        ))}
      </div>

      {/* Main Content Card */}
      <Card className="relative z-10 w-full max-w-7xl mx-auto bg-gray-900/10 border-none">
        <div className="p-8 md:p-12 text-center space-y-10">
          
          {/* Animated Logo & Brand */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-6"
          >
            {/* CS Guild Logo with Magical Effect */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <motion.div
                className="relative"
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
              >
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-pink-500 via-violet-500 to-purple-500 flex items-center justify-center shadow-2xl">
                  <Code2 className="h-10 w-10 text-white" />
                </div>
                {/* Magical Glow Ring */}
                <motion.div
                  className="absolute inset-0 rounded-2xl bg-gradient-to-br from-pink-400/40 via-violet-400/40 to-purple-400/40 blur-xl"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0.8, 0.5],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </motion.div>
              <div className="flex flex-col items-start">
                <motion.span
                  className="text-3xl font-bold tracking-tight bg-gradient-to-r from-pink-400 via-violet-400 to-purple-400 bg-clip-text text-transparent"
                  animate={{
                    backgroundPosition: ["0%", "100%", "0%"],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  CS Guild
                </motion.span>
                <span className="text-sm text-gray-400">
                  Building the Future
                </span>
              </div>
            </div>
          </motion.div>

          {/* Main Heading with Magical Text Effect */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="space-y-6"
          >
            <motion.h1
              className="text-5xl md:text-6xl font-bold leading-tight"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              <motion.span
                className="bg-gradient-to-r from-pink-400 tracking-tighter via-violet-400 to-purple-400 bg-clip-text text-transparent"
                animate={{
                  backgroundPosition: ["0%", "100%", "0%"],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                Something Amazing
              </motion.span>
              <br />
              <motion.span
                className="text-white"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                is Coming
              </motion.span>
            </motion.h1>

            <motion.p
              className="text-xl text-gray-300 max-w-lg tracking-tight mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
            >
              We&apos;re crafting an extraordinary experience that will transform how you learn and connect.
            </motion.p>
          </motion.div>

          {/* Magical Progress Indicator */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-center gap-3">
              <Sparkles className="w-5 h-5 text-violet-400" />
              <span className="text-gray-300">Progress</span>
              <Sparkles className="w-5 h-5 text-pink-400" />
            </div>
            
            {/* Animated Progress Circles */}
            <div className="flex justify-center gap-4">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-4 h-4 rounded-full bg-gradient-to-r from-pink-500 to-violet-500"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ 
                    scale: [0, 1.2, 1], 
                    opacity: [0, 1, 0.6] 
                  }}
                  transition={{
                    duration: 0.6,
                    delay: 1.5 + i * 0.2,
                    repeat: Infinity,
                    repeatDelay: 3,
                    ease: "easeOut"
                  }}
                />
              ))}
            </div>

            <motion.p
              className="text-sm text-gray-400"
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Weaving magic into every detail...
            </motion.p>
          </motion.div>

          {/* Call to Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.8 }}
            className="space-y-6"
          >
            <p className="text-gray-300">
              Explore our other amazing features while you wait!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="default"
                size="lg"
                className="bg-gradient-to-r from-pink-500 via-violet-500 to-purple-500 hover:from-pink-600 hover:via-violet-600 hover:to-purple-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => window.history.back()}
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Go Back
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-violet-400/50 text-violet-300 hover:bg-violet-500/10 hover:border-violet-400 transition-all duration-300"
                onClick={() => window.location.href = '/'}
              >
                <Home className="h-5 w-5 mr-2" />
                Home
              </Button>
            </div>
          </motion.div>

          {/* Magical Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 2.2 }}
            className="pt-8 border-t border-violet-500/20"
          >
            <motion.p
              className="text-sm text-gray-400 flex items-center justify-center gap-2"
              animate={{ 
                textShadow: [
                  "0 0 0px rgba(168, 85, 247, 0)",
                  "0 0 10px rgba(168, 85, 247, 0.3)",
                  "0 0 0px rgba(168, 85, 247, 0)"
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Sparkles className="w-4 h-4 text-violet-400" />
              Stay tuned for something extraordinary
              <Sparkles className="w-4 h-4 text-pink-400" />
            </motion.p>
          </motion.div>
        </div>
      </Card>
    </div>
  );
}
