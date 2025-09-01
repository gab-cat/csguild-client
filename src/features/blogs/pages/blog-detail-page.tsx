'use client'

import { motion } from 'framer-motion'
import { ArrowLeft, MessageCircle } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'

import { 
  BlogActions,
  BlogAuthorCard,
  BlogCommentsSection,
  BlogContent,
  BlogCoverImage,
  BlogHeader,
  BlogRelatedSection,
  BlogSocialShare
} from '../components/blog-details'
import { useBlog, useRelatedBlogs } from '../hooks'

interface BlogDetailPageProps {
  slug: string
}

export default function BlogDetailPage({ slug }: BlogDetailPageProps) {
  const { 
    data: blog, 
    isLoading, 
    isError, 
    error 
  } = useBlog(slug)

  const {
    data: relatedBlogs,
    isLoading: isRelatedLoading
  } = useRelatedBlogs(slug, 4, !!blog)

  const handleLike = (liked: boolean) => {
    // Like state is now handled by BlogActions component
    console.log('Blog liked:', liked)
  }

  const handleBookmark = (bookmarked: boolean) => {
    // Handle bookmark logic here
    console.log('Bookmark toggled:', bookmarked)
  }

  const handleShare = async () => {
    if (!blog) return

    const url = `${window.location.origin}/blogs/${slug}`
    const title = blog.title
    const text = blog.excerpt || blog.title || ''

    if (navigator.share) {
      try {
        await navigator.share({ title, text, url })
      } catch (error) {
        console.error('Error sharing:', error)
      }
    } else {
      // Fallback to copying URL
      try {
        await navigator.clipboard.writeText(url)
      } catch (error) {
        console.error('Failed to copy URL:', error)
      }
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-800 rounded w-3/4"></div>
            <div className="h-64 bg-gray-800 rounded"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-800 rounded"></div>
              <div className="h-4 bg-gray-800 rounded w-5/6"></div>
              <div className="h-4 bg-gray-800 rounded w-4/6"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (isError || !blog) {
    return (
      <div className="min-h-screen bg-black">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center py-16">
            <div className="max-w-md mx-auto space-y-4">
              <div className="w-16 h-16 mx-auto bg-red-500/10 rounded-full flex items-center justify-center">
                <MessageCircle className="h-8 w-8 text-red-400" />
              </div>
              <h3 className="text-lg font-semibold text-red-400">Blog not found</h3>
              <p className="text-gray-400">
                {error?.message || 'The blog you are looking for does not exist or has been removed.'}
              </p>
              <Link href="/blogs">
                <Button 
                  variant="outline" 
                  className="border-purple-500/20 text-purple-400 hover:bg-purple-500/10"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Blogs
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/blogs">
              <Button variant="ghost" className="text-gray-400 hover:text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blogs
              </Button>
            </Link>
            
            <BlogActions
              blogSlug={slug}
              initialLikeCount={blog.likeCount}
              initialIsLiked={blog.isLiked || false}
              initialIsBookmarked={blog.isBookmarked || false}
              onLike={handleLike}
              onBookmark={handleBookmark}
              onShare={handleShare}
            />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          {/* Hero section */}
          <BlogHeader blog={blog} />

          {/* Cover image */}
          <BlogCoverImage coverImages={blog.coverImages} title={blog.title} />

          {/* Content */}
          <BlogContent content={blog.content || ''} />

          {/* Social sharing */}
          <BlogSocialShare
            slug={slug}
            title={blog.title}
            excerpt={blog.excerpt}
            likeCount={blog.likeCount}
            commentCount={blog.commentCount}
          />

          {/* Author info */}
          <BlogAuthorCard author={blog.author} />

          {/* Comments section */}
          <BlogCommentsSection blog={blog} />
        </motion.article>

        {/* Related blogs */}
        <BlogRelatedSection
          relatedBlogs={Array.isArray(relatedBlogs) ? relatedBlogs : []}
          isLoading={isRelatedLoading}
        />
      </main>
    </div>
  )
}
