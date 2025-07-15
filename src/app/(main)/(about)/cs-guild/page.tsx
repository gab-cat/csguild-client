import { Metadata } from 'next'

import { AboutCSGuildPage } from '@/components/about'

export const metadata: Metadata = {
  title: 'About CS Guild | Computer Science Guild',
  description: 'Learn about the Computer Science Guild - a community of passionate developers, innovators, and tech enthusiasts building the future together.',
  keywords: ['CS Guild', 'Computer Science', 'Programming', 'Technology', 'Community', 'Students'],
}

export default function AboutCSGuild() {
  return <AboutCSGuildPage />
}
