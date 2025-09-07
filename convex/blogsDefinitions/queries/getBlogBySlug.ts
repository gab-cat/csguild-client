import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";

import { QueryCtx } from "../../_generated/server";

export const getBlogBySlugArgs = {
  slug: v.string(),
  includeDrafts: v.optional(v.boolean()),
  userSlug: v.optional(v.string()), // Add userSlug for user interaction state
};

export const getBlogBySlugHandler = async (
  ctx: QueryCtx,
  args: {
    slug: string;
    includeDrafts?: boolean;
    userSlug?: string;
  }
) => {
  const blog = await ctx.db
    .query("blogs")
    .withIndex("by_slug", (q) => q.eq("slug", args.slug))
    .first();

  if (!blog) {
    return null;
  }

  // Check if user can view this blog
  if (blog.status !== "PUBLISHED" && !args.includeDrafts) {
    return null;
  }

  // Get author info
  const author = await ctx.db
    .query("users")
    .withIndex("by_username", (q) => q.eq("username", blog.authorSlug))
    .first();

  // Get categories
  const categoryRelations = await ctx.db
    .query("blogCategoryRelations")
    .withIndex("by_blogId", (q) => q.eq("blogId", blog._id))
    .collect();

  const categories = await Promise.all(
    categoryRelations.map(async (rel) => {
      const category = await ctx.db.get(rel.categoryId);
      return category ? {
        _id: category._id,
        name: category.name,
        slug: category.slug,
        description: category.description,
        color: category.color,
        icon: category.icon,
      } : null;
    })
  ).then(cats => cats.filter(Boolean));

  // Get tags
  const tagRelations = await ctx.db
    .query("blogTagRelations")
    .withIndex("by_blogId", (q) => q.eq("blogId", blog._id))
    .collect();

  const tags = await Promise.all(
    tagRelations.map(async (rel) => {
      const tag = await ctx.db.get(rel.tagId);
      return tag ? {
        _id: tag._id,
        name: tag.name,
        slug: tag.slug,
        description: tag.description,
        color: tag.color,
      } : null;
    })
  ).then(tags => tags.filter(Boolean));

  // Get cover images
  const coverImages = await ctx.db
    .query("blogCoverImages")
    .withIndex("by_blogId", (q) => q.eq("blogId", blog._id))
    .collect();

  const sortedCoverImages = coverImages
    .map(img => ({
      _id: img._id,
      imageUrl: img.imageUrl,
      altText: img.altText,
      caption: img.caption,
      credits: img.credits,
      order: img.order,
      isMain: img.isMain,
    }))
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  const blogDetail = {
    _id: blog._id,
    title: blog.title,
    slug: blog.slug,
    subtitle: blog.subtitle,
    content: blog.content,
    excerpt: blog.excerpt,
    readingTime: blog.readingTime,
    wordCount: blog.wordCount,
    status: blog.status,
    publishedAt: blog.publishedAt,
    scheduledFor: blog.scheduledFor,
    lastEditedAt: blog.lastEditedAt,
    metaDescription: blog.metaDescription,
    metaKeywords: blog.metaKeywords,
    canonicalUrl: blog.canonicalUrl,
    viewCount: blog.viewCount,
    likeCount: blog.likeCount,
    commentCount: blog.commentCount,
    shareCount: blog.shareCount,
    bookmarkCount: blog.bookmarkCount,
    moderationStatus: blog.moderationStatus,
    moderatedAt: blog.moderatedAt,
    moderatedBy: blog.moderatedBy,
    moderationNotes: blog.moderationNotes,
    flagCount: blog.flagCount,
    authorSlug: blog.authorSlug,
    allowComments: blog.allowComments,
    allowBookmarks: blog.allowBookmarks,
    allowLikes: blog.allowLikes,
    allowShares: blog.allowShares,
    isPinned: blog.isPinned,
    isFeatured: blog.isFeatured,
    createdAt: blog.createdAt,
    updatedAt: blog.updatedAt,
    author: author ? {
      username: author.username,
      firstName: author.firstName,
      lastName: author.lastName,
      imageUrl: author.imageUrl,
      bio: author.bio,
    } : {
      username: blog.authorSlug,
      firstName: undefined,
      lastName: undefined,
      imageUrl: undefined,
      bio: undefined,
    },
    categories,
    tags,
    coverImages: sortedCoverImages,
    isLiked: false, // Will be updated below if user is logged in
    isBookmarked: false, // Will be updated below if user is logged in
  };

  // If user is logged in, check their interactions with this blog
  const userId = await getAuthUserId(ctx);
  if (userId && blog) {
    const user = await ctx.db.get(userId);
    if (!user) return;
    // Check if user has liked this blog
    const userLikes = await ctx.db
      .query("blogLikes")
      .withIndex("by_userSlug", (q) => q.eq("userSlug", user.username!))
      .collect();
    
    const userLike = userLikes.find(like => like.blogId === blog._id);

    // Check if user has bookmarked this blog
    const userBookmarks = await ctx.db
      .query("blogBookmarks")
      .withIndex("by_userSlug", (q) => q.eq("userSlug", user.username!))
      .collect();
    
    const userBookmark = userBookmarks.find(bookmark => bookmark.blogId === blog._id);

    // Update interaction state
    const result = {
      ...blogDetail,
      isLiked: !!userLike,
      isBookmarked: !!userBookmark,
    };
    
    return result;
  }

  return blogDetail;
};
