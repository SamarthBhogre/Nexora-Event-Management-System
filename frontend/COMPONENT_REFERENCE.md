# Nexora Frontend - Component Reference Guide

## 📖 Complete Component & File Listing

### Core Files
```
src/
├── App.tsx                          (Root component with routing)
├── main.tsx                         (Application entry point)
├── vite-env.d.ts                    (Vite type definitions)
```

---

## 🎨 Components Directory

### Authentication Components
```
src/components/auth/
├── AuthLayout.tsx                   (Professional auth page wrapper)
│   └── Props: title, subtitle, children, footerText
│   └── Features: Split screen design, theme toggle
│
├── LoginForm.tsx                    (Login form component)
│   └── Props: None (hook-based state)
│   └── Validates: Email, password, remember me
│   └── Demo: test@example.com / Password123
│
└── SignupForm.tsx                   (Signup form component)
    └── Props: None (hook-based state)
    └── Validates: Full name, email, password match, terms
    └── Password requirements: 8+ chars, uppercase, lowercase, number
```

**Usage Example:**
```tsx
<AuthLayout title="Sign In" subtitle="Welcome back">
  <LoginForm />
</AuthLayout>
```

---

### Event Components
```
src/components/events/
├── EventCard.tsx                    (Individual event card)
│   └── Props: event (Event)
│   └── Shows: Image, title, date, location, capacity meter, status
│   └── Features: Hover animations, capacity progress bar
│
├── EventGrid.tsx                    (Grid layout for events)
│   └── Props: events[], isLoading?, emptyMessage?, onRetry?
│   └── Features: Responsive grid, loading skeleton, empty state
│
├── EventSearch.tsx                  (Search bar component)
│   └── Props: value, onChange, onClear?, placeholder?
│   └── Features: Clear button, icon, real-time search
│
├── CategoryFilter.tsx               (Category dropdown selector)
│   └── Props: categories[], selectedCategory, onSelectCategory
│   └── Features: Dropdown menu, category counts
│
└── SortFilter.tsx                   (Sort options dropdown)
    └── Props: value ('date'|'popularity'|'title'), onChange
    └── Options: Newest First, Most Popular, Alphabetical
```

**Usage Example:**
```tsx
<EventGrid 
  events={events} 
  isLoading={isLoading}
  emptyMessage="No events found"
/>
```

---

### Category Components
```
src/components/categories/
└── CategoryCard.tsx                 (Category card component)
    └── Props: category (Category), onClick?
    └── Shows: Icon, name, description, event count
    └── Features: Hover animations, click handler
```

**Usage Example:**
```tsx
<CategoryCard 
  category={category}
  onClick={() => navigateToEvents(category.id)}
/>
```

---

### Common Components

#### Button Component
```
src/components/common/Button.tsx
├── Variants: 'primary' | 'secondary' | 'outline' | 'danger'
├── Sizes: 'sm' | 'md' | 'lg'
├── Props:
│   ├── variant: string
│   ├── size: string
│   ├── fullWidth: boolean
│   ├── loading: boolean
│   ├── disabled: boolean
│   └── children: React.ReactNode
└── Features: Loading spinner, disabled state, smooth transitions
```

**Usage Examples:**
```tsx
<Button variant="primary" size="lg" fullWidth>
  Click Me
</Button>

<Button variant="outline" loading={isLoading}>
  Submit
</Button>

<Button variant="danger" onClick={handleDelete}>
  Delete
</Button>
```

---

#### Input Component
```
src/components/common/Input.tsx
├── Props:
│   ├── label: string
│   ├── error: string (error message)
│   ├── helperText: string
│   ├── icon: React.ReactNode
│   └── [HTMLInputAttributes]
└── Features: Error display, helper text, icon support, dark mode
```

**Usage Example:**
```tsx
<Input
  label="Email"
  type="email"
  placeholder="user@example.com"
  error={errors.email?.message}
  icon={<Mail size={18} />}
  {...register('email')}
/>
```

---

#### PasswordInput Component
```
src/components/common/PasswordInput.tsx
├── Props:
│   ├── label: string (default: 'Password')
│   ├── error: string
│   ├── helperText: string
│   └── [HTMLInputAttributes]
└── Features: Show/hide toggle, validation support, dark mode
```

**Usage Example:**
```tsx
<PasswordInput
  label="Password"
  error={errors.password?.message}
  {...register('password')}
/>
```

---

#### Card Component
```
src/components/common/Card.tsx
├── Props:
│   ├── hover: boolean (adds hover effect)
│   ├── shadow: 'sm' | 'md' | 'lg'
│   ├── className: string
│   └── children: React.ReactNode
└── Features: Responsive, hover animations, flexible styling
```

**Usage Example:**
```tsx
<Card hover shadow="md" className="p-6">
  <h3>Card Title</h3>
  <p>Card content</p>
</Card>
```

---

#### Loader Component
```
src/components/common/Loader.tsx
├── Props:
│   ├── size: 'sm' | 'md' | 'lg'
│   ├── fullScreen: boolean
│   └── message: string
└── Features: Animated spinner, centered layout, backdrop overlay
```

**Usage Examples:**
```tsx
<Loader size="md" message="Loading..." />

<Loader size="lg" fullScreen message="Loading events..." />
```

---

#### EmptyState Component
```
src/components/common/EmptyState.tsx
├── Props:
│   ├── icon: 'search' | 'package' | 'custom'
│   ├── customIcon: React.ReactNode
│   ├── title: string
│   ├── description: string
│   └── action: { label, onClick }
└── Features: Customizable icons, optional action button
```

**Usage Example:**
```tsx
<EmptyState
  icon="search"
  title="No Results"
  description="Try adjusting your search filters"
  action={{ 
    label: 'Clear Filters', 
    onClick: handleClear 
  }}
/>
```

---

#### Navbar Component
```
src/components/common/Navbar.tsx
├── Features:
│   ├── Responsive navigation
│   ├── Mobile hamburger menu
│   ├── Theme toggle
│   ├── Auth buttons (Sign In, Sign Up)
│   └── Brand logo
└── Responsive: Mobile menu, desktop nav, sticky header
```

---

#### Footer Component
```
src/components/common/Footer.tsx
├── Sections:
│   ├── Brand info
│   ├── Product links
│   ├── Company links
│   ├── Resources links
│   └── Legal links
└── Features: Social links, copyright, responsive grid
```

---

#### ThemeToggle Component
```
src/components/common/ThemeToggle.tsx
├── Props: None
├── Features: Sun/Moon icons, click to toggle
└── Integration: Uses useTheme hook
```

---

#### Modal Component
```
src/components/common/Modal.tsx
├── Props:
│   ├── isOpen: boolean
│   ├── onClose: () => void
│   ├── title: string
│   ├── children: React.ReactNode
│   └── footer: React.ReactNode
└── Features: Backdrop, keyboard close, animations
```

---

### Layout Components
```
src/components/layout/
├── MainLayout.tsx                   (Main page wrapper)
│   ├── Includes: Navbar, Footer
│   ├── Props: children
│   └── Features: Full page layout, responsive
│
└── AuthLayout.tsx                   (Auth page wrapper)
    ├── Props: children, title, subtitle, footerText
    └── Features: Split screen, branding, theme toggle
```

---

### Section Components (Home Page)
```
src/components/sections/
├── HeroSection.tsx                  (Landing hero section)
│   └── Features: Main title, CTA buttons, stats
│
├── FeaturesSection.tsx              (Features showcase)
│   └── 6 feature cards with icons and descriptions
│
└── CTASection.tsx                   (Call-to-action section)
    └── Features: Bold CTA, action buttons
```

---

## 📄 Page Components

### Pages Directory
```
src/pages/
├── Home.tsx                         (Home/Landing page)
│   └── Route: /
│   └── Sections: Hero, Featured events, Categories, Features, CTA, Stats
│
├── Login.tsx                        (Login page)
│   └── Route: /login
│   └── Form: Email, Password, Remember me
│
├── Signup.tsx                       (Registration page)
│   └── Route: /signup
│   └── Form: Full name, Email, Password, Terms
│
├── Events.tsx                       (Events listing page)
│   └── Route: /events
│   └── Features: Search, Category filter, Sort, Grid display
│   └── Mock data: 8 events
│
├── Categories.tsx                   (Categories page)
│   └── Route: /categories
│   └── Display: 8 category cards in grid
│
├── About.tsx                        (About page)
│   └── Route: /about
│   └── Sections: Mission, Vision, Team, Features, CTA
│   └── Team: 4 members with roles
│
├── Contact.tsx                      (Contact page)
│   └── Route: /contact
│   └── Form: Name, Email, Subject, Message
│   └── Sections: Contact info, form, FAQ
│
├── NotFound.tsx                     (404 page)
│   └── Route: /* (catch-all)
│   └── Features: Navigation buttons, error message
│
└── index.ts                         (Barrel export)
    └── Exports all pages
```

---

## 🔧 Services

### Services Directory
```
src/services/
├── api.ts                           (API configuration & axios setup)
│
├── authService.ts                   (Authentication service - MOCK)
│   ├── login(credentials) → Promise<AuthResponse>
│   ├── register(data) → Promise<AuthResponse>
│   ├── logout() → Promise<void>
│   ├── getCurrentUser() → User | null
│   ├── isAuthenticated() → boolean
│   └── getToken() → string | null
│
├── eventService.ts                  (Event management service - MOCK)
│   ├── getEvents(filters?) → Promise<Event[]>
│   ├── getEventById(id) → Promise<Event | null>
│   ├── getCategories() → Promise<Category[]>
│   ├── getCategoryById(id) → Promise<Category | null>
│   ├── getFeaturedEvents(limit) → Promise<Event[]>
│   └── getTrendingEvents(limit) → Promise<Event[]>
│
└── contactService.ts                (Contact form service - MOCK)
    ├── submitContact(data) → Promise<{ success, message }>
    └── getAllMessages() → Promise<ContactMessage[]>
```

---

## ✅ Validation Schemas (Zod)

```
src/validation/
├── loginSchema.ts
│   ├── email: string (required, valid email)
│   ├── password: string (required, min 8 chars)
│   └── rememberMe: boolean (optional, default false)
│
├── signupSchema.ts
│   ├── fullName: string (2-100 chars)
│   ├── email: string (required, valid email)
│   ├── password: string (8+ chars with uppercase, lowercase, number)
│   ├── confirmPassword: string (must match password)
│   └── terms: boolean (required: true)
│
└── contactSchema.ts
    ├── name: string (2-100 chars)
    ├── email: string (required, valid email)
    ├── subject: string (5-100 chars)
    └── message: string (10-1000 chars)
```

---

## 🪝 Custom Hooks

```
src/hooks/
├── useTheme.ts
│   ├── Returns: { isDark, toggleTheme, setTheme }
│   └── Usage: Dark mode management
│
└── useApi.ts
    ├── Generic API hook (utility for future use)
    └── Can be used with backend integration
```

---

## 🎯 Context

```
src/context/
└── ThemeContext.tsx
    ├── Provides: { isDark, toggleTheme, setTheme }
    ├── Features: localStorage persistence, system preference detection
    └── Provider: ThemeProvider wrapper
```

---

## 🏷️ Types

```
src/types/
├── api.ts
│   └── API-related type definitions
│
└── index.ts
    └── Barrel export for types
```

---

## 📦 Constants

```
src/utils/constants.ts
├── APP_NAME: string
├── APP_VERSION: string
├── API_BASE_URL: string
├── COLORS: {primary, secondary, accent, dark, semantic}
├── EVENT_CATEGORIES: Category[]
├── EVENT_STATUS: enum
├── USER_ROLES: enum
├── STORAGE_KEYS: object
├── PAGINATION: defaults
├── TOAST_DURATION: times
├── DATE_FORMATS: patterns
├── NAV_LINKS: navigation links
└── FEATURES: feature flags
```

---

## 🎨 Styling

```
src/styles/
└── globals.css
    ├── Global styles
    ├── Custom utilities
    ├── Animations
    └── Theme variables
```

---

## 📋 Configuration Files

```
Root level:
├── tsconfig.json                    (TypeScript config with path aliases)
├── tailwind.config.js               (Tailwind CSS config)
├── vite.config.ts                   (Vite build config)
├── postcss.config.js                (PostCSS config)
├── package.json                     (Dependencies & scripts)
├── .env.example                     (Environment template)
└── .gitignore                       (Git ignore rules)
```

---

## 🚀 Quick Component Import Guide

```tsx
// Common Components
import Button from '@components/common/Button';
import Input from '@components/common/Input';
import Card from '@components/common/Card';
import Loader from '@components/common/Loader';
import EmptyState from '@components/common/EmptyState';

// Event Components
import EventCard from '@components/events/EventCard';
import EventGrid from '@components/events/EventGrid';
import EventSearch from '@components/events/EventSearch';
import CategoryFilter from '@components/events/CategoryFilter';

// Layout
import MainLayout from '@components/layout/MainLayout';
import AuthLayout from '@components/auth/AuthLayout';

// Hooks
import { useTheme } from '@hooks/useTheme';

// Services
import { authService } from '@services/authService';
import { eventService } from '@services/eventService';

// Validation
import { loginSchema } from '@validation/loginSchema';
```

---

## 📊 Component Statistics

| Category | Count |
|----------|-------|
| Pages | 8 |
| Common Components | 9 |
| Event Components | 5 |
| Auth Components | 3 |
| Layout Components | 2 |
| Section Components | 3 |
| Category Components | 1 |
| **Total Components** | **31** |
| Services | 3 |
| Validation Schemas | 3 |
| Custom Hooks | 2 |
| **Total Files** | **50+** |

---

## 📚 Usage Tips

1. **Use Path Aliases** - Import with `@components/` instead of `../../../components/`
2. **Leverage Reusable Components** - Don't repeat UI patterns
3. **Follow Component Props** - Use TypeScript for component props
4. **Use Custom Hooks** - Share logic across components
5. **Mock Services** - Replace with real API later
6. **Test Responsive** - Check all breakpoints
7. **Test Dark Mode** - Ensure dark mode works everywhere
8. **Add Error Handling** - All async operations should handle errors

---

## 🔗 File Dependencies

```
App.tsx
  ├── Router (React Router)
  ├── ThemeProvider
  └── All pages

Pages
  ├── MainLayout or AuthLayout
  ├── Specific page components
  └── Services (eventService, authService, etc.)

Components
  ├── Other components (imports)
  ├── Hooks (useTheme, useForm, etc.)
  ├── Services (read-only)
  └── Types (imported from @types/)

Services
  ├── Type definitions
  ├── Constants (STORAGE_KEYS, etc.)
  └── Validation schemas
```

---

## ✨ Best Practices

1. **Components are Functional** - Use hooks, not class components
2. **Props are Typed** - All props have TypeScript types
3. **Reuse Components** - Don't duplicate component code
4. **Use Custom Hooks** - Share logic between components
5. **Error Handling** - Try-catch blocks in async operations
6. **Loading States** - Show loaders during async operations
7. **Empty States** - Handle empty data scenarios
8. **Dark Mode** - Support dark mode everywhere
9. **Responsive** - Test all breakpoints
10. **Accessibility** - Use semantic HTML and ARIA labels

---

This guide covers all 50+ files in the Nexora frontend. Happy coding! 🎉
