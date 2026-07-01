// App Information
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'Nexora';
export const APP_VERSION = '0.1.0';

// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
export const API_TIMEOUT = 30000; // 30 seconds

// Color Palette
export const COLORS = {
  primary: {
    light: '#38BDF8',
    main: '#0EA5E9',
    dark: '#0284c7',
  },
  accent: {
    navy: '#1E3A8A',
    lightTeal: '#F0FDFA',
  },
  dark: {
    bg: '#0F172A',
    card: '#1E293B',
    text: '#E2E8F0',
  },
  semantic: {
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  },
} as const;

// Event Categories
export const EVENT_CATEGORIES = [
  { id: 'tech', name: 'Technology', icon: '💻' },
  { id: 'business', name: 'Business', icon: '💼' },
  { id: 'education', name: 'Education', icon: '📚' },
  { id: 'sports', name: 'Sports', icon: '⚽' },
  { id: 'music', name: 'Music', icon: '🎵' },
  { id: 'art', name: 'Art', icon: '🎨' },
  { id: 'food', name: 'Food & Drink', icon: '🍽️' },
  { id: 'networking', name: 'Networking', icon: '🤝' },
] as const;

// Event Status
export const EVENT_STATUS = {
  UPCOMING: 'upcoming',
  ONGOING: 'ongoing',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

// User Roles
export const USER_ROLES = {
  USER: 'user',
  ORGANIZER: 'organizer',
  ADMIN: 'admin',
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'user',
  THEME: 'theme',
  PREFERENCES: 'user_preferences',
} as const;

// Pagination Defaults
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
} as const;

// Toast Messages Duration (ms)
export const TOAST_DURATION = {
  SHORT: 3000,
  NORMAL: 5000,
  LONG: 8000,
} as const;

// Date & Time Formats
export const DATE_FORMATS = {
  DISPLAY: 'DD MMM YYYY',
  DISPLAY_WITH_TIME: 'DD MMM YYYY, hh:mm A',
  API: 'YYYY-MM-DD',
  API_WITH_TIME: 'YYYY-MM-DD HH:mm:ss',
} as const;

// Navigation Links
export const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Events', href: '/events' },
  { label: 'Categories', href: '/categories' },
  { label: 'About', href: '/about' },
] as const;

// Feature Flags
export const FEATURES = {
  DARK_MODE_ENABLED: import.meta.env.VITE_ENABLE_DARK_MODE === 'true',
  ANALYTICS_ENABLED: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  BETA_FEATURES: false,
} as const;
