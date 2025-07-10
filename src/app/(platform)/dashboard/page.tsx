import { 
  Calendar, 
  BookOpen, 
  Users, 
  Code2, 
  TrendingUp,
  Clock,
  Trophy,
  MessageSquare,
  Bell
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-violet-400 bg-clip-text text-transparent mb-2">
              Welcome to Your Dashboard
          </h1>
          <p className="text-gray-300 font-jetbrains">
            {"// Your CS Guild command center"}
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-pink-500/10 to-pink-600/10 border-pink-500/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-pink-300 text-sm font-medium">Total Events</p>
                <p className="text-2xl font-bold text-white">24</p>
              </div>
              <div className="w-12 h-12 bg-pink-500/20 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-pink-400" />
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-violet-500/10 to-violet-600/10 border-violet-500/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-violet-300 text-sm font-medium">Courses</p>
                <p className="text-2xl font-bold text-white">8</p>
              </div>
              <div className="w-12 h-12 bg-violet-500/20 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-violet-400" />
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-blue-500/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-300 text-sm font-medium">Guild Members</p>
                <p className="text-2xl font-bold text-white">156</p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/10 to-green-600/10 border-green-500/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-300 text-sm font-medium">Projects</p>
                <p className="text-2xl font-bold text-white">12</p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <Code2 className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <Card className="bg-gray-900/50 border-gray-500/20 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-pink-400" />
                    Recent Activity
                </h2>
                <Button variant="ghost" size="sm" className="text-pink-400 hover:text-pink-300">
                    View All
                </Button>
              </div>

              <div className="space-y-4">
                {[
                  {
                    title: 'Joined &quot;React Workshop&quot; event',
                    time: '2 hours ago',
                    type: 'event',
                    icon: Calendar
                  },
                  {
                    title: 'Completed &quot;JavaScript Fundamentals&quot; course',
                    time: '1 day ago',
                    type: 'course',
                    icon: BookOpen
                  },
                  {
                    title: 'Posted in &quot;Web Development&quot; discussion',
                    time: '2 days ago',
                    type: 'discussion',
                    icon: MessageSquare
                  },
                  {
                    title: 'Earned &quot;Code Contributor&quot; badge',
                    time: '3 days ago',
                    type: 'achievement',
                    icon: Trophy
                  }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 rounded-lg bg-gray-800/50 border border-gray-700/50">
                    <div className="w-10 h-10 bg-gradient-to-br from-pink-500/20 to-violet-500/20 rounded-lg flex items-center justify-center">
                      <activity.icon className="w-5 h-5 text-pink-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium">{activity.title}</p>
                      <p className="text-gray-400 text-sm flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {activity.time}
                      </p>
                    </div>
                    <Badge 
                      variant="outline" 
                      className="border-pink-500/30 text-pink-400"
                    >
                      {activity.type}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="bg-gray-900/50 border-gray-500/20 p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Code2 className="w-5 h-5 text-violet-400" />
                  Quick Actions
              </h3>
              <div className="space-y-3">
                <Button className="w-full justify-start bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600">
                  <Users className="w-4 h-4 mr-2" />
                    Browse Events
                </Button>
                <Button variant="outline" className="w-full justify-start border-gray-500/50 text-gray-300 hover:bg-gray-500/10">
                  <BookOpen className="w-4 h-4 mr-2" />
                    View Courses
                </Button>
                <Button variant="outline" className="w-full justify-start border-gray-500/50 text-gray-300 hover:bg-gray-500/10">
                  <MessageSquare className="w-4 h-4 mr-2" />
                    Join Discussions
                </Button>
              </div>
            </Card>

            {/* Notifications */}
            <Card className="bg-gray-900/50 border-gray-500/20 p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Bell className="w-5 h-5 text-blue-400" />
                  Notifications
                <Badge className="bg-pink-500 text-white">3</Badge>
              </h3>
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <p className="text-blue-300 text-sm font-medium">Event Reminder</p>
                  <p className="text-gray-300 text-xs">React Workshop starts in 2 hours</p>
                </div>
                <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                  <p className="text-green-300 text-sm font-medium">New Achievement</p>
                  <p className="text-gray-300 text-xs">You&apos;ve unlocked &quot;Early Bird&quot; badge</p>
                </div>
                <div className="p-3 rounded-lg bg-violet-500/10 border border-violet-500/20">
                  <p className="text-violet-300 text-sm font-medium">Course Update</p>
                  <p className="text-gray-300 text-xs">New module added to Python course</p>
                </div>
              </div>
            </Card>

            {/* Progress */}
            <Card className="bg-gray-900/50 border-gray-500/20 p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-400" />
                  Your Progress
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-300">Profile Completion</span>
                    <span className="text-pink-400">85%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-gradient-to-r from-pink-500 to-violet-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-300">Current Course</span>
                    <span className="text-blue-400">60%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 