'use client'

import Image from 'next/image'

interface BlogCoverImageProps {
  coverImages?: Array<{
    id?: string
    imageUrl?: string | null
    altText?: string | null
  }> | null
  title: string
}

export function BlogCoverImage({ coverImages, title }: BlogCoverImageProps) {
  // Check if cover images exist and have at least one image with a valid URL
  const firstImage = coverImages?.[0]
  const hasValidImage = firstImage?.imageUrl

  if (!hasValidImage) {
    return null
  }

  return (
    <div className="relative aspect-video overflow-hidden rounded-lg">
      <Image
        src={firstImage.imageUrl!}
        alt={firstImage.altText || title}
        fill
        className="object-cover"
        priority
      />
    </div>
  )
}
