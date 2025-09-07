import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";

import { Doc, Id } from "../../_generated/dataModel";
import { MutationCtx } from "../../_generated/server";

export const moderateBlogArgs = {
  blogId: v.id("blogs"),
  action: v.union(v.literal("APPROVE"), v.literal("REJECT"), v.literal("FLAG"), v.literal("UNDER_REVIEW")),
  moderationNotes: v.optional(v.string()),
};

export const moderateBlogHandler = async (
  ctx: MutationCtx,
  args: {
    blogId: Id<"blogs">;
    action: "APPROVE" | "REJECT" | "FLAG" | "UNDER_REVIEW";
    moderationNotes?: string;
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

  // Check if blog exists
  const blog = await ctx.db.get(args.blogId) as Doc<"blogs"> | null;
  if (!blog) {
    throw new Error("Blog not found");
  }

  // Determine new moderation status based on action
  let newModerationStatus: "APPROVED" | "REJECTED" | "FLAGGED" | "UNDER_REVIEW";
  switch (args.action) {
  case "APPROVE":
    newModerationStatus = "APPROVED";
    break;
  case "REJECT":
    newModerationStatus = "REJECTED";
    break;
  case "FLAG":
    newModerationStatus = "FLAGGED";
    break;
  case "UNDER_REVIEW":
    newModerationStatus = "UNDER_REVIEW";
    break;
  default:
    throw new Error("Invalid moderation action");
  }

  // Update blog moderation status
  await ctx.db.patch(args.blogId, {
    moderationStatus: newModerationStatus,
    moderatedAt: Date.now(),
    moderatedBy: user.username,
    moderationNotes: args.moderationNotes,
    updatedAt: Date.now(),
  });

  // If approving, also update flags to resolved
  if (args.action === "APPROVE") {
    const flags = await ctx.db
      .query("blogFlags")
      .withIndex("by_blogId", (q) => q.eq("blogId", args.blogId))
      .collect();

    await Promise.all(
      flags.map(flag =>
        ctx.db.patch(flag._id, {
          status: "RESOLVED",
          reviewedAt: Date.now(),
        })
      )
    );
  }

  return null;
};
