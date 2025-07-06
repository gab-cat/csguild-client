'use client'

import { motion } from 'framer-motion'

import { Card } from "@/components/ui/card"

export function TermsContent() {
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
          Terms of Service
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
            <h2 className="text-2xl font-semibold text-gray-200">1. Acceptance of Terms</h2>
            <p className="text-gray-400">
              By accessing and using CS Guild&apos;s platform and services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-200">2. Services Description</h2>
            <p className="text-gray-400">
              CS Guild provides an educational platform focused on computer science education, mentorship, and community building. Our services include but are not limited to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-400 ml-4">
              <li>Access to educational content and resources</li>
              <li>Mentorship programs and guidance</li>
              <li>Community features and networking opportunities</li>
              <li>Career development resources and support</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-200">3. User Responsibilities</h2>
            <p className="text-gray-400">
              Users of CS Guild&apos;s platform are expected to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-400 ml-4">
              <li>Provide accurate and complete information during registration</li>
              <li>Maintain the security of their account credentials</li>
              <li>Comply with all applicable laws and regulations</li>
              <li>Respect intellectual property rights</li>
              <li>Engage respectfully with other community members</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-200">4. Intellectual Property</h2>
            <p className="text-gray-400">
              All content provided on CS Guild&apos;s platform, including but not limited to text, graphics, logos, images, and software, is the property of CS Guild or its content suppliers and is protected by international copyright laws.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-200">5. Privacy</h2>
            <p className="text-gray-400">
              Your privacy is important to us. Our collection and use of personal information is governed by our Privacy Policy, which is incorporated into these Terms of Service by reference.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-200">6. Termination</h2>
            <p className="text-gray-400">
              CS Guild reserves the right to terminate or suspend access to our services, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-200">7. Changes to Terms</h2>
            <p className="text-gray-400">
              We reserve the right to modify these terms at any time. We will notify users of any material changes via email or through our platform. Continued use of the platform after such modifications constitutes acceptance of the updated terms.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-200">8. Contact Information</h2>
            <p className="text-gray-400">
              If you have any questions about these Terms, please contact us at support@csguild.com
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