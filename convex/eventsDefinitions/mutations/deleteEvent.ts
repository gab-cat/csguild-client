import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";

import { MutationCtx } from "../../_generated/server";

export const deleteEventArgs = {
  slug: v.string(),
};

export const deleteEventHandler = async (
  ctx: MutationCtx,
  args: {
    slug: string;
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

  // Find the event by slug
  const event = await ctx.db
    .query("events")
    .withIndex("by_slug", q => q.eq("slug", args.slug))
    .first();

  if (!event) {
    throw new Error("Event not found");
  }

  // Check if the current user is the organizer
  if (event.organizedBy !== currentUser.username) {
    throw new Error("Only the event organizer can delete the event");
  }

  // Get all related data that needs to be cleaned up
  const attendees = await ctx.db
    .query("eventAttendees")
    .withIndex("by_eventId", q => q.eq("eventId", event._id))
    .collect();

  const feedbackForms = await ctx.db
    .query("eventFeedbackForms")
    .withIndex("by_eventId", q => q.eq("eventId", event._id))
    .collect();

  const organizerRatings = await ctx.db
    .query("eventOrganizerRatings")
    .withIndex("by_eventId", q => q.eq("eventId", event._id))
    .collect();

  // Delete feedback responses for each form
  for (const form of feedbackForms) {
    const responses = await ctx.db
      .query("eventFeedbackResponses")
      .withIndex("by_formId", q => q.eq("formId", form._id))
      .collect();

    for (const response of responses) {
      await ctx.db.delete(response._id);
    }
  }

  // Delete feedback forms
  for (const form of feedbackForms) {
    await ctx.db.delete(form._id);
  }

  // Delete organizer ratings
  for (const rating of organizerRatings) {
    await ctx.db.delete(rating._id);
  }

  // Delete event sessions and attendees
  for (const attendee of attendees) {
    // Delete sessions for this attendee
    const sessions = await ctx.db
      .query("eventSessions")
      .withIndex("by_attendeeId", q => q.eq("attendeeId", attendee._id))
      .collect();

    for (const session of sessions) {
      await ctx.db.delete(session._id);
    }

    // Delete attendee record
    await ctx.db.delete(attendee._id);
  }

  // Finally, delete the event
  await ctx.db.delete(event._id);

  return {
    success: true,
    message: "Event deleted successfully",
    deletedEvent: {
      id: event._id,
      slug: event.slug,
      title: event.title,
    },
  };
};
