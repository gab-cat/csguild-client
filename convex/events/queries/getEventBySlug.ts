import { v } from "convex/values";

import { QueryCtx } from "../../_generated/server";

export const getEventBySlugArgs = {
  slug: v.string(),
};

export const getEventBySlugHandler = async (
  ctx: QueryCtx,
  args: {
    slug: string;
  }
) => {
  // Get the event
  const event = await ctx.db
    .query("events")
    .withIndex("by_slug", q => q.eq("slug", args.slug))
    .first();

  if (!event) {
    return null;
  }

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

  // Get attendee details
  const attendeeDetails = await Promise.all(
    attendees.map(async (attendee) => {
      const user = await ctx.db
        .query("users")
        .withIndex("by_username", q => q.eq("username", attendee.userId))
        .first();

      return {
        id: attendee._id,
        userId: attendee.userId,
        totalDuration: attendee.totalDuration,
        isEligible: attendee.isEligible,
        registeredAt: attendee.registeredAt,
        user: user ? {
          id: user._id,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          imageUrl: user.imageUrl,
        } : null,
      };
    })
  );

  // Get average rating and rating count
  const ratings = await ctx.db
    .query("eventOrganizerRatings")
    .withIndex("by_eventId", q => q.eq("eventId", event._id))
    .collect();

  const averageRating = ratings.length > 0
    ? ratings.reduce((sum, rating) => sum + rating.rating, 0) / ratings.length
    : null;

  // Get feedback form if exists
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
    organizer: organizer ? {
      id: organizer._id,
      username: organizer.username,
      firstName: organizer.firstName,
      lastName: organizer.lastName,
      email: organizer.email,
      course: organizer.course,
      imageUrl: organizer.imageUrl,
    } : null,
    attendees: attendeeDetails,
    attendeeCount: attendees.length,
    averageRating,
    ratingCount: ratings.length,
    feedbackForm: feedbackForm ? {
      id: feedbackForm._id,
      title: feedbackForm.title,
      fields: feedbackForm.fields,
      isActive: feedbackForm.isActive,
      createdAt: feedbackForm.createdAt,
    } : null,
  };
};
