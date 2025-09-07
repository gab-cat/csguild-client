import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";

import { Doc, Id } from "../../_generated/dataModel";
import { MutationCtx } from "../../_generated/server";

export const createCommentArgs = {
  blogSlug: v.string(),
  content: v.string(),
  parentId: v.optional(v.id("blogComments")),
};

export const createCommentHandler = async (
  ctx: MutationCtx,
  args: {
    blogSlug: string;
    content: string;
    parentId?: Id<"blogComments">;
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

  // Check if blog exists and allows comments
  const blog = await ctx.db.query("blogs").withIndex("by_slug", (q) => q.eq("slug", args.blogSlug)).first() as Doc<"blogs"> | null;
  if (!blog) {
    throw new Error("Blog not found");
  }

  if (!blog.allowComments) {
    throw new Error("This blog does not allow comments");
  }

  // If replying to a comment, check if parent comment exists and belongs to the same blog
  if (args.parentId) {
    const parentComment = await ctx.db.get(args.parentId);
    if (!parentComment) {
      throw new Error("Parent comment not found");
    }
    if (parentComment.blogId !== blog._id) {
      throw new Error("Parent comment does not belong to this blog");
    }
  }

  const now = Date.now();

  // Create the comment
  const commentId = await ctx.db.insert("blogComments", {
    blogId: blog._id,
    authorSlug: user.username!,
    content: args.content,
    parentId: args.parentId,
    status: "PUBLISHED",
    likeCount: 0,
    flagCount: 0,
    createdAt: now,
    updatedAt: now,
  });

  // Increment comment count on the blog
  await ctx.db.patch(blog._id, {
    commentCount: (blog.commentCount || 0) + 1,
    updatedAt: now,
  });

  return commentId;
};
