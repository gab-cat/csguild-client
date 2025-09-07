import { v } from "convex/values";

import { Id } from "@convex/_generated/dataModel";

import { QueryCtx } from "../../_generated/server";

export const getFacilityByIdArgs = {
  id: v.id("facilities"),
} as const;

export const getFacilityByIdHandler = async (
  ctx: QueryCtx,
  args: {
    id: Id<"facilities">;
  }
) => {
  const facility = await ctx.db.get(args.id);
  if (!facility) {
    throw new Error("Facility not found");
  }

  // Get occupancy data
  const occupancy = await ctx.db
    .query("facilityOccupancy")
    .withIndex("by_facilityId", q => q.eq("facilityId", args.id))
    .first();

  const currentOccupancy = occupancy?.currentOccupancy || 0;
  const maxCapacity = facility.capacity || 0;

  // Get active sessions
  const activeSessions = occupancy?.activeSessions || [];

  // Get recent access logs (last 10)
  const recentLogs = await ctx.db
    .query("facilityAccessLogs")
    .withIndex("by_facilityId_timestamp", q =>
      q.eq("facilityId", args.id)
    )
    .order("desc")
    .take(10);

  return {
    id: facility._id,
    name: facility.name,
    description: facility.description || "",
    location: facility.location || "",
    capacity: maxCapacity,
    isActive: facility.isActive || false,
    createdAt: facility.createdAt || 0,
    updatedAt: facility.updatedAt || 0,
    occupancy: {
      current: currentOccupancy,
      max: maxCapacity,
      available: Math.max(0, maxCapacity - currentOccupancy),
      percentage: maxCapacity > 0 ? Math.round((currentOccupancy / maxCapacity) * 100) : 0,
      lastUpdated: occupancy?.lastUpdated || null,
    },
    activeSessions: activeSessions.map(session => ({
      userId: session.userId,
      sessionId: session.sessionId,
      timeIn: session.timeIn,
    })),
    recentActivity: recentLogs.map(log => ({
      id: log._id,
      userId: log.userId,
      rfidId: log.rfidId,
      action: log.action,
      success: log.success,
      reason: log.reason,
      timestamp: log.timestamp,
    })),
  };
};
