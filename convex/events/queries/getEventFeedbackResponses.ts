import { paginationOptsValidator } from "convex/server";
import { Infer, v } from "convex/values";

import { Doc } from "../../_generated/dataModel";
import { QueryCtx } from "../../_generated/server";

type PaginationOpts = Infer<typeof paginationOptsValidator>;

export const getEventFeedbackResponsesArgs = {
  eventSlug: v.string(),
  paginationOpts: paginationOptsValidator,
  search: v.optional(v.string()),
  sortBy: v.optional(v.union(
    v.literal("submittedAt"),
    v.literal("username"),
    v.literal("firstName"),
    v.literal("lastName"),
    v.literal("email")
  )),
  sortOrder: v.optional(v.union(v.literal("asc"), v.literal("desc"))),
};

export const getEventFeedbackResponsesHandler = async (
  ctx: QueryCtx,
  args: {
    eventSlug: string;
    paginationOpts: PaginationOpts;
    search?: string;
    sortBy?: "submittedAt" | "username" | "firstName" | "lastName" | "email";
    sortOrder?: "asc" | "desc";
  }
) => {
  // Find the event
  const event = await ctx.db
    .query("events")
    .withIndex("by_slug", q => q.eq("slug", args.eventSlug))
    .first();

  if (!event) {
    throw new Error("Event not found");
  }

  // Find the feedback form for this event
  const feedbackForm = await ctx.db
    .query("eventFeedbackForms")
    .withIndex("by_eventId", q => q.eq("eventId", event._id))
    .first();

  if (!feedbackForm) {
    throw new Error("No feedback form found for this event");
  }

  // Apply search filter if provided
  if (args.search) {
    // We'll filter after fetching since we need to search across user data
    // For now, get all responses and filter client-side
    const query = ctx.db
      .query("eventFeedbackResponses")
      .withIndex("by_formId", q => q.eq("formId", feedbackForm._id));
    const allResponses = await query.collect();

    // Get user data for each response to enable search
    const responsesWithUsers = await Promise.all(
      allResponses.map(async (response) => {
        const user = await ctx.db
          .query("users")
          .withIndex("by_username", q => q.eq("username", response.userId))
          .first();

        return {
          response,
          user,
        };
      })
    );

    // Filter by search term
    const searchTerm = args.search.toLowerCase();
    const filteredResponses = responsesWithUsers.filter(({ user }) => {
      if (!user) return false;

      const searchableFields = [
        user.username,
        user.firstName,
        user.lastName,
        user.email,
      ].filter(Boolean);

      return searchableFields.some(field =>
        field!.toLowerCase().includes(searchTerm)
      );
    });

    // Extract just the responses for pagination
    const filteredResponseData = filteredResponses.map(({ response }) => response);

    // Apply sorting
    const sortBy = args.sortBy || "submittedAt";
    const sortOrder = args.sortOrder || "desc";

    filteredResponseData.sort((a, b) => {
      let aValue;
      let bValue;

      if (sortBy === "submittedAt") {
        aValue = a.submittedAt || 0;
        bValue = b.submittedAt || 0;
      } else {
        // For other sorts, we need user data
        const aUser = responsesWithUsers.find(({ response: r }) => r._id === a._id)?.user;
        const bUser = responsesWithUsers.find(({ response: r }) => r._id === b._id)?.user;

        switch (sortBy) {
        case "username":
          aValue = aUser?.username || "";
          bValue = bUser?.username || "";
          break;
        case "firstName":
          aValue = aUser?.firstName || "";
          bValue = bUser?.firstName || "";
          break;
        case "lastName":
          aValue = aUser?.lastName || "";
          bValue = bUser?.lastName || "";
          break;
        case "email":
          aValue = aUser?.email || "";
          bValue = bUser?.email || "";
          break;
        default:
          aValue = a.submittedAt || 0;
          bValue = b.submittedAt || 0;
        }
      }

      if (sortOrder === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    // Apply pagination manually
    const { numItems, cursor } = args.paginationOpts;
    const startIndex = cursor ? parseInt(cursor) : 0;
    const endIndex = startIndex + numItems;
    const paginatedResponses = filteredResponseData.slice(startIndex, endIndex);
    const hasMore = endIndex < filteredResponseData.length;

    // Get full response data with user info
    const responsesWithFullData = await Promise.all(
      paginatedResponses.map(async (response) => {
        const user = responsesWithUsers.find(({ response: r }) => r._id === response._id)?.user;
        const attendee = await ctx.db.get(response.attendeeId);

        return {
          id: response._id,
          formId: response.formId,
          userId: response.userId,
          attendeeId: response.attendeeId,
          responses: response.responses,
          submittedAt: response.submittedAt,
          createdAt: response.createdAt,
          updatedAt: response.updatedAt,
          user: user ? {
            id: user._id,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            imageUrl: user.imageUrl,
          } : null,
          attendee: attendee ? {
            id: attendee._id,
            userId: attendee.userId,
            totalDuration: attendee.totalDuration,
            isEligible: attendee.isEligible,
            registeredAt: attendee.registeredAt,
          } : null,
        };
      })
    );

    // Get total attendees for this event to calculate response rate
    const totalAttendees = await ctx.db
      .query("eventAttendees")
      .withIndex("by_eventId", q => q.eq("eventId", event._id))
      .collect();

    const totalAttendeesCount = totalAttendees.length;
    const responseRate = totalAttendeesCount > 0 ? (filteredResponseData.length / totalAttendeesCount) * 100 : 0;

    // Calculate field statistics for filtered responses
    const fieldStats: Record<string, Record<string, unknown>> = {};
    
    if (feedbackForm.fields && Array.isArray(feedbackForm.fields)) {
      for (const field of feedbackForm.fields) {
        if (field && typeof field === 'object' && 'id' in field) {
          const fieldId = field.id as string;
          const fieldLabel = (field as Record<string, unknown>).label as string || fieldId;
          const fieldType = (field as Record<string, unknown>).type as string || 'text';
          
          let totalAnswers = 0;
          const responses: unknown[] = [];
          
          // Collect all responses for this field from filtered data
          for (const response of filteredResponseData) {
            if (response.responses && typeof response.responses === 'object') {
              const fieldResponse = (response.responses as Record<string, unknown>)[fieldId];
              if (fieldResponse !== undefined && fieldResponse !== null && fieldResponse !== '') {
                totalAnswers++;
                responses.push(fieldResponse);
              }
            }
          }
          
          const fieldResponseRate = filteredResponseData.length > 0 ? (totalAnswers / filteredResponseData.length) * 100 : 0;
          
          // Initialize field stats
          fieldStats[fieldId] = {
            fieldLabel,
            fieldType,
            totalAnswers,
            responseRate: fieldResponseRate,
          };
          
          // Calculate type-specific statistics (same logic as above)
          if (fieldType === 'rating' && responses.length > 0) {
            const numericResponses = responses.filter((r): r is number => typeof r === 'number' && !isNaN(r));
            if (numericResponses.length > 0) {
              const sum = numericResponses.reduce((a, b) => a + b, 0);
              const average = sum / numericResponses.length;
              const min = Math.min(...numericResponses);
              const max = Math.max(...numericResponses);
              
              const distribution: Record<string, number> = {};
              for (const rating of numericResponses) {
                distribution[rating.toString()] = (distribution[rating.toString()] || 0) + 1;
              }
              
              fieldStats[fieldId] = {
                ...fieldStats[fieldId],
                average,
                min,
                max,
                distribution,
              };
            }
          } else if ((fieldType === 'radio' || fieldType === 'checkbox') && responses.length > 0) {
            const optionCounts: Record<string, number> = {};
            for (const response of responses) {
              if (Array.isArray(response)) {
                for (const option of response) {
                  if (typeof option === 'string') {
                    optionCounts[option] = (optionCounts[option] || 0) + 1;
                  }
                }
              } else if (typeof response === 'string') {
                optionCounts[response] = (optionCounts[response] || 0) + 1;
              }
            }
            
            let mostPopular: { option: string; count: number } | undefined;
            for (const [option, count] of Object.entries(optionCounts)) {
              if (!mostPopular || count > mostPopular.count) {
                mostPopular = { option, count };
              }
            }
            
            fieldStats[fieldId] = {
              ...fieldStats[fieldId],
              optionCounts,
              mostPopular,
            };
          } else if ((fieldType === 'text' || fieldType === 'textarea') && responses.length > 0) {
            const textResponses = responses.filter((r): r is string => typeof r === 'string' && r.trim().length > 0);
            if (textResponses.length > 0) {
              const wordCounts = textResponses.map(r => r.trim().split(/\s+/).length);
              const totalWords = wordCounts.reduce((a, b) => a + b, 0);
              const averageWordCount = Math.round(totalWords / textResponses.length);
              
              const sampleResponses = textResponses.slice(0, 3);
              
              fieldStats[fieldId] = {
                ...fieldStats[fieldId],
                averageWordCount,
                totalWords,
                sampleResponses,
              };
            }
          } else if (fieldType === 'select' && responses.length > 0) {
            const uniqueResponses = [...new Set(responses.filter((r): r is string => typeof r === 'string'))];
            fieldStats[fieldId] = {
              ...fieldStats[fieldId],
              sampleAnswers: uniqueResponses.slice(0, 5),
            };
          }
        }
      }
    }

    return {
      responses: responsesWithFullData,
      form: {
        id: feedbackForm._id,
        eventId: feedbackForm.eventId,
        title: feedbackForm.title,
        fields: feedbackForm.fields,
        isActive: feedbackForm.isActive,
        createdAt: feedbackForm.createdAt,
        updatedAt: feedbackForm.updatedAt,
      },
      statistics: {
        totalResponses: filteredResponseData.length,
        totalAttendees: totalAttendeesCount,
        responseRate: Math.round(responseRate * 100) / 100,
        fieldStats: fieldStats,
      },
      meta: {
        page: Math.floor(startIndex / numItems) + 1,
        limit: numItems,
        total: filteredResponseData.length,
        totalPages: Math.ceil(filteredResponseData.length / numItems),
      },
      isDone: !hasMore,
      continueCursor: hasMore ? endIndex.toString() : null,
    };
  }

  // No search filter - use standard pagination
  const sortBy = args.sortBy || "submittedAt";
  const sortOrder = args.sortOrder || "desc";

  // Build the query for feedback responses
  const query = ctx.db
    .query("eventFeedbackResponses")
    .withIndex("by_formId", q => q.eq("formId", feedbackForm._id));

  // Apply sorting
  const sortedQuery = sortBy === "submittedAt"
    ? query.order(sortOrder)
    : query;

  const paginatedResult = await sortedQuery.paginate(args.paginationOpts);

  // Get full response data with user info
  const responsesWithFullData = await Promise.all(
    paginatedResult.page.map(async (response: Doc<"eventFeedbackResponses">) => {
      const user = await ctx.db
        .query("users")
        .withIndex("by_username", q => q.eq("username", response.userId))
        .first();
      const attendee = await ctx.db.get(response.attendeeId);

      return {
        id: response._id,
        formId: response.formId,
        userId: response.userId,
        attendeeId: response.attendeeId,
        responses: response.responses,
        submittedAt: response.submittedAt,
        createdAt: response.createdAt,
        updatedAt: response.updatedAt,
        user: user ? {
          id: user._id,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          imageUrl: user.imageUrl,
        } : null,
        attendee: attendee ? {
          id: attendee._id,
          userId: (attendee as Doc<"eventAttendees">).userId,
          totalDuration: (attendee as Doc<"eventAttendees">).totalDuration,
          isEligible: (attendee as Doc<"eventAttendees">).isEligible,
          registeredAt: (attendee as Doc<"eventAttendees">).registeredAt,
        } : null,
      };
    })
  );

  // Get total count for statistics
  const totalResponses = await ctx.db
    .query("eventFeedbackResponses")
    .withIndex("by_formId", q => q.eq("formId", feedbackForm._id))
    .collect();

  const totalCount = totalResponses.length;

  // Get total attendees for this event to calculate response rate
  const totalAttendees = await ctx.db
    .query("eventAttendees")
    .withIndex("by_eventId", q => q.eq("eventId", event._id))
    .collect();

  const totalAttendeesCount = totalAttendees.length;
  const responseRate = totalAttendeesCount > 0 ? (totalCount / totalAttendeesCount) * 100 : 0;

  // Calculate field statistics
  const fieldStats: Record<string, Record<string, unknown>> = {};
  
  if (feedbackForm.fields && Array.isArray(feedbackForm.fields)) {
    for (const field of feedbackForm.fields) {
      if (field && typeof field === 'object' && 'id' in field) {
        const fieldId = field.id as string;
        const fieldLabel = (field as Record<string, unknown>).label as string || fieldId;
        const fieldType = (field as Record<string, unknown>).type as string || 'text';
        
        let totalAnswers = 0;
        const responses: unknown[] = [];
        
        // Collect all responses for this field
        for (const response of totalResponses) {
          if (response.responses && typeof response.responses === 'object') {
            const fieldResponse = (response.responses as Record<string, unknown>)[fieldId];
            if (fieldResponse !== undefined && fieldResponse !== null && fieldResponse !== '') {
              totalAnswers++;
              responses.push(fieldResponse);
            }
          }
        }
        
        const responseRate = totalCount > 0 ? (totalAnswers / totalCount) * 100 : 0;
        
        // Initialize field stats
        fieldStats[fieldId] = {
          fieldLabel,
          fieldType,
          totalAnswers,
          responseRate,
        };
        
        // Calculate type-specific statistics
        if (fieldType === 'rating' && responses.length > 0) {
          const numericResponses = responses.filter((r): r is number => typeof r === 'number' && !isNaN(r));
          if (numericResponses.length > 0) {
            const sum = numericResponses.reduce((a, b) => a + b, 0);
            const average = sum / numericResponses.length;
            const min = Math.min(...numericResponses);
            const max = Math.max(...numericResponses);
            
            // Calculate distribution
            const distribution: Record<string, number> = {};
            for (const rating of numericResponses) {
              distribution[rating.toString()] = (distribution[rating.toString()] || 0) + 1;
            }
            
            fieldStats[fieldId] = {
              ...fieldStats[fieldId],
              average,
              min,
              max,
              distribution,
            };
          }
        } else if ((fieldType === 'radio' || fieldType === 'checkbox') && responses.length > 0) {
          // Calculate option counts
          const optionCounts: Record<string, number> = {};
          for (const response of responses) {
            if (Array.isArray(response)) {
              // For checkbox (multiple selections)
              for (const option of response) {
                if (typeof option === 'string') {
                  optionCounts[option] = (optionCounts[option] || 0) + 1;
                }
              }
            } else if (typeof response === 'string') {
              // For radio (single selection)
              optionCounts[response] = (optionCounts[response] || 0) + 1;
            }
          }
          
          // Find most popular option
          let mostPopular: { option: string; count: number } | undefined;
          for (const [option, count] of Object.entries(optionCounts)) {
            if (!mostPopular || count > mostPopular.count) {
              mostPopular = { option, count };
            }
          }
          
          fieldStats[fieldId] = {
            ...fieldStats[fieldId],
            optionCounts,
            mostPopular,
          };
        } else if ((fieldType === 'text' || fieldType === 'textarea') && responses.length > 0) {
          // Calculate text statistics
          const textResponses = responses.filter((r): r is string => typeof r === 'string' && r.trim().length > 0);
          if (textResponses.length > 0) {
            const wordCounts = textResponses.map(r => r.trim().split(/\s+/).length);
            const totalWords = wordCounts.reduce((a, b) => a + b, 0);
            const averageWordCount = Math.round(totalWords / textResponses.length);
            
            // Get sample responses (first 3 non-empty ones)
            const sampleResponses = textResponses.slice(0, 3);
            
            fieldStats[fieldId] = {
              ...fieldStats[fieldId],
              averageWordCount,
              totalWords,
              sampleResponses,
            };
          }
        } else if (fieldType === 'select' && responses.length > 0) {
          // For select fields, show sample answers
          const uniqueResponses = [...new Set(responses.filter((r): r is string => typeof r === 'string'))];
          fieldStats[fieldId] = {
            ...fieldStats[fieldId],
            sampleAnswers: uniqueResponses.slice(0, 5),
          };
        }
      }
    }
  }

  return {
    responses: responsesWithFullData,
    form: {
      id: feedbackForm._id,
      eventId: feedbackForm.eventId,
      title: feedbackForm.title,
      fields: feedbackForm.fields,
      isActive: feedbackForm.isActive,
      createdAt: feedbackForm.createdAt,
      updatedAt: feedbackForm.updatedAt,
    },
    statistics: {
      totalResponses: totalCount,
      totalAttendees: totalAttendeesCount,
      responseRate: Math.round(responseRate * 100) / 100, // Round to 2 decimal places
      fieldStats: fieldStats,
    },
    meta: {
      page: Math.floor((args.paginationOpts.cursor ? parseInt(args.paginationOpts.cursor) : 0) / args.paginationOpts.numItems) + 1,
      limit: args.paginationOpts.numItems,
      total: totalCount,
      totalPages: Math.ceil(totalCount / args.paginationOpts.numItems),
    },
    isDone: paginatedResult.isDone,
    continueCursor: paginatedResult.continueCursor,
  };
};
