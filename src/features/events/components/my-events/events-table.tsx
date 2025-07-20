'use client'

import { motion } from 'framer-motion'
import { Calendar, ExternalLink, Edit, Users } from 'lucide-react'
import Link from 'next/link'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

import { toEventCard } from '../../types'
import { getEventStatusDetails } from '../../utils'

interface EventsTableProps {
  events: ReturnType<typeof toEventCard>[]
  showActions?: boolean
  showEditActions?: boolean
}

export function EventsTable({ events, showActions = true, showEditActions = false }: EventsTableProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return {
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    }
  }


  if (events.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        No events to display
      </div>
    )
  }

  return (
    <motion.div 
      className="rounded-lg border border-gray-800 bg-gray-900/50 backdrop-blur-sm overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Table>
        <TableHeader>
          <TableRow className="border-gray-800 hover:bg-gray-800/50">
            <TableHead className="text-gray-300 font-semibold">Event</TableHead>
            <TableHead className="text-gray-300 font-semibold">Status</TableHead>
            <TableHead className="text-gray-300 font-semibold">Start Date</TableHead>
            {!showEditActions && <TableHead className="text-gray-300 font-semibold">Tags</TableHead>}
            {showActions && (
              <TableHead className="text-gray-300 font-semibold">Actions</TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.map((event, index) => {
            const startDateInfo = formatDate(event.startDate)
            const { status, color } = getEventStatusDetails(event.startDate, event.endDate)
            
            return (
              <TableRow 
                key={event.id} 
                className="border-gray-800 hover:bg-gray-800/30 transition-colors"
              >
                <TableCell>
                  <motion.div 
                    className="space-y-1"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      duration: 0.3, 
                      delay: index * 0.05,
                      ease: "easeOut"
                    }}
                  >
                    <p className="text-white font-medium line-clamp-1">{event.title}</p>
                    {!showEditActions && event.description && (
                      <p className="text-gray-400 text-sm line-clamp-2">{event.description}</p>
                    )}
                  </motion.div>
                </TableCell>
                <TableCell>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2, delay: index * 0.05 + 0.1 }}
                  >
                    <Badge variant="outline" className={color}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </Badge>
                  </motion.div>
                </TableCell>
                <TableCell>
                  <motion.div 
                    className="flex items-center gap-2 text-gray-300"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 + 0.15 }}
                  >
                    <Calendar className="w-4 h-4" />
                    <div className="text-sm">
                      <div>{startDateInfo.day}, {startDateInfo.date}</div>
                      <div className="text-gray-400">{startDateInfo.time}</div>
                    </div>
                  </motion.div>
                </TableCell>
                {!showEditActions && (
                  <TableCell>
                    <motion.div 
                      className="flex flex-wrap gap-1"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 + 0.2 }}
                    >
                      {event.tags && event.tags.length > 0 ? (
                        event.tags.slice(0, 2).map((tag, tagIndex) => (
                          <motion.div
                            key={tagIndex}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ 
                              duration: 0.2, 
                              delay: index * 0.05 + tagIndex * 0.05 + 0.25 
                            }}
                          >
                            <Badge 
                              variant="outline" 
                              className="bg-purple-100 text-purple-800 border-purple-200 text-xs"
                            >
                              {tag}
                            </Badge>
                          </motion.div>
                        ))
                      ) : (
                        <span className="text-gray-500 text-sm">No tags</span>
                      )}
                      {event.tags && event.tags.length > 2 && (
                        <span className="text-gray-400 text-xs">+{event.tags.length - 2}</span>
                      )}
                    </motion.div>
                  </TableCell>
                )}
                {showActions && (
                  <TableCell>
                    <motion.div 
                      className="flex items-center gap-2"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 + 0.3 }}
                    >
                      <Button size="sm" variant="outline" asChild className="border-gray-700 text-gray-300 hover:bg-gray-800">
                        <Link href={`/events/${event.slug}`}>
                          <ExternalLink className="w-4 h-4 mr-1" />
                          View
                        </Link>
                      </Button>
                      {showEditActions && (
                        <>
                          <Button size="sm" variant="outline" asChild className="border-purple-700 text-purple-300 hover:bg-purple-800/20">
                            <Link href={`/events/${event.slug}/edit`}>
                              <Edit className="w-4 h-4 mr-1" />
                              Edit
                            </Link>
                          </Button>
                          <Button size="sm" variant="outline" asChild className="border-blue-700 text-blue-300 hover:bg-blue-800/20">
                            <Link href={`/events/${event.slug}/attend`}>
                              <Users className="w-4 h-4 mr-1" />
                              Attendance
                            </Link>
                          </Button>
                          <Button size="sm" variant="outline" asChild className="border-green-700 text-green-300 hover:bg-green-800/20">
                            <Link href={`/events/${event.slug}/responses`}>
                              <Users className="w-4 h-4 mr-1" />
                              Responses
                            </Link>
                          </Button>
                        </>
                      )}
                    </motion.div>
                  </TableCell>
                )}
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </motion.div>
  )
}
