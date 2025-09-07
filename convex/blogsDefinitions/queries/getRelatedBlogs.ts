import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";

import { Doc, Id } from "../../_generated/dataModel";
import { QueryCtx } from "../../_generated/server";

export const getRelatedBlogsArgs = {
  currentBlogSlug: v.string(),
  limit: v.optional(v.number()),
  userSlug: v.optional(v.string()), // Add userSlug for user interaction state
};

export const getRelatedBlogsHandler = async (
  ctx: QueryCtx,
  args: {
    currentBlogSlug: string;
    limit?: number;
    userSlug?: string;
  }
) => {
  const limit = args.limit || 4;

  // Get the current blog to find related criteria
  const currentBlog = await ctx.db
    .query("blogs")
    .withIndex("by_slug", (q) => q.eq("slug", args.currentBlogSlug))
    .first();

  if (!currentBlog) {
    return [];
  }

  // Get blogs from the same author (excluding current blog)
  let relatedBlogs: Doc<"blogs">[] = [];
  if (currentBlog.authorSlug) {
    const authorBlogs = await ctx.db
      .query("blogs")
      .withIndex("by_authorSlug", (q) => q.eq("authorSlug", currentBlog.authorSlug))
      .filter((q) => q.neq(q.field("slug"), args.currentBlogSlug))
      .filter((q) => q.eq(q.field("status"), "PUBLISHED"))
      .collect();

    relatedBlogs = [...authorBlogs];
  }

  // If we don't have enough blogs from the same author, get blogs from same categories
  if (relatedBlogs.length < limit && currentBlog._id) {
    // Get categories for current blog
    const categoryRelations = await ctx.db
      .query("blogCategoryRelations")
      .withIndex("by_blogId", (q) => q.eq("blogId", currentBlog._id))
      .collect();

    if (categoryRelations.length > 0) {
      // Get blogs from same categories
      const categoryBlogIds = new Set<string>();
      for (const categoryRel of categoryRelations) {
        const categoryBlogs = await ctx.db
          .query("blogCategoryRelations")
          .withIndex("by_categoryId", (q) => q.eq("categoryId", categoryRel.categoryId))
          .collect();

        categoryBlogs.forEach(rel => {
          if (rel.blogId !== currentBlog._id) {
            categoryBlogIds.add(rel.blogId);
          }
        });
      }

      // Get the actual blog documents
      const categoryBlogs = await Promise.all(
        Array.from(categoryBlogIds).slice(0, limit - relatedBlogs.length).map(id => ctx.db.get(id as Id<"blogs">))
      );

      const validCategoryBlogs = categoryBlogs.filter((blog): blog is Doc<"blogs"> =>
        blog !== null &&
        blog.status === "PUBLISHED" &&
        blog.slug !== args.currentBlogSlug &&
        !relatedBlogs.some(rb => rb._id === blog._id)
      );

      relatedBlogs = [...relatedBlogs, ...validCategoryBlogs];
    }
  }

  // If we still don't have enough blogs, get blogs from same tags
  if (relatedBlogs.length < limit && currentBlog._id) {
    // Get tags for current blog
    const tagRelations = await ctx.db
      .query("blogTagRelations")
      .withIndex("by_blogId", (q) => q.eq("blogId", currentBlog._id))
      .collect();

    if (tagRelations.length > 0) {
      // Get blogs from same tags
      const tagBlogIds = new Set<string>();
      for (const tagRel of tagRelations) {
        const tagBlogs = await ctx.db
          .query("blogTagRelations")
          .withIndex("by_tagId", (q) => q.eq("tagId", tagRel.tagId))
          .collect();

        tagBlogs.forEach(rel => {
          if (rel.blogId !== currentBlog._id) {
            tagBlogIds.add(rel.blogId);
          }
        });
      }

      // Get the actual blog documents
      const tagBlogs = await Promise.all(
        Array.from(tagBlogIds).slice(0, limit - relatedBlogs.length).map(id => ctx.db.get(id as Id<"blogs">))
      );

      const validTagBlogs = tagBlogs.filter((blog): blog is Doc<"blogs"> =>
        blog !== null &&
        blog.status === "PUBLISHED" &&
        blog.slug !== args.currentBlogSlug &&
        !relatedBlogs.some(rb => rb._id === blog._id)
      );

      relatedBlogs = [...relatedBlogs, ...validTagBlogs];
    }
  }

  // If we still don't have enough blogs, fill with recent published blogs
  if (relatedBlogs.length < limit) {
    const recentBlogs = await ctx.db
      .query("blogs")
      .withIndex("by_publishedAt")
      .filter((q) => q.eq(q.field("status"), "PUBLISHED"))
      .filter((q) => q.neq(q.field("slug"), args.currentBlogSlug))
      .order("desc")
      .take(limit - relatedBlogs.length);

    // Filter out any duplicates
    const newBlogs = recentBlogs.filter(blog =>
      !relatedBlogs.some(rb => rb._id === blog._id)
    );

    relatedBlogs = [...relatedBlogs, ...newBlogs];
  }

  // Take only the required limit
  const finalBlogs = relatedBlogs.slice(0, limit);

  // Get enriched data for each blog
  const enrichedBlogs = await Promise.all(
    finalBlogs.map(async (blog) => {
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
            id: category._id,
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
            id: tag._id,
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

      const formattedCoverImages = coverImages.map(img => ({
        id: img._id,
        imageUrl: img.imageUrl,
        altText: img.altText,
        order: img.order,
      }));

      return {
        id: blog._id,
        title: blog.title,
        slug: blog.slug,
        subtitle: blog.subtitle || null,
        excerpt: blog.excerpt || null,
        readingTime: blog.readingTime || null,
        status: blog.status || 'DRAFT',
        publishedAt: blog.publishedAt ? new Date(blog.publishedAt).toISOString() : null,
        viewCount: blog.viewCount || 0,
        likeCount: blog.likeCount || 0,
        commentCount: blog.commentCount || 0,
        bookmarkCount: blog.bookmarkCount || 0,
        isPinned: blog.isPinned || false,
        isFeatured: blog.isFeatured || false,
        createdAt: blog.createdAt ? new Date(blog.createdAt).toISOString() : new Date().toISOString(),
        updatedAt: blog.updatedAt ? new Date(blog.updatedAt).toISOString() : new Date().toISOString(),
        isLiked: false, // Will be updated below if user is logged in
        isBookmarked: false, // Will be updated below if user is logged in
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
        coverImages: formattedCoverImages,
        categories,
        tags,
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
    const enrichedBlogsWithInteractions = enrichedBlogs.map(blog => ({
      ...blog,
      isLiked: likesMap.has(blog.id) || false,
      isBookmarked: bookmarksMap.has(blog.id) || false,
    }));

    return enrichedBlogsWithInteractions;
  }

  return enrichedBlogs;
};
