import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";

import { Id } from "@convex/_generated/dataModel";

import { MutationCtx } from "../../_generated/server";

export const endFacilitySessionArgs = {
  sessionId: v.id("facilityUsages"),
} as const;

export const endFacilitySessionHandler = async (
  ctx: MutationCtx,
  args: {
    sessionId: Id<"facilityUsages">;
  }
) => {
  const authUserId = await getAuthUserId(ctx);
  if (!authUserId) {
    throw new Error("Authentication required");
  }

  const now = Date.now();

  // Get the session
  const session = await ctx.db.get(args.sessionId);
  if (!session) {
    throw new Error("Session not found");
  }

  // Check if session is already ended
  if (!session.isActive) {
    throw new Error("Session is already ended");
  }

  // Check permissions - user can end their own session, or admin can end any session
  const authUser = await ctx.db.get(authUserId);
  const hasAdminRole = authUser?.roles?.includes("ADMIN") || authUser?.roles?.includes("STAFF");

  if (session.userId !== authUserId && !hasAdminRole) {
    throw new Error("Insufficient permissions to end this session");
  }

  // End the session
  await ctx.db.patch(args.sessionId, {
    timeOut: now,
    isActive: false,
    updatedAt: now,
  });

  // Update occupancy
  await updateFacilityOccupancy(ctx, session.facilityId, now);

  // Get facility and user info for response
  const facility = await ctx.db.get(session.facilityId);
  const user = await ctx.db.get(session.userId);

  if (!facility || !user) {
    throw new Error("Facility or user not found");
  }

  return {
    sessionId: args.sessionId,
    userId: session.userId,
    facilityId: session.facilityId,
    timeIn: session.timeIn,
    timeOut: now,
    duration: now - (session.timeIn || now),
    message: `Session ended for ${user.firstName} ${user.lastName} in ${facility.name}`,
  };
};

// Helper function to update facility occupancy
async function updateFacilityOccupancy(ctx: MutationCtx, facilityId: Id<"facilities">, timestamp: number) {
  const facility = await ctx.db.get(facilityId);
  if (!facility) return;

  const currentOccupancy = await getCurrentOccupancy(ctx, facilityId);
  const maxCapacity = facility.capacity || 0;

  // Get active sessions for the occupancy record
  const activeSessions = await ctx.db
    .query("facilityUsages")
    .withIndex("by_facilityId_isActive", q =>
      q.eq("facilityId", facilityId).eq("isActive", true)
    )
    .collect();

  const activeSessionData = activeSessions.map(session => ({
    userId: session.userId,
    sessionId: session._id as Id<"facilityUsages">,
    timeIn: session.timeIn!,
  }));

  // Update or create occupancy record
  const existingOccupancy = await ctx.db
    .query("facilityOccupancy")
    .withIndex("by_facilityId", q => q.eq("facilityId", facilityId))
    .first();

  if (existingOccupancy) {
    await ctx.db.patch(existingOccupancy._id, {
      currentOccupancy,
      lastUpdated: timestamp,
      activeSessions: activeSessionData,
    });
  } else {
    await ctx.db.insert("facilityOccupancy", {
      facilityId,
      currentOccupancy,
      maxCapacity,
      lastUpdated: timestamp,
      activeSessions: activeSessionData,
    });
  }
}

// Helper function to get current occupancy
async function getCurrentOccupancy(ctx: MutationCtx, facilityId: Id<"facilities">): Promise<number> {
  const activeSessions = await ctx.db
    .query("facilityUsages")
    .withIndex("by_facilityId_isActive", q =>
      q.eq("facilityId", facilityId).eq("isActive", true)
    )
    .collect();

  return activeSessions.length;
}
