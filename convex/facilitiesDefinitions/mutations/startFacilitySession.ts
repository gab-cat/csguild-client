import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";

import { Id } from "@convex/_generated/dataModel";

import { MutationCtx } from "../../_generated/server";

export const startFacilitySessionArgs = {
  facilityId: v.id("facilities"),
  userId: v.optional(v.id("users")), // Optional for admin overrides
} as const;

export const startFacilitySessionHandler = async (
  ctx: MutationCtx,
  args: {
    facilityId: Id<"facilities">;
    userId?: Id<"users">;
  }
) => {
  const authUserId = await getAuthUserId(ctx);
  if (!authUserId) {
    throw new Error("Authentication required");
  }

  const now = Date.now();

  // Determine target user (self or specified user)
  const targetUserId = args.userId || authUserId;

  // If admin is starting session for another user, verify permissions
  if (args.userId && args.userId !== authUserId) {
    const authUser = await ctx.db.get(authUserId);
    const hasAdminRole = authUser?.roles?.includes("ADMIN") || authUser?.roles?.includes("STAFF");
    if (!hasAdminRole) {
      throw new Error("Insufficient permissions to start session for another user");
    }
  }

  const user = await ctx.db.get(targetUserId);
  if (!user) {
    throw new Error("User not found");
  }

  // Check if user is verified
  if (!user.emailVerified) {
    throw new Error("User email not verified");
  }

  // Check if facility exists and is active
  const facility = await ctx.db.get(args.facilityId);
  if (!facility || !facility.isActive) {
    throw new Error("Facility not available");
  }

  // Check if user already has an active session in this facility
  const existingSession = await ctx.db
    .query("facilityUsages")
    .withIndex("by_userId_facilityId_isActive", q =>
      q.eq("userId", targetUserId).eq("facilityId", args.facilityId).eq("isActive", true)
    )
    .first();

  if (existingSession) {
    throw new Error("User already has an active session in this facility");
  }

  // Check capacity
  const currentOccupancy = await getCurrentOccupancy(ctx, args.facilityId);
  const maxCapacity = facility.capacity || 0;

  if (currentOccupancy >= maxCapacity) {
    throw new Error(`Facility at capacity (${maxCapacity})`);
  }

  // Check if user is already checked in to another facility
  const otherActiveSession = await ctx.db
    .query("facilityUsages")
    .withIndex("by_isActive", q => q.eq("isActive", true))
    .filter(q => q.eq(q.field("userId"), targetUserId))
    .first();

  if (otherActiveSession) {
    const otherFacility = await ctx.db.get(otherActiveSession.facilityId);
    throw new Error(`User already checked in to ${otherFacility?.name || 'another facility'}`);
  }

  // Create session
  const sessionId = await ctx.db.insert("facilityUsages", {
    userId: targetUserId,
    facilityId: args.facilityId,
    timeIn: now,
    isActive: true,
    createdAt: now,
    updatedAt: now,
  });

  // Update occupancy
  await updateFacilityOccupancy(ctx, args.facilityId, now);

  return {
    sessionId,
    userId: targetUserId,
    facilityId: args.facilityId,
    timeIn: now,
    message: `Session started for ${user.firstName} ${user.lastName} in ${facility.name}`,
  };
};

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
