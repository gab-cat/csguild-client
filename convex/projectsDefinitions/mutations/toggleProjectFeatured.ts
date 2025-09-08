import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";

import { MutationCtx } from "../../_generated/server";

export const toggleProjectFeaturedArgs = {
  slug: v.string(),
  isFeatured: v.boolean(),
};

export const toggleProjectFeaturedHandler = async (
  ctx: MutationCtx,
  args: {
    slug: string;
    isFeatured: boolean;
  }
) => {
  const userId = await getAuthUserId(ctx);
  if (!userId) {
    throw new Error("Authentication required");
  }

  const currentUser = await ctx.db.get(userId);
  if (!currentUser?.username) {
    throw new Error("User not found");
  }

  // Check if user has admin role
  const isAdmin = currentUser.roles?.includes("ADMIN");
  if (!isAdmin) {
    throw new Error("Only administrators can toggle project featured status");
  }

  // Get the project
  const project = await ctx.db
    .query("projects")
    .withIndex("by_slug", q => q.eq("slug", args.slug))
    .first();

  if (!project) {
    throw new Error("Project not found");
  }

  // Update the project's featured status
  await ctx.db.patch(project._id, {
    isFeatured: args.isFeatured,
    updatedAt: Date.now(),
  });

  // Return the updated project
  const updatedProject = await ctx.db.get(project._id);
  if (!updatedProject) {
    throw new Error("Failed to update project");
  }

  return {
    id: updatedProject._id,
    slug: updatedProject.slug,
    title: updatedProject.title,
    description: updatedProject.description,
    isFeatured: updatedProject.isFeatured || false,
    updatedAt: updatedProject.updatedAt,
  };
};
