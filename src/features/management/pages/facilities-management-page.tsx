'use client'

import { useMutation, useQuery } from 'convex/react'
import { motion } from 'framer-motion'
import { Plus, MonitorPause, Settings2, User, Clock } from 'lucide-react'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { api, Id } from '@/lib/convex'

type Facility = {
  id: Id<'facilities'>
  name: string
  description?: string
  isActive?: boolean
  location?: string
  capacity?: number
  createdAt?: number
  updatedAt?: number
  occupancy?: Record<string, unknown>
}

type FacilityFromQuery = {
  id: Id<'facilities'>
  name: string
  description?: string
  location?: string
  capacity: number
  isActive?: boolean
  createdAt?: number
  updatedAt?: number
  occupancy: Record<string, unknown>
}

type ActiveSession = {
  id: Id<'facilityUsages'>
  userId: Id<'users'>
  facilityId: Id<'facilities'>
  timeIn?: number
  duration: number
  user: {
    id: Id<'users'>
    username?: string
    firstName?: string
    lastName?: string
    imageUrl?: string
  }
}

export function FacilitiesManagementPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isSessionsOpen, setIsSessionsOpen] = useState(false)
  const [queryText, setQueryText] = useState('')
  const [selected, setSelected] = useState<Facility | null>(null)
  const [selectedFacilityForSessions, setSelectedFacilityForSessions] = useState<Id<'facilities'> | null>(null)
  const [isFacilityActive, setIsFacilityActive] = useState<boolean>(true)

  const facilities = useQuery(api.facilities.getFacilities, {})
  const activeSessions = useQuery(
    api.facilities.getActiveSessions,
    selectedFacilityForSessions ? { facilityId: selectedFacilityForSessions } : "skip"
  )
  const createFacility = useMutation(api.facilities.createFacility)
  const updateFacility = useMutation(api.facilities.updateFacility)
  const endSession = useMutation(api.facilities.endFacilitySession)

  const filtered = useMemo(() => {
    if (!facilities) return []
    const q = queryText.trim().toLowerCase()
    if (!q) return facilities
    return facilities.filter((f: FacilityFromQuery) =>
      [f.name, f.description, f.location].some((v) => (v || '').toLowerCase().includes(q)),
    )
  }, [facilities, queryText])

  async function handleCreate(form: FormData) {
    try {
      await createFacility({
        name: String(form.get('name') || ''),
        description: String(form.get('description') || ''),
        location: String(form.get('location') || ''),
      })
      toast.success('Facility created')
      setIsCreateOpen(false)
    } catch {
      toast.error('Failed to create facility')
    }
  }

  async function handleUpdate(form: FormData) {
    if (!selected) return
    try {
      const facilityId = selected.id
      if (!facilityId) {
        toast.error('Facility ID is missing')
        return
      }

      await updateFacility({
        id: facilityId,
        name: String(form.get('name') || selected.name),
        description: String(form.get('description') || selected.description || ''),
        location: String(form.get('location') || selected.location || ''),
        isActive: isFacilityActive,
      })
      toast.success('Facility updated')
      setIsEditOpen(false)
      setSelected(null)
    } catch {
      toast.error('Failed to update facility')
    }
  }

  // No toggle handler; activation changes should be added via updateFacility isActive if needed

  function handleViewSessions(facilityId: Id<'facilities'>) {
    setSelectedFacilityForSessions(facilityId)
    setIsSessionsOpen(true)
  }

  function handleEditFacility(facility: Facility) {
    setSelected(facility)
    setIsFacilityActive(!!facility.isActive)
    setIsEditOpen(true)
  }

  async function handleEndSession(sessionId: Id<'facilityUsages'>) {
    try {
      await endSession({ sessionId })
      toast.success('Session ended')
      // Refresh the sessions list
      if (selectedFacilityForSessions) {
        // The query will automatically refresh
      }
    } catch {
      toast.error('Failed to end session')
    }
  }

  return (
    <motion.div className="container mx-auto px-0 py-8 max-w-7xl" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-semibold">Facilities</h1>
          <p className="text-sm text-muted-foreground">Manage access, sessions, and details</p>
        </div>
        <div className="flex items-center gap-3">
          <Input
            placeholder="Search facilities"
            value={queryText}
            onChange={(e) => setQueryText(e.target.value)}
            className="w-64 border-gray-800 focus:border-gray-800 hover:border-gray-400 ring-0"
          />
          <Button onClick={() => setIsCreateOpen(true)}>
            <Plus className="w-4 h-4 mr-2" /> New
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((f) => (
          <div key={String(f.id)} className="rounded-xl border border-gray-800 bg-card text-card-foreground shadow-sm p-4 flex flex-col gap-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: f.isActive ? '#22c55e' : '#ef4444' }} />
                  <h2 className="font-medium truncate">{f.name}</h2>
                  <span className={`text-xs px-2 py-1 rounded-full border ${
                    f.isActive
                      ? 'bg-green-500/10 text-green-500 border-green-500/30'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {f.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                {f.location ? <p className="text-xs text-pink-400/80 mt-2 truncate">{f.location}</p> : null}
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={() => handleEditFacility(f)} title="Edit">
                  <Settings2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            {f.description ? <p className="text-sm text-gray-400 line-clamp-2">{f.description}</p> : null}
            <Button size="sm" variant="secondary" onClick={() => handleViewSessions(f.id)}>
              <MonitorPause className="w-4 h-4 mr-2" /> Active sessions
            </Button>
          </div>
        ))}
      </div>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create facility</DialogTitle>
          </DialogHeader>
          <form
            className="space-y-4"
            action={async (formData) => {
              await handleCreate(formData)
            }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  required
                  className="border-gray-800 focus:border-gray-400 hover:border-gray-400 ring-0"
                />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  className="border-gray-800 focus:border-gray-400 hover:border-gray-400 ring-0"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                name="description"
                className="border-gray-800 focus:border-gray-400 hover:border-gray-400 ring-0"
              />
            </div>
            <div className="flex items-center justify-end gap-3">
              <Button type="button" variant="ghost" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
              <Button type="submit">Create</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>


      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit facility</DialogTitle>
          </DialogHeader>
          <form
            className="space-y-4"
            action={async (formData) => {
              await handleUpdate(formData)
            }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={selected?.name}
                  required
                  className="border-gray-800 focus:border-gray-400 hover:border-gray-400 ring-0"
                />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  defaultValue={selected?.location}
                  className="border-gray-800 focus:border-gray-400 hover:border-gray-400 ring-0"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                name="description"
                defaultValue={selected?.description}
                className="border-gray-800 focus:border-gray-400 hover:border-gray-400 ring-0"
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Switch
                  id="isActive"
                  name="isActive"
                  checked={isFacilityActive}
                  onCheckedChange={setIsFacilityActive}
                  className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-red-400"
                />
                <Label htmlFor="isActive" className="text-sm text-muted-foreground">
                  {isFacilityActive ? 'Active' : 'Inactive'}
                </Label>
              </div>
              <div className="flex items-center gap-3">
                <Button type="button" variant="ghost" onClick={() => setIsEditOpen(false)}>Cancel</Button>
                <Button type="submit">Save</Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Active Sessions Dialog */}
      <Dialog open={isSessionsOpen} onOpenChange={(open) => {
        setIsSessionsOpen(open)
        if (!open) {
          setSelectedFacilityForSessions(null)
        }
      }}>
        <DialogContent className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <DialogHeader className="pb-6">
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-violet-400 bg-clip-text text-transparent">
                    Active Sessions
              </DialogTitle>
              <p className="text-gray-400 text-sm mt-2">
                    Manage active user sessions for this facility.
              </p>
            </DialogHeader>

            <div className="max-h-[60vh] overflow-y-auto pr-4">
              {activeSessions && activeSessions.length > 0 && selectedFacilityForSessions ? (
                <div className="space-y-4">
                  {(activeSessions as ActiveSession[]).map((session) => (
                    <div key={String(session.id)} className="flex items-center justify-between p-4 rounded-lg border bg-card/50">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="font-medium">
                            {session.user.firstName || session.user.username}
                            {session.user.lastName && ` ${session.user.lastName}`}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            <span>
                                  Started {new Date(session.timeIn || 0).toLocaleString()}
                            </span>
                            <Badge variant="secondary" className="ml-2">
                              {Math.floor(session.duration / 60000)}m
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleEndSession(session.id)}
                      >
                            End Session
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MonitorPause className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No active sessions for this facility</p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-4">
              <Button
                variant="ghost"
                onClick={() => {
                  setIsSessionsOpen(false)
                  setSelectedFacilityForSessions(null)
                }}
              >
                    Close
              </Button>
            </div>
          </motion.div>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}

export default FacilitiesManagementPage


