import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";

import { QueryCtx } from "../../_generated/server";

export const getMyCreatedEventsArgs = {
  search: v.optional(v.string()),
  tags: v.optional(v.string()),
  pinned: v.optional(v.boolean()),
  type: v.optional(v.union(v.literal("IN_PERSON"), v.literal("VIRTUAL"), v.literal("HYBRID"), v.literal("OTHERS"))),
  sortOrder: v.optional(v.union(v.literal("asc"), v.literal("desc"))),
  sortBy: v.optional(v.union(v.literal("createdAt"), v.literal("updatedAt"), v.literal("startDate"), v.literal("endDate"), v.literal("title"))),
  limit: v.optional(v.number()),
  page: v.optional(v.number()),
};

export const getMyCreatedEventsHandler = async (
  ctx: QueryCtx,
  args: {
    search?: string;
    tags?: string;
    pinned?: boolean;
    type?: "IN_PERSON" | "VIRTUAL" | "HYBRID" | "OTHERS";
    sortOrder?: "asc" | "desc";
    sortBy?: "createdAt" | "updatedAt" | "startDate" | "endDate" | "title";
    limit?: number;
    page?: number;
  }
) => {
  const userId = await getAuthUserId(ctx);
  if (!userId) {
    throw new Error("Authentication required");
  }

  const currentUser = await ctx.db.get(userId);
  if (!currentUser?.username) {
    throw new Error("User not found");
  }

  const limit = args.limit || 10;
  const page = args.page || 1;
  const offset = (page - 1) * limit;

  // Get events created by the current user
  let events = await ctx.db
    .query("events")
    .withIndex("by_organizedBy", q => q.eq("organizedBy", currentUser.username!))
    .collect();

  // Apply search filter
  if (args.search) {
    const searchLower = args.search.toLowerCase();
    events = events.filter(event =>
      event.title.toLowerCase().includes(searchLower) ||
      (event.description && event.description.toLowerCase().includes(searchLower)) ||
      (event.tags && event.tags.some(tag => tag.toLowerCase().includes(searchLower)))
    );
  }

  // Apply tags filter
  if (args.tags) {
    const filterTags = args.tags.split(',').map(tag => tag.trim().toLowerCase());
    events = events.filter(event =>
      event.tags && event.tags.some(tag =>
        filterTags.some(filterTag => tag.toLowerCase().includes(filterTag))
      )
    );
  }

  // Apply type filter
  if (args.type) {
    events = events.filter(event => event.type === args.type);
  }

  // Apply pinned filter
  if (args.pinned !== undefined) {
    events = events.filter(event => event.isPinned === args.pinned);
  }

  // Sort events
  const sortBy = args.sortBy || "createdAt";
  const sortOrder = args.sortOrder || "desc";

  events.sort((a, b) => {
    let aValue: string | number | undefined = a[sortBy];
    let bValue: string | number | undefined = b[sortBy];

    if (sortBy === "title") {
      aValue = typeof aValue === 'string' ? aValue.toLowerCase() : String(aValue || "");
      bValue = typeof bValue === 'string' ? bValue.toLowerCase() : String(bValue || "");
    }

    if (aValue === undefined) aValue = 0;
    if (bValue === undefined) bValue = 0;

    if (sortOrder === "asc") {
      return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
    } else {
      return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
    }
  });

  // Apply pagination
  const total = events.length;
  const paginatedEvents = events.slice(offset, offset + limit);

  // Get enriched data for each event
  const enrichedEvents = await Promise.all(
    paginatedEvents.map(async (event) => {
      // Get attendee count
      const attendees = await ctx.db
        .query("eventAttendees")
        .withIndex("by_eventId", q => q.eq("eventId", event._id))
        .collect();

      // Get average rating
      const ratings = await ctx.db
        .query("eventOrganizerRatings")
        .withIndex("by_eventId", q => q.eq("eventId", event._id))
        .collect();

      const averageRating = ratings.length > 0
        ? ratings.reduce((sum, rating) => sum + rating.rating, 0) / ratings.length
        : null;

      // Get feedback form status
      const feedbackForm = await ctx.db
        .query("eventFeedbackForms")
        .withIndex("by_eventId", q => q.eq("eventId", event._id))
        .first();

      return {
        id: event._id,
        slug: event.slug,
        title: event.title,
        type: event.type,
        imageUrl: event.imageUrl,
        description: event.description,
        details: event.details,
        startDate: event.startDate,
        endDate: event.endDate,
        tags: event.tags || [],
        organizedBy: event.organizedBy,
        minimumAttendanceMinutes: event.minimumAttendanceMinutes,
        isPinned: event.isPinned,
        createdAt: event.createdAt,
        updatedAt: event.updatedAt,
        attendeeCount: attendees.length,
        averageRating,
        ratingCount: ratings.length,
        hasFeedbackForm: !!feedbackForm,
        feedbackFormActive: feedbackForm?.isActive || false,
      };
    })
  );

  const totalPages = Math.ceil(total / limit);

  return {
    data: enrichedEvents,
    meta: {
      total,
      page,
      limit,
      totalPages,
    },
  };
};
