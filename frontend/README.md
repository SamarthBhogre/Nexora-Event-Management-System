# Nexora Frontend

Modern React + TypeScript frontend for the Nexora Event Management platform.

## 🎨 Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool & dev server
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Axios** - HTTP client

## 📁 Project Structure

```
src/
├── components/
│   ├── common/        # Reusable UI components (Button, Input, Card, etc.)
│   ├── layout/        # Layout wrappers
│   └── sections/      # Page sections (Hero, Features, CTA)
├── pages/             # Route pages
├── hooks/             # Custom React hooks
├── context/           # Global state (Theme, Auth)
├── services/          # API calls
├── types/             # TypeScript interfaces
├── utils/             # Helper functions
├── styles/            # Global styles
└── main.tsx           # Entry point
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your configuration
```

### Development

```bash
# Start dev server (opens at http://localhost:5173)
npm run dev

# Run type checking
npm run type-check

# Run linter
npm run lint
```

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 🎨 Design System

### Colors
- **Primary**: #0EA5E9 (Cyan)
- **Secondary**: #38BDF8 (Light Cyan)
- **Accent Navy**: #1E3A8A
- **Light Accent**: #F0FDFA

### Dark Mode
- **Background**: #0F172A
- **Card**: #1E293B
- **Text**: #E2E8F0

### Typography
- Font family: Inter (sans-serif)
- Base size: 16px (1rem)
- Line height: 1.5

## 📦 Key Dependencies

```json
{
  "react": "^18.2.0",
  "react-router-dom": "^6.20.0",
  "axios": "^1.6.0",
  "tailwindcss": "^3.4.0"
}
```

## 🔧 Available Scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Start dev server |
| `npm run build` | Build for production |
| `npm run lint` | Run ESLint |
| `npm run type-check` | TypeScript type checking |
| `npm run preview` | Preview production build |

## 📝 Coding Standards

### Component Structure
```tsx
import { FC } from 'react';

interface ComponentProps {
  title: string;
  onClick?: () => void;
}

const MyComponent: FC<ComponentProps> = ({ title, onClick }) => {
  return (
    <div className="...">
      {title}
    </div>
  );
};

export default MyComponent;
```

### File Naming
- Components: PascalCase (Button.tsx)
- Hooks: camelCase (useApi.ts)
- Utilities: camelCase (constants.ts)
- Types: PascalCase (index.ts)

### Imports
Use path aliases from tsconfig.json:
```tsx
import { useApi } from '@hooks/useApi';
import { Button } from '@components/common/Button';
```

## 🌓 Dark Mode Implementation

Theme context automatically provides dark mode support:
```tsx
import { useTheme } from '@hooks/useTheme';

const MyComponent = () => {
  const { isDark, toggleTheme } = useTheme();
  
  return (
    <div className={isDark ? 'dark' : ''}>
      {/* Your content */}
    </div>
  );
};
```

## 🔌 API Integration

Use Axios service for API calls:
```tsx
import { apiClient } from '@services/api';

const { data } = await apiClient.get('/events');
```

## 📱 Responsive Design

Tailwind breakpoints:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

Example:
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
```

## 🐛 Debugging

Enable source maps in vite.config.ts:
```ts
build: {
  sourcemap: true, // For development
}
```

## 🚢 Deployment

1. Build the project: `npm run build`
2. Deploy `dist/` folder to your hosting
3. Ensure API_BASE_URL is correctly configured

## 📚 Resources

- [React Docs](https://react.dev)
- [TypeScript Docs](https://www.typescriptlang.org)
- [Tailwind CSS](https://tailwindcss.com)
- [React Router](https://reactrouter.com)
- [Vite Guide](https://vitejs.dev)

## 👥 Contributing

1. Follow the coding standards
2. Test components thoroughly
3. Run lint before committing
4. Create meaningful commit messages

---

**Maintained by**: Team Syncova
