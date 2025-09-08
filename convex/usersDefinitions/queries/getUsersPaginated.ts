import { PaginationOptions, paginationOptsValidator } from "convex/server";
import { v } from "convex/values";

import { QueryCtx } from "../../_generated/server";
import { requireRoleLevel } from "../../helpers";
import { UserRole } from "../../helpers";

export const getUsersPaginatedArgs = {
  paginationOpts: paginationOptsValidator,
  searchQuery: v.optional(v.string()),
} as const;

export const getUsersPaginatedHandler = async (
  ctx: QueryCtx,
  args: {
    paginationOpts: PaginationOptions;
    searchQuery?: string;
  }
) => {
  console.log('getUsersPaginated called with:', {
    searchQuery: args.searchQuery,
    numItems: args.paginationOpts.numItems,
    cursor: args.paginationOpts.cursor
  });
  
  // Require admin or staff role to access all users
  try {
    await requireRoleLevel(ctx, "STAFF" as UserRole);
  } catch (error) {
    console.log('Authentication error:', error);
    throw error;
  }

  // For search functionality, we'll get all users and filter client-side
  // This is because Convex filter has limitations with string operations on Expression types
  if (args.searchQuery && args.searchQuery.trim()) {
    const searchTerm = args.searchQuery.trim().toLowerCase();
    console.log('Applying search filter:', searchTerm);

    // Get all users first
    const allUsers = await ctx.db.query("users").order("desc").collect();
    console.log('Total users fetched:', allUsers.length);

    // Filter users client-side
    const filteredUsers = allUsers.filter(user => {
      const firstName = (user.firstName || "").toLowerCase();
      const lastName = (user.lastName || "").toLowerCase();
      const username = (user.username || "").toLowerCase();
      const email = (user.email || "").toLowerCase();
      const fullName = `${firstName} ${lastName}`.trim();

      const matches = fullName.includes(searchTerm) ||
        firstName.includes(searchTerm) ||
        lastName.includes(searchTerm) ||
        username.includes(searchTerm) ||
        email.includes(searchTerm);

      if (matches) {
        console.log('Found matching user:', { firstName, lastName, username, email });
      }

      return matches;
    });

    console.log('Filtered users count:', filteredUsers.length);

    // Manually implement pagination on filtered results
    const startIndex = args.paginationOpts.cursor ? 
      parseInt(args.paginationOpts.cursor) : 0;
    const endIndex = startIndex + args.paginationOpts.numItems;
    const page = filteredUsers.slice(startIndex, endIndex);
    const isDone = endIndex >= filteredUsers.length;
    const continueCursor = isDone ? null : endIndex.toString();

    const result = {
      page,
      isDone,
      continueCursor
    };

    console.log('Search result:', {
      searchQuery: args.searchQuery,
      pageCount: result.page.length,
      isDone: result.isDone,
      hasContinueCursor: !!result.continueCursor,
      totalFiltered: filteredUsers.length
    });

    return result;
  } else {
    // No search query, use normal pagination
    const result = await ctx.db.query("users")
      .order("desc")
      .paginate(args.paginationOpts);

    console.log('No search - normal pagination result:', {
      pageCount: result.page.length,
      isDone: result.isDone,
      hasContinueCursor: !!result.continueCursor
    });

    return result;
  }
};
