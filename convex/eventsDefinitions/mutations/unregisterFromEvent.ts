import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";

import { MutationCtx } from "../../_generated/server";

export const unregisterFromEventArgs = {
  slug: v.string(),
};

export const unregisterFromEventHandler = async (
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

  // Find the attendee record
  const attendee = await ctx.db
    .query("eventAttendees")
    .withIndex("by_eventId_userId", q =>
      q.eq("eventId", event._id).eq("userId", currentUser.username!)
    )
    .first();

  if (!attendee) {
    throw new Error("User is not registered for this event");
  }

  // Check if event has already started - might want to prevent unregistration
  if (event.startDate < Date.now()) {
    throw new Error("Cannot unregister from an event that has already started");
  }

  // Delete all sessions for this attendee
  const sessions = await ctx.db
    .query("eventSessions")
    .withIndex("by_attendeeId", q => q.eq("attendeeId", attendee._id))
    .collect();

  for (const session of sessions) {
    await ctx.db.delete(session._id);
  }

  // Delete the attendee record
  await ctx.db.delete(attendee._id);

  return {
    success: true,
    message: "Successfully unregistered from event",
    event: {
      id: event._id,
      slug: event.slug,
      title: event.title,
    },
  };
};
