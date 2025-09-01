'use client'

import { 
  ThumbsUp,
  MessageCircle,
  Facebook,
  Twitter,
  Linkedin,
  Copy,
  Check
} from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { showSuccessToast } from '@/lib/toast'

interface BlogSocialShareProps {
  slug: string
  title: string
  excerpt?: string | null
  likeCount: number
  commentCount: number
}

export function BlogSocialShare({ 
  slug, 
  title, 
  excerpt, 
  likeCount, 
  commentCount 
}: BlogSocialShareProps) {
  const [copiedUrl, setCopiedUrl] = useState(false)

  const handleShare = async (platform?: 'twitter' | 'facebook' | 'linkedin' | 'copy') => {
    const url = `${window.location.origin}/blogs/${slug}`
    const text = excerpt || title || ''

    switch (platform) {
    case 'twitter':
      window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank')
      break
    case 'facebook':
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank')
      break
    case 'linkedin':
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank')
      break
    case 'copy':
      try {
        await navigator.clipboard.writeText(url)
        setCopiedUrl(true)
        setTimeout(() => setCopiedUrl(false), 2000)
        showSuccessToast('Link copied!', 'Blog link copied to clipboard')
      } catch (error) {
        console.error('Failed to copy URL:', error)
      }
      break
    default:
      if (navigator.share) {
        try {
          await navigator.share({ title, text, url })
        } catch (error) {
          console.error('Error sharing:', error)
        }
      } else {
        // Fallback to copying URL
        handleShare('copy')
      }
    }
  }

  return (
    <div className="border-t border-gray-800 pt-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-gray-400 font-medium">Share this article:</span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleShare('twitter')}
              className="border-gray-700 text-gray-400 hover:border-blue-500 hover:text-blue-400"
            >
              <Twitter className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleShare('facebook')}
              className="border-gray-700 text-gray-400 hover:border-blue-600 hover:text-blue-500"
            >
              <Facebook className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleShare('linkedin')}
              className="border-gray-700 text-gray-400 hover:border-blue-700 hover:text-blue-600"
            >
              <Linkedin className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleShare('copy')}
              className="border-gray-700 text-gray-400 hover:border-purple-500 hover:text-purple-400"
            >
              {copiedUrl ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>
        </div>
        
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <ThumbsUp className="w-4 h-4" />
            {likeCount} likes
          </span>
          <span className="flex items-center gap-1">
            <MessageCircle className="w-4 h-4" />
            {commentCount} comments
          </span>
        </div>
      </div>
    </div>
  )
}
