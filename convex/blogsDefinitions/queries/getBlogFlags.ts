import { PaginationOptions, paginationOptsValidator } from "convex/server";
import { v } from "convex/values";

import { QueryCtx } from "../../_generated/server";

export const getBlogFlagsArgs = {
  paginationOpts: paginationOptsValidator,
  status: v.optional(v.union(v.literal("PENDING"), v.literal("REVIEWED"), v.literal("RESOLVED"), v.literal("DISMISSED"))),
  blogId: v.optional(v.id("blogs")),
  reason: v.optional(v.union(v.literal("SPAM"), v.literal("HARASSMENT"), v.literal("HATE_SPEECH"), v.literal("INAPPROPRIATE_CONTENT"), v.literal("COPYRIGHT_VIOLATION"), v.literal("MISINFORMATION"), v.literal("VIOLENCE"), v.literal("ADULT_CONTENT"), v.literal("OTHER"))),
};

export const getBlogFlagsHandler = async (
  ctx: QueryCtx,
  args: {
    paginationOpts: PaginationOptions;
    status?: "PENDING" | "REVIEWED" | "RESOLVED" | "DISMISSED";
    blogId?: string;
    reason?: "SPAM" | "HARASSMENT" | "HATE_SPEECH" | "INAPPROPRIATE_CONTENT" | "COPYRIGHT_VIOLATION" | "MISINFORMATION" | "VIOLENCE" | "ADULT_CONTENT" | "OTHER";
  }
) => {
  // Start with appropriate index based on filters
  let flagsQuery = ctx.db.query("blogFlags");

  if (args.blogId) {
    flagsQuery = flagsQuery.withIndex("by_blogId", (q) => q.eq("blogId", args.blogId));
  } else if (args.status) {
    flagsQuery = flagsQuery.withIndex("by_status", (q) => q.eq("status", args.status));
  } else {
    // No specific index for general queries - will do table scan
    // This is acceptable since we're applying manual sorting and pagination
  }

  let flags = await flagsQuery.collect();

  // Apply additional filters
  if (args.status && !args.blogId) {
    flags = flags.filter(flag => flag.status === args.status);
  }
  
  if (args.reason) {
    flags = flags.filter(flag => flag.reason === args.reason);
  }

  // Sort by creation time (newest first)
  flags.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

  // Get enriched data for each flag
  const enrichedFlags = await Promise.all(
    flags.map(async (flag) => {
      // Get the flagged blog
      const blog = await ctx.db.get(flag.blogId);
      
      // Get the user who flagged (if available)
      const flaggedByUser = await ctx.db
        .query("users")
        .withIndex("by_username", (q) => q.eq("username", flag.userSlug))
        .first();

      // Get the blog author
      let blogAuthor = null;
      if (blog) {
        blogAuthor = await ctx.db
          .query("users")
          .withIndex("by_username", (q) => q.eq("username", blog.authorSlug))
          .first();
      }

      return {
        _id: flag._id,
        blogId: flag.blogId,
        userSlug: flag.userSlug,
        reason: flag.reason,
        description: flag.description,
        status: flag.status || "PENDING",
        reviewedAt: flag.reviewedAt,
        reviewedBy: flag.reviewedBy,
        createdAt: flag.createdAt,
        blog: blog ? {
          title: blog.title,
          slug: blog.slug,
          status: blog.status,
          moderationStatus: blog.moderationStatus,
          authorSlug: blog.authorSlug,
          flagCount: blog.flagCount,
        } : null,
        flaggedBy: flaggedByUser ? {
          username: flaggedByUser.username,
          firstName: flaggedByUser.firstName,
          lastName: flaggedByUser.lastName,
          imageUrl: flaggedByUser.imageUrl,
        } : {
          username: flag.userSlug,
          firstName: undefined,
          lastName: undefined,
          imageUrl: undefined,
        },
        author: blogAuthor ? {
          username: blogAuthor.username,
          firstName: blogAuthor.firstName,
          lastName: blogAuthor.lastName,
          imageUrl: blogAuthor.imageUrl,
        } : null,
      };
    })
  );

  // Apply pagination manually for enriched data
  const start = args.paginationOpts.cursor ? parseInt(args.paginationOpts.cursor) : 0;
  const end = start + args.paginationOpts.numItems;
  const page = enrichedFlags.slice(start, end);
  const isDone = end >= enrichedFlags.length;
  const continueCursor = isDone ? null : end.toString();

  return {
    page,
    isDone,
    continueCursor,
  };
};
