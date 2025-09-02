import { v } from "convex/values";

import { QueryCtx } from "../../_generated/server";

export const getProjectBySlugArgs = {
  slug: v.string(),
};

export const getProjectBySlugHandler = async (
  ctx: QueryCtx,
  args: { slug: string }
) => {
  const project = await ctx.db
    .query("projects")
    .withIndex("by_slug", q => q.eq("slug", args.slug))
    .first();

  if (!project) {
    throw new Error("Project not found");
  }

  // Get owner info
  const owner = await ctx.db
    .query("users")
    .withIndex("by_username", q => q.eq("username", project.ownerSlug))
    .first();

  // Get project roles with role details
  const projectRoles = await ctx.db
    .query("projectRoles")
    .withIndex("by_projectSlug", q => q.eq("projectSlug", project.slug))
    .collect();

  const roles = await Promise.all(
    projectRoles.map(async (projectRole) => {
      const role = await ctx.db
        .query("userRoles")
        .withIndex("by_slug", q => q.eq("slug", projectRole.roleSlug))
        .first();

      // Get members for this role
      const roleMembers = await ctx.db
        .query("projectMembers")
        .withIndex("by_projectSlug", q => q.eq("projectSlug", project.slug))
        .filter(q => q.eq(q.field("roleSlug"), projectRole.roleSlug))
        .filter(q => q.neq(q.field("status"), "REMOVED"))
        .collect();

      // Get member details
      const members = await Promise.all(
        roleMembers.map(async (member) => {
          const user = await ctx.db
            .query("users")
            .withIndex("by_username", q => q.eq("username", member.userSlug))
            .first();

          return user ? {
            id: user._id,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            imageUrl: user.imageUrl,
            status: member.status || "ACTIVE",
            joinedAt: member.joinedAt,
          } : null;
        })
      );

      return {
        id: projectRole._id,
        projectSlug: projectRole.projectSlug,
        roleSlug: projectRole.roleSlug,
        maxMembers: projectRole.maxMembers,
        requirements: projectRole.requirements,
        role: role ? {
          id: role._id,
          name: role.name,
          slug: role.slug,
          description: role.description,
        } : null,
        members: members.filter(member => member !== null),
        currentMemberCount: members.filter(member => member !== null).length,
      };
    })
  );

  // Get all project members (for total count) - include REMOVED members so they can be reactivated
  const allMembers = await ctx.db
    .query("projectMembers")
    .withIndex("by_projectSlug", q => q.eq("projectSlug", project.slug))
    .collect();

  // Get member details
  const memberDetails = await Promise.all(
    allMembers.map(async (member) => {
      const user = await ctx.db
        .query("users")
        .withIndex("by_username", q => q.eq("username", member.userSlug))
        .first();

      const role = await ctx.db
        .query("userRoles")
        .withIndex("by_slug", q => q.eq("slug", member.roleSlug))
        .first();

      return user ? {
        id: user._id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        imageUrl: user.imageUrl,
        status: member.status || "ACTIVE",
        joinedAt: member.joinedAt,
        role: role ? {
          id: role._id,
          name: role.name,
          slug: role.slug,
        } : null,
      } : null;
    })
  );

  // Get project applications
  const applications = await ctx.db
    .query("projectApplications")
    .withIndex("by_projectSlug", q => q.eq("projectSlug", project.slug))
    .collect();

  const applicationDetails = await Promise.all(
    applications.map(async (application) => {
      const user = await ctx.db
        .query("users")
        .withIndex("by_username", q => q.eq("username", application.userSlug))
        .first();

      const role = await ctx.db
        .query("userRoles")
        .withIndex("by_slug", q => q.eq("slug", application.roleSlug))
        .first();

      return {
        id: application._id,
        projectSlug: application.projectSlug,
        userSlug: application.userSlug,
        roleSlug: application.roleSlug,
        message: application.message,
        status: application.status || "PENDING",
        appliedAt: application.appliedAt,
        reviewedAt: application.reviewedAt,
        reviewedBySlug: application.reviewedBySlug,
        reviewMessage: application.reviewMessage,
        user: user ? {
          id: user._id,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          imageUrl: user.imageUrl,
        } : null,
        role: role ? {
          id: role._id,
          name: role.name,
          slug: role.slug,
        } : null,
      };
    })
  );

  return {
    id: project._id,
    slug: project.slug,
    title: project.title,
    description: project.description,
    tags: project.tags || [],
    dueDate: project.dueDate,
    status: project.status || "OPEN",
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
    owner: owner ? {
      id: owner._id,
      username: owner.username,
      firstName: owner.firstName,
      lastName: owner.lastName,
      imageUrl: owner.imageUrl,
    } : null,
    roles,
    members: memberDetails.filter(member => member !== null),
    applications: applicationDetails,
  };
};
