import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Navbar from '../Component/mainpage/Navbar';
import ContactForm from '../contactus/component/ContactForm';
import Login from '../login/page';
import { ToastContainer } from 'react-toastify';

jest.mock('../Component/mainpage/Footer', () => {
  return {
    __esModule: true,
    default: () => <div data-testid="footer-mock">Footer</div>
  }
});

// Existing Navbar mocks
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => <img {...props} />,
}));

jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: { children: React.ReactNode } & React.HTMLAttributes<HTMLDivElement>) => (
      <div {...props}>{children}</div>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

jest.mock('lucide-react', () => ({
  Hand: () => <div data-testid="hand-icon" />,
  Mail: () => <div data-testid="mail-icon" />,
  ChevronRight: () => <div data-testid="chevron-right-icon" />,
  Send: () => <div data-testid="send-icon" />,
  CircularProgress: () => <div data-testid="circular-progress" />
}));

jest.mock('lucide-react', () => ({
  Hand: () => <div data-testid="hand-icon" />,
  Mail: () => <div data-testid="mail-icon" />,
}));

// Mock next/navigation hooks
jest.mock('next/navigation', () => ({
  usePathname: () => '/',
  useRouter: jest.fn(() => ({
    push: jest.fn(),
  })),
}));

// Mock useMediaQuery
jest.mock('@mui/material/useMediaQuery', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation((query) => {
    if (query === '(max-width:600px)') return false; // Desktop view by default
    return false;
  }),
}));

// app/tests/All.test.tsx

// Mock API base URL
jest.mock("@/config/api", () => ({
  API_BASE_URL: "http://mockapi.com",
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
    useMediaQueryMock.mockImplementation((query: string) => {
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

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(phoneInput, { target: { value: '1234567890' } });

    expect(nameInput).toHaveValue('John Doe');
    expect(emailInput).toHaveValue('john@example.com');
    expect(phoneInput).toHaveValue('1234567890');
  });

  // Test form validation
  test('[CONTACT FORM] shows form submission behavior', async () => {
    const mockOnSubmit = jest.fn();
    
    render(<ContactForm />);
    
    const submitButton = screen.getByRole('button', { name: /submit/i });
    
    const nameInput = screen.getByPlaceholderText(/Name/i);
    const emailInput = screen.getByPlaceholderText(/Email Id/i);
    const phoneInput = screen.getByPlaceholderText(/Phone/i);

    fireEvent.change(nameInput, { target: { value: 'Jane Doe' } });
    fireEvent.change(emailInput, { target: { value: 'jane@example.com' } });
    fireEvent.change(phoneInput, { target: { value: '0987654321' } });

    fireEvent.click(submitButton);

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

    const containers = screen.getAllByRole('img');
    const image = containers[0];
    
    expect(image).toHaveAttribute('src', expect.stringContaining('/logo/lb.svg'));
    expect(image).toHaveClass('object-contain');
    expect(image).toHaveClass('object-center');

    const parentDiv = image.closest('div');
    expect(parentDiv).toHaveClass('h-52');
    expect(parentDiv).toHaveClass('w-full');
  });
});

// ==================== LOGIN TESTS ====================
describe('Login Component', () => {
  beforeEach(() => {
    // Reset any mocks before each test
    jest.clearAllMocks();
  });

  const renderLogin = () => {
    return render(
      <MemoryRouter>
        <ThemeProvider theme={createTheme()}>
          <ToastContainer />
          <Login />
        </ThemeProvider>
      </MemoryRouter>
    );
  };

  it('[LOGIN] should allow typing in email field', () => {
    renderLogin();
    const emailInput = screen.getByPlaceholderText('Email Address');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    expect(emailInput).toHaveValue('test@example.com');
  });

  it('[LOGIN] should allow typing in password field', () => {
    renderLogin();
    const passwordInput = screen.getByPlaceholderText('Password');
    fireEvent.change(passwordInput, { target: { value: 'mypassword123' } });
    expect(passwordInput).toHaveValue('mypassword123');
  });

  it('[LOGIN] should toggle between email and phone login methods', () => {
    renderLogin();
    
    const phoneButton = screen.getByText('Phone');
    fireEvent.click(phoneButton);
    const phoneNumberInput = screen.getByPlaceholderText('Phone Number');
    expect(phoneNumberInput).toBeInTheDocument();
    
    const emailButton = screen.getByText('Email');
    fireEvent.click(emailButton);
    const emailInput = screen.getByPlaceholderText('Email Address');
    expect(emailInput).toBeInTheDocument();
  });
});