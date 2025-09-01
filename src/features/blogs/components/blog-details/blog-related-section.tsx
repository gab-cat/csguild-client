'use client'

import { motion } from 'framer-motion'

import { Separator } from '@/components/ui/separator'

import type { BlogSummaryResponseDto } from '../../types'
import { BlogCard } from '../shared'

interface BlogRelatedSectionProps {
  relatedBlogs: BlogSummaryResponseDto[]
  isLoading: boolean
}

export function BlogRelatedSection({ relatedBlogs, isLoading }: BlogRelatedSectionProps) {
  if (isLoading) {
    return (
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mt-16"
      >
        <Separator className="mb-8 bg-gray-800" />
        <h2 className="text-2xl font-bold text-white mb-8">Recommended for you</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-800 rounded-lg h-32"></div>
            </div>
          ))}
        </div>
      </motion.section>
    )
  }

  if (!Array.isArray(relatedBlogs) || relatedBlogs.length === 0) {
    return null
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="mt-16"
    >
      <Separator className="mb-8 bg-gray-800" />
      <h2 className="text-2xl font-bold text-white mb-8">Recommended for you</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {relatedBlogs.slice(0, 4).map((relatedBlog) => (
          <BlogCard
            key={relatedBlog.id}
            blog={relatedBlog}
            variant="compact"
            showActions={false}
          />
        ))}
      </div>
    </motion.section>
  )
}
