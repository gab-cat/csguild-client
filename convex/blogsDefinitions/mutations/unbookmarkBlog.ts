import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";

import { Doc, Id } from "../../_generated/dataModel";
import { MutationCtx } from "../../_generated/server";

export const unbookmarkBlogArgs = {
  slug: v.string(),
};

export const unbookmarkBlogHandler = async (
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

  // Check if user has bookmarked this blog
  const existingBookmark = await ctx.db
    .query("blogBookmarks")
    .withIndex("by_blogId_userSlug", (q) =>
      q.eq("blogId", blog._id).eq("userSlug", user.username!)
    )
    .first();

  if (!existingBookmark) {
    // User hasn't bookmarked, return current state
    return {
      bookmarked: false,
      bookmarkCount: blog.bookmarkCount || 0,
    };
  }

  // Remove the bookmark
  await ctx.db.delete(existingBookmark._id);

  // Decrement bookmark count
  const newBookmarkCount = (blog.bookmarkCount || 0) - 1;
  await ctx.db.patch(blog._id, {
    bookmarkCount: newBookmarkCount,
    updatedAt: Date.now(),
  });

  return {
    bookmarked: false,
    bookmarkCount: newBookmarkCount,
  };
};
