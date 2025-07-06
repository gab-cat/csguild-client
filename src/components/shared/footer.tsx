import { Separator } from '@radix-ui/react-separator'
import { Github, Twitter, Linkedin, Code2, Heart } from 'lucide-react'
import React from 'react'

const Footer = () => {
  return (
    <footer className="border-t border-pink-500/20 bg-black backdrop-blur-sm relative">
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8b5cf6_1px,transparent_1px),linear-gradient(to_bottom,#8b5cf6_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-5" />
      
      <div className="container mx-auto px-6 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500 to-violet-500 flex items-center justify-center shadow-lg">
                <span className="font-space-mono font-bold text-white text-sm">CS</span>
              </div>
              <span className="font-space-mono font-bold text-xl text-white">CS Guild</span>
            </div>
            <p className="text-gray-200 mb-4 max-w-md">
              Empowering the next generation of developers through community, collaboration, and continuous
              learning. Join 10,000+ students transforming their careers.
            </p>
            <div className="font-space-mono text-sm text-pink-400 flex items-center gap-2">
              <Code2 className="h-4 w-4" />
              <span>{"// Built with"}</span>
              <Heart className="h-4 w-4 text-pink-400 fill-current" />
              <span>{"by the CS Guild community"}</span>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Community</h4>
            <ul className="space-y-2 text-gray-300">
              <li>
                <a href="#" className="hover:text-pink-400 transition-colors duration-200 flex items-center gap-2">
                  Discord
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-pink-400 transition-colors duration-200 flex items-center gap-2">
                  GitHub
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-pink-400 transition-colors duration-200 flex items-center gap-2">
                  Events
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-pink-400 transition-colors duration-200 flex items-center gap-2">
                  Blog
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Resources</h4>
            <ul className="space-y-2 text-gray-300">
              <li>
                <a href="#" className="hover:text-pink-400 transition-colors duration-200 flex items-center gap-2">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-pink-400 transition-colors duration-200 flex items-center gap-2">
                  Tutorials
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-pink-400 transition-colors duration-200 flex items-center gap-2">
                  Projects
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-pink-400 transition-colors duration-200 flex items-center gap-2">
                  Mentorship
                </a>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8 bg-pink-500/20" />

        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="font-space-mono text-sm text-gray-400">© 2024 CS Guild. All rights reserved.</div>
          <div className="flex items-center gap-6 mt-4 md:mt-0">
            {/* Social Links */}
            <div className="flex gap-3">
              <a
                href="#"
                className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500/20 to-violet-500/20 hover:from-pink-500/30 hover:to-violet-500/30 flex items-center justify-center transition-all duration-300 hover:scale-110 border border-pink-500/30"
                aria-label="GitHub"
              >
                <Github className="h-4 w-4 text-pink-400" />
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500/20 to-violet-500/20 hover:from-pink-500/30 hover:to-violet-500/30 flex items-center justify-center transition-all duration-300 hover:scale-110 border border-pink-500/30"
                aria-label="Twitter"
              >
                <Twitter className="h-4 w-4 text-pink-400" />
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500/20 to-violet-500/20 hover:from-pink-500/30 hover:to-violet-500/30 flex items-center justify-center transition-all duration-300 hover:scale-110 border border-pink-500/30"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-4 w-4 text-pink-400" />
              </a>
            </div>
            
            {/* Legal Links */}
            <div className="flex gap-6">
              <a href="/privacy" className="text-gray-400 hover:text-pink-400 transition-colors text-sm">
                Privacy Policy
              </a>
              <a href="/terms" className="text-gray-400 hover:text-pink-400 transition-colors text-sm">
                Terms of Service
              </a>
              <a href="/code-of-conduct" className="text-gray-400 hover:text-pink-400 transition-colors text-sm">
                Code of Conduct
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer