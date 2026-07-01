# Nexora Backend API

Enterprise-grade backend API for the Nexora Event Management platform, built with Express.js and TypeScript.

## 🛠️ Tech Stack

- **Node.js 18+** - JavaScript runtime
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **MySQL 8.0+** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## 📁 Project Structure

```
src/
├── app.ts                 # Express app setup
├── server.ts              # Server entry point
├── routes/                # API route handlers
│   ├── index.ts
│   ├── auth.ts
│   ├── events.ts
│   └── users.ts
├── controllers/           # Business logic (Phase 2)
├── services/              # Data access layer (Phase 2)
├── middleware/            # Custom middleware
│   ├── auth.ts
│   ├── errorHandler.ts
│   └── validation.ts
├── database/              # Database setup
│   ├── connection.ts
│   ├── migrations/
│   └── queries.ts (Phase 2)
├── config/                # Configuration
│   └── environment.ts
├── types/                 # TypeScript types
├── utils/                 # Helper functions
└── constants.ts           # Constants
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- MySQL 8.0+
- npm or yarn

### Installation

```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your configuration
# Make sure MySQL is running and accessible
```

### Database Setup

1. Create MySQL database:
```sql
CREATE DATABASE syncova;
```

2. Run migrations:
```bash
npm run migrate
# Or manually import src/database/migrations/initial.sql
```

### Development

```bash
# Start dev server with hot reload
npm run dev

# Server runs on http://localhost:3000/api
```

### Production

```bash
# Build TypeScript
npm run build

# Start production server
npm start
```

## 📚 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Health Check
```
GET /health
```

### Authentication

#### Login
```
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Password123!"
}
```

#### Register
```
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "Password123!",
  "passwordConfirm": "Password123!",
  "userType": "user" // or "organizer"
}
```

#### Get Profile
```
GET /auth/profile
Authorization: Bearer <token>
```

### Events

#### Get All Events
```
GET /events?page=1&limit=10
Authorization: Bearer <token> (optional)
```

#### Get Event Details
```
GET /events/:id
Authorization: Bearer <token> (optional)
```

#### Create Event
```
POST /events
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Tech Conference 2025",
  "description": "Annual tech conference",
  "date": "2025-06-01",
  "time": "10:00",
  "location": "Conference Hall, City",
  "category": "tech",
  "capacity": 500,
  "price": 49.99
}
```

#### Register for Event
```
POST /events/:id/register
Authorization: Bearer <token>
```

#### Unregister from Event
```
DELETE /events/:id/unregister
Authorization: Bearer <token>
```

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication:

1. User logs in with email and password
2. Server returns `token` and `refreshToken`
3. Client sends `token` in `Authorization: Bearer <token>` header
4. Token expires after 24 hours
5. Use `refreshToken` to get a new `token`

## 🗄️ Database Schema

### Users Table
```sql
- id (UUID, Primary Key)
- name
- email (Unique)
- password (hashed)
- role (user, organizer, admin)
- avatar
- bio
- created_at
- updated_at
```

### Events Table
```sql
- id (UUID, Primary Key)
- title
- description
- date
- time
- location
- category_id (FK)
- organizer_id (FK to users)
- capacity
- registered
- price
- status
- created_at
- updated_at
```

### Event Registrations Table
```sql
- id (UUID, Primary Key)
- event_id (FK)
- user_id (FK)
- status
- registered_at
```

## 🔧 Environment Variables

```env
# Server
PORT=3000
NODE_ENV=development
APP_NAME=Syncova

# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=password
DB_NAME=syncova

# JWT
JWT_SECRET=your_secret_key
JWT_REFRESH_SECRET=your_refresh_secret
JWT_EXPIRE=24h
JWT_REFRESH_EXPIRE=7d

# CORS
CORS_ORIGIN=http://localhost:5173

# Logging
LOG_LEVEL=debug
```

## 📝 Validation Rules

### Password Requirements
- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number
- At least 1 special character (!@#$%^&*)

### Event Title
- 5-255 characters

### Event Description
- 10-5000 characters

### Event Capacity
- 1-10,000

### Event Price
- 0-999,999.99

## 🚨 Error Handling

All errors return consistent format:

```json
{
  "success": false,
  "message": "Error message",
  "error": {
    "code": "ERROR_CODE",
    "details": {
      "field": ["error message"]
    }
  },
  "statusCode": 400,
  "timestamp": "2025-05-24T10:30:00.000Z"
}
```

## 🧪 Testing

Testing endpoints with Postman or curl:

```bash
# Health check
curl http://localhost:3000/api/health

# Create event (requires auth)
curl -X POST http://localhost:3000/api/events \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{...event data...}'
```

## 📦 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build TypeScript
npm start            # Start production server
npm run lint         # Run ESLint
npm run type-check   # Check TypeScript types
npm run migrate      # Run database migrations
```

## 🔄 Deployment

1. Build the project: `npm run build`
2. Set production environment variables
3. Run: `npm start`
4. Use a process manager like PM2 or systemd
5. Set up a reverse proxy (nginx, Apache)

## 📚 Resources

- [Express.js Documentation](https://expressjs.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [MySQL Documentation](https://dev.mysql.com/doc)
- [JWT Guide](https://jwt.io)

## 🐛 Debugging

Enable debug logging:
```bash
LOG_LEVEL=debug npm run dev
```

## 👥 Contributing

1. Follow coding standards
2. Add proper error handling
3. Include validation
4. Write clear commit messages
5. Test before pushing

## 📄 License

MIT License - Team Project 2025

---

**Status**: Phase 1 - Setup & Planning
**Last Updated**: May 2025
