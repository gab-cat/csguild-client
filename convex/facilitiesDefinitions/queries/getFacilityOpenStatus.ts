import { v } from "convex/values";
import { QueryCtx } from "../../_generated/server";

export const getFacilityOpenStatusArgs = {} as const;

export const getFacilityOpenStatusHandler = async (
  ctx: QueryCtx,
  args: {}
) => {
  // Get the first ever created facility (oldest by creation time)
  const firstFacility = await ctx.db
    .query("facilities")
    .withIndex("by_isActive", q => q.eq("isActive", true))
    .order("asc") // Ascending order gets the oldest first
    .first();

  if (!firstFacility) {
    return {
      facility: null,
      isOpen: false,
      activeSessionsCount: 0,
    };
  }

  // Check for active sessions for this facility
  const activeSessions = await ctx.db
    .query("facilityUsages")
    .withIndex("by_facilityId_isActive", q =>
      q.eq("facilityId", firstFacility._id).eq("isActive", true)
    )
    .collect();

  const activeSessionsCount = activeSessions.length;
  const isOpen = activeSessionsCount > 0;

  return {
    facility: {
      id: firstFacility._id,
      name: firstFacility.name,
      description: firstFacility.description,
      location: firstFacility.location,
    },
    isOpen,
    activeSessionsCount,
  };
};
