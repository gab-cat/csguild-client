import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";

import { MutationCtx } from "../../_generated/server";

export const unsaveProjectArgs = {
  slug: v.string(),
};

export const unsaveProjectHandler = async (
  ctx: MutationCtx,
  args: { slug: string }
) => {
  const userId = await getAuthUserId(ctx);
  if (!userId) {
    throw new Error("Authentication required");
  }

  const currentUser = await ctx.db.get(userId);
  if (!currentUser?.username) {
    throw new Error("User not found");
  }

  // Check if project exists
  const project = await ctx.db
    .query("projects")
    .withIndex("by_slug", q => q.eq("slug", args.slug))
    .first();

  if (!project) {
    throw new Error("Project not found");
  }

  // Find the saved project entry
  const savedProject = await ctx.db
    .query("projectSaved")
    .withIndex("by_userSlug_projectSlug", q =>
      q.eq("userSlug", currentUser.username!).eq("projectSlug", args.slug)
    )
    .first();

  if (!savedProject) {
    throw new Error("Project is not saved");
  }

  // Remove the saved project
  await ctx.db.delete(savedProject._id);

  return {
    success: true,
    message: "Project unsaved successfully",
    projectSlug: args.slug,
  };
};
