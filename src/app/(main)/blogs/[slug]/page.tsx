import { BlogDetailPage } from "@/features/blogs/pages"


interface BlogPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { slug } = await params
  return <BlogDetailPage slug={slug} />
}
