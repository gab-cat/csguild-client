import { v } from "convex/values";

import { QueryCtx } from "../../_generated/server";

export const getCategoriesArgs = {
  includeInactive: v.optional(v.boolean()),
};

export const getCategoriesHandler = async (
  ctx: QueryCtx,
  args: {
    includeInactive?: boolean;
  }
) => {
  // Get all categories
  let categories;
  if (args.includeInactive) {
    categories = await ctx.db.query("blogCategories").collect();
  } else {
    categories = await ctx.db
      .query("blogCategories")
      .withIndex("by_isActive", (q) => q.eq("isActive", true))
      .collect();
  }

  // Sort by order, then by name
  categories.sort((a, b) => {
    if (a.order !== undefined && b.order !== undefined) {
      return a.order - b.order;
    }
    if (a.order !== undefined) return -1;
    if (b.order !== undefined) return 1;
    return a.name.localeCompare(b.name);
  });

  // Get enriched category data with parent info
  const enrichedCategories = await Promise.all(
    categories.map(async (category) => {
      let parent = null;
      if (category.parentId) {
        parent = await ctx.db.get(category.parentId);
        if (parent) {
          parent = {
            _id: parent._id,
            name: parent.name,
            slug: parent.slug,
          };
        }
      }

      return {
        _id: category._id,
        name: category.name,
        slug: category.slug,
        description: category.description,
        color: category.color,
        icon: category.icon,
        parentId: category.parentId,
        blogCount: category.blogCount,
        order: category.order,
        isActive: category.isActive,
        createdAt: category.createdAt,
        updatedAt: category.updatedAt,
        parent,
      };
    })
  );

  return enrichedCategories;
};
