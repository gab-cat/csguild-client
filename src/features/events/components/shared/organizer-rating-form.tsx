'use client'

import { motion } from 'framer-motion'
import { Star, User } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'

import type { OrganizerRatingSchemaType } from '../../schemas'
import type { EventDetailResponseDto } from '../../types'

interface OrganizerRatingFormProps {
  event: EventDetailResponseDto
  value?: OrganizerRatingSchemaType
  onChange: (rating: OrganizerRatingSchemaType | undefined) => void
  disabled?: boolean
}

export function OrganizerRatingForm({ 
  event, 
  value, 
  onChange, 
  disabled = false 
}: OrganizerRatingFormProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  
  const handleRatingChange = (rating: number) => {
    if (disabled) return
    
    const newRating = {
      rating,
      comment: value?.comment || ''
    }
    onChange(newRating)
    setIsExpanded(true)
  }
  
  const handleCommentChange = (comment: string) => {
    if (disabled || !value) return
    
    onChange({
      ...value,
      comment
    })
  }
  
  const clearRating = () => {
    onChange(undefined)
    setIsExpanded(false)
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-lg">
              <User className="h-5 w-5 text-yellow-400" />
            </div>
            Rate the Organizer
          </CardTitle>
          <p className="text-gray-400 text-sm">
            Share your experience with {event.organizer.firstName} {event.organizer.lastName}&apos;s event organization
          </p>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Organizer Info */}
          <div className="flex items-center gap-3 p-3 bg-gray-800/30 rounded-lg">
            <Avatar>
              <Image
                src={typeof event.organizer.imageUrl === 'string' ? event.organizer.imageUrl : ''}
                alt={`${event.organizer.firstName} ${event.organizer.lastName}`}
                width={75}
                height={75}
                className='rounded-full object-cover'
              />
              <AvatarFallback>
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {event.organizer.firstName[0]}{event.organizer.lastName[0]}
                </div>
              </AvatarFallback>
            </Avatar>

            <div>
              <p className="text-white font-medium">
                {event.organizer.firstName} {event.organizer.lastName}
              </p>
              <p className="text-gray-400 text-sm">@{event.organizer.username}</p>
            </div>
          </div>
          
          <Separator className="bg-gray-800" />
          
          {/* Rating Stars */}
          <div className="space-y-3">
            <label className="text-white font-medium">Your Rating</label>
            <div className="flex items-center gap-2">
              {Array.from({ length: 5 }, (_, i) => (
                <motion.button
                  key={i}
                  type="button"
                  onClick={() => handleRatingChange(i + 1)}
                  disabled={disabled}
                  className={`p-1 rounded transition-all duration-200 ${
                    disabled 
                      ? 'cursor-not-allowed opacity-50' 
                      : 'cursor-pointer hover:scale-110'
                  } ${
                    (value?.rating || 0) > i
                      ? 'text-yellow-400'
                      : 'text-gray-600 hover:text-yellow-500'
                  }`}
                  whileHover={disabled ? {} : { scale: 1.1 }}
                  whileTap={disabled ? {} : { scale: 0.95 }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ 
                    duration: 0.2, 
                    delay: i * 0.05
                  }}
                >
                  <Star className="w-8 h-8 fill-current" />
                </motion.button>
              ))}
              
              {value?.rating && (
                <motion.div 
                  className="ml-3 flex items-center gap-2"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <span className="text-yellow-400 font-medium">
                    {value.rating}/5
                  </span>
                  {!disabled && (
                    <button
                      type="button"
                      onClick={clearRating}
                      className="text-gray-400 hover:text-white text-sm underline"
                    >
                      Clear
                    </button>
                  )}
                </motion.div>
              )}
            </div>
            
            {/* Rating labels */}
            <div className="flex justify-between text-xs text-gray-500">
              <span>Poor</span>
              <span>Fair</span>
              <span>Good</span>
              <span>Very Good</span>
              <span>Excellent</span>
            </div>
          </div>
          
          {/* Comment Section */}
          {(isExpanded || value?.rating) && (
            <motion.div 
              className="space-y-3"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
            >
              <label className="text-white font-medium">
                Comment <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <Textarea
                value={value?.comment || ''}
                onChange={(e) => handleCommentChange(e.target.value)}
                placeholder="Share your thoughts about the organizer's performance..."
                disabled={disabled}
                className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 min-h-[80px] transition-all duration-200 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500"
              />
            </motion.div>
          )}
          
          {/* Rating Guidelines */}
          {!value?.rating && (
            <motion.div 
              className="p-3 bg-gray-800/20 rounded-lg border border-gray-800"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <h4 className="text-white text-sm font-medium mb-2">Rating Guidelines:</h4>
              <ul className="text-gray-400 text-xs space-y-1">
                <li>• <strong>1-2 stars:</strong> Poor organization, issues with communication</li>
                <li>• <strong>3 stars:</strong> Average organization, met basic expectations</li>
                <li>• <strong>4-5 stars:</strong> Excellent organization, clear communication, great experience</li>
              </ul>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
