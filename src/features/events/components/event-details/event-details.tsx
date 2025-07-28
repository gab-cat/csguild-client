'use client'

import { motion } from 'framer-motion'
import { FileText, ChevronDown, ChevronUp } from 'lucide-react'
import React, { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { EventDetailResponseDto } from '../../types'

interface EventDetailsProps {
  event: EventDetailResponseDto
}

export function EventDetails({ event }: EventDetailsProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  
  if (!event.details || typeof event.details !== 'string') {
    return null
  }

  const details = event.details as string
  const shouldTruncate = details.length > 500
  const displayText = shouldTruncate && !isExpanded 
    ? details.substring(0, 500) + '...' 
    : details

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl text-white">
            <div className="p-2 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-lg">
              <FileText className="h-5 w-5 text-indigo-400" />
            </div>
            Event Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-invert max-w-none">
            <div className="text-gray-300 leading-relaxed whitespace-pre-wrap">
              {displayText}
            </div>
            
            {shouldTruncate && (
              <div className="mt-4 flex justify-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10"
                >
                  {isExpanded ? (
                    <>
                      <ChevronUp className="h-4 w-4 mr-2" />
                      Show Less
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4 mr-2" />
                      Read More
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
