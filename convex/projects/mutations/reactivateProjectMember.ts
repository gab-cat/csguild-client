import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";

import { MutationCtx } from "../../_generated/server";

export const reactivateProjectMemberArgs = {
  slug: v.string(),
  memberUserSlug: v.string(),
};

export const reactivateProjectMemberHandler = async (
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
    throw new Error("Only project owners can reactivate members");
  }

  // Check if target user exists
  const memberUser = await ctx.db
    .query("users")
    .withIndex("by_username", q => q.eq("username", args.memberUserSlug))
    .first();

  if (!memberUser) {
    throw new Error("Member user not found");
  }

  // Find the removed project member
  const projectMember = await ctx.db
    .query("projectMembers")
    .withIndex("by_projectSlug", q => q.eq("projectSlug", args.slug))
    .filter(q => q.eq(q.field("userSlug"), args.memberUserSlug))
    .filter(q => q.eq(q.field("status"), "REMOVED"))
    .first();

  if (!projectMember) {
    throw new Error("User is not a removed member of this project");
  }

  // Check if role has reached maximum members
  const projectRole = await ctx.db
    .query("projectRoles")
    .withIndex("by_projectSlug_roleSlug", q =>
      q.eq("projectSlug", args.slug).eq("roleSlug", projectMember.roleSlug)
    )
    .first();

  if (projectRole?.maxMembers) {
    const currentMembers = await ctx.db
      .query("projectMembers")
      .withIndex("by_projectSlug", q => q.eq("projectSlug", args.slug))
      .filter(q => q.eq(q.field("roleSlug"), projectMember.roleSlug))
      .filter(q => q.neq(q.field("status"), "REMOVED"))
      .collect();

    if (currentMembers.length >= projectRole.maxMembers) {
      throw new Error("This role has reached its maximum number of members");
    }
  }

  const now = Date.now();

  // Update member status to ACTIVE
  await ctx.db.patch(projectMember._id, {
    status: "ACTIVE",
    joinedAt: now, // Update join date to reflect reactivation
    updatedAt: now,
  });

  // Get role details
  const role = await ctx.db
    .query("userRoles")
    .withIndex("by_slug", q => q.eq("slug", projectMember.roleSlug))
    .first();

  return {
    success: true,
    message: "Member reactivated successfully",
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
      reactivatedAt: now,
    },
  };
};
