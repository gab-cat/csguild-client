import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";

import { Id } from "../../_generated/dataModel";
import { MutationCtx } from "../../_generated/server";

export const updateEventArgs = {
  slug: v.string(),
  title: v.optional(v.string()),
  type: v.optional(v.union(v.literal("IN_PERSON"), v.literal("VIRTUAL"), v.literal("HYBRID"), v.literal("OTHERS"))),
  imageUrl: v.optional(v.string()),
  imageStorageId: v.optional(v.id("_storage")),
  description: v.optional(v.string()),
  details: v.optional(v.string()),
  startDate: v.optional(v.number()),
  endDate: v.optional(v.number()),
  tags: v.optional(v.array(v.string())),
  minimumAttendanceMinutes: v.optional(v.number()),
};

export const updateEventHandler = async (
  ctx: MutationCtx,
  args: {
    slug: string;
    title?: string;
    type?: "IN_PERSON" | "VIRTUAL" | "HYBRID" | "OTHERS";
    imageUrl?: string;
    imageStorageId?: Id<"_storage">;
    description?: string;
    details?: string;
    startDate?: number;
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
    throw new Error("Only the event organizer can update the event");
  }

  const now = Date.now();

  // Prepare update data
  const updateData: {
    updatedAt: number;
    title?: string;
    slug?: string;
    type?: "IN_PERSON" | "VIRTUAL" | "HYBRID" | "OTHERS";
    imageUrl?: string;
    imageStorageId?: Id<"_storage">;
    description?: string;
    details?: string;
    startDate?: number;
    endDate?: number;
    tags?: string[];
    minimumAttendanceMinutes?: number;
  } = {
    updatedAt: now,
  };

  // Handle title and slug update
  if (args.title !== undefined) {
    updateData.title = args.title;

    // Generate new slug from title if title changed
    const newSlug = args.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    // Check if new slug conflicts with another event
    if (newSlug !== event.slug) {
      const existingEvent = await ctx.db
        .query("events")
        .withIndex("by_slug", q => q.eq("slug", newSlug))
        .first();

      if (existingEvent) {
        throw new Error("An event with this title already exists");
      }

      updateData.slug = newSlug;
    }
  }

  // Update other fields
  if (args.type !== undefined) updateData.type = args.type;
  if (args.imageUrl !== undefined) updateData.imageUrl = args.imageUrl;
  if (args.imageStorageId !== undefined) updateData.imageStorageId = args.imageStorageId;
  if (args.description !== undefined) updateData.description = args.description;
  if (args.details !== undefined) updateData.details = args.details;
  if (args.startDate !== undefined) updateData.startDate = args.startDate;
  if (args.endDate !== undefined) updateData.endDate = args.endDate;
  if (args.tags !== undefined) updateData.tags = args.tags;
  if (args.minimumAttendanceMinutes !== undefined) updateData.minimumAttendanceMinutes = args.minimumAttendanceMinutes;

  // Validate dates if both are provided
  const finalStartDate = args.startDate ?? event.startDate;
  const finalEndDate = args.endDate ?? event.endDate;

  if (finalEndDate && finalEndDate < finalStartDate) {
    throw new Error("End date must be after start date");
  }

  // If replacing image, delete the old one from storage
  if (args.imageStorageId && event.imageStorageId && args.imageStorageId !== event.imageStorageId) {
    try {
      await ctx.storage.delete(event.imageStorageId as Id<'_storage'>);
    } catch {
      // Ignore delete errors to not block the update
    }
  }

  // Update the event
  await ctx.db.patch(event._id, updateData);

  // Get the updated event
  const updatedEvent = await ctx.db.get(event._id);
  if (!updatedEvent) {
    throw new Error("Failed to update event");
  }

  return {
    id: updatedEvent._id,
    slug: updatedEvent.slug,
    title: updatedEvent.title,
    type: updatedEvent.type,
    imageUrl: updatedEvent.imageUrl,
    imageStorageId: updatedEvent.imageStorageId,
    description: updatedEvent.description,
    details: updatedEvent.details,
    startDate: updatedEvent.startDate,
    endDate: updatedEvent.endDate,
    tags: updatedEvent.tags || [],
    organizedBy: updatedEvent.organizedBy,
    minimumAttendanceMinutes: updatedEvent.minimumAttendanceMinutes,
    isPinned: updatedEvent.isPinned,
    organizer: {
      id: currentUser._id,
      username: currentUser.username,
      firstName: currentUser.firstName,
      lastName: currentUser.lastName,
      imageUrl: currentUser.imageUrl,
    },
    createdAt: updatedEvent.createdAt,
    updatedAt: updatedEvent.updatedAt,
  };
};
