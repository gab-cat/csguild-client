/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as ResendOTP from "../ResendOTP.js";
import type * as ResendOTPPasswordReset from "../ResendOTPPasswordReset.js";
import type * as auth_index from "../auth/index.js";
import type * as auth from "../auth.js";
import type * as crons from "../crons.js";
import type * as email from "../email.js";
import type * as emailDirect from "../emailDirect.js";
import type * as events_index from "../events/index.js";
import type * as events_mutations_createEvent from "../events/mutations/createEvent.js";
import type * as events_mutations_createFeedbackForm from "../events/mutations/createFeedbackForm.js";
import type * as events_mutations_deleteEvent from "../events/mutations/deleteEvent.js";
import type * as events_mutations_index from "../events/mutations/index.js";
import type * as events_mutations_rateOrganizer from "../events/mutations/rateOrganizer.js";
import type * as events_mutations_registerForEvent from "../events/mutations/registerForEvent.js";
import type * as events_mutations_submitFeedbackResponse from "../events/mutations/submitFeedbackResponse.js";
import type * as events_mutations_submitFeedbackResponsePublic from "../events/mutations/submitFeedbackResponsePublic.js";
import type * as events_mutations_submitOrganizerRatingPublic from "../events/mutations/submitOrganizerRatingPublic.js";
import type * as events_mutations_toggleEventSession from "../events/mutations/toggleEventSession.js";
import type * as events_mutations_unregisterFromEvent from "../events/mutations/unregisterFromEvent.js";
import type * as events_mutations_updateEvent from "../events/mutations/updateEvent.js";
import type * as events_mutations_updateFeedbackForm from "../events/mutations/updateFeedbackForm.js";
import type * as events_mutations_uploadEventImage from "../events/mutations/uploadEventImage.js";
import type * as events_queries_checkFeedbackStatus from "../events/queries/checkFeedbackStatus.js";
import type * as events_queries_getEventAttendees from "../events/queries/getEventAttendees.js";
import type * as events_queries_getEventBySlug from "../events/queries/getEventBySlug.js";
import type * as events_queries_getEventFeedbackResponses from "../events/queries/getEventFeedbackResponses.js";
import type * as events_queries_getEventSessions from "../events/queries/getEventSessions.js";
import type * as events_queries_getEventWithFeedbackFormPublic from "../events/queries/getEventWithFeedbackFormPublic.js";
import type * as events_queries_getEvents from "../events/queries/getEvents.js";
import type * as events_queries_getFeedbackForm from "../events/queries/getFeedbackForm.js";
import type * as events_queries_getMyAttendedEvents from "../events/queries/getMyAttendedEvents.js";
import type * as events_queries_getMyCreatedEvents from "../events/queries/getMyCreatedEvents.js";
import type * as events_queries_getOrganizerStatistics from "../events/queries/getOrganizerStatistics.js";
import type * as events_queries_getPinnedEvents from "../events/queries/getPinnedEvents.js";
import type * as events_queries_index from "../events/queries/index.js";
import type * as events from "../events.js";
import type * as facilities_index from "../facilities/index.js";
import type * as facilities_mutations_createFacility from "../facilities/mutations/createFacility.js";
import type * as facilities_mutations_endFacilitySession from "../facilities/mutations/endFacilitySession.js";
import type * as facilities_mutations_index from "../facilities/mutations/index.js";
import type * as facilities_mutations_startFacilitySession from "../facilities/mutations/startFacilitySession.js";
import type * as facilities_mutations_toggleFacilityAccess from "../facilities/mutations/toggleFacilityAccess.js";
import type * as facilities_mutations_updateFacility from "../facilities/mutations/updateFacility.js";
import type * as facilities_queries_getActiveSessions from "../facilities/queries/getActiveSessions.js";
import type * as facilities_queries_getFacilities from "../facilities/queries/getFacilities.js";
import type * as facilities_queries_getFacilityById from "../facilities/queries/getFacilityById.js";
import type * as facilities_queries_getFacilityUsageHistory from "../facilities/queries/getFacilityUsageHistory.js";
import type * as facilities_queries_index from "../facilities/queries/index.js";
import type * as facilities from "../facilities.js";
import type * as helpers from "../helpers.js";
import type * as http from "../http.js";
import type * as migrate from "../migrate.js";
import type * as migration from "../migration.js";
import type * as projects_index from "../projects/index.js";
import type * as projects_mutations_createProject from "../projects/mutations/createProject.js";
import type * as projects_mutations_createRole from "../projects/mutations/createRole.js";
import type * as projects_mutations_index from "../projects/mutations/index.js";
import type * as projects_mutations_joinProject from "../projects/mutations/joinProject.js";
import type * as projects_mutations_reactivateProjectMember from "../projects/mutations/reactivateProjectMember.js";
import type * as projects_mutations_removeProjectMember from "../projects/mutations/removeProjectMember.js";
import type * as projects_mutations_reviewApplication from "../projects/mutations/reviewApplication.js";
import type * as projects_mutations_saveProject from "../projects/mutations/saveProject.js";
import type * as projects_mutations_unsaveProject from "../projects/mutations/unsaveProject.js";
import type * as projects_mutations_updateProject from "../projects/mutations/updateProject.js";
import type * as projects_notifications from "../projects/notifications.js";
import type * as projects_notifications_actions from "../projects/notifications_actions.js";
import type * as projects_notifications_mutations from "../projects/notifications_mutations.js";
import type * as projects_notifications_queries from "../projects/notifications_queries.js";
import type * as projects_queries_getMyApplications from "../projects/queries/getMyApplications.js";
import type * as projects_queries_getMyProjects from "../projects/queries/getMyProjects.js";
import type * as projects_queries_getPinnedProjects from "../projects/queries/getPinnedProjects.js";
import type * as projects_queries_getProjectBySlug from "../projects/queries/getProjectBySlug.js";
import type * as projects_queries_getProjects from "../projects/queries/getProjects.js";
import type * as projects_queries_getRoleBySlug from "../projects/queries/getRoleBySlug.js";
import type * as projects_queries_getRoles from "../projects/queries/getRoles.js";
import type * as projects_queries_getSavedProjects from "../projects/queries/getSavedProjects.js";
import type * as projects_queries_index from "../projects/queries/index.js";
import type * as projects from "../projects.js";
import type * as users_index from "../users/index.js";
import type * as users_mutations_createUser from "../users/mutations/createUser.js";
import type * as users_mutations_index from "../users/mutations/index.js";
import type * as users_mutations_registerRfidCard from "../users/mutations/registerRfidCard.js";
import type * as users_mutations_resendEmailVerification from "../users/mutations/resendEmailVerification.js";
import type * as users_mutations_rfidLogin from "../users/mutations/rfidLogin.js";
import type * as users_mutations_sendInitialEmailVerification from "../users/mutations/sendInitialEmailVerification.js";
import type * as users_mutations_updateCurrentUser from "../users/mutations/updateCurrentUser.js";
import type * as users_mutations_uploadProfilePicture from "../users/mutations/uploadProfilePicture.js";
import type * as users_mutations_verifyEmail from "../users/mutations/verifyEmail.js";
import type * as users_queries_getCurrentUser from "../users/queries/getCurrentUser.js";
import type * as users_queries_getUserById from "../users/queries/getUserById.js";
import type * as users_queries_getUserVerificationStatus from "../users/queries/getUserVerificationStatus.js";
import type * as users_queries_getUsers from "../users/queries/getUsers.js";
import type * as users_queries_index from "../users/queries/index.js";
import type * as users from "../users.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  ResendOTP: typeof ResendOTP;
  ResendOTPPasswordReset: typeof ResendOTPPasswordReset;
  "auth/index": typeof auth_index;
  auth: typeof auth;
  crons: typeof crons;
  email: typeof email;
  emailDirect: typeof emailDirect;
  "events/index": typeof events_index;
  "events/mutations/createEvent": typeof events_mutations_createEvent;
  "events/mutations/createFeedbackForm": typeof events_mutations_createFeedbackForm;
  "events/mutations/deleteEvent": typeof events_mutations_deleteEvent;
  "events/mutations/index": typeof events_mutations_index;
  "events/mutations/rateOrganizer": typeof events_mutations_rateOrganizer;
  "events/mutations/registerForEvent": typeof events_mutations_registerForEvent;
  "events/mutations/submitFeedbackResponse": typeof events_mutations_submitFeedbackResponse;
  "events/mutations/submitFeedbackResponsePublic": typeof events_mutations_submitFeedbackResponsePublic;
  "events/mutations/submitOrganizerRatingPublic": typeof events_mutations_submitOrganizerRatingPublic;
  "events/mutations/toggleEventSession": typeof events_mutations_toggleEventSession;
  "events/mutations/unregisterFromEvent": typeof events_mutations_unregisterFromEvent;
  "events/mutations/updateEvent": typeof events_mutations_updateEvent;
  "events/mutations/updateFeedbackForm": typeof events_mutations_updateFeedbackForm;
  "events/mutations/uploadEventImage": typeof events_mutations_uploadEventImage;
  "events/queries/checkFeedbackStatus": typeof events_queries_checkFeedbackStatus;
  "events/queries/getEventAttendees": typeof events_queries_getEventAttendees;
  "events/queries/getEventBySlug": typeof events_queries_getEventBySlug;
  "events/queries/getEventFeedbackResponses": typeof events_queries_getEventFeedbackResponses;
  "events/queries/getEventSessions": typeof events_queries_getEventSessions;
  "events/queries/getEventWithFeedbackFormPublic": typeof events_queries_getEventWithFeedbackFormPublic;
  "events/queries/getEvents": typeof events_queries_getEvents;
  "events/queries/getFeedbackForm": typeof events_queries_getFeedbackForm;
  "events/queries/getMyAttendedEvents": typeof events_queries_getMyAttendedEvents;
  "events/queries/getMyCreatedEvents": typeof events_queries_getMyCreatedEvents;
  "events/queries/getOrganizerStatistics": typeof events_queries_getOrganizerStatistics;
  "events/queries/getPinnedEvents": typeof events_queries_getPinnedEvents;
  "events/queries/index": typeof events_queries_index;
  events: typeof events;
  "facilities/index": typeof facilities_index;
  "facilities/mutations/createFacility": typeof facilities_mutations_createFacility;
  "facilities/mutations/endFacilitySession": typeof facilities_mutations_endFacilitySession;
  "facilities/mutations/index": typeof facilities_mutations_index;
  "facilities/mutations/startFacilitySession": typeof facilities_mutations_startFacilitySession;
  "facilities/mutations/toggleFacilityAccess": typeof facilities_mutations_toggleFacilityAccess;
  "facilities/mutations/updateFacility": typeof facilities_mutations_updateFacility;
  "facilities/queries/getActiveSessions": typeof facilities_queries_getActiveSessions;
  "facilities/queries/getFacilities": typeof facilities_queries_getFacilities;
  "facilities/queries/getFacilityById": typeof facilities_queries_getFacilityById;
  "facilities/queries/getFacilityUsageHistory": typeof facilities_queries_getFacilityUsageHistory;
  "facilities/queries/index": typeof facilities_queries_index;
  facilities: typeof facilities;
  helpers: typeof helpers;
  http: typeof http;
  migrate: typeof migrate;
  migration: typeof migration;
  "projects/index": typeof projects_index;
  "projects/mutations/createProject": typeof projects_mutations_createProject;
  "projects/mutations/createRole": typeof projects_mutations_createRole;
  "projects/mutations/index": typeof projects_mutations_index;
  "projects/mutations/joinProject": typeof projects_mutations_joinProject;
  "projects/mutations/reactivateProjectMember": typeof projects_mutations_reactivateProjectMember;
  "projects/mutations/removeProjectMember": typeof projects_mutations_removeProjectMember;
  "projects/mutations/reviewApplication": typeof projects_mutations_reviewApplication;
  "projects/mutations/saveProject": typeof projects_mutations_saveProject;
  "projects/mutations/unsaveProject": typeof projects_mutations_unsaveProject;
  "projects/mutations/updateProject": typeof projects_mutations_updateProject;
  "projects/notifications": typeof projects_notifications;
  "projects/notifications_actions": typeof projects_notifications_actions;
  "projects/notifications_mutations": typeof projects_notifications_mutations;
  "projects/notifications_queries": typeof projects_notifications_queries;
  "projects/queries/getMyApplications": typeof projects_queries_getMyApplications;
  "projects/queries/getMyProjects": typeof projects_queries_getMyProjects;
  "projects/queries/getPinnedProjects": typeof projects_queries_getPinnedProjects;
  "projects/queries/getProjectBySlug": typeof projects_queries_getProjectBySlug;
  "projects/queries/getProjects": typeof projects_queries_getProjects;
  "projects/queries/getRoleBySlug": typeof projects_queries_getRoleBySlug;
  "projects/queries/getRoles": typeof projects_queries_getRoles;
  "projects/queries/getSavedProjects": typeof projects_queries_getSavedProjects;
  "projects/queries/index": typeof projects_queries_index;
  projects: typeof projects;
  "users/index": typeof users_index;
  "users/mutations/createUser": typeof users_mutations_createUser;
  "users/mutations/index": typeof users_mutations_index;
  "users/mutations/registerRfidCard": typeof users_mutations_registerRfidCard;
  "users/mutations/resendEmailVerification": typeof users_mutations_resendEmailVerification;
  "users/mutations/rfidLogin": typeof users_mutations_rfidLogin;
  "users/mutations/sendInitialEmailVerification": typeof users_mutations_sendInitialEmailVerification;
  "users/mutations/updateCurrentUser": typeof users_mutations_updateCurrentUser;
  "users/mutations/uploadProfilePicture": typeof users_mutations_uploadProfilePicture;
  "users/mutations/verifyEmail": typeof users_mutations_verifyEmail;
  "users/queries/getCurrentUser": typeof users_queries_getCurrentUser;
  "users/queries/getUserById": typeof users_queries_getUserById;
  "users/queries/getUserVerificationStatus": typeof users_queries_getUserVerificationStatus;
  "users/queries/getUsers": typeof users_queries_getUsers;
  "users/queries/index": typeof users_queries_index;
  users: typeof users;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
