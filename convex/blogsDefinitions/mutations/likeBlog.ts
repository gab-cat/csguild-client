import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";

import { MutationCtx } from "../../_generated/server";

export const likeBlogArgs = {
  slug: v.string(),
};

export const likeBlogHandler = async (
  ctx: MutationCtx,
  args: {
    slug: string;
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

  // Get blog by slug
  const blog = await ctx.db
    .query("blogs")
    .withIndex("by_slug", (q) => q.eq("slug", args.slug))
    .first();

  if (!blog) {
    throw new Error("Blog not found");
  }

  if (!blog.allowLikes) {
    throw new Error("This blog does not allow likes");
  }

  // Check if user already liked this blog
  const existingLike = await ctx.db
    .query("blogLikes")
    .withIndex("by_blogId_userSlug", (q) =>
      q.eq("blogId", blog._id).eq("userSlug", user.username!)
    )
    .first();

  const now = Date.now();

  if (existingLike) {
    // User already liked, so unlike
    await ctx.db.delete(existingLike._id);

    // Decrement like count and update timestamp to trigger reactivity
    await ctx.db.patch(blog._id, {
      likeCount: (blog.likeCount || 0) - 1,
      updatedAt: now,
    });

    return {
      liked: false,
      likeCount: (blog.likeCount || 0) - 1,
    };
  } else {
    // User hasn't liked, so like
    await ctx.db.insert("blogLikes", {
      blogId: blog._id,
      userSlug: user.username!,
      createdAt: now,
    });

    // Increment like count and update timestamp to trigger reactivity
    await ctx.db.patch(blog._id, {
      likeCount: (blog.likeCount || 0) + 1,
      updatedAt: now,
    });

    return {
      liked: true,
      likeCount: (blog.likeCount || 0) + 1,
    };
  }
};
