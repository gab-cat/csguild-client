import Image from 'next/image'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'

interface MentorCardProps {
  name: string
  imageUrl?: string
  bookingUrl: string
  socialUrl: string
}

export function MentorCard({ name, imageUrl, bookingUrl, socialUrl }: MentorCardProps) {
  return (
    <Card className="flex flex-col items-center bg-gray-900/50 border-gray-800 shadow-lg hover:shadow-purple-500/10 hover:border-purple-500/50 transition-all duration-300 overflow-hidden">
      <CardHeader className="flex flex-col items-center pt-6 pb-2">
        <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-purple-500/30 bg-gray-800">
          <Image
            src={imageUrl || '/events-placeholder.png'}
            alt={name}
            fill
            className="object-cover"
            sizes="128px"
            priority
          />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-white text-center">{name}</h3>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-2 pb-2">
        <Button asChild variant="secondary" className="w-40 bg-purple-600 hover:bg-purple-700 text-white">
          <Link href={bookingUrl} target="_blank" rel="noopener noreferrer">
            Book on Google Calendar
          </Link>
        </Button>
        <Button asChild variant="outline" className="w-40 border-purple-500 text-purple-300 hover:bg-purple-900/20">
          <Link href={socialUrl} target="_blank" rel="noopener noreferrer">
            Social Media
          </Link>
        </Button>
      </CardContent>
      <CardFooter />
    </Card>
  )
}
