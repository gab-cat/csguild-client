export const COURSE_OPTIONS = [
  { value: 'bs-computer-science', label: 'BS Computer Science' },
  { value: 'bs-information-technology', label: 'BS Information Technology' },
  { value: 'bs-information-systems', label: 'BS Information Systems' },
  { value: 'bs-digital-illustration-animation', label: 'BS Digital Illustration and Animation' },
  { value: 'others', label: 'Others' },
] as const

export type CourseOption = typeof COURSE_OPTIONS[number]
