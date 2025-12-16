# 🩸 LiForce - Quick Reference Guide

## 🚀 Quick Start

### Start Backend
```bash
cd Backend
npm run dev
```
**Running at**: http://localhost:3000 ✅

### Start Frontend
```bash
cd Client
npm run dev
```
**Running at**: http://localhost:5173 ✅

---

## 👥 User Roles & Access

| Role | Access URL | Capabilities |
|------|-----------|--------------|
| **DONOR** | `/donor/*` | View requests, book appointments, donation history |
| **ORGANIZATION** | `/org/*` | Manage inventory, create requests, schedule appointments |
| **ADMIN** | `/admin/*` | Approve users, manage system, view analytics |

---

## 🗂️ Project Stats

| Category | Count |
|----------|-------|
| **Backend Routes** | 8 routers |
| **Database Collections** | 8 models |
| **Frontend Components** | 68+ components |
| **API Endpoints** | 50+ endpoints |
| **Lines of Code** | ~15,000+ |

---

## 📊 Database Collections

```
Users (all roles)
├── Donors → bloodGroup, lastDonationDate, eligible
├── Organizations → organizationType, licenseNo, inventorySummary
└── Admins → system administrators

Requests → Blood requests from hospitals
BloodUnits → Blood bank inventory
Appointments → Donor-Organization meetings
Camps → Donation events
Notifications → In-app alerts
ProfileUpdate → Pending profile changes
AuditLog → Admin action history
```

---

## 🔐 Authentication Flow

```
1. Signup → Status: PENDING
2. Admin Approves → Status: APPROVED
3. Login → JWT Token (24h) + Refresh Token (7d)
4. Access Dashboard → Role-based routing
```

---

## 🌐 API Route Structure

```
/api
├── /login, /signup, /refresh          # Auth
├── /donor/*                           # Donor endpoints
│   ├── /requests/nearby               # Geospatial search
│   ├── /appointments                  # Schedule
│   └── /history                       # Past donations
├── /org/*                             # Organization endpoints
│   ├── /inventory                     # Blood units
│   ├── /requests                      # Create/manage requests
│   └── /dashboard                     # KPIs
├── /admin/*                           # Admin endpoints
│   ├── /users/pending-verification    # Approval queue
│   ├── /stats                         # Global metrics
│   └── /broadcast                     # Notifications
└── /geo/*                             # Location services
```

---

## 🎨 Component Structure

```
Client/src/component/
├── Homepage/              # Landing page (9 files)
├── Loginsignup/           # Auth UI (8 files)
├── DonorDashboard/        # Donor portal (18 files)
│   ├── Donor.jsx          # Main layout
│   ├── NearbyRequests.jsx # Request list
│   ├── Appointments.jsx   # Bookings
│   └── ProfilePage.jsx    # User profile
├── Orgdashboard/          # Org portal (14 files)
│   ├── Org.jsx            # Main layout
│   ├── InventoryView.jsx  # Blood units
│   ├── RequestsView.jsx   # Request management
│   └── AppointmentsTab.jsx # Donor schedule
└── Admindashboard/        # Admin portal (15 files)
    ├── Admin.jsx          # Main layout
    ├── AdminDashboard.jsx # Core admin UI (79KB!)
    ├── PendingQueue.jsx   # Verification queue
    └── StatsView.jsx      # Analytics
```

---

## 💾 Key MongoDB Indexes

| Collection | Index Type | Purpose |
|------------|-----------|---------|
| Users | `2dsphere` on `locationGeo` | Geospatial donor search |
| Users | `unique` on `Email` | Prevent duplicates |
| Requests | `2dsphere` on `locationGeo` | Find nearby requests |
| Requests | Compound: `status + createdAt` | Query optimization |
| BloodUnits | `expiryDate` | Track expiring units |

---

## 🎯 Blood Request Lifecycle

```
OPEN → Hospital creates urgent request
  ↓
ASSIGNED → Donor marked interested, organization assigns
  ↓
FULFILLED → Donation successful
  ↓
(Update donor lastDonationDate, eligible = false for 90 days)
```

---

## 📦 npm Scripts

### Backend
```bash
npm start       # Production server
npm run dev     # Development with --watch
```

### Frontend
```bash
npm run dev     # Vite dev server
npm run build   # Production build
npm run preview # Preview production build
npm run lint    # ESLint
```

---

## 🔧 Environment Setup

### Backend `.env`
```env
MONGODB_URI=mongodb://localhost:27017/liforce
JWT_SECRET=your-secret-key
PORT=3000
CORS_ORIGIN=http://localhost:5173
```

### Frontend `.env`
```env
VITE_API_BASE_URL=http://localhost:3000
```

---

## 📱 Test Accounts (After Admin Approval)

| Role | Email | Password | Status |
|------|-------|----------|--------|
| Donor | donor@test.com | (set by you) | Must be APPROVED by admin |
| Hospital | hospital@test.com | (set by you) | Must be APPROVED by admin |
| Blood Bank | bank@test.com | (set by you) | Must be APPROVED by admin |
| Admin | admin@test.com | (set by you) | Pre-approved |

---

## 🛠️ Debugging Tools

```bash
# Backend
node debug_indexes.js          # Check database indexes
node test_endpoints.js         # Test API endpoints
node seed_requests.js          # Add sample data
node fix_eligibility.js        # Fix donor eligibility

# Frontend
Client/test_signup.js          # Test signup flow
```

---

## 📈 Key Features

### ✅ Completed
- [x] Full MERN stack implementation
- [x] 3 distinct dashboards (Donor/Org/Admin)
- [x] Geospatial donor-request matching
- [x] JWT authentication with refresh
- [x] Blood inventory management
- [x] Appointment scheduling
- [x] Admin approval workflows
- [x] Real-time notifications
- [x] PDF report generation
- [x] Interactive maps
- [x] Analytics & charts
- [x] Audit logging

---

## 📂 Important Files

### Most Complex Files
1. `Backend/Router/admin.js` - 1071 lines (31KB)
2. `Client/src/component/Admindashboard/AdminDashboard.jsx` - 79KB
3. `Backend/Router/org.js` - 614 lines (21KB)
4. `Backend/modules/User.js` - Most complex schema

### Entry Points
- Backend: `Backend/server.js`
- Frontend: `Client/src/main.jsx`
- Routes: `Client/src/component/AppRoutes/AppRoutes.jsx`

---

## 🎓 Technologies Used

**Backend**: Express, MongoDB, Mongoose, JWT, bcrypt, Nodemailer, Helmet, CORS
**Frontend**: React 18, Vite, Tailwind CSS, Axios, React Router, Recharts, Leaflet, Sonner
**Dev Tools**: ESLint, Autoprefixer, PostCSS

---

## 🔗 Useful Commands

```bash
# Check MongoDB connection
mongosh mongodb://localhost:27017/liforce

# View all users
db.users.find()

# Check pending verifications
db.users.find({verificationStatus: "PENDING"})

# View all blood requests
db.requests.find()

# Check blood inventory
db.bloodunits.find()
```

---

## 📞 Port Configuration

| Service | Port | URL |
|---------|------|-----|
| Backend API | 3000 | http://localhost:3000 |
| Frontend Dev | 5173 | http://localhost:5173 |
| MongoDB | 27017 | mongodb://localhost:27017 |

---

**Status**: ✅ Both servers running  
**Last Checked**: 2025-12-14 23:06  
**Documentation**: See `PROJECT_OVERVIEW.md` for detailed information
