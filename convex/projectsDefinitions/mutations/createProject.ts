import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";

import { MutationCtx } from "../../_generated/server";

export const createProjectArgs = {
  title: v.string(),
  description: v.string(),
  tags: v.array(v.string()),
  dueDate: v.string(),
  roles: v.array(v.object({
    roleSlug: v.string(),
    maxMembers: v.number(),
    requirements: v.optional(v.string()),
  })),
};

export const createProjectHandler = async (
  ctx: MutationCtx,
  args: {
    title: string;
    description: string;
    tags: string[];
    dueDate: string;
    roles: Array<{
      roleSlug: string;
      maxMembers: number;
      requirements?: string;
    }>;
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

  const now = Date.now();
  const dueDateTimestamp = new Date(args.dueDate).getTime();

  // Generate slug from title
  const slug = args.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  // Check if slug already exists
  const existingProject = await ctx.db
    .query("projects")
    .withIndex("by_slug", q => q.eq("slug", slug))
    .first();

  if (existingProject) {
    throw new Error("A project with this title already exists");
  }

  // Validate that all roles exist
  for (const role of args.roles) {
    const existingRole = await ctx.db
      .query("userRoles")
      .withIndex("by_slug", q => q.eq("slug", role.roleSlug))
      .first();
    
    if (!existingRole) {
      throw new Error(`Role "${role.roleSlug}" not found`);
    }
  }

  // Create the project
  const projectId = await ctx.db.insert("projects", {
    title: args.title,
    slug,
    description: args.description,
    tags: args.tags,
    dueDate: dueDateTimestamp,
    status: "OPEN",
    ownerSlug: currentUser.username,
    createdAt: now,
    updatedAt: now,
  });

  // Create project roles
  for (const role of args.roles) {
    await ctx.db.insert("projectRoles", {
      projectSlug: slug,
      roleSlug: role.roleSlug,
      maxMembers: role.maxMembers,
      requirements: role.requirements,
      createdAt: now,
      updatedAt: now,
    });
  }

  // Get the created project with full details
  const project = await ctx.db.get(projectId);
  if (!project) {
    throw new Error("Failed to create project");
  }

  // Get project roles with role details
  const projectRoles = await ctx.db
    .query("projectRoles")
    .withIndex("by_projectSlug", q => q.eq("projectSlug", slug))
    .collect();

  const rolesWithDetails = await Promise.all(
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
    status: project.status,
    ownerSlug: project.ownerSlug,
    owner: {
      id: currentUser._id,
      username: currentUser.username,
      firstName: currentUser.firstName,
      lastName: currentUser.lastName,
      imageUrl: currentUser.imageUrl,
    },
    roles: rolesWithDetails,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
  };
};
