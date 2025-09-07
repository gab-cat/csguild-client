import { v } from "convex/values";

import { Doc, Id } from "../../_generated/dataModel";
import { MutationCtx } from "../../_generated/server";
import { withAuthMutation } from "../../helpers";

export const generateBlogCoverUploadUrlArgs = {};

export const generateBlogCoverUploadUrlHandler = withAuthMutation(
  async (ctx: MutationCtx) => {
    // Generate an upload URL for the blog cover image
    return await ctx.storage.generateUploadUrl();
  }
);

export const saveBlogCoverImageArgs = {
  storageId: v.id("_storage"),
  blogId: v.id("blogs"),
  altText: v.optional(v.string()),
  caption: v.optional(v.string()),
  credits: v.optional(v.string()),
};

export const saveBlogCoverImageHandler = withAuthMutation(
  async (
    ctx: MutationCtx,
    args: {
      storageId: Id<"_storage">;
      blogId: Id<"blogs">;
      altText?: string;
      caption?: string;
      credits?: string;
    },
    user: Doc<"users">
  ) => {
    // Get the URL for the uploaded file
    const imageUrl = await ctx.storage.getUrl(args.storageId);

    if (!imageUrl) {
      throw new Error("Failed to get image URL");
    }

    // Check if blog exists and user has permission
    const blog = await ctx.db.get(args.blogId);
    if (!blog) {
      throw new Error("Blog not found");
    }

    if (blog.authorSlug !== user.username) {
      throw new Error("You don't have permission to upload cover images for this blog");
    }

    // Delete existing cover images for this blog
    const existingCoverImages = await ctx.db
      .query("blogCoverImages")
      .withIndex("by_blogId", (q) => q.eq("blogId", args.blogId))
      .collect();

    await Promise.all(
      existingCoverImages.map(async (coverImage) => {
        try {
          await ctx.storage.delete(coverImage.imageUrl); // This might need adjustment based on how URLs are stored
        } catch (error) {
          console.error("Failed to delete old cover image:", error);
        }
        await ctx.db.delete(coverImage._id);
      })
    );

    // Create new cover image record
    const coverImageId = await ctx.db.insert("blogCoverImages", {
      blogId: args.blogId,
      imageUrl,
      altText: args.altText,
      caption: args.caption,
      credits: args.credits,
      order: 1,
      isMain: true,
      createdAt: Date.now(),
    });

    return {
      coverImageId,
      imageUrl,
      storageId: args.storageId,
    };
  }
);
