# 📚 NEXORA PHASE 1 - COMPLETE SETUP GUIDE

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Development Environment Setup](#development-environment-setup)
3. [Frontend Setup](#frontend-setup)
4. [Backend Setup](#backend-setup)
5. [Database Setup](#database-setup)
6. [Running the Application](#running-the-application)
7. [Project Architecture](#project-architecture)
8. [Development Workflow](#development-workflow)
9. [Common Commands Reference](#common-commands-reference)
10. [Troubleshooting](#troubleshooting)

---

## 🎯 Project Overview

**Project Name**: Nexora  
**Phase**: Phase 1 - Setup & Planning  
**Status**: ✅ Complete Architecture Setup  

### What's Included

✅ Frontend (React + TypeScript + Vite + Tailwind CSS)  
✅ Backend (Express + TypeScript + MySQL)  
✅ Project Structure  
✅ Configuration Files  
✅ Reusable Components  
✅ Authentication System Architecture  
✅ Database Schema  
✅ API Routes (Skeleton)  

---

## 💻 Development Environment Setup

### System Requirements

- **Node.js**: 18.0.0 or higher
- **npm**: 9.0.0 or higher (or yarn/pnpm)
- **MySQL**: 8.0.0 or higher
- **Git**: 2.30.0 or higher

### Installation Steps

#### 1. Verify Node.js Installation

```bash
node --version  # Should be v18+
npm --version   # Should be 9+
```

#### 2. Install MySQL (if not already installed)

**Windows (using Chocolatey)**:
```bash
choco install mysql
```

**macOS (using Homebrew)**:
```bash
brew install mysql
brew services start mysql
```

**Linux (Ubuntu)**:
```bash
sudo apt-get install mysql-server
sudo systemctl start mysql
```

#### 3. Verify MySQL Installation

```bash
mysql --version
mysql -u root -p  # Connect to MySQL (password defaults to empty)
```

#### 4. Create MySQL User (Recommended)

```bash
mysql -u root -p

CREATE USER 'syncova'@'localhost' IDENTIFIED BY 'password123';
GRANT ALL PRIVILEGES ON syncova.* TO 'syncova'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

---

## 🎨 Frontend Setup

### Step 1: Navigate to Frontend Directory

```bash
cd frontend
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Create Environment File

```bash
cp .env.example .env
```

Edit `.env`:
```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_NAME=Syncova
VITE_ENABLE_DARK_MODE=true
VITE_ENABLE_ANALYTICS=false
```

### Step 4: Start Development Server

```bash
npm run dev
```

Frontend will open at: `http://localhost:5173`

### Step 5: Verify Installation

- Homepage loads successfully
- Dark mode toggle works
- Navigation works
- No console errors

### Frontend Commands

```bash
npm run dev           # Start dev server
npm run build         # Build for production
npm run preview       # Preview production build
npm run lint          # Run ESLint
npm run type-check    # Check TypeScript types
```

---

## 🔧 Backend Setup

### Step 1: Navigate to Backend Directory

```bash
cd backend
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Create Environment File

```bash
cp .env.example .env
```

Edit `.env`:
```env
PORT=3000
NODE_ENV=development
APP_NAME=Syncova

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=password
DB_NAME=syncova

JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_REFRESH_SECRET=your_super_secret_refresh_key_change_this_in_production
JWT_EXPIRE=24h
JWT_REFRESH_EXPIRE=7d

CORS_ORIGIN=http://localhost:5173

LOG_LEVEL=debug
```

### Step 4: Verify Database Connection

```bash
# Test connection
mysql -u root -p -h localhost -P 3306
```

### Step 5: Start Development Server

```bash
npm run dev
```

Backend will start at: `http://localhost:3000`

Health check: `http://localhost:3000/api/health`

### Step 6: Verify Installation

- Server starts without errors
- No database connection errors
- Health endpoint returns success

### Backend Commands

```bash
npm run dev           # Start dev server
npm run build         # Build TypeScript
npm start             # Start production
npm run lint          # Run ESLint
npm run type-check    # Check TypeScript types
npm run migrate       # Run migrations
```

---

## 🗄️ Database Setup

### Step 1: Create Database

```bash
mysql -u root -p

CREATE DATABASE syncova CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

### Step 2: Run Migrations

Option A (Automatic):
```bash
cd backend
npm run migrate
```

Option B (Manual):
```bash
mysql -u root -p syncova < src/database/migrations/initial.sql
```

### Step 3: Verify Tables

```bash
mysql -u root -p
USE syncova;
SHOW TABLES;
DESC users;
DESC events;
DESC event_registrations;
EXIT;
```

### Database Schema

**Users Table**
- id (UUID)
- name (VARCHAR 255)
- email (VARCHAR 255, UNIQUE)
- password (VARCHAR 255, hashed)
- role (ENUM: user, organizer, admin)
- avatar (VARCHAR 255, nullable)
- bio (TEXT, nullable)
- created_at, updated_at

**Events Table**
- id (UUID)
- title, description
- date, time, location
- category_id (FK)
- organizer_id (FK)
- capacity, registered
- price, status
- created_at, updated_at

**Event_Registrations Table**
- id (UUID)
- event_id (FK), user_id (FK)
- status (ENUM: registered, cancelled, attended)
- registered_at

---

## 🚀 Running the Application

### Complete Startup Guide

#### Terminal 1 - Backend

```bash
cd backend
npm run dev
# Waits for: ✅ Database connected
#            🚀 Server running on http://localhost:3000
```

#### Terminal 2 - Frontend

```bash
cd frontend
npm run dev
# Waits for: VITE v4.5.0 ready in XXXms
#            ➜  Local:   http://localhost:5173/
```

#### Access Application

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:3000/api`
- Health Check: `http://localhost:3000/api/health`

---

## 🏗️ Project Architecture

### Frontend Architecture

```
Frontend (React)
├── Components (Reusable UI)
│   ├── Common (Button, Input, Card, Modal)
│   ├── Layout (Navbar, Footer, MainLayout)
│   └── Sections (Hero, Features, CTA)
├── Pages (Route components)
│   ├── Home
│   └── NotFound
├── Hooks (Custom React hooks)
│   ├── useTheme
│   └── useApi
├── Context (Global state)
│   └── ThemeContext
├── Services (API calls)
│   └── api.ts (Axios instance)
├── Types (TypeScript definitions)
├── Utils (Helpers)
└── Styles (CSS)
```

### Backend Architecture

```
Backend (Express)
├── Routes (API endpoints)
│   ├── auth.ts
│   ├── events.ts
│   └── users.ts
├── Controllers (Business logic - Phase 2)
├── Services (Data access - Phase 2)
├── Middleware
│   ├── auth.ts
│   ├── errorHandler.ts
│   └── validation.ts
├── Database
│   ├── connection.ts
│   └── migrations/
├── Config
│   └── environment.ts
├── Types
└── Utils
```

---

## 👨‍💻 Development Workflow

### Git Workflow

```bash
# 1. Create feature branch
git checkout -b feature/auth-system

# 2. Make changes
# 3. Commit changes
git add .
git commit -m "feat: implement auth system"

# 4. Push to GitHub
git push origin feature/auth-system

# 5. Create Pull Request
# 6. Code review
# 7. Merge to main
```

### Code Style Guidelines

**Frontend**:
- Use functional components with hooks
- Props: FC<Props> pattern
- CSS: Tailwind classes
- File naming: PascalCase for components, camelCase for utils

**Backend**:
- Use async/await
- Proper error handling
- TypeScript strict mode
- File naming: camelCase for functions, PascalCase for classes

### Type Checking Before Commit

```bash
# Frontend
cd frontend && npm run type-check

# Backend
cd backend && npm run type-check
```

---

## 📖 Common Commands Reference

### Frontend Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run preview          # Preview build

# Code quality
npm run lint             # Run ESLint
npm run type-check       # TypeScript check

# Cleanup
rm -rf node_modules      # Remove dependencies
rm package-lock.json     # Remove lock file
npm install              # Reinstall clean
```

### Backend Commands

```bash
# Development
npm run dev              # Start with auto-reload
npm run build            # Compile TypeScript
npm start                # Run compiled code

# Code quality
npm run lint             # Run ESLint
npm run type-check       # TypeScript check

# Database
npm run migrate          # Run migrations

# Cleanup
rm -rf dist              # Remove build
rm -rf node_modules      # Remove dependencies
```

### MySQL Commands

```bash
# Connect to MySQL
mysql -u root -p

# Show databases
SHOW DATABASES;

# Use specific database
USE syncova;

# Show tables
SHOW TABLES;

# Describe table
DESC users;

# Query data
SELECT * FROM users;

# Create database
CREATE DATABASE syncova;

# Drop database
DROP DATABASE syncova;

# Exit MySQL
EXIT;
```

---

## 🐛 Troubleshooting

### Frontend Issues

**Problem**: Port 5173 already in use
```bash
# Solution: Kill process on port
# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :5173
kill -9 <PID>
```

**Problem**: Cannot connect to backend API
```bash
# Check backend is running
curl http://localhost:3000/api/health

# Check CORS origin in backend .env
# Should match frontend URL (http://localhost:5173)
```

**Problem**: Styles not loading (Tailwind CSS)
```bash
# Rebuild Tailwind CSS
npm run build

# Clear cache
rm -rf .vite
npm run dev
```

### Backend Issues

**Problem**: Database connection failed
```bash
# Check MySQL is running
mysql -u root -p

# Verify credentials in .env
# HOST, PORT, USER, PASSWORD, NAME

# Test connection string
mysql -h localhost -P 3306 -u root -p syncova
```

**Problem**: Port 3000 already in use
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :3000
kill -9 <PID>
```

**Problem**: JWT token not working
```bash
# Verify JWT_SECRET is set in .env
# Check token format: "Bearer <token>"
# Verify token hasn't expired (24h default)
```

**Problem**: Migration not running
```bash
# Manual migration
mysql -u root -p syncova < src/database/migrations/initial.sql

# Or run queries manually in MySQL CLI
```

### General Issues

**Problem**: npm install fails
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and lock file
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

**Problem**: TypeScript compilation error
```bash
# Check syntax
npm run type-check

# Rebuild
npm run build

# Clear ts cache (if using tsx)
rm -rf node_modules/.vite
```

---

## 📞 Getting Help

### Debug Logs

**Frontend**:
```bash
# Enable debug mode in browser console
localStorage.setItem('debug', '*')
```

**Backend**:
```bash
# Set LOG_LEVEL to debug
LOG_LEVEL=debug npm run dev
```

### Common Error Messages

| Error | Solution |
|-------|----------|
| `connect ECONNREFUSED 127.0.0.1:3306` | MySQL not running |
| `EADDRINUSE :::3000` | Port 3000 in use |
| `CORS error` | Check CORS_ORIGIN in .env |
| `Cannot find module '@types/...'` | Run `npm install` |
| `Invalid token` | Token expired, login again |

---

## ✅ Phase 1 Checklist

- [x] Frontend project setup with Vite
- [x] Backend project setup with Express
- [x] Tailwind CSS configuration
- [x] React Router setup
- [x] Environment variables structure
- [x] Reusable UI components
- [x] Homepage layout
- [x] API service layer
- [x] Authentication middleware
- [x] Database schema
- [x] Error handling
- [x] Logging system
- [x] Project documentation

---

## 🔮 Phase 2 Prep

Ready for Phase 2:
- [ ] User authentication (Login/Register)
- [ ] Event CRUD operations
- [ ] Event registration system
- [ ] User dashboard
- [ ] Event search & filter
- [ ] Admin dashboard
- [ ] Email notifications
- [ ] API integration testing

---

## 📚 Useful Resources

### Documentation
- [React Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Express Guide](https://expressjs.com)
- [Tailwind CSS](https://tailwindcss.com)
- [MySQL Docs](https://dev.mysql.com/doc)
- [JWT.io](https://jwt.io)

### Tools
- [Postman](https://www.postman.com/) - API testing
- [VS Code](https://code.visualstudio.com/) - Editor
- [MySQL Workbench](https://www.mysql.com/products/workbench/) - DB Management
- [Git](https://git-scm.com/) - Version control

---

## 📝 Notes for Team

### Dhyey (UI/UX)
- UI designs are implemented in components/
- Review Tailwind configurations
- Color palette set in tailwind.config.js
- Dark mode support enabled

### Vidhan (Database)
- Schema in backend/src/database/migrations/initial.sql
- Connection setup in backend/src/database/connection.ts
- Ready for optimization in Phase 2

### Samarth (Full-Stack)
- Frontend boilerplate complete
- Backend skeleton ready
- API routes created for Phase 2
- Run: `npm run dev` in both directories

### Manthan (QA)
- Testing guide: [To be created in Phase 2]
- API Postman collection: [Ready in Phase 2]
- E2E testing: [Ready in Phase 2]

---

**Status**: ✅ Phase 1 Complete  
**Next**: Phase 2 - Core Features Implementation  
**Timeline**: 2 weeks for Phase 2

---

*Document Version: 1.0*  
*Last Updated: May 24, 2025*
