# ⚡ QUICK START GUIDE - NEXORA

## 🚀 Get Running in 5 Minutes

### Prerequisites
- Node.js 18+
- MySQL 8.0+
- Git

### Step 1: Database Setup (2 min)

```bash
# Create database
mysql -u root -p -e "CREATE DATABASE syncova CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# Run migrations
mysql -u root -p syncova < backend/src/database/migrations/initial.sql
```

### Step 2: Backend (2 min)

```bash
cd backend

# Install & setup
npm install
cp .env.example .env

# Edit .env with your MySQL credentials
# Then start server
npm run dev

# ✅ Should show: 🚀 Server running on http://localhost:3000
```

### Step 3: Frontend (1 min)

```bash
cd frontend

# Install & setup
npm install
cp .env.example .env
npm run dev

# ✅ Should open: http://localhost:5173
```

---

## 📋 Environment Templates

### Backend .env
```env
PORT=3000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=password
DB_NAME=syncova
JWT_SECRET=change_me_in_production
CORS_ORIGIN=http://localhost:5173
LOG_LEVEL=debug
```

### Frontend .env
```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_NAME=Syncova
VITE_ENABLE_DARK_MODE=true
VITE_ENABLE_ANALYTICS=false
```

---

## 🔗 Important URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:3000/api |
| Health Check | http://localhost:3000/api/health |
| MySQL | localhost:3306 |

---

## 📁 Key Files

### Frontend
- **App.tsx** - Main routing
- **vite.config.ts** - Build config
- **tailwind.config.js** - Styling
- **tsconfig.json** - TypeScript config

### Backend
- **app.ts** - Express setup
- **server.ts** - Entry point
- **routes/** - API endpoints
- **middleware/** - Auth & validation

---

## 🛠️ Essential Commands

### Frontend
```bash
npm run dev           # Development
npm run build         # Production build
npm run type-check    # Type checking
```

### Backend
```bash
npm run dev           # Development
npm run build         # Compilation
npm run type-check    # Type checking
```

### Database
```bash
# Connect
mysql -u root -p syncova

# Show tables
SHOW TABLES;

# Reset database
DROP DATABASE syncova;
CREATE DATABASE syncova;
mysql -u root -p syncova < backend/src/database/migrations/initial.sql
```

---

## 📊 Project Structure Summary

```
syncova/
├── frontend/        # React + TypeScript + Vite
│   ├── src/
│   │   ├── components/  # UI components
│   │   ├── pages/       # Route pages
│   │   ├── hooks/       # Custom hooks
│   │   ├── services/    # API calls
│   │   └── types/       # TypeScript types
│   └── tailwind.config.js
├── backend/         # Express + TypeScript
│   ├── src/
│   │   ├── routes/      # API routes
│   │   ├── middleware/  # Auth, validation
│   │   ├── database/    # DB config
│   │   ├── config/      # Environment
│   │   └── types/       # TypeScript types
│   └── tsconfig.json
└── README.md
```

---

## 🐛 Quick Troubleshooting

| Issue | Fix |
|-------|-----|
| Database won't connect | Check MySQL running: `mysql -u root -p` |
| Port already in use | Kill process: `lsof -i :3000` (macOS) |
| CORS error | Check CORS_ORIGIN in backend .env |
| Tailwind styles missing | Run: `npm run build` in frontend |
| JWT errors | Check JWT_SECRET in backend .env |

---

## 🎯 What's Ready

✅ Frontend project boilerplate  
✅ Backend API skeleton  
✅ Database schema  
✅ Authentication middleware  
✅ Reusable UI components  
✅ Type definitions  
✅ Configuration system  

---

## 📝 Next Steps

1. **Login/Register** (Phase 2)
   - Implement auth controllers
   - Add user management

2. **Event CRUD** (Phase 2)
   - Create event management
   - Add event search/filter

3. **Registration System** (Phase 2)
   - Event registration logic
   - Attendee management

4. **Dashboards** (Phase 2)
   - Organizer dashboard
   - Admin dashboard

---

## 📞 Support Files

- **SETUP_GUIDE.md** - Detailed setup instructions
- **README.md** - Project overview
- **frontend/README.md** - Frontend docs
- **backend/README.md** - Backend docs

---

**Version**: 1.0  
**Last Updated**: May 2025  
**Status**: ✅ Ready for Phase 2
