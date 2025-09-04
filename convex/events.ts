

import { query, mutation } from "./_generated/server";
import {
  // Mutation handlers and args
  createEventHandler,
  createEventArgs,
  updateEventHandler,
  updateEventArgs,
  deleteEventHandler,
  deleteEventArgs,
  registerForEventHandler,
  registerForEventArgs,
  unregisterFromEventHandler,
  unregisterFromEventArgs,
  toggleEventSessionHandler,
  toggleEventSessionArgs,
  createFeedbackFormHandler,
  createFeedbackFormArgs,
  updateFeedbackFormHandler,
  updateFeedbackFormArgs,
  submitFeedbackResponseHandler,
  submitFeedbackResponseArgs,
  submitFeedbackResponsePublicHandler,
  submitFeedbackResponsePublicArgs,
  rateOrganizerHandler,
  rateOrganizerArgs,
  submitOrganizerRatingPublicHandler,
  submitOrganizerRatingPublicArgs,
  // Image upload functions
  generateUploadUrl,
  saveEventImage,
} from "./events/mutations";
import {
  // Query handlers and args
  getEventsHandler,
  getEventsArgs,
  getEventBySlugHandler,
  getEventBySlugArgs,
  getPinnedEventsHandler,
  getPinnedEventsArgs,
  getMyCreatedEventsHandler,
  getMyCreatedEventsArgs,
  getMyAttendedEventsHandler,
  getMyAttendedEventsArgs,
  getEventAttendeesHandler,
  getEventAttendeesArgs,
  getEventSessionsHandler,
  getEventSessionsArgs,
  getOrganizerStatisticsHandler,
  getOrganizerStatisticsArgs,
  getFeedbackFormHandler,
  getFeedbackFormArgs,
  getEventWithFeedbackFormPublicHandler,
  getEventWithFeedbackFormPublicArgs,
  getEventFeedbackResponsesHandler,
  getEventFeedbackResponsesArgs,
  checkFeedbackStatusHandler,
  checkFeedbackStatusArgs,
  debugFeedbackFormsHandler,
  debugFeedbackFormsArgs,
} from "./events/queries";

// QUERIES

export const getEvents = query({
  args: getEventsArgs,
  handler: getEventsHandler,
});

export const getEventBySlug = query({
  args: getEventBySlugArgs,
  handler: getEventBySlugHandler,
});

export const getPinnedEvents = query({
  args: getPinnedEventsArgs,
  handler: getPinnedEventsHandler,
});

export const getMyCreatedEvents = query({
  args: getMyCreatedEventsArgs,
  handler: getMyCreatedEventsHandler,
});

export const getMyAttendedEvents = query({
  args: getMyAttendedEventsArgs,
  handler: getMyAttendedEventsHandler,
});

export const getEventAttendees = query({
  args: getEventAttendeesArgs,
  handler: getEventAttendeesHandler,
});

export const getEventSessions = query({
  args: getEventSessionsArgs,
  handler: getEventSessionsHandler,
});

export const getOrganizerStatistics = query({
  args: getOrganizerStatisticsArgs,
  handler: getOrganizerStatisticsHandler,
});

export const getFeedbackForm = query({
  args: getFeedbackFormArgs,
  handler: getFeedbackFormHandler,
});

export const checkFeedbackStatus = query({
  args: checkFeedbackStatusArgs,
  handler: checkFeedbackStatusHandler,
});

export const debugFeedbackForms = query({
  args: debugFeedbackFormsArgs,
  handler: debugFeedbackFormsHandler,
});

export const getEventWithFeedbackFormPublic = query({
  args: getEventWithFeedbackFormPublicArgs,
  handler: getEventWithFeedbackFormPublicHandler,
});

export const getEventFeedbackResponses = query({
  args: getEventFeedbackResponsesArgs,
  handler: getEventFeedbackResponsesHandler,
});

// MUTATIONS

export const createEvent = mutation({
  args: createEventArgs,
  handler: createEventHandler,
});

export const updateEvent = mutation({
  args: updateEventArgs,
  handler: updateEventHandler,
});

export const deleteEvent = mutation({
  args: deleteEventArgs,
  handler: deleteEventHandler,
});

export const registerForEvent = mutation({
  args: registerForEventArgs,
  handler: registerForEventHandler,
});

export const unregisterFromEvent = mutation({
  args: unregisterFromEventArgs,
  handler: unregisterFromEventHandler,
});

export const toggleEventSession = mutation({
  args: toggleEventSessionArgs,
  handler: toggleEventSessionHandler,
});

export const createFeedbackForm = mutation({
  args: createFeedbackFormArgs,
  handler: createFeedbackFormHandler,
});

export const updateFeedbackForm = mutation({
  args: updateFeedbackFormArgs,
  handler: updateFeedbackFormHandler,
});

export const submitFeedbackResponse = mutation({
  args: submitFeedbackResponseArgs,
  handler: submitFeedbackResponseHandler,
});

export const submitFeedbackResponsePublic = mutation({
  args: submitFeedbackResponsePublicArgs,
  handler: submitFeedbackResponsePublicHandler,
});

export const rateOrganizer = mutation({
  args: rateOrganizerArgs,
  handler: rateOrganizerHandler,
});

export const submitOrganizerRatingPublic = mutation({
  args: submitOrganizerRatingPublicArgs,
  handler: submitOrganizerRatingPublicHandler,
});

// Image upload functions (already defined as mutations in uploadEventImage.ts)
export { generateUploadUrl, saveEventImage };