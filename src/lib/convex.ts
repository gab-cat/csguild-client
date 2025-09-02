// Named exports to avoid client boundary issues with Turbopack
export { api, internal } from '@convex/_generated/api'
export type {
  Doc,
  Id,
  TableNames,
  DataModel
} from '@convex/_generated/dataModel'

// Convex helpers for direct component usage
export { useQuery } from 'convex-helpers/react/cache/hooks'
export { useMutation, useAction } from 'convex/react'