import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";

import { MutationCtx } from "../../_generated/server";

export const saveProjectArgs = {
  slug: v.string(),
};

export const saveProjectHandler = async (
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

  // Check if project is already saved
  const existingSave = await ctx.db
    .query("projectSaved")
    .withIndex("by_userSlug_projectSlug", q =>
      q.eq("userSlug", currentUser.username!).eq("projectSlug", args.slug)
    )
    .first();

  if (existingSave) {
    throw new Error("Project is already saved");
  }

  const now = Date.now();

  // Save the project
  await ctx.db.insert("projectSaved", {
    userSlug: currentUser.username,
    projectSlug: args.slug,
    savedAt: now,
  });

  return {
    success: true,
    message: "Project saved successfully",
    projectSlug: args.slug,
    savedAt: now,
  };
};
