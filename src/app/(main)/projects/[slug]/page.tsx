import type { Metadata } from 'next'

import { ProjectDetailPageClient } from '@/features/projects/components/projects/project-detail-page-client'
// TODO: Update to use Convex projects API

interface ProjectDetailPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: ProjectDetailPageProps): Promise<Metadata> {
  const { slug } = await params
  const decodedSlug = decodeURIComponent(slug)
  
  // Try to fetch project data for enhanced metadata
  let project
  try {
    project = await projectsApi.getProjectBasic(decodedSlug)
  } catch {
    // If project fetch fails, use default metadata
    return {
      title: `${decodedSlug} | CS Guild Projects`,
      description: 'View project details and apply to join this CS Guild project.',
      keywords: ['project', 'collaboration', 'computer science', 'programming'],
      openGraph: {
        title: `${decodedSlug} | CS Guild Projects`,
        description: 'View project details and apply to join this CS Guild project.',
        type: 'website',
      },
    }
  }

  // Get looking for roles text
  const lookingForRoles = project.roles
    ?.filter(role => role.maxMembers > 0)
    ?.map(role => role.role?.name)
    ?.slice(0, 3)
    ?.join(', ') || 'contributors'

  const description = `${project.title} is looking for ${lookingForRoles}. ${project.description.slice(0, 100)}${project.description.length > 100 ? '...' : ''}`
  
  return {
    title: `${project.title} | CS Guild Projects`,
    description,
    keywords: [
      'project', 
      'collaboration', 
      'computer science', 
      'programming',
      ...(project.tags || []),
      ...(project.roles?.map(role => role.role?.name).filter((name): name is string => Boolean(name)) || [])
    ],
    authors: [{ name: `${project.owner.firstName} ${project.owner.lastName}` }],
    openGraph: {
      title: `${project.title} | CS Guild Projects`,
      description,
      type: 'website',
      siteName: 'CS Guild',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${project.title} | CS Guild Projects`,
      description,
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
