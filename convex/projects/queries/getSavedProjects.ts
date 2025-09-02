import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";

import { QueryCtx } from "../../_generated/server";

export const getSavedProjectsArgs = {
  page: v.optional(v.number()),
  limit: v.optional(v.number()),
};

export const getSavedProjectsHandler = async (
  ctx: QueryCtx,
  args: {
    page?: number;
    limit?: number;
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

  const username = currentUser.username;
  const limit = args.limit || 10;
  const page = args.page || 1;
  const offset = (page - 1) * limit;

  // Get user's saved projects
  const savedEntries = await ctx.db
    .query("projectSaved")
    .withIndex("by_userSlug", q => q.eq("userSlug", username))
    .order("desc")
    .collect();

  // Apply pagination
  const total = savedEntries.length;
  const paginatedSavedEntries = savedEntries.slice(offset, offset + limit);

  // Get project details for each saved project
  const projects = await Promise.all(
    paginatedSavedEntries.map(async (savedEntry) => {
      const project = await ctx.db
        .query("projects")
        .withIndex("by_slug", q => q.eq("slug", savedEntry.projectSlug))
        .first();
      
      if (!project) return null;

      // Get member count
      const members = await ctx.db
        .query("projectMembers")
        .withIndex("by_projectSlug", q => q.eq("projectSlug", project.slug))
        .filter(q => q.neq(q.field("status"), "REMOVED"))
        .collect();

      // Get application count
      const applications = await ctx.db
        .query("projectApplications")
        .withIndex("by_projectSlug", q => q.eq("projectSlug", project.slug))
        .filter(q => q.eq(q.field("status"), "PENDING"))
        .collect();

      // Get owner info
      const owner = await ctx.db
        .query("users")
        .withIndex("by_username", q => q.eq("username", project.ownerSlug))
        .first();

      // Get project roles
      const projectRoles = await ctx.db
        .query("projectRoles")
        .withIndex("by_projectSlug", q => q.eq("projectSlug", project.slug))
        .collect();

      // Get role details for each project role
      const roles = await Promise.all(
        projectRoles.map(async (projectRole) => {
          const role = await ctx.db
            .query("userRoles")
            .withIndex("by_slug", q => q.eq("slug", projectRole.roleSlug))
            .first();
          
          return {
            ...projectRole,
            role: role ? {
              id: role._id,
              name: role.name,
              slug: role.slug,
              description: role.description,
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
        savedAt: savedEntry.savedAt,
        owner: owner ? {
          id: owner._id,
          username: owner.username,
          firstName: owner.firstName,
          lastName: owner.lastName,
          imageUrl: owner.imageUrl,
        } : null,
        roles,
        memberCount: members.length,
        applicationCount: applications.length,
      };
    })
  );

  // Filter out null projects (in case some saved projects were deleted)
  const validProjects = projects.filter(project => project !== null);

  const totalPages = Math.ceil(total / limit);

  return {
    data: validProjects,
    meta: {
      total,
      page,
      limit,
      totalPages,
    },
  };
};
