import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";

import { MutationCtx } from "../../_generated/server";

export const registerForEventArgs = {
  slug: v.string(),
};

export const registerForEventHandler = async (
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

  // Check if event is in the future (can't register for past events)
  if (event.startDate < Date.now()) {
    throw new Error("Cannot register for past events");
  }

  // Check if user is already registered
  const existingRegistration = await ctx.db
    .query("eventAttendees")
    .withIndex("by_eventId_userId", q =>
      q.eq("eventId", event._id).eq("userId", currentUser.username!)
    )
    .first();

  if (existingRegistration) {
    throw new Error("User is already registered for this event");
  }

  const now = Date.now();

  // Create attendee record
  const attendeeId = await ctx.db.insert("eventAttendees", {
    eventId: event._id,
    userId: currentUser.username,
    totalDuration: 0,
    isEligible: false,
    registeredAt: now,
    createdAt: now,
    updatedAt: now,
  });

  // Get the created attendee record
  const attendee = await ctx.db.get(attendeeId);
  if (!attendee) {
    throw new Error("Failed to register for event");
  }

  return {
    success: true,
    message: "Successfully registered for event",
    registration: {
      id: attendee._id,
      eventId: attendee.eventId,
      userId: attendee.userId,
      registeredAt: attendee.registeredAt,
      totalDuration: attendee.totalDuration,
      isEligible: attendee.isEligible,
    },
    event: {
      id: event._id,
      slug: event.slug,
      title: event.title,
      startDate: event.startDate,
      endDate: event.endDate,
    },
  };
};
