/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { showSuccessToast, showErrorToast } from '@/lib/toast'

import type {
  CreateBlogDto,
  UpdateBlogDto,
  FlagBlogDto,
  ShareBlogDto,
  ModerateBlogDto,
  CreateCommentDto,
  UpdateCommentDto
} from '../types'
import {
  blogsActionsApiUtils,
  blogModerationApiUtils,
  commentsApiUtils,
  blogManagementApiUtils
} from '../utils'

import { blogQueryKeys, commentQueryKeys, managementQueryKeys } from './blogs-query-hooks'

// Blog Creation & Management Mutations

export function useCreateBlog() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateBlogDto) => blogsActionsApiUtils.createBlog(data),
    onSuccess: () => {
      // Invalidate blogs list to refetch
      queryClient.invalidateQueries({ queryKey: blogQueryKeys.lists() })
      queryClient.invalidateQueries({ queryKey: blogQueryKeys.myBlogs() })
      
      showSuccessToast('Blog created successfully!')
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to create blog'
      showErrorToast(message)
    },
  })
}

export function useUpdateBlog() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ slug, data }: { slug: string; data: UpdateBlogDto }) => 
      blogsActionsApiUtils.updateBlog(slug, data),
    onSuccess: (response, variables) => {
      // Invalidate specific blog detail
      queryClient.invalidateQueries({ queryKey: blogQueryKeys.detail(variables.slug) })
      queryClient.invalidateQueries({ queryKey: blogQueryKeys.lists() })
      queryClient.invalidateQueries({ queryKey: blogQueryKeys.myBlogs() })
      
      showSuccessToast('Blog updated successfully!')
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to update blog'
      showErrorToast(message)
    },
  })
}

export function useDeleteBlog() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (slug: string) => blogsActionsApiUtils.deleteBlog(slug),
    onSuccess: (response, slug) => {
      // Remove from cache and invalidate lists
      queryClient.removeQueries({ queryKey: blogQueryKeys.detail(slug) })
      queryClient.invalidateQueries({ queryKey: blogQueryKeys.lists() })
      queryClient.invalidateQueries({ queryKey: blogQueryKeys.myBlogs() })
      
      showSuccessToast('Blog deleted successfully!')
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to delete blog'
      showErrorToast(message)
    },
  })
}

export function usePublishBlog() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (slug: string) => blogsActionsApiUtils.publishBlog(slug),
    onSuccess: (response, slug) => {
      queryClient.invalidateQueries({ queryKey: blogQueryKeys.detail(slug) })
      queryClient.invalidateQueries({ queryKey: blogQueryKeys.lists() })
      queryClient.invalidateQueries({ queryKey: blogQueryKeys.myBlogs() })
      
      showSuccessToast('Blog published successfully!')
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to publish blog'
      showErrorToast(message)
    },
  })
}

export function useUnpublishBlog() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (slug: string) => blogsActionsApiUtils.unpublishBlog(slug),
    onSuccess: (response, slug) => {
      queryClient.invalidateQueries({ queryKey: blogQueryKeys.detail(slug) })
      queryClient.invalidateQueries({ queryKey: blogQueryKeys.lists() })
      queryClient.invalidateQueries({ queryKey: blogQueryKeys.myBlogs() })
      
      showSuccessToast('Blog unpublished successfully!')
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to unpublish blog'
      showErrorToast(message)
    },
  })
}

export function useScheduleBlog() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (slug: string) => blogsActionsApiUtils.scheduleBlog(slug),
    onSuccess: (response, slug) => {
      queryClient.invalidateQueries({ queryKey: blogQueryKeys.detail(slug) })
      queryClient.invalidateQueries({ queryKey: blogQueryKeys.lists() })
      queryClient.invalidateQueries({ queryKey: blogQueryKeys.myBlogs() })
      
      showSuccessToast('Blog scheduled successfully!')
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to schedule blog'
      showErrorToast(message)
    },
  })
}

// Blog Interaction Mutations

export function useLikeBlog() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (slug: string) => blogsActionsApiUtils.likeBlog(slug),
    onSuccess: (response, slug) => {
      // Optimistically update the blog detail
      queryClient.invalidateQueries({ queryKey: blogQueryKeys.detail(slug) })
      
      showSuccessToast('Blog liked!')
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to like blog'
      showErrorToast(message)
    },
  })
}

export function useUnlikeBlog() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (slug: string) => blogsActionsApiUtils.unlikeBlog(slug),
    onSuccess: (response, slug) => {
      queryClient.invalidateQueries({ queryKey: blogQueryKeys.detail(slug) })
      
      showSuccessToast('Blog unliked!')
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to unlike blog'
      showErrorToast(message)
    },
  })
}

export function useBookmarkBlog() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (slug: string) => blogsActionsApiUtils.bookmarkBlog(slug),
    onSuccess: (response, slug) => {
      queryClient.invalidateQueries({ queryKey: blogQueryKeys.detail(slug) })
      queryClient.invalidateQueries({ queryKey: blogQueryKeys.bookmarked() })
      
      showSuccessToast('Blog bookmarked!')
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to bookmark blog'
      showErrorToast(message)
    },
  })
}

export function useUnbookmarkBlog() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (slug: string) => blogsActionsApiUtils.unbookmarkBlog(slug),
    onSuccess: (response, slug) => {
      queryClient.invalidateQueries({ queryKey: blogQueryKeys.detail(slug) })
      queryClient.invalidateQueries({ queryKey: blogQueryKeys.bookmarked() })
      
      showSuccessToast('Bookmark removed!')
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to remove bookmark'
      showErrorToast(message)
    },
  })
}

export function useShareBlog() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ slug, data }: { slug: string; data: ShareBlogDto }) => 
      blogsActionsApiUtils.shareBlog(slug, data),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: blogQueryKeys.detail(variables.slug) })
      
      showSuccessToast('Blog shared!')
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to share blog'
      showErrorToast(message)
    },
  })
}

export function useFlagBlog() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ slug, data }: { slug: string; data: FlagBlogDto }) => 
      blogsActionsApiUtils.flagBlog(slug, data),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: blogQueryKeys.detail(variables.slug) })
      
      showSuccessToast('Blog flagged for review')
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to flag blog'
      showErrorToast(message)
    },
  })
}

// Admin Blog Management Mutations - Remove these functions as they don't exist in the API

export function usePinBlog() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (slug: string) => blogsActionsApiUtils.pinBlog(slug),
    onSuccess: (response, slug) => {
      queryClient.invalidateQueries({ queryKey: blogQueryKeys.detail(slug) })
      queryClient.invalidateQueries({ queryKey: blogQueryKeys.lists() })
      queryClient.invalidateQueries({ queryKey: blogQueryKeys.pinned() })
      
      showSuccessToast('Blog pinned successfully!')
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to pin blog'
      showErrorToast(message)
    },
  })
}

export function useUnpinBlog() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (slug: string) => blogsActionsApiUtils.unpinBlog(slug),
    onSuccess: (response, slug) => {
      queryClient.invalidateQueries({ queryKey: blogQueryKeys.detail(slug) })
      queryClient.invalidateQueries({ queryKey: blogQueryKeys.lists() })
      queryClient.invalidateQueries({ queryKey: blogQueryKeys.pinned() })
      
      showSuccessToast('Blog unpinned successfully!')
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to unpin blog'
      showErrorToast(message)
    },
  })
}

export function useFeatureBlog() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (slug: string) => blogsActionsApiUtils.featureBlog(slug),
    onSuccess: (_, slug) => {
      queryClient.invalidateQueries({ queryKey: blogQueryKeys.detail(slug) })
      queryClient.invalidateQueries({ queryKey: blogQueryKeys.lists() })
      queryClient.invalidateQueries({ queryKey: blogQueryKeys.featured() })
      
      showSuccessToast('Blog featured successfully!')
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to feature blog'
      showErrorToast(message)
    },
  })
}

export function useUnfeatureBlog() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (slug: string) => blogsActionsApiUtils.unfeatureBlog(slug),
    onSuccess: (_, slug) => {
      queryClient.invalidateQueries({ queryKey: blogQueryKeys.detail(slug) })
      queryClient.invalidateQueries({ queryKey: blogQueryKeys.lists() })
      queryClient.invalidateQueries({ queryKey: blogQueryKeys.featured() })
      
      showSuccessToast('Blog unfeatured successfully!')
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to unfeature blog'
      showErrorToast(message)
    },
  })
}

// Blog Moderation Mutations

export function useModerateBlog() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ blogId, data }: { blogId: string; data: ModerateBlogDto }) => 
      blogModerationApiUtils.moderateBlog(blogId, data),
    onSuccess: () => {
      // Invalidate all blog queries since moderation affects visibility
      queryClient.invalidateQueries({ queryKey: blogQueryKeys.all })
      
      showSuccessToast('Blog moderation action completed!')
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to moderate blog'
      showErrorToast(message)
    },
  })
}

// Comment Mutations

export function useCreateComment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ blogSlug, content, parentId }: { blogSlug: string; content: string; parentId?: string }) => 
      commentsApiUtils.createComment(blogSlug, { content, parentId } as CreateCommentDto),
    onSuccess: (_, variables) => {
      // Invalidate comments for this blog
      queryClient.invalidateQueries({ queryKey: commentQueryKeys.forBlog(variables.blogSlug) })
      queryClient.invalidateQueries({ queryKey: blogQueryKeys.detail(variables.blogSlug) })
      
      showSuccessToast('Comment posted successfully!')
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to post comment'
      showErrorToast(message)
    },
  })
}

export function useUpdateComment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ commentId, blogSlug, content }: { commentId: string; blogSlug: string; content: string }) => 
      commentsApiUtils.updateComment(commentId, blogSlug, { content } as UpdateCommentDto),
    onSuccess: () => {
      // Invalidate all comments to refresh
      queryClient.invalidateQueries({ queryKey: commentQueryKeys.all })
      
      showSuccessToast('Comment updated successfully!')
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to update comment'
      showErrorToast(message)
    },
  })
}

export function useDeleteComment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ commentId, blogSlug }: { commentId: string; blogSlug: string }) => 
      commentsApiUtils.deleteComment(commentId, blogSlug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: commentQueryKeys.all })
      
      showSuccessToast('Comment deleted successfully!')
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to delete comment'
      showErrorToast(message)
    },
  })
}

export function useLikeComment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ commentId, blogSlug }: { commentId: string; blogSlug: string }) => 
      commentsApiUtils.likeComment(commentId, blogSlug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: commentQueryKeys.all })
      
      showSuccessToast('Comment liked!')
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to like comment'
      showErrorToast(message)
    },
  })
}

export function useUnlikeComment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ commentId, blogSlug }: { commentId: string; blogSlug: string }) => 
      commentsApiUtils.unlikeComment(commentId, blogSlug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: commentQueryKeys.all })
      
      showSuccessToast('Comment unliked!')
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to unlike comment'
      showErrorToast(message)
    },
  })
}

export function useFlagComment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ commentId, blogSlug, data }: { commentId: string; blogSlug: string; data: FlagBlogDto }) => 
      commentsApiUtils.flagComment(commentId, blogSlug, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: commentQueryKeys.all })
      
      showSuccessToast('Comment flagged for review!')
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to flag comment'
      showErrorToast(message)
    },
  })
}

// Category Management Mutations (Admin only)

export function useCreateCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => blogManagementApiUtils.createCategory(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: managementQueryKeys.categories() })
      queryClient.invalidateQueries({ queryKey: blogQueryKeys.categories() })
      
      showSuccessToast('Category created successfully!')
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to create category'
      showErrorToast(message)
    },
  })
}

export function useUpdateCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (categoryId: string) => blogManagementApiUtils.updateCategory(categoryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: managementQueryKeys.categories() })
      queryClient.invalidateQueries({ queryKey: blogQueryKeys.categories() })
      
      showSuccessToast('Category updated successfully!')
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to update category'
      showErrorToast(message)
    },
  })
}

export function useDeleteCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (categoryId: string) => blogManagementApiUtils.deleteCategory(categoryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: managementQueryKeys.categories() })
      queryClient.invalidateQueries({ queryKey: blogQueryKeys.categories() })
      
      showSuccessToast('Category deleted successfully!')
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to delete category'
      showErrorToast(message)
    },
  })
}

// Tag Management Mutations (Admin only)

export function useCreateTag() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => blogManagementApiUtils.createTag(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: managementQueryKeys.tags() })
      queryClient.invalidateQueries({ queryKey: blogQueryKeys.tags() })
      
      showSuccessToast('Tag created successfully!')
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to create tag'
      showErrorToast(message)
    },
  })
}

export function useUpdateTag() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (tagId: string) => blogManagementApiUtils.updateTag(tagId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: managementQueryKeys.tags() })
      queryClient.invalidateQueries({ queryKey: blogQueryKeys.tags() })
      
      showSuccessToast('Tag updated successfully!')
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to update tag'
      showErrorToast(message)
    },
  })
}

export function useDeleteTag() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (tagId: string) => blogManagementApiUtils.deleteTag(tagId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: managementQueryKeys.tags() })
      queryClient.invalidateQueries({ queryKey: blogQueryKeys.tags() })
      
      showSuccessToast('Tag deleted successfully!')
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to delete tag'
      showErrorToast(message)
    },
  })
}
