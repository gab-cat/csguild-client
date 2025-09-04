import { v } from "convex/values";

import { Id } from "@convex/_generated/dataModel";

import { QueryCtx } from "../../_generated/server";

export const getFacilityUsageHistoryArgs = {
  facilityId: v.id("facilities"),
  page: v.optional(v.number()),
  limit: v.optional(v.number()),
  includeActive: v.optional(v.boolean()),
  startDate: v.optional(v.number()),
  endDate: v.optional(v.number()),
} as const;

export const getFacilityUsageHistoryHandler = async (
  ctx: QueryCtx,
  args: {
    facilityId: Id<"facilities">;
    page?: number;
    limit?: number;
    includeActive?: boolean;
    startDate?: number;
    endDate?: number;
  }
) => {
  const limit = Math.min(args.limit || 20, 100); // Max 100 per page
  const page = args.page || 1;
  const offset = (page - 1) * limit;

  // Get usage sessions
  let sessionsQuery = ctx.db
    .query("facilityUsages")
    .withIndex("by_facilityId_timeIn", q => q.eq("facilityId", args.facilityId));

  // Apply date filters if provided
  if (args.startDate || args.endDate) {
    // For date filtering, we need to collect and filter manually
    let allSessions = await sessionsQuery.collect();

    if (args.startDate) {
      allSessions = allSessions.filter(session => (session.timeIn || 0) >= args.startDate!);
    }

    if (args.endDate) {
      allSessions = allSessions.filter(session => (session.timeIn || 0) <= args.endDate!);
    }

    // Filter active/inactive sessions
    if (args.includeActive === false) {
      allSessions = allSessions.filter(session => !session.isActive);
    }

    // Sort by timeIn descending (most recent first)
    allSessions.sort((a, b) => (b.timeIn || 0) - (a.timeIn || 0));

    // Apply pagination
    const total = allSessions.length;
    const paginatedSessions = allSessions.slice(offset, offset + limit);

    // Enrich session data
    const enrichedSessions = await Promise.all(
      paginatedSessions.map(async (session) => {
        const user = await ctx.db.get(session.userId);
        if (!user) return null;

        return {
          id: session._id,
          userId: session.userId,
          facilityId: session.facilityId,
          timeIn: session.timeIn,
          timeOut: session.timeOut,
          isActive: session.isActive,
          duration: session.timeOut && session.timeIn
            ? session.timeOut - session.timeIn
            : session.isActive && session.timeIn
              ? Date.now() - session.timeIn
              : null,
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

    const validSessions = enrichedSessions.filter(session => session !== null);
    const totalPages = Math.ceil(total / limit);

    return {
      data: validSessions,
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  } else {
    // No date filters - use direct query
    if (args.includeActive === false) {
      sessionsQuery = sessionsQuery.filter(q => q.eq(q.field("isActive"), false));
    }

    const allSessions = await sessionsQuery.collect();

    // Sort by timeIn descending (most recent first)
    allSessions.sort((a, b) => (b.timeIn || 0) - (a.timeIn || 0));

    const total = allSessions.length;
    const paginatedSessions = allSessions.slice(offset, offset + limit);

    // Enrich session data
    const enrichedSessions = await Promise.all(
      paginatedSessions.map(async (session) => {
        const user = await ctx.db.get(session.userId);
        if (!user) return null;

        return {
          id: session._id,
          userId: session.userId,
          facilityId: session.facilityId,
          timeIn: session.timeIn,
          timeOut: session.timeOut,
          isActive: session.isActive,
          duration: session.timeOut && session.timeIn
            ? session.timeOut - session.timeIn
            : session.isActive && session.timeIn
              ? Date.now() - session.timeIn
              : null,
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

    const validSessions = enrichedSessions.filter(session => session !== null);
    const totalPages = Math.ceil(total / limit);

    return {
      data: validSessions,
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }
};
