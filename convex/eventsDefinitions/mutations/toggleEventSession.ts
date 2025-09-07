import { v } from "convex/values";

import { internal } from "../../_generated/api";
import { MutationCtx } from "../../_generated/server";

export const toggleEventSessionArgs = {
  rfidId: v.string(),
  eventSlug: v.string(),
};

export const toggleEventSessionHandler = async (
  ctx: MutationCtx,
  args: {
    rfidId: string;
    eventSlug: string;
  }
) => {
  // Find user by RFID ID
  console.log("[toggleEventSession] Incoming args:", { rfidId: args.rfidId, eventSlug: args.eventSlug });
  const user = await ctx.db
    .query("users")
    .withIndex("by_rfidId", q => q.eq("rfidId", args.rfidId))
    .first();

  if (!user?.username) {
    throw new Error("User not found with provided RFID");
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
  let attendee = await ctx.db
    .query("eventAttendees")
    .withIndex("by_eventId_userId", q =>
      q.eq("eventId", event._id).eq("userId", user.username!)
    )
    .first();

  // If not registered, auto-register the user for this event
  if (!attendee) {
    console.log("[toggleEventSession] Auto-registering attendee for event", { eventId: event._id, username: user.username });
    const now = Date.now();
    const attendeeId = await ctx.db.insert("eventAttendees", {
      eventId: event._id,
      userId: user.username!,
      totalDuration: 0,
      isEligible: false,
      registeredAt: now,
      createdAt: now,
      updatedAt: now,
    });

    const created = await ctx.db.get(attendeeId);
    if (!created) {
      throw new Error("Failed to auto-register attendee for event");
    }
    attendee = created;
  }

  const now = Date.now();

  // Check if there's an active session (no endedAt)
  const activeSession = await ctx.db
    .query("eventSessions")
    .withIndex("by_attendeeId", q => q.eq("attendeeId", attendee._id))
    .filter(q => q.eq(q.field("endedAt"), undefined))
    .first();

  let result;
  let debug: Record<string, unknown> | undefined;
  let emailSent = false;
  let emailSentAt: number | undefined;

  if (activeSession) {
    // Check-out: End the active session
    const duration = now - (activeSession.startedAt || now);
    console.log("[toggleEventSession] Checking out", { attendeeId: attendee._id, sessionId: activeSession._id, startedAt: activeSession.startedAt, now, durationMs: duration, durationMinutes: Math.round(duration / 60000) });
    await ctx.db.patch(activeSession._id, {
      endedAt: now,
      duration: duration,
      updatedAt: now,
    });

    // Recompute attendee's total duration by summing all sessions
    const sessions = await ctx.db
      .query("eventSessions")
      .withIndex("by_attendeeId", q => q.eq("attendeeId", attendee._id))
      .collect();

    let summedDuration = 0;
    for (const s of sessions) {
      const sStart = s.startedAt || 0;
      const sEnd = s.endedAt || 0;
      const sDuration = typeof s.duration === "number" ? s.duration : (sEnd && sStart ? Math.max(0, sEnd - sStart) : 0);
      summedDuration += sDuration;
    }

    const minMinutes = event.minimumAttendanceMinutes || 0;
    const eligibleByMinutes = summedDuration >= (minMinutes * 60 * 1000);
    console.log("[toggleEventSession] Recomputed totals", { sessions: sessions.length, summedDurationMs: summedDuration, summedMinutes: Math.round(summedDuration / 60000), minMinutes, eligibleByMinutes });

    await ctx.db.patch(attendee._id, {
      totalDuration: summedDuration,
      isEligible: eligibleByMinutes,
      updatedAt: now,
    });

    // Determine eligibility and send feedback email if criteria met and not yet sent
    try {
      const minMinutes = event.minimumAttendanceMinutes || 0;
      const hasMinRequirement = minMinutes > 0;
      // We already computed `eligibleByMinutes` above using summedDuration
      const shouldSend = hasMinRequirement ? eligibleByMinutes : true; // no minimum -> send on checkout

      if (shouldSend) {
        // Reload attendee to check sentSurveyEmailAt
        const latestAttendee = await ctx.db.get(attendee._id);
        if (latestAttendee && !latestAttendee.sentSurveyEmailAt) {
          // Find user email
          const userRecord = await ctx.db.get(user._id);
          const userEmail = userRecord?.email;
          if (userEmail) {
            // Find feedback form for event
            const feedbackForm = await ctx.db
              .query("eventFeedbackForms")
              .withIndex("by_eventId", q => q.eq("eventId", event._id))
              .first();

            if (feedbackForm) {
              const token = `${attendee._id}`; // simple token placeholder for now
              console.log("[toggleEventSession] Sending feedback email", { to: userEmail, eventSlug: event.slug, minMinutes, eligibleByMinutes });
              // schedule send
              // @ts-ignore
              await ctx.scheduler.runAfter(0, internal.email.sendEventFeedbackInvite, {
                to: userEmail,
                eventTitle: event.title,
                eventSlug: event.slug,
                token,
                userId: user.username!,
              });

              // Mark as sent
              await ctx.db.patch(attendee._id, {
                sentSurveyEmailAt: now,
                updatedAt: now,
              });
              emailSent = true;
              emailSentAt = now;
            }
          }
        }
      }
    } catch (e) {
      console.error("Failed to send feedback invite:", e);
    }

    result = {
      action: "check-out",
      sessionId: activeSession._id,
      duration: duration,
      totalDuration: summedDuration,
      message: "Successfully checked out from event",
    };

    debug = {
      phase: "check-out",
      minMinutes,
      lastSessionMs: duration,
      lastSessionMinutes: Math.round(duration / 60000),
      summedDurationMs: summedDuration,
      summedMinutes: Math.round(summedDuration / 60000),
      eligibleByMinutes,
      emailSent,
      emailSentAt,
    };
  } else {
    // Check-in: Start a new session
    console.log("[toggleEventSession] Checking in", { attendeeId: attendee._id, now });
    const sessionId = await ctx.db.insert("eventSessions", {
      attendeeId: attendee._id,
      startedAt: now,
      createdAt: now,
      updatedAt: now,
    });

    result = {
      action: "check-in",
      sessionId: sessionId,
      message: "Successfully checked in to event",
    };

    debug = {
      phase: "check-in",
      startedAt: now,
    };
  }

  // Get updated attendee info
  const updatedAttendee = await ctx.db.get(attendee._id);
  if (!updatedAttendee) {
    throw new Error("Failed to update attendee record");
  }

  return {
    success: true,
    ...result,
    attendee: {
      id: updatedAttendee._id,
      userId: updatedAttendee.userId,
      totalDuration: updatedAttendee.totalDuration,
      isEligible: updatedAttendee.isEligible,
    },
    user: {
      id: user._id,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      imageUrl: user.imageUrl,
    },
    event: {
      id: event._id,
      slug: event.slug,
      title: event.title,
    },
    timestamp: now,
    debug,
  };
};
