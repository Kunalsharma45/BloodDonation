# COMPREHENSIVE LIFORCE PROJECT PROMPT FOR AI

## PROJECT OVERVIEW
You are building LiForce, a web-based blood donation management platform. This is a MERN stack project (MongoDB, Express, React, Node.js) + Tailwind CSS.

**Important**: The user has already created:
- ✅ Login & Signup (both frontend UI and backend) - DO NOT CHANGE THE UI, only update backend if necessary for integration
- ✅ Donor Dashboard Frontend - You can modify/improve this as needed

**Your task**: Complete the entire project including:
- ✅ Backend (Node.js + Express)
- ✅ Database (MongoDB schemas)
- ✅ Frontend (React components)
- All three dashboards fully functional

## 1. PROJECT STRUCTURE & REQUIREMENTS

### Stack & Tools
- **Frontend**: React 18, Tailwind CSS, Axios, React Router DOM
- **Backend**: Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs
- **Database**: MongoDB (local or cloud)
- **Geospatial**: MongoDB 2dsphere indexes for location-based matching
- **State Management**: React Context API

### Three Dashboards Required
1. **Donor Dashboard** (frontend already partially created - improve as needed)
2. **Organization Dashboard** (hospital + blood bank merged)
3. **Admin Dashboard**

### User Roles (3 types)
- **DONOR**: Can view requests, mark interest, book appointments
- **ORGANIZATION**: Can manage blood inventory AND create blood requests
- **ADMIN**: Manage users, verify organizations/donors, view reports

## 2. DATABASE SCHEMA (Create These MongoDB Collections)

### Collection 1: Users
```javascript
{
  _id: ObjectId,
  role: "DONOR" | "ORGANIZATION" | "ADMIN",
  email: "unique",
  passwordHash: "bcrypt hashed",
  name: String,
  phone: String,
  city: String,
  
  // Geospatial location (IMPORTANT for donor-request matching)
  locationGeo: {
    type: "Point",
    coordinates: [longitude, latitude]
  },
  
  // Donor-specific
  bloodGroup: "O+", // Only for donors
  lastDonationDate: ISODate,
  eligible: Boolean,
  
  // Organization-specific
  organizationType: "HOSPITAL" | "BANK" | "BOTH",
  licenseNo: String,
  organizationName: String,
  
  // Verification (CRITICAL for onboarding)
  verificationStatus: "PENDING" | "APPROVED" | "REJECTED",
  verifiedBy: ObjectId,
  verifiedAt: ISODate,
  rejectionReason: String,
  
  accountStatus: "ACTIVE" | "BLOCKED",
  createdAt: ISODate,
  updatedAt: ISODate,
  lastLoginAt: ISODate
}
```
**Important Indexes:**
- `{ email: 1, unique: true }`
- `{ locationGeo: "2dsphere" }` ← Essential for geospatial queries
- `{ verificationStatus: 1, role: 1 }`

### Collection 2: Requests
```javascript
{
  _id: ObjectId,
  createdBy: ObjectId, // Organization ID
  bloodGroup: "O+",
  component: "WB",
  units: 3,
  urgency: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
  
  // Location (geospatial)
  locationGeo: {
    type: "Point",
    coordinates: [longitude, latitude]
  },
  
  // Status lifecycle
  status: "OPEN" | "ASSIGNED" | "FULFILLED" | "CANCELLED",
  assignedTo: ObjectId, // Donor or Organization ID
  
  // Tracking
  interestedDonors: [ObjectId, ObjectId, ...],
  caseId: String,
  notes: String,
  createdAt: ISODate,
  updatedAt: ISODate,
  fulfilledAt: ISODate
}
```
**Important Indexes:**
- `{ locationGeo: "2dsphere" }`
- `{ status: 1, createdAt: -1 }`
- `{ bloodGroup: 1, status: 1 }`

### Collection 3: BloodUnits
```javascript
{
  _id: ObjectId,
  organizationId: ObjectId,
  bloodGroup: "O+",
  component: "WB",
  collectionDate: ISODate,
  expiryDate: ISODate,
  status: "AVAILABLE" | "RESERVED" | "ISSUED" | "EXPIRED",
  barcode: String,
  createdAt: ISODate
}
```
**Important Indexes:**
- `{ organizationId: 1, status: 1 }`
- `{ expiryDate: 1 }`

### Collection 4: Appointments
```javascript
{
  _id: ObjectId,
  donorId: ObjectId,
  organizationId: ObjectId,
  requestId: ObjectId, // Optional
  dateTime: ISODate,
  status: "UPCOMING" | "COMPLETED" | "CANCELLED",
  unitsCollected: Number,
  donationSuccessful: Boolean,
  createdAt: ISODate
}
```

### Collection 5: Camps
```javascript
{
  _id: ObjectId,
  organizationId: ObjectId,
  title: String,
  date: ISODate,
  location: {
    coordinates: { type: "Point", coordinates: [lng, lat] },
    address: String
  },
  capacity: Number,
  registeredDonors: [ObjectId, ...],
  status: "PLANNED" | "COMPLETED",
  createdAt: ISODate
}
```

## 3. BACKEND API ENDPOINTS (Create These)

### Auth Routes (Already created, but integrate if needed)
- `POST /auth/register` - Create account (status = PENDING)
- `POST /auth/login` - Login, return JWT token
- `POST /auth/refresh` - Refresh JWT token

### Donor Routes (Build these)
- `GET /api/donor/requests/nearby?lat=...&lng=...` → Returns nearby blood requests
- `POST /api/donor/requests/:id/interest` → Donor marks interest
- `GET /api/donor/appointments` → Get appointments
- `POST /api/donor/appointments` → Book appointment
- `GET /api/donor/history` → Donation history
- `GET /api/donor/profile` → Get profile
- `PUT /api/donor/profile` → Update profile

### Organization Routes (Build these)
- `GET /api/org/inventory` → Get blood units
- `POST /api/org/inventory` → Add blood unit
- `GET /api/org/inventory/expiring` → Get expiring units
- `GET /api/org/requests/incoming` → Incoming matches
- `POST /api/org/requests` → Create blood request
- `GET /api/org/requests` → View own requests
- `PUT /api/org/requests/:id/status` → Update status
- `GET /api/org/requests/:id/matches` → Find matches
- `POST /api/org/requests/:id/assign-donor` → Assign donor
- `POST /api/org/camps` → Create camp
- `GET /api/org/stats` → Get stats

### Admin Routes (Build these)
- `GET /api/admin/users` → List users
- `GET /api/admin/users/pending-verification` → Pending verifications
- `PUT /api/admin/users/:id/verify` → Approve/Reject
- `PUT /api/admin/users/:id/block` → Block user
- `GET /api/admin/stats` → Global stats
- `GET /api/admin/alerts` → System alerts
- `GET /api/admin/logs` → Audit logs
- `POST /api/admin/broadcast` → Send notifications

### Geospatial Routes (Build these)
- `GET /api/geo/nearby-donors` → Find nearby eligible donors
- `GET /api/geo/nearby-organizations` → Find nearby orgs
- `POST /api/geo/location-update` → Update location

## 4. FRONTEND PAGES & COMPONENTS

### Already Created (DO NOT CHANGE UI)
- ✅ Login page
- ✅ Signup page

### Donor Dashboard (Can improve/modify)
- **StatusCard**: Eligibility, last donation
- **QuickFilters**: Filter by group, urgency, distance
- **NearbyRequestsList**: Cards with "I can donate" button
- **RequestDetailsModal**: Full details
- **MapSection**: Pins for requests/banks
- **AppointmentsList**: Upcoming schedule
- **DonationHistory**: Past stats

### Organization Dashboard (Build complete)
- **InventoryTab**: Manage blood units
- **RequestsTab**: Create/view requests
- **IncomingRequestsTab**: Matches for inventory
- **AppointmentsTab**: Donor schedule
- **CampsTab**: Manage camps
- **MatchesModal**: Find donors for requests
- **StatsCards**: KPI summary

### Admin Dashboard (Build complete)
- **UsersTable**: Manage all users
- **PendingVerificationTab**: Verification queue
- **UserDetailsModal**: Approve/Reject actions
- **AlertsSection**: Critical system alerts
- **StatsCards**: Global metrics
- **ChartsSection**: Analytics

## 5. KEY WORKFLOWS TO IMPLEMENT

### Workflow 1: Donor Signup → Approval → See Requests
1. Signup (Status = PENDING)
2. Admin approves (Status = APPROVED)
3. Donor sees nearby requests
4. Donor marks interest → Organization assigns → Appointment created
5. Donation completed → LastDonationDate updated → Eligibility reset (90 days)

### Workflow 2: Emergency Blood Request
1. Organization creates CRITICAL request
2. System broadcasts to nearby donors (email/SMS/app)
3. Donors mark interest
4. Organization assigns best match
5. Fulfillment

### Workflow 3: Blood Bank Inventory
1. Add new units
2. Track expiry (7 day warning)
3. Match inventory to incoming hospital requests

## 6. CRITICAL FEATURES
- **Geospatial Matching**: Use MongoDB `2dsphere` to find donors/requests within X km.
- **Eligibility Checking**: Enforce 90-day donation rule.
- **Real-time Updates**: Instant status changes across dashboards.
- **JWT Authentication**: Secure role-based access.

## 7. STARTING INSTRUCTIONS
1. Create MongoDB Schemas (User, Request, BloodUnit, Appointment, Camp).
2. Set up Express routes for all endpoints.
3. Build the missing dashboards (Org, Admin).
4. Integrate frontend with backend.
5. Test all workflows end-to-end.
