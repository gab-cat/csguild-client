import { Doc } from "../../_generated/dataModel";
import { MutationCtx } from "../../_generated/server";
import { withAuthMutation } from "../../helpers";

export const resendEmailVerificationArgs = {};

export const resendEmailVerificationHandler = withAuthMutation(
  async (
    ctx: MutationCtx,
    _args,
    user: Doc<"users">
  ) => {
    // Generate a new verification code
    const verificationCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    // Update user with new verification code
    await ctx.db.patch(user._id, {
      emailVerificationCode: verificationCode,
      updatedAt: Date.now(),
    });

    // TODO: Send email with verification code
    // This would typically integrate with an email service

    return {
      message: "Verification code sent successfully",
      success: true,
      code: verificationCode // Remove this in production
    };
  }
);
