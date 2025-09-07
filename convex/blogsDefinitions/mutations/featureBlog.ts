import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";

import { Doc, Id } from "../../_generated/dataModel";
import { MutationCtx } from "../../_generated/server";

export const featureBlogArgs = {
  blogId: v.id("blogs"),
};

export const featureBlogHandler = async (
  ctx: MutationCtx,
  args: {
    blogId: Id<"blogs">;
  }
): Promise<{
  featured: boolean;
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
  // This should typically only be allowed for admins/moderators
  // For now, allowing the author to feature their own blogs
  // In production, this should check for admin/moderator permissions

  // Check if blog exists
  const blog = await ctx.db.get(args.blogId) as Doc<"blogs"> | null;
  if (!blog) {
    throw new Error("Blog not found");
  }

  // Only allow featuring if user is author or admin
  if (user.username !== blog.authorSlug) {
    throw new Error("You can only feature your own blogs or must be an admin");
  }

  // Toggle featured status
  const newFeaturedStatus = !blog.isFeatured;

  await ctx.db.patch(args.blogId, {
    isFeatured: newFeaturedStatus,
    updatedAt: Date.now(),
  });

  return {
    featured: newFeaturedStatus,
  };
};
