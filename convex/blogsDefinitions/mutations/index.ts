// Mutation handlers and args
export { createBlogHandler, createBlogArgs } from "./createBlog";
export { updateBlogHandler, updateBlogArgs } from "./updateBlog";
export { deleteBlogHandler, deleteBlogArgs } from "./deleteBlog";

// Upload mutations
export { generateBlogCoverUploadUrlHandler, generateBlogCoverUploadUrlArgs } from "./uploadBlogCover";
export { saveBlogCoverImageHandler, saveBlogCoverImageArgs } from "./uploadBlogCover";

// Interaction mutations
export { likeBlogHandler, likeBlogArgs } from "./likeBlog";
export { unlikeBlogHandler, unlikeBlogArgs } from "./unlikeBlog";
export { bookmarkBlogHandler, bookmarkBlogArgs } from "./bookmarkBlog";
export { unbookmarkBlogHandler, unbookmarkBlogArgs } from "./unbookmarkBlog";
export { shareBlogHandler, shareBlogArgs } from "./shareBlog";
export { flagBlogHandler, flagBlogArgs } from "./flagBlog";

// Admin mutations
export { publishBlogHandler, publishBlogArgs } from "./publishBlog";
export { pinBlogHandler, pinBlogArgs } from "./pinBlog";
export { featureBlogHandler, featureBlogArgs } from "./featureBlog";
export { moderateBlogHandler, moderateBlogArgs } from "./moderateBlog";

// Comment mutations
export { createCommentHandler, createCommentArgs } from "./createComment";
export { likeCommentHandler, likeCommentArgs } from "./likeComment";
export { deleteCommentHandler, deleteCommentArgs } from "./deleteComment";
export { flagCommentHandler, flagCommentArgs } from "./flagComment";

// View mutations
export { viewBlogHandler, viewBlogArgs } from "./viewBlog";
