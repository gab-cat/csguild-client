import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";

import { Doc, Id } from "../../_generated/dataModel";
import { MutationCtx } from "../../_generated/server";

export const unpublishBlogArgs = {
  blogId: v.id("blogs"),
};

export const unpublishBlogHandler = async (
  ctx: MutationCtx,
  args: {
    blogId: Id<"blogs">;
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
  // For now, allowing the author to unpublish their own blogs
  // In production, this should check for admin/moderator permissions

  // Get the blog by id
  const blog = await ctx.db.get(args.blogId) as Doc<"blogs"> | null;

  if (!blog) {
    throw new Error("Blog not found");
  }

  // Only allow unpublishing if user is author or admin
  if (user.username !== blog.authorSlug) {
    throw new Error("You can only unpublish your own blogs or must be an admin");
  }

  // Update blog status to DRAFT and remove publishedAt
  await ctx.db.patch(blog._id, {
    status: "DRAFT",
    publishedAt: undefined,
    updatedAt: Date.now(),
  });

  return null;
};
