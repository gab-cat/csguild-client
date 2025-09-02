import { v } from "convex/values";

import { Doc } from "../../_generated/dataModel";
import { MutationCtx } from "../../_generated/server";
import { withAuthMutation } from "../../helpers";

export const registerRfidCardArgs = {
  rfidId: v.string(),
};

export const registerRfidCardHandler = withAuthMutation(
  async (
    ctx: MutationCtx,
    args: { rfidId: string },
    user: Doc<"users">
  ) => {
    // Check if RFID is already registered to another user
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_rfidId", (q) => q.eq("rfidId", args.rfidId))
      .first();

    if (existingUser && existingUser._id !== user._id) {
      throw new Error("RFID card is already registered to another user");
    }

    // Update user with RFID
    await ctx.db.patch(user._id, {
      rfidId: args.rfidId,
      updatedAt: Date.now(),
    });

    return {
      message: "RFID card registered successfully",
      success: true,
      rfidId: args.rfidId
    };
  }
);
