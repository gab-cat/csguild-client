"use client"

import { motion } from "framer-motion"

export default function PageLoading() {
  return (
    <div className="flex h-[calc(100dvh-6rem)] w-full items-center justify-center rounded-xl bg-gray-950">
      <div className="relative flex flex-col items-center gap-6 p-8">
        {/* Accent glow */}
        <motion.div
          className="absolute -inset-10 rounded-3xl bg-gradient-to-br from-pink-500/10 to-violet-500/10 blur-2xl"
          animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.05, 1] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Spinner */}
        <div className="relative h-16 w-16">
          <motion.span
            className="absolute inset-0 rounded-full border-2 border-pink-400/30"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 2.2, ease: "linear" }}
          />
          <motion.span
            className="absolute inset-0 rounded-full border-2 border-t-violet-400"
            animate={{ rotate: -360 }}
            transition={{ repeat: Infinity, duration: 1.4, ease: "linear" }}
          />
          <span className="absolute inset-3 rounded-full bg-gradient-to-br from-pink-500/15 to-violet-500/15" />
        </div>

        {/* Text */}
        <motion.p
          className="text-sm text-gray-300"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          Loading page…
        </motion.p>

        {/* Dots */}
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="h-2 w-2 rounded-full bg-gradient-to-r from-pink-400 to-violet-400"
              animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut", delay: i * 0.15 }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}


