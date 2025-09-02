import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";

import { MutationCtx } from "../../_generated/server";

export const joinProjectArgs = {
  projectSlug: v.string(),
  roleSlug: v.string(),
  message: v.string(),
};

export const joinProjectHandler = async (
  ctx: MutationCtx,
  args: {
    projectSlug: string;
    roleSlug: string;
    message: string;
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
    .withIndex("by_slug", q => q.eq("slug", args.projectSlug))
    .first();

  if (!project) {
    throw new Error("Project not found");
  }

  // Check if project is still open for applications
  if (project.status !== "OPEN") {
    throw new Error("Project is not accepting applications");
  }

  // Check if role exists in this project
  const projectRole = await ctx.db
    .query("projectRoles")
    .withIndex("by_projectSlug_roleSlug", q => 
      q.eq("projectSlug", args.projectSlug).eq("roleSlug", args.roleSlug)
    )
    .first();

  if (!projectRole) {
    throw new Error("Role not found in this project");
  }

  // Check if user is the project owner
  if (project.ownerSlug === currentUser.username) {
    throw new Error("Project owners cannot apply to their own projects");
  }

  // Check if user already has an existing application for this project and role
  const existingApplication = await ctx.db
    .query("projectApplications")
    .withIndex("by_projectSlug_userSlug_roleSlug", q =>
      q.eq("projectSlug", args.projectSlug)
        .eq("userSlug", currentUser.username!)
        .eq("roleSlug", args.roleSlug)
    )
    .first();

  if (existingApplication) {
    throw new Error("You have already applied for this role in this project");
  }

  // Check if user is already a member of this project
  const existingMembership = await ctx.db
    .query("projectMembers")
    .withIndex("by_projectSlug_userSlug_roleSlug", q =>
      q.eq("projectSlug", args.projectSlug)
        .eq("userSlug", currentUser.username!)
        .eq("roleSlug", args.roleSlug)
    )
    .filter(q => q.neq(q.field("status"), "REMOVED"))
    .first();

  if (existingMembership) {
    throw new Error("You are already a member of this project in this role");
  }

  // Check if role has reached maximum members
  const currentMembers = await ctx.db
    .query("projectMembers")
    .withIndex("by_projectSlug", q => q.eq("projectSlug", args.projectSlug))
    .filter(q => q.eq(q.field("roleSlug"), args.roleSlug))
    .filter(q => q.neq(q.field("status"), "REMOVED"))
    .collect();

  if (projectRole.maxMembers && currentMembers.length >= projectRole.maxMembers) {
    throw new Error("This role has reached its maximum number of members");
  }

  const now = Date.now();

  // Create the application
  const applicationId = await ctx.db.insert("projectApplications", {
    projectSlug: args.projectSlug,
    userSlug: currentUser.username,
    roleSlug: args.roleSlug,
    message: args.message,
    status: "PENDING",
    appliedAt: now,
    createdAt: now,
    updatedAt: now,
  });

  // Get the created application with full details
  const application = await ctx.db.get(applicationId);
  if (!application) {
    throw new Error("Failed to create application");
  }

  // Get role details
  const role = await ctx.db
    .query("userRoles")
    .withIndex("by_slug", q => q.eq("slug", args.roleSlug))
    .first();

  // Get project owner details
  const owner = await ctx.db
    .query("users")
    .withIndex("by_username", q => q.eq("username", project.ownerSlug))
    .first();

  return {
    id: application._id,
    projectSlug: application.projectSlug,
    userSlug: application.userSlug,
    roleSlug: application.roleSlug,
    message: application.message,
    status: application.status,
    appliedAt: application.appliedAt,
    project: {
      id: project._id,
      slug: project.slug,
      title: project.title,
      description: project.description,
      status: project.status,
      dueDate: project.dueDate,
      owner: owner ? {
        id: owner._id,
        username: owner.username,
        firstName: owner.firstName,
        lastName: owner.lastName,
        imageUrl: owner.imageUrl,
      } : null,
    },
    role: role ? {
      id: role._id,
      name: role.name,
      slug: role.slug,
      description: role.description,
    } : null,
    user: {
      id: currentUser._id,
      username: currentUser.username,
      firstName: currentUser.firstName,
      lastName: currentUser.lastName,
      imageUrl: currentUser.imageUrl,
    },
  };
};
