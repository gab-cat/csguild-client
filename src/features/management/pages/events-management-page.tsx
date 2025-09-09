'use client'

import { useAutoAnimate } from '@formkit/auto-animate/react'
import { useMutation, useQuery } from 'convex/react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Search, Settings2, User, Calendar, Star, Pin } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useDebounce } from '@/hooks/use-debounce'
import { api, Id } from '@/lib/convex'

type Event = {
  id: Id<'events'>
  slug: string
  title: string
  type?: "IN_PERSON" | "VIRTUAL" | "HYBRID" | "OTHERS"
  imageUrl?: string
  description?: string
  details?: string
  startDate: number
  endDate?: number
  tags: string[]
  organizedBy: string
  minimumAttendanceMinutes?: number
  isPinned?: boolean
  createdAt?: number
  updatedAt?: number
  organizer: {
    id: Id<'users'>
    username?: string
    firstName?: string
    lastName?: string
    imageUrl?: string
  } | null
  attendeeCount: number
  averageRating: number | null
  ratingCount: number
}

const typeColors = {
  IN_PERSON: 'bg-green-500/10 text-green-500 border-green-500/30',
  VIRTUAL: 'bg-blue-500/10 text-blue-500 border-blue-500/30',
  HYBRID: 'bg-purple-500/10 text-purple-500 border-purple-500/30',
  OTHERS: 'bg-gray-500/10 text-gray-500 border-gray-500/30',
}

const typeLabels = {
  IN_PERSON: 'In Person',
  VIRTUAL: 'Virtual',
  HYBRID: 'Hybrid',
  OTHERS: 'Others',
}

export function EventsManagementPage() {
  const [queryText, setQueryText] = useState('')
  const [editOpen, setEditOpen] = useState(false)
  const [selected, setSelected] = useState<Event | null>(null)
  const [selectedType, setSelectedType] = useState<"IN_PERSON" | "VIRTUAL" | "HYBRID" | "OTHERS" | "all">("all")
  const [page, setPage] = useState(1)
  const [allEvents, setAllEvents] = useState<Event[]>([])
  const [hasMore, setHasMore] = useState(true)
  const [parentRef] = useAutoAnimate()
  
  const debouncedQueryText = useDebounce(queryText, 300)

  // Use paginated query with search
  const eventsResult = useQuery(api.events.getEvents, {
    search: debouncedQueryText && debouncedQueryText.trim() ? debouncedQueryText.trim() : undefined,
    type: selectedType === "all" ? undefined : selectedType,
    page: page,
    limit: 20,
    sortBy: "startDate",
    sortOrder: "desc",
  })

  const updateEvent = useMutation(api.events.updateEvent)

  // Reset pagination when search query or type filter changes
  useEffect(() => {
    setPage(1)
    setAllEvents([])
    setHasMore(true)
  }, [debouncedQueryText, selectedType])

  // Update events when paginated result changes
  useEffect(() => {
    if (eventsResult) {
      if (page === 1) {
        // First page or search reset
        setAllEvents(eventsResult.data)
      } else {
        // Append new page
        setAllEvents(prev => [...prev, ...eventsResult.data])
      }
      setHasMore(eventsResult.meta.page < eventsResult.meta.totalPages)
    }
  }, [eventsResult, page])

  const filtered = useMemo(() => allEvents, [allEvents])

  async function handleUpdate(form: FormData) {
    if (!selected) return
    
    try {
      const typeValue = form.get('type') as string
      const tagsValue = form.get('tags') as string
      const startDateValue = form.get('startDate') as string
      const endDateValue = form.get('endDate') as string
      const minimumAttendanceValue = form.get('minimumAttendanceMinutes') as string
      
      await updateEvent({
        slug: selected.slug,
        title: String(form.get('title') || selected.title),
        description: String(form.get('description') || selected.description || ''),
        details: String(form.get('details') || selected.details || ''),
        type: (typeValue as "IN_PERSON" | "VIRTUAL" | "HYBRID" | "OTHERS") || selected.type,
        tags: tagsValue ? tagsValue.split(',').map(tag => tag.trim()).filter(Boolean) : selected.tags,
        startDate: new Date(startDateValue).getTime(),
        endDate: endDateValue ? new Date(endDateValue).getTime() : undefined,
        minimumAttendanceMinutes: minimumAttendanceValue ? parseInt(minimumAttendanceValue) : selected.minimumAttendanceMinutes,
      })
      
      toast.success('Event updated')
      setEditOpen(false)
      setSelected(null)
      
      // Refresh data by resetting page
      setPage(1)
      setAllEvents([])
    } catch (error) {
      console.error('Update error:', error)
      toast.error('Failed to update event')
    }
  }

  function loadMore() {
    if (hasMore && eventsResult) {
      setPage(prev => prev + 1)
    }
  }


  // function formatDateTime(timestamp: number) {
  //   return new Date(timestamp).toLocaleString()
  // }

  function getOrganizerName(organizer: Event['organizer']) {
    if (!organizer) return 'Unknown'
    return `${organizer.firstName || ''} ${organizer.lastName || ''}`.trim() || organizer.username || 'Unknown'
  }

  function isEventUpcoming(startDate: number) {
    return startDate > Date.now()
  }

  function isEventPast(endDate?: number, startDate?: number) {
    const eventEnd = endDate || startDate
    return eventEnd ? eventEnd < Date.now() : false
  }

  return (
    <motion.div className="container mx-auto px-0 py-8 max-w-7xl" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex flex-col gap-4 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold">Events</h1>
            <p className="text-sm text-muted-foreground">Monitor, moderate, and manage events</p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex flex-col sm:flex-row gap-3 flex-1">
            <Select value={selectedType} onValueChange={(value) => setSelectedType(value as "IN_PERSON" | "VIRTUAL" | "HYBRID" | "OTHERS" | "all")}>
              <SelectTrigger className="w-full sm:w-48 border-gray-800 focus:border-gray-400 hover:border-gray-400">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="IN_PERSON">In Person</SelectItem>
                <SelectItem value="VIRTUAL">Virtual</SelectItem>
                <SelectItem value="HYBRID">Hybrid</SelectItem>
                <SelectItem value="OTHERS">Others</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-8 border-gray-800 focus:border-gray-400 hover:border-gray-400"
              placeholder="Search events"
              value={queryText}
              onChange={(e) => setQueryText(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div ref={parentRef} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((event) => (
          <div key={String(event.id)} className="rounded-xl border border-gray-800 transition-all duration-300 hover:border-gray-400 bg-card text-card-foreground shadow-sm p-4 flex flex-col gap-3">
            <div className="flex flex-col gap-3">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <span className={`inline-block h-2.5 w-2.5 rounded-full flex-shrink-0 ${
                        isEventUpcoming(event.startDate) ? 'bg-green-500' :
                          isEventPast(event.endDate, event.startDate) ? 'bg-gray-500' : 'bg-blue-500'
                      }`} />
                      <h2 className="font-medium truncate text-sm sm:text-base">{event.title}</h2>
                    </div>
                    <div className="flex items-center gap-2">
                      {event.isPinned && <Pin className="w-3 h-3 text-yellow-500 flex-shrink-0" />}
                      {event.type && (
                        <Badge variant="outline" className={`text-xs px-2 py-0.5 border ${typeColors[event.type]}`}>
                          {typeLabels[event.type]}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-pink-400/80 truncate mb-2 break-words">
                    by {getOrganizerName(event.organizer)}
                  </p>

                  {event.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {event.tags.slice(0, 2).map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {event.tags.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{event.tags.length - 2}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 self-start sm:self-center">
                  <Button variant="ghost" size="icon" onClick={() => {
                    setSelected(event);
                    setEditOpen(true);
                  }} title="Edit" className="h-8 w-8">
                    <Settings2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            
              {event.description && (
                <p className="text-sm text-gray-400 line-clamp-2">{event.description}</p>
              )}
            
              <div className="flex flex-col gap-2 text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3 h-3 text-gray-400 flex-shrink-0" />
                    <span className="text-gray-400 break-words">
                      {new Date(event.startDate).toLocaleDateString()}
                      {event.endDate && ` - ${new Date(event.endDate).toLocaleDateString()}`}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 sm:hidden">
                    {new Date(event.startDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    {event.endDate && ` - ${new Date(event.endDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3 flex-shrink-0" />
                      <span>{event.attendeeCount} attendees</span>
                    </div>
                    {event.averageRating && (
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 flex-shrink-0" />
                        <span>{event.averageRating.toFixed(1)} ({event.ratingCount})</span>
                      </div>
                    )}
                  </div>
                  {event.minimumAttendanceMinutes && (
                    <div className="text-gray-400 text-right sm:text-left">
                    Min: {event.minimumAttendanceMinutes}m
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && filtered.length > 0 && (
        <div className="flex justify-center mt-8">
          <Button
            variant="outline"
            onClick={loadMore}
            disabled={!hasMore}
            className="border-gray-800 hover:border-gray-400"
          >
            <ChevronDown className="w-4 h-4 mr-2" />
            Load More
          </Button>
        </div>
      )}

      {/* Edit Event Dialog */}
      <AnimatePresence>
        {editOpen && selected && (
          <Dialog open={editOpen} onOpenChange={setEditOpen}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto mx-4 sm:mx-auto">
              <DialogHeader>
                <DialogTitle className="text-lg sm:text-xl">Edit Event: {selected.title}</DialogTitle>
              </DialogHeader>
              <form
                className="space-y-4"
                action={async (formData) => {
                  await handleUpdate(formData)
                }}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input 
                      id="title" 
                      name="title" 
                      defaultValue={selected.title} 
                      className="border-gray-800 focus:border-gray-400 hover:border-gray-400" 
                    />
                  </div>
                  <div>
                    <Label htmlFor="type">Type</Label>
                    <Select name="type" defaultValue={selected.type || undefined}>
                      <SelectTrigger className="border-gray-800 focus:border-gray-400 hover:border-gray-400">
                        <SelectValue placeholder="Select event type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="IN_PERSON">In Person</SelectItem>
                        <SelectItem value="VIRTUAL">Virtual</SelectItem>
                        <SelectItem value="HYBRID">Hybrid</SelectItem>
                        <SelectItem value="OTHERS">Others</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    name="description" 
                    defaultValue={selected.description || ''} 
                    className="border-gray-800 focus:border-gray-400 hover:border-gray-400" 
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="details">Details</Label>
                  <Textarea 
                    id="details" 
                    name="details" 
                    defaultValue={selected.details || ''} 
                    className="border-gray-800 focus:border-gray-400 hover:border-gray-400" 
                    rows={3}
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startDate">Start Date & Time</Label>
                    <Input 
                      id="startDate" 
                      name="startDate" 
                      type="datetime-local"
                      defaultValue={new Date(selected.startDate).toISOString().slice(0, 16)} 
                      className="border-gray-800 focus:border-gray-400 hover:border-gray-400" 
                    />
                  </div>
                  <div>
                    <Label htmlFor="endDate">End Date & Time</Label>
                    <Input 
                      id="endDate" 
                      name="endDate" 
                      type="datetime-local"
                      defaultValue={selected.endDate ? new Date(selected.endDate).toISOString().slice(0, 16) : ''} 
                      className="border-gray-800 focus:border-gray-400 hover:border-gray-400" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="tags">Tags (comma-separated)</Label>
                    <Input 
                      id="tags" 
                      name="tags" 
                      defaultValue={selected.tags.join(', ')} 
                      className="border-gray-800 focus:border-gray-400 hover:border-gray-400" 
                      placeholder="e.g., workshop, tech, networking"
                    />
                  </div>
                  <div>
                    <Label htmlFor="minimumAttendanceMinutes">Min. Attendance (minutes)</Label>
                    <Input 
                      id="minimumAttendanceMinutes" 
                      name="minimumAttendanceMinutes" 
                      type="number"
                      defaultValue={selected.minimumAttendanceMinutes || ''} 
                      className="border-gray-800 focus:border-gray-400 hover:border-gray-400" 
                      placeholder="e.g., 60"
                    />
                  </div>
                </div>

                <div className="bg-gray-800/30 rounded-lg p-4">
                  <h4 className="font-medium mb-2">Event Info</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Organizer:</span>
                      <p className="break-words">{getOrganizerName(selected.organizer)}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Attendees:</span>
                      <p>{selected.attendeeCount}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Rating:</span>
                      <p className="break-words">
                        {selected.averageRating
                          ? `${selected.averageRating.toFixed(1)}/5 (${selected.ratingCount} reviews)`
                          : 'No ratings yet'
                        }
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-400">Created:</span>
                      <p className="text-xs sm:text-sm">{selected.createdAt ? new Date(selected.createdAt).toLocaleDateString() : 'Unknown'}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-3">
                  <Button type="button" variant="ghost" onClick={() => {
                    setEditOpen(false);
                    setSelected(null);
                  }} className="w-full sm:w-auto">Cancel</Button>
                  <Button type="submit" className="w-full sm:w-auto">Save Changes</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default EventsManagementPage
