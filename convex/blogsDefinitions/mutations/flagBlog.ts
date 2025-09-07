import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";

import { Doc, Id } from "../../_generated/dataModel";
import { MutationCtx } from "../../_generated/server";

export const flagBlogArgs = {
  blogId: v.id("blogs"),
  reason: v.union(v.literal("SPAM"), v.literal("HARASSMENT"), v.literal("HATE_SPEECH"), v.literal("INAPPROPRIATE_CONTENT"), v.literal("COPYRIGHT_VIOLATION"), v.literal("MISINFORMATION"), v.literal("VIOLENCE"), v.literal("ADULT_CONTENT"), v.literal("OTHER")),
  description: v.optional(v.string()),
};

export const flagBlogHandler = async (
  ctx: MutationCtx,
  args: {
    blogId: Id<"blogs">;
    reason: "SPAM" | "HARASSMENT" | "HATE_SPEECH" | "INAPPROPRIATE_CONTENT" | "COPYRIGHT_VIOLATION" | "MISINFORMATION" | "VIOLENCE" | "ADULT_CONTENT" | "OTHER";
    description?: string;
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

  // Check if blog exists
  const blog = await ctx.db.get(args.blogId) as Doc<"blogs"> | null;
  if (!blog) {
    throw new Error("Blog not found");
  }

  // Check if user already flagged this blog
  const existingFlag = await ctx.db
    .query("blogFlags")
    .withIndex("by_blogId_userSlug", (q) =>
      q.eq("blogId", args.blogId).eq("userSlug", user.username!)
    )
    .first();

  if (existingFlag) {
    throw new Error("You have already flagged this blog");
  }

  // Create the flag
  await ctx.db.insert("blogFlags", {
    blogId: args.blogId,
    userSlug: user.username!,
    reason: args.reason,
    description: args.description,
    status: "PENDING",
    reviewedAt: undefined,
  });

  // Increment flag count on the blog
  await ctx.db.patch(args.blogId, {
    flagCount: (blog.flagCount || 0) + 1,
    updatedAt: Date.now(),
  });

  // If flag count exceeds threshold, update moderation status
  const newFlagCount = (blog.flagCount || 0) + 1;
  if (newFlagCount >= 5 && blog.moderationStatus === "PENDING") {
    await ctx.db.patch(args.blogId, {
      moderationStatus: "FLAGGED",
    });
  }

  return null;
};
