import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";

import { Doc, Id } from "../../_generated/dataModel";
import { MutationCtx } from "../../_generated/server";

export const pinBlogArgs = {
  blogId: v.id("blogs"),
};

export const pinBlogHandler = async (
  ctx: MutationCtx,
  args: {
    blogId: Id<"blogs">;
  }
): Promise<{
  pinned: boolean;
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

  // TODO: Add admin/moderator role check here
  // For now, allowing the author to pin their own blogs
  // In production, this should check for admin/moderator permissions

  // Check if blog exists
  const blog = await ctx.db.get(args.blogId) as Doc<"blogs"> | null;
  if (!blog) {
    throw new Error("Blog not found");
  }

  // Only allow pinning if user is author or admin
  const isAdmin = Array.isArray(user.roles) && user.roles.includes("ADMIN");
  const isAuthor = user.username === blog.authorSlug;
  if (!isAdmin && !isAuthor) {
    throw new Error("You can only pin your own blogs or must be an admin");
  }

  // Toggle pin status
  const newPinnedStatus = !blog.isPinned;

  await ctx.db.patch(args.blogId, {
    isPinned: newPinnedStatus,
    updatedAt: Date.now(),
  });

  return {
    pinned: newPinnedStatus,
  };
};
