import { v } from "convex/values";
import { internalQuery } from "../_generated/server";

// Query to get applications that haven't been notified yet (notifiedOwnerAt is null)
export const getUnnotifiedApplications = internalQuery({
  args: {},
  returns: v.array(v.object({
    _id: v.id("projectApplications"),
    projectSlug: v.string(),
    userSlug: v.string(),
    roleSlug: v.string(),
    message: v.optional(v.string()),
    status: v.optional(v.union(v.literal("PENDING"), v.literal("APPROVED"), v.literal("REJECTED"))),
    appliedAt: v.optional(v.number()),
    projectTitle: v.string(),
    projectOwnerSlug: v.string(),
    ownerEmail: v.optional(v.string()),
    ownerName: v.optional(v.string()),
  })),
  handler: async (ctx) => {
    // Get all applications where notifiedOwnerAt is null
    const applications = await ctx.db
      .query("projectApplications")
      .withIndex("by_notifiedOwnerAt", (q) => q.eq("notifiedOwnerAt", undefined))
      .collect();

    // Get project details and owner info for each application
    const applicationsWithDetails = await Promise.all(
      applications.map(async (app) => {
        const project = await ctx.db
          .query("projects")
          .withIndex("by_slug", (q) => q.eq("slug", app.projectSlug))
          .unique();

        if (!project) {
          return null;
        }

        const owner = await ctx.db
          .query("users")
          .withIndex("by_username", (q) => q.eq("username", project.ownerSlug))
          .unique();

        return {
          _id: app._id,
          projectSlug: app.projectSlug,
          userSlug: app.userSlug,
          roleSlug: app.roleSlug,
          message: app.message,
          status: app.status,
          appliedAt: app.appliedAt,
          projectTitle: project.title,
          projectOwnerSlug: project.ownerSlug,
          ownerEmail: owner?.email,
          ownerName: owner?.name || owner?.username,
        };
      })
    );

    // Filter out null values (projects that don't exist)
    return applicationsWithDetails.filter(app => app !== null);
  },
});
