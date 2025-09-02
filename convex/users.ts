import { v } from "convex/values";

import { query, mutation } from "./_generated/server";
import {
  updateCurrentUserHandler,
  updateCurrentUserArgs,
  createUserHandler,
  createUserArgs,
  verifyEmailHandler,
  verifyEmailArgs,
  resendEmailVerificationHandler,
  resendEmailVerificationArgs,
  registerRfidCardHandler,
  registerRfidCardArgs,
  rfidLoginHandler,
  rfidLoginArgs,
  generateUploadUrlArgs,
  saveProfilePictureArgs,
  saveProfilePictureHandler,
  generateUploadUrlHandler,
} from "./users/mutations";
import {
  getCurrentUserHandler,
  getCurrentUserArgs,
  getUserByIdHandler,
  getUserByIdArgs,
  getUsersHandler,
  getUsersArgs,
  getUserVerificationStatusHandler,
  getUserVerificationStatusArgs,
} from "./users/queries";


// Queries
export const getCurrentUser = query({
  args: getCurrentUserArgs,
  handler: getCurrentUserHandler,
});

export const getUserById = query({
  args: getUserByIdArgs,
  handler: getUserByIdHandler,
});

export const getUsers = query({
  args: getUsersArgs,
  handler: getUsersHandler,
});

export const getUserVerificationStatus = query({
  args: getUserVerificationStatusArgs,
  handler: getUserVerificationStatusHandler,
});

// Mutations
export const updateCurrentUser = mutation({
  args: updateCurrentUserArgs,
  handler: updateCurrentUserHandler,
});

export const createUser = mutation({
  args: createUserArgs,
  handler: createUserHandler,
});

export const verifyEmail = mutation({
  args: verifyEmailArgs,
  handler: verifyEmailHandler,
});

export const resendEmailVerification = mutation({
  args: resendEmailVerificationArgs,
  handler: resendEmailVerificationHandler,
});

export const registerRfidCard = mutation({
  args: registerRfidCardArgs,
  handler: registerRfidCardHandler,
});

export const rfidLogin = mutation({
  args: rfidLoginArgs,
  handler: rfidLoginHandler,
});

export const generateUploadUrl = mutation({
  args: generateUploadUrlArgs,
  handler: generateUploadUrlHandler,
  returns: v.string(),
})

export const saveProfilePicture = mutation({
  args: saveProfilePictureArgs,
  handler: saveProfilePictureHandler
})