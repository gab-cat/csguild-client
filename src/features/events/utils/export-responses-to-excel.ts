import * as XLSX from 'xlsx'

import type { 
  FeedbackResponseDto, 
  EventFeedbackResponsesDtoForm,
  EventDetailResponseDto 
} from '@generated/api-client'

interface ExportData {
  responses: FeedbackResponseDto[]
  form?: EventFeedbackResponsesDtoForm
  event?: EventDetailResponseDto
}

export function exportResponsesToExcel({ responses, form, event }: ExportData) {
  if (!responses || responses.length === 0) {
    throw new Error('No responses to export')
  }

  // Create headers for the Excel sheet
  const headers = [
    'Response ID',
    'Username',
    'First Name',
    'Last Name',
    'Email',
    'Submission Date',
    'Submission Time',
    'Total Responses Count',
    'Attendee Duration (hours)',
    'Is Eligible',
  ]

  // Add form field headers
  const fieldHeaders: string[] = []
  const fieldIds: string[] = []

  if (form?.fields) {
    form.fields.forEach(field => {
      fieldHeaders.push(field.label || field.id)
      fieldIds.push(field.id)
    })
  } else {
    // If no form data, extract field IDs from responses
    const allFieldIds = new Set<string>()
    responses.forEach(response => {
      Object.keys(response.responses || {}).forEach(fieldId => {
        allFieldIds.add(fieldId)
      })
    })
    allFieldIds.forEach(fieldId => {
      fieldHeaders.push(fieldId)
      fieldIds.push(fieldId)
    })
  }

  // Combine all headers
  const allHeaders = [...headers, ...fieldHeaders]

  // Format response value for Excel
  const formatResponseValue = (value: unknown): string => {
    if (value === null || value === undefined) return ''
    if (typeof value === 'boolean') return value ? 'Yes' : 'No'
    if (Array.isArray(value)) return value.join(', ')
    return String(value)
  }

  // Convert responses to rows
  const rows = responses.map(response => {
    const submissionDate = new Date(response.submittedAt)
    
    // Basic user and response info
    const baseRow = [
      response.id,
      response.user.username,
      typeof response.user.firstName === 'string' ? response.user.firstName : '',
      typeof response.user.lastName === 'string' ? response.user.lastName : '',
      response.user.email,
      submissionDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }),
      submissionDate.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }),
      Object.keys(response.responses || {}).length,
      response.attendee?.totalDuration || 0,
      response.attendee?.isEligible ? 'Yes' : 'No',
    ]

    // Add field responses
    const fieldResponses = fieldIds.map(fieldId => {
      const responseData = response.responses as Record<string, unknown> || {}
      const value = responseData[fieldId]
      return formatResponseValue(value)
    })

    return [...baseRow, ...fieldResponses]
  })

  // Create worksheet
  const worksheet = XLSX.utils.aoa_to_sheet([allHeaders, ...rows])

  // Set column widths for better readability
  const columnWidths = [
    { wch: 30 }, // Response ID
    { wch: 15 }, // Username
    { wch: 15 }, // First Name
    { wch: 15 }, // Last Name
    { wch: 25 }, // Email
    { wch: 12 }, // Submission Date
    { wch: 12 }, // Submission Time
    { wch: 8 },  // Response Count
    { wch: 12 }, // Duration
    { wch: 10 }, // Is Eligible
    ...fieldHeaders.map(() => ({ wch: 20 })) // Form fields
  ]

  worksheet['!cols'] = columnWidths

  // Style the header row
  const headerRange = XLSX.utils.decode_range(worksheet['!ref'] || 'A1')
  for (let col = headerRange.s.c; col <= headerRange.e.c; col++) {
    const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col })
    if (!worksheet[cellAddress]) continue
    
    worksheet[cellAddress].s = {
      font: { bold: true },
      fill: { fgColor: { rgb: 'E6E6FA' } },
      border: {
        top: { style: 'thin' },
        bottom: { style: 'thin' },
        left: { style: 'thin' },
        right: { style: 'thin' }
      }
    }
  }

  // Create workbook
  const workbook = XLSX.utils.book_new()
  const sheetName = 'Event Feedback Responses'
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)

  // Add metadata sheet
  const metadataSheet = XLSX.utils.aoa_to_sheet([
    ['Event Feedback Export'],
    [''],
    ['Event Title', event?.title || 'Unknown Event'],
    ['Export Date', new Date().toLocaleString()],
    ['Total Responses', responses.length],
    ['Total Attendees', responses.length], // This might need to be passed separately
    [''],
    ['Form Fields:'],
    ...fieldHeaders.map((header, index) => [`Field ${index + 1}`, header])
  ])

  XLSX.utils.book_append_sheet(workbook, metadataSheet, 'Export Info')

  // Generate filename
  const eventTitle = event?.title || 'Event'
  const cleanTitle = eventTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()
  const timestamp = new Date().toISOString().slice(0, 10)
  const filename = `${cleanTitle}_feedback_responses_${timestamp}.xlsx`

  // Download the file
  XLSX.writeFile(workbook, filename)

  return {
    filename,
    rowCount: rows.length,
    fieldCount: fieldHeaders.length
  }
}
