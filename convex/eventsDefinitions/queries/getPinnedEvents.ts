import { QueryCtx } from "../../_generated/server";

export const getPinnedEventsArgs = {};

export const getPinnedEventsHandler = async (ctx: QueryCtx) => {
  // Get all pinned events
  const events = await ctx.db
    .query("events")
    .withIndex("by_isPinned", q => q.eq("isPinned", true))
    .collect();

  // Sort by creation date (most recent first)
  events.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

  // Get enriched data for each event
  const enrichedEvents = await Promise.all(
    events.map(async (event) => {
      // Get organizer info
      const organizer = await ctx.db
        .query("users")
        .withIndex("by_username", q => q.eq("username", event.organizedBy))
        .first();

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

      return {
        id: event._id,
        slug: event.slug,
        title: event.title,
        type: event.type,
        imageUrl: event.imageUrl,
        description: event.description,
        startDate: event.startDate,
        endDate: event.endDate,
        tags: event.tags || [],
        organizedBy: event.organizedBy,
        minimumAttendanceMinutes: event.minimumAttendanceMinutes,
        isPinned: event.isPinned,
        createdAt: event.createdAt,
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

  return {
    data: enrichedEvents,
    total: enrichedEvents.length,
  };
};
