'use client'

import { motion } from 'framer-motion'
import { 
  BookOpen, 
  Eye, 
  Heart, 
  MessageCircle, 
  TrendingUp,
  Calendar,
  Clock
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import type { BlogSummaryResponseDto } from '../../types'

interface BlogStatsOverviewProps {
  blogs: BlogSummaryResponseDto[]
  isLoading?: boolean
}

export default function BlogStatsOverview({ blogs, isLoading }: BlogStatsOverviewProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="w-8 h-8 bg-gray-700 rounded mb-4"></div>
                <div className="w-16 h-6 bg-gray-700 rounded mb-2"></div>
                <div className="w-24 h-4 bg-gray-700 rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const totalBlogs = blogs.length
  const publishedBlogs = blogs.filter(blog => blog.status === 'PUBLISHED').length
  const draftBlogs = blogs.filter(blog => blog.status === 'DRAFT').length
  const totalViews = blogs.reduce((sum, blog) => sum + blog.viewCount, 0)
  const totalLikes = blogs.reduce((sum, blog) => sum + blog.likeCount, 0)
  const totalComments = blogs.reduce((sum, blog) => sum + blog.commentCount, 0)
  
  // Get most popular blog
  const mostPopularBlog = blogs.reduce((prev, current) => 
    (prev.viewCount > current.viewCount) ? prev : current, blogs[0]
  )

  // Get most recent blog
  const mostRecentBlog = blogs.reduce((prev, current) => 
    (new Date(prev.updatedAt) > new Date(current.updatedAt)) ? prev : current, blogs[0]
  )

  const stats = [
    {
      title: 'Total Blogs',
      value: totalBlogs,
      icon: BookOpen,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      description: `${publishedBlogs} published, ${draftBlogs} drafts`
    },
    {
      title: 'Total Views',
      value: totalViews.toLocaleString(),
      icon: Eye,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      description: 'Across all blogs'
    },
    {
      title: 'Engagement',
      value: totalLikes + totalComments,
      icon: Heart,
      color: 'text-red-400',
      bgColor: 'bg-red-500/10',
      description: `${totalLikes} likes, ${totalComments} comments`
    },
    {
      title: 'Avg. Views',
      value: totalBlogs > 0 ? Math.round(totalViews / totalBlogs) : 0,
      icon: TrendingUp,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
      description: 'Per blog post'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-gray-900/50 border-gray-800 hover:border-gray-700 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-gray-400 text-sm font-medium">{stat.title}</p>
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                    <p className="text-xs text-gray-500">{stat.description}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Quick Insights */}
      {totalBlogs > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Most Popular Blog */}
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white text-lg flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-400" />
                Most Popular Blog
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <h3 className="text-white font-medium line-clamp-2">
                  {mostPopularBlog?.title}
                </h3>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {mostPopularBlog?.viewCount.toLocaleString()} views
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="w-4 h-4" />
                    {mostPopularBlog?.likeCount}
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4" />
                    {mostPopularBlog?.commentCount}
                  </div>
                </div>
                <Badge 
                  variant="outline" 
                  className={
                    mostPopularBlog?.status === 'PUBLISHED' 
                      ? 'border-green-500/30 text-green-400'
                      : 'border-gray-500/30 text-gray-400'
                  }
                >
                  {mostPopularBlog?.status}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Most Recent Blog */}
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white text-lg flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-400" />
                Most Recent Update
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <h3 className="text-white font-medium line-clamp-2">
                  {mostRecentBlog?.title}
                </h3>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(mostRecentBlog?.updatedAt || '').toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {mostRecentBlog?.viewCount.toLocaleString()} views
                  </div>
                </div>
                <Badge 
                  variant="outline" 
                  className={
                    mostRecentBlog?.status === 'PUBLISHED' 
                      ? 'border-green-500/30 text-green-400'
                      : 'border-gray-500/30 text-gray-400'
                  }
                >
                  {mostRecentBlog?.status}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
