'use client'

import { Plus, BookOpen, Edit } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default function BlogManagementNav() {
  const pathname = usePathname()

  const navItems = [
    {
      href: '/blogs/my-blogs',
      label: 'My Blogs',
      icon: BookOpen,
      description: 'Manage your blog posts',
      isActive: pathname === '/blogs/my-blogs'
    },
    {
      href: '/blogs/create',
      label: 'Create Blog',
      icon: Plus,
      description: 'Write a new blog post',
      isActive: pathname === '/blogs/create'
    }
  ]

  return (
    <Card className="bg-gray-900/50 border-gray-800">
      <CardContent className="p-6">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <Edit className="w-5 h-5" />
          Blog Management
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant={item.isActive ? "default" : "outline"}
                className={`w-full h-auto p-4 flex flex-col items-start gap-2 ${
                  item.isActive 
                    ? 'bg-purple-600 hover:bg-purple-700 text-white border-purple-600' 
                    : 'border-gray-700 text-gray-300 hover:border-purple-500 hover:text-purple-400'
                }`}
              >
                <div className="flex items-center gap-2 w-full">
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </div>
                <span className="text-sm opacity-80 text-left">
                  {item.description}
                </span>
              </Button>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
