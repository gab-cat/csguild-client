import { getAuthUserId } from "@convex-dev/auth/server";
import { ConvexError } from "convex/values";

import { Doc, Id } from "./_generated/dataModel";
import { QueryCtx, MutationCtx, ActionCtx } from "./_generated/server";

// Types for role-based access control
export type UserRole = "STUDENT" | "USER" | "STAFF" | "ADMIN";
export type RoleHierarchy = Record<UserRole, number>;

// Role hierarchy for permission levels (higher number = more permissions)
export const ROLE_HIERARCHY: RoleHierarchy = {
  STUDENT: 1,
  USER: 2,
  STAFF: 3,
  ADMIN: 4,
};

// Custom error classes for better error handling
export class AuthError extends ConvexError<{ code: string; message: string }> {
  constructor(message: string = "Authentication required") {
    super({ code: "AUTH_ERROR", message });
  }
}

export class PermissionError extends ConvexError<{ code: string; message: string }> {
  constructor(message: string = "Insufficient permissions") {
    super({ code: "PERMISSION_ERROR", message });
  }
}

export class RoleError extends ConvexError<{ code: string; message: string }> {
  constructor(message: string = "Invalid role") {
    super({ code: "ROLE_ERROR", message });
  }
}

// Helper function to get current user
export async function getCurrentUser(ctx: QueryCtx | MutationCtx | ActionCtx) {
  // Actions don't have direct db access, so we need to use runQuery
  if ("db" in ctx) {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new AuthError();
    }
    const user = await ctx.db.get(userId);
    if (!user) {
      throw new AuthError("User not found");
    }
    return user;
  } else {
    // For actions, we need to run a query
    throw new Error("Actions cannot directly access user data. Use runQuery instead.");
  }
}

// Helper function to check if user is authenticated
export async function requireAuth(ctx: QueryCtx | MutationCtx | ActionCtx) {
  return await getCurrentUser(ctx);
}

// Helper function to check if user has a specific role
export async function hasRole(
  ctx: QueryCtx | MutationCtx | ActionCtx,
  requiredRole: UserRole
): Promise<boolean> {
  try {
    const user = await getCurrentUser(ctx);
    return user.roles?.includes(requiredRole) ?? false;
  } catch {
    return false;
  }
}

// Helper function to check if user has any of the specified roles
export async function hasAnyRole(
  ctx: QueryCtx | MutationCtx | ActionCtx,
  requiredRoles: UserRole[]
): Promise<boolean> {
  try {
    const user = await getCurrentUser(ctx);
    return requiredRoles.some(role => user.roles?.includes(role) ?? false);
  } catch {
    return false;
  }
}

// Helper function to check if user has a minimum role level
export async function hasRoleLevel(
  ctx: QueryCtx | MutationCtx | ActionCtx,
  minRole: UserRole
): Promise<boolean> {
  try {
    const user = await getCurrentUser(ctx);
    const userRoleLevel = Math.max(
      ...(user.roles?.map(role => ROLE_HIERARCHY[role] ?? 0) ?? [0])
    );
    return userRoleLevel >= ROLE_HIERARCHY[minRole];
  } catch {
    return false;
  }
}

// Helper function to require a specific role
export async function requireRole(
  ctx: QueryCtx | MutationCtx | ActionCtx,
  requiredRole: UserRole
) {
  const user = await requireAuth(ctx);

  if (!user.roles?.includes(requiredRole)) {
    throw new PermissionError(`Required role: ${requiredRole}`);
  }

  return user;
}

// Helper function to require any of the specified roles
export async function requireAnyRole(
  ctx: QueryCtx | MutationCtx | ActionCtx,
  requiredRoles: UserRole[]
) {
  const user = await requireAuth(ctx);

  const hasRequiredRole = requiredRoles.some(role =>
    user.roles?.includes(role) ?? false
  );

  if (!hasRequiredRole) {
    throw new PermissionError(`Required roles: ${requiredRoles.join(" or ")}`);
  }

  return user;
}

// Helper function to require a minimum role level
export async function requireRoleLevel(
  ctx: QueryCtx | MutationCtx | ActionCtx,
  minRole: UserRole
) {
  const user = await requireAuth(ctx);

  const userRoleLevel = Math.max(
    ...(user.roles?.map(role => ROLE_HIERARCHY[role] ?? 0) ?? [0])
  );

  if (userRoleLevel < ROLE_HIERARCHY[minRole]) {
    throw new PermissionError(`Minimum role required: ${minRole}`);
  }

  return user;
}

// Helper function to check if user owns a resource (by userId)
export async function isOwner(
  ctx: QueryCtx | MutationCtx | ActionCtx,
  resourceUserId: string | Id<"users">
): Promise<boolean> {
  try {
    const user = await getCurrentUser(ctx);
    return user._id === resourceUserId || user.username === resourceUserId;
  } catch {
    return false;
  }
}

// Helper function to require ownership of a resource
export async function requireOwner(
  ctx: QueryCtx | MutationCtx | ActionCtx,
  resourceUserId: string | Id<"users">
) {
  const user = await requireAuth(ctx);

  if (user._id !== resourceUserId && user.username !== resourceUserId) {
    throw new PermissionError("Resource access denied - not the owner");
  }

  return user;
}

// Higher-order function wrappers for queries, mutations, and actions
export function withAuth<
  TArgs extends Record<string, unknown>,
  TReturn
>(
  handler: (ctx: QueryCtx, args: TArgs, user: Doc<"users">) => Promise<TReturn>
) {
  return async (ctx: QueryCtx, args: TArgs): Promise<TReturn> => {
    const user = await requireAuth(ctx);
    return handler(ctx, args, user);
  };
}

export function withAuthMutation<
  TArgs extends Record<string, unknown>,
  TReturn
>(
  handler: (ctx: MutationCtx, args: TArgs, user: Doc<"users">) => Promise<TReturn>
) {
  return async (ctx: MutationCtx, args: TArgs): Promise<TReturn> => {
    const user = await requireAuth(ctx);
    return handler(ctx, args, user);
  };
}

export function withAuthAction<
  TArgs extends Record<string, unknown>,
  TReturn
>(
  handler: (ctx: ActionCtx, args: TArgs, user: Doc<"users">) => Promise<TReturn>
) {
  return async (ctx: ActionCtx, args: TArgs): Promise<TReturn> => {
    const user = await requireAuth(ctx);
    return handler(ctx, args, user);
  };
}

export function withRole<
  TArgs extends Record<string, unknown>,
  TReturn
>(
  requiredRole: UserRole,
  handler: (ctx: QueryCtx, args: TArgs) => Promise<TReturn>
) {
  return async (ctx: QueryCtx, args: TArgs): Promise<TReturn> => {
    await requireRole(ctx, requiredRole);
    return handler(ctx, args);
  };
}

export function withRoleMutation<
  TArgs extends Record<string, unknown>,
  TReturn
>(
  requiredRole: UserRole,
  handler: (ctx: MutationCtx, args: TArgs) => Promise<TReturn>
) {
  return async (ctx: MutationCtx, args: TArgs): Promise<TReturn> => {
    await requireRole(ctx, requiredRole);
    return handler(ctx, args);
  };
}

export function withRoleAction<
  TArgs extends Record<string, unknown>,
  TReturn
>(
  requiredRole: UserRole,
  handler: (ctx: ActionCtx, args: TArgs) => Promise<TReturn>
) {
  return async (ctx: ActionCtx, args: TArgs): Promise<TReturn> => {
    await requireRole(ctx, requiredRole);
    return handler(ctx, args);
  };
}

export function withAnyRole<
  TArgs extends Record<string, unknown>,
  TReturn
>(
  requiredRoles: UserRole[],
  handler: (ctx: QueryCtx, args: TArgs) => Promise<TReturn>
) {
  return async (ctx: QueryCtx, args: TArgs): Promise<TReturn> => {
    await requireAnyRole(ctx, requiredRoles);
    return handler(ctx, args);
  };
}

export function withAnyRoleMutation<
  TArgs extends Record<string, unknown>,
  TReturn
>(
  requiredRoles: UserRole[],
  handler: (ctx: MutationCtx, args: TArgs) => Promise<TReturn>
) {
  return async (ctx: MutationCtx, args: TArgs): Promise<TReturn> => {
    await requireAnyRole(ctx, requiredRoles);
    return handler(ctx, args);
  };
}

export function withAnyRoleAction<
  TArgs extends Record<string, unknown>,
  TReturn
>(
  requiredRoles: UserRole[],
  handler: (ctx: ActionCtx, args: TArgs) => Promise<TReturn>
) {
  return async (ctx: ActionCtx, args: TArgs): Promise<TReturn> => {
    await requireAnyRole(ctx, requiredRoles);
    return handler(ctx, args);
  };
}

export function withRoleLevel<
  TArgs extends Record<string, unknown>,
  TReturn
>(
  minRole: UserRole,
  handler: (ctx: QueryCtx, args: TArgs) => Promise<TReturn>
) {
  return async (ctx: QueryCtx, args: TArgs): Promise<TReturn> => {
    await requireRoleLevel(ctx, minRole);
    return handler(ctx, args);
  };
}

export function withRoleLevelMutation<
  TArgs extends Record<string, unknown>,
  TReturn
>(
  minRole: UserRole,
  handler: (ctx: MutationCtx, args: TArgs) => Promise<TReturn>
) {
  return async (ctx: MutationCtx, args: TArgs): Promise<TReturn> => {
    await requireRoleLevel(ctx, minRole);
    return handler(ctx, args);
  };
}

export function withRoleLevelAction<
  TArgs extends Record<string, unknown>,
  TReturn
>(
  minRole: UserRole,
  handler: (ctx: ActionCtx, args: TArgs) => Promise<TReturn>
) {
  return async (ctx: ActionCtx, args: TArgs): Promise<TReturn> => {
    await requireRoleLevel(ctx, minRole);
    return handler(ctx, args);
  };
}

export function withOwnership<
  TArgs extends Record<string, unknown>,
  TReturn
>(
  getResourceUserId: (args: TArgs) => string | Id<"users">,
  handler: (ctx: QueryCtx, args: TArgs) => Promise<TReturn>
) {
  return async (ctx: QueryCtx, args: TArgs): Promise<TReturn> => {
    const resourceUserId = getResourceUserId(args);
    await requireOwner(ctx, resourceUserId);
    return handler(ctx, args);
  };
}

export function withOwnershipMutation<
  TArgs extends Record<string, unknown>,
  TReturn
>(
  getResourceUserId: (args: TArgs) => string | Id<"users">,
  handler: (ctx: MutationCtx, args: TArgs) => Promise<TReturn>
) {
  return async (ctx: MutationCtx, args: TArgs): Promise<TReturn> => {
    const resourceUserId = getResourceUserId(args);
    await requireOwner(ctx, resourceUserId);
    return handler(ctx, args);
  };
}

export function withOwnershipAction<
  TArgs extends Record<string, unknown>,
  TReturn
>(
  getResourceUserId: (args: TArgs) => string | Id<"users">,
  handler: (ctx: ActionCtx, args: TArgs) => Promise<TReturn>
) {
  return async (ctx: ActionCtx, args: TArgs): Promise<TReturn> => {
    const resourceUserId = getResourceUserId(args);
    await requireOwner(ctx, resourceUserId);
    return handler(ctx, args);
  };
}

// Combined authorization wrapper (auth + role)
export function withAuthAndRole<
  TArgs extends Record<string, unknown>,
  TReturn
>(
  requiredRole: UserRole,
  handler: (ctx: QueryCtx, args: TArgs, user: Doc<"users">) => Promise<TReturn>
) {
  return async (ctx: QueryCtx, args: TArgs): Promise<TReturn> => {
    const user = await requireRole(ctx, requiredRole);
    return handler(ctx, args, user);
  };
}

export function withAuthAndRoleMutation<
  TArgs extends Record<string, unknown>,
  TReturn
>(
  requiredRole: UserRole,
  handler: (ctx: MutationCtx, args: TArgs, user: Doc<"users">) => Promise<TReturn>
) {
  return async (ctx: MutationCtx, args: TArgs): Promise<TReturn> => {
    const user = await requireRole(ctx, requiredRole);
    return handler(ctx, args, user);
  };
}

export function withAuthAndRoleAction<
  TArgs extends Record<string, unknown>,
  TReturn
>(
  requiredRole: UserRole,
  handler: (ctx: ActionCtx, args: TArgs, user: Doc<"users">) => Promise<TReturn>
) {
  return async (ctx: ActionCtx, args: TArgs): Promise<TReturn> => {
    const user = await requireRole(ctx, requiredRole);
    return handler(ctx, args, user);
  };
}

// Utility functions for role management
export function getHighestRole(roles: UserRole[]): UserRole | null {
  if (!roles || roles.length === 0) return null;

  return roles.reduce((highest, current) => {
    return ROLE_HIERARCHY[current] > ROLE_HIERARCHY[highest] ? current : highest;
  });
}

export function canManageRole(userRole: UserRole, targetRole: UserRole): boolean {
  return ROLE_HIERARCHY[userRole] > ROLE_HIERARCHY[targetRole];
}

export function getRolePermissions(role: UserRole): string[] {
  const permissions: Record<UserRole, string[]> = {
    STUDENT: ["read:own_profile", "read:public_content"],
    USER: ["read:own_profile", "read:public_content", "write:own_content"],
    STAFF: [
      "read:own_profile",
      "read:public_content",
      "write:own_content",
      "moderate:content",
      "manage:events"
    ],
    ADMIN: [
      "read:own_profile",
      "read:public_content",
      "write:own_content",
      "moderate:content",
      "manage:events",
      "manage:users",
      "manage:system"
    ]
  };

  return permissions[role] || [];
}

// Validation helpers
export function validateRoles(roles: UserRole[]): boolean {
  const validRoles: UserRole[] = ["STUDENT", "USER", "STAFF", "ADMIN"];
  return roles.every(role => validRoles.includes(role));
}

export function isValidRole(role: string): role is UserRole {
  return ["STUDENT", "USER", "STAFF", "ADMIN"].includes(role as UserRole);
}
