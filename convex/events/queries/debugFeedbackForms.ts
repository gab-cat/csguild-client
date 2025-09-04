import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";

import { QueryCtx } from "../../_generated/server";

export const debugFeedbackFormsArgs = {
  eventSlug: v.optional(v.string()),
};

export const debugFeedbackFormsHandler = async (
  ctx: QueryCtx,
  args: {
    eventSlug?: string;
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

  // Get all feedback forms
  const allForms = await ctx.db
    .query("eventFeedbackForms")
    .collect();

  // If eventSlug is provided, also get the specific event and its form
  let eventForm = null;
  if (args.eventSlug) {
    const event = await ctx.db
      .query("events")
      .withIndex("by_slug", q => q.eq("slug", args.eventSlug))
      .first();

    if (event) {
      eventForm = await ctx.db
        .query("eventFeedbackForms")
        .withIndex("by_eventId", q => q.eq("eventId", event._id))
        .first();
    }
  }

  return {
    allForms: allForms.map(form => ({
      id: form._id,
      eventId: form.eventId,
      title: form.title,
      isActive: form.isActive,
      createdAt: form.createdAt,
    })),
    eventForm: eventForm ? {
      id: eventForm._id,
      eventId: eventForm.eventId,
      title: eventForm.title,
      isActive: eventForm.isActive,
      createdAt: eventForm.createdAt,
    } : null,
    totalForms: allForms.length,
  };
};
