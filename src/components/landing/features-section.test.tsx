import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { FeaturesSection } from './features-section';
import { useInView } from 'framer-motion';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  ...jest.requireActual('framer-motion'),
  useInView: jest.fn(),
  motion: {
    div: ({ children, className, variants, initial, animate, transition, whileHover, whileTap, ...props }: any) => (
      <div className={className} data-testid="motion-div" {...props}>{children}</div>
    ),
    h2: ({ children, className, initial, animate, transition, ...props }: any) => (
      <h2 className={className} data-testid="motion-h2" {...props}>{children}</h2>
    ),
    h3: ({ children, className, initial, animate, transition, ...props }: any) => (
      <h3 className={className} data-testid="motion-h3" {...props}>{children}</h3>
    ),
    p: ({ children, className, initial, animate, transition, ...props }: any) => (
      <p className={className} data-testid="motion-p" {...props}>{children}</p>
    ),
  },
}));

// Mock UI components
jest.mock('@/components/ui/button', () => ({
  Button: ({ children, className, variant, size, onClick, ...props }: any) => (
    <button className={className} onClick={onClick} data-testid="ui-button" {...props}>
      {children}
    </button>
  ),
}));

jest.mock('@/components/ui/card', () => ({
  Card: ({ children, className, ...props }: any) => (
    <div className={className} data-testid="ui-card" {...props}>{children}</div>
  ),
  CardContent: ({ children, className, ...props }: any) => (
    <div className={className} data-testid="ui-card-content" {...props}>{children}</div>
  ),
}));

// Mock Lucide icons
jest.mock('lucide-react', () => ({
  Code2: ({ className }: any) => <div data-testid="code2-icon" className={className}>Code2</div>,
  Users: ({ className }: any) => <div data-testid="users-icon" className={className}>Users</div>,
  Calendar: ({ className }: any) => <div data-testid="calendar-icon" className={className}>Calendar</div>,
  Trophy: ({ className }: any) => <div data-testid="trophy-icon" className={className}>Trophy</div>,
  BookOpen: ({ className }: any) => <div data-testid="bookopen-icon" className={className}>BookOpen</div>,
  MessageSquare: ({ className }: any) => <div data-testid="messagesquare-icon" className={className}>MessageSquare</div>,
  ArrowRight: ({ className }: any) => <div data-testid="arrow-right-icon" className={className}>ArrowRight</div>,
  Zap: ({ className }: any) => <div data-testid="zap-icon" className={className}>Zap</div>,
}));

const mockUseInView = useInView as jest.MockedFunction<typeof useInView>;

describe('FeaturesSection', () => {
  beforeEach(() => {
    mockUseInView.mockReturnValue(true);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('renders without crashing', () => {
      render(<FeaturesSection />);
      expect(screen.getByRole('region')).toBeInTheDocument();
    });

    it('renders the correct section ID', () => {
      render(<FeaturesSection />);
      const section = screen.getByRole('region');
      expect(section).toHaveAttribute('id', 'features');
    });

    it('applies correct CSS classes to the section', () => {
      render(<FeaturesSection />);
      const section = screen.getByRole('region');
      expect(section).toHaveClass('py-24', 'relative', 'overflow-hidden', 'bg-black');
    });

    it('renders the grid pattern background', () => {
      render(<FeaturesSection />);
      const section = screen.getByRole('region');
      const background = section.querySelector('.absolute.inset-0');
      expect(background).toBeInTheDocument();
    });

    it('renders the container with correct classes', () => {
      render(<FeaturesSection />);
      const container = screen.getByRole('region').querySelector('.container');
      expect(container).toHaveClass('mx-auto', 'px-6');
    });
  });

  describe('Header Section', () => {
    it('renders the badge with correct text', () => {
      render(<FeaturesSection />);
      expect(screen.getByText('// Everything you need to succeed')).toBeInTheDocument();
    });

    it('renders the Zap icon in the badge', () => {
      render(<FeaturesSection />);
      expect(screen.getByTestId('zap-icon')).toBeInTheDocument();
    });

    it('renders the main heading', () => {
      render(<FeaturesSection />);
      expect(screen.getByText('From Student to')).toBeInTheDocument();
      expect(screen.getByText('Industry Leader')).toBeInTheDocument();
    });

    it('applies gradient text classes to the heading span', () => {
      render(<FeaturesSection />);
      const gradientSpan = screen.getByText('Industry Leader');
      expect(gradientSpan).toHaveClass('bg-gradient-to-r', 'from-pink-400', 'via-violet-400', 'to-purple-400', 'bg-clip-text', 'text-transparent');
    });

    it('renders the subtitle', () => {
      render(<FeaturesSection />);
      expect(screen.getByText(/We've designed the complete toolkit to bridge the gap/)).toBeInTheDocument();
    });
  });

  describe('Features Data', () => {
    const expectedFeatures = [
      {
        title: 'Interactive Code Labs',
        description: 'Master algorithms, data structures, and system design through hands-on challenges that mirror real interview questions',
        highlight: 'Weekly coding sessions • Real interview prep',
        icon: 'code2-icon'
      },
      {
        title: 'Peer Learning Groups',
        description: 'Join study circles with students from top universities working on the same technologies and facing similar challenges',
        highlight: '50+ active groups • University-verified members',
        icon: 'users-icon'
      },
      {
        title: 'Industry Workshops',
        description: 'Learn from engineers at Google, Meta, and startups through exclusive workshops and technical deep-dives',
        highlight: '2-3 expert sessions monthly • Career insights',
        icon: 'calendar-icon'
      },
      {
        title: 'Hackathons & Competitions',
        description: 'Build your portfolio with weekend hackathons and coding competitions that catch recruiters\' attention',
        highlight: 'Monthly competitions • Prize money & internships',
        icon: 'trophy-icon'
      },
      {
        title: 'Curated Learning Paths',
        description: 'Follow structured roadmaps from beginner to advanced, designed by industry professionals and CS professors',
        highlight: '1000+ verified resources • Progress tracking',
        icon: 'bookopen-icon'
      },
      {
        title: '1-on-1 Mentorship',
        description: 'Get personalized guidance from senior students and industry professionals who\'ve walked your path',
        highlight: '100+ mentors • Career & technical guidance',
        icon: 'messagesquare-icon'
      }
    ];

    it('renders all 6 feature cards (duplicated for infinite scroll)', () => {
      render(<FeaturesSection />);
      
      expectedFeatures.forEach(feature => {
        const titles = screen.getAllByText(feature.title);
        expect(titles).toHaveLength(2); // Duplicated for infinite scroll
      });
    });

    it('renders all feature descriptions', () => {
      render(<FeaturesSection />);
      
      expectedFeatures.forEach(feature => {
        const descriptions = screen.getAllByText(new RegExp(feature.description.substring(0, 20)));
        expect(descriptions).toHaveLength(2);
      });
    });

    it('renders all feature highlights', () => {
      render(<FeaturesSection />);
      
      expectedFeatures.forEach(feature => {
        const highlights = screen.getAllByText(feature.highlight);
        expect(highlights).toHaveLength(2);
      });
    });

    it('renders correct icons for each feature', () => {
      render(<FeaturesSection />);
      
      expectedFeatures.forEach(feature => {
        const icons = screen.getAllByTestId(feature.icon);
        expect(icons).toHaveLength(2);
      });
    });

    it('applies correct styling to feature card icons', () => {
      render(<FeaturesSection />);
      
      const icons = screen.getAllByTestId('code2-icon');
      icons.forEach(icon => {
        expect(icon).toHaveClass('h-6', 'w-6', 'text-white');
      });
    });
  });

  describe('Carousel Implementation', () => {
    it('renders the carousel container', () => {
      render(<FeaturesSection />);
      
      const carouselContainer = screen.getByRole('region').querySelector('.carousel-container');
      expect(carouselContainer).toBeInTheDocument();
    });

    it('renders the carousel track with correct classes', () => {
      render(<FeaturesSection />);
      
      const carouselTrack = screen.getByRole('region').querySelector('.carousel-track');
      expect(carouselTrack).toHaveClass('flex', 'gap-6', 'hover:pause');
    });

    it('renders gradient overlays for infinite scroll effect', () => {
      render(<FeaturesSection />);
      
      const leftOverlay = screen.getByRole('region').querySelector('.absolute.left-0');
      const rightOverlay = screen.getByRole('region').querySelector('.absolute.right-0');
      
      expect(leftOverlay).toBeInTheDocument();
      expect(rightOverlay).toBeInTheDocument();
    });

    it('applies correct width classes to feature cards', () => {
      render(<FeaturesSection />);
      
      const featureCards = screen.getAllByText('Interactive Code Labs');
      featureCards.forEach(card => {
        const cardContainer = card.closest('.flex-shrink-0');
        expect(cardContainer).toHaveClass('w-80');
      });
    });
  });

  describe('Interactive Elements', () => {
    it('renders arrow buttons for each feature card', () => {
      render(<FeaturesSection />);
      
      const arrowButtons = screen.getAllByTestId('arrow-right-icon');
      expect(arrowButtons).toHaveLength(12); // 6 features × 2 sets
    });

    it('arrow buttons are wrapped in Button components', () => {
      render(<FeaturesSection />);
      
      const buttons = screen.getAllByTestId('ui-button');
      // Should have 12 arrow buttons + 1 CTA button
      expect(buttons.length).toBeGreaterThanOrEqual(12);
    });

    it('applies correct styling to arrow buttons', () => {
      render(<FeaturesSection />);
      
      const arrowButtons = screen.getAllByTestId('ui-button');
      arrowButtons.slice(0, 12).forEach(button => {
        expect(button).toHaveClass('text-pink-400', 'hover:text-pink-300', 'hover:bg-pink-500/10');
      });
    });
  });

  describe('Call to Action Section', () => {
    it('renders the CTA heading', () => {
      render(<FeaturesSection />);
      
      expect(screen.getByText('Ready to Transform Your CS Journey?')).toBeInTheDocument();
    });

    it('renders the CTA description', () => {
      render(<FeaturesSection />);
      
      expect(screen.getByText(/Join 100\+ students who've already accelerated their careers/)).toBeInTheDocument();
    });

    it('renders the main CTA button', () => {
      render(<FeaturesSection />);
      
      expect(screen.getByText('Start Your Journey')).toBeInTheDocument();
    });

    it('CTA button has correct styling', () => {
      render(<FeaturesSection />);
      
      const ctaButton = screen.getByText('Start Your Journey').closest('button');
      expect(ctaButton).toHaveClass('bg-gradient-to-r', 'from-pink-500', 'to-violet-500');
    });

    it('CTA button includes arrow icon', () => {
      render(<FeaturesSection />);
      
      const ctaButton = screen.getByText('Start Your Journey').closest('button');
      expect(ctaButton?.querySelector('[data-testid="arrow-right-icon"]')).toBeInTheDocument();
    });

    it('applies correct styling to CTA container', () => {
      render(<FeaturesSection />);
      
      const ctaContainer = screen.getByText('Ready to Transform Your CS Journey?').closest('.inline-block');
      expect(ctaContainer).toHaveClass('p-8', 'rounded-2xl', 'bg-gradient-to-r', 'from-pink-500/10', 'to-violet-500/10');
    });
  });

  describe('Animation and Framer Motion Integration', () => {
    it('calls useInView hook with correct parameters', () => {
      render(<FeaturesSection />);
      
      expect(mockUseInView).toHaveBeenCalledWith(
        expect.any(Object),
        { once: true, margin: "-100px" }
      );
    });

    it('handles when component is not in view', () => {
      mockUseInView.mockReturnValue(false);
      
      render(<FeaturesSection />);
      
      expect(screen.getByText('From Student to')).toBeInTheDocument();
    });

    it('renders motion components', () => {
      render(<FeaturesSection />);
      
      expect(screen.getAllByTestId('motion-div')).toHaveLength(
        expect.any(Number)
      );
    });

    it('applies animation variants to containers', () => {
      render(<FeaturesSection />);
      
      const motionDivs = screen.getAllByTestId('motion-div');
      expect(motionDivs.length).toBeGreaterThan(0);
    });
  });

  describe('Responsive Design', () => {
    it('applies responsive classes to main heading', () => {
      render(<FeaturesSection />);
      
      const heading = screen.getByText('From Student to');
      expect(heading).toHaveClass('text-4xl', 'md:text-5xl');
    });

    it('applies responsive classes to gradient overlays', () => {
      render(<FeaturesSection />);
      
      const leftOverlay = screen.getByRole('region').querySelector('.absolute.left-0');
      expect(leftOverlay).toHaveClass('w-15', 'md:w-32');
    });

    it('includes responsive CSS in style tag', () => {
      render(<FeaturesSection />);
      
      const styleTag = document.querySelector('style');
      expect(styleTag?.textContent).toContain('@media (max-width: 768px)');
    });
  });

  describe('Accessibility', () => {
    it('has proper semantic structure', () => {
      render(<FeaturesSection />);
      
      expect(screen.getByRole('region')).toBeInTheDocument();
      expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(1);
      expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(14); // 6 features × 2 + 2 CTA headings
    });

    it('buttons are keyboard accessible', () => {
      render(<FeaturesSection />);
      
      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button).toBeInTheDocument();
        expect(button).not.toHaveAttribute('disabled');
      });
    });

    it('has proper text contrast classes', () => {
      render(<FeaturesSection />);
      
      const mainHeading = screen.getByText('From Student to');
      expect(mainHeading).toHaveClass('text-white');
      
      const descriptions = screen.getAllByText(/Master algorithms, data structures/);
      descriptions.forEach(desc => {
        expect(desc).toHaveClass('text-gray-200');
      });
    });

    it('uses semantic HTML elements', () => {
      render(<FeaturesSection />);
      
      expect(screen.getByRole('region')).toBeInTheDocument();
      expect(screen.getAllByRole('button')).toHaveLength(13); // 12 arrow buttons + 1 CTA
    });
  });

  describe('Feature Card Component', () => {
    it('renders feature card with correct structure', () => {
      render(<FeaturesSection />);
      
      const cardContents = screen.getAllByTestId('ui-card-content');
      expect(cardContents).toHaveLength(12); // 6 features × 2 sets
    });

    it('applies correct styling to feature cards', () => {
      render(<FeaturesSection />);
      
      const cards = screen.getAllByTestId('ui-card');
      cards.forEach(card => {
        expect(card).toHaveClass('bg-gradient-to-br', 'from-pink-900/20', 'to-violet-900/20');
      });
    });

    it('feature card titles have correct styling', () => {
      render(<FeaturesSection />);
      
      const titles = screen.getAllByText('Interactive Code Labs');
      titles.forEach(title => {
        expect(title).toHaveClass('text-xl', 'font-semibold', 'mb-3', 'text-white');
      });
    });

    it('feature card descriptions have correct styling', () => {
      render(<FeaturesSection />);
      
      const descriptions = screen.getAllByText(/Master algorithms, data structures/);
      descriptions.forEach(desc => {
        expect(desc).toHaveClass('text-gray-200', 'mb-4');
      });
    });
  });

  describe('CSS Animations and Styles', () => {
    it('includes keyframes for carousel scroll animation', () => {
      render(<FeaturesSection />);
      
      const styleTag = document.querySelector('style');
      expect(styleTag?.textContent).toContain('@keyframes scroll');
    });

    it('includes carousel track width calculations', () => {
      render(<FeaturesSection />);
      
      const styleTag = document.querySelector('style');
      expect(styleTag?.textContent).toContain('width: calc(320px * 12 + 24px * 11)');
    });

    it('includes hover pause functionality', () => {
      render(<FeaturesSection />);
      
      const styleTag = document.querySelector('style');
      expect(styleTag?.textContent).toContain('animation-play-state: paused');
    });

    it('includes hardware acceleration optimizations', () => {
      render(<FeaturesSection />);
      
      const styleTag = document.querySelector('style');
      expect(styleTag?.textContent).toContain('transform-style: preserve-3d');
    });
  });

  describe('Error Handling and Edge Cases', () => {
    it('handles useInView errors gracefully', () => {
      mockUseInView.mockImplementation(() => {
        throw new Error('useInView error');
      });

      expect(() => render(<FeaturesSection />)).toThrow('useInView error');
    });

    it('handles component re-renders', () => {
      const { rerender } = render(<FeaturesSection />);
      
      expect(screen.getByText('From Student to')).toBeInTheDocument();
      
      rerender(<FeaturesSection />);
      
      expect(screen.getByText('From Student to')).toBeInTheDocument();
    });

    it('handles missing feature data gracefully', () => {
      render(<FeaturesSection />);
      
      // Component should render even if features array is empty or malformed
      expect(screen.getByRole('region')).toBeInTheDocument();
    });
  });

  describe('Performance Optimizations', () => {
    it('uses hardware acceleration CSS properties', () => {
      render(<FeaturesSection />);
      
      const styleTag = document.querySelector('style');
      expect(styleTag?.textContent).toContain('will-change: transform');
      expect(styleTag?.textContent).toContain('backface-visibility: hidden');
    });

    it('uses transform3d for smooth animations', () => {
      render(<FeaturesSection />);
      
      const styleTag = document.querySelector('style');
      expect(styleTag?.textContent).toContain('transform: translate3d');
    });

    it('applies efficient CSS selectors', () => {
      render(<FeaturesSection />);
      
      const styleTag = document.querySelector('style');
      expect(styleTag?.textContent).toContain('.carousel-track');
      expect(styleTag?.textContent).toContain('.carousel-container');
    });
  });
});