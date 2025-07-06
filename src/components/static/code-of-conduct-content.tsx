'use client'

import { motion } from 'framer-motion'

import { Card } from "@/components/ui/card"

export function CodeOfConductContent() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-8 max-w-4xl mx-auto"
    >
      <div className="text-center space-y-4">
        <motion.h1 
          className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Code of Conduct
        </motion.h1>
        <p className="text-gray-400 font-space-mono">
          {"// Last updated: "}{new Date().toLocaleDateString()}
        </p>
      </div>

      <Card className="bg-gradient-to-br from-pink-500/10 to-violet-500/10 border border-pink-500/20 backdrop-blur-sm">
        <motion.div 
          className="p-6 space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-200">1. Purpose</h2>
            <p className="text-gray-400">
              CS Guild is committed to providing a welcoming, inclusive, and harassment-free environment for everyone, regardless of background, identity, or experience level. This code of conduct outlines our expectations for all community members.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-200">2. Expected Behavior</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-400 ml-4">
              <li>Be respectful and inclusive of differing viewpoints and experiences</li>
              <li>Give and gracefully accept constructive feedback</li>
              <li>Focus on what is best for the community</li>
              <li>Show empathy towards other community members</li>
              <li>Use welcoming and inclusive language</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-200">3. Unacceptable Behavior</h2>
            <p className="text-gray-400">
              The following behaviors are considered harassment and are unacceptable:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-400 ml-4">
              <li>Offensive comments related to gender, gender identity, sexual orientation, disability, mental illness, race, or religion</li>
              <li>Deliberate intimidation, stalking, or following</li>
              <li>Harassment through photography or recording</li>
              <li>Sustained disruption of discussions</li>
              <li>Inappropriate physical contact or unwelcome sexual attention</li>
              <li>Advocating for or encouraging any of the above behavior</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-200">4. Academic Integrity</h2>
            <p className="text-gray-400">
              Members are expected to maintain high standards of academic integrity:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-400 ml-4">
              <li>Do not share solutions to assignments or assessments</li>
              <li>Properly cite sources and respect intellectual property</li>
              <li>Do not engage in plagiarism or cheating</li>
              <li>Report suspected violations of academic integrity</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-200">5. Community Guidelines</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-400 ml-4">
              <li>Keep discussions relevant and constructive</li>
              <li>Respect privacy and confidentiality</li>
              <li>Follow platform-specific rules and guidelines</li>
              <li>Help others learn and grow</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-200">6. Enforcement</h2>
            <div className="space-y-4 p-4 bg-gradient-to-br from-pink-500/5 to-violet-500/5 rounded-lg border border-pink-500/10">
              <p className="text-gray-400">
                Violations of this code of conduct may result in:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-400 ml-4">
                <li>Verbal or written warning</li>
                <li>Temporary suspension from community activities</li>
                <li>Permanent removal from the community</li>
                <li>Reporting to relevant authorities if necessary</li>
              </ul>
              <p className="text-gray-400 mt-4">
                The CS Guild team has the right and responsibility to remove, edit, or reject any contributions that do not align with this Code of Conduct.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-200">7. Reporting Guidelines</h2>
            <p className="text-gray-400">
              If you experience or witness unacceptable behavior:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-400 ml-4">
              <li>Contact the CS Guild team immediately at conduct@csguild.com</li>
              <li>Include as much detail as possible in your report</li>
              <li>All reports will be handled with discretion</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-200">8. Scope</h2>
            <p className="text-gray-400">
              This Code of Conduct applies to all CS Guild spaces, including online platforms, events, and communications. Members are expected to follow these guidelines in all community interactions.
            </p>
          </section>
        </motion.div>
      </Card>

      {/* Status Footer */}
      <motion.div
        className="text-center py-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-pink-500/10 to-violet-500/10 border border-pink-500/20 backdrop-blur-sm">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-sm text-gray-400 font-space-mono">
            {"// Document version: 1.0 • Last reviewed: "}{new Date().toLocaleDateString()}
          </span>
        </div>
      </motion.div>
    </motion.div>
  )
} 