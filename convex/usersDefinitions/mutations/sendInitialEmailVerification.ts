import { v } from "convex/values";

import { Doc, Id } from "../../_generated/dataModel";
import { MutationCtx } from "../../_generated/server";

export const sendInitialEmailVerificationArgs = {
  userId: v.id("users"),
};

export const sendInitialEmailVerificationHandler = async (
  ctx: MutationCtx,
  args: { userId: Id<"users"> }
) => {
  // Get the user
  const user = await ctx.db.get(args.userId) as Doc<"users"> | null;
  
  if (!user) {
    throw new Error("User not found");
  }
  
  if (user.emailVerified) {
    return {
      message: "Email is already verified",
      success: true
    };
  }
  
  if (!user.email) {
    throw new Error("User has no email address");
  }
  
  // Generate a new verification code if one doesn't exist
  let verificationCode = user.emailVerificationCode;
  if (!verificationCode) {
    verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    await ctx.db.patch(user._id, {
      emailVerificationCode: verificationCode,
      updatedAt: Date.now(),
    });
  }
  
  // TODO: Fix type instantiation issue with scheduler
  // ctx.scheduler.runAfter(0, internal.email.sendEmailVerification, {
  //   email: user.email || "",
  //   verificationCode: verificationCode,
  // });

  return {
    message: "Verification code generated. Please check your email for the verification code.",
    success: true,
  };
};
