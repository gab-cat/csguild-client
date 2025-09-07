import { v } from "convex/values";

import { Id } from "@/lib/convex";

import { QueryCtx } from "../../_generated/server";

export const getFeedbackFormArgs = {
  eventId: v.id("events"),
};

export const getFeedbackFormHandler = async (
  ctx: QueryCtx,
  args: {
    eventId: Id<"events">;
  }
) => {
  // Get the feedback form for this event
  const feedbackForm = await ctx.db
    .query("eventFeedbackForms")
    .withIndex("by_eventId", q => q.eq("eventId", args.eventId))
    .first();

  if (!feedbackForm) {
    return null;
  }

  // Get the associated event to verify it exists and get basic info
  const event = await ctx.db.query("events").filter(q => q.eq(q.field("_id"), args.eventId)).first();

  if (!event) {
    throw new Error("Event not found");
  }

  return {
    id: feedbackForm._id,
    eventId: feedbackForm.eventId,
    title: feedbackForm.title,
    fields: feedbackForm.fields,
    isActive: feedbackForm.isActive,
    createdAt: feedbackForm.createdAt,
    updatedAt: feedbackForm.updatedAt,
    event: {
      id: event._id,
      slug: event.slug,
      title: event.title,
      organizedBy: event.organizedBy,
      startDate: event.startDate,
      endDate: event.endDate,
    },
  };
};
