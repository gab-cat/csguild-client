"use node";

import { v } from "convex/values";
import formData from "form-data";
import Mailgun from "mailgun.js";

import { internal } from "../_generated/api";
import { Id } from "../_generated/dataModel";
import { internalAction } from "../_generated/server";

// Initialize Mailgun client
const getMailgunClient = () => {
  const mailgun = new Mailgun(formData);
  return mailgun.client({
    username: "api",
    key: process.env.MAILGUN_API_KEY!,
  });
};

// Email template for project application notifications
const createProjectApplicationNotificationTemplate = (
  ownerName: string,
  projectsData: Array<{
    projectTitle: string;
    applicationCount: number;
    applications: Array<{
      userSlug: string;
      roleSlug: string;
      message?: string;
      appliedAt?: number;
    }>;
  }>
) => {
  const totalApplications = projectsData.reduce((sum, project) => sum + project.applicationCount, 0);
  const baseUrl = process.env.SITE_URL || "http://localhost:3000";

  const projectListHtml = projectsData.map(project => `
    <div style="border: 1px solid #e0e0e0; border-radius: 8px; padding: 16px; margin: 12px 0; background: #f9f9f9;">
      <h3 style="margin: 0 0 8px 0; color: #333;">${project.projectTitle}</h3>
      <p style="margin: 0 0 12px 0; color: #666;"><strong>${project.applicationCount} new application${project.applicationCount > 1 ? 's' : ''}</strong></p>
      <div style="margin-left: 16px;">
        ${project.applications.map(app => `
          <div style="margin-bottom: 8px; padding: 8px; background: white; border-radius: 4px;">
            <strong>${app.userSlug}</strong> applied for <em>${app.roleSlug}</em>
            ${app.message ? `<br><span style="color: #666; font-size: 14px;">"${app.message}"</span>` : ''}
            ${app.appliedAt ? `<br><span style="color: #999; font-size: 12px;">Applied: ${new Date(app.appliedAt).toLocaleDateString()}</span>` : ''}
          </div>
        `).join('')}
      </div>
      <p style="margin: 12px 0 0 0;">
        <a href="${baseUrl}/projects/${project.projectTitle.toLowerCase().replace(/\s+/g, '-')}/applications"
           style="background: #667eea; color: white; padding: 8px 16px; text-decoration: none; border-radius: 4px; display: inline-block;">
          View Applications
        </a>
      </p>
    </div>
  `).join('');

  return {
    subject: `New Project Applications - ${totalApplications} pending review`,
    text: `Hi ${ownerName},

You have ${totalApplications} new project application${totalApplications > 1 ? 's' : ''} waiting for review:

${projectsData.map(project =>
  `${project.projectTitle}: ${project.applicationCount} application${project.applicationCount > 1 ? 's' : ''}`
).join('\n')}

Please log in to review these applications: ${baseUrl}/projects

Best regards,
CS Guild Team`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>New Project Applications - CS Guild</title>
</head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <h1 style="color: #667eea;">New Project Applications</h1>
  <p>Hi ${ownerName},</p>
  <p>You have <strong>${totalApplications}</strong> new project application${totalApplications > 1 ? 's' : ''} waiting for your review:</p>

  ${projectListHtml}

  <p style="margin-top: 24px;">
    <a href="${baseUrl}/projects" style="background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
      View All Projects
    </a>
  </p>

  <p style="margin-top: 24px; color: #666; font-size: 14px;">
    This is an automated notification. You received this because you are a project owner on CS Guild.
  </p>
</body>
</html>
    `
  };
};

// Action to send notification emails to project owners
export const sendProjectOwnerNotifications = internalAction({
  args: {
    notifications: v.array(v.object({
      ownerEmail: v.string(),
      ownerName: v.string(),
      projectsData: v.array(v.object({
        projectTitle: v.string(),
        applicationCount: v.number(),
        applications: v.array(v.object({
          userSlug: v.string(),
          roleSlug: v.string(),
          message: v.optional(v.string()),
          appliedAt: v.optional(v.number()),
        })),
      })),
    })),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const mailgun = getMailgunClient();

    for (const notification of args.notifications) {
      if (!notification.ownerEmail) continue;

      const emailTemplate = createProjectApplicationNotificationTemplate(
        notification.ownerName || "Project Owner",
        notification.projectsData
      );

      try {
        await mailgun.messages.create(process.env.MAILGUN_DOMAIN!, {
          from: `CS Guild <noreply@${process.env.MAILGUN_DOMAIN}>`,
          to: notification.ownerEmail,
          subject: emailTemplate.subject,
          text: emailTemplate.text,
          html: emailTemplate.html,
        });
        console.log(`Notification sent to ${notification.ownerEmail}`);
      } catch (error) {
        console.error(`Failed to send notification to ${notification.ownerEmail}:`, error);
      }
    }

    return null;
  },
});

// Main function that orchestrates the notification process
export const notifyProjectOwners = internalAction({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    // Get all unnotified applications
    // @ts-ignore
    const applications = await ctx.runQuery(internal.projects.notifications.getUnnotifiedApplications, {});

    if (applications.length === 0) {
      console.log("No unnotified applications found");
      return null;
    }

    // Group applications by owner
    const ownerNotifications = new Map<string, {
      ownerEmail: string;
      ownerName: string;
      projectsData: Array<{
        projectTitle: string;
        applicationCount: number;
        applications: Array<{
          userSlug: string;
          roleSlug: string;
          message?: string;
          appliedAt?: number;
        }>;
        applicationIds: Id<"projectApplications">[];
      }>;
    }>();

    for (const app of applications) {
      if (!app.ownerEmail) continue;

      const key = app.projectOwnerSlug;
      if (!ownerNotifications.has(key)) {
        ownerNotifications.set(key, {
          ownerEmail: app.ownerEmail,
          ownerName: app.ownerName || app.projectOwnerSlug,
          projectsData: [],
        });
      }

      const ownerData = ownerNotifications.get(key)!;
      let projectData = ownerData.projectsData.find(p => p.projectTitle === app.projectTitle);

      if (!projectData) {
        projectData = {
          projectTitle: app.projectTitle,
          applicationCount: 0,
          applications: [],
          applicationIds: [],
        };
        ownerData.projectsData.push(projectData);
      }

      projectData.applicationCount++;
      projectData.applications.push({
        userSlug: app.userSlug,
        roleSlug: app.roleSlug,
        message: app.message,
        appliedAt: app.appliedAt,
      });
      projectData.applicationIds.push(app._id as Id<"projectApplications">);
    }

    // Send notifications
    const notifications = Array.from(ownerNotifications.values()).map(owner => ({
      ownerEmail: owner.ownerEmail,
      ownerName: owner.ownerName,
      projectsData: owner.projectsData.map(project => ({
        projectTitle: project.projectTitle,
        applicationCount: project.applicationCount,
        applications: project.applications,
      })),
    }));

    await ctx.runAction(internal.projects.notifications.sendProjectOwnerNotifications, {
      notifications,
    });

    // Update notifiedOwnerAt for all processed applications
    const currentTime = Date.now();
    const allApplicationIds: Id<"projectApplications">[] = [];

    for (const ownerData of ownerNotifications.values()) {
      for (const projectData of ownerData.projectsData) {
        allApplicationIds.push(...projectData.applicationIds);
      }
    }

    if (allApplicationIds.length > 0) {
      await ctx.runMutation(internal.projects.notifications.updateNotifiedOwnerAt, {
        applicationIds: allApplicationIds,
        notifiedAt: currentTime,
      });
    }

    console.log(`Processed ${allApplicationIds.length} applications for ${ownerNotifications.size} project owners`);

    return null;
  },
});
