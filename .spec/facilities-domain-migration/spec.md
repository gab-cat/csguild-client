# Feature Specification: Facilities Domain Migration to Convex

## Overview
Port the facilities domain from API-based architecture to Convex backend, removing all API utilities and hooks from the frontend and implementing direct Convex function calls in components for RFID-based facility access control.

## Problem Statement
The facilities domain is currently using API calls through utility functions and hooks, which adds unnecessary complexity and indirection. We need to migrate to a direct Convex integration following the same pattern established in the events domain, while maintaining the real-time RFID access control functionality and facility usage tracking.

## Solution Concept
1. Remove all API utility files and hooks from `src/features/facilities/`
2. Implement Convex mutations and queries for all facility access and management functionality
3. Update all facility components to call Convex functions directly
4. Follow the established pattern from the events domain for consistency
5. Maintain real-time RFID scanning and facility occupancy tracking

## Success Criteria
- All facility-related API calls are replaced with Convex function calls
- No API utility files or hooks remain in the facilities feature folder
- All facility operations (access control, usage tracking, occupancy monitoring) work through Convex
- Components are updated to use Convex patterns consistently
- Maintain all existing RFID functionality while improving performance and architecture
- Real-time facility occupancy updates work correctly

## Constraints
- Must maintain backward compatibility with existing facility data
- Cannot break existing RFID scanning functionality
- Must follow the established Convex patterns from events domain
- Should not affect other domains during migration
- Must maintain real-time facility occupancy tracking

## Risks
- Data migration issues if facility schemas are not properly updated
- Potential loss of RFID functionality if Convex integration is not done correctly
- Component breaking changes if Convex integration is not done correctly
- Performance issues if Convex functions are not optimized for real-time operations
- Real-time occupancy tracking may be affected during migration

## Stakeholders
- Facility administrators who manage facility access and monitor occupancy
- Students and staff who use RFID cards for facility access
- System administrators who monitor facility usage and access logs
- Developers maintaining the codebase

## Technical Scope
### Mutations to Implement:
- toggleFacilityAccess (RFID check-in/check-out)
- updateFacilityOccupancy
- createFacility (admin only)
- updateFacility (admin only)
- deactivateFacility (admin only)

### Queries to Implement:
- getFacilities (with real-time occupancy)
- getFacilityById
- getActiveSessions (current users in facility)
- getFacilityUsageHistory (with pagination)
- getFacilityOccupancy (real-time)
- getFacilityStatus (check if user is currently in facility)
- getFacilityStatistics (usage analytics)

### Schema Requirements:
- facilities table (already exists, may need updates)
- facilityUsages table (already exists, may need updates)
- facilityAccessLogs table (for audit trail)
- facilityOccupancy table (for real-time tracking)

### Real-time Features:
- Live facility occupancy updates
- Real-time RFID scan processing
- Instant facility status changes
- Live session tracking
