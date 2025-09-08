import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";

import { Doc, Id } from "../../_generated/dataModel";
import { MutationCtx } from "../../_generated/server";

export const updateBlogArgs = {
  slug: v.string(),
  title: v.optional(v.string()),
  newSlug: v.optional(v.string()),
  subtitle: v.optional(v.string()),
  content: v.optional(v.string()),
  excerpt: v.optional(v.string()),
  metaDescription: v.optional(v.string()),
  metaKeywords: v.optional(v.array(v.string())),
  canonicalUrl: v.optional(v.string()),
  categories: v.optional(v.array(v.string())), // Category names
  tags: v.optional(v.array(v.string())), // Tag names
  status: v.optional(v.union(v.literal("DRAFT"), v.literal("PUBLISHED"), v.literal("PENDING"), v.literal("ARCHIVED"), v.literal("DELETED"))),
  scheduledFor: v.optional(v.number()),
  allowComments: v.optional(v.boolean()),
  allowBookmarks: v.optional(v.boolean()),
  allowLikes: v.optional(v.boolean()),
  allowShares: v.optional(v.boolean()),
};

// Helper function to resolve tag names to tag IDs, creating tags if they don't exist
const resolveTagNamesToIds = async (ctx: MutationCtx, tagNames: string[]): Promise<Id<"blogTags">[]> => {
  const tagIds: Id<"blogTags">[] = [];

  for (const tagName of tagNames) {
    const trimmedName = tagName.trim();
    if (!trimmedName) continue;

    // Generate slug from tag name
    const slug = trimmedName
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    // Check if tag already exists
    const existingTag = await ctx.db
      .query("blogTags")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .first();

    if (!existingTag) {
      // Create new tag
      const now = Date.now();
      const tagId = await ctx.db.insert("blogTags", {
        name: trimmedName,
        slug,
        isOfficial: false,
        blogCount: 0,
        createdAt: now,
        updatedAt: now,
      });
      tagIds.push(tagId as Id<"blogTags">);
    } else {
      tagIds.push(existingTag._id);
    }
  }

  return tagIds;
};

// Helper function to resolve category names to category IDs, creating categories if they don't exist
const resolveCategoryNamesToIds = async (ctx: MutationCtx, categoryNames: string[]): Promise<Id<"blogCategories">[]> => {
  const categoryIds: Id<"blogCategories">[] = [];

  for (const categoryName of categoryNames) {
    const trimmedName = categoryName.trim();
    if (!trimmedName) continue;

    // Generate slug from category name
    const slug = trimmedName
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    // Check if category already exists
    const existingCategory = await ctx.db
      .query("blogCategories")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .first();

    if (!existingCategory) {
      // Create new category
      const now = Date.now();
      const categoryId = await ctx.db.insert("blogCategories", {
        name: trimmedName,
        slug,
        isActive: true,
        blogCount: 0,
        order: 0,
        createdAt: now,
        updatedAt: now,
      });
      categoryIds.push(categoryId as Id<"blogCategories">);
    } else {
      categoryIds.push(existingCategory._id);
    }
  }

  return categoryIds;
};

export const updateBlogHandler = async (
  ctx: MutationCtx,
  args: {
    slug: string;
    title?: string;
    newSlug?: string;
    subtitle?: string;
    content?: string;
    excerpt?: string;
    metaDescription?: string;
    metaKeywords?: string[];
    canonicalUrl?: string;
    categories?: string[]; // Category names
    tags?: string[]; // Tag names
    status?: "DRAFT" | "PUBLISHED" | "PENDING" | "ARCHIVED" | "DELETED";
    scheduledFor?: number;
    allowComments?: boolean;
    allowBookmarks?: boolean;
    allowLikes?: boolean;
    allowShares?: boolean;
  }
) => {
  const userId = await getAuthUserId(ctx);
  if (!userId) {
    throw new Error("Unauthorized");
  }

  // Get the blog by slug
  const blog = await ctx.db
    .query("blogs")
    .withIndex("by_slug", (q) => q.eq("slug", args.slug))
    .first() as Doc<"blogs"> | null;

  if (!blog) {
    throw new Error("Blog not found");
  }

  // Check if user is the author
  const user = await ctx.db.get(userId);
  if (!user || user.username !== blog.authorSlug) {
    throw new Error("You can only update your own blogs");
  }

  // Check if new slug is unique (if slug is being changed)
  if (args.newSlug && args.newSlug !== blog.slug) {
    const existingBlog = await ctx.db
      .query("blogs")
      .withIndex("by_slug", (q) => q.eq("slug", args.newSlug!))
      .first();

    if (existingBlog) {
      throw new Error("Blog with this slug already exists");
    }
  }

  const now = Date.now();
  const updates: Record<string, string | number | boolean | undefined | string[]> = {
    lastEditedAt: now,
    updatedAt: now,
  };

  // Add provided fields to updates
  if (args.title !== undefined) updates.title = args.title;
  if (args.newSlug !== undefined) updates.slug = args.newSlug;
  if (args.subtitle !== undefined) updates.subtitle = args.subtitle;
  if (args.content !== undefined) {
    updates.content = args.content;
    // Recalculate word count and reading time if content changed
    updates.wordCount = args.content.split(/\s+/).length;
    updates.readingTime = Math.ceil(updates.wordCount / 200);
  }
  if (args.excerpt !== undefined) updates.excerpt = args.excerpt;
  if (args.metaDescription !== undefined) updates.metaDescription = args.metaDescription;
  if (args.metaKeywords !== undefined) updates.metaKeywords = args.metaKeywords;
  if (args.canonicalUrl !== undefined) updates.canonicalUrl = args.canonicalUrl;
  if (args.status !== undefined) {
    updates.status = args.status;
    // Set publishedAt if status is changing to PUBLISHED
    if (args.status === "PUBLISHED" && blog.status !== "PUBLISHED") {
      updates.publishedAt = now;
    }
  }
  if (args.scheduledFor !== undefined) updates.scheduledFor = args.scheduledFor;
  if (args.allowComments !== undefined) updates.allowComments = args.allowComments;
  if (args.allowBookmarks !== undefined) updates.allowBookmarks = args.allowBookmarks;
  if (args.allowLikes !== undefined) updates.allowLikes = args.allowLikes;
  if (args.allowShares !== undefined) updates.allowShares = args.allowShares;

  // Update the blog
  await ctx.db.patch(blog._id, updates);

  // Update categories if provided
  if (args.categories !== undefined) {
    // Remove existing category relations
    const existingCategoryRelations = await ctx.db
      .query("blogCategoryRelations")
      .withIndex("by_blogId", (q) => q.eq("blogId", blog._id))
      .collect();

    await Promise.all(
      existingCategoryRelations.map(rel => ctx.db.delete(rel._id))
    );

    // Resolve category names to IDs and create new category relations
    if (args.categories.length > 0) {
      const categoryIds = await resolveCategoryNamesToIds(ctx, args.categories);
      await Promise.all(
        categoryIds.map(categoryId =>
          ctx.db.insert("blogCategoryRelations", {
            blogId: blog._id,
            categoryId,
            createdAt: now,
          })
        )
      );
    }
  }

  // Update tags if provided
  if (args.tags !== undefined) {
    // Remove existing tag relations
    const existingTagRelations = await ctx.db
      .query("blogTagRelations")
      .withIndex("by_blogId", (q) => q.eq("blogId", blog._id))
      .collect();

    await Promise.all(
      existingTagRelations.map(rel => ctx.db.delete(rel._id))
    );

    // Resolve tag names to IDs and create new tag relations
    if (args.tags.length > 0) {
      const tagIds = await resolveTagNamesToIds(ctx, args.tags);
      await Promise.all(
        tagIds.map(tagId =>
          ctx.db.insert("blogTagRelations", {
            blogId: blog._id,
            tagId,
            createdAt: now,
          })
        )
      );
    }
  }

  return null;
};
