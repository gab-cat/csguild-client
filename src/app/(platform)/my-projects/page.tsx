import { Metadata } from 'next'

import { MyProjectsPageClient } from '@/features/projects'

export const metadata: Metadata = {
  title: 'My Projects | CS Guild',
  description: 'Manage your posted projects and review applications from other members.',
}

export default function MyProjectsPage() {
  return <MyProjectsPageClient />
}
