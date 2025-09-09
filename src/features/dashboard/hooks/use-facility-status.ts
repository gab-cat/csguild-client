import { useQuery } from "convex/react";

import { api } from "../../../../convex/_generated/api";

export function useFacilityStatus() {
  const facilityStatus = useQuery(api.facilities.getFacilityOpenStatus, {});

  return {
    facility: facilityStatus?.facility || null,
    isOpen: facilityStatus?.isOpen || false,
    activeSessionsCount: facilityStatus?.activeSessionsCount || 0,
    isLoading: facilityStatus === undefined,
  };
}
