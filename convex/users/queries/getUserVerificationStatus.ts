import { getAuthUserId } from "@convex-dev/auth/server";

import { QueryCtx } from "../../_generated/server";

export const getUserVerificationStatusArgs = {};

export const getUserVerificationStatusHandler = async (ctx: QueryCtx) => {
  const userId = await getAuthUserId(ctx);
  if (userId === null) {
    return { needsAuth: true, needsVerification: false };
  }
  
  const user = await ctx.db.get(userId);
  if (!user) {
    return { needsAuth: true, needsVerification: false };
  }
  
  // Check if user needs email verification
  const needsVerification = user.signupMethod === "EMAIL" && !user.emailVerified;
  
  return {
    needsAuth: false,
    needsVerification,
    email: user.email,
    userId: user._id
  };
};
