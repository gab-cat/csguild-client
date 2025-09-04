import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";

import { MutationCtx } from "../../_generated/server";

export const createFeedbackFormArgs = {
  eventSlug: v.string(),
  title: v.optional(v.string()),
  fields: v.any(), // JSON schema for form fields
};

export const createFeedbackFormHandler = async (
  ctx: MutationCtx,
  args: {
    eventSlug: string;
    title?: string;
    fields: unknown;
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
    .withIndex("by_slug", q => q.eq("slug", args.eventSlug))
    .first();

  if (!event) {
    throw new Error("Event not found");
  }

  // Check if the current user is the organizer
  if (event.organizedBy !== currentUser.username) {
    throw new Error("Only the event organizer can create feedback forms");
  }

  // Check if a feedback form already exists for this event
  const existingForm = await ctx.db
    .query("eventFeedbackForms")
    .withIndex("by_eventId", q => q.eq("eventId", event._id))
    .first();

  if (existingForm) {
    throw new Error("A feedback form already exists for this event");
  }

  const now = Date.now();

  // Create the feedback form
  const formId = await ctx.db.insert("eventFeedbackForms", {
    eventId: event._id,
    title: args.title || `${event.title} - Feedback`,
    fields: args.fields,
    isActive: true,
    createdAt: now,
    updatedAt: now,
  });

  // Get the created form
  const form = await ctx.db.get(formId);
  if (!form) {
    throw new Error("Failed to create feedback form");
  }

  return {
    id: form._id,
    eventId: form.eventId,
    title: form.title,
    fields: form.fields,
    isActive: form.isActive,
    createdAt: form.createdAt,
    updatedAt: form.updatedAt,
    event: {
      id: event._id,
      slug: event.slug,
      title: event.title,
      organizedBy: event.organizedBy,
    },
  };
};
