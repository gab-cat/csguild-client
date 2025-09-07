import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";

import { MutationCtx } from "../../_generated/server";

export const bookmarkBlogArgs = {
  slug: v.string(),
};

export const bookmarkBlogHandler = async (
  ctx: MutationCtx,
  args: {
    slug: string;
  }
): Promise<{
  bookmarked: boolean;
  bookmarkCount: number;
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

  if (!blog.allowBookmarks) {
    throw new Error("This blog does not allow bookmarks");
  }

  // Check if user already bookmarked this blog
  const existingBookmark = await ctx.db
    .query("blogBookmarks")
    .withIndex("by_blogId_userSlug", (q) =>
      q.eq("blogId", blog._id).eq("userSlug", user.username!)
    )
    .first();

  const now = Date.now();

  if (existingBookmark) {
    // User already bookmarked, so remove bookmark
    await ctx.db.delete(existingBookmark._id);

    // Decrement bookmark count and update timestamp to trigger reactivity
    await ctx.db.patch(blog._id, {
      bookmarkCount: (blog.bookmarkCount || 0) - 1,
      updatedAt: now,
    });

    return {
      bookmarked: false,
      bookmarkCount: (blog.bookmarkCount || 0) - 1,
    };
  } else {
    // User hasn't bookmarked, so bookmark
    await ctx.db.insert("blogBookmarks", {
      blogId: blog._id,
      userSlug: user.username!,
      createdAt: now,
    });

    // Increment bookmark count and update timestamp to trigger reactivity
    await ctx.db.patch(blog._id, {
      bookmarkCount: (blog.bookmarkCount || 0) + 1,
      updatedAt: now,
    });

    return {
      bookmarked: true,
      bookmarkCount: (blog.bookmarkCount || 0) + 1,
    };
  }
};
