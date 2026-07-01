import { getConnection, query } from '@database/connection';
import { AppError } from '@middleware/errorHandler';
import { ERROR_CODES } from '@/types/api';

type UserRole = 'user' | 'organizer' | 'admin';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  accountStatus: 'active' | 'suspended';
  organizationName: string | null;
  avatar: string | null;
  bio: string | null;
  createdAt: string;
  updatedAt: string;
}

interface UserUpdateInput {
  name?: string;
  avatar?: string;
  bio?: string;
  organizationName?: string | null;
}

const mapUserRow = (row: any): UserProfile => ({
  id: row.id,
  name: row.name,
  email: row.email,
  role: row.role,
  accountStatus: row.account_status ?? 'active',
  organizationName: row.organization_name ?? null,
  avatar: row.avatar,
  bio: row.bio,
  createdAt: new Date(row.created_at).toISOString(),
  updatedAt: new Date(row.updated_at).toISOString(),
});

export const userService = {
  async getUserById(userId: string): Promise<UserProfile> {
    const [rows] = await query(
      `SELECT id, name, email, role, account_status, organization_name, avatar, bio, created_at, updated_at
       FROM users
       WHERE id = ?
       LIMIT 1`,
      [userId]
    );
    const row = (rows as any[])[0];
    if (!row) {
      throw new AppError(404, ERROR_CODES.USER_NOT_FOUND, 'User not found');
    }

    return mapUserRow(row);
  },

  async updateUserById(userId: string, input: UserUpdateInput): Promise<UserProfile> {
    const updates: string[] = [];
    const values: unknown[] = [];

    if (input.name !== undefined) {
      updates.push('name = ?');
      values.push(input.name);
    }
    if (input.avatar !== undefined) {
      updates.push('avatar = ?');
      values.push(input.avatar);
    }
    if (input.bio !== undefined) {
      updates.push('bio = ?');
      values.push(input.bio);
    }
    if (input.organizationName !== undefined) {
      updates.push('organization_name = ?');
      values.push(input.organizationName);
    }

    if (updates.length) {
      await query(
        `UPDATE users
         SET ${updates.join(', ')}
         WHERE id = ?`,
        [...values, userId] as any[]
      );
    }

    return this.getUserById(userId);
  },

  async listUsers(input: {
    page: number;
    limit: number;
    search?: string;
    role?: UserRole;
    status?: 'active' | 'suspended';
  }): Promise<{ items: UserProfile[]; total: number }> {
    const conditions: string[] = [];
    const params: unknown[] = [];
    const offset = (input.page - 1) * input.limit;

    if (input.search) {
      conditions.push('(name LIKE ? OR email LIKE ?)');
      const keyword = `%${input.search}%`;
      params.push(keyword, keyword);
    }
    if (input.role) {
      conditions.push('role = ?');
      params.push(input.role);
    }
    if (input.status) {
      conditions.push('account_status = ?');
      params.push(input.status);
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const [countRows] = await query(`SELECT COUNT(*) AS total FROM users ${where}`, params as any[]);
    const [rows] = await query(
      `SELECT id, name, email, role, account_status, organization_name, avatar, bio, created_at, updated_at
       FROM users
       ${where}
       ORDER BY created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, input.limit, offset] as any[]
    );

    return {
      items: (rows as any[]).map(mapUserRow),
      total: Number((countRows as any[])[0]?.total ?? 0),
    };
  },

  async changeUserRole(userId: string, role: UserRole): Promise<UserProfile> {
    await query('UPDATE users SET role = ? WHERE id = ?', [role, userId]);
    return this.getUserById(userId);
  },

  async changeUserStatus(userId: string, status: 'active' | 'suspended'): Promise<UserProfile> {
    await query('UPDATE users SET account_status = ? WHERE id = ?', [status, userId]);
    return this.getUserById(userId);
  },

  async deleteUserById(userId: string): Promise<void> {
    const profile = await this.getUserById(userId);
    if (profile.role === 'admin') {
      throw new AppError(400, ERROR_CODES.VALIDATION_ERROR, 'Admin accounts cannot be deleted');
    }

    const connection = await getConnection();
    try {
      await connection.beginTransaction();

      await connection.query(
        `DELETE er
         FROM event_registrations er
         INNER JOIN events e ON e.id = er.event_id
         WHERE e.organizer_id = ?`,
        [userId]
      );
      await connection.query('DELETE FROM events WHERE organizer_id = ?', [userId]);
      await connection.query('DELETE FROM event_registrations WHERE user_id = ?', [userId]);
      await connection.query('DELETE FROM users WHERE id = ?', [userId]);

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  async getDashboardCounts(userId: string, role: UserRole): Promise<{
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
  }> {
    const [registeredRows] = await query(
      `SELECT COUNT(*) AS total
       FROM event_registrations
       WHERE user_id = ? AND status = 'registered'`,
      [userId]
    );

    const [organizedRows] = await query(
      `SELECT COUNT(*) AS total
       FROM events
       WHERE organizer_id = ?`,
      [userId]
    );

    const [organizerRegistrationRows] = await query(
      `SELECT COUNT(er.id) AS total
       FROM event_registrations er
       INNER JOIN events e ON e.id = er.event_id
       WHERE e.organizer_id = ? AND er.status = 'registered'`,
      [userId]
    );

    const [organizerAttendeeRows] = await query(
      `SELECT COALESCE(SUM(registered), 0) AS total, COALESCE(SUM(capacity), 0) AS capacity
       FROM events
       WHERE organizer_id = ?`,
      [userId]
    );

    const [platformUpcomingRows] = await query(
      `SELECT COUNT(*) AS total
       FROM events
       WHERE date >= CURDATE() AND status = 'upcoming'`
    );

    const [userUpcomingRows] = await query(
      `SELECT COUNT(*) AS total
       FROM event_registrations er
       INNER JOIN events e ON e.id = er.event_id
       WHERE er.user_id = ? AND er.status = 'registered' AND e.date >= CURDATE() AND e.status = 'upcoming'`,
      [userId]
    );

    const [organizerUpcomingRows] = await query(
      `SELECT COUNT(*) AS total
       FROM events
       WHERE organizer_id = ? AND date >= CURDATE() AND status = 'upcoming'`,
      [userId]
    );

    let managedUsers = 0;
    let totalUsers = 0;
    let totalOrganizers = 0;
    let totalEvents = 0;
    let activeEvents = 0;
    let completedEvents = 0;
    let totalRegistrationsAll = 0;
    let monthlyRegistrations = 0;
    let monthlyUsers = 0;
    let monthlyEvents = 0;
    if (role === 'admin') {
      const [userRows] = await query('SELECT COUNT(*) AS total FROM users');
      managedUsers = Number((userRows as any[])[0]?.total ?? 0);
      totalUsers = managedUsers;

      const [organizerRows] = await query("SELECT COUNT(*) AS total FROM users WHERE role = 'organizer'");
      totalOrganizers = Number((organizerRows as any[])[0]?.total ?? 0);

      const [eventRows] = await query('SELECT COUNT(*) AS total FROM events');
      totalEvents = Number((eventRows as any[])[0]?.total ?? 0);

      const [activeRows] = await query("SELECT COUNT(*) AS total FROM events WHERE status IN ('upcoming', 'ongoing')");
      activeEvents = Number((activeRows as any[])[0]?.total ?? 0);

      const [completedRows] = await query("SELECT COUNT(*) AS total FROM events WHERE status = 'completed'");
      completedEvents = Number((completedRows as any[])[0]?.total ?? 0);

      const [registrationRows] = await query("SELECT COUNT(*) AS total FROM event_registrations WHERE status = 'registered'");
      totalRegistrationsAll = Number((registrationRows as any[])[0]?.total ?? 0);

      const [monthlyRegistrationRows] = await query(
        `SELECT COUNT(*) AS total FROM event_registrations
         WHERE registered_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)`
      );
      monthlyRegistrations = Number((monthlyRegistrationRows as any[])[0]?.total ?? 0);

      const [monthlyUserRows] = await query(
        `SELECT COUNT(*) AS total FROM users
         WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)`
      );
      monthlyUsers = Number((monthlyUserRows as any[])[0]?.total ?? 0);

      const [monthlyEventRows] = await query(
        `SELECT COUNT(*) AS total FROM events
         WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)`
      );
      monthlyEvents = Number((monthlyEventRows as any[])[0]?.total ?? 0);
    }

    const organizerAttendeeStats = (organizerAttendeeRows as any[])[0] ?? {};
    const totalAttendees = Number(organizerAttendeeStats.total ?? 0);
    const organizerCapacity = Number(organizerAttendeeStats.capacity ?? 0);

    const personalRegistrations = Number((registeredRows as any[])[0]?.total ?? 0);
    const organizerRegistrations = Number((organizerRegistrationRows as any[])[0]?.total ?? 0);

    return {
      upcomingEvents: role === 'organizer'
        ? Number((organizerUpcomingRows as any[])[0]?.total ?? 0)
        : role === 'admin'
        ? Number((platformUpcomingRows as any[])[0]?.total ?? 0)
        : Number((userUpcomingRows as any[])[0]?.total ?? 0),
      totalRegistrations: role === 'admin'
        ? totalRegistrationsAll
        : role === 'organizer'
        ? organizerRegistrations
        : personalRegistrations,
      totalOrganizedEvents: Number((organizedRows as any[])[0]?.total ?? 0),
      managedUsers,
      totalUsers,
      totalOrganizers,
      totalEvents,
      activeEvents,
      completedEvents,
      totalAttendees,
      eventPerformance: organizerCapacity > 0 ? Math.round((totalAttendees / organizerCapacity) * 100) : 0,
      monthlyRegistrations,
      monthlyUsers,
      monthlyEvents,
    };
  },
};
