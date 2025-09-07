import { v } from "convex/values";

import { Id } from "@convex/_generated/dataModel";

import { QueryCtx } from "../../_generated/server";

export const getActiveSessionsArgs = {
  facilityId: v.id("facilities"),
} as const;

export const getActiveSessionsHandler = async (
  ctx: QueryCtx,
  args: {
    facilityId: Id<"facilities">;
  }
) => {
  // Get active sessions for the facility
  const activeSessions = await ctx.db
    .query("facilityUsages")
    .withIndex("by_facilityId_isActive", q =>
      q.eq("facilityId", args.facilityId).eq("isActive", true)
    )
    .collect();

  // Enrich session data with user information
  const sessionsWithUsers = await Promise.all(
    activeSessions.map(async (session) => {
      const user = await ctx.db.get(session.userId);
      if (!user) {
        return null; // Skip sessions with invalid users
      }

      return {
        id: session._id,
        userId: session.userId,
        facilityId: session.facilityId,
        timeIn: session.timeIn,
        duration: Date.now() - (session.timeIn || Date.now()),
        user: {
          id: user._id,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          imageUrl: user.imageUrl,
        },
      };
    })
  );

  // Filter out null sessions and sort by timeIn (most recent first)
  const validSessions = sessionsWithUsers.filter(session => session !== null);
  validSessions.sort((a, b) => (b?.timeIn || 0) - (a?.timeIn || 0));

  return validSessions;
};
