// Blog types based on Convex schema
import type { Doc, Id } from "../../../../convex/_generated/dataModel";

// Convex-based types extending Doc
export type BlogTag = Doc<"blogTags"> & {
  name: string;
  slug: string;
  description?: string;
  color?: string;
  isOfficial?: boolean;
  blogCount?: number;
  createdAt?: number;
  updatedAt?: number;
};

export type BlogCategory = Doc<"blogCategories"> & {
  name: string;
  slug: string;
  description?: string;
  color?: string;
  icon?: string;
  parentId?: Id<"blogCategories">;
  blogCount?: number;
  order?: number;
  isActive?: boolean;
  createdAt?: number;
  updatedAt?: number;
  parent?: {
    _id: Id<"blogCategories">;
    name: string;
    slug: string;
  } | null;
};

// Legacy API types for backward compatibility (will be removed)
export interface LegacyBlogTag {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  isActive?: boolean;
}

export interface LegacyBlogCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  isActive?: boolean;
}

// Wrapper type for API responses that include status, message, and data
export interface ApiResponseWrapper<T> {
  statusCode: number
  message: string
  blog?: T  // For single blog responses
  data?: T  // For other responses
}

// Blog detail response type matching Convex query return structure
export interface BlogDetailResponseDto extends BlogDetail {
  author: {
    username: string | undefined
    firstName?: string
    lastName?: string
    imageUrl?: string
    bio?: string
  }
  categories: Array<{
    id: Id<"blogCategories">
    name: string
    slug: string
    description?: string
    color?: string
    icon?: string
  }>
  tags: Array<{
    id: Id<"blogTags">
    name: string
    slug: string
    description?: string
    color?: string
  }>
  coverImages: Array<{
    id: Id<"blogCoverImages">
    imageUrl: string | null
    altText?: string | null
    caption?: string
    credits?: string
    order?: number
    isMain?: boolean
  }>
}

// Specific wrapper for blog detail response
export interface BlogDetailApiResponse extends ApiResponseWrapper<BlogDetail> {
  blog: BlogDetail & {
    author: {
      username: string
      firstName?: string
      lastName?: string
      imageUrl?: string
      bio?: string
    }
  }
}

// Convex-based types for blog operations
export interface BlogDetail {
  _id: Id<"blogs">
  _creationTime: number
  title: string
  slug: string
  subtitle?: string
  content: string
  excerpt?: string
  readingTime?: number
  wordCount?: number
  status: 'DRAFT' | 'PUBLISHED' | 'PENDING' | 'ARCHIVED' | 'DELETED'
  publishedAt?: number
  scheduledFor?: number
  lastEditedAt?: number
  metaDescription?: string
  metaKeywords?: string[]
  canonicalUrl?: string
  viewCount?: number
  likeCount?: number
  commentCount?: number
  shareCount?: number
  bookmarkCount?: number
  moderationStatus?: 'PENDING' | 'APPROVED' | 'REJECTED' | 'FLAGGED' | 'UNDER_REVIEW'
  moderatedAt?: number
  moderatedBy?: string
  moderationNotes?: string
  flagCount?: number
  authorSlug: string
  allowComments?: boolean
  allowBookmarks?: boolean
  allowLikes?: boolean
  allowShares?: boolean
  isPinned?: boolean
  isFeatured?: boolean
  createdAt?: number
  updatedAt?: number
}

export interface CreateBlogData {
  title: string
  slug: string
  subtitle?: string
  content: string
  excerpt?: string
  readingTime?: number
  wordCount?: number
  status: 'DRAFT' | 'PUBLISHED' | 'PENDING'
  publishedAt?: number
  scheduledFor?: number
  metaDescription?: string
  metaKeywords?: string[]
  canonicalUrl?: string
  authorSlug: string
  allowComments?: boolean
  allowBookmarks?: boolean
  allowLikes?: boolean
  allowShares?: boolean
  isPinned?: boolean
  isFeatured?: boolean
  categories?: string[]
  tags?: string[]
  coverImages?: File[]
}

export interface UpdateBlogData extends Partial<CreateBlogData> {
  _id: Id<"blogs">
}

// Blog status enum 
export type BlogStatus = 'DRAFT' | 'PUBLISHED' | 'PENDING' | 'ARCHIVED'

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
  author: {
    username: string
    firstName: string
    lastName: string
    imageUrl?: string
  }
  coverImages: Array<{
    id: string
    imageUrl: string
    altText?: string
    caption?: string
    credits?: string
    isMain?: boolean
  }>
  tags: BlogTag[]
  categories: BlogCategory[]
  createdAt: string
  updatedAt: string
  isLiked: boolean
  isBookmarked: boolean
}

// These are now defined above with CreateBlogData and UpdateBlogData

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
  blogs: BlogCardType[]
  meta?: {
    total: number
    page: number
    limit: number
    pages: number
  }
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

// Utility functions to convert data to our types
// Types for data returned by Convex functions
interface ConvexCoverImage {
  id: string;
  imageUrl: string;
  altText?: string;
  isMain?: boolean;
}

interface ConvexAuthor {
  username: string;
  firstName?: string;
  lastName?: string;
  imageUrl?: string;
}

interface ConvexTag {
  id?: string;
  name: string;
  slug: string;
  color?: string;
}

interface ConvexCategory {
  id?: string;
  name: string;
  slug: string;
  color?: string;
}

export function toBlogCard(blog: BlogDetail & {
  coverImages?: ConvexCoverImage[];
  tags?: ConvexTag[];
  categories?: ConvexCategory[];
  author?: ConvexAuthor;
  isLiked?: boolean;
  isBookmarked?: boolean;
}): BlogCardType {

  // Helper function to safely convert timestamp to ISO string
  const safeDateToISOString = (timestamp: number | undefined): string => {
    if (typeof timestamp === 'number' && timestamp > 0 && !isNaN(timestamp)) {
      try {
        return new Date(timestamp).toISOString();
      } catch {
        console.warn('Invalid timestamp provided:', timestamp);
      }
    }
    // Fallback to current time if timestamp is invalid
    return new Date().toISOString();
  };

  // Get creation timestamp - prefer _creationTime, fall back to createdAt
  const creationTimestamp = blog._creationTime || blog.createdAt;

  return {
    id: blog._id,
    title: blog.title,
    slug: blog.slug,
    subtitle: blog.subtitle || undefined,
    excerpt: blog.excerpt || undefined,
    readingTime: blog.readingTime || undefined,
    status: blog.status,
    publishedAt: blog.publishedAt ? safeDateToISOString(blog.publishedAt) : undefined,
    viewCount: blog.viewCount || 0,
    likeCount: blog.likeCount || 0,
    commentCount: blog.commentCount || 0,
    bookmarkCount: blog.bookmarkCount || 0,
    shareCount: blog.shareCount || 0,
    isPinned: blog.isPinned || false,
    isFeatured: blog.isFeatured || false,
    author: blog.author ? {
      username: blog.author.username || blog.authorSlug,
      firstName: blog.author.firstName || '',
      lastName: blog.author.lastName || '',
      imageUrl: blog.author.imageUrl,
    } : {
      username: blog.authorSlug,
      firstName: '',
      lastName: '',
      imageUrl: undefined,
    },
    coverImages: (blog.coverImages || []).map(img => ({
      id: img.id,
      imageUrl: img.imageUrl,
      altText: img.altText,
      caption: undefined,
      credits: undefined,
      isMain: img.isMain,
    })),
    tags: (blog.tags || []).map(tag => ({
      _id: tag.id || tag.name,
      _creationTime: Date.now(),
      name: tag.name,
      slug: tag.slug,
      description: undefined,
      color: tag.color,
      isOfficial: false,
      blogCount: undefined,
      createdAt: undefined,
      updatedAt: undefined,
    })) as BlogTag[],
    categories: (blog.categories || []).map(cat => ({
      _id: cat.id || cat.name,
      _creationTime: Date.now(),
      name: cat.name,
      slug: cat.slug,
      description: undefined,
      color: cat.color,
      icon: undefined,
      parentId: undefined,
      blogCount: undefined,
      order: undefined,
      isActive: true,
      createdAt: undefined,
      updatedAt: undefined,
      parent: null,
    })) as BlogCategory[],
    createdAt: safeDateToISOString(creationTimestamp),
    updatedAt: safeDateToISOString(blog.updatedAt || creationTimestamp),
    isLiked: blog.isLiked || false, // Use server-provided value if available
    isBookmarked: blog.isBookmarked || false, // Use server-provided value if available
  }
}

// Legacy utility function for backward compatibility (will be removed)
export function toBlogCardLegacy(blog: TrendingBlogResponseDto | PopularBlogResponseDto): BlogCardType {
  return {
    id: blog.id,
    title: blog.title,
    slug: blog.slug,
    subtitle: undefined,
    excerpt: blog.excerpt || undefined,
    readingTime: blog.readingTime || undefined,
    status: 'PUBLISHED', // Trending blogs are always published
    publishedAt: blog.publishedAt || undefined,
    viewCount: blog.viewCount,
    likeCount: blog.likeCount,
    commentCount: blog.commentCount,
    bookmarkCount: blog.bookmarkCount,
    shareCount: blog.shareCount || 0,
    isPinned: blog.isPinned,
    isFeatured: blog.isFeatured,
    author: {
      username: blog.author.username,
      firstName: blog.author.firstName,
      lastName: blog.author.lastName,
      imageUrl: blog.author.imageUrl,
    },
    coverImages: blog.coverImage ? [{
      id: '1',
      imageUrl: blog.coverImage,
      altText: blog.title,
      isMain: true,
    }] : [],
    tags: blog.tags.map(tag => ({
      _id: tag.slug as Id<"blogTags">,
      _creationTime: Date.now(),
      name: tag.name,
      slug: tag.slug,
      description: undefined,
      color: tag.color || undefined,
      isOfficial: true,
      blogCount: undefined,
      createdAt: undefined,
      updatedAt: undefined,
    })),
    categories: [],
    createdAt: new Date().toISOString(), // Fallback
    updatedAt: new Date().toISOString(), // Fallback
    isLiked: false,
    isBookmarked: false,
  }
}

// Enhanced version of toBlogCard that includes related data
export function toBlogCardWithRelations(
  blog: BlogDetail,
  tags: BlogTag[] = [],
  categories: BlogCategory[] = [],
  coverImages: Array<{id: string, imageUrl: string, altText?: string, isMain?: boolean}> = [],
  author?: {username: string, firstName: string, lastName: string, imageUrl?: string},
  isLiked: boolean = false,
  isBookmarked: boolean = false
): BlogCardType {
  // Helper function to safely convert timestamp to ISO string
  const safeDateToISOString = (timestamp: number | undefined): string => {
    if (typeof timestamp === 'number' && timestamp > 0 && !isNaN(timestamp)) {
      try {
        return new Date(timestamp).toISOString();
      } catch {
        console.warn('Invalid timestamp provided:', timestamp);
      }
    }
    // Fallback to current time if timestamp is invalid
    return new Date().toISOString();
  };

  // Get creation timestamp - prefer _creationTime, fall back to createdAt
  const creationTimestamp = blog._creationTime || blog.createdAt;

  return {
    id: blog._id,
    title: blog.title,
    slug: blog.slug,
    subtitle: blog.subtitle || undefined,
    excerpt: blog.excerpt || undefined,
    readingTime: blog.readingTime || undefined,
    status: blog.status,
    publishedAt: blog.publishedAt ? safeDateToISOString(blog.publishedAt) : undefined,
    viewCount: blog.viewCount || 0,
    likeCount: blog.likeCount || 0,
    commentCount: blog.commentCount || 0,
    bookmarkCount: blog.bookmarkCount || 0,
    shareCount: blog.shareCount || 0,
    isPinned: blog.isPinned || false,
    isFeatured: blog.isFeatured || false,
    author: author || {
      username: blog.authorSlug,
      firstName: '',
      lastName: '',
      imageUrl: undefined,
    },
    coverImages,
    tags,
    categories,
    createdAt: safeDateToISOString(creationTimestamp),
    updatedAt: safeDateToISOString(blog.updatedAt || creationTimestamp),
    isLiked,
    isBookmarked,
  }
}

// Convert Convex comment data to our internal comment type
export type BlogComment = Doc<"blogComments"> & {
  blogId: Id<"blogs">
  authorSlug: string
  content: string
  parentId?: Id<"blogComments">
  status?: 'PUBLISHED' | 'HIDDEN' | 'DELETED' | 'UNDER_REVIEW'
  moderatedAt?: number
  moderatedBy?: string
  moderationNotes?: string
  likeCount?: number
  flagCount?: number
  createdAt?: number
  updatedAt?: number
}

// Interface for enriched comment data from Convex queries
interface EnrichedCommentAuthor {
  username: string
  firstName?: string
  lastName?: string
  imageUrl?: string
}

interface EnrichedBlogComment extends BlogComment {
  author?: EnrichedCommentAuthor
  replies?: EnrichedBlogComment[]
}

export function toCommentType(comment: BlogComment | EnrichedBlogComment): BlogCommentType {
  if (!comment) {
    throw new Error('Comment data is required')
  }

  // Helper function to safely convert timestamp to ISO string
  const safeDateToISOString = (timestamp: number | undefined): string => {
    if (typeof timestamp === 'number' && timestamp > 0 && !isNaN(timestamp)) {
      try {
        return new Date(timestamp).toISOString();
      } catch {
        console.warn('Invalid timestamp provided:', timestamp);
      }
    }
    // Fallback to current time if timestamp is invalid
    return new Date().toISOString();
  };

  // Get creation timestamp - prefer _creationTime, fall back to createdAt
  const creationTimestamp = comment._creationTime || comment.createdAt;

  // Check if this is enriched comment data from getCommentsForBlog query
  const enrichedComment = comment as EnrichedBlogComment;
  const hasEnrichedAuthor = enrichedComment.author && typeof enrichedComment.author === 'object' && enrichedComment.author.username;

  return {
    id: comment._id,
    content: comment.content || '',
    authorId: comment.authorSlug || enrichedComment.author?.username || '',
    author: hasEnrichedAuthor ? {
      id: enrichedComment.author!.username,
      username: enrichedComment.author!.username,
      firstName: enrichedComment.author!.firstName || '',
      lastName: enrichedComment.author!.lastName || '',
      imageUrl: enrichedComment.author!.imageUrl,
    } : {
      id: comment.authorSlug || '',
      username: comment.authorSlug || '',
      firstName: '', // Would need to be fetched separately from users table
      lastName: '', // Would need to be fetched separately from users table
      imageUrl: undefined, // Would need to be fetched separately from users table
    },
    blogId: comment.blogId,
    parentId: comment.parentId || undefined,
    replies: null, // Replies are fetched separately
    replyCount: enrichedComment.replies?.length || 0,
    createdAt: safeDateToISOString(creationTimestamp),
    updatedAt: safeDateToISOString(comment.updatedAt || creationTimestamp),
    isEdited: comment.createdAt !== comment.updatedAt,
    likeCount: comment.likeCount || 0,
    flagCount: comment.flagCount || 0,
    status: comment.status || 'PUBLISHED',
    isLiked: false, // Would need to be fetched separately from blogCommentLikes table
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
  return ['DRAFT', 'PUBLISHED', 'PENDING', 'ARCHIVED'].includes(status)
}

export function isValidModerationStatus(status: string): status is ModerationStatus {
  return ['PENDING', 'APPROVED', 'REJECTED', 'FLAGGED'].includes(status)
}

export function hasBlogContent(blog: unknown): blog is BlogDetail & { content: string } {
  return typeof blog === 'object' && blog !== null &&
    'content' in blog && typeof blog.content === 'string' && blog.content.length > 0
}

export function hasAuthorInfo(blog: unknown): blog is BlogCardType & { author: { username: string; firstName: string; lastName: string; imageUrl?: string } } {
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