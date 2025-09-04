import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";

import { MutationCtx } from "../../_generated/server";

export const updateFeedbackFormArgs = {
  eventSlug: v.string(),
  title: v.optional(v.string()),
  fields: v.any(),
};

export const updateFeedbackFormHandler = async (
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

  const event = await ctx.db
    .query("events")
    .withIndex("by_slug", q => q.eq("slug", args.eventSlug))
    .first();

  if (!event) {
    throw new Error("Event not found");
  }

  if (event.organizedBy !== currentUser.username) {
    throw new Error("Only the event organizer can update feedback forms");
  }

  const existingForm = await ctx.db
    .query("eventFeedbackForms")
    .withIndex("by_eventId", q => q.eq("eventId", event._id))
    .first();

  if (!existingForm) {
    throw new Error("No feedback form exists for this event");
  }

  const now = Date.now();

  await ctx.db.patch(existingForm._id, {
    title: args.title ?? existingForm.title,
    fields: args.fields,
    updatedAt: now,
  });

  const updated = await ctx.db.get(existingForm._id);
  if (!updated) {
    throw new Error("Failed to update feedback form");
  }

  return {
    id: updated._id,
    eventId: updated.eventId,
    title: updated.title,
    fields: updated.fields,
    isActive: updated.isActive,
    createdAt: updated.createdAt,
    updatedAt: updated.updatedAt,
    event: {
      id: event._id,
      slug: event.slug,
      title: event.title,
      organizedBy: event.organizedBy,
    },
  };
};


