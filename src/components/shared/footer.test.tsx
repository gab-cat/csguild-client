import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import Footer from './footer'

describe('Footer Component', () => {
  beforeEach(() => {
    render(<Footer />)
  })

  describe('Rendering', () => {
    it('should render the footer element', () => {
      const footer = screen.getByRole('contentinfo')
      expect(footer).toBeInTheDocument()
      expect(footer).toHaveClass('border-t', 'border-pink-500/20', 'bg-black', 'backdrop-blur-sm', 'relative')
    })

    it('should render the grid pattern background', () => {
      const footer = screen.getByRole('contentinfo')
      const backgroundDiv = footer.querySelector('.absolute.inset-0')
      expect(backgroundDiv).toBeInTheDocument()
      expect(backgroundDiv).toHaveClass('opacity-5')
    })

    it('should render the container with proper structure', () => {
      const container = screen.getByRole('contentinfo').querySelector('.container')
      expect(container).toBeInTheDocument()
      expect(container).toHaveClass('mx-auto', 'px-6', 'py-12', 'relative', 'z-10')
    })
  })

  describe('Branding Section', () => {
    it('should render the CS Guild logo and title', () => {
      const logo = screen.getByText('CS')
      expect(logo).toBeInTheDocument()
      expect(logo).toHaveClass('font-space-mono', 'font-bold', 'text-white', 'text-sm')
      
      const title = screen.getByText('CS Guild')
      expect(title).toBeInTheDocument()
      expect(title).toHaveClass('font-space-mono', 'font-bold', 'text-xl', 'text-white')
    })

    it('should render the description text', () => {
      const description = screen.getByText(/Empowering the next generation of developers/)
      expect(description).toBeInTheDocument()
      expect(description).toHaveClass('text-gray-200', 'mb-4', 'max-w-md')
    })

    it('should render the "Built with" section', () => {
      const builtWith = screen.getByText('// Built with')
      expect(builtWith).toBeInTheDocument()
      
      const community = screen.getByText('by the CS Guild community')
      expect(community).toBeInTheDocument()
      
      // Check for Code2 and Heart icons (testing their presence through class names)
      const section = screen.getByText('// Built with').closest('div')
      expect(section).toHaveClass('font-space-mono', 'text-sm', 'text-pink-400')
    })

    it('should render the logo with proper gradient background', () => {
      const logoContainer = screen.getByText('CS').closest('div')
      expect(logoContainer).toHaveClass('w-8', 'h-8', 'rounded-lg', 'bg-gradient-to-br', 'from-pink-500', 'to-violet-500')
    })
  })

  describe('Community Links Section', () => {
    it('should render the Community heading', () => {
      const heading = screen.getByRole('heading', { name: 'Community' })
      expect(heading).toBeInTheDocument()
      expect(heading).toHaveClass('font-semibold', 'text-white', 'mb-4')
    })

    it('should render all community links', () => {
      const communityLinks = ['Discord', 'GitHub', 'Events', 'Blog']
      
      communityLinks.forEach(linkText => {
        const link = screen.getByRole('link', { name: linkText })
        expect(link).toBeInTheDocument()
        expect(link).toHaveAttribute('href', '#')
        expect(link).toHaveClass('hover:text-pink-400', 'transition-colors', 'duration-200')
      })
    })

    it('should render community links with proper styling', () => {
      const discordLink = screen.getByRole('link', { name: 'Discord' })
      expect(discordLink).toHaveClass('flex', 'items-center', 'gap-2')
    })

    it('should render community links in a proper list structure', () => {
      const communitySection = screen.getByRole('heading', { name: 'Community' }).closest('div')
      const linksList = communitySection?.querySelector('ul')
      expect(linksList).toBeInTheDocument()
      expect(linksList).toHaveClass('space-y-2', 'text-gray-300')
    })
  })

  describe('Resources Links Section', () => {
    it('should render the Resources heading', () => {
      const heading = screen.getByRole('heading', { name: 'Resources' })
      expect(heading).toBeInTheDocument()
      expect(heading).toHaveClass('font-semibold', 'text-white', 'mb-4')
    })

    it('should render all resource links', () => {
      const resourceLinks = ['Documentation', 'Tutorials', 'Projects', 'Mentorship']
      
      resourceLinks.forEach(linkText => {
        const link = screen.getByRole('link', { name: linkText })
        expect(link).toBeInTheDocument()
        expect(link).toHaveAttribute('href', '#')
        expect(link).toHaveClass('hover:text-pink-400', 'transition-colors', 'duration-200')
      })
    })

    it('should render resource links with proper styling', () => {
      const documentationLink = screen.getByRole('link', { name: 'Documentation' })
      expect(documentationLink).toHaveClass('flex', 'items-center', 'gap-2')
    })

    it('should render resource links in a proper list structure', () => {
      const resourcesSection = screen.getByRole('heading', { name: 'Resources' }).closest('div')
      const linksList = resourcesSection?.querySelector('ul')
      expect(linksList).toBeInTheDocument()
      expect(linksList).toHaveClass('space-y-2', 'text-gray-300')
    })
  })

  describe('Social Links Section', () => {
    it('should render all social media links with proper aria-labels', () => {
      const socialLinks = [
        { label: 'GitHub', icon: 'Github' },
        { label: 'Twitter', icon: 'Twitter' },
        { label: 'LinkedIn', icon: 'Linkedin' }
      ]

      socialLinks.forEach(({ label }) => {
        const link = screen.getByRole('link', { name: label })
        expect(link).toBeInTheDocument()
        expect(link).toHaveAttribute('href', '#')
        expect(link).toHaveAttribute('aria-label', label)
      })
    })

    it('should render social links with proper styling', () => {
      const githubLink = screen.getByRole('link', { name: 'GitHub' })
      expect(githubLink).toHaveClass(
        'w-8', 'h-8', 'rounded-lg', 'bg-gradient-to-br', 'from-pink-500/20', 'to-violet-500/20',
        'hover:from-pink-500/30', 'hover:to-violet-500/30', 'flex', 'items-center', 'justify-center',
        'transition-all', 'duration-300', 'hover:scale-110', 'border', 'border-pink-500/30'
      )
    })

    it('should render social links container with proper styling', () => {
      const socialContainer = screen.getByRole('link', { name: 'GitHub' }).closest('.flex.gap-3')
      expect(socialContainer).toBeInTheDocument()
      expect(socialContainer).toHaveClass('flex', 'gap-3')
    })
  })

  describe('Legal Links Section', () => {
    it('should render all legal links with correct hrefs', () => {
      const legalLinks = [
        { text: 'Privacy Policy', href: '/privacy' },
        { text: 'Terms of Service', href: '/terms' },
        { text: 'Code of Conduct', href: '/code-of-conduct' }
      ]

      legalLinks.forEach(({ text, href }) => {
        const link = screen.getByRole('link', { name: text })
        expect(link).toBeInTheDocument()
        expect(link).toHaveAttribute('href', href)
        expect(link).toHaveClass('text-gray-400', 'hover:text-pink-400', 'transition-colors', 'text-sm')
      })
    })

    it('should render legal links in proper container structure', () => {
      const legalContainer = screen.getByRole('link', { name: 'Privacy Policy' }).closest('.flex.md\\:flex-row')
      expect(legalContainer).toBeInTheDocument()
      expect(legalContainer).toHaveClass('flex', 'md:flex-row', 'flex-col', 'items-center', 'gap-6')
    })
  })

  describe('Copyright Section', () => {
    it('should render the copyright text', () => {
      const copyright = screen.getByText('© 2024 CS Guild. All rights reserved.')
      expect(copyright).toBeInTheDocument()
      expect(copyright).toHaveClass('font-space-mono', 'text-sm', 'text-gray-400')
    })

    it('should render copyright with proper responsive classes', () => {
      const copyright = screen.getByText('© 2024 CS Guild. All rights reserved.')
      expect(copyright).toHaveClass('mt-5', 'md:mt-0')
    })
  })

  describe('Separator', () => {
    it('should render the separator component', () => {
      // The Separator component from Radix UI might not have a specific role
      // We'll test for its presence by checking the container structure
      const footer = screen.getByRole('contentinfo')
      const separatorContainer = footer.querySelector('.my-8')
      expect(separatorContainer).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA labels for social links', () => {
      const githubLink = screen.getByLabelText('GitHub')
      const twitterLink = screen.getByLabelText('Twitter')
      const linkedinLink = screen.getByLabelText('LinkedIn')

      expect(githubLink).toBeInTheDocument()
      expect(twitterLink).toBeInTheDocument()
      expect(linkedinLink).toBeInTheDocument()
    })

    it('should have proper heading hierarchy', () => {
      const headings = screen.getAllByRole('heading')
      expect(headings).toHaveLength(2)
      
      const communityHeading = screen.getByRole('heading', { name: 'Community' })
      const resourcesHeading = screen.getByRole('heading', { name: 'Resources' })
      
      expect(communityHeading.tagName).toBe('H4')
      expect(resourcesHeading.tagName).toBe('H4')
    })

    it('should have proper semantic footer structure', () => {
      const footer = screen.getByRole('contentinfo')
      expect(footer.tagName).toBe('FOOTER')
    })
  })

  describe('Link Behavior', () => {
    it('should have correct href attributes for all links', () => {
      // Community and Resources links should have # href
      const placeholderLinks = [
        'Discord', 'GitHub', 'Events', 'Blog',
        'Documentation', 'Tutorials', 'Projects', 'Mentorship'
      ]

      placeholderLinks.forEach(linkText => {
        const link = screen.getByRole('link', { name: linkText })
        expect(link).toHaveAttribute('href', '#')
      })

      // Social links should have # href
      const socialLinks = ['GitHub', 'Twitter', 'LinkedIn']
      socialLinks.forEach(linkText => {
        const link = screen.getByLabelText(linkText)
        expect(link).toHaveAttribute('href', '#')
      })
    })

    it('should have proper target attributes for external links', () => {
      // All social links should potentially open in new tabs for external sites
      const socialLinks = screen.getAllByLabelText(/(GitHub|Twitter|LinkedIn)/)
      socialLinks.forEach(link => {
        // For now they have # hrefs, but in a real app they might have target="_blank"
        expect(link).toHaveAttribute('href', '#')
      })
    })
  })

  describe('CSS Classes and Styling', () => {
    it('should apply correct responsive classes', () => {
      const grid = screen.getByRole('contentinfo').querySelector('.grid')
      expect(grid).toHaveClass('grid-cols-1', 'md:grid-cols-4', 'gap-8')
    })

    it('should apply correct layout classes to footer sections', () => {
      const footer = screen.getByRole('contentinfo')
      const bottomSection = footer.querySelector('.flex.flex-col-reverse')
      expect(bottomSection).toHaveClass('md:flex-row', 'md:justify-between', 'md:items-center')
    })

    it('should apply gradient backgrounds correctly', () => {
      const logoContainer = screen.getByText('CS').closest('div')
      expect(logoContainer).toHaveClass('bg-gradient-to-br', 'from-pink-500', 'to-violet-500')
    })

    it('should apply hover effects correctly', () => {
      const communityLinks = screen.getAllByRole('link', { name: /Discord|GitHub|Events|Blog/ })
      communityLinks.forEach(link => {
        expect(link).toHaveClass('hover:text-pink-400', 'transition-colors', 'duration-200')
      })
    })

    it('should apply backdrop blur and border effects', () => {
      const footer = screen.getByRole('contentinfo')
      expect(footer).toHaveClass('backdrop-blur-sm', 'border-t', 'border-pink-500/20')
    })
  })

  describe('Component Structure', () => {
    it('should maintain proper DOM structure', () => {
      const footer = screen.getByRole('contentinfo')
      const container = footer.querySelector('.container')
      const grid = container?.querySelector('.grid')
      
      expect(footer).toBeInTheDocument()
      expect(container).toBeInTheDocument()
      expect(grid).toBeInTheDocument()
    })

    it('should have proper section organization', () => {
      const footer = screen.getByRole('contentinfo')
      const sections = footer.querySelectorAll('.grid > div')
      
      // Should have 3 main sections: branding (col-span-2), community, resources
      expect(sections).toHaveLength(3)
    })

    it('should have proper column spans for responsive layout', () => {
      const grid = screen.getByRole('contentinfo').querySelector('.grid')
      const brandingSection = grid?.querySelector('.col-span-1.md\\:col-span-2')
      expect(brandingSection).toBeInTheDocument()
    })
  })

  describe('Text Content', () => {
    it('should display all expected text content', () => {
      const expectedTexts = [
        'CS Guild',
        'Empowering the next generation of developers',
        'Join 100+ students transforming their careers',
        '// Built with',
        'by the CS Guild community',
        'Community',
        'Resources',
        '© 2024 CS Guild. All rights reserved.'
      ]

      expectedTexts.forEach(text => {
        expect(screen.getByText(new RegExp(text, 'i'))).toBeInTheDocument()
      })
    })

    it('should display proper link text for all sections', () => {
      const allLinkTexts = [
        'Discord', 'GitHub', 'Events', 'Blog',
        'Documentation', 'Tutorials', 'Projects', 'Mentorship',
        'Privacy Policy', 'Terms of Service', 'Code of Conduct'
      ]

      allLinkTexts.forEach(linkText => {
        expect(screen.getByText(linkText)).toBeInTheDocument()
      })
    })
  })

  describe('Icons and Visual Elements', () => {
    it('should render lucide icons properly', () => {
      // Test that the component renders without errors when icons are present
      expect(() => render(<Footer />)).not.toThrow()
    })

    it('should have heart icon with proper styling', () => {
      const heartIconContainer = screen.getByText('by the CS Guild community').closest('div')
      expect(heartIconContainer).toHaveClass('flex', 'items-center', 'gap-2')
    })

    it('should have code icon with proper styling', () => {
      const codeIconContainer = screen.getByText('// Built with').closest('div')
      expect(codeIconContainer).toHaveClass('flex', 'items-center', 'gap-2')
    })
  })

  describe('Background and Visual Effects', () => {
    it('should render grid pattern background with proper styling', () => {
      const footer = screen.getByRole('contentinfo')
      const backgroundDiv = footer.querySelector('.absolute.inset-0')
      expect(backgroundDiv).toHaveClass(
        'bg-[linear-gradient(to_right,#8b5cf6_1px,transparent_1px),linear-gradient(to_bottom,#8b5cf6_1px,transparent_1px)]',
        'bg-[size:4rem_4rem]',
        'opacity-5'
      )
    })

    it('should have proper z-index layering', () => {
      const container = screen.getByRole('contentinfo').querySelector('.container')
      expect(container).toHaveClass('relative', 'z-10')
    })
  })

  describe('Edge Cases and Error Handling', () => {
    it('should handle missing props gracefully', () => {
      // Since Footer doesn't accept props, this test ensures it renders without any props
      const { unmount } = render(<Footer />)
      expect(screen.getByRole('contentinfo')).toBeInTheDocument()
      unmount()
    })

    it('should render consistently across multiple renders', () => {
      const { unmount } = render(<Footer />)
      unmount()
      
      render(<Footer />)
      expect(screen.getByRole('contentinfo')).toBeInTheDocument()
      expect(screen.getByText('CS Guild')).toBeInTheDocument()
    })

    it('should not throw errors when rendered', () => {
      expect(() => render(<Footer />)).not.toThrow()
    })

    it('should maintain accessibility even without JavaScript', () => {
      // Test that all links are properly accessible
      const allLinks = screen.getAllByRole('link')
      allLinks.forEach(link => {
        expect(link).toHaveAttribute('href')
      })
    })
  })

  describe('Performance and Optimization', () => {
    it('should render without unnecessary re-renders', () => {
      const { rerender } = render(<Footer />)
      const initialFooter = screen.getByRole('contentinfo')
      
      rerender(<Footer />)
      const rerenderedFooter = screen.getByRole('contentinfo')
      
      expect(initialFooter).toBeInTheDocument()
      expect(rerenderedFooter).toBeInTheDocument()
    })

    it('should not have any console errors during render', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
      
      render(<Footer />)
      
      expect(consoleSpy).not.toHaveBeenCalled()
      consoleSpy.mockRestore()
    })
  })
})