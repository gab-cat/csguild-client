import { v } from "convex/values";

import { Doc } from "../../_generated/dataModel";
import { MutationCtx } from "../../_generated/server";
import { withAuthMutation } from "../../helpers";

export const updateCurrentUserArgs = {
  firstName: v.optional(v.string()),
  lastName: v.optional(v.string()),
  username: v.optional(v.string()),
  course: v.optional(v.string()),
  birthdate: v.optional(v.number()),
  imageUrl: v.optional(v.string()),
  rfidId: v.optional(v.string()),
};

export const updateCurrentUserHandler = withAuthMutation(
  async (
    ctx: MutationCtx,
    args: {
      firstName?: string;
      lastName?: string;
      username?: string;
      course?: string;
      birthdate?: number;
      imageUrl?: string;
      rfidId?: string;
    },
    user: Doc<"users">
  ) => {
    const updates: Partial<typeof args> & { updatedAt: number } = {
      updatedAt: Date.now(),
    };

    if (args.firstName !== undefined) updates.firstName = args.firstName;
    if (args.lastName !== undefined) updates.lastName = args.lastName;
    if (args.username !== undefined) updates.username = args.username;
    if (args.course !== undefined) updates.course = args.course;
    if (args.birthdate !== undefined) updates.birthdate = args.birthdate;
    if (args.imageUrl !== undefined) updates.imageUrl = args.imageUrl;
    if (args.rfidId !== undefined) updates.rfidId = args.rfidId;

    await ctx.db.patch(user._id, updates);

    // Return updated user
    return await ctx.db.get(user._id);
  }
);
