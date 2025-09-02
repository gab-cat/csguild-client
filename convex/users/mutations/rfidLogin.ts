import { v } from "convex/values";

import { MutationCtx } from "../../_generated/server";

export const rfidLoginArgs = {
  rfidId: v.string(),
};

export const rfidLoginHandler = async (
  ctx: MutationCtx,
  args: { rfidId: string }
) => {
  // Find user by RFID
  const user = await ctx.db
    .query("users")
    .withIndex("by_rfidId", (q) => q.eq("rfidId", args.rfidId))
    .first();

  if (!user) {
    throw new Error("RFID card not found");
  }

  if (!user.emailVerified) {
    throw new Error("User email not verified");
  }

  // Return user data for authentication
  return {
    user: user,
    message: "RFID login successful",
    success: true
  };
};
