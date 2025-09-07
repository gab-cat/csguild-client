import { query, mutation } from "./_generated/server";
import {
  createFacilityArgs,
  createFacilityHandler,
  endFacilitySessionArgs,
  endFacilitySessionHandler,
  startFacilitySessionArgs,
  startFacilitySessionHandler,
  toggleFacilityAccessArgs,
  toggleFacilityAccessHandler,
  updateFacilityArgs,
  updateFacilityHandler,
} from "./facilitiesDefinitions/mutations";
import {
  getActiveSessionsArgs,
  getActiveSessionsHandler,
  getFacilitiesArgs,
  getFacilitiesHandler,
  getFacilityByIdArgs,
  getFacilityByIdHandler,
  getFacilityUsageHistoryArgs,
  getFacilityUsageHistoryHandler,
} from "./facilitiesDefinitions/queries";

// MUTATIONS

export const toggleFacilityAccess = mutation({
  args: toggleFacilityAccessArgs,
  handler: toggleFacilityAccessHandler,
});

export const createFacility = mutation({
  args: createFacilityArgs,
  handler: createFacilityHandler,
});

export const updateFacility = mutation({
  args: updateFacilityArgs,
  handler: updateFacilityHandler,
});

export const startFacilitySession = mutation({
  args: startFacilitySessionArgs,
  handler: startFacilitySessionHandler,
});

export const endFacilitySession = mutation({
  args: endFacilitySessionArgs,
  handler: endFacilitySessionHandler,
});

// QUERIES

export const getFacilities = query({
  args: getFacilitiesArgs,
  handler: getFacilitiesHandler,
});

export const getFacilityById = query({
  args: getFacilityByIdArgs,
  handler: getFacilityByIdHandler,
});

export const getActiveSessions = query({
  args: getActiveSessionsArgs,
  handler: getActiveSessionsHandler,
});

export const getFacilityUsageHistory = query({
  args: getFacilityUsageHistoryArgs,
  handler: getFacilityUsageHistoryHandler,
});

