import type { Metadata } from 'next'

import { ProjectDetailPageClient } from '@/features/projects/components/projects/project-detail-page-client'

interface ProjectDetailPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: ProjectDetailPageProps): Promise<Metadata> {
  const { slug } = await params
  
  return {
    title: `${decodeURIComponent(slug)} | CS Guild Projects`,
    description: 'View project details and apply to join this CS Guild project.',
    keywords: ['project', 'collaboration', 'computer science', 'programming'],
    openGraph: {
      title: `${decodeURIComponent(slug)} | CS Guild Projects`,
      description: 'View project details and apply to join this CS Guild project.',
      type: 'website',
    },
  }
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { slug } = await params
  
  return (
    <div className="min-h-screen bg-black flex flex-col">
      <main className="flex-1 pt-20">
        {/* Background Pattern */}
        <div className="fixed inset-0 bg-[linear-gradient(to_right,#8b5cf6_1px,transparent_1px),linear-gradient(to_bottom,#8b5cf6_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-20 pointer-events-none" />
        
        {/* Client Component */}
        <ProjectDetailPageClient slug={decodeURIComponent(slug)} />
      </main>
    </div>
  )
}
