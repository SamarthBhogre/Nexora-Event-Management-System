import { query } from '@database/connection';
import { AppError } from '@middleware/errorHandler';
import { ERROR_CODES } from '@/types/api';
import { randomUUID } from 'crypto';

type EventStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
type EventSortBy = 'date' | 'popularity' | 'title';
type UserRole = 'user' | 'organizer' | 'admin';

interface EventItem {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  categoryId: string | null;
  category: string;
  organizerId: string;
  organizer: string;
  capacity: number;
  attendees: number;
  image: string | null;
  price: number;
  status: EventStatus;
  createdAt: string;
  updatedAt: string;
}

interface CategoryItem {
  id: string;
  name: string;
  icon: string | null;
  description: string | null;
  eventCount: number;
}

interface EventListInput {
  page: number;
  limit: number;
  search?: string;
  category?: string;
  sortBy: EventSortBy;
}

interface EventCreateInput {
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

interface EventUpdateInput {
  title?: string;
  description?: string;
  date?: string;
  time?: string;
  location?: string;
  category?: string;
  capacity?: number;
  image?: string;
  price?: number;
  status?: EventStatus;
}

interface AttendeeItem {
  id: string;
  userId: string;
  name: string;
  email: string;
  status: 'registered' | 'cancelled' | 'attended';
  registeredAt: string;
}

const mapEventRow = (row: any): EventItem => ({
  id: row.id,
  title: row.title,
  description: row.description,
  date: row.date instanceof Date ? row.date.toISOString().split('T')[0] : row.date,
  time: typeof row.time === 'string' ? row.time.slice(0, 5) : String(row.time).slice(0, 5),
  location: row.location,
  categoryId: row.category_id,
  category: row.category_name ?? 'Uncategorized',
  organizerId: row.organizer_id,
  organizer: row.organizer_name,
  capacity: Number(row.capacity),
  attendees: Number(row.registered),
  image: row.image,
  price: Number(row.price),
  status: row.status,
  createdAt: new Date(row.created_at).toISOString(),
  updatedAt: new Date(row.updated_at).toISOString(),
});

const getCategoryByIdentifier = async (categoryIdentifier: string): Promise<string> => {
  const [rows] = await query(
    `SELECT id
     FROM categories
     WHERE id = ? OR slug = ? OR LOWER(name) = LOWER(?)
     LIMIT 1`,
    [categoryIdentifier, categoryIdentifier, categoryIdentifier]
  );

  const category = (rows as any[])[0];
  if (!category) {
    throw new AppError(404, ERROR_CODES.NOT_FOUND, 'Category not found');
  }

  return category.id;
};

const getSortClause = (sortBy: EventSortBy): string => {
  if (sortBy === 'title') {
    return 'e.title ASC';
  }
  if (sortBy === 'popularity') {
    return 'e.registered DESC, e.date DESC';
  }
  return 'e.date DESC, e.time DESC';
};

const buildFilters = (input: EventListInput): { where: string; params: unknown[] } => {
  const conditions: string[] = [];
  const params: unknown[] = [];

  if (input.search) {
    conditions.push('(e.title LIKE ? OR e.description LIKE ? OR e.location LIKE ? OR c.name LIKE ?)');
    const keyword = `%${input.search}%`;
    params.push(keyword, keyword, keyword, keyword);
  }

  if (input.category) {
    conditions.push('(c.id = ? OR c.slug = ? OR LOWER(c.name) = LOWER(?))');
    params.push(input.category, input.category, input.category);
  }

  return {
    where: conditions.length ? `WHERE ${conditions.join(' AND ')}` : '',
    params,
  };
};

const getEventById = async (eventId: string): Promise<EventItem | null> => {
  const [rows] = await query(
    `SELECT
      e.id, e.title, e.description, e.date, e.time, e.location, e.category_id, e.organizer_id,
      e.capacity, e.registered, e.image, e.price, e.status, e.created_at, e.updated_at,
      c.name AS category_name,
      u.name AS organizer_name
     FROM events e
     LEFT JOIN categories c ON c.id = e.category_id
     INNER JOIN users u ON u.id = e.organizer_id
     WHERE e.id = ?
     LIMIT 1`,
    [eventId]
  );

  const row = (rows as any[])[0];
  return row ? mapEventRow(row) : null;
};

const assertManagePermission = (event: EventItem, requesterId: string, requesterRole: UserRole): void => {
  if (requesterRole === 'admin') {
    return;
  }

  if (event.organizerId !== requesterId) {
    throw new AppError(403, ERROR_CODES.FORBIDDEN, 'You are not allowed to modify this event');
  }
};

const assertOrganizerOwnsEvent = (event: EventItem, requesterId: string): void => {
  if (event.organizerId !== requesterId) {
    throw new AppError(403, ERROR_CODES.FORBIDDEN, 'You can only manage events you created');
  }
};

export const eventService = {
  async listCategories(): Promise<CategoryItem[]> {
    const [rows] = await query(
      `SELECT
        c.id, c.name, c.icon, c.description, COUNT(e.id) AS event_count
       FROM categories c
       LEFT JOIN events e ON e.category_id = c.id
       GROUP BY c.id, c.name, c.icon, c.description
       ORDER BY c.name ASC`
    );

    return (rows as any[]).map((row) => ({
      id: row.id,
      name: row.name,
      icon: row.icon,
      description: row.description,
      eventCount: Number(row.event_count),
    }));
  },

  async listEvents(input: EventListInput): Promise<{ items: EventItem[]; total: number }> {
    const { where, params } = buildFilters(input);
    const offset = (input.page - 1) * input.limit;

    const [countRows] = await query(
      `SELECT COUNT(*) AS total
       FROM events e
       LEFT JOIN categories c ON c.id = e.category_id
       ${where}`,
      params as any[]
    );
    const total = Number((countRows as any[])[0]?.total ?? 0);

    const [rows] = await query(
      `SELECT
        e.id, e.title, e.description, e.date, e.time, e.location, e.category_id, e.organizer_id,
        e.capacity, e.registered, e.image, e.price, e.status, e.created_at, e.updated_at,
        c.name AS category_name,
        u.name AS organizer_name
       FROM events e
       LEFT JOIN categories c ON c.id = e.category_id
       INNER JOIN users u ON u.id = e.organizer_id
       ${where}
       ORDER BY ${getSortClause(input.sortBy)}
       LIMIT ? OFFSET ?`,
      [...params, input.limit, offset] as any[]
    );

    return {
      items: (rows as any[]).map(mapEventRow),
      total,
    };
  },

  async getEvent(eventId: string): Promise<EventItem> {
    const event = await getEventById(eventId);
    if (!event) {
      throw new AppError(404, ERROR_CODES.NOT_FOUND, 'Event not found');
    }
    return event;
  },

  async createEvent(input: EventCreateInput, organizerId: string): Promise<EventItem> {
    const categoryId = await getCategoryByIdentifier(input.category);
    const eventId = randomUUID();

    await query(
      `INSERT INTO events
      (id, title, description, date, time, location, category_id, organizer_id, capacity, image, price, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'upcoming')`,
      [
        eventId,
        input.title,
        input.description,
        input.date,
        input.time,
        input.location,
        categoryId,
        organizerId,
        input.capacity,
        input.image ?? null,
        input.price,
      ]
    );

    return this.getEvent(eventId);
  },

  async duplicateEvent(eventId: string, organizerId: string): Promise<EventItem> {
    const event = await this.getEvent(eventId);
    assertOrganizerOwnsEvent(event, organizerId);
    const newEventId = randomUUID();

    await query(
      `INSERT INTO events
      (id, title, description, date, time, location, category_id, organizer_id, capacity, image, price, status)
      SELECT ?, CONCAT(title, ' Copy'), description, date, time, location, category_id, organizer_id, capacity, image, price, 'upcoming'
      FROM events
      WHERE id = ?`,
      [newEventId, eventId]
    );

    return this.getEvent(newEventId);
  },

  async updateEvent(
    eventId: string,
    payload: EventUpdateInput,
    requesterId: string,
    requesterRole: UserRole
  ): Promise<EventItem> {
    const event = await this.getEvent(eventId);
    assertManagePermission(event, requesterId, requesterRole);

    const updates: string[] = [];
    const values: unknown[] = [];

    if (payload.title !== undefined) {
      updates.push('title = ?');
      values.push(payload.title);
    }
    if (payload.description !== undefined) {
      updates.push('description = ?');
      values.push(payload.description);
    }
    if (payload.date !== undefined) {
      updates.push('date = ?');
      values.push(payload.date);
    }
    if (payload.time !== undefined) {
      updates.push('time = ?');
      values.push(payload.time);
    }
    if (payload.location !== undefined) {
      updates.push('location = ?');
      values.push(payload.location);
    }
    if (payload.capacity !== undefined) {
      if (payload.capacity < event.attendees) {
        throw new AppError(400, ERROR_CODES.VALIDATION_ERROR, 'Capacity cannot be less than current registrations');
      }
      updates.push('capacity = ?');
      values.push(payload.capacity);
    }
    if (payload.image !== undefined) {
      updates.push('image = ?');
      values.push(payload.image);
    }
    if (payload.price !== undefined) {
      updates.push('price = ?');
      values.push(payload.price);
    }
    if (payload.status !== undefined) {
      updates.push('status = ?');
      values.push(payload.status);
    }
    if (payload.category !== undefined) {
      const categoryId = await getCategoryByIdentifier(payload.category);
      updates.push('category_id = ?');
      values.push(categoryId);
    }

    if (!updates.length) {
      return event;
    }

    await query(
      `UPDATE events
       SET ${updates.join(', ')}
       WHERE id = ?`,
      [...values, eventId] as any[]
    );

    return this.getEvent(eventId);
  },

  async deleteEvent(eventId: string, requesterId: string, requesterRole: UserRole): Promise<void> {
    const event = await this.getEvent(eventId);
    assertManagePermission(event, requesterId, requesterRole);

    await query('DELETE FROM events WHERE id = ?', [eventId]);
  },

  async setEventStatus(
    eventId: string,
    status: EventStatus,
    requesterId: string,
    requesterRole: UserRole
  ): Promise<EventItem> {
    return this.updateEvent(eventId, { status }, requesterId, requesterRole);
  },

  async registerForEvent(eventId: string, userId: string): Promise<{ eventId: string; userId: string; status: string }> {
    const event = await this.getEvent(eventId);

    if (event.status === 'cancelled' || event.status === 'completed') {
      throw new AppError(400, ERROR_CODES.CONFLICT, 'Registration is closed for this event');
    }

    if (event.attendees >= event.capacity) {
      throw new AppError(409, ERROR_CODES.CONFLICT, 'Event is full');
    }

    const [existingRows] = await query(
      `SELECT id, status
       FROM event_registrations
       WHERE event_id = ? AND user_id = ?
       LIMIT 1`,
      [eventId, userId]
    );

    const existingRegistration = (existingRows as any[])[0];
    if (existingRegistration && existingRegistration.status === 'registered') {
      throw new AppError(409, ERROR_CODES.ALREADY_REGISTERED, 'You are already registered for this event');
    }

    if (existingRegistration) {
      await query(
        `UPDATE event_registrations
         SET status = 'registered', registered_at = CURRENT_TIMESTAMP
         WHERE id = ?`,
        [existingRegistration.id]
      );
    } else {
      await query(
        `INSERT INTO event_registrations (event_id, user_id, status)
         VALUES (?, ?, 'registered')`,
        [eventId, userId]
      );
    }

    await query(
      `UPDATE events
       SET registered = (
         SELECT COUNT(*)
         FROM event_registrations
         WHERE event_id = ? AND status = 'registered'
       )
       WHERE id = ?`,
      [eventId, eventId]
    );

    return {
      eventId,
      userId,
      status: 'registered',
    };
  },

  async getEventAttendees(
    eventId: string,
    requesterId: string,
    requesterRole: UserRole,
    search?: string
  ): Promise<AttendeeItem[]> {
    const event = await this.getEvent(eventId);
    assertManagePermission(event, requesterId, requesterRole);

    const params: unknown[] = [eventId];
    const searchClause = search
      ? 'AND (u.name LIKE ? OR u.email LIKE ?)'
      : '';
    if (search) {
      const keyword = `%${search}%`;
      params.push(keyword, keyword);
    }

    const [rows] = await query(
      `SELECT er.id, er.user_id, er.status, er.registered_at, u.name, u.email
       FROM event_registrations er
       INNER JOIN users u ON u.id = er.user_id
       WHERE er.event_id = ? ${searchClause}
       ORDER BY er.registered_at DESC`,
      params as any[]
    );

    return (rows as any[]).map((row) => ({
      id: row.id,
      userId: row.user_id,
      name: row.name,
      email: row.email,
      status: row.status,
      registeredAt: new Date(row.registered_at).toISOString(),
    }));
  },

  async removeAttendee(eventId: string, attendeeUserId: string, requesterId: string): Promise<void> {
    const event = await this.getEvent(eventId);
    assertOrganizerOwnsEvent(event, requesterId);

    await this.unregisterFromEvent(eventId, attendeeUserId);
  },

  async getRegistrationStats(
    eventId: string,
    requesterId: string,
    requesterRole: UserRole
  ): Promise<{ registered: number; cancelled: number; attended: number; capacity: number; fillRate: number }> {
    const event = await this.getEvent(eventId);
    assertManagePermission(event, requesterId, requesterRole);

    const [rows] = await query(
      `SELECT status, COUNT(*) AS total
       FROM event_registrations
       WHERE event_id = ?
       GROUP BY status`,
      [eventId]
    );

    const counts = { registered: 0, cancelled: 0, attended: 0 };
    (rows as any[]).forEach((row) => {
      counts[row.status as keyof typeof counts] = Number(row.total);
    });

    return {
      ...counts,
      capacity: event.capacity,
      fillRate: event.capacity > 0 ? Math.round((counts.registered / event.capacity) * 100) : 0,
    };
  },

  async unregisterFromEvent(eventId: string, userId: string): Promise<void> {
    const [rows] = await query(
      `SELECT id, status
       FROM event_registrations
       WHERE event_id = ? AND user_id = ?
       LIMIT 1`,
      [eventId, userId]
    );

    const registration = (rows as any[])[0];
    if (!registration || registration.status !== 'registered') {
      throw new AppError(404, ERROR_CODES.NOT_FOUND, 'Active registration not found');
    }

    await query(
      `UPDATE event_registrations
       SET status = 'cancelled'
       WHERE id = ?`,
      [registration.id]
    );

    await query(
      `UPDATE events
       SET registered = (
         SELECT COUNT(*)
         FROM event_registrations
         WHERE event_id = ? AND status = 'registered'
       )
       WHERE id = ?`,
      [eventId, eventId]
    );
  },

  async getOrganizerEvents(organizerId: string, page: number, limit: number): Promise<{ items: EventItem[]; total: number }> {
    const offset = (page - 1) * limit;

    const [countRows] = await query('SELECT COUNT(*) AS total FROM events WHERE organizer_id = ?', [organizerId]);
    const total = Number((countRows as any[])[0]?.total ?? 0);

    const [rows] = await query(
      `SELECT
        e.id, e.title, e.description, e.date, e.time, e.location, e.category_id, e.organizer_id,
        e.capacity, e.registered, e.image, e.price, e.status, e.created_at, e.updated_at,
        c.name AS category_name,
        u.name AS organizer_name
       FROM events e
       LEFT JOIN categories c ON c.id = e.category_id
       INNER JOIN users u ON u.id = e.organizer_id
       WHERE e.organizer_id = ?
       ORDER BY e.created_at DESC
       LIMIT ? OFFSET ?`,
      [organizerId, limit, offset]
    );

    return {
      items: (rows as any[]).map(mapEventRow),
      total,
    };
  },

  async getRegisteredEvents(userId: string, page: number, limit: number): Promise<{ items: EventItem[]; total: number }> {
    const offset = (page - 1) * limit;

    const [countRows] = await query(
      `SELECT COUNT(*) AS total
       FROM event_registrations er
       WHERE er.user_id = ? AND er.status = 'registered'`,
      [userId]
    );
    const total = Number((countRows as any[])[0]?.total ?? 0);

    const [rows] = await query(
      `SELECT
        e.id, e.title, e.description, e.date, e.time, e.location, e.category_id, e.organizer_id,
        e.capacity, e.registered, e.image, e.price, e.status, e.created_at, e.updated_at,
        c.name AS category_name,
        u.name AS organizer_name
       FROM event_registrations er
       INNER JOIN events e ON e.id = er.event_id
       LEFT JOIN categories c ON c.id = e.category_id
       INNER JOIN users u ON u.id = e.organizer_id
       WHERE er.user_id = ? AND er.status = 'registered'
       ORDER BY er.registered_at DESC
       LIMIT ? OFFSET ?`,
      [userId, limit, offset]
    );

    return {
      items: (rows as any[]).map(mapEventRow),
      total,
    };
  },
};
