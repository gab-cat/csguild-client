import { v } from "convex/values";

import { Id } from "../../_generated/dataModel";
import { QueryCtx } from "../../_generated/server";

export const getCommentRepliesArgs = {
  parentCommentId: v.id("blogComments"),
};

export const getCommentRepliesHandler = async (
  ctx: QueryCtx,
  args: {
    parentCommentId: Id<"blogComments">;
  }
) => {
  // Get replies for the parent comment
  const replies = await ctx.db
    .query("blogComments")
    .withIndex("by_parentId", (q) => q.eq("parentId", args.parentCommentId))
    .filter((q) => q.eq(q.field("status"), "PUBLISHED"))
    .collect();

  // Sort replies by creation time (oldest first for replies)
  replies.sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));

  // Get enriched reply data
  const enrichedReplies = await Promise.all(
    replies.map(async (reply) => {
      // Get author info
      const author = await ctx.db
        .query("users")
        .withIndex("by_username", (q) => q.eq("username", reply.authorSlug))
        .first();

      return {
        _id: reply._id,
        blogId: reply.blogId,
        authorSlug: reply.authorSlug,
        content: reply.content,
        parentId: reply.parentId,
        status: reply.status,
        likeCount: reply.likeCount,
        flagCount: reply.flagCount,
        createdAt: reply.createdAt,
        updatedAt: reply.updatedAt,
        author: author ? {
          username: author.username,
          firstName: author.firstName,
          lastName: author.lastName,
          imageUrl: author.imageUrl,
        } : {
          username: reply.authorSlug,
          firstName: undefined,
          lastName: undefined,
          imageUrl: undefined,
        },
      };
    })
  );

  return enrichedReplies;
};
