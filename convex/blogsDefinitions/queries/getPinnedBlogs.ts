import { PaginationOptions, paginationOptsValidator } from "convex/server";

import { QueryCtx } from "../../_generated/server";

export const getPinnedBlogsArgs = {
  paginationOpts: paginationOptsValidator,
};

export const getPinnedBlogsHandler = async (
  ctx: QueryCtx,
  args: {
    paginationOpts: PaginationOptions;
  }
) => {
  // Get pinned blogs using the by_isPinned index
  const blogs = await ctx.db
    .query("blogs")
    .withIndex("by_isPinned", (q) => q.eq("isPinned", true))
    .collect();

  // Get enriched data for each blog
  const enrichedBlogs = await Promise.all(
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
