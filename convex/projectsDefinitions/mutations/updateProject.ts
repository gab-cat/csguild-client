import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";

import { MutationCtx } from "../../_generated/server";

export const updateProjectArgs = {
  slug: v.string(),
  title: v.optional(v.string()),
  description: v.optional(v.string()),
  tags: v.optional(v.array(v.string())),
  dueDate: v.optional(v.string()),
  isFeatured: v.optional(v.boolean()),
  roles: v.optional(v.array(v.object({
    roleSlug: v.string(),
    maxMembers: v.number(),
    requirements: v.optional(v.string()),
  }))),
};

export const updateProjectHandler = async (
  ctx: MutationCtx,
  args: {
    slug: string;
    title?: string;
    description?: string;
    tags?: string[];
    dueDate?: string;
    isFeatured?: boolean;
    roles?: Array<{
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

  // Get the project
  const project = await ctx.db
    .query("projects")
    .withIndex("by_slug", q => q.eq("slug", args.slug))
    .first();

  if (!project) {
    throw new Error("Project not found");
  }

  // Check if user is the owner
  if (project.ownerSlug !== currentUser.username) {
    throw new Error("Only project owners can update projects");
  }

  const now = Date.now();
  const updateData: {
    updatedAt: number,
    title?: string,
    slug?: string,
    description?: string,
    tags?: string[],
    dueDate?: number,
    isFeatured?: boolean,
  } = {
    updatedAt: now,
  };

  // Update title and generate new slug if title changed
  let newSlug = project.slug;
  if (args.title && args.title !== project.title) {
    newSlug = args.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    // Check if new slug already exists (and is different from current)
    if (newSlug !== project.slug) {
      const existingProject = await ctx.db
        .query("projects")
        .withIndex("by_slug", q => q.eq("slug", newSlug))
        .first();

      if (existingProject) {
        throw new Error("A project with this title already exists");
      }
    }

    updateData.title = args.title;
    updateData.slug = newSlug;
  }

  if (args.description !== undefined) {
    updateData.description = args.description;
  }

  if (args.tags !== undefined) {
    updateData.tags = args.tags;
  }

  if (args.dueDate !== undefined) {
    updateData.dueDate = new Date(args.dueDate).getTime();
  }

  if (args.isFeatured !== undefined) {
    updateData.isFeatured = args.isFeatured;
  }

  // Update the project
  await ctx.db.patch(project._id, updateData);

  // Update roles if provided
  if (args.roles !== undefined) {
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

    // If slug changed, update all related records
    if (newSlug !== project.slug) {
      // Update project roles
      const existingProjectRoles = await ctx.db
        .query("projectRoles")
        .withIndex("by_projectSlug", q => q.eq("projectSlug", project.slug))
        .collect();

      for (const projectRole of existingProjectRoles) {
        await ctx.db.patch(projectRole._id, {
          projectSlug: newSlug,
          updatedAt: now,
        });
      }

      // Update project members
      const existingMembers = await ctx.db
        .query("projectMembers")
        .withIndex("by_projectSlug", q => q.eq("projectSlug", project.slug))
        .collect();

      for (const member of existingMembers) {
        await ctx.db.patch(member._id, {
          projectSlug: newSlug,
          updatedAt: now,
        });
      }

      // Update project applications
      const existingApplications = await ctx.db
        .query("projectApplications")
        .withIndex("by_projectSlug", q => q.eq("projectSlug", project.slug))
        .collect();

      for (const application of existingApplications) {
        await ctx.db.patch(application._id, {
          projectSlug: newSlug,
          updatedAt: now,
        });
      }

      // Update saved projects
      const savedProjects = await ctx.db
        .query("projectSaved")
        .withIndex("by_userSlug_projectSlug", q => q.eq("userSlug", currentUser.username!).eq("projectSlug", project.slug))
        .collect();

      for (const savedProject of savedProjects) {
        await ctx.db.patch(savedProject._id, {
          projectSlug: newSlug,
        });
      }

      // Update pinned projects
      const pinnedProjects = await ctx.db
        .query("projectPinned")
        .withIndex("by_projectSlug", q => q.eq("projectSlug", project.slug))
        .collect();

      for (const pinnedProject of pinnedProjects) {
        await ctx.db.patch(pinnedProject._id, {
          projectSlug: newSlug,
        });
      }
    }

    // Remove existing project roles and create new ones
    const existingProjectRoles = await ctx.db
      .query("projectRoles")
      .withIndex("by_projectSlug", q => q.eq("projectSlug", newSlug))
      .collect();

    for (const projectRole of existingProjectRoles) {
      await ctx.db.delete(projectRole._id);
    }

    // Create new project roles
    for (const role of args.roles) {
      await ctx.db.insert("projectRoles", {
        projectSlug: newSlug,
        roleSlug: role.roleSlug,
        maxMembers: role.maxMembers,
        requirements: role.requirements,
        createdAt: now,
        updatedAt: now,
      });
    }
  }

  // Get the updated project with full details
  const updatedProject = await ctx.db
    .query("projects")
    .withIndex("by_slug", q => q.eq("slug", newSlug))
    .first();

  if (!updatedProject) {
    throw new Error("Failed to update project");
  }

  // Get project roles with role details
  const projectRoles = await ctx.db
    .query("projectRoles")
    .withIndex("by_projectSlug", q => q.eq("projectSlug", newSlug))
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
    id: updatedProject._id,
    slug: updatedProject.slug,
    title: updatedProject.title,
    description: updatedProject.description,
    tags: updatedProject.tags || [],
    dueDate: updatedProject.dueDate,
    status: updatedProject.status,
    isFeatured: updatedProject.isFeatured || false,
    ownerSlug: updatedProject.ownerSlug,
    owner: {
      id: currentUser._id,
      username: currentUser.username,
      firstName: currentUser.firstName,
      lastName: currentUser.lastName,
      imageUrl: currentUser.imageUrl,
    },
    roles: rolesWithDetails,
    createdAt: updatedProject.createdAt,
    updatedAt: updatedProject.updatedAt,
  };
};
