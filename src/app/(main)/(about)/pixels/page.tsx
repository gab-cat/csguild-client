import { Metadata } from 'next'

import { AboutPixelsPage } from '@/components/about'

export const metadata: Metadata = {
  title: 'About PIXELS | Pioneers of Ignatian Expressive Electronic Arts and Learning Society',
  description: 'Learn about PIXELS - where creativity meets technology through photography, digital arts, and multimedia expression rooted in Ignatian values.',
  keywords: ['PIXELS', 'Photography', 'Digital Arts', 'Visual Arts', 'Ignatian', 'Creative Expression', 'Multimedia'],
}

export default function AboutPixels() {
  return <AboutPixelsPage />
}
