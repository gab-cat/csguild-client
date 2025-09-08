import { v } from "convex/values";

import { Id } from "../../_generated/dataModel";
import { QueryCtx } from "../../_generated/server";

export const getUserBlogInteractionArgs = {
  blogId: v.id("blogs"),
  userSlug: v.optional(v.string()),
};

export const getUserBlogInteractionHandler = async (
  ctx: QueryCtx,
  args: {
    blogId: Id<"blogs">;
    userSlug?: string;
  }
) => {
  // If no user slug provided, user is not logged in
  if (!args.userSlug) {
    return {
      isLiked: false,
      isBookmarked: false,
    };
  }

  // Check if user has liked this blog
  const like = await ctx.db
    .query("blogLikes")
    .withIndex("by_blogId_userSlug", (q) =>
      q.eq("blogId", args.blogId).eq("userSlug", args.userSlug!)
    )
    .first();

  // Check if user has bookmarked this blog
  const bookmark = await ctx.db
    .query("blogBookmarks")
    .withIndex("by_blogId_userSlug", (q) =>
      q.eq("blogId", args.blogId).eq("userSlug", args.userSlug!)
    )
    .first();

  return {
    isLiked: !!like,
    isBookmarked: !!bookmark,
  };
};
