'use client'

import { useMutation } from "convex/react";
import { useQuery } from 'convex-helpers/react/cache/hooks'
import { motion } from 'framer-motion'
import { ArrowLeft, MessageCircle } from 'lucide-react'
import Link from 'next/link'
import { useEffect } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useBlogViews } from '@/hooks/use-blog-views'
import { api } from '@/lib/convex'
import { useAuthStore } from '@/stores/auth-store'

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

interface BlogDetailPageProps {
  slug: string
}

export default function BlogDetailPage({ slug }: BlogDetailPageProps) {
  const blog = useQuery(api.blogs.getBlogBySlug, { slug })
  const viewBlogMutation = useMutation(api.blogs.viewBlog)
  const { hasViewed, markAsViewed } = useBlogViews()
  const { user } = useAuthStore()

  // Get user's interaction state with the blog
  const userInteraction = useQuery(api.blogs.getUserBlogInteraction, !!blog ? {
    blogId: blog._id,
    userSlug: user?.username || undefined,
  } : "skip")

  console.log('blog', blog)
  const isLoading = blog === undefined
  const isError = !blog && blog !== undefined

  // Track blog view when blog loads
  useEffect(() => {
    if (blog && blog._id && !hasViewed(slug)) {
      // Get user information if available
      const userSlug = blog.author?.username || null

      // Track the view
      viewBlogMutation({
        blogId: blog._id,
        userSlug: userSlug || undefined,
        ipAddress: undefined, // Client-side IP detection not reliable
        userAgent: navigator.userAgent,
        referrer: document.referrer || undefined,
      })
        .then((result) => {
          if (result.success) {
            console.log('Blog view tracked successfully', result.viewCountIncremented)
            // Mark as viewed in local storage
            markAsViewed(slug)
          }
        })
        .catch((error) => {
          console.error('Failed to track blog view:', error)
        })
    }
  }, [blog, slug, hasViewed, markAsViewed, viewBlogMutation])

  // Ensure blog has required properties with defaults
  const blogWithDefaults = blog ? {
    ...blog,
    likeCount: blog.likeCount || 0,
    commentCount: blog.commentCount || 0,
    status: blog.status || 'DRAFT' as const,
    _creationTime: Date.now(), // Add default creation time
    // Transform coverImages to match BlogCoverImage component expectations
    coverImages: blog.coverImages?.map(img => ({
      id: img._id,
      imageUrl: img.imageUrl || null,
      altText: img.altText || null,
    })) || [],
    // Include tags and categories with proper structure
    tags: blog.tags?.filter(tag => tag != null).map(tag => ({
      id: tag._id,
      name: tag.name,
      slug: tag.slug,
      color: tag.color,
    })) || [],
    categories: blog.categories?.filter(cat => cat != null).map(cat => ({
      id: cat._id,
      name: cat.name,
      slug: cat.slug,
      color: cat.color,
    })) || []
  } : null

  const relatedBlogsData = useQuery(api.blogs.getRelatedBlogs, !!blog ? {
    currentBlogSlug: slug,
    limit: 4,
  } : "skip")

  console.log('relatedBlogsData', relatedBlogsData)

  // Transform related blogs data to match BlogSummaryResponseDto structure
  const relatedBlogs = Array.isArray(relatedBlogsData) ? relatedBlogsData.map(blog => ({
    id: blog.id,
    title: blog.title,
    slug: blog.slug,
    subtitle: blog.subtitle,
    excerpt: blog.excerpt,
    readingTime: blog.readingTime,
    status: blog.status,
    publishedAt: blog.publishedAt,
    viewCount: blog.viewCount,
    likeCount: blog.likeCount,
    commentCount: blog.commentCount,
    bookmarkCount: blog.bookmarkCount || 0,
    isPinned: blog.isPinned,
    isFeatured: blog.isFeatured,
    author: blog.author,
    coverImages: blog.coverImages?.map(img => ({
      id: img.id,
      imageUrl: img.imageUrl,
      altText: img.altText,
    })) || [],
    tags: blog.tags?.filter(tag => tag != null).map(tag => ({
      id: tag.id || tag.name,
      name: tag.name,
      slug: tag.slug,
      color: tag.color,
    })) || [],
    categories: blog.categories?.filter(cat => cat != null).map(cat => ({
      id: cat.id || cat.name,
      name: cat.name,
      slug: cat.slug,
      color: cat.color,
    })) || [],
    shareCount: 0,
    createdAt: blog.createdAt,
    updatedAt: blog.updatedAt,
    isLiked: blog.isLiked,
    isBookmarked: blog.isBookmarked,
  })) : []

  const isRelatedLoading = relatedBlogsData === undefined

  const handleLike = (liked: boolean) => {
    // Like state is now handled by BlogActions component
    console.log('Blog liked:', liked)
  }

  const handleBookmark = (bookmarked: boolean) => {
    // Handle bookmark logic here
    console.log('Bookmark toggled:', bookmarked)
  }

  const handleShare = async () => {
    if (!blogWithDefaults) return

    const url = `${window.location.origin}/blogs/${slug}`
    const title = blogWithDefaults.title
    const text = blogWithDefaults.excerpt || blogWithDefaults.title || ''

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

  if (isError || !blogWithDefaults) {
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
                The blog you are looking for does not exist or has been removed.
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
      {/* Main content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          {/* Back to Blogs button at top */}
          <div className="mb-4">
            <Link href="/blogs">
              <Button variant="ghost" className="text-gray-300 hover:text-white border-gray-600 border mb-8">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blogs
              </Button>
            </Link>
          </div>

          {/* Hero section */}
          <BlogHeader blog={blogWithDefaults} />

          {/* Cover image */}
          <BlogCoverImage coverImages={blogWithDefaults.coverImages} title={blogWithDefaults.title} />

          {/* Tags and Categories below image */}
          {(blogWithDefaults.categories?.length > 0 || blogWithDefaults.tags?.length > 0) && (
            <div className="flex flex-wrap gap-2 mb-4">
              {blogWithDefaults.categories?.map((category) => (
                <Link key={category.id} href={`/blogs/category/${category.slug}`}>
                  <Badge className="bg-purple-500/20 text-purple-200 hover:bg-purple-500/30 border-purple-500/30/50">
                    {category.name}
                  </Badge>
                </Link>
              ))}
              {blogWithDefaults.tags?.map((tag) => (
                <Link key={tag.id} href={`/blogs/tag/${tag.slug}`}>
                  <Badge variant="outline" className="border-gray-600/50 text-gray-300 hover:border-purple-500/50">
                    {tag.name}
                  </Badge>
                </Link>
              ))}
            </div>
          )}

          {/* Actions below photo */}
          <div className="flex justify-start py-2">
            <BlogActions
              blogSlug={slug}
              initialLikeCount={blogWithDefaults.likeCount}
              initialIsLiked={userInteraction?.isLiked || false}
              initialIsBookmarked={userInteraction?.isBookmarked || false}
              onLike={handleLike}
              onBookmark={handleBookmark}
              onShare={handleShare}
            />
          </div>

          {/* Content */}
          <BlogContent content={blogWithDefaults.content || ''} />

          {/* Actions after article */}
          <div className="flex justify-start py-2 border-t border-gray-800">
            <BlogActions
              blogSlug={slug}
              initialLikeCount={blogWithDefaults.likeCount}
              initialIsLiked={userInteraction?.isLiked || false}
              initialIsBookmarked={userInteraction?.isBookmarked || false}
              onLike={handleLike}
              onBookmark={handleBookmark}
              onShare={handleShare}
            />
          </div>

          {/* Social sharing */}
          <BlogSocialShare
            slug={slug}
            title={blogWithDefaults.title}
            excerpt={blogWithDefaults.excerpt}
            likeCount={blogWithDefaults.likeCount}
            commentCount={blogWithDefaults.commentCount}
          />

          {/* Author info */}
          <BlogAuthorCard author={{
            username: blogWithDefaults.author?.username || '',
            firstName: blogWithDefaults.author?.firstName || '',
            lastName: blogWithDefaults.author?.lastName || '',
            imageUrl: blogWithDefaults.author?.imageUrl || '',
            bio: blogWithDefaults.author?.bio || '',
          }} />

          {/* Comments section */}
          <BlogCommentsSection blog={blogWithDefaults} />
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
