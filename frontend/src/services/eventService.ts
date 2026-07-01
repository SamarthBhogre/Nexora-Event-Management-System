import { apiClient } from '@services/api';
import { API_ENDPOINTS } from '@/types/api';
import type { PaginatedResponse } from '@/types';

export interface Event {
  id: string;
  title: string;
  description: string;
  category: string;
  date: string;
  time: string;
  location: string;
  image: string;
  organizer: string;
  organizerId: string;
  attendees: number;
  capacity: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  price: number;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  eventCount: number;
  description?: string;
}

export interface EventQuery {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  sortBy?: 'date' | 'popularity' | 'title';
}

export interface EventCreateInput {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  capacity: number;
  image?: string;
  price: number;
}

export interface Attendee {
  id: string;
  userId: string;
  name: string;
  email: string;
  status: 'registered' | 'cancelled' | 'attended';
  registeredAt: string;
}

export interface RegistrationStats {
  registered: number;
  cancelled: number;
  attended: number;
  capacity: number;
  fillRate: number;
}

interface BackendEvent {
  id: string;
  title: string;
  description: string;
  category: string;
  date: string;
  time: string;
  location: string;
  image: string | null;
  organizer: string;
  organizerId: string;
  attendees: number;
  capacity: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  price: number;
  createdAt: string;
}

const mapEvent = (event: BackendEvent): Event => ({
  id: event.id,
  title: event.title,
  description: event.description,
  category: event.category,
  date: event.date,
  time: event.time,
  location: event.location,
  image: event.image || `https://via.placeholder.com/500x300?text=${encodeURIComponent(event.title)}`,
  organizer: event.organizer,
  organizerId: event.organizerId,
  attendees: event.attendees,
  capacity: event.capacity,
  status: event.status,
  price: event.price,
  createdAt: event.createdAt,
});

export const eventService = {
  async getEvents(query: EventQuery = {}): Promise<PaginatedResponse<Event>> {
    const response = await apiClient.get<PaginatedResponse<BackendEvent>>(API_ENDPOINTS.EVENTS.LIST, {
      params: {
        page: query.page ?? 1,
        limit: query.limit ?? 9,
        category: query.category || undefined,
        search: query.search || undefined,
        sortBy: query.sortBy ?? 'date',
      },
    });

    const payload = response.data.data;
    return {
      items: (payload?.items || []).map(mapEvent),
      total: payload?.total || 0,
      page: payload?.page || 1,
      limit: payload?.limit || 9,
      hasMore: payload?.hasMore || false,
    };
  },

  async getEventById(id: string): Promise<Event | null> {
    const response = await apiClient.get<BackendEvent>(API_ENDPOINTS.EVENTS.GET(id));
    const payload = response.data.data;
    return payload ? mapEvent(payload) : null;
  },

  async getCategories(): Promise<Category[]> {
    const response = await apiClient.get<Category[]>(API_ENDPOINTS.CATEGORIES.LIST);
    return (response.data.data || []).map((category) => ({
      ...category,
      icon: category.icon || '🎟️',
      description: category.description || undefined,
    }));
  },

  async getFeaturedEvents(limit: number = 3): Promise<Event[]> {
    const response = await this.getEvents({ sortBy: 'popularity', limit, page: 1 });
    return response.items;
  },

  async getTrendingEvents(limit: number = 6): Promise<Event[]> {
    const response = await this.getEvents({ sortBy: 'popularity', limit, page: 1 });
    return response.items;
  },

  async registerForEvent(eventId: string): Promise<void> {
    await apiClient.post(API_ENDPOINTS.EVENTS.REGISTER(eventId));
  },

  async unregisterFromEvent(eventId: string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.EVENTS.UNREGISTER(eventId));
  },

  async createEvent(input: EventCreateInput): Promise<Event | null> {
    const response = await apiClient.post<BackendEvent>(API_ENDPOINTS.EVENTS.CREATE, input);
    return response.data.data ? mapEvent(response.data.data) : null;
  },

  async updateEvent(eventId: string, input: Partial<EventCreateInput> & { status?: Event['status'] }): Promise<Event | null> {
    const response = await apiClient.put<BackendEvent>(API_ENDPOINTS.EVENTS.UPDATE(eventId), input);
    return response.data.data ? mapEvent(response.data.data) : null;
  },

  async deleteEvent(eventId: string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.EVENTS.DELETE(eventId));
  },

  async duplicateEvent(eventId: string): Promise<Event | null> {
    const response = await apiClient.post<BackendEvent>(API_ENDPOINTS.EVENTS.DUPLICATE(eventId));
    return response.data.data ? mapEvent(response.data.data) : null;
  },

  async publishEvent(eventId: string, published: boolean): Promise<Event | null> {
    const response = await apiClient.patch<BackendEvent>(API_ENDPOINTS.EVENTS.PUBLISH(eventId), { published });
    return response.data.data ? mapEvent(response.data.data) : null;
  },

  async cancelEvent(eventId: string): Promise<Event | null> {
    const response = await apiClient.patch<BackendEvent>(API_ENDPOINTS.EVENTS.CANCEL(eventId));
    return response.data.data ? mapEvent(response.data.data) : null;
  },

  async moderateEvent(eventId: string, action: 'remove' | 'archive' | 'restore' | 'feature'): Promise<Event | null> {
    const response = await apiClient.patch<BackendEvent>(API_ENDPOINTS.EVENTS.MODERATE(eventId), { action });
    return response.data.data ? mapEvent(response.data.data) : null;
  },

  async getAttendees(eventId: string, search?: string): Promise<Attendee[]> {
    const response = await apiClient.get<Attendee[]>(API_ENDPOINTS.EVENTS.ATTENDEES(eventId), {
      params: { search: search || undefined },
    });
    return response.data.data || [];
  },

  async removeAttendee(eventId: string, userId: string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.EVENTS.REMOVE_ATTENDEE(eventId, userId));
  },

  async getRegistrationStats(eventId: string): Promise<RegistrationStats | null> {
    const response = await apiClient.get<RegistrationStats>(API_ENDPOINTS.EVENTS.REGISTRATION_STATS(eventId));
    return response.data.data ?? null;
  },
};
