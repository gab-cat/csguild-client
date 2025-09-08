import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

import { Id } from "../../_generated/dataModel";
import { MutationCtx } from "../../_generated/server";
import { withAuthMutation } from "../../helpers";

export const adminUpdateUserArgs = {
  userId: v.id("users"),
  firstName: v.optional(v.string()),
  lastName: v.optional(v.string()),
  username: v.optional(v.string()),
  course: v.optional(v.string()),
  birthdate: v.optional(v.number()),
  imageUrl: v.optional(v.string()),
  rfidId: v.optional(v.string()),
  roles: v.optional(v.array(v.union(v.literal("STUDENT"), v.literal("USER"), v.literal("STAFF"), v.literal("ADMIN")))),
} as const;

export const adminUpdateUserHandler = withAuthMutation(
  async (
    ctx: MutationCtx,
    args: {
      userId: Id<"users">;
      firstName?: string;
      lastName?: string;
      username?: string;
      course?: string;
      birthdate?: number;
      imageUrl?: string;
      rfidId?: string;
      roles?: Array<"STUDENT" | "USER" | "STAFF" | "ADMIN">;
    },
  ) => {
    // Only ADMIN/STAFF can update others
    const callerId = await getAuthUserId(ctx);
    if (!callerId) throw new Error("Authentication required");
    const caller = await ctx.db.get(callerId);
    const isPrivileged = caller?.roles?.includes("ADMIN") || caller?.roles?.includes("STAFF");
    if (!isPrivileged) throw new Error("Insufficient permissions");

    const updates: Record<string, unknown> = { updatedAt: Date.now() };
    if (args.firstName !== undefined) updates.firstName = args.firstName;
    if (args.lastName !== undefined) updates.lastName = args.lastName;
    if (args.username !== undefined) updates.username = args.username;
    if (args.course !== undefined) updates.course = args.course;
    if (args.birthdate !== undefined) updates.birthdate = args.birthdate;
    if (args.imageUrl !== undefined) updates.imageUrl = args.imageUrl;
    if (args.rfidId !== undefined) updates.rfidId = args.rfidId;
    if (args.roles !== undefined) updates.roles = args.roles;

    await ctx.db.patch(args.userId, updates);
    return await ctx.db.get(args.userId);
  }
);


