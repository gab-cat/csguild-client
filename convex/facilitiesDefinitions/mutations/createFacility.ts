import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";

import { MutationCtx } from "../../_generated/server";

export const createFacilityArgs = {
  name: v.string(),
  description: v.optional(v.string()),
  location: v.optional(v.string()),
  capacity: v.optional(v.number()),
} as const;

export const createFacilityHandler = async (
  ctx: MutationCtx,
  args: {
    name: string;
    description?: string;
    location?: string;
    capacity?: number;
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

  // Check if facility name already exists
  const existingFacility = await ctx.db
    .query("facilities")
    .withIndex("by_name", q => q.eq("name", args.name))
    .first();

  if (existingFacility) {
    throw new Error("A facility with this name already exists");
  }

  // Create the facility
  const facilityId = await ctx.db.insert("facilities", {
    name: args.name,
    description: args.description,
    location: args.location,
    capacity: args.capacity,
    isActive: true,
    createdAt: now,
    updatedAt: now,
  });

  // Initialize occupancy record
  await ctx.db.insert("facilityOccupancy", {
    facilityId,
    currentOccupancy: 0,
    maxCapacity: args.capacity || 0,
    lastUpdated: now,
    activeSessions: [],
  });

  const facility = await ctx.db.get(facilityId);
  if (!facility) {
    throw new Error("Failed to create facility");
  }

  return {
    id: facility._id,
    name: facility.name,
    description: facility.description,
    location: facility.location,
    capacity: facility.capacity,
    isActive: facility.isActive,
    createdAt: facility.createdAt,
    updatedAt: facility.updatedAt,
  };
};
