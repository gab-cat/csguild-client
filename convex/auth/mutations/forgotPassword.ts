import { v } from "convex/values";

import { MutationCtx } from "../../_generated/server";

export const forgotPasswordArgs = {
  email: v.string(),
};

export const forgotPasswordHandler = async (
  ctx: MutationCtx,
  args: { email: string }
) => {
  // Find user by email
  const user = await ctx.db
    .query("users")
    .withIndex("by_email", (q) => q.eq("email", args.email))
    .first();

  if (!user) {
    // Don't reveal if email exists or not for security
    return {
      message: "If the email exists, a password reset link has been sent",
      success: true
    };
  }

  // Generate reset token
  const resetToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  const resetExpires = Date.now() + 15 * 60 * 1000; // 15 minutes

  // Update user with reset token
  await ctx.db.patch(user._id, {
    passwordResetToken: resetToken,
    passwordResetExpiresAt: resetExpires,
    updatedAt: Date.now(),
  });

  // TODO: Send email with reset link
  // This would typically integrate with an email service

  return {
    message: "Password reset link sent to your email",
    success: true,
    resetToken: resetToken // Remove this in production
  };
};
