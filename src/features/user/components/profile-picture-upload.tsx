'use client'

import { Camera, Loader2, X } from 'lucide-react'
import { useRef, useState } from 'react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { useMutation } from '@/lib/convex'
import { api } from '@/lib/convex'
import { compressImage, validateImageFile } from '@/lib/image-utils'
import { showErrorToast, showInfoToast } from '@/lib/toast'

interface ProfilePictureUploadProps {
  currentImageUrl?: string
  userInitials: string
  onUploadComplete?: (imageUrl: string) => void
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function ProfilePictureUpload({
  currentImageUrl,
  userInitials,
  onUploadComplete,
  className = "",
}: ProfilePictureUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // @ts-ignore
  const generateUploadUrl = useMutation(api.users.generateUploadUrl)
  const saveProfilePicture = useMutation(api.users.saveProfilePicture)

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

      // Compress the image
      const compressedBlob = await compressImage(file, 250, 0.8)

      // Create preview URL
      const preview = URL.createObjectURL(compressedBlob)
      setPreviewUrl(preview)

      // Get upload URL from Convex
      const uploadUrl = await generateUploadUrl({})

      // Upload the compressed image
      const uploadResponse = await fetch(uploadUrl, {
        method: 'POST',
        headers: { 'Content-Type': compressedBlob.type },
        body: compressedBlob,
      })

      if (!uploadResponse.ok) {
        throw new Error(`Upload failed: ${uploadResponse.statusText}`)
      }

      const { storageId } = await uploadResponse.json()

      // Save the profile picture
      const updatedUser = await saveProfilePicture({ storageId })

      if (updatedUser?.imageUrl) {
        onUploadComplete?.(updatedUser.imageUrl)
        showInfoToast(
          'Profile picture updated!', 
          'Your profile picture has been successfully updated.'
        )
      }

      // Clean up preview URL
      URL.revokeObjectURL(preview)
      setPreviewUrl(null)

    } catch (error) {
      console.error('Upload error:', error)
      showErrorToast(
        'Upload Failed', 
        error instanceof Error ? error.message : 'Failed to upload profile picture. Please try again.'
      )
      
      // Clean up preview URL on error
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
        setPreviewUrl(null)
      }
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

      {/* Clean Avatar Container */}
      <div className="relative group">
        {/* Simple background glow */}
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        <Avatar className="relative w-24 h-24 md:w-28 md:h-28 border-2 border-slate-700/50 hover:border-purple-500/50 transition-all duration-300 shadow-lg">
          <AvatarImage
            src={previewUrl || currentImageUrl}
            alt="Profile picture"
            className="object-cover transition-all duration-300"
          />
          <AvatarFallback className="bg-gradient-to-br from-slate-700 to-slate-800 text-white text-xl md:text-2xl font-semibold">
            {userInitials}
          </AvatarFallback>
        </Avatar>

        {/* Clean hover overlay */}
        <div
          className={`absolute inset-0 bg-black/70 rounded-full transition-all duration-300 flex items-center justify-center cursor-pointer ${
            isUploading
              ? 'opacity-100'
              : 'opacity-0 group-hover:opacity-100'
          }`}
          onClick={!isUploading ? handleUploadClick : undefined}
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-6 w-6 text-white animate-spin" />
              <span className="text-xs text-white/90 font-medium">Uploading...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="p-2 bg-white/10 rounded-full backdrop-blur-sm">
                <Camera className="h-5 w-5 text-white" />
              </div>
              <span className="text-xs text-white/90 font-medium">Update Photo</span>
            </div>
          )}
        </div>


      </div>

      {/* Preview cancel button */}
      {previewUrl && !isUploading && (
        <div className="absolute -top-2 -right-2">
          <Button
            size="sm"
            variant="destructive"
            onClick={handleCancelPreview}
            className="h-6 w-6 p-0 rounded-full bg-red-500 hover:bg-red-600 border-0 shadow-md"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}


    </div>
  )
}
