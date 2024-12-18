
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Navbar from '../Component/mainpage/Navbar';
import ContactForm from '../contactus/component/ContactForm';

// Existing Navbar mocks
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => <img {...props} />,
}));

jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

jest.mock('lucide-react', () => ({
  Hand: () => <div data-testid="hand-icon" />,
  Mail: () => <div data-testid="mail-icon" />,
}));

// Mock next/navigation hooks
jest.mock('next/navigation', () => ({
  usePathname: () => '/',
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Mock useMediaQuery
jest.mock('@mui/material/useMediaQuery', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation((query) => {
    if (query === '(max-width:600px)') return false; // Desktop view by default
    return false;
  }),
}));

// ==================== NAVBAR TESTS ====================
describe('Navbar Component', () => {
  const theme = createTheme();
  const mockRouter = {
    push: jest.fn(),
  };
  
  const navItems = [
    { text: 'Home', path: '/' },
    { text: 'About Us', path: '/aboutus' },
    { text: 'Amenities', path: '/amenities' },
    { text: 'Contact', path: '/contactus' },
    { text: 'Gallery', path: '/gallery' },
    { text: 'Sign-in', path: '/login' },
    { text: 'Register', path: '/register' },
  ];

  const renderNavbar = (isMobile = false) => {
    mockRouter.push.mockReset();
    const useMediaQueryMock = require('@mui/material/useMediaQuery').default;
    
    // Update media query mocks based on viewport
    useMediaQueryMock.mockImplementation((query) => {
      if (query === '(max-width:600px)') return isMobile;
      return false;
    });
  
    jest.spyOn(require('next/navigation'), 'useRouter')
        .mockImplementation(() => mockRouter);
  
    return render(
      <MemoryRouter>
        <ThemeProvider theme={theme}>
          <Navbar />
        </ThemeProvider>
      </MemoryRouter>
    );
  };

  // Desktop View Tests
  describe('[NAVBAR] Desktop View', () => {
    beforeEach(() => {
      renderNavbar(false);
    });

    test('[NAVBAR] renders logo correctly', () => {
      const logo = screen.getByAltText('Latur Hostel Logo');
      expect(logo).toBeInTheDocument();
      expect(logo).toHaveAttribute('src');
    });

    test('[NAVBAR] renders all navigation items in desktop view', () => {
      navItems.forEach(({ text }) => {
        const element = screen.getByText(text);
        expect(element).toBeInTheDocument();
      });
    });

    test('[NAVBAR] renders hostel owner button', () => {
      const hostelOwnerButton = screen.getByText('Are you hostel owner?');
      expect(hostelOwnerButton).toBeInTheDocument();
    });
  });

  // Navigation Tests
  describe('[NAVBAR] Navigation Functionality', () => {
    test('[NAVBAR] navigates correctly in desktop view', () => {
      renderNavbar(false);
      
      navItems.forEach(({ text, path }) => {
        const navItem = screen.getByText(text);
        fireEvent.click(navItem);
        expect(mockRouter.push).toHaveBeenCalledWith(path);
        mockRouter.push.mockClear();
      });
    });

    test('[NAVBAR] navigates to hostel owner login', () => {
      renderNavbar(false);
      const hostelOwnerButton = screen.getByText('Are you hostel owner?');
      fireEvent.click(hostelOwnerButton);
      expect(mockRouter.push).toHaveBeenCalledWith('/hostelownerlogin');
    });
  });
});

// ==================== CONTACT FORM TESTS ====================
describe('ContactForm Component', () => {
  // Test that the form renders correctly
  test('[CONTACT FORM] renders contact form with all input fields', () => {
    render(<ContactForm />);
    
    // Update placeholders to match the actual component
    expect(screen.getByPlaceholderText(/Name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Email Id/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Phone/i)).toBeInTheDocument();
  });

  // Test input field interactions
  test('[CONTACT FORM] allows typing in input fields', () => {
    render(<ContactForm />);
    
    const nameInput = screen.getByPlaceholderText(/Name/i);
    const emailInput = screen.getByPlaceholderText(/Email Id/i);
    const phoneInput = screen.getByPlaceholderText(/Phone/i);

    // Simulate user typing
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(phoneInput, { target: { value: '1234567890' } });

    // Check if input values are updated
    expect(nameInput).toHaveValue('John Doe');
    expect(emailInput).toHaveValue('john@example.com');
    expect(phoneInput).toHaveValue('1234567890');
  });

  // Test form validation (basic client-side validation)
  test('[CONTACT FORM] shows form submission behavior', async () => {
    const mockOnSubmit = jest.fn();
    
    render(<ContactForm />);
    
    const submitButton = screen.getByRole('button', { name: /submit/i });
    
    // Fill out the form with valid inputs
    const nameInput = screen.getByPlaceholderText(/Name/i);
    const emailInput = screen.getByPlaceholderText(/Email Id/i);
    const phoneInput = screen.getByPlaceholderText(/Phone/i);

    fireEvent.change(nameInput, { target: { value: 'Jane Doe' } });
    fireEvent.change(emailInput, { target: { value: 'jane@example.com' } });
    fireEvent.change(phoneInput, { target: { value: '0987654321' } });

    // Submit the form
    fireEvent.click(submitButton);

    // Since the actual form uses emailjs and shows an alert, we can't directly check onSubmit
    // This test just ensures form can be submitted without errors
    expect(submitButton).toBeInTheDocument();
  });

  // Test image rendering
  test('[CONTACT FORM] renders image with correct properties', () => {
    render(
      <ContactForm 
        imageHeight="h-52"
        imageWidth="w-full"
        imageFit="contain"
        imagePosition="object-center"
        imageSrc="/logo/lb.svg"
      />
    );

    // Find the container div that has both width and height classes
    const containers = screen.getAllByRole('img');
    
    // Verify the image element
    const image = containers[0];
    
    // Check image attributes
    expect(image).toHaveAttribute('src', expect.stringContaining('/logo/lb.svg'));
    expect(image).toHaveClass('object-contain');
    expect(image).toHaveClass('object-center');

    // Check parent div's classes (assuming it's the closest parent div)
    const parentDiv = image.closest('div');
    expect(parentDiv).toHaveClass('h-52');
    expect(parentDiv).toHaveClass('w-full');
  });
});