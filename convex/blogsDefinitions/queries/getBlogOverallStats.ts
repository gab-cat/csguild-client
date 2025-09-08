import { QueryCtx } from "../../_generated/server";

export const getBlogOverallStatsArgs = {};

export const getBlogOverallStatsHandler = async (
  ctx: QueryCtx,
  args: {}
) => {
  // Get all blogs
  const allBlogs = await ctx.db.query("blogs").collect();
  
  // Calculate overall statistics
  const totalBlogs = allBlogs.length;
  const publishedBlogs = allBlogs.filter(blog => blog.status === "PUBLISHED").length;
  const draftBlogs = allBlogs.filter(blog => blog.status === "DRAFT").length;
  const pendingBlogs = allBlogs.filter(blog => blog.status === "PENDING").length;
  const archivedBlogs = allBlogs.filter(blog => blog.status === "ARCHIVED").length;
  const deletedBlogs = allBlogs.filter(blog => blog.status === "DELETED").length;
  
  // Moderation statistics
  const pendingModeration = allBlogs.filter(blog => blog.moderationStatus === "PENDING").length;
  const approvedBlogs = allBlogs.filter(blog => blog.moderationStatus === "APPROVED").length;
  const rejectedBlogs = allBlogs.filter(blog => blog.moderationStatus === "REJECTED").length;
  const flaggedBlogs = allBlogs.filter(blog => blog.moderationStatus === "FLAGGED").length;
  const underReviewBlogs = allBlogs.filter(blog => blog.moderationStatus === "UNDER_REVIEW").length;
  
  // Engagement statistics
  const totalViews = allBlogs.reduce((sum, blog) => sum + (blog.viewCount || 0), 0);
  const totalLikes = allBlogs.reduce((sum, blog) => sum + (blog.likeCount || 0), 0);
  const totalComments = allBlogs.reduce((sum, blog) => sum + (blog.commentCount || 0), 0);
  const totalShares = allBlogs.reduce((sum, blog) => sum + (blog.shareCount || 0), 0);
  const totalBookmarks = allBlogs.reduce((sum, blog) => sum + (blog.bookmarkCount || 0), 0);
  const totalFlags = allBlogs.reduce((sum, blog) => sum + (blog.flagCount || 0), 0);
  
  // Featured and pinned counts
  const featuredBlogs = allBlogs.filter(blog => blog.isFeatured).length;
  const pinnedBlogs = allBlogs.filter(blog => blog.isPinned).length;
  
  // Get blogs with high flag counts (needs attention)
  const highFlagBlogs = allBlogs.filter(blog => (blog.flagCount || 0) >= 3).length;
  
  // Recent activity (last 7 days)
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const recentBlogs = allBlogs.filter(blog => (blog.createdAt || 0) > sevenDaysAgo).length;
  const recentPublished = allBlogs.filter(blog => 
    (blog.publishedAt || 0) > sevenDaysAgo && blog.status === "PUBLISHED"
  ).length;
  
  // Get top authors by blog count
  const authorCounts = allBlogs.reduce((counts, blog) => {
    counts[blog.authorSlug] = (counts[blog.authorSlug] || 0) + 1;
    return counts;
  }, {} as Record<string, number>);
  
  const topAuthors = Object.entries(authorCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([authorSlug, count]) => ({ authorSlug, count }));

  return {
    overview: {
      totalBlogs,
      publishedBlogs,
      draftBlogs,
      pendingBlogs,
      archivedBlogs,
      deletedBlogs,
    },
    moderation: {
      pendingModeration,
      approvedBlogs,
      rejectedBlogs,
      flaggedBlogs,
      underReviewBlogs,
      highFlagBlogs,
    },
    engagement: {
      totalViews,
      totalLikes,
      totalComments,
      totalShares,
      totalBookmarks,
      totalFlags,
      averageViewsPerBlog: totalBlogs > 0 ? Math.round(totalViews / totalBlogs) : 0,
      averageLikesPerBlog: totalBlogs > 0 ? Math.round(totalLikes / totalBlogs) : 0,
    },
    content: {
      featuredBlogs,
      pinnedBlogs,
    },
    recent: {
      recentBlogs,
      recentPublished,
    },
    topAuthors,
  };
};
