import { v } from "convex/values";
import { internalMutation } from "../_generated/server";

// Mutation to update notifiedOwnerAt for applications
export const updateNotifiedOwnerAt = internalMutation({
  args: {
    applicationIds: v.array(v.id("projectApplications")),
    notifiedAt: v.number(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    for (const applicationId of args.applicationIds) {
      await ctx.db.patch(applicationId, {
        notifiedOwnerAt: args.notifiedAt,
      });
    }
    return null;
  },
});
