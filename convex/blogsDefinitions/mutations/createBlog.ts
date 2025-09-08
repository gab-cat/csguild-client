import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";

import { Id } from "@convex/_generated/dataModel";

import { MutationCtx } from "../../_generated/server";

export const createBlogArgs = {
  title: v.string(),
  slug: v.string(),
  subtitle: v.optional(v.string()),
  content: v.string(),
  excerpt: v.optional(v.string()),
  metaDescription: v.optional(v.string()),
  metaKeywords: v.optional(v.array(v.string())),
  canonicalUrl: v.optional(v.string()),
  categories: v.optional(v.array(v.id("blogCategories"))),
  tagNames: v.optional(v.array(v.string())), // Changed from tags to tagNames
  status: v.optional(v.union(v.literal("DRAFT"), v.literal("PUBLISHED"), v.literal("PENDING"), v.literal("ARCHIVED"), v.literal("DELETED"))),
  scheduledFor: v.optional(v.number()),
  allowComments: v.optional(v.boolean()),
  allowBookmarks: v.optional(v.boolean()),
  allowLikes: v.optional(v.boolean()),
  allowShares: v.optional(v.boolean()),
};

export const createBlogHandler = async (
  ctx: MutationCtx,
  args: {
    title: string;
    slug: string;
    subtitle?: string;
    content: string;
    excerpt?: string;
    metaDescription?: string;
    metaKeywords?: string[];
    canonicalUrl?: string;
    categories?: string[];
    tagNames?: string[]; // Changed from tags to tagNames
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

  // Get user info to get username
  const user = await ctx.db.get(userId);
  if (!user) {
    throw new Error("User not found");
  }

  // Check if slug is unique
  const existingBlog = await ctx.db
    .query("blogs")
    .withIndex("by_slug", (q) => q.eq("slug", args.slug))
    .first();

  if (existingBlog) {
    throw new Error("Blog with this slug already exists");
  }

  // Calculate word count and reading time
  const wordCount = args.content.split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / 200); // Average reading speed: 200 words per minute

  const now = Date.now();

  // Create the blog
  const blogId = await ctx.db.insert("blogs", {
    title: args.title,
    slug: args.slug,
    subtitle: args.subtitle,
    content: args.content,
    excerpt: args.excerpt,
    readingTime,
    wordCount,
    status: args.status || "PENDING",
    scheduledFor: args.scheduledFor,
    lastEditedAt: now,
    metaDescription: args.metaDescription,
    metaKeywords: args.metaKeywords,
    canonicalUrl: args.canonicalUrl,
    viewCount: 0,
    likeCount: 0,
    commentCount: 0,
    shareCount: 0,
    bookmarkCount: 0,
    moderationStatus: undefined,
    flagCount: 0,
    authorSlug: user.username!,
    allowComments: args.allowComments ?? true,
    allowBookmarks: args.allowBookmarks ?? true,
    allowLikes: args.allowLikes ?? true,
    allowShares: args.allowShares ?? true,
    isPinned: false,
    isFeatured: false,
    createdAt: now,
    updatedAt: now,
  });

  // Add category relations
  if (args.categories && args.categories.length > 0) {
    await Promise.all(
      args.categories.map(categoryId =>
        ctx.db.insert("blogCategoryRelations", {
          blogId,
          categoryId: categoryId as Id<"blogCategories">,
          createdAt: now,
        })
      )
    );
  }

  // Add tag relations - handle tag names by finding/creating tags
  if (args.tagNames && args.tagNames.length > 0) {
    await Promise.all(
      args.tagNames.map(async (tagName) => {
        // Generate slug from tag name
        const tagSlug = tagName
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim();

        // Try to find existing tag
        const existingTag = await ctx.db
          .query("blogTags")
          .withIndex("by_slug", (q) => q.eq("slug", tagSlug))
          .first();

        let tagId: Id<"blogTags">;

        if (existingTag) {
          // Update blog count for existing tag
          tagId = existingTag._id;
          await ctx.db.patch(tagId, {
            blogCount: (existingTag.blogCount || 0) + 1,
            updatedAt: now,
          });
        } else {
          // Create new tag
          tagId = await ctx.db.insert("blogTags", {
            name: tagName,
            slug: tagSlug,
            blogCount: 1,
            isOfficial: false,
            createdAt: now,
            updatedAt: now,
          });
        }

        // Create tag relation
        await ctx.db.insert("blogTagRelations", {
          blogId,
          tagId,
          createdAt: now,
        });
      })
    );
  }

  return blogId;
};
