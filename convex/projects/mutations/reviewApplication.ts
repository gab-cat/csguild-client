import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";

import { Id } from "@convex/_generated/dataModel";

import { internal } from "../../_generated/api";
import { MutationCtx } from "../../_generated/server";

export const reviewApplicationArgs = {
  applicationId: v.id("projectApplications"),
  decision: v.union(v.literal("APPROVED"), v.literal("REJECTED")),
  reviewMessage: v.optional(v.string()),
};

export const reviewApplicationHandler = async (
  ctx: MutationCtx,
  args: {
    applicationId: Id<"projectApplications">
    decision: "APPROVED" | "REJECTED";
    reviewMessage?: string;
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

  // Get the application
  const application = await ctx.db.get(args.applicationId);
  if (!application) {
    throw new Error("Application not found");
  }

  // Check if application is still pending
  if (application.status !== "PENDING") {
    throw new Error("Application has already been reviewed");
  }

  // Get the project
  const project = await ctx.db
    .query("projects")
    .withIndex("by_slug", q => q.eq("slug", application.projectSlug))
    .first();

  if (!project) {
    throw new Error("Project not found");
  }

  // Check if user is the project owner
  if (project.ownerSlug !== currentUser.username) {
    throw new Error("Only project owners can review applications");
  }

  const now = Date.now();

  // Update the application
  await ctx.db.patch(application._id, {
    status: args.decision,
    reviewedAt: now,
    reviewedBySlug: currentUser.username,
    reviewMessage: args.reviewMessage,
    updatedAt: now,
  });

  // If approved, add user as project member
  if (args.decision === "APPROVED") {
    // Check if role has reached maximum members
    const projectRole = await ctx.db
      .query("projectRoles")
      .withIndex("by_projectSlug_roleSlug", q =>
        q.eq("projectSlug", application.projectSlug).eq("roleSlug", application.roleSlug)
      )
      .first();

    if (projectRole?.maxMembers) {
      const currentMembers = await ctx.db
        .query("projectMembers")
        .withIndex("by_projectSlug", q => q.eq("projectSlug", application.projectSlug))
        .filter(q => q.eq(q.field("roleSlug"), application.roleSlug))
        .filter(q => q.neq(q.field("status"), "REMOVED"))
        .collect();

      if (currentMembers.length >= projectRole.maxMembers) {
        throw new Error("This role has reached its maximum number of members");
      }
    }

    // Check if user already exists as member (in case of reactivation)
    const existingMember = await ctx.db
      .query("projectMembers")
      .withIndex("by_projectSlug_userSlug_roleSlug", q =>
        q.eq("projectSlug", application.projectSlug)
          .eq("userSlug", application.userSlug)
          .eq("roleSlug", application.roleSlug)
      )
      .first();

    if (existingMember) {
      // Reactivate existing member
      await ctx.db.patch(existingMember._id, {
        status: "ACTIVE",
        joinedAt: now,
        updatedAt: now,
      });
    } else {
      // Create new project member
      await ctx.db.insert("projectMembers", {
        projectSlug: application.projectSlug,
        userSlug: application.userSlug,
        roleSlug: application.roleSlug,
        status: "ACTIVE",
        joinedAt: now,
        createdAt: now,
        updatedAt: now,
      });
    }
  }

  // Get the updated application with full details
  const updatedApplication = await ctx.db.get(application._id);
  if (!updatedApplication) {
    throw new Error("Failed to update application");
  }

  // Get applicant details
  const applicant = await ctx.db
    .query("users")
    .withIndex("by_username", q => q.eq("username", application.userSlug))
    .first();

  // Get role details
  const role = await ctx.db
    .query("userRoles")
    .withIndex("by_slug", q => q.eq("slug", application.roleSlug))
    .first();

  // Get project owner details
  const owner = await ctx.db
    .query("users")
    .withIndex("by_username", q => q.eq("username", project.ownerSlug))
    .first();

  // Send email notification to applicant
  if (applicant && applicant.email) {
    try {
      const applicantName = `${applicant.firstName || ''} ${applicant.lastName || ''}`.trim() || applicant.username || 'Applicant';
      const reviewerName = `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim() || currentUser.username;

      const emailArgs = {
        email: applicant.email as string,
        applicantName: applicantName as string,
        projectTitle: project.title,
        roleName: role?.name || application.roleSlug,
        reviewerName,
        reviewMessage: args.reviewMessage,
      };

      if (args.decision === "APPROVED") {
        // @ts-ignore
        await ctx.scheduler.runAfter(0, internal.email.sendApplicationAcceptance, emailArgs);
      } else {
        await ctx.scheduler.runAfter(0, internal.email.sendApplicationRejection, emailArgs);
      }
    } catch (emailError) {
      console.error("Failed to send application review email:", emailError);
      // Don't fail the mutation if email fails - just log it
    }
  }

  return {
    id: updatedApplication._id,
    projectSlug: updatedApplication.projectSlug,
    userSlug: updatedApplication.userSlug,
    roleSlug: updatedApplication.roleSlug,
    message: updatedApplication.message,
    status: updatedApplication.status,
    appliedAt: updatedApplication.appliedAt,
    reviewedAt: updatedApplication.reviewedAt,
    reviewedBySlug: updatedApplication.reviewedBySlug,
    reviewMessage: updatedApplication.reviewMessage,
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
    applicant: applicant ? {
      id: applicant._id,
      username: applicant.username,
      firstName: applicant.firstName,
      lastName: applicant.lastName,
      imageUrl: applicant.imageUrl,
    } : null,
    reviewer: {
      id: currentUser._id,
      username: currentUser.username,
      firstName: currentUser.firstName,
      lastName: currentUser.lastName,
      imageUrl: currentUser.imageUrl,
    },
  };
};
