import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// Create base schema with auth tables
const baseSchema = defineSchema({
  ...authTables,
});

// Extend the users table with custom fields
const schema = defineSchema({
  ...baseSchema.tables,
  
  // Extend the users table with additional fields
  users: defineTable({
    // Core auth fields - these should match authTables expectations
    email: v.optional(v.string()),
    emailVerified: v.optional(v.boolean()),
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    
    // Additional custom fields for your app
    username: v.optional(v.string()),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    birthdate: v.optional(v.number()), // Convex uses numbers for dates (milliseconds since epoch)
    course: v.optional(v.string()),
    emailVerificationCode: v.optional(v.string()),
    passwordResetToken: v.optional(v.string()),
    passwordResetExpiresAt: v.optional(v.number()),
    rfidId: v.optional(v.string()),
    refreshToken: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    imageStorageId: v.optional(v.id("_storage")),
    provider: v.optional(v.string()),
    providerAccountId: v.optional(v.string()),
    signupMethod: v.optional(v.union(v.literal("GOOGLE"), v.literal("EMAIL"), v.literal("FACEBOOK"), v.literal("APPLE"))),
    currentFacilityId: v.optional(v.id("facilities")),
    roles: v.optional(v.array(v.union(v.literal("STUDENT"), v.literal("USER"), v.literal("STAFF"), v.literal("ADMIN")))),
    bio: v.optional(v.string()),
    // Metadata
    createdAt: v.optional(v.number()),
    updatedAt: v.optional(v.number()),
  })
    .index("by_email", ["email"])
    .index("by_username", ["username"])
    .index("by_rfidId", ["rfidId"])
    .index("by_currentFacilityId", ["currentFacilityId"]),

  // User roles table
  userRoles: defineTable({
    name: v.string(),
    slug: v.string(),
    description: v.optional(v.string()),
    createdAt: v.optional(v.number()),
    updatedAt: v.optional(v.number()),
  })
    .index("by_slug", ["slug"]),

  // Facilities tables
  facilities: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    location: v.optional(v.string()),
    capacity: v.optional(v.number()),
    isActive: v.optional(v.boolean()),
    createdAt: v.optional(v.number()),
    updatedAt: v.optional(v.number()),
  })
    .index("by_name", ["name"])
    .index("by_isActive", ["isActive"]),

  // Facility usage sessions (existing table with enhanced indexes)
  facilityUsages: defineTable({
    userId: v.id("users"),
    facilityId: v.id("facilities"),
    timeIn: v.optional(v.number()),
    timeOut: v.optional(v.number()),
    isActive: v.optional(v.boolean()),
    createdAt: v.optional(v.number()),
    updatedAt: v.optional(v.number()),
  })
    .index("by_userId", ["userId"])
    .index("by_facilityId", ["facilityId"])
    .index("by_timeIn", ["timeIn"])
    .index("by_isActive", ["isActive"])
    .index("by_userId_facilityId_isActive", ["userId", "facilityId", "isActive"])
    .index("by_facilityId_isActive", ["facilityId", "isActive"]) // New index for real-time occupancy
    .index("by_facilityId_timeIn", ["facilityId", "timeIn"]), // New index for usage history

  // Audit logs for facility access attempts
  facilityAccessLogs: defineTable({
    userId: v.optional(v.id("users")),
    facilityId: v.id("facilities"),
    rfidId: v.optional(v.string()),
    action: v.union(v.literal("checkin"), v.literal("checkout"), v.literal("access_denied")),
    reason: v.optional(v.string()), // e.g., "capacity_exceeded", "facility_inactive", "invalid_card"
    success: v.boolean(),
    timestamp: v.number(),
    metadata: v.optional(v.object({
      userAgent: v.optional(v.string()),
      ipAddress: v.optional(v.string()),
      deviceId: v.optional(v.string()),
    })),
  })
    .index("by_userId", ["userId"])
    .index("by_facilityId", ["facilityId"])
    .index("by_rfId", ["rfidId"])
    .index("by_timestamp", ["timestamp"])
    .index("by_facilityId_timestamp", ["facilityId", "timestamp"])
    .index("by_userId_timestamp", ["userId", "timestamp"]),

  // Real-time occupancy tracking
  facilityOccupancy: defineTable({
    facilityId: v.id("facilities"),
    currentOccupancy: v.number(),
    maxCapacity: v.number(),
    lastUpdated: v.number(),
    activeSessions: v.array(v.object({
      userId: v.id("users"),
      sessionId: v.id("facilityUsages"),
      timeIn: v.number(),
    })),
  })
    .index("by_facilityId", ["facilityId"])
    .index("by_lastUpdated", ["lastUpdated"]),

  // Projects tables
  projects: defineTable({
    title: v.string(),
    slug: v.string(),
    description: v.string(),
    tags: v.optional(v.array(v.string())),
    dueDate: v.optional(v.number()),
    status: v.optional(v.union(v.literal("OPEN"), v.literal("IN_PROGRESS"), v.literal("COMPLETED"), v.literal("CANCELLED"))),
    ownerSlug: v.string(), // Reference to user username
    createdAt: v.optional(v.number()),
    updatedAt: v.optional(v.number()),
  })
    .index("by_slug", ["slug"])
    .index("by_ownerSlug", ["ownerSlug"])
    .index("by_status", ["status"])
    .index("by_dueDate", ["dueDate"]),

  projectRoles: defineTable({
    projectSlug: v.string(),
    roleSlug: v.string(),
    maxMembers: v.optional(v.number()),
    requirements: v.optional(v.string()),
    createdAt: v.optional(v.number()),
    updatedAt: v.optional(v.number()),
  })
    .index("by_projectSlug", ["projectSlug"])
    .index("by_roleSlug", ["roleSlug"])
    .index("by_projectSlug_roleSlug", ["projectSlug", "roleSlug"]),

  projectMembers: defineTable({
    projectSlug: v.string(),
    userSlug: v.string(),
    roleSlug: v.string(),
    status: v.optional(v.union(v.literal("ACTIVE"), v.literal("INACTIVE"), v.literal("REMOVED"))),
    joinedAt: v.optional(v.number()),
    createdAt: v.optional(v.number()),
    updatedAt: v.optional(v.number()),
  })
    .index("by_projectSlug", ["projectSlug"])
    .index("by_userSlug", ["userSlug"])
    .index("by_roleSlug", ["roleSlug"])
    .index("by_projectSlug_userSlug_roleSlug", ["projectSlug", "userSlug", "roleSlug"]),

  projectApplications: defineTable({
    projectSlug: v.string(),
    userSlug: v.string(),
    roleSlug: v.string(),
    message: v.optional(v.string()),
    status: v.optional(v.union(v.literal("PENDING"), v.literal("APPROVED"), v.literal("REJECTED"))),
    appliedAt: v.optional(v.number()),
    reviewedAt: v.optional(v.number()),
    reviewedBySlug: v.optional(v.string()),
    reviewMessage: v.optional(v.string()),
    notifiedOwnerAt: v.optional(v.number()),
    createdAt: v.optional(v.number()),
    updatedAt: v.optional(v.number()),
  })
    .index("by_projectSlug", ["projectSlug"])
    .index("by_userSlug", ["userSlug"])
    .index("by_roleSlug", ["roleSlug"])
    .index("by_status", ["status"])
    .index("by_notifiedOwnerAt", ["notifiedOwnerAt"])
    .index("by_projectSlug_userSlug_roleSlug", ["projectSlug", "userSlug", "roleSlug"]),

  // Project pinning and saving
  projectPinned: defineTable({
    projectSlug: v.string(),
    pinnedAt: v.optional(v.number()),
    pinnedBy: v.string(), // Admin username
    order: v.number(),
  })
    .index("by_order", ["order"])
    .index("by_pinnedAt", ["pinnedAt"])
    .index("by_projectSlug", ["projectSlug"]),

  projectSaved: defineTable({
    userSlug: v.string(),
    projectSlug: v.string(),
    savedAt: v.optional(v.number()),
  })
    .index("by_userSlug", ["userSlug"])
    .index("by_savedAt", ["savedAt"])
    .index("by_userSlug_projectSlug", ["userSlug", "projectSlug"]),

  // Events tables
  events: defineTable({
    title: v.string(),
    slug: v.string(),
    type: v.optional(v.union(v.literal("IN_PERSON"), v.literal("VIRTUAL"), v.literal("HYBRID"), v.literal("OTHERS"))),
    imageUrl: v.optional(v.string()),
    imageStorageId: v.optional(v.id("_storage")),
    description: v.optional(v.string()),
    details: v.optional(v.string()),
    startDate: v.number(),
    endDate: v.optional(v.number()),
    tags: v.optional(v.array(v.string())),
    isPinned: v.optional(v.boolean()),
    organizedBy: v.string(), // User username
    minimumAttendanceMinutes: v.optional(v.number()),
    createdAt: v.optional(v.number()),
    updatedAt: v.optional(v.number()),
  })
    .index("by_startDate", ["startDate"])
    .index("by_endDate", ["endDate"])
    .index("by_isPinned", ["isPinned"])
    .index("by_organizedBy", ["organizedBy"])
    .index("by_slug", ["slug"]),

  eventSessions: defineTable({
    attendeeId: v.id("eventAttendees"),
    startedAt: v.optional(v.number()),
    endedAt: v.optional(v.number()),
    duration: v.optional(v.number()),
    createdAt: v.optional(v.number()),
    updatedAt: v.optional(v.number()),
  })
    .index("by_attendeeId", ["attendeeId"])
    .index("by_startedAt", ["startedAt"])
    .index("by_endedAt", ["endedAt"]),

  eventAttendees: defineTable({
    eventId: v.id("events"),
    userId: v.string(), // User username
    totalDuration: v.optional(v.number()),
    isEligible: v.optional(v.boolean()),
    sentSurveyEmailAt: v.optional(v.number()),
    notifiedFeedback: v.optional(v.boolean()),
    registeredAt: v.optional(v.number()),
    createdAt: v.optional(v.number()),
    updatedAt: v.optional(v.number()),
  })
    .index("by_eventId", ["eventId"])
    .index("by_userId", ["userId"])
    .index("by_isEligible", ["isEligible"])
    .index("by_sentSurveyEmailAt", ["sentSurveyEmailAt"]) 
    .index("by_notifiedFeedback", ["notifiedFeedback"])
    .index("by_eventId_userId", ["eventId", "userId"]),

  eventFeedbackForms: defineTable({
    eventId: v.id("events"),
    title: v.optional(v.string()),
    fields: v.any(), // JSON schema
    isActive: v.optional(v.boolean()),
    createdAt: v.optional(v.number()),
    updatedAt: v.optional(v.number()),
  })
    .index("by_eventId", ["eventId"])
    .index("by_isActive", ["isActive"]),

  eventFeedbackResponses: defineTable({
    formId: v.id("eventFeedbackForms"),
    userId: v.string(),
    attendeeId: v.id("eventAttendees"),
    responses: v.any(), // JSON responses
    submittedAt: v.optional(v.number()),
    createdAt: v.optional(v.number()),
    updatedAt: v.optional(v.number()),
  })
    .index("by_formId", ["formId"])
    .index("by_userId", ["userId"])
    .index("by_attendeeId", ["attendeeId"])
    .index("by_submittedAt", ["submittedAt"])
    .index("by_formId_userId", ["formId", "userId"]),

  eventOrganizerRatings: defineTable({
    eventId: v.id("events"),
    userId: v.string(),
    rating: v.number(),
    comment: v.optional(v.string()),
    submittedAt: v.optional(v.number()),
    createdAt: v.optional(v.number()),
    updatedAt: v.optional(v.number()),
  })
    .index("by_eventId", ["eventId"])
    .index("by_userId", ["userId"])
    .index("by_rating", ["rating"])
    .index("by_submittedAt", ["submittedAt"])
    .index("by_eventId_userId", ["eventId", "userId"]),

  // Blog system tables
  blogs: defineTable({
    title: v.string(),
    slug: v.string(),
    subtitle: v.optional(v.string()),
    content: v.string(),
    excerpt: v.optional(v.string()),
    readingTime: v.optional(v.number()),
    wordCount: v.optional(v.number()),
    status: v.optional(v.union(v.literal("DRAFT"), v.literal("PUBLISHED"), v.literal("SCHEDULED"), v.literal("ARCHIVED"), v.literal("DELETED"))),
    publishedAt: v.optional(v.number()),
    scheduledFor: v.optional(v.number()),
    lastEditedAt: v.optional(v.number()),
    metaDescription: v.optional(v.string()),
    metaKeywords: v.optional(v.array(v.string())),
    canonicalUrl: v.optional(v.string()),
    viewCount: v.optional(v.number()),
    likeCount: v.optional(v.number()),
    commentCount: v.optional(v.number()),
    shareCount: v.optional(v.number()),
    bookmarkCount: v.optional(v.number()),
    moderationStatus: v.optional(v.union(v.literal("PENDING"), v.literal("APPROVED"), v.literal("REJECTED"), v.literal("FLAGGED"), v.literal("UNDER_REVIEW"))),
    moderatedAt: v.optional(v.number()),
    moderatedBy: v.optional(v.string()),
    moderationNotes: v.optional(v.string()),
    flagCount: v.optional(v.number()),
    authorSlug: v.string(),
    allowComments: v.optional(v.boolean()),
    allowBookmarks: v.optional(v.boolean()),
    allowLikes: v.optional(v.boolean()),
    allowShares: v.optional(v.boolean()),
    isPinned: v.optional(v.boolean()),
    isFeatured: v.optional(v.boolean()),
    createdAt: v.optional(v.number()),
    updatedAt: v.optional(v.number()),
  })
    .index("by_slug", ["slug"])
    .index("by_authorSlug", ["authorSlug"])
    .index("by_status", ["status"])
    .index("by_moderationStatus", ["moderationStatus"])
    .index("by_publishedAt", ["publishedAt"])
    .index("by_createdAt", ["createdAt"])
    .index("by_viewCount", ["viewCount"])
    .index("by_likeCount", ["likeCount"])
    .index("by_isPinned", ["isPinned"])
    .index("by_isFeatured", ["isFeatured"]),

  blogCoverImages: defineTable({
    blogId: v.id("blogs"),
    imageUrl: v.string(),
    altText: v.optional(v.string()),
    caption: v.optional(v.string()),
    credits: v.optional(v.string()),
    order: v.optional(v.number()),
    isMain: v.optional(v.boolean()),
    createdAt: v.optional(v.number()),
  })
    .index("by_blogId", ["blogId"])
    .index("by_order", ["order"]),

  blogTags: defineTable({
    name: v.string(),
    slug: v.string(),
    description: v.optional(v.string()),
    color: v.optional(v.string()),
    isOfficial: v.optional(v.boolean()),
    blogCount: v.optional(v.number()),
    createdAt: v.optional(v.number()),
    updatedAt: v.optional(v.number()),
  })
    .index("by_slug", ["slug"])
    .index("by_isOfficial", ["isOfficial"])
    .index("by_blogCount", ["blogCount"]),

  blogTagRelations: defineTable({
    blogId: v.id("blogs"),
    tagId: v.id("blogTags"),
    createdAt: v.optional(v.number()),
  })
    .index("by_blogId", ["blogId"])
    .index("by_tagId", ["tagId"])
    .index("by_blogId_tagId", ["blogId", "tagId"]),

  blogCategories: defineTable({
    name: v.string(),
    slug: v.string(),
    description: v.optional(v.string()),
    color: v.optional(v.string()),
    icon: v.optional(v.string()),
    parentId: v.optional(v.id("blogCategories")),
    blogCount: v.optional(v.number()),
    order: v.optional(v.number()),
    isActive: v.optional(v.boolean()),
    createdAt: v.optional(v.number()),
    updatedAt: v.optional(v.number()),
  })
    .index("by_slug", ["slug"])
    .index("by_parentId", ["parentId"])
    .index("by_order", ["order"])
    .index("by_isActive", ["isActive"]),

  blogCategoryRelations: defineTable({
    blogId: v.id("blogs"),
    categoryId: v.id("blogCategories"),
    createdAt: v.optional(v.number()),
  })
    .index("by_blogId", ["blogId"])
    .index("by_categoryId", ["categoryId"])
    .index("by_blogId_categoryId", ["blogId", "categoryId"]),

  blogComments: defineTable({
    blogId: v.id("blogs"),
    authorSlug: v.string(),
    content: v.string(),
    parentId: v.optional(v.id("blogComments")),
    status: v.optional(v.union(v.literal("PUBLISHED"), v.literal("HIDDEN"), v.literal("DELETED"), v.literal("UNDER_REVIEW"))),
    moderatedAt: v.optional(v.number()),
    moderatedBy: v.optional(v.string()),
    moderationNotes: v.optional(v.string()),
    likeCount: v.optional(v.number()),
    flagCount: v.optional(v.number()),
    createdAt: v.optional(v.number()),
    updatedAt: v.optional(v.number()),
  })
    .index("by_blogId", ["blogId"])
    .index("by_authorSlug", ["authorSlug"])
    .index("by_parentId", ["parentId"])
    .index("by_status", ["status"])
    .index("by_createdAt", ["createdAt"]),

  blogLikes: defineTable({
    blogId: v.id("blogs"),
    userSlug: v.string(),
    createdAt: v.optional(v.number()),
  })
    .index("by_blogId", ["blogId"])
    .index("by_userSlug", ["userSlug"])
    .index("by_createdAt", ["createdAt"])
    .index("by_blogId_userSlug", ["blogId", "userSlug"]),

  blogCommentLikes: defineTable({
    commentId: v.id("blogComments"),
    userSlug: v.string(),
    createdAt: v.optional(v.number()),
  })
    .index("by_commentId", ["commentId"])
    .index("by_userSlug", ["userSlug"])
    .index("by_commentId_userSlug", ["commentId", "userSlug"]),

  blogBookmarks: defineTable({
    blogId: v.id("blogs"),
    userSlug: v.string(),
    createdAt: v.optional(v.number()),
  })
    .index("by_blogId", ["blogId"])
    .index("by_userSlug", ["userSlug"])
    .index("by_createdAt", ["createdAt"])
    .index("by_blogId_userSlug", ["blogId", "userSlug"]),

  blogShares: defineTable({
    blogId: v.id("blogs"),
    userSlug: v.optional(v.string()),
    platform: v.string(),
    sharedAt: v.optional(v.number()),
  })
    .index("by_blogId", ["blogId"])
    .index("by_userSlug", ["userSlug"])
    .index("by_platform", ["platform"])
    .index("by_sharedAt", ["sharedAt"]),

  blogViews: defineTable({
    blogId: v.id("blogs"),
    userSlug: v.optional(v.string()),
    ipAddress: v.optional(v.string()),
    userAgent: v.optional(v.string()),
    referrer: v.optional(v.string()),
    viewedAt: v.optional(v.number()),
  })
    .index("by_blogId", ["blogId"])
    .index("by_userSlug", ["userSlug"])
    .index("by_viewedAt", ["viewedAt"]),

  blogFlags: defineTable({
    blogId: v.id("blogs"),
    userSlug: v.string(),
    reason: v.union(v.literal("SPAM"), v.literal("HARASSMENT"), v.literal("HATE_SPEECH"), v.literal("INAPPROPRIATE_CONTENT"), v.literal("COPYRIGHT_VIOLATION"), v.literal("MISINFORMATION"), v.literal("VIOLENCE"), v.literal("ADULT_CONTENT"), v.literal("OTHER")),
    description: v.optional(v.string()),
    status: v.optional(v.union(v.literal("PENDING"), v.literal("REVIEWED"), v.literal("RESOLVED"), v.literal("DISMISSED"))),
    reviewedAt: v.optional(v.number()),
    reviewedBy: v.optional(v.string()),
    createdAt: v.optional(v.number()),
  })
    .index("by_blogId", ["blogId"])
    .index("by_userSlug", ["userSlug"])
    .index("by_status", ["status"])
    .index("by_reason", ["reason"])
    .index("by_blogId_userSlug", ["blogId", "userSlug"]),

  blogCommentFlags: defineTable({
    commentId: v.id("blogComments"),
    userSlug: v.string(),
    reason: v.union(v.literal("SPAM"), v.literal("HARASSMENT"), v.literal("HATE_SPEECH"), v.literal("INAPPROPRIATE_CONTENT"), v.literal("COPYRIGHT_VIOLATION"), v.literal("MISINFORMATION"), v.literal("VIOLENCE"), v.literal("ADULT_CONTENT"), v.literal("OTHER")),
    description: v.optional(v.string()),
    status: v.optional(v.union(v.literal("PENDING"), v.literal("REVIEWED"), v.literal("RESOLVED"), v.literal("DISMISSED"))),
    reviewedAt: v.optional(v.number()),
    reviewedBy: v.optional(v.string()),
    createdAt: v.optional(v.number()),
  })
    .index("by_commentId", ["commentId"])
    .index("by_userSlug", ["userSlug"])
    .index("by_status", ["status"])
    .index("by_commentId_userSlug", ["commentId", "userSlug"]),

  blogRevisions: defineTable({
    blogId: v.id("blogs"),
    title: v.string(),
    content: v.string(),
    version: v.number(),
    changeNote: v.optional(v.string()),
    createdBy: v.string(),
    createdAt: v.optional(v.number()),
  })
    .index("by_blogId", ["blogId"])
    .index("by_version", ["version"])
    .index("by_createdAt", ["createdAt"])
    .index("by_blogId_version", ["blogId", "version"]),
});
 
export default schema;