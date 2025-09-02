import { v } from "convex/values";

import { MutationCtx } from "../../_generated/server";
import { requireRoleLevel, UserRole } from "../../helpers";

export const createUserArgs = {
  email: v.string(),
  password: v.string(),
  firstName: v.optional(v.string()),
  lastName: v.optional(v.string()),
  username: v.optional(v.string()),
  course: v.optional(v.string()),
  birthdate: v.optional(v.number()),
  roles: v.optional(v.array(v.union(
    v.literal("STUDENT"),
    v.literal("USER"),
    v.literal("STAFF"),
    v.literal("ADMIN")
  ))),
};

export const createUserHandler = async (
  ctx: MutationCtx,
  args: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    username?: string;
    course?: string;
    birthdate?: number;
    roles?: UserRole[];
  }
) => {
  // Require admin role to create users
  await requireRoleLevel(ctx, "ADMIN" as UserRole);

  const now = Date.now();

  return await ctx.db.insert("users", {
    email: args.email,
    password: args.password,
    firstName: args.firstName,
    lastName: args.lastName,
    username: args.username,
    course: args.course,
    birthdate: args.birthdate,
    roles: args.roles || ["USER"],
    signupMethod: "EMAIL",
    createdAt: now,
    updatedAt: now,
  });
};
