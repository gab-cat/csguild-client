import { v } from "convex/values";
import { ConvexError } from "convex/values";

import { api } from "../../_generated/api";
import { MutationCtx, mutation } from "../../_generated/server";

export const resendEmailVerificationArgs = {
  email: v.string(), // Required - email of the user who needs verification
};

export const resendEmailVerificationHandler = async (
  ctx: MutationCtx,
  args: { email: string }
) => {
  // Find user by email
  console.log("Resending email verification for email:", args.email);
  const user = await ctx.db
    .query("users")
    .withIndex("by_email", (q) => q.eq("email", args.email))
    .first();

  if (!user) {
    throw new ConvexError({
      code: "USER_NOT_FOUND",
      message: "No account found with this email address. Please sign up first."
    });
  }

  // Check if user is already verified
  if (user.emailVerified === true) {
    throw new ConvexError({
      code: "ALREADY_VERIFIED",
      message: "This email address is already verified. You can sign in directly."
    });
  }

  // Rate limiting: Check if a verification code was sent recently (within 60 seconds)
  const sixtySecondsAgo = Date.now() - 60 * 1000;
  if (user.updatedAt && user.updatedAt > sixtySecondsAgo && user.emailVerificationCode) {
    throw new ConvexError({
      code: "RATE_LIMITED",
      message: "Please wait at least 60 seconds before requesting another verification code."
    });
  }

  // Generate a new 6-digit numeric verification code
  const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

  // Update user with new verification code
  await ctx.db.patch(user._id, {
    emailVerificationCode: verificationCode,
    updatedAt: Date.now(),
  });

  // Send email verification using scheduler (with proper error handling)
  try {
    // @ts-ignore
    await ctx.scheduler.runAfter(0, api.emailDirect.sendEmailVerificationDirect, {
      email: user.email || "",
      verificationCode: verificationCode,
    });
  } catch (error) {
    console.error("Failed to schedule verification email:", error);
    // Don't fail the operation if email scheduling fails - user can try again
  }
  
  return {
    message: "Verification code sent successfully. Please check your email.",
    success: true
  };
};

// Export the mutation using the new function syntax
export const resendEmailVerification = mutation({
  args: resendEmailVerificationArgs,
  returns: v.object({
    message: v.string(),
    success: v.boolean(),
  }),
  handler: resendEmailVerificationHandler,
});
