import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";

import { MutationCtx } from "../../_generated/server";

export const removeProjectMemberArgs = {
  slug: v.string(),
  memberUserSlug: v.string(),
};

export const removeProjectMemberHandler = async (
  ctx: MutationCtx,
  args: {
    slug: string;
    memberUserSlug: string;
  }
) => {
  const userId = await getAuthUserId(ctx);
  if (!userId) {
    throw new Error("Authentication required");
  }

  const currentUser = await ctx.db.get(userId);
  if (!currentUser?.username) {
    throw new Error("User not found");
  }

  // Check if project exists
  const project = await ctx.db
    .query("projects")
    .withIndex("by_slug", q => q.eq("slug", args.slug))
    .first();

  if (!project) {
    throw new Error("Project not found");
  }

  // Check if user is the project owner
  if (project.ownerSlug !== currentUser.username) {
    throw new Error("Only project owners can remove members");
  }

  // Check if target user exists
  const memberUser = await ctx.db
    .query("users")
    .withIndex("by_username", q => q.eq("username", args.memberUserSlug))
    .first();

  if (!memberUser) {
    throw new Error("Member user not found");
  }

  // Prevent owner from removing themselves
  if (args.memberUserSlug === currentUser.username) {
    throw new Error("Project owners cannot remove themselves");
  }

  // Find the project member
  const projectMember = await ctx.db
    .query("projectMembers")
    .withIndex("by_projectSlug", q => q.eq("projectSlug", args.slug))
    .filter(q => q.eq(q.field("userSlug"), args.memberUserSlug))
    .filter(q => q.neq(q.field("status"), "REMOVED"))
    .first();

  if (!projectMember) {
    throw new Error("User is not a member of this project");
  }

  const now = Date.now();

  // Update member status to REMOVED
  await ctx.db.patch(projectMember._id, {
    status: "REMOVED",
    updatedAt: now,
  });

  // Get role details
  const role = await ctx.db
    .query("userRoles")
    .withIndex("by_slug", q => q.eq("slug", projectMember.roleSlug))
    .first();

  return {
    success: true,
    message: "Member removed successfully",
    projectSlug: args.slug,
    member: {
      id: memberUser._id,
      username: memberUser.username,
      firstName: memberUser.firstName,
      lastName: memberUser.lastName,
      imageUrl: memberUser.imageUrl,
      role: role ? {
        id: role._id,
        name: role.name,
        slug: role.slug,
      } : null,
      removedAt: now,
    },
  };
};
