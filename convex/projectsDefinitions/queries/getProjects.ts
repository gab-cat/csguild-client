import { v } from "convex/values";

import { QueryCtx } from "../../_generated/server";

export const getProjectsArgs = {
  status: v.optional(v.union(v.literal("OPEN"), v.literal("IN_PROGRESS"), v.literal("COMPLETED"), v.literal("CANCELLED"))),
  tags: v.optional(v.string()),
  search: v.optional(v.string()),
  ownerSlug: v.optional(v.string()),
  page: v.optional(v.number()),
  limit: v.optional(v.number()),
  sortBy: v.optional(v.union(v.literal("createdAt"), v.literal("updatedAt"), v.literal("dueDate"), v.literal("title"))),
  sortOrder: v.optional(v.union(v.literal("asc"), v.literal("desc"))),
  pinned: v.optional(v.boolean()),
};

export const getProjectsHandler = async (
  ctx: QueryCtx,
  args: {
    status?: "OPEN" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
    tags?: string;
    search?: string;
    ownerSlug?: string;
    page?: number;
    limit?: number;
    sortBy?: "createdAt" | "updatedAt" | "dueDate" | "title";
    sortOrder?: "asc" | "desc";
    pinned?: boolean;
  }
) => {
  const limit = args.limit || 10;
  const page = args.page || 1;
  const offset = (page - 1) * limit;

  // Apply filters and get projects
  let projects;
  if (args.status) {
    projects = await ctx.db
      .query("projects")
      .withIndex("by_status", q => q.eq("status", args.status))
      .collect();
  } else if (args.ownerSlug) {
    projects = await ctx.db
      .query("projects")
      .withIndex("by_ownerSlug", q => q.eq("ownerSlug", args.ownerSlug!))
      .collect();
  } else {
    // Use fullTableScan when no specific index is needed
    projects = await ctx.db
      .query("projects")
      .order("desc")
      .collect();
  }

  // Apply search filter
  if (args.search) {
    const searchLower = args.search.toLowerCase();
    projects = projects.filter(project => 
      project.title.toLowerCase().includes(searchLower) ||
      project.description.toLowerCase().includes(searchLower) ||
      (project.tags && project.tags.some(tag => tag.toLowerCase().includes(searchLower)))
    );
  }

  // Apply tags filter
  if (args.tags) {
    const filterTags = args.tags.split(',').map(tag => tag.trim().toLowerCase());
    projects = projects.filter(project => 
      project.tags && project.tags.some(tag => 
        filterTags.some(filterTag => tag.toLowerCase().includes(filterTag))
      )
    );
  }

  // Apply pinned filter
  if (args.pinned !== undefined) {
    if (args.pinned) {
      const pinnedProjects = await ctx.db.query("projectPinned").collect();
      const pinnedSlugs = new Set(pinnedProjects.map(p => p.projectSlug));
      projects = projects.filter(project => pinnedSlugs.has(project.slug));
    } else {
      const pinnedProjects = await ctx.db.query("projectPinned").collect();
      const pinnedSlugs = new Set(pinnedProjects.map(p => p.projectSlug));
      projects = projects.filter(project => !pinnedSlugs.has(project.slug));
    }
  }

  // Sort projects
  const sortBy = args.sortBy || "createdAt";
  const sortOrder = args.sortOrder || "desc";
  
  projects.sort((a, b) => {
    let aValue: string | number | undefined = a[sortBy];
    let bValue: string | number | undefined = b[sortBy];
    
    if (sortBy === "title") {
      aValue = typeof aValue === 'string' ? aValue.toLowerCase() : String(aValue || "");
      bValue = typeof bValue === 'string' ? bValue.toLowerCase() : String(bValue || "");
    }
    
    if (aValue === undefined) aValue = 0;
    if (bValue === undefined) bValue = 0;
    
    if (sortOrder === "asc") {
      return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
    } else {
      return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
    }
  });

  // Apply pagination
  const total = projects.length;
  const paginatedProjects = projects.slice(offset, offset + limit);

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
