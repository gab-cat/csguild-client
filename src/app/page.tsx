import { AboutSection } from "@/components/landing/about-section"
import { AppSidebar } from "@/components/landing/app-sidebar"
import { CommunitySection } from "@/components/landing/community-section"
import { ContactSection } from "@/components/landing/contact-section"
import { FeaturesSection } from "@/components/landing/features-section"
import { HeroSection } from "@/components/landing/hero-section"
import Footer from "@/components/shared/footer"
import NavBar from "@/components/shared/navbar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"

export default function Home() {
  return (
    <SidebarProvider defaultOpen={false}>
      <div className="flex min-h-screen w-full cursor-none">
        <AppSidebar />
        <SidebarInset className="flex-1">

          {/* Navigation */}
          <NavBar />

          {/* 
            User Journey Flow:
            1. Hero Section - First impression, value proposition, and call-to-action
            2. About Section - Why students choose CS Guild (social proof through numbers)
            3. Features Section - How we help students transform their careers
            4. Community Section - Success stories and proof of results
            5. Contact Section - Final conversion point to join the community
          */}
          <main className="flex-1">
            {/* 1. HOOK - Capture attention with bold value proposition */}
            <HeroSection />
            
            {/* 2. CREDIBILITY - Build trust with 3D visuals and compelling reasons */}
            <AboutSection />
            
            {/* 3. SOLUTION - Show the complete toolkit for success */}
            <FeaturesSection />
            
            {/* 4. PROOF - Real success stories from the community */}
            <CommunitySection />
            
            {/* 5. CONVERSION - Get them to take action */}
            <ContactSection />
          </main>

          {/* Footer */}
          <Footer />
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
