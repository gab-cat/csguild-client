import type { Metadata } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://csguild.tech'

// Base metadata configuration
const BASE_METADATA = {
  metadataBase: new URL(SITE_URL),
  openGraph: {
    type: 'website' as const,
    siteName: 'CS Guild',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image' as const,
    creator: '@csguild',
  },
  robots: {
    index: true,
    follow: true,
  },
}

// Default images for Open Graph and Twitter
const DEFAULT_IMAGES = [
  {
    url: `${SITE_URL}/og-image.png`,
    width: 1200,
    height: 630,
    alt: 'CS Guild',
  },
]

// Default metadata for the root layout
export const DEFAULT_METADATA: Metadata = {
  ...BASE_METADATA,
  title: 'CS Guild | At the intersection of technology and education',
  description: 'CS Guild is a community of Computer Science students who are passionate about building and learning together.',
  keywords: ['CS Guild', 'Computer Science', 'education', 'technology', 'community', 'students', 'learning'],
  openGraph: {
    ...BASE_METADATA.openGraph,
    title: 'CS Guild | At the intersection of technology and education',
    description: 'CS Guild is a community of Computer Science students who are passionate about building and learning together.',
    url: SITE_URL,
    images: DEFAULT_IMAGES,
  },
  twitter: {
    ...BASE_METADATA.twitter,
    title: 'CS Guild | At the intersection of technology and education',
    description: 'CS Guild is a community of Computer Science students who are passionate about building and learning together.',
    images: DEFAULT_IMAGES,
  },
}

// Page-specific metadata
export const FACILITIES_METADATA: Metadata = {
  ...BASE_METADATA,
  title: 'Facilities | CS Guild',
  description: 'Manage and access CS Guild facilities using RFID technology. View real-time facility status and control access to computer labs, study rooms, and other campus resources.',
  keywords: ['facilities', 'RFID', 'access control', 'computer labs', 'study rooms', 'CS Guild'],
  openGraph: {
    ...BASE_METADATA.openGraph,
    title: 'Facilities | CS Guild',
    description: 'Manage and access CS Guild facilities using RFID technology.',
    url: `${SITE_URL}/facilities`,
    images: DEFAULT_IMAGES.map(img => ({
      ...img,
      alt: 'CS Guild Facilities',
    })),
  },
  twitter: {
    ...BASE_METADATA.twitter,
    title: 'Facilities | CS Guild',
    description: 'Manage and access CS Guild facilities using RFID technology.',
    images: DEFAULT_IMAGES,
  },
}

// Helper function to create page metadata
export function createPageMetadata(config: {
  title: string
  description: string
  keywords?: string[]
  path?: string
  images?: Array<{
    url: string
    width: number
    height: number
    alt: string
  }>
}): Metadata {
  const { title, description, keywords = [], path = '', images = DEFAULT_IMAGES } = config
  const fullTitle = `${title} | CS Guild`
  const url = `${SITE_URL}${path}`

  return {
    ...BASE_METADATA,
    title: fullTitle,
    description,
    keywords: [...keywords, 'CS Guild'],
    openGraph: {
      ...BASE_METADATA.openGraph,
      title: fullTitle,
      description,
      url,
      images,
    },
    twitter: {
      ...BASE_METADATA.twitter,
      title: fullTitle,
      description,
      images,
    },
  }
}
