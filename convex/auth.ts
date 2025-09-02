import { mutation } from "./_generated/server";
// import {
//   forgotPasswordHandler,
//   forgotPasswordArgs,
//   resetPasswordHandler,
//   resetPasswordArgs,
// } from "./auth/mutations";

// // Auth mutations
// export const forgotPassword = mutation({
//   args: forgotPasswordArgs,
//   handler: forgotPasswordHandler,
// });

// export const resetPassword = mutation({
//   args: resetPasswordArgs,
//   handler: resetPasswordHandler,
// });

// Re-export auth functions from index
export { auth, signIn, signOut, store, isAuthenticated } from "./auth/index";
