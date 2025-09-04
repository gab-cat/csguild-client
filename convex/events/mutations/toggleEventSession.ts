import { v } from "convex/values";

import { MutationCtx } from "../../_generated/server";

export const toggleEventSessionArgs = {
  rfidId: v.string(),
  eventSlug: v.string(),
};

export const toggleEventSessionHandler = async (
  ctx: MutationCtx,
  args: {
    rfidId: string;
    eventSlug: string;
  }
) => {
  // Find user by RFID ID
  const user = await ctx.db
    .query("users")
    .withIndex("by_rfidId", q => q.eq("rfidId", args.rfidId))
    .first();

  if (!user?.username) {
    throw new Error("User not found with provided RFID");
  }

  // Find the event by slug
  const event = await ctx.db
    .query("events")
    .withIndex("by_slug", q => q.eq("slug", args.eventSlug))
    .first();

  if (!event) {
    throw new Error("Event not found");
  }

  // Check if user is registered for the event
  const attendee = await ctx.db
    .query("eventAttendees")
    .withIndex("by_eventId_userId", q =>
      q.eq("eventId", event._id).eq("userId", user.username!)
    )
    .first();

  if (!attendee) {
    throw new Error("User is not registered for this event");
  }

  const now = Date.now();

  // Check if there's an active session (no endedAt)
  const activeSession = await ctx.db
    .query("eventSessions")
    .withIndex("by_attendeeId", q => q.eq("attendeeId", attendee._id))
    .filter(q => q.eq(q.field("endedAt"), undefined))
    .first();

  let result;

  if (activeSession) {
    // Check-out: End the active session
    const duration = now - (activeSession.startedAt || now);
    await ctx.db.patch(activeSession._id, {
      endedAt: now,
      duration: duration,
      updatedAt: now,
    });

    // Update attendee's total duration
    const newTotalDuration = (attendee.totalDuration || 0) + duration;
    await ctx.db.patch(attendee._id, {
      totalDuration: newTotalDuration,
      updatedAt: now,
    });

    result = {
      action: "check-out",
      sessionId: activeSession._id,
      duration: duration,
      totalDuration: newTotalDuration,
      message: "Successfully checked out from event",
    };
  } else {
    // Check-in: Start a new session
    const sessionId = await ctx.db.insert("eventSessions", {
      attendeeId: attendee._id,
      startedAt: now,
      createdAt: now,
      updatedAt: now,
    });

    result = {
      action: "check-in",
      sessionId: sessionId,
      message: "Successfully checked in to event",
    };
  }

  // Get updated attendee info
  const updatedAttendee = await ctx.db.get(attendee._id);
  if (!updatedAttendee) {
    throw new Error("Failed to update attendee record");
  }

  return {
    success: true,
    ...result,
    attendee: {
      id: updatedAttendee._id,
      userId: updatedAttendee.userId,
      totalDuration: updatedAttendee.totalDuration,
      isEligible: updatedAttendee.isEligible,
    },
    user: {
      id: user._id,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      imageUrl: user.imageUrl,
    },
    event: {
      id: event._id,
      slug: event.slug,
      title: event.title,
    },
    timestamp: now,
  };
};
