/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as auth_index from "../auth/index.js";
import type * as auth_mutations_forgotPassword from "../auth/mutations/forgotPassword.js";
import type * as auth_mutations_index from "../auth/mutations/index.js";
import type * as auth_mutations_resetPassword from "../auth/mutations/resetPassword.js";
import type * as auth from "../auth.js";
import type * as helpers from "../helpers.js";
import type * as http from "../http.js";
import type * as migration from "../migration.js";
import type * as users_index from "../users/index.js";
import type * as users_mutations_createUser from "../users/mutations/createUser.js";
import type * as users_mutations_index from "../users/mutations/index.js";
import type * as users_mutations_registerRfidCard from "../users/mutations/registerRfidCard.js";
import type * as users_mutations_resendEmailVerification from "../users/mutations/resendEmailVerification.js";
import type * as users_mutations_rfidLogin from "../users/mutations/rfidLogin.js";
import type * as users_mutations_updateCurrentUser from "../users/mutations/updateCurrentUser.js";
import type * as users_mutations_verifyEmail from "../users/mutations/verifyEmail.js";
import type * as users_queries_getCurrentUser from "../users/queries/getCurrentUser.js";
import type * as users_queries_getUserById from "../users/queries/getUserById.js";
import type * as users_queries_getUsers from "../users/queries/getUsers.js";
import type * as users_queries_index from "../users/queries/index.js";
import type * as users from "../users.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  "auth/index": typeof auth_index;
  "auth/mutations/forgotPassword": typeof auth_mutations_forgotPassword;
  "auth/mutations/index": typeof auth_mutations_index;
  "auth/mutations/resetPassword": typeof auth_mutations_resetPassword;
  auth: typeof auth;
  helpers: typeof helpers;
  http: typeof http;
  migration: typeof migration;
  "users/index": typeof users_index;
  "users/mutations/createUser": typeof users_mutations_createUser;
  "users/mutations/index": typeof users_mutations_index;
  "users/mutations/registerRfidCard": typeof users_mutations_registerRfidCard;
  "users/mutations/resendEmailVerification": typeof users_mutations_resendEmailVerification;
  "users/mutations/rfidLogin": typeof users_mutations_rfidLogin;
  "users/mutations/updateCurrentUser": typeof users_mutations_updateCurrentUser;
  "users/mutations/verifyEmail": typeof users_mutations_verifyEmail;
  "users/queries/getCurrentUser": typeof users_queries_getCurrentUser;
  "users/queries/getUserById": typeof users_queries_getUserById;
  "users/queries/getUsers": typeof users_queries_getUsers;
  "users/queries/index": typeof users_queries_index;
  users: typeof users;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
