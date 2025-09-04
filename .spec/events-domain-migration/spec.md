# Feature Specification: Events Domain Migration to Convex

## Overview
Port the events domain from API-based architecture to Convex backend, removing all API utilities and hooks from the frontend and implementing direct Convex function calls in components.

## Problem Statement
The events domain is currently using API calls through utility functions and hooks, which adds unnecessary complexity and indirection. We need to migrate to a direct Convex integration following the same pattern established in the projects domain.

## Solution Concept
1. Remove all API utility files and hooks from `src/features/events/`
2. Implement Convex mutations and queries for all events and feedback functionality
3. Update all event components to call Convex functions directly
4. Follow the established pattern from the projects domain for consistency

## Success Criteria
- All event-related API calls are replaced with Convex function calls
- No API utility files or hooks remain in the events feature folder
- All event operations (CRUD, registration, feedback, attendance) work through Convex
- Components are updated to use Convex patterns consistently
- Maintain all existing functionality while improving performance and architecture

## Constraints
- Must maintain backward compatibility with existing event data
- Cannot break existing event functionality
- Must follow the established Convex patterns from projects domain
- Should not affect other domains during migration

## Risks
- Data migration issues if event schemas are not properly defined
- Potential loss of functionality if all endpoints are not properly ported
- Component breaking changes if Convex integration is not done correctly
- Performance issues if Convex functions are not optimized

## Stakeholders
- Event organizers who create and manage events
- Attendees who register and participate in events
- Administrators who manage event feedback and attendance
- Developers maintaining the codebase

## Technical Scope
### Mutations to Implement:
- createEvent
- updateEvent
- deleteEvent
- registerForEvent
- toggleEventSession (check-in/check-out)
- rateOrganizer
- createFeedbackForm
- submitFeedbackResponse
- updateFeedbackForm

### Queries to Implement:
- getEvents (with filtering, pagination, search)
- getEventBySlug
- getMyCreatedEvents
- getMyAttendedEvents
- getEventAttendees
- getEventSessions
- getPinnedEvents
- getOrganizerStatistics
- getFeedbackForm
- checkFeedbackStatus

### Schema Requirements:
- events table
- eventRegistrations table
- eventSessions table
- feedbackForms table
- feedbackResponses table
- organizerRatings table
