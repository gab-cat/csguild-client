import { getAuthUserId } from "@convex-dev/auth/server";

import { QueryCtx } from "../../_generated/server";

export const getCurrentUserArgs = {};

export const getCurrentUserHandler = async (ctx: QueryCtx) => {
  const userId = await getAuthUserId(ctx);
  if (userId === null) {
    return null;
  }
  
  const user = await ctx.db.get(userId);
  if (!user) {
    return null;
  }
  
  // For email/password users, require email verification
  // Google OAuth users are automatically verified
  if (user.signupMethod === "EMAIL" && !user.emailVerified) {
    // Return null to force user to verify email
    // Frontend will handle redirecting to verification page
    return null;
  }
  
  return user;
};