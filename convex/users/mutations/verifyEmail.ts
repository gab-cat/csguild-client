import { v } from "convex/values";
import { ConvexError } from "convex/values";

import { MutationCtx } from "../../_generated/server";

export const verifyEmailArgs = {
  email: v.string(), // Required - email of the user
  code: v.string(),  // Required - verification code
};

export const verifyEmailHandler = async (
  ctx: MutationCtx,
  args: { email: string; code: string }
) => {
  // Find user by email
  const user = await ctx.db
    .query("users")
    .withIndex("by_email", (q) => q.eq("email", args.email))
    .first();

  if (!user) {
    throw new ConvexError({
      code: "USER_NOT_FOUND",
      message: "No account found with this email address."
    });
  }

  // Check if user is already verified
  if (user.emailVerified === true) {
    throw new ConvexError({
      code: "ALREADY_VERIFIED",
      message: "This email address is already verified."
    });
  }

  // Check if the verification code matches
  if (user.emailVerificationCode !== args.code) {
    throw new ConvexError({
      code: "INVALID_CODE",
      message: "Invalid verification code. Please check the code and try again."
    });
  }

  // Update user as verified
  await ctx.db.patch(user._id, {
    emailVerified: true,
    emailVerificationCode: undefined, // Clear the code after use
    updatedAt: Date.now(),
  });

  return { 
    message: "Email verified successfully", 
    success: true 
  };
};
