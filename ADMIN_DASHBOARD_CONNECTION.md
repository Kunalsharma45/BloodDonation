# ✅ Admin Dashboard Backend Connection - Complete Guide

## Current Status

Your admin dashboard is **ALREADY CONNECTED** to the backend! Here's what's in place:

### ✅ What's Working

1. **DashboardContext** (`Client/src/context/DashboardContext.jsx`)
   - Fetches all dashboard data on mount
   - Uses adminApi for all backend calls
   - Auto-refreshes data

2. **AdminApi** (`Client/src/api/adminApi.js`)
   - All endpoints properly defined
   - Uses authenticated client
   - Error handling in place

3. **Backend Routes** (`Backend/Router/admin.js`)
   - All APIs implemented
   - Returns correct data format
   - Proper authentication

---

## 📊 Data Flow

```
AdminDashboard Component
    ↓
Uses DashboardContext
    ↓
fetchDashboardData() called on mount
    ↓
Calls multiple adminApi methods:
    ├─ getStock() → /api/admin/stock
    ├─ getMonthlyDonations() → /api/admin/monthly-donations
    ├─ getDonationPipeline() → /api/admin/donation-pipeline
    ├─ getUsers() → /api/admin/users
    ├─ getAppointments() → /api/admin/appointments
    └─ getRequests() → /api/admin/requests
    ↓
Backend returns data
    ↓
State updated in context
    ↓
AdminDashboard re-renders with real data
```

---

## 🔧 How It Works

### 1. Stock Data
```javascript
// API: GET /api/admin/stock
// Returns: { "O+": { units: 320, reserved: 10 }, ... }
const stockData = await adminApi.getStock();
setStock(stockData);
```

### 2. Monthly Donations
```javascript
// API: GET /api/admin/monthly-donations
// Returns: [20, 18, 22, ...] (12 months)
const donationsData = await adminApi.getMonthlyDonations();
setMonthlyDonations(donationsData);
```

### 3. Donation Pipeline
```javascript
// API: GET /api/admin/donation-pipeline
// Returns Kanban columns with donation stages
const pipelineData = await adminApi.getDonationPipeline();
setDonationColumns(pipelineData);
```

### 4. Users
```javascript
// API: GET /api/admin/users
// Maps backend user data to frontend format
const usersData = await adminApi.getUsers({ limit: 100 });
setUsers(mapped data);
```

### 5. Appointments
```javascript
// API: GET /api/admin/appointments
// Transforms backend appointment format
const appointmentsData = await adminApi.getAppointments();
setAppointments(mapped data);
```

### 6. Requests
```javascript
// API: GET /api/admin/requests
// Converts request statuses
const requestsData = await adminApi.getRequests();
setRequests(mapped data);
```

---

## 🐛 Troubleshooting

If you're seeing mock/default data instead of real data from the backend, check:

### 1. **Backend Running?**
```bash
# Check if backend is running on port 3000
curl http://localhost:3000/api/admin/summary
```

### 2. **Authentication**
- Make sure you're logged in as admin
- Check browser console for any 401/403 errors
- JWT token should be in localStorage

### 3. **CORS Issues**
- Check backend `.env` file: `CORS_ORIGIN=http://localhost:5173`
- Check browser console for CORS errors

### 4. **API Errors**
Open browser DevTools Console and check for errors like:
- "Failed to fetch stock"
- "Failed to fetch monthly donations"
- Network errors

### 5. **MongoDB**
- Ensure MongoDB is running
- Check if collections have data
- Verify database connection in backend console

---

## 🧪 Quick Test

**Method 1: Browser Console**
```javascript
// Open browser console (F12)
// Paste this:
fetch('http://localhost:3000/api/admin/summary', {
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  }
})
.then(r => r.json())
.then(console.log)
```

**Method 2: Check Network Tab**
1. Open DevTools (F12)
2. Go to Network tab
3. Filter: XHR
4. Reload page
5. Look for calls to `/api/admin/*`
6. Check if they return 200 OK with data

---

## 🔄 Manual Refresh

If data isn't loading, you can manually trigger a refresh:

**In Browser Console:**
```javascript
// Get the dashboard context
// (Accessible if you're on the admin page)
// This will re-fetch all data
window.location.reload();
```

---

## 📝 What Each Stat Shows

### Total Units
- Source: Sum of all blood group units from stock
- Updates: Real-time when stock changes

### Active Requests
- Source: Count of requests with status OPEN/ASSIGNED
- Updates: When new requests created or status changes

### Appointments Today
- Source: Count of appointments for current date
- Updates: Real-time from appointments collection

### Low Stock Alerts
- Source: Blood groups below threshold (default: 20)
- Updates: When stock falls below configured threshold

### Monthly Donations Chart
- Source: Aggregated appointments by month
- Updates: Monthly

### Blood Type Availability Chart
- Source: Current stock levels per blood group
- Updates: Real-time when donations/issues occur

### Donation Pipeline
- Source: Appointments grouped by status
- Updates: Real-time as appointments progress

---

## ✅ Verification Checklist

- [x] DashboardContext exists
- [x] fetchDashboardData implemented
- [x] adminApi methods defined
- [x] Backend routes exist
- [x] useEffect calls fetchDashboardData on mount
- [x] State updates propagate to components
- [x] Error handling in place
- [x] Authentication headers sent

---

## 🎯 Next Steps

Since everything is connected, if data isn't showing:

1. **Check backend console** - Are APIs being called?
2. **Check browser console** - Any error messages?
3. **Check Network tab** - Are requests successful?
4. **Check MongoDB** - Is there data in collections?

If you're still seeing default data, the issue is likely:
- Backend not returning data (empty collections)
- Authentication not working
- CORS blocking requests

---

## 📞 Common Issues

### Issue: "Showing default numbers"
**Solution**: Backend likely has no data. Add some test data:
- Create donors
- Create blood requests  
- Add blood inventory
- Schedule appointments

### Issue: "Charts not loading"
**Solution**: Check if monthly-donations endpoint returns array

### Issue: "Pipeline empty"
**Solution**: Create some appointments with different statuses

---

**Your dashboard IS connected!** The data you see depends on what's actually in your MongoDB database. If it's showing mock data, it means the backend is returning empty results, so the context keeps the default values.

To populate real data, start using the donor and organization features to create appointments, requests, and inventory!
