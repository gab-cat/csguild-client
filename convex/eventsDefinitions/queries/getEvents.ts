import { v } from "convex/values";

import { QueryCtx } from "../../_generated/server";

export const getEventsArgs = {
  search: v.optional(v.string()),
  tags: v.optional(v.string()),
  organizerSlug: v.optional(v.string()),
  pinned: v.optional(v.boolean()),
  type: v.optional(v.union(v.literal("IN_PERSON"), v.literal("VIRTUAL"), v.literal("HYBRID"), v.literal("OTHERS"))),
  sortOrder: v.optional(v.union(v.literal("asc"), v.literal("desc"))),
  sortBy: v.optional(v.union(v.literal("createdAt"), v.literal("updatedAt"), v.literal("startDate"), v.literal("endDate"), v.literal("title"))),
  limit: v.optional(v.number()),
  page: v.optional(v.number()),
};

export const getEventsHandler = async (
  ctx: QueryCtx,
  args: {
    search?: string;
    tags?: string;
    organizerSlug?: string;
    pinned?: boolean;
    type?: "IN_PERSON" | "VIRTUAL" | "HYBRID" | "OTHERS";
    sortOrder?: "asc" | "desc";
    sortBy?: "createdAt" | "updatedAt" | "startDate" | "endDate" | "title";
    limit?: number;
    page?: number;
  }
) => {
  const limit = args.limit || 10;
  const page = args.page || 1;
  const offset = (page - 1) * limit;

  // Start with all events, using appropriate index
  let events;
  if (args.organizerSlug) {
    events = await ctx.db
      .query("events")
      .withIndex("by_organizedBy", q => q.eq("organizedBy", args.organizerSlug!))
      .collect();
  } else if (args.pinned !== undefined) {
    events = await ctx.db
      .query("events")
      .withIndex("by_isPinned", q => q.eq("isPinned", args.pinned))
      .collect();
  } else {
    // Use startDate index for general queries, ordered by start date
    events = await ctx.db
      .query("events")
      .withIndex("by_startDate")
      .collect();
  }

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

  // Apply pinned filter if not already applied via index
  if (args.pinned !== undefined && !args.organizerSlug) {
    events = events.filter(event => event.isPinned === args.pinned);
  }

  // Apply organizer filter if not already applied via index
  if (args.organizerSlug && args.pinned === undefined) {
    events = events.filter(event => event.organizedBy === args.organizerSlug);
  }

  // Sort events
  const sortBy = args.sortBy || "startDate";
  const sortOrder = args.sortOrder || "asc";

  events.sort((a, b) => {
    let aValue: string | number | undefined = a[sortBy];
    let bValue: string | number | undefined = b[sortBy];

    if (sortBy === "title") {
      aValue = typeof aValue === 'string' ? aValue.toLowerCase() : String(aValue || "");
      bValue = typeof bValue === 'string' ? bValue.toLowerCase() : String(bValue || "");
    }

    if (aValue === undefined) aValue = sortBy === "startDate" ? Date.now() + 1000000 : 0; // Future date for undefined start dates
    if (bValue === undefined) bValue = sortBy === "startDate" ? Date.now() + 1000000 : 0;

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

      // Get organizer info
      const organizer = await ctx.db
        .query("users")
        .withIndex("by_username", q => q.eq("username", event.organizedBy))
        .first();

      // Get average rating
      const ratings = await ctx.db
        .query("eventOrganizerRatings")
        .withIndex("by_eventId", q => q.eq("eventId", event._id))
        .collect();

      const averageRating = ratings.length > 0
        ? ratings.reduce((sum, rating) => sum + rating.rating, 0) / ratings.length
        : null;

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
        organizer: organizer ? {
          id: organizer._id,
          username: organizer.username,
          firstName: organizer.firstName,
          lastName: organizer.lastName,
          imageUrl: organizer.imageUrl,
        } : null,
        attendeeCount: attendees.length,
        averageRating,
        ratingCount: ratings.length,
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
