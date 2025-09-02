import { QueryCtx } from "../../_generated/server";

export const getPinnedProjectsArgs = {};

export const getPinnedProjectsHandler = async (ctx: QueryCtx) => {
  // Get pinned projects ordered by their pin order
  const pinnedEntries = await ctx.db
    .query("projectPinned")
    .withIndex("by_order")
    .collect();

  const projects = await Promise.all(
    pinnedEntries.map(async (pinnedEntry) => {
      const project = await ctx.db
        .query("projects")
        .withIndex("by_slug", q => q.eq("slug", pinnedEntry.projectSlug))
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

  // Filter out null projects (in case some pinned projects were deleted)
  const validProjects = projects.filter(project => project !== null);

  return {
    data: validProjects,
    meta: {
      total: validProjects.length,
      page: 1,
      limit: validProjects.length,
      totalPages: 1,
    },
  };
};
