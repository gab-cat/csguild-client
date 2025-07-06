// import Spline from '@splinetool/react-spline/next'

import { AboutSection } from "@/components/landing/about-section"
import { CommunitySection } from "@/components/landing/community-section"
import { ContactSection } from "@/components/landing/contact-section"
import { FeaturesSection } from "@/components/landing/features-section"
import { HeroSection } from "@/components/landing/hero-section"
import { TimelineSection } from "@/components/landing/timeline-section"

export default function Home() {
  return (
    <main className="flex-1">
      {/* 
        User Journey Flow:
        1. Hero Section - First impression, value proposition, and call-to-action
        2. About Section - Why students choose CS Guild (social proof through numbers)
        3. Features Section - How we help students transform their careers
        4. Community Section - Success stories and proof of results
        5. Contact Section - Final conversion point to join the community
      */}
      
      {/* 1. HOOK - Capture attention with bold value proposition */}
      <HeroSection />
        
      {/* 2. CREDIBILITY - Build trust with 3D visuals and compelling reasons */}
      <AboutSection />

      {/* Timeline Section with World Planet Background */}
      <div className="relative h-screen overflow-hidden">
        {/* World Planet Spline Background - Relative to section */}
        <div className="absolute inset-0 -z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-gray-950 rounded-3xl opacity-100" />
          <div className="w-full h-full scale-100">
            {/* <Spline
              scene="https://prod.spline.design/DNXLeygmKvG05sBa/scene.splinecode"
              className="w-full h-full opacity-40"
            /> */}
          </div>
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <TimelineSection />
      </div>
        
      {/* 3. SOLUTION - Show the complete toolkit for success */}
      <FeaturesSection />
        
      {/* 4. PROOF - Real success stories from the community */}
      <CommunitySection />
        
      {/* 5. CONVERSION - Get them to take action */}
      <ContactSection />
    </main>
  )
}
