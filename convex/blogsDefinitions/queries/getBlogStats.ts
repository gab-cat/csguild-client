import { v } from "convex/values";

import { Id } from "@convex/_generated/dataModel";

import { QueryCtx } from "../../_generated/server";

export const getBlogStatsArgs = {
  blogId: v.id("blogs"),
};

export const getBlogStatsHandler = async (
  ctx: QueryCtx,
  args: {
    blogId: string;
  }
) => {
  // Get the blog
  const blog = await ctx.db.get(args.blogId as Id<"blogs">);
  if (!blog) {
    throw new Error("Blog not found");
  }

  return {
    viewCount: blog.viewCount || 0,
    likeCount: blog.likeCount || 0,
    commentCount: blog.commentCount || 0,
    shareCount: blog.shareCount || 0,
    bookmarkCount: blog.bookmarkCount || 0,
    flagCount: blog.flagCount || 0,
  };
};
