import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";

import { Doc, Id } from "../../_generated/dataModel";
import { MutationCtx } from "../../_generated/server";

export const shareBlogArgs = {
  blogId: v.id("blogs"),
  platform: v.string(),
};

export const shareBlogHandler = async (
  ctx: MutationCtx,
  args: {
    blogId: Id<"blogs">;
    platform: string;
  }
): Promise<{
  shareCount: number;
}> => {
  // Get user info if authenticated (optional for shares)
  let userSlug: string | null = null;
  try {
    const userId = await getAuthUserId(ctx);
    if (userId) {
      const user = await ctx.db.get(userId);
      userSlug = user?.username || null;
    }
  } catch {
    // User not authenticated, that's ok for shares
  }

  // Check if blog exists and allows shares
  const blog = await ctx.db.get(args.blogId) as Doc<"blogs"> | null;
  if (!blog) {
    throw new Error("Blog not found");
  }

  if (!blog.allowShares) {
    throw new Error("This blog does not allow shares");
  }

  // Record the share
  await ctx.db.insert("blogShares", {
    blogId: args.blogId,
    userSlug: userSlug!,
    platform: args.platform,
    sharedAt: Date.now(),
  });

  // Increment share count
  const newShareCount = (blog.shareCount || 0) + 1;
  await ctx.db.patch(args.blogId, {
    shareCount: newShareCount,
    updatedAt: Date.now(),
  });

  return {
    shareCount: newShareCount,
  };
};
