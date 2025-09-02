import { makeUseQueryWithStatus } from "convex-helpers/react";
import { useQueries } from "convex-helpers/react/cache/hooks";

export const useQueryWithStatus = makeUseQueryWithStatus(useQueries);


// Sample usage in client
// const { status, data, error, isSuccess, isPending, isError } =
//   useQueryWithStatus(api.foo.bar, { myArg: 123 });