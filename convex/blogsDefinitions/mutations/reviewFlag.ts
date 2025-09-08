import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";

import { Id } from "../../_generated/dataModel";
import { MutationCtx } from "../../_generated/server";

export const reviewFlagArgs = {
  flagId: v.id("blogFlags"),
  action: v.union(v.literal("RESOLVE"), v.literal("DISMISS")),
  notes: v.optional(v.string()),
};

export const reviewFlagHandler = async (
  ctx: MutationCtx,
  args: {
    flagId: Id<"blogFlags">;
    action: "RESOLVE" | "DISMISS";
    notes?: string;
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

  // Get the flag
  const flag = await ctx.db.get(args.flagId);
  if (!flag) {
    throw new Error("Flag not found");
  }

  // Check if flag is already reviewed
  if (flag.status && flag.status !== "PENDING") {
    throw new Error("Flag has already been reviewed");
  }

  // Update flag status
  const newStatus = args.action === "RESOLVE" ? "RESOLVED" : "DISMISSED";
  await ctx.db.patch(args.flagId, {
    status: newStatus,
    reviewedAt: Date.now(),
    reviewedBy: user.username,
  });

  // If resolving the flag, update the blog's moderation status
  if (args.action === "RESOLVE") {
    const blog = await ctx.db.get(flag.blogId);
    if (blog) {
      // Set blog to flagged status if not already moderated
      if (blog.moderationStatus === "PENDING" || !blog.moderationStatus) {
        await ctx.db.patch(flag.blogId, {
          moderationStatus: "FLAGGED",
          moderatedAt: Date.now(),
          moderatedBy: user.username,
          moderationNotes: args.notes || `Flag resolved: ${flag.reason}`,
          updatedAt: Date.now(),
        });
      }
    }
  }

  return null;
};
