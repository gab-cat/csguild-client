import { getAuthUserId } from "@convex-dev/auth/server";

import { QueryCtx } from "../../_generated/server";

export const getMyApplicationsArgs = {};

export const getMyApplicationsHandler = async (ctx: QueryCtx) => {
  const userId = await getAuthUserId(ctx);
  if (!userId) {
    throw new Error("Authentication required");
  }

  const currentUser = await ctx.db.get(userId);
  if (!currentUser?.username) {
    throw new Error("User not found");
  }

  // Get all applications by current user
  const applications = await ctx.db
    .query("projectApplications")
    .withIndex("by_userSlug", q => q.eq("userSlug", currentUser.username!))
    .order("desc")
    .collect();

  // Get detailed information for each application
  const detailedApplications = await Promise.all(
    applications.map(async (application) => {
      // Get project details
      const project = await ctx.db
        .query("projects")
        .withIndex("by_slug", q => q.eq("slug", application.projectSlug))
        .first();

      // Get role details
      const role = await ctx.db
        .query("userRoles")
        .withIndex("by_slug", q => q.eq("slug", application.roleSlug))
        .first();

      // Get project owner details
      let projectOwner = null;
      if (project) {
        projectOwner = await ctx.db
          .query("users")
          .withIndex("by_username", q => q.eq("username", project.ownerSlug))
          .first();
      }

      // Get reviewer details if reviewed
      let reviewer = null;
      if (application.reviewedBySlug) {
        reviewer = await ctx.db
          .query("users")
          .withIndex("by_username", q => q.eq("username", application.reviewedBySlug))
          .first();
      }

      // Get member status for approved applications
      let projectMember = null;
      if (application.status === "APPROVED") {
        projectMember = await ctx.db
          .query("projectMembers")
          .withIndex("by_projectSlug_userSlug_roleSlug", q =>
            q.eq("projectSlug", application.projectSlug)
             .eq("userSlug", application.userSlug)
             .eq("roleSlug", application.roleSlug)
          )
          .first();
      }

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
        project: project ? {
          id: project._id,
          slug: project.slug,
          title: project.title,
          description: project.description,
          status: project.status || "OPEN",
          dueDate: project.dueDate,
          owner: projectOwner ? {
            id: projectOwner._id,
            username: projectOwner.username,
            firstName: projectOwner.firstName,
            lastName: projectOwner.lastName,
            imageUrl: projectOwner.imageUrl,
          } : null,
        } : null,
        projectRole: {
          id: `${application.projectSlug}-${application.roleSlug}`,
          role: role ? {
            id: role._id,
            name: role.name,
            slug: role.slug,
            description: role.description,
          } : null,
        },
        projectMember: projectMember ? {
          id: projectMember._id,
          status: projectMember.status || "ACTIVE",
          joinedAt: projectMember.joinedAt,
        } : null,
        reviewer: reviewer ? {
          id: reviewer._id,
          username: reviewer.username,
          firstName: reviewer.firstName,
          lastName: reviewer.lastName,
          imageUrl: reviewer.imageUrl,
        } : null,
      };
    })
  );

  // Filter out applications for deleted projects
  const validApplications = detailedApplications.filter(app => app.project !== null);

  // Group by status
  const pending = validApplications.filter(app => app.status === "PENDING");
  const approved = validApplications.filter(app => app.status === "APPROVED");
  const rejected = validApplications.filter(app => app.status === "REJECTED");

  return {
    pending,
    approved,
    rejected,
    all: validApplications,
  };
};
