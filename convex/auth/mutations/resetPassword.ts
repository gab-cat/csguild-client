import { v } from "convex/values";

import { MutationCtx } from "../../_generated/server";

export const resetPasswordArgs = {
  token: v.string(),
  newPassword: v.string(),
};

export const resetPasswordHandler = async (
  ctx: MutationCtx,
  args: { token: string; newPassword: string }
) => {
  // Find user by reset token
  const user = await ctx.db
    .query("users")
    .filter((q) => q.eq(q.field("passwordResetToken"), args.token))
    .first();

  if (!user) {
    throw new Error("Invalid or expired reset token");
  }

  // Check if token is expired
  if (!user.passwordResetExpiresAt || user.passwordResetExpiresAt < Date.now()) {
    throw new Error("Reset token has expired");
  }

  // Update user password and clear reset token
  await ctx.db.patch(user._id, {
    password: args.newPassword, // In production, hash the password
    passwordResetToken: undefined,
    passwordResetExpiresAt: undefined,
    updatedAt: Date.now(),
  });

  return {
    message: "Password reset successfully",
    success: true
  };
};
