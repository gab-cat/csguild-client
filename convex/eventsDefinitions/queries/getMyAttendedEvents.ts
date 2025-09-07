import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";

import { QueryCtx } from "../../_generated/server";

export const getMyAttendedEventsArgs = {
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

export const getMyAttendedEventsHandler = async (
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

  // Get attendee records for the current user
  const attendeeRecords = await ctx.db
    .query("eventAttendees")
    .withIndex("by_userId", q => q.eq("userId", currentUser.username!))
    .collect();

  // Get the corresponding events
  const events = await Promise.all(
    attendeeRecords.map(async (attendee) => {
      const event = await ctx.db.get(attendee.eventId);
      return event ? { ...event, attendeeInfo: attendee } : null;
    })
  );

  // Filter out null events
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let validEvents = events.filter(event => event !== null) as Array<any>;

  // Apply search filter
  if (args.search) {
    const searchLower = args.search.toLowerCase();
    validEvents = validEvents.filter(event =>
      event.title.toLowerCase().includes(searchLower) ||
      (event.description && event.description.toLowerCase().includes(searchLower)) ||
      (event.tags && event.tags.some((tag: string) => tag.toLowerCase().includes(searchLower)))
    );
  }

  // Apply tags filter
  if (args.tags) {
    const filterTags = args.tags.split(',').map(tag => tag.trim().toLowerCase());
    validEvents = validEvents.filter(event =>
      event.tags && event.tags.some((tag: string) =>
        filterTags.some(filterTag => tag.toLowerCase().includes(filterTag))
      )
    );
  }

  // Apply organizer filter
  if (args.organizerSlug) {
    validEvents = validEvents.filter(event => event.organizedBy === args.organizerSlug);
  }

  // Apply type filter
  if (args.type) {
    validEvents = validEvents.filter(event => event.type === args.type);
  }

  // Apply pinned filter
  if (args.pinned !== undefined) {
    validEvents = validEvents.filter(event => event.isPinned === args.pinned);
  }

  // Sort events
  const sortBy = args.sortBy || "startDate";
  const sortOrder = args.sortOrder || "desc";

  validEvents.sort((a, b) => {
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
  const total = validEvents.length;
  const paginatedEvents = validEvents.slice(offset, offset + limit);

  // Get enriched data for each event
  const enrichedEvents = await Promise.all(
    paginatedEvents.map(async (event) => {
      // Get organizer info
      const organizer = await ctx.db
        .query("users")
        .withIndex("by_username", q => q.eq("username", event.organizedBy))
        .first();

      // Get total attendee count for the event
      const allAttendees = await ctx.db
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

      // Get feedback form to check if user has submitted
      const feedbackForm = await ctx.db
        .query("eventFeedbackForms")
        .withIndex("by_eventId", q => q.eq("eventId", event._id))
        .first();

      let hasSubmittedFeedback = false;
      if (feedbackForm && currentUser.username) {
        const feedbackResponse = await ctx.db
          .query("eventFeedbackResponses")
          .withIndex("by_formId_userId", q =>
            q.eq("formId", feedbackForm._id).eq("userId", currentUser.username!)
          )
          .first();
        hasSubmittedFeedback = !!feedbackResponse;
      }

      // Check if user has rated the organizer
      const userRating = currentUser.username ? await ctx.db
        .query("eventOrganizerRatings")
        .withIndex("by_eventId_userId", q =>
          q.eq("eventId", event._id).eq("userId", currentUser.username!)
        )
        .first() : null;

      // Calculate attendance data from sessions (more accurate than stored values)
      const sessions = await ctx.db
        .query("eventSessions")
        .withIndex("by_attendeeId", q => q.eq("attendeeId", event.attendeeInfo._id))
        .collect();

      let calculatedTotalDuration = 0;
      for (const session of sessions) {
        const sessionStart = session.startedAt || 0;
        const sessionEnd = session.endedAt || 0;
        const sessionDuration = typeof session.duration === 'number' ? session.duration : (sessionEnd && sessionStart ? Math.max(0, sessionEnd - sessionStart) : 0);
        calculatedTotalDuration += sessionDuration;
      }

      const minMinutes = event.minimumAttendanceMinutes || 0;
      const calculatedIsEligible = calculatedTotalDuration >= (minMinutes * 60 * 1000);

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
        attendeeCount: allAttendees.length,
        averageRating,
        ratingCount: ratings.length,
        myAttendance: {
          totalDuration: calculatedTotalDuration,
          isEligible: calculatedIsEligible,
          registeredAt: event.attendeeInfo.registeredAt || event.attendeeInfo.createdAt || Date.now(),
        },
        hasSubmittedFeedback,
        hasRatedOrganizer: !!userRating,
        myRating: userRating ? userRating.rating : null,
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
