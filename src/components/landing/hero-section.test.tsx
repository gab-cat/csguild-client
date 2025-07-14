import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { HeroSection } from './hero-section'

// Mock the external dependencies
jest.mock('@splinetool/react-spline/next', () => {
  return function MockSpline({ scene, className }: { scene: string; className: string }) {
    return (
      <div 
        data-testid="spline-scene" 
        data-scene={scene} 
        className={className}
        role="img"
        aria-label="3D Robot Scene"
      />
    )
  }
})

jest.mock('lucide-react', () => ({
  ArrowRight: ({ className, ...props }: { className: string }) => (
    <svg 
      data-testid="arrow-right-icon" 
      className={className} 
      {...props}
      role="img"
      aria-label="Arrow Right"
    />
  ),
  Code2: ({ className, ...props }: { className: string }) => (
    <svg 
      data-testid="code2-icon" 
      className={className} 
      {...props}
      role="img"
      aria-label="Code Icon"
    />
  )
}))

jest.mock('@/components/ui/button', () => ({
  Button: ({ children, className, variant, size, onClick, ...props }: any) => (
    <button 
      data-testid="button" 
      className={className}
      data-variant={variant}
      data-size={size}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  )
}))

describe('HeroSection', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks()
  })

  // Basic rendering tests
  describe('Component Rendering', () => {
    test('renders without crashing', () => {
      render(<HeroSection />)
      expect(screen.getByRole('region')).toBeInTheDocument()
    })

    test('renders the main hero section with correct attributes', () => {
      render(<HeroSection />)
      const heroSection = screen.getByRole('region')
      expect(heroSection).toHaveAttribute('id', 'hero')
      expect(heroSection).toHaveClass(
        'relative', 'min-h-screen', 'flex', 'items-center', 
        'justify-center', 'overflow-hidden', 'bg-black'
      )
    })

    test('renders the grid pattern background', () => {
      render(<HeroSection />)
      const { container } = render(<HeroSection />)
      const gridBackground = container.querySelector('.absolute.inset-0')
      expect(gridBackground).toBeInTheDocument()
      expect(gridBackground).toHaveClass('opacity-20')
    })

    test('renders the robot section with correct positioning', () => {
      render(<HeroSection />)
      const robotSection = document.querySelector('#robot-section')
      expect(robotSection).toBeInTheDocument()
      expect(robotSection).toHaveClass(
        'absolute', 'lg:-right-[28vw]', 'xl:-right-[10vw]', 'top-0', 
        'lg:w-full', 'xl:w-[80vw]', 'h-full', 'z-0', 'hidden', 
        'lg:block', 'animate-fade-in-right'
      )
    })
  })

  // Spline 3D component tests
  describe('Spline 3D Robot', () => {
    test('renders Spline component with correct scene URL', () => {
      render(<HeroSection />)
      const splineComponent = screen.getByTestId('spline-scene')
      expect(splineComponent).toBeInTheDocument()
      expect(splineComponent).toHaveAttribute('data-scene', 'https://prod.spline.design/awBSaOn9261Q9L9g/scene.splinecode')
      expect(splineComponent).toHaveClass('w-full', 'h-full')
      expect(splineComponent).toHaveAttribute('role', 'img')
      expect(splineComponent).toHaveAttribute('aria-label', '3D Robot Scene')
    })

    test('renders gradient background for robot section', () => {
      render(<HeroSection />)
      const { container } = render(<HeroSection />)
      const gradientBackground = container.querySelector('.bg-gradient-to-br')
      expect(gradientBackground).toBeInTheDocument()
      expect(gradientBackground).toHaveClass(
        'from-pink-500/20', 'via-violet-500/20', 'to-purple-500/20', 
        'rounded-3xl', 'blur-3xl', 'opacity-30'
      )
    })

    test('robot section is hidden on smaller screens', () => {
      render(<HeroSection />)
      const robotSection = document.querySelector('#robot-section')
      expect(robotSection).toHaveClass('hidden', 'lg:block')
    })
  })

  // Content rendering tests
  describe('Text Content', () => {
    test('renders the welcome badge with correct content', () => {
      render(<HeroSection />)
      const welcomeBadge = screen.getByText('console.log("Welcome to CS Guild");')
      expect(welcomeBadge).toBeInTheDocument()
      expect(welcomeBadge).toHaveClass('font-space-mono', 'text-xs', 'md:text-sm', 'text-pink-300')
    })

    test('renders Code2 icon in the welcome badge', () => {
      render(<HeroSection />)
      const code2Icon = screen.getByTestId('code2-icon')
      expect(code2Icon).toBeInTheDocument()
      expect(code2Icon).toHaveClass('h-4', 'w-4', 'text-pink-400')
      expect(code2Icon).toHaveAttribute('aria-label', 'Code Icon')
    })

    test('renders the main heading with gradient text', () => {
      render(<HeroSection />)
      const mainHeading = screen.getByRole('heading', { level: 1 })
      expect(mainHeading).toBeInTheDocument()
      expect(mainHeading).toHaveClass(
        'text-4xl', 'md:text-6xl', 'lg:text-7xl', 'font-bold', 
        'leading-tight', 'tracking-tighter', 'text-white', 'animate-fade-in-up-delay-400'
      )
    })

    test('renders gradient text spans correctly', () => {
      render(<HeroSection />)
      const codeSpan = screen.getByText('Code')
      const communitySpan = screen.getByText('Community')
      
      expect(codeSpan).toHaveClass(
        'bg-gradient-to-r', 'from-pink-400', 'via-violet-400', 
        'to-purple-400', 'bg-clip-text', 'text-transparent'
      )
      expect(communitySpan).toHaveClass(
        'bg-gradient-to-r', 'from-violet-400', 'via-purple-400', 
        'to-pink-400', 'bg-clip-text', 'text-transparent'
      )
    })

    test('renders the main heading text correctly', () => {
      render(<HeroSection />)
      const heading = screen.getByRole('heading', { level: 1 })
      expect(heading).toHaveTextContent('Where Code Meets Community')
    })

    test('renders the descriptive paragraph with complete text', () => {
      render(<HeroSection />)
      const paragraph = screen.getByText(/Join hundreds of students in the College of Computer Studies/)
      expect(paragraph).toBeInTheDocument()
      expect(paragraph).toHaveClass(
        'text-base', 'md:text-lg', 'text-gray-200', 'max-w-2xl', 
        'leading-relaxed', 'tracking-tight', 'animate-fade-in-up-delay-600'
      )
      expect(paragraph).toHaveTextContent(
        'Join hundreds of students in the College of Computer Studies in the ultimate learning ecosystem. Build projects, share knowledge, and level up your coding journey together with the Computer Studies Guild for United Innovation, Learning and Development (CSGUILD).'
      )
    })

    test('validates all text content is present', () => {
      render(<HeroSection />)
      
      // Check all key text elements are present
      expect(screen.getByText('console.log("Welcome to CS Guild");')).toBeInTheDocument()
      expect(screen.getByText('Where')).toBeInTheDocument()
      expect(screen.getByText('Code')).toBeInTheDocument()
      expect(screen.getByText('Meets')).toBeInTheDocument()
      expect(screen.getByText('Community')).toBeInTheDocument()
      expect(screen.getByText('Start Your Journey')).toBeInTheDocument()
      expect(screen.getByText('Explore Community')).toBeInTheDocument()
      expect(screen.getByText('Scroll to explore')).toBeInTheDocument()
    })
  })

  // Button tests
  describe('Action Buttons', () => {
    test('renders the "Start Your Journey" button with correct styling', () => {
      render(<HeroSection />)
      const buttons = screen.getAllByTestId('button')
      const startButton = buttons.find(button => button.textContent?.includes('Start Your Journey'))
      
      expect(startButton).toBeInTheDocument()
      expect(startButton).toHaveAttribute('data-size', 'lg')
      expect(startButton).toHaveClass(
        'bg-gradient-to-r', 'from-pink-500', 'to-violet-500', 
        'hover:from-pink-600', 'hover:to-violet-600', 'text-white', 
        'font-semibold', 'px-8', 'py-4', 'rounded-xl', 'transition-all', 
        'duration-300', 'transform', 'hover:scale-105', 'shadow-lg', 
        'hover:shadow-xl', 'shadow-pink-500/25'
      )
    })

    test('renders the "Explore Community" button with correct styling', () => {
      render(<HeroSection />)
      const buttons = screen.getAllByTestId('button')
      const exploreButton = buttons.find(button => button.textContent?.includes('Explore Community'))
      
      expect(exploreButton).toBeInTheDocument()
      expect(exploreButton).toHaveAttribute('data-variant', 'outline')
      expect(exploreButton).toHaveAttribute('data-size', 'lg')
      expect(exploreButton).toHaveClass(
        'border-pink-500/50', 'text-pink-300', 'hover:bg-pink-500/10', 
        'px-8', 'py-4', 'rounded-xl', 'bg-black/30', 'backdrop-blur-sm', 
        'hover:border-pink-400', 'transition-all', 'duration-300'
      )
    })

    test('renders ArrowRight icon in the Start Your Journey button', () => {
      render(<HeroSection />)
      const arrowIcon = screen.getByTestId('arrow-right-icon')
      expect(arrowIcon).toBeInTheDocument()
      expect(arrowIcon).toHaveClass('ml-2', 'h-5', 'w-5')
      expect(arrowIcon).toHaveAttribute('aria-label', 'Arrow Right')
    })

    test('renders both buttons in the same container', () => {
      render(<HeroSection />)
      const buttons = screen.getAllByTestId('button')
      expect(buttons).toHaveLength(2)
      
      const buttonContainer = buttons[0].parentElement
      expect(buttonContainer).toHaveClass(
        'flex', 'flex-col', 'justify-center', 'md:justify-start', 
        'sm:flex-row', 'gap-4', 'animate-fade-in-up-delay-800'
      )
    })

    test('buttons are clickable and accessible', () => {
      render(<HeroSection />)
      const buttons = screen.getAllByTestId('button')
      
      buttons.forEach(button => {
        expect(button).toBeEnabled()
        expect(button.tagName).toBe('BUTTON')
        
        // Test button interaction
        fireEvent.click(button)
        // Since no onClick handlers are defined, we just ensure no errors occur
      })
    })
  })

  // Scroll indicator tests
  describe('Scroll Indicator', () => {
    test('renders the scroll indicator with correct positioning', () => {
      render(<HeroSection />)
      const scrollIndicator = screen.getByText('Scroll to explore')
      expect(scrollIndicator).toBeInTheDocument()
      expect(scrollIndicator).toHaveClass('text-sm', 'font-space-mono')
      
      const scrollContainer = scrollIndicator.closest('.absolute')
      expect(scrollContainer).toHaveClass(
        'bottom-8', 'left-1/2', 'transform', '-translate-x-1/2', 
        'z-10', 'animate-fade-in-up-delay-1500'
      )
    })

    test('renders the scroll indicator animation elements', () => {
      render(<HeroSection />)
      const { container } = render(<HeroSection />)
      
      // Check for the animated dot
      const animationElement = container.querySelector('.animate-bounce-slow')
      expect(animationElement).toBeInTheDocument()
      expect(animationElement).toHaveClass(
        'w-1', 'h-3', 'bg-gradient-to-b', 'from-pink-400', 
        'to-violet-400', 'rounded-full', 'mt-2'
      )
    })

    test('renders the scroll indicator border container', () => {
      render(<HeroSection />)
      const { container } = render(<HeroSection />)
      
      const borderContainer = container.querySelector('.border-pink-500')
      expect(borderContainer).toBeInTheDocument()
      expect(borderContainer).toHaveClass(
        'w-6', 'h-10', 'border-2', 'rounded-full', 'flex', 'justify-center'
      )
    })
  })

  // Layout and responsive tests
  describe('Layout and Responsive Design', () => {
    test('renders container with correct layout classes', () => {
      render(<HeroSection />)
      const { container } = render(<HeroSection />)
      
      const mainContainer = container.querySelector('.container')
      expect(mainContainer).toBeInTheDocument()
      expect(mainContainer).toHaveClass(
        'text-center', 'md:text-left', 'mx-auto', 'px-6', 'relative', 'z-10'
      )
    })

    test('renders content wrapper with correct flex layout', () => {
      render(<HeroSection />)
      const { container } = render(<HeroSection />)
      
      const flexContainer = container.querySelector('.flex.items-center.min-h-screen')
      expect(flexContainer).toBeInTheDocument()
    })

    test('renders text content with responsive width classes', () => {
      render(<HeroSection />)
      const { container } = render(<HeroSection />)
      
      const textContent = container.querySelector('.w-full.lg\\:w-3\\/5')
      expect(textContent).toBeInTheDocument()
      expect(textContent).toHaveClass('space-y-8', 'mb-auto', 'mt-12', 'md:mt-32')
    })

    test('validates responsive breakpoint classes', () => {
      render(<HeroSection />)
      
      // Check for responsive text classes
      const heading = screen.getByRole('heading', { level: 1 })
      expect(heading).toHaveClass('text-4xl', 'md:text-6xl', 'lg:text-7xl')
      
      // Check for responsive badge text
      const badge = screen.getByText('console.log("Welcome to CS Guild");')
      expect(badge).toHaveClass('text-xs', 'md:text-sm')
    })
  })

  // Animation classes tests
  describe('Animation Classes', () => {
    test('applies correct animation classes to elements', () => {
      render(<HeroSection />)
      const { container } = render(<HeroSection />)
      
      // Check welcome badge animation
      const welcomeBadge = container.querySelector('.animate-fade-in-up-delay-200')
      expect(welcomeBadge).toBeInTheDocument()
      
      // Check heading animation
      const heading = screen.getByRole('heading', { level: 1 })
      expect(heading).toHaveClass('animate-fade-in-up-delay-400')
      
      // Check paragraph animation
      const paragraph = screen.getByText(/Join hundreds of students/)
      expect(paragraph).toHaveClass('animate-fade-in-up-delay-600')
      
      // Check button container animation
      const buttonContainer = container.querySelector('.animate-fade-in-up-delay-800')
      expect(buttonContainer).toBeInTheDocument()
      
      // Check robot section animation
      const robotSection = container.querySelector('#robot-section')
      expect(robotSection).toHaveClass('animate-fade-in-right')
      
      // Check scroll indicator animation
      const scrollIndicator = container.querySelector('.animate-fade-in-up-delay-1500')
      expect(scrollIndicator).toBeInTheDocument()
    })

    test('validates animation timing sequence', () => {
      render(<HeroSection />)
      const { container } = render(<HeroSection />)
      
      // Verify animation delays are in correct order
      const animations = [
        '.animate-fade-in-up-delay-200',
        '.animate-fade-in-up-delay-400', 
        '.animate-fade-in-up-delay-600',
        '.animate-fade-in-up-delay-800',
        '.animate-fade-in-up-delay-1500'
      ]
      
      animations.forEach(selector => {
        const element = container.querySelector(selector)
        expect(element).toBeInTheDocument()
      })
    })
  })

  // Edge cases and accessibility tests
  describe('Edge Cases and Accessibility', () => {
    test('renders with proper semantic HTML structure', () => {
      render(<HeroSection />)
      const section = screen.getByRole('region')
      expect(section.tagName).toBe('SECTION')
      expect(section).toHaveAttribute('id', 'hero')
      
      const heading = screen.getByRole('heading', { level: 1 })
      expect(heading.tagName).toBe('H1')
    })

    test('renders buttons with proper accessibility attributes', () => {
      render(<HeroSection />)
      const buttons = screen.getAllByTestId('button')
      
      buttons.forEach(button => {
        expect(button.tagName).toBe('BUTTON')
        expect(button).toBeEnabled()
        expect(button).toBeVisible()
      })
    })

    test('handles missing or undefined props gracefully', () => {
      // Test component renders without props
      expect(() => render(<HeroSection />)).not.toThrow()
    })

    test('maintains proper z-index layering', () => {
      render(<HeroSection />)
      const { container } = render(<HeroSection />)
      
      const robotSection = container.querySelector('#robot-section')
      expect(robotSection).toHaveClass('z-0')
      
      const mainContainer = container.querySelector('.container')
      expect(mainContainer).toHaveClass('z-10')
      
      const scrollIndicator = container.querySelector('.animate-fade-in-up-delay-1500')
      expect(scrollIndicator).toHaveClass('z-10')
    })

    test('ensures proper color contrast and accessibility', () => {
      render(<HeroSection />)
      
      // Check text colors for accessibility
      const heading = screen.getByRole('heading', { level: 1 })
      expect(heading).toHaveClass('text-white')
      
      const paragraph = screen.getByText(/Join hundreds of students/)
      expect(paragraph).toHaveClass('text-gray-200')
      
      const badge = screen.getByText('console.log("Welcome to CS Guild");')
      expect(badge).toHaveClass('text-pink-300')
    })
  })

  // CSS class validation tests
  describe('CSS Class Validation', () => {
    test('applies correct gradient classes', () => {
      render(<HeroSection />)
      const { container } = render(<HeroSection />)
      
      // Check welcome badge gradient
      const welcomeBadge = container.querySelector('.bg-gradient-to-r')
      expect(welcomeBadge).toBeInTheDocument()
      
      // Check text gradient classes
      const codeSpan = screen.getByText('Code')
      expect(codeSpan).toHaveClass('bg-gradient-to-r', 'bg-clip-text', 'text-transparent')
    })

    test('applies correct backdrop blur classes', () => {
      render(<HeroSection />)
      const { container } = render(<HeroSection />)
      
      const backdropBlurElements = container.querySelectorAll('.backdrop-blur-sm')
      expect(backdropBlurElements.length).toBeGreaterThan(0)
    })

    test('applies correct border classes', () => {
      render(<HeroSection />)
      const { container } = render(<HeroSection />)
      
      const borderElements = container.querySelectorAll('[class*="border-pink-500"]')
      expect(borderElements.length).toBeGreaterThan(0)
    })

    test('validates shadow classes', () => {
      render(<HeroSection />)
      const buttons = screen.getAllByTestId('button')
      const startButton = buttons.find(button => button.textContent?.includes('Start Your Journey'))
      
      expect(startButton).toHaveClass('shadow-lg', 'hover:shadow-xl', 'shadow-pink-500/25')
    })
  })

  // Performance and optimization tests
  describe('Performance Considerations', () => {
    test('uses efficient CSS classes for animations', () => {
      render(<HeroSection />)
      const { container } = render(<HeroSection />)
      
      // Check for transform classes that are GPU-accelerated
      const animatedElements = container.querySelectorAll('[class*="animate-"]')
      expect(animatedElements.length).toBeGreaterThan(0)
    })

    test('applies proper overflow handling', () => {
      render(<HeroSection />)
      const section = screen.getByRole('region')
      expect(section).toHaveClass('overflow-hidden')
    })

    test('uses efficient positioning classes', () => {
      render(<HeroSection />)
      const { container } = render(<HeroSection />)
      
      const absoluteElements = container.querySelectorAll('.absolute')
      expect(absoluteElements.length).toBeGreaterThan(0)
      
      const relativeElements = container.querySelectorAll('.relative')
      expect(relativeElements.length).toBeGreaterThan(0)
    })
  })
})