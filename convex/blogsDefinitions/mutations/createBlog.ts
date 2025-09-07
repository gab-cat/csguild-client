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
  tags: v.optional(v.array(v.id("blogTags"))),
  status: v.optional(v.union(v.literal("DRAFT"), v.literal("PUBLISHED"), v.literal("SCHEDULED"), v.literal("ARCHIVED"), v.literal("DELETED"))),
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
    tags?: string[];
    status?: "DRAFT" | "PUBLISHED" | "SCHEDULED" | "ARCHIVED" | "DELETED";
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
    status: args.status || "PUBLISHED",
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
    moderationStatus: "PENDING",
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

  // Add tag relations
  if (args.tags && args.tags.length > 0) {
    await Promise.all(
      args.tags.map(tagId =>
        ctx.db.insert("blogTagRelations", {
          blogId,
          tagId: tagId as Id<"blogTags">,
          createdAt: now,
        })
      )
    );
  }

  return blogId;
};
