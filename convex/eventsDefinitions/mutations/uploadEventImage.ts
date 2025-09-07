import { v } from "convex/values";

import { mutation } from "../../_generated/server";

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    // Generate an upload URL for the event image
    return await ctx.storage.generateUploadUrl();
  },
});

export const saveEventImage = mutation({
  args: {
    storageId: v.id("_storage"),
  },
  returns: v.object({
    imageUrl: v.string(),
    storageId: v.id("_storage"),
    uploadedBy: v.optional(v.string()),
  }),
  handler: async (ctx, args) => {
    // Get the URL for the uploaded file
    const imageUrl = await ctx.storage.getUrl(args.storageId);

    if (!imageUrl) {
      throw new Error("Failed to get image URL");
    }

    // Return the image URL for the component to use
    // This is a temporary response - the actual event will be updated when creating/updating
    return {
      imageUrl,
      storageId: args.storageId,
      uploadedBy: undefined, // We'll get this from the authenticated user context when needed
    };
  },
});
