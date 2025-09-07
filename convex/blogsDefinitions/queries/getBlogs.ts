import { getAuthUserId } from "@convex-dev/auth/server";
import { PaginationOptions, paginationOptsValidator } from "convex/server";
import { v } from "convex/values";

import { Doc } from "../../_generated/dataModel";
import { QueryCtx } from "../../_generated/server";

export const getBlogsArgs = {
  paginationOpts: paginationOptsValidator,
  search: v.optional(v.string()),
  status: v.optional(v.union(v.literal("DRAFT"), v.literal("PUBLISHED"), v.literal("SCHEDULED"), v.literal("ARCHIVED"), v.literal("DELETED"))),
  authorSlug: v.optional(v.string()),
  categorySlug: v.optional(v.string()),
  tagSlug: v.optional(v.string()),
  sortBy: v.optional(v.union(v.literal("createdAt"), v.literal("publishedAt"), v.literal("updatedAt"), v.literal("viewCount"), v.literal("likeCount"), v.literal("commentCount"), v.literal("title"))),
  sortOrder: v.optional(v.union(v.literal("asc"), v.literal("desc"))),
  featured: v.optional(v.boolean()),
  pinned: v.optional(v.boolean()),
  userSlug: v.optional(v.string()), // Add userSlug for user interaction state
};

export const getBlogsHandler = async (
  ctx: QueryCtx,
  args: {
    paginationOpts: PaginationOptions;
    search?: string;
    status?: "DRAFT" | "PUBLISHED" | "SCHEDULED" | "ARCHIVED" | "DELETED";
    authorSlug?: string;
    categorySlug?: string;
    tagSlug?: string;
    sortBy?: "createdAt" | "publishedAt" | "updatedAt" | "viewCount" | "likeCount" | "commentCount" | "title";
    sortOrder?: "asc" | "desc";
    featured?: boolean;
    pinned?: boolean;
    userSlug?: string;
  }
) => {
  // Start with appropriate index based on filters
  let blogs: Doc<"blogs">[];
  if (args.authorSlug) {
    blogs = await ctx.db
      .query("blogs")
      .withIndex("by_authorSlug", (q) => q.eq("authorSlug", args.authorSlug!))
      .collect();
  } else if (args.status) {
    blogs = await ctx.db
      .query("blogs")
      .withIndex("by_status", (q) => q.eq("status", args.status))
      .collect();
  } else if (args.pinned !== undefined) {
    blogs = await ctx.db
      .query("blogs")
      .withIndex("by_isPinned", (q) => q.eq("isPinned", args.pinned))
      .collect();
  } else if (args.featured !== undefined) {
    blogs = await ctx.db
      .query("blogs")
      .withIndex("by_isFeatured", (q) => q.eq("isFeatured", args.featured))
      .collect();
  } else {
    // Use publishedAt index for general queries
    blogs = await ctx.db
      .query("blogs")
      .withIndex("by_publishedAt")
      .collect();
  }

  // Apply search filter
  if (args.search) {
    const searchLower = args.search.toLowerCase();
    blogs = blogs.filter(blog =>
      blog.title.toLowerCase().includes(searchLower) ||
        (blog.subtitle && blog.subtitle.toLowerCase().includes(searchLower)) ||
        (blog.excerpt && blog.excerpt.toLowerCase().includes(searchLower))
    );
  }

  // Apply category filter using slug
  if (args.categorySlug) {
    // First get the category by slug
    const category = await ctx.db
      .query("blogCategories")
      .withIndex("by_slug", (q) => q.eq("slug", args.categorySlug!))
      .first();

    if (category) {
      const categoryRelations = await ctx.db
        .query("blogCategoryRelations")
        .withIndex("by_categoryId", (q) => q.eq("categoryId", category._id))
        .collect();

      const blogIds = new Set(categoryRelations.map(rel => rel.blogId));
      blogs = blogs.filter(blog => blogIds.has(blog._id));
    } else {
      // No category found, return empty result
      blogs = [];
    }
  }

  // Apply tag filter using slug
  if (args.tagSlug) {
    // First get the tag by slug
    const tag = await ctx.db
      .query("blogTags")
      .withIndex("by_slug", (q) => q.eq("slug", args.tagSlug!))
      .first();

    if (tag) {
      const tagRelations = await ctx.db
        .query("blogTagRelations")
        .withIndex("by_tagId", (q) => q.eq("tagId", tag._id))
        .collect();

      const blogIds = new Set(tagRelations.map(rel => rel.blogId));
      blogs = blogs.filter(blog => blogIds.has(blog._id));
    } else {
      // No tag found, return empty result
      blogs = [];
    }
  }

  // Apply other filters
  if (args.status && !args.authorSlug) {
    blogs = blogs.filter(blog => blog.status === args.status);
  }
  if (args.pinned !== undefined && !args.authorSlug) {
    blogs = blogs.filter(blog => blog.isPinned === args.pinned);
  }
  if (args.featured !== undefined && !args.authorSlug) {
    blogs = blogs.filter(blog => blog.isFeatured === args.featured);
  }

  // Sort blogs
  const sortBy = args.sortBy || "publishedAt";
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
  let enrichedBlogs = await Promise.all(
    blogs.map(async (blog) => {
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
        lastEditedAt: blog.lastEditedAt,
        viewCount: blog.viewCount,
        likeCount: blog.likeCount,
        commentCount: blog.commentCount,
        shareCount: blog.shareCount,
        bookmarkCount: blog.bookmarkCount,
        authorSlug: blog.authorSlug,
        isPinned: blog.isPinned,
        isFeatured: blog.isFeatured,
        createdAt: blog.createdAt,
        updatedAt: blog.updatedAt,
        author: author ? {
          username: author.username,
          firstName: author.firstName,
          lastName: author.lastName,
          imageUrl: author.imageUrl,
        } : {
          username: blog.authorSlug,
          firstName: undefined,
          lastName: undefined,
          imageUrl: undefined,
        },
        categories,
        tags,
        coverImages: sortedCoverImages,
      };
    })
  );

  const userId = await getAuthUserId(ctx);

  // If user is logged in, check their interactions with all blogs in the result set
  if (userId) {
    const user = await ctx.db.get(userId);
    if (!user) return;
    // Batch query for likes - get all likes for this user across all blogs
    const userLikes = await ctx.db
      .query("blogLikes")
      .withIndex("by_userSlug", (q) => q.eq("userSlug", user.username!))
      .collect();

    // Batch query for bookmarks - get all bookmarks for this user across all blogs
    const userBookmarks = await ctx.db
      .query("blogBookmarks")
      .withIndex("by_userSlug", (q) => q.eq("userSlug", user.username!))
      .collect();

    // Create maps for efficient lookup
    const likesMap = new Map(userLikes.map(like => [like.blogId, true]));
    const bookmarksMap = new Map(userBookmarks.map(bookmark => [bookmark.blogId, true]));

    // Add interaction state to each blog
    enrichedBlogs = enrichedBlogs.map(blog => ({
      ...blog,
      isLiked: likesMap.has(blog._id) || false,
      isBookmarked: bookmarksMap.has(blog._id) || false,
    }));
  } else {
    // User not logged in, set default interaction state
    enrichedBlogs = enrichedBlogs.map(blog => ({
      ...blog,
      isLiked: false,
      isBookmarked: false,
    }));
  }

  // Apply pagination manually for enriched data
  const start = args.paginationOpts.cursor ? parseInt(args.paginationOpts.cursor) : 0;
  const end = start + args.paginationOpts.numItems;
  const page = enrichedBlogs.slice(start, end);
  const isDone = end >= enrichedBlogs.length;
  const continueCursor = isDone ? null : end.toString();

  return {
    page,
    isDone,
    continueCursor,
  };
};
