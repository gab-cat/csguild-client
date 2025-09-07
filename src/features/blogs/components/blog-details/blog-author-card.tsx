'use client'

import { User } from 'lucide-react'
import Link from 'next/link'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

interface BlogAuthorCardProps {
  author: {
    username: string
    firstName?: string
    lastName?: string
    imageUrl?: string
    bio?: string
  }
}

export function BlogAuthorCard({ author }: BlogAuthorCardProps) {
  return (
    <Card className="bg-gray-900/50 border-gray-800 py-0">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Avatar className="w-16 h-16 border-2 border-purple-500/20">
            <AvatarImage src={author.imageUrl || undefined} />
            <AvatarFallback className="bg-purple-500/20 text-purple-200 text-lg">
              {(author.firstName?.[0] || '')}{(author.lastName?.[0] || '')}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <Link 
              href={`/blogs/author/${author.username}`}
              className="text-xl font-semibold text-white hover:text-purple-400 transition-colors"
            >
              {author.firstName || ''} {author.lastName || ''}
            </Link>
            <p className="text-gray-400 mt-2">
              {/* Mock bio - would come from API */}
              {author.bio || 'Passionate writer and developer sharing insights about technology, design, and innovation.'}
            </p>
            <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <User className="w-3 h-3" />
                {/* Mock follower count */}
                1.2k followers
              </span>
              {/* <span className="flex items-center gap-1">
                <MessageCircle className="w-3 h-3" />
                Mock post count
                42 posts
              </span> */}
            </div>
          </div>
          <Button variant="outline" className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10">
            Follow
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
