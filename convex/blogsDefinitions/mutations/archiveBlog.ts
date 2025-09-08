import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";

import { Doc, Id } from "../../_generated/dataModel";
import { MutationCtx } from "../../_generated/server";

export const archiveBlogArgs = {
  blogId: v.optional(v.id("blogs")),
  slug: v.optional(v.string()),
  archiveReason: v.optional(v.string()),
};

export const archiveBlogHandler = async (
  ctx: MutationCtx,
  args: {
    blogId?: Id<"blogs">;
    slug?: string;
    archiveReason?: string;
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
  // This should only be allowed for admins/moderators
  // For now, allowing any authenticated user for development

  let blog: Doc<"blogs"> | null = null;

  // Get blog by ID or slug
  if (args.blogId) {
    blog = await ctx.db.get(args.blogId);
  } else if (args.slug) {
    blog = await ctx.db
      .query("blogs")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first() as Doc<"blogs"> | null;
  } else {
    throw new Error("Either blogId or slug must be provided");
  }

  if (!blog) {
    throw new Error("Blog not found");
  }

  // Check if already archived
  if (blog.status === "ARCHIVED") {
    throw new Error("Blog is already archived");
  }

  // Archive the blog
  await ctx.db.patch(blog._id, {
    status: "ARCHIVED",
    moderationStatus: "APPROVED", // Archived blogs are considered approved
    moderatedAt: Date.now(),
    moderatedBy: user.username,
    moderationNotes: args.archiveReason || "Blog archived by administrator",
    updatedAt: Date.now(),
  });

  return null;
};
