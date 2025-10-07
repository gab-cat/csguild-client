import Image from 'next/image'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

interface Mentor {
  name: string
  division: string
  teaching: string
  bookingUrl: string
  socialUrl: string
  imageUrl?: string
}


interface MentorListCardProps {
  mentors: Mentor[]
}

export function MentorListCard({ mentors }: MentorListCardProps) {
  return (
    <Card className="bg-gray-900/50 border-gray-800 shadow-lg flex flex-col gap-6 rounded-xl border py-6">
      <CardHeader className="pb-3 px-6">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-white mb-2">Meet Our Mentors</h2>
        <p className="text-center text-gray-300 max-w-2xl mx-auto">Book a session with any of our mentors and connect with them on social media. Click the links below each mentor to get started!</p>
      </CardHeader>
      <CardContent className="px-6 pt-0 pb-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {mentors.map((mentor) => (
            <div
              key={mentor.name}
              className="flex flex-col items-center h-full min-h-[340px] justify-start bg-transparent space-y-3"
            >
              <div className="relative w-32 h-32 rounded-lg overflow-hidden border-4 border-purple-500/30 bg-gray-800 mb-3">
                {/* Increased from 6rem (24) to 8rem (32) for both width and height */}
                <Image
                  src={mentor.imageUrl || '/events-placeholder.png'}
                  alt={mentor.name}
                  fill
                  className="object-cover"
                  sizes="128px"
                  priority
                />
              </div>
              <h3 className="font-semibold text-lg text-white text-center mb-1 leading-tight line-clamp-2">{mentor.name}</h3>
              <div className="text-sm text-purple-300 text-center mb-1">{mentor.division}</div>
              <div className="text-sm text-gray-300 text-center mb-2 italic min-h-[3.5em] leading-snug line-clamp-2">{mentor.teaching}</div>
              <div className="flex flex-col gap-2">
                <Button asChild variant="secondary" className="bg-purple-600 hover:bg-purple-700 text-white shadow-md hover:shadow-lg transition-all duration-300">
                  <Link href={mentor.bookingUrl} target="_blank" rel="noopener noreferrer">
                    Book on Google Calendar
                  </Link>
                </Button>
                <Button asChild variant="outline" className="border-purple-500 text-purple-300 hover:bg-purple-900/20">
                  <Link href={mentor.socialUrl} target="_blank" rel="noopener noreferrer">
                    Social Media
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
