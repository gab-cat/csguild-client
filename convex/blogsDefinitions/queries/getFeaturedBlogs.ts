import { getAuthUserId } from "@convex-dev/auth/server";
import { PaginationOptions, paginationOptsValidator } from "convex/server";
import { v } from "convex/values";

import { QueryCtx } from "../../_generated/server";

export const getFeaturedBlogsArgs = {
  paginationOpts: paginationOptsValidator,
  userSlug: v.optional(v.string()), // Add userSlug for user interaction state
};

export const getFeaturedBlogsHandler = async (
  ctx: QueryCtx,
  args: {
    paginationOpts: PaginationOptions;
    userSlug?: string;
  }
) => {
  // Get featured blogs using the by_isFeatured index, filtered by PUBLISHED status
  const blogs = await ctx.db
    .query("blogs")
    .withIndex("by_isFeatured", (q) => q.eq("isFeatured", true))
    .filter((q) => q.eq(q.field("status"), "PUBLISHED"))
    .collect();

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
        publishedAt: blog.publishedAt,
        viewCount: blog.viewCount,
        likeCount: blog.likeCount,
        commentCount: blog.commentCount,
        shareCount: blog.shareCount,
        bookmarkCount: blog.bookmarkCount,
        authorSlug: blog.authorSlug,
        createdAt: blog.createdAt,
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
