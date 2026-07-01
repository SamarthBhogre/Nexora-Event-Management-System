import bcrypt from 'bcryptjs';
import { query } from '@database/connection';
import { AppError } from '@middleware/errorHandler';
import { ERROR_CODES } from '@/types/api';
import { generateToken } from '@utils/jwt';

type UserRole = 'user' | 'organizer' | 'admin';

interface UserRecord {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  accountStatus: 'active' | 'suspended';
  organizationName: string | null;
  avatar: string | null;
  createdAt: string;
}

interface UserWithPassword extends UserRecord {
  password: string;
}

interface RegisterInput {
  name: string;
  email: string;
  password: string;
  userType: 'user' | 'organizer';
}

interface LoginInput {
  email: string;
  password: string;
}

const SALT_ROUNDS = 10;

const mapUserRow = (row: any): UserRecord => ({
  id: row.id,
  name: row.name,
  email: row.email,
  role: row.role,
  accountStatus: row.account_status ?? 'active',
  organizationName: row.organization_name ?? null,
  avatar: row.avatar,
  createdAt: new Date(row.created_at).toISOString(),
});

const withoutPassword = (user: UserWithPassword): UserRecord => {
  const { password: _password, ...record } = user;
  return record;
};

const findUserByEmailWithPassword = async (email: string): Promise<UserWithPassword | null> => {
  const [rows] = await query(
    `SELECT id, name, email, password, role, account_status, organization_name, avatar, created_at
     FROM users
     WHERE email = ?
     LIMIT 1`,
    [email]
  );

  const userRow = (rows as any[])[0];
  if (!userRow) {
    return null;
  }

  return {
    ...mapUserRow(userRow),
    password: userRow.password,
  };
};

export const authService = {
  async register(input: RegisterInput): Promise<{ token: string; user: UserRecord }> {
    const existingUser = await findUserByEmailWithPassword(input.email);
    if (existingUser) {
      throw new AppError(409, ERROR_CODES.USER_ALREADY_EXISTS, 'Email already registered');
    }

    const hashedPassword = await bcrypt.hash(input.password, SALT_ROUNDS);
    await query(
      `INSERT INTO users (name, email, password, role)
       VALUES (?, ?, ?, ?)`,
      [input.name, input.email, hashedPassword, input.userType]
    );

    const createdUser = await findUserByEmailWithPassword(input.email);
    if (!createdUser) {
      throw new AppError(500, ERROR_CODES.DATABASE_ERROR, 'Failed to create user');
    }

    const token = generateToken({
      id: createdUser.id,
      email: createdUser.email,
      role: createdUser.role,
    });

    return {
      token,
      user: withoutPassword(createdUser),
    };
  },

  async login(input: LoginInput): Promise<{ token: string; user: UserRecord }> {
    const user = await findUserByEmailWithPassword(input.email);
    if (!user) {
      throw new AppError(401, ERROR_CODES.INVALID_CREDENTIALS, 'Invalid email or password');
    }
    if (user.accountStatus === 'suspended') {
      throw new AppError(403, ERROR_CODES.FORBIDDEN, 'This account is suspended');
    }

    const isValidPassword = await bcrypt.compare(input.password, user.password);
    if (!isValidPassword) {
      throw new AppError(401, ERROR_CODES.INVALID_CREDENTIALS, 'Invalid email or password');
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      token,
      user: withoutPassword(user),
    };
  },

  async getProfile(userId: string): Promise<UserRecord> {
    const [rows] = await query(
      `SELECT id, name, email, role, account_status, organization_name, avatar, created_at
       FROM users
       WHERE id = ?
       LIMIT 1`,
      [userId]
    );

    const userRow = (rows as any[])[0];
    if (!userRow) {
      throw new AppError(404, ERROR_CODES.USER_NOT_FOUND, 'User not found');
    }

    return mapUserRow(userRow);
  },
};
