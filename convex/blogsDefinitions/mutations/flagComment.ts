import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";

import { Doc, Id } from "../../_generated/dataModel";
import { MutationCtx } from "../../_generated/server";

export const flagCommentArgs = {
  commentId: v.id("blogComments"),
  reason: v.string(),
  description: v.optional(v.string()),
};

export const flagCommentHandler = async (
  ctx: MutationCtx,
  args: {
    commentId: Id<"blogComments">;
    reason: string;
    description?: string;
  }
): Promise<void> => {
  const userId = await getAuthUserId(ctx);
  if (!userId) {
    throw new Error("Unauthorized");
  }

  // Get user info
  const user = await ctx.db.get(userId);
  if (!user) {
    throw new Error("User not found");
  }

  // Check if comment exists
  const comment = await ctx.db.get(args.commentId) as Doc<"blogComments"> | null;
  if (!comment) {
    throw new Error("Comment not found");
  }

  // Check if comment is published
  if (comment.status !== "PUBLISHED") {
    throw new Error("Cannot flag a comment that is not published");
  }

  // Check if user already flagged this comment
  const existingFlag = await ctx.db
    .query("blogCommentFlags")
    .withIndex("by_commentId_userSlug", (q) =>
      q.eq("commentId", args.commentId).eq("userSlug", user.username!)
    )
    .first();

  if (existingFlag) {
    throw new Error("You have already flagged this comment");
  }

  // Create flag record
  await ctx.db.insert("blogCommentFlags", {
    commentId: args.commentId,
    userSlug: user.username!,
    reason: args.reason,
    description: args.description,
    createdAt: Date.now(),
  });

  // Increment flag count
  await ctx.db.patch(args.commentId, {
    flagCount: (comment.flagCount || 0) + 1,
    updatedAt: Date.now(),
  });
};
