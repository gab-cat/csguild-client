'use client'

import { Users, UserMinus, UserPlus, Info } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

/**
 * Demo component showing removed member functionality
 * This component demonstrates the key features implemented for handling removed project members
 */
export function RemovedMemberDemo() {
  const [memberStatus, setMemberStatus] = useState<'ACTIVE' | 'INACTIVE'>('ACTIVE')
  const [isReactivating, setIsReactivating] = useState(false)

  const handleRemove = () => {
    setMemberStatus('INACTIVE')
    toast.success('Member has been removed from the project')
  }

  const handleReactivate = async () => {
    setIsReactivating(true)
    // Simulate API call
    setTimeout(() => {
      setMemberStatus('ACTIVE')
      setIsReactivating(false)
      toast.success('Member has been reactivated!')
    }, 1500)
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Info className="w-5 h-5 text-blue-400" />
            Removed Member Functionality Demo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Feature Overview */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-3">Key Features Implemented:</h3>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-center gap-2">
                <UserMinus className="w-4 h-4 text-red-400" />
                <span>Visual indicators for removed members</span>
              </li>
              <li className="flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-green-400" />
                <span>Reactivation functionality for project owners</span>
              </li>
              <li className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-400" />
                <span>Enhanced member status display in project details</span>
              </li>
              <li className="flex items-center gap-2">
                <Info className="w-4 h-4 text-purple-400" />
                <span>Application status indicators showing membership changes</span>
              </li>
            </ul>
          </div>

          {/* Demo Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Member Status Demo */}
            <Card className="bg-gray-800 border-gray-600">
              <CardHeader>
                <CardTitle className="text-white text-sm">Member Status Demo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                      memberStatus === 'ACTIVE' 
                        ? 'bg-gradient-to-br from-green-500 to-emerald-500' 
                        : 'bg-gradient-to-br from-gray-500 to-gray-600 grayscale'
                    }`}>
                      JD
                    </div>
                    <div>
                      <p className={`font-medium ${memberStatus === 'ACTIVE' ? 'text-white' : 'text-gray-300'}`}>
                        John Doe
                      </p>
                      <p className={`text-sm ${memberStatus === 'ACTIVE' ? 'text-green-400' : 'text-gray-400'}`}>
                        Frontend Developer
                      </p>
                    </div>
                  </div>
                  
                  <Badge 
                    variant="outline" 
                    className={memberStatus === 'ACTIVE' 
                      ? 'bg-green-500/10 text-green-400 border-green-500/30'
                      : 'bg-red-500/10 text-red-400 border-red-500/30'
                    }
                  >
                    {memberStatus === 'ACTIVE' ? (
                      <>
                        <UserPlus className="w-3 h-3 mr-1" />
                        Active
                      </>
                    ) : (
                      <>
                        <UserMinus className="w-3 h-3 mr-1" />
                        Removed
                      </>
                    )}
                  </Badge>
                </div>

                <div className="flex gap-2">
                  {memberStatus === 'ACTIVE' ? (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={handleRemove}
                      className="bg-red-600/20 hover:bg-red-600/30 text-red-400 border-red-600/50"
                    >
                      <UserMinus className="w-3 h-3 mr-1" />
                      Remove Member
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      onClick={handleReactivate}
                      disabled={isReactivating}
                      className="bg-green-600/20 hover:bg-green-600/30 text-green-400 border-green-600/50"
                    >
                      {isReactivating ? (
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 border-2 border-green-400 border-t-transparent rounded-full animate-spin" />
                          Reactivating...
                        </div>
                      ) : (
                        <>
                          <UserPlus className="w-3 h-3 mr-1" />
                          Reactivate Member
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Application Status Demo */}
            <Card className="bg-gray-800 border-gray-600">
              <CardHeader>
                <CardTitle className="text-white text-sm">Application Status Demo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="bg-gray-700/50 border border-gray-600 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-medium">My Cool Project</span>
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                        Approved
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant="outline" 
                        className={memberStatus === 'ACTIVE' 
                          ? 'text-xs bg-green-500/10 text-green-400 border-green-500/30'
                          : 'text-xs bg-red-500/10 text-red-400 border-red-500/30'
                        }
                      >
                        {memberStatus === 'ACTIVE' ? (
                          <>
                            <UserPlus className="w-3 h-3 mr-1" />
                            Active Member
                          </>
                        ) : (
                          <>
                            <UserMinus className="w-3 h-3 mr-1" />
                            Removed
                          </>
                        )}
                      </Badge>
                    </div>
                    
                    {memberStatus === 'INACTIVE' && (
                      <div className="mt-2 p-2 bg-yellow-500/10 border border-yellow-500/20 rounded text-xs text-yellow-400">
                        ⚠️ You were removed from this project after being approved
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Implementation Notes */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <h4 className="font-semibold text-blue-400 mb-2 flex items-center gap-2">
              <Info className="w-4 h-4" />
              Implementation Notes
            </h4>
            <div className="text-blue-300 text-sm space-y-1">
              <p>• The reactivate API endpoint is now available and integrated</p>
              <p>• Project owners can view and manage both active and inactive members</p>
              <p>• Member status is tracked and displayed throughout the application</p>
              <p>• Applications show enhanced status for approved members</p>
              <p>• Visual feedback provides clear indication of member status changes</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
