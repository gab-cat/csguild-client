import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";

import { Id } from "@convex/_generated/dataModel";

import { MutationCtx } from "../../_generated/server";


export const toggleFacilityAccessArgs = {
  rfidId: v.string(),
  facilityId: v.id("facilities"),
} as const;

export const toggleFacilityAccessHandler = async (
  ctx: MutationCtx,
  args: {
    rfidId: string,
    facilityId: Id<"facilities">,
  }
) => {
  const userId = await getAuthUserId(ctx);
  if (!userId) {
    throw new Error("Authentication required");
  }

  const now = Date.now();

  // Find user by RFID ID
  const user = await ctx.db
    .query("users")
    .withIndex("by_rfidId", q => q.eq("rfidId", args.rfidId))
    .first();

  if (!user) {
    // Log failed access attempt
    await ctx.db.insert("facilityAccessLogs", {
      facilityId: args.facilityId,
      rfidId: args.rfidId,
      action: "access_denied",
      reason: "invalid_card",
      success: false,
      timestamp: now,
    });

    throw new Error("Invalid RFID card");
  }

  // Ensure user has required fields
  if (!user.emailVerified) {
    await ctx.db.insert("facilityAccessLogs", {
      userId: user._id,
      facilityId: args.facilityId,
      rfidId: args.rfidId,
      action: "access_denied",
      reason: "email_not_verified",
      success: false,
      timestamp: now,
    });

    throw new Error("Email not verified");
  }

  // Check if facility exists and is active
  const facility = await ctx.db.get(args.facilityId);
  if (!facility) {
    await ctx.db.insert("facilityAccessLogs", {
      userId: user._id,
      facilityId: args.facilityId,
      rfidId: args.rfidId,
      action: "access_denied",
      reason: "facility_inactive",
      success: false,
      timestamp: now,
    });

    throw new Error("Facility not available");
  }

  // Check if user is currently checked in to this facility
  const activeSession = await ctx.db
    .query("facilityUsages")
    .withIndex("by_userId_facilityId_isActive", q =>
      q.eq("userId", user._id).eq("facilityId", args.facilityId).eq("isActive", true)
    )
    .first();

  if (activeSession) {
    // User is checked in - perform check-out
    await ctx.db.patch(activeSession._id, {
      timeOut: now,
      isActive: false,
      updatedAt: now,
    });

    // Update occupancy
    await updateFacilityOccupancy(ctx, args.facilityId, now);

    // Log successful checkout
    await ctx.db.insert("facilityAccessLogs", {
      userId: user._id,
      facilityId: args.facilityId,
      rfidId: args.rfidId,
      action: "checkout",
      success: true,
      timestamp: now,
    });

    const durationMinutes = activeSession.timeIn
      ? Math.floor((now - activeSession.timeIn) / 60000)
      : null;

    return {
      action: "checkout",
      success: true,
      message: `Checked out of ${facility.name}`,
      sessionId: activeSession._id,
      sessionTimeIn: activeSession.timeIn ?? now,
      sessionTimeOut: now,
      durationMinutes,
      user: {
        id: user._id,
        username: user.username || "",
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        imageUrl: user.imageUrl || "",
        course: user.course || "",
      },
      facility: {
        id: facility._id,
        name: facility.name,
        location: facility.location || "",
      },
      timestamp: now,
    };
  } else {
    // User is not checked in - perform check-in
    // Check capacity before allowing check-in
    const currentOccupancy = await getCurrentOccupancy(ctx, args.facilityId);
    const maxCapacity = facility.capacity || 0;

    if (currentOccupancy >= maxCapacity) {
      await ctx.db.insert("facilityAccessLogs", {
        userId: user._id,
        facilityId: args.facilityId,
        rfidId: args.rfidId,
        action: "access_denied",
        reason: "capacity_exceeded",
        success: false,
        timestamp: now,
      });

      throw new Error(`Facility at capacity (${maxCapacity})`);
    }

    // Check if user is already checked in to another facility
    const otherActiveSession = await ctx.db
      .query("facilityUsages")
      .withIndex("by_userId", q => q.eq("userId", user._id))
      .filter(q => q.eq(q.field("isActive"), true))
      .first();

    if (otherActiveSession) {
      const otherFacility = await ctx.db.get(otherActiveSession.facilityId);

      await ctx.db.insert("facilityAccessLogs", {
        userId: user._id,
        facilityId: args.facilityId,
        rfidId: args.rfidId,
        action: "access_denied",
        reason: "already_checked_in",
        success: false,
        timestamp: now,
      });

      throw new Error(`Already checked in to ${otherFacility?.name || 'another facility'}`);
    }

    // Create new session
    const sessionId = await ctx.db.insert("facilityUsages", {
      userId: user._id,
      facilityId: args.facilityId,
      timeIn: now,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });

    // Update occupancy
    await updateFacilityOccupancy(ctx, args.facilityId, now);

    // Log successful checkin
    await ctx.db.insert("facilityAccessLogs", {
      userId: user._id,
      facilityId: args.facilityId,
      rfidId: args.rfidId,
      action: "checkin",
      success: true,
      timestamp: now,
    });

    return {
      action: "checkin",
      success: true,
      message: `Checked in to ${facility.name}`,
      sessionId,
      sessionTimeIn: now,
      sessionTimeOut: null,
      durationMinutes: null,
      user: {
        id: user._id,
        username: user.username || "",
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        imageUrl: user.imageUrl || "",
        course: user.course || "",
      },
      facility: {
        id: facility._id,
        name: facility.name,
        location: facility.location || "",
      },
      timestamp: now,
    };
  }
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
    sessionId: session._id,
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