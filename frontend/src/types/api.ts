// API endpoint types
export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    PROFILE: '/auth/profile',
  },
  
  // Events
  EVENTS: {
    LIST: '/events',
    CREATE: '/events',
    GET: (id: string) => `/events/${id}`,
    UPDATE: (id: string) => `/events/${id}`,
    DELETE: (id: string) => `/events/${id}`,
    SEARCH: '/events/search',
    FILTER: '/events/filter',
    REGISTER: (id: string) => `/events/${id}/register`,
    UNREGISTER: (id: string) => `/events/${id}/unregister`,
    DUPLICATE: (id: string) => `/events/${id}/duplicate`,
    PUBLISH: (id: string) => `/events/${id}/publish`,
    CANCEL: (id: string) => `/events/${id}/cancel`,
    MODERATE: (id: string) => `/events/${id}/moderation`,
    ATTENDEES: (id: string) => `/events/${id}/attendees`,
    REMOVE_ATTENDEE: (eventId: string, userId: string) => `/events/${eventId}/attendees/${userId}`,
    REGISTRATION_STATS: (id: string) => `/events/${id}/registration-stats`,
  },
  
  // Users
  USERS: {
    GET: (id: string) => `/users/${id}`,
    UPDATE: (id: string) => `/users/${id}`,
    EVENTS: (id: string) => `/users/${id}/events`,
    REGISTERED: (id: string) => `/users/${id}/registered-events`,
    DASHBOARD: (id: string) => `/users/${id}/dashboard`,
    LIST: '/users',
    ROLE: (id: string) => `/users/${id}/role`,
    STATUS: (id: string) => `/users/${id}/status`,
    DELETE: (id: string) => `/users/${id}`,
  },
  
  // Categories
  CATEGORIES: {
    LIST: '/categories',
    GET: (id: string) => `/categories/${id}`,
  },
} as const;

// API error types
export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    details?: Record<string, string>;
  };
}

// Request config types
export interface RequestConfig {
  headers?: Record<string, string>;
  params?: Record<string, any>;
  timeout?: number;
}
