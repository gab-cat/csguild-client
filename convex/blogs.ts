import { query, mutation } from "./_generated/server";
import {
  archiveBlogHandler,
  archiveBlogArgs,
  createBlogHandler,
  createBlogArgs,
  updateBlogHandler,
  updateBlogArgs,
  deleteBlogHandler,
  deleteBlogArgs,
  generateBlogCoverUploadUrlHandler,
  generateBlogCoverUploadUrlArgs,
  saveBlogCoverImageHandler,
  saveBlogCoverImageArgs,
  likeBlogHandler,
  likeBlogArgs,
  unlikeBlogHandler,
  unlikeBlogArgs,
  bookmarkBlogHandler,
  bookmarkBlogArgs,
  unbookmarkBlogHandler,
  unbookmarkBlogArgs,
  shareBlogHandler,
  shareBlogArgs,
  flagBlogHandler,
  flagBlogArgs,
  reviewFlagHandler,
  reviewFlagArgs,
  publishBlogHandler,
  publishBlogArgs,
  unpublishBlogHandler,
  unpublishBlogArgs,
  pinBlogHandler,
  pinBlogArgs,
  featureBlogHandler,
  featureBlogArgs,
  moderateBlogHandler,
  moderateBlogArgs,
  createCommentHandler,
  createCommentArgs,
  likeCommentHandler,
  likeCommentArgs,
  deleteCommentHandler,
  deleteCommentArgs,
  flagCommentHandler,
  flagCommentArgs,
  viewBlogHandler,
  viewBlogArgs,
} from "./blogsDefinitions/mutations";
// Query handlers and args
import {
  getBlogsHandler,
  getBlogsArgs,
  getBlogBySlugHandler,
  getBlogBySlugArgs,
  getRelatedBlogsHandler,
  getRelatedBlogsArgs,
  getCommentsForBlogHandler,
  getCommentsForBlogArgs,
  getCommentRepliesHandler,
  getCommentRepliesArgs,
  getBlogStatsHandler,
  getBlogStatsArgs,
  getBlogOverallStatsHandler,
  getBlogOverallStatsArgs,
  getBlogFlagsHandler,
  getBlogFlagsArgs,
  getCategoriesHandler,
  getCategoriesArgs,
  getTagsHandler,
  getTagsArgs,
  getFeaturedBlogsHandler,
  getFeaturedBlogsArgs,
  getPinnedBlogsHandler,
  getPinnedBlogsArgs,
  getMyBlogsHandler,
  getMyBlogsArgs,
  getUserBlogInteractionHandler,
  getUserBlogInteractionArgs,
} from "./blogsDefinitions/queries";

// QUERIES

export const getBlogs = query({
  args: getBlogsArgs,
  handler: getBlogsHandler,
});

export const getBlogBySlug = query({
  args: getBlogBySlugArgs,
  handler: getBlogBySlugHandler,
});

export const getRelatedBlogs = query({
  args: getRelatedBlogsArgs,
  handler: getRelatedBlogsHandler,
});

export const getCommentsForBlog = query({
  args: getCommentsForBlogArgs,
  handler: getCommentsForBlogHandler,
});

export const getCommentReplies = query({
  args: getCommentRepliesArgs,
  handler: getCommentRepliesHandler,
});

export const getBlogStats = query({
  args: getBlogStatsArgs,
  handler: getBlogStatsHandler,
});

export const getBlogOverallStats = query({
  args: getBlogOverallStatsArgs,
  handler: getBlogOverallStatsHandler,
});

export const getBlogFlags = query({
  args: getBlogFlagsArgs,
  handler: getBlogFlagsHandler,
});

export const getCategories = query({
  args: getCategoriesArgs,
  handler: getCategoriesHandler,
});

export const getTags = query({
  args: getTagsArgs,
  handler: getTagsHandler,
});

export const getFeaturedBlogs = query({
  args: getFeaturedBlogsArgs,
  handler: getFeaturedBlogsHandler,
});

export const getPinnedBlogs = query({
  args: getPinnedBlogsArgs,
  handler: getPinnedBlogsHandler,
});

export const getMyBlogs = query({
  args: getMyBlogsArgs,
  handler: getMyBlogsHandler,
});

export const getUserBlogInteraction = query({
  args: getUserBlogInteractionArgs,
  handler: getUserBlogInteractionHandler,
});

// MUTATIONS

export const createBlog = mutation({
  args: createBlogArgs,
  handler: createBlogHandler,
});

export const generateBlogCoverUploadUrl = mutation({
  args: generateBlogCoverUploadUrlArgs,
  handler: generateBlogCoverUploadUrlHandler,
});

export const saveBlogCoverImage = mutation({
  args: saveBlogCoverImageArgs,
  handler: saveBlogCoverImageHandler,
});

export const updateBlog = mutation({
  args: updateBlogArgs,
  handler: updateBlogHandler,
});

export const deleteBlog = mutation({
  args: deleteBlogArgs,
  handler: deleteBlogHandler,
});

export const likeBlog = mutation({
  args: likeBlogArgs,
  handler: likeBlogHandler,
});

export const unlikeBlog = mutation({
  args: unlikeBlogArgs,
  handler: unlikeBlogHandler,
});

export const bookmarkBlog = mutation({
  args: bookmarkBlogArgs,
  handler: bookmarkBlogHandler,
});

export const unbookmarkBlog = mutation({
  args: unbookmarkBlogArgs,
  handler: unbookmarkBlogHandler,
});

export const shareBlog = mutation({
  args: shareBlogArgs,
  handler: shareBlogHandler,
});

export const flagBlog = mutation({
  args: flagBlogArgs,
  handler: flagBlogHandler,
});

export const reviewFlag = mutation({
  args: reviewFlagArgs,
  handler: reviewFlagHandler,
});

export const archiveBlog = mutation({
  args: archiveBlogArgs,
  handler: archiveBlogHandler,
});

export const publishBlog = mutation({
  args: publishBlogArgs,
  handler: publishBlogHandler,
});

export const unpublishBlog = mutation({
  args: unpublishBlogArgs,
  handler: unpublishBlogHandler,
});

export const pinBlog = mutation({
  args: pinBlogArgs,
  handler: pinBlogHandler,
});

export const featureBlog = mutation({
  args: featureBlogArgs,
  handler: featureBlogHandler,
});

export const moderateBlog = mutation({
  args: moderateBlogArgs,
  handler: moderateBlogHandler,
});

export const createComment = mutation({
  args: createCommentArgs,
  handler: createCommentHandler,
});

export const likeComment = mutation({
  args: likeCommentArgs,
  handler: likeCommentHandler,
});

export const deleteComment = mutation({
  args: deleteCommentArgs,
  handler: deleteCommentHandler,
});

export const flagComment = mutation({
  args: flagCommentArgs,
  handler: flagCommentHandler,
});

export const viewBlog = mutation({
  args: viewBlogArgs,
  handler: viewBlogHandler,
});
