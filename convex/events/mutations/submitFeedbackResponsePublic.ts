import { v } from "convex/values";

import { MutationCtx } from "../../_generated/server";

export const submitFeedbackResponsePublicArgs = {
  token: v.string(),
  userId: v.string(),
  responseData: v.object({
    formId: v.string(),
    responses: v.record(v.string(), v.string()),
  }),
};

export const submitFeedbackResponsePublicHandler = async (
  ctx: MutationCtx,
  args: {
    token: string;
    userId: string;
    responseData: {
      formId: string;
      responses: Record<string, string>;
    };
  }
) => {
  // In a real implementation, you would validate the JWT token here
  // For now, we'll proceed with the userId and token as provided

  // Find the user
  const user = await ctx.db
    .query("users")
    .withIndex("by_username", q => q.eq("username", args.userId))
    .first();

  if (!user) {
    throw new Error("Invalid access token or user not found");
  }

  // Find the feedback form
  const feedbackForm = await ctx.db.get(args.responseData.formId as any);
  if (!feedbackForm) {
    throw new Error("Feedback form not found");
  }

  // Verify the form is active
  if (!feedbackForm.isActive) {
    throw new Error("Feedback form is not active");
  }

  // Find the event
  const event = await ctx.db.query("events").filter(q =>
    q.eq(q.field("_id"), feedbackForm.eventId)
  ).first();

  if (!event) {
    throw new Error("Event not found");
  }

  // Verify user is registered for this event
  const attendee = await ctx.db
    .query("eventAttendees")
    .withIndex("by_eventId_userId", q =>
      q.eq("eventId", event._id).eq("userId", args.userId)
    )
    .first();

  if (!attendee) {
    throw new Error("User is not registered for this event");
  }

  // Check if user has already submitted feedback
  const existingResponse = await ctx.db
    .query("eventFeedbackResponses")
    .withIndex("by_formId_userId", q =>
      q.eq("formId", feedbackForm._id).eq("userId", args.userId)
    )
    .first();

  if (existingResponse) {
    throw new Error("User has already submitted feedback for this event");
  }

  const now = Date.now();

  // Create the feedback response
  const responseId = await ctx.db.insert("eventFeedbackResponses", {
    formId: feedbackForm._id,
    userId: args.userId,
    attendeeId: attendee._id,
    responses: args.responseData.responses,
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
