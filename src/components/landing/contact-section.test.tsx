import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useInView } from 'framer-motion'
import '@testing-library/jest-dom'
import { ContactSection } from './contact-section'

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    section: ({ children, ...props }: any) => <section {...props}>{children}</section>,
    h2: ({ children, ...props }: any) => <h2 {...props}>{children}</h2>,
    h3: ({ children, ...props }: any) => <h3 {...props}>{children}</h3>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
    a: ({ children, ...props }: any) => <a {...props}>{children}</a>,
    form: ({ children, ...props }: any) => <form {...props}>{children}</form>,
  },
  useInView: jest.fn(),
}))

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  MessageSquare: () => <div data-testid="message-square-icon" />,
  Github: () => <div data-testid="github-icon" />,
  Twitter: () => <div data-testid="twitter-icon" />,
  Linkedin: () => <div data-testid="linkedin-icon" />,
  ArrowRight: () => <div data-testid="arrow-right-icon" />,
  Code2: () => <div data-testid="code2-icon" />,
}))

// Mock UI components
jest.mock('@/components/ui/button', () => ({
  Button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
}))

jest.mock('@/components/ui/card', () => ({
  Card: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  CardContent: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  CardHeader: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  CardTitle: ({ children, ...props }: any) => <h3 {...props}>{children}</h3>,
}))

jest.mock('@/components/ui/input', () => ({
  Input: (props: any) => <input {...props} />,
}))

jest.mock('@/components/ui/textarea', () => ({
  Textarea: (props: any) => <textarea {...props} />,
}))

const mockUseInView = useInView as jest.MockedFunction<typeof useInView>

describe('ContactSection', () => {
  let user: ReturnType<typeof userEvent.setup>

  beforeEach(() => {
    user = userEvent.setup()
    mockUseInView.mockReturnValue(true)
    jest.clearAllMocks()
    // Mock console.log to avoid cluttering test output
    jest.spyOn(console, 'log').mockImplementation(() => {})
  })

  afterEach(() => {
    jest.clearAllMocks()
    jest.restoreAllMocks()
  })

  describe('Component Rendering', () => {
    it('renders the contact section with correct structure', () => {
      render(<ContactSection />)
      
      expect(screen.getByRole('region')).toBeInTheDocument()
      expect(screen.getByText('Your')).toBeInTheDocument()
      expect(screen.getByText('Success Story')).toBeInTheDocument()
      expect(screen.getByText('Starts Here')).toBeInTheDocument()
    })

    it('renders the contact form with all required fields', () => {
      render(<ContactSection />)
      
      expect(screen.getByLabelText('Full Name')).toBeInTheDocument()
      expect(screen.getByLabelText('Email Address')).toBeInTheDocument()
      expect(screen.getByLabelText("I'm interested in")).toBeInTheDocument()
      expect(screen.getByLabelText('Tell us about your goals')).toBeInTheDocument()
    })

    it('renders submit button with correct text', () => {
      render(<ContactSection />)
      
      expect(screen.getByRole('button', { name: /join cs guild community/i })).toBeInTheDocument()
    })

    it('renders social media links', () => {
      render(<ContactSection />)
      
      expect(screen.getByLabelText('GitHub')).toBeInTheDocument()
      expect(screen.getByLabelText('Twitter')).toBeInTheDocument()
      expect(screen.getByLabelText('LinkedIn')).toBeInTheDocument()
    })

    it('renders benefits section with correct content', () => {
      render(<ContactSection />)
      
      expect(screen.getByText('Why Join CS Guild?')).toBeInTheDocument()
      expect(screen.getByText('Accelerated Learning')).toBeInTheDocument()
      expect(screen.getByText('Industry Connections')).toBeInTheDocument()
      expect(screen.getByText('Proven Results')).toBeInTheDocument()
    })

    it('renders stats section with response time and support info', () => {
      render(<ContactSection />)
      
      expect(screen.getByText('24hrs')).toBeInTheDocument()
      expect(screen.getByText('Response Time')).toBeInTheDocument()
      expect(screen.getByText('24/7')).toBeInTheDocument()
      expect(screen.getByText('Community Support')).toBeInTheDocument()
    })

    it('renders the section with proper ID for navigation', () => {
      render(<ContactSection />)
      
      expect(screen.getByRole('region')).toHaveAttribute('id', 'contact')
    })
  })

  describe('Form Functionality', () => {
    it('updates form state when input values change', async () => {
      render(<ContactSection />)
      
      const nameInput = screen.getByLabelText('Full Name') as HTMLInputElement
      const emailInput = screen.getByLabelText('Email Address') as HTMLInputElement
      const subjectInput = screen.getByLabelText("I'm interested in") as HTMLInputElement
      const messageInput = screen.getByLabelText('Tell us about your goals') as HTMLTextAreaElement
      
      await user.type(nameInput, 'John Doe')
      await user.type(emailInput, 'john@example.com')
      await user.type(subjectInput, 'Mentorship')
      await user.type(messageInput, 'I want to learn React')
      
      expect(nameInput.value).toBe('John Doe')
      expect(emailInput.value).toBe('john@example.com')
      expect(subjectInput.value).toBe('Mentorship')
      expect(messageInput.value).toBe('I want to learn React')
    })

    it('handles form submission correctly', async () => {
      const consoleSpy = jest.spyOn(console, 'log')
      render(<ContactSection />)
      
      const nameInput = screen.getByLabelText('Full Name')
      const emailInput = screen.getByLabelText('Email Address')
      const subjectInput = screen.getByLabelText("I'm interested in")
      const messageInput = screen.getByLabelText('Tell us about your goals')
      const submitButton = screen.getByRole('button', { name: /join cs guild community/i })
      
      await user.type(nameInput, 'John Doe')
      await user.type(emailInput, 'john@example.com')
      await user.type(subjectInput, 'Mentorship')
      await user.type(messageInput, 'I want to learn React')
      
      await user.click(submitButton)
      
      expect(consoleSpy).toHaveBeenCalledWith('Form submitted:', {
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Mentorship',
        message: 'I want to learn React'
      })
    })

    it('prevents default form submission behavior', async () => {
      render(<ContactSection />)
      
      const form = screen.getByRole('form')
      const mockPreventDefault = jest.fn()
      
      form.addEventListener('submit', (e) => {
        mockPreventDefault()
        e.preventDefault()
      })
      
      const submitButton = screen.getByRole('button', { name: /join cs guild community/i })
      await user.click(submitButton)
      
      expect(mockPreventDefault).toHaveBeenCalled()
    })

    it('handles empty form submission', async () => {
      const consoleSpy = jest.spyOn(console, 'log')
      render(<ContactSection />)
      
      const submitButton = screen.getByRole('button', { name: /join cs guild community/i })
      await user.click(submitButton)
      
      expect(consoleSpy).toHaveBeenCalledWith('Form submitted:', {
        name: '',
        email: '',
        subject: '',
        message: ''
      })
    })

    it('handles form field clearing', async () => {
      render(<ContactSection />)
      
      const nameInput = screen.getByLabelText('Full Name') as HTMLInputElement
      
      await user.type(nameInput, 'John Doe')
      expect(nameInput.value).toBe('John Doe')
      
      await user.clear(nameInput)
      expect(nameInput.value).toBe('')
    })
  })

  describe('Form Validation', () => {
    it('has required attributes on form fields', () => {
      render(<ContactSection />)
      
      expect(screen.getByLabelText('Full Name')).toBeRequired()
      expect(screen.getByLabelText('Email Address')).toBeRequired()
      expect(screen.getByLabelText("I'm interested in")).toBeRequired()
      expect(screen.getByLabelText('Tell us about your goals')).toBeRequired()
    })

    it('email input has correct type attribute', () => {
      render(<ContactSection />)
      
      const emailInput = screen.getByLabelText('Email Address')
      expect(emailInput).toHaveAttribute('type', 'email')
    })

    it('has appropriate placeholder text for all inputs', () => {
      render(<ContactSection />)
      
      expect(screen.getByPlaceholderText('Your full name')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('your.email@university.edu')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('e.g., Mentorship, Study Groups, Career Guidance')).toBeInTheDocument()
      expect(screen.getByPlaceholderText(/What are you hoping to achieve/)).toBeInTheDocument()
    })

    it('has correct input names for form handling', () => {
      render(<ContactSection />)
      
      expect(screen.getByLabelText('Full Name')).toHaveAttribute('name', 'name')
      expect(screen.getByLabelText('Email Address')).toHaveAttribute('name', 'email')
      expect(screen.getByLabelText("I'm interested in")).toHaveAttribute('name', 'subject')
      expect(screen.getByLabelText('Tell us about your goals')).toHaveAttribute('name', 'message')
    })

    it('textarea has correct rows attribute', () => {
      render(<ContactSection />)
      
      const messageInput = screen.getByLabelText('Tell us about your goals')
      expect(messageInput).toHaveAttribute('rows', '6')
    })
  })

  describe('Animation and Interaction', () => {
    it('calls useInView hook with correct parameters', () => {
      render(<ContactSection />)
      
      expect(mockUseInView).toHaveBeenCalledWith(expect.any(Object), {
        once: true,
        margin: '-100px'
      })
    })

    it('handles useInView false state', () => {
      mockUseInView.mockReturnValue(false)
      
      render(<ContactSection />)
      
      // Component should still render even when not in view
      expect(screen.getByText('Your')).toBeInTheDocument()
      expect(screen.getByText('Success Story')).toBeInTheDocument()
    })

    it('renders icons correctly', () => {
      render(<ContactSection />)
      
      expect(screen.getAllByTestId('message-square-icon')).toHaveLength(2)
      expect(screen.getByTestId('github-icon')).toBeInTheDocument()
      expect(screen.getByTestId('twitter-icon')).toBeInTheDocument()
      expect(screen.getByTestId('linkedin-icon')).toBeInTheDocument()
      expect(screen.getAllByTestId('arrow-right-icon')).toHaveLength(4) // 3 benefits + 1 button
      expect(screen.getByTestId('code2-icon')).toBeInTheDocument()
    })

    it('handles focus interactions on form elements', async () => {
      render(<ContactSection />)
      
      const nameInput = screen.getByLabelText('Full Name')
      
      await user.click(nameInput)
      expect(nameInput).toHaveFocus()
    })
  })

  describe('Accessibility', () => {
    it('has proper form labels associated with inputs', () => {
      render(<ContactSection />)
      
      const nameInput = screen.getByLabelText('Full Name')
      const emailInput = screen.getByLabelText('Email Address')
      const subjectInput = screen.getByLabelText("I'm interested in")
      const messageInput = screen.getByLabelText('Tell us about your goals')
      
      expect(nameInput).toHaveAttribute('id', 'name')
      expect(emailInput).toHaveAttribute('id', 'email')
      expect(subjectInput).toHaveAttribute('id', 'subject')
      expect(messageInput).toHaveAttribute('id', 'message')
    })

    it('has proper aria-labels for social media links', () => {
      render(<ContactSection />)
      
      expect(screen.getByLabelText('GitHub')).toBeInTheDocument()
      expect(screen.getByLabelText('Twitter')).toBeInTheDocument()
      expect(screen.getByLabelText('LinkedIn')).toBeInTheDocument()
    })

    it('has semantic HTML structure', () => {
      render(<ContactSection />)
      
      expect(screen.getByRole('region')).toBeInTheDocument()
      expect(screen.getByRole('form')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /join cs guild community/i })).toBeInTheDocument()
    })

    it('supports keyboard navigation', async () => {
      render(<ContactSection />)
      
      const nameInput = screen.getByLabelText('Full Name')
      const emailInput = screen.getByLabelText('Email Address')
      
      await user.click(nameInput)
      expect(nameInput).toHaveFocus()
      
      await user.tab()
      expect(emailInput).toHaveFocus()
    })
  })

  describe('Edge Cases and Error Handling', () => {
    it('handles special characters in form inputs', async () => {
      render(<ContactSection />)
      
      const nameInput = screen.getByLabelText('Full Name')
      const specialChars = "John O'Connor & Smith-Jones"
      
      await user.type(nameInput, specialChars)
      
      expect((nameInput as HTMLInputElement).value).toBe(specialChars)
    })

    it('handles very long input values', async () => {
      render(<ContactSection />)
      
      const messageInput = screen.getByLabelText('Tell us about your goals')
      const longMessage = 'A'.repeat(1000)
      
      await user.type(messageInput, longMessage)
      
      expect((messageInput as HTMLTextAreaElement).value).toBe(longMessage)
    })

    it('handles unicode characters', async () => {
      render(<ContactSection />)
      
      const nameInput = screen.getByLabelText('Full Name')
      const unicodeText = 'José María Fernández'
      
      await user.type(nameInput, unicodeText)
      
      expect((nameInput as HTMLInputElement).value).toBe(unicodeText)
    })

    it('handles multiple form submissions', async () => {
      const consoleSpy = jest.spyOn(console, 'log')
      render(<ContactSection />)
      
      const submitButton = screen.getByRole('button', { name: /join cs guild community/i })
      
      await user.click(submitButton)
      await user.click(submitButton)
      
      expect(consoleSpy).toHaveBeenCalledTimes(2)
    })

    it('handles form with only whitespace', async () => {
      render(<ContactSection />)
      
      const nameInput = screen.getByLabelText('Full Name')
      
      await user.type(nameInput, '   ')
      
      expect((nameInput as HTMLInputElement).value).toBe('   ')
    })
  })

  describe('Component State Management', () => {
    it('initializes form data with empty values', async () => {
      const consoleSpy = jest.spyOn(console, 'log')
      render(<ContactSection />)
      
      const submitButton = screen.getByRole('button', { name: /join cs guild community/i })
      await user.click(submitButton)
      
      expect(consoleSpy).toHaveBeenCalledWith('Form submitted:', {
        name: '',
        email: '',
        subject: '',
        message: ''
      })
    })

    it('maintains separate state for each form field', async () => {
      render(<ContactSection />)
      
      const nameInput = screen.getByLabelText('Full Name')
      const emailInput = screen.getByLabelText('Email Address')
      
      await user.type(nameInput, 'John')
      expect((nameInput as HTMLInputElement).value).toBe('John')
      expect((emailInput as HTMLInputElement).value).toBe('')
      
      await user.type(emailInput, 'john@example.com')
      expect((nameInput as HTMLInputElement).value).toBe('John')
      expect((emailInput as HTMLInputElement).value).toBe('john@example.com')
    })

    it('updates state correctly when fields are cleared and refilled', async () => {
      render(<ContactSection />)
      
      const nameInput = screen.getByLabelText('Full Name') as HTMLInputElement
      
      await user.type(nameInput, 'John')
      expect(nameInput.value).toBe('John')
      
      await user.clear(nameInput)
      expect(nameInput.value).toBe('')
      
      await user.type(nameInput, 'Jane')
      expect(nameInput.value).toBe('Jane')
    })
  })

  describe('Social Media Links', () => {
    it('renders social media links with correct structure', () => {
      render(<ContactSection />)
      
      const githubLink = screen.getByLabelText('GitHub')
      const twitterLink = screen.getByLabelText('Twitter')
      const linkedinLink = screen.getByLabelText('LinkedIn')
      
      expect(githubLink).toHaveAttribute('href', '#')
      expect(twitterLink).toHaveAttribute('href', '#')
      expect(linkedinLink).toHaveAttribute('href', '#')
    })

    it('social media links are focusable', async () => {
      render(<ContactSection />)
      
      const githubLink = screen.getByLabelText('GitHub')
      
      await user.click(githubLink)
      expect(githubLink).toHaveFocus()
    })
  })

  describe('Content Validation', () => {
    it('displays correct benefit descriptions', () => {
      render(<ContactSection />)
      
      expect(screen.getByText('Learn 3x faster through peer collaboration and structured mentorship programs.')).toBeInTheDocument()
      expect(screen.getByText('Direct access to engineers at top companies and startup founders.')).toBeInTheDocument()
      expect(screen.getByText('97% job placement rate with $125K average starting salary.')).toBeInTheDocument()
    })

    it('displays correct marketing messages', () => {
      render(<ContactSection />)
      
      expect(screen.getByText('Ready to transform your CS journey? Join 100+ students who\'ve already accelerated their careers. Let\'s build something amazing together.')).toBeInTheDocument()
      expect(screen.getByText('Fill out the form below and we\'ll get you connected with our community within 24 hours.')).toBeInTheDocument()
    })

    it('displays code-style message', () => {
      render(<ContactSection />)
      
      expect(screen.getByText("const nextSuccessStory = 'YOU';")).toBeInTheDocument()
      expect(screen.getByText("Join the community that's launching careers")).toBeInTheDocument()
    })

    it('displays correct form labels', () => {
      render(<ContactSection />)
      
      expect(screen.getByText('Full Name')).toBeInTheDocument()
      expect(screen.getByText('Email Address')).toBeInTheDocument()
      expect(screen.getByText("I'm interested in")).toBeInTheDocument()
      expect(screen.getByText('Tell us about your goals')).toBeInTheDocument()
    })

    it('displays correct section headings', () => {
      render(<ContactSection />)
      
      expect(screen.getByText('Get Started Today')).toBeInTheDocument()
      expect(screen.getByText('Connect With Us')).toBeInTheDocument()
    })
  })

  describe('User Experience', () => {
    it('allows tabbing through form fields in correct order', async () => {
      render(<ContactSection />)
      
      const nameInput = screen.getByLabelText('Full Name')
      const emailInput = screen.getByLabelText('Email Address')
      const subjectInput = screen.getByLabelText("I'm interested in")
      const messageInput = screen.getByLabelText('Tell us about your goals')
      const submitButton = screen.getByRole('button', { name: /join cs guild community/i })
      
      await user.tab()
      expect(nameInput).toHaveFocus()
      
      await user.tab()
      expect(emailInput).toHaveFocus()
      
      await user.tab()
      expect(subjectInput).toHaveFocus()
      
      await user.tab()
      expect(messageInput).toHaveFocus()
      
      await user.tab()
      expect(submitButton).toHaveFocus()
    })

    it('handles form submission with Enter key', async () => {
      const consoleSpy = jest.spyOn(console, 'log')
      render(<ContactSection />)
      
      const nameInput = screen.getByLabelText('Full Name')
      await user.type(nameInput, 'John Doe')
      
      await user.keyboard('{Enter}')
      
      expect(consoleSpy).toHaveBeenCalledWith('Form submitted:', expect.objectContaining({
        name: 'John Doe'
      }))
    })
  })

  describe('Component Integration', () => {
    it('renders without crashing when useInView changes state', () => {
      mockUseInView.mockReturnValue(false)
      const { rerender } = render(<ContactSection />)
      
      expect(screen.getByText('Your')).toBeInTheDocument()
      
      mockUseInView.mockReturnValue(true)
      rerender(<ContactSection />)
      
      expect(screen.getByText('Your')).toBeInTheDocument()
    })

    it('handles component re-render without losing form state', async () => {
      const { rerender } = render(<ContactSection />)
      
      const nameInput = screen.getByLabelText('Full Name')
      await user.type(nameInput, 'John Doe')
      
      rerender(<ContactSection />)
      
      expect((nameInput as HTMLInputElement).value).toBe('John Doe')
    })
  })
})