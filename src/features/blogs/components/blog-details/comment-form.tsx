'use client'

import { MessageCircle, Send } from 'lucide-react'
import { useState } from 'react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useCurrentUser } from '@/features/auth'
import { Id, useMutation } from '@/lib/convex'
import { api } from '@/lib/convex'
import { showErrorToast } from '@/lib/toast'

interface CommentFormProps {
  blogSlug: string
  parentId?: string
  onCommentSubmitted?: () => void
  onCancel?: () => void
  placeholder?: string
  showAvatar?: boolean
}

export function CommentForm({
  blogSlug,
  parentId,
  onCommentSubmitted,
  onCancel,
  placeholder = 'Share your thoughts...',
  showAvatar = true
}: CommentFormProps) {
  const [content, setContent] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const { user, isAuthenticated } = useCurrentUser()
  const createCommentMutation = useMutation(api.blogs.createComment)

  // Don't show form if user is not authenticated
  if (!isAuthenticated || !user) {
    return (
      <div className="text-center py-6 bg-gray-900/50 border border-gray-800 rounded-lg">
        <div className="text-gray-400 mb-2">Please sign in to comment</div>
        <div className="text-gray-500 text-sm">
          You need to be logged in to participate in the discussion
        </div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!content.trim()) {
      showErrorToast('Comment cannot be empty')
      return
    }

    if (content.trim().length < 3) {
      showErrorToast('Comment must be at least 3 characters long')
      return
    }

    if (content.trim().length > 1000) {
      showErrorToast('Comment cannot exceed 1000 characters')
      return
    }

    try {
      setIsLoading(true)
      await createCommentMutation({
        blogSlug,
        content: content.trim(),
        parentId: parentId as Id<"blogComments">
      })

      setContent('')
      setIsFocused(false)
      onCommentSubmitted?.()
    } catch (error) {
      console.error('Failed to create comment:', error)
      // Error is already handled by the mutation hook
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setContent('')
    setIsFocused(false)
    onCancel?.()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex gap-3">
        {showAvatar && (
          <Avatar className="w-10 h-10 border-2 border-purple-500/20">
            <AvatarImage src={user.imageUrl || undefined} />
            <AvatarFallback className="bg-purple-500/20 text-purple-200">
              {user.firstName?.[0]}{user.lastName?.[0]}
            </AvatarFallback>
          </Avatar>
        )}
        
        <div className="flex-1 space-y-3">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onFocus={() => setIsFocused(true)}
            placeholder={placeholder}
            disabled={isLoading}
            className={`
              min-h-[100px] resize-none bg-gray-800/50 border-gray-700 
              text-white placeholder-gray-400 focus:border-purple-500/50 
              focus:ring-purple-500/20
              ${isFocused ? 'border-purple-500/50' : ''}
            `}
            maxLength={1000}
          />
          
          {(isFocused || content.trim()) && (
            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-400">
                {content.length}/1000 characters
              </div>
              
              <div className="flex items-center gap-2">
                {(isFocused && !parentId) && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleCancel}
                    disabled={isLoading}
                    className="text-gray-400 hover:text-white"
                  >
                    Cancel
                  </Button>
                )}
                
                <Button
                  type="submit"
                  size="sm"
                  disabled={!content.trim() || isLoading}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      Posting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      {parentId ? 'Reply' : 'Post Comment'}
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {!isFocused && !content.trim() && (
        <div className="flex items-center gap-2 text-sm text-gray-400 ml-13">
          <MessageCircle className="w-4 h-4" />
          <span>Join the conversation</span>
        </div>
      )}
    </form>
  )
}
