import { PaginationOptions, paginationOptsValidator } from "convex/server";
import { v } from "convex/values";

import { Id } from "@convex/_generated/dataModel";

import { QueryCtx } from "../../_generated/server";

export const getCommentsForBlogArgs = {
  blogId: v.id("blogs"),
  paginationOpts: paginationOptsValidator,
  includeHidden: v.optional(v.boolean()),
};

export const getCommentsForBlogHandler = async (
  ctx: QueryCtx,
  args: {
    blogId: Id<"blogs">;
    paginationOpts: PaginationOptions;
    includeHidden?: boolean;
  }
) => {
  // Get top-level comments (no parent)
  let comments;
  if (args.includeHidden) {
    comments = await ctx.db
      .query("blogComments")
      .withIndex("by_blogId", (q) => q.eq("blogId", args.blogId as Id<"blogs">))
      .filter((q) => q.eq(q.field("parentId"), undefined))
      .collect();
  } else {
    comments = await ctx.db
      .query("blogComments")
      .withIndex("by_blogId", (q) => q.eq("blogId", args.blogId as Id<"blogs">))
      .filter((q) =>
        q.and(
          q.eq(q.field("parentId"), undefined),
          q.eq(q.field("status"), "PUBLISHED")
        )
      )
      .collect();
  }

  // Sort by creation time (newest first)
  comments.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

  // Get enriched comment data
  const enrichedComments = await Promise.all(
    comments.map(async (comment) => {
      // Get author info
      const author = await ctx.db
        .query("users")
        .withIndex("by_username", (q) => q.eq("username", comment.authorSlug))
        .first();

      // Get replies
      let replies;
      if (args.includeHidden) {
        replies = await ctx.db
          .query("blogComments")
          .withIndex("by_parentId", (q) => q.eq("parentId", comment._id))
          .collect();
      } else {
        replies = await ctx.db
          .query("blogComments")
          .withIndex("by_parentId", (q) => q.eq("parentId", comment._id))
          .filter((q) => q.eq(q.field("status"), "PUBLISHED"))
          .collect();
      }

      // Sort replies by creation time
      replies.sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));

      // Get enriched replies
      const enrichedReplies = await Promise.all(
        replies.map(async (reply) => {
          const replyAuthor = await ctx.db
            .query("users")
            .withIndex("by_username", (q) => q.eq("username", reply.authorSlug))
            .first();

          return {
            _id: reply._id,
            authorSlug: reply.authorSlug,
            content: reply.content,
            status: reply.status,
            likeCount: reply.likeCount,
            createdAt: reply.createdAt,
            author: replyAuthor ? {
              username: replyAuthor.username,
              firstName: replyAuthor.firstName,
              lastName: replyAuthor.lastName,
              imageUrl: replyAuthor.imageUrl,
            } : {
              username: reply.authorSlug,
              firstName: undefined,
              lastName: undefined,
              imageUrl: undefined,
            },
          };
        })
      );

      return {
        _id: comment._id,
        blogId: comment.blogId,
        authorSlug: comment.authorSlug,
        content: comment.content,
        parentId: comment.parentId,
        status: comment.status,
        moderatedAt: comment.moderatedAt,
        moderatedBy: comment.moderatedBy,
        moderationNotes: comment.moderationNotes,
        likeCount: comment.likeCount,
        flagCount: comment.flagCount,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt,
        author: author ? {
          username: author.username,
          firstName: author.firstName,
          lastName: author.lastName,
          imageUrl: author.imageUrl,
        } : {
          username: comment.authorSlug,
          firstName: undefined,
          lastName: undefined,
          imageUrl: undefined,
        },
        replies: enrichedReplies,
      };
    })
  );

  // Apply pagination manually for enriched data
  const start = args.paginationOpts.cursor ? parseInt(args.paginationOpts.cursor) : 0;
  const end = start + args.paginationOpts.numItems;
  const page = enrichedComments.slice(start, end);
  const isDone = end >= enrichedComments.length;
  const continueCursor = isDone ? null : end.toString();

  return {
    page,
    isDone,
    continueCursor,
  };
};
