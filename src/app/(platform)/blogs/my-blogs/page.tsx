import { Suspense } from 'react'

import { MyBlogsPage } from '@/features/blogs'

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center"><div className="text-white">Loading...</div></div>}>
      <MyBlogsPage />
    </Suspense>
  )
}

export const metadata = {
  title: 'My Blogs | CS Guild',
  description: 'Manage and track your blog posts',
}
