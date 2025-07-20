'use client'

import { BarChart, Trophy, Hash, Star, Type, CheckSquare, ChevronDown } from 'lucide-react'
import React from 'react'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import type { FeedbackStatisticsDto } from '@generated/api-client'

// Enhanced field statistics interface based on API response
interface EnhancedFieldStats {
  fieldLabel: string
  fieldType: string
  totalAnswers: number
  responseRate: number
  
  // For radio, checkbox, select fields
  optionCounts?: Record<string, number>
  mostPopular?: {
    option: string
    count: number
  }
  
  // For rating fields
  average?: number
  min?: number
  max?: number
  distribution?: Record<string, number>
  
  // For text and textarea fields
  averageWordCount?: number
  totalWords?: number
  sampleResponses?: string[]
  
  // For select fields
  sampleAnswers?: string[]
}

interface FieldStatisticsDetailsProps {
  statistics: FeedbackStatisticsDto
  className?: string
}

export function FieldStatisticsDetails({ statistics, className }: FieldStatisticsDetailsProps) {
  if (!statistics.fieldStats || Object.keys(statistics.fieldStats).length === 0) {
    return (
      <Card className={cn("bg-gray-900/50 backdrop-blur-sm border-gray-800/50 shadow-lg", className)}>
        <CardContent className="py-12">
          <div className="text-center">
            <div className="mx-auto h-16 w-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center mb-4">
              <BarChart className="h-8 w-8 text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-white">No Field Statistics</h3>
            <p className="text-gray-400 text-sm">
              No field-level statistics are available for this event.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">
          Field Statistics ({Object.keys(statistics.fieldStats).length})
        </h3>
      </div>
      
      <div className="space-y-4">
        {Object.entries(statistics.fieldStats).map(([fieldId, fieldStats]) => {
          const enhancedStats = fieldStats as EnhancedFieldStats
          const responseRatePercent = Math.round((enhancedStats.totalAnswers / statistics.totalResponses) * 100)
          
          return (
            <Card key={fieldId} className="bg-gray-900/50 backdrop-blur-sm border-gray-800/50 shadow-lg">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 pr-3">
                    <CardTitle className="text-white text-base leading-relaxed">
                      {enhancedStats.fieldLabel || fieldId}
                    </CardTitle>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge variant="outline" className="bg-purple-500/10 border-purple-500/30 text-purple-300 text-xs">
                        {enhancedStats.fieldType}
                      </Badge>
                      <Badge variant="outline" className="bg-gray-700/50 border-gray-600 text-gray-300 text-xs">
                        {enhancedStats.totalAnswers}/{statistics.totalResponses} responses
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Response Rate */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Response Rate</span>
                    <span className="font-medium text-white">{responseRatePercent}%</span>
                  </div>
                  <Progress 
                    value={responseRatePercent}
                    className="h-2 bg-gray-700"
                  />
                </div>

                {/* Field Type Specific Statistics */}
                {enhancedStats.fieldType === 'rating' && (
                  <>
                    {/* Rating Statistics */}
                    {enhancedStats.average && (
                      <div className="space-y-2">
                        <div className="flex items-center space-x-1 text-sm text-gray-400">
                          <Star className="h-4 w-4" />
                          <span>Rating Analysis</span>
                        </div>
                        <div className="bg-gray-800/30 rounded-lg p-4 space-y-3">
                          <div className="grid grid-cols-3 gap-4 text-center">
                            <div>
                              <p className="text-xs text-gray-500 uppercase">Average</p>
                              <p className="text-lg font-bold text-white">{enhancedStats.average.toFixed(1)}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 uppercase">Min</p>
                              <p className="text-lg font-bold text-white">{enhancedStats.min}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 uppercase">Max</p>
                              <p className="text-lg font-bold text-white">{enhancedStats.max}</p>
                            </div>
                          </div>
                          
                          {/* Rating Distribution */}
                          {enhancedStats.distribution && (
                            <div className="space-y-2">
                              <p className="text-xs text-gray-500 uppercase">Distribution</p>
                              {Object.entries(enhancedStats.distribution)
                                .sort(([a], [b]) => parseInt(b) - parseInt(a))
                                .map(([rating, count]) => (
                                  <div key={rating} className="flex items-center justify-between text-sm">
                                    <div className="flex items-center space-x-2">
                                      <div className="flex">
                                        {Array.from({ length: parseInt(rating) }, (_, i) => (
                                          <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                        ))}
                                      </div>
                                      <span className="text-gray-300">{rating} stars</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <div className="w-16 bg-gray-700 rounded-full h-1.5">
                                        <div 
                                          className="bg-yellow-400 h-1.5 rounded-full transition-all duration-300" 
                                          style={{ width: `${(count / enhancedStats.totalAnswers) * 100}%` }}
                                        />
                                      </div>
                                      <span className="font-medium text-white w-6 text-right">{count}</span>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* Text/Textarea Statistics */}
                {(enhancedStats.fieldType === 'text' || enhancedStats.fieldType === 'textarea') && (
                  <>
                    {enhancedStats.averageWordCount !== undefined && (
                      <div className="space-y-2">
                        <div className="flex items-center space-x-1 text-sm text-gray-400">
                          <Type className="h-4 w-4" />
                          <span>Text Analysis</span>
                        </div>
                        <div className="bg-gray-800/30 rounded-lg p-4 space-y-3">
                          <div className="grid grid-cols-2 gap-4 text-center">
                            <div>
                              <p className="text-xs text-gray-500 uppercase">Avg Words</p>
                              <p className="text-lg font-bold text-white">{enhancedStats.averageWordCount}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 uppercase">Total Words</p>
                              <p className="text-lg font-bold text-white">{enhancedStats.totalWords}</p>
                            </div>
                          </div>
                          
                          {/* Sample Responses */}
                          {enhancedStats.sampleResponses && enhancedStats.sampleResponses.length > 0 && (
                            <div className="space-y-2">
                              <p className="text-xs text-gray-500 uppercase">Sample Responses</p>
                              <div className="space-y-2">
                                {enhancedStats.sampleResponses.slice(0, 3).map((response, index) => (
                                  <div key={index} className="bg-gray-700/50 rounded p-2 text-sm text-gray-300 italic">
                                    &ldquo;{response}&rdquo;
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* Select Field Statistics */}
                {enhancedStats.fieldType === 'select' && (
                  <>
                    {enhancedStats.sampleAnswers && enhancedStats.sampleAnswers.length > 0 && (
                      <div className="space-y-2">
                        <div className="flex items-center space-x-1 text-sm text-gray-400">
                          <ChevronDown className="h-4 w-4" />
                          <span>Selected Options</span>
                        </div>
                        <div className="space-y-2">
                          {enhancedStats.sampleAnswers.slice(0, 3).map((answer, index) => (
                            <div key={index} className="bg-gray-700/50 rounded-lg p-3">
                              <span className="font-medium text-white text-sm">{answer}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* Radio/Checkbox Option Counts */}
                {(enhancedStats.fieldType === 'radio' || enhancedStats.fieldType === 'checkbox') && enhancedStats.optionCounts && Object.keys(enhancedStats.optionCounts).length > 0 && (
                  <>
                    {/* Most Popular Response */}
                    {enhancedStats.mostPopular && (
                      <div className="space-y-2">
                        <div className="flex items-center w-fit text-sm text-yellow-400 bg-yellow-400/10 rounded-lg p-2 space-x-2">
                          <Trophy className="h-4 w-4" />
                          <span>Most Popular</span>
                        </div>
                        <div className="bg-gray-700/50 rounded-lg p-3">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-white text-sm">
                              {enhancedStats.mostPopular.option}
                            </span>
                            <Badge className="bg-green-500/20 text-green-300 border-green-500/30 text-xs">
                              {enhancedStats.mostPopular.count} votes
                            </Badge>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Option Breakdown */}
                    <div className="space-y-2">
                      <div className="flex items-center space-x-1 text-sm text-gray-400">
                        {enhancedStats.fieldType === 'radio' ? <Hash className="h-4 w-4" /> : <CheckSquare className="h-4 w-4" />}
                        <span>Response Breakdown</span>
                      </div>
                      <div className="space-y-2">
                        {Object.entries(enhancedStats.optionCounts)
                          .sort(([,a], [,b]) => b - a) // Sort by count descending
                          .map(([option, count]) => (
                            <div key={option} className="flex items-center justify-between text-sm">
                              <span className="text-gray-300 truncate flex-1 pr-2">{option}</span>
                              <div className="flex items-center space-x-2 flex-shrink-0">
                                <div className="w-16 bg-gray-700 rounded-full h-1.5">
                                  <div 
                                    className="bg-purple-400 h-1.5 rounded-full transition-all duration-300" 
                                    style={{ width: `${(count / enhancedStats.totalAnswers) * 100}%` }}
                                  />
                                </div>
                                <span className="font-medium text-white w-8 text-right">{count}</span>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
