// Form builder utilities
export const formBuilderUtils = {
  // Generate unique field ID
  generateFieldId(): string {
    return `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  },

  // Validate field configuration
  validateFieldConfig(field: Record<string, unknown>): { isValid: boolean; errors: string[] } {
    const errors: string[] = []

    if (!field.label || typeof field.label !== 'string' || !field.label.trim()) {
      errors.push('Field label is required')
    }

    if (!field.type) {
      errors.push('Field type is required')
    }

    // Validate options for choice fields
    const choiceTypes = ['radio', 'checkbox', 'select']
    if (choiceTypes.includes(field.type as string) && (!field.options || !Array.isArray(field.options) || field.options.length < 2)) {
      errors.push('Choice fields must have at least 2 options')
    }

    // Validate max rating for rating fields
    if (field.type === 'rating' && (!field.maxRating || typeof field.maxRating !== 'number' || field.maxRating < 2 || field.maxRating > 10)) {
      errors.push('Rating fields must have a max rating between 2 and 10')
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  },

  // Get default field configuration
  getDefaultFieldConfig(type: string): Record<string, unknown> {
    const baseConfig = {
      id: this.generateFieldId(),
      required: false,
      description: ''
    }

    switch (type) {
    case 'text':
      return {
        ...baseConfig,
        label: 'Text Field',
        type: 'text',
        placeholder: 'Enter text...'
      }
    case 'textarea':
      return {
        ...baseConfig,
        label: 'Long Text Field',
        type: 'textarea',
        placeholder: 'Enter detailed response...'
      }
    case 'radio':
      return {
        ...baseConfig,
        label: 'Multiple Choice',
        type: 'radio',
        options: ['Option 1', 'Option 2', 'Option 3']
      }
    case 'checkbox':
      return {
        ...baseConfig,
        label: 'Select Multiple',
        type: 'checkbox',
        options: ['Option 1', 'Option 2', 'Option 3']
      }
    case 'select':
      return {
        ...baseConfig,
        label: 'Select Option',
        type: 'select',
        options: ['Option 1', 'Option 2', 'Option 3']
      }
    case 'rating':
      return {
        ...baseConfig,
        label: 'Rate this event',
        type: 'rating',
        maxRating: 5
      }
    default:
      return baseConfig
    }
  }
}
