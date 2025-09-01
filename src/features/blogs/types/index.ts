// Blog types based on API documentation
import type {
  BlogDetailResponseDto,
  BlogListResponseDto,
  BlogSummaryResponseDto,
  CreateBlogDto,
  UpdateBlogDto,
  BlogActionResponseDto,
  FlagBlogDto,
  ShareBlogDto,
  ModerateBlogDto,
  CreateCommentDto,
  UpdateCommentDto,
  BlogSummaryResponseDtoAuthor,
  BlogSummaryResponseDtoCoverImagesInner,
  BlogSummaryResponseDtoTagsInner,
  BlogListResponseDtoMeta,
  CommentResponseDto,  
} from '@generated/api-client'

// Wrapper type for API responses that include status, message, and data
export interface ApiResponseWrapper<T> {
  statusCode: number
  message: string
  blog?: T  // For single blog responses
  data?: T  // For other responses
}

// Specific wrapper for blog detail response
export interface BlogDetailApiResponse extends ApiResponseWrapper<BlogDetailResponseDto> {
  blog: BlogDetailResponseDto
}

// Re-export API types for convenience
export type {
  BlogDetailResponseDto,
  BlogListResponseDto,
  BlogSummaryResponseDto,
  CreateBlogDto,
  UpdateBlogDto,
  BlogActionResponseDto,
  FlagBlogDto,
  ShareBlogDto,
  ModerateBlogDto,
  CreateCommentDto,
  UpdateCommentDto,
  BlogSummaryResponseDtoAuthor,
  BlogSummaryResponseDtoCoverImagesInner,
  BlogSummaryResponseDtoTagsInner,
  BlogListResponseDtoMeta
}

// Blog status enum 
export type BlogStatus = 'DRAFT' | 'PUBLISHED' | 'SCHEDULED' | 'ARCHIVED'

// Moderation status enum
export type ModerationStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'FLAGGED'

// Blog filters for query parameters
export interface BlogFiltersType {
  search?: string
  tags?: string[]
  categories?: string[]
  authorSlug?: string
  status?: BlogStatus
  pinned?: boolean
  featured?: boolean
  dateFrom?: string
  dateTo?: string
  sortOrder?: 'asc' | 'desc'
  sortBy?: 'createdAt' | 'updatedAt' | 'publishedAt' | 'title' | 'viewCount' | 'likeCount' | 'commentCount'
  limit?: number
  page?: number
}

// Admin moderation filters
export interface ModerationFiltersType {
  type?: 'blogs' | 'comments'
  status?: ModerationStatus
  page?: number
  limit?: number
}

// Blog card data for listing
export interface BlogCardType {
  id: string
  title: string
  slug: string
  subtitle?: string
  excerpt?: string
  readingTime?: number
  status: string
  publishedAt?: string
  viewCount: number
  likeCount: number
  commentCount: number
  bookmarkCount: number
  shareCount: number
  isPinned: boolean
  isFeatured: boolean
  author: BlogSummaryResponseDtoAuthor
  coverImages: BlogSummaryResponseDtoCoverImagesInner[]
  tags: BlogSummaryResponseDtoTagsInner[]
  categories: BlogSummaryResponseDtoTagsInner[]
  createdAt: string
  updatedAt: string
  isLiked: boolean
  isBookmarked: boolean
}

// Extended blog creation data
export interface CreateBlogData extends Omit<CreateBlogDto, 'coverImages'> {
  categories?: string[]
  tags?: string[]
  coverImages?: File[]
}

// Extended blog update data  
export interface UpdateBlogData extends Omit<UpdateBlogDto, 'coverImages'> {
  categories?: string[]
  tags?: string[]
  coverImages?: File[]
}

// Comment data with user info
export interface BlogCommentType {
  id: string
  content: string
  authorId: string
  author: {
    id: string
    username: string
    firstName: string
    lastName: string
    imageUrl?: string
  }
  blogId: string
  parentId?: string
  replies?: BlogCommentType[] | null
  replyCount?: number
  createdAt: string
  updatedAt: string
  isEdited: boolean
  likeCount: number
  flagCount: number
  status: string
  isLiked: boolean | null
}

// Blog analytics data
export interface BlogAnalyticsType {
  totalViews: number
  totalLikes: number
  totalComments: number
  totalShares: number
  totalBookmarks: number
  viewsOverTime: { date: string; views: number }[]
  likesOverTime: { date: string; likes: number }[]
  commentsOverTime: { date: string; comments: number }[]
  topReferrers: { source: string; views: number }[]
  readingTimeDistribution: { time: string; count: number }[]
}

// Author profile for blog context
export interface BlogAuthorType {
  id: string
  username: string
  firstName: string
  lastName: string
  email: string
  imageUrl?: string
  bio?: string
  socialLinks?: {
    twitter?: string
    linkedin?: string
    github?: string
    website?: string
  }
  blogCount: number
  totalViews: number
  totalLikes: number
  joinedAt: string
}

// Admin dashboard stats
export interface BlogDashboardStats {
  totalBlogs: number
  totalDrafts: number
  totalPublished: number
  pendingModeration: number
  totalComments: number
  flaggedComments: number
  totalViews: number
  totalLikes: number
  topBlogs: BlogCardType[]
  recentActivity: {
    type: 'blog_created' | 'blog_published' | 'comment_added' | 'blog_flagged'
    message: string
    timestamp: string
    user?: string
    blogTitle?: string
  }[]
}

// Form states
export interface BlogFormState {
  isLoading: boolean
  error: string | null
  isSuccess: boolean
}

export interface CommentFormState {
  isLoading: boolean
  error: string | null
  isSuccess: boolean
}

export interface ModerationFormState {
  isLoading: boolean
  error: string | null
  isSuccess: boolean
}

// Trending blog response type based on API sample
export interface TrendingBlogResponseDto {
  id: string
  title: string
  slug: string
  excerpt?: string
  readingTime?: number
  publishedAt?: string
  viewCount: number
  likeCount: number
  commentCount: number
  shareCount: number
  bookmarkCount: number
  isPinned: boolean
  isFeatured: boolean
  trendingScore: number
  recentActivity: {
    views: number
    likes: number
    comments: number
    shares: number
  }
  author: {
    username: string
    firstName: string
    lastName: string
    imageUrl?: string
  }
  tags: Array<{
    name: string
    slug: string
    color?: string
  }>
  categories: unknown[]
  coverImage?: string
}

// Popular blog response type
export interface PopularBlogResponseDto extends Omit<TrendingBlogResponseDto, 'trendingScore' | 'recentActivity'> {
  popularityScore: number
}

// Featured blog response wrapper
export interface FeaturedBlogsResponse {
  blogs: BlogSummaryResponseDto[]
  meta?: BlogListResponseDtoMeta
}

// Trending blogs response wrapper
export interface TrendingBlogsResponse {
  data: TrendingBlogResponseDto[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
  timeframe: string
}

// Popular blogs response wrapper
export interface PopularBlogsResponse {
  data: PopularBlogResponseDto[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
  timeframe: string
}

// Utility functions to convert API responses to our types
export function toBlogCard(blog: BlogSummaryResponseDto | TrendingBlogResponseDto | PopularBlogResponseDto): BlogCardType {
  // Handle BlogSummaryResponseDto
  if ('status' in blog && 'createdAt' in blog) {
    const summaryBlog = blog as BlogSummaryResponseDto
    return {
      id: summaryBlog.id,
      title: summaryBlog.title,
      slug: summaryBlog.slug,
      subtitle: summaryBlog.subtitle || undefined,
      excerpt: summaryBlog.excerpt || undefined,
      readingTime: summaryBlog.readingTime || undefined,
      status: summaryBlog.status,
      publishedAt: summaryBlog.publishedAt || undefined,
      viewCount: summaryBlog.viewCount,
      likeCount: summaryBlog.likeCount,
      commentCount: summaryBlog.commentCount,
      bookmarkCount: summaryBlog.bookmarkCount,
      shareCount: 0, // Not available in summary response
      isPinned: summaryBlog.isPinned,
      isFeatured: summaryBlog.isFeatured,
      author: summaryBlog.author,
      coverImages: summaryBlog.coverImages,
      tags: summaryBlog.tags,
      categories: summaryBlog.categories,
      createdAt: summaryBlog.createdAt,
      updatedAt: summaryBlog.updatedAt,
      isLiked: summaryBlog.isLiked || false,
      isBookmarked: summaryBlog.isBookmarked || false,
    }
  }
  
  // Handle TrendingBlogResponseDto or PopularBlogResponseDto
  const trendingBlog = blog as TrendingBlogResponseDto
  return {
    id: trendingBlog.id,
    title: trendingBlog.title,
    slug: trendingBlog.slug,
    subtitle: undefined,
    excerpt: trendingBlog.excerpt || undefined,
    readingTime: trendingBlog.readingTime || undefined,
    status: 'PUBLISHED', // Trending blogs are always published
    publishedAt: trendingBlog.publishedAt || undefined,
    viewCount: trendingBlog.viewCount,
    likeCount: trendingBlog.likeCount,
    commentCount: trendingBlog.commentCount,
    bookmarkCount: trendingBlog.bookmarkCount,
    shareCount: trendingBlog.shareCount || 0,
    isPinned: trendingBlog.isPinned,
    isFeatured: trendingBlog.isFeatured,
    author: {
      username: trendingBlog.author.username,
      firstName: trendingBlog.author.firstName,
      lastName: trendingBlog.author.lastName,
      imageUrl: trendingBlog.author.imageUrl,
    },
    coverImages: trendingBlog.coverImage ? [{
      id: '1',
      imageUrl: trendingBlog.coverImage,
      altText: trendingBlog.title,
      isMain: true,
    }] : [],
    tags: trendingBlog.tags.map(tag => ({
      id: tag.slug,
      name: tag.name,
      slug: tag.slug,
      description: undefined,
      color: tag.color || undefined,
      isActive: true,
    })),
    categories: [],
    createdAt: new Date().toISOString(), // Fallback
    updatedAt: new Date().toISOString(), // Fallback
    isLiked: false,
    isBookmarked: false,
  }
}

export function toBlogCardFromDetail(blog: BlogDetailResponseDto): BlogCardType {
  return {
    id: blog.id,
    title: blog.title,
    slug: blog.slug,
    subtitle: blog.subtitle || undefined,
    excerpt: blog.excerpt || undefined,
    readingTime: blog.readingTime || undefined,
    status: blog.status,
    publishedAt: blog.publishedAt || undefined,
    viewCount: blog.viewCount,
    likeCount: blog.likeCount,
    commentCount: blog.commentCount,
    bookmarkCount: blog.bookmarkCount,
    shareCount: blog.shareCount,
    isPinned: blog.isPinned,
    isFeatured: blog.isFeatured,
    author: blog.author,
    coverImages: blog.coverImages,
    tags: blog.tags,
    categories: blog.categories,
    createdAt: blog.createdAt,
    updatedAt: blog.updatedAt,
    isLiked: blog.isLiked || false,
    isBookmarked: blog.isBookmarked || false,
  }
}

// Convert API comment response to our internal comment type
export function toCommentType(comment: CommentResponseDto): BlogCommentType {
  if (!comment) {
    throw new Error('Comment data is required')
  }
  
  return {
    id: comment.id || '',
    content: comment.content || '',
    authorId: comment.author?.username || '', // Use username as fallback for authorId
    author: {
      id: comment.author?.username || '',
      username: comment.author?.username || '',
      firstName: comment.author?.firstName || '',
      lastName: comment.author?.lastName || '',
      imageUrl: comment.author?.imageUrl,
    },
    blogId: '', // Not available in API response, would need to be passed separately
    parentId: comment.parentId || undefined,
    replies: null, // Replies are fetched separately using the replyCount
    replyCount: comment.replyCount || 0,
    createdAt: comment.createdAt || new Date().toISOString(),
    updatedAt: comment.updatedAt || new Date().toISOString(),
    isEdited: comment.createdAt !== comment.updatedAt,
    likeCount: comment.likeCount || 0,
    flagCount: 0, // Not available in current API response
    status: 'active', // Not available in current API response
    isLiked: comment.isLiked || false,
  }
}

// API Error types
export interface BlogApiError {
  message: string
  statusCode: number
  details?: string
}

// Type guards
export function isValidBlogStatus(status: string): status is BlogStatus {
  return ['DRAFT', 'PUBLISHED', 'SCHEDULED', 'ARCHIVED'].includes(status)
}

export function isValidModerationStatus(status: string): status is ModerationStatus {
  return ['PENDING', 'APPROVED', 'REJECTED', 'FLAGGED'].includes(status)
}

export function hasBlogContent(blog: unknown): blog is BlogDetailResponseDto & { content: string } {
  return typeof blog === 'object' && blog !== null && 
    'content' in blog && typeof blog.content === 'string' && blog.content.length > 0
}

export function hasAuthorInfo(blog: unknown): blog is BlogCardType & { author: BlogSummaryResponseDtoAuthor } {
  return typeof blog === 'object' && blog !== null && 
    'author' in blog && typeof blog.author === 'object' && blog.author !== null
}

// Content types for rich text editor
export type ContentType = 'markdown' | 'html' | 'rich-text'

// Blog creation steps for multi-step form
export type BlogCreationStep = 'basic-info' | 'content' | 'settings' | 'preview' | 'publish'

export interface BlogCreationProgress {
  currentStep: BlogCreationStep
  completedSteps: BlogCreationStep[]
  isValid: boolean
  canProceed: boolean
}

// SEO and metadata types
export interface BlogSEOData {
  metaTitle?: string
  metaDescription?: string
  metaKeywords: string[]
  canonicalUrl?: string
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
  twitterTitle?: string
  twitterDescription?: string
  twitterImage?: string
}

// Blog series/collection types
export interface BlogSeries {
  id: string
  title: string
  description?: string
  slug: string
  blogs: BlogCardType[]
  totalBlogs: number
  createdAt: string
  updatedAt: string
}

// Reading list types for user bookmarks
export interface ReadingList {
  id: string
  name: string
  description?: string
  blogs: BlogCardType[]
  totalBlogs: number
  isPublic: boolean
  createdAt: string
  updatedAt: string
}

// Notification types for blog interactions
export interface BlogNotification {
  id: string
  type: 'like' | 'comment' | 'share' | 'bookmark' | 'mention' | 'follow'
  message: string
  blogId?: string
  blogTitle?: string
  actorId: string
  actorName: string
  actorImage?: string
  isRead: boolean
  createdAt: string
}
