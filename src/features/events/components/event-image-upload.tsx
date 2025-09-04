'use client'

import { Camera, Loader2, X, ImageIcon, Upload } from 'lucide-react'
import Image from 'next/image'
import { useRef, useState } from 'react'

import { Button } from '@/components/ui/button'
import { compressImageForEvent, validateImageFile } from '@/lib/image-utils'
import { showErrorToast } from '@/lib/toast'

interface EventImageUploadProps {
  currentImageUrl?: string
  onImagePrepared?: (blob: Blob) => void
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function EventImageUpload({
  currentImageUrl,
  onImagePrepared,
  className = "",
  size = 'lg',
}: EventImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Reset file input
    event.target.value = ''

    // Validate file
    const validation = validateImageFile(file)
    if (!validation.valid) {
      showErrorToast('Invalid File', validation.error || 'Please select a valid image file.')
      return
    }

    try {
      setIsUploading(true)

      // Compress the image for event (crops to 1200x630px and converts to WebP when possible)
      const compressedBlob = await compressImageForEvent(file, 1)

      // Create preview URL
      const preview = URL.createObjectURL(compressedBlob)
      setPreviewUrl(preview)

      // Hand off the prepared blob to parent (actual upload happens on Save)
      onImagePrepared?.(compressedBlob)

    } catch (error) {
      console.error('Image processing error:', error)
      showErrorToast(
        'Processing Failed',
        error instanceof Error ? error.message : 'Failed to process image. Please try again.'
      )
    } finally {
      setIsUploading(false)
    }
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleCancelPreview = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
      setPreviewUrl(null)
    }
  }

  const getSizeClasses = () => {
    switch (size) {
    case 'sm':
      return 'w-32 h-32'
    case 'md':
      return 'w-48 h-48'
    case 'lg':
    default:
      return 'w-64 h-36' // 1200x630 aspect ratio scaled down
    }
  }

  const sizeClasses = getSizeClasses()

  return (
    <div className={`relative ${className}`}>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={isUploading}
      />

      {/* Image Container */}
      <div className="relative group">
        <div className={`${sizeClasses} relative border-2 border-dashed border-gray-600 rounded-lg overflow-hidden transition-all duration-300 ${
          isUploading
            ? 'opacity-50'
            : 'hover:border-purple-500/50 group-hover:shadow-lg'
        }`}>

          {/* Current or Preview Image */}
          {(previewUrl || currentImageUrl) ? (
            <Image
              src={previewUrl || currentImageUrl || ''}
              alt="Event image"
              className="w-full h-full object-cover transition-all duration-300"
              fill
              priority
            />
          ) : (
            /* Placeholder */
            <div className="w-full h-full bg-gray-800/50 flex items-center justify-center">
              <div className="text-center text-gray-400">
                <ImageIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No image selected</p>
                <p className="text-xs opacity-75">1200×630px recommended</p>
              </div>
            </div>
          )}

          {/* Hover overlay */}
          <div
            className={`absolute inset-0 bg-black/70 transition-all duration-300 flex items-center justify-center cursor-pointer ${
              isUploading
                ? 'opacity-100'
                : 'opacity-0 group-hover:opacity-100'
            }`}
            onClick={!isUploading ? handleUploadClick : undefined}
          >
            {isUploading ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-6 w-6 text-white animate-spin" />
                <span className="text-xs text-white/90 font-medium">Processing...</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <div className="p-2 bg-white/10 rounded-full backdrop-blur-sm">
                  <Camera className="h-5 w-5 text-white" />
                </div>
                <span className="text-xs text-white/90 font-medium">
                  {currentImageUrl ? 'Change Image' : 'Upload Image'}
                </span>
                <span className="text-xs text-white/70">
                  Auto-crops to 1200×630px
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleUploadClick}
            disabled={isUploading}
            className="h-8 px-3 bg-gray-800/50 border-gray-700/50 text-gray-300 hover:bg-gray-700 hover:text-white transition-all duration-200"
          >
            <Upload className="h-3 w-3 mr-1" />
            {isUploading ? 'Processing...' : 'Choose File'}
          </Button>

          <div className="text-xs text-gray-500">
            Recommended: 1200×630px • Max: 5MB
          </div>
        </div>

        {/* Preview cancel button */}
        {previewUrl && !isUploading && (
          <Button
            size="sm"
            variant="destructive"
            onClick={handleCancelPreview}
            className="h-8 w-8 p-0 rounded-full bg-red-500 hover:bg-red-600 border-0"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>
    </div>
  )
}
