import { v } from "convex/values";

import { QueryCtx } from "../../_generated/server";

export const getFeaturedProjectsArgs = {
  limit: v.optional(v.number()),
  page: v.optional(v.number()),
};

export const getFeaturedProjectsHandler = async (
  ctx: QueryCtx,
  args: {
    limit?: number;
    page?: number;
  }
) => {
  const limit = args.limit || 10;
  const page = args.page || 1;
  const offset = (page - 1) * limit;

  // Get featured projects
  const featuredProjects = await ctx.db
    .query("projects")
    .withIndex("by_isFeatured", q => q.eq("isFeatured", true))
    .order("desc")
    .collect();

  // Apply pagination
  const total = featuredProjects.length;
  const paginatedProjects = featuredProjects.slice(offset, offset + limit);

  // Get enriched data for each project
  const enrichedProjects = await Promise.all(
    paginatedProjects.map(async (project) => {
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

      // Get role details and enrich with member count info
      const enrichedRoles = await Promise.all(
        projectRoles.map(async (projectRole) => {
          const role = await ctx.db
            .query("userRoles")
            .withIndex("by_slug", q => q.eq("slug", projectRole.roleSlug))
            .first();

          return {
            id: projectRole._id,
            projectSlug: projectRole.projectSlug,
            roleSlug: projectRole.roleSlug,
            role: role ? {
              id: role._id,
              name: role.name,
              slug: role.slug,
              description: role.description,
            } : null,
            maxMembers: projectRole.maxMembers,
            requirements: projectRole.requirements,
            createdAt: projectRole.createdAt,
            updatedAt: projectRole.updatedAt,
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
        isFeatured: project.isFeatured || false,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
        owner: owner ? {
          id: owner._id,
          username: owner.username,
          firstName: owner.firstName,
          lastName: owner.lastName,
          imageUrl: owner.imageUrl,
        } : null,
        memberCount: members.length,
        applicationCount: applications.length,
        roles: enrichedRoles,
      };
    })
  );

  const totalPages = Math.ceil(total / limit);

  return {
    data: enrichedProjects,
    meta: {
      total,
      page,
      limit,
      totalPages,
    },
  };
};
