import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";

import { Doc, Id } from "../../_generated/dataModel";
import { MutationCtx } from "../../_generated/server";

export const deleteCommentArgs = {
  commentId: v.id("blogComments"),
};

export const deleteCommentHandler = async (
  ctx: MutationCtx,
  args: {
    commentId: Id<"blogComments">;
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

  // Check if user is the author of the comment
  if (comment.authorSlug !== user.username) {
    throw new Error("You can only delete your own comments");
  }

  // Soft delete by marking as deleted
  await ctx.db.patch(args.commentId, {
    status: "DELETED",
    updatedAt: Date.now(),
  });
};
