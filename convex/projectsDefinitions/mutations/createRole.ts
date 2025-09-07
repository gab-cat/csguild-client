import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";

import { MutationCtx } from "../../_generated/server";

export const createRoleArgs = {
  name: v.string(),
  description: v.optional(v.string()),
};

export const createRoleHandler = async (
  ctx: MutationCtx,
  args: {
    name: string;
    description?: string;
  }
) => {
  const userId = await getAuthUserId(ctx);
  if (!userId) {
    throw new Error("Authentication required");
  }

  const currentUser = await ctx.db.get(userId);
  if (!currentUser) {
    throw new Error("User not found");
  }

  // Check if user has admin role (assuming admin check is needed for role creation)
  if (!currentUser.roles?.includes("ADMIN")) {
    throw new Error("Only administrators can create roles");
  }

  // Generate slug from name
  const slug = args.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  // Check if slug already exists
  const existingRole = await ctx.db
    .query("userRoles")
    .withIndex("by_slug", q => q.eq("slug", slug))
    .first();

  if (existingRole) {
    throw new Error("A role with this name already exists");
  }

  const now = Date.now();

  // Create the role
  const roleId = await ctx.db.insert("userRoles", {
    name: args.name,
    slug,
    description: args.description,
    createdAt: now,
    updatedAt: now,
  });

  // Get the created role
  const role = await ctx.db.get(roleId);
  if (!role) {
    throw new Error("Failed to create role");
  }

  return {
    id: role._id,
    name: role.name,
    slug: role.slug,
    description: role.description,
    createdAt: role.createdAt,
    updatedAt: role.updatedAt,
  };
};
