import { v } from "convex/values";

import { Doc, Id } from "../../_generated/dataModel";
import { MutationCtx } from "../../_generated/server";
import { withAuthMutation } from "../../helpers";

export const generateUploadUrlArgs = {};

export const generateUploadUrlHandler = withAuthMutation(
  async (ctx: MutationCtx) => {
    // Generate an upload URL for the profile picture
    return await ctx.storage.generateUploadUrl();
  }
);

export const saveProfilePictureArgs = {
  storageId: v.id("_storage"),
};

export const saveProfilePictureHandler = withAuthMutation(
  async (
    ctx: MutationCtx,
    args: { storageId: Id<"_storage"> },
    user: Doc<"users">
  ) => {
    // Get the URL for the uploaded file
    const imageUrl = await ctx.storage.getUrl(args.storageId);

    if (!imageUrl) {
      throw new Error("Failed to get image URL");
    }

    // Delete the old profile picture if it exists
    if (user.imageStorageId) {
      try {
        await ctx.storage.delete(user.imageStorageId);
      } catch (error) {
        // Log the error but don't fail the operation
        console.error("Failed to delete old profile picture:", error);
      }
    }

    // Update the user's profile picture
    await ctx.db.patch(user._id, {
      imageUrl,
      imageStorageId: args.storageId,
      updatedAt: Date.now(),
    });

    // Return the updated user
    return await ctx.db.get(user._id);
  }
);

