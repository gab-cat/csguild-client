import { v } from "convex/values";

import { Id } from "../../_generated/dataModel";
import { QueryCtx } from "../../_generated/server";

export const getUserByIdArgs = {
  id: v.id("users"),
};

export const getUserByIdHandler = async (
  ctx: QueryCtx,
  args: { id: Id<"users"> }
) => {
  return await ctx.db.get(args.id);
};
