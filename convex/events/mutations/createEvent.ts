import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";

import { MutationCtx } from "../../_generated/server";
import { Id } from "../../_generated/dataModel";

export const createEventArgs = {
  title: v.string(),
  type: v.optional(v.union(v.literal("IN_PERSON"), v.literal("VIRTUAL"), v.literal("HYBRID"), v.literal("OTHERS"))),
  imageUrl: v.optional(v.string()),
  imageStorageId: v.optional(v.id("_storage")),
  description: v.optional(v.string()),
  details: v.optional(v.string()),
  startDate: v.number(),
  endDate: v.optional(v.number()),
  tags: v.optional(v.array(v.string())),
  minimumAttendanceMinutes: v.optional(v.number()),
};

export const createEventHandler = async (
  ctx: MutationCtx,
  args: {
    title: string;
    type?: "IN_PERSON" | "VIRTUAL" | "HYBRID" | "OTHERS";
    imageUrl?: string;
    imageStorageId?: Id<"_storage">;
    description?: string;
    details?: string;
    startDate: number;
    endDate?: number;
    tags?: string[];
    minimumAttendanceMinutes?: number;
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

  const now = Date.now();

  // Generate slug from title
  const slug = args.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  // Check if slug already exists
  const existingEvent = await ctx.db
    .query("events")
    .withIndex("by_slug", q => q.eq("slug", slug))
    .first();

  if (existingEvent) {
    throw new Error("An event with this title already exists");
  }

  // Validate dates
  if (args.endDate && args.endDate < args.startDate) {
    throw new Error("End date must be after start date");
  }

  // Create the event
  const eventId = await ctx.db.insert("events", {
    title: args.title,
    slug,
    type: args.type,
    imageUrl: args.imageUrl,
    imageStorageId: args.imageStorageId,
    description: args.description,
    details: args.details,
    startDate: args.startDate,
    endDate: args.endDate,
    tags: args.tags,
    organizedBy: currentUser.username,
    minimumAttendanceMinutes: args.minimumAttendanceMinutes,
    isPinned: false, // New events are not pinned by default
    createdAt: now,
    updatedAt: now,
  });

  // Get the created event with full details
  const event = await ctx.db.get(eventId);
  if (!event) {
    throw new Error("Failed to create event");
  }

  return {
    id: event._id,
    slug: event.slug,
    title: event.title,
    type: event.type,
    imageUrl: event.imageUrl,
    imageStorageId: event.imageStorageId,
    description: event.description,
    details: event.details,
    startDate: event.startDate,
    endDate: event.endDate,
    tags: event.tags || [],
    organizedBy: event.organizedBy,
    minimumAttendanceMinutes: event.minimumAttendanceMinutes,
    isPinned: event.isPinned,
    organizer: {
      id: currentUser._id,
      username: currentUser.username,
      firstName: currentUser.firstName,
      lastName: currentUser.lastName,
      imageUrl: currentUser.imageUrl,
    },
    createdAt: event.createdAt,
    updatedAt: event.updatedAt,
  };
};
