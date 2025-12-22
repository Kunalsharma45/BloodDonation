const BASE_URL = 'http://127.0.0.1:5000/api';
let authToken = '';

async function safeSignup(user) {
    try {
        const res = await fetch(`${BASE_URL}/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user)
        });
        const data = await res.json();
        if (res.ok) {
        } else {
        }
    } catch (err) {
    }
}

const tests = {
    donor: async () => {
        try {
            // 0. Ensure user exists
            await safeSignup({
                Name: "Test Donor",
                Email: "testdonor@example.com",
                Password: "password123",
                Role: "DONOR",
                Bloodgroup: "O+",
                City: "Test City",
                State: "Test State",
                Pincode: "123456"
            });

            // 1. Login
            const loginRes = await fetch(`${BASE_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    Email: 'testdonor@example.com',
                    Password: 'password123',
                    Role: 'DONOR'
                })
            });

            const loginData = await loginRes.json();
            if (!loginRes.ok) throw new Error(loginData.message || 'Login failed');

            authToken = loginData.accessToken;

            const headers = {
                'Authorization': `Bearer ${authToken}`
            };

            // 2. Get Me
            const meRes = await fetch(`${BASE_URL}/donor/me`, { headers });
            const meData = await meRes.json();

            // 3. Get Stats
            const statsRes = await fetch(`${BASE_URL}/donor/stats`, { headers });
            const statsData = await statsRes.json();

            // 4. Get Appointments
            const apptRes = await fetch(`${BASE_URL}/donor/appointments`, { headers });
            const apptData = await apptRes.json();

        } catch (err) {
            console.error('❌ Donor Test Failed:', err.message);
        }
    },

    admin: async () => {
        try {
            // 0. Ensure admin exists (Using a secret key if your signup requires it, assuming standard signup for now or manual)
            // Admin signup usually restricted. I'll assume valid credentials or try to create one if allowed endpoint exists.
            // Assuming standard signup works for ADMIN role for testing dev purposes, or fallback to existing 'admin@liforce.com'

            // Caution: Providing a known admin seed or trying to use one from previous sessions.
            // I'll try to signup a test admin.
            await safeSignup({
                Name: "Test Admin",
                Email: "testadmin@liforce.com",
                Password: "adminpassword",
                Role: "ADMIN",
                City: "Admin HQ",
                State: "Admin State",
                Pincode: "000000"
            });

            // 1. Login
            const loginRes = await fetch(`${BASE_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    Email: 'testadmin@liforce.com',
                    Password: 'adminpassword',
                    Role: 'ADMIN'
                })
            });

            const loginData = await loginRes.json();
            if (!loginRes.ok) throw new Error(loginData.message || 'Login failed');

            const token = loginData.accessToken;
            const headers = { 'Authorization': `Bearer ${token}` };

            // 2. Get Summary
            const summaryRes = await fetch(`${BASE_URL}/admin/summary`, { headers });

            // 3. Get Pending Counts
            const pendingRes = await fetch(`${BASE_URL}/admin/pending-counts`, { headers });

        } catch (err) {
            console.error('❌ Admin Test Failed:', err.message);
        }
    }
};

const run = async () => {
    const args = process.argv.slice(2);
    const suite = args[0] || 'all';

    if (suite === 'all' || suite === 'donor') await tests.donor();
    if (suite === 'all' || suite === 'admin') await tests.admin();
};

run();
