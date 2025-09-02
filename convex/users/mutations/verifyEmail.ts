import { v } from "convex/values";

import { Doc } from "../../_generated/dataModel";
import { MutationCtx } from "../../_generated/server";
import { withAuthMutation } from "../../helpers";

export const verifyEmailArgs = {
  code: v.string(),
};

export const verifyEmailHandler = withAuthMutation(
  async (
    ctx: MutationCtx,
    args: { code: string },
    user: Doc<"users">
  ) => {
    // Check if the verification code matches
    if (user.emailVerificationCode !== args.code) {
      throw new Error("Invalid verification code");
    }

    // Update user as verified
    await ctx.db.patch(user._id, {
      emailVerified: true,
      emailVerificationCode: undefined, // Clear the code after use
      updatedAt: Date.now(),
    });

    return { message: "Email verified successfully", success: true };
  }
);
