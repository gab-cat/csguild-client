import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";

import { Doc } from "../../_generated/dataModel";
import { MutationCtx } from "../../_generated/server";

export const rateOrganizerArgs = {
  eventSlug: v.string(),
  rating: v.number(),
  comment: v.optional(v.string()),
  token: v.optional(v.string()), // For public submissions
  userIdentifier: v.optional(v.string()), // For public submissions
};

export const rateOrganizerHandler = async (
  ctx: MutationCtx,
  args: {
    eventSlug: string;
    rating: number;
    comment?: string;
    token?: string;
    userIdentifier?: string;
  }
) => {
  let userId: string;
  let attendee: Doc<"eventAttendees"> | null;

  if (args.token && args.userIdentifier) {
    // Public submission - validate token and find user
    // In a real implementation, you'd validate the JWT token here
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

  // Validate rating
  if (args.rating < 1 || args.rating > 5) {
    throw new Error("Rating must be between 1 and 5");
  }

  // Check if user has already rated this organizer for this event
  const existingRating = await ctx.db
    .query("eventOrganizerRatings")
    .withIndex("by_eventId_userId", q =>
      q.eq("eventId", attendee.eventId).eq("userId", userId)
    )
    .first();

  if (existingRating) {
    throw new Error("User has already rated this organizer for this event");
  }

  const now = Date.now();

  // Create the organizer rating
  const ratingId = await ctx.db.insert("eventOrganizerRatings", {
    eventId: attendee.eventId,
    userId: userId,
    rating: args.rating,
    comment: args.comment,
    submittedAt: now,
    createdAt: now,
    updatedAt: now,
  });

  // Get the created rating
  const rating = await ctx.db.get(ratingId);
  if (!rating) {
    throw new Error("Failed to submit organizer rating");
  }

  return {
    id: rating._id,
    eventId: rating.eventId,
    userId: rating.userId,
    rating: rating.rating,
    comment: rating.comment,
    submittedAt: rating.submittedAt,
    createdAt: rating.createdAt,
    message: "Organizer rating submitted successfully",
  };
};
