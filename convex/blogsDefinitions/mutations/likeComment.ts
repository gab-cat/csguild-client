import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";

import { Doc, Id } from "../../_generated/dataModel";
import { MutationCtx } from "../../_generated/server";

export const likeCommentArgs = {
  commentId: v.id("blogComments"),
};

export const likeCommentHandler = async (
  ctx: MutationCtx,
  args: {
    commentId: Id<"blogComments">;
  }
): Promise<{
  liked: boolean;
  likeCount: number;
}> => {
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
    throw new Error("Cannot like a comment that is not published");
  }

  // Check if user already liked this comment
  const existingLike = await ctx.db
    .query("blogCommentLikes")
    .withIndex("by_commentId_userSlug", (q) =>
      q.eq("commentId", args.commentId).eq("userSlug", user.username!)
    )
    .first();

  if (existingLike) {
    // User already liked, so unlike
    await ctx.db.delete(existingLike._id);

    // Decrement like count
    await ctx.db.patch(args.commentId, {
      likeCount: (comment.likeCount || 0) - 1,
      updatedAt: Date.now(),
    });

    return {
      liked: false,
      likeCount: (comment.likeCount || 0) - 1,
    };
  } else {
    // User hasn't liked, so like
    await ctx.db.insert("blogCommentLikes", {
      commentId: args.commentId,
      userSlug: user.username!,
      createdAt: Date.now(),
    });

    // Increment like count
    await ctx.db.patch(args.commentId, {
      likeCount: (comment.likeCount || 0) + 1,
      updatedAt: Date.now(),
    });

    return {
      liked: true,
      likeCount: (comment.likeCount || 0) + 1,
    };
  }
};
