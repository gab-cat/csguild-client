import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";

import { Doc } from "../../_generated/dataModel";
import { MutationCtx } from "../../_generated/server";

export const deleteBlogArgs = {
  slug: v.string(),
};

export const deleteBlogHandler = async (
  ctx: MutationCtx,
  args: {
    slug: string;
  }
) => {
  const userId = await getAuthUserId(ctx);
  if (!userId) {
    throw new Error("Unauthorized");
  }

  // Get the blog by slug
  const blog = await ctx.db
    .query("blogs")
    .withIndex("by_slug", (q) => q.eq("slug", args.slug))
    .first() as Doc<"blogs"> | null;

  if (!blog) {
    throw new Error("Blog not found");
  }

  // Check if user is the author (or admin - we'll add admin check later)
  const user = await ctx.db.get(userId);
  if (!user || user.username !== blog.authorSlug) {
    throw new Error("You can only delete your own blogs");
  }

  // Soft delete by updating status to DELETED instead of actually deleting
  await ctx.db.patch(blog._id, {
    status: "DELETED",
    updatedAt: Date.now(),
  });

  // Note: We're not deleting related data (comments, likes, bookmarks, etc.)
  // to maintain data integrity and allow for potential recovery
  // The frontend should filter out DELETED blogs

  return null;
};
