import { v } from "convex/values";

import { QueryCtx } from "../../_generated/server";

export const getEventWithFeedbackFormPublicArgs = {
  eventSlug: v.string(),
  token: v.string(),
  userId: v.string(),
};

export const getEventWithFeedbackFormPublicHandler = async (
  ctx: QueryCtx,
  args: {
    eventSlug: string;
    token: string;
    userId: string;
  }
) => {
  // In a real implementation, you would validate the JWT token here
  // For now, we'll proceed with the userId and token as provided

  // Find the user
  const user = await ctx.db
    .query("users")
    .withIndex("by_username", q => q.eq("username", args.userId))
    .first();

  if (!user) {
    throw new Error("Invalid access token or user not found");
  }

  // Find the event
  const event = await ctx.db
    .query("events")
    .withIndex("by_slug", q => q.eq("slug", args.eventSlug))
    .first();

  if (!event) {
    throw new Error("Event not found");
  }

  // Verify user is registered for this event
  const attendee = await ctx.db
    .query("eventAttendees")
    .withIndex("by_eventId_userId", q =>
      q.eq("eventId", event._id).eq("userId", args.userId)
    )
    .first();

  if (!attendee) {
    throw new Error("User is not registered for this event");
  }

  // Get organizer info
  const organizer = await ctx.db
    .query("users")
    .withIndex("by_username", q => q.eq("username", event.organizedBy))
    .first();

  // Get feedback form if it exists
  const feedbackForm = await ctx.db
    .query("eventFeedbackForms")
    .withIndex("by_eventId", q => q.eq("eventId", event._id))
    .first();

  return {
    event: {
      id: event._id,
      slug: event.slug,
      title: event.title,
      type: event.type,
      imageUrl: event.imageUrl,
      description: event.description,
      details: event.details,
      startDate: new Date(event.startDate).toISOString(),
      endDate: event.endDate ? new Date(event.endDate).toISOString() : undefined,
      tags: event.tags || [],
      organizedBy: event.organizedBy,
      minimumAttendanceMinutes: event.minimumAttendanceMinutes,
      isPinned: event.isPinned,
      createdAt: event.createdAt ? new Date(event.createdAt).toISOString() : new Date().toISOString(),
      updatedAt: event.updatedAt ? new Date(event.updatedAt).toISOString() : new Date().toISOString(),
      organizer: organizer ? {
        id: organizer._id,
        username: organizer.username,
        firstName: organizer.firstName,
        lastName: organizer.lastName,
        imageUrl: organizer.imageUrl,
      } : null,
    },
    feedbackForm: feedbackForm ? {
      id: feedbackForm._id,
      title: feedbackForm.title,
      fields: feedbackForm.fields,
      isActive: feedbackForm.isActive,
      createdAt: feedbackForm.createdAt ? new Date(feedbackForm.createdAt).toISOString() : new Date().toISOString(),
    } : null,
  };
};
