import { v } from "convex/values";

import { QueryCtx } from "../../_generated/server";

export const getTagsArgs = {
  includeUnofficial: v.optional(v.boolean()),
};

export const getTagsHandler = async (
  ctx: QueryCtx,
  args: {
    includeUnofficial?: boolean;
  }
) => {
  // Get all tags
  let tags;
  if (args.includeUnofficial) {
    tags = await ctx.db.query("blogTags").collect();
  } else {
    tags = await ctx.db
      .query("blogTags")
      .withIndex("by_isOfficial", (q) => q.eq("isOfficial", true))
      .collect();
  }

  // Sort by blog count (most used first), then by name
  tags.sort((a, b) => {
    const aCount = a.blogCount || 0;
    const bCount = b.blogCount || 0;
    if (aCount !== bCount) {
      return bCount - aCount; // Descending order by count
    }
    return a.name.localeCompare(b.name);
  });

  return tags.map(tag => ({
    _id: tag._id,
    name: tag.name,
    slug: tag.slug,
    description: tag.description,
    color: tag.color,
    isOfficial: tag.isOfficial,
    blogCount: tag.blogCount,
    createdAt: tag.createdAt,
    updatedAt: tag.updatedAt,
  }));
};
