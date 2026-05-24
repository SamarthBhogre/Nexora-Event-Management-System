// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message: string;
  statusCode: number;
}

// Event types
export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  organizer: string;
  capacity: number;
  registered: number;
  image?: string;
  price: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
}

// User types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'organizer' | 'admin';
  avatar?: string;
  createdAt: string;
}

// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
  userType: 'user' | 'organizer';
}

export interface AuthResponse {
  token: string;
  user: User;
}

// Pagination
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}
