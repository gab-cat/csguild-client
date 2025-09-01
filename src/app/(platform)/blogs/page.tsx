import { Metadata } from 'next'

import BlogsListingPageRefactored from '@/features/blogs/pages/blogs-listing-page'


export const metadata: Metadata = {
  title: 'Blogs | CS Guild',
  description: 'Discover the latest blogs, tutorials, and insights from the CS Guild community.',
  keywords: ['blogs', 'programming', 'computer science', 'tutorials', 'tech articles'],
}

export default function BlogsPage() {
  return <BlogsListingPageRefactored />
}
