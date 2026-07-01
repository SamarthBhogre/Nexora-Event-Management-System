# Nexora Frontend - Phase 1 Implementation

## Overview

This is a production-quality React + TypeScript + Tailwind CSS frontend implementation for the Nexora Event Management System. The application follows modern architectural patterns and best practices for scalability, maintainability, and user experience.

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   ├── AuthLayout.tsx           # Authentication page layout wrapper
│   │   │   ├── LoginForm.tsx            # Login form component
│   │   │   └── SignupForm.tsx           # Signup form component
│   │   ├── categories/
│   │   │   └── CategoryCard.tsx         # Individual category card component
│   │   ├── common/
│   │   │   ├── Button.tsx              # Reusable button with variants
│   │   │   ├── Input.tsx               # Reusable input field
│   │   │   ├── PasswordInput.tsx       # Password field with show/hide toggle
│   │   │   ├── Card.tsx                # Card wrapper component
│   │   │   ├── Loader.tsx              # Loading spinner
│   │   │   ├── EmptyState.tsx          # Empty state placeholder
│   │   │   ├── Navbar.tsx              # Navigation bar
│   │   │   ├── Footer.tsx              # Footer section
│   │   │   ├── Modal.tsx               # Modal wrapper
│   │   │   └── ThemeToggle.tsx         # Dark mode toggle
│   │   ├── events/
│   │   │   ├── EventCard.tsx           # Individual event card
│   │   │   ├── EventGrid.tsx           # Grid of event cards
│   │   │   ├── EventSearch.tsx         # Search bar for events
│   │   │   ├── CategoryFilter.tsx      # Category dropdown filter
│   │   │   └── SortFilter.tsx          # Sort options dropdown
│   │   ├── layout/
│   │   │   └── MainLayout.tsx          # Main page layout wrapper
│   │   └── sections/
│   │       ├── HeroSection.tsx         # Hero section for home page
│   │       ├── FeaturesSection.tsx     # Features showcase section
│   │       └── CTASection.tsx          # Call-to-action section
│   ├── context/
│   │   └── ThemeContext.tsx            # Dark mode theme context
│   ├── hooks/
│   │   ├── useTheme.ts                 # Theme hook
│   │   └── useApi.ts                   # API calls hook
│   ├── pages/
│   │   ├── Home.tsx                    # Home page
│   │   ├── Login.tsx                   # Login page
│   │   ├── Signup.tsx                  # Signup page
│   │   ├── Events.tsx                  # Events listing page
│   │   ├── Categories.tsx              # Categories page
│   │   ├── About.tsx                   # About page
│   │   ├── Contact.tsx                 # Contact page
│   │   ├── NotFound.tsx                # 404 page
│   │   └── index.ts                    # Pages barrel export
│   ├── services/
│   │   ├── api.ts                      # API service
│   │   ├── authService.ts              # Authentication mock service
│   │   ├── eventService.ts             # Events mock service
│   │   └── contactService.ts           # Contact form mock service
│   ├── styles/
│   │   └── globals.css                 # Global styles
│   ├── types/
│   │   ├── api.ts                      # API types
│   │   └── index.ts                    # Types barrel export
│   ├── validation/
│   │   ├── loginSchema.ts              # Login form validation with Zod
│   │   ├── signupSchema.ts             # Signup form validation with Zod
│   │   └── contactSchema.ts            # Contact form validation with Zod
│   ├── utils/
│   │   └── constants.ts                # Application constants
│   ├── App.tsx                         # Root app component
│   ├── main.tsx                        # Application entry point
│   └── vite-env.d.ts                   # Vite environment types
├── public/                             # Static assets
├── index.html                          # HTML template
├── package.json                        # Project dependencies
├── tailwind.config.js                  # Tailwind CSS configuration
├── tsconfig.json                       # TypeScript configuration
├── vite.config.ts                      # Vite configuration
└── postcss.config.js                   # PostCSS configuration
```

## Installation & Setup

### Prerequisites
- Node.js 18.x or higher
- npm or yarn package manager

### Install Dependencies

```bash
cd frontend
npm install
```

### Required Packages
```bash
npm install react react-dom react-router-dom axios
npm install react-hook-form zod @hookform/resolvers lucide-react
npm install -D typescript tailwindcss postcss autoprefixer vite @vitejs/plugin-react
```

All dependencies are included in `package.json`.

## Development

### Start Development Server

```bash
npm run dev
```

This will start the Vite development server on `http://localhost:5173` with hot module replacement (HMR).

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

### Type Checking

```bash
npm run type-check
```

Performs TypeScript type checking without emitting files.

### Linting

```bash
npm run lint
```

Runs ESLint to check code quality and fix issues automatically.

## Key Features & Implementation

### 1. **Routing System**
- Implemented using React Router v6
- Routes defined in `App.tsx`
- All pages have proper layout wrappers

**Routes:**
- `/` - Home page
- `/login` - Login page
- `/signup` - Signup page
- `/events` - Events listing with filters
- `/categories` - Event categories
- `/about` - About page
- `/contact` - Contact page
- `/*` - 404 Not Found page

### 2. **Form Management**
- **React Hook Form**: Lightweight form state management
- **Zod**: TypeScript-first schema validation
- All forms have comprehensive validation
- Real-time error display
- Loading states on submission

**Validated Forms:**
- Login form (email, password, remember me)
- Signup form (full name, email, password confirmation, terms)
- Contact form (name, email, subject, message)

### 3. **Authentication Service (Mocked)**
- `authService.ts` provides login and registration
- Mock credentials: `test@example.com` / `Password123`
- Local storage for token and user data
- Password validation requirements:
  - Minimum 8 characters
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one number

### 4. **Event Management (Mocked)**
- 8 pre-populated mock events
- 8 event categories
- Advanced filtering by:
  - Category
  - Search term (title, description, location)
  - Sort order (date, popularity, alphabetical)
- Event cards display:
  - Event image
  - Title and description
  - Date and time
  - Location
  - Capacity meter with current attendees
  - Category and status badges

### 5. **Dark Mode Support**
- Implemented via Tailwind CSS `dark:` utilities
- Theme context for global state management
- Persists to localStorage
- System preference detection
- Toggle button in navbar

### 6. **Responsive Design**
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- All pages fully responsive
- Optimized navigation for mobile
- Touch-friendly interface elements

### 7. **Component Architecture**
- Reusable common components (Button, Input, etc.)
- Page-specific components with clear separation
- Service layer for API calls and mock data
- Custom hooks for shared logic
- TypeScript for type safety throughout

### 8. **UI/UX Features**
- Smooth animations and transitions
- Loading spinners for async operations
- Empty state designs
- Error handling and user feedback
- Professional color scheme
- Accessibility-focused markup
- Keyboard navigation support

## Color Palette

**Primary:**
- Main: `#0EA5E9` (Cyan Blue)
- Light: `#38BDF8` (Sky Blue)
- Dark: `#0284C7` (Darker Blue)

**Accent:**
- Navy: `#1E3A8A`
- Light Teal: `#F0FDFA`

**Dark Theme:**
- Background: `#0F172A`
- Card: `#1E293B`
- Text: `#E2E8F0`

**Semantic Colors:**
- Success: `#10B981`
- Warning: `#F59E0B`
- Error: `#EF4444`
- Info: `#3B82F6`

## Pages Detail

### Home Page
- Hero section with main CTA
- Featured events carousel
- Event categories preview
- Why Choose Nexora section
- Statistics dashboard
- Features showcase
- Call-to-action section

### Login Page
- Professional auth layout
- Email and password fields
- Show/hide password toggle
- Remember me checkbox
- Forgot password link
- Link to signup
- Demo credentials hint

### Signup Page
- Full authentication form
- Password strength requirements
- Password confirmation
- Terms & conditions checkbox
- Form validation
- Link to login

### Events Page
- Search functionality
- Category dropdown filter
- Sort options (date, popularity, alphabetical)
- Event grid with cards
- Empty state handling
- Loading states
- Real-time filtering

### Categories Page
- All 8 categories displayed
- Category cards with icons
- Event count per category
- Click to filter events
- Responsive grid layout

### About Page
- Company introduction
- Mission and vision sections
- Why Choose Nexora highlights
- Team member cards
- Statistics section
- Call-to-action

### Contact Page
- Contact information cards
- Contact form with validation
- Success/error messages
- FAQ section
- Professional layout

## Form Validation Schemas

### Login Schema
```typescript
{
  email: required, valid email
  password: required, min 8 characters
  rememberMe: optional boolean
}
```

### Signup Schema
```typescript
{
  fullName: required, 2-100 characters
  email: required, valid email
  password: required, 8+ chars, uppercase, lowercase, number
  confirmPassword: must match password
  terms: must accept
}
```

### Contact Schema
```typescript
{
  name: required, 2-100 characters
  email: required, valid email
  subject: required, 5-100 characters
  message: required, 10-1000 characters
}
```

## Environment Variables

Create `.env` file in frontend directory:

```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_NAME=Nexora
VITE_ENABLE_DARK_MODE=true
VITE_ENABLE_ANALYTICS=false
```

## Performance Optimizations

- Code splitting with Vite
- Image lazy loading
- CSS minification
- JavaScript minification
- Tree shaking of unused code
- Efficient component re-renders
- Memoization where appropriate

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Android)

## Future Enhancements

- [ ] Backend API integration
- [ ] Real authentication with JWT
- [ ] Payment integration
- [ ] Event creation form
- [ ] User profile page
- [ ] Event attendance tracking
- [ ] Notifications system
- [ ] Analytics dashboard
- [ ] Admin panel
- [ ] Search optimization
- [ ] Map integration
- [ ] Social sharing

## Troubleshooting

### Build Issues
If you encounter build errors:
1. Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
2. Clear Vite cache: `rm -rf dist`
3. Run type check: `npm run type-check`

### Dark Mode Not Working
- Check browser localStorage for `theme` key
- Ensure Tailwind dark mode class is applied to root element
- Verify `tailwind.config.js` has `darkMode: 'class'`

### TypeScript Errors
- Run `npm run type-check` for detailed errors
- Check import paths match tsconfig aliases
- Ensure all dependencies are installed

## Contributing

When contributing to the frontend:

1. Follow TypeScript strict mode rules
2. Use functional components with hooks
3. Add proper error handling
4. Create reusable components
5. Update types in `src/types/`
6. Test responsive design
7. Ensure dark mode compatibility
8. Use semantic HTML
9. Add accessibility attributes
10. Follow the existing code style

## Code Quality

- TypeScript strict mode enabled
- ESLint configured for code quality
- No unused variables or imports
- Consistent naming conventions
- Component composition over inheritance
- Single responsibility principle

## License

Part of the Nexora Event Management System project.

## Support

For issues or questions, please refer to the main project README.md or contact the development team.
