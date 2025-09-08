import { BlogEditPage } from '@/features/blogs'

interface PageProps {
  params: {
    slug: string
  }
}

export default function Page({ params }: PageProps) {
  return <BlogEditPage slug={params.slug} />
}

export const metadata = {
  title: 'Edit Blog | CS Guild',
  description: 'Edit your blog post',
}
