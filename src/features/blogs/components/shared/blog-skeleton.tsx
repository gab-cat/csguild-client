import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

interface BlogSkeletonProps {
  variant?: 'default' | 'compact' | 'featured'
  showActions?: boolean
}

export function BlogSkeleton({ variant = 'default', showActions = true }: BlogSkeletonProps) {
  if (variant === 'compact') {
    return (
      <Card className="bg-gray-900/50 border-gray-800">
        <CardContent className="p-4">
          <div className="flex gap-4">
            <Skeleton className="w-[120px] h-[80px] rounded-md flex-shrink-0 bg-gray-800" />
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <Skeleton className="w-6 h-6 rounded-full bg-gray-800" />
                <Skeleton className="w-24 h-4 bg-gray-800" />
                <Skeleton className="w-16 h-4 bg-gray-800" />
              </div>
              <Skeleton className="w-full h-5 bg-gray-800" />
              <Skeleton className="w-4/5 h-5 bg-gray-800" />
              <Skeleton className="w-3/5 h-4 bg-gray-800" />
              <div className="flex gap-4 mt-3">
                <Skeleton className="w-12 h-4 bg-gray-800" />
                <Skeleton className="w-12 h-4 bg-gray-800" />
                <Skeleton className="w-12 h-4 bg-gray-800" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (variant === 'featured') {
    return (
      <Card className="bg-gray-900/50 border-gray-800">
        <Skeleton className="w-full aspect-video rounded-t-lg bg-gray-800" />
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Skeleton className="w-8 h-8 rounded-full bg-gray-800" />
            <div className="space-y-1">
              <Skeleton className="w-24 h-4 bg-gray-800" />
              <Skeleton className="w-16 h-3 bg-gray-800" />
            </div>
          </div>
          
          <Skeleton className="w-full h-8 bg-gray-800" />
          <Skeleton className="w-4/5 h-6 bg-gray-800" />
          <div className="space-y-2">
            <Skeleton className="w-full h-4 bg-gray-800" />
            <Skeleton className="w-full h-4 bg-gray-800" />
            <Skeleton className="w-3/4 h-4 bg-gray-800" />
          </div>
          
          <div className="flex gap-2">
            <Skeleton className="w-16 h-6 bg-gray-800" />
            <Skeleton className="w-20 h-6 bg-gray-800" />
            <Skeleton className="w-12 h-6 bg-gray-800" />
          </div>
          
          <div className="flex gap-6">
            <Skeleton className="w-12 h-4 bg-gray-800" />
            <Skeleton className="w-12 h-4 bg-gray-800" />
            <Skeleton className="w-12 h-4 bg-gray-800" />
            <Skeleton className="w-16 h-4 bg-gray-800" />
          </div>
        </CardContent>
        {showActions && (
          <CardFooter className="border-t border-gray-800 bg-gray-900/30 p-6">
            <div className="flex justify-between w-full">
              <div className="flex gap-2">
                <Skeleton className="w-12 h-8 bg-gray-800" />
                <Skeleton className="w-12 h-8 bg-gray-800" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="w-8 h-8 bg-gray-800" />
                <Skeleton className="w-8 h-8 bg-gray-800" />
              </div>
            </div>
          </CardFooter>
        )}
      </Card>
    )
  }

  // Default variant
  return (
    <Card className="bg-gray-900/50 border-gray-800">
      <Skeleton className="w-full aspect-video rounded-t-lg bg-gray-800" />
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Skeleton className="w-6 h-6 rounded-full bg-gray-800" />
          <Skeleton className="w-20 h-4 bg-gray-800" />
          <Skeleton className="w-16 h-4 bg-gray-800" />
        </div>
        
        <div className="space-y-2">
          <Skeleton className="w-full h-5 bg-gray-800" />
          <Skeleton className="w-4/5 h-5 bg-gray-800" />
        </div>
        
        <div className="space-y-2">
          <Skeleton className="w-full h-4 bg-gray-800" />
          <Skeleton className="w-full h-4 bg-gray-800" />
          <Skeleton className="w-3/4 h-4 bg-gray-800" />
        </div>
        
        <div className="flex gap-2">
          <Skeleton className="w-16 h-5 bg-gray-800" />
          <Skeleton className="w-12 h-5 bg-gray-800" />
        </div>
        
        <div className="flex gap-4">
          <Skeleton className="w-10 h-3 bg-gray-800" />
          <Skeleton className="w-10 h-3 bg-gray-800" />
          <Skeleton className="w-10 h-3 bg-gray-800" />
          <Skeleton className="w-16 h-3 bg-gray-800" />
        </div>
      </CardContent>
      {showActions && (
        <CardFooter className="border-t border-gray-800 bg-gray-900/30 p-4">
          <div className="flex justify-between w-full">
            <div className="flex gap-1">
              <Skeleton className="w-12 h-8 bg-gray-800" />
              <Skeleton className="w-12 h-8 bg-gray-800" />
            </div>
            <div className="flex gap-1">
              <Skeleton className="w-8 h-8 bg-gray-800" />
              <Skeleton className="w-8 h-8 bg-gray-800" />
            </div>
          </div>
        </CardFooter>
      )}
    </Card>
  )
}
