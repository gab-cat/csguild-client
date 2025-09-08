import { v } from "convex/values";

import { query, mutation } from "./_generated/server";

// Calendar Event CRUD Operations

/**
 * Create a new calendar event
 */
export const createCalendarEvent = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    startDate: v.number(),
    endDate: v.optional(v.number()),
    startTime: v.optional(v.string()),
    endTime: v.optional(v.string()),
    isAllDay: v.optional(v.boolean()),
    color: v.optional(v.string()),
    location: v.optional(v.string()),
    category: v.optional(v.union(v.literal("MEETING"), v.literal("DEADLINE"), v.literal("EVENT"), v.literal("REMINDER"), v.literal("OTHER"))),
    priority: v.optional(v.union(v.literal("LOW"), v.literal("MEDIUM"), v.literal("HIGH"), v.literal("URGENT"))),
    createdBy: v.string(),
    attendees: v.optional(v.array(v.string())),
    status: v.optional(v.union(v.literal("SCHEDULED"), v.literal("CANCELLED"), v.literal("COMPLETED"), v.literal("POSTPONED"))),
  },
  returns: v.id("calendarEvents"),
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("calendarEvents", {
      ...args,
      status: args.status || "SCHEDULED",
      category: args.category || "OTHER",
      priority: args.priority || "MEDIUM",
      isAllDay: args.isAllDay || false,
      createdAt: now,
      updatedAt: now,
    });
  },
});

/**
 * Get calendar events for a specific date range
 */
export const getCalendarEvents = query({
  args: {
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
    category: v.optional(v.union(v.literal("MEETING"), v.literal("DEADLINE"), v.literal("EVENT"), v.literal("REMINDER"), v.literal("OTHER"))),
    createdBy: v.optional(v.string()),
  },
  returns: v.array(v.object({
    _id: v.id("calendarEvents"),
    _creationTime: v.number(),
    title: v.string(),
    description: v.optional(v.string()),
    startDate: v.number(),
    endDate: v.optional(v.number()),
    startTime: v.optional(v.string()),
    endTime: v.optional(v.string()),
    isAllDay: v.optional(v.boolean()),
    color: v.optional(v.string()),
    location: v.optional(v.string()),
    category: v.optional(v.union(v.literal("MEETING"), v.literal("DEADLINE"), v.literal("EVENT"), v.literal("REMINDER"), v.literal("OTHER"))),
    priority: v.optional(v.union(v.literal("LOW"), v.literal("MEDIUM"), v.literal("HIGH"), v.literal("URGENT"))),
    createdBy: v.string(),
    attendees: v.optional(v.array(v.string())),
    status: v.optional(v.union(v.literal("SCHEDULED"), v.literal("CANCELLED"), v.literal("COMPLETED"), v.literal("POSTPONED"))),
    createdAt: v.optional(v.number()),
    updatedAt: v.optional(v.number()),
  })),
  handler: async (ctx, args) => {
    // Filter by date range if provided
    let query;
    if (args.startDate && args.endDate) {
      query = ctx.db.query("calendarEvents").withIndex("by_startDate", (q) =>
        q.gte("startDate", args.startDate!).lte("startDate", args.endDate!)
      );
    } else if (args.startDate) {
      query = ctx.db.query("calendarEvents").withIndex("by_startDate", (q) =>
        q.gte("startDate", args.startDate!)
      );
    } else {
      query = ctx.db.query("calendarEvents");
    }

    let events = await query.collect();

    // Apply additional filters
    if (args.category) {
      events = events.filter(event => event.category === args.category);
    }

    if (args.createdBy) {
      events = events.filter(event => event.createdBy === args.createdBy);
    }

    return events.sort((a, b) => a.startDate - b.startDate);
  },
});

/**
 * Get a single calendar event by ID
 */
export const getCalendarEvent = query({
  args: { id: v.id("calendarEvents") },
  returns: v.union(
    v.object({
      _id: v.id("calendarEvents"),
      _creationTime: v.number(),
      title: v.string(),
      description: v.optional(v.string()),
      startDate: v.number(),
      endDate: v.optional(v.number()),
      startTime: v.optional(v.string()),
      endTime: v.optional(v.string()),
      isAllDay: v.optional(v.boolean()),
      color: v.optional(v.string()),
      location: v.optional(v.string()),
      category: v.optional(v.union(v.literal("MEETING"), v.literal("DEADLINE"), v.literal("EVENT"), v.literal("REMINDER"), v.literal("OTHER"))),
      priority: v.optional(v.union(v.literal("LOW"), v.literal("MEDIUM"), v.literal("HIGH"), v.literal("URGENT"))),
      createdBy: v.string(),
      attendees: v.optional(v.array(v.string())),
      status: v.optional(v.union(v.literal("SCHEDULED"), v.literal("CANCELLED"), v.literal("COMPLETED"), v.literal("POSTPONED"))),
      createdAt: v.optional(v.number()),
      updatedAt: v.optional(v.number()),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

/**
 * Update a calendar event
 */
export const updateCalendarEvent = mutation({
  args: {
    id: v.id("calendarEvents"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
    startTime: v.optional(v.string()),
    endTime: v.optional(v.string()),
    isAllDay: v.optional(v.boolean()),
    color: v.optional(v.string()),
    location: v.optional(v.string()),
    category: v.optional(v.union(v.literal("MEETING"), v.literal("DEADLINE"), v.literal("EVENT"), v.literal("REMINDER"), v.literal("OTHER"))),
    priority: v.optional(v.union(v.literal("LOW"), v.literal("MEDIUM"), v.literal("HIGH"), v.literal("URGENT"))),
    attendees: v.optional(v.array(v.string())),
    status: v.optional(v.union(v.literal("SCHEDULED"), v.literal("CANCELLED"), v.literal("COMPLETED"), v.literal("POSTPONED"))),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const { id, ...updateData } = args;
    
    // Filter out undefined values
    const filteredUpdateData = Object.fromEntries(
      Object.entries(updateData).filter(([, value]) => value !== undefined)
    );
    
    if (Object.keys(filteredUpdateData).length > 0) {
      await ctx.db.patch(id, {
        ...filteredUpdateData,
        updatedAt: Date.now(),
      });
    }
    
    return null;
  },
});

/**
 * Delete a calendar event
 */
export const deleteCalendarEvent = mutation({
  args: { id: v.id("calendarEvents") },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return null;
  },
});

/**
 * Get calendar events for current month
 */
export const getCurrentMonthEvents = query({
  args: {
    year: v.number(),
    month: v.number(), // 0-based month (0 = January)
    createdBy: v.optional(v.string()),
  },
  returns: v.array(v.object({
    _id: v.id("calendarEvents"),
    _creationTime: v.number(),
    title: v.string(),
    description: v.optional(v.string()),
    startDate: v.number(),
    endDate: v.optional(v.number()),
    startTime: v.optional(v.string()),
    endTime: v.optional(v.string()),
    isAllDay: v.optional(v.boolean()),
    color: v.optional(v.string()),
    location: v.optional(v.string()),
    category: v.optional(v.union(v.literal("MEETING"), v.literal("DEADLINE"), v.literal("EVENT"), v.literal("REMINDER"), v.literal("OTHER"))),
    priority: v.optional(v.union(v.literal("LOW"), v.literal("MEDIUM"), v.literal("HIGH"), v.literal("URGENT"))),
    createdBy: v.string(),
    attendees: v.optional(v.array(v.string())),
    status: v.optional(v.union(v.literal("SCHEDULED"), v.literal("CANCELLED"), v.literal("COMPLETED"), v.literal("POSTPONED"))),
    createdAt: v.optional(v.number()),
    updatedAt: v.optional(v.number()),
  })),
  handler: async (ctx, args) => {
    // Calculate start and end of month
    const startOfMonth = new Date(args.year, args.month, 1).getTime();
    const endOfMonth = new Date(args.year, args.month + 1, 0, 23, 59, 59, 999).getTime();

    const query = ctx.db.query("calendarEvents")
      .withIndex("by_startDate", (q) =>
        q.gte("startDate", startOfMonth).lte("startDate", endOfMonth)
      );

    let events = await query.collect();

    // Filter by creator if specified
    if (args.createdBy) {
      events = events.filter(event => event.createdBy === args.createdBy);
    }

    return events.sort((a, b) => a.startDate - b.startDate);
  },
});

/**
 * Get upcoming events (next 7 days)
 */
export const getUpcomingEvents = query({
  args: {
    createdBy: v.optional(v.string()),
    days: v.optional(v.number()), // Number of days to look ahead (default: 7)
  },
  returns: v.array(v.object({
    _id: v.id("calendarEvents"),
    _creationTime: v.number(),
    title: v.string(),
    description: v.optional(v.string()),
    startDate: v.number(),
    endDate: v.optional(v.number()),
    startTime: v.optional(v.string()),
    endTime: v.optional(v.string()),
    isAllDay: v.optional(v.boolean()),
    color: v.optional(v.string()),
    location: v.optional(v.string()),
    category: v.optional(v.union(v.literal("MEETING"), v.literal("DEADLINE"), v.literal("EVENT"), v.literal("REMINDER"), v.literal("OTHER"))),
    priority: v.optional(v.union(v.literal("LOW"), v.literal("MEDIUM"), v.literal("HIGH"), v.literal("URGENT"))),
    createdBy: v.string(),
    attendees: v.optional(v.array(v.string())),
    status: v.optional(v.union(v.literal("SCHEDULED"), v.literal("CANCELLED"), v.literal("COMPLETED"), v.literal("POSTPONED"))),
    createdAt: v.optional(v.number()),
    updatedAt: v.optional(v.number()),
  })),
  handler: async (ctx, args) => {
    const now = Date.now();
    const daysAhead = args.days || 7;
    const endDate = now + (daysAhead * 24 * 60 * 60 * 1000);

    const query = ctx.db.query("calendarEvents")
      .withIndex("by_startDate", (q) => q.gte("startDate", now));

    let events = await query.collect();

    // Filter by end date and creator
    events = events.filter(event => {
      if (event.startDate > endDate) return false;
      if (args.createdBy && event.createdBy !== args.createdBy) return false;
      if (event.status === "CANCELLED" || event.status === "COMPLETED") return false;
      return true;
    });

    return events.sort((a, b) => a.startDate - b.startDate);
  },
});
