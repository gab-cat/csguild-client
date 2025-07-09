"use client"

import { motion } from "framer-motion"
import { Code2, Loader2 } from "lucide-react"

export default function LoadingComponent() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8b5cf6_1px,transparent_1px),linear-gradient(to_bottom,#8b5cf6_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-20" />
      
      {/* Floating Orbs */}
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-32 h-32 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{
            background: `linear-gradient(45deg, #ec4899, #8b5cf6)`,
            left: `${10 + i * 15}%`,
            top: `${20 + (i % 3) * 25}%`,
          }}
          animate={{
            y: [0, -20, 0],
            scale: [1, 1.1, 1],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 4 + i,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.8,
          }}
        />
      ))}

      {/* Main Loading Content */}
      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* Animated Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative"
        >
          {/* Pulsing Glow Effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-pink-500 to-violet-500 rounded-2xl blur-2xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          
          {/* Logo Container */}
          <div className="relative flex items-center gap-4 px-6 py-4 rounded-2xl bg-gradient-to-br from-pink-900/20 to-violet-900/20 border border-pink-500/30 backdrop-blur-sm">
            {/* Logo Icon */}
            <motion.div
              className="w-12 h-12 rounded-lg bg-gradient-to-br from-pink-500 to-violet-500 flex items-center justify-center shadow-lg relative"
              animate={{
                rotate: [0, 360],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              <Code2 className="h-6 w-6 text-white" />
              
              {/* Spinning Border */}
              <motion.div
                className="absolute inset-0 rounded-lg border-2 border-transparent bg-gradient-to-r from-pink-400 to-violet-400 bg-clip-border"
                style={{
                  background: 'linear-gradient(45deg, transparent, transparent), linear-gradient(45deg, #ec4899, #8b5cf6)',
                  backgroundClip: 'padding-box, border-box',
                }}
                animate={{
                  rotate: [0, -360],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            </motion.div>
            
            {/* Text */}
            <div className="flex flex-col">
              <span className="font-space-mono text-xl font-bold bg-gradient-to-r from-pink-400 to-violet-400 bg-clip-text text-transparent">
                CS Guild
              </span>
              <span className="font-space-mono text-xs text-gray-400">
                {"// Loading experience..."}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Loading Spinner and Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col items-center gap-4"
        >
          {/* Spinner */}
          <div className="relative">
            <Loader2 className="h-8 w-8 text-pink-400 animate-spin" />
            <motion.div
              className="absolute inset-0 h-8 w-8 rounded-full border-2 border-transparent border-t-violet-400"
              animate={{
                rotate: [0, 360],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          </div>
          
          {/* Loading Text */}
          <motion.p
            className="font-space-mono text-sm text-gray-300"
            animate={{
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            Preparing your coding environment...
          </motion.p>
        </motion.div>

        {/* Progress Dots */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex gap-2"
        >
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              className="w-2 h-2 rounded-full bg-gradient-to-r from-pink-400 to-violet-400"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.4, 1, 0.4],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: index * 0.2,
              }}
            />
          ))}
        </motion.div>
      </div>

      {/* Backdrop Blur Overlay */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
    </div>
  )
}
