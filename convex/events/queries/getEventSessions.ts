import { v } from "convex/values";

import { QueryCtx } from "../../_generated/server";

export const getEventSessionsArgs = {
  eventSlug: v.string(),
};

export const getEventSessionsHandler = async (
  ctx: QueryCtx,
  args: {
    eventSlug: string;
  }
) => {
  // Find the event by slug
  const event = await ctx.db
    .query("events")
    .withIndex("by_slug", q => q.eq("slug", args.eventSlug))
    .first();

  if (!event) {
    throw new Error("Event not found");
  }

  // Get all attendees for this event
  const attendees = await ctx.db
    .query("eventAttendees")
    .withIndex("by_eventId", q => q.eq("eventId", event._id))
    .collect();

  // Get all sessions for these attendees
  const allSessions = await Promise.all(
    attendees.map(async (attendee) => {
      const sessions = await ctx.db
        .query("eventSessions")
        .withIndex("by_attendeeId", q => q.eq("attendeeId", attendee._id))
        .collect();

      // Get user info for this attendee
      const user = await ctx.db
        .query("users")
        .withIndex("by_username", q => q.eq("username", attendee.userId))
        .first();

      return sessions.map(session => ({
        ...session,
        attendee: {
          id: attendee._id,
          userId: attendee.userId,
          totalDuration: attendee.totalDuration,
          isEligible: attendee.isEligible,
          user: user ? {
            id: user._id,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            imageUrl: user.imageUrl,
          } : null,
        },
      }));
    })
  );

  // Flatten the array of arrays
  const sessions = allSessions.flat();

  // Sort sessions by start time (most recent first)
  sessions.sort((a, b) => (b.startedAt || 0) - (a.startedAt || 0));

  // Calculate session statistics
  const totalSessions = sessions.length;
  const activeSessions = sessions.filter(session => !session.endedAt).length;
  const completedSessions = totalSessions - activeSessions;

  // Calculate total duration across all sessions
  const totalDuration = sessions.reduce((sum, session) => {
    return sum + (session.duration || 0);
  }, 0);

  // Group sessions by user for summary
  const sessionsByUser = sessions.reduce((acc, session) => {
    const userId = session.attendee.userId;
    if (!acc[userId]) {
      acc[userId] = {
        user: session.attendee.user,
        sessions: [],
        totalDuration: 0,
        sessionCount: 0,
      };
    }

    acc[userId].sessions.push({
      id: session._id,
      startedAt: session.startedAt,
      endedAt: session.endedAt,
      duration: session.duration,
      createdAt: session.createdAt,
    });

    acc[userId].totalDuration += session.duration || 0;
    acc[userId].sessionCount += 1;

    return acc;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }, {} as Record<string, any>);

  return {
    event: {
      id: event._id,
      slug: event.slug,
      title: event.title,
      startDate: event.startDate,
      endDate: event.endDate,
    },
    sessions: sessions.map(session => ({
      id: session._id,
      attendeeId: session.attendeeId,
      startedAt: session.startedAt,
      endedAt: session.endedAt,
      duration: session.duration,
      createdAt: session.createdAt,
      attendee: session.attendee,
    })),
    summary: {
      totalSessions,
      activeSessions,
      completedSessions,
      totalDuration,
      uniqueAttendees: Object.keys(sessionsByUser).length,
    },
    byUser: Object.values(sessionsByUser),
  };
};
