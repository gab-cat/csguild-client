import { cronJobs } from "convex/server";
import { v } from "convex/values";

import { internal } from "./_generated/api";
import { internalAction } from "./_generated/server";

// Define the action that will be called by cron
export const notifyProjectOwnersAction = internalAction({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    // Call the main notification function from the projects module
    await ctx.runAction(internal.projects.notifications.notifyProjectOwners, {});
    return null;
  },
});

const crons = cronJobs();

// Schedule notifications at 7 AM, 1 PM, and 9 PM PH time (UTC+8)
// 7 AM PH = 11 PM UTC (previous day)
// 1 PM PH = 5 AM UTC
// 9 PM PH = 1 PM UTC

// 11 PM UTC (7 AM PH next day)
crons.cron(
  "notify-project-owners-7am-ph",
  "0 23 * * *", // Every day at 23:00 UTC
  // @ts-ignore
  internal.crons.notifyProjectOwnersAction,
  {}
);

// 5 AM UTC (1 PM PH)
crons.cron(
  "notify-project-owners-1pm-ph",
  "0 5 * * *", // Every day at 05:00 UTC
  internal.crons.notifyProjectOwnersAction,
  {}
);

// 1 PM UTC (9 PM PH)
crons.cron(
  "notify-project-owners-9pm-ph",
  "0 13 * * *", // Every day at 13:00 UTC
  internal.crons.notifyProjectOwnersAction,
  {}
);

export default crons;
