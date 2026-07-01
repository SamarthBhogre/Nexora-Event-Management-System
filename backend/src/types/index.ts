// User types
export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: 'user' | 'organizer' | 'admin';
  avatar?: string;
  bio?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserRegisterRequest {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
  userType: 'user' | 'organizer';
}

export interface UserLoginRequest {
  email: string;
  password: string;
}

// Event types
export interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  time: string;
  location: string;
  category: string;
  organizerId: string;
  capacity: number;
  registered: number;
  image?: string;
  price: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

export interface EventCreateRequest {
  title: string;
  description: string;
  date: Date;
  time: string;
  location: string;
  category: string;
  capacity: number;
  image?: string;
  price: number;
}

// Event Registration types
export interface EventRegistration {
  id: string;
  eventId: string;
  userId: string;
  status: 'registered' | 'cancelled' | 'attended';
  registeredAt: Date;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  statusCode: number;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// JWT Payload
export interface JwtPayload {
  id: string;
  email: string;
  role: 'user' | 'organizer' | 'admin';
  iat: number;
  exp: number;
}

// Request context
export interface RequestContext {
  userId?: string;
  userRole?: string;
  ip?: string;
  userAgent?: string;
}
