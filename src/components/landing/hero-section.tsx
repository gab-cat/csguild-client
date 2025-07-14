import Spline from '@splinetool/react-spline/next'
import { ArrowRight, Code2 } from "lucide-react"

import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8b5cf6_1px,transparent_1px),linear-gradient(to_bottom,#8b5cf6_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-20" />

      {/* 3D Robot - Positioned absolutely behind content */}
      <div id="robot-section" className="absolute lg:-right-[28vw] xl:-right-[10vw] top-0 lg:w-full xl:w-[80vw] h-full z-0 hidden lg:block animate-fade-in-right">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 via-violet-500/20 to-purple-500/20 rounded-3xl blur-3xl opacity-30" />
        <Spline
          scene="https://prod.spline.design/awBSaOn9261Q9L9g/scene.splinecode"
          className="w-full h-full"
        />
      </div>

      <div className="container text-center md:text-left mx-auto px-6 relative z-10">
        <div className="flex items-center min-h-screen">
          {/* Text Content - Now takes full width on large screens but with right padding */}
          <div className="w-full lg:w-3/5 space-y-8 mb-auto mt-12 md:mt-32">
            <div className="animate-fade-in-up-delay-200">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-pink-500/20 to-violet-500/20 border border-pink-500/30 backdrop-blur-sm">
                <Code2 className="h-4 w-4 text-pink-400" />
                <span className="font-space-mono text-xs md:text-sm text-pink-300">{'console.log("Welcome to CS Guild");'}</span>
              </div>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tighter text-white animate-fade-in-up-delay-400">
              Where{" "}
              <span className="bg-gradient-to-r from-pink-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
                Code
              </span>{" "}
              Meets{" "}
              <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Community
              </span>
            </h1>

            <p className="text-base md:text-lg text-gray-200 max-w-2xl leading-relaxed tracking-tight animate-fade-in-up-delay-600">
              Join hundreds of students in the College of Computer Studies in the ultimate learning ecosystem. Build projects, share
              knowledge, and level up your coding journey together.
            </p>

            <div className="flex flex-col justify-center md:justify-start sm:flex-row gap-4 animate-fade-in-up-delay-800">
              <Button
                size="lg"
                className="bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl shadow-pink-500/25"
              >
                Start Your Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-pink-500/50 text-pink-300 hover:bg-pink-500/10 px-8 py-4 rounded-xl bg-black/30 backdrop-blur-sm hover:border-pink-400 transition-all duration-300"
              >
                Explore Community
              </Button>
            </div>

          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 animate-fade-in-up-delay-1500">
        <div className="flex flex-col items-center gap-2 text-pink-400">
          <span className="text-sm font-space-mono">Scroll to explore</span>
          <div className="w-6 h-10 border-2 border-pink-500 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-gradient-to-b from-pink-400 to-violet-400 rounded-full mt-2 animate-bounce-slow" />
          </div>
        </div>
      </div>
    </section>
  )
}
