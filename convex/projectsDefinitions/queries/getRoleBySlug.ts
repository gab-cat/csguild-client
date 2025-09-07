import { v } from "convex/values";

import { QueryCtx } from "../../_generated/server";

export const getRoleBySlugArgs = {
  slug: v.string(),
};

export const getRoleBySlugHandler = async (
  ctx: QueryCtx,
  args: { slug: string }
) => {
  const role = await ctx.db
    .query("userRoles")
    .withIndex("by_slug", q => q.eq("slug", args.slug))
    .first();

  if (!role) {
    throw new Error("Role not found");
  }

  return {
    id: role._id,
    name: role.name,
    slug: role.slug,
    description: role.description,
    createdAt: role.createdAt || 0,
    updatedAt: role.updatedAt || 0,
  };
};
