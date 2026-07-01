# Copilot Instructions - Nexora Event Management System

## Quick Commands

### Frontend (React + TypeScript + Vite)
```bash
cd frontend

# Development
npm run dev              # Start dev server (http://localhost:5173)
npm run build            # Build for production
npm run lint             # ESLint with auto-fix
npm run type-check       # TypeScript check
npm run preview          # Preview production build
```

### Backend (Express + TypeScript + Node.js)
```bash
cd backend

# Development
npm run dev              # Start with auto-reload (ts-node watch)
npm run build            # Compile TypeScript
npm start                # Run compiled code
npm run lint             # ESLint with auto-fix
npm run type-check       # TypeScript check
npm run migrate          # Run database migrations
```

### Running the Full Stack
```bash
# Terminal 1: Backend
cd backend && npm run dev

# Terminal 2: Frontend
cd frontend && npm run dev

# Access: Frontend at http://localhost:5173, API at http://localhost:3000/api
```

## Architecture Overview

### Full-Stack Structure
- **Frontend**: React 18 SPA with client-side routing (React Router)
- **Backend**: Express.js REST API with JWT authentication
- **Database**: MySQL 8.0+ with connection pooling
- **Inter-process**: Axios client calls REST endpoints

### Frontend Architecture (`frontend/src/`)
```
components/
  ├── common/         # Reusable UI components (Button, Input, Card, Modal, etc.)
  ├── layout/         # Page layout wrappers (MainLayout, Navbar, Footer)
  └── sections/       # Page sections (Hero, Features, CTA)
pages/                # Route-based pages (not yet implemented)
hooks/                # Custom hooks (useTheme, useApi placeholders)
context/              # Global state (ThemeContext for dark mode)
services/             # API calls (Axios wrappers)
types/                # TypeScript interfaces for all domain models
validation/           # Zod schemas for form validation
utils/                # Helpers (formatting, constants)
styles/               # Global CSS (Tailwind config-driven)
```

### Backend Architecture (`backend/src/`)
```
routes/               # Express route handlers (auth, events, users)
middleware/           # Custom middleware (auth, validation, error handling)
controllers/          # Business logic (Phase 2 - currently in routes)
services/             # Data access layer (Phase 2 - currently in controllers)
database/             # MySQL setup and migrations
config/               # Environment and configuration
types/                # TypeScript interfaces
utils/                # Helpers (JWT, error handling)
```

**Key Pattern**: Routes → Middleware → Controllers → Services → Database (to be implemented in Phase 2)

## Code Conventions

### TypeScript Configuration
- **Strict Mode**: Enabled in both frontend and backend (`"strict": true`)
- **Path Aliases**: Use `@/*` imports instead of relative paths
  - Backend: `import { authMiddleware } from '@middleware/auth';`
  - Frontend: `import { Button } from '@components/common';`
- **No Unused**: `noUnusedLocals` and `noUnusedParameters` enabled - remove dead code

### API Response Format
All API endpoints follow a consistent structure:
```typescript
{
  success: boolean;
  message: string;
  statusCode: number;
  data?: T;                    // Response payload (optional)
  timestamp: ISO8601 string;   // Server time
  error?: {                    // On error
    code: string;
    details?: any;
  }
}
```

### Error Handling
- Backend: Use `AppError` class from `@middleware/errorHandler`
  ```typescript
  throw new AppError(statusCode, ERROR_CODES.UNAUTHORIZED, 'message');
  ```
- Wrap async route handlers with `asyncHandler` middleware
- All route handlers return consistent error responses

### Authentication & Authorization
- **JWT Tokens**: Bearer token in `Authorization` header
- **Middleware**: Apply `authMiddleware` to protected routes
- **Roles**: User types defined in `@types/index.ts` (user, organizer, admin)
- **Validation**: Use `express-validator` with custom Zod schemas

### Frontend Conventions
- **Components**: Functional components with TypeScript (no class components)
- **Styling**: Tailwind CSS only (no inline styles or CSS modules)
- **State Management**: React Context for theme, hooks for local state
- **Form Handling**: React Hook Form + Zod for validation
- **API Calls**: Axios via services in `frontend/services/`
- **Types**: Define interfaces in `frontend/types/` for all data models

### React Component Structure
```typescript
// src/components/common/Button.tsx
import React from 'react';
import { ButtonProps } from '@types/components';

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  children, 
  ...props 
}) => {
  return (
    <button className={`btn btn-${variant}`} {...props}>
      {children}
    </button>
  );
};
```

### Backend Route Structure
```typescript
// src/routes/auth.ts
import { Router } from 'express';
import { authMiddleware } from '@middleware/auth';
import { validate, loginValidation } from '@middleware/validation';
import { asyncHandler } from '@middleware/errorHandler';

const router = Router();

router.post('/login', validate(loginValidation()), asyncHandler(async (req, res) => {
  // Route logic here
  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: { token, user },
    timestamp: new Date().toISOString(),
  });
}));

export default router;
```

### Database & Types
- **MySQL Tables**: `users`, `categories`, `events`, `event_registrations`
- **Type Safety**: All queries typed with interfaces from `@types/index.ts`
- **Migrations**: New schemas go in `backend/src/database/migrations/`
- **Relationships**: Foreign keys enforced at DB level

### Environment Variables
- **Frontend**: `VITE_API_BASE_URL` (default: `http://localhost:3000/api`)
- **Backend**: `PORT`, `NODE_ENV`, `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `JWT_SECRET`
- Use `.env.example` as template for new variables

### Commit Message Format
```
type(scope): subject

body

footer
```
Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

Example:
```
feat(auth): implement JWT login endpoint

Add login validation and JWT token generation
Fixes #45
```

## Phase 2 Implementation Guidelines

The codebase is structured for Phase 2 development:
1. **Controllers**: Move route logic from `routes/*.ts` to `controllers/`
2. **Services**: Create data access layer for queries
3. **Features**: Implement auth, event CRUD, registration, search, dashboards

Use existing middleware patterns (`authMiddleware`, `validate`, `asyncHandler`) when adding new routes.

## Testing & Quality

- Linting: ESLint configured for TypeScript
- Type Checking: `npm run type-check` in both frontend and backend
- No specific unit test framework configured yet (Phase 2)
- Run both linters before submitting PRs

## Common Patterns to Follow

1. **Always validate input**: Use `validate()` middleware with Zod schemas
2. **Always handle errors**: Wrap async handlers with `asyncHandler`
3. **Always type responses**: Define types in `types/` before API calls
4. **Always use path aliases**: Never use `../../../` relative imports
5. **Always check auth**: Apply `authMiddleware` to protected routes
6. **Always export defaults or named**: Be consistent per file
