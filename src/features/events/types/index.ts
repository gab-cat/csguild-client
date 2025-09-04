// Event types based on API documentation
import type {
  CreateEventDto,
  UpdateEventDto,
  EventCreateResponseDto,
  EventUpdateResponseDto,
  EventDeleteResponseDto,
  EventDetailResponseDto,
  EventListResponseDto,
  EventBasicResponseDto,
  CreateFeedbackFormDto,
  FeedbackFormResponseDto,
  FeedbackFormFieldDto,
  FeedbackSubmissionResponseDto,
  SubmitFeedbackResponseDto,
  ToggleSessionDto,
  EventOrganizerDto
} from '@generated/api-client'
import { 
  FeedbackFormFieldDtoTypeEnum,
  EventDetailResponseDtoTypeEnum,
  EventBasicResponseDtoTypeEnum,
  CreateEventDtoTypeEnum
} from '@generated/api-client'

// Re-export API types for convenience
export type {
  CreateEventDto,
  UpdateEventDto,
  EventCreateResponseDto,
  EventUpdateResponseDto,
  EventDeleteResponseDto,
  EventDetailResponseDto,
  EventListResponseDto,
  EventBasicResponseDto,
  CreateFeedbackFormDto,
  FeedbackFormResponseDto,
  FeedbackFormFieldDto,
  FeedbackFormFieldDtoTypeEnum,
  FeedbackSubmissionResponseDto,
  SubmitFeedbackResponseDto,
  ToggleSessionDto,
  EventOrganizerDto,
  EventDetailResponseDtoTypeEnum,
  EventBasicResponseDtoTypeEnum,
  CreateEventDtoTypeEnum
}

// Event status enum (based on typical event lifecycle)
export type EventStatus = 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED'

// Event filters for query parameters
export interface EventFiltersType {
  search?: string
  tags?: string[]
  organizerSlug?: string
  status?: 'upcoming' | 'ongoing' | 'completed'
  organizerId?: string
  pinned?: boolean
  sortOrder?: 'asc' | 'desc'
  sortBy?: 'createdAt' | 'updatedAt' | 'startDate' | 'endDate' | 'title'
  limit?: number
  page?: number
}

// Extended event creation data with feedback form
export interface CreateEventData extends CreateEventDto {
  feedbackForm?: {
    title?: string
    fields: FeedbackFormFieldDto[]
  }
}

// Form builder types
export interface FormField {
  id: string
  label: string
  type: FeedbackFormFieldDtoTypeEnum
  required?: boolean
  options?: string[]
  placeholder?: string
  description?: string
  maxRating?: number
}

export interface FormBuilderState {
  fields: FormField[]
  isPreviewMode: boolean
  activeFieldId: string | null
}

// Field templates for quick insertion
export interface FieldTemplate {
  id: string
  name: string
  type: FeedbackFormFieldDtoTypeEnum
  defaultConfig: Partial<FormField>
  icon: string
  category: 'basic' | 'advanced' | 'rating'
}

// Event card data for listing
export interface EventCardType {
  id: string
  slug: string
  title: string
  type: EventDetailResponseDtoTypeEnum
  description?: string
  details?: string
  imageUrl?: string
  startDate: string
  endDate?: string
  tags?: string[]
  organizer: EventOrganizerDto
  createdAt: string
  updatedAt: string
}

// Utility function to convert EventDetailResponseDto to EventCard
export function toEventCard(event: EventDetailResponseDto): EventCardType {
  return {
    id: event.id,
    slug: event.slug,
    title: event.title,
    type: event.type,
    description: typeof event.description === 'string' ? event.description : undefined,
    details: typeof event.details === 'string' ? event.details : undefined,
    imageUrl: typeof event.imageUrl === 'string' ? event.imageUrl : undefined,
    startDate: event.startDate,
    endDate: typeof event.endDate === 'string' ? event.endDate : undefined,
    tags: event.tags,
    organizer: event.organizer,
    createdAt: event.createdAt,
    updatedAt: event.updatedAt,
  }
}

// Utility function to convert EventBasicResponseDto to EventCard
export function toEventCardFromBasic(event: EventBasicResponseDto, organizer: EventOrganizerDto): EventCardType {
  return {
    id: event.id,
    slug: event.slug,
    title: event.title,
    type: event.type,
    description: typeof event.description === 'string' ? event.description : undefined,
    details: typeof event.details === 'string' ? event.details : undefined,
    imageUrl: typeof event.imageUrl === 'string' ? event.imageUrl : undefined,
    startDate: event.startDate,
    endDate: typeof event.endDate === 'string' ? event.endDate : undefined,
    tags: event.tags,
    organizer: organizer,
    createdAt: event.createdAt,
    updatedAt: event.updatedAt,
  }
}

// Convex Event Types
export interface ConvexEventType {
  id: string
  slug: string
  title: string
  type: "IN_PERSON" | "VIRTUAL" | "HYBRID" | "OTHERS" | undefined
  description?: string
  details?: string
  imageUrl?: string
  startDate: number
  endDate?: number
  tags: string[]
  organizedBy: string
  minimumAttendanceMinutes?: number
  isPinned?: boolean
  createdAt: number
  updatedAt: number
  organizer: {
    id: string
    username: string
    firstName?: string
    lastName?: string
    imageUrl?: string
  } | null
  attendeeCount: number
  averageRating: number | null
  ratingCount: number
}

export interface ConvexEventDetailType extends ConvexEventType {
  attendees: Array<{
    id: string
    userId: string
    totalDuration?: number
    isEligible?: boolean
    registeredAt: number
    user: {
      id: string
      username: string
      firstName?: string
      lastName?: string
      email?: string
      imageUrl?: string
    } | null
  }>
  feedbackForm: {
    id: string
    title: string
    fields: any[]
    isActive: boolean
    createdAt: number
  } | null
}

// Type adapter functions for Convex data
export function toEventCardFromConvex(event: any): EventCardType {
  return {
    id: event.id,
    slug: event.slug,
    title: event.title,
    type: event.type || "IN_PERSON", // Default to IN_PERSON if undefined
    description: event.description,
    details: event.details,
    imageUrl: event.imageUrl,
    startDate: new Date(event.startDate).toISOString(),
    endDate: event.endDate ? new Date(event.endDate).toISOString() : undefined,
    tags: event.tags || [],
    organizer: event.organizer ? {
      id: event.organizer.id,
      username: event.organizer.username,
      firstName: event.organizer.firstName,
      lastName: event.organizer.lastName,
      email: event.organizer.email,
      course: event.organizer.course,
      imageUrl: event.organizer.imageUrl,
    } : {
      id: "",
      username: event.organizedBy,
      firstName: undefined,
      lastName: undefined,
      email: undefined,
      course: undefined,
      imageUrl: undefined,
    },
    createdAt: new Date(event.createdAt).toISOString(),
    updatedAt: new Date(event.updatedAt).toISOString(),
  }
}

export function toEventDetailFromConvex(event: any): EventDetailResponseDto {
  return {
    id: event.id,
    slug: event.slug,
    title: event.title,
    type: event.type || "IN_PERSON",
    description: event.description || "",
    details: event.details || "",
    imageUrl: event.imageUrl || "",
    startDate: new Date(event.startDate).toISOString(),
    endDate: event.endDate ? new Date(event.endDate).toISOString() : "",
    tags: event.tags,
    organizedBy: event.organizedBy,
    minimumAttendanceMinutes: event.minimumAttendanceMinutes || 0,
    isPinned: event.isPinned,
    createdAt: new Date(event.createdAt).toISOString(),
    updatedAt: new Date(event.updatedAt).toISOString(),
    organizer: event.organizer ? {
      id: event.organizer.id,
      username: event.organizer.username,
      firstName: event.organizer.firstName,
      lastName: event.organizer.lastName,
      email: event.organizer.email,
      course: event.organizer.course,
      imageUrl: event.organizer.imageUrl,
    } : {
      id: "",
      username: event.organizedBy,
      firstName: undefined,
      lastName: undefined,
      email: undefined,
      course: undefined,
      imageUrl: undefined,
    },
    attendees: event.attendees.map(attendee => ({
      id: attendee.id,
      userId: attendee.userId,
      totalDuration: attendee.totalDuration || 0,
      isEligible: attendee.isEligible || false,
      registeredAt: new Date(attendee.registeredAt).toISOString(),
      user: attendee.user || undefined,
    })),
    attendeeCount: event.attendeeCount,
    averageRating: event.averageRating,
    ratingCount: event.ratingCount,
    feedbackForm: event.feedbackForm ? {
      id: event.feedbackForm.id,
      title: event.feedbackForm.title,
      fields: event.feedbackForm.fields,
      isActive: event.feedbackForm.isActive,
      createdAt: new Date(event.feedbackForm.createdAt).toISOString(),
    } : undefined,
  }
}

// API Error types
export interface EventApiError {
  message: string
  statusCode: number
  details?: string
}

// Form states
export interface EventFormState {
  isLoading: boolean
  error: string | null
  isSuccess: boolean
}

export interface FeedbackFormState {
  isLoading: boolean
  error: string | null
  isSuccess: boolean
}

// Attendance/Session types
export interface AttendanceSession {
  id: string
  userId: string
  eventId: string
  checkInTime: string
  checkOutTime?: string
  duration?: number
  isActive: boolean
}

export interface EventAttendee {
  id: string
  username: string
  firstName: string
  lastName: string
  email: string
  imageUrl?: string
  sessions: AttendanceSession[]
  totalDuration: number
  isCurrentlyAttending: boolean
}

// Type guards
export function isValidEventField(field: unknown): field is FormField {
  return typeof field === 'object' && field !== null && 
    'id' in field && typeof field.id === 'string' &&
    'label' in field && typeof field.label === 'string' &&
    'type' in field && Object.values(FeedbackFormFieldDtoTypeEnum).includes(field.type as FeedbackFormFieldDtoTypeEnum)
}

export function hasEventDate(event: unknown): event is EventCardType & { startDate: string } {
  return typeof event === 'object' && event !== null && 
    'startDate' in event && typeof event.startDate === 'string'
}

// Feedback responses filters for query parameters
export interface FeedbackResponsesFilters {
  page?: number
  limit?: number
  search?: string
  sortBy?: 'submittedAt' | 'username' | 'firstName' | 'lastName' | 'email'
  sortOrder?: 'asc' | 'desc'
}

// Feedback responses data structure
export interface FeedbackResponseData {
  responses: FeedbackSubmissionResponseDto[]
  form: FeedbackFormResponseDto
  statistics: {
    totalResponses: number
    totalAttendees: number
    responseRate: number
    fieldStatistics: Record<string, {
      totalAnswers: number
      answerCounts: Record<string, number>
      averageRating?: number
    }>
    fieldStats: Array<{
      fieldId: string
      fieldLabel: string
      totalResponses: number
      responseRate: number
      answerDistribution: Record<string, number>
    }>
  }
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Form builder configuration
export const FIELD_TEMPLATES: FieldTemplate[] = [
  {
    id: 'text',
    name: 'Text Input',
    type: FeedbackFormFieldDtoTypeEnum.TEXT,
    defaultConfig: {
      label: 'Text Field',
      placeholder: 'Enter text...',
      required: false
    },
    icon: 'Type',
    category: 'basic'
  },
  {
    id: 'textarea',
    name: 'Long Text',
    type: FeedbackFormFieldDtoTypeEnum.TEXTAREA,
    defaultConfig: {
      label: 'Long Text Field',
      placeholder: 'Enter detailed response...',
      required: false
    },
    icon: 'FileText',
    category: 'basic'
  },
  {
    id: 'radio',
    name: 'Multiple Choice',
    type: FeedbackFormFieldDtoTypeEnum.RADIO,
    defaultConfig: {
      label: 'Multiple Choice',
      options: ['Option 1', 'Option 2', 'Option 3'],
      required: false
    },
    icon: 'Circle',
    category: 'basic'
  },
  {
    id: 'checkbox',
    name: 'Checkboxes',
    type: FeedbackFormFieldDtoTypeEnum.CHECKBOX,
    defaultConfig: {
      label: 'Select Multiple',
      options: ['Option 1', 'Option 2', 'Option 3'],
      required: false
    },
    icon: 'CheckSquare',
    category: 'basic'
  },
  {
    id: 'select',
    name: 'Dropdown',
    type: FeedbackFormFieldDtoTypeEnum.SELECT,
    defaultConfig: {
      label: 'Select Option',
      options: ['Option 1', 'Option 2', 'Option 3'],
      required: false
    },
    icon: 'ChevronDown',
    category: 'advanced'
  },
  {
    id: 'rating',
    name: 'Rating Scale',
    type: FeedbackFormFieldDtoTypeEnum.RATING,
    defaultConfig: {
      label: 'Rate this event',
      maxRating: 5,
      required: false
    },
    icon: 'Star',
    category: 'rating'
  }
]
