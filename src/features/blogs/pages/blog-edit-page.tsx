'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { Save, Send, ArrowLeft, Upload, X, Plus, Hash, Edit3, Settings, Clock } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useCallback, useEffect } from 'react'
import { useForm } from 'react-hook-form'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'

import MarkdownEditor from '../components/markdown-editor'
import { useBlog, useUpdateBlog, useDeleteBlog } from '../hooks'
import { simpleBlogSchema, type SimpleBlogFormData } from '../schemas/simple-blog'

interface BlogEditPageProps {
  slug: string
}

export default function BlogEditPage({ slug }: BlogEditPageProps) {
  const router = useRouter()
  const [coverImagePreview, setCoverImagePreview] = useState<string>('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [customTag, setCustomTag] = useState('')
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  const { data: blog, isLoading, error } = useBlog(slug)
  const updateBlogMutation = useUpdateBlog()
  const deleteBlogMutation = useDeleteBlog()

  const form = useForm<SimpleBlogFormData>({
    resolver: zodResolver(simpleBlogSchema),
    defaultValues: {
      title: '',
      subtitle: '',
      content: '',
      excerpt: '',
      metaDescription: '',
      tagNames: [],
    },
    mode: 'onChange'
  })

  // Pre-populate form when blog data is loaded
  useEffect(() => {
    if (blog) {
      form.reset({
        title: blog.title || '',
        subtitle: blog.subtitle || '',
        content: blog.content || '',
        excerpt: blog.excerpt || '',
        metaDescription: blog.metaDescription || '',
        tagNames: blog.tags?.map(tag => tag.name) || [],
      })
      
      setSelectedTags(blog.tags?.map(tag => tag.name).filter((name): name is string => Boolean(name)) || [])
      
      // Set cover image if available
      if (blog.coverImages && blog.coverImages.length > 0 && blog.coverImages[0].imageUrl) {
        setCoverImagePreview(blog.coverImages[0].imageUrl)
      }
    }
  }, [blog, form])

  // Track form changes
  useEffect(() => {
    const subscription = form.watch(() => {
      setHasUnsavedChanges(true)
    })
    return () => subscription.unsubscribe()
  }, [form])

  // Handle cover image upload
  const handleCoverImageChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setCoverImagePreview(reader.result as string)
        setHasUnsavedChanges(true)
      }
      reader.readAsDataURL(file)
    }
  }, [])

  const removeCoverImage = useCallback(() => {
    setCoverImagePreview('')
    setHasUnsavedChanges(true)
  }, [])

  // Handle tag management
  const addTag = useCallback((tagName: string) => {
    if (tagName && !selectedTags.includes(tagName) && selectedTags.length < 10) {
      const newTags = [...selectedTags, tagName]
      setSelectedTags(newTags)
      form.setValue('tagNames', newTags)
      setHasUnsavedChanges(true)
    }
  }, [selectedTags, form])

  const removeTag = useCallback((tagName: string) => {
    const newTags = selectedTags.filter(tag => tag !== tagName)
    setSelectedTags(newTags)
    form.setValue('tagNames', newTags)
    setHasUnsavedChanges(true)
  }, [selectedTags, form])

  const addCustomTag = useCallback(() => {
    if (customTag) {
      addTag(customTag)
      setCustomTag('')
    }
  }, [customTag, addTag])

  // Form submission
  const onSubmit = async (data: SimpleBlogFormData) => {
    try {
      // Convert to the API format
      const blogData = {
        ...data,
        tagNames: selectedTags,
        categoryNames: [],
        allowComments: true,
        allowBookmarks: true,
        allowLikes: true,
        allowShares: true,
        metaKeywords: [],
      }
      
      await updateBlogMutation.mutateAsync({
        slug,
        data: blogData
      })
      
      setHasUnsavedChanges(false)
      router.push(`/blogs/${slug}`)
    } catch (error) {
      console.error('Failed to update blog:', error)
    }
  }

  const saveDraft = async () => {
    const data = form.getValues()
    try {
      const blogData = {
        ...data,
        tagNames: selectedTags,
        categoryNames: [],
        allowComments: true,
        allowBookmarks: true,
        allowLikes: true,
        allowShares: true,
        metaKeywords: [],
      }
      
      await updateBlogMutation.mutateAsync({
        slug,
        data: blogData
      })
      
      setHasUnsavedChanges(false)
    } catch (error) {
      console.error('Failed to save draft:', error)
    }
  }

  const handleDelete = async () => {
    try {
      await deleteBlogMutation.mutateAsync(slug)
      router.push('/blogs/my-blogs')
    } catch (error) {
      console.error('Failed to delete blog:', error)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-gray-400">Loading blog...</p>
        </div>
      </div>
    )
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-white mb-2">
            Blog not found
          </h2>
          <p className="text-gray-400 mb-6">
            The blog you&apos;re looking for doesn&apos;t exist or you don&apos;t have permission to edit it.
          </p>
          <Link href="/blogs/my-blogs">
            <Button className="bg-purple-600 hover:bg-purple-700">
              Back to My Blogs
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/blogs/my-blogs">
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to my blogs
                </Button>
              </Link>
              <Separator orientation="vertical" className="h-6 bg-gray-700" />
              <div>
                <h1 className="text-xl font-semibold text-white">Edit Blog</h1>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Clock className="w-4 h-4" />
                  Last updated: {formatDate(blog.updatedAt)}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="border-red-700 text-red-400 hover:border-red-500 hover:text-red-300"
                  >
                    Delete Blog
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-gray-900 border-gray-700">
                  <DialogHeader>
                    <DialogTitle className="text-white">Delete Blog</DialogTitle>
                    <DialogDescription className="text-gray-400">
                      Are you sure you want to delete &quot;{blog.title}&quot;? This action cannot be undone.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="outline" className="border-gray-700 text-gray-300">
                      Cancel
                    </Button>
                    <Button
                      onClick={handleDelete}
                      className="bg-red-600 hover:bg-red-700"
                      disabled={deleteBlogMutation.isPending}
                    >
                      {deleteBlogMutation.isPending ? 'Deleting...' : 'Delete'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              
              <Button 
                variant="outline" 
                onClick={saveDraft}
                disabled={updateBlogMutation.isPending || !hasUnsavedChanges}
                className="border-gray-700 text-gray-400 hover:border-purple-500 hover:text-purple-400"
              >
                <Save className="w-4 h-4 mr-2" />
                {hasUnsavedChanges ? 'Save Changes' : 'Saved'}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white text-2xl">Edit Your Blog</CardTitle>
                <p className="text-gray-400">
                  Update your blog content and settings.
                  {hasUnsavedChanges && (
                    <span className="text-yellow-400 ml-2">• Unsaved changes</span>
                  )}
                </p>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="details" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-gray-800 border-gray-700">
                    <TabsTrigger 
                      value="details" 
                      className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-gray-400"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Blog Details
                    </TabsTrigger>
                    <TabsTrigger 
                      value="content" 
                      className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-gray-400"
                    >
                      <Edit3 className="w-4 h-4 mr-2" />
                      Content Editor
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="details" className="space-y-6 mt-6">
                    {/* Cover Image Upload */}
                    <div className="space-y-4">
                      <Label className="text-white">Cover Image</Label>
                      <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center">
                        {coverImagePreview ? (
                          <div className="relative">
                            <Image 
                              src={coverImagePreview} 
                              alt="Cover preview" 
                              width={600}
                              height={300}
                              className="max-h-64 mx-auto rounded-lg object-cover"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={removeCoverImage}
                              className="absolute top-2 right-2"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <Upload className="w-12 h-12 text-gray-500 mx-auto" />
                            <div>
                              <Label htmlFor="cover-image" className="cursor-pointer">
                                <span className="text-purple-400 hover:text-purple-300">Click to upload</span>
                                <span className="text-gray-400"> or drag and drop</span>
                              </Label>
                              <p className="text-sm text-gray-500 mt-1">PNG, JPG, GIF up to 10MB</p>
                            </div>
                            <input
                              id="cover-image"
                              type="file"
                              accept="image/*"
                              onChange={handleCoverImageChange}
                              className="hidden"
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Title */}
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Title *</FormLabel>
                          <FormControl>
                            <Input 
                              {...field}
                              placeholder="Enter your blog title..."
                              className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-purple-500 text-lg font-medium"
                            />
                          </FormControl>
                          <FormDescription className="text-gray-400">
                            A compelling title that captures your blog&apos;s essence (max 200 characters)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Subtitle */}
                    <FormField
                      control={form.control}
                      name="subtitle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Subtitle</FormLabel>
                          <FormControl>
                            <Input 
                              {...field}
                              placeholder="Add a subtitle to provide more context..."
                              className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-purple-500"
                            />
                          </FormControl>
                          <FormDescription className="text-gray-400">
                            An optional subtitle to elaborate on your title (max 300 characters)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Excerpt */}
                    <FormField
                      control={form.control}
                      name="excerpt"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Excerpt</FormLabel>
                          <FormControl>
                            <Textarea 
                              {...field}
                              placeholder="Write a brief summary of your blog..."
                              rows={4}
                              className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-purple-500 resize-none"
                            />
                          </FormControl>
                          <FormDescription className="text-gray-400">
                            A brief summary that will appear in blog listings (max 500 characters)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Tags */}
                    <div className="space-y-4">
                      <Label className="text-white">Tags</Label>
                      <div className="space-y-4">
                        <div className="flex gap-2">
                          <Input
                            value={customTag}
                            onChange={(e) => setCustomTag(e.target.value)}
                            placeholder="Add a tag..."
                            className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-purple-500"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault()
                                addCustomTag()
                              }
                            }}
                          />
                          <Button 
                            type="button"
                            onClick={addCustomTag}
                            disabled={!customTag || selectedTags.length >= 10}
                            className="bg-purple-600 hover:bg-purple-700"
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>

                        {selectedTags.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {selectedTags.map((tag) => (
                              <Badge 
                                key={tag}
                                variant="outline" 
                                className="border-purple-500 text-purple-400 bg-purple-500/10"
                              >
                                <Hash className="w-3 h-3 mr-1" />
                                {tag}
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeTag(tag)}
                                  className="h-auto p-0 ml-2 text-purple-400 hover:text-purple-300"
                                >
                                  <X className="w-3 h-3" />
                                </Button>
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-gray-400">
                        Add up to 10 tags to help readers discover your blog
                      </p>
                    </div>

                    {/* SEO Meta Description */}
                    <FormField
                      control={form.control}
                      name="metaDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Meta Description (SEO)</FormLabel>
                          <FormControl>
                            <Textarea 
                              {...field}
                              placeholder="A brief description for search engines..."
                              rows={3}
                              className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-purple-500 resize-none"
                            />
                          </FormControl>
                          <FormDescription className="text-gray-400">
                            A meta description that will appear in search results (max 160 characters)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TabsContent>

                  <TabsContent value="content" className="space-y-6 mt-6">
                    {/* Content */}
                    <FormField
                      control={form.control}
                      name="content"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Blog Content *</FormLabel>
                          <FormControl>
                            <MarkdownEditor
                              value={field.value}
                              onChange={field.onChange}
                              placeholder="Start editing your blog content here..."
                              minHeight={500}
                            />
                          </FormControl>
                          <FormDescription className="text-gray-400">
                            Edit your blog content using Markdown formatting. Use the toolbar for quick formatting or type markdown directly.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex items-center justify-end gap-4">
              <Button
                type="submit"
                disabled={!form.formState.isValid || updateBlogMutation.isPending}
                className="bg-purple-600 hover:bg-purple-700 text-white px-8"
              >
                {updateBlogMutation.isPending ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                    />
                    Updating...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Update Blog
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}
