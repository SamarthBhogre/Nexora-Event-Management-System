import { LoginFormData } from '@validation/loginSchema';
import { SignupFormData } from '@validation/signupSchema';
import { apiClient } from '@services/api';
import { API_ENDPOINTS } from '@/types/api';
import { STORAGE_KEYS } from '@utils/constants';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'organizer' | 'admin';
  accountStatus?: 'active' | 'suspended';
  organizationName?: string | null;
  avatar?: string | null;
  createdAt: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
  token?: string;
}

interface AuthPayload {
  token: string;
  user: User;
}

const persistSession = (payload: AuthPayload): void => {
  localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, payload.token);
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(payload.user));
  apiClient.setAuthToken(payload.token);
};

const clearSession = (): void => {
  apiClient.clearAuthToken();
  localStorage.removeItem(STORAGE_KEYS.USER);
};

export const authService = {
  async login(credentials: LoginFormData): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthPayload>(API_ENDPOINTS.AUTH.LOGIN, {
        email: credentials.email,
        password: credentials.password,
      });
      const payload = response.data.data;

      if (!payload) {
        return {
          success: false,
          message: 'Invalid login response',
        };
      }

      persistSession(payload);
      return {
        success: true,
        message: response.data.message,
        user: payload.user,
        token: payload.token,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed. Please try again.',
      };
    }
  },

  async register(userData: SignupFormData): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthPayload>(API_ENDPOINTS.AUTH.REGISTER, {
        name: userData.fullName,
        email: userData.email,
        password: userData.password,
        passwordConfirm: userData.confirmPassword,
        userType: userData.userType,
      });
      const payload = response.data.data;

      if (!payload) {
        return {
          success: false,
          message: 'Invalid registration response',
        };
      }

      persistSession(payload);
      return {
        success: true,
        message: response.data.message,
        user: payload.user,
        token: payload.token,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Signup failed. Please try again.',
      };
    }
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
    } finally {
      clearSession();
    }
  },

  async getProfile(): Promise<User | null> {
    try {
      const response = await apiClient.get<User>(API_ENDPOINTS.AUTH.PROFILE);
      return response.data.data ?? null;
    } catch {
      return null;
    }
  },

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem(STORAGE_KEYS.USER);
    if (!userStr) {
      return null;
    }

    try {
      return JSON.parse(userStr) as User;
    } catch {
      return null;
    }
  },

  isAuthenticated(): boolean {
    return Boolean(localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN));
  },

  getToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  },
};
