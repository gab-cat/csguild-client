'use client'

import { Plus, Search, Star, TrendingUp, Clock, Home } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type BlogTab = 'all' | 'featured' | 'trending' | 'popular'

interface BlogHeaderWithNavigationProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  activeTab: BlogTab
  onTabChange: (tab: BlogTab) => void
  onCreateBlog?: () => void
}

const tabs = [
  {
    id: 'all' as const,
    label: 'For you',
    icon: Home,
  },
  {
    id: 'featured' as const,
    label: 'Featured',
    icon: Star,
  },
  {
    id: 'trending' as const,
    label: 'Trending',
    icon: TrendingUp,
  },
  {
    id: 'popular' as const,
    label: 'Popular',
    icon: Clock,
  },
]

export function BlogHeaderWithNavigation({ 
  searchQuery, 
  onSearchChange, 
  activeTab,
  onTabChange,
  onCreateBlog 
}: BlogHeaderWithNavigationProps) {
  const router = useRouter()

  const handleCreateBlog = () => {
    if (onCreateBlog) {
      onCreateBlog()
    } else {
      router.push('/blogs/create')
    }
  }

  return (
    <header className="border-b border-gray-800 bg-black/95 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Navigation tabs with search and write button */}
        <div className="flex items-center justify-between py-4">
          {/* Tab navigation */}
          <nav className="flex items-center gap-8 overflow-x-auto flex-1">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`flex items-center gap-2 whitespace-nowrap px-1 py-2 border-b-2 transition-colors ${
                    isActive
                      ? 'border-purple-500 text-purple-400' 
                      : 'border-transparent text-gray-400 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              )
            })}
          </nav>

          {/* Desktop actions - Search only (Create button removed for public pages) */}
          <div className="hidden md:flex items-center gap-4 ml-8">
            {/* Search */}
            <div className="relative w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search blogs..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 bg-gray-900 border-gray-700 text-white placeholder:text-gray-500 focus:border-purple-500"
              />
            </div>
          </div>

          {/* Mobile actions - Search only (Create button removed for public pages) */}
          <div className="md:hidden flex items-center gap-3 ml-4">
            {/* Mobile search */}
            <div className="relative w-32 sm:w-48">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 text-sm bg-gray-900 border-gray-700 text-white placeholder:text-gray-500 focus:border-purple-500"
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
