'use client'

import { useAutoAnimate } from '@formkit/auto-animate/react'
import { useMutation, useQuery } from 'convex/react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, ChevronDown, IdCard, MailCheck, MailQuestion, Pencil, Search } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useDebounce } from '@/hooks/use-debounce'
import { api, Id } from '@/lib/convex'

type AppUser = {
  _id: Id<'users'>
  email?: string
  username?: string
  firstName?: string
  lastName?: string
  emailVerified?: boolean
  rfidId?: string
  roles?: string[]
}

export function UsersManagementPage() {
  const [queryText, setQueryText] = useState('')
  const [editOpen, setEditOpen] = useState(false)
  const [selected, setSelected] = useState<AppUser | null>(null)
  const [selectedRoles, setSelectedRoles] = useState<Array<"STUDENT" | "USER" | "STAFF" | "ADMIN">>([])
  const [cursor, setCursor] = useState<string | null>(null)
  const [allUsers, setAllUsers] = useState<AppUser[]>([])
  const [isDone, setIsDone] = useState(false)
  const [parentRef] = useAutoAnimate()
  // Debounce the search query to avoid too many API calls
  const debouncedQueryText = useDebounce(queryText, 300)

  // Debug debounced value
  useEffect(() => {
    console.log('Debounced query text:', debouncedQueryText)
  }, [debouncedQueryText])

  // Use paginated query with debounced search
  const paginatedResult = useQuery(api.users.getUsersPaginated, {
    paginationOpts: { numItems: 20, cursor: cursor },
    searchQuery: debouncedQueryText && debouncedQueryText.trim() ? debouncedQueryText.trim() : undefined,
  })
  const resendVerification = useMutation(api.users.resendEmailVerification)
  const adminUpdateUser = useMutation(api.users.adminUpdateUser)
  const adminRegisterRfid = useMutation(api.users.adminRegisterRfidCard)

  // Reset pagination when search query changes
  useEffect(() => {
    console.log('Search query changed:', debouncedQueryText)
    setCursor(null)
    setAllUsers([])
    setIsDone(false)
  }, [debouncedQueryText])

  // Update users when paginated result changes
  useEffect(() => {
    if (paginatedResult) {
      console.log('Received paginated result:', {
        pageCount: paginatedResult.page.length,
        isDone: paginatedResult.isDone,
        hasContinueCursor: !!paginatedResult.continueCursor,
        cursor: cursor
      });

      if (cursor === null) {
        // First page or search reset
        setAllUsers(paginatedResult.page)
      } else {
        // Append new page
        setAllUsers(prev => [...prev, ...paginatedResult.page])
      }
      setIsDone(paginatedResult.isDone)
    }
  }, [paginatedResult, cursor])

  // Since search is handled server-side, we just return allUsers
  const filtered = useMemo(() => allUsers, [allUsers])

  async function handleResend(email: string) {
    try {
      await resendVerification({ email })
      toast.success('Verification email sent')
    } catch {
      toast.error('Failed to send verification')
    }
  }

  async function handleUpdate(form: FormData) {
    if (!selected) return
    try {
      await adminUpdateUser({
        userId: selected._id,
        firstName: String(form.get('firstName') || selected.firstName || ''),
        lastName: String(form.get('lastName') || selected.lastName || ''),
        username: selected.username,
        roles: selectedRoles.length > 0 ? selectedRoles : undefined,
      })
      toast.success('User updated')
      setEditOpen(false)
      setSelected(null)
      setSelectedRoles([])
    } catch {
      toast.error('Failed to update user')
    }
  }

  async function handleRegisterRfid(userId: Id<'users'>, card: string) {
    try {
      await adminRegisterRfid({ userId, rfidId: card })
      toast.success('RFID linked')
    } catch {
      toast.error('Failed to link RFID')
    }
  }

  return (
    <motion.div className="container mx-auto px-0 py-8 max-w-7xl" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-semibold">Users</h1>
          <p className="text-sm text-muted-foreground">Search, inspect, and act quickly</p>
        </div>
        <div className="relative w-80">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-8 border-gray-800 focus:border-gray-400 hover:border-gray-400"
            placeholder="Search users"
            value={queryText}
            onChange={(e) => {
              console.log('Search input changed:', e.target.value);
              setQueryText(e.target.value);
            }}
          />
        </div>
      </div>

      <div ref={parentRef} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {(filtered || []).map((u: AppUser) => (
          <div key={String(u._id)} className="rounded-xl border border-gray-800 transition-all duration-300 hover:border-gray-400 bg-card text-card-foreground shadow-sm p-4 flex flex-col gap-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="font-medium truncate">{`${u.firstName || ''} ${u.lastName || ''}`.trim() || u.username || u.email}</h2>
                  {u.emailVerified ? (
                    <span className="inline-flex items-center rounded-full bg-emerald-500/10 text-emerald-600 px-2 py-0.5 text-xs gap-1"><Check className="w-3 h-3" /> Verified</span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-amber-500/10 text-amber-600 px-2 py-0.5 text-xs">Unverified</span>
                  )}
                </div>
                <p className="text-xs text-pink-400/80 truncate mb-2">{u.email}</p>
                {u.roles && u.roles.length ? <p className="text-xs text-gray-400">Roles: {u.roles.join(', ')}</p> : null}
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={() => {
                  setSelected(u);
                  setSelectedRoles((u.roles as Array<"STUDENT" | "USER" | "STAFF" | "ADMIN">) || []);
                  setEditOpen(true);
                }} title="Edit">
                  <Pencil className="w-4 h-4" />
                </Button>
                {u.emailVerified ? (
                  <Button variant="ghost" size="icon" title="Email verified" disabled>
                    <MailCheck className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button variant="ghost" size="icon" onClick={() => handleResend(u.email || '')} title="Resend verification">
                    <MailQuestion className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between gap-3">
              <div className="text-xs bg-gray-800/50 rounded-md px-2 py-1 truncate">
                RFID: {u.rfidId ? (
                  <span className="text-foreground">{u.rfidId}</span>
                ) : (
                  <span className="opacity-70">none</span>
                )}
              </div>
              <RfidPrompt onSubmit={(card) => handleRegisterRfid(u._id, card)} />
            </div>
          </div>
        ))}
      </div>

      {/* Load More Button */}
      {!isDone && filtered.length > 0 && (
        <div className="flex justify-center mt-8">
          <Button
            variant="outline"
            onClick={() => {
              if (paginatedResult?.continueCursor) {
                setCursor(paginatedResult.continueCursor)
              }
            }}
            disabled={!paginatedResult?.continueCursor}
            className="border-gray-800 hover:border-gray-400"
          >
            <ChevronDown className="w-4 h-4 mr-2" />
            Load More
          </Button>
        </div>
      )}

      <AnimatePresence>
        {editOpen && selected && (
          <Dialog open={editOpen} onOpenChange={setEditOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit user</DialogTitle>
              </DialogHeader>
              <form
                className="space-y-4"
                action={async (formData) => {
                  await handleUpdate(formData)
                }}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First name</Label>
                    <Input id="firstName" name="firstName" defaultValue={selected.firstName} className="border-gray-800 focus:border-gray-400 hover:border-gray-400" />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last name</Label>
                    <Input id="lastName" name="lastName" defaultValue={selected.lastName} className="border-gray-800 focus:border-gray-400 hover:border-gray-400" />
                  </div>
                </div>
                <div>
                  <Label>Email</Label>
                  <Input value={selected.email || ''} disabled className="border-gray-800" />
                </div>
                <div>
                  <Label>Roles</Label>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    {(["STUDENT", "USER", "STAFF", "ADMIN"] as const).map((role) => (
                      <div key={role} className="flex items-center space-x-2">
                        <Checkbox
                          id={role}
                          checked={selectedRoles.includes(role)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedRoles(prev => [...prev, role]);
                            } else {
                              setSelectedRoles(prev => prev.filter(r => r !== role));
                            }
                          }}
                        />
                        <Label htmlFor={role} className="text-sm font-normal">
                          {role}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-end gap-3">
                  <Button type="button" variant="ghost" onClick={() => {
                    setEditOpen(false);
                    setSelected(null);
                    setSelectedRoles([]);
                  }}>Cancel</Button>
                  <Button type="submit">Save</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function RfidPrompt({ onSubmit }: { onSubmit: (card: string) => void }) {
  const [open, setOpen] = useState(false)
  const [card, setCard] = useState('')
  return (
    <>
      <Button size="sm" variant="secondary" onClick={() => setOpen(true)}>
        <IdCard className="w-4 h-4 mr-2" /> Link RFID
      </Button>
      <AnimatePresence>
        {open && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Register RFID card</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="rfid">Card ID</Label>
                  <Input id="rfid" value={card} onChange={(e) => setCard(e.target.value)} className="border-gray-800 focus:border-gray-400 hover:border-gray-400" />
                </div>
                <div className="flex items-center justify-end gap-3">
                  <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
                  <Button
                    onClick={() => {
                      if (!card.trim()) return toast.error('Enter card id')
                      onSubmit(card.trim())
                      setOpen(false)
                      setCard('')
                    }}
                  >
                    Save
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </>
  )
}

export default UsersManagementPage


