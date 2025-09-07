import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";

import { Id } from "@convex/_generated/dataModel";

import { MutationCtx } from "../../_generated/server";

export const updateFacilityArgs = {
  id: v.id("facilities"),
  name: v.optional(v.string()),
  description: v.optional(v.string()),
  location: v.optional(v.string()),
  capacity: v.optional(v.number()),
  isActive: v.optional(v.boolean()),
} as const;

export const updateFacilityHandler = async (
  ctx: MutationCtx,
  args: {
    id: Id<"facilities">;
    name?: string;
    description?: string;
    location?: string;
    capacity?: number;
    isActive?: boolean;
  }
) => {
  const userId = await getAuthUserId(ctx);
  if (!userId) {
    throw new Error("Authentication required");
  }

  const currentUser = await ctx.db.get(userId);
  if (!currentUser) {
    throw new Error("User not found");
  }

  // Check if user has admin or staff role
  const hasAdminRole = currentUser.roles?.includes("ADMIN") || currentUser.roles?.includes("STAFF");
  if (!hasAdminRole) {
    throw new Error("Insufficient permissions. Admin or Staff role required.");
  }

  const now = Date.now();

  // Check if facility exists
  const existingFacility = await ctx.db.get(args.id);
  if (!existingFacility) {
    throw new Error("Facility not found");
  }

  // If name is being updated, check for name conflicts
  if (args.name && args.name !== existingFacility.name) {
    const nameConflict = await ctx.db
      .query("facilities")
      .withIndex("by_name", q => q.eq("name", args.name!))
      .first();

    if (nameConflict) {
      throw new Error("A facility with this name already exists");
    }
  }

  // Prepare update data
  const updateData: Partial<{
    name: string;
    description: string;
    location: string;
    capacity: number;
    isActive: boolean;
    updatedAt: number;
  }> = {
    updatedAt: now,
  };

  if (args.name !== undefined) updateData.name = args.name;
  if (args.description !== undefined) updateData.description = args.description;
  if (args.location !== undefined) updateData.location = args.location;
  if (args.capacity !== undefined) updateData.capacity = args.capacity;
  if (args.isActive !== undefined) updateData.isActive = args.isActive;

  // Update the facility
  await ctx.db.patch(args.id, updateData);

  // If capacity changed, update occupancy record
  if (args.capacity !== undefined) {
    const occupancyRecord = await ctx.db
      .query("facilityOccupancy")
      .withIndex("by_facilityId", q => q.eq("facilityId", args.id))
      .first();

    if (occupancyRecord) {
      await ctx.db.patch(occupancyRecord._id, {
        maxCapacity: args.capacity,
        lastUpdated: now,
      });
    }
  }

  // If facility is being deactivated, check for active sessions
  if (args.isActive === false) {
    const activeSessions = await ctx.db
      .query("facilityUsages")
      .withIndex("by_facilityId_isActive", q =>
        q.eq("facilityId", args.id).eq("isActive", true)
      )
      .collect();

    if (activeSessions.length > 0) {
      throw new Error(`Cannot deactivate facility with ${activeSessions.length} active sessions`);
    }
  }

  // Get updated facility
  const updatedFacility = await ctx.db.get(args.id);
  if (!updatedFacility) {
    throw new Error("Failed to update facility");
  }

  return {
    id: updatedFacility._id,
    name: updatedFacility.name,
    description: updatedFacility.description || "",
    location: updatedFacility.location || "",
    capacity: updatedFacility.capacity || 0,
    isActive: updatedFacility.isActive || false,
    createdAt: updatedFacility.createdAt || 0,
    updatedAt: updatedFacility.updatedAt || 0,
  };
};
