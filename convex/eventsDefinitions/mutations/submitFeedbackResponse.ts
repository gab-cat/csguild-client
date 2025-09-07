import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";

import { MutationCtx } from "../../_generated/server";

export const submitFeedbackResponseArgs = {
  eventSlug: v.string(),
  responses: v.any(), // JSON responses
  token: v.optional(v.string()), // For public submissions
  userIdentifier: v.optional(v.string()), // For public submissions
};

export const submitFeedbackResponseHandler = async (
  ctx: MutationCtx,
  args: {
    eventSlug: string;
    responses: any;
    token?: string;
    userIdentifier?: string;
  }
) => {
  let userId: string;
  let attendee: any;

  if (args.token && args.userIdentifier) {
    // Public submission - validate token and find user
    // In a real implementation, you'd validate the JWT token here
    // For now, we'll use the userIdentifier directly
    userId = args.userIdentifier;

    const user = await ctx.db
      .query("users")
      .withIndex("by_username", q => q.eq("username", userId))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    // Find the event
    const event = await ctx.db
      .query("events")
      .withIndex("by_slug", q => q.eq("slug", args.eventSlug))
      .first();

    if (!event) {
      throw new Error("Event not found");
    }

    // Find attendee record
    attendee = await ctx.db
      .query("eventAttendees")
      .withIndex("by_eventId_userId", q =>
        q.eq("eventId", event._id).eq("userId", userId)
      )
      .first();

    if (!attendee) {
      throw new Error("User is not registered for this event");
    }
  } else {
    // Authenticated submission
    const authUserId = await getAuthUserId(ctx);
    if (!authUserId) {
      throw new Error("Authentication required");
    }

    const currentUser = await ctx.db.get(authUserId);
    if (!currentUser?.username) {
      throw new Error("User not found");
    }

    userId = currentUser.username;

    // Find the event
    const event = await ctx.db
      .query("events")
      .withIndex("by_slug", q => q.eq("slug", args.eventSlug))
      .first();

    if (!event) {
      throw new Error("Event not found");
    }

    // Find attendee record
    attendee = await ctx.db
      .query("eventAttendees")
      .withIndex("by_eventId_userId", q =>
        q.eq("eventId", event._id).eq("userId", userId)
      )
      .first();

    if (!attendee) {
      throw new Error("User is not registered for this event");
    }
  }

  // Find the feedback form for this event
  const feedbackForm = await ctx.db
    .query("eventFeedbackForms")
    .withIndex("by_eventId", q => q.eq("eventId", attendee.eventId))
    .first();

  if (!feedbackForm) {
    throw new Error("No feedback form found for this event");
  }

  if (!feedbackForm.isActive) {
    throw new Error("Feedback form is not active");
  }

  // Check if user has already submitted feedback
  const existingResponse = await ctx.db
    .query("eventFeedbackResponses")
    .withIndex("by_formId_userId", q =>
      q.eq("formId", feedbackForm._id).eq("userId", userId)
    )
    .first();

  if (existingResponse) {
    throw new Error("User has already submitted feedback for this event");
  }

  const now = Date.now();

  // Create the feedback response
  const responseId = await ctx.db.insert("eventFeedbackResponses", {
    formId: feedbackForm._id,
    userId: userId,
    attendeeId: attendee._id,
    responses: args.responses,
    submittedAt: now,
    createdAt: now,
    updatedAt: now,
  });

  // Get the created response
  const response = await ctx.db.get(responseId);
  if (!response) {
    throw new Error("Failed to submit feedback response");
  }

  return {
    id: response._id,
    formId: response.formId,
    userId: response.userId,
    attendeeId: response.attendeeId,
    responses: response.responses,
    submittedAt: response.submittedAt,
    createdAt: response.createdAt,
    message: "Feedback submitted successfully",
  };
};
