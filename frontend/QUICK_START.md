# Nexora Frontend - Quick Start Guide

## 🚀 Quick Setup (5 minutes)

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

Server will start at `http://localhost:5173`

### 3. Build for Production
```bash
npm run build
```

Output will be in `dist/` directory

## 📋 Available Scripts

```bash
npm run dev          # Start development server with HMR
npm run build        # Build for production
npm run preview      # Preview production build locally
npm run lint         # Fix linting issues
npm run type-check   # Check TypeScript types
```

## 🗂️ Key Files & Folders

| Path | Purpose |
|------|---------|
| `src/pages/` | All page components |
| `src/components/` | Reusable UI components |
| `src/services/` | Mock API services |
| `src/validation/` | Zod validation schemas |
| `src/context/` | React context (theme) |
| `tailwind.config.js` | Tailwind configuration |
| `tsconfig.json` | TypeScript configuration |

## 🔐 Demo Credentials

```
Email:    test@example.com
Password: Password123
```

## 🌍 Pages Overview

| Page | Route | Purpose |
|------|-------|---------|
| Home | `/` | Landing page with featured events |
| Login | `/login` | User authentication |
| Signup | `/signup` | New account creation |
| Events | `/events` | Browse & filter all events |
| Categories | `/categories` | Browse events by category |
| About | `/about` | Company information |
| Contact | `/contact` | Contact form & info |
| 404 | `/*` | Page not found |

## 🎨 Features

✅ **Dark Mode** - Toggle in navbar  
✅ **Responsive Design** - Mobile, tablet, desktop  
✅ **Form Validation** - React Hook Form + Zod  
✅ **Mock Services** - Event & auth services  
✅ **Type Safety** - Full TypeScript coverage  
✅ **Reusable Components** - Button, Input, Card, etc.  
✅ **Professional UI** - Modern design with animations  
✅ **Accessibility** - Semantic HTML & ARIA attributes  

## 📱 Responsive Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

All pages fully responsive across all breakpoints.

## 🔧 Component Structure

### Common Components
Located in `src/components/common/`
- `Button.tsx` - With variants: primary, secondary, outline, danger
- `Input.tsx` - Text input with validation
- `PasswordInput.tsx` - Password field with show/hide
- `Card.tsx` - Wrapper component
- `Loader.tsx` - Loading spinner
- `EmptyState.tsx` - Empty placeholder
- `Navbar.tsx` - Top navigation
- `Footer.tsx` - Bottom footer
- `ThemeToggle.tsx` - Dark mode switch

### Page Components
Located in `src/pages/`
- All page components are functional components
- Use hooks for state management
- Wrapped with layout components
- Proper error handling

### Layout Components
Located in `src/components/layout/`
- `MainLayout.tsx` - Main page wrapper with navbar & footer
- `AuthLayout.tsx` - Authentication pages wrapper

## 🔄 Data Flow

```
Pages → Components → Hooks → Services
  ↓
Form Validation (Zod)
  ↓
Mock Services (authService, eventService, contactService)
  ↓
Local Storage / State Management
```

## 🎯 Validation Rules

### Login
- ✓ Email required & valid
- ✓ Password min 8 chars

### Signup
- ✓ Full name 2-100 chars
- ✓ Valid email
- ✓ Password: 8+ chars, 1 uppercase, 1 lowercase, 1 number
- ✓ Password must match confirmation
- ✓ Must accept terms

### Contact
- ✓ Name 2-100 chars
- ✓ Valid email
- ✓ Subject 5-100 chars
- ✓ Message 10-1000 chars

## 🎨 Tailwind CSS

### Key Utilities Used
- Dark mode with `dark:` prefix
- Gradients for visual interest
- Shadows for depth
- Animations for smooth UX
- Custom colors defined in config

### Custom Colors
```
Primary:  #0EA5E9 (Cyan)
Secondary: #38BDF8 (Sky Blue)
Accent:   #1E3A8A (Navy)
```

## 📦 State Management

- **Local Component State**: `useState` for form data
- **Theme Context**: Global dark mode toggle
- **Local Storage**: User preferences, auth token
- **URL Params**: Filters and navigation

## 🔗 Environment Variables

Create `.env` file:
```
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_NAME=Nexora
VITE_ENABLE_DARK_MODE=true
```

## 🐛 Debugging

### Enable Debug Mode
Open browser console and check:
```javascript
// Check theme
localStorage.getItem('theme')

// Check user
localStorage.getItem('user')

// Check token
localStorage.getItem('auth_token')
```

### Common Issues

**Dark mode not switching:**
- Clear browser cache
- Check localStorage theme key
- Reload page

**Build errors:**
- Delete `node_modules` and `dist`
- Run `npm install` again
- Check TypeScript: `npm run type-check`

**Form not submitting:**
- Check browser console for errors
- Verify form validation with Zod schemas
- Check network tab in dev tools

## 📚 Useful Resources

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com)
- [React Router](https://reactrouter.com)
- [React Hook Form](https://react-hook-form.com)
- [Zod Validation](https://zod.dev)

## 🚢 Deployment

### Build Production
```bash
npm run build
```

### Deploy to Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Deploy to Netlify
Connect GitHub repo to Netlify dashboard. Build command: `npm run build`

### Deploy to GitHub Pages
```bash
npm run build
# Deploy dist folder to gh-pages branch
```

## ✨ Next Steps

1. **Explore the UI** - Navigate through all pages
2. **Test Forms** - Try login/signup with demo credentials
3. **Try Dark Mode** - Toggle theme in navbar
4. **Check Responsive** - Resize browser or use mobile device
5. **Review Code** - Examine component structure
6. **Modify Styles** - Update Tailwind config
7. **Add Features** - Extend with new pages/components

## 📞 Support

For detailed documentation, see `FRONTEND_IMPLEMENTATION.md`

---

**Happy coding! 🎉**
