import { v } from "convex/values";

import { QueryCtx } from "../../_generated/server";

export const getOrganizerStatisticsArgs = {
  username: v.string(),
};

export const getOrganizerStatisticsHandler = async (
  ctx: QueryCtx,
  args: {
    username: string;
  }
) => {
  // Get the organizer user
  const organizer = await ctx.db
    .query("users")
    .withIndex("by_username", q => q.eq("username", args.username))
    .first();

  if (!organizer) {
    throw new Error("Organizer not found");
  }

  // Get all events organized by this user
  const events = await ctx.db
    .query("events")
    .withIndex("by_organizedBy", q => q.eq("organizedBy", args.username))
    .collect();

  // Calculate event statistics
  const totalEvents = events.length;
  const activeEvents = events.filter(event => event.endDate && event.endDate > Date.now()).length;
  const pastEvents = totalEvents - activeEvents;
  const pinnedEvents = events.filter(event => event.isPinned).length;

  // Get attendee statistics
  const attendeeStats = await Promise.all(
    events.map(async (event) => {
      const attendees = await ctx.db
        .query("eventAttendees")
        .withIndex("by_eventId", q => q.eq("eventId", event._id))
        .collect();

      const attendeeCount = attendees.length;

      // Get average rating for this event
      const ratings = await ctx.db
        .query("eventOrganizerRatings")
        .withIndex("by_eventId", q => q.eq("eventId", event._id))
        .collect();

      const averageRating = ratings.length > 0
        ? ratings.reduce((sum, rating) => sum + rating.rating, 0) / ratings.length
        : null;

      return {
        eventId: event._id,
        eventTitle: event.title,
        attendeeCount,
        averageRating,
        ratingCount: ratings.length,
        startDate: event.startDate,
        endDate: event.endDate,
      };
    })
  );

  // Calculate overall statistics
  const totalAttendees = attendeeStats.reduce((sum, stat) => sum + stat.attendeeCount, 0);
  const totalRatings = attendeeStats.reduce((sum, stat) => sum + stat.ratingCount, 0);

  // Calculate overall average rating and distribution
  const allRatings = await Promise.all(
    events.map(async (event) => {
      const ratings = await ctx.db
        .query("eventOrganizerRatings")
        .withIndex("by_eventId", q => q.eq("eventId", event._id))
        .collect();
      return ratings.map(r => r.rating);
    })
  );
  const flattenedRatings = allRatings.flat();
  const overallAverageRating = flattenedRatings.length > 0
    ? flattenedRatings.reduce((sum, rating) => sum + rating, 0) / flattenedRatings.length
    : null;
  const ratingDistribution = flattenedRatings.reduce((acc: Record<string, number>, r) => {
    const key = String(Math.round(r));
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Get recent events (last 10)
  const recentEvents = events
    .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
    .slice(0, 10)
    .map(event => ({
      id: event._id,
      slug: event.slug,
      title: event.title,
      startDate: event.startDate,
      endDate: event.endDate,
      attendeeCount: attendeeStats.find(stat => stat.eventId === event._id)?.attendeeCount || 0,
      averageRating: attendeeStats.find(stat => stat.eventId === event._id)?.averageRating || null,
    }));

  // Get events by type
  const eventsByType = events.reduce((acc, event) => {
    const type = event.type || 'OTHERS';
    if (!acc[type]) {
      acc[type] = { count: 0, attendees: 0 };
    }
    acc[type].count += 1;
    acc[type].attendees += attendeeStats.find(stat => stat.eventId === event._id)?.attendeeCount || 0;
    return acc;
  }, {} as Record<string, { count: number; attendees: number }>);

  // Get events by month (for the last 12 months)
  const now = new Date();
  const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 12, 1).getTime();

  const eventsByMonth = events
    .filter(event => (event.createdAt || 0) >= twelveMonthsAgo)
    .reduce((acc, event) => {
      const date = new Date(event.createdAt || 0);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

      if (!acc[monthKey]) {
        acc[monthKey] = { count: 0, attendees: 0 };
      }
      acc[monthKey].count += 1;
      acc[monthKey].attendees += attendeeStats.find(stat => stat.eventId === event._id)?.attendeeCount || 0;

      return acc;
    }, {} as Record<string, { count: number; attendees: number }>);

  return {
    organizer: {
      id: organizer._id,
      username: organizer.username,
      firstName: organizer.firstName,
      lastName: organizer.lastName,
      email: organizer.email,
      course: organizer.course,
      imageUrl: organizer.imageUrl,
    },
    statistics: {
      totalEvents,
      activeEvents,
      pastEvents,
      pinnedEvents,
      totalAttendees,
      totalRatings,
      overallAverageRating,
      averageRating: overallAverageRating,
      totalEventsOrganized: totalEvents,
      ratingDistribution,
    },
    eventsByType,
    eventsByMonth,
    recentEvents,
    topRatedEvents: attendeeStats
      .filter(stat => stat.averageRating !== null)
      .sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0))
      .slice(0, 5),
    mostAttendedEvents: attendeeStats
      .sort((a, b) => b.attendeeCount - a.attendeeCount)
      .slice(0, 5),
  };
};
