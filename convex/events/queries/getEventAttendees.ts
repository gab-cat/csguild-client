import { v } from "convex/values";

import { QueryCtx } from "../../_generated/server";

export const getEventAttendeesArgs = {
  eventId: v.string(),
  limit: v.optional(v.number()),
  page: v.optional(v.number()),
  search: v.optional(v.string()),
  sortBy: v.optional(v.union(v.literal("registeredAt"), v.literal("username"), v.literal("firstName"), v.literal("lastName"), v.literal("totalDuration"))),
  sortOrder: v.optional(v.union(v.literal("asc"), v.literal("desc"))),
};

export const getEventAttendeesHandler = async (
  ctx: QueryCtx,
  args: {
    eventId: string;
    limit?: number;
    page?: number;
    search?: string;
    sortBy?: "registeredAt" | "username" | "firstName" | "lastName" | "totalDuration";
    sortOrder?: "asc" | "desc";
  }
) => {
  const limit = args.limit || 50;
  const page = args.page || 1;
  const offset = (page - 1) * limit;

  // First, get the event to verify it exists
  const event = await ctx.db.query("events").filter(q => q.eq(q.field("_id"), args.eventId)).first();
  if (!event) {
    throw new Error("Event not found");
  }

  // Get all attendees for this event
  let attendees = await ctx.db
    .query("eventAttendees")
    .withIndex("by_eventId", q => q.eq("eventId", event._id))
    .collect();

  // Get user details for each attendee
  const attendeesWithUsers = await Promise.all(
    attendees.map(async (attendee) => {
      const user = await ctx.db
        .query("users")
        .withIndex("by_username", q => q.eq("username", attendee.userId))
        .first();

      return {
        ...attendee,
        user: user || null,
      };
    })
  );

  // Apply search filter
  if (args.search) {
    const searchLower = args.search.toLowerCase();
    attendeesWithUsers.filter(attendee => {
      if (!attendee.user) return false;

      return (
        attendee.user.username.toLowerCase().includes(searchLower) ||
        (attendee.user.firstName && attendee.user.firstName.toLowerCase().includes(searchLower)) ||
        (attendee.user.lastName && attendee.user.lastName.toLowerCase().includes(searchLower)) ||
        (attendee.user.email && attendee.user.email.toLowerCase().includes(searchLower))
      );
    });
  }

  // Sort attendees
  const sortBy = args.sortBy || "registeredAt";
  const sortOrder = args.sortOrder || "desc";

  attendeesWithUsers.sort((a, b) => {
    let aValue: any;
    let bValue: any;

    switch (sortBy) {
      case "username":
        aValue = a.user?.username || "";
        bValue = b.user?.username || "";
        break;
      case "firstName":
        aValue = a.user?.firstName || "";
        bValue = b.user?.firstName || "";
        break;
      case "lastName":
        aValue = a.user?.lastName || "";
        bValue = b.user?.lastName || "";
        break;
      case "totalDuration":
        aValue = a.totalDuration || 0;
        bValue = b.totalDuration || 0;
        break;
      case "registeredAt":
      default:
        aValue = a.registeredAt || 0;
        bValue = b.registeredAt || 0;
        break;
    }

    // Handle string sorting
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    if (sortOrder === "asc") {
      return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
    } else {
      return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
    }
  });

  // Apply pagination
  const total = attendeesWithUsers.length;
  const paginatedAttendees = attendeesWithUsers.slice(offset, offset + limit);

  // Get enriched attendee data
  const enrichedAttendees = paginatedAttendees.map(attendee => {
    // Calculate eligibility based on minimum attendance time
    const minMinutes = event.minimumAttendanceMinutes || 0;
    const isEligible = attendee.totalDuration ? attendee.totalDuration >= (minMinutes * 60 * 1000) : false;

    return {
      id: attendee._id,
      eventId: attendee.eventId,
      userId: attendee.userId,
      totalDuration: attendee.totalDuration,
      isEligible,
      registeredAt: attendee.registeredAt,
      createdAt: attendee.createdAt,
      user: attendee.user ? {
        id: attendee.user._id,
        username: attendee.user.username,
        firstName: attendee.user.firstName,
        lastName: attendee.user.lastName,
        email: attendee.user.email,
        imageUrl: attendee.user.imageUrl,
      } : null,
    };
  });

  const totalPages = Math.ceil(total / limit);

  return {
    data: enrichedAttendees,
    meta: {
      total,
      page,
      limit,
      totalPages,
      event: {
        id: event._id,
        title: event.title,
        slug: event.slug,
      },
    },
  };
};
