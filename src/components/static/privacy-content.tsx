'use client'

import { motion } from 'framer-motion'

import { Card } from "@/components/ui/card"

export function PrivacyContent() {
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
          Privacy Policy
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
            <h2 className="text-2xl font-semibold text-gray-200">1. Introduction</h2>
            <p className="text-gray-400">
              At CS Guild, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform and services.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-200">2. Information We Collect</h2>
            <div className="space-y-4">
              <h3 className="text-xl font-medium text-gray-300">2.1 Personal Information</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-400 ml-4">
                <li>Name and contact information</li>
                <li>Educational background</li>
                <li>Professional experience</li>
                <li>Account credentials</li>
                <li>Profile information</li>
              </ul>

              <h3 className="text-xl font-medium text-gray-300">2.2 Usage Data</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-400 ml-4">
                <li>Log data and device information</li>
                <li>Platform interaction metrics</li>
                <li>Learning progress and achievements</li>
                <li>Communication preferences</li>
              </ul>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-200">3. How We Use Your Information</h2>
            <p className="text-gray-400">
              We use the collected information for the following purposes:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-400 ml-4">
              <li>Provide and maintain our services</li>
              <li>Personalize your learning experience</li>
              <li>Improve our platform and services</li>
              <li>Communicate with you about updates and opportunities</li>
              <li>Ensure platform security and prevent fraud</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-200">4. Information Sharing and Disclosure</h2>
            <p className="text-gray-400">
              We do not sell your personal information. We may share your information with:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-400 ml-4">
              <li>Service providers who assist in platform operations</li>
              <li>Educational partners for program delivery</li>
              <li>Legal authorities when required by law</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-200">5. Data Security</h2>
            <p className="text-gray-400">
              We implement appropriate security measures to protect your personal information, including encryption, secure servers, and regular security assessments.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-200">6. Your Rights</h2>
            <p className="text-gray-400">
              You have the right to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-400 ml-4">
              <li>Access your personal information</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Opt-out of marketing communications</li>
              <li>Data portability</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-200">7. Cookies and Tracking</h2>
            <p className="text-gray-400">
              We use cookies and similar tracking technologies to improve your experience on our platform. You can control cookie preferences through your browser settings.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-200">8. Changes to This Policy</h2>
            <p className="text-gray-400">
              We may update this Privacy Policy periodically. We will notify you of any material changes via email or through our platform.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-200">9. Contact Us</h2>
            <p className="text-gray-400">
              If you have questions about this Privacy Policy, please contact our Data Protection Officer at privacy@csguild.com
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