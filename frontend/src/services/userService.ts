import { apiClient } from '@services/api';
import { API_ENDPOINTS } from '@/types/api';
import type { PaginatedResponse } from '@/types';
import type { Event } from '@services/eventService';

export interface DashboardSummary {
  upcomingEvents: number;
  totalRegistrations: number;
  totalOrganizedEvents: number;
  managedUsers: number;
  totalUsers: number;
  totalOrganizers: number;
  totalEvents: number;
  activeEvents: number;
  completedEvents: number;
  totalAttendees: number;
  eventPerformance: number;
  monthlyRegistrations: number;
  monthlyUsers: number;
  monthlyEvents: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'organizer' | 'admin';
  accountStatus?: 'active' | 'suspended';
  organizationName?: string | null;
  avatar?: string | null;
  bio?: string | null;
  createdAt: string;
  updatedAt: string;
}

const inFlightRequests = new Map<string, Promise<unknown>>();

const dedupeRequest = async <T>(key: string, request: () => Promise<T>): Promise<T> => {
  const existingRequest = inFlightRequests.get(key) as Promise<T> | undefined;

  if (existingRequest) {
    return existingRequest;
  }

  const nextRequest = request().finally(() => {
    inFlightRequests.delete(key);
  });

  inFlightRequests.set(key, nextRequest);
  return nextRequest;
};

export const userService = {
  async getProfile(userId: string): Promise<UserProfile | null> {
    const response = await apiClient.get<UserProfile>(API_ENDPOINTS.USERS.GET(userId));
    return response.data.data ?? null;
  },

  async getDashboard(userId: string): Promise<DashboardSummary> {
    return dedupeRequest(`dashboard:${userId}`, async () => {
      const response = await apiClient.get<DashboardSummary>(API_ENDPOINTS.USERS.DASHBOARD(userId));
      return response.data.data || {
        upcomingEvents: 0,
        totalRegistrations: 0,
        totalOrganizedEvents: 0,
        managedUsers: 0,
        totalUsers: 0,
        totalOrganizers: 0,
        totalEvents: 0,
        activeEvents: 0,
        completedEvents: 0,
        totalAttendees: 0,
        eventPerformance: 0,
        monthlyRegistrations: 0,
        monthlyUsers: 0,
        monthlyEvents: 0,
      };
    });
  },

  async getOrganizedEvents(userId: string, page: number = 1, limit: number = 10): Promise<PaginatedResponse<Event>> {
    return dedupeRequest(`organized-events:${userId}:${page}:${limit}`, async () => {
      const response = await apiClient.get<PaginatedResponse<Event>>(API_ENDPOINTS.USERS.EVENTS(userId), {
        params: { page, limit },
      });
      return response.data.data || { items: [], total: 0, page, limit, hasMore: false };
    });
  },

  async getRegisteredEvents(userId: string, page: number = 1, limit: number = 10): Promise<PaginatedResponse<Event>> {
    return dedupeRequest(`registered-events:${userId}:${page}:${limit}`, async () => {
      const response = await apiClient.get<PaginatedResponse<Event>>(API_ENDPOINTS.USERS.REGISTERED(userId), {
        params: { page, limit },
      });
      return response.data.data || { items: [], total: 0, page, limit, hasMore: false };
    });
  },

  async listUsers(params: {
    page?: number;
    limit?: number;
    search?: string;
    role?: 'user' | 'organizer' | 'admin';
    status?: 'active' | 'suspended';
  } = {}): Promise<PaginatedResponse<UserProfile>> {
    const page = params.page ?? 1;
    const limit = params.limit ?? 10;
    const response = await apiClient.get<PaginatedResponse<UserProfile>>(API_ENDPOINTS.USERS.LIST, {
      params: {
        page,
        limit,
        search: params.search || undefined,
        role: params.role || undefined,
        status: params.status || undefined,
      },
    });
    return response.data.data || { items: [], total: 0, page, limit, hasMore: false };
  },

  async updateProfile(userId: string, input: Partial<Pick<UserProfile, 'name' | 'avatar' | 'bio' | 'organizationName'>>): Promise<UserProfile | null> {
    const response = await apiClient.put<UserProfile>(API_ENDPOINTS.USERS.UPDATE(userId), input);
    return response.data.data ?? null;
  },

  async changeRole(userId: string, role: UserProfile['role']): Promise<UserProfile | null> {
    const response = await apiClient.patch<UserProfile>(API_ENDPOINTS.USERS.ROLE(userId), { role });
    return response.data.data ?? null;
  },

  async changeStatus(userId: string, status: 'active' | 'suspended'): Promise<UserProfile | null> {
    const response = await apiClient.patch<UserProfile>(API_ENDPOINTS.USERS.STATUS(userId), { status });
    return response.data.data ?? null;
  },

  async deleteUser(userId: string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.USERS.DELETE(userId));
  },
};
