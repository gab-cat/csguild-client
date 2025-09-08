import { getAuthUserId } from "@convex-dev/auth/server";
import { PaginationOptions, paginationOptsValidator } from "convex/server";
import { v } from "convex/values";

import { Doc } from "../../_generated/dataModel";
import { QueryCtx } from "../../_generated/server";

export const getMyBlogsArgs = {
  paginationOpts: paginationOptsValidator,
  status: v.optional(v.union(v.literal("DRAFT"), v.literal("PUBLISHED"), v.literal("PENDING"), v.literal("ARCHIVED"), v.literal("DELETED"))),
  sortBy: v.optional(v.union(v.literal("createdAt"), v.literal("publishedAt"), v.literal("updatedAt"), v.literal("viewCount"), v.literal("likeCount"), v.literal("title"))),
  sortOrder: v.optional(v.union(v.literal("asc"), v.literal("desc"))),
};

export const getMyBlogsHandler = async (
  ctx: QueryCtx,
  args: {
    paginationOpts: PaginationOptions;
    status?: "DRAFT" | "PUBLISHED" | "PENDING" | "ARCHIVED" | "DELETED";
    sortBy?: "createdAt" | "publishedAt" | "updatedAt" | "viewCount" | "likeCount" | "title";
    sortOrder?: "asc" | "desc";
  }
) => {
  const userId = await getAuthUserId(ctx);
  if (!userId) {
    throw new Error("Unauthorized");
  }

  // Get user info
  const user = await ctx.db.get(userId);
  if (!user) {
    throw new Error("User not found");
  }

  // Get user's blogs using the by_authorSlug index
  let blogs = await ctx.db
    .query("blogs")
    .withIndex("by_authorSlug", (q) => q.eq("authorSlug", user.username!))
    .collect();

  // Apply status filter if provided
  if (args.status) {
    blogs = blogs.filter(blog => blog.status === args.status);
  }

  // Sort blogs
  const sortBy = args.sortBy || "createdAt";
  const sortOrder = args.sortOrder || "desc";

  blogs.sort((a, b) => {
    let aValue: string | number | undefined = a[sortBy as keyof Doc<"blogs">] as string | number | undefined;
    let bValue: string | number | undefined = b[sortBy as keyof Doc<"blogs">] as string | number | undefined;

    if (sortBy === "title") {
      aValue = (aValue as string) ? (aValue as string).toLowerCase() : "";
      bValue = (bValue as string) ? (bValue as string).toLowerCase() : "";
    }

    if (aValue === undefined || aValue === null) aValue = 0;
    if (bValue === undefined || bValue === null) bValue = 0;

    if (sortOrder === "asc") {
      return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
    } else {
      return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
    }
  });

  // Get enriched data for each blog
  const enrichedBlogs = await Promise.all(
    blogs.map(async (blog) => {
      // Get categories
      const categoryRelations = await ctx.db
        .query("blogCategoryRelations")
        .withIndex("by_blogId", (q) => q.eq("blogId", blog._id))
        .collect();

      const categories = await Promise.all(
        categoryRelations.map(async (rel) => {
          const category = await ctx.db.get(rel.categoryId);
          return category ? {
            name: category.name,
            slug: category.slug,
            color: category.color,
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
            name: tag.name,
            slug: tag.slug,
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
        .sort((a, b) => (a.order || 0) - (b.order || 0))
        .map(img => ({
          id: img._id,
          imageUrl: img.imageUrl,
          altText: img.altText,
          isMain: img.isMain,
        }));

      return {
        _id: blog._id,
        title: blog.title,
        slug: blog.slug,
        subtitle: blog.subtitle,
        excerpt: blog.excerpt,
        readingTime: blog.readingTime,
        status: blog.status,
        publishedAt: blog.publishedAt,
        scheduledFor: blog.scheduledFor,
        lastEditedAt: blog.lastEditedAt,
        viewCount: blog.viewCount,
        likeCount: blog.likeCount,
        commentCount: blog.commentCount,
        shareCount: blog.shareCount,
        bookmarkCount: blog.bookmarkCount,
        moderationStatus: blog.moderationStatus,
        flagCount: blog.flagCount,
        isPinned: blog.isPinned,
        isFeatured: blog.isFeatured,
        createdAt: blog.createdAt,
        updatedAt: blog.updatedAt,
        authorSlug: blog.authorSlug,
        author: {
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          imageUrl: user.imageUrl,
        },
        categories,
        tags,
        coverImages: sortedCoverImages,
      };
    })
  );

  // Add user interaction state - check if the user has liked or bookmarked their own blogs
  // Batch query for likes - get all likes for this user across all their blogs
  const userLikes = await ctx.db
    .query("blogLikes")
    .withIndex("by_userSlug", (q) => q.eq("userSlug", user.username!))
    .collect();

  // Batch query for bookmarks - get all bookmarks for this user across all their blogs
  const userBookmarks = await ctx.db
    .query("blogBookmarks")
    .withIndex("by_userSlug", (q) => q.eq("userSlug", user.username!))
    .collect();

  // Create maps for efficient lookup
  const likesMap = new Map(userLikes.map(like => [like.blogId, true]));
  const bookmarksMap = new Map(userBookmarks.map(bookmark => [bookmark.blogId, true]));

  // Add interaction state to each blog
  const enrichedBlogsWithInteractions = enrichedBlogs.map(blog => ({
    ...blog,
    isLiked: likesMap.has(blog._id) || false,
    isBookmarked: bookmarksMap.has(blog._id) || false,
  }));

  // Apply pagination manually for enriched data
  const start = args.paginationOpts.cursor ? parseInt(args.paginationOpts.cursor) : 0;
  const end = start + args.paginationOpts.numItems;
  const page = enrichedBlogsWithInteractions.slice(start, end);
  const isDone = end >= enrichedBlogsWithInteractions.length;
  const continueCursor = isDone ? null : end.toString();

  return {
    page,
    isDone,
    continueCursor,
  };
};
