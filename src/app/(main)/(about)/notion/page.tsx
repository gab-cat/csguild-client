import { Metadata } from 'next'

import { AboutNotionPage } from '@/components/about'

export const metadata: Metadata = {
  title: 'About Notion | Our Digital Workspace',
  description: 'Discover how we use Notion as our central digital workspace for collaboration, project management, and knowledge sharing across all our organizations.',
  keywords: ['Notion', 'Digital Workspace', 'Collaboration', 'Project Management', 'Knowledge Base', 'Productivity'],
}

export default function AboutNotion() {
  return <AboutNotionPage />
}
