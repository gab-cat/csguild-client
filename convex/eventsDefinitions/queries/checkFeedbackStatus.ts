import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";

import { QueryCtx } from "../../_generated/server";

export const checkFeedbackStatusArgs = {
  eventSlug: v.string(),
};

export const checkFeedbackStatusHandler = async (
  ctx: QueryCtx,
  args: {
    eventSlug: string;
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

  // Check if user is registered for the event
  const attendee = await ctx.db
    .query("eventAttendees")
    .withIndex("by_eventId_userId", q =>
      q.eq("eventId", event._id).eq("userId", currentUser.username!)
    )
    .first();

  if (!attendee) {
    return {
      canSubmitFeedback: false,
      reason: "User is not registered for this event",
      hasSubmittedFeedback: false,
      hasRatedOrganizer: false,
    };
  }

  // Check if event has started (feedback should be available once event starts)
  const now = Date.now();
  const eventStarted = event.startDate < now;

  if (!eventStarted) {
    return {
      canSubmitFeedback: false,
      reason: "Event has not started yet",
      hasSubmittedFeedback: false,
      hasRatedOrganizer: false,
    };
  }

  // Check if user has sufficient attendance time by summing all sessions
  const sessions = await ctx.db
    .query("eventSessions")
    .withIndex("by_attendeeId", q => q.eq("attendeeId", attendee._id))
    .collect();

  let summedDuration = 0;
  for (const s of sessions) {
    const sStart = s.startedAt || 0;
    const sEnd = s.endedAt || 0;
    const sDuration = typeof s.duration === 'number' ? s.duration : (sEnd && sStart ? Math.max(0, sEnd - sStart) : 0);
    summedDuration += sDuration;
  }

  const minMinutes = event.minimumAttendanceMinutes || 0;
  const hasEnoughAttendance = summedDuration >= (minMinutes * 60 * 1000);

  if (!hasEnoughAttendance) {
    return {
      canSubmitFeedback: false,
      reason: `Insufficient attendance time. Minimum required: ${minMinutes} minutes`,
      hasSubmittedFeedback: false,
      hasRatedOrganizer: false,
      requiredMinutes: minMinutes,
      actualMinutes: Math.floor(summedDuration / (60 * 1000)),
    };
  }

  // Check if feedback form exists
  const feedbackForm = await ctx.db
    .query("eventFeedbackForms")
    .withIndex("by_eventId", q => q.eq("eventId", event._id))
    .first();

  console.log("[checkFeedbackStatus] Feedback form check:", {
    eventId: event._id,
    eventSlug: event.slug,
    feedbackForm: feedbackForm ? {
      id: feedbackForm._id,
      title: feedbackForm.title,
      isActive: feedbackForm.isActive
    } : null
  });

  if (!feedbackForm) {
    return {
      canSubmitFeedback: false,
      reason: "No feedback form available for this event",
      hasSubmittedFeedback: false,
      hasRatedOrganizer: false,
    };
  }

  if (!feedbackForm.isActive) {
    return {
      canSubmitFeedback: false,
      reason: "Feedback form is not active",
      hasSubmittedFeedback: false,
      hasRatedOrganizer: false,
    };
  }

  // Check if user has already submitted feedback
  const existingResponse = await ctx.db
    .query("eventFeedbackResponses")
    .withIndex("by_formId_userId", q =>
      q.eq("formId", feedbackForm._id).eq("userId", currentUser.username!)
    )
    .first();

  // Check if user has rated the organizer
  const existingRating = await ctx.db
    .query("eventOrganizerRatings")
    .withIndex("by_eventId_userId", q =>
      q.eq("eventId", event._id).eq("userId", currentUser.username!)
    )
    .first();

  return {
    canSubmitFeedback: !existingResponse,
    hasSubmittedFeedback: !!existingResponse,
    hasRatedOrganizer: !!existingRating,
    feedbackForm: {
      id: feedbackForm._id,
      title: feedbackForm.title,
      isActive: feedbackForm.isActive,
    },
    attendee: {
      id: attendee._id,
      totalDuration: summedDuration,
      isEligible: hasEnoughAttendance,
    },
    event: {
      id: event._id,
      slug: event.slug,
      title: event.title,
      endDate: event.endDate,
    },
  };
};
