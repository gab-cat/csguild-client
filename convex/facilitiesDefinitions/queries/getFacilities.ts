import { v } from "convex/values";

import { QueryCtx } from "../../_generated/server";

export const getFacilitiesArgs = {
  includeInactive: v.optional(v.boolean()),
} as const;

export const getFacilitiesHandler = async (
  ctx: QueryCtx,
  args: {
    includeInactive?: boolean;
  }
) => {
  // Get facilities
  let facilities;
  if (args.includeInactive) {
    facilities = await ctx.db.query("facilities").collect();
  } else {
    facilities = await ctx.db
      .query("facilities")
      .withIndex("by_isActive", q => q.eq("isActive", true))
      .collect();
  }

  // Get occupancy data for each facility
  const facilitiesWithOccupancy = await Promise.all(
    facilities.map(async (facility) => {
      const occupancy = await ctx.db
        .query("facilityOccupancy")
        .withIndex("by_facilityId", q => q.eq("facilityId", facility._id))
        .first();

      const currentOccupancy = occupancy?.currentOccupancy || 0;
      const maxCapacity = facility.capacity || 0;

      return {
        id: facility._id,
        name: facility.name,
        description: facility.description,
        location: facility.location,
        capacity: maxCapacity,
        isActive: facility.isActive,
        createdAt: facility.createdAt,
        updatedAt: facility.updatedAt,
        occupancy: {
          current: currentOccupancy,
          max: maxCapacity,
          available: Math.max(0, maxCapacity - currentOccupancy),
          percentage: maxCapacity > 0 ? Math.round((currentOccupancy / maxCapacity) * 100) : 0,
          lastUpdated: occupancy?.lastUpdated || null,
        },
      };
    })
  );

  return facilitiesWithOccupancy;
};
