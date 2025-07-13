import type { Metadata } from 'next'

import { ProjectsClient } from '@/features/projects/components/projects/projects-client'
import { ProjectsHeader } from '@/features/projects/components/projects/projects-header'


export const metadata: Metadata = {
  title: 'Projects | CS Guild',
  description: 'Browse and join exciting projects from the CS Guild community. Collaborate, learn, and build amazing things together.',
  keywords: ['projects', 'collaboration', 'computer science', 'programming', 'development'],
  openGraph: {
    title: 'Projects | CS Guild',
    description: 'Browse and join exciting projects from the CS Guild community.',
    type: 'website',
  },
}

export default function ProjectsPage() {
  return (
    <div className="min-h-screen bg-black flex flex-col">
      <main className="flex-1 pt-20">
        {/* Background Pattern */}
        <div className="fixed inset-0 bg-[linear-gradient(to_right,#8b5cf6_1px,transparent_1px),linear-gradient(to_bottom,#8b5cf6_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-20 pointer-events-none" />
        
        {/* Header Section */}
        <ProjectsHeader />
        
        {/* Client Component */}
        <ProjectsClient />
      </main>
    </div>
  )
}
