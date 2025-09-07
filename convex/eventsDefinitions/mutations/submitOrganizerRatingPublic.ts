import { v } from "convex/values";

import { MutationCtx } from "../../_generated/server";

export const submitOrganizerRatingPublicArgs = {
  eventSlug: v.string(),
  token: v.string(),
  userId: v.string(),
  ratingData: v.object({
    rating: v.number(),
    comment: v.optional(v.string()),
  }),
};

export const submitOrganizerRatingPublicHandler = async (
  ctx: MutationCtx,
  args: {
    eventSlug: string;
    token: string;
    userId: string;
    ratingData: {
      rating: number;
      comment?: string;
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

  // Validate rating
  if (args.ratingData.rating < 1 || args.ratingData.rating > 5) {
    throw new Error("Rating must be between 1 and 5");
  }

  // Find the event
  const event = await ctx.db
    .query("events")
    .withIndex("by_slug", q => q.eq("slug", args.eventSlug))
    .first();

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

  // Check if user has already rated this organizer for this event
  const existingRating = await ctx.db
    .query("eventOrganizerRatings")
    .withIndex("by_eventId_userId", q =>
      q.eq("eventId", event._id).eq("userId", args.userId)
    )
    .first();

  if (existingRating) {
    throw new Error("User has already rated this organizer for this event");
  }

  const now = Date.now();

  // Create the organizer rating
  const ratingId = await ctx.db.insert("eventOrganizerRatings", {
    eventId: event._id,
    userId: args.userId,
    rating: args.ratingData.rating,
    comment: args.ratingData.comment,
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
