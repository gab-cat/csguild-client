# Prisma to Convex Migration Guide

This guide outlines the process of migrating from your existing Prisma PostgreSQL schema to Convex.

## Overview

The migration involves:
1. **Schema Porting**: Converting Prisma models to Convex tables
2. **Data Migration**: Transferring existing data from PostgreSQL to Convex
3. **Authentication**: Migrating users from your current auth system to Convex auth
4. **API Updates**: Updating your application code to use Convex functions

## Schema Changes

### Key Differences

| Prisma | Convex |
|--------|--------|
| `@id @default(cuid())` | Auto-generated `_id` field |
| `@unique` | `.index()` with unique constraint |
| `@default(now())` | Use JavaScript timestamps |
| `@updatedAt` | Manual timestamp management |
| `DateTime` | `v.number()` (milliseconds since epoch) |
| `Json` | `v.any()` |
| Foreign keys | Reference by `_id` or slug |
| Many-to-many relations | Junction tables |

### User Table Extension

The users table extends Convex's built-in auth tables with additional fields:
- **Auth fields**: `email`, `emailVerified`, `name`, `image`, `provider`, `providerAccountId`
- **Extended fields**: `username`, `firstName`, `lastName`, `birthdate`, `course`, etc.

## Migration Steps

### 1. Schema Deployment

The Convex schema has been created and deployed. All indexes are now active.

### 2. Data Migration Scripts

You'll need to create scripts to migrate your existing data. Here's a basic structure:

```typescript
// convex/migration.ts
import { action } from "./_generated/server";
import { api } from "./_generated/api";

// Example migration action
export const migrateUsers = action({
  args: {},
  handler: async (ctx) => {
    // Connect to your PostgreSQL database
    // Fetch users from Prisma
    // Transform and insert into Convex
    // Handle relationships
  },
});
```

### 3. Date Handling

Convert Prisma DateTime to Convex timestamps:
```typescript
// Convert DateTime to milliseconds since epoch
const convexTimestamp = prismaDate.getTime();
```

### 4. Relationship Handling

#### Before (Prisma)
```sql
model Blog {
  author    User  @relation("BlogAuthor", fields: [authorSlug], references: [username])
  authorSlug String
}
```

#### After (Convex)
```typescript
// In mutations/queries
const blog = await ctx.db.insert("blogs", {
  title: "My Blog",
  authorSlug: user.username, // Store username as string
});

// To get related data
const blogs = await ctx.db
  .query("blogs")
  .withIndex("by_authorSlug", (q) => q.eq("authorSlug", user.username))
  .collect();
```

### 5. Authentication Migration

1. **Export users** from your current auth system
2. **Create Convex auth accounts** for existing users
3. **Migrate passwords** (if using password auth) or handle OAuth migration
4. **Update user references** throughout your app

## Important Considerations

### Indexes
All Prisma `@index` directives have been converted to Convex indexes:
- Single field indexes: `@@index([field])` → `.index("by_field", ["field"])`
- Composite indexes: `@@index([field1, field2])` → `.index("by_field1_field2", ["field1", "field2"])`
- Unique constraints: `@@unique([field1, field2])` → `.index("by_field1_field2", ["field1", "field2"])` + unique logic

### Slug-based Relationships
Many relationships use username slugs instead of IDs for better readability and URL structure.

### Timestamps
All timestamps are now stored as numbers (milliseconds since epoch) instead of DateTime objects.

### JSON Fields
Event feedback forms and responses use `v.any()` for JSON storage.

## Testing Migration

1. **Create test data** in your PostgreSQL database
2. **Run migration scripts** on a subset of data
3. **Verify data integrity** in Convex dashboard
4. **Test application functionality** with migrated data
5. **Performance test** queries with new indexes

## Rollback Plan

1. **Keep PostgreSQL database** as backup during migration
2. **Test thoroughly** before cutting over
3. **Have rollback scripts** ready if issues arise
4. **Monitor performance** after migration

## API Updates Required

Update your application code to use Convex functions instead of Prisma client:

```typescript
// Before (Prisma)
const blogs = await prisma.blog.findMany({
  where: { authorSlug: username },
  include: { author: true }
});

// After (Convex)
const blogs = await ctx.db
  .query("blogs")
  .withIndex("by_authorSlug", (q) => q.eq("authorSlug", username))
  .collect();
```

## Performance Considerations

1. **Indexes**: All necessary indexes have been created based on your Prisma schema
2. **Query patterns**: Convex queries work differently - review and optimize
3. **Pagination**: Use Convex's built-in pagination for large datasets
4. **Real-time**: Leverage Convex's real-time capabilities where appropriate

## Next Steps

1. ✅ Schema created and deployed
2. ⏳ Create data migration scripts
3. ⏳ Test migration with sample data
4. ⏳ Update application code
5. ⏳ Full migration and testing

## Support

If you encounter issues during migration:
1. Check the Convex dashboard for schema validation errors
2. Review the generated types in `_generated/dataModel.d.ts`
3. Test queries in the Convex dashboard
4. Refer to Convex documentation for query optimization
