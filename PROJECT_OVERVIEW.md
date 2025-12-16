# 🩸 LiForce - Blood Donation Management Platform

## PROJECT OVERVIEW

**LiForce** is a comprehensive blood donation management platform built with the MERN stack (MongoDB, Express, React, Node.js). The system connects donors, hospitals, blood banks, and administrators to facilitate efficient blood donation management and emergency blood requests.

---

## 📂 PROJECT STRUCTURE

```
ProjectBlood/
├── Backend/                    # Node.js + Express API Server
│   ├── config/                 # Configuration files
│   │   ├── constants.js        # Constants (ROLES, STATUS, etc.)
│   │   ├── db.js              # MongoDB connection
│   │   └── env.js             # Environment variables
│   ├── Middleware/            # Authentication & validation
│   │   ├── auth.js            # JWT authentication
│   │   ├── orgAuth.js         # Organization-specific auth
│   │   └── validate.js        # Input validation
│   ├── modules/               # MongoDB schemas (12 models)
│   │   ├── User.js            # User accounts (donor/org/admin)
│   │   ├── Request.js         # Blood requests
│   │   ├── BloodUnit.js       # Blood inventory
│   │   ├── Appointment.js     # Donor appointments
│   │   ├── Camp.js            # Donation camps
│   │   ├── Notification.js    # In-app notifications
│   │   ├── AuditLog.js        # Admin audit logs
│   │   └── ProfileUpdate.js   # Profile change requests
│   ├── Router/                # API routes (8 routers)
│   │   ├── auth.js            # Login/signup/refresh
│   │   ├── donor.js           # Donor endpoints
│   │   ├── org.js             # Organization endpoints
│   │   ├── admin.js           # Admin endpoints
│   │   ├── geo.js             # Geospatial queries
│   │   ├── notification.js    # Notifications
│   │   └── forgetpassword.js  # Password reset
│   ├── utils/                 # Helper functions
│   └── server.js              # Express app entry point
│
├── Client/                    # React + Vite frontend
│   ├── src/
│   │   ├── api/               # API client services
│   │   │   ├── client.js      # Axios instance with interceptors
│   │   │   ├── authApi.js     # Auth API calls
│   │   │   ├── donorApi.js    # Donor API calls
│   │   │   ├── orgApi.js      # Org API calls
│   │   │   └── adminApi.js    # Admin API calls
│   │   ├── component/         # React components (68 files)
│   │   │   ├── AppRoutes/     # Routing + protected routes
│   │   │   ├── Homepage/      # Landing page (9 components)
│   │   │   ├── Loginsignup/   # Auth UI (8 components)
│   │   │   ├── DonorDashboard/    # Donor portal (18 components)
│   │   │   ├── Orgdashboard/      # Org portal (14 components)
│   │   │   ├── Admindashboard/    # Admin portal (15 components)
│   │   │   └── common/            # Shared UI components
│   │   ├── context/           # React context
│   │   │   ├── AuthContext.jsx      # Auth state management
│   │   │   └── DashboardContext.jsx # Dashboard state
│   │   ├── index.css          # Global styles (Tailwind)
│   │   ├── main.jsx           # React entry point
│   │   └── App.jsx            # Root component
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── LiForce_Master_Plan.md    # Comprehensive project spec
└── package.json               # Root package config
```

---

## 🔐 USER ROLES & PERMISSIONS

### 1. **DONOR** (Blood Donors)
- View nearby blood requests (geospatial matching)
- Mark interest in requests
- Book and manage appointments
- View donation history & stats
- Update profile (requires admin approval)
- Eligibility tracking (90-day rule)

### 2. **ORGANIZATION** (Hospitals & Blood Banks)
Organizations have a **merged role** that supports:
- **Hospital Functions**:
  - Create urgent blood requests
  - View nearby donors
  - Assign donors to requests
  - Manage appointments
- **Blood Bank Functions**:
  - Manage blood inventory (units)
  - Track expiring units
  - Respond to incoming requests from hospitals
  - Reserve units for requests
- **Both Can**:
  - Organize donation camps
  - View analytics & reports

### 3. **ADMIN** (System Administrators)
- Verify/approve/reject user registrations
- Block/unblock users
- Approve profile update requests
- View global statistics & alerts
- Manage audit logs
- Broadcast notifications
- View stock levels across all blood banks

---

## 💾 DATABASE SCHEMA

### Collections Overview (MongoDB)

1. **Users** - All user accounts (donors, organizations, admins)
   - Geospatial location (`2dsphere` index)
   - Verification status (PENDING/APPROVED/REJECTED)
   - Role-specific fields (bloodGroup, organizationType, etc.)
   - Eligibility tracking for donors

2. **Requests** - Blood requests from hospitals
   - Geospatial location
   - Status lifecycle (OPEN → ASSIGNED → FULFILLED)
   - Urgency levels (LOW/MEDIUM/HIGH/CRITICAL)
   - Interested donors tracking

3. **BloodUnits** - Blood bank inventory
   - Blood group & component type
   - Expiry date tracking
   - Status (AVAILABLE/RESERVED/ISSUED/EXPIRED)
   - Organization ID linkage

4. **Appointments** - Donor appointment scheduling
   - Donor-Organization linkage
   - Status (UPCOMING/COMPLETED/CANCELLED)
   - Donation outcome tracking

5. **Camps** - Donation camp events
   - Location & capacity
   - Registered donors list
   - Status (PLANNED/COMPLETED)

6. **Notifications** - In-app notifications
7. **ProfileUpdate** - Profile change approval queue
8. **AuditLog** - Admin action tracking

---

## 🌐 BACKEND API ENDPOINTS

### Auth Routes (`/api`)
- `POST /login` - User authentication
- `POST /signup` - User registration (status = PENDING)
- `POST /refresh` - JWT token refresh
- `POST /forgot-password` - Password reset initiation
- `POST /reset-password` - Password reset completion
- `GET /me` - Get current user profile

### Donor Routes (`/api/donor`)
- `GET /requests/nearby` - Get nearby blood requests (geospatial)
- `POST /requests/:id/interest` - Mark interest in request
- `GET /appointments` - Get donor appointments
- `POST /appointments` - Book appointment
- `GET /history` - Donation history
- `GET /profile` - Get donor profile
- `PUT /profile` - Update profile
- `POST /profile-update` - Request profile change (requires admin approval)
- `GET /stats` - Donation statistics
- `GET /me` - Full profile with eligibility status

### Organization Routes (`/api/org`)
- `GET /dashboard` - Comprehensive dashboard data
- `GET /inventory` - Get blood units inventory
- `POST /inventory` - Add blood unit
- `GET /inventory/expiring` - Get expiring units
- `POST /requests` - Create blood request (hospitals)
- `GET /requests` - View own requests
- `PUT /requests/:id/status` - Update request status
- `PUT /requests/:id/fulfill` - Mark request fulfilled
- `GET /requests/:id/matches` - Find donor matches
- `POST /requests/:id/assign-donor` - Assign donor
- `GET /requests/incoming` - Incoming matches (blood banks)
- `POST /requests/:id/reserve` - Reserve units for request
- `POST /camps` - Create donation camp
- `GET /stats` - Organization statistics

### Admin Routes (`/api/admin`)
- `GET /users` - List all users (with filters)
- `GET /users/pending-verification` - Pending approvals queue
- `PUT /users/:id/verify` - Approve/reject user
- `PUT /users/:id/block` - Block/unblock user
- `GET /stats` - Global statistics
- `GET /alerts` - System alerts
- `GET /logs` - Audit logs
- `POST /broadcast` - Send notifications
- `GET /profile-updates` - Pending profile changes
- `PUT /profile-updates/:id/action` - Approve/reject profile change
- `GET /stock` - Blood stock summary
- `GET /monthly-donations` - Monthly donation data
- `GET /donation-pipeline` - Kanban-style pipeline view

### Geospatial Routes (`/api/geo`)
- `GET /nearby-donors` - Find eligible donors within radius
- `GET /nearby-organizations` - Find nearby blood banks/hospitals

### Notification Routes (`/api/notifications`)
- `GET /` - Get user notifications
- `PUT /:id/read` - Mark notification as read

---

## 🎨 FRONTEND ARCHITECTURE

### Tech Stack
- **React 18** (with Hooks)
- **Vite** (build tool)
- **React Router DOM** (routing)
- **Tailwind CSS** (styling)
- **Axios** (API client)
- **Context API** (state management)
- **Lucide React** (icons)
- **Recharts** (charts)
- **React Leaflet** (maps)
- **Sonner** (toast notifications)
- **jsPDF** (PDF generation)

### Key Pages & Components

#### **Homepage** (Landing Page)
- Hero section
- Features showcase
- How it works
- Statistics
- Success stories
- Call-to-action
- Footer

#### **Auth Pages**
- Login (role-based routing)
- Signup (with verification flow)
- Forgot Password

#### **Donor Dashboard** (`/donor/*`)
- **Home**: Welcome card, stats, quick actions
- **Nearby Requests**: Geospatial request list with filters
- **Appointments**: Upcoming & past appointments
- **History**: Donation history with analytics
- **Profile**: View/edit profile
- **Settings**: Notification preferences
- **Map Widget**: Visual map of requests/banks
- **Notification Dropdown**: Real-time alerts

#### **Organization Dashboard** (`/org/*`)
- **Overview**: KPI cards, today's appointments, alerts
- **Inventory**: Blood unit management (add/view/expire)
- **Requests**: Create & manage blood requests
- **Incoming**: Matches from hospitals (for blood banks)
- **Appointments**: Donor schedule management
- **Camps**: Donation camp organization
- **Analytics**: Charts & reports
- **Profile**: Organization details

#### **Admin Dashboard** (`/admin/*`)
- **Overview**: Global statistics
- **Users Table**: User management
- **Pending Queue**: Verification approvals
- **Profile Updates**: Profile change approvals
- **Alerts View**: Critical system alerts
- **Stock View**: Blood stock across all banks
- **Reports**: Comprehensive analytics
- **Broadcast**: Send mass notifications
- **Audit Logs**: Admin action history
- **Kanban View**: Request pipeline visualization

---

## 🔑 KEY FEATURES

### 1. **Geospatial Matching**
- MongoDB `2dsphere` indexes on User & Request collections
- Distance-based donor-request matching
- Location filtering within X kilometers
- Real-time proximity calculations

### 2. **Eligibility System**
- 90-day waiting period after donation
- Automatic eligibility calculation
- Visual eligibility status in UI
- Next eligible date display

### 3. **Verification Workflow**
1. User signs up → Status = PENDING
2. Admin reviews → APPROVED/REJECTED
3. Only approved users can access dashboards
4. Profile changes also require admin approval

### 4. **Request Lifecycle**
```
OPEN → ASSIGNED → FULFILLED/CANCELLED
```
- Open: Newly created request
- Assigned: Donor assigned by organization
- Fulfilled: Blood provided
- Cancelled: Request cancelled

### 5. **Inventory Management**
- Blood unit tracking with barcodes
- Expiry date monitoring
- 7-day expiry warnings
- Unit status (AVAILABLE/RESERVED/ISSUED/EXPIRED)
- Auto-matching to incoming requests

### 6. **Authentication & Security**
- JWT-based authentication
- Access + Refresh token strategy
- Automatic token refresh on 401
- Role-based access control (RBAC)
- Password hashing (bcrypt)
- Rate limiting on auth endpoints
- Helmet & CORS security

### 7. **Notifications**
- In-app notifications
- Email notifications (configured)
- Broadcast messaging (admin)
- Role/group targeting
- Read/unread tracking

### 8. **Audit Logging**
- All admin actions logged
- Target user/entity tracking
- Action details & timestamps
- Queryable log history

---

## 🚀 GETTING STARTED

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)
- npm/yarn

### Installation Steps

#### 1. Backend Setup
```bash
cd Backend
npm install
```

Edit `.env`:
```
MONGODB_URI=mongodb://localhost:27017/liforce
JWT_SECRET=your-secret-key
PORT=3000
CORS_ORIGIN=http://localhost:5173
```

Run server:
```bash
npm run dev  # Development with auto-reload
# OR
npm start    # Production
```

Server runs at: `http://localhost:3000`

#### 2. Frontend Setup
```bash
cd Client
npm install
```

Create `.env` (if needed):
```
VITE_API_BASE_URL=http://localhost:3000
```

Run dev server:
```bash
npm run dev
```

App runs at: `http://localhost:5173`

---

## 🔧 ENVIRONMENT VARIABLES

### Backend (.env)
```
MONGODB_URI=mongodb://localhost:27017/liforce
JWT_SECRET=your-jwt-secret
JWT_REFRESH_SECRET=your-refresh-secret
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d
SESSION_SECRET=your-session-secret
CORS_ORIGIN=http://localhost:5173
PORT=3000
NODE_ENV=development

# Email configuration (for notifications)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=noreply@blooddonation.com
FRONTEND_URL=http://localhost:5173

# Rate limiting
RATE_LIMIT_WINDOW_MS=900000  # 15 minutes
RATE_LIMIT_MAX=100
```

### Frontend (.env)
```
VITE_API_BASE_URL=http://localhost:3000
```

---

## 📊 WORKFLOW EXAMPLES

### Donor Journey
1. **Signup** → Status: PENDING
2. **Admin Approves** → Status: APPROVED
3. **Login** → Redirected to donor dashboard
4. **View Nearby Requests** → Filtered by blood group, distance, urgency
5. **Mark Interest** → Organization notified
6. **Organization Assigns** → Appointment created
7. **Donate** → Appointment marked COMPLETED
8. **Last Donation Date Updated** → Eligible = false for 90 days
9. **After 90 days** → Eligible = true, can donate again

### Hospital Emergency Request
1. **Create CRITICAL Request** → Status: OPEN
2. **System Notifies Nearby Donors** (via notifications/email)
3. **Donors Mark Interest** → Added to interestedDonors array
4. **Hospital Reviews & Assigns Best Match** → Status: ASSIGNED
5. **Appointment Created** → Donor receives confirmation
6. **Donation Completed** → Status: FULFILLED
7. **Last Donation Date Updated** for donor

### Blood Bank Inventory Flow
1. **Add Blood Units** → Status: AVAILABLE
2. **System Tracks Expiry** → Alert if < 7 days
3. **Incoming Hospital Request** → Blood bank sees match
4. **Reserve Units** → Status: RESERVED
5. **Fulfill Request** → Status: ISSUED
6. **Hospital Receives Blood**

---

## 🎯 CURRENT STATUS

### ✅ Completed Features
- [x] Authentication system (login/signup/refresh)
- [x] All database schemas with proper indexes
- [x] Complete REST API (donor/org/admin routes)
- [x] Geospatial donor-request matching
- [x] Donor dashboard (full UI + backend integration)
- [x] Organization dashboard (full UI + backend integration)
- [x] Admin dashboard (full UI + backend integration)
- [x] Profile update approval workflow
- [x] Appointment management
- [x] Blood inventory management
- [x] Request lifecycle management
- [x] Notification system
- [x] Audit logging
- [x] Landing page
- [x] Role-based routing & protected routes
- [x] JWT authentication with refresh tokens
- [x] Eligibility checking system
- [x] Analytics & reporting
- [x] PDF export functionality
- [x] Map integration
- [x] Notification dropdown

### 🔄 Currently Running
- Backend server: `http://localhost:3000`
- Frontend dev server: `http://localhost:5173`
- MongoDB connection: `mongodb://localhost:27017/`

---

## 🛠️ TECH STACK SUMMARY

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB + Mongoose ODM
- **Auth**: JWT (jsonwebtoken)
- **Security**: Helmet, CORS, bcryptjs, rate limiting
- **Email**: Nodemailer
- **Session**: express-session

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS 4
- **HTTP Client**: Axios
- **Routing**: React Router DOM v7
- **State**: Context API
- **Charts**: Recharts
- **Maps**: Leaflet + React Leaflet
- **Icons**: Lucide React
- **Notifications**: Sonner
- **PDF**: jsPDF + jsPDF-AutoTable
- **Drag & Drop**: @hello-pangea/dnd
- **Dates**: date-fns

---

## 📁 KEY FILES TO KNOW

### Backend
- `server.js` - Express app entry, middleware setup
- `config/constants.js` - All constants (roles, status enums)
- `modules/User.js` - User schema (most complex)
- `Router/donor.js` - Donor API endpoints
- `Router/org.js` - Organization API endpoints
- `Router/admin.js` - Admin API endpoints (largest file)
- `Middleware/auth.js` - JWT authentication middleware

### Frontend
- `src/App.jsx` - Root component
- `src/component/AppRoutes/AppRoutes.jsx` - Route definitions
- `src/context/AuthContext.jsx` - Authentication state
- `src/api/client.js` - Axios instance with interceptors
- `src/component/DonorDashboard/Donor.jsx` - Donor layout
- `src/component/Orgdashboard/Org.jsx` - Org layout
- `src/component/Admindashboard/Admin.jsx` - Admin layout
- `src/component/Admindashboard/AdminDashboard.jsx` - Main admin component (largest file: ~80KB)

---

## 🐛 KNOWN DEBUG FILES
The project includes several debug/utility scripts:
- `Backend/debug_indexes.js` - Check MongoDB indexes
- `Backend/debug_donor_requests.js` - Test donor queries
- `Backend/fix_eligibility.js` - Fix donor eligibility
- `Backend/seed_requests.js` - Seed sample requests
- `Backend/test_endpoints.js` - Test API endpoints
- `Client/test_signup.js` - Test signup flow

---

## 📝 NOTES

1. **Role Normalization**: The system supports both old role names (donor/hospital/bloodbank) and new standardized roles (DONOR/ORGANIZATION/ADMIN) via normalization in AuthContext.

2. **Organization Type**: Organizations have a `organizationType` field:
   - `HOSPITAL` - Can create requests only
   - `BANK` - Can manage inventory only
   - `BOTH` - Full access to both features

3. **Geospatial Queries**: 
   - All location coordinates are stored as `[longitude, latitude]` (GeoJSON format)
   - 2dsphere indexes enable `$near` queries
   - Distance is calculated in meters

4. **Eligibility Logic**: 
   - Donors must wait 90 days between donations
   - Calculated from `lastDonationDate`
   - Helper function: `utils/eligibility.js`

5. **Profile Updates**: 
   - Donors cannot directly modify sensitive fields
   - Must submit `ProfileUpdate` request
   - Admin approves/rejects via admin dashboard

---

## 📞 PROJECT CONTACTS

This appears to be a student/learning project based on the directory structure and naming conventions.

---

## 🎓 LEARNING RESOURCES

This project demonstrates:
- Full-stack MERN development
- RESTful API design
- JWT authentication
- MongoDB geospatial queries
- Role-based access control
- React Context API
- Protected routes
- File upload handling
- PDF generation
- Real-time notifications
- Admin approval workflows
- Inventory management
- Appointment scheduling

---

**Last Updated**: 2025-12-14
**Project Name**: LiForce (Blood Donation Management Platform)
**Stack**: MERN (MongoDB, Express, React, Node.js)
**Status**: ✅ Fully functional, both servers running
