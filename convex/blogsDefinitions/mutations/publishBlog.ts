import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";

import { Doc } from "../../_generated/dataModel";
import { MutationCtx } from "../../_generated/server";

export const publishBlogArgs = {
  slug: v.string(),
};

export const publishBlogHandler = async (
  ctx: MutationCtx,
  args: {
    slug: string;
  }
) => {
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
  // For now, allowing the author to publish their own blogs
  // In production, this should check for admin/moderator permissions

  // Get the blog by slug
  const blog = await ctx.db
    .query("blogs")
    .withIndex("by_slug", (q) => q.eq("slug", args.slug))
    .first() as Doc<"blogs"> | null;

  if (!blog) {
    throw new Error("Blog not found");
  }

  // Only allow publishing if user is author or admin
  if (user.username !== blog.authorSlug) {
    throw new Error("You can only publish your own blogs or must be an admin");
  }

  // Update blog status to PUBLISHED
  await ctx.db.patch(blog._id, {
    status: "PUBLISHED",
    publishedAt: Date.now(),
    updatedAt: Date.now(),
  });

  return null;
};
