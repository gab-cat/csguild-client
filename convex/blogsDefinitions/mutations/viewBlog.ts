import { Infer, v } from "convex/values";

import { MutationCtx } from "../../_generated/server";

// Args for viewing a blog
export const viewBlogArgs = v.object({
  blogId: v.id("blogs"),
  userSlug: v.optional(v.string()),
  ipAddress: v.optional(v.string()),
  userAgent: v.optional(v.string()),
  referrer: v.optional(v.string()),
});


// Handler for viewing a blog
export const viewBlogHandler = async (ctx: MutationCtx, args: Infer<typeof viewBlogArgs>) => {
  const { blogId, userSlug, ipAddress, userAgent, referrer } = args;

  // Check if blog exists
  const blog = await ctx.db.get(blogId);
  if (!blog) {
    throw new Error("Blog not found");
  }


  // Check if this user has already viewed this blog recently (within last hour)
  // This is a basic rate limiting to prevent spam
  if (userSlug) {
    const recentView = await ctx.db
      .query("blogViews")
      .withIndex("by_blogId", (q) =>
        q.eq("blogId", blogId)
      )
      .filter((q) => q.eq(q.field("userSlug"), userSlug))
      .order("desc")
      .take(1);

    if (recentView.length > 0) {
      const lastViewTime = recentView[0].viewedAt || 0;
      const oneHourAgo = Date.now() - (60 * 60 * 1000); // 1 hour in milliseconds

      // If viewed within the last hour, don't increment count but still track the view
      if (lastViewTime > oneHourAgo) {
        // Still create the view record for analytics, but don't increment count
        await ctx.db.insert("blogViews", {
          blogId,
          userSlug,
          ipAddress,
          userAgent,
          referrer,
          viewedAt: Date.now(),
        });
        return { success: true, viewCountIncremented: false };
      }
    }
  }

  // Increment the view count on the blog
  await ctx.db.patch(blogId, {
    viewCount: (blog.viewCount || 0) + 1,
    updatedAt: Date.now(),
  });

  // Create a view record for analytics
  await ctx.db.insert("blogViews", {
    blogId,
    userSlug,
    ipAddress,
    userAgent,
    referrer,
    viewedAt: Date.now(),
  });

  return { success: true, viewCountIncremented: true };
};
