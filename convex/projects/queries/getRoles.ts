import { v } from "convex/values";

import { QueryCtx } from "../../_generated/server";

export const getRolesArgs = {
  search: v.optional(v.string()),
  page: v.optional(v.number()),
  limit: v.optional(v.number()),
  sortBy: v.optional(v.union(v.literal("createdAt"), v.literal("updatedAt"), v.literal("name"), v.literal("slug"))),
  sortOrder: v.optional(v.union(v.literal("asc"), v.literal("desc"))),
};

export const getRolesHandler = async (
  ctx: QueryCtx,
  args: {
    search?: string;
    page?: number;
    limit?: number;
    sortBy?: "createdAt" | "updatedAt" | "name" | "slug";
    sortOrder?: "asc" | "desc";
  }
) => {
  const limit = args.limit || 10;
  const page = args.page || 1;
  const offset = (page - 1) * limit;

  let roles = await ctx.db.query("userRoles").collect();

  // Apply search filter
  if (args.search) {
    const searchLower = args.search.toLowerCase();
    roles = roles.filter(role => 
      role.name.toLowerCase().includes(searchLower) ||
      role.slug.toLowerCase().includes(searchLower) ||
      (role.description && role.description.toLowerCase().includes(searchLower))
    );
  }

  // Sort roles
  const sortBy = args.sortBy || "name";
  const sortOrder = args.sortOrder || "asc";
  
  roles.sort((a, b) => {
    let aValue: string | number | undefined;
    let bValue: string | number | undefined;
    
    if (sortBy === "name") {
      aValue = a.name?.toLowerCase() || "";
      bValue = b.name?.toLowerCase() || "";
    } else if (sortBy === "slug") {
      aValue = a.slug?.toLowerCase() || "";
      bValue = b.slug?.toLowerCase() || "";
    } else if (sortBy === "createdAt") {
      aValue = a.createdAt || 0;
      bValue = b.createdAt || 0;
    } else if (sortBy === "updatedAt") {
      aValue = a.updatedAt || 0;
      bValue = b.updatedAt || 0;
    } else {
      aValue = 0;
      bValue = 0;
    }
    
    if (aValue === undefined) aValue = 0;
    if (bValue === undefined) bValue = 0;
    
    if (sortOrder === "asc") {
      return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
    } else {
      return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
    }
  });

  // Apply pagination
  const total = roles.length;
  const paginatedRoles = roles.slice(offset, offset + limit);

  // Transform to match API response format
  const formattedRoles = paginatedRoles.map(role => ({
    id: role._id,
    name: role.name,
    slug: role.slug,
    description: role.description,
    createdAt: role.createdAt,
    updatedAt: role.updatedAt,
  }));

  const totalPages = Math.ceil(total / limit);

  return {
    data: formattedRoles,
    meta: {
      total,
      page,
      limit,
      totalPages,
    },
  };
};
