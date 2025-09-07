import { query, mutation } from "./_generated/server";
import {
  // Mutation handlers and args
  createProjectHandler,
  createProjectArgs,
  updateProjectHandler,
  updateProjectArgs,
  joinProjectHandler,
  joinProjectArgs,
  reviewApplicationHandler,
  reviewApplicationArgs,
  saveProjectHandler,
  saveProjectArgs,
  unsaveProjectHandler,
  unsaveProjectArgs,
  removeProjectMemberHandler,
  removeProjectMemberArgs,
  reactivateProjectMemberHandler,
  reactivateProjectMemberArgs,
  createRoleHandler,
  createRoleArgs,
} from "./projectsDefinitions/mutations";
import {
  // Query handlers and args
  getProjectsHandler,
  getProjectsArgs,
  getPinnedProjectsHandler,
  getPinnedProjectsArgs,
  getSavedProjectsHandler,
  getSavedProjectsArgs,
  getProjectBySlugHandler,
  getProjectBySlugArgs,
  getMyProjectsHandler,
  getMyProjectsArgs,
  getMyApplicationsHandler,
  getMyApplicationsArgs,
  getRolesHandler,
  getRolesArgs,
  getRoleBySlugHandler,
  getRoleBySlugArgs,
} from "./projectsDefinitions/queries";

// QUERIES

export const getProjects = query({
  args: getProjectsArgs,
  handler: getProjectsHandler,
});

export const getPinnedProjects = query({
  args: getPinnedProjectsArgs,
  handler: getPinnedProjectsHandler,
});

export const getSavedProjects = query({
  args: getSavedProjectsArgs,
  handler: getSavedProjectsHandler,
});

export const getProjectBySlug = query({
  args: getProjectBySlugArgs,
  handler: getProjectBySlugHandler,
});

export const getMyProjects = query({
  args: getMyProjectsArgs,
  handler: getMyProjectsHandler,
});

export const getMyApplications = query({
  args: getMyApplicationsArgs,
  handler: getMyApplicationsHandler,
});

export const getRoles = query({
  args: getRolesArgs,
  handler: getRolesHandler,
});

export const getRoleBySlug = query({
  args: getRoleBySlugArgs,
  handler: getRoleBySlugHandler,
});

// MUTATIONS

export const createProject = mutation({
  args: createProjectArgs,
  handler: createProjectHandler,
});

export const updateProject = mutation({
  args: updateProjectArgs,
  handler: updateProjectHandler,
});

export const joinProject = mutation({
  args: joinProjectArgs,
  handler: joinProjectHandler,
});

export const reviewApplication = mutation({
  args: reviewApplicationArgs,
  handler: reviewApplicationHandler,
});

export const saveProject = mutation({
  args: saveProjectArgs,
  handler: saveProjectHandler,
});

export const unsaveProject = mutation({
  args: unsaveProjectArgs,
  handler: unsaveProjectHandler,
});

export const removeProjectMember = mutation({
  args: removeProjectMemberArgs,
  handler: removeProjectMemberHandler,
});

export const reactivateProjectMember = mutation({
  args: reactivateProjectMemberArgs,
  handler: reactivateProjectMemberHandler,
});

export const createRole = mutation({
  args: createRoleArgs,
  handler: createRoleHandler,
});