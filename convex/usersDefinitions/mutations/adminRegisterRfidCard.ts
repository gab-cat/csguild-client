import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

import { Id } from "../../_generated/dataModel";
import { MutationCtx } from "../../_generated/server";
import { withAuthMutation } from "../../helpers";

export const adminRegisterRfidCardArgs = {
  userId: v.id("users"),
  rfidId: v.string(),
} as const;

export const adminRegisterRfidCardHandler = withAuthMutation(
  async (
    ctx: MutationCtx,
    args: { userId: Id<"users">; rfidId: string },
  ) => {
    const authUser = await ctx.db.get(args.userId);
    // Permission check is enforced by withAuthMutation's user; verify admin/staff
    const callerId = await getAuthUserId(ctx);
    if (!callerId) throw new Error("Authentication required");
    const callerDoc = await ctx.db.get(callerId);
    const isPrivileged = callerDoc?.roles?.includes("ADMIN") || callerDoc?.roles?.includes("STAFF");
    if (!isPrivileged) throw new Error("Insufficient permissions");

    // Ensure unique RFID
    const existing = await ctx.db
      .query("users")
      .withIndex("by_rfidId", (q) => q.eq("rfidId", args.rfidId))
      .first();
    if (existing && existing._id !== args.userId) {
      throw new Error("RFID already registered to another user");
    }

    await ctx.db.patch(args.userId, { rfidId: args.rfidId, updatedAt: Date.now() });
    return { success: true as const };
  }
);


