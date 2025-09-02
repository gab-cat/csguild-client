import { QueryCtx } from "../../_generated/server";
import { requireRoleLevel } from "../../helpers";
import { UserRole } from "../../helpers";

export const getUsersArgs = {};

export const getUsersHandler = async (ctx: QueryCtx) => {
  // Require admin or staff role to access all users
  await requireRoleLevel(ctx, "STAFF" as UserRole);

  return await ctx.db.query("users").collect();
};
