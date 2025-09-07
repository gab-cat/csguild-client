import { getAuthUserId } from "@convex-dev/auth/server";

import { QueryCtx } from "../../_generated/server";

export const getMyProjectsArgs = {};

export const getMyProjectsHandler = async (ctx: QueryCtx) => {
  const userId = await getAuthUserId(ctx);
  if (!userId) {
    throw new Error("Authentication required");
  }

  const currentUser = await ctx.db.get(userId);
  if (!currentUser?.username) {
    throw new Error("User not found");
  }

  // Get projects owned by current user
  const ownedProjects = await ctx.db
    .query("projects")
    .withIndex("by_ownerSlug", q => q.eq("ownerSlug", currentUser.username!))
    .collect();

  // Get projects where user is a member
  const memberProjects = await ctx.db
    .query("projectMembers")
    .withIndex("by_userSlug", q => q.eq("userSlug", currentUser.username!))
    .filter(q => q.neq(q.field("status"), "REMOVED"))
    .collect();

  const memberProjectSlugs = memberProjects.map(mp => mp.projectSlug);

  // Combine owned and member projects, avoiding duplicates
  const allProjectSlugs = new Set([
    ...ownedProjects.map(p => p.slug),
    ...memberProjectSlugs
  ]);

  const allProjects = await Promise.all(
    Array.from(allProjectSlugs).map(async (slug) => {
      const project = await ctx.db
        .query("projects")
        .withIndex("by_slug", q => q.eq("slug", slug))
        .first();
      
      if (!project) return null;

      // Check if user is owner
      const isOwner = project.ownerSlug === currentUser.username!;

      // Get user's role in this project
      const userMembership = await ctx.db
        .query("projectMembers")
        .withIndex("by_projectSlug", q => q.eq("projectSlug", project.slug))
        .filter(q => q.eq(q.field("userSlug"), currentUser.username!))
        .filter(q => q.neq(q.field("status"), "REMOVED"))
        .first();

      let userRole = null;
      if (userMembership) {
        const role = await ctx.db
          .query("userRoles")
          .withIndex("by_slug", q => q.eq("slug", userMembership.roleSlug))
          .first();
        
        if (role) {
          userRole = {
            id: role._id,
            name: role.name,
            slug: role.slug,
            joinedAt: userMembership.joinedAt,
            status: userMembership.status,
          };
        }
      }

      // Get total member count
      const members = await ctx.db
        .query("projectMembers")
        .withIndex("by_projectSlug", q => q.eq("projectSlug", project.slug))
        .filter(q => q.neq(q.field("status"), "REMOVED"))
        .collect();

      // Get all applications count
      const allApplications = await ctx.db
        .query("projectApplications")
        .withIndex("by_projectSlug", q => q.eq("projectSlug", project.slug))
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

      const roles = await Promise.all(
        projectRoles.map(async (projectRole) => {
          const role = await ctx.db
            .query("userRoles")
            .withIndex("by_slug", q => q.eq("slug", projectRole.roleSlug))
            .first();
          
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
        isOwner,
        userRole,
        owner: owner ? {
          id: owner._id,
          username: owner.username,
          firstName: owner.firstName,
          lastName: owner.lastName,
          imageUrl: owner.imageUrl,
        } : null,
        roles,
        memberCount: members.length,
        applicationCount: allApplications.length,
      };
    })
  );

  const validProjects = allProjects.filter(project => project !== null);

  // Sort by most recently updated first
  validProjects.sort((a, b) => (b!.updatedAt || 0) - (a!.updatedAt || 0));

  return {
    owned: validProjects.filter(p => p!.isOwner),
    member: validProjects.filter(p => !p!.isOwner),
    all: validProjects,
  };
};
